<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'phone',
        'email',
        'type',
        'table_number',
        'guests',
        'address',
        'special_instructions',
        'total',
        'status',
        'progress',
        'inventory_deducted'
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'progress' => 'integer',
        'table_number' => 'integer',
        'guests' => 'integer',
        'inventory_deducted' => 'boolean'
    ];

    // Relationship: An order has many order items
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
