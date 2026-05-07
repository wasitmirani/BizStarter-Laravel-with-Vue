import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';

export function useVariantForm(variantData?: any, isEditMode?: boolean) {
    const errors = Helpers.useDynamicRef<any>({});
    const isLoading = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        'toast',
        { showToast: () => {} }
    );

    const variant = Helpers.useDynamicReactive({
        uuid: '',
        product_id: null,
        name: '',
        sku: '',
        barcode: '',
        price: 0,
        retail_price: 0,
        thumbnail: '',
        status: 'active',
        is_default: false,
        sort_order: 0,
        ...((variantData ?? {}) as object),
    });

    const products = Helpers.useDynamicRef<any[]>([]);

    const addThumbnail = (media: any): void => {
        if (media?.name) {
            variant.thumbnail = media.name;
        }
    };

    const currentThumbnailUrl = Helpers.useDynamicComputed(() => {
        if (!variant.thumbnail) {
            return '';
        }
        if (String(variant.thumbnail).startsWith('http')) {
            return variant.thumbnail;
        }
        return `/storage/images/product/${variant.thumbnail}`;
    });

    const loadProducts = async () => {
        const res = await CatalogService.products({ paginated: false, per_page: 500 });
        products.value = res?.data?.result?.products?.data ?? res?.data?.result?.products ?? [];
    };

    const onSubmit = async () => {
        errors.value = {};
        isLoading.value = true;
        try {
            const payload = {
                ...variant,
                product_id: variant.product_id ? Number(variant.product_id) : null,
                sort_order: Number(variant.sort_order || 0),
                price: Number(variant.price || 0),
                retail_price: Number(variant.retail_price || 0),
                is_default: Boolean(variant.is_default),
            };
            if (isEditMode && variant.uuid) {
                await CatalogService.updateVariant(variant.uuid, payload);
            } else {
                await CatalogService.storeVariant(payload);
            }
            toast.value?.showToast(200, 'Variant', 'Variant saved successfully');
            Helpers.router().push({ name: 'variants' });
        } catch (err: any) {
            errors.value = err?.response?.data?.errors ?? {};
            toast.value?.showToast(err?.response?.status ?? 500, 'Error', err?.response?.data?.message ?? 'Save failed');
        } finally {
            isLoading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(loadProducts);
    return { variant, products, errors, isLoading, onSubmit, addThumbnail, currentThumbnailUrl };
}
