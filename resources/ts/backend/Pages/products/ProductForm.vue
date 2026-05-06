<script setup lang="ts">
import { useProductForm } from './Composables/useProductForm';
const props = defineProps(['isEditMode', 'productData']);
const { product, categories, brands, errors, isLoading, onSubmit, addThumbnail, currentThumbnailUrl } = useProductForm(props?.productData, props?.isEditMode);
const handleAddThumbnail = (files: any) => addThumbnail(files);
</script>

<template>
    <div class="container-fluid">
        <form @submit.prevent="onSubmit">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-base">
                <div class="space-y-base lg:col-span-2">
                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Product Information</h4>
                                <p class="text-default-400">
                                    To add a new product, please provide the necessary details in the fields below.
                                </p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="grid md:grid-cols-2 gap-base">
                                <div class="col-span-2">
                                    <FormInput v-model="product.name" label="Product Name" name="name" placeholder="Enter product name" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <FormInput v-model="product.sku" label="SKU" name="sku" placeholder="SOFA-10058" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <FormInput v-model="product.reference_sku" label="Reference SKU" name="reference_sku" placeholder="REF-10058" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <FormInput v-model="product.barcode" label="Barcode" name="barcode" placeholder="Enter barcode" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <FormInput v-model="product.uom" label="Unit (UOM)" name="uom" placeholder="pcs" type="text" :errors="errors" />
                                </div>
                                <div class="col-span-2 md:col-span-1">
                                    <label class="form-label">Type</label>
                                    <select v-model="product.type" class="form-select">
                                        <option value="">Select Type</option>
                                        <option value="service">service</option>
                                        <option value="digital">digital</option>
                                        <option value="physical">physical</option>
                                        <option value="bundle">bundle</option>
                                    </select>
                                </div>
                                <div class="col-span-2">
                                    <label class="form-label">Product Description <span class="text-default-400">(Optional)</span></label>
                                    <textarea
                                        v-model="product.description"
                                        class="form-input min-h-[140px]"
                                        placeholder="Enter product description"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Product Image</h4>
                                <p class="text-default-400">
                                    To upload a product image, please use the option below to select and upload the relevant file.
                                </p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="border-2 border-dashed border-default-300 rounded-lg p-5">
                                <div v-if="currentThumbnailUrl" class="mb-3">
                                    <img :src="currentThumbnailUrl" alt="product-thumbnail-preview" class="size-20 rounded object-cover border border-default-200" />
                                </div>
                                <Uploader
                                    server="/upload/product/image"
                                    max="1"
                                    maxFilesize="2"
                                    :warnings="true"
                                    @add="handleAddThumbnail"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-base">
                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Pricing</h4>
                                <p class="text-default-400">Set the base and retail price for this product.</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="space-y-base">
                                <FormInput v-model="product.price" label="Base Price" name="price" placeholder="Enter base price" type="number" :errors="errors" />
                                <FormInput v-model="product.retail_price" label="Retail Price" name="retail_price" placeholder="Enter retail price" type="number" :errors="errors" />
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header p-5">
                            <div>
                                <h4 class="card-title mb-1.25">Organize</h4>
                                <p class="text-default-400">Organize your product by selecting brand and category.</p>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="space-y-base">
                                <div>
                                    <label class="form-label">Brand</label>
                                    <select v-model="product.brand_id" class="form-select">
                                        <option :value="null">Select Brand</option>
                                        <option v-for="item in brands" :key="item.id" :value="item.id">{{ item.name }}</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Category</label>
                                    <select v-model="product.category_id" class="form-select">
                                        <option :value="null">Select Category</option>
                                        <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-7.5 mb-2.5 flex justify-center gap-2.5">
                <router-link :to="{ name: 'products' }" class="btn bg-danger text-white hover:bg-danger-hover">Discard</router-link>
                <button class="btn bg-success text-white hover:bg-success-hover" v-if="!isLoading">
                    {{ isEditMode ? 'Update Product' : 'Publish' }}
                </button>
                <button class="btn bg-success text-white" type="button" disabled v-else>
                    <span class="spinner-border spinner-border-sm align-middle" role="status" aria-hidden="true"></span> Loading...
                </button>
            </div>
        </form>
    </div>
</template>
