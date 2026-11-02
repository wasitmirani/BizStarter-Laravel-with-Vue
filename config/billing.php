<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Billing gateway
    |--------------------------------------------------------------------------
    |
    | "manual" records invoices without contacting an external provider. Point
    | this at your gateway driver (for example "stripe") once it is wired up.
    |
    */
    'provider' => env('BILLING_PROVIDER', 'manual'),

    'currency' => env('BILLING_CURRENCY', 'USD'),
];
