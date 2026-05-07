<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} | Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: "#3b82f6"
                    }
                }
            }
        };
    </script>
</head>
<body class="min-h-screen bg-slate-100">
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div class="hidden lg:flex bg-gradient-to-br from-slate-900 to-slate-700 text-white p-12 items-center">
            <div class="max-w-md">
                <p class="text-sm uppercase tracking-widest text-slate-300">Tenant Platform</p>
                <h1 class="mt-3 text-4xl font-bold leading-tight">{{ config('app.name') }}</h1>
                <p class="mt-4 text-slate-200">Manage tenants, users, settings, and roles from a single admin dashboard.</p>
            </div>
        </div>
        <div class="flex items-center justify-center p-6">
            <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <h2 class="text-2xl font-bold text-slate-900">Sign in</h2>
                <p class="text-slate-500 mt-1">Welcome back, enter your account details.</p>

                @if (session('status'))
                    <div class="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
                        {{ session('status') }}
                    </div>
                @endif

                <form method="POST" action="{{ route('login') }}" class="mt-6 space-y-5">
                    @csrf

                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value="{{ old('email') }}"
                            required
                            autofocus
                            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="name@company.com"
                        />
                        @error('email')
                            <p class="text-sm text-red-600 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter your password"
                        />
                        @error('password')
                            <p class="text-sm text-red-600 mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="flex items-center justify-between text-sm">
                        <label class="inline-flex items-center gap-2 text-slate-600">
                            <input type="checkbox" name="remember" class="rounded border-slate-300">
                            <span>Remember me</span>
                        </label>
                        @if (Route::has('password.request'))
                            <a href="{{ route('password.request') }}" class="text-primary hover:underline">Forgot password?</a>
                        @endif
                    </div>

                    <button
                        type="submit"
                        class="w-full rounded-lg bg-primary text-white py-2.5 font-medium hover:opacity-90 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>