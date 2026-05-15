<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return[
            'first_name' => 'required',
            'last_name' => 'required',
            'name' => 'nullable',
            'email' => 'required|unique:users,email',
            'phone'=>'required|unique:users,phone',
            'thumbnail' => 'required',
            'role'=>'required|sometimes',
            'password' => 'required|confirmed',
            'address' => 'sometimes',
            'city' => 'sometimes',
            'state' => 'sometimes',
            'dob' => 'sometimes',
            'gender' => 'sometimes',
            'country_id' => 'nullable|exists:countries,id',
            'timezone_id' => 'nullable|exists:timezones,id',
            'language_id' => 'nullable|exists:languages,id',
        ];
    }
}
