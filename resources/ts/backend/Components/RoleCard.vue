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
                <img :src="`/backend/images/auth-card-bg.svg`" alt="auth-card-bg">
            </div>
            <div class="card-body">
                <div class="mb-7.5 flex items-start">
                    <div>
                        <div class="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-md">
                            <i class="iconify tabler--shield-lock text-2xl"></i>
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
                                <i class="iconify tabler--dots-vertical text-xl"></i>
                            </button>
                            <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical" tabindex="-1">
                                <div class="space-y-0.5">
                                    <a class="dropdown-item" href="#">
                                        <i class="iconify tabler--eye"></i>
                                        View
                                    </a>
                                    <a class="dropdown-item" href="#">
                                        <i class="iconify tabler--edit"></i>
                                        Edit
                                    </a>
                                    <a class="dropdown-item text-danger" href="#">
                                        <i class="iconify tabler--trash"></i>
                                        Remove
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="mb-base flex flex-col gap-y-3">
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
                        Daily Risk Assessment
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
                        Manage Security Logs
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
                        input Access Rights
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
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
                        <i class="iconify tabler--clock"></i>
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
                <img :src="`/backend/images/auth-card-bg.svg`" alt="auth-card-bg">
            </div>
            <div class="card-body">
                <div class="mb-7.5 flex items-start">
                    <div>
                        <div class="bg-primary/15 text-primary flex size-12 items-center justify-center rounded-md">
                            <i class="iconify tabler--shield-lock text-2xl"></i>
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
                                <i class="iconify tabler--dots-vertical text-xl"></i>
                            </button>
                            <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical" tabindex="-1">
                                <div class="space-y-0.5">
                                    <router-link class="dropdown-item" :to="{ name: 'show-role', params: { uuid: props.items?.uuid } }">
                                        <i class="iconify tabler--eye"></i>
                                        View
                                    </router-link>
                                    <router-link class="dropdown-item" :to="{ name: 'edit-role', params: { uuid: props.items?.uuid } }">
                                        <i class="iconify tabler--edit"></i>
                                        Edit
                                    </router-link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="mb-base flex flex-col gap-y-3">
                <li class="flex items-center gap-3">
                    <i class="iconify tabler--check text-success text-base"></i>
                    Manage daily tasks and responsibilities efficiently
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
                        Collaborate with team members and stakeholders
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
                        Maintain accurate records and documentation
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
                        Ensure compliance with company policies and standards
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
                        Identify issues and implement effective solutions
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="iconify tabler--check text-success text-base"></i>
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
                        <i class="iconify tabler--clock"></i>
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
