/* Batch 373 — ten problems, C373–C382.
 *
 * The upper middle of the ladder, 1800 to 2200: interval and subsequence DP,
 * geometry, a couple of graph counts and two that need a modulus.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "C373", judge: "graph-count-connected-pairs", topic: "graphs", rating: 1800,
  tag: "Components", timeLimitMs: 1000,
  uz: "Bir komponentadagi juftliklar",
  en: "Pairs that can reach each other",
  statementUz: "Sizga n ta uchi va m ta qirrasi bo‘lgan yo‘naltirilmagan graf berilgan. Bir-biriga yeta oladigan uchlar juftliklari sonini toping; juftlik tartibsiz, ya'ni (u, v) va (v, u) bitta juftlik hisoblanadi va uchning o‘zi bilan juftligi sanalmaydi. Har bir bog‘langan komponenta ichidagi barcha uchlar o‘zaro yetadi, shuning uchun javob komponentalar o‘lchamlaridan hisoblanadi.",
  statementEn: "You are given an undirected graph with n vertices and m edges. Count the pairs of vertices that can reach each other. A pair is unordered, so (u, v) and (v, u) are one pair, and a vertex paired with itself does not count. Every vertex inside a connected component reaches every other, so the answer follows from the component sizes.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a va b uchlarini bog‘lovchi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains two integers a and b, an edge joining vertices a and b.",
  outputUz: "Yagona butun sonni chiqaring — bir-biriga yeta oladigan uchlar juftliklari soni.",
  outputEn: "Print a single integer — how many pairs of vertices can reach each other.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "the answer reaches about 5·10^9 and needs a 64-bit type", "repeated edges are possible and change nothing"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi", "takroriy qirralar bo‘lishi mumkin va ular hech narsani o‘zgartirmaydi"],
  sampleInputs: ["5 3\n1 2\n2 3\n4 5\n", "3 0\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Komponentalar {1,2,3} va {4,5}. Birinchisidan 3·2/2 = 3 ta juftlik, ikkinchisidan 2·1/2 = 1 ta juftlik chiqadi, jami 4. Har xil komponentadagi uchlar bir-biriga yetmaydi va sanalmaydi.",
    "Qirralar umuman yo‘q, ya'ni har bir uch yolg‘iz komponenta. Bitta uchli komponentada juftlik hosil bo‘lmaydi, shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "The components are {1,2,3} and {4,5}. The first gives 3·2/2 = 3 pairs and the second 2·1/2 = 1, totalling 4. Vertices in different components cannot reach each other and do not count.",
    "There are no edges at all, so every vertex is its own component. A component of one vertex forms no pair, so the answer is 0.",
  ],
  testInputs: ["5 3\n1 2\n2 3\n4 5\n", "3 0\n", "1 0\n", "4 6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4\n", "2 2\n1 2\n1 2\n", "6 3\n1 2\n3 4\n5 6\n"],
  sol: `int n,m;cin>>n>>m;vector<int>p(n+1);iota(p.begin(),p.end(),0);
vector<long long>sz(n+1,1);
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}
long long ans=0;
for(int v=1;v<=n;++v)if(f(v)==v)ans+=sz[v]*(sz[v]-1)/2;
cout<<ans<<"\\n";`,
  wrongNote: "Counting the edges answers how many pairs are directly joined rather than how many reach each other; summing the sizes without pairing them counts vertices, not pairs.",
  wrong: [
    `int n,m;cin>>n>>m;long long c=0;
for(int i=0;i<m;++i){int a,b;cin>>a>>b;++c;}
cout<<c<<"\\n";`,
    `int n,m;cin>>n>>m;vector<int>p(n+1);iota(p.begin(),p.end(),0);
vector<long long>sz(n+1,1);
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}
long long ans=0;
for(int v=1;v<=n;++v)if(f(v)==v&&sz[v]>1)ans+=sz[v];
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "C374", judge: "dp-knapsack-count-ways", topic: "dynamic-programming", rating: 1800,
  tag: "Counting DP", timeLimitMs: 2000,
  uz: "Aynan W og‘irlikni yig‘ish usullari",
  en: "Ways to fill the bag exactly",
  statementUz: "Sizga n ta buyumning og‘irliklari va W sig‘imi berilgan. Og‘irliklari yig‘indisi aynan W ga teng bo‘ladigan buyumlar to‘plamlari nechta ekanini sanang. Har bir buyumni ko‘pi bilan bir marta olish mumkin va buyumlar pozitsiya bo‘yicha farqlanadi, ya'ni og‘irliklari teng ikki buyum har xil to‘plam hosil qiladi. Javob juda katta bo‘lishi mumkin, shuning uchun uni 10^9 + 7 modul bo‘yicha chiqaring.",
  statementEn: "You are given the weights of n items and a capacity W. Count the sets of items whose weights sum to exactly W. Each item may be taken at most once, and items are distinguished by position, so two items of equal weight form different sets. The count can be large, so print it modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda ikkita n va W butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son — og‘irliklar keladi.",
  inputEn: "The first line contains two integers n and W. The second line contains n positive integers, the weights.",
  outputUz: "Yagona butun sonni chiqaring — aynan W og‘irlikni beradigan to‘plamlar soni, 10^9 + 7 modul bo‘yicha.",
  outputEn: "Print a single integer — how many sets weigh exactly W, taken modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 100", "0 ≤ W ≤ 10^4", "1 ≤ weight ≤ 10^4", "the answer is required modulo 10^9 + 7", "the empty set weighs 0 and counts when W is 0"],
  constraintListUz: ["1 ≤ n ≤ 100", "0 ≤ W ≤ 10^4", "1 ≤ og‘irlik ≤ 10^4", "javob 10^9 + 7 modul bo‘yicha talab qilinadi", "bo‘sh to‘plamning og‘irligi 0 va u W = 0 bo‘lganda sanaladi"],
  sampleInputs: ["4 5\n1 2 3 4\n", "3 0\n1 2 3\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "Og‘irligi aynan 5 bo‘lgan to‘plamlar: {1, 4} va {2, 3} — ikkitasi. {1, 2, 3} 6 ni beradi va yaramaydi.",
    "W = 0 bo‘lganda faqat bo‘sh to‘plam yaraydi, chunki barcha og‘irliklar musbat. Shuning uchun javob 1.",
  ],
  sampleNotesEn: [
    "The sets weighing exactly 5 are {1, 4} and {2, 3} — two of them. {1, 2, 3} weighs 6 and does not qualify.",
    "With W = 0 only the empty set qualifies, since every weight is positive, so the answer is 1.",
  ],
  testInputs: ["4 5\n1 2 3 4\n", "3 0\n1 2 3\n", "1 1\n1\n", "4 4\n1 1 1 1\n", "3 10\n1 2 3\n", "5 5\n5 5 5 5 5\n"],
  sol: `long long n,W;cin>>n>>W;const long long M=1000000007;
vector<long long>dp(W+1,0);dp[0]=1;
for(long long i=0;i<n;++i){long long w;cin>>w;
 for(long long c=W;c>=w;--c)dp[c]=(dp[c]+dp[c-w])%M;}
cout<<dp[W]<<"\\n";`,
  wrongNote: "Walking the capacity upwards lets one item be taken many times, which counts multisets instead of sets; starting the table at zero forgets that the empty set is one way to weigh nothing.",
  wrong: [
    `long long n,W;cin>>n>>W;const long long M=1000000007;
vector<long long>dp(W+1,0);dp[0]=1;
for(long long i=0;i<n;++i){long long w;cin>>w;
 for(long long c=w;c<=W;++c)dp[c]=(dp[c]+dp[c-w])%M;}
cout<<dp[W]<<"\\n";`,
    `long long n,W;cin>>n>>W;const long long M=1000000007;
vector<long long>dp(W+1,0);
for(long long i=0;i<n;++i){long long w;cin>>w;
 if(w<=W)dp[w]=(dp[w]+1)%M;
 for(long long c=W;c>=w;--c)dp[c]=(dp[c]+dp[c-w])%M;}
cout<<dp[W]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C375", judge: "dp-longest-arith-subseq", topic: "dynamic-programming", rating: 1900,
  tag: "Subsequence DP", timeLimitMs: 2000,
  uz: "Eng uzun arifmetik qism ketma-ketlik",
  en: "Longest arithmetic subsequence",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Eng uzun arifmetik qism ketma-ketlik uzunligini toping. Arifmetik ketma-ketlikda har ikki qo‘shni hadning farqi bir xil bo‘ladi; qism ketma-ketlik elementlari asl tartibda turishi shart, lekin yonma-yon bo‘lishi shart emas. Uzunligi 1 va 2 bo‘lgan har qanday ketma-ketlik arifmetik hisoblanadi, shuning uchun javob kamida min(n, 2) ga teng.",
  statementEn: "You are given an array of n integers. Find the length of the longest arithmetic subsequence. In an arithmetic sequence the difference between consecutive terms is constant; the elements of a subsequence must keep their original order but need not be adjacent. Any sequence of length 1 or 2 counts as arithmetic, so the answer is at least min(n, 2).",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun arifmetik qism ketma-ketlik uzunligi.",
  outputEn: "Print a single integer — the length of the longest arithmetic subsequence.",
  constraintList: ["1 ≤ n ≤ 1000", "−10^9 ≤ a_i ≤ 10^9", "a sequence of length 1 or 2 is arithmetic by definition", "the difference may be negative or zero"],
  constraintListUz: ["1 ≤ n ≤ 1000", "−10^9 ≤ a_i ≤ 10^9", "uzunligi 1 yoki 2 bo‘lgan ketma-ketlik ta'rifga ko‘ra arifmetik", "farq manfiy yoki nolga teng bo‘lishi mumkin"],
  sampleInputs: ["6\n3 6 9 12 1 2\n", "4\n1 5 2 8\n"],
  expect: ["4\n", "2\n"],
  sampleNotesUz: [
    "3, 6, 9, 12 farqi 3 bo‘lgan arifmetik ketma-ketlik va uning uzunligi 4. 1 va 2 ni qo‘shib bo‘lmaydi, chunki 12 dan keyin farq 3 bo‘lishi uchun 15 kerak edi.",
    "Hech qanday uchta element bir xil farq bilan joylashmagan: 1, 5 dan keyin 9 kerak bo‘lardi, 1, 2 dan keyin 3 — ikkalasi ham massivda yo‘q. Shuning uchun eng uzuni istalgan ikkita element, ya'ni uzunlik 2.",
  ],
  sampleNotesEn: [
    "3, 6, 9, 12 is arithmetic with a difference of 3, giving length 4. The 1 and 2 cannot be appended, since continuing from 12 with difference 3 would need a 15.",
    "No three elements share a common difference: continuing 1, 5 would need a 9 and continuing 1, 2 would need a 3, and neither is present. So the longest is any two of them, length 2.",
  ],
  testInputs: ["6\n3 6 9 12 1 2\n", "4\n1 5 2 8\n", "1\n7\n", "5\n1 1 1 1 1\n", "5\n10 7 4 1 -2\n", "6\n1 2 4 8 16 32\n", "5\n1 7 2 9 3\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n<3){cout<<n<<"\\n";return 0;}
vector<map<long long,int>>dp(n);int best=2;
for(int j=0;j<n;++j)for(int i=0;i<j;++i){
 long long d=a[j]-a[i];int len=2;
 auto it=dp[i].find(d);if(it!=dp[i].end())len=it->second+1;
 auto&cur=dp[j][d];if(len>cur)cur=len;
 best=max(best,len);}
cout<<best<<"\\n";`,
  wrongNote: "Requiring the elements to be adjacent measures a run rather than a subsequence; never reading the chain that already ends at i means every progression restarts at length two.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n<3){cout<<n<<"\\n";return 0;}
int best=2,cur=2;
for(int i=2;i<n;++i){
 if(a[i]-a[i-1]==a[i-1]-a[i-2])++cur;else cur=2;
 best=max(best,cur);}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n<3){cout<<n<<"\\n";return 0;}
vector<map<long long,int>>dp(n);int best=2;
for(int j=0;j<n;++j)for(int i=0;i<j;++i){
 long long d=a[j]-a[i];int len=2;
 auto&cur=dp[j][d];if(len>cur)cur=len;
 best=max(best,len);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C376", judge: "math-count-lattice-in-circle", topic: "math", rating: 1900,
  tag: "Counting", timeLimitMs: 2000,
  uz: "Aylana ichidagi butun nuqtalar",
  en: "Lattice points inside a circle",
  statementUz: "Sizga r radiusi berilgan. Koordinatalar boshida markazlashgan, radiusi r bo‘lgan aylana ichida yoki uning chegarasida yotgan butun koordinatali nuqtalar sonini toping; nuqta (x, y) shartni x² + y² ≤ r² bo‘lganda qanoatlantiradi. r 10^6 gacha borgani uchun barcha kataklarni ko‘rib chiqib bo‘lmaydi: har bir x uchun mos y larning sonini ildiz orqali hisoblash kerak.",
  statementEn: "You are given a radius r. Count the points with integer coordinates lying inside or on the circle of radius r centred at the origin, that is the points (x, y) with x² + y² ≤ r². Since r goes up to 10^6 the cells cannot all be examined: for each x the number of valid y has to be computed from a square root.",
  inputUz: "Yagona qatorda bitta manfiy bo‘lmagan r butun soni beriladi.",
  inputEn: "The only line contains one non-negative integer r.",
  outputUz: "Yagona butun sonni chiqaring — aylana ichidagi yoki chegarasidagi butun nuqtalar soni.",
  outputEn: "Print a single integer — how many lattice points lie inside the circle or on it.",
  constraintList: ["0 ≤ r ≤ 10^6", "the answer reaches about 3·10^12 and needs a 64-bit type", "points exactly on the circle are counted", "r = 0 leaves only the origin"],
  constraintListUz: ["0 ≤ r ≤ 10^6", "javob taxminan 3·10^12 ga yetadi va 64-bitli turni talab qiladi", "aynan aylana ustidagi nuqtalar ham sanaladi", "r = 0 bo‘lganda faqat koordinatalar boshi qoladi"],
  sampleInputs: ["1\n", "0\n"],
  expect: ["5\n", "1\n"],
  sampleNotesUz: [
    "Radiusi 1 bo‘lgan aylana ichida (0,0) va chegarasida (1,0), (−1,0), (0,1), (0,−1) yotadi — jami beshta. (1,1) esa 1² + 1² = 2 > 1 bo‘lgani uchun tashqarida qoladi.",
    "r = 0 bo‘lganda faqat koordinatalar boshining o‘zi shartni qanoatlantiradi, chunki 0² + 0² = 0 ≤ 0. Javob 1.",
  ],
  sampleNotesEn: [
    "Inside the circle of radius 1 sits (0,0), and on it sit (1,0), (−1,0), (0,1) and (0,−1) — five in total. The point (1,1) is outside, since 1² + 1² = 2 > 1.",
    "With r = 0 only the origin qualifies, because 0² + 0² = 0 ≤ 0. The answer is 1.",
  ],
  testInputs: ["1\n", "0\n", "2\n", "5\n", "1000\n", "1000000\n"],
  sol: `long long r;cin>>r;long long total=0;
for(long long x=-r;x<=r;++x){
 long long rem=r*r-x*x;
 long long y=(long long)sqrtl((long double)rem);
 while(y*y>rem)--y;
 while((y+1)*(y+1)<=rem)++y;
 total+=2*y+1;}
cout<<total<<"\\n";`,
  wrongNote: "Counting only the points strictly inside drops the whole boundary, which the statement includes; counting one side of the y axis halves the answer.",
  wrong: [
    `long long r;cin>>r;long long total=0;
for(long long x=-r;x<=r;++x){
 long long rem=r*r-x*x-1;
 if(rem<0)continue;
 long long y=(long long)sqrtl((long double)rem);
 while(y*y>rem)--y;
 while((y+1)*(y+1)<=rem)++y;
 total+=2*y+1;}
cout<<total<<"\\n";`,
    `long long r;cin>>r;long long total=0;
for(long long x=0;x<=r;++x){
 long long rem=r*r-x*x;
 long long y=(long long)sqrtl((long double)rem);
 while(y*y>rem)--y;
 while((y+1)*(y+1)<=rem)++y;
 total+=2*y+1;}
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C377", judge: "tree-count-centroids", topic: "trees", rating: 2000,
  tag: "Centroid", timeLimitMs: 2000,
  uz: "Daraxtda nechta sentroid bor",
  en: "How many centroids a tree has",
  statementUz: "Sizga n ta uchdan iborat daraxt berilgan. Uchni olib tashlaganda hosil bo‘ladigan komponentalarning eng kattasi n/2 dan oshmasa, o‘sha uch sentroid deyiladi. Daraxtda nechta sentroid borligini aniqlang. Ma'lumki, har qanday daraxtda sentroidlar soni bitta yoki ikkita bo‘ladi, ikkitasi esa faqat ular qirra bilan bog‘langan bo‘lgandagina uchraydi.",
  statementEn: "You are given a tree with n nodes. A node is a centroid when removing it leaves every remaining component with at most n/2 nodes. Determine how many centroids the tree has. It is known that any tree has either one or two centroids, and two only when they are joined by an edge.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n − 1 qatorning har birida a va b uchlari orasidagi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains one integer n. Each of the next n − 1 lines contains two integers a and b, an edge between nodes a and b.",
  outputUz: "Yagona butun sonni chiqaring — sentroidlar soni: 1 yoki 2.",
  outputEn: "Print a single integer — the number of centroids, which is 1 or 2.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "the given edges always form a tree", "the comparison is against n/2 with integer division"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "berilgan qirralar har doim daraxt hosil qiladi", "solishtirish butun sonli bo‘lish bilan olingan n/2 ga qarshi"],
  sampleInputs: ["4\n1 2\n2 3\n3 4\n", "3\n1 2\n2 3\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "Zanjirda 2 va 3 uchlari sentroid. 2 ni olib tashlasak {1} va {3,4} qoladi — eng kattasi 2, bu n/2 = 2 dan oshmaydi. 3 uchun ham xuddi shunday. 1 ni olib tashlasak {2,3,4} qoladi, ya'ni 3 > 2 — u sentroid emas.",
    "Uchta uchli zanjirda faqat o‘rtadagi 2-uch sentroid: uni olib tashlasak ikkita bittalik komponenta qoladi, ikkalasi ham n/2 = 1 dan oshmaydi. Chekka uchlar olib tashlansa 2 ta uchli komponenta qoladi.",
  ],
  sampleNotesEn: [
    "In a chain of four the centroids are nodes 2 and 3. Removing 2 leaves {1} and {3,4}, the larger of which is 2, which does not exceed n/2 = 2. The same holds for 3. Removing 1 leaves {2,3,4}, which is 3 > 2, so it is not a centroid.",
    "In a chain of three only the middle node is a centroid: removing it leaves two components of one node each, both within n/2 = 1. Removing an end leaves a component of two.",
  ],
  testInputs: ["4\n1 2\n2 3\n3 4\n", "3\n1 2\n2 3\n", "1\n", "2\n1 2\n", "5\n1 2\n1 3\n1 4\n1 5\n", "6\n1 2\n2 3\n3 4\n4 5\n5 6\n"],
  sol: `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);vector<long long>sz(n+1,1);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
for(int i=(int)order.size()-1;i>=1;--i){int v=order[i];sz[par[v]]+=sz[v];}
long long c=0;
for(int v=1;v<=n;++v){long long big=n-sz[v];
 for(int u:g[v])if(u!=par[v])big=max(big,sz[u]);
 if(big<=n/2)++c;}
cout<<c<<"\\n";`,
  wrongNote: "Forgetting the component above the node judges only what hangs below it; a strict comparison rejects the node that lands exactly on half.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);vector<long long>sz(n+1,1);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
for(int i=(int)order.size()-1;i>=1;--i){int v=order[i];sz[par[v]]+=sz[v];}
long long c=0;
for(int v=1;v<=n;++v){long long big=0;
 for(int u:g[v])if(u!=par[v])big=max(big,sz[u]);
 if(big<=n/2)++c;}
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);vector<long long>sz(n+1,1);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
for(int i=(int)order.size()-1;i>=1;--i){int v=order[i];sz[par[v]]+=sz[v];}
long long c=0;
for(int v=1;v<=n;++v){long long big=n-sz[v];
 for(int u:g[v])if(u!=par[v])big=max(big,sz[u]);
 if(big<n/2)++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C378", judge: "dp-lcs-three-strings", topic: "dynamic-programming", rating: 2000,
  tag: "Three-dimensional DP", timeLimitMs: 2000,
  uz: "Uchta satrning umumiy qism ketma-ketligi",
  en: "Common subsequence of three strings",
  statementUz: "Sizga uchta satr berilgan. Uchalasida ham bir xil nisbiy tartibda uchraydigan eng uzun umumiy qism ketma-ketlik uzunligini toping. Qism ketma-ketlik belgilari yonma-yon turishi shart emas, lekin ularning tartibi har uchala satrda ham saqlanishi kerak. Ikkita satr uchun ishlaydigan jadval bu yerda uch o‘lchovli bo‘ladi: har bir satrdan bittadan indeks.",
  statementEn: "You are given three strings. Find the length of the longest subsequence that appears in all three in the same relative order. The characters of a subsequence need not be adjacent, but their order has to hold in each of the three strings. The table that works for two strings becomes three-dimensional here: one index per string.",
  inputUz: "Uchta qatorda kichik lotin harflaridan iborat uchta satr beriladi.",
  inputEn: "Three lines contain the three strings of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — uchalasining eng uzun umumiy qism ketma-ketligi uzunligi. Umumiy belgi bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the length of the longest subsequence common to all three. If they share no character, print 0.",
  constraintList: ["1 ≤ length of each string ≤ 100", "the strings consist of the characters 'a'–'z' only", "the three strings may have different lengths"],
  constraintListUz: ["1 ≤ har bir satr uzunligi ≤ 100", "satrlar faqat 'a'–'z' belgilaridan iborat", "uchala satrning uzunligi har xil bo‘lishi mumkin"],
  sampleInputs: ["abcd\nacbd\nacd\n", "abc\ndef\nghi\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "\"acd\" uchala satrda ham shu tartibda uchraydi va uzunligi 3. \"abcd\" ikkinchi satrda tartib bilan uchramaydi, chunki u yerda b, c dan keyin keladi.",
    "Uchala satrda umumiy birorta belgi yo‘q, shuning uchun eng uzun umumiy qism ketma-ketlik bo‘sh va javob 0.",
  ],
  sampleNotesEn: [
    "\"acd\" appears in that order in all three strings, giving length 3. \"abcd\" does not survive the second string, where b comes after c.",
    "The three strings share no character at all, so the longest common subsequence is empty and the answer is 0.",
  ],
  testInputs: ["abcd\nacbd\nacd\n", "abc\ndef\nghi\n", "a\na\na\n", "aaaa\naaa\naa\n", "abcde\nabcde\nabcde\n", "xyz\nxz\nz\n"],
  sol: `string a,b,c;cin>>a>>b>>c;
int n=a.size(),m=b.size(),k=c.size();
vector<vector<vector<int>>>dp(n+1,vector<vector<int>>(m+1,vector<int>(k+1,0)));
for(int i=1;i<=n;++i)for(int j=1;j<=m;++j)for(int l=1;l<=k;++l){
 if(a[i-1]==b[j-1]&&b[j-1]==c[l-1])dp[i][j][l]=dp[i-1][j-1][l-1]+1;
 else dp[i][j][l]=max(dp[i-1][j][l],max(dp[i][j-1][l],dp[i][j][l-1]));}
cout<<dp[n][m][k]<<"\\n";`,
  wrongNote: "Taking the longest common subsequence of the first two and then matching it against the third is not the same problem; comparing only two of the three strings ignores one of them entirely.",
  wrong: [
    `string a,b,c;cin>>a>>b>>c;
auto lcs=[](const string&x,const string&y){
 int n=x.size(),m=y.size();
 vector<vector<int>>dp(n+1,vector<int>(m+1,0));
 for(int i=1;i<=n;++i)for(int j=1;j<=m;++j)
  dp[i][j]=(x[i-1]==y[j-1])?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);
 string r;int i=n,j=m;
 while(i>0&&j>0){if(x[i-1]==y[j-1]){r.push_back(x[i-1]);--i;--j;}
  else if(dp[i-1][j]>=dp[i][j-1])--i;else --j;}
 reverse(r.begin(),r.end());return r;};
string ab=lcs(a,b);
int n=ab.size(),m=c.size();
vector<vector<int>>dp(n+1,vector<int>(m+1,0));
for(int i=1;i<=n;++i)for(int j=1;j<=m;++j)
 dp[i][j]=(ab[i-1]==c[j-1])?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);
cout<<dp[n][m]<<"\\n";`,
    `string a,b,c;cin>>a>>b>>c;
int n=a.size(),m=b.size();
vector<vector<int>>dp(n+1,vector<int>(m+1,0));
for(int i=1;i<=n;++i)for(int j=1;j<=m;++j)
 dp[i][j]=(a[i-1]==b[j-1])?dp[i-1][j-1]+1:max(dp[i-1][j],dp[i][j-1]);
cout<<dp[n][m]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C379", judge: "geo-convex-hull-area2", topic: "geometry", rating: 2000,
  tag: "Convex hull", timeLimitMs: 2000,
  uz: "Qavariq qobiq yuzasining ikkilangani",
  en: "Twice the area of the convex hull",
  statementUz: "Sizga tekislikdagi n ta nuqta berilgan. Ularning qavariq qobig‘i — barcha nuqtalarni o‘z ichiga oluvchi eng kichik qavariq ko‘pburchak — yuzasining ikkilanganini chiqaring. Ikkilantirish javobni butun son qilib saqlaydi. Agar barcha nuqtalar bitta to‘g‘ri chiziqda yotsa yoki nuqtalar soni uchtadan kam bo‘lsa, qobiq yuzasi 0 ga teng.",
  statementEn: "You are given n points in the plane. Print twice the area of their convex hull, the smallest convex polygon containing every point. Doubling keeps the answer an integer. If all the points lie on one line, or there are fewer than three of them, the hull has area 0.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida ikkita x va y butun soni keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains two integers x and y.",
  outputUz: "Yagona manfiy bo‘lmagan butun sonni chiqaring — qavariq qobiq yuzasining ikkilangani.",
  outputEn: "Print a single non-negative integer — twice the area of the convex hull.",
  constraintList: ["1 ≤ n ≤ 2000", "−10^9 ≤ x, y ≤ 10^9", "cross products reach 10^18 and need a 64-bit type", "points may repeat, and collinear points give an area of 0"],
  constraintListUz: ["1 ≤ n ≤ 2000", "−10^9 ≤ x, y ≤ 10^9", "vektor ko‘paytmalar 10^18 ga yetadi va 64-bitli turni talab qiladi", "nuqtalar takrorlanishi mumkin, bir chiziqdagi nuqtalar esa 0 yuza beradi"],
  sampleInputs: ["4\n0 0\n4 0\n4 4\n0 4\n", "3\n0 0\n1 1\n2 2\n"],
  expect: ["32\n", "0\n"],
  sampleNotesUz: [
    "To‘rt nuqta tomoni 4 bo‘lgan kvadrat hosil qiladi; uning yuzasi 16, ikkilangani esa 32.",
    "Uchala nuqta y = x chizig‘ida yotadi, ya'ni qobiq kesmaga aylanadi va hech qanday yuza o‘ramaydi. Javob 0.",
  ],
  sampleNotesEn: [
    "The four points form a square of side 4, whose area is 16, so twice the area is 32.",
    "All three points lie on the line y = x, so the hull collapses to a segment and encloses no area. The answer is 0.",
  ],
  testInputs: ["4\n0 0\n4 0\n4 4\n0 4\n", "3\n0 0\n1 1\n2 2\n", "1\n5 5\n", "3\n0 0\n1 0\n0 1\n", "5\n0 0\n4 0\n4 4\n0 4\n2 2\n", "2\n0 0\n10 10\n"],
  sol: `int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&q:p)cin>>q.first>>q.second;
sort(p.begin(),p.end());p.erase(unique(p.begin(),p.end()),p.end());
int m=p.size();
if(m<3){cout<<0<<"\\n";return 0;}
auto cr=[](const pair<long long,long long>&O,const pair<long long,long long>&A,const pair<long long,long long>&B){
 return (A.first-O.first)*(B.second-O.second)-(A.second-O.second)*(B.first-O.first);};
vector<pair<long long,long long>>h(2*m);int k=0;
for(int i=0;i<m;++i){while(k>=2&&cr(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
int lower=k+1;
for(int i=m-2;i>=0;--i){while(k>=lower&&cr(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
h.resize(k-1);
long long area=0;int hn=h.size();
for(int i=0;i<hn;++i){int j=(i+1)%hn;
 area+=h[i].first*h[j].second-h[j].first*h[i].second;}
cout<<llabs(area)<<"\\n";`,
  wrongNote: "Running the shoelace formula over the points in their input order measures a self-crossing polygon rather than the hull; halving the doubled area throws away the half that made it an integer.",
  wrong: [
    `int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&q:p)cin>>q.first>>q.second;
long long area=0;
for(int i=0;i<n;++i){int j=(i+1)%n;
 area+=p[i].first*p[j].second-p[j].first*p[i].second;}
cout<<llabs(area)<<"\\n";`,
    `int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&q:p)cin>>q.first>>q.second;
sort(p.begin(),p.end());p.erase(unique(p.begin(),p.end()),p.end());
int m=p.size();
if(m<3){cout<<0<<"\\n";return 0;}
auto cr=[](const pair<long long,long long>&O,const pair<long long,long long>&A,const pair<long long,long long>&B){
 return (A.first-O.first)*(B.second-O.second)-(A.second-O.second)*(B.first-O.first);};
vector<pair<long long,long long>>h(2*m);int k=0;
for(int i=0;i<m;++i){while(k>=2&&cr(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
int lower=k+1;
for(int i=m-2;i>=0;--i){while(k>=lower&&cr(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
h.resize(k-1);
long long area=0;int hn=h.size();
for(int i=0;i<hn;++i){int j=(i+1)%hn;
 area+=h[i].first*h[j].second-h[j].first*h[i].second;}
cout<<(llabs(area)/2)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C380", judge: "bt-count-hamiltonian-paths", topic: "backtracking", rating: 2100,
  tag: "Bitmask DP", timeLimitMs: 2000,
  uz: "Gamilton yo‘llari soni",
  en: "Counting Hamiltonian paths",
  statementUz: "Sizga n ta uchi va m ta qirrasi bo‘lgan yo‘naltirilmagan graf berilgan. Har bir uchdan aynan bir marta o‘tadigan yo‘llar sonini toping. Yo‘l istalgan uchdan boshlanib istalgan uchda tugashi mumkin, lekin bir yo‘lning ikki yo‘nalishi har xil yo‘l deb sanaladi. n kichik bo‘lgani uchun holatni bitli maska va oxirgi uch bilan saqlash kifoya.",
  statementEn: "You are given an undirected graph with n vertices and m edges. Count the paths that visit every vertex exactly once. A path may start and end anywhere, but the two directions of the same path count as different paths. Since n is small, the state can be held as a bitmask together with the last vertex.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a va b uchlarini bog‘lovchi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains two integers a and b, an edge joining vertices a and b.",
  outputUz: "Yagona butun sonni chiqaring — har bir uchdan aynan bir marta o‘tadigan yo‘llar soni.",
  outputEn: "Print a single integer — how many paths visit every vertex exactly once.",
  constraintList: ["1 ≤ n ≤ 14", "0 ≤ m ≤ n(n−1)/2", "1 ≤ a, b ≤ n and a ≠ b", "the two directions of one path count separately", "a single vertex is a path of length zero"],
  constraintListUz: ["1 ≤ n ≤ 14", "0 ≤ m ≤ n(n−1)/2", "1 ≤ a, b ≤ n va a ≠ b", "bir yo‘lning ikki yo‘nalishi alohida sanaladi", "yagona uch uzunligi nolga teng yo‘l hisoblanadi"],
  sampleInputs: ["3 2\n1 2\n2 3\n", "3 3\n1 2\n2 3\n1 3\n"],
  expect: ["2\n", "6\n"],
  sampleNotesUz: [
    "Zanjirda faqat bitta yo‘l bor — 1, 2, 3 — lekin uni ikki yo‘nalishda yurish mumkin, shuning uchun javob 2. 2 dan boshlansa, uchala uchdan o‘tib bo‘lmaydi.",
    "Uchburchakda har qanday tartib yo‘l hosil qiladi, chunki har bir juftlik qirra bilan bog‘langan. Uchta uchning 3! = 6 ta tartibi bor, ya'ni javob 6.",
  ],
  sampleNotesEn: [
    "The chain has a single path — 1, 2, 3 — but it can be walked in either direction, so the answer is 2. Starting at 2 cannot reach all three.",
    "In a triangle every ordering forms a path, since every pair is joined. Three vertices have 3! = 6 orderings, so the answer is 6.",
  ],
  testInputs: ["3 2\n1 2\n2 3\n", "3 3\n1 2\n2 3\n1 3\n", "1 0\n", "2 1\n1 2\n", "4 3\n1 2\n2 3\n3 4\n", "4 0\n"],
  sol: `int n,m;cin>>n>>m;vector<int>adj(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;adj[a]|=1<<b;adj[b]|=1<<a;}
vector<vector<long long>>dp(1<<n,vector<long long>(n,0));
for(int v=0;v<n;++v)dp[1<<v][v]=1;
for(int mask=1;mask<(1<<n);++mask)for(int v=0;v<n;++v){
 if(!dp[mask][v])continue;
 for(int u=0;u<n;++u){if(mask>>u&1)continue;
  if(!(adj[v]>>u&1))continue;
  dp[mask|(1<<u)][u]+=dp[mask][v];}}
long long total=0;
for(int v=0;v<n;++v)total+=dp[(1<<n)-1][v];
cout<<total<<"\\n";`,
  wrongNote: "Halving the total assumes every path has a distinct reverse, which is false for a single vertex; fixing the start at vertex 1 counts only the paths that begin there.",
  wrong: [
    `int n,m;cin>>n>>m;vector<int>adj(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;adj[a]|=1<<b;adj[b]|=1<<a;}
vector<vector<long long>>dp(1<<n,vector<long long>(n,0));
for(int v=0;v<n;++v)dp[1<<v][v]=1;
for(int mask=1;mask<(1<<n);++mask)for(int v=0;v<n;++v){
 if(!dp[mask][v])continue;
 for(int u=0;u<n;++u){if(mask>>u&1)continue;
  if(!(adj[v]>>u&1))continue;
  dp[mask|(1<<u)][u]+=dp[mask][v];}}
long long total=0;
for(int v=0;v<n;++v)total+=dp[(1<<n)-1][v];
cout<<(total/2)<<"\\n";`,
    `int n,m;cin>>n>>m;vector<int>adj(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;adj[a]|=1<<b;adj[b]|=1<<a;}
vector<vector<long long>>dp(1<<n,vector<long long>(n,0));
dp[1][0]=1;
for(int mask=1;mask<(1<<n);++mask)for(int v=0;v<n;++v){
 if(!dp[mask][v])continue;
 for(int u=0;u<n;++u){if(mask>>u&1)continue;
  if(!(adj[v]>>u&1))continue;
  dp[mask|(1<<u)][u]+=dp[mask][v];}}
long long total=0;
for(int v=0;v<n;++v)total+=dp[(1<<n)-1][v];
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C381", judge: "string-smallest-rotation", topic: "strings", rating: 2100,
  tag: "Booth's algorithm", timeLimitMs: 2000,
  uz: "Lug‘aviy eng kichik aylanma",
  en: "The lexicographically smallest rotation",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning barcha aylanmalari orasidan lug‘aviy eng kichigining boshlanish pozitsiyasini toping; pozitsiyalar 1 dan sanaladi. k-chi aylanma — s ning k-chi harfidan boshlanib, oxiriga yetgach yana boshidan davom etadigan satr. Bir necha aylanma bir xil bo‘lsa, ularning eng kichik pozitsiyasini chiqaring.",
  statementEn: "You are given a string s of lowercase Latin letters. Among all its rotations, find the starting position of the lexicographically smallest one, with positions counted from 1. The k-th rotation is the string that begins at the k-th letter of s and continues from the start once the end is reached. If several rotations are equal, print the smallest such position.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — lug‘aviy eng kichik aylanmaning boshlanish pozitsiyasi (1 dan sanaladi).",
  outputEn: "Print a single integer — the starting position, counted from 1, of the smallest rotation.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' only", "on a tie the smallest position is required", "a string of equal letters answers 1"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' belgilaridan iborat", "teng holatda eng kichik pozitsiya talab qilinadi", "barcha harflari teng satr uchun javob 1"],
  sampleInputs: ["bbaa\n", "aaaa\n"],
  expect: ["3\n", "1\n"],
  sampleNotesUz: [
    "Aylanmalar: bbaa (1), baab (2), aabb (3), abba (4). Lug‘aviy eng kichigi aabb, u 3-pozitsiyadan boshlanadi.",
    "Barcha harflar teng, ya'ni to‘rtala aylanma ham aaaa. Teng holatda eng kichik pozitsiya talab qilinadi, shuning uchun javob 1.",
  ],
  sampleNotesEn: [
    "The rotations are bbaa (1), baab (2), aabb (3) and abba (4). The smallest is aabb, which starts at position 3.",
    "Every letter is equal, so all four rotations are aaaa. The smallest position is required on a tie, so the answer is 1.",
  ],
  testInputs: ["bbaa\n", "aaaa\n", "a\n", "cba\n", "abab\n", "zzzab\n", "abaa\n"],
  sol: `string s;cin>>s;int n=s.size();
string t=s+s;int i=0,j=1;
while(i<n&&j<n){int k=0;
 while(k<n&&t[i+k]==t[j+k])++k;
 if(k>=n)break;
 if(t[i+k]>t[j+k]){int ni=i+k+1;i=max(ni,j+1);j=i+1;}
 else {int nj=j+k+1;j=max(nj,i+1);}}
cout<<(min(i,j)+1)<<"\\n";`,
  wrongNote: "Comparing only the first character of each rotation stops at the first tie; building every rotation as a string is correct but quadratic, and here it is wrong in a different way — it keeps the last of the equal ones rather than the first.",
  wrong: [
    `string s;cin>>s;int n=s.size();
int best=0;
for(int i=1;i<n;++i)if(s[i]<s[best])best=i;
cout<<(best+1)<<"\\n";`,
    `string s;cin>>s;int n=s.size();
string t=s+s;int best=0;string bs=t.substr(0,n);
for(int i=1;i<n;++i){string cur=t.substr(i,n);
 if(cur<=bs){bs=cur;best=i;}}
cout<<(best+1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C382", judge: "sqrt-decomp-range-sum", topic: "advanced-cp", rating: 2200,
  tag: "Sqrt decomposition", timeLimitMs: 2000,
  uz: "Blokli yig‘indi va nuqtaviy o‘zgartirish",
  en: "Block sums with point updates",
  statementUz: "Sizga n ta butun sondan iborat massiv va q ta amal berilgan. \"1 i x\" amali i-pozitsiyadagi qiymatni x ga almashtiradi. \"2 l r\" amali esa l dan r gacha bo‘lgan pozitsiyalardagi qiymatlar yig‘indisini so‘raydi; ikkala chet ham kiradi. Massivni taxminan √n uzunlikdagi bloklarga bo‘lib, har bir blokning yig‘indisini saqlab borish har ikkala amalni ham tez bajarishga imkon beradi.",
  statementEn: "You are given an array of n integers and q operations. Operation \"1 i x\" replaces the value at position i with x. Operation \"2 l r\" asks for the sum of the values from position l to position r, with both ends included. Splitting the array into blocks of about √n and keeping each block's sum makes both operations fast.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Ikkinchi qatorda n ta butun son keladi. Keyingi q qatorning har biri \"1 i x\" yoki \"2 l r\" ko‘rinishida bo‘ladi.",
  inputEn: "The first line contains two integers n and q. The second line contains n integers. Each of the next q lines is either \"1 i x\" or \"2 l r\".",
  outputUz: "Har bir 2-turdagi amal uchun so‘ralgan yig‘indini alohida qatorda chiqaring.",
  outputEn: "For every operation of type 2 print the requested sum on its own line.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ q ≤ 10^5", "1 ≤ i ≤ n", "1 ≤ l ≤ r ≤ n", "−10^9 ≤ values and x ≤ 10^9", "a sum reaches 10^14 and needs a 64-bit type", "positions are 1-based"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ q ≤ 10^5", "1 ≤ i ≤ n", "1 ≤ l ≤ r ≤ n", "−10^9 ≤ qiymatlar va x ≤ 10^9", "yig‘indi 10^14 ga yetadi va 64-bitli turni talab qiladi", "pozitsiyalar 1 dan sanaladi"],
  sampleInputs: ["5 3\n1 2 3 4 5\n2 1 5\n1 3 10\n2 2 4\n", "1 2\n7\n2 1 1\n1 1 -7\n"],
  expect: ["15\n16\n", "7\n"],
  sampleNotesUz: [
    "Birinchi so‘rov butun massivning yig‘indisini beradi: 1 + 2 + 3 + 4 + 5 = 15. So‘ng 3-pozitsiya 10 ga almashadi va massiv 1 2 10 4 5 bo‘ladi. Ikkinchi so‘rov 2 dan 4 gacha: 2 + 10 + 4 = 16.",
    "Yagona so‘rov 7 ni beradi. Undan keyingi o‘zgartirish hech qanday so‘rovga ta'sir qilmaydi, chunki undan keyin so‘rov yo‘q — ya'ni chiqishda bitta qator bo‘ladi.",
  ],
  sampleNotesEn: [
    "The first query sums the whole array: 1 + 2 + 3 + 4 + 5 = 15. Position 3 is then replaced by 10, making the array 1 2 10 4 5, so the second query over 2 to 4 gives 2 + 10 + 4 = 16.",
    "The only query returns 7. The update that follows affects no query, since none comes after it — so the output holds a single line.",
  ],
  testInputs: ["5 3\n1 2 3 4 5\n2 1 5\n1 3 10\n2 2 4\n", "1 2\n7\n2 1 1\n1 1 -7\n", "3 2\n1 1 1\n1 2 5\n2 1 3\n", "4 1\n-1000000000 -1000000000 -1000000000 -1000000000\n2 1 4\n", "5 2\n1 2 3 4 5\n2 3 3\n2 1 1\n", "6 3\n1 2 3 4 5 6\n1 6 0\n2 4 6\n2 1 6\n"],
  sol: `long long n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
long long B=max(1LL,(long long)sqrtl((long double)n));
long long nb=(n+B-1)/B;vector<long long>bs(nb,0);
for(long long i=0;i<n;++i)bs[i/B]+=a[i];
while(q--){long long t;cin>>t;
 if(t==1){long long i,x;cin>>i>>x;--i;bs[i/B]+=x-a[i];a[i]=x;}
 else{long long l,r;cin>>l>>r;--l;--r;long long s=0;
  while(l<=r&&l%B!=0){s+=a[l];++l;}
  while(l+B-1<=r){s+=bs[l/B];l+=B;}
  while(l<=r){s+=a[l];++l;}
  cout<<s<<"\\n";}}`,
  wrongNote: "Adding the new value to the block instead of the difference lets the block sum drift away from the array; walking whole blocks without checking that the block ends inside the range overshoots the right edge.",
  wrong: [
    `long long n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
long long B=max(1LL,(long long)sqrtl((long double)n));
long long nb=(n+B-1)/B;vector<long long>bs(nb,0);
for(long long i=0;i<n;++i)bs[i/B]+=a[i];
while(q--){long long t;cin>>t;
 if(t==1){long long i,x;cin>>i>>x;--i;bs[i/B]+=x;a[i]=x;}
 else{long long l,r;cin>>l>>r;--l;--r;long long s=0;
  while(l<=r&&l%B!=0){s+=a[l];++l;}
  while(l+B-1<=r){s+=bs[l/B];l+=B;}
  while(l<=r){s+=a[l];++l;}
  cout<<s<<"\\n";}}`,
    `long long n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
long long B=max(1LL,(long long)sqrtl((long double)n));
long long nb=(n+B-1)/B;vector<long long>bs(nb,0);
for(long long i=0;i<n;++i)bs[i/B]+=a[i];
while(q--){long long t;cin>>t;
 if(t==1){long long i,x;cin>>i>>x;--i;bs[i/B]+=x-a[i];a[i]=x;}
 else{long long l,r;cin>>l>>r;--l;--r;long long s=0;
  while(l<=r&&l%B!=0){s+=a[l];++l;}
  while(l<=r){s+=bs[l/B];l+=B;}
  cout<<s<<"\\n";}}`,
  ],
});

export default P;
