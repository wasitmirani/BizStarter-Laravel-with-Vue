<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->user(); // ✅ works for API guard too

        return [
            'name' => [
                'required',
                'string',
                'max:255',

                // block super-admin
                function ($attribute, $value, $fail) {
                    if (strtolower($value) === 'super-admin') {
                        $fail('This role is reserved.');
                    }
                },

                // tenant-wise unique
                Rule::unique('roles', 'name')
                    ->where(fn ($q) => $q->where('tenant_id', $user?->tenant_id)),
            ],

            'users' => ['required', 'array'],

            'users.*' => [
                // 'integer',
                Rule::exists('users', 'id')
                    ->where(fn ($q) => $q->where('tenant_id', $user?->tenant_id)),
            ],

            'permissions' => ['nullable', 'array'],

            'permissions.*' => [
                // 'integer',
                'exists:permissions,id',
            ],
        ];
    }
}