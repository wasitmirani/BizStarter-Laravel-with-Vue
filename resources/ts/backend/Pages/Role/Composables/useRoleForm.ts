import  RoleService  from "../../../Services/Role/RoleService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";

export function useRoleForm(roleData?: any, isEditMode: boolean = false) {
    // ─── State ────────────────────────────────────────────────────────────────
    let errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const showPassword = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);

    // ─── Dropdown Options ─────────────────────────────────────────────────────
    const genderDropdownItems = DropdownOptions.genderOptions();
    const maritalStatusDropdownItems = DropdownOptions.maritalStatusOptions();

    // ─── Role Reactive Object ─────────────────────────────────────────────────
    const role = Helpers.useDynamicReactive({
        'name': '',
        'permissions': [],
        'users':[],
        ...(roleData ?? {})
    });

    // ─── API Call ─────────────────────────────────────────────────────────────
    const roleStore = async (data: any): void => {
        isLoading.value = true;

       await RoleService.store(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'Role Store', res.data);
                setTimeout(() => {
                    Helpers.router().push({ name: 'users' });
                }, 100);
            })
            .catch((err: any) => {
                if (err.response.data) {
                    errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                    console.log("Errors:", errors.value);
                    toast.value?.showToast?.(err.response.status, 'Error: ' + err.status, err.response.data);
                }
            });

        setTimeout(() => {
            isLoading.value = false;
        }, 200);
    };

    const roleUpdate = async (data: any): void => {
        isLoading.value = true;

        const userId = data?.id;
        if (!userId) {
            toast.value?.showToast?.(400, 'Error', 'Missing role id for update');
            isLoading.value = false;
            return;
        }

        await RoleService.update(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'Role Updated', res.data);
                setTimeout(() => {
                    Helpers.router().push({ name: 'roles' });
                }, 100);
            })
            .catch((err: any) => {
                if (err.response?.data) {
                    errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                    toast.value?.showToast?.(err.response.status, 'Error: ' + err.status, err.response.data);
                }
            })
            .finally(() => {
                setTimeout(() => {
                    isLoading.value = false;
                }, 200);
            });
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const onSubmit = (_type?: string): void => {
        // Create a shallow clone to avoid modifying the reactive role directly.
        const rolePayload = {
            ...role,
            name: [role.first_name, role.last_name].filter(Boolean).join(' ').trim(),
        };

        if (isEditMode) {
            roleUpdate(rolePayload);
        } else {
            roleStore(rolePayload);
        }
    };

    return {
        // state
        role,
        errors,
        isLoading,
        showPassword,
        // dropdowns
        genderDropdownItems,
        maritalStatusDropdownItems,
        // handlers
        onSubmit,
       
    };
}
