/* Placement questions, rated the way problems are.
 *
 * The old placement asked ten fixed questions — "what does 5 % 2 print", "which
 * structure is LIFO" — and scored them equally. It could tell a complete
 * beginner from somebody who had seen a for-loop, and nothing beyond that. A
 * learner who already knew segment trees answered the same ten questions and
 * arrived at the same roadmap, still locked out of unit two.
 *
 * So every question here carries a rating on the same 800-2400 scale the
 * problem bank and the duel already use, and the test walks that scale
 * adaptively: get one right and the next is harder, get one wrong and it backs
 * off. Fourteen questions place somebody far more precisely than fifty fixed
 * ones, because each is chosen for what is still unknown about them.
 *
 * What makes a question good enough to be in here:
 *
 *   - It tests a decision, not a definition. "Which structure is LIFO" is
 *     recall; "your BFS visits a node twice, what did you forget" is the
 *     mistake people actually make.
 *   - Every wrong option is a real belief somebody holds. An option nobody
 *     would pick teaches nothing about the person who did not pick it.
 *   - The rating means what it means elsewhere: at 1500 it should separate
 *     people who have solved ~1500-rated problems from people who have not.
 *
 * `track` maps to a roadmap slug so the result can speak per section rather
 * than as a single number.
 */

export type PlacementQuestion = {
  id: string;
  track: string;
  rating: number;
  uz: string;
  en: string;
  choicesUz: string[];
  choicesEn: string[];
  correct: number;
  /* Shown after answering. The test is also a lesson: a wrong answer that
     goes unexplained is a wasted question. */
  whyUz: string;
  whyEn: string;
};

