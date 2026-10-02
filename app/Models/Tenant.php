<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\TenantStatusEnum;
use App\Models\Concerns\InteractsWithListQuery;
use Illuminate\Database\Eloquent\Builder;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, InteractsWithListQuery;

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'email',
            'status',
            'logo',
            'primary_color',
            'timezone',
            'locale',
            'created_at',
            'updated_at',
        ];
    }

    protected function casts(): array
    {
        return [
            'status' => TenantStatusEnum::class,
        ];
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        $search = trim($search);

        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%")
                ->orWhere('id', 'LIKE', "%{$search}%")
                ->orWhereHas('domains', function (Builder $domainQuery) use ($search) {
                    $domainQuery->where('domain', 'LIKE', "%{$search}%");
                });
        });
    }

    public function scopeFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? $filters['query'] ?? null, fn (Builder $q, $search) => $q->search($search))
            ->when($filters['status'] ?? null, fn (Builder $q, $status) => $q->where('status', $status))
            ->when($filters['email'] ?? null, fn (Builder $q, $email) => $q->where('email', $email))
            ->when($filters['created_from'] ?? null, fn (Builder $q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when($filters['date_range'] ?? null, function (Builder $q, $days) {
                $q->where('created_at', '>=', now()->subDays((int) $days)->startOfDay());
            });
    }

    public function isActive(): bool
    {
        return $this->status === TenantStatusEnum::ACTIVE;
    }

    public function primaryDomain(): ?string
    {
        return $this->domains->first()?->domain;
    }
}
