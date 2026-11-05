<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'whatsapp' => [
        // Meta app secret used to verify X-Hub-Signature-256 on webhooks.
        'app_secret' => env('WHATSAPP_APP_SECRET'),
        'api_version' => env('WHATSAPP_API_VERSION', 'v21.0'),
        // Optional shared verify token when a workspace has none configured.
        'verify_token' => env('WHATSAPP_VERIFY_TOKEN'),
    ],

    'instagram' => [
        // Same Meta app secret unless the Instagram product lives in another app.
        'app_secret' => env('INSTAGRAM_APP_SECRET', env('WHATSAPP_APP_SECRET')),
        'api_version' => env('INSTAGRAM_API_VERSION', env('WHATSAPP_API_VERSION', 'v21.0')),
        // Optional shared verify token when a workspace has none configured.
        'verify_token' => env('INSTAGRAM_VERIFY_TOKEN'),
    ],

];
