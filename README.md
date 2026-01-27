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
