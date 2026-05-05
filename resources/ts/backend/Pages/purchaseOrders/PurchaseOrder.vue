<script setup lang="ts">
import { computed, watch } from 'vue';
import { Helpers } from '../../Utils/Helper';
import { CatalogService } from '../../Services/catalog/CatalogService';
import { PurchasesService } from '../../Services/purchases/PurchasesService';
import WarehouseService from '../../Services/Warehouse/WarehouseService';
import DropDownService from '../../Services/DropDown/DropDownService';
import { useCreatePurchaseOrder } from './Composables/useCreatePurchaseOrder';

const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
    'toast',
    { showToast: () => {} }
);

const { purchaseOrder: fetchedPurchaseOrder, editmode, loading } = useCreatePurchaseOrder();
const errors = Helpers.useDynamicRef<any>({});
const isSaving = Helpers.useDynamicRef(false);
const variants = Helpers.useDynamicRef<any[]>([]);
const suppliers = Helpers.useDynamicRef<any[]>([]);
const warehouses = Helpers.useDynamicRef<any[]>([]);
const showLineItemsModal = Helpers.useDynamicRef(false);
const variantSearch = Helpers.useDynamicRef('');
const modalSelectedVariantIds = Helpers.useDynamicRef<number[]>([]);

const form = Helpers.useDynamicReactive<any>({
    uuid: '',
    supplier_id: null,
    warehouse_id: null,
    order_date: '',
    expected_date: '',
    payment_term: '',
    payment_type: '',
    supplier_reference_id: '',
    tags: [],
    taxes: 0,
    shipping_charges: 0,
    supplier_notes: '',
    line_items: [
        { variant_id: null, quantity: 1, unit_price: 0, line_tax: 0, line_total: 0, name: '', sku: '', option_name: '', option_value: '' },
    ],
});

const isEditMode = Helpers.useDynamicComputed(() => editmode.value);
const isLoading = Helpers.useDynamicComputed(() => loading.value);

const loadVariants = async () => {
    const res = await CatalogService.variants({ paginated: true, per_page: 10 });
    variants.value = res?.data?.result?.variants?.data ?? res?.data?.result?.variants ?? [];
};

const loadSuppliers = async () => {
    const res = await DropDownService.getSuppliers();
    suppliers.value = res?.data?.result?.suppliers ?? [];
};

const loadWarehouses = async () => {
    const res = await WarehouseService.warehouses({ paginated: false, sort_by: 'id', sort_dir: 'desc' });
    warehouses.value = res?.data?.result?.warehouses?.data ?? res?.data?.result?.warehouses ?? [];
};

const hydrateForm = () => {
    if (!fetchedPurchaseOrder.value?.uuid) return;
    const record = fetchedPurchaseOrder.value;
    Object.assign(form, {
        ...form,
        ...record,
        line_items: (record.items || []).map((item: any) => ({
            variant_id: item.variant_id,
            quantity: Number(item.quantity || 0),
            unit_price: Number(item.unit_price || 0),
            line_tax: Number(item.line_tax || 0),
            line_total: Number(item.line_total || 0),
            name: item.name || '',
            sku: item.sku || '',
            option_name: item.option_name || '',
            option_value: item.option_value || '',
        })),
    });
    if (!form.line_items.length) {
        form.line_items = [{ variant_id: null, quantity: 1, unit_price: 0, line_tax: 0, line_total: 0, name: '', sku: '', option_name: '', option_value: '' }];
    }
};

const addItem = () => {
    form.line_items.push({ variant_id: null, quantity: 1, unit_price: 0, line_tax: 0, line_total: 0, name: '', sku: '', option_name: '', option_value: '' });
};

const removeItem = (index: number) => {
    if (form.line_items.length <= 1) return;
    form.line_items.splice(index, 1);
};

const onVariantChange = (row: any) => {
    const variant = variants.value.find((v) => Number(v.id) === Number(row.variant_id));
    if (!variant) return;
    row.name = variant.name || '';
    row.sku = variant.sku || '';
    row.option_name = variant.option_name || '';
    row.option_value = variant.option_value || '';
    row.unit_price = Number(variant.price || 0);
    row.line_total = Number(row.quantity || 0) * Number(row.unit_price || 0) + Number(row.line_tax || 0);
};

