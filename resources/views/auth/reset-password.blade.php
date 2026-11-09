@extends('layouts.backend.auth-modern')
@section('title', 'Choose a new password')
@section('content')

<div class="lk-auth__head">
    <span class="lk-auth__kicker">Account recovery</span>
    <h1>Choose a new password</h1>
    <p>Pick a strong password you have not used before. You will be signed in right after.</p>
</div>

@if ($errors->any())
    <div class="lk-alert lk-alert--error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        <span>{{ $errors->first() }}</span>
    </div>
@endif

<form method="POST" action="{{ route('password.store') }}" class="lk-form" novalidate>
    @csrf
    <input type="hidden" name="token" value="{{ $request->route('token') }}">

    <div class="lk-field">
        <label for="email">Email address</label>
        <input
            type="email"
            id="email"
            name="email"
            value="{{ old('email', $request->email) }}"
            class="lk-input @error('email') is-invalid @enderror"
            required
            readonly
            autocomplete="username"
            aria-invalid="{{ $errors->has('email') ? 'true' : 'false' }}"
        >
        @error('email')
            <p class="lk-field__error">{{ $message }}</p>
        @enderror
    </div>

    <div class="lk-field">
        <label for="password">New password</label>
        <div class="lk-input-wrap lk-input-wrap--password">
            <input
                type="password"
                id="password"
                name="password"
                class="lk-input @error('password') is-invalid @enderror"
                placeholder="At least 8 characters"
                required
                autofocus
                autocomplete="new-password"
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

    <div class="lk-field">
        <label for="password_confirmation">Confirm new password</label>
        <div class="lk-input-wrap lk-input-wrap--password">
            <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                class="lk-input"
                placeholder="Repeat your new password"
                required
                autocomplete="new-password"
            >
            <button type="button" class="lk-password-toggle" data-password-toggle="password_confirmation" aria-label="Show password" aria-pressed="false">
                <svg class="lk-eye--show" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="lk-eye--hide" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.8"/><path d="M6.2 6.2A17.2 17.2 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 4.2-.8"/></svg>
            </button>
        </div>
    </div>

    <button type="submit" class="lk-btn lk-btn--primary">
        Set new password
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
    </button>
</form>

<a href="{{ route('login') }}" class="lk-auth__back">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
    Back to sign in
</a>

@endsection
