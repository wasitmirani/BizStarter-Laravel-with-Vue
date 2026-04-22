import DropDownService from "../../../Services/DropDown/DropDownService";
import RoleService from "../../../Services/Role/RoleService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";
import { useRouter } from "vue-router";

export  function useRoleForm(roleData?: any, isEditMode: boolean = false) {
    // ─── State ────────────────────────────────────────────────────────────────
    const router = useRouter();
    let errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);

    // ─── Dropdown Options ─────────────────────────────────────────────────────
    const usersDropdownItems = Helpers.useDynamicRef<any>([]);
    const permissionsDropdownItems = Helpers.useDynamicRef<any>([]);

  const init = async () => {
    try {
        const usersResponse = await DropDownService.getUsers({ sort_by: 'name', sort_dir: 'asc' });
        const usersData = usersResponse?.data?.result?.users || usersResponse?.data?.users || [];

        usersDropdownItems.value = DropdownOptions.getUsersListOptions(usersData || []);
    } catch (e) {
        usersDropdownItems.value = [];
    }

    try {
        const permissionsResponse = await DropDownService.getPermissions({ sort_by: 'name', sort_dir: 'asc' });
        const permissionsData = permissionsResponse?.data?.result?.permissions || permissionsResponse?.data?.permissions || [];

        permissionsDropdownItems.value = DropdownOptions.getPermissionsListOptions(permissionsData || []);
    } catch (e) {
        permissionsDropdownItems.value = [];
    }
};

    // ─── Role Reactive Object ─────────────────────────────────────────────────
    const role = Helpers.useDynamicReactive({
        'id': null,
        'name': '',
        'permissions': [],
        'users': roleData?.users?.map((user: any) => ({ value: user.id, label: user.name })) || [],
        ...(roleData ?? {})
    });

    // ─── API Call ─────────────────────────────────────────────────────────────
    const roleStore = async (data: any): void => {
        isLoading.value = true;
       console.log("Role Data Before Store:", data);
       const users = data.users?.map((user: any) => user.value || user) || [];
        const permissions = data.permissions?.map((permission: any) => permission.value || permission) || [];
        data.users = users;
        data.permissions = permissions;
        await RoleService.store(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'Role Created', res.data);

                setTimeout(() => {
                    Helpers.router().push({ name: 'roles' });
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

    const roleUpdate = async (data: any): void => {
        isLoading.value = true;

        const roleId = data?.id;
        if (!roleId) {
            toast.value?.showToast?.(400, 'Error', 'Missing role id for update');
            isLoading.value = false;
            return;
        }

        const users = data.users?.map((user: any) => user.value || user) || [];
        const permissions = data.permissions?.map((permission: any) => permission.value || permission) || [];
        data.users = users;
        data.permissions = permissions;

        await RoleService.update(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'Role Updated', res.data);
                console.log("Navigating to roles...", router);
                try {
                    router.push({ name: 'roles' }).catch((err) => {
                        console.error("Navigation error:", err);
                        Helpers.navigateTo('roles');
                    });
                } catch(e) {
                    console.error("Router push exception:", e);
                    Helpers.navigateTo('roles');
                }
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
        const rolePayload = {
            ...role,
        };

        if (isEditMode) {
            roleUpdate(rolePayload);
        } else {
            roleStore(rolePayload);
        }
    };

    Helpers.useDynamicOnMounted(() => {
        init();
    });

    return {
        // state
        role,
        errors,
        isLoading,
        onSubmit,
        usersDropdownItems,
        permissionsDropdownItems,
    };
}
