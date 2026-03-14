# Laravel + Vue Boilerplate 🚀

A modern full-stack starter boilerplate built with **Laravel** and **Vue 3**, designed to help developers quickly build scalable, maintainable, and high-performance web applications.

This boilerplate combines Laravel’s powerful backend with a modern Vue SPA frontend powered by Vite, TypeScript, and Tailwind CSS.

---

## 🔥 Tech Stack

### Backend
- Laravel (PHP Framework)
- RESTful API architecture
- Eloquent ORM

### Frontend
- Vue 3 (Composition API)
- Vite
- TypeScript
- Vue Router
- Tailwind CSS

---

## ✨ Features

- Laravel backend ready for APIs
- Vue 3 SPA frontend
- Vite with Hot Module Replacement (HMR)
- TypeScript support
- Tailwind CSS pre-configured
- Clean and scalable folder structure
- Environment-based configuration
- Easy to extend (Auth, Roles, Permissions)
- Production-ready build setup
- Backend admin optimized for PWA (installable, offline-friendly)
- Reusable generic table component with filters, bulk actions, and pagination

---

## 📋 Requirements

- PHP >= 8.1
- Composer
- Node.js >= 16
- npm or yarn
- MySQL / PostgreSQL / SQLite

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/wasitmirani/laravel-vue-boilerplate.git
cd laravel-vue-boilerplate
2. Backend Setup (Laravel)
Install dependencies:

composer install
Create environment file:

cp .env.example .env
Generate app key:

php artisan key:generate
Configure database in .env:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
Run migrations:

php artisan migrate
3. Frontend Setup (Vue + Vite)
Install frontend dependencies:

npm install
▶️ Run the Project
Development
Start Laravel server:

php artisan serve
Start Vite dev server:

npm run dev
Open in browser:

http://localhost:8000
🏗 Production Build
Build frontend assets:

npm run build
Compiled files will be generated in public/build.

---

## 📲 Backend PWA (Admin)

The backend admin (`/app`) is PWA-ready so you can install it on desktop and mobile.

- **Manifest**: `public/manifest.webmanifest`
- **Service worker**: `public/service-worker.js`
- **Offline fallback**: `public/offline.html`

The backend layout (`resources/views/layouts/backend/master.blade.php`) already links the manifest, theme color, and icons.

### Enable / customize

- Replace the placeholder icons referenced in `manifest.webmanifest` under `/public/icons/`.
- Adjust `name`, `short_name`, and `start_url` in `manifest.webmanifest` as needed.
- The service worker pre-caches the core shell (`/`, `/app`, manifest, offline page) and uses:
  - **Network-first** for most requests (with cache fallback).
  - **Cache-first** for static assets (JS/CSS/images).

To test:

1. Run `npm run build` and serve the app over HTTPS (or use `php artisan serve` with a proper proxy).
2. Open the backend in Chrome, go to **Application → Manifest / Service Workers**.
3. Verify:
   - Manifest is detected.
   - Service worker is installed and activated.
   - The app is **Installable**.

---

## 📊 Advanced Backend Tables

The backend uses a generic, extensible table component for CRUD-style modules:

- Component: `resources/ts/backend/Components/GenericTable.vue`
- Example usage: `resources/ts/backend/Pages/users/UserTable.vue`

### Key capabilities

- **Pagination**: Server-driven paging with URL query sync.
- **Bulk selection & actions**:
  - Checkbox in header + per-row checkboxes.
  - Exposes `@update:selectedItems` with the current selection.
  - Accepts a `bulkActions` array (e.g. `[{ label: 'Delete selected', action: 'bulk-delete' }]`) and emits a standardized `action` payload.
- **Column config**:
  - `columns: { key, label, sortable? }[]`
  - Built-in sort triggers via `action: 'sort'` with `{ column, direction }`.
- **Filter bar**:
  - Optional filter slot (`#filters`) to plug in your own filter controls.
  - Works well with the `Helpers.buildQueryFromFilters` / `updateUrlWithFilters` utilities.

Backend endpoints (e.g. `App\Services\UserService::users`) accept common query params:

- `per_page`: page size
- `sort_by`, `sort_dir`
- Example filters: `status`, `role`

Use this pattern when creating new modules (roles, permissions, etc.) so all tables behave consistently and work smoothly with the PWA/offline shell.

📁 Project Structure
├── app/                  # Laravel backend logic
├── routes/               # Web & API routes
├── resources/
│   ├── js/               # Vue 3 application
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   └── app.ts
│   ├── css/              # Tailwind styles
│   └── views/            # Blade templates
├── database/             # Migrations & seeders
├── public/               # Public assets
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── composer.json
🔐 Authentication (Optional)
You can easily integrate authentication using:

Laravel Breeze

Laravel Sanctum

Laravel Fortify

Custom auth solution

🧪 Testing
Run backend tests:

php artisan test
🛠 Customization
APIs → routes/api.php

Vue pages → resources/js/pages

Components → resources/js/components

Styles → Tailwind CSS utilities

🤝 Contributing
Fork the repository

Create your feature branch

Commit your changes

Push to your branch

Open a Pull Request

📄 License
This project is open-source and licensed under the MIT License.

👤 Author
Wasit Mirani
Full-Stack Developer

GitHub: https://github.com/wasitmirani
