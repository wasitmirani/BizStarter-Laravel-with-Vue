<?php

it('redirects guests to the login page', function () {
    $this->get('/')->assertRedirect(route('login'));
});

it('redirects authenticated users to the dashboard', function () {
    $user = \App\Models\User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)->get('/')->assertRedirect('/app/dashboard');
});
