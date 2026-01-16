<script setup lang="ts">
import { UserService } from '../../Services/user/UserService';
import UserTable from './UserTable.vue';
import UserFilterForm from './UserFilterForm.vue';
import OffCanvas from "../../Components/OffCanvas.vue";
import { DropdownOptions } from '../../Utils/DropdownOptions';


const users = Helpers.useDynamicRef([]);
const current_page   = Helpers.useDynamicRef(1);
const toast = Helpers.useDynamicInject('toast');
const isLoading = Helpers.useDynamicRef(false);
const sortableFilterOptions = DropdownOptions.sortableFilterOptions()

const getUsers = async (page = 1, per_page = 10) => {
    current_page.value = page;
    isLoading.value = true;
    await UserService.users(page.toString(), per_page).then((res) => {
        users.value = res.data.result.users;
        // toast.value.showToast(res.status, 'User Data', res.data);
    }).catch((err: any) => {
        console.log("err:", err.response.data.message);
        toast.value.showToast(err.status, 'Error: ' + err.status, err.response.data.message);
    })
    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
}



function loadingStart(value: any) {
    isLoading.value = value;

}
function filterData(data: any) {
    users.value = data.result.users;
}


Helpers.useDynamicOnMounted(() => {
    getUsers();

});

</script>

<template>
    <div>
        <!-- Breadcrumb  -->
        <BreadcrumbComponent :current="'Users'" :links="[{ name: 'Dashboard', route: 'dashboard' }]" />

    <div class="container-fluid">
        <div data-table="" data-table-rows-per-page="8" class="card">
                            <div class="card-header">
                                <!-- Search -->
                                <div class="flex flex-wrap gap-2.5">
                                    <div class="input-icon-group">
                                        <i class="iconify tabler--search input-icon"></i>
                                        <input data-table-search="" type="search" class="form-input w-auto ps-10" placeholder="Search income...">
                                    </div>

                                    <!-- Add New Income -->
                                    <div class="flex gap-1">
                                        <a href="#incomeModal" class="btn bg-primary text-white hover:bg-primary-hover" aria-haspopup="dialog" aria-expanded="false" aria-controls="incomeModal" data-hs-overlay="#incomeModal"> <i class="iconify tabler--plus"></i> Add Income </a>
                                    </div>

                                    <!-- Delete Selected -->
                                    <button data-table-delete-selected="" class="btn bg-danger text-white hover:bg-danger-hover hidden">Delete</button>
                                </div>

                                <div class="flex flex-wrap items-center gap-2.5 lg:flex-nowrap">
                                    <div class="flex flex-wrap items-center gap-2.5 md:flex-nowrap">
                                        <div class="items-center gap-2.5 md:flex">
                                            <span class="font-semibold me-2.5">Filter By:</span>

                                            <!-- Source Filter -->
                                            <div class="input-icon-group">
                                                <i class="iconify tabler--briefcase input-icon"></i>
                                                <select data-table-filter="income-source" class="form-select">
                                                    <option value="">Source</option>
                                                    <option value="Sales">Sales</option>
                                                    <option value="Services">Services</option>
                                                    <option value="Consulting">Consulting</option>
                                                    <option value="Investments">Investments</option>
                                                    <option value="Affiliate">Affiliate</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <!-- Status Filter -->
                                        <div class="input-icon-group">
                                            <i class="iconify tabler--circle-check input-icon"></i>
                                            <select data-table-filter="status" class="form-select">
                                                <option value="">Status</option>
                                                <option value="Received">Received</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Failed">Failed</option>
                                                <option value="Refunded">Refunded</option>
                                            </select>
                                        </div>

                                        <!-- Records Per Page -->
                                        <div class="relative">
                                            <select data-table-set-rows-per-page="" class="form-select">
                                                <option value="5">5</option>
                                                <option value="10" selected="">10</option>
                                                <option value="15">15</option>
                                                <option value="20">20</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <UserTable :users="users" :getUsers="getUsers" :isLoading="isLoading" />
                        </div>

        <!--End::row-1 -->

    </div>
    </div>
</template>
