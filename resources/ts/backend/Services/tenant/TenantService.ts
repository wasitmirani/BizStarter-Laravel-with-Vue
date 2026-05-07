import { AxiosService } from "../../Utils/AxiosService";
import { BaseService } from "../BaseService";

class TenantService extends BaseService {
    constructor() {
        super("tenant");
    }

    tenants = (params: { page?: string; per_page?: string; search?: string; [key: string]: any } = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return AxiosService.get(`/tenant${queryString ? `?${queryString}` : ""}`);
    };

    current = () => AxiosService.get("/tenant-settings/current");
    updateCurrent = (payload: any) => AxiosService.put("/tenant-settings/current", payload);
}

export default new TenantService();
