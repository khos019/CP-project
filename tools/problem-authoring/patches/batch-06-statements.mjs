/* Statement rewrite, batch 06 — fourteen more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-06-statements.mjs
 */
export default [
  {
    id: "A130",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; u saralanmagan holda keladi va bir xil qiymat bir necha marta uchrashi mumkin. Massivda uchraydigan har xil qiymatlarni aniqlang va ularni o‘sish tartibida, har birini aynan bir martadan bitta qatorda chiqaring. Qiymat necha marta takrorlanganidan qat'i nazar, chiqishda u bir marta paydo bo‘ladi, shuning uchun chiqishdagi sonlar soni 1 dan n gacha bo‘ladi. Qiymatlar manfiy bo‘lishi mumkin.",
    statementEn: "You are given an array a of n integers; it arrives unsorted and the same value may occur several times. Determine the distinct values occurring in the array and print them in increasing order, each exactly once, on one line. However many times a value repeated, it appears once in the output, so the output holds between 1 and n numbers. The values may be negative.",
  },
  {
    id: "B189",
    statementUz: "Sizga n ta uchdan iborat daraxt berilgan — bog‘lamli, siklsiz va aynan n − 1 ta qirrali graf. Daraxtdagi yo‘l — takrorlanmaydigan uchlar ketma-ketligi bo‘lib, unda qo‘shni uchlar qirra bilan tutashgan. Aynan ikkita qirradan iborat yo‘llarni sanang va ularning sonini chiqaring. Yo‘l ikki chekka uchi bilan aniqlanadi: uni bir yo‘nalishda yoki teskari yo‘nalishda yurish bir xil yo‘l hisoblanadi. Javob 2^31 dan oshishi mumkin.",
    statementEn: "You are given a tree with n nodes — a connected, acyclic graph with exactly n − 1 edges. A path in a tree is a sequence of distinct nodes in which consecutive nodes are joined by an edge. Count the paths consisting of exactly two edges and print how many there are. A path is identified by its two endpoints: walking it in one direction or the other is the same path. The answer can exceed 2^31.",
  },
  {
    id: "C199",
    statementUz: "1 dan n gacha raqamlangan n yoqli adolatli zar tashlanadi: har bir tashlashda har bir yoq bir xil 1/n ehtimol bilan chiqadi va tashlashlar bir-biridan mustaqil. Zar 1 yog‘i chiqquncha qayta-qayta tashlanadi. Buning uchun kerak bo‘ladigan tashlashlar sonining matematik kutilmasini hisoblang — muvaffaqiyatli tashlashning o‘zi ham hisobga olinadi — va uni o‘nlik nuqtadan keyin aynan olti xona bilan chiqaring. n = 1 bo‘lganda birinchi tashlashning o‘zi 1 ni beradi va javob 1.000000 bo‘ladi.",
    statementEn: "A fair die with n faces, numbered 1 to n, is rolled: on every roll each face comes up with the same probability 1/n, and the rolls are independent of one another. The die is rolled repeatedly until the face 1 comes up. Compute the expected number of rolls this takes — the successful roll itself is counted — and print it with exactly six digits after the decimal point. When n = 1 the very first roll gives a 1 and the answer is 1.000000.",
  },
  {
    id: "C207",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta so'rov berilgan. Har bir so'rov (l, r) juftligidan iborat va massivning l-dan r-gacha bo'lgan bo'lagini, ya'ni a_l, a_{l+1}, …, a_r elementlarini ko'rsatadi; chegaralar ikkalasi ham bo'lakka kiradi. Har bir so'rov uchun shu bo'lakdagi eng kichik qiymatni toping va uni alohida qatorda chiqaring. Massiv so'rovlar davomida hech qachon o'zgarmaydi. l = r bo'lgan holat ham uchraydi: unda bo'lak bitta elementdan iborat va javob a_l ning o'zi.",
    statementEn: "You are given an array a of n integers followed by q queries. Each query is a pair (l, r) naming the stretch of the array from l to r, that is the elements a_l, a_{l+1}, …, a_r, with both ends included. For each query find the smallest value in that stretch and print it on its own line. The array never changes between queries. The case l = r does occur: the stretch is then a single element and the answer is a_l itself.",
  },
  {
    id: "B66",
    statementUz: "1 dan n gacha bo‘lgan sonlarning o‘rin almashtirishi (permutatsiyasi) — bu har bir son aynan bir marta uchraydigan p_1, p_2, …, p_n ketma-ketligi. Sizga n butun soni berilgan; shunday o‘rin almashtirishlar orasidan hech bir son o‘z o‘rnida turmaydiganlarini, ya'ni har bir i uchun p_i ≠ i shartini qanoatlantiruvchilarini sanang va ularning sonini chiqaring. n = 1 bo‘lganda yagona o‘rin almashtirish p = (1) bo‘lib, unda 1 o‘z o‘rnida turadi, shuning uchun javob 0 ga teng.",
    statementEn: "A permutation of the numbers 1 through n is a sequence p_1, p_2, …, p_n in which every one of those numbers occurs exactly once. You are given an integer n; among such permutations count those in which no number stands in its own position, that is those satisfying p_i ≠ i for every i, and print how many there are. For n = 1 the only permutation is p = (1), in which 1 does stand in its own position, so the answer is 0.",
  },
  {
    id: "B136",
    statementUz: "Vektor o‘zi saqlaydigan elementlar uchun joy ajratadi va shu joyning hajmi sig‘im deb ataladi. Sig‘im 1 dan boshlanadi; vektor to‘lgan bo‘lsa va yana bitta element qo‘shilsa, sig‘im ikki barobar oshiriladi (1, 2, 4, 8 va shu tartibda), boshqa holatlarda esa o‘zgarmaydi. Bo‘sh vektorga birma-bir n ta element qo‘shiladi. Shu jarayonda sig‘im necha marta ikki barobar oshganini sanang va bu sonni chiqaring. n = 1 bo‘lganda boshlang‘ich sig‘im yetarli va javob 0.",
    statementEn: "A vector reserves room for the elements it holds, and the size of that room is called its capacity. The capacity starts at 1; whenever the vector is full and one more element is added, the capacity doubles (1, 2, 4, 8, and so on), and otherwise it stays as it is. Elements are added one by one to an empty vector, n of them in total. Count how many times the capacity doubles during that process and print the number. For n = 1 the initial capacity is enough and the answer is 0.",
  },
  {
    id: "C235",
    statementUz: "Sizga uchlari butun koordinatali oddiy ko'pburchak berilgan; oddiy degani uning qirralari o'z-o'zini kesmaydi. Uchlar ko'pburchak bo'ylab tartib bilan beriladi — soat yo'nalishida yoki unga teskari. Tugun nuqta deb ikki koordinatasi ham butun bo'lgan nuqtaga aytiladi. Ko'pburchakning qat'iy ichida yotgan tugun nuqtalar sonini toping va uni chiqaring; chegarada — uch yoki qirra ustida — yotgan nuqtalar hisobga olinmaydi.",
    statementEn: "You are given a simple polygon with integer vertices; simple means its edges do not cross one another. The vertices are given in order around the polygon, either clockwise or counter-clockwise. A lattice point is a point whose two coordinates are both integers. Find the number of lattice points lying strictly inside the polygon and print it; points on the boundary — at a vertex or along an edge — are not counted.",
  },
  {
    id: "B173",
    statementUz: "Ikkilik satr — har bir belgisi 0 yoki 1 bo‘lgan satr. Sizga n butun soni berilgan; uzunligi aynan n bo‘lgan barcha ikkilik satrlarni sanang va ularning sonini chiqaring. Ikki satr kamida bitta pozitsiyada farq qilsa, ular turli satrlar hisoblanadi va alohida sanaladi; masalan, n = 2 uchun 00, 01, 10 va 11 — to‘rt xil satr. n 30 gacha bo‘ladi, ya'ni javob juda tez o‘sadi, lekin butun turga sig‘adi.",
    statementEn: "A binary string is a string in which every character is either 0 or 1. You are given an integer n; count all binary strings of length exactly n and print how many there are. Two strings that differ in at least one position are different strings and are counted separately; for n = 2, for instance, the strings 00, 01, 10 and 11 are four distinct ones. Since n goes up to 30, the answer grows quickly but still fits in an integer type.",
  },
  {
    id: "B180",
    statementUz: "Sizga n ta uchdan iborat daraxt berilgan va u 1-uchida ildizlangan. Uchning chuqurligi deb ildizdan unga tushadigan yagona yo‘ldagi qirralar soni tushuniladi; ildizning o‘z chuqurligi 0 ga teng, uning bevosita qo‘shnilarining chuqurligi 1 va shu tartibda davom etadi. Har bir uch uchun uning chuqurligini hisoblang va bu n ta qiymatni 1, 2, …, n uchlari tartibida bitta qatorda chiqaring. Qirralar ixtiyoriy tartibda beriladi va har doim daraxt hosil qiladi.",
    statementEn: "You are given a tree with n nodes, rooted at node 1. The depth of a node is the number of edges on the single path from the root down to it; the root itself has depth 0, its immediate neighbours have depth 1, and so on. Compute the depth of every node and print those n values on one line in the order of nodes 1, 2, …, n. The edges are given in arbitrary order and always form a tree.",
  },
  {
    id: "C298",
    statementUz: "Sizga lotin harflari va bo'sh joylardan iborat satr berilgan. So'z deb bo'sh joylar bilan ajratilgan uzluksiz harflar ketma-ketligi tushuniladi. Har bir so'zning birinchi harfini katta harfga, qolgan harflarini esa kichik harfga aylantiring va natijani bitta qatorda chiqaring. Bo'sh joylar aynan o'z o'rnida qoladi: satr boshida yoki oxirida bo'sh joy bo'lsa, u saqlanadi, ketma-ket kelgan bir nechta bo'sh joy ham xuddi shunday saqlanadi. Chiqish satrining uzunligi kirish satrining uzunligi bilan bir xil.",
    statementEn: "You are given a string of Latin letters and spaces. A word is an unbroken run of letters separated by spaces. Turn the first letter of each word into upper case and every other letter of it into lower case, and print the result on one line. The spaces stay in exactly their original places: a leading or trailing space is kept, and so is every run of consecutive spaces. The output line has the same length as the input line.",
  },
  {
    id: "A17",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Har bir harf satrda necha marta uchraganini qarab, eng ko‘p uchraydigan harfni toping va uni bitta belgi sifatida chiqaring. Bir nechta harf bir xil, eng katta uchrash soniga ega bo‘lsa, ular orasidan alifboda eng oldingisi tanlanadi, shuning uchun javob har doim yagona. Satrda kamida bitta harf bor, ya'ni javob har doim mavjud.",
    statementEn: "You are given a string s of lowercase Latin letters. Look at how many times each letter occurs in the string, find the letter that occurs most often, and print it as a single character. If several letters share the same, largest number of occurrences, the alphabetically earliest of them is chosen, so the answer is always unique. The string holds at least one letter, so an answer always exists.",
  },
  {
    id: "C292",
    statementUz: "p asosdagi sanoq sistemasida son raqamlar ketma-ketligi bilan yoziladi va har bir raqam 0 dan p−1 gacha qiymat oladi; 9 dan katta qiymatlar 'A' dan 'Z' gacha bo'lgan katta harflar bilan belgilanadi — A = 10, B = 11 va shu tartibda Z = 35 gacha. Sizga p asosda yozilgan son va yangi q asosi berilgan. Shu sonning qiymatini o'zgartirmasdan, uni q asosdagi yozuvida chiqaring; 9 dan katta raqamlar yana katta harflar bilan yoziladi. Son nolga teng bo'lsa, bitta 0 chiqariladi.",
    statementEn: "In base p a number is written as a sequence of digits, each taking a value from 0 to p−1; values above 9 are denoted by the upper-case letters 'A' to 'Z' — A = 10, B = 11, and so on up to Z = 35. You are given a number written in base p and a new base q. Without changing its value, print that number written in base q; digits above 9 are again written as upper-case letters. If the value is zero, a single 0 is printed.",
  },
  {
    id: "C300",
    statementUz: "Sizga lotin harflaridan iborat n ta so'z va bitta c harfi berilgan. So'zlar orasidan c harfi bilan boshlanadiganlarini sanang va ularning sonini chiqaring. Solishtirishda katta va kichik harf farqlanmaydi: c harfi 'a' bo'lsa, 'A' bilan boshlanuvchi so'z ham, 'a' bilan boshlanuvchi so'z ham sanaladi, va c ning o'zi katta yoki kichik harf bo'lishi mumkin. Birorta so'z shartni qanoatlantirmasa, javob 0 bo'ladi.",
    statementEn: "You are given n words of Latin letters and a single letter c. Count how many of the words begin with c and print that number. Case is not distinguished in the comparison: if c is 'a', then a word beginning with 'A' counts and so does one beginning with 'a', and c itself may be given in either case. If no word satisfies the condition, the answer is 0.",
  },
  {
    id: "B37",
    statementUz: "Sizga musbat n butun soni berilgan va quyidagi jarayon qaraladi: n juft bo‘lsa, u n/2 bilan almashtiriladi; n toq bo‘lsa, u 3n+1 bilan almashtiriladi. Bu qadam n qiymati 1 ga aylanmaguncha takrorlanadi. Shu yo‘lda nechta almashtirish bajarilganini sanang va bu sonni chiqaring. n = 1 bo‘lganda hech qanday qadam kerak emas va javob 0. Oraliq qiymatlar boshlang‘ich n dan katta bo‘lishi mumkin, shuning uchun ular 64-bitli turda saqlanadi.",
    statementEn: "You are given a positive integer n and the following process is considered: if n is even it is replaced by n/2, and if n is odd it is replaced by 3n+1. That step is repeated until the value becomes 1. Count how many replacements were performed along the way and print the number. For n = 1 no step is needed and the answer is 0. Intermediate values can be larger than the starting n, so they are held in a 64-bit type.",
  },
];
