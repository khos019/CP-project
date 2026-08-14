# ALGoyo‘l — COMPLETE PRODUCT REDESIGN AND PLATFORM EVOLUTION

You are acting as:

* a senior product designer,
* senior UX architect,
* senior frontend engineer,
* senior backend engineer,
* competitive programming curriculum architect,
* learning-platform architect,
* and security/RBAC engineer.

You are working on an EXISTING platform called **AlgoYo‘l**.

Your goal is NOT to rebuild AlgoYo‘l from scratch.

Your goal is to inspect the existing repository, understand all existing architecture and functionality, preserve the parts that must remain unchanged, and evolve the current application into a polished, production-quality algorithm-learning and competitive-programming platform.

You must treat the existing repository as the source of truth.

---

# 0. VERY IMPORTANT: DO NOT MISUNDERSTAND THE PRODUCT

AlgoYo‘l is NOT primarily a contest platform.

Do NOT turn it into:

* Codeforces,
* AtCoder,
* LeetCode contests,
* HackerRank,
* or a generic online judge.

Do NOT add contests merely because other competitive-programming websites have them.

AlgoYo‘l has its own product identity.

The central product loop is:

**LEARN → PRACTICE → DUEL → PROVE SKILL → IMPROVE → UNLOCK HARDER KNOWLEDGE**

The main product systems are:

Roadmaps → structured learning

Problem Bank → independent practice

Duel → real-time 1v1 competitive testing

Skill Mastery → topic-specific competence

Global Rating → competitive identity

Profile → evidence of growth

These systems must feel connected rather than being independent pages.

---

# 1. FIRST INSPECT THE EXISTING PROJECT

Before modifying code, inspect:

* framework
* frontend stack
* backend stack
* routing
* authentication
* database models
* migrations
* user roles
* existing roadmap models
* roadmap sections
* roadmap topics
* roadmap progress
* lessons/resources
* problem models
* problem tags/topics
* submissions
* judge integration
* test cases
* duel architecture
* duel matchmaking
* duel result calculation
* current rating algorithm
* user profiles
* admin functionality
* owner functionality
* existing reusable components
* current styles
* localization
* API endpoints
* authorization middleware/policies
* realtime infrastructure if present

Do NOT assume the project uses a particular framework.

Adapt the implementation to the existing architecture.

Do NOT migrate the application to another frontend/backend framework unless absolutely necessary.

Do NOT replace working infrastructure just because another implementation would be easier.

Create a git checkpoint/branch before major changes when git is available.

After inspection, continue implementing autonomously.

Do not stop after giving me a plan.

---

# 2. ABSOLUTE NO-CHANGE ROADMAP RULE

This is one of the most important requirements.

The existing roadmap has a visual learning structure where roadmap items/topics are displayed in a cloud-like/path-like layout progressing from top to bottom.

DO NOT redesign that visual structure.

DO NOT replace it with:

* a vertical timeline,
* generic cards,
* roadmap.sh clone,
* tree diagram,
* game map,
* sidebar lesson list,
* or another site's roadmap UI.

Preserve the existing cloud/path visual identity.

Preserve:

* its general geometry,
* top-to-bottom learning direction,
* node/cloud idea,
* existing visual relationship between sections,
* the interaction model where possible.

You MAY improve:

* typography
* spacing
* colors
* hover states
* accessibility
* status indicators
* responsive behavior
* subtle animation
* mastery indicators
* tooltips
* progress representation

But the fundamental cloud/path concept MUST stay.

This existing roadmap visualization is part of AlgoYo‘l's identity.

---

# 3. PRESERVE THE EXISTING INFORMATION ARCHITECTURE BY DEFAULT

Do not restructure major sections merely to make AlgoYo‘l look like another programming website.

The existing main structure should remain unless there is an objectively superior UX solution for a specific screen.

Never change structure just because:

"LeetCode does it this way"

or

"roadmap.sh does it this way."

References are inspiration, not templates.

If the existing page structure works well, preserve it and improve:

* hierarchy
* spacing
* typography
* navigation clarity
* interactions
* mobile UX
* visual quality

Prefer evolution over unnecessary restructuring.

---

# 4. PRODUCT IDENTITY

AlgoYo‘l should feel like:

**a focused algorithm-learning platform with a serious competitive layer.**

It should NOT feel like:

* a generic LMS,
* a school portal,
* a SaaS analytics dashboard,
* an esports game,
* a cryptocurrency dashboard,
* a LeetCode clone,
* a Codeforces clone.

Core emotional journey:

"I learn something."

"I practice it."

"I prove that I understand it."

"I compete against another programmer."

"My skill rating changes."

"I unlock harder material."

"I can clearly see that I am becoming stronger."

---

# 5. CORE PLATFORM SYSTEMS

The platform revolves around:

## ROADMAPS

Learn algorithms systematically.

## PROBLEM BANK

Practice independently.

## DUEL

Compete against another real user.

## TOPIC MASTERY

Measure real skill per algorithm/topic.

## GLOBAL DUEL RATING

Measure competitive performance.

## PROFILE / PROGRESS

Show long-term growth.

All systems must exchange data.

For example:

A Binary Search problem solved in Problem Bank should affect Binary Search mastery.

A Binary Search problem solved during a Duel should also affect Binary Search mastery.

Completing Binary Search lessons and passing quizzes should affect Binary Search mastery.

A sufficiently strong Binary Search mastery score may unlock later Binary Search-related roadmap content even if the user reached that knowledge through independent practice.

---

# 6. VERY IMPORTANT: DO NOT USE ONE RATING FOR EVERYTHING

Implement separate concepts.

## A. GLOBAL DUEL RATING

This is the user's main competitive rating.

