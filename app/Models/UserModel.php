<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class UserModel extends Authenticatable
{
    use HasUuids,HasFactory, Notifiable;

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'password',
        'name',
        'role_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(UserRolesModel::class, 'role_id', 'id');
    }

    public function isOperator()
    {
        return $this->role->name === 'Operator';
    }

    public function isProductionManager()
    {
        return $this->role->name === 'Production Manager';
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrdersModel::class, 'operator_id');
    }

    public function createdWorkOrders()
    {
        return $this->hasMany(WorkOrdersModel::class, 'created_by');
    }

    public function hasPermission(string $action): bool
    {
        return $this->role->hasPermission($action);
    }

    public function assignedWorkOrders()
    {
        return $this->hasMany(WorkOrdersModel::class, 'operator_id');
    }
}

