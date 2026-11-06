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
use App\Services\Instagram\InstagramApi;
use App\Services\WhatsApp\WhatsAppCloudApi;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class CrmService
{
    public function __construct(
        private readonly WhatsAppCloudApi $api,
        private readonly InstagramApi $instagram,
    ) {
    }

    public function account(Workspace $workspace, string $channel = WhatsAppAccount::CHANNEL_WHATSAPP): WhatsAppAccount
    {
        $isInstagram = $channel === WhatsAppAccount::CHANNEL_INSTAGRAM;

        return $workspace->accounts()->firstOrCreate(
            ['channel' => $channel],
            [
                'name' => $workspace->name . ' ' . ($isInstagram ? 'Instagram' : 'WhatsApp'),
                'api_version' => $isInstagram
                    ? config('services.instagram.api_version', config('services.whatsapp.api_version', 'v21.0'))
                    : config('services.whatsapp.api_version', 'v21.0'),
                'verify_token' => Str::random(32),
                'is_active' => true,
            ]
        );
    }

    /**
     * Find a contact by channel identifier or create one, then open its conversation.
     *
     * WhatsApp identifiers are phone numbers; Instagram identifiers are IGSIDs.
     */
    public function contactFor(
        Workspace $workspace,
        string $identifier,
        ?string $name = null,
        string $source = 'whatsapp',
        string $channel = CrmContact::CHANNEL_WHATSAPP,
        ?string $username = null
    ): CrmContact {
        $isInstagram = $channel === CrmContact::CHANNEL_INSTAGRAM;
        $normalized = $isInstagram ? trim($identifier) : CrmContact::normalizePhone($identifier);

        $contact = $workspace->contacts()
            ->where('channel', $channel)
            ->when($normalized !== '', fn ($query) => $query->where('external_id', $normalized))
            ->first();

        if (! $contact && ! $isInstagram) {
            $contact = $workspace->contacts()->where('phone', $normalized)->first();

            if ($contact && blank($contact->external_id)) {
                $contact->forceFill(['external_id' => $normalized])->save();
            }
        }

        if ($contact) {
            $changes = [];

            if ($name && $contact->name !== $name) {
                $changes['name'] = $name;
            }

            if ($username && $contact->username !== $username) {
                $changes['username'] = $username;
            }

            if ($changes !== []) {
                $contact->update($changes);
            }

            return $contact;
        }

        return $workspace->contacts()->create([
            'name' => $name ?: ($isInstagram ? 'Instagram user' : '+' . $normalized),
            'channel' => $channel,
            'external_id' => $normalized !== '' ? $normalized : null,
            'username' => $username,
            'phone' => $isInstagram ? null : $normalized,
            'source' => $source,
            'status' => 'lead',
            'opt_in' => true,
        ]);
    }

    public function conversationFor(Workspace $workspace, CrmContact $contact, ?WhatsAppAccount $account = null): CrmConversation
    {
        $channel = $contact->channel ?: CrmContact::CHANNEL_WHATSAPP;
        $account ??= $workspace->accountFor($channel);

        return CrmConversation::firstOrCreate(
            ['workspace_id' => $workspace->id, 'contact_id' => $contact->id],
            [
                'channel' => $channel,
                'whatsapp_account_id' => $account?->id,
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

        $contact = $this->contactFor(
            $workspace,
            $from,
            $name,
            'whatsapp',
            CrmContact::CHANNEL_WHATSAPP
        );
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
     * Store an inbound Instagram webhook event idempotently.
     *
     * @param  array<string, mixed>  $entry
     * @param  array<string, mixed>  $event
     */
    public function receiveInstagram(WhatsAppAccount $account, array $entry, array $event): ?CrmMessage
    {
        $workspace = $account->workspace;

        if (! $workspace) {
            return null;
        }

        $message = $event['message'] ?? null;

        if (! is_array($message) || ! empty($message['is_echo'])) {
            return null;
        }

        $senderId = (string) ($event['sender']['id'] ?? '');

        if ($senderId === '' || $senderId === (string) $account->instagram_user_id) {
            return null;
        }

        $mid = (string) ($message['mid'] ?? '');

        if ($mid !== '' && CrmMessage::where('workspace_id', $workspace->id)->where('wa_message_id', $mid)->exists()) {
            return null;
        }

        $profile = [];
        $name = null;
        $username = null;

        $contact = $workspace->contacts()
            ->where('channel', CrmContact::CHANNEL_INSTAGRAM)
            ->where('external_id', $senderId)
            ->first();

        if (! $contact) {
            $profile = $this->instagram->for($account)->fetchProfile($senderId);
            $name = $profile['name'] ?? $profile['username'] ?? null;
            $username = $profile['username'] ?? null;
        }

        $contact = $this->contactFor(
            $workspace,
            $senderId,
            $name,
            'instagram',
            CrmContact::CHANNEL_INSTAGRAM,
            $username
        );

        $conversation = $this->conversationFor($workspace, $contact, $account);

        [$type, $body, $extra] = $this->parseInstagram($message);

        $sentAt = isset($event['timestamp'])
            ? Carbon::createFromTimestampMs((int) $event['timestamp'])
            : now();

        return DB::transaction(function () use ($workspace, $contact, $conversation, $event, $message, $mid, $type, $body, $extra, $sentAt) {
            $record = CrmMessage::create(array_merge([
                'workspace_id' => $workspace->id,
                'conversation_id' => $conversation->id,
                'contact_id' => $contact->id,
                'wa_message_id' => $mid ?: null,
                'direction' => 'in',
                'type' => $type,
                'body' => $body,
                'status' => 'received',
                'payload' => $event,
                'sent_at' => $sentAt,
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
    protected function parseInstagram(array $message): array
    {
        $extra = ['media_url' => null, 'media_mime' => null, 'media_filename' => null];
        $attachments = $message['attachments'] ?? [];

        if (is_array($attachments) && $attachments !== []) {
            $attachment = $attachments[0];
            $type = $this->instagramAttachmentType((string) ($attachment['type'] ?? 'file'));
            $url = $attachment['payload']['url'] ?? null;

            $extra['media_url'] = $url;
            $extra['media_filename'] = $attachment['payload']['title'] ?? ('instagram-' . $type);

            return [$type, $message['text'] ?? '[' . ucfirst($type) . ']', $extra];
        }

        if (isset($message['text'])) {
            return ['text', (string) $message['text'], $extra];
        }

        if (isset($message['reaction'])) {
            return ['reaction', $message['reaction']['emoji'] ?? '[Reaction]', $extra];
        }

        if (isset($message['share'])) {
            return ['text', $message['share']['link'] ?? '[Shared post]', $extra];
        }

        if (isset($message['story_mention'])) {
            return ['image', '[Story mention]', array_merge($extra, ['media_url' => $message['story_mention']['url'] ?? null])];
        }

        return ['text', '[Instagram message]', $extra];
    }

    protected function instagramAttachmentType(string $type): string
    {
        return match ($type) {
            'image', 'sticker' => 'image',
            'video', 'reel', 'story' => 'video',
            'audio' => 'audio',
            default => 'document',
        };
    }

    /**
     * Send a text reply and keep the thread in sync.
     */
    public function reply(CrmConversation $conversation, ?User $agent, string $body): CrmMessage
    {
        $workspace = $conversation->workspace;
        $channel = $conversation->channel ?: CrmConversation::CHANNEL_WHATSAPP;
        $account = $conversation->account ?? $this->account($workspace, $channel);

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

        return $conversation->isInstagram()
            ? $this->deliverInstagramText($message, $account)
            : $this->deliverText($message, $account);
    }

    protected function deliverText(CrmMessage $message, WhatsAppAccount $account): CrmMessage
    {
        try {
            $waId = $this->api->for($account)->sendText((string) $message->contact->phone, (string) $message->body);
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

    protected function deliverInstagramText(CrmMessage $message, WhatsAppAccount $account): CrmMessage
    {
        try {
            $mid = $this->instagram->for($account)->sendText(
                (string) $message->contact->external_id,
                (string) $message->body
            );

            $message->update([
                'wa_message_id' => $mid,
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

        if ($conversation->account && ! $conversation->isInstagram()) {
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
        $trendStart = now()->subDays(13)->startOfDay();

        $messagesByDay = CrmMessage::where('workspace_id', $workspace->id)
            ->where('created_at', '>=', $trendStart)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => ['date' => (string) $row->date, 'total' => (int) $row->total])
            ->all();

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
            'campaigns_scheduled' => $workspace->campaigns()->where('status', CrmCampaign::STATUS_SCHEDULED)->count(),
            'campaigns_draft' => $workspace->campaigns()->where('status', CrmCampaign::STATUS_DRAFT)->count(),
            'whatsapp_conversations' => $workspace->conversations()
                ->where('channel', CrmConversation::CHANNEL_WHATSAPP)
                ->count(),
            'instagram_conversations' => $workspace->conversations()
                ->where('channel', CrmConversation::CHANNEL_INSTAGRAM)
                ->count(),
            'messages_by_day' => $messagesByDay,
            'recent_conversations' => $workspace->conversations()
                ->with('contact:id,name,phone,avatar_url')
                ->orderByDesc('last_message_at')
                ->limit(5)
                ->get()
                ->map(fn (CrmConversation $conversation) => [
                    'id' => $conversation->id,
                    'channel' => $conversation->channel ?: CrmConversation::CHANNEL_WHATSAPP,
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
            ->where('channel', CrmContact::CHANNEL_WHATSAPP)
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
            $channel = $account->isInstagram() ? 'Instagram' : 'WhatsApp';

            throw new RuntimeException('Connect ' . $channel . ' in settings before sending messages.');
        }
    }
}
