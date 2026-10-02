<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\RolesEnum;
use App\Models\Role;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Stancl\Tenancy\Contracts\TenantWithDatabase;

class SeedTenantAdmin implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(protected TenantWithDatabase $tenant) {}

    public function handle(): void
    {
        $adminName = (string) ($this->tenant->admin_name ?? 'Tenant Admin');
        $adminEmail = (string) ($this->tenant->admin_email ?? '');
        $adminPassword = (string) ($this->tenant->admin_password ?? 'password');

        if ($adminEmail === '') {
            return;
        }

        $this->tenant->run(function () use ($adminName, $adminEmail, $adminPassword) {
            $parts = preg_split('/\s+/', trim($adminName), 2) ?: [];
            $firstName = $parts[0] ?? 'Admin';
            $lastName = $parts[1] ?? 'User';
            $usernameBase = Str::slug($firstName.$lastName) ?: 'admin';

            $role = Role::firstOrCreate(
                ['name' => RolesEnum::ADMIN->value, 'guard_name' => 'web'],
                [
                    'uuid' => (string) Str::uuid(),
                    'slug' => 'admin',
                    'scope' => 'tenant',
                ]
            );

            $user = User::updateOrCreate(
                ['email' => $adminEmail],
                [
                    'uuid' => (string) Str::uuid(),
                    'user_name' => $usernameBase,
                    'slug' => Str::slug($adminName) ?: 'tenant-admin',
                    'name' => $adminName,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'password' => Hash::make($adminPassword),
                    'email_verified_at' => now(),
                    'is_active' => true,
                    'is_primary' => true,
                    'thumbnail' => 'default.png',
                ]
            );

            $user->syncRoles([$role]);
        });

        // Clear plaintext password from virtual data column after seeding.
        $this->tenant->admin_password = null;
        $this->tenant->save();
    }
}
