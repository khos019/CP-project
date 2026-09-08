/* Batch 01 — strings, data structures and graphs at the top of the ladder.
 *
 * Every statement is written for AlgoYo'l. The techniques are the classics any
 * judge teaches — prefix function, Manacher, segment trees, Tarjan — but no
 * text is taken from another site.
 */

const P = [];

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C201", judge: "string-min-period", topic: "strings", rating: 2100,
  tag: "Prefix function", timeLimitMs: 2000,
  uz: "Satrning eng qisqa davri",
  en: "Shortest period of a string",
  legendUz: "Bosmaxona naqshni bitta blokni qayta-qayta bosib chiqaradi va lentani kerakli uzunlikda kesib tashlaydi. Sizga tayyor lenta berilgan; blok qanchalik qisqa bo'lsa, klishe shunchalik arzon, shuning uchun bosmaxona eng qisqasini bilmoqchi. E'tibor bering, blok butun marta sig'ishi shart emas — oxirgi nusxa yarim yo'lda kesilishi mumkin.",
  legendEn: "A print shop makes a pattern by stamping one block over and over and then cutting the tape to the required length. You are handed the finished tape; the shorter the block, the cheaper the plate, so the shop wants the shortest one that could have produced it. Note that the block need not fit a whole number of times — the last copy may be cut off half way.",
  statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Shunday eng kichik p (1 ≤ p ≤ |s|) sonini toping-ki, s ning har bir i indeksi uchun s_i = s_{i-p} tenglik bajarilsin (i > p bo'lganda). Boshqacha aytganda, s ning birinchi p ta harfini cheksiz takrorlab, natijani |s| uzunlikda kessak, aynan s hosil bo'lsin.",
  statementEn: "You are given a string s of lowercase Latin letters. Find the smallest p (1 ≤ p ≤ |s|) such that s_i = s_{i-p} holds for every index i > p. Equivalently: repeating the first p letters of s indefinitely and cutting the result at length |s| reproduces s exactly.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun son — eng qisqa davr uzunligini chiqaring. Bunday p har doim mavjud, chunki p = |s| doim yaraydi.",
  outputEn: "Print a single integer — the shortest period. Such a p always exists, because p = |s| always works.",
  constraintList: ["1 ≤ |s| ≤ 10^6", "s consists of lowercase Latin letters only", "the answer is always between 1 and |s|"],
  sampleInputs: ["abcabcab\n", "abcd\n"],
  expect: ["3\n", "4\n"],
  sampleNotesUz: [
    "\"abc\" blokini takrorlasak abcabcabcabc... hosil bo'ladi; uni 8-harfda kessak aynan abcabcab chiqadi, shuning uchun p = 3 yaraydi. Undan qisqasi bo'lmaydi: p = 1 bo'lsa barcha harflar teng bo'lishi kerak edi, p = 2 bo'lsa s_1 = s_3 = 'c' ≠ 'a' bo'lardi. Blok bu yerda butun marta sig'magani — oxirgi nusxadan faqat \"ab\" qolgani — javobga to'sqinlik qilmaydi.",
    "Bu satrda hech qanday qisqa blok takrorlanmaydi, shuning uchun yagona iloji — butun satrning o'zini blok deb olish, ya'ni p = 4. Bu javob har doim mavjud bo'lgan zaxira variant.",
  ],
  sampleNotesEn: [
    "Repeating the block \"abc\" gives abcabcabcabc…, and cutting that at 8 letters gives exactly abcabcab, so p = 3 works. Nothing shorter does: p = 1 would force every letter to be equal, and p = 2 would force s_1 = s_3, which is 'c' against 'a'. That the block does not fit a whole number of times — only \"ab\" survives of the last copy — does not disqualify it.",
    "No shorter block repeats here, so the only option is to take the whole string as the block: p = 4. This is the fallback answer that always exists.",
  ],
  testInputs: ["abcabcab\n", "aaaa\n", "abcd\n", "aabaabaa\n", "aabaaab\n", "z\n"],
  sol: `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
cout<<n-pi[n-1]<<"\\n";`,
  wrongNote: "Two ways to lose the period: insisting it divide n, and a prefix function that gives up on the first mismatch instead of falling back through the border chain.",
  wrong: [
    `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
int p=n-pi[n-1];if(n%p!=0)p=n;cout<<p<<"\\n";`,
    `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];if(s[i]==s[k])pi[i]=k+1;else pi[i]=0;}
cout<<n-pi[n-1]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C202", judge: "string-all-borders", topic: "strings", rating: 2100,
  tag: "Prefix function", timeLimitMs: 2000,
  uz: "Satrning barcha chegaralari",
  en: "Every border of a string",
  legendUz: "Chegara — bu satrning ham boshida, ham oxirida turgan bo'lak. Matn qidiruvi, davriylik va avtomatlar — bularning hammasi bir xil ro'yxatga tayanadi, shuning uchun uni to'liq ko'rish foydali. Diqqat qiling: chegaralar tasodifiy emas, ular zanjir hosil qiladi — eng uzunining chegarasi keyingisi bo'ladi.",
  legendEn: "A border is a piece that sits at both the start and the end of a string. Text search, periodicity and automata all lean on the same list, so it is worth seeing it in full. Note that borders are not scattered at random: they form a chain, where the border of the longest one is the next longest.",
  statementUz: "Sizga s satri berilgan. Uning barcha xos chegaralari uzunliklarini o'sish tartibida chiqaring. Uzunligi k bo'lgan xos chegara — bu 1 ≤ k < |s| shartini qanoatlantiruvchi va s ning birinchi k ta harfi oxirgi k ta harfi bilan aynan mos keladigan k soni.",
  statementEn: "You are given a string s. Print the lengths of all its proper borders in increasing order. A proper border of length k is a value with 1 ≤ k < |s| for which the first k letters of s match the last k letters exactly.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Barcha xos chegaralar uzunliklarini o'sish tartibida, bo'sh joy bilan ajratib, bitta qatorda chiqaring. Agar birorta ham xos chegara bo'lmasa, -1 chiqaring.",
  outputEn: "Print the lengths of all proper borders in increasing order on one line, separated by single spaces. If there is no proper border at all, print -1 instead.",
  constraintList: ["1 ≤ |s| ≤ 10^6", "s consists of lowercase Latin letters only", "a string of length 1 has no proper border"],
  sampleInputs: ["aabaabaa\n", "abcd\n"],
  expect: ["1 2 5\n", "-1\n"],
  sampleNotesUz: [
    "Uchta xos chegara bor: \"a\" (1), \"aa\" (2) va \"aabaa\" (5) — har biri satrning ham boshida, ham oxirida uchraydi. Ular zanjirni hosil qiladi: 5 ning chegarasi 2, 2 niki esa 1. \"aab\" (3) chegara emas, chunki satr \"baa\" bilan tugaydi.",
    "Satr 'a' bilan boshlanib 'd' bilan tugaydi, shuning uchun hatto uzunligi 1 bo'lgan chegara ham yo'q. Ro'yxat bo'sh, demak -1 chiqariladi.",
  ],
  sampleNotesEn: [
    "There are three proper borders: \"a\" (1), \"aa\" (2) and \"aabaa\" (5), each appearing at both ends of the string. They form the chain the legend mentions: the border of 5 is 2, and the border of 2 is 1. \"aab\" (3) is not one, because the string ends in \"baa\".",
    "The string starts with 'a' and ends with 'd', so not even a border of length 1 exists. The list is empty, so -1 is printed.",
  ],
  testInputs: ["aabaabaa\n", "abcd\n", "aaaa\n", "a\n", "abababab\n", "abacaba\n"],
  sol: `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
vector<int>b;for(int k=pi[n-1];k>0;k=pi[k-1])b.push_back(k);
if(b.empty()){cout<<-1<<"\\n";return 0;}
reverse(b.begin(),b.end());
for(size_t i=0;i<b.size();++i)cout<<b[i]<<(i+1<b.size()?" ":"\\n");`,
  wrongNote: "The chain comes out longest-first; forgetting to turn it around prints a correct set in the wrong order. The second miss reports only the longest border.",
  wrong: [
    `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
vector<int>b;for(int k=pi[n-1];k>0;k=pi[k-1])b.push_back(k);
if(b.empty()){cout<<-1<<"\\n";return 0;}
for(size_t i=0;i<b.size();++i)cout<<b[i]<<(i+1<b.size()?" ":"\\n");`,
    `string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
if(pi[n-1]==0){cout<<-1<<"\\n";return 0;}
cout<<pi[n-1]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C203", judge: "manacher-longest-pal", topic: "strings", rating: 2300,
  tag: "Manacher", timeLimitMs: 2000,
  uz: "Eng uzun palindrom bo'lak",
  en: "Longest palindromic substring",
  legendUz: "Har bir markazdan ikki tomonga kengayish g'oyasi to'g'ri, lekin million harfda juda sekin: qo'shni markazlar deyarli bir xil ishni qaytadan bajaradi. Manacher algoritmi shu takrorni oldini oladi — allaqachon topilgan palindromning simmetriyasidan foydalanib, yangi markaz uchun radiusning quyi chegarasini bepul oladi. Toq va juft uzunliklarni alohida ko'rib chiqmaslik uchun harflar orasiga ajratuvchi belgi qo'yiladi.",
  legendEn: "Expanding outwards from every centre is the right idea but far too slow at a million letters: neighbouring centres redo almost the same work. Manacher's algorithm removes that repetition — it uses the symmetry of a palindrome already found to get a lower bound on the next centre's radius for free. Inserting a separator between letters avoids having to treat odd and even lengths as two separate cases.",
  statementUz: "Sizga s satri berilgan. Uning eng uzun palindrom bo'lagi uzunligini toping. Bo'lak — bu ketma-ket turgan harflar; palindrom esa chapdan ham, o'ngdan ham bir xil o'qiladigan satr. Har qanday bitta harfning o'zi palindrom bo'lgani uchun javob hech qachon 1 dan kichik bo'lmaydi.",
  statementEn: "You are given a string s. Find the length of its longest palindromic substring. A substring is a run of consecutive letters, and a palindrome reads the same left to right as right to left. Since any single letter is already a palindrome, the answer is never below 1.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun son — eng uzun palindrom bo'lakning uzunligini chiqaring.",
  outputEn: "Print a single integer — the length of the longest palindromic substring.",
  constraintList: ["1 ≤ |s| ≤ 10^6", "s consists of lowercase Latin letters only", "an O(|s|^2) scan over all centres is too slow at the upper bound"],
  sampleInputs: ["bananas\n", "abba\n"],
  expect: ["5\n", "4\n"],
  sampleNotesUz: [
    "Eng uzuni — \"anana\", uzunligi 5, u 2-harfdan 6-harfgacha cho'ziladi va markazi o'rtadagi 'n' da. \"anana\" ni bir harfga kengaytirib bo'lmaydi, chunki chapda 'b', o'ngda 's' turibdi. \"ana\" ham palindrom, lekin qisqaroq.",
    "Bu palindromning uzunligi juft va uning markazi harfda emas, ikki 'b' orasida turadi. Aynan shu holat markazlarni faqat harflardan izlagan yechimni yiqitadi — shuning uchun ajratuvchi belgilar kerak.",
  ],
  sampleNotesEn: [
    "The longest is \"anana\" of length 5, running from the second letter to the sixth with the middle 'n' as its centre. It cannot grow by another letter because 'b' sits on the left and 's' on the right. \"ana\" is also a palindrome, but shorter.",
    "This palindrome has even length and its centre falls between the two 'b's rather than on a letter. That is exactly the case that breaks a solution which only ever centres on a letter — hence the separators.",
  ],
  testInputs: ["bananas\n", "abba\n", "abcd\n", "aaaa\n", "forgeeksskeegfor\n", "a\n"],
  sol: `string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1,best=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
best=max(best,k-1);}
cout<<best<<"\\n";`,
  wrongNote: "The radius in the padded string is one more than the length in the original; and a version that skips the padding sees only odd-length palindromes.",
  wrong: [
    `string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1,best=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
best=max(best,k);}
cout<<best<<"\\n";`,
    `string s;cin>>s;int n=s.size();int best=1;
for(int c=0;c<n;++c){int k=0;while(c-k>=0&&c+k<n&&s[c-k]==s[c+k])++k;best=max(best,2*k-1);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C204", judge: "count-palindromic-substrings", topic: "strings", rating: 2400,
  tag: "Manacher", timeLimitMs: 2000,
  uz: "Palindrom bo'laklar soni",
  en: "Counting palindromic substrings",
  legendUz: "Bu safar eng uzunini emas, hammasini sanash kerak. Bir xil ko'rinishdagi ikki bo'lak turli joyda tursa, ular alohida sanaladi — ya'ni sanoq joylashuv bo'yicha boradi, ko'rinish bo'yicha emas. Bu farq muhim: \"aaa\" da \"a\" uch marta, \"aa\" esa ikki marta hisoblanadi.",
  legendEn: "This time you count all of them rather than the longest. Two substrings that look the same but sit at different places count separately — the count is by position, not by appearance. The distinction matters: in \"aaa\" the substring \"a\" counts three times and \"aa\" counts twice.",
  statementUz: "Sizga s satri berilgan. s ning nechta (l, r) juftligi uchun l dan r gacha bo'lgan bo'lak palindrom bo'lishini aniqlang (1 ≤ l ≤ r ≤ |s|). Har bir juftlik alohida sanaladi, hatto ikki juftlik bir xil satrni bersa ham.",
  statementEn: "You are given a string s. Determine for how many pairs (l, r) with 1 ≤ l ≤ r ≤ |s| the substring from l to r is a palindrome. Every pair is counted separately, even when two pairs spell the same string.",
  inputUz: "Yagona qatorda kichik lotin harflaridan iborat s satri beriladi.",
  inputEn: "The only line contains the string s of lowercase Latin letters.",
  outputUz: "Yagona butun son — palindrom bo'laklar sonini chiqaring. Javob 5·10^11 gacha yetishi mumkin, shuning uchun 64-bitli tur kerak.",
  outputEn: "Print a single integer — the number of palindromic substrings. The answer can reach about 5·10^11, so a 64-bit type is required.",
  constraintList: ["1 ≤ |s| ≤ 10^6", "s consists of lowercase Latin letters only", "the answer does not fit in a 32-bit integer"],
  sampleInputs: ["aaa\n", "ababa\n"],
  expect: ["6\n", "9\n"],
  sampleNotesUz: [
    "Oltita: uchta alohida 'a', ikkita \"aa\" (1-2 va 2-3 o'rinlarda) va bitta \"aaa\". Ko'rinishi bo'yicha sanasak atigi 3 ta turli satr bo'lardi — shuning uchun statementda juftliklar sanalishi alohida aytilgan.",
    "Beshta bitta harfli, uchta uch harfli (\"aba\", \"bab\", \"aba\") va bitta beshta harfli (\"ababa\"): jami 9. Juft uzunlikdagi palindrom bu yerda umuman yo'q, chunki qo'shni harflar hech qachon teng emas.",
  ],
  sampleNotesEn: [
    "Six of them: three single 'a's, two copies of \"aa\" (at positions 1–2 and 2–3) and one \"aaa\". Counting by appearance would give only 3 distinct strings — which is why the statement spells out that pairs are what is counted.",
    "Five of length one, three of length three (\"aba\", \"bab\", \"aba\") and one of length five (\"ababa\"): nine in total. There is no even-length palindrome here at all, because no two adjacent letters are ever equal.",
  ],
  testInputs: ["aaa\n", "ababa\n", "abc\n", "aaaa\n", "abba\n", "a\n"],
  sol: `string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1;long long total=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
total+=k/2;}
cout<<total<<"\\n";`,
  wrongNote: "Off by one in how many real palindromes a padded radius stands for, and a 32-bit accumulator that overflows on a long run of equal letters.",
  wrong: [
    `string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1;long long total=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
total+=(k+1)/2;}
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C205", judge: "segtree-point-max", topic: "data-structures", rating: 2100,
  tag: "Segment tree", timeLimitMs: 2000,
  uz: "Nuqtaviy o'zgartirish, oraliqdagi maksimum",
  en: "Point update, range maximum",
  legendUz: "Prefiks massivlar oraliq savollariga bir zumda javob beradi, lekin bitta qiymat o'zgarsa butun massivni qayta qurishga to'g'ri keladi. Segment daraxti ikkala amalni ham logarifmik qiladi: har bir tugun o'z oralig'ining javobini saqlaydi, o'zgarish esa faqat bitta bargdan ildizgacha bo'lgan yo'lni yangilaydi. E'tibor bering, maksimum uchun neytral element nol emas — massivda manfiy sonlar bo'lishi mumkin.",
  legendEn: "A prefix array answers range questions instantly, but one changed value forces the whole array to be rebuilt. A segment tree makes both operations logarithmic: each node stores the answer for its own range, and an update only refreshes the single path from a leaf up to the root. Note that the neutral element for a maximum is not zero — the array may contain negative numbers.",
  statementUz: "Sizga n ta butun sondan iborat a massivi va q ta so'rov berilgan. So'rov ikki xil bo'ladi:\n\n• \"1 i v\" — a_i qiymatini v ga almashtirish;\n• \"2 l r\" — a_l, a_{l+1}, …, a_r orasidagi eng katta qiymatni chiqarish.\n\nSo'rovlarni berilgan tartibda bajaring.",
  statementEn: "You are given an array a of n integers and q queries. There are two kinds:\n\n• \"1 i v\" — replace a_i with v;\n• \"2 l r\" — print the largest value among a_l, a_{l+1}, …, a_r.\n\nProcess the queries in the order given.",
  inputUz: "Birinchi qatorda n va q butun sonlari. Ikkinchi qatorda n ta butun son — a massivi. Keyingi q qatorning har birida yuqorida tavsiflangan ko'rinishdagi bitta so'rov keladi.",
  inputEn: "The first line contains the integers n and q. The second line contains n integers — the array a. Each of the next q lines contains one query in the form described above.",
  outputUz: "Har bir 2-turdagi so'rov uchun javobni alohida qatorda chiqaring.",
  outputEn: "For each query of type 2, print the answer on its own line.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "−10^9 ≤ a_i, v ≤ 10^9", "1 ≤ i ≤ n and 1 ≤ l ≤ r ≤ n", "the array may be entirely negative"],
  sampleInputs: ["5 3\n1 3 2 5 4\n2 1 5\n1 4 0\n2 1 5\n", "3 2\n-5 -2 -9\n2 1 3\n2 3 3\n"],
  expect: ["5\n4\n", "-2\n-9\n"],
  sampleNotesUz: [
    "Birinchi so'rov butun massivni ko'radi va 5 ni topadi. So'ng 4-element 0 ga almashadi, massiv 1 3 2 0 4 bo'ladi, shuning uchun ikkinchi so'rov endi 4 ni qaytaradi — o'zgarish javobni haqiqatan ham pasaytirdi.",
    "Bu yerda barcha qiymatlar manfiy. Javoblar -2 va -9 — ikkalasi ham noldan kichik. Neytral element sifatida 0 dan foydalangan yechim bu yerda 0 chiqaradi va shu bilan yiqiladi.",
  ],
  sampleNotesEn: [
    "The first query sees the whole array and finds 5. Then the fourth element becomes 0, making the array 1 3 2 0 4, so the second query now returns 4 — the update genuinely lowered the answer.",
    "Every value here is negative. The answers are -2 and -9, both below zero. A solution that uses 0 as the neutral element prints 0 here and fails on exactly this case.",
  ],
  testInputs: [
    "5 3\n1 3 2 5 4\n2 1 5\n1 4 0\n2 1 5\n",
    "3 2\n-5 -2 -9\n2 1 3\n2 3 3\n",
    "1 2\n7\n2 1 1\n1 1 -7\n",
    "6 5\n4 -1 9 2 -8 3\n2 2 4\n2 5 6\n1 5 100\n2 1 6\n2 5 5\n",
    "4 4\n-1 -1 -1 -1\n2 1 4\n1 2 -50\n2 1 2\n2 3 4\n",
  ],
  sol: `int n,q;cin>>n>>q;int sz=1;while(sz<n)sz<<=1;
vector<long long>tr(2*sz,LLONG_MIN);
for(int i=0;i<n;++i)cin>>tr[sz+i];
for(int i=sz-1;i>=1;--i)tr[i]=max(tr[2*i],tr[2*i+1]);
while(q--){int type;cin>>type;
if(type==1){int i;long long v;cin>>i>>v;int p=sz+i-1;tr[p]=v;for(p>>=1;p>=1;p>>=1)tr[p]=max(tr[2*p],tr[2*p+1]);}
else{int l,r;cin>>l>>r;long long best=LLONG_MIN;
for(int a=sz+l-1,b=sz+r;a<b;a>>=1,b>>=1){if(a&1)best=max(best,tr[a++]);if(b&1)best=max(best,tr[--b]);}
cout<<best<<"\\n";}}`,
  wrongNote: "Zero is the neutral element for a sum, not for a maximum; on an all-negative array the tree answers 0.",
  wrong: [
    `int n,q;cin>>n>>q;int sz=1;while(sz<n)sz<<=1;
vector<long long>tr(2*sz,0);
for(int i=0;i<n;++i)cin>>tr[sz+i];
for(int i=sz-1;i>=1;--i)tr[i]=max(tr[2*i],tr[2*i+1]);
while(q--){int type;cin>>type;
if(type==1){int i;long long v;cin>>i>>v;int p=sz+i-1;tr[p]=v;for(p>>=1;p>=1;p>>=1)tr[p]=max(tr[2*p],tr[2*p+1]);}
else{int l,r;cin>>l>>r;long long best=0;
for(int a=sz+l-1,b=sz+r;a<b;a>>=1,b>>=1){if(a&1)best=max(best,tr[a++]);if(b&1)best=max(best,tr[--b]);}
cout<<best<<"\\n";}}`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C206", judge: "segtree-lazy-range-add", topic: "data-structures", rating: 2400,
  tag: "Lazy propagation", timeLimitMs: 2000,
  uz: "Oraliqqa qo'shish, oraliq yig'indisi",
  en: "Range add, range sum",
  legendUz: "Bitta elementni o'zgartirish bitta yo'lni yangilaydi, butun oraliqni o'zgartirish esa — barcha bargni, agar sodda qilinsa. Dangasa yoyish (lazy propagation) shu ishni kechiktiradi: tugunda \"mening butun oralig'imga v qo'shilishi kerak\" degan yozuv qoldiriladi va u faqat pastga tushish zarur bo'lgandagina bolalarga uzatiladi. Bir joyda adashish oson — yig'indiga qo'shilayotgan qiymatni oraliq uzunligiga ko'paytirish esdan chiqadi.",
  legendEn: "Changing one element refreshes one path; changing a whole range refreshes every leaf, if done naively. Lazy propagation defers that work: a node keeps a note saying \"v still has to be added across my whole range\", and the note is only pushed to the children when the walk actually has to go below that node. There is one easy place to slip — forgetting that the value added to a node's sum has to be multiplied by the length of its range.",
  statementUz: "Sizga n ta butun sondan iborat a massivi va q ta so'rov berilgan. So'rov ikki xil bo'ladi:\n\n• \"1 l r v\" — a_l dan a_r gacha bo'lgan har bir elementga v ni qo'shish;\n• \"2 l r\" — a_l + a_{l+1} + … + a_r yig'indisini chiqarish.\n\nSo'rovlarni berilgan tartibda bajaring.",
  statementEn: "You are given an array a of n integers and q queries. There are two kinds:\n\n• \"1 l r v\" — add v to every element from a_l through a_r;\n• \"2 l r\" — print the sum a_l + a_{l+1} + … + a_r.\n\nProcess the queries in the order given.",
  inputUz: "Birinchi qatorda n va q butun sonlari. Ikkinchi qatorda n ta butun son — a massivi. Keyingi q qatorning har birida yuqorida tavsiflangan ko'rinishdagi bitta so'rov keladi.",
  inputEn: "The first line contains the integers n and q. The second line contains n integers — the array a. Each of the next q lines contains one query in the form described above.",
  outputUz: "Har bir 2-turdagi so'rov uchun yig'indini alohida qatorda chiqaring. Yig'indi 32-bitli turga sig'maydi.",
  outputEn: "For each query of type 2, print the sum on its own line. The sum does not fit in a 32-bit type.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "−10^9 ≤ a_i, v ≤ 10^9", "1 ≤ l ≤ r ≤ n", "an intermediate sum can reach 4·10^14 in absolute value"],
  sampleInputs: ["5 4\n1 2 3 4 5\n2 1 5\n1 2 4 10\n2 1 5\n2 2 3\n", "3 3\n0 0 0\n1 1 3 5\n1 2 2 -20\n2 1 3\n"],
  expect: ["15\n45\n25\n", "-5\n"],
  sampleNotesUz: [
    "Boshida yig'indi 1+2+3+4+5 = 15. So'ng 2..4 oraliqdagi uchta elementga 10 dan qo'shiladi, ya'ni umumiy yig'indi 30 ga oshadi va 45 bo'ladi. Oxirgi so'rov faqat 2 va 3 o'rinlarni ko'radi: (2+10) + (3+10) = 25. Aynan shu \"30 ga oshdi\" qismi uzunlikka ko'paytirishni unutgan yechimni fosh qiladi — u 15 + 10 = 25 deb javob berardi.",
    "Uchala elementga 5 qo'shiladi (yig'indi 15), so'ng faqat o'rtadagisidan 20 ayriladi (yig'indi -5). Ikkinchi o'zgarish birinchisining ustiga tushadi, shuning uchun bu yerda dangasa yozuvlar to'planishi tekshiriladi.",
  ],
  sampleNotesEn: [
    "The sum starts at 1+2+3+4+5 = 15. Then 10 is added to each of the three elements in 2..4, so the total rises by 30 to 45. The last query looks only at positions 2 and 3: (2+10) + (3+10) = 25. That \"rises by 30\" is precisely what catches a solution that forgot the length multiplier — it would have answered 15 + 10 = 25 for the second query.",
    "All three elements get +5 (sum 15), then the middle one alone gets −20 (sum −5). The second update lands on top of the first, so this checks that pending notes accumulate rather than replace one another.",
  ],
  testInputs: [
    "5 4\n1 2 3 4 5\n2 1 5\n1 2 4 10\n2 1 5\n2 2 3\n",
    "3 3\n0 0 0\n1 1 3 5\n1 2 2 -20\n2 1 3\n",
    "1 3\n1000000000\n2 1 1\n1 1 1 1000000000\n2 1 1\n",
    "6 6\n1 1 1 1 1 1\n1 1 6 1000000000\n2 1 6\n1 3 4 -1000000000\n2 3 4\n2 1 2\n2 5 6\n",
    "4 5\n-1 -2 -3 -4\n2 1 4\n1 1 2 100\n2 1 2\n1 3 4 -100\n2 3 4\n",
  ],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n+1,0);
for(int i=1;i<=n;++i)cin>>a[i];
vector<long long>sum(4*n,0),lz(4*n,0);
function<void(int,int,int)>build=[&](int node,int lo,int hi){
if(lo==hi){sum[node]=a[lo];return;}int mid=(lo+hi)/2;
build(2*node,lo,mid);build(2*node+1,mid+1,hi);sum[node]=sum[2*node]+sum[2*node+1];};
build(1,1,n);
function<void(int,int,int)>push=[&](int node,int lo,int hi){
if(lz[node]==0)return;int mid=(lo+hi)/2;
sum[2*node]+=lz[node]*(mid-lo+1);lz[2*node]+=lz[node];
sum[2*node+1]+=lz[node]*(hi-mid);lz[2*node+1]+=lz[node];lz[node]=0;};
function<void(int,int,int,int,int,long long)>upd=[&](int node,int lo,int hi,int l,int r,long long v){
if(r<lo||hi<l)return;
if(l<=lo&&hi<=r){sum[node]+=v*(hi-lo+1);lz[node]+=v;return;}
push(node,lo,hi);int mid=(lo+hi)/2;
upd(2*node,lo,mid,l,r,v);upd(2*node+1,mid+1,hi,l,r,v);sum[node]=sum[2*node]+sum[2*node+1];};
function<long long(int,int,int,int,int)>qry=[&](int node,int lo,int hi,int l,int r)->long long{
if(r<lo||hi<l)return 0;
if(l<=lo&&hi<=r)return sum[node];
push(node,lo,hi);int mid=(lo+hi)/2;
return qry(2*node,lo,mid,l,r)+qry(2*node+1,mid+1,hi,l,r);};
while(q--){int type;cin>>type;
if(type==1){int l,r;long long v;cin>>l>>r>>v;upd(1,1,n,l,r,v);}
else{int l,r;cin>>l>>r;cout<<qry(1,1,n,l,r)<<"\\n";}}`,
  wrongNote: "The classic lazy slip: adding v to a node's sum instead of v times the length of the node's range.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n+1,0);
for(int i=1;i<=n;++i)cin>>a[i];
vector<long long>sum(4*n,0),lz(4*n,0);
function<void(int,int,int)>build=[&](int node,int lo,int hi){
if(lo==hi){sum[node]=a[lo];return;}int mid=(lo+hi)/2;
build(2*node,lo,mid);build(2*node+1,mid+1,hi);sum[node]=sum[2*node]+sum[2*node+1];};
build(1,1,n);
function<void(int,int,int)>push=[&](int node,int lo,int hi){
if(lz[node]==0)return;
sum[2*node]+=lz[node];lz[2*node]+=lz[node];
sum[2*node+1]+=lz[node];lz[2*node+1]+=lz[node];lz[node]=0;};
function<void(int,int,int,int,int,long long)>upd=[&](int node,int lo,int hi,int l,int r,long long v){
if(r<lo||hi<l)return;
if(l<=lo&&hi<=r){sum[node]+=v;lz[node]+=v;return;}
push(node,lo,hi);int mid=(lo+hi)/2;
upd(2*node,lo,mid,l,r,v);upd(2*node+1,mid+1,hi,l,r,v);sum[node]=sum[2*node]+sum[2*node+1];};
function<long long(int,int,int,int,int)>qry=[&](int node,int lo,int hi,int l,int r)->long long{
if(r<lo||hi<l)return 0;
if(l<=lo&&hi<=r)return sum[node];
push(node,lo,hi);int mid=(lo+hi)/2;
return qry(2*node,lo,mid,l,r)+qry(2*node+1,mid+1,hi,l,r);};
while(q--){int type;cin>>type;
if(type==1){int l,r;long long v;cin>>l>>r>>v;upd(1,1,n,l,r,v);}
else{int l,r;cin>>l>>r;cout<<qry(1,1,n,l,r)<<"\\n";}}`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C207", judge: "sparse-table-rmq", topic: "data-structures", rating: 2200,
  tag: "Sparse table", timeLimitMs: 2000,
  uz: "O'zgarmas massivda oraliq minimumi",
  en: "Range minimum on a static array",
  legendUz: "Agar massiv umuman o'zgarmasa, segment daraxtidan ham tezroq javob berish mumkin. Har bir boshlanish nuqtasi uchun uzunligi 1, 2, 4, 8, … bo'lgan oraliqlarning minimumini oldindan hisoblab qo'yamiz. Har qanday oraliqni ikkita shunday blok bilan qoplasa bo'ladi — ular ustma-ust tushsa ham zarari yo'q, chunki minimumni ikki marta ko'rish javobni o'zgartirmaydi.",
  legendEn: "When the array never changes, you can answer faster than a segment tree. Precompute the minimum of every block whose length is 1, 2, 4, 8, … starting at each position. Any range can then be covered by two such blocks — and it does no harm if they overlap, because seeing the minimum twice does not change it.",
  statementUz: "Sizga n ta butun sondan iborat a massivi va q ta so'rov berilgan. Har bir (l, r) so'rovi uchun a_l, a_{l+1}, …, a_r orasidagi eng kichik qiymatni toping. Massiv so'rovlar davomida o'zgarmaydi.",
  statementEn: "You are given an array a of n integers and q queries. For each query (l, r), find the smallest value among a_l, a_{l+1}, …, a_r. The array never changes between queries.",
  inputUz: "Birinchi qatorda n va q butun sonlari. Ikkinchi qatorda n ta butun son — a massivi. Keyingi q qatorning har birida l va r butun sonlari keladi.",
  inputEn: "The first line contains the integers n and q. The second line contains n integers — the array a. Each of the next q lines contains two integers l and r.",
  outputUz: "Har bir so'rov uchun minimal qiymatni alohida qatorda chiqaring.",
  outputEn: "For each query, print the minimum on its own line.",
  constraintList: ["1 ≤ n, q ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9", "1 ≤ l ≤ r ≤ n", "l = r is allowed, and then the answer is a_l itself"],
  sampleInputs: ["6 3\n5 2 9 1 7 3\n1 3\n4 6\n2 2\n", "1 1\n-1000000000\n1 1\n"],
  expect: ["2\n1\n2\n", "-1000000000\n"],
  sampleNotesUz: [
    "Birinchi so'rov 5, 2, 9 ni ko'radi va 2 ni qaytaradi. Ikkinchisi 1, 7, 3 ni ko'radi va 1 ni. Uchinchisining uzunligi bir — bu ikkita blok bilan qoplashda blok uzunligi 1 bo'ladigan chegaraviy holat, javob esa shunchaki a_2 = 2.",
    "Yagona element ham yagona so'rov ham chegarada: bu yerda log jadvalidagi bir birlik xato darrov ko'rinadi, chunki uzunligi 1 bo'lgan oraliq uchun k = 0 bo'lishi shart.",
  ],
  sampleNotesEn: [
    "The first query sees 5, 2, 9 and returns 2. The second sees 1, 7, 3 and returns 1. The third has length one — the boundary case of the two-block cover, where the block length is 1 — and the answer is simply a_2 = 2.",
    "A single element and a single query, both at the boundary: an off-by-one in the log table shows up immediately here, since a range of length 1 must choose k = 0.",
  ],
  testInputs: [
    "6 3\n5 2 9 1 7 3\n1 3\n4 6\n2 2\n",
    "1 1\n-1000000000\n1 1\n",
    "5 5\n1 2 3 4 5\n1 5\n1 1\n5 5\n2 4\n3 5\n",
    "8 4\n-3 -1 -4 -1 -5 -9 -2 -6\n1 8\n1 2\n6 7\n3 3\n",
    "4 3\n7 7 7 7\n1 4\n2 3\n1 2\n",
  ],
  sol: `int n,q;cin>>n>>q;vector<int>a(n);for(auto&x:a)cin>>x;
int LOG=1;while((1<<LOG)<=n)++LOG;
vector<vector<int>>sp(LOG,vector<int>(n));
sp[0]=a;
for(int k=1;k<LOG;++k)for(int i=0;i+(1<<k)<=n;++i)sp[k][i]=min(sp[k-1][i],sp[k-1][i+(1<<(k-1))]);
vector<int>lg(n+1,0);for(int i=2;i<=n;++i)lg[i]=lg[i/2]+1;
while(q--){int l,r;cin>>l>>r;--l;--r;int k=lg[r-l+1];
cout<<min(sp[k][l],sp[k][r-(1<<k)+1])<<"\\n";}`,
  wrongNote: "A log table built with lg[i] = lg[i/2] + 1 starting from i = 1 rounds the wrong way, and the two blocks then run off the end of the range.",
  wrong: [
    `int n,q;cin>>n>>q;vector<int>a(n);for(auto&x:a)cin>>x;
int LOG=2;while((1<<LOG)<=n+1)++LOG;
vector<vector<int>>sp(LOG,vector<int>(n));
sp[0]=a;
for(int k=1;k<LOG;++k)for(int i=0;i+(1<<k)<=n;++i)sp[k][i]=min(sp[k-1][i],sp[k-1][i+(1<<(k-1))]);
vector<int>lg(n+2,0);for(int i=1;i<=n;++i)lg[i]=lg[i/2]+1;
while(q--){int l,r;cin>>l>>r;--l;--r;int k=lg[r-l+1];
cout<<min(sp[k][l],sp[k][r-(1<<k)+1])<<"\\n";}`,
  ],
});

