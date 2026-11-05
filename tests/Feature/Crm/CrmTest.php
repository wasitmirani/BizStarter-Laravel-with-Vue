<?php

use App\Models\CrmCampaign;
use App\Models\CrmContact;
use App\Models\CrmConversation;
use App\Models\CrmMessage;
use App\Models\CrmTemplate;
use App\Models\User;
use App\Models\WhatsAppAccount;
use App\Models\Workspace;
use App\Services\WorkspaceService;
use Illuminate\Support\Facades\Http;

function crmUser(array $attributes = []): User
{
    return User::factory()->create(array_merge([
        'email_verified_at' => now(),
    ], $attributes));
}

function crmWorkspace(User $owner): Workspace
{
    return app(WorkspaceService::class)->provision($owner, 'CRM '.uniqid());
}

function crmAccount(Workspace $workspace, array $attributes = []): WhatsAppAccount
{
    return $workspace->whatsappAccount()->create(array_merge([
        'name' => 'Support line',
        'phone_number' => '14155550123',
        'phone_number_id' => '109876543210987',
        'business_account_id' => '102290129340398',
        'access_token' => 'EAAG-test-token',
        'verify_token' => 'crm-verify-token',
        'api_version' => 'v21.0',
        'is_active' => true,
    ], $attributes));
}

it('creates, updates, lists and deletes contacts scoped to the workspace', function () {
    $owner = crmUser();
    crmWorkspace($owner);

    $created = $this->actingAs($owner, 'sanctum')
        ->postJson('/api/app/crm/contacts', [
            'name' => 'Ayesha Khan',
            'phone' => '+1 (415) 555-0101',
            'email' => 'ayesha@example.com',
            'company' => 'Northwind',
            'status' => 'customer',
            'tags' => ['VIP'],
        ])
        ->assertCreated()
        ->assertJsonPath('result.contact.name', 'Ayesha Khan')
        ->assertJsonPath('result.contact.phone', '14155550101')
        ->assertJsonPath('result.contact.tags.0.name', 'VIP');

    $id = $created->json('result.contact.id');

    $this->actingAs($owner, 'sanctum')
        ->putJson("/api/app/crm/contacts/{$id}", [
            'name' => 'Ayesha Khan',
            'phone' => '14155550101',
            'company' => 'Northwind Trading',
            'status' => 'customer',
        ])
        ->assertOk()
        ->assertJsonPath('result.contact.company', 'Northwind Trading');

    $this->actingAs($owner, 'sanctum')
        ->getJson('/api/app/crm/contacts?search=northwind')
        ->assertOk()
        ->assertJsonPath('result.meta.total', 1)
        ->assertJsonPath('result.contacts.0.name', 'Ayesha Khan');

    $this->actingAs($owner, 'sanctum')
        ->deleteJson("/api/app/crm/contacts/{$id}")
        ->assertOk();

    expect(CrmContact::count())->toBe(0);
});

it('rejects a duplicate phone number inside the same workspace', function () {
    $owner = crmUser();
    crmWorkspace($owner);

    $payload = [
        'name' => 'Daniel Ruiz',
        'phone' => '14155550102',
    ];

    $this->actingAs($owner, 'sanctum')->postJson('/api/app/crm/contacts', $payload)->assertCreated();
    $this->actingAs($owner, 'sanctum')
        ->postJson('/api/app/crm/contacts', $payload)
        ->assertStatus(422)
        ->assertJsonValidationErrors('phone');
});

it('hides contacts that belong to another workspace', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    $contact = $workspace->contacts()->create([
        'name' => 'Private Person',
        'phone' => '14155550111',
    ]);

    $stranger = crmUser(['email' => 'stranger@example.com']);
    crmWorkspace($stranger);

    $this->actingAs($stranger, 'sanctum')
        ->getJson("/api/app/crm/contacts/{$contact->id}")
        ->assertNotFound();
});

