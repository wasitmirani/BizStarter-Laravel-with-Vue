<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BillingService
{
    /**
     * Start a trial on a workspace. Used by onboarding and workspace provisioning.
     */
    public function startTrial(Workspace $workspace, Plan $plan): Subscription
    {
        $trialDays = $plan->isFree() ? 0 : max(0, (int) $plan->trial_days);
        $paid = ! $plan->isFree() && $trialDays === 0;

        return Subscription::updateOrCreate(
            ['workspace_id' => $workspace->id],
            [
                'plan_id' => $plan->id,
                'status' => $trialDays > 0 ? Subscription::STATUS_TRIALING : Subscription::STATUS_ACTIVE,
                'billing_cycle' => 'monthly',
                'trial_ends_at' => $trialDays > 0 ? now()->addDays($trialDays) : null,
                'current_period_start' => now(),
                'current_period_end' => $trialDays > 0
                    ? now()->addDays($trialDays)
                    : ($paid ? now()->addMonth() : null),
                'cancel_at_period_end' => false,
                'canceled_at' => null,
                'provider' => 'manual',
                'provider_id' => null,
            ]
        );
    }

    /**
     * Subscribe a workspace to a plan.
     *
     * Payment capture is intentionally provider-agnostic. In manual mode a
     * successful subscription records a paid invoice; swap `charge()` for a
     * Stripe/Paddle call when a gateway is configured.
     */
    public function subscribe(Workspace $workspace, Plan $plan, string $cycle = 'monthly'): Subscription
    {
        if (! $plan->is_active) {
            throw ValidationException::withMessages([
                'plan_id' => 'This plan is no longer available.',
            ]);
        }

        $cycle = $cycle === 'yearly' ? 'yearly' : 'monthly';
        $price = $plan->priceFor($cycle);
        $existing = $workspace->subscription;
        $hasPaidHistory = $workspace->invoices()->where('status', 'paid')->exists();

        return DB::transaction(function () use ($workspace, $plan, $cycle, $price, $existing, $hasPaidHistory) {
            $trialDays = $plan->isFree() ? 0 : max(0, (int) $plan->trial_days);
            $useTrial = ! $hasPaidHistory && ! $existing?->isTrialing() && $trialDays > 0;

            $subscription = Subscription::updateOrCreate(
                ['workspace_id' => $workspace->id],
                [
                    'plan_id' => $plan->id,
                    'status' => $useTrial ? Subscription::STATUS_TRIALING : Subscription::STATUS_ACTIVE,
                    'billing_cycle' => $cycle,
                    'trial_ends_at' => $useTrial ? now()->addDays($trialDays) : null,
                    'current_period_start' => now(),
                    'current_period_end' => $plan->isFree()
                        ? null
                        : ($useTrial
                            ? now()->addDays($trialDays)
                            : ($cycle === 'yearly' ? now()->addYear() : now()->addMonth())),
                    'cancel_at_period_end' => false,
                    'canceled_at' => null,
                    'provider' => config('billing.provider', 'manual'),
                    'provider_id' => null,
                ]
            );

            // Trials are free. Only bill once the subscription is actually active.
            if (! $useTrial && $price > 0) {
                $this->recordInvoice($workspace, $subscription, $price, $cycle, 'paid');
            }

            return $subscription->fresh(['plan']);
        });
    }

    public function cancel(Workspace $workspace): Subscription
    {
        $subscription = $workspace->subscription;

        if (! $subscription) {
            throw ValidationException::withMessages([
                'subscription' => 'This workspace has no subscription to cancel.',
            ]);
        }

        $subscription->update([
            'cancel_at_period_end' => true,
            'canceled_at' => now(),
        ]);

        return $subscription->fresh();
    }

    public function resume(Workspace $workspace): Subscription
    {
        $subscription = $workspace->subscription;

        if (! $subscription) {
            throw ValidationException::withMessages([
                'subscription' => 'This workspace has no subscription to resume.',
            ]);
        }

        $subscription->update([
            'cancel_at_period_end' => false,
            'canceled_at' => null,
            'status' => $subscription->status === Subscription::STATUS_CANCELED
                ? Subscription::STATUS_ACTIVE
                : $subscription->status,
        ]);

        return $subscription->fresh();
    }

    /**
     * Billing screen payload: available plans, current subscription, invoices.
     */
    public function overview(Workspace $workspace): array
    {
        return [
            'plans' => Plan::active()->public()->ordered()->get()->map->toPlanArray()->values(),
            'invoices' => $workspace->invoices()
                ->limit(24)
                ->get()
                ->map(fn (Invoice $invoice) => [
                    'id' => $invoice->id,
                    'number' => $invoice->number,
                    'amount' => (float) $invoice->amount,
                    'currency' => $invoice->currency,
                    'status' => $invoice->status,
                    'description' => $invoice->description,
                    'issued_at' => $invoice->issued_at,
                    'paid_at' => $invoice->paid_at,
                ]),
        ];
    }

    /**
     * Daily lifecycle sweep: end trials and flag overdue renewals.
     *
     * Trials drop to the free plan when one is published, so a workspace keeps
     * working instead of being locked out; paid periods that lapse become
     * past_due until payment is recorded.
     *
     * @return array{trials_ended:int, past_due:int}
     */
    public function syncLifecycle(): array
    {
        $trialsEnded = 0;
        $pastDue = 0;
        $freePlan = Plan::active()->public()->where('price_monthly', 0)->ordered()->first();

        Subscription::query()
            ->where('status', Subscription::STATUS_TRIALING)
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '<=', now())
            ->with('plan')
            ->each(function (Subscription $subscription) use ($freePlan, &$trialsEnded) {
                if ($freePlan && (int) $subscription->plan_id !== (int) $freePlan->id) {
                    $subscription->update([
                        'plan_id' => $freePlan->id,
                        'status' => Subscription::STATUS_ACTIVE,
                        'trial_ends_at' => null,
                        'current_period_start' => now(),
                        'current_period_end' => null,
                        'cancel_at_period_end' => false,
                    ]);
                } else {
                    $subscription->update(['status' => Subscription::STATUS_EXPIRED]);
                }

                $trialsEnded++;
            });

        Subscription::query()
            ->where('status', Subscription::STATUS_ACTIVE)
            ->whereNotNull('current_period_end')
            ->where('current_period_end', '<=', now())
            ->whereHas('plan', fn ($query) => $query->where('price_monthly', '>', 0))
            ->each(function (Subscription $subscription) use (&$pastDue) {
                $subscription->update(['status' => Subscription::STATUS_PAST_DUE]);
                $pastDue++;
            });

        return ['trials_ended' => $trialsEnded, 'past_due' => $pastDue];
    }

    private function recordInvoice(
        Workspace $workspace,
        Subscription $subscription,
        float $amount,
        string $cycle,
        string $status = 'paid'
    ): Invoice {
        $sequence = (int) Invoice::where('workspace_id', $workspace->id)->count() + 1;

        return Invoice::create([
            'workspace_id' => $workspace->id,
            'subscription_id' => $subscription->id,
            'number' => sprintf('INV-%s-%04d', now()->format('Y'), $sequence),
            'amount' => $amount,
            'currency' => $subscription->plan->currency,
            'status' => $status,
            'description' => sprintf('%s plan · %s billing', $subscription->plan->name, $cycle),
            'issued_at' => now(),
            'due_at' => now(),
            'paid_at' => $status === 'paid' ? now() : null,
            'meta' => ['cycle' => $cycle, 'provider' => $subscription->provider],
        ]);
    }
}
