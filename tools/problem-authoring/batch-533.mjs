/* Batch 533 — sixteen problems at 1100, A533–A548.
 *
 * 1100 had the thinnest pool of all the levels the duel leans on: 14 problems
 * served 686 rounds, so the same few came round again and again. Every task
 * is a well-known contest problem restated for AlgoYo'l in our own words, with
 * our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1100 */
P.push({
  id: "A533", judge: "math-coin-piles-empty", topic: "math", rating: 1100,
  tag: "Arithmetic", timeLimitMs: 1000,
  uz: "Ikki uyum tanga",
  en: "Two piles of coins",
  statementUz: "Ikkita uyumda a va b ta tanga bor. Bitta amalda bir uyumdan 2 ta, ikkinchisidan 1 ta tanga olinadi; qaysi uyumdan ikkita olinishini har safar o‘zingiz tanlaysiz. Uyumda yetarli tanga bo‘lmasa, bunday amalni bajarib bo‘lmaydi. Amallarni bajarib, ikkala uyumni bir vaqtda butunlay bo‘shatish mumkinmi? Har bir so‘rov alohida tekshiriladi.",
  statementEn: "Two piles hold a and b coins. In one move you take 2 coins from one pile and 1 coin from the other, choosing each time which pile gives two. A move that needs more coins than a pile has cannot be made. Can you make moves so that both piles become empty at the same time? Each query is answered on its own.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida a va b sonlari keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains a and b.",
  outputUz: "Har bir so‘rov uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each query print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^5", "0 ≤ a, b ≤ 10^9", "every move takes exactly three coins", "two empty piles are already done"],
  constraintListUz: ["1 ≤ t ≤ 10^5", "0 ≤ a, b ≤ 10^9", "har bir amal aynan uchta tanga oladi", "ikkala uyum bo‘sh bo‘lsa, ish allaqachon bitgan"],
  sampleInputs: ["4\n2 1\n1 1\n3 3\n0 0\n"],
  expect: ["YES\nNO\nYES\nYES\n"],
  sampleNotesUz: [
    "2 va 1 — bitta amal. 1 va 1 da jami 2 ta tanga, uchtadan olib bo‘lmaydi. 3 va 3: avval birinchisidan 2, ikkinchisidan 1, so‘ng aksincha. 0 va 0 — amal kerak emas.",
  ],
  sampleNotesEn: [
    "2 and 1 take one move. 1 and 1 hold only 2 coins, and each move takes 3. 3 and 3: first 2 from the first pile and 1 from the second, then the other way round. 0 and 0 need no move.",
  ],
  testInputs: ["4\n2 1\n1 1\n3 3\n0 0\n", "1\n6 0\n", "1\n0 3\n", "3\n1000000000 500000000\n1000000000 499999999\n999999999 999999999\n", "4\n4 2\n5 1\n8 1\n2 7\n"],
  sol: `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;bool ok=(a+b)%3==0&&2*min(a,b)>=max(a,b);cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Checking only that the total is a multiple of three lets one pile run dry while the other still has coins; checking only the balance forgets that every move takes three.",
  wrong: [
    `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;cout<<((a+b)%3==0?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;cout<<(2*min(a,b)>=max(a,b)?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 6, (r) => line([r.int(0, 25), r.int(0, 25)]) + "\n"),
  brute: `static bool dp[61][61];dp[0][0]=true;for(int s=1;s<=120;++s)for(int a=0;a<=60;++a){int b=s-a;if(b<0||b>60)continue;
 bool v=false;if(a>=2&&b>=1&&dp[a-2][b-1])v=true;if(a>=1&&b>=2&&dp[a-1][b-2])v=true;dp[a][b]=v;}
int t;cin>>t;while(t--){int a,b;cin>>a>>b;cout<<(dp[a][b]?"YES":"NO")<<"\\n";}`,
  big: [
    { seed: 1, note: "10^5 queries", code: `t = 100000\nrows = []\nfor _ in range(t):\n    a = r.int(0, 10**9)\n    rows.append(line([a, r.int(a // 2, min(10**9, 2 * a))]))\nreturn str(t) + "\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A534", judge: "greedy-taxi-groups", topic: "greedy", rating: 1100,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Taksiga guruhlar",
  en: "Groups in taxis",
  statementUz: "n ta guruh bolalar taksida uyiga qaytmoqchi, i-guruhda s_i ta bola bor (1 ≤ s_i ≤ 4). Bitta guruhdagi bolalar albatta bitta taksida ketishi kerak, lekin bitta taksiga bir nechta guruh sig‘ishi mumkin. Har bir taksiga ko‘pi bilan 4 ta bola sig‘adi. Barcha bolalarni olib ketish uchun eng kami bilan nechta taksi kerak?",
  statementEn: "n groups of children are going home by taxi, and group i has s_i children (1 ≤ s_i ≤ 4). The children of one group must ride in the same taxi, but several groups may share a taxi. A taxi holds at most 4 children. What is the smallest number of taxis that takes all the children home?",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son s_1, …, s_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers s_1, …, s_n.",
  outputUz: "Yagona butun sonni chiqaring — taksilarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of taxis.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ s_i ≤ 4", "a group cannot be split between taxis", "a taxi holds at most 4 children"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ s_i ≤ 4", "guruhni ikki taksiga bo‘lib bo‘lmaydi", "taksiga ko‘pi bilan 4 ta bola sig‘adi"],
  sampleInputs: ["5\n1 2 4 3 3\n", "8\n2 3 4 4 2 1 3 1\n"],
  expect: ["4\n", "5\n"],
  sampleNotesUz: [
    "To‘rt kishilik guruh alohida, bir uch kishilik guruh yolg‘iz bola bilan, ikkinchi uch kishilik guruh alohida, ikki kishilik guruh yana bir taksida: 4 ta.",
    "Ikki to‘rtlik — 2 taksi, har bir uchlik bitta yolg‘iz bola bilan — yana 2, ikki juftlik birgalikda — 1. Jami 5.",
  ],
  sampleNotesEn: [
    "The group of four rides alone, one group of three takes the single child, the other group of three rides alone, and the pair takes one more taxi: 4.",
    "The two fours need 2 taxis, each three takes one single child for 2 more, and the two pairs share 1. That is 5.",
  ],
  testInputs: ["5\n1 2 4 3 3\n", "8\n2 3 4 4 2 1 3 1\n", "3\n3 3 2\n", "1\n1\n", "5\n1 1 1 1 1\n", "3\n2 1 1\n", "4\n3 1 1 1\n", "6\n2 2 2 1 1 1\n", "2\n4 4\n"],
  sol: `int n;cin>>n;long long c[5]={0};for(int i=0;i<n;++i){int s;cin>>s;c[s]++;}
long long taxis=c[4]+c[3];long long ones=max(0LL,c[1]-c[3]);
taxis+=c[2]/2;if(c[2]%2){taxis++;ones=max(0LL,ones-2);}
taxis+=(ones+3)/4;cout<<taxis<<"\\n";`,
  wrongNote: "Dividing the number of children by four splits groups between taxis; not putting single children beside the groups of three wastes a seat in every one of those taxis.",
  wrong: [
    `int n;cin>>n;long long sum=0;for(int i=0;i<n;++i){int s;cin>>s;sum+=s;}cout<<(sum+3)/4<<"\\n";`,
    `int n;cin>>n;long long c[5]={0};for(int i=0;i<n;++i){int s;cin>>s;c[s]++;}
long long taxis=c[4]+c[3];long long ones=c[1];
taxis+=c[2]/2;if(c[2]%2){taxis++;ones=max(0LL,ones-2);}
taxis+=(ones+3)/4;cout<<taxis<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + line(r.ints(n, 1, 4)) + "\n"; },
  brute: `int n;cin>>n;int c[5]={0};for(int i=0;i<n;++i){int s;cin>>s;c[s]++;}
map<array<int,4>,int>memo;
function<int(array<int,4>)>go=[&](array<int,4>st)->int{if(st[0]+st[1]+st[2]+st[3]==0)return 0;auto it=memo.find(st);if(it!=memo.end())return it->second;int best=INT_MAX;
 for(int a=0;a<=st[0];++a)for(int b=0;b<=st[1];++b)for(int d=0;d<=st[2];++d)for(int e=0;e<=st[3];++e){if(a+b+d+e==0)continue;if(a+2*b+3*d+4*e>4)continue;
  array<int,4>nx={st[0]-a,st[1]-b,st[2]-d,st[3]-e};best=min(best,1+go(nx));}
 return memo[st]=best;};
cout<<go({c[1],c[2],c[3],c[4]})<<"\\n";`,
  big: [
    { seed: 1, note: "10^5 random groups", code: `n = 100000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 4))` },
  ],
});

P.push({
  id: "A535", judge: "suffix-distinct-queries", topic: "data-structures", rating: 1100,
  tag: "Suffix counts", timeLimitMs: 1000,
  uz: "Oxirgi qismdagi turli sonlar",
  en: "Distinct values in a suffix",
  statementUz: "n ta butun sondan iborat a massivi va m ta so‘rov berilgan. Har bir so‘rovda bitta l soni beriladi va a_l, a_{l+1}, …, a_n elementlari orasida nechta turli qiymat borligini aniqlash kerak — ya'ni l-o‘rindan boshlab massiv oxirigacha bo‘lgan qismda. Bir xil qiymat necha marta uchrashidan qat'i nazar bir marta sanaladi. Massiv so‘rovlar orasida o‘zgarmaydi.",
  statementEn: "You are given an array a of n integers and m queries. Each query gives a single number l, and asks how many different values occur among a_l, a_{l+1}, …, a_n — the part of the array from position l to its end. A value is counted once however many times it occurs. The array does not change between queries.",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi. Keyingi m ta qatorning har birida bitta l soni beriladi.",
  inputEn: "The first line contains n and m. The second line contains the n numbers a_1, …, a_n. Each of the next m lines contains one number l.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print its answer on its own line.",
  constraintList: ["1 ≤ n, m ≤ 10^5", "1 ≤ a_i ≤ 10^5", "1 ≤ l ≤ n", "positions are numbered from 1"],
  constraintListUz: ["1 ≤ n, m ≤ 10^5", "1 ≤ a_i ≤ 10^5", "1 ≤ l ≤ n", "o‘rinlar 1 dan raqamlanadi"],
  sampleInputs: ["6 3\n1 2 1 3 2 2\n1\n4\n6\n"],
  expect: ["3\n2\n1\n"],
  sampleNotesUz: [
    "1-o‘rindan boshlab 1, 2 va 3 uchraydi. 4-o‘rindan boshlab — 3 va 2. Oxirgi o‘rinda faqat 2.",
  ],
  sampleNotesEn: [
    "From position 1 the values 1, 2 and 3 occur. From position 4 — 3 and 2. At the last position only 2.",
  ],
  testInputs: ["6 3\n1 2 1 3 2 2\n1\n4\n6\n", "1 1\n7\n1\n", "5 5\n5 5 5 5 5\n1\n2\n3\n4\n5\n", "5 5\n1 2 3 4 5\n1\n2\n3\n4\n5\n", "7 4\n3 1 3 1 2 3 2\n7\n5\n2\n1\n"],
  sol: `int n,m;cin>>n>>m;vector<int>a(n);for(auto&x:a)cin>>x;vector<int>suf(n+1,0);vector<char>seen(100001,0);
for(int i=n-1;i>=0;--i){suf[i]=suf[i+1]+(seen[a[i]]?0:1);seen[a[i]]=1;}
while(m--){int l;cin>>l;cout<<suf[l-1]<<"\\n";}`,
  wrongNote: "Counting the beginning of the array up to l answers the mirror question; starting one place late leaves out a_l itself.",
  wrong: [
    `int n,m;cin>>n>>m;vector<int>a(n);for(auto&x:a)cin>>x;vector<int>pre(n+1,0);vector<char>seen(100001,0);
for(int i=0;i<n;++i){pre[i+1]=pre[i]+(seen[a[i]]?0:1);seen[a[i]]=1;}
while(m--){int l;cin>>l;cout<<pre[l]<<"\\n";}`,
    `int n,m;cin>>n>>m;vector<int>a(n);for(auto&x:a)cin>>x;vector<int>suf(n+2,0);vector<char>seen(100001,0);
for(int i=n-1;i>=0;--i){suf[i]=suf[i+1]+(seen[a[i]]?0:1);seen[a[i]]=1;}
while(m--){int l;cin>>l;cout<<suf[l]<<"\\n";}`,
  ],
  gen: (r) => { const n = r.int(1, 10), m = r.int(1, 6); return line([n, m]) + "\n" + line(r.ints(n, 1, 5)) + "\n" + r.ints(m, 1, n).join("\n") + "\n"; },
  slow: [`int n,m;cin>>n>>m;vector<int>a(n);for(auto&x:a)cin>>x;
while(m--){int l;cin>>l;set<int>s(a.begin()+l-1,a.end());cout<<s.size()<<"\\n";}`],
  big: [
    { seed: 1, note: "all distinct, queries near the start", code: `n = m = 100000\nreturn line([n, m]) + "\\n" + line(r.perm(n)) + "\\n" + "\\n".join(str(r.int(1, 100)) for _ in range(m))` },
    { seed: 2, note: "random", code: `n = m = 100000\nreturn line([n, m]) + "\\n" + line(r.ints(n, 1, 100000)) + "\\n" + "\\n".join(str(r.int(1, n)) for _ in range(m))` },
  ],
});

P.push({
  id: "A536", judge: "str-equal-neighbours-queries", topic: "strings", rating: 1100,
  tag: "Prefix sums", timeLimitMs: 1000,
  uz: "Teng qo‘shnilar so‘rovlari",
  en: "Equal neighbours, by query",
  statementUz: "Faqat '.' va '#' belgilaridan iborat s qatori berilgan, belgilar 1 dan n gacha raqamlangan. m ta so‘rov bor, har birida l < r bo‘lgan ikki son l va r beriladi. So‘rovga javob — l ≤ i < r shartini qanoatlantiradigan va s_i = s_{i+1} bo‘lgan i lar soni, ya'ni [l, r] bo‘lak ichida yonma-yon turgan teng belgilar juftliklari soni. Qator so‘rovlar orasida o‘zgarmaydi.",
  statementEn: "You are given a string s made only of the characters '.' and '#', with characters numbered 1 to n. There are m queries, each giving two numbers l < r. The answer to a query is the number of positions i with l ≤ i < r and s_i = s_{i+1} — the pairs of equal neighbouring characters inside the piece from l to r. The string does not change between queries.",
  inputUz: "Birinchi qatorda s qatori beriladi. Ikkinchi qatorda m keladi. Keyingi m ta qatorning har birida l va r sonlari beriladi.",
  inputEn: "The first line contains the string s. The second line contains m. Each of the next m lines contains l and r.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print its answer on its own line.",
  constraintList: ["2 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "1 ≤ l < r ≤ n", "s contains only '.' and '#'"],
  constraintListUz: ["2 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "1 ≤ l < r ≤ n", "s faqat '.' va '#' belgilaridan iborat"],
  sampleInputs: ["..##.#\n3\n1 3\n2 6\n5 6\n"],
  expect: ["1\n1\n0\n"],
  sampleNotesUz: [
    "Teng qo‘shnilar 1-2 (..) va 3-4 (##) o‘rinlarda. [1, 3] ichida faqat birinchi juftlik bor, [2, 6] ichida faqat ikkinchisi, [5, 6] ichida hech biri.",
  ],
  sampleNotesEn: [
    "The equal neighbours are at positions 1-2 (..) and 3-4 (##). The piece [1, 3] holds only the first pair, [2, 6] only the second, and [5, 6] neither.",
  ],
  testInputs: ["..##.#\n3\n1 3\n2 6\n5 6\n", "..\n1\n1 2\n", ".#\n1\n1 2\n", "######\n3\n1 6\n2 3\n3 5\n", ".#.#.#.\n2\n1 7\n3 4\n", "...##..#\n4\n1 8\n4 5\n3 4\n6 8\n"],
  sol: `string s;cin>>s;int n=s.size();vector<int>p(n+1,0);for(int i=1;i<n;++i)p[i+1]=p[i]+(s[i]==s[i-1]);
int m;cin>>m;while(m--){int l,r;cin>>l>>r;cout<<p[r]-p[l]<<"\\n";}`,
  wrongNote: "Counting up to r instead of r − 1 adds the pair that sticks out of the piece; counting pairs by their right end shifts the window one place.",
  wrong: [
    `string s;cin>>s;int n=s.size();
int m;cin>>m;while(m--){int l,r;cin>>l>>r;int c=0;for(int i=l;i<=r&&i<n;++i)c+=s[i-1]==s[i];cout<<c<<"\\n";}`,
    `string s;cin>>s;int n=s.size();
int m;cin>>m;while(m--){int l,r;cin>>l>>r;int c=0;for(int i=l;i<=r;++i)if(i>=2)c+=s[i-1]==s[i-2];cout<<c<<"\\n";}`,
  ],
  gen: (r) => { const n = r.int(2, 12), m = r.int(1, 6); let s = r.str(n, ".#") + "\n" + m + "\n"; for (let i = 0; i < m; i++) { const l = r.int(1, n - 1); s += line([l, r.int(l + 1, n)]) + "\n"; } return s; },
  slow: [`string s;cin>>s;int m;cin>>m;while(m--){int l,r;cin>>l>>r;int c=0;for(int i=l;i<r;++i)c+=s[i-1]==s[i];cout<<c<<"\\n";}`],
  big: [
    { seed: 1, note: "whole-string queries", code: `n = m = 100000\nreturn text(r, n, ".#") + "\\n" + str(m) + "\\n" + "\\n".join(line([r.int(1, 10), r.int(n - 10, n)]) for _ in range(m))` },
    { seed: 2, note: "random queries", code: `n = m = 100000\nq = []\nfor _ in range(m):\n    l = r.int(1, n - 1)\n    q.append(line([l, r.int(l + 1, n)]))\nreturn text(r, n, "..#") + "\\n" + str(m) + "\\n" + "\\n".join(q)` },
  ],
});

P.push({
  id: "A537", judge: "math-shovels-and-swords", topic: "math", rating: 1100,
  tag: "Arithmetic", timeLimitMs: 1000,
  uz: "Belkurak va qilich",
  en: "Shovels and swords",
  statementUz: "Usta a ta tayoq va b ta olmosga ega. Belkurak yasash uchun 2 ta tayoq va 1 ta olmos, qilich yasash uchun esa 2 ta olmos va 1 ta tayoq kerak. Har bir tayyor buyum — belkurak yoki qilich — bitta tangaga sotiladi. Usta mavjud materiallardan eng ko‘pi bilan nechta tanga ishlab topa oladi? Har bir so‘rov alohida yechiladi.",
  statementEn: "A craftsman has a sticks and b diamonds. A shovel takes 2 sticks and 1 diamond, and a sword takes 2 diamonds and 1 stick. Every finished tool — shovel or sword — sells for one coin. What is the largest number of coins the craftsman can earn from the materials he has? Each query is answered on its own.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida a va b sonlari keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains a and b.",
  outputUz: "Har bir so‘rov uchun alohida qatorda tangalarning eng ko‘p sonini chiqaring.",
  outputEn: "For each query print the largest number of coins on its own line.",
  constraintList: ["1 ≤ t ≤ 1000", "0 ≤ a, b ≤ 10^9", "both tools sell for the same price", "materials left over are worth nothing"],
  constraintListUz: ["1 ≤ t ≤ 1000", "0 ≤ a, b ≤ 10^9", "ikkala buyum ham bir xil narxda sotiladi", "ortib qolgan materialning qiymati yo‘q"],
  sampleInputs: ["4\n4 4\n1000000000 0\n7 15\n8 7\n"],
  expect: ["2\n0\n7\n5\n"],
  sampleNotesUz: [
    "4 va 4: bitta belkurak va bitta qilich. Olmossiz hech narsa yasab bo‘lmaydi. 7 va 15: yettita qilich 7 tayoq va 14 olmos oladi. 8 va 7: masalan, 3 belkurak va 2 qilich — 8 tayoq va 7 olmos.",
  ],
  sampleNotesEn: [
    "4 and 4: one shovel and one sword. Without diamonds nothing can be made. 7 and 15: seven swords use 7 sticks and 14 diamonds. 8 and 7: for example 3 shovels and 2 swords use 8 sticks and 7 diamonds.",
  ],
  testInputs: ["4\n4 4\n1000000000 0\n7 15\n8 7\n", "1\n0 0\n", "1\n1 1\n", "1\n2 1\n", "3\n1000000000 1000000000\n1 1000000000\n999999999 500000000\n", "4\n3 3\n5 3\n10 1\n6 6\n"],
  sol: `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;cout<<min({a,b,(a+b)/3})<<"\\n";}`,
  wrongNote: "Dividing all the materials by three forgets that every tool needs at least one of each; making as many shovels as possible first leaves diamonds that no longer have sticks to go with them.",
  wrong: [
    `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;cout<<(a+b)/3<<"\\n";}`,
    `int t;cin>>t;while(t--){long long a,b;cin>>a>>b;long long s=min(a/2,b);a-=2*s;b-=s;long long w=min(a,b/2);cout<<s+w<<"\\n";}`,
  ],
  gen: (r) => tests(r, 6, (r) => line([r.int(0, 30), r.int(0, 30)]) + "\n"),
  slow: [`int t;cin>>t;while(t--){long long a,b;cin>>a>>b;long long best=0;
for(long long x=0;2*x<=a&&x<=b;++x){long long y=min(a-2*x,(b-x)/2);best=max(best,x+y);}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "large stocks: trying every shovel count is too slow", code: `return "1000\\n" + "\\n".join(line([r.int(10**8, 10**9), r.int(10**8, 10**9)]) for _ in range(1000))` },
  ],
});

P.push({
  id: "A538", judge: "dp-long-jumps-score", topic: "dynamic-programming", rating: 1100,
  tag: "DP", timeLimitMs: 1000,
  uz: "Uzun sakrashlar",
  en: "Long jumps",
  statementUz: "n ta musbat butun sondan iborat a massivi berilgan, o‘rinlar 1 dan n gacha. O‘yin shunday: siz biror i-o‘rinni tanlab, unga turasiz. Har safar turgan o‘rningizdagi a_i ni ochkoingizga qo‘shasiz va i + a_i o‘ringa sakraysiz. Agar yangi o‘rin n dan katta bo‘lsa, o‘yin tugaydi. Boshlang‘ich o‘rinni to‘g‘ri tanlab, eng ko‘pi bilan qancha ochko yig‘ish mumkin?",
  statementEn: "You are given an array a of n positive integers at positions 1 to n. The game goes like this: you choose a starting position i and stand there. Each turn you add a_i, the number at your current position, to your score and jump to position i + a_i. When the new position is beyond n, the game ends. Choosing the starting position well, what is the largest score you can collect?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda eng katta ochkoni chiqaring.",
  outputEn: "For each test case print the largest score on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n5\n7 3 1 2 3\n3\n2 1 4\n6\n2 1000 2 3 995 1\n"],
  expect: ["7\n6\n1000\n"],
  sampleNotesUz: [
    "Birinchi testda 1-o‘rindan boshlasak, 7 ni olib massivdan chiqib ketamiz — 7; 2-o‘rindan 3 + 3 = 6 bo‘ladi. Ikkinchi testda 1-o‘rindan: 2, so‘ng 3-o‘rin: 4, jami 6. Uchinchi testda 2-o‘rindan bitta sakrashda 1000.",
  ],
  sampleNotesEn: [
    "In the first test starting at position 1 collects 7 and leaves the array; starting at 2 gives 3 + 3 = 6. In the second, starting at 1 collects 2, then position 3 adds 4, for 6. In the third, starting at 2 collects 1000 in one jump.",
  ],
  testInputs: ["3\n5\n7 3 1 2 3\n3\n2 1 4\n6\n2 1000 2 3 995 1\n", "1\n1\n5\n", "1\n5\n1 1 1 1 1\n", "1\n6\n2 2 2 2 2 2\n", "2\n4\n3 1 1 9\n4\n1 2 1 1\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n),f(n+1,0);for(auto&x:a)cin>>x;long long best=0;
for(int i=n-1;i>=0;--i){long long j=i+a[i];f[i]=a[i]+(j<n?f[j]:0);best=max(best,f[i]);}
cout<<best<<"\\n";}`,
  wrongNote: "Always starting at the first position ignores that the start is ours to choose; taking the single largest number forgets that a start can jump more than once.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0;
for(long long i=0;i<n;i+=a[i])s+=a[i];cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;long long best=0;for(int i=0;i<n;++i){long long x;cin>>x;best=max(best,x);}cout<<best<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, 6)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long best=0;
for(int s=0;s<n;++s){long long sc=0;for(long long i=s;i<n;i+=a[i])sc+=a[i];best=max(best,sc);}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "all ones: walking from every start is quadratic", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line([1] * n)` },
    { seed: 2, note: "small jumps, large values", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line([r.int(1, 3) if i % 2 else 10**9 - r.int(0, 9) for i in range(n)])` },
    { seed: 3, note: "random", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "A539", judge: "math-sum-of-two-cubes", topic: "math", rating: 1100,
  tag: "Brute force", timeLimitMs: 1000,
  uz: "Ikki kub yig‘indisi",
  en: "A sum of two cubes",
  statementUz: "Sizga musbat butun x soni berilgan. x ni ikkita musbat butun sonning kublari yig‘indisi ko‘rinishida yozish mumkinmi, ya'ni x = a³ + b³ bo‘ladigan a ≥ 1 va b ≥ 1 butun sonlar bormi? a va b bir-biriga teng bo‘lishi mumkin, lekin ularning hech biri nol bo‘lmaydi, shuning uchun bitta kubning o‘zi hisobga olinmaydi. Har bir so‘rov uchun javob alohida beriladi.",
  statementEn: "You are given a positive integer x. Can x be written as the sum of the cubes of two positive integers — are there integers a ≥ 1 and b ≥ 1 with x = a³ + b³? The numbers a and b are allowed to be equal, but neither may be zero, so a cube on its own does not count. Answer every query separately.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida bitta x soni keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains one number x.",
  outputUz: "Har bir so‘rov uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each query print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 100", "1 ≤ x ≤ 10^12", "a and b must both be at least 1", "a and b may be equal"],
  constraintListUz: ["1 ≤ t ≤ 100", "1 ≤ x ≤ 10^12", "a va b ikkalasi ham kamida 1 bo‘lishi kerak", "a va b teng bo‘lishi mumkin"],
  sampleInputs: ["4\n2\n35\n4\n1729\n"],
  expect: ["YES\nYES\nNO\nYES\n"],
  sampleNotesUz: [
    "2 = 1³ + 1³. 35 = 2³ + 3³. 4 ni bunday yozib bo‘lmaydi. 1729 = 1³ + 12³ = 9³ + 10³.",
  ],
  sampleNotesEn: [
    "2 = 1³ + 1³. 35 = 2³ + 3³. 4 cannot be written this way. 1729 = 1³ + 12³ = 9³ + 10³.",
  ],
  testInputs: ["4\n2\n35\n4\n1729\n", "1\n1\n", "1\n8\n", "1\n16\n", "3\n1000000000000\n999999999999\n999970000299\n", "4\n9\n28\n703657519796\n1000000000001\n"],
  sol: `int t;cin>>t;while(t--){long long x;cin>>x;bool ok=false;
for(long long a=1;a*a*a<x&&!ok;++a){long long r=x-a*a*a;long long b=llround(cbrt((double)r));
 for(long long c=max(1LL,b-1);c<=b+1;++c)if(c*c*c==r)ok=true;}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Requiring two different numbers rejects 2 = 1 + 1; allowing b = 0 accepts every perfect cube.",
  wrong: [
    `int t;cin>>t;while(t--){long long x;cin>>x;bool ok=false;
for(long long a=1;a*a*a<x&&!ok;++a){long long r=x-a*a*a;long long b=llround(cbrt((double)r));
 for(long long c=max(1LL,b-1);c<=b+1;++c)if(c*c*c==r&&c!=a)ok=true;}
cout<<(ok?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){long long x;cin>>x;bool ok=false;
for(long long a=1;a*a*a<=x&&!ok;++a){long long r=x-a*a*a;long long b=llround(cbrt((double)r));
 for(long long c=max(0LL,b-1);c<=b+1;++c)if(c*c*c==r)ok=true;}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 6, (r) => (r.int(0, 1) ? r.int(1, 3000) : r.int(1, 14) ** 3 + r.int(1, 14) ** 3) + "\n"),
  slow: [`int t;cin>>t;while(t--){long long x;cin>>x;bool ok=false;
for(long long a=1;a*a*a<x&&!ok;++a)for(long long b=1;a*a*a+b*b*b<=x;++b)if(a*a*a+b*b*b==x){ok=true;break;}
cout<<(ok?"YES":"NO")<<"\\n";}`],
  big: [
    { seed: 1, note: "100 large numbers, few of them sums of cubes", code: `rows = []\nfor i in range(100):\n    if i % 4 == 0:\n        a, b = r.int(1, 9999), r.int(1, 9999)\n        rows.append(str(a**3 + b**3))\n    else:\n        rows.append(str(r.int(10**11, 10**12)))\nreturn "100\\n" + "\\n".join(rows)` },
  ],
});

P.push({
  id: "A540", judge: "greedy-halve-to-permutation", topic: "greedy", rating: 1100,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Ikkiga bo‘lib, almashtirish yasash",
  en: "Halving into a permutation",
  statementUz: "n ta musbat butun sondan iborat massiv berilgan. Bitta amalda istalgan elementni tanlab, uni ikkiga bo‘lib, pastga yaxlitlangan qiymat bilan almashtirasiz: a_i → ⌊a_i / 2⌋. Amallarni istalgancha bajarish mumkin. Massivni 1 dan n gacha sonlarning almashtirishiga — har bir son aynan bir marta uchraydigan massivga — aylantirish mumkinmi? Elementlarning tartibi muhim emas.",
  statementEn: "You are given an array of n positive integers. In one operation you choose any element and replace it by half of itself rounded down: a_i → ⌊a_i / 2⌋. You may perform any number of operations. Can the array be turned into a permutation of 1 to n — an array in which each of the numbers 1 to n occurs exactly once? The order of the elements does not matter.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each test case print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "halving rounds down, so 1 becomes 0"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "bo‘lish pastga yaxlitlanadi, shuning uchun 1 dan 0 hosil bo‘ladi"],
  sampleInputs: ["3\n4\n1 8 25 2\n2\n1 1\n3\n12 5 9\n"],
  expect: ["YES\nNO\nYES\n"],
  sampleNotesUz: [
    "Birinchi testda 25 → 12 → 6 → 3 va 8 → 4, natijada 1, 4, 3, 2. Ikkinchi testda ikkita 1 bor, birini o‘zgartirsak 0 bo‘ladi va 2 hech qachon hosil bo‘lmaydi. Uchinchi testda 12 → 6 → 3, 9 → 4 → 2, 5 → 2 → 1.",
  ],
  sampleNotesEn: [
    "In the first test 25 → 12 → 6 → 3 and 8 → 4, leaving 1, 4, 3, 2. In the second there are two 1s; changing one gives 0, and a 2 can never appear. In the third, 12 → 6 → 3, 9 → 4 → 2 and 5 → 2 → 1.",
  ],
  testInputs: ["3\n4\n1 8 25 2\n2\n1 1\n3\n12 5 9\n", "1\n2\n2 2\n", "1\n1\n1000000000\n", "1\n3\n6 6 6\n", "2\n5\n5 5 5 5 5\n5\n1 2 3 4 5\n", "1\n6\n48 40 24 12 7 1\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());vector<char>used(n+1,0);bool ok=true;
for(auto v:a){while(v>n||(v>0&&used[v]))v/=2;if(v==0){ok=false;break;}used[v]=1;}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Halving only while a value is above n gives up on a duplicate that one more halving would have placed; letting a value fall to zero and still counting it accepts arrays that never become a permutation.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());vector<char>used(n+1,0);bool ok=true;
for(auto v:a){while(v>n)v/=2;if(v==0||used[v]){ok=false;break;}used[v]=1;}
cout<<(ok?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());vector<char>used(n+1,0);
for(auto v:a){while(v>n||(v>0&&used[v]))v/=2;used[v]=1;}
cout<<"YES"<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 6); return n + "\n" + line(r.ints(n, 1, 40)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<vector<int>>g(n);for(int i=0;i<n;++i)for(long long v=a[i];v>0;v/=2)if(v<=n)g[i].push_back((int)v);
vector<int>mt(n+1,-1);int cnt=0;
for(int i=0;i<n;++i){vector<char>vis(n+1,0);function<bool(int)>tr=[&](int u)->bool{for(int v:g[u])if(!vis[v]){vis[v]=1;if(mt[v]<0||tr(mt[v])){mt[v]=u;return true;}}return false;};if(tr(i))++cnt;}
cout<<(cnt==n?"YES":"NO")<<"\\n";}`,
  big: [
    { seed: 1, note: "a shuffled permutation scaled by powers of two", code: `n = 200000\na = [v * (1 << r.int(0, 12)) for v in r.perm(n)]\nreturn "1\\n" + str(n) + "\\n" + line(a)` },
    { seed: 2, note: "random large values", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "A541", judge: "str-merge-two-digits-max", topic: "strings", rating: 1100,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Ikki raqamni qo‘shish",
  en: "Adding two neighbouring digits",
  statementUz: "Sizga boshida nol bo‘lmagan, kamida ikki xonali x butun soni berilgan. Siz aynan bitta amal bajarasiz: x ning yonma-yon turgan ikki raqamini tanlab, ularni shu raqamlar yig‘indisi bilan almashtirasiz; yig‘indi boshida nolsiz o‘nlik yozuvda yoziladi. Masalan, 10057 dan 5 va 7 ni tanlasak, 10012 hosil bo‘ladi, 0 va 0 ni tanlasak — 1057. Hosil bo‘lishi mumkin bo‘lgan eng katta sonni toping.",
  statementEn: "You are given an integer x with at least two digits and no leading zero. You make exactly one operation: choose two neighbouring digits of x and replace them with their sum, written in decimal without leading zeros. For example, from 10057 choosing 5 and 7 gives 10012, and choosing 0 and 0 gives 1057. Find the largest number that can be obtained.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Keyingi t ta qatorning har birida bitta x soni keladi.",
  inputEn: "The first line contains the number of test cases t. Each of the next t lines contains one number x.",
  outputUz: "Har bir test uchun alohida qatorda eng katta natijani chiqaring.",
  outputEn: "For each test case print the largest result on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "x has between 2 and 2·10^5 digits", "the total number of digits over all tests ≤ 2·10^5", "x has no leading zero"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "x da 2 tadan 2·10^5 tagacha raqam bor", "barcha testlardagi raqamlar soni ≤ 2·10^5", "x boshida nol yo‘q"],
  sampleInputs: ["3\n10057\n90\n1234\n"],
  expect: ["10012\n9\n334\n"],
  sampleNotesUz: [
    "10057 da 5 + 7 = 12 sonning uzunligini saqlaydi va faqat oxirgi raqamlarni o‘zgartiradi. 90 dan faqat 9 hosil bo‘ladi. 1234 da hech qaysi juftlik ikki xonali yig‘indi bermaydi, eng yaxshisi boshidagi 1 va 2 ni qo‘shish: 334.",
  ],
  sampleNotesEn: [
    "In 10057, 5 + 7 = 12 keeps the length and changes only the last digits. From 90 only 9 can be made. In 1234 no pair sums to two digits, and the best is to add the leading 1 and 2: 334.",
  ],
  testInputs: ["3\n10057\n90\n1234\n", "1\n5959\n", "1\n10\n", "1\n99\n", "2\n100000\n111111\n", "3\n46\n73\n28181\n", "1\n9090909\n"],
  sol: `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size(),pos=-1;
for(int i=n-2;i>=0;--i)if((s[i]-'0')+(s[i+1]-'0')>=10){pos=i;break;}
if(pos<0)pos=0;int v=(s[pos]-'0')+(s[pos+1]-'0');
cout<<s.substr(0,pos)<<v<<s.substr(pos+2)<<"\\n";}`,
  wrongNote: "Merging the leftmost pair whose sum has two digits changes a more significant place than necessary; merging the rightmost pair when no sum reaches ten shortens the number at its least useful end.",
  wrong: [
    `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size(),pos=-1;
for(int i=0;i+1<n;++i)if((s[i]-'0')+(s[i+1]-'0')>=10){pos=i;break;}
if(pos<0)pos=0;int v=(s[pos]-'0')+(s[pos+1]-'0');
cout<<s.substr(0,pos)<<v<<s.substr(pos+2)<<"\\n";}`,
    `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size(),pos=-1;
for(int i=n-2;i>=0;--i)if((s[i]-'0')+(s[i+1]-'0')>=10){pos=i;break;}
if(pos<0)pos=n-2;int v=(s[pos]-'0')+(s[pos+1]-'0');
cout<<s.substr(0,pos)<<v<<s.substr(pos+2)<<"\\n";}`,
  ],
  gen: (r) => tests(r, 4, (r) => { const n = r.int(2, 8); return String(r.int(1, 9)) + r.str(n - 1, "0123456789") + "\n"; }),
  slow: [`int t;cin>>t;while(t--){string s;cin>>s;int n=s.size();string best="";
for(int i=0;i+1<n;++i){string c=s.substr(0,i)+to_string((s[i]-'0')+(s[i+1]-'0'))+s.substr(i+2);
 if(c.size()>best.size()||(c.size()==best.size()&&c>best))best=c;}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "one long number, no sum reaches ten", code: `n = 200000\nreturn "1\\n" + "1" + text(r, n - 1, "01234")` },
    { seed: 2, note: "one long random number", code: `n = 200000\nreturn "1\\n" + "9" + text(r, n - 1, "0123456789")` },
  ],
});

