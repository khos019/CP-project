/* Batch 413 — ten problems, A413–C422.
 *
 * Digits and grids at the bottom, an even-split of a tree and a rerooting at
 * the top; C422 is the batch's insane entry.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A413", judge: "num-digit-spread", topic: "programming-basics", rating: 800,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Raqamlarning tarqoqligi",
  en: "The spread of the digits",
  statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan. Uning o‘nlik yozuvidagi eng katta raqamdan eng kichik raqamni ayiring va natijani chiqaring. Masalan, 5091 sonida eng katta raqam 9, eng kichigi 0, ya'ni javob 9 bo‘ladi. Barcha raqamlari bir xil bo‘lgan sonda bu ayirma nolga teng chiqadi.",
  statementEn: "You are given a non-negative integer n. Subtract the smallest digit of its decimal form from the largest one and print the result. For example, in 5091 the largest digit is 9 and the smallest is 0, so the answer is 9. For a number whose digits are all the same this difference comes out as zero.",
  inputUz: "Yagona qatorda bitta manfiy bo‘lmagan n butun soni beriladi.",
  inputEn: "The only line contains one non-negative integer n.",
  outputUz: "Yagona butun sonni chiqaring — eng katta raqam bilan eng kichik raqamning ayirmasi.",
  outputEn: "Print a single integer — the largest digit minus the smallest digit.",
  constraintList: ["0 ≤ n ≤ 10^18", "n is written without leading zeros", "the answer lies between 0 and 9"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "n boshida nolsiz yoziladi", "javob 0 bilan 9 orasida bo‘ladi"],
  sampleInputs: ["5091\n", "777\n"],
  expect: ["9\n", "0\n"],
  sampleNotesUz: [
    "5091 sonining raqamlari 5, 0, 9 va 1. Eng kattasi 9, eng kichigi 0, ayirma esa 9.",
    "Barcha raqamlar 7 ga teng, ya'ni eng katta ham, eng kichik ham 7. Ularning ayirmasi 0.",
  ],
  sampleNotesEn: [
    "The digits of 5091 are 5, 0, 9 and 1. The largest is 9 and the smallest is 0, so the difference is 9.",
    "Every digit is a 7, so the largest and the smallest are both 7 and their difference is 0.",
  ],
  testInputs: ["5091\n", "777\n", "0\n", "10\n", "1000000000000000000\n", "12345\n"],
  sol: `string s;cin>>s;int mx=0,mn=9;
for(char c:s){int d=c-'0';if(d>mx)mx=d;if(d<mn)mn=d;}
cout<<(mx-mn)<<"\\n";`,
  wrongNote: "Starting the smallest digit at zero pins it there whatever the number holds, so the answer becomes the largest digit alone; the first and the last digit say nothing about the digits between them.",
  wrong: [
    `string s;cin>>s;int mx=0,mn=0;
for(char c:s){int d=c-'0';if(d>mx)mx=d;}
cout<<(mx-mn)<<"\\n";`,
    `string s;cin>>s;
int a=s.front()-'0',b=s.back()-'0';
cout<<((a>b)?(a-b):(b-a))<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A414", judge: "grid-count-border-cells", topic: "foundations", rating: 1000,
  tag: "Matrices", timeLimitMs: 1000,
  uz: "Chekkadagi birlar",
  en: "The ones along the border",
  statementUz: "Sizga n satr va m ustundan iborat, 0 va 1 lardan tuzilgan jadval berilgan. Jadvalning chekkasida — ya'ni birinchi yoki oxirgi satrda, yoxud birinchi yoki oxirgi ustunda — turgan birlar sonini sanang. Burchakdagi katak ham bir marta sanaladi, garchi u ikkita chekkaga tegishli bo‘lsa ham. Jadval bitta satr yoki bitta ustundan iborat bo‘lsa, uning barcha kataklari chekkada hisoblanadi.",
  statementEn: "You are given a table of n rows and m columns filled with 0s and 1s. Count the 1s standing on the border, that is, in the first or last row or in the first or last column. A corner cell is counted once even though it belongs to two borders. If the table has a single row or a single column then all of its cells are on the border.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi n qatorning har birida probel bilan ajratilgan m ta son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next n lines contains m numbers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — chekkada turgan birlar soni.",
  outputEn: "Print a single integer — the number of 1s standing on the border.",
  constraintList: ["1 ≤ n, m ≤ 500", "each entry is 0 or 1", "a corner cell is counted once", "with one row or one column every cell is a border cell"],
  constraintListUz: ["1 ≤ n, m ≤ 500", "har bir katak 0 yoki 1", "burchak katak bir marta sanaladi", "bitta satr yoki bitta ustunda barcha kataklar chekkada"],
  sampleInputs: ["3 3\n1 1 1\n1 1 1\n1 1 1\n", "1 4\n1 0 1 1\n"],
  expect: ["8\n", "3\n"],
  sampleNotesUz: [
    "Jadvaldagi to‘qqizta katakning hammasi 1, lekin markazdagi katak chekkada emas. Shuning uchun javob 9 emas, 8.",
    "Jadval bitta satrdan iborat, ya'ni barcha to‘rtta katak chekkada. Ulardan uchtasi 1, javob 3.",
  ],
  sampleNotesEn: [
    "All nine cells hold a 1, but the centre cell is not on the border, so the answer is 8 rather than 9.",
    "The table is a single row, so all four cells are border cells. Three of them hold a 1, so the answer is 3.",
  ],
  testInputs: ["3 3\n1 1 1\n1 1 1\n1 1 1\n", "1 4\n1 0 1 1\n", "1 1\n1\n", "2 2\n1 1\n1 1\n", "4 1\n1\n0\n1\n1\n", "4 4\n1 0 0 1\n0 1 1 0\n0 1 1 0\n1 0 0 1\n"],
  sol: `int n,m;cin>>n>>m;long long c=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j){int v;cin>>v;
 if(v&&(i==0||i==n-1||j==0||j==m-1))++c;}
cout<<c<<"\\n";`,
  wrongNote: "Adding the four sides up separately counts each corner twice, and counts a single row twice over; the whole table minus its interior is right only when the interior is a real rectangle.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
long long c=0;
for(int j=0;j<m;++j){c+=a[0][j];c+=a[n-1][j];}
for(int i=0;i<n;++i){c+=a[i][0];c+=a[i][m-1];}
cout<<c<<"\\n";`,
    `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
long long all=0,inner=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j)all+=a[i][j];
for(int i=1;i+1<n;++i)for(int j=1;j+1<m;++j)inner+=a[i][j];
cout<<(all-inner-1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B415", judge: "str-count-same-end-substrings", topic: "strings", rating: 1200,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Chetlari bir xil bo‘lgan qismlar",
  en: "The substrings that begin and end alike",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning nechta bo‘sh bo‘lmagan ketma-ket qismida birinchi va oxirgi harf bir xil ekanini sanang. Bitta harfdan iborat qism ham hisobga olinadi, chunki unda birinchi va oxirgi harf aynan bitta. Turli pozitsiyalarda turgan bir xil ko‘rinishdagi qismlar alohida sanaladi.",
  statementEn: "You are given a string s of lowercase Latin letters. Count how many of its non-empty consecutive substrings begin and end with the same letter. A substring of one letter counts too, since its first and last letter are the very same one. Equal-looking substrings taken at different positions are counted separately.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — birinchi va oxirgi harfi bir xil bo‘lgan qismlar soni.",
  outputEn: "Print a single integer — the number of substrings whose first and last letters are equal.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the letters 'a'–'z'", "a substring of one letter is counted", "the answer reaches 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s 'a'–'z' harflaridan iborat", "bitta harfli qism ham sanaladi", "javob 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["abcab\n", "aaa\n"],
  expect: ["7\n", "6\n"],
  sampleNotesUz: [
    "Beshta bitta harfli qism sanaladi. Bundan tashqari birinchi a bilan to‘rtinchi a orasidagi qism va ikkinchi b bilan beshinchi b orasidagi qism bor — jami 7.",
    "Uchta bitta harfli qism, ikkita ikki harfli qism va bitta uch harfli qism — barchasining chetlari a. Jami 6.",
  ],
  sampleNotesEn: [
    "The five one-letter substrings all count. Beyond them there is the stretch from the first a to the fourth a and the one from the second b to the fifth b — seven in all.",
    "Three one-letter substrings, two of length two and one of length three — every one of them is bounded by an a. That is 6.",
  ],
  testInputs: ["abcab\n", "aaa\n", "a\n", "abc\n", "zzzz\n", "abcabcabc\n"],
  sol: `string s;cin>>s;vector<long long>cnt(26,0);
for(char c:s)++cnt[c-'a'];
long long t=0;
for(int i=0;i<26;++i)t+=cnt[i]*(cnt[i]+1)/2;
cout<<t<<"\\n";`,
  wrongNote: "Counting the single letters plus the equal neighbours misses every pair of matching letters standing further apart; the pair count alone leaves out the one-letter substrings the statement asks to include.",
  wrong: [
    `string s;cin>>s;long long t=(long long)s.size();
for(size_t i=0;i+1<s.size();++i)if(s[i]==s[i+1])++t;
cout<<t<<"\\n";`,
    `string s;cin>>s;vector<long long>cnt(26,0);
for(char c:s)++cnt[c-'a'];
long long t=0;
for(int i=0;i<26;++i)t+=cnt[i]*(cnt[i]-1)/2;
cout<<t<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B416", judge: "greedy-min-increments-strict-increase", topic: "greedy", rating: 1400,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Qat'iy o‘suvchi qilish narxi",
  en: "The price of making the array strictly increasing",
  statementUz: "Sizga n ta musbat butun sondan iborat massiv berilgan. Bitta qadamda ixtiyoriy elementni birga oshirish mumkin; kamaytirishga ruxsat berilmaydi. Massivni qat'iy o‘suvchi qilish uchun kerak bo‘ladigan eng kam qadamlar sonini toping. Qat'iy o‘suvchi deganda har bir element o‘zidan oldingisidan qat'iy katta bo‘lishi tushuniladi, ya'ni teng qo‘shnilarga ham yo‘l qo‘yilmaydi.",
  statementEn: "You are given an array of n positive integers. In one step you may raise any element by one; lowering is not allowed. Find the smallest number of steps that makes the array strictly increasing, meaning every element must be strictly above the one before it, so even equal neighbours are not allowed.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n positive integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — massivni qat'iy o‘suvchi qilish uchun zarur qadamlarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of steps that makes the array strictly increasing.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "only raising is allowed, never lowering", "equal neighbours are not allowed either", "the answer reaches 10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a_i ≤ 10^9", "faqat oshirishga ruxsat beriladi, kamaytirishga emas", "teng qo‘shnilarga ham yo‘l qo‘yilmaydi", "javob 10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["3\n1 1 1\n", "3\n1 2 3\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Massivni 1 2 3 ko‘rinishiga keltiramiz: ikkinchi elementga bitta, uchinchisiga ikkita qadam kerak — jami 3. Ikkinchi elementni oshirgach, uchinchisi undan ham yuqoriga chiqishi kerakligini unutmaslik muhim.",
    "Massiv allaqachon qat'iy o‘suvchi, shuning uchun birorta qadam kerak emas va javob 0.",
  ],
  sampleNotesEn: [
    "The array is brought to 1 2 3: one step on the second element and two on the third, three in all. Once the second element has been raised, the third must climb above its new value too.",
    "The array is already strictly increasing, so no step is needed and the answer is 0.",
  ],
  testInputs: ["3\n1 1 1\n", "3\n1 2 3\n", "1\n5\n", "4\n5 1 1 1\n", "2\n1 1000000000\n", "5\n2 2 2 2 2\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long prev=a[0],steps=0;
for(int i=1;i<n;++i){
 long long need=prev+1;
 if(a[i]<need){steps+=need-a[i];prev=need;}
 else prev=a[i];}
cout<<steps<<"\\n";`,
  wrongNote: "Allowing an element to merely match the one before it leaves equal neighbours the statement forbids; measuring each shortfall against the original neighbour rather than its raised value understates every step after the first.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long prev=a[0],steps=0;
for(int i=1;i<n;++i){
 if(a[i]<prev){steps+=prev-a[i];}
 else prev=a[i];}
cout<<steps<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long steps=0;
for(int i=1;i<n;++i)if(a[i]<=a[i-1])steps+=a[i-1]-a[i]+1;
cout<<steps<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B417", judge: "prefix-longest-balanced-zero-one", topic: "foundations", rating: 1600,
  tag: "Prefix sums", timeLimitMs: 1000,
  uz: "Nol va birlari teng bo‘lgan eng uzun qism",
  en: "The longest stretch with as many zeros as ones",
  statementUz: "Sizga 0 va 1 lardan iborat satr berilgan. Ketma-ket turgan shunday eng uzun qismni toping-ki, undagi nollar soni birlar soniga teng bo‘lsin, va uning uzunligini chiqaring. Bunday qism topilmasa, javob 0 bo‘ladi. Qism ketma-ket belgilardan tuzilishi shart va uning uzunligi har doim juft bo‘ladi.",
  statementEn: "You are given a string of characters, each 0 or 1. Find the longest stretch of consecutive characters holding as many zeros as ones, and print its length. If no such stretch exists the answer is 0. The stretch must be made of consecutive characters, and its length is always even.",
  inputUz: "Yagona qatorda 0 va 1 lardan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of 0s and 1s.",
  outputUz: "Yagona butun sonni chiqaring — nol va birlari teng bo‘lgan eng uzun qismning uzunligi.",
  outputEn: "Print a single integer — the length of the longest stretch with equally many zeros and ones.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters '0' and '1'", "the stretch must be made of consecutive characters", "the answer is always even, and 0 when nothing balances"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s '0' va '1' belgilaridan iborat", "qism ketma-ket belgilardan tuzilishi shart", "javob har doim juft, muvozanatli qism bo‘lmasa 0"],
  sampleInputs: ["110100\n", "111\n"],
  expect: ["6\n", "0\n"],
  sampleNotesUz: [
    "Butun satrda uchta bir va uchta nol bor, ya'ni u o‘zi muvozanatli va uzunligi 6. Bundan uzunrog‘i bo‘lishi mumkin emas.",
    "Satrda birorta nol yo‘q, shuning uchun hech qanday qismda nollar soni birlar soniga teng bo‘la olmaydi. Javob 0.",
  ],
  sampleNotesEn: [
    "The whole string holds three ones and three zeros, so it is balanced on its own and its length is 6. Nothing can be longer.",
    "There is no zero anywhere in the string, so no stretch can hold as many zeros as ones, and the answer is 0.",
  ],
  testInputs: ["110100\n", "111\n", "01\n", "0\n", "1100110\n", "0001110\n"],
  sol: `string s;cin>>s;int n=(int)s.size();
map<long long,int>first;first[0]=-1;
long long bal=0;int best=0;
for(int i=0;i<n;++i){
 bal+=(s[i]=='1')?1:-1;
 auto it=first.find(bal);
 if(it==first.end())first[bal]=i;
 else best=max(best,i-it->second);}
cout<<best<<"\\n";`,
  wrongNote: "Remembering the latest place a prefix sum appeared measures the distance to the nearest repeat rather than the farthest; leaving out the empty prefix loses every balanced stretch that starts at the very beginning.",
  wrong: [
    `string s;cin>>s;int n=(int)s.size();
map<long long,int>last;last[0]=-1;
long long bal=0;int best=0;
for(int i=0;i<n;++i){
 bal+=(s[i]=='1')?1:-1;
 auto it=last.find(bal);
 if(it!=last.end())best=max(best,i-it->second);
 last[bal]=i;}
cout<<best<<"\\n";`,
    `string s;cin>>s;int n=(int)s.size();
map<long long,int>first;
long long bal=0;int best=0;
for(int i=0;i<n;++i){
 bal+=(s[i]=='1')?1:-1;
 auto it=first.find(bal);
 if(it==first.end())first[bal]=i;
 else best=max(best,i-it->second);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B418", judge: "stack-longest-valid-parens", topic: "data-structures", rating: 1700,
  tag: "Stack", timeLimitMs: 1000,
  uz: "Eng uzun to‘g‘ri qavsli qism",
  en: "The longest well-formed stretch of brackets",
  statementUz: "Sizga faqat ( va ) belgilaridan iborat satr berilgan. Uning ketma-ket turgan eng uzun to‘g‘ri qavsli qismining uzunligini toping. To‘g‘ri qavsli deganda har bir ochilgan qavs keyinroq yopilgan va har bir yopilgan qavsning oldida o‘ziga juft ochilgan qavs turgan satr tushuniladi. Bunday bo‘sh bo‘lmagan qism topilmasa, javob 0 bo‘ladi.",
  statementEn: "You are given a string made only of the characters ( and ). Find the length of its longest consecutive well-formed stretch of brackets. Well formed means every opening bracket is closed later on and every closing bracket has a matching opening one in front of it. If no non-empty such stretch exists the answer is 0.",
  inputUz: "Yagona qatorda ( va ) belgilaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of ( and ) characters.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun to‘g‘ri qavsli qismning uzunligi.",
  outputEn: "Print a single integer — the length of the longest well-formed stretch.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters '(' and ')' only", "the stretch must be made of consecutive characters", "the answer is always even, and 0 when nothing is well formed"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat '(' va ')' belgilaridan iborat", "qism ketma-ket belgilardan tuzilishi shart", "javob har doim juft, to‘g‘ri qism bo‘lmasa 0"],
  sampleInputs: [")()())\n", "(((\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Ikkinchi belgidan beshinchisigacha bo‘lgan ()() qismi to‘g‘ri va uzunligi 4. Boshdagi va oxirdagi yopuvchi qavslarga juft topilmaydi.",
    "Barcha qavslar ochiq qolgan, birortasi ham yopilmagan. Shuning uchun bo‘sh bo‘lmagan to‘g‘ri qism yo‘q va javob 0.",
  ],
  sampleNotesEn: [
    "The stretch ()() running from the second character to the fifth is well formed and has length 4. The closing brackets at the start and at the end find no partner.",
    "Every bracket is left open and none is closed, so there is no non-empty well-formed stretch and the answer is 0.",
  ],
  testInputs: [")()())\n", "(((\n", "()\n", "(()()\n", "(()())\n", ")))(((\n"],
  sol: `string s;cin>>s;int n=(int)s.size();
vector<int>st;st.push_back(-1);int best=0;
for(int i=0;i<n;++i){
 if(s[i]=='('){st.push_back(i);continue;}
 st.pop_back();
 if(st.empty())st.push_back(i);
 else best=max(best,i-st.back());}
cout<<best<<"\\n";`,
  wrongNote: "Pairing every opening bracket with every closing one ignores the order they arrive in, so it counts brackets that could never match; a single left-to-right balance never recovers the tail of a run that an unmatched opening bracket left hanging.",
  wrong: [
    `string s;cin>>s;long long o=0,c=0;
for(char ch:s){if(ch=='(')++o;else ++c;}
cout<<(2*min(o,c))<<"\\n";`,
    `string s;cin>>s;long long o=0,c=0,best=0;
for(char ch:s){
 if(ch=='(')++o;else ++c;
 if(o==c)best=max(best,2*c);
 else if(c>o){o=0;c=0;}}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B419", judge: "greedy-min-deletions-unique-freq", topic: "greedy", rating: 1800,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Chastotalarni har xil qilish",
  en: "Making every frequency different",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Undan eng kam nechta harfni o‘chirsangiz, qolgan satrda hech ikkita har xil harf bir xil marta uchramaydigan bo‘ladi — shuni toping. Umuman qolmagan harf hisobga olinmaydi, ya'ni bir nechta harf butunlay o‘chib ketishi mumkin.",
  statementEn: "You are given a string s of lowercase Latin letters. Find the smallest number of characters you must delete so that in what remains no two different letters occur the same number of times. A letter that disappears entirely is not counted, so several letters may be deleted completely.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — o‘chirilishi kerak bo‘lgan harflarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of characters that must be deleted.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the letters 'a'–'z'", "a letter deleted entirely is not counted among the frequencies", "several letters may end up deleted completely"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s 'a'–'z' harflaridan iborat", "butunlay o‘chirilgan harf chastotalar orasida sanalmaydi", "bir nechta harf butunlay o‘chib ketishi mumkin"],
  sampleInputs: ["aaabbb\n", "abc\n"],
  expect: ["1\n", "2\n"],
  sampleNotesUz: [
    "a va b uchtadan uchraydi. Bitta b ni o‘chirsak chastotalar 3 va 2 bo‘lib, ular har xil. Bitta o‘chirish yetarli.",
    "Uchala harf ham bir martadan uchraydi. Birinchisini qoldirib, qolgan ikkitasini butunlay o‘chirish kerak — jami 2 ta harf.",
  ],
  sampleNotesEn: [
    "Both a and b occur three times. Deleting a single b leaves the frequencies 3 and 2, which differ, so one deletion is enough.",
    "All three letters occur once. Keeping the first and deleting the other two entirely is the cheapest fix — two characters in all.",
  ],
  testInputs: ["aaabbb\n", "abc\n", "a\n", "aab\n", "aaaabbbbcccc\n", "zzzzz\n"],
  sol: `string s;cin>>s;vector<long long>cnt(26,0);
for(char c:s)++cnt[c-'a'];
vector<long long>f;
for(int i=0;i<26;++i)if(cnt[i]>0)f.push_back(cnt[i]);
sort(f.rbegin(),f.rend());
long long allow=(long long)4e18,del=0;
for(long long v:f){
 long long cur=min(v,allow);
 if(cur<0)cur=0;
 del+=v-cur;
 allow=cur-1;}
cout<<del<<"\\n";`,
  wrongNote: "Letting the allowance run below zero charges for deletions that were already made once the letter is gone; counting how many frequencies repeat says how many letters must change, not how many characters that costs.",
  wrong: [
    `string s;cin>>s;vector<long long>cnt(26,0);
for(char c:s)++cnt[c-'a'];
vector<long long>f;
for(int i=0;i<26;++i)if(cnt[i]>0)f.push_back(cnt[i]);
sort(f.rbegin(),f.rend());
long long allow=(long long)4e18,del=0;
for(long long v:f){
 long long cur=min(v,allow);
 del+=v-cur;
 allow=cur-1;}
cout<<del<<"\\n";`,
    `string s;cin>>s;vector<long long>cnt(26,0);
for(char c:s)++cnt[c-'a'];
vector<long long>f;
for(int i=0;i<26;++i)if(cnt[i]>0)f.push_back(cnt[i]);
sort(f.begin(),f.end());
long long del=0;
for(size_t i=1;i<f.size();++i)if(f[i]==f[i-1])++del;
cout<<del<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "B420", judge: "dp-max-sum-no-two-adjacent-circle", topic: "dynamic-programming", rating: 1900,
  tag: "Dynamic programming", timeLimitMs: 1000,
  uz: "Halqadagi qo‘shnisiz eng katta yig‘indi",
  en: "The largest sum with no two neighbours on a ring",
  statementUz: "n ta manfiy bo‘lmagan son halqa bo‘ylab joylashtirilgan: oxirgi son birinchisiga qo‘shni hisoblanadi. Shunday sonlarni tanlang-ki, tanlanganlar orasida qo‘shni juftlik bo‘lmasin va ularning yig‘indisi eng katta bo‘lsin. Hech narsa tanlamaslikka ham ruxsat beriladi, shuning uchun javob hech qachon manfiy bo‘lmaydi.",
  statementEn: "n non-negative numbers are arranged on a ring, so the last one is a neighbour of the first. Choose numbers with no two neighbours among them so that their sum is as large as possible. Choosing nothing is allowed, so the answer is never negative.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta manfiy bo‘lmagan son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n non-negative integers.",
  outputUz: "Yagona butun sonni chiqaring — qo‘shnisiz tanlovning eng katta yig‘indisi.",
  outputEn: "Print a single integer — the largest sum of a choice with no two neighbours.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ a_i ≤ 10^9", "the first and the last number are neighbours", "the answer reaches 5·10^13 and needs a 64-bit type", "choosing nothing is allowed"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ a_i ≤ 10^9", "birinchi va oxirgi son qo‘shni hisoblanadi", "javob 5·10^13 ga yetadi va 64-bitli turni talab qiladi", "hech narsa tanlamaslikka ruxsat beriladi"],
  sampleInputs: ["4\n2 3 2 5\n", "1\n7\n"],
  expect: ["8\n", "7\n"],
  sampleNotesUz: [
    "3 va 5 qo‘shni emas, ularning yig‘indisi 8. 2 va 2 ni olsak 4 chiqadi, 2 va 5 esa halqada qo‘shni bo‘lgani uchun birga olinmaydi.",
    "Halqada yagona son bor va u o‘ziga qo‘shni hisoblanmaydi, shuning uchun uni olish mumkin. Javob 7.",
  ],
  sampleNotesEn: [
    "The 3 and the 5 are not neighbours and add up to 8. Taking the two 2s gives 4, while the 2 and the 5 sit next to each other on the ring and cannot both be taken.",
    "The ring holds one number, which is not a neighbour of itself, so it may be taken. The answer is 7.",
  ],
  testInputs: ["4\n2 3 2 5\n", "1\n7\n", "2\n4 9\n", "3\n5 5 5\n", "5\n0 0 0 0 0\n", "5\n5 1 1 5 1\n", "6\n1000000000 1 1000000000 1 1000000000 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n==1){cout<<a[0]<<"\\n";return 0;}
auto line=[&](int from,int to){long long take=0,skip=0;
 for(int i=from;i<=to;++i){long long nt=skip+a[i];long long ns=max(skip,take);
  take=nt;skip=ns;}
 return max(take,skip);};
cout<<max(line(0,n-2),line(1,n-1))<<"\\n";`,
  wrongNote: "Solving the row and ignoring the wrap lets the first and the last number be taken together, which the ring forbids; comparing the even positions against the odd ones misses every choice that leaves a gap of two.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long take=0,skip=0;
for(int i=0;i<n;++i){long long nt=skip+a[i];long long ns=max(skip,take);
 take=nt;skip=ns;}
cout<<max(take,skip)<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n==1){cout<<a[0]<<"\\n";return 0;}
long long ev=0,od=0;
for(int i=0;i<n;++i){if(i%2==0)ev+=a[i];else od+=a[i];}
if(n%2==1)ev-=a[0];
cout<<max(ev,od)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C421", judge: "tree-remove-edges-even-components", topic: "trees", rating: 2000,
  tag: "Subtree sizes", timeLimitMs: 2000,
  uz: "Juft komponentalarga ajratish",
  en: "Splitting a tree into even components",
  statementUz: "Sizga juft sondagi n ta uchdan iborat daraxt berilgan. Undan eng ko‘pi bilan nechta qirrani olib tashlash mumkin-ki, hosil bo‘lgan har bir komponentada uchlar soni juft bo‘lib qolsin? Javob har doim mavjud, chunki hech narsa olib tashlamaslik ham mumkin. Har bir uch aynan bitta komponentaga tushadi; bitta uchdan iborat komponenta toq bo‘lgani uchun unga yo‘l qo‘yilmaydi.",
  statementEn: "You are given a tree with an even number of vertices n. At most how many edges can be removed so that every resulting component holds an even number of vertices? An answer always exists, since removing nothing is allowed. Every vertex ends up in exactly one component, and a component of a single vertex is odd and therefore not allowed.",
  inputUz: "Birinchi qatorda bitta juft n butun soni beriladi. Keyingi n − 1 qatorning har birida daraxtning a va b uchlarini bog‘lovchi qirrasi keladi.",
  inputEn: "The first line contains one even integer n. Each of the next n − 1 lines contains an edge a b of the tree.",
  outputUz: "Yagona butun sonni chiqaring — olib tashlash mumkin bo‘lgan qirralarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of edges that can be removed.",
  constraintList: ["2 ≤ n ≤ 10^5 and n is even", "1 ≤ a, b ≤ n and a ≠ b", "the n − 1 edges form a tree", "every component left behind must hold an even number of vertices", "removing nothing is always allowed"],
  constraintListUz: ["2 ≤ n ≤ 10^5 va n juft", "1 ≤ a, b ≤ n va a ≠ b", "n − 1 ta qirra daraxt hosil qiladi", "qolgan har bir komponentada uchlar soni juft bo‘lishi shart", "hech narsa olib tashlamaslikka har doim ruxsat beriladi"],
  sampleInputs: ["4\n1 2\n1 3\n3 4\n", "2\n1 2\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "1 va 3 uchlari orasidagi qirrani uzsak, {1,2} va {3,4} komponentalari qoladi — ikkalasida ham ikkitadan uch bor. Ikkinchi qirrani ham uzib bo‘lmaydi, chunki bitta uchli komponenta paydo bo‘lardi.",
    "Yagona qirrani uzsak har birida bittadan uch bo‘lgan ikkita komponenta chiqadi, bu esa toq. Shuning uchun hech narsa uzilmaydi va javob 0.",
  ],
  sampleNotesEn: [
    "Cutting the edge between vertices 1 and 3 leaves the components {1,2} and {3,4}, each holding two vertices. The other edge cannot also be cut, since that would leave a component of one vertex.",
    "Cutting the only edge would leave two components of one vertex each, which is odd. So nothing is cut and the answer is 0.",
  ],
  testInputs: [
    "4\n1 2\n1 3\n3 4\n",
    "2\n1 2\n",
    "6\n1 2\n1 3\n2 4\n2 5\n3 6\n",
    "8\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n7 8\n",
    "4\n1 2\n2 3\n3 4\n",
    "6\n1 2\n2 3\n3 4\n4 5\n5 6\n",
  ],
  sol: `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n,-1),order;order.reserve(n);
vector<int>st{0};vector<char>seen(n,0);seen[0]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<long long>sz(n,1);
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 if(par[v]>=0)sz[par[v]]+=sz[v];}
long long c=0;
for(int v=1;v<n;++v)if(sz[v]%2==0)++c;
cout<<c<<"\\n";`,
  wrongNote: "Counting the root's own subtree alongside the rest adds a cut that has no edge above it to make; counting the odd subtrees instead answers how many edges must be kept, which is the complement of what was asked.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n,-1),order;order.reserve(n);
vector<int>st{0};vector<char>seen(n,0);seen[0]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<long long>sz(n,1);
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 if(par[v]>=0)sz[par[v]]+=sz[v];}
long long c=0;
for(int v=0;v<n;++v)if(sz[v]%2==0)++c;
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n,-1),order;order.reserve(n);
vector<int>st{0};vector<char>seen(n,0);seen[0]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<long long>sz(n,1);
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 if(par[v]>=0)sz[par[v]]+=sz[v];}
long long c=0;
for(int v=1;v<n;++v)if(sz[v]%2==1)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C422", judge: "tree-reroot-max-distance", topic: "trees", rating: 2200,
  tag: "Rerooting", timeLimitMs: 2000,
  uz: "Har bir uchdan eng uzoq masofa",
  en: "The farthest distance from every vertex",
  statementUz: "Sizga n ta uchi bo‘lgan daraxt berilgan; har bir qirraning uzunligi 1 ga teng. Har bir uch uchun undan eng uzoqda turgan uchgacha bo‘lgan masofani toping va n ta sonni bitta qatorda chiqaring. Bitta uchli daraxt uchun javob 0; har bir qirra qaysi yo‘nalishda kesilmasin, bitta qadam hisoblanadi.",
  statementEn: "You are given a tree with n vertices where every edge has length 1. For each vertex find the distance to the vertex farthest from it, and print the n numbers on one line. A tree of one vertex answers 0, and every edge counts as one step whichever way it is crossed.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n − 1 qatorning har birida daraxtning a va b uchlarini bog‘lovchi qirrasi keladi.",
  inputEn: "The first line contains one integer n. Each of the next n − 1 lines contains an edge a b of the tree.",
  outputUz: "Bitta qatorda, probel bilan ajratib, n ta sonni chiqaring: i-son i-uchdan eng uzoq masofa.",
  outputEn: "Print n numbers on one line, separated by single spaces: the i-th is the farthest distance from vertex i.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a, b ≤ n and a ≠ b", "the n − 1 edges form a tree", "every edge has length 1", "a tree of one vertex answers 0"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a, b ≤ n va a ≠ b", "n − 1 ta qirra daraxt hosil qiladi", "har bir qirraning uzunligi 1", "bitta uchli daraxt uchun javob 0"],
  sampleInputs: ["4\n1 2\n2 3\n3 4\n", "1\n"],
  expect: ["3 2 2 3\n", "0\n"],
  sampleNotesUz: [
    "Daraxt zanjir: 1 − 2 − 3 − 4. 1-uchdan eng uzog‘i 4-uch, masofa 3. 2-uchdan eng uzog‘i yana 4-uch, masofa 2. Qolgan ikkitasi simmetriya bo‘yicha chiqadi.",
    "Yagona uch bor va undan boradigan joy yo‘q, shuning uchun eng uzoq masofa 0.",
  ],
  sampleNotesEn: [
    "The tree is the chain 1 − 2 − 3 − 4. From vertex 1 the farthest is vertex 4 at distance 3, and from vertex 2 it is vertex 4 again at distance 2. The other two follow by symmetry.",
    "There is a single vertex with nowhere to go, so the farthest distance is 0.",
  ],
  testInputs: [
    "4\n1 2\n2 3\n3 4\n",
    "1\n",
    "2\n1 2\n",
    "5\n1 2\n1 3\n1 4\n1 5\n",
    "7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n",
    "6\n1 2\n2 3\n3 4\n4 5\n3 6\n",
  ],
  sol: `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n,-1),order;order.reserve(n);
vector<int>st{0};vector<char>seen(n,0);seen[0]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<int>down(n,0);
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 for(int u:g[v]){
  if(u==par[v])continue;
  if(down[u]+1>down[v])down[v]=down[u]+1;}}
vector<int>up(n,0);
for(int v:order){
 int b1=-1,b2=-1;
 for(int u:g[v]){
  if(u==par[v])continue;
  int d=down[u]+1;
  if(d>b1){b2=b1;b1=d;}
  else if(d>b2)b2=d;}
 for(int u:g[v]){
  if(u==par[v])continue;
  int other=((down[u]+1)==b1)?b2:b1;
  if(other<0)other=0;
  up[u]=max(up[v],other)+1;}}
for(int v=0;v<n;++v)cout<<max(down[v],up[v])<<(v+1<n?' ':'\\n');`,
  wrongNote: "Passing the parent's own downward depth to a child feeds the child's branch straight back to it, so a vertex is told the longest arm runs through itself; the diameter is the largest of these answers but not the answer for every vertex.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n,-1),order;order.reserve(n);
vector<int>st{0};vector<char>seen(n,0);seen[0]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}
vector<int>down(n,0);
for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];
 for(int u:g[v]){
  if(u==par[v])continue;
  if(down[u]+1>down[v])down[v]=down[u]+1;}}
vector<int>up(n,0);
for(int v:order)
 for(int u:g[v]){
  if(u==par[v])continue;
  up[u]=max(up[v],down[v])+1;}
for(int v=0;v<n;++v)cout<<max(down[v],up[v])<<(v+1<n?' ':'\\n');`,
    `int n;cin>>n;vector<vector<int>>g(n);
for(int i=0;i+1<n;++i){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);g[b].push_back(a);}
auto bfs=[&](int s){vector<int>d(n,-1);d[s]=0;vector<int>q{s};
 for(size_t i=0;i<q.size();++i){int v=q[i];
  for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push_back(u);}}
 return d;};
vector<int>d0=bfs(0);
int a=0;for(int v=0;v<n;++v)if(d0[v]>d0[a])a=v;
vector<int>da=bfs(a);
int b=0;for(int v=0;v<n;++v)if(da[v]>da[b])b=v;
int diam=da[b];
for(int v=0;v<n;++v)cout<<diam<<(v+1<n?' ':'\\n');`,
  ],
});

export default P;
