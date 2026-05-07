import { AxiosService } from "../../Utils/AxiosService";

class WarehouseZoneService {
    index = (params: { warehouse_id: number; page?: number; per_page?: number; search?: string; sort_dir?: string }) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") queryParams.append(key, value.toString());
        });
        const queryString = queryParams.toString();
        return AxiosService.get(`/warehouse-zone${queryString ? `?${queryString}` : ""}`);
    };

    store = (payload: any) => AxiosService.post("/warehouse-zone", payload);
    update = (payload: any) => AxiosService.put(`/warehouse-zone/${payload.id}`, payload);
    delete = (id: number) => AxiosService.delete(`/warehouse-zone/${id}`);
}

export default new WarehouseZoneService();

