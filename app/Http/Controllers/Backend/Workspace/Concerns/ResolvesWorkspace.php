<?php

namespace App\Http\Controllers\Backend\Workspace\Concerns;

use App\Models\Workspace;
use App\Services\WorkspaceService;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

trait ResolvesWorkspace
{
    protected function workspace(Request $request): Workspace
    {
        $workspace = app(WorkspaceService::class)->ensureForUser($request->user());

        $this->authorizeMembership($request, $workspace);

        return $workspace;
    }

    protected function authorizeMembership(Request $request, Workspace $workspace): void
    {
        $user = $request->user();

        if ((int) $workspace->owner_id === (int) $user->id) {
            return;
        }

        if ($workspace->memberRecords()->where('user_id', $user->id)->exists()) {
            return;
        }

        if ($user->hasAnyRole(['super-admin', 'admin'])) {
            return;
        }

        throw new AccessDeniedHttpException('You do not have access to this workspace.');
    }

    protected function authorizeManagement(Request $request, Workspace $workspace): void
    {
        $user = $request->user();

        if ((int) $workspace->owner_id === (int) $user->id) {
            return;
        }

        $role = $workspace->memberRecords()->where('user_id', $user->id)->value('role');

        if (in_array($role, ['owner', 'admin'], true)) {
            return;
        }

        if ($user->hasAnyRole(['super-admin', 'admin'])) {
            return;
        }

        throw new AccessDeniedHttpException('Only workspace owners and admins can do that.');
    }
}
