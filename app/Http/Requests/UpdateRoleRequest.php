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
        $roleKey = $this->route('role');

        if (is_object($roleKey)) {
            $roleId = $roleKey->id;
        } elseif (is_numeric($roleKey)) {
            $roleId = (int) $roleKey;
        } else {
            $roleId = \App\Models\Role::where('uuid', $roleKey)->value('id');
        }

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')
                    ->where(fn ($q) => $q->where('guard_name', 'web'))
                    ->ignore($roleId),
                function ($attribute, $value, $fail) {
                    if (strtolower($value) === 'super-admin') {
                        $fail('This role is reserved.');
                    }
                },
            ],
            'users' => ['nullable', 'array'],
            'users.*' => ['integer', 'exists:users,id'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ];
    }
}
