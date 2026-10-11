import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import IssueActions from "@/shared/ui/IssueActions/IssueActions.vue";
import type { ReportIssueType } from "@/shared/lib/types/reportIssues";

const created: ReportIssueType = {
  id: 1,
  source: "finance",
  scope: "",
  kind: "alert",
  fingerprint: "source:stripe",
  reference: "source:stripe",
  title: "Stripe failed",
  status: "github_created",
  report_id: "finance_report",
  github_issue_number: 42,
  github_issue_url: "https://github.com/acme/repo/issues/42",
  created_at: "2026-10-01T00:00:00Z",
  updated_at: "2026-10-01T00:00:00Z",
};

describe("IssueActions", () => {
  it("emits GitHub creation and requires confirmation before dismissing", async () => {
    const wrapper = mount(IssueActions, { props: { label: "source:stripe" } });

    await wrapper.findAll("button")[0].trigger("click");

    expect(wrapper.emitted("github")).toHaveLength(1);

    await wrapper.findAll("button")[1].trigger("click");

    expect(wrapper.emitted("dismiss")).toBeUndefined();

    expect(wrapper.text()).toContain("Confirm: never report again");

    await wrapper.findAll("button")[1].trigger("click");

    expect(wrapper.emitted("dismiss")).toHaveLength(1);
  });

  it("links to an existing GitHub issue instead of offering creation", () => {
    const wrapper = mount(IssueActions, {
      props: { label: "source:stripe", issue: created },
    });

    const link = wrapper.find("a");

    expect(link.attributes("href")).toBe(created.github_issue_url);

    expect(link.attributes("rel")).toContain("noopener");

    expect(link.text()).toContain("#42");

    expect(wrapper.text()).not.toContain("Create an issue on GitHub");
  });

  it("disables actions while pending and shows errors", () => {
    const wrapper = mount(IssueActions, {
      props: { label: "x", pending: true, error: "Unable to complete request" },
    });

    expect(
      wrapper
        .findAll("button")
        .every((b) => b.attributes("disabled") !== undefined),
    ).toBe(true);

    expect(wrapper.find('[role="alert"]').text()).toBe(
      "Unable to complete request",
    );
  });
});
