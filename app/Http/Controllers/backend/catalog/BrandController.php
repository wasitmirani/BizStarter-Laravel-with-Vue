<?php

namespace App\Http\Controllers\backend\catalog;

use App\Contracts\CatalogFilterable;
use App\Http\Controllers\Controller;
use App\Services\BrandService;
use Illuminate\Http\Request;

class BrandController extends Controller implements CatalogFilterable
{
    public function __construct(protected BrandService $brandService) {}

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        return responseJson('brands fetched successfully', [
            'brands' => $this->brandService->brands($filters),
        ], true);
    }
    // Note: Store and update methods can be merged into a single save method in the service layer, but for clarity and RESTful conventions, we keep them separate in the controller.

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:brands,code',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:255',
            'meta' => 'nullable|array',
            'tenant_id' => 'nullable|exists:users,id',
        ]);

        $brand = $this->brandService->saveBrand($data);
        return responseJson('brand created successfully', ['brand' => $brand], true, 201);
    }

    public function show(string $uuid)
    {
        $brand = $this->brandService->fetchByUuid($uuid);
        return responseJson('brand fetched successfully', ['brand' => $brand], true);
    }

    public function update(Request $request, string $uuid)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:brands,code,' . $uuid . ',uuid',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:255',
            'meta' => 'nullable|array',
            'tenant_id' => 'nullable|exists:users,id',
        ]);

        $brand = $this->brandService->updateBrand($uuid, $data);
        return responseJson('brand updated successfully', ['brand' => $brand], true);
    }

    public function destroy(string $uuid)
    {
        $this->brandService->deleteByUuid($uuid);
        return responseJson('brand deleted successfully', null, true);
    }
}
