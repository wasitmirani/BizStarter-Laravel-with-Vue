import { BaseService } from '../BaseService';
import { AxiosService } from '../../Utils/AxiosService';

export class SaleOrderService extends BaseService {
    constructor() {
        super('sale-order');
    }

    importOrders(file: File, config?: any) {
        const formData = new FormData();
        formData.append('file', file);

        return AxiosService.post(`/sale-order/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        });
    }

    downloadInvoice(orderId: string | number) {
        return AxiosService.get(`/sale-order/${orderId}/invoice`);
    }
}
