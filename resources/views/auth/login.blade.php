@extends('layouts.backend.auth-master')
@section('title', 'Sign In')
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
            <h5 class="mb-12 text-center text-gradient fs-lg fw-medium">Welcome Back!</h5>
            <div class="d-flex flex-wrap gap-2 justify-content-between mb-8">
                <h6 class="mb-0 fs-16 fw-bold">Sign In</h6>
                <p class="text-center text-muted">Don't have an account? <a href="{{ route('register') }}" class="text-body fw-semibold">Sign Up</a></p>
            </div>
            <form method="POST" action="{{ route('login') }}">
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
                        <label for="emailInput" class="form-label">Email Or Username</label>
                        <input
                            type="text"
                            id="emailInput"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="Enter your email or username"
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
                            <div class="position-absolute top-50 end-0 me-3 translate-middle-y text-muted cursor-pointer" id="passwordShowIcon">
                                <i data-lucide="eye-off" class="size-5"></i>
                                <i data-lucide="eye" class="size-5 d-none"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 d-flex justify-content-between align-items-center">
                        <div class="form-check check-primary">
                            <input type="checkbox" id="rememberMe" name="remember" class="form-check-input" {{ old('remember') ? 'checked' : '' }}>
                            <label for="rememberMe" class="form-check-label">Remember me</label>
                        </div>
                        @if (Route::has('password.request'))
                            <a href="{{ route('password.request') }}" class="fs-sm">Forgot Password?</a>
                        @endif
                    </div>
                    <div class="col-12 mt-7">
                        <button type="submit" class="btn btn-primary w-100">Sign In</button>
                    </div>
                </div>
            </form>
            <div class="position-relative text-center mt-8 mb-5 d-flex align-items-center gap-2">
                <div class="border-top border-dark-subtle w-50 border-dashed"></div>
                <p class="text-muted p-2 flex-shrink-0 ">Or Sign In With</p>
                <div class="end-0 border-top border-dark-subtle w-50  border-dashed"></div>
            </div>
            <div class="d-flex gap-5 justify-content-center">
               <a href="#!" class="btn btn-danger gradient-dark-danger rounded-circle size-9 btn-icon">
                    <i class="ri-google-fill fs-lg"></i>
                </a>
               <a href="#!" class="btn btn-primary gradient-dark-primary rounded-circle size-9 btn-icon">
                    <i class="ri-facebook-fill fs-lg"></i>
                </a>
               <a href="#!" class="btn btn-dark gradient-dark-dark rounded-circle size-9 btn-icon">
                    <i class="ri-github-fill fs-lg"></i>
                </a>
               <a href="#!" class="btn btn-secondary gradient-dark-secondary rounded-circle size-9 btn-icon">
                    <i class="ri-linkedin-fill fs-lg"></i>
                </a>
               <a href="#!" class="btn btn-info gradient-dark-info rounded-circle size-9 btn-icon">
                    <i class="ri-twitter-fill fs-lg"></i>
                </a>
            </div>
        </div>
        <div class="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center p-5 pb-xxl-0">
            <p class="mb-0 text-center fs-15 text-muted">© <script>document.write(new Date().getFullYear())</script> {{ config('app.name') }}</p>
        </div>
    </div>
</div>

@endsection
