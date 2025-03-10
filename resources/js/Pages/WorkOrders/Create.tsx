import { Head, useForm } from '@inertiajs/react';
import { DashboardShell } from '@/Components/DashboardShell';
import { WorkOrderForm } from '@/Pages/WorkOrders/WorkOrderForm';

interface User {
  id: string;
  name: string;
}

interface CreateProps {
  operators: User[];
  workOrderId: string;
}

export default function Create({ operators, workOrderId }: CreateProps) {
  const form = useForm({
    work_order_id: workOrderId,
    product_name: '',
    quantity: 1,
    deadline: new Date().toISOString().split('T')[0],
    status: 'Pending',
    operator_id: '',
    notes: '',
  });

  return (
    <DashboardShell>
      <Head title="Create Work Order" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Work Order</h1>
          <p className="text-muted-foreground">Create a new work order in the system.</p>
        </div>
      </div>

      <WorkOrderForm
        form={form}
        operators={operators}
        isEditing={false}
        workOrderNumber={workOrderId}
      />
    </DashboardShell>
  );
}
