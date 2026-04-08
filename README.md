<h1 align="center">StarterX</h1>

<p align="center">
  <strong>A production-ready Expo app template built for teams that want to ship real product, not spend a week wiring the same foundation together again.</strong>
</p>

<p align="center">
  Auth, profile management, subscriptions, AI proxying, push notifications, analytics, OTA updates, biometrics, feature flags, theming, and a clean mobile architecture are already in place.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2054-0B1220?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React_Native-0.81-0EA5E9?style=for-the-badge&logo=react&logoColor=white" alt="React Native 0.81" />
  <img src="https://img.shields.io/badge/React-19-111827?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-2563EB?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo_Router-File_Based-111827?style=flat-square" alt="Expo Router" />
  <img src="https://img.shields.io/badge/Supabase-Auth_%2B_Data-0F172A?style=flat-square&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
  <img src="https://img.shields.io/badge/React_Query-Server_State-E11D48?style=flat-square" alt="React Query" />
  <img src="https://img.shields.io/badge/Zustand-Client_State-7C2D12?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/NativeWind-Styling-0891B2?style=flat-square" alt="NativeWind" />
  <img src="https://img.shields.io/badge/RevenueCat-Subscriptions-F97316?style=flat-square" alt="RevenueCat" />
  <img src="https://img.shields.io/badge/PostHog-Analytics-F59E0B?style=flat-square" alt="PostHog" />
</p>

## Why This Template Hits Different

Most Expo starters give you a blank app and a dependency list.

This one gives you a working product foundation:

- Authentication screens with login, registration, email verification, password reset, and deep-link auth recovery handling
- Protected app routing with Expo Router route groups
- Supabase-ready profile bootstrap flow and typed service layer
- Avatar upload flow with image picking and storage support
- AI assistant example wired for a secure backend proxy
- RevenueCat subscription loading, purchase, restore, and entitlement status handling
- Push notification registration, listeners, background task registration, and deep-link navigation
- PostHog analytics wrapper with user identification and event tracking
- Biometric app lock flow with foreground re-authentication
- OTA update checks when the app becomes active
- Feature flag bootstrap with remote override support
- React Query for async state and Zustand for app state
- NativeWind styling, theme switching, reusable UI primitives, and global error fallback

## What You Get On Day One

| Area | Included |
| --- | --- |
| App shell | Expo Router, typed routes, splash handling, root providers, global error boundary |
| Auth | Email/password sign in, sign up, password reset, email verification redirects, session bootstrapping, session-aware navigation |
| User profile | Profile fetch/update flow, avatar upload example, secure state persistence, diagnostics screen |
| AI | Secure proxy contract, streaming support, typed payloads, demo assistant card |
| Payments | RevenueCat configuration, offerings fetch, purchase flow, restore purchases, active subscription snapshot |
| Notifications | Permission flow, Expo push token registration, token sync endpoint, background task registration, notification deep links |
| Security | SecureStore-backed persistence, optional biometric unlock, app re-lock on background |
| Product controls | Remote feature flags, analytics wrapper, environment-driven configuration |
| UX foundation | Light/dark/system theme support, shared screen/card/button/input primitives, loading and modal components |
| Delivery | OTA update hook, static web output support, Expo config plugins, EAS-ready config surface |

## Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Expo Router
- NativeWind
- Zustand
- TanStack React Query
- React Hook Form + Zod
- Supabase
- RevenueCat
- Expo Notifications
- Expo Secure Store
- Expo Updates
- PostHog

## Project Architecture

```text
app/
  (auth)/                Auth screens and recovery flow
  (app)/                 Protected app screens
  _layout.tsx            Root navigation + error boundary

features/
  auth/                  Auth hooks, schemas, provider
  user/                  Profile hooks, schemas, UI
  ai/                    AI schemas, hooks, demo card
  payments/              Subscription hooks and UI

services/                Business logic and third-party orchestration
lib/                     Client setup and shared adapters
components/ui/           Reusable UI primitives
components/shared/       Shared app shell components
hooks/                   App-wide behavior hooks
store/                   Zustand stores
constants/               Routes, theme, env, query keys, flags
types/                   Shared domain and API types
```

