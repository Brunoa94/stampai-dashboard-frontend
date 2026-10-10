# Analytics-agent data contract

## Endpoint inventory

The current dashboard needs one backend call. Configure the API origin separately
and append the path below; `/api` is already included in the path.

| UI action | Method and endpoint | Input | Expected result |
| --- | --- | --- | --- |
| Generate analysis; explicitly regenerate or retry | `POST /api/analytics-agent/analytics-agent-review` | JSON body with dates and selected funnels | `200`: array containing one persisted analysis per selected funnel |
| Change report tab, chart mode, series, table sorting, or local filters | No request | Existing response and local view state | Re-render the current report |
| Export CSV | No request | Existing response and selected export scope | Locally generated download |
| Open historical analysis or update recommendation status | Not currently available | Requires registered backend routes | Do not call a guessed URL |

This contract describes an external backend API. The imported frontend does not
need backend source files. The documented review endpoint does not currently
require a route-level JWT check; configure any authentication required by your
deployed API or gateway through the frontend API client.

Send `Content-Type: application/json`; `Accept: application/json` is recommended.
There are no URL parameters or query parameters for this request. GA credentials,
AI credentials, model selection, and comparison dates are managed by the backend
and are not request-body fields.

## Request

`POST /api/analytics-agent/analytics-agent-review`

```json
{
  "start_date": "2026-10-01",
  "end_date": "2026-10-07",
  "funnels": ["generation", "ecommerce"]
}
```

Supported funnels: `acquisition`, `engagement`, `product_configuration`,
`generation`, `ecommerce`, and `authentication`. Dates must be valid
`YYYY-MM-DD`, ordered, and include at most 366 days. Duplicate funnels are not
accepted. Comparison dates describe the immediately preceding equally sized
period, not necessarily the previous calendar week or month.

### Request body fields

| Field | Type | Required | Validation and meaning |
| --- | --- | --- | --- |
| `start_date` | string | Yes | First included date in `YYYY-MM-DD`, interpreted in the GA4 property timezone |
| `end_date` | string | Yes | Last included date; must be on or after `start_date` |
| `funnels` | array of strings | Yes | At least one supported funnel; values must be unique |

The backend first validates the body schema, then checks real calendar dates,
range ordering, and the inclusive 366-day maximum. A one-day range is valid.
Send only the documented fields and preserve their snake_case names.

### Calling sequence

1. Validate the selected dates and funnels locally.
2. Submit one POST on the user's explicit **Generate analysis** action.
3. Keep controls from issuing duplicate submissions while pending.
4. On success, store the complete response and match each report by `gaEvent`.
5. Use that response for every dashboard panel; changing views does not generate
   another analysis.
6. On failure, retain the last successful report and offer an explicit retry.

The backend retrieves current and comparison GA data, generates insights with
Claude, and persists each analysis before returning it. It returns one JSON batch;
there is no job ID, polling endpoint, progress stream, or partial-success envelope.
A disconnected or cancelled frontend request does not guarantee backend work or
persistence was cancelled. Do not automatically retry this POST.

## Successful response

HTTP `200` returns a top-level JSON array of reports, one per selected funnel.
There is no `data` or `results` wrapper. `analysisId` is a number. Use `gaEvent`
for matching selected funnels rather than relying on response array position.

