import { ref, watch } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useNotificationList } from "@/features/financeDashboard/lib/queries/finance";
import { readNotification } from "@/features/financeDashboard/lib/services/finance";
import { errorMessage } from "@/shared/lib/constants/errors";

export function useNotifications() {
  const offset = ref(0);

  const unread = ref(false);

  const saveError = ref("");

  const { data, isFetching, error, refetch } = useNotificationList(
    offset,
    unread,
  );

  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, read }: { id: string | number; read: boolean }) =>
      readNotification(id, read),
  });

  watch(unread, () => (offset.value = 0));

  async function toggle(id: string | number, read: boolean): Promise<void> {
    if (mutation.isPending.value) return;

    saveError.value = "";

    try {
      await mutation.mutateAsync({ id, read });

      await client.invalidateQueries({
        queryKey: ["finance", "notifications"],
      });
    } catch (caught) {
      saveError.value = errorMessage(caught);
    }
  }

  return {
    offset,
    unread,
    saveError,
    data,
    isFetching,
    error,
    refetch,
    mutation,
    toggle,
  };
}
