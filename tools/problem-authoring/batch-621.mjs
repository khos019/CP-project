/* Batch 621 — nine problems, A621–C629, written for the roadmap units that
 * had no problem of their own and borrowed the nearest one: bubble sort,
 * extended Euclid, parallel binary search, Catalan numbers, the persistent
 * segment tree, the palindromic tree, the implicit treap, the virtual tree
 * and tree isomorphism. Each rating sits in its unit's band in
 * app/ui/roadmap-data.ts; the bank reaches 629.
 *
 * Every task is a well-known contest problem restated for AlgoYo'l in our own
 * words, with our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A621", judge: "sort-bubble-swaps-and-passes", topic: "sorting", rating: 900,
  tag: "Bubble sort", timeLimitMs: 1000,
  uz: "Pufakchali saralash hisobi",
  en: "Counting bubble sort",
  statementUz: "n ta butun sondan iborat massiv pufakchali saralash bilan o‘sish tartibida saralanadi. Bir o‘tishda i = 1, 2, …, n − 1 uchun ketma-ket: agar a_i > a_{i+1} bo‘lsa, bu ikki qo‘shni element o‘rin almashadi. O‘tishlar shu o‘tishda birorta ham almashtirish bo‘lmaguncha takrorlanadi. Teng elementlar almashtirilmaydi. Jami nechta almashtirish bajarilishini va nechta o‘tishda kamida bitta almashtirish bo‘lganini toping.",
  statementEn: "An array of n integers is sorted into increasing order by bubble sort. One pass goes through i = 1, 2, …, n − 1 in turn and, whenever a_i > a_{i+1}, swaps these two neighbouring elements. Passes are repeated until a pass makes no swap at all. Equal elements are never swapped. Find how many swaps are made in total and in how many passes at least one swap happened.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_i.",
  inputEn: "The first line contains n. The second line contains the n numbers a_i.",
  outputUz: "Bitta qatorda ikki sonni chiqaring: almashtirishlar soni va almashtirish bo‘lgan o‘tishlar soni.",
  outputEn: "Print two numbers on one line: the number of swaps and the number of passes that made a swap.",
  constraintList: ["1 ≤ n ≤ 1000", "1 ≤ a_i ≤ 10^9", "equal elements are not swapped", "the final pass without swaps is not counted"],
  constraintListUz: ["1 ≤ n ≤ 1000", "1 ≤ a_i ≤ 10^9", "teng elementlar almashtirilmaydi", "almashtirishsiz oxirgi o‘tish hisobga kirmaydi"],
  sampleInputs: ["5\n3 1 4 1 2\n", "3\n1 2 3\n"],
  expect: ["5 2\n", "0 0\n"],
  sampleNotesUz: [
    "1-o‘tish: 3 va 1, 4 va 1, 4 va 2 almashadi — [1, 3, 1, 2, 4]. 2-o‘tish: 3 va 1, 3 va 2 — [1, 1, 2, 3, 4]. 3-o‘tishda almashtirish yo‘q.",
    "Massiv allaqachon saralangan: birinchi o‘tishning o‘zida almashtirish yo‘q.",
  ],
  sampleNotesEn: [
    "Pass 1 swaps 3 and 1, 4 and 1, 4 and 2, giving [1, 3, 1, 2, 4]. Pass 2 swaps 3 and 1, then 3 and 2, giving [1, 1, 2, 3, 4]. Pass 3 makes no swap.",
    "The array is already sorted, so the very first pass makes no swap.",
  ],
  testInputs: ["5\n3 1 4 1 2\n", "3\n1 2 3\n", "1\n7\n", "4\n2 2 2 2\n", "6\n6 5 4 3 2 1\n", "5\n1000000000 1 1000000000 1 5\n", "7\n2 3 4 5 6 7 1\n", "7\n7 1 2 3 4 5 6\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long sw=0,ps=0;
for(;;){bool any=false;for(int i=0;i+1<n;++i)if(a[i]>a[i+1]){swap(a[i],a[i+1]);++sw;any=true;}if(!any)break;++ps;}
cout<<sw<<" "<<ps<<"\\n";`,
  wrongNote: "Counting the last, empty pass reports one pass too many; counting pairs with a_i ≥ a_j as out of order swaps equal elements that bubble sort leaves alone.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long sw=0,ps=0;
for(;;){bool any=false;for(int i=0;i+1<n;++i)if(a[i]>a[i+1]){swap(a[i],a[i+1]);++sw;any=true;}++ps;if(!any)break;}
cout<<sw<<" "<<ps<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long inv=0,mx=0;
for(int j=0;j<n;++j){long long c=0;for(int i=0;i<j;++i)if(a[i]>=a[j])++c;inv+=c;mx=max(mx,c);}cout<<inv<<" "<<mx<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 8); return n + "\n" + line(r.ints(n, 1, 5)) + "\n"; },
  brute: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long inv=0,mx=0;
for(int j=0;j<n;++j){long long c=0;for(int i=0;i<j;++i)if(a[i]>a[j])++c;inv+=c;mx=max(mx,c);}cout<<inv<<" "<<mx<<"\\n";`,
});

/* ------------------------------------------------------------------ 1100 */
P.push({
  id: "A622", judge: "math-bezout-smallest-x", topic: "math", rating: 1100,
  tag: "Extended Euclid", timeLimitMs: 1000,
  uz: "Bezu koeffitsiyentlari",
  en: "Bézout coefficients",
  statementUz: "Ikki musbat butun a va b son berilgan, g — ularning eng katta umumiy bo‘luvchisi. a · x + b · y = g tenglikni qanoatlantiradigan butun x va y sonlar doim mavjud, lekin ular ko‘p. Shulardan 0 ≤ x < b / g shartini bajaradigan yagona juftlikni toping va g, x, y ni chiqaring. y manfiy bo‘lishi mumkin. Bir kirishda t ta shunday so‘rov bor.",
  statementEn: "You are given two positive integers a and b, and g is their greatest common divisor. Integers x and y with a · x + b · y = g always exist, but there are infinitely many such pairs. Find the only one with 0 ≤ x < b / g and print g, x and y. The number y may be negative. One input holds t such questions.",
  inputUz: "Birinchi qatorda t beriladi. Keyingi t ta qatorning har birida a va b.",
  inputEn: "The first line contains t. Each of the next t lines contains a and b.",
  outputUz: "Har bir so‘rov uchun alohida qatorda g, x va y ni chiqaring.",
  outputEn: "For each question print g, x and y on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ a, b ≤ 10^9", "0 ≤ x < b / g", "y may be negative"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ a, b ≤ 10^9", "0 ≤ x < b / g", "y manfiy bo‘lishi mumkin"],
  sampleInputs: ["3\n6 4\n3 7\n4 2\n"],
  expect: ["2 1 -1\n1 5 -2\n2 0 1\n"],
  sampleNotesUz: [
    "6 · 1 + 4 · (−1) = 2, va 0 ≤ 1 < 4 / 2. 3 · 5 + 7 · (−2) = 1, va 5 < 7. 4 va 2 uchun b / g = 1, shuning uchun x = 0 va 2 · 1 = 2.",
  ],
  sampleNotesEn: [
    "6 · 1 + 4 · (−1) = 2 with 0 ≤ 1 < 4 / 2. 3 · 5 + 7 · (−2) = 1 with 5 < 7. For 4 and 2, b / g = 1, so x = 0 and 2 · 1 = 2.",
  ],
  testInputs: ["3\n6 4\n3 7\n4 2\n", "1\n1 1\n", "2\n4 6\n1000000000 999999999\n", "3\n12 18\n17 5\n1000000000 1000000000\n", "2\n999999937 2\n2 999999937\n", "3\n10 15\n15 10\n35 21\n"],
  sol: `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;long long x0=1,y0=0,x1=0,y1=1,r0=a,r1=b;
while(r1){long long q=r0/r1,w;w=r0-q*r1;r0=r1;r1=w;w=x0-q*x1;x0=x1;x1=w;w=y0-q*y1;y0=y1;y1=w;}
long long g=r0,m=b/g;long long x=((x0%m)+m)%m;long long y=(g-a*x)/b;cout<<g<<" "<<x<<" "<<y<<"\\n";}`,
  wrongNote: "Printing the coefficients exactly as the extended algorithm leaves them gives a negative x half the time; shifting x by b instead of b / g can leave it at b / g or above when g > 1.",
  wrong: [
    `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;long long x0=1,y0=0,x1=0,y1=1,r0=a,r1=b;
while(r1){long long q=r0/r1,w;w=r0-q*r1;r0=r1;r1=w;w=x0-q*x1;x0=x1;x1=w;w=y0-q*y1;y0=y1;y1=w;}
cout<<r0<<" "<<x0<<" "<<y0<<"\\n";}`,
    `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;long long x0=1,y0=0,x1=0,y1=1,r0=a,r1=b;
while(r1){long long q=r0/r1,w;w=r0-q*r1;r0=r1;r1=w;w=x0-q*x1;x0=x1;x1=w;w=y0-q*y1;y0=y1;y1=w;}
long long g=r0;long long x=((x0%b)+b)%b;long long y=(g-a*x)/b;cout<<g<<" "<<x<<" "<<y<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 4); let s = t + "\n"; for (let i = 0; i < t; i++) s += line([r.int(1, 30), r.int(1, 30)]) + "\n"; return s; },
  brute: `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;long long g=1;for(long long d=1;d<=min(a,b);++d)if(a%d==0&&b%d==0)g=d;
for(long long x=0;;++x)if((g-a*x)%b==0){cout<<g<<" "<<x<<" "<<(g-a*x)/b<<"\\n";break;}}`,
  slow: [`int t;cin>>t;while(t--){long long a,b;cin>>a>>b;long long g=__gcd(a,b);
for(long long x=0;;++x)if((g-a*x)%b==0){cout<<g<<" "<<x<<" "<<(g-a*x)/b<<"\\n";break;}}`],
  big: [
    { seed: 1, note: "10^4 random pairs up to 10^9: trying x one by one is far too slow", code: `t = 10000\nreturn str(t) + "\\n" + "\\n".join(line([r.int(1, 10**9), r.int(10**8, 10**9)]) for _ in range(t))` },
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B623", judge: "bs-parallel-first-day-watered", topic: "binary-search", rating: 1600,
  tag: "Parallel binary search", timeLimitMs: 2000,
  uz: "Qaysi kuni yetarli suv",
  en: "The day there is enough water",
  statementUz: "Ko‘chada 1 dan n gacha raqamlangan n ta gulzor bor, i-gulzorga jami kamida p_i litr suv kerak. m kun davomida sug‘orish bo‘ladi: j-kuni l_j dan r_j gacha (ikkalasi ham kiradi) bo‘lgan har bir gulzorga x_j litr suv quyiladi. Suv yig‘ilib boradi. Har bir gulzor uchun shunday eng kichik kun raqamini toping: o‘sha kun oxirida gulzorga jami kamida p_i litr suv quyilgan bo‘lsin. Agar m kun ichida bunday bo‘lmasa, -1 chiqaring.",
  statementEn: "A street has n flower beds numbered 1 to n, and bed i needs at least p_i litres of water in total. Watering goes on for m days: on day j every bed from l_j to r_j, both included, receives x_j litres. The water adds up. For every bed find the smallest day number such that by the end of that day the bed has received at least p_i litres in total. If that never happens within the m days, print -1.",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda n ta son p_i. Keyingi m ta qatorning har birida l_j, r_j va x_j.",
  inputEn: "The first line contains n and m. The second line contains the n numbers p_i. Each of the next m lines contains l_j, r_j and x_j.",
  outputUz: "Bitta qatorda n ta sonni chiqaring: har bir gulzor uchun kun raqami yoki -1.",
  outputEn: "Print n numbers on one line: the day for each bed, or -1.",
  constraintList: ["1 ≤ n, m ≤ 10^5", "1 ≤ p_i ≤ 10^18", "1 ≤ l_j ≤ r_j ≤ n", "1 ≤ x_j ≤ 10^9"],
  constraintListUz: ["1 ≤ n, m ≤ 10^5", "1 ≤ p_i ≤ 10^18", "1 ≤ l_j ≤ r_j ≤ n", "1 ≤ x_j ≤ 10^9"],
  sampleInputs: ["4 3\n3 5 1 1\n1 2 2\n2 3 3\n1 3 1\n"],
  expect: ["3 2 2 -1\n"],
  sampleNotesUz: [
    "Kunlar oxirida suv miqdorlari: [2, 2, 0, 0], [2, 5, 3, 0], [3, 6, 4, 0]. 1-gulzor 3-kuni, 2- va 3-gulzorlar 2-kuni yetarli suv oladi; 4-gulzorga hech qachon suv quyilmaydi.",
  ],
  sampleNotesEn: [
    "At the end of each day the beds hold [2, 2, 0, 0], [2, 5, 3, 0] and [3, 6, 4, 0]. Bed 1 has enough on day 3, beds 2 and 3 on day 2; bed 4 is never watered.",
  ],
  testInputs: ["4 3\n3 5 1 1\n1 2 2\n2 3 3\n1 3 1\n", "1 1\n5\n1 1 3\n", "2 2\n3 4\n1 2 3\n2 2 1\n", "2 3\n1000000000000000000 2000000000\n1 2 1000000000\n1 2 1000000000\n2 2 1000000000\n", "5 4\n1 2 3 4 5\n1 5 1\n3 5 1\n5 5 1\n1 1 7\n"],
  sol: `int n,m;cin>>n>>m;vector<long long>p(n+1);for(int i=1;i<=n;++i)cin>>p[i];vector<long long>X(m+1);vector<vector<int>>st(n+2),en(n+2);
for(int j=1;j<=m;++j){int l,r;cin>>l>>r>>X[j];st[l].push_back(j);en[r+1].push_back(j);}
int sz=1;while(sz<m)sz<<=1;vector<long long>T(2*sz,0);
auto upd=[&](int j,long long v){int i=sz+j-1;T[i]+=v;for(i>>=1;i;i>>=1)T[i]=T[2*i]+T[2*i+1];};
for(int i=1;i<=n;++i){for(int j:en[i])upd(j,-X[j]);for(int j:st[i])upd(j,X[j]);
 long long ans=-1;if(T[1]>=p[i]){long long need=p[i];int v=1;while(v<sz){if(T[2*v]>=need)v=2*v;else{need-=T[2*v];v=2*v+1;}}ans=v-sz+1;}
 cout<<ans<<(i==n?"\\n":" ");}`,
  wrongNote: "Waiting for strictly more than p_i litres answers a day late when a bed gets exactly what it needs; treating r_j as excluded stops each day's watering one bed short.",
  wrong: [
    `int n,m;cin>>n>>m;vector<long long>p(n+1);for(int i=1;i<=n;++i)cin>>p[i];vector<long long>X(m+1);vector<vector<int>>st(n+2),en(n+2);
for(int j=1;j<=m;++j){int l,r;cin>>l>>r>>X[j];st[l].push_back(j);en[r+1].push_back(j);}
int sz=1;while(sz<m)sz<<=1;vector<long long>T(2*sz,0);
auto upd=[&](int j,long long v){int i=sz+j-1;T[i]+=v;for(i>>=1;i;i>>=1)T[i]=T[2*i]+T[2*i+1];};
for(int i=1;i<=n;++i){for(int j:en[i])upd(j,-X[j]);for(int j:st[i])upd(j,X[j]);
 long long ans=-1;if(T[1]>p[i]){long long need=p[i];int v=1;while(v<sz){if(T[2*v]>need)v=2*v;else{need-=T[2*v];v=2*v+1;}}ans=v-sz+1;}
 cout<<ans<<(i==n?"\\n":" ");}`,
    `int n,m;cin>>n>>m;vector<long long>p(n+1);for(int i=1;i<=n;++i)cin>>p[i];vector<long long>X(m+1);vector<vector<int>>st(n+2),en(n+2);
for(int j=1;j<=m;++j){int l,r;cin>>l>>r>>X[j];st[l].push_back(j);en[r].push_back(j);}
int sz=1;while(sz<m)sz<<=1;vector<long long>T(2*sz,0);
auto upd=[&](int j,long long v){int i=sz+j-1;T[i]+=v;for(i>>=1;i;i>>=1)T[i]=T[2*i]+T[2*i+1];};
for(int i=1;i<=n;++i){for(int j:en[i])upd(j,-X[j]);for(int j:st[i])upd(j,X[j]);
 long long ans=-1;if(T[1]>=p[i]){long long need=p[i];int v=1;while(v<sz){if(T[2*v]>=need)v=2*v;else{need-=T[2*v];v=2*v+1;}}ans=v-sz+1;}
 cout<<ans<<(i==n?"\\n":" ");}`,
  ],
  gen: (r) => { const n = r.int(1, 6), m = r.int(1, 6); let s = line([n, m]) + "\n" + line(r.ints(n, 1, 12)) + "\n"; for (let j = 0; j < m; j++) { const l = r.int(1, n); s += line([l, r.int(l, n), r.int(1, 5)]) + "\n"; } return s; },
  slow: [`int n,m;cin>>n>>m;vector<long long>p(n+1),acc(n+1,0),ans(n+1,-1);for(int i=1;i<=n;++i)cin>>p[i];
for(int j=1;j<=m;++j){int l,r;long long x;cin>>l>>r>>x;for(int i=l;i<=r;++i){acc[i]+=x;if(ans[i]<0&&acc[i]>=p[i])ans[i]=j;}}
for(int i=1;i<=n;++i)cout<<ans[i]<<(i==n?"\\n":" ");`],
  big: [
    { seed: 1, note: "10^5 beds, 10^5 random wide days, needs spread so some beds never fill", code: `n = m = 100000
days = []
for j in range(m):
    a = r.int(1, n)
    b = r.int(1, n)
    if a > b:
        a, b = b, a
    days.append(line([a, b, r.int(1, 10**9)]))
return line([n, m]) + "\\n" + line(r.ints(n, 1, 2 * 10**13)) + "\\n" + "\\n".join(days)` },
    { seed: 2, note: "every day waters the whole street with 1 litre: the answer is p_i itself", code: `n = m = 100000
return line([n, m]) + "\\n" + line(r.ints(n, 1, 120000)) + "\\n" + "\\n".join(["1 " + str(n) + " 1"] * m)` },
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B624", judge: "math-brackets-complete-prefix", topic: "math", rating: 1700,
  tag: "Catalan numbers", timeLimitMs: 1000,
  uz: "Qavslar ketma-ketligini davom ettirish",
  en: "Finishing a bracket sequence",
  statementUz: "Qavslar ketma-ketligi to‘g‘ri deyiladi, agar undagi '(' va ')' soni teng bo‘lsa va istalgan prefiksda ')' soni '(' sonidan oshmasa. Sizga n soni va '(' hamda ')' belgilaridan iborat s qatori berilgan. Uzunligi aynan n bo‘lgan va s bilan boshlanadigan nechta to‘g‘ri qavslar ketma-ketligi bor? Javobni 10^9 + 7 ga bo‘lgandagi qoldiqni chiqaring.",
  statementEn: "A bracket sequence is balanced if it has as many '(' as ')' and no prefix of it has more ')' than '('. You are given a number n and a string s made of '(' and ')'. How many balanced bracket sequences have length exactly n and begin with s? Print the answer modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda s qatori.",
  inputEn: "The first line contains n. The second line contains the string s.",
  outputUz: "Yagona butun sonni chiqaring — ketma-ketliklar soni modulo 10^9 + 7.",
  outputEn: "Print a single integer — the number of sequences modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^6", "1 ≤ |s| ≤ n", "s consists of '(' and ')'", "print the count modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ n ≤ 10^6", "1 ≤ |s| ≤ n", "s faqat '(' va ')' dan iborat", "sonni 10^9 + 7 bo‘yicha chiqaring"],
  sampleInputs: ["4\n(\n", "6\n((\n", "4\n())\n"],
  expect: ["2\n", "3\n", "0\n"],
  sampleNotesUz: [
    "(()) va ()().",
    "((())), (()()) va (())().",
    "s ning o‘zida ')' lar '(' lardan oshib ketadi, uni hech narsa tuzata olmaydi.",
  ],
  sampleNotesEn: [
    "(()) and ()().",
    "((())), (()()) and (())().",
    "s itself already has more ')' than '(' at some point, and nothing added later can repair that.",
  ],
  testInputs: ["4\n(\n", "6\n((\n", "4\n())\n", "1\n(\n", "4\n)(\n", "8\n((((\n", "1000000\n(\n", "10\n(()\n", "6\n()()()\n", "999999\n(\n"],
  sol: `const long long M=1000000007;int n;string s;cin>>n>>s;int bal=0;for(char c:s){bal+=c=='('?1:-1;if(bal<0){cout<<0<<"\\n";return 0;}}
int k=n-(int)s.size();if(bal>k||(k-bal)%2){cout<<0<<"\\n";return 0;}
vector<long long>f(k+1),inv(k+1);f[0]=1;for(int i=1;i<=k;++i)f[i]=f[i-1]*i%M;
auto pw=[&](long long b,long long e){long long r=1;b%=M;while(e){if(e&1)r=r*b%M;b=b*b%M;e>>=1;}return r;};
inv[k]=pw(f[k],M-2);for(int i=k;i>0;--i)inv[i-1]=inv[i]*i%M;
auto C=[&](int a,int b)->long long{if(b<0||b>a)return 0;return f[a]*inv[b]%M*inv[a-b]%M;};
int u=(k-bal)/2;cout<<((C(k,u)-C(k,u-1))%M+M)%M<<"\\n";`,
  wrongNote: "Checking only the final balance of s misses a prefix that dips below zero in the middle; counting every arrangement of the remaining brackets forgets the reflection that removes the ones that dip below zero later.",
  wrong: [
    `const long long M=1000000007;int n;string s;cin>>n>>s;int bal=0;for(char c:s)bal+=c=='('?1:-1;
int k=n-(int)s.size();if(bal<0||bal>k||(k-bal)%2){cout<<0<<"\\n";return 0;}
vector<long long>f(k+1),inv(k+1);f[0]=1;for(int i=1;i<=k;++i)f[i]=f[i-1]*i%M;
auto pw=[&](long long b,long long e){long long r=1;b%=M;while(e){if(e&1)r=r*b%M;b=b*b%M;e>>=1;}return r;};
inv[k]=pw(f[k],M-2);for(int i=k;i>0;--i)inv[i-1]=inv[i]*i%M;
auto C=[&](int a,int b)->long long{if(b<0||b>a)return 0;return f[a]*inv[b]%M*inv[a-b]%M;};
int u=(k-bal)/2;cout<<((C(k,u)-C(k,u-1))%M+M)%M<<"\\n";`,
    `const long long M=1000000007;int n;string s;cin>>n>>s;int bal=0;for(char c:s){bal+=c=='('?1:-1;if(bal<0){cout<<0<<"\\n";return 0;}}
int k=n-(int)s.size();if(bal>k||(k-bal)%2){cout<<0<<"\\n";return 0;}
vector<long long>f(k+1),inv(k+1);f[0]=1;for(int i=1;i<=k;++i)f[i]=f[i-1]*i%M;
auto pw=[&](long long b,long long e){long long r=1;b%=M;while(e){if(e&1)r=r*b%M;b=b*b%M;e>>=1;}return r;};
inv[k]=pw(f[k],M-2);for(int i=k;i>0;--i)inv[i-1]=inv[i]*i%M;
int u=(k-bal)/2;cout<<f[k]*inv[u]%M*inv[k-u]%M<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 12), len = r.int(1, n); return n + "\n" + r.str(len, "(()") + "\n"; },
  brute: `int n;string s;cin>>n>>s;int k=n-(int)s.size();long long c=0;for(int m=0;m<(1<<k);++m){string t=s;for(int i=0;i<k;++i)t+=(m>>i&1)?'(':')';int b=0;bool ok=true;for(char ch:t){b+=ch=='('?1:-1;if(b<0)ok=false;}if(ok&&b==0)++c;}cout<<c%1000000007<<"\\n";`,
  slow: [`const long long M=1000000007;int n;string s;cin>>n>>s;int bal=0;for(char c:s){bal+=c=='('?1:-1;if(bal<0){cout<<0<<"\\n";return 0;}}
int k=n-(int)s.size();if(bal>k){cout<<0<<"\\n";return 0;}vector<long long>d(k+2,0),e(k+2,0);d[bal]=1;
for(int i=0;i<k;++i){fill(e.begin(),e.end(),0);for(int b=0;b<=k;++b)if(d[b]){e[b+1]=(e[b+1]+d[b])%M;if(b>0)e[b-1]=(e[b-1]+d[b])%M;}swap(d,e);}cout<<d[0]<<"\\n";`],
  big: [
    { seed: 1, note: "n = 10^6 with a single '(' given: a quadratic DP over the balance is far too slow", code: `return "1000000\\n("` },
    { seed: 2, note: "a long prefix that climbs to balance 2·10^5", code: `return "1000000\\n" + "(" * 200000 + ")(" * 100000` },
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C625", judge: "adv-persistent-kth-smallest", topic: "advanced-cp", rating: 2000,
  tag: "Persistent segment tree", timeLimitMs: 2000,
  uz: "Oraliqdagi k-chi eng kichik",
  en: "The k-th smallest in a range",
  statementUz: "n ta butun sondan iborat a massivi berilgan. q ta so‘rovning har biri l, r va k sonlaridan iborat: a_l, a_{l+1}, …, a_r elementlarini o‘sish tartibida yozsak, k-o‘rinda qaysi son turadi? Teng qiymatlar alohida sanaladi: masalan, [5, 1, 1] uchun 1-chi va 2-chi eng kichik ham 1 ga teng. Massiv so‘rovlar orasida o‘zgarmaydi.",
  statementEn: "You are given an array a of n integers. Each of q queries consists of numbers l, r and k: if the elements a_l, a_{l+1}, …, a_r are written in increasing order, which number stands in position k? Equal values are counted separately: for [5, 1, 1], both the 1st and the 2nd smallest are 1. The array does not change between queries.",
  inputUz: "Birinchi qatorda n va q beriladi. Ikkinchi qatorda n ta son a_i. Keyingi q ta qatorning har birida l, r va k.",
  inputEn: "The first line contains n and q. The second line contains the n numbers a_i. Each of the next q lines contains l, r and k.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print the answer on its own line.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9", "1 ≤ l ≤ r ≤ n", "1 ≤ k ≤ r − l + 1"],
  constraintListUz: ["1 ≤ n, q ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9", "1 ≤ l ≤ r ≤ n", "1 ≤ k ≤ r − l + 1"],
  sampleInputs: ["5 4\n3 1 4 1 5\n1 5 2\n2 4 3\n3 5 1\n5 5 1\n"],
  expect: ["1\n4\n1\n5\n"],
  sampleNotesUz: [
    "Butun massiv saralanganda 1, 1, 3, 4, 5 — 2-chi 1. [1, 4, 1] → 1, 1, 4 — 3-chi 4. [4, 1, 5] da eng kichigi 1. Yagona element 5.",
  ],
  sampleNotesEn: [
    "The whole array sorted is 1, 1, 3, 4, 5, so the 2nd is 1. [1, 4, 1] sorts to 1, 1, 4 and the 3rd is 4. The smallest of [4, 1, 5] is 1. A single element is 5.",
  ],
  testInputs: ["5 4\n3 1 4 1 5\n1 5 2\n2 4 3\n3 5 1\n5 5 1\n", "1 1\n-7\n1 1 1\n", "6 4\n5 5 5 1 1 1\n1 6 3\n1 6 4\n4 6 2\n2 3 1\n", "4 3\n-1000000000 1000000000 0 -1000000000\n1 4 4\n1 4 1\n2 3 2\n"],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>v(a);sort(v.begin(),v.end());v.erase(unique(v.begin(),v.end()),v.end());int V=v.size();
