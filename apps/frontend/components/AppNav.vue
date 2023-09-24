<script setup lang="ts"></script>
<template>
  <div
    class="w-full fixed top-0 h-16 bg-white/25 backdrop-blur py-1 z-10 border border-b border-white"
  >
    <div class="container mx-auto">
      <div class="flex items-center justify-between h-full">
        <div class="flex-1 text-lg">
          <nuxt-link to="/"
            >AI
            <span class="font-bold text-blue-500">Interview</span>
          </nuxt-link>
        </div>
        <div class="flex gap-2">
          <AppButton flat :to="{ name: 'login' }">Login</AppButton>
          <AppButton :to="{ name: 'sign-up' }">Sign Up</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
