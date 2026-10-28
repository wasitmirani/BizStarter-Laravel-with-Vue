@extends('layouts.backend.auth-master')
@section('title', 'Sign in · ' . config('app.name'))
@section('content')

<div class="card">
    <div class="card-body p-4 p-md-5">
        <div class="mb-4">
            <h1 class="h3 mb-2">Welcome back</h1>
            <p class="text-muted mb-0">Sign in to continue tracking your European master's applications.</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success d-flex align-items-start gap-2 py-2" role="alert">
                <x-ui-icon name="check-circle" :size="17" class="mt-1" />
                <span>{{ session('status') }}</span>
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger d-flex align-items-start gap-2 py-2" role="alert">
                <x-ui-icon name="alert" :size="17" class="mt-1" />
                <span>{{ $errors->first() }}</span>
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" id="loginForm" novalidate>
            @csrf

            <div class="mb-3">
                <label for="emailInput" class="form-label">Email or username</label>
                <input
                    type="text"
                    id="emailInput"
                    name="email"
                    value="{{ old('email') }}"
                    placeholder="you@example.com"
                    class="form-control @error('email') is-invalid @enderror"
                    required
                    autofocus
                    autocomplete="username"
                >
                @error('email')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <div class="d-flex align-items-center justify-content-between">
                    <label for="passwordInput" class="form-label mb-0">Password</label>
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="fs-14">Forgot password?</a>
                    @endif
                </div>
                <div class="position-relative mt-2">
                    <input
                        type="password"
                        id="passwordInput"
                        name="password"
                        class="form-control pe-10 @error('password') is-invalid @enderror"
                        style="padding-inline-end: 46px"
                        placeholder="Enter your password"
                        required
                        autocomplete="current-password"
                    >
                    <button
                        type="button"
                        class="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
                        id="passwordToggle"
                        aria-label="Show password"
                        aria-controls="passwordInput"
                        aria-pressed="false"
                    >
                        <x-ui-icon name="eye" :size="16" data-eye="show" />
                        <x-ui-icon name="eye-off" :size="16" class="d-none" data-eye="hide" />
                    </button>
                </div>
                @error('password')
                    <div class="invalid-feedback d-block">{{ $message }}</div>
                @enderror
            </div>

            <div class="form-check check-primary mb-4">
                <input type="checkbox" id="rememberMe" name="remember" class="form-check-input" {{ old('remember') ? 'checked' : '' }}>
                <label for="rememberMe" class="form-check-label">Keep me signed in on this device</label>
            </div>

            <button type="submit" class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" id="loginSubmit">
                <span class="spinner-border spinner-border-sm d-none" id="loginSpinner" aria-hidden="true"></span>
                <span id="loginSubmitLabel">Sign in</span>
                <x-ui-icon name="arrow-right" :size="17" id="loginSubmitIcon" />
            </button>
        </form>

        @if (Route::has('register'))
            <p class="text-center text-muted fs-15 mt-4 mb-0">
                New to {{ config('app.name') }}?
                <a href="{{ route('register') }}" class="fw-semibold">Create an account</a>
            </p>
        @endif
    </div>
</div>

<p class="d-flex align-items-center justify-content-center gap-2 text-muted fs-14 mt-4 mb-0">
    <x-ui-icon name="lock" :size="15" />
    Your applications and documents are visible only to you.
</p>

<script>
    (function () {
        var input = document.getElementById('passwordInput');
        var toggle = document.getElementById('passwordToggle');
        var showIcon = toggle ? toggle.querySelector('[data-eye="show"]') : null;
        var hideIcon = toggle ? toggle.querySelector('[data-eye="hide"]') : null;

        if (input && toggle) {
            toggle.addEventListener('click', function () {
                var reveal = input.type === 'password';
                input.type = reveal ? 'text' : 'password';
                toggle.setAttribute('aria-pressed', reveal ? 'true' : 'false');
                toggle.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
                if (showIcon) showIcon.classList.toggle('d-none', reveal);
                if (hideIcon) hideIcon.classList.toggle('d-none', !reveal);
                input.focus();
            });
        }

        var form = document.getElementById('loginForm');
        var submit = document.getElementById('loginSubmit');
        var spinner = document.getElementById('loginSpinner');
        var label = document.getElementById('loginSubmitLabel');
        var icon = document.getElementById('loginSubmitIcon');

        if (form && submit) {
            form.addEventListener('submit', function () {
                if (!form.checkValidity()) {
                    return;
                }

                submit.disabled = true;
                if (spinner) spinner.classList.remove('d-none');
                if (icon) icon.classList.add('d-none');
                if (label) label.textContent = 'Signing in…';
            });
        }
    })();
</script>

@endsection
