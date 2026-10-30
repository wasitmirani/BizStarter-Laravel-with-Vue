<?php

namespace App\Http\Controllers\Backend\Report;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function summary()
    {
        return responseJson('Report summary fetched successfully', [
            'users' => [
                'total' => User::count(),
                'active' => User::where('is_active', true)->count(),
                'inactive' => User::where('is_active', false)->count(),
            ],
            'roles' => Role::withCount('users')
                ->orderByDesc('users_count')
                ->get(['id', 'name'])
                ->map(fn (Role $role) => [
                    'name' => $role->name,
                    'users_count' => $role->users_count,
                ])
                ->values(),
            'permissions' => [
                'total' => Permission::count(),
            ],
        ], true);
    }

    public function users(Request $request): StreamedResponse
    {
        $query = User::query()->with('roles:id,name');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like);
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('name', $request->query('role')));
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->query('status') === 'active');
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->query('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->query('to'));
        }

        $filename = 'users-report-' . now()->format('Y-m-d-His') . '.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['ID', 'Name', 'Email', 'Roles', 'Status', 'Joined']);

            $query->orderBy('name')->chunk(500, function ($users) use ($handle) {
                foreach ($users as $user) {
                    fputcsv($handle, [
                        $user->id,
                        $user->name,
                        $user->email,
                        $user->roles->pluck('name')->implode(', '),
                        $user->is_active ? 'Active' : 'Inactive',
                        optional($user->created_at)->toDateString(),
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