/* ------------------------------------------------------------------ 2200 */
P.push({
  id: "C208", judge: "trie-max-xor", topic: "data-structures", rating: 2200,
  tag: "Binary trie", timeLimitMs: 2000,
  uz: "Eng katta XOR juftlik",
  en: "Largest XOR of a pair",
  legendUz: "Barcha juftliklarni ko'rib chiqish 2·10^5 element uchun ish bermaydi. Yechim sonlarni ikkilik sanoq sistemasida, eng katta razryaddan boshlab, prefiks daraxtiga (trie) joylashda: har bir son uchun daraxt bo'ylab tushamiz va har bir razryadda joriy bitning teskarisiga borishga urinamiz. Bunday shox bo'lsa — o'sha razryadda 1 olamiz, bo'lmasa boshqa iloj yo'q. Ochko'zlik bu yerda haqiqatan ham optimal, chunki yuqori razryad quyi razryadlarning barchasidan qimmatroq.",
  legendEn: "Trying every pair does not work at 2·10^5 elements. The trick is to insert the numbers into a prefix tree over their binary digits, most significant bit first: for each number you walk down the tree and at every bit try to take the branch opposite to your own. If that branch exists you gain a 1 in that position; if it does not, there is no choice. Greed really is optimal here, because one higher bit outweighs all the lower bits together.",
  statementUz: "Sizga n ta manfiy bo'lmagan butun sondan iborat massiv berilgan. Turli o'rinlarda turgan ikkita element tanlang va ularning bitlar bo'yicha XOR qiymatini maksimallashtiring. Shu maksimal qiymatni chiqaring.",
  statementEn: "You are given an array of n non-negative integers. Choose two elements at different positions and maximise their bitwise XOR. Print that maximum value.",
  inputUz: "Birinchi qatorda n butun soni. Ikkinchi qatorda n ta manfiy bo'lmagan butun son keladi.",
  inputEn: "The first line contains the integer n. The second line contains n non-negative integers.",
  outputUz: "Yagona butun son — ikki elementning eng katta XOR qiymatini chiqaring.",
  outputEn: "Print a single integer — the largest XOR of two elements.",
  constraintList: ["2 ≤ n ≤ 2·10^5", "0 ≤ a_i < 2^30", "the two elements must sit at different positions, but may be equal in value"],
  sampleInputs: ["6\n3 10 5 25 2 8\n", "2\n7 7\n"],
  expect: ["28\n", "0\n"],
  sampleNotesUz: [
    "Eng yaxshi juftlik — 5 va 25: ikkilikda 00101 va 11001, XOR esa 11100 = 28. Diqqat qiling, bu juftlikda na eng katta, na eng kichik element qatnashmaydi (ular 25 va 2, XOR = 27), shuning uchun \"maksimum bilan minimumni olamiz\" degan taxmin bu yerda yiqiladi.",
    "Ikkala element ham bir xil, shuning uchun ularning XOR i nol. Ular turli o'rinlarda turgani uchun tanlash o'zi qonuniy — javob 0 bo'lishi \"juftlik yo'q\" degani emas.",
  ],
  sampleNotesEn: [
    "The best pair is 5 and 25: in binary 00101 and 11001, whose XOR is 11100 = 28. Notice that neither the largest nor the smallest element takes part (those are 25 and 2, giving 27), so the guess \"pair the maximum with the minimum\" fails right here.",
    "Both elements are equal, so their XOR is zero. The choice is still legal because they sit at different positions — an answer of 0 does not mean no pair exists.",
  ],
  testInputs: [
    "6\n3 10 5 25 2 8\n",
    "2\n7 7\n",
    "2\n0 1073741823\n",
    "5\n0 0 0 0 1\n",
    "8\n8 1 2 12 7 6 3 9\n",
  ],
  sol: `int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
const int B=30;vector<array<int,2>>t(1,{-1,-1});
for(int x:a){int cur=0;
for(int b=B-1;b>=0;--b){int d=(x>>b)&1;
if(t[cur][d]<0){t.push_back({-1,-1});t[cur][d]=(int)t.size()-1;}
cur=t[cur][d];}}
int best=0;
for(int x:a){int cur=0,val=0;
for(int b=B-1;b>=0;--b){int d=((x>>b)&1)^1;
if(t[cur][d]>=0){val|=1<<b;cur=t[cur][d];}else cur=t[cur][d^1];}
best=max(best,val);}
cout<<best<<"\\n";`,
  wrongNote: "Pairing the maximum with the minimum is the guess everyone makes first; it is right often enough to survive small tests and wrong as soon as the top bits agree.",
  wrong: [
    `int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
cout<<(a.front()^a.back())<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C209", judge: "scc-count", topic: "graphs", rating: 2300,
  tag: "Strongly connected components", timeLimitMs: 2000,
  uz: "Kuchli bog'langan komponentalar soni",
  en: "Counting strongly connected components",
  legendUz: "Yo'naltirilmagan grafda \"bir komponentada\" degani oddiy: bir-biriga yetib borsa bo'ldi. Yo'naltirilgan grafda esa a dan b ga yo'l bo'lishi b dan a ga yo'l borligini anglatmaydi. Ikkala yo'nalishda ham yetib boradigan tugunlar guruhi kuchli bog'langan komponenta deyiladi. Ularni topish uchun grafni ikki marta chuqurlik bo'yicha aylanib chiqish yetadi — ikkinchisi teskari qirralar bo'yicha.",
  legendEn: "In an undirected graph \"same component\" is simple: you can reach one another. In a directed graph, a path from a to b says nothing about a path from b to a. A group of vertices that reach each other in both directions is a strongly connected component. Two depth-first passes over the graph are enough to find them — the second one along the reversed edges.",
  statementUz: "Sizga n ta tugun va m ta yo'naltirilgan qirradan iborat graf berilgan. Uning kuchli bog'langan komponentalari sonini toping. Ikki tugun bitta komponentada bo'ladi, agar birinchisidan ikkinchisiga va ikkinchisidan birinchisiga yo'l mavjud bo'lsa. Hech qanday qirrasi yo'q tugun o'zi yolg'iz komponenta hisoblanadi.",
  statementEn: "You are given a directed graph with n vertices and m edges. Find the number of its strongly connected components. Two vertices lie in the same component when there is a path from the first to the second and a path back. A vertex with no edges at all forms a component on its own.",
  inputUz: "Birinchi qatorda n va m butun sonlari. Keyingi m qatorning har birida u va v sonlari keladi — u dan v ga yo'naltirilgan qirra. Qirralar takrorlanishi va tugunni o'ziga bog'lashi mumkin.",
  inputEn: "The first line contains the integers n and m. Each of the next m lines contains two integers u and v — a directed edge from u to v. Edges may repeat and may join a vertex to itself.",
  outputUz: "Yagona butun son — kuchli bog'langan komponentalar sonini chiqaring.",
  outputEn: "Print a single integer — the number of strongly connected components.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ m ≤ 4·10^5", "1 ≤ u, v ≤ n", "the answer is between 1 and n"],
  sampleInputs: ["5 5\n1 2\n2 3\n3 1\n3 4\n4 5\n", "3 0\n"],
  expect: ["3\n", "3\n"],
  sampleNotesUz: [
    "1, 2 va 3 tugunlari halqa hosil qiladi, shuning uchun ular bitta komponenta. 4 dan 5 ga borish mumkin, lekin qaytib kelib bo'lmaydi, shuning uchun ular alohida-alohida turadi: jami 3 ta komponenta. Grafni yo'naltirilmagan deb hisoblagan yechim bu yerda 1 chiqaradi.",
    "Qirra umuman yo'q, shuning uchun uchala tugun ham o'zi yolg'iz komponenta bo'ladi va javob 3. Bu \"m = 0\" chegaraviy holati, u ko'p yechimlarda qirralarni o'qish sikli bilan birga tushib qoladi.",
  ],
  sampleNotesEn: [
    "Vertices 1, 2 and 3 form a cycle, so they are one component. Vertex 4 reaches 5 but cannot get back, so those two stand alone: three components in total. A solution that treats the graph as undirected prints 1 here.",
    "There are no edges at all, so each of the three vertices is its own component and the answer is 3. This is the m = 0 boundary, which tends to disappear together with the edge-reading loop.",
  ],
  testInputs: [
    "5 5\n1 2\n2 3\n3 1\n3 4\n4 5\n",
    "3 0\n",
    "1 1\n1 1\n",
    "6 7\n1 2\n2 3\n3 1\n4 5\n5 6\n6 4\n3 4\n",
    "4 4\n1 2\n2 1\n3 4\n4 3\n",
  ],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>g(n+1),rg(n+1);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);rg[v].push_back(u);}
vector<char>seen(n+1,0);vector<int>order;order.reserve(n);
for(int s=1;s<=n;++s){if(seen[s])continue;
vector<pair<int,int>>st;st.push_back({s,0});seen[s]=1;
while(!st.empty()){auto&[u,i]=st.back();
if(i<(int)g[u].size()){int v=g[u][i++];if(!seen[v]){seen[v]=1;st.push_back({v,0});}}
else{order.push_back(u);st.pop_back();}}}
vector<char>done(n+1,0);int comps=0;
for(int idx=n-1;idx>=0;--idx){int s=order[idx];if(done[s])continue;
++comps;vector<int>st{s};done[s]=1;
while(!st.empty()){int u=st.back();st.pop_back();
for(int v:rg[u])if(!done[v]){done[v]=1;st.push_back(v);}}}
cout<<comps<<"\\n";`,
  wrongNote: "Ignoring direction turns the question into plain connectivity, which merges components that only reach each other one way.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<char>seen(n+1,0);int comps=0;
for(int s=1;s<=n;++s){if(seen[s])continue;++comps;
vector<int>st{s};seen[s]=1;
while(!st.empty()){int u=st.back();st.pop_back();
for(int v:g[u])if(!seen[v]){seen[v]=1;st.push_back(v);}}}
cout<<comps<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C210", judge: "bridges-count", topic: "graphs", rating: 2400,
  tag: "Bridges", timeLimitMs: 2000,
  uz: "Ko'priklar soni",
  en: "Counting bridges",
  legendUz: "Ko'prik — bu shunday qirraki, uni olib tashlansa graf ko'proq bo'lakka bo'linib ketadi; ya'ni ikki uchini bog'lovchi boshqa yo'l yo'q. Chuqurlik bo'yicha aylanib chiqish har bir tugun uchun \"o'z pastki daraxtimdan orqaga qanchalik yuqoriga sakray olaman\" degan qiymatni hisoblaydi, va bola ota-onasidan yuqoriga sakray olmasa — orada ko'prik turibdi. Bitta tuzoq bor: ikki tugun orasida ikkita bir xil qirra bo'lsa, ularning hech biri ko'prik emas, shuning uchun ortga qaytish qirraning nomeri bo'yicha taqiqlanishi kerak, tugun bo'yicha emas.",
  legendEn: "A bridge is an edge whose removal breaks the graph into more pieces — that is, an edge whose two ends have no other route between them. A depth-first walk computes, for every vertex, how far back up it can jump from its own subtree, and when a child cannot jump above its parent there is a bridge between them. One trap: if two vertices are joined by two identical edges then neither is a bridge, so the walk must refuse to go back along the edge it arrived by, identified by its number rather than by the vertex it came from.",
  statementUz: "Sizga n ta tugun va m ta yo'naltirilmagan qirradan iborat graf berilgan. Grafda nechta ko'prik borligini aniqlang. Graf bog'langan bo'lishi shart emas va bir juft tugun orasida bir nechta qirra bo'lishi mumkin.",
  statementEn: "You are given an undirected graph with n vertices and m edges. Determine how many bridges it has. The graph need not be connected, and a pair of vertices may be joined by more than one edge.",
  inputUz: "Birinchi qatorda n va m butun sonlari. Keyingi m qatorning har birida u va v sonlari keladi — u va v ni bog'lovchi qirra. O'z-o'ziga bog'lovchi qirralar berilmaydi.",
  inputEn: "The first line contains the integers n and m. Each of the next m lines contains two integers u and v — an edge joining u and v. No edge joins a vertex to itself.",
  outputUz: "Yagona butun son — ko'priklar sonini chiqaring.",
  outputEn: "Print a single integer — the number of bridges.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ m ≤ 4·10^5", "1 ≤ u, v ≤ n and u ≠ v", "several edges may join the same pair of vertices"],
  sampleInputs: ["4 4\n1 2\n2 3\n3 1\n3 4\n", "2 2\n1 2\n1 2\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "1, 2, 3 uchburchagi ichidagi hech bir qirra ko'prik emas — har birini olib tashlasak ham qolgan ikkitasi orqali aylanib o'tsa bo'ladi. 3–4 qirrasi esa 4-tugunning yagona bog'lanishi, uni olib tashlash grafni ikkiga bo'ladi. Demak, javob 1.",
    "Ikki tugun ikkita alohida qirra bilan bog'langan. Bittasini olib tashlasak, ikkinchisi hamon ularni bog'lab turadi, shuning uchun ko'prik yo'q. Ortga qaytishni tugun nomi bo'yicha taqiqlagan yechim ikkinchi qirrani ko'rmaydi va bu yerda 2 deb javob beradi.",
  ],
  sampleNotesEn: [
    "No edge inside the triangle 1–2–3 is a bridge: remove any one of them and the other two still route around it. The edge 3–4 is vertex 4's only connection, and removing it splits the graph in two. So the answer is 1.",
    "Two vertices joined by two separate edges. Remove either one and the other still connects them, so there is no bridge. A solution that refuses to go back by vertex name never sees the second edge and answers 2 here.",
  ],
  testInputs: [
    "4 4\n1 2\n2 3\n3 1\n3 4\n",
    "2 2\n1 2\n1 2\n",
    "3 2\n1 2\n2 3\n",
    "1 0\n",
    "6 6\n1 2\n2 3\n3 1\n4 5\n5 6\n6 4\n",
    "5 4\n1 2\n2 3\n3 4\n4 5\n",
  ],
  sol: `int n,m;cin>>n>>m;
vector<vector<pair<int,int>>>g(n+1);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back({v,i});g[v].push_back({u,i});}
vector<int>tin(n+1,-1),low(n+1,0);int timer=0,bridges=0;
for(int s=1;s<=n;++s){if(tin[s]>=0)continue;
vector<array<int,3>>st;st.push_back({s,-1,0});tin[s]=low[s]=timer++;
while(!st.empty()){auto&fr=st.back();int u=fr[0];
if(fr[2]<(int)g[u].size()){auto[v,id]=g[u][fr[2]++];
if(id==fr[1])continue;
if(tin[v]>=0){low[u]=min(low[u],tin[v]);}
else{tin[v]=low[v]=timer++;st.push_back({v,id,0});}}
else{st.pop_back();
if(!st.empty()){int p=st.back()[0];low[p]=min(low[p],low[u]);
if(low[u]>tin[p])++bridges;}}}}
cout<<bridges<<"\\n";`,
  wrongNote: "Refusing to revisit the parent VERTEX rather than the parent EDGE makes a doubled edge invisible, so every doubled edge is reported as a bridge.",
  wrong: [
    `int n,m;cin>>n>>m;
vector<vector<pair<int,int>>>g(n+1);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back({v,i});g[v].push_back({u,i});}
vector<int>tin(n+1,-1),low(n+1,0);int timer=0,bridges=0;
for(int s=1;s<=n;++s){if(tin[s]>=0)continue;
vector<array<int,3>>st;st.push_back({s,0,0});tin[s]=low[s]=timer++;
while(!st.empty()){auto&fr=st.back();int u=fr[0];
if(fr[2]<(int)g[u].size()){auto[v,id]=g[u][fr[2]++];
if(v==fr[1])continue;
if(tin[v]>=0){low[u]=min(low[u],tin[v]);}
else{tin[v]=low[v]=timer++;st.push_back({v,u,0});}}
else{st.pop_back();
if(!st.empty()){int p=st.back()[0];low[p]=min(low[p],low[u]);
if(low[u]>tin[p])++bridges;}}}}
cout<<bridges<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2400 */
P.push({
  id: "C211", judge: "articulation-count", topic: "graphs", rating: 2400,
  tag: "Articulation points", timeLimitMs: 2000,
  uz: "Ajratuvchi tugunlar soni",
  en: "Counting articulation points",
  legendUz: "Ko'prik qirra edi, ajratuvchi tugun esa — tugun: uni (va unga tegishli barcha qirralarni) olib tashlansa graf ko'proq bo'lakka bo'linadi. Qoida deyarli ko'prikdagi bilan bir xil, faqat qat'iy tengsizlik tenglikka bo'shashadi. Ildiz esa alohida holat: u faqat chuqurlik daraxtida ikkitadan kam bo'lmagan bolasi bo'lgandagina ajratuvchi bo'ladi, chunki bitta bolali ildizni olib tashlash hech narsani ajratmaydi.",
  legendEn: "A bridge was an edge; an articulation point is a vertex — remove it, along with all its edges, and the graph falls into more pieces. The rule is almost the same as for bridges, with the strict inequality relaxed to a non-strict one. The root is the exception: it is an articulation point only when it has at least two children in the depth-first tree, because removing a root with one child separates nothing.",
  statementUz: "Sizga n ta tugun va m ta yo'naltirilmagan qirradan iborat graf berilgan. Nechta tugun ajratuvchi ekanini aniqlang. Tugun ajratuvchi deyiladi, agar uni va unga ulangan barcha qirralarni olib tashlash grafdagi bog'langan komponentalar sonini oshirsa.",
  statementEn: "You are given an undirected graph with n vertices and m edges. Determine how many of its vertices are articulation points. A vertex is an articulation point when removing it, together with every edge touching it, increases the number of connected components in the graph.",
  inputUz: "Birinchi qatorda n va m butun sonlari. Keyingi m qatorning har birida u va v sonlari keladi — u va v ni bog'lovchi qirra. O'z-o'ziga bog'lovchi qirralar berilmaydi.",
  inputEn: "The first line contains the integers n and m. Each of the next m lines contains two integers u and v — an edge joining u and v. No edge joins a vertex to itself.",
  outputUz: "Yagona butun son — ajratuvchi tugunlar sonini chiqaring.",
  outputEn: "Print a single integer — the number of articulation points.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ m ≤ 4·10^5", "1 ≤ u, v ≤ n and u ≠ v", "the graph need not be connected"],
  sampleInputs: ["3 2\n1 2\n2 3\n", "3 3\n1 2\n2 3\n3 1\n"],
  expect: ["1\n", "0\n"],
  sampleNotesUz: [
    "Bu — uchta tugunli yo'l. 2-tugunni olib tashlasak, 1 va 3 bir-biridan uziladi, shuning uchun u ajratuvchi. 1-tugunni olib tashlasak esa 2–3 bog'lanib qolaveradi, ya'ni chetdagi tugunlar hech qachon ajratuvchi bo'lmaydi. Javob 1.",
    "Uchburchakda har bir tugunni olib tashlasak, qolgan ikkitasi hamon qirra bilan bog'langan. Demak, ajratuvchi tugun umuman yo'q va javob 0.",
  ],
  sampleNotesEn: [
    "This is a path of three vertices. Removing vertex 2 disconnects 1 from 3, so it is an articulation point. Removing vertex 1 leaves 2–3 connected, which is why an endpoint never is one. The answer is 1.",
    "In a triangle, removing any vertex leaves the other two joined by an edge. So there is no articulation point at all and the answer is 0.",
  ],
  testInputs: [
    "3 2\n1 2\n2 3\n",
    "3 3\n1 2\n2 3\n3 1\n",
    "1 0\n",
    "5 4\n1 2\n2 3\n3 4\n4 5\n",
    "7 7\n1 2\n2 3\n3 1\n3 4\n4 5\n5 6\n6 4\n",
    "4 2\n1 2\n3 4\n",
  ],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>tin(n+1,-1),low(n+1,0);vector<char>cut(n+1,0);int timer=0;
for(int s=1;s<=n;++s){if(tin[s]>=0)continue;int rootKids=0;
vector<array<int,3>>st;st.push_back({s,-1,0});tin[s]=low[s]=timer++;
while(!st.empty()){auto&fr=st.back();int u=fr[0];
if(fr[2]<(int)g[u].size()){int v=g[u][fr[2]++];
if(v==fr[1])continue;
if(tin[v]>=0)low[u]=min(low[u],tin[v]);
else{tin[v]=low[v]=timer++;st.push_back({v,u,0});if(u==s)++rootKids;}}
else{st.pop_back();
if(!st.empty()){int p=st.back()[0];low[p]=min(low[p],low[u]);
if(p!=s&&low[u]>=tin[p])cut[p]=1;}}}
if(rootKids>=2)cut[s]=1;}
int total=0;for(int v=1;v<=n;++v)total+=cut[v];
cout<<total<<"\\n";`,
  wrongNote: "Applying the child rule to the root as well: the endpoint of a path has one child whose low value equals the root's discovery time, so it gets flagged.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>tin(n+1,-1),low(n+1,0);vector<char>cut(n+1,0);int timer=0;
for(int s=1;s<=n;++s){if(tin[s]>=0)continue;
vector<array<int,3>>st;st.push_back({s,-1,0});tin[s]=low[s]=timer++;
while(!st.empty()){auto&fr=st.back();int u=fr[0];
if(fr[2]<(int)g[u].size()){int v=g[u][fr[2]++];
if(v==fr[1])continue;
if(tin[v]>=0)low[u]=min(low[u],tin[v]);
else{tin[v]=low[v]=timer++;st.push_back({v,u,0});}}
else{st.pop_back();
if(!st.empty()){int p=st.back()[0];low[p]=min(low[p],low[u]);
if(low[u]>=tin[p])cut[p]=1;}}}}
int total=0;for(int v=1;v<=n;++v)total+=cut[v];
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2000 */
P.push({
  id: "C212", judge: "zero-one-bfs", topic: "graphs", rating: 2000,
  tag: "0-1 BFS", timeLimitMs: 2000,
  uz: "Nol va bir vaznli eng qisqa yo'l",
  en: "Shortest path with 0 and 1 weights",
  legendUz: "Vaznlar faqat 0 va 1 bo'lsa, Dijkstra ortiqcha: ustuvor navbat o'rniga oddiy deque yetadi. Vazni 0 bo'lgan qirra bo'ylab yurganda tugun deque ning boshiga, vazni 1 bo'lgani bo'ylab yurganda oxiriga qo'yiladi. Shunda deque hech qachon ikkitadan ortiq turli masofani saqlamaydi va u tartiblangan bo'lib qolaveradi — natijada logarifm yo'qoladi.",
  legendEn: "When the weights are only 0 and 1, Dijkstra is more machinery than the problem needs: a plain deque replaces the priority queue. Crossing an edge of weight 0 puts the vertex at the front of the deque, crossing one of weight 1 puts it at the back. The deque then never holds more than two distinct distances and stays sorted by itself — and the logarithm disappears.",
  statementUz: "Sizga n ta tugun va m ta yo'naltirilmagan qirradan iborat graf berilgan; har bir qirraning vazni 0 yoki 1. 1-tugundan n-tugungacha bo'lgan yo'lning eng kichik umumiy vaznini toping.",
  statementEn: "You are given an undirected graph with n vertices and m edges, where every edge has weight 0 or 1. Find the smallest total weight of a path from vertex 1 to vertex n.",
  inputUz: "Birinchi qatorda n va m butun sonlari. Keyingi m qatorning har birida u, v va w sonlari keladi — vazni w bo'lgan u va v orasidagi qirra, bunda w 0 yoki 1 ga teng.",
  inputEn: "The first line contains the integers n and m. Each of the next m lines contains three integers u, v and w — an edge between u and v of weight w, where w is either 0 or 1.",
  outputUz: "Yagona butun son — eng kichik umumiy vaznni chiqaring. Agar n-tugunga umuman yetib bo'lmasa, -1 chiqaring.",
  outputEn: "Print a single integer — the smallest total weight. If vertex n cannot be reached at all, print -1 instead.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ m ≤ 4·10^5", "1 ≤ u, v ≤ n", "w is 0 or 1", "if n = 1 the answer is 0"],
  sampleInputs: ["4 4\n1 2 0\n2 3 1\n1 3 1\n3 4 0\n", "3 1\n1 2 1\n"],
  expect: ["1\n", "-1\n"],
  sampleNotesUz: [
    "1→2 bepul, 2→3 bitta turadi, 3→4 yana bepul: jami 1. To'g'ridan-to'g'ri 1→3→4 yo'li ham aynan 1 turadi, shuning uchun ikkalasi ham optimal. Vaznlarni e'tiborsiz qoldirib oddiy BFS ishlatgan yechim eng kam qirrali yo'lni tanlaydi va bu yerda boshqacha javob berishi mumkin.",
    "3-tugunga birorta ham qirra ulanmagan, shuning uchun unga yetib bo'lmaydi va javob -1. Yetib bo'lmaydigan holat alohida tekshirilishi kerak, chunki masofa massivi cheksizlikda qolib ketadi.",
  ],
  sampleNotesEn: [
    "1→2 is free, 2→3 costs one, 3→4 is free again: one in total. The direct route 1→3→4 also costs exactly one, so both are optimal. A solution that ignores the weights and runs a plain BFS picks the path with the fewest edges, which need not be the cheapest one.",
    "No edge touches vertex 3, so it cannot be reached and the answer is -1. The unreachable case needs its own check, because the distance array simply stays at infinity.",
  ],
  testInputs: [
    "4 4\n1 2 0\n2 3 1\n1 3 1\n3 4 0\n",
    "3 1\n1 2 1\n",
    "1 0\n",
    "5 5\n1 2 1\n2 5 1\n1 3 0\n3 4 0\n4 5 1\n",
    "2 1\n1 2 0\n",
    "6 6\n1 2 1\n2 3 0\n3 6 1\n1 4 0\n4 5 0\n5 6 1\n",
  ],
  sol: `int n,m;cin>>n>>m;vector<vector<pair<int,int>>>g(n+1);
for(int i=0;i<m;++i){int u,v,w;cin>>u>>v>>w;g[u].push_back({v,w});g[v].push_back({u,w});}
const int INF=INT_MAX/2;vector<int>d(n+1,INF);d[1]=0;
deque<int>dq;dq.push_back(1);
while(!dq.empty()){int u=dq.front();dq.pop_front();
for(auto[v,w]:g[u])if(d[u]+w<d[v]){d[v]=d[u]+w;if(w)dq.push_back(v);else dq.push_front(v);}}
cout<<(d[n]>=INF?-1:d[n])<<"\\n";`,
  wrongNote: "A plain BFS finds the path with the fewest edges, which is not the cheapest one once edges are free.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<pair<int,int>>>g(n+1);
for(int i=0;i<m;++i){int u,v,w;cin>>u>>v>>w;g[u].push_back({v,w});g[v].push_back({u,w});}
const int INF=INT_MAX/2;vector<int>d(n+1,INF);d[1]=0;
queue<int>q;q.push(1);
while(!q.empty()){int u=q.front();q.pop();
for(auto[v,w]:g[u])if(d[v]>=INF){d[v]=d[u]+w;q.push(v);}}
cout<<(d[n]>=INF?-1:d[n])<<"\\n";`,
  ],
});

export default P;
