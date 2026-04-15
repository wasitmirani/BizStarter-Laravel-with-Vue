import { Helpers } from '../../../Utils/Helper';
import RoleService from '../../../Services/Role/RoleService';
import { DropdownOptions } from "../../../Utils/DropdownOptions";

export function useCreateRole() {
    const draftStatus = Helpers.useDynamicRef<any>(null);
    const role = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef<any>(false);
    const loading = Helpers.useDynamicRef<boolean>(false);

    const saveDraftHandler = (status?: string): void => {
        draftStatus.value = status || 'no status provided';
        console.log(`Save draft with status: ${draftStatus.value}`);
    };

    const handleSubmitForm = (formData: any): void => {
        console.log('Form submitted with data:', formData);
        saveDraftHandler('submitted');
    };

    const getRole = async () => {
        loading.value = true;
        try {
            const roleId = Helpers.route().params.id?.toString();
            if (roleId) {
                const res = await RoleService.role(roleId);
                role.value = res.data.result?.role || res.data.data?.role;
                editmode.value = true;
                console.log("Editmode", editmode.value, "Role:", role.value);
            }
        } catch (error) {
            console.error('Error fetching role:', error);
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        const routeId = Helpers.route().params.id;
        if (routeId) {
            getRole();
        }
    });

    return {
        draftStatus,
        role,
        editmode,
        loading,
        saveDraftHandler,
        handleSubmitForm,
    };
}
