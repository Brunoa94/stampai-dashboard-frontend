<script setup lang="ts">
import { computed, ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { RouterView, useRoute, useRouter } from "vue-router";
import DashboardSidebar from "./components/DashboardSidebar.vue";
import DashboardHeader from "./components/DashboardHeader.vue";
import DashboardFooter from "./components/DashboardFooter.vue";
import ConnectionSettings from "@/shared/ui/ConnectionSettings/ConnectionSettings.vue";
import { useConnectionStore } from "@/shared/lib/stores/connection";

const queryClient = useQueryClient();

const settings = ref(false);

const route = useRoute();

const router = useRouter();

const connection = useConnectionStore();

const pageTitle = computed(() =>
  route.path === "/finance" ? "Finance" : "Analytics",
);

function openLoginPreview(): void {
  void router.push("/login");
}

function logout(): void {
  connection.clearSession();

  queryClient.clear();

  openLoginPreview();
}
</script>

<template>
  <div class="flex min-h-screen">
    <DashboardSidebar
      @toggle-settings="settings = !settings"
      @logout="logout"
    />

    <div class="min-w-0 flex-1">
      <DashboardHeader
        :page-title="pageTitle"
        :api-configured="Boolean(connection.origin)"
        @login-preview="openLoginPreview"
      />

      <main
        id="main-content"
        class="mx-auto max-w-[1600px] space-y-8 p-5 lg:p-8"
      >
        <ConnectionSettings v-if="settings" @close="settings = false" />

        <RouterView />
      </main>

      <DashboardFooter />
    </div>
  </div>
</template>
