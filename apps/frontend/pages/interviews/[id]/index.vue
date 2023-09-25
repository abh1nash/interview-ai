<script setup lang="ts">
const { id: interviewId } = useRoute().params as { id: string };
definePageMeta({
  name: "interview",
  layout: "chat",
});

const router = useRouter();

const token = useLocalStorage<string | undefined>("token", undefined);

const { data, error, execute, pending } = await useFetch<{
  id: number;
  question: string;
}>("/api/jobs/interviews/" + interviewId + "/questions/next", {
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
  immediate: false,
});

onMounted(async () => {
  if (token.value) {
    await execute();
  }
});

const question = computed(() => {
  if (data.value?.id !== -1) {
    if (!data.value?.question) {
      return "Sit tight. We're preparing a set of questions for you...";
    }
    return data.value?.question;
  } else {
    return "You've answered all the questions. Thank you!";
  }
});

const isAnswering = ref(false);
const { textarea, input } = useTextareaAutosize();
const onAnswer = async () => {
  isAnswering.value = true;
  const { error } = await useFetch(
    `/api/jobs/questions/${data.value?.id}/answer`,
    {
      method: "put",
      body: {
        answer: input.value,
      },
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );
  isAnswering.value = false;
  if (error.value) {
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Something went wrong. Please try again later.",
      color: "red",
    });
  } else {
    await execute();
    textarea.value?.focus();
    input.value = "";
  }
};

const isDisabled = computed(() => {
  return isAnswering.value || pending.value || !input.value;
});
</script>
<template>
  <div>
    <AppButton type="button" @click="router.go(-1)" flat-primary>
      Back
    </AppButton>
    <div class="relative">
      <div class="h-16 py-8">
        <span v-if="pending" class="loading loading-bars loading-sm">
          <div class="sr-only" role="alert">Loading...</div>
        </span>
      </div>
      <div class="text-2xl font-light leading-[1.5em] my-4 text-gray-600">
        {{ question }}
      </div>
      <form v-if="data?.id !== -1" @submit.prevent="onAnswer">
        <textarea
          ref="textarea"
          v-model="input"
          class="textarea textarea-ghost resize-none w-full text-3xl p-0 my-6 focus:bg-transparent focus:outline-none"
          placeholder="Type your answer here..."
        ></textarea>
        <AppButton type="submit" v-if="!isDisabled">Send</AppButton>
      </form>
    </div>
  </div>
</template>