P.push({
  id: "A542", judge: "str-who-took-the-painting", topic: "strings", rating: 1100,
  tag: "Prefix logic", timeLimitMs: 1000,
  uz: "Rasmni kim olgan",
  en: "Who took the painting",
  statementUz: "Xonada rasm osig‘liq edi. n ta do‘st birin-ketin, har biri yolg‘iz o‘zi xonaga kirib chiqdi — avval 1-do‘st, keyin 2-do‘st va hokazo. Boshida rasm joyida edi, oxirgi do‘st chiqqandan keyin esa yo‘q bo‘ldi; uni aynan bitta do‘st o‘z tashrifi davomida olgan. Har bir do‘stdan kirganida rasm bormidi, deb so‘rashdi: 1 — bor edi, 0 — yo‘q edi, ? — eslay olmaydi. O‘g‘ridan boshqa hamma yo rost gapirgan, yo ? degan; o‘g‘ri esa istalgan javobni bergan bo‘lishi mumkin. Nechta do‘st o‘g‘ri bo‘lishi mumkin?",
  statementEn: "A painting hung in a room. n friends visited the room one after another, each alone — first friend 1, then friend 2, and so on. At the start the painting was there, and after the last friend left it was gone; exactly one friend took it during their visit. Each friend was asked whether the painting was there when they came in: 1 — it was, 0 — it was not, ? — they do not remember. Everyone except the thief either told the truth or said ?, while the thief may have answered anything. How many friends could be the thief?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Keyingi t ta qatorning har birida javoblar qatori s keladi: uning i-belgisi i-do‘stning javobi.",
  inputEn: "The first line contains the number of test cases t. Each of the next t lines contains the string of answers s, whose i-th character is friend i's answer.",
  outputUz: "Har bir test uchun alohida qatorda o‘g‘ri bo‘lishi mumkin bo‘lgan do‘stlar sonini chiqaring.",
  outputEn: "For each test case print the number of friends who could be the thief, on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ |s| ≤ 2·10^5, the total length over all tests ≤ 2·10^5", "s consists of 0, 1 and ?", "the answers are consistent with at least one thief"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ |s| ≤ 2·10^5, barcha testlar bo‘yicha uzunliklar yig‘indisi ≤ 2·10^5", "s faqat 0, 1 va ? belgilaridan iborat", "javoblar kamida bitta o‘g‘ri bilan mos keladi"],
  sampleInputs: ["4\n0\n1\n1?0\n??1??\n"],
  expect: ["1\n1\n3\n3\n"],
  sampleNotesUz: [
    "Bitta do‘st bo‘lsa, o‘g‘ri — u. 1?0 da har kim o‘g‘ri bo‘lishi mumkin: masalan, 1-do‘st olgan bo‘lsa, keyingilar ? va 0 deyishi to‘g‘ri. ??1?? da 3-do‘st kirganda rasm bor edi, shuning uchun 1- va 2-do‘st o‘g‘ri emas; 3-, 4- yoki 5-do‘st bo‘lishi mumkin.",
  ],
  sampleNotesEn: [
    "With one friend, that friend is the thief. In 1?0 anyone could be the thief: if friend 1 took it, the later answers ? and 0 are honest. In ??1?? the painting was there when friend 3 came in, so friends 1 and 2 are cleared, and any of friends 3, 4 and 5 could be the thief.",
  ],
  testInputs: ["4\n0\n1\n1?0\n??1??\n", "1\n1?1?0\n", "1\n?????\n", "1\n11110000\n", "2\n0???\n???1\n", "1\n1?????0\n"],
  sol: `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size();int last1=0,first0=n-1;
for(int i=0;i<n;++i)if(s[i]=='1')last1=i;for(int i=n-1;i>=0;--i)if(s[i]=='0')first0=i;
cout<<first0-last1+1<<"\\n";}`,
  wrongNote: "Counting only the friends who answered ? leaves out the thief who lied with a 0 or a 1; clearing friends only up to the first 1 forgets that a later 1 proves the painting was still there.",
  wrong: [
    `int t;cin>>t;while(t--){string s;cin>>s;cout<<count(s.begin(),s.end(),'?')<<"\\n";}`,
    `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size();int first1=0,first0=n-1;
for(int i=n-1;i>=0;--i)if(s[i]=='1')first1=i;for(int i=n-1;i>=0;--i)if(s[i]=='0')first0=i;
cout<<first0-first1+1<<"\\n";}`,
  ],
  gen: (r) => tests(r, 4, (r) => { const n = r.int(1, 9), k = r.int(0, n - 1); let s = ""; for (let i = 0; i < n; i++) s += i < k ? r.pick("1?") : i > k ? r.pick("0?") : r.pick("01?"); return s + "\n"; }),
  slow: [`int t;cin>>t;while(t--){string s;cin>>s;int n=s.size(),c=0;
for(int k=0;k<n;++k){bool ok=true;for(int j=0;j<n&&ok;++j){if(j<k&&s[j]=='0')ok=false;if(j>k&&s[j]=='1')ok=false;}c+=ok;}
cout<<c<<"\\n";}`],
  big: [
    { seed: 1, note: "all ?: every friend is a suspect, a check per friend is quadratic", code: `return "1\\n" + "?" * 200000` },
    { seed: 2, note: "a long stretch of ? between the last 1 and the first 0", code: `n = 200000\nreturn "1\\n" + "1" * 1000 + "?" * (n - 2000) + "0" * 1000` },
  ],
});

