<script setup lang="ts">

const year = new Date().getFullYear();

</script>
<template lang="">
            <!-- Footer Start -->
            <footer class="footer">
                <div class="container-fluid">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-base">
                        <div class="text-center md:text-start">
                            ©
                            {{ year }}
                            Powered By
                            <span class="font-semibold">{{$appConfig?.appName}}</span>
                        </div>

                        <div class="md:text-end hidden md:block">
                            Environment:
                            <span class="font-bold">{{$appConfig?.appEnv}}</span>
                        </div>
                    </div>
                </div>
            </footer>
            <!-- Footer End -->

</template>
