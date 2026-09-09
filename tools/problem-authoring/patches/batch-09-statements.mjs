/* Statement rewrite, batch 09 — fourteen more. Rules in batch 01's header.
 *
 * A09 is here for a second reason: its statement ended with "what matters is
 * reducing the running product at every step", which is the solution, told
 * before the reader has been told the task. That is exactly what the legend
 * used to do, and it does not survive just because it had crept into the
 * statement itself. The sample note still explains the overflow, which is
 * where an explanation belongs.
 *
 * Applied with: node restate.mjs patches/batch-09-statements.mjs
 */
export default [
  {
    id: "C225",
    statementUz: "Sizga musbat a va b hamda butun c sonlari berilgan va ax + by = c chiziqli tenglamasi qaraladi, bunda x va y butun sonlar bo'lishi kerak. Shunday butun y mavjud bo'ladigan eng kichik manfiy bo'lmagan x ni toping va uni chiqaring. Tenglamaning butun sonli yechimi umuman bo'lmasligi mumkin — bunday holda -1 chiqaring. Yechim mavjud bo'lganda javob b / gcd(a, b) dan oshmaydi, ya'ni uni izlash oralig'i chekli.",
    statementEn: "You are given positive integers a and b and an integer c, and the linear equation ax + by = c is considered, where x and y must both be integers. Find the smallest non-negative x for which some integer y exists, and print it. The equation may have no integer solution at all — in that case print -1. When a solution does exist the answer never exceeds b / gcd(a, b), so the range it can lie in is finite.",
  },
  {
    id: "C234",
    statementUz: "Tekislikda ikkita kesma har biri ikki chekka nuqtasi bilan berilgan. Ularning umumiy nuqtasi bor-yo'qligini aniqlang va agar bo'lsa YES, aks holda NO chiqaring. Chegaraviy hollar ham kesishish hisoblanadi: kesmalar bitta nuqtada tegishi mumkin, bir-birining ustida qisman yoki to'liq yotishi mumkin, hamda kesmaning ikki chekka nuqtasi ustma-ust tushib, u nuqtaga aylanib qolishi mumkin — bunda nuqta ikkinchi kesmada yotsa, javob YES bo'ladi. Koordinatalar 10^9 gacha.",
    statementEn: "You are given two segments in the plane, each by its two endpoints. Determine whether they have a common point, and print YES if they do and NO if they do not. The degenerate cases count as intersecting: the segments may touch at a single point, may overlap partially or entirely, and a segment whose two endpoints coincide collapses to a point — if that point lies on the other segment, the answer is YES. The coordinates go up to 10^9.",
  },
  {
    id: "C301",
    statementUz: "Navbat — elementlar oxiriga qo'shiladigan va boshidan olinadigan tuzilma: birinchi kelgan birinchi ketadi. Boshida navbat bo'sh. So'ngra q ta amal ketma-ket beriladi:\n\n• \"1 x\" — x sonini navbat oxiriga qo'shadi;\n• \"2\" — navbat boshidagi sonni chiqaradi va uni navbatdan olib tashlaydi.\n\nHar bir 2-turdagi amal uchun chiqarilgan sonni alohida qatorda yozing. Ikkinchi tur amali hech qachon bo'sh navbatga kelmaydi, ya'ni har bir chiqarish uchun element bor. Bir xil qiymat bir necha marta qo'shilishi mumkin.",
    statementEn: "A queue is a structure where elements are added at the back and taken from the front: first in, first out. The queue starts empty. Then q operations are given one after another:\n\n• \"1 x\" — adds the number x to the back of the queue;\n• \"2\" — prints the number at the front and removes it from the queue.\n\nFor every operation of type 2 write the printed number on its own line. An operation of the second kind never arrives on an empty queue, so there is always an element to remove. The same value may be added several times.",
  },
  {
    id: "B69",
    statementUz: "Sizga kichik lotin harflaridan iborat s matni va p naqshi berilgan. Naqsh s ning i-pozitsiyasida uchraydi deyiladi, agar s ning shu pozitsiyadan boshlangan, uzunligi |p| ga teng bo'lagi p bilan aynan mos kelsa. Shunday pozitsiyalarni sanang va ularning sonini chiqaring. Uchrashlar bir-birining ustiga tushishi mumkin: har bir boshlanish pozitsiyasi alohida sanaladi, hatto oldingi uchrash hali tugamagan bo‘lsa ham. Naqsh umuman uchramasa, javob 0 bo‘ladi.",
    statementEn: "You are given a text s and a pattern p, both of lowercase Latin letters. The pattern occurs at position i of s when the piece of s starting there, of length |p|, matches p exactly. Count such positions and print how many there are. Occurrences may overlap: every starting position is counted separately, even when an earlier occurrence has not yet finished. If the pattern does not occur at all, the answer is 0.",
  },
  {
    id: "B85",
    statementUz: "Sizga a butun soni va tub m moduli berilgan (1 ≤ a < m). a ning m modulidagi teskari elementi deb shunday x soniga aytiladi-ki, a · x ni m ga bo‘lganda qoldiq 1 ga teng bo‘lsin, ya'ni a · x ≡ 1 (mod m). m tub va a unga karrali bo‘lmagani uchun 0 dan m − 1 gacha bo‘lgan oraliqda aynan bitta shunday x mavjud. Shu x ni toping va uni chiqaring. Ikki qiymatning ko‘paytmasi 10^18 ga yetadi.",
    statementEn: "You are given an integer a and a prime modulus m with 1 ≤ a < m. The modular inverse of a modulo m is the number x for which a · x leaves remainder 1 when divided by m, that is a · x ≡ 1 (mod m). Because m is prime and a is not a multiple of it, exactly one such x exists in the range from 0 to m − 1. Find that x and print it. A product of two such values reaches 10^18.",
  },
  {
    id: "C194",
    statementUz: "Sizga n ta musbat butun sondan iborat massiv va k soni berilgan. Elementlarni aynan k ta guruhga bo‘lish kerak: har bir element aynan bitta guruhga tegishli bo‘ladi, birorta guruh bo‘sh qolmaydi, va barcha k ta guruhdagi qiymatlar yig‘indisi bir xil bo‘lishi shart. Shunday bo‘linish mavjudligini aniqlang va agar mavjud bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring. k = 1 bo‘lganda barcha elementlar bitta guruhga tushadi va javob har doim YES.",
    statementEn: "You are given an array of n positive integers and a number k. The elements must be split into exactly k groups: every element belongs to exactly one group, no group is left empty, and the sums of the values in all k groups must be equal. Determine whether such a split exists, and print YES if it does and NO if it does not, in capital letters. For k = 1 every element falls into one group and the answer is always YES.",
  },
  {
    id: "C254",
    statementUz: "Yo'naltirilmagan grafdagi halqa deb boshlangan tuguniga qaytadigan va birorta qirrani ikki marta ishlatmaydigan yopiq yo'lga aytiladi; halqaning uzunligi — undagi qirralar soni. Sizga n ta tugun va m ta qirradan iborat graf berilgan; undagi eng qisqa halqaning uzunligini toping va uni chiqaring. Grafda halqa umuman bo'lmasa, -1 chiqaring. Bir juft tugun orasidagi ikkita parallel qirra allaqachon uzunligi 2 bo'lgan halqa hosil qiladi. O'z-o'ziga bog'lovchi qirra berilmaydi.",
    statementEn: "A cycle in an undirected graph is a closed walk that returns to the vertex it started from without using any edge twice; the length of a cycle is the number of edges on it. You are given a graph with n vertices and m edges; find the length of its shortest cycle and print it. If the graph has no cycle at all, print -1. Two parallel edges between the same pair of vertices already form a cycle of length 2. No edge joins a vertex to itself.",
  },
  {
    id: "A155",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; u ixtiyoriy tartibda keladi va qiymatlari manfiy bo‘lishi mumkin. Uning elementlarini o‘smaydigan tartibda — eng kattasidan eng kichigiga qarab — bitta qatorda chiqaring. Takrorlangan qiymatlar tashlab yuborilmaydi: har bir qiymat massivda necha marta uchrasa, chiqishda ham shuncha marta yoziladi, ya'ni chiqishda aynan n ta son bo‘ladi.",
    statementEn: "You are given an array a of n integers; it arrives in arbitrary order and its values may be negative. Print its elements in non-increasing order — from the largest to the smallest — on one line. Repeated values are not dropped: each value appears in the output as many times as it occurs in the array, so the output holds exactly n numbers.",
  },
  {
    id: "A09",
    statementUz: "Musbat n sonining faktoriali deb 1 dan n gacha bo‘lgan barcha butun sonlarning ko‘paytmasiga aytiladi: n! = 1 · 2 · 3 · … · n; kelishuvga ko‘ra 1! = 1. Sizga n butun soni berilgan; n! ning 10^9 + 7 modul bo‘yicha qoldig‘ini hisoblang va uni chiqaring. Faktorialning o‘zi n ning kichik qiymatlarida ham har qanday butun turdan katta bo‘lib ketadi, shuning uchun javob aynan shu modul bo‘yicha so‘raladi. Modul tub son, lekin masalaning shartida bu hech qanday rol o‘ynamaydi.",
    statementEn: "The factorial of a positive number n is the product of every integer from 1 to n: n! = 1 · 2 · 3 · … · n, with 1! = 1 by convention. You are given an integer n; compute the value of n! modulo 10^9 + 7 and print it. The factorial itself outgrows any integer type even for small n, which is why the answer is asked for modulo that number. The modulus is prime, but nothing in the task depends on that.",
  },
  {
    id: "B48",
    statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan. Uning butun kvadrat ildizi deb x · x ≤ n shartini qanoatlantiruvchi eng katta manfiy bo‘lmagan x butun soniga aytiladi. Shu x ni toping va uni chiqaring. n to‘liq kvadrat bo‘lganda javob aniq ildiz bo‘ladi — masalan, n = 16 uchun 4; aks holda esa ildiz pastga yaxlitlanadi, ya'ni n = 17 uchun ham javob 4. n = 0 bo‘lganda javob 0. n 10^18 gacha, javob esa 10^9 gacha yetadi.",
    statementEn: "You are given a non-negative integer n. Its integer square root is the largest non-negative integer x satisfying x · x ≤ n. Find that x and print it. When n is a perfect square the answer is the exact root — 4 for n = 16, say; otherwise the root is rounded down, so for n = 17 the answer is 4 as well. For n = 0 the answer is 0. Note that n goes up to 10^18 and the answer up to 10^9.",
  },
  {
    id: "C204",
    statementUz: "Satr palindrom deyiladi, agar u chapdan o'ngga va o'ngdan chapga bir xil o'qilsa. Sizga kichik lotin harflaridan iborat s satri berilgan. 1 ≤ l ≤ r ≤ |s| shartini qanoatlantiruvchi (l, r) juftliklari orasidan l-dan r-gacha bo'lgan bo'lak palindrom bo'lganlarini sanang va ularning sonini chiqaring. Sanoq juftliklar, ya'ni pozitsiyalar bo'yicha yuritiladi: ikki turli juftlik bir xil satrni bersa ham, ular alohida sanaladi, va uzunligi 1 bo'lgan har bir bo'lak palindrom hisoblanadi. Javob 5·10^11 gacha yetadi.",
    statementEn: "A string is a palindrome when it reads the same from left to right and from right to left. You are given a string s of lowercase Latin letters. Among the pairs (l, r) with 1 ≤ l ≤ r ≤ |s|, count those for which the substring from l to r is a palindrome, and print that count. The counting is over pairs, that is over positions: two different pairs spelling the same string are counted separately, and every substring of length 1 is a palindrome. The answer reaches 5·10^11.",
  },
  {
    id: "C259",
    statementUz: "Sizga n ta chiziq berilgan; i-chisi f_i(x) = a_i·x + b_i funksiyasi bilan aniqlanadi. Har bir x uchun F(x) deb shu n ta qiymatning eng kattasini olamiz: F(x) = max_i f_i(x). [L, R] oralig'idagi butun x qiymatlari orasidan F(x) ni eng kichik qiladiganini qarab, shu eng kichik F qiymatini chiqaring — kerak bo'lgan javob x ning o'zi emas, balki F ning qiymati. Chegaralar ikkalasi ham oraliqqa kiradi, va qiymatlar 10^15 ga yetadi.",
    statementEn: "You are given n lines, the i-th defined by the function f_i(x) = a_i·x + b_i. For each x let F(x) be the largest of those n values: F(x) = max_i f_i(x). Among the integer values of x in [L, R], consider the one that makes F(x) smallest, and print that smallest value of F — the answer required is the value of F, not the x itself. Both ends belong to the range, and the values reach 10^15.",
  },
  {
    id: "A10",
    statementUz: "Sizga ikkita musbat a va b butun soni berilgan. Ularning eng katta umumiy bo‘luvchisi gcd(a, b) — ikkalasini ham qoldiqsiz bo‘ladigan sonlarning eng kattasi; eng kichik umumiy karralisi lcm(a, b) esa ikkalasiga ham qoldiqsiz bo‘linadigan musbat sonlarning eng kichigi. Shu ikki qiymatni hisoblang va bitta qatorda, avval gcd, so‘ng lcm bo‘lgan holda chiqaring. Eng kichik umumiy karrali 10^18 ga yetishi mumkin, ya'ni u 32-bitli turga sig‘maydi.",
    statementEn: "You are given two positive integers a and b. Their greatest common divisor gcd(a, b) is the largest number dividing both without a remainder; their least common multiple lcm(a, b) is the smallest positive number divisible by both. Compute those two values and print them on one line, the gcd first and the lcm second. The least common multiple can reach 10^18, so it does not fit in a 32-bit type.",
  },
  {
    id: "B28",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Blok deb bir xil qiymatni saqlaydigan ketma-ket pozitsiyalar guruhiga aytiladi. Shunday bloklar orasidan eng uzunini toping va uning uzunligini chiqaring. Faqat yonma-yon turgan pozitsiyalar bitta blokka kiradi: massivning boshqa joyida turgan teng qiymat blokni uzaytirmaydi. Har bir element o‘zi uzunligi 1 bo‘lgan blok hosil qiladi, shuning uchun javob har doim kamida 1 ga teng.",
    statementEn: "You are given an array a of n integers. A block is a group of consecutive positions holding the same value. Find the longest such block and print its length. Only adjacent positions belong to one block: an equal value sitting elsewhere in the array does not extend it. Every element forms a block of length 1 on its own, so the answer is always at least 1.",
  },
];
