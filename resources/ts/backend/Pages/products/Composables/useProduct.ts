import { reactive } from 'vue';
import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';

const emptyPagination = { data: [], current_page: 1, last_page: 1, from: 0, to: 0, total: 0 };

export function useProducts() {
    const products = Helpers.useDynamicRef<any>(emptyPagination);
    const isLoading = Helpers.useDynamicRef(false);
    const filters = reactive({ page: 1, per_page: 10, search: '', sort_by: 'id', sort_dir: 'desc' });

    const fetchProducts = async (page?: number, perPage?: number) => {
        if (page) filters.page = page;
        if (perPage) filters.per_page = perPage;
        isLoading.value = true;
        try {
            const res = await CatalogService.products({ ...filters });
            products.value = res?.data?.result?.products ?? emptyPagination;
        } finally {
            isLoading.value = false;
        }
    };

    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        Object.assign(filters, newFilters);
        filters.page = 1;
        fetchProducts();
    };

    const handleSearchQuery = (query: string) => handleFilterChange({ search: query });
    const setLoading = (value: boolean) => (isLoading.value = value);
    const filterData = (data: any) => (products.value = data?.result?.products ?? emptyPagination);
    const init = () => fetchProducts();

    return { products, isLoading, filters, fetchProducts, handleFilterChange, handleSearchQuery, setLoading, filterData, init };
}
