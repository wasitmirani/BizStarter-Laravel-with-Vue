<?php

namespace App\Http\Controllers\Backend\Workspace;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Workspace;
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

    public function index(Request $request)
    {
        $user = $request->user();
        $current = $this->workspaces->forUser($user);

        return responseJson('Workspaces fetched successfully', [
            'current_id' => $current?->id,
            'workspaces' => $this->workspaces->availableFor($user)
                ->map(fn (Workspace $workspace) => $this->workspaceCard($workspace, $user, $current?->id))
                ->values(),
        ], true);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
        ]);

        $workspace = $this->workspaces->provision($request->user(), $data['name']);

        return responseJson('Workspace created successfully', [
            'workspace' => $this->workspaceCard($workspace, $request->user()),
        ], true, 201);
    }

    public function switchCurrent(Request $request)
    {
        $data = $request->validate([
            'workspace_id' => ['required', 'integer'],
        ]);

        $workspace = Workspace::findOrFail($data['workspace_id']);
        $this->workspaces->switchTo($request->user(), $workspace);

        return responseJson('Workspace switched successfully', array_merge(
            $this->workspaces->summary($workspace),
            ['current_id' => $workspace->id]
        ), true);
    }

    public function leave(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->workspaces->leave($workspace, $request->user());

        return responseJson('You left the workspace', null, true);
    }

    public function destroy(Request $request)
    {
        $workspace = $this->workspace($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
        ]);

        $this->workspaces->delete($workspace, $request->user(), $data['name']);

        return responseJson('Workspace deleted successfully', null, true);
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

    /**
     * Small workspace payload for the switcher menu.
     */
    protected function workspaceCard(Workspace $workspace, User $user, ?int $currentId = null): array
    {
        $role = (int) $workspace->owner_id === (int) $user->id
            ? 'owner'
            : ($workspace->memberRecords()->where('user_id', $user->id)->value('role') ?? 'member');

        $currentId ??= $user->current_workspace_id;

        return [
            'id' => $workspace->id,
            'name' => $workspace->name,
            'slug' => $workspace->slug,
            'role' => $role,
            'plan' => $workspace->plan()?->name,
            'members_count' => $workspace->memberRecords()->count(),
            'is_current' => (int) $currentId === (int) $workspace->id,
            'created_at' => $workspace->created_at,
        ];
    }
}
