<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        // Add indexes to orders table for faster queries
        Schema::table('orders', function (Blueprint $table) {
            $table->index('created_at'); // For date range queries
            $table->index('status'); // For status filtering
            $table->index(['created_at', 'status']); // Composite index for combined queries
        });

        // Add indexes to order_items table
        Schema::table('order_items', function (Blueprint $table) {
            $table->index('order_id'); // For joins
            $table->index('menu_item_id'); // For joins
        });

        // Add index to menu_items table
        Schema::table('menu_items', function (Blueprint $table) {
            $table->index('category'); // For category grouping
        });
    }

    
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at', 'status']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['order_id']);
            $table->dropIndex(['menu_item_id']);
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropIndex(['category']);
        });
    }
};
