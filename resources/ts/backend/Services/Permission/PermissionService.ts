
import {AxiosService} from "../../Utils/AxiosService"
import { BaseService } from "../BaseService";

class PermissionService extends BaseService {
    constructor() {
        super('permission');
    }

    permissions = (params: { page?: string; per_page?: string; search?: string; permission?: string; status?: string; sort_by?: string; order?: string; [key: string]: any } = {}) => {
        const queryParams = new URLSearchParams();

        // Add all non-empty parameters to query string
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return AxiosService.get(`/permission${queryString ? `?${queryString}` : ''}`);
    }
    store = (permission:any) => {
        return AxiosService.post('/permission',permission);
    }
    update = (permission:any) => {
        return AxiosService.put('/permission/'+permission.id,permission);
    }
    delete = (id:number) => {
        return AxiosService.delete('/permission/'+id);
    }
    permission = (uuid:string) =>{
        return AxiosService.get('/permission/'+uuid);
    }
    countries = (id?:string)=> {
        return AxiosService.get('/countries-list?country_id='+id);
    }
   

    
}

export default new PermissionService();
