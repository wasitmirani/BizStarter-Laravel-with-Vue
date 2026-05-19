<?php

namespace App\Http\Controllers\Backend\Supplier;

use App\Contracts\UserFilterable;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use App\Services\SupplierService;
use Illuminate\Http\Request;

class SupplierController extends Controller implements UserFilterable
{
    public function getSuppliers(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters = ['paginated' => false, 'sort_by' => 'name', 'sort_dir' => 'asc'] + $filters;
        $suppliers = app(SupplierService::class)->getSuppliersList($filters);

        return responseJson('Suppliers fetched successfully', ['suppliers' => $suppliers], true);
    }

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        $filters['paginated'] = $request->input('paginated', true);

        $suppliers = app(SupplierService::class)->getSuppliersList($filters);

        return responseJson('Suppliers fetched successfully', ['suppliers' => $suppliers], true);
    }

    public function store(StoreSupplierRequest $request)
    {
        $supplier = app(SupplierService::class)->saveSupplier($request->validated());
        return responseJson('Supplier created successfully', ['supplier' => $supplier], true);
    }

    public function show($uuid)
    {
        try {
            $supplier = app(SupplierService::class)->getSupplierByUuid($uuid);
            return responseJson('Supplier fetched successfully', ['supplier' => $supplier], true);
        } catch (\Exception $e) {
            return responseJson('Supplier not found', null, false, 404);
        }
    }

    public function update(UpdateSupplierRequest $request, $id)
    {
        try {
            $supplier = app(SupplierService::class)->updateSupplier((int) $id, $request->validated());
            return responseJson('Supplier updated successfully', ['supplier' => $supplier], true);
        } catch (\Exception $e) {
            return responseJson('Failed to update supplier: ' . $e->getMessage(), null, false, 500);
        }
    }

    public function destroy($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();

            return responseJson('Supplier deleted successfully', null, true);
        } catch (\Exception $e) {
            return responseJson('Failed to delete supplier', null, false, 500);
        }
    }
}
