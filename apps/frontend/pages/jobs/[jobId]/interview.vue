<script setup lang="ts">
definePageMeta({
  name: "interview",
  layout: "chat",
});

const router = useRouter();

const { textarea, input } = useTextareaAutosize();
</script>
<template>
  <div>
    <AppButton type="button" @click="router.go(-1)" flat-primary>
      Back
    </AppButton>
    <div class="text-5xl font-light leading-[1.25em] my-4 text-gray-600">
      This is a question. What is your answer?
    </div>

    <textarea
      ref="textarea"
      v-model="input"
      class="textarea textarea-ghost resize-none w-full text-3xl p-0 my-6 focus:bg-transparent focus:outline-none"
      placeholder="Type your answer here..."
    ></textarea>
    <AppButton type="button">Send</AppButton>
  </div>
</template>
