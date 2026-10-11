# Vue Architecture and Design System Patterns

These conventions apply to the new frontend project. Paths describe the intended
source structure to create; they do not refer to files in the original repository.
Use the detailed [Vue guidelines](README.md) alongside this document.

## Folder Structure

```text
src/
├── main.ts / App.vue / router.ts
├── views/                         # Route-level composition
├── layouts/                       # Shared page shells
├── features/
│   └── analyticsDashboard/
│       ├── ui/
│       │   ├── sections/          # Dashboard sections
│       │   └── components/        # Feature components and their tests
│       └── lib/
│           ├── types/             # Request, response, and view contracts
│           ├── composables/       # Reactive state and workflows
│           ├── queries/           # Query or mutation configuration
│           ├── services/          # API calls and orchestration
│           ├── mappers/           # API-to-view transformations
│           ├── helpers/           # Pure calculations
│           └── constants/         # Static feature configuration
├── shared/
│   ├── ui/                        # Generic design system components
│   └── lib/                       # Shared clients, utilities, and types
├── styles/                        # Theme tokens and global styles
└── test/                          # Shared test setup
```

Create folders when their responsibilities are needed. Use direct file imports;
do not introduce barrel exports. Configure `@/` to resolve to `src/` in the
bundler and TypeScript configuration.

## Responsibilities and Dependencies

Views compose features and choose loading, error, empty, or success presentation.
Layouts own common page structure. Features own their application capability;
shared modules remain independent of feature implementations.

Keep extracted non-component code in `lib/`. Component-specific props, events,
variant maps, and small setup handlers belong inside their SFC. Each `.vue` file
defines one component. Colocate component tests and private child components.
Coordinate independent features through a view or explicit composition layer.

For the analytics dashboard, follow this flow:

```text
Shared API client → feature service → request composable → view → UI components
                                              ↓
                                      response/view mapper
```

Generate analysis through an explicit action. The review POST persists results,
so automatic background refetch or retries are inappropriate. Keep existing
results visible while another request is pending. Reuse the returned data for
charts, tables, exports, and insights.

## Design System Patterns

### Central Theme

Define shared typography, colors, surfaces, borders, spacing, and gradients in
the new project's theme. With Tailwind, expose shared design decisions as theme
tokens and consume them through utility classes or CSS variables. Local layout
values can remain component-specific.

### Generic Primitives and Domain Composition

Build generic primitives such as `Button`, `Input`, `Heading`, text components,
and `Chip` under `shared/ui/`. Keep report cards, chart panels, and insight lists
inside the analytics feature. Compose larger UI from smaller components rather
than placing fetching or business behavior in primitives.

### Typed Variants

Declare supported variants as TypeScript unions and map them to utility classes.
Use only declared variants. Extend the typed contract when a reusable treatment
is needed; consumer classes should primarily control placement and layout.
Prefer names describing reusable appearance or behavior.

### Semantics and Accessibility

Allow typography semantics to vary independently of appearance where useful.
Use native interactive elements inside primitives. A chip becomes a filter
control through a button wrapper with contextual state such as `aria-pressed`.
Use typed props, `defineEmits`, slots, and `defineModel` for component contracts.

Primitives own basic accessible interaction; consumers own meaningful labels,
heading order, focus flows, and contextual ARIA state. Provide keyboard access,
reduced-motion support, and table alternatives for charts.

### Responsive and Loading Presentation

Use responsive utility classes and maintain readable tables and charts on small
screens. Loading placeholders should mirror loaded layouts. Keep unavailable
values distinct from zero, and follow the API contract for units and currencies.

## Verification

Use Vitest and Vue Test Utils for meaningful component and composable behavior.
Run the new project's configured type-check, lint, and build commands. Check
request contracts, error normalization, date handling, and preservation of the
last successful result. A component catalog may be added when useful; none is
assumed to exist in the imported documentation.
