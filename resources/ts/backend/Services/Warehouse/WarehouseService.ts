import { AxiosService } from "../../Utils/AxiosService";
import { BaseService } from "../BaseService";

class WarehouseService extends BaseService {
    constructor() {
        super("warehouse");
    }

    warehouses = (params: { page?: string; per_page?: string; search?: string; status?: string; sort_by?: string; order?: string; [key: string]: any } = {}) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return AxiosService.get(`/warehouse${queryString ? `?${queryString}` : ""}`);
    };

    store = (warehouse: any) => AxiosService.post("/warehouse", warehouse);
    update = (warehouse: any) => AxiosService.put(`/warehouse/${warehouse.id}`, warehouse);
    delete = (id: number) => AxiosService.delete(`/warehouse/${id}`);
    warehouse = (uuid: string) => AxiosService.get(`/warehouse/${uuid}`);
}

export default new WarehouseService();

