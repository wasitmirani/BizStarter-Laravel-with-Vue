import { Helpers } from '../../../Utils/Helper';
import { UserService } from '../../../Services/user/UserService';


export function useCreateUser() {
    let draftStatus = Helpers.useDynamicReactive<any>(null);
    let user = Helpers.useDynamicReactive<any>({});
    let editmode = Helpers.useDynamicReactive<boolean>(false);

    const saveDraftHandler = (status?: string): void => {
        draftStatus = status || 'no status provided';
        console.log(`Save draft with status: ${draftStatus}`);
    };

    const handleSubmitForm = (formData: any): void => {
        console.log('Form submitted with data:', formData);
        saveDraftHandler('submitted');
    };

    const getUser = (): void => {
        UserService.user(Helpers.route().params.uuid.toString()).then((res) => {
            user= res.data.result.user;
            editmode = true;
        });
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
        saveDraftHandler,
        handleSubmitForm,
    };
}