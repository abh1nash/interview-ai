<script setup lang="ts">
definePageMeta({
  name: "InterviewReports",
});
const { jobId, interviewId } = useRoute().params as {
  jobId: string;
  interviewId: string;
};

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
const { data, error: reportsError } = await useFetch<{
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
}>(`/api/reports/reports/${interviewId}`, {
  method: "get",
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
  baseURL: useRuntimeConfig().public.apiBaseUrl,
});

const { data: candidateData, error: candidateError } = await useFetch<{
  id: number;
  name: string;
  email: string;
  role: string;
}>("/api/user/user/" + data?.value?.candidateId, {
  method: "get",
  baseURL: useRuntimeConfig().public.apiBaseUrl,
});
</script>
<template>
  <div>
    <div>
      <h1 class="font-bold text-xl">Report for {{ candidateData?.name }}</h1>
    </div>
    <div class="card my-2 bg-base-100">
      <div class="card-body">
        <div class="flex pb-4 border-b">
          <div class="w-8/12 grid gap-4">
            <div>
              <div class="font-bold">Name</div>
              <div class="text-sm">
                {{ candidateData?.name }}
              </div>
            </div>
            <div>
              <div class="font-bold">Email</div>
              <div class="text-sm">
                {{ candidateData?.email }}
              </div>
            </div>
            <div>
              <div class="font-bold">Job Title</div>
              <div class="text-sm">
                {{ jobData?.title }}
              </div>
              <div class="mt-2">
                <AppButton
                  flat-primary
                  size="sm"
                  :to="{ name: 'job', params: { id: jobData?.id } }"
                  >View Job Description</AppButton
                >
              </div>
            </div>
            <div>
              <div class="font-bold">Summary</div>
              <div class="text-sm">
                {{ data?.summary }}
              </div>
            </div>
          </div>
          <div class="text-center w-4/12">
            <div
              :class="[
                'w-20 h-20',
                'mx-auto',
                'flex items-center justify-center',
                'text-3xl font-bold',
                'rounded-full',
                {
                  'bg-green-500 text-white':
                    data?.suitabilityScore && data?.suitabilityScore >= 80,
                },
                {
                  'bg-yellow-500 text-white':
                    data?.suitabilityScore &&
                    data?.suitabilityScore >= 50 &&
                    data?.suitabilityScore < 80,
                },
                {
                  'bg-red-500 text-white':
                    data?.suitabilityScore && data?.suitabilityScore < 50,
                },
              ]"
            >
              {{ data?.suitabilityScore }}
            </div>
            <div class="text-xs font-bold my-2">
              Suitability Score (out of 100)
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 pt-4">
          <div>
            <div class="font-bold">Knowledge Summary</div>
            <div class="text-sm">
              {{ data?.knowledgeSummary }}
            </div>
          </div>
          <div>
            <div class="font-bold">Sentiment Summary</div>
            <div class="text-sm">
              {{ data?.sentimentSummary }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
