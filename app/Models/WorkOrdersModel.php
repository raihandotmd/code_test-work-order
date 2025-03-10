<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    protected $casts = [
        'deadline' => 'date',
    ];

    public function operator(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'operator_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(UserModel::class, 'created_by');
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(WorkOrderLogsModel::class, 'work_order_id');
    }

    // Generate a new work order ID (WO-YYYYMMDD-XXX)
    public static function generateWorkOrderId()
    {
        $date = now()->format('Ymd');
        $latestOrder = self::where('work_order_id', 'like', "WO-{$date}-%")
            ->orderBy('work_order_id', 'desc')
            ->first();

        if ($latestOrder) {
            $lastNumber = (int) substr($latestOrder->work_order_id, -3);
            $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        return "WO-{$date}-{$newNumber}";
    }
}
