import { UserService } from "../../../Services/user/UserService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";

export function useUserForm() {
    // ─── State ────────────────────────────────────────────────────────────────
    let errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const showPassword = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);

    // ─── Dropdown Options ─────────────────────────────────────────────────────
    const genderDropdownItems = DropdownOptions.genderOptions();
    const maritalStatusDropdownItems = DropdownOptions.maritalStatusOptions();

    // ─── User Reactive Object ─────────────────────────────────────────────────
    const user = Helpers.useDynamicReactive({
        phone: '',
        thumbnail: '',
        company_name: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        address: '',
        dob: '',
        gender: '',
        marital_status: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
    });

    // ─── Phone Input ──────────────────────────────────────────────────────────


    // ─── Thumbnail ────────────────────────────────────────────────────────────
    const addThumbnail = (media: any): void => {
        if (media) {
            user.thumbnail = media.name;
        }
    };

    // ─── Password Helpers ─────────────────────────────────────────────────────
    const togglePassword = (): void => {
        showPassword.value = !showPassword.value;
    };

    const generatePassword = (): void => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        user.password = password;
        user.password_confirmation = password;
    };

    const copyPassword = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(user.password);
            toast.value.showToast(200, 'Password Copied', 'Password has been copied to clipboard.');
        } catch {
            toast.value.showToast(500, 'Copy Failed', 'Could not copy password.');
        }
    };

    // ─── API Call ─────────────────────────────────────────────────────────────
    const userStore = (data: any): void => {
        isLoading.value = true;

        UserService.store(data)
            .then((res: any) => {
                toast.value.showToast(res.status, 'User Store', res.data);
                setTimeout(() => {
                    Helpers.router().push({ name: 'users' });
                }, 300);
            })
            .catch((err: any) => {
                if (err.response.data) {
                    errors.value = err.response.data.errors || { general: ['An error occurred.'] };
                    console.log("Errors:", errors.value);
                    toast.value.showToast(err.response.status, 'Error: ' + err.status, err.response.data);
                }
            });

        setTimeout(() => {
            isLoading.value = false;
        }, 1000);
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const onSubmit = (_type?: string): void => {
        // Create a shallow clone to avoid modifying the reactive user directly.
        const userPayload = {
            ...user,
            name: [user.first_name, user.last_name].filter(Boolean).join(' ').trim(),
        };
        userStore(userPayload);
    };

    return {
        // state
        user,
        errors,
        isLoading,
        showPassword,
        // dropdowns
        genderDropdownItems,
        maritalStatusDropdownItems,
        // handlers
        onSubmit,
        addThumbnail,
        togglePassword,
        generatePassword,
        copyPassword,
    };
}
