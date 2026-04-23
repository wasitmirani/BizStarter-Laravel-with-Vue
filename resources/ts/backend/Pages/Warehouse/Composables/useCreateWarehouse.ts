import WarehouseService from "../../../Services/Warehouse/WarehouseService";
import { Helpers } from "../../../Utils/Helper";

export function useCreateWarehouse() {
    const warehouse = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef<any>(false);
    const loading = Helpers.useDynamicRef<boolean>(false);

    const getWarehouse = async () => {
        loading.value = true;
        try {
            const id = Helpers.route().params.id?.toString();
            if (id) {
                const res = await WarehouseService.warehouse(id);
                warehouse.value = res.data.result?.warehouse || res.data.data?.warehouse;
                editmode.value = true;
            }
        } catch (error) {
            console.error("Error fetching warehouse:", error);
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.id) {
            getWarehouse();
        }
    });

    return {
        warehouse,
        editmode,
        loading,
    };
}
