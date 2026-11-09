@extends('layouts.backend.auth-modern')
@section('title', 'Sign in')
@section('content')

<div class="lk-auth__head">
    <span class="lk-auth__kicker">Welcome back</span>
    <h1>Sign in to your workspace</h1>
    <p>Use your email or username to pick up right where your team left off.</p>
</div>

@if (session('status'))
    <div class="lk-alert lk-alert--success" role="status">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
        <span>{{ session('status') }}</span>
    </div>
@endif

@if ($errors->any())
    <div class="lk-alert lk-alert--error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        <span>{{ $errors->first() }}</span>
    </div>
@endif

<form method="POST" action="{{ route('login') }}" class="lk-form" novalidate>
    @csrf

    <div class="lk-field">
        <label for="emailInput">Email or username</label>
        <input
            type="text"
            id="emailInput"
            name="email"
            value="{{ old('email') }}"
            class="lk-input @error('email') is-invalid @enderror"
            placeholder="you@company.com"
            required
            autofocus
            autocomplete="username"
            aria-invalid="{{ $errors->has('email') ? 'true' : 'false' }}"
        >
        @error('email')
            <p class="lk-field__error">{{ $message }}</p>
        @enderror
    </div>

    <div class="lk-field">
        <div class="lk-field__top">
            <label for="passwordInput">Password</label>
            @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}" class="lk-field__link">Forgot password?</a>
            @endif
        </div>
        <div class="lk-input-wrap lk-input-wrap--password">
            <input
                type="password"
                id="passwordInput"
                name="password"
                class="lk-input @error('password') is-invalid @enderror"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
                aria-invalid="{{ $errors->has('password') ? 'true' : 'false' }}"
            >
            <button
                type="button"
                class="lk-password-toggle"
                data-password-toggle="passwordInput"
                aria-label="Show password"
                aria-pressed="false"
            >
                <svg class="lk-eye--show" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="lk-eye--hide" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.8"/><path d="M6.2 6.2A17.2 17.2 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 4.2-.8"/></svg>
            </button>
        </div>
        @error('password')
            <p class="lk-field__error">{{ $message }}</p>
        @enderror
    </div>

    <div class="lk-auth__row">
        <label class="lk-check" for="rememberMe">
            <input type="checkbox" id="rememberMe" name="remember" {{ old('remember') ? 'checked' : '' }}>
            <span>Keep me signed in</span>
        </label>
    </div>

    <button type="submit" class="lk-btn lk-btn--primary">
        Sign in
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
    </button>
</form>

<p class="lk-auth__secure">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
    Secured with encrypted sessions and rate limiting
</p>

<p class="lk-auth__switch">
    New to {{ config('app.name') }}? <a href="{{ route('register') }}">Create a workspace</a>
</p>

@endsection
