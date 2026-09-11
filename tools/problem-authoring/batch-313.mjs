/* Batch 313 — ten problems in the middle of the ladder, B313–B322.
 *
 * Sorting, two pointers, greedy, prefix sums, stacks and a first taste of DP.
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B313", judge: "sort-largest-gap", topic: "sorting", rating: 1200,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Eng katta bo‘shliq",
  en: "The largest gap",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Sonlarni o‘sish tartibida joylashtirgandan keyin qo‘shni ikki son orasidagi eng katta farqni toping. Boshqacha aytganda, saralangan ketma-ketlikda b_1 ≤ b_2 ≤ … ≤ b_n bo‘lsa, b_{i+1} − b_i ayirmalarining eng kattasi kerak. Massivda ikkitadan kam element bo‘lmaydi, shuning uchun kamida bitta qo‘shni juftlik har doim mavjud.",
  statementEn: "You are given an array of n integers. After arranging the numbers in increasing order, find the largest difference between two neighbouring ones. In other words, if the sorted sequence is b_1 ≤ b_2 ≤ … ≤ b_n, the answer is the largest of the differences b_{i+1} − b_i. The array never has fewer than two elements, so at least one neighbouring pair always exists.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi; ular ixtiyoriy tartibda berilgan.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces, given in arbitrary order.",
  outputUz: "Yagona butun sonni chiqaring — saralangandan keyingi qo‘shni elementlar orasidagi eng katta ayirma.",
  outputEn: "Print a single integer — the largest difference between neighbouring elements after sorting.",
  constraintList: ["2 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the answer can reach 2·10^9 and needs a 64-bit type"],
  constraintListUz: ["2 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "javob 2·10^9 ga yetishi mumkin va 64-bitli turni talab qiladi"],
  sampleInputs: ["5\n1 9 3 4 12\n", "2\n5 5\n"],
  expect: ["5\n", "0\n"],
  sampleNotesUz: [
    "Saralangan massiv 1 3 4 9 12, qo‘shnilar orasidagi ayirmalar esa 2, 1, 5 va 3. Eng kattasi — 4 bilan 9 orasidagi 5. Saralashsiz, berilgan tartibdagi qo‘shnilar bo‘yicha hisoblash butunlay boshqa son berardi: aynan saralash bir-biriga eng yaqin qiymatlarni yonma-yon keltiradi.",
    "Ikkita teng son orasidagi ayirma 0, ya'ni javob 0. Bu mumkin bo‘lgan eng kichik javob va u massivda takrorlanuvchi qiymatlar borligini bildiradi.",
  ],
  sampleNotesEn: [
    "Sorted the array is 1 3 4 9 12, and the neighbouring differences are 2, 1, 5 and 3. The largest is 5, between 4 and 9. Measuring neighbours in the given order would give something else entirely: sorting is what puts the closest values side by side.",
    "The difference between two equal numbers is 0, so the answer is 0. That is the smallest answer possible and it means the array holds a repeated value.",
  ],
  testInputs: ["5\n1 9 3 4 12\n", "2\n5 5\n", "3\n-1000000000 0 1000000000\n", "4\n1 2 3 4\n", "2\n-1000000000 1000000000\n", "6\n5 5 5 5 5 100\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long best=0;for(int i=0;i+1<n;++i)best=max(best,a[i+1]-a[i]);cout<<best<<"\\n";`,
  wrongNote: "Skipping the sort measures neighbours that were never neighbours; taking max minus min measures the whole span instead of a gap.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=0;for(int i=0;i+1<n;++i)best=max(best,a[i+1]-a[i]);cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
cout<<a[n-1]-a[0]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B314", judge: "count-pairs-divisible-k", topic: "math", rating: 1200,
  tag: "Remainders", timeLimitMs: 1000,
  uz: "Yig‘indisi k ga bo‘linadigan juftliklar",
  en: "Pairs whose sum divides by k",
  statementUz: "Sizga n ta musbat butun sondan iborat massiv va k soni berilgan. Yig‘indisi k ga qoldiqsiz bo‘linadigan (i, j) pozitsiyalar juftliklarini sanang, bunda i < j. Juftliklar pozitsiya bo‘yicha sanaladi, ya'ni har xil o‘rinlarda turgan teng qiymatlar alohida juftliklar hosil qiladi. n 10^5 gacha borgani uchun barcha juftliklarni ko‘rib chiqish imkonsiz — qoldiqlar bo‘yicha guruhlash kerak.",
  statementEn: "You are given an array of n positive integers and a number k. Count the pairs of positions (i, j) with i < j whose sum is divisible by k without a remainder. Pairs are counted by position, so equal values at different positions form separate pairs. Since n goes up to 10^5, examining every pair is impossible — the values have to be grouped by their remainder.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta musbat butun son keladi.",
  inputEn: "The first line contains two integers n and k. The second line contains n positive integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi k ga bo‘linadigan juftliklar soni. Bunday juftlik bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of pairs whose sum is divisible by k. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 100", "1 ≤ a_i ≤ 10^9", "the answer can reach about 5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 100", "1 ≤ a_i ≤ 10^9", "javob taxminan 5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["5 3\n1 2 3 4 5\n", "3 7\n1 1 1\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Qoldiqlar 1, 2, 0, 1, 2. Yig‘indisi 3 ga bo‘linishi uchun qoldiqlar 0 bilan 0 yoki 1 bilan 2 bo‘lishi kerak. Qoldiq 1 li ikkita son (1 va 4) qoldiq 2 li ikkita son (2 va 5) bilan 2 · 2 = 4 ta juftlik beradi; qoldiq 0 li yagona son (3) o‘ziga juft topa olmaydi. Jami 4.",
    "Barcha sonlarning 7 ga bo‘lgan qoldig‘i 1, ikkita bunday sonning yig‘indisi esa 2 qoldiq beradi — hech qachon 0 emas. Shuning uchun mos juftlik yo‘q va javob 0.",
  ],
  sampleNotesEn: [
    "The remainders are 1, 2, 0, 1, 2. For a sum to divide by 3 the remainders must be 0 with 0, or 1 with 2. The two numbers with remainder 1 (1 and 4) pair with the two with remainder 2 (2 and 5) for 2 · 2 = 4 pairs; the single number with remainder 0 (3) finds no partner. Four in total.",
    "Every number leaves remainder 1 modulo 7, and two such numbers sum to remainder 2 — never 0. So no pair qualifies and the answer is 0.",
  ],
  testInputs: ["5 3\n1 2 3 4 5\n", "3 7\n1 1 1\n", "4 1\n1 2 3 4\n", "6 2\n2 4 6 1 3 5\n", "1 5\n5\n", "5 5\n5 10 15 20 25\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>cnt(k,0);
for(long long i=0;i<n;++i){long long x;cin>>x;++cnt[x%k];}
long long ans=cnt[0]*(cnt[0]-1)/2;
for(long long r=1;r*2<k;++r)ans+=cnt[r]*cnt[k-r];
if(k%2==0)ans+=cnt[k/2]*(cnt[k/2]-1)/2;
cout<<ans<<"\\n";`,
  wrongNote: "Letting the loop run past the midpoint counts every mixed pair twice; forgetting the self-paired buckets loses the rest.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>cnt(k,0);
for(long long i=0;i<n;++i){long long x;cin>>x;++cnt[x%k];}
long long ans=cnt[0]*(cnt[0]-1)/2;
for(long long r=1;r<k;++r)ans+=cnt[r]*cnt[k-r];
cout<<ans<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>cnt(k,0);
for(long long i=0;i<n;++i){long long x;cin>>x;++cnt[x%k];}
long long ans=0;
for(long long r=1;r*2<k;++r)ans+=cnt[r]*cnt[k-r];
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B315", judge: "dp-min-cost-stairs", topic: "dynamic-programming", rating: 1300,
  tag: "DP", timeLimitMs: 1000,
  uz: "Zinapoyaning eng arzon yo‘li",
  en: "Cheapest way up the stairs",
  statementUz: "Zinapoyaning n ta pog‘onasi bor va i-pog‘onaga qadam qo‘yish c_i turadi. Siz yerdan boshlaysiz va har safar bir yoki ikki pog‘ona ko‘tarilishingiz mumkin. Boshlanishda 1- yoki 2-pog‘onaga bepul o‘tib olasiz, ya'ni birinchi qadam uchun narx to‘lanmaydi — faqat oyoq qo‘ygan pog‘onalaringiz uchun to‘laysiz. Zinapoyaning tepasiga, ya'ni n-pog‘onadan yuqoriga chiqish uchun kerak bo‘ladigan eng kichik umumiy narxni toping.",
  statementEn: "A staircase has n steps and stepping on step i costs c_i. You start on the ground and may climb one or two steps at a time. At the start you may move onto either step 1 or step 2 for free, meaning no cost is paid for arriving — you pay only for the steps you actually stand on. Find the smallest total cost of getting past the top, that is beyond step n.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta manfiy bo‘lmagan butun son c_1, …, c_n keladi.",
  inputEn: "The first line contains one integer n. The second line contains n non-negative integers c_1, …, c_n separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — tepaga chiqishning eng kichik umumiy narxi.",
  outputEn: "Print a single integer — the smallest total cost of reaching the top.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ c_i ≤ 10^4", "the total can reach 10^9 and fits in a 64-bit type comfortably"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ c_i ≤ 10^4", "umumiy narx 10^9 ga yetishi mumkin va 64-bitli turga bemalol sig‘adi"],
  sampleInputs: ["5\n10 15 20 5 5\n", "1\n7\n"],
  expect: ["20\n", "0\n"],
  sampleNotesUz: [
    "Eng arzon yo‘l 2-pog‘ona (15) va 4-pog‘onadan (5) o‘tadi, so‘ng ikki pog‘ona sakrab tepaga chiqadi: jami 20. Muqobillar qimmatroq — 1 → 3 → 5 yo‘li 10 + 20 + 5 = 35, 1 → 3 dan keyin sakrash esa 30. Har bir pog‘ona uchun \"bu yerga qayerdan kelgan ma'qul\" degan savolga javob beriladi, shuning uchun jadval chapdan o‘ngga to‘ldiriladi.",
    "Bitta pog‘ona bor va uning ustidan sakrab o‘tish mumkin: yerdan ikki pog‘ona ko‘tarilish sizni darhol tepaga olib chiqadi, shuning uchun hech narsa to‘lanmaydi va javob 0.",
  ],
  sampleNotesEn: [
    "The cheapest route stands on step 2 (15) and step 4 (5), then jumps two to clear the top: 20 in total. The alternatives cost more — 1 → 3 → 5 is 10 + 20 + 5 = 35, and 1 → 3 followed by a jump is 30. Each step answers \"which of the two ways in was cheaper\", so the table fills left to right.",
    "There is one step and it can be jumped over entirely: climbing two from the ground puts you past the top at once, so nothing is paid and the answer is 0.",
  ],
  testInputs: ["5\n10 15 20 5 5\n", "1\n7\n", "2\n1 100\n", "3\n0 0 0\n", "6\n1 100 1 100 1 100\n", "4\n10 10 10 10\n"],
  sol: `int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
vector<long long>d(n+1,0);
for(int i=2;i<=n;++i)d[i]=min(d[i-1]+c[i-1],d[i-2]+c[i-2]);
cout<<d[n]<<"\\n";`,
  wrongNote: "Charging for the step you leave from at the very end, and a table that starts one index late.",
  wrong: [
    `int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
vector<long long>d(n+1,0);
for(int i=2;i<=n;++i)d[i]=min(d[i-1]+c[i-1],d[i-2]+c[i-2]);
cout<<d[n]+c[n-1]<<"\\n";`,
    `int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
vector<long long>d(n+1,0);
for(int i=1;i<=n;++i)d[i]=d[i-1]+c[i-1];
cout<<d[n]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B316", judge: "longest-alternating-parity", topic: "two-pointers", rating: 1300,
  tag: "Scanning", timeLimitMs: 1000,
  uz: "Juft-toq almashinuvchi eng uzun bo‘lak",
  en: "Longest run of alternating parity",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Har bir qo‘shni juftligi juft-toqligi bo‘yicha farq qiladigan eng uzun uzluksiz bo‘lakning uzunligini toping. Ya'ni bo‘lak ichida juft sondan keyin toq, toqdan keyin juft kelishi kerak. Bitta elementdan iborat bo‘lak ham shartni qanoatlantiradi, chunki unda solishtiriladigan qo‘shni juftlik yo‘q, shuning uchun javob har doim kamida 1 ga teng.",
  statementEn: "You are given an array of n integers. Find the length of the longest contiguous block in which every neighbouring pair differs in parity — that is, an even number is always followed by an odd one and an odd number by an even one. A block of a single element satisfies the condition vacuously, since it has no neighbouring pair to compare, so the answer is always at least 1.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — juft-toqligi almashinib turadigan eng uzun uzluksiz bo‘lak uzunligi.",
  outputEn: "Print a single integer — the length of the longest contiguous block of alternating parity.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the answer is between 1 and n inclusive"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "javob 1 dan n gacha bo‘lgan oraliqda yotadi"],
  sampleInputs: ["6\n1 2 3 5 6 7\n", "3\n2 4 6\n"],
  expect: ["3\n", "1\n"],
  sampleNotesUz: [
    "1 2 3 bo‘lagida toq-juft-toq almashinadi, so‘ng 5 keladi: 3 va 5 ikkalasi ham toq, shuning uchun zanjir uziladi. Yangi zanjir 5 6 7 bo‘lib, uning uzunligi ham 3. Ikkalasidan uzunrog‘i yo‘q, demak javob 3. Uzilgan joyda hisoblagichni 0 ga emas, 1 ga tushirish kerak — uzilishni keltirib chiqargan element yangi zanjirning birinchi a'zosi bo‘ladi.",
    "Barcha sonlar juft, shuning uchun hech qaysi qo‘shni juftlik shartni qanoatlantirmaydi va eng uzun bo‘lak bitta elementdan iborat bo‘lib qoladi.",
  ],
  sampleNotesEn: [
    "In 1 2 3 the parity alternates, then 5 arrives and both 3 and 5 are odd, breaking the chain. A new chain runs 5 6 7, also of length 3, and nothing longer exists — so the answer is 3. At a break the counter resets to 1 rather than 0: the element that broke the chain is the first member of the next one.",
    "Every number is even, so no neighbouring pair alternates and the longest block is a single element.",
  ],
  testInputs: ["6\n1 2 3 5 6 7\n", "3\n2 4 6\n", "1\n5\n", "5\n1 2 1 2 1\n", "4\n-1 -2 -3 -4\n", "7\n2 2 1 2 1 1 2\n", "3\n1 -1 1\n", "4\n-3 3 -3 3\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=1,cur=1;
for(int i=1;i<n;++i){if(((a[i]%2)!=0)!=((a[i-1]%2)!=0))++cur;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`,
  wrongNote: "Counting the breaks rather than the run, and a parity test that misreads negative numbers.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=0,cur=0;
for(int i=1;i<n;++i){if(((a[i]%2)!=0)!=((a[i-1]%2)!=0))++cur;else cur=0;best=max(best,cur);}
cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=1,cur=1;
for(int i=1;i<n;++i){if(a[i]%2!=a[i-1]%2)++cur;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B317", judge: "min-ops-equalise", topic: "greedy", rating: 1400,
  tag: "Median", timeLimitMs: 1000,
  uz: "Barchasini tenglashtirish narxi",
  en: "Making every value equal",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Bitta amalda istalgan elementni bittaga oshirish yoki bittaga kamaytirish mumkin. Barcha elementlarni bir xil qiymatga keltirish uchun kerak bo‘ladigan eng kam amallar sonini toping. Yakuniy qiymat qanday bo‘lishini o‘zingiz tanlaysiz va u massivda uchrashi shart emas.",
  statementEn: "You are given an array of n integers. One operation increases or decreases any single element by one. Find the smallest number of operations needed to make every element equal. You choose what the final common value is, and it does not have to be a value already present in the array.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — barcha elementlarni tenglashtirish uchun kerak bo‘ladigan eng kam amallar soni.",
  outputEn: "Print a single integer — the smallest number of operations that makes every element equal.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the answer can reach 10^14 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "javob 10^14 ga yetishi mumkin va 64-bitli turni talab qiladi"],
  sampleInputs: ["4\n1 2 3 10\n", "3\n5 5 5\n"],
  expect: ["10\n", "0\n"],
  sampleNotesUz: [
    "Medianaga — bu yerda 2 yoki 3 ga — keltirish eng arzon. 3 ni tanlasak: |1−3| + |2−3| + |3−3| + |10−3| = 2 + 1 + 0 + 7 = 10. O‘rta arifmetik 4 ni tanlash 3 + 2 + 1 + 6 = 12 berardi, ya'ni yomonroq: mutlaq ayirmalar yig‘indisini kamaytiradigan nuqta o‘rtacha emas, mediana.",
    "Barcha qiymatlar allaqachon teng, shuning uchun birorta amal kerak emas va javob 0.",
  ],
  sampleNotesEn: [
    "Moving everything to the median — here 2 or 3 — is cheapest. Choosing 3 gives |1−3| + |2−3| + |3−3| + |10−3| = 2 + 1 + 0 + 7 = 10. Choosing the mean, 4, would give 3 + 2 + 1 + 6 = 12, which is worse: the point that minimises a sum of absolute differences is the median, not the average.",
    "Every value is already equal, so no operation is needed and the answer is 0.",
  ],
  testInputs: ["4\n1 2 3 10\n", "3\n5 5 5\n", "1\n7\n", "2\n-1000000000 1000000000\n", "5\n1 1 1 1 100\n", "6\n1 2 3 4 5 6\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long m=a[n/2],s=0;for(long long x:a)s+=llabs(x-m);cout<<s<<"\\n";`,
  wrongNote: "Aiming at the mean rather than the median, and aiming at the midpoint of the range.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long t=0;for(long long x:a)t+=x;long long m=t/n,s=0;
for(long long x:a)s+=llabs(x-m);cout<<s<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long m=(a[0]+a[n-1])/2,s=0;for(long long x:a)s+=llabs(x-m);cout<<s<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B318", judge: "count-subarrays-odd-sum", topic: "data-structures", rating: 1400,
  tag: "Prefix sums", timeLimitMs: 1000,
  uz: "Yig‘indisi toq bo‘lgan qism massivlar",
  en: "Subarrays with an odd sum",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Elementlari yig‘indisi toq bo‘lgan uzluksiz qism massivlarni sanang. Qism massiv chetlari bilan aniqlanadi, ya'ni bir xil qiymatlarni saqlaydigan ikki har xil oraliq alohida sanaladi. n 10^5 gacha borgani uchun barcha oraliqlarni ko‘rib chiqish imkonsiz — prefiks yig‘indilarning juft-toqligidan foydalanish kerak.",
  statementEn: "You are given an array of n integers. Count the contiguous subarrays whose elements sum to an odd number. A subarray is identified by its endpoints, so two different ranges holding the same values are counted separately. Since n goes up to 10^5, examining every range is impossible — the parity of the prefix sums is what makes it quick.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — yig‘indisi toq bo‘lgan uzluksiz qism massivlar soni. Bunday qism massiv bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of contiguous subarrays with an odd sum. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the answer can reach about 2.5·10^9 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "javob taxminan 2,5·10^9 ga yetadi va 64-bitli turni talab qiladi"],
  sampleInputs: ["3\n1 2 3\n", "3\n2 4 6\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Oraliqlar va ularning yig‘indilari: [1]=1, [2]=2, [3]=3, [1,2]=3, [2,3]=5, [1,2,3]=6. Toqlari to‘rtta: 1, 3, 3 va 5. Buni sanamasdan topish uchun prefiks yig‘indilarning juft-toqligini kuzatish kifoya: toq yig‘indili oraliq — bu chetlarining juft-toqligi har xil bo‘lgan ikkita prefiks.",
    "Barcha elementlar juft, shuning uchun har qanday oraliqning yig‘indisi ham juft bo‘ladi va toq yig‘indili qism massiv umuman yo‘q.",
  ],
  sampleNotesEn: [
    "The ranges and their sums are [1]=1, [2]=2, [3]=3, [1,2]=3, [2,3]=5 and [1,2,3]=6. Four are odd: 1, 3, 3 and 5. To find that without enumerating, track the parity of the prefix sums: a range is odd exactly when its two endpoints have different parity.",
    "Every element is even, so every range sums to an even number and no subarray qualifies.",
  ],
  testInputs: ["3\n1 2 3\n", "3\n2 4 6\n", "1\n1\n", "1\n2\n", "5\n1 1 1 1 1\n", "4\n-1 -2 -3 -4\n"],
  sol: `int n;cin>>n;long long even=1,odd=0,p=0,ans=0,x;
for(int i=0;i<n;++i){cin>>x;p+=x;if(((p%2)+2)%2==1){ans+=even;++odd;}else{ans+=odd;++even;}}
cout<<ans<<"\\n";`,
  wrongNote: "A parity test that misreads a negative prefix, and starting the even bucket empty so every prefix loses its partner.",
  wrong: [
    `int n;cin>>n;long long even=1,odd=0,p=0,ans=0,x;
for(int i=0;i<n;++i){cin>>x;p+=x;if(p%2==1){ans+=even;++odd;}else{ans+=odd;++even;}}
cout<<ans<<"\\n";`,
    `int n;cin>>n;long long even=0,odd=0,p=0,ans=0,x;
for(int i=0;i<n;++i){cin>>x;p+=x;if(((p%2)+2)%2==1){ans+=even;++odd;}else{ans+=odd;++even;}}
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B319", judge: "greedy-max-units-boxes", topic: "greedy", rating: 1500,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Yuk mashinasiga eng ko‘p buyum",
  en: "Filling the truck",
  statementUz: "Sizda n xil quti bor: i-turdan c_i dona quti mavjud va har bir shunday qutida u_i dona buyum bor. Yuk mashinasiga ko‘pi bilan k dona quti sig‘adi va qaysi qutilarni olishni o‘zingiz tanlaysiz. Qutini qisman olib bo‘lmaydi — u yo butunlay olinadi, yo umuman olinmaydi. Mashinaga ortish mumkin bo‘lgan buyumlarning eng ko‘p sonini toping.",
  statementEn: "You have n kinds of box: there are c_i boxes of kind i and each of them holds u_i units. The truck fits at most k boxes and you choose which ones to load. A box cannot be taken partially — it goes in whole or not at all. Find the largest number of units that can be loaded onto the truck.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Keyingi n qatorning har birida ikkita c_i va u_i butun soni keladi: shu turdagi qutilar soni va bittasidagi buyumlar soni.",
  inputEn: "The first line contains two integers n and k. Each of the next n lines contains two integers c_i and u_i: how many boxes of that kind there are and how many units each holds.",
  outputUz: "Yagona butun sonni chiqaring — ortish mumkin bo‘lgan buyumlarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of units that can be loaded.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^9", "1 ≤ c_i ≤ 10^4", "1 ≤ u_i ≤ 10^4", "the answer can reach 10^13 and needs a 64-bit type"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ k ≤ 10^9", "1 ≤ c_i ≤ 10^4", "1 ≤ u_i ≤ 10^4", "javob 10^13 ga yetishi mumkin va 64-bitli turni talab qiladi"],
  sampleInputs: ["3 4\n1 3\n2 2\n3 1\n", "2 10\n1 5\n1 5\n"],
  expect: ["8\n", "10\n"],
  sampleNotesUz: [
    "Bittasida eng ko‘p buyum bor qutilardan boshlaymiz: bitta 3 lik quti (3), keyin ikkita 2 lik quti (4), jami uchta quti va 7 buyum. To‘rtinchi joyga 1 lik qutilardan bittasi tushadi, natijada 8. Qutilarni buyumlar soni bo‘yicha kamayish tartibida olish optimal, chunki har bir joy bir xil turadi.",
    "Mashinaga 10 ta quti sig‘adi, lekin jami atigi 2 ta quti bor, shuning uchun hammasini olamiz: 5 + 5 = 10. Bo‘sh joy qolishi javobga ta'sir qilmaydi.",
  ],
  sampleNotesEn: [
    "Start with the boxes holding the most: one box of 3 (3 units), then two boxes of 2 (4 units), which is three boxes and 7 units. The fourth slot takes a box of 1, giving 8. Taking boxes in decreasing order of units is optimal because every slot costs the same.",
    "The truck fits 10 boxes but only 2 exist, so all of them go in: 5 + 5 = 10. Leaving space unused does not change the answer.",
  ],
  testInputs: ["3 4\n1 3\n2 2\n3 1\n", "2 10\n1 5\n1 5\n", "1 1\n1 10000\n", "3 1\n5 1\n5 2\n5 3\n", "2 3\n10000 1\n1 10000\n", "4 6\n2 4\n2 4\n2 4\n2 4\n"],
  sol: `long long n,k;cin>>n>>k;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.second>>p.first;
sort(v.rbegin(),v.rend());
long long ans=0;
for(auto&p:v){long long take=min(k,p.second);ans+=take*p.first;k-=take;if(k==0)break;}
cout<<ans<<"\\n";`,
  wrongNote: "Sorting by how many boxes there are rather than by what they hold, and taking a whole kind even when it overflows the truck.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.first>>p.second;
sort(v.rbegin(),v.rend());
long long ans=0;
for(auto&p:v){long long take=min(k,p.first);ans+=take*p.second;k-=take;if(k==0)break;}
cout<<ans<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.second>>p.first;
sort(v.rbegin(),v.rend());
long long ans=0;
for(auto&p:v){if(k<=0)break;ans+=p.second*p.first;k-=p.second;}
cout<<ans<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B320", judge: "bs-min-days-bouquets", topic: "binary-search", rating: 1500,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Guldastalar uchun eng kam kun",
  en: "Days until the bouquets are ready",
  statementUz: "Bog‘da n ta gul bir qatorda o‘sadi va i-guli b_i kuni ochiladi. Bitta guldasta uchun yonma-yon turgan, allaqachon ochilgan aynan k ta gul kerak. Sizga m ta guldasta yig‘ish kerak va bitta gul faqat bitta guldastada ishlatiladi. Barcha guldastalarni yig‘ish mumkin bo‘ladigan eng erta kunni toping.",
  statementEn: "A garden has n flowers in a row, and flower i opens on day b_i. One bouquet needs exactly k adjacent flowers that have already opened. You must gather m bouquets, and each flower can be used in at most one bouquet. Find the earliest day on which all the bouquets can be gathered.",
  inputUz: "Birinchi qatorda uchta n, m va k butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son b_1, …, b_n keladi.",
  inputEn: "The first line contains three integers n, m and k. The second line contains n integers b_1, …, b_n separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — barcha guldastalarni yig‘ish mumkin bo‘lgan eng erta kun. Agar guldastalarni hech qachon yig‘ib bo‘lmasa, -1 chiqaring.",
  outputEn: "Print a single integer — the earliest day on which every bouquet can be gathered. If the bouquets can never be gathered, print -1 instead.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "1 ≤ k ≤ n", "1 ≤ b_i ≤ 10^9", "it is impossible exactly when m · k > n"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ m ≤ 10^5", "1 ≤ k ≤ n", "1 ≤ b_i ≤ 10^9", "aynan m · k > n bo‘lganda imkonsiz bo‘ladi"],
  sampleInputs: ["5 2 2\n1 10 3 10 2\n", "5 3 2\n1 1 1 1 1\n"],
  expect: ["10\n", "-1\n"],
  sampleNotesUz: [
    "3-kuni 1-, 3- va 5-gullar ochilgan, lekin ular yonma-yon emas, shuning uchun bitta ham guldasta chiqmaydi. 10-kuni hamma gul ochiladi va 1–2 hamda 3–4 juftliklaridan ikkita guldasta yig‘iladi. Kun qanchalik kech bo‘lsa, shuncha ko‘p gul ochiq bo‘ladi — javob shu monotonlik ustida ikkilik qidiruv bilan topiladi.",
    "Ikkitadan gulli uchta guldasta uchun 6 ta gul kerak, bog‘da esa atigi 5 ta bor. Qancha kutilmasin bu o‘zgarmaydi, shuning uchun javob -1.",
  ],
  sampleNotesEn: [
    "On day 3 flowers 1, 3 and 5 are open, but they are not adjacent, so not a single bouquet can be made. On day 10 every flower is open and two bouquets come from the pairs 1–2 and 3–4. The later the day the more flowers are open, and the answer is found by binary search over that monotonicity.",
    "Three bouquets of two flowers need 6 flowers and the garden has only 5. Waiting does not change that, so the answer is -1.",
  ],
  testInputs: ["5 2 2\n1 10 3 10 2\n", "5 3 2\n1 1 1 1 1\n", "1 1 1\n7\n", "6 2 3\n1 2 3 4 5 6\n", "4 2 2\n5 5 5 5\n", "8 2 2\n7 7 7 7 1 1 1 1\n"],
  sol: `long long n,m,k;cin>>n>>m>>k;vector<long long>b(n);for(auto&x:b)cin>>x;
if(m*k>n){cout<<-1<<"\\n";return 0;}
auto ok=[&](long long day){long long made=0,run=0;
 for(long long i=0;i<n;++i){if(b[i]<=day){++run;if(run==k){++made;run=0;}}else run=0;}
 return made>=m;};
long long lo=*min_element(b.begin(),b.end()),hi=*max_element(b.begin(),b.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  wrongNote: "A run that is not reset after a bouquet is cut reuses flowers; testing m*k >= n gets the impossible case backwards.",
  wrong: [
    `long long n,m,k;cin>>n>>m>>k;vector<long long>b(n);for(auto&x:b)cin>>x;
if(m*k>n){cout<<-1<<"\\n";return 0;}
auto ok=[&](long long day){long long made=0,run=0;
 for(long long i=0;i<n;++i){if(b[i]<=day){++run;if(run>=k)++made;}else run=0;}
 return made>=m;};
long long lo=*min_element(b.begin(),b.end()),hi=*max_element(b.begin(),b.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
    `long long n,m,k;cin>>n>>m>>k;vector<long long>b(n);for(auto&x:b)cin>>x;
if(m*k>=n){cout<<-1<<"\\n";return 0;}
auto ok=[&](long long day){long long made=0,run=0;
 for(long long i=0;i<n;++i){if(b[i]<=day){++run;if(run==k){++made;run=0;}}else run=0;}
 return made>=m;};
long long lo=*min_element(b.begin(),b.end()),hi=*max_element(b.begin(),b.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B321", judge: "stack-remove-adjacent-equal", topic: "data-structures", rating: 1500,
  tag: "Stack", timeLimitMs: 1000,
  uz: "Qo‘shni teng harflarni yo‘qotish",
  en: "Cancelling equal neighbours",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Satrda yonma-yon turgan ikkita bir xil harf uchrasa, ularning ikkalasi ham o‘chiriladi, qolgan qismlar esa bir-biriga yopishadi va yangi qo‘shnilar hosil bo‘lishi mumkin. Bu jarayonni yonma-yon teng harflar qolmaguncha takrorlang va oxirida qolgan satr uzunligini chiqaring. Natija o‘chirish tartibiga bog‘liq emas — qaysi juftlikdan boshlansa ham, bir xil satr qoladi.",
  statementEn: "You are given a string s of lowercase Latin letters. Whenever two equal letters stand next to each other, both are removed, the remaining parts close up, and that may create new neighbours. Repeat until no two equal letters are adjacent and print the length of what is left. The result does not depend on the order of removals — whichever pair is cancelled first, the same string remains.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun sonni chiqaring — barcha yo‘qotishlardan keyin qolgan satr uzunligi. Satr butunlay yo‘qolsa, 0 chiqaring.",
  outputEn: "Print a single integer — the length of the string that remains after all cancellations. If nothing remains, print 0.",
  constraintList: ["1 ≤ |s| ≤ 10^5", "s consists of the characters 'a'–'z' only", "the answer has the same parity as |s|"],
  constraintListUz: ["1 ≤ |s| ≤ 10^5", "s faqat 'a'–'z' belgilaridan iborat", "javobning juft-toqligi |s| niki bilan bir xil"],
  sampleInputs: ["abbaca\n", "abc\n"],
  expect: ["2\n", "3\n"],
  sampleNotesUz: [
    "Avval \"bb\" o‘chiriladi va \"aaca\" qoladi. Endi ikkita 'a' yonma-yon turib qoldi — bu birinchi o‘chirish tufayli hosil bo‘lgan yangi qo‘shnilik — ular ham ketadi va \"ca\" qoladi, ya'ni javob 2. Stek bilan bir marta yurish kifoya: har bir harf yo tepadagisini yo‘qotadi, yo ustiga qo‘yiladi.",
    "Bu satrda yonma-yon teng harflar umuman yo‘q, shuning uchun hech narsa o‘chirilmaydi va javob satrning o‘z uzunligi — 3.",
  ],
  sampleNotesEn: [
    "Cancelling \"bb\" leaves \"aaca\". The two 'a's are now neighbours — a pairing the first removal created — so they cancel as well, leaving \"ca\" and an answer of 2. One pass with a stack settles it: each letter either cancels the top or is pushed on it.",
    "No two equal letters are adjacent here, so nothing is removed and the answer is the length of the string itself, 3.",
  ],
  testInputs: ["abbaca\n", "abc\n", "aa\n", "a\n", "abccba\n", "aabbccddee\n"],
  sol: `string s;cin>>s;string st;
for(char c:s){if(!st.empty()&&st.back()==c)st.pop_back();else st.push_back(c);}
cout<<(long long)st.size()<<"\\n";`,
  wrongNote: "One pass over the original string never sees the neighbours a removal creates; counting removals instead of survivors answers a different question.",
  wrong: [
    `string s;cin>>s;string t;
for(size_t i=0;i<s.size();){if(i+1<s.size()&&s[i]==s[i+1])i+=2;else{t.push_back(s[i]);++i;}}
cout<<(long long)t.size()<<"\\n";`,
    `string s;cin>>s;string st;long long gone=0;
for(char c:s){if(!st.empty()&&st.back()==c){st.pop_back();gone+=2;}else st.push_back(c);}
cout<<gone<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B322", judge: "tree-count-depth-k", topic: "trees", rating: 1600,
  tag: "BFS", timeLimitMs: 1000,
  uz: "Berilgan chuqurlikdagi tugunlar",
  en: "Nodes at a given depth",
  statementUz: "Sizga 1-uchida ildizlangan, n ta uchdan iborat daraxt berilgan. Uchning chuqurligi — bu ildizdan unga boradigan yo‘ldagi qirralar soni; ildizning o‘z chuqurligi 0 ga teng. Chuqurligi aynan k ga teng bo‘lgan uchlar sonini toping. Daraxt ixtiyoriy shaklda bo‘lishi mumkin: u zanjir ham, yulduz ham bo‘lishi mumkin, shuning uchun chuqurlikni har bir uch uchun alohida hisoblash kerak.",
  statementEn: "You are given a tree with n nodes, rooted at node 1. The depth of a node is the number of edges on the path from the root to it, so the root itself has depth 0. Count the nodes whose depth equals exactly k. The tree can have any shape — a chain or a star — so the depth has to be worked out for every node rather than assumed.",
  inputUz: "Birinchi qatorda ikkita n va k butun soni beriladi. Keyingi n − 1 qatorning har birida a va b uchlari orasidagi qirrani bildiruvchi ikkita butun son keladi.",
  inputEn: "The first line contains two integers n and k. Each of the next n − 1 lines contains two integers a and b, an edge between nodes a and b.",
  outputUz: "Yagona butun sonni chiqaring — chuqurligi k ga teng uchlar soni. Bunday uch bo‘lmasa, 0 chiqaring.",
  outputEn: "Print a single integer — the number of nodes at depth exactly k. If there is none, print 0.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ k ≤ n", "1 ≤ a, b ≤ n", "the given edges always form a tree"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ k ≤ n", "1 ≤ a, b ≤ n", "berilgan qirralar har doim daraxt hosil qiladi"],
  sampleInputs: ["5 1\n1 2\n1 3\n2 4\n2 5\n", "3 5\n1 2\n2 3\n"],
  expect: ["2\n", "0\n"],
  sampleNotesUz: [
    "Ildizdan bir qirra naridagilar — 2 va 3-uchlar, ya'ni chuqurligi 1 bo‘lganlar ikkita. 4 va 5-uchlar 2 chuqurlikda yotadi va sanalmaydi, ildizning o‘zi esa 0 chuqurlikda.",
    "Daraxtning eng katta chuqurligi 2 (zanjir 1–2–3), shuning uchun 5 chuqurlikda birorta uch yo‘q va javob 0. k daraxt balandligidan katta bo‘lishi mumkinligini hisobga olish kerak.",
  ],
  sampleNotesEn: [
    "One edge from the root are nodes 2 and 3, so two nodes have depth 1. Nodes 4 and 5 sit at depth 2 and are not counted, and the root itself is at depth 0.",
    "The greatest depth in this tree is 2 (the chain 1–2–3), so no node sits at depth 5 and the answer is 0. k may exceed the height of the tree and that has to be handled.",
  ],
  testInputs: ["5 1\n1 2\n1 3\n2 4\n2 5\n", "3 5\n1 2\n2 3\n", "1 0\n", "4 3\n1 2\n2 3\n3 4\n", "5 0\n1 2\n1 3\n1 4\n1 5\n", "6 2\n1 2\n1 3\n2 4\n2 5\n3 6\n"],
  sol: `int n,k;cin>>n>>k;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);long long c=0;
while(!q.empty()){int v=q.front();q.pop();if(d[v]==k)++c;
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<c<<"\\n";`,
  wrongNote: "Counting depth in nodes rather than edges shifts the whole answer by one; counting everything down to k counts the levels above it too.",
  wrong: [
    `int n,k;cin>>n>>k;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>d(n+1,-1);queue<int>q;d[1]=1;q.push(1);long long c=0;
while(!q.empty()){int v=q.front();q.pop();if(d[v]==k)++c;
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<c<<"\\n";`,
    `int n,k;cin>>n>>k;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);long long c=0;
while(!q.empty()){int v=q.front();q.pop();if(d[v]<=k)++c;
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<c<<"\\n";`,
  ],
});

export default P;
