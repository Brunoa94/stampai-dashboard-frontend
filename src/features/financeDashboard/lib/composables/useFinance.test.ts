import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { useFinance } from "@/features/financeDashboard/lib/composables/useFinance";
import { financeFixture } from "@/test/fixtures";
import { AppError } from "@/shared/lib/constants/errors";

const service = vi.hoisted(() => ({
  generateFinance: vi.fn(),
  getReport: vi.fn(),
  acknowledgeAlert: vi.fn(),
}));

vi.mock("@/features/financeDashboard/lib/services/finance", () => service);

describe("Finance snapshot workflow", () => {
  it("reuses failed request ID on retry and creates a fresh ID for a new generation", async () => {
    let state!: ReturnType<typeof useFinance>;

    const Harness = defineComponent({
      setup() {
        state = useFinance();

        return () => null;
      },
    });

    const wrapper = mount(Harness, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    const input = {
      start_date: "2026-10-01",
      end_date: "2026-10-01",
      include_ai: false,
    };

    service.generateFinance.mockRejectedValueOnce(new AppError("NETWORK"));

    await state.generate(input);

    const id = service.generateFinance.mock.calls[0]?.[0].request_id;

    service.generateFinance.mockResolvedValue(financeFixture());

    await state.retry();

    expect(service.generateFinance.mock.calls[1]?.[0].request_id).toBe(id);

    await state.generate(input);

    expect(service.generateFinance.mock.calls[2]?.[0].request_id).not.toBe(id);

    wrapper.unmount();
  });

  it("opens history without generating and updates acknowledgement only after success", async () => {
    let state!: ReturnType<typeof useFinance>;

    const Harness = defineComponent({
      setup() {
        state = useFinance();

        return () => null;
      },
    });

    const wrapper = mount(Harness, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    service.getReport.mockResolvedValue({
      report: financeFixture(),
      alertReviews: [],
    });

    await state.open("finance_fixture");

    expect(service.getReport).toHaveBeenCalledWith(
      "finance_fixture",
      expect.any(AbortSignal),
    );

    service.acknowledgeAlert.mockRejectedValueOnce(new AppError("SERVER"));

    await state.acknowledge("alert", true);

    expect(state.reviews.value).toEqual([]);

    service.acknowledgeAlert.mockResolvedValue({ acknowledged: true });

    await state.acknowledge("alert", true);

    expect(state.reviews.value[0]?.acknowledged).toBe(true);

    wrapper.unmount();
  });
});