it('stores inbound webhook messages once and reopens closed conversations', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmAccount($workspace);

    $contact = $workspace->contacts()->create([
        'name' => 'Layla Hassan',
        'phone' => '14155550999',
    ]);

    $conversation = $workspace->conversations()->create([
        'contact_id' => $contact->id,
        'status' => CrmConversation::STATUS_CLOSED,
        'closed_at' => now()->subDay(),
        'unread_count' => 0,
    ]);

    $payload = [
        'object' => 'whatsapp_business_account',
        'entry' => [[
            'id' => '123',
            'changes' => [[
                'field' => 'messages',
                'value' => [
                    'messaging_product' => 'whatsapp',
                    'metadata' => ['phone_number_id' => '109876543210987'],
                    'contacts' => [['profile' => ['name' => 'Layla Hassan'], 'wa_id' => '14155550999']],
                    'messages' => [[
                        'from' => '14155550999',
                        'id' => 'wamid.TEST123',
                        'timestamp' => (string) now()->timestamp,
                        'type' => 'text',
                        'text' => ['body' => 'I would like a demo.'],
                    ]],
                ],
            ]],
        ]],
    ];

    $this->postJson('/api/whatsapp/webhook', $payload)->assertOk();

    $conversation->refresh();

    expect(CrmMessage::count())->toBe(1)
        ->and($conversation->status)->toBe(CrmConversation::STATUS_OPEN)
        ->and($conversation->unread_count)->toBe(1)
        ->and($conversation->last_message_preview)->toBe('I would like a demo.');

    // Meta retries webhooks: the second delivery must be ignored.
    $this->postJson('/api/whatsapp/webhook', $payload)->assertOk();

    expect(CrmMessage::count())->toBe(1)
        ->and($conversation->fresh()->unread_count)->toBe(1);
});

it('creates a contact and conversation for an unknown inbound number', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmAccount($workspace);

    $this->postJson('/api/whatsapp/webhook', [
        'entry' => [[
            'changes' => [[
                'value' => [
                    'metadata' => ['phone_number_id' => '109876543210987'],
                    'contacts' => [['profile' => ['name' => 'New Lead'], 'wa_id' => '14155550888']],
                    'messages' => [[
                        'from' => '14155550888',
                        'id' => 'wamid.NEWLEAD',
                        'timestamp' => (string) now()->timestamp,
                        'type' => 'text',
                        'text' => ['body' => 'Hello there'],
                    ]],
                ],
            ]],
        ]],
    ])->assertOk();

    expect($workspace->contacts()->where('phone', '14155550888')->exists())->toBeTrue()
        ->and($workspace->conversations()->count())->toBe(1);
});

it('enforces the webhook signature when an app secret is configured', function () {
    config(['services.whatsapp.app_secret' => 'top-secret']);

    $body = ['entry' => []];
    $json = json_encode($body);
    $signature = 'sha256='.hash_hmac('sha256', $json, 'top-secret');

    $this->call('POST', '/api/whatsapp/webhook', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_ACCEPT' => 'application/json',
    ], $json)->assertStatus(403);

    $this->call('POST', '/api/whatsapp/webhook', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_ACCEPT' => 'application/json',
        'HTTP_X_HUB_SIGNATURE_256' => $signature,
    ], $json)->assertOk();
});

it('verifies the webhook subscription challenge with a workspace token', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmAccount($workspace, ['verify_token' => 'verify-me']);

    $this->get('/api/whatsapp/webhook?hub_mode=subscribe&hub_verify_token=verify-me&hub_challenge=12345')
        ->assertOk()
        ->assertSee('12345');

    $this->get('/api/whatsapp/webhook?hub_mode=subscribe&hub_verify_token=wrong&hub_challenge=12345')
        ->assertForbidden();
});

it('records a reply as failed when WhatsApp is not connected', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    $contact = $workspace->contacts()->create([
        'name' => 'No Account',
        'phone' => '14155550777',
    ]);
    $conversation = CrmConversation::create([
        'workspace_id' => $workspace->id,
        'contact_id' => $contact->id,
        'status' => CrmConversation::STATUS_OPEN,
    ]);

    $this->actingAs($owner, 'sanctum')
        ->postJson("/api/app/crm/conversations/{$conversation->id}/reply", ['body' => 'Are you there?'])
        ->assertOk()
        ->assertJsonPath('status', false)
        ->assertJsonPath('result.message.status', 'failed');

    expect($conversation->messages()->count())->toBe(1)
        ->and($conversation->fresh()->last_message_preview)->toBe('Are you there?');
});

