<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('contact_id')->constrained('crm_contacts')->cascadeOnDelete();
            $table->foreignId('whatsapp_account_id')->nullable()->constrained('whatsapp_accounts')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 16)->default('open');
            $table->string('priority', 16)->default('normal');
            $table->string('subject')->nullable();
            $table->text('last_message_preview')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->unsignedInteger('unread_count')->default(0);
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            $table->unique(['workspace_id', 'contact_id']);
            $table->index(['workspace_id', 'status', 'last_message_at']);
        });

        Schema::create('crm_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('conversation_id')->constrained('crm_conversations')->cascadeOnDelete();
            $table->foreignId('contact_id')->constrained('crm_contacts')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('wa_message_id', 128)->nullable();
            $table->string('direction', 8)->default('out');
            $table->string('type', 24)->default('text');
            $table->text('body')->nullable();
            $table->string('media_url', 2048)->nullable();
            $table->string('media_mime', 128)->nullable();
            $table->string('media_filename')->nullable();
            $table->string('template_name')->nullable();
            $table->string('status', 16)->default('queued');
            $table->text('error')->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['workspace_id', 'created_at']);
            $table->index(['conversation_id', 'id']);
            $table->unique(['workspace_id', 'wa_message_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_messages');
        Schema::dropIfExists('crm_conversations');
    }
};
