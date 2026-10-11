import { computed, ref } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { canUseLocalAdminAuth } from "@/shared/lib/constants/localAuth";
import { errorMessage } from "@/shared/lib/constants/errors";
import { logError } from "@/shared/lib/helpers/logger";
import { useConnectionStore } from "@/shared/lib/stores/connection";
import {
  createGithubIssue,
  dismissReportIssue,
  listReportIssues,
} from "@/shared/lib/services/reportIssues";
import { issueKey, storedIssueKey } from "@/shared/lib/helpers/reportIssues";
import type {
  ReportIssueInputType,
  ReportIssueSourceType,
  ReportIssueTargetType,
  ReportIssueType,
} from "@/shared/lib/types/reportIssues";

export function useReportIssues(source: ReportIssueSourceType) {
  const connection = useConnectionStore();

  const client = useQueryClient();

  const queryKey = computed(() => [
    "report-issues",
    connection.origin,
    connection.revision,
    source,
  ]);

  const { data } = useQuery({
    queryKey,
    queryFn: ({ signal }) => listReportIssues(source, signal),
    enabled: computed(
      () =>
        !!connection.origin &&
        (!!connection.token || canUseLocalAdminAuth(connection.origin)),
    ),
  });

  const pendingKey = ref("");

  const failedKey = ref("");

  const error = ref("");

  const byKey = computed(
    () =>
      new Map(
        (data.value ?? []).map((issue) => [storedIssueKey(issue), issue]),
      ),
  );

  function find(target: ReportIssueTargetType): ReportIssueType | undefined {
    return byKey.value.get(issueKey(target));
  }

  function isDismissed(target: ReportIssueTargetType): boolean {
    return find(target)?.status === "dismissed";
  }

  function remember(saved: ReportIssueType): void {
    client.setQueryData<ReportIssueType[]>(queryKey.value, (current = []) => [
      saved,
      ...current.filter(
        (issue) => storedIssueKey(issue) !== storedIssueKey(saved),
      ),
    ]);
  }

  async function run(
    input: ReportIssueInputType,
    action: (body: ReportIssueInputType) => Promise<ReportIssueType>,
  ): Promise<void> {
    if (pendingKey.value) return;

    const key = issueKey(input);

    pendingKey.value = key;

    failedKey.value = "";

    error.value = "";

    try {
      remember(await action(input));
    } catch (caught) {
      failedKey.value = key;

      error.value = errorMessage(caught);

      logError("report issue action", caught);
    } finally {
      pendingKey.value = "";
    }
  }

  function createIssue(input: ReportIssueInputType): Promise<void> {
    return run(input, createGithubIssue);
  }

  function dismiss(input: ReportIssueInputType): Promise<void> {
    return run(input, dismissReportIssue);
  }

  function errorFor(target: ReportIssueTargetType): string {
    return failedKey.value === issueKey(target) ? error.value : "";
  }

  function isPending(target: ReportIssueTargetType): boolean {
    return pendingKey.value === issueKey(target);
  }

  return {
    pendingKey,
    find,
    isDismissed,
    isPending,
    errorFor,
    createIssue,
    dismiss,
  };
}
