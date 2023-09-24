<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  name: "new-job",
});

const router = useRouter();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      title: z.string().min(3).max(255),
      description: z.string().min(3),
    })
  ),
});

const isLoading = ref(false);
const onSubmit = handleSubmit(async (formData) => {
  isLoading.value = true;
  const { data, error } = await useFetch<{ id: number }>(
    "/api/jobs/jobs/create",
    {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      method: "post",
      body: formData,
      headers: {
        Authorization: `Bearer ${
          useLocalStorage<string | undefined>("token", undefined).value
        }`,
      },
    }
  );
  isLoading.value = false;
  const toast = useToast();
  if (error.value) {
    toast.add({
      title: "Error",
      color: "red",
      description: error.value?.data?.message || "Unable to create job.",
    });
    return;
  }
  toast.add({
    title: "Success",
    color: "green",
    description: "You have successfully created a job.",
  });
  navigateTo({ name: "job", params: { id: data.value?.id } });
});
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">New Job</h1>
      </div>
      <div>
        <AppButton type="button" @click="router.go(-1)" flat-primary>
          Back
        </AppButton>
      </div>
    </div>
    <div class="grid gap-4 py-4">
      <div
        class="card relative bg-gradient-to-b from-blue-100/10 to-white shadow-lg shadow-blue-100"
      >
        <div class="card-body">
          <AppLoader :loading="isLoading"></AppLoader>
          <form @submit="onSubmit">
            <div>
              <VeeField name="title" v-slot="{ field }">
                <label class="label font-bold pb-0" for="title"> Title </label>
                <input
                  id="title"
                  type="text"
                  class="input w-full shadow-md"
                  v-bind="field"
                />
                <VeeErrorMessage
                  name="title"
                  class="text-error"
                ></VeeErrorMessage>
              </VeeField>
            </div>
            <div>
              <VeeField name="description" v-slot="{ field }">
                <label class="label font-bold pb-0" for="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows="10"
                  class="textarea shadow-md w-full"
                  placeholder="Add job description here..."
                  v-bind="field"
                ></textarea>
                <VeeErrorMessage
                  name="description"
                  class="text-error"
                ></VeeErrorMessage>
              </VeeField>
            </div>
            <div>
              <AppButton type="submit">Submit Job</AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
