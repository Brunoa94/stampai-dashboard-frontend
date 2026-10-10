# Analytics dashboard

## Purpose and flows

The `/analytics` route generates analyses for acquisition, engagement, product configuration, generation, ecommerce, and authentication. Users select inclusive dates and funnels, explicitly generate a batch, explore summaries and daily charts, switch between stage graph/bars/table, inspect breakdowns and product activity, read AI evidence, and export CSV. View changes reuse the returned response.

Specifications: [overview](../../../DASHBOARD_UI/BUILD_GUIDELINES/FEATURES/ANALYTICS_AGENT_DASHBOARD/README.md), [features](../../../DASHBOARD_UI/BUILD_GUIDELINES/FEATURES/ANALYTICS_AGENT_DASHBOARD/FEATURES.md), and [API contract](../../../DASHBOARD_UI/BUILD_GUIDELINES/FEATURES/ANALYTICS_AGENT_DASHBOARD/DATA_CONTRACT.md).

## Structure and ownership

[AnalyticsView](../../views/AnalyticsView.vue) composes request controls, loading/error states, and report content. `ui/components/AnalyticsDashboard/` owns the header, empty state, and report workspace. `ui/sections/` owns overview, breakdown, and product presentations; `ui/components/StageActivity/` owns the interactive SVG graph and its alternatives.

`lib/composables/` owns reactive request and view workflows. `lib/services/` calls the API and exports reports; `lib/mappers/` prepares cards, charts, breakdowns, and item rows; `lib/helpers/` owns validation and graph calculations; `lib/constants/` owns typed configuration; `lib/types/` owns request/response and composable inputs. Import modules directly. Shared primitives, generic chart/table behavior, CSV encoding, errors, and connection state live in `src/shared/`. This feature does not import finance or login modules.

## Public contracts

- [AnalyticsRequestType and AnalyticsReportType](lib/types/analytics.ts) preserve the documented snake_case request fields and returned field names. Reports are matched by `gaEvent`; `analysisId` is a number.
- [useAnalytics](lib/composables/useAnalytics.ts) exposes reports, pending/error state, local completion time, `generate(body)`, and explicit `retry()`. It validates ordered real calendar dates up to 366 days and a nonempty unique funnel selection.
- [useAnalyticsView](lib/composables/useAnalyticsView.ts) coordinates the current report, funnel tabs, section, and stage selection. The active funnel preference is local browser state.
- [ReportControls](ui/components/ReportControls/ReportControls.vue) receives `pending` and emits typed `generate` requests. [AnalyticsReportContent](ui/components/AnalyticsDashboard/AnalyticsReportContent.vue) receives reports, selected report, completion timestamp, and funnel tabs; its models are `active`, `section`, and `stage`, and its `stage` event requests evidence navigation.
- Sections accept a typed `report`. The overview emits `stage`; breakdowns accept `selectedStage`. Their owning composables derive rows and chart configuration from reactive inputs.

## Configuration, dependencies, and API

Uses Vue 3, Vue Router, Pinia connection state, TanStack Vue Query, Lucide icons, and the shared Tailwind design system. Set public `VITE_API_ORIGIN` without `/api` and verified IANA `VITE_GA4_TIMEZONE` in `.env.local`, or use the sidebar Connection panel. Timezone presets require the actual GA4 property timezone. Backend CORS or a deployment proxy must permit requests. Provider, AI, and database credentials stay on the backend.

The only report endpoint is `POST /api/analytics-agent/analytics-agent-review`, with `{ start_date, end_date, funnels }`; HTTP 200 returns an array of `AnalyticsReportType`. The shared client optionally sends the in-memory bearer token when configured. The contract has no route-level JWT requirement, though deployment may impose one. There are no raw GA, history, recommendation-update, or graph-transition calls.

## Loading, failures, and recovery

Explicit generation uses the AI loading indicator and prevents duplicate submissions. Existing reports retain their original dates while pending or after failure. Shared error IDs map validation, network, malformed responses, and API failures to friendly messages; raw backend errors are not displayed. Retry is explicit: the POST persists analyses and may create additional records even after a failed or disconnected batch. Unmount aborts the frontend request and guards against stale writes; it does not guarantee backend cancellation.

Empty reports say no reported activity. Null is unavailable, distinct from zero. Event totals are aggregate events, not users or conversion. Stage ribbons show configured order rather than measured flow. Item quantities are distinct from event counts; item revenue carries no inferred currency symbol and is not added to purchase revenue. AI text is rendered as plain text. CSV downloads escape and neutralize untrusted formula cells.

## Verification and limitations

From the repository root, run `npm run typecheck`, `npm run lint`, `npm run verify:patterns`, `npm test`, and `npm run build`. Focused checks: `npx vitest run src/features/analyticsDashboard/lib/helpers/analytics.test.ts src/features/analyticsDashboard/lib/composables/useAnalytics.test.ts`. `npm run test:e2e` covers generation, stage selection, local filters, and failure retention using mocked API responses in Chrome; override `CHROME_PATH` if needed.

Live backend integration is not verified by mocked tests. History, persisted recommendation status, segmentation, measured conversion/latency, and analytics schedules require additional backend contracts. Font stacks have local fallbacks; licensed font files are not bundled. Representative large-dataset performance and memory profiling remains outstanding.

The route displays an API-connection alert when required settings are missing. In-flight requests show a bordered loading panel with a spinner (ordinary retrieval) or AI indicator (generation), plus initial skeletons. Failures show a titled error alert and explicit retry; analytics initial errors suppress the introductory empty state. Saved-finance list loading, failed retrieval, and successful retry are covered in browser tests.

Empty-state presentation distinguishes successful empty responses from loading, failed requests, and missing connection configuration. Tables distinguish no returned rows from search misses and offer Clear search; charts distinguish missing days/series, hidden series, and unavailable values while preserving zero-valued activity. Empty financial balance/contribution sections and schedule/inbox lists provide contextual explanations without implying zero totals.
