import { canUseLocalAdminAuth } from "@/shared/lib/constants/localAuth";
import { computed, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  listReports,
  listSchedules,
  listNotifications,
} from "@/features/financeDashboard/lib/services/finance";
import { useConnectionStore } from "@/shared/lib/stores/connection";

export function useReportList(offset: Ref<number>) {
  const connection = useConnectionStore();

  return useQuery({
    queryKey: computed(() => [
      "finance",
      "reports",
      connection.origin,
      connection.revision,
      offset.value,
    ]),
    queryFn: ({ signal }) => listReports(offset.value, signal),
    enabled: computed(
      () =>
        !!connection.origin &&
        (!!connection.token || canUseLocalAdminAuth(connection.origin)),
    ),
  });
}

export function useScheduleList() {
  const connection = useConnectionStore();

  return useQuery({
    queryKey: computed(() => [
      "finance",
      "schedules",
      connection.origin,
      connection.revision,
    ]),
    queryFn: ({ signal }) => listSchedules(signal),
    enabled: computed(
      () =>
        !!connection.origin &&
        (!!connection.token || canUseLocalAdminAuth(connection.origin)),
    ),
  });
}

export function useNotificationList(offset: Ref<number>, unread: Ref<boolean>) {
  const connection = useConnectionStore();

  return useQuery({
    queryKey: computed(() => [
      "finance",
      "notifications",
      connection.origin,
      connection.revision,
      offset.value,
      unread.value,
    ]),
    queryFn: ({ signal }) =>
      listNotifications(offset.value, unread.value, signal),
    enabled: computed(
      () =>
        !!connection.origin &&
        (!!connection.token || canUseLocalAdminAuth(connection.origin)),
    ),
  });
}
