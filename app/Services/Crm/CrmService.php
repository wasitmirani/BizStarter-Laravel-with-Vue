<?php

namespace App\Services\Crm;

use App\Models\CrmCampaign;
use App\Models\CrmContact;
use App\Models\CrmConversation;
use App\Models\CrmMessage;
use App\Models\CrmTemplate;
use App\Models\User;
use App\Models\WhatsAppAccount;
use App\Models\Workspace;
use App\Services\WhatsApp\WhatsAppCloudApi;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class CrmService
{
    public function __construct(private readonly WhatsAppCloudApi $api)
    {
    }

    public function account(Workspace $workspace): WhatsAppAccount
    {
        return $workspace->whatsappAccount()->firstOrCreate([], [
            'name' => $workspace->name . ' WhatsApp',
            'api_version' => config('services.whatsapp.api_version', 'v21.0'),
            'verify_token' => Str::random(32),
            'is_active' => true,
        ]);
    }

    /**
     * Find a contact by phone or create one, then open its conversation.
     */
    public function contactFor(Workspace $workspace, string $phone, ?string $name = null, string $source = 'whatsapp'): CrmContact
    {
        $normalized = CrmContact::normalizePhone($phone);

        $contact = $workspace->contacts()->where('phone', $normalized)->first();

        if ($contact) {
            if ($name && $contact->name !== $name) {
                $contact->update(['name' => $name]);
            }

            return $contact;
        }

        return $workspace->contacts()->create([
            'name' => $name ?: '+' . $normalized,
            'phone' => $normalized,
            'source' => $source,
            'status' => 'lead',
            'opt_in' => true,
        ]);
    }

    public function conversationFor(Workspace $workspace, CrmContact $contact, ?WhatsAppAccount $account = null): CrmConversation
    {
        return CrmConversation::firstOrCreate(
            ['workspace_id' => $workspace->id, 'contact_id' => $contact->id],
            [
                'whatsapp_account_id' => $account?->id ?? $workspace->whatsappAccount?->id,
                'status' => CrmConversation::STATUS_OPEN,
                'priority' => 'normal',
                'unread_count' => 0,
            ]
        );
    }

    /**
     * Store an inbound webhook message idempotently.
     *
     * @param  array<string, mixed>  $value
     * @param  array<string, mixed>  $message
     * @param  array<string, mixed>  $profileContact
     */
    public function receive(WhatsAppAccount $account, array $value, array $message, array $profileContact = []): ?CrmMessage
    {
        $workspace = $account->workspace;

        if (! $workspace) {
            return null;
        }

        $waId = (string) ($message['id'] ?? '');

        if ($waId !== '' && CrmMessage::where('workspace_id', $workspace->id)->where('wa_message_id', $waId)->exists()) {
            return null;
        }

        $from = (string) ($message['from'] ?? '');
        $name = $profileContact['profile']['name'] ?? null;

        if ($from === '') {
            return null;
        }

        $contact = $this->contactFor($workspace, $from, $name);
        $conversation = $this->conversationFor($workspace, $contact, $account);

        [$type, $body, $extra] = $this->parseInbound($message);

        return DB::transaction(function () use ($workspace, $contact, $conversation, $message, $waId, $type, $body, $extra) {
            $record = CrmMessage::create(array_merge([
                'workspace_id' => $workspace->id,
                'conversation_id' => $conversation->id,
                'contact_id' => $contact->id,
                'wa_message_id' => $waId ?: null,
                'direction' => 'in',
                'type' => $type,
                'body' => $body,
                'status' => 'received',
                'payload' => $message,
                'sent_at' => isset($message['timestamp'])
                    ? Carbon::createFromTimestamp((int) $message['timestamp'])
                    : now(),
            ], $extra));

            $conversation->touchActivity($record);

            if ($conversation->status === CrmConversation::STATUS_CLOSED) {
                $conversation->forceFill([
                    'status' => CrmConversation::STATUS_OPEN,
                    'closed_at' => null,
                ])->save();
            }

            $contact->forceFill(['last_message_at' => $record->created_at])->save();

            return $record;
        });
    }

    /**
     * @param  array<string, mixed>  $message
     * @return array{0:string,1:?string,2:array<string,mixed>}
     */
    protected function parseInbound(array $message): array
    {
        $type = (string) ($message['type'] ?? 'text');

        $extra = ['media_mime' => null, 'media_filename' => null];

        $body = match ($type) {
            'text' => $message['text']['body'] ?? null,
            'button' => $message['button']['text'] ?? null,
            'interactive' => $message['interactive']['button_reply']['title']
                ?? $message['interactive']['list_reply']['title']
                ?? null,
            'image', 'video', 'document', 'audio', 'sticker' => $message[$type]['caption']
                ?? $message[$type]['filename']
                ?? '[' . ucfirst($type) . ']',
            'location' => trim(implode(', ', array_filter([
                $message['location']['name'] ?? null,
                $message['location']['address'] ?? null,
            ]))) ?: ($message['location']['latitude'] ?? '') . ',' . ($message['location']['longitude'] ?? ''),
            'contacts' => collect($message['contacts'] ?? [])
                ->pluck('name.formatted_name')
                ->filter()
                ->implode(', ') ?: '[Contact card]',
            'reaction' => $message['reaction']['emoji'] ?? '[Reaction]',
            default => '[' . ucfirst($type) . ' message]',
        };

        if (isset($message[$type]['mime_type'])) {
            $extra['media_mime'] = $message[$type]['mime_type'];
        }

        if (isset($message[$type]['filename'])) {
            $extra['media_filename'] = $message[$type]['filename'];
        }

        return [$type, $body, $extra];
    }

    /**
     * Send a text reply and keep the thread in sync.
     */
    public function reply(CrmConversation $conversation, ?User $agent, string $body): CrmMessage
    {
        $workspace = $conversation->workspace;
        $account = $conversation->account ?? $this->account($workspace);

        $message = CrmMessage::create([
            'workspace_id' => $workspace->id,
            'conversation_id' => $conversation->id,
            'contact_id' => $conversation->contact_id,
            'user_id' => $agent?->id,
            'direction' => 'out',
            'type' => 'text',
            'body' => $body,
            'status' => 'queued',
        ]);

        return $this->deliverText($message, $account);
    }

    protected function deliverText(CrmMessage $message, WhatsAppAccount $account): CrmMessage
    {
        try {
            $waId = $this->api->for($account)->sendText($message->contact->phone, (string) $message->body);
            $message->update([
                'wa_message_id' => $waId,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Throwable $exception) {
            $message->update([
                'status' => 'failed',
                'error' => $exception->getMessage(),
            ]);
        }

        $message->conversation->touchActivity($message);
        $message->contact->forceFill(['last_message_at' => now()])->save();

        return $message->fresh();
    }

    /**
     * Deliver a template to a contact (used by campaigns).
     *
     * @param  array<int, string>  $parameters
     */
    public function sendTemplate(CrmConversation $conversation, ?User $agent, CrmTemplate $template, array $parameters = []): CrmMessage
    {
        $workspace = $conversation->workspace;
        $account = $conversation->account ?? $this->account($workspace);

        $message = CrmMessage::create([
            'workspace_id' => $workspace->id,
            'conversation_id' => $conversation->id,
            'contact_id' => $conversation->contact_id,
            'user_id' => $agent?->id,
            'direction' => 'out',
            'type' => 'template',
            'template_name' => $template->name,
            'body' => $template->body,
            'status' => 'queued',
        ]);

        try {
            $waId = $this->api->for($account)->sendTemplate($conversation->contact->phone, $template, $parameters);
            $message->update([
                'wa_message_id' => $waId,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Throwable $exception) {
            $message->update([
                'status' => 'failed',
                'error' => $exception->getMessage(),
            ]);
        }

        $conversation->touchActivity($message);
        $conversation->contact->forceFill(['last_message_at' => now()])->save();

        return $message->fresh();
    }

    public function markRead(CrmConversation $conversation): void
    {
        $unread = $conversation->unreadMessages()->get();

        CrmMessage::whereIn('id', $unread->pluck('id'))->update(['read_at' => now()]);
        $conversation->forceFill(['unread_count' => 0])->save();

        if ($conversation->account) {
            foreach ($unread as $message) {
                if ($message->wa_message_id) {
                    $this->api->for($conversation->account)->markRead($message->wa_message_id);
                }
            }
        }
    }

    /**
     * Apply delivery/read receipts coming from the webhook.
     */
    public function applyStatus(string $waMessageId, string $status, ?int $timestamp = null, ?int $workspaceId = null): void
    {
        $message = CrmMessage::query()
            ->when($workspaceId, fn ($query) => $query->where('workspace_id', $workspaceId))
            ->where('wa_message_id', $waMessageId)
            ->first();

        if (! $message) {
            return;
        }

        $at = $timestamp ? Carbon::createFromTimestamp($timestamp) : now();

        $attributes = match ($status) {
            'sent' => ['status' => 'sent', 'sent_at' => $message->sent_at ?? $at],
            'delivered' => ['status' => 'delivered', 'delivered_at' => $at],
            'read' => ['status' => 'read', 'read_at' => $at, 'delivered_at' => $message->delivered_at ?? $at],
            'failed' => ['status' => 'failed', 'error' => 'Delivery failed at WhatsApp.'],
            default => null,
        };

        if (! $attributes) {
            return;
        }

        $message->update($attributes);

        // Keep campaign recipient rows in sync with delivery receipts.
        $recipient = \App\Models\CrmCampaignRecipient::where('message_id', $message->id)->first();

        if ($recipient) {
            $recipient->update(array_filter([
                'status' => in_array($status, ['delivered', 'read'], true) ? 'delivered' : $status,
                'delivered_at' => in_array($status, ['delivered', 'read'], true) ? $at : null,
            ]));

            $campaign = $recipient->campaign;
            $campaign->forceFill([
                'delivered_count' => $campaign->recipients()->where('status', 'delivered')->count(),
                'failed_count' => $campaign->recipients()->where('status', 'failed')->count(),
            ])->save();
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(Workspace $workspace): array
    {
        $today = now()->startOfDay();

        return [
            'contacts' => $workspace->contacts()->count(),
            'open_conversations' => $workspace->conversations()
                ->whereIn('status', [CrmConversation::STATUS_OPEN, CrmConversation::STATUS_PENDING])
                ->count(),
            'unread_messages' => (int) $workspace->conversations()->sum('unread_count'),
            'messages_today' => CrmMessage::where('workspace_id', $workspace->id)
                ->where('created_at', '>=', $today)
                ->count(),
            'campaigns' => $workspace->campaigns()->count(),
            'campaigns_sent' => $workspace->campaigns()->where('status', CrmCampaign::STATUS_SENT)->count(),
            'recent_conversations' => $workspace->conversations()
                ->with('contact:id,name,phone,avatar_url')
                ->orderByDesc('last_message_at')
                ->limit(5)
                ->get()
                ->map(fn (CrmConversation $conversation) => [
                    'id' => $conversation->id,
                    'status' => $conversation->status,
                    'preview' => $conversation->last_message_preview,
                    'last_message_at' => $conversation->last_message_at,
                    'unread_count' => $conversation->unread_count,
                    'contact' => $conversation->contact,
                ]),
        ];
    }

    /**
     * @return Collection<int, CrmContact>
     */
    public function audienceFor(?int $tagId, Workspace $workspace): Collection
    {
        $query = $workspace->contacts()
            ->where('opt_in', true)
            ->where('status', '!=', 'blocked');

        if ($tagId) {
            $query->whereHas('tags', fn ($builder) => $builder->where('crm_tags.id', $tagId));
        }

        return $query->orderBy('id')->get();
    }

    public function assertReady(WhatsAppAccount $account): void
    {
        if (! $account->isConfigured()) {
            throw new RuntimeException('Connect WhatsApp in settings before sending messages.');
        }
    }
}
