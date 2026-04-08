# Setup Guide

This file covers the external configuration needed to turn the starter into a real app.

## 1. Environment

Copy `.env.example` to `.env` and fill in the values you need.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Minimum useful setup:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
EXPO_PUBLIC_REVENUECAT_API_KEY=appl_xxxxx
EAS_PROJECT_ID=your-eas-project-id
```

## 2. Supabase

### Auth

Enable email/password auth in Supabase Auth settings.

Set your redirect URLs to match the app scheme. With the default scheme in this template:

- `starterx://login`
- `starterx://forgot-password`

If you change `EXPO_PUBLIC_APP_SCHEME`, update the redirect URLs to match.

### Profiles Table

Create the profile table used by `userService.ts`:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id);
```

### Storage Bucket

Create the avatars bucket:

```sql
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
```

Allow the authenticated user to manage their own files:

```sql
create policy "avatars_read"
on storage.objects
for select
using (bucket_id = 'avatars');

create policy "avatars_insert_own"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
);

create policy "avatars_update_own"
on storage.objects
for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
);
```

## 3. AI Proxy

The client never calls OpenAI directly. `aiService.ts` expects a secure backend endpoint.

Default request target:

- `POST {EXPO_PUBLIC_API_BASE_URL}/api/ai/prompt`

Expected JSON request:

```json
{
  "prompt": "Summarize the current screen",
  "systemPrompt": "You are a concise assistant.",
  "stream": true
}
```

Expected non-streaming response:

```json
{
  "id": "msg_123",
  "model": "gpt-5.4-mini",
  "text": "Summary text here"
}
```

Streaming support is implemented for newline-delimited JSON or SSE-style `data:` lines with chunks like:

```json
{ "delta": "partial text" }
```

## 4. RevenueCat

1. Create a RevenueCat project and app.
2. Copy the public SDK key into `EXPO_PUBLIC_REVENUECAT_API_KEY`.
3. Create at least one offering with packages.
4. Test purchases in a dev build or production build. Do not rely on Expo Go for final verification.

The starter uses:

- `paymentService.getOfferings()`
- `paymentService.purchasePackage()`
- `paymentService.restorePurchases()`
- `paymentService.getCustomerInfo()`

## 5. Push Notifications

### Expo / EAS

1. Initialize EAS if you have not already:

```bash
npx eas login
npx eas project:init
```

2. Put the resulting project id in `EAS_PROJECT_ID`.

3. Configure notification credentials for iOS and Android through Expo / EAS.

### Payload Deep Links

The app checks notification payload data for:

- `url`
- `route`

Example payload:

```json
{
  "to": "ExponentPushToken[xxxxxx]",
  "title": "Profile updated",
  "body": "Tap to open your account",
  "data": {
    "route": "/profile"
  }
}
```

If `EXPO_PUBLIC_API_BASE_URL` is set, the starter can also POST push tokens to:

- `{EXPO_PUBLIC_API_BASE_URL}/api/notifications/register`

## 6. Analytics

This starter includes a PostHog wrapper.

Set:

- `EXPO_PUBLIC_POSTHOG_KEY`
- `EXPO_PUBLIC_POSTHOG_HOST`

Then use:

- `analyticsService.trackEvent()`
- `analyticsService.identifyUser()`

## 7. OTA Updates

`useOtaUpdates.ts` checks for updates when the app becomes active.

Recommended workflow:

```bash
npx eas update --branch production --message "Initial production release"
```

If you do not want OTA checks enabled, set:

```env
EXPO_PUBLIC_ENABLE_OTA_UPDATES=false
```

## 8. Biometrics

Biometric support is optional and controlled by:

```env
EXPO_PUBLIC_ENABLE_BIOMETRICS=true
```

Users can toggle the setting from the profile screen. The app lock overlay appears when the app becomes active and biometric protection is enabled.

## 9. Dev Build Recommendation

For camera, notifications, and RevenueCat validation, create a dev build:

```bash
npx expo prebuild
npx expo run:android
```

or:

```bash
npx expo run:ios
```

`expo run:ios` requires macOS. For remote team workflows, EAS Build is the cleaner path.
