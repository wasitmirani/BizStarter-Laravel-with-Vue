import { AxiosService } from '../../Utils/AxiosService';

export type WorkspaceRole = 'owner' | 'admin' | 'member';

export type WorkspaceMember = {
    id: number;
    role: WorkspaceRole;
    joined_at: string | null;
    is_owner: boolean;
    user: {
        id: number;
        uuid: string;
        name: string;
        email: string;
        thumbnail: string | null;
        is_active: boolean;
    } | null;
};

export type WorkspaceInvitation = {
    id: number;
    email: string;
    role: WorkspaceRole;
    status: 'pending' | 'expired' | 'accepted';
    inviter: { id: number; name: string; email: string } | null;
    expires_at: string | null;
    url: string;
    created_at: string;
};

export type WorkspacePayload = {
    workspace: {
        id: number;
        name: string;
        slug: string;
        currency: string;
        timezone: string;
        logo_path: string | null;
        owner: { id: number; name: string; email: string; thumbnail: string | null } | null;
        created_at: string;
        is_suspended: boolean;
    };
    plan: any;
    subscription: any;
    usage: Record<string, { used?: number; limit?: number; unlimited?: boolean; percent: number }>;
    stats: {
        members: number;
        pending_invitations: number;
        open_invoices: number;
    };
    members: WorkspaceMember[];
    invitations: WorkspaceInvitation[];
    roles: Array<{ value: string; label: string; description: string }>;
};

class WorkspaceService {
    show() {
        return AxiosService.get<{ result: WorkspacePayload }>('/workspace');
    }

    update(payload: { name: string; currency?: string; timezone?: string }) {
        return AxiosService.patch<{ result: WorkspacePayload }>('/workspace', payload);
    }

    invite(payload: { email: string; role: string }) {
        return AxiosService.post('/workspace/invitations', payload);
    }

    revokeInvitation(id: number) {
        return AxiosService.delete(`/workspace/invitations/${id}`);
    }

    acceptInvitation(token: string) {
        return AxiosService.post(`/workspace/invitations/${token}/accept`, {});
    }

    updateMember(id: number, role: string) {
        return AxiosService.patch(`/workspace/members/${id}`, { role });
    }

    removeMember(id: number) {
        return AxiosService.delete(`/workspace/members/${id}`);
    }
}

export default new WorkspaceService();
