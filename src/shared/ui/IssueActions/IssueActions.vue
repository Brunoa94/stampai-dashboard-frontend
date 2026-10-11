<script setup lang="ts">
import { ref } from "vue";
import { CircleDot, ExternalLink, ShieldCheck } from "@lucide/vue";
import Button from "@/shared/ui/Button/Button.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import type { ReportIssueType } from "@/shared/lib/types/reportIssues";

interface PropsI {
  label: string;
  issue?: ReportIssueType;
  pending?: boolean;
  disabled?: boolean;
  error?: string;
}

withDefaults(defineProps<PropsI>(), {
  issue: undefined,
  pending: false,
  disabled: false,
  error: "",
});

const emit = defineEmits<{ github: []; dismiss: [] }>();

const confirming = ref(false);

function confirmDismiss(): void {
  confirming.value = false;

  emit("dismiss");
}
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-2"
    role="group"
    :aria-label="`Issue actions for ${label}`"
  >
    <a
      v-if="issue?.status === 'github_created' && issue.github_issue_url"
      :href="issue.github_issue_url"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-2.5 text-sm text-success"
    >
      <CircleDot :size="14" aria-hidden="true" />
      GitHub issue #{{ issue.github_issue_number }}
      <ExternalLink :size="12" aria-hidden="true" />
    </a>

    <Button v-else :disabled="pending || disabled" @click="emit('github')">
      <CircleDot :size="14" aria-hidden="true" />
      {{ pending ? "Working…" : "Create an issue on GitHub" }}
    </Button>

    <template v-if="confirming">
      <Button
        variant="danger"
        :disabled="pending || disabled"
        @click="confirmDismiss"
      >
        Confirm: never report again
      </Button>

      <Button variant="ghost" @click="confirming = false">Cancel</Button>
    </template>

    <Button
      v-else
      variant="ghost"
      :disabled="pending || disabled"
      @click="confirming = true"
    >
      <ShieldCheck :size="14" aria-hidden="true" />
      Mark as clean
    </Button>

    <Paragraph v-if="error" class="w-full text-danger" role="alert">
      {{ error }}
    </Paragraph>
  </div>
</template>
