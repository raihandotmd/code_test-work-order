<?php

namespace Database\Seeders;

use App\Models\UserRolesModel;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        UserRolesModel::factory()->create([
            'name' => 'Production Manager',
        ]);
        UserRolesModel::factory()->create([
            'name' => 'Operator',
        ]);

    }
}

