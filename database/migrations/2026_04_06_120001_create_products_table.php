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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('category_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('type', ['service', 'digital', 'physical', 'bundle'])->nullable();
            $table->string('sku')->unique();
            $table->string('reference_sku');
            $table->string('barcode')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('retail_price', 12, 2)->default(0);
            $table->string('thumbnail')->default('default.png');
            $table->json('meta')->nullable();
            $table->foreignId('user_id')
            ->nullable()
            ->constrained('users')
            ->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['category_id', 'sort_order','slug','uuid','id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
