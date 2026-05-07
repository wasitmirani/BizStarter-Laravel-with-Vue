<?php

namespace App\Http\Controllers\Backend\Warehouse;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Models\WarehouseZone;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WarehouseZoneController extends Controller implements BaseFilterable
{
    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $warehouseId = $request->integer('warehouse_id');
        $filters['paginated'] = true;

        $zones = WarehouseZone::query()
            ->where('warehouse_id', $warehouseId)
            ->sorting($filters['sort_dir'] ?? 'asc')
            ->filters($filters)
            ->retrieve($filters['paginated'] ?? false, (int)($filters['per_page'] ?? 15));

        return responseJson('Warehouse zones fetched successfully', ['zones' => $zones], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'name' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $zone = WarehouseZone::create(array_merge($data, [
            'tenant_id' => tenant('id')->id ?? null,
            'uuid' => genUUID(),
        ]));

        return responseJson('Warehouse zone created successfully', ['zone' => $zone], true);
    }

    public function show($id)
    {
        $zone = WarehouseZone::findOrFail($id);
        return responseJson('Warehouse zone fetched successfully', ['zone' => $zone], true);
    }

    public function update(Request $request, $id)
    {
        $zone = WarehouseZone::findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $zone->update($data);

        return responseJson('Warehouse zone updated successfully', ['zone' => $zone->fresh()], true);
    }

    public function destroy($id)
    {
        $zone = WarehouseZone::findOrFail($id);
        $zone->delete();

        return responseJson('Warehouse zone deleted successfully', null, true);
    }
}

