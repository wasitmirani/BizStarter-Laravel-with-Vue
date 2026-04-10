<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('retail_price', 12, 2)->default(0);
            $table->string('thumbnail')->default('default.png');
            $table->boolean('is_default')->default(false);
            $table->string('status')->default('active');
            $table->unsignedInteger('sort_order')->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['product_id', 'status', 'sort_order', 'uuid', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
