<script setup lang="ts">
import ProductForm from './ProductForm.vue';
import { useCreateProduct } from './Composables/useCreateProduct';
import { Helpers } from '../../Utils/Helper';

const { product, editmode, loading } = useCreateProduct();
const productData = Helpers.useDynamicComputed(() => product.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Product' : 'Create Product'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Products', route: 'products' }]" />
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading product data..." />
    </div>
    <ProductForm v-else class="mt-4" :productData="productData" :isEditMode="isEditMode" />
</template>