static int Lc[4000005],Rc[4000005],C[4000005];int cnt=1;vector<int>root(n+1,0);
auto ins=[&](auto&&self,int prev,int lo,int hi,int pos)->int{int cur=cnt++;Lc[cur]=Lc[prev];Rc[cur]=Rc[prev];C[cur]=C[prev]+1;
 if(lo<hi){int mid=(lo+hi)/2;if(pos<=mid){int c=self(self,Lc[prev],lo,mid,pos);Lc[cur]=c;}else{int c=self(self,Rc[prev],mid+1,hi,pos);Rc[cur]=c;}}return cur;};
for(int i=0;i<n;++i){int pos=lower_bound(v.begin(),v.end(),a[i])-v.begin();root[i+1]=ins(ins,root[i],0,V-1,pos);}
while(q--){int l,r,k;cin>>l>>r>>k;int u=root[r],w=root[l-1],lo=0,hi=V-1;
 while(lo<hi){int mid=(lo+hi)/2;int c=C[Lc[u]]-C[Lc[w]];if(k<=c){u=Lc[u];w=Lc[w];hi=mid;}else{k-=c;u=Rc[u];w=Rc[w];lo=mid+1;}}
 cout<<v[lo]<<"\\n";}`,
  wrongNote: "Subtracting the version after a_l instead of the one before it leaves a_l out of its own range; walking right when the left half holds enough answers the k-th largest.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>v(a);sort(v.begin(),v.end());v.erase(unique(v.begin(),v.end()),v.end());int V=v.size();
int cap=n*20+5;vector<int>Lc(cap,0),Rc(cap,0),C(cap,0);int cnt=1;vector<int>root(n+1,0);
auto ins=[&](auto&&self,int prev,int lo,int hi,int pos)->int{int cur=cnt++;Lc[cur]=Lc[prev];Rc[cur]=Rc[prev];C[cur]=C[prev]+1;
 if(lo<hi){int mid=(lo+hi)/2;if(pos<=mid){int c=self(self,Lc[prev],lo,mid,pos);Lc[cur]=c;}else{int c=self(self,Rc[prev],mid+1,hi,pos);Rc[cur]=c;}}return cur;};
for(int i=0;i<n;++i){int pos=lower_bound(v.begin(),v.end(),a[i])-v.begin();root[i+1]=ins(ins,root[i],0,V-1,pos);}
while(q--){int l,r,k;cin>>l>>r>>k;int u=root[r],w=root[l],lo=0,hi=V-1;
 while(lo<hi){int mid=(lo+hi)/2;int c=C[Lc[u]]-C[Lc[w]];if(k<=c){u=Lc[u];w=Lc[w];hi=mid;}else{k-=c;u=Rc[u];w=Rc[w];lo=mid+1;}}
 cout<<v[lo]<<"\\n";}`,
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int l,r,k;cin>>l>>r>>k;vector<long long>b(a.begin()+l-1,a.begin()+r);sort(b.rbegin(),b.rend());cout<<b[k-1]<<"\\n";}`,
  ],
  gen: (r) => { const n = r.int(1, 8), q = r.int(1, 6); let s = line([n, q]) + "\n" + line(r.ints(n, -5, 5)) + "\n"; for (let i = 0; i < q; i++) { const l = r.int(1, n), rr = r.int(l, n); s += line([l, rr, r.int(1, rr - l + 1)]) + "\n"; } return s; },
  slow: [`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int l,r,k;cin>>l>>r>>k;vector<long long>b(a.begin()+l-1,a.begin()+r);nth_element(b.begin(),b.begin()+k-1,b.end());cout<<b[k-1]<<"\\n";}`],
  big: [
    { seed: 1, note: "2·10^5 values over the full range, 5·10^4 queries over almost the whole array", code: `n, q = 200000, 50000
