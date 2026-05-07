<script setup lang="ts">
import { Helpers } from '../../Utils/Helper';
import { CatalogService } from '../../Services/catalog/CatalogService';
// @ts-ignore - package does not ship TS types
import VueTagsInput from '@sipec/vue3-tags-input';

const route = Helpers.route();
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    'toast',
    { showToast: () => {} }
);
const errors = Helpers.useDynamicRef<any>({});
const isLoading = Helpers.useDynamicRef(false);
const product = Helpers.useDynamicRef<any>(null);

type Tag = { text: string };
type VariantOption = { id: string; name: string; tag: string; tags: Tag[] };
type GeneratedItem = {
    name: string;
    sku: string;
    barcode: string;
    price: number;
    retail_price: number;
    status: 'active' | 'inactive';
    enabled: boolean;
    option_name: string;
    option_value: string;
};

const uuid = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now() + Math.random()));

const variantOptions = Helpers.useDynamicRef<VariantOption[]>([
    { id: uuid(), name: 'Variants', tag: '', tags: [] },
]);

const generatedItems = Helpers.useDynamicRef<GeneratedItem[]>([]);

const onTagsChanged = (opt: VariantOption, newTags: Tag[]) => {
    opt.tags = newTags;
};

const addAnotherOption = () => {
    variantOptions.value.push({ id: uuid(), name: '', tag: '', tags: [] });
};

const removeOption = (id: string) => {
    if (variantOptions.value.length <= 1) return;
    variantOptions.value = variantOptions.value.filter((opt) => opt.id !== id);
};

const loadProduct = async () => {
    const uuid = route?.params?.uuid?.toString?.();
    if (!uuid) return;
    isLoading.value = true;
    try {
        const res = await CatalogService.product(uuid);
        product.value = res?.data?.result?.product ?? null;
    } finally {
        isLoading.value = false;
    }
};

const normalizeOptionName = (value: unknown) => String(value ?? '').trim();
const normalizeValue = (value: unknown) => String(value ?? '').trim();
const slugify = (value: unknown) =>
    String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const optionNameCombined = () =>
    variantOptions.value
        .map((opt) => normalizeOptionName(opt.name))
        .filter(Boolean)
        .join(' / ');

const cartesian = (arrays: string[][]): string[][] => {
    if (!arrays.length) return [];
    return arrays.reduce<string[][]>((acc, curr) => {
        if (!acc.length) return curr.map((v) => [v]);
        const next: string[][] = [];
        acc.forEach((a) => {
            curr.forEach((b) => next.push([...a, b]));
        });
        return next;
    }, []);
};

const randomDigits = (length: number) => {
    let output = '';
    while (output.length < length) {
        output += Math.floor(Math.random() * 10).toString();
    }
    return output.slice(0, length);
};

const generateSkuForRow = (row: GeneratedItem, index: number) => {
    const variantToken = slugify(row.name || row.option_value || `variant-${index + 1}`)
        .replace(/-/g, '')
        .toUpperCase();
    row.sku = `SKU${randomDigits(3)}${variantToken}`;
};

const generateBarcodeForRow = (row: GeneratedItem, index: number) => {
    const seed = String(Date.now()).slice(-5);
    row.barcode = `${seed}${String(index + 1).padStart(3, '0')}${randomDigits(5)}`.slice(0, 13);
};

const generateAllSkus = () => {
    generatedItems.value.forEach((row, idx) => generateSkuForRow(row, idx));
};

const generateAllBarcodes = () => {
    generatedItems.value.forEach((row, idx) => generateBarcodeForRow(row, idx));
};

