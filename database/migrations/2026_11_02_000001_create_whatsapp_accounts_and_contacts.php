<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whatsapp_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name')->default('WhatsApp');
            $table->string('phone_number', 32)->nullable();
            $table->string('phone_number_id', 64)->nullable();
            $table->string('business_account_id', 64)->nullable();
            $table->text('access_token')->nullable();
            $table->string('verify_token', 80)->nullable();
            $table->string('api_version', 16)->default('v21.0');
            $table->boolean('is_active')->default(true);
            $table->timestamp('connected_at')->nullable();
            $table->text('last_error')->nullable();
            $table->timestamps();

            $table->unique('workspace_id');
            $table->index('phone_number_id');
        });

        Schema::create('crm_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone', 32);
            $table->string('email')->nullable();
            $table->string('company')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('source', 32)->default('manual');
            $table->string('status', 16)->default('lead');
            $table->text('notes')->nullable();
            $table->boolean('opt_in')->default(true);
            $table->json('custom_fields')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->unique(['workspace_id', 'phone']);
            $table->index(['workspace_id', 'status']);
            $table->index(['workspace_id', 'last_message_at']);
        });

        Schema::create('crm_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->string('name', 60);
            $table->string('color', 16)->default('#059669');
            $table->timestamps();

            $table->unique(['workspace_id', 'name']);
        });

        Schema::create('crm_contact_tag', function (Blueprint $table) {
            $table->foreignId('contact_id')->constrained('crm_contacts')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('crm_tags')->cascadeOnDelete();
            $table->primary(['contact_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_contact_tag');
        Schema::dropIfExists('crm_tags');
        Schema::dropIfExists('crm_contacts');
        Schema::dropIfExists('whatsapp_accounts');
    }
};
