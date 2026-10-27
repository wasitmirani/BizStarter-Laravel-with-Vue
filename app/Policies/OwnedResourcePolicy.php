<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

abstract class OwnedResourcePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Model $resource): bool
    {
        return $this->owns($user, $resource);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Model $resource): bool
    {
        return $this->owns($user, $resource);
    }

    public function delete(User $user, Model $resource): bool
    {
        return $this->owns($user, $resource);
    }

    public function restore(User $user, Model $resource): bool
    {
        return $this->owns($user, $resource);
    }

    public function forceDelete(User $user, Model $resource): bool
    {
        return $this->owns($user, $resource);
    }

    protected function owns(User $user, Model $resource): bool
    {
        return (int) $resource->getAttribute('user_id') === (int) $user->getKey();
    }
}
