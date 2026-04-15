import { Helpers } from '../../../Utils/Helper';
import { PurchasesService } from '../../../Services/purchases/PurchasesService';

export function useCreatePurchaseOrder() {
    const purchaseOrder = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef(false);
    const loading = Helpers.useDynamicRef(false);

    const getPurchaseOrder = async () => {
        loading.value = true;
        try {
            const res = await PurchasesService.purchaseOrder(Helpers.route().params.uuid.toString());
            purchaseOrder.value = res?.data?.result?.purchase_order ?? {};
            editmode.value = true;
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.uuid) getPurchaseOrder();
    });

    return { purchaseOrder, editmode, loading };
}
