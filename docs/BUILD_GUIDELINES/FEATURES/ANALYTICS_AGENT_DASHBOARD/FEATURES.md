# Features to implement

For endpoint paths, request bodies, and expected results, use the
[data contract](DATA_CONTRACT.md#endpoint-inventory). Only the explicit generate
or retry action issues the review POST; all current report views reuse its response.

## 1. Report controls and overview — first release

Let the user choose inclusive start/end dates and one or more funnels, then
explicitly generate an analysis. Offer last 7 complete days, last 30 complete
days, and custom dates. Presets must use a configured GA4 property timezone;
that timezone is not currently returned by the API.

Show selected-funnel cards with their period and a link to the detail tab.
Identify results by `gaEvent`, not array position.

Acceptance criteria:

- Reject missing/invalid dates, reversed ranges, ranges over 366 days, and empty
  funnel selection before submitting.
- Prevent duplicate submissions during a request. Provide progress text rather
  than a fabricated percentage; the endpoint does not stream progress.
- On failure, show the API error and an explicit retry action. Do not
  automatically retry a potentially persisted analysis request.
- Display the last successful result with its original dates if a refresh fails.
- Treat the current endpoint as one batch response; per-funnel partial results
  are not exposed.

## 2. Summary cards and comparison badges — first release

Render `dashboard.summaryCards` with value, unit, previous value, absolute change,
percentage change, and the exact `dashboard.comparisonPeriod` dates.

Acceptance criteria:

- Format event counts as integers and monetary values with reported currency.
- Show “No percentage baseline” when `percentChange` is null.
- If `hasComparisonData` is false, show “No comparison data” instead of suggesting
  a measured improvement from zero.
- Color changes according to the metric: more failures should not receive a
  positive green badge. Use neutral styling when direction has no clear meaning.
- Avoid calling event totals users, sessions, orders, or conversion rates.

## 3. Daily activity charts — first release

Plot `dashboard.dailySeries` with series toggles and date/value tooltips. Render
purchase revenue on a separate chart or axis from event counts.

Acceptance criteria:

- Preserve returned date ordering and all returned days, including zero values.
- Treat dates as calendar labels; do not shift them through browser timezone
  conversion.
- Provide a table alternative to every chart and accessible series labels.
- Do not draw a previous-period line: only previous-period summary values are
  currently returned.

## 4. Funnel stage activity — second release

Show `dashboard.stages` as horizontal bars for generation, ecommerce, and product
configuration. Label the view “Stage activity” and expose the aggregated-event
limitation next to it.

Acceptance criteria:

- Preserve the backend stage order; allow later stages to exceed earlier counts.
- Do not calculate user abandonment, completion probability, or conversion.
- Hide this panel when stages are empty. Failures remain a separate generation
  breakdown, not a stage after completion.

### Interactive circular funnel graph

Offer a graph view alongside the stage bars, with this self-contained visual specification:
large circular stage nodes with centered counts, donut-style outlines, and curved
ribbons connecting stages. Use purple as the main accent, clear stage labels,
and a compact metric strip above the graph. Allow an alternating vertical layout
on wide screens and a stacked layout on narrow screens.

Implement the graph with SVG or an existing frontend visualization library;
it should respond to real report values rather than use a static image.

#### Available now: aggregate stage activity

- Build nodes from `dashboard.stages`, preserving their IDs and order. Display
  the stage label, `eventCount`, and the unit **events** in each node.
- Use a bounded, documented size scale so both small and large stages remain
  readable. Show exact counts in text rather than relying on node size alone.
- Connect adjacent nodes with neutral, equal-width curved ribbons. These show
  the configured stage order, not measured user traffic between stages.
- Use single-color rings initially. The current stage data does not contain
  mutually exclusive segment populations for colored donut slices.
- Populate the metric strip from this funnel's summary cards and comparison
  dates. Do not display total user conversion or average conversion time.
- Hover or keyboard-focus a node to show its event, count, period, and previous
  value where available. Selecting it opens its daily series and relevant
  breakdown panel.
- Allow switching between graph, bars, and an accessible stage table without
  changing the selected report or generating another analysis.
- Keep optional hidden-stage preferences local to the view. Hiding a stage
  must not imply that the newly adjacent stages have a measured transition.

Acceptance criteria:

- Label the graph **Aggregate stage activity**, with the measurement limitation
  visible near it. Do not label node counts as users.
- Do not infer edge flow, abandonment, bypass paths, or progression percentages
  from ratios between independent event totals. Later stages may have larger
  counts; do not clamp or alter them to resemble a decreasing funnel.
- Support zero-count nodes, long labels, keyboard navigation, reduced motion,
  and a table alternative. Do not distinguish nodes using color alone.
- Show a useful empty state when no stages are returned; do not invent stage
  nodes for acquisition, engagement, or authentication.

#### Later: measured conversion graph with measured transitions

To show weighted flow ribbons, per-transition percentages, segment donut slices,
and conversion/time metrics beyond aggregate activity, extend the backend with ordered,
linked user/session funnel measurements. Define the counting unit, eligibility
population, stage order, conversion window, and segment rules explicitly.

Required graph data:

| Field | Purpose |
| --- | --- |
| `nodes[]: { id, label, count, unit, segments[] }` | Actual stage populations and optional mutually exclusive segment counts |
| `edges[]: { source, target, count, eligibleCount, conversionPercent }` | Measured transitions and their explicitly defined denominators |
| `summary: { entrants, converters, totalConversionPercent, averageConversionTimeSeconds }` | End-to-end conversion and elapsed time for linked converters |
| `measurement: { unit, conversionWindow, timezone, stageDefinitions }` | Explain how the funnel was measured |

This is a proposed extension, not part of the current analytics-agent response.
Only render segment slices when counts partition the node population; retain an
unknown segment when needed. Conversion time requires linked timestamps and must
remain unavailable until those measurements exist. Bypass ribbons or excluded
users require explicit backend measurements, not differences between node totals.

## 5. Funnel detail screens — second release

| Funnel | Features | Response source |
| --- | --- | --- |
| Acquisition | Daily first visits/session-start events; most-viewed pages with path/title, sortable counts, and share of reported page views | `dailySeries`, `breakdowns.pages` |
| Engagement | Forward/backward transition table or matrix; filter by step and direction; identify frequent repeated/backward activity | `breakdowns.stepTransitions`, `dailySeries` |
| Product configuration | Popular colors and sizes by product; created-variant table; upload type/size distribution | `breakdowns.colors`, `sizes`, `createdVariants`, `uploads` |
| Generation | Start/completion/failure trends; failure reasons ranked by count; prompt/preservation and reference-image usage summaries | `dailySeries`, `breakdowns.failureReasons`, `startAttributes`, `completionAttributes` |
| Ecommerce | Cart/checkout/purchase activity; revenue chart; payment-method counts/revenue; product quantities and item revenue | `stages`, `dailySeries`, `breakdowns.paymentMethods`, `metrics.itemActivity` |
| Authentication | Login/logout event totals and daily trends | `summaryCards`, `dailySeries` |

Acceptance criteria:

- Keep unknown dimension values visible under “Unknown”; do not discard them.
- Percentage shares use the relevant returned breakdown total, with a named
  denominator. A zero denominator displays no percentage.
- Do not infer that upload sizes or prompt lengths cause failures: the reports
  do not link attributes to outcomes.
- Do not call login counts retention or authentication success rates.
- Chart only a selected top group when necessary, with remaining values in
  “Other” and a complete table available.

## 6. Product activity explorer — second release

Aggregate `metrics.itemActivity` across dates by item ID and item name. Provide
sorting and text search for selections, units added to cart, units purchased,
and item revenue. Expand a product to show its daily rows.

Acceptance criteria:

- Normalize item dates from `YYYYMMDD` for display.
- Keep item quantities separate from event counts. A single event may contain
  multiple units.
- Never add item revenue to purchase revenue: these are overlapping views.
- Do not calculate profit, margins, or product conversion from this response.
- Missing IDs/names remain visible; do not merge all unknown items into one
  apparently identified product.
- Label item revenue without a currency symbol unless its currency is verified;
  the item rows currently carry no explicit currency metadata.

## 7. Evidence-backed AI insights — second release

Show `report.overview`, findings by severity, and recommendations by priority and
category. Each item can expand its `evidence`; display `report.limitations`
alongside backend data-quality notes.

Acceptance criteria:

- Clearly identify narrative findings as AI-generated.
- Treat all returned text as plain text; do not render arbitrary HTML.
- Preserve supporting evidence and distinguish recommendations from measured
  results. Avoid adding fabricated uplift or a health score.
- Do not imply recommendation status is saved: the review response has no
  recommendation IDs and status-update routes are not currently registered.

## 8. Exports and view preferences — third release

Export visible summary cards, daily series, or breakdown tables to CSV with the
funnel, period, units, and comparison dates. Allow local preferences for active
series, table sorting, and selected funnel tab.

Acceptance criteria:

- Label export scope: visible filtered table versus complete returned table.
- Escape CSV cells and neutralize spreadsheet formulas in untrusted text.
- Make local preferences distinct from persisted report/recommendation state.
- Do not include raw provider data or hidden model metadata in exports by default.

## 9. Data-quality and empty states — shared requirement

Use `dashboard.dataQuality.hasData`, `hasComparisonData`, `currency`,
`measurement`, and `limitations` throughout the UI.

Acceptance criteria:

- An empty report says “No reported activity” rather than “Tracking is broken.”
- Zero counts are distinct from unavailable values (`null`).
- Display unknown currency explicitly and avoid a default USD symbol.
- Keep previous results distinguishable from the newly selected request period.

## Requires additional backend work

| Future feature | Missing capability |
| --- | --- |
| Analysis history and reopening saved reports | Registered list/detail endpoints; schemas and persistence alone do not expose them |
| Persisted recommendation tracking | Recommendation IDs in responses and registered status-update endpoints |
| Device/browser/channel comparison | Segmented GA reports |
| Verified user conversion and abandonment | Ordered user/session funnel measurement |
| Generation latency and attempt success rates | Attempt IDs, durations, and linked outcomes |
| Scheduled anomaly notifications | Scheduling, baseline rules, and notification integration |
| Product profitability | Reconciled payment, order, and fulfillment costs |

These features should not be represented as already available dashboard metrics.
