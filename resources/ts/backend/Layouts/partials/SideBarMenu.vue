<script lang="ts" setup>
import { Helpers } from "../../Utils/Helper";
import SidebarMenu from "../../Utils/Sidebar";

const menuList: any = Helpers.useDynamicRef([]);

Helpers.useDynamicOnMounted(() => {
    let sidebar = new SidebarMenu();
    const fetchedMenuList = sidebar.getMenuList();
    menuList.value = fetchedMenuList;
});
function isActive(link: string) {
    return Helpers.route().path === link ? 'active' : '';

}
function isAllowed(value: string): boolean {
    console.log("isAllowed", value);
    // return true;
    if (permissions.includes(value)) {
        return true;
    } else {
        return false;
    }
}
const getMenuClass = (type: string) => {
    switch (type) {
        case "heading":
            return "menu-header fw-medium mt-4";
            break;
        default:
            return "menu-item";
            break;
    }
}
</script>

<template>
    <div>
        <!-- Start::app-sidebar -->

        <aside id="app-menu" class="app-menu">
            <!-- Sidenav Menu Brand Logo -->
            <a href="/" class="logo-box">
                <!-- Light Brand Logo -->
                <span class="logo logo-light">
                    <span class="logo-lg">
                        <img :src="`/backend/images/logo.png`" alt="logo">
                    </span>
                    <span class="logo-sm">
                        <img :src="`/backend/images/logo-sm.png`" alt="small logo">
                    </span>
                </span>

                <!-- Dark Brand Logo -->
                <span class="logo logo-dark">
                    <span class="logo-lg">
                        <img :src="`/backend/images/logo-black.png`" alt="dark logo">
                    </span>
                    <span class="logo-sm">
                        <img :src="`/backend/images/logo-sm.png`" alt="small logo">
                    </span>
                </span>
            </a>

            <!-- Sidenav Menu Toggle Button -->
            <div class="h-topbar justify absolute end-5 top-0 flex items-center">
                <button id="button-hover-toggle">
                    <i class="iconify tabler--circle align-middle size-5"></i>
                </button>
            </div>

            <!-- Sidenav Menu Item Link -->
            <div class="relative min-h-0 grow">
                <div class="size-full" data-simplebar="">
                    <div id="user-profile-settings"
                        class="sidenav-user p-5 bg-[url(//backend/images/user-bg-pattern.svg)]">
                        <div class="flex items-center justify-between">
                            <div>
                                <a href="#!" class="link-reset">
                                    <img :src="`/backend/images/users/user-1.jpg`" alt="user-image"
                                        class="mb-3 size-9 rounded-full">
                                    <span class="sidenav-user-name block font-bold text-nowrap">David Dev</span>
                                    <span class="text-xs font-semibold" data-lang="user-role">Art Director</span>
                                </a>
                            </div>

                            <div>
                                <!-- Profile Dropdown Button -->
                                <div class="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                    <button class="cursor-pointer" aria-haspopup="menu" aria-expanded="false"
                                        aria-label="Dropdown">
                                        <i class="iconify tabler--settings ms-1 size-6 align-middle"></i>
                                    </button>

                                    <div class="hs-dropdown-menu" role="menu" aria-orientation="vertical"
                                        aria-labelledby="hs-dropdown-with-icons">
                                        <!-- Header -->
                                        <div class="py-2 px-3.5">
                                            <h6 class="text-xs">Welcome back 👋!</h6>
                                        </div>

                                        <!-- My Profile -->
                                        <a href="#!" class="dropdown-item">
                                            <i class="iconify tabler--user-circle me-1 align-middle text-lg"></i>
                                            <span class="align-middle">Profile</span>
                                        </a>

                                        <!-- Settings -->
                                        <a href="javascript:void(0);" class="dropdown-item">
                                            <i class="iconify tabler--settings-2 me-1 align-middle text-lg"></i>
                                            <span class="align-middle">Account Settings</span>
                                        </a>

                                        <!-- Lock -->
                                        <a href="auth-lock-screen.html" class="dropdown-item">
                                            <i class="iconify tabler--lock me-1 align-middle text-lg"></i>
                                            <span class="align-middle">Lock Screen</span>
                                        </a>

                                        <!-- Logout -->
                                        <a href="javascript:void(0);" class="dropdown-item text-danger">
                                            <i class="iconify tabler--logout me-1 align-middle text-lg"></i>
                                            <span class="align-middle">Log Out</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="sidenav-menu">
                        <ul class="side-nav hs-accordion-group px-2.5 pb-16.5">
                            <template v-if="menuList?.length > 0">
                                <template v-for="(item, index) in menuList" :key="index">
                                    <li v-if="item.type === 'heading'" class="menu-title" data-lang="main">
                                        <span>{{ item.title }}</span>
                                    </li>


                                    <li v-else-if="item.type === 'single'" class="menu-item">
                                        <RouterLink :to="item.link" :class="[isActive(item.link) ? 'menu-link !bg-primary !text-white' : 'menu-link']">


                                            <i :class="`menu-icon iconify tabler--${item.icon}`"></i>
                                            <span class="menu-text !bg-inherit" data-lang="{{ item.title }}">{{
                                                item.title }}</span>
                                        </RouterLink>
                                    </li>
                                    <li v-else-if="item.type === 'multi'" class="menu-item hs-accordion">
                                        <a href="javascript:void(0)" :aria-expanded="false"
                                            :aria-controls="`sidebar-${index}`" :class="['hs-accordion-toggle menu-link', item.sub_menu?.some((sub: any) => Helpers.route().path === sub.link) ? '!bg-primary !text-white' : '']">
                                            <span class="menu-icon">
                                                <i :class="`iconify tabler--${item.icon}`"></i>

                                            </span>
                                            <span class="menu-text" data-lang="{{ item.title }}">{{ item.title }}</span>
                                            <span class="menu-arrow"></span>


                                        </a>

                                        <ul class="sub-menu hs-accordion-content hs-accordion-group"
                                            style="display: none;">

                                            <li v-for="(subItem, subIndex) in item.sub_menu" :key="subIndex"
                                                class="menu-item">

                                                <RouterLink :to="subItem.link" class="menu-link">

                                                    {{ subItem.title }}
                                                </RouterLink>
                                            </li>
                                        </ul>
                                    </li>
                                </template>
                            </template>
                        </ul>




                    </div>
                </div>
            </div>
        </aside>

        <!-- End::app-sidebar -->
    </div>
</template>

<style scoped>
</style>
