<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Models\WorkspaceMember;
use App\Mail\WorkspaceInvitationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class WorkspaceService
{
    /**
     * Resolve the workspace a user should land in: their selected workspace
     * first, then an owned workspace, then any membership.
     */
    public function forUser(User $user): ?Workspace
    {
        if ($user->current_workspace_id) {
            $current = Workspace::query()
                ->whereKey($user->current_workspace_id)
                ->where(function ($query) use ($user) {
                    $query->where('owner_id', $user->id)
                        ->orWhereHas('memberRecords', fn ($members) => $members->where('user_id', $user->id));
                })
                ->first();

            if ($current) {
                return $current;
            }
        }

        $workspace = Workspace::query()
            ->where('owner_id', $user->id)
            ->orderBy('id')
            ->first();

        if ($workspace) {
            return $workspace;
        }

        return $user->workspaces()->orderBy('workspaces.id')->first();
    }

    /**
     * Every workspace the user can open, with the role they hold there.
     *
     * @return Collection<int, Workspace>
     */
    public function availableFor(User $user): Collection
    {
        return Workspace::query()
            ->where(function ($query) use ($user) {
                $query->where('owner_id', $user->id)
                    ->orWhereHas('memberRecords', fn ($members) => $members->where('user_id', $user->id));
            })
            ->with(['subscription.plan:id,name,slug'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Remember the workspace a user is currently working in.
     */
    public function switchTo(User $user, Workspace $workspace): Workspace
    {
        $allowed = $this->availableFor($user)->contains(fn (Workspace $candidate) => (int) $candidate->id === (int) $workspace->id);

        abort_unless($allowed, 403, 'You do not have access to that workspace.');

        $user->forceFill(['current_workspace_id' => $workspace->id])->save();

        return $workspace;
    }

    public function ensureForUser(User $user): Workspace
    {
        return $this->forUser($user) ?? $this->provision($user);
    }

    /**
     * Create a workspace, make the user its owner and start a trial.
     */
    public function provision(User $user, ?string $name = null): Workspace
    {
        $name = trim($name ?: ($user->name ? "{$user->name}'s Workspace" : 'My Workspace'));

        $workspace = Workspace::create([
            'name' => $name,
            'slug' => $this->uniqueSlug($name),
            'owner_id' => $user->id,
            'currency' => 'USD',
            'timezone' => config('app.timezone', 'UTC'),
            'settings' => [
                'notifications' => [
                    'billing' => true,
                    'product' => true,
                ],
            ],
        ]);

        WorkspaceMember::create([
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        $user->forceFill(['current_workspace_id' => $workspace->id])->save();

        $plan = Plan::active()->public()->ordered()->first();

        if ($plan) {
            app(BillingService::class)->startTrial($workspace, $plan);
        }

        return $workspace->fresh(['subscription.plan']);
    }

    public function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'workspace';
        $slug = $base;
        $suffix = 2;

        while (Workspace::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    public function update(Workspace $workspace, array $data): Workspace
    {
        if (isset($data['name'])) {
            $data['name'] = trim($data['name']);
            $data['slug'] = $this->uniqueSlugFor($data['name'], $workspace);
        }

        $workspace->update($data);

        return $workspace->fresh();
    }

    private function uniqueSlugFor(string $name, Workspace $workspace): string
    {
        $base = Str::slug($name) ?: 'workspace';
        $slug = $base;
        $suffix = 2;

        while (Workspace::where('slug', $slug)->whereKeyNot($workspace->id)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    /**
     * Seat-limited invitation. Expired/pending duplicates are reused.
     */
    public function invite(Workspace $workspace, User $inviter, string $email, string $role = 'member'): WorkspaceInvitation
    {
        $email = strtolower(trim($email));

        if ($workspace->members()->where('email', $email)->exists()) {
            throw ValidationException::withMessages([
                'email' => 'That person is already a member of this workspace.',
            ]);
        }

        $this->assertSeatAvailable($workspace);

        $invitation = WorkspaceInvitation::updateOrCreate(
            ['workspace_id' => $workspace->id, 'email' => $email],
            [
                'role' => $role,
                'token' => Str::random(64),
                'invited_by' => $inviter->id,
                'expires_at' => now()->addDays(7),
                'accepted_at' => null,
            ]
        );

        return $invitation->fresh(['inviter:id,name,email']);
    }

    /**
     * Email the invitation link. Failures never block the invite itself.
     */
    public function sendInvitation(WorkspaceInvitation $invitation): bool
    {
        try {
            $invitation->loadMissing(['workspace', 'inviter:id,name,email']);
            Mail::to($invitation->email)->send(new WorkspaceInvitationMail($invitation));

            return true;
        } catch (\Throwable $exception) {
            report($exception);

            return false;
        }
    }

    public function revokeInvitation(Workspace $workspace, WorkspaceInvitation $invitation): void
    {
        abort_unless($invitation->workspace_id === $workspace->id, 404);

        $invitation->delete();
    }

    public function acceptInvitation(string $token, User $user): Workspace
    {
        $invitation = WorkspaceInvitation::where('token', $token)->first();

        if (! $invitation || ! $invitation->isPending()) {
            throw ValidationException::withMessages([
                'token' => 'This invitation is invalid or has expired.',
            ]);
        }

        if ($invitation->accepted_at !== null) {
            throw ValidationException::withMessages([
                'token' => 'This invitation has already been accepted.',
            ]);
        }

        WorkspaceMember::updateOrCreate(
            ['workspace_id' => $invitation->workspace_id, 'user_id' => $user->id],
            [
                // Never demote the workspace owner by accepting an invite.
                'role' => (int) $invitation->workspace->owner_id === (int) $user->id
                    ? 'owner'
                    : $invitation->role,
                'joined_at' => now(),
            ]
        );

        $invitation->update(['accepted_at' => now()]);

        return $invitation->workspace;
    }

    public function removeMember(Workspace $workspace, WorkspaceMember $member): void
    {
        abort_unless($member->workspace_id === $workspace->id, 404);

        if ((int) $member->user_id === (int) $workspace->owner_id) {
            throw ValidationException::withMessages([
                'member' => 'The workspace owner cannot be removed.',
            ]);
        }

        $member->delete();
    }

    /**
     * Let a non-owner member leave a shared workspace.
     */
    public function leave(Workspace $workspace, User $user): void
    {
        if ((int) $workspace->owner_id === (int) $user->id) {
            throw ValidationException::withMessages([
                'workspace' => 'Owners cannot leave their own workspace. Delete it or transfer ownership instead.',
            ]);
        }

        $workspace->memberRecords()->where('user_id', $user->id)->delete();

        $this->reassignCurrentWorkspace($user, $workspace);
    }

    /**
     * Permanently delete a workspace owned by the user. All tenant data
     * cascades; the owner is moved to another workspace when one exists.
     */
    public function delete(Workspace $workspace, User $user, string $confirmation): void
    {
        if ((int) $workspace->owner_id !== (int) $user->id) {
            throw ValidationException::withMessages([
                'workspace' => 'Only the workspace owner can delete it.',
            ]);
        }

        if (trim($confirmation) !== $workspace->name) {
            throw ValidationException::withMessages([
                'name' => 'Type the workspace name exactly to confirm deletion.',
            ]);
        }

        $workspace->delete();

        $this->reassignCurrentWorkspace($user, $workspace);
    }

    /**
     * Move the user to another workspace after losing access to one.
     */
    private function reassignCurrentWorkspace(User $user, Workspace $removed): void
    {
        if ((int) $user->current_workspace_id !== (int) $removed->id) {
            return;
        }

        $next = $this->availableFor($user)->first();

        $user->forceFill(['current_workspace_id' => $next?->id])->save();
    }

    public function changeRole(Workspace $workspace, WorkspaceMember $member, string $role): WorkspaceMember
    {
        abort_unless($member->workspace_id === $workspace->id, 404);

        if ((int) $member->user_id === (int) $workspace->owner_id) {
            throw ValidationException::withMessages([
                'member' => 'The workspace owner role cannot be changed.',
            ]);
        }

        $member->update(['role' => $role]);

        return $member->fresh('user');
    }

    public function assertSeatAvailable(Workspace $workspace): void
    {
        $limit = (int) ($workspace->plan()?->limit('seats', 3) ?? 3);

        if ($limit < 0) {
            return;
        }

        $used = $workspace->memberRecords()->count()
            + $workspace->invitations()->whereNull('accepted_at')->where('expires_at', '>', now())->count();

        if ($used >= $limit) {
            throw ValidationException::withMessages([
                'email' => "Your plan allows {$limit} seats. Upgrade your plan to invite more people.",
            ]);
        }
    }

    /**
     * Workspace payload shared by the workspace, billing and team screens.
     */
    public function summary(Workspace $workspace): array
    {
        $workspace->loadMissing(['subscription.plan', 'owner:id,name,email,thumbnail']);

        $subscription = $workspace->subscription;
        $plan = $subscription?->plan;

        return [
            'workspace' => [
                'id' => $workspace->id,
                'name' => $workspace->name,
                'slug' => $workspace->slug,
                'currency' => $workspace->currency,
                'timezone' => $workspace->timezone,
                'logo_path' => $workspace->logo_path,
                'owner' => $workspace->owner,
                'created_at' => $workspace->created_at,
                'is_suspended' => $workspace->isSuspended(),
            ],
            'plan' => $plan?->toPlanArray(),
            'subscription' => $subscription ? [
                'id' => $subscription->id,
                'status' => $subscription->status,
                'billing_cycle' => $subscription->billing_cycle,
                'is_trialing' => $subscription->isTrialing(),
                'is_active' => $subscription->isActive(),
                'on_grace_period' => $subscription->onGracePeriod(),
                'cancel_at_period_end' => $subscription->cancel_at_period_end,
                'trial_ends_at' => $subscription->trial_ends_at,
                'trial_days_left' => $subscription->trialDaysLeft(),
                'current_period_start' => $subscription->current_period_start,
                'current_period_end' => $subscription->current_period_end,
                'period_label' => $subscription->periodLabel(),
            ] : null,
            'usage' => $workspace->usage(),
            'stats' => [
                'members' => $workspace->memberRecords()->count(),
                'pending_invitations' => $workspace->invitations()
                    ->whereNull('accepted_at')
                    ->where('expires_at', '>', now())
                    ->count(),
                'open_invoices' => $workspace->invoices()->whereIn('status', ['open', 'draft'])->count(),
            ],
        ];
    }
}
