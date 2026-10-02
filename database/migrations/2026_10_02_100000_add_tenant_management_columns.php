<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
            $table->string('email')->nullable()->after('name');
            $table->string('status')->default('active')->after('email');
            $table->string('logo')->nullable()->after('status');
            $table->string('primary_color', 32)->nullable()->after('logo');
            $table->string('timezone')->nullable()->after('primary_color');
            $table->string('locale', 16)->nullable()->after('timezone');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'email',
                'status',
                'logo',
                'primary_color',
                'timezone',
                'locale',
            ]);
        });
    }
};
