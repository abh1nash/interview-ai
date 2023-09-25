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

const isLoading = ref(false);

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
const token = useLocalStorage<string | undefined>("token", undefined);
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
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
  immediate: false,
  onResponseError: (e) => {
    if (e.response.status === 401) {
      token.value = undefined;
    }
  },
});

onMounted(() => {
  if (token.value) {
    execute();
  }
});

const onDelete = async () => {
  isLoading.value = true;
  const { error } = await useFetch("/api/jobs/jobs/" + id, {
    method: "delete",
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  isLoading.value = false;

  if (error.value) {
    const toast = useToast();
    toast.add({
      title: "Error",
      color: "red",
      description: error.value?.data?.message || "Unable to delete job.",
    });
    return;
  }
  const toast = useToast();
  toast.add({
    title: "Success",
    color: "green",
    description: "You have successfully deleted a job.",
  });
  navigateTo({ name: "home" });
};

const isCreatingInterview = ref(false);
const createInterview = async () => {
  isCreatingInterview.value = true;
  const { data, error } = await useFetch<{ id: number }>(
    `/api/jobs/interviews/${id}/create`,
    {
      method: "post",
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );
  isCreatingInterview.value = false;
  if (error.value) {
    const toast = useToast();
    toast.add({
      title: "Error",
      color: "red",
      description: error.value?.data?.message || "Unable to create interview.",
    });
    return;
  }
  navigateTo({ name: "interview", params: { id: data.value?.id } });
};
</script>
<template>
  <div>
    <div class="flex">
      <AppLoader :loading="isLoading"></AppLoader>
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">
          {{ data?.title || "N/A" }}
        </h1>
      </div>
      <client-only>
        <div v-if="my?.role == 'employer' && data?.userId == my?.id">
          <AppButton @click="onDelete" type="button" destructive
            >Delete</AppButton
          >
        </div>
        <div v-if="my?.role == 'candidate'">
          <AppButton
            :loading="isCreatingInterview"
            type="button"
            @click="createInterview"
            >Apply</AppButton
          >
        </div>
      </client-only>
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
