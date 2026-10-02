<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use Illuminate\Support\Facades\Hash;

$log = [];
$tenant = Tenant::whereHas('domains', fn ($q) => $q->where('domain', 'abc.larakit.test'))->first();
if (! $tenant) {
    file_put_contents(__DIR__.'/tenant_auth_check.txt', "NO_TENANT\n");
    exit(1);
}

$tenant->run(function () use (&$log) {
    $user = \App\Models\User::where('email', 'test@gmail.com')->first();
    $log[] = 'USER=' . ($user?->email ?? 'missing');
    $log[] = 'HASH_OK=' . ($user && Hash::check('password', $user->password) ? 'no' : 'check_manual');
    // We don't know password - list user exists and is_active
    $log[] = 'ACTIVE=' . ($user?->is_active ? 'yes' : 'no');
    $log[] = 'HAS_SESSIONS_TABLE=' . (\Illuminate\Support\Facades\Schema::hasTable('sessions') ? 'yes' : 'no');
    $log[] = 'USERS=' . \App\Models\User::count();
});

file_put_contents(__DIR__.'/tenant_auth_check.txt', implode(PHP_EOL, $log));
