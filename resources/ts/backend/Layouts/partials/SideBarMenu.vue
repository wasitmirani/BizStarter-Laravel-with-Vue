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
    return true;
    // if (permissions.includes(value)) {
    //     return true;
    // } else {
    //     return false;
    // }
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
  <aside class="app-sidebar sticky" id="sidebar">

    <!-- Start::main-sidebar-header -->
    <div class="main-sidebar-header">
        <a href="/" class="header-logo">
            <img :src="`/backend/assets/images/brand-logos/desktop-logo.png`" alt="logo" class="desktop-logo">
            <img :src="`/backend/assets/images/brand-logos/toggle-dark.png`" alt="logo" class="toggle-dark">
            <img :src="`/backend/assets/images/brand-logos/desktop-dark.png`" alt="logo" class="desktop-dark">
            <img :src="`assets/images/brand-logos/toggle-logo.png`" alt="logo" class="toggle-logo">
        </a>
    </div>
    <!-- End::main-sidebar-header -->

    <!-- Start::main-sidebar -->
    <div class="main-sidebar" id="sidebar-scroll">

        <!-- Start::nav -->
        <nav class="main-menu-container nav nav-pills flex-column sub-open">
            <div class="slide-left" id="slide-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path> </svg>
            </div>
            <ul class="main-menu">

                    <template v-if="menuList?.length > 0">
                        <template v-for="(item, index) in menuList" :key="index">
                            <li v-if="item.type === 'heading'" class="slide__category">
                                <span class="category-name">{{ item.title }}</span>
                            </li>

                            <li v-else-if="item.type === 'single'" class="slide">
                                <RouterLink :to="item.link" class="side-menu__item">
                                    <i :class="`${item.icon}`"></i>
                                    <span class="side-menu__label">{{ item.title }}</span>
                                </RouterLink>
                            </li>

                            <li v-else-if="item.type === 'multi'" class="slide has-sub">
                                <a to="javascript:void(0)" class="side-menu__item">
                                    <i class="ri-arrow-right-s-line side-menu__angle"></i>
                                    <i :class="`${item.icon}`"></i>
                                    <span class="side-menu__label">{{ item.title }}</span>
                                </a>

                                <ul class="slide-menu child1">
                                    <!-- <li class="slide side-menu__label1">
                                        <a href="javascript:void(0)">Maps</a>
                                    </li> -->
                                <li class="slide side-menu__label1">
                                    <a href="javascript:void(0)">{{ item.title }}</a>
                                </li>
                                    <li v-for="(subItem, subIndex) in item.sub_menu" :key="subIndex" class="slide  open">
                                        <!-- <a href="index.html" class="side-menu__item">
                                <svg xmlns="http://www.w3.org/2000/svg" class="side-menu-doublemenu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M54.46,201.54c-9.2-9.2-3.1-28.53-7.78-39.85C41.82,150,24,140.5,24,128s17.82-22,22.68-33.69C51.36,83,45.26,63.66,54.46,54.46S83,51.36,94.31,46.68C106.05,41.82,115.5,24,128,24S150,41.82,161.69,46.68c11.32,4.68,30.65-1.42,39.85,7.78s3.1,28.53,7.78,39.85C214.18,106.05,232,115.5,232,128S214.18,150,209.32,161.69c-4.68,11.32,1.42,30.65-7.78,39.85s-28.53,3.1-39.85,7.78C150,214.18,140.5,232,128,232s-22-17.82-33.69-22.68C83,204.64,63.66,210.74,54.46,201.54Z" opacity="0.2"/><path d="M54.46,201.54c-9.2-9.2-3.1-28.53-7.78-39.85C41.82,150,24,140.5,24,128s17.82-22,22.68-33.69C51.36,83,45.26,63.66,54.46,54.46S83,51.36,94.31,46.68C106.05,41.82,115.5,24,128,24S150,41.82,161.69,46.68c11.32,4.68,30.65-1.42,39.85,7.78s3.1,28.53,7.78,39.85C214.18,106.05,232,115.5,232,128S214.18,150,209.32,161.69c-4.68,11.32,1.42,30.65-7.78,39.85s-28.53,3.1-39.85,7.78C150,214.18,140.5,232,128,232s-22-17.82-33.69-22.68C83,204.64,63.66,210.74,54.46,201.54Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="96" cy="96" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="160" cy="160" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="88" y1="168" x2="168" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                                  {{ subItem.title }}</a> -->

                                        <RouterLink :to="subItem.link" class="side-menu__item">
                                                <!-- <i  :class="`${subItem.icon}`" ></i> -->
                                            {{ subItem.title }}
                                        </RouterLink>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </template>

            </ul>
            <ul class="doublemenu_bottom-menu main-menu mb-0 border-top">

                <!-- Start::slide -->
                <li class="slide">
                    <a href="sign-in-cover.html" class="side-menu__item">
                        <svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M48,40H208a16,16,0,0,1,16,16V200a16,16,0,0,1-16,16H48a0,0,0,0,1,0,0V40A0,0,0,0,1,48,40Z" opacity="0.2"/><polyline points="112 40 48 40 48 216 112 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="112" y1="128" x2="224" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="184 88 224 128 184 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                        <span class="side-menu__label">Logout</span>
                    </a>
                </li>
                <!-- End::slide -->




            </ul>
            <div class="slide-right" id="slide-right"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24"> <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path> </svg></div>
        </nav>
        <!-- End::nav -->

    </div>
    <!-- End::main-sidebar -->

</aside>
<!-- End::app-sidebar -->
    </div>
</template>

<style scoped>

.menu-icon {
  font-size: 22px;
  width:30px;
  color: var(--primary-rgb) !important;
  /* height: 25px; */

  /* color: #666; */
  margin-right: 5px;
}
.sub-menu-icon {
  font-size: 18px !important;
    width:30px;
  color: var(--primary-rgb) !important;
  /* color: #666; */
  margin-right: 10px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: auto;
}

</style>
