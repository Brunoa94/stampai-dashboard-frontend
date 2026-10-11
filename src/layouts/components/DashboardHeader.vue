<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";
import Button from "@/shared/ui/Button/Button.vue";
import Span from "@/shared/ui/Span/Span.vue";
import ThemeSelect from "@/shared/ui/ThemeSelect/ThemeSelect.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";

interface PropsI {
  pageTitle: string;
  apiConfigured: boolean;
}

defineProps<PropsI>();

const emit = defineEmits<{ loginPreview: [] }>();
</script>

<template>
  <header
    class="dashboard-bar sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border px-5 lg:px-8"
  >
    <div class="flex min-w-0 items-center gap-2">
      <div class="hidden items-center gap-2 sm:flex">
        <Span variant="muted">Workspace</Span>

        <Span variant="muted">/</Span>
      </div>

      <Span class="truncate">{{ pageTitle }}</Span>
    </div>

    <div class="flex items-center gap-3">
      <ThemeSelect />

      <div class="hidden md:block">
        <Chip :variant="apiConfigured ? 'success' : 'neutral'">
          <div
            :class="[
              'size-1.5 rounded-full',
              apiConfigured ? 'bg-success' : 'bg-muted',
            ]"
          />
          {{ apiConfigured ? "API configured" : "API not configured" }}
        </Chip>
      </div>

      <div class="hidden sm:block">
        <Button variant="ghost" @click="emit('loginPreview')">
          Login preview
          <ArrowUpRight :size="14" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </header>
</template>
