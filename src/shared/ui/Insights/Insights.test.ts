import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import Insights from "@/shared/ui/Insights/Insights.vue";

const props = {
  overview: "Review overview",
  findings: [
    {
      title: "Finding",
      description: "<strong>Plain text</strong>",
      severity: "critical",
      evidence: ["finding-evidence"],
    },
  ],
  recommendations: [
    {
      title: "Recommendation",
      description: "Recommended action",
      priority: "high",
      category: "technical",
      evidence: ["recommendation-evidence"],
    },
  ],
  limitations: ["Limited evidence"],
};

describe("Insights composition", () => {
  it("preserves default evidence, plain text, and empty states when props change", async () => {
    const wrapper = mount(Insights, { props });

    expect(wrapper.findAll("details")).toHaveLength(2);

    expect(wrapper.text()).toContain("finding-evidence");

    expect(wrapper.text()).toContain("recommendation-evidence");

    expect(wrapper.text()).toContain("<strong>Plain text</strong>");

    expect(wrapper.find("strong").exists()).toBe(false);

    expect(wrapper.text()).toContain("Limited evidence");

    await wrapper.setProps({ findings: [], recommendations: [] });

    expect(wrapper.text()).toContain("No findings returned.");

    expect(wrapper.text()).toContain("No recommendations returned.");

    expect(wrapper.findAll("details")).toHaveLength(0);
  });

  it("forwards the evidence slot for both groups without rendering the fallback", () => {
    const wrapper = mount(Insights, {
      props,
      slots: {
        evidence: ({ items }: { items: string[] }) =>
          h("a", { href: `#${items[0]}` }, "Open evidence"),
      },
    });

    expect(
      wrapper.findAll("details a").map((link) => link.attributes("href")),
    ).toEqual(["#finding-evidence", "#recommendation-evidence"]);

    expect(wrapper.findAll("details p")).toHaveLength(0);
  });

  it("renders issue actions for findings and every limitation when slots are provided", () => {
    const wrapper = mount(Insights, {
      props,
      slots: {
        evidence: () => h("span", "evidence"),
        actions: ({ item, kind }: { item: { title: string }; kind: string }) =>
          h("em", `${kind}:${item.title}`),
        limitationActions: ({ note }: { note: string }) =>
          h("strong", `limitation:${note}`),
      },
    });

    expect(wrapper.findAll("em").map((node) => node.text())).toEqual([
      "finding:Finding",
      "recommendation:Recommendation",
    ]);

    expect(wrapper.findAll("strong").map((node) => node.text())).toEqual([
      "limitation:Limited evidence",
    ]);
  });
});
