<?php

namespace App\Http\Controllers\Backend\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->integer('per_page', 10);
        $search = trim((string) $request->input('search', ''));

        $tenants = Tenant::query()
            ->with(['timezone:id,name', 'language:id,name,code', 'currency:id,name,code,symbol'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('domain', 'like', "%{$search}%")
                        ->orWhere('contact_email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);

        return responseJson('tenants fetched successfully', ['tenants' => $tenants], true);
    }

    public function store(Request $request)
    {
        $data = $this->validatedData($request);
        $data['uuid'] = genUUID();
        $data['slug'] = setSlug((string) ($data['slug'] ?? $data['name']));
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        $tenant = Tenant::create($data);

        return responseJson('tenant created successfully', ['tenant' => $tenant], true, 201);
    }

    public function show(Tenant $tenant)
    {
        $tenant->load(['timezone:id,name', 'language:id,name,code', 'currency:id,name,code,symbol']);

        return responseJson('tenant fetched successfully', ['tenant' => $tenant], true);
    }

    public function update(Request $request, Tenant $tenant)
    {
        $data = $this->validatedData($request, $tenant->id);
        $data['slug'] = setSlug((string) ($data['slug'] ?? $data['name'] ?? $tenant->name));
        $data['updated_by'] = Auth::id();

        $tenant->update($data);

        return responseJson('tenant updated successfully', ['tenant' => $tenant->fresh()], true);
    }

    public function destroy(Tenant $tenant)
    {
        Tenant::whereKey($tenant->id)->delete();

        return responseJson('tenant deleted successfully', [], true);
    }

    public function current(Request $request)
    {
        $tenant = $request->user()?->tenant;
        if (!$tenant) {
            return responseJson('No tenant assigned for this user', null, false, 404);
        }

        $tenant->load(['timezone:id,name', 'language:id,name,code', 'currency:id,name,code,symbol']);

        return responseJson('tenant settings fetched successfully', ['tenant' => $tenant], true);
    }

    public function updateCurrent(Request $request)
    {
        $tenant = $request->user()?->tenant;
        if (!$tenant) {
            return responseJson('No tenant assigned for this user', null, false, 404);
        }

        $data = $this->validatedData($request, $tenant->id);
        $data['slug'] = setSlug((string) ($data['slug'] ?? $data['name'] ?? $tenant->name));
        $data['updated_by'] = Auth::id();

        $tenant->update($data);

        return responseJson('tenant settings updated successfully', ['tenant' => $tenant->fresh()], true);
    }

    private function validatedData(Request $request, ?int $tenantId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('tenants', 'slug')->ignore($tenantId)],
            'domain' => ['nullable', 'string', 'max:255', Rule::unique('tenants', 'domain')->ignore($tenantId)],
            'database' => ['nullable', 'string', 'max:255', Rule::unique('tenants', 'database')->ignore($tenantId)],
            'status' => ['nullable', Rule::in(['active', 'inactive', 'suspended'])],
            'is_active' => ['nullable', 'boolean'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:40'],
            'timezone_id' => ['nullable', 'integer'],
            'language_id' => ['nullable', 'integer'],
            'currency_id' => ['nullable', 'integer'],
            'subscription_plan' => ['nullable', 'string', 'max:100'],
            'max_users' => ['nullable', 'integer', 'min:1'],
            'max_roles' => ['nullable', 'integer', 'min:1'],
            'meta' => ['nullable', 'array'],
        ]);
    }
}
