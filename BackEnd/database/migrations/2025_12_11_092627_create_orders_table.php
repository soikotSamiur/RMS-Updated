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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('type', ['dine-in', 'takeaway'])->default('dine-in');
            $table->integer('table_number')->nullable(); // for dine-in
            $table->integer('guests')->nullable(); // for dine-in
            $table->text('address')->nullable(); // kept for future use
            $table->text('special_instructions')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->enum('status', ['pending', 'preparing', 'ready', 'completed', 'cancelled'])->default('pending');
            $table->integer('progress')->default(0); // 0-100 percentage
            $table->boolean('inventory_deducted')->default(false); // Track if inventory has been deducted
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
