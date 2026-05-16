<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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

                // ✅ tenant-wise unique (excluding current role)
                Rule::unique('roles', 'name')
                    ->where(fn ($q) =>
                        $q->where('tenant_id', auth()->user()->tenant_id)
                    )
                    ->ignore($this->route('role')),
            ],

            'users' => ['nullable', 'array'],

            'users.*' => [
                'exists:users,id'
            ],

            'permissions' => ['nullable', 'array'],

            'permissions.*' => [
                'exists:permissions,id'
            ],
        ];
    }
}
