<script setup lang="ts">
definePageMeta({
  name: "home",
});
const { isLoggedIn } = useAuth();
const { data, error } = await useFetch<
  { id: number; title: string; createdAt: string }[]
>("/api/jobs/jobs/list", {
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
});

const { data: myData } = useNuxtData<{
  role: "candidate" | "employer";
}>("profile");
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">Available Jobs</h1>
      </div>
      <div v-if="isLoggedIn && myData?.role == 'employer'">
        <AppButton :to="{ name: 'new-job' }">New Job</AppButton>
      </div>
    </div>
    <div class="grid gap-4 py-4">
      <div
        class="card bg-white shadow-lg shadow-blue-100"
        v-for="job in data"
        :key="job.id"
      >
        <div class="card-body">
          <div class="font-bold text-2xl">
            <nuxt-link :to="{ name: 'job', params: { id: job.id } }">
              {{ job.title }}
            </nuxt-link>
          </div>
          <div>
            <AppButton
              :to="{ name: 'job', params: { id: job.id } }"
              flat-primary
              >View Description</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
