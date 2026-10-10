# Dashboard UI Requirements

Build the application according to the following requirements. Follow the repository's `AGENTS.md` instructions and reuse existing architecture, components, and authentication patterns.

## Application structure

The application must have two main views:

- **Login:** A simple page with a centered form containing username and password fields and a Login button.
- **Dashboard:** The authenticated view containing domain pages, navigation, and page content.

Validate required login fields, prevent duplicate submissions while authentication is in progress, and display friendly errors. Restrict dashboard access to authenticated users. On logout, end the session and return the user to the login page.

## Dashboard layout

Use a horizontal layout with a navigation sidebar on the left and the main content area on the right.

### Navigation sidebar

- Start expanded and provide a control to collapse and expand it.
- Include navigation links for every dashboard page, each with an icon and text label.
- Clearly indicate the active page.
- Keep navigation usable when collapsed, with accessible labels and tooltips for icon-only controls.
- Place the Logout button at the bottom.

### Main content area

- Organize content vertically, with navigation for the current page's sections at the top and the selected section's content below.
- Use tabs or another suitable design-system component for section navigation.
- Clearly indicate the active section.
- Keep the layout responsive and navigation usable on smaller screens.

## Domain pages and feature documentation

Each dashboard page represents a domain and groups its related features into clear sections.

Before implementing a page, read its `README.md`, `FEATURES.md`, and `DATA_CONTRACT.md`, where available. The shared feature documentation is located under `DASHBOARD_UI/BUILD_GUIDELINES/FEATURES/[PAGENAME]/`; also consult applicable page-specific documentation under `DASHBOARD_UI/[PAGENAME]/`.

- Implement the documented features and follow their API and data contracts.
- Preserve documented field names, data meanings, and calculations.
- Resolve conflicting requirements against the actual API contracts and repository instructions; clarify unresolved conflicts before implementing dependent behavior.

## Design and accessibility

- Use the project's design-system components wherever applicable.
- Follow established typography, spacing, colors, icons, and interaction patterns.
- Keep forms, navigation, and controls accessible through keyboard interaction, visible focus states, and meaningful labels.
- Provide clear loading, empty, success, and error states for applicable features.
- Respect reduced-motion preferences for animations, including shimmers and AI loading indicators.

## Loading states

### Data fetching

- Display skeleton placeholders with a shimmer effect while data is initially being fetched.
- Match placeholders to the expected content layout to minimize layout shifts.
- During background refreshes, preserve existing content where appropriate and show a subtle loading indicator.
- Scope loading indicators to the affected feature so unrelated content remains usable.

### AI generation

- Use a distinct loading state that clearly communicates that AI is generating or analyzing content.
- Include a recognizable visual indicator and concise status text, such as "Generating analysis…".
- Show this state during actual AI generation; use ordinary data-fetching states when retrieving previously generated results.
- Do not display fabricated progress percentages, stages, or completion estimates.
- Prevent duplicate generation requests while one is in progress.

For both loading types, announce status changes accessibly and transition to the resulting content, empty state, or error state when the operation finishes.

## Centralized error messages

Handle failures gracefully for every asynchronous operation, including login, logout, data fetching, mutations, and AI generation.

- Maintain one shared error-message mapping file using the structure `ERROR_ID -> MESSAGE_TO_DISPLAY`.
- All user-facing error messages, including validation errors and fallback messages, must come from this file. Do not hardcode error text in components or display raw provider or backend messages.
- Use stable error identifiers and map known API, network, authentication, validation, and AI-generation failures to the appropriate identifiers.
- Inspect the actual API error contracts before mapping failures. If an API does not return an error identifier, normalize its existing response in the appropriate client layer without changing the backend contract solely for this requirement.
- Define a friendly fallback message in the same mapping file for unknown or unmapped errors.
- Display messages near the affected form or feature, using the project's established alert or notification components.
- Preserve user input and existing content where possible, clear pending states after failures, and offer retry actions where safe and applicable.
- Keep technical diagnostics in the project's logging mechanism and exclude sensitive details from displayed messages.

## Completion criteria

- Login, authenticated navigation, section switching, sidebar collapse, and logout behave as specified.
- Domain pages follow their documented features and data contracts.
- Data fetching uses shimmer placeholders, and AI generation uses a distinct loading state.
- Every displayed error resolves through the shared error-message mapping, including unknown-error fallbacks.
- The interface remains usable across supported screen sizes and with keyboard navigation.
- Run the build and relevant existing checks for implementation changes. Documentation-only changes require a whitespace check.

