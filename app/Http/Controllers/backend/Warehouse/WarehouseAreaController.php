<?php

namespace App\Http\Controllers\Backend\Warehouse;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Models\WarehouseArea;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WarehouseAreaController extends Controller implements BaseFilterable
{
    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $warehouseId = $request->integer('warehouse_id');
        $filters['paginated'] = true;

        $areas = WarehouseArea::query()
            ->where('warehouse_id', $warehouseId)
            ->sorting($filters['sort_dir'] ?? 'asc')
            ->filters($filters)
            ->retrieve($filters['paginated'] ?? false, (int)($filters['per_page'] ?? 15));

        return responseJson('Warehouse areas fetched successfully', ['areas' => $areas], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'name' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $area = WarehouseArea::create(array_merge($data, [
            'tenant_id' => tenant('id')->id ?? null,
            'uuid' => genUUID(),
        ]));

        return responseJson('Warehouse area created successfully', ['area' => $area], true);
    }

    public function show($id)
    {
        $area = WarehouseArea::findOrFail($id);
        return responseJson('Warehouse area fetched successfully', ['area' => $area], true);
    }

    public function update(Request $request, $id)
    {
        $area = WarehouseArea::findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $area->update($data);

        return responseJson('Warehouse area updated successfully', ['area' => $area->fresh()], true);
    }

    public function destroy($id)
    {
        $area = WarehouseArea::findOrFail($id);
        $area->delete();

        return responseJson('Warehouse area deleted successfully', null, true);
    }
}

