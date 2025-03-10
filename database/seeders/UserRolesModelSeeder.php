<?php

namespace Database\Seeders;

use App\Models\UserRolesModel;
use Illuminate\Database\Seeder;

class UserRolesModelSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Production Manager',
            ],
            [
                'name' => 'Operator',
            ],
        ];

        foreach ($roles as $role) {
            UserRolesModel::create($role);
        }
    }
}
