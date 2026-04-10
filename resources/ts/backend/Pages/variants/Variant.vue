<script setup lang="ts">
import VariantForm from './VariantForm.vue';
import { useCreateVariant } from './Composables/useCreateVariant';
import { Helpers } from '../../Utils/Helper';

const { variant, editmode, loading } = useCreateVariant();
const variantData = Helpers.useDynamicComputed(() => variant.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Variant' : 'Create Variant'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Variants', route: 'variants' }]" />
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading variant data..." />
    </div>
    <VariantForm v-else class="mt-4" :variantData="variantData" :isEditMode="isEditMode" />
</template>
