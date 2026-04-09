<script setup lang="ts">
import { useCreateCategory } from './Composables/useCreateCategories';
import { Helpers } from '../../Utils/Helper';

const { category, loading } = useCreateCategory();

const categoryData = Helpers.useDynamicComputed(() => category.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="'Category Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Categories', route: 'categories' }]"/>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading category data..." />
    </div>
    <div v-else class="card p-5">
        <h4 class="font-semibold mb-3">{{ categoryData.name }}</h4>
        <p class="mb-2"><b>Slug:</b> {{ categoryData.slug }}</p>
        <p class="mb-2"><b>Sort Order:</b> {{ categoryData.sort_order }}</p>
        <p><b>Description:</b> {{ categoryData.description || 'N/A' }}</p>
    </div>
</template>
