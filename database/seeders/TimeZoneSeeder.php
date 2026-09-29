<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TimeZoneSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('time_zones')->exists()) {
            return;
        }

        $now = now();
        $zones = [
            ['country_code' => 'US', 'country_name' => 'United States', 'time_zone' => 'America/New_York', 'gmt_offset' => 'UTC -05:00'],
            ['country_code' => 'US', 'country_name' => 'United States', 'time_zone' => 'America/Chicago', 'gmt_offset' => 'UTC -06:00'],
            ['country_code' => 'US', 'country_name' => 'United States', 'time_zone' => 'America/Denver', 'gmt_offset' => 'UTC -07:00'],
            ['country_code' => 'US', 'country_name' => 'United States', 'time_zone' => 'America/Los_Angeles', 'gmt_offset' => 'UTC -08:00'],
            ['country_code' => 'GB', 'country_name' => 'United Kingdom', 'time_zone' => 'Europe/London', 'gmt_offset' => 'UTC +00:00'],
            ['country_code' => 'FR', 'country_name' => 'France', 'time_zone' => 'Europe/Paris', 'gmt_offset' => 'UTC +01:00'],
            ['country_code' => 'DE', 'country_name' => 'Germany', 'time_zone' => 'Europe/Berlin', 'gmt_offset' => 'UTC +01:00'],
            ['country_code' => 'PK', 'country_name' => 'Pakistan', 'time_zone' => 'Asia/Karachi', 'gmt_offset' => 'UTC +05:00'],
            ['country_code' => 'IN', 'country_name' => 'India', 'time_zone' => 'Asia/Kolkata', 'gmt_offset' => 'UTC +05:30'],
            ['country_code' => 'AE', 'country_name' => 'United Arab Emirates', 'time_zone' => 'Asia/Dubai', 'gmt_offset' => 'UTC +04:00'],
            ['country_code' => 'JP', 'country_name' => 'Japan', 'time_zone' => 'Asia/Tokyo', 'gmt_offset' => 'UTC +09:00'],
            ['country_code' => 'AU', 'country_name' => 'Australia', 'time_zone' => 'Australia/Sydney', 'gmt_offset' => 'UTC +11:00'],
            ['country_code' => 'UTC', 'country_name' => 'UTC', 'time_zone' => 'UTC', 'gmt_offset' => 'UTC +00:00'],
        ];

        foreach ($zones as &$zone) {
            $zone['created_at'] = $now;
            $zone['updated_at'] = $now;
        }

        DB::table('time_zones')->insert($zones);
    }
}
