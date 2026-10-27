<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\EducationRecordRequest;
use App\Models\EducationRecord;
use App\Services\Admissions\EligibilityEngine;
use Illuminate\Http\Request;

class EducationRecordController extends Controller
{
    public function __construct(protected EligibilityEngine $engine) {}

    public function index(Request $request)
    {
        return responseJson('Education records fetched successfully', [
            'education' => $request->user()->educations()->orderByDesc('graduation_year')->get(),
        ]);
    }

    public function store(EducationRecordRequest $request)
    {
        $record = $request->user()->educations()->create($request->validated());
        $this->engine->recalculateForUser($request->user());

        return responseJson('Education record added successfully', ['education' => $record], true, 201);
    }

    public function update(EducationRecordRequest $request, EducationRecord $education)
    {
        $this->authorize('update', $education);
        $education->update($request->validated());
        $this->engine->recalculateForUser($request->user());

        return responseJson('Education record updated successfully', ['education' => $education->fresh()]);
    }

    public function destroy(Request $request, EducationRecord $education)
    {
        $this->authorize('delete', $education);
        $education->delete();
        $this->engine->recalculateForUser($request->user());

        return responseJson('Education record deleted successfully');
    }
}
