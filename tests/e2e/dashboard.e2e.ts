import { test, expect, type Page } from "@playwright/test";
import { analyticsFixture, financeFixture } from "../../src/test/fixtures";

async function connect(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Connection settings" }).click();

  await page
    .getByLabel("API origin", { exact: true })
    .fill("https://fixture.test");

  await page.getByLabel("Bearer JWT", { exact: true }).fill("fixture-token");

  await page
    .getByLabel("GA4 property timezone", { exact: true })
    .fill("Europe/Amsterdam");

  await page.getByRole("button", { name: "Apply connection" }).click();
}

test("navigation, collapse, mobile layout, and login UI preview", async ({
  page,
}) => {
  const errors: string[] = [];

  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "See the bigger picture." }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Collapse sidebar", exact: true })
    .click();

  await expect(
    page.getByRole("button", { name: "Expand sidebar", exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Finance dashboard", exact: true })
    .click();

  await expect(
    page.getByRole("heading", { name: "Clarity in every number." }),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await page
    .getByRole("button", { name: "Logout and open login preview" })
    .click();

  await page.getByRole("button", { name: "Login", exact: true }).click();

  await expect(page.getByRole("alert")).toContainText(
    "Complete all required fields.",
  );

  await page.getByLabel("Username", { exact: true }).fill("preview");

  await page.getByLabel("Password", { exact: true }).fill("not-sent");

  await page.getByRole("button", { name: "Login", exact: true }).click();

  await expect(page.getByRole("status")).toContainText("Login UI preview");

  expect(errors).toEqual([]);
});

test("analytics generation, accessible stage graph, local filters, and failure retention", async ({
  page,
}) => {
  const report = analyticsFixture();

  report.dashboard.stages = [
    { id: "generation_start", label: "Start", eventCount: 0, unit: "events" },
    {
      id: "generation_complete",
      label: "Complete",
      eventCount: 200,
      unit: "events",
    },
  ];

  report.dashboard.dailySeries[0]!.eventCounts.generation_complete = 200;

  report.dashboard.breakdowns.failureReasons = [
    { dimensions: { reason: "Unknown" }, eventCount: 0, purchaseRevenue: null },
  ];

  let posts = 0;

  await page.route("https://fixture.test/**", async (route) => {
    posts++;

    if (posts === 1) await route.fulfill({ json: [report] });
    else
      await route.fulfill({ status: 500, json: { error: "internal secret" } });
  });

  await page.goto("/");

  await connect(page);

  await page.getByRole("button", { name: "Ecommerce", exact: true }).click();

  await page.getByLabel("Start date", { exact: true }).fill("2026-10-01");

  await page.getByLabel("End date", { exact: true }).fill("2026-10-01");

  await page
    .getByRole("button", { name: "Generate analysis", exact: true })
    .click();

  await expect(
    page.getByRole("heading", { name: "Aggregate stage activity" }),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 1280, height: 800 });

  await expect(page.locator("aside")).toHaveCount(1);

  await expect(
    page.getByRole("heading", { name: "See the bigger picture." }),
  ).toHaveCount(1);

  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );

  await page.screenshot({
    path: "test-results/analytics-desktop.png",
    fullPage: true,
  });

  await page
    .getByRole("button", { name: "Complete: 200 events. Open daily activity." })
    .focus();

  await page.keyboard.press("Enter");

  await expect(
    page.getByText("Selected stage: generation_complete.", { exact: false }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "generation_complete daily activity" }),
  ).toBeVisible();

  expect(posts).toBe(1);

  await page.getByRole("button", { name: "Overview", exact: true }).click();

  await page
    .getByRole("button", { name: "Table", exact: true })
    .first()
    .click();

  await expect(page.getByRole("table").first()).toBeVisible();

  expect(posts).toBe(1);

  await page
    .getByRole("button", { name: "Generate analysis", exact: true })
    .click();

  await expect(page.getByRole("alert")).not.toContainText("internal secret");

  await expect(
    page.getByText("Displaying saved response:", { exact: false }),
  ).toContainText("2026-10-01");
});

