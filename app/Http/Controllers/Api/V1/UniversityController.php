<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Http\Resources\UniversityResource;
use App\Models\AdmissionCall;
use App\Models\Program;
use App\Models\University;
use App\Support\CountryName;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function index(Request $request)
    {
        $query = University::query()->withCount('programs')->with('officialSources');

        $query->when($request->filled('search'), function ($builder) use ($request) {
            $term = trim((string) $request->string('search'));
            $search = '%'.mb_strtolower($term).'%';

            // "Germany" should match the stored ISO code too.
            $matchedCountry = collect(CountryName::NAMES)
                ->search(fn (string $name) => str_contains(mb_strtolower($name), mb_strtolower($term)));

            $builder->where(function ($inner) use ($search, $matchedCountry) {
                $inner->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(city) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(region) LIKE ?', [$search])
                    ->orWhereHas('programs', fn ($programs) => $programs->whereRaw('LOWER(title) LIKE ?', [$search]));

                if ($matchedCountry) {
                    $inner->orWhere('country', $matchedCountry);
                }
            });
        })
            ->when($request->filled('country'), fn ($builder) => $builder->where('country', strtoupper((string) $request->string('country'))))
            ->when($request->filled('region'), fn ($builder) => $builder->where('region', $request->string('region')))
            ->when($request->filled('city'), fn ($builder) => $builder->where('city', $request->string('city')))
            ->when($request->filled('type'), fn ($builder) => $builder->where('type', $request->string('type')));

        match ($request->input('sort', 'name')) {
            'programs' => $query->orderByDesc('programs_count')->orderBy('name'),
            'region' => $query->orderBy('country')->orderBy('region')->orderBy('name'),
            'updated' => $query->orderByDesc('updated_at'),
            default => $query->orderBy('name'),
        };

        $universities = $query->paginate((int) $request->input('per_page', 12))->withQueryString();

        $countryCodes = University::query()
            ->whereNotNull('country')
            ->distinct()
            ->orderBy('country')
            ->pluck('country')
            ->values();

        return responseJson('Universities fetched successfully', [
            'universities' => UniversityResource::collection($universities->items())->resolve(),
            'meta' => $this->meta($universities),
            'facets' => [
                'countries' => $countryCodes
                    ->map(fn (string $code) => ['code' => $code, 'name' => CountryName::for($code) ?? $code])
                    ->sortBy('name')
                    ->values(),
                'regions' => University::query()
                    ->whereNotNull('region')
                    ->distinct()
                    ->orderBy('region')
                    ->pluck('region')
                    ->values(),
                'cities' => University::query()
                    ->whereNotNull('city')
                    ->distinct()
                    ->orderBy('city')
                    ->pluck('city')
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
            'officialSources',
            'programs' => fn ($query) => $query
                ->with(['university', 'admissionCalls', 'assessments' => fn ($assessments) => $assessments->where('user_id', $request->user()->id)])
                ->orderBy('title'),
        ]);

        return responseJson('University fetched successfully', [
            'university' => (new UniversityResource($university))->resolve(),
            'programs' => ProgramResource::collection($university->programs)->resolve(),
            'stats' => $this->stats($university),
        ]);
    }

    /**
     * Catalog-derived summary shown on the university detail page.
     * Only counts what is stored; nothing is inferred.
     */
    private function stats(University $university): array
    {
        $programs = $university->programs;
        $today = now()->startOfDay();

        $openCalls = $programs->filter(
            fn (Program $program) => $program->admissionCalls->contains(
                fn (AdmissionCall $call) => $call->deadline === null || ! $call->deadline->lt($today),
            ),
        );

        $nextDeadline = $programs
            ->flatMap(fn (Program $program) => $program->admissionCalls)
            ->filter(fn (AdmissionCall $call) => $call->deadline !== null && ! $call->deadline->lt($today))
            ->min('deadline');

        $tuitionMin = $programs
            ->map(fn (Program $program) => $program->tuition_min ?? $program->tuition_max)
            ->filter(fn ($value) => $value !== null)
            ->min();

        return [
            'programs' => $programs->count(),
            'open_calls' => $openCalls->count(),
            'subject_areas' => $programs->pluck('subject_area')->filter()->unique()->sort()->values(),
            'languages' => $programs->pluck('language')->filter()->unique()->sort()->values(),
            'next_deadline' => $nextDeadline?->toDateString(),
            'tuition_from' => $tuitionMin !== null ? (float) $tuitionMin : null,
            'currency' => $programs->first()?->currency ?? 'EUR',
        ];
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
