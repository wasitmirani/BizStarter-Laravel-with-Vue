<?php

namespace App\Http\Controllers\Backend\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DeviceHistory;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $now = now();
        $weekAgo = $now->copy()->subDays(7);
        $monthAgo = $now->copy()->subDays(30);

        $stats = [
            'users' => [
                'total' => User::count(),
                'active' => User::where('is_active', true)->count(),
                'inactive' => User::where('is_active', false)->count(),
                'new_this_week' => User::where('created_at', '>=', $weekAgo)->count(),
            ],
            'roles' => [
                'total' => Role::count(),
            ],
            'permissions' => [
                'total' => Permission::count(),
            ],
            'logins' => [
                'today' => DeviceHistory::whereDate('last_login_at', $now->toDateString())->count(),
                'this_week' => DeviceHistory::where('last_login_at', '>=', $weekAgo)->count(),
            ],
        ];

        $recentUsers = User::with('roles:id,name')
            ->latest()
            ->limit(6)
            ->get(['id', 'uuid', 'name', 'email', 'thumbnail', 'is_active', 'created_at']);

        $recentLogins = DeviceHistory::with('user:id,uuid,name,email,thumbnail')
            ->latest('last_login_at')
            ->limit(8)
            ->get([
                'id',
                'user_id',
                'device_name',
                'browser',
                'platform',
                'device_type',
                'ip_address',
                'last_login_at',
            ]);

        $usersByDay = User::query()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as total'))
            ->where('created_at', '>=', $monthAgo)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        $roleDistribution = Role::withCount('users')
            ->orderByDesc('users_count')
            ->limit(6)
            ->get(['id', 'name', 'uuid']);

        return responseJson('Dashboard data fetched successfully', [
            'stats' => $stats,
            'recent_users' => $recentUsers,
            'recent_logins' => $recentLogins,
            'users_by_day' => $usersByDay,
            'role_distribution' => $roleDistribution,
        ], true);
    }
}
