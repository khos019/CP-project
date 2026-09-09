/* Statement rewrite, batch 04 — fourteen more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-04-statements.mjs
 */
export default [
  {
    id: "B185",
    statementUz: "Ikkilik satr — faqat 0 va 1 belgilaridan iborat satr. Sizga n butun soni berilgan; uzunligi aynan n bo‘lgan ikkilik satrlar orasidan hech qaysi ikkita 1 yonma-yon turmaydiganlarini, ya'ni ketma-ket ikkita 1 uchramaydiganlarini sanang. Ikki satr biror pozitsiyada farq qilsa, ular alohida sanaladi. Bitta sonni chiqaring — shunday satrlar soni; n = 1 bo‘lganda ikkita satr ham (0 va 1) shartni qanoatlantiradi. Javob n = 40 da 64-bitli turni talab qiladi.",
    statementEn: "A binary string is a string made only of the characters 0 and 1. You are given an integer n; among the binary strings of length exactly n, count those in which no two 1s stand next to each other, that is those with no two consecutive 1s. Two strings differing in any position are counted separately. Print one integer — that number of strings; for n = 1 both strings (0 and 1) satisfy the condition. The answer needs a 64-bit type at n = 40.",
  },
  {
    id: "A16",
    statementUz: "Har qanday manfiy bo‘lmagan son ikkilik sanoq sistemasida 0 va 1 raqamlari ketma-ketligi sifatida yozilishi mumkin: masalan, 13 soni 1101 ko‘rinishida yoziladi. Sizga shunday n soni berilgan; uning ikkilik yozuvida 1 ga teng bo‘lgan bitlar sonini sanang va bu sonni chiqaring. 13 uchun javob 3 bo‘ladi, chunki 1101 da uchta birlik bit bor. n = 0 bo‘lganda birorta ham birlik bit yo‘q va javob 0 ga teng. n 10^18 gacha bo‘lgani uchun u 64-bitli turda saqlanadi.",
    statementEn: "Every non-negative number can be written in binary as a sequence of the digits 0 and 1: the number 13, for instance, is written 1101. You are given such a number n; count how many bits equal 1 in its binary representation and print that count. For 13 the answer is 3, since 1101 holds three one bits. When n = 0 there is no one bit at all and the answer is 0. Since n goes up to 10^18, it is held in a 64-bit type.",
  },
  {
    id: "B139",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; elementlar ixtiyoriy tartibda keladi va manfiy bo‘lishi mumkin. Massivda uchramaydigan eng kichik musbat butun sonni toping va uni chiqaring. Nol va manfiy qiymatlar nomzod emas: javob har doim 1 dan boshlanadigan musbat son bo‘ladi va hech qanday manfiy element uni to‘smaydi. Javob 1 dan n + 1 gacha bo‘lgan oraliqda yotadi, chunki n ta element 1, 2, …, n + 1 sonlarining barchasini qamrab olishga yetmaydi.",
    statementEn: "You are given an array a of n integers; the elements arrive in arbitrary order and may be negative. Find the smallest positive integer that does not appear in the array and print it. Zero and negative values are not candidates: the answer is always a positive number starting from 1, and no negative element can block it. The answer lies between 1 and n + 1, because n elements are not enough to cover all of 1, 2, …, n + 1.",
  },
  {
    id: "B140",
    statementUz: "Sizga bir yoki bir nechta probel bilan ajratilgan, kichik lotin harflaridan iborat so‘zlar qatori berilgan. Har bir turli so‘z qatorda necha marta uchraganini qarab, eng ko‘p uchraydigan so‘zni toping va uni chiqaring. Bir nechta so‘z bir xil sonda uchrasa, ular orasidan alifboda birinchi keladigani tanlanadi, shuning uchun javob har doim yagona. Qatorda kamida bitta so‘z bor, ya'ni javob har doim mavjud.",
    statementEn: "You are given a line of words made of lowercase Latin letters, separated by one or more spaces. Look at how many times each distinct word occurs in the line, find the word that occurs most often, and print it. If several words occur equally often, the one that comes first alphabetically is chosen, so the answer is always unique. The line holds at least one word, so an answer always exists.",
  },
  {
    id: "A119",
    statementUz: "Sizga n soni va undan keyin n ta butun son berilgan. Shu n ta qiymatning yig‘indisini hisoblang va uni bitta son sifatida chiqaring. Qiymatlar manfiy bo‘lishi mumkin, shuning uchun yig‘indi ham manfiy chiqishi mumkin, va manfiy hadlar musbatlarini qisqartirib yuborishi mumkin. Yig‘indining moduli 10^14 ga yetadi — ya'ni har bir alohida sondan ancha katta va 32-bitli turning chegarasidan tashqarida.",
    statementEn: "You are given a number n followed by n integers. Compute the sum of those n values and print it as a single number. The values may be negative, so the sum may come out negative as well, and negative terms may cancel positive ones. The magnitude of the sum reaches 10^14 — far larger than any single number, and outside the range of a 32-bit type.",
  },
  {
    id: "C270",
    statementUz: "Sizga n × m o'lchamli matritsa berilgan. Uning har bir qatori chapdan o'ngga qat'iy o'sib boradi va har bir ustuni yuqoridan pastga qat'iy o'sib boradi; lekin matritsa bir butun sifatida tartiblangan emas — bir qatorning oxiridagi son keyingi qatorning boshidagi sondan katta bo'lishi mumkin. So'ngra q ta so'rov keladi, har birida bitta x soni. Har bir so'rov uchun x matritsaning biror o'rnida uchraydimi degan savolga javob bering va javoblarni so'rovlar tartibida, har birini alohida qatorda chiqaring.",
    statementEn: "You are given an n × m matrix. Every row of it increases strictly from left to right and every column increases strictly from top to bottom; the matrix as a whole, however, is not sorted — the number at the end of one row may be larger than the one at the start of the next. Then q queries arrive, each holding a single number x. For each query decide whether x occurs at some position of the matrix, and print the answers in query order, each on its own line.",
  },
  {
    id: "C278",
    statementUz: "Sizga n ta maqolaning iqtiboslar soni berilgan. Tadqiqotchining h-indeksi deb shunday eng katta h butun soniga aytiladiki, uning kamida h ta maqolasining har biri kamida h marta iqtibos keltirilgan bo'lsin. Shu qiymatni toping va uni chiqaring. h-indeks hech qachon n dan oshmaydi, chunki h ta maqola kerak; h = 0 ham mumkin — masalan, barcha maqolalar hech qachon iqtibos keltirilmagan bo'lsa. Iqtiboslar soni 0 bo'lishi ham mumkin va maqolalar ixtiyoriy tartibda beriladi.",
    statementEn: "You are given the citation counts of n papers. The h-index of the researcher is the largest integer h for which at least h of the papers have at least h citations each. Find that value and print it. The h-index never exceeds n, since h papers are required; h = 0 is possible as well — when every paper has never been cited, for instance. A citation count may be 0, and the papers are given in arbitrary order.",
  },
  {
    id: "C267",
    statementUz: "Sizga kichik lotin harflaridan iborat s va t satrlari berilgan. s ning bo'lagi — undagi ketma-ket harflar ketma-ketligi. Shunday bo'laklar orasidan t ni qamrab oluvchilarini qaraymiz: bo'lakda t ning har bir harfi kamida t dagi kabi ko'p marta uchrashi kerak, ya'ni t da bir harf ikki marta bo'lsa, bo'lakda ham kamida ikki marta bo'lishi shart. Bo'lakdagi harflar tartibi ahamiyatsiz. Eng qisqa shunday bo'lakning uzunligini chiqaring; agar s da biror harf yetarli emas va bunday bo'lak yo'q bo'lsa, 0 chiqaring.",
    statementEn: "You are given strings s and t of lowercase Latin letters. A substring of s is a run of consecutive letters in it. Among those substrings consider the ones that cover t: the substring must contain every letter of t at least as many times as t does, so a letter appearing twice in t must appear at least twice in the substring. The order of the letters inside the substring does not matter. Print the length of the shortest such substring; if s does not hold enough of some letter and no such substring exists, print 0.",
  },
  {
    id: "B74",
    statementUz: "Sizga n ta poyezdning kelish va jo‘nash vaqtlari berilgan: har bir poyezd a vaqtida keladi va d vaqtida jo‘naydi, bunda a ≤ d, va shu oraliqda stansiyada turadi. Vaqtlarning biror lahzasida stansiyada bir vaqtning o‘zida turgan poyezdlarning eng ko‘p sonini toping va uni chiqaring — bu stansiyaga kerak bo‘ladigan perronlarning eng kam soniga teng. Chegaralar ham stansiyada bo‘lish deb hisoblanadi: a va d vaqtlarida poyezd shu yerda. Vaqtlar tartiblanmagan holda beriladi.",
    statementEn: "You are given the arrival and departure times of n trains: each train arrives at time a and departs at time d with a ≤ d, and stands at the station throughout that span. Find the largest number of trains present at the station at the same moment and print it — that is the smallest number of platforms the station needs. The ends count as being at the station: at times a and d the train is there. The times are given in no particular order.",
  },
  {
    id: "C212",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilmagan qirradan iborat graf berilgan; har bir qirraning vazni 0 yoki 1 ga teng. Yo'lning vazni deb undagi qirralar vaznlarining yig'indisi tushuniladi. 1-tugundan n-tugungacha boradigan yo'llar orasidan vazni eng kichigini toping va shu vaznni chiqaring. Graf bog'lamli bo'lishi shart emas: n-tugunga umuman yetib bo'lmasa, -1 chiqaring. n = 1 bo'lgan holatda boshlang'ich tugunning o'zi manzil bo'ladi va javob 0 ga teng.",
    statementEn: "You are given an undirected graph with n vertices and m edges in which every edge has weight 0 or 1. The weight of a path is the sum of the weights of its edges. Among the paths from vertex 1 to vertex n find the one of smallest weight and print that weight. The graph need not be connected: if vertex n cannot be reached at all, print -1 instead. In the case n = 1 the starting vertex is the destination and the answer is 0.",
  },
  {
    id: "B157",
    statementUz: "Sizga kichik lotin harflaridan iborat n ta so‘z berilgan. Ularni uzunligi bo‘yicha o‘sish tartibida — qisqasidan boshlab — saralang; uzunligi bir xil bo‘lgan so‘zlar o‘zaro alifbo tartibida joylashadi. Shu ikki qoida tartibni to‘liq aniqlaydi, ya'ni javob yagona. Saralangan so‘zlarni bitta qatorda, probel bilan ajratib chiqaring. E'tibor bering, natija umumiy alifbo tartibi bilan bir xil bo‘lishi shart emas.",
    statementEn: "You are given n words of lowercase Latin letters. Sort them by increasing length — shortest first — with words of equal length ordered alphabetically among themselves. Those two rules determine the order completely, so the answer is unique. Print the sorted words on one line, separated by single spaces. Note that the result need not agree with plain alphabetical order overall.",
  },
  {
    id: "C230",
    statementUz: "k tartibli chiziqli rekurrent ketma-ketlik quyidagicha aniqlanadi: birinchi k had f_1, …, f_k berilgan bo'ladi, undan keyingi har bir had esa oldingi k tasidan chiziqli tarzda hosil bo'ladi — i > k uchun f_i = c_1·f_{i−1} + c_2·f_{i−2} + … + c_k·f_{i−k}. Sizga k, n, c_1, …, c_k koeffitsientlari va f_1, …, f_k boshlang'ich hadlari berilgan. f_n hadining 10^9 + 7 modulidagi qoldig'ini hisoblang va uni chiqaring. n ≤ k bo'lgan holat ham uchraydi: unda javob berilgan f_n hadining o'zi (modul bo'yicha).",
    statementEn: "A linear recurrence of order k is defined like this: the first k terms f_1, …, f_k are given, and every later term is a linear combination of the previous k — for i > k, f_i = c_1·f_{i−1} + c_2·f_{i−2} + … + c_k·f_{i−k}. You are given k, n, the coefficients c_1, …, c_k and the initial terms f_1, …, f_k. Compute the value of the term f_n modulo 10^9 + 7 and print it. The case n ≤ k does occur: the answer is then the given term f_n itself, taken modulo the same number.",
  },
  {
    id: "C299",
    statementUz: "Quyidagi ichma-ich sikl qaraladi, bunda k noldan boshlanadi:\n\n  for i = 1 to n:\n    for j = i to n:\n      k = k + 1\n\nTashqi sikl i ni 1 dan n gacha yurgizadi, ichki sikl esa har bir i uchun j ni i dan n gacha yurgizadi — ya'ni ichki sikl har safar boshqa uzunlikda aylanadi. Sikl tanasi jami necha marta bajarilishini, ya'ni oxirida k qanday qiymatga ega bo'lishini hisoblang va shu sonni chiqaring. Javob 5·10^17 gacha yetadi va 32-bitli turga sig'maydi.",
    statementEn: "Consider the following nested loop, where k starts at zero:\n\n  for i = 1 to n:\n    for j = i to n:\n      k = k + 1\n\nThe outer loop runs i from 1 to n, and for each i the inner loop runs j from i to n — so the inner loop turns a different number of times on each pass. Compute how many times the loop body runs in total, that is what value k holds at the end, and print that number. The answer reaches 5·10^17 and does not fit in a 32-bit type.",
  },
  {
    id: "A03",
    statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan; u o‘nlik sanoq sistemasida, boshida nolsiz va ishorasiz yozilgan. Uning raqamlarini birma-bir qarab, ularning yig‘indisini hisoblang va uni chiqaring: masalan, 9875 sonining raqamlari 9, 8, 7 va 5 bo‘lib, yig‘indisi 29 ga teng. n = 0 bo‘lganda yagona raqam 0 va javob ham 0 bo‘ladi. n 10^18 gacha, ya'ni 19 xonagacha bo‘lishi mumkin, shuning uchun u 32-bitli turga sig‘maydi.",
    statementEn: "You are given a non-negative integer n, written in decimal without leading zeros and without a sign. Look at its digits one by one, compute their sum and print it: the digits of 9875, for instance, are 9, 8, 7 and 5, and their sum is 29. When n = 0 the only digit is 0 and the answer is 0 as well. Since n goes up to 10^18, that is up to 19 digits, it does not fit in a 32-bit type.",
  },
];
