import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { useThemeStore } from "./shared/lib/stores/theme";
import App from "./App.vue";
import { router } from "./router";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./styles/main.css";

const pinia = createPinia();

useThemeStore(pinia);

createApp(App)
  .use(pinia)
  .use(router)
  .use(VueQueryPlugin, {
    queryClient: new QueryClient({
      defaultOptions: {
        queries: { retry: false, refetchOnWindowFocus: false },
        mutations: { retry: false },
      },
    }),
  })
  .mount("#app");
