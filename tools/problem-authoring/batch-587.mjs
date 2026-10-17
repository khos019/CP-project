/* Batch 587 — thirteen problems, B587–B599: seven at 1500 and six at 1600.
 *
 * Every task is a well-known contest problem restated for AlgoYo'l in our own
 * words, with our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B587", judge: "sort-reorder-for-query-sums", topic: "sorting", rating: 1500,
  tag: "Difference arrays", timeLimitMs: 1000,
  uz: "So‘rovlar yig‘indisi eng katta bo‘lsin",
  en: "Arrange for the largest query total",
  statementUz: "n ta sondan iborat massiv va q ta so‘rov berilgan; har bir so‘rov (l, r) — l-o‘rindan r-o‘ringacha bo‘lgan elementlar yig‘indisini so‘raydi. So‘rovlarga javob berishdan oldin massiv elementlarini istalgan tartibda qayta joylashtirishingiz mumkin. Barcha q ta so‘rov javoblari yig‘indisining eng katta qiymatini toping. So‘rovlarning o‘zi o‘zgarmaydi, faqat elementlar tartibi tanlanadi.",
  statementEn: "You are given an array of n numbers and q queries; each query (l, r) asks for the sum of the elements from position l to position r. Before the queries are answered you may rearrange the elements of the array in any order. Find the largest possible total of the answers to all q queries. The queries themselves stay as they are; only the order of the elements is yours to choose.",
  inputUz: "Birinchi qatorda n va q beriladi. Ikkinchi qatorda n ta son a_i. Keyingi q ta qatorning har birida l va r keladi.",
  inputEn: "The first line contains n and q. The second line contains the n numbers a_i. Each of the next q lines contains l and r.",
  outputUz: "Yagona butun sonni chiqaring — javoblar yig‘indisining eng katta qiymati.",
  outputEn: "Print a single integer — the largest possible total.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ a_i ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n, q ≤ 2·10^5", "1 ≤ a_i ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3 3\n5 3 2\n1 2\n2 3\n1 3\n", "5 3\n5 2 4 1 3\n1 5\n2 3\n2 3\n"],
  expect: ["25\n", "33\n"],
  sampleNotesUz: [
    "2-o‘rin uchta so‘rovga, qolganlari ikkitaga kiradi. 5 ni o‘rtaga qo‘yamiz: 5 · 3 + 3 · 2 + 2 · 2 = 25.",
    "2- va 3-o‘rinlar uch martadan, qolganlari bir martadan sanaladi. Ularga 5 va 4 ni qo‘yamiz: 3 · (5 + 4) + 1 + 2 + 3 = 33.",
  ],
  sampleNotesEn: [
    "Position 2 is in all three queries and the others in two. Put 5 in the middle: 5 · 3 + 3 · 2 + 2 · 2 = 25.",
    "Positions 2 and 3 are counted three times each and the rest once. Put 5 and 4 there: 3 · (5 + 4) + 1 + 2 + 3 = 33.",
  ],
  testInputs: ["3 3\n5 3 2\n1 2\n2 3\n1 3\n", "5 3\n5 2 4 1 3\n1 5\n2 3\n2 3\n", "1 1\n7\n1 1\n", "4 2\n1 2 3 4\n1 1\n4 4\n", "6 4\n6 5 4 3 2 1\n1 3\n3 6\n2 5\n3 3\n"],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>c(n+1,0);
for(int i=0;i<q;++i){int l,r;cin>>l>>r;c[l-1]++;c[r]--;}for(int i=1;i<n;++i)c[i]+=c[i-1];c.pop_back();
sort(a.begin(),a.end());sort(c.begin(),c.end());long long s=0;for(int i=0;i<n;++i)s+=a[i]*c[i];cout<<s<<"\\n";`,
  wrongNote: "Keeping the array in its given order answers the queries without using the freedom to rearrange; putting the largest values where the fewest queries look does the opposite of what is wanted.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>c(n+1,0);
for(int i=0;i<q;++i){int l,r;cin>>l>>r;c[l-1]++;c[r]--;}for(int i=1;i<n;++i)c[i]+=c[i-1];
long long s=0;for(int i=0;i<n;++i)s+=a[i]*c[i];cout<<s<<"\\n";`,
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>c(n+1,0);
for(int i=0;i<q;++i){int l,r;cin>>l>>r;c[l-1]++;c[r]--;}for(int i=1;i<n;++i)c[i]+=c[i-1];c.pop_back();
sort(a.begin(),a.end());sort(c.rbegin(),c.rend());long long s=0;for(int i=0;i<n;++i)s+=a[i]*c[i];cout<<s<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7), q = r.int(1, 5); let s = line([n, q]) + "\n" + line(r.ints(n, 1, 9)) + "\n"; for (let i = 0; i < q; i++) { const l = r.int(1, n); s += line([l, r.int(l, n)]) + "\n"; } return s; },
  slow: [`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>c(n,0);
for(int i=0;i<q;++i){int l,r;cin>>l>>r;for(int j=l-1;j<r;++j)c[j]++;}
sort(a.begin(),a.end());sort(c.begin(),c.end());long long s=0;for(int i=0;i<n;++i)s+=a[i]*c[i];cout<<s<<"\\n";`],
  big: [
    { seed: 1, note: "wide queries: adding them cell by cell is quadratic", code: `n = q = 200000\nqs = [line([r.int(1, 100), r.int(n - 100, n)]) for _ in range(q)]\nreturn line([n, q]) + "\\n" + line(r.ints(n, 1, 200000)) + "\\n" + "\\n".join(qs)` },
  ],
});

P.push({
  id: "B588", judge: "dp-take-value-delete-neighbours", topic: "dynamic-programming", rating: 1500,
  tag: "DP over values", timeLimitMs: 1000,
  uz: "Qo‘shni qiymatlar yo‘qoladi",
  en: "Neighbouring values vanish",
  statementUz: "n ta musbat butun sondan iborat ketma-ketlik berilgan. Bitta qadamda istalgan a_k elementni tanlaysiz: u o‘chiriladi va sizga a_k ochko beradi, shu bilan birga qiymati a_k − 1 yoki a_k + 1 ga teng bo‘lgan barcha elementlar ham ochkosiz o‘chiriladi. Ketma-ketlik bo‘shaguncha qadamlar davom etadi. To‘planadigan ochkoning eng katta qiymatini toping.",
  statementEn: "You are given a sequence of n positive integers. In one step you choose any element a_k: it is deleted and earns you a_k points, and at the same time every element equal to a_k − 1 or a_k + 1 is deleted too, earning nothing. Steps continue until the sequence is empty. Find the largest number of points you can collect.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Yagona butun sonni chiqaring — eng ko‘p ochko.",
  outputEn: "Print a single integer — the largest number of points.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^5", "only values differing by exactly 1 are deleted with the chosen one", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^5", "tanlangan bilan birga faqat undan aynan 1 ga farq qiladigan qiymatlar o‘chadi", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n1 2 3\n", "6\n2 2 3 3 3 4\n"],
  expect: ["4\n", "9\n"],
  sampleNotesUz: [
    "1 ni tanlasak, 2 ham o‘chadi; keyin 3 ni olamiz: 4 ochko.",
    "Uchta 3 ni olish 9 beradi (2 va 4 o‘chadi); 2 lar va 4 ni olish faqat 8.",
  ],
  sampleNotesEn: [
    "Choosing 1 deletes the 2 as well; then take the 3: 4 points.",
    "Taking the three 3s earns 9 (the 2s and the 4 vanish); taking the 2s and the 4 earns only 8.",
  ],
  testInputs: ["3\n1 2 3\n", "6\n2 2 3 3 3 4\n", "2\n1 3\n", "1\n100000\n", "9\n1 2 1 3 2 2 2 2 3\n", "5\n5 5 4 6 100000\n"],
  sol: `int n;cin>>n;const int V=100001;vector<long long>c(V+1,0);for(int i=0;i<n;++i){int a;cin>>a;c[a]+=a;}
vector<long long>f(V+1,0);f[1]=c[1];for(int v=2;v<=V;++v)f[v]=max(f[v-1],f[v-2]+c[v]);cout<<f[V]<<"\\n";`,
  wrongNote: "Scoring each value once however often it appears throws away the copies; treating the next distinct value as a neighbour even across a gap rules out 1 and 3 together.",
  wrong: [
    `int n;cin>>n;const int V=100001;vector<long long>c(V+1,0);for(int i=0;i<n;++i){int a;cin>>a;c[a]=a;}
vector<long long>f(V+1,0);f[1]=c[1];for(int v=2;v<=V;++v)f[v]=max(f[v-1],f[v-2]+c[v]);cout<<f[V]<<"\\n";`,
    `int n;cin>>n;map<long long,long long>c;for(int i=0;i<n;++i){long long a;cin>>a;c[a]+=a;}vector<long long>v;for(auto&p:c)v.push_back(p.second);
long long p2=0,p1=0;for(auto x:v){long long cur=max(p1,p2+x);p2=p1;p1=cur;}cout<<p1<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + line(r.ints(n, 1, 7)) + "\n"; },
  brute: `int n;cin>>n;map<int,long long>c;for(int i=0;i<n;++i){int a;cin>>a;c[a]+=a;}vector<int>v;vector<long long>w;for(auto&p:c){v.push_back(p.first);w.push_back(p.second);}
int k=v.size();long long best=0;for(int m=0;m<(1<<k);++m){bool ok=true;long long s=0;for(int i=0;i<k;++i)if(m>>i&1){s+=w[i];for(int j=0;j<k;++j)if((m>>j&1)&&v[j]==v[i]+1)ok=false;}if(ok)best=max(best,s);}
cout<<best<<"\\n";`,
  big: [
    { seed: 1, note: "10^5 random values", code: `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 100000))` },
  ],
});

P.push({
  id: "B589", judge: "ds-two-disjoint-windows", topic: "data-structures", rating: 1500,
  tag: "Prefix sums", timeLimitMs: 1000,
  uz: "Ikki bo‘lak",
  en: "Two windows",
  statementUz: "n ta manfiy bo‘lmagan butun sondan iborat massiv va k soni berilgan. Uzunligi k bo‘lgan, bir-birini kesmaydigan ikkita bo‘lakni tanlash kerak: biri a-o‘rindan, ikkinchisi b-o‘rindan boshlanadi, va a + k ≤ b. Ikki bo‘lakdagi elementlar yig‘indisi eng katta bo‘lsin. Bunday a va b ni chiqaring; bir nechta javob bo‘lsa, a eng kichigini, so‘ng b eng kichigini tanlang.",
  statementEn: "You are given an array of n non-negative integers and a number k. Choose two non-overlapping windows of length k: one starting at position a and the other at position b, with a + k ≤ b. The total of the elements in the two windows must be as large as possible. Print such a and b; if several answers exist, take the smallest a, and then the smallest b.",
  inputUz: "Birinchi qatorda n va k beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n and k. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Ikki sonni chiqaring: a va b.",
  outputEn: "Print two numbers: a and b.",
  constraintList: ["2 ≤ n ≤ 2·10^5", "1 ≤ k, 2k ≤ n", "0 ≤ a_i ≤ 10^9", "ties go to the smallest a, then the smallest b"],
  constraintListUz: ["2 ≤ n ≤ 2·10^5", "1 ≤ k, 2k ≤ n", "0 ≤ a_i ≤ 10^9", "teng hollarda eng kichik a, so‘ng eng kichik b tanlanadi"],
  sampleInputs: ["5 2\n3 6 1 1 6\n", "6 1\n1 1 1 1 1 1\n"],
  expect: ["1 4\n", "1 2\n"],
  sampleNotesUz: [
    "1-o‘rindan (3 + 6) va 4-o‘rindan (1 + 6) boshlanadigan bo‘laklar 16 beradi.",
    "Hamma juftlik bir xil, shuning uchun eng kichik a va b.",
  ],
  sampleNotesEn: [
    "The windows starting at 1 (3 + 6) and at 4 (1 + 6) total 16.",
    "Every choice is equal, so the smallest a and b are printed.",
  ],
  testInputs: ["5 2\n3 6 1 1 6\n", "6 1\n1 1 1 1 1 1\n", "6 2\n1 3 3 1 1 1\n", "2 1\n0 0\n", "8 3\n0 0 0 9 9 9 0 0\n", "7 2\n5 5 0 0 5 5 5\n"],
  sol: `int n,k;cin>>n>>k;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}int m=n-k+1;vector<long long>w(m);for(int i=0;i<m;++i)w[i]=p[i+k]-p[i];
long long best=-1;int ba=0,bb=0,bi=0;for(int b=k;b<m;++b){if(w[b-k]>w[bi])bi=b-k;long long s=w[bi]+w[b];if(s>best){best=s;ba=bi;bb=b;}}
cout<<ba+1<<" "<<bb+1<<"\\n";`,
  wrongNote: "Breaking ties towards the latest window prints a different pair from the one asked for; taking the single best window first and fitting the second around it can miss a better pair.",
  wrong: [
    `int n,k;cin>>n>>k;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}int m=n-k+1;vector<long long>w(m);for(int i=0;i<m;++i)w[i]=p[i+k]-p[i];
long long best=-1;int ba=0,bb=0,bi=0;for(int b=k;b<m;++b){if(w[b-k]>=w[bi])bi=b-k;long long s=w[bi]+w[b];if(s>=best){best=s;ba=bi;bb=b;}}
cout<<ba+1<<" "<<bb+1<<"\\n";`,
    `int n,k;cin>>n>>k;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}int m=n-k+1;vector<long long>w(m);for(int i=0;i<m;++i)w[i]=p[i+k]-p[i];
int f=0;for(int i=0;i<m;++i)if(w[i]>w[f])f=i;int g=-1;for(int i=0;i<m;++i)if(i+k<=f||i>=f+k)if(g<0||w[i]>w[g])g=i;
int a=min(f,g),b=max(f,g);cout<<a+1<<" "<<b+1<<"\\n";`,
  ],
  gen: (r) => { const k = r.int(1, 3), n = r.int(2 * k, 9); return line([n, k]) + "\n" + line(r.ints(n, 0, 5)) + "\n"; },
  slow: [`int n,k;cin>>n>>k;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long x;cin>>x;p[i+1]=p[i]+x;}int m=n-k+1;long long best=-1;int ba=0,bb=0;
for(int a=0;a<m;++a)for(int b=a+k;b<m;++b){long long s=p[a+k]-p[a]+p[b+k]-p[b];if(s>best){best=s;ba=a;bb=b;}}
cout<<ba+1<<" "<<bb+1<<"\\n";`],
  big: [
    { seed: 1, note: "k = 1 over 2·10^5 values", code: `n = 200000\nreturn line([n, 1]) + "\\n" + line(r.ints(n, 0, 10**9))` },
    { seed: 2, note: "all zeros: ties everywhere", code: `n = 200000\nreturn line([n, 1000]) + "\\n" + line([0] * n)` },
  ],
});

P.push({
  id: "B590", judge: "two-pointers-friends-money-gap", topic: "two-pointers", rating: 1500,
  tag: "Sorting and two pointers", timeLimitMs: 1000,
  uz: "Do‘stlar davrasi",
  en: "A circle of friends",
  statementUz: "n ta do‘stingiz bor, i-do‘stda m_i so‘m pul va s_i do‘stlik darajasi bor. Restoranga bir nechta do‘stni taklif qilmoqchisiz, lekin hech kim o‘zini kambag‘al his qilmasligi kerak: taklif qilinganlar orasida birortasining puli boshqasinikidan kamida d ga ko‘p bo‘lmasligi kerak — ya'ni eng boy va eng kambag‘al taklif etilgan do‘st pullari ayirmasi d dan kichik. Taklif qilinganlar do‘stlik darajalari yig‘indisining eng katta qiymatini toping.",
  statementEn: "You have n friends, and friend i has m_i money and a friendship factor s_i. You want to invite some of them to a restaurant, but nobody should feel poor: no invited friend may have at least d more money than another invited friend — the difference between the richest and the poorest invited friend must be less than d. Find the largest possible total friendship factor of the invited friends.",
  inputUz: "Birinchi qatorda n va d beriladi. Keyingi n ta qatorning har birida m_i va s_i keladi.",
  inputEn: "The first line contains n and d. Each of the next n lines contains m_i and s_i.",
  outputUz: "Yagona butun sonni chiqaring — eng katta yig‘indi.",
  outputEn: "Print a single integer — the largest total.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ d ≤ 10^9", "0 ≤ m_i, s_i ≤ 10^9", "the difference must be strictly less than d"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ d ≤ 10^9", "0 ≤ m_i, s_i ≤ 10^9", "ayirma d dan qat'iy kichik bo‘lishi kerak"],
  sampleInputs: ["4 10\n3 5\n10 7\n12 2\n25 30\n", "3 3\n1 4\n2 4\n3 4\n"],
  expect: ["30\n", "12\n"],
  sampleNotesUz: [
    "25 so‘mli do‘st yolg‘iz o‘zi 30 beradi; 3 va 10 so‘mlilar birga faqat 12.",
    "Pullar 1, 2, 3, eng katta ayirma 2 < 3 — hammani taklif qilamiz.",
  ],
  sampleNotesEn: [
    "The friend with 25 alone gives 30; the friends with 3 and 10 together give only 12.",
    "The amounts are 1, 2, 3, the largest difference 2 < 3, so everyone is invited.",
  ],
  testInputs: ["4 10\n3 5\n10 7\n12 2\n25 30\n", "3 3\n1 4\n2 4\n3 4\n", "2 2\n1 5\n3 5\n", "1 1\n0 0\n", "5 1\n5 1\n5 2\n5 3\n6 100\n4 7\n", "3 5\n10 1\n1 1\n11 1\n"],
  sol: `int n;long long d;cin>>n>>d;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;sort(f.begin(),f.end());
long long best=0,s=0;int l=0;for(int r=0;r<n;++r){s+=f[r].second;while(f[r].first-f[l].first>=d){s-=f[l].second;++l;}best=max(best,s);}cout<<best<<"\\n";`,
  wrongNote: "Allowing a difference of exactly d invites a friend who would feel poor; sliding the window over unsorted friends compares the wrong pairs.",
  wrong: [
    `int n;long long d;cin>>n>>d;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;sort(f.begin(),f.end());
long long best=0,s=0;int l=0;for(int r=0;r<n;++r){s+=f[r].second;while(f[r].first-f[l].first>d){s-=f[l].second;++l;}best=max(best,s);}cout<<best<<"\\n";`,
    `int n;long long d;cin>>n>>d;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;
long long best=0,s=0;int l=0;for(int r=0;r<n;++r){s+=f[r].second;while(l<r&&llabs(f[r].first-f[l].first)>=d){s-=f[l].second;++l;}best=max(best,s);}cout<<best<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7); let s = line([n, r.int(1, 6)]) + "\n"; for (let i = 0; i < n; i++) s += line([r.int(0, 12), r.int(0, 9)]) + "\n"; return s; },
  slow: [`int n;long long d;cin>>n>>d;vector<pair<long long,long long>>f(n);for(auto&x:f)cin>>x.first>>x.second;long long best=0;
for(int i=0;i<n;++i){long long s=0;for(int j=0;j<n;++j)if(f[j].first>=f[i].first&&f[j].first-f[i].first<d)s+=f[j].second;best=max(best,s);}cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "10^5 friends with close amounts", code: `n = 100000\nreturn line([n, 10**6]) + "\\n" + "\\n".join(line([r.int(0, 10**7), r.int(0, 10**9)]) for _ in range(n))` },
  ],
});

P.push({
  id: "B591", judge: "tree-leaves-few-cats-in-a-row", topic: "trees", rating: 1500,
  tag: "Tree traversal", timeLimitMs: 1000,
  uz: "Mushuklar bog‘i",
  en: "The park with cats",
  statementUz: "Bog‘ n ta uchdan iborat daraxt, uning ildizi 1-uch — u yerda uyingiz. Ba'zi uchlarda mushuk yashaydi. Daraxt barglarida (ildizdan boshqa, farzandi yo‘q uchlarda) restoranlar bor. Siz restoranga borishingiz mumkin, agar ildizdan unga boradigan yo‘lda ketma-ket kelgan mushukli uchlar soni hech qayerda m dan oshmasa; yo‘lning ikkala uchi ham hisobga olinadi. Nechta restoranga borish mumkin?",
  statementEn: "A park is a tree of n vertices rooted at vertex 1, where your house is. Some vertices have a cat living there. The leaves of the tree (the vertices other than the root that have no children) hold restaurants. You can go to a restaurant if the path from the root to it nowhere has more than m consecutive vertices with cats; both ends of the path count. How many restaurants can you go to?",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda n ta son: i-uchda mushuk bo‘lsa 1, aks holda 0. Keyingi n − 1 ta qatorda qirralar.",
  inputEn: "The first line contains n and m. The second line contains n numbers: 1 if vertex i has a cat and 0 otherwise. The next n − 1 lines contain the edges.",
  outputUz: "Yagona butun sonni chiqaring — borish mumkin bo‘lgan restoranlar soni.",
  outputEn: "Print a single integer — the number of restaurants you can go to.",
  constraintList: ["2 ≤ n ≤ 10^5", "1 ≤ m ≤ n", "the edges form a tree", "only consecutive cats along the path matter"],
  constraintListUz: ["2 ≤ n ≤ 10^5", "1 ≤ m ≤ n", "qirralar daraxt hosil qiladi", "yo‘lda faqat ketma-ket kelgan mushuklar muhim"],
  sampleInputs: ["6 1\n0 1 1 0 1 0\n1 2\n1 3\n2 4\n3 5\n3 6\n", "3 2\n1 1 1\n1 2\n2 3\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Barglar 4, 5, 6. 5 ga yo‘lda 3 va 5 da ketma-ket ikkita mushuk bor; 4 va 6 ga yo‘llarda bittadan ortiq ketma-ket mushuk yo‘q.",
    "Yagona bargga yo‘lda uchta mushuk ketma-ket.",
  ],
  sampleNotesEn: [
    "The leaves are 4, 5 and 6. The path to 5 has two cats in a row, at 3 and 5; the paths to 4 and 6 never have more than one in a row.",
    "The path to the only leaf has three cats in a row.",
  ],
  testInputs: ["6 1\n0 1 1 0 1 0\n1 2\n1 3\n2 4\n3 5\n3 6\n", "3 2\n1 1 1\n1 2\n2 3\n", "4 1\n1 0 1 0\n1 2\n2 3\n3 4\n", "2 1\n1 1\n2 1\n", "5 2\n1 1 0 1 1\n1 2\n1 3\n1 4\n4 5\n"],
  sol: `int n,m;cin>>n>>m;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>run(n+1,0),par(n+1,0);vector<int>st={1};run[1]=c[1];par[1]=-1;int ans=0;
while(!st.empty()){int u=st.back();st.pop_back();if(run[u]>m)continue;bool kid=false;for(int v:g[u])if(v!=par[u]){kid=true;par[v]=u;run[v]=c[v]?run[u]+1:0;st.push_back(v);}if(!kid&&u!=1)++ans;}
cout<<ans<<"\\n";`,
  wrongNote: "Counting all the cats on the path instead of those in a row turns away paths whose cats are spread out; counting every reachable vertex counts places that are not restaurants.",
  wrong: [
    `int n,m;cin>>n>>m;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>run(n+1,0),par(n+1,0);vector<int>st={1};run[1]=c[1];par[1]=-1;int ans=0;
while(!st.empty()){int u=st.back();st.pop_back();if(run[u]>m)continue;bool kid=false;for(int v:g[u])if(v!=par[u]){kid=true;par[v]=u;run[v]=run[u]+c[v];st.push_back(v);}if(!kid&&u!=1)++ans;}
cout<<ans<<"\\n";`,
    `int n,m;cin>>n>>m;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>run(n+1,0),par(n+1,0);vector<int>st={1};run[1]=c[1];par[1]=-1;int ans=0;
while(!st.empty()){int u=st.back();st.pop_back();if(run[u]>m)continue;if(u!=1)++ans;for(int v:g[u])if(v!=par[u]){par[v]=u;run[v]=c[v]?run[u]+1:0;st.push_back(v);}}
cout<<ans<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(2, 9); return line([n, r.int(1, 3)]) + "\n" + line(r.ints(n, 0, 1)) + "\n" + r.tree(n).map((e) => line(e)).join("\n") + "\n"; },
  slow: [`int n,m;cin>>n>>m;vector<int>c(n+1);for(int i=1;i<=n;++i)cin>>c[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>par(n+1,0),order={1};par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
int ans=0;for(int u=2;u<=n;++u){bool leaf=true;for(int v:g[u])if(v!=par[u])leaf=false;if(!leaf)continue;int run=0,mx=0;for(int x=u;x!=-1;x=par[x]){run=c[x]?run+1:0;mx=max(mx,run);}if(mx<=m)++ans;}
cout<<ans<<"\\n";`],
  big: [
    { seed: 1, note: "a long handle with a brush of leaves: walking up from each leaf is quadratic", code: `n = 100000\nh = 50000\nedges = [(i, i + 1) for i in range(1, h)] + [(h, j) for j in range(h + 1, n + 1)]\nreturn line([n, 3]) + "\\n" + line([0] * n) + "\\n" + "\\n".join(line(e) for e in edges)` },
    { seed: 2, note: "a random tree, cats everywhere", code: `n = 100000\nreturn line([n, 2]) + "\\n" + line(r.ints(n, 0, 1)) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n, "random", True))` },
  ],
});

P.push({
  id: "B592", judge: "greedy-double-or-minus-one", topic: "greedy", rating: 1500,
  tag: "Greedy backwards", timeLimitMs: 1000,
  uz: "Ikki tugma",
  en: "Two buttons",
  statementUz: "Qurilma ekranida n soni turibdi. Qizil tugma ekrandagi sonni ikkiga ko‘paytiradi, ko‘k tugma esa undan 1 ni ayiradi. Ekrandagi son har doim musbat bo‘lishi kerak: son 1 ga teng bo‘lsa, ko‘k tugmani bosib bo‘lmaydi. Ekranda m sonini hosil qilish uchun tugmalarni eng kami bilan necha marta bosish kerak? Har bir so‘rov alohida yechiladi.",
  statementEn: "A device shows the number n on its screen. The red button doubles the number on the screen, and the blue button subtracts 1 from it. The number on the screen must always stay positive: when it is 1, the blue button cannot be pressed. What is the smallest number of presses that brings the number m onto the screen? Each query is answered on its own.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida n va m keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains n and m.",
  outputUz: "Har bir so‘rov uchun alohida qatorda bosishlarning eng kam sonini chiqaring.",
  outputEn: "For each query print the smallest number of presses on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n, m ≤ 10^9", "the number must stay positive", "n and m may be equal"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n, m ≤ 10^9", "son musbat bo‘lib qolishi kerak", "n va m teng bo‘lishi mumkin"],
  sampleInputs: ["3\n4 6\n10 1\n3 8\n"],
  expect: ["2\n9\n3\n"],
  sampleNotesUz: [
    "4 → 3 → 6. 10 dan 1 ga faqat to‘qqiz marta ko‘k tugma bilan. 3 → 2 → 4 → 8.",
  ],
  sampleNotesEn: [
    "4 → 3 → 6. From 10 to 1 takes nine blue presses. 3 → 2 → 4 → 8.",
  ],
  testInputs: ["3\n4 6\n10 1\n3 8\n", "1\n5 5\n", "1\n1 1000000000\n", "1\n1000000000 1\n", "4\n7 13\n2 3\n9 17\n999999999 1000000000\n"],
  sol: `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long c=0;while(m>n){if(m%2)++m;else m/=2;++c;}cout<<c+(n-m)<<"\\n";}`,
  wrongNote: "Doubling until the target is passed and then stepping down overshoots by far too much; going backwards and subtracting one from an odd target walks away from the start instead of towards it.",
  wrong: [
    `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long c=0;while(n<m){n*=2;++c;}cout<<c+(n-m)<<"\\n";}`,
    `int t;cin>>t;while(t--){long long n,m;cin>>n>>m;long long c=0;while(m>n){if(m%2)--m;else m/=2;++c;}cout<<c+(n-m)<<"\\n";}`,
  ],
  gen: (r) => tests(r, 5, (r) => line([r.int(1, 40), r.int(1, 40)]) + "\n"),
  brute: `int t;cin>>t;while(t--){int n,m;cin>>n>>m;int L=200;vector<int>d(L+1,-1);deque<int>q;d[n]=0;q.push_back(n);
while(!q.empty()){int u=q.front();q.pop_front();for(int v:{u*2,u-1})if(v>=1&&v<=L&&d[v]<0){d[v]=d[u]+1;q.push_back(v);}}
cout<<d[m]<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 queries up to 10^9", code: `return "10000\\n" + "\\n".join(line([r.int(1, 10**9), r.int(1, 10**9)]) for _ in range(10000))` },
  ],
});

P.push({
  id: "B593", judge: "greedy-smallest-unmakeable-sum", topic: "greedy", rating: 1500,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Yig‘ib bo‘lmaydigan summa",
  en: "The sum that cannot be paid",
  statementUz: "Sizda n ta tanga bor, i-tanganing qiymati a_i. Bir nechta tangani tanlab (har bir tanga ko‘pi bilan bir marta), ularning qiymatlari yig‘indisini to‘lash mumkin. Bu tangalar bilan aniq to‘lab bo‘lmaydigan eng kichik musbat butun summani toping. Masalan, 1, 2 va 5 qiymatli tangalar bilan 1, 2, 3 ni to‘lash mumkin, 4 ni esa yo‘q.",
  statementEn: "You have n coins, and coin i has value a_i. Choosing some of the coins (each at most once) pays the sum of their values. Find the smallest positive integer sum that these coins cannot pay exactly. For example, coins of 1, 2 and 5 can pay 1, 2 and 3, but not 4.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Yagona butun sonni chiqaring — to‘lab bo‘lmaydigan eng kichik summa.",
  outputEn: "Print a single integer — the smallest sum that cannot be paid.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "each coin is used at most once", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "har bir tanga ko‘pi bilan bir marta ishlatiladi", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["5\n2 9 1 2 7\n", "3\n1 1 1\n", "2\n2 3\n"],
  expect: ["6\n", "4\n", "1\n"],
  sampleNotesUz: [
    "1, 2, 2 bilan 1 dan 5 gacha hamma summani to‘lash mumkin, 7 va 9 esa 6 ni yopa olmaydi.",
    "Uchta tanga 1, 2, 3 ni beradi; 4 ga yetmaydi.",
    "1 ni to‘lash uchun tanga yo‘q.",
  ],
  sampleNotesEn: [
    "1, 2, 2 pay every sum from 1 to 5, and the 7 and 9 cannot make 6.",
    "Three coins pay 1, 2 and 3; 4 is out of reach.",
    "There is no coin that pays 1.",
  ],
  testInputs: ["5\n2 9 1 2 7\n", "3\n1 1 1\n", "2\n2 3\n", "1\n1\n", "1\n1000000000\n", "6\n1 2 4 8 16 33\n", "4\n1 1 3 10\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long reach=0;
for(auto x:a){if(x>reach+1)break;reach+=x;}cout<<reach+1<<"\\n";`,
  wrongNote: "Stopping at a coin larger than the current reach instead of reach + 1 refuses a coin that extends the run exactly; walking the coins unsorted stops at the first large coin even if small ones come later.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long reach=0;
for(auto x:a){if(x>reach)break;reach+=x;}cout<<reach+1<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long reach=0;
for(auto x:a){if(x>reach+1)break;reach+=x;}cout<<reach+1<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 8); return n + "\n" + line(r.ints(n, 1, 12)) + "\n"; },
  brute: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;set<long long>s;for(int m=1;m<(1<<n);++m){long long v=0;for(int i=0;i<n;++i)if(m>>i&1)v+=a[i];s.insert(v);}
long long x=1;while(s.count(x))++x;cout<<x<<"\\n";`,
  slow: [`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=0;i<n;++i)for(int j=0;j+1<n-i;++j)if(a[j]>a[j+1])swap(a[j],a[j+1]);long long reach=0;
for(auto x:a){if(x>reach+1)break;reach+=x;}cout<<reach+1<<"\\n";`],
  big: [
    { seed: 1, note: "2·10^5 coins, every sum up to the total can be paid", code: `n = 200000\na = r.shuffle([1] * 1000 + r.ints(n - 1000, 1, 1000))\nreturn str(n) + "\\n" + line(a)` },
    { seed: 2, note: "random large coins", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B594", judge: "dp-increasing-run-one-change", topic: "dynamic-programming", rating: 1600,
  tag: "Prefix and suffix runs", timeLimitMs: 1000,
  uz: "Bitta o‘zgartirish bilan o‘suvchi",
  en: "Increasing after one change",
  statementUz: "n ta butun sondan iborat massiv berilgan. Uning shunday eng uzun ketma-ket bo‘lagini toping, unda ko‘pi bilan bitta elementni istalgan butun songa almashtirib, bo‘lakni qat'iy o‘suvchi qilish mumkin bo‘lsin. Qat'iy o‘suvchi — har bir element oldingisidan katta. O‘zgartirish majburiy emas. Bo‘lak uzunligini chiqaring.",
  statementEn: "You are given an array of n integers. Find the longest segment of consecutive elements in which at most one element can be changed to any integer so that the segment becomes strictly increasing — every element larger than the one before it. Making no change is allowed. Print the length of the segment.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun bo‘lak uzunligi.",
  outputEn: "Print a single integer — the length of the longest segment.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "the new value may be any integer", "at most one element is changed"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "yangi qiymat istalgan butun son bo‘lishi mumkin", "ko‘pi bilan bitta element o‘zgartiriladi"],
  sampleInputs: ["6\n7 2 3 1 5 6\n", "3\n1 1 1\n", "4\n1 5 2 3\n"],
  expect: ["5\n", "2\n", "3\n"],
  sampleNotesUz: [
    "1 ni 4 ga almashtirsak, 2 3 4 5 6 — uzunligi 5.",
    "1 x 1 ni o‘suvchi qilib bo‘lmaydi, lekin istalgan ikki element yetarli.",
    "Butun massivni o‘suvchi qilib bo‘lmaydi: 5 o‘rniga 1 va 2 orasidagi, 2 o‘rniga 5 va 3 orasidagi butun son kerak bo‘lardi. Lekin 5 2 3 da 5 ni 1 ga almashtirsak, uzunligi 3 bo‘lgan 1 2 3 hosil bo‘ladi.",
  ],
  sampleNotesEn: [
    "Changing the 1 to 4 gives 2 3 4 5 6, of length 5.",
    "1 x 1 can never increase, but any two elements can.",
    "The whole array cannot be made increasing: replacing the 5 would need an integer between 1 and 2, replacing the 2 one between 5 and 3. But in 5 2 3 changing the 5 to 1 gives 1 2 3, of length 3.",
  ],
  testInputs: ["6\n7 2 3 1 5 6\n", "3\n1 1 1\n", "3\n1 5 2\n", "1\n5\n", "5\n1 2 3 4 5\n", "5\n5 4 3 2 1\n", "7\n1 2 3 10 4 5 6\n", "6\n1 3 2 4 3 5\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;if(n<=2){cout<<n<<"\\n";return 0;}
vector<int>L(n,1),R(n,1);for(int i=1;i<n;++i)if(a[i]>a[i-1])L[i]=L[i-1]+1;for(int i=n-2;i>=0;--i)if(a[i]<a[i+1])R[i]=R[i+1]+1;
int best=0;for(int i=0;i<n;++i){if(i>0)best=max(best,L[i-1]+1);if(i+1<n)best=max(best,R[i+1]+1);if(i>0&&i+1<n&&a[i+1]-a[i-1]>=2)best=max(best,L[i-1]+1+R[i+1]);}
cout<<min(best,n)<<"\\n";`,
  wrongNote: "Joining the runs on either side when the neighbours differ by just one forgets that the changed value needs room strictly between them; only ever joining two runs misses a run extended by a single changed element at its end.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;if(n<=2){cout<<n<<"\\n";return 0;}
vector<int>L(n,1),R(n,1);for(int i=1;i<n;++i)if(a[i]>a[i-1])L[i]=L[i-1]+1;for(int i=n-2;i>=0;--i)if(a[i]<a[i+1])R[i]=R[i+1]+1;
int best=0;for(int i=0;i<n;++i){if(i>0)best=max(best,L[i-1]+1);if(i+1<n)best=max(best,R[i+1]+1);if(i>0&&i+1<n&&a[i+1]-a[i-1]>=1)best=max(best,L[i-1]+1+R[i+1]);}
cout<<min(best,n)<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;if(n<=2){cout<<n<<"\\n";return 0;}
vector<int>L(n,1),R(n,1);for(int i=1;i<n;++i)if(a[i]>a[i-1])L[i]=L[i-1]+1;for(int i=n-2;i>=0;--i)if(a[i]<a[i+1])R[i]=R[i+1]+1;
int best=*max_element(L.begin(),L.end());for(int i=1;i+1<n;++i)if(a[i+1]-a[i-1]>=2)best=max(best,L[i-1]+1+R[i+1]);
cout<<min(best,n)<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, 8)) + "\n"; },
  slow: [`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=1;
auto ok=[&](int l,int r){for(int p=l-1;p<=r;++p){bool good=true;for(int i=l+1;i<=r&&good;++i){if(i==p||i-1==p)continue;if(a[i]<=a[i-1])good=false;}
 if(good&&p>l&&p<r&&a[p+1]-a[p-1]<2)good=false;
 if(good)return true;}return false;};
for(int l=0;l<n;++l)for(int r=l;r<n;++r)if(ok(l,r))best=max(best,r-l+1);cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "one long increasing run with a dip in the middle", code: `n = 100000\na = list(range(1, n + 1))\na[n // 2] = 1\nreturn str(n) + "\\n" + line(a)` },
    { seed: 2, note: "random", code: `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "B595", judge: "bs-burgers-with-budget", topic: "binary-search", rating: 1600,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Gamburgerlar",
  en: "Hamburgers",
  statementUz: "Gamburger retsepti B (non), S (kolbasa) va C (pishloq) harflaridan iborat qator bilan berilgan: har bir harf bitta mahsulotni bildiradi, masalan BSCB — ikki non, bitta kolbasa va bitta pishloq. Oshxonada n_b non, n_s kolbasa va n_c pishloq bor; do‘konda ular mos ravishda p_b, p_s va p_c so‘mdan sotiladi, sizda r so‘m bor. Mahsulotlarni bo‘lib bo‘lmaydi. Eng ko‘pi bilan nechta gamburger tayyorlash mumkin?",
  statementEn: "A hamburger recipe is a string of the letters B (bread), S (sausage) and C (cheese): each letter is one ingredient, so BSCB means two breads, one sausage and one cheese. The kitchen has n_b breads, n_s sausages and n_c cheeses; the shop sells them for p_b, p_s and p_c each, and you have r roubles. Ingredients cannot be split. What is the largest number of hamburgers you can make?",
  inputUz: "Birinchi qatorda retsept beriladi. Ikkinchi qatorda n_b, n_s, n_c, uchinchi qatorda p_b, p_s, p_c, to‘rtinchi qatorda r keladi.",
  inputEn: "The first line contains the recipe. The second line contains n_b, n_s, n_c, the third p_b, p_s, p_c, and the fourth r.",
  outputUz: "Yagona butun sonni chiqaring — gamburgerlarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of hamburgers.",
  constraintList: ["1 ≤ recipe length ≤ 100", "1 ≤ n_b, n_s, n_c, p_b, p_s, p_c ≤ 100", "1 ≤ r ≤ 10^12", "the answer can exceed 10^9"],
  constraintListUz: ["1 ≤ retsept uzunligi ≤ 100", "1 ≤ n_b, n_s, n_c, p_b, p_s, p_c ≤ 100", "1 ≤ r ≤ 10^12", "javob 10^9 dan oshishi mumkin"],
  sampleInputs: ["BBC\n1 10 1\n1 10 1\n21\n", "BSC\n1 1 1\n100 100 100\n1\n"],
  expect: ["7\n", "1\n"],
  sampleNotesUz: [
    "7 ta gamburgerga 14 non va 7 pishloq kerak: 13 + 6 = 19 so‘mlik xarid; 8 tasi uchun 22 so‘m kerak bo‘lardi.",
    "Bitta gamburger zaxiradan chiqadi, ikkinchisiga 300 so‘m kerak.",
  ],
  sampleNotesEn: [
    "7 hamburgers need 14 breads and 7 cheeses: buying 13 + 6 costs 19; 8 would cost 22.",
    "One hamburger comes from the stock, and a second would cost 300.",
  ],
  testInputs: ["BBC\n1 10 1\n1 10 1\n21\n", "BSC\n1 1 1\n100 100 100\n1\n", "B\n1 1 1\n1 1 1\n1000000000000\n", "SSSSSSSSSS\n100 100 100\n100 100 100\n1\n", "BSSCCC\n100 100 100\n1 2 3\n1000000000000\n", "C\n100 100 1\n100 100 100\n99\n"],
  sol: `string s;cin>>s;long long nb,ns,nc,pb,ps,pc,r;cin>>nb>>ns>>nc>>pb>>ps>>pc>>r;long long cb=count(s.begin(),s.end(),'B'),cs=count(s.begin(),s.end(),'S'),cc=count(s.begin(),s.end(),'C');
auto cost=[&](long long x){return max(0LL,x*cb-nb)*pb+max(0LL,x*cs-ns)*ps+max(0LL,x*cc-nc)*pc;};
long long lo=0,hi=2000000000001LL;while(hi-lo>1){long long m=(lo+hi)/2;if(cost(m)<=r)lo=m;else hi=m;}cout<<lo<<"\\n";`,
  wrongNote: "Capping the search at 10^9 cannot return the larger answers a huge budget allows; ignoring the stock in the kitchen pays for ingredients that are already there.",
  wrong: [
    `string s;cin>>s;long long nb,ns,nc,pb,ps,pc,r;cin>>nb>>ns>>nc>>pb>>ps>>pc>>r;long long cb=count(s.begin(),s.end(),'B'),cs=count(s.begin(),s.end(),'S'),cc=count(s.begin(),s.end(),'C');
auto cost=[&](long long x){return max(0LL,x*cb-nb)*pb+max(0LL,x*cs-ns)*ps+max(0LL,x*cc-nc)*pc;};
long long lo=0,hi=1000000001LL;while(hi-lo>1){long long m=(lo+hi)/2;if(cost(m)<=r)lo=m;else hi=m;}cout<<lo<<"\\n";`,
    `string s;cin>>s;long long nb,ns,nc,pb,ps,pc,r;cin>>nb>>ns>>nc>>pb>>ps>>pc>>r;long long cb=count(s.begin(),s.end(),'B'),cs=count(s.begin(),s.end(),'S'),cc=count(s.begin(),s.end(),'C');
auto cost=[&](long long x){return x*cb*pb+x*cs*ps+x*cc*pc;};
long long lo=0,hi=2000000000001LL;while(hi-lo>1){long long m=(lo+hi)/2;if(cost(m)<=r)lo=m;else hi=m;}cout<<lo<<"\\n";`,
  ],
  gen: (r) => line(Array.from({ length: 1 }, () => r.str(r.int(1, 5), "BSC"))) + "\n" + line(r.ints(3, 1, 6)) + "\n" + line(r.ints(3, 1, 5)) + "\n" + r.int(1, 60) + "\n",
  slow: [`string s;cin>>s;long long nb,ns,nc,pb,ps,pc,r;cin>>nb>>ns>>nc>>pb>>ps>>pc>>r;long long cb=count(s.begin(),s.end(),'B'),cs=count(s.begin(),s.end(),'S'),cc=count(s.begin(),s.end(),'C');
auto cost=[&](long long x){return max(0LL,x*cb-nb)*pb+max(0LL,x*cs-ns)*ps+max(0LL,x*cc-nc)*pc;};
long long x=0;while(cost(x+1)<=r)++x;cout<<x<<"\\n";`],
  big: [
    { seed: 1, note: "a cheap one-letter recipe and a huge budget: counting one by one is far too slow", code: `return "B\\n1 1 1\\n1 1 1\\n1000000000000"` },
    { seed: 2, note: "a long recipe", code: `return text(r, 100, "BSC") + "\\n100 100 100\\n" + line(r.ints(3, 1, 100)) + "\\n" + str(r.int(10**11, 10**12))` },
  ],
});

P.push({
  id: "B596", judge: "hash-digit-sum-equals-length", topic: "data-structures", rating: 1600,
  tag: "Prefix sums and hashing", timeLimitMs: 1000,
  uz: "Yig‘indi uzunlikka teng",
  en: "Sum equal to length",
  statementUz: "n ta raqamdan iborat qator berilgan, uning har bir belgisi 0 dan 9 gacha raqam. Ketma-ket bo‘lak yaxshi deyiladi, agar undagi raqamlar yig‘indisi bo‘lak uzunligiga teng bo‘lsa. Masalan, 120 qatorida 1, 20 va 120 bo‘laklari yaxshi. Qatorning nechta yaxshi bo‘lagi bor? Bir xil ko‘rinishdagi, lekin turli o‘rinlardagi bo‘laklar alohida sanaladi.",
  statementEn: "You are given a string of n digits, each character a digit from 0 to 9. A segment of consecutive characters is good if the sum of its digits equals its length. For example, in 120 the segments 1, 20 and 120 are good. How many good segments does the string have? Segments that look the same but sit at different places are counted separately.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida raqamlar qatori.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the string of digits.",
  outputUz: "Har bir test uchun alohida qatorda yaxshi bo‘laklar sonini chiqaring.",
  outputEn: "For each test case print the number of good segments on its own line.",
  constraintList: ["1 ≤ t ≤ 1000", "1 ≤ n ≤ 10^5, the sum of n over all tests ≤ 10^5", "the string consists of digits", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 1000", "1 ≤ n ≤ 10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 10^5", "qator raqamlardan iborat", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n4\n1201\n3\n111\n2\n90\n"],
  expect: ["6\n6\n0\n"],
  sampleNotesUz: [
    "1201 da: ikkala 1, 20, 120, 201 va 1201 — 6 ta. 111 ning har bir bo‘lagi yaxshi. 90 da yaxshi bo‘lak yo‘q.",
  ],
  sampleNotesEn: [
    "In 1201: both 1s, 20, 120, 201 and 1201 — 6 segments. Every segment of 111 is good. 90 has none.",
  ],
  testInputs: ["3\n4\n1201\n3\n111\n2\n90\n", "1\n1\n0\n", "1\n1\n1\n", "1\n6\n600005\n", "1\n10\n0200110011\n"],
  sol: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;unordered_map<long long,long long>c;c.reserve(2*n+2);long long p=0,ans=0;c[0]=1;
for(char ch:s){p+=ch-'0'-1;ans+=c[p]++;}cout<<ans<<"\\n";}`,
  wrongNote: "Forgetting the empty prefix misses every good segment that starts at the first character; counting segments whose sum stays within the length counts far too many.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;unordered_map<long long,long long>c;long long p=0,ans=0;
for(char ch:s){p+=ch-'0'-1;ans+=c[p]++;}cout<<ans<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;long long ans=0;for(int i=0;i<n;++i){long long sum=0;for(int j=i;j<n&&j<i+2;++j){sum+=s[j]-'0';if(sum<=j-i+1)++ans;}}cout<<ans<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 10); return n + "\n" + r.str(n, "0112") + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;string s;cin>>n>>s;long long ans=0;for(int i=0;i<n;++i){long long sum=0;for(int j=i;j<n;++j){sum+=s[j]-'0';if(sum==j-i+1)++ans;}}cout<<ans<<"\\n";}`],
  big: [
    { seed: 1, note: "all ones: every one of 5·10^9 segments is good", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + "1" * n` },
    { seed: 2, note: "digits 0, 1, 2", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "012")` },
  ],
});

P.push({
  id: "B597", judge: "dp-fill-array-adjacent-diff", topic: "dynamic-programming", rating: 1600,
  tag: "Counting DP", timeLimitMs: 2000,
  uz: "Massivni to‘ldirish",
  en: "Filling in the array",
  statementUz: "n ta butun sondan iborat massiv bo‘lgan, uning har bir elementi 1 dan m gacha, va har ikki qo‘shni element ko‘pi bilan 1 ga farq qilgan. Ba'zi elementlar o‘chib ketgan va 0 bilan almashtirilgan. O‘chgan elementlarni shunday tiklashning nechta usuli bor, natijada massiv yana shu shartlarni qanoatlantirsin? Javobni 10^9 + 7 ga bo‘lgandagi qoldiqni chiqaring.",
  statementEn: "There was an array of n integers in which every element was between 1 and m and every two neighbouring elements differed by at most 1. Some elements have been erased and replaced by 0. In how many ways can the erased elements be restored so that the array satisfies those conditions again? Print the answer modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda n ta son keladi; 0 — o‘chgan element.",
  inputEn: "The first line contains n and m. The second line contains the n numbers; 0 marks an erased element.",
  outputUz: "Yagona butun sonni chiqaring — usullar soni modulo 10^9 + 7.",
  outputEn: "Print a single integer — the number of ways modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 100", "0 ≤ x_i ≤ m", "the known elements may already break the rule, giving 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 100", "0 ≤ x_i ≤ m", "ma'lum elementlar shartni allaqachon buzgan bo‘lishi mumkin — unda javob 0"],
  sampleInputs: ["3 5\n2 0 2\n", "4 3\n0 0 0 0\n", "3 4\n1 0 4\n"],
  expect: ["3\n", "41\n", "0\n"],
  sampleNotesUz: [
    "O‘rtadagi element 1, 2 yoki 3 bo‘lishi mumkin.",
    "1 dan 3 gacha qiymatli, qo‘shnilari ko‘pi bilan 1 ga farq qiladigan 4 uzunlikdagi massivlar soni 41.",
    "1 va 4 ning ikkalasiga ham yaqin qiymat yo‘q.",
  ],
  sampleNotesEn: [
    "The middle element can be 1, 2 or 3.",
    "There are 41 arrays of length 4 with values from 1 to 3 whose neighbours differ by at most 1.",
    "No value is within 1 of both 1 and 4.",
  ],
  testInputs: ["3 5\n2 0 2\n", "4 3\n0 0 0 0\n", "3 4\n1 0 4\n", "1 100\n0\n", "1 5\n3\n", "2 5\n1 3\n", "5 2\n0 0 0 0 0\n", "6 4\n0 2 0 0 4 0\n"],
  sol: `const int M=1000000007;int n,m;cin>>n>>m;vector<int>x(n);for(auto&v:x)cin>>v;vector<int>d(m+2,0),e(m+2,0);
for(int v=1;v<=m;++v)d[v]=(x[0]==0||x[0]==v);
for(int i=1;i<n;++i){for(int v=1;v<=m;++v){if(x[i]&&x[i]!=v){e[v]=0;continue;}int s=d[v-1]+d[v];if(s>=M)s-=M;s+=d[v+1];if(s>=M)s-=M;e[v]=s;}swap(d,e);}
long long s=0;for(int v=1;v<=m;++v)s+=d[v];cout<<s%M<<"\\n";`,
  wrongNote: "Letting an erased first element be only 1 drops every array that starts higher; ignoring the known values beyond the first counts arrays that disagree with them.",
  wrong: [
    `const long long M=1000000007;int n,m;cin>>n>>m;vector<int>x(n);for(auto&v:x)cin>>v;vector<long long>d(m+2,0);
for(int v=1;v<=m;++v)d[v]=(x[0]==0?v==1:x[0]==v);
for(int i=1;i<n;++i){vector<long long>e(m+2,0);for(int v=1;v<=m;++v){if(x[i]&&x[i]!=v)continue;e[v]=(d[v-1]+d[v]+d[v+1])%M;}d=e;}
long long s=0;for(int v=1;v<=m;++v)s=(s+d[v])%M;cout<<s<<"\\n";`,
    `const long long M=1000000007;int n,m;cin>>n>>m;vector<int>x(n);for(auto&v:x)cin>>v;vector<long long>d(m+2,0);
for(int v=1;v<=m;++v)d[v]=(x[0]==0||x[0]==v);
for(int i=1;i<n;++i){vector<long long>e(m+2,0);for(int v=1;v<=m;++v)e[v]=(d[v-1]+d[v]+d[v+1])%M;d=e;}
long long s=0;for(int v=1;v<=m;++v)s=(s+d[v])%M;cout<<s<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7), m = r.int(1, 4); return line([n, m]) + "\n" + line(Array.from({ length: n }, () => (r.int(0, 2) ? 0 : r.int(1, m)))) + "\n"; },
  brute: `int n,m;cin>>n>>m;vector<int>x(n);for(auto&v:x)cin>>v;vector<int>a(n);long long c=0;
function<void(int)>go=[&](int i){if(i==n){++c;return;}for(int v=1;v<=m;++v){if(x[i]&&x[i]!=v)continue;if(i&&abs(v-a[i-1])>1)continue;a[i]=v;go(i+1);}};go(0);cout<<c%1000000007<<"\\n";`,
  big: [
    { seed: 1, note: "10^5 erased elements, m = 100", code: `n = 100000\nreturn line([n, 100]) + "\\n" + line([0] * n)` },
    { seed: 2, note: "some known values", code: `n = 100000\nx = [0] * n\nv = 50\nfor i in range(n):\n    v = max(1, min(100, v + r.int(-1, 1)))\n    if r.int(0, 9) == 0:\n        x[i] = v\nreturn line([n, 100]) + "\\n" + line(x)` },
  ],
});

P.push({
  id: "B598", judge: "math-largest-pair-gcd", topic: "math", rating: 1600,
  tag: "Number theory", timeLimitMs: 1000,
  uz: "Eng katta umumiy bo‘luvchi",
  en: "The largest common divisor",
  statementUz: "n ta musbat butun sondan iborat massiv berilgan. Massivdan turli o‘rinlardagi ikkita elementni tanlab, ularning eng katta umumiy bo‘luvchisini (EKUB) hisoblaymiz. Shu qiymatning eng kattasini toping. Ikki element qiymati teng bo‘lishi mumkin — unda ularning EKUBi shu qiymatning o‘zi.",
  statementEn: "You are given an array of n positive integers. Choose two elements at different positions and compute their greatest common divisor. Find the largest value this can take. The two elements may have equal values — then their greatest common divisor is that value itself.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Yagona butun sonni chiqaring — eng katta EKUB.",
  outputEn: "Print a single integer — the largest greatest common divisor.",
  constraintList: ["2 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^6", "the two positions must differ", "values may repeat"],
  constraintListUz: ["2 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^6", "ikki o‘rin turlicha bo‘lishi kerak", "qiymatlar takrorlanishi mumkin"],
  sampleInputs: ["5\n3 14 15 7 9\n", "2\n5 5\n"],
  expect: ["7\n", "5\n"],
  sampleNotesUz: [
    "EKUB(14, 7) = 7; boshqa juftliklar 3 dan oshmaydi.",
    "Ikkala element ham 5.",
  ],
  sampleNotesEn: [
    "gcd(14, 7) = 7; no other pair gets above 3.",
    "Both elements are 5.",
  ],
  testInputs: ["5\n3 14 15 7 9\n", "2\n5 5\n", "2\n1 1000000\n", "3\n1000000 500000 999999\n", "4\n6 10 15 7\n", "5\n12 18 8 27 30\n"],
  sol: `int n;cin>>n;const int V=1000000;vector<int>c(V+1,0);for(int i=0;i<n;++i){int a;cin>>a;c[a]++;}
for(int g=V;g>=1;--g){int k=0;for(int x=g;x<=V&&k<2;x+=g)k+=c[x];if(k>=2){cout<<g<<"\\n";break;}}`,
  wrongNote: "Comparing neighbours after sorting misses pairs that are far apart in value; letting a single element count as a pair returns the largest element.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long b=0;for(int i=1;i<n;++i)b=max(b,__gcd(a[i],a[i-1]));cout<<b<<"\\n";`,
    `int n;cin>>n;const int V=1000000;vector<int>c(V+1,0);for(int i=0;i<n;++i){int a;cin>>a;c[a]++;}
for(int g=V;g>=1;--g){int k=0;for(int x=g;x<=V&&k<1;x+=g)k+=c[x];if(k>=1){cout<<g<<"\\n";break;}}`,
  ],
  gen: (r) => { const n = r.int(2, 8); return n + "\n" + line(r.ints(n, 1, 40)) + "\n"; },
  slow: [`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long b=0;for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)b=max(b,__gcd(a[i],a[j]));cout<<b<<"\\n";`],
  big: [
    { seed: 1, note: "2·10^5 random values", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 10**6))` },
    { seed: 2, note: "pairwise coprime-ish: primes and 1s", code: `n = 200000\nreturn str(n) + "\\n" + line([1] * (n - 2) + [999983, 999979])` },
  ],
});

P.push({
  id: "B599", judge: "greedy-set-or-decrease", topic: "greedy", rating: 1600,
  tag: "Sorting and prefix sums", timeLimitMs: 1000,
  uz: "Tenglashtirish yoki kamaytirish",
  en: "Set or decrease",
  statementUz: "n ta butun sondan iborat massiv va k soni berilgan. Bitta amalda ikkisidan birini qilasiz: biror a_i ni 1 ga kamaytirasiz, yoki biror a_i ni boshqa a_j ga tenglashtirasiz (a_i := a_j). Elementlar manfiy bo‘lib ketishi mumkin. Massiv elementlari yig‘indisi k dan oshmasligi uchun eng kami bilan nechta amal kerak?",
  statementEn: "You are given an array of n integers and a number k. In one operation you do one of two things: decrease some a_i by 1, or set some a_i equal to another a_j (a_i := a_j). Elements are allowed to become negative. What is the smallest number of operations after which the sum of the array is at most k?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n va k, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n and k, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda amallarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of operations on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ k ≤ 10^15; 1 ≤ a_i ≤ 10^9", "elements may become negative"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ k ≤ 10^15; 1 ≤ a_i ≤ 10^9", "elementlar manfiy bo‘lishi mumkin"],
  sampleInputs: ["3\n1 5\n8\n3 6\n1 5 5\n4 3\n2 2 2 2\n"],
  expect: ["3\n2\n4\n"],
  sampleNotesUz: [
    "Birinchi testda 8 ni uch marta kamaytiramiz. Ikkinchi testda ikkala 5 ni 1 ga tenglashtirsak, yig‘indi 3. Uchinchi testda birinchi 2 ni ikki marta kamaytirib 0 qilamiz va ikkita boshqa elementni unga tenglashtiramiz: 0 + 0 + 0 + 2 = 2.",
  ],
  sampleNotesEn: [
    "In the first test decrease the 8 three times. In the second, setting both 5s to 1 leaves a sum of 3. In the third, decrease one 2 twice to 0 and set two other elements to it: 0 + 0 + 0 + 2 = 2.",
  ],
  testInputs: ["3\n1 5\n8\n3 6\n1 5 5\n4 3\n2 2 2 2\n", "1\n1 1000000000000000\n1000000000\n", "1\n5 1\n1000000000 1000000000 1000000000 1000000000 1000000000\n", "1\n7 8\n1 2 1 3 1 2 1\n", "1\n10 1\n1 2 3 1 2 6 1 6 8 10\n"],
  sol: `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());vector<long long>p(n+1,0);for(int i=0;i<n;++i)p[i+1]=p[i]+a[i];
long long best=LLONG_MAX;for(int y=0;y<n;++y){long long need=p[n-y]+(long long)y*a[0]-k;long long x=need<=0?0:(need+y)/(y+1);best=min(best,x+y);}
cout<<best<<"\\n";}`,
  wrongNote: "Only ever decreasing never uses the cheap way to bring a large element down; rounding the needed decrease down leaves the sum just above k.",
  wrong: [
    `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;long long s=0;for(int i=0;i<n;++i){long long x;cin>>x;s+=x;}cout<<max(0LL,s-k)<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());vector<long long>p(n+1,0);for(int i=0;i<n;++i)p[i+1]=p[i]+a[i];
long long best=LLONG_MAX;for(int y=0;y<n;++y){long long need=p[n-y]+(long long)y*a[0]-k;long long x=need<=0?0:need/(y+1);best=min(best,x+y);}
cout<<best<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 6); return line([n, r.int(1, 25)]) + "\n" + line(r.ints(n, 1, 9)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long best=LLONG_MAX;
for(int y=0;y<n;++y)for(long long x=0;x<=200;++x){long long s=0;for(int i=0;i<n-y;++i)s+=a[i];s-=x;s+=(long long)y*(a[0]-x);if(s<=k){best=min(best,x+y);break;}}
cout<<best<<"\\n";}`,
  big: [
    { seed: 1, note: "one long test with a tight k", code: `n = 200000\nreturn "1\\n" + line([n, 10**6]) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

export default P;
