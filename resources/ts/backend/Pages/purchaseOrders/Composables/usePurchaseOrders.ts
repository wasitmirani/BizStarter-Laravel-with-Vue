import { DropdownOptions } from '../../../Utils/DropdownOptions';
import { Helpers } from '../../../Utils/Helper';
import { defaultFilters } from '../../../Utils/Constants';
import { PurchasesService } from '../../../Services/purchases/PurchasesService';
import DropDownService from '../../../Services/DropDown/DropDownService';
import WarehouseService from '../../../Services/Warehouse/WarehouseService';

const emptyPagination = { data: [], current_page: 1, last_page: 1, from: 0, to: 0, total: 0 };

export function usePurchaseOrders() {
    const router = Helpers.router();
    const route = Helpers.route();
    const purchaseOrders = Helpers.useDynamicRef<any>(emptyPagination);
    const suppliers = Helpers.useDynamicRef<any[]>([]);
    const warehouses = Helpers.useDynamicRef<any[]>([]);
    const currentPage = Helpers.useDynamicRef(1);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        'toast',
        { showToast: () => {} }
    );
    const isLoading = Helpers.useDynamicRef(false);
    const sortableFilterOptions = Helpers.useDynamicComputed(() => DropdownOptions.sortableFilterOptions());

    const purchaseOrderFilters = {
        ...defaultFilters,
        supplier_id: '',
        warehouse_id: '',
    };
    const filters = Helpers.useDynamicReactive({ ...purchaseOrderFilters });

    const updateUrlWithFilters = () => {
        Helpers.updateUrlWithFilters(route, router, filters, {
            defaults: purchaseOrderFilters,
            omitDefaults: true,
        });
    };

    const loadFiltersFromUrl = () => {
        Helpers.loadFiltersFromQuery(filters, route.query as Record<string, any>);
        currentPage.value = filters.page;
    };

    const loadSuppliers = async () => {
        const res = await DropDownService.getSuppliers();
        suppliers.value = res?.data?.result?.suppliers ?? [];
    };

    const loadWarehouses = async () => {
        const res = await WarehouseService.warehouses({ paginated: false, sort_by: 'name', sort_dir: 'asc' });
        warehouses.value = res?.data?.result?.warehouses?.data ?? res?.data?.result?.warehouses ?? [];
    };

    const fetchPurchaseOrders = async (page?: number, perPage?: number) => {
        if (page !== undefined) filters.page = page;
        if (perPage !== undefined) filters.per_page = perPage;

        currentPage.value = filters.page;
        isLoading.value = true;
        const params = Helpers.buildQueryFromFilters(filters);

        try {
            const res = await PurchasesService.purchaseOrders(params);
            purchaseOrders.value = res?.data?.result?.purchase_orders ?? emptyPagination;
        } catch (err: any) {
            toast.value?.showToast(err.status, `Error: ${err.status}`, err.response?.data?.message);
        } finally {
            setTimeout(() => {
                isLoading.value = false;
            }, 700);
        }
    };

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        Object.keys(filters).forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(newFilters, key)) {
                // @ts-ignore
                filters[key] = newFilters[key];
            } else {
                // @ts-ignore
                filters[key] = purchaseOrderFilters[key];
            }
        });
        filters.page = 1;
        updateUrlWithFilters();
        fetchPurchaseOrders();
    };

    const handleSearchQuery = (query: string) => {
        filters.search = query;
        filters.page = 1;
        updateUrlWithFilters();
        fetchPurchaseOrders();
    };

    const setLoading = (value: boolean) => {
        isLoading.value = value;
    };

    const filterData = (data: any) => {
        purchaseOrders.value = data?.result?.purchase_orders || data?.result || emptyPagination;
    };

    const init = async () => {
        loadFiltersFromUrl();
        await Promise.all([loadSuppliers(), loadWarehouses()]);
        fetchPurchaseOrders();
    };

    return {
        purchaseOrders,
        suppliers,
        warehouses,
        currentPage,
        isLoading,
        filters,
        sortableFilterOptions,
        fetchPurchaseOrders,
        handleFilterChange,
        handleSearchQuery,
        setLoading,
        filterData,
        init,
    };
}
