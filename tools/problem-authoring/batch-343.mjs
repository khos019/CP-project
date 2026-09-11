/* Batch 343 — the last ten, A343–C352.
 *
 * Spread across the ladder to fill the gaps the first four batches left:
 * a few more easy ones, geometry, strings, binary search and two at the top.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A343", judge: "sum-range-formula", topic: "math", rating: 800,
  tag: "Formulas", timeLimitMs: 1000,
  uz: "l dan r gacha yig‘indi",
  en: "Sum from l to r",
  statementUz: "Sizga ikkita l va r butun soni berilgan. l dan r gacha bo‘lgan barcha butun sonlar yig‘indisini toping; ikkala chet ham yig‘indiga kiradi. Oraliqda 10^18 tagacha son bo‘lishi mumkin, shuning uchun ularni birma-bir qo‘shib bo‘lmaydi: ketma-ket sonlar yig‘indisi uchun yopiq formuladan foydalanish kerak. l va r manfiy bo‘lishi ham mumkin.",
  statementEn: "You are given two integers l and r. Find the sum of every integer from l to r, with both ends included in the sum. The range may hold up to 10^18 numbers, so they cannot be added one at a time: the closed form for the sum of consecutive integers has to be used. Both l and r may be negative.",
  inputUz: "Yagona qatorda probel bilan ajratilgan ikkita l va r butun soni beriladi; l ≤ r.",
  inputEn: "The only line contains two integers l and r separated by a single space, with l ≤ r.",
  outputUz: "Yagona butun sonni chiqaring — l dan r gacha bo‘lgan sonlar yig‘indisi.",
  outputEn: "Print a single integer — the sum of the integers from l to r.",
  constraintList: ["−10^9 ≤ l ≤ r ≤ 10^9", "the answer can reach about 5·10^17 in magnitude and needs a 64-bit type"],
  constraintListUz: ["−10^9 ≤ l ≤ r ≤ 10^9", "javob moduli taxminan 5·10^17 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["3 7\n", "-3 3\n"],
  expect: ["25\n", "0\n"],
  sampleNotesUz: [
    "3 + 4 + 5 + 6 + 7 = 25. Yopiq formula ham shuni beradi: hadlar soni 7 − 3 + 1 = 5, o‘rtacha had (3 + 7) / 2 = 5, ko‘paytmasi esa 25.",
    "−3 dan 3 gacha har bir manfiy son o‘zining musbat juftini yo‘qotadi va o‘rtada 0 qoladi, shuning uchun yig‘indi 0. Manfiy chegaralar formulani buzmaydi — (l + r) · (r − l + 1) / 2 ularda ham to‘g‘ri ishlaydi.",
  ],
  sampleNotesEn: [
    "3 + 4 + 5 + 6 + 7 = 25. The closed form agrees: the count of terms is 7 − 3 + 1 = 5, the average term is (3 + 7) / 2 = 5, and their product is 25.",
    "From −3 to 3 every negative cancels its positive twin and 0 is left in the middle, so the sum is 0. Negative ends do not break the formula — (l + r) · (r − l + 1) / 2 holds for them too.",
  ],
  testInputs: ["3 7\n", "-3 3\n", "5 5\n", "-1000000000 1000000000\n", "1 1000000000\n", "-1000000000 -999999999\n"],
  sol: `long long l,r;cin>>l>>r;long long n=r-l+1;
long long s=(l+r)%2==0?((l+r)/2)*n:(l+r)*(n/2);
cout<<s<<"\\n";`,
  wrongNote: "Assuming the range starts at 1, and a formula that loses the odd half to integer division.",
  wrong: [
    `long long l,r;cin>>l>>r;cout<<r*(r+1)/2<<"\\n";`,
    `long long l,r;cin>>l>>r;long long n=r-l+1;cout<<((l+r)/2)*n<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A344", judge: "string-remove-vowels", topic: "strings", rating: 1000,
  tag: "Characters", timeLimitMs: 1000,
  uz: "Unlilarni olib tashlash",
  en: "Dropping the vowels",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Undan barcha ingliz unlilarini — a, e, i, o va u harflarini — olib tashlang va qolgan harflarni asl tartibida chiqaring. y harfi unli hisoblanmaydi va saqlanib qoladi. Agar satrda undoshlar umuman bo‘lmasa, natija bo‘sh satr bo‘lib qoladi; bunday holda alohida belgi chiqarish kerak.",
  statementEn: "You are given a string s of lowercase Latin letters. Remove every English vowel — the letters a, e, i, o and u — and print the remaining letters in their original order. The letter y is not treated as a vowel and survives. If the string holds no consonant at all the result is empty, and that case is reported with a marker of its own.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Unlilar olib tashlangan satrni chiqaring. Agar hech qanday harf qolmasa, uning o‘rniga bitta defis belgisini chiqaring.",
  outputEn: "Print the string with the vowels removed. If no letter remains, print a single hyphen character instead.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' only", "an empty result is printed as a hyphen, not as a blank line"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' belgilaridan iborat", "bo‘sh natija bo‘sh qator emas, defis bilan chiqariladi"],
  sampleInputs: ["algoritm\n", "aeiou\n"],
  expect: ["lgrtm\n", "-\n"],
  sampleNotesUz: [
    "a, o va i unlilari olib tashlanadi, qolganlari esa o‘z tartibida qoladi: lgrtm. Harflar qayta joylashtirilmaydi — faqat unlilar tushib qoladi.",
    "Satrning har bir harfi unli, shuning uchun hech narsa qolmaydi. Bo‘sh qator o‘rniga defis chiqariladi, aks holda javob umuman ko‘rinmas edi.",
  ],
  sampleNotesEn: [
    "The vowels a, o and i are removed and the rest keep their order: lgrtm. Nothing is rearranged — the vowels simply drop out.",
    "Every letter of the string is a vowel, so nothing remains. A hyphen is printed instead of a blank line, which would otherwise be an invisible answer.",
  ],
  testInputs: ["algoritm\n", "aeiou\n", "y\n", "b\n", "aybycydy\n", "zzz\n"],
  sol: `string s;cin>>s;string t;
for(char c:s)if(c!='a'&&c!='e'&&c!='i'&&c!='o'&&c!='u')t.push_back(c);
cout<<(t.empty()?string("-"):t)<<"\\n";`,
  wrongNote: "Treating y as a vowel removes a letter that should stay; printing an empty line leaves the all-vowel case with no visible answer.",
  wrong: [
    `string s;cin>>s;string t;
for(char c:s)if(c!='a'&&c!='e'&&c!='i'&&c!='o'&&c!='u'&&c!='y')t.push_back(c);
cout<<(t.empty()?string("-"):t)<<"\\n";`,
    `string s;cin>>s;string t;
for(char c:s)if(c!='a'&&c!='e'&&c!='i'&&c!='o'&&c!='u')t.push_back(c);
cout<<t<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B345", judge: "geo-point-on-segment", topic: "geometry", rating: 1200,
  tag: "Geometry", timeLimitMs: 1000,
  uz: "Nuqta kesmada yotadimi",
  en: "Is the point on the segment",
  statementUz: "Sizga A va B nuqtalari bilan berilgan kesma hamda uchinchi P nuqtasi berilgan; hammasi butun koordinatalarga ega. P nuqtasi AB kesmasida yotishini aniqlang. Buning uchun ikki shart bajarilishi kerak: P aynan AB to‘g‘ri chizig‘ida bo‘lishi va A bilan B orasida turishi. Kesmaning chetlari ham unga tegishli, ya'ni P nuqtasi A yoki B ga teng bo‘lsa, javob musbat bo‘ladi.",
  statementEn: "You are given a segment by its endpoints A and B, and a third point P, all with integer coordinates. Determine whether P lies on the segment AB. Two things must hold: P must be exactly on the line through A and B, and it must fall between them. The endpoints belong to the segment, so a P equal to A or to B counts as lying on it.",
  inputUz: "Yagona qatorda oltita butun son ax, ay, bx, by, px, py beriladi: A, B va P nuqtalarining koordinatalari.",
  inputEn: "The only line contains six integers ax, ay, bx, by, px, py: the coordinates of A, B and P.",
  outputUz: "Agar P nuqtasi AB kesmasida yotsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if P lies on the segment AB and NO otherwise, in capital letters.",
  constraintList: ["−10^9 ≤ every coordinate ≤ 10^9", "the cross product reaches 4·10^18 and needs a 64-bit type", "A and B may be the same point, in which case the segment is a single point"],
  constraintListUz: ["−10^9 ≤ har bir koordinata ≤ 10^9", "vektor ko‘paytma 4·10^18 ga yetadi va 64-bitli turni talab qiladi", "A va B bir xil nuqta bo‘lishi mumkin — bunday holda kesma bitta nuqtadan iborat"],
  sampleInputs: ["0 0 4 4 2 2\n", "0 0 4 4 5 5\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "(2,2) nuqtasi y = x chizig‘ida yotadi va uning koordinatalari 0 bilan 4 orasida, ya'ni kesmaning ichida. Shuning uchun javob YES.",
    "(5,5) nuqtasi ham xuddi shu chiziqda yotadi, lekin B nuqtasidan narida qolgan. Faqat chiziqda yotishni tekshirish bu holatni o‘tkazib yuborardi — shuning uchun koordinatalarning oraliqqa tushishini ham tekshirish shart.",
  ],
  sampleNotesEn: [
    "The point (2,2) lies on the line y = x and both of its coordinates fall between 0 and 4, so it is inside the segment and the answer is YES.",
    "The point (5,5) lies on the same line but sits beyond B. Checking only that it is on the line would let this through — which is why the coordinates must be checked against the range as well.",
  ],
  testInputs: ["0 0 4 4 2 2\n", "0 0 4 4 5 5\n", "0 0 4 4 0 0\n", "0 0 4 4 1 2\n", "2 2 2 2 2 2\n", "-1000000000 -1000000000 1000000000 1000000000 0 0\n"],
  sol: `long long ax,ay,bx,by,px,py;cin>>ax>>ay>>bx>>by>>px>>py;
long long cr=(bx-ax)*(py-ay)-(by-ay)*(px-ax);
bool on=(cr==0)&&px>=min(ax,bx)&&px<=max(ax,bx)&&py>=min(ay,by)&&py<=max(ay,by);
cout<<(on?"YES":"NO")<<"\\n";`,
  wrongNote: "Testing only that the point is on the infinite line accepts points past the ends; testing only the bounding box accepts points off the line.",
  wrong: [
    `long long ax,ay,bx,by,px,py;cin>>ax>>ay>>bx>>by>>px>>py;
long long cr=(bx-ax)*(py-ay)-(by-ay)*(px-ax);
cout<<((cr==0)?"YES":"NO")<<"\\n";`,
    `long long ax,ay,bx,by,px,py;cin>>ax>>ay>>bx>>by>>px>>py;
bool on=px>=min(ax,bx)&&px<=max(ax,bx)&&py>=min(ay,by)&&py<=max(ay,by);
cout<<(on?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B346", judge: "prefix-count-less-than", topic: "data-structures", rating: 1300,
  tag: "Prefix sums", timeLimitMs: 1000,
  uz: "Har bir so‘rov uchun kichiklar soni",
  en: "How many fall below the threshold",
  statementUz: "Sizga n ta butun sondan iborat massiv va q ta so‘rov berilgan. Har bir so‘rovda x qiymati beriladi va massivda x dan qat'iy kichik nechta element borligi so‘raladi. Massiv so‘rovlar orasida o‘zgarmaydi, shuning uchun uni bir marta saralab qo‘yib, har bir so‘rovga ikkilik qidiruv bilan javob berish kifoya — har safar butun massivni yurib chiqish esa vaqtida ulgurmaydi.",
  statementEn: "You are given an array of n integers and q queries. Each query gives a value x and asks how many elements of the array are strictly less than x. The array does not change between queries, so sorting it once and answering each query with a binary search is enough — walking the whole array per query would not finish in time.",
  inputUz: "Birinchi qatorda ikkita n va q butun soni beriladi. Ikkinchi qatorda n ta butun son keladi. Keyingi q qatorning har birida bitta x butun soni bo‘ladi.",
  inputEn: "The first line contains two integers n and q. The second line contains n integers. Each of the next q lines contains one integer x.",
  outputUz: "q ta qator chiqaring. i-chi qatorda i-chi so‘rov uchun x dan qat'iy kichik elementlar soni bo‘lishi kerak.",
  outputEn: "Print q lines. The i-th line must contain how many elements are strictly less than the x of the i-th query.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ q ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "−10^9 ≤ x ≤ 10^9", "the comparison is strict, so an element equal to x is not counted"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ q ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "−10^9 ≤ x ≤ 10^9", "solishtirish qat'iy, shuning uchun x ga teng element sanalmaydi"],
  sampleInputs: ["5 3\n1 3 3 5 7\n3\n4\n0\n", "1 1\n5\n5\n"],
  expect: ["1\n3\n0\n", "0\n"],
  sampleNotesUz: [
    "3 dan qat'iy kichigi faqat 1 — ikkita uchlik sanalmaydi, chunki ular teng. 4 dan kichiklari 1, 3 va 3 — uchtasi. 0 dan kichigi esa umuman yo‘q.",
    "Yagona element 5 ga teng va qat'iy kichik emas, shuning uchun javob 0. Aynan shu holat qat'iy solishtirishni qat'iy bo‘lmaganidan ajratadi.",
  ],
  sampleNotesEn: [
    "Only 1 is strictly below 3 — the two 3s do not count, being equal. Below 4 there are 1, 3 and 3, which is three. Nothing at all is below 0.",
    "The only element equals 5 and is not strictly below it, so the answer is 0. This is the case that separates a strict comparison from a non-strict one.",
  ],
  testInputs: ["5 3\n1 3 3 5 7\n3\n4\n0\n", "1 1\n5\n5\n", "3 2\n-1 0 1\n0\n2\n", "4 1\n2 2 2 2\n3\n", "5 2\n1 2 3 4 5\n1\n6\n", "2 2\n-1000000000 1000000000\n-1000000000\n1000000000\n", "5 2\n7 3 5 1 9\n4\n8\n", "5 1\n5 -4 0 1 0\n2\n"],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
while(q--){long long x;cin>>x;
 cout<<(lower_bound(a.begin(),a.end(),x)-a.begin())<<"\\n";}`,
  wrongNote: "upper_bound counts the elements equal to x as well; searching an unsorted array gives whatever the binary search stumbles into.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
while(q--){long long x;cin>>x;
 cout<<(upper_bound(a.begin(),a.end(),x)-a.begin())<<"\\n";}`,
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
while(q--){long long x;cin>>x;
 cout<<(lower_bound(a.begin(),a.end(),x)-a.begin())<<"\\n";}`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B347", judge: "str-longest-repeating-replace", topic: "two-pointers", rating: 1400,
  tag: "Sliding window", timeLimitMs: 1000,
  uz: "k ta almashtirish bilan eng uzun bir xil blok",
  en: "Longest equal block after k replacements",
  statementUz: "Sizga bosh lotin harflaridan iborat s satri va k soni berilgan. Ko‘pi bilan k ta harfni istalgan boshqa harfga almashtirish mumkin. Shu almashtirishlardan keyin hosil bo‘lishi mumkin bo‘lgan, bir xil harflardan tuzilgan eng uzun uzluksiz blokning uzunligini toping. Almashtirishlar faqat tanlangan blok ichida ishlatiladi, ya'ni javob — bironta oynada k tadan ko‘p bo‘lmagan begona harf qolishi shartini qanoatlantiruvchi eng uzun oyna.",
  statementEn: "You are given a string s of uppercase Latin letters and a number k. At most k characters may be replaced by any other character. Find the length of the longest run of equal characters that can be produced this way. The replacements are only ever spent inside the chosen run, so the answer is the longest window in which at most k characters differ from the most common one in it.",
  inputUz: "Birinchi qatorda s satri, ikkinchi qatorda k butun soni beriladi.",
  inputEn: "The first line contains the string s and the second line contains the integer k.",
  outputUz: "Yagona butun sonni chiqaring — almashtirishlardan keyingi eng uzun bir xil harfli blok uzunligi.",
  outputEn: "Print a single integer — the length of the longest run of equal characters after the replacements.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "0 ≤ k ≤ |s|", "s consists of the characters 'A'–'Z' only", "the answer never exceeds |s|"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "0 ≤ k ≤ |s|", "s faqat 'A'–'Z' belgilaridan iborat", "javob hech qachon |s| dan oshmaydi"],
  sampleInputs: ["AABABBA\n1\n", "ABCD\n0\n"],
  expect: ["4\n", "1\n"],
  sampleNotesUz: [
    "\"AABA\" oynasida uchta A va bitta B bor; bitta almashtirish bilan u to‘rtta A ga aylanadi, ya'ni uzunlik 4. Beshtalik oyna olinsa, ichida kamida ikkita begona harf qolib ketadi va bitta almashtirish yetmaydi.",
    "Almashtirishga ruxsat yo‘q, shuning uchun blok allaqachon bir xil harflardan iborat bo‘lishi kerak. Satrdagi barcha harflar har xil, demak eng uzun blok bitta harfdan iborat.",
  ],
  sampleNotesEn: [
    "The window \"AABA\" holds three As and one B; one replacement turns it into four As, giving length 4. A window of five would leave at least two foreign characters, which one replacement cannot cover.",
    "No replacement is allowed, so the run must already be uniform. Every character of the string differs from its neighbours, so the longest run is a single character.",
  ],
  testInputs: ["AABABBA\n1\n", "ABCD\n0\n", "AAAA\n2\n", "A\n0\n", "ABBB\n2\n", "ABAB\n1\n"],
  sol: `string s;long long k;cin>>s>>k;
vector<int>cnt(26,0);int best=0,l=0,most=0;
for(int r=0;r<(int)s.size();++r){
 most=max(most,++cnt[s[r]-'A']);
 while((r-l+1)-most>k){--cnt[s[l]-'A'];++l;}
 best=max(best,r-l+1);}
cout<<best<<"\\n";`,
  wrongNote: "Shrinking on a non-strict comparison lets one replacement too many through; counting only the runs already equal ignores k entirely.",
  wrong: [
    `string s;long long k;cin>>s>>k;
vector<int>cnt(26,0);int best=0,l=0,most=0;
for(int r=0;r<(int)s.size();++r){
 most=max(most,++cnt[s[r]-'A']);
 while((r-l+1)-most>k+1){--cnt[s[l]-'A'];++l;}
 best=max(best,r-l+1);}
cout<<best<<"\\n";`,
    `string s;long long k;cin>>s>>k;
int best=1,cur=1;
for(size_t i=1;i<s.size();++i){if(s[i]==s[i-1])++cur;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B348", judge: "bs-min-max-pages", topic: "binary-search", rating: 1500,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Kitoblarni o‘quvchilarga taqsimlash",
  en: "Handing the books out",
  statementUz: "Sizga qatorda turgan n ta kitobning sahifalar soni va k ta o‘quvchi berilgan. Kitoblarni o‘quvchilarga shunday taqsimlangki, har bir o‘quvchi qatordan uzluksiz bo‘lakni olsin, kitoblarning tartibi o‘zgarmasin va har bir kitob aynan bitta o‘quvchiga tegsin. Eng ko‘p o‘qiydigan o‘quvchining sahifalar soni imkon qadar kichik bo‘lsin va o‘sha qiymatni chiqaring. O‘quvchi bo‘sh qo‘l bilan qolishi mumkin emas.",
  statementEn: "You are given the page counts of n books standing in a row, and k students. Hand the books out so that each student takes a contiguous block of the row, the order of the books is not changed, and every book goes to exactly one student. Make the page count of the busiest student as small as possible and print that value. No student may be left without a book.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda n ta musbat butun son — kitoblarning sahifalar soni keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n positive integers, the page counts of the books.",
  outputUz: "Yagona butun sonni chiqaring — eng ko‘p o‘qiydigan o‘quvchining mumkin bo‘lgan eng kichik sahifalar soni. Agar kitoblar o‘quvchilarga yetmasa, -1 chiqaring.",
  outputEn: "Print a single integer — the smallest possible page count for the busiest student. If there are not enough books for the students, print -1 instead.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^5", "1 ≤ pages ≤ 10^4", "the blocks must be contiguous and the order is fixed", "it is impossible exactly when k > n"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^5", "1 ≤ sahifalar ≤ 10^4", "bo‘laklar uzluksiz bo‘lishi shart va tartib o‘zgarmaydi", "aynan k > n bo‘lganda imkonsiz"],
  sampleInputs: ["4 2\n12 34 67 90\n", "2 3\n10 20\n"],
  expect: ["113\n", "-1\n"],
  sampleNotesUz: [
    "Eng yaxshi taqsimot — birinchi o‘quvchiga 12, 34 va 67 (jami 113), ikkinchisiga 90. Eng ko‘p o‘qiydigan 113 sahifa oladi. Boshqa bo‘linishlar yomonroq: 12 | 34+67+90 = 191 va 12+34 | 67+90 = 157.",
    "Ikkita kitobni uchta o‘quvchiga uzluksiz bo‘laklar bilan taqsimlab bo‘lmaydi — kimdir bo‘sh qoladi, bunga esa ruxsat yo‘q. Shuning uchun javob -1.",
  ],
  sampleNotesEn: [
    "The best split gives the first student 12, 34 and 67 — 113 pages — and the second student 90. The busiest reads 113. The alternatives are worse: 12 against 34+67+90 = 191, and 12+34 against 67+90 = 157.",
    "Two books cannot be split into three contiguous blocks without leaving someone empty-handed, which is not allowed, so the answer is -1.",
  ],
  testInputs: ["4 2\n12 34 67 90\n", "2 3\n10 20\n", "1 1\n5\n", "5 5\n1 2 3 4 5\n", "5 1\n1 2 3 4 5\n", "6 3\n10 10 10 10 10 10\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
if(k>n){cout<<-1<<"\\n";return 0;}
auto need=[&](long long cap){long long parts=1,cur=0;
 for(long long x:a){if(cur+x>cap){++parts;cur=x;}else cur+=x;}
 return parts;};
long long lo=*max_element(a.begin(),a.end()),hi=accumulate(a.begin(),a.end(),0LL);
while(lo<hi){long long mid=lo+(hi-lo)/2;if(need(mid)<=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  wrongNote: "Starting the search below the largest single book allows a cap no split can meet; testing k > n the other way round rejects a case that is fine.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
if(k>n){cout<<-1<<"\\n";return 0;}
auto need=[&](long long cap){long long parts=1,cur=0;
 for(long long x:a){if(cur+x>cap){++parts;cur=x;}else cur+=x;}
 return parts;};
long long lo=0,hi=accumulate(a.begin(),a.end(),0LL);
while(lo<hi){long long mid=lo+(hi-lo)/2;if(need(mid)<=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
if(k>=n){cout<<-1<<"\\n";return 0;}
auto need=[&](long long cap){long long parts=1,cur=0;
 for(long long x:a){if(cur+x>cap){++parts;cur=x;}else cur+=x;}
 return parts;};
long long lo=*max_element(a.begin(),a.end()),hi=accumulate(a.begin(),a.end(),0LL);
while(lo<hi){long long mid=lo+(hi-lo)/2;if(need(mid)<=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B349", judge: "grid-count-rectangles-ones", topic: "data-structures", rating: 1600,
  tag: "2D prefix sums", timeLimitMs: 1000,
  uz: "Faqat birlardan iborat to‘rtburchaklar",
  en: "Rectangles made only of ones",
  statementUz: "Sizga 0 va 1 lardan iborat r × c jadval va q ta so‘rov berilgan. Har bir so‘rovda to‘rtburchakning chap yuqori va o‘ng pastki burchaklari beriladi va o‘sha to‘rtburchak butunlay birlardan iboratmi, degan savolga javob so‘raladi. Jadval o‘zgarmaydi, shuning uchun ikki o‘lchovli prefiks yig‘indini bir marta qurib, har bir so‘rovga to‘rtta qiymat bilan javob berish mumkin.",
  statementEn: "You are given an r × c grid of 0s and 1s and q queries. Each query gives the top-left and bottom-right corners of a rectangle and asks whether that rectangle consists entirely of ones. The grid never changes, so a two-dimensional prefix sum can be built once and each query answered from four values.",
  inputUz: "Birinchi qatorda uchta r, c va q butun soni beriladi. Keyingi r qatorning har birida probelsiz c ta belgi (0 yoki 1) keladi. So‘ngra q qatorda to‘rttadan butun son r1, c1, r2, c2 beriladi.",
  inputEn: "The first line contains three integers r, c and q. Each of the next r lines contains c characters, each 0 or 1, with no spaces. Then q lines follow, each with four integers r1, c1, r2, c2.",
  outputUz: "q ta qator chiqaring: har bir so‘rov uchun to‘rtburchak butunlay birlardan iborat bo‘lsa YES, aks holda NO.",
  outputEn: "Print q lines: for each query, YES if the rectangle is entirely ones and NO otherwise.",
  constraintList: ["1 ≤ r ≤ 500", "1 ≤ c ≤ 500", "1 ≤ q ≤ 10^5", "1 ≤ r1 ≤ r2 ≤ r", "1 ≤ c1 ≤ c2 ≤ c", "the corners are given 1-based"],
  constraintListUz: ["1 ≤ r ≤ 500", "1 ≤ c ≤ 500", "1 ≤ q ≤ 10^5", "1 ≤ r1 ≤ r2 ≤ r", "1 ≤ c1 ≤ c2 ≤ c", "burchaklar 1 dan sanaladi"],
  sampleInputs: ["3 3 2\n111\n101\n111\n1 1 1 3\n1 1 3 3\n", "1 1 1\n0\n1 1 1 1\n"],
  expect: ["YES\nNO\n", "NO\n"],
  sampleNotesUz: [
    "Birinchi so‘rov butun yuqori satrni qamrab oladi va u \"111\" — hammasi bir, javob YES. Ikkinchi so‘rov butun jadvalni qamraydi, o‘rtada esa 0 turibdi, shuning uchun NO. Prefiks yig‘indi bilan bu \"to‘rtburchakdagi yig‘indi uning maydoniga tengmi\" degan savolga aylanadi.",
    "Yagona katakda 0 turibdi, shuning uchun to‘rtburchak birlardan iborat emas va javob NO.",
  ],
  sampleNotesEn: [
    "The first query covers the whole top row, which is \"111\" — all ones, so YES. The second covers the whole grid and there is a 0 in the middle, so NO. With a prefix sum this becomes the question of whether the sum over the rectangle equals its area.",
    "The only cell holds a 0, so the rectangle is not all ones and the answer is NO.",
  ],
  testInputs: ["3 3 2\n111\n101\n111\n1 1 1 3\n1 1 3 3\n", "1 1 1\n0\n1 1 1 1\n", "2 2 3\n11\n11\n1 1 2 2\n1 1 1 1\n2 2 2 2\n", "1 4 2\n1101\n1 1 1 2\n1 3 1 4\n", "3 3 1\n000\n000\n000\n2 2 2 2\n", "2 3 2\n111\n111\n1 1 2 3\n1 2 2 2\n"],
  sol: `int r,c,q;cin>>r>>c>>q;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<long long>>ps(r+1,vector<long long>(c+1,0));
for(int i=0;i<r;++i)for(int j=0;j<c;++j)
 ps[i+1][j+1]=ps[i][j+1]+ps[i+1][j]-ps[i][j]+(g[i][j]=='1');
while(q--){int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;
 long long s=ps[r2][c2]-ps[r1-1][c2]-ps[r2][c1-1]+ps[r1-1][c1-1];
 long long area=(long long)(r2-r1+1)*(c2-c1+1);
 cout<<(s==area?"YES":"NO")<<"\\n";}`,
  wrongNote: "Forgetting to add back the doubly-subtracted corner gives a sum that is too small; comparing against a non-zero count answers whether any one is present.",
  wrong: [
    `int r,c,q;cin>>r>>c>>q;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<long long>>ps(r+1,vector<long long>(c+1,0));
for(int i=0;i<r;++i)for(int j=0;j<c;++j)
 ps[i+1][j+1]=ps[i][j+1]+ps[i+1][j]-ps[i][j]+(g[i][j]=='1');
while(q--){int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;
 long long s=ps[r2][c2]-ps[r1-1][c2]-ps[r2][c1-1];
 long long area=(long long)(r2-r1+1)*(c2-c1+1);
 cout<<(s==area?"YES":"NO")<<"\\n";}`,
    `int r,c,q;cin>>r>>c>>q;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<long long>>ps(r+1,vector<long long>(c+1,0));
for(int i=0;i<r;++i)for(int j=0;j<c;++j)
 ps[i+1][j+1]=ps[i][j+1]+ps[i+1][j]-ps[i][j]+(g[i][j]=='1');
while(q--){int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;
 long long s=ps[r2][c2]-ps[r1-1][c2]-ps[r2][c1-1]+ps[r1-1][c1-1];
 cout<<(s>0?"YES":"NO")<<"\\n";}`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B350", judge: "greedy-min-arrows-balloons", topic: "greedy", rating: 1700,
  tag: "Interval greedy", timeLimitMs: 1000,
  uz: "Sharlarni eng kam o‘q bilan yorish",
  en: "Bursting the balloons",
  statementUz: "Sizga n ta sharning gorizontal o‘qdagi oraliqlari berilgan: i-shar [l_i, r_i] oralig‘ini egallaydi. O‘q vertikal ravishda biror x nuqtasidan otiladi va l_i ≤ x ≤ r_i shartini qanoatlantiruvchi barcha sharlarni bir yo‘la yoradi. Barcha sharlarni yorish uchun kerak bo‘ladigan eng kam o‘qlar sonini toping. Chetlari tegib turgan sharlar ham bitta o‘q bilan yoriladi.",
  statementEn: "You are given the horizontal spans of n balloons: balloon i occupies the interval [l_i, r_i]. An arrow is shot vertically at some point x and bursts every balloon with l_i ≤ x ≤ r_i at once. Find the smallest number of arrows needed to burst them all. Balloons that merely touch at an endpoint are burst by the same arrow.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida ikkita l va r butun soni keladi; l ≤ r.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains two integers l and r with l ≤ r.",
  outputUz: "Yagona butun sonni chiqaring — barcha sharlarni yorish uchun kerak bo‘ladigan eng kam o‘qlar soni.",
  outputEn: "Print a single integer — the smallest number of arrows needed to burst every balloon.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ l ≤ r ≤ 10^9", "balloons touching at an endpoint share an arrow"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ l ≤ r ≤ 10^9", "chetlari tegib turgan sharlar bitta o‘qni baham ko‘radi"],
  sampleInputs: ["4\n10 16\n2 8\n1 6\n7 12\n", "2\n1 2\n3 4\n"],
  expect: ["2\n", "2\n"],
  sampleNotesUz: [
    "O‘ng chetlari bo‘yicha saralaymiz: [1,6], [2,8], [10,16], [7,12]. x = 6 da otilgan o‘q birinchi ikkala sharni ham yoradi, x = 12 da otilgani esa qolgan ikkitasini. Jami ikkita o‘q. O‘ng chetga otish qoidasi optimal, chunki u kelgusidagi eng ko‘p sharni qamrab oladi.",
    "Ikki shar umuman kesishmaydi — biri 2 da tugaydi, ikkinchisi 3 da boshlanadi — shuning uchun har biriga alohida o‘q kerak va javob 2.",
  ],
  sampleNotesEn: [
    "Sorted by right end the balloons are [1,6], [2,8], [7,12], [10,16]. An arrow at x = 6 bursts the first two, and one at x = 12 bursts the rest — two arrows. Shooting at the right end is what makes the greedy optimal: it covers as much of what follows as possible.",
    "The two balloons do not overlap at all — one ends at 2 and the next begins at 3 — so each needs its own arrow and the answer is 2.",
  ],
  testInputs: ["4\n10 16\n2 8\n1 6\n7 12\n", "2\n1 2\n3 4\n", "1\n5 5\n", "3\n1 10\n2 3\n4 5\n", "3\n1 2\n2 3\n3 4\n", "4\n1 1\n1 1\n1 1\n1 1\n"],
  sol: `int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.second>>p.first;
sort(v.begin(),v.end());
long long arrows=0,last=0;bool first=true;
for(auto&p:v){if(first||p.second>last){++arrows;last=p.first;first=false;}}
cout<<arrows<<"\\n";`,
  wrongNote: "Sorting by the left end shoots too early and splits groups that one arrow covers; treating a touching endpoint as a miss buys an arrow that was not needed.",
  wrong: [
    `int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.first>>p.second;
sort(v.begin(),v.end());
long long arrows=0,last=0;bool first=true;
for(auto&p:v){if(first||p.first>last){++arrows;last=p.second;first=false;}}
cout<<arrows<<"\\n";`,
    `int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.second>>p.first;
sort(v.begin(),v.end());
long long arrows=0,last=0;bool first=true;
for(auto&p:v){if(first||p.second>=last){++arrows;last=p.first;first=false;}}
cout<<arrows<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "C351", judge: "tree-sum-distances-root", topic: "trees", rating: 1900,
  tag: "Tree DP", timeLimitMs: 2000,
  uz: "Ildizdan barcha uchlargacha masofalar yig‘indisi",
  en: "Total distance from the root",
  statementUz: "Sizga 1-uchida ildizlangan, n ta uchdan iborat daraxt berilgan. Ildizdan har bir uchgacha bo‘lgan masofalar yig‘indisini toping; masofa qirralar soni bilan o‘lchanadi va ildizning o‘zigacha masofa 0 ga teng. Har bir qirradan o‘tuvchi yo‘llar sonini hisoblash orqali javobni bitta yurishda topish mumkin: qirra o‘z ostidagi qism daraxtdagi har bir uch uchun bir marta sanaladi.",
  statementEn: "You are given a tree with n nodes rooted at node 1. Find the total of the distances from the root to every node, where distance is measured in edges and the distance to the root itself is 0. The answer can be found in one pass by counting how many paths use each edge: an edge is counted once for every node in the subtree below it.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n − 1 qatorning har birida a va b uchlari orasidagi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains one integer n. Each of the next n − 1 lines contains two integers a and b, an edge between nodes a and b.",
  outputUz: "Yagona butun sonni chiqaring — ildizdan barcha uchlargacha bo‘lgan masofalar yig‘indisi.",
  outputEn: "Print a single integer — the total distance from the root to every node.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "the given edges always form a tree", "the answer can reach about 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ a, b ≤ n", "berilgan qirralar har doim daraxt hosil qiladi", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n1 2\n1 3\n3 4\n", "1\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Masofalar: 1-uchgacha 0, 2-uchgacha 1, 3-uchgacha 1, 4-uchgacha 2. Yig‘indisi 0 + 1 + 1 + 2 = 4. Xuddi shu javobni qirralar bo‘yicha ham olish mumkin: 1–2 qirrasidan bitta uch, 1–3 dan ikkita, 3–4 dan bitta yo‘l o‘tadi, ya'ni 1 + 2 + 1 = 4.",
    "Yagona uch ildizning o‘zi va unga masofa 0, shuning uchun yig‘indi ham 0. Bu daraxtda qirra umuman yo‘q.",
  ],
  sampleNotesEn: [
    "The distances are 0 to node 1, 1 to node 2, 1 to node 3 and 2 to node 4, totalling 0 + 1 + 1 + 2 = 4. The same answer comes from the edges: one path uses 1–2, two use 1–3 and one uses 3–4, giving 1 + 2 + 1 = 4.",
    "The only node is the root and its distance is 0, so the total is 0. This tree has no edge at all.",
  ],
  testInputs: ["4\n1 2\n1 3\n3 4\n", "1\n", "2\n1 2\n", "5\n1 2\n2 3\n3 4\n4 5\n", "5\n1 2\n1 3\n1 4\n1 5\n", "6\n1 2\n1 3\n2 4\n2 5\n3 6\n"],
  sol: `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<long long>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);long long total=0;
while(!q.empty()){int v=q.front();q.pop();total+=d[v];
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<total<<"\\n";`,
  wrongNote: "Counting depth in nodes rather than edges adds one for every node; reporting the deepest distance answers the height instead of the total.",
  wrong: [
    `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<long long>d(n+1,-1);queue<int>q;d[1]=1;q.push(1);long long total=0;
while(!q.empty()){int v=q.front();q.pop();total+=d[v];
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<long long>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);long long best=0;
while(!q.empty()){int v=q.front();q.pop();best=max(best,d[v]);
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C352", judge: "count-good-substrings-mod", topic: "strings", rating: 2100,
  tag: "Prefix counting", timeLimitMs: 2000,
  uz: "Har bir harfi juft marta uchraydigan qism satrlar",
  en: "Substrings where every letter appears an even number of times",
  statementUz: "Sizga faqat dastlabki o‘nta kichik lotin harfidan ('a' dan 'j' gacha) iborat s satri berilgan. Ichida har bir harf juft marta (nol marta ham juft hisoblanadi) uchraydigan bo‘sh bo‘lmagan uzluksiz qism satrlarni sanang. Har bir prefiks uchun harflarning juft-toqligini bitta bitli maskada saqlash kifoya: ikkita prefiksning maskasi teng bo‘lsa, ular orasidagi qism satr shartni qanoatlantiradi.",
  statementEn: "You are given a string s built only from the first ten lowercase Latin letters, 'a' to 'j'. Count the non-empty contiguous substrings in which every letter appears an even number of times, where zero occurrences counts as even. It is enough to hold the parity of each letter for every prefix in a single bitmask: when two prefixes have the same mask, the substring between them satisfies the condition.",
  inputUz: "Yagona qatorda 'a' dan 'j' gacha bo‘lgan harflardan iborat s satri beriladi.",
  inputEn: "The only line contains the string s, built from the letters 'a' to 'j'.",
  outputUz: "Yagona butun sonni chiqaring — shartni qanoatlantiruvchi qism satrlar soni. Bunday qism satr bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of substrings satisfying the condition. If there is none, print 0.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'j' only", "zero occurrences of a letter counts as an even number", "the answer can reach about 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'j' belgilaridan iborat", "harfning nol marta uchrashi juft hisoblanadi", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["abab\n", "abc\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "Yagona mos qism satr — butun \"abab\": unda a ham, b ham ikki martadan uchraydi. Qisqaroqlari yaramaydi, masalan \"ab\" da har bir harf bir martadan, ya'ni toq marta uchraydi. Maskalar bo‘yicha: prefikslar 0, 1, 3, 2, 0 maskalarini beradi va faqat boshlang‘ich 0 bilan oxirgi 0 juftlashadi — shuning uchun javob 1.",
    "abc da har bir harf bir martadan uchraydi va hech qanday qism satrda barcha harflar juft bo‘la olmaydi, shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "The only qualifying substring is the whole of \"abab\", where a and b each appear twice. Shorter ones fail — \"ab\" holds one of each, which is odd. By masks: the prefixes give 0, 1, 3, 2, 0, and only the starting 0 pairs with the final 0, so the answer is 1.",
    "In abc each letter appears exactly once and no substring can have all its letters even, so the answer is 0.",
  ],
  testInputs: ["abab\n", "abc\n", "aa\n", "a\n", "aabb\n", "abcabc\n"],
  sol: `string s;cin>>s;vector<long long>cnt(1024,0);
cnt[0]=1;int mask=0;long long ans=0;
for(char c:s){mask^=(1<<(c-'a'));ans+=cnt[mask];++cnt[mask];}
cout<<ans<<"\\n";`,
  wrongNote: "Leaving the empty prefix out of the table loses every substring that starts at the first character; counting the masks instead of the pairs answers something else.",
  wrong: [
    `string s;cin>>s;vector<long long>cnt(1024,0);
int mask=0;long long ans=0;
for(char c:s){mask^=(1<<(c-'a'));ans+=cnt[mask];++cnt[mask];}
cout<<ans<<"\\n";`,
    `string s;cin>>s;vector<long long>cnt(1024,0);
cnt[0]=1;int mask=0;
for(char c:s){mask^=(1<<(c-'a'));++cnt[mask];}
long long ans=0;for(long long v:cnt)if(v>0)++ans;
cout<<ans<<"\\n";`,
  ],
});

export default P;
