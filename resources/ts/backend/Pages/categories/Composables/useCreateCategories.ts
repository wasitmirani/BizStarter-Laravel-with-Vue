import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';

export function useCreateCategory() {
    const category = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef(false);
    const loading = Helpers.useDynamicRef(false);

    const getCategory = async () => {
        loading.value = true;
        try {
            const res = await CatalogService.category(Helpers.route().params.uuid.toString());
            category.value = res?.data?.result?.category ?? {};
            editmode.value = true;
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.uuid) {
            getCategory();
        }
    });

    return {
        category,
        editmode,
        loading,
    };
}
