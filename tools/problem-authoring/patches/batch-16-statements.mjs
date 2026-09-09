/* Statement rewrite, batch 16 — fifteen more. Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-16-statements.mjs
 */
export default [
  {
    id: "B51",
    statementUz: "Sizga r ta satr va c ta ustundan iborat jadval berilgan; unda '#' quruqlikni, '.' esa suvni bildiradi. Ikki quruqlik katagi umumiy tomonga ega bo‘lsa — yuqori, past, chap yoki o‘ng qo‘shni bo‘lsa — bog‘langan hisoblanadi; faqat burchagi bilan tegib turganlari bog‘lanmagan. Orol deb bir-biriga shu ma'noda bog‘langan quruqlik kataklarining guruhiga aytiladi. Eng katta orolda nechta katak borligini toping va shu sonni chiqaring. Jadvalda birorta '#' bo‘lmasa, javob 0.",
    statementEn: "You are given a grid of r rows and c columns in which '#' marks land and '.' marks water. Two land cells are connected when they share a side — up, down, left or right; cells touching only at a corner are not. An island is a group of land cells connected to one another in that sense. Find how many cells the largest island holds and print that number. If the grid contains no '#' at all, the answer is 0.",
  },
  {
    id: "B52",
    statementUz: "Ikki nuqta orasidagi Manxetten masofasi |x_i − x_j| + |y_i − y_j| ga teng — ya'ni koordinatalar farqlarining modullari yig‘indisi, o‘qlar bo‘ylab yurilgan yo‘l. Sizga tekislikda n ta nuqta berilgan; har xil o‘rinlarda turgan barcha juftliklar orasidan shu masofa eng kichik bo‘lganini toping va o‘sha masofani chiqaring. Ikki nuqtaning koordinatalari bir xil bo‘lishi mumkin — bunday holda ular orasidagi masofa 0 va javob ham 0 bo‘ladi. Masofa 4·10^9 ga yetadi.",
    statementEn: "The Manhattan distance between two points is |x_i − x_j| + |y_i − y_j| — the sum of the absolute differences of their coordinates, the way along the axes. You are given n points on the plane; among all pairs at different positions find the one where that distance is smallest and print the distance. Two points may share the same coordinates, in which case the distance between them is 0 and so is the answer. A distance reaches 4·10^9.",
  },
  {
    id: "B53",
    statementUz: "Sizga to‘g‘ri chiziqdagi n ta oraliq berilgan; har biri l ≤ r chegaralari bilan tavsiflanadi va shu chegaralar orasidagi barcha nuqtalarni, chetlarni ham qo‘shib, o‘z ichiga oladi. Kesishadigan yoki hech bo‘lmasa bitta nuqtada tegib turgan oraliqlar bitta oraliqqa birlashtiriladi, va birlashtirish natijasi yana boshqasi bilan kesishsa, u ham qo‘shiladi. Barcha birlashtirishlardan keyin nechta oraliq qolganini chiqaring. Oraliqlar tartiblanmagan holda beriladi va biri ikkinchisining ichida yotishi mumkin.",
    statementEn: "You are given n intervals on a line, each described by its ends l ≤ r and holding every point between them, ends included. Intervals that overlap, or merely touch at a single point, are merged into one interval, and if the result of a merge overlaps another interval it is merged in too. Print how many intervals remain once no more merging is possible. The intervals arrive unsorted and one may lie entirely inside another.",
  },
  {
    id: "B54",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; unda hech qaysi ikkita qo‘shni element teng emas. Pozitsiya cho‘qqi deyiladi, agar undagi element o‘zining har bir qo‘shnisidan qat'iy katta bo‘lsa. Chegaraviy pozitsiyalarning bittadan qo‘shnisi bor: birinchi pozitsiya faqat ikkinchisidan, oxirgisi faqat oxiridan ikkinchisidan katta bo‘lishi kifoya, n = 1 bo‘lganda esa yagona pozitsiya cho‘qqi hisoblanadi. Cho‘qqi mavjudligi kafolatlangan; bir nechta bo‘lsa, eng chapdagisining pozitsiyasini chiqaring.",
    statementEn: "You are given an array a of n integers in which no two adjacent elements are equal. A position is a peak when its element is strictly greater than each of its neighbours. The end positions have a single neighbour each: the first position need only exceed the second, the last only the second from the end, and when n = 1 the single position counts as a peak. A peak is guaranteed to exist; if there are several, print the position of the leftmost one.",
  },
  {
    id: "B55",
    statementUz: "t satri s ning aylanmasi deyiladi, agar s ni biror joyidan ikki bo‘lakka kesib, ularning o‘rnini almashtirish orqali aynan t hosil bo‘lsa: \"abcde\" ni \"ab\" va \"cde\" ga kesib almashtirsak \"cdeab\" chiqadi. Kesish satr chetidan ham o‘tishi mumkin, ya'ni har bir satr o‘zining aylanmasi hisoblanadi. Sizga kichik lotin harflaridan iborat s va t satrlari berilgan; t satri s ning aylanmasi ekanini aniqlang va YES yoki NO deb bosh harflarda chiqaring. Uzunliklari har xil satrlar hech qachon aylanma bo‘la olmaydi.",
    statementEn: "A string t is a rotation of s when cutting s into two pieces at some position and swapping them produces exactly t: cutting \"abcde\" into \"ab\" and \"cde\" and swapping gives \"cdeab\". The cut may fall at the very edge, so every string is a rotation of itself. You are given strings s and t of lowercase Latin letters; determine whether t is a rotation of s and print YES or NO in capital letters. Strings of different lengths can never be rotations of each other.",
  },
  {
    id: "B56",
    statementUz: "Sizga n ta uchdan iborat, 1-uchida ildizlangan daraxt berilgan. Barg deb ildizdan boshqa, aynan bitta qirraga tegib turgan uchga aytiladi — ya'ni ostida birorta uch bo‘lmagan uch. Daraxtdagi barglarni sanang va ularning sonini chiqaring. Ildiz hech qachon barg hisoblanmaydi, hatto uning yagona qo‘shnisi bo‘lganda ham: shuning uchun ikki uch va bitta qirradan iborat daraxtda javob 1 ga teng. Qirralar ixtiyoriy tartibda beriladi va har doim daraxt hosil qiladi.",
    statementEn: "You are given a tree with n nodes, rooted at node 1. A leaf is a node other than the root that touches exactly one edge — a node with nothing below it. Count the leaves of the tree and print how many there are. The root is never counted as a leaf, even when it has a single neighbour: so in a tree of two nodes and one edge the answer is 1. The edges are given in arbitrary order and always form a tree.",
  },
  {
    id: "B57",
    statementUz: "Sizga kamaymaydigan tartibda berilgan n ta butun sondan iborat a massivi va maqsad qiymat t berilgan. Har xil pozitsiyalarda turgan har ikki element uchun ularning yig‘indisini qarash mumkin; shu yig‘indilar orasidan t ga eng yaqin bo‘lganini, ya'ni |yig‘indi − t| eng kichik bo‘lganini toping va o‘sha yig‘indini chiqaring — javob t ga qanchalik yaqinligi emas, yig‘indining o‘zi. Ikki yig‘indi t ga bir xil yaqin bo‘lsa (biri kichik, biri katta tomonda), ulardan kichigi chiqariladi. Indekslar har xil bo‘lishi shart, qiymatlar teng bo‘lishi mumkin.",
    statementEn: "You are given an array a of n integers in non-decreasing order and a target t. For any two elements at different positions one can look at their sum; among those sums find the one closest to t, that is the one minimising |sum − t|, and print that sum — the answer is the sum itself, not how close it came. If two sums are equally close to t (one below, one above), the smaller of them is printed. The positions must differ, while the values may be equal.",
  },
  {
    id: "B58",
    statementUz: "Sizga n ta tadbir berilgan; i-chisi s_i vaqtida boshlanadi va e_i vaqtida tugaydi, bunda s_i ≤ e_i. Ikki tadbir kesishadi deyiladi, agar ular umumiy vaqt oralig‘iga ega bo‘lsa; biri ikkinchisi tugagan paytda aynan boshlansa, ular kesishmaydi va ikkalasini ham tanlash mumkin. Hech qaysi ikkitasi kesishmaydigan qilib tanlash mumkin bo‘lgan tadbirlarning eng katta sonini toping va uni chiqaring. Tadbirlar ixtiyoriy tartibda beriladi va ularning davomiyligi nol bo‘lishi ham mumkin.",
    statementEn: "You are given n activities, the i-th starting at time s_i and ending at time e_i with s_i ≤ e_i. Two activities overlap when they share a stretch of time; if one starts exactly when the other ends they do not overlap and both may be selected. Find the largest number of activities that can be selected so that no two of them overlap, and print it. The activities are given in arbitrary order and one may have zero duration.",
  },
  {
    id: "B60",
    statementUz: "Sizga n ta vazifa berilgan; i-chisini bajarish a_i birlik vaqt oladi. Umumiy byudjet T birlik vaqt. Tanlangan vazifalarning davomiyliklari yig‘indisi T dan oshmasligi kerak; shu shart bilan iloji boricha ko‘proq vazifa tanlang va tanlangan vazifalarning sonini chiqaring. Vazifalar bir-biriga bog‘liq emas: ularni istalgan tartibda bajarish mumkin, har bir vazifa esa yo to‘liq bajariladi, yo umuman bajarilmaydi. Birorta vazifa byudjetga sig‘masa, javob 0.",
    statementEn: "You are given n tasks, the i-th taking a_i units of time to do. The total budget is T units of time. The durations of the selected tasks must add up to at most T; under that condition select as many tasks as possible and print how many were selected. The tasks are independent of one another: they may be done in any order, and a task is either done in full or not at all. If not even one task fits the budget, the answer is 0.",
  },
  {
    id: "B61",
    statementUz: "Sizga r ta satr va c ta ustundan iborat jadval berilgan; unda '.' bo‘sh katakni, '#' esa devorni bildiradi. Chap yuqori katakdan o‘ng pastki katakka boruvchi yo‘llarni sanaymiz: har qadamda faqat bir katak pastga yoki bir katak o‘ngga siljish mumkin, devorga esa kirib bo‘lmaydi. Shunday yo‘llar sonini 10^9 + 7 modul bo‘yicha chiqaring. Boshlanish yoki manzil katagining o‘zi devor bo‘lishi mumkin, va umuman yo‘l bo‘lmasa javob 0 bo‘ladi.",
    statementEn: "You are given a grid of r rows and c columns in which '.' is a free cell and '#' is a wall. We count the paths from the top-left cell to the bottom-right cell: each step moves one cell down or one cell right, and a wall may not be entered. Print the number of such paths modulo 10^9 + 7. The starting or the destination cell may itself be a wall, and if there is no path at all the answer is 0.",
  },
  {
    id: "B62",
    statementUz: "Sizga r ta satr va c ta ustundan iborat jadval berilgan; unda '.' bo‘sh katakni, '#' esa devorni bildiradi. Har bir qadamda bir katak yuqoriga, pastga, chapga yoki o‘ngga siljish mumkin — diagonal yurish mumkin emas — va devorga kirib bo‘lmaydi. Chap yuqori katakdan o‘ng pastki katakka yetib borish uchun kerak bo‘ladigan eng kam qadamlar sonini toping va uni chiqaring. Bir katakdan iborat jadvalda javob 0. Manzilga umuman yetib bo‘lmasa, −1 chiqariladi.",
    statementEn: "You are given a grid of r rows and c columns in which '.' is a free cell and '#' is a wall. Each step moves one cell up, down, left or right — diagonal moves are not allowed — and a wall may not be entered. Find the smallest number of steps needed to reach the bottom-right cell from the top-left one, and print it. In a grid of a single cell the answer is 0. If the destination cannot be reached at all, −1 is printed.",
  },
  {
    id: "B63",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Elementlardan bir qismini tanlash kerak, lekin tanlanganlar orasida yonma-yon turganlari bo‘lmasligi shart: agar i-element tanlansa, i−1 va i+1 tanlanmaydi. Shunday tanlovlar orasidan qiymatlar yig‘indisi eng katta bo‘lganini qarab, o‘sha yig‘indini chiqaring. Hech narsa tanlamaslik ham ruxsat etilgan va bo‘sh tanlovning yig‘indisi 0 ga teng, shuning uchun barcha elementlar manfiy bo‘lganda javob 0 bo‘ladi.",
    statementEn: "You are given an array a of n integers. Some of the elements are to be chosen, but no two chosen elements may be adjacent: if element i is chosen, then i−1 and i+1 are not. Among such choices consider the one whose values sum to the most, and print that sum. Choosing nothing is allowed and the empty choice sums to 0, so when every element is negative the answer is 0.",
  },
  {
    id: "B67",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Uning barcha elementlarini qayta joylashtirib chiqaring: qiymatlar necha marta uchrashi bo‘yicha, eng ko‘p uchraydiganidan boshlab tartiblanadi, bir xil sonda uchraydigan qiymatlar esa o‘zaro qiymati bo‘yicha, kichigidan boshlab tartiblanadi. Har bir qiymat massivda necha marta uchrasa, chiqishda ham shuncha marta va yonma-yon yoziladi, ya'ni chiqishda aynan n ta son bo‘ladi. Bu ikki qoida tartibni to‘liq aniqlaydi.",
    statementEn: "You are given an array a of n integers. Print all its elements rearranged: the values are ordered by how many times they occur, most frequent first, and values occurring the same number of times are ordered among themselves by value, smallest first. Each value is printed as many times as it occurs in the array, and its copies stand together, so the output holds exactly n numbers. Those two rules determine the order completely.",
  },
  {
    id: "B68",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Har bir pozitsiya uchun uning o‘ng tomonida turgan, undan qat'iy katta bo‘lgan birinchi elementni toping va bu n ta javobni pozitsiyalar tartibida bitta qatorda chiqaring. Faqat o‘ng tomon qaraladi: chapdagi elementlar hech qachon hisobga olinmaydi. Solishtirish qat'iy, ya'ni teng qiymat katta hisoblanmaydi va shartni qanoatlantirmaydi. O‘ng tomonda bunday element bo‘lmasa, o‘sha pozitsiya uchun −1 chiqariladi — masalan, oxirgi pozitsiya uchun har doim.",
    statementEn: "You are given an array a of n integers. For every position find the first element to its right that is strictly greater than it, and print those n answers on one line in order of position. Only the right side is considered: elements to the left are never taken into account. The comparison is strict, so an equal value does not count as greater and does not satisfy the condition. When no such element exists to the right, −1 is printed for that position — as it always is for the last one.",
  },
];
