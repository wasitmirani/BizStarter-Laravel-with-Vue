<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Http\Resources\ScholarshipResource;
use App\Models\AdmissionCall;
use App\Models\EligibilityAssessment;
use App\Models\Scholarship;
use App\Models\SourceSnapshot;
use App\Services\Admissions\ProfileCompletionService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(protected ProfileCompletionService $completion) {}

    public function index(Request $request)
    {
        $user = $request->user();

        $assessments = $user->eligibilityAssessments()
            ->with(['program.university', 'admissionCall'])
            ->get();

        $counts = [
            'likely_eligible' => $assessments->where('status', EligibilityAssessment::LIKELY_ELIGIBLE)->count(),
            'potential_match' => $assessments->where('status', EligibilityAssessment::POTENTIAL_MATCH)->count(),
            'ambitious' => $assessments->where('status', EligibilityAssessment::AMBITIOUS)->count(),
            'insufficient_evidence' => $assessments->where('status', EligibilityAssessment::INSUFFICIENT_EVIDENCE)->count(),
            'not_eligible' => $assessments->where('status', EligibilityAssessment::NOT_ELIGIBLE)->count(),
        ];

        $recommended = $assessments
            ->whereIn('status', [
                EligibilityAssessment::LIKELY_ELIGIBLE,
                EligibilityAssessment::POTENTIAL_MATCH,
            ])
            ->sortByDesc('score')
            ->take(6)
            ->values()
            ->map(fn (EligibilityAssessment $assessment) => $this->assessmentPayload($assessment));

        $openCalls = AdmissionCall::with(['program.university'])
            ->whereDate('deadline', '>=', now()->toDateString())
            ->orderBy('deadline')
            ->limit(6)
            ->get()
            ->map(fn (AdmissionCall $call) => [
                'id' => $call->id,
                'program_id' => $call->program_id,
                'program' => $call->program?->title,
                'university' => $call->program?->university?->name,
                'intake_year' => $call->intake_year,
                'deadline' => $call->deadline?->toDateString(),
                'days_left' => $call->daysLeft(),
                'source_url' => $call->source_url,
                'verification_status' => $call->verification_status,
                'is_sample' => $call->is_sample,
            ]);

        $scholarships = Scholarship::with('calls')
            ->whereHas('calls', fn ($query) => $query->whereDate('deadline', '>=', now()->toDateString()))
            ->orderBy('name')
            ->limit(4)
            ->get();

        $applications = $user->applications()
            ->with(['program.university', 'documents'])
            ->withCount('documents')
            ->latest()
            ->limit(5)
            ->get();

        $tasks = $user->tasks()
            ->where('status', '!=', 'done')
            ->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END')
            ->orderBy('due_date')
            ->limit(6)
            ->get();

        $documents = $user->documents()->latest()->limit(5)->get();

        $bookmarks = $user->bookmarks()
            ->with([
                'program.university',
                'program.assessments' => fn ($query) => $query->where('user_id', $user->id),
                'program.admissionCalls',
            ])
            ->latest()
            ->limit(4)
            ->get()
            ->pluck('program')
            ->filter();

        $recentChanges = SourceSnapshot::with('source')
            ->latest('captured_at')
            ->limit(5)
            ->get()
            ->map(fn (SourceSnapshot $snapshot) => [
                'source' => $snapshot->source?->name,
                'url' => $snapshot->source?->url,
                'http_status' => $snapshot->http_status,
                'captured_at' => $snapshot->captured_at?->toDateTimeString(),
                'changed' => $snapshot->payload_excerpt !== null,
            ]);

        $latestReport = $user->dailyReports()->latest('report_date')->first();

        return responseJson('Dashboard data fetched successfully', [
            'profile_completion' => $this->completion->forUser($user),
            'counts' => $counts,
            'recommended' => $recommended,
            'open_calls' => $openCalls,
            'scholarships' => ScholarshipResource::collection($scholarships)->resolve(),
            'applications' => ApplicationResource::collection($applications)->resolve(),
            'tasks' => $tasks,
            'documents' => $documents,
            'bookmarks' => $bookmarks->map(fn ($program) => [
                'id' => $program->id,
                'title' => $program->title,
                'university' => $program->university?->name,
                'subject_area' => $program->subject_area,
                'assessment' => $program->assessments->first()?->status,
            ])->values(),
            'recent_changes' => $recentChanges,
            'latest_report' => $latestReport ? [
                'id' => $latestReport->id,
                'report_date' => $latestReport->report_date?->toDateString(),
                'summary' => $latestReport->summary,
            ] : null,
            'meta' => [
                'assessments_total' => $assessments->count(),
                'last_assessed_at' => $assessments->max('assessed_at'),
            ],
        ]);
    }

    private function assessmentPayload(EligibilityAssessment $assessment): array
    {
        $program = $assessment->program;

        return [
            'id' => $assessment->id,
            'status' => $assessment->status,
            'status_label' => $assessment->statusLabel(),
            'score' => $assessment->score,
            'next_action' => $assessment->next_action,
            'matching_count' => count($assessment->matching_criteria ?? []),
            'unmet_count' => count($assessment->unmet_criteria ?? []),
            'unknown_count' => count($assessment->unknown_criteria ?? []),
            'program' => $program ? [
                'id' => $program->id,
                'title' => $program->title,
                'subject_area' => $program->subject_area,
                'language' => $program->language,
                'university' => $program->university?->name,
                'region' => $program->university?->region,
                'tuition' => $program->tuitionLabel(),
                'deadline' => $assessment->admissionCall?->deadline?->toDateString(),
                'days_left' => $assessment->admissionCall?->daysLeft(),
                'verification_status' => $program->verification_status,
                'source_url' => $program->source_url,
            ] : null,
        ];
    }
}
