<script setup lang="ts">
import { CircleCheck, CircleAlert, CircleMinus } from "@lucide/vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
import type { CoverageType } from "@/features/financeDashboard/lib/types/finance";
import { numberLabel } from "@/shared/lib/helpers/format";

interface PropsI {
  source: CoverageType;
}

defineProps<PropsI>();
</script>

<template>
  <div
    class="rounded-xl border p-5"
    :class="
      source.status === 'failed'
        ? 'border-danger/25 bg-danger/5'
        : 'border-border bg-elevated/30'
    "
  >
    <div class="mb-5 flex items-center justify-between gap-2">
      <Heading as="h3" variant="card" class="capitalize">
        {{ source.source }}
      </Heading>

      <CircleCheck
        v-if="source.status === 'complete'"
        class="size-5 text-success"
        aria-label="Complete"
      />

      <CircleAlert
        v-else-if="source.status === 'failed'"
        class="size-5 text-danger"
        aria-label="Failed"
      />

      <CircleMinus
        v-else
        class="size-5 text-muted"
        aria-label="Not requested"
      />
    </div>

    <template v-if="source.status === 'complete'">
      <Span variant="value">{{ numberLabel(source.recordCount) }}</Span>

      <Paragraph class="mt-1">
        {{
          source.recordCount === null
            ? "Record count unavailable"
            : source.recordCount === 1
              ? "reported record"
              : "reported records"
        }}
      </Paragraph>
    </template>

    <template v-else>
      <Heading
        as="h4"
        variant="card"
        :class="source.status === 'failed' ? 'text-danger' : 'text-muted'"
      >
        {{ source.status === "failed" ? "Unavailable" : "Not requested" }}
      </Heading>

      <Paragraph class="mt-2">
        {{
          source.status === "failed"
            ? "Related totals may be incomplete."
            : "Excluded from this snapshot."
        }}
      </Paragraph>
    </template>

    <div class="mt-5 border-t border-border pt-3">
      <Chip
        :variant="
          source.status === 'complete'
            ? 'success'
            : source.status === 'failed'
              ? 'danger'
              : 'neutral'
        "
      >
        {{
          source.status === "complete"
            ? "Complete"
            : source.status === "failed"
              ? "Retrieval failed"
              : "Not requested"
        }}
      </Chip>
    </div>
  </div>
</template>
