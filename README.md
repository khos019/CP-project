# AlgoYo‘l

Bilingual Uzbek/English competitive-programming learning platform with roadmaps, problems, C++/Python judging, sequential duels, Elo ratings, and role-based administration.

## Local development

1. Copy `.env.example` to `.env.local` and fill in Supabase and Judge0 values.
2. Apply the migrations in `supabase/migrations/` in order (`001` → `007`) to the Supabase project.
3. Run `npm install` and `npm run dev` (on Windows, set `WRANGLER_LOG_PATH` first and run `npm exec vinext dev`).

Without credentials, authentication and judging use an explicitly labeled demo mode. Never expose the Supabase service-role key or Judge0 key to client code.

## Production configuration

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public Supabase client settings.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only administrative operations.
- `OWNER_EMAIL`: verified email promoted to owner by the profile bootstrap trigger.
- `JUDGE0_URL`, `JUDGE0_API_KEY`, `JUDGE0_API_HOST`: isolated code-execution service.
- `NEXT_PUBLIC_SITE_URL`: canonical deployed origin used for social metadata.

Run `npm run build` and `node --test tests/rendered-html.test.mjs` before deployment. The HTTP tests need a
running server; point them at it with `TEST_BASE_URL` (the dev server listens on `http://localhost:3000`).

## Profile identity (migration 007)

`supabase/migrations/007_profile_identity.sql` adds the `bio` and `country` columns and creates the public
`avatars` storage bucket with per-account write isolation. The app capability-detects both, so it runs
correctly before the migration is applied — the bio/location fields and the avatar upload stay disabled with
an on-screen explanation rather than failing when saved. Apply it to switch them on.

## Account state

A visitor who has not signed in is a guest: no profile is created, nothing is written to storage, and the
protected screens (`/profile`, `/admin`, `/placement`) show a sign-in prompt instead of account-shaped UI.
Learner state (progress, mastery, duel history) is namespaced per account id under `algoyol:<id>:<key>`, and
signing out removes that namespace, so two people sharing a browser never see each other’s work. Work done
while signed out is carried into the account once, on first sign-in.

## Email confirmation

In Supabase Authentication → Providers → Email, enable **Confirm Email**. In Authentication → URL Configuration, set the Site URL to `NEXT_PUBLIC_SITE_URL` and allow both the production URL and `http://localhost:3001/` during development. The signup screen sends a confirmation link, blocks unverified login, handles the returned session, and supports resending the message.
