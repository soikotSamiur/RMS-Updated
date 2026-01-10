<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Get all settings
     */
    public function index()
    {
        try {
            $settings = Setting::getAll();
            
            // Set default values if settings don't exist
            $defaultSettings = [
                'restaurant_name' => 'My Restaurant',
                'email' => 'contact@restaurant.com',
                'phone' => '+1234567890',
                'address' => '123 Main St, City, State',
                'timezone' => 'UTC+6',
                'currency' => 'BDT',
                'theme' => 'light',
                'business_hours' => 'Mon-Fri: 11AM - 10PM, Sat-Sun: 10AM - 11PM',
            ];

            // Merge defaults with existing settings
            $settings = array_merge($defaultSettings, $settings);

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        try {
            $request->validate([
                'restaurant_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'timezone' => 'nullable|string|max:50',
                'currency' => 'nullable|string|max:10',
                'theme' => 'nullable|string|in:light,dark',
                'business_hours' => 'nullable|string|max:500',
            ]);

            // Update each setting
            foreach ($request->all() as $key => $value) {
                if ($value !== null) {
                    Setting::set($key, $value);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => Setting::getAll()
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
