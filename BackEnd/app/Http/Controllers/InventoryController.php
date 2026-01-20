<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
 // Get all inventory items with pagination and filters-1
    public function index(Request $request)
    {
       
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 15);
        $category = $request->input('category', 'all');
        $status = $request->input('status', 'all');
        $search = $request->input('search', '');

       
        $query = InventoryItem::query();

       
        if ($category !== 'all') {
            $query->where('category', $category);
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (!empty($search)) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $total = $query->count();
  
        $items = $query
            ->orderBy('name')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $statsQuery = InventoryItem::query();
        if ($category !== 'all') {
            $statsQuery->where('category', $category);
        }
        if (!empty($search)) {
            $statsQuery->where('name', 'like', '%' . $search . '%');
        }
        
        $allItems = $statsQuery->get();
        $outOfStockCount = $allItems->where('current_stock', '<=', 0)->count();
        $lowStockCount = $allItems->filter(function($item) {
            return $item->current_stock > 0 && $item->current_stock <= $item->reorder_level;
        })->count();
        
        $inStockCount = $allItems->filter(function($item) {
            return $item->current_stock > $item->reorder_level;
        })->count();

        
        return response()->json([
            'success' => true,
            'data' => $items->map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => $item->category,
                    'currentStock' => (float) $item->current_stock,
                    'unit' => $item->unit,
                    'reorderLevel' => (float) $item->reorder_level,
                    'supplier' => $item->supplier,
                    'status' => $item->status,
                    'costPerUnit' => $item->cost_per_unit ? (float) $item->cost_per_unit : null,
                    'lastRestockDate' => $item->last_restock_date ? $item->last_restock_date->toISOString() : null,
                    'createdAt' => $item->created_at->toISOString(),
                    'updatedAt' => $item->updated_at->toISOString()
                ];
            }),
            'pagination' => [
                'current_page' => (int) $page,
                'per_page' => (int) $perPage,
                'total' => $total,
                'total_pages' => ceil($total / $perPage)
            ],
            'stats' => [
                'in_stock' => $inStockCount,
                'low_stock' => $lowStockCount,
                'out_of_stock' => $outOfStockCount
            ]
        ]);
    }
    
