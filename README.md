# LaraKit — Laravel + Vue Starter Kit

A generic-purpose admin starter kit built with **Laravel 12** and **Vue 3**. Use it as a clean base for APIs and SPA admin panels with roles, permissions, and a reusable table/CRUD pattern.

## Stack

| Layer | Tech |
|--------|------|
| Backend | Laravel 12, Sanctum, Spatie Permission, Activity Log |
| Auth | Laravel Breeze (Blade) + Sanctum tokens for the SPA |
| Frontend | Vue 3, TypeScript, Vue Router, Pinia, Vite, Tailwind CSS |
| Tests | Pest |

## Features

- Blade auth flows (login, register, password reset, email verification)
- Vue SPA admin under `/app` with GenericTable CRUD modules
- Users, Roles, and Permissions management
- Spatie RBAC with `role` / `permission` middleware aliases
- Dropdown master data (countries, languages, currencies, timezones)
- PWA hooks (manifest + service worker)
- Impersonation support for admins

## Requirements

- PHP 8.3+
- Composer
- Node.js 18+
- SQLite (default), MySQL, or PostgreSQL

## Installation

```bash
composer install
cp .env.example .env
php artisan key:generate

# SQLite (default in .env.example)
touch database/database.sqlite

# Or configure MySQL/PostgreSQL in .env, then:
php artisan migrate --seed

npm install
npm run dev
php artisan serve
```

Open [http://localhost:8000](http://localhost:8000).

### Default admin

| Field | Value |
|--------|--------|
| Email | `admin@example.com` |
| Password | `password` |

Change these immediately after first login.

## Project layout

```
app/
  Http/Controllers/Backend/   # Admin API controllers
  Models/                     # Eloquent models (Role, Permission extend Spatie)
  Services/                   # Business logic
resources/
  ts/backend/                 # Vue admin SPA
  ts/frontend/                # Optional public SPA entry
  views/layouts/backend/      # Blade shells for auth + SPA mount
routes/
  web.php                     # Auth + SPA shell routes
  api.php                     # Sanctum-protected /api/app/* routes
database/
  seeders/                    # Master data + admin + RBAC seeders
```

## Adding a module

1. Migration + model
2. Service + Form Request + Controller under `Backend/`
3. Register resource routes in `routes/api.php`
4. Vue pages under `resources/ts/backend/Pages/YourModule/`
5. Routes in `resources/ts/backend/router.ts`
6. Menu entry in `resources/ts/backend/Utils/Sidebar.ts`
7. Permissions in `RolePermissionSeeder` (then re-seed or insert manually)

## Scripts

```bash
npm run dev       # Vite HMR
npm run build     # Production assets
php artisan test  # Pest suite
```

## License

MIT
