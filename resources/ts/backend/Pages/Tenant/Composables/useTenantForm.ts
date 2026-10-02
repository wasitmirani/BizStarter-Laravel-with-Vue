import TenantService from '@/Backend/Services/Tenant/TenantService';
import { Helpers } from '@/Backend/Utils/Helper';

export function useTenantForm(tenantData?: any, isEditMode: boolean = false) {
    const errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const showPassword = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);

    const primaryDomain = tenantData?.domains?.[0]?.domain ?? tenantData?.domain ?? '';

    const tenant = Helpers.useDynamicReactive({
        name: '',
        email: '',
        domain: primaryDomain,
        status: 'active',
        logo: '',
        primary_color: '#4f46e5',
        timezone: 'UTC',
        locale: 'en',
        admin_name: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirmation: '',
        ...(tenantData ?? {}),
    });

    if (primaryDomain) {
        tenant.domain = primaryDomain;
    }

    const togglePassword = (): void => {
        showPassword.value = !showPassword.value;
    };

    const generatePassword = (): void => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        tenant.admin_password = password;
        tenant.admin_password_confirmation = password;
    };

    const copyPassword = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(tenant.admin_password);
            toast.value?.showToast?.(200, 'Password Copied', 'Password has been copied to clipboard.');
        } catch {
            toast.value?.showToast?.(500, 'Copy Failed', 'Could not copy password.');
        }
    };

    const tenantStore = async (data: any) => {
        isLoading.value = true;
        try {
            const res = await TenantService.store(data);
            toast.value?.showToast?.(res.status, 'Tenant Created', res.data);
            setTimeout(() => {
                Helpers.router().push({ name: 'tenants' });
            }, 100);
        } catch (err: any) {
            if (err.response?.data) {
                errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                toast.value?.showToast?.(err.response.status, 'Error', err.response.data);
            }
        } finally {
            setTimeout(() => {
                isLoading.value = false;
            }, 200);
        }
    };

    const tenantUpdate = async (data: any) => {
        isLoading.value = true;
        const tenantId = data?.id;
        if (!tenantId) {
            toast.value?.showToast?.(400, 'Error', 'Missing tenant id for update');
            isLoading.value = false;
            return;
        }

        const payload = {
            name: data.name,
            email: data.email,
            domain: data.domain,
            status: data.status,
            logo: data.logo,
            primary_color: data.primary_color,
            timezone: data.timezone,
            locale: data.locale,
        };

        try {
            const res = await TenantService.update(tenantId, payload);
            toast.value?.showToast?.(res.status, 'Tenant Updated', res.data);
            setTimeout(() => {
                Helpers.router().push({ name: 'tenants' });
            }, 100);
        } catch (err: any) {
            if (err.response?.data) {
                errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                toast.value?.showToast?.(err.response.status, 'Error', err.response.data);
            }
        } finally {
            setTimeout(() => {
                isLoading.value = false;
            }, 200);
        }
    };

    const onSubmit = (): void => {
        if (isEditMode) {
            tenantUpdate(tenant);
        } else {
            tenantStore({ ...tenant });
        }
    };

    return {
        tenant,
        errors,
        isLoading,
        showPassword,
        onSubmit,
        togglePassword,
        generatePassword,
        copyPassword,
    };
}
