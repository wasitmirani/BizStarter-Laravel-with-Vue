<?php

namespace App\Http\Controllers\Backend\Workspace;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\WorkspaceInvitation;
use App\Models\WorkspaceMember;
use App\Services\WorkspaceService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WorkspaceController extends Controller
{
    use ResolvesWorkspace;

    public function __construct(private readonly WorkspaceService $workspaces)
    {
    }

    public function show(Request $request)
    {
        $workspace = $this->workspace($request);

        return responseJson('Workspace fetched successfully', array_merge(
            $this->workspaces->summary($workspace),
            [
                'members' => $workspace->memberRecords()
                    ->with('user:id,uuid,name,email,thumbnail,is_active')
                    ->orderByRaw("case role when 'owner' then 0 when 'admin' then 1 else 2 end")
                    ->get()
                    ->map(fn (WorkspaceMember $member) => [
                        'id' => $member->id,
                        'role' => $member->role,
                        'joined_at' => $member->joined_at,
                        'is_owner' => (int) $member->user_id === (int) $workspace->owner_id,
                        'user' => $member->user,
                    ]),
                'invitations' => $workspace->invitations()
                    ->with('inviter:id,name,email')
                    ->get()
                    ->map(fn (WorkspaceInvitation $invitation) => [
                        'id' => $invitation->id,
                        'email' => $invitation->email,
                        'role' => $invitation->role,
                        'status' => $invitation->accepted_at ? 'accepted' : ($invitation->expires_at?->isPast() ? 'expired' : 'pending'),
                        'inviter' => $invitation->inviter,
                        'expires_at' => $invitation->expires_at,
                        'url' => url('/app/invitations/' . $invitation->token),
                        'created_at' => $invitation->created_at,
                    ]),
                'roles' => [
                    ['value' => 'admin', 'label' => 'Admin', 'description' => 'Manage members, billing and settings'],
                    ['value' => 'member', 'label' => 'Member', 'description' => 'Use the workspace and its features'],
                ],
            ]
        ), true);
    }

    public function update(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'currency' => ['nullable', 'string', 'size:3'],
            'timezone' => ['nullable', 'string', 'max:64'],
        ]);

        $workspace = $this->workspaces->update($workspace, $data);

        return responseJson('Workspace updated successfully', $this->workspaces->summary($workspace), true);
    }

    public function invite(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'role' => ['nullable', Rule::in(['admin', 'member'])],
        ]);

        $invitation = $this->workspaces->invite(
            $workspace,
            $request->user(),
            $data['email'],
            $data['role'] ?? 'member'
        );

        $mailed = $this->workspaces->sendInvitation($invitation);

        return responseJson('Invitation ready', [
            'invitation' => [
                'id' => $invitation->id,
                'email' => $invitation->email,
                'role' => $invitation->role,
                'status' => 'pending',
                'expires_at' => $invitation->expires_at,
                'url' => url('/app/invitations/' . $invitation->token),
                'mailed' => $mailed,
            ],
        ], true, 201);
    }

    public function revokeInvitation(Request $request, WorkspaceInvitation $invitation)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $this->workspaces->revokeInvitation($workspace, $invitation);

        return responseJson('Invitation revoked successfully', null, true);
    }

    public function acceptInvitation(Request $request, string $token)
    {
        $workspace = $this->workspaces->acceptInvitation($token, $request->user());

        return responseJson('Invitation accepted', $this->workspaces->summary($workspace), true);
    }

    public function updateMember(Request $request, WorkspaceMember $member)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $request->validate([
            'role' => ['required', Rule::in(['admin', 'member'])],
        ]);

        $member = $this->workspaces->changeRole($workspace, $member, $data['role']);

        return responseJson('Member role updated', [
            'member' => [
                'id' => $member->id,
                'role' => $member->role,
                'user' => $member->user,
            ],
        ], true);
    }

    public function removeMember(Request $request, WorkspaceMember $member)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $this->workspaces->removeMember($workspace, $member);

        return responseJson('Member removed successfully', null, true);
    }
}
