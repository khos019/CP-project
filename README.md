# AlgoYo‘l

Bilingual Uzbek/English competitive-programming learning platform with roadmaps, problems, C++/Python judging, sequential duels, Elo ratings, and role-based administration.

## Local development

1. Copy `.env.example` to `.env.local` and fill in Supabase and Judge0 values.
2. Apply `supabase/migrations/001_algoyol.sql` to the Supabase project.
3. Run `npm install` and `npm run dev` (on Windows, set `WRANGLER_LOG_PATH` first and run `npm exec vinext dev`).

Without credentials, authentication and judging use an explicitly labeled demo mode. Never expose the Supabase service-role key or Judge0 key to client code.

## Production configuration

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public Supabase client settings.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only administrative operations.
- `OWNER_EMAIL`: verified email promoted to owner by the profile bootstrap trigger.
- `JUDGE0_URL`, `JUDGE0_API_KEY`, `JUDGE0_API_HOST`: isolated code-execution service.
- `NEXT_PUBLIC_SITE_URL`: canonical deployed origin used for social metadata.

Run `npm run build` and `node --test tests/rendered-html.test.mjs` before deployment.

## Email confirmation

In Supabase Authentication → Providers → Email, enable **Confirm Email**. In Authentication → URL Configuration, set the Site URL to `NEXT_PUBLIC_SITE_URL` and allow both the production URL and `http://localhost:3001/` during development. The signup screen sends a confirmation link, blocks unverified login, handles the returned session, and supports resending the message.