export const placementBank: PlacementQuestion[] = [
  // ------------------------------------------------------------ 800–900
  {
    id: "pb-basics-800", track: "programming-basics", rating: 800,
    uz: "`int` turidagi o‘zgaruvchiga 3 000 000 000 qiymatini bersangiz nima bo‘ladi?",
    en: "What happens if you store 3,000,000,000 in an `int`?",
    choicesUz: ["Kompilyatsiya xatosi bo‘ladi", "Qiymat toshib ketadi va boshqa son chiqadi", "Avtomatik `long long` ga o‘tadi", "Dastur ishlamay to‘xtaydi"],
    choicesEn: ["It fails to compile", "It overflows and becomes a different number", "It is promoted to `long long`", "The program crashes"],
    correct: 1,
    whyUz: "32-bitli `int` ~2.1 milliardgacha sig‘adi. Undan kattasi jimgina toshib ketadi — na xato, na ogohlantirish. Shuning uchun CP da odatda `long long` ishlatiladi.",
    whyEn: "A 32-bit `int` tops out near 2.1 billion. Anything larger wraps silently — no error, no warning. That is why competitive code reaches for `long long`.",
  },
  {
    id: "pb-foundations-800", track: "foundations", rating: 800,
    uz: "n ≤ 10^5 va sizning yechimingiz O(n²). Bir soniyada ulguradimi?",
    en: "n ≤ 10^5 and your solution is O(n²). Does it fit in one second?",
    choicesUz: ["Ha, 10^5 kichik son", "Yo‘q — taxminan 10^10 amal bo‘ladi", "Kompyuter tezligiga bog‘liq, aytib bo‘lmaydi", "Faqat C++ da ulguradi"],
    choicesEn: ["Yes, 10^5 is small", "No — that is about 10^10 operations", "Impossible to say, it depends on the machine", "Only in C++"],
    correct: 1,
    whyUz: "(10^5)² = 10^10. Bir soniyada taxminan 10^8 amal bajariladi, ya'ni 100 barobar ko‘p. Cheklovni o‘qib murakkablikni tanlash — birinchi qadam.",
    whyEn: "(10^5)² = 10^10. About 10^8 operations fit in a second, so this is 100× over. Reading the constraint to pick the complexity is the first move.",
  },
  {
    id: "pb-sorting-900", track: "sorting", rating: 900,
    uz: "Massivni saralab, keyin qo‘shni juftlarni tekshirsangiz, qaysi masalani O(n log n) da yechasiz?",
    en: "Sorting an array and then scanning adjacent pairs solves which problem in O(n log n)?",
    choicesUz: ["Eng katta qism-yig‘indi", "Ikki eng yaqin sonning farqi", "Eng ko‘p uchraydigan element", "Massivdagi inversiyalar soni"],
    choicesEn: ["Maximum subarray sum", "Smallest difference between any two values", "Most frequent element", "Number of inversions"],
    correct: 1,
    whyUz: "Saralangandan keyin eng yaqin ikki son albatta qo‘shni bo‘ladi. Qolgan uchtasi saralashdan keyin ham qo‘shni juftlar bilan yechilmaydi.",
    whyEn: "After sorting, the two closest values are necessarily neighbours. The other three are not answered by an adjacent-pair scan.",
  },
  {
    id: "pb-basics-900", track: "programming-basics", rating: 900,
    uz: "`vector<int> v; v.push_back(x);` ni n marta bajarish umumiy qancha vaqt oladi?",
    en: "Calling `v.push_back(x)` n times on a `vector<int>` costs how much in total?",
    choicesUz: ["O(n²) — har safar ko‘chiriladi", "O(n) — amortizatsiya qilingan", "O(n log n)", "Oldindan `reserve` qilmasa aniqlab bo‘lmaydi"],
    choicesEn: ["O(n²) — it copies every time", "O(n) — amortised", "O(n log n)", "Undefined without calling `reserve` first"],
    correct: 1,
    whyUz: "Vector to‘lganda hajmini ikki barobar oshiradi, shuning uchun ko‘chirishlar yig‘indisi n dan oshmaydi. Bu amortizatsiya tushunchasining klassik misoli.",
    whyEn: "A vector doubles its capacity when full, so the total copying is bounded by n. This is the textbook example of amortised cost.",
  },

  // ------------------------------------------------------------ 1000–1200
  {
    id: "pb-binary-1000", track: "binary-search", rating: 1000,
    uz: "Binary search ishlashi uchun massiv haqida nima rost bo‘lishi kerak?",
    en: "What must be true of the array for binary search to work?",
    choicesUz: ["Elementlar unikal bo‘lishi", "Qidirilayotgan shart bo‘yicha monoton bo‘lishi", "Elementlar musbat bo‘lishi", "Uzunligi 2 ning darajasi bo‘lishi"],
    choicesEn: ["The elements are unique", "It is monotone with respect to the predicate", "The elements are positive", "Its length is a power of two"],
    correct: 1,
    whyUz: "Muhimi tartiblanganlik emas, monotonlik: «shart qayerdan boshlab doim rost» degan savolga javob bo‘lsa kifoya. Shuning uchun javob ustida ham binary search qilinadi.",
    whyEn: "The requirement is monotonicity, not sortedness: the predicate must switch from false to true exactly once. That is why you can binary search on the answer.",
  },
  {
    id: "pb-ds-1100", track: "data-structures", rating: 1100,
    uz: "n ta so‘rovda «shu paytgacha ko‘rilgan eng kichik element» kerak. Qaysi tuzilma mos?",
    en: "You need the smallest element seen so far, after each of n insertions. Which structure?",
    choicesUz: ["Stack", "Bitta o‘zgaruvchi yetarli", "Priority queue", "Balanced BST"],
    choicesEn: ["A stack", "A single variable is enough", "A priority queue", "A balanced BST"],
    correct: 1,
    whyUz: "O‘chirish yo‘q ekan, minimum hech qachon ortmaydi — bitta o‘zgaruvchida saqlash yetarli. Keraksiz tuzilmani tanlash ham xato: eng sodda yechimni ko‘ra bilish muhim.",
    whyEn: "With no deletions the minimum never increases, so one variable suffices. Reaching for a heavier structure is its own mistake — seeing the simplest answer matters.",
  },
  {
    id: "pb-math-1200", track: "math", rating: 1200,
    uz: "(a · b) mod m ni hisoblayapsiz, a va b ~10^9. `long long` da nima bo‘ladi?",
    en: "You compute (a · b) mod m with a and b near 10^9, in `long long`. What happens?",
    choicesUz: ["Toshib ketadi, `__int128` kerak", "To‘g‘ri ishlaydi — 10^18 `long long` ga sig‘adi", "Natija manfiy bo‘ladi", "m tub bo‘lsagina ishlaydi"],
    choicesEn: ["It overflows; you need `__int128`", "It works — 10^18 fits in `long long`", "The result goes negative", "It works only if m is prime"],
    correct: 1,
    whyUz: "10^9 × 10^9 = 10^18, `long long` esa ~9.2·10^18 gacha. Toshish m ~10^18 bo‘lganda boshlanadi — shundagina `__int128` kerak.",
    whyEn: "10^9 × 10^9 = 10^18 and `long long` reaches ~9.2·10^18. Overflow starts when m itself approaches 10^18 — that is when `__int128` earns its place.",
  },
  {
    id: "pb-twop-1200", track: "two-pointers", rating: 1200,
    uz: "Sliding window bilan «yig‘indisi ≤ K bo‘lgan eng uzun bo‘lak» ni topyapsiz. Massivda manfiy sonlar bo‘lsa nima bo‘ladi?",
    en: "You use a sliding window for the longest subarray with sum ≤ K. What breaks if the array has negatives?",
    choicesUz: ["Hech nima — usul baribir ishlaydi", "Oyna qisqarishi kerak bo‘lgan payt aniqlanmay qoladi", "Faqat sekinlashadi", "Javob har doim 0 chiqadi"],
    choicesEn: ["Nothing — it still works", "Shrinking the window is no longer a valid rule", "It only gets slower", "The answer is always 0"],
    correct: 1,
    whyUz: "Sliding window yig‘indi monoton o‘sishiga tayanadi. Manfiy son bo‘lsa oynani kengaytirish yig‘indini kamaytirishi mumkin — bunda prefiks yig‘indi + boshqa usul kerak.",
    whyEn: "The window relies on the sum growing as you extend. With negatives, extending can lower the sum, so the shrink rule no longer holds and you need prefix sums instead.",
  },

  // ------------------------------------------------------------ 1300–1500
  {
    id: "pb-graphs-1300", track: "graphs", rating: 1300,
    uz: "BFS da bir tugun ikki marta navbatga tushib qolyapti. Nima esdan chiqqan?",
    en: "Your BFS puts the same node in the queue twice. What did you forget?",
    choicesUz: ["Navbat o‘rniga stack ishlatish", "Tugunni navbatga qo‘shayotganda belgilash", "Qirralarni saralash", "Ko‘rilganlarni chiqarishda belgilash"],
    choicesEn: ["To use a stack instead of a queue", "To mark the node when you enqueue it", "To sort the edges", "To mark nodes when you dequeue them"],
    correct: 1,
    whyUz: "Belgilashni navbatdan olishga qoldirsangiz, bir tugun bir necha qo‘shnisi orqali qo‘shilib ulguradi. Belgilash qo‘shish paytida bo‘lishi kerak.",
    whyEn: "If you mark on dequeue, a node can be enqueued by several neighbours first. Marking must happen at enqueue time.",
  },
  {
    id: "pb-greedy-1400", track: "greedy", rating: 1400,
    uz: "Kesishmaydigan eng ko‘p tadbirni tanlash uchun nima bo‘yicha saralash kerak?",
    en: "To select the most non-overlapping activities, you sort by what?",
    choicesUz: ["Boshlanish vaqti bo‘yicha", "Tugash vaqti bo‘yicha", "Davomiyligi bo‘yicha", "Kesishuvlar soni bo‘yicha"],
    choicesEn: ["Start time", "Finish time", "Duration", "Number of conflicts"],
    correct: 1,
    whyUz: "Eng erta tugaydiganini olish keyingilarga eng ko‘p joy qoldiradi. Boshlanish yoki davomiylik bo‘yicha saralash — bu masalada eng ko‘p uchraydigan noto‘g‘ri greedy.",
    whyEn: "Taking the earliest finish leaves the most room for what follows. Sorting by start or by duration is the classic greedy that looks right and is not.",
  },
  {
    id: "pb-strings-1400", track: "strings", rating: 1400,
    uz: "«s ichida p necha marta uchraydi» — kesishuvlar ham sanaladi. `aaaa` ichida `aa` nechta?",
    en: "Counting occurrences of p in s, overlaps included: how many times is `aa` in `aaaa`?",
    choicesUz: ["2", "3", "4", "1"],
    choicesEn: ["2", "3", "4", "1"],
    correct: 1,
    whyUz: "Pozitsiyalar 0, 1, 2 — uchta. Har moslikdan keyin |p| ta belgi oldinga sakrasangiz 2 chiqadi, bu esa kesishuvlarni yo‘qotadi.",
    whyEn: "Positions 0, 1 and 2 — three. Skipping |p| characters after each match gives 2, which is exactly the overlap bug.",
  },
  {
    id: "pb-dp-1500", track: "dynamic-programming", rating: 1500,
    uz: "0/1 knapsack da hajm bo‘yicha sikl **o‘sish** tartibida yozilsa nima bo‘ladi?",
    en: "In 0/1 knapsack, what happens if you loop capacity in increasing order?",
    choicesUz: ["Tezroq ishlaydi", "Har bir buyum bir necha marta olinadi", "Javob har doim kichrayadi", "Hech nima o‘zgarmaydi"],
    choicesEn: ["It runs faster", "Each item can be taken more than once", "The answer only gets smaller", "Nothing changes"],
    correct: 1,
    whyUz: "O‘sish tartibida `dp[c-w]` shu buyum bilan allaqachon yangilangan bo‘ladi — bu cheksiz knapsack. 0/1 uchun hajm kamayish tartibida kezilishi shart.",
    whyEn: "Going upward, `dp[c-w]` has already been updated with the same item — that is the unbounded knapsack. 0/1 requires the descending sweep.",
  },
  {
    id: "pb-backtracking-1500", track: "backtracking", rating: 1500,
    uz: "Backtracking da «pruning» nimani anglatadi?",
    en: "In backtracking, what does pruning mean?",
    choicesUz: ["Rekursiya chuqurligini cheklash", "Yechimga olib bora olmaydigan shoxni erta tashlab ketish", "Natijalarni keshda saqlash", "Sikl bilan almashtirish"],
    choicesEn: ["Capping the recursion depth", "Abandoning a branch early once it cannot lead to a solution", "Caching results", "Rewriting it as a loop"],
    correct: 1,
    whyUz: "Pruning — holatlar daraxtining foydasiz qismini kesish. Chuqurlikni cheklash boshqa narsa va ko‘pincha to‘g‘ri javobni ham yo‘qotadi.",
    whyEn: "Pruning cuts the useless part of the state tree. Capping depth is a different thing and usually throws away correct answers with it.",
  },

  // ------------------------------------------------------------ 1600–1800
  {
    id: "pb-graphs-1600", track: "graphs", rating: 1600,
    uz: "Dijkstra manfiy og‘irlikli qirrada nega ishlamaydi?",
    en: "Why does Dijkstra fail on negative edge weights?",
    choicesUz: ["Priority queue manfiy sonni qabul qilmaydi", "Yakunlangan deb belgilangan tugun keyin arzonroq bo‘lib qolishi mumkin", "Cheksiz siklga tushadi", "Ishlaydi, faqat sekin"],
    choicesEn: ["The priority queue rejects negatives", "A node marked final can later become cheaper", "It loops forever", "It works, just slowly"],
    correct: 1,
    whyUz: "Dijkstra «eng yaqin tugun yakuniy» degan taxminga tayanadi. Manfiy qirra shu taxminni buzadi — o‘shanda Bellman-Ford kerak.",
    whyEn: "Dijkstra assumes the nearest unfinished node is final. A negative edge breaks that assumption, which is where Bellman-Ford comes in.",
  },
  {
    id: "pb-ds-1700", track: "data-structures", rating: 1700,
    uz: "Segment tree o‘rniga prefiks yig‘indi yetarli bo‘lgan holat qaysi?",
    en: "When is a prefix-sum array enough, and a segment tree unnecessary?",
    choicesUz: ["So‘rovlar orasida massiv o‘zgarmasa", "Massiv kichik bo‘lsa", "Faqat yig‘indi so‘ralsa", "Elementlar musbat bo‘lsa"],
    choicesEn: ["The array never changes between queries", "The array is small", "Only sums are queried", "All elements are positive"],
    correct: 0,
    whyUz: "Prefiks yig‘indi statik massivda O(1) beradi. Yangilanish paydo bo‘lishi bilan uni qayta qurish O(n) turadi — o‘shanda segment tree yoki BIT kerak.",
    whyEn: "Prefix sums answer in O(1) on a static array. The moment updates appear, rebuilding costs O(n), and that is what a segment tree or BIT is for.",
  },
  {
    id: "pb-trees-1700", track: "trees", rating: 1700,
    uz: "Daraxt diametrini ikki marta BFS bilan topish: birinchi BFS nimani beradi?",
    en: "Finding a tree's diameter with two BFS runs: what does the first one give you?",
    choicesUz: ["Diametrning o‘zini", "Diametr uchlaridan biri bo‘lgan tugunni", "Daraxt markazini", "Barglar sonini"],
    choicesEn: ["The diameter itself", "A node that is an endpoint of some diameter", "The centre of the tree", "The number of leaves"],
    correct: 1,
    whyUz: "Ixtiyoriy tugundan eng uzoqdagi tugun albatta diametr uchi bo‘ladi. Ikkinchi BFS o‘sha uchdan yurib, uzunlikni beradi.",
    whyEn: "The farthest node from any start is provably a diameter endpoint. The second BFS starts there and measures the length.",
  },
  {
    id: "pb-dp-1800", track: "dynamic-programming", rating: 1800,
    uz: "DP holatini `dp[i][j]` dan `dp[j]` ga siqmoqchisiz. Buning uchun nima rost bo‘lishi kerak?",
    en: "You want to compress a DP from `dp[i][j]` to `dp[j]`. What must hold?",
    choicesUz: ["j har doim i dan kichik bo‘lishi", "Har bir qator faqat oldingi qatorga bog‘liq bo‘lishi", "Qiymatlar musbat bo‘lishi", "n kichik bo‘lishi"],
    choicesEn: ["j is always less than i", "Each row depends only on the previous row", "All values are positive", "n is small"],
    correct: 1,
    whyUz: "Faqat oldingi qator kerak bo‘lsa, ikkita massiv (yoki bittasi, to‘g‘ri yo‘nalishda) yetarli. Ikki qator orqaga qarasa, siqib bo‘lmaydi.",
    whyEn: "If only the previous row is needed, two arrays — or one, swept in the right direction — suffice. Reaching two rows back kills the compression.",
  },
  {
    id: "pb-geometry-1800", track: "geometry", rating: 1800,
    uz: "Uch nuqtaning yo‘nalishini (chapga/o‘ngga burilish) qanday aniqlaysiz?",
    en: "How do you decide the turn direction of three points?",
    choicesUz: ["Masofalarni taqqoslab", "Vektor ko‘paytmasi (cross product) ishorasi bilan", "Burchaklarni `atan2` bilan hisoblab", "Skalyar ko‘paytma bilan"],
    choicesEn: ["By comparing distances", "By the sign of the cross product", "By computing angles with `atan2`", "By the dot product"],
    correct: 1,
    whyUz: "Cross product ishorasi butun sonlarda aniq javob beradi. `atan2` — haqiqiy sonlar, ya'ni aniqlik xatosi; geometriyada iloji boricha butun sonlarda qolish kerak.",
    whyEn: "The cross product's sign answers exactly in integers. `atan2` brings floating point and its rounding with it; geometry stays in integers wherever it can.",
  },

  // ------------------------------------------------------------ 1900–2200
  {
    id: "pb-advanced-1900", track: "advanced-cp", rating: 1900,
    uz: "DSU da «union by rank» va «path compression» birga nima beradi?",
    en: "What do union by rank and path compression together give a DSU?",
    choicesUz: ["Amal boshiga O(log n)", "Amal boshiga deyarli O(1) (teskari Akkerman)", "O(n) qurilish, keyin O(1)", "Faqat xotira tejaydi"],
    choicesEn: ["O(log n) per operation", "Effectively O(1) per operation (inverse Ackermann)", "O(n) to build, then O(1)", "Only a memory saving"],
    correct: 1,
    whyUz: "Ikkalasi birga amortizatsiyalangan α(n) beradi — amalda o‘zgarmas. Bittasi yolg‘iz qolsa O(log n) bo‘lib qoladi.",
    whyEn: "Together they give amortised α(n), constant for any real n. Either one alone leaves you at O(log n).",
  },
  {
    id: "pb-strings-2000", track: "strings", rating: 2000,
    uz: "KMP dagi prefiks-funksiya π[i] nimani bildiradi?",
    en: "What does the KMP prefix function π[i] mean?",
    choicesUz: ["i-pozitsiyagacha bo‘lgan mosliklar soni", "s[0..i] ning ham prefiks, ham suffiks bo‘lgan eng uzun xos bo‘lagi uzunligi", "Keyingi taqqoslash pozitsiyasi", "Alifbodagi belgilar soni"],
    choicesEn: ["The number of matches up to i", "The longest proper border of s[0..i] — both a prefix and a suffix", "The next comparison index", "The alphabet size"],
    correct: 1,
    whyUz: "π[i] — «border» uzunligi. Moslik uzilganda shu qiymat qayerdan davom etishni aytadi, shuning uchun KMP hech qachon orqaga qaytmaydi.",
    whyEn: "π[i] is the border length. On a mismatch it says where to continue, which is why KMP never steps backwards in the text.",
  },
  {
    id: "pb-advanced-2200", track: "advanced-cp", rating: 2200,
    uz: "Har bir so‘rovda [l, r] oralig‘idagi turli sonlar soni kerak, massiv o‘zgarmaydi, so‘rovlar oldindan ma'lum. Qaysi yondashuv?",
    en: "Each query asks for the number of distinct values in [l, r]; the array is static and all queries are known in advance. Which approach?",
    choicesUz: ["Har so‘rov uchun set bilan yurish", "So‘rovlarni r bo‘yicha saralab, BIT bilan oflayn", "Segment tree beam search", "Har so‘rovga binary search"],
    choicesEn: ["Walk each range with a set", "Sort queries by r and sweep with a BIT, offline", "A segment tree beam search", "Binary search per query"],
    correct: 1,
    whyUz: "So‘rovlar oldindan ma'lum bo‘lgani — oflayn ishlashga ruxsat. r bo‘yicha saralab, har qiymatning oxirgi uchrashini BIT da saqlab yurish klassik yechim.",
    whyEn: "Knowing the queries up front is permission to go offline. Sorting by r and keeping each value's last occurrence in a BIT is the standard sweep.",
  },
];

