/* Batch 630 — four problems, B630–C633, written for the roadmap units whose
 * main problem sat more than 400 rating away from the unit's band: the
 * exchange argument, inclusion-exclusion, circle geometry and FFT/NTT. Each
 * rating sits in its unit's band in app/ui/roadmap-data.ts; the bank reaches
 * 633.
 *
 * Every task is a well-known contest problem restated for AlgoYo'l in our own
 * words, with our own samples; ratings follow the Codeforces scale.
 */
import { line, many } from "./gen-lib.mjs";

const P = [];

/* ------------------------------------------------------------------ 1600 */
const jobsGen = (r) => { const n = r.int(1, 7); let s = n + "\n"; for (let i = 0; i < n; i++) s += line([r.int(1, 9), r.int(1, 9)]) + "\n"; return s; };
P.push({
  id: "B630", judge: "greedy-weighted-completion-order", topic: "greedy", rating: 1600,
  tag: "Exchange argument", timeLimitMs: 1000,
  uz: "Buyurtmalar navbati",
  en: "The order of the orders",
  statementUz: "Ustaxonada n ta buyurtma va ularni birma-bir bajaradigan bitta dastgoh bor: dastgoh tanaffussiz ishlaydi va boshlangan buyurtmani oxirigacha to‘xtatmaydi. i-buyurtma t_i soat davom etadi va w_i vaznga ega. Agar i-buyurtma ish boshlanganidan C_i soat o‘tib tugasa, u w_i · C_i ga tushadi. Buyurtmalarni istalgan tartibda bajarish mumkin. Barcha buyurtmalar bo‘yicha w_i · C_i yig‘indisining eng kichik qiymatini toping.",
  statementEn: "A workshop has n orders and one machine that handles them one at a time: it works without breaks and never interrupts an order once it has started. Order i takes t_i hours and has a weight w_i. If order i is finished C_i hours after work begins, it costs w_i · C_i. The orders may be processed in any sequence. Find the smallest possible total cost, the sum of w_i · C_i over all orders.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida t_i va w_i.",
  inputEn: "The first line contains n. Each of the next n lines contains t_i and w_i.",
  outputUz: "Eng kichik umumiy narxni chiqaring.",
  outputEn: "Print the smallest total cost.",
  constraintList: ["1 ≤ n ≤ 2 · 10^5", "1 ≤ t_i, w_i ≤ 10^4", "the answer needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 2 · 10^5", "1 ≤ t_i, w_i ≤ 10^4", "javob 64 bitli turni talab qiladi"],
  sampleInputs: ["3\n2 1\n3 10\n1 1\n", "1\n5 7\n"],
  expect: ["40\n", "35\n"],
  sampleNotesUz: [
    "Avval 2-buyurtma (3 soatda tugaydi), keyin 3-buyurtma (4 soatda), oxirida 1-buyurtma (6 soatda): 10 · 3 + 1 · 4 + 1 · 6 = 40. Eng qisqasidan boshlash 1 · 1 + 1 · 3 + 10 · 6 = 64 beradi.",
    "Bitta buyurtma 5 soatda tugaydi: 7 · 5 = 35.",
  ],
  sampleNotesEn: [
    "Order 2 first (finished at hour 3), then order 3 (hour 4), then order 1 (hour 6): 10 · 3 + 1 · 4 + 1 · 6 = 40. Starting with the shortest order gives 1 · 1 + 1 · 3 + 10 · 6 = 64.",
    "The only order is finished at hour 5: 7 · 5 = 35.",
  ],
  testInputs: ["3\n2 1\n3 10\n1 1\n", "1\n5 7\n", "2\n1 1\n1 1\n", "4\n10000 1\n1 10000\n5000 5000\n3 7\n", "5\n1 2\n2 4\n3 6\n4 8\n5 10\n",
    "6\n7 3\n2 9\n4 4\n9 2\n1 1\n6 5\n", "3\n3 2\n5 3\n4 3\n", "3\n10000 10000\n10000 10000\n10000 10000\n", "4\n5 9\n9 5\n2 1\n1 2\n", ...many(jobsGen, 6, 31)],
  sol: `int n;cin>>n;vector<long long>t(n),w(n);for(int i=0;i<n;++i)cin>>t[i]>>w[i];vector<int>id(n);iota(id.begin(),id.end(),0);
sort(id.begin(),id.end(),[&](int i,int j){return t[i]*w[j]<t[j]*w[i];});
long long T=0,ans=0;for(int i:id){T+=t[i];ans+=w[i]*T;}cout<<ans<<"\\n";`,
  wrongNote: "Shortest order first ignores the weights and heaviest first ignores the durations; comparing t_i / w_i with integer division treats 5/3 and 4/3 as equal and keeps the input order.",
  wrong: [
    `int n;cin>>n;vector<long long>t(n),w(n);for(int i=0;i<n;++i)cin>>t[i]>>w[i];vector<int>id(n);iota(id.begin(),id.end(),0);
sort(id.begin(),id.end(),[&](int i,int j){return t[i]<t[j];});
long long T=0,ans=0;for(int i:id){T+=t[i];ans+=w[i]*T;}cout<<ans<<"\\n";`,
    `int n;cin>>n;vector<long long>t(n),w(n);for(int i=0;i<n;++i)cin>>t[i]>>w[i];vector<int>id(n);iota(id.begin(),id.end(),0);
sort(id.begin(),id.end(),[&](int i,int j){return w[i]>w[j];});
long long T=0,ans=0;for(int i:id){T+=t[i];ans+=w[i]*T;}cout<<ans<<"\\n";`,
    `int n;cin>>n;vector<long long>t(n),w(n);for(int i=0;i<n;++i)cin>>t[i]>>w[i];vector<int>id(n);iota(id.begin(),id.end(),0);
stable_sort(id.begin(),id.end(),[&](int i,int j){return t[i]/w[i]<t[j]/w[j];});
long long T=0,ans=0;for(int i:id){T+=t[i];ans+=w[i]*T;}cout<<ans<<"\\n";`,
  ],
  gen: jobsGen,
  brute: `int n;cin>>n;vector<long long>t(n),w(n);for(int i=0;i<n;++i)cin>>t[i]>>w[i];vector<int>p(n);iota(p.begin(),p.end(),0);long long best=LLONG_MAX;
do{long long T=0,c=0;for(int i:p){T+=t[i];c+=w[i]*T;}best=min(best,c);}while(next_permutation(p.begin(),p.end()));cout<<best<<"\\n";`,
  slow: [`int n;cin>>n;vector<long long>t(n),w(n);for(int i=0;i<n;++i)cin>>t[i]>>w[i];
for(int i=0;i<n;++i){int b=i;for(int j=i+1;j<n;++j)if(t[j]*w[b]<t[b]*w[j])b=j;swap(t[i],t[b]);swap(w[i],w[b]);}
long long T=0,ans=0;for(int i=0;i<n;++i){T+=t[i];ans+=w[i]*T;}cout<<ans<<"\\n";`],
  big: [
    { seed: 1, note: "2·10^5 random orders: picking the next order by a scan is quadratic", code: `n = 200000\nreturn str(n) + "\\n" + "\\n".join(line([r.int(1, 10**4), r.int(1, 10**4)]) for _ in range(n))` },
    { seed: 2, note: "2·10^5 orders of 10^4 hours and weight 10^4: the total is about 2·10^18", code: `n = 200000\nreturn str(n) + "\\n" + "\\n".join("10000 10000" for _ in range(n))` },
  ],
});

