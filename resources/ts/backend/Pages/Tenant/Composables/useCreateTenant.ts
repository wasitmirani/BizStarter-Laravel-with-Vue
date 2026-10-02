import { Helpers } from '../../../Utils/Helper';
import TenantService from '../../../Services/Tenant/TenantService';

export function useCreateTenant() {
    const tenant = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef<boolean>(false);
    const loading = Helpers.useDynamicRef<boolean>(false);

    const getTenant = async () => {
        loading.value = true;
        try {
            const res = await TenantService.tenant(Helpers.route().params.id.toString());
            tenant.value = res.data.result.tenant;
            editmode.value = true;
        } catch (error) {
            console.error('Error fetching tenant:', error);
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.id) {
            getTenant();
        }
    });

    return {
        tenant,
        editmode,
        loading,
    };
}
