/* Batch 433 — ten problems, A433–C442.
 *
 * Products and divisor sums at the bottom, a functional graph and a k-th
 * subarray sum at the top; C441 and C442 are the batch's insane entries.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A433", judge: "array-min-max-product", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Eng kichik va eng katta elementning ko‘paytmasi",
  en: "The product of the smallest and the largest element",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uning eng kichik elementini eng katta elementiga ko‘paytiring va natijani chiqaring. Massivda manfiy sonlar ham bo‘lishi mumkin, shuning uchun ko‘paytma manfiy chiqishi mumkin. Massivda bitta element bo‘lsa, eng kichik va eng katta element bir xil bo‘ladi, ya'ni javob o‘sha sonning kvadratiga teng.",
  statementEn: "You are given an array of n integers. Multiply its smallest element by its largest one and print the result. The array may hold negative numbers, so the product may come out negative. If the array holds one element then the smallest and the largest are the same one, and the answer is that number squared.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng kichik va eng katta elementning ko‘paytmasi.",
  outputEn: "Print a single integer — the product of the smallest and the largest element.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the product reaches 10^18 and needs a 64-bit type", "with one element the answer is that number squared"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "ko‘paytma 10^18 ga yetadi va 64-bitli turni talab qiladi", "bitta element bo‘lganda javob o‘sha sonning kvadrati"],
  sampleInputs: ["5\n3 1 4 1 5\n", "3\n-4 2 3\n"],
  expect: ["5\n", "-12\n"],
  sampleNotesUz: [
    "Eng kichik element 1, eng kattasi 5. Ularning ko‘paytmasi 5.",
    "Eng kichik element −4, eng kattasi 3. −4 · 3 = −12, ya'ni javob manfiy chiqadi.",
  ],
  sampleNotesEn: [
    "The smallest element is 1 and the largest is 5, so their product is 5.",
    "The smallest element is −4 and the largest is 3. Since −4 · 3 = −12 the answer comes out negative.",
  ],
  testInputs: ["5\n3 1 4 1 5\n", "3\n-4 2 3\n", "1\n7\n", "2\n-5 -2\n", "3\n0 5 9\n", "2\n-1000000000 1000000000\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mn=a[0],mx=a[0];
for(long long x:a){if(x<mn)mn=x;if(x>mx)mx=x;}
cout<<(mn*mx)<<"\\n";`,
  wrongNote: "The first and the last element are not the smallest and the largest unless the array happens to be sorted; picking the extremes by size regardless of sign confuses the most negative number with the largest one.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
cout<<(a[0]*a[n-1])<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mn=a[0],mx=a[0];
for(long long x:a){if(llabs(x)<llabs(mn))mn=x;if(llabs(x)>llabs(mx))mx=x;}
cout<<(mn*mx)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A434", judge: "math-sum-divisors", topic: "math", rating: 1000,
  tag: "Number theory", timeLimitMs: 1000,
  uz: "Bo‘luvchilar yig‘indisi",
  en: "The sum of the divisors",
  statementUz: "Sizga musbat n butun soni berilgan. Uning barcha musbat bo‘luvchilarining yig‘indisini toping; bunda 1 ham, n ning o‘zi ham hisobga olinadi. To‘liq kvadratlarda o‘rtadagi bo‘luvchini ikki marta qo‘shib yubormaslik kerak. Ko‘p bo‘luvchili n uchun yig‘indi 10^12 dan oshadi va 64-bitli turni talab qiladi.",
  statementEn: "You are given a positive integer n. Find the sum of all its positive divisors, counting both 1 and n itself. For a perfect square, take care not to add the middle divisor twice. On a highly divisible n the sum runs beyond 10^12 and needs a 64-bit type.",
  inputUz: "Yagona qatorda bitta musbat n butun soni beriladi.",
  inputEn: "The only line contains one positive integer n.",
  outputUz: "Yagona butun sonni chiqaring — n ning barcha musbat bo‘luvchilari yig‘indisi.",
  outputEn: "Print a single integer — the sum of all the positive divisors of n.",
  constraintList: ["1 ≤ n ≤ 10^12", "both 1 and n count as divisors", "the sum reaches beyond 10^12 and needs a 64-bit type", "a perfect square has one divisor that is its own partner"],
  constraintListUz: ["1 ≤ n ≤ 10^12", "1 ham, n ning o‘zi ham bo‘luvchi hisoblanadi", "yig‘indi 10^12 dan oshadi va 64-bitli turni talab qiladi", "to‘liq kvadratda bitta bo‘luvchining jufti o‘zi bo‘ladi"],
  sampleInputs: ["12\n", "1\n"],
  expect: ["28\n", "1\n"],
  sampleNotesUz: [
    "12 ning bo‘luvchilari 1, 2, 3, 4, 6 va 12. Ularning yig‘indisi 28.",
    "1 ning yagona bo‘luvchisi o‘zi, shuning uchun yig‘indi 1.",
  ],
  sampleNotesEn: [
    "The divisors of 12 are 1, 2, 3, 4, 6 and 12, and they add up to 28.",
    "The only divisor of 1 is itself, so the sum is 1.",
  ],
  testInputs: ["12\n", "1\n", "13\n", "36\n", "999999999989\n", "1000000000000\n"],
  sol: `long long n;cin>>n;long long s=0;
for(long long d=1;d*d<=n;++d){
 if(n%d)continue;
 s+=d;
 if(d!=n/d)s+=n/d;}
cout<<s<<"\\n";`,
  wrongNote: "Adding both a divisor and its partner without checking whether they coincide counts the middle divisor of a perfect square twice; adding only the divisors below the square root leaves out every large one.",
  wrong: [
    `long long n;cin>>n;long long s=0;
for(long long d=1;d*d<=n;++d){
 if(n%d)continue;
 s+=d;s+=n/d;}
cout<<s<<"\\n";`,
    `long long n;cin>>n;long long s=0;
for(long long d=1;d*d<=n;++d)if(n%d==0)s+=d;
cout<<s<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B435", judge: "math-base-digit-sum", topic: "math", rating: 1200,
  tag: "Number systems", timeLimitMs: 1000,
  uz: "b asosidagi raqamlar yig‘indisi",
  en: "The digit sum in base b",
  statementUz: "Sizga manfiy bo‘lmagan n soni va b asosi berilgan. n ni b asosli sanoq sistemasida yozganda hosil bo‘ladigan raqamlarning yig‘indisini toping. Raqamlar 0 dan b − 1 gacha qiymat oladi va ularni b ga qoldiqli bo‘lish orqali birma-bir ajratib olish mumkin. n nolga teng bo‘lsa, yozuvida yagona 0 raqami turadi va yig‘indi 0 bo‘ladi.",
  statementEn: "You are given a non-negative number n and a base b. Find the sum of the digits n has when written in base b. The digits run from 0 to b − 1 and can be peeled off one at a time by taking remainders modulo b. If n is zero its writing is a single 0 and the sum is 0.",
  inputUz: "Yagona qatorda ikkita n va b butun soni beriladi.",
  inputEn: "The only line contains two integers n and b.",
  outputUz: "Yagona butun sonni chiqaring — n ning b asosidagi raqamlari yig‘indisi.",
  outputEn: "Print a single integer — the sum of the digits of n in base b.",
  constraintList: ["0 ≤ n ≤ 10^18", "2 ≤ b ≤ 36", "the digits run from 0 to b − 1", "n = 0 gives an answer of 0"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "2 ≤ b ≤ 36", "raqamlar 0 dan b − 1 gacha qiymat oladi", "n = 0 bo‘lganda javob 0"],
  sampleInputs: ["255 16\n", "8 2\n"],
  expect: ["30\n", "1\n"],
  sampleNotesUz: [
    "255 o‘n oltilik sanoqda ikkita raqamdan iborat va ularning har biri 15 ga teng. Yig‘indi 15 + 15 = 30.",
    "8 ikkilik sanoqda 1000 ko‘rinishida yoziladi, ya'ni raqamlari 1, 0, 0 va 0. Ularning yig‘indisi 1.",
  ],
  sampleNotesEn: [
    "In base sixteen 255 has two digits, each equal to 15, so the sum is 15 + 15 = 30.",
    "In base two 8 is written as 1000, whose digits are 1, 0, 0 and 0, adding up to 1.",
  ],
  testInputs: ["255 16\n", "8 2\n", "0 2\n", "10 10\n", "6 7\n", "1000000000000000000 7\n"],
  sol: `long long n,b;cin>>n>>b;long long s=0;
while(n>0){s+=n%b;n/=b;}
cout<<s<<"\\n";`,
  wrongNote: "Peeling digits with tens rather than the given base answers the question for base ten whatever b says; stopping while the number is merely above the base drops its leading digit.",
  wrong: [
    `long long n,b;cin>>n>>b;long long s=0;
while(n>0){s+=n%10;n/=10;}
cout<<s<<"\\n";`,
    `long long n,b;cin>>n>>b;long long s=0;
while(n>b){s+=n%b;n/=b;}
cout<<s<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B436", judge: "two-pointers-pairs-sum-range", topic: "two-pointers", rating: 1400,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Yig‘indisi oraliqqa tushgan juftliklar",
  en: "The pairs whose sum lands in the range",
  statementUz: "Sizga n ta butun sondan iborat massiv va ikkita L, R chegarasi berilgan. Turli pozitsiyalardagi shunday juftliklar sonini toping-ki, ikkala elementning yig‘indisi L dan kichik bo‘lmasin va R dan katta bo‘lmasin. Juftlik tartibsiz hisoblanadi, ya'ni bir xil ikki pozitsiya faqat bir marta sanaladi. Ikkala chegara ham oraliqqa kiradi; pozitsiyalar har xil bo‘lishi shart, garchi ulardagi qiymatlar teng bo‘lishi mumkin bo‘lsa ham.",
  statementEn: "You are given an array of n integers and two bounds L and R. Count the pairs of distinct positions whose two elements add up to something not below L and not above R. A pair is unordered, so the same two positions are counted only once. Both bounds belong to the range, and the two positions must differ though the values standing at them may be equal.",
  inputUz: "Birinchi qatorda uchta n, L va R butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains three integers n, L and R. The second line contains n integers.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi [L, R] oralig‘iga tushgan juftliklar soni.",
  outputEn: "Print a single integer — the number of pairs whose sum lies in the range [L, R].",
  constraintList: ["1 ≤ n ≤ 10^5", "−2·10^9 ≤ L ≤ R ≤ 2·10^9", "−10^9 ≤ a_i ≤ 10^9", "the two positions must differ, and a pair is counted once", "the answer reaches 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−2·10^9 ≤ L ≤ R ≤ 2·10^9", "−10^9 ≤ a_i ≤ 10^9", "pozitsiyalar har xil bo‘lishi shart va juftlik bir marta sanaladi", "javob 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4 3 5\n1 2 3 4\n", "3 100 200\n1 2 3\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Yig‘indisi 3 dan 5 gacha bo‘lgan juftliklar: 1+2 = 3, 1+3 = 4, 1+4 = 5 va 2+3 = 5 — to‘rtta. Qolgan 2+4 = 6 va 3+4 = 7 oraliqdan chiqib ketadi.",
    "Eng katta yig‘indi 2 + 3 = 5 bo‘lib, u ham 100 dan kichik. Shuning uchun birorta juftlik oraliqqa tushmaydi.",
  ],
  sampleNotesEn: [
    "The pairs summing between 3 and 5 are 1+2 = 3, 1+3 = 4, 1+4 = 5 and 2+3 = 5 — four of them. The remaining 2+4 = 6 and 3+4 = 7 fall outside.",
    "The largest sum is 2 + 3 = 5, still below 100, so no pair lands in the range.",
  ],
  testInputs: ["4 3 5\n1 2 3 4\n", "3 100 200\n1 2 3\n", "2 2 2\n1 1\n", "5 0 1000000000\n1 2 3 4 5\n", "4 -5 0\n-3 -2 1 2\n", "6 4 6\n1 1 2 2 3 3\n"],
  sol: `long long n,L,R;cin>>n>>L>>R;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
auto atMost=[&](long long lim){long long c=0;int i=0,j=(int)n-1;
 while(i<j){
  if(a[i]+a[j]<=lim){c+=j-i;++i;}
  else --j;}
 return c;};
cout<<(atMost(R)-atMost(L-1))<<"\\n";`,
  wrongNote: "Counting each pair from both ends doubles every answer, since the statement treats a pair as unordered; requiring the sum to be strictly inside the bounds drops the pairs that land exactly on them.",
  wrong: [
    `long long n,L,R;cin>>n>>L>>R;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
auto atMost=[&](long long lim){long long c=0;int i=0,j=(int)n-1;
 while(i<j){
  if(a[i]+a[j]<=lim){c+=j-i;++i;}
  else --j;}
 return c;};
cout<<(2*(atMost(R)-atMost(L-1)))<<"\\n";`,
    `long long n,L,R;cin>>n>>L>>R;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
auto atMost=[&](long long lim){long long c=0;int i=0,j=(int)n-1;
 while(i<j){
  if(a[i]+a[j]<=lim){c+=j-i;++i;}
  else --j;}
 return c;};
cout<<(atMost(R-1)-atMost(L))<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B437", judge: "greedy-min-swaps-balance-brackets", topic: "greedy", rating: 1600,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Qavslarni muvozanatlash uchun almashtirishlar",
  en: "Swapping brackets into balance",
  statementUz: "Sizga [ va ] belgilaridan iborat satr berilgan; ochilgan va yopilgan qavslar soni teng. Bitta almashtirishda ixtiyoriy ikkita pozitsiyadagi belgilar o‘rin almashadi — ular yonma-yon bo‘lishi shart emas. Satrni to‘g‘ri qavsli holatga keltirish uchun kerak bo‘ladigan eng kam almashtirishlar sonini toping. Satr allaqachon to‘g‘ri bo‘lsa, javob 0 bo‘ladi.",
  statementEn: "You are given a string of [ and ] characters in which the openings and the closings are equal in number. One swap exchanges the characters at any two positions, which need not be neighbours. Find the smallest number of swaps that turns the string into a well-formed bracket sequence. If it is already well formed the answer is 0.",
  inputUz: "Yagona qatorda [ va ] belgilaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of [ and ] characters.",
  outputUz: "Yagona butun sonni chiqaring — kerakli almashtirishlarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of swaps needed.",
  constraintList: ["2 ≤ |s| ≤ 10^5 and |s| is even", "s consists of the characters '[' and ']' only", "the openings and the closings are equal in number", "a swap may exchange any two positions"],
  constraintListUz: ["2 ≤ |s| ≤ 10^5 va |s| juft", "s faqat '[' va ']' belgilaridan iborat", "ochilgan va yopilgan qavslar soni teng", "almashtirish ixtiyoriy ikki pozitsiyani o‘zgartira oladi"],
  sampleInputs: ["][][\n", "[]\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "Birinchi va oxirgi belgini almashtirsak [][] hosil bo‘ladi, ya'ni bitta almashtirish yetarli.",
    "Satr allaqachon to‘g‘ri qavsli, shuning uchun hech narsa almashtirilmaydi.",
  ],
  sampleNotesEn: [
    "Swapping the first character with the last gives [][], so one swap is enough.",
    "The string is already well formed, so nothing needs swapping.",
  ],
  testInputs: ["][][\n", "[]\n", "]]][[[\n", "[]][][\n", "[[]]\n", "]][[\n"],
  sol: `string s;cin>>s;long long bal=0,worst=0;
for(char c:s){
 bal+=(c=='[')?1:-1;
 if(-bal>worst)worst=-bal;}
cout<<((worst+1)/2)<<"\\n";`,
  wrongNote: "The deepest shortfall is how many closings stand unmatched, but one swap repairs two of them at once, so reporting it directly doubles the answer; counting the positions where the balance is negative measures how long the shortfall lasts rather than how deep it goes.",
  wrong: [
    `string s;cin>>s;long long bal=0,worst=0;
for(char c:s){
 bal+=(c=='[')?1:-1;
 if(-bal>worst)worst=-bal;}
cout<<worst<<"\\n";`,
    `string s;cin>>s;long long bal=0,c=0;
for(char ch:s){
 bal+=(ch=='[')?1:-1;
 if(bal<0)++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B438", judge: "dp-count-dice-sums", topic: "dp", rating: 1700,
  tag: "Dynamic programming", timeLimitMs: 2000,
  uz: "Zarlar yig‘indisi nechta usulda chiqadi",
  en: "How many ways the dice add up",
  statementUz: "Sizda n ta bir xil zar bor va har birining yoqlarida 1 dan f gacha sonlar yozilgan. Barcha zarlarni tashlaganda ularning yig‘indisi aynan s ga teng bo‘ladigan natijalar nechtaligini 10^9 + 7 modul bo‘yicha sanang. Zarlar bir-biridan farqlanadi, ya'ni birinchi zar 1, ikkinchisi 2 tushgan holat bilan teskarisi alohida natija hisoblanadi. Bunday natija umuman bo‘lmasa, 0 chiqaring.",
  statementEn: "You have n identical dice, each with the numbers 1 through f on its faces. Count, modulo 10^9 + 7, the outcomes in which the dice add up to exactly s. The dice are told apart, so the first showing 1 and the second showing 2 is a different outcome from the other way round. If no outcome reaches s, print 0.",
  inputUz: "Yagona qatorda uchta n, f va s butun soni beriladi.",
  inputEn: "The only line contains three integers n, f and s.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi s ga teng natijalar sonining 10^9 + 7 bo‘yicha qoldig‘i.",
  outputEn: "Print a single integer — the number of outcomes summing to s, modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 500", "1 ≤ f ≤ 500", "1 ≤ s ≤ 10^5", "each die shows a number between 1 and f", "the dice are told apart from one another"],
  constraintListUz: ["1 ≤ n ≤ 500", "1 ≤ f ≤ 500", "1 ≤ s ≤ 10^5", "har bir zar 1 dan f gacha son ko‘rsatadi", "zarlar bir-biridan farqlanadi"],
  sampleInputs: ["2 6 7\n", "1 6 7\n"],
  expect: ["6\n", "0\n"],
  sampleNotesUz: [
    "Ikkita oddiy zarda 7 yig‘indisi (1,6), (2,5), (3,4), (4,3), (5,2) va (6,1) holatlarida chiqadi — jami 6 ta natija.",
    "Yagona zarning eng katta qiymati 6, ya'ni 7 ni chiqarib bo‘lmaydi. Javob 0.",
  ],
  sampleNotesEn: [
    "Two ordinary dice reach 7 as (1,6), (2,5), (3,4), (4,3), (5,2) and (6,1) — six outcomes in all.",
    "A single die tops out at 6, so 7 is out of reach and the answer is 0.",
  ],
  testInputs: ["2 6 7\n", "1 6 7\n", "2 6 2\n", "3 6 10\n", "1 1 1\n", "10 10 50\n"],
  sol: `long long n,f,s;cin>>n>>f>>s;const long long M=1000000007;
vector<long long>dp(s+1,0);dp[0]=1;
for(long long i=0;i<n;++i){
 vector<long long>pre(s+2,0);
 for(long long v=0;v<=s;++v)pre[v+1]=(pre[v]+dp[v])%M;
 vector<long long>nd(s+1,0);
 for(long long v=1;v<=s;++v){
  long long lo=max(0LL,v-f),hi=v-1;
  if(lo>hi)continue;
  nd[v]=((pre[hi+1]-pre[lo])%M+M)%M;}
 dp=nd;}
cout<<dp[s]<<"\\n";`,
  wrongNote: "Letting a die show zero adds outcomes no die can produce; treating the top face as out of reach shrinks every die to f − 1 faces.",
  wrong: [
    `long long n,f,s;cin>>n>>f>>s;const long long M=1000000007;
vector<long long>dp(s+1,0);dp[0]=1;
for(long long i=0;i<n;++i){
 vector<long long>pre(s+2,0);
 for(long long v=0;v<=s;++v)pre[v+1]=(pre[v]+dp[v])%M;
 vector<long long>nd(s+1,0);
 for(long long v=0;v<=s;++v){
  long long lo=max(0LL,v-f),hi=v;
  nd[v]=((pre[hi+1]-pre[lo])%M+M)%M;}
 dp=nd;}
cout<<dp[s]<<"\\n";`,
    `long long n,f,s;cin>>n>>f>>s;const long long M=1000000007;
vector<long long>dp(s+1,0);dp[0]=1;
for(long long i=0;i<n;++i){
 vector<long long>pre(s+2,0);
 for(long long v=0;v<=s;++v)pre[v+1]=(pre[v]+dp[v])%M;
 vector<long long>nd(s+1,0);
 for(long long v=1;v<=s;++v){
  long long lo=max(0LL,v-f+1),hi=v-1;
  if(lo>hi)continue;
  nd[v]=((pre[hi+1]-pre[lo])%M+M)%M;}
 dp=nd;}
cout<<dp[s]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B439", judge: "str-min-append-palindrome", topic: "strings", rating: 1800,
  tag: "Prefix function", timeLimitMs: 1000,
  uz: "Palindrom qilish uchun qancha harf qo‘shiladi",
  en: "How many letters a palindrome needs",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning oxiriga eng kam nechta harf qo‘shsangiz, natija palindromga aylanadi — shuni toping. Harflarni faqat oxiriga qo‘shish mumkin, boshiga yoki o‘rtasiga emas. Allaqachon palindrom bo‘lgan satrga hech narsa qo‘shilmaydi va javob satr uzunligidan bittani ayirgan qiymatdan oshmaydi.",
  statementEn: "You are given a string s of lowercase Latin letters. Find the smallest number of letters that must be appended to its end to turn it into a palindrome. Letters may only be added at the end, never at the front or in the middle. A string that is already a palindrome needs nothing appended, and the answer never exceeds the length of the string minus one.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — oxiriga qo‘shilishi kerak bo‘lgan harflarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of letters that must be appended.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the letters 'a'–'z'", "letters may only be appended at the end", "a string that is already a palindrome answers 0"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s 'a'–'z' harflaridan iborat", "harflar faqat oxiriga qo‘shiladi", "allaqachon palindrom bo‘lgan satr uchun javob 0"],
  sampleInputs: ["abc\n", "aba\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Palindrom bo‘lgan eng uzun oxirgi qism — yagona c harfi. Oldidagi ab ni teskari yozib qo‘shsak abcba chiqadi, ya'ni ikkita harf kerak.",
    "aba allaqachon palindrom, shuning uchun hech narsa qo‘shilmaydi.",
  ],
  sampleNotesEn: [
    "The longest palindromic suffix is the single letter c. Writing the ab in front of it backwards at the end gives abcba, so two letters are needed.",
    "The string aba is already a palindrome, so nothing is appended.",
  ],
  testInputs: ["abc\n", "aba\n", "aab\n", "abab\n", "a\n", "aaaa\n"],
  sol: `string s;cin>>s;int n=(int)s.size();
string r=s;reverse(r.begin(),r.end());
string t=r+"#"+s;
int m=(int)t.size();
vector<int>f(m,0);
for(int i=1;i<m;++i){int j=f[i-1];
 while(j>0&&t[i]!=t[j])j=f[j-1];
 if(t[i]==t[j])++j;
 f[i]=j;}
cout<<(n-f[m-1])<<"\\n";`,
  wrongNote: "Matching the string against its own reverse the other way round finds the longest palindromic prefix, which is what you would need in order to add letters at the front; falling back on the whole length whenever the string is not already a palindrome ignores every palindromic tail it does have.",
  wrong: [
    `string s;cin>>s;int n=(int)s.size();
string r=s;reverse(r.begin(),r.end());
string t=s+"#"+r;
int m=(int)t.size();
vector<int>f(m,0);
for(int i=1;i<m;++i){int j=f[i-1];
 while(j>0&&t[i]!=t[j])j=f[j-1];
 if(t[i]==t[j])++j;
 f[i]=j;}
cout<<(n-f[m-1])<<"\\n";`,
    `string s;cin>>s;int n=(int)s.size();
string r=s;reverse(r.begin(),r.end());
cout<<((s==r)?0:(n-1))<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C440", judge: "heap-kth-smallest-pair-sum", topic: "data-structures", rating: 2000,
  tag: "Heap", timeLimitMs: 2000,
  uz: "Juftlik yig‘indilarining k-kichigi",
  en: "The k-th smallest pair sum",
  statementUz: "Sizga kamaymaydigan tartibda saralangan ikkita massiv berilgan. Birinchisidan bitta, ikkinchisidan bitta element olib yig‘indi hosil qilamiz; barcha mumkin bo‘lgan yig‘indilarni o‘sish tartibida yozsak, ularning k-chisi qanday bo‘lishini toping. Bir xil qiymatli yig‘indilar alohida-alohida sanaladi. Qiymatlar manfiy bo‘lishi mumkin, shuning uchun yig‘indi ham manfiy chiqishi mumkin; k esa mavjud juftliklar sonidan oshmaydi.",
  statementEn: "You are given two arrays sorted in non-decreasing order. Taking one element from each forms a sum; writing every possible sum in increasing order, find what the k-th of them is. Equal sums are listed separately. The values may be negative, so a sum may come out negative too, and k never exceeds the number of pairs available.",
  inputUz: "Birinchi qatorda uchta n, m va k butun soni beriladi. Ikkinchi qatorda n ta, uchinchi qatorda esa m ta saralangan son keladi.",
  inputEn: "The first line contains three integers n, m and k. The second line contains n sorted numbers and the third line m sorted numbers.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indilarning o‘sish tartibidagi k-chisi.",
  outputEn: "Print a single integer — the k-th smallest of the sums.",
  constraintList: ["1 ≤ n, m ≤ 10^5", "1 ≤ k ≤ min(n · m, 10^5)", "−10^9 ≤ values ≤ 10^9", "both arrays arrive sorted in non-decreasing order", "equal sums are listed separately"],
  constraintListUz: ["1 ≤ n, m ≤ 10^5", "1 ≤ k ≤ min(n · m, 10^5)", "−10^9 ≤ qiymatlar ≤ 10^9", "ikkala massiv ham kamaymaydigan tartibda keladi", "teng yig‘indilar alohida sanaladi"],
  sampleInputs: ["2 2 3\n1 7\n2 4\n", "1 1 1\n5\n5\n"],
  expect: ["9\n", "10\n"],
  sampleNotesUz: [
    "Barcha yig‘indilar: 1+2 = 3, 1+4 = 5, 7+2 = 9 va 7+4 = 11. O‘sish tartibida uchinchisi 9.",
    "Yagona juftlik 5 + 5 = 10, ya'ni birinchi va yagona yig‘indi 10.",
  ],
  sampleNotesEn: [
    "The sums are 1+2 = 3, 1+4 = 5, 7+2 = 9 and 7+4 = 11. The third in increasing order is 9.",
    "The only pair gives 5 + 5 = 10, so the first and only sum is 10.",
  ],
  testInputs: [
    "2 2 3\n1 7\n2 4\n",
    "1 1 1\n5\n5\n",
    "3 3 1\n1 2 3\n4 5 6\n",
    "3 3 9\n1 2 3\n4 5 6\n",
    "2 3 4\n1 2\n1 2 3\n",
    "2 2 2\n-5 5\n-5 5\n",
  ],
  sol: `long long n,m,k;cin>>n>>m>>k;
vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
priority_queue<tuple<long long,int,int>,vector<tuple<long long,int,int>>,greater<tuple<long long,int,int>>>pq;
set<pair<int,int>>seen;
pq.push(make_tuple(a[0]+b[0],0,0));
seen.insert(make_pair(0,0));
long long ans=0;
for(long long step=0;step<k;++step){
 long long s;int i,j;
 tie(s,i,j)=pq.top();pq.pop();
 ans=s;
 if(i+1<n&&!seen.count(make_pair(i+1,j))){
  seen.insert(make_pair(i+1,j));
  pq.push(make_tuple(a[i+1]+b[j],i+1,j));}
 if(j+1<m&&!seen.count(make_pair(i,j+1))){
  seen.insert(make_pair(i,j+1));
  pq.push(make_tuple(a[i]+b[j+1],i,j+1));}}
cout<<ans<<"\\n";`,
  wrongNote: "Looking only at the sums that pair one array's first element with the other's misses every sum built from two middling entries; stopping the heap one pop early reports the sum before the one asked for.",
  wrong: [
    `long long n,m,k;cin>>n>>m>>k;
vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
vector<long long>v;
for(long long i=0;i<n;++i)v.push_back(a[i]+b[0]);
for(long long j=0;j<m;++j)v.push_back(a[0]+b[j]);
sort(v.begin(),v.end());
cout<<v[k-1]<<"\\n";`,
    `long long n,m,k;cin>>n>>m>>k;
vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
priority_queue<tuple<long long,int,int>,vector<tuple<long long,int,int>>,greater<tuple<long long,int,int>>>pq;
set<pair<int,int>>seen;
pq.push(make_tuple(a[0]+b[0],0,0));
seen.insert(make_pair(0,0));
long long ans=0;
for(long long step=0;step+1<k;++step){
 long long s;int i,j;
 tie(s,i,j)=pq.top();pq.pop();
 ans=s;
 if(i+1<n&&!seen.count(make_pair(i+1,j))){
  seen.insert(make_pair(i+1,j));
  pq.push(make_tuple(a[i+1]+b[j],i+1,j));}
 if(j+1<m&&!seen.count(make_pair(i,j+1))){
  seen.insert(make_pair(i,j+1));
  pq.push(make_tuple(a[i]+b[j+1],i,j+1));}}
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C441", judge: "graph-functional-longest-cycle", topic: "graphs", rating: 2100,
  tag: "Functional graph", timeLimitMs: 2000,
  uz: "Funksional grafdagi eng uzun sikl",
  en: "The longest cycle of a functional graph",
  statementUz: "n ta uchning har biridan aynan bitta yo‘naltirilgan qirra chiqadi: i-uchdan f_i uchga. Bunday grafda har qanday yurish albatta biror siklga tushadi. Eng uzun siklning uzunligini toping; uzunlik sikldagi uchlar soni bilan o‘lchanadi. O‘z-o‘ziga ishora qiluvchi uch uzunligi 1 bo‘lgan sikl hosil qiladi.",
  statementEn: "Each of n vertices has exactly one outgoing directed edge: from vertex i to vertex f_i. In such a graph any walk must eventually fall into a cycle. Find the length of the longest cycle, measured by the number of vertices on it. A vertex pointing at itself forms a cycle of length 1.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta f_i qiymati keladi.",
  inputEn: "The first line contains one integer n. The second line contains the n values f_i.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun sikldagi uchlar soni.",
  outputEn: "Print a single integer — the number of vertices on the longest cycle.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ f_i ≤ n", "every vertex has exactly one outgoing edge", "a vertex pointing at itself is a cycle of length 1", "the graph always contains at least one cycle"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ f_i ≤ n", "har bir uchdan aynan bitta qirra chiqadi", "o‘ziga ishora qiluvchi uch uzunligi 1 bo‘lgan sikl", "grafda har doim kamida bitta sikl bo‘ladi"],
  sampleInputs: ["4\n2 1 4 3\n", "3\n2 3 1\n"],
  expect: ["2\n", "3\n"],
  sampleNotesUz: [
    "Ikkita sikl bor: 1 → 2 → 1 va 3 → 4 → 3. Ikkalasining uzunligi 2, shuning uchun javob 2.",
    "Uchala uch bitta siklda: 1 → 2 → 3 → 1. Uzunlik 3.",
  ],
  sampleNotesEn: [
    "There are two cycles, 1 → 2 → 1 and 3 → 4 → 3. Both have length 2, so the answer is 2.",
    "All three vertices lie on one cycle, 1 → 2 → 3 → 1, of length 3.",
  ],
  testInputs: ["4\n2 1 4 3\n", "3\n2 3 1\n", "1\n1\n", "5\n2 3 1 3 4\n", "6\n2 1 4 5 6 4\n", "2\n1 2\n"],
  sol: `int n;cin>>n;vector<int>f(n);
for(int i=0;i<n;++i){cin>>f[i];--f[i];}
vector<int>state(n,0),ord(n,0);
long long best=0;
for(int s=0;s<n;++s){
 if(state[s])continue;
 int v=s,step=0;
 vector<int>path;
 while(state[v]==0){state[v]=1;ord[v]=step++;path.push_back(v);v=f[v];}
 if(state[v]==1){long long len=step-ord[v];if(len>best)best=len;}
 for(int u:path)state[u]=2;}
cout<<best<<"\\n";`,
  wrongNote: "Reporting how many cycles the graph holds answers a different question than how long the longest one is; walking forward from each vertex until a repeat counts the tail leading into the cycle along with the cycle itself.",
  wrong: [
    `int n;cin>>n;vector<int>f(n);
for(int i=0;i<n;++i){cin>>f[i];--f[i];}
vector<int>state(n,0),ord(n,0);
long long cycles=0;
for(int s=0;s<n;++s){
 if(state[s])continue;
 int v=s,step=0;
 vector<int>path;
 while(state[v]==0){state[v]=1;ord[v]=step++;path.push_back(v);v=f[v];}
 if(state[v]==1)++cycles;
 for(int u:path)state[u]=2;}
cout<<cycles<<"\\n";`,
    `int n;cin>>n;vector<int>f(n);
for(int i=0;i<n;++i){cin>>f[i];--f[i];}
long long best=0;
for(int s=0;s<n;++s){
 vector<char>seen(n,0);
 int v=s;long long len=0;
 while(!seen[v]){seen[v]=1;++len;v=f[v];}
 if(len>best)best=len;}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C442", judge: "adv-kth-smallest-subarray-sum", topic: "advanced-cp", rating: 2200,
  tag: "Binary search with two pointers", timeLimitMs: 2000,
  uz: "Qism massiv yig‘indilarining k-kichigi",
  en: "The k-th smallest subarray sum",
  statementUz: "Sizga n ta manfiy bo‘lmagan sondan iborat massiv berilgan. Uning barcha bo‘sh bo‘lmagan ketma-ket qismlarining yig‘indilarini o‘sish tartibida yozsak, ularning k-chisi qanday bo‘lishini toping. Qismlar soni n(n + 1)/2 ga teng va teng yig‘indilar alohida sanaladi. Elementlar manfiy emas va k mavjud qismlar sonidan oshmaydi.",
  statementEn: "You are given an array of n non-negative integers. Writing the sums of all its non-empty consecutive stretches in increasing order, find what the k-th of them is. There are n(n + 1)/2 such stretches and equal sums are listed separately. The elements are non-negative and k never exceeds the number of stretches available.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta manfiy bo‘lmagan son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n non-negative integers.",
  outputUz: "Yagona butun sonni chiqaring — qism massiv yig‘indilarining o‘sish tartibidagi k-chisi.",
  outputEn: "Print a single integer — the k-th smallest sum over the consecutive stretches.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ n(n + 1)/2, which reaches 5·10^9 and needs a 64-bit type", "0 ≤ a_i ≤ 10^9", "the stretches must be consecutive and non-empty", "the answer reaches 10^14"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ n(n + 1)/2, bu 5·10^9 ga yetadi va 64-bitli turni talab qiladi", "0 ≤ a_i ≤ 10^9", "qismlar ketma-ket va bo‘sh bo‘lmasligi shart", "javob 10^14 ga yetadi"],
  sampleInputs: ["4 3\n1 2 3 4\n", "1 1\n5\n"],
  expect: ["3\n", "5\n"],
  sampleNotesUz: [
    "Barcha yig‘indilar o‘sish tartibida: 1, 2, 3, 3, 4, 5, 6, 7, 9, 10. Uchinchisi 3 — bu yakka turgan 3 ning o‘zi yoki 1 + 2 bo‘lishi mumkin, ikkalasi ham alohida sanaladi.",
    "Yagona qism butun massivning o‘zi, uning yig‘indisi 5.",
  ],
  sampleNotesEn: [
    "In increasing order the sums read 1, 2, 3, 3, 4, 5, 6, 7, 9, 10. The third is 3, which may be the lone 3 or the stretch 1 + 2, both counted separately.",
    "The only stretch is the whole array, whose sum is 5.",
  ],
  testInputs: [
    "4 3\n1 2 3 4\n",
    "1 1\n5\n",
    "3 6\n1 1 1\n",
    "3 1\n0 0 0\n",
    "5 15\n1 2 3 4 5\n",
    "2 2\n1000000000 1000000000\n",
  ],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long lo=0,hi=0;
for(long long x:a)hi+=x;
auto cnt=[&](long long lim){long long c=0,cur=0;long long l=0;
 for(long long r=0;r<n;++r){
  cur+=a[r];
  while(cur>lim){cur-=a[l];++l;}
  c+=r-l+1;}
 return c;};
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(cnt(mid)>=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  wrongNote: "Counting the stretches that stay strictly below a candidate shifts the search one value past the answer; looking only at the stretches that begin at the very first element leaves out almost all of them.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long lo=0,hi=0;
for(long long x:a)hi+=x;
auto cnt=[&](long long lim){long long c=0,cur=0;long long l=0;
 for(long long r=0;r<n;++r){
  cur+=a[r];
  while(cur>=lim&&l<=r){cur-=a[l];++l;}
  c+=r-l+1;}
 return c;};
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(cnt(mid)>=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>v;long long cur=0;
for(long long r=0;r<n;++r){cur+=a[r];v.push_back(cur);}
sort(v.begin(),v.end());
cout<<v[min((long long)v.size(),k)-1]<<"\\n";`,
  ],
});

export default P;
