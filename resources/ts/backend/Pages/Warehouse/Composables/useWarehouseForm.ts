import WarehouseService from "../../../Services/Warehouse/WarehouseService";
import { Helpers } from "../../../Utils/Helper";
import { useDropDownsStore } from '@/Backend/Stores/DropDownsStore';
import { storeToRefs } from 'pinia';

export function useWarehouseForm(initialWarehouse?: any, isEditMode: boolean = false) {
    const errors = Helpers.useDynamicRef<any>([]);
    const isLoading = Helpers.useDynamicRef(false);
    const dropdownStore = useDropDownsStore();
    const { countries } =
    storeToRefs(dropdownStore);

    Helpers.useDynamicOnMounted(async () => {
    await dropdownStore.fetchDropdowns();

    console.log("countries", countries.value); // ✅ correct
    });
    console.log("countries",countries.value); // ✅ correct
    const countryOptions =  Helpers.useDynamicComputed(() => countries.value ?? []);


    
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        "toast",
        { showToast: () => {} }
    );

    const warehouse = Helpers.useDynamicReactive({
        id: null,
        name: "",
        label: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
        region: "",
        zipcode: "",
        longitude: "",
        latitude: "",
        timezone: "",
        status: "active",
        is_default: false,
        picking_method: "",
        receiving_method: "",
        receiving_type: "",
        allow_partial_packing: false,
        allow_partial_picking: false,
        scan_unique_location: false,
        scan_unique_container: false,
        contact_first_name: "",
        contact_last_name: "",
        contact_email: "",
        contact_phone: "",
        ...(initialWarehouse ?? {}),
    });

    const findOptionByValue = (options: any[], value: unknown) =>
        options.find((item: any) => String(item.value) === String(value)) ?? null;

    const countryModel = Helpers.useDynamicComputed({
        get: () => findOptionByValue(countryOptions.value, warehouse.country_id ?? warehouse.country),
        set: (selected: any) => {
            warehouse.country_id = selected?.value ?? null;
        },
    });



    const onStore = async (data: any) => {
        isLoading.value = true;
        try {
            const res: any = await WarehouseService.store(data);
            toast.value.showToast(res.status, "Warehouse Created", res.data?.message || "Warehouse created");
            Helpers.router().push({ name: "warehouses" });
        } catch (err: any) {
            errors.value = err.response?.data?.errors || { general: ["Failed to create warehouse"] };
            toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message || "Failed to create warehouse");
        } finally {
            isLoading.value = false;
        }
    };

    const onUpdate = async (data: any) => {
        isLoading.value = true;
        try {
            const res: any = await WarehouseService.update(data);
            toast.value.showToast(res.status, "Warehouse Updated", res.data?.message || "Warehouse updated");
            Helpers.router().push({ name: "warehouses" });
        } catch (err: any) {
            errors.value = err.response?.data?.errors || { general: ["Failed to update warehouse"] };
            toast.value.showToast(err.response?.status || 500, "Error", err.response?.data?.message || "Failed to update warehouse");
        } finally {
            isLoading.value = false;
        }
    };

    const onSubmit = () => {
        const payload = {
            ...warehouse,
            country: countryModel.value?.value || "",
        };
        if (isEditMode) {
            onUpdate(payload);
            return;
        }
        onStore(payload);
    };

    return {
        warehouse,
        errors,
        isLoading,
        onSubmit,
        countryModel,
        countryOptions,
    };
}
