/* Batch 323 — ten problems at the hard end, C323–C332.
 *
 * Graphs, DP over subsets of the input rather than of the state, number theory
 * and a couple of classic counting arguments. Every statement is written for
 * AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "C323", judge: "dp-count-lis", topic: "dynamic-programming", rating: 1800,
  tag: "DP", timeLimitMs: 2000,
  uz: "Eng uzun o‘suvchi ketma-ketliklar soni",
  en: "How many longest increasing subsequences",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uning eng uzun qat'iy o‘suvchi qism ketma-ketligi uzunligi emas, balki shunday uzunlikdagi qism ketma-ketliklar soni kerak. Ikki qism ketma-ketlik tanlangan pozitsiyalar to‘plami bilan farq qilsa, ular har xil hisoblanadi — qiymatlari bir xil bo‘lsa ham. Javob katta bo‘lishi mumkin, shuning uchun uni 10^9 + 7 ga bo‘lgan qoldiq shaklida chiqaring.",
  statementEn: "You are given an array of n integers. What is wanted is not the length of its longest strictly increasing subsequence but how many subsequences of that length there are. Two subsequences are different when the sets of positions they use differ, even if the values they read are the same. The count can be large, so print it modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun qat'iy o‘suvchi qism ketma-ketliklar soni, 10^9 + 7 modul bo‘yicha.",
  outputEn: "Print a single integer — the number of longest strictly increasing subsequences, modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 2000", "−10^9 ≤ a_i ≤ 10^9", "the subsequence must increase strictly, so equal values cannot both be used", "the answer is required modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ n ≤ 2000", "−10^9 ≤ a_i ≤ 10^9", "qism ketma-ketlik qat'iy o‘sishi shart, shuning uchun teng qiymatlarning ikkalasini birga olib bo‘lmaydi", "javob 10^9 + 7 modul bo‘yicha talab qilinadi"],
  sampleInputs: ["5\n1 3 5 4 7\n", "5\n2 2 2 2 2\n"],
  expect: ["2\n", "5\n"],
  sampleNotesUz: [
    "Eng uzun o‘suvchi ketma-ketlik uzunligi 4 va shunday ikkita ketma-ketlik bor: 1 3 5 7 hamda 1 3 4 7. Ular faqat uchinchi a'zosi bilan farq qiladi, lekin bu ikki har xil pozitsiyalar to‘plami, ya'ni ikkita alohida javob.",
    "Barcha qiymatlar teng, shuning uchun qat'iy o‘suvchi ketma-ketlikning uzunligi 1 dan oshmaydi. Uzunligi 1 bo‘lgan ketma-ketliklar esa beshta — har bir pozitsiya o‘zicha bittasini beradi.",
  ],
  sampleNotesEn: [
    "The longest increasing subsequence has length 4, and there are two of them: 1 3 5 7 and 1 3 4 7. They differ only in their third member, but those are two different sets of positions, so they count as two answers.",
    "Every value is equal, so a strictly increasing subsequence cannot be longer than 1. There are five subsequences of length 1 — one for each position.",
  ],
  testInputs: ["5\n1 3 5 4 7\n", "5\n2 2 2 2 2\n", "1\n7\n", "4\n1 2 3 4\n", "6\n1 1 2 2 3 3\n", "5\n5 4 3 2 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long M=1000000007;
vector<int>len(n,1);vector<long long>cnt(n,1);int best=1;
for(int i=0;i<n;++i){
 for(int j=0;j<i;++j)if(a[j]<a[i]){
  if(len[j]+1>len[i]){len[i]=len[j]+1;cnt[i]=cnt[j];}
  else if(len[j]+1==len[i])cnt[i]=(cnt[i]+cnt[j])%M;}
 best=max(best,len[i]);}
long long ans=0;for(int i=0;i<n;++i)if(len[i]==best)ans=(ans+cnt[i])%M;
cout<<ans<<"\\n";`,
  wrongNote: "Counting every position that reaches the best length instead of summing their counts, and a non-strict comparison that lets equal values extend a run.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long M=1000000007;
vector<int>len(n,1);vector<long long>cnt(n,1);int best=1;
for(int i=0;i<n;++i){
 for(int j=0;j<i;++j)if(a[j]<a[i]){
  if(len[j]+1>len[i]){len[i]=len[j]+1;cnt[i]=cnt[j];}
  else if(len[j]+1==len[i])cnt[i]=(cnt[i]+cnt[j])%M;}
 best=max(best,len[i]);}
long long ans=0;for(int i=0;i<n;++i)if(len[i]==best)ans=(ans+1)%M;
cout<<ans<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long M=1000000007;
vector<int>len(n,1);vector<long long>cnt(n,1);int best=1;
for(int i=0;i<n;++i){
 for(int j=0;j<i;++j)if(a[j]<=a[i]){
  if(len[j]+1>len[i]){len[i]=len[j]+1;cnt[i]=cnt[j];}
  else if(len[j]+1==len[i])cnt[i]=(cnt[i]+cnt[j])%M;}
 best=max(best,len[i]);}
long long ans=0;for(int i=0;i<n;++i)if(len[i]==best)ans=(ans+cnt[i])%M;
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "C324", judge: "graph-eulerian-path", topic: "graphs", rating: 1800,
  tag: "Euler", timeLimitMs: 1000,
  uz: "Eyler yo‘li bormi",
  en: "Does an Eulerian path exist",
  statementUz: "Sizga n ta uchi va m ta qirrasi bo‘lgan yo‘naltirilmagan graf berilgan. Har bir qirradan aynan bir marta o‘tadigan yo‘l — Eyler yo‘li — mavjudligini aniqlang. Bunday yo‘l ikki shart bir vaqtda bajarilganda mavjud bo‘ladi: qirrasi bor barcha uchlar bitta bog‘langan komponentada yotishi kerak, va toq darajali uchlar soni 0 yoki 2 bo‘lishi kerak. Yakkalanib qolgan, birorta qirrasi yo‘q uchlar bog‘lanishga xalaqit bermaydi.",
  statementEn: "You are given an undirected graph with n vertices and m edges. Determine whether a path using every edge exactly once — an Eulerian path — exists. Such a path exists when two conditions hold at the same time: every vertex that has an edge lies in one connected component, and the number of vertices of odd degree is either 0 or 2. Isolated vertices with no edges at all do not break the connectivity requirement.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a va b uchlarini bog‘lovchi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains two integers a and b, an edge joining vertices a and b.",
  outputUz: "Agar Eyler yo‘li mavjud bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if an Eulerian path exists and NO otherwise, in capital letters.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "a graph with no edges at all trivially has an Eulerian path"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n", "umuman qirrasi yo‘q grafda Eyler yo‘li o‘z-o‘zidan mavjud"],
  sampleInputs: ["4 4\n1 2\n2 3\n3 4\n4 2\n", "6 6\n1 2\n2 3\n1 3\n4 5\n5 6\n4 6\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "Darajalar: 1-uch 1, 2-uch 3, 3-uch 2, 4-uch 2. Toq darajali uchlar aynan ikkita (1 va 2), qirrasi bor hamma uch bitta komponentada — shuning uchun Eyler yo‘li bor va u 1-uchdan boshlanib 2-uchda tugaydi.",
    "Ikkita alohida uchburchak. Har bir uchning darajasi 2, ya'ni toq darajali uch umuman yo‘q — darajalar sharti mukammal bajariladi. Ammo qirralar ikkita bog‘lanmagan komponentaga bo‘lingan va bitta yo‘l ikkala uchburchakning qirralaridan o‘ta olmaydi, shuning uchun javob NO. Aynan shu namuna faqat darajalarni sanaydigan yechimni fosh qiladi.",
  ],
  sampleNotesEn: [
    "The degrees are 1 for vertex 1, 3 for vertex 2, and 2 for vertices 3 and 4. Exactly two vertices have odd degree (1 and 2) and every vertex with an edge lies in one component, so an Eulerian path exists — it starts at vertex 1 and ends at vertex 2.",
    "Two separate triangles. Every vertex has degree 2, so there is no odd-degree vertex at all and the degree condition passes perfectly. But the edges fall into two disconnected components and no single path can cross from one triangle to the other, so the answer is NO. This is the sample that exposes a solution which only counts degrees.",
  ],
  testInputs: ["4 4\n1 2\n2 3\n3 4\n4 2\n", "6 6\n1 2\n2 3\n1 3\n4 5\n5 6\n4 6\n", "1 0\n", "4 2\n1 2\n3 4\n", "3 3\n1 2\n2 3\n1 3\n", "5 4\n1 2\n2 3\n3 4\n4 5\n", "4 3\n1 2\n3 4\n1 3\n", "5 2\n1 2\n2 3\n"],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>g(n+1);vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);++deg[a];++deg[b];}
int odd=0;for(int v=1;v<=n;++v)if(deg[v]%2)++odd;
if(odd!=0&&odd!=2){cout<<"NO\\n";return 0;}
int start=-1;for(int v=1;v<=n;++v)if(deg[v]>0){start=v;break;}
if(start<0){cout<<"YES\\n";return 0;}
vector<char>seen(n+1,0);vector<int>st{start};seen[start]=1;int reached=0;
while(!st.empty()){int v=st.back();st.pop_back();++reached;
 for(int u:g[v])if(!seen[u]){seen[u]=1;st.push_back(u);}}
int withEdges=0;for(int v=1;v<=n;++v)if(deg[v]>0)++withEdges;
cout<<(reached==withEdges?"YES":"NO")<<"\\n";`,
  wrongNote: "Checking the degrees and forgetting connectivity, and demanding that every vertex be reached rather than every vertex that has an edge.",
  wrong: [
    `int n,m;cin>>n>>m;vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;++deg[a];++deg[b];}
int odd=0;for(int v=1;v<=n;++v)if(deg[v]%2)++odd;
cout<<((odd==0||odd==2)?"YES":"NO")<<"\\n";`,
    `int n,m;cin>>n>>m;vector<vector<int>>g(n+1);vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);++deg[a];++deg[b];}
int odd=0;for(int v=1;v<=n;++v)if(deg[v]%2)++odd;
if(odd!=0&&odd!=2){cout<<"NO\\n";return 0;}
vector<char>seen(n+1,0);vector<int>st{1};seen[1]=1;int reached=0;
while(!st.empty()){int v=st.back();st.pop_back();++reached;
 for(int u:g[v])if(!seen[u]){seen[u]=1;st.push_back(u);}}
cout<<(reached==n?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "C325", judge: "count-trailing-zeros-factorial", topic: "math", rating: 1800,
  tag: "Number theory", timeLimitMs: 1000,
  uz: "Faktorial oxiridagi nollar",
  en: "Trailing zeros of a factorial",
  statementUz: "Sizga musbat n butun soni berilgan. n! sonining o‘nlik yozuvi nechta nol bilan tugashini aniqlang. Oxiridagi har bir nol ko‘paytmadagi bitta 10 ga to‘g‘ri keladi, 10 esa 2 va 5 ning ko‘paytmasi. 1 dan n gacha bo‘lgan sonlar orasida ikkilik ko‘paytuvchilar beshliklardan doim ko‘p, shuning uchun javobni faqat 5 ning nechta marta qatnashishi belgilaydi. n 10^18 gacha borgani uchun faktorialning o‘zini hisoblab bo‘lmaydi.",
  statementEn: "You are given a positive integer n. Determine how many zeros the decimal representation of n! ends with. Each trailing zero corresponds to one factor of 10 in the product, and 10 is 2 times 5. Among the numbers from 1 to n the factors of 2 always outnumber the factors of 5, so the answer is decided by how often 5 appears. Since n goes up to 10^18, the factorial itself cannot be computed.",
  inputUz: "Yagona qatorda bitta musbat n butun soni beriladi.",
  inputEn: "The only line contains one positive integer n.",
  outputUz: "Yagona butun sonni chiqaring — n! oxiridagi nollar soni.",
  outputEn: "Print a single integer — the number of trailing zeros of n!.",
  constraintList: ["1 ≤ n ≤ 10^18", "the answer can reach about 2.5·10^17 and needs a 64-bit type", "the powers of 5 must be summed, not just n/5"],
  constraintListUz: ["1 ≤ n ≤ 10^18", "javob taxminan 2,5·10^17 ga yetadi va 64-bitli turni talab qiladi", "5 ning darajalarini qo‘shib chiqish kerak, faqat n/5 emas"],
  sampleInputs: ["25\n", "4\n"],
  expect: ["6\n", "0\n"],
  sampleNotesUz: [
    "25 gacha 5 ga bo‘linadiganlar beshta (5, 10, 15, 20, 25), lekin 25 = 5 · 5 ikkita beshlik beradi. Shuning uchun jami 25/5 + 25/25 = 5 + 1 = 6 ta beshlik bor va 25! aynan olti nol bilan tugaydi. Faqat n/5 ni olish 5 berib, 25 ning ikkinchi beshligini yo‘qotardi.",
    "4! = 24 bo‘lib, u nol bilan tugamaydi: 4 gacha bo‘lgan sonlar orasida birorta ham 5 ko‘paytuvchisi yo‘q, shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "Up to 25 there are five multiples of 5 (5, 10, 15, 20, 25), but 25 = 5 · 5 contributes two factors. So the total is 25/5 + 25/25 = 5 + 1 = 6, and 25! ends in exactly six zeros. Taking only n/5 would give 5 and lose the second factor inside 25.",
    "4! = 24, which does not end in a zero: no number up to 4 has a factor of 5, so the answer is 0.",
  ],
  testInputs: ["25\n", "4\n", "1\n", "5\n", "1000000000000000000\n", "125\n"],
  sol: `unsigned long long n;cin>>n;unsigned long long z=0;
for(unsigned long long p=5;p<=n;p*=5){z+=n/p;if(p>n/5)break;}
cout<<z<<"\\n";`,
  wrongNote: "Dividing once counts a 25 as a single five; counting factors of 2 instead answers a different question.",
  wrong: [
    `unsigned long long n;cin>>n;cout<<n/5<<"\\n";`,
    `unsigned long long n;cin>>n;unsigned long long z=0;
for(unsigned long long p=2;p<=n;p*=2){z+=n/p;if(p>n/2)break;}
cout<<z<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C326", judge: "dp-partition-min-diff", topic: "dynamic-programming", rating: 1900,
  tag: "Subset sums", timeLimitMs: 2000,
  uz: "Ikki qismning eng kichik farqi",
  en: "Splitting into two closest halves",
  statementUz: "Sizga n ta musbat butun sondan iborat massiv berilgan. Uning barcha elementlarini ikki guruhga taqsimlang; har bir element aynan bitta guruhga tushishi kerak, guruh bo‘sh bo‘lishi ham mumkin. Ikki guruh yig‘indilari orasidagi ayirmaning moduli imkon qadar kichik bo‘lsin va o‘sha eng kichik qiymatni chiqaring. Elementlar tartibi ahamiyatsiz — guruh uzluksiz bo‘lishi shart emas.",
  statementEn: "You are given an array of n positive integers. Split all of its elements into two groups; every element goes into exactly one group, and a group may be empty. Make the absolute difference between the two group sums as small as possible and print that smallest value. The order of the elements does not matter — a group need not be contiguous.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n positive integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — ikki guruh yig‘indilari orasidagi eng kichik mumkin bo‘lgan ayirma moduli.",
  outputEn: "Print a single integer — the smallest possible absolute difference between the two group sums.",
  constraintList: ["1 ≤ n ≤ 100", "1 ≤ a_i ≤ 1000", "the total of all elements is at most 100000", "the answer has the same parity as that total"],
  constraintListUz: ["1 ≤ n ≤ 100", "1 ≤ a_i ≤ 1000", "barcha elementlar yig‘indisi ko‘pi bilan 100000", "javobning juft-toqligi o‘sha yig‘indi bilan bir xil"],
  sampleInputs: ["4\n1 6 11 5\n", "1\n7\n"],
  expect: ["1\n", "7\n"],
  sampleNotesUz: [
    "Umumiy yig‘indi 23, ya'ni ideal bo‘linish 11,5 atrofida bo‘lardi. {1, 11} guruhi 12 ni, {6, 5} guruhi 11 ni beradi va ayirma 1. Yig‘indi toq bo‘lgani uchun 0 ga erishib bo‘lmaydi — ayirma ham toq bo‘lishi shart, demak 1 mumkin bo‘lgan eng yaxshi natija.",
    "Yagona elementni ikkiga bo‘lib bo‘lmaydi: u bitta guruhga tushadi, ikkinchisi bo‘sh qoladi va ayirma 7 ga teng bo‘ladi.",
  ],
  sampleNotesEn: [
    "The total is 23, so a perfect split would sit at 11.5. The group {1, 11} sums to 12 and {6, 5} sums to 11, a difference of 1. Since the total is odd, 0 is unreachable — the difference must be odd too — so 1 is the best possible.",
    "A single element cannot be divided: it goes into one group, the other stays empty, and the difference is 7.",
  ],
  testInputs: ["4\n1 6 11 5\n", "1\n7\n", "2\n10 10\n", "3\n1 1 1\n", "5\n3 1 4 2 2\n", "4\n1000 1000 1000 1000\n", "2\n3 8\n", "3\n2 2 9\n"],
  sol: `int n;cin>>n;vector<int>a(n);int total=0;for(auto&x:a){cin>>x;total+=x;}
vector<char>can(total+1,0);can[0]=1;
for(int x:a)for(int s=total;s>=x;--s)if(can[s-x])can[s]=1;
int best=total;
for(int s=0;s<=total;++s)if(can[s])best=min(best,abs(total-2*s));
cout<<best<<"\\n";`,
  wrongNote: "Walking the subset-sum table forwards reuses an element many times; reading the answer off the parity of the total assumes a perfect split is always reachable.",
  wrong: [
    `int n;cin>>n;vector<int>a(n);int total=0;for(auto&x:a){cin>>x;total+=x;}
vector<char>can(total+1,0);can[0]=1;
for(int x:a)for(int s=x;s<=total;++s)if(can[s-x])can[s]=1;
int best=total;
for(int s=0;s<=total;++s)if(can[s])best=min(best,abs(total-2*s));
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<int>a(n);int total=0;for(auto&x:a){cin>>x;total+=x;}
cout<<(total%2)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C327", judge: "knapsack-bounded", topic: "dynamic-programming", rating: 1900,
  tag: "Knapsack", timeLimitMs: 2000,
  uz: "Cheklangan sonli ryukzak",
  en: "Knapsack with limited copies",
  statementUz: "Sizga n xil buyum berilgan: i-turdagi buyumning og‘irligi w_i, qiymati v_i va sizda ulardan aynan c_i dona bor. Sig‘imi W bo‘lgan ryukzakka umumiy og‘irligi W dan oshmaydigan buyumlar to‘plamini joylashtiring va umumiy qiymatni imkon qadar katta qiling. Har bir turdan c_i donadan ko‘p olib bo‘lmaydi, buyumni qisman olish ham mumkin emas. Erishish mumkin bo‘lgan eng katta umumiy qiymatni chiqaring.",
  statementEn: "You are given n kinds of item: an item of kind i weighs w_i, is worth v_i, and you have exactly c_i copies of it. Pack a selection whose total weight does not exceed the capacity W of the knapsack, making the total value as large as possible. No more than c_i copies of a kind may be taken, and an item cannot be taken partially. Print the largest total value achievable.",
  inputUz: "Birinchi qatorda ikkita n va W butun soni beriladi. Keyingi n qatorning har birida uchta w_i, v_i va c_i butun soni keladi.",
  inputEn: "The first line contains two integers n and W. Each of the next n lines contains three integers w_i, v_i and c_i.",
  outputUz: "Yagona butun sonni chiqaring — ryukzakka sig‘adigan eng katta umumiy qiymat. Hech narsa sig‘masa, 0 chiqaring.",
  outputEn: "Print a single integer — the largest total value that fits in the knapsack. If nothing fits, print 0.",
  constraintList: ["1 ≤ n ≤ 100", "0 ≤ W ≤ 10000", "1 ≤ w_i ≤ 10000", "1 ≤ v_i ≤ 10000", "1 ≤ c_i ≤ 100", "at most c_i copies of kind i may be taken"],
  constraintListUz: ["1 ≤ n ≤ 100", "0 ≤ W ≤ 10000", "1 ≤ w_i ≤ 10000", "1 ≤ v_i ≤ 10000", "1 ≤ c_i ≤ 100", "i-turdan ko‘pi bilan c_i dona olish mumkin"],
  sampleInputs: ["2 10\n3 4 2\n5 6 1\n", "1 1\n2 10 5\n"],
  expect: ["10\n", "0\n"],
  sampleNotesUz: [
    "Uchta variant bor. Birinchi turdan ikkitasi: og‘irlik 6, qiymat 8. Har biridan bittadan: og‘irlik 3 + 5 = 8, qiymat 4 + 6 = 10. Ikkitadan birinchi va bitta ikkinchi esa 6 + 5 = 11 og‘irlikda bo‘lib, 10 lik sig‘imga sig‘maydi. Eng yaxshisi — har biridan bittadan, ya'ni 10. Birinchi turdan ikkitadan ko‘p olib bo‘lmasligi aynan shu yerda cheklov bo‘lib turibdi.",
    "Yagona buyum 2 og‘irlikda, ryukzak sig‘imi esa 1, shuning uchun hech narsa sig‘maydi va javob 0.",
  ],
  sampleNotesEn: [
    "There are three candidates. Two of the first kind weigh 6 and are worth 8. One of each weighs 3 + 5 = 8 and is worth 4 + 6 = 10. Two of the first plus the second weighs 11, which does not fit in a capacity of 10. The best is one of each, for 10 — and the cap of two on the first kind is what binds here.",
    "The only item weighs 2 and the capacity is 1, so nothing fits and the answer is 0.",
  ],
  testInputs: ["2 10\n3 4 2\n5 6 1\n", "1 1\n2 10 5\n", "1 10\n1 1 100\n", "3 7\n1 1 1\n2 5 2\n3 7 1\n", "2 0\n1 1 1\n2 2 2\n", "1 10000\n1 1 100\n"],
  sol: `int n,W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v,c;cin>>w>>v>>c;
 for(long long k=1;c>0;k*=2){long long take=min(k,c);c-=take;
  long long ww=w*take,vv=v*take;
  for(int cap=W;cap>=ww;--cap)dp[cap]=max(dp[cap],dp[cap-ww]+vv);}}
cout<<dp[W]<<"\\n";`,
  wrongNote: "Treating every kind as unlimited ignores the copy count; treating it as a single item throws the rest away.",
  wrong: [
    `int n,W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v,c;cin>>w>>v>>c;
 for(int cap=w;cap<=W;++cap)dp[cap]=max(dp[cap],dp[cap-w]+v);}
cout<<dp[W]<<"\\n";`,
    `int n,W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v,c;cin>>w>>v>>c;
 for(int cap=W;cap>=w;--cap)dp[cap]=max(dp[cap],dp[cap-w]+v);}
cout<<dp[W]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C328", judge: "graph-count-components-size-k", topic: "graphs", rating: 1900,
  tag: "DSU", timeLimitMs: 1000,
  uz: "Berilgan o‘lchamdagi komponentalar",
  en: "Components of a given size",
  statementUz: "Sizga n ta uchi va m ta qirrasi bo‘lgan yo‘naltirilmagan graf berilgan. Uchlari soni aynan k ga teng bo‘lgan bog‘langan komponentalar nechta ekanini sanang. Bog‘langan komponenta — bu ichidagi istalgan uchdan boshqasiga yetib borish mumkin bo‘lgan va tashqarisiga birorta qirra chiqmaydigan uchlar to‘plami. Yakkalanib qolgan uch ham o‘lchami 1 bo‘lgan to‘liq huquqli komponenta hisoblanadi.",
  statementEn: "You are given an undirected graph with n vertices and m edges. Count the connected components whose vertex count is exactly k. A connected component is a set of vertices in which every vertex is reachable from every other and no edge leaves the set. An isolated vertex is a component of size 1 like any other.",
  inputUz: "Birinchi qatorda uchta n, m va k butun soni beriladi. Keyingi m qatorning har birida a va b uchlarini bog‘lovchi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains three integers n, m and k. Each of the next m lines contains two integers a and b, an edge joining vertices a and b.",
  outputUz: "Yagona butun sonni chiqaring — o‘lchami k ga teng komponentalar soni. Bunday komponenta bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of components of size exactly k. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ k ≤ n", "1 ≤ a, b ≤ n", "repeated edges and self-loops may appear"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ k ≤ n", "1 ≤ a, b ≤ n", "takroriy qirralar va uchning o‘ziga tutashgan qirralari uchrashi mumkin"],
  sampleInputs: ["6 3 2\n1 2\n3 4\n5 6\n", "5 2 1\n1 2\n2 3\n"],
  expect: ["3\n", "2\n"],
  sampleNotesUz: [
    "Graf uchta juftlikka ajraladi: {1,2}, {3,4} va {5,6}. Har birining o‘lchami 2, ya'ni k ga mos keladi va javob 3.",
    "1, 2 va 3-uchlar o‘lchami 3 bo‘lgan bitta komponentani hosil qiladi; 4 va 5-uchlar esa yakka qoladi. O‘lchami 1 bo‘lgan komponentalar aynan shu ikkitasi, shuning uchun javob 2 — yakka uchlar ham sanaladi.",
  ],
  sampleNotesEn: [
    "The graph falls into three pairs: {1,2}, {3,4} and {5,6}. Each has size 2, which matches k, so the answer is 3.",
    "Vertices 1, 2 and 3 form one component of size 3, while vertices 4 and 5 stand alone. The components of size 1 are exactly those two, so the answer is 2 — isolated vertices count.",
  ],
  testInputs: ["6 3 2\n1 2\n3 4\n5 6\n", "5 2 1\n1 2\n2 3\n", "1 0 1\n", "4 4 4\n1 2\n2 3\n3 4\n4 1\n", "3 3 1\n1 1\n2 2\n3 3\n", "5 1 5\n1 2\n"],
  sol: `int n,m,k;cin>>n>>m>>k;vector<int>p(n+1),sz(n+1,1);
for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}
long long c=0;for(int v=1;v<=n;++v)if(f(v)==v&&sz[v]==k)++c;
cout<<c<<"\\n";`,
  wrongNote: "Counting every vertex whose component has size k multiplies each component by its own size; merging without carrying the sizes leaves them all at one.",
  wrong: [
    `int n,m,k;cin>>n>>m>>k;vector<int>p(n+1),sz(n+1,1);
for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}
long long c=0;for(int v=1;v<=n;++v)if(sz[f(v)]==k)++c;
cout<<c<<"\\n";`,
    `int n,m,k;cin>>n>>m>>k;vector<int>p(n+1),sz(n+1,1);
for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb)p[ra]=rb;}
long long c=0;for(int v=1;v<=n;++v)if(f(v)==v&&sz[v]==k)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C329", judge: "dp-longest-zigzag", topic: "dynamic-programming", rating: 2000,
  tag: "DP", timeLimitMs: 1000,
  uz: "Eng uzun zigzag qism ketma-ketlik",
  en: "Longest zigzag subsequence",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uning eng uzun zigzag qism ketma-ketligi uzunligini toping. Zigzag ketma-ketlikda qo‘shni ayirmalarning ishorasi navbatma-navbat almashadi: oshish, kamayish, oshish va hokazo, yoki aksincha. Nol ayirmaga yo‘l qo‘yilmaydi, ya'ni ketma-ket teng qiymatlarni birga olib bo‘lmaydi. Uzunligi 1 bo‘lgan ketma-ketlik ham zigzag hisoblanadi.",
  statementEn: "You are given an array of n integers. Find the length of its longest zigzag subsequence. In a zigzag sequence the signs of the consecutive differences alternate: up, down, up and so on, or the other way round. A difference of zero is not allowed, so two equal values cannot be taken in a row. A sequence of length 1 counts as a zigzag.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun zigzag qism ketma-ketlik uzunligi. Javob kamida 1 ga teng.",
  outputEn: "Print a single integer — the length of the longest zigzag subsequence. The answer is at least 1.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "equal consecutive values may not both be taken", "the answer is between 1 and n inclusive"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "ketma-ket teng qiymatlarning ikkalasini birga olib bo‘lmaydi", "javob 1 dan n gacha bo‘lgan oraliqda yotadi"],
  sampleInputs: ["6\n1 7 4 9 2 5\n", "5\n3 3 3 3 3\n"],
  expect: ["6\n", "1\n"],
  sampleNotesUz: [
    "Butun massivning o‘zi zigzag: 1 < 7 > 4 < 9 > 2 < 5 — ayirmalar ishorasi har qadamda almashadi. Shuning uchun hech narsani tashlab ketish kerak emas va javob 6.",
    "Barcha qiymatlar teng, shuning uchun ikkita elementni birga olib bo‘lmaydi — ular orasidagi ayirma nol bo‘lardi. Eng uzun zigzag bitta elementdan iborat.",
  ],
  sampleNotesEn: [
    "The whole array is already a zigzag: 1 < 7 > 4 < 9 > 2 < 5, with the sign of the difference flipping at every step. Nothing has to be dropped, so the answer is 6.",
    "Every value is equal, so no two elements can be taken together — the difference between them would be zero. The longest zigzag is a single element.",
  ],
  testInputs: ["6\n1 7 4 9 2 5\n", "5\n3 3 3 3 3\n", "1\n5\n", "5\n1 2 3 4 5\n", "7\n1 1 2 2 3 3 1\n", "4\n-5 -1 -5 -1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long up=1,down=1;
for(int i=1;i<n;++i){if(a[i]>a[i-1])up=down+1;else if(a[i]<a[i-1])down=up+1;}
cout<<max(up,down)<<"\\n";`,
  wrongNote: "Letting an equal pair extend the chain breaks the no-zero rule; carrying only one direction forgets that the chain can turn either way.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long up=1,down=1;
for(int i=1;i<n;++i){if(a[i]>=a[i-1])up=down+1;else down=up+1;}
cout<<max(up,down)<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=1;
for(int i=1;i<n;++i)if(a[i]!=a[i-1])++best;
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C330", judge: "count-inversions-pairs-far", topic: "data-structures", rating: 2000,
  tag: "Fenwick", timeLimitMs: 2000,
  uz: "Chapdagi kattalar soni",
  en: "How many bigger values stand to the left",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Har bir pozitsiya uchun undan chapda turgan va undan qat'iy katta bo‘lgan elementlar sonini hisoblang, so‘ng shu sonlarning yig‘indisini chiqaring. Bu qiymat massivdagi inversiyalar soniga teng, lekin n 10^5 gacha borgani uchun har bir juftlikni ko‘rib chiqib bo‘lmaydi — qiymatlarni tartiblab, hisoblagichli struktura bilan yurish kerak.",
  statementEn: "You are given an array of n integers. For every position, count the elements standing to its left that are strictly greater than it, then print the sum of those counts. That value is the number of inversions in the array, but since n goes up to 10^5 the pairs cannot be examined one by one — the values have to be ranked and swept with a counting structure.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — barcha pozitsiyalar bo‘yicha chapdagi kattalar sonining yig‘indisi.",
  outputEn: "Print a single integer — the total, over all positions, of how many strictly greater values stand to the left.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the comparison is strict, so equal values do not count", "the answer can reach about 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "solishtirish qat'iy, shuning uchun teng qiymatlar sanalmaydi", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n5 4 3 2 1\n", "4\n2 2 2 2\n"],
  expect: ["10\n", "0\n"],
  sampleNotesUz: [
    "Massiv to‘liq teskari tartibda, shuning uchun har bir juftlik inversiya hosil qiladi: 5 · 4 / 2 = 10. Bu n = 5 uchun mumkin bo‘lgan eng katta qiymat.",
    "Barcha qiymatlar teng. Solishtirish qat'iy bo‘lgani uchun teng qiymat o‘zidan chapdagini hisoblamaydi va javob 0 bo‘ladi. Agar solishtirish qat'iy bo‘lmaganda, javob 6 chiqardi.",
  ],
  sampleNotesEn: [
    "The array is fully reversed, so every pair is an inversion: 5 · 4 / 2 = 10. That is the largest value possible for n = 5.",
    "Every value is equal. Because the comparison is strict, an equal value to the left does not count and the answer is 0. Had the comparison been non-strict the answer would have been 6.",
  ],
  testInputs: ["5\n5 4 3 2 1\n", "4\n2 2 2 2\n", "1\n7\n", "5\n1 2 3 4 5\n", "6\n3 1 4 1 5 9\n", "4\n-1 -2 -3 -4\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());s.erase(unique(s.begin(),s.end()),s.end());
int m=s.size();vector<long long>bit(m+1,0);
auto add=[&](int i){for(++i;i<=m;i+=i&-i)++bit[i];};
auto qry=[&](int i){long long r=0;for(++i;i>0;i-=i&-i)r+=bit[i];return r;};
long long ans=0;
for(int i=0;i<n;++i){int r=lower_bound(s.begin(),s.end(),a[i])-s.begin();
 ans+=i-qry(r);add(r);}
cout<<ans<<"\\n";`,
  wrongNote: "Counting the values less than or equal instead of strictly greater folds the equal ones in; subtracting one rank too few counts each equal pair as an inversion.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());s.erase(unique(s.begin(),s.end()),s.end());
int m=s.size();vector<long long>bit(m+1,0);
auto add=[&](int i){for(++i;i<=m;i+=i&-i)++bit[i];};
auto qry=[&](int i){long long r=0;for(++i;i>0;i-=i&-i)r+=bit[i];return r;};
long long ans=0;
for(int i=0;i<n;++i){int r=lower_bound(s.begin(),s.end(),a[i])-s.begin();
 ans+=i-qry(r-1);add(r);}
cout<<ans<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long ans=0;
for(int i=0;i<n;++i)for(int j=0;j<i;++j)if(a[j]>=a[i])++ans;
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C331", judge: "greedy-min-rooms-lectures", topic: "greedy", rating: 2000,
  tag: "Sweep", timeLimitMs: 1000,
  uz: "Ma'ruzalar uchun eng kam xona",
  en: "Rooms for the lectures",
  statementUz: "Sizga n ta ma'ruzaning boshlanish va tugash vaqtlari berilgan. Har bir ma'ruzaga xona kerak va bitta xonada bir vaqtning o‘zida faqat bitta ma'ruza o‘tkaziladi. Bir ma'ruza tugagan paytda aynan boshlanadigan ikkinchisi o‘sha xonani ishlatishi mumkin. Barcha ma'ruzalarni o‘tkazish uchun kerak bo‘ladigan eng kam xonalar sonini toping.",
  statementEn: "You are given the start and end times of n lectures. Each lecture needs a room and a room holds one lecture at a time. A lecture starting exactly when another ends may reuse that room. Find the smallest number of rooms needed to hold every lecture.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida ikkita s va e butun soni — ma'ruzaning boshlanish va tugash vaqti keladi; s < e.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains two integers s and e, the start and end time of one lecture, with s < e.",
  outputUz: "Yagona butun sonni chiqaring — kerak bo‘ladigan eng kam xonalar soni.",
  outputEn: "Print a single integer — the smallest number of rooms needed.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ s < e ≤ 10^9", "a lecture starting exactly when another ends may share the room"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ s < e ≤ 10^9", "boshqasi tugagan paytda aynan boshlanadigan ma'ruza xonani baham ko‘rishi mumkin"],
  sampleInputs: ["3\n0 30\n5 10\n15 20\n", "3\n0 10\n10 20\n20 30\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "Birinchi ma'ruza 0 dan 30 gacha butun oraliqni egallaydi, qolgan ikkitasi esa uning ichida, lekin bir-biri bilan kesishmaydi: 5–10 va 15–20. Shuning uchun ikkita xona yetarli — ikkinchi xonada ular ketma-ket o‘tkaziladi.",
    "Har bir ma'ruza oldingisi tugagan paytda aynan boshlanadi, bu esa kesishish hisoblanmaydi. Uchchalasi bitta xonada ketma-ket o‘tadi va javob 1.",
  ],
  sampleNotesEn: [
    "The first lecture occupies the whole span from 0 to 30, and the other two fall inside it without overlapping each other: 5–10 and 15–20. Two rooms are therefore enough — the second room holds those two in sequence.",
    "Each lecture starts exactly when the previous one ends, which does not count as an overlap. All three run in one room and the answer is 1.",
  ],
  testInputs: ["3\n0 30\n5 10\n15 20\n", "3\n0 10\n10 20\n20 30\n", "1\n0 1\n", "4\n1 5\n2 6\n3 7\n4 8\n", "2\n0 1000000000\n0 1000000000\n", "5\n1 2\n2 3\n1 3\n3 4\n2 4\n"],
  sol: `int n;cin>>n;vector<long long>s(n),e(n);
for(int i=0;i<n;++i)cin>>s[i]>>e[i];
sort(s.begin(),s.end());sort(e.begin(),e.end());
int i=0,j=0,cur=0,best=0;
while(i<n){if(s[i]<e[j]){++cur;++i;best=max(best,cur);}else{--cur;++j;}}
cout<<best<<"\\n";`,
  wrongNote: "Treating a touching endpoint as an overlap books a room that is already free; counting the lectures that start before the first ending ignores the ones that finish in between.",
  wrong: [
    `int n;cin>>n;vector<long long>s(n),e(n);
for(int i=0;i<n;++i)cin>>s[i]>>e[i];
sort(s.begin(),s.end());sort(e.begin(),e.end());
int i=0,j=0,cur=0,best=0;
while(i<n){if(s[i]<=e[j]){++cur;++i;best=max(best,cur);}else{--cur;++j;}}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>s(n),e(n);
for(int i=0;i<n;++i)cin>>s[i]>>e[i];
sort(s.begin(),s.end());sort(e.begin(),e.end());
int cnt=0;for(int i=0;i<n;++i)if(s[i]<e[0])++cnt;
cout<<max(cnt,1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C332", judge: "string-count-distinct-rotations", topic: "strings", rating: 2000,
  tag: "Periods", timeLimitMs: 1000,
  uz: "Har xil aylanmalar soni",
  en: "How many distinct rotations",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uni aylantirish — bu boshidagi bir nechta harfni olib, o‘zgarmagan tartibda oxiriga qo‘yish demak. Uzunligi n bo‘lgan satrda n ta shunday aylanma bor (hech narsa ko‘chirmaslik ham shular jumlasidan), lekin ularning ba'zilari bir xil satr berishi mumkin. Har xil aylanmalar nechta ekanini toping.",
  statementEn: "You are given a string s of lowercase Latin letters. Rotating it means taking some letters from the front and putting them, in the same order, at the back. A string of length n has n such rotations (moving nothing is one of them), but some of them may produce the same string. Find how many distinct rotations there are.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — s ning har xil aylanmalari soni.",
  outputEn: "Print a single integer — the number of distinct rotations of s.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' only", "the answer always divides |s|"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' belgilaridan iborat", "javob har doim |s| ni bo‘ladi"],
  sampleInputs: ["abab\n", "abcd\n"],
  expect: ["2\n", "4\n"],
  sampleNotesUz: [
    "To‘rtta aylanma bor: abab, baba, abab va baba. Ulardan har xillari atigi ikkita, chunki satr \"ab\" blokining ikki marta takrorlanishidan iborat — blok uzunligi qancha bo‘lsa, har xil aylanmalar ham shuncha bo‘ladi.",
    "Bu satrda takrorlanuvchi blok yo‘q, shuning uchun to‘rtala aylanma ham har xil: abcd, bcda, cdab va dabc. Javob satr uzunligiga teng.",
  ],
  sampleNotesEn: [
    "There are four rotations: abab, baba, abab and baba. Only two are distinct, because the string is the block \"ab\" repeated twice — the number of distinct rotations equals the length of that block.",
    "This string has no repeating block, so all four rotations differ: abcd, bcda, cdab and dabc. The answer equals the length of the string.",
  ],
  testInputs: ["abab\n", "abcd\n", "aaaa\n", "a\n", "abcabcabc\n", "aabaab\n", "aabaa\n", "abcabca\n"],
  sol: `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
int p=n-pi[n-1];
cout<<((n%p==0)?p:n)<<"\\n";`,
  wrongNote: "Reporting the period without checking that it divides the length, and reporting the length of the whole string every time.",
  wrong: [
    `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
cout<<n-pi[n-1]<<"\\n";`,
    `string s;cin>>s;cout<<(long long)s.size()<<"\\n";`,
  ],
});

export default P;
