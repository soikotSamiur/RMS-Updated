<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    /**
     * Get all inventory items with optional filters
     */
    public function index(Request $request)
    {
        $query = InventoryItem::query();

        // Apply filters
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $items = $query->orderBy('name')->get();

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
            })
        ]);
    }

    /**
     * Get a single inventory item
     */
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

    /**
     * Create a new inventory item
     */
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

    /**
     * Update an existing inventory item
     */
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

    /**
     * Delete an inventory item
     */
    public function destroy($id)
    {
        $item = InventoryItem::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inventory item deleted successfully'
        ]);
    }

    /**
     * Get inventory statistics
     */
    public function getStats()
    {
        $totalItems = InventoryItem::count();
        $lowStockCount = InventoryItem::where('status', 'low_stock')->count();
        $outOfStockCount = InventoryItem::where('status', 'out_of_stock')->count();
        $totalValue = InventoryItem::selectRaw('SUM(current_stock * cost_per_unit) as total')
                                   ->value('total') ?? 0;

        return response()->json([
            'success' => true,
            'data' => [
                'totalItems' => $totalItems,
                'lowStockCount' => $lowStockCount,
                'outOfStockCount' => $outOfStockCount,
                'totalValue' => (float) $totalValue,
                'inStockCount' => $totalItems - $lowStockCount - $outOfStockCount
            ]
        ]);
    }

    /**
     * Get low stock items
     */
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

    /**
     * Update stock manually (add or remove)
     */
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

    /**
     * Link inventory item to menu item
     */
    public function linkToMenuItem(Request $request, $id)
    {
        $request->validate([
            'menuItemId' => 'required|exists:menu_items,id',
            'quantityRequired' => 'required|numeric|min:0'
        ]);

        $inventoryItem = InventoryItem::findOrFail($id);
        $menuItem = MenuItem::findOrFail($request->menuItemId);

        // Attach or update the relationship
        $inventoryItem->menuItems()->syncWithoutDetaching([
            $menuItem->id => ['quantity_required' => $request->quantityRequired]
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Inventory item linked to menu item successfully'
        ]);
    }

    /**
     * Unlink inventory item from menu item
     */
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
