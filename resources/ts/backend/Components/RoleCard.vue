<script setup lang="ts">

const props = defineProps(['items'])

</script>

<template>
    <div class="card" v-for="item in items">
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
                    <h5 class="mb-1.5 text-sm">   {{ $helpers.capitalize(item.name) }}</h5>
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

            <p class="text-default-400 mb-3 text-sm">Total {{ item.users?.length }} users</p>

            <div class="mb-base flex items-center -space-x-2">
                <img :src="user.thumbnail" :alt="user.name"
                    class="transitio-all size-8 rounded-full duration-200 hover:-translate-y-1"
                    v-for="user in item?.users" v-if="item?.users">

            </div>

            <div class="flex justify-between">
                <span class="text-default-400 flex items-center gap-1.5 text-xs">
                    <i class="iconify tabler--clock"></i>
                    {{ $filters.HoursFormat(item.updated_at) }}
                </span>

                <div>
                    <router-link :to="{ name: 'role-details', params: { uuid: item.id } }"
                        class="btn btn-sm border-primary text-primary hover:bg-primary rounded-full border hover:text-white">Details</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
