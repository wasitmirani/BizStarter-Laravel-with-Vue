<script setup lang="ts">
import CategoriesForm from './CategoriesForm.vue';
import { useCreateCategory } from './Composables/useCreateCategories';
import { Helpers } from '../../Utils/Helper';

const { category, editmode, loading } = useCreateCategory();

const categoryData = Helpers.useDynamicComputed(() => category.value);
const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Category' : 'Create Category'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Categories', route: 'categories' }]"/>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading category data..." />
    </div>

    <CategoriesForm
        v-else
        class="mt-4"
        :categoryData="categoryData"
        :isEditMode="isEditMode"
    />
</template>
