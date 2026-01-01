<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;
use App\Models\InventoryItem;

class InventoryMenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Links menu items to their required inventory ingredients
     */
    public function run(): void
    {
        // Helper function to find inventory item
        $findIngredient = function($name) {
            return InventoryItem::where('name', 'LIKE', "%{$name}%")->first();
        };
        
        // ============ APPETIZERS ============
        
        // Caesar Salad
        $caesarSalad = MenuItem::where('name', 'Caesar Salad')->first();
        if ($caesarSalad) {
            $caesarSalad->inventoryItems()->attach($findIngredient('Romaine Lettuce')->id, ['quantity_required' => 0.1]); // 100g
            $caesarSalad->inventoryItems()->attach($findIngredient('Parmesan Cheese')->id, ['quantity_required' => 0.02]); // 20g
            $caesarSalad->inventoryItems()->attach($findIngredient('Olive Oil')->id, ['quantity_required' => 0.015]); // 15ml
        }
        
        // Spring Rolls
        $springRolls = MenuItem::where('name', 'Spring Rolls')->first();
        if ($springRolls) {
            $springRolls->inventoryItems()->attach($findIngredient('Cabbage')->id, ['quantity_required' => 0.06]); // 60g
            $springRolls->inventoryItems()->attach($findIngredient('Carrots')->id, ['quantity_required' => 0.04]); // 40g
            $springRolls->inventoryItems()->attach($findIngredient('Spring Roll Wrappers')->id, ['quantity_required' => 6]); // 6 pieces
            $springRolls->inventoryItems()->attach($findIngredient('Soy Sauce')->id, ['quantity_required' => 0.01]); // 10ml
            $springRolls->inventoryItems()->attach($findIngredient('Sweet Chili Sauce')->id, ['quantity_required' => 0.05]); // 50ml
        }
        
        // Chicken Wings
        $chickenWings = MenuItem::where('name', 'Chicken Wings')->first();
        if ($chickenWings) {
            $chickenWings->inventoryItems()->attach($findIngredient('Chicken Wings')->id, ['quantity_required' => 0.35]); // 350g (6-8 wings)
            $chickenWings->inventoryItems()->attach($findIngredient('BBQ Sauce')->id, ['quantity_required' => 0.06]); // 60ml
            $chickenWings->inventoryItems()->attach($findIngredient('Hot Sauce')->id, ['quantity_required' => 0.02]); // 20ml
            $chickenWings->inventoryItems()->attach($findIngredient('Cooking Oil')->id, ['quantity_required' => 0.05]); // 50ml for frying
        }
        
        // Garlic Bread
        $garlicBread = MenuItem::where('name', 'Garlic Bread')->first();
        if ($garlicBread) {
            $garlicBread->inventoryItems()->attach($findIngredient('Bread')->id, ['quantity_required' => 4]); // 4 slices
            $garlicBread->inventoryItems()->attach($findIngredient('Garlic')->id, ['quantity_required' => 0.015]); // 15g (3-4 cloves)
            $garlicBread->inventoryItems()->attach($findIngredient('Butter')->id, ['quantity_required' => 0.04]); // 40g
            $garlicBread->inventoryItems()->attach($findIngredient('Parsley')->id, ['quantity_required' => 0.005]); // 5g
            $garlicBread->inventoryItems()->attach($findIngredient('Olive Oil')->id, ['quantity_required' => 0.01]); // 10ml
        }
        
        // French Fries
        $frenchFries = MenuItem::where('name', 'French Fries')->first();
        if ($frenchFries) {
            $frenchFries->inventoryItems()->attach($findIngredient('Potatoes')->id, ['quantity_required' => 0.25]); // 250g
            $frenchFries->inventoryItems()->attach($findIngredient('Cooking Oil')->id, ['quantity_required' => 0.15]); // 150ml for deep frying
            $frenchFries->inventoryItems()->attach($findIngredient('Salt')->id, ['quantity_required' => 0.003]); // 3g
        }
        
        // ============ SOUPS ============
        
        // Tomato Soup
        $tomatoSoup = MenuItem::where('name', 'Tomato Soup')->first();
        if ($tomatoSoup) {
            $tomatoSoup->inventoryItems()->attach($findIngredient('Tomatoes')->id, ['quantity_required' => 0.3]); // 300g
            $tomatoSoup->inventoryItems()->attach($findIngredient('Cream')->id, ['quantity_required' => 0.06]); // 60ml
            $tomatoSoup->inventoryItems()->attach($findIngredient('Onions')->id, ['quantity_required' => 0.06]); // 60g
            $tomatoSoup->inventoryItems()->attach($findIngredient('Garlic')->id, ['quantity_required' => 0.008]); // 8g (2 cloves)
            $tomatoSoup->inventoryItems()->attach($findIngredient('Fresh Basil')->id, ['quantity_required' => 0.003]); // 3g
        }
        
        // Chicken Noodle Soup
        $chickenNoodleSoup = MenuItem::where('name', 'Chicken Noodle Soup')->first();
        if ($chickenNoodleSoup) {
            $chickenNoodleSoup->inventoryItems()->attach($findIngredient('Chicken Breast')->id, ['quantity_required' => 0.12]); // 120g
            $chickenNoodleSoup->inventoryItems()->attach($findIngredient('Noodles')->id, ['quantity_required' => 0.08]); // 80g
            $chickenNoodleSoup->inventoryItems()->attach($findIngredient('Carrots')->id, ['quantity_required' => 0.04]); // 40g
            $chickenNoodleSoup->inventoryItems()->attach($findIngredient('Celery')->id, ['quantity_required' => 0.025]); // 25g
            $chickenNoodleSoup->inventoryItems()->attach($findIngredient('Onions')->id, ['quantity_required' => 0.04]); // 40g
        }
        
        // ============ MAIN COURSE ============
        
        // Grilled Chicken Steak
        $chickenSteak = MenuItem::where('name', 'Grilled Chicken Steak')->first();
        if ($chickenSteak) {
            $chickenSteak->inventoryItems()->attach($findIngredient('Chicken Breast')->id, ['quantity_required' => 0.22]); // 220g
            $chickenSteak->inventoryItems()->attach($findIngredient('Potatoes')->id, ['quantity_required' => 0.18]); // 180g
            $chickenSteak->inventoryItems()->attach($findIngredient('Butter')->id, ['quantity_required' => 0.025]); // 25g
            $chickenSteak->inventoryItems()->attach($findIngredient('Mixed Vegetables')->id, ['quantity_required' => 0.12]); // 120g
            $chickenSteak->inventoryItems()->attach($findIngredient('Black Pepper')->id, ['quantity_required' => 0.002]); // 2g
        }
        
        // Beef Burger Deluxe
        $beefBurger = MenuItem::where('name', 'Beef Burger Deluxe')->first();
        if ($beefBurger) {
            $beefBurger->inventoryItems()->attach($findIngredient('Beef Patty')->id, ['quantity_required' => 0.18]); // 180g patty
            $beefBurger->inventoryItems()->attach($findIngredient('Cheese Slices')->id, ['quantity_required' => 0.025]); // 25g (1 slice)
            $beefBurger->inventoryItems()->attach($findIngredient('Romaine Lettuce')->id, ['quantity_required' => 0.02]); // 20g
            $beefBurger->inventoryItems()->attach($findIngredient('Tomatoes')->id, ['quantity_required' => 0.04]); // 40g (2 slices)
            $beefBurger->inventoryItems()->attach($findIngredient('Burger Buns')->id, ['quantity_required' => 1]); // 1 bun
            $beefBurger->inventoryItems()->attach($findIngredient('Onions')->id, ['quantity_required' => 0.025]); // 25g
        }
        
        // Pasta Alfredo
        $pastaAlfredo = MenuItem::where('name', 'Pasta Alfredo')->first();
        if ($pastaAlfredo) {
            $pastaAlfredo->inventoryItems()->attach($findIngredient('Pasta')->id, ['quantity_required' => 0.15]); // 150g dry pasta
            $pastaAlfredo->inventoryItems()->attach($findIngredient('Cream')->id, ['quantity_required' => 0.12]); // 120ml
            $pastaAlfredo->inventoryItems()->attach($findIngredient('Parmesan Cheese')->id, ['quantity_required' => 0.035]); // 35g
            $pastaAlfredo->inventoryItems()->attach($findIngredient('Garlic')->id, ['quantity_required' => 0.01]); // 10g (2-3 cloves)
            $pastaAlfredo->inventoryItems()->attach($findIngredient('Butter')->id, ['quantity_required' => 0.03]); // 30g
        }
        
        // Grilled Salmon
        $grilledSalmon = MenuItem::where('name', 'Grilled Salmon')->first();
        if ($grilledSalmon) {
            $grilledSalmon->inventoryItems()->attach($findIngredient('Salmon Fillet')->id, ['quantity_required' => 0.18]); // 180g
            $grilledSalmon->inventoryItems()->attach($findIngredient('Lemon')->id, ['quantity_required' => 0.03]); // 30g (half lemon)
            $grilledSalmon->inventoryItems()->attach($findIngredient('Butter')->id, ['quantity_required' => 0.025]); // 25g
            $grilledSalmon->inventoryItems()->attach($findIngredient('Mixed Vegetables')->id, ['quantity_required' => 0.12]); // 120g
            $grilledSalmon->inventoryItems()->attach($findIngredient('Olive Oil')->id, ['quantity_required' => 0.015]); // 15ml
        }
        
        // Vegetable Stir Fry
        $vegStirFry = MenuItem::where('name', 'Vegetable Stir Fry')->first();
        if ($vegStirFry) {
            $vegStirFry->inventoryItems()->attach($findIngredient('Mixed Vegetables')->id, ['quantity_required' => 0.2]); // 200g
            $vegStirFry->inventoryItems()->attach($findIngredient('Soy Sauce')->id, ['quantity_required' => 0.025]); // 25ml
            $vegStirFry->inventoryItems()->attach($findIngredient('Garlic')->id, ['quantity_required' => 0.012]); // 12g (3 cloves)
            $vegStirFry->inventoryItems()->attach($findIngredient('Ginger')->id, ['quantity_required' => 0.008]); // 8g
            $vegStirFry->inventoryItems()->attach($findIngredient('Rice')->id, ['quantity_required' => 0.12]); // 120g cooked
        }
        
        // ============ DESSERTS ============
        
        // Chocolate Lava Cake
        $lavaCake = MenuItem::where('name', 'Chocolate Lava Cake')->first();
        if ($lavaCake) {
            $lavaCake->inventoryItems()->attach($findIngredient('Dark Chocolate')->id, ['quantity_required' => 0.07]); // 70g
            $lavaCake->inventoryItems()->attach($findIngredient('Flour')->id, ['quantity_required' => 0.04]); // 40g
            $lavaCake->inventoryItems()->attach($findIngredient('Eggs')->id, ['quantity_required' => 2]); // 2 eggs
            $lavaCake->inventoryItems()->attach($findIngredient('Butter')->id, ['quantity_required' => 0.05]); // 50g
            $lavaCake->inventoryItems()->attach($findIngredient('Vanilla Ice Cream')->id, ['quantity_required' => 0.08]); // 80g (1 scoop)
            $lavaCake->inventoryItems()->attach($findIngredient('Sugar')->id, ['quantity_required' => 0.04]); // 40g
        }
        
        // Cheesecake
        $cheesecake = MenuItem::where('name', 'Cheesecake')->first();
        if ($cheesecake) {
            $cheesecake->inventoryItems()->attach($findIngredient('Cream Cheese')->id, ['quantity_required' => 0.12]); // 120g (per slice)
            $cheesecake->inventoryItems()->attach($findIngredient('Graham Crackers')->id, ['quantity_required' => 0.04]); // 40g
            $cheesecake->inventoryItems()->attach($findIngredient('Sugar')->id, ['quantity_required' => 0.035]); // 35g
            $cheesecake->inventoryItems()->attach($findIngredient('Eggs')->id, ['quantity_required' => 1]); // 1 egg per slice
            $cheesecake->inventoryItems()->attach($findIngredient('Butter')->id, ['quantity_required' => 0.025]); // 25g
        }
        
        // Ice Cream Sundae
        $iceCreamSundae = MenuItem::where('name', 'Ice Cream Sundae')->first();
        if ($iceCreamSundae) {
            $iceCreamSundae->inventoryItems()->attach($findIngredient('Vanilla Ice Cream')->id, ['quantity_required' => 0.2]); // 200g (3 scoops)
            $iceCreamSundae->inventoryItems()->attach($findIngredient('Chocolate Sauce')->id, ['quantity_required' => 0.04]); // 40ml
            $iceCreamSundae->inventoryItems()->attach($findIngredient('Whipped Cream')->id, ['quantity_required' => 0.025]); // 25ml
            $iceCreamSundae->inventoryItems()->attach($findIngredient('Nuts')->id, ['quantity_required' => 0.015]); // 15g
            $iceCreamSundae->inventoryItems()->attach($findIngredient('Cherry')->id, ['quantity_required' => 1]); // 1 cherry
        }
        
        // Brownie
        $brownie = MenuItem::where('name', 'Brownie')->first();
        if ($brownie) {
            $brownie->inventoryItems()->attach($findIngredient('Dark Chocolate')->id, ['quantity_required' => 0.055]); // 55g
            $brownie->inventoryItems()->attach($findIngredient('Flour')->id, ['quantity_required' => 0.035]); // 35g
            $brownie->inventoryItems()->attach($findIngredient('Eggs')->id, ['quantity_required' => 1]); // 1 egg
            $brownie->inventoryItems()->attach($findIngredient('Butter')->id, ['quantity_required' => 0.045]); // 45g
            $brownie->inventoryItems()->attach($findIngredient('Sugar')->id, ['quantity_required' => 0.045]); // 45g
            $brownie->inventoryItems()->attach($findIngredient('Vanilla Ice Cream')->id, ['quantity_required' => 0.07]); // 70g (1 scoop)
        }
        
        // ============ BEVERAGES ============
        
        // Fresh Orange Juice
        $orangeJuice = MenuItem::where('name', 'Fresh Orange Juice')->first();
        if ($orangeJuice) {
            $orangeJuice->inventoryItems()->attach($findIngredient('Fresh Oranges')->id, ['quantity_required' => 0.35]); // 350g (3-4 oranges)
        }
        
        // Iced Coffee
        $icedCoffee = MenuItem::where('name', 'Iced Coffee')->first();
        if ($icedCoffee) {
            $icedCoffee->inventoryItems()->attach($findIngredient('Coffee')->id, ['quantity_required' => 0.018]); // 18g coffee
            $icedCoffee->inventoryItems()->attach($findIngredient('Ice')->id, ['quantity_required' => 0.12]); // 120g ice
            $icedCoffee->inventoryItems()->attach($findIngredient('Milk')->id, ['quantity_required' => 0.08]); // 80ml
            $icedCoffee->inventoryItems()->attach($findIngredient('Sugar')->id, ['quantity_required' => 0.015]); // 15g
        }
        
        // Mango Smoothie
        $mangoSmoothie = MenuItem::where('name', 'Mango Smoothie')->first();
        if ($mangoSmoothie) {
            $mangoSmoothie->inventoryItems()->attach($findIngredient('Mangoes')->id, ['quantity_required' => 0.18]); // 180g (1 mango)
            $mangoSmoothie->inventoryItems()->attach($findIngredient('Yogurt')->id, ['quantity_required' => 0.12]); // 120ml
            $mangoSmoothie->inventoryItems()->attach($findIngredient('Honey')->id, ['quantity_required' => 0.015]); // 15ml
            $mangoSmoothie->inventoryItems()->attach($findIngredient('Ice')->id, ['quantity_required' => 0.08]); // 80g
        }
        
        $this->command->info('✅ Menu items linked to inventory ingredients successfully!');
        $this->command->info('📊 All menu items now have their required ingredients properly mapped.');
    }
}
