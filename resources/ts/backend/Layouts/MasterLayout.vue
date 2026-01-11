<script lang="ts" setup>
import { ref, provide } from 'vue';
import Footer from "./partials/Footer.vue";
import Head from "./partials/Head.vue";
import SideBarMenu from "./partials/SideBarMenu.vue";
import { Helpers } from '../Utils/Helper';
const toast = Helpers.useDynamicRef(null);
provide('toast', toast);
</script>
<template>
    <div>

        <Head />
        <!-- END HEADER -->
        <!-- SIDEBAR -->
        <SideBarMenu />
        <!-- END SIDEBAR -->
        <!-- MAIN-CONTENT -->
        <!-- Start::app-content -->
      <div class="page-content">
            <main>
             

                <router-view v-slot="{ Component }">
                    <Transition name="slide-fade">
                        <component :is="Component" />
                    </Transition>
                    <!-- Start::row-1 -->
                </router-view>
                <FlashMessage ref="toast" />

        </main>

      <Footer />
        </div>
        <!-- End::app-content -->
        <!-- END MAIN-CONTENT -->
        <!-- FOOTER -->



        <!-- Start::main-footer -->

    </div>
</template>

<style>
.slide-fade-enter-active {
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
}

.slide-fade-leave-active {
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(16px);
    opacity: 0;
}
</style>
