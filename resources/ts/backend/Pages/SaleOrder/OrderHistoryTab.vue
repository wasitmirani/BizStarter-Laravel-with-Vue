<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { Helpers } from '../../Utils/Helper';
import { SaleOrderService } from '../../Services/SaleOrder/SaleOrderService';
import EmptyData from '../../Components/EmptyData.vue';
import LoadingBox from '../../Components/LoadingBox.vue';

const orderService = new SaleOrderService();

const filters = reactive({
    search: '',
    payment_status: '',
    order_status: '',
    per_page: 10,
});

const orders = ref<any>({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
});
const isLoading = ref(false);
const activePage = ref(1);

const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'paid':
        case 'delivered':
        case 'processing':
            return 'badge bg-success/15 text-success';
        case 'pending':
        case 'shipped':
            return 'badge bg-warning/15 text-warning';
        case 'cancelled':
        case 'failed':
            return 'badge bg-danger/15 text-danger';
        default:
            return 'badge bg-info/15 text-info';
    }
};

const fetchOrders = async (page = 1) => {
    isLoading.value = true;
    activePage.value = page;

    try {
        const query = {
            ...filters,
            page,
            per_page: filters.per_page,
            search: filters.search,
        };
        const response = await orderService.list(query);
        const payload = response?.data?.orders;

        if (payload) {
            orders.value = {
                data: payload.data ?? payload,
                current_page: payload.current_page ?? 1,
                last_page: payload.last_page ?? 1,
                total: payload.total ?? (payload.data?.length ?? 0),
                per_page: payload.per_page ?? filters.per_page,
            };
        }
    } catch (error: any) {
        Helpers.Swal().fire({
            icon: 'error',
            title: 'Unable to load orders',
            text: error?.message ?? 'Please try again.',
            toast: true,
            position: 'top-end',
            timer: 2500,
            showConfirmButton: false,
        });
    } finally {
        isLoading.value = false;
    }
};

const applyFilters = () => {
    fetchOrders(1);
};

const resetFilters = () => {
    filters.search = '';
    filters.payment_status = '';
    filters.order_status = '';
    filters.per_page = 10;
    fetchOrders(1);
};