const filteredVariants = computed(() => {
    const q = String(variantSearch.value || '').trim().toLowerCase();
    if (!q) return variants.value;
    return variants.value.filter((variant: any) =>
        String(variant.name || '').toLowerCase().includes(q) ||
        String(variant.sku || '').toLowerCase().includes(q) ||
        String(variant.option_name || '').toLowerCase().includes(q) ||
        String(variant.option_value || '').toLowerCase().includes(q)
    );
});

const isVariantChecked = (id: number) => modalSelectedVariantIds.value.includes(Number(id));

const toggleVariantSelection = (id: number, checked: boolean) => {
    const normalized = Number(id);
    if (checked && !modalSelectedVariantIds.value.includes(normalized)) {
        modalSelectedVariantIds.value.push(normalized);
    }
    if (!checked) {
        modalSelectedVariantIds.value = modalSelectedVariantIds.value.filter((itemId) => itemId !== normalized);
    }
};

const allFilteredSelected = computed(() => {
    if (!filteredVariants.value.length) return false;
    return filteredVariants.value.every((variant: any) => isVariantChecked(Number(variant.id)));
});

const toggleSelectAllFiltered = (checked: boolean) => {
    const filteredIds = filteredVariants.value.map((variant: any) => Number(variant.id));
    if (checked) {
        const merged = new Set([...modalSelectedVariantIds.value, ...filteredIds]);
        modalSelectedVariantIds.value = Array.from(merged);
        return;
    }
    modalSelectedVariantIds.value = modalSelectedVariantIds.value.filter((id) => !filteredIds.includes(Number(id)));
};

const onSelectAllFilteredChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    toggleSelectAllFiltered(Boolean(target?.checked));
};

const onVariantCheckboxChange = (id: number, event: Event) => {
    const target = event.target as HTMLInputElement;
    toggleVariantSelection(Number(id), Boolean(target?.checked));
};

const openLineItemsModal = () => {
    modalSelectedVariantIds.value = form.line_items
        .map((row: any) => Number(row.variant_id))
        .filter((id: number) => Number.isFinite(id) && id > 0);
    variantSearch.value = '';
    showLineItemsModal.value = true;
};

const closeLineItemsModal = () => {
    showLineItemsModal.value = false;
};

const applySelectedVariants = () => {
    const existingByVariantId = new Map<number, any>();
    form.line_items.forEach((row: any) => {
        const variantId = Number(row.variant_id);
        if (Number.isFinite(variantId) && variantId > 0) {
            existingByVariantId.set(variantId, row);
        }
    });

    const nextRows = modalSelectedVariantIds.value.map((id) => {
        const existing = existingByVariantId.get(Number(id));
        if (existing) return existing;
        const variant = variants.value.find((item: any) => Number(item.id) === Number(id));
        return {
            variant_id: variant?.id ?? null,
            quantity: 1,
            unit_price: Number(variant?.price || 0),
            line_tax: 0,
            line_total: Number(variant?.price || 0),
            name: variant?.name || '',
            sku: variant?.sku || '',
            option_name: variant?.option_name || '',
            option_value: variant?.option_value || '',
        };
    });

    form.line_items = nextRows.length
        ? nextRows
        : [{ variant_id: null, quantity: 1, unit_price: 0, line_tax: 0, line_total: 0, name: '', sku: '', option_name: '', option_value: '' }];

    closeLineItemsModal();
};

const lineSubTotal = computed(() => form.line_items.reduce((acc: number, row: any) => acc + (Number(row.quantity || 0) * Number(row.unit_price || 0)), 0));
const grandTotal = computed(() => lineSubTotal.value + Number(form.taxes || 0) + Number(form.shipping_charges || 0));

const recalcRow = (row: any) => {
    row.line_total = (Number(row.quantity || 0) * Number(row.unit_price || 0)) + Number(row.line_tax || 0);
};

