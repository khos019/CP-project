/* Batch 403 — ten problems, A403–C412.
 *
 * Counting and ranges at the bottom, a maximum collinear set and a permanent
 * over bitmasks at the top; C412 is the batch's insane entry.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A403", judge: "array-count-in-range", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Oraliqqa tushgan elementlar",
  en: "The elements that fall inside the range",
  statementUz: "Sizga n ta butun sondan iborat massiv va ikkita L, R chegarasi berilgan. Massivda qiymati L dan kichik bo‘lmagan va R dan katta bo‘lmagan nechta element borligini sanang. Chegaralarning o‘zi ham oraliqqa kiradi, ya'ni aynan L ga yoki aynan R ga teng element ham hisobga olinadi. Oraliqqa birorta element tushmasa, javob 0 bo‘ladi.",
  statementEn: "You are given an array of n integers and two bounds L and R. Count how many elements have a value that is not below L and not above R. The bounds themselves belong to the range, so an element equal to L or equal to R is counted too. If nothing falls inside, the answer is 0.",
  inputUz: "Birinchi qatorda uchta n, L va R butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains three integers n, L and R. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — [L, R] oralig‘iga tushgan elementlar soni.",
  outputEn: "Print a single integer — the number of elements lying in the range [L, R].",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ L ≤ R ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "both bounds are included in the range"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ L ≤ R ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "ikkala chegara ham oraliqqa kiradi"],
  sampleInputs: ["5 2 4\n1 2 3 4 5\n", "3 10 20\n1 2 3\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "[2, 4] oralig‘iga 2, 3 va 4 tushadi — uchta element. 1 chegaradan past, 5 esa chegaradan yuqori, ya'ni ular sanalmaydi.",
    "Massivdagi eng katta element 3 bo‘lib, u ham 10 dan kichik. Shuning uchun oraliqqa hech narsa tushmaydi va javob 0.",
  ],
  sampleNotesEn: [
    "The range [2, 4] holds 2, 3 and 4 — three elements. The 1 is below the range and the 5 is above it, so neither is counted.",
    "The largest element is 3, which is still below 10, so nothing falls inside the range and the answer is 0.",
  ],
  testInputs: ["5 2 4\n1 2 3 4 5\n", "3 10 20\n1 2 3\n", "1 5 5\n5\n", "4 -3 0\n-5 -3 0 1\n", "5 -1000000000 1000000000\n-1000000000 0 1000000000 5 -7\n", "3 1 2\n2 2 2\n"],
  sol: `long long n,L,R;cin>>n>>L>>R;long long c=0;
for(long long i=0;i<n;++i){long long x;cin>>x;if(x>=L&&x<=R)++c;}
cout<<c<<"\\n";`,
  wrongNote: "Comparing strictly against both bounds drops the elements that sit exactly on them; checking only the lower bound counts everything above the range as well.",
  wrong: [
    `long long n,L,R;cin>>n>>L>>R;long long c=0;
for(long long i=0;i<n;++i){long long x;cin>>x;if(x>L&&x<R)++c;}
cout<<c<<"\\n";`,
    `long long n,L,R;cin>>n>>L>>R;long long c=0;
for(long long i=0;i<n;++i){long long x;cin>>x;if(x>=L)++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A404", judge: "math-nearest-multiple", topic: "math", rating: 1000,
  tag: "Arithmetic", timeLimitMs: 1000,
  uz: "Eng yaqin karrali son",
  en: "The nearest multiple",
  statementUz: "Sizga ikkita n va k butun soni berilgan. k ning karralilari orasidan n ga eng yaqinini toping. Karralilar manfiy ham bo‘lishi mumkin, chunki n manfiy bo‘lishi mumkin, nol esa har doim k ning karralisi hisoblanadi. Agar ikkita karrali n dan bir xil masofada tursa, ulardan kattasini chiqaring. n ning o‘zi k ga bo‘linsa, javob n ning o‘zi bo‘ladi.",
  statementEn: "You are given two integers n and k. Among the multiples of k, find the one nearest to n. A multiple may be negative, since n may be negative, and zero is always a multiple of k. If two multiples are the same distance from n, print the larger of them. If n is itself divisible by k, the answer is n.",
  inputUz: "Yagona qatorda ikkita n va k butun soni beriladi.",
  inputEn: "The only line contains two integers n and k.",
  outputUz: "Yagona butun sonni chiqaring — n ga eng yaqin k karralisi; teng masofada kattasi tanlanadi.",
  outputEn: "Print a single integer — the multiple of k nearest to n, breaking a tie in favour of the larger one.",
  constraintList: ["−10^18 ≤ n ≤ 10^18", "1 ≤ k ≤ 10^9", "a tie is broken in favour of the larger multiple", "negative multiples are allowed"],
  constraintListUz: ["−10^18 ≤ n ≤ 10^18", "1 ≤ k ≤ 10^9", "teng masofada kattaroq karrali tanlanadi", "manfiy karralilarga ruxsat beriladi"],
  sampleInputs: ["17 5\n", "15 10\n"],
  expect: ["15\n", "20\n"],
  sampleNotesUz: [
    "17 ni o‘rab turgan 5 ning karralilari 15 va 20. Masofalar 2 va 3, ya'ni 15 yaqinroq.",
    "15 ni o‘rab turgan 10 ning karralilari 10 va 20, ikkalasi ham 5 masofada. Teng holatda kattasi tanlanadi, shuning uchun javob 20.",
  ],
  sampleNotesEn: [
    "The multiples of 5 surrounding 17 are 15 and 20, at distances 2 and 3, so 15 is the nearer one.",
    "The multiples of 10 surrounding 15 are 10 and 20, both at distance 5. A tie goes to the larger, so the answer is 20.",
  ],
  testInputs: ["17 5\n", "15 10\n", "0 7\n", "-13 5\n", "-15 10\n", "1000000000000000000 3\n"],
  sol: `long long n,k;cin>>n>>k;
long long q=n/k;
if(n%k!=0&&n<0)--q;
long long lo=q*k,hi=lo+k;
cout<<(((n-lo)<(hi-n))?lo:hi)<<"\\n";`,
  wrongNote: "Integer division rounds towards zero, so on a negative n the lower candidate it produces is really the upper one; breaking the tie towards the smaller multiple inverts the rule the statement gives.",
  wrong: [
    `long long n,k;cin>>n>>k;
long long lo=n/k*k,hi=lo+k;
cout<<(((n-lo)<(hi-n))?lo:hi)<<"\\n";`,
    `long long n,k;cin>>n>>k;
long long q=n/k;
if(n%k!=0&&n<0)--q;
long long lo=q*k,hi=lo+k;
cout<<(((n-lo)<=(hi-n))?lo:hi)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B405", judge: "str-compare-versions", topic: "strings", rating: 1200,
  tag: "Parsing", timeLimitMs: 1000,
  uz: "Ikkita versiyani solishtirish",
  en: "Comparing two version strings",
  statementUz: "Sizga nuqta bilan ajratilgan manfiy bo‘lmagan butun sonlardan iborat ikkita versiya satri berilgan, masalan 1.2.3. Ularni solishtiring: birinchi bo‘lakdan boshlab sonlarni juftma-juft taqqoslang va birinchi farq qilgan joy javobni belgilaydi. Versiyalarning bo‘laklari soni har xil bo‘lishi mumkin; yetishmagan bo‘laklar 0 deb qaraladi, shuning uchun 1.0 bilan 1 teng hisoblanadi.",
  statementEn: "You are given two version strings made of non-negative integers separated by dots, such as 1.2.3. Compare them: line the parts up from the left and compare them pairwise, and the first place they differ decides the answer. The two versions may have different numbers of parts; a missing part counts as 0, so 1.0 and 1 are equal.",
  inputUz: "Birinchi qatorda birinchi versiya satri, ikkinchi qatorda ikkinchi versiya satri beriladi.",
  inputEn: "The first line contains the first version string and the second line contains the second one.",
  outputUz: "Birinchi versiya kichik bo‘lsa < belgisini, katta bo‘lsa > belgisini, teng bo‘lsa = belgisini chiqaring.",
  outputEn: "Print < if the first version is smaller, > if it is larger, and = if they are equal.",
  constraintList: ["each line is between 1 and 500 characters long", "each version has at most 100 parts", "every part is an integer between 0 and 10^9", "a missing part is treated as 0"],
  constraintListUz: ["har bir qator uzunligi 1 dan 500 gacha", "har bir versiyada ko‘pi bilan 100 ta bo‘lak bor", "har bir bo‘lak 0 dan 10^9 gacha butun son", "yetishmagan bo‘lak 0 deb qaraladi"],
  sampleInputs: ["1.2.3\n1.10\n", "1.0\n1\n"],
  expect: ["<\n", "=\n"],
  sampleNotesUz: [
    "Birinchi bo‘laklar teng: 1 va 1. Ikkinchi bo‘laklar 2 va 10 bo‘lib, 2 kichik. Satr sifatida solishtirilsa boshqa natija chiqar edi, lekin bo‘laklar son sifatida taqqoslanadi.",
    "Ikkinchi versiyada ikkinchi bo‘lak yo‘q, ya'ni u 0 deb qaraladi. Birinchi versiyaning ikkinchi bo‘lagi ham 0, shuning uchun versiyalar teng.",
  ],
  sampleNotesEn: [
    "The first parts tie at 1 and 1. The second parts are 2 and 10, and 2 is smaller. Compared as text the result would be the other way round, but the parts are compared as numbers.",
    "The second version has no second part, so it counts as 0. The first version's second part is 0 as well, so the versions are equal.",
  ],
  testInputs: ["1.2.3\n1.10\n", "1.0\n1\n", "2\n10\n", "1.0.1\n1\n", "0.1\n0.0.9\n", "1.2\n1.2\n"],
  sol: `auto parse=[](const string&s){vector<long long>v;long long cur=0;bool any=false;
 for(char c:s){if(c=='.'){v.push_back(cur);cur=0;any=false;}
  else{cur=cur*10+(c-'0');any=true;}}
 (void)any;v.push_back(cur);return v;};
string a,b;cin>>a>>b;
vector<long long>x=parse(a),y=parse(b);
size_t m=max(x.size(),y.size());
x.resize(m,0);y.resize(m,0);
for(size_t i=0;i<m;++i){
 if(x[i]<y[i]){cout<<"<\\n";return 0;}
 if(x[i]>y[i]){cout<<">\\n";return 0;}}
cout<<"=\\n";`,
  wrongNote: "Comparing the two lines as plain text orders the parts by their digits rather than their values; stopping at the shorter version never looks at the parts only the longer one has.",
  wrong: [
    `string a,b;cin>>a>>b;
if(a<b)cout<<"<\\n";
else if(a>b)cout<<">\\n";
else cout<<"=\\n";`,
    `auto parse=[](const string&s){vector<long long>v;long long cur=0;
 for(char c:s){if(c=='.'){v.push_back(cur);cur=0;}
  else cur=cur*10+(c-'0');}
 v.push_back(cur);return v;};
string a,b;cin>>a>>b;
vector<long long>x=parse(a),y=parse(b);
size_t m=min(x.size(),y.size());
for(size_t i=0;i<m;++i){
 if(x[i]<y[i]){cout<<"<\\n";return 0;}
 if(x[i]>y[i]){cout<<">\\n";return 0;}}
cout<<"=\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B406", judge: "sort-min-swaps", topic: "sorting", rating: 1300,
  tag: "Permutation cycles", timeLimitMs: 1000,
  uz: "Saralash uchun eng kam almashtirish",
  en: "The fewest swaps that sort the array",
  statementUz: "Sizga har xil qiymatlardan iborat n ta butun sonli massiv berilgan. Uni o‘sish tartibida saralash uchun kerak bo‘ladigan almashtirishlarning eng kam sonini toping. Bitta almashtirishda ixtiyoriy ikkita pozitsiyadagi elementlar o‘rin almashadi — ular yonma-yon turishi shart emas. Massiv allaqachon saralangan bo‘lsa, javob 0 bo‘ladi.",
  statementEn: "You are given an array of n integers, all different. Find the smallest number of swaps that sorts it into increasing order. A single swap exchanges the elements at any two positions, which need not be neighbours. If the array is already sorted the answer is 0.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta har xil butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n distinct integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — massivni saralash uchun zarur almashtirishlarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of swaps that sorts the array.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "all the values are distinct", "a swap may exchange any two positions, not only neighbours"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "barcha qiymatlar har xil", "almashtirish yonma-yon emas, ixtiyoriy ikki pozitsiyani o‘zgartira oladi"],
  sampleInputs: ["4\n4 3 2 1\n", "3\n1 2 3\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "4 bilan 1 ni, so‘ng 3 bilan 2 ni almashtirish kifoya — jami ikkita almashtirish. Yonma-yon elementlarni almashtirib borsak oltita qadam kerak bo‘lardi, lekin bu yerda ixtiyoriy juftlikni almashtirish mumkin.",
    "Massiv allaqachon o‘sish tartibida, shuning uchun birorta ham almashtirish kerak emas va javob 0.",
  ],
  sampleNotesEn: [
    "Swapping the 4 with the 1 and then the 3 with the 2 is enough — two swaps in all. Exchanging neighbours would take six steps, but here any pair may be swapped.",
    "The array is already in increasing order, so no swap is needed and the answer is 0.",
  ],
  testInputs: ["4\n4 3 2 1\n", "3\n1 2 3\n", "1\n5\n", "5\n2 3 4 5 1\n", "5\n1 5 4 3 2\n", "6\n-5 -1 0 3 2 7\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<int>idx(n);for(int i=0;i<n;++i)idx[i]=i;
sort(idx.begin(),idx.end(),[&](int p,int q){return a[p]<a[q];});
vector<char>seen(n,0);long long swaps=0;
for(int i=0;i<n;++i){
 if(seen[i]||idx[i]==i)continue;
 int len=0,j=i;
 while(!seen[j]){seen[j]=1;j=idx[j];++len;}
 swaps+=len-1;}
cout<<swaps<<"\\n";`,
  wrongNote: "Counting inversions measures how many neighbour exchanges are needed, which is a different and much larger number; counting the positions holding the wrong value overcounts, since one swap can fix two of them at once.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long inv=0;
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)if(a[i]>a[j])++inv;
cout<<inv<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>b=a;sort(b.begin(),b.end());
long long c=0;
for(int i=0;i<n;++i)if(a[i]!=b[i])++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B407", judge: "graph-longest-path-dag", topic: "graphs", rating: 1600,
  tag: "Topological sort", timeLimitMs: 1000,
  uz: "Asiklik grafdagi eng uzun yo‘l",
  en: "The longest path in a directed acyclic graph",
  statementUz: "Sizga n ta uchi va m ta yo‘naltirilgan qirrasi bo‘lgan sikllarsiz graf berilgan. Undagi eng uzun yo‘lning uzunligini toping; uzunlik yo‘ldagi qirralar soni bilan o‘lchanadi. Yo‘l ixtiyoriy uchdan boshlanishi va ixtiyoriy uchda tugashi mumkin — 1-uchdan boshlanishi shart emas. Qirra umuman bo‘lmasa, javob 0 bo‘ladi.",
  statementEn: "You are given a directed graph with n vertices and m edges and no cycles. Find the length of the longest path in it, where length is measured by the number of edges on the path. The path may start at any vertex and end at any vertex — it need not begin at vertex 1. If there are no edges at all the answer is 0.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a uchdan b uchga yo‘naltirilgan qirra keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains a directed edge from a to b.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun yo‘ldagi qirralar soni.",
  outputEn: "Print a single integer — the number of edges on the longest path.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n and a ≠ b", "the graph contains no directed cycle", "the path may start at any vertex"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n va a ≠ b", "grafda yo‘naltirilgan sikl yo‘q", "yo‘l ixtiyoriy uchdan boshlanishi mumkin"],
  sampleInputs: ["4 3\n1 2\n2 3\n3 4\n", "3 0\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "1 → 2 → 3 → 4 yo‘li uchta qirradan iborat, undan uzunrog‘i yo‘q. Uzunlik uchlar soni emas, qirralar soni bilan o‘lchanadi, shuning uchun javob 4 emas, 3.",
    "Qirralar umuman yo‘q, ya'ni har qanday yo‘l bitta uchdan iborat va nol qirradan o‘tadi. Javob 0.",
  ],
  sampleNotesEn: [
    "The path 1 → 2 → 3 → 4 uses three edges and nothing is longer. Length counts edges rather than vertices, so the answer is 3 and not 4.",
    "There are no edges, so every path is a single vertex crossing zero edges. The answer is 0.",
  ],
  testInputs: ["4 3\n1 2\n2 3\n3 4\n", "3 0\n", "1 0\n", "5 4\n1 2\n1 3\n3 4\n4 5\n", "5 3\n2 3\n3 4\n4 5\n", "4 4\n1 2\n1 3\n2 4\n3 4\n"],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>g(n);vector<int>indeg(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++indeg[b];}
vector<int>order;order.reserve(n);vector<int>st;
for(int v=0;v<n;++v)if(indeg[v]==0)st.push_back(v);
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(--indeg[u]==0)st.push_back(u);}
vector<long long>dp(n,0);long long best=0;
for(int v:order)for(int u:g[v]){
 if(dp[v]+1>dp[u])dp[u]=dp[v]+1;
 if(dp[u]>best)best=dp[u];}
cout<<best<<"\\n";`,
  wrongNote: "Reporting the number of vertices on the path is one more than the number of edges it crosses; measuring only from vertex 1 misses a longer path that starts somewhere vertex 1 cannot reach.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<int>>g(n);vector<int>indeg(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++indeg[b];}
vector<int>order;order.reserve(n);vector<int>st;
for(int v=0;v<n;++v)if(indeg[v]==0)st.push_back(v);
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(--indeg[u]==0)st.push_back(u);}
vector<long long>dp(n,1);long long best=1;
for(int v:order)for(int u:g[v]){
 if(dp[v]+1>dp[u])dp[u]=dp[v]+1;
 if(dp[u]>best)best=dp[u];}
cout<<best<<"\\n";`,
    `int n,m;cin>>n>>m;vector<vector<int>>g(n);vector<int>indeg(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++indeg[b];}
vector<int>order;order.reserve(n);vector<int>st;
for(int v=0;v<n;++v)if(indeg[v]==0)st.push_back(v);
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(--indeg[u]==0)st.push_back(u);}
const long long NEG=-1000000000;
vector<long long>dp(n,NEG);dp[0]=0;long long best=0;
for(int v:order){
 if(dp[v]<0)continue;
 for(int u:g[v]){
  if(dp[v]+1>dp[u])dp[u]=dp[v]+1;
  if(dp[u]>best)best=dp[u];}}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B408", judge: "two-pointers-shortest-unsorted", topic: "two-pointers", rating: 1600,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Saralanishi kerak bo‘lgan eng qisqa qism",
  en: "The shortest stretch that needs sorting",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Ketma-ket turgan shunday eng qisqa qismni toping-ki, faqat o‘shani saralash butun massivni kamaymaydigan tartibga keltirsin, va uning uzunligini chiqaring. Massiv allaqachon kamaymaydigan tartibda bo‘lsa, hech narsani saralash kerak emas va javob 0 bo‘ladi.",
  statementEn: "You are given an array of n integers. Find the shortest stretch of consecutive elements such that sorting just that stretch leaves the whole array non-decreasing, and print its length. If the array is already non-decreasing then nothing needs sorting and the answer is 0.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — saralanishi kerak bo‘lgan eng qisqa qismning uzunligi, yoki massiv saralangan bo‘lsa 0.",
  outputEn: "Print a single integer — the length of the shortest stretch that must be sorted, or 0 if the array is already sorted.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "equal neighbours are allowed, since the order required is non-decreasing", "an already sorted array answers 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "tartib kamaymaydigan bo‘lgani uchun teng qo‘shnilarga ruxsat beriladi", "allaqachon saralangan massiv uchun javob 0"],
  sampleInputs: ["6\n1 3 5 4 2 6\n", "4\n1 2 3 4\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Massivni 1 2 3 4 5 6 bilan solishtirsak, farq ikkinchi pozitsiyadan beshinchi pozitsiyagacha cho‘ziladi. 3 5 4 2 qismini saralasak butun massiv tartibga tushadi, uzunligi esa 4. Faqat 5 4 2 ni saralash yetmaydi, chunki 2 undan oldingi 3 dan kichik.",
    "Massiv allaqachon o‘sish tartibida, ya'ni hech qanday qismni saralash kerak emas. Javob 0.",
  ],
  sampleNotesEn: [
    "Compared with 1 2 3 4 5 6 the array differs from the second position through the fifth. Sorting the stretch 3 5 4 2 puts everything in order, and its length is 4. Sorting only 5 4 2 is not enough, because the 2 is below the 3 in front of it.",
    "The array is already increasing, so no stretch needs sorting and the answer is 0.",
  ],
  testInputs: ["6\n1 3 5 4 2 6\n", "4\n1 2 3 4\n", "1\n5\n", "3\n3 2 1\n", "5\n1 2 4 3 5\n", "5\n2 2 2 2 2\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>b=a;sort(b.begin(),b.end());
int l=0,r=n-1;
while(l<n&&a[l]==b[l])++l;
if(l==n){cout<<"0\\n";return 0;}
while(r>l&&a[r]==b[r])--r;
cout<<(r-l+1)<<"\\n";`,
  wrongNote: "Marking the stretch by the first and last place where a neighbour drops covers the inversions but not the elements in front of them that the stretch must swallow; sorting the whole array whenever it is out of order is valid but never the shortest such stretch.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int first=-1,last=-1;
for(int i=0;i+1<n;++i)if(a[i]>a[i+1]){if(first<0)first=i;last=i+1;}
if(first<0){cout<<"0\\n";return 0;}
cout<<(last-first+1)<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
bool sorted=true;
for(int i=0;i+1<n;++i)if(a[i]>a[i+1])sorted=false;
cout<<(sorted?0:n)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B409", judge: "dp-count-decodings", topic: "dynamic-programming", rating: 1700,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "Xabarni nechta usulda o‘qish mumkin",
  en: "How many ways the message can be read",
  statementUz: "A harfi 1 raqami bilan, B harfi 2 bilan va shu tariqa Z harfi 26 bilan kodlangan, so‘ng olingan raqamlar birikma holda yozilgan. Sizga shunday raqamlar satri berilgan; uni nechta usulda harflarga qaytarish mumkinligini 10^9 + 7 modul bo‘yicha hisoblang. Har bir harf bir yoki ikkita raqamdan olinadi, ikki raqamli bo‘lak esa 10 dan 26 gacha bo‘lishi kerak. Nol bilan boshlanuvchi bo‘lak hech qanday harfni bermaydi.",
  statementEn: "The letter A was written as 1, B as 2 and so on up to Z as 26, and the resulting digits were joined together. Given such a string of digits, count the ways it can be turned back into letters, modulo 10^9 + 7. Each letter comes from one or two digits, and a two-digit piece must lie between 10 and 26. A piece that begins with a zero spells no letter at all.",
  inputUz: "Yagona qatorda raqamlardan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of digits.",
  outputUz: "Yagona butun sonni chiqaring — o‘qish usullari sonining 10^9 + 7 bo‘yicha qoldig‘i. Birorta usul bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of readings modulo 10^9 + 7. If there is none, print 0.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters '0'–'9'", "a one-digit piece must be between 1 and 9", "a two-digit piece must be between 10 and 26", "the answer is reported modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s '0'–'9' belgilaridan iborat", "bir raqamli bo‘lak 1 dan 9 gacha bo‘lishi kerak", "ikki raqamli bo‘lak 10 dan 26 gacha bo‘lishi kerak", "javob 10^9 + 7 modul bo‘yicha chiqariladi"],
  sampleInputs: ["226\n", "06\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "226 ni BBF (2 2 6), BZ (2 26) va VF (22 6) deb o‘qish mumkin — jami uchta usul.",
    "Satr 0 bilan boshlanadi. Yakka 0 hech qanday harf bermaydi, 06 esa 10 dan kichik bo‘lgani uchun ikki raqamli bo‘lak ham bo‘la olmaydi. Javob 0.",
  ],
  sampleNotesEn: [
    "226 can be read as BBF (2 2 6), BZ (2 26) or VF (22 6) — three ways in all.",
    "The string starts with a 0. A lone 0 spells no letter, and 06 is below 10 so it is not a valid two-digit piece either. The answer is 0.",
  ],
  testInputs: ["226\n", "06\n", "12\n", "0\n", "10\n", "1111111111\n"],
  sol: `string s;cin>>s;const long long M=1000000007;int n=(int)s.size();
vector<long long>dp(n+1,0);dp[0]=1;
for(int i=1;i<=n;++i){
 if(s[i-1]!='0')dp[i]=dp[i-1];
 if(i>=2&&s[i-2]!='0'){
  int v=(s[i-2]-'0')*10+(s[i-1]-'0');
  if(v>=10&&v<=26)dp[i]=(dp[i]+dp[i-2])%M;}}
cout<<dp[n]<<"\\n";`,
  wrongNote: "Letting a single digit always stand for a letter turns a lone 0 into one; accepting any two-digit value up to 26 without checking its first digit reads 06 as the sixth letter.",
  wrong: [
    `string s;cin>>s;const long long M=1000000007;int n=(int)s.size();
vector<long long>dp(n+1,0);dp[0]=1;
for(int i=1;i<=n;++i){
 dp[i]=dp[i-1];
 if(i>=2&&s[i-2]!='0'){
  int v=(s[i-2]-'0')*10+(s[i-1]-'0');
  if(v>=10&&v<=26)dp[i]=(dp[i]+dp[i-2])%M;}}
cout<<dp[n]<<"\\n";`,
    `string s;cin>>s;const long long M=1000000007;int n=(int)s.size();
vector<long long>dp(n+1,0);dp[0]=1;
for(int i=1;i<=n;++i){
 if(s[i-1]!='0')dp[i]=dp[i-1];
 if(i>=2){
  int v=(s[i-2]-'0')*10+(s[i-1]-'0');
  if(v<=26)dp[i]=(dp[i]+dp[i-2])%M;}}
cout<<dp[n]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B410", judge: "bs-min-time-produce", topic: "binary-search", rating: 1800,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Buyurtmani bajarish vaqti",
  en: "The time to finish the order",
  statementUz: "Ustaxonada m ta stanok bor; i-stanok bitta buyumni t_i daqiqada yasaydi va boshqa stanoklardan mustaqil ishlaydi. Kamida n ta buyum tayyor bo‘lishi uchun kerak bo‘ladigan eng kam daqiqalar sonini toping. T daqiqa ichida i-stanok T / t_i ta buyum yasaydi, bu yerda bo‘lish butun qismi bilan olinadi — tugallanmagan buyum sanalmaydi.",
  statementEn: "A workshop has m machines; the i-th makes one item every t_i minutes and works independently of the others. Find the smallest number of minutes after which at least n items are ready. Within T minutes the i-th machine produces T / t_i items, the division taken as a whole number — an unfinished item does not count.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan m ta t_i qiymati keladi.",
  inputEn: "The first line contains two integers n and m. The second line contains the m values t_i.",
  outputUz: "Yagona butun sonni chiqaring — kamida n ta buyum tayyor bo‘ladigan eng kam daqiqalar soni.",
  outputEn: "Print a single integer — the smallest number of minutes after which at least n items are ready.",
  constraintList: ["1 ≤ n ≤ 10^9", "1 ≤ m ≤ 10^5", "1 ≤ t_i ≤ 10^9", "the answer reaches 10^18 and needs a 64-bit type", "at least n items are required, more is allowed"],
  constraintListUz: ["1 ≤ n ≤ 10^9", "1 ≤ m ≤ 10^5", "1 ≤ t_i ≤ 10^9", "javob 10^18 ga yetadi va 64-bitli turni talab qiladi", "kamida n ta buyum kerak, ortig‘iga ruxsat beriladi"],
  sampleInputs: ["3 2\n1 2\n", "1 1\n5\n"],
  expect: ["2\n", "5\n"],
  sampleNotesUz: [
    "2 daqiqada birinchi stanok 2 ta, ikkinchisi 1 ta buyum yasaydi — jami 3 ta, ya'ni buyurtma bajariladi. 1 daqiqada esa atigi 1 ta buyum tayyor bo‘lardi.",
    "Yagona stanok bitta buyumni 5 daqiqada yasaydi, shuning uchun bitta buyum uchun ham 5 daqiqa kerak.",
  ],
  sampleNotesEn: [
    "In 2 minutes the first machine makes 2 items and the second makes 1, which is 3 in all and fills the order. In 1 minute only a single item would be ready.",
    "The one machine needs 5 minutes per item, so even a single item takes 5 minutes.",
  ],
  testInputs: ["3 2\n1 2\n", "1 1\n5\n", "7 3\n2 3 5\n", "1 2\n1000000000 1\n", "1000000000 1\n1\n", "5 2\n1 2\n"],
  sol: `long long n,m;cin>>n>>m;vector<long long>t(m);for(auto&x:t)cin>>x;
long long mn=*min_element(t.begin(),t.end());
long long lo=0,hi=mn*n;
auto ok=[&](long long T){long long made=0;
 for(long long x:t){made+=T/x;if(made>=n)return true;}
 return made>=n;};
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  wrongNote: "Demanding strictly more than n items overshoots the order by one; dividing the order by the combined rate ignores that each machine's output only steps up at whole multiples of its own time.",
  wrong: [
    `long long n,m;cin>>n>>m;vector<long long>t(m);for(auto&x:t)cin>>x;
long long mn=*min_element(t.begin(),t.end());
long long lo=0,hi=mn*n+mn;
auto ok=[&](long long T){long long made=0;
 for(long long x:t){made+=T/x;if(made>n)return true;}
 return made>n;};
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
    `long long n,m;cin>>n>>m;vector<long long>t(m);for(auto&x:t)cin>>x;
long double rate=0;
for(long long x:t)rate+=1.0L/(long double)x;
long double need=(long double)n/rate;
long long ans=(long long)ceill(need-1e-9L);
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C411", judge: "geo-max-points-line", topic: "geometry", rating: 2000,
  tag: "Collinearity", timeLimitMs: 2000,
  uz: "Bitta to‘g‘ri chiziqdagi eng ko‘p nuqta",
  en: "The most points on one straight line",
  statementUz: "Tekislikda n ta har xil nuqta berilgan. Bitta to‘g‘ri chiziqda yotadigan nuqtalarning eng ko‘p sonini toping. Ikkita nuqta orqali har doim to‘g‘ri chiziq o‘tkazish mumkin, shuning uchun javob hech qachon 2 dan kichik bo‘lmaydi. Chiziq ixtiyoriy yo‘nalishda, shu jumladan vertikal bo‘lishi mumkin va berilgan nuqtalarning hech ikkitasi ustma-ust tushmaydi.",
  statementEn: "You are given n distinct points in the plane. Find the largest number of them that lie on one straight line. A line can always be drawn through two points, so the answer is never below 2. The line may run in any direction, vertical included, and no two of the given points coincide.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida nuqtaning ikkita koordinatasi keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains the two coordinates of a point.",
  outputUz: "Yagona butun sonni chiqaring — bitta to‘g‘ri chiziqda yotadigan nuqtalarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of points lying on one straight line.",
  constraintList: ["2 ≤ n ≤ 1000", "−10^6 ≤ every coordinate ≤ 10^6", "the points are distinct", "the answer is never below 2", "a vertical line must be handled like any other"],
  constraintListUz: ["2 ≤ n ≤ 1000", "−10^6 ≤ har bir koordinata ≤ 10^6", "nuqtalar har xil", "javob hech qachon 2 dan kichik emas", "vertikal chiziq ham boshqalar kabi hisobga olinishi kerak"],
  sampleInputs: ["5\n1 1\n2 2\n3 3\n1 2\n2 1\n", "2\n0 0\n5 5\n"],
  expect: ["3\n", "2\n"],
  sampleNotesUz: [
    "(1,1), (2,2) va (3,3) bitta diagonalda yotadi — uchta nuqta. Qolgan (1,2) va (2,1) bilan birga to‘rtta nuqtani bir chiziqqa joylashtirib bo‘lmaydi.",
    "Ikkita nuqta orqali har doim chiziq o‘tadi, ya'ni javob 2. Bundan ko‘pini olishning iloji ham yo‘q.",
  ],
  sampleNotesEn: [
    "The points (1,1), (2,2) and (3,3) lie on one diagonal — three of them. No line can take a fourth, since (1,2) and (2,1) do not join that diagonal.",
    "A line always passes through two points, so the answer is 2, and there is nothing more to take.",
  ],
  testInputs: ["5\n1 1\n2 2\n3 3\n1 2\n2 1\n", "2\n0 0\n5 5\n", "3\n0 0\n0 1\n0 2\n", "3\n0 0\n1 0\n2 1\n", "4\n0 0\n1 1\n2 2\n3 3\n", "6\n0 0\n1 0\n2 0\n0 1\n0 2\n5 5\n"],
  sol: `int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
int best=1;
for(int i=0;i<n;++i){
 map<pair<long long,long long>,int>dir;
 for(int j=0;j<n;++j){
  if(i==j)continue;
  long long dx=x[j]-x[i],dy=y[j]-y[i];
  long long g=std::gcd(llabs(dx),llabs(dy));
  if(g)  {dx/=g;dy/=g;}
  if(dx<0||(dx==0&&dy<0)){dx=-dx;dy=-dy;}
  best=max(best,1+(++dir[make_pair(dx,dy)]));}}
cout<<best<<"\\n";`,
  wrongNote: "Reducing a direction by integer division of the rise by the run collapses unrelated slopes onto the same key; skipping the pairs that share an x coordinate never counts a vertical line at all.",
  wrong: [
    `int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
int best=1;
for(int i=0;i<n;++i){
 map<long long,int>dir;int vert=0;
 for(int j=0;j<n;++j){
  if(i==j)continue;
  long long dx=x[j]-x[i],dy=y[j]-y[i];
  if(dx==0){best=max(best,1+(++vert));continue;}
  best=max(best,1+(++dir[dy/dx]));}}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
int best=1;
for(int i=0;i<n;++i){
 map<pair<long long,long long>,int>dir;
 for(int j=0;j<n;++j){
  if(i==j)continue;
  long long dx=x[j]-x[i],dy=y[j]-y[i];
  if(dx==0)continue;
  long long g=std::gcd(llabs(dx),llabs(dy));
  if(g)  {dx/=g;dy/=g;}
  if(dx<0){dx=-dx;dy=-dy;}
  best=max(best,1+(++dir[make_pair(dx,dy)]));}}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C412", judge: "dp-bitmask-count-matchings", topic: "dynamic-programming", rating: 2200,
  tag: "Bitmask dynamic programming", timeLimitMs: 2000,
  uz: "To‘liq juftlashtirishlar soni",
  en: "The number of perfect matchings",
  statementUz: "Sizda n ta ishchi va n ta vazifa bor. Jadvalning i-satri j-ustunidagi 1 raqami i-ishchi j-vazifani bajara olishini, 0 esa bajara olmasligini bildiradi. Har bir ishchiga aynan bitta vazifa, har bir vazifaga esa aynan bitta ishchi to‘g‘ri keladigan taqsimotlar nechta ekanini 10^9 + 7 modul bo‘yicha sanang. Umuman hech narsa qila olmaydigan ishchi bo‘lsa javob 0 bo‘ladi; javob juda tez o‘sgani uchun modul ostida chiqariladi.",
  statementEn: "You have n workers and n tasks. A 1 in row i, column j of the table means worker i can do task j, and a 0 means they cannot. Count, modulo 10^9 + 7, the assignments that give each worker exactly one task and each task exactly one worker. A worker who can do nothing at all makes the count 0, and the answer is reported under the modulus because it grows very quickly.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida 0 va 1 lardan iborat n ta son keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains n numbers, each 0 or 1.",
  outputUz: "Yagona butun sonni chiqaring — to‘liq taqsimotlar sonining 10^9 + 7 bo‘yicha qoldig‘i. Bunday taqsimot bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of complete assignments modulo 10^9 + 7. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 18", "each table entry is 0 or 1", "every worker takes exactly one task", "every task goes to exactly one worker", "the answer is reported modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ n ≤ 18", "jadvalning har bir katagi 0 yoki 1", "har bir ishchi aynan bitta vazifani oladi", "har bir vazifa aynan bitta ishchiga tegadi", "javob 10^9 + 7 modul bo‘yicha chiqariladi"],
  sampleInputs: ["2\n1 1\n1 1\n", "2\n1 0\n1 0\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Ikkala ishchi ham ikkala vazifani bajara oladi, ya'ni ikkita taqsimot bor: birinchi ishchi birinchi vazifani, yoki birinchi ishchi ikkinchi vazifani oladi.",
    "Ikkala ishchi ham faqat birinchi vazifani bajara oladi. Ikkinchi vazifa bajaruvchisiz qoladi, shuning uchun to‘liq taqsimot yo‘q va javob 0.",
  ],
  sampleNotesEn: [
    "Both workers can do both tasks, so there are two assignments: the first worker takes the first task, or the first worker takes the second one.",
    "Both workers can only do the first task, leaving the second one with nobody, so no complete assignment exists and the answer is 0.",
  ],
  testInputs: [
    "2\n1 1\n1 1\n",
    "2\n1 0\n1 0\n",
    "1\n1\n",
    "3\n1 1 1\n1 1 1\n1 1 1\n",
    "3\n1 0 0\n0 1 0\n0 0 1\n",
    "4\n1 1 0 0\n1 1 0 0\n0 0 1 1\n0 0 1 1\n",
  ],
  sol: `int n;cin>>n;const long long M=1000000007;
vector<int>row(n,0);
for(int i=0;i<n;++i)for(int j=0;j<n;++j){int v;cin>>v;if(v)row[i]|=1<<j;}
vector<long long>dp(1<<n,0);dp[0]=1;
for(int mask=0;mask<(1<<n);++mask){
 if(dp[mask]==0)continue;
 int i=__builtin_popcount(mask);
 if(i==n)continue;
 for(int j=0;j<n;++j){
  if((mask>>j)&1)continue;
  if(!((row[i]>>j)&1))continue;
  int nm=mask|(1<<j);
  dp[nm]=(dp[nm]+dp[mask])%M;}}
cout<<dp[(1<<n)-1]<<"\\n";`,
  wrongNote: "Multiplying each worker's number of choices lets two workers take the same task; adding up every state counts the partial assignments alongside the complete ones.",
  wrong: [
    `int n;cin>>n;const long long M=1000000007;
vector<int>row(n,0);
for(int i=0;i<n;++i)for(int j=0;j<n;++j){int v;cin>>v;if(v)row[i]|=1<<j;}
long long ans=1;
for(int i=0;i<n;++i)ans=ans*(long long)__builtin_popcount(row[i])%M;
cout<<ans<<"\\n";`,
    `int n;cin>>n;const long long M=1000000007;
vector<int>row(n,0);
for(int i=0;i<n;++i)for(int j=0;j<n;++j){int v;cin>>v;if(v)row[i]|=1<<j;}
vector<long long>dp(1<<n,0);dp[0]=1;
for(int mask=0;mask<(1<<n);++mask){
 if(dp[mask]==0)continue;
 int i=__builtin_popcount(mask);
 if(i==n)continue;
 for(int j=0;j<n;++j){
  if((mask>>j)&1)continue;
  if(!((row[i]>>j)&1))continue;
  int nm=mask|(1<<j);
  dp[nm]=(dp[nm]+dp[mask])%M;}}
long long ans=0;
for(int mask=0;mask<(1<<n);++mask)ans=(ans+dp[mask])%M;
cout<<ans<<"\\n";`,
  ],
});

export default P;
