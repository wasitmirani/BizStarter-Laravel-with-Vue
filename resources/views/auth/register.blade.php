@extends('layouts.backend.auth-master')
@section('title', 'Create Account')
@section('content')

<div class="row g-0 auth-modern-row justify-content-center align-items-center">
    <div class="col-md-9 col-lg-7 col-xxl-6">
        <div class="p-4 p-md-10 pb-20 pb-md-16 pb-xl-10">
            <div class="mb-4 text-center">
                <a href="{{ route('login') }}" class="logos">
                    <img src="{{ asset('/assets/images/main-logo.webp') }}" loading="lazy" alt="{{ config('app.name') }}" class="h-7 logo-dark">
                    <img src="{{ asset('/assets/images/logo-white.webp') }}" loading="lazy" alt="{{ config('app.name') }}" class="h-7 logo-light">
                </a>
            </div>
            <h5 class="mb-12 text-center text-gradient fs-lg fw-medium">Start your workspace</h5>
            <div class="d-flex flex-wrap gap-2 justify-content-between mb-8">
                <h6 class="mb-0 fs-16 fw-bold">Create account</h6>
                <p class="text-center text-muted">Already registered? <a href="{{ route('login') }}" class="text-body fw-semibold">Sign In</a></p>
            </div>
            <form method="POST" action="{{ route('register') }}">
                @csrf

                @if ($errors->any())
                    <div class="alert alert-danger alert-dismissible" role="alert">
                        <span>{{ $errors->first() }}</span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                @endif

                <div class="row g-6">
                    <div class="col-12">
                        <label for="nameInput" class="form-label">Full name</label>
                        <input
                            type="text"
                            id="nameInput"
                            name="name"
                            value="{{ old('name') }}"
                            placeholder="Jane Cooper"
                            class="form-control @error('name') is-invalid @enderror"
                            required
                            autofocus
                            autocomplete="name"
                        >
                    </div>
                    <div class="col-12">
                        <label for="workspaceInput" class="form-label">Workspace name <span class="text-muted">(optional)</span></label>
                        <input
                            type="text"
                            id="workspaceInput"
                            name="workspace_name"
                            value="{{ old('workspace_name') }}"
                            placeholder="Acme Inc."
                            class="form-control @error('workspace_name') is-invalid @enderror"
                            autocomplete="organization"
                        >
                        <div class="form-text">We will create it for you with a free trial.</div>
                    </div>
                    <div class="col-12">
                        <label for="emailInput" class="form-label">Work email</label>
                        <input
                            type="email"
                            id="emailInput"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="you@company.com"
                            class="form-control @error('email') is-invalid @enderror"
                            required
                            autocomplete="username"
                        >
                    </div>
                    <div class="col-12">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input
                            type="password"
                            id="passwordInput"
                            name="password"
                            class="form-control @error('password') is-invalid @enderror"
                            placeholder="At least 8 characters"
                            required
                            autocomplete="new-password"
                        >
                    </div>
                    <div class="col-12">
                        <label for="passwordConfirmInput" class="form-label">Confirm password</label>
                        <input
                            type="password"
                            id="passwordConfirmInput"
                            name="password_confirmation"
                            class="form-control"
                            placeholder="Repeat your password"
                            required
                            autocomplete="new-password"
                        >
                    </div>
                    <div class="col-12 mt-7">
                        <button type="submit" class="btn btn-primary w-100">Create account</button>
                    </div>
                    <div class="col-12">
                        <p class="mb-0 text-center fs-sm text-muted">
                            By creating an account you agree to our terms and privacy policy.
                        </p>
                    </div>
                </div>
            </form>
        </div>
        <div class="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center p-5 pb-xxl-0">
            <p class="mb-0 text-center fs-15 text-muted">Ac <script>document.write(new Date().getFullYear())</script> {{ config('app.name') }}</p>
        </div>
    </div>
</div>

@endsection
