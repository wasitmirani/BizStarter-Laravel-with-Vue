<?php

namespace App\Http\Controllers\Backend\Billing;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Plan;
use App\Services\BillingService;
use App\Services\WorkspaceService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BillingController extends Controller
{
    use ResolvesWorkspace;

    public function __construct(
        private readonly WorkspaceService $workspaces,
        private readonly BillingService $billing,
    ) {
    }

    public function index(Request $request)
    {
        $workspace = $this->workspace($request);

        return responseJson('Billing fetched successfully', array_merge(
            $this->workspaces->summary($workspace),
            $this->billing->overview($workspace)
        ), true);
    }

    public function subscribe(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $request->validate([
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
            'billing_cycle' => ['nullable', Rule::in(['monthly', 'yearly'])],
        ]);

        $plan = Plan::findOrFail($data['plan_id']);
        $this->billing->subscribe($workspace, $plan, $data['billing_cycle'] ?? 'monthly');

        return responseJson(
            'Subscription updated successfully',
            array_merge(
                $this->workspaces->summary($workspace->fresh()),
                $this->billing->overview($workspace->fresh())
            ),
            true
        );
    }

    public function cancel(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $this->billing->cancel($workspace);

        return responseJson(
            'Subscription will cancel at the end of the billing period',
            array_merge($this->workspaces->summary($workspace->fresh()), $this->billing->overview($workspace->fresh())),
            true
        );
    }

    public function resume(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $this->billing->resume($workspace);

        return responseJson(
            'Subscription resumed successfully',
            array_merge($this->workspaces->summary($workspace->fresh()), $this->billing->overview($workspace->fresh())),
            true
        );
    }

    public function invoice(Request $request, Invoice $invoice)
    {
        $workspace = $this->workspace($request);

        abort_unless((int) $invoice->workspace_id === (int) $workspace->id, 404);

        $invoice->load(['subscription.plan', 'workspace.owner:id,name,email']);
        $plan = $invoice->subscription?->plan;

        return responseJson('Invoice fetched successfully', [
            'invoice' => [
                'id' => $invoice->id,
                'number' => $invoice->number,
                'amount' => (float) $invoice->amount,
                'currency' => $invoice->currency,
                'status' => $invoice->status,
                'description' => $invoice->description,
                'issued_at' => $invoice->issued_at,
                'due_at' => $invoice->due_at,
                'paid_at' => $invoice->paid_at,
                'meta' => $invoice->meta,
            ],
            'plan' => $plan?->toPlanArray(),
            'workspace' => [
                'id' => $workspace->id,
                'name' => $workspace->name,
                'slug' => $workspace->slug,
                'currency' => $workspace->currency,
                'owner' => $workspace->owner,
            ],
        ], true);
    }
}
