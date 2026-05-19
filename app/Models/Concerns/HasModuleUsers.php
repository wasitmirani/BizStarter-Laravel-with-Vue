<?php

namespace App\Models\Concerns;

use App\Models\ModuleHasUser;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasModuleUsers
{
    public function moduleLinks(): HasMany
    {
        return $this->hasMany(ModuleHasUser::class, 'user_id');
    }

    public function warehouses(): MorphToMany
    {
        return $this->morphedByMany(Warehouse::class, 'module', 'module_has_users');
    }

    public function syncModuleUsers(string $moduleClass, array $moduleIds): void
    {
        $moduleIds = array_values(array_unique(array_filter($moduleIds)));

        $this->moduleLinks()
            ->where('module_type', $moduleClass)
            ->whereNotIn('module_id', $moduleIds)
            ->delete();

        $existingIds = $this->moduleLinks()
            ->where('module_type', $moduleClass)
            ->pluck('module_id')
            ->all();

        $toAttach = array_diff($moduleIds, $existingIds);

        foreach ($toAttach as $moduleId) {
            $this->moduleLinks()->create([
                'module_type' => $moduleClass,
                'module_id' => $moduleId,
            ]);
        }
    }
}
