import DriverService from "../../../Services/Driver/DriverService";
import WarehouseService from "../../../Services/Warehouse/WarehouseService";
import { DropdownOptions } from "../../../Utils/DropdownOptions";
import { Helpers } from "../../../Utils/Helper";

export function extractProfileImageFilename(value: string | undefined | null): string {
    if (!value) {
        return "";
    }

    const str = String(value);
    if (str.includes("user-5.jpg") || str.includes("user-1.jpg") || str.includes("/backend/images/users/")) {
        return "";
    }

    if (str.startsWith("http") || str.startsWith("/")) {
        const parts = str.split("/");
        return parts[parts.length - 1] || "";
    }

    return str;
}

export function useDriverForm(initialDriver?: any, isEditMode: boolean = false) {
    const errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const warehousesDropdownItems = Helpers.useDynamicRef<any[]>([]);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        "toast",
        { showToast: () => {} }
    );

    const initialFilename = extractProfileImageFilename(initialDriver?.profile_image);
    const initialSavedMedia = initialFilename ? [{ name: initialFilename }] : [];
    const initialWarehouseIds = initialDriver?.warehouses?.map((warehouse: any) => Number(warehouse.id)) ?? initialDriver?.warehouse_ids ?? [];

    const driver = Helpers.useDynamicReactive({
        id: null,
        full_name: "",
        type: "driver",
        phone: "",
        email: "",
        cnic: "",
        license_number: "",
        license_expiry_date: "",
        address: "",
        city: "",
        joining_date: "",
        status: "active",
        password: "",
        password_confirmation: "",
        ...(initialDriver ?? {}),
        profile_image: initialFilename,
        warehouse_ids: initialWarehouseIds,
    });

    const typeOptions = [
        { value: "driver", label: "Driver" },
        { value: "clearing-agent", label: "Clearing Agent" },
    ];

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "suspended", label: "Suspended" },
        { value: "on-leave", label: "On Leave" },
    ];

    const loadWarehouses = async () => {
        try {
            const res = await WarehouseService.warehouses({ paginated: false, sort_by: "name", sort_dir: "asc" });
            const list = res?.data?.result?.warehouses?.data ?? res?.data?.result?.warehouses ?? [];
            warehousesDropdownItems.value = DropdownOptions.getWarehousesListOptions(list);
        } catch {
            warehousesDropdownItems.value = [];
        }
    };

    const handleProfileMediaChange = (allMedia: { name: string }[] = []): void => {
        driver.profile_image = allMedia.length > 0 ? allMedia[allMedia.length - 1].name : "";
    };

    const buildPayload = () => {
        const payload = { ...driver };
        if (isEditMode && !payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
        }
        return payload;
    };

    const onStore = async (data: any) => {
        isLoading.value = true;
        try {
            const res: any = await DriverService.store(data);
            toast.value.showToast(res.status, "Driver Created", res.data?.message || "Driver created");
            Helpers.router().push({ name: "drivers" });
        } catch (err: any) {
            errors.value = err.response?.data?.errors || { general: ["Failed to create driver"] };
            toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message || "Failed to create driver");
        } finally {
            isLoading.value = false;
        }
    };

    const onUpdate = async (data: any) => {
        isLoading.value = true;
        try {
            const res: any = await DriverService.update(data);
            toast.value.showToast(res.status, "Driver Updated", res.data?.message || "Driver updated");
            Helpers.router().push({ name: "drivers" });
        } catch (err: any) {
            errors.value = err.response?.data?.errors || { general: ["Failed to update driver"] };
            toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message || "Failed to update driver");
        } finally {
            isLoading.value = false;
        }
    };

    const onSubmit = () => {
        if (isEditMode) {
            onUpdate(buildPayload());
            return;
        }
        onStore(buildPayload());
    };

    Helpers.useDynamicOnMounted(() => {
        loadWarehouses();
    });

    return {
        driver,
        errors,
        isLoading,
        onSubmit,
        typeOptions,
        statusOptions,
        initialSavedMedia,
        handleProfileMediaChange,
        profileImageLocation: "/storage/images/user",
        warehousesDropdownItems,
        showPassword: !isEditMode,
    };
}
