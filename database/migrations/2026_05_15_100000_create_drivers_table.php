<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
