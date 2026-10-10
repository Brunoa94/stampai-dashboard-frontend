import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { ViteDevServer } from "vite";
import { adminAuthPlugin } from "./adminAuth";

type HandlerType = (
  request: IncomingMessage,
  response: ServerResponse,
) => Promise<void>;

let handler: HandlerType;

beforeEach(() => {
  const plugin = adminAuthPlugin({
    email: "admin@example.test",
    password: "server-only-password",
  });

  const configure = plugin.configureServer as
    ((server: ViteDevServer) => unknown) | undefined;

  if (typeof configure !== "function") throw new Error("Expected server hook");

  configure({
    middlewares: {
      use: (_path: string, callback: HandlerType) => {
        handler = callback;
      },
    },
  } as unknown as ViteDevServer);
});

afterEach(() => vi.unstubAllGlobals());

async function invoke(headers: Record<string, string>, method = "POST") {
  let body = "";

  const response = {
    statusCode: 200,
    setHeader: vi.fn(),
    end: (value: string) => {
      body = value;
    },
  };

  await handler(
    { method, headers } as IncomingMessage,
    response as unknown as ServerResponse,
  );

  return { response, data: JSON.parse(body) };
}

const headers = {
  host: "localhost:5173",
  origin: "http://localhost:5173",
  "x-dashboard-auth": "1",
};

describe("Server-only admin exchange", () => {
  it("sends server credentials to the specified endpoint and exposes only the JWT", async () => {
    const mock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: "header.payload.signature",
        user: { password: "hidden" },
      }),
    });

    vi.stubGlobal("fetch", mock);

    const { response, data } = await invoke(headers);

    expect(mock).toHaveBeenCalledWith(
      "http://localhost:3002/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "admin@example.test",
          password: "server-only-password",
        }),
      }),
    );

    expect(data).toEqual({ token: "header.payload.signature" });

    expect(response.setHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "no-store",
    );
  });

  it("rejects cross-origin and remote-host access before sending credentials", async () => {
    const mock = vi.fn();

    vi.stubGlobal("fetch", mock);

    expect(
      (await invoke({ ...headers, origin: "https://other.test" })).response
        .statusCode,
    ).toBe(403);

    expect(
      (await invoke({ ...headers, host: "dashboard.example.com" })).response
        .statusCode,
    ).toBe(403);

    expect((await invoke(headers, "GET")).response.statusCode).toBe(403);

    expect(mock).not.toHaveBeenCalled();
  });

  it("maps rejected login and invalid token responses without exposing upstream errors", async () => {
    const mock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 401 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "invalid" }),
      });

    vi.stubGlobal("fetch", mock);

    expect((await invoke(headers)).data).toEqual({ error: "AUTH" });

    expect((await invoke(headers)).data).toEqual({ error: "RESPONSE" });
  });
});
