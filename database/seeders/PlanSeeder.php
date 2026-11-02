<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'description' => 'For trying LaraKit with a small team.',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'trial_days' => 0,
                'features' => ['Up to 3 seats', '512 MB storage', 'Community support'],
                'limits' => ['seats' => 3, 'storage_mb' => 512, 'api_calls' => 1000],
                'sort_order' => 1,
            ],
            [
                'name' => 'Starter',
                'description' => 'For small teams shipping their first product.',
                'price_monthly' => 19,
                'price_yearly' => 190,
                'trial_days' => 14,
                'features' => ['Up to 5 seats', '5 GB storage', '25k API calls / month', 'Email support'],
                'limits' => ['seats' => 5, 'storage_mb' => 5120, 'api_calls' => 25000],
                'sort_order' => 2,
            ],
            [
                'name' => 'Growth',
                'description' => 'For growing teams that need more room.',
                'price_monthly' => 49,
                'price_yearly' => 490,
                'trial_days' => 14,
                'features' => ['Up to 20 seats', '25 GB storage', '100k API calls / month', 'Priority support'],
                'limits' => ['seats' => 20, 'storage_mb' => 25600, 'api_calls' => 100000],
                'sort_order' => 3,
            ],
            [
                'name' => 'Scale',
                'description' => 'Unlimited seats and usage for larger organizations.',
                'price_monthly' => 99,
                'price_yearly' => 990,
                'trial_days' => 14,
                'features' => ['Unlimited seats', 'Unlimited storage', 'Unlimited API calls', 'SSO ready', 'Dedicated support'],
                'limits' => ['seats' => -1, 'storage_mb' => -1, 'api_calls' => -1],
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => Str::slug($plan['name'])],
                array_merge($plan, [
                    'slug' => Str::slug($plan['name']),
                    'currency' => 'USD',
                    'is_active' => true,
                    'is_public' => true,
                ])
            );
        }
    }
}
