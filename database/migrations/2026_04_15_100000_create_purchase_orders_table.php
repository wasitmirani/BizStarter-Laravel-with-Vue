<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('purchase_orders');
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('po_number')->unique();
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->unsignedBigInteger('warehouse_id')->nullable();
            $table->date('order_date');
            $table->date('expected_date')->nullable();
            $table->string('payment_term')->nullable();
            $table->string('payment_type')->nullable();
            $table->string('supplier_reference_id')->nullable();
            $table->json('tags')->nullable();
            $table->decimal('sub_total', 12, 2)->default(0);
            $table->decimal('taxes', 12, 2)->default(0);
            $table->decimal('shipping_charges', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->text('supplier_notes')->nullable();
            $table->json('meta')->nullable();
            $table->foreignId('tenant_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['supplier_id', 'warehouse_id', 'order_date', 'uuid', 'id'], 'po_supplier_wh_order_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
