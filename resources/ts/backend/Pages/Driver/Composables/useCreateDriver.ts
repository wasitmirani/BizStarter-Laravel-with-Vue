import DriverService from "../../../Services/Driver/DriverService";
import { Helpers } from "../../../Utils/Helper";

export function useCreateDriver() {
    const driver = Helpers.useDynamicRef<any>({});
    const editmode = Helpers.useDynamicRef<any>(false);
    const loading = Helpers.useDynamicRef<boolean>(false);

    const getDriver = async () => {
        loading.value = true;
        try {
            const id = Helpers.route().params.id?.toString();
            if (id) {
                const res = await DriverService.driver(id);
                const data = res.data.result?.driver || res.data.data?.driver;
                if (data) {
                    if (data.license_expiry_date) {
                        data.license_expiry_date = String(data.license_expiry_date).slice(0, 10);
                    }
                    if (data.joining_date) {
                        data.joining_date = String(data.joining_date).slice(0, 10);
                    }
                }
                driver.value = data;
                editmode.value = true;
            }
        } catch (error) {
            console.error("Error fetching driver:", error);
        } finally {
            loading.value = false;
        }
    };

    Helpers.useDynamicOnMounted(() => {
        if (Helpers.route().params.id) {
            getDriver();
        }
    });

    return {
        driver,
        editmode,
        loading,
    };
}
