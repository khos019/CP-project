/* Statement rewrite, batch 21 — sixteen more. Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-21-statements.mjs
 */
export default [
  {
    id: "C205",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta so'rov berilgan; pozitsiyalar 1 dan raqamlanadi. So'rov ikki xil bo'ladi:\n\n• \"1 i v\" — i-pozitsiyadagi qiymatni v ga almashtiradi (eskisiga qo'shmaydi);\n• \"2 l r\" — l dan r gacha bo'lgan pozitsiyalardagi elementlarning eng kattasini so'raydi, chegaralar ham kiradi.\n\nSo'rovlar berilgan tartibda bajariladi, ya'ni har bir so'rov massivning shu paytdagi holatiga tegishli. Har bir ikkinchi tur so'rovi uchun javobni alohida qatorda chiqaring. Massiv butunlay manfiy bo'lishi mumkin.",
    statementEn: "You are given an array a of n integers followed by q queries; positions are numbered from 1. There are two kinds of query:\n\n• \"1 i v\" — replaces the value at position i with v (it does not add to the old one);\n• \"2 l r\" — asks for the largest of the elements at positions l through r, ends included.\n\nThe queries are applied in the order given, so each refers to the state of the array at that moment. For every query of the second kind print the answer on its own line. The array may be entirely negative.",
  },
  {
    id: "C206",
    statementUz: "Sizga n ta butun sondan iborat a massivi va undan keyin q ta so'rov berilgan; pozitsiyalar 1 dan raqamlanadi. So'rov ikki xil bo'ladi:\n\n• \"1 l r v\" — l dan r gacha bo'lgan har bir elementga v qiymatini qo'shadi; v manfiy bo'lishi mumkin;\n• \"2 l r\" — shu oraliqdagi elementlar yig'indisini so'raydi, chegaralar ham kiradi.\n\nSo'rovlar berilgan tartibda bajariladi va oraliqlar bir-birining ustiga tushishi mumkin. Har bir ikkinchi tur so'rovi uchun yig'indini alohida qatorda chiqaring; yig'indi moduli 4·10^14 ga yetadi va 32-bitli turga sig'maydi.",
    statementEn: "You are given an array a of n integers followed by q queries; positions are numbered from 1. There are two kinds of query:\n\n• \"1 l r v\" — adds the value v to every element from l through r; v may be negative;\n• \"2 l r\" — asks for the sum of the elements on that range, ends included.\n\nThe queries are applied in the order given and the ranges may overlap. For every query of the second kind print the sum on its own line; a sum reaches 4·10^14 in magnitude and does not fit in a 32-bit type.",
  },
  {
    id: "C209",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilgan qirradan iborat graf berilgan. Ikki tugun bitta kuchli bog'langan komponentada yotadi deyiladi, agar birinchisidan ikkinchisiga boradigan yo'l ham, ikkinchisidan birinchisiga qaytadigan yo'l ham mavjud bo'lsa; har bir tugun o'zi bilan shu munosabatda, shuning uchun har bir tugun aynan bitta komponentaga tegishli. Grafdagi shunday komponentalar sonini toping va uni chiqaring. Birorta qirraga tegmagan tugun o'zi yolg'iz komponenta hosil qiladi, ya'ni javob 1 dan n gacha bo'lgan oraliqda yotadi. Qirralar takrorlanishi va tugunni o'ziga bog'lashi mumkin.",
    statementEn: "You are given a graph with n vertices and m directed edges. Two vertices lie in the same strongly connected component when there is a path from the first to the second and a path back again; every vertex stands in that relation to itself, so each vertex belongs to exactly one component. Find the number of such components in the graph and print it. A vertex touched by no edge forms a component on its own, so the answer lies between 1 and n. Edges may repeat and may join a vertex to itself.",
  },
  {
    id: "C211",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilmagan qirradan iborat graf berilgan. Tugun ajratuvchi deyiladi, agar uni va unga tegib turgan barcha qirralarni olib tashlash grafdagi bog'langan komponentalar sonini oshirsa — ya'ni shu tugun orqali bog'langan qismlar bir-biridan ajralib qolsa. Grafdagi ajratuvchi tugunlar sonini toping va uni chiqaring. Graf bog'lamli bo'lishi shart emas, va o'z-o'ziga bog'lovchi qirra berilmaydi. Bir juft tugun orasida bir nechta qirra bo'lishi mumkin.",
    statementEn: "You are given a graph with n vertices and m undirected edges. A vertex is an articulation point when removing it, together with every edge touching it, increases the number of connected components — that is, when the parts joined through that vertex fall apart from one another. Find the number of articulation points in the graph and print it. The graph need not be connected, and no edge joins a vertex to itself. Several edges may join the same pair of vertices.",
  },
  {
    id: "C214",
    statementUz: "Sizga 1-tugundan ildiz oladigan n ta tugunli daraxt va har bir tugunning boshlang'ich qiymati berilgan. Tugunning pastki daraxti deb o'sha tugun va ildizdan qaraganda uning ostidagi barcha tugunlar tushuniladi. So'ngra q ta so'rov keladi:\n\n• \"1 v x\" — v tugunining qiymatini x ga almashtiradi;\n• \"2 v\" — v ning pastki daraxtidagi barcha qiymatlar yig'indisini so'raydi, v ning o'z qiymati ham qo'shiladi.\n\nSo'rovlar berilgan tartibda bajariladi. Ildizning pastki daraxti butun daraxtdir; yig'indi 32-bitli turga sig'maydi.",
    statementEn: "You are given a tree with n vertices rooted at vertex 1 and an initial value for each vertex. The subtree of a vertex is that vertex together with every vertex below it as seen from the root. Then q queries arrive:\n\n• \"1 v x\" — replaces the value of vertex v with x;\n• \"2 v\" — asks for the sum of all the values in the subtree of v, v's own value included.\n\nThe queries are applied in the order given. The subtree of the root is the whole tree; a sum does not fit in a 32-bit type.",
  },
  {
    id: "C215",
    statementUz: "Sizga 1-tugundan ildiz oladigan n ta tugunli daraxt berilgan va har bir tugun og'irlik tashiydi. Tugunlar to'plami mustaqil deyiladi, agar undagi hech ikkita tugun qirra bilan bevosita bog'lanmagan bo'lsa. Shunday to'plamlar orasidan og'irliklari yig'indisi eng katta bo'lganini qarab, o'sha yig'indini chiqaring. Og'irliklar manfiy bo'lishi mumkin, shuning uchun bo'sh to'plam ham qonuniy tanlov va uning yig'indisi 0 ga teng — ya'ni javob hech qachon manfiy bo'lmaydi. Yig'indi 32-bitli turga sig'maydi.",
    statementEn: "You are given a tree with n vertices rooted at vertex 1, each carrying a weight. A set of vertices is independent when no two of its vertices are joined directly by an edge. Among such sets consider the one whose weights sum to the most, and print that total. Weights may be negative, so the empty set is a legal choice and sums to 0 — the answer is therefore never negative. The total does not fit in a 32-bit type.",
  },
  {
    id: "C217",
    statementUz: "n ta shahar bor va har bir tartiblangan juftlik uchun bir shahardan boshqasiga borish narxi matritsa bilan berilgan; matritsa simmetrik bo'lishi shart emas, ya'ni i dan j ga borish narxi j dan i ga borish narxidan farq qilishi mumkin. Diagonal qiymatlar nolga teng. Marshrut 1-shahardan chiqib, qolgan barcha shaharlarda aynan bir martadan bo'lib, 1-shaharga qaytishi kerak. Shunday marshrutlar orasidan umumiy narxi eng kichigini toping va o'sha narxni chiqaring. n = 1 bo'lganda hech qayerga borish kerak emas va javob 0.",
    statementEn: "There are n cities, and the cost of going from one to another is given by a matrix for every ordered pair; the matrix need not be symmetric, so going from i to j may cost more or less than going from j to i. The diagonal entries are zero. A route must leave city 1, visit each of the other cities exactly once, and return to city 1. Among such routes find the one of smallest total cost and print that cost. When n = 1 there is nowhere to go and the answer is 0.",
  },
  {
    id: "C220",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilgan qirradan iborat graf berilgan; qirralarning vazni manfiy bo'lishi mumkin. Halqa deb boshlangan tuguniga qaytadigan yo'lga aytiladi, uning vazni esa undagi qirralar vaznlarining yig'indisi. 1-tugundan yetib boriladigan tugunlar orasida vazni manfiy bo'lgan halqa bor-yo'qligini aniqlang va YES yoki NO chiqaring. Faqat 1-tugundan yetib boriladigan halqalar hisobga olinadi: grafning ajralib qolgan boshqa qismidagi manfiy halqa javobga ta'sir qilmaydi.",
    statementEn: "You are given a graph with n vertices and m directed edges whose weights may be negative. A cycle is a walk returning to the vertex it started from, and its weight is the sum of the weights of its edges. Determine whether a cycle of negative weight exists among the vertices reachable from vertex 1, and print YES or NO. Only cycles reachable from vertex 1 count: a negative cycle sitting in a separate part of the graph does not affect the answer.",
  },
  {
    id: "C223",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilmagan qirradan iborat graf berilgan; har bir qirra musbat vazn tashiydi. Yo'lning bahosi deb undagi qirralarning eng og'irining vazniga aytiladi — yig'indi emas, aynan maksimum. 1-tugundan n-tugungacha boradigan yo'llar orasidan bahosi eng kichigini qarab, o'sha bahoni chiqaring. Manzilga umuman yetib bo'lmasa -1 chiqariladi; n = 1 bo'lganda esa birorta qirra yurish kerak emas va javob 0.",
    statementEn: "You are given a graph with n vertices and m undirected edges, each carrying a positive weight. The score of a path is the weight of its heaviest edge — the maximum, not the sum. Among the paths from vertex 1 to vertex n consider the one of smallest score, and print that score. If the destination cannot be reached at all, -1 is printed; and when n = 1 no edge has to be walked, so the answer is 0.",
  },
  {
    id: "C233",
    statementUz: "Sizga qavariq ko'pburchak uchlari soat strelkasiga teskari yo'nalishda sanab o'tilgan holda berilgan; uning uchta ketma-ket uchi bir to'g'ri chiziqda yotmaydi. So'ngra q ta so'rov nuqtasi keladi. Har bir nuqta uchun u ko'pburchakning ichida yoki chegarasida yotadimi degan savolga javob bering va YES yoki NO deb alohida qatorda chiqaring. Chegara ichkariga tegishli: aynan qirra ustida yoki uchda turgan nuqta uchun javob YES bo'ladi.",
    statementEn: "You are given a convex polygon with its vertices listed counter-clockwise; no three consecutive vertices of it are collinear. Then q query points arrive. For each point answer whether it lies inside the polygon or on its boundary, printing YES or NO on its own line. The boundary belongs to the inside: for a point exactly on an edge or at a vertex the answer is YES.",
  },
  {
    id: "C236",
    statementUz: "Doskada n ta uyum bor; i-uyumda a_i tosh, va uyum bo'sh bo'lishi mumkin. Sizga k ta har xil musbat sondan iborat S to'plami ham berilgan. Ikki o'yinchi navbatma-navbat yuradi; bir yurishda o'yinchi bitta uyumni tanlab, undan aynan S dagi qiymatlardan biriga teng miqdorda tosh oladi — buning uchun uyumda shuncha tosh bo'lishi shart. Birorta qonuniy yurishi qolmagan o'yinchi yutqazadi. Ikkala o'yinchi ham optimal o'ynasa, kim yutishini aniqlang va First yoki Second chiqaring.",
    statementEn: "There are n piles; pile i holds a_i stones, and a pile may be empty. You are also given a set S of k distinct positive numbers. Two players move in turn; on a move a player picks one pile and removes from it a number of stones equal to one of the values in S — the pile must hold that many. A player left with no legal move loses. Assuming both play optimally, determine who wins and print First or Second.",
  },
  {
    id: "C238",
    statementUz: "Sizga kichik lotin harflaridan iborat s matni va k ta naqsh berilgan. Naqsh matnning biror pozitsiyasida uchraydi deyiladi, agar shu pozitsiyadan boshlangan, uzunligi naqshga teng bo'lak naqsh bilan aynan mos kelsa. Barcha naqshlarning barcha uchrashlari umumiy sonini toping va uni chiqaring. Har bir uchrash alohida sanaladi: uchrashlar bir-birining ustiga tushishi mumkin, va ikki naqsh bir xil bo'lsa, ularning uchrashlari ham alohida-alohida qo'shiladi.",
    statementEn: "You are given a text s of lowercase Latin letters and k patterns. A pattern occurs at a position of the text when the piece starting there, of the pattern's own length, matches the pattern exactly. Find the total number of occurrences of all the patterns and print it. Every occurrence counts separately: occurrences may overlap, and if two patterns are identical their occurrences are added separately as well.",
  },
  {
    id: "C241",
    statementUz: "Bir qatorda n ta ustun turibdi; i-ustunning balandligi h_i va balandliklar qat'iy o'sib boradi. Siz 1-ustunda turasiz va n-ustunga yetishingiz kerak; har bir sakrash faqat oldinga, ya'ni i-ustundan j > i bo'lgan j-ustunga bo'ladi va (h_j − h_i)² + c turadi, bunda c berilgan doimiy narx. Yo'lning umumiy narxi — bajarilgan sakrashlar narxlarining yig'indisi. Eng kichik umumiy narxni toping va uni chiqaring. n = 1 bo'lganda sakrash kerak emas va javob 0; narx 10^18 ga yetadi.",
    statementEn: "There are n pillars in a row; pillar i has height h_i and the heights strictly increase. You stand on pillar 1 and must reach pillar n; every jump goes forward only, from pillar i to a pillar j with j > i, and costs (h_j − h_i)² + c, where c is a given fixed charge. The total cost of a route is the sum of the costs of the jumps made. Find the smallest total cost and print it. When n = 1 no jump is needed and the answer is 0; the cost reaches 10^18.",
  },
  {
    id: "C242",
    statementUz: "Sizga n ta manfiy bo'lmagan sondan iborat massiv va k soni berilgan. Massivni aynan k ta bo'sh bo'lmagan ketma-ket bo'lakka ajratish kerak: elementlarning tartibi o'zgarmaydi va har bir element aynan bitta bo'lakka tushadi. Bo'linishning narxi deb har bir bo'lakdagi sonlar yig'indisining kvadratlari yig'indisiga aytiladi. Barcha mumkin bo'lgan bo'linishlar orasidan narxi eng kichigini toping va o'sha narxni chiqaring. k = 1 bo'lganda javob butun massiv yig'indisining kvadrati bo'ladi. Narx 32-bitli turga sig'maydi.",
    statementEn: "You are given an array of n non-negative integers and a number k. The array must be split into exactly k non-empty consecutive parts: the order of the elements does not change and every element falls into exactly one part. The cost of a split is the sum, over the parts, of the square of that part's total. Among all possible splits find the one of smallest cost and print that cost. For k = 1 the answer is the square of the whole array's total. The cost does not fit in a 32-bit type.",
  },
  {
    id: "C243",
    statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Har bir elementni istalgan butun songa o'zgartirish mumkin — jumladan dastlabki qiymatlar oralig'idan tashqaridagi songa ham; a_i ni b_i ga o'zgartirish |a_i − b_i| turadi va umumiy narx shu qiymatlarning yig'indisi. Massivni kamaymaydigan qilish, ya'ni har bir i uchun b_i ≤ b_{i+1} shartini bajarish uchun kerak bo'ladigan eng kichik umumiy narxni toping va uni chiqaring. Massiv allaqachon kamaymaydigan bo'lsa javob 0; narx 2·10^14 ga yetadi.",
    statementEn: "You are given an array of n integers. Each element may be changed to any integer — including one outside the range of the original values; changing a_i into b_i costs |a_i − b_i|, and the total cost is the sum of those amounts. Find the smallest total cost of making the array non-decreasing, that is of satisfying b_i ≤ b_{i+1} for every i, and print it. If the array is already non-decreasing the answer is 0; the cost reaches 2·10^14.",
  },
];
