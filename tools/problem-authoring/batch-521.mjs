/* Batch 521 — twelve problems at 1000, A521–A532.
 *
 * The duel picks a round's problem by distance from a target rating, and the
 * targets of most duels land between 1000 and 1400 (4644 rounds by
 * 2026-10-17; 1000 alone served 671 of them from 30 problems). This batch and
 * the next four fill those levels first.
 *
 * Every task is a well-known contest problem restated for AlgoYo'l in our own
 * words, with our own samples. Ratings follow the Codeforces scale.
 */
import { line, many } from "./gen-lib.mjs";

const P = [];
const multi = (cases) => cases.length + "\n" + cases.join("");

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A521", judge: "math-flagstones-cover", topic: "math", rating: 1000,
  tag: "Formulas", timeLimitMs: 1000,
  uz: "Maydonni tosh bilan qoplash",
  en: "Paving the square",
  statementUz: "Shahar maydoni n × m metr o‘lchamdagi to‘g‘ri to‘rtburchak shaklida. Uni tomoni a metr bo‘lgan kvadrat toshlar bilan to‘liq qoplash kerak. Toshlarni sindirib bo‘lmaydi, lekin ular maydon chetidan chiqib turishi mumkin; har bir tosh tomonlari maydon tomonlariga parallel qilib yotqiziladi. Butun maydonni qoplash uchun eng kami bilan nechta tosh kerak?",
  statementEn: "A city square is a rectangle of n × m metres. It has to be paved completely with square flagstones whose side is a metres. A flagstone cannot be broken, but it may stick out past the edge of the square; every flagstone is laid with its sides parallel to the sides of the square. What is the smallest number of flagstones that covers the whole square?",
  inputUz: "Yagona qatorda uchta butun son n, m va a beriladi.",
  inputEn: "A single line contains three integers n, m and a.",
  outputUz: "Yagona butun sonni chiqaring — kerakli toshlarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of flagstones needed.",
  constraintList: ["1 ≤ n, m, a ≤ 10^9", "a flagstone cannot be broken", "flagstones may stick out past the edge", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n, m, a ≤ 10^9", "toshni sindirib bo‘lmaydi", "toshlar chetdan chiqib turishi mumkin", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["6 6 4\n", "10 3 5\n"],
  expect: ["4\n", "2\n"],
  sampleNotesUz: [
    "Har bir tomon bo‘ylab ikkita tosh kerak: bitta tosh 4 metrni qoplaydi, qolgan 2 metrga ikkinchisi yotqiziladi. Jami 2 · 2 = 4.",
    "Uzunligi 10 bo‘lgan tomonga 2 ta tosh, 3 metrli tomonga bitta tosh yetadi, jami 2 ta.",
  ],
  sampleNotesEn: [
    "Two flagstones are needed along each side: one covers 4 metres and a second covers the remaining 2. That is 2 · 2 = 4.",
    "The 10-metre side takes 2 flagstones and the 3-metre side takes one, so 2 in total.",
  ],
  testInputs: ["6 6 4\n", "10 3 5\n", "1 1 1\n", "1 1 1000000000\n", "1000000000 1000000000 1\n", "1000000000 1000000000 999999999\n", "7 13 3\n", "12 8 4\n", "999999999 1 2\n"],
  sol: `long long n,m,a;cin>>n>>m>>a;
cout<<((n+a-1)/a)*((m+a-1)/a)<<"\\n";`,
  wrongNote: "Dividing the area by a flagstone's area forgets that a flagstone cut off by an edge still counts whole; int arithmetic overflows at the largest square.",
  wrong: [
    `long long n,m,a;cin>>n>>m>>a;
cout<<(n*m+a*a-1)/(a*a)<<"\\n";`,
    `int n,m,a;cin>>n>>m>>a;
cout<<((n+a-1)/a)*((m+a-1)/a)<<"\\n";`,
  ],
  gen: (r) => line([r.int(1, 40), r.int(1, 40), r.int(1, 15)]) + "\n",
  slow: [`long long n,m,a;cin>>n>>m>>a;long long x=0,y=0;
for(long long p=0;p<n;p+=a)++x;for(long long p=0;p<m;p+=a)++y;
cout<<x*y<<"\\n";`],
  big: [
    { seed: 1, note: "side 1: a step-by-step count makes 10^9 steps", code: `return "1000000000 1000000000 1"` },
    { seed: 2, note: "random large", code: `return line([r.int(10**8, 10**9), r.int(10**8, 10**9), r.int(1, 3)])` },
  ],
});

