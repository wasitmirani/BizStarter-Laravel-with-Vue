<?php

namespace App\Http\Controllers\Backend\Security;

use App\Http\Controllers\Controller;
use App\Services\ApiTokenService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApiTokenController extends Controller
{
    public function __construct(private readonly ApiTokenService $tokens)
    {
    }

    public function index(Request $request)
    {
        return responseJson('Tokens fetched successfully', [
            'tokens' => $this->tokens->list($request->user()),
            'abilities' => [
                ['value' => '*', 'label' => 'Full access'],
                ['value' => 'read', 'label' => 'Read only'],
            ],
        ], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'abilities' => ['nullable', 'array'],
            'abilities.*' => [Rule::in(['*', 'read', 'write'])],
            'expires_in_days' => ['nullable', 'integer', 'min:0', 'max:3650'],
        ]);

        $result = $this->tokens->create(
            $request->user(),
            $data['name'],
            $data['abilities'] ?? ['*'],
            $data['expires_in_days'] ?? null
        );

        return responseJson('Token created successfully', $result, true, 201);
    }

    public function destroy(Request $request, int $token)
    {
        $this->tokens->revoke($request->user(), $token);

        return responseJson('Token revoked successfully', null, true);
    }
}
