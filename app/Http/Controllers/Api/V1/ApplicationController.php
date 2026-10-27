<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\ApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\AuditLog;
use App\Models\UserApplication;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $applications = $request->user()->applications()
            ->with(['program.university', 'program.admissionCalls', 'admissionCall', 'documents'])
            ->withCount('documents')
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->string('status')))
            ->latest()
            ->paginate((int) $request->input('per_page', 12));

        return responseJson('Applications fetched successfully', [
            'applications' => ApplicationResource::collection($applications->items())->resolve(),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ],
        ]);
    }

    public function store(ApplicationRequest $request)
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? 'planned';

        if ($data['status'] === 'submitted') {
            $data['submitted_at'] = now();
        }

        $application = $request->user()->applications()->create($data);
        AuditLog::record('application.created', $application);

        return responseJson(
            'Application created successfully',
            ['application' => (new ApplicationResource($application->load('program.university')))->resolve()],
            true,
            201,
        );
    }

    public function show(Request $request, UserApplication $application)
    {
        $this->authorize('view', $application);

        $application->load(['program.university', 'program.admissionCalls', 'admissionCall', 'documents', 'tasks']);

        return responseJson('Application fetched successfully', [
            'application' => (new ApplicationResource($application))->resolve(),
        ]);
    }

    public function update(ApplicationRequest $request, UserApplication $application)
    {
        $this->authorize('update', $application);

        $data = $request->validated();

        if (($data['status'] ?? null) === 'submitted' && $application->submitted_at === null) {
            $data['submitted_at'] = now();
        }

        if (in_array($data['status'] ?? null, ['offer', 'rejected'], true)) {
            $data['decision_at'] = $data['decision_at'] ?? now();
        }

        $application->update($data);
        AuditLog::record('application.updated', $application, ['status' => $application->status]);

        return responseJson('Application updated successfully', [
            'application' => (new ApplicationResource($application->fresh()->load('program.university', 'documents')))->resolve(),
        ]);
    }

    public function destroy(Request $request, UserApplication $application)
    {
        $this->authorize('delete', $application);
        $application->delete();

        return responseJson('Application deleted successfully');
    }
}
