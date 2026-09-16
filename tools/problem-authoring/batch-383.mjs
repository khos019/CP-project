/* Batch 383 — ten problems, A383–C392.
 *
 * Back down the ladder to keep it balanced: foundations, strings, sorting,
 * two pointers, backtracking, geometry and one tree DP at the top.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A383", judge: "array-sum-abs-steps", topic: "foundations", rating: 900,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Qo‘shni farqlar moduli yig‘indisi",
  en: "Total distance walked along the array",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Birinchi elementdan oxirgisiga qadar qo‘shnidan qo‘shniga o‘tib chiqsangiz, jami qancha masofa bosib o‘tiladi? Boshqacha aytganda, har bir qo‘shni juftlik uchun |a_{i+1} − a_i| ni hisoblab, ularning yig‘indisini toping. Bitta elementdan iborat massivda hech qayerga borilmaydi, ya'ni javob 0 bo‘ladi.",
  statementEn: "You are given an array of n integers. Walking from the first element to the last, one neighbour at a time, how far do you travel in total? In other words, compute |a_{i+1} − a_i| for every adjacent pair and add them up. An array of one element goes nowhere, so the answer is 0.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — qo‘shni farqlar modullarining yig‘indisi.",
  outputEn: "Print a single integer — the total of the absolute differences between neighbours.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the answer reaches about 2·10^14 and needs a 64-bit type", "an array of one element answers 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "javob taxminan 2·10^14 ga yetadi va 64-bitli turni talab qiladi", "bitta elementli massiv uchun javob 0"],
  sampleInputs: ["4\n1 5 2 8\n", "1\n7\n"],
  expect: ["13\n", "0\n"],
  sampleNotesUz: [
    "|5 − 1| = 4, |2 − 5| = 3 va |8 − 2| = 6; ularning yig‘indisi 4 + 3 + 6 = 13. Modul olinmasa, 4 − 3 + 6 = 7 chiqardi — pastga tushish ham masofa hisoblanadi.",
    "Bitta element bo‘lganda qo‘shni juftlik umuman yo‘q, shuning uchun yig‘indi bo‘sh va javob 0.",
  ],
  sampleNotesEn: [
    "|5 − 1| = 4, |2 − 5| = 3 and |8 − 2| = 6, which add to 4 + 3 + 6 = 13. Without the absolute value it would come to 4 − 3 + 6 = 7 — going down is distance too.",
    "With one element there is no adjacent pair at all, so the sum is empty and the answer is 0.",
  ],
  testInputs: ["4\n1 5 2 8\n", "1\n7\n", "2\n-1000000000 1000000000\n", "5\n1 2 3 4 5\n", "5\n5 4 3 2 1\n", "3\n0 0 0\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long total=0;
for(int i=1;i<n;++i)total+=llabs(a[i]-a[i-1]);
cout<<total<<"\\n";`,
  wrongNote: "Dropping the absolute value lets the descents cancel the climbs and collapses to the difference between the ends; the distance from the first element to the last ignores the route.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long total=0;
for(int i=1;i<n;++i)total+=a[i]-a[i-1];
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
cout<<llabs(a[n-1]-a[0])<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A384", judge: "is-perfect-square", topic: "math", rating: 900,
  tag: "Roots", timeLimitMs: 1000,
  uz: "Son to‘liq kvadratmi",
  en: "Is the number a perfect square",
  statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan. Uni biror butun sonning kvadrati sifatida yozish mumkinmi, aniqlang; ya'ni k · k = n bo‘ladigan manfiy bo‘lmagan butun k mavjudmi. 0 ham to‘liq kvadrat hisoblanadi, chunki 0 · 0 = 0. n 10^18 gacha borgani uchun suzuvchi nuqtadagi ildizga ishonmasdan, natijani butun sonlarda tekshirib ko‘rish kerak.",
  statementEn: "You are given a non-negative integer n. Determine whether it can be written as the square of an integer, that is whether some non-negative integer k satisfies k · k = n. Zero counts as a perfect square, since 0 · 0 = 0. As n goes up to 10^18 the floating-point root cannot be trusted on its own and the result has to be checked in integers.",
  inputUz: "Yagona qatorda manfiy bo‘lmagan n butun soni beriladi.",
  inputEn: "The only line contains the non-negative integer n.",
  outputUz: "Agar n to‘liq kvadrat bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if n is a perfect square and NO otherwise, in capital letters.",
  constraintList: ["0 ≤ n ≤ 10^18", "the root can reach 10^9", "0 counts as a perfect square"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "ildiz 10^9 ga yetishi mumkin", "0 to‘liq kvadrat hisoblanadi"],
  sampleInputs: ["49\n", "50\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "7 · 7 = 49, shuning uchun javob YES.",
    "49 = 7² va 64 = 8², 50 esa ular orasida qoladi — hech qanday butun sonning kvadrati emas, javob NO.",
  ],
  sampleNotesEn: [
    "7 · 7 = 49, so the answer is YES.",
    "49 is 7² and 64 is 8², and 50 falls between them — it is no integer's square, so the answer is NO.",
  ],
  testInputs: ["49\n", "50\n", "0\n", "1\n", "999999999999999999\n", "1000000000000000000\n"],
  sol: `long long n;cin>>n;
long long k=(long long)sqrtl((long double)n);
while(k>0&&k*k>n)--k;
while((k+1)*(k+1)<=n)++k;
cout<<((k*k==n)?"YES":"NO")<<"\\n";`,
  wrongNote: "The last digit of a square is never 2, 3, 7 or 8, but ruling those out is only half a test — it says yes to everything else; treating 0 as a special case that is not a square contradicts the statement.",
  wrong: [
    `long long n;cin>>n;long long d=n%10;
bool maybe=(d!=2&&d!=3&&d!=7&&d!=8);
cout<<(maybe?"YES":"NO")<<"\\n";`,
    `long long n;cin>>n;
if(n==0){cout<<"NO\\n";return 0;}
long long k=(long long)sqrtl((long double)n);
while(k>0&&k*k>n)--k;
while((k+1)*(k+1)<=n)++k;
cout<<((k*k==n)?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A385", judge: "str-count-adjacent-equal", topic: "strings", rating: 1000,
  tag: "Characters", timeLimitMs: 1000,
  uz: "Yonma-yon turgan teng juftliklar",
  en: "Neighbouring letters that match",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Unda yonma-yon turgan va teng bo‘lgan harflar juftliklari nechtaligini sanang. Ya'ni s_i = s_{i+1} shartini qanoatlantiruvchi i pozitsiyalar soni talab qilinadi. Uchta bir xil harf ketma-ket kelsa, u ikkita juftlik beradi, chunki juftliklar qoplashishi mumkin.",
  statementEn: "You are given a string s of lowercase Latin letters. Count how many neighbouring pairs of letters are equal, that is how many positions i satisfy s_i = s_{i+1}. Three equal letters in a row give two pairs, since the pairs are allowed to overlap.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — yonma-yon turgan teng juftliklar soni.",
  outputEn: "Print a single integer — how many neighbouring pairs are equal.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' only", "pairs may overlap, so aaa gives two"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' belgilaridan iborat", "juftliklar qoplashishi mumkin, ya'ni aaa ikkita beradi"],
  sampleInputs: ["aabbbc\n", "abc\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Juftliklar: (1,2) ikkita a, (3,4) va (4,5) uchta b dan ikkita juftlik. Jami 3. Uchta b ikkita juftlik bergani qoplashishga ruxsat berilganini ko‘rsatadi.",
    "Hech qanday ikki qo‘shni harf teng emas, shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "The pairs are positions (1,2) from the two a's, and (3,4) and (4,5) from the three b's — three in total. The run of three b's giving two pairs is what overlapping means here.",
    "No two neighbouring letters are equal, so the answer is 0.",
  ],
  testInputs: ["aabbbc\n", "abc\n", "a\n", "aaaa\n", "abab\n", "zz\n"],
  sol: `string s;cin>>s;long long c=0;
for(size_t i=1;i<s.size();++i)if(s[i]==s[i-1])++c;
cout<<c<<"\\n";`,
  wrongNote: "Counting the runs of equal letters rather than the pairs inside them reports one for a run of three; skipping past a match avoids the overlap the statement allows.",
  wrong: [
    `string s;cin>>s;long long c=0;
for(size_t i=1;i<s.size();++i)if(s[i]==s[i-1]&&(i<2||s[i-1]!=s[i-2]))++c;
cout<<c<<"\\n";`,
    `string s;cin>>s;long long c=0;
for(size_t i=1;i<s.size();++i)if(s[i]==s[i-1]){++c;++i;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B386", judge: "sort-by-digit-sum", topic: "sorting", rating: 1300,
  tag: "Custom comparator", timeLimitMs: 1000,
  uz: "Raqamlari yig‘indisi bo‘yicha saralash",
  en: "Sorting by digit sum",
  statementUz: "Sizga n ta musbat butun sondan iborat massiv berilgan. Uni raqamlari yig‘indisi bo‘yicha o‘sish tartibida saralang. Ikki sonning raqamlari yig‘indisi teng bo‘lsa, ular orasida kichigi oldin tursin. Masalan, 19 va 91 ning yig‘indisi ham 10 ga teng, shuning uchun ular orasida 19 oldinga o‘tadi.",
  statementEn: "You are given an array of n positive integers. The digit sum of a number is the total of its decimal digits, so 91 has digit sum 9 + 1 = 10. Sort the array by digit sum in increasing order. When two numbers have the same digit sum, the smaller number comes first: 19 and 91 both sum to 10, so 19 goes before 91. Every element of the array survives; only the order changes.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n positive integers.",
  outputUz: "Bitta qatorda, probel bilan ajratib, n ta sonni yuqoridagi tartibda chiqaring.",
  outputEn: "Print the n numbers on one line, separated by single spaces, in the order described above.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "on an equal digit sum the smaller number comes first", "duplicates are kept, so the output holds exactly n numbers"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "raqamlar yig‘indisi teng bo‘lganda kichik son oldin turadi", "takrorlanishlar saqlanadi, ya'ni chiqishda aynan n ta son bo‘ladi"],
  sampleInputs: ["5\n91 19 5 23 100\n", "3\n10 100 1000\n"],
  expect: ["100 5 23 19 91\n", "10 100 1000\n"],
  sampleNotesUz: [
    "Raqam yig‘indilari: 91 → 10, 19 → 10, 5 → 5, 23 → 5, 100 → 1. Eng kichigi 100 (1), so‘ng yig‘indisi 5 bo‘lganlar 5 va 23 — kichigi 5 oldin; oxirida yig‘indisi 10 bo‘lganlar 19 va 91, kichigi 19 oldin.",
    "Uchala sonning raqamlari yig‘indisi ham 1 ga teng, shuning uchun tartibni faqat qiymat hal qiladi: 10, 100, 1000.",
  ],
  sampleNotesEn: [
    "The digit sums are 91 → 10, 19 → 10, 5 → 5, 23 → 5 and 100 → 1. The smallest is 100 with 1, then the two summing to 5 where the smaller value 5 leads, and finally the two summing to 10 where 19 leads.",
    "All three numbers have digit sum 1, so only the value decides: 10, 100, 1000.",
  ],
  testInputs: ["5\n91 19 5 23 100\n", "3\n10 100 1000\n", "1\n7\n", "4\n1 2 3 4\n", "4\n999999999 1 10 100\n", "3\n12 21 3\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
auto ds=[](long long v){long long s=0;while(v){s+=v%10;v/=10;}return s;};
stable_sort(a.begin(),a.end(),[&](long long x,long long y){
 long long dx=ds(x),dy=ds(y);
 if(dx!=dy)return dx<dy;
 return x<y;});
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
  wrongNote: "Leaving the tie unbroken keeps whatever order the input happened to have; sorting by value alone ignores the digit sums entirely.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
auto ds=[](long long v){long long s=0;while(v){s+=v%10;v/=10;}return s;};
stable_sort(a.begin(),a.end(),[&](long long x,long long y){return ds(x)<ds(y);});
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B387", judge: "two-pointers-count-common", topic: "two-pointers", rating: 1300,
  tag: "Merging", timeLimitMs: 1000,
  uz: "Ikki saralangan massivdagi umumiy qiymatlar",
  en: "Values shared by two sorted arrays",
  statementUz: "Sizga ikkita kamaymaydigan tartibda saralangan massiv berilgan. Ikkalasida ham uchraydigan har xil qiymatlar nechtaligini sanang. Qiymat har bir massivda necha marta takrorlanishidan qat'i nazar, javobga bittadan hissa qo‘shadi. Ikkala massivning uzunligi har xil bo‘lishi mumkin va ulardan biri boshqasi bilan umuman umumiy qiymatga ega bo‘lmasligi mumkin.",
  statementEn: "You are given two arrays, each sorted in non-decreasing order. Count how many distinct values appear in both. A value contributes one to the answer however many times it repeats in either array. The two arrays may have different lengths, and either of them may hold no value in common with the other at all.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Ikkinchi qatorda kamaymaydigan tartibda n ta butun son, uchinchi qatorda esa m ta butun son keladi.",
  inputEn: "The first line contains two integers n and m. The second line contains n integers in non-decreasing order and the third line contains m integers in non-decreasing order.",
  outputUz: "Yagona butun sonni chiqaring — ikkala massivda ham uchraydigan har xil qiymatlar soni.",
  outputEn: "Print a single integer — how many distinct values appear in both arrays.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "−10^9 ≤ values ≤ 10^9", "both arrays arrive sorted in non-decreasing order", "a repeated value counts once"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "−10^9 ≤ qiymatlar ≤ 10^9", "ikkala massiv ham kamaymaydigan tartibda keladi", "takrorlangan qiymat bir marta sanaladi"],
  sampleInputs: ["5 4\n1 2 2 3 5\n2 3 4 5\n", "3 3\n1 1 1\n2 2 2\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Umumiy qiymatlar 2, 3 va 5 — uchtasi. Birinchi massivda 2 ikki marta uchraydi, lekin bu javobni o‘zgartirmaydi, chunki har xil qiymatlar sanaladi.",
    "Birinchi massivda faqat 1, ikkinchisida faqat 2 bor, ya'ni umumiy qiymat yo‘q va javob 0.",
  ],
  sampleNotesEn: [
    "The shared values are 2, 3 and 5 — three of them. The 2 appears twice in the first array, which changes nothing, since distinct values are counted.",
    "The first array holds only 1 and the second only 2, so nothing is shared and the answer is 0.",
  ],
  testInputs: ["5 4\n1 2 2 3 5\n2 3 4 5\n", "3 3\n1 1 1\n2 2 2\n", "1 1\n5\n5\n", "4 4\n1 1 2 2\n1 1 2 2\n", "3 2\n-5 0 5\n-5 5\n", "2 3\n1 2\n3 4 5\n"],
  sol: `int n,m;cin>>n>>m;vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
long long c=0;int i=0,j=0;
while(i<n&&j<m){
 if(a[i]<b[j])++i;
 else if(a[i]>b[j])++j;
 else{++c;long long v=a[i];
  while(i<n&&a[i]==v)++i;
  while(j<m&&b[j]==v)++j;}}
cout<<c<<"\\n";`,
  wrongNote: "Advancing one step at a time on a match counts a shared value once per repeated copy; comparing the arrays position by position only finds values that happen to line up.",
  wrong: [
    `int n,m;cin>>n>>m;vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
long long c=0;int i=0,j=0;
while(i<n&&j<m){
 if(a[i]<b[j])++i;
 else if(a[i]>b[j])++j;
 else{++c;++i;++j;}}
cout<<c<<"\\n";`,
    `int n,m;cin>>n>>m;vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
long long c=0;
for(int i=0;i<min(n,m);++i)if(a[i]==b[i])++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B388", judge: "bt-ways-climb-k-steps", topic: "backtracking", rating: 1400,
  tag: "Counting DP", timeLimitMs: 1000,
  uz: "k tagacha qadam bilan zinapoyaga chiqish",
  en: "Climbing with steps of up to k",
  statementUz: "Sizga zinapoyadagi pog‘onalar soni n va bir qadamda ko‘tarilish mumkin bo‘lgan eng katta pog‘onalar soni k berilgan. Yerdan n-pog‘onagacha chiqishning nechta har xil usuli borligini toping; har bir harakatda 1 dan k gacha pog‘ona ko‘tarilish mumkin. Ikki usul harakatlar ketma-ketligi bilan farqlanadi, ya'ni 1+2 va 2+1 har xil usullar. Javobni 10^9 + 7 modul bo‘yicha chiqaring.",
  statementEn: "You are given the number of stairs n and the largest number of stairs k that one move may climb. Count the distinct ways to climb from the ground to stair n, where each move goes up between 1 and k stairs. Two ways differ if the sequence of moves differs, so 1+2 and 2+1 are different. Print the answer modulo 10^9 + 7.",
  inputUz: "Yagona qatorda ikkita n va k butun soni beriladi.",
  inputEn: "The only line contains two integers n and k.",
  outputUz: "Yagona butun sonni chiqaring — chiqish usullari soni, 10^9 + 7 modul bo‘yicha.",
  outputEn: "Print a single integer — the number of ways, taken modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 100", "the answer is required modulo 10^9 + 7", "the order of the moves matters"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 100", "javob 10^9 + 7 modul bo‘yicha talab qilinadi", "harakatlar tartibi muhim"],
  sampleInputs: ["4 2\n", "4 1\n"],
  expect: ["5\n", "1\n"],
  sampleNotesUz: [
    "k = 2 bo‘lganda usullar: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1 va 2+2 — beshta. Bu Fibonachchi ketma-ketligining o‘zi, chunki har bir qadam ikki tanlovdan iborat.",
    "k = 1 bo‘lganda har bir harakat bitta pog‘onadan iborat, ya'ni yagona usul bor: to‘rtta bir pog‘onalik qadam. Javob 1.",
  ],
  sampleNotesEn: [
    "With k = 2 the ways are 1+1+1+1, 1+1+2, 1+2+1, 2+1+1 and 2+2 — five of them. This is the Fibonacci sequence, since each step offers two choices.",
    "With k = 1 every move climbs one stair, so there is a single way: four moves of one. The answer is 1.",
  ],
  testInputs: ["4 2\n", "4 1\n", "1 100\n", "10 3\n", "100000 2\n", "5 5\n"],
  sol: `long long n,k;cin>>n>>k;const long long M=1000000007;
vector<long long>dp(n+1,0);dp[0]=1;
for(long long i=1;i<=n;++i)
 for(long long s=1;s<=k&&s<=i;++s)dp[i]=(dp[i]+dp[i-s])%M;
cout<<dp[n]<<"\\n";`,
  wrongNote: "Starting the table at zero instead of one leaves every count at zero; allowing a move of size zero adds an infinite loop's worth of ways, here showing up as the count for k+1 sizes.",
  wrong: [
    `long long n,k;cin>>n>>k;const long long M=1000000007;
vector<long long>dp(n+1,0);dp[1]=1;
for(long long i=2;i<=n;++i)
 for(long long s=1;s<=k&&s<=i;++s)dp[i]=(dp[i]+dp[i-s])%M;
cout<<dp[n]<<"\\n";`,
    `long long n,k;cin>>n>>k;const long long M=1000000007;
vector<long long>dp(n+1,0);dp[0]=1;
for(long long i=1;i<=n;++i)
 for(long long s=1;s<=k+1&&s<=i;++s)dp[i]=(dp[i]+dp[i-s])%M;
cout<<dp[n]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B389", judge: "geo-two-rect-union-area", topic: "geometry", rating: 1500,
  tag: "Rectangles", timeLimitMs: 1000,
  uz: "Ikki to‘rtburchak birlashmasining yuzasi",
  en: "Area covered by two rectangles",
  statementUz: "Sizga tomonlari koordinata o‘qlariga parallel ikkita to‘rtburchak berilgan; har biri chap pastki va o‘ng yuqori burchagi bilan aniqlanadi. Ular birgalikda qoplaydigan yuzani toping. To‘rtburchaklar chekkasi bilan tutashishi, qisman kesishishi, biri ikkinchisining ichida yotishi yoki umuman uchrashmasligi mumkin. Yuza 32-bitli turdan oshib ketadi.",
  statementEn: "You are given two axis-aligned rectangles, each by its bottom-left and top-right corner. Find the area they cover together. The rectangles may touch along an edge, overlap partly, sit one inside the other, or not meet at all. The area runs beyond a 32-bit type.",
  inputUz: "Birinchi qatorda to‘rtta butun son x1, y1, x2, y2 — birinchi to‘rtburchakning chap pastki va o‘ng yuqori burchaklari beriladi. Ikkinchi qatorda ikkinchi to‘rtburchak xuddi shunday tavsiflanadi.",
  inputEn: "The first line contains four integers x1, y1, x2, y2 — the bottom-left and top-right corners of the first rectangle. The second line describes the second rectangle the same way.",
  outputUz: "Yagona butun sonni chiqaring — ikki to‘rtburchak birgalikda qoplagan yuza.",
  outputEn: "Print a single integer — the area covered by the two rectangles together.",
  constraintList: ["−10^9 ≤ x1 < x2 ≤ 10^9", "−10^9 ≤ y1 < y2 ≤ 10^9", "the same holds for the second rectangle", "an area reaches 4·10^18 and needs a 64-bit type", "rectangles touching along an edge overlap in zero area"],
  constraintListUz: ["−10^9 ≤ x1 < x2 ≤ 10^9", "−10^9 ≤ y1 < y2 ≤ 10^9", "ikkinchi to‘rtburchak uchun ham shu shartlar", "yuza 4·10^18 ga yetadi va 64-bitli turni talab qiladi", "qirrasi bilan tegib turgan to‘rtburchaklarning kesishma yuzasi nol"],
  sampleInputs: ["0 0 4 4\n2 2 6 6\n", "0 0 1 1\n5 5 6 6\n"],
  expect: ["28\n", "2\n"],
  sampleNotesUz: [
    "Ikkala to‘rtburchakning yuzasi 16 tadan, kesishmasi esa (2,2) dan (4,4) gacha bo‘lgan 2 × 2 = 4 yuzali kvadrat. Birlashma 16 + 16 − 4 = 28.",
    "To‘rtburchaklar bir-biridan uzoqda, kesishma yo‘q. Shuning uchun birlashma shunchaki yuzalar yig‘indisi: 1 + 1 = 2.",
  ],
  sampleNotesEn: [
    "Each rectangle has area 16 and they share the square from (2,2) to (4,4), of area 2 × 2 = 4. The union is 16 + 16 − 4 = 28.",
    "The rectangles are far apart and share nothing, so the union is simply the sum of the areas: 1 + 1 = 2.",
  ],
  testInputs: ["0 0 4 4\n2 2 6 6\n", "0 0 1 1\n5 5 6 6\n", "0 0 2 2\n0 0 2 2\n", "0 0 4 4\n1 1 2 2\n", "0 0 1 1\n1 0 2 1\n", "-1000000000 -1000000000 0 0\n0 0 1000000000 1000000000\n"],
  sol: `long long ax1,ay1,ax2,ay2,bx1,by1,bx2,by2;
cin>>ax1>>ay1>>ax2>>ay2>>bx1>>by1>>bx2>>by2;
long long area=(ax2-ax1)*(ay2-ay1)+(bx2-bx1)*(by2-by1);
long long ox=max(0LL,min(ax2,bx2)-max(ax1,bx1));
long long oy=max(0LL,min(ay2,by2)-max(ay1,by1));
cout<<(area-ox*oy)<<"\\n";`,
  wrongNote: "Adding the two areas counts the overlap twice; letting a negative overlap through subtracts an area that does not exist when the rectangles are apart.",
  wrong: [
    `long long ax1,ay1,ax2,ay2,bx1,by1,bx2,by2;
cin>>ax1>>ay1>>ax2>>ay2>>bx1>>by1>>bx2>>by2;
cout<<((ax2-ax1)*(ay2-ay1)+(bx2-bx1)*(by2-by1))<<"\\n";`,
    `long long ax1,ay1,ax2,ay2,bx1,by1,bx2,by2;
cin>>ax1>>ay1>>ax2>>ay2>>bx1>>by1>>bx2>>by2;
long long area=(ax2-ax1)*(ay2-ay1)+(bx2-bx1)*(by2-by1);
long long ox=min(ax2,bx2)-max(ax1,bx1);
long long oy=min(ay2,by2)-max(ay1,by1);
cout<<(area-ox*oy)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B390", judge: "greedy-min-groups-within-k", topic: "greedy", rating: 1600,
  tag: "Sorting and greedy", timeLimitMs: 1000,
  uz: "Farqi k dan oshmaydigan eng kam guruh",
  en: "Fewest groups with a spread of at most k",
  statementUz: "Sizga n ta butun sondan iborat massiv va k soni berilgan. Barcha elementlarni guruhlarga bo‘ling, shunday-ki har bir guruh ichida eng katta va eng kichik qiymat farqi k dan oshmasin. Kerak bo‘ladigan eng kam guruhlar sonini toping. Guruh bitta elementdan iborat bo‘lishi mumkin va har bir element aynan bitta guruhga tushishi shart.",
  statementEn: "You are given an array of n integers and a number k. Split every element into groups so that within each group the difference between the largest and smallest value is at most k. Find the fewest groups needed. A group may hold a single element, and every element has to land in exactly one group.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n integers.",
  outputUz: "Yagona butun sonni chiqaring — kerak bo‘ladigan eng kam guruhlar soni.",
  outputEn: "Print a single integer — the fewest groups needed.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ k ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "a spread of exactly k is allowed", "every element must belong to a group"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ k ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "farq aynan k ga teng bo‘lishiga ruxsat beriladi", "har bir element biror guruhga tegishli bo‘lishi shart"],
  sampleInputs: ["5 2\n1 3 5 7 2\n", "3 0\n4 4 4\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "Saralangan massiv 1 2 3 5 7. Birinchi guruhga 1, 2, 3 tushadi — ularning farqi 2 va k ga sig‘adi; 5 ni qo‘shsak farq 4 bo‘lib ketardi. Ikkinchi guruh 5 va 7 dan iborat, farqi yana 2. Jami ikkita guruh.",
    "Uchala qiymat teng, ya'ni farq 0 va k = 0 ga sig‘adi. Hammasi bitta guruhga tushadi, javob 1.",
  ],
  sampleNotesEn: [
    "Sorted, the array is 1 2 3 5 7. Taking 1, 2, 3 fills the first group with a spread of 2, and 5, 7 fills the second with a spread of 2 as well.",
    "All three values are equal, so the spread is 0 and fits k = 0. Everything goes into one group and the answer is 1.",
  ],
  testInputs: ["5 2\n1 3 5 7 2\n", "3 0\n4 4 4\n", "1 5\n7\n", "4 0\n1 2 3 4\n", "5 1000000000\n-1000000000 0 1000000000 5 6\n", "6 3\n1 2 3 4 5 6\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long groups=0,start=0;
for(long long i=0;i<n;++i){
 if(i==0||a[i]-a[start]>k){++groups;start=i;}}
cout<<groups<<"\\n";`,
  wrongNote: "Comparing against the previous element rather than the start of the group lets a group drift arbitrarily wide; a strict comparison starts a new group at a spread that was still allowed.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long groups=0;
for(long long i=0;i<n;++i){
 if(i==0||a[i]-a[i-1]>k)++groups;}
cout<<groups<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long groups=0,start=0;
for(long long i=0;i<n;++i){
 if(i==0||a[i]-a[start]>=k){++groups;start=i;}}
cout<<groups<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B391", judge: "bs-min-speed-finish", topic: "binary-search", rating: 1700,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Ishni ulgurish uchun eng kichik tezlik",
  en: "The slowest speed that still finishes",
  statementUz: "Sizda n ta uyum ish bor; i-uyumda a_i birlik ish turibdi. Har soatda bitta uyumni tanlab, undan ko‘pi bilan v birlik ishni bajarasiz; uyumda v dan kam qolgan bo‘lsa, o‘sha soat baribir to‘liq sarflanadi va boshqa uyumga o‘tilmaydi. Barcha uyumlarni H soat ichida tugatish uchun kerak bo‘ladigan eng kichik butun v tezlikni toping.",
  statementEn: "You have n piles of work, the i-th holding a_i units. Each hour you pick one pile and do at most v units from it; if fewer than v remain in that pile the hour is still spent in full and no other pile is touched. Find the smallest whole speed v that finishes every pile within H hours.",
  inputUz: "Birinchi qatorda ikkita n va H butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son keladi.",
  inputEn: "The first line contains two integers n and H. The second line contains n positive integers.",
  outputUz: "Yagona butun sonni chiqaring — barcha uyumlarni H soatda tugatadigan eng kichik tezlik.",
  outputEn: "Print a single integer — the smallest speed that finishes every pile within H hours.",
  constraintList: ["1 ≤ n ≤ 10^5", "n ≤ H ≤ 10^9", "1 ≤ a_i ≤ 10^9", "one hour never spans two piles", "H is at least n, so a speed always exists"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "n ≤ H ≤ 10^9", "1 ≤ a_i ≤ 10^9", "bir soat hech qachon ikki uyumga taqsimlanmaydi", "H kamida n ga teng, shuning uchun mos tezlik har doim mavjud"],
  sampleInputs: ["4 8\n3 6 7 11\n", "1 1\n5\n"],
  expect: ["4\n", "5\n"],
  sampleNotesUz: [
    "v = 4 bo‘lganda soatlar: 3 uchun 1, 6 uchun 2, 7 uchun 2, 11 uchun 3 — jami 8, aynan H ga teng. v = 3 bo‘lsa 1 + 2 + 3 + 4 = 10 > 8, ya'ni yetmaydi.",
    "Yagona uyumni bitta soatda tugatish kerak, shuning uchun tezlik kamida uyum hajmiga teng bo‘lishi shart: 5.",
  ],
  sampleNotesEn: [
    "At v = 4 the hours are 1 for the 3, 2 for the 6, 2 for the 7 and 3 for the 11 — eight in total, exactly H. At v = 3 they come to 1 + 2 + 3 + 4 = 10, which is too many.",
    "A single pile has to be finished within one hour, so the speed must be at least the size of the pile: 5.",
  ],
  testInputs: ["4 8\n3 6 7 11\n", "1 1\n5\n", "3 3\n1 1 1\n", "2 1000000000\n1000000000 1000000000\n", "5 5\n1 2 3 4 5\n", "4 5\n30 11 23 4\n"],
  sol: `long long n,H;cin>>n>>H;vector<long long>a(n);for(auto&x:a)cin>>x;
auto hours=[&](long long v){long long h=0;for(long long x:a)h+=(x+v-1)/v;return h;};
long long lo=1,hi=*max_element(a.begin(),a.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(hours(mid)<=H)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  wrongNote: "Dividing without rounding up pretends a part-used hour is free; searching from zero admits a speed of zero, which finishes nothing.",
  wrong: [
    `long long n,H;cin>>n>>H;vector<long long>a(n);for(auto&x:a)cin>>x;
auto hours=[&](long long v){long long h=0;for(long long x:a)h+=x/v;return h;};
long long lo=1,hi=*max_element(a.begin(),a.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(hours(mid)<=H)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
    `long long n,H;cin>>n>>H;vector<long long>a(n);for(auto&x:a)cin>>x;
auto hours=[&](long long v){long long h=0;for(long long x:a)h+=(x+v-1)/v;return h;};
long long lo=1,hi=accumulate(a.begin(),a.end(),0LL);
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(hours(mid)<H)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C392", judge: "tree-max-path-sum-any", topic: "trees", rating: 1900,
  tag: "Tree DP", timeLimitMs: 2000,
  uz: "Daraxtdagi eng katta yo‘l yig‘indisi",
  en: "The heaviest path in a tree",
  statementUz: "Sizga n ta uchdan iborat daraxt berilgan; har bir uchda butun son yozilgan va u manfiy bo‘lishi mumkin. Istalgan ikki uch orasidagi yo‘ldagi qiymatlar yig‘indisi eng katta bo‘lgan yo‘lni toping va o‘sha yig‘indini chiqaring. Yo‘l bitta uchdan iborat bo‘lishi ham mumkin, ya'ni javob kamida eng katta bitta qiymatga teng bo‘ladi.",
  statementEn: "You are given a tree with n nodes, each holding an integer that may be negative. Among the paths between any two nodes, find the one whose values sum to the most and print that sum. A path may consist of a single node, so the answer is at least the largest single value.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda n ta butun son — uchlardagi qiymatlar keladi. Keyingi n − 1 qatorning har birida a va b uchlari orasidagi qirra beriladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers, the values at the nodes. Each of the next n − 1 lines contains an edge a b.",
  outputUz: "Yagona butun sonni chiqaring — eng katta yo‘l yig‘indisi.",
  outputEn: "Print a single integer — the largest path sum.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ value ≤ 10^9", "the given edges always form a tree", "a single node counts as a path", "the answer reaches 10^14 in magnitude and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ qiymat ≤ 10^9", "berilgan qirralar har doim daraxt hosil qiladi", "yagona uch ham yo‘l hisoblanadi", "javob moduli 10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n1 2 3 4 5\n1 2\n1 3\n3 4\n3 5\n", "3\n-5 -2 -9\n1 2\n2 3\n"],
  expect: ["12\n", "-2\n"],
  sampleNotesUz: [
    "Eng og‘ir yo‘l 4 — 3 — 5 bo‘lib, yig‘indisi 4 + 3 + 5 = 12. Uni 1 ga uzaytirib bo‘lmaydi: yo‘l shoxlanmaydi, 3-uchdan faqat ikki tomonga chiqish mumkin. 2 — 1 — 3 — 5 yo‘li esa atigi 11 beradi.",
    "Barcha qiymatlar manfiy, shuning uchun eng yaxshi tanlov — bitta uchdan iborat yo‘l, ya'ni eng katta qiymat −2. Ikki uchni bog‘lash faqat yig‘indini kamaytiradi.",
  ],
  sampleNotesEn: [
    "The heaviest path is 4 — 3 — 5, totalling 4 + 3 + 5 = 12. It cannot be extended into 1, because a path does not branch and node 3 already uses both of its directions. The route 2 — 1 — 3 — 5 collects only 11.",
    "Every value is negative, so the best choice is a path of a single node — the largest value, −2. Joining two nodes only makes the total smaller.",
  ],
  testInputs: ["5\n1 2 3 4 5\n1 2\n1 3\n3 4\n3 5\n", "3\n-5 -2 -9\n1 2\n2 3\n", "1\n7\n", "2\n-1 -2\n1 2\n", "4\n10 -100 10 10\n1 2\n2 3\n3 4\n", "5\n1 1 1 1 1\n1 2\n2 3\n3 4\n4 5\n"],
  sol: `int n;cin>>n;vector<long long>val(n+1);
for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<long long>down(n+1,0);
const long long NEG=(long long)-4e18;long long best=NEG;
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 long long b1=0,b2=0;
 for(int u:g[v])if(u!=par[v]){long long d=max(0LL,down[u]);
  if(d>b1){b2=b1;b1=d;}else if(d>b2)b2=d;}
 down[v]=val[v]+b1;
 best=max(best,val[v]+b1+b2);}
cout<<best<<"\\n";`,
  wrongNote: "Taking only the best single branch measures a path that ends at the node instead of passing through it; clamping the node's own value at zero loses the all-negative case, where the answer is a single node.",
  wrong: [
    `int n;cin>>n;vector<long long>val(n+1);
for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<long long>down(n+1,0);
const long long NEG=(long long)-4e18;long long best=NEG;
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 long long b1=0;
 for(int u:g[v])if(u!=par[v])b1=max(b1,max(0LL,down[u]));
 down[v]=val[v]+b1;
 best=max(best,down[v]);}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>val(n+1);
for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;vector<char>seen(n+1,0);
vector<int>st{1};seen[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<long long>down(n+1,0);long long best=0;
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 long long b1=0,b2=0;
 for(int u:g[v])if(u!=par[v]){long long d=max(0LL,down[u]);
  if(d>b1){b2=b1;b1=d;}else if(d>b2)b2=d;}
 down[v]=max(0LL,val[v]+b1);
 best=max(best,val[v]+b1+b2);}
cout<<best<<"\\n";`,
  ],
});

export default P;
