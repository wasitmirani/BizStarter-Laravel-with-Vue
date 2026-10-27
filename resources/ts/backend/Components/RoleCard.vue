<script setup lang="ts">
import { Helpers } from '../Utils/Helper';
const props = defineProps(['items']);
</script>

<template>
    <!--
        This RoleCard now supports both:
        - an array of roles (using v-for over items)
        - a single role object (items is a single object)
        We handle both cases.
    -->
    <template v-if="Array.isArray(props.items) && props.items.length">
        <div class="card" v-for="item in items" :key="item?.id ?? item?.name">
            <div class="absolute end-0 top-0 size-45">
                <img src="/backend/assets/images/shape-3.svg" alt="auth-card-bg">
            </div>
            <div class="card-body">
                <div class="mb-7.5 flex items-start">
                    <div>
                        <div class="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-md">
                            <AppIcon name="shield-lock" class="text-2xl" />
                        </div>
                    </div>
                    <div class="ms-6">
                        <h5 class="mb-1.5 text-sm">{{ $helpers.capitalize(item.name) }}</h5>
                        <p class="text-default-400">{{ item?.description ?? '' }}</p>
                    </div>
                    <div class="relative ms-auto">
                        <div class="hs-dropdown relative inline-flex [--placement:bottom-right]">
                            <button type="button" class="hs-dropdown-toggle text-lg text-default-400" aria-haspopup="menu"
                                aria-expanded="false" aria-label="Dropdown">
                                <AppIcon name="dots-vertical" class="text-xl" />
                            </button>
                            <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical" tabindex="-1">
                                <div class="space-y-0.5">
                                    <a class="dropdown-item" href="#">
                                        <AppIcon name="eye" />
                                        View
                                    </a>
                                    <a class="dropdown-item" href="#">
                                        <AppIcon name="edit" />
                                        Edit
                                    </a>
                                    <a class="dropdown-item text-danger" href="#">
                                        <AppIcon name="trash" />
                                        Remove
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="mb-base flex flex-col gap-y-3">
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Daily Risk Assessment
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Manage Security Logs
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        input Access Rights
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Emergency Protocols
                    </li>
                </ul>
                <p class="text-default-400 mb-3 text-sm">Total {{ item?.users?.length }} users</p>
                <div class="mb-base flex items-center -space-x-2">
                    <img
                        v-for="user in item?.users"
                        :key="user?.id ?? user?.name"
                        :src="user?.thumbnail" :alt="user?.name"
                        class="transitio-all size-8 rounded-full duration-200 hover:-translate-y-1"
                        v-if="item?.users"
                    >
                </div>
                <div class="flex justify-between">
                    <span class="text-default-400 flex items-center gap-1.5 text-xs">
                        <AppIcon name="clock" />
                        {{ $filters.HoursFormat(item?.updated_at) }}
                    </span>
                    <div>
                        <!-- Details button can go here -->
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="props.items && typeof props.items === 'object'">
        <!-- Single Role object support -->

        <div class="card">
            <div class="absolute end-0 top-0 size-45">
                <img src="/backend/assets/images/shape-3.svg" alt="auth-card-bg">
            </div>
            <div class="card-body">
                <div class="mb-7.5 flex items-start">
                    <div>
                        <div class="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-md">
                            <AppIcon name="shield-lock" class="text-2xl" />
                        </div>
                    </div>
                    <div class="ms-6">
                        <h5 class="mb-1.5 text-sm">{{ $helpers.capitalize(props.items?.name) }}</h5>
                        <p class="text-default-400">{{ props.items?.description ?? 'No description available' }}</p>
                    </div>
                    <div class="relative ms-auto">
                        <div class="hs-dropdown relative inline-flex [--placement:bottom-right]">
                            <button type="button" class="hs-dropdown-toggle text-lg text-default-400" aria-haspopup="menu"
                                aria-expanded="false" aria-label="Dropdown">
                                <AppIcon name="dots-vertical" class="text-xl" />
                            </button>
                            <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical" tabindex="-1">
                                <div class="space-y-0.5">
                                    <router-link class="dropdown-item" :to="{ name: 'show-role', params: { uuid: props.items?.uuid } }">
                                        <AppIcon name="eye" />
                                        View
                                    </router-link>
                                    <router-link class="dropdown-item" :to="{ name: 'edit-role', params: { uuid: props.items?.uuid } }">
                                        <AppIcon name="edit" />
                                        Edit
                                    </router-link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="mb-base flex flex-col gap-y-3">
                <li class="flex items-center gap-3">
                    <AppIcon name="check" class="text-success text-base" />
                    Manage daily tasks and responsibilities efficiently
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Collaborate with team members and stakeholders
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Maintain accurate records and documentation
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Ensure compliance with company policies and standards
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Identify issues and implement effective solutions
                    </li>
                    <li class="flex items-center gap-3">
                        <AppIcon name="check" class="text-success text-base" />
                        Continuously improve processes and workflows
                    </li>
                </ul>
                <p class="text-default-400 mb-3 text-sm">Total {{ props.items?.users?.length }} users</p>
                <div class="mb-base flex items-center -space-x-2">
                    <img
                        v-for="user in props.items?.users"
                        :key="user?.id ?? user?.name"
                        :src="user?.thumbnail" :alt="user?.name"
                        class="transitio-all size-8 rounded-full duration-200 hover:-translate-y-1"
                        v-if="props.items?.users"
                    >
                </div>
                <div class="flex justify-between">
                    <span class="text-default-400 flex items-center gap-1.5 text-xs">
                        <AppIcon name="clock" />
                        {{ $filters.HoursFormat(props.items?.created_at) }}
                    </span>
                    <div>
                        <!-- Details button can go here -->
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
