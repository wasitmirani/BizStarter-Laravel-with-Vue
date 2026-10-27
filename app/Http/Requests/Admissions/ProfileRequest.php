<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['nullable', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'size:2'],
            'country_of_residence' => ['nullable', 'string', 'size:2'],
            'applicant_category' => ['nullable', 'string', 'max:100'],
            'target_country' => ['nullable', 'string', 'size:2'],
            'target_intake_year' => ['nullable', 'integer', 'min:'.now()->year, 'max:'.(now()->year + 3)],
            'intended_level' => ['nullable', 'in:master,phd,postgraduate'],
            'preferred_language' => ['nullable', 'string', 'size:2'],
            'onboarding_step' => ['nullable', 'integer', 'between:1,6'],
            'complete' => ['nullable', 'boolean'],
        ];
    }
}
