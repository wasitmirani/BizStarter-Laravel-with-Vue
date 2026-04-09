<script setup lang="ts">
import { useCategoryForm } from './Composables/useCategoryForm';
const props = defineProps(['isEditMode', 'categoryData']);

const {
    category,
    errors,
    isLoading,
    onSubmit,
} = useCategoryForm(props?.categoryData, props?.isEditMode);

</script>

<template>
    <div>
        <div class="w-full flex flex-col card pointer-events-auto">
            <div class="flex justify-between items-center card-body border-b border-default-300">
                <h3 class="font-bold flex items-center">{{ isEditMode ? 'Update Category' : 'Create Category' }}</h3>
            </div>
            <form @submit.prevent="onSubmit">
                <div class="card-body">
                    <div class="grid lg:grid-cols-2 grid-cols-1 gap-base">
                        <FormInput v-model="category.name" label="Category Name" name="name" placeholder="Beverages"
                            type="text" :errors="errors" autofocus />
                        <FormInput v-model="category.slug" label="Slug" name="slug" placeholder="beverages"
                            type="text" :errors="errors" />
                        <FormInput v-model="category.sort_order" label="Sort Order" name="sort_order" placeholder="0"
                            type="number" :errors="errors" />
                        <FormInput v-model="category.description" label="Description" name="description"
                            placeholder="Category details" type="text" :errors="errors" />
                    </div>
                </div>
                <div class="flex justify-end items-center gap-2 p-5 border-t border-default-300">
                    <router-link :to="{ name: 'categories' }" class="btn bg-light hover:text-primary">
                        <i class="iconify tabler--arrow-back-up"></i> Discard
                    </router-link>
                    <button class="btn bg-primary hover:bg-primary-hover text-white" v-if="!isLoading">
                        Save Category <i class="iconify tabler--device-floppy"></i>
                    </button>
                    <button class="btn bg-primary hover:bg-success-hover text-white" type="button" disabled
                        v-if="isLoading">
                        <span class="spinner-border spinner-border-sm align-middle" role="status"
                            aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
