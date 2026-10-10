# Finance API data contract

All paths are relative to a configured external API origin. Authenticate with a
bearer JWT and send JSON bodies with `Content-Type: application/json`.

## Endpoint inventory

| Method and path | Input | Successful result |
| --- | --- | --- |
| `POST /api/finance-agent/reports` | Report body below | `200`: saved report |
| `GET /api/finance-agent/reports?limit=20&offset=0` | Optional limit 1–100; offset >= 0 | Array of `{ id, created_at, start_date, end_date }` |
| `GET /api/finance-agent/reports/:id` | Report ID | `{ report, alertReviews: [{ alert_id, acknowledged, updated_at }] }` |
| `PATCH /api/finance-agent/reports/:id/alerts/:alertId` | `{ "acknowledged": true }` | `{ "acknowledged": true }` |
| `PATCH /api/invoices/:id/references` | Reference body below | Updated invoice |
| `GET /api/finance-agent/schedules` | No body | Schedule array |
| `POST /api/finance-agent/schedules` | Full schedule body below | `201`: schedule |
| `PATCH /api/finance-agent/schedules/:id` | Full schedule body below | `200`: schedule |
| `GET /api/finance-agent/notifications?unread=true&limit=20&offset=0` | Optional unread flag and pagination | Notification array |
| `PATCH /api/finance-agent/notifications/:id` | `{ "read": true }` | Updated notification |

No body is required for GET endpoints. Use URL encoding for report and alert IDs.

## Generate report body

```json
{
  "request_id": "finance_20261001_example",
  "start_date": "2026-10-01",
  "end_date": "2026-10-07",
  "include_ai": true
}
```

Required `request_id`: 8–100 letters, digits, underscores, or hyphens. Generate a
new ID for each deliberate new report; preserve it on explicit retry. Same ID
and inputs return the saved snapshot; different inputs return 409. Concurrent
requests share work within a server process and one snapshot wins atomically
across processes. This prevents duplicate saved reports, not every possible
provider/AI call across processes.

Dates are real inclusive UTC calendar dates, with an ordered 1–31-day range.
Comparison covers the immediately preceding equally sized period. `include_ai`
is optional and defaults to false. Generation returns one object, not an array
or a `data` wrapper. There is no progress stream or partial-job polling endpoint.

## Report response

| Path | Shape / meaning |
| --- | --- |
| `id` | Equal to request ID |
| `generatedAt` | UTC completion timestamp |
| `calculationVersion` | `finance-v2` |
| `period` | `{ startDate, endDate, timezone: "UTC" }` |
| `comparisonPeriod` | `{ startDate, endDate }` |
| `costConfiguration` | `{ currency: string or null, costBasis: "per_unit" or "line_total" or null }` |
| `dashboard` | Current dashboard below |
| `comparison` | Same dashboard fields for the previous period; balance not requested |
| `insights` | `{ overview, findings[], recommendations[], limitations[] }` or null |
| `insightsStatus` | `not_requested`, `complete`, or `failed` |
| `evidence` | Dictionary keyed by evidence ID, values `{ label, value, unit }`; value is number, string, or null |

Findings/recommendations contain `{ title, description, evidence[] }`. Each
`evidence` string must resolve to an exact returned dictionary key. Unknown
references or invalid/truncated AI JSON cause insights failure, retaining metrics.
Examples of IDs: `current:summary:USD:salesMinor`,
`comparison:coverage:stripe`, `current:contribution:USD`.

### Dashboard response fields