/* ------------------------------------------------------------------ 1900 */
const divGen = (r) => { const k = r.int(1, 5); const a = r.shuffle(Array.from({ length: 30 }, (_, i) => i + 1)).slice(0, k); return line([r.int(1, 200), k, r.int(0, k)]) + "\n" + line(a) + "\n"; };
const P20 = "2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71";
P.push({
  id: "C631", judge: "math-divisible-by-exactly-m", topic: "math", rating: 1900,
  tag: "Inclusion-exclusion", timeLimitMs: 2000,
  uz: "Aynan m tasiga bo‘linadi",
  en: "Divisible by exactly m of them",
  statementUz: "N soni va k ta har xil musbat butun son a_1, …, a_k berilgan. 1 dan N gacha bo‘lgan har bir butun x uchun berilgan sonlardan nechtasi x ni qoldiqsiz bo‘lishini sanaymiz. 1 dan N gacha bo‘lgan x lardan nechtasi berilgan sonlarning aynan m tasiga — ko‘p ham emas, kam ham emas — bo‘linishini toping. m = 0 bo‘lsa, bular berilgan sonlarning birortasiga ham bo‘linmaydigan sonlardir.",
  statementEn: "You are given a number N and k distinct positive integers a_1, …, a_k. For every integer x from 1 to N, count how many of the given numbers divide x without remainder. Find how many x from 1 to N are divisible by exactly m of the given numbers — not more and not fewer. When m = 0, these are the numbers that none of the given numbers divides.",
  inputUz: "Birinchi qatorda N, k va m beriladi. Ikkinchi qatorda k ta son a_i.",
  inputEn: "The first line contains N, k and m. The second line contains the k numbers a_i.",
  outputUz: "Aynan m ta berilgan songa bo‘linadigan x lar sonini chiqaring.",
  outputEn: "Print how many x are divisible by exactly m of the given numbers.",
  constraintList: ["1 ≤ N ≤ 10^18", "1 ≤ k ≤ 20", "0 ≤ m ≤ k", "1 ≤ a_i ≤ 10^18", "all a_i are distinct"],
  constraintListUz: ["1 ≤ N ≤ 10^18", "1 ≤ k ≤ 20", "0 ≤ m ≤ k", "1 ≤ a_i ≤ 10^18", "barcha a_i har xil"],
  sampleInputs: ["20 2 1\n2 3\n", "30 3 2\n2 3 5\n"],
  expect: ["10\n", "7\n"],
  sampleNotesUz: [
    "2 yoki 3 dan faqat bittasiga bo‘linadiganlar: 2, 3, 4, 8, 9, 10, 14, 15, 16, 20. 6, 12 va 18 ikkalasiga bo‘linadi, shuning uchun sanalmaydi.",
    "Aynan ikkitasiga bo‘linadiganlar: 6, 10, 12, 15, 18, 20, 24. 30 esa uchalasiga ham bo‘linadi.",
  ],
  sampleNotesEn: [
    "The numbers divisible by just one of 2 and 3 are 2, 3, 4, 8, 9, 10, 14, 15, 16, 20. 6, 12 and 18 are divisible by both, so they are not counted.",
    "The numbers divisible by exactly two are 6, 10, 12, 15, 18, 20, 24; 30 is divisible by all three.",
  ],
  testInputs: ["20 2 1\n2 3\n", "30 3 2\n2 3 5\n", "10 2 0\n4 6\n", "1 1 1\n1\n", "1 1 0\n1\n", "1000000000000000000 1 1\n1\n",
    "1000000000000000000 2 1\n1000000007 10000000019\n", "1000000000000000000 2 2\n1000000007 10000000019\n", "1000000000000000000 3 3\n2 3 5\n",
    "100 4 2\n2 4 8 16\n", "1000000 4 1\n6 10 15 4\n", "1000000000000000000 5 0\n2 3 5 7 11\n", "999999999999999999 4 1\n6 10 15 1000000000000000000\n",
    "50 3 3\n60 70 80\n", "1000000000000000000 20 10\n" + P20 + "\n", "1000000000000000000 20 0\n" + P20 + "\n",
    "1000000000000000000 20 3\n2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21\n", "987654321987654321 20 1\n" + Array.from({ length: 20 }, (_, i) => 1000 + 37 * i).join(" ") + "\n",
    ...many(divGen, 6, 41)],
  sol: `long long N;int k,m;cin>>N>>k>>m;vector<long long>a(k);for(auto&x:a)cin>>x;
int F=1<<k;vector<long long>L(F);L[0]=1;vector<__int128>g(k+1,0);g[0]=N;
for(int S=1;S<F;++S){int b=__builtin_ctz(S);long long p=L[S&(S-1)],v;
 if(p>N)v=N+1;else{long long q=p/__gcd(p,a[b]);__int128 t=(__int128)q*a[b];v=t>N?N+1:(long long)t;}
 L[S]=v;if(v<=N)g[__builtin_popcount(S)]+=N/v;}
vector<vector<long long>>C(k+1,vector<long long>(k+1,0));for(int i=0;i<=k;++i){C[i][0]=1;for(int j=1;j<=i;++j)C[i][j]=C[i-1][j-1]+C[i-1][j];}
__int128 ans=0;for(int s=m;s<=k;++s){__int128 t=(__int128)C[s][m]*g[s];if((s-m)%2)ans-=t;else ans+=t;}
cout<<(long long)ans<<"\\n";`,
  wrongNote: "Dropping the binomial factor C(|S|, m) counts the numbers with more than m divisors the wrong number of times; taking the lcm as a plain product is wrong as soon as two a_i share a factor; and an lcm that overflows a 64-bit integer wraps to a small or negative number instead of being treated as larger than N.",
  wrong: [
    `long long N;int k,m;cin>>N>>k>>m;vector<long long>a(k);for(auto&x:a)cin>>x;
int F=1<<k;vector<long long>L(F);L[0]=1;vector<__int128>g(k+1,0);g[0]=N;
for(int S=1;S<F;++S){int b=__builtin_ctz(S);long long p=L[S&(S-1)],v;
 if(p>N)v=N+1;else{long long q=p/__gcd(p,a[b]);__int128 t=(__int128)q*a[b];v=t>N?N+1:(long long)t;}
 L[S]=v;if(v<=N)g[__builtin_popcount(S)]+=N/v;}
__int128 ans=0;for(int s=m;s<=k;++s){if((s-m)%2)ans-=g[s];else ans+=g[s];}
cout<<(long long)ans<<"\\n";`,
    `long long N;int k,m;cin>>N>>k>>m;vector<long long>a(k);for(auto&x:a)cin>>x;
int F=1<<k;vector<long long>L(F);L[0]=1;vector<__int128>g(k+1,0);g[0]=N;
for(int S=1;S<F;++S){int b=__builtin_ctz(S);long long p=L[S&(S-1)],v;
 if(p>N)v=N+1;else{__int128 t=(__int128)p*a[b];v=t>N?N+1:(long long)t;}
 L[S]=v;if(v<=N)g[__builtin_popcount(S)]+=N/v;}
vector<vector<long long>>C(k+1,vector<long long>(k+1,0));for(int i=0;i<=k;++i){C[i][0]=1;for(int j=1;j<=i;++j)C[i][j]=C[i-1][j-1]+C[i-1][j];}
__int128 ans=0;for(int s=m;s<=k;++s){__int128 t=(__int128)C[s][m]*g[s];if((s-m)%2)ans-=t;else ans+=t;}
cout<<(long long)ans<<"\\n";`,
    `long long N;int k,m;cin>>N>>k>>m;vector<long long>a(k);for(auto&x:a)cin>>x;
int F=1<<k;vector<long long>L(F);L[0]=1;vector<__int128>g(k+1,0);g[0]=N;
for(int S=1;S<F;++S){int b=__builtin_ctz(S);long long p=L[S&(S-1)],v;
 if(p>N)v=N+1;else{long long q=p/__gcd(p,a[b]);v=q*a[b];if(v>N)v=N+1;}
 L[S]=v;if(v<=N)g[__builtin_popcount(S)]+=N/v;}
vector<vector<long long>>C(k+1,vector<long long>(k+1,0));for(int i=0;i<=k;++i){C[i][0]=1;for(int j=1;j<=i;++j)C[i][j]=C[i-1][j-1]+C[i-1][j];}
__int128 ans=0;for(int s=m;s<=k;++s){__int128 t=(__int128)C[s][m]*g[s];if((s-m)%2)ans-=t;else ans+=t;}
cout<<(long long)ans<<"\\n";`,
  ],
  gen: divGen,
  brute: `long long N;int k,m;cin>>N>>k>>m;vector<long long>a(k);for(auto&x:a)cin>>x;long long c=0;
for(long long x=1;x<=N;++x){int d=0;for(long long v:a)if(x%v==0)++d;if(d==m)++c;}cout<<c<<"\\n";`,
  slow: [`long long N;int k,m;cin>>N>>k>>m;vector<long long>a(k);for(auto&x:a)cin>>x;long long c=0;
for(long long x=1;x<=N;++x){int d=0;for(long long v:a)if(x%v==0)++d;if(d==m)++c;}cout<<c<<"\\n";`],
  big: [
    { seed: 1, note: "N = 10^18 and 20 small distinct numbers: walking through 1..N is out of the question", code: `a = r.shuffle(list(range(2, 60)))[:20]\nreturn "1000000000000000000 20 " + str(r.int(0, 20)) + "\\n" + line(a)` },
    { seed: 2, note: "N near 10^18 and the first twenty primes, exactly seven of them", code: `return "999999999999999989 20 7\\n${P20}"` },
  ],
});

