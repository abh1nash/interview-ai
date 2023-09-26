<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  name: "login",
});
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().email(),
      password: z.string().min(8).max(255),
    })
  ),
});

const isLoading = ref(false);

const { setToken } = useAuth();

const onSubmit = handleSubmit(async (formData) => {
  isLoading.value = true;
  const { data, error } = await useFetch<{
    role: "candidate" | "employer";
    token: string;
  }>("/api/user/auth/login", {
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    method: "post",
    body: formData,
  });
  isLoading.value = false;
  if (error.value) {
    const toast = useToast();
    toast.add({
      title: "Error",
      color: "red",
      description: error.value.data.message || "Invalid email or password.",
    });
    return;
  }
  if (data.value) {
    setToken(data.value.token);
    navigateTo({ name: "home" });
  }
});
</script>
<template>
  <div>
    <div
      class="card relative bg-gradient-to-b from-blue-100/10 to-white shadow-lg shadow-blue-100 my-2"
    >
      <div class="card-body">
        <h1
          class="text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-100 py-2"
        >
          Login
        </h1>
        <AppLoader :loading="isLoading"></AppLoader>
        <form @submit="onSubmit">
          <div class="grid md:grid-cols-2 gap-6 divide-x">
            <div class="grid gap-2">
              <div>
                <VeeField name="email" v-slot="{ field }">
                  <label class="label font-bold pb-0" for="email"> Email</label>
                  <input
                    id="email"
                    type="email"
                    class="input w-full shadow-md"
                    v-bind="field"
                  />
                </VeeField>
                <VeeErrorMessage
                  name="email"
                  class="text-error"
                ></VeeErrorMessage>
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
        </form>
      </div>
    </div>
  </div>
</template>
