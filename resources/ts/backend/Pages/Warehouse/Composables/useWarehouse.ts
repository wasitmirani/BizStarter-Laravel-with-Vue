import WarehouseService from "../../../Services/Warehouse/WarehouseService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";
import { defaultFilters } from "../../../Utils/Constants";

export function useWarehouses() {
    const router = Helpers.router();
    const route = Helpers.route();

    const warehouses = Helpers.useDynamicRef([]);
    const currentPage = Helpers.useDynamicRef(1);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        "toast",
        { showToast: () => {} }
    );
    const isLoading = Helpers.useDynamicRef(false);
    const sortableFilterOptions = Helpers.useDynamicComputed(() => DropdownOptions.sortableFilterOptions());

    const warehouseFilters = { ...defaultFilters };
    const filters = Helpers.useDynamicReactive({ ...warehouseFilters });

    const updateUrlWithFilters = () => {
        Helpers.updateUrlWithFilters(route, router, filters, {
            defaults: warehouseFilters,
            omitDefaults: true,
        });
    };

    const loadFiltersFromUrl = () => {
        Helpers.loadFiltersFromQuery(filters, route.query as Record<string, any>);
        currentPage.value = filters.page;
    };

    const fetchWarehouses = async (page?: number, per_page?: number) => {
        if (page !== undefined) filters.page = page;
        if (per_page !== undefined) filters.per_page = per_page;

        currentPage.value = filters.page;
        isLoading.value = true;
        const params = Helpers.buildQueryFromFilters(filters);

        try {
            const res = await WarehouseService.warehouses(params);
            warehouses.value = res.data.result.warehouses;
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
                filters[key] = defaultFilters[key];
            }
        });
        filters.page = 1;
        updateUrlWithFilters();
        fetchWarehouses();
    };

    const handleSearchQuery = (query: string) => {
        filters.search = query;
        filters.page = 1;
        updateUrlWithFilters();
        fetchWarehouses();
    };

    const setLoading = (value: boolean) => {
        isLoading.value = value;
    };

    const filterData = (data: any) => {
        warehouses.value = data?.result?.warehouses || data?.result || [];
    };

    const init = () => {
        loadFiltersFromUrl();
        fetchWarehouses();
    };

    return {
        warehouses,
        currentPage,
        isLoading,
        filters,
        sortableFilterOptions,
        fetchWarehouses,
        handleFilterChange,
        handleSearchQuery,
        setLoading,
        filterData,
        init,
    };
}
