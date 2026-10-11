import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import LimitationNote from "@/shared/ui/LimitationNote/LimitationNote.vue";
import InsightsLimitations from "@/shared/ui/Insights/InsightsLimitations.vue";

describe("LimitationNote", () => {
  it("shows a labelled warning icon beside the limitation and its actions", () => {
    const wrapper = mount(LimitationNote, {
      slots: {
        default: () => "Fees are partial.",
        actions: () => h("em", "actions"),
      },
    });

    const icon = wrapper.find('svg[role="img"]');

    expect(icon.exists()).toBe(true);

    expect(icon.attributes("aria-label")).toBe("Warning");

    expect(wrapper.text()).toContain("Fees are partial.");

    expect(wrapper.find("em").text()).toBe("actions");
  });

  it("gives every listed limitation a warning icon", () => {
    const wrapper = mount(InsightsLimitations, {
      props: { limitations: ["First", "Second"] },
    });

    expect(wrapper.findAll('svg[aria-label="Warning"]')).toHaveLength(2);
  });
});
