<?php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Tenant;
use Illuminate\Support\Facades\Hash;

$tenant = Tenant::whereHas('domains', fn ($q) => $q->where('domain', 'abc.larakit.test'))->first();
$tenant->run(function () {
    $user = \App\Models\User::where('email', 'test@gmail.com')->first();
    $user->password = Hash::make('password123');
    $user->save();
    echo "RESET_OK\n";
});