P.push({
  id: "A522", judge: "ring-road-errands", topic: "foundations", rating: 1000,
  tag: "Simulation", timeLimitMs: 1000,
  uz: "Aylana yo‘ldagi topshiriqlar",
  en: "Errands on a ring road",
  statementUz: "Aylana yo‘l bo‘yida n ta uy turibdi, ular soat mili yo‘nalishida 1 dan n gacha raqamlangan. Bir uydan soat mili bo‘yicha keyingi uyga o‘tish bir daqiqa oladi, n-uydan keyingi uy esa 1-uy. Yo‘lda harakat bir tomonlama — faqat soat mili yo‘nalishida yurish mumkin. Siz 1-uyda turibsiz va m ta topshiriqni berilgan tartibda bajarishingiz kerak: i-topshiriq a_i-uyda bajariladi. Agar siz allaqachon kerakli uyda bo‘lsangiz, yurish shart emas. Barcha topshiriqlarni bajarish uchun jami necha daqiqa yurish kerak?",
  statementEn: "n houses stand along a ring road, numbered 1 to n clockwise. Moving from a house to the next one clockwise takes one minute, and the house after house n is house 1. Traffic on the road is one-way, so you may only move clockwise. You start at house 1 and have m errands to run in the given order: errand i is done at house a_i. If you are already at the right house, no walking is needed. How many minutes of walking does it take to finish all the errands?",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda m ta son a_1, …, a_m keladi.",
  inputEn: "The first line contains n and m. The second line contains the m numbers a_1, …, a_m.",
  outputUz: "Yagona butun sonni chiqaring — jami yurish vaqti daqiqalarda.",
  outputEn: "Print a single integer — the total walking time in minutes.",
  constraintList: ["2 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "1 ≤ a_i ≤ n", "the answer can exceed 2^31"],
  constraintListUz: ["2 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "1 ≤ a_i ≤ n", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["4 3\n3 2 3\n", "4 3\n2 3 3\n"],
  expect: ["6\n", "2\n"],
  sampleNotesUz: [
    "1 → 3 ikki daqiqa. 3 → 2 ga orqaga yurib bo‘lmaydi, shuning uchun 3 → 4 → 1 → 2, uch daqiqa. 2 → 3 bir daqiqa. Jami 6.",
    "1 → 2 va 2 → 3 bir daqiqadan. Uchinchi topshiriq ham 3-uyda, u uchun yurish shart emas. Jami 2.",
  ],
  sampleNotesEn: [
    "1 → 3 takes two minutes. You cannot go back from 3 to 2, so you go 3 → 4 → 1 → 2, three minutes. 2 → 3 takes one. That is 6.",
    "1 → 2 and 2 → 3 take a minute each. The third errand is at house 3 as well and needs no walking. That is 2.",
  ],
  testInputs: ["4 3\n3 2 3\n", "4 3\n2 3 3\n", "2 1\n1\n", "2 1\n2\n", "5 5\n5 1 5 1 5\n", "10 4\n1 1 1 1\n", "6 6\n6 5 4 3 2 1\n", "7 3\n7 7 1\n"],
  sol: `long long n;int m;cin>>n>>m;long long cur=1,t=0;
for(int i=0;i<m;++i){long long a;cin>>a;t+=(a>=cur)?a-cur:n-cur+a;cur=a;}
cout<<t<<"\\n";`,
  wrongNote: "Taking (a − cur) mod n in C++ leaves negative steps negative; going a whole lap when the next errand is at the current house adds n minutes that are never walked.",
  wrong: [
    `long long n;int m;cin>>n>>m;long long cur=1,t=0;
for(int i=0;i<m;++i){long long a;cin>>a;t+=(a-cur)%n;cur=a;}
cout<<t<<"\\n";`,
    `long long n;int m;cin>>n>>m;long long cur=1,t=0;
for(int i=0;i<m;++i){long long a;cin>>a;t+=(a>cur)?a-cur:n-cur+a;cur=a;}
cout<<t<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(2, 9), m = r.int(1, 9); return line([n, m]) + "\n" + line(r.ints(m, 1, n)) + "\n"; },
  slow: [`long long n;int m;cin>>n>>m;long long cur=1,t=0;
for(int i=0;i<m;++i){long long a;cin>>a;while(cur!=a){cur=cur%n+1;++t;}}
cout<<t<<"\\n";`],
  big: [
    { seed: 1, note: "2, 1, 2, 1, …: every other errand is a full lap", code: `n = m = 100000\nreturn line([n, m]) + "\\n" + line([2 if i % 2 == 0 else 1 for i in range(m)])` },
    { seed: 2, note: "random", code: `n = m = 100000\nreturn line([n, m]) + "\\n" + line(r.ints(m, 1, n))` },
    { seed: 3, note: "always the house just behind", code: `n = m = 100000\nreturn line([n, m]) + "\\n" + line([(n - i % n) for i in range(m)])` },
  ],
});

P.push({
  id: "A523", judge: "stairs-moves-multiple", topic: "math", rating: 1000,
  tag: "Arithmetic", timeLimitMs: 1000,
  uz: "Qadamlar soni karrali bo‘lsin",
  en: "A number of moves divisible by m",
  statementUz: "Zinapoyada n ta pog‘ona bor. Bitta harakatda siz bir yoki ikki pog‘ona yuqoriga ko‘tarilasiz. Siz aynan n-pog‘onaga chiqmoqchisiz, va bunda qilingan harakatlar soni m ga karrali bo‘lishi kerak. Shunday harakatlar sonining eng kichigini toping. Agar harakatlar soni m ga karrali bo‘lib, aynan n-pog‘onaga chiqishning iloji bo‘lmasa, -1 chiqaring. Har bir so‘rov alohida yechiladi.",
  statementEn: "A staircase has n steps. With one move you climb either one step or two steps. You want to finish exactly on step n, and the number of moves you make must be a multiple of m. Find the smallest such number of moves. If no number of moves that is a multiple of m ends exactly on step n, print -1. Each query is answered on its own.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida n va m sonlari keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains n and m.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^18", "1 ≤ m ≤ 10^9", "you must stop exactly on step n"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^18", "1 ≤ m ≤ 10^9", "aynan n-pog‘onada to‘xtash kerak"],
  sampleInputs: ["3\n10 2\n3 5\n5 2\n"],
  expect: ["6\n-1\n4\n"],
  sampleNotesUz: [
    "10 pog‘onaga 5 dan 10 gacha istalgan sondagi harakat bilan chiqish mumkin; ulardan 2 ga karralisining eng kichigi 6. 3 pog‘onaga 2 yoki 3 harakatda chiqiladi, hech biri 5 ga karrali emas. 5 pog‘onaga kamida 3 harakat kerak, 2 ga karrali eng kichik son 4.",
  ],
  sampleNotesEn: [
    "Ten steps can be climbed in any number of moves from 5 to 10, and the smallest even one is 6. Three steps take 2 or 3 moves, neither a multiple of 5. Five steps take at least 3 moves, and the smallest even number of moves from there is 4.",
  ],
  testInputs: ["3\n10 2\n3 5\n5 2\n", "1\n1 1\n", "1\n1 2\n", "1\n2 2\n", "4\n7 3\n7 4\n7 5\n7 8\n", "2\n1000000000000000000 1000000000\n999999999999999999 1\n", "3\n6 6\n6 7\n9 10\n"],
  sol: `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long lo=(n+1)/2;long long k=(lo+m-1)/m*m;
cout<<(k<=n?k:-1)<<"\\n";}`,
  wrongNote: "Starting from n/2 rounded down lets an odd n be climbed in too few moves; never printing -1 claims a number of moves that overshoots the staircase.",
  wrong: [
    `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long lo=n/2;if(lo==0)lo=1;long long k=(lo+m-1)/m*m;
cout<<(k<=n?k:-1)<<"\\n";}`,
    `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long lo=(n+1)/2;long long k=(lo+m-1)/m*m;
cout<<k<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 6); let s = t + "\n"; for (let i = 0; i < t; i++) s += line([r.int(1, 30), r.int(1, 12)]) + "\n"; return s; },
  brute: `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long ans=-1;
for(long long k=1;k<=n;++k)if(2*k>=n&&k%m==0){ans=k;break;}
cout<<ans<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long k=(n+1)/2;
while(k%m)++k;cout<<(k<=n?k:-1)<<"\\n";}`],
  big: [
    { seed: 1, note: "huge n, m near 10^9: walking up to the next multiple is slow", code: `t = 10000\nrows = [line([r.int(10**17, 10**18), r.int(9*10**8, 10**9)]) for _ in range(t)]\nreturn str(t) + "\\n" + "\\n".join(rows)` },
    { seed: 2, note: "mixed sizes, many -1", code: `t = 10000\nrows = [line([r.int(1, 10**9), r.int(1, 10**9)]) for _ in range(t)]\nreturn str(t) + "\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A524", judge: "str-traffic-light-wait", topic: "strings", rating: 1000,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Svetoforda kutish",
  en: "Waiting at the traffic light",
  statementUz: "Svetofor n soniyalik siklni takrorlaydi va bu sikl s qatori bilan berilgan: har siklning i-soniyasida svetofor s_i rangni ko‘rsatadi — r qizil, y sariq, g yashil; n-soniyadan keyin sikl yana birinchi soniyadan boshlanadi. Siz kelganingizda svetofor c rangni ko‘rsatyapti, lekin siklning qaysi soniyasi ekanini bilmaysiz. Agar hozir i-soniya bo‘lsa, siz i-soniyadan boshlab (sikl aylanib o‘tishini hisobga olgan holda) birinchi yashil j-soniyagacha kutasiz, kutish vaqti j − i soniya; hozir yashil bo‘lsa, kutish 0. s_i = c bo‘lgan barcha i lar bo‘yicha kutish vaqtining eng kattasini toping — shuncha kutsangiz, albatta o‘ta olasiz.",
  statementEn: "A traffic light repeats a cycle of n seconds described by a string s: in the i-th second of every cycle it shows colour s_i — r for red, y for yellow, g for green — and after the n-th second the cycle starts over from the first. When you arrive the light shows colour c, but you do not know which second of the cycle it is. If it is second i, you wait until the first green second j at or after i, going round the cycle if necessary, which takes j − i seconds; if it is green now, the wait is 0. Find the largest such wait over all seconds i with s_i = c — after that long you are sure to cross.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n va c rang harfi, ikkinchisida n uzunlikdagi s qatori.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n and the letter c, the second the string s of length n.",
  outputUz: "Har bir test uchun alohida qatorda eng uzun kutish vaqtini chiqaring.",
  outputEn: "For each test case print the longest wait on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "s consists of r, y and g and contains at least one g", "c is one of r, y, g and occurs in s"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "s faqat r, y va g harflaridan iborat va kamida bitta g bor", "c — r, y yoki g, va u s da uchraydi"],
  sampleInputs: ["3\n5 r\nrggry\n1 g\ng\n3 r\nrrg\n"],
  expect: ["3\n0\n2\n"],
  sampleNotesUz: [
    "Birinchi testda qizil 1- va 4-soniyalarda. 1-soniyadan keyingi yashil 2-soniyada (1 soniya kutish), 4-soniyadan esa sikl aylanib keyingi yashil yana 2-soniyada — 3 soniya. Javob 3. Ikkinchi testda svetofor doim yashil. Uchinchi testda 1-soniyadan 2 soniya, 2-soniyadan 1 soniya kutiladi.",
  ],
  sampleNotesEn: [
    "In the first test red is shown in seconds 1 and 4. From second 1 the next green is second 2, a wait of 1; from second 4 the cycle wraps round and the next green is second 2 again, a wait of 3. The answer is 3. In the second test the light is always green. In the third, second 1 waits 2 seconds and second 2 waits 1.",
  ],
  testInputs: ["3\n5 r\nrggry\n1 g\ng\n3 r\nrrg\n", "1\n4 y\nygyy\n", "1\n6 r\ngrrrrr\n", "2\n5 y\nyrrrg\n5 g\nrgrgr\n", "1\n7 r\nrgrrgrr\n"],
  sol: `int t;cin>>t;while(t--){int n;char c;string s;cin>>n>>c>>s;string d=s+s;int nxt=INT_MAX,best=0;
for(int i=2*n-1;i>=0;--i){if(d[i]=='g')nxt=i;if(i<n&&d[i]==c)best=max(best,nxt-i);}
cout<<best<<"\\n";}`,
  wrongNote: "Looking only forward to the end of the string misses the green that comes after the cycle wraps; taking the shortest wait answers a different question.",
  wrong: [
    `int t;cin>>t;while(t--){int n;char c;string s;cin>>n>>c>>s;int nxt=-1,best=0;
for(int i=n-1;i>=0;--i){if(s[i]=='g')nxt=i;if(s[i]==c&&nxt>=0)best=max(best,nxt-i);}
cout<<best<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;char c;string s;cin>>n>>c>>s;string d=s+s;int nxt=INT_MAX,best=INT_MAX;
for(int i=2*n-1;i>=0;--i){if(d[i]=='g')nxt=i;if(i<n&&d[i]==c)best=min(best,nxt-i);}
cout<<best<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 4); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(1, 9); let w = r.str(n, "ryg"); if (!w.includes("g")) w = w.slice(0, -1) + "g"; const c = w[r.int(0, n - 1)]; s += n + " " + c + "\n" + w + "\n"; } return s; },
  slow: [`int t;cin>>t;while(t--){int n;char c;string s;cin>>n>>c>>s;int best=0;
for(int i=0;i<n;++i)if(s[i]==c){int k=0;while(s[(i+k)%n]!='g')++k;best=max(best,k);}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "one green at the very end: walking forward from every red is quadratic", code: `n = 200000\nreturn "1\\n" + str(n) + " r\\n" + "r" * (n - 1) + "g"` },
    { seed: 2, note: "random colours", code: `n = 200000\ns = text(r, n - 1, "rry") + "g"\nreturn "1\\n" + str(n) + " " + s[0] + "\\n" + s` },
    { seed: 3, note: "many small tests", code: `rows = []\nfor _ in range(10000):\n    n = 20\n    s = list(text(r, n, "ryg"))\n    s[r.int(0, n - 1)] = "g"\n    s = "".join(s)\n    rows.append(str(n) + " " + s[r.int(0, n - 1)] + "\\n" + s)\nreturn "10000\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A525", judge: "greedy-mice-and-cat", topic: "greedy", rating: 1000,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Sichqonlarni qutqarish",
  en: "Saving the mice",
  statementUz: "Son o‘qida 0 nuqtada mushuk, n nuqtada in turibdi, va k ta sichqon 0 dan n gacha bo‘lgan x_i nuqtalarda joylashgan. Har soniyada avval siz istalgan bitta sichqonni o‘ngga bir birlik siljitasiz; sichqon n nuqtaga yetsa, inga kirib qutqariladi. So‘ng mushuk o‘ngga bir birlik siljiydi va yangi joyidagi barcha sichqonlarni yeydi. Mushuk n nuqtaga yetganda jarayon tugaydi. Sichqonlarni to‘g‘ri tanlab siljitsangiz, eng ko‘pi bilan nechtasini qutqara olasiz?",
  statementEn: "On a number line a cat sits at point 0 and a hole is at point n, and k mice sit at points x_i strictly between them. Every second you first move one mouse of your choice one unit to the right; a mouse that reaches point n enters the hole and is safe. Then the cat moves one unit to the right and eats every mouse at its new position. The process ends when the cat reaches point n. Choosing well which mouse to move each second, what is the largest number of mice you can save?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n va k, ikkinchisida k ta son x_1, …, x_k.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n and k, the second the k numbers x_1, …, x_k.",
  outputUz: "Har bir test uchun alohida qatorda qutqarish mumkin bo‘lgan sichqonlarning eng ko‘p sonini chiqaring.",
  outputEn: "For each test case print the largest number of mice that can be saved, on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 10^9", "1 ≤ k ≤ 4·10^5, the sum of k over all tests ≤ 4·10^5", "1 ≤ x_i < n; several mice may share a point"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 10^9", "1 ≤ k ≤ 4·10^5, barcha testlar bo‘yicha k lar yig‘indisi ≤ 4·10^5", "1 ≤ x_i < n; bir nuqtada bir nechta sichqon bo‘lishi mumkin"],
  sampleInputs: ["2\n10 5\n9 5 8 1 7\n5 3\n1 1 1\n"],
  expect: ["3\n1\n"],
  sampleNotesUz: [
    "Birinchi testda inga 1, 2 va 3 qadam qolgan sichqonlarni (9, 8 va 7 nuqtalardagi) navbat bilan siljitamiz: ular 1, 3 va 6 soniyada qutqariladi, mushuk esa shu paytda 6 nuqtada. To‘rtinchisini qutqarishga vaqt yetmaydi. Ikkinchi testda bitta sichqonga 4 soniya kerak, ikkinchisiga yana 4 — mushuk ulgurib qoladi.",
  ],
  sampleNotesEn: [
    "In the first test move the mice that are 1, 2 and 3 steps from the hole (at 9, 8 and 7) one after another: they are safe after 1, 3 and 6 seconds, while the cat has reached 6. There is no time for a fourth. In the second test one mouse needs 4 seconds and another would need 4 more; the cat gets there first.",
  ],
  testInputs: ["2\n10 5\n9 5 8 1 7\n5 3\n1 1 1\n", "1\n10 2\n9 1\n", "1\n2 3\n1 1 1\n", "1\n100 4\n99 99 99 99\n", "1\n7 6\n6 5 4 3 2 1\n", "3\n20 3\n10 15 19\n4 1\n3\n9 2\n4 4\n"],
  sol: `int t;cin>>t;while(t--){long long n;int k;cin>>n>>k;vector<long long>d(k);for(auto&x:d){cin>>x;x=n-x;}
sort(d.begin(),d.end());long long s=0;int c=0;for(auto x:d){if(s+x<n){s+=x;++c;}else break;}
cout<<c<<"\\n";}`,
  wrongNote: "Letting the total reach n exactly saves a mouse the cat has already caught; moving the mice farthest from the hole first spends the time on the hardest ones.",
  wrong: [
    `int t;cin>>t;while(t--){long long n;int k;cin>>n>>k;vector<long long>d(k);for(auto&x:d){cin>>x;x=n-x;}
sort(d.begin(),d.end());long long s=0;int c=0;for(auto x:d){if(s+x<=n){s+=x;++c;}else break;}
cout<<c<<"\\n";}`,
    `int t;cin>>t;while(t--){long long n;int k;cin>>n>>k;vector<long long>d(k);for(auto&x:d){cin>>x;x=n-x;}
sort(d.rbegin(),d.rend());long long s=0;int c=0;for(auto x:d){if(s+x<n){s+=x;++c;}else break;}
cout<<c<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 3); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(2, 9), k = r.int(1, 4); s += line([n, k]) + "\n" + line(r.ints(k, 1, n - 1)) + "\n"; } return s; },
  brute: `int t;cin>>t;while(t--){int n,k;cin>>n>>k;vector<int>x(k);for(auto&v:x)cin>>v;
function<int(int,vector<int>)>go=[&](int cat,vector<int>p)->int{
 if(cat>=n||p.empty())return 0;int best=0;
 for(size_t i=0;i<p.size();++i){vector<int>q=p;int saved=0;q[i]++;if(q[i]==n){saved=1;q.erase(q.begin()+i);}
  int c2=cat+1;vector<int>r2;for(int v:q)if(v!=c2)r2.push_back(v);
  best=max(best,saved+go(c2,r2));}
 return best;};
cout<<go(0,x)<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){long long n;int k;cin>>n>>k;vector<long long>d(k);for(auto&x:d){cin>>x;x=n-x;}
vector<char>used(k,0);long long s=0;int c=0;
for(int it=0;it<k;++it){int b=-1;for(int i=0;i<k;++i)if(!used[i]&&(b<0||d[i]<d[b]))b=i;if(s+d[b]<n){s+=d[b];++c;used[b]=1;}else break;}
cout<<c<<"\\n";}`],
  big: [
    { seed: 1, note: "every mouse next to the hole: all are saved, a repeated scan is quadratic", code: `k = 300000\nreturn "1\\n" + line([10**9, k]) + "\\n" + line([10**9 - 1] * k)` },
    { seed: 2, note: "random positions", code: `k = 300000\nreturn "1\\n" + line([10**9, k]) + "\\n" + line(r.ints(k, 1, 10**9 - 1))` },
    { seed: 3, note: "many tests", code: `rows = []\nfor _ in range(10000):\n    n = r.int(2, 100)\n    rows.append(line([n, 40]) + "\\n" + line(r.ints(40, 1, n - 1)))\nreturn "10000\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A526", judge: "str-stripe-min-repaint", topic: "strings", rating: 1000,
  tag: "Sliding window", timeLimitMs: 1000,
  uz: "Qora yo‘lak",
  en: "A black stripe",
  statementUz: "n katakdan iborat tasma berilgan, har bir katak oq (W) yoki qora (B). Bitta amalda istalgan bitta oq katakni qora rangga bo‘yash mumkin. Tasmada ketma-ket joylashgan k ta katak hammasi qora bo‘lishi uchun eng kami bilan nechta amal kerak? Qora kataklarni oqqa bo‘yash mumkin emas va kerak ham emas, kataklar o‘rnini almashtirish ham mumkin emas.",
  statementEn: "A strip of n cells is given, each cell white (W) or black (B). In one operation you may paint any one white cell black. What is the smallest number of operations after which the strip contains k consecutive cells that are all black? Black cells cannot be painted white, and there is no need to; cells cannot be moved either.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n va k, ikkinchisida n uzunlikdagi W va B harflaridan iborat qator.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n and k, the second a string of n letters W and B.",
  outputUz: "Har bir test uchun alohida qatorda eng kam amallar sonini chiqaring.",
  outputEn: "For each test case print the smallest number of operations on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ k ≤ n ≤ 2·10^5", "the sum of n over all tests ≤ 2·10^5", "the string consists only of W and B"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ k ≤ n ≤ 2·10^5", "barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "qator faqat W va B harflaridan iborat"],
  sampleInputs: ["3\n5 3\nBBWBW\n5 5\nBBWBW\n1 1\nB\n"],
  expect: ["1\n2\n0\n"],
  sampleNotesUz: [
    "Birinchi testda dastlabki uch katak BBW — bitta oqni bo‘yash yetarli. Ikkinchi testda butun tasma qora bo‘lishi kerak, unda ikkita oq katak bor. Uchinchi testda yagona katak allaqachon qora.",
  ],
  sampleNotesEn: [
    "In the first test the first three cells are BBW, so painting one white cell is enough. In the second the whole strip must be black and it has two white cells. In the third the only cell is black already.",
  ],
  testInputs: ["3\n5 3\nBBWBW\n5 5\nBBWBW\n1 1\nB\n", "1\n4 2\nWWBB\n", "1\n1 1\nW\n", "1\n8 3\nWBWWBWBW\n", "2\n6 1\nWWWWWW\n6 4\nBWBWBB\n"],
  sol: `int t;cin>>t;while(t--){int n,k;string s;cin>>n>>k>>s;int w=0,best;
for(int i=0;i<k;++i)w+=s[i]=='W';best=w;
for(int i=k;i<n;++i){w+=s[i]=='W';w-=s[i-k]=='W';best=min(best,w);}
cout<<best<<"\\n";}`,
  wrongNote: "Stopping the window one step early never looks at the last k cells; counting from the longest black run assumes the best stripe must contain it.",
  wrong: [
    `int t;cin>>t;while(t--){int n,k;string s;cin>>n>>k>>s;int w=0,best;
for(int i=0;i<k;++i)w+=s[i]=='W';best=w;
for(int i=k;i<n-1;++i){w+=s[i]=='W';w-=s[i-k]=='W';best=min(best,w);}
cout<<best<<"\\n";}`,
    `int t;cin>>t;while(t--){int n,k;string s;cin>>n>>k>>s;int run=0,longest=0;
for(char c:s){run=(c=='B')?run+1:0;longest=max(longest,run);}
cout<<max(0,k-longest)<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 4); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(1, 10), k = r.int(1, n); s += line([n, k]) + "\n" + r.str(n, "WB") + "\n"; } return s; },
  slow: [`int t;cin>>t;while(t--){int n,k;string s;cin>>n>>k>>s;int best=INT_MAX;
for(int i=0;i+k<=n;++i){int w=0;for(int j=i;j<i+k;++j)w+=s[j]=='W';best=min(best,w);}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "k = n/2: recounting each window is quadratic", code: `n = 200000\nreturn "1\\n" + line([n, n // 2]) + "\\n" + text(r, n, "WB")` },
    { seed: 2, note: "mostly white", code: `n = 200000\nreturn "1\\n" + line([n, 70000]) + "\\n" + text(r, n, "WWWWWWWB")` },
    { seed: 3, note: "many tests", code: `rows = []\nfor _ in range(10000):\n    n = 20\n    rows.append(line([n, r.int(1, n)]) + "\\n" + text(r, n, "WB"))\nreturn "10000\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A527", judge: "str-split-max-distinct", topic: "strings", rating: 1000,
  tag: "Prefix counts", timeLimitMs: 1000,
  uz: "Ikkiga bo‘lib, harflarni sanash",
  en: "Split and count the letters",
  statementUz: "Kichik lotin harflaridan iborat s qatori berilgan. Uni ikkita bo‘sh bo‘lmagan qismga bo‘lish kerak: s = a + b, ya'ni a — s ning boshlanishi, b — qolgan qismi. f(x) deb x qatorida uchraydigan turli harflar sonini belgilaymiz. f(a) + f(b) ning eng katta qiymatini toping. Harflarning qaysi qismda necha marta uchrashi muhim emas — faqat turli harflar soni sanaladi.",
  statementEn: "You are given a string s of lowercase Latin letters. It has to be split into two non-empty parts, s = a + b, so that a is a beginning of s and b is the rest. Let f(x) be the number of different letters occurring in the string x. Find the largest possible value of f(a) + f(b). How many times a letter occurs in a part does not matter — only the number of different letters counts.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n — qator uzunligi, ikkinchisida s qatori.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the length of the string, and the second the string s.",
  outputUz: "Har bir test uchun alohida qatorda f(a) + f(b) ning eng katta qiymatini chiqaring.",
  outputEn: "For each test case print the largest value of f(a) + f(b) on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 2·10^5", "the sum of n over all tests ≤ 2·10^5", "both parts must be non-empty"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 2·10^5", "barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "ikkala qism ham bo‘sh bo‘lmasligi kerak"],
  sampleInputs: ["3\n2\naa\n7\nabcabcd\n5\nabcba\n"],
  expect: ["2\n7\n5\n"],
  sampleNotesUz: [
    "aa → a + a, har birida bitta harf. abcabcd → abc + abcd, 3 + 4 = 7. abcba → ab + cba yoki abc + ba, ikkalasida ham 5.",
  ],
  sampleNotesEn: [
    "aa → a + a, one letter each. abcabcd → abc + abcd, 3 + 4 = 7. abcba → ab + cba or abc + ba, 5 either way.",
  ],
  testInputs: ["3\n2\naa\n7\nabcabcd\n5\nabcba\n", "1\n3\nabb\n", "1\n2\nab\n", "1\n6\nzzzzzz\n", "1\n10\nabcdefghij\n", "2\n8\nabababab\n9\nqwertyqwe\n"],
  sol: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;vector<int>suf(n+1,0);int seen[26]={0},d=0;
for(int i=n-1;i>=0;--i){if(!seen[s[i]-'a']++)++d;suf[i]=d;}
int pre[26]={0},p=0,best=0;
for(int i=0;i+1<n;++i){if(!pre[s[i]-'a']++)++p;best=max(best,p+suf[i+1]);}
cout<<best<<"\\n";}`,
  wrongNote: "Skipping the last cut never tries a one-letter right part; cutting only in the middle gives one split of many.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;vector<int>suf(n+1,0);int seen[26]={0},d=0;
for(int i=n-1;i>=0;--i){if(!seen[s[i]-'a']++)++d;suf[i]=d;}
int pre[26]={0},p=0,best=0;
for(int i=0;i+2<n;++i){if(!pre[s[i]-'a']++)++p;best=max(best,p+suf[i+1]);}
if(n==2)best=2;cout<<best<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int h=n/2;set<char>a(s.begin(),s.begin()+h),b(s.begin()+h,s.end());
cout<<a.size()+b.size()<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 4); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(2, 10); s += n + "\n" + r.str(n, "abcd") + "\n"; } return s; },
  slow: [`int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int best=0;
for(int i=1;i<n;++i){set<char>a(s.begin(),s.begin()+i),b(s.begin()+i,s.end());best=max(best,(int)(a.size()+b.size()));}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "one long string: recounting each split is quadratic", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "abcdefghijklmnopqrstuvwxyz")` },
    { seed: 2, note: "few letters", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "ab")` },
    { seed: 3, note: "many tests", code: `rows = []\nfor _ in range(10000):\n    rows.append("20\\n" + text(r, 20, "abcdefghij"))\nreturn "10000\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A528", judge: "split-pile-reach-m", topic: "backtracking", rating: 1000,
  tag: "Recursion", timeLimitMs: 1000,
  uz: "Uyumni bo‘lish",
  en: "Splitting the pile",
  statementUz: "Boshida n ta toshdan iborat bitta uyum bor. Bitta amalda toshlar soni 3 ga bo‘linadigan istalgan uyumni tanlab, uni ikkita uyumga bo‘lish mumkin: birida uyumdagi toshlarning uchdan biri, ikkinchisida uchdan ikkisi bo‘ladi. Amallarni istalgancha (nol marta ham) bajarish mumkin. Biror paytda aynan m ta toshdan iborat uyum hosil qilish mumkinmi? Boshlang‘ich uyumning o‘zi ham hisobga olinadi.",
  statementEn: "There is one pile of n stones. In one operation you may take any pile whose number of stones is divisible by 3 and split it into two piles: one with a third of its stones and one with the other two thirds. You may perform any number of operations, including none. Can a pile of exactly m stones appear at some moment? The starting pile itself counts.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Keyingi t ta qatorning har birida n va m sonlari keladi.",
  inputEn: "The first line contains the number of test cases t. Each of the next t lines contains n and m.",
  outputUz: "Har bir test uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each test case print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 1000", "1 ≤ n, m ≤ 10^7", "only a pile divisible by 3 can be split", "zero operations are allowed"],
  constraintListUz: ["1 ≤ t ≤ 1000", "1 ≤ n, m ≤ 10^7", "faqat 3 ga bo‘linadigan uyumni bo‘lish mumkin", "nol marta amal bajarish ham mumkin"],
  sampleInputs: ["4\n6 4\n9 4\n4 2\n5 5\n"],
  expect: ["YES\nYES\nNO\nYES\n"],
  sampleNotesUz: [
    "6 → 2 + 4. 9 → 3 + 6, keyin 6 → 2 + 4. 4 ta toshni 3 ga bo‘lib bo‘lmaydi, demak 2 hosil bo‘lmaydi. 5 = 5, amal shart emas.",
  ],
  sampleNotesEn: [
    "6 → 2 + 4. 9 → 3 + 6, then 6 → 2 + 4. A pile of 4 cannot be split, so 2 never appears. 5 is already there with no operation.",
  ],
  testInputs: ["4\n6 4\n9 4\n4 2\n5 5\n", "1\n27 3\n", "1\n3 5\n", "3\n1 1\n1 2\n2 1\n", "2\n4782969 1\n4782969 2\n", "3\n10000000 10000000\n9565938 4\n6561 1024\n"],
  sol: `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;bool ok=false;
long long p3=1;for(int i=0;!ok&&n%p3==0;++i,p3*=3){long long v=n/p3;
 for(int j=0;j<=i;++j,v*=2)if(v==m){ok=true;break;}}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Following only the larger part loses every pile that needs a third first; demanding at least one split misses the case where the pile already has m stones.",
  wrong: [
    `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;bool ok=false;
