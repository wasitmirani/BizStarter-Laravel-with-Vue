<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\LanguageQualificationRequest;
use App\Models\LanguageQualification;
use App\Services\Admissions\EligibilityEngine;
use Illuminate\Http\Request;

class LanguageQualificationController extends Controller
{
    public function __construct(protected EligibilityEngine $engine) {}

    public function index(Request $request)
    {
        return responseJson('Language qualifications fetched successfully', [
            'language_qualifications' => $request->user()->languageQualifications()->latest()->get(),
        ]);
    }

    public function store(LanguageQualificationRequest $request)
    {
        $record = $request->user()->languageQualifications()->create($request->validated());
        $this->engine->recalculateForUser($request->user());

        return responseJson('Language qualification added successfully', ['language_qualification' => $record], true, 201);
    }

    public function update(LanguageQualificationRequest $request, LanguageQualification $languageQualification)
    {
        $this->authorize('update', $languageQualification);
        $languageQualification->update($request->validated());
        $this->engine->recalculateForUser($request->user());

        return responseJson('Language qualification updated successfully', ['language_qualification' => $languageQualification->fresh()]);
    }

    public function destroy(Request $request, LanguageQualification $languageQualification)
    {
        $this->authorize('delete', $languageQualification);
        $languageQualification->delete();
        $this->engine->recalculateForUser($request->user());

        return responseJson('Language qualification deleted successfully');
    }
}