it('sends a campaign to the tagged audience through the Cloud API', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response(['messages' => [['id' => 'wamid.CAMPAIGN1']]], 200),
    ]);

    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmAccount($workspace);

    $tag = $workspace->tags()->create(['name' => 'VIP', 'color' => '#7c3aed']);

    $vip = $workspace->contacts()->create([
        'name' => 'Priya Sharma',
        'phone' => '14155550105',
        'status' => 'customer',
        'opt_in' => true,
    ]);
    $vip->tags()->attach($tag);

    $workspace->contacts()->create([
        'name' => 'Not a VIP',
        'phone' => '14155550106',
        'opt_in' => true,
    ]);

    $template = CrmTemplate::create([
        'workspace_id' => $workspace->id,
        'name' => 'spring_offer',
        'category' => 'marketing',
        'language' => 'en_US',
        'body' => 'Hi {{1}}, our spring sale is live.',
        'status' => 'approved',
    ]);

    $campaign = $workspace->campaigns()->create([
        'name' => 'Spring offer',
        'template_id' => $template->id,
        'audience_tag_id' => $tag->id,
        'status' => CrmCampaign::STATUS_DRAFT,
    ]);

    $this->actingAs($owner, 'sanctum')
        ->postJson("/api/app/crm/campaigns/{$campaign->id}/send")
        ->assertOk()
        ->assertJsonPath('result.result.sent', 1)
        ->assertJsonPath('result.result.failed', 0);

    $campaign->refresh();

    expect($campaign->status)->toBe(CrmCampaign::STATUS_SENT)
        ->and($campaign->total_recipients)->toBe(1)
        ->and($campaign->sent_count)->toBe(1)
        ->and(CrmMessage::where('type', 'template')->count())->toBe(1)
        ->and($workspace->conversations()->count())->toBe(1);

    Http::assertSent(fn ($request) => str_contains($request->url(), 'messages')
        && $request['template']['name'] === 'spring_offer'
        && $request['to'] === '14155550105');

    $this->postJson('/api/whatsapp/webhook', [
        'entry' => [[
            'changes' => [[
                'value' => [
                    'metadata' => ['phone_number_id' => '109876543210987'],
                    'statuses' => [[
                        'id' => 'wamid.CAMPAIGN1',
                        'status' => 'delivered',
                        'timestamp' => (string) now()->timestamp,
                    ]],
                ],
            ]],
        ]],
    ])->assertOk();

    expect(CrmMessage::where('wa_message_id', 'wamid.CAMPAIGN1')->first()->status)->toBe('delivered')
        ->and($campaign->fresh()->delivered_count)->toBe(1);
});

it('refuses to send a campaign when WhatsApp is not connected', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);

    $campaign = $workspace->campaigns()->create([
        'name' => 'No account',
        'message_body' => 'Hello',
        'status' => CrmCampaign::STATUS_DRAFT,
    ]);

    $this->actingAs($owner, 'sanctum')
        ->postJson("/api/app/crm/campaigns/{$campaign->id}/send")
        ->assertStatus(422)
        ->assertJsonPath('status', false);

    expect($campaign->fresh()->status)->toBe(CrmCampaign::STATUS_FAILED);
});

it('exposes a CRM summary on the dashboard', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);

    $contact = $workspace->contacts()->create(['name' => 'Dash Contact', 'phone' => '14155550666']);
    $workspace->conversations()->create([
        'contact_id' => $contact->id,
        'status' => CrmConversation::STATUS_OPEN,
        'unread_count' => 2,
        'last_message_at' => now(),
    ]);

    $this->actingAs($owner, 'sanctum')
        ->getJson('/api/app/dashboard')
        ->assertOk()
        ->assertJsonPath('result.crm.contacts', 1)
        ->assertJsonPath('result.crm.open_conversations', 1)
        ->assertJsonPath('result.crm.unread_messages', 2)
        ->assertJsonCount(1, 'result.crm.recent_conversations');
});

it('lets members work the inbox but not send campaigns', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);

    $member = crmUser(['email' => 'member@example.com']);

    $workspace->memberRecords()->create([
        'user_id' => $member->id,
        'role' => 'member',
        'joined_at' => now(),
    ]);

    $campaign = $workspace->campaigns()->create([
        'name' => 'Members cannot send',
        'message_body' => 'Hello',
        'status' => CrmCampaign::STATUS_DRAFT,
    ]);

    $this->actingAs($member, 'sanctum')
        ->getJson('/api/app/crm/conversations')
        ->assertOk();

    $this->actingAs($member, 'sanctum')
        ->postJson("/api/app/crm/campaigns/{$campaign->id}/send")
        ->assertForbidden();
});

