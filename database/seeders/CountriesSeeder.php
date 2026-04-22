<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountriesSeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            ["name"=>"Afghanistan","iso2"=>"AF","code"=>"AFG","phone_code"=>"+93","currency"=>"AFN","currency_symbol"=>"؋","timezone"=>"Asia/Kabul","flag"=>"https://flagcdn.com/af.svg"],
            ["name"=>"Albania","iso2"=>"AL","code"=>"ALB","phone_code"=>"+355","currency"=>"ALL","currency_symbol"=>"L","timezone"=>"Europe/Tirane","flag"=>"https://flagcdn.com/al.svg"],
            ["name"=>"Algeria","iso2"=>"DZ","code"=>"DZA","phone_code"=>"+213","currency"=>"DZD","currency_symbol"=>"د.ج","timezone"=>"Africa/Algiers","flag"=>"https://flagcdn.com/dz.svg"],
            ["name"=>"Argentina","iso2"=>"AR","code"=>"ARG","phone_code"=>"+54","currency"=>"ARS","currency_symbol"=>"$","timezone"=>"America/Argentina/Buenos_Aires","flag"=>"https://flagcdn.com/ar.svg"],
            ["name"=>"Australia","iso2"=>"AU","code"=>"AUS","phone_code"=>"+61","currency"=>"AUD","currency_symbol"=>"$","timezone"=>"Australia/Sydney","flag"=>"https://flagcdn.com/au.svg"],
            ["name"=>"Austria","iso2"=>"AT","code"=>"AUT","phone_code"=>"+43","currency"=>"EUR","currency_symbol"=>"€","timezone"=>"Europe/Vienna","flag"=>"https://flagcdn.com/at.svg"],
            ["name"=>"Bangladesh","iso2"=>"BD","code"=>"BGD","phone_code"=>"+880","currency"=>"BDT","currency_symbol"=>"৳","timezone"=>"Asia/Dhaka","flag"=>"https://flagcdn.com/bd.svg"],
            ["name"=>"Belgium","iso2"=>"BE","code"=>"BEL","phone_code"=>"+32","currency"=>"EUR","currency_symbol"=>"€","timezone"=>"Europe/Brussels","flag"=>"https://flagcdn.com/be.svg"],
            ["name"=>"Brazil","iso2"=>"BR","code"=>"BRA","phone_code"=>"+55","currency"=>"BRL","currency_symbol"=>"R$","timezone"=>"America/Sao_Paulo","flag"=>"https://flagcdn.com/br.svg"],
            ["name"=>"Canada","iso2"=>"CA","code"=>"CAN","phone_code"=>"+1","currency"=>"CAD","currency_symbol"=>"$","timezone"=>"America/Toronto","flag"=>"https://flagcdn.com/ca.svg"],
            ["name"=>"China","iso2"=>"CN","code"=>"CHN","phone_code"=>"+86","currency"=>"CNY","currency_symbol"=>"¥","timezone"=>"Asia/Shanghai","flag"=>"https://flagcdn.com/cn.svg"],
            ["name"=>"Denmark","iso2"=>"DK","code"=>"DNK","phone_code"=>"+45","currency"=>"DKK","currency_symbol"=>"kr","timezone"=>"Europe/Copenhagen","flag"=>"https://flagcdn.com/dk.svg"],
            ["name"=>"Egypt","iso2"=>"EG","code"=>"EGY","phone_code"=>"+20","currency"=>"EGP","currency_symbol"=>"£","timezone"=>"Africa/Cairo","flag"=>"https://flagcdn.com/eg.svg"],
            ["name"=>"France","iso2"=>"FR","code"=>"FRA","phone_code"=>"+33","currency"=>"EUR","currency_symbol"=>"€","timezone"=>"Europe/Paris","flag"=>"https://flagcdn.com/fr.svg"],
            ["name"=>"Germany","iso2"=>"DE","code"=>"DEU","phone_code"=>"+49","currency"=>"EUR","currency_symbol"=>"€","timezone"=>"Europe/Berlin","flag"=>"https://flagcdn.com/de.svg"],
            ["name"=>"India","iso2"=>"IN","code"=>"IND","phone_code"=>"+91","currency"=>"INR","currency_symbol"=>"₹","timezone"=>"Asia/Kolkata","flag"=>"https://flagcdn.com/in.svg"],
            ["name"=>"Indonesia","iso2"=>"ID","code"=>"IDN","phone_code"=>"+62","currency"=>"IDR","currency_symbol"=>"Rp","timezone"=>"Asia/Jakarta","flag"=>"https://flagcdn.com/id.svg"],
            ["name"=>"Italy","iso2"=>"IT","code"=>"ITA","phone_code"=>"+39","currency"=>"EUR","currency_symbol"=>"€","timezone"=>"Europe/Rome","flag"=>"https://flagcdn.com/it.svg"],
            ["name"=>"Japan","iso2"=>"JP","code"=>"JPN","phone_code"=>"+81","currency"=>"JPY","currency_symbol"=>"¥","timezone"=>"Asia/Tokyo","flag"=>"https://flagcdn.com/jp.svg"],
            ["name"=>"Kenya","iso2"=>"KE","code"=>"KEN","phone_code"=>"+254","currency"=>"KES","currency_symbol"=>"KSh","timezone"=>"Africa/Nairobi","flag"=>"https://flagcdn.com/ke.svg"],
            ["name"=>"Malaysia","iso2"=>"MY","code"=>"MYS","phone_code"=>"+60","currency"=>"MYR","currency_symbol"=>"RM","timezone"=>"Asia/Kuala_Lumpur","flag"=>"https://flagcdn.com/my.svg"],
            ["name"=>"Mexico","iso2"=>"MX","code"=>"MEX","phone_code"=>"+52","currency"=>"MXN","currency_symbol"=>"$","timezone"=>"America/Mexico_City","flag"=>"https://flagcdn.com/mx.svg"],
            ["name"=>"Netherlands","iso2"=>"NL","code"=>"NLD","phone_code"=>"+31","currency"=>"EUR","currency_symbol"=>"€","timezone"=>"Europe/Amsterdam","flag"=>"https://flagcdn.com/nl.svg"],
            ["name"=>"New Zealand","iso2"=>"NZ","code"=>"NZL","phone_code"=>"+64","currency"=>"NZD","currency_symbol"=>"$","timezone"=>"Pacific/Auckland","flag"=>"https://flagcdn.com/nz.svg"],
            ["name"=>"Nigeria","iso2"=>"NG","code"=>"NGA","phone_code"=>"+234","currency"=>"NGN","currency_symbol"=>"₦","timezone"=>"Africa/Lagos","flag"=>"https://flagcdn.com/ng.svg"],
            ["name"=>"Norway","iso2"=>"NO","code"=>"NOR","phone_code"=>"+47","currency"=>"NOK","currency_symbol"=>"kr","timezone"=>"Europe/Oslo","flag"=>"https://flagcdn.com/no.svg"],
            ["name"=>"Pakistan","iso2"=>"PK","code"=>"PAK","phone_code"=>"+92","currency"=>"PKR","currency_symbol"=>"Rs","timezone"=>"Asia/Karachi","flag"=>"https://flagcdn.com/pk.svg"],
            ["name"=>"Philippines","iso2"=>"PH","code"=>"PHL","phone_code"=>"+63","currency"=>"PHP","currency_symbol"=>"₱","timezone"=>"Asia/Manila","flag"=>"https://flagcdn.com/ph.svg"],
            ["name"=>"Qatar","iso2"=>"QA","code"=>"QAT","phone_code"=>"+974","currency"=>"QAR","currency_symbol"=>"﷼","timezone"=>"Asia/Qatar","flag"=>"https://flagcdn.com/qa.svg"],
            ["name"=>"Saudi Arabia","iso2"=>"SA","code"=>"SAU","phone_code"=>"+966","currency"=>"SAR","currency_symbol"=>"﷼","timezone"=>"Asia/Riyadh","flag"=>"https://flagcdn.com/sa.svg"],
            ["name"=>"Singapore","iso2"=>"SG","code"=>"SGP","phone_code"=>"+65","currency"=>"SGD","currency_symbol"=>"$","timezone"=>"Asia/Singapore","flag"=>"https://flagcdn.com/sg.svg"],
            ["name"=>"South Africa","iso2"=>"ZA","code"=>"ZAF","phone_code"=>"+27","currency"=>"ZAR","currency_symbol"=>"R","timezone"=>"Africa/Johannesburg","flag"=>"https://flagcdn.com/za.svg"],
            ["name"=>"South Korea","iso2"=>"KR","code"=>"KOR","phone_code"=>"+82","currency"=>"KRW","currency_symbol"=>"₩","timezone"=>"Asia/Seoul","flag"=>"https://flagcdn.com/kr.svg"],
            ["name"=>"Spain","iso2"=>"ES","code"=>"ESP","phone_code"=>"+34","currency"=>"EUR","currency_symbol"=>"€","timezone"=>"Europe/Madrid","flag"=>"https://flagcdn.com/es.svg"],
            ["name"=>"Sweden","iso2"=>"SE","code"=>"SWE","phone_code"=>"+46","currency"=>"SEK","currency_symbol"=>"kr","timezone"=>"Europe/Stockholm","flag"=>"https://flagcdn.com/se.svg"],
            ["name"=>"Switzerland","iso2"=>"CH","code"=>"CHE","phone_code"=>"+41","currency"=>"CHF","currency_symbol"=>"CHF","timezone"=>"Europe/Zurich","flag"=>"https://flagcdn.com/ch.svg"],
            ["name"=>"Turkey","iso2"=>"TR","code"=>"TUR","phone_code"=>"+90","currency"=>"TRY","currency_symbol"=>"₺","timezone"=>"Europe/Istanbul","flag"=>"https://flagcdn.com/tr.svg"],
            ["name"=>"United Arab Emirates","iso2"=>"AE","code"=>"ARE","phone_code"=>"+971","currency"=>"AED","currency_symbol"=>"د.إ","timezone"=>"Asia/Dubai","flag"=>"https://flagcdn.com/ae.svg"],
            ["name"=>"United Kingdom","iso2"=>"GB","code"=>"GBR","phone_code"=>"+44","currency"=>"GBP","currency_symbol"=>"£","timezone"=>"Europe/London","flag"=>"https://flagcdn.com/gb.svg"],
            ["name"=>"United States","iso2"=>"US","code"=>"USA","phone_code"=>"+1","currency"=>"USD","currency_symbol"=>"$","timezone"=>"America/New_York","flag"=>"https://flagcdn.com/us.svg"]
        ];

        foreach ($countries as &$country) {
            $country['is_active'] = true;
            $country['created_at'] = now();
            $country['updated_at'] = now();
        }

        DB::table('countries')->upsert(
            $countries,
            ['iso2'],
            ['name','code','phone_code','currency','currency_symbol','timezone','flag','is_active','updated_at']
        );
    }
}
