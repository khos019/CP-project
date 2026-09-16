/* Batch 423 — ten problems, A423–C432.
 *
 * Time arithmetic and clocks at the bottom, a shortest path with one free
 * edge and a range-sum tree at the top; C432 is the batch's insane entry.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A423", judge: "time-minutes-between", topic: "programming-basics", rating: 800,
  tag: "Arithmetic", timeLimitMs: 1000,
  uz: "Ikki vaqt orasidagi daqiqalar",
  en: "The minutes between two times",
  statementUz: "Sizga bir kunlik soatdagi ikkita vaqt berilgan: har biri soat va daqiqa ko‘rinishida. Birinchi vaqtdan ikkinchisigacha necha daqiqa o‘tishini hisoblang. Ikkinchi vaqt birinchisidan oldin bo‘lsa, u ertangi kunga tegishli deb qaraladi, ya'ni javobga bir sutka qo‘shiladi. Vaqtlar bir xil bo‘lganda javob 0 bo‘ladi, 24 soat emas.",
  statementEn: "You are given two times on a one-day clock, each as an hour and a minute. Compute how many minutes pass from the first to the second. If the second time falls before the first it is taken to be on the next day, so a full day is added to the answer. When the two times are equal the answer is 0 rather than 24 hours.",
  inputUz: "Birinchi qatorda birinchi vaqtning soati va daqiqasi, ikkinchi qatorda ikkinchi vaqtning soati va daqiqasi beriladi.",
  inputEn: "The first line contains the hour and the minute of the first time, and the second line those of the second time.",
  outputUz: "Yagona butun sonni chiqaring — birinchi vaqtdan ikkinchisigacha o‘tadigan daqiqalar soni.",
  outputEn: "Print a single integer — the number of minutes passing from the first time to the second.",
  constraintList: ["0 ≤ hours ≤ 23", "0 ≤ minutes ≤ 59", "a second time before the first belongs to the next day", "equal times answer 0"],
  constraintListUz: ["0 ≤ soatlar ≤ 23", "0 ≤ daqiqalar ≤ 59", "birinchisidan oldingi ikkinchi vaqt ertangi kunga tegishli", "teng vaqtlar uchun javob 0"],
  sampleInputs: ["10 30\n12 0\n", "23 50\n0 10\n"],
  expect: ["90\n", "20\n"],
  sampleNotesUz: [
    "10:30 dan 12:00 gacha bir yarim soat, ya'ni 90 daqiqa o‘tadi.",
    "23:50 dan yarim tundan o‘tib 00:10 ga yetguncha 20 daqiqa ketadi. Ikkinchi vaqt kichikroq ko‘ringani uchun u ertangi kun deb olinadi.",
  ],
  sampleNotesEn: [
    "From 10:30 to 12:00 is an hour and a half, that is 90 minutes.",
    "Going from 23:50 past midnight to 00:10 takes 20 minutes. The second time looks smaller, so it is taken as the next day.",
  ],
  testInputs: ["10 30\n12 0\n", "23 50\n0 10\n", "0 0\n0 0\n", "0 0\n23 59\n", "12 0\n11 59\n", "5 45\n5 45\n"],
  sol: `long long h1,m1,h2,m2;cin>>h1>>m1>>h2>>m2;
long long a=h1*60+m1,b=h2*60+m2;
long long d=b-a;
if(d<0)d+=24*60;
cout<<d<<"\\n";`,
  wrongNote: "Taking the absolute difference measures the shorter way round the clock rather than the time that actually passes; wrapping whenever the second time is not larger turns equal times into a whole day.",
  wrong: [
    `long long h1,m1,h2,m2;cin>>h1>>m1>>h2>>m2;
long long a=h1*60+m1,b=h2*60+m2;
cout<<llabs(b-a)<<"\\n";`,
    `long long h1,m1,h2,m2;cin>>h1>>m1>>h2>>m2;
long long a=h1*60+m1,b=h2*60+m2;
long long d=b-a;
if(d<=0)d+=24*60;
cout<<d<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A424", judge: "array-count-peaks", topic: "foundations", rating: 1000,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Cho‘qqilarni sanash",
  en: "Counting the peaks",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Undagi cho‘qqilar sonini sanang: cho‘qqi deganda ikkala qo‘shnisidan qat'iy katta bo‘lgan element tushuniladi. Massivning birinchi va oxirgi elementlari cho‘qqi bo‘la olmaydi, chunki ularning ikkita qo‘shnisi yo‘q. Shu sababli uzunligi 1 yoki 2 bo‘lgan massivda cho‘qqi umuman bo‘lmaydi.",
  statementEn: "You are given an array of n integers. Count its peaks, a peak being an element strictly greater than both of its neighbours. The first and the last element can never be peaks, since they do not have two neighbours. For that reason an array of length 1 or 2 has no peak at all.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — massivdagi cho‘qqilar soni.",
  outputEn: "Print a single integer — the number of peaks in the array.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "a peak must beat both neighbours strictly", "the first and the last element are never peaks"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "cho‘qqi ikkala qo‘shnisidan qat'iy katta bo‘lishi shart", "birinchi va oxirgi element hech qachon cho‘qqi emas"],
  sampleInputs: ["5\n1 3 2 4 1\n", "4\n1 2 2 1\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "3 o‘zining qo‘shnilari 1 va 2 dan katta, 4 esa qo‘shnilari 2 va 1 dan katta — ikkita cho‘qqi bor.",
    "Ikkita 2 bir-biriga teng, ya'ni ularning hech biri ikkala qo‘shnisidan qat'iy katta emas. Cho‘qqi yo‘q, javob 0.",
  ],
  sampleNotesEn: [
    "The 3 beats its neighbours 1 and 2, and the 4 beats its neighbours 2 and 1 — two peaks in all.",
    "The two 2s are equal, so neither is strictly above both of its neighbours. There is no peak and the answer is 0.",
  ],
  testInputs: ["5\n1 3 2 4 1\n", "4\n1 2 2 1\n", "1\n5\n", "2\n1 2\n", "3\n5 1 5\n", "7\n1 2 1 2 1 2 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(int i=1;i+1<n;++i)if(a[i]>a[i-1]&&a[i]>a[i+1])++c;
cout<<c<<"\\n";`,
  wrongNote: "Comparing a peak against its neighbours without insisting on a strict rise lets a plateau count as one; counting the ends as peaks whenever they beat their single neighbour contradicts the rule the statement sets.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(int i=1;i+1<n;++i)if(a[i]>=a[i-1]&&a[i]>=a[i+1])++c;
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;
for(int i=0;i<n;++i){
 bool L=(i==0)||a[i]>a[i-1];
 bool R=(i+1==n)||a[i]>a[i+1];
 if(L&&R)++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B425", judge: "math-count-carries", topic: "math", rating: 1200,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Qo‘shishdagi ko‘chirishlar",
  en: "The carries in an addition",
  statementUz: "Ikkita manfiy bo‘lmagan a va b soni ustunda, o‘nlik sanoq sistemasida qo‘shilmoqda. Qo‘shish davomida nechta marta ko‘chirish sodir bo‘lishini sanang. Ko‘chirish deganda biror razryadda raqamlar yig‘indisi — oldingi razryaddan kelgan ko‘chirish bilan birga — o‘ndan kichik bo‘lmay qolishi va keyingi razryadga bir birlik o‘tishi tushuniladi. Ko‘chirish zanjir bo‘lib davom etishi mumkin.",
  statementEn: "Two non-negative numbers a and b are added in a column in base ten. Count how many carries happen along the way. A carry happens at a digit position when the digits there — together with any carry arriving from the position before it — reach ten, so that one unit moves on to the next position. Carries may chain one after another.",
  inputUz: "Yagona qatorda ikkita manfiy bo‘lmagan a va b butun soni beriladi.",
  inputEn: "The only line contains two non-negative integers a and b.",
  outputUz: "Yagona butun sonni chiqaring — qo‘shish davomidagi ko‘chirishlar soni.",
  outputEn: "Print a single integer — the number of carries in the addition.",
  constraintList: ["0 ≤ a, b ≤ 10^18", "the numbers are added in base ten", "a carry arriving from the previous position counts towards the next one", "the sum fits in a 64-bit type"],
  constraintListUz: ["0 ≤ a, b ≤ 10^18", "sonlar o‘nlik sanoq sistemasida qo‘shiladi", "oldingi razryaddan kelgan ko‘chirish keyingisiga qo‘shiladi", "yig‘indi 64-bitli turga sig‘adi"],
  sampleInputs: ["123 456\n", "555 555\n"],
  expect: ["0\n", "3\n"],
  sampleNotesUz: [
    "Har bir razryadda raqamlar yig‘indisi o‘ndan kichik: 3 + 6 = 9, 2 + 5 = 7, 1 + 4 = 5. Ko‘chirish yo‘q, javob 0.",
    "Birliklarda 5 + 5 = 10 — ko‘chirish. O‘nliklarda 5 + 5 + 1 = 11 — yana ko‘chirish. Yuzliklarda ham xuddi shunday. Jami 3 ta ko‘chirish.",
  ],
  sampleNotesEn: [
    "Every position stays below ten: 3 + 6 = 9, 2 + 5 = 7 and 1 + 4 = 5. There is no carry, so the answer is 0.",
    "At the units 5 + 5 = 10, which carries. At the tens 5 + 5 + 1 = 11, which carries again, and the hundreds behave the same way. That is three carries.",
  ],
  testInputs: ["123 456\n", "555 555\n", "0 0\n", "999 1\n", "1 999\n", "999999999999999999 1\n"],
  sol: `long long a,b;cin>>a>>b;long long c=0,carry=0;
while(a>0||b>0){
 long long d=a%10+b%10+carry;
 if(d>=10){++c;carry=1;}else carry=0;
 a/=10;b/=10;}
cout<<c<<"\\n";`,
  wrongNote: "Adding the two digits without the carry arriving from the position before misses every carry that only a chain produces; comparing the length of the sum against the longer operand notices at most the one carry that spills off the end.",
  wrong: [
    `long long a,b;cin>>a>>b;long long c=0;
while(a>0||b>0){
 if(a%10+b%10>=10)++c;
 a/=10;b/=10;}
cout<<c<<"\\n";`,
    `long long a,b;cin>>a>>b;
auto len=[](long long v){long long n=0;do{++n;v/=10;}while(v>0);return n;};
cout<<(len(a+b)-max(len(a),len(b)))<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B426", judge: "str-min-chars-to-anagram", topic: "strings", rating: 1400,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Anagramma qilish uchun qancha harf kerak",
  en: "How many letters an anagram is short of",
  statementUz: "Sizga kichik lotin harflaridan iborat ikkita satr berilgan. Ularni bir-birining anagrammasiga aylantirish uchun jami eng kam nechta harf o‘chirish kerakligini toping. Anagramma deganda bir xil harflardan, bir xil sondan iborat satrlar tushuniladi; harflarning tartibi ahamiyatsiz.",
  statementEn: "You are given two strings of lowercase Latin letters. Find the smallest total number of characters that must be deleted to turn them into anagrams of each other. Two strings are anagrams when they hold the same letters the same number of times; the order does not matter.",
  inputUz: "Birinchi qatorda birinchi satr, ikkinchi qatorda ikkinchi satr beriladi.",
  inputEn: "The first line contains the first string and the second line contains the second one.",
  outputUz: "Yagona butun sonni chiqaring — o‘chirilishi kerak bo‘lgan harflarning eng kam umumiy soni.",
  outputEn: "Print a single integer — the smallest total number of characters to delete.",
  constraintList: ["1 ≤ the length of each string ≤ 10^5", "both strings consist of the letters 'a'–'z'", "deletions from both strings count towards the total", "strings that are already anagrams answer 0"],
  constraintListUz: ["1 ≤ har bir satrning uzunligi ≤ 10^5", "ikkala satr ham 'a'–'z' harflaridan iborat", "ikkala satrdan o‘chirishlar ham umumiy songa qo‘shiladi", "allaqachon anagramma bo‘lgan satrlar uchun javob 0"],
  sampleInputs: ["cde\nabc\n", "abc\ncab\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Umumiy harf faqat c. Birinchi satrdan d va e ni, ikkinchisidan a va b ni o‘chirish kerak — jami 4 ta harf.",
    "Satrlarda bir xil harflar bir martadan uchraydi, ya'ni ular allaqachon anagramma. Hech narsa o‘chirilmaydi.",
  ],
  sampleNotesEn: [
    "The only shared letter is c. The d and the e go from the first string and the a and the b from the second — four characters in all.",
    "Both strings hold the same letters once each, so they are already anagrams and nothing is deleted.",
  ],
  testInputs: ["cde\nabc\n", "abc\ncab\n", "a\na\n", "a\nb\n", "aaaa\naa\n", "abcdefghij\njihgfedcba\n"],
  sol: `string a,b;cin>>a>>b;vector<long long>ca(26,0),cb(26,0);
for(char c:a)++ca[c-'a'];
for(char c:b)++cb[c-'a'];
long long t=0;
for(int i=0;i<26;++i)t+=llabs(ca[i]-cb[i]);
cout<<t<<"\\n";`,
  wrongNote: "The difference of the two lengths only accounts for the surplus on one side, not for letters each string has that the other lacks; counting a letter once when the two counts disagree ignores how far apart they are.",
  wrong: [
    `string a,b;cin>>a>>b;
cout<<llabs((long long)a.size()-(long long)b.size())<<"\\n";`,
    `string a,b;cin>>a>>b;vector<long long>ca(26,0),cb(26,0);
for(char c:a)++ca[c-'a'];
for(char c:b)++cb[c-'a'];
long long t=0;
for(int i=0;i<26;++i)if(ca[i]!=cb[i])++t;
cout<<t<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B427", judge: "sort-min-pair-diff-sum", topic: "sorting", rating: 1500,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Juftliklardagi farqlar yig‘indisi",
  en: "The smallest total gap over the pairs",
  statementUz: "Sizga juft sondagi n ta butun son berilgan. Ularni ikkitadan juftlab chiqing, ya'ni har bir son aynan bitta juftlikda qatnashsin. Har bir juftlik uchun ikki sonning ayirmasi moduli olinadi; sizga shu qiymatlarning yig‘indisini eng kichik qiladigan juftlash kerak. O‘sha eng kichik yig‘indini chiqaring.",
  statementEn: "You are given an even number n of integers. Split them into pairs so that every number takes part in exactly one pair. Each pair contributes the absolute difference of its two numbers, and you want the pairing that makes the total of those contributions as small as possible. Print that smallest total.",
  inputUz: "Birinchi qatorda bitta juft n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one even integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — juftliklardagi ayirmalar modulining eng kichik yig‘indisi.",
  outputEn: "Print a single integer — the smallest possible total of the absolute differences over the pairs.",
  constraintList: ["2 ≤ n ≤ 10^5 and n is even", "−10^9 ≤ a_i ≤ 10^9", "every number is used in exactly one pair", "the answer reaches 10^14 and needs a 64-bit type"],
  constraintListUz: ["2 ≤ n ≤ 10^5 va n juft", "−10^9 ≤ a_i ≤ 10^9", "har bir son aynan bitta juftlikda qatnashadi", "javob 10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n1 4 2 3\n", "2\n5 5\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Saralangandan keyin 1 2 3 4 bo‘ladi. Yonma-yon turganlarni juftlasak (1,2) va (3,4) chiqadi, yig‘indi 1 + 1 = 2. Chekkalarni juftlasak (1,4) va (2,3) bo‘lib, yig‘indi 3 + 1 = 4 — bu yomonroq.",
    "Ikkala son ham teng, shuning uchun yagona juftlikning ayirmasi 0.",
  ],
  sampleNotesEn: [
    "Sorted the numbers read 1 2 3 4. Pairing the neighbours gives (1,2) and (3,4) for a total of 1 + 1 = 2. Pairing the extremes gives (1,4) and (2,3) for 3 + 1 = 4, which is worse.",
    "Both numbers are equal, so the only pair contributes a difference of 0.",
  ],
  testInputs: ["4\n1 4 2 3\n", "2\n5 5\n", "2\n1 1000000000\n", "6\n1 2 3 4 5 6\n", "4\n-5 5 -5 5\n", "6\n10 1 10 1 10 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long s=0;
for(int i=0;i+1<n;i+=2)s+=a[i+1]-a[i];
cout<<s<<"\\n";`,
  wrongNote: "Pairing the smallest with the largest spreads every pair as wide as it can go, which maximises the total instead of minimising it; pairing the numbers in the order they arrive ignores that sorting is what brings the partners close together.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long s=0;
for(int i=0;i<n/2;++i)s+=a[n-1-i]-a[i];
cout<<s<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long s=0;
for(int i=0;i+1<n;i+=2)s+=llabs(a[i+1]-a[i]);
cout<<s<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B428", judge: "bs-kth-missing-positive", topic: "binary-search", rating: 1700,
  tag: "Binary search", timeLimitMs: 1000,
  uz: "Yetishmayotgan k-musbat son",
  en: "The k-th missing positive number",
  statementUz: "Sizga qat'iy o‘suvchi tartibdagi n ta musbat butun son berilgan. Bu massivda uchramaydigan musbat sonlarni o‘sish tartibida sanasak, ularning k-chisi qaysi bo‘lishini toping. Massivda yo‘q sonlar cheksiz ko‘p bo‘lgani uchun javob har doim mavjud.",
  statementEn: "You are given n positive integers in strictly increasing order. Listing the positive integers that do not appear in the array, in increasing order, find which one is the k-th. Infinitely many numbers are absent, so the answer always exists.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda qat'iy o‘suvchi tartibda n ta musbat son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n positive integers in strictly increasing order.",
  outputUz: "Yagona butun sonni chiqaring — massivda yetishmayotgan k-musbat son.",
  outputEn: "Print a single integer — the k-th positive number missing from the array.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^9", "1 ≤ a_i ≤ 10^9 and the array is strictly increasing", "the answer reaches 10^9 + 10^5"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^9", "1 ≤ a_i ≤ 10^9 va massiv qat'iy o‘suvchi", "javob 10^9 + 10^5 ga yetadi"],
  sampleInputs: ["4 2\n2 3 4 7\n", "3 1\n1 2 3\n"],
  expect: ["5\n", "4\n"],
  sampleNotesUz: [
    "Massivda yo‘q musbat sonlar: 1, 5, 6, 8, 9, … Ularning ikkinchisi 5, shuning uchun javob 5.",
    "Massivda 1, 2 va 3 bor, ya'ni birinchi yetishmayotgan son 4.",
  ],
  sampleNotesEn: [
    "The positive numbers absent from the array are 1, 5, 6, 8, 9 and so on. The second of them is 5, so the answer is 5.",
    "The array holds 1, 2 and 3, so the first missing number is 4.",
  ],
  testInputs: ["4 2\n2 3 4 7\n", "3 1\n1 2 3\n", "1 1\n1\n", "1 1\n2\n", "5 5\n1 2 3 4 5\n", "3 3\n2 5 9\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long lo=0,hi=n;
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(a[mid]-(mid+1)<k)lo=mid+1;else hi=mid;}
cout<<(lo+k)<<"\\n";`,
  wrongNote: "Adding k to the length assumes the array occupies the first n places, which stops being true as soon as a number is missing inside it; counting the values that come before the answer and then subtracting one lands on the number just below it.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
cout<<(n+k)<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long lo=0,hi=n;
while(lo<hi){long long mid=lo+(hi-lo)/2;
 if(a[mid]-(mid+1)<k)lo=mid+1;else hi=mid;}
cout<<(lo+k-1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B429", judge: "grid-count-enclosed-zero-regions", topic: "graphs", rating: 1800,
  tag: "Flood fill", timeLimitMs: 2000,
  uz: "Berkitilgan bo‘sh sohalar",
  en: "The enclosed empty regions",
  statementUz: "Sizga n satr va m ustundan iborat, 0 va 1 lardan tuzilgan jadval berilgan. Nollardan tashkil topgan va jadvalning chekkasiga tegmaydigan sohalar sonini sanang. Ikki katak bir sohaga tegishli hisoblanadi, agar ular yon tomondan — yuqori, quyi, chap yoki o‘ng qo‘shni sifatida — bog‘langan bo‘lsa; diagonal bog‘lanish hisobga olinmaydi. Chekkaga tegib turgan soha berkitilgan hisoblanmaydi.",
  statementEn: "You are given a table of n rows and m columns filled with 0s and 1s. Count the regions of 0s that do not touch the border of the table. Two cells belong to the same region when they are joined side by side — up, down, left or right; a diagonal touch does not join them. A region reaching the border does not count as enclosed.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi n qatorning har birida probel bilan ajratilgan m ta son keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next n lines contains m numbers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — chekkaga tegmaydigan nol sohalari soni.",
  outputEn: "Print a single integer — the number of zero regions that do not touch the border.",
  constraintList: ["1 ≤ n, m ≤ 500", "each entry is 0 or 1", "cells are joined side by side, never diagonally", "a region touching the border is not counted"],
  constraintListUz: ["1 ≤ n, m ≤ 500", "har bir katak 0 yoki 1", "kataklar yon tomondan bog‘lanadi, diagonal bo‘yicha emas", "chekkaga tegib turgan soha sanalmaydi"],
  sampleInputs: ["4 4\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1\n", "3 3\n0 1 1\n1 1 1\n1 1 1\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "Markazdagi to‘rtta nol bitta soha hosil qiladi va u har tomondan birlar bilan o‘ralgan. Chekkaga tegmaydi, shuning uchun javob 1.",
    "Yagona nol chap yuqori burchakda, ya'ni jadvalning chekkasida turibdi. Berkitilgan soha yo‘q, javob 0.",
  ],
  sampleNotesEn: [
    "The four zeros in the middle form one region, fenced in by ones on every side. It does not touch the border, so the answer is 1.",
    "The only zero sits in the top-left corner, which is on the border of the table. There is no enclosed region, so the answer is 0.",
  ],
  testInputs: [
    "4 4\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1\n",
    "3 3\n0 1 1\n1 1 1\n1 1 1\n",
    "1 1\n0\n",
    "5 5\n1 1 1 1 1\n1 0 1 0 1\n1 1 1 1 1\n1 0 1 0 1\n1 1 1 1 1\n",
    "3 3\n1 1 1\n1 1 1\n1 1 1\n",
    "5 5\n1 1 1 1 1\n1 0 1 1 1\n1 1 0 1 1\n1 1 1 0 1\n1 1 1 1 1\n",
  ],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
vector<vector<char>>seen(n,vector<char>(m,0));
int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
long long c=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j){
 if(a[i][j]||seen[i][j])continue;
 bool edge=false;
 vector<pair<int,int>>st;st.push_back(make_pair(i,j));seen[i][j]=1;
 while(!st.empty()){pair<int,int>p=st.back();st.pop_back();
  int x=p.first,y=p.second;
  if(x==0||y==0||x==n-1||y==m-1)edge=true;
  for(int d=0;d<4;++d){int nx=x+dx[d],ny=y+dy[d];
   if(nx<0||ny<0||nx>=n||ny>=m)continue;
   if(a[nx][ny]||seen[nx][ny])continue;
   seen[nx][ny]=1;st.push_back(make_pair(nx,ny));}}
 if(!edge)++c;}
cout<<c<<"\\n";`,
  wrongNote: "Counting every region of zeros ignores the condition that it must be fenced in; joining cells diagonally as well merges regions the statement keeps apart.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
vector<vector<char>>seen(n,vector<char>(m,0));
int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
long long c=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j){
 if(a[i][j]||seen[i][j])continue;
 ++c;
 vector<pair<int,int>>st;st.push_back(make_pair(i,j));seen[i][j]=1;
 while(!st.empty()){pair<int,int>p=st.back();st.pop_back();
  int x=p.first,y=p.second;
  for(int d=0;d<4;++d){int nx=x+dx[d],ny=y+dy[d];
   if(nx<0||ny<0||nx>=n||ny>=m)continue;
   if(a[nx][ny]||seen[nx][ny])continue;
   seen[nx][ny]=1;st.push_back(make_pair(nx,ny));}}}
cout<<c<<"\\n";`,
    `int n,m;cin>>n>>m;vector<vector<int>>a(n,vector<int>(m));
for(int i=0;i<n;++i)for(int j=0;j<m;++j)cin>>a[i][j];
vector<vector<char>>seen(n,vector<char>(m,0));
int dx[8]={1,-1,0,0,1,1,-1,-1},dy[8]={0,0,1,-1,1,-1,1,-1};
long long c=0;
for(int i=0;i<n;++i)for(int j=0;j<m;++j){
 if(a[i][j]||seen[i][j])continue;
 bool edge=false;
 vector<pair<int,int>>st;st.push_back(make_pair(i,j));seen[i][j]=1;
 while(!st.empty()){pair<int,int>p=st.back();st.pop_back();
  int x=p.first,y=p.second;
  if(x==0||y==0||x==n-1||y==m-1)edge=true;
  for(int d=0;d<8;++d){int nx=x+dx[d],ny=y+dy[d];
   if(nx<0||ny<0||nx>=n||ny>=m)continue;
   if(a[nx][ny]||seen[nx][ny])continue;
   seen[nx][ny]=1;st.push_back(make_pair(nx,ny));}}
 if(!edge)++c;}
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C430", judge: "graph-shortest-path-one-free-edge", topic: "graphs", rating: 2000,
  tag: "Layered Dijkstra", timeLimitMs: 2000,
  uz: "Bitta qirra bepul bo‘lgan eng qisqa yo‘l",
  en: "The shortest path with one free edge",
  statementUz: "Sizga n ta shahar va ular orasidagi m ta yo‘naltirilmagan yo‘l berilgan; har bir yo‘lning narxi bor. 1-shahardan n-shaharga borishning eng arzon narxini toping, lekin yo‘l davomida ixtiyoriy bitta yo‘lni bepul o‘tishga ruxsat beriladi. Bepul o‘tishdan foydalanmasak ham bo‘ladi. 1-shahardan n-shaharga umuman borib bo‘lmasa, −1 chiqaring.",
  statementEn: "You are given n cities and m undirected roads between them, each with a price. Find the cheapest way to travel from city 1 to city n, except that you are allowed to cross any one road for free along the way. The free crossing need not be used at all. If city n cannot be reached from city 1, print −1.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Keyingi m qatorning har birida a va b shaharlarni bog‘lovchi yo‘l va uning w narxi keladi.",
  inputEn: "The first line contains two integers n and m. Each of the next m lines contains a road a b and its price w.",
  outputUz: "Yagona butun sonni chiqaring — 1-shahardan n-shaharga borishning eng arzon narxi, yoki borib bo‘lmasa −1.",
  outputEn: "Print a single integer — the cheapest price of travelling from city 1 to city n, or −1 if it cannot be done.",
  constraintList: ["2 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n and a ≠ b", "1 ≤ w ≤ 10^9", "exactly one road may be crossed for free, and using the discount is optional"],
  constraintListUz: ["2 ≤ n ≤ 10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ a, b ≤ n va a ≠ b", "1 ≤ w ≤ 10^9", "ko‘pi bilan bitta yo‘ldan bepul o‘tiladi va bu majburiy emas"],
  sampleInputs: ["4 4\n1 2 5\n2 4 5\n1 3 1\n3 4 100\n", "2 1\n1 2 7\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "1 → 3 → 4 yo‘lidan borib, qimmat 100 lik qirrani bepul o‘tamiz: narx atigi 1 bo‘ladi. 1 → 2 → 4 yo‘lida bittasini bepul qilsak ham 5 to‘lash kerak.",
    "Yagona yo‘lni bepul o‘tamiz, shuning uchun narx 0.",
  ],
  sampleNotesEn: [
    "Going 1 → 3 → 4 and taking the expensive 100 edge for free costs just 1. On the route 1 → 2 → 4 even a free edge still leaves 5 to pay.",
    "The only road is crossed for free, so the price is 0.",
  ],
  testInputs: [
    "4 4\n1 2 5\n2 4 5\n1 3 1\n3 4 100\n",
    "2 1\n1 2 7\n",
    "3 1\n1 2 5\n",
    "4 4\n1 2 1\n2 3 1\n3 4 1\n1 4 10\n",
    "5 6\n1 2 3\n2 3 4\n3 5 5\n1 4 10\n4 5 1\n2 5 20\n",
    "2 2\n1 2 1000000000\n1 2 1\n",
  ],
  sol: `int n,m;cin>>n>>m;
vector<vector<pair<int,long long>>>g(n);
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;--a;--b;
 g[a].push_back(make_pair(b,w));g[b].push_back(make_pair(a,w));}
const long long INF=(long long)4e18;
vector<array<long long,2>>d(n);
for(int i=0;i<n;++i){d[i][0]=INF;d[i][1]=INF;}
priority_queue<tuple<long long,int,int>,vector<tuple<long long,int,int>>,greater<tuple<long long,int,int>>>pq;
d[0][0]=0;pq.push(make_tuple(0LL,0,0));
while(!pq.empty()){
 long long cd;int v,used;
 tie(cd,v,used)=pq.top();pq.pop();
 if(cd>d[v][used])continue;
 for(size_t i=0;i<g[v].size();++i){
  int u=g[v][i].first;long long w=g[v][i].second;
  if(cd+w<d[u][used]){d[u][used]=cd+w;pq.push(make_tuple(d[u][used],u,used));}
  if(used==0&&cd<d[u][1]){d[u][1]=cd;pq.push(make_tuple(d[u][1],u,1));}}}
long long best=min(d[n-1][0],d[n-1][1]);
cout<<((best>=INF)?-1:best)<<"\\n";`,
  wrongNote: "Running an ordinary shortest path and then subtracting the heaviest edge on the graph discounts an edge the route may never use; dropping the most expensive edge of the plain cheapest route ignores that a different, pricier route can gain far more from the discount.",
  wrong: [
    `int n,m;cin>>n>>m;
vector<vector<pair<int,long long>>>g(n);
long long heaviest=0;
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;--a;--b;
 g[a].push_back(make_pair(b,w));g[b].push_back(make_pair(a,w));
 heaviest=max(heaviest,w);}
const long long INF=(long long)4e18;
vector<long long>d(n,INF);d[0]=0;
priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<pair<long long,int>>>pq;
pq.push(make_pair(0LL,0));
while(!pq.empty()){
 pair<long long,int>t=pq.top();pq.pop();
 if(t.first>d[t.second])continue;
 for(size_t i=0;i<g[t.second].size();++i){
  int u=g[t.second][i].first;long long w=g[t.second][i].second;
  if(t.first+w<d[u]){d[u]=t.first+w;pq.push(make_pair(d[u],u));}}}
if(d[n-1]>=INF){cout<<"-1\\n";return 0;}
cout<<max(0LL,d[n-1]-heaviest)<<"\\n";`,
    `int n,m;cin>>n>>m;
vector<vector<pair<int,long long>>>g(n);
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;--a;--b;
 g[a].push_back(make_pair(b,w));g[b].push_back(make_pair(a,w));}
const long long INF=(long long)4e18;
vector<long long>d(n,INF),mx(n,0);d[0]=0;
priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<pair<long long,int>>>pq;
pq.push(make_pair(0LL,0));
while(!pq.empty()){
 pair<long long,int>t=pq.top();pq.pop();
 if(t.first>d[t.second])continue;
 for(size_t i=0;i<g[t.second].size();++i){
  int u=g[t.second][i].first;long long w=g[t.second][i].second;
  if(t.first+w<d[u]){d[u]=t.first+w;mx[u]=max(mx[t.second],w);pq.push(make_pair(d[u],u));}}}
if(d[n-1]>=INF){cout<<"-1\\n";return 0;}
cout<<(d[n-1]-mx[n-1])<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C431", judge: "math-count-square-free", topic: "math", rating: 2100,
  tag: "Mobius function", timeLimitMs: 2000,
  uz: "Kvadratsiz sonlarni sanash",
  en: "Counting the square-free numbers",
  statementUz: "Son kvadratsiz deyiladi, agar u birdan katta hech qanday to‘liq kvadratga bo‘linmasa. Masalan 10 kvadratsiz, 12 esa emas, chunki u 4 ga bo‘linadi. Sizga n berilgan; 1 dan n gacha bo‘lgan kvadratsiz sonlar nechtaligini toping. 1 kvadratsiz hisoblanadi, chunki uni birdan katta hech qanday kvadrat bo‘lmaydi; n esa ro‘yxatlab bo‘lmaydigan darajada katta.",
  statementEn: "A number is square-free when no perfect square above one divides it. For instance 10 is square-free while 12 is not, since 4 divides it. Given n, find how many of the numbers from 1 to n are square-free. The number 1 is square-free, since no square above one divides it, and n reaches far beyond what could be listed.",
  inputUz: "Yagona qatorda bitta musbat n butun soni beriladi.",
  inputEn: "The only line contains one positive integer n.",
  outputUz: "Yagona butun sonni chiqaring — 1 dan n gacha bo‘lgan kvadratsiz sonlar soni.",
  outputEn: "Print a single integer — the number of square-free integers from 1 to n.",
  constraintList: ["1 ≤ n ≤ 10^12", "1 counts as square-free", "a number divisible by the square of any prime is not square-free", "the sieve only needs to reach the square root of n"],
  constraintListUz: ["1 ≤ n ≤ 10^12", "1 kvadratsiz hisoblanadi", "biror tub sonning kvadratiga bo‘linadigan son kvadratsiz emas", "elakni faqat n ning kvadrat ildizigacha qurish kifoya"],
  sampleInputs: ["10\n", "1\n"],
  expect: ["7\n", "1\n"],
  sampleNotesUz: [
    "1 dan 10 gacha kvadratsiz sonlar: 1, 2, 3, 5, 6, 7, 10 — jami 7 ta. 4, 8 va 9 tashlab yuboriladi, chunki 4 va 8 to‘rtga, 9 esa to‘qqizga bo‘linadi.",
    "Yagona son 1, u esa birdan katta hech qanday kvadratga bo‘linmaydi. Javob 1.",
  ],
  sampleNotesEn: [
    "The square-free numbers up to 10 are 1, 2, 3, 5, 6, 7 and 10 — seven of them. The numbers 4, 8 and 9 drop out, since 4 and 8 are divisible by four and 9 by nine.",
    "The only number is 1, which no square above one divides. The answer is 1.",
  ],
  testInputs: ["10\n", "1\n", "100\n", "4\n", "50\n", "1000000000000\n"],
  sol: `long long n;cin>>n;
long long L=1;while((L+1)*(L+1)<=n)++L;
vector<int>mu(L+1,1),pr(L+1,0);
vector<int>primes;
for(long long i=2;i<=L;++i){
 if(!pr[i]){primes.push_back((int)i);mu[i]=-1;}
 for(size_t j=0;j<primes.size()&&i*primes[j]<=L;++j){
  long long v=i*primes[j];pr[v]=1;
  if(i%primes[j]==0){mu[v]=0;break;}
  mu[v]=-mu[i];}}
long long ans=0;
for(long long d=1;d<=L;++d)if(mu[d])ans+=(long long)mu[d]*(n/(d*d));
cout<<ans<<"\\n";`,
  wrongNote: "Subtracting the multiples of each prime square one prime at a time removes a number divisible by two different squares twice over; ruling out only the multiples of four leaves every number divisible by nine or twenty-five still standing.",
  wrong: [
    `long long n;cin>>n;
long long L=1;while((L+1)*(L+1)<=n)++L;
vector<char>comp(L+1,0);
long long ans=n;
for(long long p=2;p<=L;++p){
 if(comp[p])continue;
 for(long long q=p*p;q<=L;q+=p)comp[q]=1;
 ans-=n/(p*p);}
cout<<ans<<"\\n";`,
    `long long n;cin>>n;
cout<<(n-n/4)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C432", judge: "segtree-range-assign-sum", topic: "data-structures", rating: 2200,
  tag: "Segment tree with lazy assignment", timeLimitMs: 2000,
  uz: "Oraliqni tenglashtirish va yig‘indi",
  en: "Assigning over a range and summing it",
  statementUz: "Sizda dastlab nollardan iborat n uzunlikdagi massiv bor va unga q ta so‘rov keladi. Birinchi turdagi so‘rov l dan r gacha bo‘lgan barcha elementlarni x qiymatiga tenglashtiradi. Ikkinchi turdagi so‘rov l dan r gacha bo‘lgan elementlarning yig‘indisini so‘raydi. Har bir ikkinchi tur so‘rovining javobini alohida qatorda chiqaring. So‘rovlar soni katta bo‘lgani uchun har birini oddiy sikl bilan bajarish yetarli sekin bo‘ladi.",
  statementEn: "You start with an array of n zeros and receive q queries. A query of the first kind sets every element from l to r to the value x. A query of the second kind asks for the sum of the elements from l to r. Print the answer to each query of the second kind on its own line. There are too many queries for a plain loop over each range to keep up.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Keyingi q qatorning har biri yo 1 l r x, yo 2 l r ko‘rinishida bo‘ladi.",
  inputEn: "The first line contains two integers n and q. Each of the next q lines is either 1 l r x or 2 l r.",
  outputUz: "Har bir ikkinchi tur so‘rovi uchun alohida qatorda so‘ralgan yig‘indini chiqaring.",
  outputEn: "For each query of the second kind print the requested sum on its own line.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "0 ≤ x ≤ 10^9", "a sum reaches 2·10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ q ≤ 2·10^5", "1 ≤ l ≤ r ≤ n", "0 ≤ x ≤ 10^9", "yig‘indi 2·10^14 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5 4\n1 1 3 2\n2 1 5\n1 2 4 5\n2 1 5\n", "3 2\n2 1 3\n1 1 1 7\n"],
  expect: ["6\n17\n", "0\n"],
  sampleNotesUz: [
    "Birinchi so‘rovdan keyin massiv 2 2 2 0 0 bo‘ladi, yig‘indisi 6. Keyin 2 dan 4 gacha 5 ga tenglashtiriladi va massiv 2 5 5 5 0 ko‘rinishini oladi, yig‘indisi 17.",
    "Massiv hali ham nollardan iborat, shuning uchun birinchi so‘rovning javobi 0. Oxirgi so‘rov faqat qiymat o‘rnatadi va hech narsa chiqarmaydi.",
  ],
  sampleNotesEn: [
    "After the first query the array is 2 2 2 0 0 and its sum is 6. Then the range from 2 to 4 is set to 5, leaving 2 5 5 5 0 with a sum of 17.",
    "The array still holds only zeros, so the first query answers 0. The last query only sets a value and prints nothing.",
  ],
  testInputs: [
    "5 4\n1 1 3 2\n2 1 5\n1 2 4 5\n2 1 5\n",
    "3 2\n2 1 3\n1 1 1 7\n",
    "1 3\n2 1 1\n1 1 1 9\n2 1 1\n",
    "6 6\n1 1 6 1\n2 1 6\n1 3 4 10\n2 1 6\n1 1 6 0\n2 1 6\n",
    "4 5\n1 2 3 5\n2 1 1\n2 2 2\n2 1 4\n2 3 4\n",
    "5 5\n1 1 5 1000000000\n2 1 5\n1 2 2 0\n2 1 5\n2 2 2\n",
  ],
  sol: `int n,q;cin>>n>>q;
vector<long long>sum(4*n,0),lz(4*n,-1);
function<void(int,int,int)>apply2=[&](int node,int l,int r){
 if(lz[node]<0)return;
 sum[node]=lz[node]*(long long)(r-l+1);
 if(l<r){lz[2*node]=lz[node];lz[2*node+1]=lz[node];}
 lz[node]=-1;};
function<void(int,int,int,int,int,long long)>upd=[&](int node,int l,int r,int a,int b,long long x){
 apply2(node,l,r);
 if(b<l||r<a)return;
 if(a<=l&&r<=b){lz[node]=x;apply2(node,l,r);return;}
 int mid=(l+r)/2;
 upd(2*node,l,mid,a,b,x);
 upd(2*node+1,mid+1,r,a,b,x);
 sum[node]=sum[2*node]+sum[2*node+1];};
function<long long(int,int,int,int,int)>qry=[&](int node,int l,int r,int a,int b){
 apply2(node,l,r);
 if(b<l||r<a)return 0LL;
 if(a<=l&&r<=b)return sum[node];
 int mid=(l+r)/2;
 return qry(2*node,l,mid,a,b)+qry(2*node+1,mid+1,r,a,b);};
string out;
for(int i=0;i<q;++i){int t;cin>>t;
 if(t==1){int l,r;long long x;cin>>l>>r>>x;upd(1,1,n,l,r,x);}
 else{int l,r;cin>>l>>r;out+=to_string(qry(1,1,n,l,r));out+="\\n";}}
cout<<out;`,
  wrongNote: "Treating the pending value as an amount to add instead of a value to assign leaves the old contents underneath every later range; pushing the pending value down without clearing it makes the same assignment land again on a range that was overwritten since.",
  wrong: [
    `int n,q;cin>>n>>q;
vector<long long>sum(4*n,0),lz(4*n,0);
function<void(int,int,int)>apply2=[&](int node,int l,int r){
 if(lz[node]==0)return;
 sum[node]+=lz[node]*(long long)(r-l+1);
 if(l<r){lz[2*node]+=lz[node];lz[2*node+1]+=lz[node];}
 lz[node]=0;};
function<void(int,int,int,int,int,long long)>upd=[&](int node,int l,int r,int a,int b,long long x){
 apply2(node,l,r);
 if(b<l||r<a)return;
 if(a<=l&&r<=b){lz[node]=x;apply2(node,l,r);return;}
 int mid=(l+r)/2;
 upd(2*node,l,mid,a,b,x);
 upd(2*node+1,mid+1,r,a,b,x);
 sum[node]=sum[2*node]+sum[2*node+1];};
function<long long(int,int,int,int,int)>qry=[&](int node,int l,int r,int a,int b){
 apply2(node,l,r);
 if(b<l||r<a)return 0LL;
 if(a<=l&&r<=b)return sum[node];
 int mid=(l+r)/2;
 return qry(2*node,l,mid,a,b)+qry(2*node+1,mid+1,r,a,b);};
string out;
for(int i=0;i<q;++i){int t;cin>>t;
 if(t==1){int l,r;long long x;cin>>l>>r>>x;upd(1,1,n,l,r,x);}
 else{int l,r;cin>>l>>r;out+=to_string(qry(1,1,n,l,r));out+="\\n";}}
cout<<out;`,
    `int n,q;cin>>n>>q;
vector<long long>sum(4*n,0),lz(4*n,-1);
function<void(int,int,int)>apply2=[&](int node,int l,int r){
 if(lz[node]<0)return;
 sum[node]=lz[node]*(long long)(r-l+1);
 if(l<r){lz[2*node]=lz[node];lz[2*node+1]=lz[node];}};
function<void(int,int,int,int,int,long long)>upd=[&](int node,int l,int r,int a,int b,long long x){
 apply2(node,l,r);
 if(b<l||r<a)return;
 if(a<=l&&r<=b){lz[node]=x;apply2(node,l,r);return;}
 int mid=(l+r)/2;
 upd(2*node,l,mid,a,b,x);
 upd(2*node+1,mid+1,r,a,b,x);
 sum[node]=sum[2*node]+sum[2*node+1];};
function<long long(int,int,int,int,int)>qry=[&](int node,int l,int r,int a,int b){
 apply2(node,l,r);
 if(b<l||r<a)return 0LL;
 if(a<=l&&r<=b)return sum[node];
 int mid=(l+r)/2;
 return qry(2*node,l,mid,a,b)+qry(2*node+1,mid+1,r,a,b);};
string out;
for(int i=0;i<q;++i){int t;cin>>t;
 if(t==1){int l,r;long long x;cin>>l>>r>>x;upd(1,1,n,l,r,x);}
 else{int l,r;cin>>l>>r;out+=to_string(qry(1,1,n,l,r));out+="\\n";}}
cout<<out;`,
  ],
});

export default P;
