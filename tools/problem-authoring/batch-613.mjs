/* Batch 613 — the last eight, C613–C620, from 2000 to 2400; the bank reaches
 * 620.
 *
 * Every task is a well-known contest problem restated for AlgoYo'l in our own
 * words, with our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C613", judge: "ds-salary-range-with-updates", topic: "data-structures", rating: 2000,
  tag: "Fenwick tree, offline", timeLimitMs: 2000,
  uz: "Maosh so‘rovlari",
  en: "Salary queries",
  statementUz: "Kompaniyada n ta xodim ishlaydi, i-xodimning maoshi p_i. q ta so‘rov keladi, ular ikki xil: «! k x» — k-xodimning maoshi x ga o‘zgaradi; «? a b» — maoshi a dan b gacha (ikkala chegara ham kiradi) bo‘lgan xodimlar sonini chiqaring. So‘rovlar berilgan tartibda bajariladi, va har bir «?» so‘rovi shu paytdagi maoshlarga qaraydi.",
  statementEn: "A company has n employees, and employee i earns p_i. q queries come, of two kinds: \"! k x\" — employee k's salary becomes x; \"? a b\" — print how many employees earn between a and b, both included. Queries are processed in the given order, and every \"?\" query looks at the salaries as they are at that moment.",
  inputUz: "Birinchi qatorda n va q beriladi. Ikkinchi qatorda n ta son p_i. Keyingi q ta qatorning har birida bitta so‘rov.",
  inputEn: "The first line contains n and q. The second line contains the n numbers p_i. Each of the next q lines contains one query.",
  outputUz: "Har bir «?» so‘rovi uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each \"?\" query print the answer on its own line.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ p_i, x, a, b ≤ 10^9", "a ≤ b", "1 ≤ k ≤ n"],
  constraintListUz: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ p_i, x, a, b ≤ 10^9", "a ≤ b", "1 ≤ k ≤ n"],
  sampleInputs: ["5 3\n3 7 2 2 5\n? 2 3\n! 3 6\n? 2 5\n"],
  expect: ["3\n3\n"],
  sampleNotesUz: [
    "Avval 2 dan 3 gacha 3, 2, 2 maoshlar — 3 kishi. 3-xodim maoshi 6 bo‘lgach, 2 dan 5 gacha 3, 2 va 5.",
  ],
  sampleNotesEn: [
    "At first the salaries 3, 2, 2 lie between 2 and 3 — three people. After employee 3 moves to 6, the salaries from 2 to 5 are 3, 2 and 5.",
  ],
  testInputs: ["5 3\n3 7 2 2 5\n? 2 3\n! 3 6\n? 2 5\n", "1 3\n5\n? 5 5\n! 1 6\n? 5 5\n", "3 4\n1 1000000000 500\n? 1 1000000000\n! 2 1\n? 1 1\n? 2 499\n", "4 5\n2 2 2 2\n! 1 3\n! 1 4\n? 3 3\n? 4 4\n? 2 2\n"],
  sol: `int n,q;cin>>n>>q;vector<long long>p(n);for(auto&x:p)cin>>x;vector<char>tp(q);vector<long long>A(q),Bv(q);vector<long long>vals(p.begin(),p.end());
for(int i=0;i<q;++i){cin>>tp[i]>>A[i]>>Bv[i];if(tp[i]=='!')vals.push_back(Bv[i]);}
sort(vals.begin(),vals.end());vals.erase(unique(vals.begin(),vals.end()),vals.end());int V=vals.size();vector<int>f(V+1,0);
auto add=[&](long long v,int d){int i=lower_bound(vals.begin(),vals.end(),v)-vals.begin()+1;for(;i<=V;i+=i&-i)f[i]+=d;};
auto sum=[&](int i){int s=0;for(;i>0;i-=i&-i)s+=f[i];return s;};
for(auto x:p)add(x,1);
for(int i=0;i<q;++i){if(tp[i]=='!'){add(p[A[i]-1],-1);p[A[i]-1]=Bv[i];add(Bv[i],1);}else{int hi=upper_bound(vals.begin(),vals.end(),Bv[i])-vals.begin();int lo=lower_bound(vals.begin(),vals.end(),A[i])-vals.begin();cout<<sum(hi)-sum(lo)<<"\\n";}}`,
  wrongNote: "Adding the new salary without taking away the old one counts a person twice; leaving out salaries equal to b ignores the closed upper end.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>p(n);for(auto&x:p)cin>>x;multiset<long long>s(p.begin(),p.end());
for(int i=0;i<q;++i){char c;long long a,b;cin>>c>>a>>b;if(c=='!'){p[a-1]=b;s.insert(b);}else{cout<<distance(s.lower_bound(a),s.upper_bound(b))<<"\\n";}}`,
    `int n,q;cin>>n>>q;vector<long long>p(n);for(auto&x:p)cin>>x;multiset<long long>s(p.begin(),p.end());
for(int i=0;i<q;++i){char c;long long a,b;cin>>c>>a>>b;if(c=='!'){s.erase(s.find(p[a-1]));p[a-1]=b;s.insert(b);}else{cout<<distance(s.lower_bound(a),s.lower_bound(b))<<"\\n";}}`,
  ],
  gen: (r) => { const n = r.int(1, 6), q = r.int(1, 6); let s = line([n, q]) + "\n" + line(r.ints(n, 1, 9)) + "\n"; for (let i = 0; i < q; i++) { if (r.int(0, 1)) s += "! " + line([r.int(1, n), r.int(1, 9)]) + "\n"; else { const a = r.int(1, 9); s += "? " + line([a, r.int(a, 9)]) + "\n"; } } return s; },
  slow: [`int n,q;cin>>n>>q;vector<long long>p(n);for(auto&x:p)cin>>x;
for(int i=0;i<q;++i){char c;long long a,b;cin>>c>>a>>b;if(c=='!')p[a-1]=b;else{int k=0;for(auto x:p)if(x>=a&&x<=b)++k;cout<<k<<"\\n";}}`],
  big: [
    { seed: 1, note: "half updates, half wide counts", code: `n = q = 120000\nqs = []\nfor i in range(q):\n    if i % 2:\n        qs.append("! " + line([r.int(1, n), r.int(1, 10**9)]))\n    else:\n        a = r.int(1, 10**8)\n        qs.append("? " + line([a, r.int(9 * 10**8, 10**9)]))\nreturn line([n, q]) + "\\n" + line(r.ints(n, 1, 10**9)) + "\\n" + "\\n".join(qs)` },
  ],
});

P.push({
  id: "C614", judge: "dp-increasing-heights-max-beauty", topic: "dynamic-programming", rating: 2000,
  tag: "DP with a Fenwick tree", timeLimitMs: 1000,
  uz: "Gullar qatori",
  en: "A row of flowers",
  statementUz: "Qatorda n ta gul o‘sadi: i-gulning balandligi h_i, go‘zalligi a_i, va barcha balandliklar turli (1 dan n gacha sonlarning almashtirishi). Ba'zi gullarni olib tashlab, qolganlari chapdan o‘ngga qat'iy o‘sib boruvchi balandlikda bo‘lishi kerak. Qolgan gullar go‘zalliklari yig‘indisining eng katta qiymatini toping. Gullarning o‘rni o‘zgartirilmaydi.",
  statementEn: "n flowers grow in a row: flower i has height h_i and beauty a_i, and all the heights are distinct (a permutation of 1 to n). Some flowers are removed so that the heights of the remaining ones strictly increase from left to right. Find the largest possible total beauty of the remaining flowers. The flowers are never moved.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta balandlik h_i, uchinchi qatorda n ta go‘zallik a_i keladi.",
  inputEn: "The first line contains n. The second line contains the n heights h_i and the third the n beauties a_i.",
  outputUz: "Yagona butun sonni chiqaring — eng katta go‘zallik yig‘indisi.",
  outputEn: "Print a single integer — the largest total beauty.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "h is a permutation of 1 to n", "1 ≤ a_i ≤ 10^9", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "h — 1 dan n gacha sonlarning almashtirishi", "1 ≤ a_i ≤ 10^9", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["5\n2 5 1 3 4\n3 10 2 4 5\n", "1\n1\n7\n"],
  expect: ["13\n", "7\n"],
  sampleNotesUz: [
    "Balandligi 2 va 5 bo‘lgan gullar: 3 + 10 = 13. 2, 3, 4 balandliklilar faqat 12 beradi.",
    "Yagona gul qoladi.",
  ],
  sampleNotesEn: [
    "The flowers of heights 2 and 5 give 3 + 10 = 13. Heights 2, 3, 4 give only 12.",
    "The single flower stays.",
  ],
  testInputs: ["5\n2 5 1 3 4\n3 10 2 4 5\n", "1\n1\n7\n", "3\n1 2 3\n1000000000 1000000000 1000000000\n", "4\n4 3 2 1\n1 5 2 3\n", "4\n3 1 4 2\n10 20 30 40\n", "6\n1 6 2 5 3 4\n9 1 1 1 1 8\n"],
  sol: `int n;cin>>n;vector<int>h(n);for(auto&x:h)cin>>x;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>f(n+1,0);long long best=0;
for(int i=0;i<n;++i){long long m=0;for(int j=h[i]-1;j>0;j-=j&-j)m=max(m,f[j]);long long v=m+a[i];best=max(best,v);for(int j=h[i];j<=n;j+=j&-j)f[j]=max(f[j],v);}
cout<<best<<"\\n";`,
  wrongNote: "Keeping the sum in an int overflows once three flowers of 10^9 stand in order; taking the best earlier flower regardless of height lets the heights go down.",
  wrong: [
    `int n;cin>>n;vector<int>h(n);for(auto&x:h)cin>>x;vector<int>a(n);for(auto&x:a)cin>>x;vector<int>f(n+1,0);int best=0;
for(int i=0;i<n;++i){int m=0;for(int j=h[i]-1;j>0;j-=j&-j)m=max(m,f[j]);int v=m+a[i];best=max(best,v);for(int j=h[i];j<=n;j+=j&-j)f[j]=max(f[j],v);}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<int>h(n);for(auto&x:h)cin>>x;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0;for(auto x:a)s+=x;cout<<s<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 8); return n + "\n" + line(r.perm(n)) + "\n" + line(r.ints(n, 1, 9)) + "\n"; },
  slow: [`int n;cin>>n;vector<int>h(n);for(auto&x:h)cin>>x;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>d(n);long long best=0;
for(int i=0;i<n;++i){d[i]=a[i];for(int j=0;j<i;++j)if(h[j]<h[i])d[i]=max(d[i],d[j]+a[i]);best=max(best,d[i]);}cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "a random permutation of 2·10^5 heights", code: `n = 200000\nreturn str(n) + "\\n" + line(r.perm(n)) + "\\n" + line(r.ints(n, 1, 10**9))` },
    { seed: 2, note: "increasing heights: the answer is the whole sum", code: `n = 200000\nreturn str(n) + "\\n" + line(range(1, n + 1)) + "\\n" + line([10**9] * n)` },
  ],
});

P.push({
  id: "C615", judge: "graph-longest-path-or-infinite", topic: "graphs", rating: 2000,
  tag: "Bellman–Ford", timeLimitMs: 2000,
  uz: "Eng ko‘p ochko",
  en: "The highest score",
  statementUz: "O‘yinda n ta xona va m ta bir tomonlama yo‘lak bor; har bir yo‘lakdan o‘tganda uning x qiymati ochkoga qo‘shiladi (x manfiy ham bo‘lishi mumkin). Siz 1-xonadan boshlab n-xonada tugatasiz; yo‘laklardan va xonalardan istalgancha marta o‘tish mumkin. Eng ko‘p necha ochko to‘plash mumkin? Agar ochkoni istalgancha katta qilish mumkin bo‘lsa, -1 chiqaring. 1-xonadan n-xonaga kamida bitta yo‘l bor.",
  statementEn: "A game has n rooms and m one-way tunnels; going through a tunnel adds its value x to your score (x may be negative). You start in room 1 and finish in room n, and you may pass through tunnels and rooms any number of times. What is the highest score you can collect? If the score can be made as large as you like, print -1. There is at least one route from room 1 to room n.",
  inputUz: "Birinchi qatorda n va m beriladi. Keyingi m ta qatorning har birida a, b va x keladi — a-xonadan b-xonaga x qiymatli yo‘lak.",
  inputEn: "The first line contains n and m. Each of the next m lines contains a, b and x — a tunnel from room a to room b with value x.",
  outputUz: "Yagona butun sonni chiqaring — eng ko‘p ochko yoki -1.",
  outputEn: "Print a single integer — the highest score, or -1.",
  constraintList: ["1 ≤ n ≤ 2500", "1 ≤ m ≤ 5000", "−10^9 ≤ x ≤ 10^9", "a tunnel may lead from a room back to itself"],
  constraintListUz: ["1 ≤ n ≤ 2500", "1 ≤ m ≤ 5000", "−10^9 ≤ x ≤ 10^9", "yo‘lak xonadan o‘ziga olib borishi mumkin"],
  sampleInputs: ["4 5\n1 2 3\n2 4 -1\n2 3 -2\n3 2 1\n1 4 1\n", "3 3\n1 2 1\n2 2 5\n2 3 1\n", "4 4\n1 2 1\n2 3 1\n3 2 1\n1 4 7\n"],
  expect: ["2\n", "-1\n", "7\n"],
  sampleNotesUz: [
    "1 → 2 → 4 yo‘li 2 ochko beradi; 2 → 3 → 2 aylanasi ochkoni kamaytiradi.",
    "2-xonadagi aylana har safar 5 qo‘shadi va undan 3-xonaga chiqish mumkin.",
    "2 ↔ 3 aylanasi foydali, lekin undan 4-xonaga yo‘l yo‘q.",
  ],
  sampleNotesEn: [
    "The route 1 → 2 → 4 scores 2; the loop 2 → 3 → 2 only lowers the score.",
    "The loop at room 2 adds 5 every time, and room 3 can be reached from it.",
    "The loop 2 ↔ 3 is profitable, but it does not lead to room 4.",
  ],
  testInputs: ["4 5\n1 2 3\n2 4 -1\n2 3 -2\n3 2 1\n1 4 1\n", "3 3\n1 2 1\n2 2 5\n2 3 1\n", "4 4\n1 2 1\n2 3 1\n3 2 1\n1 4 7\n", "1 1\n1 1 -3\n", "1 1\n1 1 3\n", "2 1\n1 2 -1000000000\n", "5 6\n1 2 1000000000\n2 3 1000000000\n3 4 1000000000\n4 5 1000000000\n5 3 -2000000000\n1 5 0\n"],
  sol: `int n,m;cin>>n>>m;vector<int>A(m),Bv(m);vector<long long>X(m);vector<vector<int>>g(n+1),rg(n+1);for(int i=0;i<m;++i){cin>>A[i]>>Bv[i]>>X[i];g[A[i]].push_back(Bv[i]);rg[Bv[i]].push_back(A[i]);}
auto reach=[&](int s,vector<vector<int>>&G){vector<char>v(n+1,0);vector<int>st={s};v[s]=1;while(!st.empty()){int u=st.back();st.pop_back();for(int w:G[u])if(!v[w]){v[w]=1;st.push_back(w);}}return v;};
vector<char>f=reach(1,g),b=reach(n,rg);vector<int>E;for(int i=0;i<m;++i)if(f[A[i]]&&b[A[i]]&&f[Bv[i]]&&b[Bv[i]])E.push_back(i);
const long long NEG=LLONG_MIN/4;vector<long long>d(n+1,NEG);d[1]=0;
for(int it=0;it<n-1;++it){bool ch=false;for(int i:E)if(d[A[i]]>NEG&&d[A[i]]+X[i]>d[Bv[i]]){d[Bv[i]]=d[A[i]]+X[i];ch=true;}if(!ch)break;}
bool inf=false;for(int i:E)if(d[A[i]]>NEG&&d[A[i]]+X[i]>d[Bv[i]])inf=true;
cout<<(inf?-1:d[n])<<"\\n";`,
  wrongNote: "Calling every profitable loop infinite forgets that the loop must lead on to room n; stopping after n − 1 rounds never notices a loop at all.",
  wrong: [
    `int n,m;cin>>n>>m;vector<array<long long,3>>e(m);for(auto&x:e)cin>>x[0]>>x[1]>>x[2];const long long NEG=LLONG_MIN/4;vector<long long>d(n+1,NEG);d[1]=0;
for(int it=0;it<n-1;++it)for(auto&x:e)if(d[x[0]]>NEG&&d[x[0]]+x[2]>d[x[1]])d[x[1]]=d[x[0]]+x[2];
bool inf=false;for(auto&x:e)if(d[x[0]]>NEG&&d[x[0]]+x[2]>d[x[1]])inf=true;cout<<(inf?-1:d[n])<<"\\n";`,
    `int n,m;cin>>n>>m;vector<array<long long,3>>e(m);for(auto&x:e)cin>>x[0]>>x[1]>>x[2];const long long NEG=LLONG_MIN/4;vector<long long>d(n+1,NEG);d[1]=0;
for(int it=0;it<n-1;++it)for(auto&x:e)if(d[x[0]]>NEG&&d[x[0]]+x[2]>d[x[1]])d[x[1]]=d[x[0]]+x[2];
cout<<d[n]<<"\\n";`,
  ],
  gen: (r) => { for (;;) { const n = r.int(1, 5), m = r.int(1, 7); const e = []; for (let i = 0; i < m; i++) e.push([r.int(1, n), r.int(1, n), r.int(-5, 5)]); const reach = new Set([1]); let ch = true; while (ch) { ch = false; for (const [a, b] of e) if (reach.has(a) && !reach.has(b)) { reach.add(b); ch = true; } } if (reach.has(n)) return line([n, m]) + "\n" + e.map((x) => line(x) + "\n").join(""); } },
  brute: `int n,m;cin>>n>>m;vector<array<long long,3>>e(m);for(auto&x:e)cin>>x[0]>>x[1]>>x[2];const long long NEG=LLONG_MIN/4;
auto bestUpTo=[&](int L){vector<long long>d(n+1,NEG);d[1]=0;long long best=(n==1)?0:NEG;for(int s=0;s<L;++s){vector<long long>e2=d;for(auto&x:e)if(d[x[0]]>NEG)e2[x[1]]=max(e2[x[1]],d[x[0]]+x[2]);d=e2;best=max(best,d[n]);}return best;};
long long a=bestUpTo(4*n+4),b=bestUpTo(8*n+8);cout<<(b>a?-1:a)<<"\\n";`,
  big: [
    { seed: 1, note: "n = 2500, m = 5000, negative weights only: n · m relaxations", code: `n, m = 2500, 5000\ne = [line([i, i + 1, -r.int(1, 10**9)]) for i in range(1, n)]\nwhile len(e) < m:\n    a = r.int(1, n)\n    b = r.int(1, n)\n    e.append(line([a, b, -r.int(1, 10**9)]))\nreturn line([n, m]) + "\\n" + "\\n".join(e)` },
    { seed: 2, note: "a profitable loop far away from the exit", code: `n, m = 2500, 5000\ne = [line([i, i + 1, r.int(-10**9, 10**9)]) for i in range(1, n)]\ne.append(line([2, 2, 5]))\nwhile len(e) < m:\n    a = r.int(1, n)\n    b = r.int(a, n)\n    e.append(line([a, b, r.int(-10**9, 10**9)]))\nreturn line([n, m]) + "\\n" + "\\n".join(e)` },
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C616", judge: "dp-two-wide-towers", topic: "dynamic-programming", rating: 2100,
  tag: "Counting DP", timeLimitMs: 1000,
  uz: "Ikki ustunli minoralar",
  en: "Towers two cells wide",
  statementUz: "Kengligi 2, balandligi n bo‘lgan minorani butun tomonli to‘g‘ri to‘rtburchak bloklardan qurish kerak: bloklar ustma-ust tushmaydi, minorani to‘liq qoplaydi va tomonlari minora tomonlariga parallel. Boshqacha aytganda, 2 × n to‘g‘ri to‘rtburchakni butun tomonli to‘g‘ri to‘rtburchaklarga bo‘lish usullarini sanaymiz. Ikki usul bo‘linishi farq qilsa, turlicha hisoblanadi. Javobni 10^9 + 7 ga bo‘lgandagi qoldiqni chiqaring.",
  statementEn: "A tower 2 cells wide and n cells high is to be built from rectangular blocks with integer sides: the blocks do not overlap, cover the tower completely and have their sides parallel to the tower's. In other words, count the ways to cut a 2 × n rectangle into rectangles with integer sides. Two ways are different if the cuts differ. Print the answer modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Keyingi t ta qatorning har birida bitta n soni keladi.",
  inputEn: "The first line contains the number of tests t. Each of the next t lines contains one number n.",
  outputUz: "Har bir test uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each test print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 100", "1 ≤ n ≤ 10^6", "blocks have integer sides", "print the count modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ t ≤ 100", "1 ≤ n ≤ 10^6", "bloklar tomonlari butun", "sonni 10^9 + 7 bo‘yicha chiqaring"],
  sampleInputs: ["3\n1\n2\n3\n"],
  expect: ["2\n8\n34\n"],
  sampleNotesUz: [
    "n = 1 da: bitta 2 × 1 blok yoki ikkita 1 × 1 blok. n = 2 da 8 usul bor, n = 3 da 34.",
  ],
  sampleNotesEn: [
    "For n = 1: one 2 × 1 block or two 1 × 1 blocks. For n = 2 there are 8 ways, and for n = 3 there are 34.",
  ],
  testInputs: ["3\n1\n2\n3\n", "1\n6\n", "1\n1000000\n", "4\n10\n100\n999999\n12345\n"],
  sol: `const long long M=1000000007;const int N=1000000;vector<long long>a(N+1),b(N+1);a[1]=b[1]=1;
for(int i=1;i<N;++i){a[i+1]=(4*a[i]+b[i])%M;b[i+1]=(a[i]+2*b[i])%M;}
int t;cin>>t;while(t--){int n;cin>>n;cout<<(a[n]+b[n])%M<<"\\n";}`,
  wrongNote: "Letting a wide block only stop rather than also grow upwards undercounts the towers whose top block spans both columns; letting a split row only start new blocks forgets the ways each column can continue.",
  wrong: [
    `const long long M=1000000007;const int N=1000000;vector<long long>a(N+1),b(N+1);a[1]=b[1]=1;
for(int i=1;i<N;++i){a[i+1]=(4*a[i]+b[i])%M;b[i+1]=(a[i]+b[i])%M;}
int t;cin>>t;while(t--){int n;cin>>n;cout<<(a[n]+b[n])%M<<"\\n";}`,
    `const long long M=1000000007;const int N=1000000;vector<long long>a(N+1),b(N+1);a[1]=b[1]=1;
for(int i=1;i<N;++i){a[i+1]=(2*a[i]+b[i])%M;b[i+1]=(a[i]+2*b[i])%M;}
int t;cin>>t;while(t--){int n;cin>>n;cout<<(a[n]+b[n])%M<<"\\n";}`,
  ],
  gen: (r) => { const t = r.int(1, 3); return t + "\n" + r.ints(t, 1, 6).join("\n") + "\n"; },
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<vector<int>>g(n,vector<int>(2,0));long long c=0;
function<void()>go=[&](){int r=-1,col=-1;for(int i=0;i<n&&r<0;++i)for(int j=0;j<2;++j)if(!g[i][j]){r=i;col=j;break;}if(r<0){++c;return;}
 for(int h=1;r+h<=n;++h)for(int w=1;col+w<=2;++w){bool ok=true;for(int i=r;i<r+h&&ok;++i)for(int j=col;j<col+w;++j)if(g[i][j])ok=false;if(!ok)continue;
  for(int i=r;i<r+h;++i)for(int j=col;j<col+w;++j)g[i][j]=1;go();for(int i=r;i<r+h;++i)for(int j=col;j<col+w;++j)g[i][j]=0;}};
go();cout<<c<<"\\n";}`,
  big: [
    { seed: 1, note: "100 tests near the maximum", code: `return "100\\n" + "\\n".join(str(r.int(900000, 1000000)) for _ in range(100))` },
  ],
});

P.push({
  id: "C617", judge: "ds-max-prefix-sum-with-updates", topic: "data-structures", rating: 2100,
  tag: "Segment tree", timeLimitMs: 1000,
  uz: "Eng katta prefiks yig‘indi",
  en: "The largest prefix sum",
  statementUz: "n ta butun sondan iborat massiv va q ta so‘rov berilgan. «1 k u» so‘rovi k-elementni u ga almashtiradi. «2 a b» so‘rovi a-dan b-o‘ringacha bo‘lgan bo‘lakning eng katta prefiks yig‘indisini so‘raydi: a_a, a_a + a_{a+1}, …, a_a + … + a_b yig‘indilari va bo‘sh prefiks (0) ichida eng kattasi. So‘rovlar berilgan tartibda bajariladi.",
  statementEn: "You are given an array of n integers and q queries. The query \"1 k u\" sets the k-th element to u. The query \"2 a b\" asks for the largest prefix sum of the segment from position a to position b: the largest of the sums a_a, a_a + a_{a+1}, …, a_a + … + a_b and of the empty prefix, 0. Queries are processed in the given order.",
  inputUz: "Birinchi qatorda n va q beriladi. Ikkinchi qatorda n ta son. Keyingi q ta qatorning har birida bitta so‘rov.",
  inputEn: "The first line contains n and q. The second line contains the n numbers. Each of the next q lines contains one query.",
  outputUz: "Har bir 2-turdagi so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query of type 2 print the answer on its own line.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "−10^9 ≤ a_i, u ≤ 10^9", "1 ≤ k ≤ n, 1 ≤ a ≤ b ≤ n", "the empty prefix counts, so the answer is never negative"],
  constraintListUz: ["1 ≤ n, q ≤ 2·10^5", "−10^9 ≤ a_i, u ≤ 10^9", "1 ≤ k ≤ n, 1 ≤ a ≤ b ≤ n", "bo‘sh prefiks ham hisoblanadi, shuning uchun javob manfiy bo‘lmaydi"],
  sampleInputs: ["6 4\n2 -1 3 -5 4 1\n2 1 6\n2 4 4\n1 4 0\n2 1 6\n"],
  expect: ["4\n0\n9\n"],
  sampleNotesUz: [
    "Prefikslar 2, 1, 4, −1, 3, 4 — eng kattasi 4. [4, 4] bo‘lagida yagona −5, bo‘sh prefiks 0 yaxshiroq. 4-element 0 bo‘lgach, prefikslar 2, 1, 4, 4, 8, 9.",
  ],
  sampleNotesEn: [
    "The prefix sums are 2, 1, 4, −1, 3, 4, and the largest is 4. The segment [4, 4] holds only −5, so the empty prefix's 0 is better. With the 4th element set to 0 the prefix sums are 2, 1, 4, 4, 8, 9.",
  ],
  testInputs: ["6 4\n2 -1 3 -5 4 1\n2 1 6\n2 4 4\n1 4 0\n2 1 6\n", "1 2\n-5\n2 1 1\n1 1 5\n", "3 3\n1000000000 1000000000 1000000000\n2 1 3\n1 2 -1000000000\n2 2 3\n", "5 4\n-1 -2 3 -4 5\n2 1 5\n2 3 4\n1 1 10\n2 1 2\n"],
  sol: `int n,q;cin>>n>>q;int sz=1;while(sz<n)sz<<=1;vector<long long>S(2*sz,0),B(2*sz,0);
auto pull=[&](int v){S[v]=S[2*v]+S[2*v+1];B[v]=max(B[2*v],S[2*v]+B[2*v+1]);};
for(int i=0;i<n;++i){long long x;cin>>x;S[sz+i]=x;B[sz+i]=max(0LL,x);}for(int v=sz-1;v>0;--v)pull(v);
while(q--){int tp;cin>>tp;if(tp==1){int k;long long u;cin>>k>>u;int v=sz+k-1;S[v]=u;B[v]=max(0LL,u);for(v>>=1;v;v>>=1)pull(v);}
 else{int a,b;cin>>a>>b;long long ls=0,lb=0;vector<int>right;int l=a-1+sz,r=b-1+sz+1;
  while(l<r){if(l&1){lb=max(lb,ls+B[l]);ls+=S[l];++l;}if(r&1){--r;right.push_back(r);}l>>=1;r>>=1;}
  for(int i=(int)right.size()-1;i>=0;--i){int v=right[i];lb=max(lb,ls+B[v]);ls+=S[v];}cout<<lb<<"\\n";}}`,
  wrongNote: "Leaving out the empty prefix reports a negative number for a segment that starts with a loss; never applying the updates answers from the original array.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int tp;cin>>tp;if(tp==1){int k;long long u;cin>>k>>u;a[k-1]=u;}else{int l,r;cin>>l>>r;long long s=0,b=LLONG_MIN;for(int i=l-1;i<r;++i){s+=a[i];b=max(b,s);}cout<<b<<"\\n";}}`,
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int tp;cin>>tp;if(tp==1){int k;long long u;cin>>k>>u;}else{int l,r;cin>>l>>r;long long s=0,b=0;for(int i=l-1;i<r;++i){s+=a[i];b=max(b,s);}cout<<b<<"\\n";}}`,
  ],
  gen: (r) => { const n = r.int(1, 7), q = r.int(1, 6); let s = line([n, q]) + "\n" + line(r.ints(n, -5, 5)) + "\n"; for (let i = 0; i < q; i++) { if (r.int(0, 2) === 0) s += line([1, r.int(1, n), r.int(-5, 5)]) + "\n"; else { const a = r.int(1, n); s += line([2, a, r.int(a, n)]) + "\n"; } } return s; },
  slow: [`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int tp;cin>>tp;if(tp==1){int k;long long u;cin>>k>>u;a[k-1]=u;}else{int l,r;cin>>l>>r;long long s=0,b=0;for(int i=l-1;i<r;++i){s+=a[i];b=max(b,s);}cout<<b<<"\\n";}}`],
  big: [
    { seed: 1, note: "wide queries mixed with updates", code: `n, q = 200000, 60000\nqs = []\nfor i in range(q):\n    if i % 3 == 0:\n        qs.append(line([1, r.int(1, n), r.int(-10**9, 10**9)]))\n    else:\n        qs.append(line([2, r.int(1, 100), r.int(n - 100, n)]))\nreturn line([n, q]) + "\\n" + line(r.ints(n, -10**9, 10**9)) + "\\n" + "\\n".join(qs)` },
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C618", judge: "dp-permutations-by-signs", topic: "dynamic-programming", rating: 2200,
  tag: "Prefix-sum DP", timeLimitMs: 1000,
  uz: "Belgilar bo‘yicha almashtirishlar",
  en: "Permutations that follow the signs",
  statementUz: "Sizga n − 1 uzunlikdagi, '<' va '>' belgilaridan iborat s qatori berilgan. 1 dan n gacha sonlarning shunday p almashtirishlari sonini toping: har bir i uchun s_i = '<' bo‘lsa p_i < p_{i+1}, s_i = '>' bo‘lsa p_i > p_{i+1}. Masalan, s = <> uchun 1 3 2 va 2 3 1 mos keladi. Javobni 10^9 + 7 ga bo‘lgandagi qoldiqni chiqaring.",
  statementEn: "You are given a string s of length n − 1 made of the characters '<' and '>'. Count the permutations p of the numbers 1 to n such that for every i, p_i < p_{i+1} when s_i is '<' and p_i > p_{i+1} when s_i is '>'. For example, for s = <> the permutations 1 3 2 and 2 3 1 qualify. Print the answer modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda s qatori keladi.",
  inputEn: "The first line contains n. The second line contains the string s.",
  outputUz: "Yagona butun sonni chiqaring — almashtirishlar soni modulo 10^9 + 7.",
  outputEn: "Print a single integer — the number of permutations modulo 10^9 + 7.",
  constraintList: ["2 ≤ n ≤ 3000", "s has length n − 1", "s consists of '<' and '>'", "print the count modulo 10^9 + 7"],
  constraintListUz: ["2 ≤ n ≤ 3000", "s ning uzunligi n − 1", "s faqat '<' va '>' belgilaridan iborat", "sonni 10^9 + 7 bo‘yicha chiqaring"],
  sampleInputs: ["3\n<>\n", "4\n<><\n", "5\n<<<<\n"],
  expect: ["2\n", "5\n", "1\n"],
  sampleNotesUz: [
    "1 3 2 va 2 3 1.",
    "1 3 2 4, 1 4 2 3, 2 3 1 4, 2 4 1 3, 3 4 1 2.",
    "Faqat 1 2 3 4 5.",
  ],
  sampleNotesEn: [
    "1 3 2 and 2 3 1.",
    "1 3 2 4, 1 4 2 3, 2 3 1 4, 2 4 1 3 and 3 4 1 2.",
    "Only 1 2 3 4 5.",
  ],
  testInputs: ["3\n<>\n", "4\n<><\n", "5\n<<<<\n", "2\n>\n", "8\n><><><>\n", "20\n<<>><<>><<>><<>><<>\n", "3000\n" + "<>".repeat(1499) + "<\n"],
  sol: `const int M=1000000007;int n;string s;cin>>n>>s;vector<int>d(n+2,0),nd(n+2,0),p(n+2,0);d[1]=1;
for(int i=1;i<n;++i){p[0]=0;for(int j=1;j<=i;++j){int v=p[j-1]+d[j];if(v>=M)v-=M;p[j]=v;}bool lt=s[i-1]=='<';
 for(int j=1;j<=i+1;++j){int v=lt?p[j-1]:p[i]-p[j-1];if(v<0)v+=M;nd[j]=v;}swap(d,nd);}
long long ans=0;for(int j=1;j<=n;++j)ans+=d[j];cout<<ans%M<<"\\n";`,
  wrongNote: "Shifting the prefix range by one place counts the new element as equal to the old one; dropping the last sign counts permutations that ignore the final comparison.",
  wrong: [
    `const long long M=1000000007;int n;string s;cin>>n>>s;vector<long long>d(n+1,0),nd(n+1);d[1]=1;
for(int i=1;i<n;++i){vector<long long>p(i+2,0);for(int j=1;j<=i;++j)p[j]=(p[j-1]+d[j])%M;
 for(int j=1;j<=i+1;++j)nd[j]=(s[i-1]=='<')?p[min(j,i)]:(p[i]-p[j-1]+M)%M;for(int j=1;j<=i+1;++j)d[j]=nd[j];}
long long ans=0;for(int j=1;j<=n;++j)ans=(ans+d[j])%M;cout<<ans<<"\\n";`,
    `const long long M=1000000007;int n;string s;cin>>n>>s;n--;vector<long long>d(n+1,0),nd(n+1);d[1]=1;
for(int i=1;i<n;++i){vector<long long>p(i+2,0);for(int j=1;j<=i;++j)p[j]=(p[j-1]+d[j])%M;
 for(int j=1;j<=i+1;++j)nd[j]=(s[i-1]=='<')?p[j-1]:(p[i]-p[j-1]+M)%M;for(int j=1;j<=i+1;++j)d[j]=nd[j];}
long long ans=0;for(int j=1;j<=n;++j)ans=(ans+d[j])%M;cout<<ans<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(2, 8); return n + "\n" + r.str(n - 1, "<>") + "\n"; },
  brute: `int n;string s;cin>>n>>s;vector<int>p(n);iota(p.begin(),p.end(),1);long long c=0;
do{bool ok=true;for(int i=0;i+1<n&&ok;++i)if((s[i]=='<')!=(p[i]<p[i+1]))ok=false;c+=ok;}while(next_permutation(p.begin(),p.end()));cout<<c<<"\\n";`,
  slow: [`const long long M=1000000007;int n;string s;cin>>n>>s;vector<long long>d(n+1,0),nd(n+1);d[1]=1;
for(int i=1;i<n;++i){for(int j=1;j<=i+1;++j){long long v=0;if(s[i-1]=='<'){for(int k=1;k<j;++k)v+=d[k];}else{for(int k=j;k<=i;++k)v+=d[k];}nd[j]=v%M;}for(int j=1;j<=i+1;++j)d[j]=nd[j];}
long long ans=0;for(int j=1;j<=n;++j)ans=(ans+d[j])%M;cout<<ans<<"\\n";`],
  big: [
    { seed: 1, note: "n = 3000, random signs: a cubic DP is too slow", code: `n = 3000\nreturn str(n) + "\\n" + text(r, n - 1, "<>")` },
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C619", judge: "str-palindrome-queries-updates", topic: "strings", rating: 2300,
  tag: "Hashing with a Fenwick tree", timeLimitMs: 2000,
  uz: "Palindrom so‘rovlari",
  en: "Palindrome queries",
  statementUz: "n uzunlikdagi, kichik lotin harflaridan iborat s qatori va q ta so‘rov berilgan. «1 k x» so‘rovi s ning k-harfini x harfiga almashtiradi. «2 a b» so‘rovi a-dan b-harfgacha bo‘lgan bo‘lak palindrommi — chapdan ham, o‘ngdan ham bir xil o‘qiladimi — shuni so‘raydi. So‘rovlar berilgan tartibda bajariladi.",
  statementEn: "You are given a string s of n lowercase Latin letters and q queries. The query \"1 k x\" changes the k-th letter of s to the letter x. The query \"2 a b\" asks whether the piece from the a-th to the b-th letter is a palindrome — whether it reads the same from left to right and from right to left. Queries are processed in the given order.",
  inputUz: "Birinchi qatorda n va q beriladi. Ikkinchi qatorda s qatori. Keyingi q ta qatorning har birida bitta so‘rov.",
  inputEn: "The first line contains n and q. The second line contains the string s. Each of the next q lines contains one query.",
  outputUz: "Har bir 2-turdagi so‘rov uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each query of type 2 print YES or NO on its own line.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ k ≤ n, 1 ≤ a ≤ b ≤ n", "x is a lowercase Latin letter", "a single letter is a palindrome"],
  constraintListUz: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ k ≤ n, 1 ≤ a ≤ b ≤ n", "x — kichik lotin harfi", "bitta harf palindrom hisoblanadi"],
  sampleInputs: ["7 4\nabacaba\n2 1 7\n2 2 4\n1 4 b\n2 3 5\n"],
  expect: ["YES\nNO\nYES\n"],
  sampleNotesUz: [
    "abacaba palindrom. bac — yo‘q. 4-harf b bo‘lgach, 3–5 harflar aba.",
  ],
  sampleNotesEn: [
    "abacaba is a palindrome. bac is not. After the 4th letter becomes b, letters 3–5 read aba.",
  ],
  testInputs: ["7 4\nabacaba\n2 1 7\n2 2 4\n1 4 b\n2 3 5\n", "1 2\nz\n2 1 1\n1 1 a\n", "4 4\nabca\n2 1 4\n1 2 c\n2 1 4\n2 2 3\n", "6 3\naaaaaa\n2 1 6\n1 6 b\n2 1 6\n"],
  sol: `int n,q;cin>>n>>q;string s;cin>>s;const long long M1=1000000007,M2=998244353,B1=131,B2=137;vector<long long>p1(n+1,1),p2(n+1,1);for(int i=1;i<=n;++i){p1[i]=p1[i-1]*B1%M1;p2[i]=p2[i-1]*B2%M2;}
vector<long long>f1(n+1,0),f2(n+1,0),r1(n+1,0),r2(n+1,0);
auto add=[&](vector<long long>&f,int i,long long v,long long M){for(++i;i<=n;i+=i&-i)f[i]=(f[i]+v)%M;};
auto sum=[&](vector<long long>&f,int i,long long M){long long s2=0;for(;i>0;i-=i&-i)s2+=f[i];return s2%M;};
auto put=[&](int i,int c,int sg){long long a=(c*p1[i]%M1*sg+M1)%M1,b=(c*p2[i]%M2*sg+M2)%M2,ra=(c*p1[n-1-i]%M1*sg+M1)%M1,rb=(c*p2[n-1-i]%M2*sg+M2)%M2;add(f1,i,a,M1);add(f2,i,b,M2);add(r1,i,ra,M1);add(r2,i,rb,M2);};
for(int i=0;i<n;++i)put(i,s[i],1);
while(q--){int tp;cin>>tp;if(tp==1){int k;char x;cin>>k>>x;--k;put(k,s[k],-1);s[k]=x;put(k,x,1);}
 else{int a,b;cin>>a>>b;--a;--b;long long h1=(sum(f1,b+1,M1)-sum(f1,a,M1)+M1)%M1,g1=(sum(r1,b+1,M1)-sum(r1,a,M1)+M1)%M1;long long h2=(sum(f2,b+1,M2)-sum(f2,a,M2)+M2)%M2,g2=(sum(r2,b+1,M2)-sum(r2,a,M2)+M2)%M2;
  bool ok=h1*p1[n-1-b]%M1==g1*p1[a]%M1&&h2*p2[n-1-b]%M2==g2*p2[a]%M2;cout<<(ok?"YES":"NO")<<"\\n";}}`,
  wrongNote: "Checking only the first and last letters accepts pieces like abca; never applying the letter changes answers about the old string.",
  wrong: [
    `int n,q;cin>>n>>q;string s;cin>>s;while(q--){int tp;cin>>tp;if(tp==1){int k;char x;cin>>k>>x;s[k-1]=x;}else{int a,b;cin>>a>>b;cout<<(s[a-1]==s[b-1]?"YES":"NO")<<"\\n";}}`,
    `int n,q;cin>>n>>q;string s;cin>>s;while(q--){int tp;cin>>tp;if(tp==1){int k;char x;cin>>k>>x;}else{int a,b;cin>>a>>b;bool ok=true;for(int i=a-1,j=b-1;i<j;++i,--j)if(s[i]!=s[j])ok=false;cout<<(ok?"YES":"NO")<<"\\n";}}`,
  ],
  gen: (r) => { const n = r.int(1, 8), q = r.int(1, 6); let s = line([n, q]) + "\n" + r.str(n, "ab") + "\n"; for (let i = 0; i < q; i++) { if (r.int(0, 2) === 0) s += "1 " + r.int(1, n) + " " + r.pick("ab") + "\n"; else { const a = r.int(1, n); s += line([2, a, r.int(a, n)]) + "\n"; } } return s; },
  slow: [`int n,q;cin>>n>>q;string s;cin>>s;while(q--){int tp;cin>>tp;if(tp==1){int k;char x;cin>>k>>x;s[k-1]=x;}else{int a,b;cin>>a>>b;bool ok=true;for(int i=a-1,j=b-1;i<j;++i,--j)if(s[i]!=s[j])ok=false;cout<<(ok?"YES":"NO")<<"\\n";}}`],
  big: [
    { seed: 1, note: "a long palindrome, long queries, changes that keep it symmetric", code: `n = q = 200000\nh = text(r, n // 2, "ab")\ns = h + h[::-1]\nqs = []\nfor i in range(q):\n    if i % 4 == 0:\n        k = r.int(1, n)\n        qs.append("1 " + str(k) + " " + s[k - 1])\n    else:\n        d = r.int(0, 50)\n        qs.append(line([2, 1 + d, n - d]))\nreturn line([n, q]) + "\\n" + s + "\\n" + "\\n".join(qs)` },
    { seed: 2, note: "random letters and changes", code: `n = q = 200000\nqs = []\nfor i in range(q):\n    if i % 2:\n        qs.append("1 " + str(r.int(1, n)) + " " + r.choice("ab"))\n    else:\n        a = r.int(1, n)\n        qs.append(line([2, a, r.int(a, n)]))\nreturn line([n, q]) + "\\n" + text(r, n, "ab") + "\\n" + "\\n".join(qs)` },
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C620", judge: "tree-connected-sets-through-vertex", topic: "trees", rating: 2400,
  tag: "Rerooting DP", timeLimitMs: 2000,
  uz: "Har bir uch orqali bog‘lamli to‘plamlar",
  en: "Connected sets through every vertex",
  statementUz: "n ta uchdan iborat daraxt va M soni berilgan. Ba'zi uchlarni qora rangga bo‘yaymiz, shunday qilib qora uchlar bog‘lamli bo‘lsin: istalgan ikki qora uch orasidagi yo‘ldagi barcha uchlar ham qora. Har bir v uch uchun v qora bo‘ladigan bunday bo‘yashlar sonini toping va uni M ga bo‘lgandagi qoldiqni chiqaring. M tub son bo‘lishi shart emas.",
  statementEn: "You are given a tree of n vertices and a number M. Some vertices are painted black so that the black vertices are connected: every vertex on the path between two black vertices is black too. For every vertex v count such paintings in which v is black, and print the count modulo M. M need not be prime.",
  inputUz: "Birinchi qatorda n va M beriladi. Keyingi n − 1 ta qatorning har birida bitta qirra.",
  inputEn: "The first line contains n and M. Each of the next n − 1 lines contains one edge.",
  outputUz: "n ta qator chiqaring: v-qatorda v-uch uchun javob.",
  outputEn: "Print n lines: line v holds the answer for vertex v.",
  constraintList: ["1 ≤ n ≤ 10^5", "2 ≤ M ≤ 10^9", "the edges form a tree", "M may be composite"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "2 ≤ M ≤ 10^9", "qirralar daraxt hosil qiladi", "M murakkab son bo‘lishi mumkin"],
  sampleInputs: ["4 100\n1 2\n1 3\n1 4\n", "3 100\n1 2\n2 3\n", "1 7\n"],
  expect: ["8\n5\n5\n5\n", "3\n4\n3\n", "1\n"],
  sampleNotesUz: [
    "1-uch qora bo‘lsa, har bir barg qora yoki oq bo‘lishi mumkin: 2³ = 8. Barg qora bo‘lsa, yo yolg‘iz o‘zi, yo 1-uch bilan birga va qolgan ikki bargdan istalgancha: 1 + 4 = 5.",
    "Yo‘lning chetki uchi uchun {1}, {1, 2}, {1, 2, 3}; o‘rtadagisi uchun to‘rtta.",
    "Yagona uch.",
  ],
  sampleNotesEn: [
    "With vertex 1 black each leaf is black or not: 2³ = 8. With a leaf black, it is either alone or joined by vertex 1 and any of the other two leaves: 1 + 4 = 5.",
    "An end of the path has {1}, {1, 2}, {1, 2, 3}; the middle vertex has four.",
    "A single vertex.",
  ],
  testInputs: ["4 100\n1 2\n1 3\n1 4\n", "3 100\n1 2\n2 3\n", "1 7\n", "2 2\n1 2\n", "6 1000000000\n1 2\n2 3\n2 4\n4 5\n4 6\n", "7 12\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n"],
  sol: `int n;long long M;cin>>n>>M;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order={1},par(n+1,0);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>dn(n+1,1),up(n+1,1);for(int k=n-1;k>0;--k){int u=order[k];dn[par[u]]=dn[par[u]]*((dn[u]+1)%M)%M;}
for(int k=0;k<n;++k){int u=order[k];vector<int>ch;for(int v:g[u])if(v!=par[u])ch.push_back(v);int c=ch.size();vector<long long>pre(c+1,1),suf(c+1,1);
 for(int i=0;i<c;++i)pre[i+1]=pre[i]*((dn[ch[i]]+1)%M)%M;for(int i=c-1;i>=0;--i)suf[i]=suf[i+1]*((dn[ch[i]]+1)%M)%M;
 for(int i=0;i<c;++i){long long without=pre[i]*suf[i+1]%M*up[u]%M;up[ch[i]]=(without+1)%M;}}
for(int v=1;v<=n;++v)cout<<dn[v]%M*up[v]%M<<"\\n";`,
  wrongNote: "Counting only the sets that lie below each vertex ignores everything on the parent's side; forgetting that the parent's side may also be left out entirely (the + 1) forces the parent to be black.",
  wrong: [
    `int n;long long M;cin>>n>>M;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order={1},par(n+1,0);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>dn(n+1,1);for(int k=n-1;k>0;--k){int u=order[k];dn[par[u]]=dn[par[u]]*((dn[u]+1)%M)%M;}
for(int v=1;v<=n;++v)cout<<dn[v]%M<<"\\n";`,
    `int n;long long M;cin>>n>>M;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order={1},par(n+1,0);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>dn(n+1,1),up(n+1,1);for(int k=n-1;k>0;--k){int u=order[k];dn[par[u]]=dn[par[u]]*((dn[u]+1)%M)%M;}
for(int k=0;k<n;++k){int u=order[k];vector<int>ch;for(int v:g[u])if(v!=par[u])ch.push_back(v);int c=ch.size();vector<long long>pre(c+1,1),suf(c+1,1);
 for(int i=0;i<c;++i)pre[i+1]=pre[i]*((dn[ch[i]]+1)%M)%M;for(int i=c-1;i>=0;--i)suf[i]=suf[i+1]*((dn[ch[i]]+1)%M)%M;
 for(int i=0;i<c;++i){long long without=pre[i]*suf[i+1]%M*up[u]%M;up[ch[i]]=without%M;}}
for(int v=1;v<=n;++v)cout<<dn[v]%M*up[v]%M<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 8); return line([n, r.pick([2, 6, 10, 1000000000, 997])]) + "\n" + (n > 1 ? r.tree(n).map((e) => line(e)).join("\n") + "\n" : ""); },
  brute: `int n;long long M;cin>>n>>M;vector<pair<int,int>>e(n-1);for(auto&x:e)cin>>x.first>>x.second;vector<long long>cnt(n+1,0);
for(int m=1;m<(1<<n);++m){int k=__builtin_popcount(m),ed=0;for(auto&x:e)if((m>>(x.first-1)&1)&&(m>>(x.second-1)&1))++ed;if(ed!=k-1)continue;for(int v=1;v<=n;++v)if(m>>(v-1)&1)cnt[v]++;}
for(int v=1;v<=n;++v)cout<<cnt[v]%M<<"\\n";`,
  slow: [`int n;long long M;cin>>n>>M;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
for(int s=1;s<=n;++s){vector<int>order={s},par(n+1,0);par[s]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
 vector<long long>dn(n+1,1);for(int k=n-1;k>0;--k){int u=order[k];dn[par[u]]=dn[par[u]]*((dn[u]+1)%M)%M;}cout<<dn[s]%M<<"\\n";}`],
  big: [
    { seed: 1, note: "a random tree of 10^5 vertices, small modulus (output stays small)", code: `n = 100000\nreturn line([n, 1000]) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n))` },
    { seed: 2, note: "a star: one vertex with 80000 children", code: `n = 80000\nreturn line([n, 999999937]) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n, "star"))` },
    { seed: 3, note: "a path", code: `n = 80000\nreturn line([n, 10**9]) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n, "path"))` },
  ],
});

export default P;
