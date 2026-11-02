<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use App\Services\WorkspaceService;
use Illuminate\Database\Seeder;

class WorkspaceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', AdminUserSeeder::EMAIL)->first();

        if (! $admin) {
            return;
        }

        $workspace = Workspace::where('owner_id', $admin->id)->first();

        if (! $workspace) {
            $workspace = app(WorkspaceService::class)->provision($admin, 'LaraKit Workspace');
        }

        $this->command?->info("Default workspace ready: {$workspace->name} (#{$workspace->id})");
    }
}
