# Supabase production setup

This repository does not contain a project ID, owner email, service-role key, or database password.

## Apply migrations

Apply these files in order to a new database:

1. `001_algoyol.sql` — base types, learning/problem/duel tables, RLS.
2. `002_assign_owner.sql` — legacy migration retained for existing installations.
3. `003_mastery_roadmaps.sql` — original mastery/roadmap schema.
4. `004_owner_and_roles.sql` — legacy role helpers.
5. `005_production_foundation.sql` — current security, RBAC, mastery, placement, judge persistence, and duel foundation.

Migration 005 removes hard-coded owner behavior from the active bootstrap function. Assign the first owner through trusted Supabase `app_metadata` or a one-time audited database operation. Do not commit an email allowlist.

## Auth configuration

- Enable email confirmation.
- Enable Google only after setting its OAuth client credentials.
- Set the production Site URL.
- Add exact local and production callback URLs to the redirect allowlist.
- Keep leaked-password protection and appropriate password rules enabled.

## Environment separation

Browser-safe:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only:

- `SUPABASE_SERVICE_ROLE_KEY`
- `JUDGE0_URL`
- `JUDGE0_API_KEY`
- `JUDGE0_API_HOST`

The service-role key bypasses RLS. Store it only in the deployment secret manager and rotate it after suspected exposure.

## Staging checks before enabling Duel

- Two different accounts are paired once and cannot join two active duels.
- Only the current stage is returned.
- Only an Accepted persisted submission can claim a stage.
- Simultaneous Accepted submissions award the stage once.
- Elo history is written once and topic mastery remains separate.
- Expired duels finalize and queued entries expire.

Keep the seeded `duel.enabled` setting false until these checks pass.
