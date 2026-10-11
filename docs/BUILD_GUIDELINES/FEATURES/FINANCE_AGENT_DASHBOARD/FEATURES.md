# Finance dashboard features

Use the [data contract](DATA_CONTRACT.md) for exact requests and returned fields.

## 1. Request controls and source coverage — first release

Provide inclusive UTC dates, optional AI review, and explicit Generate report.
Use the report POST with a fresh `request_id`; preserve it during explicit retry.

Acceptance criteria:

- Validate real dates and a 1–31-day ordered range.
- Prevent duplicate clicks and keep the last successful report with its original dates.
- Show every `dashboard.coverage` source and its record count or failure.
- A failed source is unavailable, not zero. A complete empty source has no reported records.
- Display partial-source warnings next to affected totals, not only in a tooltip.
- Show `costConfiguration` so unavailable contribution can be explained.

## 2. Receipt overview and daily charts — first release

Use `dashboard.summaries`, `dailySeries`, and `trends`. Show classified sales,
refunds, known processing fees, and net receipts separately for each currency.

Acceptance criteria:

- Format integer minor units using the returned currency/fraction digits.
- Net receipts is unavailable when included fees are missing; known fees remain
  a partial total. Preserve negative fee reversals.
- Keep payouts and unclassified activity separate from receipts.
- Preserve all calendar-day rows. A missing currency group can be zero only
  when the corresponding source coverage is complete.
- Show comparison dates and use `trends.comparable` to enable badges. Null
  percentage change means no percentage baseline, not zero growth.
- Provide chart tables, keyboard-accessible controls, and exact-date tooltips.
- Never combine currencies or call receipt totals company profit.

## 3. Transaction explorer — first release

Render `dashboard.transactions` with local provider, currency, category, status,
date, and ID filters. Show original `reference` and normalized `paymentReference`
in a details panel.

Acceptance criteria:

- Stable row identity includes provider, ID, date, and category.
- Keep nullable fees/references distinct from zero or an empty string.
- Sorting, filtering, and export do not regenerate the report.
- Export scope and currency units are explicit; neutralize CSV formula cells.

## 4. Reconciliation workspace — second release

Render `dashboard.invoices` with invoice/payment/order references, amount,
currency, `matchStatus`, `transactionId`, and the returned reason.

Acceptance criteria:

- Distinguish matched, unmatched, duplicate, amount mismatch, currency mismatch,
  and status mismatch. Preserve every record and its explanation.
- Exact matching uses provider plus an explicit transaction ID/source reference;
  do not introduce fuzzy amount/date matching in the browser.
- Offer an authenticated reference-edit form using the invoice PATCH endpoint.
  Populate currency/reference only from verified records, not a guessed match.
- Clear metadata through explicit null values when needed. After editing, keep
  the saved report immutable; generating a new report recomputes reconciliation.
- Do not add invoice totals to processor sales totals.

## 5. Fulfillment and order contribution — second release

Show `dashboard.orders`, `orderMetrics`, and `contributionSummaries`: fulfillment status,
timestamps, exact invoice/payment match, production/shipping/tax costs, retrieved
refunds, processing fees, contribution, and margin.

Acceptance criteria:

- Label `profitMinor` as **Order contribution**. It excludes overhead and
  unlinked adjustments and is not net business profit.
- Display `limitation` for every unavailable or qualified calculation.
- Require unique matches, complete payment/reference coverage, known fees, and
  matching configured cost currency/basis before rendering contribution.
- `totalPriceMinor` is Printify retail price; never use it as production cost.
- Costs come from line cost/shipping fields and the declared basis. Never
  multiply quantities again in the frontend.
- Null duration or contribution is unavailable, not zero. Flag negative contribution.
- Currency-specific summary cards cover eligible matched orders only; show their count.

## 6. Product contribution explorer — second release

Use `dashboard.products` to sort/search products by ID, name, currency, quantity,
order count, allocated receipts/refunds/fees, production cost, and contribution.

Acceptance criteria:

- Clearly label revenue and shared costs as **Allocated by retail weight**.
- Allocation preserves eligible order totals but is not a measured product
  payment amount. Do not describe it as audited product profitability.
- Keep products separated by currency and identified by product ID.
- Missing/zero retail weights exclude an order from product allocation; a missing
  product row does not mean the product had zero contribution.
- Never sum product allocation and order contribution into another revenue total.

## 7. Current balances — second release

Render `dashboard.balances` with `balanceAsOf` and currency-specific available
and pending amounts.

Acceptance criteria:

- Label balances as current snapshots, not historical period balances.
- Failed balance retrieval displays unavailable rather than zero.

## 8. AI financial review — second release

Render `insights.overview`, findings, recommendations, evidence, and limitations.
Resolve each evidence entry through the report's `evidence` dictionary.

Acceptance criteria:

- Identify AI-generated text and render it as plain text.
- Link supported evidence IDs to summary, contribution, or coverage panels;
  show the dictionary label, value, and unit. Do not invent record links.
- Distinguish `not_requested`, `complete`, and `failed` without hiding numeric data.
- Numeric cards come from deterministic metrics, not model-generated prose.
- Retain source and measurement limitations beside recommendations.

## 9. Saved reports, alerts, and notifications — second release

Use report list/detail routes for immutable snapshots. Merge `alertReviews` by
`alert_id`; persist acknowledgement through the alert PATCH endpoint.

Use notification list/PATCH routes for an in-app inbox with read/unread state.

Acceptance criteria:

- Reopening history never regenerates data; show original dates/time/version.
- Alert acknowledgement means reviewed, not corrected. Notification read state
  is separate from alert acknowledgement.
- Explain the fee threshold (5% of a classified sale) and refund/contribution alerts.
- A notification opens its `report_id`; preserve missing-report error handling.
- Update UI only after a successful save or revert optimistic state on failure.
- Pagination, empty lists, failed requests, and expired authentication have useful states.

## 10. Scheduled reporting — third release

Provide a schedule list/editor for name, enabled state, cadence days, lookback
days, optional AI, and next execution timestamp. Use schedule POST/PATCH/GET.

Acceptance criteria:

- Cadence and lookback are each 1–31 days; next execution must be in the future.
- Show UTC next-run time and `last_error`; an active lease indicates running work.
- Disable a schedule using `enabled: false` and an otherwise valid full input.
- A running schedule returns 409 on edit; allow retry after completion.
- Scheduled reports cover complete days before the scheduled execution date.
- The backend executes the oldest due slot once, skips missed cadence slots,
  and uses a stable request ID on failure retry. Do not imply a report for every missed slot.
- Notifications are stored in the in-app inbox. Email, SMS, and external webhook
  delivery are not part of this API.

## Data-dependent limitations

Legacy invoices without payment references or currency remain unmatched until
metadata is provided. Missing cost configuration prevents contribution totals.
Refunds outside the selected retrieval window and unlinked adjustments are not
included in order contribution. FX conversion, overhead accounting, and external
notification delivery require additional contracts and are not exposed here.