const generateVariants = () => {
    errors.value = {};

    const normalizedOptions = variantOptions.value.map((opt) => ({
        name: normalizeOptionName(opt.name),
        values: (opt.tags || []).map((t) => normalizeValue(t.text)).filter(Boolean),
    }));

    const missingNameIndex = normalizedOptions.findIndex((o) => !o.name);
    const missingName = missingNameIndex >= 0 ? normalizedOptions[missingNameIndex] : null;
    if (missingName) {
        errors.value = { variants: [`Option ${missingNameIndex + 1}: Option name is required.`] };
        return;
    }

    const missingValuesIndex = normalizedOptions.findIndex((o) => !o.values.length);
    const missingValues = missingValuesIndex >= 0 ? normalizedOptions[missingValuesIndex] : null;
    if (missingValues) {
        errors.value = { variants: [`Option ${missingValuesIndex + 1}: Please add at least one option value.`] };
        return;
    }

    const combinedName = optionNameCombined();
    const combos = cartesian(normalizedOptions.map((o) => o.values));
    const baseName = String(product.value?.name || 'Variant').trim();

    generatedItems.value = combos.map((combo) => {
        const optionValue = combo.join(' / ');
        return {
            name: `${baseName} ${optionValue}`.trim(),
            sku: '',
            barcode: '',
            price: 0,
            retail_price: 0,
            status: 'active',
            enabled: true,
            option_name: combinedName,
            option_value: optionValue,
        };
    });

    generateAllSkus();
    generateAllBarcodes();
};

const submit = async () => {
    errors.value = {};
    if (!product.value?.id) return;
    if (!generatedItems.value.length) {
        errors.value = { variants: ['Please generate variants first.'] };
        return;
    }

    const enabledItems = generatedItems.value.filter((row) => row.enabled);
    if (!enabledItems.length) {
        errors.value = { variants: ['No enabled variants to save.'] };
        return;
    }

    const firstMissingSku = enabledItems.find((row) => !String(row.sku || '').trim());
    if (firstMissingSku) {
        errors.value = { variants: ['SKU is required for all enabled variants.'] };
        return;
    }

    const firstNegativePrice = enabledItems.find((row) => Number(row.price || 0) < 0 || Number(row.retail_price || 0) < 0);
    if (firstNegativePrice) {
        errors.value = { variants: ['Price and Retail cannot be negative.'] };
        return;
    }

    const variants = enabledItems.map((row, index) => ({
        name: String(row.name || '').trim() || null,
        sku: String(row.sku || '').trim(),
        barcode: String(row.barcode || '').trim() || null,
        option_name: String(row.option_name || '').trim(),
        option_value: String(row.option_value || '').trim() || null,
        // bulkStore contract requires option_values array; use single combined value
        option_values: [String(row.option_value || '').trim()].filter(Boolean),
        price: Number(row.price || 0),
        retail_price: Number(row.retail_price || 0),
        status: row.status || 'active',
        sort_order: index,
        is_default: index === 0,
    }));

    isLoading.value = true;
    try {
        await CatalogService.bulkStoreVariants({
            product_id: product.value.id,
            variants,
        });
        toast.value?.showToast(200, 'Variants', 'Variants created successfully');
        Helpers.router().push({ name: 'variants' });
    } catch (err: any) {
        errors.value = err?.response?.data?.errors ?? {};
    } finally {
        isLoading.value = false;
    }
};

Helpers.useDynamicOnMounted(loadProduct);
</script>

