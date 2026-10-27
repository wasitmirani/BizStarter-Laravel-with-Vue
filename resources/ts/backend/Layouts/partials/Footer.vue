<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
    <!-- Footer Start -->
    <footer class="footer">
        <div class="container-fluid">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-base">
                <div class="text-center md:text-start">
                    © {{ year }}
                    <span class="font-semibold">UniPilot</span>
                    · Italy master's admissions intelligence
                </div>

                <div class="md:text-end hidden md:block">
                    <span class="d-inline-flex align-items-center gap-1">
                        <AppIcon name="shield-check" :size="14" /> Private workspace
                    </span>
                </div>
            </div>
        </div>
    </footer>
    <!-- Footer End -->
</template>
