import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DataTable from "./DataTable.vue";

describe("Data table contract", () => {
  it("filters and sorts locally and preserves null cells", async () => {
    const wrapper = mount(DataTable, {
      props: {
        title: "Test table",
        columns: [
          { key: "id", label: "ID" },
          { key: "amount", label: "Amount" },
        ],
        rows: [
          { key: "b", cells: { id: "Beta", amount: null } },
          { key: "a", cells: { id: "Alpha", amount: 0 } },
        ],
        selectable: true,
      },
    });

    expect(wrapper.text()).toContain("Unavailable");

    await wrapper.get("input").setValue("Alpha");

    expect(wrapper.findAll("tbody tr")).toHaveLength(1);

    expect(wrapper.find("tbody").text()).toContain("0");

    await wrapper.find("tbody button").trigger("click");

    expect(wrapper.emitted("select")?.[0]).toEqual(["a"]);

    wrapper.unmount();
  });
});

it("distinguishes empty data from an unmatched search and offers recovery", async () => {
  const wrapper = mount(DataTable, {
    props: {
      title: "Empty states",
      columns: [{ key: "name", label: "Name" }],
      rows: [],
    },
  });

  expect(wrapper.text()).toContain("No reported records");

  expect(wrapper.get("button").attributes("disabled")).toBeDefined();

  await wrapper.setProps({
    rows: [{ key: "one", cells: { name: "Returned record" } }],
  });

  await wrapper.get("input").setValue("missing");

  expect(wrapper.text()).toContain("No matching records");

  await wrapper
    .findAll("button")
    .find((button) => button.text() === "Clear search")!
    .trigger("click");

  expect(wrapper.find("tbody").text()).toContain("Returned record");

  wrapper.unmount();
});
