import { AxiosService } from '../../Utils/AxiosService';

export type ApiToken = {
    id: number;
    name: string;
    abilities: string[];
    last_used_at: string | null;
    created_at: string;
    expires_at: string | null;
};

class TokenService {
    list() {
        return AxiosService.get<{ result: { tokens: ApiToken[]; abilities: Array<{ value: string; label: string }> } }>(
            '/tokens',
        );
    }

    create(payload: { name: string; abilities: string[]; expires_in_days?: number | null }) {
        return AxiosService.post<{ result: { token: string; access_token: ApiToken } }>('/tokens', payload);
    }

    revoke(id: number) {
        return AxiosService.delete(`/tokens/${id}`);
    }
}

export default new TokenService();
