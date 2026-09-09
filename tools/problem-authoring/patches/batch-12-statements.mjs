/* Statement rewrite, batch 12 — fifteen more. Rules in batch 01's header.
 *
 * Applied with: node restate.mjs patches/batch-12-statements.mjs
 */
export default [
  {
    id: "C153",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta amal berilgan; pozitsiyalar 1 dan boshlab raqamlanadi. \"1 i x\" amali i-pozitsiyadagi elementga x qiymatini qo‘shadi (x manfiy bo‘lishi mumkin, ya'ni amal ayirish ham bo‘la oladi). \"2 l r\" amali esa l dan r gacha bo‘lgan pozitsiyalardagi elementlar yig‘indisini so‘raydi, ikkala chet ham qo‘shiladi. Amallar ketma-ket bajariladi, ya'ni har bir so‘rov massivning shu paytdagi holatiga tegishli. Har bir so‘rov javobini alohida qatorda chiqaring.",
    statementEn: "You are given an array a of n integers followed by q operations; positions are numbered from 1. The operation \"1 i x\" adds the value x to the element at position i (x may be negative, so the operation can also subtract). The operation \"2 l r\" asks for the sum of the elements from position l to position r, both ends included. The operations are applied in order, so every query refers to the state of the array at that moment. Print the answer to each query on its own line.",
  },
  {
    id: "C200",
    statementUz: "Sonning raqamlar yig‘indisi deb uning o‘nlik yozuvidagi raqamlarining yig‘indisiga aytiladi: masalan, 20 ning raqamlar yig‘indisi 2 + 0 = 2. Sizga n va k sonlari berilgan. 1 dan n gacha bo‘lgan (n ning o‘zi ham kiradi) butun sonlar orasidan raqamlar yig‘indisi aynan k ga teng bo‘lganlarini sanang va ularning sonini chiqaring. Shart qat'iy tenglik: yig‘indisi k dan katta yoki kichik bo‘lgan sonlar hisobga olinmaydi. Bunday son umuman bo‘lmasa, javob 0 bo‘ladi.",
    statementEn: "The digit sum of a number is the sum of the digits of its decimal notation: the digit sum of 20, for instance, is 2 + 0 = 2. You are given n and k. Among the integers from 1 to n inclusive, count those whose digit sum equals exactly k, and print how many there are. The condition is strict equality: numbers whose digit sum is larger or smaller than k do not count. If there is no such number at all, the answer is 0.",
  },
  {
    id: "C245",
    statementUz: "Ko'plik — bir xil qiymat bir necha marta yotishi mumkin bo'lgan to'plam; har bir nusxa alohida element hisoblanadi. Boshida ko'plik bo'sh. So'ngra q ta amal ketma-ket beriladi:\n\n• \"1 x\" — ko'plikka x sonini qo'shadi;\n• \"2 x\" — ko'plikdan x sonining bitta nusxasini o'chiradi; bunday nusxa albatta mavjud bo'ladi;\n• \"3 k\" — ko'plikdagi k-chi eng kichik sonni so'raydi, ya'ni barcha nusxalarni o'sish tartibida qo'yganda k-o'rinda turadigan qiymatni.\n\nHar bir uchinchi tur amali uchun javobni alohida qatorda chiqaring; ko'plikda k tadan kam element bo'lsa, -1 chiqariladi.",
    statementEn: "A multiset is a collection in which the same value may lie several times; each copy is a separate element. The multiset starts empty. Then q operations are given one after another:\n\n• \"1 x\" — adds the number x to the multiset;\n• \"2 x\" — removes one copy of x from the multiset; such a copy is guaranteed to be present;\n• \"3 k\" — asks for the k-th smallest number in the multiset, that is the value standing at position k when all the copies are laid out in increasing order.\n\nFor every operation of the third kind print the answer on its own line; if the multiset holds fewer than k elements, -1 is printed.",
  },
  {
    id: "C255",
    statementUz: "Sizga n ta tugunli, 1-tugundan ildiz oladigan daraxt berilgan; u har bir tugunning ota-onasi bilan beriladi. Tugunning k-chi ajdodi deb undan ildiz tomonga aynan k qadam yurganda yetib boriladigan tugunga aytiladi: 1-ajdod — bevosita ota-ona, 2-ajdod — otaning otasi va shu tartibda. Sizga q ta so'rov keladi, har biri (v, k) juftligidan iborat; har bir so'rov uchun v ning k-chi ajdodini toping va uni alohida qatorda chiqaring. k = 0 bo'lganda javob v ning o'zi; v dan yuqorida k tadan kam tugun bo'lsa, bunday ajdod yo'q va -1 chiqariladi.",
    statementEn: "You are given a tree with n vertices rooted at vertex 1, described by the parent of each vertex. The k-th ancestor of a vertex is the vertex reached by walking exactly k steps from it towards the root: the 1st ancestor is its immediate parent, the 2nd is the parent of that, and so on. You are given q queries, each a pair (v, k); for every query find the k-th ancestor of v and print it on its own line. When k = 0 the answer is v itself; if fewer than k vertices lie above v, no such ancestor exists and -1 is printed.",
  },
  {
    id: "B137",
    statementUz: "Yo‘naltirilmagan grafda uchning darajasi deb unga tegib turgan qirralar soniga aytiladi. Sizga n ta uch va m ta qirradan iborat graf berilgan; darajasi eng katta bo‘lgan uchni toping va uning indeksini chiqaring. Bir nechta uch bir xil, eng katta darajaga ega bo‘lsa, ular orasidan indeksi eng kichigi tanlanadi. Qirralari umuman bo‘lmagan grafda barcha uchlarning darajasi 0 ga teng va javob 1 bo‘ladi.",
    statementEn: "In an undirected graph, the degree of a vertex is the number of edges incident to it. You are given a graph with n vertices and m edges; find the vertex of largest degree and print its index. If several vertices share the same, largest degree, the one with the smallest index is chosen. In a graph with no edges at all every vertex has degree 0 and the answer is 1.",
  },
  {
    id: "C197",
    statementUz: "Massivdagi inversiya deb i < j va a_i > a_j shartlarini bir vaqtda qanoatlantiruvchi (i, j) pozitsiyalar juftligiga aytiladi — ya'ni oldinroq turgan element keyingisidan katta bo‘lgan holat. Sizga n ta butun sondan iborat a massivi berilgan; undagi inversiyalar sonini toping va uni chiqaring. Massiv allaqachon kamaymaydigan tartibda bo‘lsa, birorta inversiya yo‘q va javob 0. Javob n(n−1)/2 gacha, ya'ni taxminan 5·10^9 gacha yetadi va 32-bitli turga sig‘maydi.",
    statementEn: "An inversion in an array is a pair of positions (i, j) satisfying i < j and a_i > a_j at once — a case where an earlier element is larger than a later one. You are given an array a of n integers; find the number of inversions in it and print that number. If the array is already in non-decreasing order there is no inversion and the answer is 0. The answer reaches n(n−1)/2, about 5·10^9, and does not fit in a 32-bit type.",
  },
  {
    id: "A05",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Uning eng katta va eng kichik elementini toping va ularning ayirmasini, ya'ni max(a) − min(a) qiymatini chiqaring. Natija hech qachon manfiy bo‘lmaydi, chunki maksimum minimumdan kichik bo‘la olmaydi, va u aynan barcha elementlar teng bo‘lgandagina 0 ga teng. Qiymatlar manfiy bo‘lishi mumkin, shuning uchun ayirma 2·10^9 ga yetishi mumkin.",
    statementEn: "You are given an array a of n integers. Find its largest and its smallest element and print their difference, the value max(a) − min(a). The result is never negative, since the maximum cannot be smaller than the minimum, and it is 0 exactly when every element is the same. The values may be negative, so the difference can reach 2·10^9.",
  },
  {
    id: "B38",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan va uning har bir elementi 0 dan 100 gacha bo‘lgan tor oraliqda yotadi. Elementlarni kamaymaydigan tartibda, ya'ni eng kichigidan eng kattasiga qarab bitta qatorda chiqaring. Takrorlangan qiymatlar tashlab yuborilmaydi: har bir qiymat massivda necha marta uchrasa, chiqishda ham shuncha marta yoziladi, ya'ni natijada aynan n ta son bo‘ladi.",
    statementEn: "You are given an array a of n integers, each lying in the narrow range from 0 to 100. Print the elements in non-decreasing order, that is from the smallest to the largest, on one line. Repeated values are not dropped: each value appears in the output as many times as it occurs in the array, so the result holds exactly n numbers.",
  },
  {
    id: "B104",
    statementUz: "Massivning qism to‘plami deb uning elementlaridan ba'zilarini (balki birortasini ham emas, balki hammasini) tanlash yo‘li bilan hosil qilinadigan to‘plamga aytiladi; qism to‘plamlar tanlangan pozitsiyalar bilan aniqlanadi va jami 2^n ta bo‘ladi. Sizga n ta musbat butun sondan iborat a massivi va k chegarasi berilgan. Elementlarining yig‘indisi k dan oshmaydigan qism to‘plamlarni sanang va ularning sonini chiqaring. Bo‘sh qism to‘plamning yig‘indisi 0 ga teng, shuning uchun k manfiy bo‘lmagan har qanday holatda u ham sanaladi.",
    statementEn: "A subset of an array is what you get by choosing some of its elements (possibly none, possibly all); subsets are identified by the chosen positions, and there are 2^n of them in total. You are given an array a of n positive integers and a bound k. Count the subsets whose elements sum to at most k, and print how many there are. The empty subset has sum 0, so it is counted whenever k is non-negative.",
  },
  {
    id: "C222",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilgan qirradan iborat graf berilgan; har bir u → v qirrasi \"tartibda u v dan oldin turishi kerak\" degan shartni bildiradi. Barcha tugunlarni shu shartlarning barchasi bajariladigan qilib bitta qatorga tizish kerak. Bunday tartiblar bir nechta bo'lishi mumkin; ular orasidan leksikografik eng kichigini — ya'ni birinchi farq qilgan o'rinda kichikroq raqam turadiganini — chiqaring. Shartlar bir-biriga zid bo'lsa, ya'ni grafda halqa bo'lsa, birorta tartib mavjud emas va -1 chiqariladi.",
    statementEn: "You are given a graph with n vertices and m directed edges; each edge u → v means \"u must stand before v in the order\". All the vertices must be laid out in one line so that every such condition holds. There may be several such orders; print the lexicographically smallest of them — the one carrying the smaller number at the first position where they differ. If the conditions contradict each other, that is if the graph has a cycle, no order exists and -1 is printed.",
  },
  {
    id: "A13",
    statementUz: "Massivning boshlang‘ich qismi (prefiksi) deb uning birinchi elementidan boshlangan ketma-ket bo‘lagiga aytiladi: birinchi prefiks bitta elementdan, ikkinchisi ikkitasidan iborat va shu tartibda davom etadi. Sizga n ta butun sondan iborat a massivi berilgan; har bir prefiks uchun uning maksimumini hisoblang, ya'ni i-chi chiqariladigan qiymat max(a_1, …, a_i) ga teng bo‘lsin, va bu n ta qiymatni bitta qatorda chiqaring. Chiqarilgan ketma-ketlik kamaymaydi, chunki prefiks uzayganda maksimum kichraya olmaydi.",
    statementEn: "A prefix of an array is a consecutive piece starting at its first element: the first prefix holds one element, the second two, and so on. You are given an array a of n integers; for every prefix compute its maximum, so that the i-th printed value equals max(a_1, …, a_i), and print those n values on one line. The printed sequence is non-decreasing, because a maximum cannot shrink as the prefix grows.",
  },
  {
    id: "C115",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta so‘rov berilgan. Har bir so‘rov ikkita l va r indeksdan iborat va massivning l-dan r-gacha bo‘lgan bo‘lagini ko‘rsatadi, chegaralar ham qo‘shiladi. Har bir so‘rov uchun shu bo‘lakda nechta har xil qiymat uchrashini sanang va javobni alohida qatorda chiqaring. Oraliq ichida bir necha marta takrorlangan qiymat javobga bitta hissa qo‘shadi. Massiv so‘rovlar davomida o‘zgarmaydi, va l = r bo‘lgan holda javob har doim 1.",
    statementEn: "You are given an array a of n integers followed by q queries. Each query consists of two indices l and r and names the stretch of the array from l to r, ends included. For each query count how many distinct values occur in that stretch and print the answer on its own line. A value repeated several times inside the range contributes one to the answer. The array never changes between queries, and when l = r the answer is always 1.",
  },
  {
    id: "C264",
    statementUz: "Sizga har bir elementi 0 yoki 1 bo'lgan, uzunligi n bo'lgan massiv berilgan. Bitta amalda massivning ixtiyoriy ikki elementining o'rnini almashtirish mumkin — ular yonma-yon turishi shart emas. Barcha birliklar bitta uzluksiz bo'lakda turishi uchun kerak bo'ladigan eng kam amallar sonini toping va uni chiqaring. Massivda birliklar umuman bo'lmasa yoki ular allaqachon yonma-yon tursa, hech qanday amal kerak emas va javob 0 bo'ladi.",
    statementEn: "You are given an array of length n in which every element is 0 or 1. One operation swaps any two elements of the array — they need not be adjacent. Find the smallest number of operations needed to make all the ones occupy a single contiguous block, and print it. If the array holds no ones at all, or they already sit together, no operation is needed and the answer is 0.",
  },
  {
    id: "B71",
    statementUz: "Yo‘naltirilmagan grafdagi sikl deb boshlangan uchiga qaytadigan va birorta qirrani ikki marta ishlatmaydigan yopiq yurishga aytiladi. Sizga n ta uch va m ta qirradan iborat graf berilgan; unda kamida bitta sikl bor-yo‘qligini aniqlang va agar bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring. Graf bog‘lamli bo‘lishi shart emas — sikl uning istalgan komponentida bo‘lishi mumkin. Bir juft uch orasidagi ikkita takroriy qirra ham sikl hosil qiladi.",
    statementEn: "A cycle in an undirected graph is a closed walk that returns to the vertex it started from without using any edge twice. You are given a graph with n vertices and m edges; determine whether it contains at least one cycle, and print YES if it does and NO if it does not, in capital letters. The graph need not be connected — a cycle may live in any of its components. Two repeated edges between the same pair of vertices also form a cycle.",
  },
  {
    id: "B77",
    statementUz: "Graf ikki bo‘lakli deyiladi, agar uning uchlarini ikki rangga shunday bo‘yash mumkin bo‘lsa-ki, har bir qirraning ikki cheti har xil rangda bo‘lsin — ya'ni bir xil rangdagi ikki uch hech qachon qirra bilan tutashmasa. Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan; uni shu tarzda bo‘yash mumkinligini aniqlang va YES yoki NO deb bosh harflarda chiqaring. Graf bog‘lamli bo‘lishi shart emas: javob YES bo‘lishi uchun uning har bir komponenti shartni qanoatlantirishi kerak.",
    statementEn: "A graph is bipartite when its vertices can be coloured with two colours so that the two endpoints of every edge have different colours — that is, no two vertices of the same colour are joined by an edge. You are given a graph with n vertices and m undirected edges; determine whether it can be coloured in this way and print YES or NO in capital letters. The graph need not be connected: for the answer to be YES, every one of its components must satisfy the condition.",
  },
];
