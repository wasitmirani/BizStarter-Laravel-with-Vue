<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserStatus;

class UserStatusSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $statuses = [
            ['text' => 'active', 'code' => 1001],
            ['text' => 'inactive', 'code' => 1002],
            ['text' => 'blocked', 'code' => 1003],
            ['text' => 'pending', 'code' => 1004],
        ];

        foreach ($statuses as $status) {
            UserStatus::updateOrCreate(
                ['code' => $status['code']],
                ['text' => $status['text']]
            );
        }
    }
}
