/* Statement rewrite, batch 19 — fifteen more. Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-19-statements.mjs
 */
export default [
  {
    id: "C114",
    statementUz: "Sizga n ta uchdan iborat daraxt berilgan. Uchni olib tashlaganda daraxt bir nechta bog‘lamli bo‘lakka ajraladi. Sentroid deb shunday uchga aytiladi-ki, uni olib tashlaganda hosil bo‘lgan har bir bo‘lakda ko‘pi bilan n/2 ta uch qolsin. Har qanday daraxtda bitta yoki ikkita sentroid bo‘ladi; ikkita bo‘lsa, ular qo‘shni bo‘ladi va ulardan indeksi kichigini chiqarish kerak. Shu uchning indeksini chiqaring.",
    statementEn: "You are given a tree with n nodes. Removing a node splits the tree into several connected pieces. A centroid is a node whose removal leaves every resulting piece with at most n/2 nodes. Every tree has one or two centroids; when there are two they are adjacent, and the one with the smaller index is required. Print the index of that node.",
  },
  {
    id: "C117",
    statementUz: "Sizga n ta mantiqiy o‘zgaruvchi va m ta shart berilgan; har bir shart ikkita literalni nomlaydi. Literal — bu rost bo‘lishi kerak bo‘lgan o‘zgaruvchi (musbat son v bilan yoziladi) yoki yolg‘on bo‘lishi kerak bo‘lgani (manfiy son −v bilan yoziladi). Shart o‘zining ikki literalidan kamida bittasi bajarilganda qanoatlantirilgan hisoblanadi; ikkala literal bir xil bo‘lishi ham mumkin. Barcha m ta shartni bir vaqtda qanoatlantiradigan qiymatlar to‘plami mavjudligini aniqlang va YES yoki NO deb bosh harflarda chiqaring.",
    statementEn: "You are given n boolean variables and m clauses, each naming two literals. A literal is a variable that must be true, written as the positive number v, or one that must be false, written as the negative number −v. A clause counts as satisfied when at least one of its two literals holds; the two literals may also be the same. Determine whether some assignment of the variables satisfies all m clauses at once, and print YES or NO in capital letters.",
  },
  {
    id: "A125",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta so‘rov berilgan; har bir so‘rov bitta i pozitsiyasini nomlaydi. Har bir so‘rov uchun massivning shu pozitsiyasida turgan elementni toping va uni alohida qatorda chiqaring. Pozitsiyalar 1 dan raqamlanadi, 0 dan emas: 1-pozitsiya birinchi element, n-pozitsiya esa oxirgisiga to‘g‘ri keladi. Massiv so‘rovlar davomida o‘zgarmaydi, va bir xil pozitsiya bir necha marta so‘ralishi mumkin.",
    statementEn: "You are given an array a of n integers followed by q queries, each naming a single position i. For every query find the element standing at that position of the array and print it on its own line. Positions are numbered from 1 rather than from 0: position 1 is the first element and position n the last. The array never changes between queries, and the same position may be asked about several times.",
  },
  {
    id: "A132",
    statementUz: "Chiziqli qidiruv izlanayotgan qiymatni massivning birinchi elementidan boshlab har biri bilan navbatma-navbat solishtiradi va mos kelganini topganda to‘xtaydi. Eng yomon holat — qidirilayotgan qiymat massivning eng oxirida turgan yoki umuman yo‘q bo‘lgan holat: unda barcha elementlar solishtiriladi. Massiv uzunligi n berilganda, chiziqli qidiruv eng yomon holatda nechta solishtirish bajarishini chiqaring.",
    statementEn: "Linear search compares the value being looked for with each element of the array in turn, starting at the first, and stops when it finds a match. The worst case is the value standing at the very end of the array or being absent altogether: then every element is compared. Given the array length n, print how many comparisons linear search performs in the worst case.",
  },
  {
    id: "B141",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf, hamda ikkita u va v uchi berilgan. Yo‘l deb qirralar bo‘ylab yurib bir uchdan boshqasiga o‘tishga aytiladi; qirralar yo‘naltirilmagani uchun ularning har biri bo‘ylab ikkala yo‘nalishda ham yurish mumkin. u dan v ga boradigan yo‘l bor-yo‘qligini aniqlang va YES yoki NO deb bosh harflarda chiqaring. u = v bo‘lgan holda uzunligi nol bo‘lgan yo‘l bor va javob YES bo‘ladi.",
    statementEn: "You are given a graph with n vertices and m undirected edges, and two vertices u and v. A path is a walk from one vertex to another along the edges; since the edges are undirected, each may be walked in either direction. Determine whether a path from u to v exists, and print YES or NO in capital letters. When u = v there is a path of length zero and the answer is YES.",
  },
  {
    id: "B146",
    statementUz: "Sizga n ta element berilgan va dastlab ularning har biri o‘z guruhida yolg‘iz turadi. So‘ngra m ta birlashtirish amali keladi; har biri ikkita elementni nomlaydi va ularni saqlaydigan guruhlarni bitta guruhga qo‘shadi. Ikki element allaqachon bir guruhda bo‘lsa, amal hech narsani o‘zgartirmaydi. Barcha amallar bajarilgandan keyin eng katta guruhda nechta element borligini toping va uni chiqaring. Amallar bo‘lmasa javob 1.",
    statementEn: "You are given n elements, each initially alone in its own group. Then m merge operations arrive; each names two elements and joins the groups containing them into one. If the two elements already share a group, the operation changes nothing. After every operation has been applied, find how many elements the largest group holds and print it. With no operations at all the answer is 1.",
  },
  {
    id: "B147",
    statementUz: "Sizga r ta satr va c ta ustundan iborat jadval berilgan; unda '#' quruqlikni, '.' esa suvni bildiradi. Ikki quruqlik katagi umumiy tomonga ega bo‘lsa — yuqori, past, chap yoki o‘ng qo‘shni bo‘lsa — bog‘langan hisoblanadi; faqat burchagi bilan tegib turganlari bog‘lanmagan va har xil orollarga tegishli. Orol deb shu ma'noda bir-biriga bog‘langan quruqlik kataklari guruhiga aytiladi. Jadvaldagi orollar sonini sanang va uni chiqaring; quruqlik umuman bo‘lmasa javob 0.",
    statementEn: "You are given a grid of r rows and c columns in which '#' marks land and '.' marks water. Two land cells are connected when they share a side — up, down, left or right; cells touching only at a corner are not connected and belong to different islands. An island is a group of land cells connected to one another in that sense. Count the islands in the grid and print the number; if there is no land at all, the answer is 0.",
  },
  {
    id: "B148",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan. Ikki uch orasidagi masofa deb ularni tutashtiruvchi yo‘llardagi qirralarning eng kichik soniga aytiladi. 1-uchdan yetib boriladigan uchlar orasidan masofasi eng katta bo‘lganini qarab, o‘sha masofani chiqaring. 1-uchdan yetib bo‘lmaydigan uchlar umuman hisobga olinmaydi, va 1-uchning o‘ziga masofa 0 — shuning uchun qirralari yo‘q grafda javob 0 bo‘ladi.",
    statementEn: "You are given a graph with n vertices and m undirected edges. The distance between two vertices is the smallest number of edges on a path joining them. Among the vertices reachable from vertex 1, consider the one at the greatest distance and print that distance. Vertices that cannot be reached from vertex 1 are ignored entirely, and the distance from vertex 1 to itself is 0 — so in a graph with no edges the answer is 0.",
  },
  {
    id: "B149",
    statementUz: "Sizga o‘lchamlari berilgan n ta bo‘lak berilgan. Bitta bo‘lak qolmaguncha quyidagi amal takrorlanadi: ikkita bo‘lak tanlanadi va bittaga birlashtiriladi; bunday birlashtirishning narxi ularning o‘lchamlari yig‘indisiga teng, hosil bo‘lgan yangi bo‘lakning o‘lchami ham shu yig‘indi bo‘ladi va u keyingi birlashtirishlarda qatnashadi. Barcha birlashtirishlar narxlarining yig‘indisi eng kichik bo‘ladigan tartibni qarab, o‘sha umumiy narxni chiqaring. n = 1 bo‘lganda hech narsa birlashtirilmaydi va javob 0.",
    statementEn: "You are given n pieces with given sizes. The following operation is repeated until a single piece remains: two pieces are chosen and joined into one; the cost of such a join is the sum of their sizes, and the new piece has that same size and takes part in later joins. Consider the order that makes the total of all the join costs as small as possible, and print that total. For n = 1 nothing is joined and the answer is 0.",
  },
  {
    id: "B150",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan. Grafni ikki rang bilan bo‘yash deb har bir uchga ikki rangdan birini shunday berishga aytiladi-ki, har bir qirra har xil rangdagi ikki uchni bog‘lasin. Shunday bo‘yash mumkin bo‘lsa, har bir rangga nechta uch to‘g‘ri kelganini bitta qatorda, kattasini oldin qo‘yib chiqaring; mumkin bo‘lmasa −1 chiqaring. Graf bog‘lamli bo‘lishi shart emas: har bir komponentani alohida bo‘yash mumkin, lekin javob butun graf uchun beriladi.",
    statementEn: "You are given a graph with n vertices and m undirected edges. Two-colouring the graph means giving each vertex one of two colours so that every edge joins two vertices of different colours. If such a colouring is possible, print how many vertices take each colour on one line, the larger count first; if it is not, print −1. The graph need not be connected: each component may be coloured on its own, but the answer is given for the whole graph.",
  },
  {
    id: "C152",
    statementUz: "Sizga r ta satr va c ta ustundan iborat matritsa berilgan, undan keyin esa uning ichidagi bitta to‘rtburchak: r1 c1 chap yuqori burchagining satri va ustuni, r2 c2 esa o‘ng pastki burchagining satri va ustuni (barchasi 1 dan raqamlangan). To‘rtburchak r1 dan r2 gacha bo‘lgan satrlar bilan c1 dan c2 gacha bo‘lgan ustunlar kesishmasidagi barcha kataklarni, chegaralarni ham qo‘shib, o‘z ichiga oladi. Shu kataklardagi qiymatlar yig‘indisini hisoblang va uni chiqaring; yig‘indi 32-bitli turga sig‘maydi.",
    statementEn: "You are given a matrix with r rows and c columns, followed by a single rectangle inside it: r1 c1 are the row and column of its top-left corner and r2 c2 those of its bottom-right corner, all numbered from 1. The rectangle holds every cell where rows r1 to r2 meet columns c1 to c2, borders included. Compute the sum of the values in those cells and print it; the sum does not fit in a 32-bit type.",
  },
  {
    id: "B162",
    statementUz: "Sizga ikkita massiv berilgan: a da n ta, b da m ta son. Juftlik deb a dan bitta element va b dan bitta element tanlashga aytiladi, va u faqat a dan olingan element b dan olinganidan qat'iy kichik bo‘lsa yaroqli hisoblanadi. Har bir element ko‘pi bilan bitta juftlikda ishlatilishi mumkin. Yaroqli juftliklarning eng katta sonini toping va uni chiqaring. Solishtirish qat'iy: teng qiymatlarni juftlab bo‘lmaydi. Birorta juftlik tuzib bo‘lmasa javob 0.",
    statementEn: "You are given two arrays: n numbers in a and m numbers in b. A pair means choosing one element from a and one from b, and it is valid only when the element taken from a is strictly smaller than the one taken from b. Each element may be used in at most one pair. Find the largest number of valid pairs and print it. The comparison is strict: equal values cannot be paired. If no pair can be formed, the answer is 0.",
  },
  {
    id: "B166",
    statementUz: "Sizga n ta tadbir berilgan; har birining boshlanish vaqti s va tugash vaqti e bor, bunda s ≤ e. Bu masalada boshqasi tugagan paytda aynan boshlanadigan tadbir u bilan kesishgan hisoblanadi, ya'ni ikkalasini birga tanlab bo‘lmaydi — chetlari tegib turgan ikki tadbir ham mos kelmaydi. Hech qaysi ikkitasi kesishmaydigan qilib tanlash mumkin bo‘lgan tadbirlarning eng katta sonini toping va uni chiqaring. Tadbirlar ixtiyoriy tartibda beriladi.",
    statementEn: "You are given n events, each with a start time s and an end time e where s ≤ e. In this problem an event starting exactly when another ends counts as overlapping it, so the two may not both be chosen — two events that merely touch at their ends are incompatible. Find the largest number of events that can be chosen with no two of them overlapping, and print it. The events are given in arbitrary order.",
  },
  {
    id: "B167",
    statementUz: "Sizga n ta butun sondan iborat a massivi va k qiymati berilgan. a_i + a_j yig‘indisi k dan qat'iy kichik bo‘lgan, i < j shartli (i, j) pozitsiyalar juftliklarini sanang va ularning sonini chiqaring. Solishtirish qat'iy: yig‘indisi aynan k ga teng bo‘lgan juftlik hisobga olinmaydi. Juftliklar pozitsiyalar bo‘yicha sanaladi, ya'ni har xil o‘rinlardagi teng qiymatlar alohida juftliklar hosil qiladi. Javob 5·10^9 ga yetadi va 32-bitli turga sig‘maydi.",
    statementEn: "You are given an array a of n integers and a value k. Count the pairs of positions (i, j) with i < j whose sum a_i + a_j is strictly less than k, and print how many there are. The comparison is strict: a pair whose sum equals k exactly does not count. Pairs are counted by position, so equal values at different positions form separate pairs. The answer reaches 5·10^9 and does not fit in a 32-bit type.",
  },
];
