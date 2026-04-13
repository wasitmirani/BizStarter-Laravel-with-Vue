<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_statuses', function (Blueprint $table) {
              if (!Schema::hasColumn('user_statuses', 'text')) {
            $table->id();
            $table->string('text');
            $table->integer('code')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
              }
        });

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'status_id')) {
                $table->foreignId('status_id')
                    ->default(1)
                    ->constrained('user_statuses')
                    ->restrictOnDelete();
            }
        });

        
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'status_id')) {
                $table->dropForeign(['status_id']);
                $table->dropColumn('status_id');
            }
        });

        Schema::dropIfExists('user_statuses');
    }
};
