<script setup lang="ts">
import { useVariantForm } from './Composables/useVariantForm';
const props = defineProps(['isEditMode', 'variantData']);
const { variant, products, errors, isLoading, onSubmit, addThumbnail, currentThumbnailUrl } = useVariantForm(props?.variantData, props?.isEditMode);
const handleAddThumbnail = (files: any) => addThumbnail(files);
const firstError = (field: string) => {
    const errorBag = (errors.value || {}) as Record<string, string[]>;
    return errorBag?.[field]?.[0] || '';
};
</script>

<template>
    <div class="container-fluid">
        <form @submit.prevent="onSubmit">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-base">
                <div class="space-y-base lg:col-span-2">
                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Variant Information</h4>
                                <p class="text-default-400">Fill in the details for this product variant.</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="grid md:grid-cols-2 gap-base">
                                <div class="col-span-2">
                                    <FormInput v-model="variant.name" label="Variant Name" name="name" placeholder="Enter variant name" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <FormInput v-model="variant.sku" label="SKU" name="sku" placeholder="IMAC-BLUE-512" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <FormInput v-model="variant.barcode" label="Barcode" name="barcode" placeholder="Enter barcode" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <FormInput v-model="variant.sort_order" label="Sort Order" name="sort_order" placeholder="0" type="number" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <label class="form-label">Status</label>
                                    <select v-model="variant.status" class="form-select" :class="{ 'border-danger': firstError('status') }">
                                        <option value="active">active</option>
                                        <option value="inactive">inactive</option>
                                    </select>
                                    <p v-if="firstError('status')" class="mt-1 text-danger text-xs">{{ firstError('status') }}</p>
                                </div>
                                <div class="col-span-2">
                                    <label class="inline-flex items-center gap-2 cursor-pointer">
                                        <input v-model="variant.is_default" type="checkbox" class="form-checkbox" />
                                        <span class="text-sm">Set as default variant</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Variant Image</h4>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="border-2 border-dashed border-default-300 rounded-lg p-5">
                                <div v-if="currentThumbnailUrl" class="mb-3">
                                    <img :src="currentThumbnailUrl" alt="variant-thumbnail-preview" class="size-20 rounded object-cover border border-default-200" />
                                </div>
                                <Uploader server="/upload/product/image" max="1" maxFilesize="2" :warnings="true" @add="handleAddThumbnail" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-base">
                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Pricing</h4>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="space-y-base">
                                <FormInput v-model="variant.price" label="Base Price" name="price" placeholder="Enter base price" type="number" :errors="errors" />
                                <FormInput v-model="variant.retail_price" label="Retail Price" name="retail_price" placeholder="Enter retail price" type="number" :errors="errors" />
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Linked Product</h4>
                            </div>
                        </div>
                        <div class="card-body">
                            <label class="form-label">Product</label>
                            <select v-model="variant.product_id" class="form-select" :class="{ 'border-danger': firstError('product_id') }">
                                <option :value="null">Select Product</option>
                                <option v-for="item in products" :key="item.id" :value="item.id">{{ item.name }}</option>
                            </select>
                            <p v-if="firstError('product_id')" class="mt-1 text-danger text-xs">{{ firstError('product_id') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-7.5 mb-2.5 flex justify-center gap-2.5">
                <router-link :to="{ name: 'variants' }" class="btn bg-danger text-white hover:bg-danger-hover">Discard</router-link>
                <button class="btn bg-success text-white hover:bg-success-hover" v-if="!isLoading">{{ isEditMode ? 'Update Variant' : 'Publish' }}</button>
                <button class="btn bg-success text-white" type="button" disabled v-else>
                    <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span> Loading...
                </button>
            </div>
        </form>
    </div>
</template>