it('stores a future scheduled time as a scheduled campaign', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);

    $this->actingAs($owner, 'sanctum')
        ->postJson('/api/app/crm/campaigns', [
            'name' => 'Scheduled promo',
            'message_body' => 'Hello there',
            'scheduled_at' => now()->addHours(2)->toIso8601String(),
        ])
        ->assertCreated()
        ->assertJsonPath('result.campaign.status', CrmCampaign::STATUS_SCHEDULED)
        ->assertJsonPath('result.campaign.is_scheduled', true);

    $campaign = CrmCampaign::firstOrFail();

    expect($campaign->scheduled_at)->not->toBeNull()
        ->and($campaign->status)->toBe(CrmCampaign::STATUS_SCHEDULED);
});

it('reschedules or cancels a campaign by editing its schedule', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);

    $campaign = $workspace->campaigns()->create([
        'name' => 'Reschedulable',
        'message_body' => 'Hello',
        'status' => CrmCampaign::STATUS_DRAFT,
    ]);

    $this->actingAs($owner, 'sanctum')
        ->putJson("/api/app/crm/campaigns/{$campaign->id}", [
            'name' => 'Reschedulable',
            'message_body' => 'Hello',
            'scheduled_at' => now()->addDay()->toIso8601String(),
        ])
        ->assertOk()
        ->assertJsonPath('result.campaign.status', CrmCampaign::STATUS_SCHEDULED);

    $this->actingAs($owner, 'sanctum')
        ->putJson("/api/app/crm/campaigns/{$campaign->id}", [
            'name' => 'Reschedulable',
            'message_body' => 'Hello',
            'scheduled_at' => null,
        ])
        ->assertOk()
        ->assertJsonPath('result.campaign.status', CrmCampaign::STATUS_DRAFT);

    expect($campaign->fresh()->scheduled_at)->toBeNull();

    $this->actingAs($owner, 'sanctum')
        ->putJson("/api/app/crm/campaigns/{$campaign->id}", [
            'name' => 'Reschedulable',
            'message_body' => 'Hello',
            'scheduled_at' => now()->subHour()->toIso8601String(),
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('scheduled_at');
});

it('sends due scheduled campaigns and leaves future ones queued', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response(['messages' => [['id' => 'wamid.SCHEDULED1']]], 200),
    ]);

    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmAccount($workspace);

    $workspace->contacts()->create([
        'name' => 'Scheduled Lead',
        'phone' => '14155550123',
        'opt_in' => true,
    ]);

    $due = $workspace->campaigns()->create([
        'name' => 'Due campaign',
        'message_body' => 'Sending now',
        'status' => CrmCampaign::STATUS_SCHEDULED,
        'scheduled_at' => now()->subMinute(),
    ]);

    $future = $workspace->campaigns()->create([
        'name' => 'Future campaign',
        'message_body' => 'Later',
        'status' => CrmCampaign::STATUS_SCHEDULED,
        'scheduled_at' => now()->addHour(),
    ]);

    $this->artisan('crm:send-scheduled-campaigns')->assertSuccessful();

    expect($due->fresh()->status)->toBe(CrmCampaign::STATUS_SENT)
        ->and($due->fresh()->sent_count)->toBe(1)
        ->and($due->fresh()->error)->toBeNull()
        ->and($future->fresh()->status)->toBe(CrmCampaign::STATUS_SCHEDULED);
});

it('flags a scheduled campaign that cannot reach WhatsApp', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);

    $campaign = $workspace->campaigns()->create([
        'name' => 'Unreachable campaign',
        'message_body' => 'Hello',
        'status' => CrmCampaign::STATUS_SCHEDULED,
        'scheduled_at' => now()->subMinute(),
    ]);

    $this->artisan('crm:send-scheduled-campaigns')->assertSuccessful();

    $campaign->refresh();

    expect($campaign->status)->toBe(CrmCampaign::STATUS_FAILED)
        ->and($campaign->error)->toContain('Connect WhatsApp');
});

