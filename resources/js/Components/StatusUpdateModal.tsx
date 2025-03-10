import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/Dialog';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Label } from '@/Components/ui/Label';
import { Textarea } from '@/Components/ui/Textarea';

interface StatusUpdateModalProps {
    workOrder: {
        id: string;
        status: string;
        quantity: number;
    };
    isOpen: boolean;
    onClose: () => void;
}

export function StatusUpdateModal({ workOrder, isOpen, onClose }: StatusUpdateModalProps) {
    const form = useForm({
        status: workOrder.status === 'Pending' ? 'In Progress' : 'Completed',
        quantity_change: workOrder.quantity,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/work-orders/${workOrder.id}/status`, {
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Work Order Status</DialogTitle>
                    <DialogDescription>
                        Update the status and quantity for this work order.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>New Status</Label>
                        <div className="text-sm font-medium">
                            {workOrder.status === 'Pending' ? 'In Progress' : 'Completed'}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="quantity_change">Quantity</Label>
                        <Input
                            id="quantity_change"
                            type="number"
                            min="0"
                            value={form.data.quantity_change}
                            onChange={e => form.setData('quantity_change', parseInt(e.target.value))}
                            error={form.errors.quantity_change}
                        />
                    </div>

                    <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={form.data.notes}
                            onChange={e => form.setData('notes', e.target.value)}
                            error={form.errors.notes}
                            placeholder="Add any notes about this status update..."
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Updating...' : 'Update Status'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
