<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait HasNameGuardFilters
{
    public function scopeSorting(Builder $query, string $direction = 'asc'): Builder
    {
        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        return $query->orderBy('name', $direction);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search === null || trim($search) === '') {
            return $query;
        }

        $search = trim($search);

        return $query->where('name', 'like', "%{$search}%");
    }

    public function scopeFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['id'] ?? false, fn (Builder $q) => $q->where('id', $filters['id']))
            ->when($filters['search'] ?? false, fn (Builder $q) => $q->search($filters['search']))
            ->when($filters['guard_name'] ?? false, fn (Builder $q) => $q->where('guard_name', $filters['guard_name']));
    }
}
