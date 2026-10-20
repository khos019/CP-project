/* The max-size tests of A521–C620 live next to the problems themselves, in
   tools/problem-authoring/batch-521…630.mjs (`big`), together with the slow
   but correct programs (`slow`) every one of those tests was written to stop:
   a quadratic scan, a step-by-step count, a per-query rescan. Each slow
   program must fail at least one test here, or the build refuses the problem.
   tools/problem-authoring/bigcheck.mjs ran the same checks before the batch was
   emitted. */

const wrap = (body) => "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\n" + body + "\nreturn 0;}\n";

const spec = {};
for (const b of ["521", "533", "549", "565", "571", "587", "600", "613", "621", "630"]) {
  for (const p of (await import(`../../problem-authoring/batch-${b}.mjs`)).default) {
    if (!p.big?.length) continue;
    spec[p.judge] = { tests: p.big, slow: (p.slow || []).map(wrap) };
  }
}
export default spec;
