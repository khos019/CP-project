/* Statement rewrite, batch 15 — the first fourteen of the 115 problems whose
 * statement was already over the 240-character floor and so was left alone by
 * batches 01–13.
 *
 * Being long enough is not the same as being complete. What these were mostly
 * missing is the same handful of things:
 *
 *   - a definition the question uses without naming (a subarray, a connected
 *     component, an anagram, "twice the area");
 *   - the edge the reader would otherwise meet as a wrong answer (n = 1, an
 *     empty queue, k larger than the alphabet, collinear points);
 *   - the guarantee that makes the task well posed (the array is sorted, the
 *     positions are what a pair is counted by).
 *
 * The English text is brought up with the Uzbek: 62 of these carried an
 * English statement shorter than the floor, because it had been written as the
 * terser translation of a full Uzbek one rather than as a statement in its own
 * right.
 *
 * Rules otherwise as in batch 01's header: the task in full, and not one word
 * about method.
 *
 * Applied with: node restate.mjs patches/batch-15-statements.mjs
 */
export default [
  {
    id: "A01",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Uning elementlarini teskari tartibda chiqaring: avval a_n, so‘ng a_{n−1} va shu tariqa a_1 gacha. Qiymatlarning o‘zi o‘zgarmaydi va hech narsa saralanmaydi — faqat massivni o‘qish yo‘nalishi teskari bo‘ladi, ya'ni chiqishda aynan o‘sha n ta son, o‘sha takrorlanishlari bilan, boshqa tartibda turadi. n = 1 bo‘lganda massiv o‘zgarmaydi.",
    statementEn: "You are given an array a of n integers. Print its elements in reverse order: first a_n, then a_{n−1}, and so on, finishing with a_1. The values themselves are not changed and nothing is sorted — only the direction in which the array is read, so the output holds exactly those n numbers, with the same repeats, in a different order. When n = 1 the array is unchanged.",
  },
  {
    id: "A07",
    statementUz: "Sizga n ta o‘lchov — a_1, …, a_n butun sonlari berilgan; ular manfiy bo‘lishi mumkin. Ularning o‘rta arifmetigi (a_1 + … + a_n) / n ga teng. Shu qiymatni pastga yaxlitlab, ya'ni undan oshmaydigan eng katta butun sonni chiqaring. Yaxlitlash minus cheksizlikka qarab bajariladi, nolga qarab emas: o‘rtacha −3.5 bo‘lsa javob −4, −3 emas. Yig‘indi ham manfiy bo‘lishi mumkin.",
    statementEn: "You are given n measurements — the integers a_1, …, a_n, which may be negative. Their arithmetic mean is (a_1 + … + a_n) / n. Print that value rounded down, that is the largest integer not exceeding it. Rounding goes towards minus infinity rather than towards zero: for a mean of −3.5 the answer is −4, not −3. The sum may be negative as well.",
  },
  {
    id: "A15",
    statementUz: "Ikki satr bir-birining anagrammasi deyiladi, agar biri ikkinchisining harflarini qayta joylashtirish bilan hosil bo‘lsa — ya'ni har bir harf birinchisida ikkinchisidagidek aynan bir xil sonda uchrasa. Sizga kichik lotin harflaridan iborat ikkita a va b satri berilgan; ular anagramma ekanini aniqlang va YES yoki NO deb bosh harflarda chiqaring. Uzunliklari har xil satrlar hech qachon anagramma bo‘la olmaydi, chunki harflar soni ham teng bo‘lishi kerak.",
    statementEn: "Two strings are anagrams of each other when one can be obtained by rearranging the letters of the other — that is, when each letter occurs in the first exactly as many times as it occurs in the second. You are given two strings a and b of lowercase Latin letters; determine whether they are anagrams and print YES or NO in capital letters. Strings of different lengths can never be anagrams, since the number of letters has to match too.",
  },
  {
    id: "A20",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri va manfiy bo‘lmagan k butun soni berilgan. Har bir harfni alifbo bo‘ylab k pozitsiya oldinga siljitib chiqaring; alifbo oxiriga yetganda hisob boshidan davom etadi, ya'ni z dan keyin yana a keladi. Boshqa hech narsa o‘zgarmaydi: natijaning uzunligi s bilan bir xil va harflar tartibi saqlanadi. k 26 dan ancha katta bo‘lishi mumkin, va k 26 ga karrali bo‘lsa satr o‘zgarmaydi.",
    statementEn: "You are given a string s of lowercase Latin letters and a non-negative integer k. Print the string with every letter shifted k positions forward in the alphabet; on reaching the end the count continues from the start, so z is followed by a again. Nothing else changes: the result has the same length as s and keeps the order of its letters. Note that k may be far larger than 26, and that a k divisible by 26 leaves the string unchanged.",
  },
  {
    id: "A21",
    statementUz: "Sizga n × n o‘lchamli kvadrat a matritsasi berilgan. Uning bosh diagonali — satr va ustun raqamlari teng bo‘lgan a_ii kataklari; yon diagonali esa a_i(n+1−i) kataklari, ya'ni chap pastdan o‘ng yuqoriga qarab ketuvchi qatori. Shu ikki diagonaldagi qiymatlarning yig‘indisini hisoblang va ikkita sonni bitta qatorda — avval bosh diagonal, so‘ng yon diagonal — chiqaring. n toq bo‘lganda markaziy katak ikkala diagonalga ham tegishli va ikkala yig‘indida hisobga olinadi.",
    statementEn: "You are given a square matrix a of size n × n. Its main diagonal is the cells a_ii, those whose row and column numbers are equal; its anti-diagonal is the cells a_i(n+1−i), the run from the bottom left to the top right. Compute the sum of the values on each of those two diagonals and print two integers on one line — the main diagonal first, the anti-diagonal second. When n is odd the central cell belongs to both diagonals and is counted in both sums.",
  },
  {
    id: "B26",
    statementUz: "Sizga kamaymaydigan tartibda berilgan n ta butun sondan iborat a massivi va x qiymati berilgan, ya'ni har bir i uchun a_i ≤ a_{i+1}. x dan kichik bo‘lmagan birinchi elementning pozitsiyasini toping: a_i ≥ x shartini qanoatlantiruvchi eng kichik i indeksni, 1 dan boshlab sanalgan holda. Massiv saralangani uchun bunday indeksdan boshlab barcha elementlar x dan kichik bo‘lmaydi. Barcha elementlar x dan kichik bo‘lsa, bunday pozitsiya yo‘q va −1 chiqariladi.",
    statementEn: "You are given an array a of n integers in non-decreasing order — that is, a_i ≤ a_{i+1} — and a value x. Find the position of the first element that is not less than x: the smallest index i with a_i ≥ x, counted from 1. Because the array is sorted, every element from that index onwards is not less than x either. If every element is smaller than x, no such position exists and −1 is printed.",
  },
  {
    id: "B27",
    statementUz: "Sizga n ta butun sondan iborat a massivi va k soni berilgan. Massivni o‘smaydigan tartibda — eng kattasidan eng kichigiga qarab — saralab, k-o‘rinda turadigan elementni chiqaring. Takrorlangan qiymatlar alohida o‘rin egallaydi: 5 5 3 massivida ikkinchi eng katta element ham 5 ga teng. k = 1 bo‘lganda javob massivning maksimal elementi, k = n bo‘lganda esa minimal elementi bo‘ladi.",
    statementEn: "You are given an array a of n integers and a number k. Sort the array in non-increasing order — from the largest to the smallest — and print the element standing at position k. Repeated values occupy separate positions: in the array 5 5 3 the second largest element is 5 as well. For k = 1 the answer is the maximum of the array, and for k = n it is the minimum.",
  },
  {
    id: "B33",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uni kodlang: satrni teng ketma-ket belgilardan iborat eng uzun bloklarga ajratib, har bir blokni o‘sha belgi va uning ketidan blok uzunligi bilan almashtiring. Bloklar orasiga hech qanday ajratuvchi qo‘yilmaydi va har bir blok yozib chiqiladi — uzunligi bir bo‘lgani ham, ya'ni \"abc\" dan \"a1b1c1\" hosil bo‘ladi. Bloklar satrdagi tartibida chiqariladi.",
    statementEn: "You are given a string s of lowercase Latin letters. Encode it: split the string into maximal blocks of equal consecutive characters and replace each block with that character followed by the length of the block. No separator is put between blocks, and every block is written out — including one of length one, so \"abc\" becomes \"a1b1c1\". The blocks are printed in the order they occur in the string.",
  },
  {
    id: "B40",
    statementUz: "Sizga r ta satr va c ta ustundan iborat a matritsasi berilgan. Uning barcha elementlarini soat yo‘nalishi bo‘yicha spiral tartibda chiqaring: chap yuqori katakdan boshlanadi, yuqori satr chapdan o‘ngga o‘qiladi, so‘ng eng o‘ng ustun pastga, keyin quyi satr o‘ngdan chapga, so‘ng eng chap ustun yuqoriga — va shundan keyin allaqachon o‘qilgan chegara tashlab yuborilib, xuddi shu qoida qolgan ichki to‘rtburchakka qo‘llanadi. Chiqishda aynan r · c ta son bo‘ladi: har bir katak bir marta.",
    statementEn: "You are given a matrix a with r rows and c columns. Print all its elements in clockwise spiral order: it starts at the top-left cell, reads the top row left to right, then the rightmost column downwards, then the bottom row right to left, then the leftmost column upwards — and then drops the border already read and applies the same rule to the inner rectangle that remains. The output holds exactly r · c numbers: every cell once.",
  },
  {
    id: "B41",
    statementUz: "Massivning qism massivi deb ketma-ket turgan elementlar bo‘lagiga aytiladi, ya'ni biror i dan j gacha bo‘lgan a_i, a_{i+1}, …, a_j qatoriga; o‘rtadagi elementlarni tashlab ketib bo‘lmaydi. Sizga n ta butun sondan iborat a massivi berilgan. Bo‘sh bo‘lmagan barcha qism massivlar orasidan yig‘indisi eng katta bo‘lganini qarab, shu yig‘indini chiqaring. Qism massiv bo‘sh bo‘la olmaydi: barcha elementlar manfiy bo‘lganda ham kamida bittasi tanlanadi, ya'ni javob eng katta elementga teng bo‘ladi.",
    statementEn: "A subarray is a stretch of consecutive elements, that is a run a_i, a_{i+1}, …, a_j from some i to some j; elements in the middle may not be skipped. You are given an array a of n integers. Among all non-empty subarrays consider the one with the largest sum, and print that sum. A subarray may not be empty: even when every element is negative at least one is chosen, so the answer is then the largest element.",
  },
  {
    id: "B42",
    statementUz: "Sizga n ta butun sondan iborat a massivi va maqsad qiymat k berilgan. a_i + a_j = k tengligini qanoatlantiruvchi, i < j shartli (i, j) pozitsiyalar juftliklarini sanang va ularning sonini chiqaring. Juftliklar pozitsiyalar bo‘yicha sanaladi, qiymatlar bo‘yicha emas: turli o‘rinlardagi ikkita teng qiymat ham haqiqiy juftlik hosil qiladi, shuning uchun bir xil to‘rtta son k ning yarmiga teng bo‘lsa oltita juftlik chiqadi. Mos juftlik bo‘lmasa javob 0.",
    statementEn: "You are given an array a of n integers and a target k. Count the pairs of positions (i, j) with i < j satisfying a_i + a_j = k, and print how many there are. Pairs are counted by position rather than by value: two equal values at different positions form a valid pair, so four identical numbers each equal to half of k give six pairs. If no pair matches, the answer is 0.",
  },
  {
    id: "B44",
    statementUz: "Navbat — elementlar oxiriga qo‘shiladigan va boshidan olinadigan tuzilma: birinchi kelgan birinchi ketadi. Boshida navbat bo‘sh. Sizga q ta amal ketma-ket beriladi: \"1 x\" amali x qiymatini navbat oxiriga qo‘shadi, \"2\" amali esa navbat boshidagi qiymatni olib tashlab uni chiqaradi. Ikkinchi turdagi amal bo‘sh navbatga kelishi mumkin — bunday holda hech narsa olib tashlanmaydi va uning o‘rniga −1 chiqariladi. Har bir chiqarish alohida qatorda bo‘ladi.",
    statementEn: "A queue is a structure where elements are added at the back and taken from the front: first in, first out. The queue starts empty. You are given q operations in order: the operation \"1 x\" adds the value x to the back of the queue, and the operation \"2\" removes the value at the front and prints it. An operation of the second kind may arrive on an empty queue — nothing is removed then and −1 is printed instead. Each printed value goes on its own line.",
  },
  {
    id: "B46",
    statementUz: "Sizga tekislikda butun koordinatalari bilan berilgan uchta nuqta berilgan. Ular hosil qilgan uchburchakning yuzasini emas, uning ikkilanganini chiqaring: butun koordinatali uchburchakning haqiqiy yuzasi yarim bilan tugashi mumkin, ikkilantirish esa javobni har doim butun son qilib qoldiradi va yaxlitlash masalasini yo‘q qiladi. Javob manfiy bo‘lmaydi. Uchala nuqta bitta to‘g‘ri chiziqda yotsa — jumladan ikkitasi ustma-ust tushsa — uchburchak yo‘q va javob 0 ga teng.",
    statementEn: "You are given three points on the plane by their integer coordinates. Print not the area of the triangle they form but twice that area: the true area of a triangle with integer vertices may end in one half, and doubling keeps the answer an integer and removes the question of rounding. The answer is never negative. If the three points lie on one straight line — including the case where two of them coincide — there is no triangle and the answer is 0.",
  },
  {
    id: "B49",
    statementUz: "Yo‘naltirilmagan grafning bog‘langan komponentasi deb shunday uchlar guruhiga aytiladi-ki, uning ichida har qanday uchdan har qanday uchga qirralar bo‘ylab yetib borish mumkin bo‘lsa, va guruhdan tashqariga birorta qirra chiqmasa. Sizga n ta uch va m ta qirradan iborat graf berilgan; undagi bog‘langan komponentalar sonini sanang va uni chiqaring. Birorta qirraga tegmagan uch ham o‘zi bitta komponenta hisoblanadi, shuning uchun qirralari yo‘q grafda javob n ga teng.",
    statementEn: "A connected component of an undirected graph is a group of vertices such that within it every vertex can be reached from every other along the edges, and no edge leads out of the group. You are given a graph with n vertices and m edges; count its connected components and print the number. A vertex touched by no edge is a component on its own, so in a graph with no edges the answer is n.",
  },
];