| Path within a report | Shape / purpose |
| --- | --- |
| `gaEvent` | Funnel identifier |
| `analysisId` | Persisted analysis ID; not a URL to an existing history endpoint |
| `period` | `{ startDate, endDate }` |
| `dashboard.summaryCards[]` | `{ id, label, value, unit, previousValue, absoluteChange, percentChange }` |
| `dashboard.dailySeries[]` | `{ date, eventCounts: { [eventName]: count }, purchaseRevenue }` |
| `dashboard.stages[]` | `{ id, label, eventCount, unit }` |
| `dashboard.breakdowns[name][]` | `{ dimensions: { [key]: string }, eventCount, purchaseRevenue }` |
| `dashboard.comparisonPeriod` | `{ startDate, endDate }` |
| `dashboard.dataQuality` | `{ hasData, hasComparisonData, currency, measurement, limitations }` |
| `metrics.eventCounts` | Totals keyed by event name; may omit events with no rows |
| `metrics.totalPageViews` | Reported page-view count for this funnel; not a site-wide count for every report |
| `metrics.purchaseRevenue` | Reported purchase revenue for this funnel |
| `metrics.revenueCurrency` | Reported currency or `null` |
| `metrics.itemActivity[]` | `{ date, itemId, itemName, itemsSelected, itemsAddedToCart, itemsPurchased, itemRevenue }` |
| `report.overview` | AI assessment text |
| `report.findings[]` | `{ title, description, severity, evidence[] }` |
| `report.recommendations[]` | `{ title, description, priority, category, evidence[] }` |
| `report.limitations[]` | AI-provided limitation text |
| `model`, `tokensUsed` | Generation metadata; keep out of the main business dashboard |

Use `dashboard` as the primary display source. Do not add `metrics` totals to
summary card values or duplicate overlapping product tables from multiple funnel
reports. Item activity can appear in both ecommerce and product configuration.

### Example successful result

The following synthetic example corresponds to a one-day request with
`start_date` and `end_date` both `2026-10-07`, and `funnels: ["authentication"]`.
It illustrates a valid empty-data response. IDs, AI text, model name, and token
count are illustrative; they are not a captured production result.

```json
[
  {
    "gaEvent": "authentication",
    "analysisId": 123,
    "period": {
      "startDate": "2026-10-07",
      "endDate": "2026-10-07"
    },
    "dashboard": {
      "summaryCards": [
        {
          "id": "login",
          "label": "login",
          "value": 0,
          "unit": "events",
          "previousValue": 0,
          "absoluteChange": 0,
          "percentChange": null
        },
        {
          "id": "logout",
          "label": "logout",
          "value": 0,
          "unit": "events",
          "previousValue": 0,
          "absoluteChange": 0,
          "percentChange": null
        }
      ],
      "dailySeries": [
        {
          "date": "2026-10-07",
          "eventCounts": {
            "login": 0,
            "logout": 0
          },
          "purchaseRevenue": null
        }
      ],
      "stages": [],
      "breakdowns": {},
      "comparisonPeriod": {
        "startDate": "2026-10-06",
        "endDate": "2026-10-06"
      },
      "dataQuality": {
        "hasData": false,
        "hasComparisonData": false,
        "currency": null,
        "measurement": "aggregated_events",
        "limitations": [
          "Stages represent aggregate activity, not ordered user journeys or conversion.",
          "Zero means no reported activity; it does not verify that tracking works.",
          "Daily dates follow the GA4 property timezone."
        ]
      }
    },
    "metrics": {
      "itemActivity": [],
      "eventCounts": {},
      "totalPageViews": 0,
      "purchaseRevenue": 0,
      "revenueCurrency": null
    },
    "report": {
      "overview": "No reported authentication activity for the selected period.",
      "findings": [],
      "recommendations": [],
      "limitations": [
        "No reported activity does not establish whether tracking is working."
      ]
    },
    "model": "illustrative-model-name",
    "tokensUsed": 500
  }
]
```

### Expected results by funnel

| `gaEvent` | Available dashboard content |
| --- | --- |
| `acquisition` | First-visit/session-start summary and daily activity; page breakdowns |
| `engagement` | Step-change activity and step-transition breakdowns |
| `product_configuration` | Selection/configuration activity, stages, color/size/variant/upload breakdowns, and item activity |
| `generation` | Start/completion/failure activity, stages, failure reasons, and start/completion attributes |
| `ecommerce` | Cart/checkout/purchase activity, stages, revenue, payment methods, and item activity |
| `authentication` | Login/logout summary and daily activity; no stage graph |

All returned reports also contain AI insights and metadata. Array lengths,
breakdown values, findings, and recommendations depend on the selected funnel
and observed data; empty arrays are valid. The exact field sources for each
screen are listed in [Features](FEATURES.md).

