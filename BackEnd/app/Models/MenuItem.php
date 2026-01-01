<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image',
        'preparation_time',
        'available',
        'ingredients',
        'allergens',
        'is_vegetarian',
        'is_vegan',
        'spicy_level'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'available' => 'boolean',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'preparation_time' => 'integer'
    ];

    /**
     * Relationship: A menu item can use many inventory items
     */
    public function inventoryItems()
    {
        return $this->belongsToMany(InventoryItem::class, 'inventory_menu_item')
                    ->withPivot('quantity_required')
                    ->withTimestamps();
    }
}
