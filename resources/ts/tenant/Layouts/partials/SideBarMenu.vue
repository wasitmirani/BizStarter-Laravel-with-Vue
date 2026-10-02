<script lang="ts" setup>
import { Helpers } from "../../Utils/Helper";
import SidebarMenu from "../../Utils/Sidebar";

const menuList: any = Helpers.useDynamicRef([]);
const authUser = Helpers.auth();
const tenant = window.__APP_CONTEXT__?.config?.tenant;
const tenantName = tenant?.name ?? window.__APP_CONTEXT__?.config?.appName ?? "Tenant";
const userName = authUser?.name ?? "User";
const userEmail = authUser?.email ?? "";
const userThumb =
    authUser && (authUser as any).thumbnail
        ? String((authUser as any).thumbnail).startsWith("http")
            ? String((authUser as any).thumbnail)
            : `/backend/assets/images/${(authUser as any).thumbnail}`
        : "/backend/assets/images/user-38.webp";

Helpers.useDynamicOnMounted(() => {
    menuList.value = new SidebarMenu().getMenuList();
});

function isActive(link: string) {
    return Helpers.route().path === link ? "active" : "";
}

function isSubActive(item: any) {
    return item.sub_menu?.some((sub: any) => Helpers.route().path === sub.link) ? "active" : "";
}

const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";

function doLogout(event: any) {
    event.preventDefault();
    const existing = Array.from(document.forms).find((f) => {
        try {
            return new URL(f.action, window.location.href).pathname === "/logout" && f.method.toLowerCase() === "post";
        } catch {
            return false;
        }
    }) as HTMLFormElement | undefined;

    if (existing) {
        const tokenInput = existing.querySelector('input[name="_token"]') as HTMLInputElement | null;
        if (tokenInput) tokenInput.value = csrf;
        existing.submit();
        return;
    }

    const f = document.createElement("form");
    f.method = "POST";
    f.action = "/logout";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "_token";
    input.value = csrf;
    f.appendChild(input);
    document.body.appendChild(f);
    f.submit();
}
</script>

<template>
    <div>
        <div id="main-sidebar" class="main-sidebar">
            <div class="sidebar-wrapper">
                <a href="/app/dashboard" class="navbar-brand">
                    <div class="logo-lg">
                        <img
                            src="/backend/assets/images/main-logo.webp"
                            loading="lazy"
                            aria-label="logo"
                            alt="Main Logo"
                            height="26"
                            class="mx-auto logo-dark"
                        />
                        <img
                            src="/backend/assets/images/logo-white.webp"
                            loading="lazy"
                            aria-label="logo"
                            alt="Logo White"
                            height="26"
                            class="mx-auto logo-light"
                        />
                    </div>
                    <div class="logo-sm">
                        <img
                            src="/backend/assets/images/logo-sm-dark.webp"
                            loading="lazy"
                            aria-label="logo"
                            alt="Logo Sm Dark"
                            height="26"
                            class="mx-auto logo-dark"
                        />
                        <img
                            src="/backend/assets/images/logo-sm-dark.webp"
                            loading="lazy"
                            aria-label="logo"
                            alt="Logo Sm White"
                            height="26"
                            class="mx-auto logo-light"
                        />
                    </div>
                </a>

                <div class="dropdown profile-dropdown mb-4">
                    <a href="#!" class="btn px-4 py-5 w-100 position-relative" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="position-relative">
                            <img :src="userThumb" loading="lazy" :alt="userName" class="object-fit-cover rounded-circle size-12 mb-4" />
                            <span class="badge bg-orange rounded-pill fw-normal position-absolute top-50 translate-middle-y profile-version">v.1</span>
                            <span class="size-2 bg-success rounded-circle d-block position-absolute bottom-0 end-0 mb-n6px"></span>
                        </span>
                        <div class="d-flex align-items-end justify-content-center">
                            <div class="flex-grow-1 content text-white text-start">
                                <h6 class="fw-medium text-truncate mb-1 admin-name">{{ userName }}</h6>
                                <p class="fs-14 admin-id text-truncate">{{ tenantName }}</p>
                            </div>
                            <div class="size-6 avatar"><i data-lucide="settings" class="size-4-5 stroke-2"></i></div>
                        </div>
                    </a>
                    <div class="dropdown-menu p-0 profile-dropdown-menu">
                        <span class="text-muted px-5 pt-4 d-block">Welcome Back, {{ userName.split(" ")[0] }}! 👋</span>
                        <ul class="list-unstyled mb-0 p-2 border-bottom">
                            <li>
                                <router-link class="dropdown-item align-items-center px-3 d-flex" :to="{ name: 'user-account' }">
                                    <i class="mgc_user_1_line d-inline-block me-2"></i>
                                    User Profile
                                    <span v-if="userEmail" class="text-muted ms-1 fst-italic fs-15 text-truncate">{{ userEmail }}</span>
                                </router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item align-items-center px-3 d-flex" :to="{ name: 'dashboard' }">
                                    <i class="mgc_dashboard_line d-inline-block me-2"></i>
                                    Dashboard
                                </router-link>
                            </li>
                        </ul>
                        <div class="border-bottom">
                            <div class="d-flex justify-content-between align-items-center py-3 px-5">
                                <div>
                                    <h6 class="mb-0">{{ tenantName }}</h6>
                                    <p class="text-muted fs-sm mb-0">{{ tenant?.domain || "" }}</p>
                                </div>
                            </div>
                        </div>
                        <ul class="list-unstyled mb-0 px-2">
                            <li>
                                <a class="dropdown-item align-items-center d-flex py-4 text-danger" href="#!" @click="doLogout">
                                    <i class="mgc_key_2_line d-inline-block me-2"></i>
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="navbar-menu px-5" id="navbar-menu-list" data-simplebar>
                    <ul class="list-unstyled p-0 navbar-nav-menu">
                        <template v-for="(item, index) in menuList" :key="index">
                            <li v-if="item.type === 'heading'" class="nav-menu-title">{{ item.title }}</li>

                            <li v-else-if="item.type === 'single'" class="nav-item">
                                <router-link :to="item.link" class="nav-link" :class="isActive(item.link)">
                                    <span class="icons"><i :class="`iconify tabler--${item.icon}`"></i></span>
                                    <span class="content">{{ item.title }}</span>
                                </router-link>
                            </li>

                            <li v-else-if="item.type === 'multi'" class="nav-item">
                                <a
                                    class="nav-link collapsed"
                                    :class="isSubActive(item)"
                                    data-bs-toggle="collapse"
                                    :href="`#collapseMenu${index}`"
                                    aria-expanded="false"
                                >
                                    <span class="icons"><i :class="`iconify tabler--${item.icon}`"></i></span>
                                    <span class="content">{{ item.title }}</span>
                                    <span class="ms-auto menu-arrow"><i class="mgc_down_line"></i></span>
                                </a>
                                <div class="collapse" :class="{ show: isSubActive(item) }" :id="`collapseMenu${index}`">
                                    <ul class="nav-menu-sub">
                                        <li v-for="(subItem, subIndex) in item.sub_menu" :key="subIndex">
                                            <router-link :to="subItem.link" class="nav-link" :class="isActive(subItem.link)">
                                                <span>{{ subItem.title }}</span>
                                            </router-link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </template>

                        <li class="nav-menu-title">Session</li>
                        <li class="nav-item">
                            <a href="#!" class="nav-link" @click="doLogout">
                                <span class="icons"><i class="mgc_exit_line"></i></span>
                                <span class="content">Log Out</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
