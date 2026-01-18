<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BillController extends Controller
{
    /**
     * Get all bills with pagination and search
     */
    public function index(Request $request)
    {
        try {
            $query = Bill::with('order')->orderBy('created_at', 'desc');

            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('bill_number', 'like', "%{$search}%")
                      ->orWhere('customer_name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by date range
            if ($request->has('start_date') && $request->start_date) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }
            if ($request->has('end_date') && $request->end_date) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            // Filter by payment method
            if ($request->has('payment_method') && $request->payment_method) {
                $query->where('payment_method', $request->payment_method);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $bills = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'bills' => $bills
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch bills',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single bill
     */
    public function show($id)
    {
        try {
            $bill = Bill::with('order.orderItems')->findOrFail($id);

            return response()->json([
                'success' => true,
                'bill' => $bill
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bill not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new bill from an order
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_id' => 'required|exists:orders,id',
                'customer_name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'order_type' => 'required|in:Dine-in,Takeaway,Delivery',
                'table_number' => 'nullable|integer',
                'subtotal' => 'required|numeric|min:0',
                'tax' => 'nullable|numeric|min:0',
                'discount' => 'nullable|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'payment_method' => 'required|in:Cash,Card,Mobile Banking',
                'items' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Generate unique bill number
            $billNumber = 'BILL-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

            $bill = Bill::create([
                'order_id' => $request->order_id,
                'bill_number' => $billNumber,
                'customer_name' => $request->customer_name,
                'phone' => $request->phone,
                'email' => $request->email,
                'order_type' => $request->order_type,
                'table_number' => $request->table_number,
                'subtotal' => $request->subtotal,
                'tax' => $request->tax ?? 0,
                'discount' => $request->discount ?? 0,
                'total' => $request->total,
                'payment_method' => $request->payment_method,
                'items' => json_encode($request->items)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bill created successfully',
                'bill' => $bill
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create bill',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a bill
     */
    public function destroy($id)
    {
        try {
            $bill = Bill::findOrFail($id);
            $bill->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bill deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete bill',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get bill statistics
     */
    public function getStats()
    {
        try {
            $totalBills = Bill::count();
            $totalRevenue = Bill::sum('total');
            $todayRevenue = Bill::whereDate('created_at', today())->sum('total');
            $todayBills = Bill::whereDate('created_at', today())->count();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_bills' => $totalBills,
                    'total_revenue' => $totalRevenue,
                    'today_revenue' => $todayRevenue,
                    'today_bills' => $todayBills
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
