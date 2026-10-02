import TenantService from '../../../Services/Tenant/TenantService';
import { Helpers } from '../../../Utils/Helper';

export function useTenants() {
    const router = Helpers.router();
    const route = Helpers.route();

    const tenants = Helpers.useDynamicRef([]);
    const currentPage = Helpers.useDynamicRef(1);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        'toast',
        { showToast: () => {} }
    );
    const isLoading = Helpers.useDynamicRef(false);

    const defaultFilters = {
        search: '',
        status: '',
        page: 1,
        per_page: 20,
        sort_by: 'created_at',
        paginated: true,
        sort_dir: 'desc',
        date_range: '',
    };

    const filters = Helpers.useDynamicReactive({ ...defaultFilters });

    const updateUrlWithFilters = () => {
        Helpers.updateUrlWithFilters(route, router, filters, {
            defaults: defaultFilters,
            omitDefaults: true,
        });
    };

    const loadFiltersFromUrl = () => {
        Helpers.loadFiltersFromQuery(filters, route.query as Record<string, any>);
        currentPage.value = filters.page;
    };

    const fetchTenants = async (page?: number, per_page?: number) => {
        if (page !== undefined) filters.page = page;
        if (per_page !== undefined) filters.per_page = per_page;

        currentPage.value = filters.page;
        isLoading.value = true;

        const params = Helpers.buildQueryFromFilters(filters);

        try {
            const res = await TenantService.tenants(params);
            tenants.value = res.data.result.tenants;
        } catch (err: any) {
            toast.value?.showToast(
                err.status,
                'Error: ' + err.status,
                err.response?.data?.message
            );
        } finally {
            setTimeout(() => {
                isLoading.value = false;
            }, 500);
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
        fetchTenants();
    };

    const handleSearchChange = (searchTerm: string) => {
        filters.search = searchTerm;
        filters.page = 1;
        updateUrlWithFilters();
        fetchTenants();
    };

    const handleSearchQuery = (query: string) => {
        handleSearchChange(query);
    };

    const setLoading = (value: boolean) => {
        isLoading.value = value;
    };

    const filterData = (data: any) => {
        tenants.value = data.result.tenants;
    };

    const init = () => {
        loadFiltersFromUrl();
        fetchTenants();
    };

    return {
        tenants,
        currentPage,
        isLoading,
        filters,
        fetchTenants,
        handleFilterChange,
        handleSearchChange,
        handleSearchQuery,
        setLoading,
        filterData,
        init,
    };
}
