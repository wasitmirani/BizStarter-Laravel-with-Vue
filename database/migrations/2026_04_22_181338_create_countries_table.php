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
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. Pakistan
            $table->string('code',
            3)->nullable(); // PAK
            $table->string('iso2', 2)->unique(); // PK

            $table->string('phone_code')->nullable(); // +92
            $table->string('currency')->nullable(); // PKR
            $table->string('currency_symbol')->nullable(); // Rs
            $table->string('timezone')->nullable(); // Asia/Karachi
            $table->string('flag')->nullable(); // flag URL or path
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes(); // optional
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
