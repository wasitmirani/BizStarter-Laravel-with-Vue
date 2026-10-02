@extends('layouts.tenant.master')

@section('title', 'Dashboard — ' . ($tenant->name ?? config('app.name')))

@section('content')
<div class="gap-2 page-heading mb-4 flex-column flex-md-row">
    <h6 class="flex-grow-1 mb-0">Dashboard</h6>
    <ul class="breadcrumb flex-shrink-0 mb-0">
        <li class="breadcrumb-item"><a href="{{ route('tenant.dashboard') }}">Home</a></li>
        <li class="breadcrumb-item active">Dashboard</li>
    </ul>
</div>

<div class="row g-4">
    <div class="col-md-6 col-xl-4">
        <div class="card h-100">
            <div class="card-body">
                <div class="d-flex gap-4 align-items-center">
                    <div class="avatar size-12 rounded role-icon d-flex align-items-center justify-content-center text-white fw-bold"
                         style="background-color: {{ $tenant->primary_color ?? '#4f46e5' }}">
                        {{ strtoupper(substr($tenant->name ?? 'T', 0, 1)) }}
                    </div>
                    <div>
                        <h6 class="mb-1">{{ $tenant->name }}</h6>
                        <p class="text-muted mb-0 fs-sm">{{ request()->getHost() }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-xl-4">
        <div class="card h-100">
            <div class="card-body">
                <p class="text-muted mb-1 fs-sm">Signed in as</p>
                <h6 class="mb-1">{{ $user->name }}</h6>
                <p class="text-muted mb-0 fs-sm">{{ $user->email }}</p>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-xl-4">
        <div class="card h-100">
            <div class="card-body">
                <p class="text-muted mb-1 fs-sm">Status</p>
                <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle">Active session</span>
                <div class="mt-3">
                    <form method="POST" action="{{ route('tenant.logout') }}">
                        @csrf
                        <button type="submit" class="btn btn-outline-light btn-sm">
                            <i class="mgc_exit_line me-1"></i> Log Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="card mt-4">
    <div class="card-header">
        <h5 class="card-title mb-0">Welcome back</h5>
    </div>
    <div class="card-body">
        <p class="text-muted mb-0">
            You are authenticated on tenant <strong>{{ $tenant->name }}</strong>
            (ID: <code>{{ $tenant->id }}</code>). This login is isolated from the central admin panel.
        </p>
    </div>
</div>
@endsection
