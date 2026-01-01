<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\Category;
use App\Models\InventoryItem;
use Illuminate\Support\Str;

class MenuController extends Controller
{
    // Get all categories
    public function getCategories()
    {
        $categories = Category::all();
        
        // Add 'all' category at the beginning
        $allCategory = [
            'id' => 'all',
            'name' => 'All Items',
            'slug' => 'all',
            'count' => MenuItem::count()
        ];
        
        // Transform categories to use slug as id for frontend filtering
        $categoriesArray = $categories->map(function($cat) {
            return [
                'id' => $cat->slug,  // Use slug as id for filtering
                'name' => $cat->name,
                'slug' => $cat->slug,
                'count' => $cat->count
            ];
        })->toArray();
        
        $categoriesArray = array_merge([$allCategory], $categoriesArray);
        
        return response()->json([
            'success' => true,
            'data' => $categoriesArray
        ]);
    }
    
    // Get all menu items
    public function getMenuItems()
    {
        $menuItems = MenuItem::all()->map(function($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'price' => (float) $item->price,
                'category' => $item->category,
                'image' => $item->image,
                'preparationTime' => $item->preparation_time,
                'available' => $item->available,
                'ingredients' => $item->ingredients ? explode(', ', $item->ingredients) : [],
                'allergens' => $item->allergens ? explode(', ', $item->allergens) : [],
                'isVegetarian' => $item->is_vegetarian,
                'isVegan' => $item->is_vegan,
                'spicyLevel' => $item->spicy_level
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $menuItems
        ]);
    }
    
