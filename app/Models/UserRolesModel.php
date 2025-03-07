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
        return $this->hasMany(User::class, 'role_uid', 'id');
    }
}

