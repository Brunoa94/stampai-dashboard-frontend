<script setup lang="ts">
import { ref } from "vue";

import { ArrowRight, LockKeyhole } from "@lucide/vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";

const username = ref("");

const password = ref("");

const error = ref("");

const submitted = ref(false);

function submit(): void {
  error.value = "";

  if (!username.value.trim() || !password.value) {
    error.value = ERROR_MESSAGES.REQUIRED;

    return;
  }

  submitted.value = true;
}
</script>

<template>
  <Panel class="w-full max-w-md p-8">
    <div class="mb-6 grid gap-3">
      <Span variant="label" class="text-gold">Your intelligence workspace</Span>

      <Heading as="h1" variant="title" class="text-3xl">Welcome back.</Heading>

      <Paragraph>Sign in to your dashboard.</Paragraph>
    </div>

    <form novalidate class="grid gap-5" @submit.prevent="submit">
      <Label for="username">
        Username
        <Input
          id="username"
          v-model="username"
          autocomplete="username"
          :aria-invalid="Boolean(error)"
        />
      </Label>

      <Label for="password">
        Password
        <Input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          :aria-invalid="Boolean(error)"
        />
      </Label>

      <Alert v-if="error">{{ error }}</Alert>

      <Alert v-if="submitted" variant="info">
        Login UI preview. Authentication is scheduled for a later
        implementation.
      </Alert>

      <Button type="submit" variant="primary" class="w-full">
        <LockKeyhole :size="16" aria-hidden="true" />
        Login
        <ArrowRight :size="16" aria-hidden="true" />
      </Button>
    </form>

    <Paragraph class="mt-6 text-xs">
      This form is a UI preview. It does not authenticate or send credentials.
    </Paragraph>
  </Panel>
</template>
