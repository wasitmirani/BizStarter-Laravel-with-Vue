<?php

namespace App\Http\Controllers\Backend\Search;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $term = trim((string) $request->query('q', ''));

        if (mb_strlen($term) < 2) {
            return responseJson('Search term is too short', ['groups' => []], true);
        }

        $user = $request->user();
        $groups = [];
        $like = '%' . $term . '%';

        if ($user?->can('users-list') || $user?->can('show-user')) {
            $groups[] = [
                'key' => 'users',
                'label' => 'Users',
                'items' => User::query()
                    ->where(function ($query) use ($like) {
                        $query->where('name', 'like', $like)
                            ->orWhere('email', 'like', $like)
                            ->orWhere('first_name', 'like', $like)
                            ->orWhere('last_name', 'like', $like);
                    })
                    ->orderBy('name')
                    ->limit(5)
                    ->get(['id', 'uuid', 'name', 'email', 'thumbnail', 'is_active'])
                    ->map(fn (User $result) => [
                        'id' => $result->uuid ?? $result->id,
                        'title' => $result->name,
                        'subtitle' => $result->email,
                        'thumbnail' => $result->thumbnail,
                        'status' => $result->is_active ? 'Active' : 'Inactive',
                    ])
                    ->values()
                    ->all(),
            ];
        }

        if ($user?->can('roles-list')) {
            $groups[] = [
                'key' => 'roles',
                'label' => 'Roles',
                'items' => Role::query()
                    ->where('name', 'like', $like)
                    ->orderBy('name')
                    ->limit(5)
                    ->get(['id', 'uuid', 'name'])
                    ->map(fn (Role $role) => [
                        'id' => $role->uuid ?? $role->id,
                        'title' => $role->name,
                        'subtitle' => 'Role',
                    ])
                    ->values()
                    ->all(),
            ];
        }

        if ($user?->can('permissions-list')) {
            $groups[] = [
                'key' => 'permissions',
                'label' => 'Permissions',
                'items' => Permission::query()
                    ->where('name', 'like', $like)
                    ->orderBy('name')
                    ->limit(5)
                    ->get(['id', 'name'])
                    ->map(fn (Permission $permission) => [
                        'id' => $permission->id,
                        'title' => $permission->name,
                        'subtitle' => 'Permission',
                    ])
                    ->values()
                    ->all(),
            ];
        }

        $groups = array_values(array_filter($groups, fn (array $group) => count($group['items']) > 0));

        return responseJson('Search completed', ['groups' => $groups], true);
    }
}
