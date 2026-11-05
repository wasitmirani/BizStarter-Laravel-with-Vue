<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('whatsapp_accounts', function (Blueprint $table) {
            $table->string('channel', 16)->default('whatsapp')->after('workspace_id');
            $table->string('instagram_user_id', 64)->nullable()->after('business_account_id');
            $table->string('instagram_username', 80)->nullable()->after('instagram_user_id');
            $table->string('page_id', 64)->nullable()->after('instagram_username');

            $table->unique(['workspace_id', 'channel']);
            $table->index('channel');
        });

        Schema::table('whatsapp_accounts', function (Blueprint $table) {
            $table->dropUnique('whatsapp_accounts_workspace_id_unique');
        });

        Schema::table('crm_contacts', function (Blueprint $table) {
            $table->string('channel', 16)->default('whatsapp')->after('workspace_id');
            $table->string('external_id', 128)->nullable()->after('phone');
            $table->string('username', 120)->nullable()->after('external_id');
            $table->string('phone', 32)->nullable()->change();

            $table->index(['workspace_id', 'channel', 'external_id']);
        });

        Schema::table('crm_conversations', function (Blueprint $table) {
            $table->string('channel', 16)->default('whatsapp')->after('workspace_id');

            $table->index(['workspace_id', 'channel']);
        });
    }

    public function down(): void
    {
        Schema::table('crm_conversations', function (Blueprint $table) {
            $table->dropIndex(['workspace_id', 'channel']);
            $table->dropColumn('channel');
        });

        Schema::table('crm_contacts', function (Blueprint $table) {
            $table->dropIndex(['workspace_id', 'channel', 'external_id']);
            $table->dropColumn(['channel', 'external_id', 'username']);
            $table->string('phone', 32)->nullable(false)->change();
        });

        Schema::table('whatsapp_accounts', function (Blueprint $table) {
            $table->dropUnique(['workspace_id', 'channel']);
            $table->dropIndex(['channel']);
            $table->dropColumn(['channel', 'instagram_user_id', 'instagram_username', 'page_id']);
            $table->unique('workspace_id');
        });
    }
};
