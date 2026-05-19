import DriverService from "../../../Services/Driver/DriverService";
import WarehouseService from "../../../Services/Warehouse/WarehouseService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";
import { defaultFilters } from "../../../Utils/Constants";
import type { FilterOption } from "./useDriverFilter";

export function useDrivers() {
    const router = Helpers.router();
    const route = Helpers.route();

    const drivers = Helpers.useDynamicRef([]);
    const currentPage = Helpers.useDynamicRef(1);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        "toast",
        { showToast: () => {} }
    );
    const isLoading = Helpers.useDynamicRef(false);
    const sortableFilterOptions = Helpers.useDynamicComputed(() => DropdownOptions.sortableFilterOptions());

    const driverFilters = { ...defaultFilters, type: "", city: "", warehouse_id: "" };
    const filters = Helpers.useDynamicReactive({ ...driverFilters });
    const warehouseFilterOptions = Helpers.useDynamicRef<FilterOption[]>([{ value: "", label: "All Warehouses" }]);

    const updateUrlWithFilters = () => {
        Helpers.updateUrlWithFilters(route, router, filters, {
            defaults: driverFilters,
            omitDefaults: true,
        });
    };

    const loadFiltersFromUrl = () => {
        Helpers.loadFiltersFromQuery(filters, route.query as Record<string, any>);
        currentPage.value = filters.page;
    };

    const fetchDrivers = async (page?: number, per_page?: number) => {
        if (page !== undefined) filters.page = page;
        if (per_page !== undefined) filters.per_page = per_page;

        currentPage.value = filters.page;
        isLoading.value = true;
        const params = Helpers.buildQueryFromFilters(filters);

        try {
            const res = await DriverService.drivers(params);
            drivers.value = res.data.result.drivers;
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
                filters[key] = driverFilters[key];
            }
        });
        filters.page = 1;
        updateUrlWithFilters();
        fetchDrivers();
    };

    const handleSearchQuery = (query: string) => {
        filters.search = query;
        filters.page = 1;
        updateUrlWithFilters();
        fetchDrivers();
    };

    const setLoading = (value: boolean) => {
        isLoading.value = value;
    };

    const filterData = (data: any) => {
        drivers.value = data?.result?.drivers || data?.result || [];
    };

    const loadWarehousesForFilter = async () => {
        try {
            const res = await WarehouseService.warehouses({ paginated: false, sort_by: "name", sort_dir: "asc" });
            const list = res?.data?.result?.warehouses?.data ?? res?.data?.result?.warehouses ?? [];
            warehouseFilterOptions.value = [
                { value: "", label: "All Warehouses" },
                ...DropdownOptions.getWarehousesListOptions(list),
            ];
        } catch {
            warehouseFilterOptions.value = [{ value: "", label: "All Warehouses" }];
        }
    };

    const init = () => {
        loadFiltersFromUrl();
        loadWarehousesForFilter();
        fetchDrivers();
    };

    return {
        drivers,
        currentPage,
        isLoading,
        filters,
        sortableFilterOptions,
        warehouseFilterOptions,
        fetchDrivers,
        handleFilterChange,
        handleSearchQuery,
        setLoading,
        filterData,
        init,
    };
}
