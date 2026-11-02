# LaraKit — Laravel + Vue Starter Kit

A multi-tenant admin starter kit built with **Laravel 13** and **Vue 3**. Use it as a base for APIs and SPA admin panels with roles, permissions, reusable CRUD modules, and database-per-tenant tenancy via [stancl/tenancy](https://tenancyforlaravel.com).

## Stack

| Layer | Tech |
|--------|------|
| Backend | Laravel 13, Sanctum, Spatie Permission, Activity Log |
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
- **Workspaces**: self-serve signup, members, invites, roles and seat limits
- **Plans & billing**: plan catalog, trials, subscribe/cancel/resume, invoices
- **API tokens**: scoped Sanctum tokens with expiry, managed from the UI
- **WhatsApp CRM**: shared inbox, contacts + tags, templates, campaigns, CRM KPIs
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

## Workspaces (SaaS layer)

Every account belongs to a **workspace** — the customer-facing SaaS layer. It is separate from stancl/tenancy tenants: a workspace is a product subscription with its own team, plan and invoices, while a tenant is an isolated database.

| Piece | Location |
|-------|----------|
| Models | `app/Models/Workspace.php`, `WorkspaceMember`, `WorkspaceInvitation`, `Plan`, `Subscription`, `Invoice` |
| Services | `app/Services/WorkspaceService.php`, `BillingService.php`, `ApiTokenService.php` |
| Controllers | `app/Http/Controllers/Backend/Workspace/`, `Backend/Billing/` |
| API routes | `routes/api.php` (`/api/app/workspace/*`, `/api/app/billing/*`, `/api/app/plans`, `/api/app/tokens`) |
| UI | `resources/ts/backend/Pages/workspace/`, `Pages/billing/`, `Pages/Settings/ApiTokens.vue` |
| Config | `config/billing.php` |

### What happens on signup

`POST /register` creates the user, assigns the `user` role, and provisions a workspace on the default plan with the registrant as **owner**. The workspace name falls back to the person's name when left blank.

### Team and invitations

- Owners and workspace admins can invite people by email, change roles and remove members.
- Invitations are emailed (`WorkspaceInvitationMail`) and expiring links are accepted at `/app/invitations/{token}`.
- Seat limits come from the active plan; `-1` means unlimited.
- The owner can never be demoted or removed by accepting an invitation.
- Global `super-admin` / `admin` users bypass workspace checks.

### Plans and billing

`PlanSeeder` publishes four plans (Free, Starter, Growth, Scale). Manage them from **Platform → Plans** (`plans-manage` permission).

- Billing is **provider-agnostic**: `BILLING_PROVIDER=manual` records invoices locally instead of calling a gateway. Add a driver in `BillingService` when you wire Stripe/Paddle/etc.
- A plan with `trial_days > 0` starts as `trialing`; trials do not create invoices.
- Switching to a paid plan (or changing cycle) records a paid invoice and sets the period end.
- Cancel sets `cancel_at_period_end`; resume clears it.
- Free plans have `current_period_end = null`, so they never lapse.
- Invoices are listed on **Billing & plans** and each one opens a printable page (`/app/settings/billing/invoices/{id}`).

Daily lifecycle sweep (registered in `routes/console.php`):

```bash
php artisan billing:sync
```

Expired trials fall back to the free plan (or `expired` when no free plan exists); paid periods that lapse become `past_due`.

### API tokens

Users mint personal Sanctum tokens under **Workspace → API tokens**, with abilities and an optional expiry. The plaintext token is shown once. Revoking deletes it immediately.

> Register/login routes are Blade pages; the SPA and SaaS panels authenticate with Sanctum bearer tokens. Workspace-scoped endpoints resolve the caller's workspace automatically.

## WhatsApp CRM

LaraKit ships a workspace-scoped CRM on the **official Meta WhatsApp Business Cloud API** (no QR pairing, no unofficial gateways).

| Piece | Location |
|-------|----------|
| Models | `app/Models/WhatsAppAccount.php`, `CrmContact`, `CrmTag`, `CrmConversation`, `CrmMessage`, `CrmTemplate`, `CrmCampaign`, `CrmCampaignRecipient` |
| Services | `app/Services/WhatsApp/WhatsAppCloudApi.php`, `app/Services/Crm/CrmService.php`, `CampaignService.php` |
| Controllers | `app/Http/Controllers/Backend/Crm/` |
| API routes | `routes/api.php` (`/api/app/crm/*`) plus the public webhook at `/api/whatsapp/webhook` |
| UI | `resources/ts/backend/Pages/whatsapp/` (`Inbox`, `Contacts`, `Templates`, `Campaigns`) and `Pages/Settings/WhatsApp.vue` |
| Config | `config/services.php` → `services.whatsapp` |
| Demo data | `database/seeders/CrmSeeder.php` |

### Connect a number

1. Create a Meta app with the **WhatsApp** product and add a business phone number.
2. Copy its **phone number ID** and the **WhatsApp Business account ID**.
3. Create a **System User** with `whatsapp_business_messaging` and `whatsapp_business_management`, then generate a permanent token.
4. Open **Workspace → WhatsApp** in the app, paste the IDs and token, and save. Credentials are stored encrypted per workspace (one account per workspace).
5. Set the callback URL to `https://your-domain/api/whatsapp/webhook`, paste the verify token shown in the UI, and subscribe to the **messages** field.
6. Use **Test connection** to confirm Meta accepts the credentials.

Set `WHATSAPP_APP_SECRET` in `.env` to enforce `X-Hub-Signature-256` verification on inbound webhooks. Without it the webhook accepts unsigned payloads so local testing works — always set it in production. `WHATSAPP_VERIFY_TOKEN` is an optional shared fallback when a workspace has no token of its own.

### What the modules do

- **Inbox** — shared conversations with status (open/pending/closed), assignment to workspace members, unread counts, search, and a message thread with delivery state. Inbound webhooks reopen closed chats. Replies are sent synchronously and stored even when delivery fails (`status=failed`), so nothing disappears silently.
- **Contacts & tags** — CRUD, CSV import/export, opt-in flag, lead/customer/blocked status, notes and colour-coded tags used for campaign audiences.
- **Templates** — local template library with category, language, header/footer and `{{1}}` variables. **Sync from WhatsApp** mirrors approved templates from the Meta account.
- **Campaigns** — pick a template (or write custom text) and a tag audience; **Send** runs synchronously, creating one conversation message per recipient and tracking sent/failed/delivered counts.
- **Dashboard** — the CRM strip shows contacts, open chats, unread, messages today and campaigns, plus the latest conversations.

Inbound flow: Meta → `POST /api/whatsapp/webhook` → signature check → `phone_number_id` resolves the workspace account → contact upsert by phone → conversation upsert (one per contact per workspace) → message stored idempotently by `wa_message_id` → delivery/read receipts applied to the message and campaign recipient.

All CRM endpoints resolve the caller's workspace and enforce membership/management checks; they do not rely on Spatie permissions, so the base `user` role can work the inbox while destructive operations stay with owners/admins.

## Multi-tenancy


LaraKit uses **stancl/tenancy** with domain identification and a separate database per tenant.

| Piece | Location |
|--------|----------|
| Config | `config/tenancy.php` |
| Tenant model | `app/Models/Tenant.php` |
| Provider | `app/Providers/TenancyServiceProvider.php` |
| Central domains | `127.0.0.1`, `localhost`, plus `APP_URL` host (in config) |
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
  Http/Controllers/Backend/   # Admin API controllers (incl. Workspace + Billing)
  Models/                     # Eloquent models (Tenant, Workspace, Plan, …)
  Mail/                       # Workspace invitation mail
  Providers/                  # App + Tenancy service providers
  Services/                   # Business logic (Workspace, Billing, ApiToken, …)
resources/
  ts/backend/                 # Vue admin SPA
  ts/frontend/                # Optional public SPA entry
  views/layouts/backend/      # Blade shells for auth + SPA mount
routes/
  web.php                     # Auth + SPA shell routes
  api.php                     # Sanctum-protected /api/app/* routes
  tenant.php                  # Tenant-domain routes
  console.php                 # Scheduled billing lifecycle
database/
  migrations/                 # Central DB (users, tenants, workspaces, plans, …)
  migrations/tenant/          # Per-tenant DB migrations
  seeders/                    # Master data + admin + RBAC + plans + workspace
config/
  tenancy.php                 # Tenancy configuration
  billing.php                 # Billing provider + currency
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
php artisan billing:sync # End trials / flag past-due (scheduled daily)
```

## License

MIT
