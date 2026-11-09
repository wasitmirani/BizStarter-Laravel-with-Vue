@extends('layouts.backend.auth-modern')
@section('title', 'Create account')
@section('content')

<div class="lk-auth__head">
    <span class="lk-auth__kicker">Get started</span>
    <h1>Create your workspace</h1>
    <p>Start your free trial. No credit card required — invite your team when you are ready.</p>
</div>

@if ($errors->any())
    <div class="lk-alert lk-alert--error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        <span>{{ $errors->first() }}</span>
    </div>
@endif

<form method="POST" action="{{ route('register') }}" class="lk-form" novalidate>
    @csrf

    <div class="lk-field">
        <label for="nameInput">Full name</label>
        <input
            type="text"
            id="nameInput"
            name="name"
            value="{{ old('name') }}"
            class="lk-input @error('name') is-invalid @enderror"
            placeholder="Jane Cooper"
            required
            autofocus
            autocomplete="name"
            aria-invalid="{{ $errors->has('name') ? 'true' : 'false' }}"
        >
        @error('name')
            <p class="lk-field__error">{{ $message }}</p>
        @enderror
    </div>

    <div class="lk-field">
        <span class="lk-field__label">Workspace name <span class="lk-field__optional">(optional)</span></span>
        <input
            type="text"
            id="workspaceInput"
            name="workspace_name"
            value="{{ old('workspace_name') }}"
            class="lk-input @error('workspace_name') is-invalid @enderror"
            placeholder="Acme Inc."
            autocomplete="organization"
            aria-invalid="{{ $errors->has('workspace_name') ? 'true' : 'false' }}"
        >
        @error('workspace_name')
            <p class="lk-field__error">{{ $message }}</p>
        @else
            <p class="lk-field__hint">Leave blank and we will name it after your company.</p>
        @enderror
    </div>

    <div class="lk-field">
        <label for="emailInput">Work email</label>
        <input
            type="email"
            id="emailInput"
            name="email"
            value="{{ old('email') }}"
            class="lk-input @error('email') is-invalid @enderror"
            placeholder="you@company.com"
            required
            autocomplete="username"
            aria-invalid="{{ $errors->has('email') ? 'true' : 'false' }}"
        >
        @error('email')
            <p class="lk-field__error">{{ $message }}</p>
        @enderror
    </div>

    <div class="lk-field">
        <label for="passwordInput">Password</label>
        <div class="lk-input-wrap lk-input-wrap--password">
            <input
                type="password"
                id="passwordInput"
                name="password"
                class="lk-input @error('password') is-invalid @enderror"
                placeholder="At least 8 characters"
                required
                autocomplete="new-password"
                aria-invalid="{{ $errors->has('password') ? 'true' : 'false' }}"
            >
            <button type="button" class="lk-password-toggle" data-password-toggle="passwordInput" aria-label="Show password" aria-pressed="false">
                <svg class="lk-eye--show" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="lk-eye--hide" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.8"/><path d="M6.2 6.2A17.2 17.2 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 4.2-.8"/></svg>
            </button>
        </div>
        @error('password')
            <p class="lk-field__error">{{ $message }}</p>
        @enderror
    </div>

    <div class="lk-field">
        <label for="passwordConfirmInput">Confirm password</label>
        <div class="lk-input-wrap lk-input-wrap--password">
            <input
                type="password"
                id="passwordConfirmInput"
                name="password_confirmation"
                class="lk-input"
                placeholder="Repeat your password"
                required
                autocomplete="new-password"
            >
            <button type="button" class="lk-password-toggle" data-password-toggle="passwordConfirmInput" aria-label="Show password" aria-pressed="false">
                <svg class="lk-eye--show" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="lk-eye--hide" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.8"/><path d="M6.2 6.2A17.2 17.2 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 4.2-.8"/></svg>
            </button>
        </div>
    </div>

    <button type="submit" class="lk-btn lk-btn--primary">
        Create account
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
    </button>
</form>

<p class="lk-auth__legal">
    By creating an account you agree to our terms of service and privacy policy.
</p>

<p class="lk-auth__switch">
    Already have an account? <a href="{{ route('login') }}">Sign in</a>
</p>

@endsection
