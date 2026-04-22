<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Timezones
    DB::table('timezones')->insert([
        ['name' => 'Asia/Karachi', 'label' => '(GMT+5) Pakistan'],
        ['name' => 'Europe/Stockholm', 'label' => '(GMT+1) Sweden'],
        ['name' => 'America/New_York', 'label' => '(GMT-5) New York'],
        ['name' => 'Asia/Tokyo', 'label' => '(GMT+9) Japan'],
        ['name' => 'UTC', 'label' => '(GMT+0) Coordinated Universal Time']
    ]);

    // Languages
    DB::table('languages')->insert([
        ['name' => 'English', 'code' => 'en'],
        ['name' => 'Arabic', 'code' => 'ur'],
        ['name' => 'Swedish', 'code' => 'sv'],
        ['name' => 'Japanese', 'code' => 'ja'],
        ['name' => 'French', 'code' => 'fr']

    ]);

    // Currencies
    DB::table('currencies')->insert([
        ['name' => 'US Dollar', 'code' => 'USD', 'symbol' => '$'],
        ['name' => 'Pakistani Rupee', 'code' => 'PKR', 'symbol' => '₨'],
        ['name' => 'Euro', 'code' => 'EUR', 'symbol' => '€'],
        ['name' => 'Swedish Krona', 'code' => 'SEK', 'symbol' => 'kr'],
        ['name' => 'Japanese Yen', 'code' => 'JPY', 'symbol' => '¥'],
        ['name' => 'British Pound', 'code' => 'GBP', 'symbol' => '£']
        
    ]);
    }
}
