/* How well, and how fast, the bot plays.
 *
 * The brief's rule, and the right one: nothing here may be `if (random > 0.5)`.
 * Every outcome is derived from one number —
 *
 *     performance = botRating - problemRating
 *
 * — pushed through the same logistic curve the platform already uses for Elo
 * (rating.ts `expectedScore`, and duel_finish in SQL). Reusing that curve is
 * not a shortcut: it means "a 1500 bot against a 1500 problem" has exactly the
 * meaning it has everywhere else on the site, so bot strength is expressed in
 * units the rest of the system already agrees on.
 *
 * The plan is generated once, when the duel is created, and stored. It is never
 * held in memory: Cloudflare Workers cannot keep a timer alive for twenty
 * minutes, and an isolate that dies between two rounds must not take the bot's
 * schedule with it. Every later request just asks "what was due by now?".
 *
 * It is also seeded, so the same duel always produces the same plan. That is
 * what makes the model testable — a balancing run can simulate ten thousand
 * duels and get the same answer twice.
 */

export type BotConfig = {
  /** Stretches or flattens the skill curve. 1 = plain Elo expectation. */
  difficultyScale: number;
  /** Multiplies every thinking time. Raise it to make duels feel slower. */
  timeScale: number;
  /** How readily a bot submits a wrong answer before the right one. */
  mistakeRate: number;
  minDelaySeconds: number;
  maxDelaySeconds: number;
  /** Rating points the bot plays above the level it was matched at.
   *
   *  The bot's rating is the player's own strength, and the problems are
   *  chosen for that same rating — so a plain Elo expectation puts the bot at
   *  a coin flip on every round, and the coin flip it loses it loses without
   *  submitting anything worth watching. An opponent is supposed to be a test.
   *  This bonus is where "the bot should be a little stronger" lives, and it
   *  is expressed in rating points so it still means the same thing as every
   *  other number in the model. */
  skillBonus: number;
  /** A second chance, as a fraction of the first. A player who does not see a
   *  problem on the first read often sees it on the second; a bot that gives
   *  up the moment its first roll fails is the "switched off" opponent this
   *  model keeps trying not to be. */
  lateSolveFactor: number;
};

export const DEFAULT_BOT_CONFIG: BotConfig = {
  difficultyScale: 1,
  timeScale: 1,
  mistakeRate: 1,
  minDelaySeconds: 35,
  maxDelaySeconds: 900,
  skillBonus: 120,
  lateSolveFactor: 0.5,
};

export type Attempt = {
  at: number;
  correct: boolean;
  /** Which of the problem's wrong programs this attempt submits. Chosen here
   *  rather than at submit time so the plan says exactly what will be sent. */
  variant?: number;
};
export type RoundPlan = {
  round: number;
  problemKey: string;
  /** `at` is seconds after THIS round opened, not since the duel began. Only
   *  one problem is open at a time, and when the previous one falls is not
   *  knowable when the plan is written — so the schedule is written relative
   *  to a start the runner supplies. */
  attempts: Attempt[];
  /** When the plan expected this round to open, in seconds from the duel's
   *  start. A fallback only: the runner prefers the moment the round really
   *  opened. */
  openAt: number;
  solves: boolean;
};
export type BotPlan = { rating: number; rounds: RoundPlan[] };

/* Deterministic PRNG. A duel's plan has to survive being recomputed by a
   different isolate, so "random" here means "a fixed function of the match id
   and the round" rather than Math.random().

   Every question gets its OWN stream, named after what it decides. That is not
   tidiness. The first version drew `shouldSolve` and the timing jitter from the
   same seed, which means they were the same draw: a bot that solved the problem
   was, without fail, also a fast bot, and a bot that failed was always a slow
   one. Nobody wrote that rule and it is not true of people. Naming the stream
   keeps the two questions independent, and keeps them independent when a third
   one is added later. */
function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The probability this bot solves this problem at all, given unlimited time.
 *  Plain Elo expectation: equal ratings meet at 0.5, and every 400 points of
 *  gap moves the odds by a factor of ten. */