const parseTags = (value: string) => {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const tagsInput = Helpers.useDynamicRef('');

const submit = async () => {
    errors.value = {};
    isSaving.value = true;
    try {
        const payload = {
            supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
            warehouse_id: form.warehouse_id ? Number(form.warehouse_id) : null,
            order_date: form.order_date,
            expected_date: form.expected_date || null,
            payment_term: form.payment_term || null,
            payment_type: form.payment_type || null,
            supplier_reference_id: form.supplier_reference_id || null,
            tags: parseTags(tagsInput.value || ''),
            taxes: Number(form.taxes || 0),
            shipping_charges: Number(form.shipping_charges || 0),
            supplier_notes: form.supplier_notes || null,
            line_items: form.line_items.map((row: any, index: number) => ({
                variant_id: row.variant_id ? Number(row.variant_id) : null,
                quantity: Number(row.quantity || 0),
                unit_price: Number(row.unit_price || 0),
                line_tax: Number(row.line_tax || 0),
                sort_order: index,
                name: row.name || null,
                sku: row.sku || null,
                option_name: row.option_name || null,
                option_value: row.option_value || null,
            })),
        };

        if (isEditMode.value && form.uuid) {
            await PurchasesService.updatePurchaseOrder(form.uuid, payload);
        } else {
            await PurchasesService.storePurchaseOrder(payload);
        }
        toast.value?.showToast(200, 'Purchase Order', 'Purchase order saved successfully');
        Helpers.router().push({ name: 'purchase-orders' });
    } catch (err: any) {
        errors.value = err?.response?.data?.errors ?? {};
    } finally {
        isSaving.value = false;
    }
};

Helpers.useDynamicOnMounted(async () => {
    await loadVariants();
    await loadSuppliers();
    await loadWarehouses();
    hydrateForm();
    tagsInput.value = Array.isArray(form.tags) ? form.tags.join(', ') : '';
});

watch(
    () => fetchedPurchaseOrder.value,
    () => {
        hydrateForm();
        tagsInput.value = Array.isArray(form.tags) ? form.tags.join(', ') : '';
    },
    { deep: true }
);
</script>

<template>
    <BreadcrumbComponent :current="isEditMode ? 'Update Purchase Order' : 'Create Purchase Order'" :links="[{ name: 'Dashboard', route: 'dashboard' }, { name: 'Purchase Orders', route: 'purchase-orders' }]" />
    <div v-if="isLoading" class="flex justify-center items-center py-12">
        <LoadingBox :showText="true" text="Loading purchase order..." />
    </div>
    <div v-else class="container-fluid">
        <form @submit.prevent="submit">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-base">
                <div class="card">
                    <div class="card-header"><h4 class="card-title mb-0">Supplier Info</h4></div>
                    <div class="card-body grid md:grid-cols-2 gap-base">
                        <div>
                            <label class="form-label">Supplier</label>
                            <select v-model="form.supplier_id" class="form-select">
                                <option :value="null">Select Supplier</option>
                                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                                    {{ supplier.name }} ({{ supplier.phone || supplier.email || 'No contact' }})
                                </option>
                            </select>
                        </div>
                        <FormInput v-model="form.supplier_reference_id" label="Supplier Reference ID" name="supplier_reference_id" placeholder="Supplier reference" type="text" :errors="errors" />
                        <FormInput v-model="tagsInput" label="Tags (comma separated)" name="tags" placeholder="urgent, local" type="text" :errors="errors" />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h4 class="card-title mb-0">Purchase Order Info</h4></div>
                    <div class="card-body grid md:grid-cols-2 gap-base">
                        <div>
                            <label class="form-label">Warehouse</label>
                            <select v-model="form.warehouse_id" class="form-select">
                                <option :value="null">Select Warehouse</option>
                                <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                                    {{ warehouse.name }} ({{ warehouse.city || 'N/A' }})
                                </option>
                            </select>
                        </div>
                        <FormInput v-model="form.order_date" label="Order Date" name="order_date" type="date" :errors="errors" />
                        <FormInput v-model="form.expected_date" label="Expected Date" name="expected_date" type="date" :errors="errors" />
                        <FormInput v-model="form.payment_term" label="Payment Term" name="payment_term" placeholder="e.g. Net 30" type="text" :errors="errors" />
                        <FormInput v-model="form.payment_type" label="Payment Type" name="payment_type" placeholder="bank transfer / cash" type="text" :errors="errors" />
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header flex items-center justify-between">
                    <h4 class="card-title mb-0">Line Items (Variant-wise)</h4>
                    <div class="flex items-center gap-2">
                        <button type="button" class="btn bg-primary text-white btn-sm" @click="addItem">
                            <i class="iconify tabler--plus"></i> Add Item
                        </button>
                        <button type="button" class="btn bg-primary text-white btn-sm" @click="openLineItemsModal">
                        <i class="iconify tabler--list-details"></i> Manage Line Items
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="grid md:grid-cols-4 gap-base">
                        <div>
                            <p class="text-default-400 text-xs uppercase mb-1">Items</p>
                            <p class="font-semibold mb-0">{{ form.line_items.length }}</p>
                        </div>
                        <div>
                            <p class="text-default-400 text-xs uppercase mb-1">Sub Total</p>
                            <p class="font-semibold mb-0">{{ lineSubTotal.toFixed(2) }}</p>
                        </div>
                        <div>
                            <p class="text-default-400 text-xs uppercase mb-1">Taxes</p>
                            <p class="font-semibold mb-0">{{ Number(form.taxes || 0).toFixed(2) }}</p>
                        </div>
                        <div>
                            <p class="text-default-400 text-xs uppercase mb-1">Total</p>
                            <p class="font-semibold mb-0">{{ grandTotal.toFixed(2) }}</p>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0 overflow-x-auto border-t border-default-200">
                    <table class="table min-w-[1100px]">
                        <thead>
                            <tr>
                                <th>Variant</th>
                                <th>SKU</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Line Tax</th>
                                <th>Line Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, index) in form.line_items" :key="index">
                                <td>
                                    <select v-model="row.variant_id" class="form-select" @change="onVariantChange(row)">
                                        <option :value="null">Select Variant</option>
                                        <option v-for="variant in variants" :key="variant.id" :value="variant.id">
                                            {{ variant.name }} ({{ variant.sku }})
                                        </option>
                                    </select>
                                </td>
                                <td><input v-model="row.sku" type="text" class="form-input" placeholder="SKU" /></td>
                                <td><input v-model.number="row.quantity" type="number" min="0.01" step="0.01" class="form-input" @input="recalcRow(row)" /></td>
                                <td><input v-model.number="row.unit_price" type="number" min="0" step="0.01" class="form-input" @input="recalcRow(row)" /></td>
                                <td><input v-model.number="row.line_tax" type="number" min="0" step="0.01" class="form-input" @input="recalcRow(row)" /></td>
                                <td>{{ Number(row.line_total || 0).toFixed(2) }}</td>
                                <td>
                                    <button type="button" class="btn btn-sm border-default-300" @click="removeItem(Number(index))">
                                        <i class="iconify tabler--trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-base mt-4">
                <div class="card">
                    <div class="card-header"><h4 class="card-title mb-0">Invoice Summary</h4></div>
                    <div class="card-body grid md:grid-cols-2 gap-base">
                        <div>
                            <label class="form-label">Sub Total</label>
                            <div class="form-input bg-light">{{ lineSubTotal.toFixed(2) }}</div>
                        </div>
                        <FormInput v-model="form.taxes" label="Taxes" name="taxes" type="number" :errors="errors" />
                        <FormInput v-model="form.shipping_charges" label="Shipping Charges" name="shipping_charges" type="number" :errors="errors" />
                        <div>
                            <label class="form-label">Total</label>
                            <div class="form-input bg-light">{{ grandTotal.toFixed(2) }}</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h4 class="card-title mb-0">Supplier Notes</h4></div>
                    <div class="card-body">
                        <textarea v-model="form.supplier_notes" class="form-input min-h-[180px]" placeholder="Add notes for supplier..."></textarea>
                    </div>
                </div>
            </div>

            <div class="mt-7.5 mb-2.5 flex justify-center gap-2.5">
                <router-link :to="{ name: 'purchase-orders' }" class="btn bg-light hover:text-primary">Discard</router-link>
                <button class="btn bg-primary text-white btn-sm" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Purchase Order' : 'Save Purchase Order') }}
                </button>
            </div>
        </form>

        <div
            v-if="showLineItemsModal"
            id="addPurchaseOrderModal"
            class="hs-overlay pointer-events-none fixed start-0 top-0 z-80 size-full overflow-x-hidden overflow-y-auto open opened"
            role="dialog"
            aria-labelledby="addPurchaseOrderModalLabel"
            style="outline: none;"
            aria-overlay="true"
            tabindex="-1"
        >
            <div class="absolute inset-0 bg-black/65 backdrop-blur-[2px]" @click="closeLineItemsModal"></div>
            <div class="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 m-3 flex min-h-[calc(100%-56px)] scale-95 items-center opacity-0 transition-all duration-200 ease-in-out md:mx-auto md:w-full md:max-w-2xl lg:max-w-3xl">
                <div class="card pointer-events-auto flex w-full flex-col">
                <div class="card-header p-5 flex items-center justify-between border-b border-default-200">
                    <h4 id="addPurchaseOrderModalLabel" class="card-title mb-0 flex items-center font-semibold">
                        <i class="iconify tabler--file-text text-danger me-2.5"></i>
                        Select Variants
                    </h4>
                    <div class="flex items-center gap-2">
                        <button type="button" class="btn bg-primary text-white btn-sm" @click="applySelectedVariants">
                            <i class="iconify tabler--check"></i> Apply Selection
                        </button>
                        <button type="button" class="btn bg-light hover:text-primary btn-sm" data-hs-overlay="#addPurchaseOrderModal" aria-expanded="true" @click="closeLineItemsModal">
                            <i class="iconify tabler--x"></i> Close
                        </button>
                    </div>
                </div>
                <div class="p-0 overflow-y-auto overflow-x-auto max-h-[calc(90vh-72px)]">
                    <div class="p-4 border-b border-default-200">
                        <label class="form-label">Search variant</label>
                        <input
                            v-model="variantSearch"
                            type="search"
                            class="form-input"
                            placeholder="Search by variant name, SKU, option... (showing up to 10)"
                        />
                    </div>
                    <table class="table min-w-[1000px]">
                        <thead>
                            <tr>
                                <th class="w-10">
                                    <input
                                        class="form-checkbox"
                                        type="checkbox"
                                        :checked="allFilteredSelected"
                                        @change="onSelectAllFilteredChange"
                                    />
                                </th>
                                <th class="min-w-[320px]">Variant</th>
                                <th>SKU</th>
                                <th>Option Name</th>
                                <th>Option Value</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="variant in filteredVariants" :key="variant.id">
                                <td>
                                    <input
                                        class="form-checkbox"
                                        type="checkbox"
                                        :checked="isVariantChecked(Number(variant.id))"
                                        @change="onVariantCheckboxChange(Number(variant.id), $event)"
                                    />
                                </td>
                                <td>{{ variant.name || '-' }}</td>
                                <td>{{ variant.sku || '-' }}</td>
                                <td>{{ variant.option_name || '-' }}</td>
                                <td>{{ variant.option_value || '-' }}</td>
                                <td>{{ Number(variant.price || 0).toFixed(2) }}</td>
                            </tr>
                            <tr v-if="filteredVariants.length === 0">
                                <td colspan="6" class="text-center text-default-400 py-6">
                                    No variants found for this search.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="border-default-300 flex items-center justify-end gap-2 border-t p-5">
                    <button type="button" class="btn bg-light hover:text-primary" data-hs-overlay="#addPurchaseOrderModal" aria-expanded="true" @click="closeLineItemsModal">Close</button>
                    <button type="button" class="btn bg-primary text-white" @click="applySelectedVariants">
                      
                        Save 
                    </button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
