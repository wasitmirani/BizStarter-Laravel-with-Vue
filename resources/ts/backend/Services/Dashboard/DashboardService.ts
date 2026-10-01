import { AxiosService } from '../../Utils/AxiosService';

class DashboardService {
    getStats() {
        return AxiosService.get('/dashboard');
    }
}

export default new DashboardService();
