<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use App\Models\University;
use App\Support\CountryName;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Program::query()
            ->with([
                'university',
                'admissionCalls',
                'assessments' => fn ($assessments) => $assessments->where('user_id', $user->id),
            ])
            ->withMin(['admissionCalls as next_deadline' => fn ($calls) => $calls->whereDate('deadline', '>=', now()->toDateString())], 'deadline');

        $query->when($request->filled('search'), function ($builder) use ($request) {
            $search = '%'.mb_strtolower(trim((string) $request->string('search'))).'%';
            $builder->where(function ($inner) use ($search) {
                $inner->whereRaw('LOWER(title) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(subject_area) LIKE ?', [$search])
                    ->orWhereHas('university', fn ($university) => $university->whereRaw('LOWER(name) LIKE ?', [$search]));
            });
        })
            ->when($request->filled('subject_area'), fn ($builder) => $builder->where('subject_area', $request->string('subject_area')))
            ->when($request->filled('language'), fn ($builder) => $builder->where('language', $request->string('language')))
            ->when($request->filled('country'), fn ($builder) => $builder->whereHas('university', fn ($university) => $university->where('country', strtoupper((string) $request->string('country')))))
            ->when($request->filled('region'), fn ($builder) => $builder->whereHas('university', fn ($university) => $university->where('region', $request->string('region'))))
            ->when($request->filled('university_id'), fn ($builder) => $builder->where('university_id', $request->integer('university_id')))
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->string('status')))
            ->when($request->filled('verification_status'), fn ($builder) => $builder->where('verification_status', $request->string('verification_status')))
            ->when($request->filled('max_tuition'), fn ($builder) => $builder->where(fn ($inner) => $inner->whereNull('tuition_max')->orWhere('tuition_max', '<=', $request->input('max_tuition'))))
            ->when($request->boolean('has_open_call'), fn ($builder) => $builder->whereHas('admissionCalls', fn ($calls) => $calls->where(fn ($open) => $open->whereDate('deadline', '>=', now()->toDateString())->orWhereNull('deadline'))));

        $today = now()->toDateString();
        $nextDeadline = '(select min(deadline) from admission_calls where admission_calls.program_id = programs.id and deadline >= ?)';

        $sort = $request->input('sort', 'deadline');
        match ($sort) {
            'tuition_asc' => $query->orderByRaw('COALESCE(tuition_min, tuition_max) asc'),
            'tuition_desc' => $query->orderByRaw('COALESCE(tuition_max, tuition_min) desc'),
            'title' => $query->orderBy('title'),
            default => $query
                ->orderByRaw("CASE WHEN {$nextDeadline} IS NULL THEN 1 ELSE 0 END", [$today])
                ->orderByRaw("{$nextDeadline} asc", [$today]),
        };

        $programs = $query->paginate((int) $request->input('per_page', 12))->withQueryString();

        $bookmarked = $user->bookmarks()->pluck('program_id')->all();
        $programs->getCollection()->each(
            fn (Program $program) => $program->setAttribute('bookmarked', in_array($program->id, $bookmarked, true)),
        );

        return responseJson('Programs fetched successfully', [
            'programs' => ProgramResource::collection($programs->items())->resolve(),
            'meta' => [
                'current_page' => $programs->currentPage(),
                'last_page' => $programs->lastPage(),
                'per_page' => $programs->perPage(),
                'total' => $programs->total(),
                'from' => $programs->firstItem(),
                'to' => $programs->lastItem(),
            ],
            'facets' => [
                'subject_areas' => Program::query()
                    ->whereNotNull('subject_area')
                    ->distinct()
                    ->orderBy('subject_area')
                    ->pluck('subject_area')
                    ->values(),
                'languages' => Program::query()
                    ->whereNotNull('language')
                    ->distinct()
                    ->orderBy('language')
                    ->pluck('language')
                    ->values(),
                'regions' => University::query()
                    ->whereNotNull('region')
                    ->distinct()
                    ->orderBy('region')
                    ->pluck('region')
                    ->values(),
                'countries' => University::query()
                    ->whereNotNull('country')
                    ->distinct()
                    ->orderBy('country')
                    ->pluck('country')
                    ->map(fn (string $code) => ['code' => $code, 'name' => CountryName::for($code) ?? $code])
                    ->sortBy('name')
                    ->values(),
            ],
        ]);
    }

    public function show(Request $request, Program $program)
    {
        $program->load([
            'university',
            'admissionCalls',
            'assessments' => fn ($assessments) => $assessments->where('user_id', $request->user()->id),
        ]);

        $program->setAttribute(
            'bookmarked',
            $request->user()->bookmarks()->where('program_id', $program->id)->exists(),
        );

        $related = Program::query()
            ->whereKeyNot($program->id)
            ->where(function ($query) use ($program) {
                $query->where('university_id', $program->university_id)
                    ->orWhere('subject_area', $program->subject_area);
            })
            ->with([
                'university',
                'admissionCalls',
                'assessments' => fn ($assessments) => $assessments->where('user_id', $request->user()->id),
            ])
            ->orderByRaw(
                'CASE WHEN university_id = ? THEN 0 ELSE 1 END',
                [$program->university_id],
            )
            ->orderBy('title')
            ->limit(4)
            ->get();

        return responseJson('Program fetched successfully', [
            'program' => (new ProgramResource($program))->resolve(),
            'related' => ProgramResource::collection($related)->resolve(),
        ]);
    }
}
