import { createRouter, createWebHashHistory } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import LoginView from "@/views/LoginView.vue";
import AnalyticsView from "@/views/AnalyticsView.vue";
import FinanceView from "@/views/FinanceView.vue";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/login", component: LoginView },
    {
      path: "/",
      component: DashboardLayout,
      children: [
        { path: "", redirect: "/analytics" },
        { path: "analytics", component: AnalyticsView },
        { path: "finance", component: FinanceView },
      ],
    },
  ],
});
