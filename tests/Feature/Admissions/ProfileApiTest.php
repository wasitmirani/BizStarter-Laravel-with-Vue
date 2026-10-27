<?php

use App\Models\User;
use App\Models\UserProfile;
use Laravel\Sanctum\Sanctum;

it('creates a private profile for the authenticated user only', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->putJson('/api/v1/profile', [
        'full_name' => 'Sara Bianchi',
        'nationality' => 'IT',
        'country_of_residence' => 'IT',
        'target_intake_year' => now()->year + 1,
    ])->assertOk()
        ->assertJsonPath('result.profile.full_name', 'Sara Bianchi')
        ->assertJsonStructure(['result' => ['completion' => ['percentage', 'missing']]]);

    expect(UserProfile::where('user_id', $user->id)->exists())->toBeTrue();

    $other = User::factory()->create();
    expect(UserProfile::where('user_id', $other->id)->exists())->toBeFalse();
});

it('validates profile payloads with form requests', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->putJson('/api/v1/profile', [
        'nationality' => 'Italy',
        'target_intake_year' => 1900,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['nationality', 'target_intake_year']);
});

it('never returns the saved slack webhook secret', function () {
    Sanctum::actingAs(User::factory()->create());

    $this->putJson('/api/v1/notification-preferences', [
        'slack_enabled' => true,
        'slack_webhook_url' => 'https://hooks.slack.com/services/T000/B000/XXXX',
    ])->assertOk();

    $response = $this->getJson('/api/v1/notification-preferences')->assertOk();

    expect($response->json('result.notification_preferences.slack_webhook_url'))->toBeNull()
        ->and($response->json('result.slack_webhook_configured'))->toBeTrue();
});
