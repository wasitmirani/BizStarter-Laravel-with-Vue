<?php

namespace App\Services;

use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Log;

abstract class BaseService
{
    /**
     * The model instance
     *
     * @var Model|null
     */
    protected ?Model $model = null;

    /**
     * Whether the service requires a model
     *
     * @var bool
     */
    protected bool $requiresModel = true;

    /**
     * BaseService constructor.
     *
     * @throws Exception
     */
    public function __construct()
    {
        if ($this->requiresModel) {
            $this->model = $this->makeModel();
        }
    }

    /**
     * Configure the Model (optional if requiresModel is false)
     *
     * @return string|null
     */
    abstract protected function model(): ?string;

    /**
     * Make Model instance
     *
     * @return Model
     * @throws Exception
     */
    protected function makeModel(): Model
    {
        $modelClass = $this->model();

        if (!$modelClass) {
            throw new Exception("Model class is not defined for this service.");
        }

        $model = app($modelClass);

        if (!$model instanceof Model) {
            throw new Exception("Class {$modelClass} must be an instance of Illuminate\\Database\\Eloquent\\Model");
        }

        return $model;
    }

    /**
     * Set the model instance
     *
     * @param Model $model
     * @return $this
     */
    public function setModel(Model $model): self
    {
        $this->model = $model;
        return $this;
    }

    /**
     * Get the model instance
     *
     * @return Model
     * @throws Exception
     */
    protected function getModel(): Model
    {
        if (!$this->model instanceof Model) {
            throw new Exception("Model is not initialized for this service.");
        }

        return $this->model;
    }

    /**
     * Check if model is available
     *
     * @return bool
     */
    protected function hasModel(): bool
    {
        return $this->model instanceof Model;
    }

    // ========== CRUD METHODS (Model Required) ==========

    /**
     * Get all records
     *
     * @param array $columns
     * @param array $relations
     * @return Collection
     * @throws Exception
     */
    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->getModel()->with($relations)->get($columns);
    }

    /**
     * Get paginated records
     *
     * @param int $perPage
     * @param array $columns
     * @param array $relations
     * @return LengthAwarePaginator
     * @throws Exception
     */
    public function paginate(int $perPage = 15, array $columns = ['*'], array $relations = []): LengthAwarePaginator
    {
        return $this->getModel()->with($relations)->paginate($perPage, $columns);
    }

    /**
     * Find record by id
     *
     * @param int|string $id
     * @param array $columns
     * @param array $relations
     * @return Model|null
     * @throws Exception
     */
    public function find($id, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->getModel()->with($relations)->find($id, $columns);
    }

    /**
     * Find record by id or fail
     *
     * @param int|string $id
     * @param array $columns
     * @param array $relations
     * @return Model
     * @throws Exception
     */
    public function findOrFail($id, array $columns = ['*'], array $relations = []): Model
    {
        return $this->getModel()->with($relations)->findOrFail($id, $columns);
    }

    /**
     * Find record by specific column
     *
     * @param string $column
     * @param mixed $value
     * @param array $columns
     * @param array $relations
     * @return Model|null
     * @throws Exception
     */
    public function findBy(string $column, $value, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->getModel()->with($relations)->where($column, $value)->first($columns);
    }

    /**
     * Get records where column matches value
     *
     * @param string $column
     * @param mixed $value
     * @param array $columns
     * @param array $relations
     * @return Collection
     * @throws Exception
     */
    public function getWhere(string $column, $value, array $columns = ['*'], array $relations = []): Collection
    {
        return $this->getModel()->with($relations)->where($column, $value)->get($columns);
    }

    /**
     * Create new record
     *
     * @param array $data
     * @return Model
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            return $this->getModel()->create($data);
        });
    }

    /**
     * Update existing record
     *
     * @param int|string $id
     * @param array $data
     * @return Model
     * @throws Exception
     */
    public function update($id, array $data): Model
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
     * @param int|string $id
     * @return bool
     * @throws Exception
     */
    public function delete($uuid, string $column = 'id'): bool
    {
        

        return DB::transaction(function () use ($uuid, $column) {
            $record = $this->model->where($column, $uuid)->first(); // Use $this->model
            if (!$record) {
                throw new ModelNotFoundException("Record not found with {$column}: {$uuid}");
            }
            return (bool) $record->delete();
        });
    }

    /**
     * Create or update record
     *
     * @param array $attributes
     * @param array $values
     * @return Model
     * @throws Exception
     */
    public function updateOrCreate(array $attributes, array $values = []): Model
    {
        return DB::transaction(function () use ($attributes, $values) {
            return $this->getModel()->updateOrCreate($attributes, $values);
        });
    }

    /**
     * Check if record exists
     *
     * @param int|string $id
     * @return bool
     * @throws Exception
     */
    public function exists($id): bool
    {
        return $this->getModel()->where('id', $id)->exists();
    }

    /**
     * Get count of records
     *
     * @return int
     * @throws Exception
     */
    public function count(): int
    {
        return $this->getModel()->count();
    }

    /**
     * Perform bulk insert
     *
     * @param array $data
     * @return bool
     * @throws Exception
     */
    public function bulkInsert(array $data): bool
    {
        return DB::transaction(function () use ($data) {
            return $this->getModel()->insert($data);
        });
    }
    protected function resolvePerPage(array $params, int $default = 15, int $max = 100): int
    {
        return max(
            1,
            min((int)($params['per_page'] ?? $default), $max)
        );
    }
    
}
