"use client"

import type { FormEventHandler } from "react"
import { Link, type useForm } from "@inertiajs/react"
import { Button } from "@/Components/ui/Button"

interface User {
    id: string
    name: string
}

interface WorkOrderFormProps {
    form: ReturnType<typeof useForm>
    operators: User[]
    isEditing: boolean
    workOrderId?: string
    workOrderNumber?: string
    isOperator?: boolean
}

export function WorkOrderForm({
    form,
    operators,
    isEditing,
    workOrderId,
    workOrderNumber,
    isOperator = false,
}: WorkOrderFormProps) {
    const { data, setData, post, put, processing, errors } = form

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault()

        if (isEditing && workOrderId) {
            put(`/work-orders/${workOrderId}`)
        } else if (isOperator) {
            put(`/work-orders/${work_order_id}/status`)

        } else {
            post("/work-orders")
        }
    }

    return (
        <div className="rounded-md border bg-card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="work_order_id" className="mb-2 block text-sm font-medium">
                            Work Order Number
                        </label>
                        <input
                            type="text"
                            id="work_order_id"
                            value={isEditing ? workOrderNumber : data.work_order_id}
                            disabled
                            className="cursor-not-allowed text-muted-foreground w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {errors.work_order_id && <p className="mt-1 text-sm text-red-600">{errors.work_order_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="product_name" className="mb-2 block text-sm font-medium">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="product_name"
                            value={data.product_name}
                            onChange={(e) => setData("product_name", e.target.value)}
                            disabled={isOperator}
                            className={`w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isOperator ? "cursor-not-allowed text-muted-foreground" : ""}`}
                        />
                        {errors.product_name && <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>}
                    </div>

                    <div>
                        <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                            Quantity
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            value={data.quantity}
                            onChange={(e) => setData("quantity", Number.parseInt(e.target.value))}
                            className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            min="1"
                        />
                        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                    </div>

                    <div>
                        <label htmlFor="deadline" className="mb-2 block text-sm font-medium">
                            Deadline
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="deadline"
                                value={data.deadline}
                                onChange={(e) => setData("deadline", e.target.value)}
                                disabled={isOperator}
                                className={`w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isOperator ? "cursor-not-allowed text-muted-foreground" : ""}`}
                            />
                        </div>
                        {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
                    </div>

                    <div>
                        <label htmlFor="status" className="mb-2 block text-sm font-medium">
                            Status
                        </label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value as any)}
                            className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                        {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                    </div>

                    <div>
                        <label htmlFor="operator_id" className="mb-2 block text-sm font-medium">
                            Assigned Operator
                        </label>
                        {isOperator ? (
                            <input
                                type="text"
                                value={operators.find((op) => op.id === data.operator_id)?.name || ""}
                                disabled
                                className="cursor-not-allowed text-muted-foreground w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            />
                        ) : (
                                <select
                                    id="operator_id"
                                    value={data.operator_id}
                                    onChange={(e) => setData("operator_id", e.target.value)}
                                    className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="" disabled>
                                        Select an operator
                                    </option>
                                    {operators.map((operator) => (
                                        <option key={operator.id} value={operator.id}>
                                            {operator.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        {errors.operator_id && <p className="mt-1 text-sm text-red-600">{errors.operator_id}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                            className="w-full rounded-md border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                    </div>
                </div>

                <div className="flex justify-between">
                    <Link href="/work-orders/lists">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={processing}>
                        {processing ? "Saving..." : isEditing ? "Update Work Order" : "Create Work Order"}
                    </Button>
                </div>
            </form>
        </div>
    )
}


