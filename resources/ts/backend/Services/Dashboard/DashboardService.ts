import { AxiosService } from '../../Utils/AxiosService';

class DashboardService {
    getStats(range: number = 30) {
        return AxiosService.get(`/dashboard?range=${range}`);
    }
}

export default new DashboardService();
