import SupplierService from "../../../Services/Supplier/SupplierService";
import { Helpers } from "../../../Utils/Helper";

export function useCreateSupplier() {
    const supplier = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef<any>(false);
    const loading = Helpers.useDynamicRef<boolean>(false);

    const getSupplier = async () => {
        loading.value = true;
        try {
            const id = Helpers.route().params.id?.toString();
            if (id) {
                const res = await SupplierService.supplier(id);
                supplier.value = res.data.result?.supplier || res.data.data?.supplier;
                editmode.value = true;
            }
        } catch (error) {
            console.error("Error fetching supplier:", error);
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.id) {
            getSupplier();
        }
    });

    return {
        supplier,
        editmode,
        loading,
    };
}