qs = []
for _ in range(q):
    l = r.int(1, 1000)
    rr = r.int(n - 1000, n)
    qs.append(line([l, rr, r.int(1, rr - l + 1)]))
return line([n, q]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(qs)` },
    { seed: 2, note: "10^5 queries of random ranges, many repeated values", code: `n, q = 200000, 100000
qs = []
for _ in range(q):
    l = r.int(1, n)
    rr = r.int(1, n)
    if l > rr:
        l, rr = rr, l
    qs.append(line([l, rr, r.int(1, rr - l + 1)]))
return line([n, q]) + "\\n" + line(r.ints(n, 1, 1000)) + "\\n" + "\\n".join(qs)` },
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C626", judge: "str-eertree-distinct-palindromes", topic: "strings", rating: 2100,
  tag: "Palindromic tree", timeLimitMs: 1000,
  uz: "Turli palindromlar soni",
  en: "How many different palindromes",
  statementUz: "Kichik lotin harflaridan iborat s qatori berilgan. Uning bo‘sh bo‘lmagan qism-satrlaridan (ketma-ket kelgan harflar bo‘lagi) nechtasi palindrom — chapdan ham, o‘ngdan ham bir xil o‘qiladi? Bir xil palindrom qatorning bir necha joyida uchrasa ham, u bir marta sanaladi: masalan, aaa qatorida a, aa va aaa — jami 3 ta turli palindrom bor.",
  statementEn: "You are given a string s of lowercase Latin letters. How many of its non-empty substrings (runs of consecutive letters) are palindromes — read the same from left to right and from right to left? A palindrome that occurs in several places is counted once: the string aaa, for example, has exactly 3 different palindromes, a, aa and aaa.",
  inputUz: "Yagona qatorda s beriladi.",
  inputEn: "The only line contains s.",
  outputUz: "Yagona butun sonni chiqaring — turli palindrom qism-satrlar soni.",
  outputEn: "Print a single integer — the number of different palindromic substrings.",
  constraintList: ["1 ≤ |s| ≤ 5·10^5", "s consists of lowercase Latin letters", "equal substrings in different places count once", "the empty string is not counted"],
  constraintListUz: ["1 ≤ |s| ≤ 5·10^5", "s kichik lotin harflaridan iborat", "turli joydagi bir xil qism-satrlar bir marta sanaladi", "bo‘sh qator sanalmaydi"],
  sampleInputs: ["abaab\n", "aaa\n"],
  expect: ["5\n", "3\n"],
  sampleNotesUz: [
    "a, b, aba, aa va baab.",
    "a, aa va aaa: a uch marta, aa ikki marta uchraydi, lekin har biri bir marta sanaladi.",
  ],
  sampleNotesEn: [
    "a, b, aba, aa and baab.",
    "a, aa and aaa: a occurs three times and aa twice, but each is counted once.",
  ],
  testInputs: ["abaab\n", "aaa\n", "a\n", "abcde\n", "abacaba\n", "abbaabba\n", "zz\n"],
  sol: `string s;cin>>s;int n=s.size();vector<array<int,26>>nx(n+3);vector<int>len(n+3,0),lk(n+3,0);
len[1]=-1;lk[1]=1;len[2]=0;lk[2]=1;int sz=3,last=2;
for(int i=0;i<n;++i){int c=s[i]-'a';int cur=last;while(true){int L=len[cur];if(i-1-L>=0&&s[i-1-L]==s[i])break;cur=lk[cur];}
 if(nx[cur][c]){last=nx[cur][c];continue;}
 int w=sz++;len[w]=len[cur]+2;if(len[w]==1)lk[w]=2;else{int p=lk[cur];while(true){int L=len[p];if(i-1-L>=0&&s[i-1-L]==s[i])break;p=lk[p];}lk[w]=nx[p][c];}
 nx[cur][c]=w;last=w;}
cout<<sz-3<<"\\n";`,
  wrongNote: "Counting every palindromic occurrence counts a repeated palindrome once per place; keeping only the odd-length palindromes misses aa, abba and the rest of the even ones.",
  wrong: [
    `string s;cin>>s;int n=s.size();long long c=0;for(int m=0;m<n;++m){for(int l=m,r=m;l>=0&&r<n&&s[l]==s[r];--l,++r)++c;for(int l=m,r=m+1;l>=0&&r<n&&s[l]==s[r];--l,++r)++c;}cout<<c<<"\\n";`,
    `string s;cin>>s;int n=s.size();vector<array<int,26>>nx(n+3);vector<int>len(n+3,0),lk(n+3,0);
len[1]=-1;lk[1]=1;len[2]=0;lk[2]=1;int sz=3,last=2;
for(int i=0;i<n;++i){int c=s[i]-'a';int cur=last;while(true){int L=len[cur];if(i-1-L>=0&&s[i-1-L]==s[i])break;cur=lk[cur];}
 if(nx[cur][c]){last=nx[cur][c];continue;}
 int w=sz++;len[w]=len[cur]+2;if(len[w]==1)lk[w]=2;else{int p=lk[cur];while(true){int L=len[p];if(i-1-L>=0&&s[i-1-L]==s[i])break;p=lk[p];}lk[w]=nx[p][c];}
 nx[cur][c]=w;last=w;}
int odd=0;for(int v=3;v<sz;++v)if(len[v]%2)++odd;cout<<odd<<"\\n";`,
  ],
  gen: (r) => r.str(r.int(1, 12), r.pick(["ab", "abc", "aab"])) + "\n",
  brute: `string s;cin>>s;int n=s.size();set<string>S;for(int i=0;i<n;++i)for(int j=i;j<n;++j){string t=s.substr(i,j-i+1);string u(t.rbegin(),t.rend());if(t==u)S.insert(t);}cout<<S.size()<<"\\n";`,
  slow: [`string s;cin>>s;int n=s.size();const unsigned long long B=131;vector<unsigned long long>h(n+1,0),pw(n+1,1);for(int i=0;i<n;++i){h[i+1]=h[i]*B+s[i];pw[i+1]=pw[i]*B;}
unordered_set<unsigned long long>S;auto key=[&](int l,int r){return (h[r]-h[l]*pw[r-l])*1000003ULL+(unsigned long long)(r-l);};
for(int m=0;m<n;++m){for(int l=m,r=m;l>=0&&r<n&&s[l]==s[r];--l,++r)S.insert(key(l,r+1));for(int l=m,r=m+1;l>=0&&r<n&&s[l]==s[r];--l,++r)S.insert(key(l,r+1));}
cout<<S.size()<<"\\n";`],
  big: [
    { seed: 1, note: "5·10^5 copies of one letter: expanding every centre is quadratic", code: `return "a" * 500000` },
    { seed: 2, note: "a random string over two letters", code: `return text(r, 500000, "ab")` },
    { seed: 3, note: "the Zimin word abacabadabacaba…: palindromes nested inside palindromes", code: `z = "a"
for c in "bcdefghijklmnopqrs":
    z = z + c + z
return z[:500000]` },
    { seed: 4, note: "a random string over all 26 letters", code: `return text(r, 500000, "abcdefghijklmnopqrstuvwxyz")` },
  ],
});

P.push({
  id: "C627", judge: "adv-treap-reverse-and-move", topic: "advanced-cp", rating: 2100,
  tag: "Implicit treap", timeLimitMs: 2000,
  uz: "Teskari aylantirish va ko‘chirish",
  en: "Reverse and move to the end",
  statementUz: "n ta kichik lotin harfidan iborat s qatori va m ta amal berilgan. «1 l r» amali l-dan r-o‘ringacha bo‘lgan bo‘lakni teskari tartibda yozadi. «2 l r» amali l-dan r-o‘ringacha bo‘lgan bo‘lakni qatordan qirqib oladi va uni o‘zgartirmasdan qator oxiriga qo‘yadi. O‘rinlar har safar joriy qator bo‘yicha, 1 dan boshlab sanaladi. Barcha amallar berilgan tartibda bajarilgandan keyingi qatorni chiqaring.",
  statementEn: "You are given a string s of n lowercase Latin letters and m operations. The operation \"1 l r\" reverses the piece from position l to position r. The operation \"2 l r\" cuts the piece from position l to position r out of the string and puts it, unchanged, at the end. Positions always refer to the current string and are counted from 1. Print the string after all operations have been carried out in the given order.",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda s. Keyingi m ta qatorning har birida bitta amal.",
  inputEn: "The first line contains n and m. The second line contains s. Each of the next m lines contains one operation.",
  outputUz: "Hosil bo‘lgan qatorni chiqaring.",
  outputEn: "Print the resulting string.",
  constraintList: ["1 ≤ n, m ≤ 10^5", "s consists of lowercase Latin letters", "1 ≤ l ≤ r ≤ n", "the length of the string never changes"],
  constraintListUz: ["1 ≤ n, m ≤ 10^5", "s kichik lotin harflaridan iborat", "1 ≤ l ≤ r ≤ n", "qatorning uzunligi o‘zgarmaydi"],
  sampleInputs: ["7 3\nabcdefg\n1 2 5\n2 1 3\n1 3 7\n"],
  expect: ["cbdeagf\n"],
  sampleNotesUz: [
    "bcde teskari aylanib aedcbfg hosil bo‘ladi. aed oxirga ko‘chadi: cbfgaed. 3-dan 7-gacha fgaed teskari aylanadi: cbdeagf.",
  ],
  sampleNotesEn: [
    "Reversing bcde gives aedcbfg. Moving aed to the end gives cbfgaed. Reversing fgaed, positions 3 to 7, gives cbdeagf.",
  ],
  testInputs: ["7 3\nabcdefg\n1 2 5\n2 1 3\n1 3 7\n", "1 2\nz\n1 1 1\n2 1 1\n", "5 3\nabcde\n2 1 5\n2 2 3\n1 1 5\n", "6 2\nabcdef\n1 1 6\n2 2 3\n", "8 4\naabbccdd\n2 3 4\n1 1 8\n2 5 8\n1 2 3\n"],
  sol: `int n,m;cin>>n>>m;string s;cin>>s;static int L[100005],R[100005],S[100005];static unsigned P[100005];static char F[100005];
mt19937 rng(12345);for(int i=1;i<=n;++i){P[i]=rng();S[i]=1;}
auto split=[&](auto&&self,int t,int k,int&a,int&b)->void{if(!t){a=b=0;return;}
 if(F[t]){int x=L[t];L[t]=R[t];R[t]=x;F[L[t]]^=1;F[R[t]]^=1;F[t]=0;}
 if(S[L[t]]<k){int x,y;self(self,R[t],k-S[L[t]]-1,x,y);R[t]=x;a=t;b=y;}else{int x,y;self(self,L[t],k,x,y);L[t]=y;a=x;b=t;}S[t]=1+S[L[t]]+S[R[t]];};
auto merge=[&](auto&&self,int a,int b)->int{if(!a)return b;if(!b)return a;
 if(P[a]>P[b]){if(F[a]){int x=L[a];L[a]=R[a];R[a]=x;F[L[a]]^=1;F[R[a]]^=1;F[a]=0;}int c=self(self,R[a],b);R[a]=c;S[a]=1+S[L[a]]+S[R[a]];return a;}
 if(F[b]){int x=L[b];L[b]=R[b];R[b]=x;F[L[b]]^=1;F[R[b]]^=1;F[b]=0;}int c=self(self,a,L[b]);L[b]=c;S[b]=1+S[L[b]]+S[R[b]];return b;};
int root=0;for(int i=1;i<=n;++i)root=merge(merge,root,i);
while(m--){int t,l,r;cin>>t>>l>>r;int a,b,c,d;split(split,root,l-1,a,b);split(split,b,r-l+1,c,d);
 if(t==1){F[c]^=1;root=merge(merge,merge(merge,a,c),d);}else root=merge(merge,merge(merge,a,d),c);}
string out;out.reserve(n);vector<int>stk;int cur=root;
while(cur||!stk.empty()){while(cur){if(F[cur]){int x=L[cur];L[cur]=R[cur];R[cur]=x;F[L[cur]]^=1;F[R[cur]]^=1;F[cur]=0;}stk.push_back(cur);cur=L[cur];}cur=stk.back();stk.pop_back();out+=s[cur-1];cur=R[cur];}
cout<<out<<"\\n";`,
  wrongNote: "Putting the cut piece at the front instead of the end reads \"move\" the wrong way round; cutting one letter too few reverses or moves l to r − 1.",
  wrong: [
    `int n,m;cin>>n>>m;string s;cin>>s;while(m--){int t,l,r;cin>>t>>l>>r;if(t==1)reverse(s.begin()+l-1,s.begin()+r);else{string p=s.substr(l-1,r-l+1);s.erase(l-1,r-l+1);s=p+s;}}cout<<s<<"\\n";`,
    `int n,m;cin>>n>>m;string s;cin>>s;while(m--){int t,l,r;cin>>t>>l>>r;if(t==1)reverse(s.begin()+l-1,s.begin()+r-1);else{string p=s.substr(l-1,r-l);s.erase(l-1,r-l);s+=p;}}cout<<s<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 8), m = r.int(1, 5); let s = line([n, m]) + "\n" + r.str(n, "abcd") + "\n"; for (let i = 0; i < m; i++) { const l = r.int(1, n); s += line([r.int(1, 2), l, r.int(l, n)]) + "\n"; } return s; },
  slow: [`int n,m;cin>>n>>m;string s;cin>>s;while(m--){int t,l,r;cin>>t>>l>>r;if(t==1)reverse(s.begin()+l-1,s.begin()+r);else{string p=s.substr(l-1,r-l+1);s.erase(l-1,r-l+1);s+=p;}}cout<<s<<"\\n";`],
  big: [
    { seed: 1, note: "10^5 operations on pieces covering almost the whole string", code: `n = m = 100000
ops = []
for _ in range(m):
    ops.append(line([r.int(1, 2), r.int(1, 1000), r.int(n - 1000, n)]))
return line([n, m]) + "\\n" + text(r, n, "abcdefghijklmnopqrstuvwxyz") + "\\n" + "\\n".join(ops)` },
    { seed: 2, note: "random pieces anywhere", code: `n = m = 100000
ops = []
for _ in range(m):
    l = r.int(1, n)
    rr = r.int(1, n)
    if l > rr:
        l, rr = rr, l
    ops.append(line([r.int(1, 2), l, rr]))
return line([n, m]) + "\\n" + text(r, n, "abc") + "\\n" + "\\n".join(ops)` },
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C628", judge: "tree-virtual-sum-pair-distances", topic: "trees", rating: 2200,
  tag: "Virtual tree", timeLimitMs: 2000,
  uz: "Belgilangan uchlar orasidagi masofalar",
  en: "Distances between marked vertices",
  statementUz: "n ta uchli daraxt berilgan, har bir qirraning uzunligi 1. q ta so‘rovning har birida k ta turli uch belgilanadi. Belgilangan uchlarning barcha tartibsiz juftliklari bo‘yicha masofalar yig‘indisini toping: ikki uch orasidagi masofa — ularni tutashtiruvchi yagona yo‘ldagi qirralar soni. Har bir so‘rov alohida: oldingi so‘rov belgilari keyingisiga o‘tmaydi.",
  statementEn: "You are given a tree with n vertices, every edge of length 1. Each of q queries marks k distinct vertices. Find the sum of the distances over all unordered pairs of marked vertices, where the distance between two vertices is the number of edges on the only path joining them. Each query stands alone: the marks of one query do not carry over to the next.",
  inputUz: "Birinchi qatorda n va q beriladi. Keyingi n − 1 ta qatorda daraxt qirralari. Keyingi q ta qatorning har biri k sonidan va k ta uch raqamidan iborat.",
  inputEn: "The first line contains n and q. Each of the next n − 1 lines contains an edge of the tree. Each of the next q lines contains k followed by the k vertex numbers.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print the answer on its own line.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 10^5", "the sum of all k is at most 2·10^5", "the vertices of one query are distinct"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 10^5", "barcha k lar yig‘indisi 2·10^5 dan oshmaydi", "bir so‘rovdagi uchlar turli"],
  sampleInputs: ["6 3\n1 2\n1 3\n2 4\n2 5\n3 6\n3 4 5 6\n2 1 6\n1 3\n"],
  expect: ["10\n2\n0\n"],
  sampleNotesUz: [
    "4 va 5 orasida 2, 4 va 6 orasida 4 (4–2–1–3–6), 5 va 6 orasida 4: jami 10. 1 va 6 orasida 2. Bitta uchda juftlik yo‘q.",
  ],
  sampleNotesEn: [
    "4 and 5 are 2 apart, 4 and 6 are 4 apart (4–2–1–3–6), 5 and 6 are 4 apart: 10 in total. 1 and 6 are 2 apart. A single vertex forms no pair.",
  ],
  testInputs: ["6 3\n1 2\n1 3\n2 4\n2 5\n3 6\n3 4 5 6\n2 1 6\n1 3\n", "1 1\n1 1\n", "5 2\n1 2\n2 3\n3 4\n4 5\n5 1 2 3 4 5\n3 1 3 5\n", "7 3\n4 1\n4 2\n4 3\n4 5\n5 6\n5 7\n4 1 2 6 7\n3 1 2 3\n2 6 7\n"],
  sol: `int n,q;cin>>n>>q;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
const int LG=18;static int up[18][200005],dep[200005],tin[200005],tout[200005],it[200005],vp[200005];static char vis[200005],mk[200005];static long long cnt[200005];
int timer=0;vector<int>st={1};vis[1]=1;up[0][1]=1;tin[1]=timer++;
while(!st.empty()){int u=st.back();if(it[u]<(int)g[u].size()){int w=g[u][it[u]++];if(!vis[w]){vis[w]=1;up[0][w]=u;dep[w]=dep[u]+1;tin[w]=timer++;st.push_back(w);}}else{tout[u]=timer;st.pop_back();}}
for(int j=1;j<LG;++j)for(int v=1;v<=n;++v)up[j][v]=up[j-1][up[j-1][v]];
auto anc=[&](int a,int b){return tin[a]<=tin[b]&&tout[b]<=tout[a];};
auto lca=[&](int a,int b){if(anc(a,b))return a;if(anc(b,a))return b;for(int j=LG-1;j>=0;--j)if(!anc(up[j][a],b))a=up[j][a];return up[0][a];};
auto byTin=[&](int a,int b){return tin[a]<tin[b];};
while(q--){int k;cin>>k;vector<int>vs(k);for(auto&x:vs){cin>>x;mk[x]=1;}sort(vs.begin(),vs.end(),byTin);
 vector<int>all(vs);for(int i=0;i+1<k;++i)all.push_back(lca(vs[i],vs[i+1]));sort(all.begin(),all.end(),byTin);all.erase(unique(all.begin(),all.end()),all.end());
 vector<int>stk;for(int v:all){while(!stk.empty()&&!anc(stk.back(),v))stk.pop_back();vp[v]=stk.empty()?0:stk.back();stk.push_back(v);cnt[v]=mk[v];}
 long long ans=0;for(int i=(int)all.size()-1;i>=0;--i){int v=all[i];if(vp[v]){ans+=cnt[v]*(k-cnt[v])*(long long)(dep[v]-dep[vp[v]]);cnt[vp[v]]+=cnt[v];}}
 for(int v:all){mk[v]=0;cnt[v]=0;}cout<<ans<<"\\n";}`,
  wrongNote: "Summing the distances between neighbours in DFS order and halving gives the size of the connecting subtree, not the pairwise total; counting ordered pairs doubles every answer.",
  wrong: [
    `int n,q;cin>>n>>q;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
const int LG=18;vector<vector<int>>up(LG,vector<int>(n+1,1));vector<int>dep(n+1,0),tin(n+1,0),tout(n+1,0),it(n+1,0);vector<char>vis(n+1,0);
int timer=0;vector<int>st={1};vis[1]=1;tin[1]=timer++;
while(!st.empty()){int u=st.back();if(it[u]<(int)g[u].size()){int w=g[u][it[u]++];if(!vis[w]){vis[w]=1;up[0][w]=u;dep[w]=dep[u]+1;tin[w]=timer++;st.push_back(w);}}else{tout[u]=timer;st.pop_back();}}
for(int j=1;j<LG;++j)for(int v=1;v<=n;++v)up[j][v]=up[j-1][up[j-1][v]];
auto anc=[&](int a,int b){return tin[a]<=tin[b]&&tout[b]<=tout[a];};
auto lca=[&](int a,int b){if(anc(a,b))return a;if(anc(b,a))return b;for(int j=LG-1;j>=0;--j)if(!anc(up[j][a],b))a=up[j][a];return up[0][a];};
while(q--){int k;cin>>k;vector<int>vs(k);for(auto&x:vs)cin>>x;sort(vs.begin(),vs.end(),[&](int a,int b){return tin[a]<tin[b];});
 long long s=0;for(int i=0;i<k;++i){int a=vs[i],b=vs[(i+1)%k];s+=dep[a]+dep[b]-2*dep[lca(a,b)];}cout<<s/2<<"\\n";}`,
    `int n,q;cin>>n>>q;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
while(q--){int k;cin>>k;vector<int>vs(k);for(auto&x:vs)cin>>x;long long s=0;for(int i=0;i<k;++i){vector<int>d(n+1,-1);queue<int>Q;Q.push(vs[i]);d[vs[i]]=0;while(!Q.empty()){int u=Q.front();Q.pop();for(int w:g[u])if(d[w]<0){d[w]=d[u]+1;Q.push(w);}}for(int j=0;j<k;++j)s+=d[vs[j]];}cout<<s<<"\\n";}`,
  ],
  gen: (r) => { const n = r.int(1, 8), q = r.int(1, 4); let s = line([n, q]) + "\n" + r.tree(n).map((e) => line(e) + "\n").join(""); for (let i = 0; i < q; i++) { const k = r.int(1, n); s += line([k, ...r.perm(n).slice(0, k)]) + "\n"; } return s; },
  slow: [
    `int n,q;cin>>n>>q;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
while(q--){int k;cin>>k;vector<int>vs(k);for(auto&x:vs)cin>>x;long long s=0;for(int i=0;i<k;++i){vector<int>d(n+1,-1);queue<int>Q;Q.push(vs[i]);d[vs[i]]=0;while(!Q.empty()){int u=Q.front();Q.pop();for(int w:g[u])if(d[w]<0){d[w]=d[u]+1;Q.push(w);}}for(int j=i+1;j<k;++j)s+=d[vs[j]];}cout<<s<<"\\n";}`,
    `int n,q;cin>>n>>q;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
const int LG=18;vector<vector<int>>up(LG,vector<int>(n+1,1));vector<int>dep(n+1,0),tin(n+1,0),tout(n+1,0),it(n+1,0);vector<char>vis(n+1,0);
int timer=0;vector<int>st={1};vis[1]=1;tin[1]=timer++;
while(!st.empty()){int u=st.back();if(it[u]<(int)g[u].size()){int w=g[u][it[u]++];if(!vis[w]){vis[w]=1;up[0][w]=u;dep[w]=dep[u]+1;tin[w]=timer++;st.push_back(w);}}else{tout[u]=timer;st.pop_back();}}
for(int j=1;j<LG;++j)for(int v=1;v<=n;++v)up[j][v]=up[j-1][up[j-1][v]];
auto anc=[&](int a,int b){return tin[a]<=tin[b]&&tout[b]<=tout[a];};
auto lca=[&](int a,int b){if(anc(a,b))return a;if(anc(b,a))return b;for(int j=LG-1;j>=0;--j)if(!anc(up[j][a],b))a=up[j][a];return up[0][a];};
while(q--){int k;cin>>k;vector<int>vs(k);for(auto&x:vs)cin>>x;long long s=0;for(int i=0;i<k;++i)for(int j=i+1;j<k;++j)s+=dep[vs[i]]+dep[vs[j]]-2*dep[lca(vs[i],vs[j])];cout<<s<<"\\n";}`,
  ],
  big: [
    { seed: 1, note: "a random tree of 10^5 vertices and 10^5 queries of two vertices: a search per query is too slow", code: `n, q = 100000, 100000
qs = []
for _ in range(q):
    a = r.int(1, n)
    b = r.int(1, n - 1)
    if b >= a:
        b += 1
    qs.append(line([2, a, b]))
return line([n, q]) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n)) + "\\n" + "\\n".join(qs)` },
    { seed: 2, note: "a path of 1.5·10^5 vertices with every vertex marked at once: all pairs is quadratic", code: `n = 150000
return line([n, 1]) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n, "path")) + "\\n" + line([n] + r.perm(n))` },
    { seed: 3, note: "1000 queries of 200 vertices on a binary tree", code: `n, q = 200000, 1000
qs = []
for _ in range(q):
    qs.append(line([200] + r.perm(n)[:200]))
return line([n, q]) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n, "binary")) + "\\n" + "\\n".join(qs)` },
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C629", judge: "tree-isomorphism-unrooted", topic: "trees", rating: 2300,
  tag: "Tree hashing", timeLimitMs: 2000,
  uz: "Bir xil daraxtlarmi",
  en: "Are the trees the same",
  statementUz: "Ikkita daraxt berilgan, har birida 1 dan n gacha raqamlangan n ta uch bor. Ular izomorf, ya'ni bir xilmi: birinchi daraxt uchlarini shunday qayta raqamlash mumkinmi, natijada uning qirralar to‘plami ikkinchi daraxtning qirralar to‘plami bilan aynan bir xil bo‘lsin? Daraxtlarda ildiz yo‘q: faqat qaysi uchlar qirra bilan tutashgani muhim. Bir kirishda t ta shunday juftlik bor.",
  statementEn: "You are given two trees, each with n vertices numbered 1 to n. Are they isomorphic, that is, the same: can the vertices of the first tree be renumbered so that its set of edges becomes exactly the edge set of the second tree? The trees have no root: only which vertices are joined by an edge matters. One input holds t such pairs.",
  inputUz: "Birinchi qatorda t beriladi. Har bir juftlik n sonidan boshlanadi, keyin birinchi daraxtning n − 1 ta qirrasi, keyin ikkinchi daraxtning n − 1 ta qirrasi keladi.",
  inputEn: "The first line contains t. Each pair starts with n, followed by the n − 1 edges of the first tree and then the n − 1 edges of the second.",
  outputUz: "Har bir juftlik uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each pair print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 1000", "1 ≤ n ≤ 10^5", "the sum of n over all pairs is at most 10^5", "both inputs are trees"],
  constraintListUz: ["1 ≤ t ≤ 1000", "1 ≤ n ≤ 10^5", "barcha juftliklar bo‘yicha n lar yig‘indisi 10^5 dan oshmaydi", "ikkala kirish ham daraxt"],
  sampleInputs: ["2\n4\n1 2\n2 3\n3 4\n2 1\n1 3\n3 4\n4\n1 2\n2 3\n3 4\n1 2\n1 3\n1 4\n"],
  expect: ["YES\nNO\n"],
  sampleNotesUz: [
    "Ikkalasi ham 4 uchli yo‘l: 1–2–3–4 va 2–1–3–4. Ikkinchi juftlikda yo‘l va yulduz — yulduzda 3 qirrali uch bor, yo‘lda yo‘q.",
  ],
  sampleNotesEn: [
    "Both are paths of 4 vertices: 1–2–3–4 and 2–1–3–4. The second pair is a path and a star — the star has a vertex of degree 3, the path does not.",
  ],
  testInputs: ["2\n4\n1 2\n2 3\n3 4\n2 1\n1 3\n3 4\n4\n1 2\n2 3\n3 4\n1 2\n1 3\n1 4\n", "1\n1\n", "1\n2\n1 2\n2 1\n", "1\n6\n1 2\n2 3\n3 4\n1 5\n1 6\n1 2\n2 3\n1 4\n4 5\n1 6\n", "1\n6\n1 2\n2 3\n3 4\n4 5\n5 6\n6 1\n1 3\n3 5\n5 2\n2 4\n", "2\n7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n7 1\n1 2\n7 3\n3 4\n2 5\n2 6\n7\n1 2\n1 3\n2 4\n2 5\n3 6\n6 7\n1 2\n1 3\n2 4\n2 5\n2 6\n3 7\n"],
  sol: `int t;cin>>t;map<vector<int>,int>ids;
auto readTree=[&](int n){vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}return g;};
auto centers=[&](vector<vector<int>>&g,int n){vector<int>deg(n+1,0),leaves;for(int v=1;v<=n;++v){deg[v]=g[v].size();if(deg[v]<=1)leaves.push_back(v);}
 int rem=n;while(rem>2){vector<int>nl;for(int v:leaves){--rem;for(int w:g[v])if(--deg[w]==1)nl.push_back(w);}leaves=nl;}return leaves;};
auto look=[&](vector<int>&k){auto f=ids.find(k);if(f!=ids.end())return f->second;int v=ids.size();ids.emplace(k,v);return v;};
auto canon=[&](vector<vector<int>>&g,int n,vector<int>&c){int r=c[0];vector<int>order,par(n+1,0);order.reserve(n);order.push_back(r);
 for(size_t i=0;i<order.size();++i){int u=order[i];for(int w:g[u])if(w!=par[u]){par[w]=u;order.push_back(w);}}
 vector<int>id(n+1,0);vector<vector<int>>kids(n+1);
 for(int i=n-1;i>=0;--i){int u=order[i];vector<int>&k=kids[u];sort(k.begin(),k.end());id[u]=look(k);if(par[u])kids[par[u]].push_back(id[u]);}
 if(c.size()==1)return make_pair(id[r],-1);
 vector<int>k=kids[r];k.erase(lower_bound(k.begin(),k.end(),id[c[1]]));int a=look(k),b=id[c[1]];return make_pair(min(a,b),max(a,b));};
while(t--){int n;cin>>n;auto g1=readTree(n);auto g2=readTree(n);auto c1=centers(g1,n),c2=centers(g2,n);
 bool ok=c1.size()==c2.size()&&canon(g1,n,c1)==canon(g2,n,c2);
 cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Comparing sorted degree lists calls two different spiders the same; rooting both trees at vertex 1 compares the trees as they happen to be numbered.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>d1(n+1,0),d2(n+1,0);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;d1[a]++;d1[b]++;}for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;d2[a]++;d2[b]++;}
 sort(d1.begin(),d1.end());sort(d2.begin(),d2.end());cout<<(d1==d2?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;map<vector<int>,int>ids;
auto readTree=[&](int n){vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}return g;};
auto rootId=[&](vector<vector<int>>&g,int n,int r){vector<int>order,par(n+1,0);order.push_back(r);
 for(size_t i=0;i<order.size();++i){int u=order[i];for(int w:g[u])if(w!=par[u]){par[w]=u;order.push_back(w);}}
 vector<int>id(n+1,0);vector<vector<int>>kids(n+1);
 for(int i=n-1;i>=0;--i){int u=order[i];vector<int>&k=kids[u];sort(k.begin(),k.end());auto f=ids.find(k);int v;if(f==ids.end()){v=ids.size();ids.emplace(k,v);}else v=f->second;id[u]=v;if(par[u])kids[par[u]].push_back(v);}
 return id[r];};
while(t--){int n;cin>>n;auto g1=readTree(n);auto g2=readTree(n);cout<<(rootId(g1,n,1)==rootId(g2,n,1)?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 3); let s = t + "\n"; for (let i = 0; i < t; i++) { const n = r.int(1, 7); const a = r.tree(n); let b; if (r.int(0, 1)) { const p = r.perm(n); b = r.shuffle(a.map(([x, y]) => [p[x - 1], p[y - 1]])); } else b = r.tree(n); s += n + "\n" + a.map((e) => line(e) + "\n").join("") + b.map((e) => line(e) + "\n").join(""); } return s; },
  brute: `int t;cin>>t;while(t--){int n;cin>>n;set<pair<int,int>>A;vector<pair<int,int>>B(n-1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;A.insert(make_pair(min(a,b),max(a,b)));}for(auto&e:B)cin>>e.first>>e.second;
 vector<int>p(n+1);iota(p.begin(),p.end(),0);bool ok=false;do{bool all=true;for(auto&e:B){int a=p[e.first],b=p[e.second];if(!A.count(make_pair(min(a,b),max(a,b)))){all=false;break;}}if(all){ok=true;break;}}while(next_permutation(p.begin()+1,p.end()));
 cout<<(ok?"YES":"NO")<<"\\n";}`,
  slow: [`int t;cin>>t;
auto readTree=[&](int n){vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}return g;};
auto centers=[&](vector<vector<int>>&g,int n){vector<int>deg(n+1,0),leaves;for(int v=1;v<=n;++v){deg[v]=g[v].size();if(deg[v]<=1)leaves.push_back(v);}
 int rem=n;while(rem>2){vector<int>nl;for(int v:leaves){--rem;for(int w:g[v])if(--deg[w]==1)nl.push_back(w);}leaves=nl;}return leaves;};