P.push({
  id: "A543", judge: "bs-eat-candies-queries", topic: "binary-search", rating: 1100,
  tag: "Prefix sums and binary search", timeLimitMs: 1000,
  uz: "Shirinlik so‘rovlari",
  en: "Sugar queries",
  statementUz: "n ta konfet bor, i-konfetda a_i gramm shakar bor. q ta so‘rov beriladi: j-so‘rovda bitta x_j soni bo‘lib, jami kamida x_j gramm shakar olish uchun eng kami bilan nechta konfet yeyish kerakligini aniqlash kerak. Har bir konfetni ko‘pi bilan bir marta yeyish mumkin. Agar hamma konfetlar ham yetmasa, -1 chiqaring. So‘rovlar bir-biriga bog‘liq emas: har birida hamma konfetlar yana mavjud.",
  statementEn: "There are n candies, and candy i contains a_i grams of sugar. You get q queries: query j gives one number x_j and asks for the smallest number of candies you must eat to get at least x_j grams of sugar in total. Each candy can be eaten at most once. If even all the candies are not enough, print -1. Queries are independent: in every query all the candies are available again.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir testning birinchi qatorida n va q, ikkinchi qatorida n ta son a_i, keyingi q ta qatorida bittadan x_j beriladi.",
  inputEn: "The first line contains the number of test cases t. Each test case starts with a line holding n and q, then a line with the n numbers a_i, then q lines with one number x_j each.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print its answer on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n, q ≤ 1.5·10^5; the sums of n and of q over all tests are each ≤ 1.5·10^5", "1 ≤ a_i ≤ 10^4", "1 ≤ x_j ≤ 2·10^9"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n, q ≤ 1.5·10^5; barcha testlar bo‘yicha n lar va q lar yig‘indisi har biri ≤ 1.5·10^5", "1 ≤ a_i ≤ 10^4", "1 ≤ x_j ≤ 2·10^9"],
  sampleInputs: ["2\n5 4\n4 3 3 1 2\n1\n7\n13\n14\n1 2\n5\n5\n6\n"],
  expect: ["1\n2\n5\n-1\n1\n-1\n"],
  sampleNotesUz: [
    "Birinchi testda eng shirinlaridan boshlab yesak: 4, 4 + 3 = 7, …, hammasi 13. Demak 1 gramm uchun 1 ta, 7 uchun 2 ta, 13 uchun 5 ta konfet kerak, 14 ga esa yetmaydi. Ikkinchi testda yagona konfet 5 grammni beradi, 6 ga yetmaydi.",
  ],
  sampleNotesEn: [
    "In the first test eating the sweetest first gives 4, then 4 + 3 = 7, …, 13 for all of them. So 1 gram takes 1 candy, 7 takes 2, 13 takes 5, and 14 cannot be reached. In the second test the single candy gives 5 grams, which is not enough for 6.",
  ],
  testInputs: ["2\n5 4\n4 3 3 1 2\n1\n7\n13\n14\n1 2\n5\n5\n6\n", "1\n1 1\n10000\n2000000000\n", "1\n3 3\n2 2 2\n2\n3\n6\n", "1\n4 4\n1 10 1 10\n10\n11\n20\n21\n"],
  sol: `int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());
for(int i=1;i<n;++i)a[i]+=a[i-1];
while(q--){long long x;cin>>x;auto it=lower_bound(a.begin(),a.end(),x);cout<<(it==a.end()?-1:(long long)(it-a.begin())+1)<<"\\n";}}`,
  wrongNote: "Searching for the first total that is strictly larger eats one candy too many when a total lands exactly on x; adding the candies from the least sweet means more of them are needed.",
  wrong: [
    `int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());
for(int i=1;i<n;++i)a[i]+=a[i-1];
while(q--){long long x;cin>>x;auto it=upper_bound(a.begin(),a.end(),x);cout<<(it==a.end()?-1:(long long)(it-a.begin())+1)<<"\\n";}}`,
    `int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
for(int i=1;i<n;++i)a[i]+=a[i-1];
while(q--){long long x;cin>>x;auto it=lower_bound(a.begin(),a.end(),x);cout<<(it==a.end()?-1:(long long)(it-a.begin())+1)<<"\\n";}}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 7), q = r.int(1, 5); return line([n, q]) + "\n" + line(r.ints(n, 1, 9)) + "\n" + r.ints(q, 1, 50).join("\n") + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());
while(q--){long long x;cin>>x;long long s=0;int ans=-1;for(int i=0;i<n;++i){s+=a[i];if(s>=x){ans=i+1;break;}}cout<<ans<<"\\n";}}`],
  big: [
    { seed: 1, note: "queries needing most of the candies", code: `n, q = 150000, 100000\na = r.ints(n, 1, 10**4)\ns = sum(a)\nreturn "1\\n" + line([n, q]) + "\\n" + line(a) + "\\n" + "\\n".join(str(r.int(s - 10**5, s + 10)) for _ in range(q))` },
    { seed: 2, note: "random", code: `n = q = 150000\nreturn "1\\n" + line([n, q]) + "\\n" + line(r.ints(n, 1, 10**4)) + "\\n" + "\\n".join(str(r.int(1, 2 * 10**9)) for _ in range(q))` },
  ],
});

