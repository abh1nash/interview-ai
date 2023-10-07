<script setup lang="ts">
definePageMeta({
  name: "Reports",
});

const { data: my } = useNuxtData<{
  id: number;
  role: "candidate" | "employer";
}>("profile");

const { data, error } = await useFetch<
  { id: number; title: string; createdAt: string }[]
>("/api/jobs/jobs/list/user/" + my?.value?.id, {
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  lazy: true,
});
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">My Jobs</h1>
      </div>
    </div>
    <div class="grid gap-4 py-4">
      <div v-if="data && data.length < 1">
        You have not created any jobs yet.
      </div>
      <div
        class="card bg-white shadow-lg shadow-blue-100"
        v-for="job in data"
        :key="job.id"
      >
        <div class="card-body">
          <div class="font-bold text-2xl">
            <nuxt-link :to="{ name: 'JobReports', params: { jobId: job.id } }">
              {{ job.title }}
            </nuxt-link>
          </div>
          <div>
            <AppButton
              :to="{ name: 'JobReports', params: { jobId: job.id } }"
              flat-primary
              >View Reports</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
