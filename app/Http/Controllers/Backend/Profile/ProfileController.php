<?php

namespace App\Http\Controllers\Backend\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * The authenticated user's own profile.
     */
    public function show(Request $request)
    {
        $user = $request->user()->loadMissing('roles:id,name');

        return responseJson('Profile fetched successfully', [
            'user' => $this->present($user),
        ], true);
    }

    /**
     * Update the authenticated user's own account details.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->getKey()),
            ],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        DB::transaction(function () use ($user, $data) {
            $parts = preg_split('/\s+/', trim($data['name']), 2) ?: [];

            $user->forceFill([
                'name' => trim($data['name']),
                'first_name' => $parts[0] ?? null,
                'last_name' => $parts[1] ?? null,
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
            ])->save();
        });

        $user->refresh()->loadMissing('roles:id,name');

        return responseJson('Profile updated successfully', [
            'user' => $this->present($user),
        ], true);
    }

    private function present($user): array
    {
        return [
            'id' => $user->id,
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'thumbnail' => $user->thumbnail,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'roles' => $user->roles->map(fn ($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ])->values(),
        ];
    }
}
