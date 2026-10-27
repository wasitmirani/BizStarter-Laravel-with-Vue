<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ScholarshipResource;
use App\Models\Scholarship;
use Illuminate\Http\Request;

class ScholarshipController extends Controller
{
    public function index(Request $request)
    {
        $query = Scholarship::query()->with('calls');

        $query->when($request->filled('search'), function ($builder) use ($request) {
            $search = $request->string('search');
            $builder->where(function ($inner) use ($search) {
                $inner->where('name', 'like', "%{$search}%")
                    ->orWhere('provider', 'like', "%{$search}%");
            });
        })
            ->when($request->filled('region'), fn ($builder) => $builder->where('region', $request->string('region')))
            ->when($request->filled('type'), fn ($builder) => $builder->where('type', $request->string('type')))
            ->when($request->boolean('has_open_call'), fn ($builder) => $builder->whereHas('calls', fn ($calls) => $calls->whereDate('deadline', '>=', now()->toDateString())));

        $scholarships = $query->orderBy('name')->paginate((int) $request->input('per_page', 12));

        return responseJson('Scholarships fetched successfully', [
            'scholarships' => ScholarshipResource::collection($scholarships->items())->resolve(),
            'meta' => [
                'current_page' => $scholarships->currentPage(),
                'last_page' => $scholarships->lastPage(),
                'per_page' => $scholarships->perPage(),
                'total' => $scholarships->total(),
            ],
        ]);
    }

    public function show(Scholarship $scholarship)
    {
        $scholarship->load('calls');

        return responseJson('Scholarship fetched successfully', [
            'scholarship' => (new ScholarshipResource($scholarship))->resolve(),
        ]);
    }
}
