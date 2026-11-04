<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Resolve the route key (uuid or numeric id) to the user's primary key.
     */
    protected function userId(): ?int
    {
        $key = $this->route('user');

        if (is_object($key)) {
            return $key->id;
        }

        if ($key === null || $key === '') {
            return null;
        }

        if (is_numeric($key)) {
            return User::where('id', $key)->value('id');
        }

        return User::where('uuid', $key)->value('id');
    }

    /**
     * Every field is optional on update so an administrator can change a
     * single detail without having to resubmit the whole profile.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->userId();

        return [
            'first_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'last_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                Rule::unique('users', 'phone')->ignore($userId),
            ],
            'thumbnail' => ['sometimes', 'nullable', 'string', 'max:255'],
            'role' => ['sometimes', 'nullable', 'exists:roles,id'],
            'password' => ['sometimes', 'nullable', 'string', 'min:8', 'confirmed'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'state' => ['sometimes', 'nullable', 'string', 'max:255'],
            'zip_code' => ['sometimes', 'nullable', 'string', 'max:20'],
            'dob' => ['sometimes', 'nullable', 'date'],
            'gender' => ['sometimes', 'nullable', 'string', 'max:20'],
            'marital_status' => ['sometimes', 'nullable', 'string', 'max:20'],
            'country_id' => ['sometimes', 'nullable', 'exists:countries,id'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
