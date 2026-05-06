import { Helpers } from '../../../Utils/Helper';
import  RoleService  from '../../../Services/Role/RoleService';
import { DropdownOptions } from "../../../Utils/DropdownOptions";

export function useCreateRole() {
    const draftStatus = Helpers.useDynamicRef<any>(null);
    const role = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef<any>(false);
    const loading = Helpers.useDynamicRef<boolean>(false); // Add loading state

    const saveDraftHandler = (status?: string): void => {
        draftStatus.value = status || 'no status provided';
        console.log(`Save draft with status: ${draftStatus.value}`);
    };

    const handleSubmitForm = (formData: any): void => {
        console.log('Form submitted with data:', formData);
        saveDraftHandler('submitted');
    };

    const getUser = async () => {
        loading.value = true; // Set loading to true before fetching
        try {
            const res = await RoleService.role(Helpers.route().params.uuid.toString());
            role.value = res.data.result.role;
            editmode.value = true;
            console.log("Editmode", editmode.value);
        } catch (error) {
            console.error('Error fetching role:', error);
            // Optionally handle error (show error message, etc.)
        } finally {
            loading.value = false; // Set loading to false after fetch completes
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.uuid) {
            getUser();
        }
    });

    return {
        draftStatus,
        role,
        editmode,
        loading, // Return loading state
        saveDraftHandler,
        handleSubmitForm,
    };
}
