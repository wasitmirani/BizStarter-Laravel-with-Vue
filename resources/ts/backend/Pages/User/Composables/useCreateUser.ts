import { Helpers } from '../../../Utils/Helper';
import { UserService } from '../../../Services/user/UserService';

export function useCreateUser() {
    const draftStatus = Helpers.useDynamicRef<any>(null);
    const user = Helpers.useDynamicRef<any>({});
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
            const res = await UserService.user(Helpers.route().params.uuid.toString());
            user.value = res.data.result.user;
            editmode.value = true;
            console.log("Editmode", editmode.value);
        } catch (error) {
            console.error('Error fetching user:', error);
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
        user,
        editmode,
        loading, // Return loading state
        saveDraftHandler,
        handleSubmitForm,
    };
}
