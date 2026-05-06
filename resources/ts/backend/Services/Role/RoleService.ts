
import {AxiosService} from "../../Utils/AxiosService"
import { BaseService } from "../BaseService";


class RoleService extends BaseService {
    constructor() {
        super('role');
    }

    roles = (params: { page?: string; per_page?: string; search?: string; role?: string; status?: string; sort_by?: string; order?: string; [key: string]: any } = {}) => {
        const queryParams = new URLSearchParams();

        // Add all non-empty parameters to query string
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return AxiosService.get(`/role${queryString ? `?${queryString}` : ''}`);
    }
    store = (role:any) => {
        return AxiosService.post('/role',role);
    }
    update = (role:any) => {
        return AxiosService.put('/role/'+role.id,role);
    }
    delete = (id:number) => {
        return AxiosService.delete('/role/'+id);
    }
    role = (uuid:string) =>{
        return AxiosService.get('/role/'+uuid);
    }
    countries = (id?:string)=> {
        return AxiosService.get('/countries-list?country_id='+id);
    }
   

    
}

export default new RoleService();
