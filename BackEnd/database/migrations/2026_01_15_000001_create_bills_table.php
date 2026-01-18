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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('bill_number')->unique();
            $table->string('customer_name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->enum('order_type', ['Dine-in', 'Takeaway', 'Delivery']);
            $table->integer('table_number')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->enum('payment_method', ['Cash', 'Card', 'Mobile Banking'])->default('Cash');
            $table->text('items'); // JSON format for bill items
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