Example:

1428
Specialist

Use it for:

* Duel matchmaking
* global ranking
* competitive tier
* profile identity

Global Duel Rating changes according to Duel results and the EXISTING rating algorithm.

Do NOT invent a replacement rating algorithm unless the repository currently has none.

If one exists, preserve it.

---

# 7. TOPIC MASTERY RATING

Every meaningful learning topic should have its own user-specific mastery rating.

Examples:

Binary Search
742 / 1000

Graphs
421 / 1000

Dynamic Programming
188 / 1000

Greedy
611 / 1000

Prefix Sum
830 / 1000

Call this concept in Uzbek UI something natural such as:

**Mahorat**

or

**Mavzu mahorati**

Do not visually confuse it with Global Duel Rating.

Recommended internal scale:

0–1000.

But implement thresholds as configurable database values rather than hard-coded constants.

Possible semantic interpretation:

0–199:
Not started / minimal evidence

200–399:
Basic familiarity

400–599:
Working knowledge

600–749:
Competent

750–899:
Strong

900–1000:
Advanced mastery

These exact labels and thresholds should be configurable.

---

# 8. ROADMAP MASTERY

Each roadmap should also have an aggregate mastery score.

Do not maintain it as an unrelated manually incremented value.

Calculate it from its topics.

For example:

Algorithms Fundamentals

Roadmap Mastery
684 / 1000

Study Progress
72%

These two values are intentionally different.

A user might have:

Study Progress: 45%

Mastery: 760

because they already knew the material before joining AlgoYo‘l.

Another user might have:

Study Progress: 90%

Mastery: 520

because they read most lessons but still struggle with independent problems.

This distinction is essential.

---

# 9. STUDY PROGRESS IS NOT MASTERY

Keep study progress separately.

Example:

12 / 16 lessons completed

75%

Learning Progress measures:

"What content did the user go through?"

Mastery measures:

"How much evidence do we have that the user understands it?"

Do not increase mastery simply because someone opened a page.

Reading a lesson should only contribute meaningfully when there is evidence such as:

* completing the unit,
* quiz success,
* knowledge check,
* guided exercise,
* checkpoint,
* successful related problem.

This prevents mastery farming.

---

# 10. MASTERY EVIDENCE SYSTEM

Topic Mastery should be affected by multiple types of evidence.

Create a clean mastery service instead of updating scores randomly throughout controllers/components.

Possible evidence sources:

### Learning evidence

* lesson completed
* quiz completed
* checkpoint passed
* interactive exercise completed

### Problem Bank evidence

* first successful solve
* difficulty of problem
* topic relevance
* number of attempts
* whether hints/editorial were used if such information exists

### Duel evidence

* solving a topic-related problem during a live Duel
* difficulty relative to current mastery
* time taken
* first accepted result

### Placement evidence

* diagnostic assessment
* coding challenge
* challenge-out test

Maintain an auditable mastery-event history when practical.

---

# 11. PROBLEM → TOPIC MAPPING

Every problem must have reliable topic metadata.

Prefer:

primary topic

plus optional secondary topics.

Example:

Problem:
Factory Machines

Primary:
Binary Search on Answer

Secondary:
Binary Search

If the existing tag architecture already supports this, extend it instead of rebuilding it.

If necessary add topic weights.

Example:

Binary Search on Answer: 1.0

Binary Search: 0.5

A problem solved should therefore update the most relevant skill rather than every loosely related tag equally.

---

# 12. DO NOT LET USERS FARM MASTERY

Repeatedly solving the exact same problem must not repeatedly produce full mastery rewards.

Recommended behavior:

First meaningful Accepted submission:
full evidence

Repeated accepted submissions:
little or no mastery gain

A new problem:
meaningful evidence

A harder new problem:
stronger evidence

A trivial problem far below the user's mastery:
small evidence

A difficult problem above the user's current mastery:
strong evidence when solved

Do not punish experimentation.

Wrong answers during learning should not destroy the user's mastery score.

Incorrect attempts can affect confidence/evidence calculations, but learning should remain encouraging.

Global Duel Rating already handles competitive winning and losing.

---

# 13. DUEL RESULT VS TOPIC MASTERY

Global Duel Rating and Topic Mastery must update differently.

Example:

Muhammad loses a Duel.

Global Duel Rating:
1450 → 1432
-18

But during the Duel he successfully solves:

Binary Search problem
Graph BFS problem

Therefore he may still receive:

Binary Search Mastery
+24

BFS Mastery
+18

This is correct.

Losing a Duel does not mean the user learned nothing.

The Duel winner/loser result controls Global Duel Rating.

Individual problem performance controls Topic Mastery.

---

# 14. MASTERY-BASED ROADMAP UNLOCKING

This is a major AlgoYo‘l feature.

A roadmap node/topic can become unlocked through either:

### Normal learning progression

The user completes required prerequisite topics.

OR

### Proven external skill

The user demonstrates enough mastery through:

* Placement Assessment
* Problem Bank
* Duel
* challenge-out test

For example:

Binary Search is currently locked because the learner has not reached it through the roadmap.

But the learner repeatedly solves Binary Search problems successfully and reaches the required Binary Search mastery threshold.

AlgoYo‘l should automatically unlock Binary Search.

Once something is unlocked, NEVER automatically lock it again because the score later changes.

Unlocks are persistent.

---

# 15. TOPIC COMPLETION

Unlocking and completing are different concepts.

Every topic/section can have configurable values such as:

unlock_threshold

completion_threshold

required_evidence_count

required_checkpoint

prerequisite_topics

Suggested starting model:

Unlock:
approximately 400–500 mastery

Complete:
approximately 700 mastery

Advanced mastery:
850+

