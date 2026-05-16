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
        return [
            'name' => [
                'required',
                'string',
                'max:255',

                // ❌ block super-admin
                function ($attribute, $value, $fail) {
                    if (strtolower($value) === 'super-admin') {
                        $fail('This role is reserved.');
                    }
                },

                ✅ tenant-wise unique
                Rule::unique('roles', 'name')
                    ->where(fn ($q) =>
                        $q->where('tenant_id', auth()->user()->tenant_id)
                    ),
            ],

            'users' => ['required', 'array'],

            ✅ tenant-safe users
            'users.*' => [
                'integer',
                Rule::exists('users', 'id')
                    ->where(fn ($q) =>
                        $q->where('tenant_id', auth()->user()->tenant_id ?? 1)
                    ),
            ],

            'permissions' => ['nullable', 'array'],

            'permissions.*' => [
                'integer',
                'exists:permissions,id'
            ],
        ];
    }
}