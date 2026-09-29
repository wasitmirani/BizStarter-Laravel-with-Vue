<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('languages')->upsert([
            ['name' => 'English', 'code' => 'en', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Arabic', 'code' => 'ar', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'French', 'code' => 'fr', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Spanish', 'code' => 'es', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'German', 'code' => 'de', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
        ], ['code'], ['name', 'is_active', 'updated_at']);

        DB::table('currencies')->upsert([
            ['name' => 'US Dollar', 'code' => 'USD', 'symbol' => '$', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Euro', 'code' => 'EUR', 'symbol' => '€', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'British Pound', 'code' => 'GBP', 'symbol' => '£', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Pakistani Rupee', 'code' => 'PKR', 'symbol' => '₨', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Japanese Yen', 'code' => 'JPY', 'symbol' => '¥', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
        ], ['code'], ['name', 'symbol', 'is_active', 'updated_at']);
    }
}
