# Production deployment guide

This guide covers everything needed to run LaraKit as a commercial multi-tenant
SaaS: server requirements, environment, queue/scheduler, storage, Meta webhooks,
security and go-live checks.

> The app is a Laravel 13 API + Vue 3 SPA. Workspaces (SaaS teams) are the
> product tenant; stancl/tenancy remains available for database-per-tenant
> isolation if you enable it. No third-party CSS framework is required at
> runtime — the UI ships its own `lk-*` design system.

---

## 1. Requirements

| Component | Minimum |
|-----------|---------|
| PHP | 8.3+ with `pdo`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo` |
| Composer | 2.x |
| Node.js | 18+ (build only) |
| Database | MySQL 8 / MariaDB 10.6+ / PostgreSQL 14+ |
| Cache + queue | Database driver works; Redis recommended at scale |
| Web server | Nginx or Apache with HTTPS |

Install and build:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
```

`npm run build` must be run on every deploy that changes frontend code. The
compiled assets live in `public/build`.

---

## 2. Environment

Copy `.env.example` to `.env` and set production values. At minimum:

```dotenv
APP_NAME="Your Brand"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...            # php artisan key:generate
APP_URL=https://app.example.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=larakit
DB_USERNAME=larakit
DB_PASSWORD=...

# Session / cache / queue
SESSION_DRIVER=database
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE=true
CACHE_STORE=redis            # or database
QUEUE_CONNECTION=redis       # or database

# Mail (invitations, password resets, invoices)
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# Billing
BILLING_PROVIDER=manual
BILLING_CURRENCY=USD

# Meta Cloud API — REQUIRED in production
WHATSAPP_APP_SECRET=...
WHATSAPP_API_VERSION=v21.0
WHATSAPP_VERIFY_TOKEN=...

# Instagram Messaging (optional)
INSTAGRAM_APP_SECRET=...
INSTAGRAM_API_VERSION=v21.0
INSTAGRAM_VERIFY_TOKEN=...
```

`WHATSAPP_APP_SECRET` / `INSTAGRAM_APP_SECRET` enable
`X-Hub-Signature-256` verification. **Never deploy without them** — unsigned
webhooks are accepted when the secret is empty, which is local-only behaviour.

After changing `.env` on the server:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

---

## 3. Database and first admin

```bash
php artisan migrate --force
```

Seed only the data a real installation needs (skip demo data):

```bash
php artisan db:seed --class=MasterDataSeeder --force
php artisan db:seed --class=UserStatusSeed --force
php artisan db:seed --class=CountriesSeeder --force
php artisan db:seed --class=TimeZoneSeeder --force
php artisan db:seed --class=RolePermissionSeeder --force
php artisan db:seed --class=PlanSeeder --force
```

`PlanSeeder` publishes the Free / Starter / Growth / Scale catalog. Adjust
prices, seats and features from **Platform → Plans** after logging in.

Create the first platform admin either by running `AdminUserSeeder` and then
**changing the password immediately**, or by registering normally and granting
the `super-admin` role:

```bash
php artisan db:seed --class=AdminUserSeeder --force
# default: admin@example.com / password  → change it now
```

> Do **not** run `DatabaseSeeder` on production: it also loads `WorkspaceSeeder`
> and `CrmSeeder` demo records.

---

## 4. Queue worker

Campaign sends, invitation mail and any `ShouldQueue` job need a worker:

```bash
php artisan queue:work --sleep=3 --tries=3 --max-time=3600
```

Supervise it with Supervisor, systemd or your platform's process manager.
Restart workers on every deploy:

```bash
php artisan queue:restart
```

If you stay on the database queue, ensure the `jobs` table exists (it ships in
the migrations) and monitor failed jobs:

```bash
php artisan queue:failed
php artisan queue:retry all
```

---

## 5. Scheduler

The scheduler drives trial expiry, billing lifecycle and scheduled campaigns:

```cron
* * * * * cd /var/www/larakit && php artisan schedule:run >> /dev/null 2>&1
```

Registered tasks (`routes/console.php`):

| Command | Frequency | Purpose |
|---------|-----------|---------|
| `billing:sync` | daily 01:00 | End trials, flag past-due subscriptions |
| `crm:send-scheduled-campaigns` | every minute | Send due WhatsApp campaigns |

Run either manually to verify:

```bash
php artisan billing:sync
php artisan crm:send-scheduled-campaigns
```

---

## 6. Storage and permissions

Inbound WhatsApp/Instagram media and uploaded assets are served through the app.
Create the public symlink and writable directories:

```bash
php artisan storage:link
chmod -R ug+rwX storage bootstrap/cache
```

If you use S3, set `FILESYSTEM_DISK=s3` plus the `AWS_*` variables and keep the
bucket private; media is proxied through authenticated app routes.