## Architecture Rules

- Route files stay thin and compose feature modules instead of owning business logic.
- External SDK setup lives in `lib/`.
- Domain workflows live in `services/`.
- Feature-specific hooks and schemas stay with the feature that owns them.
- Remote state lives in React Query.
- Global app state lives in Zustand.
- Sensitive AI work is proxied through your backend, not shipped from the client.

## Quick Start

```bash
npm install
```

Then configure your `.env` values and start the app:

```bash
npm run start
```

Validate the template with:

```bash
npm run typecheck
npm run lint
```

For camera, notifications, purchases, and other native-heavy flows, use a dev build instead of relying on Expo Go for final verification.

## Environment Variables That Matter

Core app configuration:

- `EXPO_PUBLIC_APP_NAME`
- `EXPO_PUBLIC_APP_SLUG`
- `EXPO_PUBLIC_APP_SCHEME`
- `APP_ENV`
- `IOS_BUNDLE_IDENTIFIER`
- `ANDROID_PACKAGE`
- `EAS_PROJECT_ID`

Backend and platform integrations:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_AI_PROXY_PATH`
- `EXPO_PUBLIC_FEATURE_FLAGS_PATH`
- `EXPO_PUBLIC_NOTIFICATION_REGISTRATION_PATH`
- `EXPO_PUBLIC_REVENUECAT_API_KEY`
- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`
- `EXPO_PUBLIC_SENTRY_DSN`

Runtime toggles:

- `EXPO_PUBLIC_DEFAULT_THEME`
- `EXPO_PUBLIC_ENABLE_ANALYTICS`
- `EXPO_PUBLIC_ENABLE_BIOMETRICS`
- `EXPO_PUBLIC_ENABLE_OTA_UPDATES`

## Feature Highlights

### Auth That Feels Finished

- Login, registration, and forgot-password screens are already built
- Deep-link handling supports signup verification and password recovery flows
- Session state is bootstrapped on launch and reflected in router navigation automatically
- Secure storage is used for persisted app state

### Profile Foundation Included

- Profile fetch and update hooks are wired
- Avatar picker uploads user images through the profile flow
- The profile screen doubles as a useful integration test surface for auth, storage, biometrics, and notifications

### AI Without Leaking Secrets

- The app never calls OpenAI directly from the client
- The included AI service targets your backend proxy endpoint
- Streaming responses are supported for newline-delimited JSON and SSE-style `data:` chunks

### Monetization Ready

- RevenueCat setup is abstracted behind a payment service
- Offerings, package purchases, restore purchases, and entitlement state are already modeled
- The included subscription card gives you a working reference implementation

### Push Notifications With Real App Behavior

- Permission requests and Expo push token registration are wired
- Notification responses can deep-link directly into app routes
- Background task registration is already included
- Push tokens can be synced to your backend if `EXPO_PUBLIC_API_BASE_URL` is configured

### Security, Updates, and Product Controls

- Optional biometric unlock is built in
- OTA update checks can run when the app becomes active
- Feature flags can be loaded remotely and merged into app state
- Analytics initialization and identity tracking are wrapped in a dedicated service

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run lint:fix
npm run typecheck
npm run format
npm run format:write
```

## Setup Guides

- Full integration setup: [setup.md](./setup.md)
- External services covered there: Supabase, AI proxy contract, RevenueCat, push notifications, analytics, OTA updates, and biometrics

## Best Fit

StarterX is a strong fit if you want to launch:

- a SaaS mobile app
- an AI-enabled product
- a subscription app
- a client project that needs auth and backend wiring fast
- a serious prototype that should not be rewritten after validation

## Final Note

This template is opinionated in the right places:

- thin screens
- feature-first modules
- service-driven side effects
- typed boundaries
- production-minded mobile integrations

If you want a starter that already behaves like an app, not a demo, this is the one.
