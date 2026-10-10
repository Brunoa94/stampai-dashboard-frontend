import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { apiRequest } from "@/shared/lib/services/api";
import { useConnectionStore } from "@/shared/lib/stores/connection";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";

const auth = vi.hoisted(() => ({ enabled: vi.fn(), token: vi.fn() }));

vi.mock("@/shared/lib/constants/localAuth", () => ({
  canUseLocalAdminAuth: auth.enabled,
}));

vi.mock("@/shared/lib/services/adminToken", () => ({
  getAdminToken: auth.token,
}));

beforeEach(() => {
  setActivePinia(createPinia());

  auth.enabled.mockReset().mockReturnValue(false);

  auth.token.mockReset();
});

afterEach(() => vi.unstubAllGlobals());

describe("Shared API boundary", () => {
  it("sends bearer JWT and exact JSON fields to configured origin", async () => {
    const connection = useConnectionStore();

    connection.origin = "https://example.com";

    connection.token = "jwt";

    const mock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });

    vi.stubGlobal("fetch", mock);

    await apiRequest("/api/review", {
      method: "POST",
      body: { start_date: "2026-10-01" },
    });

    expect(mock).toHaveBeenCalledWith(
      "https://example.com/api/review",
      expect.objectContaining({
        method: "POST",
        body: '{"start_date":"2026-10-01"}',
        headers: expect.objectContaining({ Authorization: "Bearer jwt" }),
      }),
    );
  });

  it("normalizes non-JSON errors without disclosing backend diagnostics", async () => {
    useConnectionStore().origin = "https://example.com";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => "<secret>",
      }),
    );

    await expect(apiRequest("/api")).rejects.toThrow(ERROR_MESSAGES.AUTH);
  });

  it("does not send a request without an origin", async () => {
    useConnectionStore().origin = "";

    const mock = vi.fn();

    vi.stubGlobal("fetch", mock);

    await expect(apiRequest("/api")).rejects.toThrow(ERROR_MESSAGES.CONFIG);

    expect(mock).not.toHaveBeenCalled();
  });
});

describe("Local admin JWT integration", () => {
  it("obtains a token before requests and reuses it without browser credentials", async () => {
    const connection = useConnectionStore();

    connection.origin = "http://localhost:3002";

    auth.enabled.mockReturnValue(true);

    auth.token.mockResolvedValue("header.payload.signature");

    const mock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });

    vi.stubGlobal("fetch", mock);

    await apiRequest("/api/finance-agent/reports");

    await apiRequest("/api/finance-agent/schedules");

    expect(auth.token).toHaveBeenCalledTimes(1);

    expect(connection.token).toBe("header.payload.signature");

    expect(
      mock.mock.calls.every(
        ([, options]) =>
          options.headers.Authorization === "Bearer header.payload.signature",
      ),
    ).toBe(true);
  });

  it("does not call protected endpoints when token exchange fails", async () => {
    useConnectionStore().origin = "http://localhost:3002";

    auth.enabled.mockReturnValue(true);

    auth.token.mockRejectedValue(new Error("Login unavailable"));

    const mock = vi.fn();

    vi.stubGlobal("fetch", mock);

    await expect(apiRequest("/api/finance-agent/reports")).rejects.toThrow(
      "Login unavailable",
    );

    expect(mock).not.toHaveBeenCalled();
  });

  it("does not restore a token after logout during its exchange", async () => {
    const connection = useConnectionStore();

    connection.origin = "http://localhost:3002";

    auth.enabled.mockReturnValue(true);

    let resolve!: (token: string) => void;

    auth.token.mockReturnValue(
      new Promise<string>((done) => {
        resolve = done;
      }),
    );

    const request = apiRequest("/api/finance-agent/reports");

    connection.clearSession();

    resolve("header.payload.signature");

    await expect(request).rejects.toThrow(ERROR_MESSAGES.AUTH);

    expect(connection.token).toBe("");
  });
});
