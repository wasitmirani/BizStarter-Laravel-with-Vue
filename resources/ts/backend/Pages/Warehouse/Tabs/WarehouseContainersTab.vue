<script setup lang="ts">
import { Helpers } from "@/Backend/Utils/Helper";
import WarehouseContainerService from "@/Backend/Services/Warehouse/WarehouseContainerService";
import GenericTable from "@/Backend/Components/GenericTable.vue";
import { nextTick } from "vue";

const props = defineProps<{ warehouseId: number }>();

const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    "toast",
    { showToast: () => {} }
);

const isEditMode = Helpers.useDynamicRef(false);
const isSaving = Helpers.useDynamicRef(false);
const isLoading = Helpers.useDynamicRef(false);

const modalId = `warehouse-container-modal-${props.warehouseId}`;

const initOverlay = async () => {
    await nextTick();
    if ((window as any).HSOverlay) {
        (window as any).HSOverlay.autoInit();
    }
};

const openModal = async () => {
    await initOverlay();
    const el = document.getElementById(modalId);
    if (el && (window as any).HSOverlay) {
        const overlay = (window as any).HSOverlay.getOrCreateInstance(el);
        overlay?.open?.();
    }
};

const closeModal = async () => {
    const el = document.getElementById(modalId);
    if (el && (window as any).HSOverlay) {
        const overlay = (window as any).HSOverlay.getOrCreateInstance(el);
        overlay?.close?.();
    }
};

const columns = [
    { key: "name", label: "Name" },
    { key: "label", label: "Label" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created" },
];

const actions = [
    { label: "Edit", icon: "edit", action: "edit" },
    { label: "Delete", icon: "trash", action: "delete" },
];

const rows = Helpers.useDynamicRef<any>({
    data: [],
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
});

const form = Helpers.useDynamicReactive<any>({
    id: null,
    name: "",
    label: "",
    status: "active",
});

const resetForm = () => {
    form.id = null;
    form.name = "";
    form.label = "";
    form.status = "active";
    isEditMode.value = false;
};

const fetchData = async (page?: number, perPage?: number) => {
    isLoading.value = true;
    try {
        const res = await WarehouseContainerService.index({
            warehouse_id: props.warehouseId,
            page: page ?? rows.value.current_page ?? 1,
            per_page: perPage ?? 15,
        });
        rows.value = res?.data?.result?.containers ?? rows.value;
    } catch (err: any) {
        toast.value?.showToast(err.status, `Error: ${err.status}`, err.response?.data?.message);
    } finally {
        isLoading.value = false;
    }
};

const openCreate = () => {
    resetForm();
    openModal();
};

const openEdit = (row: any) => {
    isEditMode.value = true;
    form.id = row.id;
    form.name = row.name ?? "";
    form.label = row.label ?? "";
    form.status = row.status ?? "active";
    openModal();
};

const onSubmit = async () => {
    isSaving.value = true;
    try {
        const payload = { ...form, warehouse_id: props.warehouseId };
        if (isEditMode.value) await WarehouseContainerService.update(payload);
        else await WarehouseContainerService.store(payload);

        await closeModal();
        resetForm();
        await fetchData();
    } catch (err: any) {
        toast.value?.showToast(err.status, `Error: ${err.status}`, err.response?.data?.message);
    } finally {
        isSaving.value = false;
    }
};

const onAction = async ({ action, row }: any) => {
    if (action === "edit") return openEdit(row);
    if (action === "delete") {
        try {
            await WarehouseContainerService.delete(row.id);
            await fetchData();
        } catch (err: any) {
            toast.value?.showToast(err.status, `Error: ${err.status}`, err.response?.data?.message);
        }
    }
};

Helpers.useDynamicOnMounted(() => fetchData());
</script>

<template>
    <div class="card">
        <div class="card-header flex items-center justify-between">
            <div class="font-semibold">Containers</div>
            <button
                type="button"
                class="btn bg-primary hover:bg-primary-hover rounded text-white"
                aria-haspopup="dialog"
                aria-expanded="false"
                :aria-controls="modalId"
                :data-hs-overlay="`#${modalId}`"
                @click="openCreate"
            >
                <i class="iconify tabler--plus"></i> Add Container
            </button>
        </div>

        <GenericTable :columns="columns" :rows="rows" :isLoading="isLoading" :actions="actions" :fetchData="fetchData"
            @action="onAction" />

        <div
            :id="modalId"
            class="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 pointer-events-none fixed start-0 top-0 z-80 hidden size-full overflow-x-hidden overflow-y-auto opacity-0 transition-all"
            role="dialog"
            tabindex="-1"
            :aria-labelledby="`${modalId}-label`"
        >
            <div class="hs-overlay-animation-target m-3 sm:mx-auto sm:w-full sm:max-w-lg">
                <div class="border-default-300 pointer-events-auto flex flex-col rounded-md border card">
                    <div class="border-default-300 flex items-center justify-between border-b p-6">
                        <h3 :id="`${modalId}-label`" class="text-base font-semibold">
                            {{ isEditMode ? "Edit Container" : "Create Container" }}
                        </h3>
                        <button type="button" aria-label="Close" :data-hs-overlay="`#${modalId}`" @click="closeModal">
                            <span class="sr-only">Close</span>
                            <i class="iconify tabler--x text-xl"></i>
                        </button>
                    </div>

                    <div class="overflow-y-auto card-body">
                        <form @submit.prevent="onSubmit" class="space-y-4">
                            <FormInput v-model="form.name" name="name" label="Name" placeholder="Container name" type="text" />
                            <FormInput v-model="form.label" name="label" label="Label" placeholder="Optional label" type="text" />
                            <div>
                                <label class="form-label">Status</label>
                                <select v-model="form.status" class="form-select w-full">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div class="border-default-300 flex items-center justify-end border-t pt-4">
                                <button type="button" class="btn bg-light hover:text-primary m-1" :data-hs-overlay="`#${modalId}`" @click="closeModal">
                                    Close
                                </button>
                                <button type="submit" class="btn bg-primary hover:bg-primary-hover m-1 rounded text-white" :disabled="isSaving">
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

