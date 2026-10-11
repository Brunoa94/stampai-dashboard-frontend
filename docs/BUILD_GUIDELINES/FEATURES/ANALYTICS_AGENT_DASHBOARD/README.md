# Analytics dashboard UI

Standalone specifications for a new Vue frontend consuming an external
analytics-agent API. Import this documentation with `DASHBOARD_UI`; no files
from the original backend repository are required. This folder contains
implementation guidance, not a running frontend.

- [Features](FEATURES.md): prioritized screens, interactions, and acceptance criteria.
- [Data contract](DATA_CONTRACT.md): endpoint inventory, request bodies, example responses, errors, and display semantics.

## Suggested layout

1. A date-range selector, funnel selector, and explicit **Generate analysis** action.
2. An overview of selected funnels with summary cards and comparison dates.
3. A detail tab for each returned funnel: daily activity, stage activity where
   available, and relevant breakdowns.
4. An insights panel with the agent's assessment, supporting evidence, and
   prioritized recommendations.

Generate on an explicit action rather than every filter change: each request
fetches GA reports, invokes Claude, and persists new analyses. Keep the last
successful response visible while generating another report and mark its date
range clearly.

## Delivery sequence

- First: request controls, summary cards, daily charts, loading/error/empty states.
- Next: funnel-specific breakdowns, product tables, stage activity (bars and
  interactive circular graphs), AI insights.
- Then: CSV export, evidence navigation, and local view preferences.
- Later, with backend support: historical reports, saved recommendation status,
  segmentation, ordered user conversion, and automated alerts.

Build chart-ready views from `dashboard`; use `report` for explanations. Preserve
existing API names and use `gaEvent` as the funnel identifier. Do not introduce
additional GA requests from the frontend.

## Backend integration

Call `POST /api/analytics-agent/analytics-agent-review` when the user explicitly
requests a new analysis. Send a JSON body containing `start_date`, `end_date`,
and a non-empty, unique `funnels` array. HTTP `200` returns an array of reports
with `gaEvent`, `analysisId`, `period`, `dashboard`, `metrics`, `report`, `model`,
and `tokensUsed`.

Use this single response for charts, tables, stage graphs, and AI insights.
Tab changes, display filters, and CSV exports operate locally. History and
recommendation-update endpoints are not registered yet. See the
[data contract](DATA_CONTRACT.md#endpoint-inventory) for request validation,
examples, status codes, and retry behavior.

## New-project setup

Follow the portable [Vue guidelines](../../../AGENTS/README.md) and
[architecture conventions](../../../AGENTS/ARQUITECTURE-PATTERNS.md). Source paths in
those documents describe files to create in the new project; they are not
imports from the original repository. Configure the external API origin,
deployment authentication, and GA4 timezone using the
[integration settings](DATA_CONTRACT.md#integration-into-a-separate-vue-project).