But DO NOT hard-code these assumptions throughout the application.

Store thresholds where Owner can configure them.

Completion can occur through two paths.

## Learning completion

User:

* completes core learning units,
* passes mastery checkpoint,
* reaches mastery threshold.

## Validated knowledge completion

An experienced learner:

* passes Placement Assessment,
* passes challenge-out assessment,
* or provides sufficient real problem-solving evidence.

In that case do not force them to read beginner lessons they clearly already understand.

Mark the topic appropriately, for example:

Validated

or

Mastered

rather than pretending they completed every lesson manually.

---

# 16. ROADMAP CLOUD UI + MASTERY

REMEMBER:

DO NOT REPLACE THE EXISTING CLOUD ROADMAP.

Enhance the existing node/cloud UI.

Each node can optionally show small information such as:

Binary Search

680
Mahorat

or a tiny mastery progress ring.

Possible statuses:

Locked

Available

Current

Learning

Mastered

Validated

Completed

Use status icons and text, not color alone.

On hover/tap show:

Mastery score

Study progress

Unlock requirement

Prerequisites

Example:

Binary Search

Mahorat: 420 / 1000

Unlock:
500 mastery

or

Complete "Sorting"

Progress:
6 / 10 lessons

Do not overload the cloud node itself.

Use tooltip/popover/details panel for secondary information.

---

# 17. NEW USER PROBLEM: NOT EVERYONE IS A BEGINNER

Do NOT make every new account start from lesson one.

A person may join AlgoYo‘l after already doing competitive programming for several years.

Implement a proper Placement Assessment system.

This is extremely important.

---

# 18. PLACEMENT ASSESSMENT

After registration, offer:

**Darajangizni aniqlaymiz**

Two primary choices:

"Darajamni aniqlash"

and

"Boshlang‘ichdan boshlash"

Do not force an experienced user through beginner content.

---

# 19. PLACEMENT SHOULD CREATE A SKILL PROFILE, NOT ONLY ONE LEVEL

This is a critical product decision.

A programmer is not simply:

Beginner

Intermediate

Advanced.

Someone can be:

Strong in arrays

Strong in binary search

Average in graphs

Weak in DP

Excellent in math

Therefore the assessment should generate:

### Overall starting level

plus

### Topic-specific initial mastery scores

Example:

Overall:
Intermediate

Programming Fundamentals:
870

Arrays:
810

Prefix Sum:
740

Binary Search:
680

Greedy:
510

Graphs:
320

Dynamic Programming:
170

This profile determines roadmap unlocks.

---

# 20. PLACEMENT TEST DESIGN

Implement an adaptive placement experience.

Do not create a two-hour exam.

Target a useful balance between accuracy and completion rate.

Recommended structure:

### Stage A — Background

Ask a few lightweight questions:

Preferred programming language

Approximate experience

Whether they previously used platforms such as online judges

Learning goal

These answers only help choose initial questions.

Do NOT trust self-reported experience as mastery evidence.

### Stage B — Knowledge Calibration

Approximately 8–12 adaptive questions.

Use:

* code reading
* complexity
* output prediction
* algorithm recognition
* conceptual questions

Cover core prerequisites.

### Stage C — Coding Calibration

Approximately 2–4 coding problems.

Choose problems adaptively.

Start around a middle difficulty.

If user performs strongly:
increase difficulty.

If user struggles:
reduce difficulty.

Sample multiple skill families.

Do not attempt to test every advanced topic during onboarding.

### Final Result

Generate:

Overall recommended level

Initial Topic Mastery

Unlocked roadmap nodes

Recommended starting topic

---

# 21. EXPERIENCED USERS SHOULD BE ABLE TO CHALLENGE LOCKED CONTENT

Add an option such as:

**Bu mavzuni bilaman**

or

**Bilimingizni tekshiring**

A user may take a topic-specific challenge.

Passing it can:

* raise mastery,
* unlock the topic,
* mark prerequisites as validated where appropriate.

Do not make learners repeat known material.

Add reasonable anti-abuse rules if needed.

---

# 22. EXISTING USERS MIGRATION

Do not reset existing users to zero.

When introducing Topic Mastery, backfill initial scores from historical evidence where possible.

Use:

* historical solved problems
* problem topics
* previous roadmap completion
* previous lesson progress
* Duel history
* existing rating/progress data

Create a safe migration/backfill process.

If evidence is insufficient, leave that skill unknown/low rather than inventing mastery.

---

# 23. ROADMAP CONTENT QUALITY MUST BE REBUILT

The current roadmap educational content needs significant improvement.

Use **Repovive** as a curriculum-structure reference.

If internet access is available, inspect Repovive's current roadmaps and learning organization.

Study especially the structure of:

* programming/C++
* math fundamentals
* fundamental algorithms
* data structures
* greedy
* graph theory
* dynamic programming
* advanced problem solving

Do NOT copy Repovive text.

Do NOT reproduce proprietary lesson paragraphs.

Do NOT duplicate their wording.

Instead learn from their pedagogical structure and create ORIGINAL AlgoYo‘l material in Uzbek.

---

# 24. CONTENT ARCHITECTURE

Each substantial topic should be broken into useful learning units.

A strong topic can include:

### 1. Goal

What the learner will know after finishing.

### 2. Prerequisites

What knowledge is assumed.

### 3. Intuition

Explain WHY the technique exists before code.

### 4. Core Concept

Clear theoretical explanation.

### 5. Vocabulary

Important terminology.

### 6. Visual Explanation

Diagrams or step-by-step state visualization when useful.

### 7. Complexity

Time complexity.

Space complexity.

Why.

### 8. Simple Worked Example

Trace the algorithm manually.

