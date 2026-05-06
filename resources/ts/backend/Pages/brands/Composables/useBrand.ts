import { reactive } from 'vue';
import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';

const emptyPagination = { data: [], current_page: 1, last_page: 1, from: 0, to: 0, total: 0 };

export function useBrands() {
    const brands = Helpers.useDynamicRef<any>(emptyPagination);
    const isLoading = Helpers.useDynamicRef(false);
    const filters = reactive({ page: 1, per_page: 10, search: '', sort_by: 'id', sort_dir: 'desc' });

    const fetchBrands = async (page?: number, perPage?: number) => {
        if (page) filters.page = page;
        if (perPage) filters.per_page = perPage;
        isLoading.value = true;
        try {
            const res = await CatalogService.brands({ ...filters });
            brands.value = res?.data?.result?.brands ?? emptyPagination;
        } finally {
            isLoading.value = false;
        }
    };

    const handleSearchQuery = (query: string) => {
        filters.search = query;
        filters.page = 1;
        fetchBrands();
    };

    return { brands, isLoading, filters, fetchBrands, handleSearchQuery, init: fetchBrands };
}
