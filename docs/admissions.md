# UniPilot — Italy Master's Admission Intelligence

UniPilot is the admissions module inside LaraKit. It gives each signed-in applicant a
private workspace for Italian master's programs: their own profile, evidence, matches,
applications, tasks, documents and reports.

The shared catalog (universities, programs, scholarships) is read-only for applicants.
Everything personal belongs to exactly one user and is never visible to another account.

---

## What it does

- **Profile & evidence** — personal details, education records, language qualifications,
  work experience. Different grading scales are stored as entered and are never converted
  automatically.
- **Study preferences** — subject areas, regions, institution type, tuition and application
  budget, scholarship needs, relevance and deadline preference.
- **Rules-based matches** — every program is assessed against the applicant's stored
  evidence and produces one of five statuses (see below).
- **Application workspace** — track applications and statuses, link tasks and documents,
  upload private files and download them again.
- **Reports & digests** — on-demand report plus a scheduled email/Slack digest built from
  stored data only.
- **Account controls** — export your data or delete your account (and its private records).

### Eligibility statuses

| Status | Meaning |
|--------|---------|
| `likely_eligible` | Every published mandatory criterion is confirmed by recorded evidence. |
| `potential_match` | Mandatory criteria look satisfiable but preference or evidence gaps remain. |
| `ambitious` | A meaningful gap exists (grade, budget or similar), so it is a stretch. |
| `not_eligible` | At least one published mandatory criterion is not met. |
| `insufficient_evidence` | A mandatory criterion cannot be judged from what is stored. |

**Match strength is not an admission probability.** It reports how much of the published
criteria the stored evidence satisfies. Always confirm requirements and deadlines on the
official university page before applying.

### Demo data

`AdmissionsDemoSeeder` inserts an illustrative catalog. Every seeded university, program,
admission call and scholarship is marked:

- `is_sample = true`
- `verification_status = 'unverified'`

The UI shows a **Demo** / **Unverified** badge and a catalog warning. Seeded deadlines,
tuition and requirements are examples, not facts. Do not present them as verified data.
Delete or replace them before a real launch.

---

## Local setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate

# SQLite (default) — create the file first
touch database/database.sqlite          # Windows: New-Item database/database.sqlite

