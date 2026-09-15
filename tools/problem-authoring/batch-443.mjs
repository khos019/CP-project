/* Batch 443 — ten problems, A443–C452, the last of the hundred.
 *
 * Coin change of a different kind at the bottom, a centroid-free tree count
 * and an offline range query at the top; C451 and C452 are insane.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A443", judge: "array-sum-of-even-values", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Juft qiymatlar yig‘indisi",
  en: "The sum of the even values",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uning faqat juft qiymatli elementlarining yig‘indisini toping. Manfiy sonlar ham juft bo‘lishi mumkin, masalan −4 juft sondir, shuning uchun ularni ham hisobga oling. Nol ham juft son hisoblanadi. Massivda juft element umuman bo‘lmasa, yig‘indi 0 chiqadi.",
  statementEn: "You are given an array of n integers. Find the sum of only those elements whose value is even. Negative numbers can be even too — −4 is an even number, for instance — so they count as well, and zero is even. If the array holds no even element at all the sum comes out as 0.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — juft qiymatli elementlarning yig‘indisi.",
  outputEn: "Print a single integer — the sum of the elements with an even value.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "negative even numbers count too, and so does zero", "the sum reaches 10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "manfiy juft sonlar ham, nol ham hisobga olinadi", "yig‘indi 10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n1 2 3 4 5\n", "3\n-4 -3 -2\n"],
  expect: ["6\n", "-6\n"],
  sampleNotesUz: [
    "Juft elementlar 2 va 4, ularning yig‘indisi 6. Toq 1, 3 va 5 hisobga olinmaydi.",
    "−4 va −2 juft sonlar, ularning yig‘indisi −6. Toq −3 tashlab yuboriladi.",
  ],
  sampleNotesEn: [
    "The even elements are 2 and 4, adding up to 6. The odd 1, 3 and 5 are left out.",
    "Both −4 and −2 are even and add up to −6, while the odd −3 is dropped.",
  ],
  testInputs: ["5\n1 2 3 4 5\n", "3\n-4 -3 -2\n", "1\n0\n", "1\n7\n", "4\n1 3 5 7\n", "3\n1000000000 -1000000000 1\n"],
  sol: `int n;cin>>n;long long s=0;
for(int i=0;i<n;++i){long long x;cin>>x;if(x%2==0)s+=x;}
cout<<s<<"\\n";`,
  wrongNote: "Testing the remainder against one misses every negative even number, whose remainder in C++ is negative rather than one; adding the positions instead of the values answers a different question.",
  wrong: [
    `int n;cin>>n;long long s=0;
for(int i=0;i<n;++i){long long x;cin>>x;if(x%2!=1)s+=x;}
cout<<s<<"\\n";`,
    `int n;cin>>n;long long s=0;
for(int i=0;i<n;++i){long long x;cin>>x;if(i%2==0)s+=x;}
cout<<s<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A444", judge: "str-longest-word-in-line", topic: "strings", rating: 1000,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Eng uzun so‘zning uzunligi",
  en: "The length of the longest word",
  statementUz: "Sizga probel bilan ajratilgan so‘zlardan iborat bitta qator berilgan. Undagi eng uzun so‘zning uzunligini toping. So‘zlar faqat kichik lotin harflaridan tuzilgan va qatorning boshida yoki oxirida ortiqcha probel bo‘lmaydi. Bir nechta so‘z eng uzun bo‘lsa ham, javob baribir o‘sha uzunlik bo‘ladi.",
  statementEn: "You are given a single line of words separated by spaces. Find the length of the longest word in it. The words are made of lowercase Latin letters only and the line has no extra space at its start or end. If several words tie for the longest the answer is still that length.",
  inputUz: "Yagona qatorda probel bilan ajratilgan so‘zlar beriladi.",
  inputEn: "The only line contains words separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun so‘zning uzunligi.",
  outputEn: "Print a single integer — the length of the longest word.",
  constraintList: ["the line holds between 1 and 10^4 words", "each word is between 1 and 100 letters long", "the words consist of the letters 'a'–'z'", "the words are separated by single spaces"],
  constraintListUz: ["qatorda 1 dan 10^4 gacha so‘z bo‘ladi", "har bir so‘zning uzunligi 1 dan 100 gacha", "so‘zlar 'a'–'z' harflaridan iborat", "so‘zlar bitta probel bilan ajratiladi"],
  sampleInputs: ["men algoritm yozaman\n", "bir\n"],
  expect: ["8\n", "3\n"],
  sampleNotesUz: [
    "So‘zlarning uzunliklari 3, 8 va 7. Eng uzuni algoritm, uzunligi 8.",
    "Qatorda yagona so‘z bor va uning uzunligi 3.",
  ],
  sampleNotesEn: [
    "The words have lengths 3, 8 and 7. The longest is algoritm at 8 letters.",
    "The line holds a single word of length 3.",
  ],
  testInputs: ["men algoritm yozaman\n", "bir\n", "a bb ccc\n", "ccc bb a\n", "aa aa aa\n", "x yy zzz yy x\n"],
  sol: `string w;size_t best=0;
while(cin>>w)if(w.size()>best)best=w.size();
cout<<best<<"\\n";`,
  wrongNote: "Measuring the whole line counts the spaces along with the letters; keeping the last word that was at least as long as the best so far still reports a length, but reading only the first word never looks past it.",
  wrong: [
    `string line;getline(cin,line);
cout<<line.size()<<"\\n";`,
    `string w;cin>>w;
cout<<w.size()<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B445", judge: "greedy-min-coins-cancel-debts", topic: "greedy", rating: 1200,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Qarzlarni tenglashtirish",
  en: "Settling the debts",
  statementUz: "n ta do‘st bor; i-do‘stning hisobida a_i so‘m turibdi va bu son manfiy ham bo‘lishi mumkin. Ular pul o‘tkazish orqali hamma hisobni nolga keltirmoqchi; barcha hisoblarning yig‘indisi noldir. Bitta o‘tkazmada ixtiyoriy do‘stdan ixtiyoriy boshqasiga xohlagancha pul yuborish mumkin. Musbat hisoblardagi umumiy pul miqdorini chiqaring — bu ko‘chirilishi kerak bo‘lgan eng kam umumiy summa.",
  statementEn: "There are n friends; friend i has a_i som on their account, and that number may be negative. They want to bring every account to zero by sending money to one another, and the accounts already add up to zero. One transfer sends any amount from any friend to any other. Print the total amount sitting on the positive accounts — the smallest total sum that has to be moved.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi; ularning yig‘indisi nolga teng.",
  inputEn: "The first line contains one integer n. The second line contains n integers that add up to zero.",
  outputUz: "Yagona butun sonni chiqaring — ko‘chirilishi kerak bo‘lgan eng kam umumiy summa.",
  outputEn: "Print a single integer — the smallest total amount that has to be moved.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the accounts add up to exactly zero", "the answer reaches 5·10^13 and needs a 64-bit type", "all-zero accounts answer 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "hisoblarning yig‘indisi aynan nolga teng", "javob 5·10^13 ga yetadi va 64-bitli turni talab qiladi", "barcha hisoblar nol bo‘lsa javob 0"],
  sampleInputs: ["3\n5 -3 -2\n", "2\n0 0\n"],
  expect: ["5\n", "0\n"],
  sampleNotesUz: [
    "Yagona musbat hisobda 5 so‘m bor va o‘sha 5 so‘m boshqalarga tarqatilishi kerak: 3 so‘m ikkinchi do‘stga, 2 so‘m uchinchisiga. Ko‘chirilgan umumiy summa 5.",
    "Hamma hisob allaqachon nol, shuning uchun hech narsa ko‘chirilmaydi.",
  ],
  sampleNotesEn: [
    "The only positive account holds 5 som, and that 5 has to be spread out: 3 to the second friend and 2 to the third. The total moved is 5.",
    "Every account is already zero, so nothing is moved.",
  ],
  testInputs: ["3\n5 -3 -2\n", "2\n0 0\n", "2\n7 -7\n", "4\n1 1 -1 -1\n", "1\n0\n", "4\n1000000000 -1000000000 0 0\n"],
  sol: `int n;cin>>n;long long s=0;
for(int i=0;i<n;++i){long long x;cin>>x;if(x>0)s+=x;}
cout<<s<<"\\n";`,
  wrongNote: "Adding the magnitudes of every account counts each som twice, once where it leaves and once where it lands; the largest single account says nothing about the accounts beside it.",
  wrong: [
    `int n;cin>>n;long long s=0;
for(int i=0;i<n;++i){long long x;cin>>x;s+=llabs(x);}
cout<<s<<"\\n";`,
    `int n;cin>>n;long long best=0;
for(int i=0;i<n;++i){long long x;cin>>x;if(x>best)best=x;}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B446", judge: "matrix-rotate-90-clockwise", topic: "foundations", rating: 1400,
  tag: "Matrices", timeLimitMs: 1000,
  uz: "Matritsani 90 gradusga burish",
  en: "Turning the matrix by ninety degrees",
  statementUz: "Sizga n satr va m ustundan iborat matritsa berilgan. Uni soat yo‘nalishi bo‘yicha 90 gradusga burib chiqaring. Burilgandan keyin natijada m satr va n ustun bo‘ladi: asl matritsaning birinchi ustuni pastdan yuqoriga o‘qilib, natijaning birinchi satriga aylanadi. Boshqacha aytganda, natijaning i-satridagi j-element asl matritsaning n − j + 1 satridagi i-elementiga teng.",
  statementEn: "You are given a matrix of n rows and m columns. Turn it ninety degrees clockwise. The result has m rows and n columns: the first column of the original, read from the bottom upwards, becomes the first row of the result. Put differently, the j-th entry of row i in the result is the i-th entry of row n − j + 1 in the original.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi n qatorning har birida probel bilan ajratilgan m ta son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next n lines contains m numbers separated by single spaces.",
  outputUz: "m ta qator chiqaring; har birida probel bilan ajratilgan n ta son bo‘lsin — burilgan matritsa.",
  outputEn: "Print m lines, each holding n numbers separated by single spaces — the turned matrix.",
  constraintList: ["1 ≤ n, m ≤ 500", "−10^9 ≤ each entry ≤ 10^9", "the result has m rows and n columns", "the turn is clockwise, not anticlockwise"],
  constraintListUz: ["1 ≤ n, m ≤ 500", "−10^9 ≤ har bir element ≤ 10^9", "natijada m satr va n ustun bo‘ladi", "burilish soat yo‘nalishi bo‘yicha, teskarisiga emas"],
  sampleInputs: ["2 3\n1 2 3\n4 5 6\n", "1 2\n7 8\n"],
  expect: ["4 1\n5 2\n6 3\n", "7\n8\n"],
  sampleNotesUz: [
    "Asl matritsaning birinchi ustuni 1 va 4 edi; pastdan yuqoriga o‘qisak 4 1 chiqadi va bu natijaning birinchi satri bo‘ladi. Qolgan ustunlar ham shunday aylanadi.",
    "Bitta satrli matritsa burilgach bitta ustunga aylanadi: 7 yuqorida, 8 pastda.",
  ],
  sampleNotesEn: [
    "The first column of the original held 1 and 4; read from the bottom upwards that is 4 1, which becomes the first row of the result. The other columns turn the same way.",
    "A matrix of one row becomes a matrix of one column: the 7 on top and the 8 below it.",
  ],
  testInputs: ["2 3\n1 2 3\n4 5 6\n", "1 2\n7 8\n", "1 1\n5\n", "3 1\n1\n2\n3\n", "2 2\n1 2\n3 4\n", "3 3\n1 2 3\n4 5 6\n7 8 9\n"],
  sol: `int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
for(int j=0;j<m;++j){
 for(int i=n-1;i>=0;--i)cout<<a[i][j]<<((i>0)?' ':'\\n');}`,
  wrongNote: "Reading each column from the top down turns the matrix the other way, anticlockwise; transposing alone swaps the axes but never reverses anything.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
for(int j=m-1;j>=0;--j){
 for(int i=0;i<n;++i)cout<<a[i][j]<<((i+1<n)?' ':'\\n');}`,
    `int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
for(int j=0;j<m;++j){
 for(int i=0;i<n;++i)cout<<a[i][j]<<((i+1<n)?' ':'\\n');}`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B447", judge: "sort-count-increasing-triples", topic: "sorting", rating: 1600,
  tag: "Counting", timeLimitMs: 2000,
  uz: "O‘suvchi uchliklar soni",
  en: "The number of increasing triples",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Shunday (i, j, k) uchliklar sonini toping-ki, i < j < k bo‘lsin va a_i < a_j < a_k tengsizliklari bajarilsin. Solishtirishlar qat'iy, ya'ni teng qiymatlar uchlikni buzadi. Barcha uchliklarni tekshirish sekin bo‘lgani uchun, har bir o‘rtadagi j element uchun undan oldingi kichiklar va undan keyingi kattalar sonini ko‘paytirib qo‘shib borish kerak.",
  statementEn: "You are given an array of n integers. Count the triples (i, j, k) with i < j < k for which a_i < a_j < a_k holds. The comparisons are strict, so equal values break the triple. Checking every triple is too slow; instead, for each middle element j, multiply how many smaller values stand before it by how many larger values stand after it, and add those products up.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — o‘suvchi uchliklar soni.",
  outputEn: "Print a single integer — the number of increasing triples.",
  constraintList: ["3 ≤ n ≤ 3000", "−10^9 ≤ a_i ≤ 10^9", "the comparisons are strict, so equal values break the triple", "the answer reaches 4·10^9 and needs a 64-bit type"],
  constraintListUz: ["3 ≤ n ≤ 3000", "−10^9 ≤ a_i ≤ 10^9", "solishtirishlar qat'iy, ya'ni teng qiymatlar uchlikni buzadi", "javob 4·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n1 2 3 4 5\n", "3\n3 2 1\n"],
  expect: ["10\n", "0\n"],
  sampleNotesUz: [
    "Massiv qat'iy o‘suvchi, shuning uchun ixtiyoriy uchta pozitsiya mos keladi. Beshtadan uchtasini tanlash 10 usulda bo‘ladi.",
    "Massiv kamayib boradi, ya'ni a_i < a_j shartini qanoatlantiruvchi juftlik ham yo‘q. Javob 0.",
  ],
  sampleNotesEn: [
    "The array is strictly increasing, so any three positions work. Choosing three out of five can be done in 10 ways.",
    "The array only falls, so not even a pair satisfies a_i < a_j. The answer is 0.",
  ],
  testInputs: ["5\n1 2 3 4 5\n", "3\n3 2 1\n", "3\n1 2 3\n", "4\n1 1 2 3\n", "5\n2 1 3 1 4\n", "6\n1 2 1 2 1 2\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long total=0;
for(int j=0;j<n;++j){
 long long lo=0,hi=0;
 for(int i=0;i<j;++i)if(a[i]<a[j])++lo;
 for(int k=j+1;k<n;++k)if(a[k]>a[j])++hi;
 total+=lo*hi;}
cout<<total<<"\\n";`,
  wrongNote: "Allowing equal values on either side of the middle element admits triples the strict comparison rules out; counting only the triples made of three positions in a row ignores every triple that leaves a gap.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long total=0;
for(int j=0;j<n;++j){
 long long lo=0,hi=0;
 for(int i=0;i<j;++i)if(a[i]<=a[j])++lo;
 for(int k=j+1;k<n;++k)if(a[k]>=a[j])++hi;
 total+=lo*hi;}
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long total=0;
for(int i=0;i+2<n;++i)if(a[i]<a[i+1]&&a[i+1]<a[i+2])++total;
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B448", judge: "dp-max-sum-k-non-adjacent-pairs", topic: "dp", rating: 1700,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "Qo‘shni bo‘lmagan uchta element",
  en: "Three elements that are not neighbours",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Undan aynan uchta elementni shunday tanlang-ki, tanlanganlardan hech ikkitasi yonma-yon turmasin va ularning yig‘indisi eng katta bo‘lsin. Massivda manfiy sonlar ham bo‘lishi mumkin, shuning uchun eng katta uchtani tanlash har doim ham to‘g‘ri bo‘lmaydi. Uchtasini tanlab bo‘lmasa ham degan holat yo‘q: n har doim yetarlicha katta bo‘ladi.",
  statementEn: "You are given an array of n integers. Choose exactly three elements, no two of them neighbours, so that their sum is as large as possible. The array may hold negative numbers, so taking the three largest is not always right. There is always room to choose: n is guaranteed to be large enough.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — qo‘shni bo‘lmagan uchta elementning eng katta yig‘indisi.",
  outputEn: "Print a single integer — the largest sum of three elements that are not neighbours.",
  constraintList: ["5 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "exactly three elements must be chosen", "no two chosen elements may sit next to each other", "the answer may be negative"],
  constraintListUz: ["5 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "aynan uchta element tanlanishi shart", "tanlanganlardan hech ikkitasi yonma-yon turmasligi kerak", "javob manfiy bo‘lishi mumkin"],
  sampleInputs: ["5\n1 2 3 4 5\n", "5\n-1 -2 -3 -4 -5\n"],
  expect: ["9\n", "-9\n"],
  sampleNotesUz: [
    "1, 3 va 5 pozitsiyalaridagi elementlarni tanlaymiz: 1 + 3 + 5 = 9. Eng katta uchta son 3, 4 va 5 edi, lekin 4 bilan 5 yonma-yon turadi.",
    "Yagona mumkin bo‘lgan tanlov 1, 3 va 5 pozitsiyalari: −1 + (−3) + (−5) = −9. Boshqa har qanday uchlik qo‘shnilardan iborat bo‘lib qoladi.",
  ],
  sampleNotesEn: [
    "Taking positions 1, 3 and 5 gives 1 + 3 + 5 = 9. The three largest values were 3, 4 and 5, but the 4 and the 5 stand next to each other.",
    "The only possible choice is positions 1, 3 and 5, giving −1 + (−3) + (−5) = −9. Any other triple would include neighbours.",
  ],
  testInputs: ["5\n1 2 3 4 5\n", "5\n-1 -2 -3 -4 -5\n", "5\n5 1 1 1 5\n", "6\n5 1 5 1 1 5\n", "7\n10 1 10 1 10 1 10\n", "5\n-1000000000 1 -1000000000 1 -1000000000\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long NEG=(long long)-4e18;
vector<array<long long,4>>dp(n+1);
for(int i=0;i<=n;++i)for(int t=0;t<4;++t)dp[i][t]=NEG;
dp[0][0]=0;dp[1][0]=0;dp[1][1]=a[0];
for(int i=2;i<=n;++i){
 dp[i][0]=0;
 for(int t=1;t<4;++t){
  long long best2=dp[i-1][t];
  if(dp[i-2][t-1]!=NEG){
   long long v=dp[i-2][t-1]+a[i-1];
   if(v>best2)best2=v;}
  dp[i][t]=best2;}}
cout<<dp[n][3]<<"\\n";`,
  wrongNote: "Taking the three largest values ignores that two of them may stand side by side; picking one element and then the best pair outside it greedily fixes the first choice before the other two are known.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>b=a;sort(b.rbegin(),b.rend());
cout<<(b[0]+b[1]+b[2])<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=(long long)-4e18;
for(int i=0;i+4<n;++i)best=max(best,a[i]+a[i+2]+a[i+4]);
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "B449", judge: "bit-count-pairs-xor-zero-prefix", topic: "data-structures", rating: 1900,
  tag: "Hashing on prefixes", timeLimitMs: 1000,
  uz: "Xor yig‘indisi nolga teng qismlar",
  en: "The stretches whose xor is zero",
  statementUz: "Sizga n ta manfiy bo‘lmagan sondan iborat massiv berilgan. Ketma-ket turgan shunday bo‘sh bo‘lmagan qismlar sonini toping-ki, ulardagi barcha elementlarning bitlar bo‘yicha xor yig‘indisi nolga teng bo‘lsin. Prefiks xor qiymatlarini hisoblab, bir xil qiymat necha marta takrorlanganini sanash kifoya: bir xil prefiks xor ikki joyda uchrasa, ular orasidagi qismning xori nolga teng bo‘ladi.",
  statementEn: "You are given an array of n non-negative integers. Count the non-empty stretches of consecutive elements whose bitwise xor is zero. Computing the prefix xors and counting how often each value repeats settles it: whenever the same prefix xor appears at two places, the stretch between them xors to zero.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta manfiy bo‘lmagan son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n non-negative integers.",
  outputUz: "Yagona butun sonni chiqaring — xor yig‘indisi nolga teng bo‘lgan qismlar soni.",
  outputEn: "Print a single integer — the number of stretches whose xor is zero.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ a_i < 2^30", "the stretch must be non-empty and consecutive", "the answer reaches 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ a_i < 2^30", "qism bo‘sh bo‘lmagan va ketma-ket bo‘lishi shart", "javob 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n1 2 3 4\n", "3\n0 0 0\n"],
  expect: ["1\n", "6\n"],
  sampleNotesUz: [
    "Yagona mos qism — dastlabki uchta element: 1 xor 2 xor 3 = 0. Qolgan qismlarning hech birida xor nolga tushmaydi.",
    "Har qanday nollardan iborat qismning xori nol bo‘ladi. Uzunligi 1 bo‘lgan uchta, 2 bo‘lgan ikkita va 3 bo‘lgan bitta qism bor — jami 6.",
  ],
  sampleNotesEn: [
    "The only matching stretch is the first three elements: 1 xor 2 xor 3 = 0. No other stretch xors down to zero.",
    "Any stretch of zeros xors to zero. There are three of length 1, two of length 2 and one of length 3 — six in all.",
  ],
  testInputs: ["4\n1 2 3 4\n", "3\n0 0 0\n", "1\n0\n", "1\n5\n", "5\n1 1 1 1 1\n", "6\n4 4 4 4 4 4\n"],
  sol: `int n;cin>>n;map<long long,long long>cnt;
cnt[0]=1;long long pre=0,ans=0;
for(int i=0;i<n;++i){long long x;cin>>x;pre^=x;
 ans+=cnt[pre];++cnt[pre];}
cout<<ans<<"\\n";`,
  wrongNote: "Leaving out the empty prefix loses every stretch that starts at the first element; counting only the elements that are zero themselves ignores the longer stretches that cancel out.",
  wrong: [
    `int n;cin>>n;map<long long,long long>cnt;
long long pre=0,ans=0;
for(int i=0;i<n;++i){long long x;cin>>x;pre^=x;
 ans+=cnt[pre];++cnt[pre];}
cout<<ans<<"\\n";`,
    `int n;cin>>n;long long ans=0;
for(int i=0;i<n;++i){long long x;cin>>x;if(x==0)++ans;}
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C450", judge: "dp-max-subarray-one-deletion", topic: "dp", rating: 2000,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "Bitta elementni tashlab yuborish mumkin bo‘lgan eng katta yig‘indi",
  en: "The largest stretch sum with one element dropped",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Ketma-ket turgan bo‘sh bo‘lmagan qism tanlanadi va undan ixtiyoriy bitta elementni tashlab yuborishga ruxsat beriladi; tashlash majburiy emas. Shu yo‘l bilan erishish mumkin bo‘lgan eng katta yig‘indini toping. Tashlagandan keyin qismda kamida bitta element qolishi shart, shuning uchun hamma sonlar manfiy bo‘lsa javob ham manfiy chiqadi.",
  statementEn: "You are given an array of n integers. A non-empty stretch of consecutive elements is chosen and you may drop any one element from it, though dropping is optional. Find the largest sum reachable this way. At least one element must remain after the drop, so when every number is negative the answer is negative too.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — ko‘pi bilan bitta element tashlangandagi eng katta qism yig‘indisi.",
  outputEn: "Print a single integer — the largest stretch sum with at most one element dropped.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "at most one element may be dropped, and dropping is optional", "at least one element must remain", "the answer reaches 10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "ko‘pi bilan bitta element tashlanadi va bu majburiy emas", "kamida bitta element qolishi shart", "javob 10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n1 -2 3 4 -1\n", "3\n-1 -2 -3\n"],
  expect: ["8\n", "-1\n"],
  sampleNotesUz: [
    "1 dan 4 gacha bo‘lgan qismni olib, o‘rtadagi −2 ni tashlaymiz: 1 + 3 + 4 = 8. Hech narsa tashlamasak eng yaxshisi 3 + 4 = 7 bo‘lardi.",
    "Barcha sonlar manfiy, shuning uchun eng yaxshi tanlov yagona −1 elementidan iborat qism. Tashlash foyda bermaydi, chunki kamida bitta element qolishi kerak.",
  ],
  sampleNotesEn: [
    "Taking the stretch from the 1 to the 4 and dropping the −2 in the middle gives 1 + 3 + 4 = 8. With no drop the best would be 3 + 4 = 7.",
    "Every number is negative, so the best choice is the stretch holding just the −1. Dropping gains nothing, since one element has to remain.",
  ],
  testInputs: ["5\n1 -2 3 4 -1\n", "3\n-1 -2 -3\n", "1\n5\n", "4\n1 -1 1 -1\n", "5\n-1 -1 -1 -1 -1\n", "6\n1 2 -100 3 4 5\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long NEG=(long long)-4e18;
long long keep=a[0],drop=NEG,best=a[0];
for(int i=1;i<n;++i){
 long long nd=max(keep,(drop==NEG)?NEG:drop+a[i]);
 long long nk=max(a[i],keep+a[i]);
 keep=nk;drop=nd;
 best=max(best,keep);
 if(drop!=NEG)best=max(best,drop);}
cout<<best<<"\\n";`,
  wrongNote: "Never dropping anything is the plain largest-stretch problem and misses the gain a single bad element's removal brings; adding the current element on top of a state that already means it was dropped counts it after deleting it.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long cur=a[0],best=a[0];
for(int i=1;i<n;++i){cur=max(a[i],cur+a[i]);best=max(best,cur);}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long NEG=(long long)-4e18;
long long keep=a[0],drop=NEG,best=a[0];
for(int i=1;i<n;++i){
 long long nd=max(keep,(drop==NEG)?NEG:drop)+a[i];
 long long nk=max(a[i],keep+a[i]);
 keep=nk;drop=nd;
 best=max(best,keep);
 best=max(best,drop);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C451", judge: "tree-count-vertices-at-even-depth", topic: "trees", rating: 2100,
  tag: "Tree traversal", timeLimitMs: 2000,
  uz: "Ikki bo‘yashning kattasi",
  en: "The larger side of the two-colouring",
  statementUz: "Sizga n ta uchi bo‘lgan daraxt berilgan. Daraxtni ikki rangga bo‘yash mumkin: qirra bilan bog‘langan ikki uch har doim har xil rangda bo‘lsin. Bunday bo‘yash daraxtda har doim mavjud va rang tanlashning ikki usulidan tashqari yagona. Ikkita rangdan qaysinisi ko‘proq uchni egallashini toping va o‘sha uchlar sonini chiqaring; ikkalasi teng bo‘lsa, o‘sha umumiy sonni chiqaring.",
  statementEn: "You are given a tree with n vertices. A tree can always be coloured with two colours so that the two ends of every edge differ, and that colouring is unique up to swapping the two colours. Find which of the two colours covers more vertices and print how many that is; if the two sides are equal, print that shared count.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n − 1 qatorning har birida daraxtning a va b uchlarini bog‘lovchi qirrasi keladi.",
  inputEn: "The first line contains one integer n. Each of the next n − 1 lines contains an edge a b of the tree.",
  outputUz: "Yagona butun sonni chiqaring — kattaroq rang egallagan uchlar soni.",
  outputEn: "Print a single integer — the number of vertices on the larger side.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a, b ≤ n and a ≠ b", "the n − 1 edges form a tree", "the answer is at least ⌈n / 2⌉", "a tree of one vertex answers 1"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a, b ≤ n va a ≠ b", "n − 1 ta qirra daraxt hosil qiladi", "javob kamida ⌈n / 2⌉ ga teng", "bitta uchli daraxt uchun javob 1"],
  sampleInputs: ["4\n1 2\n1 3\n1 4\n", "2\n1 2\n"],
  expect: ["3\n", "1\n"],
  sampleNotesUz: [
    "Markazdagi 1-uch bir rangda, qolgan uchtasi esa boshqa rangda bo‘ladi. Kattaroq tomonda uchta uch bor.",
    "Ikkala uch har xil rangda, ya'ni ikkala tomonda ham bittadan uch. Javob 1.",
  ],
  sampleNotesEn: [
    "The central vertex 1 takes one colour and the other three take the other, so the larger side holds three vertices.",
    "The two vertices take different colours, leaving one on each side, so the answer is 1.",
  ],
  testInputs: [
    "4\n1 2\n1 3\n1 4\n",
    "2\n1 2\n",
    "1\n",
    "5\n1 2\n2 3\n3 4\n4 5\n",
    "7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n",
    "6\n1 2\n2 3\n3 4\n4 5\n5 6\n",
  ],
  sol: `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>col(n,-1);col[0]=0;
vector<int>st{0};long long c0=1,c1=0;
while(!st.empty()){int v=st.back();st.pop_back();
 for(int u:g[v]){
  if(col[u]>=0)continue;
  col[u]=1-col[v];
  if(col[u])++c1;else ++c0;
  st.push_back(u);}}
cout<<max(c0,c1)<<"\\n";`,
  wrongNote: "Splitting the vertices by their index parity has nothing to do with the tree's own shape; rounding the vertex count up assumes the two colours always come out as even as possible, which a star never does.",
  wrong: [
    `int n;cin>>n;
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;}
long long c0=(n+1)/2,c1=n/2;
cout<<max(c0,c1)<<"\\n";`,
    `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
long long leaves=0;
for(int v=0;v<n;++v)if(g[v].size()<=1)++leaves;
cout<<max(leaves,(long long)n-leaves)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C452", judge: "adv-offline-range-distinct-count", topic: "advanced-cp", rating: 2200,
  tag: "Offline queries with a Fenwick tree", timeLimitMs: 2000,
  uz: "Oraliqdagi har xil qiymatlar",
  en: "The distinct values inside a range",
  statementUz: "Sizga n ta butun sondan iborat massiv va q ta so‘rov berilgan. Har bir so‘rov l dan r gacha bo‘lgan oraliqda nechta har xil qiymat borligini so‘raydi. Har bir so‘rovni alohida aylanib chiqish juda sekin; so‘rovlarni o‘ng chegarasi bo‘yicha tartiblab, har bir qiymatning eng oxirgi uchragan pozitsiyasini Fenvik daraxtida saqlab yurish kerak. Javoblarni so‘rovlar kelgan tartibda chiqaring.",
  statementEn: "You are given an array of n integers and q queries. Each query asks how many distinct values the range from l to r holds. Answering each query by walking it is far too slow; instead sort the queries by their right end and keep the latest position of each value in a Fenwick tree as the right end advances. Print the answers in the order the queries arrived.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Ikkinchi qatorda n ta son keladi, keyingi q qatorning har birida esa l va r beriladi.",
  inputEn: "The first line contains two integers n and q. The second line contains n numbers, and each of the next q lines contains l and r.",
  outputUz: "Har bir so‘rov uchun alohida qatorda oraliqdagi har xil qiymatlar sonini chiqaring.",
  outputEn: "For each query print the number of distinct values in the range on its own line.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "−10^9 ≤ a_i ≤ 10^9", "the answers must follow the order the queries arrived in"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "−10^9 ≤ a_i ≤ 10^9", "javoblar so‘rovlar kelgan tartibda bo‘lishi shart"],
  sampleInputs: ["5 3\n1 2 1 3 2\n1 5\n1 3\n2 4\n", "1 1\n7\n1 1\n"],
  expect: ["3\n2\n3\n", "1\n"],
  sampleNotesUz: [
    "Butun massivda 1, 2 va 3 uchraydi — uchta har xil qiymat. 1 dan 3 gacha bo‘lgan oraliqda 1 va 2 bor, ya'ni ikkita. 2 dan 4 gacha esa 2, 1 va 3 — uchta.",
    "Yagona element bor, ya'ni oraliqda bitta har xil qiymat turadi.",
  ],
  sampleNotesEn: [
    "The whole array holds 1, 2 and 3 — three distinct values. The range from 1 to 3 holds 1 and 2, which is two. The range from 2 to 4 holds 2, 1 and 3, which is three.",
    "There is a single element, so the range holds one distinct value.",
  ],
  testInputs: [
    "5 3\n1 2 1 3 2\n1 5\n1 3\n2 4\n",
    "1 1\n7\n1 1\n",
    "4 4\n5 5 5 5\n1 4\n1 1\n2 3\n4 4\n",
    "6 3\n1 2 3 4 5 6\n1 6\n3 3\n2 5\n",
    "5 2\n-1 -1 0 0 -1\n1 5\n3 5\n",
    "8 4\n1 2 1 2 1 2 1 2\n1 8\n2 2\n3 6\n5 8\n",
  ],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n+1);
for(int i=1;i<=n;++i)cin>>a[i];
vector<vector<pair<int,int>>>byR(n+1);
for(int i=0;i<q;++i){int l,r;cin>>l>>r;byR[r].push_back(make_pair(l,i));}
vector<long long>bit(n+2,0);
auto add=[&](int i,long long v){for(;i<=n;i+=i&(-i))bit[i]+=v;};
auto sum=[&](int i){long long s=0;for(;i>0;i-=i&(-i))s+=bit[i];return s;};
map<long long,int>last;
vector<long long>ans(q,0);
for(int r=1;r<=n;++r){
 map<long long,int>::iterator it=last.find(a[r]);
 if(it!=last.end())add(it->second,-1);
 add(r,1);last[a[r]]=r;
 for(size_t t=0;t<byR[r].size();++t){
  int l=byR[r][t].first,id=byR[r][t].second;
  ans[id]=sum(r)-sum(l-1);}}
string out;
for(int i=0;i<q;++i){out+=to_string(ans[i]);out+="\\n";}
cout<<out;`,
  wrongNote: "Marking a repeated value at its new position without clearing the old one counts it once for every time it appears; answering the queries in the order they were sorted rather than the order they arrived prints the right numbers against the wrong questions.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n+1);
for(int i=1;i<=n;++i)cin>>a[i];
vector<vector<pair<int,int>>>byR(n+1);
for(int i=0;i<q;++i){int l,r;cin>>l>>r;byR[r].push_back(make_pair(l,i));}
vector<long long>bit(n+2,0);
auto add=[&](int i,long long v){for(;i<=n;i+=i&(-i))bit[i]+=v;};
auto sum=[&](int i){long long s=0;for(;i>0;i-=i&(-i))s+=bit[i];return s;};
map<long long,int>last;
vector<long long>ans(q,0);
for(int r=1;r<=n;++r){
 add(r,1);last[a[r]]=r;
 for(size_t t=0;t<byR[r].size();++t){
  int l=byR[r][t].first,id=byR[r][t].second;
  ans[id]=sum(r)-sum(l-1);}}
string out;
for(int i=0;i<q;++i){out+=to_string(ans[i]);out+="\\n";}
cout<<out;`,
    `int n,q;cin>>n>>q;vector<long long>a(n+1);
for(int i=1;i<=n;++i)cin>>a[i];
vector<vector<pair<int,int>>>byR(n+1);
for(int i=0;i<q;++i){int l,r;cin>>l>>r;byR[r].push_back(make_pair(l,i));}
vector<long long>bit(n+2,0);
auto add=[&](int i,long long v){for(;i<=n;i+=i&(-i))bit[i]+=v;};
auto sum=[&](int i){long long s=0;for(;i>0;i-=i&(-i))s+=bit[i];return s;};
map<long long,int>last;
string out;
for(int r=1;r<=n;++r){
 map<long long,int>::iterator it=last.find(a[r]);
 if(it!=last.end())add(it->second,-1);
 add(r,1);last[a[r]]=r;
 for(size_t t=0;t<byR[r].size();++t){
  int l=byR[r][t].first;
  out+=to_string(sum(r)-sum(l-1));out+="\\n";}}
cout<<out;`,
  ],
});

export default P;
