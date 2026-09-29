<?php

it('redirects guests from the root to login', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});

it('redirects authenticated users from the root to the dashboard', function () {
    $user = \App\Models\User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($user)->get('/');

    $response->assertRedirect('/app/dashboard');
});
