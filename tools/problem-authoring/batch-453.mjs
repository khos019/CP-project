/* Batch 453 — ten problems, A453–C462.
 *
 * Dates and digit games at the bottom, a matrix exponentiation and a
 * heavy-path-free tree query at the top; C462 is the batch's insane entry.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A453", judge: "num-count-digit-occurrences", topic: "programming-basics", rating: 800,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Raqam necha marta uchraydi",
  en: "How often a digit occurs",
  statementUz: "Sizga manfiy bo‘lmagan n soni va bitta d raqami berilgan. n ning o‘nlik yozuvida d raqami necha marta uchrashini sanang. Masalan, 1213 sonida 1 raqami ikki marta uchraydi. Agar d raqami umuman uchramasa, javob 0 bo‘ladi. n nolga teng bo‘lganda yozuvida yagona 0 raqami turadi.",
  statementEn: "You are given a non-negative number n and a single digit d. Count how many times the digit d occurs in the decimal writing of n. In 1213, for instance, the digit 1 occurs twice. If d does not occur at all the answer is 0. When n is zero its writing is the single digit 0.",
  inputUz: "Yagona qatorda ikkita n va d butun soni beriladi.",
  inputEn: "The only line contains two integers n and d.",
  outputUz: "Yagona butun sonni chiqaring — d raqamining n yozuvidagi uchrash soni.",
  outputEn: "Print a single integer — how many times the digit d occurs in n.",
  constraintList: ["0 ≤ n ≤ 10^18", "0 ≤ d ≤ 9", "n is written without leading zeros", "n = 0 is written as the single digit 0"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "0 ≤ d ≤ 9", "n boshida nolsiz yoziladi", "n = 0 yagona 0 raqami bilan yoziladi"],
  sampleInputs: ["1213 1\n", "555 7\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "1213 sonining raqamlari 1, 2, 1 va 3. Ular orasida 1 ikki marta uchraydi.",
    "555 da faqat 5 raqami bor, 7 esa umuman yo‘q. Javob 0.",
  ],
  sampleNotesEn: [
    "The digits of 1213 are 1, 2, 1 and 3, and among them the 1 occurs twice.",
    "555 holds only the digit 5 and no 7 at all, so the answer is 0.",
  ],
  testInputs: ["1213 1\n", "555 7\n", "0 0\n", "0 5\n", "1000000000000000000 0\n", "9999999999 9\n"],
  sol: `string s;int d;cin>>s>>d;
long long c=0;
for(char ch:s)if(ch-'0'==d)++c;
cout<<c<<"\\n";`,
  wrongNote: "Peeling digits off with a loop that stops while the number is positive never looks at the single digit of zero; comparing the digit against the character rather than its value never matches.",
  wrong: [
    `long long n;int d;cin>>n>>d;
long long c=0;
while(n>0){if(n%10==d)++c;n/=10;}
cout<<c<<"\\n";`,
    `string s;int d;cin>>s>>d;
long long c=0;
for(char ch:s)if(ch==d)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A454", judge: "date-day-of-year", topic: "foundations", rating: 1000,
  tag: "Simulation", timeLimitMs: 1000,
  uz: "Yilning nechanchi kuni",
  en: "Which day of the year it is",
  statementUz: "Sizga yil, oy va kun berilgan. Bu sana o‘sha yilning nechanchi kuni ekanini toping; 1-yanvar birinchi kun hisoblanadi. Fevral oyining uzunligi yilga bog‘liq: kabisa yilida 29, aks holda 28 kun. Yil kabisa hisoblanadi, agar u 4 ga bo‘linsa-yu 100 ga bo‘linmasa, yoki 400 ga bo‘linsa.",
  statementEn: "You are given a year, a month and a day. Find which day of that year the date falls on, counting the first of January as day one. The length of February depends on the year: 29 days in a leap year and 28 otherwise. A year is a leap year when it is divisible by 4 but not by 100, or when it is divisible by 400.",
  inputUz: "Yagona qatorda uchta y, m va d butun soni beriladi.",
  inputEn: "The only line contains three integers y, m and d.",
  outputUz: "Yagona butun sonni chiqaring — sana yilning nechanchi kuniga to‘g‘ri kelishi.",
  outputEn: "Print a single integer — which day of the year the date falls on.",
  constraintList: ["1 ≤ y ≤ 9999", "1 ≤ m ≤ 12", "1 ≤ d ≤ the number of days in that month", "the date is always valid", "the answer lies between 1 and 366"],
  constraintListUz: ["1 ≤ y ≤ 9999", "1 ≤ m ≤ 12", "1 ≤ d ≤ o‘sha oydagi kunlar soni", "sana har doim to‘g‘ri bo‘ladi", "javob 1 dan 366 gacha"],
  sampleInputs: ["2024 3 1\n", "2023 1 1\n"],
  expect: ["61\n", "1\n"],
  sampleNotesUz: [
    "2024 kabisa yili, ya'ni yanvarda 31, fevralda 29 kun bor. 31 + 29 + 1 = 61.",
    "1-yanvar yilning birinchi kuni, shuning uchun javob 1.",
  ],
  sampleNotesEn: [
    "2024 is a leap year, so January has 31 days and February 29. That gives 31 + 29 + 1 = 61.",
    "The first of January is the first day of the year, so the answer is 1.",
  ],
  testInputs: ["2024 3 1\n", "2023 1 1\n", "2023 12 31\n", "2024 12 31\n", "1900 3 1\n", "2000 3 1\n"],
  sol: `int y,m,d;cin>>y>>m>>d;
bool leap=(y%4==0&&y%100!=0)||(y%400==0);
int len[12]={31,28,31,30,31,30,31,31,30,31,30,31};
if(leap)len[1]=29;
long long t=d;
for(int i=0;i+1<m;++i)t+=len[i];
cout<<t<<"\\n";`,
  wrongNote: "Treating every year divisible by four as a leap year adds a day to 1900, which the hundred-year rule excludes; adding the length of the current month as well overshoots by a whole month.",
  wrong: [
    `int y,m,d;cin>>y>>m>>d;
bool leap=(y%4==0);
int len[12]={31,28,31,30,31,30,31,31,30,31,30,31};
if(leap)len[1]=29;
long long t=d;
for(int i=0;i+1<m;++i)t+=len[i];
cout<<t<<"\\n";`,
    `int y,m,d;cin>>y>>m>>d;
bool leap=(y%4==0&&y%100!=0)||(y%400==0);
int len[12]={31,28,31,30,31,30,31,31,30,31,30,31};
if(leap)len[1]=29;
long long t=d;
for(int i=0;i<m;++i)t+=len[i];
cout<<t<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B455", judge: "str-shortest-repeating-unit", topic: "strings", rating: 1200,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Satrni tashkil qilgan eng qisqa bo‘lak",
  en: "The shortest block the string is built from",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uni biror bo‘lakni bir necha marta ketma-ket takrorlab hosil qilish mumkin bo‘lsa, shunday bo‘laklarning eng qisqasini toping va uzunligini chiqaring. Masalan, ababab satri ab bo‘lagini uch marta takrorlashdan hosil bo‘ladi. Har qanday satrni o‘zini bir marta takrorlab hosil qilsa bo‘ladi, shuning uchun javob har doim mavjud.",
  statementEn: "You are given a string s of lowercase Latin letters. If it can be built by repeating some block several times in a row, find the shortest such block and print its length. For instance ababab comes from repeating the block ab three times. Any string can be built by repeating itself once, so an answer always exists.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — takrorlanuvchi eng qisqa bo‘lakning uzunligi.",
  outputEn: "Print a single integer — the length of the shortest repeating block.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the letters 'a'–'z'", "the block length must divide |s|", "the answer is |s| itself when no shorter block works"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s 'a'–'z' harflaridan iborat", "bo‘lak uzunligi |s| ni bo‘lishi shart", "qisqarog‘i bo‘lmasa javob |s| ning o‘zi"],
  sampleInputs: ["ababab\n", "abcd\n"],
  expect: ["2\n", "4\n"],
  sampleNotesUz: [
    "ab bo‘lagi uch marta takrorlanib ababab ni beradi, undan qisqarog‘i esa yo‘q — bitta harfdan iborat bo‘lak ishlamaydi.",
    "abcd ni takrorlanuvchi bo‘laklarga ajratib bo‘lmaydi, shuning uchun eng qisqa bo‘lak satrning o‘zi, uzunligi 4.",
  ],
  sampleNotesEn: [
    "The block ab repeated three times gives ababab, and nothing shorter works — a single-letter block does not.",
    "abcd cannot be split into repeats, so the shortest block is the string itself, of length 4.",
  ],
  testInputs: ["ababab\n", "abcd\n", "a\n", "aaaa\n", "abcabcabc\n", "aabaab\n"],
  sol: `string s;cin>>s;int n=(int)s.size();
for(int k=1;k<=n;++k){
 if(n%k)continue;
 bool ok=true;
 for(int i=k;i<n&&ok;++i)if(s[i]!=s[i-k])ok=false;
 if(ok){cout<<k<<"\\n";return 0;}}
cout<<n<<"\\n";`,
  wrongNote: "Checking only the first repeat of the block leaves the rest of the string unverified; searching from the longest block downwards reports the longest repeating unit rather than the shortest.",
  wrong: [
    `string s;cin>>s;int n=(int)s.size();
for(int k=1;k<=n;++k){
 if(n%k)continue;
 bool ok=true;
 for(int i=0;i<k&&ok;++i)if(s[i]!=s[i+k>=n?i:i+k])ok=false;
 if(ok){cout<<k<<"\\n";return 0;}}
cout<<n<<"\\n";`,
    `string s;cin>>s;int n=(int)s.size();
int best=n;
for(int k=1;k<=n;++k){
 if(n%k)continue;
 bool ok=true;
 for(int i=k;i<n&&ok;++i)if(s[i]!=s[i-k])ok=false;
 if(ok)best=k;}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B456", judge: "greedy-max-items-within-budget", topic: "greedy", rating: 1400,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Byudjetga sig‘adigan eng ko‘p buyum",
  en: "As many items as the budget allows",
  statementUz: "Do‘konda n ta buyum bor; i-buyumning narxi p_i. Sizda b so‘m pul bor. Umumiy narxi byudjetdan oshmasligi sharti bilan eng ko‘pi bilan nechta buyum sotib olishingiz mumkinligini toping. Har bir buyum bir martadan olinadi va buyumlarning qiymati ahamiyatsiz — faqat soni muhim. Shuning uchun arzonlaridan boshlab olish eng yaxshi tanlov bo‘ladi.",
  statementEn: "A shop has n items, the i-th priced at p_i, and you have a budget of b. Find the largest number of items you can buy so that their total price stays within the budget. Each item may be bought once and their value does not matter — only the count does. That makes taking the cheapest ones first the best possible choice.",
  inputUz: "Birinchi qatorda ikkita n va b butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta narx keladi.",
  inputEn: "The first line contains two integers n and b. The second line contains the n prices.",
  outputUz: "Yagona butun sonni chiqaring — sotib olish mumkin bo‘lgan buyumlarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of items that can be bought.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ b ≤ 10^14", "1 ≤ p_i ≤ 10^9", "each item may be bought at most once", "the total may equal the budget but not exceed it"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ b ≤ 10^14", "1 ≤ p_i ≤ 10^9", "har bir buyum ko‘pi bilan bir marta olinadi", "umumiy narx byudjetga teng bo‘lishi mumkin, undan oshmasligi kerak"],
  sampleInputs: ["5 10\n1 12 5 111 200\n", "3 0\n1 2 3\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Arzonlari 1 va 5, ularning yig‘indisi 6 bo‘lib byudjetga sig‘adi. Uchinchi eng arzon buyum 12 bo‘lib, 6 + 12 = 18 esa 10 dan oshib ketadi. Javob 2.",
    "Pul umuman yo‘q, shuning uchun birorta buyum olinmaydi.",
  ],
  sampleNotesEn: [
    "The cheapest two cost 1 and 5, adding to 6, which fits. The third cheapest costs 12 and 6 + 12 = 18 goes over 10, so the answer is 2.",
    "There is no money at all, so nothing can be bought.",
  ],
  testInputs: ["5 10\n1 12 5 111 200\n", "3 0\n1 2 3\n", "1 1000000000\n1000000000\n", "4 6\n1 2 3 4\n", "3 100\n1 1 1\n", "5 100000000000000\n1000000000 1000000000 1000000000 1000000000 1000000000\n"],
  sol: `long long n,b;cin>>n>>b;vector<long long>p(n);for(auto&x:p)cin>>x;
sort(p.begin(),p.end());
long long c=0,spent=0;
for(long long x:p){
 if(spent+x>b)break;
 spent+=x;++c;}
cout<<c<<"\\n";`,
  wrongNote: "Buying in the order the prices arrive can be stopped by one expensive item while cheaper ones still wait behind it; refusing a purchase that spends the budget exactly rejects a perfectly affordable item.",
  wrong: [
    `long long n,b;cin>>n>>b;vector<long long>p(n);for(auto&x:p)cin>>x;
long long c=0,spent=0;
for(long long x:p){
 if(spent+x>b)break;
 spent+=x;++c;}
cout<<c<<"\\n";`,
    `long long n,b;cin>>n>>b;vector<long long>p(n);for(auto&x:p)cin>>x;
sort(p.begin(),p.end());
long long c=0,spent=0;
for(long long x:p){
 if(spent+x>=b)break;
 spent+=x;++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B457", judge: "stack-score-of-brackets", topic: "data-structures", rating: 1600,
  tag: "Stack", timeLimitMs: 1000,
  uz: "Qavslar ifodasining bahosi",
  en: "The score of a bracket sequence",
  statementUz: "Sizga to‘g‘ri joylashgan qavslardan iborat satr berilgan. Uning bahosi quyidagi qoidalar bilan aniqlanadi: () ifodasining bahosi 1; AB ko‘rinishdagi ketma-ket ikki ifodaning bahosi ularning bahosi yig‘indisiga teng; (A) ko‘rinishdagi ifodaning bahosi esa A ning bahosidan ikki marta katta. Shu qoidalar bo‘yicha butun satrning bahosini hisoblang.",
  statementEn: "You are given a well-formed string of brackets. Its score follows three rules: the score of () is 1; the score of two sequences AB written one after the other is the sum of their scores; and the score of (A) is twice the score of A. Compute the score of the whole string under these rules.",
  inputUz: "Yagona qatorda ( va ) belgilaridan iborat to‘g‘ri joylashgan s satri beriladi.",
  inputEn: "The only line contains the well-formed string s of ( and ) characters.",
  outputUz: "Yagona butun sonni chiqaring — satrning bahosi.",
  outputEn: "Print a single integer — the score of the string.",
  constraintList: ["2 ≤ |s| ≤ 50 and |s| is even", "s is always a well-formed bracket sequence", "s consists of the characters '(' and ')' only", "the score reaches 2^24 and fits in a 64-bit type"],
  constraintListUz: ["2 ≤ |s| ≤ 50 va |s| juft", "s har doim to‘g‘ri joylashgan qavslar ketma-ketligi", "s faqat '(' va ')' belgilaridan iborat", "baho 2^24 ga yetadi va 64-bitli turga sig‘adi"],
  sampleInputs: ["(()(()))\n", "()()\n"],
  expect: ["6\n", "2\n"],
  sampleNotesUz: [
    "Ichkarida () va (()) turibdi; ularning bahosi 1 va 2, yig‘indisi 3. Ular tashqi qavs ichida bo‘lgani uchun baho ikkilanadi va 6 chiqadi.",
    "Ikkita mustaqil () bir-birining ketidan kelgan, ya'ni bahosi 1 + 1 = 2.",
  ],
  sampleNotesEn: [
    "Inside sit () and (()), scoring 1 and 2, which add to 3. They stand within an outer pair, so the score doubles to 6.",
    "Two independent () sequences follow one another, so the score is 1 + 1 = 2.",
  ],
  testInputs: ["(()(()))\n", "()()\n", "()\n", "(())\n", "((()))\n", "(()())\n"],
  sol: `string s;cin>>s;vector<long long>st;st.push_back(0);
for(char c:s){
 if(c=='('){st.push_back(0);continue;}
 long long v=st.back();st.pop_back();
 st.back()+=(v==0)?1:2*v;}
cout<<st.back()<<"\\n";`,
  wrongNote: "Counting the pairs and doubling by the depth once at the end mixes the levels of independent sequences together; doubling every closing bracket regardless of what it encloses turns an empty pair into a zero.",
  wrong: [
    `string s;cin>>s;long long depth=0,best=0,pairs=0;
for(size_t i=0;i<s.size();++i){
 if(s[i]=='(')++depth;
 else{
  if(i>0&&s[i-1]=='('){++pairs;best=max(best,depth);}
  --depth;}}
long long p=1;
for(long long i=1;i<best;++i)p*=2;
cout<<(pairs*p)<<"\\n";`,
    `string s;cin>>s;vector<long long>st;st.push_back(0);
for(char c:s){
 if(c=='('){st.push_back(0);continue;}
 long long v=st.back();st.pop_back();
 st.back()+=2*v;}
cout<<st.back()<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B458", judge: "bs-min-max-adjacent-after-inserts", topic: "binary-search", rating: 1700,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Ustunlar orasiga yangi belgilar qo‘yish",
  en: "Adding posts between the markers",
  statementUz: "Yo‘l bo‘ylab n ta belgi o‘sish tartibidagi koordinatalarda turibdi. Yo‘lga yana k ta yangi belgi qo‘yish mumkin — ularning koordinatasi butun son bo‘lishi shart emas. Qo‘shni belgilar orasidagi eng katta masofani imkon qadar kichik qilish kerak. O‘sha eng katta masofa qanday bo‘lishini o‘n mingdan bir aniqlikda chiqaring.",
  statementEn: "There are n markers along a road at increasing coordinates. You may add k new markers, whose coordinates need not be whole numbers. The aim is to make the largest gap between neighbouring markers as small as possible. Print what that largest gap becomes, to within one ten-thousandth.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda o‘sish tartibida n ta butun koordinata keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains the n coordinates in increasing order.",
  outputUz: "Yagona haqiqiy sonni oltita kasr xonasi bilan chiqaring — qo‘shnilar orasidagi eng katta masofaning eng kichik qiymati.",
  outputEn: "Print a single real number with six digits after the point — the smallest achievable largest gap.",
  constraintList: ["2 ≤ n ≤ 10^5", "0 ≤ k ≤ 10^5", "0 ≤ coordinates ≤ 10^9 and they increase strictly", "a new marker may sit at any real coordinate", "an answer within 10^-4 of the true value is accepted"],
  constraintListUz: ["2 ≤ n ≤ 10^5", "0 ≤ k ≤ 10^5", "0 ≤ koordinatalar ≤ 10^9 va ular qat'iy o‘sadi", "yangi belgi ixtiyoriy haqiqiy koordinatada tura oladi", "haqiqiy qiymatdan 10^-4 gacha farq qiluvchi javob qabul qilinadi"],
  sampleInputs: ["3 1\n0 4 10\n", "2 0\n0 7\n"],
  expect: ["4.000000\n", "7.000000\n"],
  sampleNotesUz: [
    "Oraliqlar 4 va 6. Yagona yangi belgini 6 uzunlikdagi oraliqning o‘rtasiga qo‘ysak, u ikkita 3 ga bo‘linadi va eng katta masofa 4 bo‘lib qoladi.",
    "Yangi belgi qo‘yishga ruxsat yo‘q, shuning uchun yagona oraliq o‘zgarmaydi va javob 7.",
  ],
  sampleNotesEn: [
    "The gaps are 4 and 6. Putting the one new marker in the middle of the gap of 6 splits it into two of 3, leaving the largest gap at 4.",
    "No marker may be added, so the only gap stays as it is and the answer is 7.",
  ],
  testInputs: ["3 1\n0 4 10\n", "2 0\n0 7\n", "2 1\n0 10\n", "2 9\n0 10\n", "4 2\n0 1 2 3\n", "3 5\n0 1000000000 2000000000\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
double lo=0,hi=0;
for(long long i=1;i<n;++i)hi=max(hi,(double)(a[i]-a[i-1]));
for(int it=0;it<100;++it){
 double mid=(lo+hi)/2;
 if(mid<=0){lo=mid;continue;}
 long long need=0;
 for(long long i=1;i<n;++i){
  double g=(double)(a[i]-a[i-1]);
  need+=(long long)ceil(g/mid)-1;
  if(need>k)break;}
 if(need<=k)hi=mid;else lo=mid;}
printf("%.6f\\n",hi);`,
  wrongNote: "Spreading the new markers evenly over the whole road ignores that a gap can only be split where markers already stand; putting every new marker into the single widest gap never touches the second widest, which then decides the answer.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
double total=(double)(a[n-1]-a[0]);
printf("%.6f\\n",total/(double)(n-1+k));`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
double widest=0;
for(long long i=1;i<n;++i)widest=max(widest,(double)(a[i]-a[i-1]));
printf("%.6f\\n",widest/(double)(k+1));`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B459", judge: "graph-topo-count-fixed-order", topic: "graphs", rating: 1800,
  tag: "Topological sort", timeLimitMs: 1000,
  uz: "Tartib yagonami",
  en: "Is the order the only one",
  statementUz: "Sizga n ta uchi va m ta yo‘naltirilgan qirrasi bo‘lgan siklsiz graf berilgan. Uning topologik tartibi yagonami, aniqlang. Topologik tartib deganda har bir qirra oldingi uchdan keyingisiga yo‘naladigan joylashuv tushuniladi. Tartib yagona bo‘lishi uchun har bir qadamda kirish darajasi nolga teng bo‘lgan aynan bitta uch qolishi kerak.",
  statementEn: "You are given a directed graph with n vertices and m edges and no cycles. Determine whether its topological order is unique. A topological order is an arrangement in which every edge runs from an earlier vertex to a later one. The order is unique exactly when at every step there is exactly one vertex left with no incoming edge.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a uchdan b uchga yo‘naltirilgan qirra keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains a directed edge from a to b.",
  outputUz: "Topologik tartib yagona bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if the topological order is unique and NO otherwise, in capital letters.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n and a ≠ b", "the graph contains no directed cycle", "a graph of one vertex has a unique order"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n va a ≠ b", "grafda yo‘naltirilgan sikl yo‘q", "bitta uchli grafda tartib yagona"],
  sampleInputs: ["3 2\n1 2\n2 3\n", "3 1\n1 2\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "Yagona mumkin bo‘lgan tartib 1, 2, 3. Har bir qadamda kirish darajasi nol bo‘lgan bitta uch qoladi, shuning uchun javob YES.",
    "3-uchga hech qanday qirra tegmaydi, ya'ni uni 1 dan oldin ham, keyin ham qo‘yish mumkin. Bir nechta tartib bor, javob NO.",
  ],
  sampleNotesEn: [
    "The only possible order is 1, 2, 3. At every step exactly one vertex has no incoming edge, so the answer is YES.",
    "No edge touches vertex 3, so it may be placed before or after vertex 1. Several orders exist, so the answer is NO.",
  ],
  testInputs: ["3 2\n1 2\n2 3\n", "3 1\n1 2\n", "1 0\n", "2 0\n", "4 3\n1 2\n2 3\n3 4\n", "4 4\n1 2\n1 3\n2 4\n3 4\n"],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>g(n);vector<int>indeg(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++indeg[b];}
vector<int>ready;
for(int v=0;v<n;++v)if(indeg[v]==0)ready.push_back(v);
int done=0;bool uniq=true;
while(!ready.empty()){
 if(ready.size()>1)uniq=false;
 int v=ready.back();ready.pop_back();++done;
 for(int u:g[v])if(--indeg[u]==0)ready.push_back(u);}
cout<<((uniq&&done==n)?"YES":"NO")<<"\\n";`,
  wrongNote: "Counting the vertices with no incoming edge only at the start misses a later step where two become ready at once; requiring one fewer edge than vertices is necessary for a unique order but says nothing about how those edges are arranged.",
  wrong: [
    `int n,m;cin>>n>>m;vector<int>indeg(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;++indeg[b];}
int zero=0;
for(int v=0;v<n;++v)if(indeg[v]==0)++zero;
cout<<((zero==1)?"YES":"NO")<<"\\n";`,
    `int n,m;cin>>n>>m;
for(int i=0;i<m;++i){int a,b;cin>>a>>b;}
cout<<((m>=n-1)?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C460", judge: "matrix-power-count-walks", topic: "math", rating: 2000,
  tag: "Matrix exponentiation", timeLimitMs: 2000,
  uz: "Uzunligi k bo‘lgan yurishlar soni",
  en: "The number of walks of length k",
  statementUz: "Sizga n ta uchi bo‘lgan yo‘naltirilgan graf qo‘shnilik matritsasi ko‘rinishida berilgan. 1-uchdan n-uchgacha aynan k ta qirradan o‘tuvchi yurishlar nechtaligini 10^9 + 7 modul bo‘yicha sanang. Yurishda uchlar va qirralar takrorlanishi mumkin. k juda katta bo‘lgani uchun matritsani darajaga ko‘tarish usulidan foydalanish kerak.",
  statementEn: "You are given a directed graph with n vertices as an adjacency matrix. Count, modulo 10^9 + 7, the walks from vertex 1 to vertex n that use exactly k edges. A walk may repeat vertices and edges. Since k is very large, the matrix has to be raised to a power rather than stepped through.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Keyingi n qatorning har birida 0 va 1 lardan iborat n ta son keladi.",
  inputEn: "The first line contains two integers n and k. Each of the next n lines contains n numbers, each 0 or 1.",
  outputUz: "Yagona butun sonni chiqaring — uzunligi k bo‘lgan yurishlar sonining 10^9 + 7 bo‘yicha qoldig‘i.",
  outputEn: "Print a single integer — the number of walks of length k, modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 50", "0 ≤ k ≤ 10^18", "each matrix entry is 0 or 1", "a walk may repeat vertices and edges", "a walk of length 0 exists only when the start and the end coincide"],
  constraintListUz: ["1 ≤ n ≤ 50", "0 ≤ k ≤ 10^18", "matritsaning har bir katagi 0 yoki 1", "yurishda uchlar va qirralar takrorlanishi mumkin", "uzunligi 0 bo‘lgan yurish faqat boshi va oxiri ustma-ust tushganda mavjud"],
  sampleInputs: ["2 2\n0 1\n1 0\n", "2 1\n0 1\n1 0\n"],
  expect: ["0\n", "1\n"],
  sampleNotesUz: [
    "Ikki qadamda 1-uchdan chiqib yana 1-uchga qaytiladi, 2-uchga esa yetib bo‘lmaydi. Shuning uchun javob 0.",
    "Bitta qadamda 1-uchdan 2-uchga aynan bitta yo‘l bor, javob 1.",
  ],
  sampleNotesEn: [
    "Two steps lead from vertex 1 back to vertex 1 and cannot reach vertex 2, so the answer is 0.",
    "One step leads from vertex 1 to vertex 2 in exactly one way, so the answer is 1.",
  ],
  testInputs: [
    "2 2\n0 1\n1 0\n",
    "2 1\n0 1\n1 0\n",
    "1 0\n0\n",
    "1 5\n1\n",
    "3 2\n0 1 1\n0 0 1\n0 0 0\n",
    "3 1000000000000000000\n1 1 1\n1 1 1\n1 1 1\n",
  ],
  sol: `long long n,k;cin>>n>>k;const long long M=1000000007;
vector<vector<long long>>A(n,vector<long long>(n,0));
for(long long i=0;i<n;++i)for(long long j=0;j<n;++j)cin>>A[i][j];
auto mul=[&](const vector<vector<long long>>&X,const vector<vector<long long>>&Y){
 vector<vector<long long>>Z(n,vector<long long>(n,0));
 for(long long i=0;i<n;++i)for(long long t=0;t<n;++t){
  if(!X[i][t])continue;
  for(long long j=0;j<n;++j)Z[i][j]=(Z[i][j]+X[i][t]*Y[t][j])%M;}
 return Z;};
vector<vector<long long>>R(n,vector<long long>(n,0));
for(long long i=0;i<n;++i)R[i][i]=1;
long long e=k;
while(e>0){
 if(e&1)R=mul(R,A);
 A=mul(A,A);e>>=1;}
cout<<R[0][n-1]<<"\\n";`,
  wrongNote: "Stepping the vector forward k times cannot finish when k reaches its limit, and capping the number of steps answers a shorter walk instead; leaving the identity out of the power turns a walk of length zero into an impossible one.",
  wrong: [
    `long long n,k;cin>>n>>k;const long long M=1000000007;
vector<vector<long long>>A(n,vector<long long>(n,0));
for(long long i=0;i<n;++i)for(long long j=0;j<n;++j)cin>>A[i][j];
vector<long long>cur(n,0);cur[0]=1;
long long steps=min(k,(long long)1000);
for(long long s=0;s<steps;++s){
 vector<long long>nx(n,0);
 for(long long i=0;i<n;++i){
  if(!cur[i])continue;
  for(long long j=0;j<n;++j)if(A[i][j])nx[j]=(nx[j]+cur[i])%M;}
 cur=nx;}
cout<<cur[n-1]<<"\\n";`,
    `long long n,k;cin>>n>>k;const long long M=1000000007;
vector<vector<long long>>A(n,vector<long long>(n,0));
for(long long i=0;i<n;++i)for(long long j=0;j<n;++j)cin>>A[i][j];
auto mul=[&](const vector<vector<long long>>&X,const vector<vector<long long>>&Y){
 vector<vector<long long>>Z(n,vector<long long>(n,0));
 for(long long i=0;i<n;++i)for(long long t=0;t<n;++t){
  if(!X[i][t])continue;
  for(long long j=0;j<n;++j)Z[i][j]=(Z[i][j]+X[i][t]*Y[t][j])%M;}
 return Z;};
vector<vector<long long>>R=A;
long long e=k;
while(e>1){
 R=mul(R,A);--e;
 if(e>60)e=60;}
cout<<R[0][n-1]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C461", judge: "tree-max-edge-on-path-queries", topic: "trees", rating: 2100,
  tag: "Binary lifting", timeLimitMs: 2000,
  uz: "Yo‘ldagi eng og‘ir qirra",
  en: "The heaviest edge on the path",
  statementUz: "Sizga n ta uchi bo‘lgan og‘irlikli daraxt va q ta so‘rov berilgan. Har bir so‘rov ikkita uchni beradi va ular orasidagi yagona yo‘lda eng og‘ir qirraning og‘irligini so‘raydi. So‘rovlar ko‘p bo‘lgani uchun har birini alohida yurib chiqib bo‘lmaydi: har bir uch uchun ikki darajali sakrashlarni va o‘sha sakrashdagi eng og‘ir qirrani oldindan hisoblab qo‘yish kerak. Ikkala uch bir xil bo‘lsa, javob 0 bo‘ladi.",
  statementEn: "You are given a weighted tree with n vertices and q queries. Each query names two vertices and asks for the weight of the heaviest edge on the single path between them. There are too many queries to walk each path, so the jumps of every power of two — and the heaviest edge along each jump — have to be precomputed for every vertex. When the two vertices coincide the answer is 0.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Keyingi n − 1 qatorda a, b va w qirralari, so‘ng q qatorda u va v so‘rovlari keladi.",
  inputEn: "The first line contains two integers n and q. The next n − 1 lines each contain an edge a b w, and the following q lines each contain a query u v.",
  outputUz: "Har bir so‘rov uchun alohida qatorda yo‘ldagi eng og‘ir qirraning og‘irligini chiqaring.",
  outputEn: "For each query print the weight of the heaviest edge on the path, on its own line.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ q ≤ 10^5", "1 ≤ a, b, u, v ≤ n and a ≠ b", "1 ≤ w ≤ 10^9", "a query whose two vertices coincide answers 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ q ≤ 10^5", "1 ≤ a, b, u, v ≤ n va a ≠ b", "1 ≤ w ≤ 10^9", "ikkala uchi bir xil so‘rov uchun javob 0"],
  sampleInputs: ["4 2\n1 2 5\n2 3 1\n3 4 9\n1 4\n1 3\n", "1 1\n1 1\n"],
  expect: ["9\n5\n", "0\n"],
  sampleNotesUz: [
    "1 dan 4 gacha yo‘lda 5, 1 va 9 og‘irlikdagi qirralar bor; eng og‘iri 9. 1 dan 3 gacha esa 5 va 1 bor, eng og‘iri 5.",
    "Yagona uch bor va so‘rov o‘sha uchning o‘ziga, ya'ni yo‘lda birorta qirra yo‘q. Javob 0.",
  ],
  sampleNotesEn: [
    "The path from 1 to 4 crosses edges of weight 5, 1 and 9, the heaviest being 9. The path from 1 to 3 crosses 5 and 1, the heaviest being 5.",
    "There is one vertex and the query asks about that vertex itself, so the path holds no edge and the answer is 0.",
  ],
  testInputs: [
    "4 2\n1 2 5\n2 3 1\n3 4 9\n1 4\n1 3\n",
    "1 1\n1 1\n",
    "2 2\n1 2 7\n1 2\n2 2\n",
    "5 3\n1 2 1\n1 3 2\n2 4 3\n2 5 4\n4 5\n3 4\n3 5\n",
    "6 2\n1 2 10\n2 3 1\n1 4 2\n4 5 20\n5 6 3\n3 6\n2 4\n",
    "3 1\n1 2 1000000000\n2 3 1\n1 3\n",
  ],
  sol: `int n,q;cin>>n>>q;
vector<vector<pair<int,long long>>>g(n);
for(int i=0;i+1<n;++i){int a,b;long long w;cin>>a>>b>>w;--a;--b;
 g[a].push_back(make_pair(b,w));g[b].push_back(make_pair(a,w));}
int LOG=1;while((1<<LOG)<n)++LOG;++LOG;
vector<vector<int>>up(LOG,vector<int>(n,0));
vector<vector<long long>>mx(LOG,vector<long long>(n,0));
vector<int>dep(n,0),order;order.reserve(n);
vector<char>seen(n,0);vector<int>st{0};seen[0]=1;up[0][0]=0;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(size_t i=0;i<g[v].size();++i){int u=g[v][i].first;long long w=g[v][i].second;
  if(seen[u])continue;
  seen[u]=1;dep[u]=dep[v]+1;up[0][u]=v;mx[0][u]=w;st.push_back(u);}}
for(int j=1;j<LOG;++j)for(int v=0;v<n;++v){
 up[j][v]=up[j-1][up[j-1][v]];
 mx[j][v]=max(mx[j-1][v],mx[j-1][up[j-1][v]]);}
string out;
for(int t=0;t<q;++t){int u,v;cin>>u>>v;--u;--v;
 long long best=0;
 if(dep[u]<dep[v])swap(u,v);
 int diff=dep[u]-dep[v];
 for(int j=0;j<LOG;++j)if((diff>>j)&1){best=max(best,mx[j][u]);u=up[j][u];}
 if(u!=v){
  for(int j=LOG-1;j>=0;--j)if(up[j][u]!=up[j][v]){
   best=max(best,mx[j][u]);best=max(best,mx[j][v]);
   u=up[j][u];v=up[j][v];}
  best=max(best,mx[0][u]);best=max(best,mx[0][v]);}
 out+=to_string(best);out+="\\n";}
cout<<out;`,
  wrongNote: "Stopping the climb once the two vertices sit at the same depth skips the stretch above that point, which is where the heaviest edge often is; forgetting the last edge into the meeting vertex leaves one edge of the path unmeasured.",
  wrong: [
    `int n,q;cin>>n>>q;
vector<vector<pair<int,long long>>>g(n);
for(int i=0;i+1<n;++i){int a,b;long long w;cin>>a>>b>>w;--a;--b;
 g[a].push_back(make_pair(b,w));g[b].push_back(make_pair(a,w));}
int LOG=1;while((1<<LOG)<n)++LOG;++LOG;
vector<vector<int>>up(LOG,vector<int>(n,0));
vector<vector<long long>>mx(LOG,vector<long long>(n,0));
vector<int>dep(n,0);
vector<char>seen(n,0);vector<int>st{0};seen[0]=1;up[0][0]=0;
while(!st.empty()){int v=st.back();st.pop_back();
 for(size_t i=0;i<g[v].size();++i){int u=g[v][i].first;long long w=g[v][i].second;
  if(seen[u])continue;
  seen[u]=1;dep[u]=dep[v]+1;up[0][u]=v;mx[0][u]=w;st.push_back(u);}}
for(int j=1;j<LOG;++j)for(int v=0;v<n;++v){
 up[j][v]=up[j-1][up[j-1][v]];
 mx[j][v]=max(mx[j-1][v],mx[j-1][up[j-1][v]]);}
string out;
for(int t=0;t<q;++t){int u,v;cin>>u>>v;--u;--v;
 long long best=0;
 if(dep[u]<dep[v])swap(u,v);
 int diff=dep[u]-dep[v];
 for(int j=0;j<LOG;++j)if((diff>>j)&1){best=max(best,mx[j][u]);u=up[j][u];}
 out+=to_string(best);out+="\\n";}
cout<<out;`,
    `int n,q;cin>>n>>q;
vector<vector<pair<int,long long>>>g(n);
for(int i=0;i+1<n;++i){int a,b;long long w;cin>>a>>b>>w;--a;--b;
 g[a].push_back(make_pair(b,w));g[b].push_back(make_pair(a,w));}
int LOG=1;while((1<<LOG)<n)++LOG;++LOG;
vector<vector<int>>up(LOG,vector<int>(n,0));
vector<vector<long long>>mx(LOG,vector<long long>(n,0));
vector<int>dep(n,0);
vector<char>seen(n,0);vector<int>st{0};seen[0]=1;up[0][0]=0;
while(!st.empty()){int v=st.back();st.pop_back();
 for(size_t i=0;i<g[v].size();++i){int u=g[v][i].first;long long w=g[v][i].second;
  if(seen[u])continue;
  seen[u]=1;dep[u]=dep[v]+1;up[0][u]=v;mx[0][u]=w;st.push_back(u);}}
for(int j=1;j<LOG;++j)for(int v=0;v<n;++v){
 up[j][v]=up[j-1][up[j-1][v]];
 mx[j][v]=max(mx[j-1][v],mx[j-1][up[j-1][v]]);}
string out;
for(int t=0;t<q;++t){int u,v;cin>>u>>v;--u;--v;
 long long best=0;
 if(dep[u]<dep[v])swap(u,v);
 int diff=dep[u]-dep[v];
 for(int j=0;j<LOG;++j)if((diff>>j)&1){best=max(best,mx[j][u]);u=up[j][u];}
 if(u!=v){
  for(int j=LOG-1;j>=0;--j)if(up[j][u]!=up[j][v]){
   best=max(best,mx[j][u]);best=max(best,mx[j][v]);
   u=up[j][u];v=up[j][v];}}
 out+=to_string(best);out+="\\n";}
cout<<out;`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C462", judge: "adv-count-subarrays-bounded-max", topic: "advanced-cp", rating: 2300,
  tag: "Counting with two sweeps", timeLimitMs: 2000,
  uz: "Maksimumi oraliqqa tushgan qismlar",
  en: "The stretches whose largest value lands in the range",
  statementUz: "Sizga n ta butun sondan iborat massiv va ikkita L, R chegarasi berilgan. Ketma-ket turgan shunday bo‘sh bo‘lmagan qismlar sonini toping-ki, ulardagi eng katta element L dan kichik bo‘lmasin va R dan katta bo‘lmasin. Har bir qismni alohida tekshirish sekin; maksimumi R dan oshmaydigan qismlar sonidan maksimumi L dan kichik bo‘lganlarini ayirish kifoya, va ularning har birini bitta yurishda sanash mumkin.",
  statementEn: "You are given an array of n integers and two bounds L and R. Count the non-empty stretches of consecutive elements whose largest value is not below L and not above R. Checking each stretch is too slow; instead subtract the number of stretches whose maximum stays under L from the number whose maximum stays at most R, and each of those counts falls out of a single sweep.",
  inputUz: "Birinchi qatorda uchta n, L va R butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains three integers n, L and R. The second line contains n integers.",
  outputUz: "Yagona butun sonni chiqaring — maksimumi [L, R] oralig‘iga tushgan qismlar soni.",
  outputEn: "Print a single integer — the number of stretches whose maximum lies in the range [L, R].",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ L ≤ R ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "the stretch must be non-empty and consecutive", "the answer reaches 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ L ≤ R ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "qism bo‘sh bo‘lmagan va ketma-ket bo‘lishi shart", "javob 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["3 2 3\n2 1 4\n", "3 1 10\n1 2 3\n"],
  expect: ["2\n", "6\n"],
  sampleNotesUz: [
    "Oltita qism va ularning maksimumlari: [2] → 2, [1] → 1, [4] → 4, [2,1] → 2, [1,4] → 4, [2,1,4] → 4. Maksimumi 2 bilan 3 orasida bo‘lgani faqat [2] va [2,1], shuning uchun javob 2.",
    "Barcha oltita qismning maksimumi 1 bilan 10 orasida, shuning uchun hammasi sanaladi va javob 6.",
  ],
  sampleNotesEn: [
    "The six stretches and their maxima are [2] → 2, [1] → 1, [4] → 4, [2,1] → 2, [1,4] → 4 and [2,1,4] → 4. Only [2] and [2,1] have a maximum between 2 and 3, so the answer is 2.",
    "All six stretches have a maximum between 1 and 10, so every one of them counts and the answer is 6.",
  ],
  testInputs: [
    "3 2 3\n2 1 4\n",
    "3 1 10\n1 2 3\n",
    "1 5 5\n5\n",
    "1 1 2\n5\n",
    "5 2 4\n1 2 3 4 5\n",
    "6 -1 0\n-2 -1 0 1 0 -1\n",
  ],
  sol: `long long n,L,R;cin>>n>>L>>R;vector<long long>a(n);for(auto&x:a)cin>>x;
auto atMost=[&](long long lim){long long total=0,run=0;
 for(long long i=0;i<n;++i){
  if(a[i]<=lim)++run;else run=0;
  total+=run;}
 return total;};
cout<<(atMost(R)-atMost(L-1))<<"\\n";`,
  wrongNote: "Counting the stretches whose maximum stays at most R without removing those that never reach L includes every stretch made only of small values; comparing against L rather than the value just below it drops the stretches whose maximum is exactly L.",
  wrong: [
    `long long n,L,R;cin>>n>>L>>R;vector<long long>a(n);for(auto&x:a)cin>>x;
auto atMost=[&](long long lim){long long total=0,run=0;
 for(long long i=0;i<n;++i){
  if(a[i]<=lim)++run;else run=0;
  total+=run;}
 return total;};
cout<<atMost(R)<<"\\n";`,
    `long long n,L,R;cin>>n>>L>>R;vector<long long>a(n);for(auto&x:a)cin>>x;
auto atMost=[&](long long lim){long long total=0,run=0;
 for(long long i=0;i<n;++i){
  if(a[i]<=lim)++run;else run=0;
  total+=run;}
 return total;};
cout<<(atMost(R)-atMost(L))<<"\\n";`,
  ],
});

export default P;