| Field | Returned shape |
| --- | --- |
| `summaries[]` | `{ currency, fractionDigits, salesMinor, refundsMinor, feesMinor, netReceiptsMinor, unclassifiedCount }` |
| `dailySeries[]` | `{ date, summaries: [...] }`, one row per requested day |
| `transactions[]` | `{ id, provider, date, category, status, currency, amountMinor, feeMinor, netMinor, reference, paymentReference }` |
| `invoices[]` | `{ id, provider, amountMinor, currency, date, paymentReference, orderReference, transactionId, matchStatus, reason }` |
| `orders[]` | `{ id, orderReference, date, status, totalPriceMinor, shippingMinor, taxMinor, currency, fulfilledAt, fulfillmentDays, paymentMatchStatus, invoiceId, productionCostMinor, shippingCostMinor, taxCostMinor, revenueMinor, refundsMinor, feesMinor, profitMinor, marginPercent, limitation }` |
| `orderMetrics` | `{ totalOrders, fulfilledOrders, pendingOrders, matchedOrders, contributionEligibleOrders, averageFulfillmentDays }` |
| `products[]` | `{ productId, name, currency, quantity, orderCount, allocatedRevenueMinor, allocatedRefundsMinor, allocatedFeesMinor, productionCostMinor, allocatedShippingMinor, allocatedTaxMinor, contributionMinor, allocationMethod: "retail_weight" }` |
| `contributionSummaries[]` | `{ currency, matchedOrderCount, revenueMinor, refundsMinor, feesMinor, productionCostMinor, shippingCostMinor, taxCostMinor, contributionMinor, marginPercent }` |
| `trends[]` | `{ currency, metric, currentValue, previousValue, absoluteChange, percentChange, comparable }` |
| `balances[]` | `{ currency, availableMinor, pendingMinor }` |
| `balanceAsOf` | Snapshot timestamp or null |
| `coverage[]` | `{ source, status, recordCount, error }` |
| `limitations[]` | Measurement notes |
| `alerts[]` | `{ id, severity, message }` |

`feeMinor`, `netMinor`, invoice metadata/amounts/matched ID, fulfillment duration,
order costs/receipt/contribution/margin, and trend differences can be null. Null
means unavailable; zero means an actual returned zero. `limitation` may be null.

Money uses normalized ISO currency minor units. Stripe's ISK/UGX legacy
representation is normalized first. Never universally divide by 100 or sum
currencies; this API performs no FX conversion.

Receipt summaries include classified sales and outgoing refunds. Refund magnitude
is positive. Fees include known sale/refund fees, including negative reversals.
`netReceiptsMinor = salesMinor - refundsMinor - feesMinor`; missing included fees
yield null. Other activity is visible but excluded. Payouts are not sales.
PayPal incoming refund credits are not outgoing refunds.

Reconciliation matches exact provider and payment ID/source reference, currency,
and amount. Statuses are `matched`, `unmatched`, `duplicate`, `amount_mismatch`,
`currency_mismatch`, or `status_mismatch`. `order_reference` must identify exactly
one Printify order by ID, app order ID, or shop order ID. Multiple matching orders
prevent contribution. Historical invoices linked to retrieved orders may appear
alongside invoices created during the selected period.

Contribution requires uniquely matched payment/invoice data, matching cost
currency, configured basis, complete payment/reference coverage, and known fees.
Its formula is retrieved linked sale minus retrieved linked refunds, processing
fees, production costs, shipping costs, and tax costs. It excludes overhead,
unlinked adjustments, and refunds outside the selected period.
`profitMinor` is this contribution measure, not company net profit.

Printify `totalPriceMinor` is retail price, not production cost. Line cost and
shipping values are interpreted using the declared cost basis: multiply by
quantity for `per_unit`; sum once for `line_total`. Tax uses the order tax field.
Do not multiply quantities again in the frontend. Currency is configured
explicitly, never inferred from a payment or defaulted to USD.

Products allocate receipts/refunds/fees and shared shipping/tax by line retail
price times quantity. Largest-remainder allocation preserves exact integer
order totals. Product production costs follow the configured cost basis.
Zero/invalid retail weights prevent product allocation. These are allocated
product estimates, not separately verified product payment records.

Trend metrics are `salesMinor`, `refundsMinor`, `feesMinor`, `netReceiptsMinor`.
`comparable` requires complete payment-source coverage in both periods and
available values. Zero baseline produces null percentage change.

Coverage sources include `stripe`, `paypal`, `invoices`, `printify`, `balance`,
and optional linkage sources `refund_references` / `invoice_links`. Status is
`complete`, `failed`, or `not_requested`. Failed sources produce partial reports
and alerts; invalid monetary normalization fails generation instead of publishing
invalid totals. Complete empty sources have zero records.

