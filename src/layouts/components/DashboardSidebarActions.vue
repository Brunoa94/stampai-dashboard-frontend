<script setup lang="ts">
import { PanelLeftClose, PanelLeftOpen, LogOut, Settings2 } from "@lucide/vue";
import Button from "@/shared/ui/Button/Button.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";

const collapsed = defineModel<boolean>("collapsed", { required: true });

const emit = defineEmits<{ toggleSettings: []; logout: [] }>();
</script>

<template>
  <div class="mt-auto grid gap-3">
    <div
      v-if="!collapsed"
      class="mb-5 hidden rounded-xl border border-border bg-elevated/40 p-4 md:block"
    >
      <Chip variant="gold">Development preview</Chip>

      <Paragraph class="mt-3 text-xs">
        Connect your API to generate real reports. Authentication will be added
        later.
      </Paragraph>
    </div>

    <Button
      variant="ghost"
      class="justify-start"
      aria-label="Connection settings"
      title="Connection settings"
      @click="emit('toggleSettings')"
    >
      <Settings2 :size="18" class="shrink-0" aria-hidden="true" />

      <Span v-if="!collapsed" class="hidden md:inline">Connection</Span>
    </Button>

    <Button
      variant="ghost"
      class="justify-start"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      :aria-expanded="!collapsed"
      :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="collapsed = !collapsed"
    >
      <component
        :is="collapsed ? PanelLeftOpen : PanelLeftClose"
        :size="18"
        class="shrink-0"
        aria-hidden="true"
      />

      <Span v-if="!collapsed" class="hidden md:inline">Collapse sidebar</Span>
    </Button>

    <Button
      variant="ghost"
      class="justify-start border-t border-border pt-4"
      aria-label="Logout and open login preview"
      title="Logout"
      @click="emit('logout')"
    >
      <LogOut :size="18" class="shrink-0" aria-hidden="true" />

      <Span v-if="!collapsed" class="hidden md:inline">Logout</Span>
    </Button>
  </div>
</template>