---

## 7. Meta WhatsApp Cloud API

1. Create a Meta app at <https://developers.facebook.com> and add the
   **WhatsApp** product.
2. Add a business phone number and copy its **Phone number ID** and the
   **WhatsApp Business Account ID**.
3. Create a **System User** with `whatsapp_business_messaging` and
   `whatsapp_business_management`; generate a permanent token.
4. In the app, open **Workspace → WhatsApp**, paste the IDs and token, save,
   then use **Test connection**.
5. Configure the webhook:
   - Callback URL: `https://app.example.com/api/whatsapp/webhook`
   - Verify token: the value shown in the workspace WhatsApp settings (or
     `WHATSAPP_VERIFY_TOKEN`)
   - Subscribe to the **messages** field.
6. Send a test message from a real phone and confirm it appears in the Inbox.

Each workspace stores its own encrypted credentials, so one installation can
serve many customers.

### Templates and campaigns

- Templates are workspace-scoped. Build them under **Templates** (media header,
  body with `{{1}}` variables, up to 3 buttons) or import approved templates
  with **Sync from WhatsApp**.
- Campaigns require an approved template. Use tags to define the audience and
  keep contacts opted in.
- Scheduled campaigns are picked up by the scheduler within one minute.

---

## 8. Meta Instagram Messaging (optional)

1. Add the **Instagram** product to the same (or another) Meta app and connect
   the business Instagram account.
2. Copy the Instagram account ID and generate a page/user access token with
   `instagram_manage_messages` and `instagram_basic`.
3. In the app, open **Workspace → Instagram**, save the credentials and run
   **Test connection**.
4. Webhook:
   - Callback URL: `https://app.example.com/api/instagram/webhook`
   - Verify token: the value shown in Instagram settings (or
     `INSTAGRAM_VERIFY_TOKEN`)
   - Subscribe to `messages` (and `message_reactions` if you use reactions).

Instagram conversations appear in the same shared inbox with a channel badge;
Instagram contacts are excluded from WhatsApp campaign audiences.

---

## 9. Security checklist

Before going live:

- [ ] `APP_ENV=production`, `APP_DEBUG=false`
- [ ] HTTPS enforced at the proxy; `SESSION_SECURE_COOKIE=true`
- [ ] `WHATSAPP_APP_SECRET` and `INSTAGRAM_APP_SECRET` set
- [ ] Default admin password changed or `AdminUserSeeder` not run
- [ ] `php artisan config:cache route:cache view:cache` run after env changes
- [ ] Queue worker + scheduler supervised and alerting
- [ ] Database and storage backups scheduled (test a restore)
- [ ] Log rotation configured (`LOG_CHANNEL=daily` or an external driver)
- [ ] Error tracking (Sentry, Flare, Bugsnag…) wired to `LOG_CHANNEL`
- [ ] Webhook endpoints reachable over HTTPS and rate limited at the proxy
- [ ] Mail domain verified (SPF/DKIM) so invitations and resets arrive
- [ ] Meta app in **Live** mode with business verification completed

Security headers are added globally by `App\Http\Middleware\SecurityHeaders`
(`nosniff`, strict referrer policy, restrictive permissions policy). Add a CSP
at the proxy/CDN once you have audited third-party scripts.

---

## 10. Smoke test after deploy

1. Register a new account → workspace, trial and owner membership are created.
2. Switch between workspaces with the sidebar switcher; the choice persists.
3. Invite a teammate → email arrives → accept link → member sees the workspace.
4. Create a WhatsApp template and verify the live preview.
5. Connect WhatsApp, send a test message, reply from the Inbox.
6. Schedule a campaign one minute out and confirm the scheduler sends it.
7. Open **Billing & plans** → subscribe/cancel → invoice renders.
8. Confirm `php artisan about` shows the expected environment and cache state.

---

## 11. Upgrades

```bash
git pull
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache route:cache view:cache
php artisan queue:restart
```

Take a database backup before every migration.

---

## 12. Troubleshooting

| Symptom | Check |
|---------|-------|
| Webhook verification fails | Verify token matches workspace/`.env`; HTTPS reachable |
| Inbound messages ignored | `WHATSAPP_APP_SECRET` mismatch; account `phone_number_id` |
| Campaigns stay `scheduled` | Scheduler running; `crm:send-scheduled-campaigns` in logs |
| Invitations not delivered | SMTP credentials, `MAIL_FROM_ADDRESS`, spam folder |
| Assets 404 after deploy | `npm run build` ran and `public/build` was deployed |
| Blank SPA page | `public/build/manifest.json` exists; browser console for chunk errors |
| 419 / session errors | `APP_KEY`, `SESSION_DOMAIN`, secure cookie settings |
