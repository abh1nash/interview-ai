<script setup lang="ts">
const token = useLocalStorage<string | null>("token", null);

const { setToken, isLoggedIn } = useAuth();
const {
  data: my,
  execute,
  error: profileError,
} = await useFetch<{
  id: number;
  name: string;
  email: string;
  role: "candidate" | "employer";
}>("/api/user/me/", {
  key: "profile",
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
  immediate: false,
  onResponseError: (e) => {
    if (e.response.status === 401) {
      setToken(null);
    }
  },
});

onMounted(async () => {
  if (isLoggedIn.value) {
    refreshNuxtData("profile");
  }
});

watch(isLoggedIn, (value) => {
  if (value) {
    execute();
  }
});
</script>
<template>
  <nav>
    <div
      class="w-full fixed top-0 h-16 bg-white/25 backdrop-blur py-1 z-10 border border-b border-white"
    >
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex items-center text-lg h-12">
            <nuxt-link to="/"
              >AI
              <span class="font-bold text-blue-500">Interview</span>
            </nuxt-link>
          </div>
          <client-only>
            <div v-if="!isLoggedIn" class="flex gap-2">
              <AppButton flat :to="{ name: 'login' }">Login</AppButton>
              <AppButton :to="{ name: 'sign-up' }">Sign Up</AppButton>
            </div>
            <div v-else class="flex gap-2">
              <AppButton v-if="my?.role == 'employer'">Reports</AppButton>
              <AppButton flat @click="setToken(null)"> Logout </AppButton>
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </nav>
</template>
