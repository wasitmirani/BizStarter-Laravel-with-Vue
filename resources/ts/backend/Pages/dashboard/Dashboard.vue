<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import DashboardService from '../../Services/Dashboard/DashboardService';
import { Helpers } from '../../Utils/Helper';

const now = ref(new Date());
let interval: ReturnType<typeof setInterval> | null = null;

const isLoading = ref(true);
const stats = ref<any>(null);
const recentUsers = ref<any[]>([]);
const recentLogins = ref<any[]>([]);
const roleDistribution = ref<any[]>([]);

const authUser = computed(() => Helpers.auth());

const greeting = computed(() => {
    const hour = now.value.getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    return 'Good Evening';
});

const currentDate = computed(() => {
    return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(now.value);
});

const currentTime = computed(() => {
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(now.value);
});

const metricCards = computed(() => [
    {
        label: 'Total Users',
        value: stats.value?.users?.total ?? 0,
        hint: `${stats.value?.users?.new_this_week ?? 0} new this week`,
        icon: 'tabler--users',
        tone: 'primary',
        to: 'users',
    },
    {
        label: 'Active Users',
        value: stats.value?.users?.active ?? 0,
        hint: `${stats.value?.users?.inactive ?? 0} inactive`,
        icon: 'tabler--user-check',
        tone: 'success',
        to: 'users',
    },
    {
        label: 'Roles',
        value: stats.value?.roles?.total ?? 0,
        hint: 'Access control roles',
        icon: 'tabler--shield-lock',
        tone: 'warning',
        to: 'roles',
    },
    {
        label: 'Permissions',
        value: stats.value?.permissions?.total ?? 0,
        hint: 'Defined permissions',
        icon: 'tabler--key',
        tone: 'info',
        to: 'permissions',
    },
]);

const toneClass = (tone: string) => {
    switch (tone) {
        case 'success':
            return 'bg-success/15 text-success';
        case 'warning':
            return 'bg-warning/15 text-warning';
        case 'info':
            return 'bg-info/15 text-info';
        default:
            return 'bg-primary/15 text-primary';
    }
};

const maxRoleUsers = computed(() => {
    const counts = roleDistribution.value.map((role) => role.users_count || 0);
    return Math.max(...counts, 1);
});