P.push({
  id: "A544", judge: "str-glued-from-two", topic: "strings", rating: 1100,
  tag: "Hashing", timeLimitMs: 1000,
  uz: "Ikki so‘zdan yopishtirilgan",
  en: "Glued from two words",
  statementUz: "n ta qisqa so‘z berilgan. Har bir i uchun s_i so‘zini ro‘yxatdagi ikki so‘zni ketma-ket yopishtirib hosil qilish mumkinmi, ya'ni s_i = s_j + s_k bo‘ladigan j va k bormi, aniqlang. j va k bir xil bo‘lishi mumkin — bitta so‘z ikki marta ishlatiladi. Javobni n uzunlikdagi qator ko‘rinishida chiqaring: i-belgi 1, agar s_i ni shunday hosil qilish mumkin bo‘lsa, aks holda 0.",
  statementEn: "You are given n short words. For every i decide whether the word s_i can be made by gluing two words from the list one after the other — whether there are j and k with s_i = s_j + s_k. j and k may be the same, so one word may be used twice. Print the answer as a string of length n whose i-th character is 1 if s_i can be made this way and 0 otherwise.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir testning birinchi qatorida n, keyingi n ta qatorda bittadan so‘z beriladi.",
  inputEn: "The first line contains the number of test cases t. Each test case starts with a line holding n, followed by n lines with one word each.",
  outputUz: "Har bir test uchun alohida qatorda 0 va 1 lardan iborat n uzunlikdagi qatorni chiqaring.",
  outputEn: "For each test case print a string of n characters 0 and 1 on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^5, the sum of n over all tests ≤ 10^5", "each word has 1 to 8 lowercase letters", "words may repeat in the list"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 10^5", "har bir so‘z 1 tadan 8 tagacha kichik harfdan iborat", "ro‘yxatda so‘zlar takrorlanishi mumkin"],
  sampleInputs: ["2\n5\nab\na\nb\nabab\nba\n3\nx\nxx\nxxx\n"],
  expect: ["10011\n011\n"],
  sampleNotesUz: [
    "Birinchi testda ab = a + b, abab = ab + ab, ba = b + a; a va b ni bo‘lib bo‘lmaydi. Ikkinchi testda xx = x + x, xxx = x + xx.",
  ],
  sampleNotesEn: [
    "In the first test ab = a + b, abab = ab + ab and ba = b + a, while a and b cannot be split. In the second, xx = x + x and xxx = x + xx.",
  ],
  testInputs: ["2\n5\nab\na\nb\nabab\nba\n3\nx\nxx\nxxx\n", "1\n3\nabc\nab\nc\n", "1\n1\nz\n", "1\n4\naa\naa\na\naaaa\n", "1\n6\nabcdefgh\nabcd\nefgh\nabcde\nfgh\nh\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<string>s(n);for(auto&x:s)cin>>x;unordered_set<string>have(s.begin(),s.end());string out(n,'0');
for(int i=0;i<n;++i)for(size_t c=1;c<s[i].size();++c)if(have.count(s[i].substr(0,c))&&have.count(s[i].substr(c))){out[i]='1';break;}
cout<<out<<"\\n";}`,
  wrongNote: "Demanding two different words rejects abab = ab + ab; trying only the cut in the middle misses abc = ab + c.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<string>s(n);for(auto&x:s)cin>>x;unordered_set<string>have(s.begin(),s.end());string out(n,'0');
for(int i=0;i<n;++i)for(size_t c=1;c<s[i].size();++c){string a=s[i].substr(0,c),b=s[i].substr(c);if(a!=b&&have.count(a)&&have.count(b)){out[i]='1';break;}}
cout<<out<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<string>s(n);for(auto&x:s)cin>>x;unordered_set<string>have(s.begin(),s.end());string out(n,'0');
for(int i=0;i<n;++i){size_t c=s[i].size()/2;if(c>0&&have.count(s[i].substr(0,c))&&have.count(s[i].substr(c)))out[i]='1';}
cout<<out<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 7); let s = n + "\n"; for (let i = 0; i < n; i++) s += r.str(r.int(1, 4), "ab") + "\n"; return s; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<string>s(n);for(auto&x:s)cin>>x;string out(n,'0');
for(int i=0;i<n;++i){for(int j=0;j<n&&out[i]=='0';++j){if(s[j].size()>=s[i].size()||s[i].compare(0,s[j].size(),s[j])!=0)continue;
 for(int k=0;k<n;++k)if(s[j].size()+s[k].size()==s[i].size()&&s[i].compare(s[j].size(),string::npos,s[k])==0){out[i]='1';break;}}}
cout<<out<<"\\n";}`],
  big: [
    { seed: 1, note: "10^5 words over a two-letter alphabet: pairwise checks are far too slow", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + "\\n".join(text(r, r.int(1, 8), "ab") for _ in range(n))` },
    { seed: 2, note: "random letters", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + "\\n".join(text(r, r.int(1, 8), "abcdefghijklmnopqrstuvwxyz") for _ in range(n))` },
  ],
});

