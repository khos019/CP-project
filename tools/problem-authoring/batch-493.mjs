/* Batch 493 — eight problems, A493–C500, the ones that take the bank to 500.
 *
 * A running record at the bottom, a Fenwick-counted inversion distance and a
 * digit dynamic programming at the top; C499 and C500 are insane.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A493", judge: "array-running-max-differences", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Rekord necha marta yangilanadi",
  en: "How often the record is broken",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uni chapdan o‘ngga o‘qib borganda rekord necha marta yangilanishini sanang: element o‘zidan oldin kelgan barcha elementlardan qat'iy katta bo‘lsa, rekord yangilanadi. Birinchi element ham rekord hisoblanadi, chunki undan oldin hech narsa yo‘q. Shuning uchun javob har doim kamida 1 bo‘ladi.",
  statementEn: "You are given an array of n integers. Reading it from left to right, count how many times the record is broken: the record breaks whenever an element is strictly above every element before it. The first element counts as a record too, since nothing stands before it, so the answer is always at least 1.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — rekord yangilangan joylar soni.",
  outputEn: "Print a single integer — the number of places where the record is broken.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the first element always counts as a record", "the rise must be strict, so an equal value is not a new record"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "birinchi element har doim rekord hisoblanadi", "o‘sish qat'iy, ya'ni teng qiymat yangi rekord emas"],
  sampleInputs: ["5\n1 3 2 5 4\n", "3\n5 5 5\n"],
  expect: ["3\n", "1\n"],
  sampleNotesUz: [
    "Rekordlar 1, 3 va 5 da yangilanadi. 2 o‘zidan oldingi 3 dan kichik, 4 esa 5 dan kichik, shuning uchun ular rekord emas.",
    "Birinchi 5 rekord, qolgan ikkitasi esa unga teng va qat'iy katta emas. Javob 1.",
  ],
  sampleNotesEn: [
    "The record breaks at 1, at 3 and at 5. The 2 is below the earlier 3 and the 4 is below the 5, so neither is a record.",
    "The first 5 is a record while the other two merely equal it and are not strictly above, so the answer is 1.",
  ],
  testInputs: ["5\n1 3 2 5 4\n", "3\n5 5 5\n", "1\n7\n", "4\n4 3 2 1\n", "4\n1 2 3 4\n", "4\n5 1 2 3\n", "5\n-5 -4 -6 -3 -10\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=a[0],c=1;
for(int i=1;i<n;++i)if(a[i]>best){best=a[i];++c;}
cout<<c<<"\\n";`,
  wrongNote: "Comparing each element only with the one just before it calls a small rise a record even when a larger value already stood earlier; allowing an equal value to count contradicts the strict rise the statement asks for.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=1;
for(int i=1;i<n;++i)if(a[i]>a[i-1])++c;
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=a[0],c=1;
for(int i=1;i<n;++i)if(a[i]>=best){best=a[i];++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1100 */
P.push({
  id: "A494", judge: "math-count-trailing-zeros-power", topic: "math", rating: 1100,
  tag: "Number theory", timeLimitMs: 1000,
  uz: "Ikkining darajasidagi bo‘luvchi",
  en: "The power of two hiding inside",
  statementUz: "Sizga musbat n soni berilgan. Uni ikkiga qoldiqsiz eng ko‘pi bilan necha marta bo‘lish mumkinligini toping. Boshqacha aytganda, n ning ikkilik yozuvida oxiridan nechta nol turishini aniqlang. n toq bo‘lsa javob 0 bo‘ladi, chunki uni bir marta ham ikkiga bo‘lib bo‘lmaydi. n ikkining darajasi bo‘lsa, javob o‘sha daraja ko‘rsatkichiga teng.",
  statementEn: "You are given a positive number n. Find how many times it can be divided by two without a remainder — equivalently, how many zeros stand at the end of its binary writing. If n is odd the answer is 0, since it cannot be halved even once. If n is a power of two the answer is that power's exponent.",
  inputUz: "Yagona qatorda bitta musbat n butun soni beriladi.",
  inputEn: "The only line contains one positive integer n.",
  outputUz: "Yagona butun sonni chiqaring — n ni ikkiga qoldiqsiz bo‘lish mumkin bo‘lgan marta soni.",
  outputEn: "Print a single integer — how many times n can be halved without a remainder.",
  constraintList: ["1 ≤ n ≤ 10^18", "an odd n answers 0", "the answer never exceeds 59", "n is always positive, so the loop always ends"],
  constraintListUz: ["1 ≤ n ≤ 10^18", "toq n uchun javob 0", "javob 59 dan oshmaydi", "n har doim musbat, shuning uchun sikl albatta tugaydi"],
  sampleInputs: ["24\n", "7\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "24 → 12 → 6 → 3: uch marta ikkiga bo‘linadi, keyin toq son qoladi. Ikkilik yozuvi 11000 bo‘lib, oxirida uchta nol turibdi.",
    "7 toq son, shuning uchun uni bir marta ham ikkiga bo‘lib bo‘lmaydi va javob 0.",
  ],
  sampleNotesEn: [
    "24 → 12 → 6 → 3 halves three times before an odd number is left. Its binary writing is 11000, which ends in three zeros.",
    "7 is odd, so it cannot be halved even once and the answer is 0.",
  ],
  testInputs: ["24\n", "7\n", "1\n", "2\n", "576460752303423488\n", "1000000000000000000\n"],
  sol: `long long n;cin>>n;long long c=0;
while(n%2==0){n/=2;++c;}
cout<<c<<"\\n";`,
  wrongNote: "Counting the zeros in the whole binary writing counts the ones sitting between the digits as well; halving while the number merely stays above one keeps going past the last even step.",
  wrong: [
    `long long n;cin>>n;long long c=0;
while(n>0){if(n%2==0)++c;n/=2;}
cout<<c<<"\\n";`,
    `long long n;cin>>n;long long c=0;
while(n>1){n/=2;++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B495", judge: "str-most-frequent-word", topic: "strings", rating: 1300,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Eng ko‘p takrorlangan so‘z",
  en: "The most repeated word",
  statementUz: "Sizga n ta so‘z berilgan. Ular orasidan eng ko‘p marta uchraganini toping va o‘sha so‘zning o‘zini chiqaring. Bir nechta so‘z bir xil ko‘p uchrasa, alifbo bo‘yicha eng kichigini chiqaring. So‘zlar faqat kichik lotin harflaridan iborat va katta-kichik harf farqi yo‘q.",
  statementEn: "You are given n words. Find the one that occurs most often and print that word itself. If several words tie for the most occurrences, print the alphabetically smallest of them. The words are made of lowercase Latin letters only, so there is no question of letter case.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida bitta so‘z keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains one word.",
  outputUz: "Yagona qatorda eng ko‘p uchragan so‘zni chiqaring; teng holatda alifbo bo‘yicha kichigi tanlanadi.",
  outputEn: "Print the most frequent word on a single line, breaking a tie in favour of the alphabetically smaller one.",
  constraintList: ["1 ≤ n ≤ 10^5", "each word is between 1 and 50 lowercase letters", "a tie is broken in favour of the alphabetically smaller word", "the total length of the words does not exceed 10^6"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "har bir so‘z 1 dan 50 gacha kichik harfdan iborat", "teng holatda alifbo bo‘yicha kichik so‘z tanlanadi", "so‘zlarning umumiy uzunligi 10^6 dan oshmaydi"],
  sampleInputs: ["5\nolma\nnok\nolma\nnok\nolma\n", "2\nnok\nolma\n"],
  expect: ["olma\n", "nok\n"],
  sampleNotesUz: [
    "olma uch marta, nok esa ikki marta uchraydi. Eng ko‘p takrorlangani olma.",
    "Ikkala so‘z ham bir martadan uchraydi, ya'ni chastotalar teng. Alifbo bo‘yicha nok oldin keladi.",
  ],
  sampleNotesEn: [
    "The word olma occurs three times and nok twice, so the most repeated one is olma.",
    "Both words occur once, so the counts tie and alphabetically nok comes first.",
  ],
  testInputs: [
    "5\nolma\nnok\nolma\nnok\nolma\n",
    "2\nnok\nolma\n",
    "1\nbitta\n",
    "4\nb\na\nb\na\n",
    "3\nzz\nzz\naa\n",
    "5\nc\nb\na\nc\nb\n",
  ],
  sol: `int n;cin>>n;map<string,long long>cnt;
for(int i=0;i<n;++i){string w;cin>>w;++cnt[w];}
string best;long long bc=-1;
for(map<string,long long>::iterator it=cnt.begin();it!=cnt.end();++it){
 if(it->second>bc){bc=it->second;best=it->first;}}
cout<<best<<"\\n";`,
  wrongNote: "Replacing the best word whenever a count merely ties keeps the last one seen instead of the alphabetically smaller; taking the first word to reach the highest count in input order depends on how the words happen to be listed.",
  wrong: [
    `int n;cin>>n;map<string,long long>cnt;
for(int i=0;i<n;++i){string w;cin>>w;++cnt[w];}
string best;long long bc=-1;
for(map<string,long long>::iterator it=cnt.begin();it!=cnt.end();++it){
 if(it->second>=bc){bc=it->second;best=it->first;}}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<string>w(n);map<string,long long>cnt;
for(int i=0;i<n;++i){cin>>w[i];++cnt[w[i]];}
string best=w[0];long long bc=cnt[w[0]];
for(int i=1;i<n;++i)if(cnt[w[i]]>bc){bc=cnt[w[i]];best=w[i];}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B496", judge: "greedy-min-refills-to-reach", topic: "greedy", rating: 1500,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Eng kam to‘xtash bilan manzilga",
  en: "Reaching the end with the fewest stops",
  statementUz: "Yo‘l 0 nuqtadan d nuqtagacha cho‘zilgan va unda n ta shoshqich turibdi; i-shoshqich x_i nuqtada. Avtomobil bir to‘la bakda k birlik masofa yura oladi va yo‘l boshida baki to‘la. Har bir shoshqichda bakni to‘ldirish mumkin. Manzilga yetib borish uchun kerak bo‘ladigan eng kam to‘xtashlar sonini toping; yetib bo‘lmasa, −1 chiqaring.",
  statementEn: "A road runs from point 0 to point d with n filling stations along it, the i-th at x_i. The car covers k units of distance on a full tank and starts out full. At each station the tank may be filled up. Find the fewest stops needed to reach the end, or print −1 if the end cannot be reached.",
  inputUz: "Birinchi qatorda uchta n, d va k butun soni beriladi. Ikkinchi qatorda o‘sish tartibida n ta shoshqich koordinatasi keladi.",
  inputEn: "The first line contains three integers n, d and k. The second line contains the n station coordinates in increasing order.",
  outputUz: "Yagona butun sonni chiqaring — kerak bo‘ladigan eng kam to‘xtashlar soni, yoki yetib bo‘lmasa −1.",
  outputEn: "Print a single integer — the fewest stops needed, or −1 if the end cannot be reached.",
  constraintList: ["0 ≤ n ≤ 10^5", "1 ≤ d ≤ 10^9", "1 ≤ k ≤ 10^9", "0 < x_i < d and the coordinates increase strictly", "the tank starts full and every stop fills it completely"],
  constraintListUz: ["0 ≤ n ≤ 10^5", "1 ≤ d ≤ 10^9", "1 ≤ k ≤ 10^9", "0 < x_i < d va koordinatalar qat'iy o‘sadi", "bak boshida to‘la va har bir to‘xtash uni to‘liq to‘ldiradi"],
  sampleInputs: ["3 10 4\n3 5 8\n", "1 10 3\n5\n"],
  expect: ["3\n", "-1\n"],
  sampleNotesUz: [
    "To‘la bak 4 birlikka yetadi, ya'ni faqat 3 dagi shoshqichga borib to‘xtaymiz. U yerdan 7 gacha yetamiz va 5 da to‘xtashga majburmiz, so‘ng 9 gacha yetib 8 da to‘xtaymiz. 8 dan 12 gacha yetib manzilga boramiz — jami 3 ta to‘xtash.",
    "Boshida 3 birlik yuramiz, lekin birinchi shoshqich 5 da turibdi. Unga yetib bo‘lmaydi, shuning uchun javob −1.",
  ],
  sampleNotesEn: [
    "A full tank covers 4 units, so only the station at 3 is within reach. From there 7 is the limit and the stop at 5 is forced, then 9 is the limit and the stop at 8 follows. From 8 the car reaches 12 and the end — three stops in all.",
    "The car covers 3 units at the start but the first station stands at 5, which is out of reach, so the answer is −1.",
  ],
  testInputs: [
    "3 10 4\n3 5 8\n",
    "1 10 3\n5\n",
    "0 5 5\n",
    "0 6 5\n",
    "2 10 5\n5 9\n",
    "4 20 6\n5 10 15 19\n",
    "3 10 5\n1 2 5\n",
  ],
  sol: `long long n,d,k;cin>>n>>d>>k;
vector<long long>x(n);for(auto&v:x)cin>>v;
long long pos=0,stops=0;long long i=0;
while(pos+k<d){
 long long best=-1;
 while(i<n&&x[i]<=pos+k){best=x[i];++i;}
 if(best<0||best<=pos){cout<<"-1\\n";return 0;}
 pos=best;++stops;}
cout<<stops<<"\\n";`,
  wrongNote: "Filling up at the first station within range wastes the reach that a farther one would have given; counting how many stations lie on the road says nothing about how many of them must be used.",
  wrong: [
    `long long n,d,k;cin>>n>>d>>k;
vector<long long>x(n);for(auto&v:x)cin>>v;
long long pos=0,stops=0;long long i=0;
while(pos+k<d){
 if(i>=n||x[i]>pos+k||x[i]<=pos){cout<<"-1\\n";return 0;}
 pos=x[i];++i;++stops;}
cout<<stops<<"\\n";`,
    `long long n,d,k;cin>>n>>d>>k;
vector<long long>x(n);for(auto&v:x)cin>>v;
if(k>=d){cout<<"0\\n";return 0;}
cout<<n<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B497", judge: "two-pointers-count-triangles", topic: "two-pointers", rating: 1700,
  tag: "Sorting and two pointers", timeLimitMs: 1000,
  uz: "Uchburchak yasaydigan uchliklar",
  en: "The triples that form a triangle",
  statementUz: "Sizga n ta musbat sondan iborat massiv berilgan; ular kesmalarning uzunliklari. Shunday uchliklar sonini toping-ki, o‘sha uch kesmadan uchburchak yasash mumkin bo‘lsin. Uchburchak yasash uchun har ikki tomonning yig‘indisi uchinchisidan qat'iy katta bo‘lishi kerak. Massivni saralasak, faqat ikkita kichigining yig‘indisini kattasi bilan solishtirish kifoya.",
  statementEn: "You are given an array of n positive numbers, the lengths of some segments. Count the triples from which a triangle can be built. A triangle needs the sum of every two sides to be strictly above the third. Once the array is sorted, comparing the sum of the two smaller sides against the largest is enough.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n positive numbers.",
  outputUz: "Yagona butun sonni chiqaring — uchburchak yasash mumkin bo‘lgan uchliklar soni.",
  outputEn: "Print a single integer — the number of triples that form a triangle.",
  constraintList: ["1 ≤ n ≤ 2000", "1 ≤ a_i ≤ 10^9", "the three positions must be distinct", "the inequality must be strict, so a degenerate triangle does not count", "the answer reaches 10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 2000", "1 ≤ a_i ≤ 10^9", "uchala pozitsiya har xil bo‘lishi shart", "tengsizlik qat'iy, ya'ni yassi uchburchak sanalmaydi", "javob 10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n2 2 3 4\n", "3\n1 2 3\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Mos uchliklar: (2,2,3), (2,3,4) birinchi ikkilik bilan va (2,3,4) ikkinchisi bilan — jami 3 ta. (2,2,4) yaramaydi, chunki 2 + 2 = 4 qat'iy katta emas.",
    "1 + 2 = 3 bo‘lib, u uchinchi tomondan qat'iy katta emas. Shuning uchun uchburchak yasab bo‘lmaydi.",
  ],
  sampleNotesEn: [
    "The working triples are (2,2,3) and (2,3,4) taken with either of the two 2s — three in all. The triple (2,2,4) fails, since 2 + 2 = 4 is not strictly above 4.",
    "Here 1 + 2 = 3, which is not strictly above the third side, so no triangle can be built.",
  ],
  testInputs: ["4\n2 2 3 4\n", "3\n1 2 3\n", "1\n5\n", "2\n1 1\n", "5\n1 1 1 1 1\n", "6\n1 2 4 8 16 32\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long total=0;
for(int k=n-1;k>=2;--k){
 int i=0,j=k-1;
 while(i<j){
  if(a[i]+a[j]>a[k]){total+=j-i;--j;}
  else ++i;}}
cout<<total<<"\\n";`,
  wrongNote: "Allowing the two smaller sides to merely equal the largest admits the flat triple the statement rules out; counting only the triples of neighbouring positions in the sorted array ignores every other combination.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long total=0;
for(int k=n-1;k>=2;--k){
 int i=0,j=k-1;
 while(i<j){
  if(a[i]+a[j]>=a[k]){total+=j-i;--j;}
  else ++i;}}
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long total=0;
for(int i=0;i+2<n;++i)if(a[i]+a[i+1]>a[i+2])++total;
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "B498", judge: "tree-count-leaves-per-depth-max", topic: "trees", rating: 1900,
  tag: "Tree traversal", timeLimitMs: 2000,
  uz: "Eng ko‘p uch turgan daraja",
  en: "The level holding the most vertices",
  statementUz: "Sizga n ta uchi bo‘lgan va 1-uchdan ildizlangan daraxt berilgan. Ildizning darajasi 0, uning bolalariniki 1 va hokazo. Eng ko‘p uch turgan darajani toping va o‘sha darajadagi uchlar sonini chiqaring. Bir nechta daraja bir xil ko‘p uch saqlasa ham, javob baribir o‘sha son bo‘ladi. Daraxt katta bo‘lgani uchun rekursiyasiz yurish ma'qul.",
  statementEn: "You are given a tree with n vertices, rooted at vertex 1. The root sits at level 0, its children at level 1 and so on. Find the level holding the most vertices and print how many vertices that is. If several levels tie for the most, the answer is still that count. The tree is large, so an iterative walk serves better than recursion.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n − 1 qatorning har birida daraxtning a va b uchlarini bog‘lovchi qirrasi keladi.",
  inputEn: "The first line contains one integer n. Each of the next n − 1 lines contains an edge a b of the tree.",
  outputUz: "Yagona butun sonni chiqaring — eng ko‘p uch turgan darajadagi uchlar soni.",
  outputEn: "Print a single integer — the number of vertices on the most crowded level.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a, b ≤ n and a ≠ b", "the n − 1 edges form a tree rooted at vertex 1", "the root alone occupies level 0", "a tree of one vertex answers 1"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a, b ≤ n va a ≠ b", "n − 1 ta qirra 1-uchdan ildizlangan daraxt hosil qiladi", "0-darajada faqat ildiz turadi", "bitta uchli daraxt uchun javob 1"],
  sampleInputs: ["5\n1 2\n1 3\n2 4\n2 5\n", "1\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "0-darajada bitta uch (ildiz), 1-darajada ikkita (2 va 3), 2-darajada ham ikkita (4 va 5). Eng ko‘pi 2.",
    "Yagona uch ildiz bo‘lib, 0-darajada turadi. Javob 1.",
  ],
  sampleNotesEn: [
    "Level 0 holds one vertex, the root; level 1 holds two, namely 2 and 3; and level 2 also holds two, namely 4 and 5. The most is 2.",
    "The only vertex is the root and sits on level 0, so the answer is 1.",
  ],
  testInputs: [
    "5\n1 2\n1 3\n2 4\n2 5\n",
    "1\n",
    "2\n1 2\n",
    "4\n1 2\n2 3\n3 4\n",
    "5\n1 2\n1 3\n1 4\n1 5\n",
    "7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n",
  ],
  sol: `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>dep(n,0);vector<char>seen(n,0);
vector<int>q;q.push_back(0);seen[0]=1;
for(size_t i=0;i<q.size();++i){int v=q[i];
 for(int u:g[v])if(!seen[u]){seen[u]=1;dep[u]=dep[v]+1;q.push_back(u);}}
vector<long long>cnt(n,0);
for(int v=0;v<n;++v)++cnt[dep[v]];
long long best=0;
for(int d=0;d<n;++d)if(cnt[d]>best)best=cnt[d];
cout<<best<<"\\n";`,
  wrongNote: "Reporting how many levels the tree has answers a different question than how crowded the busiest one is; counting the neighbours of the root is only the size of level 1 and misses every level below it.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>dep(n,0);vector<char>seen(n,0);
vector<int>q;q.push_back(0);seen[0]=1;
for(size_t i=0;i<q.size();++i){int v=q[i];
 for(int u:g[v])if(!seen[u]){seen[u]=1;dep[u]=dep[v]+1;q.push_back(u);}}
int mx=0;
for(int v=0;v<n;++v)mx=max(mx,dep[v]);
cout<<(mx+1)<<"\\n";`,
    `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
cout<<(long long)g[0].size()<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C499", judge: "adv-min-adjacent-swaps-to-sort", topic: "advanced-cp", rating: 2200,
  tag: "Fenwick tree", timeLimitMs: 2000,
  uz: "Yonma-yon almashtirishlar soni",
  en: "The number of neighbour swaps",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Faqat yonma-yon turgan ikkita elementni almashtirish mumkin. Massivni kamaymaydigan tartibga keltirish uchun kerak bo‘ladigan eng kam almashtirishlar sonini toping. Bu son massivdagi inversiyalar soniga teng: i < j va a_i > a_j shartlarini qanoatlantiruvchi juftliklar soni. Massiv katta bo‘lgani uchun inversiyalarni Fenvik daraxti bilan sanash kerak.",
  statementEn: "You are given an array of n integers. Only two neighbouring elements may be exchanged at a time. Find the fewest such swaps that bring the array into non-decreasing order. That number equals the count of inversions in the array: the pairs with i < j and a_i > a_j. Since the array is large, the inversions have to be counted with a Fenwick tree.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — kerak bo‘ladigan eng kam yonma-yon almashtirishlar soni.",
  outputEn: "Print a single integer — the fewest neighbour swaps needed.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9", "only neighbouring elements may be exchanged", "equal values need no swap between them", "the answer reaches 2·10^10 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9", "faqat yonma-yon elementlarni almashtirish mumkin", "teng qiymatlar orasida almashtirish kerak emas", "javob 2·10^10 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n4 3 2 1\n", "3\n1 2 3\n"],
  expect: ["6\n", "0\n"],
  sampleNotesUz: [
    "Har bir juftlik teskari tartibda turibdi, ya'ni oltita inversiya bor va yonma-yon almashtirish bilan ularning har birini alohida to‘g‘rilash kerak.",
    "Massiv allaqachon tartibda, shuning uchun birorta almashtirish kerak emas.",
  ],
  sampleNotesEn: [
    "Every pair stands the wrong way round, so there are six inversions and each has to be undone by its own neighbour swap.",
    "The array is already in order, so no swap is needed.",
  ],
  testInputs: [
    "4\n4 3 2 1\n",
    "3\n1 2 3\n",
    "1\n5\n",
    "4\n2 2 2 2\n",
    "5\n2 1 4 3 5\n",
    "6\n-1 -1 5 3 3 -2\n",
  ],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());
s.erase(unique(s.begin(),s.end()),s.end());
int m=(int)s.size();
vector<long long>bit(m+2,0);
auto add=[&](int i){for(;i<=m;i+=i&(-i))++bit[i];};
auto sum=[&](int i){long long t=0;for(;i>0;i-=i&(-i))t+=bit[i];return t;};
long long inv=0,done=0;
for(int i=0;i<n;++i){
 int r=(int)(lower_bound(s.begin(),s.end(),a[i])-s.begin())+1;
 inv+=done-sum(r);
 add(r);++done;}
cout<<inv<<"\\n";`,
  wrongNote: "Counting the places where a value drops below its neighbour measures how often the order breaks, not how many swaps repair it; counting the pairs that are merely out of order without insisting on a strict drop charges for equal values that never need swapping.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(int i=1;i<n;++i)if(a[i]<a[i-1])++c;
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());
s.erase(unique(s.begin(),s.end()),s.end());
int m=(int)s.size();
vector<long long>bit(m+2,0);
auto add=[&](int i){for(;i<=m;i+=i&(-i))++bit[i];};
auto sum=[&](int i){long long t=0;for(;i>0;i-=i&(-i))t+=bit[i];return t;};
long long inv=0,done=0;
for(int i=0;i<n;++i){
 int r=(int)(lower_bound(s.begin(),s.end(),a[i])-s.begin())+1;
 inv+=done-sum(r-1);
 add(r);++done;}
cout<<inv<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C500", judge: "adv-digit-dp-count-no-repeat", topic: "advanced-cp", rating: 2400,
  tag: "Digit dynamic programming", timeLimitMs: 2000,
  uz: "Qo‘shni raqamlari teng bo‘lmagan sonlar",
  en: "Numbers with no two equal neighbouring digits",
  statementUz: "Sizga L va R chegaralari berilgan. Shu oraliqdagi shunday sonlarni sanang-ki, ularning o‘nlik yozuvida hech ikkita qo‘shni raqam teng bo‘lmasin. Masalan 121 mos keladi, 122 esa yo‘q, chunki oxirgi ikkita raqami teng. Chegaralarning o‘zi ham oraliqqa kiradi. Sonlar juda katta bo‘lgani uchun ularni birma-bir tekshirib bo‘lmaydi: raqamlar bo‘yicha dinamik dasturlash qo‘llash kerak.",
  statementEn: "You are given bounds L and R. Count the numbers in that range whose decimal writing has no two equal neighbouring digits. For instance 121 qualifies while 122 does not, since its last two digits are equal. Both bounds belong to the range. The numbers are far too large to test one at a time, so the count has to be built digit by digit with dynamic programming.",
  inputUz: "Yagona qatorda ikkita L va R butun soni beriladi.",
  inputEn: "The only line contains two integers L and R.",
  outputUz: "Yagona butun sonni chiqaring — oraliqdagi mos sonlar soni.",
  outputEn: "Print a single integer — the number of qualifying values in the range.",
  constraintList: ["1 ≤ L ≤ R ≤ 10^18", "both bounds belong to the range", "the numbers are written without leading zeros", "a one-digit number always qualifies", "the answer needs a 64-bit type"],
  constraintListUz: ["1 ≤ L ≤ R ≤ 10^18", "ikkala chegara ham oraliqqa kiradi", "sonlar boshida nolsiz yoziladi", "bir raqamli son har doim mos keladi", "javob 64-bitli turni talab qiladi"],
  sampleInputs: ["1 20\n", "10 12\n"],
  expect: ["19\n", "2\n"],
  sampleNotesUz: [
    "1 dan 20 gacha yigirmata son bor va ulardan faqat 11 mos kelmaydi, chunki uning ikkala raqami teng. Qolgan 19 tasi mos keladi.",
    "10, 11 va 12 dan 11 tashlab yuboriladi, qolgan ikkitasi mos keladi.",
  ],
  sampleNotesEn: [
    "There are twenty numbers from 1 to 20 and only 11 fails, since both of its digits are equal, leaving 19 that qualify.",
    "Of 10, 11 and 12 the number 11 drops out and the other two qualify.",
  ],
  testInputs: ["1 20\n", "10 12\n", "1 9\n", "11 11\n", "1 1000000000000000000\n", "100 200\n"],
  sol: `auto count=[](long long N){
 if(N<=0)return 0LL;
 string s=to_string(N);int L=(int)s.size();
 vector<vector<array<long long,2>>>memo(L+1,vector<array<long long,2>>(11));
 vector<vector<array<char,2>>>vis(L+1,vector<array<char,2>>(11));
 for(int i=0;i<=L;++i)for(int p=0;p<11;++p){vis[i][p][0]=0;vis[i][p][1]=0;}
 function<long long(int,int,int,int)>go=[&](int pos,int prev,int tight,int started)->long long{
  if(pos==L)return started?1LL:0LL;
  if(!tight&&vis[pos][prev][started])return memo[pos][prev][started];
  int hi=tight?(s[pos]-'0'):9;
  long long total=0;
  for(int d=0;d<=hi;++d){
   int ns=started||(d>0);
   if(started&&d==prev)continue;
   int np=ns?d:10;
   total+=go(pos+1,np,(tight&&d==hi)?1:0,ns);}
  if(!tight){vis[pos][prev][started]=1;memo[pos][prev][started]=total;}
  return total;};
 return go(0,10,1,0);};
long long L,R;cin>>L>>R;
cout<<(count(R)-count(L-1))<<"\\n";`,
  wrongNote: "Counting up to R without removing the values below L answers a range that starts at one; subtracting the count up to L rather than up to the value below it drops the lower bound itself when it qualifies.",
  wrong: [
    `auto count=[](long long N){
 if(N<=0)return 0LL;
 string s=to_string(N);int L=(int)s.size();
 vector<vector<array<long long,2>>>memo(L+1,vector<array<long long,2>>(11));
 vector<vector<array<char,2>>>vis(L+1,vector<array<char,2>>(11));
 for(int i=0;i<=L;++i)for(int p=0;p<11;++p){vis[i][p][0]=0;vis[i][p][1]=0;}
 function<long long(int,int,int,int)>go=[&](int pos,int prev,int tight,int started)->long long{
  if(pos==L)return started?1LL:0LL;
  if(!tight&&vis[pos][prev][started])return memo[pos][prev][started];
  int hi=tight?(s[pos]-'0'):9;
  long long total=0;
  for(int d=0;d<=hi;++d){
   int ns=started||(d>0);
   if(started&&d==prev)continue;
   int np=ns?d:10;
   total+=go(pos+1,np,(tight&&d==hi)?1:0,ns);}
  if(!tight){vis[pos][prev][started]=1;memo[pos][prev][started]=total;}
  return total;};
 return go(0,10,1,0);};
long long L,R;cin>>L>>R;
cout<<count(R)<<"\\n";`,
    `auto count=[](long long N){
 if(N<=0)return 0LL;
 string s=to_string(N);int L=(int)s.size();
 vector<vector<array<long long,2>>>memo(L+1,vector<array<long long,2>>(11));
 vector<vector<array<char,2>>>vis(L+1,vector<array<char,2>>(11));
 for(int i=0;i<=L;++i)for(int p=0;p<11;++p){vis[i][p][0]=0;vis[i][p][1]=0;}
 function<long long(int,int,int,int)>go=[&](int pos,int prev,int tight,int started)->long long{
  if(pos==L)return started?1LL:0LL;
  if(!tight&&vis[pos][prev][started])return memo[pos][prev][started];
  int hi=tight?(s[pos]-'0'):9;
  long long total=0;
  for(int d=0;d<=hi;++d){
   int ns=started||(d>0);
   if(started&&d==prev)continue;
   int np=ns?d:10;
   total+=go(pos+1,np,(tight&&d==hi)?1:0,ns);}
  if(!tight){vis[pos][prev][started]=1;memo[pos][prev][started]=total;}
  return total;};
 return go(0,10,1,0);};
long long L,R;cin>>L>>R;
cout<<(count(R)-count(L))<<"\\n";`,
  ],
});

export default P;
