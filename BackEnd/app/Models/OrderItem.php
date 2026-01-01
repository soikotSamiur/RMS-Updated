<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'menu_item_id',
        'name',
        'price',
        'quantity'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer'
    ];

    // Relationship: An order item belongs to an order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Relationship: An order item may belong to a menu item
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
