import { AxiosService } from "../../Utils/AxiosService";

class WarehouseAreaService {
    index = (params: { warehouse_id: number; page?: number; per_page?: number; search?: string; sort_dir?: string }) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") queryParams.append(key, value.toString());
        });
        const queryString = queryParams.toString();
        return AxiosService.get(`/warehouse-area${queryString ? `?${queryString}` : ""}`);
    };

    store = (payload: any) => AxiosService.post("/warehouse-area", payload);
    update = (payload: any) => AxiosService.put(`/warehouse-area/${payload.id}`, payload);
    delete = (id: number) => AxiosService.delete(`/warehouse-area/${id}`);
}

export default new WarehouseAreaService();