const confirmDelete = async (order: any) => {
    const result = await Helpers.Swal().fire({
        title: 'Delete order?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
        return;
    }

    try {
        await orderService.delete(order.id);
        Helpers.Swal().fire({
            icon: 'success',
            title: 'Order deleted',
            toast: true,
            position: 'top-end',
            timer: 2200,
            showConfirmButton: false,
        });
        fetchOrders(activePage.value);
    } catch (error: any) {
        Helpers.Swal().fire({
            icon: 'error',
            title: 'Delete failed',
            text: error?.message ?? 'Could not remove order.',
            toast: true,
            position: 'top-end',
            timer: 2500,
            showConfirmButton: false,
        });
    }
};

const goToPage = (page: number) => {
    if (page < 1 || page > orders.value.last_page) {
        return;
    }
    fetchOrders(page);
};

const pageNumbers = computed(() => {
    const pages: number[] = [];
    const maxPages = Math.min(5, orders.value.last_page);
    let start = Math.max(1, activePage.value - 2);
    if (start + maxPages - 1 > orders.value.last_page) {
        start = Math.max(1, orders.value.last_page - maxPages + 1);
    }

    for (let i = 0; i < maxPages; i++) {
        pages.push(start + i);
    }

    return pages;
});

onMounted(() => fetchOrders());
</script>

<template>
    <div class="space-y-5">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div class="card p-4 bg-slate-50 border border-slate-200">
                <p class="text-sm text-slate-500">Total orders</p>
                <h3 class="mt-2 text-3xl font-semibold">{{ orders?.value?.total }}</h3>
            </div>
            <div class="card p-4 bg-slate-50 border border-slate-200">
                <p class="text-sm text-slate-500">Current page</p>
                <h3 class="mt-2 text-3xl font-semibold">{{ orders?.value?.current_page }}</h3>
            </div>
            <div class="card p-4 bg-slate-50 border border-slate-200">
                <p class="text-sm text-slate-500">Pending payments</p>
                <h3 class="mt-2 text-3xl font-semibold">{{ orders?.value?.data.filter((item: any) => item.payment_status === 'pending').length }}</h3>
            </div>
            <div class="card p-4 bg-slate-50 border border-slate-200">
                <p class="text-sm text-slate-500">Open orders</p>
                <h3 class="mt-2 text-3xl font-semibold">{{ orders?.value?.data.filter((item: any) => item.status === 'processing').length }}</h3>
            </div>
        </div>

        <div class="card">
            <div class="card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div class="space-y-3 md:space-y-0 md:flex md:items-center md:gap-3">
                    <div class="input-icon-group w-full md:w-64">
                        <i class="iconify tabler--search input-icon"></i>
                        <input
                            type="search"
                            class="form-input w-full ps-10"
                            placeholder="Search order id, customer or amount"
                            v-model="filters.search"
                            @keyup.enter="applyFilters"
                        />
                    </div>
                    <div class="input-icon-group w-full md:w-52">
                        <i class="iconify tabler--credit-card input-icon"></i>
                        <select class="form-select" v-model="filters.payment_status" @change="applyFilters">
                            <option value="">Payment Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                    <div class="input-icon-group w-full md:w-52">
                        <i class="iconify tabler--truck input-icon"></i>
                        <select class="form-select" v-model="filters.order_status" @change="applyFilters">
                            <option value="">Order Status</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <button class="btn bg-primary text-white hover:bg-primary-hover" type="button" @click="applyFilters">
                        <i class="iconify tabler--search text-lg"></i>
                        Apply
                    </button>
                    <button class="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-100" type="button" @click="resetFilters">
                        Reset
                    </button>
                    <button class="btn btn-icon bg-primary/15 text-primary hover:bg-primary hover:text-white" type="button" @click="fetchOrders(activePage)">
                        <i class="iconify tabler--refresh text-lg"></i>
                    </button>
                </div>
            </div>

            <div class="card-body p-0">
                <div v-if="isLoading" class="p-6">
                    <LoadingBox text="Loading orders..." />
                </div>

                <div v-else>
                    <div v-if="orders.value.data.length === 0" class="p-6">
                        <EmptyData message="No sale orders found yet. Use the import tab to add orders or create new orders from the backend." />
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="table table-hover w-full text-sm">
                            <thead class="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                                <tr>
                                    <th>#</th>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in orders.value.data" :key="order.id" class="border-b border-slate-200">
                                    <td class="py-3">{{ order.uuid ?? `#${order.id}` }}</td>
                                    <td>{{ order.notes || 'Order details' }}</td>
                                    <td>
                                        <div class="whitespace-nowrap">
                                            <span class="font-medium">{{ order.customer?.name ?? order.customer_name ?? 'Guest' }}</span>
                                            <div class="text-xs text-slate-500">{{ order.customer?.email ?? order.customer?.phone ?? '' }}</div>
                                        </div>
                                    </td>
                                    <td class="font-semibold">${{ Number(order.total ?? 0).toFixed(2) }}</td>
                                    <td>
                                        <span :class="statusBadge(order.payment_status || 'pending')">
                                            {{ order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'Pending' }}
                                        </span>
                                    </td>
                                    <td>
                                        <span :class="statusBadge(order.status || 'processing')">
                                            {{ order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing' }}
                                        </span>
                                    </td>
                                    <td>{{ Helpers.DateTimeFormat(order.created_at ?? order.updated_at ?? new Date().toISOString()) }}</td>
                                    <td class="text-center">
                                        <div class="flex justify-center gap-2">
                                            <button class="btn btn-icon btn-sm border border-slate-200 hover:border-slate-300" type="button">
                                                <i class="iconify tabler--eye"></i>
                                            </button>
                                            <button class="btn btn-icon btn-sm border border-slate-200 hover:border-slate-300" type="button">
                                                <i class="iconify tabler--edit"></i>
                                            </button>
                                            <button class="btn btn-icon btn-sm border border-danger text-danger hover:bg-danger/10" type="button" @click="confirmDelete(order)">
                                                <i class="iconify tabler--trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div v-if="orders.value.total > 0" class="card-footer flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="text-slate-500 text-sm">
                    Showing {{ orders.value.data.length }} of {{ orders.value.total }} orders
                </div>
                <nav class="flex flex-wrap items-center gap-2">
                    <button
                        class="btn btn-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        :disabled="orders.value.current_page === 1"
                        @click="goToPage(activePage - 1)">
                        Prev
                    </button>
                    <button
                        v-for="page in pageNumbers"
                        :key="page"
                        class="btn btn-sm"
                        :class="page === activePage ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'"
                        type="button"
                        @click="goToPage(page)">
                        {{ page }}
                    </button>
                    <button
                        class="btn btn-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        :disabled="orders.value.current_page === orders.value.last_page"
                        @click="goToPage(activePage + 1)">
                        Next
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>
