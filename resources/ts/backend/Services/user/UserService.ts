
import {AxiosService} from "../../Utils/AxiosService"
import { BaseService } from "../BaseService";

class UserService extends BaseService {
    constructor() {
        super('user');
    }

    users = (params: { page?: string; per_page?: string; search?: string; role?: string; status?: string; sort_by?: string; order?: string; [key: string]: any } = {}) => {
        const queryParams = new URLSearchParams();

        // Add all non-empty parameters to query string
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return AxiosService.get(`/user${queryString ? `?${queryString}` : ''}`);
    }

    getAuthUser() {
        return AxiosService.get('/me');
    }



    store = (user:any) => {
        return AxiosService.post('/user',user);
    }
    update = (user:any) => {
        return AxiosService.put('/user/'+user.id,user);
    }
    delete = (id:number) => {
        return AxiosService.delete('/user/'+id);
    }
    user = (uuid:string) =>{
        return AxiosService.get('/user/'+uuid);
    }
    countries = (id?:string)=> {
        return AxiosService.get('/countries-list?country_id='+id);
    }
    roles = ()=> {
        return AxiosService.get('/list/roles');
    }

    impersonate = (uuid: string) => {
        return AxiosService.post(`/user/${uuid}/impersonate`);
    }

    leaveImpersonate = () => {
        return AxiosService.post('/impersonate/leave');
    }
}

export default new UserService();
