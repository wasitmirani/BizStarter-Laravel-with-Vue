<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class LocalHostsService
{
    public function syncDomains(array $domains): array
    {
        if (! app()->environment('local')) {
            return ['skipped' => true, 'reason' => 'not_local'];
        }

        if (PHP_OS_FAMILY !== 'Windows') {
            return ['skipped' => true, 'reason' => 'not_windows'];
        }

        $hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
        if (! is_file($hostsPath) || ! is_readable($hostsPath)) {
            return ['skipped' => true, 'reason' => 'hosts_unreadable'];
        }

        $current = @file_get_contents($hostsPath);
        if ($current === false) {
            return ['skipped' => true, 'reason' => 'hosts_read_failed'];
        }

        $added = [];
        $linesToAppend = [];

        foreach ($domains as $domain) {
            $domain = strtolower(trim((string) $domain));
            if ($domain === '' || ! str_contains($domain, '.')) {
                continue;
            }

            if (preg_match('/\b' . preg_quote($domain, '/') . '\b/i', $current)) {
                continue;
            }

            $linesToAppend[] = '127.0.0.1 '.$domain;
            $added[] = $domain;
        }

        if ($linesToAppend === []) {
            return ['added' => [], 'already_present' => true];
        }

        if (! is_writable($hostsPath)) {
            Log::warning('Tenant domain hosts sync needs admin rights', ['domains' => $added]);

            return [
                'added' => [],
                'needs_admin' => true,
                'domains' => $added,
                'hint' => 'Run: php artisan tenants:sync-hosts (as Administrator)',
            ];
        }

        $suffix = (str_ends_with($current, "\n") ? '' : PHP_EOL).implode(PHP_EOL, $linesToAppend).PHP_EOL;
        $ok = @file_put_contents($hostsPath, $current.$suffix, LOCK_EX);

        if ($ok === false) {
            Log::warning('Failed writing hosts file for tenant domains', ['domains' => $added]);

            return ['added' => [], 'needs_admin' => true, 'domains' => $added];
        }

        return ['added' => $added];
    }
}
