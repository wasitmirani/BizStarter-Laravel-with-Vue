<?php

namespace App\Services;

use App\Contracts\BaseFilterable;
use App\Enums\TenantStatusEnum;
use App\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;

class TenantService extends BaseService implements BaseFilterable
{
    protected function model(): ?string
    {
        return Tenant::class;
    }

    public function tenants(array $params = [])
    {
        return $this->model
            ->with('domains')
            ->when(! isset($params['sort_by']), function ($query) {
                $query->latest();
            })
            ->when(isset($params['sort_by']), function ($query) use ($params) {
                $query->sortingBy(
                    $params['sort_by'],
                    $params['sort_dir'] ?? 'asc'
                );
            })
            ->filters($params)
            ->retrieve($params['paginated'] ?? true, $this->resolvePerPage($params));
    }

    public function fetchTenant(string $id): ?Tenant
    {
        return $this->model->with('domains')->find($id);
    }

    public function createTenant(array $data): Tenant
    {
        $domain = $data['domain'];
        $adminName = $data['admin_name'];
        $adminEmail = $data['admin_email'];
        $adminPassword = $data['admin_password'];

        unset(
            $data['domain'],
            $data['admin_name'],
            $data['admin_email'],
            $data['admin_password'],
            $data['admin_password_confirmation'],
        );

        $tenant = $this->model->create(array_merge($data, [
            'status' => $data['status'] ?? TenantStatusEnum::ACTIVE->value,
            'timezone' => $data['timezone'] ?? config('app.timezone', 'UTC'),
            'locale' => $data['locale'] ?? config('app.locale', 'en'),
            'admin_name' => $adminName,
            'admin_email' => $adminEmail,
            'admin_password' => $adminPassword,
        ]));

        $tenant->domains()->create([
            'domain' => $domain,
        ]);

        app(LocalHostsService::class)->syncDomains([$domain]);

        return $tenant->load('domains');
    }

    public function updateTenant(string $id, array $data): Tenant|array
    {
        $tenant = $this->fetchTenant($id);

        if (! $tenant) {
            return responseMessage('Tenant not found', 404);
        }

        $domain = $data['domain'] ?? null;
        unset(
            $data['domain'],
            $data['admin_name'],
            $data['admin_email'],
            $data['admin_password'],
            $data['admin_password_confirmation'],
        );

        $tenant->fill($data);
        $tenant->save();

        if ($domain) {
            $primary = $tenant->domains()->first();
            if ($primary) {
                $primary->update(['domain' => $domain]);
            } else {
                $tenant->domains()->create(['domain' => $domain]);
            }
            app(LocalHostsService::class)->syncDomains([$domain]);
        }

        return $tenant->fresh('domains');
    }

    public function updateStatus(string $id, string $status): Tenant|array
    {
        $tenant = $this->fetchTenant($id);

        if (! $tenant) {
            return responseMessage('Tenant not found', 404);
        }

        $tenant->status = $status;
        $tenant->save();

        return $tenant->fresh('domains');
    }

    public function deleteTenant(string $id): bool|array
    {
        $tenant = $this->fetchTenant($id);

        if (! $tenant) {
            return responseMessage('Tenant not found', 404);
        }

        $tenant->delete();

        return true;
    }

    public function addDomain(string $tenantId, string $domain): Domain|array
    {
        $tenant = $this->fetchTenant($tenantId);

        if (! $tenant) {
            return responseMessage('Tenant not found', 404);
        }

        $created = $tenant->domains()->create([
            'domain' => $domain,
        ]);

        app(LocalHostsService::class)->syncDomains([$domain]);

        return $created;
    }

    public function removeDomain(string $tenantId, int $domainId): bool|array
    {
        $tenant = $this->fetchTenant($tenantId);

        if (! $tenant) {
            return responseMessage('Tenant not found', 404);
        }

        $domain = $tenant->domains()->where('id', $domainId)->first();

        if (! $domain) {
            return responseMessage('Domain not found', 404);
        }

        if ($tenant->domains()->count() <= 1) {
            return responseMessage('Cannot remove the last domain', 422);
        }

        $domain->delete();

        return true;
    }
}
