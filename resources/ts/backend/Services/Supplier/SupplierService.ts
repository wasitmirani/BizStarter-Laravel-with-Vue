import { AxiosService } from "../../Utils/AxiosService";
import { BaseService } from "../BaseService";

class SupplierService extends BaseService {
    constructor() {
        super("supplier");
    }

    suppliers = (params: { page?: string; per_page?: string; search?: string; status?: string; sort_by?: string; order?: string; [key: string]: any } = {}) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return AxiosService.get(`/supplier${queryString ? `?${queryString}` : ""}`);
    };

    store = (supplier: any) => AxiosService.post("/supplier", supplier);
    update = (supplier: any) => AxiosService.put(`/supplier/${supplier.id}`, supplier);
    delete = (id: number) => AxiosService.delete(`/supplier/${id}`);
    supplier = (uuid: string) => AxiosService.get(`/supplier/${uuid}`);
}

export default new SupplierService();