### 9. Implementation

Clean competitive-programming-oriented code.

Prefer the languages already supported by AlgoYo‘l.

C++ should receive excellent support when appropriate.

### 10. Walkthrough

Explain implementation line by line or phase by phase.

### 11. Common Mistakes

Show realistic CP mistakes.

### 12. Pattern Recognition

Explain:

"When should I think of this technique?"

### 13. Quiz

Small knowledge check.

### 14. Guided Problem

Give hints progressively.

### 15. Independent Problems

No hand-holding.

### 16. Mastery Checkpoint

Verify understanding.

### 17. Section Recap

Summarize key ideas.

### 18. Next Step

Explain what this knowledge unlocks.

Not every small topic needs all 18 components.

Do not create content merely to inflate lesson count.

Quality > quantity.

---

# 25. CONTENT STYLE

Primary language:

Uzbek.

Write natural, technically correct Uzbek.

Keep well-known programming terminology where translation would sound unnatural.

Examples:

Binary Search

Dynamic Programming

Greedy

DFS

BFS

Segment Tree

Prefix Sum

Two Pointers

You can explain the Uzbek meaning alongside the English term.

Do not create awkward literal translations.

Use concise paragraphs.

Use diagrams/examples heavily for abstract algorithms.

Avoid university-textbook dryness.

Explain concepts like a strong competitive-programming mentor.

---

# 26. CURRICULUM REFERENCE SOURCES

When external research is available, use multiple high-quality sources for factual verification and curriculum coverage.

Useful reference families include:

* Repovive for course architecture
* CP-Algorithms for algorithm theory
* USACO Guide for learning order/resources
* CSES for practice categories
* official language documentation
* reputable competitive-programming materials

Do not blindly copy any source.

Produce original AlgoYo‘l content.

If external problem licensing is unclear:

link/reference the external problem

or create an original equivalent problem.

Do not illegally duplicate copyrighted problem statements.

---

# 27. AUDIT EVERY EXISTING ROADMAP

Do not update only one roadmap.

Inspect EVERY roadmap currently present in the database/repository.

For each roadmap:

identify current sections

identify missing prerequisites

identify duplicate topics

identify poor ordering

identify weak learning content

identify missing exercises

identify missing checkpoints

identify topic relationships

Then improve the INTERNAL curriculum.

Remember:

Do NOT replace the existing cloud/path presentation.

---

# 28. RECOMMENDED CURRICULUM COVERAGE

Use this as a quality benchmark, not as an instruction to create unnecessary duplicate roadmaps.

If the existing roadmap architecture already groups these topics differently, preserve that structure where reasonable.

Programming foundations should eventually cover CP-relevant parts of:

* input/output
* variables/types
* operators
* conditions
* loops
* arrays
* strings
* functions
* references
* vectors
* pairs
* maps
* sets
* STL algorithms
* iterators
* fast I/O
* sorting
* debugging
* integer overflow
* complexity
* common CP templates

Do not over-focus on enterprise OOP concepts if they are irrelevant to AlgoYo‘l's goal.

Math foundations should eventually cover:

* arithmetic
* modulo
* exponents
* logarithms
* algebra
* sequences
* summations
* number bases
* bit operations
* boolean logic
* sets
* counting
* permutations
* combinations
* probability fundamentals
* divisibility
* primes
* sieve
* GCD/LCM
* modular arithmetic
* fast exponentiation
* geometry fundamentals
* Big-O intuition

Fundamental algorithm techniques should eventually cover:

* sorting
* binary search
* binary search on answer
* two pointers
* sliding window
* prefix sums
* difference arrays
* divide and conquer
* brute force
* complete search
* backtracking
* bit manipulation

Data structures should eventually cover:

* arrays
* stacks
* monotonic stacks
* queues
* deques
* hash structures
* heaps
* priority queues
* trees
* BST concepts
* tries
* DSU
* Fenwick Tree
* Segment Tree
* Lazy Segment Tree
* Sparse Table
* sqrt decomposition
* advanced/persistent structures where appropriate

Greedy should eventually cover:

* greedy intuition
* greedy-choice property
* recognizing greedy
* counterexamples
* exchange argument
* stays-ahead proof
* interval scheduling
* interval covering
* array greedy
* job/task scheduling
* optimization patterns
* advanced greedy practice

Graphs should eventually cover:

* representation
* DFS
* BFS
* grid graphs
* flood fill
* connected components
* bipartite graphs
* tree fundamentals
* tree diameter
* subtree processing
* shortest paths
* Dijkstra
* Bellman-Ford
* Floyd-Warshall
* DSU
* MST
* Kruskal
* Prim
* topological sort
* DAG DP
* SCC
* bridges
* articulation points
* LCA
* binary lifting
* Euler tour
* tree DP
* rerooting
* HLD
* centroid decomposition
* flows/matching when appropriate

Dynamic Programming should eventually cover:

* recursion
* memoization
* tabulation
* state design
* transitions
* base cases
* 1D DP
* multidimensional DP
* grid DP
* knapsack
* knapsack variants
* LIS
* LCS
* edit distance
* interval DP
* tree DP
* bitmask DP
* digit DP
* game DP
* probability/expected value
* advanced optimization where appropriate

Do not expose advanced sections to beginners prematurely.

Use prerequisites and mastery-based unlocking.

---

# 29. RESOURCE MODEL

Learning content should not be one giant unstructured HTML field if the existing architecture allows improvement.

Prefer structured learning units.

Possible unit types:

theory

example

code

visualization

quiz

problem

hint

checkpoint

recap

resource_link

This allows Owner/Admin to edit individual units.

Adapt this to the existing database architecture.

Do not create needless schema complexity if comparable structures already exist.