// Get single inventory item-2
    public function show($id)
    {
        $item = InventoryItem::with('menuItems')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category,
                'currentStock' => (float) $item->current_stock,
                'unit' => $item->unit,
                'reorderLevel' => (float) $item->reorder_level,
                'supplier' => $item->supplier,
                'status' => $item->status,
                'costPerUnit' => $item->cost_per_unit ? (float) $item->cost_per_unit : null,
                'lastRestockDate' => $item->last_restock_date ? $item->last_restock_date->toISOString() : null,
                'menuItems' => $item->menuItems->map(function($menuItem) {
                    return [
                        'id' => $menuItem->id,
                        'name' => $menuItem->name,
                        'quantityRequired' => (float) $menuItem->pivot->quantity_required
                    ];
                })
            ]
        ]);
    }
    
 // Create new inventory item-3
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:vegetables,meat,dairy,beverages,spices,bakery,oil,sauces,dessert,fruits,other',
            'currentStock' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'reorderLevel' => 'required|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'costPerUnit' => 'nullable|numeric|min:0'
        ]);

        $item = InventoryItem::create([
            'name' => $request->name,
            'category' => $request->category,
            'current_stock' => $request->currentStock,
            'unit' => $request->unit,
            'reorder_level' => $request->reorderLevel,
            'supplier' => $request->supplier,
            'cost_per_unit' => $request->costPerUnit,
            'last_restock_date' => now()
        ]);

        $item->updateStatus();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category,
                'currentStock' => (float) $item->current_stock,
                'unit' => $item->unit,
                'reorderLevel' => (float) $item->reorder_level,
                'supplier' => $item->supplier,
                'status' => $item->status,
                'costPerUnit' => $item->cost_per_unit ? (float) $item->cost_per_unit : null,
                'lastRestockDate' => $item->last_restock_date ? $item->last_restock_date->toISOString() : null
            ],
            'message' => 'Inventory item created successfully'
        ], 201);
    }
    
 // Update inventory item-4
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:vegetables,meat,dairy,beverages,spices,bakery,oil,sauces,dessert,fruits,other',
            'currentStock' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'reorderLevel' => 'required|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'costPerUnit' => 'nullable|numeric|min:0'
        ]);

        $item = InventoryItem::findOrFail($id);

        $item->update([
            'name' => $request->name,
            'category' => $request->category,
            'current_stock' => $request->currentStock,
            'unit' => $request->unit,
            'reorder_level' => $request->reorderLevel,
            'supplier' => $request->supplier,
            'cost_per_unit' => $request->costPerUnit
        ]);

        $item->updateStatus();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category,
                'currentStock' => (float) $item->current_stock,
                'unit' => $item->unit,
                'reorderLevel' => (float) $item->reorder_level,
                'supplier' => $item->supplier,
                'status' => $item->status,
                'costPerUnit' => $item->cost_per_unit ? (float) $item->cost_per_unit : null
            ],
            'message' => 'Inventory item updated successfully'
        ]);
    }
    
 // Delete inventory item-5
    public function destroy($id)
    {
        $item = InventoryItem::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inventory item deleted successfully'
        ]);
    }
    
 // Get inventory statistics-6
    public function getStats()
    {
        $allItems = InventoryItem::all();
        $totalItems = $allItems->count();
        
        $outOfStockCount = $allItems->where('current_stock', '<=', 0)->count();
        $lowStockCount = $allItems->filter(function($item) {
            return $item->current_stock > 0 && $item->current_stock <= $item->reorder_level;
        })->count();
        $inStockCount = $allItems->filter(function($item) {
            return $item->current_stock > $item->reorder_level;
        })->count();
        
        $totalValue = $allItems->sum(function($item) {
            return $item->current_stock * ($item->cost_per_unit ?? 0);
        });

        return response()->json([
            'success' => true,
            'data' => [
                'totalItems' => $totalItems,
                'lowStockCount' => $lowStockCount,
                'outOfStockCount' => $outOfStockCount,
                'totalValue' => (float) $totalValue,
                'inStockCount' => $inStockCount
            ]
        ]);
    }
    
 // Get low stock items-7
    public function getLowStock()
    {
        $items = InventoryItem::whereIn('status', ['low_stock', 'out_of_stock'])
                              ->orderBy('current_stock')
                              ->get();

        return response()->json([
            'success' => true,
            'data' => $items->map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'category' => $item->category,
                    'currentStock' => (float) $item->current_stock,
                    'unit' => $item->unit,
                    'reorderLevel' => (float) $item->reorder_level,
                    'supplier' => $item->supplier,
                    'status' => $item->status
                ];
            })
        ]);
    }
    
 // Update stock manually-8
    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'change' => 'required|numeric'
        ]);

        $item = InventoryItem::findOrFail($id);
        
        if ($request->change > 0) {
            $item->addStock($request->change);
        } else {
            $item->deductStock(abs($request->change));
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $item->id,
                'name' => $item->name,
                'currentStock' => (float) $item->current_stock,
                'status' => $item->status
            ],
            'message' => 'Stock updated successfully'
        ]);
    }
    
 // Link inventory item to menu item-9
    public function linkToMenuItem(Request $request, $id)
    {
        $request->validate([
            'menuItemId' => 'required|exists:menu_items,id',
            'quantityRequired' => 'required|numeric|min:0'
        ]);

        $inventoryItem = InventoryItem::findOrFail($id);
        $menuItem = MenuItem::findOrFail($request->menuItemId);

        $inventoryItem->menuItems()->syncWithoutDetaching([
            $menuItem->id => ['quantity_required' => $request->quantityRequired]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Inventory item linked to menu item successfully'
        ]);
    }
    
 // Unlink inventory item from menu item-10
    public function unlinkFromMenuItem($id, $menuItemId)
    {
        $inventoryItem = InventoryItem::findOrFail($id);
        $inventoryItem->menuItems()->detach($menuItemId);

        return response()->json([
            'success' => true,
            'message' => 'Inventory item unlinked from menu item successfully'
        ]);
    }
}
