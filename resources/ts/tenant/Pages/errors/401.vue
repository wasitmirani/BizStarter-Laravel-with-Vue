<template lang="">
    <div>
        <div class="misc-wrapper">
            <h1 class="mb-2 mx-2" style="font-size: 6rem;line-height: 6rem;">401</h1>
            <h4 class="mb-2">You are not authorized! 🔐</h4>
            <p class="mb-3 mx-2">You don’t have permission to access this page. Go Home!</p>
            <router-link to="/app" class="btn btn-primary text-center my-5 waves-effect waves-light">Back to home</router-link>

            <div class="d-flex justify-content-center mt-12">
              <div class="d-flex flex-column align-items-center">
                <img src="/backend/assets/images/astronaut.webp" alt="not authorized" class="img-fluid z-1" width="220">
              </div>
            </div>
          </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="">
    
</style>