export function solveProbability(botRating: number, problemRating: number, config = DEFAULT_BOT_CONFIG): number {
  const gap = (botRating + config.skillBonus - problemRating) * config.difficultyScale;
  return 1 / (1 + Math.pow(10, -gap / 400));
}

/** The chance the bot solves the round at all, first read or second. Exported
 *  because it, not solveProbability, is what a balancing run should read. */
export function effectiveSolveProbability(
  botRating: number, problemRating: number, config = DEFAULT_BOT_CONFIG,
): number {
  const p = solveProbability(botRating, problemRating, config);
  return p + (1 - p) * Math.min(1, Math.max(0, p * config.lateSolveFactor));
}

/** Expected seconds of thinking before a first submission.
 *
 *  Base time comes from the problem's own difficulty — an easy problem is
 *  quicker for everyone — and is then stretched or compressed by how far the
 *  problem is above or below the bot. A bot 400 points above a problem works at
 *  roughly half the base time; one 400 points below takes about double.
 */
export function expectedThinkingSeconds(
  botRating: number, problemRating: number, difficulty: "easy" | "medium" | "hard",
  config = DEFAULT_BOT_CONFIG,
): number {
  // Halved from the first cut. The old numbers were defensible on paper —
  // four minutes of thinking for a medium problem is what a person spends —
  // but a duel is watched, not read about: an opponent who does nothing at all
  // for six minutes is indistinguishable from an opponent that is broken, and
  // that is what the first bot duels actually looked like.
  const base = { easy: 60, medium: 125, hard: 210 }[difficulty] ?? 125;
  const gap = botRating + config.skillBonus - problemRating;
  const stretched = base * Math.exp(-gap / 520) * config.timeScale;
  return Math.min(config.maxDelaySeconds, Math.max(config.minDelaySeconds, stretched));
}

/** The whole behaviour for one round, in the shape the brief asked for. */
export function getBotSubmissionBehavior(
  botRating: number, problemRating: number, difficulty: "easy" | "medium" | "hard",
  seed: string, config = DEFAULT_BOT_CONFIG,
): { shouldSolve: boolean; solvesLate: boolean; expectedDelay: number; mistakeProbability: number } {
  const random = seeded(`${seed}:outcome`);
  const p = solveProbability(botRating, problemRating, config);
  // Mistakes track the same gap: a bot comfortably above a problem rarely
  // fumbles it, one reaching above itself often does. The floor is the part
  // that is not derived from the gap, and it is deliberate: a player who is
  // far stronger than the problem still mistypes a bound now and then, and a
  // bot that has literally never submitted a wrong answer is the one thing a
  // human opponent never looks like.
  const mistakeProbability = Math.min(0.85, Math.max(0.07, (1 - p) * config.mistakeRate));
  // Two draws from the same stream, in order: the first read, then the second.
  // The second is conditional on the first having failed, which is why it is
  // drawn after it rather than beside it.
  const early = random() < p;
  const late = !early && random() < p * config.lateSolveFactor;
  return {
    shouldSolve: early || late,
    solvesLate: late,
    expectedDelay: expectedThinkingSeconds(botRating, problemRating, difficulty, config),
    mistakeProbability,
  };
}

/** The full schedule for a duel: what the bot will submit, and when.
 *
 *  `at` is seconds from the duel's start, so nothing here depends on when it
 *  was computed — the same plan can be re-derived from the match id at any
 *  point and produce the same answer. */
