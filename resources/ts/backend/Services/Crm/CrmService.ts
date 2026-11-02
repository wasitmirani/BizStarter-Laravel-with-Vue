import { AxiosService } from '../../Utils/AxiosService';

export type CrmTag = {
    id: number;
    name: string;
    color: string;
    contacts_count?: number | null;
};

export type CrmContact = {
    id: number;
    name: string;
    phone: string;
    display_phone: string;
    email: string | null;
    company: string | null;
    avatar_url: string | null;
    source: string;
    status: 'lead' | 'customer' | 'blocked';
    notes: string | null;
    opt_in: boolean;
    custom_fields: Record<string, any>;
    last_message_at: string | null;
    created_at: string;
    tags: CrmTag[];
};

export type CrmMessage = {
    id: number;
    conversation_id: number;
    direction: 'in' | 'out';
    type: string;
    body: string | null;
    media_url: string | null;
    media_mime: string | null;
    media_filename: string | null;
    template_name: string | null;
    status: string;
    error: string | null;
    sent_at: string | null;
    delivered_at: string | null;
    read_at: string | null;
    created_at: string;
    agent: { id: number; name: string } | null;
};

export type CrmConversation = {
    id: number;
    status: 'open' | 'pending' | 'closed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    subject: string | null;
    last_message_preview: string | null;
    last_message_at: string | null;
    unread_count: number;
    is_pinned: boolean;
    closed_at: string | null;
    assigned_to: number | null;
    contact: CrmContact | null;
    assignee: { id: number; name: string } | null;
    latest_message?: CrmMessage | null;
};

export type CrmTemplate = {
    id: number;
    name: string;
    category: 'marketing' | 'utility' | 'authentication';
    language: string;
    header_type: string | null;
    header_text: string | null;
    body: string;
    footer: string | null;
    buttons: any[];
    variables: any[];
    variable_count: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paused';
    external_id: string | null;
    last_synced_at: string | null;
    created_at: string;
};

export type CrmCampaign = {
    id: number;
    name: string;
    message_body: string | null;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
    scheduled_at: string | null;
    sent_at: string | null;
    total_recipients: number;
    sent_count: number;
    delivered_count: number;
    failed_count: number;
    delivery_rate: number;
    template: CrmTemplate | null;
    audience_tag: CrmTag | null;
    created_at: string;
};

