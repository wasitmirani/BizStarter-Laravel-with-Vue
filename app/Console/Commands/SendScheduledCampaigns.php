<?php

namespace App\Console\Commands;

use App\Models\CrmCampaign;
use App\Services\Crm\CampaignService;
use Illuminate\Console\Command;
use Throwable;

class SendScheduledCampaigns extends Command
{
    protected $signature = 'crm:send-scheduled-campaigns {--limit=50 : Maximum campaigns to send in one run}';

    protected $description = 'Send WhatsApp campaigns whose scheduled time has arrived';

    public function handle(CampaignService $campaigns): int
    {
        $due = CrmCampaign::query()
            ->with(['template', 'workspace'])
            ->where('status', CrmCampaign::STATUS_SCHEDULED)
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now())
            ->orderBy('scheduled_at')
            ->limit(max(1, (int) $this->option('limit')))
            ->get();

        if ($due->isEmpty()) {
            $this->info('No scheduled campaigns are due.');

            return self::SUCCESS;
        }

        foreach ($due as $campaign) {
            try {
                $result = $campaigns->send($campaign, $campaign->workspace?->owner);

                $this->info(sprintf(
                    'Campaign #%d "%s": %d sent, %d failed.',
                    $campaign->id,
                    $campaign->name,
                    $result['sent'],
                    $result['failed']
                ));
            } catch (Throwable $exception) {
                $campaign->forceFill([
                    'status' => CrmCampaign::STATUS_FAILED,
                    'error' => $exception->getMessage(),
                    'sent_at' => now(),
                ])->save();

                $this->error(sprintf(
                    'Campaign #%d "%s" failed: %s',
                    $campaign->id,
                    $campaign->name,
                    $exception->getMessage()
                ));
            }
        }

        return self::SUCCESS;
    }
}
