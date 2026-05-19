<?php

namespace App\Http\Requests;

use App\Enums\DriverStatusEnum;
use App\Enums\DriverTypeEnum;
use App\Models\Driver;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDriverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = Driver::query()->find($this->route('driver'))?->user_id;

        return [
            'full_name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in(array_column(DriverTypeEnum::cases(), 'value'))],
            'profile_image' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30', Rule::unique('users', 'phone')->ignore($userId)],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'cnic' => ['nullable', 'string', 'max:50'],
            'license_number' => ['nullable', 'string', 'max:100'],
            'license_expiry_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'joining_date' => ['nullable', 'date'],
            'status' => ['nullable', 'string', Rule::in(array_column(DriverStatusEnum::cases(), 'value'))],
            'warehouse_ids' => ['nullable', 'array'],
            'warehouse_ids.*' => ['integer', 'exists:warehouses,id'],
        ];
    }
}
