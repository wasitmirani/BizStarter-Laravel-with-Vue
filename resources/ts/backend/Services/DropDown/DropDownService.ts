import { AxiosService } from "../../Utils/AxiosService";
import { BaseService } from "../BaseService";

class DropDownService extends BaseService {
    constructor() {
        super('dropdown');
    }

    // Generic method that can handle any dropdown type
    getList = <T = any>(
        listType: string,
        params: { search?: string; [key: string]: any } = {}
    ): Promise<T> => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
        
        const queryString = queryParams.toString();
        const url = `/dropdown/${listType}-list${queryString ? `?${queryString}` : ''}`;
        
        return AxiosService.get(url);
    }

    // Usage examples
    getUsers = (params?: any) => this.getList('users', params);
    getPermissions = (params?: any) => this.getList('permissions', params);
    getRoles = (params?: any) => this.getList('roles', params);
    getSuppliers = (params?: any) => this.getList('suppliers', params);
    
    // Or just use getList directly
}

export default new DropDownService();