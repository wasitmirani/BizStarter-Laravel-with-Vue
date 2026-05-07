<script setup lang="ts">
import { usePurchaseOrderForm } from './Composables/usePurchaseOrderForm';

const props = defineProps<{
    isEditMode: boolean;
    purchaseOrderData: any;
}>();

const {
    errors,
    form,
    isSaving,
    variants,
    suppliers,
    warehouses,
    tagsInput,
    lineSubTotal,
    grandTotal,
    showLineItemsModal,
    variantSearch,
    filteredVariants,
    allFilteredSelected,
    submit,
    addItem,
    removeItem,
    onVariantChange,
    recalcRow,
    isVariantChecked,
    onVariantCheckboxChange,
    onSelectAllFilteredChange,
    openLineItemsModal,
    closeLineItemsModal,
    applySelectedVariants,
} = usePurchaseOrderForm(props.purchaseOrderData, props.isEditMode);
</script>

<template>
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
</template>
