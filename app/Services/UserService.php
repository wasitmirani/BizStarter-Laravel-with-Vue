<?php

namespace App\Services;

use App\Models\User;
use function Laravel\Prompts\search;

class UserService extends BaseService
{

    protected $allowedFilters = [
        'id',
        'search',
        'email',
        'phone',
        'status',
        'role',
        'uuid',
        'is_active',
        'created_from',
        'created_between',
    ];
    protected function model(): ?string
    {
        return User::class;
    }
    public function users($params)
    {
        return $this->model->search($params['search'] ?? $params['query'] ?? null)
            ->sortingBy($params['sort_by'] ?? 'name', $params['sort_dir'] ?? 'asc')
            ->filters($this->allowedFilters)
            ->retrieve($params['paginated'] ?? false, $params['per_page'] ?? 15);
    }



}