P.push({
  id: "A545", judge: "math-coprime-max-index-sum", topic: "math", rating: 1100,
  tag: "Number theory", timeLimitMs: 1000,
  uz: "O‘zaro tub juftlik",
  en: "A coprime pair",
  statementUz: "n ta musbat butun sondan iborat massiv berilgan, o‘rinlar 1 dan n gacha raqamlangan. a_i va a_j o‘zaro tub bo‘ladigan — ya'ni ularning eng katta umumiy bo‘luvchisi 1 ga teng bo‘ladigan — i va j o‘rinlar juftligini tanlab, i + j yig‘indisini iloji boricha katta qilish kerak. i va j teng bo‘lishi mumkin. Eng katta i + j ni chiqaring; bunday juftlik bo‘lmasa, -1 chiqaring.",
  statementEn: "You are given an array of n positive integers at positions 1 to n. Choose a pair of positions i and j such that a_i and a_j are coprime — their greatest common divisor is 1 — and make i + j as large as possible. i and j may be equal. Print the largest i + j, or -1 if no such pair exists.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each test case print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 10", "2 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 1000", "i and j may be the same position"],
  constraintListUz: ["1 ≤ t ≤ 10", "2 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 1000", "i va j bir xil o‘rin bo‘lishi mumkin"],
  sampleInputs: ["3\n3\n3 2 1\n4\n2 4 6 8\n5\n1 3 5 2 4\n"],
  expect: ["6\n-1\n8\n"],
  sampleNotesUz: [
    "Birinchi testda a_3 = 1 o‘zi bilan o‘zaro tub, 3 + 3 = 6. Ikkinchi testda hamma sonlar juft. Uchinchi testda a_5 = 4 va a_3 = 5 o‘zaro tub: 5 + 3 = 8.",
  ],
  sampleNotesEn: [
    "In the first test a_3 = 1 is coprime to itself, giving 3 + 3 = 6. In the second every number is even. In the third a_5 = 4 and a_3 = 5 are coprime: 5 + 3 = 8.",
  ],
  testInputs: ["3\n3\n3 2 1\n4\n2 4 6 8\n5\n1 3 5 2 4\n", "1\n4\n2 3 2 3\n", "1\n2\n1 1\n", "1\n2\n6 10\n", "1\n6\n1000 999 1000 997 6 1000\n"],
  sol: `static int g[1001][1001];for(int x=1;x<=1000;++x)for(int y=1;y<=1000;++y)g[x][y]=__gcd(x,y);
int t;cin>>t;while(t--){int n;cin>>n;vector<int>last(1001,0);for(int i=1;i<=n;++i){int a;cin>>a;last[a]=i;}
vector<int>vals;for(int v=1;v<=1000;++v)if(last[v])vals.push_back(v);int best=-1;
for(int x:vals)for(int y:vals)if(g[x][y]==1)best=max(best,last[x]+last[y]);
cout<<best<<"\\n";}`,
  wrongNote: "Requiring two different positions misses a 1 paired with itself; remembering the first position of each value instead of the last throws away the larger indices.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>last(1001,0);for(int i=1;i<=n;++i){int a;cin>>a;last[a]=i;}int best=-1;
for(int x=1;x<=1000;++x)if(last[x])for(int y=1;y<=1000;++y)if(last[y]&&last[x]!=last[y]&&__gcd(x,y)==1)best=max(best,last[x]+last[y]);
cout<<best<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>first(1001,0);for(int i=1;i<=n;++i){int a;cin>>a;if(!first[a])first[a]=i;}int best=-1;
for(int x=1;x<=1000;++x)if(first[x])for(int y=1;y<=1000;++y)if(first[y]&&__gcd(x,y)==1)best=max(best,first[x]+first[y]);
cout<<best<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(2, 8); return n + "\n" + line(r.ints(n, 1, 12)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];int best=-1;
for(int i=1;i<=n;++i)for(int j=i;j<=n;++j)if(__gcd(a[i],a[j])==1)best=max(best,i+j);
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "even numbers with one odd early on: the pair is far from the end", code: `out = []\nfor _ in range(3):\n    n = 200000\n    a = [2 * r.int(1, 500) for _ in range(n)]\n    a[r.int(0, 50)] = 3\n    out.append(str(n) + "\\n" + line(a))\nreturn "3\\n" + "\\n".join(out)` },
    { seed: 2, note: "no coprime pair at all", code: `out = []\nfor _ in range(3):\n    n = 200000\n    out.append(str(n) + "\\n" + line([6 * r.int(1, 166) for _ in range(n)]))\nreturn "3\\n" + "\\n".join(out)` },
  ],
});

