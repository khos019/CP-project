/* Batch 393 — ten problems, A393–C402.
 *
 * Programming basics and foundations at the bottom, ray casting and a
 * histogram at the top.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A393", judge: "array-swap-ends", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Birinchi va oxirgi elementni almashtirish",
  en: "Swapping the ends of the array",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Uning birinchi va oxirgi elementini o‘rin almashtiring va hosil bo‘lgan massivni chiqaring. Qolgan elementlar o‘z joyida qoladi. Agar massivda bitta element bo‘lsa, birinchi va oxirgi element bir xil bo‘ladi, ya'ni almashtirish hech narsani o‘zgartirmaydi.",
  statementEn: "You are given an array of n integers. Swap its first and last elements and print the resulting array. Every other element stays where it is. If the array holds a single element then the first and the last are the same one, so the swap changes nothing.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Bitta qatorda, probel bilan ajratib, almashtirilgandan keyingi n ta sonni chiqaring.",
  outputEn: "Print the n numbers on one line, separated by single spaces, after the swap.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "an array of one element is printed unchanged"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "bitta elementli massiv o‘zgarishsiz chiqariladi"],
  sampleInputs: ["5\n1 2 3 4 5\n", "1\n7\n"],
  expect: ["5 2 3 4 1\n", "7\n"],
  sampleNotesUz: [
    "1 va 5 o‘rin almashadi, o‘rtadagi 2, 3, 4 esa tegilmasdan qoladi: 5 2 3 4 1.",
    "Bitta element bo‘lganda birinchi va oxirgi element aynan bitta son, shuning uchun massiv o‘zgarishsiz chiqariladi.",
  ],
  sampleNotesEn: [
    "The 1 and the 5 trade places while 2, 3 and 4 in the middle are left alone, giving 5 2 3 4 1.",
    "With one element the first and the last are the very same number, so the array is printed unchanged.",
  ],
  testInputs: ["5\n1 2 3 4 5\n", "1\n7\n", "2\n1 2\n", "3\n-5 0 5\n", "4\n9 9 9 9\n", "2\n-1000000000 1000000000\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
swap(a[0],a[n-1]);
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
  wrongNote: "Reversing the whole array moves every element, not just the ends; assigning one end to the other without a temporary loses the value being overwritten.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
reverse(a.begin(),a.end());
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
a[0]=a[n-1];a[n-1]=a[0];
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`,
  ],
});

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A394", judge: "sum-of-cubes-mod", topic: "math", rating: 900,
  tag: "Formulas", timeLimitMs: 1000,
  uz: "Kublar yig‘indisi",
  en: "The sum of the cubes",
  statementUz: "Sizga n butun soni berilgan. 1³ + 2³ + … + n³ yig‘indisini 10^9 + 7 modul bo‘yicha hisoblang, ya'ni javob har doim 0 bilan 10^9 + 6 orasida yotadi. Hadlar tez o‘sadi va n 10^18 ga yetadi, shuning uchun javob to‘liq emas, modul ostida chiqariladi. 10^9 + 7 moduli tub son.",
  statementEn: "You are given an integer n. Compute 1³ + 2³ + … + n³ modulo 10^9 + 7, so that the answer always lies between 0 and 10^9 + 6. The terms grow quickly and n reaches 10^18, so the answer is reported under the modulus rather than in full. The modulus 10^9 + 7 is prime.",
  inputUz: "Yagona qatorda bitta n butun soni beriladi.",
  inputEn: "The only line contains one integer n.",
  outputUz: "Yagona butun sonni chiqaring — kublar yig‘indisining 10^9 + 7 bo‘yicha qoldig‘i.",
  outputEn: "Print a single integer — the sum of the cubes modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^18", "the modulus 10^9 + 7 is prime", "the intermediate products need reducing as they are built"],
  constraintListUz: ["1 ≤ n ≤ 10^18", "10^9 + 7 moduli tub son", "oraliq ko‘paytmalarni qurish jarayonida qoldiqqa keltirish kerak"],
  sampleInputs: ["3\n", "1\n"],
  expect: ["36\n", "1\n"],
  sampleNotesUz: [
    "1³ + 2³ + 3³ = 1 + 8 + 27 = 36. Formula ham shuni beradi: 1 + 2 + 3 = 6 va 6² = 36.",
    "n = 1 bo‘lganda yig‘indi 1³ = 1. Formula bo‘yicha ham (1 · 2 / 2)² = 1.",
  ],
  sampleNotesEn: [
    "1³ + 2³ + 3³ = 1 + 8 + 27 = 36. The formula agrees: 1 + 2 + 3 = 6 and 6² = 36.",
    "For n = 1 the sum is 1³ = 1, and the formula gives (1 · 2 / 2)² = 1 as well.",
  ],
  testInputs: ["3\n", "1\n", "10\n", "1000000000000000000\n", "1000000007\n", "2\n"],
  sol: `long long n;cin>>n;const long long M=1000000007;
long long a=n%M,b=(n+1)%M;
long long inv2=(M+1)/2;
long long t=a%M*(b%M)%M*inv2%M;
cout<<(t*t%M)<<"\\n";`,
  wrongNote: "The formula gives the square of the sum of the first n numbers, not that sum itself; halving after the squaring divides by two rather than by four.",
  wrong: [
    `long long n;cin>>n;const long long M=1000000007;
long long inv2=(M+1)/2;
long long t=(n%M)*((n+1)%M)%M*inv2%M;
cout<<t<<"\\n";`,
    `long long n;cin>>n;const long long M=1000000007;
long long inv2=(M+1)/2;
long long t=(n%M)*((n+1)%M)%M;
cout<<(t*t%M*inv2%M)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B395", judge: "str-can-form-palindrome", topic: "strings", rating: 1200,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Harflarni palindromga joylash mumkinmi",
  en: "Can the letters be rearranged into a palindrome",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Uning harflarini qayta joylashtirib palindrom hosil qilish mumkinmi, aniqlang. Palindrom oldinga ham, orqaga ham bir xil o‘qiladi. Harflarni xohlagan tartibda joylashtirish mumkin, shuning uchun ular kelgan joylashuv javobni cheklamaydi.",
  statementEn: "You are given a string s of lowercase Latin letters. Determine whether its letters can be rearranged into a palindrome, a string that reads the same forwards and backwards. The letters may be put in any order at all, so the arrangement they arrive in does not constrain the answer.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Agar harflardan palindrom yasash mumkin bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if the letters can be rearranged into a palindrome and NO otherwise, in capital letters.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' only", "at most one letter may occur an odd number of times"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' belgilaridan iborat", "ko‘pi bilan bitta harf toq marta uchrashi mumkin"],
  sampleInputs: ["aabb\n", "abc\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "a ikki marta, b ikki marta uchraydi — toq uchraydigan harf yo‘q. Harflarni abba tarzida joylash mumkin, shuning uchun javob YES.",
    "a, b va c ning har biri bir martadan, ya'ni toq uchraydi — uchta toq harf bor. Faqat bittasi o‘rtaga tusha oladi, shuning uchun javob NO.",
  ],
  sampleNotesEn: [
    "The a occurs twice and the b occurs twice, so no letter has an odd count. The letters can be arranged as abba, so the answer is YES.",
    "Each of a, b and c occurs once, which is three letters with an odd count. Only one of them could sit in the middle, so the answer is NO.",
  ],
  testInputs: ["aabb\n", "abc\n", "a\n", "aab\n", "aabbc\n", "aabbcc\n"],
  sol: `string s;cin>>s;vector<int>cnt(26,0);
for(char c:s)++cnt[c-'a'];
int odd=0;for(int v:cnt)if(v%2)++odd;
cout<<((odd<=1)?"YES":"NO")<<"\\n";`,
  wrongNote: "Demanding that every count be even rejects an odd-length palindrome, which is allowed one letter in the middle; testing whether the string is already a palindrome answers a different question.",
  wrong: [
    `string s;cin>>s;vector<int>cnt(26,0);
for(char c:s)++cnt[c-'a'];
int odd=0;for(int v:cnt)if(v%2)++odd;
cout<<((odd==0)?"YES":"NO")<<"\\n";`,
    `string s;cin>>s;string r=s;reverse(r.begin(),r.end());
cout<<((s==r)?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B396", judge: "sort-wiggle-check", topic: "sorting", rating: 1300,
  tag: "Sequences", timeLimitMs: 1000,
  uz: "Massiv zigzagmi",
  en: "Is the array a zigzag",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. U zigzag tartibda joylashganmi, aniqlang: ya'ni a_1 < a_2 > a_3 < a_4 > … yoki a_1 > a_2 < a_3 > a_4 < … ko‘rinishda bo‘lsin. Solishtirishlar qat'iy, shuning uchun ikkita teng qo‘shni element shartni buzadi. Uzunligi 1 bo‘lgan massiv har doim zigzag hisoblanadi, chunki solishtiradigan juftlik yo‘q.",
  statementEn: "You are given an array of n integers. Determine whether it zigzags: that is, whether a_1 < a_2 > a_3 < a_4 > … or a_1 > a_2 < a_3 > a_4 < … holds. The comparisons are strict, so two equal neighbours break the pattern. An array of length 1 always counts as a zigzag, since there is no pair to compare.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Agar massiv zigzag bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if the array zigzags and NO otherwise, in capital letters.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the comparisons are strict, so equal neighbours break the pattern", "an array of one element answers YES"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "solishtirishlar qat'iy, ya'ni teng qo‘shnilar shartni buzadi", "bitta elementli massiv uchun javob YES"],
  sampleInputs: ["5\n1 5 2 6 3\n", "4\n1 2 2 3\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "1 < 5 > 2 < 6 > 3 — yo‘nalish har qadamda almashadi, shuning uchun javob YES.",
    "Ikkinchi va uchinchi element teng, ya'ni na ko‘tarilish, na pasayish bor. Qat'iy solishtirish talab qilingani uchun javob NO.",
  ],
  sampleNotesEn: [
    "1 < 5 > 2 < 6 > 3 — the direction flips at every step, so the answer is YES.",
    "The second and third elements are equal, so there is neither a rise nor a fall. The comparison is strict, so the answer is NO.",
  ],
  testInputs: ["5\n1 5 2 6 3\n", "4\n1 2 2 3\n", "1\n7\n", "2\n1 2\n", "5\n5 1 6 2 7\n", "4\n1 2 3 4\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n<2){cout<<"YES\\n";return 0;}
bool up=true,down=true;
for(int i=1;i<n;++i){
 bool rise=a[i]>a[i-1],fall=a[i]<a[i-1];
 if(i%2==1){if(!rise)up=false;if(!fall)down=false;}
 else{if(!fall)up=false;if(!rise)down=false;}}
cout<<((up||down)?"YES":"NO")<<"\\n";`,
  wrongNote: "Checking only the pattern that starts by rising rejects a zigzag that starts by falling; a non-strict comparison lets two equal neighbours pass.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n<2){cout<<"YES\\n";return 0;}
bool ok=true;
for(int i=1;i<n;++i){
 if(i%2==1&&!(a[i]>a[i-1]))ok=false;
 if(i%2==0&&!(a[i]<a[i-1]))ok=false;}
cout<<(ok?"YES":"NO")<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n<2){cout<<"YES\\n";return 0;}
bool up=true,down=true;
for(int i=1;i<n;++i){
 bool rise=a[i]>=a[i-1],fall=a[i]<=a[i-1];
 if(i%2==1){if(!rise)up=false;if(!fall)down=false;}
 else{if(!fall)up=false;if(!rise)down=false;}}
cout<<((up||down)?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B397", judge: "array-is-rotated-sorted", topic: "foundations", rating: 1400,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "Massiv aylantirilgan saralangan massivmi",
  en: "Is the array a rotated sorted array",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. U kamaymaydigan tartibda saralangan massivni biror pozitsiyaga aylantirish natijasida hosil bo‘lishi mumkinmi, aniqlang. Aylantirish nolga teng bo‘lishi ham mumkin, ya'ni allaqachon saralangan massiv ham shartni qanoatlantiradi. Takrorlanuvchi qiymatlarga ruxsat beriladi; aylantirish massiv boshidagi blokni oxiriga ko‘chiradi va ikkala qismning ichki tartibini o‘zgartirmaydi.",
  statementEn: "You are given an array of n integers. Determine whether it could have been produced by rotating a non-decreasing sorted array by some amount. A rotation of zero is allowed, so an already sorted array qualifies. Duplicate values are allowed, and a rotation moves a block from the front of the array to its back without changing the order inside either part.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Agar massiv aylantirilgan saralangan massiv bo‘lsa YES, aks holda NO deb bosh harflarda chiqaring.",
  outputEn: "Print YES if the array is a rotated sorted array and NO otherwise, in capital letters.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "a rotation of zero is allowed", "duplicate values are allowed"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "nolga teng aylantirishga ruxsat beriladi", "takrorlanuvchi qiymatlarga ruxsat beriladi"],
  sampleInputs: ["5\n3 4 5 1 2\n", "4\n2 1 3 4\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "1 2 3 4 5 ni ikki pozitsiyaga aylantirsak aynan shu massiv chiqadi. Faqat bitta joyda tushish bor — 5 dan 1 ga — va oxirgi element birinchisidan kichik, ya'ni halqa yopiladi.",
    "Tushish 2 dan 1 ga bo‘ladi, lekin oxirgi element 4 birinchi element 2 dan katta — halqa yopilmaydi. Hech qanday aylantirish bu massivni bermaydi, javob NO.",
  ],
  sampleNotesEn: [
    "Rotating 1 2 3 4 5 by two positions gives exactly this array. There is a single drop — from 5 to 1 — and the last element is below the first, so the wrap closes.",
    "The drop is from 2 to 1, but the last element 4 is above the first element 2, so the wrap does not close. No rotation produces this array, so the answer is NO.",
  ],
  testInputs: ["5\n3 4 5 1 2\n", "4\n2 1 3 4\n", "1\n7\n", "5\n1 2 3 4 5\n", "4\n2 2 2 2\n", "5\n5 1 2 3 4\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int drops=0;
for(int i=1;i<n;++i)if(a[i]<a[i-1])++drops;
if(drops==0){cout<<"YES\\n";return 0;}
cout<<((drops==1&&a[n-1]<=a[0])?"YES":"NO")<<"\\n";`,
  wrongNote: "Counting the drops without checking that the wrap closes accepts an array whose end is larger than its start; sorting a copy and comparing tests whether it is sorted, not whether it is rotated.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int drops=0;
for(int i=1;i<n;++i)if(a[i]<a[i-1])++drops;
cout<<((drops<=1)?"YES":"NO")<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>b=a;sort(b.begin(),b.end());
cout<<((a==b)?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B398", judge: "two-pointers-three-sum-closest", topic: "two-pointers", rating: 1600,
  tag: "Sorting and two pointers", timeLimitMs: 1000,
  uz: "Yig‘indisi t ga eng yaqin uchlik",
  en: "The triple whose sum is closest to t",
  statementUz: "Sizga n ta butun sondan iborat massiv va t qiymati berilgan. Uchta har xil pozitsiyadagi elementni tanlab, ularning yig‘indisi t ga imkon qadar yaqin bo‘lsin. O‘sha yig‘indini chiqaring. Agar ikkita yig‘indi t dan bir xil masofada bo‘lsa, ularning kichigini chiqaring. Uchala pozitsiya har xil bo‘lishi shart, garchi ulardagi qiymatlar teng bo‘lishi mumkin bo‘lsa ham; yig‘indi 64-bitli turni talab qiladi.",
  statementEn: "You are given an array of n integers and a value t. Choose three elements at distinct positions so that their sum is as close to t as possible, and print that sum. If two sums are equally close to t, print the smaller one. The three positions must differ, though the values standing at them may be equal, and the sum needs a 64-bit type.",
  inputUz: "Birinchi qatorda ikkita n va t butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains two integers n and t. The second line contains n integers.",
  outputUz: "Yagona butun sonni chiqaring — t ga eng yaqin uchlik yig‘indisi; teng holatda kichigi tanlanadi.",
  outputEn: "Print a single integer — the triple sum closest to t, breaking a tie in favour of the smaller sum.",
  constraintList: ["3 ≤ n ≤ 2000", "−10^9 ≤ t ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "a sum reaches 3·10^9 and needs a 64-bit type", "the three positions must be distinct"],
  constraintListUz: ["3 ≤ n ≤ 2000", "−10^9 ≤ t ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "yig‘indi 3·10^9 ga yetadi va 64-bitli turni talab qiladi", "uchala pozitsiya har xil bo‘lishi shart"],
  sampleInputs: ["4 1\n-1 2 1 -4\n", "3 100\n1 2 3\n"],
  expect: ["2\n", "6\n"],
  sampleNotesUz: [
    "−1 + 2 + 1 = 2 bo‘lib, 1 dan bir birlik uzoqda. Boshqa uchliklar: −1 + 2 + (−4) = −3, −1 + 1 + (−4) = −4, 2 + 1 + (−4) = −1 — hammasi uzoqroq.",
    "Yagona uchlik 1 + 2 + 3 = 6. U 100 dan ancha uzoq, lekin boshqa tanlov yo‘q, shuning uchun javob 6.",
  ],
  sampleNotesEn: [
    "−1 + 2 + 1 = 2, which is one away from 1. The other triples are −1 + 2 + (−4) = −3, −1 + 1 + (−4) = −4 and 2 + 1 + (−4) = −1, all further off.",
    "The only triple is 1 + 2 + 3 = 6. It is far from 100, but there is no other choice, so the answer is 6.",
  ],
  testInputs: ["4 1\n-1 2 1 -4\n", "3 100\n1 2 3\n", "3 0\n0 0 0\n", "5 10\n1 2 3 4 5\n", "4 0\n-10 0 8 12\n", "6 -7\n-1 -2 -3 -4 -5 -6\n"],
  sol: `long long n,t;cin>>n>>t;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
const long long INF=(long long)4e18;long long best=INF,bd=INF;
for(long long i=0;i+2<n;++i){long long l=i+1,r=n-1;
 while(l<r){long long s=a[i]+a[l]+a[r];long long d=llabs(s-t);
  if(d<bd||(d==bd&&s<best)){bd=d;best=s;}
  if(s<t)++l;else if(s>t)--r;else{l=r;}}}
cout<<best<<"\\n";`,
  wrongNote: "Ignoring the tie rule keeps whichever equally close sum was met first; moving both pointers on every step skips over pairs the sweep was meant to consider.",
  wrong: [
    `long long n,t;cin>>n>>t;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
const long long INF=(long long)4e18;long long best=INF,bd=INF;
for(long long i=0;i+2<n;++i){long long l=i+1,r=n-1;
 while(l<r){long long s=a[i]+a[l]+a[r];long long d=llabs(s-t);
  if(d<bd){bd=d;best=s;}
  if(s<t)++l;else if(s>t)--r;else{l=r;}}}
cout<<best<<"\\n";`,
    `long long n,t;cin>>n>>t;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
const long long INF=(long long)4e18;long long best=INF,bd=INF;
for(long long i=0;i+2<n;++i){long long l=i+1,r=n-1;
 while(l<r){long long s=a[i]+a[l]+a[r];long long d=llabs(s-t);
  if(d<bd||(d==bd&&s<best)){bd=d;best=s;}
  ++l;--r;}}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B399", judge: "bs-median-two-sorted", topic: "binary-search", rating: 1800,
  tag: "Binary search", timeLimitMs: 1000,
  uz: "Ikki saralangan massivning medianasi",
  en: "The median of two sorted arrays",
  statementUz: "Sizga ikkita kamaymaydigan tartibda saralangan massiv berilgan. Ularni birlashtirganda hosil bo‘ladigan massivning medianasini toping. Birlashgan massivdagi elementlar soni toq bo‘lsa, mediana o‘rtadagi element; juft bo‘lsa, ikkita o‘rtadagi elementning kichigi olinadi.",
  statementEn: "You are given two arrays, each sorted in non-decreasing order. Find the median of the array formed by merging them. When the merged length is odd the median is the middle element; when it is even, take the smaller of the two middle elements.",
  inputUz: "Birinchi qatorda ikkita n va m butun soni beriladi. Ikkinchi qatorda kamaymaydigan tartibda n ta butun son, uchinchi qatorda esa m ta butun son keladi.",
  inputEn: "The first line contains two integers n and m. The second line contains n integers in non-decreasing order and the third line contains m integers in non-decreasing order.",
  outputUz: "Yagona butun sonni chiqaring — birlashgan massivning medianasi.",
  outputEn: "Print a single integer — the median of the merged array.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "−10^9 ≤ values ≤ 10^9", "both arrays arrive sorted", "on an even total the smaller of the two middles is required"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "−10^9 ≤ qiymatlar ≤ 10^9", "ikkala massiv ham saralangan holda keladi", "jami juft bo‘lganda ikki o‘rtadan kichigi talab qilinadi"],
  sampleInputs: ["2 2\n1 3\n2 4\n", "1 1\n5\n5\n"],
  expect: ["2\n", "5\n"],
  sampleNotesUz: [
    "Birlashgan massiv 1 2 3 4 bo‘lib, uzunligi juft. O‘rtadagi ikkita element 2 va 3, ularning kichigi 2 — javob shu.",
    "Birlashgan massiv 5 5. Ikkala o‘rta element ham 5, shuning uchun javob 5.",
  ],
  sampleNotesEn: [
    "The merged array is 1 2 3 4, of even length. The two middle elements are 2 and 3, and the smaller is 2, which is the answer.",
    "The merged array is 5 5. Both middle elements are 5, so the answer is 5.",
  ],
  testInputs: ["2 2\n1 3\n2 4\n", "1 1\n5\n5\n", "1 2\n1\n2 3\n", "2 2\n1 3\n5 7\n", "2 3\n-1000000000 1000000000\n-5 0 5\n", "1 5\n100\n1 2 3 4 5\n"],
  sol: `int n,m;cin>>n>>m;vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
vector<long long>c;c.reserve(n+m);
merge(a.begin(),a.end(),b.begin(),b.end(),back_inserter(c));
cout<<c[(c.size()-1)/2]<<"\\n";`,
  wrongNote: "Taking the upper of the two middles contradicts the rule the statement sets; averaging them is the usual definition of a median but not the one asked for here.",
  wrong: [
    `int n,m;cin>>n>>m;vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
vector<long long>c;c.reserve(n+m);
merge(a.begin(),a.end(),b.begin(),b.end(),back_inserter(c));
cout<<c[c.size()/2]<<"\\n";`,
    `int n,m;cin>>n>>m;vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
vector<long long>c;c.reserve(n+m);
merge(a.begin(),a.end(),b.begin(),b.end(),back_inserter(c));
long long k=c.size();
if(k%2)cout<<c[k/2]<<"\\n";
else cout<<((c[k/2-1]+c[k/2])/2)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B400", judge: "geo-point-in-polygon", topic: "geometry", rating: 1800,
  tag: "Ray casting", timeLimitMs: 2000,
  uz: "Nuqta ko‘pburchak ichidami",
  en: "Is the point inside the polygon",
  statementUz: "Sizga n ta uchi kontur bo‘ylab tartib bilan berilgan sodda ko‘pburchak va bitta P nuqtasi berilgan. P ko‘pburchakning qat'iy ichida yotadimi, aniqlang. Chegarada — biror tomon ustida yoki uchida — yotgan nuqta ichkarida hisoblanmaydi va alohida javob talab qiladi.",
  statementEn: "You are given a simple polygon by its n vertices in order around the outline, and a point P. Determine whether P lies strictly inside the polygon. A point on the boundary — on an edge or at a vertex — does not count as inside and gets an answer of its own.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Keyingi n qatorning har birida ko‘pburchak uchining ikkita koordinatasi keladi. Oxirgi qatorda P nuqtasining koordinatalari beriladi.",
  inputEn: "The first line contains one integer n. Each of the next n lines contains the two coordinates of a vertex. The last line contains the coordinates of P.",
  outputUz: "Nuqta qat'iy ichkarida bo‘lsa IN, chegarada bo‘lsa ON, tashqarida bo‘lsa OUT deb chiqaring.",
  outputEn: "Print IN if the point is strictly inside, ON if it lies on the boundary, and OUT if it is outside.",
  constraintList: ["3 ≤ n ≤ 2000", "−10^9 ≤ every coordinate ≤ 10^9", "the polygon is simple, with no self-intersection", "cross products reach 4·10^18 and need a 64-bit type"],
  constraintListUz: ["3 ≤ n ≤ 2000", "−10^9 ≤ har bir koordinata ≤ 10^9", "ko‘pburchak sodda, o‘z-o‘zini kesmaydi", "vektor ko‘paytmalar 4·10^18 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n0 0\n4 0\n4 4\n0 4\n2 2\n", "4\n0 0\n4 0\n4 4\n0 4\n4 2\n"],
  expect: ["IN\n", "ON\n"],
  sampleNotesUz: [
    "(2,2) kvadratning aynan markazida turibdi, ya'ni qat'iy ichkarida: javob IN.",
    "(4,2) o‘ng tomonning ustida yotadi. Chegara ichkarida hisoblanmaydi, shuning uchun javob ON — bu holatni nur usuli o‘zi ajrata olmaydi va alohida tekshiriladi.",
  ],
  sampleNotesEn: [
    "(2,2) sits at the exact centre of the square, so it is strictly inside: IN.",
    "(4,2) lies on the right-hand edge. The boundary does not count as inside, so the answer is ON — a case the ray method cannot separate on its own and which is checked separately.",
  ],
  testInputs: ["4\n0 0\n4 0\n4 4\n0 4\n2 2\n", "4\n0 0\n4 0\n4 4\n0 4\n4 2\n", "4\n0 0\n4 0\n4 4\n0 4\n5 2\n", "3\n0 0\n4 0\n0 4\n1 1\n", "4\n0 0\n4 0\n4 4\n0 4\n0 0\n", "3\n0 0\n4 0\n0 4\n3 3\n"],
  sol: `int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
long long px,py;cin>>px>>py;
for(int i=0;i<n;++i){int j=(i+1)%n;
 long long cr=(x[j]-x[i])*(py-y[i])-(y[j]-y[i])*(px-x[i]);
 if(cr==0&&px>=min(x[i],x[j])&&px<=max(x[i],x[j])
   &&py>=min(y[i],y[j])&&py<=max(y[i],y[j])){cout<<"ON\\n";return 0;}}
bool in=false;
for(int i=0;i<n;++i){int j=(i+1)%n;
 if((y[i]>py)!=(y[j]>py)){
  long double t=(long double)(py-y[i])/(long double)(y[j]-y[i]);
  long double cx=(long double)x[i]+t*(long double)(x[j]-x[i]);
  if((long double)px<cx)in=!in;}}
cout<<(in?"IN":"OUT")<<"\\n";`,
  wrongNote: "Skipping the boundary test reports a point on an edge as inside or outside depending on which way the ray happens to fall; comparing against the bounding box answers whether the point is near the polygon, not in it.",
  wrong: [
    `int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
long long px,py;cin>>px>>py;
bool in=false;
for(int i=0;i<n;++i){int j=(i+1)%n;
 if((y[i]>py)!=(y[j]>py)){
  long double t=(long double)(py-y[i])/(long double)(y[j]-y[i]);
  long double cx=(long double)x[i]+t*(long double)(x[j]-x[i]);
  if((long double)px<cx)in=!in;}}
cout<<(in?"IN":"OUT")<<"\\n";`,
    `int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
long long px,py;cin>>px>>py;
long long x1=*min_element(x.begin(),x.end()),x2=*max_element(x.begin(),x.end());
long long y1=*min_element(y.begin(),y.end()),y2=*max_element(y.begin(),y.end());
if(px==x1||px==x2||py==y1||py==y2){cout<<"ON\\n";return 0;}
cout<<((px>x1&&px<x2&&py>y1&&py<y2)?"IN":"OUT")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C401", judge: "stack-largest-rectangle-hist", topic: "data-structures", rating: 2000,
  tag: "Monotonic stack", timeLimitMs: 2000,
  uz: "Gistogrammadagi eng katta to‘rtburchak",
  en: "The largest rectangle in a histogram",
  statementUz: "Sizga n ta ustundan iborat gistogramma berilgan; i-ustunning balandligi h_i va kengligi 1 ga teng. Gistogramma ichiga to‘liq sig‘adigan eng katta yuzali to‘rtburchakni toping. To‘rtburchak ketma-ket turgan ustunlar ustida yotadi va uning balandligi o‘sha ustunlarning eng pastiga teng bo‘ladi. Balandligi 0 bo‘lgan ustun to‘rtburchak ko‘tara olmaydi va yuza 32-bitli turdan oshib ketadi.",
  statementEn: "You are given a histogram of n bars, the i-th of height h_i and width 1. Find the largest area of a rectangle that fits entirely inside it. A rectangle spans a run of consecutive bars and its height is the shortest bar in that run. A bar of height 0 can carry no rectangle, and the area runs beyond a 32-bit type.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta manfiy bo‘lmagan butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n non-negative integers.",
  outputUz: "Yagona butun sonni chiqaring — eng katta to‘rtburchakning yuzasi.",
  outputEn: "Print a single integer — the area of the largest rectangle.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ h_i ≤ 10^9", "the answer reaches 10^14 and needs a 64-bit type", "a bar of height 0 contributes no rectangle"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ h_i ≤ 10^9", "javob 10^14 ga yetadi va 64-bitli turni talab qiladi", "balandligi 0 bo‘lgan ustun to‘rtburchak bermaydi"],
  sampleInputs: ["6\n2 1 5 6 2 3\n", "1\n0\n"],
  expect: ["10\n", "0\n"],
  sampleNotesUz: [
    "Eng katta to‘rtburchak 5 va 6 balandlikdagi ikki ustun ustida yotadi: balandligi 5, kengligi 2, yuzasi 10. Butun gistogramma bo‘ylab cho‘zilgan to‘rtburchakning balandligi 1 bo‘lardi va yuzasi 6 — kichikroq.",
    "Yagona ustunning balandligi 0, ya'ni hech qanday yuzali to‘rtburchak sig‘maydi. Javob 0.",
  ],
  sampleNotesEn: [
    "The largest rectangle sits on the bars of height 5 and 6: height 5, width 2, area 10. A rectangle spanning the whole histogram would have height 1 and area 6, which is smaller.",
    "The only bar has height 0, so no rectangle of positive area fits. The answer is 0.",
  ],
  testInputs: ["6\n2 1 5 6 2 3\n", "1\n0\n", "1\n7\n", "5\n5 5 5 5 5\n", "5\n1 2 3 4 5\n", "4\n1000000000 1000000000 1000000000 1000000000\n"],
  sol: `int n;cin>>n;vector<long long>h(n);for(auto&x:h)cin>>x;
vector<int>st;long long best=0;
for(int i=0;i<=n;++i){
 long long cur=(i==n)?-1:h[i];
 while(!st.empty()&&h[st.back()]>=cur){
  long long ht=h[st.back()];st.pop_back();
  long long left=st.empty()?-1:st.back();
  best=max(best,ht*(long long)(i-left-1));}
 st.push_back(i);}
cout<<best<<"\\n";`,
  wrongNote: "The tallest single bar is only the widest rectangle when every run of bars is worse; the shortest bar times the whole width considers just the one rectangle that spans everything.",
  wrong: [
    `int n;cin>>n;vector<long long>h(n);for(auto&x:h)cin>>x;
long long best=0;
for(int i=0;i<n;++i)best=max(best,h[i]);
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>h(n);for(auto&x:h)cin>>x;
long long mn=*min_element(h.begin(),h.end());
cout<<(mn*(long long)n)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C402", judge: "bt-count-graph-colorings", topic: "backtracking", rating: 2000,
  tag: "Backtracking", timeLimitMs: 2000,
  uz: "Grafni k rangga bo‘yash usullari",
  en: "Ways to colour a graph with k colours",
  statementUz: "Sizga n ta uchi va m ta qirrasi bo‘lgan yo‘naltirilmagan graf hamda k ranglar soni berilgan. Har bir uchga bittadan rang berib, qirra bilan bog‘langan ikki uch har xil rangda bo‘ladigan bo‘yashlar nechtaligini sanang. Ranglar bir-biridan farqlanadi, ya'ni bir xil bo‘linishning ranglari almashtirilgan varianti alohida bo‘yash hisoblanadi.",
  statementEn: "You are given an undirected graph with n vertices and m edges, and a number of colours k. Count the colourings that give each vertex one colour so that the two ends of every edge differ. The colours are distinguishable, so the same partition with the colours swapped is a different colouring.",
  inputUz: "Birinchi qatorda uchta n, m va k butun soni beriladi. Keyingi m qatorning har birida a va b uchlarini bog‘lovchi qirra keladi.",
  inputEn: "The first line contains three integers n, m and k. Each of the next m lines contains an edge a b.",
  outputUz: "Yagona butun sonni chiqaring — mos bo‘yashlar soni. Bunday bo‘yash bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of valid colourings. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 12", "0 ≤ m ≤ n(n−1)/2", "1 ≤ k ≤ 10", "1 ≤ a, b ≤ n and a ≠ b", "the answer reaches 10^12 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 12", "0 ≤ m ≤ n(n−1)/2", "1 ≤ k ≤ 10", "1 ≤ a, b ≤ n va a ≠ b", "javob 10^12 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["3 3 3\n1 2\n2 3\n1 3\n", "2 1 1\n1 2\n"],
  expect: ["6\n", "0\n"],
  sampleNotesUz: [
    "Uchburchakda uchala uch ham bir-biridan farq qilishi kerak, ya'ni uchta rangni uchta uchga joylashtirish kerak: 3! = 6 usul.",
    "Yagona rang bilan qirra bilan bog‘langan ikki uchni bo‘yab bo‘lmaydi, chunki ular albatta bir xil rangda chiqadi. Shuning uchun javob 0.",
  ],
  sampleNotesEn: [
    "In a triangle all three vertices must differ, so the three colours have to be spread across the three vertices: 3! = 6 ways.",
    "With a single colour the two ends of an edge cannot differ, so no colouring works and the answer is 0.",
  ],
  testInputs: ["3 3 3\n1 2\n2 3\n1 3\n", "2 1 1\n1 2\n", "1 0 5\n", "3 0 2\n", "4 4 2\n1 2\n2 3\n3 4\n4 1\n", "3 2 3\n1 2\n2 3\n"],
  sol: `int n,m,k;cin>>n>>m>>k;
vector<int>adj(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;adj[a]|=1<<b;adj[b]|=1<<a;}
vector<int>col(n,-1);long long total=0;
function<void(int)>go=[&](int v){
 if(v==n){++total;return;}
 for(int c=0;c<k;++c){
  bool ok=true;
  for(int u=0;u<v;++u)if((adj[v]>>u&1)&&col[u]==c){ok=false;break;}
  if(!ok)continue;
  col[v]=c;go(v+1);col[v]=-1;}};
go(0);
cout<<total<<"\\n";`,
  wrongNote: "Checking only the vertex coloured immediately before misses a clash with anything earlier; dividing by the number of colour orderings treats two colourings that differ only by a swap as one, which the statement says are different.",
  wrong: [
    `int n,m,k;cin>>n>>m>>k;
vector<int>adj(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;adj[a]|=1<<b;adj[b]|=1<<a;}
vector<int>col(n,-1);long long total=0;
function<void(int)>go=[&](int v){
 if(v==n){++total;return;}
 for(int c=0;c<k;++c){
  if(v>0&&(adj[v]>>(v-1)&1)&&col[v-1]==c)continue;
  col[v]=c;go(v+1);col[v]=-1;}};
go(0);
cout<<total<<"\\n";`,
    `int n,m,k;cin>>n>>m>>k;
vector<int>adj(n,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;--a;--b;adj[a]|=1<<b;adj[b]|=1<<a;}
vector<int>col(n,-1);long long total=0;
function<void(int)>go=[&](int v){
 if(v==n){++total;return;}
 for(int c=0;c<k;++c){
  bool ok=true;
  for(int u=0;u<v;++u)if((adj[v]>>u&1)&&col[u]==c){ok=false;break;}
  if(!ok)continue;
  col[v]=c;go(v+1);col[v]=-1;}};
go(0);
long long f=1;for(int i=2;i<=k;++i)f*=i;
cout<<(total/f)<<"\\n";`,
  ],
});

export default P;
