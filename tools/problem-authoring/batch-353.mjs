/* Batch 353 — ten problems, A353–B362.
 *
 * Aimed at the thinnest topics in the bank: foundations, geometry, sorting and
 * programming basics, from 800 up to 1300.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A353", judge: "count-even-digits", topic: "math", rating: 800,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Juft raqamlar soni",
  en: "How many digits are even",
  statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan. Uning o‘nlik yozuvida nechta juft raqam borligini sanang. Juft raqamlar — 0, 2, 4, 6 va 8; qolganlari toq. Har bir raqam alohida sanaladi, ya'ni bir xil raqam bir necha marta uchrasa, har bir uchrashi hisobga olinadi. n 10^18 gacha borishi mumkin, shuning uchun uni 64-bitli turga o‘qish yoki satr sifatida ko‘rib chiqish kerak.",
  statementEn: "You are given a non-negative integer n. Count how many of its decimal digits are even. The even digits are 0, 2, 4, 6 and 8; the rest are odd. Each digit is counted on its own, so a digit appearing several times is counted once for every appearance. Since n reaches 10^18 it has to be read into a 64-bit type or handled as a string.",
  inputUz: "Yagona qatorda manfiy bo‘lmagan n butun soni beriladi; u boshida nolsiz yoziladi.",
  inputEn: "The only line contains the non-negative integer n, written without leading zeros.",
  outputUz: "Yagona butun sonni chiqaring — n dagi juft raqamlar soni.",
  outputEn: "Print a single integer — how many digits of n are even.",
  constraintList: ["0 ≤ n ≤ 10^18", "n has at most 19 decimal digits", "the digit 0 counts as even"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "n ko‘pi bilan 19 ta o‘nlik raqamdan iborat", "0 raqami juft hisoblanadi"],
  sampleInputs: ["2468013\n", "7\n"],
  expect: ["5\n", "0\n"],
  sampleNotesUz: [
    "Raqamlar 2, 4, 6, 8, 0, 1, 3. Juftlari 2, 4, 6, 8 va 0 — beshta. 1 va 3 toq, shuning uchun sanalmaydi. E'tibor bering, 0 ham juft hisoblanadi.",
    "Yagona raqam 7 toq, shuning uchun javob 0. Bu holat 0 ni juft deb sanamaydigan yechimni emas, umuman juft raqam yo‘qligini tekshiradi.",
  ],
  sampleNotesEn: [
    "The digits are 2, 4, 6, 8, 0, 1, 3. The even ones are 2, 4, 6, 8 and 0 — five of them. The 1 and the 3 are odd and are not counted. Note that 0 counts as even.",
    "The only digit, 7, is odd, so the answer is 0. This case checks that no even digit is found at all rather than testing the treatment of 0.",
  ],
  testInputs: ["2468013\n", "7\n", "0\n", "1000000000000000000\n", "13579\n", "2222222222\n"],
  sol: `string s;cin>>s;long long c=0;
for(char ch:s)if((ch-'0')%2==0)++c;
cout<<c<<"\\n";`,
  wrongNote: "Treating 0 as odd loses a digit; counting the odd ones answers the opposite question.",
  wrong: [
    `string s;cin>>s;long long c=0;
for(char ch:s){int d=ch-'0';if(d!=0&&d%2==0)++c;}
cout<<c<<"\\n";`,
    `string s;cin>>s;long long c=0;
for(char ch:s)if((ch-'0')%2==1)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A354", judge: "array-max-index", topic: "foundations", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Eng katta elementning o‘rni",
  en: "Where the largest element sits",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Eng katta element turgan pozitsiyani chiqaring; pozitsiyalar 1 dan boshlab sanaladi. Agar eng katta qiymat bir necha joyda uchrasa, ularning eng chapdagisini, ya'ni eng kichik pozitsiyasini chiqaring. Massivda manfiy sonlar ham bo‘lishi mumkin, shuning uchun maksimumni nol bilan emas, birinchi element bilan boshlab solishtirish kerak.",
  statementEn: "You are given an array of n integers. Print the position at which the largest element sits, with positions counted from 1. If the largest value occurs in several places, print the leftmost of them, that is the smallest such position. The array may contain negative numbers, so the running maximum has to start from the first element rather than from zero.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng katta element turgan eng kichik pozitsiya (1 dan sanaladi).",
  outputEn: "Print a single integer — the smallest position, counted from 1, at which the largest element sits.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "positions are numbered from 1", "on a tie the leftmost position wins"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "pozitsiyalar 1 dan raqamlanadi", "teng holatda eng chapdagi pozitsiya yutadi"],
  sampleInputs: ["5\n3 9 2 9 1\n", "3\n-5 -2 -7\n"],
  expect: ["2\n", "2\n"],
  sampleNotesUz: [
    "Eng katta qiymat 9 va u 2 hamda 4-pozitsiyalarda uchraydi. Eng chapdagisi talab qilingani uchun javob 2.",
    "Barcha qiymatlar manfiy; ularning eng kattasi −2 bo‘lib, 2-pozitsiyada turadi. Maksimumni 0 dan boshlagan yechim bu yerda hech qanday elementni topa olmasdi.",
  ],
  sampleNotesEn: [
    "The largest value is 9 and it appears at positions 2 and 4. The leftmost is asked for, so the answer is 2.",
    "Every value is negative and the largest of them is −2, at position 2. A solution that starts its running maximum at 0 would find no element at all here.",
  ],
  testInputs: ["5\n3 9 2 9 1\n", "3\n-5 -2 -7\n", "1\n42\n", "4\n7 7 7 7\n", "5\n1 2 3 4 5\n", "5\n5 4 3 2 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=0;
for(int i=1;i<n;++i)if(a[i]>a[best])best=i;
cout<<best+1<<"\\n";`,
  wrongNote: "Comparing with >= moves to the rightmost of the tied positions; starting the maximum at 0 fails on an all-negative array.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=0;
for(int i=1;i<n;++i)if(a[i]>=a[best])best=i;
cout<<best+1<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mx=0;int best=0;
for(int i=0;i<n;++i)if(a[i]>mx){mx=a[i];best=i;}
cout<<best+1<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A355", judge: "array-all-equal", topic: "programming-basics", rating: 900,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Barcha elementlar tengmi",
  en: "Are all the elements equal",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uning barcha elementlari bir xil qiymatga tengmi, aniqlang. Bitta elementdan iborat massivda solishtiradigan narsa yo‘q, shuning uchun u har doim shartni qanoatlantiradi. Massivni bir marta yurib chiqib, har bir elementni birinchisi bilan solishtirish kifoya — barchasini juft-juft solishtirish shart emas.",
  statementEn: "You are given an array of n integers. Determine whether all of its elements hold the same value. An array of one element has nothing to compare, so it always satisfies the condition. One pass comparing every element against the first is enough — there is no need to compare every pair.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Agar barcha elementlar teng bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if every element is equal and NO otherwise, in capital letters.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "an array of one element always answers YES"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "bitta elementli massiv har doim YES javobini beradi"],
  sampleInputs: ["4\n7 7 7 7\n", "3\n1 1 2\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "To‘rtala element ham 7 ga teng, shuning uchun javob YES.",
    "Dastlabki ikkitasi teng, lekin uchinchisi 2 — bitta farq ham yetarli, javob NO. Faqat qo‘shni juftlarni emas, hammasini birinchi element bilan solishtirish ham xuddi shu natijani beradi.",
  ],
  sampleNotesEn: [
    "All four elements equal 7, so the answer is YES.",
    "The first two match but the third is 2 — a single difference is enough, so the answer is NO. Comparing every element against the first gives the same result as comparing neighbours.",
  ],
  testInputs: ["4\n7 7 7 7\n", "3\n1 1 2\n", "1\n5\n", "2\n-3 -3\n", "5\n1 1 1 1 2\n", "3\n2 1 1\n", "3\n1 2 1\n", "5\n4 4 9 4 4\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
bool same=true;
for(int i=1;i<n;++i)if(a[i]!=a[0]){same=false;break;}
cout<<(same?"YES":"NO")<<"\\n";`,
  wrongNote: "Comparing only the first and last elements misses a difference in the middle; comparing only the first pair misses everything after it.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
cout<<((a[0]==a[n-1])?"YES":"NO")<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
bool same=(n<2)||(a[0]==a[1]);
cout<<(same?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A356", judge: "digital-root-repeat", topic: "math", rating: 900,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Raqamli ildiz",
  en: "The digital root",
  statementUz: "Sizga manfiy bo‘lmagan n butun soni berilgan. Uning raqamlarini qo‘shing; natija bir xonali bo‘lmaguncha bu amalni takrorlang va oxirgi qolgan raqamni chiqaring. Masalan, 9875 dan 29, undan 11, undan esa 2 hosil bo‘ladi. n = 0 uchun natija darhol 0 bo‘ladi, chunki u allaqachon bir xonali.",
  statementEn: "You are given a non-negative integer n. Add up its digits, and repeat that on the result until a single digit remains; print that digit. For example 9875 gives 29, then 11, then 2. For n = 0 the result is 0 straight away, since it is already a single digit.",
  inputUz: "Yagona qatorda manfiy bo‘lmagan n butun soni beriladi.",
  inputEn: "The only line contains the non-negative integer n.",
  outputUz: "Yagona raqamni chiqaring — takroriy qo‘shishdan keyin qolgan bir xonali son.",
  outputEn: "Print a single digit — what is left after the repeated summing.",
  constraintList: ["0 ≤ n ≤ 10^18", "the answer is always a single digit from 0 to 9"],
  constraintListUz: ["0 ≤ n ≤ 10^18", "javob har doim 0 dan 9 gacha bo‘lgan bitta raqam"],
  sampleInputs: ["9875\n", "0\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "9 + 8 + 7 + 5 = 29, so‘ng 2 + 9 = 11, so‘ng 1 + 1 = 2. Natija bir xonali bo‘lgach to‘xtaladi, shuning uchun javob 2.",
    "0 allaqachon bir xonali, shuning uchun hech qanday qo‘shish bajarilmaydi va javob 0. Bu holat qo‘shishni kamida bir marta bajaradigan tsiklni fosh qiladi.",
  ],
  sampleNotesEn: [
    "9 + 8 + 7 + 5 = 29, then 2 + 9 = 11, then 1 + 1 = 2. The process stops once the result is a single digit, so the answer is 2.",
    "0 is already a single digit, so no summing happens at all and the answer is 0. This is the case that catches a loop which always sums at least once.",
  ],
  testInputs: ["9875\n", "0\n", "9\n", "999999999999999999\n", "10\n", "18\n"],
  sol: `string s;cin>>s;long long v=0;
for(char c:s)v+=c-'0';
while(v>9){long long t=0;while(v){t+=v%10;v/=10;}v=t;}
cout<<v<<"\\n";`,
  wrongNote: "Summing the digits only once stops short on a large number; the mod-9 shortcut gives 0 instead of 9 for a multiple of nine.",
  wrong: [
    `string s;cin>>s;long long v=0;
for(char c:s)v+=c-'0';
cout<<v<<"\\n";`,
    `string s;cin>>s;long long v=0;
for(char c:s)v+=c-'0';
cout<<(v%9)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A357", judge: "geo-triangle-type", topic: "geometry", rating: 1000,
  tag: "Geometry", timeLimitMs: 1000,
  uz: "Uchburchak turini aniqlash",
  en: "What kind of triangle",
  statementUz: "Sizga uchta musbat butun son a, b va c — uchburchak tomonlarining uzunliklari berilgan. Avval bu uzunliklardan umuman uchburchak yasash mumkinligini tekshiring: har bir tomon qolgan ikkitasining yig‘indisidan qat'iy kichik bo‘lishi shart. Agar yasab bo‘lmasa, buni aytish kerak; aks holda uchburchak turini aniqlang: uchala tomoni teng bo‘lsa teng tomonli, aynan ikkitasi teng bo‘lsa teng yonli, hammasi har xil bo‘lsa har xil tomonli.",
  statementEn: "You are given three positive integers a, b and c, the side lengths of a triangle. First check whether the lengths form a triangle at all: each side must be strictly less than the sum of the other two. If they do not, say so; otherwise classify the triangle — all three sides equal makes it equilateral, exactly two equal makes it isosceles, and all three different makes it scalene.",
  inputUz: "Yagona qatorda probel bilan ajratilgan uchta musbat butun son a, b va c beriladi.",
  inputEn: "The only line contains three positive integers a, b and c separated by single spaces.",
  outputUz: "Bitta so‘zni chiqaring: uchburchak yasab bo‘lmasa NONE, teng tomonli bo‘lsa EQUILATERAL, teng yonli bo‘lsa ISOSCELES, aks holda SCALENE.",
  outputEn: "Print one word: NONE if no triangle can be formed, EQUILATERAL if all sides are equal, ISOSCELES if exactly two are, and SCALENE otherwise.",
  constraintList: ["1 ≤ a, b, c ≤ 10^9", "the sum of two sides reaches 2·10^9 and needs a 64-bit type", "the triangle inequality is strict, so 1 2 3 forms no triangle"],
  constraintListUz: ["1 ≤ a, b, c ≤ 10^9", "ikki tomon yig‘indisi 2·10^9 ga yetadi va 64-bitli turni talab qiladi", "uchburchak tengsizligi qat'iy, shuning uchun 1 2 3 uchburchak yasamaydi"],
  sampleInputs: ["3 4 5\n", "1 2 3\n"],
  expect: ["SCALENE\n", "NONE\n"],
  sampleNotesUz: [
    "3 + 4 > 5, 3 + 5 > 4 va 4 + 5 > 3 — uchburchak yasaladi. Uchala tomon ham har xil, shuning uchun u har xil tomonli: SCALENE.",
    "1 + 2 = 3 bo‘lib, uchinchi tomondan qat'iy katta emas. Tengsizlik qat'iy bo‘lgani uchun bu uchburchak emas va javob NONE. Bu yerda tomonlar tekis chiziqqa yotib qoladi.",
  ],
  sampleNotesEn: [
    "3 + 4 > 5, 3 + 5 > 4 and 4 + 5 > 3, so a triangle exists. All three sides differ, which makes it scalene: SCALENE.",
    "1 + 2 = 3, which is not strictly greater than the third side. The inequality is strict, so this is not a triangle and the answer is NONE — the sides collapse onto a straight line.",
  ],
  testInputs: ["3 4 5\n", "1 2 3\n", "5 5 5\n", "5 5 8\n", "1000000000 1000000000 1000000000\n", "1 1 3\n"],
  sol: `long long a,b,c;cin>>a>>b>>c;
if(a+b<=c||a+c<=b||b+c<=a){cout<<"NONE\\n";return 0;}
if(a==b&&b==c)cout<<"EQUILATERAL\\n";
else if(a==b||b==c||a==c)cout<<"ISOSCELES\\n";
else cout<<"SCALENE\\n";`,
  wrongNote: "A non-strict inequality accepts the degenerate case where the sides lie flat; classifying before checking reports a type for something that is not a triangle.",
  wrong: [
    `long long a,b,c;cin>>a>>b>>c;
if(a+b<c||a+c<b||b+c<a){cout<<"NONE\\n";return 0;}
if(a==b&&b==c)cout<<"EQUILATERAL\\n";
else if(a==b||b==c||a==c)cout<<"ISOSCELES\\n";
else cout<<"SCALENE\\n";`,
    `long long a,b,c;cin>>a>>b>>c;
if(a==b&&b==c){cout<<"EQUILATERAL\\n";return 0;}
if(a==b||b==c||a==c){cout<<"ISOSCELES\\n";return 0;}
if(a+b<=c||a+c<=b||b+c<=a){cout<<"NONE\\n";return 0;}
cout<<"SCALENE\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1100 */
P.push({
  id: "A358", judge: "count-pairs-sum-even", topic: "math", rating: 1100,
  tag: "Parity", timeLimitMs: 1000,
  uz: "Yig‘indisi juft bo‘lgan juftliklar",
  en: "Pairs that add up to an even number",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. i < j shartini qanoatlantiruvchi va a_i + a_j yig‘indisi juft bo‘lgan (i, j) juftliklar sonini toping. Ikki sonning yig‘indisi ikkalasi ham juft yoki ikkalasi ham toq bo‘lgandagina juft bo‘ladi, shuning uchun juftliklarni birma-bir ko‘rib chiqish shart emas: juft va toq elementlar sonini sanash kifoya.",
  statementEn: "You are given an array of n integers. Count the pairs (i, j) with i < j whose sum a_i + a_j is even. A sum of two numbers is even exactly when both are even or both are odd, so the pairs need not be examined one by one: counting how many elements are even and how many are odd is enough.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi juft bo‘lgan juftliklar soni.",
  outputEn: "Print a single integer — how many pairs have an even sum.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the answer reaches about 5·10^9 and needs a 64-bit type", "pairs are counted by position, so equal values at different positions count separately"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi", "juftliklar pozitsiya bo‘yicha sanaladi, ya'ni har xil pozitsiyalardagi teng qiymatlar alohida sanaladi"],
  sampleInputs: ["4\n1 2 3 4\n", "3\n-1 -3 2\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "Juftlari 2 va 4 (ikkita), toqlari 1 va 3 (ikkita). Juftlardan bitta juftlik, toqlardan yana bitta juftlik chiqadi, jami 2. Aralash juftliklarning yig‘indisi toq bo‘ladi va sanalmaydi.",
    "−1 va −3 toq, 2 esa juft. Yagona mos juftlik — ikkita toq son, ya'ni javob 1. Manfiy sonlarning juft-toqligi musbatlarnikidek aniqlanadi.",
  ],
  sampleNotesEn: [
    "The even values are 2 and 4 (two of them) and the odd ones are 1 and 3 (also two). The evens give one pair and the odds give another, so the total is 2. A mixed pair sums to an odd number and does not count.",
    "Here −1 and −3 are odd and 2 is even. The only qualifying pair is the two odd numbers, so the answer is 1. Parity of a negative number is decided the same way as for a positive one.",
  ],
  testInputs: ["4\n1 2 3 4\n", "3\n-1 -3 2\n", "1\n5\n", "5\n2 4 6 8 10\n", "5\n1 3 5 7 9\n", "2\n-2 3\n"],
  sol: `int n;cin>>n;long long ev=0,od=0,x;
for(int i=0;i<n;++i){cin>>x;if(((x%2)+2)%2==0)++ev;else ++od;}
cout<<(ev*(ev-1)/2+od*(od-1)/2)<<"\\n";`,
  wrongNote: "Testing x % 2 == 1 misses negative odd numbers, whose remainder is -1; counting only the even group forgets that two odds also sum to an even number.",
  wrong: [
    `int n;cin>>n;long long ev=0,od=0,x;
for(int i=0;i<n;++i){cin>>x;if(x%2==1)++od;else ++ev;}
cout<<(ev*(ev-1)/2+od*(od-1)/2)<<"\\n";`,
    `int n;cin>>n;long long ev=0,x;
for(int i=0;i<n;++i){cin>>x;if(((x%2)+2)%2==0)++ev;}
cout<<(ev*(ev-1)/2)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B359", judge: "min-moves-level-up", topic: "foundations", rating: 1200,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Hammani eng kattasiga tenglashtirish",
  en: "Bringing everyone up to the maximum",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Bitta harakatda istalgan bitta elementni bir birlikka oshirish mumkin. Barcha elementlarni teng qilish uchun kerak bo‘ladigan eng kam harakatlar sonini toping. Elementlarni faqat oshirish mumkin bo‘lgani uchun hamma massivdagi eng katta qiymatga tenglashishi kerak, ya'ni javob har bir element bilan maksimum orasidagi farqlar yig‘indisiga teng.",
  statementEn: "You are given an array of n integers. One move increases any single element by one. Find the smallest number of moves needed to make every element equal. Since elements can only be increased, they all have to meet the largest value in the array, so the answer is the total of the differences between each element and that maximum.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — barcha elementlarni teng qilish uchun kerak bo‘ladigan eng kam harakatlar soni.",
  outputEn: "Print a single integer — the fewest moves needed to make every element equal.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the answer reaches about 2·10^14 and needs a 64-bit type", "an array whose elements are already equal needs no move"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "javob taxminan 2·10^14 ga yetadi va 64-bitli turni talab qiladi", "elementlari allaqachon teng massivga harakat kerak emas"],
  sampleInputs: ["4\n1 2 3 4\n", "3\n-5 -5 -5\n"],
  expect: ["6\n", "0\n"],
  sampleNotesUz: [
    "Eng katta qiymat 4. Farqlar 3, 2, 1 va 0, ularning yig‘indisi 6. Hammani 4 dan pastroq qiymatga tenglashtirib bo‘lmaydi, chunki kamaytirishga ruxsat yo‘q.",
    "Barcha elementlar allaqachon teng, shuning uchun birorta harakat kerak emas va javob 0. Manfiy qiymatlar hech narsani o‘zgartirmaydi — muhimi maksimumdan farq.",
  ],
  sampleNotesEn: [
    "The largest value is 4. The differences are 3, 2, 1 and 0, totalling 6. Nothing below 4 can be the common value, because decreasing is not allowed.",
    "Every element is already equal, so no move is needed and the answer is 0. The negative values change nothing — what matters is the distance from the maximum.",
  ],
  testInputs: ["4\n1 2 3 4\n", "3\n-5 -5 -5\n", "1\n7\n", "2\n-1000000000 1000000000\n", "5\n5 1 1 1 1\n", "3\n0 0 1\n", "5\n-1000000000 -1000000000 1000000000 1000000000 1000000000\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mx=*max_element(a.begin(),a.end()),total=0;
for(long long x:a)total+=mx-x;
cout<<total<<"\\n";`,
  wrongNote: "Levelling to the minimum answers a question nobody asked; an int accumulator overflows once the differences pile up.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mn=*min_element(a.begin(),a.end()),total=0;
for(long long x:a)total+=x-mn;
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mx=*max_element(a.begin(),a.end());int total=0;
for(long long x:a)total+=(int)(mx-x);
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B360", judge: "sort-parity-then-value", topic: "sorting", rating: 1200,
  tag: "Custom comparator", timeLimitMs: 1000,
  uz: "Avval juftlar, so‘ng toqlar",
  en: "Evens first, then odds",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uni shunday tartiblangki, barcha juft sonlar barcha toq sonlardan oldin tursin, har bir guruh ichida esa qiymatlar o‘sish tartibida joylashsin. Manfiy sonning juft-toqligi musbatlarnikidek aniqlanadi: −4 juft, −3 toq. Natijada massivning barcha elementlari saqlanadi, faqat ularning tartibi o‘zgaradi.",
  statementEn: "You are given an array of n integers. Reorder it so that every even number comes before every odd number, and within each group the values are in increasing order. Parity of a negative number is decided the same way as for a positive one: −4 is even and −3 is odd. Every element of the array survives; only the order changes.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Bitta qatorda, probel bilan ajratib, n ta butun sonni yuqorida tasvirlangan tartibda chiqaring.",
  outputEn: "Print the n integers on one line, separated by single spaces, in the order described above.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "negatives follow the same parity rule as positives", "duplicates are kept, so the output holds exactly n values"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "manfiylar uchun juft-toqlik qoidasi musbatlarnikidek", "takrorlanishlar saqlanadi, ya'ni chiqishda aynan n ta qiymat bo‘ladi"],
  sampleInputs: ["6\n5 2 3 8 1 4\n", "3\n-3 -4 -5\n"],
  expect: ["2 4 8 1 3 5\n", "-4 -5 -3\n"],
  sampleNotesUz: [
    "Juftlari 2, 8 va 4 — o‘sish tartibida 2 4 8. Toqlari 5, 3 va 1 — o‘sish tartibida 1 3 5. Juftlar oldinga qo‘yiladi, natija 2 4 8 1 3 5.",
    "Yagona juft son −4 oldinga chiqadi. Qolgan toqlari −5 va −3 bo‘lib, o‘sish tartibida −5 keyin −3 keladi. Manfiylarni modul bo‘yicha emas, qiymat bo‘yicha saralash kerak.",
  ],
  sampleNotesEn: [
    "The evens are 2, 8 and 4, which sort to 2 4 8. The odds are 5, 3 and 1, which sort to 1 3 5. The evens go first, giving 2 4 8 1 3 5.",
    "The only even value, −4, goes first. The remaining odds are −5 and −3, which sort to −5 then −3. Negatives are ordered by value, not by magnitude.",
  ],
  testInputs: ["6\n5 2 3 8 1 4\n", "3\n-3 -4 -5\n", "1\n7\n", "4\n2 2 1 1\n", "5\n1 3 5 7 9\n", "5\n2 4 6 8 10\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
auto even=[](long long v){return ((v%2)+2)%2==0;};
stable_sort(a.begin(),a.end(),[&](long long x,long long y){
 if(even(x)!=even(y))return even(x);
 return x<y;});
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
  wrongNote: "Deciding oddness with v % 2 == 1 calls every negative odd number even, because -3 % 2 is -1; sorting by value alone ignores the grouping entirely.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
auto even=[](long long v){return v%2!=1;};
stable_sort(a.begin(),a.end(),[&](long long x,long long y){
 if(even(x)!=even(y))return even(x);
 return x<y;});
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B361", judge: "geo-manhattan-farthest", topic: "geometry", rating: 1300,
  tag: "Manhattan distance", timeLimitMs: 1000,
  uz: "Eng uzoq ikki nuqta (Manhattan)",
  en: "The two farthest points under Manhattan distance",
  statementUz: "Sizga tekislikdagi n ta nuqta berilgan. Ularning istalgan ikkitasi orasidagi eng katta Manhattan masofasini toping; ikki nuqta orasidagi Manhattan masofasi |x₁ − x₂| + |y₁ − y₂| ga teng. Barcha juftliklarni ko‘rib chiqish n katta bo‘lganda ulgurmaydi, lekin modulni ochib qarasak, masofa (x + y) va (x − y) qiymatlarining farqiga aylanadi — shu ikki qiymatning eng kattasi bilan eng kichigi orasidagi farqni olish kifoya.",
  statementEn: "You are given n points in the plane. Find the largest Manhattan distance between any two of them, where the Manhattan distance between two points is |x₁ − x₂| + |y₁ − y₂|. Examining every pair is too slow for large n, but opening the absolute values turns the distance into a difference of the quantities (x + y) and (x − y) — so taking the spread of each of those two is enough.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida ikkita x va y butun soni keladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains two integers x and y.",
  outputUz: "Yagona butun sonni chiqaring — eng katta Manhattan masofasi. Nuqtalar soni bittadan ko‘p bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the largest Manhattan distance. If there is at most one point, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ x, y ≤ 10^9", "the answer reaches 4·10^9 and needs a 64-bit type", "two points may share the same coordinates, giving a distance of 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ x, y ≤ 10^9", "javob 4·10^9 ga yetadi va 64-bitli turni talab qiladi", "ikki nuqtaning koordinatalari bir xil bo‘lishi mumkin — bunday holda masofa 0"],
  sampleInputs: ["3\n0 0\n1 1\n5 5\n", "1\n3 4\n"],
  expect: ["10\n", "0\n"],
  sampleNotesUz: [
    "Eng uzoq juftlik (0,0) va (5,5): masofa |0 − 5| + |0 − 5| = 10. (0,0) bilan (1,1) orasidagi masofa 2, (1,1) bilan (5,5) orasidagi esa 8 — ikkalasi ham kichikroq.",
    "Yagona nuqta bor, ya'ni juftlik umuman yo‘q. Bunday holda javob 0 deb kelishilgan; maksimumni juda kichik sondan boshlagan yechim bu yerda ma'nosiz qiymat chiqarardi.",
  ],
  sampleNotesEn: [
    "The farthest pair is (0,0) and (5,5), at |0 − 5| + |0 − 5| = 10. The distance from (0,0) to (1,1) is 2 and from (1,1) to (5,5) is 8 — both smaller.",
    "There is a single point, so there is no pair at all. The answer is defined as 0 in that case; a solution starting its maximum at a very negative value would print nonsense here.",
  ],
  testInputs: ["3\n0 0\n1 1\n5 5\n", "1\n3 4\n", "2\n-1000000000 -1000000000\n1000000000 1000000000\n", "2\n5 5\n5 5\n", "4\n0 10\n10 0\n0 -10\n-10 0\n", "3\n1 2\n3 4\n5 6\n", "2\n0 10\n10 0\n"],
  sol: `int n;cin>>n;
const long long INF=(long long)4e18;
long long mxs=-INF,mns=INF,mxd=-INF,mnd=INF;
for(int i=0;i<n;++i){long long x,y;cin>>x>>y;
 mxs=max(mxs,x+y);mns=min(mns,x+y);
 mxd=max(mxd,x-y);mnd=min(mnd,x-y);}
long long ans=max(mxs-mns,mxd-mnd);
cout<<(n<2?0:ans)<<"\\n";`,
  wrongNote: "Taking only the spread of x + y misses the pairs whose distance shows up in x - y; the Euclidean formula answers a different distance.",
  wrong: [
    `int n;cin>>n;
const long long INF=(long long)4e18;
long long mxs=-INF,mns=INF;
for(int i=0;i<n;++i){long long x,y;cin>>x>>y;
 mxs=max(mxs,x+y);mns=min(mns,x+y);}
cout<<(n<2?0:(mxs-mns))<<"\\n";`,
    `int n;cin>>n;vector<long long>xs(n),ys(n);
for(int i=0;i<n;++i)cin>>xs[i]>>ys[i];
long long best=0;
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j){
 long long dx=xs[i]-xs[j],dy=ys[i]-ys[j];
 best=max(best,dx*dx+dy*dy);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B362", judge: "str-count-words-length-k", topic: "strings", rating: 1300,
  tag: "Parsing", timeLimitMs: 1000,
  uz: "Uzunligi k bo‘lgan so‘zlar",
  en: "Words of length exactly k",
  statementUz: "Sizga bir yoki bir nechta probel bilan ajratilgan so‘zlardan iborat matn qatori va k soni berilgan. Uzunligi aynan k ga teng bo‘lgan so‘zlar nechtaligini sanang. So‘z deb probel bo‘lmagan belgilarning uzluksiz eng uzun qismiga aytiladi; qator boshida yoki oxirida probel bo‘lishi mumkin va ketma-ket kelgan probellar yangi so‘z hosil qilmaydi.",
  statementEn: "You are given a line of text made of words separated by one or more spaces, and a number k. Count how many words have length exactly k. A word is a maximal run of non-space characters; the line may start or end with spaces, and consecutive spaces do not create an empty word.",
  inputUz: "Birinchi qatorda k butun soni beriladi. Ikkinchi qatorda kichik lotin harflari va probellardan iborat matn qatori keladi.",
  inputEn: "The first line contains the integer k. The second line contains the text, made of lowercase Latin letters and spaces.",
  outputUz: "Yagona butun sonni chiqaring — uzunligi aynan k ga teng so‘zlar soni.",
  outputEn: "Print a single integer — how many words have length exactly k.",
  constraintList: ["1 ≤ k ≤ 100", "1 ≤ length of the line ≤ 10^5", "the line contains only lowercase letters and spaces", "consecutive spaces do not create an empty word"],
  constraintListUz: ["1 ≤ k ≤ 100", "1 ≤ qator uzunligi ≤ 10^5", "qator faqat kichik harflar va probellardan iborat", "ketma-ket probellar bo‘sh so‘z hosil qilmaydi"],
  sampleInputs: ["4\nalgo yol juda zor kod\n", "2\naaa bb c dd\n"],
  expect: ["2\n", "2\n"],
  sampleNotesUz: [
    "So‘zlar: algo (4), yol (3), juda (4), zor (3), kod (3). Uzunligi aynan 4 bo‘lganlari algo va juda — ikkita. Uzunligi 3 bo‘lganlar sanalmaydi, chunki tenglik qat'iy talab qilinadi.",
    "So‘zlar aaa (3), bb (2), c (1) va dd (2). Uzunligi 2 bo‘lganlari bb va dd — ikkita.",
  ],
  sampleNotesEn: [
    "The words are algo (4), yol (3), juda (4), zor (3) and kod (3). Exactly two — algo and juda — have length 4. The length-3 words do not count, since equality is required.",
    "The words are aaa (3), bb (2), c (1) and dd (2). Two of them — bb and dd — have length 2.",
  ],
  testInputs: ["4\nalgo yol juda zor kod\n", "2\naaa bb c dd\n", "1\na\n", "3\naaaa\n", "2\nab  cd   ef\n", "5\nhello world abcde\n"],
  sol: `long long k;cin>>k;string w;long long c=0;
while(cin>>w)if((long long)w.size()==k)++c;
cout<<c<<"\\n";`,
  wrongNote: "Counting words at least k long, and counting words at most k long — both answer a question with an inequality where the task asks for equality.",
  wrong: [
    `long long k;cin>>k;string w;long long c=0;
while(cin>>w)if((long long)w.size()>=k)++c;
cout<<c<<"\\n";`,
    `long long k;cin>>k;string w;long long c=0;
while(cin>>w)if((long long)w.size()<=k)++c;
cout<<c<<"\\n";`,
  ],
});

export default P;
