# Finance dashboard

## Purpose and flows

The `/finance` route generates UTC finance snapshots and presents source coverage, per-currency receipts, daily charts, balances, transactions, reconciliation, order contribution, product allocation, AI insights, and alerts. Users can edit verified invoice references for future reports, reopen saved reports, acknowledge alerts, manage schedules, and read in-app notifications.

Specifications: [overview](../../../DASHBOARD_UI/BUILD_GUIDELINES/FEATURES/FINANCE_AGENT_DASHBOARD/README.md), [features](../../../DASHBOARD_UI/BUILD_GUIDELINES/FEATURES/FINANCE_AGENT_DASHBOARD/FEATURES.md), and [API contract](../../../DASHBOARD_UI/BUILD_GUIDELINES/FEATURES/FINANCE_AGENT_DASHBOARD/DATA_CONTRACT.md).

## Structure and ownership

[FinanceView](../../views/FinanceView.vue) composes controls, section tabs, loading/error states, snapshot identity, and the [FinanceContent](ui/components/FinanceDashboard/FinanceContent.vue) section selector. `ui/components/FinanceDashboard/` owns header and empty presentation; `ui/sections/` owns each financial workspace; `ui/components/FinanceControls/` owns request controls.

`lib/composables/` owns reactive workflows, filters, editor state, and report-derived presentation. `lib/queries/` owns list queries/cache keys; `lib/services/` owns endpoint calls; `lib/helpers/` owns validation and deterministic eligibility/evidence calculations; `lib/constants/` owns typed table/tab/options configuration; `lib/types/` owns API and composable input contracts. Shared client, errors, connection state, chart/table behavior, and formatting stay under `src/shared/`. This feature does not import analytics or login modules. Keep invoice editing, schedules, notifications, and transactions decoupled; report orchestration groups only workflows sharing the selected snapshot and action state.

## Public contracts

- [Finance types](lib/types/finance.ts) define `FinanceRequestType`, `FinanceReportType`, `ReportDetailType`, `AlertReviewType`, reference, schedule, and notification contracts. Monetary values remain integer currency minor units; null remains unavailable.
- [useFinance](lib/composables/useFinance.ts) exposes the report, alert reviews, errors, operation-specific pending flags, `generate(input)`, `open(id)`, `acknowledge(id, value)`, and `retry()`. Generation accepts inputs without `request_id`, creates a fresh ID, and preserves it on explicit retry. Retry repeats the failed generation, open, or acknowledgement action.
- [useFinanceView](lib/composables/useFinanceView.ts) coordinates section selection, AI loading, saved-report opening, and evidence focus. It delegates API behavior to `useFinance`.
- [FinanceControls](ui/components/FinanceControls/FinanceControls.vue) receives `pending` and emits typed `generate` inputs. `FinanceContent` receives section, nullable report, reviews, saving state, and busy state; it emits `open`, `evidence`, and `acknowledge`.
- Report sections receive a typed `report`; alerts additionally receive reviews/pending and emit acknowledgement. History and notifications emit report IDs to open. Insights emit supported evidence targets.
- [useInvoiceEditor](lib/composables/useInvoiceEditor.ts) accepts a reactive report getter, exposes verified reference options/form state, and provides `open(invoice)` and `save()`. Saved reports remain immutable after edits.
- [useScheduleEditor](lib/composables/useScheduleEditor.ts) owns full schedule form state and `edit(schedule?)`/`save()`; [useNotifications](lib/composables/useNotifications.ts) owns inbox pagination, unread filtering, and read-state mutations independently of alert acknowledgement.

## Configuration and dependencies

Uses Vue 3, Vue Router, Pinia connection state, TanStack Vue Query, Lucide icons, and shared Tailwind primitives. Configure public `VITE_API_ORIGIN` without `/api`, or use Connection. Enter a bearer JWT through that panel; it remains in memory and logout clears it and query cache. Backend CORS or a deployment proxy must permit requests. Login is a separately scoped UI preview and does not obtain a JWT or guard routes.

Provider/AI/database credentials stay on the backend. `PRINTIFY_REPORT_CURRENCY` and `PRINTIFY_COST_BASIS` must be verified and configured there. Missing cost configuration leaves contribution unavailable while receipts and reconciliation remain usable. Backend schedule execution depends on its database migrations and scheduler configuration, not a frontend timer.

## API endpoints

All paths are relative to the configured origin; requests use bearer JWT and JSON bodies where applicable.

