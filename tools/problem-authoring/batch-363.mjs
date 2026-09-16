/* Batch 363 — ten problems, B363–C372.
 *
 * Two pointers, backtracking, trees and a couple of dynamic programs, 1300 to
 * 1900 — the middle of the ladder where the thin topics live.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B363", judge: "greedy-max-profit-one-trade", topic: "greedy", rating: 1300,
  tag: "Prefix minimum", timeLimitMs: 1000,
  uz: "Bir marta olib-sotishdan eng katta foyda",
  en: "The best single buy and sell",
  statementUz: "Sizga n kun davomidagi narxlar berilgan. Bir marta sotib olib, keyinroq bir marta sotishingiz mumkin — sotish kuni sotib olish kunidan qat'iy keyin bo‘lishi shart. Eng katta foydani toping. Agar har qanday tanlovda foyda manfiy chiqsa, umuman savdo qilmaslik ham mumkin; bunday holda foyda 0 bo‘ladi.",
  statementEn: "You are given the prices over n days. You may buy once and sell once later, with the selling day strictly after the buying day. Find the largest profit. If every choice would lose money you may simply not trade, in which case the profit is 0.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son — kunlik narxlar keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers, the daily prices.",
  outputUz: "Yagona butun sonni chiqaring — eng katta foyda. Foydali savdo bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the largest profit. If no trade makes money, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ price ≤ 10^9", "the selling day must be strictly after the buying day", "not trading at all is allowed and gives 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ narx ≤ 10^9", "sotish kuni sotib olish kunidan qat'iy keyin bo‘lishi shart", "umuman savdo qilmaslikka ruxsat beriladi va u 0 beradi"],
  sampleInputs: ["6\n7 1 5 3 6 4\n", "5\n7 6 4 3 1\n"],
  expect: ["5\n", "0\n"],
  sampleNotesUz: [
    "Eng past narx 1 (2-kun), undan keyingi eng yuqori narx esa 6 (5-kun): foyda 6 − 1 = 5. 7 dan sotib olish mumkin emas edi, chunki undan keyin 7 dan qimmatroq narx yo‘q.",
    "Narxlar faqat pasayadi, ya'ni har qanday savdo zarar keltiradi. Savdo qilmaslikka ruxsat berilgani uchun javob 0 — manfiy qiymat emas.",
  ],
  sampleNotesEn: [
    "The lowest price is 1 on day 2, and the highest price after it is 6 on day 5, giving 6 − 1 = 5. Buying at 7 was impossible to profit from, since nothing after it is dearer.",
    "The prices only fall, so every trade loses money. Not trading is allowed, so the answer is 0 rather than a negative number.",
  ],
  testInputs: ["6\n7 1 5 3 6 4\n", "5\n7 6 4 3 1\n", "1\n5\n", "2\n1 1000000000\n", "3\n5 5 5\n", "4\n2 1 2 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=0,lo=(long long)4e18;
for(int i=0;i<n;++i){if(i>0&&a[i]-lo>best)best=a[i]-lo;if(a[i]<lo)lo=a[i];}
cout<<best<<"\\n";`,
  wrongNote: "The difference between the global maximum and minimum ignores which came first; forcing a trade to happen reports a loss on a market that only falls, where the right answer is to stay out.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mx=*max_element(a.begin(),a.end()),mn=*min_element(a.begin(),a.end());
cout<<max(0LL,mx-mn)<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=(long long)-4e18,lo=a[0];
for(int i=1;i<n;++i){if(a[i]-lo>best)best=a[i]-lo;if(a[i]<lo)lo=a[i];}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B364", judge: "two-pointers-min-subarray-atleast", topic: "two-pointers", rating: 1400,
  tag: "Sliding window", timeLimitMs: 1000,
  uz: "Yig‘indisi S dan kam bo‘lmagan eng qisqa qism massiv",
  en: "Shortest subarray with sum at least S",
  statementUz: "Sizga n ta musbat butun sondan iborat massiv va S qiymati berilgan. Yig‘indisi S dan kam bo‘lmagan eng qisqa uzluksiz qism massiv uzunligini toping. Barcha qiymatlar musbat bo‘lgani uchun oynani kengaytirish yig‘indini faqat oshiradi, torayishi esa faqat kamaytiradi — shuning uchun ikki ko‘rsatkichli oyna bir yurishda javobni topadi. Agar butun massivning yig‘indisi ham S ga yetmasa, bunday qism massiv yo‘q.",
  statementEn: "You are given an array of n positive integers and a value S. Find the length of the shortest contiguous subarray whose sum is at least S. Because every value is positive, widening the window only increases the sum and narrowing it only decreases it, so a two-pointer window finds the answer in one pass. If even the whole array sums to less than S, no such subarray exists.",
  inputUz: "Birinchi qatorda ikkita n va S butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son keladi.",
  inputEn: "The first line contains two integers n and S. The second line contains n positive integers.",
  outputUz: "Yagona butun sonni chiqaring — eng qisqa mos qism massiv uzunligi. Bunday qism massiv bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the length of the shortest qualifying subarray. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ S ≤ 10^14", "1 ≤ a_i ≤ 10^9", "the total can reach 10^14 and needs a 64-bit type", "the sum must reach S, so equality counts"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ S ≤ 10^14", "1 ≤ a_i ≤ 10^9", "umumiy yig‘indi 10^14 ga yetadi va 64-bitli turni talab qiladi", "yig‘indi S ga yetishi kifoya, ya'ni tenglik ham sanaladi"],
  sampleInputs: ["6 7\n2 3 1 2 4 3\n", "3 100\n1 2 3\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "4 va 3 qo‘shni turadi va ularning yig‘indisi 7 — aynan S ga teng, uzunligi 2. Bittalik qism massiv yetmaydi, chunki eng katta element 4 < 7. Tenglik hisobga olingani uchun 7 yaraydi.",
    "Butun massivning yig‘indisi 6 bo‘lib, 100 dan ancha kichik. Hech qanday qism massiv shartni qanoatlantirmaydi, shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "The 4 and the 3 sit next to each other and sum to 7, exactly S, giving length 2. No single element is enough, since the largest is 4 < 7. Equality counts, so 7 qualifies.",
    "The whole array sums to 6, far below 100. No subarray qualifies, so the answer is 0.",
  ],
  testInputs: ["6 7\n2 3 1 2 4 3\n", "3 100\n1 2 3\n", "1 1\n1\n", "5 15\n1 2 3 4 5\n", "4 4\n1 1 1 1\n", "3 1000000000\n1000000000 1 1\n"],
  sol: `long long n,S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;
long long sum=0,best=n+1,l=0;
for(long long r=0;r<n;++r){sum+=a[r];
 while(sum-a[l]>=S){sum-=a[l];++l;}
 if(sum>=S)best=min(best,r-l+1);}
cout<<(best==n+1?0:best)<<"\\n";`,
  wrongNote: "A strict comparison rejects a window that lands exactly on S; reporting n + 1 when nothing qualifies prints a length that does not exist.",
  wrong: [
    `long long n,S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;
long long sum=0,best=n+1,l=0;
for(long long r=0;r<n;++r){sum+=a[r];
 while(sum-a[l]>S){sum-=a[l];++l;}
 if(sum>S)best=min(best,r-l+1);}
cout<<(best==n+1?0:best)<<"\\n";`,
    `long long n,S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;
long long sum=0,best=n+1,l=0;
for(long long r=0;r<n;++r){sum+=a[r];
 while(sum-a[l]>=S){sum-=a[l];++l;}
 if(sum>=S)best=min(best,r-l+1);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B365", judge: "count-pairs-diff-k", topic: "two-pointers", rating: 1400,
  tag: "Sorting and two pointers", timeLimitMs: 1000,
  uz: "Farqi k ga teng juftliklar",
  en: "Pairs whose difference is k",
  statementUz: "Sizga n ta butun sondan iborat massiv va manfiy bo‘lmagan k soni berilgan. |a_i − a_j| = k shartini qanoatlantiruvchi (i, j) juftliklar sonini toping; i < j bo‘lishi shart. Juftliklar pozitsiya bo‘yicha sanaladi, ya'ni bir xil qiymat har xil pozitsiyalarda turgan bo‘lsa, har bir juftlik alohida hisobga olinadi. k = 0 bo‘lganda bu teng qiymatlar juftliklarini sanashga aylanadi.",
  statementEn: "You are given an array of n integers and a non-negative number k. Count the pairs (i, j) with i < j for which |a_i − a_j| = k. Pairs are counted by position, so equal values at different positions each form their own pair. When k = 0 this becomes counting the pairs of equal values.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n integers.",
  outputUz: "Yagona butun sonni chiqaring — farqi aynan k ga teng juftliklar soni.",
  outputEn: "Print a single integer — how many pairs have a difference of exactly k.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ k ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "the answer reaches about 5·10^9 and needs a 64-bit type", "pairs are counted by position, not by value"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ k ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi", "juftliklar qiymat bo‘yicha emas, pozitsiya bo‘yicha sanaladi"],
  sampleInputs: ["5 2\n1 3 5 3 1\n", "4 0\n2 2 2 2\n"],
  expect: ["6\n", "6\n"],
  sampleNotesUz: [
    "Qiymatlar 1, 1, 3, 3, 5. Farqi 2 ga teng juftliklar ikki joydan chiqadi: ikkita 1 ni ikkita 3 bilan juftlasak 2 · 2 = 4 ta, ikkita 3 ni 5 bilan juftlasak yana 2 · 1 = 2 ta. Jami 6. Takrorlangan qiymatlar alohida sanaladi, chunki juftliklar pozitsiya bo‘yicha hisoblanadi.",
    "To‘rtala qiymat ham teng, ya'ni har bir juftlikning farqi 0. Juftliklar soni 4 · 3 / 2 = 6.",
  ],
  sampleNotesEn: [
    "The values are 1, 1, 3, 3, 5. Pairs differing by 2 arise in two places: the two 1s against the two 3s give 2 · 2 = 4, and the two 3s against the single 5 give 2 · 1 = 2, for a total of 6. The repeats each count, because pairs are counted by position.",
    "All four values are equal, so every pair differs by 0. The number of pairs is 4 · 3 / 2 = 6.",
  ],
  testInputs: ["5 2\n1 3 5 3 1\n", "4 0\n2 2 2 2\n", "1 5\n7\n", "3 1\n1 2 3\n", "4 1000000000\n-1000000000 0 0 0\n", "5 3\n1 1 1 1 1\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());long long c=0;
for(long long i=0;i<n;++i){
 auto lo=lower_bound(a.begin()+i+1,a.end(),a[i]+k);
 auto hi=upper_bound(a.begin()+i+1,a.end(),a[i]+k);
 c+=hi-lo;}
cout<<c<<"\\n";`,
  wrongNote: "Counting distinct values rather than positions loses every repeat; searching the whole array instead of the part after i counts each pair twice when k is 0.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());
long long c=0;
for(size_t i=0;i<a.size();++i)
 if(binary_search(a.begin()+i+1,a.end(),a[i]+k))++c;
cout<<c<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());long long c=0;
for(long long i=0;i<n;++i){
 auto lo=lower_bound(a.begin(),a.end(),a[i]+k);
 auto hi=upper_bound(a.begin(),a.end(),a[i]+k);
 c+=hi-lo;}
cout<<c/2<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B366", judge: "bt-count-subsets-sum-exact", topic: "backtracking", rating: 1500,
  tag: "Subset enumeration", timeLimitMs: 1000,
  uz: "Yig‘indisi aynan k bo‘lgan qism to‘plamlar",
  en: "Subsets that sum to exactly k",
  statementUz: "Sizga n ta musbat butun sondan iborat massiv va k qiymati berilgan. Elementlari yig‘indisi aynan k ga teng bo‘lgan qism to‘plamlar sonini toping. Qism to‘plamlar pozitsiya bo‘yicha farqlanadi, ya'ni bir xil qiymatlar har xil pozitsiyalarda turgan bo‘lsa, ular har xil qism to‘plam hosil qiladi. Bo‘sh qism to‘plamning yig‘indisi 0 ga teng va u faqat k = 0 bo‘lgandagina sanaladi.",
  statementEn: "You are given an array of n positive integers and a value k. Count the subsets whose elements sum to exactly k. Subsets are distinguished by position, so equal values sitting at different positions form different subsets. The empty subset sums to 0 and is counted only when k = 0.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n positive integers.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi aynan k ga teng qism to‘plamlar soni.",
  outputEn: "Print a single integer — how many subsets sum to exactly k.",
  constraintList: ["1 ≤ n ≤ 20", "0 ≤ k ≤ 10^12", "1 ≤ a_i ≤ 10^9", "2^20 subsets is what makes the enumeration feasible", "the empty subset counts only when k is 0"],
  constraintListUz: ["1 ≤ n ≤ 20", "0 ≤ k ≤ 10^12", "1 ≤ a_i ≤ 10^9", "2^20 ta qism to‘plam sanashni amaliy qiladi", "bo‘sh qism to‘plam faqat k = 0 bo‘lganda sanaladi"],
  sampleInputs: ["4 5\n1 2 3 4\n", "3 0\n1 2 3\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "Yig‘indisi 5 bo‘lgan qism to‘plamlar: {1, 4} va {2, 3} — ikkitasi. {1, 2, 3} ning yig‘indisi 6, {5} esa massivda yo‘q.",
    "k = 0 bo‘lganda faqat bo‘sh qism to‘plam yaraydi, chunki barcha qiymatlar musbat va istalgan bo‘sh bo‘lmagan to‘plamning yig‘indisi noldan katta. Shuning uchun javob 1.",
  ],
  sampleNotesEn: [
    "The subsets summing to 5 are {1, 4} and {2, 3} — two of them. {1, 2, 3} sums to 6, and there is no 5 in the array to take alone.",
    "With k = 0 only the empty subset qualifies, since every value is positive and any non-empty subset sums above zero. So the answer is 1.",
  ],
  testInputs: ["4 5\n1 2 3 4\n", "3 0\n1 2 3\n", "1 1\n1\n", "4 4\n1 1 1 1\n", "3 7\n1 2 3\n", "5 5\n5 5 5 5 5\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(long long m=0;m<(1LL<<n);++m){long long s=0;
 for(long long b=0;b<n;++b)if(m>>b&1)s+=a[b];
 if(s==k)++c;}
cout<<c<<"\\n";`,
  wrongNote: "Skipping the empty mask loses the only subset that sums to zero; counting sums at most k answers a different question.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(long long m=1;m<(1LL<<n);++m){long long s=0;
 for(long long b=0;b<n;++b)if(m>>b&1)s+=a[b];
 if(s==k)++c;}
cout<<c<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(long long m=0;m<(1LL<<n);++m){long long s=0;
 for(long long b=0;b<n;++b)if(m>>b&1)s+=a[b];
 if(s<=k)++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B367", judge: "tree-count-even-subtrees", topic: "trees", rating: 1500,
  tag: "Subtree sizes", timeLimitMs: 1000,
  uz: "Qism daraxti juft bo‘lgan uchlar",
  en: "Nodes whose subtree has an even size",
  statementUz: "Sizga 1-uchida ildizlangan, n ta uchdan iborat daraxt berilgan. Uchning qism daraxti o‘sha uch va uning ostidagi barcha uchlardan iborat. Qism daraxtidagi uchlar soni juft bo‘lgan uchlar nechtaligini sanang. Ildizning o‘zi ham hisobga olinadi: uning qism daraxti butun daraxtga teng, ya'ni n juft bo‘lsa, ildiz ham sanaladi.",
  statementEn: "You are given a tree with n nodes rooted at node 1. The subtree of a node consists of that node together with everything below it. Count the nodes whose subtree holds an even number of nodes. The root itself is included: its subtree is the whole tree, so the root counts whenever n is even.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n − 1 qatorning har birida a va b uchlari orasidagi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains one integer n. Each of the next n − 1 lines contains two integers a and b, an edge between nodes a and b.",
  outputUz: "Yagona butun sonni chiqaring — qism daraxti juft o‘lchamli bo‘lgan uchlar soni.",
  outputEn: "Print a single integer — how many nodes have a subtree of even size.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "the given edges always form a tree", "a leaf has a subtree of size 1, which is odd"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "berilgan qirralar har doim daraxt hosil qiladi", "bargning qism daraxti o‘lchami 1, ya'ni toq"],
  sampleInputs: ["4\n1 2\n1 3\n3 4\n", "1\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Qism daraxt o‘lchamlari: 4-uch 1 ta, 3-uch 2 ta (o‘zi va 4), 2-uch 1 ta, 1-uch 4 ta. Juftlari 3-uch (2) va 1-uch (4) — ikkita.",
    "Yagona uch ildizning o‘zi va uning qism daraxti 1 ta uchdan iborat, ya'ni toq. Shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "The subtree sizes are 1 for node 4, 2 for node 3 (itself and 4), 1 for node 2 and 4 for node 1. The even ones are node 3 with 2 and node 1 with 4 — two of them.",
    "The only node is the root and its subtree holds one node, which is odd, so the answer is 0.",
  ],
  testInputs: ["4\n1 2\n1 3\n3 4\n", "1\n", "2\n1 2\n", "5\n1 2\n2 3\n3 4\n4 5\n", "5\n1 2\n1 3\n1 4\n1 5\n", "6\n1 2\n1 3\n2 4\n2 5\n3 6\n"],
  sol: `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);vector<long long>sz(n+1,1);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
for(int i=(int)order.size()-1;i>=1;--i){int v=order[i];sz[par[v]]+=sz[v];}
long long c=0;for(int v=1;v<=n;++v)if(sz[v]%2==0)++c;
cout<<c<<"\\n";`,
  wrongNote: "Leaving the root out of the count drops the whole tree from consideration; counting odd subtrees answers the opposite question.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);vector<long long>sz(n+1,1);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
for(int i=(int)order.size()-1;i>=1;--i){int v=order[i];sz[par[v]]+=sz[v];}
long long c=0;for(int v=2;v<=n;++v)if(sz[v]%2==0)++c;
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);vector<long long>sz(n+1,1);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
for(int i=(int)order.size()-1;i>=1;--i){int v=order[i];sz[par[v]]+=sz[v];}
long long c=0;for(int v=1;v<=n;++v)if(sz[v]%2==1)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B368", judge: "bt-gray-code-nth", topic: "backtracking", rating: 1500,
  tag: "Bit tricks", timeLimitMs: 1000,
  uz: "Grey kodining k-chi a'zosi",
  en: "The k-th Gray code",
  statementUz: "n bitli Grey kodi — 0 dan 2^n − 1 gacha bo‘lgan barcha sonlarning shunday tartibi-ki, ketma-ket kelgan har ikki son aynan bitta bitda farq qiladi va ro‘yxat 0 dan boshlanadi. Sizga n va k berilgan; shu tartibdagi k-chi sonni chiqaring, bunda hisob 0 dan boshlanadi. Standart Grey kodi k XOR (k >> 1) formulasi bilan beriladi.",
  statementEn: "The n-bit Gray code is an ordering of all the numbers from 0 to 2^n − 1 in which any two consecutive entries differ in exactly one bit, starting from 0. You are given n and k; print the k-th entry of that ordering, counting from 0. The standard Gray code is given by the formula k XOR (k >> 1).",
  inputUz: "Yagona qatorda ikkita n va k butun soni beriladi; 0 ≤ k < 2^n.",
  inputEn: "The only line contains two integers n and k, with 0 ≤ k < 2^n.",
  outputUz: "Yagona butun sonni chiqaring — Grey kodining k-chi a'zosi.",
  outputEn: "Print a single integer — the k-th entry of the Gray code.",
  constraintList: ["1 ≤ n ≤ 60", "0 ≤ k < 2^n", "the answer can reach 2^60 and needs a 64-bit type", "the ordering starts at 0, so k = 0 gives 0"],
  constraintListUz: ["1 ≤ n ≤ 60", "0 ≤ k < 2^n", "javob 2^60 ga yetadi va 64-bitli turni talab qiladi", "tartib 0 dan boshlanadi, ya'ni k = 0 uchun javob 0"],
  sampleInputs: ["3 5\n", "3 0\n"],
  expect: ["7\n", "0\n"],
  sampleNotesUz: [
    "3 bitli Grey kodi: 0, 1, 3, 2, 6, 7, 5, 4. Uning 5-a'zosi (0 dan sanaganda) 7. Formula ham shuni beradi: 5 XOR (5 >> 1) = 5 XOR 2 = 7.",
    "Ro‘yxat 0 dan boshlanadi, shuning uchun k = 0 uchun javob 0. Formula ham 0 XOR 0 = 0 beradi.",
  ],
  sampleNotesEn: [
    "The 3-bit Gray code is 0, 1, 3, 2, 6, 7, 5, 4. Its entry number 5, counting from 0, is 7. The formula agrees: 5 XOR (5 >> 1) = 5 XOR 2 = 7.",
    "The ordering starts at 0, so k = 0 gives 0. The formula agrees: 0 XOR 0 = 0.",
  ],
  testInputs: ["3 5\n", "3 0\n", "1 1\n", "60 1152921504606846975\n", "4 15\n", "2 3\n"],
  sol: `long long n,k;cin>>n>>k;
cout<<(k^(k>>1))<<"\\n";`,
  wrongNote: "Shifting the other way builds a different sequence; returning k itself is the identity ordering, in which consecutive entries differ in more than one bit.",
  wrong: [
    `long long n,k;cin>>n>>k;
cout<<(k^(k<<1))<<"\\n";`,
    `long long n,k;cin>>n>>k;
cout<<k<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B369", judge: "bs-max-square-side-ones", topic: "binary-search", rating: 1600,
  tag: "2D prefix sums", timeLimitMs: 1000,
  uz: "Faqat birlardan iborat eng katta kvadrat",
  en: "The largest square of ones",
  statementUz: "Sizga 0 va 1 lardan iborat r × c jadval berilgan. Butunlay birlardan tuzilgan eng katta kvadratning tomon uzunligini toping. Kvadratning tomoni s bo‘lsa, u s × s o‘lchamdagi katakchalar blokidan iborat bo‘ladi va uning har bir katagi 1 ga teng bo‘lishi shart. Agar jadvalda birorta ham 1 bo‘lmasa, javob 0 bo‘ladi.",
  statementEn: "You are given an r × c grid of 0s and 1s. Find the side length of the largest square made entirely of ones. A square of side s is an s × s block of cells, and every one of its cells must hold a 1. If the grid holds no 1 at all, the answer is 0.",
  inputUz: "Birinchi qatorda ikkita r va c butun soni beriladi. Keyingi r qatorning har birida probelsiz c ta belgi (0 yoki 1) keladi.",
  inputEn: "The first line contains two integers r and c. Each of the next r lines contains c characters, each 0 or 1, with no spaces.",
  outputUz: "Yagona butun sonni chiqaring — faqat birlardan iborat eng katta kvadratning tomoni.",
  outputEn: "Print a single integer — the side of the largest square made only of ones.",
  constraintList: ["1 ≤ r ≤ 500", "1 ≤ c ≤ 500", "each character is 0 or 1", "the answer is 0 when the grid holds no 1"],
  constraintListUz: ["1 ≤ r ≤ 500", "1 ≤ c ≤ 500", "har bir belgi 0 yoki 1", "jadvalda 1 bo‘lmasa javob 0"],
  sampleInputs: ["4 5\n10111\n10111\n11111\n10010\n", "2 2\n00\n00\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "O‘ng yuqori burchakdagi 3 × 3 blok butunlay birlardan iborat: 1–3-satrlarning 3–5-ustunlari. Undan kattasi yo‘q, chunki 4-satrda ko‘p nollar bor.",
    "Jadvalda birorta ham 1 yo‘q, shuning uchun hech qanday kvadrat yasab bo‘lmaydi va javob 0.",
  ],
  sampleNotesEn: [
    "The 3 × 3 block in the top right is entirely ones: rows 1 to 3 against columns 3 to 5. Nothing larger fits, because the fourth row is mostly zeros.",
    "The grid holds no 1 at all, so no square can be formed and the answer is 0.",
  ],
  testInputs: ["4 5\n10111\n10111\n11111\n10010\n", "2 2\n00\n00\n", "1 1\n1\n", "3 3\n111\n111\n111\n", "2 3\n111\n111\n", "1 4\n1111\n", "3 3\n011\n111\n111\n"],
  sol: `int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<int>>dp(r,vector<int>(c,0));int best=0;
for(int i=0;i<r;++i)for(int j=0;j<c;++j){
 if(g[i][j]!='1')continue;
 dp[i][j]=(i==0||j==0)?1:1+min(dp[i-1][j],min(dp[i][j-1],dp[i-1][j-1]));
 best=max(best,dp[i][j]);}
cout<<best<<"\\n";`,
  wrongNote: "Taking the minimum of only the two neighbours above and to the left allows a square with a hole at its corner; counting the longest run of ones in a row measures a rectangle, not a square.",
  wrong: [
    `int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<int>>dp(r,vector<int>(c,0));int best=0;
for(int i=0;i<r;++i)for(int j=0;j<c;++j){
 if(g[i][j]!='1')continue;
 dp[i][j]=(i==0||j==0)?1:1+min(dp[i-1][j],dp[i][j-1]);
 best=max(best,dp[i][j]);}
cout<<best<<"\\n";`,
    `int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
int best=0;
for(int i=0;i<r;++i){int run=0;
 for(int j=0;j<c;++j){if(g[i][j]=='1')++run;else run=0;best=max(best,run);}}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B370", judge: "dp-min-deletions-palindrome", topic: "dynamic-programming", rating: 1700,
  tag: "Longest palindromic subsequence", timeLimitMs: 2000,
  uz: "Palindrom qilish uchun eng kam o‘chirish",
  en: "Fewest deletions to leave a palindrome",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Undan eng kam nechta harfni o‘chirsak, qolgan harflar o‘z tartibida palindrom hosil qiladi? O‘chirilmagan harflarning tartibi o‘zgarmaydi. Bitta harf allaqachon palindrom, shuning uchun javob satr uzunligidan bittani ayirgan qiymatdan oshmaydi.",
  statementEn: "You are given a string s of lowercase Latin letters. What is the fewest letters that can be deleted so that the remaining letters, in their original order, form a palindrome? The letters that survive keep their order. A single letter is already a palindrome, so the answer never exceeds the length of the string minus one.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — o‘chirilishi kerak bo‘lgan eng kam harflar soni.",
  outputEn: "Print a single integer — the fewest letters that must be deleted.",
  constraintList: ["1 ≤ |s| ≤ 1000", "s consists of the characters 'a'–'z' only", "a string that is already a palindrome needs no deletion"],
  constraintListUz: ["1 ≤ |s| ≤ 1000", "s faqat 'a'–'z' belgilaridan iborat", "allaqachon palindrom bo‘lgan satrga o‘chirish kerak emas"],
  sampleInputs: ["abcda\n", "aba\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Eng uzun palindromik qism ketma-ketlik \"ada\" yoki \"aca\" bo‘lib, uzunligi 3. Satr uzunligi 5, demak 5 − 3 = 2 ta harfni o‘chirish kerak.",
    "\"aba\" allaqachon palindrom, ya'ni butun satrning o‘zi eng uzun palindromik qism ketma-ketlik. Shuning uchun hech narsa o‘chirilmaydi va javob 0.",
  ],
  sampleNotesEn: [
    "The longest palindromic subsequence is \"ada\" or \"aca\", of length 3. The string has length 5, so 5 − 3 = 2 letters must go.",
    "\"aba\" is already a palindrome, so the whole string is its own longest palindromic subsequence. Nothing is deleted and the answer is 0.",
  ],
  testInputs: ["abcda\n", "aba\n", "a\n", "abcde\n", "aaaa\n", "abacdfgdcaba\n"],
  sol: `string s;cin>>s;int n=s.size();
vector<vector<int>>dp(n,vector<int>(n,0));
for(int i=n-1;i>=0;--i){dp[i][i]=1;
 for(int j=i+1;j<n;++j)
  dp[i][j]=(s[i]==s[j])?dp[i+1][j-1]+2:max(dp[i+1][j],dp[i][j-1]);}
cout<<(n-dp[0][n-1])<<"\\n";`,
  wrongNote: "Reporting the palindrome's length answers what is kept rather than what is removed; using the longest palindromic substring instead of subsequence deletes more than necessary.",
  wrong: [
    `string s;cin>>s;int n=s.size();
vector<vector<int>>dp(n,vector<int>(n,0));
for(int i=n-1;i>=0;--i){dp[i][i]=1;
 for(int j=i+1;j<n;++j)
  dp[i][j]=(s[i]==s[j])?dp[i+1][j-1]+2:max(dp[i+1][j],dp[i][j-1]);}
cout<<dp[0][n-1]<<"\\n";`,
    `string s;cin>>s;int n=s.size();int best=0;
for(int i=0;i<n;++i)for(int j=i;j<n;++j){
 bool pal=true;
 for(int a=i,b=j;a<b;++a,--b)if(s[a]!=s[b]){pal=false;break;}
 if(pal)best=max(best,j-i+1);}
cout<<(n-best)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C371", judge: "dp-min-palindrome-cuts", topic: "dynamic-programming", rating: 1900,
  tag: "Interval DP", timeLimitMs: 2000,
  uz: "Palindromlarga bo‘lish uchun eng kam kesim",
  en: "Fewest cuts into palindromes",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uni har bir bo‘lagi palindrom bo‘ladigan qilib uzluksiz bo‘laklarga ajratmoqchisiz. Buning uchun kerak bo‘ladigan eng kam kesimlar sonini toping; k ta kesim satrni k + 1 ta bo‘lakka ajratadi. Agar satrning o‘zi palindrom bo‘lsa, birorta kesim kerak emas va javob 0 bo‘ladi.",
  statementEn: "You are given a string s of lowercase Latin letters. You want to cut it into contiguous pieces so that every piece is a palindrome. Find the fewest cuts needed; k cuts split the string into k + 1 pieces. If the string is already a palindrome no cut is needed and the answer is 0.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — eng kam kesimlar soni.",
  outputEn: "Print a single integer — the fewest cuts needed.",
  constraintList: ["1 ≤ |s| ≤ 1000", "s consists of the characters 'a'–'z' only", "a single character is a palindrome, so the answer never exceeds |s| − 1"],
  constraintListUz: ["1 ≤ |s| ≤ 1000", "s faqat 'a'–'z' belgilaridan iborat", "bitta belgi palindrom, shuning uchun javob hech qachon |s| − 1 dan oshmaydi"],
  sampleInputs: ["aab\n", "abba\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "\"aa\" va \"b\" bo‘laklariga ajratsak, ikkalasi ham palindrom bo‘ladi — bitta kesim kifoya. Kesimsiz bo‘lmaydi, chunki \"aab\" ning o‘zi palindrom emas.",
    "\"abba\" allaqachon palindrom, shuning uchun uni butunligicha qoldirish mumkin va kesim kerak emas: javob 0.",
  ],
  sampleNotesEn: [
    "Splitting into \"aa\" and \"b\" leaves two palindromes, so one cut is enough. Zero cuts will not do, since \"aab\" is not itself a palindrome.",
    "\"abba\" is already a palindrome, so it can be left whole and no cut is needed: the answer is 0.",
  ],
  testInputs: ["aab\n", "abba\n", "a\n", "abcde\n", "aaaa\n", "banana\n", "aaba\n"],
  sol: `string s;cin>>s;int n=s.size();
vector<vector<char>>pal(n,vector<char>(n,0));
for(int i=n-1;i>=0;--i)for(int j=i;j<n;++j)
 pal[i][j]=(s[i]==s[j])&&(j-i<2||pal[i+1][j-1]);
vector<int>dp(n+1,n);dp[0]=0;
for(int j=1;j<=n;++j)for(int i=1;i<=j;++i)
 if(pal[i-1][j-1])dp[j]=min(dp[j],dp[i-1]+1);
cout<<(dp[n]-1)<<"\\n";`,
  wrongNote: "Reporting the number of pieces instead of the cuts is off by one everywhere; a greedy that takes the longest palindrome it can see from the left is not optimal.",
  wrong: [
    `string s;cin>>s;int n=s.size();
vector<vector<char>>pal(n,vector<char>(n,0));
for(int i=n-1;i>=0;--i)for(int j=i;j<n;++j)
 pal[i][j]=(s[i]==s[j])&&(j-i<2||pal[i+1][j-1]);
vector<int>dp(n+1,n);dp[0]=0;
for(int j=1;j<=n;++j)for(int i=1;i<=j;++i)
 if(pal[i-1][j-1])dp[j]=min(dp[j],dp[i-1]+1);
cout<<dp[n]<<"\\n";`,
    `string s;cin>>s;int n=s.size();
auto isPal=[&](int i,int j){while(i<j){if(s[i]!=s[j])return false;++i;--j;}return true;};
int cuts=0,i=0;
while(i<n){int best=i;
 for(int j=n-1;j>=i;--j)if(isPal(i,j)){best=j;break;}
 i=best+1;if(i<n)++cuts;}
cout<<cuts<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C372", judge: "graph-count-triangles", topic: "graphs", rating: 1900,
  tag: "Triangle counting", timeLimitMs: 2000,
  uz: "Grafdagi uchburchaklar soni",
  en: "Counting triangles in a graph",
  statementUz: "Sizga n ta uchi va m ta qirrasi bo‘lgan yo‘naltirilmagan graf berilgan. Undagi uchburchaklar sonini toping; uchburchak — bu juft-jufti bilan qirra orqali bog‘langan uchta har xil uch. Uchburchak uchlar to‘plami bilan aniqlanadi, ya'ni bir xil uchta uch qanday tartibda sanalmasin, bitta uchburchak hisoblanadi. Graf sodda: bir xil juftlik orasida ikkinchi qirra ham, uchning o‘ziga qirra ham yo‘q.",
  statementEn: "You are given an undirected graph with n vertices and m edges. Count the triangles in it, where a triangle is three distinct vertices joined pairwise by edges. A triangle is identified by its set of vertices, so the same three vertices in any order are one triangle. The graph is simple: no repeated edge between a pair and no edge from a vertex to itself.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a va b uchlarini bog‘lovchi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains two integers a and b, an edge joining vertices a and b.",
  outputUz: "Yagona butun sonni chiqaring — grafdagi uchburchaklar soni.",
  outputEn: "Print a single integer — how many triangles the graph holds.",
  constraintList: ["1 ≤ n ≤ 500", "0 ≤ m ≤ n(n−1)/2", "1 ≤ a, b ≤ n and a ≠ b", "the graph is simple, with no repeated edges", "the answer can reach about 2·10^7"],
  constraintListUz: ["1 ≤ n ≤ 500", "0 ≤ m ≤ n(n−1)/2", "1 ≤ a, b ≤ n va a ≠ b", "graf sodda, takroriy qirralarsiz", "javob taxminan 2·10^7 ga yetishi mumkin"],
  sampleInputs: ["4 5\n1 2\n2 3\n1 3\n3 4\n2 4\n", "3 2\n1 2\n2 3\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Uchburchaklar: {1,2,3} va {2,3,4} — ikkitasi. {1,2,4} uchburchak emas, chunki 1 va 4 orasida qirra yo‘q.",
    "Ikkita qirra yo‘l hosil qiladi, uchburchak uchun esa uchinchi qirra — 1 va 3 orasida — kerak edi. Shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "The triangles are {1,2,3} and {2,3,4} — two of them. {1,2,4} is not one, because there is no edge between 1 and 4.",
    "Two edges form a path; a triangle would need a third edge between 1 and 3. So the answer is 0.",
  ],
  testInputs: ["4 5\n1 2\n2 3\n1 3\n3 4\n2 4\n", "3 2\n1 2\n2 3\n", "1 0\n", "3 3\n1 2\n2 3\n1 3\n", "4 6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4\n", "5 4\n1 2\n2 3\n3 4\n4 5\n"],
  sol: `int n,m;cin>>n>>m;
vector<vector<char>>adj(n+1,vector<char>(n+1,0));
for(int i=0;i<m;++i){int a,b;cin>>a>>b;adj[a][b]=1;adj[b][a]=1;}
long long c=0;
for(int i=1;i<=n;++i)for(int j=i+1;j<=n;++j){if(!adj[i][j])continue;
 for(int k=j+1;k<=n;++k)if(adj[i][k]&&adj[j][k])++c;}
cout<<c<<"\\n";`,
  wrongNote: "Letting the three indices range freely counts each triangle once per ordering; counting closed walks of length three over the whole matrix counts every direction as well.",
  wrong: [
    `int n,m;cin>>n>>m;
vector<vector<char>>adj(n+1,vector<char>(n+1,0));
for(int i=0;i<m;++i){int a,b;cin>>a>>b;adj[a][b]=1;adj[b][a]=1;}
long long c=0;
for(int i=1;i<=n;++i)for(int j=1;j<=n;++j){if(i==j||!adj[i][j])continue;
 for(int k=j+1;k<=n;++k)if(k!=i&&adj[i][k]&&adj[j][k])++c;}
cout<<c<<"\\n";`,
    `int n,m;cin>>n>>m;
vector<vector<char>>adj(n+1,vector<char>(n+1,0));
for(int i=0;i<m;++i){int a,b;cin>>a>>b;adj[a][b]=1;adj[b][a]=1;}
long long c=0;
for(int i=1;i<=n;++i)for(int j=1;j<=n;++j)for(int k=1;k<=n;++k)
 if(adj[i][j]&&adj[j][k]&&adj[i][k])++c;
cout<<c<<"\\n";`,
  ],
});

export default P;
