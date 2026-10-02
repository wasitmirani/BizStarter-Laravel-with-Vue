<script setup lang="ts">
import { Helpers } from "../../Utils/Helper";

const UserProfile = Helpers.useDynamicDefineAsyncComponent(() => import("./partials/UserProfileComponent.vue"));
const SecurityComponent = Helpers.useDynamicDefineAsyncComponent(() => import("./partials/SecurityComponent.vue"));

const auth_user = Helpers.auth();
const activeTab = Helpers.useDynamicRef("account");
const tabs_list = Helpers.useDynamicRef([
    { name: "account", icon: "ri-user-settings-line", label: "Account" },
    { name: "security", icon: "ri-lock-line", label: "Security" },
]);

const setTab = (name: string) => {
    activeTab.value = name;
};

const getComponent = (name: any) => {
    switch (name) {
        case "account":
            return UserProfile;
        case "security":
            return SecurityComponent;
        default:
            return null;
    }
};
</script>

<template>
    <div>
        <div class="gap-2 page-heading mb-4 flex-column flex-md-row">
            <h6 class="flex-grow-1 mb-0">Account</h6>
            <ul class="breadcrumb flex-shrink-0 mb-0">
                <li class="breadcrumb-item">
                    <router-link to="/app/dashboard">Home</router-link>
                </li>
                <li class="breadcrumb-item active">Account</li>
            </ul>
        </div>

        <div class="card">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs gap-2 border-0">
                    <li v-for="tab in tabs_list" :key="tab.name" class="nav-item">
                        <button
                            type="button"
                            class="nav-link"
                            :class="{ active: activeTab === tab.name }"
                            @click="setTab(tab.name)"
                        >
                            <i :class="[tab.icon, 'me-1']"></i>
                            {{ tab.label }}
                        </button>
                    </li>
                </ul>
            </div>
            <div class="card-body">
                <component :is="getComponent(activeTab)" :user="auth_user" />
            </div>
        </div>
    </div>
</template>
