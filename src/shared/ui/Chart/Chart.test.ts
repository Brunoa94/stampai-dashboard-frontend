import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Chart from "@/shared/ui/Chart/Chart.vue";

beforeEach(() => localStorage.clear());

describe("Chart empty states", () => {
  it("distinguishes missing days, missing series, and unavailable values from zero", async () => {
    const wrapper = mount(Chart, {
      props: { title: "Empty chart", dates: [], series: [] },
    });

    expect(wrapper.text()).toContain("No reported days");

    expect(wrapper.find("[role=img]").exists()).toBe(false);

    await wrapper.setProps({ dates: ["2026-10-01"] });

    expect(wrapper.text()).toContain("No series returned");

    await wrapper.setProps({
      series: [
        { id: "count", label: "Events", unit: "events", values: [null] },
      ],
    });

    expect(wrapper.text()).toContain("No available values");

    await wrapper.setProps({
      series: [{ id: "count", label: "Events", unit: "events", values: [0] }],
    });

    expect(wrapper.find("[role=img]").exists()).toBe(true);

    expect(wrapper.text()).not.toContain("No available values");

    wrapper.unmount();
  });

  it("lets users restore all hidden series", async () => {
    const wrapper = mount(Chart, {
      props: {
        title: "Hidden chart",
        dates: ["2026-10-01"],
        series: [{ id: "count", label: "Events", unit: "events", values: [0] }],
      },
    });

    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Events")!
      .trigger("click");

    expect(wrapper.text()).toContain("All series are hidden");

    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Show all series")!
      .trigger("click");

    expect(wrapper.find("[role=img]").exists()).toBe(true);

    wrapper.unmount();
  });
});
