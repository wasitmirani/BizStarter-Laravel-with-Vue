import { AxiosService } from '../../Utils/Service';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

const toQueryString = (params: QueryParams = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
        }
    });
    return queryParams.toString();
};

class Catalog {
    categories(params: QueryParams = {}) {
        const query = toQueryString(params);
        return AxiosService.get(`/category${query ? `?${query}` : ''}`);
    }

    category(uuid: string) {
        return AxiosService.get(`/category/${uuid}`);
    }

    storeCategory(payload: any) {
        return AxiosService.post('/category', payload);
    }

    updateCategory(uuid: string, payload: any) {
        return AxiosService.put(`/category/${uuid}`, payload);
    }

    deleteCategory(uuid: string) {
        return AxiosService.delete(`/category/${uuid}`);
    }

    brands(params: QueryParams = {}) {
        const query = toQueryString(params);
        return AxiosService.get(`/brand${query ? `?${query}` : ''}`);
    }

    brand(uuid: string) {
        return AxiosService.get(`/brand/${uuid}`);
    }

    storeBrand(payload: any) {
        return AxiosService.post('/brand', payload);
    }

    updateBrand(uuid: string, payload: any) {
        return AxiosService.put(`/brand/${uuid}`, payload);
    }

    deleteBrand(uuid: string) {
        return AxiosService.delete(`/brand/${uuid}`);
    }

    products(params: QueryParams = {}) {
        const query = toQueryString(params);
        return AxiosService.get(`/product${query ? `?${query}` : ''}`);
    }

    product(uuid: string) {
        return AxiosService.get(`/product/${uuid}`);
    }

    storeProduct(payload: any) {
        return AxiosService.post('/product', payload);
    }

    updateProduct(uuid: string, payload: any) {
        return AxiosService.put(`/product/${uuid}`, payload);
    }

    deleteProduct(uuid: string) {
        return AxiosService.delete(`/product/${uuid}`);
    }

    variants(params: QueryParams = {}) {
        const query = toQueryString(params);
        return AxiosService.get(`/variant${query ? `?${query}` : ''}`);
    }

    variant(uuid: string) {
        return AxiosService.get(`/variant/${uuid}`);
    }

    storeVariant(payload: any) {
        return AxiosService.post('/variant', payload);
    }

    bulkStoreVariants(payload: any) {
        return AxiosService.post('/variant/bulk-store', payload);
    }

    updateVariant(uuid: string, payload: any) {
        return AxiosService.put(`/variant/${uuid}`, payload);
    }

    deleteVariant(uuid: string) {
        return AxiosService.delete(`/variant/${uuid}`);
    }

    listCategories() {
        return AxiosService.get('/list/categories');
    }

    listBrands() {
        return AxiosService.get('/list/brands');
    }
}

export const CatalogService = new Catalog();
