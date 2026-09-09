/* Statement rewrite, batch 18 — fifteen more. Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-18-statements.mjs
 */
export default [
  {
    id: "C96",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan; har bir qirra musbat w vaznini tashiydi. Yo‘lning vazni deb undagi qirralar vaznlarining yig‘indisi tushuniladi. 1-uchdan n-uchgacha boradigan yo‘llar orasidan vazni eng kichigini toping va shu vaznni chiqaring. Bir juft uch orasida bir nechta qirra bo‘lishi mumkin, va n = 1 bo‘lganda boshlang‘ich uch manzil bo‘lib javob 0 bo‘ladi. Manzilga yetib bo‘lmasa −1 chiqariladi; masofa 10^14 ga yetadi.",
    statementEn: "You are given a graph with n vertices and m undirected edges, each carrying a positive weight w. The weight of a path is the sum of the weights of its edges. Among the paths from vertex 1 to vertex n find the one of smallest weight and print that weight. Several edges may join the same pair of vertices, and when n = 1 the starting vertex is the destination so the answer is 0. If the destination cannot be reached, −1 is printed; a distance reaches 10^14.",
  },
  {
    id: "C98",
    statementUz: "Satrning qism ketma-ketligi deb undan ba'zi belgilarni o‘chirib, qolganlarining tartibini saqlash yo‘li bilan hosil qilinadigan satrga aytiladi; belgilar yonma-yon bo‘lishi shart emas. Sizga kichik lotin harflaridan iborat s satri berilgan; uning qism ketma-ketliklari orasidan palindrom bo‘lganlarini, ya'ni oldinga ham, orqaga ham bir xil o‘qiladiganlarini qaraymiz. Eng uzunining uzunligini toping va uni chiqaring. Bitta belgining o‘zi palindrom hisoblanadi, shuning uchun javob kamida 1 ga teng.",
    statementEn: "A subsequence of a string is what remains after deleting some of its characters while keeping the rest in order; the characters need not be adjacent. You are given a string s of lowercase Latin letters; among its subsequences we consider those that are palindromes, that is those reading the same forwards and backwards. Find the length of the longest one and print it. A single character is a palindrome on its own, so the answer is at least 1.",
  },
  {
    id: "C99",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan; har bir qirra musbat w vaznini tashiydi. Qirralarning qandaydir qism to‘plami barcha uchlarni bog‘lab turadi deyiladi, agar shu qirralar bo‘ylab har qanday uchdan har qanday uchga yetib borish mumkin bo‘lsa. Shunday to‘plamlar orasidan qirralar vaznlarining yig‘indisi eng kichigini — minimal qamrovchi daraxtni — qarab, o‘sha yig‘indini chiqaring. Graf bog‘lanmaydigan bo‘lsa −1, n = 1 bo‘lganda esa 0 chiqariladi.",
    statementEn: "You are given a graph with n vertices and m undirected edges, each carrying a positive weight w. A subset of the edges connects all the vertices when every vertex can be reached from every other along those edges. Among such subsets consider the one whose edge weights sum to the least — a minimum spanning tree — and print that sum. If the graph cannot be connected at all, −1 is printed, and for n = 1 the answer is 0.",
  },
  {
    id: "C100",
    statementUz: "Shaxmatdagi farzin o‘z satri, o‘z ustuni va o‘zidan ketuvchi ikkala diagonal bo‘ylab hujum qiladi. Sizga n butun soni berilgan; n × n taxtaga aynan n ta farzinni hech qaysi ikkitasi bir-biriga hujum qilmaydigan qilib qo‘yish usullarini sanang va ularning sonini chiqaring. Ikki joylashuv har xil hisoblanadi, agar biror katakda birida farzin bo‘lib, ikkinchisida bo‘lmasa; farzinlarning o‘zi bir-biridan farqlanmaydi. Ba'zi n lar uchun birorta joylashuv mavjud emas va javob 0 bo‘ladi.",
    statementEn: "A chess queen attacks along its own row, its own column and both diagonals through it. You are given an integer n; count the ways to place exactly n queens on an n × n board so that no two of them attack each other, and print how many there are. Two placements are different when some square holds a queen in one and not in the other; the queens themselves are indistinguishable. For some n no placement exists at all and the answer is 0.",
  },
  {
    id: "C101",
    statementUz: "Sizga relyefning n ta ustuni berilgan; i-chisining balandligi h_i. Yomg‘irdan keyin har bir ustun ustidagi suv sathi uning chapidagi eng baland ustun bilan o‘ngidagi eng baland ustunning kichigi bilan aniqlanadi; shu sath ustunning o‘z balandligidan yuqori bo‘lsa, farq shu ustun ustida tutib qolinadigan suv bo‘ladi, aks holda esa suv qolmaydi. Barcha ustunlar ustida to‘plangan suvning umumiy hajmini hisoblang va uni chiqaring. Javob 10^14 ga yetadi.",
    statementEn: "You are given n columns of terrain, the i-th of height h_i. After rain, the water level above each column is set by the smaller of the tallest column to its left and the tallest to its right; where that level is above the column's own height, the difference is the water trapped over it, and otherwise no water remains. Compute the total volume of water trapped over all the columns and print it. The answer reaches 10^14.",
  },
  {
    id: "B102",
    statementUz: "Sizga tomonlari koordinata o‘qlariga parallel bo‘lgan to‘rtburchak ikkita qarama-qarshi burchagi bilan berilgan; burchaklar istalgan tartibda kelishi mumkin, ya'ni x1 > x2 yoki y1 > y2 bo‘lishi mumkin. Undan keyin bitta nuqta beriladi. Nuqta to‘rtburchakning ichida yoki chegarasida yotishini aniqlang va YES yoki NO deb bosh harflarda chiqaring. Chegara ichkariga tegishli: aynan tomon ustida yoki burchakda turgan nuqta ichkarida hisoblanadi.",
    statementEn: "You are given an axis-aligned rectangle by two opposite corners; the corners may come in either order, so x1 > x2 or y1 > y2 is possible. Then a single point is given. Determine whether the point lies inside the rectangle or on its border, and print YES or NO in capital letters. The border belongs to the inside: a point exactly on an edge or at a corner counts as inside.",
  },
  {
    id: "B103",
    statementUz: "Sizga n ta uchdan iborat, 1-uchida ildizlangan daraxt berilgan. Daraxtning balandligi deb ildizdan biror uchgacha tushadigan yo‘llardagi qirralarning eng katta soniga aytiladi. Balandlik qirralar bilan o‘lchanadi, uchlar bilan emas: ildizining bevosita ostida bir yoki bir nechta farzandi bo‘lgan va undan narisi yo‘q daraxtning balandligi 1 ga teng. Shu qiymatni toping va uni chiqaring. Qirralar ixtiyoriy tartibda beriladi va har doim daraxt hosil qiladi.",
    statementEn: "You are given a tree with n nodes, rooted at node 1. The height of the tree is the largest number of edges on a path from the root down to some node. The height is measured in edges rather than in nodes: a tree whose root has one or more children directly beneath it and nothing further has height 1. Find that value and print it. The edges are given in arbitrary order and always form a tree.",
  },
  {
    id: "B106",
    statementUz: "Sizga sodda ko‘pburchak — qirralari o‘z-o‘zini kesmaydigan ko‘pburchak — kontur bo‘ylab tartib bilan sanab o‘tilgan n ta uchi bilan berilgan; uchlar soat yo‘nalishida yoki unga teskari kelishi mumkin va javob ikkalasida ham bir xil bo‘ladi. Oxirgi uchdan birinchisiga qaytadigan yopuvchi qirra ham konturning bir qismi. Ko‘pburchakning yuzasini emas, uning ikkilanganini chiqaring: butun koordinatali ko‘pburchakning haqiqiy yuzasi yarim bilan tugashi mumkin, ikkilantirish esa javobni butun son qilib qoldiradi.",
    statementEn: "You are given a simple polygon — one whose edges do not cross — by its n vertices listed in order around the outline; the vertices may run clockwise or anticlockwise and the answer is the same either way. The closing edge from the last vertex back to the first is part of the outline. Print not the area of the polygon but twice that area: the true area of a polygon with integer vertices may end in one half, and doubling keeps the answer an integer.",
  },
  {
    id: "B107",
    statementUz: "Sizga n ta o‘quvchi berilgan; har birining identifikatori va bali bor, identifikatorlar esa har xil. O‘quvchilarni ikki qoida bilan tartiblang: avvalo bali bo‘yicha, eng yuqoridan eng pastga qarab; bali teng bo‘lganlar esa o‘zaro identifikatori bo‘yicha, kichigidan kattasiga qarab. Shu tartibda ularning identifikatorlarini bitta qatorda chiqaring — chiqishda ballar emas, identifikatorlar bo‘ladi. Ikki qoida tartibni to‘liq aniqlaydi, chunki identifikatorlar takrorlanmaydi.",
    statementEn: "You are given n students, each with an identifier and a score, the identifiers being distinct. Order the students by two rules: first by score, from highest to lowest; then, among those with equal scores, by identifier from smallest to largest. Print their identifiers in that order on one line — the output holds the identifiers, not the scores. The two rules determine the order completely, since no identifier repeats.",
  },
  {
    id: "B108",
    statementUz: "Sizga haqiqiy x soni berilgan; u manfiy bo‘lishi mumkin va o‘nlik nuqtasiz yozilishi ham mumkin. Uning kub ildizini, ya'ni r³ = x tengligini qanoatlantiruvchi yagona haqiqiy r sonini toping va uni o‘nlik nuqtadan keyin aynan olti xona bilan chiqaring. Har qanday haqiqiy sonning aynan bitta haqiqiy kub ildizi bor va manfiy x uchun u ham manfiy bo‘ladi. Javob 0 bo‘lganda 0.000000 chiqariladi; nolning ishorasi ahamiyatsiz.",
    statementEn: "You are given a real number x; it may be negative and may be written without a decimal point. Find its cube root, that is the unique real r satisfying r³ = x, and print it with exactly six digits after the decimal point. Every real number has exactly one real cube root, and for a negative x it is negative too. When the answer is zero, print 0.000000; the sign of zero is not significant.",
  },
  {
    id: "B109",
    statementUz: "1 dan n gacha bo‘lgan sonlarning o‘rin almashtirishlarini lug‘at tartibida yozib chiqish mumkin: avval birinchi elementi kichigi, ular teng bo‘lsa ikkinchi elementi kichigi va shu tartibda. Sizga shunday o‘rin almashtirishlardan bittasi berilgan; uning shu ro‘yxatdagi o‘rnini, 1 dan sanalgan holda, toping va chiqaring. Eng kichik o‘rin almashtirish 1 2 … n bo‘lib, uning o‘rni 1 ga teng; eng kattasi n … 2 1 ning o‘rni esa n! ga teng.",
    statementEn: "The permutations of the numbers 1 through n can be listed in lexicographic order: the one with the smaller first element first, ties broken by the second element, and so on. You are given one such permutation; find its position in that list, counted from 1, and print it. The smallest permutation 1 2 … n has position 1, and the largest, n … 2 1, has position n!.",
  },
  {
    id: "C110",
    statementUz: "Sizga n ta tosh uyumi berilgan; uyum bo‘sh bo‘lishi ham mumkin. Ikki o‘yinchi navbatma-navbat yuradi, va har bir yurishda o‘yinchi bitta uyumni tanlab, undan istalgan musbat sondagi toshni oladi — hech bo‘lmasa bittasini, hatto butun uyumni ham. Oxirgi toshni olgan o‘yinchi yutadi; yurishga toshi qolmagan o‘yinchi yutqazadi. Ikkala o‘yinchi ham mukammal o‘ynaydi deb faraz qilib, birinchi yuradigan o‘yinchi yutadimi degan savolga javob bering va WIN yoki LOSE chiqaring.",
    statementEn: "You are given n piles of stones; a pile may be empty. Two players move in turn, and on a move a player picks one pile and takes any positive number of stones from it — at least one, up to the whole pile. The player who takes the last stone wins; a player with no stones left to take loses. Assuming both play perfectly, answer whether the player moving first wins, and print WIN or LOSE.",
  },
  {
    id: "C111",
    statementUz: "Sizga n ta yukning jo‘natilishi kerak bo‘lgan tartibdagi og‘irliklari va d kunlik muddat berilgan. Kemaning kunlik sig‘imi bir xil. Har kuni kema qolgan yuklarning boshidan boshlab, umumiy og‘irligi sig‘imdan oshmaydigan uzluksiz qismini oladi; yuklarni qayta tartiblab yoki bo‘lib bo‘lmaydi. Barcha n ta yukni d kun ichida jo‘natishga yetadigan eng kichik sig‘imni toping va uni chiqaring. Sig‘im hech qachon eng og‘ir yukning og‘irligidan kichik bo‘la olmaydi, aks holda o‘sha yuk hech qachon jo‘natilmaydi.",
    statementEn: "You are given the weights of n packages in the order they must be shipped, and a deadline of d days. The ship's daily capacity is the same every day. Each day the ship takes a leading run of the remaining packages whose total weight does not exceed the capacity; the packages may not be reordered or split. Find the smallest capacity that ships all n packages within d days and print it. The capacity can never be below the weight of the heaviest package, or that package would never ship.",
  },
  {
    id: "C113",
    statementUz: "Nuqtalar to‘plamining qavariq qobig‘i deb ularning barchasini o‘z ichiga oluvchi eng kichik qavariq ko‘pburchakka aytiladi. Sizga tekislikda butun koordinatali n ta nuqta berilgan; shu qobiqning uchlari sonini toping va uni chiqaring. Ko‘pburchakning qat'iy ichida yotgan nuqta uch hisoblanmaydi, qobiq qirrasining aynan ustida — ikki uch orasida — yotgan nuqta ham uch emas, chunki u burchak hosil qilmaydi. Barcha nuqtalar bir to‘g‘ri chiziqda yotishi ham mumkin.",
    statementEn: "The convex hull of a set of points is the smallest convex polygon containing all of them. You are given n points in the plane with integer coordinates; find the number of vertices of that hull and print it. A point lying strictly inside the polygon is not a vertex, and neither is a point lying exactly on an edge of the hull — between two vertices — since it forms no corner. All the points may also lie on one straight line.",
  },
];