Finding severity is `info`, `warning`, or `critical`. Recommendation priority is
`low`, `medium`, or `high`; category is `ux`, `copy`, `technical`, `pricing`,
`trust`, or `measurement`. Each finding and recommendation includes at least one
evidence string. The review response does not include recommendation IDs.

## Formatting and interpretation

- Daily-series dates are ISO calendar dates; item-activity dates are GA's
  `YYYYMMDD` format. Normalize for display without timezone shifts.
- `unit` currently distinguishes `events` and `money`. Item metrics measure
  quantities. Do not infer unique users or completed orders from event counts.
- `percentChange: null` means the baseline was zero. Never display infinity.
- Non-ecommerce daily revenue is `null`, not zero revenue for the business.
- Breakdown dimension values are strings, including numeric/boolean attributes.
  Missing dimension values are labeled `unknown`.
- Current response data lacks per-report generation timestamps, GA freshness
  metadata, and a concrete property-timezone identifier. If showing a local
  request-completion timestamp, label it accordingly.
- Requests can take time because provider reports and AI generation run before
  the response. There is no progress stream or partial-funnel response.

## Errors

| Status | Trigger | Expected body / handling |
| --- | --- | --- |
| `400` | Missing fields, invalid JSON, unsupported or duplicate funnels, invalid calendar dates, reversed or excessive range | `{ "error": "validation message" }`; correct inputs before retrying |
| `500` | Provider retrieval, AI generation/parsing, or persistence failure | Controller returns `{ "error": "Failed to get analytics review" }`; retain previous results and offer explicit retry |

Example date-range failure:

```json
{
  "error": "Date range must be ordered and contain at most 366 days"
}
```

Example generation failure:

```json
{
  "error": "Failed to get analytics review"
}
```

The shared error handler currently normalizes framework validation errors to an
`error` field. Framework validation wording can vary; do not match exact text to
control UI logic. Infrastructure or future handlers may expose `message`, so
extract a safe string from `error` or `message` with a fallback for network or
non-JSON failures. No structured per-field error list is promised.

A failed batch may already have saved some successful funnel analyses. An
explicit retry can create additional records; this endpoint is not idempotent.
The failure response does not identify those saved analyses.

## Related routes and unavailable capabilities

`GET /api/analytics/*` routes expose raw event reports, but are not needed for
these dashboard screens: the review response already includes their prepared
data. Do not issue extra raw-report calls to populate charts or drill-downs
specified here.

History, saved recommendation status changes, property-timezone discovery, and
measured conversion graphs are not available in this contract. Require an
explicit API contract and deployed endpoint before implementing those calls.

## Integration into a separate Vue project

Treat this document as the standalone integration specification. All endpoint
paths are relative to the configured backend origin, not the frontend host.
For example, an illustrative origin of `https://api.example.com` produces
`https://api.example.com/api/analytics-agent/analytics-agent-review`.

Configure these values in the new project:

| Setting | Purpose |
| --- | --- |
| API origin, for example `VITE_API_ORIGIN` | Public backend origin without a trailing `/api`, since endpoint paths already include it |
| Authentication transport, if required by deployment | Bearer token or cookies supplied through the API client |
| GA4 property timezone | Date preset calculation; this response does not expose the timezone identifier |
| Frontend/backend connectivity | Cross-origin requests must be allowed by the backend, or use a configured same-origin proxy |

Vite-prefixed environment values are public browser configuration. Keep GA,
AI, database, and other provider secrets on the backend. Do not assume the new
project already has an API client, query library, Pinia setup, or design system;
create or configure them according to the included Vue conventions.

Define frontend request and response types from the field tables and examples
in this document. They do not require importing backend-generated types. If a
published OpenAPI contract becomes available, use it to synchronize those types.
The sample values are illustrative, while the documented field shapes and
validation rules describe the API this frontend expects.

The Markdown links in this folder resolve within the imported documentation.
When the API changes, update this contract and the affected acceptance criteria
together. No backend checkout is required to interpret this specification.
