# Imaginary Builder AI - Vue Documentation

This documentation defines the architectural patterns, coding standards, and best practices for the Vue 3 frontend of Imaginary Builder AI. Use Single-File Components (SFCs), the Composition API, and `<script setup lang="ts">`. This is a standalone guide for a new frontend project. All source paths are target conventions or illustrative examples, not dependencies on the original repository.

## Table of Contents

- [Types & Interfaces](#types--interfaces)
- [Components](#components)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)
- [General Guidelines](#general-guidelines)

---

## Types & Interfaces

### Type Definitions

- **All data must be typed** - Define explicit contracts for props, events, models, API boundaries, and shared data. Allow TypeScript to infer local values when the type is clear.
- **Keep database types aligned with their schemas** - When generated API or database contracts are available to the new project, derive matching types from them. Otherwise define frontend contracts from the included API specification. Use explicit API types and mappers when frontend data has a different shape.
- **Type organization**:
  - Feature-specific types: `src/features/[feature-name]/lib/types/`
  - Shared types: `src/shared/lib/types/`
- **Naming convention**: All type names must include the `Type` suffix.
  - Example: `UserType`, `ProductType`, `ConfigType`

### Interface Definitions

- **Component interfaces**: Define interfaces directly in component files.
- **Props interfaces**: When an interface is specific to a single component, name it `PropsI`.
- **Shared interfaces**: Place in appropriate shared locations with descriptive names.
- **Component events**: Use typed `defineEmits` for actions instead of callback props.
- **Two-way binding**: Use typed `defineModel` with `v-model` when the component owns a model contract.

**Example:**

```typescript
// Component-specific props
interface PropsI {
  title: string;
  disabled?: boolean;
}

// Shared type
type UserType = {
  id: string;
  name: string;
  email: string;
};
```

---

## Components

### Core Principles

All components must adhere to these three principles:

1. **Single Responsibility Principle (SRP)** - Each component should have one clear purpose.
2. **DRY (Don't Repeat Yourself)** - Avoid code duplication by extracting reusable logic.
3. **Atomicity** - Components should be as small and focused as possible.

### Component Guidelines

- **Use the design system**: Always use components from `@/shared/ui/` instead of raw HTML elements. This ensures consistent typography, spacing, and styling across the application.

  | HTML Element                           | Design System Component | Import                                |
  | -------------------------------------- | ----------------------- | ------------------------------------- |
  | `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>` | `<Heading>`             | `@/shared/ui/Heading/Heading.vue`     |
  | `<p>`                                  | `<Paragraph>`           | `@/shared/ui/Paragraph/Paragraph.vue` |
  | `<span>` (labels, badges, meta text)   | `<Span>`                | `@/shared/ui/Span/Span.vue`           |
  | `<button>`                             | `<Button>`              | `@/shared/ui/Button/Button.vue`       |
  | `<input>`                              | `<Input>`               | `@/shared/ui/Input/Input.vue`         |
  | `<textarea>`                           | `<Textarea>`            | `@/shared/ui/Textarea/Textarea.vue`   |
  | `<select>`                             | `<Select>`              | `@/shared/ui/Select/Select.vue`       |
  | `<label>`                              | `<Label>`               | `@/shared/ui/Label/Label.vue`         |
  | `<input type="checkbox">`              | `<Checkbox>`            | `@/shared/ui/Checkbox/Checkbox.vue`   |
  | `<ul>`, `<ol>`                         | `<List>`                | `@/shared/ui/List/List.vue`           |
  | `<hr>`                                 | `<Separator>`           | `@/shared/ui/Separator/Separator.vue` |
  | `<img>`                                | `<Image>`               | `@/shared/ui/Image/Image.vue`         |

  **Exception**: Only use raw HTML elements when:
  - Building a new design system component
  - The design system doesn't have a suitable component (rare)
  - Structural and semantic containers such as `main`, `section`, `nav`, `div`, and `form`

  The paths above define the component convention; use components that actually exist, and add missing primitives only when needed. Vue does not require an image framework component: a shared `Image` may wrap a native `img`.

- **Styling approach**:
  - Prefer component `variants` for styling.
  - Only add custom styles when absolutely necessary for specific use cases.
  - **Avoid inline styles** - use Tailwind classes instead. Only use inline `style` attributes for dynamic values that cannot be expressed with Tailwind (e.g., animation delays, dynamic widths from state).
- **Reactivity**: Use `ref` for mutable state and `computed` for derived state. Use `watch` for side effects and keep computed getters free of mutations.
- **Accessibility**: Preserve native semantics, meaningful labels, keyboard interaction, focus behavior, and contextual ARIA state in shared components and their consumers.

### File & Component Atomicity

**Each `.vue` file defines one component.** Extract child components into separate SFCs and group related components in a named folder.

```text
src/features/homepage/ui/components/ProcessTimeline/
├── ProcessStickyCarousel.vue
├── ProcessStepper.vue
├── ProcessStepCard.vue
└── ProcessStepImage.vue
```

```vue
<!-- ProcessStepper.vue -->
<script setup lang="ts">
interface PropsI {
  activeStepIndex: number;
  totalSteps: number;
}

const props = defineProps<PropsI>();
const emit = defineEmits<{ select: [index: number] }>();
</script>

<template>
  <nav aria-label="Process steps">
    <button
      v-for="step in props.totalSteps"
      :key="step"
      type="button"
      :aria-label="`Go to step ${step}`"
      :aria-current="step - 1 === props.activeStepIndex ? 'step' : undefined"
      @click="emit('select', step - 1)"
    >
      {{ step }}
    </button>
  </nav>
</template>
```

The native button illustrates the primitive implementation. Application consumers use the shared `Button` when available.

```vue
<!-- ProcessStickyCarousel.vue -->
<script setup lang="ts">
import { ref } from "vue";
import ProcessStepper from "./ProcessStepper.vue";

const activeStepIndex = ref(0);
</script>

<template>
  <ProcessStepper
    :active-step-index="activeStepIndex"
    :total-steps="5"
    @select="activeStepIndex = $event"
  />
</template>
```

Separate files make components easier to test, navigate, reuse, and inspect through explicit imports.

### Keep Complex Logic Out of Templates

Use a single blank line between logical code statements and declarations, keeping related imports together. Separate sibling template elements and Vue SFC blocks with a blank line. Keep opening/closing tags on their own lines rather than joining adjacent components. Do not add blank lines between every attribute or every line of a multiline expression. Run `npm run format` to apply the spacing convention; `npm run lint` enforces it.

Do not define table columns, navigation/tab items, select options, or export-context objects inline in template bindings. Static feature configuration belongs in named, explicitly typed exports under the owning feature's `lib/constants/`. Import those constants directly. Derive reactive configuration with named computed values in script setup or the owning composable and bind the resulting names. For example, use `:columns="PRODUCT_CONTRIBUTION_COLUMNS"` rather than an inline array of column objects. Run `npm run verify:patterns` to enforce this rule across generated components.

Use `v-for` for rendering and a stable data identifier for `:key`. Move complex calculations into pure helpers and derive render data with `computed`. Filter data before rendering instead of combining `v-if` and `v-for` on the same element.

```typescript
// lib/types/animation.ts
export type AnimationDataType = {
  opacity: number;
  translateY: number;
  isVisible: boolean;
};
```

```typescript
// lib/helpers/computeAnimation.ts
import type { AnimationDataType } from "../types/animation";

export function computeAnimation(
  index: number,
  activeIndex: number,
  progress: number,
): AnimationDataType {
  const isActive = index === activeIndex;
  const isNext = index === activeIndex + 1;

  return {
    opacity: isActive ? 1 - progress : isNext ? progress : 0,
    translateY: isActive ? -40 * progress : isNext ? 40 * (1 - progress) : 0,
    isVisible: Math.abs(index - activeIndex) <= 1,
  };
}
```

```vue
<script setup lang="ts">
import { computed } from "vue";
import StepCard from "./StepCard.vue";
import { computeAnimation } from "../../../lib/helpers/computeAnimation";

interface PropsI {
  items: { id: string; title: string }[];
  activeIndex: number;
  progress: number;
}

const props = defineProps<PropsI>();

const visibleSteps = computed(() =>
  props.items
    .map((item, index) => ({
      item,
      animation: computeAnimation(index, props.activeIndex, props.progress),
    }))
    .filter(({ animation }) => animation.isVisible),
);
</script>

<template>
  <StepCard
    v-for="step in visibleSteps"
    :key="step.item.id"
    :item="step.item"
    :animation="step.animation"
  />
</template>
```

`StepCard` owns the rendering of its animation props. Dynamic transforms and opacity may use `:style`; static appearance belongs in variants and classes.

### Design System Variants

```vue
<template>
  <Button variant="primary" size="lg">Submit</Button>
</template>
```

Use only declared variants. Extend a primitive's typed contract when a reusable visual treatment is needed. Keep theme tokens centralized and use consumer classes for surrounding layout rather than repeated overrides of the primitive's appearance.

---

## Architecture & Folder Structure

### Feature-Sliced Design (FSD)

The frontend uses a **feature-oriented architecture inspired by Feature-Sliced Design**, with explicit UI and non-UI boundaries.

- **Feature structure**:
  ```
  src/features/[feature-name]/
  ├── ui/              # UI components only
  │   ├── sections/    # Page sections
  │   └── components/  # Reusable components
  ├── lib/             # Non-component code
  │   ├── helpers/     # Helper functions
  │   ├── constants/   # Constants and static data
  │   ├── types/       # Feature-specific types
  │   ├── composables/ # Reactive Vue behavior
  │   ├── mappers/     # Data transformation functions
  │   ├── queries/     # Data fetching and caching definitions
  │   ├── services/    # Business logic services
  │   └── utils/       # Utility functions
  ```

### Separation of Concerns in Folders

**IMPORTANT**: Keep a strict separation between UI and non-UI code:

1. **`ui/` folder**: Contains Vue components (`.vue` files) and colocated component tests
   - Components organized in subfolders by purpose
   - Component-specific `PropsI`, event definitions, variant maps, and small setup handlers may live inside the SFC
   - Extract reusable helpers, constants, types, and reactive workflows into `lib/`

2. **`lib/` folder**: Contains extracted non-component code
   - `helpers/` - Pure functions for computations (e.g., animation calculations)
   - `constants/` - Static data and configuration
   - `types/` - TypeScript type definitions
   - `composables/` - Vue Composition API functions, named `useSomething`
   - `mappers/` - Data transformation functions
   - `services/` - Business logic and external integrations
   - `utils/` - Generic utility functions

#### Bad Example

```
// ❌ BAD: Helper file inside component folder
src/features/homepage/ui/components/ProcessTimeline/
├── ProcessStickyCarousel.vue
├── ProcessStepper.vue
└── processAnimationHelpers.ts   # Wrong location!
```

#### Good Example

```
// ✅ GOOD: Helper in lib/helpers, components in ui/components
src/features/homepage/
├── ui/
│   └── components/
│       └── ProcessTimeline/
│           ├── ProcessStickyCarousel.vue
│           └── ProcessStepper.vue
└── lib/
    └── helpers/
        └── processAnimationHelpers.ts
```

### Core Architecture Layers

The project is organized into three primary layers:

1. **UI Layer** (`src/features/*/ui/`) - Components and page sections
2. **State and Queries Layer** (`src/features/*/lib/composables/` and `lib/queries/`) - Reactive behavior, fetching, and caching
3. **Services Layer** (`src/features/*/lib/services/`) - Business workflows and external integrations

Shared clients and generic infrastructure belong in `src/shared/lib/`. Views compose features; shared code must not depend on feature implementations. Use Pinia for shared client state when needed, and the query library selected for the new project for server state. Keep feature-specific queries and services with their owning feature.

### File Organization

- Keep features self-contained and decoupled.
- Share common utilities in `src/shared/`.
- Follow consistent naming conventions across features.
- **Keep extracted non-component modules in `lib/`**, while retaining component-local contracts and setup logic in their SFC.

---

## Performance Optimization

- Use `computed` for derived reactive values as normal application design; it is not reserved for performance optimization.
- Profile before adding `v-memo`, `shallowRef`, `markRaw`, or other targeted optimizations. These tools change update behavior and require a clear reason.
- Keep list keys stable; consider virtualization for measured large-list bottlenecks.
- Clean up timers, listeners, and subscriptions with `onUnmounted` or `onScopeDispose`. Register lifecycle hooks synchronously during setup.
- Cancel obsolete requests with the query library selected for the new project or `AbortController`, and prevent stale responses from overwriting newer state.
- Measure first, optimize second.

---

## Error Handling

### Core Principles

- Implement a shared API error normalizer in the new project, following the status codes and payloads in the included data contract.
- Errors should be caught at appropriate boundaries.
- User-facing errors must provide clear, actionable messages.
- Always provide recovery paths for users when errors occur.

### Error Handling Patterns

#### 1. **Payment & Transaction Errors**

For payment processing, implement comprehensive error states with recovery mechanisms:

**Required Error States:**

- `loading` - Initial state, verifying data
- `processing` - Payment being processed
- `success` - Transaction completed successfully
- `failed` - Retryable failure (declined card, insufficient funds)
- `error` - Non-retryable system error
- `cancelled` - User cancelled the transaction

**Example Pattern** (from payment return pages):

```typescript
import { ref } from "vue";

type PageStatusType =
  | "loading"
  | "processing"
  | "success"
  | "failed"
  | "error"
  | "cancelled";

const status = ref<PageStatusType>("loading");
const errorMessage = ref<string | null>(null);

// Handle different error types
if (captureData.code === "INSTRUMENT_DECLINED" || captureData.isRetryable) {
  status.value = "failed"; // Retryable - show "Try Again" option
  errorMessage.value = captureData.error || "Your payment method was declined.";
} else {
  status.value = "error"; // Non-retryable - show support contact
  errorMessage.value = "Failed to process payment. Please contact support.";
}
```

**User-Facing Error UI:**

- Display clear error reason
- Provide actionable next steps
- Show alternative payment methods for failed payments
- Include support contact information for system errors

#### 2. **Timeout Handling**

Implement timeouts for long-running operations with proper cleanup:

```typescript
class PipelineTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(
      `Operation timed out after ${Math.round(timeoutMs / 1000)} seconds. ` +
        `Please contact support if the issue persists.`,
    );
    this.name = "PipelineTimeoutError";
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new PipelineTimeoutError(ms)), ms);
  });

  return Promise.race([promise, timeout]).finally(
    () => timeoutId !== undefined && clearTimeout(timeoutId),
  );
}

// Usage inside an async workflow
try {
  await withTimeout(longRunningOperation(), 120_000); // 2 minutes
} catch (error) {
  if (error instanceof PipelineTimeoutError) {
    // Handle timeout specifically
    await triggerCleanup();
  }
  throw error;
}
```

The timeout rejects the waiting promise; it does not cancel the underlying operation. Use an abort signal when supported and coordinate cleanup with the operation.

#### 3. **Data Validation Errors**

Validate critical data early and provide clear error messages:

```typescript
// Inside an async action; cartId and user are validated input values
if (!cartId) {
  status.value = "error";
  errorMessage.value =
    "Cart information not found. Your payment was captured but we couldn't create your order. " +
    "Please contact support with payment ID: " +
    paymentIntentId;
  return;
}

if (!user) {
  status.value = "error";
  errorMessage.value =
    "You must be logged in to complete your order. Please log in and try again.";
  return;
}
```

### Logging System Pattern

When implementing logging in features, follow this structured approach:

1. **Create feature-specific loggers** with consistent context prefixes
2. **Use three log levels**:
   - `logError()` - For exceptions and critical failures
   - `logWarning()` - For recoverable issues or unexpected states
   - `logInfo()` - For debugging and tracing execution flow
3. **Always include**:
   - Context (function/component name)
   - Relevant data for debugging
   - Structured additional info as objects

**Illustrative feature logger**:

```typescript
// lib/helpers/logger.ts
export function logFeatureError(
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>,
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[Feature Flow - ${context}]`, {
    error: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    ...additionalInfo,
  });
}

// Usage in components/composables
logFeatureError("handleCreateProduct", error, {
  blueprintId: formData.blueprintId,
  userId: user?.id,
});
```

This example is self-contained. Place a logger in the owning feature or shared infrastructure when several features use it.

### Error Handling Checklist

When implementing error handling, ensure:

- ✅ All possible error states are defined and handled
- ✅ User-facing errors provide clear, actionable messages
- ✅ Recovery mechanisms are in place (retry, refund, rollback)
- ✅ Idempotency is implemented for critical operations
- ✅ Timeouts are set for long-running operations
- ✅ Errors are logged with sufficient context for debugging
- ✅ Race conditions are prevented with proper locks
- ✅ Cleanup operations run in finally blocks
- ✅ Users have clear paths forward (retry, contact support, go back)

---

## General Guidelines

- **Documentation**: Do not create new markdown files for every change. Update existing documentation when appropriate.
- **Code reviews**: Follow established patterns in the codebase.
- **Consistency**: Maintain consistency with the Feature-Sliced Design architecture.
- **No barrel exports**: Do not use `index.ts` files for re-exporting. Import directly from specific files instead of using barrel files. This makes dependency ownership explicit and helps avoid accidental circular dependencies.

---

## Contributing

## Implementing and Updating Features

When adding a feature or modifying existing code:

1. Inspect nearby implementations and follow the project's established architecture, naming, and design system conventions.
2. Keep responsibilities clear: components render UI, composables manage reactive behavior, services coordinate external operations, and mappers transform data.
3. Define typed contracts for props, events, models, and API boundaries. Reuse existing types and allow inference for straightforward local values.
4. Handle loading, empty, success, and error states. Preserve accessibility, keyboard interaction, and responsive behavior.
5. Run the configured type-check, lint, build, and relevant tests. Use `vue-tsc` for SFC checking and Vitest with Vue Test Utils for component behavior.
6. Report what changed, what was verified, and any remaining limitations. Never claim a check passed unless it was executed successfully.

### Substantial Features

For features introducing a new page, workflow, large dataset, or significant interaction:

- Create Playwright acceptance tests covering the integrated user journey, a meaningful failure path, and recovery.
- Test user-visible behavior rather than internal implementation details. Prefer accessible locators and deterministic fixtures.
- Profile representative interactions and memory usage under realistic data volumes.
- Check for unnecessary requests, expensive rendering, and retained timers, listeners, subscriptions, or detached components.
- Fix confirmed regressions and record the profiling scenario and results. Do not introduce speculative optimizations.

### Feature Documentation

Every new feature must include a `README.md` in its feature directory describing:

- Its purpose and supported user flows.
- Its implementation structure and ownership boundaries.
- Its public component, composable, and data contracts.
- Required configuration, dependencies, and API endpoints.
- Loading, error, and recovery behavior.
- How to run its tests and any known limitations.

Update the README when behavior or contracts change. Keep documentation portable: links must resolve within the project, examples must be self-contained, and proposed capabilities must be clearly distinguished from implemented behavior.

### Resolving Uncertainty

Use existing implementations and project documentation to resolve routine choices. Ask for clarification only when a missing requirement materially affects behavior, scope, or an external contract. Continue independent work while clarification is pending.

Substantial component logic must always be extracted into a named `use...` composable. This includes multi-step workflows, reactive data preparation, filtering and sorting, validation, preference handling, and asynchronous orchestration, even when only one component uses it. Keep feature behavior in `src/features/<feature>/lib/composables/` and domain-independent behavior in `src/shared/lib/composables/`. Components retain props, emits, rendering, and small UI handlers. Preserve prop reactivity when passing inputs to composables; do not copy reactive props into nonreactive snapshots. Keep pure transformations in helpers or mappers and static configuration in constants, called or consumed by the composable as needed. Review added and modified code against this rule before completing an implementation.

Keep route views focused on composing features and choosing loading, error, empty, and success states. Extract page headers, forms, report workspaces, and section selection into focused feature components with typed props, models, and events. Place route-level workflows in the owning feature composable; avoid large templates and business logic in views.

Prioritize decoupling when designing composables. A composable may aggregate more than three features or distinct capabilities only when they share actual state or data required by those workflows. Keep unrelated capabilities in separate, focused composables, even when fewer than four are involved. Being used by the same component, belonging to the same domain, or using the same API client is not sufficient justification for aggregation. Use explicit, minimal reactive inputs and return only the state and actions needed by consumers. Compose related workflows through a thin orchestration composable when coordination is necessary, rather than building a general-purpose feature container. Count capabilities, not individual refs, computed values, or functions. Review shared-state dependencies before expanding a composable.