auto code=[&](vector<vector<int>>&g,int n,int r){vector<int>order,par(n+1,0);order.push_back(r);
 for(size_t i=0;i<order.size();++i){int u=order[i];for(int w:g[u])if(w!=par[u]){par[w]=u;order.push_back(w);}}
 vector<vector<string>>kids(n+1);string res;
 for(int i=n-1;i>=0;--i){int u=order[i];sort(kids[u].begin(),kids[u].end());string c="(";for(auto&x:kids[u])c+=x;c+=")";kids[u].clear();if(par[u])kids[par[u]].push_back(c);else res=c;}
 return res;};
while(t--){int n;cin>>n;auto g1=readTree(n);auto g2=readTree(n);auto c1=centers(g1,n),c2=centers(g2,n);bool ok=false;
 if(c1.size()==c2.size()){string a=code(g1,n,c1[0]);for(int c:c2)if(code(g2,n,c)==a)ok=true;}
 cout<<(ok?"YES":"NO")<<"\\n";}`],
  big: [
    { seed: 1, note: "a random tree of 10^5 vertices and the same tree renumbered", code: `n = 100000
e = tree_edges(r, n)
p = [0] + r.perm(n)
f = r.shuffle([(p[a], p[b]) for a, b in e])
return "1\\n" + str(n) + "\\n" + "\\n".join(line(x) for x in e) + "\\n" + "\\n".join(line(x) for x in f)` },
    { seed: 2, note: "a path of 10^5 vertices, renumbered: building canonical strings is quadratic", code: `n = 100000