---

# 30. DUEL IS A SIGNATURE FEATURE

Duel must feel like AlgoYo‘l's competitive arena.

Two users.

Same challenge set.

Approximately 3 problems.

Limited time according to existing settings.

Global rating is affected after the match according to existing logic.

Do not invent competition mechanics that conflict with backend behavior.

---

# 31. DUEL MATCHMAKING

Design matchmaking clearly.

Show:

DUEL

Opponent search status

Your Global Rating

Expected opponent rating range when available

Number of problems

Time limit

Cancel action

Use subtle motion.

Do NOT use:

neon gaming backgrounds

esports flames

massive VS graphics

particle effects

glowing red/blue characters

Keep it technical and premium.

---

# 32. ACTIVE DUEL

During an active Duel keep visible:

Remaining time

Current user

Opponent

Global Ratings

Problem A/B/C

Solved count

Problem state

Possible states:

Not started

Working

Submitted

Wrong Answer

Solved

Do not expose opponent source code.

If realtime event infrastructure already exists, display a compact activity feed.

Do not fake realtime functionality.

---

# 33. DUEL RESULT

After Duel show two separate concepts.

### Competition Result

Victory / Defeat

Score

Global Duel Rating

Example:

1428 → 1451

+23

### Skill Growth

Example:

Binary Search
620 → 648
+28

Prefix Sum
710 → 722
+12

This is a powerful AlgoYo‘l-specific experience.

The user should understand:

"I won/lost the match"

AND

"these are the skills I demonstrated."

Add actions such as:

Rematch

Find another opponent

Review problems

Continue relevant roadmap topic

That last action creates the link:

DUEL → LEARN.

---

# 34. DUEL → ROADMAP FEEDBACK LOOP

Use Duel performance to recommend learning.

Example:

User repeatedly fails Graph problems.

After the Duel:

"Graph BFS bo‘yicha mashq qilish tavsiya etiladi."

Button:

"BFS mavzusiga o‘tish"

Do not shame the learner.

Make it actionable.

Likewise, strong performance can unlock content.

Example:

"Binary Search mahoratingiz 500 ga yetdi."

"Binary Search roadmap bo‘limi ochildi."

This should feel rewarding.

---

# 35. PROBLEM BANK

Problem Bank is independent practice.

Use a clean, information-dense list/table.

Support existing filters and add missing useful filters only if backend data exists.

Possible filters:

Search

Difficulty

Topic

Status

Rating/points

Possible statuses:

Solved

Attempted

Unsolved

Each problem should clearly show:

ID

Title

Difficulty

Primary topic

Status

Additional metadata only when useful.

Avoid huge cards.

Problem discovery should be fast.

---

# 36. PROBLEM SOLVING PAGE

Optimize the solving experience.

Desktop may use:

Problem statement

and

Code editor

side by side when the existing implementation supports it.

Show:

title

difficulty

topic

time limit

memory limit

statement

input

output

examples

constraints

language

Run

Submit

Judging result

Technical metadata should use monospace typography.

Submission results:

Accepted

Wrong Answer

Time Limit Exceeded

Memory Limit Exceeded

Runtime Error

Compilation Error

Judging

Use semantic colors.

---

# 37. SUBMISSION PRIVACY

This requirement is strict.

Normal users MUST NOT be able to access another user's submission source code.

Do not merely hide a button in the frontend.

Enforce this on the backend/authorization layer.

A User may view:

their OWN submission code

their OWN submission details

public aggregate information intentionally exposed by the product

A User must NOT access another user's private submission detail/source through:

URL manipulation

API calls

network requests

GraphQL/API parameters

or hidden frontend routes.

Test this authorization.

---

# 38. THREE ROLES

The platform currently has:

OWNER

ADMIN

USER

Preserve these roles.

Implement proper RBAC/permissions.

Do not scatter role checks throughout random views.

Use centralized policies/permissions/middleware according to the existing framework.

---

# 39. OWNER

OWNER is the platform superuser.

Owner should be able to manage essentially everything.

Examples include:

Users

Admins

Roles

Permissions

User blocking

User suspension

User deletion where safe

Problem creation

Problem editing

Problem deletion

Problem publishing

Problem topics

Problem difficulty

Problem test cases

Hidden test cases

Submission inspection

Judge configuration where appropriate

Roadmaps

Roadmap sections

Roadmap topics

Roadmap order

Lessons

Resources

Quizzes

Checkpoints

Mastery thresholds

Unlock requirements

Completion requirements

Duel settings

Rating configuration where appropriate

Platform settings

Content publishing

Authentication settings where appropriate

Moderation

Audit logs

Owner can assign/revoke Admin permissions.

Owner-level destructive actions should require appropriate confirmation.

---

# 40. ADMIN

ADMIN has more authority than USER but less than OWNER.

Do not make Admin automatically equivalent to Owner.

Use granular permissions.

Recommended default Admin capabilities:

problem.create

problem.update

problem.publish

problem.manage_topics

problem.manage_testcases

submission.view_all

submission.view_source

user.view

moderation.basic

content.view_management

Additional permissions can be granted by Owner, for example:

roadmap.manage

lesson.manage

quiz.manage

user.suspend

duel.review

Do not let Admin by default:

promote themselves to Owner

remove Owner

change Owner-level security settings

erase audit logs

modify sensitive system secrets

unless explicitly allowed by an Owner permission model.

---

# 41. USER

USER can use the learning platform.

User may:

learn available roadmap content

take assessments

solve problems

view their own submissions

participate in Duel

gain mastery

gain/lose Global Duel Rating

view public rankings

manage their profile

User cannot:

manage platform content

edit problems

edit test cases

view hidden judge tests

view another user's submission source

