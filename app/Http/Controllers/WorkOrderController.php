<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use App\Models\WorkOrderLogsModel;
use App\Models\WorkOrdersModel;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WorkOrderController extends Controller
{
    const PRODUCTION_MANAGER = 'Production Manager';
    const OPERATOR = 'Operator';

    public function index(Request $request)
    {
        $user = $request->user();
        $query = WorkOrdersModel::with(['operator:id,name', 'creator:id,name']);

        // Apply role-based filtering
        if ($user->isOperator()) {
            $query->where('operator_id', $user->id);
        }

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('work_order_id', 'like', "%{$search}%")
                    ->orWhere('product_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('from_date')) {
            $query->whereDate('deadline', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('deadline', '<=', $request->to_date);
        }

        $workOrders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('WorkOrders/lists', [
            'workOrders' => $workOrders,
            'filters' => $request->only(['search', 'status', 'from_date', 'to_date']),
            'userRole' => $user->role->name,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function assigned(Request $request, string $id)
    {
        $user = $request->user();

        if (!$user->isOperator()) {
            return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
        }
        try {
            // Get the work order with its relationships
            $workOrder = WorkOrdersModel::with([
                'operator:id,name',
                'creator:id,name'
            ])->findOrFail($id);

            // Get the most recent notes from status logs
            $mostRecentNotes = WorkOrderLogsModel::where('work_order_id', $workOrder->id)
                ->orderBy('created_at', 'desc')
                ->value('notes');

            // Get operators for the dropdown
            $operators = UserModel::whereHas('role', function ($query) {
                $query->where('name', 'Operator');
            })->get(['id', 'name']);

            return Inertia::render('WorkOrders/OperatorUpdate', [
                'workOrder' => $workOrder,
                'operators' => $operators,
                'mostRecentNotes' => $mostRecentNotes,
                'isOperator' => true,
            ]);
        } catch (ModelNotFoundException $e) {
            return Inertia::render('Errors/NotFound', [
                'message' => 'Work order not found',
                'description' => 'The work order you are looking for does not exist or has been removed.',
            ]);
        }
    }

    public function updateStatus(Request $request, WorkOrdersModel $workOrder)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to continue.');
        }

        $user = Auth::user();

        // Check if user has a role
        if (!$user->role) {
            return redirect()->route('dashboard')->with('error', 'Your account does not have a role assigned.');
        }

        // Check if user is an Operator
        if ($user->role->name !== $this::OPERATOR) {
            return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
        }


        $validated = $request->validate([
            'status' => 'required|in:In Progress,Completed',
            'quantity_change' => 'required|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $previousStatus = $workOrder->status;

        // Validate status transition
        if (($previousStatus === 'Pending' && $validated['status'] !== 'In Progress') ||
            ($previousStatus === 'In Progress' && $validated['status'] !== 'Completed')) {
            return back()->with('error', 'Invalid status transition.');
        }

        // Update work order
        $workOrder->status = $validated['status'];
        $workOrder->quantity = $validated['quantity_change'];
        $workOrder->save();

        // Create status log
        WorkOrderLogsModel::create([
            'work_orders_id' => $workOrder->id,
            'previous_status' => $previousStatus,
            'new_status' => $validated['status'],
            'notes' => $validated['notes'],
            'changed_by' => Auth::id(),
            'created_at' => now(),
        ]);

        return back()->with('success', 'Work order status updated successfully.');
    }

    public function create()
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to continue.');
        }

        $user = Auth::user();

        if (!$user->role) {
            return redirect()->route('dashboard')->with('error', 'Your account does not have a role assigned.');
        }

        if ($user->role->name !== $this::PRODUCTION_MANAGER) {
            return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
        }


        // Get operators (users with Operator role)
        $operators = UserModel::whereHas('role', function ($query) {
            $query->where('name', 'Operator');
        })->get(['id', 'name']);

        // Generate a new work order ID
        $workOrderId = WorkOrdersModel::generateWorkOrderId();

        return Inertia::render('WorkOrders/Create', [
            'operators' => $operators,
            'workOrderId' => $workOrderId
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'work_order_id' => 'required|string|unique:work_orders',
            'product_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'deadline' => 'required|date',
            'status' => 'required|in:Pending,In Progress,Completed,Canceled',
            'operator_id' => 'required|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        // Add created_by field
        $validated['created_by'] = Auth::id();

        $workOrder = WorkOrdersModel::create($validated);

        // Create initial status log
        WorkOrderLogsModel::create([
            'work_order_id' => $workOrder->id,
            'new_status' => $validated['status'],
            'previous_status' => null,
            'notes' => $request->input('notes'),
            'changed_by' => Auth::id(),
            'created_at' => now(),
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Work order created successfully.');
    }

    public function edit(string $id)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please login to continue.');
        }

        $user = Auth::user();

        if (!$user->role) {
            return redirect()->route('dashboard')->with('error', 'Your account does not have a role assigned.');
        }

        if ($user->role->name !== $this::PRODUCTION_MANAGER) {
            return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
        }

        try {
            // Get the work order with its relationships
            $workOrder = WorkOrdersModel::with([
                'operator:id,name',
                'creator:id,name'
            ])->findOrFail($id);

            // Get the most recent notes from status logs
            $mostRecentNotes = WorkOrderLogsModel::where('work_order_id', $workOrder->id)
                ->orderBy('created_at', 'desc')
                ->value('notes');

            // Get operators for the dropdown
            $operators = UserModel::whereHas('role', function ($query) {
                $query->where('name', 'Operator');
            })->get(['id', 'name']);

            return Inertia::render('WorkOrders/Edit', [
                'workOrder' => $workOrder,
                'operators' => $operators,
                'mostRecentNotes' => $mostRecentNotes,
            ]);
        } catch (ModelNotFoundException $e) {
            return Inertia::render('Errors/NotFound', [
                'message' => 'Work order not found',
                'description' => 'The work order you are looking for does not exist or has been removed.',
            ]);
        }
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        try {
            $workOrder = WorkOrdersModel::findOrFail($id);

            $validated = $request->validate([
                'product_name' => 'required|string|max:255',
                'quantity' => 'required|integer|min:1',
                'deadline' => 'required|date',
                'status' => 'required|in:Pending,In Progress,Completed,Canceled',
                'operator_id' => 'required|exists:users,id',
                'notes' => 'nullable|string',
            ]);

            // Check if status has changed
            $previousStatus = $workOrder->status;
            $newStatus = $validated['status'];

            if ($previousStatus !== $newStatus) {
                // Create status log
                WorkOrderLogsModel::create([
                    'work_order_id' => $workOrder->id,
                    'new_status' => $newStatus,
                    'previous_status' => $previousStatus,
                    'notes' => $request->input('notes'),
                    'changed_by' => Auth::id(),
                    'created_at' => now(),
                ]);
            }

            $workOrder->update($validated);

            return redirect()->route('dashboard')
                ->with('success', 'Work order updated successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard')
                ->with('error', 'Work order not found.');
        }
    }

    public function show(string $id): Response
    {
        try {
            $workOrder = WorkOrdersModel::with([
                'operator:id,name',
                'creator:id,name',
            ])->findOrFail($id);

            $statusLogs = $workOrder->statusLogs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'work_order_id' => $log->work_orders_id,
                    'new_status' => $log->new_status,
                    'previous_status' => $log->previous_status,
                    'notes' => $log->notes,
                    'changed_by' => [
                        'id' => $log->getChangedBy->id,
                        'name' => $log->getChangedBy->name
                    ],
                    'created_at' => $log->created_at
                ];
            })->sortByDesc('created_at')->values();

            return Inertia::render('WorkOrders/Show', [
                'workOrder' => $workOrder,
                'statusLogs' => $statusLogs,
                'isOperator' => Auth::user()->role->name === $this::OPERATOR,
            ]);
        } catch (ModelNotFoundException $e) {
            return Inertia::render('Errors/NotFound', [
                'message' => 'Work order not found',
                'description' => 'The work order you are looking for does not exist or has been removed.',
            ]);
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $workOrder = WorkOrdersModel::findOrFail($id);

            // Instead of deleting, you might want to set status to Canceled
            $workOrder->status = 'Canceled';
            $workOrder->save();

            // Create status log
            WorkOrderLogsModel::create([
                'work_order_id' => $workOrder->id,
                'new_status' => 'Canceled',
                'previous_status' => $workOrder->getOriginal('status'),
                'notes' => 'Work order canceled by user',
                'changed_by' => Auth::id(),
                'created_at' => now(),
            ]);

            return redirect()->route('dashboard')
                ->with('success', 'Work order canceled successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('dashboard')
                ->with('error', 'Work order not found.');
        }
    }
}
