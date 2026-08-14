# AlgoYo‘l

AlgoYo‘l is a bilingual Uzbek/English algorithm-learning platform built around one loop:

**Learn → Practice → Duel → Prove skill → Unlock harder knowledge**

The repository uses Next.js/React through Vinext, Supabase Auth/Postgres/RLS, Cloudflare Workers, and a private Judge0-compatible execution service.

## What is implemented

- 15 cloud/path roadmaps with 90 learning units and original bilingual lesson structure.
- Server-owned topic mastery, permanent unlock evidence, placement, and strict quiz + Accepted completion.
- C++20/Python problem judging with hidden tests, input limits, authenticated persistence, and idempotent evidence.
- Atomic 1v1 matchmaking, staged problem claims, separate Elo settlement, and realtime-ready database tables.
- Email/password and Google authentication with first-login placement.
- Owner/admin/user RBAC, submission-source privacy, audited role/suspension/settings mutations.
- Real leaderboard, account dashboard, loading/error/empty states, responsive layout, keyboard focus, and reduced-motion support.

## Local development

Requirements: Node.js 22.13+ and a Supabase project.

1. Copy `.env.example` to `.env.local` and fill every required value.
2. Apply `supabase/migrations/001_algoyol.sql` through `005_production_foundation.sql` in order.
3. Configure Supabase Auth URLs for your local and production origins.
4. Run `npm ci` and `npm run dev`.

No authentication, Judge0, mastery, duel, or leaderboard operation falls back to fake/demo data. If secure server configuration is missing, the relevant API returns an explicit error.

## Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public Supabase settings.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only persistence and protected reads.
- `JUDGE0_URL`: private Judge0-compatible endpoint.
- `JUDGE0_API_KEY`, `JUDGE0_API_HOST`: optional provider credentials.
- `NEXT_PUBLIC_SITE_URL`: canonical public origin.

Never expose the service-role or Judge0 key through `NEXT_PUBLIC_*` variables.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm audit --omit=dev
```

`npm test` builds the production app, starts an isolated local server, checks public rendering and protected APIs, and verifies critical migration invariants.

## Production rollout

1. Back up the database and apply migration `005_production_foundation.sql` in staging.
2. Run the smoke tests with `TEST_BASE_URL=https://staging.example npm test`.
3. Set all secrets in Cloudflare/GitHub; never place them in the repository.
4. Keep `platform_settings.duel.enabled=false` until two-account matchmaking and Judge0 have passed staging QA.
5. Enable Duel through the protected owner settings path after verification.
