/* Statement rewrite, batch 08 — fifteen more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-08-statements.mjs
 */
export default [
  {
    id: "C208",
    statementUz: "Ikki sonning bitlar bo'yicha XOR qiymati shunday hisoblanadi: sonlar ikkilik yozuvda yozib qo'yiladi va har bir bit o'rnida natija biti faqat bitta sonda 1 turgan bo'lsa 1 ga, aks holda 0 ga teng bo'ladi. Sizga n ta manfiy bo'lmagan butun sondan iborat massiv berilgan. Turli o'rinlarda turgan ikki elementni tanlab, ularning XOR qiymatini eng katta qilishga harakat qilamiz; shu erishiladigan eng katta qiymatni chiqaring. Indekslar har xil bo'lishi shart, qiymatlar esa teng bo'lishi mumkin — teng qiymatlarning XOR i 0 bo'ladi.",
    statementEn: "The bitwise XOR of two numbers is computed like this: both are written in binary, and at each bit position the result has a 1 exactly when just one of the numbers has a 1 there, and a 0 otherwise. You are given an array of n non-negative integers. Choosing two elements at different positions, we try to make their XOR as large as possible; print the largest value achievable. The positions must differ, while the values may be equal — the XOR of equal values is 0.",
  },
  {
    id: "B43",
    statementUz: "Tub son — 1 dan katta bo‘lgan va musbat bo‘luvchilari faqat 1 va o‘zi bo‘lgan butun son; shu ta'rifga ko‘ra 1 tub emas, 2 esa eng kichik tub son. Sizga n butun soni berilgan. p ≤ n shartini qanoatlantiruvchi tub sonlarni sanang va ularning sonini chiqaring; n ning o‘zi ham oraliqqa kiradi. n = 1 bo‘lganda oraliqda birorta tub son yo‘q va javob 0 ga teng.",
    statementEn: "A prime is an integer greater than 1 whose only positive divisors are 1 and itself; under that definition 1 is not prime and 2 is the smallest prime. You are given an integer n. Count the primes p with p ≤ n and print how many there are; the value n itself belongs to the range. When n = 1 the range holds no prime at all and the answer is 0.",
  },
  {
    id: "B65",
    statementUz: "Sizga n ta butun sondan iborat a massivi va k soni berilgan. Massivning eng katta k ta elementini olib, ularning yig‘indisini chiqaring. Elementlar qiymati bo‘yicha emas, o‘rni bo‘yicha tanlanadi: har bir element ko‘pi bilan bir marta ishlatiladi, va bir xil qiymat bir necha o‘rinda uchrasa, ularning har biri alohida element hisoblanadi. Qiymatlar manfiy bo‘lishi mumkin, ya'ni yig‘indi ham manfiy chiqishi mumkin. Yig‘indi 10^14 ga yetadi va 32-bitli turga sig‘maydi.",
    statementEn: "You are given an array a of n integers and a number k. Take the k largest elements of the array and print their sum. The elements are chosen by position rather than by value: each element is used at most once, and when the same value occurs at several positions, each of them is a separate element. The values may be negative, so the sum may come out negative too. The sum reaches 10^14 and does not fit in a 32-bit type.",
  },
  {
    id: "B161",
    statementUz: "Massivning k-chi eng kichik elementi deb uni o‘sish tartibida saralaganda k-o‘rinda turadigan qiymatga aytiladi. Takrorlangan qiymatlar alohida o‘rin egallaydi: 1 1 2 massivida ikkinchi eng kichik element ham 1 ga teng. Sizga n ta butun sondan iborat a massivi va har biri bitta k sonini nomlaydigan q ta so‘rov berilgan. Har bir so‘rov uchun massivning k-chi eng kichik elementini toping va javoblarni so‘rovlar tartibida, har birini alohida qatorda chiqaring. Massiv so‘rovlar davomida o‘zgarmaydi.",
    statementEn: "The k-th smallest element of an array is the value standing at position k once the array is sorted in increasing order. Repeated values occupy separate positions: in the array 1 1 2 the second smallest element is 1 as well. You are given an array a of n integers and q queries, each naming one number k. For every query find the k-th smallest element of the array, and print the answers in query order, each on its own line. The array never changes between queries.",
  },
  {
    id: "B190",
    statementUz: "Sizga n ta uchdan iborat, 1-uchida ildizlangan daraxt berilgan va har bir uch bitta butun qiymat saqlaydi. Uchning qism daraxti deb o‘sha uchning o‘zi va ildizdan qaraganda uning ostida yotgan barcha uchlar tushuniladi. Har bir uch uchun uning qism daraxtidagi qiymatlarning yig‘indisini hisoblang va bu n ta sonni 1, 2, …, n tartibida bitta qatorda chiqaring. Ildizning javobi har doim butun daraxtdagi qiymatlar yig‘indisiga teng, bargning javobi esa o‘z qiymatining o‘zi. Yig‘indi 10^14 ga yetadi.",
    statementEn: "You are given a tree with n nodes, rooted at node 1, where every node holds one integer value. The subtree of a node is that node together with every node lying below it as seen from the root. For every node compute the sum of the values in its subtree, and print those n numbers on one line in the order 1, 2, …, n. The root's answer is always the total of the whole tree, and a leaf's answer is its own value. A sum reaches 10^14.",
  },
  {
    id: "B192",
    statementUz: "Shaxmatdagi ot bir o‘q bo‘ylab ikki katak, unga perpendikulyar o‘q bo‘ylab bir katak yuradi — ya'ni har bir yurishda satri ikkiga va ustuni birga, yoki satri birga va ustuni ikkiga o‘zgaradi, taxta chegarasidan chiqmagan holda. Sizga 8 × 8 taxtaning ikkita katagi berilgan: boshlang‘ich va manzil. Otni birinchi katakdan ikkinchisiga olib boradigan eng kam yurishlar sonini toping va uni chiqaring. Ikki katak ustma-ust tushgan bo‘lsa, javob 0. Har bir katakka boshqa istalgan katakdan yetib borish mumkin.",
    statementEn: "A chess knight moves two squares along one axis and one square along the perpendicular axis — that is, each move changes its row by two and its column by one, or its row by one and its column by two, without leaving the board. You are given two squares of an 8 × 8 board: a start and a destination. Find the fewest knight moves that take the knight from the first square to the second, and print that number. If the two squares coincide the answer is 0. Every square is reachable from every other.",
  },
  {
    id: "C248",
    statementUz: "Boshida n ta element bor va ularning barchasi nolga teng. So'ngra q ta amal ketma-ket qo'llanadi; har bir amal \"l r v\" ko'rinishida bo'lib, indekslari l dan r gacha bo'lgan har bir elementga v qiymatini qo'shishni bildiradi (chegaralar ikkalasi ham kiradi). v manfiy bo'lishi mumkin, ya'ni amal ayirish ham bo'la oladi, va oraliqlar bir-birining ustiga tushishi mumkin. Barcha amallar bajarilgandan keyingi n ta qiymatni bitta qatorda chiqaring. Qiymat moduli 2·10^14 ga yetadi.",
    statementEn: "You start with n elements, all of them zero. Then q updates are applied one after another; each update has the form \"l r v\" and means that the value v is added to every element whose index runs from l to r, both ends included. The value v may be negative, so an update can also subtract, and the ranges may overlap. Print the n values after all the updates have been applied, on one line. A value reaches 2·10^14 in magnitude.",
  },
  {
    id: "B31",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta so‘rov berilgan. Har bir so‘rov ikkita l va r indeksdan iborat va massivning shu oraliqdagi elementlari yig‘indisini — a_l + a_{l+1} + … + a_r qiymatini — so‘raydi; oraliqning ikkala cheti ham yig‘indiga kiradi. Har bir so‘rov uchun shu yig‘indini hisoblang va javoblarni so‘rovlar tartibida, har birini alohida qatorda chiqaring. l = r bo‘lgan holat ham uchraydi va unda javob a_l ning o‘zi. Yig‘indi 10^14 ga yetadi va 32-bitli turga sig‘maydi.",
    statementEn: "You are given an array a of n integers followed by q queries. Each query consists of two indices l and r and asks for the sum of the elements in that range — the value a_l + a_{l+1} + … + a_r — with both ends included. For every query compute that sum, and print the answers in query order, each on its own line. The case l = r does occur, and the answer is then a_l itself. A sum reaches 10^14 and does not fit in a 32-bit type.",
  },
  {
    id: "C239",
    statementUz: "Sizga n ta tugunli, 1-tugundan ildiz oladigan daraxt berilgan va har bir tugun bitta rang raqamini saqlaydi. Tugunning pastki daraxti deb o'sha tugun va ildizdan qaraganda uning ostidagi barcha tugunlar tushuniladi. Har bir v tugun uchun uning pastki daraxtida nechta turli rang uchrashini sanang — v ning o'z rangi ham hisobga olinadi, bir xil rang necha marta uchrasa ham bir marta sanaladi — va bu n ta sonni tugunlar tartibida bitta qatorda chiqaring. Barg tuguni uchun javob har doim 1 ga teng.",
    statementEn: "You are given a tree with n vertices rooted at vertex 1, each vertex holding one colour number. The subtree of a vertex is that vertex together with every vertex below it as seen from the root. For every vertex v count how many distinct colours appear in its subtree — v's own colour included, and a colour occurring several times counted once — and print those n numbers on one line in vertex order. For a leaf the answer is always 1.",
  },
  {
    id: "C210",
    statementUz: "Yo'naltirilmagan grafning qirrasi ko'prik deyiladi, agar uni olib tashlaganda grafning bog'lamli komponentlari soni ortsa — ya'ni shu qirra orqali bog'langan tugunlar orasida boshqa yo'l qolmasa. Sizga n ta tugun va m ta qirradan iborat graf berilgan; unda nechta ko'prik borligini aniqlang va shu sonni chiqaring. Graf bog'langan bo'lishi shart emas, va bir juft tugun orasida bir nechta qirra bo'lishi mumkin — bunday takroriy qirralarning hech biri ko'prik bo'lmaydi. O'z-o'ziga bog'lovchi qirra berilmaydi.",
    statementEn: "An edge of an undirected graph is a bridge when removing it increases the number of connected components — that is, when the vertices it joins have no other route between them. You are given a graph with n vertices and m edges; determine how many bridges it has and print that number. The graph need not be connected, and a pair of vertices may be joined by more than one edge — none of such repeated edges is a bridge. No edge joins a vertex to itself.",
  },
  {
    id: "B191",
    statementUz: "Sizga r ta satr va c ta ustundan iborat bosh harflar jadvali va bitta so‘z berilgan. So‘zni jadvalda kuzatish deb quyidagiga aytiladi: biror katakdan boshlanadi, so‘zning birinchi harfi shu katakda turadi, va har bir keyingi harf uchun umumiy tomonga ega — yuqori, past, chap yoki o‘ng — qo‘shni katakka o‘tiladi; diagonal yurish mumkin emas. Bitta katakni bir kuzatuvda ikki marta ishlatib bo‘lmaydi. Shunday kuzatuv mavjudligini aniqlang va YES yoki NO chiqaring.",
    statementEn: "You are given a grid of upper-case letters with r rows and c columns, and one word. Tracing the word in the grid means this: it begins at some cell holding the word's first letter, and for every later letter one moves to a cell sharing a side — up, down, left or right; diagonal moves are not allowed. No cell may be used twice within one trace. Determine whether such a trace exists and print YES or NO.",
  },
  {
    id: "A129",
    statementUz: "Sizga r ta satr va c ta ustundan iborat matritsa berilgan; u satrlar bo‘yicha, yuqoridan pastga qarab beriladi. Har bir satr uchun undagi c ta elementning yig‘indisini hisoblang va bu r ta sonni satrlar tartibida — birinchi satrdan oxirgisigacha — bitta qatorda chiqaring. Demak, javobda har bir satrga aynan bittadan son to‘g‘ri keladi. Elementlar manfiy bo‘lishi mumkin, va bitta satrning yig‘indisi 2^31 dan oshib ketishi mumkin.",
    statementEn: "You are given a matrix with r rows and c columns, given row by row from top to bottom. For every row compute the sum of its c elements, and print those r numbers on one line in row order — from the first row to the last. The answer therefore holds exactly one number per row. The elements may be negative, and the sum of a single row can exceed 2^31.",
  },
  {
    id: "C265",
    statementUz: "Sizga har bir elementi 0 yoki 1 bo'lgan n ta sondan iborat massiv va k soni berilgan. Massivdagi nollardan ko'pi bilan k tasini tanlab, ularni 1 ga aylantirish mumkin (kamroq aylantirish ham mumkin). Shundan keyin massivda hosil bo'ladigan ketma-ket birliklar bo'laklari orasida eng uzunining uzunligini toping va uni chiqaring. k = 0 bo'lganda hech narsa o'zgartirilmaydi va javob dastlabki eng uzun birliklar bo'lagi bo'ladi; k massivdagi nollar sonidan kam bo'lmasa, javob n ga teng.",
    statementEn: "You are given an array of n numbers, each 0 or 1, and a number k. At most k of the zeros in the array may be chosen and turned into ones (turning fewer is allowed as well). Find the length of the longest run of consecutive ones that can then exist in the array, and print it. When k = 0 nothing is changed and the answer is the longest run already present; when k is at least the number of zeros, the answer is n.",
  },
  {
    id: "B143",
    statementUz: "Postfiks yozuvda amal o‘z operandlaridan keyin yoziladi: \"3 4 +\" ifodasi 3 + 4 ni bildiradi. Ifoda chapdan o‘ngga o‘qiladi; son uchraganda u hisoblangan qiymatlar ustiga qo‘yiladi, amal uchraganda esa eng oxirgi hosil qilingan ikki qiymat olinadi — oldinroq qo‘yilgani chap operand, keyingisi o‘ng operand bo‘ladi — va natija ularning o‘rniga qo‘yiladi. Sizga probel bilan ajratilgan butun sonlar va +, − hamda * amallaridan iborat, har doim to‘g‘ri tuzilgan ifoda berilgan; uning qiymatini hisoblang va chiqaring.",
    statementEn: "In postfix notation an operator is written after its operands: the expression \"3 4 +\" means 3 + 4. The expression is read left to right; a number is placed on top of the computed values, and an operator takes the two most recently produced values — the one placed earlier as its left operand and the later one as its right — and puts the result in their place. You are given an always well-formed expression of integers and the operators +, − and *, separated by spaces; compute its value and print it.",
  },
];
