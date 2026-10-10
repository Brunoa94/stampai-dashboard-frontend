<script setup lang="ts">
import LoginBrand from "@/features/login/ui/components/LoginBrand.vue";
import LoginForm from "@/features/login/ui/components/LoginForm.vue";

import { useRouter } from "vue-router";
import { ArrowRight } from "@lucide/vue";

import Button from "@/shared/ui/Button/Button.vue";

const router = useRouter();
</script>

<template>
  <main
    class="flex min-h-screen flex-col items-center justify-center gap-8 px-5"
  >
    <LoginBrand />

    <LoginForm />

    <Button variant="ghost" @click="router.push('/analytics')">
      Open dashboard preview
      <ArrowRight :size="16" aria-hidden="true" />
    </Button>
  </main>
</template>
