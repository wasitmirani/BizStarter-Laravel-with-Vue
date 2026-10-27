<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class StudyPreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'subject_areas' => ['nullable', 'array'],
            'subject_areas.*' => ['string', 'max:120'],
            'preferred_universities' => ['nullable', 'array'],
            'preferred_universities.*' => ['string', 'max:255'],
            'preferred_regions' => ['nullable', 'array'],
            'preferred_regions.*' => ['string', 'max:120'],
            'institution_type' => ['nullable', 'in:any,public,private'],
            'max_tuition' => ['nullable', 'numeric', 'min:0'],
            'application_budget' => ['nullable', 'numeric', 'min:0'],
            'needs_scholarship' => ['boolean'],
            'preferred_scholarship_types' => ['nullable', 'array'],
            'preferred_scholarship_types.*' => ['string', 'max:120'],
            'min_relevance' => ['nullable', 'in:low,medium,high'],
            'deadline_preference' => ['nullable', 'in:any,early,flexible'],
        ];
    }
}