php artisan migrate --seed
php artisan storage:link
npm run dev
php artisan serve
```

The demo seeder is registered in `DatabaseSeeder`, so `--seed` also creates the demo
catalog and the `admin@example.com` account (`password`). Change that password
immediately.

The SPA is served at `/app`; `/` redirects guests to `/login` and authenticated users to
`/app/dashboard`.

### Queue worker and scheduler

Digests are queued and the scheduler dispatches them hourly:

```bash
php artisan queue:work            # send queued digests
php artisan schedule:work         # local scheduler loop
```

In production use a process supervisor for the queue worker and a single cron entry:

```cron
* * * * * cd /path/to/app && php artisan schedule:run >> /dev/null 2>&1
```

Manual dispatch (useful for debugging):

```bash
php artisan admissions:send-digests
```

The command only dispatches when the user's local hour matches `preferred_time`, respects
`frequency` (`daily`, `weekly`, `urgent_only`, `off`) and deduplicates by
user + channel + date through `notification_deliveries.dedupe_key`.

---

## Architecture

### Backend

| Area | Location |
|------|----------|
| API routes | `routes/api_v1.php` (mounted at `/api/v1` in `bootstrap/app.php`) |
| Controllers | `app/Http/Controllers/Api/V1/` |
| Form Requests | `app/Http/Requests/Admissions/` |
| Policies | `app/Policies/` (owned resources extend `OwnedResourcePolicy`) |
| Resources | `app/Http/Resources/` |
| Eligibility engine | `app/Services/Admissions/EligibilityEngine.php` |
| Profile completion | `app/Services/Admissions/ProfileCompletionService.php` |
| Digest logic | `app/Services/Admissions/DigestService.php` |
| Notification | `app/Notifications/AdmissionsDigestNotification.php` |
| Job / command | `app/Jobs/SendAdmissionsDigest.php`, `app/Console/Commands/SendAdmissionsDigests.php` |
| Schema | `database/migrations/2026_10_27_000100_create_admissions_domain_tables.php` |
| Demo catalog | `database/seeders/AdmissionsDemoSeeder.php` |

The existing admin API (`/api/app`), admin controllers and Blade auth are untouched.

### Frontend

| Area | Location |
|------|----------|
| Pages | `resources/ts/backend/Pages/Admissions/` and `Pages/Dashboard/Dashboard.vue` |
| Reusable parts | `Pages/Admissions/Components/`, `Pages/Admissions/Partials/` |
| API client | `Services/Admissions/api.ts` (separate axios instance, `/api/v1`, Bearer token) |
| Typed calls | `Services/Admissions/AdmissionsService.ts` |
| Routes | `resources/ts/backend/router.ts` |
| Navigation | `resources/ts/backend/Layouts/partials/SideBarMenu.vue` |

The admissions client is intentionally separate from the legacy `AxiosService`
(`/api/app/`), so the two API surfaces cannot leak tokens or error handling into each
other.

### Data model

One migration creates 21 tables in four groups:

1. **Applicant profile** — `user_profiles`, `education_records`,
   `language_qualifications`, `work_experiences`, `study_preferences`,
   `notification_preferences`.
2. **Shared catalog** — `universities`, `programs`, `admission_calls`, `scholarships`,
   `scholarship_calls`, `catalog_sources`.
3. **Personal intelligence** — `eligibility_assessments` (`unique(user_id, program_id)`),
   `user_program_bookmarks`, `user_applications`, `application_documents`, `user_tasks`,
   `daily_reports`, `notification_deliveries`.
4. **Governance** — `audit_logs`.

`eligibility_assessments` is program-level: recalculation replaces/updates the current
user's rows only. There is no cross-user recalculation.

---

## API

All endpoints are under `/api/v1`, require `auth:sanctum`, and are throttled at
`120` requests per minute. Requests return:

```json
{ "status": true, "message": "…", "result": { } }
```

Validation failures return `422` with `errors`.

| Group | Endpoints |
|-------|-----------|
| Session | `GET /me`, `GET /dashboard` |
| Profile | `GET/PUT /profile` |
| Records | `apiResource /education`, `/language-qualifications`, `/work-experiences` |
| Preferences | `GET/PUT /preferences`, `GET/PUT /notification-preferences`, `GET /notifications` |
| Catalog | `GET /universities`, `/universities/{id}`, `/programs`, `/programs/{id}`, `/scholarships`, `/scholarships/{id}` |
| Matches | `GET /eligibility`, `POST /eligibility/reassess` |
| Bookmarks | `GET/POST /bookmarks`, `DELETE /bookmarks/{program}` |
| Applications | `apiResource /applications` |
| Documents | `GET/POST /documents`, `GET /documents/{id}/download`, `DELETE /documents/{id}` |
| Tasks | `GET/POST /tasks`, `PUT/DELETE /tasks/{id}` |
| Reports | `GET /reports`, `POST /reports/generate` |
| Account | `GET /account/export`, `DELETE /account` |

Ownership is never taken from the request. Every query is scoped through
`$request->user()`, policies re-check ownership, and route-model-bound updates also
verify ownership in the Form Request so a foreign id returns `404`, not a leak.

---

## Security model

- **Authentication** — Sanctum bearer tokens for the SPA. Tokens are issued at login and
  read from `window.user.token` by the admissions client.
- **Per-user isolation** — controllers scope queries to the authenticated user; tests in
  `tests/Feature/Admissions/IsolationTest.php` assert cross-user access fails.
- **Ownership policies** — all private models have policies extending
  `OwnedResourcePolicy`; Form Requests authorize both the ability and the route model.
- **No client user ids** — payloads may not set `user_id`; it is always derived from the
  session.
- **Private files** — documents are stored on the `local` disk under a per-user path and
  streamed through an authorized download endpoint. The storage path is hidden from API
  responses.
- **Secrets** — `slack_webhook_url` is encrypted at rest and hidden from serialization; the
  API exposes only `slack_webhook_configured`.
- **Rate limiting** — the whole `/api/v1` group is throttled.
- **Audit trail** — sensitive mutations are written to `audit_logs`.
- **Account controls** — export and deletion are self-service and scoped to the caller.

---

## Tests

```bash
php artisan test --compact
```

The suite uses SQLite in memory (`phpunit.xml`) and covers:

- `EligibilityEngineTest` — all five statuses, no grade conversion, per-user recalculation.
- `IsolationTest` — private records are invisible across accounts.
- `ProfileApiTest` — validation, profile creation, Slack secret never returned.
- `DigestTest` — digest payload, dedupe, email delivery, Slack skip/send, scheduler timing.
- `ExampleTest` — root redirects for guests and authenticated users.

Migrations avoid driver-specific SQL so the same suite runs on SQLite and PostgreSQL.

---

## Free-first deployment

A single small VPS or an always-on container is enough. No paid service is required.

1. **Host** — any provider with PHP 8.3+, Composer and a cron entry. A free-tier VM or an
   existing shared host works if it allows `artisan`.
2. **Database** — SQLite for a single-node demo, PostgreSQL for production. Set
   `DB_CONNECTION` in `.env`; PostgreSQL example:

   ```dotenv
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=larakit
   DB_USERNAME=larakit
   DB_PASSWORD=secret
   ```

3. **Queue** — keep `QUEUE_CONNECTION=database` (no Redis needed) and run one supervised
   `php artisan queue:work`.
4. **Scheduler** — one cron entry calling `php artisan schedule:run` every minute.
5. **Mail** — use `MAIL_MAILER=log` while testing, or a free SMTP tier (e.g. a personal
   mailbox or a provider's free plan). Set `MAIL_FROM_ADDRESS` to a real address.
6. **Slack (optional)** — users can paste an incoming-webhook URL in Preferences. Leave it
   empty to disable Slack entirely.
7. **Storage** — `php artisan storage:link`, keep `FILESYSTEM_DISK=local`. Back up the
   `storage/app` directory with the database.
8. **Build** — `npm ci && npm run build`, then point the web server document root at
   `public/`. Do not serve `storage/` or `.env`.
9. **Hardening** — `APP_ENV=production`, `APP_DEBUG=false`, a real `APP_KEY`, HTTPS, and a
   changed admin password. The demo catalog should be replaced or clearly kept labeled.

A minimal release loop:

```bash
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
npm ci && npm run build
php artisan config:cache && php artisan route:cache && php artisan view:cache
php artisan queue:restart
```

---

## Known limitations

- Catalog data is only as reliable as its sources; unverified/demo records stay labeled.
- Eligibility is a transparent rules check, not a predictive model.
- No grade conversion between systems.
- Document scanning/virus checking is out of scope; uploads are validated by type and size.
- Multi-tenancy from LaraKit is available but not used by the admissions module; data is
  isolated per user, not per tenant database.