it('streams inbound media for the workspace that owns the message', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response([
            'url' => 'https://lookaside.fbsbx.com/whatsapp/media/media-1',
            'mime_type' => 'image/jpeg',
            'file_name' => 'photo.jpg',
        ], 200),
        'lookaside.fbsbx.com/*' => Http::response('binary-image-data', 200, ['Content-Type' => 'image/jpeg']),
    ]);

    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmAccount($workspace);

    $contact = $workspace->contacts()->create(['name' => 'Media Sender', 'phone' => '14155550555']);
    $conversation = CrmConversation::create([
        'workspace_id' => $workspace->id,
        'contact_id' => $contact->id,
        'status' => CrmConversation::STATUS_OPEN,
    ]);

    $message = CrmMessage::create([
        'workspace_id' => $workspace->id,
        'conversation_id' => $conversation->id,
        'contact_id' => $contact->id,
        'direction' => 'in',
        'type' => 'image',
        'body' => 'Look at this',
        'status' => 'received',
        'payload' => [
            'type' => 'image',
            'image' => ['id' => 'media-1', 'mime_type' => 'image/jpeg'],
        ],
    ]);

    $this->actingAs($owner, 'sanctum')
        ->get("/api/app/crm/messages/{$message->id}/media")
        ->assertOk()
        ->assertHeader('Content-Type', 'image/jpeg')
        ->assertDownload('photo.jpg');

    expect($message->toMessageArray()['media']['type'])->toBe('image')
        ->and($message->toMessageArray()['media']['download_url'])->toContain("/crm/messages/{$message->id}/media");
});

it('guards media downloads by workspace and rejects messages without attachments', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    $contact = $workspace->contacts()->create(['name' => 'No Media', 'phone' => '14155550666']);
    $conversation = CrmConversation::create([
        'workspace_id' => $workspace->id,
        'contact_id' => $contact->id,
        'status' => CrmConversation::STATUS_OPEN,
    ]);

    $mediaMessage = CrmMessage::create([
        'workspace_id' => $workspace->id,
        'conversation_id' => $conversation->id,
        'contact_id' => $contact->id,
        'direction' => 'in',
        'type' => 'document',
        'body' => 'invoice.pdf',
        'status' => 'received',
        'payload' => [
            'type' => 'document',
            'document' => ['id' => 'media-2', 'mime_type' => 'application/pdf', 'filename' => 'invoice.pdf'],
        ],
    ]);

    $textMessage = CrmMessage::create([
        'workspace_id' => $workspace->id,
        'conversation_id' => $conversation->id,
        'contact_id' => $contact->id,
        'direction' => 'in',
        'type' => 'text',
        'body' => 'Just text',
        'status' => 'received',
    ]);

    $this->actingAs($owner, 'sanctum')
        ->get("/api/app/crm/messages/{$textMessage->id}/media")
        ->assertStatus(422)
        ->assertJsonPath('status', false);

    // Without a connected account the proxy refuses instead of leaking the token.
    $this->actingAs($owner, 'sanctum')
        ->get("/api/app/crm/messages/{$mediaMessage->id}/media")
        ->assertStatus(422)
        ->assertJsonPath('result.error', 'WhatsApp is not connected for this workspace.');

    $stranger = crmUser(['email' => 'stranger-media@example.com']);
    crmWorkspace($stranger);

    $this->actingAs($stranger, 'sanctum')
        ->get("/api/app/crm/messages/{$mediaMessage->id}/media")
        ->assertNotFound();
});

function crmInstagramAccount(Workspace $workspace, array $attributes = []): WhatsAppAccount
{
    return $workspace->accounts()->create(array_merge([
        'channel' => WhatsAppAccount::CHANNEL_INSTAGRAM,
        'name' => 'Instagram support',
        'instagram_user_id' => '17841400000000001',
        'instagram_username' => 'larakit.app',
        'page_id' => '102290129340399',
        'access_token' => 'IGAA-test-token',
        'verify_token' => 'instagram-verify-token',
        'api_version' => 'v21.0',
        'is_active' => true,
    ], $attributes));
}

function instagramWebhookPayload(string $mid, string $senderId = 'igsid-1001'): array
{
    return [
        'object' => 'instagram',
        'entry' => [[
            'id' => '17841400000000001',
            'time' => 1730000000000,
            'messaging' => [[
                'sender' => ['id' => $senderId],
                'recipient' => ['id' => '17841400000000001'],
                'timestamp' => 1730000000000,
                'message' => [
                    'mid' => $mid,
                    'text' => 'Hi from Instagram',
                ],
            ]],
        ]],
    ];
}

