/* Statement rewrite, batch 07 — fourteen more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-07-statements.mjs
 */
export default [
  {
    id: "B175",
    statementUz: "Sizga ko‘pburchak uning n ta uchi bilan berilgan; uchlar kontur bo‘ylab tartib bilan sanab o‘tilgan, ya'ni ketma-ket kelgan har ikki uch qirra bilan tutashgan. Ko‘pburchakning perimetrini — chegarasi bo‘ylab qirralar uzunliklarining yig‘indisini — hisoblang. Oxirgi uchni birinchisiga qaytarib bog‘laydigan yopiluvchi qirra ham perimetrga kiradi. Natijani o‘nlik nuqtadan keyin aynan olti xona bilan chiqaring.",
    statementEn: "You are given a polygon by its n vertices, listed in order around the outline, so that every two consecutive vertices are joined by an edge. Compute its perimeter — the total length of the edges along its boundary. The closing edge that joins the last vertex back to the first belongs to the perimeter as well. Print the result with exactly six digits after the decimal point.",
  },
  {
    id: "B177",
    statementUz: "Sizga kichik lotin harflaridan iborat, probel bilan ajratilgan so‘zlar qatori berilgan. So‘z deb probellar bilan ajratilgan uzluksiz harflar ketma-ketligi tushuniladi. O‘sha so‘zlarni teskari tartibda — oxirgisidan birinchisiga qarab — bitta qatorda chiqaring; qo‘shni so‘zlar aynan bitta probel bilan ajratiladi, birinchi so‘zdan oldin va oxirgisidan keyin probel bo‘lmaydi. So‘zlarning ichidagi harflar tartibi o‘zgarmaydi: faqat so‘zlarning o‘rni almashadi.",
    statementEn: "You are given a line of words of lowercase Latin letters separated by spaces. A word is an unbroken run of letters delimited by spaces. Print those words in reverse order — from the last to the first — on one line, with adjacent words separated by exactly one space and no space before the first or after the last. The letters inside a word keep their order: only the positions of the words change.",
  },
  {
    id: "C89",
    statementUz: "Binomial koeffitsient C(n, k) — n ta buyumdan k tasini tanlash usullari soni, bunda tanlangan buyumlarning tartibi ahamiyatsiz: {1, 2} va {2, 1} bir xil tanlov hisoblanadi. Sizga n va k sonlari berilgan (0 ≤ k ≤ n). C(n, k) ning 10^9 + 7 modul bo‘yicha qoldig‘ini hisoblang va chiqaring. Chegaraviy hollar ham qaraladi: k = 0 va k = n bo‘lganda faqat bitta tanlov bor, ya'ni javob 1. Koeffitsientning o‘zi juda katta bo‘lgani uchun qoldiq so‘raladi.",
    statementEn: "The binomial coefficient C(n, k) is the number of ways to choose k items out of n when the order of the chosen items does not matter: {1, 2} and {2, 1} are the same choice. You are given n and k with 0 ≤ k ≤ n. Compute and print the value of C(n, k) modulo 10^9 + 7. The boundary cases are included: for k = 0 and k = n there is only one choice, so the answer is 1. The coefficient itself is enormous, which is why a remainder is asked for.",
  },
  {
    id: "B144",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan. Graf daraxt deyiladi, agar u bog‘langan bo‘lsa — ya'ni har qanday uchdan har qanday uchga qirralar bo‘ylab yetib borish mumkin bo‘lsa — va sikl saqlamasa. Berilgan graf daraxt ekanini aniqlang va agar shunday bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring. Bir juft uch orasida bir nechta qirra berilishi mumkin, va bunday takroriy qirra sikl hosil qiladi.",
    statementEn: "You are given a graph with n vertices and m undirected edges. A graph is a tree when it is connected — every vertex can be reached from every other along the edges — and contains no cycle. Determine whether the given graph is a tree, and print YES if it is and NO if it is not, in capital letters. Several edges may be given between the same pair of vertices, and such a repeated edge forms a cycle.",
  },
  {
    id: "C221",
    statementUz: "Ikki tomonli graf berilgan: chap tomonda n ta tugun, o'ng tomonda m ta tugun bor, va ular orasida k ta qirra o'tkazilgan — har bir qirra bitta chap va bitta o'ng tugunni bog'laydi. Juftlashtirish deb hech ikkitasi umumiy tugunga ega bo'lmagan qirralar to'plamiga aytiladi, ya'ni har bir tugun ko'pi bilan bitta tanlangan qirraga tegishli bo'ladi. Eng katta shunday to'plamdagi qirralar sonini toping va uni chiqaring. Bir juft tugun orasida qirra takrorlanishi mumkin, bu javobga ta'sir qilmaydi.",
    statementEn: "A bipartite graph is given: there are n vertices on the left, m on the right, and k edges between them, each joining one left vertex to one right vertex. A matching is a set of edges no two of which share a vertex, so every vertex belongs to at most one chosen edge. Find the number of edges in the largest such set and print it. An edge may be repeated between the same pair of vertices, which does not change the answer.",
  },
  {
    id: "C283",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Almashinuvchi yig'indi deb a_1 − a_2 + a_3 − a_4 + … ifodasiga aytiladi: birinchi element qo'shiladi, ikkinchisi ayiriladi, uchinchisi qo'shiladi va shu tartibda massiv oxirigacha davom etadi. Birinchi element har doim plyus ishorasi bilan keladi. Shu yig'indini hisoblang va uni chiqaring. Natija manfiy bo'lishi mumkin va moduli 2·10^14 ga yetadi, ya'ni u 32-bitli turga sig'maydi.",
    statementEn: "You are given an array a of n integers. The alternating sum is the expression a_1 − a_2 + a_3 − a_4 + …: the first element is added, the second subtracted, the third added, and so on to the end of the array. The first element always carries a plus. Compute that sum and print it. The result may be negative and its magnitude reaches 2·10^14, so it does not fit in a 32-bit type.",
  },
  {
    id: "C260",
    statementUz: "Sonlar o'qida n ta har xil joy berilgan; ularning koordinatalari tartiblangan bo'lishi shart emas. Shu joylardan aynan k tasini tanlash kerak. Har bir tanlov uchun tanlangan joylar orasidagi barcha juftlik masofalarini qarab, ularning eng kichigini olamiz. Shunday tanlovni tanlangki, bu eng kichik masofa imkon qadar katta bo'lsin, va shu erishiladigan eng katta minimal masofani chiqaring. k = 2 bo'lganda ikki chekka joyni olish kifoya, k = n bo'lganda esa barcha joylar tanlanadi.",
    statementEn: "You are given n distinct places on the number line; their coordinates need not be sorted. Exactly k of them must be chosen. For a given choice, look at all the pairwise distances between the chosen places and take the smallest of them. Choose so that this smallest distance is as large as possible, and print that largest achievable minimum distance. For k = 2 taking the two extremes is enough, and for k = n every place is chosen.",
  },
  {
    id: "A02",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Har bir elementning juft yoki toq ekanini aniqlab, juft elementlar sonini va toq elementlar sonini sanang. Son juft deyiladi, agar u 2 ga qoldiqsiz bo‘linsa: nol juft hisoblanadi, manfiy sonlarda esa qoida musbatlardagidek — −4 juft, −3 toq. Ikkita sonni bitta qatorda chiqaring: avval juftlar soni, so‘ng toqlar soni. Bu ikki son yig‘indisi har doim n ga teng.",
    statementEn: "You are given an array a of n integers. Decide for each element whether it is even or odd, and count how many are even and how many are odd. A number is even when it is divisible by 2 with no remainder: zero counts as even, and for negative numbers the rule is the same as for positive ones — −4 is even and −3 is odd. Print two integers on one line: the number of even elements first, then the number of odd ones. The two counts always add up to n.",
  },
  {
    id: "B80",
    statementUz: "Sizga n ta element berilgan va dastlab ularning har biri o‘zining alohida guruhida turadi. So‘ngra q ta amal keladi, har biri uch sondan iborat. \"1 a b\" amali a turgan guruh bilan b turgan guruhni bitta guruhga birlashtiradi; ular allaqachon bir guruhda bo‘lsa, hech narsa o‘zgarmaydi. \"2 a b\" amali a va b ayni paytda bitta guruhda yotadimi degan savol bo‘lib, unga YES yoki NO deb javob berish kerak. Guruhlar faqat birlashadi, hech qachon bo‘linmaydi, va har bir savolga javob amallarning shu paytdagi holatiga bog‘liq.",
    statementEn: "You are given n elements, each of which initially sits in its own separate group. Then q operations arrive, each made of three numbers. The operation \"1 a b\" merges the group containing a with the group containing b; if they already share a group, nothing changes. The operation \"2 a b\" is the question whether a and b lie in the same group at that moment, to be answered YES or NO. Groups only ever merge, never split, and each answer depends on the state at that point in the sequence.",
  },
  {
    id: "B105",
    statementUz: "Sizga ikkita massiv berilgan: birinchisida n ta, ikkinchisida m ta butun son bor, va ularning har biri allaqachon kamaymaydigan tartibda saralangan. Ikkalasining barcha qiymatlarini bitta kamaymaydigan massivga birlashtiring va uni bitta qatorda chiqaring. Natijada aynan n + m ta son bo‘ladi: har bir takrorlanish saqlanadi, ya'ni bir xil qiymat ikki massivda ham uchrasa, u ikki marta chiqadi. Chiqishdagi har bir qiymat kirishdagi biror qiymatning aynan nusxasi.",
    statementEn: "You are given two arrays: n integers in the first and m in the second, each already sorted in non-decreasing order. Merge all the values of both into a single non-decreasing array and print it on one line. The result holds exactly n + m numbers: every duplicate is kept, so a value occurring in both arrays appears twice. Each printed value is a copy of some value from the input.",
  },
  {
    id: "B178",
    statementUz: "Sizga tekislikda butun koordinatalari bilan berilgan uchta nuqta berilgan. Ular kollinear, ya'ni bitta to‘g‘ri chiziqda yotishini aniqlang va agar shunday bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring. Chegaraviy hollar ham kollinear hisoblanadi: ikki nuqta ustma-ust tushgan bo‘lsa yoki uchalasi bir joyda bo‘lsa, ular orqali to‘g‘ri chiziq o‘tkazish mumkin, ya'ni javob YES. Koordinatalar 10^9 gacha bo‘lgani uchun oraliq ko‘paytmalar 4·10^18 ga yetadi.",
    statementEn: "You are given three points on the plane by their integer coordinates. Determine whether they are collinear, that is whether all three lie on a single straight line, and print YES if they are and NO if they are not, in capital letters. The degenerate cases count as collinear: if two of the points coincide, or all three do, a straight line can be drawn through them and the answer is YES. Since the coordinates reach 10^9, intermediate products reach 4·10^18.",
  },
  {
    id: "B156",
    statementUz: "Sonning moduli |x| — uning ishorasidan xoli qiymati: |−3| = 3 va |3| = 3. Sizga n ta butun sondan iborat a massivi berilgan; uni modul bo‘yicha o‘sish tartibida saralang va natijani bitta qatorda chiqaring. Moduli bir xil bo‘lgan ikki qiymat o‘zining haqiqiy qiymati bo‘yicha tartiblanadi, ya'ni manfiysi musbatidan oldinga o‘tadi — bu qoida tartibni to‘liq aniqlaydi va javobni yagona qiladi. Chiqishda kirishdagi barcha n ta son, takrorlanishlari bilan qoladi.",
    statementEn: "The absolute value |x| of a number is its value without a sign: |−3| = 3 and |3| = 3. You are given an array a of n integers; sort it by absolute value in increasing order and print the result on one line. Two values with the same absolute value are ordered by their actual value, so the negative one comes before the positive — that rule determines the order completely and makes the answer unique. The output keeps all n numbers of the input, duplicates included.",
  },
  {
    id: "B183",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning barcha harflarini qayta joylashtirish orqali qanday satrlar hosil bo‘lishini qaraymiz: har bir joylashuvda s ning barcha harflari, o‘z takrorlanishlari bilan ishlatiladi. Shunday satrlardan nechtasi bir-biridan farq qilishini sanang va bu sonni chiqaring. Bir xil o‘qiladigan ikki joylashuv bir marta sanaladi — masalan, \"aab\" da ikkita 'a' ni almashtirish yangi satr bermaydi. Javob har doim kamida 1 ga teng.",
    statementEn: "You are given a string s of lowercase Latin letters. Consider the strings that can be formed by rearranging all of its letters: every arrangement uses all the letters of s, repeats included. Count how many of those strings are different from one another and print that number. Two arrangements that read the same are counted once — swapping the two 'a's of \"aab\", for instance, does not produce a new string. The answer is always at least 1.",
  },
  {
    id: "A04",
    statementUz: "Sizga n butun soni berilgan. n dan qat'iy kichik bo‘lgan musbat butun sonlar orasidan 3 ga yoki 5 ga qoldiqsiz bo‘linadiganlarini qaraymiz va ularning yig‘indisini hisoblaymiz. Ikkalasiga ham bo‘linadigan son — masalan 15 — bu yig‘indiga faqat bir marta qo‘shiladi. n ning o‘zi hisobga olinmaydi, chegara qat'iy. Shu yig‘indini chiqaring; mos son umuman bo‘lmasa (masalan, n = 1 bo‘lganda), javob 0 bo‘ladi.",
    statementEn: "You are given an integer n. Consider the positive integers strictly less than n that are divisible by 3 or by 5, and compute their sum. A number divisible by both — 15, for instance — is added to that sum once only. The value n itself is not counted, the bound is strict. Print that sum; if there is no qualifying number at all (when n = 1, for instance), the answer is 0.",
  },
];
