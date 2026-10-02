
<template>
  <div class="loader-container">
    <div class="loader-wrapper">
      <!-- Outer rotating ring -->
      <div class="loader-ring"></div>

      <!-- Inner pulsing dot -->
      <div class="loader-dot-wrapper">
        <div class="loader-dot"></div>
      </div>
    </div>

    <!-- Optional loading text -->
    <span v-if="showText" class="loader-text">
      {{ text }}
    </span>

    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup>
defineProps({
  showText: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.loader-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
}

.loader-ring {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  border: 4px solid #bfdbfe;
  border-top-color: #3b3ef6;
  animation: spin 1s linear infinite;
}

.loader-dot-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loader-dot {
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background-color: #3b82f6;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.loader-text {
  margin-left: 0.75rem;
  color: #4b5563;
  font-weight: 500;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
