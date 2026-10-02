<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Default central admin credentials.
     */
    public const EMAIL = 'admin@example.com';

    public const USERNAME = 'admin';

    public const PASSWORD = 'password';

    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => self::EMAIL],
            [
                'uuid' => (string) Str::uuid(),
                'user_name' => self::USERNAME,
                'slug' => 'admin-user',
                'name' => 'Admin User',
                'first_name' => 'Admin',
                'last_name' => 'User',
                'password' => Hash::make(self::PASSWORD),
                'email_verified_at' => now(),
                'is_active' => true,
                'thumbnail' => 'default.png',
            ]
        );

        $admin->syncRoles([
            RolesEnum::SUPER_ADMIN->value,
            RolesEnum::ADMIN->value,
        ]);

        $this->command?->info(sprintf(
            'Default admin ready: %s / %s (password: %s)',
            self::EMAIL,
            self::USERNAME,
            self::PASSWORD
        ));
    }
}
