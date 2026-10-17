/* Batch 565 — six problems at 1300, B565–B570.
 *
 * Each is a well-known contest problem restated for AlgoYo'l in our own words,
 * with our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B565", judge: "sort-reverse-one-segment", topic: "sorting", rating: 1300,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Bitta bo‘lakni teskari qilib tartiblash",
  en: "Sorting by reversing one segment",
  statementUz: "n ta turli butun sondan iborat massiv berilgan. Siz aynan bitta amal bajarasiz: massivning biror [l, r] bo‘lagini (1 ≤ l ≤ r ≤ n) tanlab, undagi elementlar tartibini teskarisiga o‘zgartirasiz. Shundan keyin massiv o‘sish tartibida bo‘lishi mumkinmi? Agar mumkin bo‘lsa, l va r ni chiqaring. Massiv allaqachon tartiblangan bo‘lsa, 1 1 deb javob bering — bitta elementli bo‘lakni teskari qilish hech narsani o‘zgartirmaydi. Elementlar turli bo‘lgani uchun boshqa hollarda mos bo‘lak yagona.",
  statementEn: "You are given an array of n distinct integers. You make exactly one operation: choose a segment [l, r] of the array (1 ≤ l ≤ r ≤ n) and reverse the order of its elements. Can the array be in increasing order afterwards? If it can, print l and r. If the array is sorted already, answer 1 1 — reversing a one-element segment changes nothing. Since the elements are distinct, in every other case the segment that works is unique.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta turli son a_1, …, a_n keladi.",
  inputEn: "The first line contains n. The second line contains the n distinct numbers a_1, …, a_n.",
  outputUz: "Agar mumkin bo‘lsa, birinchi qatorda YES, ikkinchi qatorda l va r ni chiqaring. Aks holda NO chiqaring.",
  outputEn: "If it can be done, print YES on the first line and l and r on the second. Otherwise print NO.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "all a_i are distinct", "exactly one segment is reversed"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "barcha a_i lar turli", "aynan bitta bo‘lak teskari qilinadi"],
  sampleInputs: ["5\n1 4 3 2 5\n", "4\n3 1 2 4\n", "3\n1 2 3\n"],
  expect: ["YES\n2 4\n", "NO\n", "YES\n1 1\n"],
  sampleNotesUz: [
    "4 3 2 bo‘lagini teskari qilsak, 1 2 3 4 5 hosil bo‘ladi.",
    "Tartiblangan massivdan farq qiladigan o‘rinlar 1 dan 3 gacha, lekin 3 1 2 ni teskari qilsak 2 1 3 bo‘ladi.",
    "Massiv allaqachon tartiblangan.",
  ],
  sampleNotesEn: [
    "Reversing 4 3 2 gives 1 2 3 4 5.",
    "The positions that differ from the sorted array are 1 to 3, but reversing 3 1 2 gives 2 1 3.",
    "The array is sorted already.",
  ],
  testInputs: ["5\n1 4 3 2 5\n", "4\n3 1 2 4\n", "3\n1 2 3\n", "1\n5\n", "2\n2 1\n", "6\n6 5 4 3 2 1\n", "6\n1 5 4 3 2 6\n", "6\n2 1 4 3 6 5\n", "5\n1 2 5 4 3\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>b=a;sort(b.begin(),b.end());
int l=0;while(l<n&&a[l]==b[l])++l;if(l==n){cout<<"YES\\n1 1\\n";return 0;}
int r=n-1;while(a[r]==b[r])--r;reverse(a.begin()+l,a.begin()+r+1);
if(a==b)cout<<"YES\\n"<<l+1<<" "<<r+1<<"\\n";else cout<<"NO\\n";`,
  wrongNote: "Refusing an array that is already sorted forgets that a one-element segment may be reversed; reversing the first falling run without checking the rest accepts arrays that stay unsorted.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>b=a;sort(b.begin(),b.end());
int l=0;while(l<n&&a[l]==b[l])++l;if(l==n){cout<<"NO\\n";return 0;}
int r=n-1;while(a[r]==b[r])--r;reverse(a.begin()+l,a.begin()+r+1);
if(a==b)cout<<"YES\\n"<<l+1<<" "<<r+1<<"\\n";else cout<<"NO\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int l=0;while(l+1<n&&a[l]<a[l+1])++l;if(l+1>=n){cout<<"YES\\n1 1\\n";return 0;}
int r=l;while(r+1<n&&a[r]>a[r+1])++r;cout<<"YES\\n"<<l+1<<" "<<r+1<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7); const a = r.perm(n); if (r.int(0, 1)) { a.sort((x, y) => x - y); const l = r.int(0, n - 1), rr = r.int(l, n - 1); const s = a.slice(l, rr + 1).reverse(); a.splice(l, s.length, ...s); } return n + "\n" + line(a) + "\n"; },
  brute: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int l=0;l<n;++l)for(int r=l;r<n;++r){vector<long long>b=a;reverse(b.begin()+l,b.begin()+r+1);if(is_sorted(b.begin(),b.end())){cout<<"YES\\n"<<l+1<<" "<<r+1<<"\\n";return 0;}}
cout<<"NO\\n";`,
  slow: [`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>b=a;
for(int i=0;i<n;++i)for(int j=0;j+1<n-i;++j)if(b[j]>b[j+1])swap(b[j],b[j+1]);
int l=0;while(l<n&&a[l]==b[l])++l;if(l==n){cout<<"YES\\n1 1\\n";return 0;}
int r=n-1;while(a[r]==b[r])--r;reverse(a.begin()+l,a.begin()+r+1);
if(a==b)cout<<"YES\\n"<<l+1<<" "<<r+1<<"\\n";else cout<<"NO\\n";`],
  big: [
    { seed: 1, note: "a long reversed middle", code: `n = 100000\na = list(range(1, n + 1))\na[100:n - 100] = a[100:n - 100][::-1]\nreturn str(n) + "\\n" + line(a)` },
    { seed: 2, note: "random distinct values", code: `n = 100000\na = r.shuffle(list(range(1, 10**9, 9973)))[:n]\nreturn str(n) + "\\n" + line(a)` },
  ],
});

P.push({
  id: "B566", judge: "dp-ribbon-max-pieces", topic: "dynamic-programming", rating: 1300,
  tag: "DP", timeLimitMs: 1000,
  uz: "Lentani kesish",
  en: "Cutting the ribbon",
  statementUz: "Uzunligi n bo‘lgan lenta bor. Uni bo‘laklarga kesish kerak, shunday qilib har bir bo‘lakning uzunligi a, b yoki c ga teng bo‘lsin va lentadan hech narsa ortib qolmasin. Bunday kesishlar ichida bo‘laklar soni eng ko‘p bo‘ladiganini toping va shu sonni chiqaring. Kamida bitta to‘g‘ri kesish mavjudligi kafolatlanadi. Bo‘laklar uzunligi a, b, c dan istalgan birini istalgancha marta olishi mumkin.",
  statementEn: "There is a ribbon of length n. It has to be cut into pieces so that every piece has length a, b or c and nothing of the ribbon is left over. Among all such cuttings find the one with the largest number of pieces and print that number. At least one valid cutting is guaranteed to exist. Any of the lengths a, b and c may be used any number of times.",
  inputUz: "Yagona qatorda to‘rtta butun son n, a, b va c beriladi.",
  inputEn: "A single line contains four integers n, a, b and c.",
  outputUz: "Yagona butun sonni chiqaring — bo‘laklarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of pieces.",
  constraintList: ["1 ≤ n, a, b, c ≤ 4000", "a, b and c need not be different", "at least one valid cutting exists", "the whole ribbon must be used"],
  constraintListUz: ["1 ≤ n, a, b, c ≤ 4000", "a, b va c turli bo‘lishi shart emas", "kamida bitta to‘g‘ri kesish mavjud", "butun lenta ishlatilishi kerak"],
  sampleInputs: ["7 5 2 3\n", "17 3 5 11\n"],
  expect: ["3\n", "5\n"],
  sampleNotesUz: [
    "7 = 2 + 2 + 3 — uchta bo‘lak. 5 + 2 esa faqat ikkita.",
    "17 = 5 + 3 + 3 + 3 + 3 — beshta bo‘lak; 11 + 3 + 3 faqat uchta beradi.",
  ],
  sampleNotesEn: [
    "7 = 2 + 2 + 3 gives three pieces, while 5 + 2 gives only two.",
    "17 = 5 + 3 + 3 + 3 + 3 gives five pieces; 11 + 3 + 3 gives only three.",
  ],
  testInputs: ["7 5 2 3\n", "17 3 5 11\n", "1 1 1 1\n", "4000 1 2 3\n", "4000 3999 1 4000\n", "4000 7 11 13\n", "10 4 6 9\n", "3999 2 2 3\n"],
  sol: `int n,a,b,c;cin>>n>>a>>b>>c;vector<int>d(n+1,-1);d[0]=0;
for(int i=1;i<=n;++i)for(int x:{a,b,c})if(i>=x&&d[i-x]>=0)d[i]=max(d[i],d[i-x]+1);
cout<<d[n]<<"\\n";`,
  wrongNote: "Treating a length that cannot be cut as zero pieces lets the ribbon be cut with something left over; forgetting the third length loses every cutting that needs it.",
  wrong: [
    `int n,a,b,c;cin>>n>>a>>b>>c;vector<int>d(n+1,0);
for(int i=1;i<=n;++i)for(int x:{a,b,c})if(i>=x)d[i]=max(d[i],d[i-x]+1);
cout<<d[n]<<"\\n";`,
    `int n,a,b,c;cin>>n>>a>>b>>c;vector<int>d(n+1,-1);d[0]=0;
for(int i=1;i<=n;++i)for(int x:{a,b})if(i>=x&&d[i-x]>=0)d[i]=max(d[i],d[i-x]+1);
cout<<d[n]<<"\\n";`,
  ],
  gen: (r) => { for (;;) { const n = r.int(1, 40), a = r.int(1, 12), b = r.int(1, 12), c = r.int(1, 12); let ok = false; for (let x = 0; x * a <= n && !ok; x++) for (let y = 0; x * a + y * b <= n && !ok; y++) if ((n - x * a - y * b) % c === 0) ok = true; if (ok) return line([n, a, b, c]) + "\n"; } },
  brute: `int n,a,b,c;cin>>n>>a>>b>>c;int best=-1;
for(int x=0;x*a<=n;++x)for(int y=0;x*a+y*b<=n;++y){int rest=n-x*a-y*b;if(rest%c==0)best=max(best,x+y+rest/c);}
cout<<best<<"\\n";`,
});

P.push({
  id: "B567", judge: "str-make-power-of-two", topic: "strings", rating: 1300,
  tag: "Subsequences", timeLimitMs: 1000,
  uz: "Ikkining darajasini yasash",
  en: "Making a power of two",
  statementUz: "Sizga boshida nol bo‘lmagan butun n soni berilgan. Bitta amalda siz yo uning istalgan bitta raqamini o‘chirasiz, yo uning o‘ng tomoniga istalgan bitta raqam yozasiz. Raqamlarning o‘rnini almashtirib bo‘lmaydi; amallar orasida son vaqtincha boshida nol bilan yoki bo‘sh bo‘lib qolishi mumkin. Oxirida boshida nol bo‘lmagan, ikkining darajasi bo‘lgan son (1, 2, 4, 8, 16, …) hosil bo‘lishi kerak. Buning uchun eng kami bilan nechta amal kerak?",
  statementEn: "You are given an integer n with no leading zero. In one operation you either erase any one of its digits or write any one digit at its right end. Digits cannot be moved; between operations the number may for a while have a leading zero or be empty. In the end it must be a power of two (1, 2, 4, 8, 16, …) written without leading zeros. What is the smallest number of operations needed?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Keyingi t ta qatorning har birida bitta n soni keladi.",
  inputEn: "The first line contains the number of test cases t. Each of the next t lines contains one number n.",
  outputUz: "Har bir test uchun alohida qatorda amallarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of operations on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^9", "a digit can only be added at the right end", "the result must not start with 0"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^9", "raqam faqat o‘ng tomonga yoziladi", "natija 0 bilan boshlanmasligi kerak"],
  sampleInputs: ["4\n1052\n8888\n6\n128\n"],
  expect: ["2\n3\n1\n0\n"],
  sampleNotesUz: [
    "1052 dan 5 ni o‘chirib, oxiriga 4 yozamiz: 1024. 8888 dan uchta 8 ni o‘chiramiz. 6 ning oxiriga 4 yozilsa, 64. 128 allaqachon ikkining darajasi.",
  ],
  sampleNotesEn: [
    "From 1052 erase the 5 and write a 4 at the end: 1024. From 8888 erase three 8s. Writing a 4 after 6 gives 64. 128 is a power of two already.",
  ],
  testInputs: ["4\n1052\n8888\n6\n128\n", "1\n214748364\n", "1\n1000000000\n", "3\n3\n5\n9\n", "3\n301\n4096\n999999999\n", "2\n1\n77\n"],
  sol: `vector<string>pw;for(int e=0;e<=62;++e)pw.push_back(to_string(1LL<<e));
int t;cin>>t;while(t--){string s;cin>>s;int best=INT_MAX;
for(auto&p:pw){size_t k=0;for(char c:s)if(k<p.size()&&c==p[k])++k;best=min(best,(int)(s.size()-k+p.size()-k));}
cout<<best<<"\\n";}`,
  wrongNote: "Stopping at 2^30 never considers the larger powers some numbers are one digit away from; insisting that a whole power appear inside n ignores that digits can be added at the end.",
  wrong: [
    `vector<string>pw;for(int e=0;e<=30;++e)pw.push_back(to_string(1LL<<e));
int t;cin>>t;while(t--){string s;cin>>s;int best=INT_MAX;
for(auto&p:pw){size_t k=0;for(char c:s)if(k<p.size()&&c==p[k])++k;best=min(best,(int)(s.size()-k+p.size()-k));}
cout<<best<<"\\n";}`,
    `vector<string>pw;for(int e=0;e<=62;++e)pw.push_back(to_string(1LL<<e));
int t;cin>>t;while(t--){string s;cin>>s;int best=s.size()+1;
for(auto&p:pw){size_t k=0;for(char c:s)if(k<p.size()&&c==p[k])++k;if(k==p.size())best=min(best,(int)(s.size()-k));}
cout<<best<<"\\n";}`,
  ],
  gen: (r) => tests(r, 5, (r) => r.int(1, 999) + "\n"),
  brute: `auto isPow=[](const string&s){if(s.empty()||s[0]=='0'||s.size()>19)return false;unsigned long long v=stoull(s);return (v&(v-1))==0;};
int t;cin>>t;while(t--){string s;cin>>s;map<string,int>d;deque<string>q;d[s]=0;q.push_back(s);int ans=-1;
while(!q.empty()){string u=q.front();q.pop_front();int du=d[u];if(isPow(u)){ans=du;break;}if(u.size()>8)continue;
 vector<string>nx;for(size_t i=0;i<u.size();++i)nx.push_back(u.substr(0,i)+u.substr(i+1));for(char c='0';c<='9';++c)nx.push_back(u+c);
 for(auto&v:nx)if(!d.count(v)){d[v]=du+1;q.push_back(v);}}
cout<<ans<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 numbers of nine or ten digits", code: `return "10000\\n" + "\\n".join(str(r.int(10**8, 10**9)) for _ in range(10000))` },
  ],
});

P.push({
  id: "B568", judge: "math-number-spiral-cell", topic: "math", rating: 1300,
  tag: "Formulas", timeLimitMs: 1000,
  uz: "Sonlar spirali",
  en: "The number spiral",
  statementUz: "Cheksiz jadvalga sonlar qatlam-qatlam yozilgan; qatorlar yuqoridan, ustunlar chapdan 1 dan raqamlangan. k-qatlam — max(qator, ustun) = k bo‘lgan kataklar, ularga (k − 1)² + 1 dan k² gacha sonlar ketma-ket yoziladi. Toq k da yozish (k, 1) katakdan boshlanib, k-qator bo‘ylab o‘ngga (k, k) gacha, so‘ng k-ustun bo‘ylab yuqoriga (1, k) gacha boradi. Juft k da esa (1, k) dan boshlanib, k-ustun bo‘ylab pastga (k, k) gacha, so‘ng k-qator bo‘ylab chapga (k, 1) gacha boradi. y-qator va x-ustundagi sonni toping.",
  statementEn: "Numbers are written into an infinite table layer by layer; rows are numbered from the top and columns from the left, both starting at 1. Layer k consists of the cells with max(row, column) = k, and the numbers (k − 1)² + 1 to k² are written into it in order. For odd k the writing starts at cell (k, 1), runs right along row k to (k, k) and then up column k to (1, k). For even k it starts at (1, k), runs down column k to (k, k) and then left along row k to (k, 1). Find the number in row y and column x.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida y va x sonlari keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains y and x.",
  outputUz: "Har bir so‘rov uchun alohida qatorda katakdagi sonni chiqaring.",
  outputEn: "For each query print the number in that cell on its own line.",
  constraintList: ["1 ≤ t ≤ 10^5", "1 ≤ y, x ≤ 10^9", "y is the row and x the column", "the answer can be close to 10^18"],
  constraintListUz: ["1 ≤ t ≤ 10^5", "1 ≤ y, x ≤ 10^9", "y — qator, x — ustun", "javob 10^18 ga yaqin bo‘lishi mumkin"],
  sampleInputs: ["4\n2 3\n1 1\n4 2\n1 5\n"],
  expect: ["8\n1\n15\n25\n"],
  sampleNotesUz: [
    "Jadvalning boshi: 1-qator 1 2 9 10 25; 2-qator 4 3 8 11 24; 3-qator 5 6 7 12 23; 4-qator 16 15 14 13 22; 5-qator 17 18 19 20 21. (2, 3) da 8, (4, 2) da 15, (1, 5) da 25.",
  ],
  sampleNotesEn: [
    "The corner of the table reads: row 1 is 1 2 9 10 25; row 2 is 4 3 8 11 24; row 3 is 5 6 7 12 23; row 4 is 16 15 14 13 22; row 5 is 17 18 19 20 21. Cell (2, 3) holds 8, (4, 2) holds 15 and (1, 5) holds 25.",
  ],
  testInputs: ["4\n2 3\n1 1\n4 2\n1 5\n", "1\n1000000000 1000000000\n", "4\n1000000000 1\n1 1000000000\n999999999 1\n1 999999999\n", "6\n2 1\n2 2\n1 2\n3 1\n3 3\n1 3\n", "3\n5 5\n6 6\n6 1\n"],
  sol: `int t;cin>>t;while(t--){long long y,x;cin>>y>>x;long long z=max(y,x),v;
if(z%2==0)v=(x==z)?(z-1)*(z-1)+y:z*z-x+1;else v=(y==z)?(z-1)*(z-1)+x:z*z-y+1;
cout<<v<<"\\n";}`,
  wrongNote: "Swapping the odd and even layers walks every layer the wrong way round; int arithmetic overflows long before row 10^9.",
  wrong: [
    `int t;cin>>t;while(t--){long long y,x;cin>>y>>x;long long z=max(y,x),v;
if(z%2==1)v=(x==z)?(z-1)*(z-1)+y:z*z-x+1;else v=(y==z)?(z-1)*(z-1)+x:z*z-y+1;
cout<<v<<"\\n";}`,
    `int t;cin>>t;while(t--){int y,x;cin>>y>>x;int z=max(y,x),v;
if(z%2==0)v=(x==z)?(z-1)*(z-1)+y:z*z-x+1;else v=(y==z)?(z-1)*(z-1)+x:z*z-y+1;
cout<<v<<"\\n";}`,
  ],
  gen: (r) => tests(r, 6, (r) => line([r.int(1, 12), r.int(1, 12)]) + "\n"),
  brute: `static long long g[31][31];
for(int k=1;k<=30;++k){long long v=(long long)(k-1)*(k-1)+1;if(k%2){for(int c=1;c<=k;++c)g[k][c]=v++;for(int rr=k-1;rr>=1;--rr)g[rr][k]=v++;}else{for(int rr=1;rr<=k;++rr)g[rr][k]=v++;for(int c=k-1;c>=1;--c)g[k][c]=v++;}}
int t;cin>>t;while(t--){int y,x;cin>>y>>x;cout<<g[y][x]<<"\\n";}`,
  big: [
    { seed: 1, note: "4·10^4 random cells far out", code: `t = 40000\nreturn str(t) + "\\n" + "\\n".join(line([r.int(1, 10**9), r.int(1, 10**9)]) for _ in range(t))` },
  ],
});

P.push({
  id: "B569", judge: "tree-bipartite-extra-edges", topic: "trees", rating: 1300,
  tag: "Bipartite graphs", timeLimitMs: 1000,
  uz: "Ikki bo‘lakligicha qolsin",
  en: "Keeping it bipartite",
  statementUz: "n ta uchdan iborat daraxt berilgan. Graf ikki bo‘lakli deyiladi, agar uning uchlarini ikki guruhga shunday ajratish mumkin bo‘lsaki, har bir qirra turli guruhlardagi uchlarni tutashtirsa. Daraxtga yangi qirralar qo‘shmoqchimiz, va graf ikki bo‘lakli bo‘lib qolishi hamda karrali qirralar va halqalar (uchni o‘zi bilan tutashtiruvchi qirra) bo‘lmasligi kerak. Eng ko‘pi bilan nechta qirra qo‘shish mumkin?",
  statementEn: "You are given a tree with n vertices. A graph is bipartite if its vertices can be split into two groups so that every edge joins vertices of different groups. We want to add new edges to the tree so that the graph stays bipartite and has no repeated edges and no loops (an edge from a vertex to itself). What is the largest number of edges that can be added?",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n − 1 ta qatorning har birida bitta qirraning uchlari u va v keladi.",
  inputEn: "The first line contains n. Each of the next n − 1 lines contains the endpoints u and v of one edge.",
  outputUz: "Yagona butun sonni chiqaring — qo‘shish mumkin bo‘lgan qirralarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of edges that can be added.",
  constraintList: ["1 ≤ n ≤ 10^5", "the edges form a tree", "no edge may be added twice or join a vertex to itself", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "qirralar daraxt hosil qiladi", "qirrani ikki marta qo‘shib yoki uchni o‘zi bilan tutashtirib bo‘lmaydi", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n1 2\n1 3\n", "5\n1 2\n2 3\n3 4\n4 5\n"],
  expect: ["0\n", "2\n"],
  sampleNotesUz: [
    "Guruhlar {1} va {2, 3}. Ular orasidagi har ikkala qirra allaqachon bor.",
    "Guruhlar {1, 3, 5} va {2, 4}: ular orasida 6 ta qirra bo‘lishi mumkin, 4 tasi bor — 1-4 va 2-5 ni qo‘shamiz.",
  ],
  sampleNotesEn: [
    "The groups are {1} and {2, 3}, and both edges between them already exist.",
    "The groups are {1, 3, 5} and {2, 4}: 6 edges can run between them and 4 exist, so 1-4 and 2-5 are added.",
  ],
  testInputs: ["3\n1 2\n1 3\n", "5\n1 2\n2 3\n3 4\n4 5\n", "1\n", "2\n2 1\n", "6\n1 2\n1 3\n1 4\n1 5\n1 6\n", "7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n"],
  sol: `int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>col(n+1,-1);col[1]=0;vector<int>st={1};long long c0=0,c1=0;
while(!st.empty()){int u=st.back();st.pop_back();(col[u]?c1:c0)++;for(int v:g[u])if(col[v]<0){col[v]=col[u]^1;st.push_back(v);}}
cout<<c0*c1-(n-1)<<"\\n";`,
  wrongNote: "Counting every edge the two groups allow forgets that the tree's own edges are already there; counting every missing edge of the whole graph breaks the two groups.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>col(n+1,-1);col[1]=0;vector<int>st={1};long long c0=0,c1=0;
while(!st.empty()){int u=st.back();st.pop_back();(col[u]?c1:c0)++;for(int v:g[u])if(col[v]<0){col[v]=col[u]^1;st.push_back(v);}}
cout<<c0*c1<<"\\n";`,
    `long long n;cin>>n;cout<<n*(n-1)/2-(n-1)<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 9); return n + "\n" + r.tree(n).map((e) => line(e)).join("\n") + (n > 1 ? "\n" : ""); },
  slow: [`int n;cin>>n;vector<set<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].insert(v);g[v].insert(u);}
vector<int>col(n+1,-1);col[1]=0;vector<int>st={1};while(!st.empty()){int u=st.back();st.pop_back();for(int v:g[u])if(col[v]<0){col[v]=col[u]^1;st.push_back(v);}}
long long c=0;for(int u=1;u<=n;++u)for(int v=u+1;v<=n;++v)if(col[u]!=col[v]&&!g[u].count(v))++c;cout<<c<<"\\n";`],
  big: [
    { seed: 1, note: "a random tree of 10^5 vertices", code: `n = 100000\nreturn str(n) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n))` },
    { seed: 2, note: "a path", code: `n = 100000\nreturn str(n) + "\\n" + "\\n".join(line(e) for e in tree_edges(r, n, "path"))` },
  ],
});

P.push({
  id: "B570", judge: "two-pointers-divisible-heights-window", topic: "two-pointers", rating: 1300,
  tag: "Sliding window", timeLimitMs: 1000,
  uz: "Mevali daraxtlar qatori",
  en: "A row of fruit trees",
  statementUz: "Qatorda n ta daraxt o‘sadi: i-daraxtning balandligi h_i, unda a_i ta meva bor. Siz ketma-ket turgan daraxtlar bo‘lagini [l, r] tanlaysiz. Bo‘lak to‘g‘ri bo‘lishi uchun l ≤ i < r bo‘lgan har bir i da h_i balandlik h_{i+1} ga qoldiqsiz bo‘linishi kerak, va bo‘lakdagi mevalarning umumiy soni k dan oshmasligi kerak. To‘g‘ri bo‘lakning eng katta uzunligini toping; hech bir daraxt ham to‘g‘ri bo‘lak bo‘la olmasa, 0 chiqaring.",
  statementEn: "n trees grow in a row: tree i has height h_i and carries a_i fruits. You choose a segment [l, r] of consecutive trees. The segment is valid if for every i with l ≤ i < r the height h_i is divisible by h_{i+1}, and the total number of fruits on the segment does not exceed k. Find the greatest length of a valid segment; if not even a single tree forms a valid segment, print 0.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test uch qatordan iborat: n va k; n ta son a_i; n ta son h_i.",
  inputEn: "The first line contains the number of test cases t. Each test case takes three lines: n and k; the n numbers a_i; the n numbers h_i.",
  outputUz: "Har bir test uchun alohida qatorda eng katta uzunlikni chiqaring.",
  outputEn: "For each test case print the greatest length on its own line.",
  constraintList: ["1 ≤ t ≤ 1000", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ k ≤ 10^9; 1 ≤ a_i, h_i ≤ 10^4", "h_i must be divisible by the next height, not the other way round"],
  constraintListUz: ["1 ≤ t ≤ 1000", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ k ≤ 10^9; 1 ≤ a_i, h_i ≤ 10^4", "h_i keyingi balandlikka bo‘linishi kerak, aksincha emas"],
  sampleInputs: ["3\n5 12\n3 2 4 4 1\n4 2 1 4 2\n1 5\n7\n1\n4 10\n1 2 3 4\n2 1 2 1\n"],
  expect: ["3\n0\n2\n"],
  sampleNotesUz: [
    "Birinchi testda 4, 2, 1 balandliklar ketma-ket bo‘linadi, mevalar 3 + 2 + 4 = 9 ≤ 12: uzunlik 3. Ikkinchi testda yagona daraxtdagi 7 ta meva 5 dan ko‘p. Uchinchi testda 1 ni 2 ga bo‘lib bo‘lmaydi, shuning uchun bo‘laklar ikki daraxtdan oshmaydi.",
  ],
  sampleNotesEn: [
    "In the first test the heights 4, 2, 1 divide one after another and carry 3 + 2 + 4 = 9 ≤ 12 fruits: length 3. In the second the single tree's 7 fruits exceed 5. In the third 1 is not divisible by 2, so no segment is longer than two trees.",
  ],
  testInputs: ["3\n5 12\n3 2 4 4 1\n4 2 1 4 2\n1 5\n7\n1\n4 10\n1 2 3 4\n2 1 2 1\n", "1\n4 100\n1 1 1 1\n8 4 2 1\n", "1\n4 2\n1 1 1 1\n8 4 2 1\n", "1\n5 6\n1 2 3 1 1\n6 6 3 3 1\n", "1\n3 1\n2 2 2\n1 1 1\n"],
  sol: `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;vector<long long>a(n),h(n);for(auto&x:a)cin>>x;for(auto&x:h)cin>>x;
int best=0,l=0;long long s=0;for(int r=0;r<n;++r){if(r>0&&h[r-1]%h[r]!=0){l=r;s=0;}s+=a[r];while(s>k){s-=a[l];++l;}best=max(best,r-l+1);}
cout<<best<<"\\n";}`,
  wrongNote: "Ignoring the heights treats every row of trees as one long stretch; testing whether the next height divides by the current one checks the condition backwards.",
  wrong: [
    `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;vector<long long>a(n),h(n);for(auto&x:a)cin>>x;for(auto&x:h)cin>>x;
int best=0,l=0;long long s=0;for(int r=0;r<n;++r){s+=a[r];while(s>k){s-=a[l];++l;}best=max(best,r-l+1);}
cout<<best<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;vector<long long>a(n),h(n);for(auto&x:a)cin>>x;for(auto&x:h)cin>>x;
int best=0,l=0;long long s=0;for(int r=0;r<n;++r){if(r>0&&h[r]%h[r-1]!=0){l=r;s=0;}s+=a[r];while(s>k){s-=a[l];++l;}best=max(best,r-l+1);}
cout<<best<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 8); return line([n, r.int(1, 12)]) + "\n" + line(r.ints(n, 1, 5)) + "\n" + line(r.ints(n, 1, 4).map((x) => [1, 2, 4, 8][x - 1])) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;vector<long long>a(n),h(n);for(auto&x:a)cin>>x;for(auto&x:h)cin>>x;int best=0;
for(int l=0;l<n;++l){long long s=0;for(int r=l;r<n;++r){if(r>l&&h[r-1]%h[r]!=0)break;s+=a[r];if(s>k)break;best=max(best,r-l+1);}}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "all heights equal, a huge fruit budget: one stretch of 2·10^5", code: `n = 200000\nreturn "1\\n" + line([n, 10**9]) + "\\n" + line(r.ints(n, 1, 10**4)) + "\\n" + line([5] * n)` },
    { seed: 2, note: "heights 1 and 2: short stretches", code: `n = 200000\nreturn "1\\n" + line([n, 10**5]) + "\\n" + line(r.ints(n, 1, 10**4)) + "\\n" + line(r.ints(n, 1, 2))` },
  ],
});

export default P;
