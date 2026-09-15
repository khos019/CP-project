/* Batch 463 — ten problems, A463–C472.
 *
 * Prefixes and progressions at the bottom, a bounded-hop shortest path and a
 * distinct-subsequence count at the top; C471 and C472 are insane.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A463", judge: "array-longest-increasing-prefix", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "O‘suvchi boshlanmaning uzunligi",
  en: "The length of the increasing opening",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uning boshidan boshlanuvchi va qat'iy o‘suvchi bo‘lgan eng uzun qismning uzunligini toping. Qism albatta birinchi elementdan boshlanishi shart, shuning uchun javob hech qachon 0 bo‘lmaydi. Birinchi tushish yoki tenglik uchraganda qism shu yerda tugaydi.",
  statementEn: "You are given an array of n integers. Find the length of the longest stretch that starts at the beginning of the array and is strictly increasing. The stretch must begin at the first element, so the answer is never 0. It ends at the first place where the values fall or repeat.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — qat'iy o‘suvchi boshlanmaning uzunligi.",
  outputEn: "Print a single integer — the length of the strictly increasing opening.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the stretch must start at the first element", "the rise must be strict, so equal neighbours end it"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "qism birinchi elementdan boshlanishi shart", "o‘sish qat'iy, ya'ni teng qo‘shnilar qismni tugatadi"],
  sampleInputs: ["5\n1 2 3 2 5\n", "4\n5 4 3 2\n"],
  expect: ["3\n", "1\n"],
  sampleNotesUz: [
    "1 < 2 < 3 qismi o‘sib boradi, keyingi element 2 esa 3 dan kichik va o‘sishni to‘xtatadi. Javob 3.",
    "Ikkinchi element allaqachon birinchisidan kichik, shuning uchun boshlanma yagona elementdan iborat va javob 1.",
  ],
  sampleNotesEn: [
    "The stretch 1 < 2 < 3 keeps rising, and the next element 2 is below the 3 and stops it, so the answer is 3.",
    "The second element is already below the first, so the opening holds a single element and the answer is 1.",
  ],
  testInputs: ["5\n1 2 3 2 5\n", "4\n5 4 3 2\n", "1\n7\n", "4\n1 1 2 3\n", "5\n3 2 3 4 5\n", "5\n1 2 3 4 5\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int k=1;
while(k<n&&a[k]>a[k-1])++k;
cout<<k<<"\\n";`,
  wrongNote: "Allowing equal neighbours to continue the opening contradicts the strict rise the statement asks for; measuring the longest rising run anywhere ignores that the stretch has to start at the first element.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int k=1;
while(k<n&&a[k]>=a[k-1])++k;
cout<<k<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=1,cur=1;
for(int i=1;i<n;++i){
 if(a[i]>a[i-1])++cur;else cur=1;
 if(cur>best)best=cur;}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A464", judge: "math-arith-progression-sum", topic: "math", rating: 1000,
  tag: "Formulas", timeLimitMs: 1000,
  uz: "Arifmetik progressiya yig‘indisi",
  en: "The sum of an arithmetic progression",
  statementUz: "Arifmetik progressiya birinchi hadi a, qadami d bo‘lgan ketma-ketlikdir: a, a + d, a + 2d va hokazo. Sizga a, d va n berilgan; dastlabki n ta hadning yig‘indisini toping. Qadam manfiy yoki nol bo‘lishi ham mumkin. n katta bo‘lgani uchun hadlarni birma-bir qo‘shish o‘rniga formuladan foydalangan ma'qul.",
  statementEn: "An arithmetic progression is the sequence a, a + d, a + 2d and so on, starting at a with a step of d. Given a, d and n, find the sum of the first n terms. The step may be negative or zero. Since n is large, a formula serves better than adding the terms one at a time.",
  inputUz: "Yagona qatorda uchta a, d va n butun soni beriladi.",
  inputEn: "The only line contains three integers a, d and n.",
  outputUz: "Yagona butun sonni chiqaring — dastlabki n ta hadning yig‘indisi.",
  outputEn: "Print a single integer — the sum of the first n terms.",
  constraintList: ["−10^9 ≤ a ≤ 10^9", "−10^6 ≤ d ≤ 10^6", "1 ≤ n ≤ 10^6", "the step may be negative or zero", "the sum reaches 5·10^17 and needs a 64-bit type"],
  constraintListUz: ["−10^9 ≤ a ≤ 10^9", "−10^6 ≤ d ≤ 10^6", "1 ≤ n ≤ 10^6", "qadam manfiy yoki nol bo‘lishi mumkin", "yig‘indi 5·10^17 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["1 2 5\n", "5 0 3\n"],
  expect: ["25\n", "15\n"],
  sampleNotesUz: [
    "Hadlar 1, 3, 5, 7 va 9, ularning yig‘indisi 25. Oxirgi had a + (n − 1)d = 1 + 8 = 9 ekaniga e'tibor bering.",
    "Qadam nol, ya'ni uchala had ham 5 ga teng. Yig‘indi 15.",
  ],
  sampleNotesEn: [
    "The terms are 1, 3, 5, 7 and 9, adding up to 25. Note that the last term is a + (n − 1)d = 1 + 8 = 9.",
    "The step is zero, so all three terms equal 5 and the sum is 15.",
  ],
  testInputs: ["1 2 5\n", "5 0 3\n", "0 0 1\n", "-1000000000 0 1000000\n", "1 1 1000000\n", "10 -3 4\n"],
  sol: `long long a,d,n;cin>>a>>d>>n;
cout<<(n*a+d*n*(n-1)/2)<<"\\n";`,
  wrongNote: "The last term is a + (n − 1)d rather than a + nd, so stepping one too far inflates the sum; leaving out the halving counts every step twice over.",
  wrong: [
    `long long a,d,n;cin>>a>>d>>n;
long long last=a+d*n;
cout<<(n*(a+last)/2)<<"\\n";`,
    `long long a,d,n;cin>>a>>d>>n;
cout<<(n*a+d*n*(n-1))<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B465", judge: "dp-min-steps-to-one", topic: "dp", rating: 1300,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "Birga tushish uchun eng kam qadam",
  en: "The fewest steps down to one",
  statementUz: "Sizga musbat n soni berilgan. Bitta qadamda uchta amaldan birini bajarish mumkin: sonni bittaga kamaytirish; agar u ikkiga bo‘linsa, ikkiga bo‘lish; agar u uchga bo‘linsa, uchga bo‘lish. n dan 1 ga tushish uchun kerak bo‘ladigan eng kam qadamlar sonini toping. Ochko‘zlik bilan har doim uchga bo‘lish to‘g‘ri javob bermasligini yodda tuting.",
  statementEn: "You are given a positive number n. In one step you may do one of three things: lower the number by one; halve it, if it is divisible by two; or divide it by three, if it is divisible by three. Find the fewest steps that bring n down to 1. Note that greedily dividing by three whenever possible does not always give the right answer.",
  inputUz: "Yagona qatorda bitta musbat n butun soni beriladi.",
  inputEn: "The only line contains one positive integer n.",
  outputUz: "Yagona butun sonni chiqaring — 1 ga tushish uchun zarur qadamlarning eng kam soni.",
  outputEn: "Print a single integer — the fewest steps needed to reach 1.",
  constraintList: ["1 ≤ n ≤ 10^6", "the three moves are the only ones allowed", "division is possible only when it leaves no remainder", "n = 1 needs no step at all"],
  constraintListUz: ["1 ≤ n ≤ 10^6", "faqat shu uchta amalga ruxsat beriladi", "bo‘lish faqat qoldiqsiz bo‘lganda mumkin", "n = 1 uchun birorta qadam kerak emas"],
  sampleInputs: ["10\n", "1\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "10 → 9 → 3 → 1: bitta kamaytirish va ikkita uchga bo‘lish, jami 3 qadam. 10 ni darrov ikkiga bo‘lsak 10 → 5 → 4 → 2 → 1 bo‘lib, 4 qadam ketadi.",
    "Son allaqachon 1 ga teng, shuning uchun hech qanday qadam kerak emas.",
  ],
  sampleNotesEn: [
    "10 → 9 → 3 → 1 takes one decrement and two divisions by three, three steps in all. Halving first gives 10 → 5 → 4 → 2 → 1, which takes four.",
    "The number is already 1, so no step is needed.",
  ],
  testInputs: ["10\n", "1\n", "2\n", "7\n", "1000000\n", "999999\n"],
  sol: `int n;cin>>n;vector<int>dp(n+1,0);
for(int v=2;v<=n;++v){
 int best=dp[v-1]+1;
 if(v%2==0&&dp[v/2]+1<best)best=dp[v/2]+1;
 if(v%3==0&&dp[v/3]+1<best)best=dp[v/3]+1;
 dp[v]=best;}
cout<<dp[n]<<"\\n";`,
  wrongNote: "Dividing by three whenever it fits, and otherwise by two, fixes each choice before the rest of the path is known; counting only the decrements ignores the two divisions entirely.",
  wrong: [
    `long long n;cin>>n;long long c=0;
while(n>1){
 if(n%3==0)n/=3;
 else if(n%2==0)n/=2;
 else --n;
 ++c;}
cout<<c<<"\\n";`,
    `long long n;cin>>n;long long c=0;
while(n>1){--n;++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B466", judge: "str-min-deletions-sorted", topic: "strings", rating: 1400,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "Alifbo tartibiga keltirish",
  en: "Bringing the letters into alphabetical order",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Undan eng kam nechta harfni o‘chirsangiz, qolgan harflar alifbo bo‘yicha kamaymaydigan tartibda turadi — shuni toping. Teng harflar yonma-yon turishi mumkin, chunki tartib kamaymaydigan bo‘lishi talab qilinadi. Satr allaqachon shunday tartibda bo‘lsa, javob 0 bo‘ladi.",
  statementEn: "You are given a string s of lowercase Latin letters. Find the smallest number of letters that must be deleted so that what remains is in non-decreasing alphabetical order. Equal letters may stand side by side, since the order required is non-decreasing. If the string is already in that order the answer is 0.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — o‘chirilishi kerak bo‘lgan harflarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of letters that must be deleted.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the letters 'a'–'z'", "the order required is non-decreasing, so equal letters may repeat", "the remaining letters keep their original order"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s 'a'–'z' harflaridan iborat", "tartib kamaymaydigan, ya'ni teng harflar takrorlanishi mumkin", "qolgan harflar asl tartibini saqlaydi"],
  sampleInputs: ["cba\n", "abc\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Kamaymaydigan tartibda qoldirish mumkin bo‘lgan eng uzun qism bitta harfdan iborat, masalan c. Qolgan ikkitasini o‘chirish kerak.",
    "Satr allaqachon alifbo tartibida, shuning uchun hech narsa o‘chirilmaydi.",
  ],
  sampleNotesEn: [
    "The longest piece that can stay in non-decreasing order holds a single letter, say the c, so the other two have to go.",
    "The string is already in alphabetical order, so nothing is deleted.",
  ],
  testInputs: ["cba\n", "abc\n", "a\n", "aaa\n", "bab\n", "bcab\n", "zyxabc\n"],
  sol: `string s;cin>>s;int n=(int)s.size();
vector<int>best(26,0);
for(char c:s){int d=c-'a';
 int cur=0;
 for(int j=0;j<=d;++j)cur=max(cur,best[j]);
 best[d]=max(best[d],cur+1);}
int keep=0;
for(int j=0;j<26;++j)keep=max(keep,best[j]);
cout<<(n-keep)<<"\\n";`,
  wrongNote: "Counting the places where a letter falls below its neighbour measures how often the order breaks, not how few letters must go to repair it; demanding a strict rise throws away the repeated letters the statement is happy to keep.",
  wrong: [
    `string s;cin>>s;long long c=0;
for(size_t i=1;i<s.size();++i)if(s[i]<s[i-1])++c;
cout<<c<<"\\n";`,
    `string s;cin>>s;int n=(int)s.size();
vector<int>best(26,0);
for(char c:s){int d=c-'a';
 int cur=0;
 for(int j=0;j<d;++j)cur=max(cur,best[j]);
 best[d]=max(best[d],cur+1);}
int keep=0;
for(int j=0;j<26;++j)keep=max(keep,best[j]);
cout<<(n-keep)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B467", judge: "grid-count-saddle-points", topic: "foundations", rating: 1500,
  tag: "Matrices", timeLimitMs: 1000,
  uz: "Egar nuqtalar",
  en: "The saddle points",
  statementUz: "Sizga n satr va m ustundan iborat matritsa berilgan. Undagi egar nuqtalar sonini sanang: egar nuqta deganda o‘z satridagi eng kichik va ayni paytda o‘z ustunidagi eng katta bo‘lgan katak tushuniladi. Solishtirishlar qat'iy emas, ya'ni katak o‘z satrida yana bir xil qiymat bilan tenglashsa ham eng kichik hisoblanaveradi. Bunday katak bir nechta bo‘lishi ham, umuman bo‘lmasligi ham mumkin.",
  statementEn: "You are given a matrix of n rows and m columns. Count its saddle points, a saddle point being a cell that is the smallest in its own row and at the same time the largest in its own column. The comparisons are not strict, so a cell tied with another value in its row still counts as the smallest. There may be several such cells, or none at all.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi n qatorning har birida probel bilan ajratilgan m ta son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next n lines contains m numbers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — matritsadagi egar nuqtalar soni.",
  outputEn: "Print a single integer — the number of saddle points in the matrix.",
  constraintList: ["1 ≤ n, m ≤ 500", "−10^9 ≤ each entry ≤ 10^9", "a cell must be smallest in its row and largest in its column", "the comparisons are not strict, so ties still qualify"],
  constraintListUz: ["1 ≤ n, m ≤ 500", "−10^9 ≤ har bir element ≤ 10^9", "katak o‘z satrida eng kichik, o‘z ustunida eng katta bo‘lishi shart", "solishtirishlar qat'iy emas, ya'ni tenglik ham hisobga olinadi"],
  sampleInputs: ["3 3\n1 2 3\n4 5 6\n7 8 9\n", "2 2\n1 1\n1 1\n"],
  expect: ["1\n", "4\n"],
  sampleNotesUz: [
    "Satrlardagi eng kichik qiymatlar 1, 4 va 7 bo‘lib, ular birinchi ustunda turadi. Ulardan faqat 7 o‘z ustunida eng katta, shuning uchun yagona egar nuqta 7.",
    "Barcha to‘rtta katak bir xil qiymatda, ya'ni har biri o‘z satrida eng kichik va o‘z ustunida eng katta hisoblanadi. Javob 4.",
  ],
  sampleNotesEn: [
    "The smallest values of the rows are 1, 4 and 7, all in the first column. Of those only the 7 is the largest in its column, so the single saddle point is 7.",
    "All four cells hold the same value, so each is the smallest in its row and the largest in its column. The answer is 4.",
  ],
  testInputs: [
    "3 3\n1 2 3\n4 5 6\n7 8 9\n",
    "2 2\n1 1\n1 1\n",
    "1 1\n5\n",
    "2 3\n3 1 2\n9 8 7\n",
    "3 2\n5 5\n1 2\n3 4\n",
    "2 2\n1 2\n3 4\n",
  ],
  sol: `int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
vector<long long>rmin(n),cmax(m);
for(int i=0;i<n;++i){rmin[i]=a[i][0];for(int j=1;j<m;++j)rmin[i]=min(rmin[i],a[i][j]);}
for(int j=0;j<m;++j){cmax[j]=a[0][j];for(int i=1;i<n;++i)cmax[j]=max(cmax[j],a[i][j]);}
long long c=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j)if(a[i][j]==rmin[i]&&a[i][j]==cmax[j])++c;
cout<<c<<"\\n";`,
  wrongNote: "Swapping the two roles looks for the largest in the row and the smallest in the column, which is a different kind of cell; insisting that the cell beat every other entry strictly rejects the ties the statement admits.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
vector<long long>rmax(n),cmin(m);
for(int i=0;i<n;++i){rmax[i]=a[i][0];for(int j=1;j<m;++j)rmax[i]=max(rmax[i],a[i][j]);}
for(int j=0;j<m;++j){cmin[j]=a[0][j];for(int i=1;i<n;++i)cmin[j]=min(cmin[j],a[i][j]);}
long long c=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j)if(a[i][j]==rmax[i]&&a[i][j]==cmin[j])++c;
cout<<c<<"\\n";`,
    `int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
long long c=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j){
 bool ok=true;
 for(int t=0;t<m;++t)if(t!=j&&a[i][t]<=a[i][j])ok=false;
 for(int t=0;t<n;++t)if(t!=i&&a[t][j]>=a[i][j])ok=false;
 if(ok)++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B468", judge: "greedy-max-sum-k-negations", topic: "greedy", rating: 1700,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Aynan k marta ishorani almashtirish",
  en: "Flipping the sign exactly k times",
  statementUz: "Sizga n ta butun sondan iborat massiv va k soni berilgan. Aynan k marta amal bajarishingiz kerak; har bir amalda ixtiyoriy elementning ishorasini teskarisiga almashtirasiz. Bitta elementni bir necha marta tanlash mumkin. Barcha amallardan keyin massivning yig‘indisi eng katta bo‘lishi uchun qanday yo‘l tutish kerakligini aniqlang va o‘sha eng katta yig‘indini chiqaring.",
  statementEn: "You are given an array of n integers and a number k. You must perform exactly k operations, each of which flips the sign of any one element. The same element may be chosen more than once. Work out how to make the sum of the array as large as possible after all the operations and print that largest sum.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — aynan k marta ishora almashtirilgandan keyingi eng katta yig‘indi.",
  outputEn: "Print a single integer — the largest sum after exactly k sign flips.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "exactly k flips must be made, and one element may be flipped repeatedly", "the sum reaches 10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "aynan k marta almashtirish shart va bitta element takroran tanlanishi mumkin", "yig‘indi 10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["3 1\n4 2 3\n", "3 2\n-1 -2 -3\n"],
  expect: ["5\n", "4\n"],
  sampleNotesUz: [
    "Yagona amalni eng kichik element 2 ga qo‘llaymiz: 4 − 2 + 3 = 5. Boshqa elementni tanlasak yig‘indi kichikroq chiqadi.",
    "−3 va −2 ni musbatga aylantiramiz: 3 + 2 − 1 = 4. Uchala sonni ham musbat qilishga amallar yetmaydi.",
  ],
  sampleNotesEn: [
    "Applying the single flip to the smallest element 2 gives 4 − 2 + 3 = 5. Flipping anything else leaves a smaller sum.",
    "Turning the −3 and the −2 positive gives 3 + 2 − 1 = 4. There are not enough flips to make all three positive.",
  ],
  testInputs: ["3 1\n4 2 3\n", "3 2\n-1 -2 -3\n", "1 1\n-5\n", "1 2\n-5\n", "3 3\n1 2 3\n", "4 2\n-1 -1 1 1\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
for(long long i=0;i<n&&k>0;++i){
 if(a[i]>=0)break;
 a[i]=-a[i];--k;}
long long sum=0,mn=(long long)4e18;
for(long long x:a){sum+=x;if(x<mn)mn=x;}
if(k%2==1)sum-=2*mn;
cout<<sum<<"\\n";`,
  wrongNote: "Stopping once the negatives are gone leaves the unused flips unspent, but the statement demands exactly k of them and an odd leftover must cost the smallest value twice; adding up the magnitudes assumes every number can be made positive however few flips there are.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
for(long long i=0;i<n&&k>0;++i){
 if(a[i]>=0)break;
 a[i]=-a[i];--k;}
long long sum=0;
for(long long x:a)sum+=x;
cout<<sum<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long sum=0;
for(long long x:a)sum+=llabs(x);
cout<<sum<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B469", judge: "dp-max-profit-two-trades", topic: "dp", rating: 1800,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "Ikkita savdodagi eng katta foyda",
  en: "The largest profit from two trades",
  statementUz: "Sizga n kunlik narxlar ro‘yxati berilgan. Siz ko‘pi bilan ikki marta sotib olib sotishingiz mumkin, lekin ikkinchi xaridni faqat birinchi sotuvdan keyin qilish mumkin — bir vaqtning o‘zida ikkita ochiq savdo bo‘lmaydi. Umumiy foydani eng katta qilish kerak. Foyda olishning iloji bo‘lmasa, javob 0 bo‘ladi, chunki savdo qilmaslik ham mumkin.",
  statementEn: "You are given the prices over n days. You may buy and sell at most twice, but the second purchase may only happen after the first sale — two trades can never be open at once. Maximise the total profit. If no profit is possible the answer is 0, since trading nothing at all is allowed.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta narx keladi.",
  inputEn: "The first line contains one integer n. The second line contains the n prices.",
  outputUz: "Yagona butun sonni chiqaring — ko‘pi bilan ikkita savdodan olinadigan eng katta foyda.",
  outputEn: "Print a single integer — the largest profit from at most two trades.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ price ≤ 10^9", "the second purchase must come after the first sale", "buying and selling on the same day gives no profit", "trading nothing is allowed, so the answer is never negative"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ narx ≤ 10^9", "ikkinchi xarid birinchi sotuvdan keyin bo‘lishi shart", "bir kunda olib sotish foyda bermaydi", "savdo qilmaslikka ruxsat beriladi, shuning uchun javob manfiy bo‘lmaydi"],
  sampleInputs: ["8\n3 3 5 0 0 3 1 4\n", "5\n5 4 3 2 1\n"],
  expect: ["6\n", "0\n"],
  sampleNotesUz: [
    "Birinchi savdo: 3 ga olib 5 ga sotamiz, foyda 2. Ikkinchi savdo: 0 ga olib 4 ga sotamiz, foyda 4. Jami 6.",
    "Narxlar faqat tushib boradi, shuning uchun foydali savdo yo‘q. Hech narsa qilmasak foyda 0 bo‘ladi.",
  ],
  sampleNotesEn: [
    "The first trade buys at 3 and sells at 5 for a profit of 2. The second buys at 0 and sells at 4 for 4 more, giving 6 in all.",
    "The prices only fall, so no trade is profitable and doing nothing leaves a profit of 0.",
  ],
  testInputs: ["8\n3 3 5 0 0 3 1 4\n", "5\n5 4 3 2 1\n", "1\n5\n", "4\n1 5 1 5\n", "6\n2 1 4 5 2 9\n", "6\n1 5 1 5 1 5\n"],
  sol: `int n;cin>>n;vector<long long>p(n);for(auto&x:p)cin>>x;
const long long NEG=(long long)-4e18;
long long buy1=NEG,sell1=0,buy2=NEG,sell2=0;
for(long long x:p){
 buy1=max(buy1,-x);
 sell1=max(sell1,buy1+x);
 buy2=max(buy2,sell1-x);
 sell2=max(sell2,buy2+x);}
cout<<sell2<<"\\n";`,
  wrongNote: "Taking the single best trade leaves the second one on the table whenever two separate rises beat one; adding up every rise in the prices allows as many trades as there are up days, which is more than two.",
  wrong: [
    `int n;cin>>n;vector<long long>p(n);for(auto&x:p)cin>>x;
long long mn=(long long)4e18,best=0;
for(long long x:p){mn=min(mn,x);best=max(best,x-mn);}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>p(n);for(auto&x:p)cin>>x;
long long best=0;
for(int i=1;i<n;++i)if(p[i]>p[i-1])best+=p[i]-p[i-1];
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C470", judge: "graph-cheapest-path-k-stops", topic: "graphs", rating: 2000,
  tag: "Bellman-Ford with a bound", timeLimitMs: 2000,
  uz: "Ko‘pi bilan k ta bekat bilan eng arzon yo‘l",
  en: "The cheapest route with at most k stops",
  statementUz: "Sizga n ta shahar va ular orasidagi m ta yo‘naltirilgan reys berilgan; har bir reysning narxi bor. 1-shahardan n-shaharga borishning eng arzon narxini toping, lekin yo‘lda ko‘pi bilan k ta oraliq shaharda to‘xtash mumkin. Ya'ni yo‘l ko‘pi bilan k + 1 ta reysdan iborat bo‘ladi. Bunday yo‘l umuman bo‘lmasa, −1 chiqaring.",
  statementEn: "You are given n cities and m directed flights between them, each with a price. Find the cheapest way to travel from city 1 to city n, stopping at no more than k intermediate cities along the way — that is, using at most k + 1 flights. If no such route exists, print −1.",
  inputUz: "Birinchi qatorda uchta n, m va k butun soni beriladi. Keyingi m qatorning har birida a dan b ga reys va uning w narxi keladi.",
  inputEn: "The first line contains three integers n, m and k. Each of the next m lines contains a flight from a to b and its price w.",
  outputUz: "Yagona butun sonni chiqaring — eng arzon narx, yoki mos yo‘l bo‘lmasa −1.",
  outputEn: "Print a single integer — the cheapest price, or −1 if no such route exists.",
  constraintList: ["2 ≤ n ≤ 1000", "0 ≤ m ≤ 5000", "0 ≤ k ≤ n", "1 ≤ a, b ≤ n and a ≠ b", "1 ≤ w ≤ 10^9", "the route may use at most k + 1 flights"],
  constraintListUz: ["2 ≤ n ≤ 1000", "0 ≤ m ≤ 5000", "0 ≤ k ≤ n", "1 ≤ a, b ≤ n va a ≠ b", "1 ≤ w ≤ 10^9", "yo‘l ko‘pi bilan k + 1 ta reysdan iborat bo‘ladi"],
  sampleInputs: ["3 3 1\n1 2 100\n2 3 100\n1 3 500\n", "3 3 0\n1 2 100\n2 3 100\n1 3 500\n"],
  expect: ["200\n", "500\n"],
  sampleNotesUz: [
    "Bitta oraliq bekatga ruxsat bor, shuning uchun 1 → 2 → 3 yo‘lidan borib 200 to‘laymiz. To‘g‘ridan-to‘g‘ri reys 500 turadi.",
    "Oraliq bekatga ruxsat yo‘q, ya'ni faqat bitta reys ishlatiladi. Yagona bunday reys 1 dan 3 ga bo‘lib, 500 turadi.",
  ],
  sampleNotesEn: [
    "One intermediate stop is allowed, so the route 1 → 2 → 3 costs 200, while the direct flight costs 500.",
    "No intermediate stop is allowed, so only a single flight may be used. The only such flight goes from 1 to 3 and costs 500.",
  ],
  testInputs: [
    "3 3 1\n1 2 100\n2 3 100\n1 3 500\n",
    "3 3 0\n1 2 100\n2 3 100\n1 3 500\n",
    "2 1 0\n1 2 7\n",
    "2 0 5\n",
    "4 4 1\n1 2 1\n2 3 1\n3 4 1\n1 4 10\n",
    "5 5 3\n1 2 1\n2 3 1\n3 4 1\n4 5 1\n1 5 100\n",
  ],
  sol: `long long n,m,k;cin>>n>>m>>k;
vector<array<long long,3>>e(m);
for(long long i=0;i<m;++i){cin>>e[i][0]>>e[i][1]>>e[i][2];--e[i][0];--e[i][1];}
const long long INF=(long long)4e18;
vector<long long>d(n,INF);d[0]=0;
for(long long round=0;round<=k;++round){
 vector<long long>nd=d;
 for(long long i=0;i<m;++i){
  long long a=e[i][0],b=e[i][1],w=e[i][2];
  if(d[a]>=INF)continue;
  if(d[a]+w<nd[b])nd[b]=d[a]+w;}
 d=nd;}
cout<<((d[n-1]>=INF)?-1:d[n-1])<<"\\n";`,
  wrongNote: "Relaxing the edges in place lets one round chain several flights together, so the hop limit stops being enforced; an ordinary shortest path ignores the limit altogether.",
  wrong: [
    `long long n,m,k;cin>>n>>m>>k;
vector<array<long long,3>>e(m);
for(long long i=0;i<m;++i){cin>>e[i][0]>>e[i][1]>>e[i][2];--e[i][0];--e[i][1];}
const long long INF=(long long)4e18;
vector<long long>d(n,INF);d[0]=0;
for(long long round=0;round<=k;++round){
 for(long long i=0;i<m;++i){
  long long a=e[i][0],b=e[i][1],w=e[i][2];
  if(d[a]>=INF)continue;
  if(d[a]+w<d[b])d[b]=d[a]+w;}}
cout<<((d[n-1]>=INF)?-1:d[n-1])<<"\\n";`,
    `long long n,m,k;cin>>n>>m>>k;
vector<vector<pair<long long,long long>>>g(n);
for(long long i=0;i<m;++i){long long a,b,w;cin>>a>>b>>w;--a;--b;g[a].push_back(make_pair(b,w));}
const long long INF=(long long)4e18;
vector<long long>d(n,INF);d[0]=0;
priority_queue<pair<long long,long long>,vector<pair<long long,long long>>,greater<pair<long long,long long>>>pq;
pq.push(make_pair(0LL,0LL));
while(!pq.empty()){
 pair<long long,long long>t=pq.top();pq.pop();
 if(t.first>d[t.second])continue;
 for(size_t i=0;i<g[t.second].size();++i){
  long long u=g[t.second][i].first,w=g[t.second][i].second;
  if(t.first+w<d[u]){d[u]=t.first+w;pq.push(make_pair(d[u],u));}}}
cout<<((d[n-1]>=INF)?-1:d[n-1])<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C471", judge: "dsu-earliest-all-connected", topic: "graphs", rating: 2100,
  tag: "Disjoint set union", timeLimitMs: 2000,
  uz: "Hamma qachon bog‘lanadi",
  en: "When everyone becomes connected",
  statementUz: "Sizga n ta uch va m ta qirra berilgan; har bir qirra o‘ziga xos t vaqtida paydo bo‘ladi va undan keyin abadiy qoladi. Grafdagi barcha uchlar o‘zaro bog‘lanadigan eng erta vaqtni toping. Qirralarni paydo bo‘lish vaqti bo‘yicha tartiblab, birma-bir qo‘shib borish va komponentalar soni birga tushgan lahzani kuzatish kifoya. Hech qachon bog‘lanmasa, −1 chiqaring.",
  statementEn: "You are given n vertices and m edges, each appearing at its own time t and staying forever after. Find the earliest time at which every vertex is connected to every other. Sorting the edges by their time and adding them one at a time, watching for the moment the component count drops to one, is enough. If that never happens, print −1.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a, b va t keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains a, b and t.",
  outputUz: "Yagona butun sonni chiqaring — hamma uch bog‘lanadigan eng erta vaqt, yoki bunday vaqt bo‘lmasa −1.",
  outputEn: "Print a single integer — the earliest time everything is connected, or −1 if that never happens.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n and a ≠ b", "1 ≤ t ≤ 10^9 and several edges may share a time", "a graph of one vertex is connected from time 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n va a ≠ b", "1 ≤ t ≤ 10^9 va bir nechta qirra bir xil vaqtga ega bo‘lishi mumkin", "bitta uchli graf 0 vaqtidan boshlab bog‘langan"],
  sampleInputs: ["4 4\n1 2 3\n2 3 1\n3 4 4\n1 4 2\n", "2 0\n"],
  expect: ["3\n", "-1\n"],
  sampleNotesUz: [
    "Vaqt 1 da 2 va 3 bog‘lanadi, vaqt 2 da 1 va 4 bog‘lanadi, vaqt 3 da esa 1 bilan 2 ni bog‘lovchi qirra ikkala guruhni birlashtiradi. Vaqt 4 dagi qirra allaqachon keraksiz.",
    "Birorta qirra yo‘q, shuning uchun ikkita uch hech qachon bog‘lanmaydi va javob −1.",
  ],
  sampleNotesEn: [
    "At time 1 vertices 2 and 3 join, at time 2 vertices 1 and 4 join, and at time 3 the edge between 1 and 2 merges the two groups. The edge at time 4 is already unnecessary.",
    "There is no edge at all, so the two vertices never connect and the answer is −1.",
  ],
  testInputs: [
    "4 4\n1 2 3\n2 3 1\n3 4 4\n1 4 2\n",
    "2 0\n",
    "1 0\n",
    "3 2\n1 2 5\n2 3 5\n",
    "3 3\n1 2 1\n1 2 2\n2 3 7\n",
    "4 3\n1 2 1\n3 4 2\n1 3 100\n",
  ],
  sol: `int n,m;cin>>n>>m;
vector<array<long long,3>>e(m);
for(int i=0;i<m;++i)cin>>e[i][1]>>e[i][2]>>e[i][0];
sort(e.begin(),e.end());
vector<int>p(n);for(int i=0;i<n;++i)p[i]=i;
function<int(int)>find=[&](int v){while(p[v]!=v){p[v]=p[p[v]];v=p[v];}return v;};
long long comps=n;
if(comps==1){cout<<"0\\n";return 0;}
for(int i=0;i<m;++i){
 int a=find((int)e[i][1]-1),b=find((int)e[i][2]-1);
 if(a==b)continue;
 p[a]=b;--comps;
 if(comps==1){cout<<e[i][0]<<"\\n";return 0;}}
cout<<"-1\\n";`,
  wrongNote: "The latest edge time is only the answer when that very edge is the one that finishes the job, and a redundant edge arriving later pushes it past the truth; adding up the times of the edges that mattered answers a spanning-tree question instead of a moment in time.",
  wrong: [
    `int n,m;cin>>n>>m;
vector<array<long long,3>>e(m);
for(int i=0;i<m;++i)cin>>e[i][1]>>e[i][2]>>e[i][0];
sort(e.begin(),e.end());
vector<int>p(n);for(int i=0;i<n;++i)p[i]=i;
function<int(int)>find=[&](int v){while(p[v]!=v){p[v]=p[p[v]];v=p[v];}return v;};
long long comps=n;
if(comps==1){cout<<"0\\n";return 0;}
for(int i=0;i<m;++i){
 int a=find((int)e[i][1]-1),b=find((int)e[i][2]-1);
 if(a!=b){p[a]=b;--comps;}}
if(comps>1){cout<<"-1\\n";return 0;}
cout<<e[m-1][0]<<"\\n";`,
    `int n,m;cin>>n>>m;
vector<array<long long,3>>e(m);
for(int i=0;i<m;++i)cin>>e[i][1]>>e[i][2]>>e[i][0];
sort(e.begin(),e.end());
vector<int>p(n);for(int i=0;i<n;++i)p[i]=i;
function<int(int)>find=[&](int v){while(p[v]!=v){p[v]=p[p[v]];v=p[v];}return v;};
long long comps=n,total=0;
if(comps==1){cout<<"0\\n";return 0;}
for(int i=0;i<m;++i){
 int a=find((int)e[i][1]-1),b=find((int)e[i][2]-1);
 if(a==b)continue;
 p[a]=b;--comps;total+=e[i][0];}
cout<<((comps==1)?total:-1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C472", judge: "adv-count-distinct-subsequences", topic: "advanced-cp", rating: 2300,
  tag: "Dynamic programming", timeLimitMs: 2000,
  uz: "Har xil ostketma-ketliklar soni",
  en: "The number of distinct subsequences",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning bo‘sh bo‘lmagan har xil ostketma-ketliklari nechtaligini 10^9 + 7 modul bo‘yicha sanang. Ostketma-ketlik deganda satrdan ba'zi harflarni o‘chirib, qolganlarining tartibini saqlab hosil qilingan satr tushuniladi. Bir xil ko‘rinishdagi natijalar, qaysi pozitsiyalardan olinganidan qat'i nazar, bir marta sanaladi.",
  statementEn: "You are given a string s of lowercase Latin letters. Count, modulo 10^9 + 7, its distinct non-empty subsequences. A subsequence is what remains after deleting some letters and keeping the rest in their original order. Results that read the same are counted once, no matter which positions they came from.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — bo‘sh bo‘lmagan har xil ostketma-ketliklar sonining 10^9 + 7 bo‘yicha qoldig‘i.",
  outputEn: "Print a single integer — the number of distinct non-empty subsequences, modulo 10^9 + 7.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the letters 'a'–'z'", "the empty subsequence is not counted", "equal-looking subsequences are counted once", "the answer is reported modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s 'a'–'z' harflaridan iborat", "bo‘sh ostketma-ketlik sanalmaydi", "bir xil ko‘rinishdagi ostketma-ketliklar bir marta sanaladi", "javob 10^9 + 7 modul bo‘yicha chiqariladi"],
  sampleInputs: ["abc\n", "aaa\n"],
  expect: ["7\n", "3\n"],
  sampleNotesUz: [
    "Har xil ostketma-ketliklar: a, b, c, ab, ac, bc va abc — jami 7 ta.",
    "Uchala harf ham bir xil, shuning uchun faqat uzunligi bo‘yicha farq qiladigan a, aa va aaa qoladi — 3 ta.",
  ],
  sampleNotesEn: [
    "The distinct subsequences are a, b, c, ab, ac, bc and abc — seven in all.",
    "All three letters are the same, so only a, aa and aaa differ from one another — three of them.",
  ],
  testInputs: ["abc\n", "aaa\n", "a\n", "ab\n", "aba\n", "abab\n"],
  sol: `string s;cin>>s;const long long M=1000000007;
vector<long long>last(26,-1);
long long total=1;
vector<long long>pre;pre.push_back(1);
for(size_t i=0;i<s.size();++i){
 int c=s[i]-'a';
 long long nv=total*2%M;
 if(last[c]>=0)nv=((nv-pre[last[c]])%M+M)%M;
 last[c]=(long long)i;
 total=nv;pre.push_back(total);}
cout<<((total-1)%M+M)%M<<"\\n";`,
  wrongNote: "Doubling at every letter without removing what the previous copy of that letter already produced counts the repeats again; leaving the empty subsequence in the total reports one more than the statement asks for.",
  wrong: [
    `string s;cin>>s;const long long M=1000000007;
long long total=1;
for(size_t i=0;i<s.size();++i)total=total*2%M;
cout<<((total-1)%M+M)%M<<"\\n";`,
    `string s;cin>>s;const long long M=1000000007;
vector<long long>last(26,-1);
long long total=1;
vector<long long>pre;pre.push_back(1);
for(size_t i=0;i<s.size();++i){
 int c=s[i]-'a';
 long long nv=total*2%M;
 if(last[c]>=0)nv=((nv-pre[last[c]])%M+M)%M;
 last[c]=(long long)i;
 total=nv;pre.push_back(total);}
cout<<total<<"\\n";`,
  ],
});

export default P;
