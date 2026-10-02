@php
    $tenantName = $tenant->name ?? config('app.name');
    $tenantColor = $tenant->primary_color ?? '#4f46e5';
    $userName = $user->name ?? auth()->user()?->name ?? 'User';
    $userEmail = $user->email ?? auth()->user()?->email ?? '';
    $userInitial = strtoupper(substr($userName, 0, 1));
@endphp

<header class="main-topbar" id="main-topbar">
    <div class="navbar-brand">
        <div class="logos">
            <a href="{{ route('tenant.dashboard') }}" aria-label="Topbar Logo">
                @if (!empty($tenant->logo))
                    <img src="{{ $tenant->logo }}" loading="lazy" height="24" alt="{{ $tenantName }}">
                @else
                    <img src="{{ asset('/assets/images/main-logo.webp') }}" loading="lazy" height="24" alt="{{ $tenantName }}" class="logo-dark">
                    <img src="{{ asset('/assets/images/logo-white.webp') }}" loading="lazy" height="24" alt="{{ $tenantName }}" class="logo-light">
                @endif
            </a>
        </div>
        <button type="button" id="toggleSidebar" class="sidebar-toggle btn p-0" aria-label="sidebar-toggle">
            <i class="mgc_layout_rightbar_open_line"></i>
        </button>
    </div>

    <div class="align-items-center d-none d-lg-flex ms-4">
        <div class="position-relative navbar-search">
            <input type="search" class="form-control border-0 shadow-none rounded-pill" placeholder="Search {{ $tenantName }}">
            <i class="mgc_search_ai_line icon"></i>
        </div>
    </div>

    <div class="d-flex align-items-center gap-1 gap-md-2 gap-xl-10px ms-auto">
        <button class="btn topbar-link" id="darkModeButton" type="button" aria-label="Theme">
            <span class="topbar-icon">
                <i class="mgc_moon_line dark-icon"></i>
                <i class="mgc_sun_line light-icon"></i>
            </span>
        </button>

        <div class="dropdown profile-dropdown">
            <button class="btn topbar-link bg-transparent w-auto gap-2 ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="d-flex align-items-center gap-2">
                    <span class="text-end fs-sm d-none d-xl-block">
                        <span class="fw-medium d-block lh-sm admin-name">{{ $userName }}</span>
                        <span class="d-inline-block admin-designation">{{ $tenantName }}</span>
                    </span>
                    <span class="position-relative ms-6">
                        <span class="object-fit-cover rounded-circle size-9 d-inline-flex align-items-center justify-content-center text-white fw-semibold"
                              style="background-color: {{ $tenantColor }}">
                            {{ $userInitial }}
                        </span>
                        <span class="size-2-5 bg-success rounded-circle d-block position-absolute bottom-0 end-0 border profile-border-color border-2"></span>
                    </span>
                </span>
            </button>
            <div class="dropdown-menu p-0 profile-dropdown-menu dropdown-menu-end">
                <span class="text-muted px-5 pt-4 d-block">Welcome Back, {{ explode(' ', $userName)[0] }}!</span>
                <ul class="list-unstyled mb-0 p-2 border-bottom">
                    <li>
                        <span class="dropdown-item align-items-center px-3 d-flex text-muted">
                            <i class="mgc_mail_line d-inline-block me-2"></i> {{ $userEmail }}
                        </span>
                    </li>
                    <li>
                        <a class="dropdown-item align-items-center px-3 d-flex" href="{{ route('tenant.dashboard') }}">
                            <i class="mgc_dashboard_line d-inline-block me-2"></i> Dashboard
                        </a>
                    </li>
                </ul>
                <div class="border-bottom">
                    <div class="d-flex justify-content-between align-items-center py-3 px-5">
                        <div>
                            <h6 class="mb-0">{{ $tenantName }}</h6>
                            <p class="text-muted fs-sm mb-0">{{ request()->getHost() }}</p>
                        </div>
                        <span class="badge bg-primary py-6px px-10px rounded-pill">Tenant</span>
                    </div>
                </div>
                <ul class="list-unstyled mb-0 px-2">
                    <li>
                        <form method="POST" action="{{ route('tenant.logout') }}" class="m-0">
                            @csrf
                            <button type="submit" class="dropdown-item align-items-center d-flex py-4 text-danger w-100">
                                <i class="mgc_key_2_line d-inline-block me-2"></i> Log Out
                            </button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</header>
