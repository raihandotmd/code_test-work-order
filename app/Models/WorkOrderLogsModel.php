<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkOrderLogsModel extends Model
{
    use HasUuids;

    public $incrementing = false;
    public $timestamps = ['created_at'];
    const UPDATED_AT = null;
    protected $table = 'work_orders_logs';

    protected $fillable = [
        'work_order_id',
        'new_status',
        'previous_status',
        'changed_by',
        'notes',
    ];

    public function getWorkOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrdersModel::class, 'work_order_id');
    }

    public function getChangedBy(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'changed_by');
    }
}
