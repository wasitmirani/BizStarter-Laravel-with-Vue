import { computed, watch } from 'vue';
import { Helpers } from '../../../Utils/Helper';
import { CatalogService } from '../../../Services/catalog/CatalogService';
import { PurchasesService } from '../../../Services/purchases/PurchasesService';
import WarehouseService from '../../../Services/Warehouse/WarehouseService';
import DropDownService from '../../../Services/DropDown/DropDownService';

export function usePurchaseOrderForm(initialPurchaseOrder?: any, isEditMode: boolean = false) {
    const toast = Helpers.useDynamicInject<{ showToast: (status: number, title: string, message: string) => void }>(
        'toast',
        { showToast: () => {} }
    );

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
        if (!initialPurchaseOrder?.uuid) return;
        const record = initialPurchaseOrder;
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

            if (isEditMode && form.uuid) {
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
        () => initialPurchaseOrder,
        () => {
            hydrateForm();
            tagsInput.value = Array.isArray(form.tags) ? form.tags.join(', ') : '';
        },
        { deep: true }
    );

    return {
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
    };
}
