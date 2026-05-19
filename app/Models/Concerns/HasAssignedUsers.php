<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasAssignedUsers
{
    public function assignedUsers(): MorphToMany
    {
        return $this->morphToMany(User::class, 'module', 'module_has_users');
    }
}
