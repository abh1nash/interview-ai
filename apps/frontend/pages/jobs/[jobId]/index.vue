<script setup lang="ts">
definePageMeta({
  name: "job",
});

const { jobId } = useRoute().params as { jobId: string };
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">Job Title</h1>
      </div>
      <div>
        <AppButton :to="{ name: 'interview', params: { jobId } }"
          >Apply</AppButton
        >
      </div>
    </div>
    <div class="grid gap-4 py-4">
      <div class="card bg-white shadow-lg shadow-blue-100">
        <div class="card-body">
          <div class="font-bold text-2xl">Job Description</div>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatum, voluptate, quibusdam, quia voluptas quod quos
            voluptatibus quae doloribus quidem voluptatem. Quisquam voluptatum,
            voluptate, quibusdam, quia voluptas quod quos voluptatibus quae
            doloribus quidem voluptatem.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
