import DropDownService from "../../../Services/DropDown/DropDownService";
import RoleService from "../../../Services/Role/RoleService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";

export async function useRoleForm(roleData?: any, isEditMode: boolean = false) {
    // ─── State ────────────────────────────────────────────────────────────────
    let errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);

    // ─── Dropdown Options ─────────────────────────────────────────────────────
    let usersDropdownItems: any[] = [];
    let permissionsDropdownItems: any[] = [];

    try {
        const usersResponse = await DropDownService.getUsers({ sort_by: 'name', sort_dir: 'asc' });
        const usersData = usersResponse?.data?.result?.users || usersResponse?.data?.users || [];
        console.log("Users API Response:", usersResponse);
        console.log("Extracted Users Data:", usersData);
        usersDropdownItems = DropdownOptions.getUsersListOptions(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
        console.error("Error fetching users:", error);
        usersDropdownItems = [];
    }

    try {
        const permissionsResponse = await DropDownService.getPermissions({ sort_by: 'name', sort_dir: 'asc' });
        const permissionsData = permissionsResponse?.data?.result?.permissions || permissionsResponse?.data?.permissions || [];
        console.log("Permissions API Response:", permissionsResponse);
        console.log("Extracted Permissions Data:", permissionsData);
        permissionsDropdownItems = DropdownOptions.getPermissionsListOptions(Array.isArray(permissionsData) ? permissionsData : []);
    } catch (error) {
        console.error("Error fetching permissions:", error);
        permissionsDropdownItems = [];
    }

    // ─── Role Reactive Object ─────────────────────────────────────────────────
    const role = Helpers.useDynamicReactive({
        'id': null,
        'name': '',
        'permissions': [],
        'users': [],
        ...(roleData ?? {})
    });

    // ─── API Call ─────────────────────────────────────────────────────────────
    const roleStore = async (data: any): void => {
        isLoading.value = true;

        await RoleService.store(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'Role Created', res.data);
                setTimeout(() => {
                    Helpers.router().push({ name: 'roles' });
                }, 100);
            })
            .catch((err: any) => {
                if (err.response?.data) {
                    errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                    console.log("Errors:", errors.value);
                    toast.value?.showToast?.(err.response.status, 'Error: ' + err.status, err.response.data?.message || 'Failed to create role');
                }
            })
            .finally(() => {
                isLoading.value = false;
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
