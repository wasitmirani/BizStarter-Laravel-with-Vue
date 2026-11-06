<?php

namespace App\Http\Controllers\Backend\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\DeviceHistory;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Workspace;
use App\Services\Crm\CrmService;
use App\Services\WorkspaceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    /**
     * Reporting windows supported by the dashboard selector.
     */
    private const RANGES = [7, 30, 90];

    public function index(Request $request)
    {
        $range = (int) $request->query('range', 30);
        if (!in_array($range, self::RANGES, true)) {
            $range = 30;
        }

        $now = now();
        $start = $now->copy()->subDays($range)->startOfDay();
        $previousStart = $now->copy()->subDays($range * 2)->startOfDay();

        $users = User::query();
        $totalUsers = (clone $users)->count();
        $activeUsers = (clone $users)->where('is_active', true)->count();
        $newUsers = (clone $users)->where('created_at', '>=', $start)->count();
        $previousNewUsers = (clone $users)
            ->whereBetween('created_at', [$previousStart, $start])
            ->count();

        $loginsThisPeriod = DeviceHistory::where('last_login_at', '>=', $start)->count();
        $loginsPreviousPeriod = DeviceHistory::whereBetween('last_login_at', [$previousStart, $start])->count();

        $stats = [
            'users' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'inactive' => max(0, $totalUsers - $activeUsers),
                'new_in_period' => $newUsers,
                'previous_period_new' => $previousNewUsers,
                'change_pct' => $this->percentageChange($newUsers, $previousNewUsers),
            ],
            'roles' => [
                'total' => Role::count(),
            ],
            'permissions' => [
                'total' => Permission::count(),
            ],
            'logins' => [
                'today' => DeviceHistory::whereDate('last_login_at', $now->toDateString())->count(),
                'in_period' => $loginsThisPeriod,
                'previous_period' => $loginsPreviousPeriod,
                'change_pct' => $this->percentageChange($loginsThisPeriod, $loginsPreviousPeriod),
            ],
            'activity' => [
                'in_period' => Activity::where('created_at', '>=', $start)->count(),
            ],
            'range' => [
                'days' => $range,
                'from' => $start->toDateString(),
                'to' => $now->toDateString(),
            ],
        ];

        $usersByDay = User::query()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as total'))
            ->where('created_at', '>=', $start)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

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

        $roleDistribution = Role::withCount('users')
            ->orderByDesc('users_count')
            ->limit(6)
            ->get(['id', 'name', 'uuid']);

        $recentActivity = Activity::with('causer:id,name,thumbnail')
            ->latest()
            ->limit(8)
            ->get(['id', 'description', 'event', 'subject_type', 'subject_id', 'causer_id', 'created_at']);

        $user = $request->user();

        $workspace = app(WorkspaceService::class)->ensureForUser($user);
        $crm = app(CrmService::class)->summary($workspace);

        return responseJson('Dashboard data fetched successfully', [
            'stats' => $stats,
            'crm' => $crm,
            'onboarding' => $this->onboarding($workspace),
            'recent_users' => $recentUsers,
            'recent_logins' => $recentLogins,
            'users_by_day' => $usersByDay,
            'role_distribution' => $roleDistribution,
            'recent_activity' => $recentActivity,
            'quick_actions' => [
                'create_user' => (bool) $user?->can('create-user'),
                'manage_roles' => (bool) $user?->can('roles-list'),
                'manage_permissions' => (bool) $user?->can('permissions-list'),
                'view_users' => (bool) $user?->can('users-list'),
                'view_user' => (bool) $user?->can('show-user'),
                'view_reports' => (bool) $user?->can('reports-list'),
                'view_activity' => (bool) $user?->can('activity-list'),
            ],
        ], true);
    }

    /**
     * A short, workspace-aware setup checklist so every new tenant has a
     * clear path from an empty workspace to a working shared inbox.
     */
    private function onboarding(Workspace $workspace): array
    {
        $owner = $workspace->owner_id;

        $steps = [
            [
                'key' => 'whatsapp',
                'label' => 'Connect WhatsApp',
                'description' => 'Link a WhatsApp Cloud API number to start receiving messages.',
                'done' => $workspace->whatsappAccount()->where('is_active', true)->exists(),
                'cta' => 'Connect',
                'route' => 'whatsapp-settings',
            ],
            [
                'key' => 'instagram',
                'label' => 'Connect Instagram',
                'description' => 'Add Instagram DMs to the same shared inbox.',
                'done' => $workspace->instagramAccount()->where('is_active', true)->exists(),
                'cta' => 'Connect',
                'route' => 'instagram-settings',
            ],
            [
                'key' => 'team',
                'label' => 'Invite your team',
                'description' => 'Add a teammate or send an invite link.',
                'done' => $workspace->memberRecords()->where('user_id', '!=', $owner)->exists()
                    || $workspace->invitations()
                        ->whereNull('accepted_at')
                        ->where('expires_at', '>', now())
                        ->exists(),
                'cta' => 'Invite',
                'route' => 'team',
            ],
            [
                'key' => 'contact',
                'label' => 'Add your first contact',
                'description' => 'Create a contact or wait for the first inbound message.',
                'done' => $workspace->contacts()->exists(),
                'cta' => 'Add contact',
                'route' => 'crm-contacts',
            ],
            [
                'key' => 'template',
                'label' => 'Create a message template',
                'description' => 'Templates are required for campaigns and quick replies.',
                'done' => $workspace->crmTemplates()->exists(),
                'cta' => 'Create template',
                'route' => 'crm-templates',
            ],
        ];

        $completed = count(array_filter($steps, fn (array $step) => $step['done']));
        $total = count($steps);

        return [
            'workspace_id' => $workspace->id,
            'completed' => $completed,
            'total' => $total,
            'percent' => $total > 0 ? (int) round($completed / $total * 100) : 100,
            'is_complete' => $completed === $total,
            'steps' => $steps,
        ];
    }

    /**
     * Percentage change between two periods.
     * Returns null when there is no previous-period baseline, so the UI
     * never displays a fabricated trend.
     */
    private function percentageChange(int $current, int $previous): ?float
    {
        if ($previous === 0) {
            return $current === 0 ? 0.0 : null;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }
}
