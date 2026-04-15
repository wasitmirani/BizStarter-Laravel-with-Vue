import { reactive } from 'vue';
import { Helpers } from '../../../Utils/Helper';
import { PurchasesService } from '../../../Services/purchases/PurchasesService';

const emptyPagination = { data: [], current_page: 1, last_page: 1, from: 0, to: 0, total: 0 };

export function usePurchaseOrders() {
    const purchaseOrders = Helpers.useDynamicRef<any>(emptyPagination);
    const isLoading = Helpers.useDynamicRef(false);
    const filters = reactive({ page: 1, per_page: 10, search: '', sort_by: 'id', sort_dir: 'desc' });

    const fetchPurchaseOrders = async (page?: number, perPage?: number) => {
        if (page) filters.page = page;
        if (perPage) filters.per_page = perPage;
        isLoading.value = true;
        try {
            const res = await PurchasesService.purchaseOrders({ ...filters });
            purchaseOrders.value = res?.data?.result?.purchase_orders ?? emptyPagination;
        } finally {
            isLoading.value = false;
        }
    };

    const handleSearchQuery = (query: string) => {
        filters.search = query;
        filters.page = 1;
        fetchPurchaseOrders();
    };

    return { purchaseOrders, isLoading, filters, fetchPurchaseOrders, handleSearchQuery, init: fetchPurchaseOrders };
}
