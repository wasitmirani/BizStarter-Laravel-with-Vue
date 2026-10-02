@php
    $tenantName = $tenant->name ?? config('app.name');
    $tenantColor = $tenant->primary_color ?? '#4f46e5';
    $userName = $user->name ?? auth()->user()?->name ?? 'User';
    $currentRoute = Route::currentRouteName();
@endphp

<div id="main-sidebar" class="main-sidebar">
    <div class="sidebar-wrapper">
        <div class="navbar-brand-box d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
            <a href="{{ route('tenant.dashboard') }}" class="logos">
                @if (!empty($tenant->logo))
                    <img src="{{ $tenant->logo }}" loading="lazy" height="24" alt="{{ $tenantName }}">
                @else
                    <img src="{{ asset('/assets/images/main-logo.webp') }}" loading="lazy" height="24" alt="{{ $tenantName }}" class="logo-dark">
                    <img src="{{ asset('/assets/images/logo-white.webp') }}" loading="lazy" height="24" alt="{{ $tenantName }}" class="logo-light">
                @endif
            </a>
            <button type="button" class="btn btn-sm btn-icon d-lg-none" id="closeSidebar" aria-label="Close sidebar">
                <i class="mgc_close_line"></i>
            </button>
        </div>

        <div class="px-4 py-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
                <div class="avatar size-10 rounded d-flex align-items-center justify-content-center text-white fw-semibold"
                     style="background-color: {{ $tenantColor }}">
                    {{ strtoupper(substr($tenantName, 0, 1)) }}
                </div>
                <div class="min-w-0">
                    <h6 class="mb-0 text-truncate">{{ $tenantName }}</h6>
                    <p class="text-muted fs-sm mb-0 text-truncate">{{ $userName }}</p>
                </div>
            </div>
        </div>

        <div class="navbar-menu px-5" id="navbar-menu-list" data-simplebar>
            <ul class="list-unstyled p-0 navbar-nav-menu">
                <li class="nav-menu-title">Main</li>
                <li class="nav-item">
                    <a class="nav-link {{ $currentRoute === 'tenant.dashboard' ? 'active' : '' }}"
                       href="{{ route('tenant.dashboard') }}">
                        <span class="icons"><i class="mgc_dashboard_line"></i></span>
                        <span class="content">Dashboard</span>
                    </a>
                </li>

                <li class="nav-menu-title">Account</li>
                <li class="nav-item">
                    <form method="POST" action="{{ route('tenant.logout') }}" class="m-0">
                        @csrf
                        <button type="submit" class="nav-link border-0 bg-transparent w-100 text-start">
                            <span class="icons"><i class="mgc_exit_line"></i></span>
                            <span class="content">Log Out</span>
                        </button>
                    </form>
                </li>
            </ul>
        </div>
    </div>
</div>
