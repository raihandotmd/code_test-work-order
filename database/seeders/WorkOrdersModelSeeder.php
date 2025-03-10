<?php

namespace Database\Seeders;

use App\Models\UserModel;
use App\Models\WorkOrderLogsModel;
use App\Models\WorkOrdersModel;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class WorkOrdersModelSeeder extends Seeder
{
    public function run(): void
    {
        // Get a manager and operators
        $manager = UserModel::whereHas('role', function($query) {
            $query->where('name', 'Production Manager');
        })->first();

        $operators = UserModel::whereHas('role', function($query) {
            $query->where('name', 'Operator');
        })->get();

        if (!$manager || $operators->isEmpty()) {
            $this->command->error('Users not found. Please run UserSeeder first.');
            return;
        }

        // Sample work orders
        $workOrders = [
            [
                'work_order_id' => 'WO-' . date('Ymd') . '-001',
                'product_name' => 'Steel Frame Assembly',
                'quantity' => 50,
                'deadline' => Carbon::now()->addDays(10),
                'status' => 'Pending',
                'operator_id' => $operators->random()->id,
                'created_by' => $manager->id,
            ],
            [
                'work_order_id' => 'WO-' . date('Ymd') . '-002',
                'product_name' => 'Aluminum Brackets',
                'quantity' => 200,
                'deadline' => Carbon::now()->addDays(5),
                'status' => 'In Progress',
                'operator_id' => $operators->random()->id,
                'created_by' => $manager->id,
            ],
            [
                'work_order_id' => 'WO-' . date('Ymd') . '-003',
                'product_name' => 'Circuit Board',
                'quantity' => 100,
                'deadline' => Carbon::now()->addDays(15),
                'status' => 'Completed',
                'operator_id' => $operators->random()->id,
                'created_by' => $manager->id,
            ],
            [
                'work_order_id' => 'WO-' . date('Ymd') . '-004',
                'product_name' => 'Plastic Housing',
                'quantity' => 300,
                'deadline' => Carbon::now()->addDays(20),
                'status' => 'Pending',
                'operator_id' => $operators->random()->id,
                'created_by' => $manager->id,
            ],
            [
                'work_order_id' => 'WO-' . date('Ymd') . '-005',
                'product_name' => 'Power Supply Unit',
                'quantity' => 75,
                'deadline' => Carbon::now()->addDays(7),
                'status' => 'In Progress',
                'operator_id' => $operators->random()->id,
                'created_by' => $manager->id,
            ],
        ];

        foreach ($workOrders as $workOrderData) {
            $workOrder = WorkOrdersModel::create($workOrderData);

            // Create initial status log
            WorkOrderLogsModel::create([
                'work_order_id' => $workOrder->id,
                'new_status' => $workOrderData['status'],
                'previous_status' => null,
                'notes' => 'Initial status',
                'changed_by' => $manager->id,
                'created_at' => now(),
            ]);

            // For completed or in-progress orders, add status history
            if ($workOrderData['status'] === 'Completed' || $workOrderData['status'] === 'In Progress') {
                // Add a "Pending" to "In Progress" transition
                WorkOrderLogsModel::create([
                    'work_order_id' => $workOrder->id,
                    'new_status' => 'In Progress',
                    'previous_status' => 'Pending',
                    'notes' => 'Work started',
                    'changed_by' => $manager->id,
                    'created_at' => now()->subDays(3),
                ]);

                // For completed orders, add "In Progress" to "Completed" transition
                if ($workOrderData['status'] === 'Completed') {
                    WorkOrderLogsModel::create([
                        'work_order_id' => $workOrder->id,
                        'new_status' => 'Completed',
                        'previous_status' => 'In Progress',
                        'notes' => 'Work completed',
                        'changed_by' => $manager->id,
                        'created_at' => now()->subDay(),
                    ]);
                }
            }
        }
    }
}
