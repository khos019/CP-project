/* Batch 600 — thirteen problems: five at 1700 (B600–B604), four at 1800
 * (C605–C608) and four at 1900 (C609–C612).
 *
 * Every task is a well-known contest problem restated for AlgoYo'l in our own
 * words, with our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B600", judge: "prefix-three-equal-sum-parts", topic: "two-pointers", rating: 1700,
  tag: "Prefix sums", timeLimitMs: 1000,
  uz: "Uchta teng qism",
  en: "Three equal parts",
  statementUz: "n ta butun sondan iborat massiv berilgan. Uni uchta bo‘sh bo‘lmagan ketma-ket qismga bo‘lish kerak: birinchi qism 1 dan i − 1 gacha, ikkinchisi i dan j gacha, uchinchisi j + 1 dan n gacha bo‘lgan elementlar (2 ≤ i ≤ j ≤ n − 1), va uchala qismning yig‘indilari teng bo‘lishi kerak. Bunday (i, j) juftliklar sonini toping. Elementlar manfiy ham bo‘lishi mumkin.",
  statementEn: "You are given an array of n integers. It has to be cut into three non-empty consecutive parts — elements 1 to i − 1, i to j, and j + 1 to n, with 2 ≤ i ≤ j ≤ n − 1 — so that the three parts have equal sums. Count the pairs (i, j) for which this holds. Elements may be negative.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Yagona butun sonni chiqaring — usullar soni.",
  outputEn: "Print a single integer — the number of ways.",
  constraintList: ["1 ≤ n ≤ 5·10^5", "|a_i| ≤ 10^9", "every part must be non-empty", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 5·10^5", "|a_i| ≤ 10^9", "har bir qism bo‘sh bo‘lmasligi kerak", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["6\n1 -1 1 -1 1 -1\n", "4\n1 1 1 1\n", "3\n0 0 0\n"],
  expect: ["1\n", "0\n", "1\n"],
  sampleNotesUz: [
    "Yig‘indi 0, har qism 0 bo‘lishi kerak: [1, −1], [1, −1], [1, −1] — yagona usul.",
    "Yig‘indi 4 uchga bo‘linmaydi.",
    "Har bir qismga bittadan nol.",
  ],
  sampleNotesEn: [
    "The total is 0, so each part must sum to 0: [1, −1], [1, −1], [1, −1] is the only way.",
    "The total 4 is not divisible by three.",
    "One zero goes to each part.",
  ],
  testInputs: ["6\n1 -1 1 -1 1 -1\n", "4\n1 1 1 1\n", "3\n0 0 0\n", "1\n0\n", "2\n0 0\n", "5\n1 2 3 0 3\n", "6\n0 0 0 0 0 0\n", "7\n3 -3 3 0 0 3 -3\n"],
  sol: `int n;cin>>n;vector<long long>a(n),p(n+1,0);for(int i=0;i<n;++i){cin>>a[i];p[i+1]=p[i]+a[i];}long long S=p[n];
if(S%3){cout<<0<<"\\n";return 0;}long long T=S/3,cnt=0,ans=0;
for(int j=2;j<=n-1;++j){if(p[j-1]==T)++cnt;if(p[j]==2*T)ans+=cnt;}cout<<ans<<"\\n";`,
  wrongNote: "Letting the middle part be empty counts cuts that leave only two parts; dividing a total that is not a multiple of three rounds it and finds parts that do not exist.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n),p(n+1,0);for(int i=0;i<n;++i){cin>>a[i];p[i+1]=p[i]+a[i];}long long S=p[n];
if(S%3){cout<<0<<"\\n";return 0;}long long T=S/3,cnt=0,ans=0;
for(int j=1;j<=n-1;++j){if(p[j]==T)++cnt;if(p[j]==2*T)ans+=cnt;}cout<<ans<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n),p(n+1,0);for(int i=0;i<n;++i){cin>>a[i];p[i+1]=p[i]+a[i];}long long S=p[n];
long long T=S/3,cnt=0,ans=0;
for(int j=2;j<=n-1;++j){if(p[j-1]==T)++cnt;if(p[j]==2*T)ans+=cnt;}cout<<ans<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + line(r.ints(n, -2, 2)) + "\n"; },
  slow: [`int n;cin>>n;vector<long long>a(n),p(n+1,0);for(int i=0;i<n;++i){cin>>a[i];p[i+1]=p[i]+a[i];}long long ans=0;
for(int i=2;i<=n-1;++i)for(int j=i;j<=n-1;++j){long long x=p[i-1],y=p[j]-p[i-1],z=p[n]-p[j];if(x==y&&y==z)++ans;}cout<<ans<<"\\n";`],
  big: [
    { seed: 1, note: "all zeros: about 1.25·10^11 ways", code: `n = 500000\nreturn str(n) + "\\n" + line([0] * n)` },
    { seed: 2, note: "small values, many zero prefixes", code: `n = 500000\nreturn str(n) + "\\n" + line(r.ints(n, -1, 1))` },
  ],
});

P.push({
  id: "B601", judge: "ds-lights-longest-dark-gap", topic: "data-structures", rating: 1700,
  tag: "Ordered sets", timeLimitMs: 2000,
  uz: "Chiroqlar qo‘yilmoqda",
  en: "Lights going up",
  statementUz: "Ko‘cha 0 dan x gacha bo‘lgan kesma, dastlab unda chiroq yo‘q. Ketma-ket n ta chiroq o‘rnatiladi: i-chiroq p_i nuqtaga qo‘yiladi, barcha p_i turli va 0 < p_i < x. Chiroqlar va ko‘cha uchlari ko‘chani bo‘laklarga ajratadi. Har bir chiroq o‘rnatilgandan keyin chiroqsiz eng uzun bo‘lak uzunligini chiqaring.",
  statementEn: "A street is the segment from 0 to x, and at first it has no lights. n lights are put up one after another: light i goes to point p_i, all p_i are distinct and 0 < p_i < x. The lights and the two ends of the street cut it into pieces. After each light is put up, print the length of the longest piece without a light inside.",
  inputUz: "Birinchi qatorda x va n beriladi. Ikkinchi qatorda n ta son p_1, …, p_n keladi.",
  inputEn: "The first line contains x and n. The second line contains the n numbers p_1, …, p_n.",
  outputUz: "Probel bilan ajratilgan n ta sonni chiqaring.",
  outputEn: "Print n numbers separated by spaces.",
  constraintList: ["1 ≤ x ≤ 10^9", "1 ≤ n ≤ 2·10^5", "0 < p_i < x", "all positions are distinct"],
  constraintListUz: ["1 ≤ x ≤ 10^9", "1 ≤ n ≤ 2·10^5", "0 < p_i < x", "barcha o‘rinlar turli"],
  sampleInputs: ["8 3\n3 6 2\n"],
  expect: ["5 3 3\n"],
  sampleNotesUz: [
    "3 dan keyin bo‘laklar 3 va 5; 6 dan keyin 3, 3, 2; 2 dan keyin 2, 1, 3, 2.",
  ],
  sampleNotesEn: [
    "After 3 the pieces are 3 and 5; after 6 they are 3, 3, 2; after 2 they are 2, 1, 3, 2.",
  ],
  testInputs: ["8 3\n3 6 2\n", "2 1\n1\n", "10 4\n1 2 3 4\n", "10 4\n9 8 7 6\n", "100 5\n50 25 75 12 88\n"],
  sol: `long long x;int n;cin>>x>>n;set<long long>s={0,x};multiset<long long>g={x};
for(int i=0;i<n;++i){long long p;cin>>p;auto it=s.upper_bound(p);long long r=*it,l=*prev(it);g.erase(g.find(r-l));g.insert(p-l);g.insert(r-p);s.insert(p);cout<<*g.rbegin()<<(i+1<n?' ':'\\n');}`,
  wrongNote: "Keeping the longest piece seen so far without removing the piece a new light splits never lets the answer fall; counting points instead of lengths makes every piece one longer.",
  wrong: [
    `long long x;int n;cin>>x>>n;set<long long>s={0,x};long long best=x;
for(int i=0;i<n;++i){long long p;cin>>p;auto it=s.upper_bound(p);long long r=*it,l=*prev(it);best=max({best,p-l,r-p});s.insert(p);cout<<best<<(i+1<n?' ':'\\n');}`,
    `long long x;int n;cin>>x>>n;set<long long>s={0,x};multiset<long long>g={x};
for(int i=0;i<n;++i){long long p;cin>>p;auto it=s.upper_bound(p);long long r=*it,l=*prev(it);g.erase(g.find(r-l));g.insert(p-l);g.insert(r-p);s.insert(p);cout<<*g.rbegin()+1<<(i+1<n?' ':'\\n');}`,
  ],
  gen: (r) => { const x = r.int(2, 15); const n = r.int(1, x - 1); return line([x, n]) + "\n" + line(r.shuffle(Array.from({ length: x - 1 }, (_, i) => i + 1)).slice(0, n)) + "\n"; },
  slow: [`long long x;int n;cin>>x>>n;vector<long long>v={0,x};
for(int i=0;i<n;++i){long long p;cin>>p;v.push_back(p);sort(v.begin(),v.end());long long b=0;for(size_t j=1;j<v.size();++j)b=max(b,v[j]-v[j-1]);cout<<b<<(i+1<n?' ':'\\n');}`],
  big: [
    { seed: 1, note: "70000 random lights (the output stays under the 1 MB cap)", code: `n = 70000\nreturn line([10**9, n]) + "\\n" + line(r.shuffle(list(range(1, 10**9, 14000)))[:n])` },
  ],
});

P.push({
  id: "B602", judge: "graph-odd-sum-labellings", topic: "graphs", rating: 1700,
  tag: "Bipartite graphs", timeLimitMs: 2000,
  uz: "Toq yig‘indili qirralar",
  en: "Edges with odd sums",
  statementUz: "n ta uch va m ta qirradan iborat yo‘naltirilmagan graf berilgan; karrali qirralar va halqalar yo‘q. Har bir uchga 1, 2 yoki 3 sonlaridan birini yozish kerak, shunday qilib har bir qirraning ikki uchidagi sonlar yig‘indisi toq bo‘lsin. Buni nechta usulda qilish mumkin? Javobni 998244353 ga bo‘lgandagi qoldiqni chiqaring. Graf bog‘lamli bo‘lishi shart emas.",
  statementEn: "You are given an undirected graph with n vertices and m edges, without repeated edges or loops. Each vertex must get one of the numbers 1, 2 or 3 so that the two numbers at the ends of every edge have an odd sum. In how many ways can this be done? Print the answer modulo 998244353. The graph need not be connected.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir testning birinchi qatorida n va m, keyingi m ta qatorda qirralar.",
  inputEn: "The first line contains the number of test cases t. Each test case starts with a line holding n and m, followed by m lines with the edges.",
  outputUz: "Har bir test uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each test case print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 3·10^5", "1 ≤ n ≤ 3·10^5, 0 ≤ m ≤ 3·10^5", "the sums of n and of m over all tests are each ≤ 3·10^5", "no repeated edges and no loops"],
  constraintListUz: ["1 ≤ t ≤ 3·10^5", "1 ≤ n ≤ 3·10^5, 0 ≤ m ≤ 3·10^5", "barcha testlar bo‘yicha n lar va m lar yig‘indisi har biri ≤ 3·10^5", "karrali qirralar va halqalar yo‘q"],
  sampleInputs: ["2\n2 1\n1 2\n3 3\n1 2\n2 3\n3 1\n", "1\n4 2\n1 2\n3 4\n"],
  expect: ["4\n0\n", "16\n"],
  sampleNotesUz: [
    "Birinchi testda bir uch juft (2), ikkinchisi toq (1 yoki 3): 2 + 2 = 4 usul. Ikkinchi testda toq uzunlikdagi sikl bor — imkonsiz.",
    "Har bir qirra alohida 4 usul beradi: 4 · 4 = 16.",
  ],
  sampleNotesEn: [
    "In the first test one end is even (2) and the other odd (1 or 3): 2 + 2 = 4 ways. In the second there is a cycle of odd length, so it is impossible.",
    "Each edge on its own gives 4 ways: 4 · 4 = 16.",
  ],
  testInputs: ["2\n2 1\n1 2\n3 3\n1 2\n2 3\n3 1\n", "1\n4 2\n1 2\n3 4\n", "1\n1 0\n", "1\n3 0\n", "1\n4 4\n1 2\n2 3\n3 4\n4 1\n", "1\n5 3\n1 2\n1 3\n1 4\n"],
  sol: `const long long M=998244353;int t;cin>>t;vector<long long>pw(300002,1);for(int i=1;i<=300001;++i)pw[i]=pw[i-1]*2%M;
while(t--){int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>col(n+1,-1);long long ans=1;for(int s=1;s<=n&&ans;++s){if(col[s]>=0)continue;col[s]=0;int c[2]={0,0};vector<int>st={s};bool ok=true;
 while(!st.empty()){int u=st.back();st.pop_back();c[col[u]]++;for(int v:g[u]){if(col[v]<0){col[v]=col[u]^1;st.push_back(v);}else if(col[v]==col[u])ok=false;}}
 ans=ok?ans*((pw[c[0]]+pw[c[1]])%M)%M:0;}
cout<<ans<<"\\n";}`,
  wrongNote: "Treating the whole graph as one two-colouring multiplies the components' choices wrongly; skipping the vertices without edges drops their factor of three.",
  wrong: [
    `const long long M=998244353;int t;cin>>t;vector<long long>pw(300002,1);for(int i=1;i<=300001;++i)pw[i]=pw[i-1]*2%M;
while(t--){int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>col(n+1,-1);int c[2]={0,0};bool ok=true;for(int s=1;s<=n;++s){if(col[s]>=0)continue;col[s]=0;vector<int>st={s};
 while(!st.empty()){int u=st.back();st.pop_back();c[col[u]]++;for(int v:g[u]){if(col[v]<0){col[v]=col[u]^1;st.push_back(v);}else if(col[v]==col[u])ok=false;}}}
cout<<(ok?(pw[c[0]]+pw[c[1]])%M:0)<<"\\n";}`,
    `const long long M=998244353;int t;cin>>t;vector<long long>pw(300002,1);for(int i=1;i<=300001;++i)pw[i]=pw[i-1]*2%M;
while(t--){int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>col(n+1,-1);long long ans=1;for(int s=1;s<=n&&ans;++s){if(col[s]>=0||g[s].empty())continue;col[s]=0;int c[2]={0,0};vector<int>st={s};bool ok=true;
 while(!st.empty()){int u=st.back();st.pop_back();c[col[u]]++;for(int v:g[u]){if(col[v]<0){col[v]=col[u]^1;st.push_back(v);}else if(col[v]==col[u])ok=false;}}
 ans=ok?ans*((pw[c[0]]+pw[c[1]])%M)%M:0;}
cout<<ans<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 2); let s = t + "\n"; for (let k = 0; k < t; k++) { const n = r.int(1, 7); const all = []; for (let i = 1; i <= n; i++) for (let j = i + 1; j <= n; j++) all.push([i, j]); r.shuffle(all); const m = r.int(0, Math.min(all.length, 7)); s += line([n, m]) + "\n" + all.slice(0, m).map((e) => line(e) + "\n").join(""); } return s; },
  brute: `int t;cin>>t;while(t--){int n,m;cin>>n>>m;vector<pair<int,int>>e(m);for(auto&x:e)cin>>x.first>>x.second;vector<int>a(n+1);long long c=0;
function<void(int)>go=[&](int i){if(i>n){for(auto&x:e)if((a[x.first]+a[x.second])%2==0)return;++c;return;}for(int v=1;v<=3;++v){a[i]=v;go(i+1);}};go(1);cout<<c%998244353<<"\\n";}`,
  big: [
    { seed: 1, note: "one large bipartite graph", code: `n, m = 300000, 300000\nleft = n // 2\nseen = set()\ne = []\nfor i in range(1, n):\n    e.append((i, i + 1))\n    seen.add((i, i + 1))\nwhile len(e) < m:\n    a = 2 * r.int(1, left) - 1\n    b = 2 * r.int(1, left)\n    k = (min(a, b), max(a, b))\n    if k not in seen:\n        seen.add(k)\n        e.append(k)\nreturn "1\\n" + line([n, m]) + "\\n" + "\\n".join(line(x) for x in e)` },
    { seed: 2, note: "many tiny tests", code: `rows = []\nfor _ in range(100000):\n    rows.append("3 1\\n1 2")\nreturn "100000\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "B603", judge: "math-digit-of-the-long-string", topic: "math", rating: 1700,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Uzun qatordagi raqam",
  en: "A digit of the long string",
  statementUz: "Barcha musbat butun sonlar o‘sish tartibida, orasiga hech narsa qo‘yilmasdan yozilgan: 123456789101112131415… Raqamlar 1 dan boshlab raqamlangan. q ta so‘rovning har birida k soni beriladi: shu qatorning k-raqamini toping. Masalan, 11-raqam 10 sonining ikkinchi raqami, ya'ni 0.",
  statementEn: "All positive integers are written in increasing order with nothing between them: 123456789101112131415… The digits are numbered from 1. Each of q queries gives a number k: find the k-th digit of this string. For example, the 11th digit is the second digit of 10, that is 0.",
  inputUz: "Birinchi qatorda q beriladi. Keyingi q ta qatorning har birida bitta k soni keladi.",
  inputEn: "The first line contains q. Each of the next q lines contains one number k.",
  outputUz: "Har bir so‘rov uchun alohida qatorda raqamni chiqaring.",
  outputEn: "For each query print the digit on its own line.",
  constraintList: ["1 ≤ q ≤ 1000", "1 ≤ k ≤ 10^18", "digits are numbered from 1", "the numbers have no leading zeros"],
  constraintListUz: ["1 ≤ q ≤ 1000", "1 ≤ k ≤ 10^18", "raqamlar 1 dan raqamlanadi", "sonlar boshida nol yo‘q"],
  sampleInputs: ["4\n1\n10\n11\n190\n"],
  expect: ["1\n1\n0\n1\n"],
  sampleNotesUz: [
    "1–9 raqamlar bir xonali sonlar. 10- va 11-raqamlar 10 sonining 1 va 0 raqamlari. Ikki xonali sonlar 180 ta raqam egallaydi, demak 190-raqam 100 ning birinchi raqami.",
  ],
  sampleNotesEn: [
    "Digits 1–9 are the one-digit numbers. Digits 10 and 11 are the 1 and 0 of 10. The two-digit numbers take 180 digits, so digit 190 is the first digit of 100.",
  ],
  testInputs: ["4\n1\n10\n11\n190\n", "1\n1000000000000000000\n", "5\n9\n189\n2889\n2890\n38889\n", "3\n999999999999999999\n123456789012345678\n500000000000000000\n"],
  sol: `int q;cin>>q;while(q--){long long k;cin>>k;long long d=1,cnt=9,start=1;
while(k>(__int128)d*cnt){k-=d*cnt;++d;cnt*=10;start*=10;}
long long num=start+(k-1)/d;string s=to_string(num);cout<<s[(k-1)%d]<<"\\n";}`,
  wrongNote: "Counting the numbers of each length instead of their digits skips the block boundaries in the wrong places; indexing the digit inside the number from 1 instead of 0 reads the next digit.",
  wrong: [
    `int q;cin>>q;while(q--){long long k;cin>>k;long long d=1,cnt=9,start=1;
while(k>cnt){k-=cnt;++d;cnt*=10;start*=10;}
long long num=start+(k-1)/d;string s=to_string(num);cout<<s[(k-1)%d]<<"\\n";}`,
    `int q;cin>>q;while(q--){long long k;cin>>k;long long d=1,cnt=9,start=1;
while(k>(__int128)d*cnt){k-=d*cnt;++d;cnt*=10;start*=10;}
long long num=start+(k-1)/d;string s=to_string(num)+"0";cout<<s[k%d]<<"\\n";}`,
  ],
  gen: (r) => { const q = r.int(1, 6); return q + "\n" + r.ints(q, 1, 3000).join("\n") + "\n"; },
  brute: `string s;for(int i=1;s.size()<5000;++i)s+=to_string(i);int q;cin>>q;while(q--){long long k;cin>>k;cout<<s[k-1]<<"\\n";}`,
  big: [
    { seed: 1, note: "1000 huge positions", code: `return "1000\\n" + "\\n".join(str(r.int(10**17, 10**18)) for _ in range(1000))` },
  ],
});

P.push({
  id: "B604", judge: "str-longest-removable-keep-subseq", topic: "strings", rating: 1700,
  tag: "Prefix and suffix matching", timeLimitMs: 1000,
  uz: "Olib tashlansa ham qoladi",
  en: "Still there after the cut",
  statementUz: "Kichik lotin harflaridan iborat s va t qatorlari berilgan, va t qatori s ning qism ketma-ketligi — ya'ni s dan ba'zi harflarni o‘chirib, qolganlar tartibini o‘zgartirmay t ni olish mumkin. s dan bitta ketma-ket bo‘lakni (bo‘sh ham bo‘lishi mumkin) olib tashlaysiz, shunday qilib t hamon qolgan qatorning qism ketma-ketligi bo‘lib qolsin. Olib tashlanadigan bo‘lakning eng katta uzunligini toping.",
  statementEn: "You are given strings s and t of lowercase Latin letters, and t is a subsequence of s — it can be obtained by deleting some letters of s without changing the order of the rest. You remove one contiguous piece of s (possibly empty) so that t is still a subsequence of what remains. Find the greatest possible length of the removed piece.",
  inputUz: "Birinchi qatorda s, ikkinchi qatorda t beriladi.",
  inputEn: "The first line contains s and the second contains t.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun bo‘lak uzunligi.",
  outputEn: "Print a single integer — the greatest length of the piece.",
  constraintList: ["1 ≤ |t| ≤ |s| ≤ 2·10^5", "t is a subsequence of s", "the removed piece is contiguous", "both strings use lowercase letters"],
  constraintListUz: ["1 ≤ |t| ≤ |s| ≤ 2·10^5", "t — s ning qism ketma-ketligi", "olib tashlanadigan bo‘lak ketma-ket", "ikkala qator ham kichik harflardan iborat"],
  sampleInputs: ["abcde\nace\n", "aaaa\naa\n", "xyz\nxyz\n"],
  expect: ["1\n", "2\n", "0\n"],
  sampleNotesUz: [
    "b yoki d ni olib tashlash mumkin, ikki harfni birdan — yo‘q.",
    "Istalgan ikki qo‘shni a ni olib tashlaymiz.",
    "Hamma harf kerak.",
  ],
  sampleNotesEn: [
    "The b or the d can be removed, but no two letters together.",
    "Any two neighbouring a's can go.",
    "Every letter is needed.",
  ],
  testInputs: ["abcde\nace\n", "aaaa\naa\n", "xyz\nxyz\n", "bbaba\nbb\n", "abcabc\nabc\n", "a\na\n", "zzzazzz\na\n", "abacaba\naa\n"],
  sol: `string s,t;cin>>s>>t;int n=s.size(),m=t.size();vector<int>pre(m),suf(m);
for(int i=0,j=0;i<n&&j<m;++i)if(s[i]==t[j])pre[j++]=i;for(int i=n-1,j=m-1;i>=0&&j>=0;--i)if(s[i]==t[j])suf[j--]=i;
int best=max(suf[0],n-1-pre[m-1]);for(int i=0;i+1<m;++i)best=max(best,suf[i+1]-pre[i]-1);cout<<best<<"\\n";`,
  wrongNote: "Trying only to cut off a beginning or an end misses the gap in the middle; matching both halves as early as possible leaves the gap between them too short.",
  wrong: [
    `string s,t;cin>>s>>t;int n=s.size(),m=t.size();vector<int>pre(m),suf(m);
for(int i=0,j=0;i<n&&j<m;++i)if(s[i]==t[j])pre[j++]=i;for(int i=n-1,j=m-1;i>=0&&j>=0;--i)if(s[i]==t[j])suf[j--]=i;
cout<<max(suf[0],n-1-pre[m-1])<<"\\n";`,
    `string s,t;cin>>s>>t;int n=s.size(),m=t.size();vector<int>pre(m);
for(int i=0,j=0;i<n&&j<m;++i)if(s[i]==t[j])pre[j++]=i;
int best=max(pre[0],n-1-pre[m-1]);for(int i=0;i+1<m;++i)best=max(best,pre[i+1]-pre[i]-1);cout<<best<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); const s = r.str(n, "ab"); const keep = s.split("").filter(() => r.int(0, 1)).join(""); return s + "\n" + (keep || s[0]) + "\n"; },
  slow: [`string s,t;cin>>s>>t;int n=s.size(),m=t.size();int best=0;
auto sub=[&](int l,int len){int j=0;for(int i=0;i<n&&j<m;++i){if(i>=l&&i<l+len)continue;if(s[i]==t[j])++j;}return j==m;};
for(int l=0;l<n;++l)for(int len=best+1;l+len<=n;++len){if(sub(l,len))best=len;else break;}cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "t a short subsequence spread over a long s", code: `n = 200000\ns = text(r, n, "ab")\nt = s[0] + s[n // 2] + s[-1]\nreturn s + "\\n" + t` },
    { seed: 2, note: "t almost all of s", code: `n = 200000\ns = text(r, n, "abc")\nt = s[:n // 2] + s[n // 2 + 1000:]\nreturn s + "\\n" + t` },
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "C605", judge: "greedy-k-viewers-movies", topic: "greedy", rating: 1800,
  tag: "Greedy with a multiset", timeLimitMs: 1000,
  uz: "Kinofestival, k tomoshabin",
  en: "A film festival for k viewers",
  statementUz: "Festivalda n ta film namoyish qilinadi, i-film a_i vaqtda boshlanib b_i vaqtda tugaydi. k kishilik guruh kelgan; har bir film ko‘pi bilan bitta odam tomonidan ko‘riladi, va har bir odam filmni boshidan oxirigacha ko‘radi — bir odam bir vaqtning o‘zida ikki filmni ko‘ra olmaydi. Film tugagan paytda boshlanadigan boshqa filmni o‘sha odam ko‘ra oladi. Guruh jami eng ko‘pi bilan nechta film ko‘ra oladi?",
  statementEn: "n films are shown at a festival, film i starting at time a_i and ending at time b_i. A group of k people comes; every film is watched by at most one person, and every person watches a film from start to end — nobody can watch two films at once. A film starting exactly when another ends can be watched by the same person. What is the largest total number of films the group can watch?",
  inputUz: "Birinchi qatorda n va k beriladi. Keyingi n ta qatorning har birida a_i va b_i keladi.",
  inputEn: "The first line contains n and k. Each of the next n lines contains a_i and b_i.",
  outputUz: "Yagona butun sonni chiqaring — ko‘riladigan filmlarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of films watched.",
  constraintList: ["1 ≤ k ≤ n ≤ 2·10^5", "1 ≤ a_i < b_i ≤ 10^9", "a film may start at the moment another ends", "each film is watched by at most one person"],
  constraintListUz: ["1 ≤ k ≤ n ≤ 2·10^5", "1 ≤ a_i < b_i ≤ 10^9", "film boshqasi tugagan paytda boshlanishi mumkin", "har bir filmni ko‘pi bilan bitta odam ko‘radi"],
  sampleInputs: ["5 2\n1 5\n8 10\n3 6\n2 5\n6 9\n", "3 1\n1 2\n2 3\n3 4\n"],
  expect: ["4\n", "3\n"],
  sampleNotesUz: [
    "Birinchi odam [1, 5] va [6, 9], ikkinchisi [2, 5] va [8, 10] ni ko‘radi. [3, 6] ga joy qolmaydi.",
    "Filmlar bir-biridan keyin darhol boshlanadi — bitta odam hammasini ko‘radi.",
  ],
  sampleNotesEn: [
    "One person watches [1, 5] and [6, 9], the other [2, 5] and [8, 10]; there is no room for [3, 6].",
    "Each film starts as the previous one ends, so one person sees all three.",
  ],
  testInputs: ["5 2\n1 5\n8 10\n3 6\n2 5\n6 9\n", "3 1\n1 2\n2 3\n3 4\n", "1 1\n1 1000000000\n", "4 4\n1 10\n1 10\n1 10\n1 10\n", "6 2\n1 3\n2 4\n3 5\n4 6\n5 7\n1 7\n", "5 2\n1 4\n2 3\n3 6\n5 8\n7 9\n", "4 2\n1 2\n1 5\n5 6\n3 7\n"],
  sol: `int n,k;cin>>n>>k;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;sort(f.begin(),f.end(),[](auto&a,auto&b){return a.second<b.second;});
multiset<long long>ends;int c=0;for(auto&[a,b]:f){auto it=ends.upper_bound(a);if(it!=ends.begin()){--it;ends.erase(it);ends.insert(b);++c;}else if((int)ends.size()<k){ends.insert(b);++c;}}
cout<<c<<"\\n";`,
  wrongNote: "Refusing a film that starts exactly when a person's last film ends throws away a free fit; handing a film to the person who has been free the longest wastes the person who finished just in time.",
  wrong: [
    `int n,k;cin>>n>>k;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;sort(f.begin(),f.end(),[](auto&a,auto&b){return a.second<b.second;});
multiset<long long>ends;int c=0;for(auto&[a,b]:f){auto it=ends.lower_bound(a);if(it!=ends.begin()){--it;ends.erase(it);ends.insert(b);++c;}else if((int)ends.size()<k){ends.insert(b);++c;}}
cout<<c<<"\\n";`,
    `int n,k;cin>>n>>k;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;sort(f.begin(),f.end(),[](auto&a,auto&b){return a.second<b.second;});
multiset<long long>ends;int c=0;for(auto&[a,b]:f){if(!ends.empty()&&*ends.begin()<=a){ends.erase(ends.begin());ends.insert(b);++c;}else if((int)ends.size()<k){ends.insert(b);++c;}}
cout<<c<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7), k = r.int(1, n); let s = line([n, k]) + "\n"; for (let i = 0; i < n; i++) { const a = r.int(1, 10); s += line([a, r.int(a + 1, 12)]) + "\n"; } return s; },
  brute: `int n,k;cin>>n>>k;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;int best=0;vector<int>who(n);
function<void(int,int)>go=[&](int i,int c){if(i==n){for(int p=1;p<=k;++p){vector<pair<long long,long long>>v;for(int j=0;j<n;++j)if(who[j]==p)v.push_back(f[j]);sort(v.begin(),v.end());for(size_t j=1;j<v.size();++j)if(v[j].first<v[j-1].second)return;}best=max(best,c);return;}
 for(int p=0;p<=k;++p){who[i]=p;go(i+1,c+(p>0));}};go(0,0);cout<<best<<"\\n";`,
  slow: [`int n,k;cin>>n>>k;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;sort(f.begin(),f.end(),[](auto&a,auto&b){return a.second<b.second;});
vector<long long>ends;int c=0;for(auto&[a,b]:f){int bi=-1;for(size_t i=0;i<ends.size();++i)if(ends[i]<=a&&(bi<0||ends[i]>ends[bi]))bi=i;if(bi>=0){ends[bi]=b;++c;}else if((int)ends.size()<k){ends.push_back(b);++c;}}
cout<<c<<"\\n";`],
  big: [
    { seed: 1, note: "many viewers, short films", code: `n, k = 200000, 100000\nrows = []\nfor _ in range(n):\n    a = r.int(1, 10**9 - 100)\n    rows.append(line([a, a + r.int(1, 100)]))\nreturn line([n, k]) + "\\n" + "\\n".join(rows)` },
    { seed: 2, note: "few viewers, long films", code: `n, k = 200000, 3\nrows = []\nfor _ in range(n):\n    a = r.int(1, 10**9 - 10**6)\n    rows.append(line([a, a + r.int(1, 10**6)]))\nreturn line([n, k]) + "\\n" + "\\n".join(rows)` },
    { seed: 3, note: "every film overlaps every other: 10^5 viewers all busy", code: `n, k = 200000, 100000\nreturn line([n, k]) + "\\n" + "\\n".join(line([r.int(1, 1000), r.int(10**8, 10**9)]) for _ in range(n))` },
  ],
});

P.push({
  id: "C606", judge: "ds-max-sum-length-in-range", topic: "data-structures", rating: 1800,
  tag: "Sliding window minimum", timeLimitMs: 1000,
  uz: "Uzunligi chegaralangan eng katta yig‘indi",
  en: "The largest sum of bounded length",
  statementUz: "n ta butun sondan iborat massiv va a, b sonlari berilgan. Uzunligi a dan kichik bo‘lmagan va b dan katta bo‘lmagan ketma-ket bo‘laklar ichida elementlar yig‘indisi eng katta bo‘lganini toping va shu yig‘indini chiqaring. Elementlar manfiy bo‘lishi mumkin, shuning uchun javob ham manfiy bo‘lishi mumkin.",
  statementEn: "You are given an array of n integers and numbers a and b. Among the segments of consecutive elements whose length is at least a and at most b, find the one with the largest sum and print that sum. Elements may be negative, so the answer may be negative too.",
  inputUz: "Birinchi qatorda n, a va b beriladi. Ikkinchi qatorda n ta son keladi.",
  inputEn: "The first line contains n, a and b. The second line contains the n numbers.",
  outputUz: "Yagona butun sonni chiqaring — eng katta yig‘indi.",
  outputEn: "Print a single integer — the largest sum.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a ≤ b ≤ n", "−10^9 ≤ x_i ≤ 10^9", "the answer can exceed 2^31 in absolute value"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a ≤ b ≤ n", "−10^9 ≤ x_i ≤ 10^9", "javob moduli 2^31 dan oshishi mumkin"],
  sampleInputs: ["5 2 3\n1 -2 3 -1 4\n", "3 1 1\n-5 -2 -9\n"],
  expect: ["6\n", "-2\n"],
  sampleNotesUz: [
    "3 −1 4 bo‘lagi (uzunligi 3) 6 beradi.",
    "Faqat bitta elementli bo‘laklar, eng kattasi −2.",
  ],
  sampleNotesEn: [
    "The segment 3 −1 4 (length 3) gives 6.",
    "Only single elements are allowed, and the largest is −2.",
  ],
  testInputs: ["5 2 3\n1 -2 3 -1 4\n", "3 1 1\n-5 -2 -9\n", "3 2 2\n5 -10 5\n", "1 1 1\n-1000000000\n", "8 1 2\n-1 3 -2 5 3 -5 2 2\n", "6 3 6\n1000000000 1000000000 1000000000 1000000000 1000000000 1000000000\n"],
  sol: `int n,a,b;cin>>n>>a>>b;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}
deque<int>d;long long best=LLONG_MIN;for(int r=a;r<=n;++r){int add=r-a;while(!d.empty()&&p[d.back()]>=p[add])d.pop_back();d.push_back(add);while(d.front()<r-b)d.pop_front();best=max(best,p[r]-p[d.front()]);}
cout<<best<<"\\n";`,
  wrongNote: "Dropping the lower bound on the length lets a short segment win; starting the best sum at 0 reports an empty segment when every allowed segment is negative.",
  wrong: [
    `int n,a,b;cin>>n>>a>>b;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}
deque<int>d;long long best=LLONG_MIN;for(int r=1;r<=n;++r){int add=r-1;while(!d.empty()&&p[d.back()]>=p[add])d.pop_back();d.push_back(add);while(d.front()<r-b)d.pop_front();best=max(best,p[r]-p[d.front()]);}
cout<<best<<"\\n";`,
    `int n,a,b;cin>>n>>a>>b;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}
deque<int>d;long long best=0;for(int r=a;r<=n;++r){int add=r-a;while(!d.empty()&&p[d.back()]>=p[add])d.pop_back();d.push_back(add);while(d.front()<r-b)d.pop_front();best=max(best,p[r]-p[d.front()]);}
cout<<best<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 9), a = r.int(1, n), b = r.int(a, n); return line([n, a, b]) + "\n" + line(r.ints(n, -6, 6)) + "\n"; },
  slow: [`int n,a,b;cin>>n>>a>>b;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}long long best=LLONG_MIN;
for(int l=0;l<n;++l)for(int len=a;len<=b&&l+len<=n;++len)best=max(best,p[l+len]-p[l]);cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "any length allowed: checking every pair is quadratic", code: `n = 200000\nreturn line([n, 1, n]) + "\\n" + line(r.ints(n, -10**9, 10**9))` },
    { seed: 2, note: "a narrow band of lengths", code: `n = 200000\nreturn line([n, 50000, 60000]) + "\\n" + line(r.ints(n, -10**9, 10**9))` },
  ],
});

P.push({
  id: "C607", judge: "tree-best-white-minus-black", topic: "trees", rating: 1800,
  tag: "Rerooting DP", timeLimitMs: 2000,
  uz: "Oqlar qoralardan ko‘p",
  en: "More white than black",
  statementUz: "n ta uchdan iborat daraxt berilgan, har bir uch oq (1) yoki qora (0). Daraxtning bog‘lamli qismi — uchlarning shunday to‘plamiki, ulardan istalgan ikkitasi orasidagi yo‘l to‘liq shu to‘plam ichida yotadi. Har bir v uch uchun v ni o‘z ichiga olgan bog‘lamli qismlar ichida (oq uchlar soni) − (qora uchlar soni) ning eng katta qiymatini toping.",
  statementEn: "You are given a tree with n vertices, each vertex white (1) or black (0). A connected part of the tree is a set of vertices such that the path between any two of them lies entirely inside the set. For every vertex v find the largest value of (number of white vertices) − (number of black vertices) over the connected parts that contain v.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son — uchlar rangi. Keyingi n − 1 ta qatorda qirralar.",
  inputEn: "The first line contains n. The second line contains n numbers — the colours of the vertices. The next n − 1 lines contain the edges.",
  outputUz: "Probel bilan ajratilgan n ta sonni chiqaring — 1- dan n-uchgacha javoblar.",
  outputEn: "Print n numbers separated by spaces — the answers for vertices 1 to n.",
  constraintList: ["2 ≤ n ≤ 2·10^5", "each colour is 0 or 1", "the edges form a tree", "the part must contain v itself"],
  constraintListUz: ["2 ≤ n ≤ 2·10^5", "har bir rang 0 yoki 1", "qirralar daraxt hosil qiladi", "qism v ning o‘zini o‘z ichiga olishi kerak"],
  sampleInputs: ["4\n1 0 1 1\n1 2\n2 3\n2 4\n", "2\n0 0\n1 2\n"],
  expect: ["2 2 2 2\n", "-1 -1\n"],
  sampleNotesUz: [
    "Butun daraxt uchta oq va bitta qora: 3 − 1 = 2, va bu har bir uch uchun eng yaxshisi.",
    "Har bir uch o‘zi bilan qora, qo‘shni ham qora: eng yaxshisi −1.",
  ],
  sampleNotesEn: [
    "The whole tree has three white and one black vertex: 3 − 1 = 2, the best for every vertex.",
    "Each vertex is black, and so is its neighbour: the best is −1.",
  ],
  testInputs: ["4\n1 0 1 1\n1 2\n2 3\n2 4\n", "2\n0 0\n1 2\n", "2\n1 0\n2 1\n", "5\n1 0 0 1 1\n1 2\n2 3\n3 4\n4 5\n", "7\n0 1 1 1 0 0 1\n1 2\n1 3\n1 4\n3 5\n3 6\n6 7\n"],
  sol: `int n;cin>>n;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order={1},par(n+1,0);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>dn(n+1),up(n+1);for(int k=n-1;k>=0;--k){int u=order[k];dn[u]+=c[u]?1:-1;if(par[u]>0)dn[par[u]]+=max(0LL,dn[u]);}
up[1]=dn[1];for(int k=1;k<n;++k){int u=order[k];up[u]=dn[u]+max(0LL,up[par[u]]-max(0LL,dn[u]));}
for(int i=1;i<=n;++i)cout<<up[i]<<(i<n?' ':'\\n');`,
  wrongNote: "Looking only below each vertex never lets a part grow towards the root; passing a parent's whole answer down counts the child's own subtree twice.",
  wrong: [
    `int n;cin>>n;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order={1},par(n+1,0);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>dn(n+1);for(int k=n-1;k>=0;--k){int u=order[k];dn[u]+=c[u]?1:-1;if(par[u]>0)dn[par[u]]+=max(0LL,dn[u]);}
for(int i=1;i<=n;++i)cout<<dn[i]<<(i<n?' ':'\\n');`,
    `int n;cin>>n;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order={1},par(n+1,0);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>dn(n+1),up(n+1);for(int k=n-1;k>=0;--k){int u=order[k];dn[u]+=c[u]?1:-1;if(par[u]>0)dn[par[u]]+=max(0LL,dn[u]);}
up[1]=dn[1];for(int k=1;k<n;++k){int u=order[k];up[u]=dn[u]+max(0LL,up[par[u]]);}
for(int i=1;i<=n;++i)cout<<up[i]<<(i<n?' ':'\\n');`,
  ],
  gen: (r) => { const n = r.int(2, 8); return n + "\n" + line(r.ints(n, 0, 1)) + "\n" + r.tree(n).map((e) => line(e)).join("\n") + "\n"; },
  slow: [`int n;cin>>n;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
for(int s=1;s<=n;++s){vector<int>order={s},par(n+1,0);par[s]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
 vector<long long>dn(n+1,0);for(int k=n-1;k>=0;--k){int u=order[k];dn[u]+=c[u]?1:-1;if(par[u]>0)dn[par[u]]+=max(0LL,dn[u]);}cout<<dn[s]<<(s<n?' ':'\\n');}`],
  big: [
    { seed: 1, note: "a random tree of 10^5 vertices (output under 1 MB)", code: `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, 0, 1)) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n))` },
    { seed: 2, note: "a path: deep, so recursion is risky", code: `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, 0, 1)) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n, "path"))` },
  ],
});

P.push({
  id: "C608", judge: "dp-knapsack-heavy-bag", topic: "dynamic-programming", rating: 1800,
  tag: "Knapsack by value", timeLimitMs: 1000,
  uz: "Og‘ir xalta",
  en: "A very large bag",
  statementUz: "n ta buyum bor, i-buyumning og‘irligi w_i, qiymati v_i. Siz ko‘pi bilan W og‘irlikni ko‘tara oladigan xaltaga ba'zi buyumlarni solasiz; har bir buyum ko‘pi bilan bir marta olinadi. Tanlangan buyumlar og‘irliklari yig‘indisi W dan oshmasligi kerak. Tanlangan buyumlar qiymatlari yig‘indisining eng katta qiymatini toping. E'tibor bering: W juda katta bo‘lishi mumkin, qiymatlar esa kichik.",
  statementEn: "There are n items, item i weighing w_i and worth v_i. You put some of them into a bag that can carry at most W; each item is taken at most once. The total weight of the chosen items must not exceed W. Find the largest possible total value of the chosen items. Note that W can be very large while the values are small.",
  inputUz: "Birinchi qatorda n va W beriladi. Keyingi n ta qatorning har birida w_i va v_i keladi.",
  inputEn: "The first line contains n and W. Each of the next n lines contains w_i and v_i.",
  outputUz: "Yagona butun sonni chiqaring — eng katta umumiy qiymat.",
  outputEn: "Print a single integer — the largest total value.",
  constraintList: ["1 ≤ n ≤ 100", "1 ≤ W ≤ 10^9", "1 ≤ w_i ≤ 10^9", "1 ≤ v_i ≤ 1000"],
  constraintListUz: ["1 ≤ n ≤ 100", "1 ≤ W ≤ 10^9", "1 ≤ w_i ≤ 10^9", "1 ≤ v_i ≤ 1000"],
  sampleInputs: ["4 10\n5 10\n4 40\n6 30\n3 50\n", "1 1\n2 1000\n"],
  expect: ["90\n", "0\n"],
  sampleNotesUz: [
    "4 va 3 og‘irlikdagi buyumlar 40 + 50 = 90 beradi; ularga yana birontasini qo‘shib bo‘lmaydi.",
    "Yagona buyum xaltaga sig‘maydi.",
  ],
  sampleNotesEn: [
    "The items of weight 4 and 3 give 40 + 50 = 90, and nothing else fits beside them.",
    "The only item does not fit.",
  ],
  testInputs: ["4 10\n5 10\n4 40\n6 30\n3 50\n", "1 1\n2 1000\n", "3 1000000000\n1000000000 1000\n1000000000 1000\n1000000000 1000\n", "5 15\n1 1\n5 7\n3 4\n7 9\n4 5\n", "6 1000000000\n500000000 1000\n500000000 999\n1 1\n999999999 1000\n2 3\n3 2\n"],
  sol: `int n;long long W;cin>>n>>W;vector<long long>w(n),v(n);for(int i=0;i<n;++i)cin>>w[i]>>v[i];int V=100000;const long long INF=LLONG_MAX/4;vector<long long>d(V+1,INF);d[0]=0;
for(int i=0;i<n;++i)for(int x=V;x>=v[i];--x)if(d[x-v[i]]+w[i]<d[x])d[x]=d[x-v[i]]+w[i];
int best=0;for(int x=0;x<=V;++x)if(d[x]<=W)best=x;cout<<best<<"\\n";`,
  wrongNote: "Letting an item be taken again lets the bag hold two copies of one item; filling the bag by value per weight leaves room a better mix would have used.",
  wrong: [
    `int n;long long W;cin>>n>>W;vector<long long>w(n),v(n);for(int i=0;i<n;++i)cin>>w[i]>>v[i];int V=100000;const long long INF=LLONG_MAX/4;vector<long long>d(V+1,INF);d[0]=0;
for(int i=0;i<n;++i)for(int x=v[i];x<=V;++x)if(d[x-v[i]]+w[i]<d[x])d[x]=d[x-v[i]]+w[i];
int best=0;for(int x=0;x<=V;++x)if(d[x]<=W)best=x;cout<<best<<"\\n";`,
    `int n;long long W;cin>>n>>W;vector<pair<double,int>>o;vector<long long>w(n),v(n);for(int i=0;i<n;++i){cin>>w[i]>>v[i];o.push_back(make_pair(-(double)v[i]/w[i],i));}sort(o.begin(),o.end());
long long s=0,val=0;for(auto&p:o){int i=p.second;if(s+w[i]<=W){s+=w[i];val+=v[i];}}cout<<val<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7); let s = line([n, r.int(1, 30)]) + "\n"; for (let i = 0; i < n; i++) s += line([r.int(1, 15), r.int(1, 20)]) + "\n"; return s; },
  slow: [`int n;long long W;cin>>n>>W;vector<long long>w(n),v(n);for(int i=0;i<n;++i)cin>>w[i]>>v[i];vector<long long>d(W+1,0);
for(int i=0;i<n;++i)for(long long c=W;c>=w[i];--c)d[c]=max(d[c],d[c-w[i]]+v[i]);cout<<d[W]<<"\\n";`],
  big: [
    { seed: 1, note: "W = 10^9: a table by weight cannot be built", code: `n = 100\nreturn line([n, 10**9]) + "\\n" + "\\n".join(line([r.int(10**6, 10**8), r.int(1, 1000)]) for _ in range(n))` },
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C609", judge: "graph-kth-teleport", topic: "graphs", rating: 1900,
  tag: "Binary lifting", timeLimitMs: 2000,
  uz: "Teleportlar zanjiri",
  en: "A chain of teleporters",
  statementUz: "n ta sayyora bor, har birida bitta teleport: i-sayyoradagi teleport sizni t_i-sayyoraga olib boradi (t_i = i ham bo‘lishi mumkin). q ta so‘rovning har birida x va k beriladi: x-sayyoradan boshlab teleportdan ketma-ket k marta foydalansangiz, qaysi sayyoraga tushasiz? k = 0 bo‘lsa, boshlang‘ich sayyorada qolasiz.",
  statementEn: "There are n planets, each with one teleporter: the teleporter on planet i takes you to planet t_i (t_i = i is possible). Each of q queries gives x and k: starting on planet x and using the teleporters k times in a row, which planet do you end up on? With k = 0 you stay where you started.",
  inputUz: "Birinchi qatorda n va q beriladi. Ikkinchi qatorda n ta son t_1, …, t_n. Keyingi q ta qatorning har birida x va k.",
  inputEn: "The first line contains n and q. The second line contains the n numbers t_1, …, t_n. Each of the next q lines contains x and k.",
  outputUz: "Har bir so‘rov uchun alohida qatorda sayyora raqamini chiqaring.",
  outputEn: "For each query print the planet's number on its own line.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ t_i ≤ n", "1 ≤ x ≤ n", "0 ≤ k ≤ 10^9"],
  constraintListUz: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ t_i ≤ n", "1 ≤ x ≤ n", "0 ≤ k ≤ 10^9"],
  sampleInputs: ["4 3\n2 1 1 4\n1 2\n3 3\n4 1000000000\n"],
  expect: ["1\n1\n4\n"],
  sampleNotesUz: [
    "1 → 2 → 1. 3 → 1 → 2 → 1. 4-sayyora teleporti o‘ziga olib boradi.",
  ],
  sampleNotesEn: [
    "1 → 2 → 1. 3 → 1 → 2 → 1. The teleporter on planet 4 leads back to itself.",
  ],
  testInputs: ["4 3\n2 1 1 4\n1 2\n3 3\n4 1000000000\n", "3 2\n2 3 1\n1 1000000000\n2 0\n", "1 1\n1\n1 1000000000\n", "5 4\n2 3 4 5 1\n1 999999999\n3 5\n5 1\n2 123456789\n"],
  sol: `int n,q;cin>>n>>q;const int L=30;static int up[L][200001];for(int i=1;i<=n;++i)cin>>up[0][i];
for(int j=1;j<L;++j){int*u=up[j],*w=up[j-1];for(int i=1;i<=n;++i)u[i]=w[w[i]];}
while(q--){int x;long long k;cin>>x>>k;for(int j=0;j<L;++j)if(k>>j&1)x=up[j][x];cout<<x<<"\\n";}`,
  wrongNote: "Keeping only twenty levels of jumps loses the high bits of k; stopping one jump short answers for k − 1.",
  wrong: [
    `int n,q;cin>>n>>q;const int L=20;vector<vector<int>>up(L,vector<int>(n+1));for(int i=1;i<=n;++i)cin>>up[0][i];
for(int j=1;j<L;++j)for(int i=1;i<=n;++i)up[j][i]=up[j-1][up[j-1][i]];
while(q--){int x;long long k;cin>>x>>k;for(int j=0;j<L;++j)if(k>>j&1)x=up[j][x];cout<<x<<"\\n";}`,
    `int n,q;cin>>n>>q;const int L=30;vector<vector<int>>up(L,vector<int>(n+1));for(int i=1;i<=n;++i)cin>>up[0][i];
for(int j=1;j<L;++j)for(int i=1;i<=n;++i)up[j][i]=up[j-1][up[j-1][i]];
while(q--){int x;long long k;cin>>x>>k;if(k>0)--k;for(int j=0;j<L;++j)if(k>>j&1)x=up[j][x];cout<<x<<"\\n";}`,
  ],
  gen: (r) => { const n = r.int(1, 7), q = r.int(1, 5); let s = line([n, q]) + "\n" + line(r.ints(n, 1, n)) + "\n"; for (let i = 0; i < q; i++) s += line([r.int(1, n), r.int(0, 30)]) + "\n"; return s; },
  slow: [`int n,q;cin>>n>>q;vector<int>t(n+1);for(int i=1;i<=n;++i)cin>>t[i];while(q--){int x;long long k;cin>>x>>k;while(k--)x=t[x];cout<<x<<"\\n";}`],
  big: [
    { seed: 1, note: "one long cycle, huge k (10^5 queries keep the output small)", code: `n, q = 200000, 100000\np = r.perm(n)\nt = [0] * (n + 1)\nfor i in range(n):\n    t[p[i]] = p[(i + 1) % n]\nreturn line([n, q]) + "\\n" + line(t[1:]) + "\\n" + "\\n".join(line([r.int(1, n), r.int(10**8, 10**9)]) for _ in range(q))` },
  ],
});

P.push({
  id: "C610", judge: "ds-hotel-first-with-room", topic: "data-structures", rating: 1900,
  tag: "Segment tree", timeLimitMs: 1000,
  uz: "Mehmonxonalar",
  en: "Hotels",
  statementUz: "Ko‘chada n ta mehmonxona ketma-ket joylashgan, i-mehmonxonada h_i ta bo‘sh xona bor. m ta guruh birin-ketin keladi, j-guruhga r_j ta xona kerak. Har bir guruh ko‘chaning boshidan boshlab yetarli bo‘sh xonasi bor birinchi mehmonxonaga joylashadi va u yerdagi bo‘sh xonalar soni r_j ga kamayadi. Bunday mehmonxona bo‘lmasa, guruh joylashmaydi. Har bir guruh qaysi mehmonxonaga tushishini toping.",
  statementEn: "n hotels stand in a row along a street, and hotel i has h_i free rooms. m groups arrive one after another, and group j needs r_j rooms. Each group takes the first hotel from the start of the street that has enough free rooms, and that hotel's free rooms drop by r_j. If no hotel has enough, the group is not housed. Find the hotel each group goes to.",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda n ta son h_i, uchinchi qatorda m ta son r_j keladi.",
  inputEn: "The first line contains n and m. The second line contains the n numbers h_i and the third the m numbers r_j.",
  outputUz: "Probel bilan ajratilgan m ta sonni chiqaring: mehmonxona raqami yoki 0.",
  outputEn: "Print m numbers separated by spaces: the hotel's number, or 0.",
  constraintList: ["1 ≤ n, m ≤ 2·10^5", "1 ≤ h_i, r_j ≤ 10^9", "hotels are numbered from 1 along the street", "a group is never split between hotels"],
  constraintListUz: ["1 ≤ n, m ≤ 2·10^5", "1 ≤ h_i, r_j ≤ 10^9", "mehmonxonalar ko‘cha bo‘ylab 1 dan raqamlangan", "guruh mehmonxonalarga bo‘linmaydi"],
  sampleInputs: ["5 4\n3 2 4 1 5\n4 3 3 6\n"],
  expect: ["3 1 5 0\n"],
  sampleNotesUz: [
    "4 xonali guruh 3-mehmonxonaga (birinchi ikkitasida yetarli xona yo‘q), 3 xonali 1-ga, keyingi 3 xonali 5-ga tushadi; 6 xonaga joy yo‘q.",
  ],
  sampleNotesEn: [
    "The group of 4 goes to hotel 3 (the first two are too small), the first group of 3 to hotel 1 and the second to hotel 5; nobody has 6 rooms.",
  ],
  testInputs: ["5 4\n3 2 4 1 5\n4 3 3 6\n", "1 2\n5\n5 1\n", "3 5\n1 1 1\n1 1 1 1 2\n", "4 4\n10 10 10 10\n7 4 3 10\n"],
  sol: `int n,m;cin>>n>>m;int sz=1;while(sz<n)sz<<=1;vector<long long>t(2*sz,0);for(int i=0;i<n;++i)cin>>t[sz+i];for(int i=sz-1;i>0;--i)t[i]=max(t[2*i],t[2*i+1]);
for(int j=0;j<m;++j){long long r;cin>>r;int ans=0;if(t[1]>=r){int v=1;while(v<sz)v=t[2*v]>=r?2*v:2*v+1;ans=v-sz+1;t[v]-=r;for(v>>=1;v;v>>=1)t[v]=max(t[2*v],t[2*v+1]);}cout<<ans<<(j+1<m?' ':'\\n');}`,
  wrongNote: "Sending each group to the hotel with the most rooms ignores the order along the street; not reducing the rooms lets one hotel take every group.",
  wrong: [
    `int n,m;cin>>n>>m;vector<long long>h(n);for(auto&x:h)cin>>x;for(int j=0;j<m;++j){long long r;cin>>r;int b=0;for(int i=1;i<n;++i)if(h[i]>h[b])b=i;int ans=0;if(h[b]>=r){h[b]-=r;ans=b+1;}cout<<ans<<(j+1<m?' ':'\\n');}`,
    `int n,m;cin>>n>>m;vector<long long>h(n);for(auto&x:h)cin>>x;for(int j=0;j<m;++j){long long r;cin>>r;int ans=0;for(int i=0;i<n;++i)if(h[i]>=r){ans=i+1;break;}cout<<ans<<(j+1<m?' ':'\\n');}`,
  ],
  gen: (r) => { const n = r.int(1, 6), m = r.int(1, 6); return line([n, m]) + "\n" + line(r.ints(n, 1, 9)) + "\n" + line(r.ints(m, 1, 9)) + "\n"; },
  slow: [`int n,m;cin>>n>>m;vector<long long>h(n);for(auto&x:h)cin>>x;for(int j=0;j<m;++j){long long r;cin>>r;int ans=0;for(int i=0;i<n;++i)if(h[i]>=r){h[i]-=r;ans=i+1;break;}cout<<ans<<(j+1<m?' ':'\\n');}`],
  big: [
    { seed: 1, note: "small hotels first: every group walks far down the street", code: `n, m = 200000, 100000\nh = [1] * (n - 1000) + [10**9] * 1000\nreturn line([n, m]) + "\\n" + line(h) + "\\n" + line(r.ints(m, 2, 10**4))` },
  ],
});

P.push({
  id: "C611", judge: "dp-candies-with-caps", topic: "dynamic-programming", rating: 1900,
  tag: "Prefix-sum DP", timeLimitMs: 2000,
  uz: "Konfetlarni taqsimlash",
  en: "Sharing the candies",
  statementUz: "n ta bola va K ta bir xil konfet bor. Barcha K ta konfetni bolalarga taqsimlash kerak, i-bola 0 dan a_i gacha (ikkala chegara ham kiradi) konfet olishi mumkin, va hech qaysi konfet ortib qolmasligi kerak. Ikki taqsimlash biror bola olgan konfetlar soni bilan farq qilsa, ular turlicha hisoblanadi. Taqsimlashlar sonini 10^9 + 7 ga bo‘lgandagi qoldiqni toping.",
  statementEn: "There are n children and K identical candies. All K candies must be shared among the children, child i receiving anywhere from 0 to a_i candies, both included, with none left over. Two sharings are different if some child gets a different number of candies. Find the number of sharings modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda n va K beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n and K. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Yagona butun sonni chiqaring — taqsimlashlar soni modulo 10^9 + 7.",
  outputEn: "Print a single integer — the number of sharings modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 100", "0 ≤ K ≤ 10^5", "0 ≤ a_i ≤ K", "every candy must be given out"],
  constraintListUz: ["1 ≤ n ≤ 100", "0 ≤ K ≤ 10^5", "0 ≤ a_i ≤ K", "har bir konfet tarqatilishi kerak"],
  sampleInputs: ["2 3\n2 2\n", "3 0\n1 1 1\n", "1 5\n4\n"],
  expect: ["2\n", "1\n", "0\n"],
  sampleNotesUz: [
    "(1, 2) va (2, 1).",
    "Hech kim konfet olmaydi — bitta usul.",
    "Yagona bola ko‘pi bilan 4 ta oladi, 5 tani berib bo‘lmaydi.",
  ],
  sampleNotesEn: [
    "(1, 2) and (2, 1).",
    "Nobody gets a candy — one way.",
    "The only child takes at most 4, so 5 cannot all be given.",
  ],
  testInputs: ["2 3\n2 2\n", "3 0\n1 1 1\n", "1 5\n4\n", "3 4\n1 2 3\n", "4 10\n10 10 10 10\n", "5 7\n0 3 1 4 2\n", "100 100000\n100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000 100000\n"],
  sol: `const int M=1000000007;int n,K;cin>>n>>K;vector<int>d(K+1,0),p(K+2,0);d[0]=1;
for(int i=0;i<n;++i){int a;cin>>a;p[0]=0;for(int x=0;x<=K;++x){int s=p[x]+d[x];if(s>=M)s-=M;p[x+1]=s;}for(int x=0;x<=K;++x){int lo=x-a>0?x-a:0;int s=p[x+1]-p[lo];if(s<0)s+=M;d[x]=s;}}
cout<<d[K]<<"\\n";`,
  wrongNote: "Letting a child take a_i + 1 candies breaks the cap by one; stopping one short of a_i forbids giving a child exactly their cap.",
  wrong: [
    `const long long M=1000000007;int n,K;cin>>n>>K;vector<long long>d(K+1,0);d[0]=1;
for(int i=0;i<n;++i){int a;cin>>a;vector<long long>p(K+2,0);for(int x=0;x<=K;++x)p[x+1]=(p[x]+d[x])%M;for(int x=0;x<=K;++x)d[x]=(p[x+1]-p[max(0,x-a-1)]+M)%M;}
cout<<d[K]<<"\\n";`,
    `const long long M=1000000007;int n,K;cin>>n>>K;vector<long long>d(K+1,0);d[0]=1;
for(int i=0;i<n;++i){int a;cin>>a;vector<long long>p(K+2,0);for(int x=0;x<=K;++x)p[x+1]=(p[x]+d[x])%M;for(int x=0;x<=K;++x)d[x]=(p[x+1]-p[max(0,x-a+1)]+M)%M;}
cout<<d[K]<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 5), K = r.int(0, 8); return line([n, K]) + "\n" + line(r.ints(n, 0, K)) + "\n"; },
  brute: `int n,K;cin>>n>>K;vector<int>a(n);for(auto&x:a)cin>>x;long long c=0;function<void(int,int)>go=[&](int i,int left){if(i==n){if(left==0)++c;return;}for(int v=0;v<=a[i]&&v<=left;++v)go(i+1,left-v);};go(0,K);cout<<c%1000000007<<"\\n";`,
  slow: [`const long long M=1000000007;int n,K;cin>>n>>K;vector<long long>d(K+1,0);d[0]=1;
for(int i=0;i<n;++i){int a;cin>>a;vector<long long>e(K+1,0);for(int x=0;x<=K;++x)for(int v=0;v<=a&&v<=x;++v)e[x]=(e[x]+d[x-v])%M;d=e;}cout<<d[K]<<"\\n";`],
  big: [
    { seed: 1, note: "n = 100, K = 10^5, generous caps", code: `return "100 100000\\n" + line(r.ints(100, 50000, 100000))` },
  ],
});

P.push({
  id: "C612", judge: "math-sum-of-all-divisor-sums", topic: "math", rating: 1900,
  tag: "Divisor blocks", timeLimitMs: 1000,
  uz: "Bo‘luvchilar yig‘indilari",
  en: "All the divisor sums",
  statementUz: "σ(k) — k sonining barcha musbat bo‘luvchilari yig‘indisi; masalan, σ(6) = 1 + 2 + 3 + 6 = 12. Sizga n berilgan. σ(1) + σ(2) + … + σ(n) yig‘indisini toping va uni 10^9 + 7 ga bo‘lgandagi qoldiqni chiqaring. n juda katta bo‘lishi mumkin, shuning uchun har bir sonning bo‘luvchilarini alohida sanab chiqishning iloji yo‘q.",
  statementEn: "Let σ(k) be the sum of all positive divisors of k; for example, σ(6) = 1 + 2 + 3 + 6 = 12. You are given n. Find σ(1) + σ(2) + … + σ(n) and print it modulo 10^9 + 7. Note that n can be very large, far too large to go through the numbers up to it one by one.",
  inputUz: "Yagona qatorda n beriladi.",
  inputEn: "A single line contains n.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indi modulo 10^9 + 7.",
  outputEn: "Print a single integer — the sum modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^12", "σ(k) counts 1 and k itself", "print the sum modulo 10^9 + 7", "intermediate products need care with overflow"],
  constraintListUz: ["1 ≤ n ≤ 10^12", "σ(k) ga 1 va k ning o‘zi kiradi", "yig‘indini 10^9 + 7 bo‘yicha chiqaring", "oraliq ko‘paytmalarda to‘lib ketishdan ehtiyot bo‘ling"],
  sampleInputs: ["4\n", "10\n"],
  expect: ["15\n", "87\n"],
  sampleNotesUz: [
    "1 + 3 + 4 + 7 = 15.",
    "σ(1), …, σ(10) = 1, 3, 4, 7, 6, 12, 8, 15, 13, 18, jami 87.",
  ],
  sampleNotesEn: [
    "1 + 3 + 4 + 7 = 15.",
    "σ(1), …, σ(10) are 1, 3, 4, 7, 6, 12, 8, 15, 13, 18, which add up to 87.",
  ],
  testInputs: ["4\n", "10\n", "1\n", "1000000000000\n", "999999999989\n", "123456789\n"],
  sol: `const long long M=1000000007;long long n;cin>>n;long long ans=0;
auto S=[&](long long a,long long b){__int128 s=(__int128)(a+b)*(b-a+1)/2;return (long long)(s%M);};
for(long long l=1;l<=n;){long long q=n/l,r=n/q;ans=(ans+(q%M)*S(l,r))%M;l=r+1;}cout<<ans<<"\\n";`,
  wrongNote: "Multiplying before reducing overflows 64 bits for the largest n; adding up n / d alone counts the divisors instead of summing them.",
  wrong: [
    `const long long M=1000000007;long long n;cin>>n;long long ans=0;
auto S=[&](long long a,long long b){long long s=(a+b)*(b-a+1)/2;return s%M;};
for(long long l=1;l<=n;){long long q=n/l,r=n/q;ans=(ans+(q%M)*S(l,r))%M;l=r+1;}cout<<ans<<"\\n";`,
    `const long long M=1000000007;long long n;cin>>n;long long ans=0;
for(long long l=1;l<=n;){long long q=n/l,r=n/q;ans=(ans+(q%M)*((r-l+1)%M))%M;l=r+1;}cout<<ans<<"\\n";`,
  ],
  gen: (r) => r.int(1, 3000) + "\n",
  brute: `long long n;cin>>n;long long s=0;for(long long k=1;k<=n;++k)for(long long d=1;d<=k;++d)if(k%d==0)s+=d;cout<<s%1000000007<<"\\n";`,
  slow: [`const long long M=1000000007;long long n;cin>>n;long long ans=0;for(long long d=1;d<=n;++d)ans=(ans+(d%M)*((n/d)%M))%M;cout<<ans<<"\\n";`],
  big: [
    { seed: 1, note: "n = 10^12: a loop over every divisor value is far too slow", code: `return "1000000000000"` },
    { seed: 2, note: "random large n", code: `return str(r.int(10**11, 10**12))` },
  ],
});

export default P;
