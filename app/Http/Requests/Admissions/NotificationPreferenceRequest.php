<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class NotificationPreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'email' => ['nullable', 'email', 'max:255'],
            'frequency' => ['nullable', 'in:daily,weekly,urgent_only,off'],
            'preferred_time' => ['nullable', 'date_format:H:i'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'reminder_windows' => ['nullable', 'array'],
            'reminder_windows.*' => ['integer', 'min:1', 'max:90'],
            'scholarship_alerts' => ['boolean'],
            'new_announcements' => ['boolean'],
            'eligibility_change_alerts' => ['boolean'],
            'slack_enabled' => ['boolean'],
            'slack_webhook_url' => ['nullable', 'url', 'max:500'],
        ];
    }
}
