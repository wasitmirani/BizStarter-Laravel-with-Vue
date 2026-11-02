<?php

namespace App\Http\Controllers\Backend\Billing;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Platform-level plan catalog. Restricted to the plans-manage permission.
 */
class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::withCount('subscriptions')->ordered()->get();

        return responseJson('Plans fetched successfully', [
            'plans' => $plans->map->toPlanArray(),
        ], true);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['name']);

        $plan = Plan::create($data);

        return responseJson('Plan created successfully', ['plan' => $plan->toPlanArray()], true, 201);
    }

    public function update(Request $request, Plan $plan)
    {
        $data = $this->validated($request, $plan);
        $plan->update($data);

        return responseJson('Plan updated successfully', ['plan' => $plan->fresh()->toPlanArray()], true);
    }

    public function destroy(Plan $plan)
    {
        if ($plan->subscriptions()->active()->exists()) {
            return responseJson(
                'This plan has active subscribers. Move them to another plan first.',
                null,
                false,
                409
            );
        }

        $plan->delete();

        return responseJson('Plan deleted successfully', null, true);
    }

    private function validated(Request $request, ?Plan $plan = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:80', Rule::unique('plans', 'name')->ignore($plan?->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'price_monthly' => ['required', 'numeric', 'min:0', 'max:999999'],
            'price_yearly' => ['required', 'numeric', 'min:0', 'max:999999'],
            'currency' => ['nullable', 'string', 'size:3'],
            'trial_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:120'],
            'limits' => ['nullable', 'array'],
            'limits.seats' => ['nullable', 'integer', 'min:-1'],
            'limits.storage_mb' => ['nullable', 'integer', 'min:-1'],
            'limits.api_calls' => ['nullable', 'integer', 'min:-1'],
            'is_active' => ['nullable', 'boolean'],
            'is_public' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
