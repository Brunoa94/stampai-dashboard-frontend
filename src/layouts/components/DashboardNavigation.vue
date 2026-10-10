<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ChartNoAxesCombined, Wallet } from "@lucide/vue";
import Button from "@/shared/ui/Button/Button.vue";
import Span from "@/shared/ui/Span/Span.vue";

interface PropsI {
  collapsed: boolean;
}

defineProps<PropsI>();

const route = useRoute();

const router = useRouter();
</script>

<template>
  <div>
    <Span v-if="!collapsed" variant="label" class="mb-3 hidden px-3 md:block">
      Workspace
    </Span>

    <nav aria-label="Dashboard pages" class="grid gap-2">
      <Button
        :variant="route.path === '/analytics' ? 'active' : 'ghost'"
        aria-label="Analytics dashboard"
        title="Analytics dashboard"
        :class="['justify-start', collapsed && 'px-3']"
        @click="router.push('/analytics')"
      >
        <ChartNoAxesCombined :size="19" class="shrink-0" aria-hidden="true" />

        <Span v-if="!collapsed" class="hidden md:inline">Analytics</Span>
      </Button>

      <Button
        :variant="route.path === '/finance' ? 'active' : 'ghost'"
        aria-label="Finance dashboard"
        title="Finance dashboard"
        :class="['justify-start', collapsed && 'px-3']"
        @click="router.push('/finance')"
      >
        <Wallet :size="19" class="shrink-0" aria-hidden="true" />

        <Span v-if="!collapsed" class="hidden md:inline">Finance</Span>
      </Button>
    </nav>
  </div>
</template>