it('stores an inbound Instagram message once and creates a contact by IGSID', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response([
            'name' => 'Instagram Sender',
            'username' => 'sender.ig',
        ], 200),
    ]);

    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmInstagramAccount($workspace);

    $payload = instagramWebhookPayload('mid-1001');

    $this->postJson('/api/instagram/webhook', $payload)->assertOk();

    $contact = $workspace->contacts()->where('channel', CrmContact::CHANNEL_INSTAGRAM)->first();
    $conversation = $workspace->conversations()->where('channel', CrmConversation::CHANNEL_INSTAGRAM)->first();

    expect($contact)->not->toBeNull()
        ->and($contact->external_id)->toBe('igsid-1001')
        ->and($contact->username)->toBe('sender.ig')
        ->and($contact->phone)->toBeNull()
        ->and($conversation)->not->toBeNull()
        ->and($conversation->contact_id)->toBe($contact->id);

    expect(CrmMessage::where('wa_message_id', 'mid-1001')->count())->toBe(1);

    // Replaying the same webhook must not duplicate the message.
    $this->postJson('/api/instagram/webhook', $payload)->assertOk();

    expect(CrmMessage::where('wa_message_id', 'mid-1001')->count())->toBe(1);
});

it('replies on Instagram through the Graph API', function () {
    Http::fake([
        'graph.facebook.com/*' => Http::response(['message_id' => 'mid-out-2001'], 200),
    ]);

    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmInstagramAccount($workspace);

    $contact = $workspace->contacts()->create([
        'name' => 'Instagram Contact',
        'channel' => CrmContact::CHANNEL_INSTAGRAM,
        'external_id' => 'igsid-2001',
        'username' => 'contact.ig',
        'source' => 'instagram',
        'status' => 'lead',
        'opt_in' => true,
    ]);

    $conversation = CrmConversation::create([
        'workspace_id' => $workspace->id,
        'contact_id' => $contact->id,
        'channel' => CrmConversation::CHANNEL_INSTAGRAM,
        'status' => CrmConversation::STATUS_OPEN,
    ]);

    $this->actingAs($owner, 'sanctum')
        ->postJson("/api/app/crm/conversations/{$conversation->id}/reply", [
            'body' => 'Thanks for the DM!',
        ])
        ->assertOk();

    $message = CrmMessage::where('conversation_id', $conversation->id)
        ->where('direction', 'out')
        ->first();

    expect($message)->not->toBeNull()
        ->and($message->status)->toBe('sent')
        ->and($message->wa_message_id)->toBe('mid-out-2001');

    Http::assertSent(function ($request) {
        return str_contains($request->url(), '17841400000000001/messages')
            && $request['recipient']['id'] === 'igsid-2001'
            && $request['message']['text'] === 'Thanks for the DM!';
    });
});

it('splits the shared inbox by channel and keeps Instagram out of campaign audiences', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmAccount($workspace);
    crmInstagramAccount($workspace);

    $waContact = $workspace->contacts()->create(['name' => 'WhatsApp Lead', 'phone' => '14155550222']);
    $igContact = $workspace->contacts()->create([
        'name' => 'Instagram Lead',
        'channel' => CrmContact::CHANNEL_INSTAGRAM,
        'external_id' => 'igsid-3001',
        'source' => 'instagram',
        'status' => 'lead',
        'opt_in' => true,
    ]);

    $waConversation = CrmConversation::create([
        'workspace_id' => $workspace->id,
        'contact_id' => $waContact->id,
        'channel' => CrmConversation::CHANNEL_WHATSAPP,
        'status' => CrmConversation::STATUS_OPEN,
    ]);

    $igConversation = CrmConversation::create([
        'workspace_id' => $workspace->id,
        'contact_id' => $igContact->id,
        'channel' => CrmConversation::CHANNEL_INSTAGRAM,
        'status' => CrmConversation::STATUS_OPEN,
    ]);

    $response = $this->actingAs($owner, 'sanctum')
        ->getJson('/api/app/crm/conversations?channel=instagram&status=open')
        ->assertOk();

    $ids = collect($response->json('result.conversations'))->pluck('id');

    expect($ids)->toContain($igConversation->id)
        ->and($ids)->not->toContain($waConversation->id)
        ->and($response->json('result.counts.instagram'))->toBe(1)
        ->and($response->json('result.counts.whatsapp'))->toBe(1);

    expect($workspace->contacts()->where('channel', CrmContact::CHANNEL_WHATSAPP)->count())->toBe(1);
});

it('verifies the Instagram webhook subscription challenge with a workspace token', function () {
    $owner = crmUser();
    $workspace = crmWorkspace($owner);
    crmInstagramAccount($workspace);

    $this->get('/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=instagram-verify-token&hub.challenge=challenge-42')
        ->assertOk()
        ->assertSee('challenge-42');

    $this->get('/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=wrong-token&hub.challenge=challenge-42')
        ->assertForbidden();
});
