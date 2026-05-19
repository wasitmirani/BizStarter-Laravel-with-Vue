<?php

namespace App\Http\Controllers\Backend\Warehouse;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Models\WarehouseLocation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WarehouseLocationController extends Controller implements BaseFilterable
{
    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $warehouseId = $request->integer('warehouse_id');
        $filters['paginated'] = true;

        $locations = WarehouseLocation::query()
            ->where('warehouse_id', $warehouseId)
            ->sorting($filters['sort_dir'] ?? 'asc')
            ->filters($filters)
            ->retrieve($filters['paginated'] ?? false, (int)($filters['per_page'] ?? 15));

        return responseJson('Warehouse locations fetched successfully', ['locations' => $locations], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'name' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $location = WarehouseLocation::create(array_merge($data, [
            'tenant_id' => tenant('id')->id ?? null,
            'uuid' => genUUID(),
        ]));

        return responseJson('Warehouse location created successfully', ['location' => $location], true);
    }

    public function show($id)
    {
        $location = WarehouseLocation::findOrFail($id);
        return responseJson('Warehouse location fetched successfully', ['location' => $location], true);
    }

    public function update(Request $request, $id)
    {
        $location = WarehouseLocation::findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $location->update($data);

        return responseJson('Warehouse location updated successfully', ['location' => $location->fresh()], true);
    }

    public function destroy($id)
    {
        $location = WarehouseLocation::findOrFail($id);
        $location->delete();

        return responseJson('Warehouse location deleted successfully', null, true);
    }
}

