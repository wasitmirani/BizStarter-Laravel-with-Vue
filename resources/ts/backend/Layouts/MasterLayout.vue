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
        <div class="main-content app-content">
            <div class="container-fluid">

                <router-view v-slot="{ Component }">
                    <Transition name="slide-fade">
                        <component :is="Component" />
                    </Transition>
                    <!-- Start::row-1 -->
                </router-view>
                <FlashMessage ref="toast" />

            </div>
        </div>
        <!-- End::app-content -->
        <!-- END MAIN-CONTENT -->
        <!-- FOOTER -->
        <Footer />
        <!-- Start::main-modal -->

        <div class="modal fade" id="header-responsive-search" tabindex="-1" aria-labelledby="header-responsive-search"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="input-group">
                            <input type="text" class="form-control border-end-0" placeholder="Search Anything ..."
                                aria-label="Search Anything ..." aria-describedby="button-addon2">
                            <button class="btn btn-primary" type="button" id="button-addon2"><i
                                    class="bi bi-search"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- End::main-modal -->

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
