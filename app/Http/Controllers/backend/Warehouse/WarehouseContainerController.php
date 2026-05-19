<?php

namespace App\Http\Controllers\Backend\Warehouse;

use App\Contracts\BaseFilterable;
use App\Http\Controllers\Controller;
use App\Models\WarehouseContainer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WarehouseContainerController extends Controller implements BaseFilterable
{
    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $warehouseId = $request->integer('warehouse_id');
        $filters['paginated'] = true;

        $containers = WarehouseContainer::query()
            ->where('warehouse_id', $warehouseId)
            ->sorting($filters['sort_dir'] ?? 'asc')
            ->filters($filters)
            ->retrieve($filters['paginated'] ?? false, (int)($filters['per_page'] ?? 15));

        return responseJson('Warehouse containers fetched successfully', ['containers' => $containers], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'warehouse_id' => ['required', 'integer', 'exists:warehouses,id'],
            'name' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $container = WarehouseContainer::create(array_merge($data, [
            'tenant_id' => tenant('id')->id ?? null,
            'uuid' => genUUID(),
        ]));

        return responseJson('Warehouse container created successfully', ['container' => $container], true);
    }

    public function show($id)
    {
        $container = WarehouseContainer::findOrFail($id);
        return responseJson('Warehouse container fetched successfully', ['container' => $container], true);
    }

    public function update(Request $request, $id)
    {
        $container = WarehouseContainer::findOrFail($id);
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ]);

        $container->update($data);

        return responseJson('Warehouse container updated successfully', ['container' => $container->fresh()], true);
    }

    public function destroy($id)
    {
        $container = WarehouseContainer::findOrFail($id);
        $container->delete();

        return responseJson('Warehouse container deleted successfully', null, true);
    }
}

