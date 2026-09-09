/* Statement rewrite, batch 13 — the last thirteen statements that were still
 * shorter than the 240 characters the generator now demands of a new problem.
 * With this batch every Uzbek statement in the bank states its task in full.
 * Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-13-statements.mjs
 */
export default [
  {
    id: "C112",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta so‘rov berilgan; massiv so‘rovlar davomida umuman o‘zgarmaydi. Har bir so‘rov ikkita l va r indeksdan iborat va massivning l-dan r-gacha bo‘lgan bo‘lagini ko‘rsatadi, chegaralar ham qo‘shiladi. Har bir so‘rov uchun a_l, a_{l+1}, …, a_r orasidagi eng kichik qiymatni toping va uni alohida qatorda chiqaring. l = r bo‘lgan holda bo‘lak bitta elementdan iborat va javob a_l ning o‘zi.",
    statementEn: "You are given an array a of n integers followed by q queries; the array never changes between them. Each query consists of two indices l and r and names the stretch of the array from l to r, ends included. For each query find the smallest value among a_l, a_{l+1}, …, a_r and print it on its own line. When l = r the stretch is a single element and the answer is a_l itself.",
  },
  {
    id: "B50",
    statementUz: "Sizga uchta a, b va m butun soni berilgan: asos, daraja va modul. a ning b-darajasini, ya'ni a ni o‘ziga b marta ko‘paytirib chiqilgan qiymatni, m modul bo‘yicha hisoblang va uni chiqaring. Chegaraviy hollar ham qaraladi: b = 0 bo‘lganda a^0 = 1, bu a = 0 uchun ham shunday; m = 1 bo‘lganda esa har qanday son 1 ga bo‘linadi va javob 0 bo‘ladi. Javob har doim 0 dan m − 1 gacha bo‘lgan oraliqda yotadi.",
    statementEn: "You are given three integers a, b and m: a base, an exponent and a modulus. Compute a raised to the power b — the value of a multiplied by itself b times — modulo m, and print it. The boundary cases are included: for b = 0 the value a^0 is 1, and that holds for a = 0 too; for m = 1 every number is divisible by 1 and the answer is 0. The answer always lies in the range from 0 to m − 1.",
  },
  {
    id: "C118",
    statementUz: "Sizga n ta uchdan iborat daraxt berilgan va uning har bir uchi bitta butun qiymat saqlaydi. Daraxtda har qanday ikki uch orasida yagona yo‘l bor. Sizga q ta so‘rov keladi, har biri ikkita u va v uchini nomlaydi; har bir so‘rov uchun u va v orasidagi yo‘lda yotgan uchlardagi qiymatlar yig‘indisini hisoblang — u va v ning o‘zidagi qiymatlar ham yig‘indiga kiradi — va javobni alohida qatorda chiqaring. u = v bo‘lgan holda yo‘l bitta uchdan iborat va javob shu uchning qiymati.",
    statementEn: "You are given a tree with n nodes, each holding one integer value. There is exactly one path between any two nodes of a tree. You are given q queries, each naming two nodes u and v; for every query compute the sum of the values at the nodes lying on the path between u and v — the values at u and v themselves included — and print the answer on its own line. When u = v the path is a single node and the answer is that node's value.",
  },
  {
    id: "C266",
    statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Shunday (i, j, k) pozitsiyalar uchliklari sonini toping-ki, i < j < k va a_i + a_j + a_k = 0 bo'lsin, va bu sonni chiqaring. Uchliklar pozitsiyalar bo'yicha sanaladi, qiymatlar bo'yicha emas: turli pozitsiyalarda turgan bir xil qiymatlar to'plami alohida uchlik hisoblanadi. Uchliklar soni 4.5·10^9 gacha yetishi mumkin, ya'ni javob 32-bitli turga sig'maydi.",
    statementEn: "You are given an array of n integers. Count the triples of positions (i, j, k) with i < j < k for which a_i + a_j + a_k = 0, and print that count. Triples are counted by position rather than by value: the same collection of values at different positions is a separate triple. The count can reach 4.5·10^9, so the answer does not fit in a 32-bit type.",
  },
  {
    id: "B24",
    statementUz: "Sizga ( ) [ ] { } oltita belgisidan tuzilgan s satri berilgan. Ketma-ketlik to‘g‘ri deyiladi, agar har bir yopiluvchi qavs eng oxirgi juftsiz ochilgan qavsga turi bo‘yicha mos kelsa va satr o‘qib bo‘lingach birorta qavs juftsiz qolmasa. Shunga ko‘ra \"([])\" to‘g‘ri, \"([)]\" esa to‘g‘ri emas: yopiluvchi qavslarning tartibi ochilganlariga mos kelmaydi. Berilgan satr to‘g‘ri ketma-ketlik ekanini aniqlang va YES yoki NO deb bosh harflarda chiqaring.",
    statementEn: "You are given a string s made of the six characters ( ) [ ] { }. A sequence is correct when every closing bracket matches the type of the most recent unmatched opening bracket, and no bracket is left unmatched once the string has been read. So \"([])\" is correct while \"([)]\" is not: the order of the closing brackets does not follow that of the opening ones. Determine whether the given string is a correct sequence and print YES or NO in capital letters.",
  },
  {
    id: "B35",
    statementUz: "Sizga n ta butun sondan iborat a massivi va oyna uzunligi k berilgan. Oyna deb aynan k ta ketma-ket elementdan iborat bo‘lakka aytiladi; birinchi oyna a_1, …, a_k, ikkinchisi a_2, …, a_{k+1} va shu tartibda davom etadi, jami n − k + 1 ta oyna bo‘ladi. Har bir oynaning elementlari yig‘indisini qarab, ularning eng kattasini toping va shu yig‘indini chiqaring. Qiymatlar manfiy bo‘lishi mumkin, ya'ni javob ham manfiy chiqishi mumkin; yig‘indi 10^14 ga yetadi.",
    statementEn: "You are given an array a of n integers and a window length k. A window is a block of exactly k consecutive elements: the first window is a_1, …, a_k, the second a_2, …, a_{k+1}, and so on, giving n − k + 1 windows in all. Looking at the sum of the elements of each window, find the largest of those sums and print it. The values may be negative, so the answer may come out negative too; a sum reaches 10^14.",
  },
  {
    id: "B70",
    statementUz: "Sizga n xil tanga qiymati va maqsad summa t berilgan. Har bir tanga turidan istalgancha ko‘p, jumladan umuman ishlatmasdan foydalanish mumkin. Qiymatlari yig‘indisi aynan t ga teng bo‘ladigan tangalar to‘plamlari orasidan eng kam tangadan iborat bo‘lganini qarab, undagi tangalar sonini chiqaring. Ba'zi summalarni berilgan qiymatlardan yasab bo‘lmaydi — bunday holda −1 chiqariladi. t = 0 bo‘lganda birorta tanga kerak emas va javob 0.",
    statementEn: "You are given n coin denominations and a target amount t. Each denomination may be used any number of times, including not at all. Among the collections of coins whose values add up to exactly t, consider the one with the fewest coins and print how many coins it holds. Some amounts cannot be made from the given denominations — in that case −1 is printed. For t = 0 no coin is needed and the answer is 0.",
  },
  {
    id: "B187",
    statementUz: "Shaxmatdagi rux o‘z satri va o‘z ustuni bo‘ylab hujum qiladi, diagonal bo‘ylab esa hujum qilmaydi. Sizga n × n taxta va k soni berilgan; taxtaga k ta ruxni hech qaysi ikkitasi bir xil satrda yoki bir xil ustunda turmaydigan qilib qo‘yish usullarini sanang va ularning sonini chiqaring. Ikki joylashuv har xil hisoblanadi, agar biror katakda birida rux bo‘lib, ikkinchisida bo‘lmasa; ruxlar bir-biridan farqlanmaydi.",
    statementEn: "A chess rook attacks along its own row and its own column, but not along diagonals. You are given an n × n board and a number k; count the ways to place k rooks on the board so that no two of them stand in the same row or the same column, and print how many there are. Two placements are different when some square holds a rook in one and not in the other; the rooks themselves are indistinguishable.",
  },
  {
    id: "C252",
    statementUz: "Sizga n ta satr va m ta ustundan iborat matritsa berilgan. To'rtburchak soha deb ketma-ket satrlar oralig'i bilan ketma-ket ustunlar oralig'ining kesishmasiga aytiladi; soha bo'sh bo'lmasligi kerak, ya'ni unda kamida bitta katak bo'ladi. Barcha shunday sohalar orasidan elementlari yig'indisi eng katta bo'lganini toping va shu yig'indini chiqaring. Matritsadagi barcha sonlar manfiy bo'lsa ham kamida bitta katak tanlanishi shart, shuning uchun javob manfiy bo'lishi mumkin. Yig'indi 4·10^13 ga yetadi.",
    statementEn: "You are given a matrix with n rows and m columns. A rectangular region is the intersection of a range of consecutive rows with a range of consecutive columns; the region must be non-empty, so it holds at least one cell. Among all such regions find the one whose entries sum to the most, and print that sum. At least one cell must be chosen even when every number in the matrix is negative, so the answer may be negative. A sum reaches 4·10^13.",
  },
  {
    id: "B36",
    statementUz: "Sizga ( va ) belgilaridan tuzilgan, to‘g‘ri muvozanatlangani kafolatlangan s qavslar ketma-ketligi berilgan. Satrni chapdan o‘ngga o‘qib borganda har bir ochiluvchi qavs ochiq qavslar sonini bittaga oshiradi, har bir yopiluvchi qavs esa bittaga kamaytiradi. Shu jarayonning biror nuqtasida bir vaqtda ochiq turgan qavslarning eng katta sonini — ketma-ketlikning maksimal ichma-ichlik chuqurligini — toping va uni chiqaring. Satr bo‘sh bo‘lmagani uchun javob kamida 1 ga teng.",
    statementEn: "You are given a bracket sequence s made of the characters ( and ), guaranteed to be correctly balanced. Reading the string from left to right, every opening bracket raises the number of open brackets by one and every closing bracket lowers it by one. Find the largest number of brackets open at the same time at any point of that process — the maximum nesting depth of the sequence — and print it. Since the string is non-empty, the answer is at least 1.",
  },
  {
    id: "B169",
    statementUz: "Sizga to‘g‘ri chiziqda joylashgan n ta uyning koordinatalari va r radiusi berilgan. Uzatgichni chiziqning istalgan nuqtasiga — uy turgan joyga ham, uylar orasidagi bo‘sh nuqtaga ham — qo‘yish mumkin, va u o‘zidan r masofadan uzoq bo‘lmagan har bir uyni qoplaydi, ya'ni kengligi 2r bo‘lgan bo‘lakni. Har bir uy kamida bitta uzatgich bilan qoplanishi uchun kerak bo‘ladigan uzatgichlarning eng kam sonini toping va uni chiqaring. Uylar tartiblanmagan holda beriladi va bir joyda bir nechta uy bo‘lishi mumkin.",
    statementEn: "You are given the coordinates of n houses on a line and a radius r. A transmitter may be placed at any point of the line — at a house or at an empty point between houses — and it covers every house no farther than r from it, that is a stretch of width 2r. Find the fewest transmitters needed for every house to be covered by at least one of them, and print that number. The houses arrive unsorted, and several houses may sit at the same point.",
  },
  {
    id: "A19",
    statementUz: "Sizga kichik lotin harflari va probellardan iborat bitta matn qatori berilgan. So‘z deb probel bo‘lmagan ketma-ket belgilarning bo‘sh bo‘lmagan eng uzun bo‘lagiga aytiladi — ya'ni ikki tomonidan probel bilan yoki qator cheti bilan chegaralangan harflar guruhiga. Qatordagi so‘zlarni sanang va ularning sonini chiqaring. Ikki so‘z orasida bittadan ortiq probel bo‘lishi mumkin, qator boshida yoki oxirida ham probel bo‘lishi mumkin, va bularning hech biri so‘zlar sonini o‘zgartirmaydi.",
    statementEn: "You are given one line of text made of lowercase Latin letters and spaces. A word is a maximal non-empty run of consecutive non-space characters — a group of letters bounded on each side by a space or by the end of the line. Count the words in the line and print how many there are. Two words may be separated by more than one space, and the line may begin or end with a space; none of that changes the number of words.",
  },
  {
    id: "C151",
    statementUz: "Sizga n ta butun sondan iborat a massivi va oyna uzunligi k berilgan. Oyna deb aynan k ta ketma-ket elementdan iborat bo‘lakka aytiladi; birinchi oyna a_1, …, a_k elementlaridan iborat, keyingisi bir qadam o‘ngga siljiydi va shu tartibda davom etadi, jami n − k + 1 ta oyna bo‘ladi. Har bir oyna uchun undagi eng kichik qiymatni toping va bu qiymatlarni chapdagi oynadan o‘ngdagigacha bo‘lgan tartibda bitta qatorda chiqaring. k = n bo‘lganda yagona oyna butun massivdir.",
    statementEn: "You are given an array a of n integers and a window length k. A window is a block of exactly k consecutive elements: the first window holds a_1, …, a_k, the next is shifted one step to the right, and so on, giving n − k + 1 windows in all. For each window find the smallest value inside it, and print those values on one line in order from the leftmost window to the rightmost. When k = n the single window is the whole array.",
  },
];
