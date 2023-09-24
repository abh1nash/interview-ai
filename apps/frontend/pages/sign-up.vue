<script setup lang="ts">
definePageMeta({
  name: "sign-up",
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
        <div class="grid md:grid-cols-2 gap-6 divide-x">
          <div class="grid gap-2">
            <div>
              <label class="label font-bold pb-0" for="name"> Name </label>
              <input id="name" type="text" class="input w-full shadow-md" />
            </div>
            <div>
              <label class="label font-bold pb-0" for="email"> Email</label>
              <input id="email" type="email" class="input w-full shadow-md" />
            </div>
            <div>
              <label class="label font-bold pb-0" for="password">
                Password</label
              >
              <input
                id="password"
                type="password"
                class="input w-full shadow-md"
              />
            </div>
            <div class="form-control">
              <div class="font-bold">Your role</div>
              <div>
                <label class="label cursor-pointer pb-0">
                  <span class="label-text">Candidate</span>
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    class="radio checked:bg-blue-500"
                  />
                </label>
                <label class="label cursor-pointer pb-0">
                  <span class="label-text">Employer</span>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    class="radio checked:bg-blue-500"
                  />
                </label>
              </div>
            </div>
            <div>
              <AppButton class="w-full" type="submit">Sign Up</AppButton>
            </div>
          </div>
          <div class="p-4 text-center">
            <div>Already have an account?</div>
            <AppButton flat-primary :to="{ name: 'login' }"> Log In</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
