<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $guard = 'web';

        $permissions = [
            'users-list',
            'create-user',
            'edit-user',
            'show-user',
            'delete-user',
            'roles-list',
            'create-role',
            'edit-role',
            'show-role',
            'delete-role',
            'permissions-list',
            'create-permission',
            'edit-permission',
            'show-permission',
            'delete-permission',
            'tenants-list',
            'create-tenant',
            'edit-tenant',
            'show-tenant',
            'delete-tenant',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(
                ['name' => $name, 'guard_name' => $guard],
                [
                    'uuid' => (string) Str::uuid(),
                    'slug' => Str::slug($name),
                    'scope' => 'system',
                ]
            );
        }

        $admin = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => $guard],
            ['scope' => 'system', 'uuid' => (string) Str::uuid(), 'slug' => 'admin']
        );

        $superAdmin = Role::firstOrCreate(
            ['name' => 'super-admin', 'guard_name' => $guard],
            ['scope' => 'system', 'uuid' => (string) Str::uuid(), 'slug' => 'super-admin']
        );

        $allPermissions = Permission::where('guard_name', $guard)->pluck('name')->all();
        $admin->syncPermissions($allPermissions);
        $superAdmin->syncPermissions($allPermissions);

        Role::firstOrCreate(
            ['name' => 'user', 'guard_name' => $guard],
            ['scope' => 'system', 'uuid' => (string) Str::uuid(), 'slug' => 'user']
        );
    }
}