export function planDuel(
  matchId: string, botRating: number,
  rounds: {
    round: number; problemKey: string; problemRating: number;
    difficulty: "easy" | "medium" | "hard";
    /** How many DISTINCT wrong programs this problem has. The bot may not make
     *  more failed attempts than that, because the alternative is submitting a
     *  byte-identical program twice and collecting the same verdict twice —
     *  which is the one thing no person has ever done. */
    wrongVariants?: number;
  }[],
  duelSeconds: number, config = DEFAULT_BOT_CONFIG,
): BotPlan {
  const plan: RoundPlan[] = [];
  // The bot works one problem at a time, like a person. `clock` is only used to
  // predict when each round will open, for the runner to fall back on; the
  // attempts themselves are timed from the round's own start.
  let clock = 0;

  for (const round of rounds) {
    const seed = `${matchId}:${round.round}`;
    const timing = seeded(`${seed}:timing`);
    const mistakes = seeded(`${seed}:mistakes`);
    const behaviour = getBotSubmissionBehavior(botRating, round.problemRating, round.difficulty, seed, config);

    // Lognormal-ish jitter so two duels at the same rating do not look identical.
    const jitter = Math.exp((timing() - 0.5) * 0.7);
    const think = Math.max(config.minDelaySeconds, behaviour.expectedDelay * jitter);

    const attempts: Attempt[] = [];
    // Wrong submissions come first and cost time — a rejected attempt is a
    // person re-reading the statement, not a free reroll.
    const maxWrong = Math.max(0, Math.min(3, round.wrongVariants ?? 1));
    let wrongCount = 0;
    while (wrongCount < maxWrong && mistakes() < behaviour.mistakeProbability) wrongCount++;
    // A round the bot cannot solve still has to be *played*, and played for
    // longer than one submission. The first version sent a single wrong answer
    // and then went quiet for the rest of the round, which from the other side
    // of the scoreboard is indistinguishable from an opponent that crashed —
    // exactly the complaint this is fixing. Somebody who cannot solve a problem
    // keeps trying at it until the round is gone.
    if (!behaviour.shouldSolve) wrongCount = maxWrong;
    // A second read follows something that failed. Without this the late solve
    // is the bot's FIRST submission and it lands late, so how long the opponent
    // waited for the opening attempt would quietly predict whether the bot was
    // about to solve the round — the same tell the seeded streams above exist
    // to remove.
    if (behaviour.solvesLate && wrongCount === 0) wrongCount = Math.min(1, maxWrong);

    let at = think;
    for (let i = 0; i < wrongCount; i++) {
      attempts.push({ at: Math.round(at), correct: false, variant: i });
      at += Math.max(20, think * 0.35 * (0.7 + timing() * 0.6));
    }
    // The second read costs real time: a late solve arrives well after the
    // point the bot would have submitted if it had seen the answer at once.
    if (behaviour.solvesLate) at += think * (0.8 + timing() * 0.6);
    if (behaviour.shouldSolve) attempts.push({ at: Math.round(at), correct: true });

    const openAt = Math.round(clock);
    // A round the bot never solves still consumes its attention before it
    // gives up and moves on.
    clock += behaviour.shouldSolve ? at : at + think * 0.35;

    // Anything scheduled past the final whistle simply never happens.
    plan.push({
      round: round.round,
      problemKey: round.problemKey,
      solves: behaviour.shouldSolve,
      openAt,
      attempts: attempts.filter((a) => a.at < duelSeconds),
    });
  }

  return { rating: botRating, rounds: plan };
}

/** Config from duel_config, with defaults for anything not set. Keeps the
 *  tuning knobs in the database rather than in this file. */
export function botConfigFrom(row: Record<string, unknown> | null | undefined): BotConfig {
  const num = (key: string, fallback: number) => {
    const value = Number(row?.[key]);
    return Number.isFinite(value) ? value : fallback;
  };
  return {
    difficultyScale: num("bot_difficulty_scale", DEFAULT_BOT_CONFIG.difficultyScale),
    timeScale: num("bot_time_scale", DEFAULT_BOT_CONFIG.timeScale),
    mistakeRate: num("bot_mistake_rate", DEFAULT_BOT_CONFIG.mistakeRate),
    minDelaySeconds: num("bot_min_delay", DEFAULT_BOT_CONFIG.minDelaySeconds),
    maxDelaySeconds: num("bot_max_delay", DEFAULT_BOT_CONFIG.maxDelaySeconds),
    skillBonus: num("bot_skill_bonus", DEFAULT_BOT_CONFIG.skillBonus),
    lateSolveFactor: num("bot_late_solve", DEFAULT_BOT_CONFIG.lateSolveFactor),
  };
}
