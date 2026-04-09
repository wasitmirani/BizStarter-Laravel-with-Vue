import { Helpers } from "../../../Utils/Helper";
import { CatalogService } from "../../../Services/catalog/CatalogService";

export function useCategoryForm(categoryData?: any, isEditMode?: boolean) {
    let errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);

    const category = Helpers.useDynamicReactive({
        uuid: '',
        name: '',
        slug: '',
        description: '',
        sort_order: 0,
        ...((categoryData ?? {}) as object),
    });

    const submitCategory = async (data: any): Promise<void> => {
        isLoading.value = true;
        try {
            if (isEditMode && category.uuid) {
                await CatalogService.updateCategory(category.uuid, data);
            } else {
                await CatalogService.storeCategory(data);
            }
            toast.value?.showToast(200, 'Category', 'Category saved successfully');
            Helpers.router().push({ name: 'categories' });
        } catch (err: any) {
            errors.value = err?.response?.data?.errors ?? { general: ['An error occurred.'] };
            toast.value?.showToast(err?.response?.status ?? 500, 'Error', err?.response?.data?.message ?? 'Save failed');
        } finally {
            isLoading.value = false;
        }
    };

    const onSubmit = (): void => {
        submitCategory({ ...category });
    };

    return {
        category,
        errors,
        isLoading,
        onSubmit,
    };
}
