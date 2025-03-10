<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRolesModel extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'user_roles';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    public const PRODUCTION_MANAGER = 'Production Manager';
    public const OPERATOR = 'Operator';
    protected $fillable = [
        'name',
    ];

    /*
    * relasi dengan user
    * @return HasMany
    *
    */
    public function users(): HasMany
    {
        return $this->hasMany(UserModel::class, 'role_id', 'id');
    }

    public function hasPermission(string $action): bool
    {
        switch ($this->name) {
            case self::PRODUCTION_MANAGER:
                return in_array($action, [
                    'create-work-order',
                    'update-work-order',
                    'view-work-orders',
                    'filter-work-orders',
                    'assign-operator'
                ]);
            case self::OPERATOR:
                return in_array($action, [
                    'view-assigned-work-orders',
                    'update-work-order-status'
                ]);
            default:
                return false;
        }
    }
}