# Design System Component Patterns

The design system combines typed Vue components, Tailwind utilities, shared theme tokens, and composition.

## 1. Typed Visual Variants

**Example:** `src/shared/components/Button/Button.vue`

Supported appearances are defined through a TypeScript union and a class map:

```ts
type VariantType = "search" | "ghost" | "error";

const variantClass: Record<VariantType, string> = {
  search:
    "bg-transparent text-white border border-border-subtle rounded-md hover:border-white transition-colors",
  ghost: "bg-transparent hover:opacity-80",
  error: "bg-red-primary text-white rounded-md hover:opacity-80",
};
```

`Record` requires a class entry for every variant. `Heading`, `Text`, `Chip`, and `Link` use the same pattern.

## 2. Base, Variant, and State Styles

**Example:** `src/shared/components/Button/Button.vue`

Components combine shared styles, variant styles, and conditional state styles:

```vue
<button
  :class="[
    'px-8 py-2 cursor-pointer',
    variantClass[variant],
    disabled && 'opacity-50 cursor-not-allowed',
  ]"
>
```

Base styles define structure, variant styles define appearance, and state styles reflect interaction state.

## 3. Typed Props, Defaults, and Events

**Example:** `src/shared/components/Button/Button.vue`

Components expose explicit contracts with sensible defaults:

```ts
interface Props {
  variant?: VariantType;
  ariaLabel: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const {
  variant = "search",
  ariaLabel,
  type = "button",
  disabled = false,
} = defineProps<Props>();

const emit = defineEmits<{
  click: [];
}>();
```

Props configure the component; events communicate actions to consumers.

## 4. Semantics Independent of Appearance

**Example:** `src/shared/components/Heading/Heading.vue`

An `as` prop selects the HTML element independently of the visual variant:

```vue
<component :is="as" :id="id" :class="variantClass[variant]">
  <slot />
</component>
```

Usage:

```vue
<Heading as="h1" variant="title">Browse shows</Heading>
<Heading as="h2" variant="title">Recommended</Heading>
```

Both headings share an appearance while preserving their semantic level. `Text` and `Chip` also use this pattern.

## 5. Centralized Theme Tokens

**Example:** `src/styles/main.css`

Shared design values are declared through Tailwind’s `@theme`:

```css
@theme {
  --font-display: "Inter", sans-serif;
  --color-red-primary: #9c1111;
  --color-bg-chip: #ffffff33;
  --color-border-subtle: #ffffff4d;
}
```

Components consume these values through utilities such as:

- `bg-red-primary`
- `bg-bg-chip`
- `border-border-subtle`

## 6. Slots and Component Composition

**Example:** `src/shared/components/ShowCard/ShowCard.vue`

Application components compose primitives and provide content through slots:

```vue
<Chip variant="rating" class="min-h-12">
  <StarIcon class="size-4 text-white" />
  <Text as="span" variant="banner">
    {{ item.rating.average ?? '-' }}
  </Text>
</Chip>

<Heading as="h3">{{ item.name }}</Heading>
```

Primitives own reusable presentation. `ShowCard` owns the TV-show data and its composition.

## 7. Native Elements and Two-Way Binding

**Example:** `src/shared/components/Input/Input.vue`

The input exposes a typed model:

```ts
const model = defineModel<string | number>();
```

It forwards configuration to a native HTML input:

```vue
<input
  :class="[variantClass[variant]]"
  :aria-label="ariaLabel"
  :type="type"
  :disabled="disabled"
  :placeholder="placeholder"
  v-model="model"
/>
```

`Button` similarly forwards accessibility and interaction attributes to a native button.

## 8. Colocated Contract Tests

**Example:** `src/shared/components/Button/Button.test.ts`

Tests verify the component’s public behavior:

```ts
const wrapper = mount(Button, {
  props: { ariaLabel: "Submit form" },
  slots: { default: "Submit" },
});

expect(wrapper.text()).toBe("Submit");
expect(wrapper.attributes("aria-label")).toBe("Submit form");
```

Tests live beside components and check rendering, attributes, events, and interaction states.
