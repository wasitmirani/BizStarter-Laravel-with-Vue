import SupplierService from "../../../Services/Supplier/SupplierService";
import { Helpers } from "../../../Utils/Helper";

export function useSupplierForm(initialSupplier?: any, isEditMode: boolean = false) {
    const errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        "toast",
        { showToast: () => {} }
    );

    const supplier = Helpers.useDynamicReactive({
        id: null,
        name: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
        region: "",
        zipcode: "",
        status: "active",
        contact_first_name: "",
        contact_last_name: "",
        contact_email: "",
        contact_phone: "",
        ...(initialSupplier ?? {}),
    });

    const countryOptions = [
        { value: "PK", label: "Pakistan" },
        { value: "IN", label: "India" },
        { value: "US", label: "United States" },
        { value: "AE", label: "United Arab Emirates" },
        { value: "SA", label: "Saudi Arabia" },
        { value: "GB", label: "United Kingdom" },
    ];

    const countryModel = Helpers.useDynamicRef<any>(null);

    Helpers.useDynamicOnMounted(() => {
        if (supplier.country) {
            countryModel.value = countryOptions.find((item) => item.value === supplier.country) || null;
        }
    });

    const onStore = async (data: any) => {
        isLoading.value = true;
        try {
            const res: any = await SupplierService.store(data);
            toast.value.showToast(res.status, "Supplier Created", res.data?.message || "Supplier created");
            Helpers.router().push({ name: "suppliers" });
        } catch (err: any) {
            errors.value = err.response?.data?.errors || { general: ["Failed to create supplier"] };
            toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message || "Failed to create supplier");
        } finally {
            isLoading.value = false;
        }
    };

    const onUpdate = async (data: any) => {
        isLoading.value = true;
        try {
            const res: any = await SupplierService.update(data);
            toast.value.showToast(res.status, "Supplier Updated", res.data?.message || "Supplier updated");
            Helpers.router().push({ name: "suppliers" });
        } catch (err: any) {
            errors.value = err.response?.data?.errors || { general: ["Failed to update supplier"] };
            toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message || "Failed to update supplier");
        } finally {
            isLoading.value = false;
        }
    };

    const onSubmit = () => {
        const payload = {
            ...supplier,
            country: countryModel.value?.value || "",
        };
        if (isEditMode) {
            onUpdate(payload);
            return;
        }
        onStore(payload);
    };

    return {
        supplier,
        errors,
        isLoading,
        onSubmit,
        countryModel,
        countryOptions,
    };
}
