<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;

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
    Route::get('/reports/sales', function () {
        return response()->json(['success' => true, 'data' => [], 'message' => 'Sales reports endpoint']);
    });
    Route::get('/reports/revenue', function () {
        return response()->json(['success' => true, 'data' => [], 'message' => 'Revenue reports endpoint']);
    });
    Route::get('/reports/inventory', function () {
        return response()->json(['success' => true, 'data' => [], 'message' => 'Inventory reports endpoint']);
    });
});

// Settings Routes - Only Admin can access
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/settings', function () {
        return response()->json(['success' => true, 'data' => [], 'message' => 'Settings endpoint']);
    });
    Route::put('/settings', function () {
        return response()->json(['success' => true, 'message' => 'Settings updated']);
    });
});