/** Nearest unasked question to a target rating, preferring a track that has not
 *  been probed yet — one question about graphs tells you more than a fourth
 *  question about sorting. */
export function pickQuestion(
  target: number, asked: Set<string>, seenTracks: Set<string>,
): PlacementQuestion | null {
  const pool = placementBank.filter((q) => !asked.has(q.id));
  if (!pool.length) return null;
  const cost = (q: PlacementQuestion) =>
    Math.abs(q.rating - target) + (seenTracks.has(q.track) ? 250 : 0);
  return pool.reduce((best, q) => (cost(q) < cost(best) ? q : best), pool[0]);
}


/* Twenty of the twenty-one questions here were written with the correct answer
   second, which a learner spots within about four questions and then stops
   reading the options. Rather than hand-shuffling the source — which drifts
   again the moment a question is added — the options are permuted every time a
   question is shown. It also means a retake is not the same test twice.
 */
export type ShownQuestion = {
  question: PlacementQuestion;
  /** Original option indices, in the order they are displayed. */
  order: number[];
  /** Where the correct option ended up. */
  correctAt: number;
};

export function shuffleOptions(question: PlacementQuestion): ShownQuestion {
  const order = question.choicesUz.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { question, order, correctAt: order.indexOf(question.correct) };
}

/** The options as displayed, in the shuffled order. */
export const shownChoices = (shown: ShownQuestion, lang: "uz" | "en") =>
  shown.order.map((i) => (lang === "uz" ? shown.question.choicesUz[i] : shown.question.choicesEn[i]));
