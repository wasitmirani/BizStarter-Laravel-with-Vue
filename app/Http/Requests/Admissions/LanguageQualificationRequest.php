<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class LanguageQualificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $record = $this->route('language_qualification');

        return $this->user() !== null
            && (! $record || (int) $record->user_id === (int) $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'language' => ['required', 'string', 'size:2'],
            'test_type' => ['required', 'in:ielts,toefl,moi,cambridge,pte,duolingo,other'],
            'score' => ['nullable', 'numeric', 'min:0'],
            'score_max' => ['nullable', 'numeric', 'gt:0'],
            'certificate_available' => ['boolean'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after:issue_date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
