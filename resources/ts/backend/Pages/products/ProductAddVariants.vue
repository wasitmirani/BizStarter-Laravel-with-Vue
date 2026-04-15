<script setup lang="ts">
import { Helpers } from '../../Utils/Helper';
import { CatalogService } from '../../Services/catalog/CatalogService';

const route = Helpers.route();
const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    'toast',
    { showToast: () => {} }
);
const errors = Helpers.useDynamicRef<any>({});
const isLoading = Helpers.useDynamicRef(false);
const product = Helpers.useDynamicRef<any>(null);

const rows = Helpers.useDynamicRef<any[]>([
    {
        name: '',
        option_name: '',
        option_values_input: '',
        sku_values_input: '',
        barcode_values_input: '',
        sku: '',
        barcode: '',
        price: 0,
        retail_price: 0,
        status: 'active',
        sort_order: 0,
        is_default: false,
    },
]);

const addRow = () => {
    rows.value.push({
        name: '',
        option_name: '',
        option_values_input: '',
        sku_values_input: '',
        barcode_values_input: '',
        sku: '',
        barcode: '',
        price: 0,
        retail_price: 0,
        status: 'active',
        sort_order: rows.value.length,
        is_default: false,
    });
};

const removeRow = (index: number) => {
    if (rows.value.length <= 1) return;
    rows.value.splice(index, 1);
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

const submit = async () => {
    errors.value = {};
    if (!product.value?.id) return;

    const toOptionValues = (value: unknown): string[] =>
        String(value ?? '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    const toBarcodeValues = (value: unknown): string[] =>
        String(value ?? '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    const toSkuValues = (value: unknown): string[] =>
        String(value ?? '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    const variants = rows.value.map((row, index) => {
        const optionValues = toOptionValues(row.option_values_input);
        return {
            ...row,
            rowIndex: index,
            sku: String(row.sku || '').trim(),
            barcode: String(row.barcode || '').trim() || null,
            name: String(row.name || '').trim() || null,
            option_name: String(row.option_name || '').trim() || null,
            option_values: optionValues,
            sku_values: toSkuValues(row.sku_values_input),
            barcode_values: toBarcodeValues(row.barcode_values_input),
            option_value: optionValues[0] || null,
            price: Number(row.price || 0),
            retail_price: Number(row.retail_price || 0),
            sort_order: Number(row.sort_order || 0),
            is_default: Boolean(row.is_default),
        };
    });

    const firstMissingSku = variants.find((row) => !row.sku);
    if (firstMissingSku) {
        errors.value = { variants: [`Row ${firstMissingSku.rowIndex + 1}: Base SKU is required.`] };
        return;
    }

    const firstMissingOptionName = variants.find((row) => !row.option_name);
    if (firstMissingOptionName) {
        errors.value = { variants: [`Row ${firstMissingOptionName.rowIndex + 1}: Option Name is required.`] };
        return;
    }

    const firstMissingValues = variants.find((row) => !row.option_values?.length);
    if (firstMissingValues) {
        errors.value = { variants: [`Row ${firstMissingValues.rowIndex + 1}: Please provide at least one option value.`] };
        return;
    }

    const firstNegativePrice = variants.find((row) => row.price < 0 || row.retail_price < 0);
    if (firstNegativePrice) {
        errors.value = { variants: [`Row ${firstNegativePrice.rowIndex + 1}: Price and Retail cannot be negative.`] };
        return;
    }

    const firstDuplicateValuesInRow = variants.find((row) => {
        const lowered = row.option_values.map((value: string) => value.toLowerCase());
        return new Set(lowered).size !== lowered.length;
    });
    if (firstDuplicateValuesInRow) {
        errors.value = { variants: [`Row ${firstDuplicateValuesInRow.rowIndex + 1}: Option Values contain duplicates.`] };
        return;
    }

    const firstSkuCountMismatch = variants.find((row) =>
        row.sku_values?.length > 0 && row.sku_values.length !== row.option_values.length
    );
    if (firstSkuCountMismatch) {
        errors.value = {
            variants: [
                `Row ${firstSkuCountMismatch.rowIndex + 1}: SKU Values count must match Option Values count.`,
            ],
        };
        return;
    }

    const firstBarcodeCountMismatch = variants.find((row) =>
        row.barcode_values?.length > 0 && row.barcode_values.length !== row.option_values.length
    );
    if (firstBarcodeCountMismatch) {
        errors.value = {
            variants: [
                `Row ${firstBarcodeCountMismatch.rowIndex + 1}: Barcode Values count must match Option Values count.`,
            ],
        };
        return;
    }

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
                        Add variants in bulk. Use one row per option group (for example Color), and provide comma-separated
                        values for options and optional SKUs/barcodes.
                    </p>
                </div>
            </div>

            <div v-if="errors?.variants?.length" class="alert alert-warning mb-4">{{ errors.variants[0] }}</div>

            <div class="card">
                <div class="card-header flex items-center justify-between">
                    <h4 class="card-title mb-0">Variant Rows</h4>
                    <button type="button" class="btn bg-primary text-white btn-sm" @click="addRow"><i class="iconify tabler--plus"></i> Add Row</button>
                </div>
                <div class="card-body p-0 overflow-x-auto">
                    <table class="table min-w-[1200px]">
                        <thead>
                            <tr>
                                <th>Option Name</th>
                                <th>Option Values</th>
                                <th>SKU Values</th>
                                <th>Barcode Values</th>
                                <th>Variant Name</th>
                                <th>SKU *</th>
                                <th>Price</th>
                                <th>Retail</th>
                                <th>Status</th>
                                <th>Default</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in rows" :key="index">
                                <td><input v-model="row.option_name" type="text" class="form-input" placeholder="e.g. Color" /></td>
                                <td><input v-model="row.option_values_input" type="text" class="form-input" placeholder="e.g. Red, Blue, Green" /></td>
                                <td><input v-model="row.sku_values_input" type="text" class="form-input" placeholder="Optional: SKU-RED, SKU-BLUE, SKU-GREEN" /></td>
                                <td><input v-model="row.barcode_values_input" type="text" class="form-input" placeholder="Optional: BR1, BR2, BR3" /></td>
                                <td><input v-model="row.name" type="text" class="form-input" placeholder="Optional, auto-built if blank" /></td>
                                <td><input v-model="row.sku" type="text" class="form-input" placeholder="SHIRT-COLOR" /></td>
                                <td><input v-model.number="row.price" type="number" class="form-input" min="0" step="0.01" /></td>
                                <td><input v-model.number="row.retail_price" type="number" class="form-input" min="0" step="0.01" /></td>
                                <td>
                                    <select v-model="row.status" class="form-select">
                                        <option value="active">active</option>
                                        <option value="inactive">inactive</option>
                                    </select>
                                </td>
                                <td class="text-center">
                                    <input v-model="row.is_default" type="checkbox" class="form-checkbox" />
                                </td>
                                <td>
                                    <button type="button" class="btn btn-sm border-default-300" @click="removeRow(index)">
                                        <i class="iconify tabler--trash"></i>
                                    </button>
                                </td>
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
