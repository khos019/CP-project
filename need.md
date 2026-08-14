# AlgoYo‘l — repository-aware production implementation prompt

You are the senior engineer responsible for continuing an **existing** product named
**AlgoYo‘l**. Work directly in the repository you were given. Inspect the code before
making decisions, preserve working behavior, and implement real functionality rather
than a visual simulation.

The product's primary UI language is Uzbek. English is a supported secondary language.

## 1. Mission

Turn the current AlgoYo‘l prototype into a trustworthy, production-ready algorithm
learning platform where structured learning and competitive practice reinforce each
other.

The core loop is:

**LEARN → PRACTICE → DUEL → PROVE SKILL → IMPROVE → UNLOCK**

AlgoYo‘l is not a contest clone, generic LMS, SaaS dashboard, or esports game. Do not
add features only because Codeforces, LeetCode, or another platform has them.

## 2. Current repository baseline — verify it, do not blindly trust it

At the time this prompt was written, the repository appeared to use:

- Next.js 16 and React 19;
- TypeScript;
- Vinext/Vite targeting Cloudflare Workers;
- Supabase migrations for authentication and product data;
- Judge0 through `app/api/judge/route.ts`;
- static roadmap definitions/content in `app/ui/roadmap-data.ts` and
  `app/ui/roadmap-content.ts`;
- a large client component in `app/ui/AlgoYolApp.tsx`;
- browser `localStorage` for some progress, mastery, submissions, onboarding, and duel
  state;
- simulated duel behavior and some demo/fallback UI;
- only limited automated tests.

Treat this list as orientation, not immutable truth. Inspect the current branch, file
tree, package scripts, migrations, routes, environment contract, and tests first.

Known risk areas that must be checked explicitly:

- mojibake/broken UTF-8 text such as `OвЂ...` in user-visible copy;
- client-owned rating, mastery, role, unlock, and completion state;
- fake or simulated behavior presented as live behavior;
- frontend permission checks without equivalent server/database authorization;
- direct Supabase REST calls spread across UI components;
- secrets or privileged keys accidentally exposed to the client;
- old migrations being edited instead of adding safe forward migrations;
- README claims that do not match the implementation.

## 3. Operating contract

1. Inspect before editing. Read the relevant implementation, migrations, tests, and
   configuration.
2. Use the existing stack. Do not migrate frameworks or replace working infrastructure
   without a demonstrated need.
3. Preserve user data and stable public URLs. Use additive, reversible migrations.
4. Never rewrite or delete an already-applied migration. Add a new numbered migration.
5. Never expose `SUPABASE_SERVICE_ROLE_KEY`, Judge0 credentials, or other server secrets
   in client code or `NEXT_PUBLIC_*` variables.
6. Do not use `localStorage` as the authoritative store for identity, permissions,
   ratings, mastery, submissions, unlocks, or duel results. It may only cache harmless
   UI preferences such as language or draft code.
7. Frontend hiding is not authorization. Enforce sensitive rules in server code and
   Supabase RLS/policies as appropriate.
8. Do not invent success. If a backend capability is absent, either implement it or
   label it honestly as unavailable. Never present bots, timers, counters, users, live
   duels, rankings, or analytics as real when they are fabricated.
9. Do not replace working features with placeholders, mock data, or non-functional
   buttons.
10. Keep changes cohesive and reviewable. Avoid a repository-wide rewrite when an
    incremental implementation is safer.
11. Do not stop after producing a plan. Implement the highest-priority incomplete phase
    that can be completed correctly in the current run.
12. Do not claim the whole product is production-ready unless every acceptance check in
    this document is actually satisfied.

## 4. Required first step: evidence-based audit

Before implementation, make a concise internal inventory with three labels:

- **Working** — real implementation exists and is connected end to end;
- **Partial/demo** — UI or local behavior exists but lacks production persistence,
  security, realtime behavior, or complete integration;
- **Missing** — no implementation exists.

Audit at least:

- routing and rendering model;
- authentication and session handling;
- Supabase schema, triggers, RLS, and role assignment;
- API routes and server-only secrets;
- roadmaps, units, quizzes, and progress;
- problem bank, submissions, hidden tests, and Judge0 integration;
- topic mastery and event deduplication;
- placement assessment;
- duel matchmaking, realtime state, result settlement, and rating;
- profile, rankings, admin/owner tools, and audit logs;
- localization and text encoding;
- responsive behavior and accessibility;
- automated tests and deployment configuration.

Use repository evidence. Do not infer that a feature is real merely because a component
or database table has its name.

## 5. Implementation priority

Work in this order. Finish and verify one phase before widening scope. If the current
repository already completes a phase, prove it with code/tests and move to the next.

### Phase A — truthful and stable baseline

- Fix all user-visible encoding corruption without damaging valid Uzbek text.
- Make build, lint, and existing tests pass.
- Remove or clearly label fabricated production claims and fake live statistics.
- Align `.env.example`, README, runtime validation, and deployment configuration.
- Preserve the current visual identity while fixing obvious functional regressions.

### Phase B — authentication and server authorization

- Implement reliable Supabase session handling suitable for the current Next/Vinext
  deployment model.
