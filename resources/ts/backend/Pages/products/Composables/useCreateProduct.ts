import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';

export function useCreateProduct() {
    const product = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef(false);
    const loading = Helpers.useDynamicRef(false);

    const getProduct = async () => {
        loading.value = true;
        try {
            const res = await CatalogService.product(Helpers.route().params.uuid.toString());
            product.value = res?.data?.result?.product ?? {};
            editmode.value = true;
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.uuid) getProduct();
    });

    return { product, editmode, loading };
}
