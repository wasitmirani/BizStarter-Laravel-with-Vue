<script setup lang="ts">
import { ref } from 'vue';
import OrderHistoryTab from './OrderHistoryTab.vue';
import ImportOrdersTab from './ImportOrdersTab.vue';
import { Helpers } from '../../Utils/Helper';

const tabs = [
    { key: 'history', label: 'Order History', icon: 'tabler--list-details', subtitle: 'Browse and manage all sale orders.' },
    { key: 'import', label: 'Import Orders', icon: 'tabler--upload', subtitle: 'Upload sales data using CSV or Excel.' },
];

const activeTab = ref('history');

const setTab = (tab: string) => {
    activeTab.value = tab;
    Helpers.router().replace({ query: { tab } });
};
</script>

<template>
    <div>
        <BreadcrumbComponent :current="'Sale Orders'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

        <div class="container-fluid">
            <div class="mb-1.25 grid grid-cols-1 gap-1.25 md:grid-cols-2 lg:grid-cols-5">
                <div class="card">
                    <div class="card-body">
                        <div class="mb-5 flex w-full items-center justify-between gap-3">
                            <h3 class="text-xl"><span data-target="93.7">0</span></h3>
                            <div class="size-9 flex items-center justify-center bg-success rounded-full!">
                                <i class="iconify tabler--check size-5.5 text-white"></i>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1">
                                <span class="text-xs uppercase font-bold">Completed Orders</span>
                            </div>
                            <span class="badge bg-success/15 text-success ms-auto">+0.00%</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="mb-5 flex w-full items-center justify-between gap-3">
                            <h3 class="text-xl"><span data-target="557">0</span></h3>
                            <div class="size-9 flex items-center justify-center bg-warning rounded-full!">
                                <i class="iconify tabler--hourglass size-5.5 text-white"></i>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1">
                                <span class="text-xs uppercase font-bold">Pending Orders</span>
                            </div>
                            <span class="badge bg-danger/15 text-danger ms-auto">0.00%</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="mb-5 flex w-full items-center justify-between gap-3">
                            <h3 class="text-xl"><span data-target="269">0</span></h3>
                            <div class="size-9 flex items-center justify-center bg-danger rounded-full!">
                                <i class="iconify tabler--x size-5.5 text-white"></i>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1">
                                <span class="text-xs uppercase font-bold">Canceled Orders</span>
                            </div>
                            <span class="badge bg-danger/15 text-danger ms-auto">0%</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="mb-5 flex w-full items-center justify-between gap-3">
                            <h3 class="text-xl"><span data-target="9.3">0</span></h3>
                            <div class="size-9 flex items-center justify-center bg-info rounded-full!">
                                <i class="iconify tabler--shopping-cart size-5.5 text-white"></i>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1">
                                <span class="text-xs uppercase font-bold">New Orders</span>
                            </div>
                            <span class="badge bg-success/15 text-success ms-auto">+0.00%</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <div class="mb-5 flex w-full items-center justify-between gap-3">
                            <h3 class="text-xl"><span data-target="8,741">0</span></h3>
                            <div class="size-9 flex items-center justify-center bg-primary rounded-full!">
                                <i class="iconify tabler--refresh size-5.5 text-white"></i>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-1">
                                <span class="text-xs uppercase font-bold">Returned Orders</span>
                            </div>
                            <span class="badge bg-success/15 text-success ms-auto">+0.00%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div data-table="" data-table-rows-per-page="8" class="card">
                <div class="card-header">
                    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 class="text-xl font-semibold">Sale Orders</h3>
                            <p class="text-slate-500">Search, filter and manage your order history with import support.</p>
                        </div>
                        
                    </div>
                </div>

                <div class="card-body">
                    <div class="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div class="w-full">
                            <nav class="border-default-300 flex flex-wrap border-b" aria-label="Tabs" role="tablist">
                                <button
                                    type="button"
                                    id="history-icon"
                                    aria-selected="activeTab === 'history'"
                                    class="hs-tab-active:border-b hs-tab-active:border-success hs-tab-active:text-success hover:text-success inline-flex items-center px-4 py-2 text-center font-medium focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                                    :class="activeTab === 'history' ? 'border-b border-success text-success' : 'text-slate-600'"
                                    @click="setTab('history')"
                                    role="tab"
                                >
                                    <i class="iconify tabler--list-details size-5.5"></i>
                                </button>

                                <button
                                    type="button"
                                    id="import-icon"
                                    aria-selected="activeTab === 'import'"
                                    class="hs-tab-active:border-b hs-tab-active:border-success hs-tab-active:text-success hover:text-success inline-flex items-center px-4 py-2 text-center font-medium focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                                    :class="activeTab === 'import' ? 'border-b border-success text-success' : 'text-slate-600'"
                                    @click="setTab('import')"
                                    role="tab"
                                >
                                    <i class="iconify tabler--download size-5.5"></i>
                                </button>
                            </nav>
                        </div>
                        <div class="text-slate-500 text-sm">
                            {{ tabs.find(tab => tab.key === activeTab)?.subtitle }}
                        </div>
                    </div>

                    <div class="tab-content">
                        <div v-show="activeTab === 'history'">
                            <!-- <OrderHistoryTab /> -->
                        </div>
                        <div v-show="activeTab === 'import'">
                            <ImportOrdersTab />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
