<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->string('category');
            $table->longText('image')->nullable(); // Support both URLs and base64 images
            $table->integer('preparation_time')->default(15); // in minutes
            $table->boolean('available')->default(true);
            $table->text('ingredients')->nullable(); // stored as comma-separated
            $table->text('allergens')->nullable(); // stored as comma-separated
            $table->boolean('is_vegetarian')->default(false);
            $table->boolean('is_vegan')->default(false);
            $table->enum('spicy_level', ['none', 'mild', 'medium', 'hot', 'extra-hot'])->default('none');
            $table->timestamps();
        });
    }

    // Reverse the migrations.
     
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
