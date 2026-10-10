import { computed } from "vue";
import { useConnectionStore } from "@/shared/lib/stores/connection";
import { canUseLocalAdminAuth } from "@/shared/lib/constants/localAuth";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";

export function useApiConnectionStatus(authenticationRequired: () => boolean) {
  const connection = useConnectionStore();

  const message = computed(() => {
    if (!connection.origin) return ERROR_MESSAGES.CONFIG;

    if (
      authenticationRequired() &&
      !connection.token &&
      !canUseLocalAdminAuth(connection.origin)
    )
      return ERROR_MESSAGES.AUTH_CONFIG;

    return "";
  });

  return { message };
}
