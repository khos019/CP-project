/* Batch 473 — ten problems, A473–C482.
 *
 * Temperatures and sorting at the bottom, a min-cut-free flow substitute and
 * a suffix-automaton-free counting at the top; C481 and C482 are insane.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A473", judge: "array-count-sign-changes", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Ishora necha marta almashadi",
  en: "How often the sign flips",
  statementUz: "Sizga n ta nolga teng bo‘lmagan butun sondan iborat massiv berilgan. Qo‘shni elementlarning ishorasi necha marta almashishini sanang: ya'ni musbatdan manfiyga yoki manfiydan musbatga o‘tish nechta joyda sodir bo‘ladi. Massivda nol uchramaydi, shuning uchun har bir element aniq musbat yoki aniq manfiy bo‘ladi. Uzunligi 1 bo‘lgan massivda almashish bo‘lmaydi.",
  statementEn: "You are given an array of n non-zero integers. Count how many times the sign flips between neighbouring elements — that is, at how many places the array goes from positive to negative or from negative to positive. No element is zero, so each one is clearly positive or clearly negative. An array of length 1 has no flip.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta nolga teng bo‘lmagan butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n non-zero integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — ishora almashgan joylar soni.",
  outputEn: "Print a single integer — the number of places where the sign flips.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9 and a_i ≠ 0", "only neighbouring pairs are compared", "an array of one element answers 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9 va a_i ≠ 0", "faqat qo‘shni juftliklar solishtiriladi", "bitta elementli massiv uchun javob 0"],
  sampleInputs: ["5\n1 -2 3 4 -5\n", "3\n1 2 3\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Almashishlar 1 dan −2 ga, −2 dan 3 ga va 4 dan −5 ga o‘tishda sodir bo‘ladi — uchta joyda. 3 dan 4 ga o‘tishda ikkalasi ham musbat.",
    "Barcha elementlar musbat, shuning uchun ishora umuman almashmaydi.",
  ],
  sampleNotesEn: [
    "The flips happen from 1 to −2, from −2 to 3 and from 4 to −5 — three places. Going from 3 to 4 both stay positive.",
    "Every element is positive, so the sign never flips at all.",
  ],
  testInputs: ["5\n1 -2 3 4 -5\n", "3\n1 2 3\n", "1\n-7\n", "2\n-1 1\n", "4\n-1 -2 -3 -4\n", "6\n1 -1 1 -1 1 -1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(int i=1;i<n;++i)if((a[i]>0)!=(a[i-1]>0))++c;
cout<<c<<"\\n";`,
  wrongNote: "Counting the negative elements says how many there are, not how often the sign turns over; counting only the drops from positive to negative leaves out every crossing in the other direction.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(int i=0;i<n;++i)if(a[i]<0)++c;
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(int i=1;i<n;++i)if(a[i-1]>0&&a[i]<0)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A474", judge: "sort-second-smallest-distinct", topic: "sorting", rating: 1000,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Ikkinchi eng kichik har xil qiymat",
  en: "The second smallest distinct value",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Undagi har xil qiymatlar orasidan ikkinchi eng kichigini toping. Takrorlanishlar hisobga olinmaydi: masalan 1 1 2 massivida eng kichik har xil qiymat 1, ikkinchisi esa 2. Agar massivda ikkitadan kam har xil qiymat bo‘lsa, NONE deb chiqaring.",
  statementEn: "You are given an array of n integers. Among its distinct values, find the second smallest. Repeats do not count: in the array 1 1 2, for instance, the smallest distinct value is 1 and the second is 2. If the array holds fewer than two distinct values, print NONE.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Ikkinchi eng kichik har xil qiymatni chiqaring, yoki bunday qiymat bo‘lmasa NONE deb yozing.",
  outputEn: "Print the second smallest distinct value, or NONE if there is no such value.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "repeated values count as one", "fewer than two distinct values answers NONE"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "takrorlangan qiymatlar bitta deb sanaladi", "ikkitadan kam har xil qiymat bo‘lsa javob NONE"],
  sampleInputs: ["5\n3 1 4 1 5\n", "3\n7 7 7\n"],
  expect: ["3\n", "NONE\n"],
  sampleNotesUz: [
    "Har xil qiymatlar 1, 3, 4 va 5. Ularning eng kichigi 1, ikkinchisi esa 3.",
    "Massivda faqat bitta har xil qiymat bor, shuning uchun ikkinchisi yo‘q va javob NONE.",
  ],
  sampleNotesEn: [
    "The distinct values are 1, 3, 4 and 5. The smallest is 1 and the second is 3.",
    "The array holds a single distinct value, so there is no second one and the answer is NONE.",
  ],
  testInputs: ["5\n3 1 4 1 5\n", "3\n7 7 7\n", "1\n5\n", "2\n2 1\n", "4\n-5 -5 -3 -3\n", "3\n1000000000 -1000000000 0\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
a.erase(unique(a.begin(),a.end()),a.end());
if(a.size()<2){cout<<"NONE\\n";return 0;}
cout<<a[1]<<"\\n";`,
  wrongNote: "Taking the element at position two of the sorted array without removing the repeats returns the smallest value again whenever it occurs twice; comparing the array's own length against two ignores that the repeats were the problem.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
if(n<2){cout<<"NONE\\n";return 0;}
cout<<a[1]<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
if(n<2){cout<<"NONE\\n";return 0;}
a.erase(unique(a.begin(),a.end()),a.end());
if(a.size()<2){cout<<a[0]<<"\\n";return 0;}
cout<<a[1]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B475", judge: "math-count-primes-in-range", topic: "math", rating: 1200,
  tag: "Sieve", timeLimitMs: 1000,
  uz: "Oraliqdagi tub sonlar",
  en: "The primes inside the range",
  statementUz: "Sizga ikkita L va R chegarasi berilgan. L dan R gacha bo‘lgan oraliqda, ikkala chegarani ham qo‘shgan holda, nechta tub son borligini sanang. Tub son deganda faqat 1 ga va o‘ziga bo‘linadigan, birdan katta son tushuniladi; shuning uchun 1 tub emas, 2 esa tub. Ikkala chegara ham oraliqqa kiradi va oraliqda tub son umuman bo‘lmasligi mumkin.",
  statementEn: "You are given two bounds L and R. Count the primes in the range from L to R, both bounds included. A prime is a number above one divisible only by 1 and itself, so 1 is not prime while 2 is. Both bounds belong to the range, and the range may hold no prime at all.",
  inputUz: "Yagona qatorda ikkita L va R butun soni beriladi.",
  inputEn: "The only line contains two integers L and R.",
  outputUz: "Yagona butun sonni chiqaring — [L, R] oralig‘idagi tub sonlar soni.",
  outputEn: "Print a single integer — the number of primes in the range [L, R].",
  constraintList: ["1 ≤ L ≤ R ≤ 10^6", "both bounds belong to the range", "1 is not a prime", "2 is the smallest prime"],
  constraintListUz: ["1 ≤ L ≤ R ≤ 10^6", "ikkala chegara ham oraliqqa kiradi", "1 tub son emas", "2 eng kichik tub son"],
  sampleInputs: ["1 10\n", "8 10\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "1 dan 10 gacha tub sonlar 2, 3, 5 va 7 — to‘rtta. 1 tub emas, 4, 6, 8, 9 va 10 esa tarkibiy sonlar.",
    "8, 9 va 10 ning hammasi tarkibiy son, shuning uchun oraliqda tub son yo‘q.",
  ],
  sampleNotesEn: [
    "The primes from 1 to 10 are 2, 3, 5 and 7 — four of them. The 1 is not prime and 4, 6, 8, 9 and 10 are composite.",
    "All of 8, 9 and 10 are composite, so the range holds no prime.",
  ],
  testInputs: ["1 10\n", "8 10\n", "2 2\n", "1 1\n", "1 1000000\n", "999983 1000000\n"],
  sol: `long long L,R;cin>>L>>R;
vector<char>comp(R+1,0);
if(R>=0)comp[0]=1;
if(R>=1)comp[1]=1;
for(long long i=2;i*i<=R;++i){
 if(comp[i])continue;
 for(long long j=i*i;j<=R;j+=i)comp[j]=1;}
long long c=0;
for(long long v=L;v<=R;++v)if(!comp[v])++c;
cout<<c<<"\\n";`,
  wrongNote: "Leaving 1 unmarked lets it slip into the count as a prime; starting the crossing-out at twice the prime rather than its square is still correct, but starting it at the prime itself strikes the prime out too.",
  wrong: [
    `long long L,R;cin>>L>>R;
vector<char>comp(R+1,0);
if(R>=0)comp[0]=1;
for(long long i=2;i*i<=R;++i){
 if(comp[i])continue;
 for(long long j=i*i;j<=R;j+=i)comp[j]=1;}
long long c=0;
for(long long v=L;v<=R;++v)if(!comp[v])++c;
cout<<c<<"\\n";`,
    `long long L,R;cin>>L>>R;
vector<char>comp(R+1,0);
if(R>=0)comp[0]=1;
if(R>=1)comp[1]=1;
for(long long i=2;i*i<=R;++i){
 if(comp[i])continue;
 for(long long j=i;j<=R;j+=i)comp[j]=1;}
long long c=0;
for(long long v=L;v<=R;++v)if(!comp[v])++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B476", judge: "str-longest-word-chain-prefix", topic: "strings", rating: 1400,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Boshlanmaga mos so‘zlar",
  en: "The words that match the opening",
  statementUz: "Sizga n ta so‘z va bitta p boshlanmasi berilgan. Shu boshlanma bilan boshlanadigan so‘zlar orasidan alifbo bo‘yicha eng kichigini toping. Boshlanma so‘zning o‘zi bilan teng bo‘lishi ham mumkin, ya'ni bunday so‘z ham mos hisoblanadi. Birorta mos so‘z bo‘lmasa, NONE deb chiqaring.",
  statementEn: "You are given n words and a prefix p. Among the words that begin with that prefix, find the alphabetically smallest one. The prefix has to match from the very first letter, so a word that merely contains it somewhere in the middle does not count. The prefix may equal the word itself, in which case that word still matches. If no word matches at all, print NONE.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorda so‘zlar, oxirgi qatorda esa p boshlanmasi keladi.",
  inputEn: "The first line contains one integer n. The next n lines hold the words and the last line holds the prefix p.",
  outputUz: "Mos so‘zlar orasidan alifbo bo‘yicha eng kichigini chiqaring, yoki bunday so‘z bo‘lmasa NONE deb yozing.",
  outputEn: "Print the alphabetically smallest matching word, or NONE if there is none.",
  constraintList: ["1 ≤ n ≤ 10^4", "each word and the prefix are between 1 and 100 lowercase letters", "a word equal to the prefix still matches", "the prefix must match from the very first letter"],
  constraintListUz: ["1 ≤ n ≤ 10^4", "har bir so‘z va boshlanma 1 dan 100 gacha kichik harfdan iborat", "boshlanmaga teng so‘z ham mos hisoblanadi", "boshlanma so‘zning eng birinchi harfidan mos kelishi shart"],
  sampleInputs: ["4\nalgoritm\nalgebra\nbolalar\nalfa\nal\n", "2\nbir\nikki\nuch\n"],
  expect: ["alfa\n", "NONE\n"],
  sampleNotesUz: [
    "al bilan boshlanadigan so‘zlar: algoritm, algebra va alfa. Alifbo bo‘yicha eng kichigi alfa, chunki alf qismi alg dan oldin keladi.",
    "bir ham, ikki ham uch bilan boshlanmaydi, shuning uchun mos so‘z yo‘q.",
  ],
  sampleNotesEn: [
    "The words starting with al are algoritm, algebra and alfa. Alphabetically the smallest is alfa, since alf comes before alg.",
    "Neither bir nor ikki begins with uch, so nothing matches.",
  ],
  testInputs: [
    "4\nalgoritm\nalgebra\nbolalar\nalfa\nal\n",
    "2\nbir\nikki\nuch\n",
    "1\nabc\nabc\n",
    "3\nab\nabc\nabcd\nab\n",
    "3\nzz\nza\nzb\nz\n",
    "2\nab\nba\nc\n",
    "2\naab\nabc\nab\n",
    "1\nxab\nab\n",
  ],
  sol: `int n;cin>>n;vector<string>w(n);for(auto&x:w)cin>>x;
string p;cin>>p;
string best="";bool found=false;
for(const string&s:w){
 if(s.size()<p.size())continue;
 if(s.compare(0,p.size(),p)!=0)continue;
 if(!found||s<best){best=s;found=true;}}
cout<<(found?best:"NONE")<<"\\n";`,
  wrongNote: "Looking for the prefix anywhere inside the word accepts one where it starts in the middle; taking the first match in input order rather than the alphabetically smallest depends on how the words happen to be listed.",
  wrong: [
    `int n;cin>>n;vector<string>w(n);for(auto&x:w)cin>>x;
string p;cin>>p;
string best="";bool found=false;
for(const string&s:w){
 if(s.find(p)==string::npos)continue;
 if(!found||s<best){best=s;found=true;}}
cout<<(found?best:"NONE")<<"\\n";`,
    `int n;cin>>n;vector<string>w(n);for(auto&x:w)cin>>x;
string p;cin>>p;
for(const string&s:w){
 if(s.size()<p.size())continue;
 if(s.compare(0,p.size(),p)!=0)continue;
 cout<<s<<"\\n";return 0;}
cout<<"NONE\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B477", judge: "two-pointers-longest-sum-at-most", topic: "two-pointers", rating: 1500,
  tag: "Sliding window", timeLimitMs: 1000,
  uz: "Yig‘indisi s dan oshmaydigan eng uzun qism",
  en: "The longest stretch whose sum stays within s",
  statementUz: "Sizga n ta musbat butun sondan iborat massiv va s chegarasi berilgan. Ketma-ket turgan shunday eng uzun qismni toping-ki, undagi elementlarning yig‘indisi s dan oshmasin, va uning uzunligini chiqaring. Birorta element ham s ga sig‘masa, javob 0 bo‘ladi. Yig‘indi aynan s ga teng bo‘lishi mumkin va qism ketma-ket elementlardan tuzilishi shart.",
  statementEn: "You are given an array of n positive integers and a bound s. Find the longest stretch of consecutive elements whose sum does not exceed s, and print its length. If not even a single element fits within s, the answer is 0. The sum may equal s exactly, and the stretch must be made of consecutive elements.",
  inputUz: "Birinchi qatorda ikkita n va s butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat son keladi.",
  inputEn: "The first line contains two integers n and s. The second line contains n positive integers.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi s dan oshmaydigan eng uzun qismning uzunligi.",
  outputEn: "Print a single integer — the length of the longest stretch whose sum stays within s.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ s ≤ 10^14", "1 ≤ a_i ≤ 10^9", "the sum may equal s but not exceed it", "the answer is 0 when no single element fits"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ s ≤ 10^14", "1 ≤ a_i ≤ 10^9", "yig‘indi s ga teng bo‘lishi mumkin, undan oshmasligi kerak", "birorta element sig‘masa javob 0"],
  sampleInputs: ["5 7\n2 1 3 4 1\n", "3 1\n5 6 7\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Dastlabki uchta element 2 + 1 + 3 = 6 bo‘lib 7 ga sig‘adi. To‘rtinchisini qo‘shsak 10 chiqib ketadi, undan keyingi 3 + 4 = 7 esa faqat ikkita element beradi. Javob 3.",
    "Eng kichik element 5 bo‘lib, u ham 1 dan katta. Shuning uchun birorta qism sig‘maydi va javob 0.",
  ],
  sampleNotesEn: [
    "The first three elements give 2 + 1 + 3 = 6, which fits within 7. Adding the fourth reaches 10, and the later 3 + 4 = 7 holds only two elements, so the answer is 3.",
    "The smallest element is 5, already above 1, so no stretch fits and the answer is 0.",
  ],
  testInputs: ["5 7\n2 1 3 4 1\n", "3 1\n5 6 7\n", "1 5\n5\n", "1 4\n5\n", "5 100\n1 2 3 4 5\n", "4 6\n3 3 3 3\n", "6 5\n2 2 1 1 1 1\n"],
  sol: `long long n,s;cin>>n>>s;vector<long long>a(n);for(auto&x:a)cin>>x;
long long l=0,cur=0,best=0;
for(long long r=0;r<n;++r){
 cur+=a[r];
 while(cur>s){cur-=a[l];++l;}
 if(r-l+1>best)best=r-l+1;}
cout<<best<<"\\n";`,
  wrongNote: "Shrinking while the sum merely reaches s rejects a stretch that fills the bound exactly; restarting the window at the offending element throws away the tail of it that was still usable.",
  wrong: [
    `long long n,s;cin>>n>>s;vector<long long>a(n);for(auto&x:a)cin>>x;
long long l=0,cur=0,best=0;
for(long long r=0;r<n;++r){
 cur+=a[r];
 while(cur>=s&&l<=r){cur-=a[l];++l;}
 if(r-l+1>best)best=r-l+1;}
cout<<best<<"\\n";`,
    `long long n,s;cin>>n>>s;vector<long long>a(n);for(auto&x:a)cin>>x;
long long cur=0,len=0,best=0;
for(long long r=0;r<n;++r){
 if(cur+a[r]>s){cur=a[r];len=1;}
 else{cur+=a[r];++len;}
 if(cur>s){cur=0;len=0;}
 if(len>best)best=len;}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B478", judge: "dp-count-tilings-2xn", topic: "dynamic-programming", rating: 1700,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "2 × n maydonni qoplash",
  en: "Tiling a 2 by n board",
  statementUz: "2 satr va n ustundan iborat maydonni 1 × 2 o‘lchamli plitkalar bilan to‘liq qoplash kerak. Plitkani yotiq yoki tik qo‘yish mumkin, ular bir-birining ustiga tushmasligi va maydondan chiqmasligi shart. Qoplash usullari nechtaligini 10^9 + 7 modul bo‘yicha sanang. Maydon aniq qoplanadi — ortiqcha plitka ham, qoplanmagan katak ham qolmaydi — va usullar soni tez o‘sadi.",
  statementEn: "A board of 2 rows and n columns must be covered completely by tiles of size 1 by 2. A tile may lie flat or stand upright, and the tiles may not overlap or hang off the board. Count the ways to cover it, modulo 10^9 + 7. The board is covered exactly, with no tile left over and no square uncovered, and the number of ways grows quickly.",
  inputUz: "Yagona qatorda bitta n butun soni beriladi.",
  inputEn: "The only line contains one integer n.",
  outputUz: "Yagona butun sonni chiqaring — qoplash usullari sonining 10^9 + 7 bo‘yicha qoldig‘i.",
  outputEn: "Print a single integer — the number of tilings, modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^6", "the tiles are 1 by 2 and may be laid either way", "the board must be covered completely with no overlap", "the answer is reported modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ n ≤ 10^6", "plitkalar 1 × 2 va ikkala yo‘nalishda qo‘yilishi mumkin", "maydon ustma-ustliksiz to‘liq qoplanishi shart", "javob 10^9 + 7 modul bo‘yicha chiqariladi"],
  sampleInputs: ["3\n", "1\n"],
  expect: ["3\n", "1\n"],
  sampleNotesUz: [
    "2 × 3 maydonni uchta usulda qoplash mumkin: uchta tik plitka; yoki chapda tik, o‘ngda ikkita yotiq; yoki chapda ikkita yotiq, o‘ngda tik.",
    "2 × 1 maydonga faqat bitta tik plitka sig‘adi, shuning uchun yagona usul bor.",
  ],
  sampleNotesEn: [
    "A 2 by 3 board can be covered three ways: three upright tiles; an upright one on the left with two flat ones on the right; or two flat ones on the left with an upright one on the right.",
    "A 2 by 1 board takes exactly one upright tile, so there is a single way.",
  ],
  testInputs: ["3\n", "1\n", "2\n", "5\n", "1000000\n", "10\n"],
  sol: `long long n;cin>>n;const long long M=1000000007;
long long a=1,b=1;
for(long long i=2;i<=n;++i){long long c=(a+b)%M;a=b;b=c;}
cout<<b<<"\\n";`,
  wrongNote: "Counting the tilings as two to the power of the width treats every column as independent, which the flat tiles are not; starting the recurrence one step along shifts every answer to the next term of the sequence.",
  wrong: [
    `long long n;cin>>n;const long long M=1000000007;
long long r=1;
for(long long i=0;i<n;++i)r=r*2%M;
cout<<r<<"\\n";`,
    `long long n;cin>>n;const long long M=1000000007;
long long a=1,b=2;
for(long long i=2;i<=n;++i){long long c=(a+b)%M;a=b;b=c;}
cout<<b<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "B479", judge: "grid-shortest-with-one-wall-break", topic: "graphs", rating: 1900,
  tag: "Layered breadth-first search", timeLimitMs: 2000,
  uz: "Bitta devorni buzib o‘tish",
  en: "Breaking through one wall",
  statementUz: "Sizga n satr va m ustundan iborat labirint berilgan; 0 bo‘sh katak, 1 esa devor. Chap yuqori katakdan o‘ng quyi katakka yon tomonlar bo‘ylab yurib borish kerak va yo‘l davomida ko‘pi bilan bitta devorni buzib o‘tishga ruxsat beriladi. Eng kam qadamlar sonini toping; qadam deganda bir katakdan qo‘shnisiga o‘tish tushuniladi. Borib bo‘lmasa, −1 chiqaring.",
  statementEn: "You are given a maze of n rows and m columns, where 0 is an empty cell and 1 is a wall. You must walk from the top-left cell to the bottom-right one, moving between side-by-side cells, and along the way you may break through at most one wall. Find the fewest steps, a step being a move from one cell to a neighbour. If the trip is impossible, print −1.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi n qatorning har birida probel bilan ajratilgan m ta son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next n lines contains m numbers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng kam qadamlar soni, yoki borib bo‘lmasa −1.",
  outputEn: "Print a single integer — the fewest steps, or −1 if the trip is impossible.",
  constraintList: ["1 ≤ n, m ≤ 500", "each cell is 0 or 1", "at most one wall may be broken, and breaking none is allowed", "movement is only between side-by-side cells", "the start and the end may themselves be walls"],
  constraintListUz: ["1 ≤ n, m ≤ 500", "har bir katak 0 yoki 1", "ko‘pi bilan bitta devor buziladi va umuman buzmaslik ham mumkin", "harakat faqat yon qo‘shni kataklar orasida bo‘ladi", "boshlanish va tugash kataklari ham devor bo‘lishi mumkin"],
  sampleInputs: ["3 3\n0 1 0\n0 1 0\n0 0 0\n", "2 2\n0 1\n1 0\n"],
  expect: ["4\n", "2\n"],
  sampleNotesUz: [
    "Devorga tegmasdan chap ustun bo‘ylab pastga tushib, so‘ng pastki satr bo‘ylab o‘ngga yurish mumkin: pastga, pastga, o‘ngga, o‘ngga — 4 qadam. Devorni buzsak ham yo‘l qisqarmaydi, shuning uchun javob 4.",
    "Yuqori o‘ngdagi devorni buzib o‘tamiz: o‘ngga va pastga — ikki qadamda o‘ng quyi katakka yetamiz. Devor buzmasdan bu katakka umuman borib bo‘lmaydi.",
  ],
  sampleNotesEn: [
    "Without touching a wall one can go down the left column and then along the bottom row: down, down, right, right — four steps. Breaking a wall saves nothing here, so the answer is 4.",
    "Breaking the wall at the top right gives right and then down — two steps to the bottom-right cell. Without a break that cell cannot be reached at all.",
  ],
  testInputs: [
    "3 3\n0 1 0\n0 1 0\n0 0 0\n",
    "2 2\n0 1\n1 0\n",
    "1 1\n0\n",
    "1 4\n0 1 1 0\n",
    "2 3\n0 0 0\n0 0 0\n",
    "3 3\n0 1 1\n1 1 1\n1 1 0\n",
  ],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
vector<vector<array<int,2>>>d(n,vector<array<int,2>>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j){d[i][j][0]=-1;d[i][j][1]=-1;}
deque<array<int,3>>q;
int startBroke=a[0][0];
d[0][0][startBroke]=0;q.push_back({0,0,startBroke});
int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
while(!q.empty()){
 array<int,3>c=q.front();q.pop_front();
 int x=c[0],y=c[1],b=c[2];
 for(int t=0;t<4;++t){
  int nx=x+dx[t],ny=y+dy[t];
  if(nx<0||ny<0||nx>=n||ny>=m)continue;
  int nb=b+a[nx][ny];
  if(nb>1)continue;
  if(d[nx][ny][nb]>=0)continue;
  d[nx][ny][nb]=d[x][y][b]+1;
  q.push_back({nx,ny,nb});}}
int best=-1;
for(int b=0;b<2;++b){
 if(d[n-1][m-1][b]<0)continue;
 if(best<0||d[n-1][m-1][b]<best)best=d[n-1][m-1][b];}
cout<<best<<"\\n";`,
  wrongNote: "Walking the maze without the wall budget refuses every route that needs the one break the statement grants; treating the walls as ordinary cells lets the route pass through as many of them as it likes.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
vector<vector<int>>d(n,vector<int>(m,-1));
if(a[0][0]){cout<<"-1\\n";return 0;}
deque<pair<int,int>>q;d[0][0]=0;q.push_back(make_pair(0,0));
int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
while(!q.empty()){
 pair<int,int>c=q.front();q.pop_front();
 for(int t=0;t<4;++t){
  int nx=c.first+dx[t],ny=c.second+dy[t];
  if(nx<0||ny<0||nx>=n||ny>=m)continue;
  if(a[nx][ny])continue;
  if(d[nx][ny]>=0)continue;
  d[nx][ny]=d[c.first][c.second]+1;q.push_back(make_pair(nx,ny));}}
cout<<d[n-1][m-1]<<"\\n";`,
    `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
cout<<((n-1)+(m-1))<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C480", judge: "segtree-range-min-queries", topic: "data-structures", rating: 2000,
  tag: "Segment tree", timeLimitMs: 2000,
  uz: "Oraliqdagi minimum va nuqtaviy o‘zgartirish",
  en: "Range minimum with point updates",
  statementUz: "Sizga n ta butun sondan iborat massiv va q ta so‘rov berilgan. Birinchi turdagi so‘rov i-elementni x qiymatiga almashtiradi. Ikkinchi turdagi so‘rov l dan r gacha bo‘lgan oraliqdagi eng kichik elementni so‘raydi. Har bir ikkinchi tur so‘rovining javobini alohida qatorda chiqaring. So‘rovlar ko‘p bo‘lgani uchun har birini oddiy sikl bilan bajarish yetarli sekin bo‘ladi.",
  statementEn: "You are given an array of n integers and q queries. A query of the first kind replaces the i-th element with x. A query of the second kind asks for the smallest element in the range from l to r. Print the answer to each query of the second kind on its own line. There are too many queries for a plain loop over each range to keep up.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Ikkinchi qatorda n ta son, keyingi q qatorda esa 1 i x yoki 2 l r ko‘rinishidagi so‘rovlar keladi.",
  inputEn: "The first line contains two integers n and q. The second line contains the n numbers, and each of the next q lines is either 1 i x or 2 l r.",
  outputUz: "Har bir ikkinchi tur so‘rovi uchun alohida qatorda o‘sha oraliqdagi eng kichik elementni chiqaring.",
  outputEn: "For each query of the second kind print the smallest element of that range on its own line.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ i ≤ n and 1 ≤ l ≤ r ≤ n", "−10^9 ≤ values and x ≤ 10^9", "a range may hold a single element"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ i ≤ n va 1 ≤ l ≤ r ≤ n", "−10^9 ≤ qiymatlar va x ≤ 10^9", "oraliq bitta elementdan iborat bo‘lishi mumkin"],
  sampleInputs: ["5 3\n5 2 4 1 3\n2 1 5\n1 4 9\n2 1 5\n", "1 1\n7\n2 1 1\n"],
  expect: ["1\n2\n", "7\n"],
  sampleNotesUz: [
    "Dastlab massiv 5 2 4 1 3 bo‘lib, eng kichigi 1. To‘rtinchi elementni 9 ga almashtirgach massiv 5 2 4 9 3 bo‘ladi va eng kichigi 2 ga ko‘tariladi.",
    "Massivda yagona element bor va so‘rov o‘shani so‘raydi, javob 7.",
  ],
  sampleNotesEn: [
    "At first the array is 5 2 4 1 3 and its smallest element is 1. After the fourth element becomes 9 the array reads 5 2 4 9 3 and the smallest rises to 2.",
    "The array holds a single element and the query asks about it, so the answer is 7.",
  ],
  testInputs: [
    "5 3\n5 2 4 1 3\n2 1 5\n1 4 9\n2 1 5\n",
    "1 1\n7\n2 1 1\n",
    "4 4\n1 2 3 4\n2 2 3\n1 1 0\n2 1 1\n2 1 4\n",
    "3 3\n-5 -5 -5\n2 1 3\n1 2 10\n2 1 3\n",
    "6 4\n4 4 4 4 4 4\n2 3 3\n1 3 -1\n2 1 6\n2 4 6\n",
    "2 3\n1000000000 -1000000000\n2 1 2\n1 2 1000000000\n2 1 2\n",
  ],
  sol: `int n,q;cin>>n>>q;
int sz=1;while(sz<n)sz*=2;
const long long INF=(long long)4e18;
vector<long long>t(2*sz,INF);
for(int i=0;i<n;++i)cin>>t[sz+i];
for(int i=sz-1;i>=1;--i)t[i]=min(t[2*i],t[2*i+1]);
string out;
for(int k=0;k<q;++k){int type;cin>>type;
 if(type==1){int i;long long x;cin>>i>>x;--i;
  int p=sz+i;t[p]=x;
  for(p/=2;p>=1;p/=2)t[p]=min(t[2*p],t[2*p+1]);}
 else{int l,r;cin>>l>>r;--l;--r;
  long long res=INF;
  int a=sz+l,b=sz+r+1;
  while(a<b){
   if(a&1)res=min(res,t[a++]);
   if(b&1)res=min(res,t[--b]);
   a/=2;b/=2;}
  out+=to_string(res);out+="\\n";}}
cout<<out;`,
  wrongNote: "Writing the new value into the leaf without carrying the change up the tree leaves every range above it answering with the old one; treating the right end as exclusive drops the last element of every range.",
  wrong: [
    `int n,q;cin>>n>>q;
int sz=1;while(sz<n)sz*=2;
const long long INF=(long long)4e18;
vector<long long>t(2*sz,INF);
for(int i=0;i<n;++i)cin>>t[sz+i];
for(int i=sz-1;i>=1;--i)t[i]=min(t[2*i],t[2*i+1]);
string out;
for(int k=0;k<q;++k){int type;cin>>type;
 if(type==1){int i;long long x;cin>>i>>x;--i;t[sz+i]=x;}
 else{int l,r;cin>>l>>r;--l;--r;
  long long res=INF;
  int a=sz+l,b=sz+r+1;
  while(a<b){
   if(a&1)res=min(res,t[a++]);
   if(b&1)res=min(res,t[--b]);
   a/=2;b/=2;}
  out+=to_string(res);out+="\\n";}}
cout<<out;`,
    `int n,q;cin>>n>>q;
int sz=1;while(sz<n)sz*=2;
const long long INF=(long long)4e18;
vector<long long>t(2*sz,INF);
for(int i=0;i<n;++i)cin>>t[sz+i];
for(int i=sz-1;i>=1;--i)t[i]=min(t[2*i],t[2*i+1]);
string out;
for(int k=0;k<q;++k){int type;cin>>type;
 if(type==1){int i;long long x;cin>>i>>x;--i;
  int p=sz+i;t[p]=x;
  for(p/=2;p>=1;p/=2)t[p]=min(t[2*p],t[2*p+1]);}
 else{int l,r;cin>>l>>r;--l;--r;
  long long res=INF;
  int a=sz+l,b=sz+r;
  while(a<b){
   if(a&1)res=min(res,t[a++]);
   if(b&1)res=min(res,t[--b]);
   a/=2;b/=2;}
  if(res>=INF)res=t[sz+l];
  out+=to_string(res);out+="\\n";}}
cout<<out;`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C481", judge: "adv-min-cost-assign-two-groups", topic: "advanced-cp", rating: 2200,
  tag: "Exchange argument", timeLimitMs: 2000,
  uz: "Ikki shaharga yuborish",
  en: "Sending everyone to one of two cities",
  statementUz: "2n ta nomzod bor; i-nomzodni birinchi shaharga yuborish a_i, ikkinchisiga yuborish esa b_i turadi. Har bir shaharga aynan n tadan nomzod yuborilishi shart. Umumiy xarajatni eng kichik qiladigan taqsimotni toping va o‘sha xarajatni chiqaring. Har bir nomzod aynan bitta shaharga boradi va bitta nomzod uchun ikkala narx teng bo‘lishi mumkin.",
  statementEn: "There are 2n candidates; sending candidate i to the first city costs a_i and to the second costs b_i. Exactly n candidates must go to each city. Find the assignment with the smallest total cost and print that cost. Every candidate goes to exactly one city, and the two costs for one candidate may be equal.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi 2n qatorning har birida a_i va b_i keladi.",
  inputEn: "The first line contains one integer n. Each of the next 2n lines contains a_i and b_i.",
  outputUz: "Yagona butun sonni chiqaring — eng kichik umumiy xarajat.",
  outputEn: "Print a single integer — the smallest total cost.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ a_i, b_i ≤ 10^9", "exactly n candidates go to each city", "the total reaches 2·10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ a_i, b_i ≤ 10^9", "har bir shaharga aynan n tadan nomzod yuboriladi", "jami 2·10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["2\n10 20\n30 200\n400 50\n30 20\n", "1\n5 5\n5 5\n"],
  expect: ["110\n", "10\n"],
  sampleNotesUz: [
    "Birinchi va ikkinchi nomzodni birinchi shaharga, uchinchi va to‘rtinchisini ikkinchisiga yuboramiz: 10 + 30 + 50 + 20 = 110. Boshqa taqsimotlar qimmatroq chiqadi.",
    "Ikkala nomzod uchun ham ikkala shahar bir xil turadi, shuning uchun qanday taqsimlasak ham jami 10 bo‘ladi.",
  ],
  sampleNotesEn: [
    "Sending the first two candidates to the first city and the last two to the second gives 10 + 30 + 50 + 20 = 110, and every other split costs more.",
    "Both cities cost the same for both candidates, so any split totals 10.",
  ],
  testInputs: [
    "2\n10 20\n30 200\n400 50\n30 20\n",
    "1\n5 5\n5 5\n",
    "1\n0 1000000000\n1000000000 0\n",
    "2\n1 1\n1 1\n1 1\n1 1\n",
    "3\n1 100\n2 100\n3 100\n100 1\n100 2\n100 3\n",
    "2\n5 1\n5 1\n5 1\n5 1\n",
  ],
  sol: `long long n;cin>>n;long long m=2*n;
vector<long long>a(m),b(m);
long long total=0;
for(long long i=0;i<m;++i){cin>>a[i]>>b[i];total+=a[i];}
vector<long long>gain(m);
for(long long i=0;i<m;++i)gain[i]=b[i]-a[i];
sort(gain.begin(),gain.end());
for(long long i=0;i<n;++i)total+=gain[i];
cout<<total<<"\\n";`,
  wrongNote: "Choosing the cheaper city for each candidate on its own ignores that each city must take exactly half of them; sorting by the second city's price rather than by what switching saves compares the wrong quantity.",
  wrong: [
    `long long n;cin>>n;long long m=2*n;
long long total=0;
for(long long i=0;i<m;++i){long long x,y;cin>>x>>y;total+=min(x,y);}
cout<<total<<"\\n";`,
    `long long n;cin>>n;long long m=2*n;
vector<pair<long long,long long>>v(m);
for(long long i=0;i<m;++i)cin>>v[i].second>>v[i].first;
sort(v.begin(),v.end());
long long total=0;
for(long long i=0;i<m;++i)total+=(i<n)?v[i].first:v[i].second;
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C482", judge: "adv-longest-repeated-substring-hash", topic: "advanced-cp", rating: 2300,
  tag: "Binary search with hashing", timeLimitMs: 2000,
  uz: "Ikki marta uchraydigan eng uzun qism",
  en: "The longest stretch that occurs twice",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Unda kamida ikki marta uchraydigan eng uzun qism satrning uzunligini toping. Uchrashlar ustma-ust tushishi ham mumkin, ya'ni aaa satrida aa ikki marta uchraydi. Bunday qism umuman bo‘lmasa, javob 0 bo‘ladi. Qism satr ketma-ket belgilardan tuzilishi shart va bitta harfli satr uchun javob 0.",
  statementEn: "You are given a string s of lowercase Latin letters. Find the length of the longest substring that occurs in it at least twice. The occurrences may overlap, so aa occurs twice in aaa. If no such substring exists the answer is 0. A substring must be made of consecutive characters, and a string of one letter answers 0.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — kamida ikki marta uchraydigan eng uzun qism satrning uzunligi.",
  outputEn: "Print a single integer — the length of the longest substring occurring at least twice.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the letters 'a'–'z'", "the two occurrences may overlap", "the answer is 0 when every substring is unique"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s 'a'–'z' harflaridan iborat", "ikkita uchrash ustma-ust tushishi mumkin", "har bir qism yagona bo‘lsa javob 0"],
  sampleInputs: ["banana\n", "abcd\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "ana qismi banana ichida ikki marta uchraydi — ikkinchi harfdan va to‘rtinchi harfdan boshlab, ular bir-biriga ustma-ust tushadi. Undan uzunrog‘i takrorlanmaydi.",
    "abcd ning barcha qismlari yagona, shuning uchun ikki marta uchraydigani yo‘q va javob 0.",
  ],
  sampleNotesEn: [
    "The stretch ana occurs twice in banana, starting at the second letter and at the fourth, and those two overlap. Nothing longer repeats.",
    "Every substring of abcd is unique, so nothing occurs twice and the answer is 0.",
  ],
  testInputs: ["banana\n", "abcd\n", "a\n", "aa\n", "aaaa\n", "abcabcabc\n"],
  sol: `string s;cin>>s;long long n=(long long)s.size();
const unsigned long long B=131;
vector<unsigned long long>h(n+1,0),pw(n+1,1);
for(long long i=0;i<n;++i){
 h[i+1]=h[i]*B+(unsigned long long)(s[i]-'a'+1);
 pw[i+1]=pw[i]*B;}
auto sub=[&](long long l,long long len){return h[l+len]-h[l]*pw[len];};
auto ok=[&](long long len){
 if(len==0)return true;
 unordered_set<unsigned long long>seen;
 seen.reserve((size_t)(n*2));
 for(long long l=0;l+len<=n;++l){
  unsigned long long v=sub(l,len);
  if(seen.count(v))return true;
  seen.insert(v);}
 return false;};
long long lo=0,hi=n-1;
while(lo<hi){long long mid=lo+(hi-lo+1)/2;
 if(ok(mid))lo=mid;else hi=mid-1;}
cout<<lo<<"\\n";`,
  wrongNote: "Requiring the two occurrences to stand apart rejects the overlapping pair the statement allows; comparing only the neighbouring stretches of each length misses a repeat that sits far away.",
  wrong: [
    `string s;cin>>s;long long n=(long long)s.size();
const unsigned long long B=131;
vector<unsigned long long>h(n+1,0),pw(n+1,1);
for(long long i=0;i<n;++i){
 h[i+1]=h[i]*B+(unsigned long long)(s[i]-'a'+1);
 pw[i+1]=pw[i]*B;}
auto sub=[&](long long l,long long len){return h[l+len]-h[l]*pw[len];};
auto ok=[&](long long len){
 if(len==0)return true;
 map<unsigned long long,long long>first;
 for(long long l=0;l+len<=n;++l){
  unsigned long long v=sub(l,len);
  map<unsigned long long,long long>::iterator it=first.find(v);
  if(it!=first.end()){if(l-it->second>=len)return true;}
  else first[v]=l;}
 return false;};
long long lo=0,hi=n-1;
while(lo<hi){long long mid=lo+(hi-lo+1)/2;
 if(ok(mid))lo=mid;else hi=mid-1;}
cout<<lo<<"\\n";`,
    `string s;cin>>s;long long n=(long long)s.size();
long long best=0;
for(long long len=1;len<n;++len){
 bool found=false;
 for(long long l=0;l+2*len<=n;++l)
  if(s.compare(l,len,s,l+len,len)==0){found=true;break;}
 if(found)best=len;}
cout<<best<<"\\n";`,
  ],
});

export default P;
