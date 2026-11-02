<?php

namespace App\Console\Commands;

use App\Services\BillingService;
use Illuminate\Console\Command;

class SyncBillingLifecycle extends Command
{
    protected $signature = 'billing:sync';

    protected $description = 'End expired trials and flag overdue subscriptions';

    public function handle(BillingService $billing): int
    {
        $result = $billing->syncLifecycle();

        $this->info(sprintf(
            'Billing synced: %d trials ended, %d subscriptions past due.',
            $result['trials_ended'],
            $result['past_due']
        ));

        return self::SUCCESS;
    }
}