- Require verified authentication for protected learning, submission, duel, profile,
  and management operations.
- Enforce `owner`, `admin`, and `user` permissions on the server and through RLS.
- Use granular admin permissions. Admin is not automatically equivalent to owner.
- Ensure users cannot promote themselves, alter another user's progress, or read another
  user's private submission source.
- Add tests for all important authorization boundaries.

### Phase C — server-authoritative learning and mastery

- Persist roadmap progress, quiz/checkpoint evidence, topic mastery, unlocks, and
  completion in Supabase.
- Centralize mastery calculation in one server-side domain service.
- Record immutable/idempotent mastery events so replaying the same evidence cannot farm
  points.
- Backfill existing users only from real historical evidence; do not invent scores.
- Keep **study progress** separate from **topic mastery**.
- Keep **topic mastery** separate from **global duel rating**.
- Make unlocks persistent: once legitimately unlocked, a topic must not automatically
  relock after a later score change.

### Phase D — real problem/submission flow

- Keep Judge0 credentials server-only.
- Validate problem ID, language, source size, authentication, and rate limits server-side.
- Never return hidden test inputs or expected outputs to ordinary users.
- Persist submissions and verdict metadata under the authenticated user.
- Award mastery only from a verified accepted result and only once per eligible evidence
  rule.
- Provide accurate loading, compilation error, runtime error, wrong answer, timeout, and
  service failure states.

### Phase E — placement and learning experience

- Let a new user choose between placement and starting from the beginning.
- Produce topic-specific starting mastery, not only one global beginner/intermediate
  label.
- Use approximately 8–12 adaptive knowledge questions and 2–4 coding tasks when the
  current data model supports them.
- Treat self-reported experience only as question-selection context, never as mastery
  evidence.
- Allow experienced users to challenge a locked topic and validate knowledge through
  real assessment.
- Improve weak roadmap content in natural, technically correct Uzbek; keep established
  terms such as Binary Search, DFS, BFS, Greedy, and Dynamic Programming where natural.

### Phase F — real duel system

- Do not call a client-side bot simulation a live duel.
- Implement authenticated matchmaking, a server-owned match state, equal problem sets,
  authoritative timing, submission verification, result settlement, and reconnect
  behavior.
- Use existing realtime infrastructure if it is sound; otherwise add the smallest
  compatible backend mechanism.
- Settle each match exactly once and make the operation idempotent.
- Keep opponent source code private.
- Update global duel rating from the match result using the existing verified algorithm.
- Update topic mastery separately from each verified problem solve.
- If realtime duel cannot yet be implemented safely, disable the production CTA and
  state the limitation honestly instead of shipping a fake experience.

### Phase G — owner/admin operations and observability

- Separate the management experience from the learner interface.
- Owner can manage users, admin permissions, roadmaps, content, problems, hidden tests,
  thresholds, and platform settings.
- Admin sees and can perform only explicitly granted actions.
- Audit sensitive changes with actor, action, target, timestamp, and useful before/after
  data.
- Add actionable server logging without recording secrets or full private source code.

### Phase H — product polish

- Improve mobile layouts intentionally at 390, 768, 1024, 1280, and 1440 widths.
- Add semantic HTML, keyboard support, visible focus, correct labels, sufficient
  contrast, non-color status indicators, and reduced-motion support.
- Add loading, empty, offline/retry, permission-denied, and error states.
- Optimize large roadmap/content payloads, judge polling, management tables, and
  realtime updates.

## 6. Product rules that must remain true

### 6.1 Roadmap identity

The existing cloud/path roadmap is part of AlgoYo‘l's identity. Preserve its general
geometry, top-to-bottom learning direction, node/cloud relationship, and interaction
model.

You may improve typography, spacing, colors, responsive behavior, accessibility,
status indicators, tooltips, subtle animation, study progress, and mastery display.

Do not replace it with a generic card list, vertical timeline, tree diagram, game map,
sidebar curriculum, or a copy of another site's roadmap.

### 6.2 Separate measurements

Use three distinct concepts:

1. **Study progress** — content completed, for example `6 / 10 units`.
2. **Topic mastery** — evidence-backed competence per topic, preferably on a configurable
   `0–1000` scale.
3. **Global duel rating** — competitive rating used for matchmaking and leaderboard.

Never update all three from one generic counter.

A user may have high mastery with low study progress because they arrived experienced.
A user may have high study progress but only moderate mastery because independent
evidence is still weak.

### 6.3 Mastery evidence

Valid evidence may come from:

- a passed quiz or checkpoint;
- an eligible first accepted problem solve;
- a verified duel solve;
- placement assessment;
- a topic challenge.

Opening a lesson is not mastery. Repeating the same accepted submission must not yield
the full reward repeatedly. Wrong attempts should not aggressively punish learning.
Problem-to-topic mapping should support one primary topic and optional weighted
secondary topics.

Unlock and completion thresholds must be configurable, not scattered as magic numbers.
Unlocking and completing are different states.

### 6.4 Roles

- **Owner:** superuser; may manage users, admins, permissions, content, problems, hidden
  tests, settings, thresholds, and moderation.
