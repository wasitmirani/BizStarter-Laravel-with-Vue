import { reactive } from 'vue';
import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';

const emptyPagination = {
    data: [],
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
};

export function useCategories() {
    const categories = Helpers.useDynamicRef<any>(emptyPagination);
    const isLoading = Helpers.useDynamicRef(false);
    const route = Helpers.route();
    const router = Helpers.router();

    const filters = reactive({
        page: 1,
        per_page: 10,
        search: '',
        sort_by: 'id',
        sort_dir: 'desc',
    });

    const fetchCategories = async (page?: number, perPage?: number) => {
        if (page) filters.page = page;
        if (perPage) filters.per_page = perPage;
        isLoading.value = true;
        try {
            const res = await CatalogService.categories({ ...filters });
            categories.value = res?.data?.result?.categories ?? emptyPagination;
        } finally {
            isLoading.value = false;
        }
    };

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        Object.assign(filters, newFilters);
        filters.page = 1;
        router.replace({ query: { ...filters } });
        fetchCategories();
    };

    const handleSearchQuery = (query: string) => handleFilterChange({ search: query });
    const setLoading = (value: boolean) => (isLoading.value = value);
    const filterData = (data: any) => (categories.value = data?.result?.categories ?? emptyPagination);

    const init = () => {
        Helpers.loadFiltersFromQuery(filters, route.query as Record<string, any>);
        fetchCategories();
    };

    return {
        categories,
        isLoading,
        filters,
        fetchCategories,
        handleFilterChange,
        handleSearchQuery,
        setLoading,
        filterData,
        init,
    };
}
