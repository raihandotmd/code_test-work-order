import { Head, useForm } from '@inertiajs/react';
import { DashboardShell } from '@/Components/DashboardShell';
import { WorkOrderForm } from '@/Pages/WorkOrders/WorkOrderForm';


interface EditProps {
  workOrder: WorkOrder;
  operators: User[];
  mostRecentNotes: string | null;
}

export default function Edit({ workOrder, operators, mostRecentNotes, isOperator }: EditProps) {
  const form = useForm({
    product_name: workOrder.product_name,
    quantity: workOrder.quantity,
    deadline: new Date(workOrder.deadline).toISOString().split('T')[0],
    status: workOrder.status,
    operator_id: workOrder.operator_id,
    notes: mostRecentNotes || '',
  });

  return (
    <DashboardShell>
      <Head title="Edit Work Order" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Work Order</h1>
          <p className="text-muted-foreground">Update work order #{workOrder.work_order_id} details.</p>
        </div>
      </div>

      <WorkOrderForm
        form={form}
        operators={operators}
        isEditing={true}
        workOrderId={workOrder.id}
        workOrderNumber={workOrder.work_order_id}
                isOperator={isOperator}
      />
    </DashboardShell>
  );
}