- **Admin:** has an explicitly granted permission set and cannot self-promote, remove the
  owner, read secrets, or erase audit history.
- **User:** may learn, assess, solve, duel, and view their own private activity; cannot
  administer the platform or alter authoritative results.

Destructive owner actions require clear confirmation. Sensitive API operations must
authorize on the server.

### 6.5 Guest behavior

Guests may access public marketing information, roadmap previews, sample problem
descriptions, and optionally a public leaderboard. Authentication is required before
saving progress, opening protected full lessons, taking assessments, submitting code,
joining matchmaking, starting a duel, or viewing private profile data.

### 6.6 Content quality

Every substantial topic should contain only the units that add learning value, selected
from:

- goal and prerequisites;
- intuition and core concept;
- important vocabulary;
- visual or step-by-step explanation;
- time/space complexity with reasoning;
- a small worked example;
- clean C++ and/or Python implementation;
- walkthrough and common mistakes;
- pattern recognition guidance;
- quiz, guided practice, independent practice, checkpoint, recap, and next step.

Do not generate filler to inflate lesson count. Use original material. External sources
may inform facts and learning order, but do not copy their prose or problem statements.

## 7. UI direction

Keep the existing AlgoYo‘l brand when it works. The product should feel technical,
focused, calm, premium, and competitive without looking like a game.

Avoid generic AI/SaaS styling:

- purple gradients and gradient text;
- glassmorphism everywhere;
- giant blurred blobs or neon glows;
- excessive shadows, huge rounded cards, or a card around every paragraph;
- fake charts, decorative metrics, random emojis, and esports visuals;
- large marketing heroes inside the authenticated product.

Prefer clear hierarchy, compact spacing, strong typography, meaningful borders, readable
code, restrained motion, and consistent semantic colors. Use icons/text in addition to
color for status. Common interaction motion should be subtle and respect
`prefers-reduced-motion`.

The authenticated home must answer with real data:

- What should I learn next?
- What is my current study progress and topic mastery?
- What can I practice now?
- Can I enter a real duel?
- How have I improved?

Do not show fabricated recommendations or activity counts.

## 8. Data and security invariants

The browser must never be trusted to submit authoritative values for:

- role or permissions;
- rating or rating delta;
- mastery score or delta;
- duel winner, timer, or final result;
- accepted verdict or solved state;
- roadmap unlock/completion;
- placement result;
- another user's identity.

Use database constraints, transactions/RPCs where appropriate, RLS, authenticated server
routes, and idempotency keys to enforce invariants. Consider concurrency: duplicate
requests, judge retries, duel reconnects, and two result-settlement calls must not create
double rewards.

## 9. Testing and verification

Add focused tests alongside implementation. At minimum, the final system needs evidence
for these behaviors:

- guest cannot submit, start a duel, or mutate protected progress;
- user cannot read another user's private submission source;
- admin without a permission is denied;
- admin with a permission succeeds;
- owner-only actions reject non-owners;
- client-supplied rating/mastery/result values are ignored or rejected;
- a verified accepted solve records one eligible mastery event;
- replaying the same evidence does not farm mastery;
- duel rating and topic mastery update independently;
- a valid mastery threshold can unlock a topic;
- an unlocked topic does not automatically relock;
- placement seeds topic-specific mastery once;
- hidden test data is never returned to normal users;
- Uzbek text renders without mojibake;
- critical layouts remain usable on mobile and keyboard navigation works.

Before reporting completion, run the repository's actual commands. At the current
baseline these are expected to include:

```bash
npm run lint
npm run build
npm test
```

If a command cannot run because an external credential/service is unavailable, do not
silently skip it. Run every safe local check, explain the exact dependency, and provide
the precise command/environment needed to complete verification.

## 10. Required completion report

At the end of each run, report only evidence-based results:

1. what was implemented;
2. which files/migrations changed;
3. what tests/checks ran and their exact outcome;
4. what remains partial, demo-only, disabled, or missing;
5. any deployment or migration steps the owner must perform;
6. the next highest-priority implementation slice.

Do not say “production-ready,” “fully secure,” “realtime,” or “complete” unless the code
and tests prove that claim.

## 11. Definition of done for the product

AlgoYo‘l is complete only when:

- the cloud/path roadmap remains recognizable and accessible;
- learning progress, topic mastery, and global duel rating are separate;
- mastery is based on server-verified, deduplicated evidence;
- real problem solves and real duel solves update the correct topics;
- experienced users can start through placement or topic validation;
- persisted unlocks never accidentally relock;
- authentication, RLS, and server authorization protect every sensitive action;
- owner/admin permissions are real and auditable;
- hidden tests, secrets, and private submissions remain private;
- the duel is genuinely realtime and server-authoritative, or is honestly disabled until
  it is;
- Uzbek and English UI copy is valid and readable;
- no fake metrics or mock functionality is presented as real;
- migrations are safe for existing users;
- lint, build, automated tests, and the critical manual flows pass.

The product principle to preserve is:

**AlgoYo‘l rewards demonstrated knowledge. Learning and competition are connected, but
their measurements remain truthful and distinct.**
