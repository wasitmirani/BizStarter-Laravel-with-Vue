<?php

namespace App\Http\Controllers\Backend\Driver;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDriverRequest;
use App\Http\Requests\UpdateDriverRequest;
use App\Services\DriverService;
use Illuminate\Http\Request;

class DriverController extends Controller implements BaseFilterable
{
    public function getDrivers(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters = ['paginated' => false, 'sort_by' => 'full_name', 'sort_dir' => 'asc'] + $filters;
        $drivers = app(DriverService::class)->getDriversList($filters);


        return responseJson('Drivers fetched successfully', ['drivers' => $drivers], true);
    }

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters['paginated'] = $request->input('paginated', true);

        $drivers = app(DriverService::class)->getDriversList($filters);

        return responseJson('Drivers fetched successfully', ['drivers' => $drivers], true);
    }

    public function store(StoreDriverRequest $request)
    {
        $driver = app(DriverService::class)->saveDriver($request->validated());

        return responseJson('Driver created successfully', ['driver' => $driver], true);
    }

    public function show($uuid)
    {
        try {
            $driver = app(DriverService::class)->getDriverByUuid($uuid);

            return responseJson('Driver fetched successfully', ['driver' => $driver], true);
        } catch (\Exception $e) {
            return responseJson('Driver not found', null, false, 404);
        }
    }

    public function update(UpdateDriverRequest $request, $id)
    {
        try {
            $driver = app(DriverService::class)->updateDriver((int) $id, $request->validated());

            return responseJson('Driver updated successfully', ['driver' => $driver], true);
        } catch (\Exception $e) {
            return responseJson('Failed to update driver', null, false, 500);
        }
    }

    public function destroy($id)
    {
        try {
            app(DriverService::class)->deleteDriver((int) $id);

            return responseJson('Driver deleted successfully', null, true);
        } catch (\Exception $e) {
            return responseJson('Failed to delete driver', null, false, 500);
        }
    }

    // \/ Define allowed filters for driver listing
}
