<script setup lang="ts">
definePageMeta({
  name: "JobReports",
});

const { jobId } = useRoute().params as { jobId: string };

const { data: jobData, error } = await useFetch<{
  id: number;
  title: string;
  description: string;
  createdAt: string;
  userId: number;
}>("/api/jobs/jobs/" + jobId, {
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
});

const token = useLocalStorage<string | null>("token", null);
const { data, error: reportsError } = await useFetch<
  {
    id: number;
    interviewId: number;
    employerId: number;
    jobId: number;
    candidateId: number;
    summary: string | null;
    suitabilityScore: number | null;
    sentimentSummary: string | null;
    knowledgeSummary: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[]
>("/api/reports/reports/job/" + jobId, {
  method: "get",
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  lazy: true,
  server: false,
});
</script>
<template>
  <div>
    <div class="flex">
      <div class="flex-1">
        <h1 class="text-4xl font-bold font-display">
          Reports for "{{ jobData?.title }}"
        </h1>
        <div class="my-2">
          <AppButton
            flat-primary
            size="sm"
            :to="{ name: 'job', params: { id: jobData?.id } }"
            >View Description</AppButton
          >
        </div>
      </div>
    </div>
    <div class="grid gap-4 py-4">
      <div v-if="data && data.length < 1">
        No reports available yet. Check back later.
      </div>
      <div
        class="card bg-white shadow-lg shadow-blue-100"
        v-for="interview in data"
        :key="interview.id"
      >
        <div class="card-body">
          <div class="font-bold text-2xl">
            <nuxt-link
              :to="{
                name: 'InterviewReports',
                params: { interviewId: interview.id },
              }"
            >
              Candidate: {{ interview.candidateId }}
            </nuxt-link>
          </div>
          <div>
            <AppButton
              :to="{
                name: 'InterviewReports',
                params: { interviewId: interview.id },
              }"
              flat-primary
              >Full Report</AppButton
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
