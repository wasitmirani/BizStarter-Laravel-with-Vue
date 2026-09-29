<?php

namespace App\Services;

use App\Models\Country;
use App\Models\Currency;
use App\Models\Language;
use App\Models\TimeZone;
use Illuminate\Support\Facades\Cache;

class DropdownService
{
    public function getRolesDropdown($params)
    {
        return app(RoleService::class)->getRolesList($params ?? []);
    }

    public function countries($params = [])
    {
        return Cache::remember('countries:list', now()->addDay(), function () {
            return Country::orderBy('name', 'asc')->get();
        });
    }

    public function languages($params = [])
    {
        return Cache::remember('languages:list', now()->addDay(), function () {
            return Language::orderBy('name', 'asc')->get();
        });
    }

    public function currencies($params = [])
    {
        return Cache::remember('currencies:list', now()->addDay(), function () {
            return Currency::orderBy('name', 'asc')->get();
        });
    }

    public function timezones($params = [])
    {
        return Cache::remember('timezones:list', now()->addDay(), function () {
            return TimeZone::orderBy('time_zone', 'asc')->get();
        });
    }
}
