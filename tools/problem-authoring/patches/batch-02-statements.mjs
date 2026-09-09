/* Statement rewrite, batch 02 — fourteen more of the thinnest statements.
 *
 * Same rules as batch 01 (read its header): the task in full, every definition
 * the question uses named on the spot, the edge cases stated, and not one word
 * about method.
 *
 * Applied with: node restate.mjs patches/batch-02-statements.mjs
 */
export default [
  {
    id: "C290",
    statementUz: "n × n o'lchamli matritsa birlik matritsa deyiladi, agar uning asosiy diagonalidagi — ya'ni satr va ustun raqamlari teng bo'lgan o'rinlardagi — barcha elementlari 1 ga teng bo'lsa, qolgan barcha elementlari esa 0 ga teng bo'lsa. Sizga n × n matritsa berilgan; u birlik matritsa ekanini aniqlang va agar shunday bo'lsa YES, aks holda NO chiqaring. n = 1 bo'lgan holat ham qaraladi: yagona elementi 1 bo'lgan matritsa birlik matritsa hisoblanadi.",
    statementEn: "An n × n matrix is the identity matrix when every entry on its main diagonal — the positions whose row and column numbers are equal — is 1, and every other entry is 0. You are given an n × n matrix; determine whether it is the identity matrix, and print YES if it is and NO if it is not. The case n = 1 is included: a matrix whose single entry is 1 is the identity matrix.",
  },
  {
    id: "A06",
    statementUz: "Sizga ikkita a va b butun soni berilgan. Ularning a + b yig‘indisini hisoblang va uni chiqaring. Har ikki son manfiy bo‘lishi mumkin, shuning uchun yig‘indi ham manfiy chiqishi mumkin; javob har doim bitta butun son bo‘ladi. Qiymatlar 10^9 gacha bo‘lgani uchun yig‘indi 2·10^9 ga yetishi mumkin, ya'ni u 32-bitli butun turning chegarasidan chiqib ketadi.",
    statementEn: "You are given two integers a and b. Compute their sum a + b and print it. Either number may be negative, so the sum may come out negative as well; the answer is always a single integer. Since the values reach 10^9, the sum can reach 2·10^9, which is outside the range of a 32-bit signed integer type.",
  },
  {
    id: "A126",
    statementUz: "Sizga n ta butun sondan iborat a massivi va x chegarasi berilgan. Massivning har bir elementini x bilan solishtiring va ularning nechtasi x dan qat'iy katta ekanini sanang. Solishtirish qat'iy: aynan x ga teng element javobga qo‘shilmaydi, faqat x dan katta bo‘lganlar sanaladi. Bitta sonni chiqaring — shu elementlar soni; ularning hech biri bo‘lmasa, javob 0 bo‘ladi.",
    statementEn: "You are given an array a of n integers and a threshold x. Compare every element of the array with x and count how many of them are strictly greater than x. The comparison is strict: an element exactly equal to x is not added to the answer, only those above x are counted. Print one integer — that number of elements; if there are none, the answer is 0.",
  },
  {
    id: "A120",
    statementUz: "Sizga ikkita a va b butun soni berilgan. Ularni teskari tartibda, ya'ni avval b, so‘ng a bo‘lgan holda bitta qatorda chiqaring. Qiymatlarning o‘zi o‘zgarmaydi — faqat chiqarish tartibi almashadi, natijada esa aynan shu ikki son qoladi. Har ikki son manfiy yoki nolga teng bo‘lishi mumkin, va ular teng bo‘lgan holda ikki xil tartib bir xil natija beradi.",
    statementEn: "You are given two integers a and b. Print them in the opposite order on one line: first b, then a. The values themselves do not change — only the order in which they are printed — and the result holds exactly those two numbers. Either may be negative or zero, and when the two are equal both orders produce the same output.",
  },
  {
    id: "B160",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; sonlar ixtiyoriy tartibda keladi. Turli o‘rinlarda turgan har qanday ikki element uchun |a_i − a_j| modul ayirmasini qarash mumkin; shunday ayirmalarning eng kichigini toping va uni chiqaring. Elementlar bir-biriga qo‘shni bo‘lishi shart emas — massivning istalgan ikki o‘rni qaraladi. Bir xil qiymat ikki marta uchrasa, ularning ayirmasi 0 bo‘ladi va javob ham 0 bo‘ladi.",
    statementEn: "You are given an array a of n integers, arriving in arbitrary order. For any two elements at different positions one can look at the absolute difference |a_i − a_j|; find the smallest such difference and print it. The two elements need not be next to each other — any two positions of the array are considered. If some value occurs twice, their difference is 0 and so is the answer.",
  },
  {
    id: "C287",
    statementUz: "Sizga manfiy bo'lmagan n butun soni berilgan. Uning o'nlik yozuvidagi raqamlarini teskari tartibda o'qing va shu raqamlardan hosil bo'lgan sonni chiqaring: masalan, 12345 uchun raqamlar 5, 4, 3, 2, 1 tartibida o'qiladi. Natija son sifatida yoziladi, ya'ni oldida turgan nollar tushib qoladi — 100 ning teskarisi 001 emas, balki 1 bo'ladi. Kirish 10^18 gacha bo'lgani uchun u 32-bitli turga sig'maydi.",
    statementEn: "You are given a non-negative integer n. Read the digits of its decimal notation in reverse order and print the number they form: for 12345, for instance, the digits are read as 5, 4, 3, 2, 1. The result is written as a number, so any leading zeros disappear — the reverse of 100 is 1, not 001. Since the input goes up to 10^18, it does not fit in a 32-bit type.",
  },
  {
    id: "C226",
    statementUz: "x ≡ r (mod m) yozuvi \"x ni m ga bo'lganda qoldiq r bo'ladi\" degan ma'noni bildiradi. Sizga to'rtta son — r1, m1, r2, m2 — berilgan. Bir vaqtning o'zida x ≡ r1 (mod m1) va x ≡ r2 (mod m2) shartlarini qanoatlantiruvchi eng kichik manfiy bo'lmagan butun x sonini toping va uni chiqaring. Ikkala shartni bir vaqtda qanoatlantiruvchi son mavjud bo'lmasligi ham mumkin; bunday holda -1 chiqaring. Modullar o'zaro tub bo'lishi shart emas, javob esa m1·m2 gacha yetishi mumkin va 32-bitli turga sig'maydi.",
    statementEn: "The notation x ≡ r (mod m) means \"dividing x by m leaves remainder r\". You are given four numbers: r1, m1, r2 and m2. Find the smallest non-negative integer x that satisfies x ≡ r1 (mod m1) and x ≡ r2 (mod m2) at the same time, and print it. There may be no number satisfying both at once, in which case print -1 instead. The moduli need not be coprime, and the answer can be as large as m1·m2, which does not fit in a 32-bit type.",
  },
  {
    id: "C281",
    statementUz: "Rim yozuvida yetti belgi ishlatiladi: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Belgilar chapdan o'ngga o'qiladi va qiymatlari qo'shiladi, lekin kichik qiymatli belgi kattasidan oldin turgan bo'lsa, u qo'shilmaydi, balki ayiriladi — masalan, IV = 4 va CM = 900. Sizga rim raqamlarida yozilgan son berilgan; uning o'nlik qiymatini hisoblang va bitta butun son sifatida chiqaring. Kirish har doim to'g'ri yozilgan va 1 dan 3999 gacha bo'lgan sonni bildiradi.",
    statementEn: "Roman notation uses seven symbols: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. The symbols are read left to right and their values are added, except that a symbol of smaller value standing before a larger one is subtracted rather than added — IV is 4 and CM is 900. You are given a number written in Roman numerals; compute its decimal value and print it as a single integer. The input is always well formed and denotes a value between 1 and 3999.",
  },
  {
    id: "C289",
    statementUz: "Sizga uchta son — n, a va b — berilgan. 1 dan n gacha bo'lgan (n ning o'zi ham kiradi) butun sonlar orasidan a ga qoldiqsiz bo'linadigan yoki b ga qoldiqsiz bo'linadigan barchasini qaraymiz; ikkalasiga ham bo'linadigan son bu to'plamda bir marta hisoblanadi. Shu sonlarning yig'indisini hisoblang va uni chiqaring. a va b teng bo'lishi mumkin — bunday holda shart bitta bo'linuvchanlikka aylanadi. Yig'indi 32-bitli turga sig'maydi.",
    statementEn: "You are given three numbers: n, a and b. Consider the integers from 1 to n inclusive that are divisible by a or divisible by b; a number divisible by both belongs to that collection once. Compute the sum of those numbers and print it. Note that a and b may be equal, in which case the condition collapses to a single divisibility. The sum does not fit in a 32-bit type.",
  },
  {
    id: "A123",
    statementUz: "Sizga uchta a, b va c butun soni berilgan. Ularning eng kichigini aniqlang va uni chiqaring. Sonlarning istalgani manfiy bo‘lishi mumkin, va kirishdagi tartib hech narsani bildirmaydi — eng kichik qiymat birinchi, ikkinchi yoki uchinchi o‘rinda turishi mumkin. Qiymatlarning ikkitasi yoki uchtasi teng bo‘lgan holat ham mumkin; bunday holda o‘sha umumiy qiymat javob bo‘ladi.",
    statementEn: "You are given three integers a, b and c. Determine the smallest of them and print it. Any of the numbers may be negative, and the order in the input means nothing — the smallest value may sit first, second or third. Two or even all three of the values may be equal, in which case that shared value is the answer.",
  },
  {
    id: "C256",
    statementUz: "Sizga sonlar o'qidagi n ta yopiq oraliq berilgan; [l, r] oralig'i l dan r gacha bo'lgan barcha nuqtalarni, chegaralarning o'zini ham qo'shib, o'z ichiga oladi. Nuqtalar to'plami barcha oraliqlarni teshadi deyiladi, agar har bir oraliqda tanlangan nuqtalardan kamida bittasi yotsa. Shunday xossaga ega bo'lgan to'plamlar orasidan eng kichigini qarab, undagi nuqtalar sonini chiqaring. Oraliqlar takrorlanishi, biri ikkinchisining ichida yotishi yoki umuman kesishmasligi mumkin.",
    statementEn: "You are given n closed intervals on the number line; the interval [l, r] contains every point from l to r, its own ends included. A set of points stabs all the intervals when every interval contains at least one of the chosen points. Among the sets with that property consider the smallest, and print how many points it holds. The intervals may repeat, may be nested inside one another, and may not overlap at all.",
  },
  {
    id: "A135",
    statementUz: "Sizga musbat n butun soni berilgan. Uni 1 ga aylanmaguncha ketma-ket 2 ga bo‘ling; har bir bo‘lishda natija pastga yaxlitlanadi, ya'ni 5 dan 2 hosil bo‘ladi, 3 emas. Shu jarayonda nechta bo‘lish bajarilganini sanang va bu sonni chiqaring. n = 1 bo‘lganda hech qanday bo‘lish kerak emas va javob 0 ga teng. Kirish 10^18 gacha bo‘lgani uchun boshlang‘ich qiymat 64-bitli turda saqlanadi.",
    statementEn: "You are given a positive integer n. Divide it by 2 repeatedly until it becomes 1; every division rounds down, so 5 becomes 2 rather than 3. Count how many divisions were performed along the way and print that number. When n = 1 no division is needed at all and the answer is 0. Since the input goes up to 10^18, the starting value is held in a 64-bit type.",
  },
  {
    id: "C295",
    statementUz: "Sizga ikkita butun sonlar ro'yxati berilgan: birinchisida n ta, ikkinchisida m ta son. Har bir ro'yxatni to'plam sifatida qaraymiz, ya'ni bir ro'yxat ichida takrorlangan qiymat bir marta hisoblanadi. Ikki to'plamning birlashmasi — kamida bittasida uchraydigan qiymatlar, kesishmasi esa ikkalasida ham uchraydigan qiymatlar. Shu ikki to'plamning o'lchamlarini toping va ularni bitta qatorda, avval birlashma o'lchamini, so'ng kesishma o'lchamini chiqaring. Kesishma bo'sh bo'lishi mumkin; bunday holda ikkinchi son 0 bo'ladi.",
    statementEn: "You are given two lists of integers: n numbers in the first and m in the second. Each list is treated as a set, so a value repeated within one list counts once. The union of the two sets holds the values occurring in at least one of them, and the intersection holds the values occurring in both. Find the sizes of those two sets and print them on one line, the size of the union first and the size of the intersection second. The intersection may be empty, in which case the second number is 0.",
  },
  {
    id: "C240",
    statementUz: "Sizga n ta tugundan iborat daraxt — hech qanday sikl saqlamaydigan, bog'lamli va aynan n−1 ta qirrasi bo'lgan graf — hamda k soni berilgan. Ikki tugun orasidagi masofa deb ularni birlashtiruvchi yagona yo'ldagi qirralar sonini ataymiz. Shunday (u, v) tugunlar juftliklari sonini toping-ki, u < v va ular orasidagi masofa k dan oshmasin, va bu sonni chiqaring. k = 0 bo'lgan holat ham qaraladi: unda hech qanday juftlik shartni qanoatlantirmaydi. Juftliklar soni 2·10^10 ga yetishi mumkin, ya'ni javob 32-bitli turga sig'maydi.",
    statementEn: "You are given a tree with n vertices — a connected graph with no cycle and exactly n−1 edges — and a number k. The distance between two vertices is the number of edges on the single path joining them. Count the pairs of vertices (u, v) with u < v whose distance is at most k, and print that count. The case k = 0 is included: no pair satisfies the condition then. The count can reach 2·10^10, so the answer does not fit in a 32-bit type.",
  },
];
