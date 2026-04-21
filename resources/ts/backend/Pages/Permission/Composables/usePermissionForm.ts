import DropDownService from "../../../Services/DropDown/DropDownService";
import PermissionService from "../../../Services/Permission/PermissionService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";

export  function usePermissionForm(permission?: any, isEditMode: boolean = false) {
    // ─── State ────────────────────────────────────────────────────────────────
    const router = Helpers.router();
    let errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);

    // ─── Dropdown Options ─────────────────────────────────────────────────────
    const usersDropdownItems = Helpers.useDynamicRef<any>([]);
    const rolesDropdownItems = Helpers.useDynamicRef<any>([]);

  const init = async () => {
    try {
        const usersResponse = await DropDownService.getUsers({ sort_by: 'name', sort_dir: 'asc' });
        const usersData = usersResponse?.data?.result?.users || usersResponse?.data?.users || [];

        usersDropdownItems.value = DropdownOptions.getUsersListOptions(usersData || []);
    } catch (e) {
        usersDropdownItems.value = [];
    }

    try {
        const rolesResponse = await DropDownService.getRoles({ sort_by: 'name', sort_dir: 'asc' });
        const RolesData = rolesResponse?.data?.result?.roles || rolesResponse?.data?.roles || [];

        rolesDropdownItems.value = DropdownOptions.getPermissionsListOptions(RolesData || []);
    } catch (e) {
        rolesDropdownItems.value = [];
    }
};

    // ─── Role Reactive Object ─────────────────────────────────────────────────
    const role = Helpers.useDynamicReactive({
        'id': null,
        'name': '',
        'roles': [],
        'users':  [],
        ...(permission ?? {})
    });

    const bindData = (items?:any)=>{
        if(!items){
            return [];
        }
        return items?.map((item: any) => item.value || item) || [];
    }
    // ─── API Call ─────────────────────────────────────────────────────────────
    const permissionStore = async (data: any) => {
        isLoading.value = true;
         console.log("permission Data Before Store:", data);
         data.users = bindData(data?.users)
         data.roles =  bindData(data?.roles )

        await PermissionService.store(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'Permission Created', res.data);
                setTimeout(() => {
                    Helpers.router().push({ name: 'permissions' });
                }, 300);
            })
            .catch((err: any) => {
                if (err.response?.data) {
                    errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                    console.log("Errors:", errors.value);
                    toast.value?.showToast?.(err.response.status, 'Error: ' + err.status, err.response.data?.message || 'Failed to create role');
                }
            })
            .finally(() => {
                  setTimeout(() => {
                isLoading.value = false;
            }, 600);
            });
    };

    const permissionUpdate = async (data: any) => {
        isLoading.value = true;

        const permissionId = data?.id;
        if (!permissionId) {
            toast.value?.showToast?.(400, 'Error', 'Missing role id for update');
            isLoading.value = false;
            return;
        }

        data.users = bindData(data?.users)
        data.roles =  bindData(data?.roles )

        await PermissionService.update(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'Role Updated', res.data);
                console.log("Navigating to roles...", router);
                setTimeout(() => {
                    Helpers.router().push({ name: 'permissions' });
                }, 300);
            })
            .catch((err: any) => {
                if (err.response?.data) {
                    errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                    toast.value?.showToast?.(err.response.status, 'Error: ' + err.status, err.response.data?.message || 'Failed to update role');
                }
            })
            .finally(() => {
                isLoading.value = false;
            });
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const onSubmit = (_type?: string): void => {
        // Create a shallow clone to avoid modifying the reactive role directly.
        const permissionPayload = {
            ...permission,
        };

        if (isEditMode) {
            permissionUpdate(permissionPayload);
        } else {
            permissionStore(permissionPayload);
        }
    };

    Helpers.useDynamicOnMounted(() => {
        init();
    });

    return {
        // state
        permission,
        errors,
        isLoading,
        onSubmit,
        usersDropdownItems,
        rolesDropdownItems,
    };
}
