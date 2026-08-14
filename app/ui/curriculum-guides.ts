type Localized = { uz: string; en: string };
export type CurriculumGuide = {
  intuition: Localized;
  invariant: Localized;
  vocabulary: Localized;
  workedExample: Localized;
  mistakes: Localized[];
  recognition: Localized;
};

const guides: Record<string, CurriculumGuide> = {
  "programming-basics": {
    intuition: { uz: "Dastur — kirishni aniq modelga aylantirib, cheklangan qadamlar orqali chiqish beradigan ko‘rsatmalar ketma-ketligi.", en: "A program turns input into a precise model and produces output through a finite sequence of steps." },
    invariant: { uz: "Har amal oldidan o‘zgaruvchi turi, qiymat oralig‘i va indeks chegarasi ma’lum bo‘lsin.", en: "Before each operation, know every variable’s type, value range, and index boundary." },
    vocabulary: { uz: "tur, qiymat, ifoda, boshqaruv oqimi, indeks, funksiya", en: "type, value, expression, control flow, index, function" },
    workedExample: { uz: "12 va 30 ni o‘qing, long long ichida qo‘shing, 42 ni yangi qatorda chiqaring.", en: "Read 12 and 30, add them in a wide integer type, and print 42 on a new line." },
    mistakes: [{ uz: "Katta qiymatlarda int overflowini e’tiborsiz qoldirish.", en: "Ignoring integer overflow for large values." }, { uz: "Massivning 0 va n−1 chegaralarini adashtirish.", en: "Confusing array boundaries 0 and n−1." }],
    recognition: { uz: "Masala asosan inputni to‘g‘ri o‘qish, shartni ifodalash yoki oddiy sikl talab qilsa, shu asoslar yetarli.", en: "Use these foundations when the task is mostly input parsing, conditions, or a direct loop." },
  },
  foundations: {
    intuition: { uz: "Algoritmni koddan oldin kirish hajmi bilan o‘sadigan amallar soni sifatida ko‘ring.", en: "Before coding, view an algorithm as an operation count that grows with input size." },
    invariant: { uz: "Baholashda eng tez o‘suvchi had qoladi; vaqt va xotira alohida hisoblanadi.", en: "Keep the fastest-growing term and analyze time and memory independently." },
    vocabulary: { uz: "Big O, yuqori chegara, amortizatsiya, vaqt, xotira, cheklov", en: "Big O, upper bound, amortization, time, memory, constraint" },
    workedExample: { uz: "n ta elementni bir marta ko‘rish n amal, ichma-ich ikki to‘liq sikl esa taxminan n² amal beradi.", en: "One pass over n items costs n operations; two full nested loops cost roughly n²." },
    mistakes: [{ uz: "Konstantani optimallashtirib, noto‘g‘ri murakkablik sinfini tanlash.", en: "Optimizing constants while choosing the wrong complexity class." }, { uz: "Worst-case talabini average-case bilan almashtirish.", en: "Replacing a required worst case with an average case." }],
    recognition: { uz: "n 2·10⁵ atrofida bo‘lsa, odatda O(n) yoki O(n log n); n 20 bo‘lsa eksponensial usul ham mumkin.", en: "Around n=2·10⁵ usually suggests O(n) or O(n log n); n=20 may allow exponential work." },
  },
  sorting: {
    intuition: { uz: "Saralash tartibsiz tanlovlarni qo‘shni yoki indeks bo‘yicha tekshiriladigan holatga keltiradi.", en: "Sorting turns unordered choices into relationships that can be checked locally or by index." },
    invariant: { uz: "Algoritmning tugallangan prefiksi yoki birlashtirilgan qismi doimo tartiblangan bo‘lib qoladi.", en: "The completed prefix or merged segment remains sorted at every step." },
    vocabulary: { uz: "barqarorlik, comparator, inversion, merge, partition", en: "stability, comparator, inversion, merge, partition" },
    workedExample: { uz: "[4,1,3,2] ni [1,4] va [2,3] qismlariga tartiblab, ikki ko‘rsatkich bilan [1,2,3,4] ga birlashtiring.", en: "Sort [4,1,3,2] into [1,4] and [2,3], then merge them with two pointers." },
    mistakes: [{ uz: "Comparatorni qat’iy tartib bermaydigan qilib yozish.", en: "Writing a comparator that is not a strict ordering." }, { uz: "Stable tartib talabini sezmaslik.", en: "Missing a stability requirement." }],
    recognition: { uz: "Qo‘shnilar, interval uchlari yoki bir xil qiymatlarni guruhlash kerak bo‘lsa, avval saralashni sinang.", en: "Try sorting when neighbors, interval endpoints, or groups of equal values matter." },
  },
  backtracking: {
    intuition: { uz: "Yechim fazosini daraxt deb oling: tanlang, chuqurlashing, holatni aynan qaytaring.", en: "Treat the solution space as a tree: choose, recurse, then restore state exactly." },
    invariant: { uz: "Har rekursiv chaqiriqda holat shu prefiks tanlovlarini va faqat ularni ifodalaydi.", en: "At each recursive call, state represents exactly the choices on the current prefix." },
    vocabulary: { uz: "holat daraxti, pruning, undo, kombinatsiya, permutatsiya", en: "state tree, pruning, undo, combination, permutation" },
    workedExample: { uz: "{1,2,3} qism to‘plamlari uchun har elementda olish/olmaslik shoxini oching; chuqurlik 3 bo‘ladi.", en: "For subsets of {1,2,3}, branch on take/skip for each item; the depth is three." },
    mistakes: [{ uz: "Rekursiyadan qaytganda o‘zgargan holatni tiklamaslik.", en: "Failing to restore mutated state after recursion." }, { uz: "Erta pruning shartini isbotsiz qo‘llash.", en: "Applying an unproven pruning condition." }],
    recognition: { uz: "n kichik, barcha konfiguratsiya kerak va qisman yechimning imkonsizligini erta bilish mumkin bo‘lsa ishlating.", en: "Use it when n is small, configurations matter, and impossible partial states can be cut early." },
  },
  math: {
    intuition: { uz: "Katta hisobni algebraik xossa orqali kichik, takrorlanuvchi amallarga ajrating.", en: "Use algebraic properties to reduce large calculations to small repeatable operations." },
    invariant: { uz: "Modul ostida ekvivalentlik saqlanadi; bo‘lish faqat teskari element mavjud bo‘lsa ruxsat.", en: "Congruence is preserved modulo m; division is valid only when an inverse exists." },
    vocabulary: { uz: "EKUB, modul, kongruensiya, tub son, teskari element", en: "GCD, modulus, congruence, prime, modular inverse" },
    workedExample: { uz: "2¹³ ni tez darajada 13 ning bitlari bo‘yicha 2,4,16,… kvadratlab va kerakli qiymatlarni ko‘paytirib toping.", en: "Compute 2¹³ by repeated squaring and multiply powers selected by the bits of 13." },
    mistakes: [{ uz: "Modul ostida oddiy bo‘lish.", en: "Using ordinary division under a modulus." }, { uz: "Ko‘paytirishda oraliq overflowini unutish.", en: "Forgetting overflow in intermediate products." }],
    recognition: { uz: "Javob juda katta, davriylik bor yoki bo‘linuvchanlik so‘ralsa sonlar nazariyasi vositalarini tekshiring.", en: "Look for number theory when values are huge, periodicity appears, or divisibility is central." },
  },
  "data-structures": {
    intuition: { uz: "Ma’lumot tuzilmasi — qaysi so‘rov tez bo‘lishini oldindan tanlashdir.", en: "A data structure is a deliberate choice about which operations must be fast." },
    invariant: { uz: "Har yangilashdan so‘ng saqlanadigan agregat asosiy massivning aynan shu oralig‘ini ifodalaydi.", en: "After every update, each stored aggregate represents exactly its assigned range." },
    vocabulary: { uz: "stack, queue, heap, DSU, Fenwick, segment tree", en: "stack, queue, heap, DSU, Fenwick tree, segment tree" },
    workedExample: { uz: "Minimumni tez olish uchun elementlarni heapga qo‘shing; root har doim hozirgi minimum bo‘ladi.", en: "Insert values into a min-heap; its root always holds the current minimum." },
    mistakes: [{ uz: "Noto‘g‘ri tuzilma tanlab, kerakli amalni O(n) qoldirish.", en: "Choosing a structure that leaves the key operation at O(n)." }, { uz: "Indeks bazasini 0 va 1 orasida aralashtirish.", en: "Mixing zero-based and one-based indexing." }],
    recognition: { uz: "Ko‘p marta qo‘shish/o‘chirish va min, summa yoki bog‘lanish so‘rovi bo‘lsa maxsus tuzilma kerak.", en: "Repeated updates plus min, sum, or connectivity queries signal a specialized structure." },
  },
  "binary-search": {
    intuition: { uz: "Monoton shart javoblar fazosini yolg‘on va rost bo‘lakka ajratadi; chegara har safar yarmiga qisqaradi.", en: "A monotone predicate splits the search space into false and true regions, halving the boundary each step." },
    invariant: { uz: "Chap va o‘ng chegaralar orasida izlanayotgan o‘tish nuqtasi doimo qoladi.", en: "The desired transition point always remains between the maintained boundaries." },
    vocabulary: { uz: "monoton predikat, lower_bound, first true, chegara", en: "monotone predicate, lower_bound, first true, boundary" },
    workedExample: { uz: "[1,3,3,7] da 3 ning birinchi indeksini topish uchun a[mid]≥3 shartining birinchi rost joyini qidiring.", en: "In [1,3,3,7], find the first 3 by searching for the first index where a[mid]≥3." },
    mistakes: [{ uz: "Chegaralarni yangilab, intervalni qisqartirmaslik.", en: "Updating bounds without shrinking the interval." }, { uz: "Javob bo‘yicha qidirishda predikat monotonligini isbotlamaslik.", en: "Not proving monotonicity in binary search on the answer." }],
    recognition: { uz: "‘Eng kichik mumkin bo‘lgan’ javob va uni tekshiruvchi monoton funksiya bo‘lsa, javob bo‘yicha qidiring.", en: "When asked for the minimum feasible value and feasibility is monotone, binary-search the answer." },
  },
  greedy: {
    intuition: { uz: "Kelajakdagi imkoniyatni eng ko‘p saqlaydigan mahalliy tanlovni qiling va exchange argument bilan isbotlang.", en: "Make the local choice that preserves the most future freedom, then prove it with an exchange argument." },
    invariant: { uz: "Tanlangan prefiksni biror optimal yechimning prefiksiga almashtirish mumkin.", en: "The chosen prefix can be transformed into the prefix of some optimal solution." },
    vocabulary: { uz: "mahalliy optimum, exchange argument, interval, deadline", en: "local optimum, exchange argument, interval, deadline" },
    workedExample: { uz: "Eng ko‘p kesishmaydigan interval uchun tugash vaqti eng kichik intervalni ketma-ket tanlang.", en: "For maximum non-overlapping intervals, repeatedly choose the interval that finishes first." },
    mistakes: [{ uz: "Faqat intuitiv ko‘ringani uchun greedy tanlash.", en: "Choosing greedily only because it feels intuitive." }, { uz: "Saralash mezonini noto‘g‘ri olish.", en: "Sorting by the wrong criterion." }],
    recognition: { uz: "Tanlovdan keyin qolgan masala shu shaklda qolsa va exchange argument ishlasa greedy ehtimoli yuqori.", en: "Greedy is promising when the remainder keeps the same form and an exchange argument works." },
  },
  graphs: {
    intuition: { uz: "Obyektlarni tugun, munosabatlarni qirra qilib, masalani yetib borish yoki yo‘l topishga aylantiring.", en: "Model objects as vertices and relationships as edges, then solve reachability or path questions." },
    invariant: { uz: "BFS navbatidan chiqqan tugunning masofasi og‘irliksiz grafda yakuniy eng qisqa masofadir.", en: "In an unweighted graph, a vertex popped by BFS has its final shortest distance." },
    vocabulary: { uz: "tugun, qirra, komponent, BFS, DFS, shortest path", en: "vertex, edge, component, BFS, DFS, shortest path" },
    workedExample: { uz: "Labirint kataklarini tugun deb, yonma-yon bo‘sh kataklarni qirra deb oling; BFS eng kam qadamni beradi.", en: "Treat open maze cells as vertices and adjacent cells as edges; BFS gives the fewest steps." },
    mistakes: [{ uz: "Yo‘naltirilgan qirrani ikki tomonlama qo‘shish.", en: "Adding a directed edge in both directions." }, { uz: "Visited holatini navbatga qo‘shganda emas, olganda belgilash.", en: "Marking visited on pop instead of enqueue." }],
    recognition: { uz: "Aloqa, yo‘l, bog‘liqlik, transformatsiya yoki holatlar orasidagi o‘tish bo‘lsa graf modelini sinang.", en: "Try a graph model for connections, routes, dependencies, transformations, or state transitions." },
  },
  strings: {
    intuition: { uz: "Takroriy prefiks va suffikslarni qayta solishtirmay, oldingi moslik ma’lumotini davom ettiring.", en: "Reuse previous prefix/suffix matches instead of comparing characters from scratch." },
    invariant: { uz: "Har pozitsiyada saqlangan qiymat shu yerda tugaydigan eng uzun mos prefiks uzunligidir.", en: "At each position, the stored value is the longest matching prefix ending there." },
    vocabulary: { uz: "prefiks, suffiks, border, hash, KMP, trie", en: "prefix, suffix, border, hash, KMP, trie" },
    workedExample: { uz: "‘ababa’ uchun prefix function qiymatlari oldingi borderga qaytish orqali chiziqli vaqtda topiladi.", en: "For ‘ababa’, prefix-function values are found in linear time by falling back through earlier borders." },
    mistakes: [{ uz: "Rolling hash collisionini mutlaq tenglik deb qabul qilish.", en: "Treating a rolling-hash match as absolute equality." }, { uz: "Prefiks va suffiks chegaralarini aralashtirish.", en: "Mixing prefix and suffix boundaries." }],
    recognition: { uz: "Ko‘p pattern qidirish, period yoki umumiy prefiks so‘ralsa string algoritmini tanlang.", en: "Use string algorithms for repeated pattern search, periods, or shared prefixes." },
  },
  geometry: {
    intuition: { uz: "Rasm o‘rniga vektor va orientatsiya belgisi bilan fazoviy munosabatni algebraik tekshiring.", en: "Replace the picture with vectors and orientation signs that can be checked algebraically." },
    invariant: { uz: "Cross product belgisi burilish yo‘nalishini, moduli esa parallelogram yuzini ifodalaydi.", en: "The cross-product sign gives turn direction; its magnitude gives parallelogram area." },
    vocabulary: { uz: "vektor, cross product, orientatsiya, segment, convex hull", en: "vector, cross product, orientation, segment, convex hull" },
    workedExample: { uz: "(0,0)→(2,0) va (0,0)→(1,1) crossi 2: ikkinchi vektor chap tomonda.", en: "The cross product of (2,0) and (1,1) is 2, so the second vector lies to the left." },
    mistakes: [{ uz: "Koordinata ko‘paytmasida 64-bit kerakligini unutish.", en: "Forgetting that coordinate products may require 64-bit integers." }, { uz: "Kollinear nuqtalar siyosatini aniq belgilamaslik.", en: "Not defining how collinear points are handled." }],
    recognition: { uz: "Chap/o‘ng tomon, kesishish, maydon yoki tashqi chegara so‘ralsa vektor formulalarini ishlating.", en: "Use vector formulas for left/right tests, intersections, area, or outer boundaries." },
  },
  "two-pointers": {
    intuition: { uz: "Ikki chegara faqat oldinga yurib, bir xil elementni qayta-qayta ko‘rishni yo‘qotadi.", en: "Two monotone boundaries avoid revisiting the same elements." },
    invariant: { uz: "[l,r) oynasi hozirgi shartni ifodalaydi; har element ko‘pi bilan bir kirib, bir chiqadi.", en: "Window [l,r) represents the current condition; each item enters and leaves at most once." },
    vocabulary: { uz: "chap, o‘ng, sliding window, monotonlik, chastota", en: "left, right, sliding window, monotonicity, frequency" },
    workedExample: { uz: "Yig‘indisi ≤S bo‘lgan eng uzun musbat segmentda r ni kengaytiring, shart buzilsa l ni suring.", en: "For the longest positive-sum segment ≤S, expand r and advance l whenever the condition breaks." },
    mistakes: [{ uz: "Manfiy sonlar monotonlikni buzishini sezmaslik.", en: "Missing that negative values break monotonicity." }, { uz: "Oynadan elementni chiqarishda agregatni yangilamaslik.", en: "Not updating aggregates when removing an item." }],
    recognition: { uz: "Kontiguous segment, monoton shart va faqat oldinga siljiydigan chegara bo‘lsa shu usul mos.", en: "Use it for contiguous ranges with a monotone condition and forward-only boundaries." },
  },
  "dynamic-programming": {
    intuition: { uz: "Javobni kichik holatlar javobidan qurib, har holatni bir marta hisoblang.", en: "Build answers from smaller states and compute each state only once." },
    invariant: { uz: "dp[state] aniqlangan ma’noga ega va o‘tish faqat allaqachon to‘g‘ri holatlardan keladi.", en: "dp[state] has one precise meaning and transitions come only from valid predecessor states." },
    vocabulary: { uz: "holat, o‘tish, base case, memoization, tabulation", en: "state, transition, base case, memoization, tabulation" },
    workedExample: { uz: "Minimal tangalarda dp[s] — s summaning minimum tangalari; har coin uchun dp[s−coin]+1 ni sinang.", en: "For minimum coins, dp[s] is the fewest coins for sum s; try dp[s−coin]+1 for every coin." },
    mistakes: [{ uz: "Holatga yetarli ma’lumot kiritmaslik.", en: "Leaving necessary information out of the state." }, { uz: "O‘tish tartibini bog‘liqlikka zid yurish.", en: "Evaluating transitions in an order that violates dependencies." }],
    recognition: { uz: "Optimal javob, takroriy subproblem va kelajak uchun kichik holat yetarli bo‘lsa DPni sinang.", en: "Try DP for optimization with overlapping subproblems and a compact sufficient state." },
  },
  trees: {
    intuition: { uz: "Ildiz tanlab, har qirra ota-bola munosabatiga aylanadi va subtree natijalari pastdan yuqoriga yig‘iladi.", en: "Choose a root, turn edges into parent-child relations, and aggregate subtree results bottom-up." },
    invariant: { uz: "DFS tugundan qaytganda uning butun subtree javobi yakunlangan bo‘ladi.", en: "When DFS returns from a vertex, the answer for its entire subtree is complete." },
    vocabulary: { uz: "ildiz, ota, chuqurlik, subtree, LCA, diameter", en: "root, parent, depth, subtree, LCA, diameter" },
    workedExample: { uz: "Subtree hajmi 1 dan boshlanib, barcha bolalar hajmi qo‘shilishi orqali topiladi.", en: "A subtree size starts at one and adds the sizes of all child subtrees." },
    mistakes: [{ uz: "Ota qirrasi bo‘yicha qayta yurib sikl yaratish.", en: "Walking back through the parent edge and creating recursion loops." }, { uz: "Chuqur daraxtda recursion limitni unutish.", en: "Ignoring recursion depth on a long chain." }],
    recognition: { uz: "n tugun va n−1 qirra, yagona yo‘l yoki ierarxiya bo‘lsa daraxt algoritmlarini ishlating.", en: "Use tree algorithms for n vertices, n−1 edges, unique paths, or hierarchical structure." },
  },
  "advanced-cp": {
    intuition: { uz: "Oddiy yechimni avval to‘liq tushuning, keyin vaqt yoki xotiraning aynan qaysi qismini ilg‘or texnika qisqartirishini aniqlang.", en: "Fully understand the baseline, then identify exactly which time or memory bottleneck an advanced technique removes." },
    invariant: { uz: "Murakkab tuzilmaning har tuguni yoki versiyasi qaysi interval va tarixni ifodalashi qat’iy belgilangan.", en: "Every node or version in the advanced structure has a precise range and history meaning." },
    vocabulary: { uz: "persistent, offline, decomposition, convolution, game state", en: "persistent, offline, decomposition, convolution, game state" },
    workedExample: { uz: "Persistent segment tree yangilanishda faqat ildizdan barggacha O(log n) tugunni nusxalaydi, qolganini bo‘lishadi.", en: "A persistent segment tree copies only O(log n) nodes on the update path and shares the rest." },
    mistakes: [{ uz: "Soddaroq usul limitdan o‘tishini tekshirmay murakkab texnika tanlash.", en: "Choosing an advanced technique before checking whether a simpler one passes." }, { uz: "Xotira bahosini faqat vaqtga qarab unutish.", en: "Optimizing time while ignoring memory growth." }],
    recognition: { uz: "Ko‘p versiya, offline so‘rovlar yoki yo‘l segmentlarini tez birlashtirish talab qilinsa ilg‘or tuzilmani ko‘ring.", en: "Consider advanced structures for versions, offline queries, or fast path/range composition." },
  },
};

export function curriculumGuide(slug: string) {
  return guides[slug] || guides.foundations;
}
