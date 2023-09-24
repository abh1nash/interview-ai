<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  name: "sign-up",
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(3).max(255),
      email: z.string().email(),
      password: z.string().min(8).max(255),
      role: z.enum(["candidate", "employer"]).optional(),
    })
  ),
});
const isLoading = ref(false);

const onSubmit = handleSubmit(async (formData) => {
  isLoading.value = true;
  const { data, error } = await useFetch("/api/user/user/create", {
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    method: "post",
    body: formData,
  });
  isLoading.value = false;
  const toast = useToast();
  if (error.value) {
    toast.add({
      title: "Error",
      color: "red",
      description: error.value?.data?.message || "Unable to sign up.",
    });
    return;
  }
  if (data.value) {
    toast.add({
      title: "Success",
      color: "green",
      description: "You have successfully signed up.",
    });
    navigateTo({ name: "login" });
  }
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
          Sign Up
        </h1>
        <AppLoader :loading="isLoading"></AppLoader>
        <form @submit="onSubmit">
          <div class="grid md:grid-cols-2 gap-6 divide-x">
            <div class="grid gap-2">
              <div>
                <VeeField name="name" v-slot="{ field }">
                  <label class="label font-bold pb-0" for="name"> Name </label>
                  <input
                    id="name"
                    type="text"
                    class="input w-full shadow-md"
                    v-bind="field"
                  />
                  <VeeErrorMessage
                    name="name"
                    class="text-error"
                  ></VeeErrorMessage>
                </VeeField>
              </div>
              <div>
                <VeeField name="email" v-slot="{ field }">
                  <label class="label font-bold pb-0" for="email"> Email</label>
                  <input
                    id="email"
                    type="email"
                    class="input w-full shadow-md"
                    v-bind="field"
                  />
                  <VeeErrorMessage
                    name="email"
                    class="text-error"
                  ></VeeErrorMessage>
                </VeeField>
              </div>
              <div>
                <VeeField name="password" v-slot="{ field }">
                  <label class="label font-bold pb-0" for="password">
                    Password</label
                  >
                  <input
                    id="password"
                    type="password"
                    class="input w-full shadow-md"
                    v-bind="field"
                  />
                  <VeeErrorMessage
                    name="password"
                    class="text-error"
                  ></VeeErrorMessage>
                </VeeField>
              </div>
              <div class="form-control">
                <div class="font-bold">Your role</div>
                <div class="pl-4">
                  <VeeField
                    name="role"
                    type="radio"
                    value="candidate"
                    v-slot="{ field }"
                  >
                    <label class="label cursor-pointer pb-0">
                      <span class="label-text">Candidate</span>
                      <input
                        type="radio"
                        value="candidate"
                        class="radio checked:bg-blue-500"
                        v-bind="field"
                      />
                    </label>
                  </VeeField>
                  <VeeField
                    name="role"
                    type="radio"
                    value="employer"
                    v-slot="{ field }"
                  >
                    <label class="label cursor-pointer pb-0">
                      <span class="label-text">Employer</span>
                      <input
                        type="radio"
                        value="employer"
                        class="radio checked:bg-blue-500"
                        v-bind="field"
                      />
                    </label>
                  </VeeField>
                </div>
              </div>
              <div>
                <AppButton class="w-full" type="submit">Sign Up</AppButton>
              </div>
            </div>
            <div class="p-4 text-center">
              <div>Already have an account?</div>
              <AppButton flat-primary :to="{ name: 'login' }">
                Log In</AppButton
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
