/* Batch 483 — ten problems, A483–C492.
 *
 * Rounding and roman-free counting at the bottom, a bitmask cover and a
 * weighted interval schedule at the top; C491 and C492 are insane.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A483", judge: "num-round-to-nearest-ten", topic: "programming-basics", rating: 800,
  tag: "Arithmetic", timeLimitMs: 1000,
  uz: "Eng yaqin o‘nlikka yaxlitlash",
  en: "Rounding to the nearest ten",
  statementUz: "Sizga manfiy bo‘lmagan n soni berilgan. Uni eng yaqin o‘nlikka yaxlitlang: oxirgi raqami 5 dan kichik bo‘lsa pastga, 5 yoki undan katta bo‘lsa yuqoriga yaxlitlanadi. Masalan 24 → 20, 25 → 30, 26 → 30. Son allaqachon o‘nlikka bo‘linsa, u o‘zgarishsiz qoladi.",
  statementEn: "You are given a non-negative number n. Round it to the nearest ten: down when its last digit is below 5 and up when the last digit is 5 or more. For instance 24 rounds to 20, while 25 and 26 both round to 30. A number whose last digit is already a zero is divisible by ten and stays exactly as it is.",
  inputUz: "Yagona qatorda bitta manfiy bo‘lmagan n butun soni beriladi.",
  inputEn: "The only line contains one non-negative integer n.",
  outputUz: "Yagona butun sonni chiqaring — n ning eng yaqin o‘nlikka yaxlitlangan qiymati.",
  outputEn: "Print a single integer — the value of n rounded to the nearest ten.",
  constraintList: ["0 ≤ n ≤ 10^18", "a last digit of exactly 5 rounds upwards", "the result is always divisible by ten", "the rounded value may exceed 10^18 and needs a 64-bit type"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "oxirgi raqami aynan 5 bo‘lsa yuqoriga yaxlitlanadi", "natija har doim o‘nga bo‘linadi", "yaxlitlangan qiymat 10^18 dan oshishi mumkin va 64-bitli turni talab qiladi"],
  sampleInputs: ["25\n", "24\n"],
  expect: ["30\n", "20\n"],
  sampleNotesUz: [
    "Oxirgi raqam 5, ya'ni yuqoriga yaxlitlanadi va 30 chiqadi.",
    "Oxirgi raqam 4 bo‘lib, u 5 dan kichik. Shuning uchun pastga yaxlitlanadi va 20 chiqadi.",
  ],
  sampleNotesEn: [
    "The last digit is 5, so the number rounds upwards to 30.",
    "The last digit is 4, which is below 5, so the number rounds down to 20.",
  ],
  testInputs: ["25\n", "24\n", "0\n", "5\n", "20\n", "999999999999999999\n"],
  sol: `long long n;cin>>n;
long long r=n%10;
cout<<((r<5)?(n-r):(n-r+10))<<"\\n";`,
  wrongNote: "Rounding a last digit of exactly 5 downwards contradicts the rule the statement gives; dividing and multiplying by ten always rounds towards zero and never up.",
  wrong: [
    `long long n;cin>>n;
long long r=n%10;
cout<<((r<=5)?(n-r):(n-r+10))<<"\\n";`,
    `long long n;cin>>n;
cout<<(n/10*10)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A484", judge: "array-count-distinct-pairs-equal", topic: "foundations", rating: 1000,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Teng juftliklar soni",
  en: "The number of equal pairs",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Shunday (i, j) pozitsiyalar juftligi nechtaligini sanang-ki, i < j bo‘lsin va a_i = a_j tengligi bajarilsin. Juftlik qiymat bilan emas, ikkita pozitsiya bilan aniqlanadi, ya'ni ko‘p joyda turgan qiymat ko‘p juftlik hosil qiladi. Barcha juftliklarni birma-bir tekshirish eng katta kirishlarda ulgurmaydi.",
  statementEn: "You are given an array of n integers. Count the pairs of positions (i, j) with i < j and a_i = a_j. The pair is named by two positions rather than by a value, so a value standing in many places forms many pairs. Checking every pair one at a time is too slow for the largest inputs.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — teng elementli juftliklar soni.",
  outputEn: "Print a single integer — the number of pairs holding equal elements.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the pair is unordered, so i < j is required", "the answer reaches 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "juftlik tartibsiz, shuning uchun i < j talab qilinadi", "javob 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n1 2 1 2 1\n", "3\n1 2 3\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "1 uch marta uchraydi va 3 ta juftlik beradi, 2 esa ikki marta uchrab 1 ta juftlik beradi. Jami 4.",
    "Barcha qiymatlar har xil, shuning uchun teng juftlik yo‘q.",
  ],
  sampleNotesEn: [
    "The value 1 occurs three times and gives 3 pairs, while 2 occurs twice and gives 1. That is 4 in all.",
    "Every value is different, so there is no equal pair.",
  ],
  testInputs: ["5\n1 2 1 2 1\n", "3\n1 2 3\n", "1\n5\n", "4\n7 7 7 7\n", "6\n-1 -1 0 0 1 1\n", "5\n1000000000 1000000000 1000000000 1 2\n"],
  sol: `int n;cin>>n;map<long long,long long>cnt;
for(int i=0;i<n;++i){long long x;cin>>x;++cnt[x];}
long long t=0;
for(map<long long,long long>::iterator it=cnt.begin();it!=cnt.end();++it)
 t+=it->second*(it->second-1)/2;
cout<<t<<"\\n";`,
  wrongNote: "Counting each value's occurrences squared counts a position paired with itself and every pair twice over; counting only the equal neighbours misses the pairs standing apart.",
  wrong: [
    `int n;cin>>n;map<long long,long long>cnt;
for(int i=0;i<n;++i){long long x;cin>>x;++cnt[x];}
long long t=0;
for(map<long long,long long>::iterator it=cnt.begin();it!=cnt.end();++it)
 t+=it->second*it->second/2;
cout<<t<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long t=0;
for(int i=1;i<n;++i)if(a[i]==a[i-1])++t;
cout<<t<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B485", judge: "str-int-to-roman", topic: "strings", rating: 1200,
  tag: "Simulation", timeLimitMs: 1000,
  uz: "Rim raqamlariga aylantirish",
  en: "Writing a number in Roman numerals",
  statementUz: "Sizga 1 dan 3999 gacha bo‘lgan n soni berilgan. Uni rim raqamlarida yozing. Ishlatiladigan belgilar: I bir, V besh, X o‘n, L ellik, C yuz, D besh yuz, M ming. To‘rt va to‘qqizga o‘xshash sonlar ayirish shakli bilan yoziladi: IV, IX, XL, XC, CD va CM. Har doim eng katta mos keladigan qiymatdan boshlab yozib borish kerak.",
  statementEn: "You are given a number n between 1 and 3999. Write it in Roman numerals. The symbols are I for one, V for five, X for ten, L for fifty, C for a hundred, D for five hundred and M for a thousand. Numbers such as four and nine use the subtractive forms IV, IX, XL, XC, CD and CM. The writing always proceeds from the largest value that still fits.",
  inputUz: "Yagona qatorda bitta n butun soni beriladi.",
  inputEn: "The only line contains one integer n.",
  outputUz: "Yagona qatorda n ning rim raqamlaridagi yozuvini chiqaring.",
  outputEn: "Print the Roman numeral form of n on a single line.",
  constraintList: ["1 ≤ n ≤ 3999", "the subtractive forms IV, IX, XL, XC, CD and CM must be used", "the output uses capital letters only", "no symbol may repeat more than three times in a row"],
  constraintListUz: ["1 ≤ n ≤ 3999", "IV, IX, XL, XC, CD va CM ayirish shakllari ishlatilishi shart", "javob faqat bosh harflarda yoziladi", "hech bir belgi ketma-ket uch martadan ko‘p takrorlanmaydi"],
  sampleInputs: ["1994\n", "4\n"],
  expect: ["MCMXCIV\n", "IV\n"],
  sampleNotesUz: [
    "1994 = M (1000) + CM (900) + XC (90) + IV (4), ya'ni MCMXCIV. To‘qqiz yuzni DCCCC deb emas, CM deb yozish kerak.",
    "To‘rtni IIII deb emas, ayirish shakli bilan IV deb yoziladi.",
  ],
  sampleNotesEn: [
    "1994 = M (1000) + CM (900) + XC (90) + IV (4), giving MCMXCIV. Nine hundred is written CM rather than DCCCC.",
    "Four is written with the subtractive form IV rather than as IIII.",
  ],
  testInputs: ["1994\n", "4\n", "1\n", "3999\n", "9\n", "58\n"],
  sol: `int n;cin>>n;
int val[13]={1000,900,500,400,100,90,50,40,10,9,5,4,1};
string sym[13]={"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
string r;
for(int i=0;i<13;++i)
 while(n>=val[i]){r+=sym[i];n-=val[i];}
cout<<r<<"\\n";`,
  wrongNote: "Leaving the subtractive forms out of the table writes four as IIII and nine hundred as DCCCC; stopping after one use of each value cannot write a number that needs the same symbol twice.",
  wrong: [
    `int n;cin>>n;
int val[7]={1000,500,100,50,10,5,1};
string sym[7]={"M","D","C","L","X","V","I"};
string r;
for(int i=0;i<7;++i)
 while(n>=val[i]){r+=sym[i];n-=val[i];}
cout<<r<<"\\n";`,
    `int n;cin>>n;
int val[13]={1000,900,500,400,100,90,50,40,10,9,5,4,1};
string sym[13]={"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
string r;
for(int i=0;i<13;++i)
 if(n>=val[i]){r+=sym[i];n-=val[i];}
cout<<r<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B486", judge: "greedy-min-platforms-meetings", topic: "greedy", rating: 1400,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Bir vaqtda kerak bo‘ladigan xonalar",
  en: "How many rooms are needed at once",
  statementUz: "Sizga n ta uchrashuv berilgan; i-uchrashuv s_i vaqtida boshlanib e_i vaqtida tugaydi. Bir xonada bir vaqtning o‘zida faqat bitta uchrashuv o‘tishi mumkin. Barcha uchrashuvlarni o‘tkazish uchun kerak bo‘ladigan eng kam xonalar sonini toping. Bir uchrashuv tugagan lahzada boshqasi boshlansa, ular bitta xonaga sig‘adi, ya'ni tutashish to‘qnashuv hisoblanmaydi.",
  statementEn: "You are given n meetings, the i-th starting at s_i and ending at e_i. One room can host only one meeting at a time. Find the smallest number of rooms needed to hold all the meetings. If one meeting ends at the very moment another begins, they fit in the same room — touching is not a clash.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida s_i va e_i keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains s_i and e_i.",
  outputUz: "Yagona butun sonni chiqaring — kerak bo‘ladigan eng kam xonalar soni.",
  outputEn: "Print a single integer — the smallest number of rooms needed.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ s_i < e_i ≤ 10^9", "a meeting ending exactly when another starts shares its room", "every meeting must be held"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ s_i < e_i ≤ 10^9", "boshqasi boshlangan lahzada tugagan uchrashuv xonani baham ko‘radi", "har bir uchrashuv o‘tkazilishi shart"],
  sampleInputs: ["3\n0 30\n5 10\n15 20\n", "2\n0 10\n10 20\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "Birinchi uchrashuv 0 dan 30 gacha davom etadi va qolgan ikkitasi uning ichida yotadi. Ikkinchisi bilan uchinchisi o‘zaro kesishmaydi, shuning uchun ikkita xona yetadi.",
    "Birinchi uchrashuv 10 da tugaydi, ikkinchisi esa aynan 10 da boshlanadi. Tutashish to‘qnashuv emas, shuning uchun bitta xona kifoya.",
  ],
  sampleNotesEn: [
    "The first meeting runs from 0 to 30 and the other two sit inside it. Those two do not overlap each other, so two rooms are enough.",
    "The first meeting ends at 10 and the second begins exactly at 10. Touching is not a clash, so a single room suffices.",
  ],
  testInputs: ["3\n0 30\n5 10\n15 20\n", "2\n0 10\n10 20\n", "1\n0 1\n", "3\n0 10\n0 10\n0 10\n", "4\n1 4\n2 5\n3 6\n4 7\n", "3\n0 1\n2 3\n4 5\n"],
  sol: `int n;cin>>n;vector<pair<long long,int>>ev;ev.reserve(2*n);
for(int i=0;i<n;++i){long long s,e;cin>>s>>e;
 ev.push_back(make_pair(e,0));
 ev.push_back(make_pair(s,1));}
sort(ev.begin(),ev.end());
long long cur=0,best=0;
for(size_t i=0;i<ev.size();++i){
 if(ev[i].second==1){++cur;if(cur>best)best=cur;}
 else --cur;}
cout<<best<<"\\n";`,
  wrongNote: "Putting the starts ahead of the ends at the same moment treats a handover as an overlap and asks for a room that is already free; the number of meetings is an upper bound rather than the answer.",
  wrong: [
    `int n;cin>>n;vector<pair<long long,int>>ev;ev.reserve(2*n);
for(int i=0;i<n;++i){long long s,e;cin>>s>>e;
 ev.push_back(make_pair(s,0));
 ev.push_back(make_pair(e,1));}
sort(ev.begin(),ev.end());
long long cur=0,best=0;
for(size_t i=0;i<ev.size();++i){
 if(ev[i].second==0){++cur;if(cur>best)best=cur;}
 else --cur;}
cout<<best<<"\\n";`,
    `int n;cin>>n;
for(int i=0;i<n;++i){long long s,e;cin>>s>>e;}
cout<<n<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B487", judge: "bit-subset-xor-basis-size", topic: "math", rating: 1600,
  tag: "Bitwise", timeLimitMs: 1000,
  uz: "Xor bilan hosil qilinadigan qiymatlar",
  en: "The values reachable by xor",
  statementUz: "Sizga n ta manfiy bo‘lmagan sondan iborat massiv berilgan. Uning ixtiyoriy qism to‘plamini olib, elementlarining bitlar bo‘yicha xor yig‘indisini hisoblasak, jami nechta har xil qiymat hosil bo‘lishini toping. Bo‘sh qism to‘plam ham hisobga olinadi va u 0 ni beradi. Javob har doim ikkining darajasi bo‘ladi, chunki hosil bo‘ladigan qiymatlar bazis orqali aniqlanadi. Javob juda katta bo‘lishi mumkin, shuning uchun uni 10^9 + 7 modul bo‘yicha chiqaring.",
  statementEn: "You are given an array of n non-negative numbers. Taking any subset of it and computing the bitwise xor of its elements, find how many distinct values can be produced in total. The empty subset counts and produces 0. The answer is always a power of two, since the reachable values are fixed by a basis. It may be enormous, so print it modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta manfiy bo‘lmagan son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n non-negative numbers.",
  outputUz: "Yagona butun sonni chiqaring — hosil bo‘ladigan har xil qiymatlar sonining 10^9 + 7 bo‘yicha qoldig‘i.",
  outputEn: "Print a single integer — the number of distinct reachable values, modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ a_i < 2^60", "the empty subset counts and produces 0", "the answer is always a power of two", "the answer is reported modulo 10^9 + 7"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ a_i < 2^60", "bo‘sh qism to‘plam sanaladi va 0 ni beradi", "javob har doim ikkining darajasi bo‘ladi", "javob 10^9 + 7 modul bo‘yicha chiqariladi"],
  sampleInputs: ["3\n1 2 3\n", "2\n0 0\n"],
  expect: ["4\n", "1\n"],
  sampleNotesUz: [
    "1 va 2 mustaqil, 3 esa ularning xori bo‘lgani uchun yangi qiymat qo‘shmaydi. Hosil bo‘ladigan qiymatlar 0, 1, 2 va 3 — to‘rtta.",
    "Ikkala element ham nol, shuning uchun qanday qism to‘plam olsak ham xor 0 chiqadi. Yagona qiymat bor.",
  ],
  sampleNotesEn: [
    "The 1 and the 2 are independent while the 3 is their xor and adds nothing new. The reachable values are 0, 1, 2 and 3 — four of them.",
    "Both elements are zero, so every subset xors to 0 and there is a single reachable value.",
  ],
  testInputs: ["3\n1 2 3\n", "2\n0 0\n", "1\n0\n", "1\n5\n", "4\n1 2 4 8\n", "5\n7 7 7 7 7\n"],
  sol: `int n;cin>>n;const long long M=1000000007;
vector<unsigned long long>basis;
for(int i=0;i<n;++i){unsigned long long x;cin>>x;
 for(size_t j=0;j<basis.size();++j)x=min(x,x^basis[j]);
 if(x){basis.push_back(x);sort(basis.rbegin(),basis.rend());}}
long long r=1;
for(size_t i=0;i<basis.size();++i)r=r*2%M;
cout<<r<<"\\n";`,
  wrongNote: "Raising two to the number of elements assumes every subset reaches a different value, which repeats and dependencies break; counting the distinct input values still confuses a dependent element with an independent one.",
  wrong: [
    `int n;cin>>n;const long long M=1000000007;
for(int i=0;i<n;++i){unsigned long long x;cin>>x;}
long long r=1;
for(int i=0;i<n;++i)r=r*2%M;
cout<<r<<"\\n";`,
    `int n;cin>>n;const long long M=1000000007;
set<unsigned long long>s;
for(int i=0;i<n;++i){unsigned long long x;cin>>x;if(x)s.insert(x);}
long long r=1;
for(size_t i=0;i<s.size();++i)r=r*2%M;
cout<<r<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B488", judge: "dp-longest-chain-of-pairs", topic: "dp", rating: 1800,
  tag: "Sorting with dynamic programming", timeLimitMs: 1000,
  uz: "Juftliklardan eng uzun zanjir",
  en: "The longest chain of pairs",
  statementUz: "Sizga n ta juftlik berilgan; har bir juftlikda birinchi son ikkinchisidan qat'iy kichik. Ikkinchi juftlikning birinchi soni birinchi juftlikning ikkinchi sonidan qat'iy katta bo‘lsa, ularni zanjirga ulash mumkin. Shu qoida bo‘yicha tuzilishi mumkin bo‘lgan eng uzun zanjirdagi juftliklar sonini toping. Juftliklarni istalgan tartibda ishlatish mumkin.",
  statementEn: "You are given n pairs, each with its first number strictly below its second. Two pairs may be linked into a chain when the first number of the second pair is strictly above the second number of the first. Find how many pairs the longest chain built under this rule can hold. The pairs may be used in any order.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida juftlikning ikkita soni keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains the two numbers of a pair.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun zanjirdagi juftliklar soni.",
  outputEn: "Print a single integer — the number of pairs in the longest chain.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ the first number < the second number ≤ 10^9", "the link requires a strict rise, so touching ends do not link", "the pairs may be used in any order"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ birinchi son < ikkinchi son ≤ 10^9", "ulanish qat'iy o‘sishni talab qiladi, ya'ni tutashgan chekkalar ulanmaydi", "juftliklarni istalgan tartibda ishlatish mumkin"],
  sampleInputs: ["3\n1 2\n2 3\n3 4\n", "2\n1 10\n2 3\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "1 2 va 3 4 juftliklarini ulash mumkin, chunki 3 > 2. 2 3 ni ularning orasiga qo‘shib bo‘lmaydi, chunki 2 > 2 sharti bajarilmaydi. Javob 2.",
    "2 3 juftligi 1 10 ning ichida yotadi, ya'ni ularni ulab bo‘lmaydi. Zanjirda faqat bitta juftlik qoladi.",
  ],
  sampleNotesEn: [
    "The pairs 1 2 and 3 4 link because 3 > 2. The pair 2 3 cannot join them, since 2 > 2 does not hold, so the answer is 2.",
    "The pair 2 3 sits inside 1 10, so the two cannot link and the chain holds a single pair.",
  ],
  testInputs: ["3\n1 2\n2 3\n3 4\n", "2\n1 10\n2 3\n", "1\n0 1\n", "4\n1 2\n3 4\n5 6\n7 8\n", "3\n1 100\n2 3\n4 5\n", "4\n5 6\n1 2\n7 8\n3 4\n"],
  sol: `int n;cin>>n;vector<pair<long long,long long>>p(n);
for(int i=0;i<n;++i)cin>>p[i].second>>p[i].first;
sort(p.begin(),p.end());
long long c=0,last=(long long)-4e18;
for(int i=0;i<n;++i){
 if(p[i].second>last){++c;last=p[i].first;}}
cout<<c<<"\\n";`,
  wrongNote: "Sorting by where each pair begins rather than where it ends lets a long pair be taken first and block everything behind it; allowing the next pair to start exactly where the last one ended ignores that the rise must be strict.",
  wrong: [
    `int n;cin>>n;vector<pair<long long,long long>>p(n);
for(int i=0;i<n;++i)cin>>p[i].first>>p[i].second;
sort(p.begin(),p.end());
long long c=0,last=(long long)-4e18;
for(int i=0;i<n;++i){
 if(p[i].first>last){++c;last=p[i].second;}}
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<pair<long long,long long>>p(n);
for(int i=0;i<n;++i)cin>>p[i].second>>p[i].first;
sort(p.begin(),p.end());
long long c=0,last=(long long)-4e18;
for(int i=0;i<n;++i){
 if(p[i].second>=last){++c;last=p[i].first;}}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "B489", judge: "graph-count-paths-fixed-length-dag", topic: "graphs", rating: 1900,
  tag: "Topological dynamic programming", timeLimitMs: 2000,
  uz: "Uzunligi k bo‘lgan yo‘llar soni",
  en: "The number of paths of length k",
  statementUz: "Sizga n ta uchi va m ta yo‘naltirilgan qirrasi bo‘lgan siklsiz graf va k soni berilgan. Aynan k ta qirradan o‘tuvchi yo‘llar nechtaligini 10^9 + 7 modul bo‘yicha sanang. Yo‘l ixtiyoriy uchdan boshlanib ixtiyoriy uchda tugashi mumkin. Uzunligi 0 bo‘lgan yo‘l bitta uchdan iborat, shuning uchun k = 0 bo‘lganda har bir uch bir marta sanaladi.",
  statementEn: "You are given a directed graph with n vertices and m edges and no cycles, together with a number k. Count, modulo 10^9 + 7, the paths that use exactly k edges. A path may start at any vertex and end at any vertex. A path of length 0 is a single vertex, so with k = 0 every vertex counts once.",
  inputUz: "Birinchi qatorda uchta n, m va k butun soni beriladi. Keyingi m qatorning har birida a uchdan b uchga qirra keladi.",
  inputEn: "The first line contains three integers n, m and k. Each of the next m lines contains an edge from a to b.",
  outputUz: "Yagona butun sonni chiqaring — aynan k ta qirradan o‘tuvchi yo‘llar sonining 10^9 + 7 bo‘yicha qoldig‘i.",
  outputEn: "Print a single integer — the number of paths using exactly k edges, modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "0 ≤ k ≤ 100", "1 ≤ a, b ≤ n and a ≠ b", "the graph contains no directed cycle", "a path of length 0 is a single vertex"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "0 ≤ k ≤ 100", "1 ≤ a, b ≤ n va a ≠ b", "grafda yo‘naltirilgan sikl yo‘q", "uzunligi 0 bo‘lgan yo‘l bitta uchdan iborat"],
  sampleInputs: ["4 4 2\n1 2\n2 3\n3 4\n1 3\n", "3 0 0\n"],
  expect: ["3\n", "3\n"],
  sampleNotesUz: [
    "Ikkita qirradan o‘tuvchi yo‘llar: 1 → 2 → 3, 2 → 3 → 4 va 1 → 3 → 4 — uchtasi.",
    "Qirra yo‘q, k ham nolga teng. Har bir uchning o‘zi uzunligi 0 bo‘lgan yo‘l hisoblanadi, shuning uchun javob 3.",
  ],
  sampleNotesEn: [
    "The paths using two edges are 1 → 2 → 3, 2 → 3 → 4 and 1 → 3 → 4 — three of them.",
    "There is no edge and k is zero. Each vertex on its own is a path of length 0, so the answer is 3.",
  ],
  testInputs: [
    "4 4 2\n1 2\n2 3\n3 4\n1 3\n",
    "3 0 0\n",
    "1 0 0\n",
    "2 1 1\n1 2\n",
    "2 1 2\n1 2\n",
    "5 6 2\n1 2\n1 3\n2 4\n3 4\n4 5\n1 5\n",
  ],
  sol: `long long n,m,k;cin>>n>>m>>k;const long long M=1000000007;
vector<vector<int>>g(n);vector<int>indeg(n,0);
for(long long i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++indeg[b];}
vector<int>order;order.reserve((size_t)n);vector<int>st;
for(int v=0;v<n;++v)if(indeg[v]==0)st.push_back(v);
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(--indeg[u]==0)st.push_back(u);}
vector<vector<long long>>dp((size_t)n,vector<long long>((size_t)k+1,0));
for(int v=0;v<n;++v)dp[v][0]=1;
for(size_t i=0;i<order.size();++i){int v=order[i];
 for(long long len=0;len<k;++len){
  if(!dp[v][len])continue;
  for(int u:g[v])dp[u][len+1]=(dp[u][len+1]+dp[v][len])%M;}}
long long total=0;
for(int v=0;v<n;++v)total=(total+dp[v][k])%M;
cout<<total<<"\\n";`,
  wrongNote: "Counting only the paths that start at the first vertex ignores that a path may begin anywhere; adding up every length rather than the one asked for counts the shorter paths as well.",
  wrong: [
    `long long n,m,k;cin>>n>>m>>k;const long long M=1000000007;
vector<vector<int>>g(n);vector<int>indeg(n,0);
for(long long i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++indeg[b];}
vector<int>order;order.reserve((size_t)n);vector<int>st;
for(int v=0;v<n;++v)if(indeg[v]==0)st.push_back(v);
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(--indeg[u]==0)st.push_back(u);}
vector<vector<long long>>dp((size_t)n,vector<long long>((size_t)k+1,0));
dp[0][0]=1;
for(size_t i=0;i<order.size();++i){int v=order[i];
 for(long long len=0;len<k;++len){
  if(!dp[v][len])continue;
  for(int u:g[v])dp[u][len+1]=(dp[u][len+1]+dp[v][len])%M;}}
long long total=0;
for(int v=0;v<n;++v)total=(total+dp[v][k])%M;
cout<<total<<"\\n";`,
    `long long n,m,k;cin>>n>>m>>k;const long long M=1000000007;
vector<vector<int>>g(n);vector<int>indeg(n,0);
for(long long i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++indeg[b];}
vector<int>order;order.reserve((size_t)n);vector<int>st;
for(int v=0;v<n;++v)if(indeg[v]==0)st.push_back(v);
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(--indeg[u]==0)st.push_back(u);}
vector<vector<long long>>dp((size_t)n,vector<long long>((size_t)k+1,0));
for(int v=0;v<n;++v)dp[v][0]=1;
for(size_t i=0;i<order.size();++i){int v=order[i];
 for(long long len=0;len<k;++len){
  if(!dp[v][len])continue;
  for(int u:g[v])dp[u][len+1]=(dp[u][len+1]+dp[v][len])%M;}}
long long total=0;
for(int v=0;v<n;++v)for(long long len=0;len<=k;++len)total=(total+dp[v][len])%M;
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C490", judge: "dp-weighted-interval-schedule", topic: "dp", rating: 2100,
  tag: "Binary search with dynamic programming", timeLimitMs: 2000,
  uz: "Eng foydali ishlar to‘plami",
  en: "The most profitable set of jobs",
  statementUz: "Sizga n ta ish berilgan; i-ish s_i vaqtida boshlanib e_i vaqtida tugaydi va p_i foyda keltiradi. Bir vaqtning o‘zida faqat bitta ish bajariladi, lekin bir ish tugagan lahzada boshqasini boshlash mumkin. Umumiy foydani eng katta qiladigan ishlar to‘plamini tanlang va o‘sha foydani chiqaring. Ish butunlay olinadi yoki umuman olinmaydi; hech narsa olmaslikka ruxsat beriladi, shuning uchun javob manfiy bo‘lmaydi.",
  statementEn: "You are given n jobs, the i-th running from s_i to e_i and paying p_i. Only one job can run at a time, though a job may start at the very moment another ends. Choose the set of jobs that earns the most and print that total. A job is taken whole or not at all, and taking nothing is allowed, so the answer is never negative.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida s_i, e_i va p_i keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains s_i, e_i and p_i.",
  outputUz: "Yagona butun sonni chiqaring — olinishi mumkin bo‘lgan eng katta umumiy foyda.",
  outputEn: "Print a single integer — the largest total profit obtainable.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ s_i < e_i ≤ 10^9", "1 ≤ p_i ≤ 10^9", "a job may start exactly when another ends", "the total reaches 10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ s_i < e_i ≤ 10^9", "1 ≤ p_i ≤ 10^9", "bir ish boshqasi tugagan lahzada boshlanishi mumkin", "jami 10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n1 2 50\n3 5 20\n6 19 100\n2 100 200\n", "2\n0 10 5\n10 20 5\n"],
  expect: ["250\n", "10\n"],
  sampleNotesUz: [
    "1 dan 2 gacha bo‘lgan ishni (50) va 2 dan 100 gacha bo‘lgan ishni (200) olamiz: jami 250. Qolgan ikkitasini qo‘shib bo‘lmaydi, chunki ular katta ish bilan kesishadi.",
    "Birinchi ish 10 da tugaydi, ikkinchisi aynan 10 da boshlanadi, ya'ni ikkalasini ham bajarish mumkin. Jami foyda 10.",
  ],
  sampleNotesEn: [
    "Taking the job from 1 to 2 paying 50 and the one from 2 to 100 paying 200 gives 250. The other two cannot join them, since they overlap the long job.",
    "The first job ends at 10 and the second begins exactly at 10, so both can be done for a total of 10.",
  ],
  testInputs: [
    "4\n1 2 50\n3 5 20\n6 19 100\n2 100 200\n",
    "2\n0 10 5\n10 20 5\n",
    "1\n0 1 7\n",
    "3\n0 10 100\n1 2 1\n3 4 1\n",
    "3\n0 1 1\n1 2 1\n2 3 1\n",
    "2\n0 100 5\n0 1 1000000000\n",
    "3\n0 10 10\n0 5 6\n5 10 6\n",
  ],
  sol: `int n;cin>>n;vector<array<long long,3>>j(n);
for(int i=0;i<n;++i)cin>>j[i][1]>>j[i][0]>>j[i][2];
sort(j.begin(),j.end());
vector<long long>ends(n);
for(int i=0;i<n;++i)ends[i]=j[i][0];
vector<long long>dp(n+1,0);
for(int i=0;i<n;++i){
 long long start=j[i][1];
 int idx=(int)(upper_bound(ends.begin(),ends.begin()+i,start)-ends.begin());
 dp[i+1]=max(dp[i],dp[idx]+j[i][2]);}
cout<<dp[n]<<"\\n";`,
  wrongNote: "Taking the jobs by falling pay and skipping whatever clashes fixes each choice before the rest is known; counting as many jobs as will fit ignores that a single long job can pay more than several short ones.",
  wrong: [
    `int n;cin>>n;vector<array<long long,3>>j(n);
for(int i=0;i<n;++i)cin>>j[i][1]>>j[i][2]>>j[i][0];
sort(j.rbegin(),j.rend());
vector<pair<long long,long long>>taken;
long long total=0;
for(int i=0;i<n;++i){
 long long s=j[i][1],e=j[i][2];
 bool ok=true;
 for(size_t t=0;t<taken.size();++t)
  if(s<taken[t].second&&taken[t].first<e)ok=false;
 if(!ok)continue;
 taken.push_back(make_pair(s,e));total+=j[i][0];}
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<array<long long,3>>j(n);
for(int i=0;i<n;++i)cin>>j[i][1]>>j[i][0]>>j[i][2];
sort(j.begin(),j.end());
long long total=0,last=(long long)-4e18;
for(int i=0;i<n;++i){
 if(j[i][1]>=last){total+=j[i][2];last=j[i][0];}}
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C491", judge: "adv-bitmask-min-cover-sets", topic: "advanced-cp", rating: 2300,
  tag: "Bitmask dynamic programming", timeLimitMs: 2000,
  uz: "Hamma mavzuni qamrab olish",
  en: "Covering every topic",
  statementUz: "Kurs uchun m ta mavzu bor va n ta kitob mavjud; har bir kitob shu mavzularning biror qism to‘plamini qamrab oladi. Barcha m ta mavzuni qamrab oladigan eng kam kitoblar sonini toping. Bir kitob bir nechta mavzuni qamrashi va mavzular kitoblarda takrorlanishi mumkin. Barcha mavzuni qamrab bo‘lmasa, −1 chiqaring.",
  statementEn: "A course has m topics and n books are available, each covering some subset of those topics. Find the smallest number of books that together cover all m topics. One book may cover several topics and the topics may repeat across books. If the topics cannot all be covered, print −1.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi n qatorning har birida kitob qamragan mavzular soni va o‘sha mavzular raqamlari keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next n lines contains how many topics the book covers, followed by those topic numbers.",
  outputUz: "Yagona butun sonni chiqaring — barcha mavzuni qamrab oladigan eng kam kitoblar soni, yoki imkonsiz bo‘lsa −1.",
  outputEn: "Print a single integer — the smallest number of books covering every topic, or −1 if that is impossible.",
  constraintList: ["1 ≤ n ≤ 100", "1 ≤ m ≤ 18", "each topic number lies between 1 and m", "a book may cover no topic at all", "the answer never exceeds m"],
  constraintListUz: ["1 ≤ n ≤ 100", "1 ≤ m ≤ 18", "har bir mavzu raqami 1 dan m gacha", "kitob birorta mavzuni qamramasligi ham mumkin", "javob hech qachon m dan oshmaydi"],
  sampleInputs: ["3 3\n2 1 2\n2 2 3\n1 3\n", "2 3\n1 1\n1 2\n"],
  expect: ["2\n", "-1\n"],
  sampleNotesUz: [
    "Birinchi kitob 1 va 2 ni, ikkinchisi 2 va 3 ni qamraydi; ikkalasi birga uchala mavzuni beradi. Bitta kitob bilan uchalasini qamrab bo‘lmaydi.",
    "Uchinchi mavzuni birorta kitob qamramaydi, shuning uchun barcha mavzuni qoplash imkonsiz.",
  ],
  sampleNotesEn: [
    "The first book covers topics 1 and 2 and the second covers 2 and 3; together they give all three. No single book covers all three.",
    "No book covers the third topic, so covering everything is impossible.",
  ],
  testInputs: [
    "3 3\n2 1 2\n2 2 3\n1 3\n",
    "2 3\n1 1\n1 2\n",
    "1 1\n1 1\n",
    "1 1\n0\n",
    "4 4\n1 1\n1 2\n1 3\n1 4\n",
    "3 4\n2 1 2\n2 3 4\n4 1 2 3 4\n",
    "3 6\n3 1 2 3\n3 4 5 6\n4 1 2 4 5\n",
  ],
  sol: `int n,m;cin>>n>>m;
vector<int>book(n,0);
for(int i=0;i<n;++i){int c;cin>>c;
 for(int t=0;t<c;++t){int x;cin>>x;book[i]|=1<<(x-1);}}
int full=(1<<m)-1;
const int INF=1000000000;
vector<int>dp(1<<m,INF);dp[0]=0;
for(int mask=0;mask<=full;++mask){
 if(dp[mask]>=INF)continue;
 for(int i=0;i<n;++i){
  int nm=mask|book[i];
  if(dp[mask]+1<dp[nm])dp[nm]=dp[mask]+1;}}
cout<<((dp[full]>=INF)?-1:dp[full])<<"\\n";`,
  wrongNote: "Repeatedly grabbing the book that adds the most uncovered topics is the classic greedy for this problem and is not always optimal; counting the books that cover anything new at all ignores that one book can replace several.",
  wrong: [
    `int n,m;cin>>n>>m;
vector<int>book(n,0);
for(int i=0;i<n;++i){int c;cin>>c;
 for(int t=0;t<c;++t){int x;cin>>x;book[i]|=1<<(x-1);}}
int full=(1<<m)-1,mask=0,c=0;
while(mask!=full){
 int best=-1,gain=0;
 for(int i=0;i<n;++i){
  int g=__builtin_popcount(book[i]&~mask);
  if(g>gain){gain=g;best=i;}}
 if(best<0){cout<<"-1\\n";return 0;}
 mask|=book[best];++c;}
cout<<c<<"\\n";`,
    `int n,m;cin>>n>>m;
vector<int>book(n,0);
for(int i=0;i<n;++i){int c;cin>>c;
 for(int t=0;t<c;++t){int x;cin>>x;book[i]|=1<<(x-1);}}
int full=(1<<m)-1,mask=0,c=0;
for(int i=0;i<n;++i){
 if((book[i]&~mask)==0)continue;
 mask|=book[i];++c;}
cout<<((mask==full)?c:-1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C492", judge: "adv-count-subarrays-sum-divisible", topic: "advanced-cp", rating: 2400,
  tag: "Prefix sums with remainders", timeLimitMs: 2000,
  uz: "Yig‘indisi k ga bo‘linadigan qismlar",
  en: "The stretches whose sum divides by k",
  statementUz: "Sizga n ta butun sondan iborat massiv va k soni berilgan. Ketma-ket turgan shunday bo‘sh bo‘lmagan qismlar sonini toping-ki, ulardagi elementlarning yig‘indisi k ga qoldiqsiz bo‘linsin. Qism bo‘sh bo‘lmasligi va elementlari ketma-ket turishi shart; qiymatlar manfiy bo‘lishi mumkin va javob 32-bitli turdan oshib ketadi.",
  statementEn: "You are given an array of n integers and a number k. Count the non-empty stretches of consecutive elements whose sum divides by k with no remainder. A stretch must be non-empty and its elements consecutive; the values may be negative and the count runs beyond a 32-bit type.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi k ga bo‘linadigan qismlar soni.",
  outputEn: "Print a single integer — the number of stretches whose sum divides by k.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the stretch must be non-empty and consecutive", "the answer reaches 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "qism bo‘sh bo‘lmagan va ketma-ket bo‘lishi shart", "javob 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5 5\n4 5 0 -2 -3\n", "3 2\n1 1 1\n"],
  expect: ["6\n", "2\n"],
  sampleNotesUz: [
    "Yig‘indisi 5 ga bo‘linadigan qismlar: [5], [0], [5,0], [-2,-3], [0,-2,-3] va [5,0,-2,-3] — jami 6 ta.",
    "Yig‘indisi juft bo‘lgan qismlar: [1,1] boshidan va [1,1] oxiridan — ikkitasi. Bitta 1 dan iborat qismlar toq yig‘indi beradi.",
  ],
  sampleNotesEn: [
    "The stretches whose sum divides by 5 are [5], [0], [5,0], [-2,-3], [0,-2,-3] and [5,0,-2,-3] — six in all.",
    "The stretches with an even sum are the [1,1] at the front and the [1,1] at the back — two of them. A lone 1 gives an odd sum.",
  ],
  testInputs: [
    "5 5\n4 5 0 -2 -3\n",
    "3 2\n1 1 1\n",
    "1 1\n7\n",
    "1 3\n1\n",
    "4 3\n-3 -3 -3 -3\n",
    "6 4\n1 2 3 4 5 6\n",
  ],
  sol: `long long n,k;cin>>n>>k;
vector<long long>cnt(k,0);
cnt[0]=1;long long pre=0,ans=0;
for(long long i=0;i<n;++i){long long x;cin>>x;
 pre=((pre+x)%k+k)%k;
 ans+=cnt[pre];++cnt[pre];}
cout<<ans<<"\\n";`,
  wrongNote: "Counting the elements that divide by k on their own misses every longer stretch that only adds up to a multiple; leaving out the empty prefix loses every stretch that starts at the first element.",
  wrong: [
    `long long n,k;cin>>n>>k;
long long ans=0;
for(long long i=0;i<n;++i){long long x;cin>>x;
 if(((x%k)+k)%k==0)++ans;}
cout<<ans<<"\\n";`,
    `long long n,k;cin>>n>>k;
vector<long long>cnt(k,0);
long long pre=0,ans=0;
for(long long i=0;i<n;++i){long long x;cin>>x;
 pre=((pre+x)%k+k)%k;
 ans+=cnt[pre];++cnt[pre];}
cout<<ans<<"\\n";`,
  ],
});

export default P;
