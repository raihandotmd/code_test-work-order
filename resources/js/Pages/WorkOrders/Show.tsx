import { format } from 'date-fns';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock } from 'lucide-react';
import { DashboardShell } from '@/Components/DashboardShell';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';

interface User {
    id: string;
    name: string;
}

interface StatusLog {
    id: string;
    work_order_id: string;
    new_status: string;
    previous_status: string | null;
    notes: string | null;
    changed_by: User;
    created_at: string;
}

interface WorkOrder {
    id: string;
    work_order_id: string;
    product_name: string;
    quantity: number;
    deadline: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
    operator: User;
    creator: User;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    workOrder: WorkOrder;
    statusLogs: StatusLog[];
    isOperator: boolean;
}

export default function Show({ workOrder, statusLogs, isOperator }: ShowProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/50 dark:text-yellow-100';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/50 dark:text-blue-100';
            case 'Completed':
                return 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/50 dark:text-green-100';
            case 'Canceled':
                return 'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/50 dark:text-red-100';
            default:
                return '';
        }
    };

    return (
        <DashboardShell>
            <Head title={`Work Order ${workOrder.work_order_id}`} />

            <div className="mb-6">
                <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{workOrder.work_order_id}</h1>
                        <p className="text-muted-foreground">
                            Created on {format(new Date(workOrder.created_at), 'MMM dd, yyyy')} by {workOrder.creator.name}
                        </p>
                    </div>
                    <Link href={isOperator ? `/work-orders/${workOrder.id}/assigned` : `/work-orders/${workOrder.id}/edit`}>
                        <Button>Edit Work Order</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-md border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Work Order Details</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                            <Badge className={getStatusColor(workOrder.status)} variant="outline">
                                {workOrder.status}
                            </Badge>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Product</h3>
                            <p>{workOrder.product_name}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Quantity</h3>
                            <p>{workOrder.quantity}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Deadline</h3>
                            <p>{format(new Date(workOrder.deadline), 'MMMM dd, yyyy')}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Assigned Operator</h3>
                            <p>{workOrder.operator?.name || 'Unassigned'}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">Status History</h2>

                    {statusLogs.length === 0 ? (
                        <p className="text-muted-foreground">No status changes recorded.</p>
                    ) : (
                            <div className="space-y-4">
                                {statusLogs.map((log) => (
                                    <div key={log.id} className="border-l-2 border-muted pl-4">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(log.new_status)} variant="outline">
                                                {log.new_status}
                                            </Badge>
                                            {log.previous_status && (
                                                <>
                                                    <span className="text-muted-foreground">from</span>
                                                    <Badge className={getStatusColor(log.previous_status)} variant="outline">
                                                        {log.previous_status}
                                                    </Badge>
                                                </>
                                            )}
                                        </div>

                                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}</span>
                                            <span>by {log.changed_by.name}</span>
                                        </div>

                                        {log.notes && (
                                            <p className="mt-1 text-sm">{log.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </DashboardShell>
    );
}
