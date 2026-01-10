<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultSettings = [
            ['key' => 'restaurant_name', 'value' => 'My Restaurant'],
            ['key' => 'email', 'value' => 'contact@restaurant.com'],
            ['key' => 'phone', 'value' => '+8801234567890'],
            ['key' => 'address', 'value' => 'Dhaka, Bangladesh'],
            ['key' => 'timezone', 'value' => 'UTC+6'],
            ['key' => 'currency', 'value' => 'BDT'],
            ['key' => 'theme', 'value' => 'light'],
            ['key' => 'business_hours', 'value' => 'Mon-Fri: 11AM - 10PM, Sat-Sun: 10AM - 11PM'],
        ];

        foreach ($defaultSettings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
