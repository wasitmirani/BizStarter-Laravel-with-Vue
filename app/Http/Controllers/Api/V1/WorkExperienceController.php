<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\WorkExperienceRequest;
use App\Models\WorkExperience;
use App\Services\Admissions\EligibilityEngine;
use Illuminate\Http\Request;

class WorkExperienceController extends Controller
{
    public function __construct(protected EligibilityEngine $engine) {}

    public function index(Request $request)
    {
        return responseJson('Work experience fetched successfully', [
            'work_experiences' => $request->user()->workExperiences()->latest('start_date')->get(),
        ]);
    }

    public function store(WorkExperienceRequest $request)
    {
        $record = $request->user()->workExperiences()->create($request->validated());
        $this->engine->recalculateForUser($request->user());

        return responseJson('Work experience added successfully', ['work_experience' => $record], true, 201);
    }

    public function update(WorkExperienceRequest $request, WorkExperience $workExperience)
    {
        $this->authorize('update', $workExperience);
        $workExperience->update($request->validated());
        $this->engine->recalculateForUser($request->user());

        return responseJson('Work experience updated successfully', ['work_experience' => $workExperience->fresh()]);
    }

    public function destroy(Request $request, WorkExperience $workExperience)
    {
        $this->authorize('delete', $workExperience);
        $workExperience->delete();
        $this->engine->recalculateForUser($request->user());

        return responseJson('Work experience deleted successfully');
    }
}
