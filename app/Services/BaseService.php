<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Exception;

abstract class BaseService
{
    /**
     * The model instance
     *
     * @var Model
     */
    protected $model;

    /**
     * BaseService constructor.
     */
    public function __construct()
    {
        $this->model = $this->makeModel();
    }

    /**
     * Configure the Model
     *
     * @return string
     */
    abstract protected function model(): string;

    /**
     * Make Model instance
     *
     * @return Model
     * @throws Exception
     */
    protected function makeModel(): Model
    {
        $model = app($this->model());

        if (!$model instanceof Model) {
            throw new Exception("Class {$this->model()} must be an instance of Illuminate\\Database\\Eloquent\\Model");
        }

        return $model;
    }

    /**
     * Get all records
     *
     * @param array $columns
     * @param array $relations
     * @return Collection
     */
    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->with($relations)->get($columns);
    }

    /**
     * Get paginated records
     *
     * @param int $perPage
     * @param array $columns
     * @param array $relations
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15, array $columns = ['*'], array $relations = []): LengthAwarePaginator
    {
        return $this->model->with($relations)->paginate($perPage, $columns);
    }

    /**
     * Find record by id
     *
     * @param int $id
     * @param array $columns
     * @param array $relations
     * @return Model|null
     */
    public function find(int $id, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->model->with($relations)->find($id, $columns);
    }

    /**
     * Find record by id or fail
     *
     * @param int $id
     * @param array $columns
     * @param array $relations
     * @return Model
     */
    public function findOrFail(int $id, array $columns = ['*'], array $relations = []): Model
    {
        return $this->model->with($relations)->findOrFail($id, $columns);
    }

    /**
     * Find record by specific column
     *
     * @param string $column
     * @param mixed $value
     * @param array $columns
     * @param array $relations
     * @return Model|null
     */
    public function findBy(string $column, $value, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->model->with($relations)->where($column, $value)->first($columns);
    }

    /**
     * Get records where column matches value
     *
     * @param string $column
     * @param mixed $value
     * @param array $columns
     * @param array $relations
     * @return Collection
     */
    public function getWhere(string $column, $value, array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->with($relations)->where($column, $value)->get($columns);
    }

    /**
     * Create new record
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            return $this->model->create($data);
        });
    }

    /**
     * Update existing record
     *
     * @param int $id
     * @param array $data
     * @return Model
     */
    public function update(int $id, array $data): Model
    {
        return DB::transaction(function () use ($id, $data) {
            $record = $this->findOrFail($id);
            $record->update($data);
            return $record->fresh();
        });
    }

    /**
     * Delete record by id
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $record = $this->findOrFail($id);
            return $record->delete();
        });
    }

    /**
     * Create or update record
     *
     * @param array $attributes
     * @param array $values
     * @return Model
     */
    public function updateOrCreate(array $attributes, array $values = []): Model
    {
        return DB::transaction(function () use ($attributes, $values) {
            return $this->model->updateOrCreate($attributes, $values);
        });
    }

    /**
     * Check if record exists
     *
     * @param int $id
     * @return bool
     */
    public function exists(int $id): bool
    {
        return $this->model->where('id', $id)->exists();
    }

    /**
     * Get count of records
     *
     * @return int
     */
    public function count(): int
    {
        return $this->model->count();
    }

    /**
     * Perform bulk insert
     *
     * @param array $data
     * @return bool
     */
    public function bulkInsert(array $data): bool
    {
        return DB::transaction(function () use ($data) {
            return $this->model->insert($data);
        });
    }

    /**
     * Get fresh model instance
     *
     * @return Model
     */
    protected function getModel(): Model
    {
        return $this->model;
    }
}
