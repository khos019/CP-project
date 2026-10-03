/* Batch 511 — ten problems, A511–C520, taking the bank to 520.
 *
 * A case check and a digit-sum count at the bottom; a knight on a board, a
 * k-th pair distance found by binary search, and an interval DP and a trie at
 * the top.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 900 */
P.push({
  id: "A511", judge: "str-alternating-case-check", topic: "strings", rating: 900,
  tag: "Characters", timeLimitMs: 1000,
  uz: "Katta-kichik navbat bilan",
  en: "Upper, lower, upper",
  statementUz: "Sizga faqat lotin harflaridan iborat so‘z berilgan. So‘zda har ikki qo‘shni harf turli registrda bo‘lsa — biri katta, ikkinchisi kichik — so‘z navbatlashgan deyiladi. So‘z katta harf bilan ham, kichik harf bilan ham boshlanishi mumkin. Bitta harfdan iborat so‘z ham navbatlashgan hisoblanadi. Berilgan so‘z navbatlashganmi yoki yo‘qmi, aniqlang.",
  statementEn: "You are given a word made only of Latin letters. The word is called alternating if every two neighbouring letters are in different cases — one uppercase and the other lowercase. It may start with either an uppercase or a lowercase letter, and a word of a single letter is alternating too. Decide whether the given word is alternating.",
  inputUz: "Yagona qatorda so‘z beriladi.",
  inputEn: "A single line contains the word.",
  outputUz: "So‘z navbatlashgan bo‘lsa YES, aks holda NO chiqaring.",
  outputEn: "Print YES if the word is alternating and NO otherwise.",
  constraintList: ["1 ≤ length ≤ 10^5", "only the letters a–z and A–Z occur", "the word may start in either case", "every neighbouring pair is checked"],
  constraintListUz: ["1 ≤ uzunlik ≤ 10^5", "faqat a–z va A–Z harflari uchraydi", "so‘z istalgan registrda boshlanishi mumkin", "har bir qo‘shni juftlik tekshiriladi"],
  sampleInputs: ["aBcD\n", "AbbA\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "a kichik, B katta, c kichik, D katta — har bir qo‘shni juftlik turli registrda.",
    "Ikkinchi va uchinchi harflar — ikkalasi ham kichik b, shuning uchun so‘z navbatlashmaydi.",
  ],
  sampleNotesEn: [
    "a is lowercase, B uppercase, c lowercase, D uppercase — every neighbouring pair differs.",
    "The second and third letters are both a lowercase b, so the word does not alternate.",
  ],
  testInputs: ["aBcD\n", "AbbA\n", "x\n", "Q\n", "AbCdE\n", "aBBa\n", "ab\n", "zZzZzZ\n"],
  sol: `string s;cin>>s;bool ok=true;
for(size_t i=1;i<s.size();++i)if((bool)isupper((unsigned char)s[i])==(bool)isupper((unsigned char)s[i-1]))ok=false;
cout<<(ok?"YES":"NO")<<"\\n";`,
  wrongNote: "Insisting that the word open with a capital rejects alternating words that start in lowercase; checking the pairs two letters apart skips the pair between them.",
  wrong: [
    `string s;cin>>s;bool ok=true;
for(size_t i=0;i<s.size();++i)if((bool)isupper((unsigned char)s[i])!=(i%2==0))ok=false;
cout<<(ok?"YES":"NO")<<"\\n";`,
    `string s;cin>>s;bool ok=true;
for(size_t i=1;i<s.size();i+=2)if((bool)isupper((unsigned char)s[i])==(bool)isupper((unsigned char)s[i-1]))ok=false;
cout<<(ok?"YES":"NO")<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A512", judge: "math-count-digit-sum-divisible", topic: "math", rating: 1000,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Raqamlar yig‘indisi bo‘linadi",
  en: "Digit sums that divide evenly",
  statementUz: "Sizga n va k sonlari berilgan. 1 dan n gacha (ikkala chegara ham kiradi) bo‘lgan butun sonlar ichida raqamlari yig‘indisi k ga qoldiqsiz bo‘linadiganlari nechta ekanini toping. Masalan, 19 ning raqamlari yig‘indisi 1 + 9 = 10, u 5 ga bo‘linadi. E'tibor bering: sonning o‘zi emas, aynan uning raqamlari yig‘indisi bo‘linishi kerak.",
  statementEn: "You are given n and k. Among the integers from 1 to n, both ends included, count those whose digit sum is divisible by k. For instance, the digits of 19 sum to 1 + 9 = 10, which is divisible by 5. Note that it is the digit sum that must divide evenly, not the number itself.",
  inputUz: "Yagona qatorda n va k sonlari beriladi.",
  inputEn: "A single line contains n and k.",
  outputUz: "Yagona butun sonni chiqaring — shunday sonlar soni.",
  outputEn: "Print a single integer — how many such numbers there are.",
  constraintList: ["1 ≤ n ≤ 10^6", "1 ≤ k ≤ 100", "the range starts at 1, not 0", "the digit sum is tested, not the number"],
  constraintListUz: ["1 ≤ n ≤ 10^6", "1 ≤ k ≤ 100", "oraliq 0 dan emas, 1 dan boshlanadi", "sonning o‘zi emas, raqamlar yig‘indisi tekshiriladi"],
  sampleInputs: ["20 5\n", "10 1\n"],
  expect: ["3\n", "10\n"],
  sampleNotesUz: [
    "5 (yig‘indi 5), 14 (1 + 4 = 5) va 19 (1 + 9 = 10) mos keladi. 10, 15 va 20 5 ga bo‘linadi, lekin ularning raqamlari yig‘indisi 1, 6 va 2.",
    "Har qanday son 1 ga bo‘linadi, shuning uchun 1 dan 10 gacha hammasi sanaladi.",
  ],
  sampleNotesEn: [
    "5 (sum 5), 14 (1 + 4 = 5) and 19 (1 + 9 = 10) qualify. 10, 15 and 20 are divisible by 5 themselves, but their digit sums are 1, 6 and 2.",
    "Every sum is divisible by 1, so all ten numbers count.",
  ],
  testInputs: ["20 5\n", "10 1\n", "1 1\n", "1 2\n", "1000000 7\n", "99 18\n", "1000000 100\n"],
  sol: `long long n,k;cin>>n>>k;long long c=0;
for(long long x=1;x<=n;++x){long long t=x,s=0;while(t){s+=t%10;t/=10;}if(s%k==0)++c;}
cout<<c<<"\\n";`,
  wrongNote: "Starting the loop at 0 counts zero, whose digit sum 0 divides by everything; testing the number instead of its digit sum answers a different question.",
  wrong: [
    `long long n,k;cin>>n>>k;long long c=0;
for(long long x=0;x<=n;++x){long long t=x,s=0;while(t){s+=t%10;t/=10;}if(s%k==0)++c;}
cout<<c<<"\\n";`,
    `long long n,k;cin>>n>>k;long long c=0;
for(long long x=1;x<=n;++x)if(x%k==0)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B513", judge: "greedy-max-content-children", topic: "greedy", rating: 1200,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Pechenye tarqatish",
  en: "Handing out biscuits",
  statementUz: "n ta bola va m ta pechenye bor. i-bolaning ishtahasi g_i, j-pechenyening kattaligi s_j. Bola kattaligi kamida g_i bo‘lgan pechenye olsa, xursand bo‘ladi. Har bir bolaga ko‘pi bilan bitta pechenye beriladi va har bir pechenye ko‘pi bilan bitta bolaga beriladi. Eng ko‘pi bilan nechta bolani xursand qilish mumkin?",
  statementEn: "There are n children and m biscuits. Child i has an appetite of g_i, and biscuit j has a size of s_j. A child is content if given a biscuit of size at least g_i. Each child receives at most one biscuit, and each biscuit goes to at most one child. What is the largest number of children that can be made content?",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda n ta g_i soni, uchinchi qatorda m ta s_j soni keladi.",
  inputEn: "The first line contains n and m. The second line contains the n values g_i and the third line the m values s_j.",
  outputUz: "Yagona butun sonni chiqaring — xursand bolalarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of content children.",
  constraintList: ["1 ≤ n, m ≤ 10^5", "1 ≤ g_i, s_j ≤ 10^9", "a biscuit exactly the size of the appetite is enough", "a biscuit cannot be split"],
  constraintListUz: ["1 ≤ n, m ≤ 10^5", "1 ≤ g_i, s_j ≤ 10^9", "ishtahaga aynan teng pechenye yetarli", "pechenyeni bo‘lib bo‘lmaydi"],
  sampleInputs: ["3 2\n1 2 3\n1 1\n", "2 3\n1 2\n1 2 3\n"],
  expect: ["1\n", "2\n"],
  sampleNotesUz: [
    "Ikkala pechenye ham 1 kattalikda, ular faqat ishtahasi 1 bo‘lgan bolani xursand qila oladi.",
    "Ishtahasi 1 bo‘lgan bolaga 1, ishtahasi 2 bo‘lganiga 2 kattalikdagi pechenye beriladi.",
  ],
  sampleNotesEn: [
    "Both biscuits have size 1, and only the child with appetite 1 can be satisfied by one.",
    "The child with appetite 1 gets the biscuit of size 1 and the child with appetite 2 the biscuit of size 2.",
  ],
  testInputs: ["3 2\n1 2 3\n1 1\n", "2 3\n1 2\n1 2 3\n", "1 1\n5\n4\n", "1 1\n5\n5\n", "3 3\n3 1 2\n3 2 1\n", "4 2\n1 1 1 1\n9 9\n", "3 4\n10 1 5\n6 1 2 11\n"],
  sol: `int n,m;cin>>n>>m;vector<long long>g(n),s(m);for(auto&x:g)cin>>x;for(auto&x:s)cin>>x;
sort(g.begin(),g.end());sort(s.begin(),s.end());
int i=0,j=0;while(i<n&&j<m){if(s[j]>=g[i])++i;++j;}
cout<<i<<"\\n";`,
  wrongNote: "Sorting the children but not the biscuits walks the biscuits in an arbitrary order and passes over ones that would have fitted; demanding a strictly larger biscuit rejects the one that is exactly enough.",
  wrong: [
    `int n,m;cin>>n>>m;vector<long long>g(n),s(m);for(auto&x:g)cin>>x;for(auto&x:s)cin>>x;
sort(g.begin(),g.end());
int i=0,j=0;while(i<n&&j<m){if(s[j]>=g[i])++i;++j;}
cout<<i<<"\\n";`,
    `int n,m;cin>>n>>m;vector<long long>g(n),s(m);for(auto&x:g)cin>>x;for(auto&x:s)cin>>x;
sort(g.begin(),g.end());sort(s.begin(),s.end());
int i=0,j=0;while(i<n&&j<m){if(s[j]>g[i])++i;++j;}
cout<<i<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B514", judge: "stack-previous-smaller-index", topic: "data-structures", rating: 1400,
  tag: "Monotonic stack", timeLimitMs: 1000,
  uz: "Chapdagi eng yaqin kichigi",
  en: "The nearest smaller one to the left",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan, elementlar 1 dan n gacha raqamlangan. Har bir i uchun j < i va a_j < a_i shartini qanoatlantiradigan eng katta j ni toping — ya'ni i-elementdan chapda turgan va undan qat'iy kichik bo‘lgan eng yaqin element raqamini. Agar bunday element bo‘lmasa, shu i uchun 0 chiqaring. Teng element kichik hisoblanmaydi.",
  statementEn: "You are given an array of n integers, with elements numbered 1 to n. For each i find the largest j with j < i and a_j < a_i — the position of the nearest element to the left of element i that is strictly smaller than it. If there is no such element, print 0 for that i. An equal element does not count as smaller.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains n. The second line contains n integers separated by single spaces.",
  outputUz: "Bitta qatorda probel bilan ajratilgan n ta sonni chiqaring — har bir i uchun topilgan j.",
  outputEn: "Print n numbers on one line separated by spaces — the j found for each i.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9", "positions are numbered from 1", "the first answer is always 0"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9", "o‘rinlar 1 dan raqamlanadi", "birinchi javob har doim 0"],
  sampleInputs: ["5\n3 1 4 1 5\n", "3\n2 2 2\n"],
  expect: ["0 0 2 0 4\n", "0 0 0\n"],
  sampleNotesUz: [
    "4 dan chapdagi eng yaqin kichigi 2-o‘rindagi 1. To‘rtinchi o‘rindagi 1 dan kichik element chapda yo‘q. 5 uchun eng yaqin kichigi 4-o‘rindagi 1.",
    "Barcha elementlar teng, teng element esa kichik hisoblanmaydi.",
  ],
  sampleNotesEn: [
    "The nearest smaller element left of the 4 is the 1 at position 2. Nothing to the left of the second 1 is smaller than it. For the 5 the nearest smaller one is the 1 at position 4.",
    "All elements are equal, and an equal element is not smaller.",
  ],
  testInputs: ["5\n3 1 4 1 5\n", "3\n2 2 2\n", "1\n9\n", "5\n1 2 3 4 5\n", "5\n5 4 3 2 1\n", "6\n2 5 4 3 6 1\n", "4\n-1 -3 -2 -2\n"],
  sol: `int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];
vector<int>st,res(n+1,0);
for(int i=1;i<=n;++i){while(!st.empty()&&a[st.back()]>=a[i])st.pop_back();res[i]=st.empty()?0:st.back();st.push_back(i);}
for(int i=1;i<=n;++i)cout<<res[i]<<(i==n?"\\n":" ");`,
  wrongNote: "Popping only strictly larger elements leaves equal ones on the stack and reports them as smaller; looking at the single element just before i misses a smaller one further back.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];
vector<int>st,res(n+1,0);
for(int i=1;i<=n;++i){while(!st.empty()&&a[st.back()]>a[i])st.pop_back();res[i]=st.empty()?0:st.back();st.push_back(i);}
for(int i=1;i<=n;++i)cout<<res[i]<<(i==n?"\\n":" ");`,
    `int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];
vector<int>res(n+1,0);
for(int i=2;i<=n;++i)res[i]=(a[i-1]<a[i])?i-1:0;
for(int i=1;i<=n;++i)cout<<res[i]<<(i==n?"\\n":" ");`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B515", judge: "grid-knight-shortest", topic: "graphs", rating: 1600,
  tag: "BFS", timeLimitMs: 1000,
  uz: "Ot taxtada",
  en: "A knight on the board",
  statementUz: "n qator va m ustunli taxta berilgan. '.' bo‘sh katak, '#' yopiq katak, 'S' otning turgan joyi, 'T' u yetib borishi kerak bo‘lgan katak. Ot shaxmatdagidek yuradi: bir yo‘nalishda ikki katak va unga perpendikulyar yo‘nalishda bir katak, jami sakkiz xil yurish. Ot yopiq katakka tusha olmaydi va taxtadan chiqa olmaydi, lekin yopiq kataklar ustidan sakrab o‘ta oladi. S dan T ga yetish uchun eng kam yurishlar sonini toping.",
  statementEn: "You are given a board of n rows and m columns. '.' is a free square, '#' a blocked one, 'S' the knight's starting square and 'T' the square it must reach. The knight moves as in chess: two squares in one direction and one square at a right angle to it, eight moves in all. It may not land on a blocked square or leave the board, but it may jump over blocked squares. Find the smallest number of moves from S to T.",
  inputUz: "Birinchi qatorda n va m beriladi. Keyingi n ta qatorning har birida m ta belgidan iborat satr keladi. Taxtada aynan bitta S va aynan bitta T bor.",
  inputEn: "The first line contains n and m. Each of the next n lines is a string of m characters. The board contains exactly one S and exactly one T.",
  outputUz: "Eng kam yurishlar sonini chiqaring. Agar T ga yetib bo‘lmasa, −1 chiqaring.",
  outputEn: "Print the smallest number of moves, or −1 if T cannot be reached.",
  constraintList: ["1 ≤ n, m ≤ 1000", "n · m ≥ 2", "S and T are on different squares", "jumping over a blocked square is allowed"],
  constraintListUz: ["1 ≤ n, m ≤ 1000", "n · m ≥ 2", "S va T turli kataklarda", "yopiq katak ustidan sakrash mumkin"],
  sampleInputs: ["2 3\nS..\n..T\n", "2 2\nS.\n.T\n"],
  expect: ["1\n", "-1\n"],
  sampleNotesUz: [
    "Ot bir qator pastga va ikki ustun o‘ngga yurib, bitta yurishda T ga tushadi.",
    "2 × 2 taxtada otning birorta ham yurishi taxta ichida qolmaydi.",
  ],
  sampleNotesEn: [
    "One row down and two columns right lands the knight on T in a single move.",
    "On a 2 × 2 board no knight move stays on the board.",
  ],
  testInputs: ["2 3\nS..\n..T\n", "2 2\nS.\n.T\n", "3 3\nS..\n...\n..T\n", "3 4\nS#..\n.##.\n..#T\n", "2 3\nS..\n..#\n", "1 5\nS...T\n", "4 4\nT...\n....\n....\n...S\n", "3 3\nS..\n..#\n.#T\n"],
  sol: `int n,m;cin>>n>>m;vector<string>b(n);for(auto&r:b)cin>>r;
int sr=0,sc=0,tr=0,tc=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j){if(b[i][j]=='S'){sr=i;sc=j;}if(b[i][j]=='T'){tr=i;tc=j;}}
int dr[8]={1,1,-1,-1,2,2,-2,-2},dc[8]={2,-2,2,-2,1,-1,1,-1};
vector<vector<int>>d(n,vector<int>(m,-1));d[sr][sc]=0;queue<pair<int,int>>q;q.push(make_pair(sr,sc));
while(!q.empty()){auto [r,c]=q.front();q.pop();
 for(int k=0;k<8;++k){int nr=r+dr[k],nc=c+dc[k];
  if(nr<0||nr>=n||nc<0||nc>=m||b[nr][nc]=='#'||d[nr][nc]>=0)continue;
  d[nr][nc]=d[r][c]+1;q.push(make_pair(nr,nc));}}
cout<<d[tr][tc]<<"\\n";`,
  wrongNote: "Forgetting the blocked squares lets the knight land on them; keeping only the moves that go down or right throws away the routes that have to double back.",
  wrong: [
    `int n,m;cin>>n>>m;vector<string>b(n);for(auto&r:b)cin>>r;
int sr=0,sc=0,tr=0,tc=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j){if(b[i][j]=='S'){sr=i;sc=j;}if(b[i][j]=='T'){tr=i;tc=j;}}
int dr[8]={1,1,-1,-1,2,2,-2,-2},dc[8]={2,-2,2,-2,1,-1,1,-1};
vector<vector<int>>d(n,vector<int>(m,-1));d[sr][sc]=0;queue<pair<int,int>>q;q.push(make_pair(sr,sc));
while(!q.empty()){auto [r,c]=q.front();q.pop();
 for(int k=0;k<8;++k){int nr=r+dr[k],nc=c+dc[k];
  if(nr<0||nr>=n||nc<0||nc>=m||d[nr][nc]>=0)continue;
  d[nr][nc]=d[r][c]+1;q.push(make_pair(nr,nc));}}
cout<<d[tr][tc]<<"\\n";`,
    `int n,m;cin>>n>>m;vector<string>b(n);for(auto&r:b)cin>>r;
int sr=0,sc=0,tr=0,tc=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j){if(b[i][j]=='S'){sr=i;sc=j;}if(b[i][j]=='T'){tr=i;tc=j;}}
int dr[4]={1,1,2,2},dc[4]={2,-2,1,-1};
vector<vector<int>>d(n,vector<int>(m,-1));d[sr][sc]=0;queue<pair<int,int>>q;q.push(make_pair(sr,sc));
while(!q.empty()){auto [r,c]=q.front();q.pop();
 for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];
  if(nr<0||nr>=n||nc<0||nc>=m||b[nr][nc]=='#'||d[nr][nc]>=0)continue;
  d[nr][nc]=d[r][c]+1;q.push(make_pair(nr,nc));}}
cout<<d[tr][tc]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B516", judge: "bt-brackets-with-fixed", topic: "backtracking", rating: 1700,
  tag: "Backtracking", timeLimitMs: 1000,
  uz: "So‘roq belgili qavslar",
  en: "Brackets with question marks",
  statementUz: "Sizga '(', ')' va '?' belgilaridan iborat satr berilgan. Har bir '?' ni '(' yoki ')' bilan almashtirish kerak. Qavslar ketma-ketligi to‘g‘ri deyiladi, agar har bir prefiksda ochuvchi qavslar yopuvchilardan kam bo‘lmasa va butun satrda ularning soni teng bo‘lsa. Masalan \"(())\" va \"()()\" to‘g‘ri, \")(\" esa to‘g‘ri emas. Almashtirishlardan nechtasi to‘g‘ri ketma-ketlik berishini toping.",
  statementEn: "You are given a string of the characters '(', ')' and '?'. Every '?' must be replaced by either '(' or ')'. A bracket sequence is correct if in every prefix the opening brackets are at least as many as the closing ones, and over the whole string the two counts are equal. For instance \"(())\" and \"()()\" are correct while \")(\" is not. Count how many of the replacements give a correct sequence.",
  inputUz: "Yagona qatorda satr beriladi.",
  inputEn: "A single line contains the string.",
  outputUz: "Yagona butun sonni chiqaring — to‘g‘ri ketma-ketlik beradigan almashtirishlar soni.",
  outputEn: "Print a single integer — the number of replacements that give a correct sequence.",
  constraintList: ["1 ≤ length ≤ 20", "only '(', ')' and '?' occur", "every '?' must be replaced", "a string of odd length has no correct replacement"],
  constraintListUz: ["1 ≤ uzunlik ≤ 20", "faqat '(', ')' va '?' uchraydi", "har bir '?' almashtirilishi shart", "toq uzunlikdagi satrning to‘g‘ri almashtirishi yo‘q"],
  sampleInputs: ["????\n", "?)??\n"],
  expect: ["2\n", "1\n"],
  sampleNotesUz: [
    "\"(())\" va \"()()\" — to‘rtta belgidan iborat to‘g‘ri ketma-ketliklar shu ikkitasi.",
    "Birinchi belgi '(' bo‘lishi shart, aks holda satr yopuvchi qavs bilan boshlanadi. Shunda \"()\" dan keyin \"()\" qolishi kerak — yagona usul \"()()\".",
  ],
  sampleNotesEn: [
    "\"(())\" and \"()()\" are the only correct sequences of four characters.",
    "The first character must be '(' or the string would open with a closing bracket. After \"()\" the rest must be \"()\" too, so \"()()\" is the only way.",
  ],
  testInputs: ["????\n", "?)??\n", "?\n", "()\n", ")(\n", "????????????????????\n", "(??????)\n", "??)??(??\n", "))??\n"],
  sol: `string s;cin>>s;int n=s.size();
function<long long(int,int)>go=[&](int i,int bal)->long long{
 if(bal<0||bal>n-i)return 0;
 if(i==n)return bal==0?1:0;
 long long r=0;
 if(s[i]!=')')r+=go(i+1,bal+1);
 if(s[i]!='(')r+=go(i+1,bal-1);
 return r;};
cout<<go(0,0)<<"\\n";`,
  wrongNote: "Checking only that the counts balance at the end accepts strings such as )( whose prefix goes negative; checking only the prefixes accepts strings left with brackets still open.",
  wrong: [
    `string s;cin>>s;int n=s.size();
function<long long(int,int)>go=[&](int i,int bal)->long long{
 if(i==n)return bal==0?1:0;
 long long r=0;
 if(s[i]!=')')r+=go(i+1,bal+1);
 if(s[i]!='(')r+=go(i+1,bal-1);
 return r;};
cout<<go(0,0)<<"\\n";`,
    `string s;cin>>s;int n=s.size();
function<long long(int,int)>go=[&](int i,int bal)->long long{
 if(bal<0)return 0;
 if(i==n)return 1;
 long long r=0;
 if(s[i]!=')')r+=go(i+1,bal+1);
 if(s[i]!='(')r+=go(i+1,bal-1);
 return r;};
cout<<go(0,0)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B517", judge: "dp-count-subseq-occurrences", topic: "dynamic-programming", rating: 1800,
  tag: "DP on strings", timeLimitMs: 1000,
  uz: "Satr ichida yashiringan so‘z",
  en: "A word hidden in a string",
  statementUz: "Sizga s va t satrlari berilgan. s dan ba'zi belgilarni o‘chirib (qolganlarining tartibini o‘zgartirmasdan) t ni hosil qilish usullari sonini toping. Ikki usul turlicha hisoblanadi, agar s da qoldirilgan belgilarning o‘rinlari to‘plami farq qilsa. Masalan, \"aaa\" dan \"aa\" ni uch xil usulda olish mumkin: 1- va 2-, 1- va 3-, yoki 2- va 3- harflarni qoldirib. Javob katta bo‘lishi mumkin, uni 10^9 + 7 ga bo‘lgandagi qoldiqni chiqaring.",
  statementEn: "You are given strings s and t. Count the ways to obtain t by deleting some characters of s while keeping the order of the rest. Two ways are different if the sets of positions kept in s differ. For instance, \"aa\" can be taken from \"aaa\" in three ways: keeping letters 1 and 2, 1 and 3, or 2 and 3. The answer can be large, so print it modulo 10^9 + 7.",
  inputUz: "Birinchi qatorda s, ikkinchi qatorda t beriladi.",
  inputEn: "The first line contains s and the second line contains t.",
  outputUz: "Yagona butun sonni chiqaring — usullar soni 10^9 + 7 modul bo‘yicha.",
  outputEn: "Print a single integer — the number of ways modulo 10^9 + 7.",
  constraintList: ["1 ≤ |s|, |t| ≤ 2000", "both strings consist of lowercase Latin letters", "the kept characters must keep their order", "if t is longer than s the answer is 0"],
  constraintListUz: ["1 ≤ |s|, |t| ≤ 2000", "ikkala satr ham kichik lotin harflaridan iborat", "qoldirilgan belgilar tartibini saqlashi shart", "t s dan uzun bo‘lsa javob 0"],
  sampleInputs: ["rabbbit\nrabbit\n", "aaa\naa\n"],
  expect: ["3\n", "3\n"],
  sampleNotesUz: [
    "s da uchta b bor, t esa ikkitasini talab qiladi. Uchtadan qaysi birini o‘chirish — 3 xil tanlov.",
    "Shartdagi misol: 1–2, 1–3 yoki 2–3 harflari qoldiriladi.",
  ],
  sampleNotesEn: [
    "s has three b's and t needs two of them. Which one to delete is the choice — three ways.",
    "The example from the statement: keep letters 1–2, 1–3 or 2–3.",
  ],
  testInputs: ["rabbbit\nrabbit\n", "aaa\naa\n", "abc\nabcd\n", "abc\nd\n", "a\na\n", "babgbag\nbag\n", "abab\nab\n", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n"],
  sol: `string s,t;cin>>s>>t;const long long M=1000000007LL;int m=t.size();
vector<long long>dp(m+1,0);dp[0]=1;
for(char c:s)for(int j=m;j>=1;--j)if(t[j-1]==c)dp[j]=(dp[j]+dp[j-1])%M;
cout<<dp[m]<<"\\n";`,
  wrongNote: "Walking j upward lets one character of s fill two positions of t in the same pass; counting only contiguous matches answers how often t appears as a substring.",
  wrong: [
    `string s,t;cin>>s>>t;const long long M=1000000007LL;int m=t.size();
vector<long long>dp(m+1,0);dp[0]=1;
for(char c:s)for(int j=1;j<=m;++j)if(t[j-1]==c)dp[j]=(dp[j]+dp[j-1])%M;
cout<<dp[m]<<"\\n";`,
    `string s,t;cin>>s>>t;long long c=0;
for(size_t i=0;i+t.size()<=s.size();++i)if(s.compare(i,t.size(),t)==0)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1900 */
P.push({
  id: "B518", judge: "bs-kth-smallest-pair-distance", topic: "binary-search", rating: 1900,
  tag: "Binary search on the answer", timeLimitMs: 2000,
  uz: "k-chi eng yaqin juftlik",
  en: "The k-th closest pair",
  statementUz: "Sizga n ta butun son berilgan. Har bir i < j juftlik uchun |a_i − a_j| masofasini yozib chiqamiz — jami n(n − 1)/2 ta masofa hosil bo‘ladi, ular ichida tenglari ham bo‘lishi mumkin. Shu masofalarni o‘sish tartibida joylashtirganda k-o‘rinda turgan masofani toping. Takrorlanuvchi masofalar alohida-alohida hisoblanadi.",
  statementEn: "You are given n integers. For every pair i < j write down the distance |a_i − a_j| — n(n − 1)/2 distances in all, some of which may be equal. Find the distance that stands in position k when these distances are arranged in increasing order. Repeated distances are counted separately.",
  inputUz: "Birinchi qatorda n va k beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains n and k. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — k-o‘rindagi masofa.",
  outputEn: "Print a single integer — the distance in position k.",
  constraintList: ["2 ≤ n ≤ 10^5", "1 ≤ k ≤ n(n − 1)/2", "0 ≤ a_i ≤ 10^9", "positions are counted from 1"],
  constraintListUz: ["2 ≤ n ≤ 10^5", "1 ≤ k ≤ n(n − 1)/2", "0 ≤ a_i ≤ 10^9", "o‘rinlar 1 dan sanaladi"],
  sampleInputs: ["3 1\n1 3 1\n", "4 5\n1 6 1 3\n"],
  expect: ["0\n", "5\n"],
  sampleNotesUz: [
    "Masofalar 2, 0 va 2. Eng kichigi — ikkita 1 orasidagi 0.",
    "Masofalar o‘sish tartibida: 0, 2, 2, 3, 5, 5. Beshinchisi 5.",
  ],
  sampleNotesEn: [
    "The distances are 2, 0 and 2. The smallest is the 0 between the two 1s.",
    "In increasing order the distances are 0, 2, 2, 3, 5, 5, and the fifth is 5.",
  ],
  testInputs: ["3 1\n1 3 1\n", "4 5\n1 6 1 3\n", "2 1\n0 1000000000\n", "5 10\n1 2 3 4 5\n", "5 4\n1 2 3 4 5\n", "4 6\n7 7 7 7\n", "6 7\n10 1 8 3 6 2\n"],
  sol: `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
auto atMost=[&](long long d){long long c=0;int l=0;for(int r=0;r<n;++r){while(a[r]-a[l]>d)++l;c+=r-l;}return c;};
long long lo=0,hi=a[n-1]-a[0];
while(lo<hi){long long mid=(lo+hi)/2;if(atMost(mid)>=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
  wrongNote: "Counting the pairs strictly closer than d moves every boundary by one and lands one step above the answer; ranking only the gaps between neighbours in sorted order forgets the pairs that are further apart.",
  wrong: [
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
auto below=[&](long long d){long long c=0;int l=0;for(int r=0;r<n;++r){while(a[r]-a[l]>=d&&l<r)++l;c+=r-l;}return c;};
long long lo=0,hi=a[n-1]-a[0];
while(lo<hi){long long mid=(lo+hi)/2;if(below(mid)>=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`,
    `long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
vector<long long>g;for(int i=1;i<n;++i)g.push_back(a[i]-a[i-1]);sort(g.begin(),g.end());
cout<<g[min<long long>(k,g.size())-1]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C519", judge: "dp-merge-adjacent-min-cost", topic: "dynamic-programming", rating: 2100,
  tag: "Interval DP", timeLimitMs: 2000,
  uz: "Qo‘shni uyumlarni birlashtirish",
  en: "Merging neighbouring piles",
  statementUz: "Bir qatorda n ta tosh uyumi turibdi, i-uyumda a_i ta tosh bor. Bir qadamda ikkita qo‘shni uyumni bitta uyumga birlashtirish mumkin; bu qadam narxi ikkala uyumdagi toshlar yig‘indisiga teng, yangi uyum esa ularning o‘rnida turadi. Faqat bitta uyum qolguncha birlashtirish davom etadi. Barcha qadamlar narxlari yig‘indisining eng kichik qiymatini toping. Bir-biriga qo‘shni bo‘lmagan uyumlarni birlashtirib bo‘lmaydi.",
  statementEn: "n piles of stones stand in a row, pile i holding a_i stones. In one step two neighbouring piles may be merged into one; the step costs the total number of stones in the two piles, and the new pile takes their place. Merging continues until a single pile remains. Find the smallest possible total cost of all the steps. Piles that are not neighbours cannot be merged.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta a_i soni keladi.",
  inputEn: "The first line contains n. The second line contains the n values a_i separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng kam umumiy narx.",
  outputEn: "Print a single integer — the smallest total cost.",
  constraintList: ["1 ≤ n ≤ 300", "1 ≤ a_i ≤ 10^6", "only neighbouring piles may be merged", "a single pile costs nothing"],
  constraintListUz: ["1 ≤ n ≤ 300", "1 ≤ a_i ≤ 10^6", "faqat qo‘shni uyumlar birlashtiriladi", "bitta uyum hech narsa talab qilmaydi"],
  sampleInputs: ["3\n1 2 3\n", "4\n4 1 1 4\n"],
  expect: ["9\n", "18\n"],
  sampleNotesUz: [
    "Avval 1 va 2 (narx 3), keyin 3 va 3 (narx 6) — jami 9. Avval 2 va 3 ni birlashtirish 5 + 6 = 11 turadi.",
    "Avval o‘rtadagi ikkita 1 (narx 2), keyin 4 va 2 (narx 6), keyin 6 va 4 (narx 10) — jami 18.",
  ],
  sampleNotesEn: [
    "Merge 1 and 2 first (cost 3), then 3 and 3 (cost 6) — 9 in all. Merging 2 and 3 first costs 5 + 6 = 11.",
    "Merge the two middle 1s (cost 2), then 4 and 2 (cost 6), then 6 and 4 (cost 10) — 18 in all.",
  ],
  testInputs: ["3\n1 2 3\n", "4\n4 1 1 4\n", "1\n7\n", "2\n5 6\n", "5\n1 100 1 100 1\n", "6\n3 4 5 1 2 6\n", "4\n10 1 10 1\n", "7\n6 1 6 1 6 1 6\n"],
  sol: `int n;cin>>n;vector<long long>a(n),p(n+1,0);for(int i=0;i<n;++i){cin>>a[i];p[i+1]=p[i]+a[i];}
vector<vector<long long>>dp(n,vector<long long>(n,0));
for(int len=2;len<=n;++len)for(int l=0;l+len-1<n;++l){int r=l+len-1;long long best=LLONG_MAX;
 for(int m=l;m<r;++m)best=min(best,dp[l][m]+dp[m+1][r]);dp[l][r]=best+p[r+1]-p[l];}
cout<<dp[0][n-1]<<"\\n";`,
  wrongNote: "Always merging the cheapest neighbouring pair is a local choice that the row punishes later; merging the two smallest piles anywhere ignores the rule that only neighbours may join.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long total=0;
while(a.size()>1){size_t b=0;for(size_t i=1;i+1<a.size();++i)if(a[i]+a[i+1]<a[b]+a[b+1])b=i;
 long long s=a[b]+a[b+1];total+=s;a[b]=s;a.erase(a.begin()+b+1);}
cout<<total<<"\\n";`,
    `int n;cin>>n;priority_queue<long long,vector<long long>,greater<long long>>h;for(int i=0;i<n;++i){long long x;cin>>x;h.push(x);}
long long total=0;while(h.size()>1){long long x=h.top();h.pop();long long y=h.top();h.pop();total+=x+y;h.push(x+y);}
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C520", judge: "adv-count-pairs-xor-at-most", topic: "advanced-cp", rating: 2300,
  tag: "Trie", timeLimitMs: 2000,
  uz: "XOR i chegaradan oshmaydigan juftliklar",
  en: "Pairs whose XOR stays within a bound",
  statementUz: "Sizga n ta manfiy bo‘lmagan butun son va k soni berilgan. i < j bo‘lgan va a_i XOR a_j ≤ k shartini qanoatlantiradigan juftliklar sonini toping. Bu yerda XOR — ikki sonning ikkilik yozuvidagi har bir razryadni alohida solishtiradigan amal: razryadlar har xil bo‘lsa natijada 1, bir xil bo‘lsa 0 turadi. Masalan 5 XOR 3 = 6, chunki 101 va 011 dan 110 hosil bo‘ladi. Har bir juftlik bir marta sanaladi.",
  statementEn: "You are given n non-negative integers and a number k. Count the pairs i < j with a_i XOR a_j ≤ k. Here XOR compares the two numbers' binary digits position by position, giving 1 where they differ and 0 where they agree; for example 5 XOR 3 = 6, since 101 and 011 give 110. Each pair is counted once.",
  inputUz: "Birinchi qatorda n va k beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains n and k. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — shunday juftliklar soni.",
  outputEn: "Print a single integer — the number of such pairs.",
  constraintList: ["1 ≤ n ≤ 10^5", "0 ≤ a_i, k < 2^30", "pairs are unordered and use two different positions", "equal numbers form a pair with XOR 0"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "0 ≤ a_i, k < 2^30", "juftliklar tartibsiz va ikki xil o‘rindan tuziladi", "teng sonlar XOR i 0 bo‘lgan juftlik hosil qiladi"],
  sampleInputs: ["3 1\n1 2 3\n", "4 0\n5 5 5 1\n"],
  expect: ["1\n", "3\n"],
  sampleNotesUz: [
    "1 XOR 2 = 3, 1 XOR 3 = 2, 2 XOR 3 = 1. Faqat oxirgisi 1 dan oshmaydi.",
    "XOR 0 bo‘lishi uchun sonlar teng bo‘lishi kerak. Uchta 5 dan 3 ta juftlik tuziladi.",
  ],
  sampleNotesEn: [
    "1 XOR 2 = 3, 1 XOR 3 = 2 and 2 XOR 3 = 1. Only the last is at most 1.",
    "An XOR of 0 needs equal numbers, and the three 5s make 3 pairs.",
  ],
  testInputs: ["3 1\n1 2 3\n", "4 0\n5 5 5 1\n", "1 5\n7\n", "2 6\n5 3\n", "2 5\n5 3\n", "5 1073741823\n1 2 3 4 5\n", "6 4\n0 1 2 4 8 16\n", "5 2\n7 7 6 5 4\n"],
  sol: `int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<array<int,2>>ch(1,{0,0});vector<long long>cnt(1,0);
long long total=0;
for(auto x:a){
 int node=0;
 for(int b=29;b>=0&&node>=0;--b){int xb=(x>>b)&1,kb=(k>>b)&1;
  if(kb){int same=ch[node][xb];if(same)total+=cnt[same];node=ch[node][xb^1]?ch[node][xb^1]:-1;}
  else{node=ch[node][xb]?ch[node][xb]:-1;}}
 if(node>=0)total+=cnt[node];
 int cur=0;
 for(int b=29;b>=0;--b){int xb=(x>>b)&1;if(!ch[cur][xb]){ch[cur][xb]=ch.size();ch.push_back({0,0});cnt.push_back(0);}cur=ch[cur][xb];++cnt[cur];}
}
cout<<total<<"\\n";`,
  wrongNote: "Dropping the walk's final node counts the pairs whose XOR is strictly below k; inserting each number before querying it pairs every number with itself.",
  wrong: [
    `int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<array<int,2>>ch(1,{0,0});vector<long long>cnt(1,0);
long long total=0;
for(auto x:a){
 int node=0;
 for(int b=29;b>=0&&node>=0;--b){int xb=(x>>b)&1,kb=(k>>b)&1;
  if(kb){int same=ch[node][xb];if(same)total+=cnt[same];node=ch[node][xb^1]?ch[node][xb^1]:-1;}
  else{node=ch[node][xb]?ch[node][xb]:-1;}}
 int cur=0;
 for(int b=29;b>=0;--b){int xb=(x>>b)&1;if(!ch[cur][xb]){ch[cur][xb]=ch.size();ch.push_back({0,0});cnt.push_back(0);}cur=ch[cur][xb];++cnt[cur];}
}
cout<<total<<"\\n";`,
    `int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<array<int,2>>ch(1,{0,0});vector<long long>cnt(1,0);
long long total=0;
for(auto x:a){
 int cur=0;
 for(int b=29;b>=0;--b){int xb=(x>>b)&1;if(!ch[cur][xb]){ch[cur][xb]=ch.size();ch.push_back({0,0});cnt.push_back(0);}cur=ch[cur][xb];++cnt[cur];}
 int node=0;
 for(int b=29;b>=0&&node>=0;--b){int xb=(x>>b)&1,kb=(k>>b)&1;
  if(kb){int same=ch[node][xb];if(same)total+=cnt[same];node=ch[node][xb^1]?ch[node][xb^1]:-1;}
  else{node=ch[node][xb]?ch[node][xb]:-1;}}
 if(node>=0)total+=cnt[node];
}
cout<<total<<"\\n";`,
  ],
});

export default P;
