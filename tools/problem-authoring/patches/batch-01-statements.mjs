/* Statement rewrite, batch 01 — the twenty thinnest statements in the bank.
 *
 * Every problem used to open with a legend: an italic paragraph of topic
 * framing above the task. It has been removed everywhere, which leaves the
 * statement to do the whole job, and the statements that were leaning on it
 * hardest are the shortest ones — several were a single sentence.
 *
 * What a rewritten statement says, in this order:
 *
 *   1. what the input objects are, and every definition the question uses
 *      (a totient, a border, a proper divisor — named, not assumed);
 *   2. the quantity to compute, stated once and unambiguously;
 *   3. the guarantees and the edge that the reader would otherwise find out
 *      from a failed submission — n = 1, an empty answer, a value that leaves
 *      32 bits.
 *
 * What it never says is how. "Reduce the product as you go", "the borders form
 * a chain", "trial division up to the square root is enough" — those are
 * solutions, and the legend used to hand them over before the reader had read
 * the question. A sample note may point at one afterwards; the statement does
 * not.
 *
 * Applied with: node restate.mjs patches/batch-01-statements.mjs
 */
export default [
  {
    id: "C227",
    statementUz: "Eyler funksiyasi φ(m) — bu 1 ≤ k ≤ m shartini qanoatlantiruvchi va m bilan o'zaro tub bo'lgan, ya'ni gcd(k, m) = 1 tengligi bajariladigan k sonlarining soni; kelishuvga ko'ra φ(1) = 1. Sizga bitta n butun soni berilgan. Birinchi n ta natural son uchun bu funksiyaning qiymatlarini qo'shing va S = φ(1) + φ(2) + … + φ(n) yig'indisini chiqaring. Yig'indi 3n²/π² tartibida o'sadi va n eng katta bo'lganda taxminan 3·10^11 ga yetadi, ya'ni javob 32-bitli turga sig'maydi.",
    statementEn: "Euler's totient φ(m) is the number of integers k with 1 ≤ k ≤ m that are coprime with m, that is for which gcd(k, m) = 1; by convention φ(1) = 1. You are given one integer n. Add the value of that function over the first n positive integers and print the single sum S = φ(1) + φ(2) + … + φ(n). The sum grows like 3n²/π² and reaches about 3·10^11 at the largest n, so the answer does not fit in a 32-bit type.",
  },
  {
    id: "C228",
    statementUz: "Musbat butun son tub deyiladi, agar uning aynan ikkita musbat bo'luvchisi bo'lsa — 1 va sonning o'zi. Shu ta'rifga ko'ra 1 tub emas (uning bitta bo'luvchisi bor), 2 esa tub. Sizga q ta mustaqil so'rov berilgan, har birida bitta n soni keladi. Har bir so'rov uchun n tub ekanini aniqlang va so'rovlar berilgan tartibda, har biri alohida qatorda bo'lgan javoblarni chiqaring. Sonlar 10^18 gacha bo'ladi, ya'ni ular 64-bitli turda saqlanadi.",
    statementEn: "A positive integer is prime when it has exactly two positive divisors: 1 and itself. Under that definition 1 is not prime (it has one divisor) and 2 is. You are given q independent queries, each holding a single number n. For each query decide whether n is prime, and print the answers in the order the queries arrive, one per line. The numbers go up to 10^18, so they are held in a 64-bit type.",
  },
  {
    id: "C291",
    statementUz: "Butun d soni a_1, a_2, …, a_n sonlarining umumiy bo'luvchisi deyiladi, agar u ularning har birini qoldiqsiz bo'lsa. Sizga n ta musbat butun sondan iborat massiv berilgan; shunday umumiy bo'luvchilarning eng kattasini, ya'ni gcd(a_1, a_2, …, a_n) qiymatini toping va uni chiqaring. Bunday son har doim mavjud, chunki 1 har qanday sonni bo'ladi. Massivda yagona element bo'lsa (n = 1), javob shu elementning o'zi. Qiymatlar 10^18 gacha bo'ladi va 32-bitli turga sig'maydi.",
    statementEn: "An integer d is a common divisor of a_1, a_2, …, a_n when it divides every one of them without a remainder. You are given an array of n positive integers; find the largest such common divisor — the value gcd(a_1, a_2, …, a_n) — and print it. One always exists, because 1 divides every number. If the array holds a single element (n = 1), the answer is that element itself. The values go up to 10^18 and do not fit in a 32-bit type.",
  },
  {
    id: "C302",
    statementUz: "Sizga n ta butun sondan iborat a_1, a_2, …, a_n massivi berilgan. Uni bir qadam chapga siljitib chiqaring: birinchi element ketma-ketlikning oxiriga o'tadi, qolgan elementlarning har biri esa bitta o'rin chapga suriladi. Ya'ni natija a_2, a_3, …, a_n, a_1 ko'rinishida bo'ladi va u aynan n ta sondan iborat — hech qanday element yo'qolmaydi va qo'shilmaydi. n = 1 bo'lganda massiv o'zgarmaydi, chunki yagona element bir vaqtning o'zida ham birinchi, ham oxirgi.",
    statementEn: "You are given an array a_1, a_2, …, a_n of n integers. Print it shifted one step to the left: the first element moves to the end of the sequence and every other element moves one place towards the front. That is, the result is a_2, a_3, …, a_n, a_1, and it holds exactly n numbers — nothing is lost and nothing is added. When n = 1 the array does not change, because the single element is both the first and the last.",
  },
  {
    id: "C296",
    statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Turli o'rinlarda turgan har qanday i ≠ j juftlik uchun |a_i − a_j| farqini qarash mumkin; shunday farqlarning eng kichigini toping va uni chiqaring. Indekslar har xil bo'lishi shart, lekin qiymatlar teng bo'lishi mumkin: massivda bir xil son ikki marta uchrasa, ularning farqi 0 bo'ladi va javob ham 0 bo'ladi. Farq 2·10^9 gacha yetishi mumkin, ya'ni u 32-bitli turga sig'maydi.",
    statementEn: "You are given an array of n integers. For any pair of different positions i ≠ j one can look at the difference |a_i − a_j|; find the smallest such difference and print it. The positions must differ, but the values need not: if the same number appears twice in the array their difference is 0 and so is the answer. A difference can reach 2·10^9, which does not fit in a 32-bit type.",
  },
  {
    id: "A128",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri va bitta c belgisi berilgan. s satrining har bir pozitsiyasini ko‘rib chiqing va ularning nechtasida aynan c belgisi turganini sanang. Har bir uchrash alohida hisoblanadi: c satrda ketma-ket yoki uzoq-uzoq bir necha marta kelsa, ularning barchasi javobga qo‘shiladi. Bitta sonni chiqaring — shu uchrashlar soni. c satrda umuman bo‘lmasa, javob 0 bo‘ladi.",
    statementEn: "You are given a string s of lowercase Latin letters and a single character c. Look at every position of s and count how many of them hold exactly the character c. Each occurrence counts on its own: if c appears several times, whether next to each other or far apart, all of them are added to the answer. Print one integer — that number of occurrences. If c does not appear in s at all, the answer is 0.",
  },
  {
    id: "C229",
    statementUz: "Ikki butun son o'zaro tub deyiladi, agar ularning eng katta umumiy bo'luvchisi 1 ga teng bo'lsa. Sizga n ta musbat butun sondan iborat massiv berilgan. Shunday (i, j) indekslar juftliklari sonini toping-ki, i < j va gcd(a_i, a_j) = 1 bo'lsin, va bu sonni chiqaring. Juftlik indekslar bilan aniqlanadi, qiymatlar bilan emas: massivda takrorlanuvchi sonlar bo'lsa, ular turgan har bir juftlik alohida sanaladi. Juftliklar soni 2·10^10 dan oshishi mumkin, ya'ni javob 32-bitli turga sig'maydi.",
    statementEn: "Two integers are coprime when their greatest common divisor is 1. You are given an array of n positive integers. Count the pairs of positions (i, j) with i < j for which gcd(a_i, a_j) = 1, and print that count. A pair is identified by its positions, not by its values: when the array repeats a number, every pair of positions holding it is counted separately. The count can exceed 2·10^10, so the answer does not fit in a 32-bit type.",
  },
  {
    id: "C246",
    statementUz: "Ko'phad koeffitsientlari ro'yxati bilan beriladi: birinchi son x^0 oldida, ikkinchisi x^1 oldida turadi va shu tartibda davom etadi. Sizga shu shaklda ikkita ko'phad berilgan — birinchisida n ta, ikkinchisida m ta koeffitsient. Ularning ko'paytmasini hisoblang: natijaning x^k oldidagi koeffitsienti i + j = k shartini qanoatlantiruvchi barcha juftliklar uchun birinchi ko'phadning i-koeffitsienti bilan ikkinchisining j-koeffitsienti ko'paytmalarining yig'indisiga teng. Har bir koeffitsientni 998244353 modulida chiqaring; natijada aynan n + m − 1 ta koeffitsient bo'ladi, ularning ba'zilari 0 bo'lishi mumkin.",
    statementEn: "A polynomial is given by the list of its coefficients: the first number stands in front of x^0, the second in front of x^1, and so on. You are given two polynomials in that form — n coefficients for the first and m for the second. Compute their product: the coefficient of x^k in the result is the sum, over every pair with i + j = k, of the i-th coefficient of the first polynomial times the j-th coefficient of the second. Print every coefficient modulo 998244353; the result has exactly n + m − 1 of them, some of which may be 0.",
  },
  {
    id: "C262",
    statementUz: "Satrning bo'lagi — uning ichida ketma-ket turgan harflar ketma-ketligi; masalan, \"abcd\" satrining bo'laklari orasida \"bc\" bor, lekin \"acd\" yo'q, chunki uning harflari uzluksiz emas. Sizga kichik lotin harflaridan iborat ikkita s va t satri berilgan. Ikkalasida ham bo'lak sifatida uchraydigan eng uzun satr uzunligini toping va uni chiqaring. Harflar ikkala satrda ham uzluksiz turishi shart. Umumiy harf ham bo'lmasa, javob 0 bo'ladi.",
    statementEn: "A substring is a run of consecutive letters inside a string: \"bc\" is a substring of \"abcd\", while \"acd\" is not, because its letters are not consecutive. You are given two strings s and t of lowercase Latin letters. Find the length of the longest string that occurs as a substring of both, and print it. The letters must be consecutive in both strings. If the two share no letter at all, the answer is 0.",
  },
  {
    id: "C250",
    statementUz: "Sizga n ta butun sondan iborat massiv va k soni berilgan. Massivning uzunligi aynan k bo'lgan ketma-ket bo'laklarini oyna deb ataymiz; birinchi oyna a_1, …, a_k elementlaridan, ikkinchisi a_2, …, a_{k+1} elementlaridan iborat va shu tartibda davom etadi, jami n − k + 1 ta oyna bo'ladi. Har bir oyna uchun undagi eng kichik qiymatni toping va bu qiymatlarni oynalar tartibida bitta qatorda chiqaring. k = n bo'lganda yagona oyna butun massivdir, k = 1 bo'lganda esa har bir oyna bitta elementdan iborat.",
    statementEn: "You are given an array of n integers and a number k. Call a window any stretch of exactly k consecutive elements: the first window is a_1, …, a_k, the second is a_2, …, a_{k+1}, and so on, giving n − k + 1 windows in all. For each window find the smallest value inside it, and print those values on one line in window order. When k = n the single window is the whole array; when k = 1 every window is one element.",
  },
  {
    id: "A134",
    statementUz: "Algoritmning tezligi kirish o‘lchamiga qarab qancha amal bajarishi bilan o‘lchanadi: O(n²) algoritmi n o‘lchamli kirishda taxminan n · n ta amal qiladi. Bu masalada bir sekundlik byudjet 10^8 amal deb qabul qilingan. Sizga kirish o‘lchami n berilgan. n · n ko‘paytmasini shu byudjet bilan solishtiring: agar u 10^8 dan oshmasa 1, oshsa 0 chiqaring. Chegara qiymatning o‘zi — aynan 10^8 — sig‘adigan hisoblanadi. n · n 10^18 gacha yetadi, ya'ni ko‘paytma 32-bitli turga sig‘maydi.",
    statementEn: "The speed of an algorithm is measured by how many operations it performs for a given input size: an O(n²) algorithm performs about n · n operations on an input of size n. In this problem the budget for one second is taken to be 10^8 operations. You are given the input size n. Compare the product n · n with that budget: print 1 if it is at most 10^8, and 0 if it exceeds it. The boundary value itself — exactly 10^8 — counts as fitting. Since n · n reaches 10^18, the product does not fit in a 32-bit type.",
  },
  {
    id: "A11",
    statementUz: "Satr palindrom deyiladi, agar u chapdan o‘ngga va o‘ngdan chapga bir xil o‘qilsa, ya'ni birinchi harfi oxirgisiga, ikkinchisi oxiridan ikkinchisiga teng bo‘lsa va shu tartibda davom etsa. Sizga kichik lotin harflaridan iborat s satri berilgan. U palindrom ekanini aniqlang va agar palindrom bo‘lsa YES, aks holda NO chiqaring. Javob katta harflarda yozilishi kerak. Bitta harfdan iborat satr ham palindrom hisoblanadi.",
    statementEn: "A string is a palindrome when it reads the same from left to right and from right to left: its first letter equals its last, its second equals its second from the end, and so on. You are given a string s of lowercase Latin letters. Determine whether it is a palindrome, and print YES if it is and NO if it is not. The answer must be printed in capitals. A string of a single letter counts as a palindrome.",
  },
  {
    id: "A122",
    statementUz: "Son k ga qoldiqsiz bo‘linadi deyiladi, agar uni k ga bo‘lganda qoldiq 0 bo‘lsa. Sizga ikkita musbat butun son n va k berilgan. 1, 2, …, n oralig‘idagi — n ning o‘zi ham kiradi — sonlardan nechtasi k ga qoldiqsiz bo‘linishini sanang va shu sonni chiqaring. k oraliqning yuqori chetidan katta bo‘lishi mumkin; bunday holda oraliqda k ga bo‘linadigan son yo‘q va javob 0 bo‘ladi.",
    statementEn: "A number is divisible by k when dividing it by k leaves remainder 0. You are given two positive integers n and k. Count how many of the numbers 1, 2, …, n — with n itself included — are divisible by k, and print that count. Note that k may be larger than the upper end of the range, in which case the range holds no multiple of k at all and the answer is 0.",
  },
  {
    id: "B163",
    statementUz: "Sizga kamaymaydigan tartibda berilgan n ta butun sondan iborat a massivi va x qiymati berilgan, ya'ni har bir i uchun a_i ≤ a_{i+1}. Massivda x ga teng bo‘lgan elementlar sonini aniqlang va shu sonni chiqaring. Massiv saralangani uchun x ga teng elementlar, agar mavjud bo‘lsa, uzluksiz blok hosil qiladi. x massivda umuman uchramasligi mumkin; bunday holda javob 0 bo‘ladi.",
    statementEn: "You are given an array a of n integers in non-decreasing order — that is, a_i ≤ a_{i+1} for every i — and a value x. Determine how many elements of the array are equal to x, and print that count. Because the array is sorted, the elements equal to x form one unbroken block if they are present at all. The value x may not occur in the array at all, in which case the answer is 0.",
  },
  {
    id: "C285",
    statementUz: "Kabisa yili — Grigoriy kalendarida 366 kundan iborat yil, va yil kabisa bo'lishining sharti quyidagicha: u 4 ga bo'linishi va 100 ga bo'linmasligi kerak, yoki 400 ga bo'linishi kerak. Shunga ko'ra 400 ga bo'linadigan yil har doim kabisa, 100 ga bo'linib 400 ga bo'linmaydigan yil esa kabisa emas. Sizga y yili berilgan. U kabisa ekanini aniqlang va kabisa bo'lsa YES, aks holda NO chiqaring.",
    statementEn: "A leap year is a year of 366 days in the Gregorian calendar, and the rule for one is this: it must be divisible by 4 and not by 100, or else divisible by 400. So a year divisible by 400 is always a leap year, while a year divisible by 100 but not by 400 is not. You are given a year y. Determine whether it is a leap year, and print YES if it is and NO if it is not.",
  },
  {
    id: "B25",
    statementUz: "Musbat d soni n ning bo‘luvchisi deyiladi, agar n ni d ga bo‘lganda qoldiq 0 bo‘lsa. Sizga musbat n butun soni berilgan. n ning musbat bo‘luvchilari sonini sanang va shu sonni chiqaring. Bo‘luvchilar orasiga 1 ham, n ning o‘zi ham kiradi, shuning uchun n = 1 bo‘lganda javob 1 ga teng. n 10^12 gacha bo‘lishi mumkin, ya'ni son 32-bitli turga sig‘maydi.",
    statementEn: "A positive integer d is a divisor of n when dividing n by d leaves remainder 0. You are given a positive integer n. Count its positive divisors and print that count. Both 1 and n itself are divisors, so for n = 1 the answer is 1. Note that n goes up to 10^12, which does not fit in a 32-bit type.",
  },
  {
    id: "C284",
    statementUz: "Sizga lotin harflari va raqamlardan iborat, bo'sh joysiz satr berilgan. Undagi har bir belgining registrini almashtiring: katta harf kichigiga, kichik harf esa kattasiga aylanadi. Harf bo'lmagan belgilar — bu masalada raqamlar — o'zgarishsiz, o'z o'rnida qoladi. Natijani bitta qatorda chiqaring; uning uzunligi kirish satrining uzunligi bilan bir xil bo'ladi, chunki hech qanday belgi qo'shilmaydi va o'chirilmaydi.",
    statementEn: "You are given a string of Latin letters and digits, without spaces. Swap the case of every character in it: an upper-case letter becomes lower case and a lower-case letter becomes upper case. Characters that are not letters — in this problem, the digits — stay exactly as they are, in their own place. Print the result on one line; it has the same length as the input, since no character is added or removed.",
  },
  {
    id: "C237",
    statementUz: "Satrning bo'lagi — uning ichida ketma-ket turgan harflar ketma-ketligi, va u satrda bir necha o'rindan boshlanib uchrashi mumkin. Sizga kichik lotin harflaridan iborat s satri berilgan. Unda kamida ikkita turli o'rindan boshlanib uchraydigan eng uzun bo'lakning uzunligini toping va uni chiqaring. Ikki uchrash bir-birining ustiga qisman tushishi mumkin — masalan, \"banana\" satrida \"ana\" 2- va 4-o'rinlardan boshlanadi va bitta 'a' harfini bo'lishadi. Hech bir bo'lak ikki marta uchramasa, javob 0 bo'ladi.",
    statementEn: "A substring is a run of consecutive letters inside a string, and it may occur starting at several positions. You are given a string s of lowercase Latin letters. Find the length of the longest substring that occurs starting at two or more different positions, and print it. The two occurrences are allowed to overlap — in \"banana\", for instance, \"ana\" starts at positions 2 and 4 and the two share one 'a'. If no substring occurs twice, the answer is 0.",
  },
  {
    id: "C251",
    statementUz: "Sizga n ta butun sondan iborat massiv va k soni berilgan. Massivning ketma-ket bo'lagi ichida uchraydigan turli qiymatlar soni — bu bo'lakdagi bir-biriga teng bo'lmagan sonlar soni; takrorlangan qiymat bir marta hisoblanadi. Shunday bo'laklar orasidan turli qiymatlar soni ko'pi bilan k ga teng bo'lgan eng uzunini toping va uning uzunligini chiqaring. Agar butun massivda turli qiymatlar soni k dan oshmasa, javob n ga teng bo'ladi.",
    statementEn: "You are given an array of n integers and a number k. The number of distinct values in a consecutive stretch of the array is how many pairwise different numbers it holds; a value that repeats counts once. Among all such stretches find the longest one whose number of distinct values is at most k, and print its length. If the whole array holds no more than k distinct values, the answer is n.",
  },
  {
    id: "B39",
    statementUz: "Fibonachchi ketma-ketligi shunday aniqlanadi: F(1) = F(2) = 1, va i ≥ 3 uchun F(i) = F(i−1) + F(i−2), ya'ni har bir keyingi son o‘zidan oldingi ikkitasining yig‘indisiga teng. Indekslash 1 dan boshlanadi, shuning uchun F(1) — ketma-ketlikning birinchi 1 soni. Sizga n butun soni berilgan; F(n) ning 10^9 + 7 modul bo‘yicha qoldig‘ini hisoblang va chiqaring. Fibonachchi sonlarining o‘zi juda tez o‘sadi, shuning uchun javob aynan shu modul bo‘yicha so‘raladi.",
    statementEn: "The Fibonacci sequence is defined by F(1) = F(2) = 1 and F(i) = F(i−1) + F(i−2) for i ≥ 3, so every later number is the sum of the two before it. The indexing starts at 1, so F(1) is the first 1 of the sequence. You are given an integer n; compute and print the value of F(n) modulo 10^9 + 7. The Fibonacci numbers themselves grow very quickly, which is why the answer is asked for modulo that number.",
  },
];
