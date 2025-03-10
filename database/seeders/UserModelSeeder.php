<?php

namespace Database\Seeders;

use App\Models\UserModel;
use App\Models\UserRolesModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserModelSeeder extends Seeder
{
    public function run(): void
    {
        // Get role IDs
        $managerRole = UserRolesModel::where('name', 'Production Manager')->first();
        $operatorRole = UserRolesModel::where('name', 'Operator')->first();

        if (!$managerRole || !$operatorRole) {
            $this->command->error('Roles not found. Please run RoleSeeder first.');
            return;
        }

        // Create a production manager
        UserModel::create([
            'username' => 'manager',
            'password' => Hash::make('password'),
            'name' => 'John Manager',
            'role_id' => $managerRole->id,
        ]);

        // Create operators
        $operators = [
            [
                'username' => 'operator1',
                'password' => Hash::make('password'),
                'name' => 'Sarah Johnson',
                'role_id' => $operatorRole->id,
            ],
            [
                'username' => 'operator2',
                'password' => Hash::make('password'),
                'name' => 'Mike Chen',
                'role_id' => $operatorRole->id,
            ],
            [
                'username' => 'operator3',
                'password' => Hash::make('password'),
                'name' => 'Lisa Wong',
                'role_id' => $operatorRole->id,
            ],
            [
                'username' => 'operator4',
                'password' => Hash::make('password'),
                'name' => 'David Miller',
                'role_id' => $operatorRole->id,
            ],
        ];

        foreach ($operators as $operator) {
            UserModel::create($operator);
        }
    }
}
