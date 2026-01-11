<script setup lang="ts">

const year = new Date().getFullYear();
const config = {
    appName: 'AppNAME',
};
</script>
<template lang="">
            <!-- Footer Start -->
            <footer class="footer">
                <div class="container-fluid">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-base">
                        <div class="text-center md:text-start">
                            ©
                            {{ year }}
                            Paces By
                            <span class="font-semibold">{{config.appName}}</span>
                        </div>

                        <div class="md:text-end hidden md:block">
                            10GB of
                            <span class="font-bold">250GB</span>
                            Free.
                        </div>
                    </div>
                </div>
            </footer>
            <!-- Footer End -->

</template>
