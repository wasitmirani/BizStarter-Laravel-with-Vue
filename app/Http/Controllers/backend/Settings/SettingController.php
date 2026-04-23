<?php

namespace App\Http\Controllers\Backend\Settings;

use App\Http\Controllers\Controller;
use App\Services\SettingService;
use Illuminate\Http\Request;

class SettingController extends Controller
{

    public function __construct(protected SettingService $settingService) {

    }
    public function getListOptions()
    {
        return responseJson(
            'Fetch setting list options',
            ['options' => $this->settingService->getListOptions()],
            true,
            200
        );
    }



}