| Action                    | Endpoint                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Generate snapshot         | `POST /api/finance-agent/reports`                                                    |
| Paginated history         | `GET /api/finance-agent/reports?limit=20&offset=...`                                 |
| Open immutable snapshot   | `GET /api/finance-agent/reports/:id`                                                 |
| Acknowledge alert         | `PATCH /api/finance-agent/reports/:id/alerts/:alertId`                               |
| Edit invoice references   | `PATCH /api/invoices/:id/references`                                                 |
| List/create/edit schedule | `GET/POST /api/finance-agent/schedules`, `PATCH /api/finance-agent/schedules/:id`    |
| List notifications        | `GET /api/finance-agent/notifications?limit=20&offset=...`, optionally `unread=true` |
| Change read state         | `PATCH /api/finance-agent/notifications/:id`                                         |

Generation sends `{ request_id, start_date, end_date, include_ai }` with an inclusive ordered 1–31-day UTC range. Alert PATCH sends `{ acknowledged }`; notification PATCH sends `{ read }`. Reference PATCH always sends currency, provider transaction ID, and order reference, using explicit nulls to clear values. Schedule POST/PATCH sends all fields: name, enabled, cadence/lookback days, include_ai, and a future UTC next_run_at. Report and alert path IDs are URL-encoded.

## Loading, failures, and recovery

Generation displays AI loading only when AI was requested; snapshot retrieval and lists use ordinary loading states/skeletons. Existing reports remain visible after failures. Explicit retry retains report idempotency inputs or repeats the failed action. List failures provide refetch controls; mutations retain form inputs and only commit success state after saving. Shared error mapping covers invalid inputs, missing/expired JWT, missing records, conflicts/running schedules, server/network errors, and invalid responses. There are no automatic retries.

Partial coverage warnings accompany receipt totals. Fees, missing sources, balances, and contribution preserve unavailable values. Totals never combine currencies; contribution requires matching costs, unique matches, complete coverage, and known fees. Product values are allocated by retail weight rather than verified product payments. AI failures retain deterministic numeric data. Alert acknowledgement means reviewed; it neither corrects the issue nor marks an inbox notification read.

## Verification and limitations

From the root, run `npm run typecheck`, `npm run lint`, `npm run verify:patterns`, `npm test`, and `npm run build`. Focused checks: `npx vitest run src/features/financeDashboard/lib/helpers/finance.test.ts src/features/financeDashboard/lib/composables/useFinance.test.ts`. `npm run test:e2e` covers snapshots, invoice edits, alerts, history, schedules, and notifications with mocked contract responses in Chrome; override `CHROME_PATH` if needed.

Live login and saved-report list/detail reads have been verified. Provider retrieval, live report generation/mutations, and scheduler execution remain unverified. Invoice edits affect future reports; legacy missing metadata can remain unmatched. Contribution excludes overhead, unlinked adjustments, and refunds outside the retrieval window, and is not business net profit. FX conversion and email/SMS/webhook delivery are unavailable. Representative large-dataset performance and memory profiling remains outstanding.

### Local admin token exchange

For `npm run dev` against a port-3002 loopback origin (`localhost`, `127.0.0.1`, or `[::1]`), server-only `ADMIN_USER` (admin email) and `ADMIN_PASSWORD` in `.env` enable the local Vite exchange described in the [root README](../../../README.md). Lists can start without a manually entered token in this mode; the shared client obtains the JWT before sending protected requests. This is separate from the deferred login UI and is not available in production builds. Token expiry requires explicit recovery; failed report requests are never automatically replayed.

Saved finance reports load in the default **Saved reports** tab through authenticated GET list/detail endpoints, without generating a new report. Opening a saved snapshot or successfully generating a report switches to Overview. History has pagination, refresh, connection, loading, and retry states. Swagger was inspected at `http://localhost:3002/docs/json`; live login, saved-finance listing (one row), and saved-report detail returned HTTP 200 on 2026-10-10. Analytics history has no registered endpoint in that Swagger inventory.

The route displays an API-connection alert when required settings are missing. In-flight requests show a bordered loading panel with a spinner (ordinary retrieval) or AI indicator (generation), plus initial skeletons. Failures show a titled error alert and explicit retry; analytics initial errors suppress the introductory empty state. Saved-finance list loading, failed retrieval, and successful retry are covered in browser tests.

Saved-report validation distinguishes namespaced evidence IDs (for example, `current:summary:EUR:salesMinor`) from actual monetary fields. Evidence objects are preserved, while monetary values still require safe integer minor units. Regression coverage is in `lib/helpers/validation.test.ts`.

Empty-state presentation distinguishes successful empty responses from loading, failed requests, and missing connection configuration. Tables distinguish no returned rows from search misses and offer Clear search; charts distinguish missing days/series, hidden series, and unavailable values while preserving zero-valued activity. Empty financial balance/contribution sections and schedule/inbox lists provide contextual explanations without implying zero totals.

Source coverage is composed from SourceCoverage and SourceCard, with completeness and cost configuration derived by useSourceCoverage. Failed sources are highlighted separately from completed sources with zero records. Daily receipts use the shared shadcn-vue/Unovis chart and retain unavailable values and table exports.
