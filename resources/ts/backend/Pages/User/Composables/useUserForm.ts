import  UserService  from '@/Backend/Services/User/UserService';
import { DropdownOptions } from '@/Backend/Utils/DropdownOptions';
import { Helpers } from '@/Backend/Utils/Helper'
import { useDropDownsStore } from '@/Backend/Stores/DropDownsStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';


export function useUserForm(userData?: any, isEditMode: boolean = false) {
      // ─── Store ─────────────────────────────────────────
    const dropdownStore = useDropDownsStore();

    const { countries, timezones, languages, currencies } =
    storeToRefs(dropdownStore);

    Helpers.useDynamicOnMounted(async () => {
    await dropdownStore.fetchDropdowns();

    console.log("countries", countries.value); // ✅ correct
    });
    // ─── State ────────────────────────────────────────────────────────────────
    let errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const showPassword = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject('toast', null);
    const originalThumbnail = Helpers.useDynamicRef<string>(userData?.thumbnail || '');

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
        country_id: null as string | number | null,
        timezone_id: null as string | number | null,
        language_id: null as string | number | null,
        ...(userData ?? {})
    });

    const findOptionByValue = (options: any[], value: unknown) =>
        options.find((item: any) => String(item.value) === String(value)) ?? null;

    const countryOptions =  Helpers.useDynamicComputed(() => countries.value ?? []);
    const timezoneOptions = Helpers.useDynamicComputed(() => timezones.value ?? []);
    const languageOptions = Helpers.useDynamicComputed(() => languages.value ?? []);

    const countryModel = Helpers.useDynamicComputed({
        get: () => findOptionByValue(countryOptions.value, user.country_id ?? user.country),
        set: (selected: any) => {
            user.country_id = selected?.value ?? null;
        },
    });

    const timezoneModel = Helpers.useDynamicComputed({
        get: () => findOptionByValue(timezoneOptions.value, user.timezone_id),
        set: (selected: any) => {
            user.timezone_id = selected?.value ?? null;
        },
    });

    const languageModel = Helpers.useDynamicComputed({
        get: () => findOptionByValue(languageOptions.value, user.language_id),
        set: (selected: any) => {
            user.language_id = selected?.value ?? null;
        },
    });

    // ─── Phone Input ──────────────────────────────────────────────────────────


    // ─── Thumbnail ────────────────────────────────────────────────────────────
    const addThumbnail = (media: any): void => {
        if (media) {
            user.thumbnail = media.name;
        }
    };

    const removeThumbnail = (): void => {
        user.thumbnail = '';
    };

    const resetThumbnail = (): void => {
        user.thumbnail = originalThumbnail.value;
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
    const userStore = async (data: any): void => {
        isLoading.value = true;

       await UserService.store(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'User Store', res.data);
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

    const userUpdate = async (data: any): void => {
        isLoading.value = true;

        const userId = data?.id;
        if (!userId) {
            toast.value?.showToast?.(400, 'Error', 'Missing user id for update');
            isLoading.value = false;
            return;
        }

        await UserService.update(data)
            .then((res: any) => {
                toast.value?.showToast?.(res.status, 'User Updated', res.data);
                setTimeout(() => {
                    Helpers.router().push({ name: 'users' });
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
        // Create a shallow clone to avoid modifying the reactive user directly.
        const userPayload = {
            ...user,
            name: [user.first_name, user.last_name].filter(Boolean).join(' ').trim(),
        };

        if (isEditMode) {
            userUpdate(userPayload);
        } else {
            userStore(userPayload);
        }
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

         // dropdowns (reactive ✅)
         countries,
         timezones,
         languages,
         currencies,
         countryModel,
         timezoneModel,
         languageModel,
         countryOptions,
         timezoneOptions,
         languageOptions,
        // handlers
        onSubmit,
        addThumbnail,
        removeThumbnail,
        resetThumbnail,
        togglePassword,
        generatePassword,
        copyPassword,
    };
}
