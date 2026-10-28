<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('universities', function (Blueprint $table) {
            // ISO 3166-1 alpha-2 code. Kept separate from "region" so the
            // catalog can span several countries while still storing the
            // local region (e.g. Lombardy, Bavaria).
            $table->string('country', 2)->nullable()->after('region')->index();
        });

        Schema::table('source_snapshots', function (Blueprint $table) {
            // True when the fetched payload differs from the previous snapshot.
            $table->boolean('changed')->default(false)->after('http_status');
        });
    }

    public function down(): void
    {
        Schema::table('source_snapshots', function (Blueprint $table) {
            $table->dropColumn('changed');
        });

        Schema::table('universities', function (Blueprint $table) {
            $table->dropColumn('country');
        });
    }
};
