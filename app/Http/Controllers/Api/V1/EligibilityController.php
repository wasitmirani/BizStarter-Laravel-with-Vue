<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EligibilityAssessment;
use App\Services\Admissions\EligibilityEngine;
use Illuminate\Http\Request;

class EligibilityController extends Controller
{
    public function __construct(protected EligibilityEngine $engine) {}

    public function index(Request $request)
    {
        $query = $request->user()->eligibilityAssessments()
            ->with(['program.university', 'admissionCall'])
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($builder) use ($request) {
                $search = $request->string('search');
                $builder->whereHas('program', function ($program) use ($search) {
                    $program->where('title', 'like', "%{$search}%")
                        ->orWhere('subject_area', 'like', "%{$search}%")
                        ->orWhereHas('university', fn ($university) => $university->where('name', 'like', "%{$search}%"));
                });
            });

        $sort = $request->input('sort', 'score');
        $sort === 'deadline'
            ? $query->orderByRaw('CASE WHEN admission_call_id IS NULL THEN 1 ELSE 0 END')
            : $query->orderByDesc('score');

        $assessments = $query->paginate((int) $request->input('per_page', 12))->withQueryString();

        $bookmarkedIds = $request->user()->bookmarks()->pluck('program_id')->all();

        return responseJson('Eligibility matches fetched successfully', [
            'assessments' => $assessments->getCollection()
                ->map(fn (EligibilityAssessment $assessment) => $this->payload($assessment, $bookmarkedIds))
                ->values(),
            'counts' => $request->user()->eligibilityAssessments()
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'meta' => [
                'current_page' => $assessments->currentPage(),
                'last_page' => $assessments->lastPage(),
                'per_page' => $assessments->perPage(),
                'total' => $assessments->total(),
            ],
        ]);
    }

    public function reassess(Request $request)
    {
        $count = $this->engine->recalculateForUser($request->user());

        return responseJson('Eligibility recalculated successfully', ['assessed' => $count]);
    }

    private function payload(EligibilityAssessment $assessment, array $bookmarkedIds = []): array
    {
        return [
            'id' => $assessment->id,
            'status' => $assessment->status,
            'status_label' => $assessment->statusLabel(),
            'score' => $assessment->score,
            'matching_criteria' => $assessment->matching_criteria ?? [],
            'unmet_criteria' => $assessment->unmet_criteria ?? [],
            'unknown_criteria' => $assessment->unknown_criteria ?? [],
            'evidence_urls' => $assessment->evidence_urls ?? [],
            'next_action' => $assessment->next_action,
            'assessed_at' => $assessment->assessed_at?->toDateTimeString(),
            'program' => $assessment->program ? [
                'id' => $assessment->program->id,
                'title' => $assessment->program->title,
                'subject_area' => $assessment->program->subject_area,
                'language' => $assessment->program->language,
                'university' => $assessment->program->university?->name,
                'region' => $assessment->program->university?->region,
                'tuition' => $assessment->program->tuitionLabel(),
                'verification_status' => $assessment->program->verification_status,
                'source_url' => $assessment->program->source_url,
                'application_url' => $assessment->program->application_url,
                'bookmarked' => in_array($assessment->program->id, $bookmarkedIds, true),
            ] : null,
            'admission_call' => $assessment->admissionCall ? [
                'id' => $assessment->admissionCall->id,
                'intake_year' => $assessment->admissionCall->intake_year,
                'deadline' => $assessment->admissionCall->deadline?->toDateString(),
                'days_left' => $assessment->admissionCall->daysLeft(),
                'source_url' => $assessment->admissionCall->source_url,
            ] : null,
        ];
    }
}