P.push({
  id: "A546", judge: "sort-remove-mins-or-max", topic: "sorting", rating: 1100,
  tag: "Sorting and prefix sums", timeLimitMs: 1000,
  uz: "Eng kichik ikkitasi yoki eng kattasi",
  en: "Two smallest or one largest",
  statementUz: "n ta turli musbat butun sondan iborat massiv va k soni berilgan. Aynan k marta amal bajariladi, har safar ikkisidan birini tanlaysiz: massivdagi eng kichik ikki elementni o‘chirish yoki eng katta bitta elementni o‘chirish. k ta amaldan keyin qolgan elementlar yig‘indisining eng katta qiymatini toping. 2k < n bo‘lgani uchun massiv hech qachon bo‘shab qolmaydi.",
  statementEn: "You are given an array of n distinct positive integers and a number k. You make exactly k operations, and each time you choose one of two: delete the two smallest elements of the array, or delete the single largest element. Find the largest possible sum of the elements left after the k operations. Since 2k < n, the array never runs empty.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n va k, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n and k, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda eng katta yig‘indini chiqaring.",
  outputEn: "For each test case print the largest sum on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "3 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ k, 2k < n", "1 ≤ a_i ≤ 10^9, all distinct"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "3 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ k, 2k < n", "1 ≤ a_i ≤ 10^9, hammasi turli"],
  sampleInputs: ["3\n5 1\n2 5 1 10 6\n5 2\n2 5 1 10 6\n3 1\n1 2 3\n"],
  expect: ["21\n11\n3\n"],
  sampleNotesUz: [
    "Birinchi testda 1 va 2 ni o‘chirsak 21 qoladi, 10 ni o‘chirsak — 14. Ikkinchi testda bir marta 1 va 2 ni, bir marta 10 ni o‘chirish eng yaxshisi: 5 + 6 = 11. Uchinchi testda ikkala tanlov ham 3 qoldiradi.",
  ],
  sampleNotesEn: [
    "In the first test deleting 1 and 2 leaves 21, deleting 10 leaves 14. In the second, deleting 1 and 2 once and 10 once is best: 5 + 6 = 11. In the third both choices leave 3.",
  ],
  testInputs: ["3\n5 1\n2 5 1 10 6\n5 2\n2 5 1 10 6\n3 1\n1 2 3\n", "1\n3 1\n100 1 2\n", "1\n7 3\n1 2 3 4 5 6 1000000000\n", "1\n9 4\n9 8 7 6 5 4 3 2 1\n", "1\n6 2\n1000000000 999999999 999999998 1 2 3\n"],
  sol: `int t;cin>>t;while(t--){int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());vector<long long>p(n+1,0);for(int i=0;i<n;++i)p[i+1]=p[i]+a[i];
long long best=0;for(int i=0;i<=k;++i)best=max(best,p[n-(k-i)]-p[2*i]);
cout<<best<<"\\n";}`,
  wrongNote: "Always deleting the two smallest can throw away more than one large element would; always deleting the largest is the mirror mistake.",
  wrong: [
    `int t;cin>>t;while(t--){int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long s=0;for(int i=2*k;i<n;++i)s+=a[i];cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long s=0;for(int i=0;i<n-k;++i)s+=a[i];cout<<s<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(3, 9), k = r.int(1, Math.floor((n - 1) / 2)); return line([n, k]) + "\n" + line(r.shuffle(Array.from({ length: 30 }, (_, i) => i + 1)).slice(0, n)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long best=0;for(int i=0;i<=k;++i){long long s=0;for(int j=2*i;j<n-(k-i);++j)s+=a[j];best=max(best,s);}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "k close to n/2: summing each choice from scratch is quadratic", code: `n = 200000\na = r.shuffle(list(range(1, 10**9, 4999)))[:n]\nreturn "1\\n" + line([n, n // 2 - 1]) + "\\n" + line(a)` },
  ],
});

P.push({
  id: "A547", judge: "bs-aquarium-height", topic: "binary-search", rating: 1100,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Akvarium qurish",
  en: "Building an aquarium",
  statementUz: "Akvarium tubi n ta ustundan iborat, i-ustunning balandligi a_i. Siz akvarium devorlarini h balandlikda qurasiz va suv quyasiz: balandligi h dan past har bir i-ustun ustiga h − a_i birlik suv kerak bo‘ladi, balandligi h yoki undan yuqori ustunlar ustiga suv kerak emas. Sizda ko‘pi bilan x birlik suv bor va uni to‘liq ishlatish shart emas. Qura oladigan eng katta butun h ni toping.",
  statementEn: "The floor of an aquarium is made of n columns, and column i has height a_i. You build the walls to a height h and pour water in: every column lower than h needs h − a_i units of water on top of it, and columns of height h or more need none. You have at most x units of water and need not use all of it. Find the largest integer h you can build.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n va x, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n and x, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda eng katta h ni chiqaring.",
  outputEn: "For each test case print the largest h on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ x, a_i ≤ 10^9", "h = 1 always fits, and h can exceed 10^9"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ x, a_i ≤ 10^9", "h = 1 har doim mumkin, h esa 10^9 dan oshishi mumkin"],
  sampleInputs: ["3\n5 9\n3 1 2 4 6\n1 1000000000\n1\n4 1\n5 5 5 5\n"],
  expect: ["4\n1000000001\n5\n"],
  sampleNotesUz: [
    "Birinchi testda h = 4 uchun 1 + 3 + 2 = 6 birlik suv kerak, h = 5 uchun esa 2 + 4 + 3 + 1 = 10 > 9. Ikkinchi testda yagona ustun ustiga hamma suv quyiladi: 1 + 10^9. Uchinchi testda h = 5 suvsiz, h = 6 esa 4 birlik talab qiladi.",
  ],
  sampleNotesEn: [
    "In the first test h = 4 needs 1 + 3 + 2 = 6 units, while h = 5 needs 2 + 4 + 3 + 1 = 10 > 9. In the second all the water goes on the single column: 1 + 10^9. In the third h = 5 needs no water and h = 6 needs 4 units.",
  ],
  testInputs: ["3\n5 9\n3 1 2 4 6\n1 1000000000\n1\n4 1\n5 5 5 5\n", "1\n1 1\n1\n", "1\n3 1000000000\n1000000000 1000000000 1000000000\n", "1\n4 6\n1 1 1 10\n", "1\n5 3\n10 1 10 1 10\n"],
  sol: `int t;cin>>t;while(t--){int n;long long x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;
long long lo=1,hi=3000000001LL;while(hi-lo>1){long long h=(lo+hi)/2;long long need=0;for(auto v:a){if(v<h)need+=h-v;if(need>x)break;}if(need<=x)lo=h;else hi=h;}
cout<<lo<<"\\n";}`,
  wrongNote: "Capping the search at 10^9 can never reach a wall higher than that; letting tall columns count as negative water lends water that does not exist.",
  wrong: [
    `int t;cin>>t;while(t--){int n;long long x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;
long long lo=1,hi=1000000001LL;while(hi-lo>1){long long h=(lo+hi)/2;long long need=0;for(auto v:a){if(v<h)need+=h-v;if(need>x)break;}if(need<=x)lo=h;else hi=h;}
cout<<lo<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;long long x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;
long long lo=1,hi=3000000001LL;while(hi-lo>1){long long h=(lo+hi)/2;long long need=0;for(auto v:a)need+=h-v;if(need<=x)lo=h;else hi=h;}
cout<<lo<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 6); return line([n, r.int(1, 20)]) + "\n" + line(r.ints(n, 1, 10)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;long long x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;
long long h=1;while(true){long long need=0;for(auto v:a)if(v<h+1)need+=h+1-v;if(need>x)break;++h;}
cout<<h<<"\\n";}`],
  big: [
    { seed: 1, note: "low columns, plenty of water: the wall is about 5000 high", code: `n = 200000\nreturn "1\\n" + line([n, 10**9]) + "\\n" + line(r.ints(n, 1, 10))` },
    { seed: 2, note: "random", code: `n = 200000\nreturn "1\\n" + line([n, r.int(1, 10**9)]) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "A548", judge: "greedy-binary-inversions-flip", topic: "greedy", rating: 1100,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Bitta bitni almashtirib",
  en: "One flip for more inversions",
  statementUz: "Faqat 0 va 1 lardan iborat n uzunlikdagi massiv berilgan. Inversiya deb i < j va a_i > a_j bo‘lgan (i, j) juftlikka aytiladi — ya'ni chapda 1, o‘ngda 0 turgan juftlik. Siz ko‘pi bilan bitta amal bajarishingiz mumkin: bitta elementni tanlab, 0 ni 1 ga yoki 1 ni 0 ga almashtirasiz. Amal bajarmaslik ham mumkin. Massivdagi inversiyalar sonining eng katta qiymatini toping.",
  statementEn: "You are given an array of length n made only of 0s and 1s. An inversion is a pair (i, j) with i < j and a_i > a_j — a 1 standing to the left of a 0. You may make at most one operation: choose one element and change a 0 into a 1 or a 1 into a 0. Making no operation is allowed too. Find the largest possible number of inversions in the array.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda inversiyalarning eng ko‘p sonini chiqaring.",
  outputEn: "For each test case print the largest number of inversions on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "every a_i is 0 or 1", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "har bir a_i 0 yoki 1", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n4\n0 1 0 0\n3\n1 1 1\n2\n0 0\n"],
  expect: ["4\n2\n1\n"],
  sampleNotesUz: [
    "Birinchi testda birinchi 0 ni 1 ga aylantirsak, 1 1 0 0 hosil bo‘ladi — 4 ta inversiya. Ikkinchi testda oxirgi 1 ni 0 ga aylantiramiz: 1 1 0, ikkita inversiya. Uchinchi testda 1 0 ga aylantirib bitta inversiya olamiz.",
  ],
  sampleNotesEn: [
    "In the first test turning the first 0 into a 1 gives 1 1 0 0 with 4 inversions. In the second, turning the last 1 into a 0 gives 1 1 0 with two. In the third, making it 1 0 gives one.",
  ],
  testInputs: ["3\n4\n0 1 0 0\n3\n1 1 1\n2\n0 0\n", "1\n2\n1 0\n", "1\n1\n0\n", "1\n6\n1 1 1 0 0 0\n", "2\n7\n0 1 0 1 0 1 0\n5\n0 0 1 1 1\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;vector<long long>zr(n+1,0);for(int i=n-1;i>=0;--i)zr[i]=zr[i+1]+(a[i]==0);
long long inv=0,ones=0,gain=0;for(int i=0;i<n;++i){if(a[i]==1)inv+=zr[i+1];
 long long z=zr[i+1];gain=max(gain,a[i]==0?z-ones:ones-z);if(a[i]==1)++ones;}
cout<<inv+gain<<"\\n";}`,
  wrongNote: "Insisting on one flip makes things worse when every flip loses inversions; trying only to turn 0s into 1s ignores the array that has no 0 at all.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;vector<long long>zr(n+1,0);for(int i=n-1;i>=0;--i)zr[i]=zr[i+1]+(a[i]==0);
long long inv=0,ones=0,gain=LLONG_MIN;for(int i=0;i<n;++i){if(a[i]==1)inv+=zr[i+1];
 long long z=zr[i+1];gain=max(gain,a[i]==0?z-ones:ones-z);if(a[i]==1)++ones;}
cout<<inv+gain<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;vector<long long>zr(n+1,0);for(int i=n-1;i>=0;--i)zr[i]=zr[i+1]+(a[i]==0);
long long inv=0,ones=0,gain=0;for(int i=0;i<n;++i){if(a[i]==1)inv+=zr[i+1];
 long long z=zr[i+1];if(a[i]==0)gain=max(gain,z-ones);if(a[i]==1)++ones;}
cout<<inv+gain<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 0, 1)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
auto count=[&](){long long c=0,o=0;for(int v:a){if(v==0)c+=o;else ++o;}return c;};
long long best=count();for(int i=0;i<n;++i){a[i]^=1;best=max(best,count());a[i]^=1;}
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "one long random array", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 0, 1))` },
    { seed: 2, note: "ones then zeros: about 10^10 inversions", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line([1] * (n // 2) + [0] * (n // 2))` },
  ],
});

export default P;
