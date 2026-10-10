import { describe, it, expect, vi, afterEach } from "vitest";
import {
  validDate,
  validateDates,
  completeDays,
  calendarLabel,
} from "@/shared/lib/helpers/dates";
import { money, majorMoney } from "@/shared/lib/helpers/format";
import { makeCsv } from "@/shared/lib/helpers/csv";
import { chartPoints } from "@/shared/lib/helpers/chart";
import {
  errorMessage,
  statusError,
  ERROR_MESSAGES,
} from "@/shared/lib/constants/errors";

afterEach(() => vi.useRealTimers());

describe("Date contracts", () => {
  it("rejects rollover and invalid leap dates", () => {
    expect(validDate("2026-02-29")).toBe(false);

    expect(validDate("2024-02-29")).toBe(true);

    expect(validDate("2026-04-31")).toBe(false);
  });

  it("uses inclusive limits and preserves one-day ranges", () => {
    expect(() => validateDates("2026-10-01", "2026-10-31", 31)).not.toThrow();

    expect(() => validateDates("2026-10-01", "2026-11-01", 31)).toThrow();

    expect(() => validateDates("2026-10-02", "2026-10-01", 31)).toThrow();
  });

  it("calculates complete property-local days across timezone boundaries", () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date("2026-10-10T00:30:00Z"));

    expect(completeDays(7, "America/Los_Angeles")).toEqual({
      start: "2026-10-02",
      end: "2026-10-08",
    });

    expect(() => completeDays(7, "")).toThrow();

    expect(() => completeDays(7, "invalid")).toThrow();
  });

  it("normalizes GA dates without timezone shifts", () => {
    expect(calendarLabel("20261007")).toBe("2026-10-07");
  });
});

describe("Currency semantics", () => {
  it("formats zero and three-decimal currencies using their fraction digits", () => {
    expect(money(120, "JPY", 0)).toContain("120");

    expect(money(1234, "KWD", 3)).toContain("1.234");

    expect(money(-25, "USD", 2)).toContain("-$0.25");
  });

  it("keeps unavailable and unknown currency distinct from zero", () => {
    expect(money(null, "USD")).toBe("Unavailable");

    expect(money(0, "USD")).toContain("0.00");

    expect(majorMoney(10, null)).toContain("currency unknown");
  });
});

describe("CSV and charts", () => {
  it("neutralizes formulas, quotes cells, and declares export scope", () => {
    const csv = makeCsv(
      [
        { key: "name", label: "Name" },
        { key: "value", label: "Minor units" },
      ],
      [{ key: "1", cells: { name: ' =HYPERLINK("bad")', value: -20 } }],
      { scope: "Visible filtered table", units: "JPY minor units" },
    );

    expect(csv).toContain("Visible filtered table");

    expect(csv).toContain("' =HYPERLINK");

    expect(csv).toContain('"-20"');

    expect(csv).toContain('""bad""');
  });

  it("does not interpolate unavailable chart values", () => {
    expect(chartPoints([1, null, 3], 0, 3)).toHaveLength(2);

    expect(chartPoints([0, 0], 0, 1)[0]).toContain("230");
  });
});

describe("Centralized errors", () => {
  it("maps statuses without displaying raw messages", () => {
    expect(errorMessage(statusError(401))).toBe(ERROR_MESSAGES.AUTH);

    expect(errorMessage(statusError(409))).toBe(ERROR_MESSAGES.CONFLICT);

    expect(errorMessage(new Error("private secret"))).toBe(
      ERROR_MESSAGES.UNKNOWN,
    );
  });
});