<template>
    <BreadcrumbComponent :current="'Add Variants'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Products', route: 'products' }]" />
    <div class="container-fluid">
        <div v-if="isLoading && !product" class="flex justify-center items-center py-12">
            <LoadingBox :showText="true" text="Loading product..." />
        </div>
        <form v-else @submit.prevent="submit">
            <div class="card mb-4">
                <div class="card-body">
                    <h4 class="card-title mb-1">Product: {{ product?.name || '-' }}</h4>
                    <p class="text-default-400 mb-0">
                        Create variant options (e.g. Color, Size), add values as tags, then generate variants.
                    </p>
                </div>
            </div>

            <div v-if="errors?.variants?.length" class="alert alert-warning mb-4">{{ errors.variants[0] }}</div>

            <div class="card">
                <div class="card-header flex items-center justify-between">
                    <h4 class="card-title mb-0">Variant Options</h4>
                    <div class="flex items-center gap-2">
                        <button type="button" class="btn bg-primary text-white btn-sm" @click="addAnotherOption">
                            <i class="iconify tabler--plus"></i> Add another option
                        </button>
                        <button type="button" class="btn bg-success text-white btn-sm" @click="generateVariants">
                            <i class="iconify tabler--sparkles"></i> Generate variants
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="space-y-4">
                        <div v-for="opt in variantOptions" :key="opt.id" class="grid grid-cols-12 gap-3 items-start">
                            <div class="col-span-12 md:col-span-4">
                                <label class="form-label">Option name</label>
                                <input v-model="opt.name" type="text" class="form-input" placeholder="e.g. Color" />
                            </div>
                            <div class="col-span-12 md:col-span-7">
                                <label class="form-label">Values</label>
                                <VueTagsInput v-model="opt.tag" :tags="opt.tags" @tags-changed="onTagsChanged(opt, $event)" />
                            </div>
                            <div class="col-span-12 md:col-span-1 flex justify-end pt-7">
                                <button type="button" class="btn btn-sm border-default-300" @click="removeOption(opt.id)" :disabled="variantOptions.length <= 1">
                                    <i class="iconify tabler--trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-between text-sm text-default-500">
                        <div>
                            <span class="font-semibold text-default-700">Generate:</span>
                            {{ generatedItems.length }} variants
                        </div>
                        <div v-if="optionNameCombined()" class="text-default-500">
                            <span class="font-semibold text-default-700">Options:</span>
                            {{ optionNameCombined() }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header flex items-center justify-between">
                    <h4 class="card-title mb-0">Items</h4>
                    <div class="flex items-center gap-2">
                        <button type="button" class="btn bg-primary/15 text-primary btn-sm" @click="generateAllSkus">
                            <i class="iconify tabler--barcode"></i> Generate SKU
                        </button>
                        <button type="button" class="btn bg-primary/15 text-primary btn-sm" @click="generateAllBarcodes">
                            <i class="iconify tabler--123"></i> Generate barcode
                        </button>
                        <button type="button" class="btn bg-primary/15 text-primary btn-sm" @click="generateVariants">
                            <i class="iconify tabler--refresh"></i> Regenerate
                        </button>
                    </div>
                </div>
                <div class="card-body p-0 overflow-x-auto">
                    <table class="table min-w-[1200px]">
                        <thead>
                            <tr>
                                <th>Variant</th>
                                <th>
                                    SKU *
                                    <div class="text-[11px] text-primary cursor-pointer" @click="generateAllSkus">Generate sku</div>
                                </th>
                                <th>
                                    Barcode
                                    <div class="text-[11px] text-primary cursor-pointer" @click="generateAllBarcodes">Generate barcode</div>
                                </th>
                                <th>Supply price</th>
                                <th>Retail price</th>
                                <th>Enabled</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in generatedItems" :key="index">
                                <td>
                                    <input v-model="row.name" type="text" class="form-input" />
                                    <div class="text-xs text-default-400 mt-1">{{ row.option_name }}: {{ row.option_value }}</div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <input v-model="row.sku" type="text" class="form-input" placeholder="SKU" />
                                        <button type="button" class="btn btn-sm border-default-300" @click="generateSkuForRow(row, index)">
                                            <i class="iconify tabler--refresh"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <input v-model="row.barcode" type="text" class="form-input" placeholder="Barcode" />
                                        <button type="button" class="btn btn-sm border-default-300" @click="generateBarcodeForRow(row, index)">
                                            <i class="iconify tabler--refresh"></i>
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        v-model.number="row.price"
                                        type="number"
                                        class="form-input"
                                        min="0"
                                        step="0.01"
                                    />
                                </td>
                                <td>
                                    <input
                                        v-model.number="row.retail_price"
                                        type="number"
                                        class="form-input"
                                        min="0"
                                        step="0.01"
                                    />
                                </td>
                                <td class="text-center">
                                    <input v-model="row.enabled" type="checkbox" class="form-checkbox" />
                                </td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-sm border-default-300" @click="generatedItems.splice(index, 1)">
                                        <i class="iconify tabler--trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="generatedItems.length === 0">
                                <td colspan="7" class="text-center text-default-400 py-6">Generate variants to see items here.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-4 flex justify-end gap-2">
                <router-link :to="{ name: 'products' }" class="btn bg-light hover:text-primary">Discard</router-link>
                <button type="submit" class="btn bg-success text-white" :disabled="isLoading">
                    {{ isLoading ? 'Saving...' : 'Save Variants' }}
                </button>
            </div>
        </form>
    </div>
</template>
