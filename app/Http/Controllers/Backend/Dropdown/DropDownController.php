<?php

namespace App\Http\Controllers\Backend\Dropdown;

use App\Http\Controllers\Controller;
use App\Services\DropdownService;


class DropdownController extends Controller
{
    public function __construct(protected DropdownService $dropdownService) {

    }


    public function getListOptions(){
        return responseJson(
            'Fetch dropdown data',
            [
                'countries' => $this->dropdownService->countries(),
                'languages' => $this->dropdownService->languages(),
                'currencies' => $this->dropdownService->currencies(),
                'timezones' => $this->dropdownService->timezones(),
            ],
            true,
            200
        );
    }

    public function getCountries()
    {
        return responseJson(
            'Fetch countries list',
            ['countries' => $this->dropdownService->countries()],
            true,
            200
        );
    }

    public function getLanguages()
    {
        return responseJson(
            'Fetch languages list',
            ['languages' => $this->dropdownService->languages()],
            true,
            200
        );
    }

    public function getCurrencies()
    {
        return responseJson(
            'Fetch currencies list',
            ['currencies' => $this->dropdownService->currencies()],
            true,
            200
        );
    }

    public function getTimezones()
    {
        return responseJson(
            'Fetch timezones list',
            ['timezones' => $this->dropdownService->timezones()],
            true,
            200
        );
    }
}
