<script setup lang="ts">
import { ref } from "vue";
import DashboardBrand from "./DashboardBrand.vue";
import DashboardNavigation from "./DashboardNavigation.vue";
import DashboardSidebarActions from "./DashboardSidebarActions.vue";

const collapsed = ref(false);

const emit = defineEmits<{ toggleSettings: []; logout: [] }>();
</script>

<template>
  <aside
    :class="[
      'sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-surface/50 p-3 sm:p-5',
      collapsed ? 'w-20' : 'w-20 md:w-60',
    ]"
  >
    <DashboardBrand :collapsed="collapsed" />

    <DashboardNavigation :collapsed="collapsed" />

    <DashboardSidebarActions
      v-model:collapsed="collapsed"
      @toggle-settings="emit('toggleSettings')"
      @logout="emit('logout')"
    />
  </aside>
</template>