const fetchDashboard = async () => {
    isLoading.value = true;
    try {
        const res: any = await DashboardService.getStats();
        const data = res?.data?.result ?? res?.data ?? {};
        stats.value = data.stats ?? null;
        recentUsers.value = data.recent_users ?? [];
        recentLogins.value = data.recent_logins ?? [];
        roleDistribution.value = data.role_distribution ?? [];
    } catch (error) {
        console.error('Failed to load dashboard', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    interval = setInterval(() => {
        now.value = new Date();
    }, 1000);
    fetchDashboard();
});

onUnmounted(() => {
    if (interval) clearInterval(interval);
});
</script>

<template>
    <BreadcrumbComponent
        :current="'Main Dashboard'"
        :links="[{ name: 'Dashboard', route: 'dashboard' }]"
    />

    <div class="container-fluid space-y-base">
        <!-- Welcome -->
        <div class="card overflow-hidden">
            <div class="card-body relative">
                <div class="absolute end-0 top-0 size-45 opacity-40 pointer-events-none">
                    <img src="/backend/images/auth-card-bg.svg" alt="">
                </div>
                <div class="flex flex-wrap items-center justify-between gap-4 relative">
                    <div>
                        <p class="text-default-400 text-sm mb-1">{{ currentDate }} · {{ currentTime }}</p>
                        <h2 class="text-2xl font-semibold mb-1">
                            {{ greeting }}{{ authUser?.name ? `, ${authUser.name}` : '' }}
                        </h2>
                        <p class="text-default-500">
                            Here's what's happening across your workspace today.
                        </p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <router-link
                            v-can="'create-user'"
                            :to="{ name: 'create-user' }"
                            class="btn bg-primary text-white hover:bg-primary-hover"
                        >
                            <i class="iconify tabler--user-plus"></i> Add User
                        </router-link>
                        <router-link
                            v-can="'create-role'"
                            :to="{ name: 'create-role' }"
                            class="btn border border-default-300 hover:bg-default-100"
                        >
                            <i class="iconify tabler--shield-plus"></i> Add Role
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center py-16">
            <LoadingBox :showText="true" text="Loading dashboard..." />
        </div>

        <template v-else>
            <!-- Metric cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-base">
                <router-link
                    v-for="card in metricCards"
                    :key="card.label"
                    :to="{ name: card.to }"
                    class="card hover:shadow-md transition-shadow"
                >
                    <div class="card-body">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="text-default-400 text-sm mb-2">{{ card.label }}</p>
                                <h3 class="text-3xl font-semibold mb-1">{{ card.value }}</h3>
                                <p class="text-default-400 text-xs">{{ card.hint }}</p>
                            </div>
                            <div
                                class="flex size-12 items-center justify-center rounded-md"
                                :class="toneClass(card.tone)"
                            >
                                <i class="iconify text-2xl" :class="card.icon"></i>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-3 gap-base">
                <!-- Recent users -->
                <div class="card xl:col-span-2">
                    <div class="card-header flex items-center justify-between">
                        <h5 class="font-semibold">Recent Users</h5>
                        <router-link :to="{ name: 'users' }" class="text-primary text-sm hover:underline">
                            View all
                        </router-link>
                    </div>
                    <div class="card-body p-0">
                        <div v-if="!recentUsers.length" class="p-6 text-center text-default-400 text-sm">
                            No users yet
                        </div>
                        <div v-else class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="border-b border-default-200 text-default-400">
                                    <tr>
                                        <th class="text-start px-5 py-3 font-medium">User</th>
                                        <th class="text-start px-5 py-3 font-medium">Role</th>
                                        <th class="text-start px-5 py-3 font-medium">Status</th>
                                        <th class="text-start px-5 py-3 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="user in recentUsers"
                                        :key="user.id"
                                        class="border-b border-default-100 last:border-0 hover:bg-default-50"
                                    >
                                        <td class="px-5 py-3">
                                            <router-link
                                                :to="{ name: 'show-user', params: { uuid: user.uuid } }"
                                                class="flex items-center gap-3"
                                            >
                                                <img
                                                    :src="user.thumbnail"
                                                    :alt="user.name"
                                                    class="size-9 rounded-full object-cover"
                                                >
                                                <div>
                                                    <p class="font-medium text-default-800">{{ user.name }}</p>
                                                    <p class="text-default-400 text-xs">{{ user.email }}</p>
                                                </div>
                                            </router-link>
                                        </td>
                                        <td class="px-5 py-3 capitalize text-default-600">
                                            {{ user.roles?.[0]?.name ?? '—' }}
                                        </td>
                                        <td class="px-5 py-3">
                                            <span
                                                class="badge bagde-label"
                                                :class="user.is_active ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'"
                                            >
                                                {{ user.is_active ? 'Active' : 'Inactive' }}
                                            </span>
                                        </td>
                                        <td class="px-5 py-3 text-default-500">
                                            {{ $filters.HoursFormat(user.created_at) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Role distribution -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="font-semibold">Role Distribution</h5>
                    </div>
                    <div class="card-body space-y-4">
                        <div v-if="!roleDistribution.length" class="text-center text-default-400 text-sm py-4">
                            No roles yet
                        </div>
                        <div
                            v-for="role in roleDistribution"
                            :key="role.id"
                            class="space-y-2"
                        >
                            <div class="flex items-center justify-between text-sm">
                                <span class="capitalize font-medium">{{ role.name }}</span>
                                <span class="text-default-400">{{ role.users_count }} users</span>
                            </div>
                            <div class="h-2 rounded-full bg-default-100 overflow-hidden">
                                <div
                                    class="h-full rounded-full bg-primary transition-all"
                                    :style="{ width: `${Math.round((role.users_count / maxRoleUsers) * 100)}%` }"
                                ></div>
                            </div>
                        </div>
                        <div class="pt-2 border-t border-default-200">
                            <p class="text-default-400 text-xs mb-2">
                                Logins today: <span class="text-default-700 font-medium">{{ stats?.logins?.today ?? 0 }}</span>
                                · This week: <span class="text-default-700 font-medium">{{ stats?.logins?.this_week ?? 0 }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent logins -->
            <div class="card">
                <div class="card-header">
                    <h5 class="font-semibold">Recent Logins</h5>
                </div>
                <div class="card-body p-0">
                    <div v-if="!recentLogins.length" class="p-6 text-center text-default-400 text-sm">
                        No login activity yet
                    </div>
                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead class="border-b border-default-200 text-default-400">
                                <tr>
                                    <th class="text-start px-5 py-3 font-medium">User</th>
                                    <th class="text-start px-5 py-3 font-medium">Device</th>
                                    <th class="text-start px-5 py-3 font-medium">Browser / OS</th>
                                    <th class="text-start px-5 py-3 font-medium">IP</th>
                                    <th class="text-start px-5 py-3 font-medium">When</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="login in recentLogins"
                                    :key="login.id"
                                    class="border-b border-default-100 last:border-0 hover:bg-default-50"
                                >
                                    <td class="px-5 py-3">
                                        <div class="flex items-center gap-3">
                                            <img
                                                v-if="login.user?.thumbnail"
                                                :src="login.user.thumbnail"
                                                :alt="login.user?.name"
                                                class="size-8 rounded-full object-cover"
                                            >
                                            <div>
                                                <p class="font-medium">{{ login.user?.name ?? 'Unknown' }}</p>
                                                <p class="text-default-400 text-xs">{{ login.user?.email }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3 capitalize">
                                        {{ login.device_type || login.device_name || '—' }}
                                    </td>
                                    <td class="px-5 py-3 text-default-600">
                                        {{ [login.browser, login.platform].filter(Boolean).join(' · ') || '—' }}
                                    </td>
                                    <td class="px-5 py-3 text-default-500">{{ login.ip_address }}</td>
                                    <td class="px-5 py-3 text-default-500">
                                        {{ $filters.HoursFormat(login.last_login_at) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