while(true){if(n==m){ok=true;break;}if(n<m||n%3)break;n=n/3*2;}
cout<<(ok?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;function<bool(long long,long long)>can=[&](long long n,long long m)->bool{
 if(n<m||n%3)return false;long long a=n/3,b=n/3*2;if(a==m||b==m)return true;return can(a,m)||can(b,m);};
while(t--){long long n,m;cin>>n>>m;cout<<(can(n,m)?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 5); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.pick([r.int(1, 200), 3 ** r.int(0, 5) * r.int(1, 4)]); s += line([n, r.int(1, Math.max(1, n))]) + "\n"; } return s; },
  brute: `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;set<long long>seen;vector<long long>st={n};bool ok=false;
while(!st.empty()){long long x=st.back();st.pop_back();if(x==m)ok=true;if(seen.count(x))continue;seen.insert(x);if(x%3==0){st.push_back(x/3);st.push_back(x/3*2);}}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  big: [
    { seed: 1, note: "3^14 splits furthest; small m that never appears", code: `return "1000\\n" + "\\n".join(line([3**14 * 2, 5]) for _ in range(1000))` },
    { seed: 2, note: "random", code: `return "1000\\n" + "\\n".join(line([r.int(1, 10**7), r.int(1, 10**5)]) for _ in range(1000))` },
  ],
});

P.push({
  id: "A529", judge: "ski-cold-segments", topic: "two-pointers", rating: 1000,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Chang‘i ta'tili",
  en: "A skiing holiday",
  statementUz: "Ob-havo bashorati n kun uchun berilgan: i-kun harorat a_i daraja bo‘ladi. Siz ketma-ket kelgan kamida k kunlik ta'til rejalashtirmoqchisiz, va ta'tilning har bir kunida harorat q darajadan oshmasligi kerak. Ta'til kunlarini — ya'ni boshlanish va tugash kunlarini — tanlashning nechta usuli bor? Ikki usul boshlanish yoki tugash kuni bilan farq qilsa, ular turlicha hisoblanadi.",
  statementEn: "A forecast is given for n days: on day i the temperature will be a_i degrees. You want to plan a holiday of consecutive days lasting at least k days, and on every day of the holiday the temperature must not exceed q degrees. In how many ways can the holiday — its first and its last day — be chosen? Two ways are different if they start or end on different days.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, k va q, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, k and q, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda usullar sonini chiqaring.",
  outputEn: "For each test case print the number of ways on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ k ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "−10^9 ≤ a_i, q ≤ 10^9", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ k ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "−10^9 ≤ a_i, q ≤ 10^9", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["2\n6 2 5\n3 6 4 5 1 7\n5 1 0\n-1 2 -3 -4 0\n"],
  expect: ["3\n7\n"],
  sampleNotesUz: [
    "Birinchi testda 5 darajadan oshmaydigan kunlar: 1-kun, keyin 3–5-kunlar. Kamida ikki kunlik ta'til faqat 3–5-kunlar ichida: [3,4], [4,5] va [3,5]. Ikkinchi testda 1-kun alohida, 3–5-kunlar esa 6 xil ta'til beradi, jami 7.",
  ],
  sampleNotesEn: [
    "In the first test the days at most 5 degrees are day 1 and days 3–5. A holiday of two days or more fits only inside days 3–5: [3,4], [4,5] and [3,5]. In the second test day 1 gives one holiday and days 3–5 give six more, 7 in total.",
  ],
  testInputs: ["2\n6 2 5\n3 6 4 5 1 7\n5 1 0\n-1 2 -3 -4 0\n", "1\n1 1 0\n0\n", "1\n1 1 0\n1\n", "1\n5 5 10\n1 2 3 4 5\n", "1\n5 6 10\n1 2 3 4 5\n", "1\n8 3 -2\n-5 -5 -5 0 -9 -9 -9 -9\n", "1\n7 2 1000000000\n1000000000 -1000000000 1000000000 1000000000 1 1 1\n"],
  sol: `int t;cin>>t;while(t--){int n,k;long long q;cin>>n>>k>>q;long long ans=0,run=0;
for(int i=0;i<n;++i){long long a;cin>>a;run=(a<=q)?run+1:0;if(run>=k)ans+=run-k+1;}
cout<<ans<<"\\n";}`,
  wrongNote: "Counting only holidays of exactly k days misses the longer ones; a strict comparison with q throws away the days that are exactly q degrees.",
  wrong: [
    `int t;cin>>t;while(t--){int n,k;long long q;cin>>n>>k>>q;long long ans=0,run=0;
for(int i=0;i<n;++i){long long a;cin>>a;run=(a<=q)?run+1:0;if(run>=k)ans++;}
cout<<ans<<"\\n";}`,
    `int t;cin>>t;while(t--){int n,k;long long q;cin>>n>>k>>q;long long ans=0,run=0;
for(int i=0;i<n;++i){long long a;cin>>a;run=(a<q)?run+1:0;if(run>=k)ans+=run-k+1;}
cout<<ans<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 3); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(1, 10); s += line([n, r.int(1, n), r.int(-3, 3)]) + "\n" + line(r.ints(n, -5, 5)) + "\n"; } return s; },
  slow: [`int t;cin>>t;while(t--){int n,k;long long q;cin>>n>>k>>q;vector<long long>a(n);for(auto&x:a)cin>>x;long long ans=0;
for(int l=0;l<n;++l)for(int r=l;r<n&&a[r]<=q;++r)if(r-l+1>=k)++ans;
cout<<ans<<"\\n";}`],
  big: [
    { seed: 1, note: "every day cold: 2·10^10 holidays", code: `n = 200000\nreturn "1\\n" + line([n, 1, 0]) + "\\n" + line([0] * n)` },
    { seed: 2, note: "random, mostly cold", code: `n = 200000\nreturn "1\\n" + line([n, 5, 10**9 - 10]) + "\\n" + line(r.ints(n, -10**9, 10**9))` },
    { seed: 3, note: "many tests", code: `rows = []\nfor _ in range(10000):\n    rows.append(line([20, r.int(1, 20), 0]) + "\\n" + line(r.ints(20, -3, 1)))\nreturn "10000\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A530", judge: "greedy-block-deletion-score", topic: "greedy", rating: 1000,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Bloklarni o‘chirish",
  en: "Deleting the blocks",
  statementUz: "n uzunlikdagi, 0 va 1 lardan iborat s qatori hamda a va b butun sonlari berilgan. Bitta amalda qatordan bir xil belgilardan iborat ketma-ket bo‘lakni tanlab o‘chirasiz, qolgan qismlar bir-biriga ulanadi; uzunligi l bo‘lgan bo‘lakni o‘chirish a · l + b ochko beradi. Qator bo‘sh bo‘lguncha amal bajariladi. Jami ochkoning eng katta qiymatini toping. a va b manfiy bo‘lishi ham mumkin.",
  statementEn: "You are given a string s of length n made of 0s and 1s, and integers a and b. In one operation you choose a consecutive piece of s whose characters are all equal and delete it; the remaining parts are joined together. Deleting a piece of length l scores a · l + b points. You keep going until the string is empty. Find the largest possible total score. Note that a and b may be negative.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, a va b, ikkinchisida s qatori.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, a and b, the second the string s.",
  outputUz: "Har bir test uchun alohida qatorda eng katta ochkoni chiqaring.",
  outputEn: "For each test case print the largest total score on its own line.",
  constraintList: ["1 ≤ t ≤ 2000", "1 ≤ n ≤ 100", "−100 ≤ a, b ≤ 100", "the deleted piece must consist of equal characters"],
  constraintListUz: ["1 ≤ t ≤ 2000", "1 ≤ n ≤ 100", "−100 ≤ a, b ≤ 100", "o‘chiriladigan bo‘lak bir xil belgilardan iborat bo‘lishi kerak"],
  sampleInputs: ["3\n4 1 2\n0110\n5 2 -3\n10101\n3 -1 -1\n000\n"],
  expect: ["12\n1\n-4\n"],
  sampleNotesUz: [
    "Birinchi testda b musbat, shuning uchun har bir belgini alohida o‘chirgan ma'qul: 4 · (1 + 2) = 12. Ikkinchi testda avval ikkala 0 ni birma-bir o‘chirsak, 1 lar birlashib 111 bo‘ladi va u bitta amalda o‘chadi — jami 3 amal, 5 · 2 − 3 · 3 = 1; bundan kam amal bilan bo‘lmaydi. Uchinchi testda bitta amal: −3 − 1 = −4.",
  ],
  sampleNotesEn: [
    "In the first test b is positive, so every character is best deleted on its own: 4 · (1 + 2) = 12. In the second test deleting the two 0s one at a time joins the 1s into 111, which goes in one more operation — 3 operations, 5 · 2 − 3 · 3 = 1, and no fewer will do. In the third test one operation scores −3 − 1 = −4.",
  ],
  testInputs: ["3\n4 1 2\n0110\n5 2 -3\n10101\n3 -1 -1\n000\n", "1\n1 -100 -100\n1\n", "1\n6 0 -1\n010101\n", "1\n7 3 0\n0001000\n", "2\n8 -2 5\n00110011\n8 -2 -5\n00110011\n", "1\n10 1 -7\n0101010101\n"],
  sol: `int t;cin>>t;while(t--){int n,a,b;string s;cin>>n>>a>>b>>s;int blocks=1;for(int i=1;i<n;++i)if(s[i]!=s[i-1])++blocks;
int ops=(b>=0)?n:blocks/2+1;cout<<n*a+ops*b<<"\\n";}`,
  wrongNote: "Deleting every block separately uses more operations than needed when b is negative; a single operation is impossible once the string holds both characters.",
  wrong: [
    `int t;cin>>t;while(t--){int n,a,b;string s;cin>>n>>a>>b>>s;int blocks=1;for(int i=1;i<n;++i)if(s[i]!=s[i-1])++blocks;
int ops=(b>=0)?n:blocks;cout<<n*a+ops*b<<"\\n";}`,
    `int t;cin>>t;while(t--){int n,a,b;string s;cin>>n>>a>>b>>s;
int ops=(b>=0)?n:1;cout<<n*a+ops*b<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 3); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(1, 8); s += line([n, r.int(-5, 5), r.int(-5, 5)]) + "\n" + r.str(n, "01") + "\n"; } return s; },
  brute: `int t;cin>>t;while(t--){int n,a,b;string s;cin>>n>>a>>b>>s;map<string,int>memo;
function<int(const string&)>go=[&](const string&x)->int{if(x.empty())return 0;auto it=memo.find(x);if(it!=memo.end())return it->second;int best=INT_MIN;
 for(size_t i=0;i<x.size();++i)for(size_t j=i;j<x.size()&&x[j]==x[i];++j){string y=x.substr(0,i)+x.substr(j+1);best=max(best,(int)(a*(j-i+1)+b)+go(y));}
 return memo[x]=best;};
cout<<go(s)<<"\\n";}`,
});

