<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class EducationRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        $record = $this->route('education');

        return $this->user() !== null
            && (! $record || (int) $record->user_id === (int) $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'qualification_title' => ['required', 'string', 'max:255'],
            'degree_level' => ['required', 'in:high_school,bachelor,master,phd,other'],
            'institution_name' => ['required', 'string', 'max:255'],
            'institution_country' => ['nullable', 'string', 'size:2'],
            'graduation_year' => ['nullable', 'integer', 'min:1950', 'max:'.(now()->year + 1)],
            'grading_system' => ['required', 'in:percentage,gpa,other'],
            'grade_value' => ['nullable', 'numeric', 'min:0'],
            'grade_max' => ['nullable', 'numeric', 'gt:0'],
            'transcript_available' => ['boolean'],
            'certificate_available' => ['boolean'],
            'prerequisite_subjects' => ['nullable', 'array'],
            'prerequisite_subjects.*' => ['string', 'max:120'],
        ];
    }
}
