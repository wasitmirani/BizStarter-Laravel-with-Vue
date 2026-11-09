@extends('layouts.backend.auth-modern')
@section('title', 'Verify email')
@section('content')

<div class="lk-auth__head">
    <span class="lk-auth__kicker">One last step</span>
    <h1>Verify your email</h1>
    <p>We sent a verification link to your inbox. Open it to activate your workspace.</p>
</div>

@if (session('status') == 'verification-link-sent')
    <div class="lk-alert lk-alert--success" role="status">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
        <span>A fresh verification link is on its way to your email address.</span>
    </div>
@endif

@if ($errors->any())
    <div class="lk-alert lk-alert--error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
        <span>{{ $errors->first() }}</span>
    </div>
@endif

<form method="POST" action="{{ route('verification.send') }}" class="lk-form">
    @csrf
    <button type="submit" class="lk-btn lk-btn--primary">
        Resend verification email
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
    </button>
</form>

<p class="lk-auth__note">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
    Check your spam folder if the email does not arrive within a few minutes.
</p>

<form method="POST" action="{{ route('logout') }}" class="lk-form" style="margin-top: 14px">
    @csrf
    <button type="submit" class="lk-btn lk-btn--ghost">Sign out</button>
</form>

@endsection
