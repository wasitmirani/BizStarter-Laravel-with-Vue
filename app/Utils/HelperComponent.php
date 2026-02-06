<?php

namespace App\Utils;

use App\Models\User;
use App\Models\Country;
use App\Models\TimeZone;
use Illuminate\Support\Facades\Cache;


class HelperComponent
{


    public static function useCache(){
        
    }
    public static function getCountriesList()
    {
        return Cache::remember('getCountriesList', sessionTimer(), function () {
            return (new Country())->getAllCountries();
        });
    }

    public static function getTimeZonesList()
    {
        return Cache::remember('getTimeZonesList', sessionTimer(), function () {
            return (new TimeZone())->getAllTimeZones();
        });
    }

    public static function getRolesList(){
        return Cache::remember('getRolesList', sessionTimer(), function () {
            return (new User())->getRoles();
        });
    }

}
