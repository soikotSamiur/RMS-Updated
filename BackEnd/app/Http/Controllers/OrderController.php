<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // Get all orders
    public function index()
    {
        $orders = Order::with('orderItems')->orderBy('created_at', 'desc')->get();
        
        $ordersArray = $orders->map(function($order) {
            return [
                'id' => $order->id,
                'customerName' => $order->customer_name,
                'phone' => $order->phone,
                'email' => $order->email,
                'type' => $order->type,
                'tableNumber' => $order->table_number,
                'guests' => $order->guests,
                'address' => $order->address,
                'specialInstructions' => $order->special_instructions,
                'items' => $order->orderItems->map(function($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'price' => (float) $item->price,
                        'quantity' => $item->quantity
                    ];
                }),
                'total' => (float) $order->total,
                'status' => $order->status,
                'progress' => $order->progress,
                'timestamp' => $order->created_at->toISOString(),
                'orderTime' => $order->created_at->diffForHumans()
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $ordersArray
        ]);
    }
    
    // Get single order
    public function show($id)
    {
        $order = Order::with('orderItems')->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $order->id,
                'customerName' => $order->customer_name,
                'phone' => $order->phone,
                'email' => $order->email,
                'type' => $order->type,
                'tableNumber' => $order->table_number,
                'guests' => $order->guests,
                'address' => $order->address,
                'specialInstructions' => $order->special_instructions,
                'items' => $order->orderItems->map(function($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'price' => (float) $item->price,
                        'quantity' => $item->quantity
                    ];
                }),
                'total' => (float) $order->total,
                'status' => $order->status,
                'progress' => $order->progress,
                'timestamp' => $order->created_at->toISOString(),
                'orderTime' => $order->created_at->diffForHumans()
            ]
        ]);
    }
    
    // Create new order
    public function store(Request $request)
    {
        $request->validate([
            'customerName' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'type' => 'required|in:dine-in,takeaway',
            'tableNumber' => 'nullable|integer',
            'guests' => 'nullable|integer',
            'address' => 'nullable|string',
            'specialInstructions' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0'
        ]);
        
        DB::beginTransaction();
        
        try {
            // Check inventory availability for all items
            $insufficientStock = [];
            
            foreach ($request->items as $item) {
                $menuItem = MenuItem::with('inventoryItems')->find($item['id']);
                
                if ($menuItem && $menuItem->inventoryItems->count() > 0) {
                    foreach ($menuItem->inventoryItems as $inventoryItem) {
                        $requiredQuantity = $inventoryItem->pivot->quantity_required * $item['quantity'];
                        
                        if ($inventoryItem->current_stock < $requiredQuantity) {
                            $insufficientStock[] = [
                                'item' => $menuItem->name,
                                'ingredient' => $inventoryItem->name,
                                'required' => $requiredQuantity,
                                'available' => $inventoryItem->current_stock,
                                'unit' => $inventoryItem->unit
                            ];
                        }
                    }
                }
            }
            
            // If any item has insufficient stock, return error
            if (count($insufficientStock) > 0) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient inventory stock',
                    'insufficientStock' => $insufficientStock
                ], 400);
            }
            
            // Create order
            $order = Order::create([
                'customer_name' => $request->customerName,
                'phone' => $request->phone,
                'email' => $request->email,
                'type' => $request->type,
                'table_number' => $request->tableNumber,
                'guests' => $request->guests,
                'address' => $request->address,
                'special_instructions' => $request->specialInstructions,
                'total' => $request->total,
                'status' => 'pending',
                'progress' => 0
            ]);
            
            // Create order items (inventory will be deducted when order status changes to 'preparing')
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['id'],
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity']
                ]);
            }
            
            DB::commit();
            
            // Load order items for response
            $order->load('orderItems');
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $order->id,
                    'customerName' => $order->customer_name,
                    'phone' => $order->phone,
                    'email' => $order->email,
                    'type' => $order->type,
                    'tableNumber' => $order->table_number,
                    'guests' => $order->guests,
                    'address' => $order->address,
                    'specialInstructions' => $order->special_instructions,
                    'items' => $order->orderItems->map(function($item) {
                        return [
                            'id' => $item->menu_item_id,
                            'name' => $item->name,
                            'price' => (float) $item->price,
                            'quantity' => $item->quantity
                        ];
                    }),
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'progress' => $order->progress,
                    'timestamp' => $order->created_at->toISOString(),
                    'orderTime' => $order->created_at->diffForHumans()
                ],
                'message' => 'Order created successfully'
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // Update existing order
    public function update(Request $request, $id)
    {
        $request->validate([
            'customerName' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'type' => 'required|in:dine-in,takeaway',
            'tableNumber' => 'nullable|integer',
            'guests' => 'nullable|integer',
            'address' => 'nullable|string',
            'specialInstructions' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0'
        ]);
        
        DB::beginTransaction();
        
        try {
            $order = Order::findOrFail($id);
            
            // Update order
            $order->update([
                'customer_name' => $request->customerName,
                'phone' => $request->phone,
                'email' => $request->email,
                'type' => $request->type,
                'table_number' => $request->tableNumber,
                'guests' => $request->guests,
                'address' => $request->address,
                'special_instructions' => $request->specialInstructions,
                'total' => $request->total
            ]);
            
            // Delete existing order items
            $order->orderItems()->delete();
            
            // Create new order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['id'],
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity']
                ]);
            }
            
            DB::commit();
            
            // Load order items for response
            $order->load('orderItems');
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $order->id,
                    'customerName' => $order->customer_name,
                    'phone' => $order->phone,
                    'email' => $order->email,
                    'type' => $order->type,
                    'tableNumber' => $order->table_number,
                    'guests' => $order->guests,
                    'address' => $order->address,
                    'specialInstructions' => $order->special_instructions,
                    'items' => $order->orderItems->map(function($item) {
                        return [
                            'id' => $item->menu_item_id,
                            'name' => $item->name,
                            'price' => (float) $item->price,
                            'quantity' => $item->quantity
                        ];
                    }),
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'progress' => $order->progress,
                    'timestamp' => $order->created_at->toISOString(),
                    'orderTime' => $order->created_at->diffForHumans()
                ],
                'message' => 'Order updated successfully'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // Update order status
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,completed,cancelled'
        ]);
        
        DB::beginTransaction();
        
        try {
            $order = Order::with('orderItems')->findOrFail($id);
            $previousStatus = $order->status;
            $order->status = $request->status;
            
            // Update progress based on status
            switch ($request->status) {
                case 'pending':
                    $order->progress = 0;
                    break;
                case 'preparing':
                    $order->progress = 50;
                    
                    // Deduct inventory when order is accepted (moved to preparing)
                    if (!$order->inventory_deducted) {
                        foreach ($order->orderItems as $orderItem) {
                            $menuItem = MenuItem::with('inventoryItems')->find($orderItem->menu_item_id);
                            
                            if ($menuItem && $menuItem->inventoryItems->count() > 0) {
                                foreach ($menuItem->inventoryItems as $inventoryItem) {
                                    $requiredQuantity = $inventoryItem->pivot->quantity_required * $orderItem->quantity;
                                    
                                    // Check if sufficient stock exists
                                    if ($inventoryItem->current_stock < $requiredQuantity) {
                                        DB::rollBack();
                                        return response()->json([
                                            'success' => false,
                                            'message' => "Insufficient stock for {$inventoryItem->name}. Required: {$requiredQuantity} {$inventoryItem->unit}, Available: {$inventoryItem->current_stock} {$inventoryItem->unit}"
                                        ], 400);
                                    }
                                    
                                    $inventoryItem->deductStock($requiredQuantity);
                                }
                            }
                        }
                        $order->inventory_deducted = true;
                    }
                    break;
                case 'ready':
                    $order->progress = 75;
                    break;
                case 'completed':
                    $order->progress = 100;
                    break;
                case 'cancelled':
                    $order->progress = 0;
                    break;
            }
            
            $order->save();
            
            DB::commit();
        
            $order->load('orderItems');
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $order->id,
                    'customerName' => $order->customer_name,
                    'phone' => $order->phone,
                    'email' => $order->email,
                    'type' => $order->type,
                    'tableNumber' => $order->table_number,
                    'guests' => $order->guests,
                    'address' => $order->address,
                    'specialInstructions' => $order->special_instructions,
                    'items' => $order->orderItems->map(function($item) {
                        return [
                            'id' => $item->menu_item_id,
                            'name' => $item->name,
                            'price' => (float) $item->price,
                            'quantity' => $item->quantity
                        ];
                    }),
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'progress' => $order->progress,
                    'timestamp' => $order->created_at->toISOString(),
                    'orderTime' => $order->created_at->diffForHumans()
                ],
                'message' => 'Order status updated successfully'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // Delete order
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }
}

