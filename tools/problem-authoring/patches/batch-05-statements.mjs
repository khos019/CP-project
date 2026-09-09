/* Statement rewrite, batch 05 — fourteen more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-05-statements.mjs
 */
export default [
  {
    id: "B145",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilgan qirradan iborat graf berilgan; a → b qirrasi a dan b ga qarab ketadi va b → a qirrasi bilan bir xil emas. Uchning kiruvchi darajasi deb unga qarab ketuvchi qirralar soni tushuniladi. Kiruvchi darajasi nolga teng bo‘lgan, ya'ni birorta qirra ko‘rsatmaydigan barcha uchlarni toping va ularni indekslari o‘sish tartibida bitta qatorda chiqaring. Bunday uch bo‘lmasa — masalan, uchlar sikl hosil qilgan bo‘lsa — buning o‘rniga −1 chiqaring.",
    statementEn: "You are given a graph with n vertices and m directed edges; the edge a → b runs from a to b and is not the same as the edge b → a. The in-degree of a vertex is the number of edges running into it. Find every vertex whose in-degree is zero — those that no edge points into — and print them on one line in increasing order of index. If there is no such vertex — when the vertices form a cycle, for instance — print −1 instead.",
  },
  {
    id: "C224",
    statementUz: "Sizga n ta tugun va m ta yo‘naltirilmagan qirradan iborat graf berilgan; har bir qirra musbat vazn tashiydi. Yo‘lning uzunligi deb undagi qirralar vaznlarining yig‘indisi tushuniladi, eng qisqa yo‘l esa 1-tugundan n-tugungacha bo‘lgan yo‘llar orasida uzunligi eng kichik bo‘lgani. Aynan shu eng kichik uzunlikka ega bo‘lgan turli yo‘llar sonini toping va uni 10^9 + 7 modulida chiqaring; yo‘llar soni juda katta bo‘lishi mumkin, shuning uchun qoldiq so‘raladi. n-tugunga yetib bo‘lmasa javob 0, n = 1 bo‘lganda esa 1 bo‘ladi.",
    statementEn: "You are given a graph with n vertices and m undirected edges, each carrying a positive weight. The length of a path is the sum of the weights of its edges, and a shortest path is one of minimum length among the paths from vertex 1 to vertex n. Count the distinct paths of exactly that minimum length and print the count modulo 10^9 + 7; the number of paths can be enormous, which is why a remainder is asked for. If vertex n cannot be reached the answer is 0, and when n = 1 it is 1.",
  },
  {
    id: "B188",
    statementUz: "Tugun nuqta deb ikki koordinatasi ham butun son bo‘lgan nuqtaga aytiladi. Sizga tekislikda butun koordinatali ikkita nuqta berilgan va ular tutashtirilgan kesma qaraladi. Shu kesmada aynan ikki chekka nuqta orasida yotgan tugun nuqtalarni sanang va ularning sonini chiqaring; chekka nuqtalarning o‘zi hech qachon hisobga olinmaydi. Ikki chekka nuqta ustma-ust tushgan bo‘lishi mumkin — bunday holda kesma bitta nuqtaga aylanadi va javob 0 bo‘ladi. Koordinatalar farqi 2·10^9 ga yetadi.",
    statementEn: "A lattice point is a point whose two coordinates are both integers. You are given two lattice points in the plane and the segment joining them is considered. Count the lattice points lying strictly between the two endpoints on that segment, and print how many there are; the endpoints themselves are never counted. The two endpoints may coincide, in which case the segment collapses to a point and the answer is 0. A difference of coordinates reaches 2·10^9.",
  },
  {
    id: "C286",
    statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Massivda yonma-yon turgan har bir juftlik uchun — ya'ni har bir i uchun a_i va a_{i+1} elementlari uchun — |a_i − a_{i+1}| absolyut farqini qarash mumkin. Shu farqlarning eng kattasini toping va uni chiqaring; faqat qo'shni juftliklar qaraladi, uzoqda turgan elementlar juftlik hosil qilmaydi. n = 1 bo'lganda birorta qo'shni juftlik yo'q va javob 0 ga teng. Farq 2·10^9 ga yetadi va 32-bitli ishorali turga sig'maydi.",
    statementEn: "You are given an array of n integers. For every neighbouring pair in the array — that is, for the elements a_i and a_{i+1} at each i — one can look at the absolute difference |a_i − a_{i+1}|. Find the largest of those differences and print it; only neighbouring pairs are considered, elements further apart do not form a pair. When n = 1 there is no neighbouring pair at all and the answer is 0. A difference reaches 2·10^9 and does not fit in a 32-bit signed type.",
  },
  {
    id: "C288",
    statementUz: "Son Armstrong soni deyiladi, agar uning raqamlarini o'z xonalari soniga teng darajaga ko'tarib qo'shganda aynan o'sha son hosil bo'lsa. Ya'ni n ning o'nlik yozuvida k ta raqam bo'lsa, har bir raqam k-darajaga ko'tariladi va ular qo'shiladi; natija n ga teng bo'lsa, n Armstrong soni. Masalan, 153 uchta xonali, va 1³ + 5³ + 3³ = 153. Sizga musbat n soni berilgan; u Armstrong soni ekanini aniqlang va YES yoki NO chiqaring. Bir xonali har qanday son Armstrong soni hisoblanadi.",
    statementEn: "A number is an Armstrong number when raising each of its digits to the power equal to its own number of digits and adding the results gives that same number back. That is, if the decimal notation of n holds k digits, every digit is raised to the power k and the results are added; if the total equals n, then n is an Armstrong number. For example 153 has three digits, and 1³ + 5³ + 3³ = 153. You are given a positive number n; determine whether it is an Armstrong number and print YES or NO. Every single-digit number is an Armstrong number.",
  },
  {
    id: "A18",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; qiymatlar takrorlanishi va manfiy bo‘lishi mumkin. Massivda nechta har xil qiymat uchrashini sanang va bu sonni chiqaring. Qiymat necha marta takrorlanishidan qat'i nazar, u javobga aynan bitta hissa qo‘shadi: masalan, 1 3 3 2 3 1 massivida oltita element bor, lekin har xil qiymatlar faqat uchta — 1, 2 va 3. Javob 1 dan n gacha bo‘lgan oraliqda yotadi.",
    statementEn: "You are given an array a of n integers; the values may repeat and may be negative. Count how many distinct values occur in it and print that number. However many times a value repeats, it contributes exactly one to the answer: the array 1 3 3 2 3 1, for instance, holds six elements but only three distinct values — 1, 2 and 3. The answer lies between 1 and n inclusive.",
  },
  {
    id: "B30",
    statementUz: "Musbat son mukammal deyiladi, agar uning o‘zidan boshqa barcha musbat bo‘luvchilari yig‘indisi aynan o‘sha songa teng bo‘lsa. Masalan, 6 ning 6 dan boshqa bo‘luvchilari 1, 2 va 3, ularning yig‘indisi esa 1 + 2 + 3 = 6, shuning uchun 6 mukammal son. Sizga musbat n butun soni berilgan; u mukammal ekanini aniqlang va agar mukammal bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring. n = 1 uchun o‘zidan boshqa bo‘luvchi yo‘q va yig‘indi 0 bo‘ladi, ya'ni 1 mukammal emas.",
    statementEn: "A positive number is perfect when the sum of all its positive divisors other than itself equals that same number. The divisors of 6 apart from 6 are 1, 2 and 3, for instance, and their sum is 1 + 2 + 3 = 6, so 6 is perfect. You are given a positive integer n; determine whether it is perfect, and print YES if it is and NO if it is not, in capital letters. For n = 1 there is no divisor other than itself and the sum is 0, so 1 is not perfect.",
  },
  {
    id: "C116",
    statementUz: "Fibonachchi ketma-ketligi F(1) = F(2) = 1 va i ≥ 3 uchun F(i) = F(i−1) + F(i−2) tengliklari bilan aniqlanadi, ya'ni har bir keyingi had oldingi ikkitasining yig‘indisiga teng. Indekslash 1 dan boshlanadi. Sizga n butun soni berilgan; F(n) ning 10^9 + 7 modul bo‘yicha qoldig‘ini hisoblang va chiqaring. Bu masalada n 10^18 gacha bo‘ladi — indeks 64-bitli turda saqlanadi va hadlar sonining o‘zi vaqt chegarasidan ancha katta.",
    statementEn: "The Fibonacci sequence is defined by F(1) = F(2) = 1 and F(i) = F(i−1) + F(i−2) for i ≥ 3, so every later term is the sum of the two before it. The indexing starts at 1. You are given an integer n; compute and print the value of F(n) modulo 10^9 + 7. In this problem n goes up to 10^18 — the index is held in a 64-bit type, and the number of terms alone is far beyond the time limit.",
  },
  {
    id: "B138",
    statementUz: "Navbat — oldi va orqasi bo‘lgan qiymatlar ketma-ketligi. Sizga oldindan orqaga qarab berilgan n ta qiymatdan iborat navbat va k soni berilgan. Quyidagi harakatni aynan k marta bajaring: oldindagi qiymatni olib, navbatning oxiriga qo‘ying. Barcha harakatlar bajarilgandan keyingi navbatni oldindan orqaga qarab, bitta qatorda chiqaring. Qiymatlarning soni o‘zgarmaydi — faqat tartib siljiydi; k = 0 bo‘lganda navbat o‘zgarmaydi, k esa n dan ancha katta bo‘lishi mumkin.",
    statementEn: "A queue is a sequence of values with a front and a back. You are given a queue of n values, listed from front to back, and a number k. Perform the following move exactly k times: take the value at the front and put it at the back of the queue. Print the queue after all the moves, from front to back, on one line. The number of values does not change — only their order shifts; when k = 0 the queue is unchanged, and k may be far larger than n.",
  },
  {
    id: "C154",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan; har bir qirra musbat w vaznini tashiydi. Yo‘lning uzunligi deb undagi qirralar vaznlarining yig‘indisi tushuniladi, ikki uch orasidagi masofa esa ularni tutashtiruvchi yo‘llarning eng kichik uzunligi. Har bir uch uchun 1-uchdan unga bo‘lgan masofani hisoblang va bu n ta qiymatni 1, 2, …, n tartibida bitta qatorda chiqaring. 1-uchdan 1-uchgacha masofa 0. Graf bog‘lamli bo‘lishi shart emas: yetib bo‘lmaydigan uch uchun −1 chiqariladi. Masofa 10^14 gacha yetadi.",
    statementEn: "You are given a graph with n vertices and m undirected edges, each carrying a positive weight w. The length of a path is the sum of the weights of its edges, and the distance between two vertices is the smallest length of a path joining them. For every vertex compute the distance from vertex 1 to it, and print those n values on one line in the order 1, 2, …, n. The distance from vertex 1 to itself is 0. The graph need not be connected: for a vertex that cannot be reached, −1 is printed. A distance reaches 10^14.",
  },
  {
    id: "A12",
    statementUz: "Sizga musbat n butun soni berilgan. n ikkining darajasi ekanini aniqlang, ya'ni qandaydir k ≥ 0 butun son uchun n = 2^k tengligi bajariladimi. Ikkining darajalari 1, 2, 4, 8, 16 va shu tartibda davom etadi; e'tibor bering, 1 = 2^0 ham ikkining darajasi hisoblanadi. Agar n shunday bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring. n 10^18 gacha bo‘lgani uchun u 32-bitli ishorali turga sig‘maydi.",
    statementEn: "You are given a positive integer n. Determine whether n is a power of two, that is whether n = 2^k holds for some integer k ≥ 0. The powers of two run 1, 2, 4, 8, 16 and so on; note that 1 = 2^0 counts as one. Print YES if n is such a number and NO if it is not, in capital letters. Since n goes up to 10^18, it does not fit in a 32-bit signed type.",
  },
  {
    id: "A22",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; qiymatlar takrorlanishi va manfiy bo‘lishi mumkin. Har bir har xil qiymat massivda necha marta uchraganini qarab, eng ko‘p uchraydiganini toping va uni chiqaring. Bir nechta qiymat bir xil, eng katta uchrash soniga ega bo‘lsa, ular orasidan eng kichigi tanlanadi, shuning uchun javob har doim yagona. n = 1 bo‘lganda yagona element bir marta uchraydi va javob shu elementning o‘zi.",
    statementEn: "You are given an array a of n integers; the values may repeat and may be negative. Look at how many times each distinct value occurs in the array, find the one that occurs most often, and print it. If several values share the same, largest number of occurrences, the smallest of them is chosen, so the answer is always unique. When n = 1 the single element occurs once and the answer is that element itself.",
  },
  {
    id: "C216",
    statementUz: "Sizga n ta tugunli daraxt berilgan — bog'lamli, siklsiz va aynan n−1 ta qirrali graf. Ikki tugun orasidagi masofa deb ularni tutashtiruvchi yagona yo'ldagi qirralar soni tushuniladi. Har bir v tugun uchun undan qolgan barcha n−1 ta tugungacha bo'lgan masofalar yig'indisini hisoblang, va bu n ta yig'indini tugunlar tartibida — 1-tugundan n-tugungacha — bitta qatorda chiqaring. n = 1 bo'lganda boshqa tugun yo'q va yagona javob 0. Yig'indi 2·10^10 gacha yetadi va 32-bitli turga sig'maydi.",
    statementEn: "You are given a tree with n vertices — a connected, acyclic graph with exactly n−1 edges. The distance between two vertices is the number of edges on the unique path joining them. For every vertex v compute the sum of the distances from v to all the other n−1 vertices, and print those n sums on one line in vertex order, from vertex 1 to vertex n. When n = 1 there is no other vertex and the only answer is 0. A sum reaches 2·10^10 and does not fit in a 32-bit type.",
  },
  {
    id: "B32",
    statementUz: "Sizga kamaymaydigan tartibda — ya'ni a_i ≤ a_{i+1} shartini qanoatlantirgan holda — berilgan n ta butun sondan iborat a massivi berilgan. Takrorlanishlarni olib tashlab, har bir har xil qiymatdan aynan bittasini qoldiring va qolgan qiymatlarni bitta qatorda chiqaring. Tartib buzilmaydi: massiv saralangani uchun bir xil qiymatlar yonma-yon turadi va natija ham kamaymaydigan tartibda bo'ladi. Qiymat necha marta uchraganidan qat'i nazar, chiqishda u bir marta paydo bo'ladi.",
    statementEn: "You are given an array a of n integers in non-decreasing order — that is, a_i ≤ a_{i+1}. Remove the duplicates, keeping exactly one copy of each distinct value, and print the remaining values on one line. The order is preserved: because the array is sorted, equal values stand next to each other and the result is in non-decreasing order too. However many times a value occurred, it appears once in the output.",
  },
];
