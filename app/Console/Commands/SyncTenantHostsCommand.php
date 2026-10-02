<?php

namespace App\Console\Commands;

use App\Services\LocalHostsService;
use Illuminate\Console\Command;
use Stancl\Tenancy\Database\Models\Domain;

class SyncTenantHostsCommand extends Command
{
    protected $signature = 'tenants:sync-hosts';

    protected $description = 'Add all tenant domains to the local Windows hosts file (local env)';

    public function handle(LocalHostsService $hostsService): int
    {
        $domains = Domain::query()->pluck('domain')->filter()->values()->all();

        if ($domains === []) {
            $this->info('No tenant domains found.');

            return self::SUCCESS;
        }

        $result = $hostsService->syncDomains($domains);

        if (! empty($result['skipped'])) {
            $this->warn('Skipped: '.$result['reason']);

            return self::SUCCESS;
        }

        if (! empty($result['needs_admin'])) {
            $domains = implode(', ', $result['domains'] ?? []);
            $this->error('Could not write hosts file. Windows requires Administrator rights.');
            $this->newLine();
            $this->line('Option 1 — re-run elevated:');
            $this->line('  Right-click PowerShell/Terminal → Run as administrator, then:');
            $this->line('  cd '.base_path());
            $this->line('  php artisan tenants:sync-hosts');
            $this->newLine();
            $this->line('Option 2 — paste this in an elevated PowerShell:');
            foreach ($result['domains'] ?? [] as $domain) {
                $this->line(
                    '  Add-Content -Path "$env:SystemRoot\\System32\\drivers\\etc\\hosts" -Value "127.0.0.1 '.$domain.'"'
                );
            }
            $this->newLine();
            $this->line('Pending domains: '.$domains);

            return self::FAILURE;
        }

        if (($result['added'] ?? []) === []) {
            $this->info('All tenant domains already present in hosts file.');
        } else {
            $this->info('Added to hosts: '.implode(', ', $result['added']));
        }

        return self::SUCCESS;
    }
}