P.push({
  id: "A531", judge: "sort-two-odd-classes-medians", topic: "sorting", rating: 1000,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Ikki sinfning medianalari",
  en: "The medians of two classes",
  statementUz: "2n ta o‘quvchi bor, i-o‘quvchining bahosi a_i. Ularni ikki sinfga taqsimlash kerak: har bir o‘quvchi aynan bitta sinfga tushadi va har bir sinfdagi o‘quvchilar soni toq. Toq sondagi baholar to‘plamining medianasi — baholar o‘sish tartibida yozilganda o‘rtada turgan baho. Ikki sinf medianalari ayirmasining moduli eng kami bilan qancha bo‘lishi mumkin? Sinflar bir xil kattalikda bo‘lishi shart emas.",
  statementEn: "There are 2n students, and student i has a grade of a_i. They are to be split into two classes so that every student is in exactly one class and each class has an odd number of students. The median of an odd number of grades is the one in the middle when the grades are written in increasing order. What is the smallest possible absolute difference between the medians of the two classes? The classes need not be the same size.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida 2n ta son a_1, …, a_2n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the 2n numbers a_1, …, a_2n.",
  outputUz: "Har bir test uchun alohida qatorda eng kichik ayirmani chiqaring.",
  outputEn: "For each test case print the smallest difference on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^5, the sum of n over all tests ≤ 10^5", "1 ≤ a_i ≤ 10^9", "both classes must have an odd number of students"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 10^5", "1 ≤ a_i ≤ 10^9", "ikkala sinfda ham o‘quvchilar soni toq bo‘lishi kerak"],
  sampleInputs: ["3\n1\n5 8\n2\n1 9 3 4\n3\n10 1 7 7 2 30\n"],
  expect: ["3\n1\n0\n"],
  sampleNotesUz: [
    "Birinchi testda har bir sinfda bittadan o‘quvchi, farq 3. Ikkinchi testda {1, 3, 9} (mediana 3) va {4}: farq 1. Uchinchi testda {1, 7, 30} va {2, 7, 10} — ikkala mediana ham 7.",
  ],
  sampleNotesEn: [
    "In the first test each class has one student and the difference is 3. In the second, {1, 3, 9} (median 3) and {4} differ by 1. In the third, {1, 7, 30} and {2, 7, 10} both have median 7.",
  ],
  testInputs: ["3\n1\n5 8\n2\n1 9 3 4\n3\n10 1 7 7 2 30\n", "1\n1\n7 7\n", "1\n2\n1 2 3 4\n", "1\n4\n8 7 6 5 4 3 2 1\n", "1\n3\n1000000000 1 1 1 1000000000 1000000000\n", "2\n2\n5 5 5 6\n3\n1 100 2 99 3 98\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(2*n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
cout<<a[n]-a[n-1]<<"\\n";}`,
  wrongNote: "Comparing the smallest grade with the middle measures the spread, not two medians; splitting the sorted list into halves takes the halves' medians, which are not the best pair.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(2*n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
cout<<a[n]-a[0]<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(2*n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
cout<<a[n+(n-1)/2]-a[(n-1)/2]<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 3); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(1, 4); s += n + "\n" + line(r.ints(2 * n, 1, 12)) + "\n"; } return s; },
  brute: `int t;cin>>t;while(t--){int n;cin>>n;int m=2*n;vector<long long>a(m);for(auto&x:a)cin>>x;long long best=LLONG_MAX;
for(int mask=0;mask<(1<<m);++mask){vector<long long>p,q;for(int i=0;i<m;++i)(mask>>i&1?p:q).push_back(a[i]);
 if(p.size()%2==0||q.size()%2==0)continue;sort(p.begin(),p.end());sort(q.begin(),q.end());best=min(best,llabs(p[p.size()/2]-q[q.size()/2]));}
cout<<best<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(2*n);for(auto&x:a)cin>>x;
for(size_t i=1;i<a.size();++i){long long v=a[i];size_t j=i;while(j>0&&a[j-1]>v){a[j]=a[j-1];--j;}a[j]=v;}
cout<<a[n]-a[n-1]<<"\\n";}`],
  big: [
    { seed: 1, note: "one test of 2·10^5 grades in decreasing order", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + line(range(2 * n, 0, -1))` },
    { seed: 2, note: "random", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(2 * n, 1, 10**9))` },
  ],
});

P.push({
  id: "A532", judge: "grid-bishop-max-sum", topic: "foundations", rating: 1000,
  tag: "Matrices", timeLimitMs: 1000,
  uz: "Fil qo‘yish",
  en: "Placing a bishop",
  statementUz: "n × m o‘lchamli jadval berilgan, har bir katakda manfiy bo‘lmagan butun son yozilgan. Jadvalning bitta katagiga shaxmat fili qo‘yiladi. Fil o‘zi turgan katakdan to‘rtta diagonal yo‘nalish bo‘ylab jadval chetigacha bo‘lgan barcha kataklarni uradi; u turgan katak ham urilgan hisoblanadi. Filni shunday joylashtiringki, u uradigan kataklardagi sonlar yig‘indisi eng katta bo‘lsin. Shu yig‘indini chiqaring. Har bir katak yig‘indiga bir marta qo‘shiladi.",
  statementEn: "You are given an n × m table with a non-negative integer in every cell. A chess bishop is put on one cell of the table. It attacks every cell along the four diagonal directions from its cell up to the edge of the table, and the cell it stands on counts as attacked too. Place the bishop so that the sum of the numbers in the attacked cells is as large as possible, and print that sum. Every cell is counted once.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir testning birinchi qatorida n va m, keyingi n ta qatorda jadvalning m tadan soni beriladi.",
  inputEn: "The first line contains the number of test cases t. Each test case starts with a line holding n and m, followed by n lines of m numbers each.",
  outputUz: "Har bir test uchun alohida qatorda eng katta yig‘indini chiqaring.",
  outputEn: "For each test case print the largest sum on its own line.",
  constraintList: ["1 ≤ t ≤ 1000", "1 ≤ n, m ≤ 200", "the sum of n · m over all tests ≤ 4·10^4", "0 ≤ a_ij ≤ 10^6"],
  constraintListUz: ["1 ≤ t ≤ 1000", "1 ≤ n, m ≤ 200", "barcha testlar bo‘yicha n · m lar yig‘indisi ≤ 4·10^4", "0 ≤ a_ij ≤ 10^6"],
  sampleInputs: ["2\n3 3\n1 2 3\n4 5 6\n7 8 9\n1 4\n5 1 2 3\n"],
  expect: ["25\n5\n"],
  sampleNotesUz: [
    "Birinchi testda fil markazda (5) turganda 1, 5, 9 va 3, 7 kataklarini uradi: 25. Ikkinchi testda bitta qator bor, fil faqat o‘z katagini uradi, eng kattasi 5.",
  ],
  sampleNotesEn: [
    "In the first test a bishop in the centre (5) attacks 1, 5, 9 and 3, 7: 25. In the second test the table is one row, so the bishop attacks only its own cell; the best is 5.",
  ],
  testInputs: ["2\n3 3\n1 2 3\n4 5 6\n7 8 9\n1 4\n5 1 2 3\n", "1\n1 1\n0\n", "1\n2 2\n1 0\n0 1\n", "1\n4 3\n0 0 9\n0 9 0\n9 0 0\n0 0 9\n", "1\n3 5\n1 1 1 1 1\n1 1 1 1 1\n1 1 1 1 1\n"],
  sol: `int t;cin>>t;while(t--){int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));for(auto&r:a)for(auto&x:r)cin>>x;
