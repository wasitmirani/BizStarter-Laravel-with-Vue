<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class ApiTokenService
{
    public function list(User $user): array
    {
        return $user->tokens()
            ->latest()
            ->get()
            ->map(fn (PersonalAccessToken $token) => [
                'id' => $token->id,
                'name' => $token->name,
                'abilities' => $token->abilities,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'expires_at' => $token->expires_at ?? null,
            ])
            ->all();
    }

    /**
     * @return array{token: string, access_token: array}
     */
    public function create(User $user, string $name, array $abilities = ['*'], ?int $expiresInDays = null): array
    {
        $name = trim($name);

        if ($user->tokens()->where('name', $name)->exists()) {
            throw ValidationException::withMessages([
                'name' => 'You already have a token with that name.',
            ]);
        }

        $expiresAt = $expiresInDays && $expiresInDays > 0
            ? now()->addDays($expiresInDays)
            : null;

        $token = $user->createToken($name, $abilities, $expiresAt);

        return [
            'token' => $token->plainTextToken,
            'access_token' => [
                'id' => $token->accessToken->id,
                'name' => $token->accessToken->name,
                'abilities' => $token->accessToken->abilities,
                'expires_at' => $token->accessToken->expires_at,
            ],
        ];
    }

    public function revoke(User $user, int $id): void
    {
        $deleted = $user->tokens()->whereKey($id)->delete();

        if (! $deleted) {
            throw ValidationException::withMessages([
                'token' => 'That token does not belong to your account.',
            ]);
        }
    }
}
