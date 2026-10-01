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
        <aside>
            <!-- Sidenav Menu Brand Logo -->
            <div id="sidenav-menu">
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
            </div>
        </aside>
        <!-- End::app-sidebar -->
    </div>
</template>

<style scoped></style>