/* ------------------------------------------------------------------ 2000 */
const diskGen = (r) => {
  const n = r.int(1, 8), R = r.int(1, 5), seen = new Set(), pts = [];
  while (pts.length < n) { const x = r.int(-6, 6), y = r.int(-6, 6); if (seen.has(x + "," + y)) continue; seen.add(x + "," + y); pts.push(x + " " + y); }
  return n + " " + R + "\n" + pts.join("\n") + "\n";
};
const DISK_BRUTE = `int n;long long R;cin>>n>>R;vector<double>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];double R2=(double)R*R;
auto cnt=[&](double cx,double cy){int c=0;for(int k=0;k<n;++k){double dx=x[k]-cx,dy=y[k]-cy;if(dx*dx+dy*dy<=R2+1e-6)++c;}return c;};
int best=0;for(int i=0;i<n;++i)best=max(best,cnt(x[i],y[i]));
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j){double dx=x[j]-x[i],dy=y[j]-y[i],d2=dx*dx+dy*dy;if(d2>4*R2)continue;double d=sqrt(d2),h=sqrt(max(0.0,R2-d2/4));
 double mx=(x[i]+x[j])/2,my=(y[i]+y[j])/2,ux=-dy/d,uy=dx/d;best=max(best,cnt(mx+h*ux,my+h*uy));best=max(best,cnt(mx-h*ux,my-h*uy));}
cout<<best<<"\\n";`;
const diskSol = (strict) => `int n;long long R;cin>>n>>R;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];
const double TW=2*acos(-1.0),EPS=${strict ? "-1e-9" : "1e-11"};int best=1;vector<pair<double,int>>ev;ev.reserve(2*n);
for(int i=0;i<n;++i){ev.clear();int cur=1;
 for(int j=0;j<n;++j){if(j==i)continue;long long dx=x[j]-x[i],dy=y[j]-y[i],d2=dx*dx+dy*dy;if(d2${strict ? ">=" : ">"}4*R*R)continue;
  double b=atan2((double)dy,(double)dx),h=atan2(sqrt((double)(4*R*R-d2)),sqrt((double)d2));
  double s=b-h-EPS;while(s<0)s+=TW;while(s>=TW)s-=TW;double e=s+2*h+2*EPS;
  if(e>=TW){++cur;ev.push_back(make_pair(e-TW,1));ev.push_back(make_pair(s,0));}
  else{ev.push_back(make_pair(s,0));ev.push_back(make_pair(e,1));}}
 sort(ev.begin(),ev.end());best=max(best,cur);
 for(auto&p:ev){if(p.second==0){++cur;best=max(best,cur);}else --cur;}}
cout<<best<<"\\n";`;
P.push({
  id: "C632", judge: "geo-disk-most-points", topic: "geometry", rating: 2000,
  tag: "Angular sweep", timeLimitMs: 2000,
  uz: "Doira bilan eng ko‘p nuqta",
  en: "One disk, as many points as possible",
  statementUz: "Tekislikda butun koordinatali n ta har xil nuqta va R soni berilgan. Radiusi R bo‘lgan doirani istalgan joyga qo‘yish mumkin — uning markazi butun koordinatali nuqta bo‘lishi shart emas. Markazgacha masofasi R dan oshmaydigan nuqta qoplangan hisoblanadi, ya’ni aynan chegaradagi aylanada yotgan nuqtalar ham qoplangan. Radiusi R bo‘lgan bitta doira bir vaqtda qoplay oladigan berilgan nuqtalarning eng ko‘p sonini toping.",
  statementEn: "There are n distinct points with integer coordinates on the plane, and a number R. A disk of radius R may be placed anywhere; its centre does not have to be a point with integer coordinates. A point is covered if its distance to the centre is at most R, so points lying exactly on the boundary circle are covered too. Find the largest number of the given points that a single disk of radius R can cover at once.",
  inputUz: "Birinchi qatorda n va R beriladi. Keyingi n ta qatorning har birida nuqtaning koordinatalari x_i va y_i.",
  inputEn: "The first line contains n and R. Each of the next n lines contains the coordinates x_i and y_i of a point.",
  outputUz: "Bitta doira qoplay oladigan nuqtalarning eng ko‘p sonini chiqaring.",
  outputEn: "Print the largest number of points one disk can cover.",
  constraintList: ["1 ≤ n ≤ 1000", "1 ≤ R ≤ 10^4", "|x_i|, |y_i| ≤ 10^4", "all points are distinct", "points on the boundary circle are covered"],
  constraintListUz: ["1 ≤ n ≤ 1000", "1 ≤ R ≤ 10^4", "|x_i|, |y_i| ≤ 10^4", "barcha nuqtalar har xil", "chegaradagi aylanada yotgan nuqtalar qoplangan"],
  sampleInputs: ["4 1\n0 0\n1 1\n2 0\n5 5\n", "3 2\n0 0\n10 0\n0 10\n"],
  expect: ["3\n", "1\n"],
  sampleNotesUz: [
    "Markazi (1, 0) da bo‘lgan doira (0, 0), (1, 1) va (2, 0) nuqtalarni qoplaydi — uchalasi ham aynan chegarada yotadi. (5, 5) nuqta ular bilan birga qoplanmaydi.",
    "Har ikki nuqta orasidagi masofa 2R = 4 dan katta, shuning uchun doira faqat bitta nuqtani qoplay oladi.",
  ],
  sampleNotesEn: [
    "A disk centred at (1, 0) covers (0, 0), (1, 1) and (2, 0), all three lying exactly on its boundary. The point (5, 5) cannot be covered together with them.",
    "Every two points are more than 2R = 4 apart, so a disk can cover only one point.",
  ],
  testInputs: ["4 1\n0 0\n1 1\n2 0\n5 5\n", "3 2\n0 0\n10 0\n0 10\n", "1 5\n0 0\n", "2 1\n0 0\n2 0\n", "2 1\n0 0\n3 0\n", "2 1\n0 0\n1 1\n",
    "13 5\n3 4\n-3 4\n3 -4\n-3 -4\n4 3\n-4 3\n4 -3\n-4 -3\n5 0\n-5 0\n0 5\n0 -5\n100 100\n",
    "5 10000\n-10000 -10000\n10000 10000\n-10000 10000\n10000 -10000\n0 0\n",
    "6 1\n0 0\n1 0\n2 0\n3 0\n4 0\n5 0\n", "7 2\n0 0\n0 4\n4 0\n4 4\n2 2\n1 3\n3 1\n", "5 3\n0 0\n6 0\n3 3\n3 -3\n3 0\n",
    ...many(diskGen, 8, 51)],
  sol: diskSol(false),
  wrongNote: "Only trying centres at the given points misses disks whose best position lies between them; treating the boundary as outside (an open disk) loses the points that lie exactly on the circle, which here is where the optimum always has two of them.",
  wrong: [
    `int n;long long R;cin>>n>>R;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];int best=0;
for(int i=0;i<n;++i){int c=0;for(int j=0;j<n;++j){long long dx=x[j]-x[i],dy=y[j]-y[i];if(dx*dx+dy*dy<=R*R)++c;}best=max(best,c);}cout<<best<<"\\n";`,
    diskSol(true),
  ],
  gen: diskGen,
  brute: DISK_BRUTE,
  slow: [DISK_BRUTE],
  big: [
    { seed: 1, note: "1000 points in a 14000 × 14000 square with R = 10^4: every pair is within 2R, so the cubic search tries 10^6 centres against 1000 points each", code: `n = 1000
seen = set()
pts = []
while len(pts) < n:
    p = (r.int(-7000, 7000), r.int(-7000, 7000))
    if p in seen: continue
    seen.add(p); pts.append(p)
return str(n) + " 10000\\n" + "\\n".join(line(p) for p in pts)` },
    { seed: 2, note: "1000 points over the whole range with R = 3000", code: `n = 1000
seen = set()
pts = []
while len(pts) < n:
    p = (r.int(-10**4, 10**4), r.int(-10**4, 10**4))
    if p in seen: continue
    seen.add(p); pts.append(p)
return str(n) + " 3000\\n" + "\\n".join(line(p) for p in pts)` },
    { seed: 3, note: "1000 lattice points of a 32 × 32 grid with R = 7: many points exactly on optimal circles", code: `pts = [(x, y) for x in range(-16, 16) for y in range(-16, 16)][:1000]
r.shuffle(pts)
return str(len(pts)) + " 7\\n" + "\\n".join(line(p) for p in pts)` },
  ],
});

