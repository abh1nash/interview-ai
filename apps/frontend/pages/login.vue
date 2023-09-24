<script setup lang="ts">
definePageMeta({
  name: "login",
});
</script>
<template>
  <div>
    <div
      class="card bg-gradient-to-b from-blue-100/10 to-white shadow-lg shadow-blue-100 my-2"
    >
      <div class="card-body">
        <h1
          class="text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-100 py-2"
        >
          Login
        </h1>
        <div class="grid md:grid-cols-2 gap-6 divide-x">
          <div class="grid gap-2">
            <div>
              <label class="label font-bold pb-0" for="email"> Email</label>
              <input id="email" type="email" class="input w-full shadow-md" />
            </div>
            <div>
              <label class="label font-bold pb-0" for="password">
                Password</label
              >
              <input
                id="password"
                type="password"
                class="input w-full shadow-md"
              />
            </div>
            <div>
              <AppButton class="w-full" type="submit">Login</AppButton>
            </div>
          </div>
          <div class="p-4 text-center">
            <div>Don't have an account?</div>
            <AppButton flat-primary :to="{ name: 'sign-up' }">
              Sign up</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
