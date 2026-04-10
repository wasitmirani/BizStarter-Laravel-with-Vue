<?php

namespace App\Http\Controllers\backend\catalog;

use App\Contracts\CatalogFilterable;
use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller implements CatalogFilterable
{
    public function __construct(protected CategoryService $categoryService) {}

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);
        return responseJson('categories fetched successfully', [
            'categories' => $this->categoryService->categories($filters),
        ], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'parent_id' => 'nullable|exists:categories,id',
            'meta' => 'nullable|array',
        ]);

        $category = $this->categoryService->saveCategory($data);
        return responseJson('category created successfully', ['category' => $category], true, 201);
    }

    public function show(string $uuid)
    {
        $category = $this->categoryService->fetchByUuid($uuid);
        return responseJson('category fetched successfully', ['category' => $category], true);
    }

    public function update(Request $request, string $uuid)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer|min:0',
            'parent_id' => 'nullable|exists:categories,id',
            'meta' => 'nullable|array',
        ]);

        $category = $this->categoryService->updateCategory($uuid, $data);
        return responseJson('category updated successfully', ['category' => $category], true);
    }

    public function destroy(string $uuid)
    {
        $this->categoryService->deleteByUuid($uuid);
        return responseJson('category deleted successfully', null, true);
    }
}
