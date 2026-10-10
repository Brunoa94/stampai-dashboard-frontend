<script setup lang="ts">
import { useConnectionSettings } from "@/shared/lib/composables/useConnectionSettings";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";

const emit = defineEmits<{ close: [] }>();

const { origin, token, timezone, error, saveConnection } =
  useConnectionSettings();

function save(): void {
  if (saveConnection()) emit("close");
}
</script>

<template>
  <Panel>
    <Heading>API connection</Heading>

    <Paragraph class="my-3">
      Public API origin without /api. Access tokens stay in memory and are
      cleared on logout. Provider secrets belong on your backend.
    </Paragraph>

    <form class="grid gap-4 md:grid-cols-3" @submit.prevent="save">
      <Label for="origin">
        API origin
        <Input
          id="origin"
          v-model="origin"
          placeholder="https://api.example.com"
        />
      </Label>

      <Label for="token">
        Bearer JWT
        <Input id="token" v-model="token" type="password" autocomplete="off" />
      </Label>

      <Label for="timezone">
        GA4 property timezone
        <Input
          id="timezone"
          v-model="timezone"
          placeholder="Europe/Amsterdam"
        />
      </Label>

      <Alert v-if="error" class="md:col-span-3">{{ error }}</Alert>

      <div class="flex gap-2 md:col-span-3">
        <Button type="submit" variant="primary">Apply connection</Button>

        <Button @click="emit('close')">Cancel</Button>
      </div>
    </form>
  </Panel>
</template>
