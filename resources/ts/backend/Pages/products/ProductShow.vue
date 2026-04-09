<script setup lang="ts">
import { useCreateProduct } from './Composables/useCreateProduct';
import { Helpers } from '../../Utils/Helper';

const { product, loading } = useCreateProduct();
const productData = Helpers.useDynamicComputed(() => product.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="'Product Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Products', route: 'products' }]" />
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading product data..." />
    </div>
    <div v-else class="card p-5">
        <h4 class="font-semibold mb-3">{{ productData.name }}</h4>
        <p class="mb-2"><b>SKU:</b> {{ productData.sku }}</p>
        <p class="mb-2"><b>Price:</b> {{ productData.price }}</p>
        <p><b>Category:</b> {{ productData.category?.name || 'N/A' }}</p>
    </div>
</template>
