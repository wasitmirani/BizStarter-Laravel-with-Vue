<script setup lang="ts">
import { computed } from 'vue';
import { useCreateProduct } from './Composables/useCreateProduct';
import { Helpers } from '../../Utils/Helper';

const { product, loading } = useCreateProduct();
const productData = Helpers.useDynamicComputed(() => product.value);
const isLoading = Helpers.useDynamicComputed(() => loading?.value || false);

const fallbackImage = '/paces/tailwind/images/products/single-1.png';

const galleryImages = computed(() => {
    const imageCandidates = [
        productData.value?.thumbnail,
        productData.value?.image,
        ...(Array.isArray(productData.value?.images) ? productData.value.images : [])
    ]
        .map((item: any) => (typeof item === 'string' ? item : item?.url || item?.path || item?.image))
        .filter(Boolean);

    const uniqueImages = Array.from(new Set(imageCandidates));
    return uniqueImages.length ? uniqueImages : [fallbackImage, '/paces/tailwind/images/products/single-2.png', '/paces/tailwind/images/products/single-3.png', '/paces/tailwind/images/products/single-4.png'];
});

const formattedPrice = computed(() => {
    const price = Number(productData.value?.price || 0);
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});
</script>

<template>
    <BreadcrumbComponent :current="'Product Details'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Products', route: 'products' }]" />
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading product data..." />
    </div>
    <div v-else class="container-fluid">
        <div class="card">
            <div class="card-body">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-base">
                    <div>
                        <div class="card sticky top-20">
                            <div data-hs-carousel="{ &quot;loadingClasses&quot;: &quot;opacity-0&quot; }" class="relative init">
                                <div class="hs-carousel relative overflow-hidden w-full lg:min-h-120 min-h-90 rounded-lg">
                                    <div class="hs-carousel-body flex flex-nowrap transition-transform duration-700">
                                        <div v-for="(image, index) in galleryImages" :key="`${image}-${index}`" class="hs-carousel-slide" :class="{ active: index === 0 }">
                                            <img :src="image" alt="indicator-img" class="w-full" />
                                        </div>
                                    </div>
                                    <div class="hs-carousel-pagination relative mt-5 z-10">
                                        <div class="flex flex-row items-center justify-center gap-4">
                                            <div v-for="(image, index) in galleryImages" :key="`thumb-${image}-${index}`" class="hs-carousel-pagination-item shrink-0 border border-default-300 rounded overflow-hidden cursor-pointer opacity-50 hs-carousel-active:opacity-100" :class="{ active: index === 0 }">
                                                <img :src="image" alt="indicator-img" class="w-12" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="my-5 flex justify-center gap-2">
                                <router-link :to="{ name: 'edit-product', params: { uuid: productData.uuid } }" class="btn bg-light hover:text-primary">
                                    <i class="iconify tabler--pencil text-base"></i>
                                    Edit
                                </router-link>
                                <button type="button" class="btn bg-danger text-white hover:bg-danger-hover">
                                    <i class="iconify tabler--circle-dashed-plus text-base"></i>
                                    Delisting
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-2">
                        <div class="md:p-7.5">
                            <div class="mb-5 flex justify-between">
                                <span class="badge bg-success/15 text-success rounded-full font-semibold text-sm py-1.5 px-3">In Stock</span>
                            </div>
                            <div class="mt-5 mb-5 md:mb-7.5">
                                <h4 class="text-lg">{{ productData.name || 'Product' }}</h4>
                            </div>
                            <div class="mb-5 grid grid-cols-2 md:mb-7.5 md:grid-cols-4 gap-x-base">
                                <div>
                                    <h6 class="text-default-400 text-xs mb-1.25 uppercase">SKU:</h6>
                                    <p class="font-medium">{{ productData.sku || 'N/A' }}</p>
                                </div>
                                <div>
                                    <h6 class="text-default-400 text-xs mb-1.25 uppercase">Category:</h6>
                                    <p class="font-medium">{{ productData.category?.name || 'N/A' }}</p>
                                </div>
                                <div>
                                    <h6 class="text-default-400 text-xs mb-1.25 uppercase">Stock:</h6>
                                    <p class="font-medium">{{ productData.stock || productData.quantity || 0 }}</p>
                                </div>
                                <div>
                                    <h6 class="text-default-400 text-xs mb-1.25 uppercase">Published:</h6>
                                    <p class="font-medium">
                                        {{ productData.created_at || 'N/A' }}
                                    </p>
                                </div>
                            </div>
                            <h3 class="text-default-400 mb-7.5 flex items-center gap-3">
                                <span class="text-danger text-xl font-bold">{{ formattedPrice }}</span>
                            </h3>
                            <h5 class="text-default-400 mb-2.5 text-xs uppercase">Product Info:</h5>
                            <p class="mb-5">{{ productData.description || 'No product description available.' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
