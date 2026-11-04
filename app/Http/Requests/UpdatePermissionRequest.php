<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePermissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionKey = $this->route('permission');

        if (is_object($permissionKey)) {
            $permissionId = $permissionKey->id;
        } elseif (is_numeric($permissionKey)) {
            $permissionId = (int) $permissionKey;
        } else {
            $permissionId = \App\Models\Permission::where('uuid', $permissionKey)->value('id');
        }

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('permissions', 'name')
                    ->where(fn ($q) => $q->where('guard_name', 'web'))
                    ->ignore($permissionId),
                function ($attribute, $value, $fail) {
                    if (strtolower($value) === 'super-admin') {
                        $fail('This permission is reserved.');
                    }
                },
            ],
            'users' => ['nullable', 'array'],
            'users.*' => ['integer', 'exists:users,id'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ];
    }
}
