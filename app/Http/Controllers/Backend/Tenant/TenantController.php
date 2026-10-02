<?php

namespace App\Http\Controllers\Backend\Tenant;

use App\Contracts\BaseFilterable;
use App\Enums\TenantStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTenantRequest;
use App\Http\Requests\UpdateTenantRequest;
use App\Services\LoggerService;
use App\Services\TenantService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TenantController extends Controller implements BaseFilterable
{
    public function __construct(protected TenantService $tenantService) {}

    public function index(Request $request)
    {
        $filters = $request->only(self::ALLOWED_FILTERS);

        return responseJson('tenants fetched successfully', [
            'tenants' => $this->tenantService->tenants($filters),
        ], true);
    }

    public function store(StoreTenantRequest $request)
    {
        LoggerService::info('Tenant creation attempt', [
            'data' => collect($request->validated())->except(['admin_password', 'admin_password_confirmation'])->all(),
        ]);

        $tenant = $this->tenantService->createTenant($request->validated());

        LoggerService::info('Tenant created successfully', ['tenant_id' => $tenant->id]);

        return responseJson('tenant created successfully', ['tenant' => $tenant], true, 201);
    }

    public function show(string $tenant)
    {
        $model = $this->tenantService->fetchTenant($tenant);

        if (! $model) {
            return responseJson('Tenant not found', null, false, 404);
        }

        return responseJson('tenant fetched successfully', ['tenant' => $model], true);
    }

    public function update(UpdateTenantRequest $request, string $tenant)
    {
        $result = $this->tenantService->updateTenant($tenant, $request->validated());

        if (is_array($result) && isset($result['status']) && $result['status'] === false) {
            return responseJson($result['message'] ?? 'Unable to update tenant', null, false, $result['status_code'] ?? 400);
        }

        return responseJson('tenant updated successfully', ['tenant' => $result], true);
    }

    public function destroy(string $tenant)
    {
        $result = $this->tenantService->deleteTenant($tenant);

        if (is_array($result) && isset($result['status']) && $result['status'] === false) {
            return responseJson($result['message'] ?? 'Unable to delete tenant', null, false, $result['status_code'] ?? 400);
        }

        return responseJson('tenant has been deleted successfully', null, true);
    }

    public function updateStatus(Request $request, string $tenant)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(TenantStatusEnum::values())],
        ]);

        $result = $this->tenantService->updateStatus($tenant, $validated['status']);

        if (is_array($result) && isset($result['status']) && $result['status'] === false) {
            return responseJson($result['message'] ?? 'Unable to update status', null, false, $result['status_code'] ?? 400);
        }

        return responseJson('tenant status updated successfully', ['tenant' => $result], true);
    }

    public function storeDomain(Request $request, string $tenant)
    {
        $validated = $request->validate([
            'domain' => ['required', 'string', 'max:255', 'unique:domains,domain'],
        ]);

        $result = $this->tenantService->addDomain($tenant, $validated['domain']);

        if (is_array($result) && isset($result['status']) && $result['status'] === false) {
            return responseJson($result['message'] ?? 'Unable to add domain', null, false, $result['status_code'] ?? 400);
        }

        return responseJson('domain added successfully', ['domain' => $result], true, 201);
    }

    public function destroyDomain(string $tenant, int $domain)
    {
        $result = $this->tenantService->removeDomain($tenant, $domain);

        if (is_array($result) && isset($result['status']) && $result['status'] === false) {
            return responseJson($result['message'] ?? 'Unable to remove domain', null, false, $result['status_code'] ?? 400);
        }

        return responseJson('domain removed successfully', null, true);
    }
}
