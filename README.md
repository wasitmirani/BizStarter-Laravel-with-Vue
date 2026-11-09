# LaraKit — WhatsApp & Instagram CRM for Laravel + Vue

A production-ready, multi-tenant CRM built with **Laravel 13** and **Vue 3**. Run a shared WhatsApp and Instagram inbox, contacts, templates and campaigns for every customer workspace — with roles, plans, billing and a modern SaaS admin.

Use it as a product you can sell, or as a starting point for your own Laravel + Vue SaaS.

## Stack

| Layer | Tech |
|--------|------|
| Backend | Laravel 13, Sanctum, Spatie Permission, Activity Log |
| Tenancy | Workspaces (SaaS teams) + optional stancl/tenancy database isolation |
| Auth | Custom Blade auth screens (login, register, password reset, verification) + Sanctum tokens for the SPA |
| Frontend | Vue 3, TypeScript, Vue Router, Pinia, Vite, custom `lk-*` design system |
| Desktop (optional) | Electron |
| Tests | Pest |

## Features

- **Modern auth** — split-screen login, signup, password reset, confirmation and verification screens with accessible forms, password visibility toggles and no dead social-login buttons
- **CRM-first dashboard** — greeting hero, range selector, inbox KPIs, 14-day message sparkline, recent conversations, plan usage, channel mix, team snapshot, charts and activity
- **Shared inbox** — WhatsApp + Instagram in one queue, channel/status/assignee filters, unread toggle, pinning, priority, contact drawer, delivery ticks, deep links and mobile list/chat switching
- **Contacts & tags** — CRUD, CSV import/export, opt-in, lifecycle status, notes and colour-coded tags
- **Templates** — text/image/video/document headers, footer, variables, up to 3 typed buttons, live WhatsApp preview and Meta sync
- **Campaigns** — tag audiences, approved templates, scheduling, delivery tracking and per-recipient failure details
- Vue SPA admin under `/app` with GenericTable CRUD modules
- Users, Roles, and Permissions management
- Spatie RBAC with `role` / `permission` middleware aliases
- **Workspaces** — self-serve signup, members, invites, roles and seat limits
- **Multi-workspace switching** — one login, many teams, remembered per user
- **Plans & billing** — plan catalog, trials, subscribe/cancel/resume, invoices
- **API tokens** — scoped Sanctum tokens with expiry, managed from the UI
- **Security headers** — `nosniff`, strict referrer policy and a restrictive permissions policy on every response
- Multi-tenancy: central app + per-tenant databases (domain-based)
- Dropdown master data (countries, languages, currencies, timezones)
- Admin impersonation
- Optional Electron desktop shell

## UI & UX

The admin is a Vue 3 SPA mounted at `/app`, styled with the in-repo `lk-*`
design system. There is no Tailwind, Bootstrap or other CSS framework at
runtime — the compiled CSS in `public/build` is all you need.

| Area | What to expect |
|------|----------------|
| Auth | Self-contained split-screen pages (`resources/views/layouts/backend/auth-modern.blade.php`): brand panel, form card, inline validation, password visibility toggles, mobile-first collapse. No fake social-login buttons. |
| Dashboard | Greeting hero, date-range selector, KPI cards, 14-day message chart, recent conversations, plan usage, channel mix, team snapshot and activity feed. |
| Inbox | Channel segments (WhatsApp/Instagram), status pills, assignee and unread filters, pinning/priority, delivery ticks, contact drawer, deep links (`?conversation=id`) and mobile list/chat switching. |
| Templates | Live WhatsApp preview, media headers, variable samples and typed buttons. |
| Responsive | Sidebar collapses to a drawer on mobile; inbox and details panels stack at `1420px` and below. |

Auth pages are Blade only and do not load the SPA bundle, so they stay fast and
work even if a frontend chunk fails to load. The SPA shell and auth pages share
the same brand name from `config('app.name')`.

## Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Product overview, install and local development |
| [docs/PRODUCTION.md](docs/PRODUCTION.md) | Server requirements, env, queues, scheduler, Meta webhooks, security and go-live checks |

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

> Deploying this as a commercial product? Follow **[docs/PRODUCTION.md](docs/PRODUCTION.md)** for environment, queue/scheduler, storage, Meta webhook and security setup.

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

### Security defaults

- Authentication uses Laravel's session guard with rate-limited login attempts.
- Password reset links are single-use and expire after 60 minutes (`config/auth.php`).
- Email verification is supported; enable the `verified` middleware on protected route groups when you require it.
- `App\Http\Middleware\SecurityHeaders` adds `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy` and `X-Permitted-Cross-Domain-Policies: none` to every response.
- `X-Frame-Options` is intentionally not set so local preview tooling (Herd, Storybook) can embed the app. Add it at your proxy/CDN in production if you do not need embedding.
- Webhook signatures (`X-Hub-Signature-256`) are verified whenever `WHATSAPP_APP_SECRET` / `INSTAGRAM_APP_SECRET` is set.


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

- **Inbox** — shared conversations with status (open/pending/closed), assignment to workspace members, unread counts, search, and a message thread with delivery state. Inbound webhooks reopen closed chats. Replies are sent synchronously and stored even when delivery fails (`status=failed`), so nothing disappears silently. Images and attachments received from customers can be previewed or downloaded through a token-safe proxy (`GET /api/app/crm/messages/{message}/media`).
- **Contacts & tags** — CRUD, CSV import/export, opt-in flag, lead/customer/blocked status, notes and colour-coded tags used for campaign audiences.
- **Templates** — local template library with category, language, text/media headers, footer, `{{1}}` variables and up to 3 typed buttons (quick reply, website, call). The editor includes a live WhatsApp preview and sample values. **Sync from WhatsApp** mirrors approved templates from the Meta account.
- **Campaigns** — pick a template (or write custom text) and a tag audience; **Send** runs synchronously, creating one conversation message per recipient and tracking sent/failed/delivered counts. Set a **schedule** to queue a campaign instead: `php artisan crm:send-scheduled-campaigns` (scheduled every minute) sends due campaigns, and failures are stored on the campaign so they stay visible.
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
  Http/Middleware/            # SecurityHeaders and other global middleware
  Models/                     # Eloquent models (Tenant, Workspace, Plan, …)
  Mail/                       # Workspace invitation mail
  Providers/                  # App + Tenancy service providers
  Services/                   # Business logic (Workspace, Billing, ApiToken, …)
resources/
  ts/backend/                 # Vue admin SPA
  ts/frontend/                # Optional public SPA entry
  views/auth/                 # Login, register, reset, confirm, verify screens
  views/layouts/backend/      # SPA shell + auth-master / auth-modern layouts
routes/
  auth.php                    # Guest + verified auth routes
  web.php                     # Auth redirects + SPA shell
  api.php                     # Sanctum-protected /api/app/* routes
  tenant.php                  # Tenant-domain routes
  console.php                 # Scheduled billing lifecycle + CRM campaigns
database/
  migrations/                 # Central DB (users, tenants, workspaces, plans, …)
  migrations/tenant/          # Per-tenant DB migrations
  seeders/                    # Master data + admin + RBAC + plans + workspace
docs/
  PRODUCTION.md               # Deployment and go-live guide
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
npm run build           # Production assets (required on every deploy)
npm run electron:dev    # Laravel + Vite + Electron together
php artisan test        # Pest suite
php artisan serve       # App server
php artisan billing:sync # End trials / flag past-due (scheduled daily)
php artisan crm:send-scheduled-campaigns # Send due campaigns (scheduled every minute)
```

> Frontend changes are not live in production until `npm run build` finishes and
> `public/build` is deployed. Auth screens are Blade and do not require a build,
> but deploy the compiled assets anyway so the SPA and auth pages share the same
> release.

## License

MIT
