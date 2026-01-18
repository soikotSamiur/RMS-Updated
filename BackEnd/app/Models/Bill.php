<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'bill_number',
        'customer_name',
        'phone',
        'email',
        'order_type',
        'table_number',
        'subtotal',
        'tax',
        'discount',
        'total',
        'payment_method',
        'items'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'table_number' => 'integer',
        'items' => 'array'
    ];

    // Relationship: A bill belongs to an order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
