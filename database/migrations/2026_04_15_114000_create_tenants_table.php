<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('timezones', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Asia/Karachi
            $table->string('label')->nullable(); // (GMT+5) Pakistan Time
        });
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // English
            $table->string('code')->unique(); // en
        });
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // US Dollar
            $table->string('code')->unique(); // USD
            $table->string('symbol')->nullable(); // $
        });
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();

            // Basic Info
            $table->string('name');
            $table->string('uuid')->unique()->nullable(); // for external references
            $table->string('slug')->unique(); // better than name for URLs
            $table->string('domain')->unique()->nullable();
            $table->string('database')->unique()->nullable();

            // Status & Control
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->boolean('is_active')->default(true);

            // Branding
            $table->string('logo')->nullable();

            // Contact Info
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();

            // Address
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            // Localization
            $table->foreignId('timezone_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('language_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('currency_id')->nullable()->constrained()->nullOnDelete();

            // Subscription / Billing
            $table->string('subscription_plan')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('subscription_starts_at')->nullable();
            $table->timestamp('subscription_ends_at')->nullable();

            // Limits (VERY useful)
            $table->integer('max_users')->default(10)->nullable();
            $table->integer('max_roles')->default(5)->nullable();

            // Metadata (flexible JSON)
            $table->json('meta')->nullable();

            // Audit
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

            // Soft delete (important for SaaS)
            $table->softDeletes();

            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
