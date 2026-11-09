@extends('layouts.backend.auth-modern')
@section('title', 'Reset password')
@section('content')

<div class="lk-auth__head">
    <span class="lk-auth__kicker">Account recovery</span>
    <h1>Reset your password</h1>
    <p>Enter the email tied to your account and we will send you a secure reset link.</p>
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

<form method="POST" action="{{ route('password.email') }}" class="lk-form" novalidate>
    @csrf

    <div class="lk-field">
        <label for="email">Email address</label>
        <input
            type="email"
            id="email"
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

    <button type="submit" class="lk-btn lk-btn--primary">
        Send reset link
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
    </button>
</form>

<p class="lk-auth__note">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
    For security, reset links expire after 60 minutes and can only be used once.
</p>

<a href="{{ route('login') }}" class="lk-auth__back">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
    Back to sign in
</a>

@endsection