modify another user's progress

change mastery manually

modify Duel results

change ratings directly

access management routes

---

# 42. PERMISSION SYSTEM

Prefer permissions over giant hard-coded conditions such as:

if role == admin

everywhere.

Suggested conceptual hierarchy:

Owner:
all permissions

Admin:
assigned permission set

User:
standard application permissions

If the current framework already has RBAC, use it.

Add backend authorization tests.

Frontend visibility is NOT security.

Every sensitive endpoint must verify authorization server-side.

---

# 43. ADMIN / OWNER MANAGEMENT UI

Create a professional management area.

Do not mix it confusingly with the normal learner dashboard.

Possible management navigation:

Overview

Users

Problems

Test Cases

Submissions

Roadmaps

Lessons

Resources

Duels

Ratings / Mastery

Permissions

Settings

Audit Log

Only show sections the current role is allowed to access.

Owner sees everything.

Admin sees only permitted areas.

---

# 44. TEST CASE SECURITY

Problem hidden test cases are sensitive.

Normal users must never receive hidden test inputs/expected outputs through frontend APIs.

Admin access depends on permission.

Owner has full access.

Audit important modifications to judge tests when practical.

---

# 45. AUTHENTICATION GATING

Guest users must NOT have full platform functionality.

A guest may see the public marketing experience.

They may see previews such as:

roadmap names

short descriptions

platform explanation

sample problem cards

Duel explanation

public leaderboard if desired

But they must authenticate before:

starting a Roadmap learning session

opening protected full lesson content

saving roadmap progress

taking mastery assessments

joining Duel

starting matchmaking

submitting problems

viewing personal progress

using private profile features

Do not enforce this only through disabled buttons.

Protect routes and APIs.

---

# 46. LOGIN AND REGISTER REDESIGN

Login and Register must look polished and intentional.

Do not use a generic framework-default form.

Keep the AlgoYo‘l visual identity.

Login should support:

Email/username

Password

Show/hide password

Remember me if supported

Forgot password if backend supports it

Primary sign-in

Google sign-in

Link to Register

Register should support necessary fields such as:

Name where needed

Username

Email

Password

Password confirmation when appropriate

Terms acknowledgement when required

Google registration/sign-in

Do not request unnecessary personal information.

---

# 47. GOOGLE AUTH

Implement secure Google authentication using the authentication capabilities appropriate to the existing backend stack.

Do not fake Google login with a visual-only button.

New Google users must still create an AlgoYo‘l account/profile internally.

After first successful authentication, launch the onboarding / Placement Assessment experience.

Existing accounts should be linkable safely where appropriate.

Handle duplicate email/account cases carefully.

Do not store OAuth secrets in frontend code.

Use secure environment configuration.

---

# 48. FIRST-TIME ONBOARDING

After registration:

Welcome to AlgoYo‘l.

Explain briefly:

Learn

Practice

Duel

Grow

Then ask:

**Darajangizni aniqlaymizmi?**

Options:

"Darajamni aniqlash"

"Boshlang‘ichdan boshlash"

Optionally:

"Keyinroq"

if product flow needs it.

Experienced users should strongly understand the value of the assessment.

Do not create a long marketing onboarding carousel.

---

# 49. AUTHENTICATED HOME

The authenticated homepage must answer:

What should I learn next?

What is my current mastery?

What can I practice?

Can I Duel?

How am I improving?

Do not show a giant marketing hero.

Prominent areas may include:

Continue Roadmap

Current Topic

Topic Mastery

Roadmap Progress

Duel CTA

Global Rating

Recent Practice

Recently Unlocked Topic

Suggested Next Action

Do not invent fake recommendations.

Use actual product data.

---

# 50. EXAMPLE HOME LOGIC

The most important card/module should usually be:

**Davom ettirish**

Example:

Binary Search

Study Progress:
6 / 10

Mahorat:
580 / 1000

Keyingi:
Binary Search on Answer

[Davom ettirish]

Beside/below:

Duel

Global Rating:
1428

3 problems

30 minutes

[Raqib topish]

Then useful practice/progress modules.

---

# 51. PROFILE

Profile should communicate learning + competitive identity.

Possible sections:

Global Duel Rating

Competitive tier

Peak Global Rating

Roadmap Mastery

Topic Mastery

Solved Problems

Duel W/L

Recent Duel history

Rating history

Learning progress

Strongest topics

Topics to improve

Only display data that actually exists or can be correctly derived.

Do not generate fake analytics.

---

# 52. SKILL PROFILE UI

Add a useful mastery visualization.

Example:

Binary Search
██████████████░░
742

Prefix Sum
████████████████
830

Graphs
████████░░░░░░░░
421

DP
███░░░░░░░░░░░░░
188

Prefer bars and readable numbers.

Avoid meaningless radar charts unless there is a genuine UX reason.

---

# 53. RANKINGS

Global Rankings should primarily use Global Duel Rating.

Do not rank users by Topic Mastery unless creating a clearly separate skill leaderboard.

Keep the current user's row easy to find.

Potential fields:

Rank

User

Global Rating

Tier

Duels

Solved

Only use available data.

---

# 54. VISUAL DESIGN DIRECTION

The design language should be:

dark-first

technical

clean

focused

premium

calm during long coding sessions

competitive without looking like a video game.

Reference inspiration can include:

NeetCode:
learn + practice relationship

roadmap-oriented products:
progress clarity

Exercism:
calm educational UX

Codewars:
progression/gamification thinking

modern developer tools:
visual cleanliness

But AlgoYo‘l must not look copied from any of them.

---

# 55. COLOR SYSTEM

Suggested dark theme starting point:

Background:
#080B10

Surface:
#0D1219

