import { describe, expect, it } from "vitest";
import { isLocalAdminApiOrigin } from "@/shared/lib/helpers/localAuth";

describe("Local admin API origins", () => {
  it.each([
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3002/",
    "http://[::1]:3002",
  ])("allows loopback origin %s", (origin) => {
    expect(isLocalAdminApiOrigin(origin)).toBe(true);
  });

  it.each([
    "https://api.example.com",
    "http://localhost:3003",
    "http://localhost:3002/api",
    "http://user:password@localhost:3002",
    "http://localhost:3002?redirect=example",
    "http://localhost:3002#hash",
    "http://localhost.example.com:3002",
    "invalid",
  ])("rejects unrelated or invalid origin %s", (origin) => {
    expect(isLocalAdminApiOrigin(origin)).toBe(false);
  });
});
