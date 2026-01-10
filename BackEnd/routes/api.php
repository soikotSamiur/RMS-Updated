<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\DashboardController;

// API Routes

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication Routes (Public)
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);

// Password Reset Routes (Public)
Route::post('/password/send-otp', [PasswordResetController::class, 'sendOTP']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

// User CRUD - Only Admin can access
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});

// Menu Routes - Admin, Waiter, Chef, Employee can access
Route::middleware(['auth:sanctum', 'role:Admin,Waiter,Chef,Employee'])->group(function () {
    Route::get('/menu-items', [MenuController::class, 'getMenuItems']);
    Route::post('/menu-items', [MenuController::class, 'createMenuItem']);
    Route::put('/menu-items/{id}', [MenuController::class, 'updateMenuItem']);
    Route::delete('/menu-items/{id}', [MenuController::class, 'deleteMenuItem']);
    Route::patch('/menu-items/{id}/toggle-availability', [MenuController::class, 'toggleAvailability']);
    
    // Menu item ingredients management
    Route::get('/menu-items/{id}/ingredients', [MenuController::class, 'getMenuItemIngredients']);
    Route::post('/menu-items/{id}/ingredients', [MenuController::class, 'addIngredientToMenuItem']);
    Route::delete('/menu-items/{menuItemId}/ingredients/{inventoryItemId}', [MenuController::class, 'removeIngredientFromMenuItem']);
});

// Category Routes - Admin, Waiter, Chef, Employee can access
Route::middleware(['auth:sanctum', 'role:Admin,Waiter,Chef,Employee'])->group(function () {
    Route::get('/categories', [MenuController::class, 'getCategories']);
});

// Order Routes - Admin, Waiter, Chef, Cashier, Employee can access
Route::middleware(['auth:sanctum', 'role:Admin,Waiter,Chef,Cashier,Employee'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::delete('/orders/{id}', [OrderController::class, 'destroy']);
});

// Inventory Routes - Only Admin can access
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/inventory', [App\Http\Controllers\InventoryController::class, 'index']);
    Route::post('/inventory', [App\Http\Controllers\InventoryController::class, 'store']);
    Route::get('/inventory/stats', [App\Http\Controllers\InventoryController::class, 'getStats']);
    Route::get('/inventory/low-stock', [App\Http\Controllers\InventoryController::class, 'getLowStock']);
    Route::get('/inventory/{id}', [App\Http\Controllers\InventoryController::class, 'show']);
    Route::put('/inventory/{id}', [App\Http\Controllers\InventoryController::class, 'update']);
    Route::delete('/inventory/{id}', [App\Http\Controllers\InventoryController::class, 'destroy']);
    Route::patch('/inventory/{id}/stock', [App\Http\Controllers\InventoryController::class, 'updateStock']);
    Route::post('/inventory/{id}/link-menu-item', [App\Http\Controllers\InventoryController::class, 'linkToMenuItem']);
    Route::delete('/inventory/{id}/unlink-menu-item/{menuItemId}', [App\Http\Controllers\InventoryController::class, 'unlinkFromMenuItem']);
});

// Reports Routes - Only Admin can access
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/reports/sales', [ReportController::class, 'getSalesReport']);
    Route::get('/reports/inventory', [ReportController::class, 'getInventoryReport']);
    Route::get('/reports/financial', [ReportController::class, 'getFinancialReport']);
    Route::get('/reports/stats', [ReportController::class, 'getReportStats']);
});

// Settings Routes - Only Admin can access
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);
});

// Dashboard Routes - Admin, Waiter, Chef, Cashier, Employee can access
Route::middleware(['auth:sanctum', 'role:Admin,Waiter,Chef,Cashier,Employee'])->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'getDashboardStats']);
    Route::get('/dashboard/daily-trends', [DashboardController::class, 'getDailyTrends']);
    Route::get('/dashboard/category-distribution', [DashboardController::class, 'getCategoryDistribution']);
    Route::get('/dashboard/top-selling', [DashboardController::class, 'getTopSellingProducts']);
});
