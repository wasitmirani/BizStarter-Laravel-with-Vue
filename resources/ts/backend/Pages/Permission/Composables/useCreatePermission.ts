import PermissionService from '../../../Services/Permission/PermissionService'
import { Helpers } from '../../../Utils/Helper';


export function useCreatePermission() {
    const draftStatus = Helpers.useDynamicRef<any>(null);
    const permission = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef<any>(false);
    const loading = Helpers.useDynamicRef<boolean>(false);

    const saveDraftHandler = (status?: string): void => {
        draftStatus.value = status || 'no status provided';
    };

    const handleSubmitForm = (formData: any): void => {
        saveDraftHandler('submitted');
    };

    const getPermission = async () => {
        loading.value = true;
        try {
            const permissionId = Helpers.route().params.id?.toString();
            if (permissionId) {
                const res = await PermissionService.permission(permissionId);
                permission.value = res.data.result?.permission || res.data.data?.permission;
                editmode.value = true;
                
            }
        } catch (error) {
            console.error('Error fetching permission:', error);
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        const routeId = Helpers.route().params.id;
        if (routeId) {
            getPermission();
        }
    });

    return {
        draftStatus,
        permission,
        editmode,
        loading,
        saveDraftHandler,
        handleSubmitForm,
    };
}