export type WhatsAppAccount = {
    id: number;
    name: string;
    phone_number: string | null;
    phone_number_id: string | null;
    business_account_id: string | null;
    verify_token: string | null;
    api_version: string;
    is_active: boolean;
    configured: boolean;
    connected_at: string | null;
    last_error: string | null;
    token_preview: string | null;
    has_token: boolean;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

class CrmService {
    // Contacts
    contacts(params: Record<string, any> = {}) {
        return AxiosService.get<{ result: { contacts: CrmContact[]; meta: PaginationMeta; tags: CrmTag[] } }>('/crm/contacts', { params });
    }

    contact(id: number) {
        return AxiosService.get<{ result: { contact: CrmContact; conversations: CrmConversation[] } }>(`/crm/contacts/${id}`);
    }

    createContact(payload: Partial<CrmContact> & { tags?: Array<number | string> }) {
        return AxiosService.post<{ result: { contact: CrmContact } }>('/crm/contacts', payload);
    }

    updateContact(id: number, payload: Partial<CrmContact> & { tags?: Array<number | string> }) {
        return AxiosService.put<{ result: { contact: CrmContact } }>(`/crm/contacts/${id}`, payload);
    }

    deleteContact(id: number) {
        return AxiosService.delete(`/crm/contacts/${id}`);
    }

    importContacts(file: File) {
        const form = new FormData();
        form.append('file', file);
        return AxiosService.post<{ result: { created: number; updated: number; skipped: number } }>('/crm/contacts/import', form);
    }

    async exportContacts() {
        const response = await AxiosService.get<Blob>('/crm/contacts/export', { responseType: 'blob' });
        const url = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    // Tags
    tags() {
        return AxiosService.get<{ result: { tags: CrmTag[] } }>('/crm/tags');
    }

    createTag(payload: { name: string; color?: string }) {
        return AxiosService.post<{ result: { tag: CrmTag } }>('/crm/tags', payload);
    }

    updateTag(id: number, payload: { name: string; color?: string }) {
        return AxiosService.put<{ result: { tag: CrmTag } }>(`/crm/tags/${id}`, payload);
    }

    deleteTag(id: number) {
        return AxiosService.delete(`/crm/tags/${id}`);
    }

    // Conversations
    conversations(params: Record<string, any> = {}) {
        return AxiosService.get<{
            result: {
                conversations: CrmConversation[];
                meta: PaginationMeta;
                counts: { open: number; pending: number; closed: number; unread: number };
                assignables: Array<{ id: number; name: string; email: string }>;
            };
        }>('/crm/conversations', { params });
    }

    conversation(id: number) {
        return AxiosService.get<{
            result: {
                conversation: CrmConversation;
                messages: CrmMessage[];
                assignables: Array<{ id: number; name: string; email: string }>;
                account: { connected: boolean; phone_number: string | null };
            };
        }>(`/crm/conversations/${id}`);
    }

    olderMessages(id: number, before: number) {
        return AxiosService.get<{ result: { messages: CrmMessage[]; has_more: boolean } }>(`/crm/conversations/${id}/messages`, {
            params: { before },
        });
    }

    reply(id: number, body: string) {
        return AxiosService.post<{ result: { message: CrmMessage } }>(`/crm/conversations/${id}/reply`, { body });
    }

    updateConversation(id: number, payload: Record<string, any>) {
        return AxiosService.patch<{ result: { conversation: CrmConversation } }>(`/crm/conversations/${id}`, payload);
    }

    markRead(id: number) {
        return AxiosService.post(`/crm/conversations/${id}/read`, {});
    }

    startConversation(payload: { contact_id: number; body?: string }) {
        return AxiosService.post<{ result: { conversation: CrmConversation } }>('/crm/conversations', payload);
    }

    // Templates
    templates(params: Record<string, any> = {}) {
        return AxiosService.get<{ result: { templates: CrmTemplate[]; categories: string[]; statuses: string[] } }>('/crm/templates', { params });
    }

    createTemplate(payload: Partial<CrmTemplate>) {
        return AxiosService.post<{ result: { template: CrmTemplate } }>('/crm/templates', payload);
    }

    updateTemplate(id: number, payload: Partial<CrmTemplate>) {
        return AxiosService.put<{ result: { template: CrmTemplate } }>(`/crm/templates/${id}`, payload);
    }

    deleteTemplate(id: number) {
        return AxiosService.delete(`/crm/templates/${id}`);
    }

    syncTemplates() {
        return AxiosService.post<{ result: { created: number; updated: number } }>('/crm/templates/sync', {});
    }

    // Campaigns
    campaigns(params: Record<string, any> = {}) {
        return AxiosService.get<{
            result: {
                campaigns: CrmCampaign[];
                templates: CrmTemplate[];
                tags: CrmTag[];
                stats: { total: number; sent: number; drafts: number; messages_sent: number };
            };
        }>('/crm/campaigns', { params });
    }

    createCampaign(payload: Record<string, any>) {
        return AxiosService.post<{ result: { campaign: CrmCampaign; preview: { total: number; sample: any[] } } }>('/crm/campaigns', payload);
    }

    updateCampaign(id: number, payload: Record<string, any>) {
        return AxiosService.put<{ result: { campaign: CrmCampaign; preview: any } }>(`/crm/campaigns/${id}`, payload);
    }

    deleteCampaign(id: number) {
        return AxiosService.delete(`/crm/campaigns/${id}`);
    }

    sendCampaign(id: number) {
        return AxiosService.post<{ result: { result: { sent: number; failed: number; total: number }; campaign: CrmCampaign } }>(
            `/crm/campaigns/${id}/send`,
            {}
        );
    }

    // WhatsApp account
    whatsapp() {
        return AxiosService.get<{
            result: { account: WhatsAppAccount; webhook_url: string; api_version: string; configured: boolean };
        }>('/crm/whatsapp');
    }

    saveWhatsApp(payload: Record<string, any>) {
        return AxiosService.put<{ result: { account: WhatsAppAccount; configured: boolean } }>('/crm/whatsapp', payload);
    }

    testWhatsApp() {
        return AxiosService.post<{ result: { account: WhatsAppAccount; remote: any } }>('/crm/whatsapp/test', {});
    }

    rotateVerifyToken() {
        return AxiosService.post<{ result: { account: WhatsAppAccount } }>('/crm/whatsapp/rotate-verify-token', {});
    }
}

export default new CrmService();
