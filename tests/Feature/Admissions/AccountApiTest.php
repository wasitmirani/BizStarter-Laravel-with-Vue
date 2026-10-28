<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

it('returns the authenticated account with completion data', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->getJson('/api/v1/account')
        ->assertOk()
        ->assertJsonPath('result.user.id', $user->id)
        ->assertJsonPath('result.user.email', $user->email)
        ->assertJsonStructure([
            'result' => [
                'user' => ['id', 'name', 'email', 'roles', 'thumbnail'],
                'completion' => ['percentage', 'completed', 'total', 'missing'],
            ],
        ]);
});

it('updates only the authenticated account', function () {
    $user = User::factory()->create(['name' => 'Old Name', 'email' => 'old@example.com']);
    $other = User::factory()->create(['name' => 'Other User', 'email' => 'other@example.com']);
    Sanctum::actingAs($user);

    $this->patchJson('/api/v1/account', [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'phone' => '+39 333 1234567',
    ])->assertOk()
        ->assertJsonPath('result.user.name', 'New Name')
        ->assertJsonPath('result.user.email', 'new@example.com');

    expect($user->fresh()->name)->toBe('New Name')
        ->and($user->fresh()->email_verified_at)->toBeNull()
        ->and($other->fresh()->name)->toBe('Other User')
        ->and($other->fresh()->email)->toBe('other@example.com');
});

it('validates account updates', function () {
    $user = User::factory()->create(['email' => 'taken@example.com']);
    Sanctum::actingAs($user);

    $this->patchJson('/api/v1/account', [
        'name' => '',
        'email' => 'taken@example.com',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('changes the password when the current password is correct', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->postJson('/api/v1/account/password', [
        'current_password' => 'password',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ])->assertOk();

    expect(Hash::check('new-password-123', $user->fresh()->password))->toBeTrue();
});

it('rejects password changes with the wrong current password', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->postJson('/api/v1/account/password', [
        'current_password' => 'wrong-password',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['current_password']);

    expect(Hash::check('password', $user->fresh()->password))->toBeTrue();
});

it('stores an uploaded avatar on the public disk', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $this->post('/api/v1/account/avatar', [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonStructure(['result' => ['thumbnail']]);

    $thumbnail = $user->fresh()->getRawOriginal('thumbnail');

    expect($thumbnail)->not->toBeNull()
        ->and(Storage::disk('public')->exists('images/user/'.$thumbnail))->toBeTrue();
});
