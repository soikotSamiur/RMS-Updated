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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['vegetables', 'meat', 'dairy', 'beverages', 'spices', 'bakery', 'oil', 'sauces', 'dessert', 'fruits', 'other']);
            $table->decimal('current_stock', 10, 2)->default(0);
            $table->string('unit'); // kg, g, L, ml, pieces, bottles, packets
            $table->decimal('reorder_level', 10, 2)->default(0);
            $table->string('supplier')->nullable();
            $table->enum('status', ['in_stock', 'low_stock', 'out_of_stock'])->default('in_stock');
            $table->decimal('cost_per_unit', 8, 2)->nullable();
            $table->timestamp('last_restock_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
