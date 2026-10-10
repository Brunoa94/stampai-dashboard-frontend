import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { useAnalytics } from "@/features/analyticsDashboard/lib/composables/useAnalytics";
import { analyticsFixture } from "@/test/fixtures";
import { AppError, ERROR_MESSAGES } from "@/shared/lib/constants/errors";

const generateMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/analyticsDashboard/lib/services/analytics", () => ({
  generateAnalytics: generateMock,
}));

describe("Analytics request workflow", () => {
  it("blocks duplicate submissions, retains results and retries explicitly", async () => {
    const fixture = analyticsFixture();

    let resolve: (value: (typeof fixture)[]) => void = () => {};

    generateMock.mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );

    let state!: ReturnType<typeof useAnalytics>;

    const Harness = defineComponent({
      setup() {
        state = useAnalytics();

        return () => null;
      },
    });

    const wrapper = mount(Harness, {
      global: {
        plugins: [[VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    const request = {
      start_date: "2026-10-01",
      end_date: "2026-10-01",
      funnels: ["generation" as const],
    };

    const first = state.generate(request);

    await flushPromises();

    await state.generate(request);

    expect(generateMock).toHaveBeenCalledTimes(1);

    resolve([fixture]);

    await first;

    generateMock.mockRejectedValueOnce(new AppError("SERVER"));

    await state.generate({ ...request, end_date: "2026-10-02" });

    expect(state.reports.value[0]?.period.endDate).toBe("2026-10-01");

    expect(state.error.value).toBe(ERROR_MESSAGES.SERVER);

    generateMock.mockResolvedValueOnce([fixture]);

    await state.retry();

    expect(generateMock).toHaveBeenCalledTimes(3);

    expect(generateMock.mock.calls[2]?.[0].end_date).toBe("2026-10-02");

    wrapper.unmount();
  });
});
