"use client";

import type { Spec } from "./diagram-kit";

// Picks a diagram for a single unit.
//
// 199 units cannot each get a hand-drawn picture, but they should not all share
// one either — which is what keying by roadmap produced. Each unit is matched on
// what it actually teaches, so a loop unit gets a loop, a grid unit gets a grid
// and a graph unit gets a graph.

type Rule = { any: string[]; spec: (title: string) => Spec };

const RULES: Rule[] = [
  { any: ["havola", "referens", "vector", "stl"], spec: () => ({
      kind: "flow", label: "Qiymat yoki havola: nusxa olinadimi yoki yo‘qmi",
      steps: ["qiymat → nusxa", "havola → asl", "const & → tez"], note: "katta obyektni & bilan uzating" }) },
  { any: ["cheklov", "byudjet"], spec: () => ({
      kind: "table", label: "Cheklovdan algoritm tanlanadi (~10⁸ amal)",
      rows: [["n ≤ 20", "2ⁿ"], ["n ≤ 5000", "n²"], ["n ≤ 10⁶", "n log n"]], hi: [2, 1],
      note: "n ni ko‘rib murakkablikni tanlang" }) },
  { any: ["eng yomon", "o‘rtacha holat", "yakuniy tahlil"], spec: () => ({
      kind: "curve", label: "Eng yomon holat — kafolat, o‘rtacha — kutilma" }) },
  { any: ["o(1)", "o(n)", "kvadratik", "kub", "eksponentsial", "faktorial", "xotira murakkab"], spec: () => ({
      kind: "curve", label: "Murakkablik sinflari yonma-yon" }) },
  { any: ["inversiya"], spec: () => ({
      kind: "array", label: "Inversiya: chapdagi o‘ngdagidan katta",
      values: [2, 4, 1, 3, 5], hi: [0, 2], ptr: [{ at: 0, text: "i" }, { at: 2, text: "j", color: "#8ad8ff" }],
      note: "a[i] > a[j] va i < j" }) },
  { any: ["pastki chegara", "barqarorlik", "stability", "komparator", "ko‘p kalitli"], spec: () => ({
      kind: "tworow", label: "Barqaror saralash teng elementlar tartibini saqlaydi",
      top: ["b1", "a1", "b2", "a2"], bottom: ["a1", "a2", "b1", "b2"], topName: "oldin", bottomName: "keyin",
      hi: [0, 1], note: "a1 doim a2 dan oldin qoladi" }) },
  { any: ["qism to‘plam", "kombinatsiya", "permutatsiya"], spec: () => ({
      kind: "graph", label: "Har elementda ikki yo‘l: olaman yoki yo‘q",
      nodes: [[260, 26, "∅"], [160, 80, "+a"], [360, 80, "−a"], [100, 132, "ab"], [220, 132, "a"], [420, 132, "b"]],
      edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]], directed: true, note: "2ⁿ ta variant" }) },
  { any: ["qirolicha", "pruning", "kesish", "fail-first", "csp", "konstruksiya"], spec: () => ({
      kind: "grid", label: "Kesish: ziddiyat topilishi bilan shox tashlanadi",
      rows: ["*#..", "..#*", "#*..", "..#*"], note: "har qatorga bitta, ustun va diagonal band bo‘lmasin" }) },
  { any: ["meet in the middle", "memoizatsiya"], spec: () => ({
      kind: "flow", label: "Ikkiga bo‘lib yechish: yarmini sanab, keyin birlashtirish",
      steps: ["chap yarim", "o‘ng yarim", "birlashtirish"], note: "2ⁿ → 2^(n/2)" }) },
  { any: ["ekub", "evklid", "diofant"], spec: () => ({
      kind: "flow", label: "Evklid: katta sonni qoldiq bilan almashtiramiz",
      steps: ["gcd(48,18)", "gcd(18,12)", "gcd(12,6)", "6"], note: "qoldiq nolga aylanguncha" }) },
  { any: ["katalan"], spec: () => ({
      kind: "array", label: "Katalan sonlari: 1, 1, 2, 5, 14, 42",
      values: [1, 1, 2, 5, 14, 42], hi: [4, 5], note: "to‘g‘ri qavslar soniga teng" }) },
  { any: ["bog‘langan ro‘yxat"], spec: () => ({
      kind: "graph", label: "Bog‘langan ro‘yxat: har tugun keyingisiga ishora qiladi",
      nodes: [[90, 76, "3"], [220, 76, "9"], [350, 76, "1"], [460, 76, "∅"]],
      edges: [[0, 1], [1, 2], [2, 3]], directed: true, note: "indeks yo‘q — faqat ko‘rsatkich" }) },
  { any: ["sparse", "rmq"], spec: () => ({
      kind: "tworow", label: "Sparse table: 2^k uzunlikdagi oraliqlar oldindan hisoblanadi",
      top: [3, 1, 4, 1, 5, 9, 2, 6], bottom: ["1", "1", "1", "1", "2", "2", "2", "—"],
      topName: "a", bottomName: "min", hi: [0, 1, 2, 3], note: "statik so‘rov O(1)" }) },
  { any: ["lower va upper", "birinchi rost", "asosiy sxema", "haqiqiy son", "predikat"], spec: () => ({
      kind: "array", label: "Predikat monoton: yolg‘ondan rostga bir marta o‘tadi",
      values: ["F", "F", "F", "T", "T", "T"], hi: [3, 4, 5],
      ptr: [{ at: 3, text: "birinchi T" }], note: "shu chegarani qidiramiz" }) },
  { any: ["exchange argument", "faoliyat tanlash", "activity"], spec: () => ({
      kind: "array", label: "Almashtirish argumenti: optimalni buzmasdan almashtirish mumkin",
      values: ["[1,3]", "[2,5]", "[4,7]", "[6,9]"], hi: [0, 2], note: "erta tugagan hech narsani yo‘qotmaydi" }) },
  { any: ["graf modeli", "bo‘yash", "ikki bo‘lakli", "moslashtirish"], spec: () => ({
      kind: "graph", label: "Ikki bo‘laklilik: qo‘shni tugunlar har xil rangda",
      nodes: [[130, 40, "A"], [130, 116, "B"], [390, 40, "1"], [390, 116, "2"]],
      edges: [[0, 2], [0, 3], [1, 2]], note: "toq sikl bo‘lsa bo‘yash mumkin emas" }) },
  { any: ["scc", "kuchli bog‘langan"], spec: () => ({
      kind: "graph", label: "SCC: ichida har tugundan har tugunga yo‘l bor",
      nodes: [[120, 76, "1"], [240, 36, "2"], [240, 116, "3"], [400, 76, "4"]],
      edges: [[0, 1], [1, 2], [2, 0], [1, 3]], directed: true, note: "{1,2,3} bitta komponent" }) },
  { any: ["floyd", "eyler", "max flow", "oqim"], spec: () => ({
      kind: "table", label: "Barcha juftliklar orasidagi masofa jadvali",
      rows: [[0, 3, 7], [3, 0, 2], [7, 2, 0]], hi: [0, 2], note: "d[i][j] = min(d[i][j], d[i][k]+d[k][j])" }) },
  { any: ["kmp", "z algoritmi", "prefiks funksiya"], spec: () => ({
      kind: "tworow", label: "Prefiks funksiya: eng uzun mos prefiks-suffiks",
      top: ["a", "b", "a", "b", "a", "c"], bottom: [0, 0, 1, 2, 3, 0], topName: "s", bottomName: "π",
      hi: [2, 3, 4], note: "mos kelmaganda shu yerga qaytamiz" }) },
  { any: ["manacher", "aho", "suffix", "automaton"], spec: () => ({
      kind: "array", label: "Suffikslar tartiblanadi, keyin qidiruv binary search bilan",
      values: ["a", "ab", "aba", "b", "ba"], hi: [1, 2], note: "har suffiks — bitta qator" }) },
  { any: ["skalyar", "kesishuvchi", "calipers", "qutb", "pick"], spec: () => ({
      kind: "graph", label: "Kesmalar kesishuvi: ishoralar qarama-qarshi bo‘lsa kesishadi",
      nodes: [[110, 116, "A"], [420, 40, "B"], [110, 40, "C"], [420, 116, "D"]],
      edges: [[0, 1], [2, 3]], note: "cross ishoralari har xil → kesishadi" }) },
  { any: ["qarama-qarshi", "aynan k", "aralash"], spec: () => ({
      kind: "array", label: "«Aynan K» = «ko‘pi bilan K» − «ko‘pi bilan K−1»",
      values: [1, 2, 1, 2, 3], hi: [1, 2, 3], ptr: [{ at: 1, text: "l" }, { at: 3, text: "r", color: "#8ad8ff" }] }) },
  { any: ["overlapping", "optimal substructure", "holatni aniqlash", "o‘tishlarni qurish"], spec: () => ({
      kind: "graph", label: "Bir xil qism-masala qayta-qayta uchraydi",
      nodes: [[260, 26, "f(5)"], [170, 80, "f(4)"], [350, 80, "f(3)"], [110, 132, "f(3)"], [240, 132, "f(2)"]],
      edges: [[0, 1], [0, 2], [1, 3], [1, 4]], directed: true, note: "f(3) ikki marta — memoizatsiya kerak" }) },
  { any: ["binary lifting", "centroid"], spec: () => ({
      kind: "table", label: "Binary lifting: 2^k qadam yuqoriga sakrash",
      rows: [["k=0", "1 qadam"], ["k=1", "2 qadam"], ["k=2", "4 qadam"]], hi: [2, 1],
      note: "istalgan masofa 2 ning darajalari yig‘indisi" }) },
  { any: ["treap", "mo algoritmi", "heavy-light", "fft", "ntt", "o‘yinlar", "2-sat"], spec: () => ({
      kind: "flow", label: "Murakkab texnika: masalani qismlarga ajratib yechish",
      steps: ["ajratish", "qismlarni yechish", "birlashtirish"], note: "har qism alohida tahlil qilinadi" }) },
  { any: ["qaysi usulni tanlash", "qaysi vositani tanlash", "qaysi tuzilmani tanlash", "qaysi algoritmni tanlash"], spec: () => ({
      kind: "table", label: "Qaysi vositani tanlash — cheklovga qarab",
      rows: [["kichik n", "brute force"], ["saralangan", "binary search"], ["oraliq so‘rov", "prefiks / daraxt"]],
      hi: [1, 1], note: "avval cheklovni o‘qing" }) },
  { any: ["muhitni sozlash", "birinchi dastur", "shablon"], spec: () => ({
      kind: "flow", label: "Musobaqa oqimi: yozish → kompilyatsiya → tekshiruv",
      steps: ["kod", "compile", "stdin", "stdout"], note: "har bosqichda xato bo‘lishi mumkin" }) },
  { any: ["kirish va chiqish", "fast i/o", "tez kiritish"], spec: () => ({
      kind: "flow", label: "Kiritish–hisoblash–chiqarish zanjiri",
      steps: ["stdin o‘qish", "hisoblash", "stdout yozish"], note: "cin.tie(nullptr) buferni tezlashtiradi" }) },
  { any: ["o‘zgaruvchi", "tiplar", "tip"], spec: () => ({
      kind: "table", label: "Tiplar va ular sig‘dira oladigan chegara",
      rows: [["int", "~2·10⁹"], ["long long", "~9·10¹⁸"], ["double", "~15 raqam"]], hi: [1, 1],
      note: "chegaradan oshsa qiymat aylanib ketadi" }) },
  { any: ["overflow", "aniqlik"], spec: () => ({
      kind: "array", label: "Overflow: chegaradan oshgach qiymat aylanadi",
      values: ["2·10⁹", "+1", "→", "−2·10⁹"], hi: [3], note: "int o‘rniga long long ishlating" }) },
  { any: ["operator", "ifoda"], spec: () => ({
      kind: "flow", label: "Ifoda hisoblanish tartibi", steps: ["( )", "* /", "+ −", "solishtirish"],
      note: "chapdan o‘ngga, ustuvorlik bo‘yicha" }) },
  { any: ["shart operator", "if/else", "if "], spec: () => ({
      kind: "flow", label: "Shart: bitta tekshiruv, ikki yo‘l", steps: ["shart?", "ha → A", "yo‘q → B"],
      note: "har bir tarmoq alohida sinaladi" }) },
  { any: ["switch", "uchlik"], spec: () => ({
      kind: "flow", label: "Switch: qiymat bo‘yicha tarmoqlanish", steps: ["qiymat", "case 1", "case 2", "default"] }) },
  { any: ["for sikli", "while", "sikl"], spec: () => ({
      kind: "array", label: "Sikl: i har qadamda oldinga siljiydi",
      values: [4, 8, 15, 16, 23, 42], hi: [0, 1, 2], ptr: [{ at: 3, text: "i" }],
      note: "i < n shart buzilganda sikl to‘xtaydi" }) },
  { any: ["ko‘p o‘lchov", "matritsa", "ikki o‘lchov"], spec: () => ({
      kind: "table", label: "Ikki o‘lchovli massiv: [satr][ustun]",
      rows: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], hi: [1, 2], note: "a[1][2] = 6" }) },
  { any: ["massiv"], spec: () => ({
      kind: "array", label: "Massiv: indeks bo‘yicha to‘g‘ridan-to‘g‘ri kirish",
      values: [3, 9, 1, 7, 4], hi: [2], ptr: [{ at: 2, text: "a[2]" }], note: "indeks 0 dan boshlanadi" }) },
  { any: ["satr"], spec: () => ({
      kind: "array", label: "Satr — belgilar massivi", values: ["A", "L", "G", "O", "R", "I", "T", "M"],
      hi: [2, 3, 4, 5], note: "s.substr(2,4) → \"GORI\"" }) },
  { any: ["funksiya"], spec: () => ({
      kind: "flow", label: "Funksiya: kirish → ish → qaytarish", steps: ["argument", "tana", "return"],
      note: "referens bilan uzatish nusxa olishdan tez" }) },
  { any: ["rekursiya", "backtrack", "qaytish"], spec: () => ({
      kind: "graph", label: "Rekursiya daraxti: tanla, chuqurlash, orqaga qayt",
      nodes: [[260, 26, "?"], [160, 78, "A"], [360, 78, "B"], [110, 128, "1"], [212, 128, "2"], [412, 128, "3"]],
      edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]], directed: true,
      note: "boshi berk shox kesiladi" }) },
  { any: ["saralash", "sort"], spec: () => ({
      kind: "tworow", label: "Saralash: tartibsizlikdan tartibga",
      top: [5, 2, 8, 1, 9, 3], bottom: [1, 2, 3, 5, 8, 9], topName: "oldin", bottomName: "keyin",
      hi: [0, 1, 2, 3, 4, 5], note: "O(n log n)" }) },
  { any: ["ikkilik qidiruv", "binary search", "javob bo‘yicha"], spec: () => ({
      kind: "array", label: "Binary search: har qadamda yarmi tashlanadi",
      values: [3, 6, 9, 12, 15, 18, 21, 24], hi: [4, 5, 6, 7],
      ptr: [{ at: 0, text: "lo" }, { at: 3, text: "mid", color: "#c8ff76" }, { at: 7, text: "hi" }],
      note: "a[mid] < x → chap yarmi kerak emas" }) },
  { any: ["ikki ko‘rsatkich", "two pointer"], spec: () => ({
      kind: "array", label: "Ikki ko‘rsatkich chetlardan markazga yuradi",
      values: [1, 3, 4, 6, 8, 9, 12], hi: [1, 5],
      ptr: [{ at: 1, text: "l →" }, { at: 5, text: "← r", color: "#8ad8ff" }],
      note: "yig‘indi kichik bo‘lsa l siljiydi" }) },
  { any: ["oyna", "sliding"], spec: () => ({
      kind: "array", label: "Sirg‘aluvchi oyna: biri kiradi, biri chiqadi",
      values: [2, 7, 1, 8, 2, 8, 1], hi: [2, 3, 4],
      ptr: [{ at: 2, text: "−" }, { at: 4, text: "+", color: "#c8ff76" }], note: "k = 3" }) },
  { any: ["prefiks", "prefix"], spec: () => ({
      kind: "tworow", label: "Prefiks yig‘indi: [l,r] = pre[r] − pre[l−1]",
      top: [3, 1, 4, 1, 5, 9], bottom: [3, 4, 8, 9, 14, 23], topName: "a", bottomName: "pre",
      hi: [1, 2, 3], note: "pre[4] − pre[1] = 6" }) },
  { any: ["stack", "stek", "qavs"], spec: () => ({
      kind: "stack", label: "Stek: oxirgi kirgan birinchi chiqadi", items: ["(", "[", "{"],
      note: "yopuvchi belgi eng yuqoridagiga mos kelishi kerak" }) },
  { any: ["navbat", "queue", "deque"], spec: () => ({
      kind: "array", label: "Navbat: birinchi kirgan birinchi chiqadi",
      values: [5, 7, 9, 2], hi: [0], ptr: [{ at: 0, text: "front" }, { at: 3, text: "back", color: "#8ad8ff" }] }) },
  { any: ["heap", "uyum", "ustuvor"], spec: () => ({
      kind: "graph", label: "Uyum: ota bolasidan katta (yoki kichik)",
      nodes: [[260, 30, "9"], [180, 84, "7"], [340, 84, "8"], [120, 132, "3"], [240, 132, "5"]],
      edges: [[0, 1], [0, 2], [1, 3], [1, 4]], note: "ildizda doim eng katta element" }) },
  { any: ["dsu", "disjoint", "birlashtir"], spec: () => ({
      kind: "graph", label: "DSU: to‘plamlar birlashadi, ildiz umumiy bo‘ladi",
      nodes: [[150, 40, "1"], [150, 110, "2"], [260, 75, "3"], [380, 40, "4"], [380, 110, "5"]],
      edges: [[0, 2], [1, 2], [3, 4]], note: "ikkala uch bir ildizda bo‘lsa — sikl" }) },
  { any: ["fenwick", "segment", "sqrt"], spec: () => ({
      kind: "tworow", label: "Daraxtli tuzilma: bloklar yig‘indini saqlaydi",
      top: [3, 1, 4, 1, 5, 9, 2, 6], bottom: ["4", "5", "14", "8", "—", "—", "—", "—"],
      topName: "a", bottomName: "blok", hi: [0, 1, 2, 3], note: "so‘rov O(log n) da javob beradi" }) },
  { any: ["bfs", "eng qisqa yo‘l"], spec: () => ({
      kind: "graph", label: "BFS qatlam-qatlam kengayadi",
      nodes: [[80, 76, "0"], [190, 40, "1"], [190, 112, "1"], [310, 30, "2"], [310, 122, "2"], [430, 76, "3"]],
      edges: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]], note: "shuning uchun eng qisqa yo‘lni beradi" }) },
  { any: ["dfs", "obxod", "komponenta"], spec: () => ({
      kind: "graph", label: "DFS chuqurlikka kirib, keyin orqaga qaytadi",
      nodes: [[90, 40, "1"], [200, 40, "2"], [310, 40, "3"], [200, 116, "4"], [420, 90, "5"]],
      edges: [[0, 1], [1, 2], [1, 3], [2, 4]], directed: true, note: "har tugun bir marta ko‘riladi" }) },
  { any: ["topologik", "dag"], spec: () => ({
      kind: "graph", label: "Topologik tartib: har qirra oldinga qaraydi",
      nodes: [[90, 76, "1"], [210, 40, "2"], [210, 112, "3"], [330, 76, "4"], [440, 76, "5"]],
      edges: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]], directed: true, note: "sikl bo‘lsa tartib mavjud emas" }) },
  { any: ["dijkstra", "vazn"], spec: () => ({
      kind: "graph", label: "Vaznli graf: eng arzon yo‘l qidiriladi",
      nodes: [[90, 76, "1"], [230, 34, "2"], [230, 118, "3"], [400, 76, "4"]],
      edges: [[0, 1, "1"], [0, 2, "5"], [1, 3, "3"], [2, 3, "1"]], note: "1→2→4 = 4, 1→3→4 = 6" }) },
  { any: ["mst", "ostov", "kruskal", "prim"], spec: () => ({
      kind: "graph", label: "Minimal ostov daraxti: eng arzon qirralar",
      nodes: [[110, 40, "1"], [110, 116, "2"], [280, 76, "3"], [430, 76, "4"]],
      edges: [[0, 1, "1"], [1, 2, "2"], [0, 2, "6"], [2, 3, "3"]], note: "sikl hosil qiluvchi qirra tashlanadi" }) },
  { any: ["daraxt", "tree", "lca"], spec: () => ({
      kind: "graph", label: "Daraxt: n tugun, n−1 qirra, sikl yo‘q",
      nodes: [[260, 28, "1"], [170, 82, "2"], [350, 82, "3"], [120, 132, "4"], [220, 132, "5"]],
      edges: [[0, 1], [0, 2], [1, 3], [1, 4]], note: "ildizdan barggacha yagona yo‘l" }) },
  { any: ["dinamik", "dp", "knapsack", "lis", "lcs"], spec: () => ({
      kind: "table", label: "DP jadvali: katak qo‘shnilaridan hisoblanadi",
      rows: [[0, 0, 0, 0], [0, 1, 1, 1], [0, 1, 2, 2]], hi: [2, 3],
      note: "dp[i][j] = f(dp[i−1][j], dp[i][j−1])" }) },
  { any: ["murakkablik", "big o", "baholash", "amortiz"], spec: () => ({
      kind: "curve", label: "O‘sish tezligi: n katta bo‘lganda farq keskin" }) },
  { any: ["tub", "g‘alvir", "sieve"], spec: () => ({
      kind: "array", label: "G‘alvir: karralilar o‘chiriladi, tublar qoladi",
      values: [2, 3, 4, 5, 6, 7, 8, 9], hi: [0, 1, 3, 5], note: "qolganlari — tub sonlar" }) },
  { any: ["modul", "qoldiq", "daraja"], spec: () => ({
      kind: "flow", label: "Modul arifmetikasi: har amaldan keyin qoldiq",
      steps: ["a·b", "% mod", "natija"], note: "aks holda son sig‘maydi" }) },
  { any: ["kombinator", "ehtimol"], spec: () => ({
      kind: "table", label: "Paskal uchburchagi: C(n,k) qo‘shnilardan",
      rows: [[1, "", "", ""], [1, 1, "", ""], [1, 2, 1, ""], [1, 3, 3, 1]], hi: [3, 1],
      note: "C(n,k) = C(n−1,k−1) + C(n−1,k)" }) },
  { any: ["ochko‘z", "greedy", "interval", "rejalash"], spec: () => ({
      kind: "array", label: "Ochko‘z tanlov: eng erta tugaydiganini olamiz",
      values: ["[1,3]", "[2,5]", "[4,7]", "[6,9]"], hi: [0, 2], note: "kesishganlari tashlanadi" }) },
  { any: ["geometr", "vektor", "nuqta", "qavariq", "yuz"], spec: () => ({
      kind: "graph", label: "Vektor ko‘paytmasi burilish tomonini aytadi",
      nodes: [[120, 118, "A"], [280, 44, "B"], [430, 96, "C"]],
      edges: [[0, 1], [1, 2]], note: "cross < 0 → soat yo‘nalishi" }) },
  { any: ["xesh", "hash", "map", "set", "chastota"], spec: () => ({
      kind: "tworow", label: "Xesh jadval: kalit → qiymat",
      top: ["a", "b", "c", "d"], bottom: [3, 1, 4, 1], topName: "kalit", bottomName: "soni",
      hi: [0, 2], note: "o‘rtacha O(1) da topiladi" }) },
  { any: ["panjara", "grid", "flood", "labirint"], spec: () => ({
      kind: "grid", label: "Panjara: '#' devor, '•' o‘tilgan katak",
      rows: ["*...#", "*##.#", "***.."], note: "faqat 4 tomonga yurish mumkin" }) },
  { any: ["bit", "xor", "mask"], spec: () => ({
      kind: "array", label: "Bitlar: har razryad alohida bayroq",
      values: [1, 1, 0, 1], hi: [0, 1, 3], note: "13 = 1101₂ — uchta bir" }) },
];

const FALLBACK: Record<string, Spec> = {
  "programming-basics": { kind: "flow", label: "Dastur oqimi: kirish → hisoblash → chiqish", steps: ["stdin", "hisob", "stdout"] },
  foundations: { kind: "curve", label: "O‘sish tezligi: murakkablikni baholash" },
  "advanced-cp": { kind: "table", label: "Murakkab texnika: holat va o‘tishlar jadvali", rows: [[0, 1, 1], [1, 2, 3], [1, 3, 6]], hi: [2, 2] },
};

/** A diagram for this unit, or null when nothing matches. */
export function specForUnit(unitTitle: string, roadmapSlug: string): Spec | null {
  const t = unitTitle.toLowerCase();
  for (const rule of RULES) if (rule.any.some(k => t.includes(k))) return rule.spec(unitTitle);
  return FALLBACK[roadmapSlug] || null;
}
