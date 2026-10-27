<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Http\Resources\UniversityResource;
use App\Models\University;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function index(Request $request)
    {
        $query = University::query()->withCount('programs');

        $query->when($request->filled('search'), function ($builder) use ($request) {
            $search = '%'.mb_strtolower(trim((string) $request->string('search'))).'%';

            $builder->where(function ($inner) use ($search) {
                $inner->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(city) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(region) LIKE ?', [$search])
                    ->orWhereHas('programs', fn ($programs) => $programs->whereRaw('LOWER(title) LIKE ?', [$search]));
            });
        })
            ->when($request->filled('region'), fn ($builder) => $builder->where('region', $request->string('region')))
            ->when($request->filled('type'), fn ($builder) => $builder->where('type', $request->string('type')));

        match ($request->input('sort', 'name')) {
            'programs' => $query->orderByDesc('programs_count')->orderBy('name'),
            'region' => $query->orderBy('region')->orderBy('name'),
            'updated' => $query->orderByDesc('updated_at'),
            default => $query->orderBy('name'),
        };

        $universities = $query->paginate((int) $request->input('per_page', 12))->withQueryString();

        return responseJson('Universities fetched successfully', [
            'universities' => UniversityResource::collection($universities->items())->resolve(),
            'meta' => $this->meta($universities),
            'facets' => [
                'regions' => University::query()
                    ->whereNotNull('region')
                    ->distinct()
                    ->orderBy('region')
                    ->pluck('region')
                    ->values(),
                'types' => University::query()
                    ->distinct()
                    ->orderBy('type')
                    ->pluck('type')
                    ->values(),
            ],
        ]);
    }

    public function show(Request $request, University $university)
    {
        $university->loadCount('programs');
        $university->load([
            'programs' => fn ($query) => $query
                ->with(['university', 'admissionCalls', 'assessments' => fn ($assessments) => $assessments->where('user_id', $request->user()->id)])
                ->orderBy('title'),
        ]);

        return responseJson('University fetched successfully', [
            'university' => (new UniversityResource($university))->resolve(),
            'programs' => ProgramResource::collection($university->programs)->resolve(),
        ]);
    }

    private function meta($paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }
}
