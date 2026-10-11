# Finance dashboard UI

Standalone Vue specifications for a frontend consuming the finance API.

- [Features](FEATURES.md): screens, interactions, and acceptance criteria.
- [Data contract](DATA_CONTRACT.md): endpoints, bodies, response fields, and configuration.

Suggested layout: UTC date controls, source coverage, currency-specific receipt
cards, daily charts, transactions, reconciliation, fulfillment and contribution,
product allocation, AI insights, saved reports, schedules, and notifications.

Generate reports explicitly. Reuse their response for charts, sorting, filtering,
and CSV exports. Scheduled reports use complete UTC days and create saved
snapshots; reopening them does not call providers or AI again.

Configure an external API origin and bearer JWT. Keep provider credentials and
Printify cost configuration on the backend. All links resolve within the imported
documentation; no backend source checkout is required.

Use the [Vue guidelines](../../../AGENTS/README.md) and
[architecture conventions](../../../AGENTS/ARQUITECTURE-PATTERNS.md). Those source
paths describe files to create in the new frontend project.