/* ------------------------------------------------------------------ 2200 */
const triGen = (r) => { const n = r.int(1, 9); const a = r.shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, n); return n + "\n" + line(a) + "\n"; };
const triSol = (degenerate, short) => `const long long MOD=998244353;
auto pw=[&](long long b,long long e){long long r=1;b%=MOD;while(e){if(e&1)r=r*b%MOD;b=b*b%MOD;e>>=1;}return r;};
auto ntt=[&](vector<long long>&a,bool inv){int n=a.size();for(int i=1,j=0;i<n;++i){int bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j)swap(a[i],a[j]);}
 for(int len=2;len<=n;len<<=1){long long w=pw(3,(MOD-1)/len);if(inv)w=pw(w,MOD-2);for(int i=0;i<n;i+=len){long long wn=1;for(int k=0;k<len/2;++k){long long u=a[i+k],v=a[i+k+len/2]*wn%MOD;a[i+k]=u+v<MOD?u+v:u+v-MOD;a[i+k+len/2]=u-v>=0?u-v:u-v+MOD;wn=wn*w%MOD;}}}
 if(inv){long long ni=pw(n,MOD-2);for(auto&x:a)x=x*ni%MOD;}};
int n;cin>>n;vector<int>a(n);int mx=0;for(auto&v:a){cin>>v;mx=max(mx,v);}
int sz=1;while(sz<${short ? "mx+1" : "2*mx+1"})sz<<=1;vector<long long>f(max(sz,mx+1),0);for(int v:a)f[v]=1;f.resize(sz);
ntt(f,false);for(auto&x:f)x=x*x%MOD;ntt(f,true);
vector<char>has(mx+1,0);for(int v:a)has[v]=1;
long long ans=0,Q=0,below=0;
for(int c=1;c<=mx;++c){long long P=c<sz?f[c]:0;if(c%2==0&&has[c/2])P-=1;P/=2;${degenerate ? "if(has[c]){ans+=below*(below-1)/2-Q;++below;}Q+=P;" : "Q+=P;if(has[c]){ans+=below*(below-1)/2-Q;++below;}"}}
cout<<ans<<"\\n";`;
P.push({
  id: "C633", judge: "adv-ntt-count-triangles", topic: "advanced-cp", rating: 2200,
  tag: "NTT", timeLimitMs: 2000,
  uz: "Uchburchak yasaydigan tayoqchalar",
  en: "Sticks that make a triangle",
  statementUz: "n ta tayoqcha bor, ularning uzunliklari a_1, …, a_n juft-jufti bilan har xil. Uchta har xil tayoqcha uchburchak yasaydi, agar ulardan eng uzuni qolgan ikkitasining uzunliklari yig‘indisidan qat’iy qisqa bo‘lsa; aynan teng bo‘lgan holat — buzilgan uchburchak — hisobga olinmaydi. Uchburchak yasaydigan uchta tayoqchani necha usulda tanlash mumkinligini sanang. Tayoqchalarni tanlash tartibi ahamiyatsiz.",
  statementEn: "There are n sticks, and their lengths a_1, …, a_n are pairwise distinct. Three different sticks make a triangle if the longest of the three is strictly shorter than the other two put together; the degenerate case where it is exactly equal does not count. Count the ways to choose three sticks that make a triangle. The order in which the three sticks are chosen does not matter.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_i.",
  inputEn: "The first line contains n. The second line contains the n numbers a_i.",
  outputUz: "Uchburchak yasaydigan uchliklar sonini chiqaring.",
  outputEn: "Print the number of triples that make a triangle.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 2 · 10^5", "all a_i are distinct", "the answer needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 2 · 10^5", "barcha a_i har xil", "javob 64 bitli turni talab qiladi"],
  sampleInputs: ["5\n2 3 4 5 9\n", "3\n1 2 3\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Mos uchliklar: (2, 3, 4), (2, 4, 5) va (3, 4, 5). (2, 3, 5) buzilgan: 2 + 3 = 5. 9 bilan hech qaysi juftlik ishlamaydi, chunki eng katta yig‘indi 4 + 5 = 9.",
    "1 + 2 = 3, shuning uchun yagona uchlik buzilgan uchburchak beradi.",
  ],
  sampleNotesEn: [
    "The good triples are (2, 3, 4), (2, 4, 5) and (3, 4, 5). (2, 3, 5) is degenerate: 2 + 3 = 5. No pair works with 9, since the largest sum is 4 + 5 = 9.",
    "1 + 2 = 3, so the only triple is a degenerate triangle.",
  ],
  testInputs: ["5\n2 3 4 5 9\n", "3\n1 2 3\n", "1\n7\n", "2\n1 200000\n", "3\n2 3 4\n", "5\n199996 199997 199998 199999 200000\n",
    "6\n1 100000 100001 150000 199999 200000\n", "8\n1 2 3 5 8 13 21 34\n", "7\n100 101 102 199 200 201 300\n", "4\n1 2 4 8\n",
    "6\n131072 131073 65536 65537 100000 200000\n", ...many(triGen, 8, 61)],
  sol: triSol(false, false),
  wrongNote: "Counting a pair whose sum equals the longest stick lets degenerate triangles in; a transform of length just above the largest length, rather than twice it, wraps the large pair sums onto small ones.",
  wrong: [triSol(true, false), triSol(false, true)],
  gen: triGen,
  brute: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long c=0;
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)for(int k=j+1;k<n;++k)if(a[i]+a[j]>a[k])++c;cout<<c<<"\\n";`,
  slow: [`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long c=0;
for(int k=2;k<n;++k){int i=0,j=k-1;while(i<j){if(a[i]+a[j]>a[k]){c+=j-i;--j;}else ++i;}}cout<<c<<"\\n";`],
  big: [
    { seed: 1, note: "10^5 distinct lengths drawn from 1..2·10^5: the sort-and-two-pointers count is quadratic", code: `a = r.perm(200000)[:100000]\nreturn "100000\\n" + line(a)` },
    { seed: 2, note: "the lengths 100001..200000, every triple a triangle: C(10^5, 3) needs 64 bits", code: `a = r.shuffle(list(range(100001, 200001)))\nreturn "100000\\n" + line(a)` },
    { seed: 3, note: "10^5 lengths from the top of the range, where pair sums run up to 4·10^5", code: `a = r.perm(110000, 90001)[:100000]\nreturn "100000\\n" + line(a)` },
  ],
});

export default P;
