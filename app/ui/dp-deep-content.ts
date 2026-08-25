/* Repovive-style granular sub-curriculum, nested inside a single roadmap
   stage. Pilot: "1D DP" (dynamic-programming-8), broken into the kind of
   problem-by-problem micro-lessons a real DP course walks through, instead
   of one summary page. Original content — nothing copied from any source. */

export type SubLesson = {
  titleUz: string; titleEn: string;
  minutes: number;
  bodyUz: string; bodyEn: string;
  cpp?: string; python?: string;
};

export type DeepStage = { subLessons: SubLesson[] };

export const deepContent: Record<string, DeepStage> = {
  "dynamic-programming-8": {
    subLessons: [
      {
        titleUz: "1D DP nima va qachon yetarli", titleEn: "What 1D DP is, and when it's enough",
        minutes: 4,
        bodyUz: "1D DP — dp massivi bitta indeks bilan indekslanadi: dp[i]. Bu yetarli bo'ladi, agar masalaning javobi faqat «pozitsiya i gacha bo'lgan qism» bilan to'liq aniqlansa, qo'shimcha «qaysi elementlar tanlangan» kabi tarixni bilish shart bo'lmasa (yoki bu tarix bitta qo'shimcha bitga sig'sa — dp[i][0/1] kabi). Agar masala «ikkita indeks» yoki «to'plam holati» talab qilsa, 1D yetarli emas — keyingi bosqichlarda shuni ko'ramiz.",
        bodyEn: "1D DP means the dp array is indexed by a single index: dp[i]. It's enough when the answer is fully determined by “the part of the problem up to position i”, without needing extra history like “which exact elements were chosen” (or when that history fits in one extra bit — dp[i][0/1]). If a problem needs “two indices” or “a subset state”, 1D isn't enough — we'll see that in later stages.",
      },
      {
        titleUz: "Climbing Stairs — masala sharti", titleEn: "Climbing Stairs — problem statement",
        minutes: 3,
        bodyUz: "n pog'onali zinapoyaning tepasiga chiqish kerak. Har safar 1 yoki 2 pog'ona bosish mumkin. Tepaga necha xil usul bilan chiqish mumkin? Masalan, n = 4 uchun javob 5: (1,1,1,1), (1,1,2), (1,2,1), (2,1,1), (2,2).",
        bodyEn: "You need to reach the top of an n-step staircase. Each move is 1 or 2 steps. How many distinct ways are there to reach the top? For n = 4 the answer is 5: (1,1,1,1), (1,1,2), (1,2,1), (2,1,1), (2,2).",
      },
      {
        titleUz: "Climbing Stairs — holat va yechim", titleEn: "Climbing Stairs — state and solution",
        minutes: 6,
        bodyUz: "Holat: dp[i] = i-pog'onaga yetish usullari soni. O'tish: oxirgi qadam 1 yoki 2 bo'lishi mumkin, shuning uchun dp[i] = dp[i-1] + dp[i-2] — bu Fibonachchi ketma-ketligi bilan bir xil rekurrent formula! Baza: dp[0] = 1 (bo'sh yo'l — allaqachon tepada), dp[1] = 1.",
        bodyEn: "State: dp[i] = the number of ways to reach step i. Transition: the last move was either 1 or 2 steps, so dp[i] = dp[i-1] + dp[i-2] — the same recurrence as Fibonacci! Base: dp[0] = 1 (the empty path — already at the top), dp[1] = 1.",
        cpp: "vector<long long> dp(n+1);\ndp[0]=dp[1]=1;\nfor(int i=2;i<=n;++i) dp[i]=dp[i-1]+dp[i-2];",
        python: "dp = [1] * (n + 1)\nfor i in range(2, n + 1): dp[i] = dp[i-1] + dp[i-2]",
      },
      {
        titleUz: "House Robber — masala sharti", titleEn: "House Robber — problem statement",
        minutes: 3,
        bodyUz: "Ko'chada n ta uy bor, har birida ma'lum miqdorda pul bor. Qo'shni ikkita uyni bir kechada o'g'irlab bo'lmaydi (signalizatsiya ishga tushadi). Maksimal qancha pul o'g'irlash mumkin? a = [2,7,9,3,1] uchun javob 12 (2-uy + 4-uy... aslida 1-, 3-, 5-uylar: 2+9+1=12, yoki 2- va 4-: 7+3=10 — eng yaxshisi 2+9+1=12).",
        bodyEn: "There are n houses on a street, each with a known amount of money. You cannot rob two adjacent houses in one night (the alarm triggers). What's the maximum you can steal? For a = [2,7,9,3,1] the answer is 12 (houses 1, 3, 5: 2+9+1=12).",
      },
      {
        titleUz: "House Robber — holat va yechim", titleEn: "House Robber — state and solution",
        minutes: 6,
        bodyUz: "Holat: dp[i] = i-uygacha (uni ham hisobga olib) eng ko'p o'g'irlash mumkin bo'lgan pul. O'tish: i-uyni o'g'irlamaslik (dp[i-1] qoladi) yoki o'g'irlash (dp[i-2] + a[i], chunki i-1 o'g'irlanmagan bo'lishi shart) — ikkalasidan kattasi. dp[i] = max(dp[i-1], dp[i-2] + a[i]). Bu Climbing Stairs dan farqli o'laroq — sanash emas, TANLOV (max) DP si.",
        bodyEn: "State: dp[i] = the maximum you can steal considering houses up to i (inclusive). Transition: either skip house i (dp[i-1] stays) or rob it (dp[i-2] + a[i], since i-1 must then be unrobbed) — take the larger. dp[i] = max(dp[i-1], dp[i-2] + a[i]). Unlike Climbing Stairs — this is a CHOICE (max) DP, not a counting one.",
        cpp: "vector<long long> dp(n);\ndp[0]=a[0]; dp[1]=max(a[0],a[1]);\nfor(int i=2;i<n;++i) dp[i]=max(dp[i-1],dp[i-2]+a[i]);",
        python: "dp = [0] * n\ndp[0], dp[1] = a[0], max(a[0], a[1])\nfor i in range(2, n): dp[i] = max(dp[i-1], dp[i-2] + a[i])",
      },
      {
        titleUz: "Coin Change — minimal tanga soni", titleEn: "Coin Change — minimum number of coins",
        minutes: 6,
        bodyUz: "Tanga nominallari coins[] va maqsad summa — eng kam nechta tanga bilan shu summani yig'ish mumkin? Holat: dp[s] = s summani yig'ish uchun minimal tangalar soni. O'tish: har coin c uchun dp[s] = min(dp[s], dp[s-c] + 1), s ≥ c bo'lganda. Baza: dp[0] = 0, qolganlari INF bilan boshlanadi. Agar dp[maqsad] hali INF bo'lsa — yechim yo'q.",
        bodyEn: "Given coin denominations coins[] and a target sum, find the minimum number of coins summing to it. State: dp[s] = the minimum coins to make sum s. Transition: for each coin c, dp[s] = min(dp[s], dp[s-c] + 1) when s ≥ c. Base: dp[0] = 0, everything else starts at INF. If dp[target] is still INF — no solution exists.",
        cpp: "vector<long long> dp(target+1, INF);\ndp[0]=0;\nfor(int s=1;s<=target;++s) for(int c:coins) if(s>=c) dp[s]=min(dp[s],dp[s-c]+1);",
        python: "dp = [float('inf')] * (target + 1)\ndp[0] = 0\nfor s in range(1, target + 1):\n    for c in coins:\n        if s >= c: dp[s] = min(dp[s], dp[s-c] + 1)",
      },
      {
        titleUz: "Coin Change — usullar sonini sanash", titleEn: "Coin Change — counting the number of ways",
        minutes: 5,
        bodyUz: "Endi «minimal tanga» emas, «nechta XIL usul bilan yig'ish mumkin» so'raladi. Bu yerda sikllar TARTIBI javobni o'zgartiradi: tanga bo'yicha tashqi sikl, summa bo'yicha ichki sikl yuritilsa — har kombinatsiya (tartibsiz, ya'ni {1,2} va {2,1} bir xil hisoblanadi) bir marta sanaladi. Agar tartib teskari bo'lsa (summa tashqi, tanga ichki) — bu o'rniga PERMUTATSIYALAR (tartib muhim) sanaladi — butunlay boshqa masala!",
        bodyEn: "Now the question isn't “minimum coins” but “how many DISTINCT ways can you make the sum”. Here the loop ORDER changes the answer: coin as the outer loop, sum as the inner loop counts each combination (unordered — {1,2} and {2,1} are the same) exactly once. Swap the order (sum outer, coin inner) and you instead count PERMUTATIONS (order matters) — a completely different problem!",
        cpp: "vector<long long> dp(target+1);\ndp[0]=1;\nfor(int c:coins) for(int s=c;s<=target;++s) dp[s]+=dp[s-c];",
        python: "dp = [0] * (target + 1)\ndp[0] = 1\nfor c in coins:\n    for s in range(c, target + 1): dp[s] += dp[s-c]",
      },
      {
        titleUz: "Decode Ways — masala va yechim", titleEn: "Decode Ways — problem and solution",
        minutes: 6,
        bodyUz: "Raqamli satr (masalan \"226\") berilgan, har harf A=1..Z=26 kodlangan. Nechta xil usul bilan dekodlash mumkin? \"226\" → \"BZ\" (2,26), \"VF\" (22,6), \"BBF\" (2,2,6) — javob 3. Holat: dp[i] = birinchi i belgini dekodlash usullari soni. O'tish: oxirgi belgi yolg'iz (1-9 bo'lsa) dp[i] += dp[i-1]; oxirgi ikki belgi juftlik (10-26 bo'lsa) dp[i] += dp[i-2]. '0' alohida ehtiyot talab qiladi — u yolg'iz dekodlanmaydi.",
        bodyEn: "Given a digit string (e.g. \"226\") where A=1..Z=26, how many ways can it be decoded? \"226\" → \"BZ\" (2,26), \"VF\" (22,6), \"BBF\" (2,2,6) — answer 3. State: dp[i] = the number of ways to decode the first i characters. Transition: if the last character alone is 1-9, dp[i] += dp[i-1]; if the last two characters form 10-26, dp[i] += dp[i-2]. '0' needs special care — it can never decode alone.",
        cpp: "vector<long long> dp(n+1);\ndp[0]=1;\nfor(int i=1;i<=n;++i){\n  if(s[i-1]!='0') dp[i]+=dp[i-1];\n  if(i>1){int two=stoi(s.substr(i-2,2)); if(two>=10&&two<=26) dp[i]+=dp[i-2];}\n}",
        python: "dp = [0] * (n + 1)\ndp[0] = 1\nfor i in range(1, n + 1):\n    if s[i-1] != '0': dp[i] += dp[i-1]\n    if i > 1 and 10 <= int(s[i-2:i]) <= 26: dp[i] += dp[i-2]",
      },
      {
        titleUz: "Kadane algoritmi — maksimal qism-massiv yig'indisi", titleEn: "Kadane's algorithm — maximum subarray sum",
        minutes: 5,
        bodyUz: "Massivning uzluksiz qismidagi eng katta yig'indini toping (kamida bitta element). Bu ham 1D DP: dp[i] = i da tugaydigan eng katta yig'indi. O'tish: yoki oldingi yig'indiga qo'shiladi (agar u ijobiy foyda bersa), yoki i dan yangidan boshlanadi: dp[i] = max(a[i], dp[i-1] + a[i]). Javob — barcha dp[i] ning maksimumi. Bu — Kadane algoritmi, DP shaklida.",
        bodyEn: "Find the maximum sum of a contiguous subarray (at least one element). This is also 1D DP: dp[i] = the maximum sum ending exactly at i. Transition: either extend the previous sum (if it helps) or restart at i: dp[i] = max(a[i], dp[i-1] + a[i]). The answer is the max over all dp[i]. This is Kadane's algorithm, expressed as DP.",
        cpp: "long long best=a[0], cur=a[0];\nfor(int i=1;i<n;++i){ cur=max((long long)a[i], cur+a[i]); best=max(best,cur); }",
        python: "best = cur = a[0]\nfor i in range(1, n):\n    cur = max(a[i], cur + a[i])\n    best = max(best, cur)",
      },
      {
        titleUz: "Xotira optimallashtirish: O(n) dan O(1) ga", titleEn: "Space optimization: O(n) down to O(1)",
        minutes: 5,
        bodyUz: "Diqqat qiling: yuqoridagi barcha masalalarda dp[i] faqat dp[i-1] va dp[i-2] ga bog'liq edi — butun massiv shart emas! Ikkita o'zgaruvchi (prev, prev2) yetarli. Bu xotirani O(n) dan O(1) ga tushiradi. Bu texnika faqat «doiraviy» bog'liqlik (dp[i] oxirgi bir necha qiymatga bog'liq) bo'lganda ishlaydi — Interval DP yoki Tree DP kabi turlarda ishlamaydi.",
        bodyEn: "Notice: in every problem above, dp[i] depended only on dp[i-1] and dp[i-2] — never the full array! Two variables (prev, prev2) suffice. This drops memory from O(n) to O(1). This trick only works when the dependency is “local” (dp[i] depends on the last few values) — it won't apply to types like Interval DP or Tree DP.",
        cpp: "long long prev2=1, prev=1;\nfor(int i=2;i<=n;++i){ long long cur=prev+prev2; prev2=prev; prev=cur; }",
        python: "prev2, prev = 1, 1\nfor i in range(2, n + 1):\n    prev2, prev = prev, prev + prev2",
      },
      {
        titleUz: "1D DP dagi keng tarqalgan xatolar", titleEn: "Common mistakes specific to 1D DP",
        minutes: 4,
        bodyUz: "(1) dp[i-2] ga i < 2 bo'lganda murojaat qilib, chegaradan chiqish. (2) Sanash (sum) va tanlov (max) naqshlarini aralashtirib yuborish. (3) Coin Change kabi masalalarda sikllar tartibini (combinations vs permutations) e'tiborsiz qoldirish. (4) '0' kabi maxsus holatlarni (Decode Ways) tekshirmaslik. (5) Xotira optimallashtirishda prev/prev2 ni yangilash tartibini buzish — avval prev2 = prev, keyin prev = cur bo'lishi kerak, aks holda eski qiymat yo'qoladi.",
        bodyEn: "(1) Accessing dp[i-2] when i < 2, going out of bounds. (2) Mixing up the counting (sum) and choice (max) patterns. (3) Ignoring loop order in problems like Coin Change (combinations vs permutations). (4) Not handling special cases like '0' (Decode Ways). (5) Breaking the update order for prev/prev2 — it must be prev2 = prev, then prev = cur, otherwise the old value is lost before you need it.",
      },
      {
        titleUz: "Xulosa va amaliyot", titleEn: "Recap and practice",
        minutes: 3,
        bodyUz: "1D DP — barcha DP turlarining eng sodda va eng ko'p ishlatiladigan shakli. Uch asosiy naqsh: sanash (Climbing Stairs), tanlov (House Robber), cheksiz o'tishlar to'plami (Coin Change). Har birida: to'g'ri holatni tanlang, o'tishni qarorlar ro'yxatidan chiqaring, bazani va chegaralarni tekshiring, keyin xotirani optimallang. Endi shu naqshlarni haqiqiy masalalarda mashq qiling.",
        bodyEn: "1D DP is the simplest and most common DP shape. Three core patterns: counting (Climbing Stairs), a choice (House Robber), an unbounded set of transitions (Coin Change). For each: choose the right state, derive the transition from a list of decisions, verify the base case and bounds, then optimize memory. Now practice these patterns on real problems.",
      },
    ],
  },
};
