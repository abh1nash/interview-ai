<script setup lang="ts">
definePageMeta({
  name: "home",
});
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">Available Jobs</h1>
      </div>
      <div>
        <AppButton :to="{ name: 'new-job' }">New Job</AppButton>
      </div>
    </div>
    <div class="grid gap-4 py-4">
      <div
        class="card bg-white shadow-lg shadow-blue-100"
        v-for="i in 10"
        :key="i"
      >
        <div class="card-body">
          <div class="font-bold text-2xl">Job Title</div>
          <div>
            <AppButton :to="{ name: 'job', params: { jobId: i } }" flat-primary
              >View Description</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
