<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InventoryItem;
use Carbon\Carbon;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Only includes ingredients that are actually used in menu items
     */
    public function run(): void
    {
        $inventoryItems = [
            // ============ VEGETABLES ============
            [
                'name' => 'Romaine Lettuce',
                'category' => 'vegetables',
                'current_stock' => 15,
                'unit' => 'kg',
                'reorder_level' => 8,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 120.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Tomatoes',
                'category' => 'vegetables',
                'current_stock' => 20,
                'unit' => 'kg',
                'reorder_level' => 10,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 80.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Onions',
                'category' => 'vegetables',
                'current_stock' => 25,
                'unit' => 'kg',
                'reorder_level' => 10,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 50.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Cabbage',
                'category' => 'vegetables',
                'current_stock' => 12,
                'unit' => 'kg',
                'reorder_level' => 5,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 40.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Carrots',
                'category' => 'vegetables',
                'current_stock' => 18,
                'unit' => 'kg',
                'reorder_level' => 8,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 60.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Garlic',
                'category' => 'vegetables',
                'current_stock' => 5,
                'unit' => 'kg',
                'reorder_level' => 3,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 200.00,
                'last_restock_date' => Carbon::now()->subDays(3)
            ],
            [
                'name' => 'Ginger',
                'category' => 'vegetables',
                'current_stock' => 4,
                'unit' => 'kg',
                'reorder_level' => 2,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 180.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Potatoes',
                'category' => 'vegetables',
                'current_stock' => 30,
                'unit' => 'kg',
                'reorder_level' => 15,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 40.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Mixed Vegetables',
                'category' => 'vegetables',
                'current_stock' => 22,
                'unit' => 'kg',
                'reorder_level' => 10,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 100.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Celery',
                'category' => 'vegetables',
                'current_stock' => 6,
                'unit' => 'kg',
                'reorder_level' => 3,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 150.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Fresh Basil',
                'category' => 'vegetables',
                'current_stock' => 2,
                'unit' => 'kg',
                'reorder_level' => 1,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 300.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Parsley',
                'category' => 'vegetables',
                'current_stock' => 1.5,
                'unit' => 'kg',
                'reorder_level' => 1,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 250.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],

            // ============ MEAT & PROTEINS ============
            [
                'name' => 'Chicken Breast',
                'category' => 'meat',
                'current_stock' => 25,
                'unit' => 'kg',
                'reorder_level' => 10,
                'supplier' => 'Prime Meats BD',
                'status' => 'in_stock',
                'cost_per_unit' => 350.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Chicken Wings',
                'category' => 'meat',
                'current_stock' => 18,
                'unit' => 'kg',
                'reorder_level' => 8,
                'supplier' => 'Prime Meats BD',
                'status' => 'in_stock',
                'cost_per_unit' => 280.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Beef Patty',
                'category' => 'meat',
                'current_stock' => 30,
                'unit' => 'kg',
                'reorder_level' => 12,
                'supplier' => 'Prime Meats BD',
                'status' => 'in_stock',
                'cost_per_unit' => 500.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Salmon Fillet',
                'category' => 'meat',
                'current_stock' => 8,
                'unit' => 'kg',
                'reorder_level' => 5,
                'supplier' => 'Ocean Fresh BD',
                'status' => 'in_stock',
                'cost_per_unit' => 1200.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            // ============ DAIRY ============
            [
                'name' => 'Parmesan Cheese',
                'category' => 'dairy',
                'current_stock' => 5,
                'unit' => 'kg',
                'reorder_level' => 3,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 800.00,
                'last_restock_date' => Carbon::now()->subDays(3)
            ],
            [
                'name' => 'Cheese Slices',
                'category' => 'dairy',
                'current_stock' => 8,
                'unit' => 'kg',
                'reorder_level' => 4,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 450.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Butter',
                'category' => 'dairy',
                'current_stock' => 10,
                'unit' => 'kg',
                'reorder_level' => 5,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 400.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Cream',
                'category' => 'dairy',
                'current_stock' => 15,
                'unit' => 'L',
                'reorder_level' => 8,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 250.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Milk',
                'category' => 'dairy',
                'current_stock' => 20,
                'unit' => 'L',
                'reorder_level' => 10,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 80.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Cream Cheese',
                'category' => 'dairy',
                'current_stock' => 6,
                'unit' => 'kg',
                'reorder_level' => 3,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 650.00,
                'last_restock_date' => Carbon::now()->subDays(3)
            ],
            [
                'name' => 'Yogurt',
                'category' => 'dairy',
                'current_stock' => 12,
                'unit' => 'L',
                'reorder_level' => 6,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 120.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Whipped Cream',
                'category' => 'dairy',
                'current_stock' => 8,
                'unit' => 'L',
                'reorder_level' => 4,
                'supplier' => 'Dairy Products BD',
                'status' => 'in_stock',
                'cost_per_unit' => 300.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Vanilla Ice Cream',
                'category' => 'dairy',
                'current_stock' => 10,
                'unit' => 'L',
                'reorder_level' => 5,
                'supplier' => 'Igloo BD',
                'status' => 'in_stock',
                'cost_per_unit' => 400.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],

            // ============ BAKERY & GRAINS ============
            [
                'name' => 'Bread',
                'category' => 'bakery',
                'current_stock' => 50,
                'unit' => 'pieces',
                'reorder_level' => 25,
                'supplier' => 'Fresh Bakery BD',
                'status' => 'in_stock',
                'cost_per_unit' => 30.00,
                'last_restock_date' => Carbon::now()
            ],
            [
                'name' => 'Burger Buns',
                'category' => 'bakery',
                'current_stock' => 60,
                'unit' => 'pieces',
                'reorder_level' => 30,
                'supplier' => 'Fresh Bakery BD',
                'status' => 'in_stock',
                'cost_per_unit' => 25.00,
                'last_restock_date' => Carbon::now()
            ],
            [
                'name' => 'Pasta',
                'category' => 'bakery',
                'current_stock' => 25,
                'unit' => 'kg',
                'reorder_level' => 10,
                'supplier' => 'Italian Foods BD',
                'status' => 'in_stock',
                'cost_per_unit' => 180.00,
                'last_restock_date' => Carbon::now()->subDays(5)
            ],
            [
                'name' => 'Noodles',
                'category' => 'bakery',
                'current_stock' => 20,
                'unit' => 'kg',
                'reorder_level' => 10,
                'supplier' => 'Asian Foods BD',
                'status' => 'in_stock',
                'cost_per_unit' => 150.00,
                'last_restock_date' => Carbon::now()->subDays(4)
            ],
            [
                'name' => 'Spring Roll Wrappers',
                'category' => 'bakery',
                'current_stock' => 100,
                'unit' => 'pieces',
                'reorder_level' => 50,
                'supplier' => 'Asian Foods BD',
                'status' => 'in_stock',
                'cost_per_unit' => 5.00,
                'last_restock_date' => Carbon::now()->subDays(3)
            ],
            [
                'name' => 'Graham Crackers',
                'category' => 'bakery',
                'current_stock' => 10,
                'unit' => 'kg',
                'reorder_level' => 5,
                'supplier' => 'Fresh Bakery BD',
                'status' => 'in_stock',
                'cost_per_unit' => 220.00,
                'last_restock_date' => Carbon::now()->subDays(7)
            ],
            [
                'name' => 'Flour',
                'category' => 'bakery',
                'current_stock' => 40,
                'unit' => 'kg',
                'reorder_level' => 20,
                'supplier' => 'Fresh Bakery BD',
                'status' => 'in_stock',
                'cost_per_unit' => 60.00,
                'last_restock_date' => Carbon::now()->subDays(10)
            ],
            [
                'name' => 'Rice',
                'category' => 'bakery',
                'current_stock' => 50,
                'unit' => 'kg',
                'reorder_level' => 25,
                'supplier' => 'Rice Traders BD',
                'status' => 'in_stock',
                'cost_per_unit' => 70.00,
                'last_restock_date' => Carbon::now()->subDays(8)
            ],

            // ============ OILS & SAUCES ============
            [
                'name' => 'Olive Oil',
                'category' => 'oil',
                'current_stock' => 12,
                'unit' => 'L',
                'reorder_level' => 6,
                'supplier' => 'Gourmet Imports BD',
                'status' => 'in_stock',
                'cost_per_unit' => 800.00,
                'last_restock_date' => Carbon::now()->subDays(5)
            ],
            [
                'name' => 'Cooking Oil',
                'category' => 'oil',
                'current_stock' => 25,
                'unit' => 'L',
                'reorder_level' => 10,
                'supplier' => 'Local Suppliers',
                'status' => 'in_stock',
                'cost_per_unit' => 180.00,
                'last_restock_date' => Carbon::now()->subDays(3)
            ],
            [
                'name' => 'Soy Sauce',
                'category' => 'sauces',
                'current_stock' => 8,
                'unit' => 'L',
                'reorder_level' => 4,
                'supplier' => 'Asian Foods BD',
                'status' => 'in_stock',
                'cost_per_unit' => 350.00,
                'last_restock_date' => Carbon::now()->subDays(6)
            ],
            [
                'name' => 'BBQ Sauce',
                'category' => 'sauces',
                'current_stock' => 10,
                'unit' => 'L',
                'reorder_level' => 5,
                'supplier' => 'Sauce Masters BD',
                'status' => 'in_stock',
                'cost_per_unit' => 450.00,
                'last_restock_date' => Carbon::now()->subDays(4)
            ],
            [
                'name' => 'Hot Sauce',
                'category' => 'sauces',
                'current_stock' => 6,
                'unit' => 'L',
                'reorder_level' => 3,
                'supplier' => 'Sauce Masters BD',
                'status' => 'in_stock',
                'cost_per_unit' => 400.00,
                'last_restock_date' => Carbon::now()->subDays(4)
            ],
            [
                'name' => 'Sweet Chili Sauce',
                'category' => 'sauces',
                'current_stock' => 7,
                'unit' => 'L',
                'reorder_level' => 4,
                'supplier' => 'Asian Foods BD',
                'status' => 'in_stock',
                'cost_per_unit' => 380.00,
                'last_restock_date' => Carbon::now()->subDays(5)
            ],

            // ============ SPICES & SEASONINGS ============
            [
                'name' => 'Black Pepper',
                'category' => 'spices',
                'current_stock' => 3,
                'unit' => 'kg',
                'reorder_level' => 2,
                'supplier' => 'Spice World BD',
                'status' => 'in_stock',
                'cost_per_unit' => 600.00,
                'last_restock_date' => Carbon::now()->subDays(10)
            ],
            [
                'name' => 'Salt',
                'category' => 'spices',
                'current_stock' => 20,
                'unit' => 'kg',
                'reorder_level' => 10,
                'supplier' => 'Local Suppliers',
                'status' => 'in_stock',
                'cost_per_unit' => 30.00,
                'last_restock_date' => Carbon::now()->subDays(15)
            ],

            // ============ DESSERT INGREDIENTS ============
            [
                'name' => 'Dark Chocolate',
                'category' => 'dessert',
                'current_stock' => 8,
                'unit' => 'kg',
                'reorder_level' => 4,
                'supplier' => 'Chocolate House BD',
                'status' => 'in_stock',
                'cost_per_unit' => 900.00,
                'last_restock_date' => Carbon::now()->subDays(5)
            ],
            [
                'name' => 'Chocolate Sauce',
                'category' => 'dessert',
                'current_stock' => 10,
                'unit' => 'L',
                'reorder_level' => 5,
                'supplier' => 'Chocolate House BD',
                'status' => 'in_stock',
                'cost_per_unit' => 500.00,
                'last_restock_date' => Carbon::now()->subDays(4)
            ],
            [
                'name' => 'Sugar',
                'category' => 'dessert',
                'current_stock' => 30,
                'unit' => 'kg',
                'reorder_level' => 15,
                'supplier' => 'Local Suppliers',
                'status' => 'in_stock',
                'cost_per_unit' => 80.00,
                'last_restock_date' => Carbon::now()->subDays(7)
            ],
            [
                'name' => 'Eggs',
                'category' => 'bakery',
                'current_stock' => 200,
                'unit' => 'pieces',
                'reorder_level' => 100,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 12.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Honey',
                'category' => 'dessert',
                'current_stock' => 5,
                'unit' => 'L',
                'reorder_level' => 3,
                'supplier' => 'Honey BD',
                'status' => 'in_stock',
                'cost_per_unit' => 600.00,
                'last_restock_date' => Carbon::now()->subDays(12)
            ],
            [
                'name' => 'Nuts',
                'category' => 'dessert',
                'current_stock' => 4,
                'unit' => 'kg',
                'reorder_level' => 2,
                'supplier' => 'Dry Fruits BD',
                'status' => 'in_stock',
                'cost_per_unit' => 700.00,
                'last_restock_date' => Carbon::now()->subDays(8)
            ],
            [
                'name' => 'Cherry',
                'category' => 'dessert',
                'current_stock' => 100,
                'unit' => 'pieces',
                'reorder_level' => 50,
                'supplier' => 'Fruit Imports BD',
                'status' => 'in_stock',
                'cost_per_unit' => 8.00,
                'last_restock_date' => Carbon::now()->subDays(3)
            ],

            // ============ FRUITS & BEVERAGES ============
            [
                'name' => 'Fresh Oranges',
                'category' => 'fruits',
                'current_stock' => 30,
                'unit' => 'kg',
                'reorder_level' => 15,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 120.00,
                'last_restock_date' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Mangoes',
                'category' => 'fruits',
                'current_stock' => 25,
                'unit' => 'kg',
                'reorder_level' => 12,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 150.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Lemon',
                'category' => 'fruits',
                'current_stock' => 8,
                'unit' => 'kg',
                'reorder_level' => 5,
                'supplier' => 'Local Farm',
                'status' => 'in_stock',
                'cost_per_unit' => 100.00,
                'last_restock_date' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Coffee',
                'category' => 'beverages',
                'current_stock' => 10,
                'unit' => 'kg',
                'reorder_level' => 5,
                'supplier' => 'Coffee Masters BD',
                'status' => 'in_stock',
                'cost_per_unit' => 1200.00,
                'last_restock_date' => Carbon::now()->subDays(7)
            ],
            [
                'name' => 'Ice',
                'category' => 'beverages',
                'current_stock' => 50,
                'unit' => 'kg',
                'reorder_level' => 20,
                'supplier' => 'Ice Factory BD',
                'status' => 'in_stock',
                'cost_per_unit' => 20.00,
                'last_restock_date' => Carbon::now()
            ],
        ];

        foreach ($inventoryItems as $item) {
            InventoryItem::create($item);
        }
        
        $this->command->info('✅ Inventory items seeded successfully! (Only ingredients used in menu)');
    }
}
