import type { Plugin } from "vite";

export type AdminAuthConfigType = {
  email: string;
  password: string;
};

export function adminAuthPlugin(config: AdminAuthConfigType): Plugin {
  return {
    name: "local-admin-auth",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(
        "/__dashboard/admin-token",
        async (request, response) => {
          const origin = request.headers.origin;

          const host = request.headers.host;

          response.setHeader("Cache-Control", "no-store");

          response.setHeader("Content-Type", "application/json");

          if (
            request.method !== "POST" ||
            request.headers["x-dashboard-auth"] !== "1" ||
            !host ||
            !/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host) ||
            (origin && origin !== `http://${host}`)
          ) {
            response.statusCode = 403;

            response.end(JSON.stringify({ error: "AUTH" }));

            return;
          }

          if (!config.email || !config.password) {
            response.statusCode = 503;

            response.end(JSON.stringify({ error: "CONFIG" }));

            return;
          }

          try {
            const upstream = await fetch(
              "http://localhost:3002/api/auth/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  email: config.email,
                  password: config.password,
                }),
                signal: AbortSignal.timeout(15_000),
              },
            );

            if (!upstream.ok) {
              response.statusCode =
                upstream.status === 401 || upstream.status === 403 ? 401 : 502;

              response.end(JSON.stringify({ error: "AUTH" }));

              return;
            }

            const data: unknown = await upstream.json();

            const token = readToken(data);

            if (!token) {
              response.statusCode = 502;

              response.end(JSON.stringify({ error: "RESPONSE" }));

              return;
            }

            response.end(JSON.stringify({ token }));
          } catch {
            response.statusCode = 502;

            response.end(JSON.stringify({ error: "NETWORK" }));
          }
        },
      );
    },
  };
}

function readToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;

  const value = record.token;

  return typeof value === "string" &&
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
    ? value
    : null;
}
