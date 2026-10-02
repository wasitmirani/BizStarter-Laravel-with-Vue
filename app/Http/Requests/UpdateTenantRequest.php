<?php

namespace App\Http\Requests;

use App\Enums\TenantStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tenantId = $this->route('tenant');
        $tenantId = is_object($tenantId) ? $tenantId->getKey() : $tenantId;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'domain' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('domains', 'domain')->where(function ($query) use ($tenantId) {
                    return $query->where('tenant_id', '!=', $tenantId);
                }),
            ],
            'status' => ['nullable', Rule::in(TenantStatusEnum::values())],
            'logo' => ['nullable', 'string', 'max:255'],
            'primary_color' => ['nullable', 'string', 'max:32'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'locale' => ['nullable', 'string', 'max:16'],
        ];
    }
}
