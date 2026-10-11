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
    // Issue triage state loads alongside reports; it is not an analysis request.
    if (route.request().url().includes("/api/report-issues")) {
      await route.fulfill({ json: [] });

      return;
    }

    posts++;

    if (posts === 1) await route.fulfill({ json: [report] });
    else
      await route.fulfill({ status: 500, json: { error: "internal secret" } });
  });

  await page.goto("/");

  await connect(page);

  await page
    .getByRole("button", { name: "Generate analysis", exact: true })
    .click();

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

test("finance snapshot, verified invoice edits, alerts, notifications, and history", async ({
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
    else await route.fulfill({ json: [] });
  });

  await page.goto("/#/finance");

  await connect(page);

  await page
    .getByRole("button", { name: "Generate report", exact: true })
    .click();

  await page.getByLabel("Start date · UTC", { exact: true }).fill("2026-10-01");

  await page.getByLabel("End date · UTC", { exact: true }).fill("2026-10-01");

  await page
    .getByRole("button", { name: "Generate report", exact: true })
    .click();

  await expect(
    page.getByRole("heading", { name: "JPY receipts" }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Transactions", exact: true }),
  ).toHaveCount(0);

  await page
    .getByRole("button", { name: "View transactions in Activity", exact: true })
    .click();

  await expect(page).toHaveURL(/#\/activity\?section=transactions/);

  await page.getByRole("button", { name: /Open details/ }).click();

  await expect(page.getByText("Original reference: raw_1")).toBeVisible();

  await page
    .getByRole("button", { name: "Finance dashboard", exact: true })
    .click();

  // The open snapshot survives the round trip through Activity.
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

  await expect(
    page.getByRole("button", { name: "Schedules", exact: true }),
  ).toHaveCount(0);

  await expect(
    page.getByRole("button", { name: "Production costs", exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Agent Overview", exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Inbox", exact: true }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Activity", exact: true }).click();

  await page.getByRole("button", { name: "Inbox", exact: true }).click();

  await expect(page.getByText("Refund alert", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Mark read", exact: true }).click();

  expect(
    bodies.find((body) => body.url.includes("/notifications/"))?.body,
  ).toEqual({ read: true });

  await page.getByRole("button", { name: "Open report", exact: true }).click();

  await expect(page).toHaveURL(/#\/finance$/);

  await expect(
    page.getByRole("heading", { name: "JPY receipts" }),
  ).toBeVisible();
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

test("empty inbox is distinct from failed requests", async ({ page }) => {
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

  await page.getByRole("button", { name: "Activity", exact: true }).click();

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

test("color theme follows the system and remembers explicit preferences", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });

  await page.goto("/");

  const theme = page.getByRole("combobox", { name: "Color theme" });

  const root = page.locator("html");

  await expect(theme).toHaveValue("system");

  await expect(root).toHaveAttribute("data-theme", "light");

  await page.emulateMedia({ colorScheme: "dark" });

  await expect(root).toHaveAttribute("data-theme", "dark");

  await expect(page.locator("header")).toHaveCSS(
    "background-color",
    "rgb(28, 31, 37)",
  );

  await theme.selectOption("light");

  await expect(root).toHaveAttribute("data-theme", "light");

  await expect(page.locator("header")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );

  await page.reload();

  await expect(theme).toHaveValue("light");

  await expect(root).toHaveAttribute("data-theme", "light");

  await theme.selectOption("dark");

  await page
    .getByRole("button", { name: "Login preview", exact: true })
    .click();

  await expect(root).toHaveAttribute("data-theme", "dark");

  await expect(theme).toHaveValue("dark");

  await theme.selectOption("system");

  await page.emulateMedia({ colorScheme: "light" });

  await expect(root).toHaveAttribute("data-theme", "light");
});

test("report controls align and remain usable at mobile widths", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: "Generate analysis", exact: true })
    .click();

  const start = page.getByLabel("Start date", { exact: true });

  const end = page.getByLabel("End date", { exact: true });

  const preset = page.getByRole("button", { name: "Last 7 days", exact: true });

  const generate = page.getByRole("button", {
    name: "Generate analysis",
    exact: true,
  });

  const sizes = await Promise.all(
    [start, end, preset].map((control) => control.boundingBox()),
  );

  expect(sizes.every((size) => size && size.height >= 44)).toBe(true);

  expect(new Set(sizes.map((size) => size?.height)).size).toBe(1);

  expect(new Set(sizes.map((size) => size?.y)).size).toBe(1);

  await preset.click();

  await expect(start).not.toHaveValue("");

  await expect(end).not.toHaveValue("");

  await expect(
    page.getByRole("group", { name: "Funnels to include" }),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });

  await expect(start).toBeVisible();

  await expect(generate).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await page
    .getByRole("button", { name: "Finance dashboard", exact: true })
    .click();

  await page
    .getByRole("button", { name: "Generate report", exact: true })
    .click();

  await expect(
    page.getByLabel("Start date · UTC", { exact: true }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Generate report", exact: true }),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("generation panels start collapsed and preserve options when reopened", async ({
  page,
}) => {
  await page.goto("/");

  const trigger = page.getByRole("button", {
    name: "Generate analysis",
    exact: true,
  });

  const start = page.getByLabel("Start date", { exact: true });

  await expect(start).toHaveCount(0);

  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await expect(
    page
      .locator(".page-header")
      .getByRole("button", { name: "Generate analysis", exact: true }),
  ).toBeVisible();

  await trigger.click();

  await expect(start).toBeFocused();

  const ecommerce = page.getByRole("button", {
    name: "Ecommerce",
    exact: true,
  });

  await expect(ecommerce).toHaveAttribute("aria-pressed", "true");

  await ecommerce.focus();

  await page.keyboard.press("Space");

  await expect(ecommerce).toHaveAttribute("aria-pressed", "false");

  await ecommerce.click();

  await expect(ecommerce).toHaveAttribute("aria-pressed", "true");

  await start.fill("2026-10-01");

  await page
    .getByRole("button", { name: "Collapse generation options" })
    .click();

  await expect(start).toHaveCount(0);

  await expect(trigger).toBeFocused();

  await trigger.click();

  await expect(start).toHaveValue("2026-10-01");

  await page
    .getByRole("button", { name: "Finance dashboard", exact: true })
    .click();

  const reportTrigger = page.getByRole("button", {
    name: "Generate report",
    exact: true,
  });

  const financeStart = page.getByLabel("Start date · UTC", { exact: true });

  await expect(financeStart).toHaveCount(0);

  await reportTrigger.click();

  await expect(financeStart).toBeFocused();
});

test("header generation actions stay visible when switching dashboard pages", async ({
  page,
}) => {
  await page.goto("/#/finance");

  await expect(
    page
      .locator(".page-header")
      .getByRole("button", { name: "Generate report", exact: true }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Analytics dashboard", exact: true })
    .click();

  const action = page
    .locator(".page-header")
    .getByRole("button", { name: "Generate analysis", exact: true });

  await expect(action).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });

  await expect(action).toBeVisible();

  await action.click();

  await expect(page.getByLabel("Start date", { exact: true })).toBeVisible();

  await page
    .getByRole("button", { name: "Finance dashboard", exact: true })
    .click();

  await page
    .getByRole("button", { name: "Analytics dashboard", exact: true })
    .click();

  await expect(action).toBeVisible();
});
