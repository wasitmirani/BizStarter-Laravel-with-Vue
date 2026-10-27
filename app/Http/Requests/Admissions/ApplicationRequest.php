<?php

namespace App\Http\Requests\Admissions;

use App\Models\UserApplication;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        $record = $this->route('application');

        return $this->user() !== null
            && (! $record || (int) $record->user_id === (int) $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'program_id' => [
                'required',
                'integer',
                'exists:programs,id',
                Rule::unique('user_applications', 'program_id')->where('user_id', $this->user()->id)->ignore($this->route('application')),
            ],
            'admission_call_id' => ['nullable', 'integer', 'exists:admission_calls,id'],
            'status' => ['nullable', Rule::in(UserApplication::STATUSES)],
            'priority' => ['nullable', 'in:low,medium,high'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
