<?php

use App\Models\Invoice;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Models\WorkspaceMember;
use App\Services\BillingService;
use App\Services\WorkspaceService;
use Illuminate\Support\Facades\Hash;

function makePlan(array $attributes = []): Plan
{
    static $sort = 0;
    $sort++;

    $name = $attributes['name'] ?? 'Plan '.$sort;

    return Plan::create(array_merge([
        'name' => $name,
        'slug' => strtolower(str_replace(' ', '-', $name)),
        'description' => 'Test plan',
        'price_monthly' => 29,
        'price_yearly' => 290,
        'currency' => 'USD',
        'trial_days' => 0,
        'features' => ['Feature one'],
        'limits' => ['seats' => 5, 'storage_mb' => 1024, 'api_calls' => 10000],
        'is_active' => true,
        'is_public' => true,
        'sort_order' => $sort,
    ], $attributes));
}

function makeWorkspace(User $owner, ?Plan $plan = null): Workspace
{
    $workspace = app(WorkspaceService::class)->provision($owner, 'Acme '.uniqid());

    if ($plan) {
        app(BillingService::class)->subscribe($workspace, $plan);
    }

    return $workspace->fresh();
}

function makeUser(array $attributes = []): User
{
    return User::factory()->create(array_merge([
        'email_verified_at' => now(),
    ], $attributes));
}

it('provisions a workspace with the owner as a member on signup', function () {
    makePlan(['name' => 'Free', 'price_monthly' => 0, 'price_yearly' => 0, 'trial_days' => 0]);

    \Spatie\Permission\Models\Role::create(['name' => 'user', 'guard_name' => 'web']);

    $response = $this->post('/register', [
        'name' => 'Jane Cooper',
        'workspace_name' => 'Cooper Studio',
        'email' => 'jane@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $response->assertRedirect('/app');

    $user = User::where('email', 'jane@example.com')->firstOrFail();
    $workspace = Workspace::where('owner_id', $user->id)->firstOrFail();

    expect($workspace->name)->toBe('Cooper Studio')
        ->and($user->hasRole('user'))->toBeTrue()
        ->and($workspace->memberRecords()->count())->toBe(1)
        ->and($workspace->memberRecords()->first()->role)->toBe('owner')
        ->and($workspace->subscription)->not->toBeNull();
});

it('invites a teammate by email and lets them join', function () {
    makePlan();
    \Illuminate\Support\Facades\Mail::fake();

    $owner = makeUser();
    $workspace = makeWorkspace($owner);
    $invitee = makeUser(['email' => 'teammate@example.com']);

    $this->actingAs($owner, 'sanctum')
        ->postJson('/api/app/workspace/invitations', [
            'email' => 'teammate@example.com',
            'role' => 'admin',
        ])
        ->assertCreated()
        ->assertJsonPath('result.invitation.mailed', true);

    \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\WorkspaceInvitationMail::class);

    $invitation = WorkspaceInvitation::firstOrFail();

    $this->actingAs($invitee, 'sanctum')
        ->postJson("/api/app/workspace/invitations/{$invitation->token}/accept")
        ->assertOk();

    expect(WorkspaceMember::where('workspace_id', $workspace->id)->where('user_id', $invitee->id)->value('role'))
        ->toBe('admin')
        ->and($invitation->fresh()->accepted_at)->not->toBeNull();
});

it('enforces the seat limit from the plan', function () {
    $plan = makePlan(['limits' => ['seats' => 1, 'storage_mb' => 100, 'api_calls' => 100]]);
    $owner = makeUser();
    makeWorkspace($owner, $plan);

    $this->actingAs($owner, 'sanctum')
        ->postJson('/api/app/workspace/invitations', ['email' => 'extra@example.com'])
        ->assertStatus(422)
        ->assertJsonValidationErrors('email');
});

it('records an invoice when subscribing to a paid plan', function () {
    $free = makePlan(['name' => 'Free', 'price_monthly' => 0, 'price_yearly' => 0]);
    $growth = makePlan(['name' => 'Growth', 'price_monthly' => 49, 'price_yearly' => 490]);

    $owner = makeUser();
    $workspace = makeWorkspace($owner, $free);

    $this->actingAs($owner, 'sanctum')
        ->postJson('/api/app/billing/subscribe', ['plan_id' => $growth->id, 'billing_cycle' => 'monthly'])
        ->assertOk();

    $subscription = $workspace->fresh()->subscription;

    expect($subscription->plan_id)->toBe($growth->id)
        ->and($subscription->status)->toBe(Subscription::STATUS_ACTIVE)
        ->and((float) Invoice::firstOrFail()->amount)->toBe(49.0)
        ->and(Invoice::firstOrFail()->status)->toBe('paid');
});

it('cancels and resumes a subscription', function () {
    $plan = makePlan();
    $owner = makeUser();
    $workspace = makeWorkspace($owner, $plan);

    $this->actingAs($owner, 'sanctum')->postJson('/api/app/billing/cancel')->assertOk();
    expect($workspace->fresh()->subscription->cancel_at_period_end)->toBeTrue();

    $this->actingAs($owner, 'sanctum')->postJson('/api/app/billing/resume')->assertOk();
    expect($workspace->fresh()->subscription->cancel_at_period_end)->toBeFalse();
});

it('mints and revokes api tokens', function () {
    makePlan();
    $owner = makeUser();
    makeWorkspace($owner);

    $response = $this->actingAs($owner, 'sanctum')
        ->postJson('/api/app/tokens', ['name' => 'CLI', 'abilities' => ['read'], 'expires_in_days' => 30])
        ->assertCreated();

    $id = $response->json('result.access_token.id');
    expect($response->json('result.token'))->toBeString()
        ->and($owner->tokens()->whereKey($id)->exists())->toBeTrue();

    $this->actingAs($owner, 'sanctum')
        ->deleteJson("/api/app/tokens/{$id}")
        ->assertOk();

    expect($owner->tokens()->whereKey($id)->exists())->toBeFalse();
});

it('ends expired trials and falls back to the free plan', function () {
    $free = makePlan(['name' => 'Free', 'price_monthly' => 0, 'price_yearly' => 0]);
    $trial = makePlan(['name' => 'Starter', 'price_monthly' => 19, 'price_yearly' => 190, 'trial_days' => 14]);

    $owner = makeUser();
    $workspace = makeWorkspace($owner, $trial);

    $workspace->subscription->update([
        'status' => Subscription::STATUS_TRIALING,
        'trial_ends_at' => now()->subDay(),
    ]);

    $result = app(BillingService::class)->syncLifecycle();

    expect($result['trials_ended'])->toBe(1)
        ->and($workspace->fresh()->subscription->plan_id)->toBe($free->id)
        ->and($workspace->fresh()->subscription->status)->toBe(Subscription::STATUS_ACTIVE);
});

it('keeps the owner role when an owner accepts another invitation', function () {
    makePlan();
    $owner = makeUser();
    $workspace = makeWorkspace($owner);

    $invitation = app(WorkspaceService::class)->invite($workspace, $owner, 'owner@example.com', 'member');
    $invitation->update(['email' => $owner->email]);

    app(WorkspaceService::class)->acceptInvitation($invitation->token, $owner);

    expect($workspace->memberRecords()->where('user_id', $owner->id)->value('role'))->toBe('owner');
});
