<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_zones', function (Blueprint $table) {
            $table->id();
            $table->string('country_code', 5);
            $table->string('country_name');
            $table->string('time_zone');
            $table->string('gmt_offset')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_zones');
    }
};