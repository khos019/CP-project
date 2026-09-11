/* Batch 303 — ten problems at the foot of the ladder, A303–A312.
 *
 * Concepts the bank does not already cover: digit products, counting digits,
 * positional sums, triangular numbers, Hamming distance, multiples inside a
 * range, letter case, primality of a single number, the first character that
 * never repeats, and a mean with its extremes removed.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A303", judge: "digit-product", topic: "math", rating: 800,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Raqamlar ko‘paytmasi",
  en: "Product of the digits",
  statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan. Uning o‘nlik yozuvidagi barcha raqamlarini bir-biriga ko‘paytiring va natijani chiqaring. Masalan, 234 sonining raqamlari 2, 3 va 4 bo‘lib, ularning ko‘paytmasi 24 ga teng. Agar sonda kamida bitta 0 raqami bo‘lsa, ko‘paytma ham 0 bo‘ladi, chunki nolga ko‘paytirilgan har qanday son nolga aylanadi.",
  statementEn: "You are given a non-negative integer n. Multiply together every digit of its decimal representation and print the result. For example the digits of 234 are 2, 3 and 4, whose product is 24. If the number contains at least one 0 digit then the product is 0 as well, because anything multiplied by zero is zero.",
  inputUz: "Yagona qatorda bitta manfiy bo‘lmagan n butun soni beriladi. U boshida ortiqcha nolsiz va ishorasiz yoziladi.",
  inputEn: "The only line contains one non-negative integer n, written without leading zeros and without a sign.",
  outputUz: "Yagona butun sonni chiqaring — n ning raqamlari ko‘paytmasi.",
  outputEn: "Print a single integer — the product of the digits of n.",
  constraintList: ["0 ≤ n ≤ 10^18", "n has at most 19 decimal digits", "the product never exceeds 9^19, which needs a 64-bit type"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "n ko‘pi bilan 19 ta o‘nlik raqamdan iborat", "ko‘paytma 9^19 dan oshmaydi va bu 64-bitli turni talab qiladi"],
  sampleInputs: ["234\n", "1204\n"],
  expect: ["24\n", "0\n"],
  sampleNotesUz: [
    "Raqamlar 2, 3 va 4; ularni ketma-ket ko‘paytirsak 2 · 3 = 6, so‘ng 6 · 4 = 24 chiqadi. Ko‘paytmani 1 dan boshlab yuritish kerak — 0 dan boshlansa, natija har doim 0 bo‘lib qolardi.",
    "Sonda 0 raqami bor, shuning uchun ko‘paytma 1 · 2 · 0 · 4 = 0. Nol raqamini o‘tkazib yuborib, faqat nolmaslarni ko‘paytirish xato bo‘lardi: u 8 ni berardi.",
  ],
  sampleNotesEn: [
    "The digits are 2, 3 and 4, so multiplying in turn gives 2 · 3 = 6 and then 6 · 4 = 24. The running product has to start at 1: starting it at 0 would leave the answer 0 for every input.",
    "The number contains a 0 digit, so the product is 1 · 2 · 0 · 4 = 0. Skipping the zero and multiplying only the non-zero digits would be wrong — that would give 8.",
  ],
  testInputs: ["234\n", "1204\n", "0\n", "9\n", "999999999999999999\n", "1000000000000000000\n"],
  sol: `string s;cin>>s;long long p=1;for(char c:s)p*=(c-'0');cout<<p<<"\\n";`,
  wrongNote: "Starting the product at zero, and skipping zero digits instead of letting them win.",
  wrong: [
    `string s;cin>>s;long long p=0;for(char c:s)p*=(c-'0');cout<<p<<"\\n";`,
    `string s;cin>>s;long long p=1;for(char c:s)if(c!='0')p*=(c-'0');cout<<p<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A304", judge: "count-digits", topic: "programming-basics", rating: 800,
  tag: "Loops", timeLimitMs: 1000,
  uz: "Sondagi raqamlar soni",
  en: "How many digits",
  statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan. Uning o‘nlik yozuvi nechta raqamdan iboratligini aniqlang. Masalan, 4070 to‘rtta raqamdan iborat. Alohida e'tibor bering: 0 soni bitta raqamdan iborat deb hisoblanadi, garchi uni 10 ga bo‘lish darhol nolni bersa ham.",
  statementEn: "You are given a non-negative integer n. Determine how many digits its decimal representation has. For example 4070 has four digits. Note one case in particular: the number 0 counts as having a single digit, even though dividing it by 10 immediately yields zero again.",
  inputUz: "Yagona qatorda bitta manfiy bo‘lmagan n butun soni beriladi. U boshida ortiqcha nolsiz yoziladi.",
  inputEn: "The only line contains one non-negative integer n, written without leading zeros.",
  outputUz: "Yagona butun sonni chiqaring — n dagi raqamlar soni.",
  outputEn: "Print a single integer — the number of digits in n.",
  constraintList: ["0 ≤ n ≤ 10^18", "the answer is between 1 and 19 inclusive"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "javob 1 dan 19 gacha bo‘lgan oraliqda yotadi"],
  sampleInputs: ["4070\n", "0\n"],
  expect: ["4\n", "1\n"],
  sampleNotesUz: [
    "4070 da to‘rtta raqam bor: 4, 0, 7 va 0. O‘rtadagi nol ham sanaladi — u sonning yozuvidagi to‘liq huquqli raqam.",
    "0 bitta raqamdan iborat. Aynan shu holat `while (n > 0)` ko‘rinishidagi tsiklni sindiradi: u umuman aylanmaydi va hisoblagich 0 bo‘lib qoladi, javob esa 1 bo‘lishi kerak.",
  ],
  sampleNotesEn: [
    "4070 has four digits: 4, 0, 7 and 0. The zero in the middle counts too — it is a digit of the written number like any other.",
    "0 has one digit. This is exactly the case that breaks a loop written as `while (n > 0)`: it never runs, leaving the counter at 0, while the answer should be 1.",
  ],
  testInputs: ["4070\n", "0\n", "9\n", "10\n", "1000000000000000000\n", "999999999999999999\n"],
  sol: `string s;cin>>s;cout<<(long long)s.size()<<"\\n";`,
  wrongNote: "The classic division loop that never runs for zero, and one that stops a digit early.",
  wrong: [
    `long long n;cin>>n;int c=0;while(n>0){n/=10;++c;}cout<<c<<"\\n";`,
    `long long n;cin>>n;int c=0;while(n>9){n/=10;++c;}cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A305", judge: "sum-even-positions", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Juft o‘rinlardagi yig‘indi",
  en: "Sum at the even positions",
  statementUz: "Sizga n ta butun sondan iborat a massivi berilgan. Pozitsiyalari juft bo‘lgan elementlarning yig‘indisini toping. Pozitsiyalar 1 dan sanaladi, ya'ni 2-, 4-, 6- va hokazo o‘rindagi elementlar qo‘shiladi; birinchi element hech qachon hisobga olinmaydi. E'tibor bering, gap element qiymatining juftligi haqida emas, uning turgan o‘rni haqida bormoqda.",
  statementEn: "You are given an array a of n integers. Find the sum of the elements standing at even positions. Positions are counted from 1, so the elements at positions 2, 4, 6 and so on are added and the first element is never included. Note that this is about where an element stands, not about whether its value is even.",
  inputUz: "Birinchi qatorda bitta n butun soni — elementlar soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son a_1, a_2, …, a_n keladi.",
  inputEn: "The first line contains one integer n — the number of elements. The second line contains n integers a_1, a_2, …, a_n separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — juft pozitsiyalardagi elementlar yig‘indisi. Bunday element bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the sum of the elements at even positions. If there is no such element, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the sum can reach 10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "yig‘indi 10^14 ga yetishi mumkin va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n7 1 7 3 7\n", "1\n42\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "2- va 4-o‘rinlarda 1 va 3 turibdi, ularning yig‘indisi 4. Uchala 7 ham toq o‘rinlarda joylashgani uchun qatnashmaydi — qiymatlarning o‘zi toq yoki juftligi bu yerda hech qanday rol o‘ynamaydi.",
    "Yagona element 1-o‘rinda, ya'ni toq pozitsiyada turibdi, shuning uchun qo‘shiladigan hech narsa yo‘q va javob 0. 42 ning o‘zi juft son bo‘lsa ham, bu ahamiyatsiz.",
  ],
  sampleNotesEn: [
    "Positions 2 and 4 hold 1 and 3, which sum to 4. All three 7s sit at odd positions and take no part — whether the values themselves are odd or even plays no role here.",
    "The only element stands at position 1, which is odd, so there is nothing to add and the answer is 0. That 42 is itself an even number is irrelevant.",
  ],
  testInputs: ["5\n7 1 7 3 7\n", "1\n42\n", "2\n-1000000000 -1000000000\n", "6\n1 2 3 4 5 6\n", "4\n2 2 2 2\n", "3\n0 0 0\n"],
  sol: `int n;cin>>n;long long s=0,x;for(int i=1;i<=n;++i){cin>>x;if(i%2==0)s+=x;}cout<<s<<"\\n";`,
  wrongNote: "Reading the index as 0-based sums the other half; testing the value instead of the position answers a different question.",
  wrong: [
    `int n;cin>>n;long long s=0,x;for(int i=0;i<n;++i){cin>>x;if(i%2==0)s+=x;}cout<<s<<"\\n";`,
    `int n;cin>>n;long long s=0,x;for(int i=1;i<=n;++i){cin>>x;if(x%2==0)s+=x;}cout<<s<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A306", judge: "nth-triangular", topic: "math", rating: 800,
  tag: "Formulas", timeLimitMs: 1000,
  uz: "n-chi uchburchak son",
  en: "The n-th triangular number",
  statementUz: "Sizga musbat n butun soni berilgan. 1 dan n gacha bo‘lgan barcha butun sonlar yig‘indisini, ya'ni 1 + 2 + 3 + … + n qiymatini toping. Bu son n-chi uchburchak son deb ataladi. n 10^9 gacha borgani uchun hadlarni birma-bir qo‘shadigan tsikl vaqtida tugamaydi va yopiq formuladan foydalanish kerak.",
  statementEn: "You are given a positive integer n. Find the sum of all integers from 1 to n, that is the value of 1 + 2 + 3 + … + n. This number is called the n-th triangular number. Since n goes up to 10^9, a loop adding the terms one at a time will not finish in time and the closed form has to be used instead.",
  inputUz: "Yagona qatorda bitta musbat n butun soni beriladi.",
  inputEn: "The only line contains one positive integer n.",
  outputUz: "Yagona butun sonni chiqaring — 1 dan n gacha bo‘lgan sonlar yig‘indisi.",
  outputEn: "Print a single integer — the sum of the integers from 1 to n.",
  constraintList: ["1 ≤ n ≤ 10^9", "the answer reaches about 5·10^17 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^9", "javob taxminan 5·10^17 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n", "1\n"],
  expect: ["15\n", "1\n"],
  sampleNotesUz: [
    "1 + 2 + 3 + 4 + 5 = 15, va yopiq formula ham shuni beradi: 5 · 6 / 2 = 15. Ko‘paytirishni bo‘lishdan oldin bajaring, lekin n · (n+1) ni 64-bitli turda saqlang — aks holda katta n da toshib ketadi.",
    "n = 1 bo‘lganda yig‘indi yagona 1 haddan iborat, ya'ni javob 1. Formula ham 1 · 2 / 2 = 1 beradi.",
  ],
  sampleNotesEn: [
    "1 + 2 + 3 + 4 + 5 = 15, and the closed form agrees: 5 · 6 / 2 = 15. Do the multiplication before the division, but hold n · (n+1) in a 64-bit type — otherwise it overflows for large n.",
    "For n = 1 the sum has the single term 1, so the answer is 1. The formula gives 1 · 2 / 2 = 1 as well.",
  ],
  testInputs: ["5\n", "1\n", "1000000000\n", "2\n", "999999999\n", "100000\n"],
  sol: `long long n;cin>>n;cout<<n*(n+1)/2<<"\\n";`,
  wrongNote: "Computing the product in 32 bits overflows; dividing before multiplying loses the odd half.",
  wrong: [
    `long long n;cin>>n;int m=(int)n;cout<<(long long)(m*(m+1)/2)<<"\\n";`,
    `long long n;cin>>n;cout<<(n/2)*(n+1)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A307", judge: "hamming-distance", topic: "strings", rating: 900,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Hamming masofasi",
  en: "Hamming distance",
  statementUz: "Sizga bir xil uzunlikdagi ikkita s va t satri berilgan. Ular nechta pozitsiyada bir-biridan farq qilishini sanang. Bu son Hamming masofasi deb ataladi: har bir i uchun s ning i-belgisi t ning i-belgisiga teng bo‘lmasa, hisoblagich bittaga oshadi. Satrlarni siljitish yoki qayta tartiblash mumkin emas — solishtirish qat'iy ravishda o‘rindan o‘ringa bajariladi.",
  statementEn: "You are given two strings s and t of equal length. Count how many positions they differ at. That count is called the Hamming distance: for every index i, the counter goes up by one when the i-th character of s is not equal to the i-th character of t. The strings may not be shifted or rearranged — the comparison is strictly position against position.",
  inputUz: "Birinchi qatorda s satri, ikkinchi qatorda t satri beriladi. Ikkalasi ham kichik lotin harflaridan iborat va uzunliklari teng.",
  inputEn: "The first line contains the string s and the second line contains the string t. Both consist of lowercase Latin letters and have the same length.",
  outputUz: "Yagona butun sonni chiqaring — s va t farq qiladigan pozitsiyalar soni. Satrlar bir xil bo‘lsa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of positions at which s and t differ. If the strings are identical, print 0.",
  constraintList: ["1 ≤ |s| = |t| ≤ 10^5", "both strings consist of the characters 'a'–'z'"],
  constraintListUz: ["1 ≤ |s| = |t| ≤ 10^5", "ikkala satr ham 'a'–'z' belgilaridan iborat"],
  sampleInputs: ["karolin\nkathrin\n", "abc\nabc\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "Satrlar 3-, 4- va 5-pozitsiyalarda farq qiladi: 'r' ga qarshi 't', 'o' ga qarshi 'h' va 'l' ga qarshi 'r'. Qolgan to‘rtta pozitsiyada belgilar mos keladi, shuning uchun javob 3.",
    "Ikkita bir xil satr birorta pozitsiyada ham farq qilmaydi, ya'ni masofa 0. Bu mumkin bo‘lgan eng kichik javob.",
  ],
  sampleNotesEn: [
    "The strings differ at positions 3, 4 and 5: 't' against 'r', 'h' against 'o' and 'r' against 'l'. The other four positions match, so the answer is 3.",
    "Two identical strings differ nowhere, so the distance is 0. That is the smallest answer possible.",
  ],
  testInputs: ["karolin\nkathrin\n", "abc\nabc\n", "a\nb\n", "aaaa\nbbbb\n", "abcdef\nabcdff\n", "z\nz\n"],
  sol: `string s,t;cin>>s>>t;long long c=0;for(size_t i=0;i<s.size();++i)if(s[i]!=t[i])++c;cout<<c<<"\\n";`,
  wrongNote: "Counting the matches instead of the mismatches, and stopping one character early.",
  wrong: [
    `string s,t;cin>>s>>t;long long c=0;for(size_t i=0;i<s.size();++i)if(s[i]==t[i])++c;cout<<c<<"\\n";`,
    `string s,t;cin>>s>>t;long long c=0;for(size_t i=0;i+1<s.size();++i)if(s[i]!=t[i])++c;cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A308", judge: "count-multiples-range", topic: "math", rating: 900,
  tag: "Divisibility", timeLimitMs: 1000,
  uz: "Oraliqdagi karralilar soni",
  en: "Multiples inside a range",
  statementUz: "Sizga uchta butun son l, r va k berilgan. l dan r gacha bo‘lgan oraliqda (ikkala chet ham kiradi) k ga qoldiqsiz bo‘linadigan nechta son borligini toping. Oraliq 10^18 tagacha son saqlashi mumkin, shuning uchun ularni birma-bir sanab chiqish imkonsiz — javobni ikkita bo‘lish orqali hisoblash kerak.",
  statementEn: "You are given three integers l, r and k. Find how many numbers in the range from l to r inclusive are divisible by k without a remainder. The range may hold up to 10^18 numbers, so counting them one by one is impossible — the answer has to come from two divisions.",
  inputUz: "Yagona qatorda probel bilan ajratilgan uchta l, r va k butun soni beriladi.",
  inputEn: "The only line contains three integers l, r and k separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — oraliqdagi k ga bo‘linadigan sonlar soni. Bunday son bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — how many numbers in the range are divisible by k. If there is none, print 0.",
  constraintList: ["1 ≤ l ≤ r ≤ 10^18", "1 ≤ k ≤ 10^18", "l and r are both positive"],
  constraintListUz: ["1 ≤ l ≤ r ≤ 10^18", "1 ≤ k ≤ 10^18", "l va r ikkalasi ham musbat"],
  sampleInputs: ["6 20 5\n", "7 9 10\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: [
    "6 dan 20 gacha 5 ga bo‘linadiganlar 10, 15 va 20 — uchta. Buni sanamasdan topish uchun 20 / 5 = 4 dan 5 / 5 = 1 ni ayirish kifoya: 4 − 1 = 3. Chap chetni chiqarib tashlashda l − 1 dan foydalanilgani muhim, aks holda l ning o‘zi noto‘g‘ri tashlab yuborilardi.",
    "7, 8 va 9 ning hech biri 10 ga bo‘linmaydi, shuning uchun javob 0. Formula ham shuni beradi: 9 / 10 = 0 va 6 / 10 = 0, ayirmasi 0.",
  ],
  sampleNotesEn: [
    "Between 6 and 20 the multiples of 5 are 10, 15 and 20 — three of them. To find that without counting, subtract 5 / 5 = 1 from 20 / 5 = 4, giving 4 − 1 = 3. Using l − 1 for the left end matters: using l itself would wrongly discard l when l is a multiple.",
    "None of 7, 8 and 9 is divisible by 10, so the answer is 0. The formula agrees: 9 / 10 = 0 and 6 / 10 = 0, and their difference is 0.",
  ],
  testInputs: ["6 20 5\n", "7 9 10\n", "1 1000000000000000000 1\n", "10 10 10\n", "1 10 3\n", "999999999999999999 1000000000000000000 2\n"],
  sol: `long long l,r,k;cin>>l>>r>>k;cout<<r/k-(l-1)/k<<"\\n";`,
  wrongNote: "Subtracting l/k instead of (l-1)/k drops a multiple sitting exactly on the left end.",
  wrong: [
    `long long l,r,k;cin>>l>>r>>k;cout<<r/k-l/k<<"\\n";`,
    `long long l,r,k;cin>>l>>r>>k;cout<<(r-l)/k<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A309", judge: "count-letter-case", topic: "strings", rating: 900,
  tag: "Characters", timeLimitMs: 1000,
  uz: "Katta va kichik harflar soni",
  en: "Uppercase and lowercase counts",
  statementUz: "Sizga lotin harflaridan iborat s satri berilgan; unda ham katta, ham kichik harflar uchrashi mumkin. Satrda nechta katta harf va nechta kichik harf borligini sanang. Har bir belgi aynan bitta guruhga tegishli bo‘ladi, shuning uchun ikkala sonning yig‘indisi har doim satr uzunligiga teng chiqadi.",
  statementEn: "You are given a string s of Latin letters, which may contain both uppercase and lowercase ones. Count how many uppercase letters and how many lowercase letters it holds. Every character belongs to exactly one of the two groups, so the two counts always add up to the length of the string.",
  inputUz: "Yagona qatorda s satri beriladi. U faqat lotin harflaridan iborat va probel saqlamaydi.",
  inputEn: "The only line contains the string s. It consists of Latin letters only and contains no spaces.",
  outputUz: "Bitta qatorda ikkita butun sonni chiqaring: avval katta harflar soni, so‘ng kichik harflar soni.",
  outputEn: "Print two integers on one line: the number of uppercase letters first, then the number of lowercase letters.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' and 'A'–'Z' only", "the two printed numbers always sum to |s|"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' va 'A'–'Z' belgilaridan iborat", "chiqarilgan ikki sonning yig‘indisi doim |s| ga teng"],
  sampleInputs: ["AlgoYol\n", "abc\n"],
  expect: ["2 5\n", "0 3\n"],
  sampleNotesUz: [
    "Katta harflar 'A' va 'Y' — ikkita; qolgan beshtasi ('l', 'g', 'o', 'o', 'l') kichik. Yig‘indi 2 + 5 = 7 bo‘lib, satr uzunligiga to‘g‘ri keladi.",
    "Bu satrda birorta katta harf yo‘q, shuning uchun birinchi son 0. Nol ham to‘liq huquqli javob — uni tashlab ketib, faqat ikkinchi sonni chiqarish xato bo‘lardi.",
  ],
  sampleNotesEn: [
    "The uppercase letters are 'A' and 'Y' — two of them; the remaining five ('l', 'g', 'o', 'o', 'l') are lowercase. The counts add to 2 + 5 = 7, which is the length of the string.",
    "This string has no uppercase letter at all, so the first number is 0. Zero is a real answer — dropping it and printing only the second number would be wrong.",
  ],
  testInputs: ["AlgoYol\n", "abc\n", "ABC\n", "a\n", "Z\n", "aAbBcC\n"],
  sol: `string s;cin>>s;long long u=0,l=0;for(char c:s){if(c>='A'&&c<='Z')++u;else ++l;}cout<<u<<" "<<l<<"\\n";`,
  wrongNote: "Printing the pair the other way round, and counting only the uppercase half.",
  wrong: [
    `string s;cin>>s;long long u=0,l=0;for(char c:s){if(c>='A'&&c<='Z')++u;else ++l;}cout<<l<<" "<<u<<"\\n";`,
    `string s;cin>>s;long long u=0;for(char c:s)if(c>='A'&&c<='Z')++u;cout<<u<<" "<<(long long)s.size()<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A310", judge: "is-prime-single", topic: "math", rating: 1000,
  tag: "Primality", timeLimitMs: 1000,
  uz: "Son tubmi",
  en: "Is the number prime",
  statementUz: "Sizga musbat n butun soni berilgan. U tub sonmi yoki yo‘qmi, aniqlang. Tub son — bu 1 dan katta bo‘lgan va faqat 1 va o‘ziga bo‘linadigan butun son. 1 tub emas, chunki uning 1 dan katta bo‘luvchisi yo‘q; 2 esa yagona juft tub son. Bo‘luvchilarni faqat n ning kvadrat ildizigacha tekshirish yetarli, chunki undan katta har bir bo‘luvchi kichigi bilan juftlashadi.",
  statementEn: "You are given a positive integer n. Determine whether it is prime. A prime is an integer greater than 1 whose only divisors are 1 and itself. 1 is not prime, because it has no divisor above 1, and 2 is the only even prime. It is enough to test divisors up to the square root of n, because every divisor above it pairs with one below.",
  inputUz: "Yagona qatorda bitta musbat n butun soni beriladi.",
  inputEn: "The only line contains one positive integer n.",
  outputUz: "Agar n tub son bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if n is prime and NO otherwise, in capital letters.",
  constraintList: ["1 ≤ n ≤ 10^12", "√n reaches 10^6, so trial division up to the square root runs in time", "d · d must be compared in a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^12", "√n 10^6 ga yetadi, shuning uchun kvadrat ildizgacha bo‘lish vaqtida ulguradi", "d · d solishtiruvi 64-bitli turda bajarilishi kerak"],
  sampleInputs: ["97\n", "1\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "97 ni 2 dan 9 gacha bo‘lgan hech bir son bo‘lmaydi, 10 · 10 = 100 esa allaqachon 97 dan katta, shuning uchun tekshiruv shu yerda to‘xtaydi va javob YES.",
    "1 tub emas: uning 1 dan katta bo‘luvchisi yo‘q, ya'ni ta'rifga tushmaydi. Aynan shu holatni alohida ko‘rib chiqish kerak, chunki bo‘luvchilarni izlaydigan tsikl 1 uchun umuman aylanmaydi va soni tub deb e'lon qilib qo‘yardi.",
  ],
  sampleNotesEn: [
    "No number from 2 to 9 divides 97, and 10 · 10 = 100 is already past 97, so the search stops there and the answer is YES.",
    "1 is not prime: it has no divisor above 1, so it fails the definition. This is the case that needs handling separately, because a loop looking for divisors never runs for 1 and would declare it prime.",
  ],
  testInputs: ["97\n", "1\n", "2\n", "4\n", "999999999989\n", "1000000000000\n"],
  sol: `long long n;cin>>n;if(n<2){cout<<"NO\\n";return 0;}
for(long long d=2;d*d<=n;++d)if(n%d==0){cout<<"NO\\n";return 0;}
cout<<"YES\\n";`,
  wrongNote: "Forgetting that 1 is not prime, and looping to n/2 in a way that misreports 2 and 3.",
  wrong: [
    `long long n;cin>>n;for(long long d=2;d*d<=n;++d)if(n%d==0){cout<<"NO\\n";return 0;}
cout<<"YES\\n";`,
    `long long n;cin>>n;if(n<2){cout<<"NO\\n";return 0;}
for(long long d=2;d<n;++d)if(n%d==0){cout<<"NO\\n";return 0;}
cout<<"YES\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A311", judge: "string-first-unique", topic: "strings", rating: 1000,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Takrorlanmagan birinchi harf",
  en: "First character that never repeats",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Satrda aynan bir marta uchraydigan harflar orasidan eng chapdagisining pozitsiyasini toping. Pozitsiyalar 1 dan sanaladi. Har bir harf necha marta uchrashini avval sanab chiqish kerak: harf takrorlanadimi yoki yo‘qmi degan savolga satrni oxirigacha ko‘rmasdan javob berib bo‘lmaydi.",
  statementEn: "You are given a string s of lowercase Latin letters. Among the letters that occur exactly once in it, find the position of the leftmost one. Positions are counted from 1. The occurrences of each letter have to be counted first: whether a letter repeats cannot be answered without having seen the whole string.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Aynan bir marta uchraydigan eng chapdagi harfning 1 dan boshlangan pozitsiyasini chiqaring. Har bir harf takrorlansa, -1 chiqaring.",
  outputEn: "Print the 1-based position of the leftmost letter occurring exactly once. If every letter repeats, print -1 instead.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' only"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' belgilaridan iborat"],
  sampleInputs: ["swiss\n", "aabb\n"],
  expect: ["2\n", "-1\n"],
  sampleNotesUz: [
    "'s' uch marta, 'i' bir marta, 'w' bir marta uchraydi. Bir marta uchraydiganlar 'w' (2-o‘rin) va 'i' (3-o‘rin), ulardan chapdagisi 2-pozitsiyada. E'tibor bering, birinchi belgi 's' bo‘lsa ham javob bo‘la olmaydi — u takrorlanadi.",
    "Har bir harf ikki martadan uchraydi, shuning uchun bir marta uchraydigan harf umuman yo‘q va javob -1.",
  ],
  sampleNotesEn: [
    "'s' occurs three times, 'i' once and 'w' once. The letters occurring once are 'w' (position 2) and 'i' (position 3), and the leftmost of those is at position 2. Note that the first character 's' cannot be the answer even though it comes first — it repeats.",
    "Every letter occurs twice, so there is no letter occurring exactly once and the answer is -1.",
  ],
  testInputs: ["swiss\n", "aabb\n", "a\n", "abcabc\n", "zzzzq\n", "aabbc\n"],
  sol: `string s;cin>>s;int f[26]={0};for(char c:s)++f[c-'a'];
for(size_t i=0;i<s.size();++i)if(f[s[i]-'a']==1){cout<<i+1<<"\\n";return 0;}
cout<<-1<<"\\n";`,
  wrongNote: "Reporting a 0-based index, and reporting the letter instead of where it stands.",
  wrong: [
    `string s;cin>>s;int f[26]={0};for(char c:s)++f[c-'a'];
for(size_t i=0;i<s.size();++i)if(f[s[i]-'a']==1){cout<<i<<"\\n";return 0;}
cout<<-1<<"\\n";`,
    `string s;cin>>s;int f[26]={0};for(char c:s)++f[c-'a'];
for(size_t i=0;i<s.size();++i)if(f[s[i]-'a']==1){cout<<s[i]<<"\\n";return 0;}
cout<<-1<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1100 */
P.push({
  id: "A312", judge: "average-drop-extremes", topic: "foundations", rating: 1100,
  tag: "Aggregation", timeLimitMs: 1000,
  uz: "Chetlarni tashlab o‘rtacha",
  en: "The mean with its extremes removed",
  statementUz: "Sizga n ta hakamning bahosi berilgan. Sport musobaqalaridagi kabi, eng yuqori va eng past bahodan bittadan tashlab yuboriladi, qolgan n − 2 ta baho bo‘yicha o‘rtacha hisoblanadi. Agar eng yuqori yoki eng past baho bir necha marta uchrasa, ulardan faqat bittasi tashlanadi. Javobni pastga yaxlitlab, ya'ni o‘rtachadan oshmaydigan eng katta butun sonni chiqaring.",
  statementEn: "You are given the scores of n judges. As in sport, one highest and one lowest score are thrown away and the mean is taken over the remaining n − 2 scores. If the highest or the lowest score occurs several times, only one copy of it is dropped. Print the answer rounded down, that is the largest integer not exceeding the mean.",
  inputUz: "Birinchi qatorda bitta n butun soni — hakamlar soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n — the number of judges. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — chetlar tashlangandan keyingi pastga yaxlitlangan o‘rtacha.",
  outputEn: "Print a single integer — the mean after the extremes are removed, rounded down.",
  constraintList: ["3 ≤ n ≤ 10^5", "0 ≤ score ≤ 10^6", "exactly one highest and one lowest score are dropped, even when they repeat"],
  constraintListUz: ["3 ≤ n ≤ 10^5", "0 ≤ baho ≤ 10^6", "eng yuqori va eng past bahodan aynan bittadan tashlanadi, ular takrorlansa ham"],
  sampleInputs: ["5\n4 9 2 9 6\n", "3\n7 7 7\n"],
  expect: ["6\n", "7\n"],
  sampleNotesUz: [
    "Eng past baho 2, eng yuqorisi 9 — har biridan bittadan tashlanadi va 4, 9, 6 qoladi. Ularning yig‘indisi 19, 19 / 3 = 6,33… bo‘lib, pastga yaxlitlanib 6 chiqadi. Ikkinchi 9 qolishiga e'tibor bering: takrorlangan maksimumdan faqat bittasi ketadi.",
    "Barcha bahalar teng, shuning uchun qaysi biri tashlanishi ahamiyatsiz: 7 qoladi va o‘rtacha ham 7. Bu n = 2 bo‘lib qolishi mumkin bo‘lgan eng kichik holat.",
  ],
  sampleNotesEn: [
    "The lowest score is 2 and the highest is 9; one of each is dropped, leaving 4, 9 and 6. Their total is 19, and 19 / 3 = 6.33…, which rounds down to 6. Note that the second 9 stays: only one copy of a repeated extreme is removed.",
    "Every score is the same, so which one is dropped makes no difference: 7s remain and the mean is 7. This is the smallest case the constraints allow.",
  ],
  testInputs: ["5\n4 9 2 9 6\n", "3\n7 7 7\n", "3\n0 0 1000000\n", "4\n1 2 3 4\n", "6\n5 5 5 5 5 5\n", "5\n1000000 1000000 1000000 0 0\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long s=0,mn=a[0],mx=a[0];for(long long x:a){s+=x;mn=min(mn,x);mx=max(mx,x);}
cout<<(s-mn-mx)/(n-2)<<"\\n";`,
  wrongNote: "Dividing by n rather than by what is left, and dropping every copy of each extreme.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long s=0,mn=a[0],mx=a[0];for(long long x:a){s+=x;mn=min(mn,x);mx=max(mx,x);}
cout<<(s-mn-mx)/n<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mn=a[0],mx=a[0];for(long long x:a){mn=min(mn,x);mx=max(mx,x);}
long long s=0,c=0;for(long long x:a)if(x!=mn&&x!=mx){s+=x;++c;}
cout<<(c?s/c:0)<<"\\n";`,
  ],
});

export default P;
