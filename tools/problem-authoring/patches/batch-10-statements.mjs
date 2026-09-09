/* Statement rewrite, batch 10 — fifteen more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-10-statements.mjs
 */
export default [
  {
    id: "C249",
    statementUz: "Sizga n ta satr va m ta ustundan iborat matritsa, so'ngra q ta so'rov berilgan. Har bir so'rov to'rtta son bilan beriladi: r1, c1, r2, c2 — matritsadagi to'rtburchakning chap yuqori va o'ng pastki burchaklari; to'rtburchakka r1 dan r2 gacha bo'lgan satrlar va c1 dan c2 gacha bo'lgan ustunlar kesishmasidagi barcha kataklar kiradi, chegaralar ham qo'shiladi. Har bir so'rov uchun shu to'rtburchak ichidagi sonlar yig'indisini hisoblang va uni alohida qatorda chiqaring. Matritsa o'zgarmaydi, yig'indi esa 32-bitli turga sig'maydi.",
    statementEn: "You are given a matrix with n rows and m columns, followed by q queries. Each query gives four numbers r1, c1, r2, c2 — the top-left and bottom-right corners of a rectangle in the matrix; the rectangle holds every cell where rows r1 to r2 meet columns c1 to c2, ends included. For each query compute the sum of the numbers inside that rectangle and print it on its own line. The matrix never changes, and a sum does not fit in a 32-bit type.",
  },
  {
    id: "B165",
    statementUz: "Sizga n ta sondan iborat a massivi va m ta har xil sondan iborat o tartib massivi berilgan. a ni shunday qayta joylashtiringki, qiymatlar o da sanab o‘tilgan tartibda kelsin: o ning birinchi qiymatiga teng elementlarning barchasi eng oldinda, keyin ikkinchi qiymatiga teng bo‘lganlari va shu tartibda davom etsin. o da umuman uchramaydigan qiymatlar sanalganlarning barchasidan keyin, o‘zaro esa o‘sish tartibida joylashadi. Natijada a ning barcha n ta elementi, takrorlanishlari bilan qoladi.",
    statementEn: "You are given an array a of n numbers and an ordering array o of m distinct numbers. Rearrange a so that its values come in the order listed in o: first every element equal to the first value of o, then those equal to the second, and so on. Values that do not occur in o at all go after all the listed ones, arranged among themselves in increasing order. The result keeps all n elements of a, duplicates included.",
  },
  {
    id: "B174",
    statementUz: "Sizga tekislikda butun koordinatalari bilan berilgan ikkita nuqta berilgan. Ular orasidagi masofaning kvadratini, ya'ni (x₁−x₂)² + (y₁−y₂)² qiymatini hisoblang va uni chiqaring. Kvadrat ildiz olinmaydi — shuning uchun javob har doim butun son bo‘ladi va kasr aniqligi masalaga umuman aralashmaydi. Nuqtalar ustma-ust tushgan bo‘lsa, javob 0 ga teng. Koordinatalar farqi 2·10^9 ga, uning kvadrati esa 4·10^18 ga yetadi.",
    statementEn: "You are given two points on the plane by their integer coordinates. Compute the square of the distance between them, that is the value (x₁−x₂)² + (y₁−y₂)², and print it. The square root is not taken — so the answer is always an integer and floating-point precision never enters the problem. If the points coincide the answer is 0. A difference of coordinates reaches 2·10^9 and its square 4·10^18.",
  },
  {
    id: "B86",
    statementUz: "Sizga n ta uchdan iborat, 1-uchida ildizlangan daraxt berilgan. Uchning qism daraxti deb o‘sha uch va ildizdan qaraganda uning ostida yotgan barcha uchlar tushuniladi, qism daraxtning o‘lchami esa undagi uchlar soni. Ildizdan boshqa barcha uchlarni qarab, ular orasidagi eng katta qism daraxt o‘lchamini toping va uni chiqaring; ildizning o‘z qism daraxti — butun daraxt — bu solishtirishga kirmaydi. Har bir bargning qism daraxti bitta uchdan iborat, shuning uchun javob kamida 1 ga teng.",
    statementEn: "You are given a tree with n nodes, rooted at node 1. The subtree of a node is that node together with every node lying below it as seen from the root, and the size of a subtree is the number of nodes in it. Looking at every node other than the root, find the largest subtree size and print it; the root's own subtree — the whole tree — takes no part in that comparison. Every leaf's subtree holds one node, so the answer is at least 1.",
  },
  {
    id: "C95",
    statementUz: "Sizga n ta uchdan iborat daraxt berilgan — bog‘lamli, siklsiz va aynan n − 1 ta qirrali graf. Daraxtda har qanday ikki uch orasida aynan bitta yo‘l bor. Shu yo‘llarning eng uzunidagi qirralar sonini — daraxtning diametrini — toping va uni chiqaring. Diametr uchlar bilan emas, qirralar bilan o‘lchanadi: masalan, ikkita uch va bitta qirradan iborat daraxtning diametri 1 ga teng. Qirralar ixtiyoriy tartibda beriladi.",
    statementEn: "You are given a tree with n nodes — a connected, acyclic graph with exactly n − 1 edges. There is exactly one path between any two nodes of a tree. Find the number of edges on the longest of those paths — the diameter of the tree — and print it. The diameter is measured in edges rather than in nodes: a tree of two nodes and one edge, for instance, has diameter 1. The edges are given in arbitrary order.",
  },
  {
    id: "C219",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilgan qirradan iborat graf berilgan; har bir qirra manfiy bo'lmagan vazn tashiydi va a dan b ga qarab ketadi, teskarisiga emas. Yo'lning vazni deb undagi qirralar vaznlarining yig'indisi tushuniladi. So'ngra q ta so'rov keladi, har biri (u, v) juftligidan iborat; har bir so'rov uchun u dan v gacha boradigan yo'llarning eng kichik vaznini alohida qatorda chiqaring. v ga u dan yetib bo'lmasa, -1 chiqariladi; u = v bo'lganda esa javob 0. Bir juft tugun orasida bir nechta qirra bo'lishi mumkin.",
    statementEn: "You are given a graph with n vertices and m directed edges; each edge carries a non-negative weight and runs from a to b, not the other way. The weight of a path is the sum of the weights of its edges. Then q queries arrive, each a pair (u, v); for every query print, on its own line, the smallest weight of a path from u to v. If v cannot be reached from u, -1 is printed; when u = v the answer is 0. Several edges may join the same pair of vertices.",
  },
  {
    id: "C232",
    statementUz: "Tekislikda butun koordinatali n ta nuqta berilgan; nuqtalar takrorlanishi mumkin. Turli o'rinlarda turgan har ikki nuqta orasidagi Evklid masofasini qarab, ularning eng kichigini toping, lekin javob sifatida uning kvadratini — ya'ni (x1 − x2)² + (y1 − y2)² qiymatini — chiqaring. Kvadrat so'ralgani javobni butun sonda qoldiradi va kasr aniqligini masalaga umuman aralashtirmaydi. Ikki nuqta ustma-ust tushgan bo'lsa javob 0. Kvadrat masofa 8·10^18 gacha yetadi.",
    statementEn: "You are given n points in the plane with integer coordinates; points may repeat. Looking at the Euclidean distance between every two points at different positions, find the smallest one, but print its square as the answer — the value (x1 − x2)² + (y1 − y2)². Asking for the square keeps the answer an integer and keeps floating-point precision out of the problem entirely. If two points coincide the answer is 0. A squared distance reaches 8·10^18.",
  },
  {
    id: "B159",
    statementUz: "Sizga n ta versiyaning holati tartib bo‘yicha berilgan: 0 versiya ishlayotganini, 1 esa buzuqligini bildiradi. Ketma-ketlik shunday tuzilgan-ki, versiya bir marta buzilgach, undan keyingi barcha versiyalar ham buzuq bo‘ladi — ya'ni avval bir necha nol, keyin esa faqat birlar keladi. Birinchi buzuq versiyaning 1 dan boshlangan pozitsiyasini toping va uni chiqaring. Barcha versiyalar ishlayotgan bo‘lsa, ya'ni birorta 1 bo‘lmasa, −1 chiqaring.",
    statementEn: "You are given the state of n versions in order: 0 means the version works and 1 means it is broken. The sequence is built so that once a version is broken every later one is broken too — a run of zeros first, then only ones. Find the 1-based position of the first broken version and print it. If every version works, that is if there is no 1 at all, print −1.",
  },
  {
    id: "B45",
    statementUz: "Sizga n ta butun sondan iborat a massivi va k soni berilgan. Massivni o‘ngga k pozitsiya aylantiring: har bir element k o‘rin o‘ngga suriladi, oxiridan chiqib ketganlari esa massivning boshida qayta paydo bo‘ladi. Natijada elementlarning soni va ularning o‘zaro tartibi saqlanadi, faqat boshlanish nuqtasi siljiydi. k n dan katta bo‘lishi mumkin — bunday holda massiv bir necha marta to‘liq aylanib chiqadi; k = 0 bo‘lsa massiv o‘zgarmaydi.",
    statementEn: "You are given an array a of n integers and a number k. Rotate the array k positions to the right: every element moves k places to the right and the ones pushed past the end reappear at the beginning. The number of elements and their relative order are preserved; only the starting point shifts. Note that k may be larger than n, in which case the array comes full circle several times; when k = 0 the array is unchanged.",
  },
  {
    id: "B179",
    statementUz: "Sizga tekislikdagi n ta nuqta va r radiusi berilgan. Koordinatalar boshida (0, 0) markazlashgan, radiusi r bo‘lgan aylanani qaraymiz. Nuqta shu aylananing ichida yoki aynan chegarasida yotadi, agar uning koordinatalari x² + y² ≤ r² shartini qanoatlantirsa. Shunday nuqtalarni sanang va ularning sonini chiqaring; aynan chegarada yotgan nuqta ham sanaladi, chunki tengsizlik qat'iy emas. x² + y² qiymati 2·10^18 ga yetadi.",
    statementEn: "You are given n points on the plane and a radius r. Consider the circle of radius r centred at the origin (0, 0). A point lies inside that circle or exactly on its boundary when its coordinates satisfy x² + y² ≤ r². Count such points and print how many there are; a point exactly on the boundary is counted, since the inequality is not strict. The value x² + y² reaches 2·10^18.",
  },
  {
    id: "A14",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; qiymatlar takrorlanishi mumkin. Massivdagi ikkinchi eng katta har xil qiymatni toping, ya'ni maksimumdan qat'iy kichik bo‘lgan qiymatlarning eng kattasini. Takrorlanish hisobga olinmaydi: 5 3 5 1 massivida maksimum 5, undan kichik eng katta qiymat esa 3. Agar massivda ikkitadan kam har xil qiymat bo‘lsa — masalan, barcha elementlar teng bo‘lsa — bunday qiymat mavjud emas va −1 chiqariladi.",
    statementEn: "You are given an array a of n integers; the values may repeat. Find the second largest distinct value in the array, that is the largest of the values strictly smaller than the maximum. Repeats do not count: in the array 5 3 5 1 the maximum is 5 and the largest value below it is 3. If the array holds fewer than two distinct values — when every element is equal, for instance — no such value exists and −1 is printed.",
  },
  {
    id: "B64",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning qism satri deb ketma-ket turgan belgilar ketma-ketligiga aytiladi — o‘rtadagi belgilarni tashlab ketib bo‘lmaydi. Hech bir belgi ikki marta uchramaydigan, ya'ni barcha belgilari har xil bo‘lgan eng uzun qism satrni toping va uning uzunligini chiqaring. Har bir alohida belgining o‘zi shartni qanoatlantiradi, shuning uchun javob kamida 1 ga teng; satrda faqat bitta harf takrorlansa, javob aynan 1 bo‘ladi.",
    statementEn: "You are given a string s of lowercase Latin letters. A substring of it is a run of consecutive characters — characters in the middle may not be skipped. Find the longest substring in which no character occurs twice, that is one whose characters are all distinct, and print its length. Every single character satisfies the condition on its own, so the answer is at least 1; if the string repeats one letter throughout, the answer is exactly 1.",
  },
  {
    id: "C97",
    statementUz: "Sizga ikkita a va b satri berilgan. Bitta amalda satrning istalgan o‘rniga bitta belgi qo‘shish, istalgan bitta belgisini o‘chirish yoki bitta belgisini boshqasiga almashtirish mumkin; har bir amal 1 ga teng. a ni b ga aylantirish uchun kerak bo‘ladigan eng kam amallar sonini — tahrirlash masofasini — toping va uni chiqaring. Satrlar allaqachon teng bo‘lsa javob 0. Satrlarning istalgani bo‘sh bo‘lishi mumkin, ya'ni kirish qatori bo‘sh qolishi mumkin; bunday holda javob ikkinchi satrning uzunligiga teng.",
    statementEn: "You are given two strings a and b. One operation inserts a single character at any position of a string, deletes any single character of it, or replaces one of its characters with another; every operation costs 1. Find the fewest operations needed to turn a into b — the edit distance — and print it. If the strings are already equal the answer is 0. Either string may be empty, so a line of input may be blank; the answer is then the length of the other string.",
  },
  {
    id: "A121",
    statementUz: "Sizga bitta butun son — ball berilgan. Unga mos bahoni aniqlang va uni bitta bosh harf sifatida chiqaring: 90 va undan yuqori ball uchun A, 80 dan 89 gacha B, 70 dan 79 gacha C, 70 dan past bo‘lgan hamma narsa uchun esa D. Har bir chegara qiymatining o‘zi yuqoriroq bahoga tegishli: 90 — bu A, B emas, va 80 — bu B, C emas. Ball 0 dan 100 gacha bo‘ladi, ya'ni noto‘g‘ri kirishni tekshirish kerak emas.",
    statementEn: "You are given one integer — a score. Determine the grade it earns and print it as a single capital letter: A for a score of 90 or more, B for 80 through 89, C for 70 through 79, and D for anything below 70. Each boundary value itself belongs to the higher grade: 90 is an A rather than a B, and 80 is a B rather than a C. The score lies between 0 and 100, so no invalid input has to be handled.",
  },
];
