/* Batch 635 — ten problems, A635–A644, at 1000–1100.
 *
 * Written on 2026-10-22 to fill the band duels draw from most: 1000–1199 had
 * 1518 duel rounds from only 73 problems (20.8 rounds a problem, the highest of
 * any band), and foundations, sorting and strings are the topics with the most
 * rounds per problem. Every task is a well-known exercise restated for AlgoYo'l
 * in our own words, with our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };
const cell = (r) => "abcdefgh"[r.int(0, 7)] + r.int(1, 8);
const date = (r, lo, hi) => {
  const y = r.int(lo, hi), m = r.int(1, 12);
  const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const dim = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  return String(y).padStart(4, "0") + "-" + String(m).padStart(2, "0") + "-" + String(r.int(1, dim)).padStart(2, "0");
};
/* Days since 1970-01-01 in the proleptic Gregorian calendar (Hinnant's
   days_from_civil), as C++ the batch entries share. */
const CIVIL = `auto civil=[](long long y,long long m,long long d)->long long{y-=m<=2;long long era=(y>=0?y:y-399)/400;long long yoe=y-era*400;long long doy=(153*(m+(m>2?-3:9))+2)/5+d-1;long long doe=yoe*365+yoe/4-yoe/100+doy;return era*146097+doe-719468;};
auto parse=[&](const string&s)->long long{return civil(stoll(s.substr(0,4)),stoll(s.substr(5,2)),stoll(s.substr(8,2)));};`;

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A635", judge: "fnd-chessboard-same-colour", topic: "foundations", rating: 1000,
  tag: "Implementation", timeLimitMs: 1000,
  uz: "Bir xil rangdagi kataklar",
  en: "Squares of the same colour",
  statementUz: "Shaxmat taxtasi 8 × 8 katakdan iborat. Ustunlar chapdan o‘ngga a dan h gacha harflar bilan, qatorlar pastdan yuqoriga 1 dan 8 gacha raqamlar bilan belgilanadi, shuning uchun har bir katak «e4» kabi ikki belgi bilan yoziladi. a1 katagi qora, va qo‘shni (bir tomoni umumiy) kataklar doim turli rangda bo‘ladi. Har bir so‘rovda ikkita katak beriladi: ular bir xil rangdami?",
  statementEn: "A chessboard has 8 × 8 squares. Columns are labelled a to h from left to right and rows 1 to 8 from bottom to top, so every square is written with two characters such as \"e4\". The square a1 is dark, and two squares that share a side always have different colours. Each query names two squares: are they the same colour?",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida probel bilan ajratilgan ikkita katak keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains two squares separated by a space.",
  outputUz: "Har bir so‘rov uchun alohida qatorda YES (rangi bir xil) yoki NO chiqaring.",
  outputEn: "For each query print YES (same colour) or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "each square is a letter from a to h followed by a digit from 1 to 8", "the two squares may coincide"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "har bir katak a dan h gacha harf va 1 dan 8 gacha raqamdan iborat", "ikki katak bir xil bo‘lishi mumkin"],
  sampleInputs: ["4\na1 h8\na1 a2\nc3 e5\nb1 b8\n"],
  expect: ["YES\nNO\nYES\nNO\n"],
  sampleNotesUz: ["a1 va h8 ikkalasi qora — katta diagonalda yotadi. a1 va a2 qo‘shni, demak rangi turlicha. c3 va e5 bitta diagonalda. b1 oq, b8 esa qora."],
  sampleNotesEn: ["a1 and h8 are both dark — they lie on the long diagonal. a1 and a2 are neighbours, so their colours differ. c3 and e5 share a diagonal. b1 is light while b8 is dark."],
  testInputs: ["4\na1 h8\na1 a2\nc3 e5\nb1 b8\n", "1\nd4 d4\n", "3\nh1 a8\na8 b8\ng2 b7\n", "4\na1 c1\na1 b1\nb2 b4\ne1 e2\n", "2\nf6 c3\nh2 a1\n"],
  sol: `int t;cin>>t;while(t--){string a,b;cin>>a>>b;int x=(a[0]-'a'+a[1]-'1')%2,y=(b[0]-'a'+b[1]-'1')%2;cout<<(x==y?"YES":"NO")<<"\\n";}`,
  wrongNote: "Comparing only the columns, or only the rows, treats a whole column as one colour; a chessboard alternates in both directions.",
  wrong: [
    `int t;cin>>t;while(t--){string a,b;cin>>a>>b;cout<<((a[0]-b[0])%2==0?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){string a,b;cin>>a>>b;cout<<((a[1]-b[1])%2==0?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 5, (r) => cell(r) + " " + cell(r) + "\n"),
  brute: `char col[8][8];for(int i=0;i<8;++i)for(int j=0;j<8;++j)col[i][j]=0;col[0][0]='D';
for(int i=0;i<8;++i)for(int j=0;j<8;++j){if(i==0&&j==0)continue;char nb=j>0?col[i][j-1]:col[i-1][j];col[i][j]=nb=='D'?'L':'D';}
int t;cin>>t;while(t--){string a,b;cin>>a>>b;cout<<(col[a[0]-'a'][a[1]-'1']==col[b[0]-'a'][b[1]-'1']?"YES":"NO")<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 random queries", code: `L = "abcdefgh"\nq = [L[r.int(0,7)] + str(r.int(1,8)) + " " + L[r.int(0,7)] + str(r.int(1,8)) for _ in range(10000)]\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

P.push({
  id: "A636", judge: "sort-closest-k-for-a-team", topic: "sorting", rating: 1000,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Eng teng jamoa",
  en: "The most even team",
  statementUz: "Murabbiyda m ta o‘quvchi bor, i-o‘quvchining reytingi a_i ga teng. U olimpiadaga aynan k nafar o‘quvchidan iborat jamoa yubormoqchi va jamoa imkon qadar teng kuchli bo‘lishini istaydi: jamoadagi eng kuchli va eng kuchsiz o‘quvchilar reytinglari ayirmasi eng kichik bo‘lsin. Shu ayirmaning eng kichik qiymatini toping.",
  statementEn: "A coach has m students, and student i has rating a_i. The coach wants to send a team of exactly k students to an olympiad and wants it as even as possible: the difference between the strongest and the weakest member's ratings should be as small as possible. Find the smallest possible value of that difference.",
  inputUz: "Birinchi qatorda k va m beriladi. Ikkinchi qatorda m ta son a_1, …, a_m keladi.",
  inputEn: "The first line contains k and m. The second line contains the m numbers a_1, …, a_m.",
  outputUz: "Yagona sonni chiqaring — eng kichik ayirma.",
  outputEn: "Print a single number — the smallest difference.",
  constraintList: ["1 ≤ k ≤ m ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "ratings may repeat"],
  constraintListUz: ["1 ≤ k ≤ m ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "reytinglar takrorlanishi mumkin"],
  sampleInputs: ["4 6\n10 12 10 7 5 22\n", "1 3\n5 9 1\n"],
  expect: ["5\n", "0\n"],
  sampleNotesUz: ["Reytingi 7, 10, 10, 12 bo‘lgan to‘rt o‘quvchini olsak, ayirma 12 − 7 = 5 bo‘ladi; undan kichigini olib bo‘lmaydi. Ikkinchi namunada jamoa bitta o‘quvchidan iborat, ayirma 0."],
  sampleNotesEn: ["Taking the four students rated 7, 10, 10 and 12 gives 12 − 7 = 5, and nothing smaller is possible. In the second sample the team is one student, so the difference is 0."],
  testInputs: ["4 6\n10 12 10 7 5 22\n", "1 3\n5 9 1\n", "3 5\n1 10 11 12 50\n", "2 4\n1 9 2 10\n", "3 3\n1 100 50\n", "2 5\n1 3 6 10 15\n", "3 7\n100 1 2 3 99 98 50\n", "2 4\n7 7 7 7\n"],
  sol: `int k,m;cin>>k>>m;vector<long long>a(m);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long best=LLONG_MAX;for(int i=0;i+k<=m;++i)best=min(best,a[i+k-1]-a[i]);cout<<best<<"\\n";`,
  wrongNote: "Taking the k smallest ratings is one team, not the most even one; the best window can sit anywhere in the sorted order.",
  wrong: [
    `int k,m;cin>>k>>m;vector<long long>a(m);for(auto&x:a)cin>>x;sort(a.begin(),a.end());cout<<a[k-1]-a[0]<<"\\n";`,
    `int k,m;cin>>k>>m;vector<long long>a(m);for(auto&x:a)cin>>x;long long best=LLONG_MAX;for(int i=0;i+k<=m;++i){long long lo=*min_element(a.begin()+i,a.begin()+i+k),hi=*max_element(a.begin()+i,a.begin()+i+k);best=min(best,hi-lo);}cout<<best<<"\\n";`,
  ],
  gen: (r) => { const m = r.int(1, 8), k = r.int(1, m); return k + " " + m + "\n" + line(r.ints(m, 1, 20)) + "\n"; },
  brute: `int k,m;cin>>k>>m;vector<long long>a(m);for(auto&x:a)cin>>x;long long best=LLONG_MAX;for(int s=0;s<(1<<m);++s){if(__builtin_popcount(s)!=k)continue;long long lo=LLONG_MAX,hi=LLONG_MIN;for(int i=0;i<m;++i)if(s>>i&1){lo=min(lo,a[i]);hi=max(hi,a[i]);}best=min(best,hi-lo);}cout<<best<<"\\n";`,
  big: [
    { seed: 1, note: "m = 2·10^5 random ratings, k in the middle", code: `m = 200000\nreturn "100000 " + str(m) + "\\n" + line(r.ints(m, 1, 10**9))` },
    { seed: 2, note: "m = 2·10^5, small k", code: `m = 200000\nreturn "7 " + str(m) + "\\n" + line(r.ints(m, 1, 10**9))` },
  ],
});

P.push({
  id: "A637", judge: "str-abbreviate-long-words", topic: "strings", rating: 1000,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Uzun so‘zlarni qisqartirish",
  en: "Abbreviating long words",
  statementUz: "Matnda ba'zi so‘zlar juda uzun, ularni har safar to‘liq yozish noqulay. Uzunligi 10 dan katta bo‘lgan har bir so‘z quyidagicha qisqartiriladi: birinchi harfi, keyin birinchi va oxirgi harflar orasidagi harflar soni (o‘nlik sanoq tizimida, bosh nollarsiz), so‘ng oxirgi harfi yoziladi. Masalan, «localization» so‘zi «l10n» bo‘ladi. Uzunligi 10 yoki undan kichik so‘zlar o‘zgarmaydi. Har bir so‘zni kerak bo‘lsa qisqartirib chiqaring.",
  statementEn: "Some words in a text are very long and tiresome to write out in full. Every word longer than 10 letters is abbreviated as follows: its first letter, then the number of letters between the first and the last (in decimal, without leading zeros), then its last letter. For example, \"localization\" becomes \"l10n\". Words of length 10 or less stay as they are. Print every word, abbreviated where required.",
  inputUz: "Birinchi qatorda so‘zlar soni n beriladi. Keyingi n ta qatorning har birida kichik lotin harflaridan iborat bitta so‘z keladi.",
  inputEn: "The first line contains the number of words n. Each of the next n lines contains one word of lowercase Latin letters.",
  outputUz: "n ta qator chiqaring: har bir so‘z kirishdagi tartibda, kerak bo‘lsa qisqartirilgan holda.",
  outputEn: "Print n lines: the words in the input order, each abbreviated where required.",
  constraintList: ["1 ≤ n ≤ 10^4", "every word has 1 to 100 letters", "a word of exactly 10 letters is not abbreviated"],
  constraintListUz: ["1 ≤ n ≤ 10^4", "har bir so‘z 1 dan 100 gacha harfdan iborat", "aynan 10 harfli so‘z qisqartirilmaydi"],
  sampleInputs: ["4\nword\nlocalization\ninternationalization\npneumonoultramicroscopicsilicovolcanoconiosis\n"],
  expect: ["word\nl10n\ni18n\np43s\n"],
  sampleNotesUz: ["«word» qisqa, o‘zgarmaydi. «internationalization» 20 harfli: birinchi va oxirgi harfi orasida 18 ta harf bor, shuning uchun «i18n»."],
  sampleNotesEn: ["\"word\" is short and stays as it is. \"internationalization\" has 20 letters: 18 of them lie between the first and the last, hence \"i18n\"."],
  testInputs: ["4\nword\nlocalization\ninternationalization\npneumonoultramicroscopicsilicovolcanoconiosis\n", "3\nabcdefghij\nabcdefghijk\na\n", "2\nzz\nabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuv\n", "1\nqwertyuiopa\n"],
  sol: `int n;cin>>n;while(n--){string w;cin>>w;if(w.size()>10)cout<<w[0]<<w.size()-2<<w.back()<<"\\n";else cout<<w<<"\\n";}`,
  wrongNote: "Abbreviating a word of exactly ten letters breaks the rule's boundary, and counting all the letters instead of the ones in between is off by two.",
  wrong: [
    `int n;cin>>n;while(n--){string w;cin>>w;if(w.size()>=10)cout<<w[0]<<w.size()-2<<w.back()<<"\\n";else cout<<w<<"\\n";}`,
    `int n;cin>>n;while(n--){string w;cin>>w;if(w.size()>10)cout<<w[0]<<w.size()<<w.back()<<"\\n";else cout<<w<<"\\n";}`,
  ],
  gen: (r) => { const n = r.int(1, 5); let s = n + "\n"; for (let i = 0; i < n; i++) s += r.str(r.int(1, 14), "abc") + "\n"; return s; },
  brute: `int n;cin>>n;while(n--){string w;cin>>w;int len=0;for(char c:w){(void)c;len++;}if(len<=10){cout<<w<<"\\n";continue;}string mid=to_string(len-2);cout<<w.substr(0,1)+mid+w.substr(len-1,1)<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 words of every length up to 100", code: `ws = [text(r, r.int(1, 100), "abcdefghijklmnopqrstuvwxyz") for _ in range(10000)]\nreturn "10000\\n" + "\\n".join(ws)` },
  ],
});

P.push({
  id: "A638", judge: "str-pangram-check", topic: "strings", rating: 1000,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Barcha harflar bormi",
  en: "Every letter present",
  statementUz: "Ingliz alifbosining 26 ta harfining har biri kamida bir marta uchraydigan satr pangramma deyiladi; katta va kichik harflar farqlanmaydi, ya'ni «A» ham, «a» ham bitta harf hisoblanadi. Masalan, «TheQuickBrownFoxJumpsOverTheLazyDog» — pangramma. Har bir test uchun berilgan satr pangramma ekanini aniqlang.",
  statementEn: "A string in which each of the 26 letters of the English alphabet appears at least once is called a pangram; uppercase and lowercase are not distinguished, so \"A\" and \"a\" count as the same letter. For example, \"TheQuickBrownFoxJumpsOverTheLazyDog\" is a pangram. For every test case decide whether the given string is a pangram.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida katta va kichik lotin harflaridan iborat n uzunlikdagi satr.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second a string of n uppercase and lowercase Latin letters.",
  outputUz: "Har bir test uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each test case print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "the string has only letters"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "satrda faqat harflar bor"],
  sampleInputs: ["3\n35\nTheQuickBrownFoxJumpsOverTheLazyDog\n12\ntoosmallword\n26\nabcdefghijklmNOPQRSTUVWXYZ\n"],
  expect: ["YES\nNO\nYES\n"],
  sampleNotesUz: ["Ikkinchi satrda masalan «b» harfi yo‘q. Uchinchi satrning yarmi katta harflarda, lekin harflar farqlanmagani uchun hammasi bor."],
  sampleNotesEn: ["The second string lacks, for example, the letter \"b\". Half of the third string is uppercase, but since case does not matter every letter is there."],
  testInputs: ["3\n35\nTheQuickBrownFoxJumpsOverTheLazyDog\n12\ntoosmallword\n26\nabcdefghijklmNOPQRSTUVWXYZ\n", "1\n26\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n", "1\n25\nabcdefghijklmnopqrstuvwxy\n", "1\n30\nabcdefghijklmnopqrstuvwxyyyyyy\n", "2\n1\na\n52\naAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ\n"],
  sol: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;bool seen[26]={};for(char c:s)seen[tolower(c)-'a']=true;bool ok=true;for(bool b:seen)ok=ok&&b;cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Counting only lowercase letters misses an alphabet written in capitals; the statement says case does not matter.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;bool seen[26]={};for(char c:s)if(c>='a'&&c<='z')seen[c-'a']=true;bool ok=true;for(bool b:seen)ok=ok&&b;cout<<(ok?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;cout<<(n>=26?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(20, 40); return n + "\n" + r.str(n, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;bool ok=true;for(char L='a';L<='z';++L){bool f=false;for(char c:s)if(c==L||c==L-'a'+'A')f=true;if(!f)ok=false;}cout<<(ok?"YES":"NO")<<"\\n";}`,
  big: [
    { seed: 1, note: "one long string missing a single letter", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY")` },
    { seed: 2, note: "many short strings", code: `out = []\nfor _ in range(5000):\n    out.append("40")\n    out.append(text(r, 40, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"))\nreturn "5000\\n" + "\\n".join(out)` },
  ],
});

/* ------------------------------------------------------------------ 1100 */
P.push({
  id: "A639", judge: "fnd-snake-fill-grid", topic: "foundations", rating: 1100,
  tag: "Matrices", timeLimitMs: 1000,
  uz: "Ilon izi bo‘yicha to‘ldirish",
  en: "Filling along a snake",
  statementUz: "n qator va m ustundan iborat jadvalni 1 dan n · m gacha bo‘lgan sonlar bilan «ilon izi» bo‘yicha to‘ldiring. Birinchi qator chapdan o‘ngga 1, 2, …, m bilan to‘ldiriladi, ikkinchi qator o‘ngdan chapga davom etadi, uchinchisi yana chapdan o‘ngga, va hokazo: har bir qator oldingi qator tugagan tomondan boshlanadi. Hosil bo‘lgan jadvalni chiqaring.",
  statementEn: "Fill a table of n rows and m columns with the numbers 1 to n · m along a \"snake\". The first row is filled from left to right with 1, 2, …, m, the second row continues from right to left, the third goes left to right again, and so on: each row starts on the side where the previous one ended. Print the resulting table.",
  inputUz: "Yagona qatorda n va m beriladi.",
  inputEn: "The only line contains n and m.",
  outputUz: "n ta qator chiqaring, har birida probel bilan ajratilgan m ta son.",
  outputEn: "Print n lines, each with m numbers separated by spaces.",
  constraintList: ["1 ≤ n, m ≤ 300", "row 1 goes left to right", "rows alternate direction"],
  constraintListUz: ["1 ≤ n, m ≤ 300", "1-qator chapdan o‘ngga", "qatorlar navbatma-navbat yo‘nalish almashtiradi"],
  sampleInputs: ["3 4\n", "1 5\n"],
  expect: ["1 2 3 4\n8 7 6 5\n9 10 11 12\n", "1 2 3 4 5\n"],
  sampleNotesUz: ["Birinchi qator 1 dan 4 gacha, ikkinchisi 5 dan 8 gacha teskari tartibda yoziladi, uchinchisi yana chapdan boshlanadi."],
  sampleNotesEn: ["Row one holds 1 to 4, row two holds 5 to 8 written backwards, and row three starts on the left again."],
  testInputs: ["3 4\n", "1 5\n", "4 1\n", "2 2\n", "5 3\n", "1 1\n"],
  sol: `int n,m;cin>>n>>m;for(int i=0;i<n;++i){for(int j=0;j<m;++j){int c=(i%2==0)?j:m-1-j;cout<<(long long)i*m+c+1<<(j+1<m?' ':'\\n');}}`,
  wrongNote: "Filling every row left to right forgets the turn at the end of each row; reversing the odd-numbered rows instead of the even ones starts the snake on the wrong side.",
  wrong: [
    `int n,m;cin>>n>>m;for(int i=0;i<n;++i){for(int j=0;j<m;++j)cout<<(long long)i*m+j+1<<(j+1<m?' ':'\\n');}`,
    `int n,m;cin>>n>>m;for(int i=0;i<n;++i){for(int j=0;j<m;++j){int c=(i%2==1)?j:m-1-j;cout<<(long long)i*m+c+1<<(j+1<m?' ':'\\n');}}`,
  ],
  gen: (r) => r.int(1, 6) + " " + r.int(1, 6) + "\n",
  brute: `int n,m;cin>>n>>m;vector<vector<int>>g(n,vector<int>(m,0));int r=0,c=0,d=1;for(int v=1;v<=n*m;++v){g[r][c]=v;int nc=c+d;if(nc<0||nc>=m){r++;d=-d;}else c=nc;}
for(int i=0;i<n;++i){for(int j=0;j<m;++j)cout<<g[i][j]<<(j+1<m?' ':'\\n');}`,
  big: [
    { seed: 1, note: "the largest table", code: `return "300 300"` },
  ],
});

P.push({
  id: "A640", judge: "fnd-clock-hands-angle", topic: "foundations", rating: 1100,
  tag: "Implementation", timeLimitMs: 1000,
  uz: "Soat millari orasidagi burchak",
  en: "The angle between the clock hands",
  statementUz: "Oddiy aylana siferblatli soatda vaqt HH:MM ko‘rinishida, 24 soatlik formatda berilgan. Minut mili har daqiqada 6 gradusga buriladi. Soat mili 12 soatda to‘liq aylanadi va bir tekis harakatlanadi: har soatda 30 gradus, har daqiqada esa 0.5 gradus. Shu paytda ikki mil orasidagi kichik burchakni (0 dan 180 gacha) gradusda toping.",
  statementEn: "A clock with an ordinary round face shows the time HH:MM in 24-hour format. The minute hand turns 6 degrees every minute. The hour hand makes a full turn in 12 hours and moves smoothly: 30 degrees an hour, which is 0.5 degrees a minute. Find the smaller angle between the two hands at that moment, in degrees (from 0 to 180).",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida HH:MM ko‘rinishidagi vaqt keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains a time in the form HH:MM.",
  outputUz: "Har bir so‘rov uchun alohida qatorda burchakni chiqaring: butun bo‘lsa butun son, aks holda «.5» bilan (masalan, 7.5).",
  outputEn: "For each query print the angle on its own line: as an integer when it is whole, otherwise with \".5\" (for example, 7.5).",
  constraintList: ["1 ≤ t ≤ 10^4", "00 ≤ HH ≤ 23, 00 ≤ MM ≤ 59", "the answer is always a multiple of 0.5"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "00 ≤ HH ≤ 23, 00 ≤ MM ≤ 59", "javob doim 0.5 ga karrali"],
  sampleInputs: ["4\n03:00\n12:30\n09:45\n23:59\n"],
  expect: ["90\n165\n22.5\n5.5\n"],
  sampleNotesUz: ["12:30 da minut mili 180 gradusda, soat mili esa 15 gradusda: farq 165. 09:45 da minut mili 270, soat mili 292.5 gradusda: farq 22.5."],
  sampleNotesEn: ["At 12:30 the minute hand is at 180 degrees and the hour hand at 15: they differ by 165. At 09:45 the minute hand is at 270 and the hour hand at 292.5: the difference is 22.5."],
  testInputs: ["4\n03:00\n12:30\n09:45\n23:59\n", "1\n00:00\n", "3\n06:00\n18:00\n15:00\n", "4\n13:05\n01:05\n21:33\n11:59\n", "2\n12:00\n00:01\n"],
  sol: `int t;cin>>t;while(t--){string s;cin>>s;int h=stoi(s.substr(0,2))%12,m=stoi(s.substr(3,2));int a=abs(60*h+m-12*m);a=min(a,720-a);cout<<a/2;if(a%2)cout<<".5";cout<<"\\n";}`,
  wrongNote: "Leaving the hour at 13–23 instead of reducing it modulo 12 throws the hour hand past a full turn; ignoring the hour hand's drift within the hour treats it as stuck on the hour mark.",
  wrong: [
    `int t;cin>>t;while(t--){string s;cin>>s;int h=stoi(s.substr(0,2)),m=stoi(s.substr(3,2));int a=abs(60*h+m-12*m);a=min(a,720-a);cout<<a/2;if(a%2)cout<<".5";cout<<"\\n";}`,
    `int t;cin>>t;while(t--){string s;cin>>s;int h=stoi(s.substr(0,2))%12,m=stoi(s.substr(3,2));int a=abs(60*h-12*m);a=min(a,720-a);cout<<a/2;if(a%2)cout<<".5";cout<<"\\n";}`,
  ],
  gen: (r) => tests(r, 5, (r) => String(r.int(0, 23)).padStart(2, "0") + ":" + String(r.int(0, 59)).padStart(2, "0") + "\n"),
  brute: `int t;cin>>t;while(t--){string s;cin>>s;int H=stoi(s.substr(0,2)),M=stoi(s.substr(3,2));double hour=fmod(H*30.0+M*0.5,360.0),minute=M*6.0;double d=fabs(hour-minute);if(d>180)d=360-d;long long x=llround(d*2);if(x%2==0)cout<<x/2<<"\\n";else cout<<x/2<<".5\\n";}`,
  big: [
    { seed: 1, note: "10^4 random times", code: `q = ["%02d:%02d" % (r.int(0, 23), r.int(0, 59)) for _ in range(10000)]\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

P.push({
  id: "A641", judge: "fnd-days-between-dates", topic: "foundations", rating: 1100,
  tag: "Dates", timeLimitMs: 1000,
  uz: "Ikki sana orasidagi kunlar",
  en: "Days between two dates",
  statementUz: "Ikkita sana YYYY-MM-DD ko‘rinishida berilgan. Ular orasida necha kun borligini toping, ya'ni birinchi sanadan ikkinchisiga o‘tish uchun kun necha marta almashadi; tartib muhim emas. Grigorian taqvimi ishlatiladi: yil 4 ga bo‘linsa kabisa, lekin 100 ga bo‘linib 400 ga bo‘linmasa kabisa emas. Kabisa yilida fevral 29 kun, aks holda 28 kun.",
  statementEn: "Two dates are given in the form YYYY-MM-DD. Find how many days lie between them, that is, how many times the day changes on the way from the first date to the second; their order does not matter. The Gregorian calendar is used: a year divisible by 4 is a leap year, except that a year divisible by 100 but not by 400 is not. February has 29 days in a leap year and 28 otherwise.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida probel bilan ajratilgan ikkita sana keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains two dates separated by a space.",
  outputUz: "Har bir so‘rov uchun alohida qatorda kunlar sonini chiqaring.",
  outputEn: "For each query print the number of days on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "every date is valid, with a year from 1 to 9999", "the second date may come before the first"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "har bir sana to‘g‘ri, yili 1 dan 9999 gacha", "ikkinchi sana birinchisidan oldin kelishi mumkin"],
  sampleInputs: ["4\n2026-10-22 2026-10-24\n2024-02-28 2024-03-01\n1900-02-28 1900-03-01\n2000-01-01 1999-12-31\n"],
  expect: ["2\n2\n1\n1\n"],
  sampleNotesUz: ["2024 — kabisa yil, shuning uchun 28-fevral va 1-mart orasida 29-fevral bor. 1900 100 ga bo‘linadi, lekin 400 ga bo‘linmaydi — kabisa emas, demak orada faqat bitta kun."],
  sampleNotesEn: ["2024 is a leap year, so February 29 lies between February 28 and March 1. 1900 is divisible by 100 but not by 400, so it is not a leap year and only one day separates the dates."],
  testInputs: ["4\n2026-10-22 2026-10-24\n2024-02-28 2024-03-01\n1900-02-28 1900-03-01\n2000-01-01 1999-12-31\n", "1\n0001-01-01 9999-12-31\n", "2\n2000-02-28 2000-03-01\n2100-02-28 2100-03-01\n", "3\n1970-01-01 1970-01-01\n2026-01-01 2025-01-01\n1600-12-31 1601-01-01\n"],
  sol: CIVIL + `int t;cin>>t;while(t--){string a,b;cin>>a>>b;cout<<llabs(parse(a)-parse(b))<<"\\n";}`,
  wrongNote: "Treating every fourth year as a leap year counts February 29 in 1900 and 2100, which the Gregorian calendar skips.",
  wrong: [
    `auto days=[](long long y,long long m,long long d)->long long{long long n=0;for(long long Y=1;Y<y;++Y)n+=(Y%4==0)?366:365;int dim[12]={31,28,31,30,31,30,31,31,30,31,30,31};if(y%4==0)dim[1]=29;for(int i=0;i<m-1;++i)n+=dim[i];return n+d;};
int t;cin>>t;while(t--){string a,b;cin>>a>>b;long long x=days(stoll(a.substr(0,4)),stoll(a.substr(5,2)),stoll(a.substr(8,2))),y=days(stoll(b.substr(0,4)),stoll(b.substr(5,2)),stoll(b.substr(8,2)));cout<<llabs(x-y)<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => date(r, 1895, 1905) + " " + date(r, 1895, 1905) + "\n"),
  brute: `auto leap=[](int y){return (y%4==0&&y%100!=0)||y%400==0;};
auto stepOrd=[&](int y,int m,int d){long long n=0;int Y=1890,M=1,D=1;while(!(Y==y&&M==m&&D==d)){int dim[12]={31,28,31,30,31,30,31,31,30,31,30,31};if(leap(Y))dim[1]=29;D++;if(D>dim[M-1]){D=1;M++;if(M>12){M=1;Y++;}}n++;}return n;};
int t;cin>>t;while(t--){string a,b;cin>>a>>b;long long x=stepOrd(stoi(a.substr(0,4)),stoi(a.substr(5,2)),stoi(a.substr(8,2))),y=stepOrd(stoi(b.substr(0,4)),stoi(b.substr(5,2)),stoi(b.substr(8,2)));cout<<llabs(x-y)<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 random date pairs across the whole range", code: `def d(r):\n    y = r.int(1, 9999); m = r.int(1, 12)\n    lp = (y % 4 == 0 and y % 100 != 0) or y % 400 == 0\n    dim = [31, 29 if lp else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]\n    return "%04d-%02d-%02d" % (y, m, r.int(1, dim))\nreturn "10000\\n" + "\\n".join(d(r) + " " + d(r) for _ in range(10000))` },
  ],
});

P.push({
  id: "A642", judge: "fnd-weekday-of-a-date", topic: "foundations", rating: 1100,
  tag: "Dates", timeLimitMs: 1000,
  uz: "Haftaning qaysi kuni",
  en: "Which day of the week",
  statementUz: "Sana YYYY-MM-DD ko‘rinishida berilgan. U haftaning qaysi kuniga to‘g‘ri kelishini aniqlang va raqam bilan chiqaring: dushanba — 1, seshanba — 2, …, yakshanba — 7. Grigorian taqvimi barcha yillar uchun ishlatiladi (kabisa yili: 4 ga bo‘linadi, 100 ga bo‘linsa 400 ga ham bo‘linishi kerak). Ma'lumot uchun: 2026-yil 22-oktabr — payshanba.",
  statementEn: "A date is given in the form YYYY-MM-DD. Find which day of the week it falls on and print it as a number: Monday is 1, Tuesday is 2, …, Sunday is 7. The Gregorian calendar is used for every year (a leap year is divisible by 4, and if it is divisible by 100 it must also be divisible by 400). For reference, 22 October 2026 is a Thursday.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida bitta sana keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains one date.",
  outputUz: "Har bir so‘rov uchun alohida qatorda 1 dan 7 gacha bo‘lgan sonni chiqaring.",
  outputEn: "For each query print a number from 1 to 7 on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "every date is valid, with a year from 1 to 9999", "Monday is 1 and Sunday is 7"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "har bir sana to‘g‘ri, yili 1 dan 9999 gacha", "dushanba — 1, yakshanba — 7"],
  sampleInputs: ["4\n2026-10-22\n2000-01-01\n1970-01-01\n2024-02-29\n"],
  expect: ["4\n6\n4\n4\n"],
  sampleNotesUz: ["2000-yil 1-yanvar shanba (6) edi, 1970-yil 1-yanvar va 2024-yil 29-fevral — payshanba (4)."],
  sampleNotesEn: ["1 January 2000 was a Saturday (6); 1 January 1970 and 29 February 2024 were Thursdays (4)."],
  testInputs: ["4\n2026-10-22\n2000-01-01\n1970-01-01\n2024-02-29\n", "1\n0001-01-01\n", "3\n1900-03-01\n2100-03-01\n9999-12-31\n", "2\n1600-02-29\n1582-10-15\n"],
  sol: CIVIL + `int t;cin>>t;while(t--){string s;cin>>s;long long z=parse(s);cout<<(((z%7)+7+3)%7)+1<<"\\n";}`,
  wrongNote: "Counting every fourth year as a leap year shifts every date before 1900 or after 2100 by the skipped February 29ths.",
  wrong: [
    `auto days=[](long long y,long long m,long long d)->long long{long long n=0;for(long long Y=1;Y<y;++Y)n+=(Y%4==0)?366:365;int dim[12]={31,28,31,30,31,30,31,31,30,31,30,31};if(y%4==0)dim[1]=29;for(int i=0;i<m-1;++i)n+=dim[i];return n+d;};
long long base=days(1970,1,1);int t;cin>>t;while(t--){string s;cin>>s;long long z=days(stoll(s.substr(0,4)),stoll(s.substr(5,2)),stoll(s.substr(8,2)))-base;cout<<(((z%7)+7+3)%7)+1<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => date(r, 1990, 2010) + "\n"),
  brute: `auto leap=[](int y){return (y%4==0&&y%100!=0)||y%400==0;};
int t;cin>>t;while(t--){string s;cin>>s;int y=stoi(s.substr(0,4)),m=stoi(s.substr(5,2)),d=stoi(s.substr(8,2));int Y=1990,M=1,D=1,w=1;while(!(Y==y&&M==m&&D==d)){int dim[12]={31,28,31,30,31,30,31,31,30,31,30,31};if(leap(Y))dim[1]=29;D++;if(D>dim[M-1]){D=1;M++;if(M>12){M=1;Y++;}}w=w%7+1;}cout<<w<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 random dates", code: `def d(r):\n    y = r.int(1, 9999); m = r.int(1, 12)\n    lp = (y % 4 == 0 and y % 100 != 0) or y % 400 == 0\n    dim = [31, 29 if lp else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]\n    return "%04d-%02d-%02d" % (y, m, r.int(1, dim))\nreturn "10000\\n" + "\\n".join(d(r) for _ in range(10000))` },
  ],
});

P.push({
  id: "A643", judge: "sort-one-swap-to-sorted", topic: "sorting", rating: 1100,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Bitta almashtirish yetadimi",
  en: "Is one swap enough",
  statementUz: "n ta butun sondan iborat massiv berilgan. Ko‘pi bilan bitta amal bajarishga ruxsat bor: ixtiyoriy ikkita elementni (qo‘shni bo‘lishi shart emas) tanlab, o‘rinlarini almashtirish. Shu bilan massivni kamaymaydigan tartibga keltirish mumkinmi? Massiv allaqachon tartiblangan bo‘lsa, javob — ha, chunki amal bajarmasa ham bo‘ladi.",
  statementEn: "You are given an array of n integers. You may perform at most one operation: choose any two elements (they need not be adjacent) and swap them. Can the array be made non-decreasing this way? If the array is already sorted the answer is yes, since you may do nothing.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each test case print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9"],
  sampleInputs: ["4\n5\n1 5 3 4 2\n3\n3 2 1\n4\n2 1 4 3\n3\n1 1 2\n"],
  expect: ["YES\nYES\nNO\nYES\n"],
  sampleNotesUz: ["Birinchi testda 5 va 2 ni almashtirsak, 1 2 3 4 5 hosil bo‘ladi. Ikkinchida 3 va 1 almashtiriladi. Uchinchida ikkita juftlik joyida emas, bitta almashtirish yetmaydi. To‘rtinchisi allaqachon tartiblangan."],
  sampleNotesEn: ["In the first test swapping 5 and 2 gives 1 2 3 4 5. In the second, 3 and 1 are swapped. In the third two pairs are out of place and one swap is not enough. The fourth is already sorted."],
  testInputs: ["4\n5\n1 5 3 4 2\n3\n3 2 1\n4\n2 1 4 3\n3\n1 1 2\n", "1\n1\n7\n", "2\n2\n2 1\n6\n1 2 6 4 5 3\n", "3\n5\n2 2 1 1 3\n4\n1 3 2 2\n4\n4 1 2 3\n", "1\n6\n6 5 4 3 2 1\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;auto b=a;sort(b.begin(),b.end());int d=0;for(int i=0;i<n;++i)d+=a[i]!=b[i];cout<<(d==0||d==2?"YES":"NO")<<"\\n";}`,
  wrongNote: "Counting the places where the order drops looks local, but one swap of two far-apart elements can fix two drops — and two neighbouring swaps leave two drops that one swap cannot.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int d=0;for(int i=0;i+1<n;++i)d+=a[i]>a[i+1];cout<<(d<=1?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int d=0;for(int i=0;i+1<n;++i)d+=a[i]>a[i+1];cout<<(d<=2?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 7); return n + "\n" + line(r.ints(n, 1, 4)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;bool ok=is_sorted(a.begin(),a.end());for(int i=0;i<n&&!ok;++i)for(int j=i+1;j<n&&!ok;++j){swap(a[i],a[j]);if(is_sorted(a.begin(),a.end()))ok=true;swap(a[i],a[j]);}cout<<(ok?"YES":"NO")<<"\\n";}`,
  big: [
    { seed: 1, note: "a long sorted array with its two ends swapped", code: `n = 200000\na = sorted(r.ints(n, 1, 10**9))\na[0], a[-1] = a[-1], a[0]\nreturn "1\\n" + str(n) + "\\n" + line(a)` },
    { seed: 2, note: "a long random array", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "A644", judge: "str-alternating-binary-flips", topic: "strings", rating: 1100,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Navbatma-navbat bo‘lgan satr",
  en: "An alternating string",
  statementUz: "Faqat 0 va 1 belgilaridan iborat s satri berilgan. Bitta amalda satrning ixtiyoriy bitta belgisini teskarisiga almashtirish mumkin (0 ni 1 ga yoki 1 ni 0 ga). Satrdagi hech bir ikki qo‘shni belgi teng bo‘lmasligi uchun eng kamida nechta amal kerak? Masalan, 0101 va 1010 satrlarida qo‘shni belgilar doim turlicha.",
  statementEn: "You are given a string s consisting only of the characters 0 and 1. In one operation you may flip any single character (0 to 1 or 1 to 0). What is the smallest number of operations needed so that no two neighbouring characters of the string are equal? For example, in 0101 and 1010 neighbouring characters always differ.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n uzunlikdagi satr.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the string of length n.",
  outputUz: "Har bir test uchun alohida qatorda amallarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of operations on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "the string consists of 0 and 1"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "satr 0 va 1 dan iborat"],
  sampleInputs: ["4\n3\n000\n4\n0110\n5\n10101\n6\n001100\n"],
  expect: ["1\n2\n0\n3\n"],
  sampleNotesUz: ["000 da o‘rtadagi belgini almashtirsak, 010 bo‘ladi. 0110 da qo‘shni teng juftlik bitta, lekin 0101 yoki 1010 ga o‘tish uchun ikkita amal kerak. 10101 allaqachon navbatma-navbat."],
  sampleNotesEn: ["Flipping the middle of 000 gives 010. 0110 has only one equal neighbouring pair, yet reaching 0101 or 1010 takes two flips. 10101 already alternates."],
  testInputs: ["4\n3\n000\n4\n0110\n5\n10101\n6\n001100\n", "1\n1\n0\n", "2\n2\n11\n7\n1111111\n", "3\n8\n00110011\n5\n01001\n6\n101100\n"],
  sol: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int a=0,b=0;for(int i=0;i<n;++i){char e='0'+(i%2);a+=s[i]!=e;b+=s[i]==e;}cout<<min(a,b)<<"\\n";}`,
  wrongNote: "Counting the equal neighbouring pairs undercounts a run like 0110: one bad pair, but the fix ripples and needs two flips; and every equal pair inside a long run does not need its own flip either.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int c=0;for(int i=0;i+1<n;++i)c+=s[i]==s[i+1];cout<<c<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int a=0;for(int i=0;i<n;++i)a+=s[i]!=('0'+(i%2));cout<<a<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + r.str(n, "01") + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int best=INT_MAX;for(int m=0;m<(1<<n);++m){bool ok=true;for(int i=0;i+1<n;++i)if(((m>>i)&1)==((m>>(i+1))&1))ok=false;if(!ok)continue;int c=0;for(int i=0;i<n;++i)c+=(s[i]-'0')!=((m>>i)&1);best=min(best,c);}cout<<best<<"\\n";}`,
  big: [
    { seed: 1, note: "one long random string", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "01")` },
  ],
});

export default P;
