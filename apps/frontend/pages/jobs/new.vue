<script setup lang="ts">
definePageMeta({
  name: "new-job",
});

const router = useRouter();
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
        class="card bg-gradient-to-b from-blue-100/10 to-white shadow-lg shadow-blue-100"
      >
        <div class="card-body">
          <div>
            <label class="label font-bold pb-0" for="title"> Title </label>
            <input
              id="title"
              name="title"
              type="text"
              class="input w-full shadow-md"
            />
          </div>
          <div>
            <label class="label font-bold pb-0" for="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="10"
              class="textarea shadow-md w-full"
              placeholder="Add job description here..."
            ></textarea>
          </div>
          <div>
            <AppButton type="submit">Submit Job</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
