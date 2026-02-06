<?php

namespace App\Services;

use App\Models\User;
use function Laravel\Prompts\search;
use App\Contracts\UserFilterable;
use App\Services\LoggerService;

class UserService extends BaseService implements UserFilterable
{

    protected LoggerService $logger;
    protected function model(): ?string
    {
        return User::class;
    }
    public function users($params)
    {
        return $this->model->search($params['search'] ?? $params['query'] ?? null)
            ->sortingBy($params['sort_by'] ?? 'name', $params['sort_dir'] ?? 'asc')
            ->filters(self::ALLOWED_FILTERS)
            ->retrieve($params['paginated'] ?? false, $params['per_page'] ?? 15);
    }

    public function saveUser($data = [])
    {
      return $this->model->create($data);
    }
}
