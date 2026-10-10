<script setup lang="ts">
import Alert from "@/shared/ui/Alert/Alert.vue";
import { useApiConnectionStatus } from "@/shared/lib/composables/useApiConnectionStatus";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";

interface PropsI {
  authenticationRequired?: boolean;
}

const props = withDefaults(defineProps<PropsI>(), {
  authenticationRequired: false,
});

const { message } = useApiConnectionStatus(() => props.authenticationRequired);
</script>

<template>
  <Alert v-if="message" :title="ERROR_MESSAGES.CONNECTION">{{ message }}</Alert>
</template>
