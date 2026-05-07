<?php

namespace App\Http\Controllers\Backend\Warehouse;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use App\Models\Warehouse;
use App\Services\WarehouseService;
use Illuminate\Http\Request;

class WarehouseController extends Controller implements BaseFilterable
{
    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters['paginated'] = true;

        $warehouses = app(WarehouseService::class)->getWarehousesList($filters,['country:id,name,flag']);

        return responseJson('Warehouses fetched successfully', ['warehouses' => $warehouses], true);
    }

    public function store(StoreWarehouseRequest $request)
    {
        $warehouse = app(WarehouseService::class)->saveWarehouse($request->validated());
        return responseJson('Warehouse created successfully', ['warehouse' => $warehouse], true);
    }

    public function show($uuid)
    {
        try {
            $warehouse = app(WarehouseService::class)->getWarehouseByUuid($uuid);
            return responseJson('Warehouse fetched successfully', ['warehouse' => $warehouse], true);
        } catch (\Exception $e) {
            return responseJson('Warehouse not found', null, false, 404);
        }
    }

    public function update(UpdateWarehouseRequest $request, $id)
    {
        try {
            $warehouse = app(WarehouseService::class)->updateWarehouse((int) $id, $request->validated());
            return responseJson('Warehouse updated successfully', ['warehouse' => $warehouse], true);
        } catch (\Exception $e) {
            return responseJson('Failed to update warehouse: ' . $e->getMessage(), null, false, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $warehouse = Warehouse::findOrFail($id);
            $warehouse->delete();

            return responseJson('Warehouse deleted successfully', null, true);
        } catch (\Exception $e) {
            return responseJson('Failed to delete warehouse', null, false, 500);
        }
    }
}
