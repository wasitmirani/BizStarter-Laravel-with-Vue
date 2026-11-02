<?php

namespace App\Services\Crm;

use App\Models\CrmCampaign;
use App\Models\CrmCampaignRecipient;
use App\Models\CrmContact;
use App\Models\CrmMessage;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CampaignService
{
    public function __construct(private readonly CrmService $crm)
    {
    }

    /**
     * Resolve the audience without touching WhatsApp (used for previews).
     */
    public function audience(CrmCampaign $campaign): \Illuminate\Support\Collection
    {
        return $this->crm->audienceFor($campaign->audience_tag_id, $campaign->workspace);
    }

    /**
     * Send a campaign synchronously. Each recipient gets a conversation
     * message so replies land in the inbox.
     *
     * @return array{sent:int,failed:int,total:int}
     */
    public function send(CrmCampaign $campaign, ?User $agent = null): array
    {
        $workspace = $campaign->workspace;
        $account = $this->crm->account($workspace);

        $this->crm->assertReady($account);

        if (! $campaign->template && blank($campaign->message_body)) {
            throw new \RuntimeException('Choose a template or write a message before sending.');
        }

        if ($campaign->template && ! $campaign->template->external_id && $campaign->template->status !== 'approved') {
            // Local/draft templates can still be sent in test mode; WhatsApp may reject them.
        }

        $audience = $this->audience($campaign);

        $campaign->forceFill([
            'status' => CrmCampaign::STATUS_SENDING,
            'total_recipients' => $audience->count(),
            'sent_count' => 0,
            'delivered_count' => 0,
            'failed_count' => 0,
            'sent_at' => null,
        ])->save();

        $sent = 0;
        $failed = 0;

        DB::transaction(function () use ($campaign, $audience, $agent, &$sent, &$failed) {
            foreach ($audience as $contact) {
                /** @var CrmContact $contact */
                $recipient = CrmCampaignRecipient::firstOrCreate(
                    ['campaign_id' => $campaign->id, 'contact_id' => $contact->id],
                    ['status' => 'pending']
                );

                if ($recipient->status === 'sent' || $recipient->status === 'delivered') {
                    $sent++;
                    continue;
                }

                $conversation = $this->crm->conversationFor($campaign->workspace, $contact);

                if ($campaign->template) {
                    $parameters = $this->templateParameters($campaign, $contact);
                    $message = $this->crm->sendTemplate($conversation, $agent, $campaign->template, $parameters);
                } else {
                    $message = $this->crm->reply($conversation, $agent ?? $campaign->workspace->owner, (string) $campaign->message_body);
                }

                $ok = $message->status !== 'failed';

                $recipient->update([
                    'message_id' => $message->id,
                    'status' => $ok ? 'sent' : 'failed',
                    'error' => $message->error,
                    'sent_at' => $ok ? now() : null,
                ]);

                $ok ? $sent++ : $failed++;

                $campaign->forceFill([
                    'sent_count' => $sent,
                    'failed_count' => $failed,
                ])->save();
            }
        });

        $campaign->forceFill([
            'status' => $sent > 0 ? CrmCampaign::STATUS_SENT : CrmCampaign::STATUS_FAILED,
            'sent_at' => now(),
            'sent_count' => $sent,
            'failed_count' => $failed,
        ])->save();

        return ['sent' => $sent, 'failed' => $failed, 'total' => $campaign->total_recipients];
    }

    /**
     * Fill {{1}}, {{2}} … from the contact when possible.
     *
     * @return array<int, string>
     */
    public function templateParameters(CrmCampaign $campaign, CrmContact $contact): array
    {
        $count = $campaign->template?->variableCount() ?? 0;

        if ($count === 0) {
            return [];
        }

        $values = array_filter([
            $contact->name,
            $contact->company,
            $contact->email,
            $campaign->workspace->name,
        ], fn ($value) => filled($value));

        $parameters = [];

        for ($i = 0; $i < $count; $i++) {
            $parameters[] = (string) ($values[$i] ?? $contact->name ?? 'there');
        }

        return $parameters;
    }

    /**
     * @return array<string, mixed>
     */
    public function preview(CrmCampaign $campaign): array
    {
        $audience = $this->audience($campaign);

        return [
            'total' => $audience->count(),
            'sample' => $audience->take(5)->map(fn (CrmContact $contact) => [
                'id' => $contact->id,
                'name' => $contact->name,
                'phone' => $contact->displayPhone(),
            ])->values()->all(),
        ];
    }

    public function failedRecipients(CrmCampaign $campaign): \Illuminate\Support\Collection
    {
        return $campaign->recipients()
            ->with('contact:id,name,phone')
            ->where('status', 'failed')
            ->get();
    }
}