Alerts cover source/AI failures, invoice reconciliation problems, outgoing refund
activity, negative order contribution, and classified sales fees above 5%.

## Invoice reference editing

```json
{
  "currency": "USD",
  "provider_transaction_id": "ch_verified_payment_reference",
  "order_reference": "verified_printify_order_id"
}
```

All three keys are required for PATCH; each may be null to clear its value.
Currency is uppercase ISO code; references are 1–150 characters. Invoice ID is a
positive integer. The updated invoice has `id`, `name`, `amount`,
`payment_provider_name`, `created_at`, `updated_at`, plus these metadata fields.
Invoice creation also accepts the metadata as optional fields. Existing invoice
records are preserved with null metadata. An edit affects future reports, not
already saved snapshots. The ID/source reference must exist in processor data;
providing metadata alone does not establish a match.

## Scheduled reporting

```json
{
  "name": "Daily finance review",
  "enabled": true,
  "cadence_days": 1,
  "lookback_days": 7,
  "include_ai": false,
  "next_run_at": "2026-10-11T09:00:00Z"
}
```

All keys are required for POST/PATCH. Cadence/lookback each range from 1 to 31.
Choose a real future `next_run_at`; the sample date must be adjusted if it has
passed. Responses add `id`, `lease_until`, `last_error`, `created_at`, `updated_at`.
Lease timestamp is nullable. Active work rejects schedule edits with 409.

The backend checks due schedules every 30 seconds while a server instance is
running. A renewed database lease coordinates workers and restart recovery.
Each run analyzes complete UTC days before its scheduled slot. Missed slots are
skipped after one oldest-due run. Failed runs retry the same slot/request ID
after five minutes. Partial-source reports are saved and advance the schedule,
with a coverage message in `last_error` and source-failure notifications.
Requested AI failures also set `last_error` and create a notification while preserving the numeric report.
Disable schedules through the full PATCH body with `enabled: false`.

## In-app notifications

Each saved alert creates one notification, unique by report and alert ID.
Notification fields: `{ id, report_id, alert_id, message, severity, read, created_at }`.
Use GET with optional `unread=true`, limit 1–100, and offset >= 0. False/omitted
unread returns all notifications. PATCH changes only `read`. Alert acknowledgement
and notification read status are independent. No email/SMS/webhook is sent.

## Errors and retry behavior

- `400`: invalid input, date range, or future schedule timestamp.
- `401`: missing/invalid bearer JWT.
- `404`: invoice, report, alert, schedule, or notification not found.
- `409`: request ID conflict or edit of an active schedule.
- `500`: normalization, persistence, or unexpected backend failure.

Normalize `error` or `message` defensively. Keep previous results visible.
Explicit report retry reuses its request ID; there is no automatic frontend retry.
Invalid provider/AI output is never a source for fabricated numeric values.

## Deployment and configuration

Configure the external API origin and JWT in the new frontend; Vite environment
values are public, so provider secrets must stay on the backend. Cross-origin
access requires backend CORS or a same-origin proxy configured by deployment.

Backend setup requires PostgreSQL migrations and a generated Prisma client.
Provider credentials remain the existing Stripe/PayPal/Printify/Claude settings.
Additional settings:

| Setting | Meaning |
| --- | --- |
| `PRINTIFY_REPORT_CURRENCY` | Verified currency for returned order cost values; no default |
| `PRINTIFY_COST_BASIS` | `per_unit` or `line_total`, verified against the account/source cost semantics; no default |
| `FINANCE_SCHEDULER_ENABLED` | Set `false` to stop automatic schedule processing; enabled otherwise |

Without cost settings, receipts/reconciliation/history still work, while order
contribution stays unavailable. Incomplete legacy invoice metadata stays
unmatched until populated. Changing cost configuration affects new reports;
saved snapshots retain their original configuration.

Provider semantics are documented in the official [Printify API](https://developers.printify.com/),
[Stripe currency guide](https://docs.stripe.com/currencies), and
[PayPal event-code reference](https://developer.paypal.com/reports/reference/t-codes/).
