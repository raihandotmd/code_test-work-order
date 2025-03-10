<?php

namespace App\Policies;

use App\Models\UserModel;
use App\Models\WorkOrdersModel;

class WorkOrderPolicy
{
    public function create(UserModel $user): bool
    {
        return $user->isProductionManager();
    }

    public function update(UserModel $user, WorkOrdersModel $workOrder): bool
    {
        if ($user->isProductionManager()) {
            return true;
        }

        return $user->isOperator() &&
               $workOrder->operator_id === $user->id &&
               in_array($workOrder->status, ['Pending', 'In Progress']);
    }

    public function view(UserModel $user, WorkOrdersModel $workOrder): bool
    {
        return $user->isProductionManager() ||
               ($user->isOperator() && $workOrder->operator_id === $user->id);
    }

    public function updateStatus(UserModel $user, WorkOrdersModel $workOrder): bool
    {
        return $user->isOperator() &&
               $workOrder->operator_id === $user->id &&
               in_array($workOrder->status, ['Pending', 'In Progress']);
    }
}
