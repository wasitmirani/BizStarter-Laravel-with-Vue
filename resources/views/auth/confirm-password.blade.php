@extends('layouts.backend.auth-modern')
@section('title', 'Confirm password')
@section('content')

<div class="lk-auth__head">
    <span class="lk-auth__kicker">Security check</span>
    <h1>Confirm your password</h1>
    <p>This is a protected area. Please re-enter your password to continue.</p>
</div>

@if ($errors->any())
    <div class="lk-alert lk-alert--error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        <span>{{ $errors->first() }}</span>
    </div>
@endif

<form method="POST" action="{{ route('password.confirm') }}" class="lk-form" novalidate>
    @csrf

    <div class="lk-field">
        <label for="password">Password</label>
        <div class="lk-input-wrap lk-input-wrap--password">
            <input
                type="password"
                id="password"
                name="password"
                class="lk-input @error('password') is-invalid @enderror"
                placeholder="Enter your password"
                required
                autofocus
                autocomplete="current-password"
                aria-invalid="{{ $errors->has('password') ? 'true' : 'false' }}"
            >
            <button type="button" class="lk-password-toggle" data-password-toggle="password" aria-label="Show password" aria-pressed="false">
                <svg class="lk-eye--show" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="lk-eye--hide" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.8"/><path d="M6.2 6.2A17.2 17.2 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 4.2-.8"/></svg>
            </button>
        </div>
        @error('password')
            <p class="lk-field__error">{{ $message }}</p>
        @enderror
    </div>

    <button type="submit" class="lk-btn lk-btn--primary">
        Confirm and continue
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
    </button>
</form>

<p class="lk-auth__note">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
    Confirming keeps your workspace secure when you step away from your device.
</p>

<a href="{{ route('login') }}" class="lk-auth__back">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
    Back to sign in
</a>

@endsection
