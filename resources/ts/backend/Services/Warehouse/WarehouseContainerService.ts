import { AxiosService } from "../../Utils/AxiosService";

class WarehouseContainerService {
    index = (params: { warehouse_id: number; page?: number; per_page?: number; search?: string; sort_dir?: string }) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") queryParams.append(key, value.toString());
        });
        const queryString = queryParams.toString();
        return AxiosService.get(`/warehouse-container${queryString ? `?${queryString}` : ""}`);
    };

    store = (payload: any) => AxiosService.post("/warehouse-container", payload);
    update = (payload: any) => AxiosService.put(`/warehouse-container/${payload.id}`, payload);
    delete = (id: number) => AxiosService.delete(`/warehouse-container/${id}`);
}

export default new WarehouseContainerService();

