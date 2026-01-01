<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\MenuItem;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Appetizers', 'slug' => 'appetizers', 'count' => 0],
            ['name' => 'Main Course', 'slug' => 'main-course', 'count' => 0],
            ['name' => 'Desserts', 'slug' => 'desserts', 'count' => 0],
            ['name' => 'Beverages', 'slug' => 'beverages', 'count' => 0],
            ['name' => 'Soups', 'slug' => 'soups', 'count' => 0],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create menu items
        $menuItems = [
            // ============ APPETIZERS ============
            [
                'name' => 'Caesar Salad',
                'description' => 'Fresh romaine lettuce with parmesan cheese, croutons, and Caesar dressing',
                'price' => 450.00,
                'category' => 'appetizers',
                'image' => 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
                'preparation_time' => 10,
                'available' => true,
                'ingredients' => 'Romaine lettuce, Parmesan cheese, Croutons, Caesar dressing, Olive oil',
                'allergens' => 'Dairy, Gluten',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Spring Rolls',
                'description' => 'Crispy vegetable spring rolls served with sweet chili sauce',
                'price' => 350.00,
                'category' => 'appetizers',
                'image' => 'https://images.unsplash.com/photo-1599909451134-f9bc8578727c?w=400',
                'preparation_time' => 15,
                'available' => true,
                'ingredients' => 'Cabbage, Carrots, Spring roll wrappers, Soy sauce, Sweet chili sauce',
                'allergens' => 'Gluten, Soy',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'spicy_level' => 'mild'
            ],
            [
                'name' => 'Chicken Wings',
                'description' => 'Crispy fried chicken wings with BBQ or hot sauce',
                'price' => 550.00,
                'category' => 'appetizers',
                'image' => 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
                'preparation_time' => 20,
                'available' => true,
                'ingredients' => 'Chicken wings, BBQ sauce, Hot sauce, Cooking oil',
                'allergens' => 'None',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'spicy_level' => 'hot'
            ],
            [
                'name' => 'Garlic Bread',
                'description' => 'Toasted bread with garlic butter and herbs',
                'price' => 250.00,
                'category' => 'appetizers',
                'image' => 'https://images.unsplash.com/photo-1573140401552-3fab0b24f1cc?w=400',
                'preparation_time' => 8,
                'available' => true,
                'ingredients' => 'Bread, Garlic, Butter, Parsley, Olive oil',
                'allergens' => 'Gluten, Dairy',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'French Fries',
                'description' => 'Crispy golden french fries with ketchup',
                'price' => 200.00,
                'category' => 'appetizers',
                'image' => 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400',
                'preparation_time' => 12,
                'available' => true,
                'ingredients' => 'Potatoes, Cooking oil, Salt',
                'allergens' => 'None',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'spicy_level' => 'none'
            ],

            // ============ SOUPS ============
            [
                'name' => 'Tomato Soup',
                'description' => 'Creamy tomato soup served with garlic bread',
                'price' => 300.00,
                'category' => 'soups',
                'image' => 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
                'preparation_time' => 15,
                'available' => true,
                'ingredients' => 'Tomatoes, Cream, Onions, Garlic, Basil',
                'allergens' => 'Dairy',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Chicken Noodle Soup',
                'description' => 'Hearty chicken soup with noodles and vegetables',
                'price' => 400.00,
                'category' => 'soups',
                'image' => 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
                'preparation_time' => 18,
                'available' => true,
                'ingredients' => 'Chicken breast, Noodles, Carrots, Celery, Onions',
                'allergens' => 'Gluten',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],

            // ============ MAIN COURSE ============
            [
                'name' => 'Grilled Chicken Steak',
                'description' => 'Juicy grilled chicken breast with mashed potatoes and vegetables',
                'price' => 850.00,
                'category' => 'main-course',
                'image' => 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
                'preparation_time' => 25,
                'available' => true,
                'ingredients' => 'Chicken breast, Potatoes, Butter, Mixed vegetables, Black pepper',
                'allergens' => 'Dairy',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'spicy_level' => 'mild'
            ],
            [
                'name' => 'Beef Burger Deluxe',
                'description' => 'Premium beef patty with cheese, lettuce, tomato, and special sauce',
                'price' => 750.00,
                'category' => 'main-course',
                'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
                'preparation_time' => 18,
                'available' => true,
                'ingredients' => 'Beef patty, Cheese, Lettuce, Tomatoes, Burger buns, Onions',
                'allergens' => 'Gluten, Dairy',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'spicy_level' => 'mild'
            ],
            [
                'name' => 'Pasta Alfredo',
                'description' => 'Creamy fettuccine pasta with parmesan cheese',
                'price' => 650.00,
                'category' => 'main-course',
                'image' => 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400',
                'preparation_time' => 20,
                'available' => true,
                'ingredients' => 'Pasta, Cream, Parmesan cheese, Garlic, Butter',
                'allergens' => 'Gluten, Dairy',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Grilled Salmon',
                'description' => 'Fresh Atlantic salmon with lemon butter sauce and steamed vegetables',
                'price' => 1200.00,
                'category' => 'main-course',
                'image' => 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400',
                'preparation_time' => 22,
                'available' => true,
                'ingredients' => 'Salmon fillet, Lemon, Butter, Mixed vegetables, Olive oil',
                'allergens' => 'Fish, Dairy',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Vegetable Stir Fry',
                'description' => 'Fresh mixed vegetables stir-fried in Asian sauce with rice',
                'price' => 550.00,
                'category' => 'main-course',
                'image' => 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
                'preparation_time' => 15,
                'available' => true,
                'ingredients' => 'Mixed vegetables, Soy sauce, Garlic, Ginger, Rice',
                'allergens' => 'Soy',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'spicy_level' => 'medium'
            ],
            // ============ DESSERTS ============
            [
                'name' => 'Chocolate Lava Cake',
                'description' => 'Warm chocolate cake with molten center, served with vanilla ice cream',
                'price' => 450.00,
                'category' => 'desserts',
                'image' => 'https://images.unsplash.com/photo-1606312619070-d48b4cdc7e59?w=400',
                'preparation_time' => 12,
                'available' => true,
                'ingredients' => 'Dark chocolate, Flour, Eggs, Butter, Vanilla ice cream, Sugar',
                'allergens' => 'Gluten, Dairy, Eggs',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Cheesecake',
                'description' => 'Classic New York style cheesecake with berry compote',
                'price' => 400.00,
                'category' => 'desserts',
                'image' => 'https://images.unsplash.com/photo-1533134442586-62531b9c09de?w=400',
                'preparation_time' => 5,
                'available' => true,
                'ingredients' => 'Cream cheese, Graham crackers, Sugar, Eggs, Butter',
                'allergens' => 'Gluten, Dairy, Eggs',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Ice Cream Sundae',
                'description' => 'Three scoops of ice cream with chocolate sauce and nuts',
                'price' => 350.00,
                'category' => 'desserts',
                'image' => 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
                'preparation_time' => 5,
                'available' => true,
                'ingredients' => 'Vanilla ice cream, Chocolate sauce, Whipped cream, Nuts, Cherry',
                'allergens' => 'Dairy, Nuts',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Brownie',
                'description' => 'Fudgy chocolate brownie with ice cream',
                'price' => 320.00,
                'category' => 'desserts',
                'image' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
                'preparation_time' => 8,
                'available' => true,
                'ingredients' => 'Dark chocolate, Flour, Eggs, Butter, Sugar, Vanilla ice cream',
                'allergens' => 'Gluten, Dairy, Eggs',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],

            // ============ BEVERAGES ============
            [
                'name' => 'Fresh Orange Juice',
                'description' => 'Freshly squeezed orange juice',
                'price' => 200.00,
                'category' => 'beverages',
                'image' => 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
                'preparation_time' => 5,
                'available' => true,
                'ingredients' => 'Fresh oranges',
                'allergens' => '',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Iced Coffee',
                'description' => 'Cold brew coffee served over ice with milk',
                'price' => 250.00,
                'category' => 'beverages',
                'image' => 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
                'preparation_time' => 3,
                'available' => true,
                'ingredients' => 'Coffee, Ice, Milk, Sugar',
                'allergens' => 'Dairy',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Mango Smoothie',
                'description' => 'Fresh mango blended with yogurt and honey',
                'price' => 280.00,
                'category' => 'beverages',
                'image' => 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
                'preparation_time' => 5,
                'available' => true,
                'ingredients' => 'Mangoes, Yogurt, Honey, Ice',
                'allergens' => 'Dairy',
                'is_vegetarian' => true,
                'is_vegan' => false,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Soft Drink',
                'description' => 'Coke, Sprite, or Fanta',
                'price' => 120.00,
                'category' => 'beverages',
                'image' => 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
                'preparation_time' => 2,
                'available' => true,
                'ingredients' => 'Carbonated soft drink',
                'allergens' => '',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'spicy_level' => 'none'
            ],
            [
                'name' => 'Mineral Water',
                'description' => 'Chilled mineral water',
                'price' => 60.00,
                'category' => 'beverages',
                'image' => 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
                'preparation_time' => 1,
                'available' => true,
                'ingredients' => 'Mineral water',
                'allergens' => '',
                'is_vegetarian' => true,
                'is_vegan' => true,
                'spicy_level' => 'none'
            ],
        ];

        foreach ($menuItems as $item) {
            MenuItem::create($item);
        }

        // Update category counts
        $categoryList = ['appetizers', 'main-course', 'desserts', 'beverages', 'soups'];
        foreach ($categoryList as $slug) {
            $count = MenuItem::where('category', $slug)->count();
            Category::where('slug', $slug)->update(['count' => $count]);
        }
        
        $this->command->info('✅ Menu items and categories seeded successfully!');
    }
}
