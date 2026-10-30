<?php

namespace App\Http\Controllers\Backend\Activity;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = max(1, min((int) $request->query('per_page', 20), 100));

        $activities = Activity::query()
            ->with('causer:id,name,thumbnail')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . strtolower((string) $request->query('search')) . '%';
                $query->whereRaw('LOWER(description) LIKE ?', [$search]);
            })
            ->when($request->filled('event'), function ($query) use ($request) {
                $query->where('event', $request->query('event'));
            })
            ->when($request->filled('from'), function ($query) use ($request) {
                $query->whereDate('created_at', '>=', $request->query('from'));
            })
            ->when($request->filled('to'), function ($query) use ($request) {
                $query->whereDate('created_at', '<=', $request->query('to'));
            })
            ->latest()
            ->paginate($perPage);

        return responseJson('Activity fetched successfully', [
            'activities' => $activities,
            'events' => Activity::query()
                ->whereNotNull('event')
                ->distinct()
                ->orderBy('event')
                ->pluck('event')
                ->values(),
        ], true);
    }
}
