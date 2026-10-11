import { describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { useReportIssues } from "@/shared/lib/composables/useReportIssues";
import { useConnectionStore } from "@/shared/lib/stores/connection";
import { AppError } from "@/shared/lib/constants/errors";
import { issueFingerprint } from "@/shared/lib/helpers/reportIssues";
import type {
  ReportIssueInputType,
  ReportIssueType,
} from "@/shared/lib/types/reportIssues";

const service = vi.hoisted(() => ({
  listReportIssues: vi.fn(),
  createGithubIssue: vi.fn(),
  dismissReportIssue: vi.fn(),
}));

vi.mock("@/shared/lib/services/reportIssues", () => service);

const finding: ReportIssueInputType = {
  source: "analytics",
  scope: "ecommerce",
  kind: "finding",
  reference: "Checkout  Drop",
  title: "Checkout Drop",
  description: "Fewer checkouts",
};

const stored = (status: ReportIssueType["status"]): ReportIssueType => ({
  id: 1,
  source: "analytics",
  scope: "ecommerce",
  kind: "finding",
  fingerprint: "checkout drop",
  reference: "Checkout Drop",
  title: "Checkout Drop",
  status,
  report_id: null,
  github_issue_number: status === "github_created" ? 9 : null,
  github_issue_url:
    status === "github_created" ? "https://github.com/a/b/issues/9" : null,
  created_at: "2026-10-01T00:00:00Z",
  updated_at: "2026-10-01T00:00:00Z",
});

function setup() {
  const pinia = createPinia();

  setActivePinia(pinia);

  const connection = useConnectionStore();

  connection.origin = "https://api.example.com";

  connection.token = "token";

  let state!: ReturnType<typeof useReportIssues>;

  const wrapper = mount(
    defineComponent({
      setup() {
        state = useReportIssues("analytics");

        return () => null;
      },
    }),
    {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    },
  );

  return { wrapper, state: () => state };
}

describe("Report issue triage", () => {
  it("normalizes finding titles like the API and keeps alert ids exact", () => {
    expect(issueFingerprint("finding", "  Checkout \n DROP ")).toBe(
      "checkout drop",
    );

    expect(issueFingerprint("alert", " refund:stripe:ch_A ")).toBe(
      "refund:stripe:ch_A",
    );
  });

  it("matches stored issues and hides dismissed ones after a successful dismissal", async () => {
    service.listReportIssues.mockResolvedValue([]);

    service.dismissReportIssue.mockResolvedValue(stored("dismissed"));

    const { wrapper, state } = setup();

    await flushPromises();

    expect(state().isDismissed(finding)).toBe(false);

    await state().dismiss(finding);

    expect(state().isDismissed(finding)).toBe(true);

    wrapper.unmount();
  });

  it("records the created GitHub issue and scopes errors to the failed issue", async () => {
    service.listReportIssues.mockResolvedValue([]);

    service.createGithubIssue.mockRejectedValueOnce(new AppError("SERVER"));

    const { wrapper, state } = setup();

    await flushPromises();

    await state().createIssue(finding);

    expect(state().errorFor(finding)).not.toBe("");

    expect(state().errorFor({ ...finding, reference: "Other" })).toBe("");

    expect(state().find(finding)).toBeUndefined();

    service.createGithubIssue.mockResolvedValueOnce(stored("github_created"));

    await state().createIssue(finding);

    expect(state().errorFor(finding)).toBe("");

    expect(state().find(finding)?.github_issue_number).toBe(9);

    wrapper.unmount();
  });
});
