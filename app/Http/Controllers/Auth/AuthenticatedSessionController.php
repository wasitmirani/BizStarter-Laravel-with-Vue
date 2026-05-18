<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $user=auth()->user();
        $token = auth()->user()->createToken(genUUID())->plainTextToken;
        $user->token=$token;
        $user->last_login=Date('Y-m-d H:i:s');
        $user->save();
        session(['login' => true]);
        logDeviceHistory();
        $request->session()->regenerate();

        return redirect()->intended(route('backend.dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Fallback logout for GET requests (UI may navigate if JS not present).
     */
    public function getDestroy(Request $request): RedirectResponse
    {
        // Perform same logout steps as POST destroy
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
