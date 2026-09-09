/* Statement rewrite, batch 03 — twelve more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-03-statements.mjs
 */
export default [
  {
    id: "A127",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning har bir harfini bosh harf shakliga o‘giring — 'a' dan 'A' hosil bo‘ladi, 'b' dan 'B' va shu tartibda — va natijani bitta qatorda chiqaring. Harflarning tartibi o‘zgarmaydi va satrning uzunligi ham o‘zgarmaydi: kirishda nechta belgi bo‘lsa, chiqishda ham shuncha belgi bo‘ladi. Satrda faqat 'a'–'z' harflari uchraydi, ya'ni har bir belgining bosh harf shakli mavjud.",
    statementEn: "You are given a string s of lowercase Latin letters. Convert each of its letters to its uppercase form — 'a' becomes 'A', 'b' becomes 'B', and so on — and print the result on one line. The order of the letters does not change and neither does the length of the string: the output holds exactly as many characters as the input. The string contains only the letters 'a'–'z', so every character has an uppercase form.",
  },
  {
    id: "C231",
    statementUz: "Tekislikda butun koordinatalari bilan berilgan n ta nuqta bor. Ikki nuqta orasidagi masofa odatdagi Evklid masofasi: (x1 − x2)² + (y1 − y2)² ning kvadrat ildizi. Shu masofalarning eng kattasini toping, lekin javob sifatida uning kvadratini — ya'ni (x1 − x2)² + (y1 − y2)² qiymatini — chiqaring; kvadrat so'ralgani javobni butun sonda qoldiradi va yaxlitlash masalasini butunlay yo'q qiladi. Nuqtalar takrorlanishi mumkin: barchasi ustma-ust tushsa javob 0 bo'ladi. Kvadrat masofa 8·10^18 gacha yetadi.",
    statementEn: "You are given n points in the plane with integer coordinates. The distance between two points is the ordinary Euclidean one: the square root of (x1 − x2)² + (y1 − y2)². Find the largest such distance, but print its square — the value (x1 − x2)² + (y1 − y2)² — as the answer; asking for the square keeps the answer an integer and removes the question of rounding entirely. Points may repeat: if they all coincide the answer is 0. A squared distance reaches 8·10^18.",
  },
  {
    id: "C258",
    statementUz: "Sizga n ta manfiy bo'lmagan butun son berilgan. Ularni istalgan tartibda yonma-yon yozib chiqish mumkin, va har bir tartib raqamlarning bitta uzun ketma-ketligini beradi: masalan, 3 va 30 sonlari \"330\" yoki \"303\" ni beradi. Shunday tartibni tanlangki, hosil bo'lgan son eng katta bo'lsin, va shu sonni chiqaring. Natija har qanday butun turdan uzunroq bo'lishi mumkin, shuning uchun u satr sifatida chiqariladi. Barcha sonlar nol bo'lsa, nollar qatori emas, bitta 0 chiqariladi.",
    statementEn: "You are given n non-negative integers. They may be written side by side in any order, and each order gives one long sequence of digits: the numbers 3 and 30, for instance, give \"330\" or \"303\". Choose the order that makes the resulting number the largest, and print that number. The result can be longer than any integer type, so it is printed as a string. If every number is zero, print a single 0 rather than a run of zeros.",
  },
  {
    id: "A133",
    statementUz: "Sizga n soni berilgan — saqlanishi kerak bo‘lgan int qiymatlari soni. Bitta int 4 bayt egallaydi, ya'ni hammasi birgalikda n · 4 bayt joy oladi. Shu hajm necha to‘liq kilobaytga to‘g‘ri kelishini chiqaring, bunda bir kilobayt 1024 baytga teng (1000 emas). Natija pastga yaxlitlanadi: to‘liq bo‘lmagan kilobayt hisobga olinmaydi. n · 4 ko‘paytmasi 4·10^9 ga yetadi, ya'ni u 32-bitli turga sig‘maydi.",
    statementEn: "You are given a number n — how many int values are to be stored. One int occupies 4 bytes, so together they take n · 4 bytes. Print how many whole kilobytes that amount comes to, where one kilobyte is 1024 bytes (not 1000). The result is rounded down: a kilobyte that is not filled does not count. The product n · 4 reaches 4·10^9, which does not fit in a 32-bit type.",
  },
  {
    id: "C213",
    statementUz: "Sizga n ta tugundan iborat daraxt berilgan — bog'lamli, siklsiz va aynan n−1 ta qirrali graf; u 1-tugundan ildiz oladi. Daraxtda har qanday ikki tugun orasida yagona yo'l bor, va ular orasidagi masofa deb shu yo'ldagi qirralar soni tushuniladi. Sizga q ta so'rov keladi, har biri (u, v) juftligidan iborat; har bir so'rov uchun u va v orasidagi masofani hisoblang va uni alohida qatorda chiqaring. u = v bo'lgan holat ham uchraydi va bunda javob 0 bo'ladi.",
    statementEn: "You are given a tree with n vertices — a connected, acyclic graph with exactly n−1 edges — rooted at vertex 1. In a tree there is exactly one path between any two vertices, and the distance between them is the number of edges on that path. You are then given q queries, each a pair (u, v); for each query compute the distance between u and v and print it on its own line. The case u = v does occur, and the answer for it is 0.",
  },
  {
    id: "B164",
    statementUz: "Ikki so‘z bir-birining anagrammasi deyiladi, agar biri ikkinchisining harflarini qayta joylashtirish bilan hosil bo‘lsa, ya'ni ikkalasida ham har bir harf bir xil miqdorda uchrasa. Sizga n ta so‘z berilgan. Ularni shunday guruhlarga ajratingki, ikki so‘z bir guruhda faqat va faqat bir-birining anagrammasi bo‘lganda tursin, va nechta guruh hosil bo‘lganini chiqaring. Bir xil yozilgan ikki so‘z ham anagramma hisoblanadi, shuning uchun javob n dan oshmaydi.",
    statementEn: "Two words are anagrams of each other when one can be obtained by rearranging the letters of the other, that is when every letter occurs the same number of times in both. You are given n words. Split them into groups so that two words share a group exactly when they are anagrams of each other, and print how many groups this produces. Two identical words are anagrams as well, so the answer never exceeds n.",
  },
  {
    id: "C263",
    statementUz: "Sizga o'sish tartibida — ya'ni a_i ≤ a_{i+1} shartini qanoatlantirgan holda — berilgan n ta butun sondan iborat massiv berilgan; elementlar manfiy bo'lishi mumkin. Har bir elementning kvadratini hisoblang va hosil bo'lgan n ta sonni o'sish tartibida bitta qatorda chiqaring. Kirish tartiblangan bo'lsa ham, kvadratlar tartiblangan bo'lmaydi: manfiy sonning kvadrati katta bo'lib chiqishi mumkin. Kvadratlar 10^18 gacha yetadi, ya'ni ular 32-bitli turga sig'maydi.",
    statementEn: "You are given an array of n integers in non-decreasing order — that is, a_i ≤ a_{i+1} — whose elements may be negative. Square every element and print the resulting n numbers on one line in non-decreasing order. Even though the input is sorted, the squares are not: the square of a negative number can come out large. A square reaches 10^18, so it does not fit in a 32-bit type.",
  },
  {
    id: "A124",
    statementUz: "Sizga n butun soni berilgan. Ikkining darajalarini 2^0 dan 2^n gacha, 2^n ning o‘zini ham qo‘shib, o‘sish tartibida bitta qatorda chiqaring. Ketma-ketlik 1 dan boshlanadi (chunki 2^0 = 1) va har bir keyingi son oldingisidan ikki barobar katta bo‘ladi; jami n + 1 ta qiymat chiqariladi. n = 0 bo‘lishi mumkin — bunday holda faqat bitta son, 1, chiqariladi. n 62 gacha bo‘lgani uchun eng katta daraja 32-bitli turga sig‘maydi.",
    statementEn: "You are given an integer n. Print the powers of two from 2^0 up to and including 2^n, in increasing order, on one line. The sequence starts at 1 (since 2^0 = 1) and every later value is twice the one before it, giving n + 1 values in all. Note that n may be 0, in which case a single number, 1, is printed. Since n goes up to 62, the largest power does not fit in a 32-bit type.",
  },
  {
    id: "B176",
    statementUz: "Satr t satrning prefiksi deyiladi, agar t ning boshidan boshlangan bo‘lagi bo‘lsa: \"fl\" — \"flower\" ning prefiksi. Sizga kichik lotin harflaridan iborat n ta satr berilgan. Ularning har biri uchun prefiks bo‘lgan eng uzun satrni toping va uni chiqaring. Satrlar birinchi belgisidan boshlab farq qilsa, umumiy prefiks bo‘sh bo‘ladi; bunday holda bo‘sh qator emas, bitta defis belgisi chiqariladi. n = 1 bo‘lsa, javob shu yagona satrning o‘zi.",
    statementEn: "A string is a prefix of t when it is a piece of t starting at its very beginning: \"fl\" is a prefix of \"flower\". You are given n strings of lowercase Latin letters. Find the longest string that is a prefix of every one of them, and print it. If the strings already differ at their first character the common prefix is empty, and in that case a single hyphen is printed rather than an empty line. When n = 1 the answer is that one string itself.",
  },
  {
    id: "C277",
    statementUz: "Sizga n ta tugunli daraxt berilgan va uning har bir qirrasi musbat vazn tashiydi. Daraxtda har qanday ikki tugun orasida yagona yo'l bor; ular orasidagi masofa deb shu yo'ldagi qirralar vaznlarining yig'indisi tushuniladi. Barcha juftliklar orasidan eng katta masofani — daraxtning diametrini — toping va uni chiqaring. n = 1 bo'lgan holat ham qaraladi: qirra yo'q, ikki tugun yo'q, javob 0. Diametr 2·10^14 gacha yetadi va 32-bitli turga sig'maydi.",
    statementEn: "You are given a tree with n vertices in which every edge carries a positive weight. There is exactly one path between any two vertices; the distance between them is the total weight of the edges on that path. Among all pairs find the largest distance — the diameter of the tree — and print it. The case n = 1 is included: there is no edge and no pair of vertices, and the answer is 0. The diameter reaches 2·10^14 and does not fit in a 32-bit type.",
  },
  {
    id: "A08",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning belgilarini ko‘rib chiqing va ularning nechtasi ingliz tilidagi unli — ya'ni a, e, i, o, u harflaridan biri — ekanini sanang. Bu masalada y harfi unli hisoblanmaydi, qolgan barcha harflar esa undosh. Har bir uchrash alohida sanaladi: bir xil unli bir necha marta kelsa, ularning barchasi javobga qo‘shiladi. Satrda unli bo‘lmasa, javob 0 bo‘ladi.",
    statementEn: "You are given a string s of lowercase Latin letters. Look at its characters and count how many of them are English vowels, that is one of the letters a, e, i, o, u. In this problem the letter y does not count as a vowel, and every other letter is a consonant. Each occurrence counts on its own: if the same vowel appears several times, all of them are added to the answer. If the string holds no vowel, the answer is 0.",
  },
  {
    id: "C282",
    statementUz: "Sizga a, b va c butun sonlari berilgan va f(x) = x³ + a·x + b funksiyasi qaraladi. Shart bo'yicha a ≥ 0, shuning uchun f qat'iy o'suvchi va f(x) = c tenglamasi aynan bitta haqiqiy ildizga ega. Shu ildizni toping va uni o'nlik nuqtadan keyin aynan olti xona bilan chiqaring — masalan, ildiz 2 bo'lsa, javob \"2.000000\" ko'rinishida yoziladi. Ildiz [−1000, 1000] oralig'ida yotishi kafolatlangan, va olti xonaga yaxlitlangan qiymat aynan mos kelishi kerak.",
    statementEn: "You are given integers a, b and c, and the function f(x) = x³ + a·x + b is considered. It is guaranteed that a ≥ 0, so f strictly increases and the equation f(x) = c has exactly one real root. Find that root and print it with exactly six digits after the decimal point — a root of 2, for instance, is written \"2.000000\". The root is guaranteed to lie in [−1000, 1000], and the value rounded to six decimals must match exactly.",
  },
];
