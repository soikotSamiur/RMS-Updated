<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'current_stock',
        'unit',
        'reorder_level',
        'supplier',
        'status',
        'cost_per_unit',
        'last_restock_date'
    ];

    protected $casts = [
        'current_stock' => 'decimal:2',
        'reorder_level' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
        'last_restock_date' => 'datetime'
    ];

    
    public function menuItems()
    {
        return $this->belongsToMany(MenuItem::class, 'inventory_menu_item')
                    ->withPivot('quantity_required')
                    ->withTimestamps();
    }

    public function updateStatus()
    {
        if ($this->current_stock <= 0) {
            $this->status = 'out_of_stock';
        } elseif ($this->current_stock <= $this->reorder_level) {
            $this->status = 'low_stock';
        } else {
            $this->status = 'in_stock';
        }
        $this->save();
    }

  
    public function deductStock($quantity)
    {
        $this->current_stock = max(0, $this->current_stock - $quantity);
        $this->updateStatus();
    }

    public function addStock($quantity)
    {
        $this->current_stock += $quantity;
        $this->last_restock_date = now();
        $this->updateStatus();
    }
}
