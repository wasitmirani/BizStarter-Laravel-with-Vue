<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class WorkExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $record = $this->route('work_experience');

        return $this->user() !== null
            && (! $record || (int) $record->user_id === (int) $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'job_title' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'size:2'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_current' => ['boolean'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:120'],
            'description' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
