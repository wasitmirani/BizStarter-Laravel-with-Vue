<script setup lang="ts">
import { useProductForm } from './Composables/useProductForm';
const props = defineProps(['isEditMode', 'productData']);
const { product, categories, brands, errors, isLoading, onSubmit } = useProductForm(props?.productData, props?.isEditMode);
</script>

<template>
    <div class="w-full flex flex-col card pointer-events-auto">
        <div class="flex justify-between items-center card-body border-b border-default-300">
            <h3 class="font-bold flex items-center">{{ isEditMode ? 'Update Product' : 'Create Product' }}</h3>
        </div>
        <form @submit.prevent="onSubmit">
            <div class="card-body grid lg:grid-cols-3 grid-cols-1 gap-base">
                <FormInput v-model="product.name" label="Name" name="name" placeholder="Product name" type="text" :errors="errors" />
                <FormInput v-model="product.slug" label="Slug" name="slug" placeholder="product-slug" type="text" :errors="errors" />
                <FormInput v-model="product.sku" label="SKU" name="sku" placeholder="SKU-001" type="text" :errors="errors" />
                <FormInput v-model="product.reference_sku" label="Reference SKU" name="reference_sku" placeholder="REF-001" type="text" :errors="errors" />
                <FormInput v-model="product.barcode" label="Barcode" name="barcode" placeholder="1234567890" type="text" :errors="errors" />
                <FormInput v-model="product.uom" label="UOM" name="uom" placeholder="pcs" type="text" :errors="errors" />
                <FormInput v-model="product.price" label="Price" name="price" placeholder="0.00" type="number" :errors="errors" />
                <FormInput v-model="product.retail_price" label="Retail Price" name="retail_price" placeholder="0.00" type="number" :errors="errors" />
                <div>
                    <label class="form-label">Type</label>
                    <select v-model="product.type" class="form-select">
                        <option value="">Select Type</option>
                        <option value="service">service</option>
                        <option value="digital">digital</option>
                        <option value="physical">physical</option>
                        <option value="bundle">bundle</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Category</label>
                    <select v-model="product.category_id" class="form-select">
                        <option :value="null">Select Category</option>
                        <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Brand</label>
                    <select v-model="product.brand_id" class="form-select">
                        <option :value="null">Select Brand</option>
                        <option v-for="item in brands" :key="item.id" :value="item.id">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end items-center gap-2 p-5 border-t border-default-300">
                <router-link :to="{ name: 'products' }" class="btn bg-light hover:text-primary"><i class="iconify tabler--arrow-back-up"></i> Discard</router-link>
                <button class="btn bg-primary hover:bg-primary-hover text-white" v-if="!isLoading">Save Product <i class="iconify tabler--device-floppy"></i></button>
                <button class="btn bg-primary text-white" type="button" disabled v-else>
                    <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span> Loading...
                </button>
            </div>
        </form>
    </div>
</template>
