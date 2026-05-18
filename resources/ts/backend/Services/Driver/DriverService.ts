import { AxiosService } from "../../Utils/AxiosService";
import { BaseService } from "../BaseService";

class DriverService extends BaseService {
    constructor() {
        super("driver");
    }

    drivers = (params: { page?: string; per_page?: string; search?: string; status?: string; type?: string; city?: string; sort_by?: string; order?: string; [key: string]: any } = {}) => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value.toString());
            }
        });

        const queryString = queryParams.toString();
        return AxiosService.get(`/driver${queryString ? `?${queryString}` : ""}`);
    };

    store = (driver: any) => AxiosService.post("/driver", driver);
    update = (driver: any) => AxiosService.put(`/driver/${driver.id}`, driver);
    delete = (id: number) => AxiosService.delete(`/driver/${id}`);
    driver = (uuid: string) => AxiosService.get(`/driver/${uuid}`);
}

export default new DriverService();