e = tree_edges(r, n, "path")
p = [0] + r.perm(n)
f = r.shuffle([(p[a], p[b]) for a, b in e])
return "1\\n" + str(n) + "\\n" + "\\n".join(line(x) for x in e) + "\\n" + "\\n".join(line(x) for x in f)` },
    { seed: 3, note: "a random tree and the same tree with one leaf moved", code: `n = 100000
e = tree_edges(r, n)
deg = [0] * (n + 1)
for a, b in e:
    deg[a] += 1
    deg[b] += 1
i = 0
while deg[e[i][0]] != 1 and deg[e[i][1]] != 1:
    i += 1
a, b = e[i]
v = a if deg[a] == 1 else b
w = r.int(1, n)
while w == v or w == (b if v == a else a):
    w = r.int(1, n)
f = list(e)
f[i] = (v, w)
p = [0] + r.perm(n)
f = r.shuffle([(p[x], p[y]) for x, y in f])
return "1\\n" + str(n) + "\\n" + "\\n".join(line(x) for x in e) + "\\n" + "\\n".join(line(x) for x in f)` },
    { seed: 4, note: "a deep binary tree renumbered", code: `n = 100000
e = tree_edges(r, n, "binary")
p = [0] + r.perm(n)
f = r.shuffle([(p[a], p[b]) for a, b in e])
return "1\\n" + str(n) + "\\n" + "\\n".join(line(x) for x in e) + "\\n" + "\\n".join(line(x) for x in f)` },
  ],
});

export default P;
