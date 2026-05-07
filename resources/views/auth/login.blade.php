@extends('layouts.backend.auth-master')
@section('title', 'Sign In')
@section('content')
<div class="grid grid-cols-1 lg:grid-cols-2">
    <div class="card-body relative p-12.5">
        <!-- Auth Brand Logo -->
        <div class="mb-7.5 flex flex-col items-center justify-center text-center">
            <a href="{{ route('login') }}" class="auth-logo">
                <img src="{{ asset('/backend/images/logo-black.png') }}" alt="logo" class="flex dark:hidden" />
                <img src="{{ asset('/backend/images/logo.png') }}" alt="dark logo" class="hidden dark:flex" />
            </a>
            <h4 class="mt-5 mb-2 text-base font-bold">Great to see you here 👋</h4>
            <p class="text-default-400 mx-auto w-full lg:w-3/4">Let’s get you signed in. Enter your email and password to continue.</p>
        </div>

        <div class="grid lg:grid-cols-1 text-default-400 gap-3">
            <div>
                <a href="#!" class="btn border border-default-300 text-default-900 hover:border-default-400 hover:bg-default-50 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="me-1" width="13.68px" height="14px" viewBox="0 0 256 262">
                        <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                        <path
                            fill="#34a853"
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        ></path>
                        <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                        <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                    </svg>
                    Sign in with Google
                </a>
            </div>
            <div>
               
            </div>
        </div>

        <p class="relative my-5 text-center text-default-400 after:absolute after:start-0 after:end-0 after:top-2.75 after:h-0.75 after:border-t after:border-b after:border-dashed after:border-default-300">
            <span class="relative z-10 bg-card font-medium px-4">Continue with Email</span>
        </p>

        <div class="rounded-md">
            @if (session('status'))
                <div class="mb-4 rounded-md border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
                    {{ session('status') }}
                </div>
            @endif

            <form method="POST" action="{{ route('login') }}">
                @csrf
                <div class="mb-5">
                    <label for="userEmail" class="form-label">
                        Email address
                        <span class="text-danger">*</span>
                    </label>
                    <div class="input-icon-group">
                        <i class="iconify tabler--mail input-icon"></i>
                        <input
                            type="email"
                            class="form-input @error('email') border-danger @enderror"
                            id="userEmail"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="you&#64;example.com"
                            required
                            autofocus
                            autocomplete="username"
                        />
                    </div>
                    @error('email')
                        <p class="mt-1 text-xs text-danger">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-5">
                    <label for="userPassword" class="form-label">
                        Password
                        <span class="text-danger">*</span>
                    </label>
                    <div class="input-icon-group">
                        <i class="iconify tabler--lock-password input-icon"></i>
                        <input
                            type="password"
                            class="form-input @error('password') border-danger @enderror"
                            id="userPassword"
                            name="password"
                            placeholder="••••••••"
                            required
                            autocomplete="current-password"
                        />
                    </div>
                    @error('password')
                        <p class="mt-1 text-xs text-danger">{{ $message }}</p>
                    @enderror
                </div>

                <div class="mb-5 flex items-center justify-between">
                    <div class="flex items-start gap-2 lg:items-center">
                        <input class="form-checkbox form-checkbox-light mt-1 size-4.25 lg:mt-0" type="checkbox" id="rememberMe" name="remember" {{ old('remember') ? 'checked' : '' }} />
                        <label class="form-check-label" for="rememberMe">Keep me signed in</label>
                    </div>
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="text-default-400 underline underline-offset-4">Forgot Password?</a>
                    @endif
                </div>

                <div>
                    <button type="submit" class="btn bg-primary w-full py-3 font-semibold text-white hover:bg-primary-hover">Sign In</button>
                </div>
            </form>

            <p class="text-default-400 mt-7.5 text-center">
                New here?
                <a href="#" class="text-primary font-semibold underline underline-offset-4">Create an account</a>
            </p>

            <!-- Auth Footer -->
            <p class="text-default-400 mt-7.5 text-center">
                &copy;
                <script>
                    document.write(new Date().getFullYear())
                </script>
                    {{ config('app.name') }} - by
              
            </p>
        </div>
    </div>
    <div class="relative hidden h-full overflow-hidden rounded-e-2xl bg-cover bg-center object-cover lg:block" style="background-image: url({{ asset('/backend/images/auth2.jpg') }})">
        <div class="absolute inset-0 flex items-end justify-center rounded-e-sm p-9 [background:linear-gradient(to_top,#313a46,rgba(49,58,70,.8),rgba(49,58,70,.5))]"></div>
    </div>
</div>
@endsection