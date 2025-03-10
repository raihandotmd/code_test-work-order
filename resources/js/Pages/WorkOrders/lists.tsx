import { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Eye, Edit, Search, X, Filter, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';
import { DashboardShell } from '@/Components/DashboardShell';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/Components/ui/Select';
import {
    Card,
    CardContent,
} from '@/Components/ui/Card';

interface User {
    id: string;
    name: string;
}

interface WorkOrder {
    id: string;
    work_order_id: string;
    product_name: string;
    quantity: number;
    deadline: string;
    status: 'Pending' | 'In Progress' | 'Completed' | 'Canceled';
    operator: User;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface WorkOrderListsProps {
    workOrders: {
        data: WorkOrder[];
        links?: any;
        total?: number;
    } | WorkOrder[];
    userRole: 'Production Manager' | 'Operator';
    flash: {
        success?: string;
        error?: string;
    };
    filters?: {
        search?: string;
        status?: string;
        from_date?: string;
        to_date?: string;
    };
}

// Define sort directions
type SortDirection = 'asc' | 'desc' | null;

// Define sortable columns
type SortableColumn = 'work_order_id' | 'product_name' | 'quantity' | 'deadline' | 'status' | 'operator';

export default function WorkOrderLists({ workOrders, userRole,flash, filters = {} }: WorkOrderListsProps) {
    const isProductionManager = userRole === 'Production Manager';
    const isOperator = userRole === 'Operator';

    // Handle both paginated and non-paginated data formats
    const orders = Array.isArray(workOrders) ? workOrders : (workOrders?.data || []);
    const pagination = !Array.isArray(workOrders) ? workOrders?.meta : null;

    // Filter state
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Use string state for date inputs instead of Date objects
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    // Sorting state
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Debounce search to avoid too many requests
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                applyFilters();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Apply filters to the URL
    const applyFilters = () => {
        router.get('/work-orders/lists', {
            search: search || undefined,
            status: status || undefined,
            from_date: fromDate || undefined,
            to_date: toDate || undefined,
        }, {
                preserveState: true,
                replace: true,
            });
    };

    // Reset all filters
    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setFromDate('');
        setToDate('');

        router.get('/work-orders/lists', {}, {
            preserveState: true,
            replace: true,
        });
    };

    // Handle pagination click
    const handlePageClick = (url: string | null) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
            });
        }
    };

    // Validate date range
    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFromDate = e.target.value;
        setFromDate(newFromDate);

        // If to date is set and is before from date, clear to date
        if (toDate && newFromDate && new Date(newFromDate) > new Date(toDate)) {
            setToDate('');
        }
    };

    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newToDate = e.target.value;
        setToDate(newToDate);

        // If from date is set and is after to date, clear from date
        if (fromDate && newToDate && new Date(fromDate) > new Date(newToDate)) {
            setFromDate('');
        }
    };

    // Handle column sorting
    const handleSort = (column: SortableColumn) => {
        if (sortColumn === column) {
            // Cycle through: asc -> desc -> null
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else if (sortDirection === 'desc') {
                setSortColumn(null);
                setSortDirection(null);
            } else {
                setSortDirection('asc');
            }
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Get sort icon based on current sort state
    const getSortIcon = (column: SortableColumn) => {
        if (sortColumn !== column) {
            return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
        }

        if (sortDirection === 'asc') {
            return <ChevronUp className="ml-1 h-4 w-4" />;
        }

        if (sortDirection === 'desc') {
            return <ChevronDown className="ml-1 h-4 w-4" />;
        }

        return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    };

    // Sort the orders based on current sort state
    const sortedOrders = useMemo(() => {
        if (!sortColumn || !sortDirection) {
            return orders;
        }

        return [...orders].sort((a, b) => {
            let valueA, valueB;

            // Handle different column types
            switch (sortColumn) {
                case 'work_order_id':
                    valueA = a.work_order_id;
                    valueB = b.work_order_id;
                    break;
                case 'product_name':
                    valueA = a.product_name;
                    valueB = b.product_name;
                    break;
                case 'quantity':
                    valueA = a.quantity;
                    valueB = b.quantity;
                    break;
                case 'deadline':
                    valueA = new Date(a.deadline).getTime();
                    valueB = new Date(b.deadline).getTime();
                    break;
                case 'status':
                    valueA = a.status;
                    valueB = b.status;
                    break;
                case 'operator':
                    valueA = a.operator?.name || '';
                    valueB = b.operator?.name || '';
                    break;
                default:
                    return 0;
            }

            // Compare values based on sort direction
            if (sortDirection === 'asc') {
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
                return 0;
            } else {
                if (valueA > valueB) return -1;
                if (valueA < valueB) return 1;
                return 0;
            }
        });
    }, [orders, sortColumn, sortDirection]);

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

    // Check if any filters are active
    const hasActiveFilters = search || status || fromDate || toDate;

    // Format date for display in badges
    const formatDateForDisplay = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    // Create a sortable column header component
    const SortableColumnHeader = ({
        column,
        title
    }: {
            column: SortableColumn,
            title: string
        }) => (
            <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground cursor-pointer group"
                onClick={() => handleSort(column)}
                role="columnheader"
                aria-sort={
                    sortColumn === column
                        ? sortDirection === 'asc'
                            ? 'ascending'
                            : 'descending'
                        : 'none'
                }
            >
                <div className="flex items-center">
                    <span>{title}</span>
                    <span className="inline-flex ml-1">
                        {getSortIcon(column)}
                    </span>
                </div>
            </th>
        );

    return (
        <DashboardShell>
            <Head title="Dashboard" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {isOperator ? 'My Work Orders' : 'Work Orders'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isOperator
                            ? 'View and manage your assigned work orders.'
                            : 'Manage and track all work orders in your system.'}
                    </p>
                </div>
                {isProductionManager && (
                    <Link href="/work-orders/create">
                        <Button>New Work Order</Button>
                    </Link>
                )}
            </div>

            {flash.success && (
                <div className="rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/50 dark:text-green-100">
                    {flash.success}
                </div>
            )}

            {flash.error && (
                <div className="rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/50 dark:text-red-100">
                    {flash.error}
                </div>
            )}

            {/* Filter Section */}
            {isProductionManager && (
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                            {/* Search TextInput */}
                            <div className="space-y-2">
                                <InputLabel htmlFor="search">Search</InputLabel>
                                <div className="relative flex items-center">
                                    <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                                    <TextInput
                                        id="search"
                                        placeholder="Work order ID or product"
                                        className="pl-8 w-full"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full"
                                            onClick={() => setSearch('')}
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Clear search</span>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <InputLabel htmlFor="status">Status</InputLabel>
                                <Select
                                    value={status}
                                    onValueChange={(value) => {
                                        setStatus(value);
                                        setTimeout(() => applyFilters(), 100);
                                    }}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=" ">All statuses</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Canceled">Canceled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Range Filter - Replaced with standard date inputs */}
                            <div className="space-y-2">
                                <InputLabel>Deadline Range</InputLabel>
                                <div className="flex gap-2">
                                    {/* From Date */}
                                    <div className="flex-1">
                                        <TextInput
                                            type="date"
                                            value={fromDate}
                                            onChange={handleFromDateChange}
                                            className="w-full"
                                            max={toDate || undefined}
                                        />
                                    </div>

                                    {/* To Date */}
                                    <div className="flex-1">
                                        <TextInput
                                            type="date"
                                            value={toDate}
                                            onChange={handleToDateChange}
                                            className="w-full"
                                            min={fromDate || undefined}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filter Actions */}
                            <div className="flex items-end gap-2">
                                <Button
                                    onClick={applyFilters}
                                    className="flex-1"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Apply Filters
                                </Button>

                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {search && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Search: {search}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-1 h-4 w-4 p-0"
                                            onClick={() => {
                                                setSearch('');
                                                applyFilters();
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove search filter</span>
                                        </Button>
                                    </Badge>
                                )}

                                {status && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Status: {status}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-1 h-4 w-4 p-0"
                                            onClick={() => {
                                                setStatus('');
                                                applyFilters();
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove status filter</span>
                                        </Button>
                                    </Badge>
                                )}

                                {fromDate && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        From: {formatDateForDisplay(fromDate)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-1 h-4 w-4 p-0"
                                            onClick={() => {
                                                setFromDate('');
                                                applyFilters();
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove from date filter</span>
                                        </Button>
                                    </Badge>
                                )}

                                {toDate && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        To: {formatDateForDisplay(toDate)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-1 h-4 w-4 p-0"
                                            onClick={() => {
                                                setToDate('');
                                                applyFilters();
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove to date filter</span>
                                        </Button>
                                    </Badge>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {sortedOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">No work orders found</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        {hasActiveFilters
                            ? "Try adjusting your filters or create a new work order."
                            : "Get started by creating a new work order."}
                    </p>
                    {hasActiveFilters ? (
                        <Button onClick={resetFilters} variant="outline" className="mb-2">
                            Clear Filters
                        </Button>
                    ) : null}
                    <Link href="/work-orders/create">
                        <Button>Create Work Order</Button>
                    </Link>
                </div>
            ) : (
                    <>
                        <div className="rounded-md border overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead>
                                    <tr>
                                        {/* New column for row numbers */}
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground w-16">
                                            #
                                        </th>
                                        <SortableColumnHeader column="work_order_id" title="Work Order #" />
                                        <SortableColumnHeader column="product_name" title="Product Name" />
                                        <SortableColumnHeader column="quantity" title="Quantity" />
                                        <SortableColumnHeader column="deadline" title="Deadline" />
                                        <SortableColumnHeader column="status" title="Status" />
                                        <SortableColumnHeader column="operator" title="Assigned Operator" />
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {sortedOrders.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-muted/50">
                                            {/* Row number column */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                                                {pagination ? pagination.from + index : index + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                {order.work_order_id}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {order.product_name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {order.quantity}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {format(new Date(order.deadline), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <Badge className={getStatusColor(order.status)} variant="outline">
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {order.operator?.name || 'Unassigned'}
                                            </td>
                                            {/* Customize actions based on role */}
                                            <td className="flex items-center justify-end gap-2 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="h-8 w-8 rounded-full hover:bg-primary/10"
                                                >
                                                    <Link href={`/work-orders/${order.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">View details</span>
                                                    </Link>
                                                </Button>

                                                {isProductionManager && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 rounded-full hover:bg-primary/10"
                                                    >
                                                        <Link href={`/work-orders/${order.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                    </Button>
                                                )}

                                                {isOperator && order.status !== 'Completed' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 rounded-full hover:bg-primary/10"
                                                    >
                                                        <Link href={`/work-orders/${order.id}/assigned`}>
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{pagination.from}</span> to{" "}
                                    <span className="font-medium">{pagination.to}</span> of{" "}
                                    <span className="font-medium">{pagination.total}</span> results
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!pagination.links.prev}
                                        onClick={() => handlePageClick(pagination.links.prev)}
                                    >
                                        Previous
                                    </Button>

                                    {pagination.links.map((link, i) => {
                                        // Skip prev/next links as we have dedicated buttons
                                        if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
                                            return null;
                                        }

                                        // For "..." links
                                        if (link.label === "...") {
                                            return (
                                                <Button
                                                    key={i}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                >
                                                    ...
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={i}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={link.active || !link.url}
                                                onClick={() => handlePageClick(link.url)}
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!pagination.links.next}
                                        onClick={() => handlePageClick(pagination.links.next)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
        </DashboardShell>
    );
}