Secondary Surface:
#121923

Hover Surface:
#17212D

Border:
#202B38

Stronger Border:
#314052

Primary Text:
#F1F5F9

Secondary Text:
#94A3B8

Muted:
#64748B

Primary:
#38BDF8

Primary Hover:
#0EA5E9

Success:
#22C55E

Duel / Warning:
#F59E0B

Danger:
#EF4444

Use CSS variables/design tokens.

Adjust the exact palette if the existing AlgoYo‘l brand already has stronger identity.

---

# 56. COLOR SEMANTICS

Blue:
navigation / selected / primary action

Green:
Accepted / Mastered / Completed

Amber:
Duel / challenge / warning

Red:
Wrong Answer / loss / destructive action

Gray:
Locked / disabled / inactive

Do not use random colors purely for decoration.

---

# 57. TYPOGRAPHY

Use a clean UI font such as:

Inter

or

Geist

Use a monospace font such as:

JetBrains Mono

for:

code

timers

ratings

mastery scores where useful

problem IDs

execution time

memory

technical metadata

Avoid giant dashboard headings.

---

# 58. SHAPE AND SPACING

Do not create the typical AI-generated SaaS aesthetic.

Prefer:

Button radius:
6–8px

Input radius:
8px

Card radius:
8–12px

Modal radius:
12px

Subtle 1px borders.

Compact but comfortable spacing.

Do NOT use 24–32px rounded rectangles everywhere.

---

# 59. STRICT ANTI-GENERIC-AI-DESIGN RULES

Do NOT use:

purple SaaS gradients

gradient headline text everywhere

glassmorphism everywhere

huge blurred blobs

giant neon glows

3D floating objects

unnecessary illustrations

giant rounded cards

a card around every paragraph

excessive shadows

massive hero sections inside the app

meaningless charts

excessive animations

gaming HUD aesthetics

random emojis throughout professional UI

Use hierarchy, spacing, typography and information architecture instead.

---

# 60. MICROINTERACTIONS

Use subtle useful interactions:

button hover

table row hover

roadmap node status transitions

mastery progress update

unlock state

submission judging

Duel countdown

rating delta

tooltip

copy feedback

dropdown transition

Keep animation restrained.

Approximately 150–250ms for common UI transitions.

Respect prefers-reduced-motion.

---

# 61. ROADMAP UNLOCK EXPERIENCE

When mastery causes a node to unlock, make it feel rewarding but restrained.

Example:

**Yangi mavzu ochildi**

Binary Search on Answer

Binary Search mahoratingiz:
512

Requirement:
500

[O‘rganishni boshlash]

Do not use huge confetti explosions.

A small path/node animation is enough.

Preserve the existing cloud roadmap style.

---

# 62. RESPONSIVE DESIGN

Optimize intentionally for:

1440 desktop

1280 laptop

1024 tablet

768 tablet

390 mobile

Do not merely shrink desktop layouts.

Roadmap cloud:
preserve meaning on mobile.

Problem solving:
use purposeful tabs/panels.

Duel:
timer + players + problem status should remain visible.

Admin tables:
support horizontal overflow or mobile management patterns responsibly.

---

# 63. ACCESSIBILITY

Implement:

semantic HTML

keyboard navigation

visible focus states

proper labels

good contrast

ARIA where required

status icons/text in addition to color

reduced motion support

usable touch targets

---

# 64. REUSABLE COMPONENTS

Reuse existing components when good.

Create coherent shared components only when needed.

Possible components/services:

AppShell

Sidebar / TopNavigation

PageHeader

Button

Input

Select

Badge

Tooltip

Modal

ProgressBar

RatingDisplay

MasteryDisplay

RoadmapMastery

TopicMastery

RoadmapNode

RoadmapNodePopover

LessonUnit

Quiz

MasteryCheckpoint

ProblemTable

ProblemRow

ProblemStatus

TopicBadge

CodeResult

DuelTimer

DuelPlayer

DuelProblemStatus

DuelEventFeed

DuelResult

RatingDelta

MasteryDelta

Leaderboard

PlacementQuestion

PlacementCodingTask

PermissionGuard

ManagementShell

EmptyState

Skeleton

ErrorState

Do not create duplicate components when existing equivalents are adequate.

---

# 65. SUGGESTED DATA MODEL EXTENSIONS

Do not blindly create these tables.

First inspect existing schema and reuse it.

Conceptually the system needs to represent:

### User Topic Mastery

user

topic

mastery score

confidence/evidence count if needed

unlocked timestamp

completed/validated timestamp

last activity

### Mastery Event

user

topic

source

source entity ID

score delta/evidence

timestamp

Possible source types:

lesson

quiz

problem

duel

placement

challenge

### Topic Requirements

unlock threshold

completion threshold

prerequisites

required checkpoint

difficulty metadata

### Placement Attempt

user

answers

coding results

calculated initial mastery

result

### Problem Topic Mapping

problem

primary topic

secondary topics

weights if necessary

Adapt names to the existing project.

---

# 66. KEEP MASTERY LOGIC CENTRALIZED

Create something conceptually like:

MasteryService

or equivalent domain service.

It should be responsible for:

recording evidence

avoiding duplicate rewards

calculating score changes

checking unlock conditions

checking completion conditions

updating aggregate roadmap mastery

creating mastery history

Do not duplicate this algorithm in:

Duel controller

Problem controller

Roadmap controller

frontend JavaScript

and background scripts separately.

Use one authoritative backend implementation.

---

# 67. SECURITY

Never trust frontend values for:

rating changes

mastery deltas

Duel winner

problem solved state

role

permissions

test results

roadmap unlocks

placement result

All authoritative calculations belong server-side.

