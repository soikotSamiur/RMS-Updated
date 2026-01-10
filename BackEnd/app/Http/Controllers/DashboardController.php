<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get Dashboard Statistics
     */
    public function getDashboardStats()
    {
        // Get current month data
        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();
        $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();
        
        // Total Revenue - This month (40% of total sales)
        $totalSales = Order::whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
            ->where('status', '!=', 'cancelled')
            ->sum('total');
        
        $totalRevenue = $totalSales * 0.40;
        
        $lastMonthSales = Order::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->where('status', '!=', 'cancelled')
            ->sum('total');
        
        $lastMonthRevenue = $lastMonthSales * 0.40;
        
        $revenueChange = $lastMonthRevenue > 0 
            ? (($totalRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;
        
        // Today's Orders
        $todayOrders = Order::whereDate('created_at', Carbon::today())
            ->count();
        
        $yesterdayOrders = Order::whereDate('created_at', Carbon::yesterday())
            ->count();
        
        $ordersChange = $yesterdayOrders > 0 
            ? (($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100 
            : 0;
        
        // Average Order Value
        $totalOrdersValue = Order::where('status', '!=', 'cancelled')->sum('total');
        $totalOrdersCount = Order::where('status', '!=', 'cancelled')->count();
        $avgOrderValue = $totalOrdersCount > 0 ? $totalOrdersValue / $totalOrdersCount : 0;
        
        // For comparison, get last month's average
        $lastMonthTotalValue = Order::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->where('status', '!=', 'cancelled')
            ->sum('total');
        $lastMonthTotalCount = Order::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->where('status', '!=', 'cancelled')
            ->count();
        $lastMonthAvg = $lastMonthTotalCount > 0 ? $lastMonthTotalValue / $lastMonthTotalCount : 0;
        
        $avgChange = $lastMonthAvg > 0 
            ? (($avgOrderValue - $lastMonthAvg) / $lastMonthAvg) * 100 
            : 0;
        
        return response()->json([
            'success' => true,
            'data' => [
                'totalRevenue' => [
                    'value' => round((float) $totalRevenue, 2),
                    'change' => round($revenueChange, 1),
                    'period' => 'This month'
                ],
                'todayOrders' => [
                    'value' => $todayOrders,
                    'change' => round($ordersChange, 1),
                    'period' => 'Today'
                ],
                'avgOrderValue' => [
                    'value' => round($avgOrderValue, 2),
                    'change' => round($avgChange, 1),
                    'period' => 'Per order'
                ]
            ]
        ]);
    }
    
    /**
     * Get Daily Revenue & Profit Trends
     */
    public function getDailyTrends()
    {
        // Get data for the last 12 months
        $startDate = Carbon::now()->subMonths(11)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();
        
        $monthlyData = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
        
        // Format data for chart
        $formattedData = [];
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $year = $currentDate->year;
            $month = $currentDate->month;
            
            $monthData = $monthlyData->first(function($item) use ($year, $month) {
                return $item->year == $year && $item->month == $month;
            });
            
            $totalSales = $monthData ? (float) $monthData->revenue : 0;
            $revenue = $totalSales * 0.40; // Revenue is 40% of total sales
            
            $formattedData[] = [
                'month' => $currentDate->format('M'),
                'revenue' => $revenue
            ];
            
            $currentDate->addMonth();
        }
        
        return response()->json([
            'success' => true,
            'data' => $formattedData
        ]);
    }
    
    /**
     * Get Sales Distribution by Category
     */
    public function getCategoryDistribution()
    {
        // Get all menu items with their categories and sales
        $categoryData = OrderItem::join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->select(
                'menu_items.category',
                DB::raw('SUM(order_items.quantity) as totalQuantity'),
                DB::raw('SUM(order_items.price * order_items.quantity) as totalRevenue')
            )
            ->groupBy('menu_items.category')
            ->get();
        
        // Map categories to proper names
        $categoryMap = [
            'appetizers' => 'Appetizers',
            'main-courses' => 'Main Courses',
            'desserts' => 'Desserts',
            'beverages' => 'Beverages',
            'special-items' => 'Special Items',
            'sides' => 'Sides',
            'salads' => 'Salads'
        ];
        
        $formattedData = $categoryData->map(function($item) use ($categoryMap) {
            $categoryName = $categoryMap[$item->category] ?? ucfirst(str_replace('-', ' ', $item->category));
            
            $totalSales = (float) $item->totalRevenue;
            $revenue = $totalSales * 0.40; // Revenue is 40% of total sales
            
            return [
                'category' => $categoryName,
                'value' => $revenue,
                'quantity' => $item->totalQuantity
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $formattedData
        ]);
    }

    /**
     * Get Top 5 Selling Products
     */
    public function getTopSellingProducts()
    {
        $topProducts = OrderItem::join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->select(
                'menu_items.id',
                'menu_items.name',
                'menu_items.price',
                'menu_items.image',
                'menu_items.category',
                DB::raw('SUM(order_items.quantity) as totalSold'),
                DB::raw('SUM(order_items.price * order_items.quantity) as totalRevenue')
            )
            ->groupBy('menu_items.id', 'menu_items.name', 'menu_items.price', 'menu_items.image', 'menu_items.category')
            ->orderBy('totalSold', 'desc')
            ->limit(5)
            ->get();

        // Map categories to proper names
        $categoryMap = [
            'appetizers' => 'Appetizers',
            'main-courses' => 'Main Courses',
            'desserts' => 'Desserts',
            'beverages' => 'Beverages',
            'special-items' => 'Special Items',
            'sides' => 'Sides',
            'salads' => 'Salads'
        ];

        $formattedData = $topProducts->map(function($item) use ($categoryMap) {
            $categoryName = $categoryMap[$item->category] ?? ucfirst(str_replace('-', ' ', $item->category));
            
            $totalSales = (float) $item->totalRevenue;
            $revenue = $totalSales * 0.40; // Revenue is 40% of total sales
            
            return [
                'id' => $item->id,
                'name' => $item->name,
                'price' => (float) $item->price,
                'image' => $item->image,
                'category' => $categoryName,
                'totalSold' => $item->totalSold,
                'totalRevenue' => round($revenue, 2)
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedData
        ]);
    }
}
