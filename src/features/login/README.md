# Login UI preview

## Purpose and structure

[LoginView](../../views/LoginView.vue) composes [LoginBrand](ui/components/LoginBrand.vue), [LoginForm](ui/components/LoginForm.vue), and dashboard-preview navigation. The form displays username/password inputs, required-field validation, a Login button, and a notice after valid submission. It uses shared design-system components and centralized validation messages.

The user explicitly deferred authentication implementation. This feature sends no credentials, calls no endpoint, creates no session, and does not guard dashboard routes. The sidebar logout action clears the manually supplied connection token/query cache and returns to this preview; it is not an authentication backend operation.

## Public contracts and dependencies

The form owns local username, password, error, and submitted state. It exposes no props/events or authentication composable. Neither it nor the brand depends on another feature. The view uses Vue Router to open `/analytics`; components use Vue, Lucide icons, and shared primitives/theme tokens. No backend or environment configuration is required for the preview.

## States, validation, and recovery

Submitting empty fields displays `ERROR_MESSAGES.REQUIRED` and retains entered input. Valid submission displays the preview notice. There is no network loading state or retry because no authentication request occurs. Inputs expose username/current-password autocomplete and invalid state, and the form remains keyboard accessible.

## Verification and limitations

Run root `npm run typecheck`, `npm run lint`, `npm run verify:patterns`, and `npm run build`. `npm run test:e2e` checks navigation, required fields, and the preview notice with Chrome. Production authentication, duplicate-request handling, session expiry, route guards, and backend logout require the later authentication contract and implementation. Do not treat this form or manually entered finance bearer tokens as completed login functionality.
