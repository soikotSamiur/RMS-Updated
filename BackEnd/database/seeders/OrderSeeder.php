<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some menu items for orders
        $menuItems = MenuItem::all();
        
        if ($menuItems->isEmpty()) {
            $this->command->warn('No menu items found. Please run MenuSeeder first.');
            return;
        }

        // Sample Order 1 - Dine-in (Pending)
        $order1 = Order::create([
            'customer_name' => 'John Doe',
            'phone' => '+8801712345678',
            'email' => 'john@example.com',
            'type' => 'dine-in',
            'table_number' => 5,
            'guests' => 2,
            'special_instructions' => 'Extra spicy please',
            'total' => 0,
            'status' => 'pending',
            'progress' => 0
        ]);

        $item1 = $menuItems->where('name', 'Grilled Salmon')->first() ?? $menuItems->random();
        $item2 = $menuItems->where('name', 'Caesar Salad')->first() ?? $menuItems->random();
        
        OrderItem::create([
            'order_id' => $order1->id,
            'menu_item_id' => $item1->id,
            'name' => $item1->name,
            'price' => $item1->price,
            'quantity' => 2
        ]);
        
        OrderItem::create([
            'order_id' => $order1->id,
            'menu_item_id' => $item2->id,
            'name' => $item2->name,
            'price' => $item2->price,
            'quantity' => 1
        ]);
        
        $order1->total = ($item1->price * 2) + ($item2->price * 1);
        $order1->save();

        // Sample Order 2 - Takeaway (Preparing)
        $order2 = Order::create([
            'customer_name' => 'Sarah Smith',
            'phone' => '+8801812345678',
            'email' => 'sarah@example.com',
            'type' => 'takeaway',
            'total' => 0,
            'status' => 'preparing',
            'progress' => 50
        ]);

        $item3 = $menuItems->where('name', 'Beef Burger')->first() ?? $menuItems->random();
        $item4 = $menuItems->where('name', 'Iced Coffee')->first() ?? $menuItems->random();
        
        OrderItem::create([
            'order_id' => $order2->id,
            'menu_item_id' => $item3->id,
            'name' => $item3->name,
            'price' => $item3->price,
            'quantity' => 1
        ]);
        
        OrderItem::create([
            'order_id' => $order2->id,
            'menu_item_id' => $item4->id,
            'name' => $item4->name,
            'price' => $item4->price,
            'quantity' => 2
        ]);
        
        $order2->total = ($item3->price * 1) + ($item4->price * 2);
        $order2->save();

        $this->command->info('Sample orders created successfully!');
    }
}