vector<long long>d1(n+m,0),d2(n+m,0);for(int i=0;i<n;++i)for(int j=0;j<m;++j){d1[i-j+m]+=a[i][j];d2[i+j]+=a[i][j];}
long long best=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j)best=max(best,d1[i-j+m]+d2[i+j]-a[i][j]);
cout<<best<<"\\n";}`,
  wrongNote: "Adding the two diagonal sums counts the bishop's own cell twice; using only one diagonal direction misses half of what it attacks.",
  wrong: [
    `int t;cin>>t;while(t--){int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));for(auto&r:a)for(auto&x:r)cin>>x;
vector<long long>d1(n+m,0),d2(n+m,0);for(int i=0;i<n;++i)for(int j=0;j<m;++j){d1[i-j+m]+=a[i][j];d2[i+j]+=a[i][j];}
long long best=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j)best=max(best,d1[i-j+m]+d2[i+j]);
cout<<best<<"\\n";}`,
    `int t;cin>>t;while(t--){int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));for(auto&r:a)for(auto&x:r)cin>>x;
vector<long long>d1(n+m,0);for(int i=0;i<n;++i)for(int j=0;j<m;++j)d1[i-j+m]+=a[i][j];
long long best=0;for(auto x:d1)best=max(best,x);cout<<best<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 3); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(1, 5), m = r.int(1, 5); s += line([n, m]) + "\n"; for (let j = 0; j < n; j++) s += line(r.ints(m, 0, 9)) + "\n"; } return s; },
  brute: `int t;cin>>t;while(t--){int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));for(auto&r:a)for(auto&x:r)cin>>x;long long best=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j){long long s=0;for(int x=0;x<n;++x)for(int y=0;y<m;++y)if(abs(x-i)==abs(y-j))s+=a[x][y];best=max(best,s);}
cout<<best<<"\\n";}`,
  big: [
    { seed: 1, note: "one 200 × 200 table", code: `rows = [line(r.ints(200, 0, 10**6)) for _ in range(200)]\nreturn "1\\n200 200\\n" + "\\n".join(rows)` },
    { seed: 2, note: "1000 small tables", code: `out = []\nfor _ in range(1000):\n    out.append("5 8\\n" + "\\n".join(line(r.ints(8, 0, 10**6)) for _ in range(5)))\nreturn "1000\\n" + "\\n".join(out)` },
  ],
});

export default P;
