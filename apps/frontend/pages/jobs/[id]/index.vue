<script setup lang="ts">
definePageMeta({
  name: "job",
});

const { id } = useRoute().params as { id: string };

const { data, error } = await useFetch<{
  id: number;
  title: string;
  description: string;
  createdAt: string;
  userId: number;
}>("/api/jobs/jobs/" + id, {
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
});

if (error.value) {
  const toast = useToast();
  toast.add({
    title: "Error",
    color: "red",
    description: error.value?.data?.message || "Job not found.",
  });
  throw createError({
    statusCode: 404,
    message: "Job listing not found.",
  });
}
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">
          {{ data?.title || "N/A" }}
        </h1>
      </div>
      <div>
        <AppButton :to="{ name: 'interview', params: { id } }">Apply</AppButton>
      </div>
    </div>
    <div class="grid gap-4 py-4">
      <div class="card bg-white shadow-lg shadow-blue-100">
        <div class="card-body">
          <div class="font-bold text-2xl">Job Description</div>
          <div class="whitespace-pre-wrap">
            {{ data?.description || "N/A" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
