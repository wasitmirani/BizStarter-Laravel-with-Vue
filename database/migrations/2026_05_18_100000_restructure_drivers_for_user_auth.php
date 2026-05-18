<?php

use App\Enums\UserTypeEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('driver_warehouse');
        Schema::dropIfExists('module_has_users');
        Schema::dropIfExists('drivers');

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'user_type')) {
                $table->unsignedTinyInteger('user_type')
                    ->default(UserTypeEnum::User->value)
                    ->after('id')
                    ->index();
            }
        });

        if (Schema::hasColumn('users', 'user_type')) {
            DB::table('users')->where('user_type', UserTypeEnum::Driver->value)->delete();
        }

        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('driver_code')->unique();
            $table->string('type');
            $table->string('cnic')->nullable();
            $table->string('license_number')->nullable();
            $table->date('license_expiry_date')->nullable();
            $table->date('joining_date')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('type');
            $table->index('status');
        });

        if (! Schema::hasTable('module_has_users')) {
            Schema::create('module_has_users', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->morphs('module');
                $table->timestamps();

                $table->unique(['user_id', 'module_type', 'module_id'], 'module_has_users_user_module_unique');
            });
        }

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('driver_warehouse');
        Schema::dropIfExists('module_has_users');
        Schema::dropIfExists('drivers');

        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('tenant_id')->nullable()->index();
            $table->string('driver_code')->unique();
            $table->string('full_name');
            $table->string('type');
            $table->string('profile_image')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('cnic')->nullable();
            $table->string('license_number')->nullable();
            $table->date('license_expiry_date')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->date('joining_date')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('type');
            $table->index('status');
            $table->index('city');
        });

        Schema::create('driver_warehouse', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained('drivers')->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained('warehouses')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['driver_id', 'warehouse_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'user_type')) {
                $table->dropColumn('user_type');
            }
        });

        Schema::enableForeignKeyConstraints();
    }
};
