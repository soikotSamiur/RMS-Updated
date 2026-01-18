<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardStats()
    {
        $data = Cache::remember('dashboard_stats', 300, function () {
            // Get current month data
            $currentMonthStart = Carbon::now()->startOfMonth();
            $currentMonthEnd = Carbon::now()->endOfMonth();
            $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
            $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();
            
            // Optimize: Get all monthly stats in one query
            $monthlyStats = Order::where('status', '!=', 'cancelled')
                ->whereBetween('created_at', [$lastMonthStart, $currentMonthEnd])
                ->selectRaw('
                    SUM(CASE WHEN created_at >= ? THEN total ELSE 0 END) as current_month_sales,
                    SUM(CASE WHEN created_at < ? THEN total ELSE 0 END) as last_month_sales
                ', [$currentMonthStart, $currentMonthStart])
                ->first();
            
            $totalSales = $monthlyStats->current_month_sales ?? 0;
            $lastMonthSales = $monthlyStats->last_month_sales ?? 0;
            
            $totalRevenue = $totalSales * 0.40;
            $lastMonthRevenue = $lastMonthSales * 0.40;
            
            $revenueChange = $lastMonthRevenue > 0 
                ? (($totalRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
                : 0;
            
            // Optimize: Get today and yesterday orders in one query
            $orderStats = Order::whereBetween('created_at', [Carbon::yesterday()->startOfDay(), Carbon::now()->endOfDay()])
                ->selectRaw('
                    COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_orders,
                    COUNT(CASE WHEN DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 END) as yesterday_orders
                ')
                ->first();
            
            $todayOrders = $orderStats->today_orders ?? 0;
            $yesterdayOrders = $orderStats->yesterday_orders ?? 0;
            
            $ordersChange = $yesterdayOrders > 0 
                ? (($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100 
                : 0;
            
            // Optimize: Get average order value stats in one query
            $avgStats = Order::where('status', '!=', 'cancelled')
                ->selectRaw('
                    AVG(total) as overall_avg,
                    AVG(CASE WHEN created_at BETWEEN ? AND ? THEN total END) as last_month_avg
                ', [$lastMonthStart, $lastMonthEnd])
                ->first();
            
            $avgOrderValue = $avgStats->overall_avg ?? 0;
            $lastMonthAvg = $avgStats->last_month_avg ?? 0;
            
            $avgChange = $lastMonthAvg > 0 
                ? (($avgOrderValue - $lastMonthAvg) / $lastMonthAvg) * 100 
                : 0;
        
            return [
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
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
    
    // Get Daily Revenue & Profit Trends
    public function getDailyTrends()
    {
    
        $data = Cache::remember('dashboard_daily_trends', 300, function () {
            $startDate = Carbon::now()->subMonths(11)->startOfMonth();
            $endDate = Carbon::now()->endOfMonth();
        $monthlyData = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->selectRaw('
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                SUM(total) * 0.40 as revenue
            ')
            ->groupBy(DB::raw('YEAR(created_at)'), DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('YEAR(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get()
            ->keyBy(function($item) {
                return $item->year . '-' . $item->month;
            });
        $formattedData = [];
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $key = $currentDate->year . '-' . $currentDate->month;
            $revenue = isset($monthlyData[$key]) ? (float) $monthlyData[$key]->revenue : 0;
            
            $formattedData[] = [
                'month' => $currentDate->format('M'),
                'revenue' => $revenue
            ];
            
            $currentDate->addMonth();
        }
        
            return $formattedData;
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
    
    // Get Sales Distribution by Category
     
    public function getCategoryDistribution()
    {
        $data = Cache::remember('dashboard_category_distribution', 300, function () {
        $categoryMap = [
            'appetizers' => 'Appetizers',
            'main-courses' => 'Main Courses',
            'desserts' => 'Desserts',
            'beverages' => 'Beverages',
            'special-items' => 'Special Items',
            'sides' => 'Sides',
            'salads' => 'Salads'
        ];
        $categoryData = OrderItem::join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->selectRaw('
                menu_items.category,
                SUM(order_items.quantity) as totalQuantity,
                SUM(order_items.price * order_items.quantity) * 0.40 as revenue
            ')
            ->groupBy('menu_items.category')
            ->get()
            ->map(function($item) use ($categoryMap) {
                $categoryName = $categoryMap[$item->category] ?? ucfirst(str_replace('-', ' ', $item->category));
                
                return [
                    'category' => $categoryName,
                    'value' => (float) $item->revenue,
                    'quantity' => $item->totalQuantity
                ];
            });
        
            return $categoryData;
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    // Get Top 5 Selling Products
    public function getTopSellingProducts()
    {
        
        $data = Cache::remember('dashboard_top_selling', 300, function () {
        $categoryMap = [
            'appetizers' => 'Appetizers',
            'main-courses' => 'Main Courses',
            'desserts' => 'Desserts',
            'beverages' => 'Beverages',
            'special-items' => 'Special Items',
            'sides' => 'Sides',
            'salads' => 'Salads'
        ];
        
        // Optimize: Calculate revenue directly in SQL and limit results
        $topProducts = OrderItem::join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->selectRaw('
                menu_items.id,
                menu_items.name,
                menu_items.price,
                menu_items.image,
                menu_items.category,
                SUM(order_items.quantity) as totalSold,
                SUM(order_items.price * order_items.quantity) * 0.40 as totalRevenue
            ')
            ->groupBy('menu_items.id', 'menu_items.name', 'menu_items.price', 'menu_items.image', 'menu_items.category')
            ->orderByDesc(DB::raw('SUM(order_items.quantity)'))
            ->limit(5)
            ->get()
            ->map(function($item) use ($categoryMap) {
                $categoryName = $categoryMap[$item->category] ?? ucfirst(str_replace('-', ' ', $item->category));
                
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (float) $item->price,
                    'image' => $item->image,
                    'category' => $categoryName,
                    'totalSold' => $item->totalSold,
                    'totalRevenue' => round((float) $item->totalRevenue, 2)
                ];
            });

            return $topProducts;
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
