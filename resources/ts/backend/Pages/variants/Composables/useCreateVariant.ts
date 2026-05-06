import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';

export function useCreateVariant() {
    const variant = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef(false);
    const loading = Helpers.useDynamicRef(false);

    const getVariant = async () => {
        loading.value = true;
        try {
            const res = await CatalogService.variant(Helpers.route().params.uuid.toString());
            variant.value = res?.data?.result?.variant ?? {};
            editmode.value = true;
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.uuid) getVariant();
    });

    return { variant, editmode, loading };
}
