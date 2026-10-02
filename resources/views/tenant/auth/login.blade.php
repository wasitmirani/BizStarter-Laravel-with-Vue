@extends('layouts.tenant.auth-master')

@php
    $tenant = $tenant ?? tenant();
    $tenantName = $tenant?->name ?? config('app.name');
    $tenantColor = $tenant?->primary_color ?: '#4f46e5';
    $tenantLogo = $tenant?->logo;
@endphp

@section('title', 'Sign In — ' . $tenantName)
@section('content')

<div class="row g-0 auth-modern-row justify-content-center align-items-center">
    <div class="col-md-9 col-lg-10 col-xxl-8">
        <div class="p-4 p-md-10 pb-20 pb-md-16 pb-xl-10">
            <div class="mb-4 text-center">
                <a href="{{ route('tenant.login') }}" class="logos d-inline-flex align-items-center justify-content-center">
                    @if ($tenantLogo)
                        <img src="{{ $tenantLogo }}" loading="lazy" alt="{{ $tenantName }}" class="h-7">
                    @else
                        <img src="{{ global_asset('/assets/images/main-logo.webp') }}" loading="lazy" alt="{{ $tenantName }}" class="h-7 logo-dark">
                        <img src="{{ global_asset('/assets/images/logo-white.webp') }}" loading="lazy" alt="{{ $tenantName }}" class="h-7 logo-light">
                    @endif
                </a>
            </div>
            <h5 class="mb-2 text-center text-gradient fs-lg fw-medium">{{ $tenantName }}</h5>
            <p class="text-center text-muted mb-8">Sign in to your workspace</p>
            <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-8">
                <h6 class="mb-0 fs-16 fw-bold">Sign In</h6>
                <span class="badge border"
                    style="border-color: {{ $tenantColor }}33; color: {{ $tenantColor }};">
                    {{ request()->getHost() }}
                </span>
            </div>
            <form method="POST" action="{{ route('tenant.login') }}" id="tenant-login-form">
                @csrf

                @if (session('status'))
                    <div class="alert alert-success alert-dismissible" role="alert">
                        <span>{{ session('status') }}</span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                @endif

                @if ($errors->any())
                    <div class="alert alert-danger alert-dismissible" role="alert">
                        <span>{{ $errors->first() }}</span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                @endif

                <div class="row g-6">
                    <div class="col-12">
                        <label for="emailInput" class="form-label">Email</label>
                        <input
                            type="email"
                            id="emailInput"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="Enter your email"
                            class="form-control @error('email') is-invalid @enderror"
                            required
                            autofocus
                            autocomplete="username"
                        >
                    </div>
                    <div class="col-12">
                        <label for="passwordInput" class="form-label">Password</label>
                        <div class="position-relative">
                            <input
                                type="password"
                                id="passwordInput"
                                name="password"
                                class="form-control pe-8 @error('password') is-invalid @enderror"
                                placeholder="Enter your password"
                                required
                                autocomplete="current-password"
                            >
                            <div class="position-absolute top-50 end-0 me-3 translate-middle-y text-muted cursor-pointer" id="passwordShowIcon" role="button" tabindex="0" aria-label="Toggle password visibility">
                                <i class="ri-eye-off-line fs-5"></i>
                                <i class="ri-eye-line fs-5 d-none"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 d-flex justify-content-between align-items-center">
                        <div class="form-check check-primary">
                            <input type="checkbox" id="rememberMe" name="remember" class="form-check-input" {{ old('remember') ? 'checked' : '' }}>
                            <label for="rememberMe" class="form-check-label">Remember me</label>
                        </div>
                    </div>
                    <div class="col-12 mt-7">
                        <button type="submit" class="btn btn-primary w-100">Sign In</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center p-5 pb-xxl-0">
            <p class="mb-0 text-center fs-15 text-muted">© <script>document.write(new Date().getFullYear())</script> {{ $tenantName }}</p>
        </div>
    </div>
</div>

@endsection
