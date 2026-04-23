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
        // Assuming RoleService is another service that fetches roles
        $roles = app(RoleService::class)->getRolesList($params ?? []);
        return $roles;
    }

    public function countries($params=[])
    {
        return Cache::remember('countries:list', now()->addDays(1), function () {
            return Country::select('id', 'name')
                ->orderBy('name', 'asc')
                ->get();
        });
    }

    public function languages($params=[])
    {
        return Cache::remember('languages:list', now()->addDays(1), function () {
            return Language::orderBy('name', 'asc')
                ->get();
        });
    }

    public function currencies($params=[])
    {
        return Cache::remember('currencies:list', now()->addDays(1), function () {
            return Currency::orderBy('name', 'asc')
                ->get();
        });
    }

    public function timezones($params=[])
    {
        return Cache::remember('timezones:list', now()->addDays(1), function () {
            return TimeZone::orderBy('name', 'asc')
                ->get();
        });
    }
}