Protect against users manually sending:

mastery = 1000

rating_delta = +500

role = owner

completed = true

from the browser.

---

# 68. AUDIT LOGGING

For sensitive Owner/Admin operations, add audit logging where practical.

Examples:

role changed

user banned

problem deleted

hidden tests changed

roadmap requirement changed

manual rating modification

manual mastery modification

admin permission changed

Record:

actor

action

target

time

important before/after data when reasonable.

Normal users must not modify/delete audit history.

---

# 69. PERFORMANCE

The application should feel fast.

Avoid heavy libraries for simple UI.

Optimize:

initial rendering

route transitions

Problem Bank queries

Roadmap data

large management tables

code editor loading

realtime Duel updates

Do not repeatedly recalculate all mastery history on every page load.

Store/cache derived values responsibly while preserving correctness.

---

# 70. TESTING REQUIREMENTS

Add/update tests for critical behavior.

Especially test:

User cannot access another user's submission.

Admin can view submission when permission exists.

Admin without permission cannot view source.

Owner has superuser access.

Guest cannot start Duel.

Guest cannot access protected roadmap learning content.

Guest cannot submit problems.

Google-auth-created user enters onboarding.

Mastery changes after valid learning evidence.

Repeated same evidence does not farm mastery.

Problem solve updates correct Topic Mastery.

Duel problem solve updates Topic Mastery.

Duel result updates Global Duel Rating separately.

Mastery can unlock a roadmap topic.

Unlocked topics never automatically relock.

Placement Assessment seeds topic mastery.

Existing users are not reset.

Owner can configure thresholds.

---

# 71. DO NOT BREAK EXISTING BUSINESS LOGIC

Preserve:

working judge

submission flow

existing problem IDs

user data

Duel history

Global Rating history

roadmap data where reusable

routes where changing them is unnecessary

SEO/public URLs where applicable

existing authentication accounts

Use migrations safely.

Do not wipe data.

---

# 72. IMPLEMENTATION ORDER

Execute the redesign systematically.

### Phase 1 — Repository Audit

Understand everything.

### Phase 2 — Design System

Create consistent tokens/components without breaking features.

### Phase 3 — Authentication & Guest Protection

Login

Register

Google Auth

Protected routes

Onboarding shell

### Phase 4 — RBAC

Owner

Admin permissions

User restrictions

Submission privacy

Management area

### Phase 5 — Mastery Domain

Topic mapping

Mastery model

Mastery service

Unlock rules

Completion rules

Backfill

### Phase 6 — Placement Assessment

Adaptive onboarding

Skill profile

Recommended roadmap start

### Phase 7 — Roadmap Content System

Keep existing cloud UI.

Improve internal lessons/resources.

Add mastery information.

### Phase 8 — Roadmap Curriculum Upgrade

Audit EVERY existing roadmap.

Rewrite weak content with original Uzbek learning material.

Use Repovive-like pedagogical depth without copying.

### Phase 9 — Problem Bank

Improve discovery/filters/UI.

Connect solves to mastery.

### Phase 10 — Duel

Improve Arena UI.

Connect solved Duel problems to mastery.

Separate Global Rating and skill deltas.

### Phase 11 — Home / Profile / Rankings

Connect all systems into a coherent progress experience.

### Phase 12 — Polish

Mobile

Accessibility

Loading

Empty/error states

Performance

Tests

Security review

Do not require approval between phases.

Proceed autonomously while respecting all constraints.

---

# 73. FINAL QUALITY BAR

At completion, AlgoYo‘l should have a distinctive loop:

User joins.

AlgoYo‘l determines what they already know.

The user starts from an appropriate point.

They learn through structured roadmaps.

They practice using Problem Bank.

Their Topic Mastery increases from real evidence.

They Duel another programmer.

The Duel changes their Global Rating.

Problems solved in the Duel also improve relevant Topic Mastery.

New mastery unlocks harder roadmap topics.

Weak Duel areas send the learner back to relevant learning material.

The user returns stronger.

This loop repeats.

---

# 74. MOST IMPORTANT PRODUCT PRINCIPLE

The system should reward **demonstrated knowledge**, not just clicking through lessons.

A learner may progress through:

study

practice

competition

assessment

and all four paths should contribute to a coherent skill profile.

AlgoYo‘l's core differentiator should become:

**Learning and competition are not separate systems. Each one continuously affects the other.**

---

# 75. FINAL NON-NEGOTIABLES

Before considering the work complete, verify all of these:

The existing cloud-like roadmap visualization was preserved.

The main structure was not unnecessarily changed to copy other sites.

Roadmap learning content is substantially better.

All existing roadmaps were audited.

Roadmap content is original and not copied from Repovive.

Global Duel Rating is separate from Topic Mastery.

Every important algorithm topic can have user-specific mastery.

Problems are connected to topics.

Problem Bank solves can increase mastery.

Duel solves can increase mastery.

Learning/checkpoints can increase mastery.

Repeated actions cannot farm mastery.

Mastery can unlock roadmap topics.

Unlocks do not later relock.

Completion and unlock are separate states.

Experienced new users do not have to start from zero.

Placement Assessment creates topic-specific skill profiles.

Existing users are migrated safely.

Owner has full platform control.

Admins use granular permissions.

Normal users cannot view another user's submission code/details.

Guests cannot freely use Duel or protected roadmap learning.

Login/Register are professionally redesigned.

Google authentication is functional, not decorative.

Backend authorization protects sensitive actions.

Hidden test cases remain private.

No working existing functionality was removed without necessity.

The platform still feels unmistakably like AlgoYo‘l.

Do not finish with placeholder or mock functionality when the existing backend can support the real behavior.

Make the final result production-quality.
