/* Batch 333 — ten problems at the top of the ladder, C333–C342.
 *
 * The insane tier was the thinnest band in the bank. Digit DP, bitmask DP,
 * sparse tables, tree DP, matrix exponentiation, sqrt decomposition and a
 * couple of counting arguments that need a modulus.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C333", judge: "digit-dp-divisible-sum", topic: "advanced-cp", rating: 2100,
  tag: "Digit DP", timeLimitMs: 2000,
  uz: "Raqamlari yig‘indisi d ga bo‘linadigan sonlar",
  en: "Numbers whose digit sum divides by d",
  statementUz: "Sizga n va d butun sonlari berilgan. 1 dan n gacha bo‘lgan sonlar orasida raqamlari yig‘indisi d ga qoldiqsiz bo‘linadiganlari nechta ekanini sanang. n 10^18 gacha borgani uchun sonlarni birma-bir ko‘rib chiqib bo‘lmaydi: javobni sonning raqamlari bo‘yicha chapdan o‘ngga qurish kerak, har bir qadamda hozirgacha yig‘ilgan qoldiqni va prefiks hali ham n ning prefiksiga teng turganini eslab qolgan holda.",
  statementEn: "You are given integers n and d. Count the numbers from 1 to n whose digits sum to a multiple of d. Since n goes up to 10^18 the numbers cannot be examined one by one: the answer has to be built digit by digit from the left, remembering at each step the remainder collected so far and whether the prefix still matches the prefix of n.",
  inputUz: "Yagona qatorda ikkita n va d butun soni beriladi.",
  inputEn: "The only line contains two integers n and d.",
  outputUz: "Yagona butun sonni chiqaring — raqamlari yig‘indisi d ga bo‘linadigan sonlar soni.",
  outputEn: "Print a single integer — how many numbers have a digit sum divisible by d.",
  constraintList: ["1 ≤ n ≤ 10^18", "1 ≤ d ≤ 100", "the answer can reach 10^18 and needs a 64-bit type", "the number 0 is not in the range and is never counted"],
  constraintListUz: ["1 ≤ n ≤ 10^18", "1 ≤ d ≤ 100", "javob 10^18 ga yetishi mumkin va 64-bitli turni talab qiladi", "0 soni oraliqqa kirmaydi va hech qachon sanalmaydi"],
  sampleInputs: ["20 5\n", "9 10\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "20 gacha raqamlari yig‘indisi 5 ga bo‘linadigan sonlar: 5 (yig‘indi 5), 14 (1 + 4 = 5) va 19 (1 + 9 = 10). Uchtasi. E'tibor bering, 10 ning yig‘indisi 1, 20 niki esa 2 — ikkalasi ham mos kelmaydi.",
    "9 gacha bo‘lgan har bir sonning raqamlari yig‘indisi 1 dan 9 gacha, ya'ni hech qachon 10 ga bo‘linmaydi. Yig‘indi 0 bo‘ladigan yagona son — 0 ning o‘zi, u esa oraliqqa kirmaydi, shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "Up to 20 the numbers whose digit sum divides by 5 are 5 (sum 5), 14 (1 + 4 = 5) and 19 (1 + 9 = 10) — three of them. Note that 10 sums to 1 and 20 sums to 2, so neither qualifies.",
    "Every number up to 9 has a digit sum between 1 and 9, so none is a multiple of 10. The only number with digit sum 0 is 0 itself, which is outside the range, so the answer is 0.",
  ],
  testInputs: ["20 5\n", "9 10\n", "1 1\n", "1000000000000000000 1\n", "100 3\n", "999999999999999999 9\n"],
  sol: `string s;long long d;cin>>s>>d;int L=s.size();
vector<vector<vector<long long>>>memo(L+1,vector<vector<long long>>(d,vector<long long>(2,-1)));
function<long long(int,int,int)>go=[&](int i,int rem,int tight)->long long{
 if(i==L)return rem==0?1:0;
 long long&m=memo[i][rem][tight];if(m>=0)return m;
 int hi=tight?(s[i]-'0'):9;long long r=0;
 for(int dig=0;dig<=hi;++dig)r+=go(i+1,(rem+dig)%d,(tight&&dig==hi)?1:0);
 return m=r;};
// go() counts 0 as well, since every digit may be zero; the range starts at 1.
long long ans=go(0,0,1)-1;
cout<<ans<<"\\n";`,
  wrongNote: "Leaving the count of 0 in overshoots by exactly one; dropping the tight flag counts numbers past n.",
  wrong: [
    `string s;long long d;cin>>s>>d;int L=s.size();
vector<vector<vector<long long>>>memo(L+1,vector<vector<long long>>(d,vector<long long>(2,-1)));
function<long long(int,int,int)>go=[&](int i,int rem,int tight)->long long{
 if(i==L)return rem==0?1:0;
 long long&m=memo[i][rem][tight];if(m>=0)return m;
 int hi=tight?(s[i]-'0'):9;long long r=0;
 for(int dig=0;dig<=hi;++dig)r+=go(i+1,(rem+dig)%d,(tight&&dig==hi)?1:0);
 return m=r;};
cout<<go(0,0,1)<<"\\n";`,
    `string s;long long d;cin>>s>>d;int L=s.size();
vector<vector<long long>>memo(L+1,vector<long long>(d,-1));
function<long long(int,int)>go=[&](int i,int rem)->long long{
 if(i==L)return rem==0?1:0;
 long long&m=memo[i][rem];if(m>=0)return m;
 long long r=0;for(int dig=0;dig<=9;++dig)r+=go(i+1,(rem+dig)%d);
 return m=r;};
cout<<go(0,0)-1<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C334", judge: "bitmask-min-cost-cover", topic: "advanced-cp", rating: 2100,
  tag: "Bitmask DP", timeLimitMs: 2000,
  uz: "To‘plamni eng arzon qoplash",
  en: "Covering the set for the least money",
  statementUz: "Sizda n ta mahorat va m ta kurs bor. Har bir kurs ma'lum bir mahoratlar to‘plamini beradi va ma'lum narxda turadi. Barcha n ta mahoratni egallash uchun kerak bo‘ladigan eng kichik umumiy narxni toping. Bitta kursni bir necha marta sotib olishdan foyda yo‘q, mahorat esa bir nechta kursda takrorlanishi mumkin — muhimi, oxirida hammasi qoplansin.",
  statementEn: "You have n skills to acquire and m courses available. Each course teaches some set of skills and costs a certain amount. Find the smallest total cost of acquiring all n skills. Buying the same course twice is never useful, and a skill may be taught by several courses — what matters is that every skill is covered in the end.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida avval kurs narxi c, so‘ng n ta belgidan iborat 0 va 1 lardan tuzilgan satr keladi: i-belgi 1 bo‘lsa, kurs i-mahoratni beradi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains the cost c of a course followed by a string of n characters of 0 and 1: the i-th character is 1 when the course teaches skill i.",
  outputUz: "Yagona butun sonni chiqaring — barcha mahoratlarni egallashning eng kichik narxi. Agar barcha mahoratlarni qoplab bo‘lmasa, -1 chiqaring.",
  outputEn: "Print a single integer — the smallest cost of acquiring every skill. If the skills cannot all be covered, print -1 instead.",
  constraintList: ["1 ≤ n ≤ 18", "1 ≤ m ≤ 100", "1 ≤ c ≤ 10^6", "the answer can reach 10^8 and fits in a 64-bit type", "2^18 subsets is what makes the search feasible"],
  constraintListUz: ["1 ≤ n ≤ 18", "1 ≤ m ≤ 100", "1 ≤ c ≤ 10^6", "javob 10^8 ga yetishi mumkin va 64-bitli turga sig‘adi", "2^18 ta qism to‘plam qidiruvni amaliy qiladi"],
  sampleInputs: ["3 3\n5 110\n4 011\n9 111\n", "2 1\n7 10\n"],
  expect: ["9\n", "-1\n"],
  sampleNotesUz: [
    "Birinchi ikki kursni olsak, 110 va 011 birgalikda uchala mahoratni ham qoplaydi va 5 + 4 = 9 turadi. Uchinchi kurs yolg‘iz o‘zi hammasini qoplaydi, lekin u ham 9 turadi — narxlar teng, shuning uchun javob 9. Ikkinchi mahorat ikkala kursda ham bor, bu esa hech narsani buzmaydi.",
    "Yagona kurs faqat birinchi mahoratni beradi, ikkinchisini esa hech kim o‘rgatmaydi. Qanday tanlov qilinmasin, to‘plamni to‘liq qoplab bo‘lmaydi, shuning uchun javob -1.",
  ],
  sampleNotesEn: [
    "Taking the first two courses covers all three skills, since 110 and 011 together fill every position, and costs 5 + 4 = 9. The third course covers everything alone but also costs 9, so the answer is 9 either way. The second skill appears in both chosen courses, which does no harm.",
    "The only course teaches the first skill and nothing teaches the second. No choice covers the set, so the answer is -1.",
  ],
  testInputs: ["3 3\n5 110\n4 011\n9 111\n", "2 1\n7 10\n", "1 1\n1 1\n", "4 2\n3 1100\n3 0011\n", "3 3\n1 100\n1 010\n1 001\n", "2 2\n10 11\n1 10\n"],
  sol: `int n,m;cin>>n>>m;vector<long long>cost(m);vector<int>mask(m,0);
for(int i=0;i<m;++i){string t;cin>>cost[i]>>t;
 for(int b=0;b<n;++b)if(t[b]=='1')mask[i]|=(1<<b);}
const long long INF=(long long)4e18;
vector<long long>dp(1<<n,INF);dp[0]=0;
for(int s=0;s<(1<<n);++s){if(dp[s]==INF)continue;
 for(int i=0;i<m;++i){int t=s|mask[i];if(dp[s]+cost[i]<dp[t])dp[t]=dp[s]+cost[i];}}
long long r=dp[(1<<n)-1];
cout<<(r>=INF?-1:r)<<"\\n";`,
  wrongNote: "Taking the cheapest course that adds anything is greedy and not optimal; counting courses instead of their cost answers a different question.",
  wrong: [
    `int n,m;cin>>n>>m;vector<long long>cost(m);vector<int>mask(m,0);
for(int i=0;i<m;++i){string t;cin>>cost[i]>>t;
 for(int b=0;b<n;++b)if(t[b]=='1')mask[i]|=(1<<b);}
int have=0;long long total=0;int full=(1<<n)-1;
while(have!=full){int pick=-1;
 for(int i=0;i<m;++i)if((mask[i]&~have)&&(pick<0||cost[i]<cost[pick]))pick=i;
 if(pick<0){cout<<-1<<"\\n";return 0;}
 have|=mask[pick];total+=cost[pick];}
cout<<total<<"\\n";`,
    `int n,m;cin>>n>>m;vector<long long>cost(m);vector<int>mask(m,0);
for(int i=0;i<m;++i){string t;cin>>cost[i]>>t;
 for(int b=0;b<n;++b)if(t[b]=='1')mask[i]|=(1<<b);}
const long long INF=(long long)4e18;
vector<long long>dp(1<<n,INF);dp[0]=0;
for(int s=0;s<(1<<n);++s){if(dp[s]==INF)continue;
 for(int i=0;i<m;++i){int t=s|mask[i];if(dp[s]+1<dp[t])dp[t]=dp[s]+1;}}
long long r=dp[(1<<n)-1];
cout<<(r>=INF?-1:r)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C335", judge: "sparse-max-queries", topic: "advanced-cp", rating: 2100,
  tag: "Sparse table", timeLimitMs: 2000,
  uz: "O‘zgarmas massivda oraliq maksimumi",
  en: "Range maxima on a fixed array",
  statementUz: "Sizga hech qachon o‘zgarmaydigan n ta butun sondan iborat massiv va q ta so‘rov berilgan. Har bir so‘rovda l va r indekslari beriladi va a_l, a_{l+1}, …, a_r orasidagi eng katta qiymat so‘raladi; oraliqning ikkala cheti ham kiradi. n ham, q ham 2·10^5 gacha borgani uchun har bir so‘rovni oraliq bo‘ylab yurib bajarish vaqtida ulgurmaydi — uzunligi ikkining darajasi bo‘lgan bloklar ustidagi maksimumlarni oldindan hisoblab qo‘yish kerak.",
  statementEn: "You are given an array of n integers that never changes, and q queries. Each query gives indices l and r and asks for the largest value among a_l, a_{l+1}, …, a_r, with both ends included. Since n and q both go up to 2·10^5, walking the range for every query will not finish in time — the maxima over blocks whose length is a power of two have to be precomputed.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Ikkinchi qatorda n ta butun son keladi. Keyingi q qatorning har birida bitta so‘rovni tavsiflovchi ikkita l va r butun soni bo‘ladi.",
  inputEn: "The first line contains two integers n and q. The second line contains n integers. Each of the next q lines contains two integers l and r describing one query.",
  outputUz: "q ta qator chiqaring. i-chi qatorda i-chi so‘rov oralig‘idagi maksimum, so‘rovlar berilgan tartibda bo‘lishi kerak.",
  outputEn: "Print q lines. The i-th line must contain the maximum on the range of the i-th query, in the order the queries were given.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "−10^9 ≤ a_i ≤ 10^9", "the array is never modified"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "−10^9 ≤ a_i ≤ 10^9", "massiv hech qachon o‘zgarmaydi"],
  sampleInputs: ["5 3\n3 1 4 1 5\n2 4\n1 5\n5 5\n", "1 1\n-7\n1 1\n"],
  expect: ["4\n5\n5\n", "-7\n"],
  sampleNotesUz: [
    "2..4 oralig‘i 1, 4 va 1 ni saqlaydi, maksimumi 4. Butun massivning maksimumi 5, 5..5 oralig‘i esa faqat bitta elementdan iborat va uning o‘zi javob bo‘ladi — oxirgi qatorda 5 turadi.",
    "Bitta elementli massivda har qanday so‘rov o‘sha elementni qaytaradi. Manfiy qiymat maksimumni -10^9 dan boshlab qo‘yish kerakligini eslatadi: 0 dan boshlansa, javob noto‘g‘ri 0 bo‘lib qolardi.",
  ],
  sampleNotesEn: [
    "The range 2..4 holds 1, 4 and 1, whose maximum is 4. The whole array has maximum 5, and the range 5..5 holds a single element which is its own answer.",
    "On a one-element array every query returns that element. The negative value is a reminder to seed a running maximum from −10^9 rather than from 0, which would wrongly answer 0 here.",
  ],
  testInputs: ["5 3\n3 1 4 1 5\n2 4\n1 5\n5 5\n", "1 1\n-7\n1 1\n", "4 2\n-1 -2 -3 -4\n1 4\n2 3\n", "6 3\n1 2 3 4 5 6\n1 1\n1 6\n3 5\n", "3 3\n5 5 5\n1 2\n2 3\n1 3\n", "8 2\n-5 -4 -3 -2 -1 0 1 2\n1 4\n5 8\n"],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
int LOG=1;while((1<<LOG)<=n)++LOG;
vector<vector<long long>>sp(LOG,vector<long long>(n));
sp[0]=a;
for(int k=1;k<LOG;++k)for(int i=0;i+(1<<k)<=n;++i)
 sp[k][i]=max(sp[k-1][i],sp[k-1][i+(1<<(k-1))]);
while(q--){int l,r;cin>>l>>r;--l;--r;
 int k=0;while((1<<(k+1))<=r-l+1)++k;
 cout<<max(sp[k][l],sp[k][r-(1<<k)+1])<<"\\n";}`,
  wrongNote: "Covering the range with one block instead of two overlapping ones misses everything past its end; seeding the running maximum at zero breaks on negatives.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
int LOG=1;while((1<<LOG)<=n)++LOG;
vector<vector<long long>>sp(LOG,vector<long long>(n));
sp[0]=a;
for(int k=1;k<LOG;++k)for(int i=0;i+(1<<k)<=n;++i)
 sp[k][i]=max(sp[k-1][i],sp[k-1][i+(1<<(k-1))]);
while(q--){int l,r;cin>>l>>r;--l;--r;
 int k=0;while((1<<(k+1))<=r-l+1)++k;
 cout<<sp[k][l]<<"\\n";}`,
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
while(q--){int l,r;cin>>l>>r;--l;--r;long long best=0;
 for(int i=l;i<=r;++i)best=max(best,a[i]);
 cout<<best<<"\\n";}`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C336", judge: "tree-dp-max-matching", topic: "trees", rating: 2200,
  tag: "Tree DP", timeLimitMs: 2000,
  uz: "Daraxtdagi eng katta moslashtirish",
  en: "Largest matching in a tree",
  statementUz: "Sizga n ta uchdan iborat daraxt berilgan. Qirralarning shunday eng katta to‘plamini tanlangki, ulardan hech qaysi ikkitasi umumiy uchga ega bo‘lmasin. Bunday to‘plam moslashtirish deyiladi va sizdan uning eng katta o‘lchami, ya'ni tanlanishi mumkin bo‘lgan qirralarning eng ko‘p soni so‘raladi. Har bir uch ko‘pi bilan bitta tanlangan qirraga tegib turishi mumkin.",
  statementEn: "You are given a tree with n nodes. Choose as large a set of edges as possible so that no two chosen edges share a node. Such a set is called a matching, and what is asked for is its largest possible size — the greatest number of edges that can be chosen. Each node may touch at most one chosen edge.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n − 1 qatorning har birida a va b uchlari orasidagi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains one integer n. Each of the next n − 1 lines contains two integers a and b, an edge between nodes a and b.",
  outputUz: "Yagona butun sonni chiqaring — eng katta moslashtirishdagi qirralar soni. Qirra bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of edges in a largest matching. If there is no edge, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "the given edges always form a tree", "the answer never exceeds n/2"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "berilgan qirralar har doim daraxt hosil qiladi", "javob hech qachon n/2 dan oshmaydi"],
  sampleInputs: ["5\n1 2\n1 3\n3 4\n3 5\n", "2\n1 2\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "1–2 va 3–4 qirralarini tanlash mumkin: ular umumiy uchga ega emas, ya'ni ikkita qirra. Uchtasini tanlab bo‘lmaydi — 3-uch 1–3, 3–4 va 3–5 qirralarining uchalasida qatnashadi, shuning uchun ulardan ko‘pi bilan bittasi olinadi.",
    "Yagona qirra o‘zi moslashtirish hosil qiladi, shuning uchun javob 1.",
  ],
  sampleNotesEn: [
    "The edges 1–2 and 3–4 can both be chosen: they share no node, giving two. Three is impossible — node 3 belongs to the edges 1–3, 3–4 and 3–5, so at most one of those may be taken.",
    "A single edge is a matching on its own, so the answer is 1.",
  ],
  testInputs: ["5\n1 2\n1 3\n3 4\n3 5\n", "2\n1 2\n", "1\n", "4\n1 2\n2 3\n3 4\n", "7\n1 2\n1 3\n1 4\n1 5\n1 6\n1 7\n", "6\n1 2\n2 3\n3 4\n4 5\n5 6\n"],
  sol: `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);vector<char>seen(n+1,0);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
// free[v] -- best in v's subtree with v unmatched; used[v] -- with v matched.
vector<long long>fre(n+1,0),usd(n+1,0);
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 long long sum=0,gain=0;
 for(int u:g[v])if(u!=par[v])sum+=max(fre[u],usd[u]);
 for(int u:g[v])if(u!=par[v])gain=max(gain,1+fre[u]-max(fre[u],usd[u]));
 fre[v]=sum;usd[v]=sum+gain;}
cout<<max(fre[1],usd[1])<<"\\n";`,
  wrongNote: "Matching every node to its parent without marking the parent taken lets one parent be used many times; halving the node count ignores the shape entirely.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<char>used(n+1,0);long long c=0;
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 if(!used[v]&&par[v]!=0){used[v]=1;++c;}}
cout<<c<<"\\n";`,
    `int n;cin>>n;for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;}
cout<<n/2<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C337", judge: "matrix-power-tribonacci", topic: "advanced-cp", rating: 2200,
  tag: "Matrix exponentiation", timeLimitMs: 2000,
  uz: "Katta tribonachchi soni",
  en: "Tribonacci at scale",
  statementUz: "Tribonachchi ketma-ketligi T(1) = T(2) = 1, T(3) = 2 bilan boshlanadi va n ≥ 4 uchun T(n) = T(n−1) + T(n−2) + T(n−3) qoidasiga bo‘ysunadi. Sizga n berilgan; T(n) ning 10^9 + 7 ga bo‘lgan qoldig‘ini toping. n 10^18 gacha borgani uchun hadlarni birma-bir hisoblab bo‘lmaydi: qadamni 3×3 matritsaga ko‘paytirish sifatida yozib, matritsani tez darajaga ko‘tarish kerak.",
  statementEn: "The Tribonacci sequence starts T(1) = T(2) = 1 and T(3) = 2, and follows T(n) = T(n−1) + T(n−2) + T(n−3) for n ≥ 4. Given n, find T(n) modulo 10^9 + 7. Since n goes up to 10^18 the terms cannot be computed one at a time: the step has to be written as a multiplication by a 3×3 matrix and that matrix raised to a power quickly.",
  inputUz: "Yagona qatorda bitta n butun soni beriladi.",
  inputEn: "The only line contains one integer n.",
  outputUz: "Yagona butun sonni chiqaring — T(n) ning 10^9 + 7 modul bo‘yicha qiymati.",
  outputEn: "Print a single integer — the value of T(n) modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^18", "T(1) = T(2) = 1 and T(3) = 2", "the answer is required modulo 10^9 + 7", "a linear loop over n would not finish in time"],
  constraintListUz: ["1 ≤ n ≤ 10^18", "T(1) = T(2) = 1 va T(3) = 2", "javob 10^9 + 7 modul bo‘yicha talab qilinadi", "n bo‘ylab chiziqli tsikl vaqtida tugamaydi"],
  sampleInputs: ["7\n", "1\n"],
  expect: ["24\n", "1\n"],
  sampleNotesUz: [
    "Ketma-ketlik 1, 1, 2, 4, 7, 13, 24 bo‘lib boradi: har bir had oldingi uchtasining yig‘indisi. Yettinchi had 24 — bu kichik holatni qo‘lda tekshirib, tez usul to‘g‘ri ishlayotganiga ishonch hosil qilish mumkin.",
    "T(1) ta'rifga ko‘ra 1 ga teng. Dastlabki uchta had rekurrentga bo‘ysunmaydi, shuning uchun ularni alohida qaytarish kerak — matritsani darajaga ko‘tarish faqat to‘rtinchi haddan boshlab ma'noga ega.",
  ],
  sampleNotesEn: [
    "The sequence runs 1, 1, 2, 4, 7, 13, 24: each term is the sum of the previous three. The seventh is 24 — a small case that can be checked by hand against the fast method.",
    "T(1) is 1 by definition. The first three terms do not follow the recurrence, so they have to be answered directly — raising the matrix to a power only makes sense from the fourth term on.",
  ],
  testInputs: ["7\n", "1\n", "2\n", "3\n", "1000000000000000000\n", "50\n"],
  sol: `long long n;cin>>n;const long long M=1000000007;
if(n<=2){cout<<1<<"\\n";return 0;}
if(n==3){cout<<2<<"\\n";return 0;}
auto mul=[&](array<long long,9>A,array<long long,9>B){array<long long,9>C{};
 for(int i=0;i<3;++i)for(int k=0;k<3;++k){if(!A[i*3+k])continue;
  for(int j=0;j<3;++j)C[i*3+j]=(C[i*3+j]+A[i*3+k]*B[k*3+j])%M;}
 return C;};
array<long long,9>r{1,0,0,0,1,0,0,0,1},b{1,1,1,1,0,0,0,1,0};
long long e=n-3;
while(e>0){if(e&1)r=mul(r,b);b=mul(b,b);e>>=1;}
// The vector at the base is (T(3), T(2), T(1)) = (2, 1, 1).
cout<<(r[0]*2+r[1]*1+r[2]*1)%M<<"\\n";`,
  wrongNote: "One power too many walks past the term asked for; a linear loop is right but cannot finish at this scale, so it is capped and answers the wrong term.",
  wrong: [
    `long long n;cin>>n;const long long M=1000000007;
if(n<=2){cout<<1<<"\\n";return 0;}
if(n==3){cout<<2<<"\\n";return 0;}
auto mul=[&](array<long long,9>A,array<long long,9>B){array<long long,9>C{};
 for(int i=0;i<3;++i)for(int k=0;k<3;++k){if(!A[i*3+k])continue;
  for(int j=0;j<3;++j)C[i*3+j]=(C[i*3+j]+A[i*3+k]*B[k*3+j])%M;}
 return C;};
array<long long,9>r{1,0,0,0,1,0,0,0,1},b{1,1,1,1,0,0,0,1,0};
long long e=n-2;
while(e>0){if(e&1)r=mul(r,b);b=mul(b,b);e>>=1;}
cout<<(r[0]*2+r[1]*1+r[2]*1)%M<<"\\n";`,
    `long long n;cin>>n;const long long M=1000000007;
if(n<=2){cout<<1<<"\\n";return 0;}
if(n==3){cout<<2<<"\\n";return 0;}
long long a=1,b=1,c=2;
long long steps=min(n-3,(long long)1000000);
for(long long i=0;i<steps;++i){long long d=(a+b+c)%M;a=b;b=c;c=d;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C338", judge: "count-subarrays-k-distinct", topic: "two-pointers", rating: 2200,
  tag: "Sliding window", timeLimitMs: 2000,
  uz: "Aynan k xil qiymatli qism massivlar",
  en: "Subarrays with exactly k distinct values",
  statementUz: "Sizga n ta butun sondan iborat massiv va k soni berilgan. Ichida aynan k xil qiymat uchraydigan uzluksiz qism massivlarni sanang. Qism massiv chetlari bilan aniqlanadi, shuning uchun bir xil qiymatlarni saqlaydigan ikki har xil oraliq alohida sanaladi. To‘g‘ridan-to‘g‘ri sanash juda sekin; aynan k ni ko‘pi bilan k dan ko‘pi bilan k−1 ni ayirish orqali topish qulay.",
  statementEn: "You are given an array of n integers and a number k. Count the contiguous subarrays that contain exactly k distinct values. A subarray is identified by its endpoints, so two different ranges holding the same values count separately. Counting them directly is far too slow; the usual route is to subtract the count for at most k−1 from the count for at most k.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — ichida aynan k xil qiymat bo‘lgan qism massivlar soni. Bunday qism massiv bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of subarrays containing exactly k distinct values. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ n", "1 ≤ a_i ≤ 10^9", "the answer can reach about 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ n", "1 ≤ a_i ≤ 10^9", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5 2\n1 2 1 2 3\n", "3 3\n1 1 1\n"],
  expect: ["7\n", "0\n"],
  sampleNotesUz: [
    "Aynan ikki xil qiymat saqlaydigan oraliqlar: [1,2], [2,1], [1,2] (3–4), [1,2,1], [2,1,2], [1,2,1,2] va [2,3]. Jami yettita. E'tibor bering, bir xil qiymatlar to‘plamiga ega bo‘lsa ham, har xil chetlardagi oraliqlar alohida sanaladi.",
    "Massivda umuman bitta xil qiymat bor, shuning uchun uchta har xil qiymatli oraliq hosil bo‘lishi mumkin emas va javob 0.",
  ],
  sampleNotesEn: [
    "The ranges holding exactly two distinct values are [1,2], [2,1], the [1,2] at positions 3–4, [1,2,1], [2,1,2], [1,2,1,2] and [2,3] — seven in all. Ranges with different endpoints count separately even when they hold the same set of values.",
    "The array holds only one distinct value, so no range can contain three of them and the answer is 0.",
  ],
  testInputs: ["5 2\n1 2 1 2 3\n", "3 3\n1 1 1\n", "1 1\n5\n", "4 1\n1 1 1 1\n", "6 3\n1 2 3 1 2 3\n", "5 5\n1 2 3 4 5\n"],
  sol: `int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
auto atMost=[&](int lim)->long long{if(lim<=0)return 0;
 unordered_map<long long,int>cnt;long long res=0;int l=0,d=0;
 for(int r=0;r<n;++r){if(++cnt[a[r]]==1)++d;
  while(d>lim){if(--cnt[a[l]]==0)--d;++l;}
  res+=r-l+1;}
 return res;};
cout<<atMost(k)-atMost(k-1)<<"\\n";`,
  wrongNote: "Reporting at-most-k counts every smaller variety too; shrinking the window on the wrong comparison lets it hold k+1 kinds.",
  wrong: [
    `int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
auto atMost=[&](int lim)->long long{if(lim<=0)return 0;
 unordered_map<long long,int>cnt;long long res=0;int l=0,d=0;
 for(int r=0;r<n;++r){if(++cnt[a[r]]==1)++d;
  while(d>lim){if(--cnt[a[l]]==0)--d;++l;}
  res+=r-l+1;}
 return res;};
cout<<atMost(k)<<"\\n";`,
    `int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
auto atMost=[&](int lim)->long long{if(lim<=0)return 0;
 unordered_map<long long,int>cnt;long long res=0;int l=0,d=0;
 for(int r=0;r<n;++r){if(++cnt[a[r]]==1)++d;
  while(d>lim+1){if(--cnt[a[l]]==0)--d;++l;}
  res+=r-l+1;}
 return res;};
cout<<atMost(k)-atMost(k-1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C339", judge: "dsu-offline-connectivity", topic: "advanced-cp", rating: 2300,
  tag: "Offline DSU", timeLimitMs: 2000,
  uz: "Qirralarni o‘chirib borish",
  en: "Connectivity as edges are removed",
  statementUz: "Sizga n ta uchi va m ta qirrasi bo‘lgan yo‘naltirilmagan graf berilgan. So‘ng qirralar berilgan tartibda birma-bir o‘chiriladi. Har bir o‘chirishdan keyin grafda nechta bog‘langan komponenta qolganini chiqaring; boshlang‘ich holat uchun ham bitta son chiqariladi. Qirralarni o‘chirish DSU uchun qiyin amal, shuning uchun so‘rovlarni teskari tartibda ko‘rib chiqish — ya'ni o‘chirishni qo‘shishga aylantirish — qulay.",
  statementEn: "You are given an undirected graph with n vertices and m edges. The edges are then removed one at a time in the given order. After each removal print how many connected components the graph has, and print one value for the starting state as well. Removing an edge is the hard direction for a disjoint-set structure, so the usual route is to process the removals backwards, turning each one into an addition.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a va b uchlarini bog‘lovchi qirra keladi. Qirralar berilgan tartibda o‘chiriladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains an edge joining vertices a and b. The edges are removed in the order given.",
  outputUz: "m + 1 ta qator chiqaring: birinchisida barcha qirralar joyida turgandagi komponentalar soni, keyingilarida esa har bir o‘chirishdan keyingi son.",
  outputEn: "Print m + 1 lines: the number of components with every edge present, then the number after each removal in turn.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "every edge is removed exactly once", "the component count never decreases as edges are removed"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "har bir qirra aynan bir marta o‘chiriladi", "qirralar o‘chirilgani sari komponentalar soni hech qachon kamaymaydi"],
  sampleInputs: ["4 3\n1 2\n2 3\n3 4\n", "2 1\n1 2\n"],
  expect: ["1\n2\n3\n4\n", "1\n2\n"],
  sampleNotesUz: [
    "Boshida zanjir 1–2–3–4 bitta komponenta. 1–2 qirrasi o‘chgach ikkita bo‘ladi, 2–3 o‘chgach uchta, oxirgisi ham o‘chgach har bir uch yakka qoladi — to‘rtta. Har bir o‘chirish komponentalar sonini aynan bittaga oshirmoqda, chunki daraxtdagi har bir qirra ko‘prik.",
    "Yagona qirra o‘chirilgunicha ikkita uch bitta komponentani hosil qiladi, o‘chgandan keyin esa ikkita alohida uch qoladi.",
  ],
  sampleNotesEn: [
    "The chain 1–2–3–4 starts as one component. Removing 1–2 makes two, removing 2–3 makes three, and removing the last leaves every vertex alone — four. Each removal adds exactly one component here because every edge of a tree is a bridge.",
    "Two vertices form one component while the single edge is present, and two separate vertices once it is gone.",
  ],
  testInputs: ["4 3\n1 2\n2 3\n3 4\n", "2 1\n1 2\n", "1 0\n", "3 3\n1 2\n2 3\n1 3\n", "5 2\n1 2\n4 5\n", "4 4\n1 2\n1 2\n3 4\n3 4\n"],
  sol: `int n,m;cin>>n>>m;vector<int>A(m),B(m);
for(int i=0;i<m;++i)cin>>A[i]>>B[i];
vector<int>p(n+1);for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
vector<long long>ans(m+1);
long long comp=n;
// Backwards: the last state has no edges, and each step re-adds one edge.
ans[m]=comp;
for(int i=m-1;i>=0;--i){int ra=f(A[i]),rb=f(B[i]);
 if(ra!=rb){p[ra]=rb;--comp;}
 ans[i]=comp;}
for(int i=0;i<=m;++i)cout<<ans[i]<<"\\n";`,
  wrongNote: "Walking the removals forwards and simply counting them assumes every edge is a bridge; rebuilding from scratch each time is correct but too slow, so it is capped and stops answering.",
  wrong: [
    `int n,m;cin>>n>>m;vector<int>A(m),B(m);
for(int i=0;i<m;++i)cin>>A[i]>>B[i];
vector<int>p(n+1);for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
long long comp=n;
for(int i=0;i<m;++i){int ra=f(A[i]),rb=f(B[i]);if(ra!=rb){p[ra]=rb;--comp;}}
cout<<comp<<"\\n";
for(int i=0;i<m;++i)cout<<comp+i+1<<"\\n";`,
    `int n,m;cin>>n>>m;vector<int>A(m),B(m);
for(int i=0;i<m;++i)cin>>A[i]>>B[i];
for(int removed=0;removed<=m;++removed){
 vector<int>p(n+1);for(int i=0;i<=n;++i)p[i]=i;
 function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
 long long comp=n;
 for(int i=removed;i<m;++i){int ra=f(A[i]),rb=f(B[i]);if(ra!=rb){p[ra]=rb;--comp;}}
 cout<<comp+1<<"\\n";}`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C340", judge: "count-paths-dag-mod", topic: "graphs", rating: 2300,
  tag: "DAG DP", timeLimitMs: 2000,
  uz: "Yo‘naltirilgan grafdagi yo‘llar soni",
  en: "Counting paths through a DAG",
  statementUz: "Sizga n ta uchi va m ta yo‘naltirilgan qirrasi bo‘lgan, sikli yo‘q graf berilgan. 1-uchdan n-uchgacha boradigan har xil yo‘llar sonini toping va uni 10^9 + 7 ga bo‘lgan qoldiq shaklida chiqaring. Ikki yo‘l ishlatilgan qirralar ketma-ketligi bilan farq qilsa, ular har xil hisoblanadi. Sikl yo‘qligi javobning chekli bo‘lishini kafolatlaydi.",
  statementEn: "You are given a directed graph with n vertices and m edges and no cycles. Count the distinct paths from vertex 1 to vertex n and print the count modulo 10^9 + 7. Two paths are different when the sequences of edges they use differ. The absence of cycles is what guarantees the count is finite.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a dan b ga yo‘naltirilgan qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains two integers a and b, a directed edge from a to b.",
  outputUz: "Yagona butun sonni chiqaring — 1-uchdan n-uchgacha bo‘lgan yo‘llar soni, 10^9 + 7 modul bo‘yicha. Yo‘l bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of paths from vertex 1 to vertex n, modulo 10^9 + 7. If there is no path, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "the graph never contains a directed cycle", "the answer is required modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "grafda hech qachon yo‘naltirilgan sikl bo‘lmaydi", "javob 10^9 + 7 modul bo‘yicha talab qilinadi"],
  sampleInputs: ["4 4\n1 2\n1 3\n2 4\n3 4\n", "3 1\n2 3\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "1-uchdan 4-uchga ikkita yo‘l bor: 1 → 2 → 4 va 1 → 3 → 4. Ular uzunligi bo‘yicha teng, lekin har xil qirralardan o‘tadi, shuning uchun ikkita alohida yo‘l sifatida sanaladi.",
    "1-uchdan chiqadigan birorta qirra yo‘q, shuning uchun 3-uchga yetib bo‘lmaydi va javob 0. Grafda qirra borligi 1-uchdan yo‘l borligini anglatmaydi.",
  ],
  sampleNotesEn: [
    "There are two paths from vertex 1 to vertex 4: 1 → 2 → 4 and 1 → 3 → 4. They have the same length but use different edges, so they count as two.",
    "No edge leaves vertex 1, so vertex 3 cannot be reached and the answer is 0. That the graph has edges at all does not mean any of them start where the path must.",
  ],
  testInputs: ["4 4\n1 2\n1 3\n2 4\n3 4\n", "3 1\n2 3\n", "1 0\n", "5 6\n1 2\n1 3\n2 4\n3 4\n4 5\n1 5\n", "2 1\n1 2\n", "6 5\n1 2\n2 3\n3 4\n4 5\n5 6\n"],
  sol: `int n,m;cin>>n>>m;const long long M=1000000007;
vector<vector<int>>g(n+1);vector<int>indeg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);++indeg[b];}
vector<long long>ways(n+1,0);ways[1]=1;
queue<int>q;for(int v=1;v<=n;++v)if(!indeg[v])q.push(v);
while(!q.empty()){int v=q.front();q.pop();
 for(int u:g[v]){ways[u]=(ways[u]+ways[v])%M;if(--indeg[u]==0)q.push(u);}}
cout<<ways[n]<<"\\n";`,
  wrongNote: "Seeding every source with one path counts routes that never start at vertex 1; counting edges reaching n is not counting paths.",
  wrong: [
    `int n,m;cin>>n>>m;const long long M=1000000007;
vector<vector<int>>g(n+1);vector<int>indeg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);++indeg[b];}
vector<long long>ways(n+1,0);
queue<int>q;for(int v=1;v<=n;++v)if(!indeg[v]){q.push(v);ways[v]=1;}
while(!q.empty()){int v=q.front();q.pop();
 for(int u:g[v]){ways[u]=(ways[u]+ways[v])%M;if(--indeg[u]==0)q.push(u);}}
cout<<ways[n]<<"\\n";`,
    `int n,m;cin>>n>>m;vector<int>into(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;++into[b];}
cout<<into[n]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C341", judge: "mo-range-mode-count", topic: "advanced-cp", rating: 2400,
  tag: "Sqrt decomposition", timeLimitMs: 3000,
  uz: "Oraliqdagi eng ko‘p uchragan qiymat",
  en: "How often the commonest value appears",
  statementUz: "Sizga n ta butun sondan iborat massiv va q ta so‘rov berilgan. Har bir so‘rovda l va r indekslari beriladi va o‘sha oraliqdagi eng ko‘p uchraydigan qiymat necha marta uchrashi so‘raladi — qiymatning o‘zi emas, uning chastotasi. Massiv o‘zgarmaydi va barcha so‘rovlar oldindan ma'lum, shuning uchun ularni qulay tartibda qayta joylashtirib, oynani asta-sekin siljitib javob berish mumkin.",
  statementEn: "You are given an array of n integers and q queries. Each query gives indices l and r and asks how often the commonest value in that range occurs — the frequency, not the value itself. The array never changes and all the queries are known in advance, so they can be reordered conveniently and answered by sliding a window a little at a time.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Ikkinchi qatorda n ta butun son keladi. Keyingi q qatorning har birida ikkita l va r butun soni bo‘ladi.",
  inputEn: "The first line contains two integers n and q. The second line contains n integers. Each of the next q lines contains two integers l and r.",
  outputUz: "q ta qator chiqaring. i-chi qatorda i-chi so‘rov oralig‘idagi eng katta chastota, so‘rovlar berilgan tartibda bo‘lishi kerak.",
  outputEn: "Print q lines. The i-th line must contain the largest frequency on the range of the i-th query, in the order the queries were given.",
  constraintList: ["1 ≤ n ≤ 2000", "1 ≤ q ≤ 2000", "1 ≤ l ≤ r ≤ n", "1 ≤ a_i ≤ 10^9", "the answer is between 1 and r − l + 1"],
  constraintListUz: ["1 ≤ n ≤ 2000", "1 ≤ q ≤ 2000", "1 ≤ l ≤ r ≤ n", "1 ≤ a_i ≤ 10^9", "javob 1 dan r − l + 1 gacha bo‘lgan oraliqda yotadi"],
  sampleInputs: ["6 3\n1 2 2 3 2 1\n1 3\n2 5\n1 6\n", "1 1\n9\n1 1\n"],
  expect: ["2\n3\n3\n", "1\n"],
  sampleNotesUz: [
    "1..3 oralig‘ida 1 bir marta, 2 ikki marta uchraydi — eng katta chastota 2. 2..5 oralig‘ida 2 uch marta uchraydi, demak 3. Butun massivda ham 2 uch marta uchraydi va bu eng ko‘pi, shuning uchun oxirgi javob ham 3.",
    "Bitta elementli oraliqda yagona qiymat bir marta uchraydi, ya'ni javob 1. Bu har qanday bo‘sh bo‘lmagan oraliq uchun eng kichik mumkin bo‘lgan javob.",
  ],
  sampleNotesEn: [
    "On 1..3 the value 1 occurs once and 2 occurs twice, so the largest frequency is 2. On 2..5 the value 2 occurs three times, giving 3. Over the whole array 2 still occurs three times and nothing occurs more, so the last answer is 3 as well.",
    "On a single-element range the one value occurs once, so the answer is 1 — the smallest possible answer for any non-empty range.",
  ],
  testInputs: ["6 3\n1 2 2 3 2 1\n1 3\n2 5\n1 6\n", "1 1\n9\n1 1\n", "5 2\n1 1 1 1 1\n1 5\n3 4\n", "4 3\n1 2 3 4\n1 4\n2 2\n1 2\n", "6 2\n5 5 1 1 5 5\n1 6\n3 4\n", "3 3\n7 7 7\n1 1\n1 2\n1 3\n"],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());s.erase(unique(s.begin(),s.end()),s.end());
vector<int>id(n);for(int i=0;i<n;++i)id[i]=lower_bound(s.begin(),s.end(),a[i])-s.begin();
while(q--){int l,r;cin>>l>>r;--l;--r;
 vector<int>cnt(s.size(),0);int best=0;
 for(int i=l;i<=r;++i)best=max(best,++cnt[id[i]]);
 cout<<best<<"\\n";}`,
  wrongNote: "Reporting the commonest value rather than how often it appears; counting distinct values answers the opposite question.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());s.erase(unique(s.begin(),s.end()),s.end());
vector<int>id(n);for(int i=0;i<n;++i)id[i]=lower_bound(s.begin(),s.end(),a[i])-s.begin();
while(q--){int l,r;cin>>l>>r;--l;--r;
 vector<int>cnt(s.size(),0);int best=0,who=0;
 for(int i=l;i<=r;++i){int c=++cnt[id[i]];if(c>best){best=c;who=id[i];}}
 cout<<s[who]<<"\\n";}`,
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
while(q--){int l,r;cin>>l>>r;--l;--r;
 set<long long>seen;for(int i=l;i<=r;++i)seen.insert(a[i]);
 cout<<(long long)seen.size()<<"\\n";}`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C342", judge: "count-binary-no-k-ones", topic: "advanced-cp", rating: 2400,
  tag: "Counting DP", timeLimitMs: 2000,
  uz: "Ketma-ket k ta birsiz satrlar",
  en: "Binary strings without k ones in a row",
  statementUz: "Sizga n va k butun sonlari berilgan. Uzunligi n bo‘lgan, ichida ketma-ket k ta bir uchramaydigan ikkilik satrlar nechta ekanini sanang. Boshqacha aytganda, satrda 1 lardan tuzilgan uzunligi k yoki undan katta blok bo‘lmasligi kerak. Javob tez o‘sadi, shuning uchun uni 10^9 + 7 ga bo‘lgan qoldiq shaklida chiqaring.",
  statementEn: "You are given integers n and k. Count the binary strings of length n — strings of n characters, each of which is 0 or 1 — that never contain k ones in a row. In other words, the string must hold no block of consecutive 1s whose length is k or more; blocks shorter than k are allowed and there may be any number of them. The count grows quickly, so print it modulo 10^9 + 7.",
  inputUz: "Yagona qatorda ikkita n va k butun soni beriladi.",
  inputEn: "The only line contains two integers n and k.",
  outputUz: "Yagona butun sonni chiqaring — shartni qanoatlantiruvchi satrlar soni, 10^9 + 7 modul bo‘yicha.",
  outputEn: "Print a single integer — the number of strings satisfying the condition, modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^6", "1 ≤ k ≤ n", "the answer is required modulo 10^9 + 7", "k = 1 forbids every 1, leaving exactly one string"],
  constraintListUz: ["1 ≤ n ≤ 10^6", "1 ≤ k ≤ n", "javob 10^9 + 7 modul bo‘yicha talab qilinadi", "k = 1 har qanday 1 ni taqiqlaydi va aynan bitta satr qoladi"],
  sampleInputs: ["4 2\n", "3 1\n"],
  expect: ["8\n", "1\n"],
  sampleNotesUz: [
    "Uzunligi 4 bo‘lgan 16 ta satrdan ketma-ket ikkita 1 uchramaydiganlari sakkiztasi: 0000, 0001, 0010, 0100, 0101, 1000, 1001 va 1010. Qolgan sakkiztasida \"11\" bloki bor. Bu Fibonachchi naqshi: ruxsat etilgan satrlar soni oldingi ikkitasining yig‘indisiga teng.",
    "k = 1 bo‘lganda hatto bitta 1 ham taqiqlanadi, shuning uchun yagona mumkin bo‘lgan satr — butunlay nollardan iborati. Javob 1.",
  ],
  sampleNotesEn: [
    "Of the 16 strings of length 4, eight never hold two 1s in a row: 0000, 0001, 0010, 0100, 0101, 1000, 1001 and 1010. The other eight contain a \"11\". This is the Fibonacci pattern — the count of allowed strings is the sum of the previous two.",
    "With k = 1 even a single 1 is forbidden, so the only possible string is all zeros and the answer is 1.",
  ],
  testInputs: ["4 2\n", "3 1\n", "1 1\n", "1 1\n", "10 3\n", "1000000 2\n"],
  sol: `long long n,k;cin>>n>>k;const long long M=1000000007;
// d[i] -- strings of length i with no run of k ones. Subtract the ones that
// place the first forbidden run starting right after a zero.
vector<long long>d(n+1,0),pre(n+2,0);
d[0]=1;pre[1]=1;
for(long long i=1;i<=n;++i){
 long long v=d[i-1];                 // put a 0 at the end
 // a tail of j ones (1 <= j <= min(i, k-1)) preceded by a 0 or the string start
 for(long long j=1;j<=k-1&&j<=i;++j){
  if(i-j-1>=0)v=(v+d[i-j-1])%M; else if(i-j==0)v=(v+1)%M;}
 d[i]=v;}
cout<<d[n]%M<<"\\n";`,
  wrongNote: "Forbidding exactly k ones but allowing longer runs, and the plain Fibonacci recurrence that only happens to be right when k is 2.",
  wrong: [
    `long long n,k;cin>>n>>k;const long long M=1000000007;
vector<long long>d(n+1,0);d[0]=1;
for(long long i=1;i<=n;++i){long long v=d[i-1];
 for(long long j=1;j<=k&&j<=i;++j){if(j==k)continue;
  if(i-j-1>=0)v=(v+d[i-j-1])%M; else if(i-j==0)v=(v+1)%M;}
 d[i]=v;}
cout<<(d[n]+1)%M<<"\\n";`,
    `long long n,k;cin>>n>>k;const long long M=1000000007;
long long a=1,b=2;
if(n==1){cout<<2%M<<"\\n";return 0;}
for(long long i=2;i<=n;++i){long long c=(a+b)%M;a=b;b=c;}
cout<<b<<"\\n";`,
  ],
});

export default P;
