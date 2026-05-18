<?php

use App\Models\Driver;
use App\Models\Warehouse;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('module_has_users')) {
            Schema::create('module_has_users', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->morphs('module');
                $table->timestamps();

                $table->unique(['user_id', 'module_type', 'module_id'], 'module_has_users_user_module_unique');
            });
        }

        if (Schema::hasTable('driver_warehouse')) {
            $this->migrateDriverWarehouseToModuleHasUsers();
            Schema::dropIfExists('driver_warehouse');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('module_has_users')) {
            Schema::dropIfExists('module_has_users');
        }

        if (! Schema::hasTable('driver_warehouse') && Schema::hasTable('drivers')) {
            Schema::create('driver_warehouse', function (Blueprint $table) {
                $table->id();
                $table->foreignId('driver_id')->constrained('drivers')->cascadeOnDelete();
                $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
                $table->timestamps();

                $table->unique(['driver_id', 'warehouse_id']);
            });
        }
    }

    private function migrateDriverWarehouseToModuleHasUsers(): void
    {
        $rows = DB::table('driver_warehouse')->get();
        $moduleType = Warehouse::class;

        foreach ($rows as $row) {
            $userId = DB::table('drivers')->where('id', $row->driver_id)->value('user_id');

            if (! $userId) {
                continue;
            }

            $exists = DB::table('module_has_users')
                ->where('user_id', $userId)
                ->where('module_type', $moduleType)
                ->where('module_id', $row->warehouse_id)
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('module_has_users')->insert([
                'user_id' => $userId,
                'module_type' => $moduleType,
                'module_id' => $row->warehouse_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
};
