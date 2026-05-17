<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sale_order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_order_id')->index();
            $table->unsignedBigInteger('product_id')->nullable()->index();
            $table->string('product_name')->nullable();
            $table->string('sku')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('sale_order_id')->references('id')->on('sale_orders')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sale_order_items');
    }
};
