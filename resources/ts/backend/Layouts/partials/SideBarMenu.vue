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
const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

function doLogout(event: any) {
    event.preventDefault();
    // First try: submit any existing server-rendered logout form (Blade)
    const existing = Array.from(document.forms).find(f => {
        try { return new URL(f.action, window.location.href).pathname === '/logout' && f.method.toLowerCase() === 'post'; } catch (e) { return false; }
    }) as HTMLFormElement | undefined;

    if (existing) {
        const tokenInput = existing.querySelector('input[name="_token"]') as HTMLInputElement | null;
        if (tokenInput) tokenInput.value = csrf;
        existing.submit();
        return;
    }

    // Fallback: create and submit a form programmatically
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = '/logout';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_token';
    input.value = csrf;
    f.appendChild(input);
    document.body.appendChild(f);
    f.submit();
}
</script>

<template>
    <div>
        <!-- Start::app-sidebar -->
      
            <!-- Sidenav Menu Brand Logo -->
            <!-- <div id="sidenav-menu">
                <ul class="side-nav hs-accordion-group px-2.5 pb-16.5">
                    <template v-if="menuList?.length > 0">
                        <template v-for="(item, index) in menuList" :key="index">
                            <li v-if="item.type === 'heading'" class="menu-title" data-lang="main">
                                <span>{{ item.title }}</span>
                            </li>


                            <li v-else-if="item.type === 'single'" class="menu-item">
                                <RouterLink :to="item.link"
                                    :class="[isActive(item.link) ? 'menu-link !bg-primary !text-white' : 'menu-link']">


                                    <i :class="`menu-icon iconify tabler--${item.icon}`"></i>
                                    <span class="menu-text !bg-inherit" data-lang="{{ item.title }}">{{
                                        item.title }}</span>
                                </RouterLink>
                            </li>
                            <li v-else-if="item.type === 'multi'" class="menu-item hs-accordion">
                                <a href="javascript:void(0)" :aria-expanded="false" :aria-controls="`sidebar-${index}`"
                                    :class="['hs-accordion-toggle menu-link', item.sub_menu?.some((sub: any) => Helpers.route().path === sub.link) ? '!bg-primary !text-white' : '']">
                                    <span class="menu-icon">
                                        <i :class="`iconify tabler--${item.icon}`"></i>

                                    </span>
                                    <span class="menu-text" data-lang="{{ item.title }}">{{ item.title }}</span>
                                    <span class="menu-arrow"></span>


                                </a>

                                <ul class="sub-menu hs-accordion-content hs-accordion-group" style="display: none;">

                                    <li v-for="(subItem, subIndex) in item.sub_menu" :key="subIndex" class="menu-item">

                                        <RouterLink :to="subItem.link" class="menu-link">

                                            {{ subItem.title }}
                                        </RouterLink>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </template>
                </ul>
            </div> -->
            <div id="main-sidebar" class="main-sidebar">
        <div class="sidebar-wrapper">
          <a href="#!" class="navbar-brand">
            <div class="logo-lg">
              <img src="/backend/assets/images/main-logo.webp" loading="lazy" aria-label="logo" alt="Main Logo" height="26" class="mx-auto logo-dark" />
                <img src="/backend/assets/images/logo-white.webp" loading="lazy" aria-label="logo" alt="Logo White" height="26" class="mx-auto logo-light" />
                </div>
                <div class="logo-sm">
                  <img src="/backend/assets/images/logo-sm-dark.webp" loading="lazy" aria-label="logo" alt="Logo Sm Dark" height="26" class="mx-auto logo-dark"/>
                    <img src="/backend/assets/images/logo-sm-dark.webp" loading="lazy" aria-label="logo" alt="Logo Sm White" height="26" class="mx-auto logo-light"/>
                    </div>
                  </a>
                  <div class="dropdown profile-dropdown mb-4">
                    <a href="#!" class="btn px-4 py-5 w-100 position-relative" data-bs-toggle="dropdown" aria-expanded="false">
                      <span class="position-relative">
                        <img src="/backend/assets/images/user-38.webp" loading="lazy" alt="User 38" class="object-fit-cover rounded-circle size-12 mb-4"/>
                          <span class="badge bg-orange rounded-pill fw-normal position-absolute top-50 translate-middle-y profile-version">v.1</span>
                          <span class="size-2 bg-success rounded-circle d-block position-absolute bottom-0 end-0 mb-n6px"></span>
                      </span>
                      <div class="d-flex align-items-end justify-content-center">
                        <div class="flex-grow-1 content text-white text-start">
                          <h6 class="fw-medium text-truncate mb-1 admin-name" data-translate="pe-emma-anderson">Emma Anderson</h6>
                          <p class="fs-14 admin-id">ID: 170001</p>
                        </div>
                        <div class="size-6 avatar"><i data-lucide="settings" class="size-4-5 stroke-2"></i></div>
                      </div>
                    </a>
                    <div class="dropdown-menu p-0 profile-dropdown-menu">
                      <span class="text-muted px-5 pt-4 d-block">Welcome Back, Emma! 👋</span>
                      <ul class="list-unstyled mb-0 p-2 border-bottom">
                        <li>
                          <a class="dropdown-item align-items-center px-3 d-flex" href="pages-user-friends.html"><i class="mgc_user_1_line d-inline-block me-2"></i> User Profile <span class="text-muted ms-1 fst-italic fs-15">@emma.ander</span></a>
                        </li>
                        <li>
                          <a class="dropdown-item align-items-center px-3 d-flex" href="pages-account-settings.html"><i class="mgc_settings_3_line d-inline-block me-2"></i> Profile Preferences</a>
                        </li>
                        <li>
                          <a class="dropdown-item align-items-center px-3 d-flex" href="pages-help-center.html"><i class="mgc_headphone_2_line d-inline-block me-2"></i> Support Center</a>
                        </li>
                        <li>
                          <a class="dropdown-item align-items-center px-3 d-flex" href="pages-pricing.html"><i class="mgc_keyboard_line d-inline-block me-2"></i> Shortcut Keys</a>
                        </li>
                      </ul>
                      <div class="border-bottom">
                        <div class="d-flex justify-content-between align-items-center py-3 px-5">
                          <div>
                            <h6 class="mb-0">Free Plan</h6>
                            <p class="text-muted fs-sm">System control panel</p>
                          </div>
                          <a href="pages-pricing.html" class="badge bg-primary py-6px px-10px rounded-pill">Upgrade</a>
                        </div>
                      </div>
                      <ul class="list-unstyled mb-0 px-2">
                        <li>
                          <a class="dropdown-item align-items-center d-flex py-4 text-danger" href="auth-signin-basic.html"><i class="mgc_key_2_line d-inline-block me-2"></i> Log Out</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="navbar-menu px-5" id="navbar-menu-list" data-simplebar>
                    <ul class="list-unstyled p-0 navbar-nav-menu">
                      <li class="nav-menu-title" data-translate="pe-dashboards">Dashboards</li>
                      <li class="nav-item">
                        <a class="nav-link active collapsed" data-position="right-top" data-bs-toggle="collapse" href="#collapseDashboards" aria-expanded="false">
                          <span class="icons"><i class="mgc_dashboard_line"></i></span>
                          <span class="content" data-translate="pe-dashboards">Dashboards</span>
                          <span class="ms-auto menu-arrow"><i class="mgc_down_line"></i></span>
                        </a>
                        <div class="collapse" id="collapseDashboards">
                          <ul class="nav-menu-sub">
                            <li><a href="index.html" class="nav-link active"><span data-translate="pe-ecommerce">Ecommerce</span></a></li>


                          </ul>
                        </div>
                      </li>

                      <li class="nav-menu-title" data-translate="pe-apps">Apps</li>
                      <li class="nav-item">
                        <a class="nav-link collapsed" href="apps-chat-default.html">
                          <span class="icons"><i class="mgc_wechat_line"></i></span>
                          <span class="content" data-translate="pe-chat">Chat</span>
                        </a>
                      </li>


                    </ul>
                  </div>
                </div>
            </div>
        <!-- End::app-sidebar -->
    </div>
</template>

<style scoped></style>
