import { Helpers } from "../../../Utils/Helper";
import { CatalogService } from "../../../Services/catalog/CatalogService";

export function useProductForm(productData?: any, isEditMode?: boolean) {
    const errors = Helpers.useDynamicRef<any>({});
    const isLoading = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        'toast',
        { showToast: () => {} }
    );
    const product = Helpers.useDynamicReactive({
        uuid: '',
        name: '',
        thumbnail: '',
        description: '',
        sku: '',
        reference_sku: '',
        barcode: '',
        type: '',
        uom: 'pcs',
        price: 0,
        retail_price: 0,
        category_id: null,
        brand_id: null,
        ...((productData ?? {}) as object),
    });

    const categories = Helpers.useDynamicRef<any[]>([]);
    const brands = Helpers.useDynamicRef<any[]>([]);
    const addThumbnail = (media: any): void => {
        if (media?.name) {
            product.thumbnail = media.name;
        }
    };
    const currentThumbnailUrl = Helpers.useDynamicComputed(() => {
        if (!product.thumbnail) {
            return '';
        }
        if (String(product.thumbnail).startsWith('http')) {
            return product.thumbnail;
        }
        return `/storage/images/product/${product.thumbnail}`;
    });

    const loadOptions = async () => {
        const [categoriesRes, brandsRes] = await Promise.all([
            CatalogService.listCategories(),
            CatalogService.listBrands(),
        ]);
        categories.value = categoriesRes?.data?.result?.categories?.data ?? categoriesRes?.data?.result?.categories ?? [];
        brands.value = brandsRes?.data?.result?.brands?.data ?? brandsRes?.data?.result?.brands ?? [];
    };

    const onSubmit = async () => {
        isLoading.value = true;
        try {
            const payload = { ...product };
            if (isEditMode && product.uuid) {
                await CatalogService.updateProduct(product.uuid, payload);
            } else {
                await CatalogService.storeProduct(payload);
            }
            toast.value?.showToast(200, 'Product', 'Product saved successfully');
            Helpers.router().push({ name: 'products' });
        } catch (err: any) {
            errors.value = err?.response?.data?.errors ?? {};
            toast.value?.showToast(err?.response?.status ?? 500, 'Error', err?.response?.data?.message ?? 'Save failed');
        } finally {
            isLoading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(loadOptions);
    return { product, categories, brands, errors, isLoading, onSubmit, addThumbnail, currentThumbnailUrl };
}
