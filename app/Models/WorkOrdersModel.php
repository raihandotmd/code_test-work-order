<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkOrdersModel extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $table = 'work_orders';

    protected $fillable = [
        'work_order_id',
        'product_name',
        'quantity',
        'deadline',
        'status',
        'operator_id',
        'created_by',
    ];

    /**
     * Relasi dengan table users bagian operator
     * @return BelongsTo
     */
    public function userOperator(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'operator_id');
    }

    /**
     * Relasi dengan table users pembuat work orders
     * @return BelongsTo
     */
    public function workCreatedBy(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'created_by');
    }
}
