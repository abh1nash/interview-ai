<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>
<template>
  <div
    v-if="loading"
    class="absolute top-0 z-10 left-0 h-full w-full rounded-md bg-white/90 flex items-center justify-center"
  >
    <div class="loading loading-dots loading-lg text-blue-500"></div>
  </div>
</template>
