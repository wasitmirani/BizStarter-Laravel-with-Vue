<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\StudyPreferenceRequest;
use App\Models\StudyPreference;
use App\Services\Admissions\EligibilityEngine;
use Illuminate\Http\Request;

class StudyPreferenceController extends Controller
{
    public function __construct(protected EligibilityEngine $engine) {}

    public function show(Request $request)
    {
        return responseJson('Study preferences fetched successfully', [
            'study_preferences' => StudyPreference::firstOrCreate(['user_id' => $request->user()->id]),
        ]);
    }

    public function update(StudyPreferenceRequest $request)
    {
        $preferences = StudyPreference::firstOrCreate(['user_id' => $request->user()->id]);
        $preferences->update($request->validated());
        $this->engine->recalculateForUser($request->user());

        return responseJson('Study preferences updated successfully', [
            'study_preferences' => $preferences->fresh(),
        ]);
    }
}
