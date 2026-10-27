<?php

namespace App\Http\Requests\Admissions;

use Illuminate\Foundation\Http\FormRequest;

class DocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:cv,transcript,degree,language,passport,recommendation,other'],
            'name' => ['nullable', 'string', 'max:255'],
            'user_application_id' => ['nullable', 'integer', 'exists:user_applications,id'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'],
        ];
    }
}
