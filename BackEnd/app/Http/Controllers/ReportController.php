<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\InventoryItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get Sales Report
     * Returns daily sales data for the specified date range
     */
    public function getSalesReport(Request $request)
    {
        $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate'
        ]);

        $startDate = Carbon::parse($request->startDate)->startOfDay();
        $endDate = Carbon::parse($request->endDate)->endOfDay();

        // Get orders grouped by date
        $salesData = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total) as totalPrice')
            )
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Transform data to match frontend expectations
        $formattedData = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $dateString = $currentDate->format('Y-m-d');
            
            // Find sales for this date
            $daySales = $salesData->firstWhere('date', $dateString);
            
            if ($daySales) {
                $totalPrice = (float) $daySales->totalPrice;
                $revenue = $totalPrice * 0.40;  // Revenue is 40% of total price
                $orders = $daySales->orders;
                $averageOrder = $orders > 0 ? $totalPrice / $orders : 0;
            } else {
                $totalPrice = 0;
                $revenue = 0;
                $orders = 0;
                $averageOrder = 0;
            }

            $formattedData[] = [
                'date' => $dateString,
                'totalPrice' => $totalPrice,
                'revenue' => $revenue,
                'orders' => $orders,
                'averageOrder' => round($averageOrder, 2)
            ];

            $currentDate->addDay();
        }

        return response()->json([
            'success' => true,
            'data' => $formattedData
        ]);
    }

    /**
     * Get Inventory Report
     * Returns inventory status grouped by category
     */
    public function getInventoryReport(Request $request)
    {
        // Get all inventory items grouped by category
        // Only include categories that have at least one item
        $inventoryData = InventoryItem::select(
            'category',
            DB::raw('COUNT(*) as totalItems'),
            DB::raw('SUM(CASE WHEN status = "low_stock" THEN 1 ELSE 0 END) as lowStock'),
            DB::raw('SUM(CASE WHEN status = "out_of_stock" THEN 1 ELSE 0 END) as outOfStock'),
            DB::raw('SUM(CASE WHEN status = "in_stock" THEN 1 ELSE 0 END) as inStock'),
            DB::raw('SUM(current_stock * COALESCE(cost_per_unit, 0)) as value')
        )
        ->groupBy('category')
        ->having('totalItems', '>', 0)  // Only show categories with items
        ->orderBy('category')
        ->get();

        // Format category names
        $formattedData = $inventoryData->map(function($item) {
            return [
                'category' => ucfirst($item->category),
                'totalItems' => $item->totalItems,
                'lowStock' => $item->lowStock,
                'outOfStock' => $item->outOfStock,
                'inStock' => $item->inStock,
                'value' => round((float) $item->value, 2)
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedData
        ]);
    }

    /**
     * Get Financial Report
     * Returns financial summary including revenue, expenses, and profit
     * Profit calculation: 40% of revenue is profit
     */
    public function getFinancialReport(Request $request)
    {
        $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate'
        ]);

        $startDate = Carbon::parse($request->startDate)->startOfDay();
        $endDate = Carbon::parse($request->endDate)->endOfDay();

        // Get total revenue from orders
        $totalRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $revenue = (float) $totalRevenue;

        // Calculate financial metrics based on 40% profit margin
        $profit = $revenue * 0.40;  // 40% of revenue is profit
        $expenses = $revenue - $profit;  // 60% of revenue is expenses
        
        // Tax calculation (let's assume 10% of profit)
        $tax = $profit * 0.10;
        $netProfit = $profit - $tax;

        // Breakdown of revenue and expenses
        // Revenue breakdown (typical restaurant split)
        $foodSales = $revenue * 0.75;  // 75% from food
        $beverageSales = $revenue * 0.25;  // 25% from beverages

        // Expense breakdown (60% of revenue)
        $ingredientCosts = $expenses * 0.55;  // 55% of expenses = 33% of revenue
        $laborCosts = $expenses * 0.30;       // 30% of expenses = 18% of revenue
        $rentUtilities = $expenses * 0.15;     // 15% of expenses = 9% of revenue

        $breakdown = [
            [
                'category' => 'Food Sales',
                'amount' => round($foodSales, 2),
                'percentage' => 75
            ],
            [
                'category' => 'Beverage Sales',
                'amount' => round($beverageSales, 2),
                'percentage' => 25
            ],
            [
                'category' => 'Ingredient Costs',
                'amount' => round($ingredientCosts, 2),
                'percentage' => round(($ingredientCosts / $revenue) * 100, 1)
            ],
            [
                'category' => 'Labor Costs',
                'amount' => round($laborCosts, 2),
                'percentage' => round(($laborCosts / $revenue) * 100, 1)
            ],
            [
                'category' => 'Rent & Utilities',
                'amount' => round($rentUtilities, 2),
                'percentage' => round(($rentUtilities / $revenue) * 100, 1)
            ]
        ];

        $financialData = [
            'revenue' => round($revenue, 2),
            'expenses' => round($expenses, 2),
            'profit' => round($profit, 2),
            'tax' => round($tax, 2),
            'netProfit' => round($netProfit, 2),
            'breakdown' => $breakdown
        ];

        return response()->json([
            'success' => true,
            'data' => $financialData
        ]);
    }

    /**
     * Get Report Stats (used in ReportStats component)
     * Returns summary statistics based on report type
     */
    public function getReportStats(Request $request)
    {
        $reportType = $request->input('type', 'sales');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');

        if ($reportType === 'sales' && $startDate && $endDate) {
            $start = Carbon::parse($startDate)->startOfDay();
            $end = Carbon::parse($endDate)->endOfDay();

            $totalOrders = Order::whereBetween('created_at', [$start, $end])
                ->where('status', '!=', 'cancelled')
                ->count();

            $totalRevenue = Order::whereBetween('created_at', [$start, $end])
                ->where('status', '!=', 'cancelled')
                ->sum('total');

            $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'totalOrders' => $totalOrders,
                    'totalRevenue' => round((float) $totalRevenue, 2),
                    'averageOrderValue' => round($avgOrderValue, 2)
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }
}