test("finance snapshot, verified invoice edits, alerts, schedules, notifications, and history", async ({
  page,
}) => {
  const report = financeFixture();

  report.dashboard.transactions = [
    {
      id: "tx_1",
      provider: "stripe",
      date: "2026-10-01",
      category: "sale",
      status: "succeeded",
      currency: "JPY",
      amountMinor: 100,
      feeMinor: 0,
      netMinor: 100,
      reference: "raw_1",
      paymentReference: "pay_1",
    },
  ];

  report.dashboard.invoices = [
    {
      id: 1,
      provider: "stripe",
      amountMinor: 100,
      currency: "JPY",
      date: "2026-10-01",
      paymentReference: "pay_1",
      orderReference: null,
      transactionId: "tx_1",
      matchStatus: "matched",
      reason: "Exact reference",
    },
  ];

  report.dashboard.alerts = [
    {
      id: "refund",
      severity: "warning",
      message: "Retrieved outgoing refund activity",
    },
  ];

  let generation = 0;

  const bodies: { url: string; body: Record<string, unknown> }[] = [];

  await page.route("https://fixture.test/**", async (route) => {
    const request = route.request();

    const url = request.url();

    if (request.method() !== "GET")
      bodies.push({
        url,
        body: request.postDataJSON() as Record<string, unknown>,
      });

    if (url.endsWith("/reports") && request.method() === "POST") {
      generation++;

      await route.fulfill({ json: report });
    } else if (url.includes("/alerts/"))
      await route.fulfill({ json: { acknowledged: true } });
    else if (url.includes("/invoices/"))
      await route.fulfill({ json: { id: 1 } });
    else if (url.includes("/reports?"))
      await route.fulfill({
        json: [
          {
            id: report.id,
            created_at: report.generatedAt,
            start_date: report.period.startDate,
            end_date: report.period.endDate,
          },
        ],
      });
    else if (url.endsWith(`/reports/${report.id}`))
      await route.fulfill({ json: { report, alertReviews: [] } });
    else if (url.includes("/notifications?"))
      await route.fulfill({
        json: [
          {
            id: 1,
            report_id: report.id,
            alert_id: "refund",
            message: "Refund alert",
            severity: "warning",
            read: false,
            created_at: report.generatedAt,
          },
        ],
      });
    else if (url.includes("/notifications/"))
      await route.fulfill({ json: { id: 1, read: true } });
    else if (url.endsWith("/schedules"))
      await route.fulfill({
        json:
          request.method() === "GET"
            ? []
            : { id: 1, ...request.postDataJSON() },
      });
    else await route.fulfill({ json: [] });
  });

  await page.goto("/#/finance");

  await connect(page);

  await page.getByLabel("Start date · UTC", { exact: true }).fill("2026-10-01");

  await page.getByLabel("End date · UTC", { exact: true }).fill("2026-10-01");

  await page
    .getByRole("button", { name: "Generate report", exact: true })
    .click();

  await expect(
    page.getByRole("heading", { name: "JPY receipts" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Transactions", exact: true }).click();

  await page.getByRole("button", { name: /Open details/ }).click();

  await expect(page.getByText("Original reference: raw_1")).toBeVisible();

  await page
    .getByRole("button", { name: "Reconciliation", exact: true })
    .click();

  await page.getByRole("button", { name: /Open details/ }).click();

  await page
    .getByRole("button", { name: "Save references", exact: true })
    .click();

  await expect(page.getByRole("status")).toContainText("References saved");

  const edit = bodies.find((body) => body.url.includes("/invoices/"));

  expect(edit?.body).toEqual({
    currency: "JPY",
    provider_transaction_id: "pay_1",
    order_reference: null,
  });

  expect(report.dashboard.invoices[0]?.orderReference).toBeNull();

  await page.getByRole("button", { name: "Alerts", exact: true }).click();

  await page.getByRole("button", { name: "Acknowledge", exact: true }).click();

  await expect(
    page.getByRole("button", { name: "Mark unreviewed", exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Saved reports", exact: true })
    .click();

  await page.getByRole("button", { name: /Open details/ }).click();

  await expect(
    page.getByRole("heading", { name: "JPY receipts" }),
  ).toBeVisible();

  expect(generation).toBe(1);

  await page.getByRole("button", { name: "Schedules", exact: true }).click();

  await page.getByRole("button", { name: "New schedule", exact: true }).click();

  await page.getByLabel("Name", { exact: true }).fill("Daily");

  await page
    .getByLabel("Next execution · UTC", { exact: true })
    .fill("2099-10-11T09:00");

  await page
    .getByRole("button", { name: "Save schedule", exact: true })
    .click();

  await expect(
    page.getByRole("status").filter({ hasText: "Schedule saved." }),
  ).toBeVisible();

  expect(
    bodies.find((body) => body.url.endsWith("/schedules"))?.body.next_run_at,
  ).toBe("2099-10-11T09:00:00Z");

  await page.getByRole("button", { name: "Inbox", exact: true }).click();

  await expect(page.getByText("Refund alert", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Mark read", exact: true }).click();

  expect(
    bodies.find((body) => body.url.includes("/notifications/"))?.body,
  ).toEqual({ read: true });
});

test("saved finance reports load and open without generating a new report", async ({
  page,
}) => {
  const report = financeFixture();

  let generations = 0;

  await page.route("**/api/finance-agent/reports**", async (route) => {
    if (route.request().method() === "POST") {
      generations += 1;

      await route.abort();

      return;
    }

    const url = new URL(route.request().url());

    if (url.pathname === "/api/finance-agent/reports") {
      await route.fulfill({
        json: [
          {
            id: report.id,
            created_at: report.generatedAt,
            start_date: report.period.startDate,
            end_date: report.period.endDate,
          },
        ],
      });

      return;
    }

    await route.fulfill({ json: { report, alertReviews: [] } });
  });

  await page.route("**/__dashboard/admin-token", (route) =>
    route.fulfill({ json: { token: "header.payload.signature" } }),
  );

  await page.goto("/#/finance");

  await connect(page);

  await expect(
    page.getByRole("button", { name: "Saved reports", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  await expect(
    page.getByRole("heading", { name: "Saved reports", exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: `Open details for ${report.id}`, exact: true })
    .click();

  await expect(
    page.getByText(`Snapshot ${report.id}`, { exact: false }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Overview", exact: true }),
  ).toHaveAttribute("aria-current", "page");

  expect(generations).toBe(0);
});

test("saved report loading, failure, and recovery are visible", async ({
  page,
}) => {
  const report = financeFixture();

  let release!: () => void;

  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  let failing = true;

  await page.route("**/__dashboard/admin-token", (route) =>
    route.fulfill({ json: { token: "header.payload.signature" } }),
  );

  await page.route("**/api/finance-agent/reports?**", async (route) => {
    await gate;

    if (failing) {
      await route.fulfill({
        status: 500,
        json: { error: "Internal provider diagnostics" },
      });

      return;
    }

    await route.fulfill({
      json: [
        {
          id: report.id,
          created_at: report.generatedAt,
          start_date: report.period.startDate,
          end_date: report.period.endDate,
        },
      ],
    });
  });

  await page.goto("/#/finance");

  await connect(page);

  await expect(
    page.getByRole("status").filter({ hasText: "Loading data…" }),
  ).toBeVisible();

  release();

  await expect(page.getByRole("alert")).toContainText(
    "Unable to complete request",
  );

  await expect(page.getByRole("alert")).toContainText(
    "The report could not be completed.",
  );

  await expect(page.getByText("Internal provider diagnostics")).toHaveCount(0);

  await expect(
    page.getByRole("status").filter({ hasText: "Loading data…" }),
  ).toHaveCount(0);

  failing = false;

  await page
    .getByRole("button", { name: "Retry loading", exact: true })
    .click();

  await expect(
    page.getByRole("button", {
      name: `Open details for ${report.id}`,
      exact: true,
    }),
  ).toBeVisible();

  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("empty schedules and inbox are distinct from failed requests", async ({
  page,
}) => {
  let failInbox = false;

  await page.route("**/__dashboard/admin-token", (route) =>
    route.fulfill({ json: { token: "header.payload.signature" } }),
  );

  await page.route("**/api/finance-agent/**", async (route) => {
    if (failInbox && route.request().url().includes("/notifications")) {
      await route.fulfill({
        status: 500,
        json: { error: "private diagnostics" },
      });

      return;
    }

    await route.fulfill({ json: [] });
  });

  await page.goto("/#/finance");

  await connect(page);

  await page.getByRole("button", { name: "Schedules", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "No schedules yet", exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Inbox", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "No notifications yet", exact: true }),
  ).toBeVisible();

  await page.getByRole("checkbox", { name: "Unread only" }).check();

  await expect(
    page.getByRole("heading", { name: "No unread notifications", exact: true }),
  ).toBeVisible();

  failInbox = true;

  await page
    .getByRole("button", { name: "Show all notifications", exact: true })
    .click();

  await expect(page.getByRole("alert")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "No notifications yet", exact: true }),
  ).toHaveCount(0);
});
