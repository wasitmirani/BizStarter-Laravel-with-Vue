import { AxiosService } from '../../Utils/AxiosService';

export type ProfilePayload = {
    name: string;
    email: string;
    phone?: string | null;
};

class ProfileService {
    show() {
        return AxiosService.get('/profile');
    }

    update(payload: ProfilePayload) {
        return AxiosService.put('/profile', payload);
    }

    updatePassword(payload: {
        current_password: string;
        new_password: string;
        new_password_confirmation: string;
    }) {
        return AxiosService.post('/password/update', payload);
    }
}

export default new ProfileService();
