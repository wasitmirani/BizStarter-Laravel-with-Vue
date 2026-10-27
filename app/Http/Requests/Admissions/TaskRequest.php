<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        $record = $this->route('task');

        return $this->user() !== null
            && (! $record || (int) $record->user_id === (int) $this->user()->id);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'due_date' => ['nullable', 'date'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'status' => ['nullable', 'in:pending,in_progress,done'],
            'user_application_id' => ['nullable', 'integer', 'exists:user_applications,id'],
        ];
    }
}
