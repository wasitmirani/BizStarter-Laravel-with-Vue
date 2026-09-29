# LaraKit — Laravel + Vue Starter Kit

A multi-tenant admin starter kit built with **Laravel 12** and **Vue 3**. Use it as a base for APIs and SPA admin panels with roles, permissions, reusable CRUD modules, and database-per-tenant tenancy via [stancl/tenancy](https://tenancyforlaravel.com).

## Stack

| Layer | Tech |
|--------|------|
| Backend | Laravel 12, Sanctum, Spatie Permission, Activity Log |
| Tenancy | stancl/tenancy (domain identification, separate tenant DBs) |
| Auth | Laravel Breeze (Blade) + Sanctum tokens for the SPA |
| Frontend | Vue 3, TypeScript, Vue Router, Pinia, Vite, Tailwind CSS |
| Desktop (optional) | Electron |
| Tests | Pest |

## Features

- Blade auth flows (login, register, password reset, email verification)
- Vue SPA admin under `/app` with GenericTable CRUD modules
- Users, Roles, and Permissions management
- Spatie RBAC with `role` / `permission` middleware aliases
- Multi-tenancy: central app + per-tenant databases (domain-based)
- Dropdown master data (countries, languages, currencies, timezones)
- Admin impersonation
- Optional Electron desktop shell

## Requirements

- PHP 8.3+
- Composer
- Node.js 18+
- SQLite (default in `.env.example`), MySQL/MariaDB, or PostgreSQL

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate

# SQLite (default)
touch database/database.sqlite

# Or set MySQL / PostgreSQL in .env, then:
php artisan migrate --seed

npm install
npm run dev
php artisan serve
```

Open [http://localhost:8000](http://localhost:8000). The root route redirects to login or `/app/dashboard`.

### Default admin

| Field | Value |
|--------|--------|
| Email | `admin@example.com` |
| Password | `password` |

Change these immediately after first login.

## Multi-tenancy

LaraKit uses **stancl/tenancy** with domain identification and a separate database per tenant.

| Piece | Location |
|--------|----------|
| Config | `config/tenancy.php` |
| Tenant model | `app/Models/Tenant.php` |
| Provider | `app/Providers/TenancyServiceProvider.php` |
| Central domains | `127.0.0.1`, `localhost` (in config) |
| Tenant routes | `routes/tenant.php` |
| Tenant migrations | `database/migrations/tenant/` |
| Central migrations | `database/migrations/` (includes `tenants` + `domains`) |

### Create a tenant

```php
$tenant = \App\Models\Tenant::create(['id' => 'acme']);
$tenant->domains()->create(['domain' => 'acme.localhost']);
```

On create, the package creates the tenant database (e.g. `tenantacme`) and runs migrations from `database/migrations/tenant/`.

Map the domain locally (e.g. `acme.localhost` → `127.0.0.1` in your hosts file) so tenant routes resolve.

### Tenancy commands

```bash
php artisan tenants:list
php artisan tenants:migrate
php artisan tenants:seed
php artisan tenants:rollback
```

Put **tenant-only** schema in `database/migrations/tenant/`. Keep shared/central tables in `database/migrations/`.

## Project layout

```
app/
  Http/Controllers/Backend/   # Admin API controllers
  Models/                     # Eloquent models (Tenant, Role, Permission, …)
  Providers/                  # App + Tenancy service providers
  Services/                   # Business logic
resources/
  ts/backend/                 # Vue admin SPA
  ts/frontend/                # Optional public SPA entry
  views/layouts/backend/      # Blade shells for auth + SPA mount
routes/
  web.php                     # Auth + SPA shell routes
  api.php                     # Sanctum-protected /api/app/* routes
  tenant.php                  # Tenant-domain routes
database/
  migrations/                 # Central DB (users, tenants, domains, …)
  migrations/tenant/          # Per-tenant DB migrations
  seeders/                    # Master data + admin + RBAC seeders
config/
  tenancy.php                 # Tenancy configuration
```

## Adding a module

1. Migration + model (central or `migrations/tenant/` as needed)
2. Service + Form Request + Controller under `Backend/`
3. Register resource routes in `routes/api.php`
4. Vue pages under `resources/ts/backend/Pages/YourModule/`
5. Routes in `resources/ts/backend/router.ts`
6. Menu entry in `resources/ts/backend/Utils/Sidebar.ts`
7. Permissions in `RolePermissionSeeder` (re-seed or insert manually)

## Scripts

```bash
npm run dev             # Vite HMR
npm run build           # Production assets
npm run electron:dev    # Laravel + Vite + Electron together
php artisan test        # Pest suite
php artisan serve       # App server
```

## License

MIT
