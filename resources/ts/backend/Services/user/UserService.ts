
import {AxiosService} from "../../Utils/AxiosService"
import { BaseService } from "../BaseService";

class UserService extends BaseService {
    constructor() {
        super('user');
    }

    getAuthUser() {
        return AxiosService.get('/me');
    }

    countries(id?: string) {
        return AxiosService.get(`/countries-list?country_id=${id ?? ''}`);
    }

    roles() {
        return AxiosService.get('/list/roles');
    }

    impersonate(uuid: string) {
        return AxiosService.post(`/user/${uuid}/impersonate`);
    }

    leaveImpersonate() {
        return AxiosService.post('/impersonate/leave');
    }
}

export default new UserService();
