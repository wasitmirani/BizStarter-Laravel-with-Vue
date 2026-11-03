<?php

namespace Database\Seeders;

use App\Models\CrmCampaign;
use App\Models\CrmContact;
use App\Models\CrmConversation;
use App\Models\CrmMessage;
use App\Models\CrmTag;
use App\Models\CrmTemplate;
use App\Models\Workspace;
use Illuminate\Database\Seeder;

class CrmSeeder extends Seeder
{
    public function run(): void
    {
        $workspace = Workspace::orderBy('id')->first();

        if (! $workspace || $workspace->contacts()->exists()) {
            return;
        }

        $workspace->whatsappAccount()->firstOrCreate([], [
            'name' => $workspace->name . ' WhatsApp',
            'phone_number' => '14155550123',
            'api_version' => 'v21.0',
            'verify_token' => 'larakit-demo-verify-token',
            'is_active' => true,
        ]);

        $tags = collect([
            ['name' => 'VIP', 'color' => '#7c3aed'],
            ['name' => 'Lead', 'color' => '#0ea5e9'],
            ['name' => 'Support', 'color' => '#f59e0b'],
            ['name' => 'Newsletter', 'color' => '#059669'],
        ])->mapWithKeys(fn ($tag) => [
            $tag['name'] => $workspace->tags()->create($tag),
        ]);

        $contacts = [
            ['Ayesha Khan', '14155550101', 'ayesha@example.com', 'Northwind', 'customer', ['VIP', 'Newsletter']],
            ['Daniel Ruiz', '14155550102', 'daniel@example.com', 'Ruiz Studio', 'lead', ['Lead']],
            ['Fatima Noor', '14155550103', 'fatima@example.com', 'Acme Co', 'customer', ['Support']],
            ['Marcus Lee', '14155550104', 'marcus@example.com', 'Lee & Sons', 'lead', ['Lead', 'Newsletter']],
            ['Priya Sharma', '14155550105', 'priya@example.com', 'Bright Labs', 'customer', ['VIP']],
            ['Tom Becker', '14155550106', 'tom@example.com', 'Becker GmbH', 'lead', ['Newsletter']],
            ['Zara Ahmed', '14155550107', 'zara@example.com', 'Zara Store', 'customer', ['Support', 'VIP']],
            ['Omar Haddad', '14155550108', 'omar@example.com', 'Haddad Trading', 'blocked', []],
        ];

        foreach ($contacts as $index => [$name, $phone, $email, $company, $status, $contactTags]) {
            $contact = $workspace->contacts()->create([
                'name' => $name,
                'phone' => $phone,
                'email' => $email,
                'company' => $company,
                'source' => $index % 2 === 0 ? 'whatsapp' : 'manual',
                'status' => $status,
                'opt_in' => $status !== 'blocked',
                'last_message_at' => now()->subHours($index * 3),
            ]);

            $contact->tags()->sync(
                collect($contactTags)->map(fn ($tag) => $tags[$tag]->id)->all()
            );
        }

        $templates = collect([
            [
                'name' => 'welcome_message',
                'category' => 'utility',
                'language' => 'en_US',
                'body' => 'Hi {{1}}, thanks for reaching out to {{2}}. An agent will reply shortly.',
                'status' => 'approved',
            ],
            [
                'name' => 'order_update',
                'category' => 'utility',
                'language' => 'en_US',
                'body' => 'Hi {{1}}, your order {{2}} is on the way and should arrive in 2 days.',
                'status' => 'approved',
            ],
            [
                'name' => 'march_offer',
                'category' => 'marketing',
                'language' => 'en_US',
                'body' => 'Hi {{1}}, our spring sale is live — 20% off all plans this week.',
                'footer' => 'Reply STOP to opt out',
                'status' => 'approved',
            ],
            [
                'name' => 'feedback_request',
                'category' => 'marketing',
                'language' => 'en_US',
                'body' => 'Hi {{1}}, how was your recent experience with us? Reply with a score from 1–5.',
                'status' => 'draft',
            ],
        ])->map(fn ($template) => $workspace->crmTemplates()->create($template));

        $conversations = [
            [
                'contact' => 'Ayesha Khan',
                'status' => 'open',
                'unread' => 2,
                'messages' => [
                    ['in', 'Hi! Do you offer annual billing?', 5],
                    ['out', 'Yes — annual plans save you two months.', 4],
                    ['in', 'Great, can you send a quote for 20 seats?', 1],
                ],
            ],
            [
                'contact' => 'Daniel Ruiz',
                'status' => 'pending',
                'unread' => 0,
                'messages' => [
                    ['in', 'I booked a demo for tomorrow.', 8],
                    ['out', 'Perfect, see you then. I will send the calendar invite.', 7],
                ],
            ],
            [
                'contact' => 'Fatima Noor',
                'status' => 'open',
                'unread' => 1,
                'messages' => [
                    ['out', 'Your refund has been approved.', 10],
                    ['in', 'Thank you! How long does it take?', 2],
                ],
            ],
            [
                'contact' => 'Priya Sharma',
                'status' => 'closed',
                'unread' => 0,
                'messages' => [
                    ['in', 'Thanks for the quick help!', 26],
                    ['out', 'Anytime. Have a great day!', 25],
                ],
            ],
        ];

        foreach ($conversations as $entry) {
            $contact = $workspace->contacts()->where('name', $entry['contact'])->firstOrFail();
            $conversation = $workspace->conversations()->create([
                'contact_id' => $contact->id,
                'status' => $entry['status'],
                'priority' => 'normal',
                'unread_count' => $entry['unread'],
                'last_message_at' => now()->subHours(2),
                'last_message_preview' => '',
                'closed_at' => $entry['status'] === 'closed' ? now()->subDay() : null,
            ]);

            foreach ($entry['messages'] as $index => [$direction, $body, $hoursAgo]) {
                $message = CrmMessage::create([
                    'workspace_id' => $workspace->id,
                    'conversation_id' => $conversation->id,
                    'contact_id' => $contact->id,
                    'user_id' => $direction === 'out' ? $workspace->owner_id : null,
                    'direction' => $direction,
                    'type' => 'text',
                    'body' => $body,
                    'status' => $direction === 'in' ? 'received' : 'delivered',
                    'sent_at' => now()->subHours($hoursAgo),
                    'created_at' => now()->subHours($hoursAgo),
                    'updated_at' => now()->subHours($hoursAgo),
                ]);
            }

            $last = $conversation->messages()->latest('id')->first();

            $conversation->update([
                'last_message_at' => $last?->created_at,
                'last_message_preview' => $last?->preview(),
            ]);
        }

        $workspace->campaigns()->create([
            'name' => 'Spring offer — VIP customers',
            'template_id' => $templates->firstWhere('name', 'march_offer')?->id,
            'audience_tag_id' => $tags['VIP']->id,
            'status' => CrmCampaign::STATUS_SENT,
            'sent_at' => now()->subDays(2),
            'total_recipients' => 3,
            'sent_count' => 3,
            'delivered_count' => 3,
            'failed_count' => 0,
        ]);

        $workspace->campaigns()->create([
            'name' => 'Newsletter - product update',
            'template_id' => $templates->firstWhere('name', 'welcome_message')?->id,
            'audience_tag_id' => $tags['Newsletter']->id,
            'status' => CrmCampaign::STATUS_DRAFT,
        ]);

        $workspace->campaigns()->create([
            'name' => 'Lead follow-up - tomorrow',
            'template_id' => $templates->firstWhere('name', 'welcome_message')?->id,
            'audience_tag_id' => $tags['Lead']->id,
            'status' => CrmCampaign::STATUS_SCHEDULED,
            'scheduled_at' => now()->addDay(),
        ]);
    }
}
