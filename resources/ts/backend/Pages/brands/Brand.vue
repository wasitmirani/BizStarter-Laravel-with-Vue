<script setup lang="ts">
import { Helpers } from '../../Utils/Helper';
import { CatalogService } from '../../Services/catalog/CatalogService';

const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    'toast',
    { showToast: () => {} }
);
const errors = Helpers.useDynamicRef<any>({});
const isLoading = Helpers.useDynamicRef(false);
const brand = Helpers.useDynamicReactive<any>({ uuid: '', name: '', code: '', description: '' });
const isEditMode = Helpers.useDynamicRef(false);

const loadBrand = async () => {
    const uuid = Helpers.route().params.uuid?.toString();
    if (!uuid) return;
    isLoading.value = true;
    try {
        const res = await CatalogService.brand(uuid);
        Object.assign(brand, res?.data?.result?.brand ?? {});
        isEditMode.value = true;
    } finally {
        isLoading.value = false;
    }
};

const onSubmit = async () => {
    isLoading.value = true;
    try {
        if (isEditMode.value) await CatalogService.updateBrand(brand.uuid, { ...brand });
        else await CatalogService.storeBrand({ ...brand });
        toast.value?.showToast(200, 'Brand', 'Brand saved successfully');
        Helpers.router().push({ name: 'brands' });
    } catch (err: any) {
        errors.value = err?.response?.data?.errors ?? {};
    } finally {
        isLoading.value = false;
    }
};

Helpers.useDynamicOnMounted(loadBrand);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Brand' : 'Create Brand'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Brands', route: 'brands' }]" />
    <div class="card mt-4">
        <form @submit.prevent="onSubmit">
            <div class="card-body grid lg:grid-cols-2 grid-cols-1 gap-base">
                <FormInput v-model="brand.name" label="Brand Name" name="name" placeholder="Brand name" type="text" :errors="errors" />
                <FormInput v-model="brand.code" label="Code" name="code" placeholder="BR001" type="text" :errors="errors" />
                <FormInput v-model="brand.description" label="Description" name="description" placeholder="Brand description" type="text" :errors="errors" />
            </div>
            <div class="flex justify-end items-center gap-2 p-5 border-t border-default-300">
                <router-link :to="{ name: 'brands' }" class="btn bg-light hover:text-primary"><i class="iconify tabler--arrow-back-up"></i> Discard</router-link>
                <button class="btn bg-primary text-white" v-if="!isLoading">Save Brand</button>
                <button class="btn bg-primary text-white" type="button" disabled v-else>Loading...</button>
            </div>
        </form>
    </div>
</template>
