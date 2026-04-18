<?php

namespace App\Models\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

trait InteractsWithListQuery
{
    public function scopeLimit(Builder $query, int $limit): Builder
    {
        return $query->take($limit);
    }

    /**
     * @return LengthAwarePaginator<int, static>|Collection<int, static>
     */
    public function scopeRetrieve(Builder $query, bool|string|int $paginated = false, int $perPage = 15): LengthAwarePaginator|Collection
    {
        $paginated = filter_var($paginated, FILTER_VALIDATE_BOOLEAN);

        return $query->when(
            $paginated,
            fn (Builder $q) => $q->paginate($perPage),
            fn (Builder $q) => $q->get(),
        );
    }

    public function scopeSortingBy(Builder $query, string $column, string $direction = 'asc'): Builder
    {
        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($column, $direction);
    }
}