    // Create new menu item
    public function createMenuItem(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string',
            'image' => 'nullable|string',
            'preparationTime' => 'nullable|integer|min:0',
            'available' => 'boolean',
            'ingredients' => 'nullable|string',
            'allergens' => 'nullable|string',
            'isVegetarian' => 'boolean',
            'isVegan' => 'boolean',
            'spicyLevel' => 'nullable|string|in:none,mild,medium,hot,extra-hot'
        ]);
        
        $menuItem = MenuItem::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category' => $request->category,
            'image' => $request->image,
            'preparation_time' => $request->preparationTime ?? 15,
            'available' => $request->available ?? true,
            'ingredients' => $request->ingredients,
            'allergens' => $request->allergens,
            'is_vegetarian' => $request->isVegetarian ?? false,
            'is_vegan' => $request->isVegan ?? false,
            'spicy_level' => $request->spicyLevel ?? 'none'
        ]);
        
        // Update category count
        $this->updateCategoryCount($request->category);
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'description' => $menuItem->description,
                'price' => (float) $menuItem->price,
                'category' => $menuItem->category,
                'image' => $menuItem->image,
                'preparationTime' => $menuItem->preparation_time,
                'available' => $menuItem->available,
                'ingredients' => $menuItem->ingredients ? explode(', ', $menuItem->ingredients) : [],
                'allergens' => $menuItem->allergens ? explode(', ', $menuItem->allergens) : [],
                'isVegetarian' => $menuItem->is_vegetarian,
                'isVegan' => $menuItem->is_vegan,
                'spicyLevel' => $menuItem->spicy_level
            ],
            'message' => 'Menu item created successfully'
        ], 201);
    }
    
    // Update menu item
    public function updateMenuItem(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category' => 'sometimes|required|string',
            'image' => 'nullable|string',
            'preparationTime' => 'nullable|integer|min:0',
            'available' => 'boolean',
            'ingredients' => 'nullable|string',
            'allergens' => 'nullable|string',
            'isVegetarian' => 'boolean',
            'isVegan' => 'boolean',
            'spicyLevel' => 'nullable|string|in:none,mild,medium,hot,extra-hot'
        ]);
        
        $oldCategory = $menuItem->category;
        
        $menuItem->update([
            'name' => $request->name ?? $menuItem->name,
            'description' => $request->description ?? $menuItem->description,
            'price' => $request->price ?? $menuItem->price,
            'category' => $request->category ?? $menuItem->category,
            'image' => $request->image ?? $menuItem->image,
            'preparation_time' => $request->preparationTime ?? $menuItem->preparation_time,
            'available' => $request->available ?? $menuItem->available,
            'ingredients' => $request->ingredients ?? $menuItem->ingredients,
            'allergens' => $request->allergens ?? $menuItem->allergens,
            'is_vegetarian' => $request->isVegetarian ?? $menuItem->is_vegetarian,
            'is_vegan' => $request->isVegan ?? $menuItem->is_vegan,
            'spicy_level' => $request->spicyLevel ?? $menuItem->spicy_level
        ]);
        
        // Update category counts if category changed
        if ($oldCategory !== $menuItem->category) {
            $this->updateCategoryCount($oldCategory);
            $this->updateCategoryCount($menuItem->category);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'description' => $menuItem->description,
                'price' => (float) $menuItem->price,
                'category' => $menuItem->category,
                'image' => $menuItem->image,
                'preparationTime' => $menuItem->preparation_time,
                'available' => $menuItem->available,
                'ingredients' => $menuItem->ingredients ? explode(', ', $menuItem->ingredients) : [],
                'allergens' => $menuItem->allergens ? explode(', ', $menuItem->allergens) : [],
                'isVegetarian' => $menuItem->is_vegetarian,
                'isVegan' => $menuItem->is_vegan,
                'spicyLevel' => $menuItem->spicy_level
            ],
            'message' => 'Menu item updated successfully'
        ]);
    }
    
    // Delete menu item
    public function deleteMenuItem($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $category = $menuItem->category;
        
        $menuItem->delete();
        
        // Update category count
        $this->updateCategoryCount($category);
        
        return response()->json([
            'success' => true,
            'message' => 'Menu item deleted successfully'
        ]);
    }
    
    // Toggle availability
    public function toggleAvailability($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->available = !$menuItem->available;
        $menuItem->save();
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'description' => $menuItem->description,
                'price' => (float) $menuItem->price,
                'category' => $menuItem->category,
                'image' => $menuItem->image,
                'preparationTime' => $menuItem->preparation_time,
                'available' => $menuItem->available,
                'ingredients' => $menuItem->ingredients ? explode(', ', $menuItem->ingredients) : [],
                'allergens' => $menuItem->allergens ? explode(', ', $menuItem->allergens) : [],
                'isVegetarian' => $menuItem->is_vegetarian,
                'isVegan' => $menuItem->is_vegan,
                'spicyLevel' => $menuItem->spicy_level
            ],
            'message' => 'Availability updated successfully'
        ]);
    }
    
    // Helper function to update category count
    private function updateCategoryCount($categorySlug)
    {
        $count = MenuItem::where('category', $categorySlug)->count();
        $category = Category::where('slug', $categorySlug)->first();
        
        if ($category) {
            $category->count = $count;
            $category->save();
        }
    }

    // Get menu item with its inventory ingredients
    public function getMenuItemIngredients($id)
    {
        $menuItem = MenuItem::with('inventoryItems')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'menuItem' => [
                    'id' => $menuItem->id,
                    'name' => $menuItem->name
                ],
                'ingredients' => $menuItem->inventoryItems->map(function($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'quantityRequired' => (float) $item->pivot->quantity_required,
                        'unit' => $item->unit,
                        'currentStock' => (float) $item->current_stock
                    ];
                })
            ]
        ]);
    }

    // Add ingredient to menu item
    public function addIngredientToMenuItem(Request $request, $id)
    {
        $request->validate([
            'inventoryItemId' => 'required|exists:inventory_items,id',
            'quantityRequired' => 'required|numeric|min:0'
        ]);

        $menuItem = MenuItem::findOrFail($id);
        $inventoryItem = InventoryItem::findOrFail($request->inventoryItemId);

        // Attach or update the relationship
        $menuItem->inventoryItems()->syncWithoutDetaching([
            $inventoryItem->id => ['quantity_required' => $request->quantityRequired]
        ]);

        return response()->json([
            'success' => true,
            'message' => "Ingredient '{$inventoryItem->name}' added to '{$menuItem->name}'"
        ]);
    }

    // Remove ingredient from menu item
    public function removeIngredientFromMenuItem($menuItemId, $inventoryItemId)
    {
        $menuItem = MenuItem::findOrFail($menuItemId);
        $menuItem->inventoryItems()->detach($inventoryItemId);

        return response()->json([
            'success' => true,
            'message' => 'Ingredient removed from menu item'
        ]);
    }
}
