<script setup>

</script>

<template>
    <div>
        <div class="flex min-h-screen items-center">
            <div class="container">
                <div class="flex justify-center lg:p-0 p-12.5">
                    <div class="2xl:w-4/10 md:w-1/2 sm:w-2/3 w-full">
                        <div class="absolute end-0 top-0">
                            <img

                            src="/backend/assets/images/shape-3.svg"
                            alt="auth-card-bg">
                        </div>

                        <div class="absolute start-0 bottom-0 rotate-180">
                            <img   src="/backend/assets/images/shape-3.svg"  alt="auth-card-bg">
                        </div>

                        <div class="mb-4 flex flex-col items-center justify-center text-center">
                            <router-link to="/app" class="auth-logo">
                                <img src="/backend/assets/images/main-logo.webp" alt="logo" class="flex dark:hidden">
                                <img src="/backend/assets/images/logo-white.webp" alt="dark logo" class="hidden dark:flex">
                            </router-link>
                        </div>
                        <div class="p-3 text-center">
                            <div class="my-4">
                                <img src="/backend/assets/images/404.webp" alt="404" class="mx-auto">
                            </div>
                            <!-- <h3 class="mb-2 text-xl font-bold uppercase"> Page Not Found ⚠️</h3> -->
                            <p class="text-default-400">we couldn't find the page you are looking for.</p>
                            <div class="flex justify-center gap-3 mt-7.5">
                                <!-- <router-link  to="/" class="btn border border-secondary text-secondary hover:text-white hover:bg-secondary"> Go Back</router-link> -->
                                <router-link  to="/app"  class="btn bg-primary text-white hover:bg-primary-hover"> Back to Dashboard</router-link>
                            </div>
                        </div>

                        <!-- Auth Footer -->
                        <p class="text-default-400 mt-7.5 text-center">
                            <!-- © -->
                            <!-- <script>
                                document.write(new Date().getFullYear())
                            </script>2026 -->
                            <!-- {{ App.name }} - by
                            <span>Coderthemes</span> -->
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

</style>
