/* Batch 665 — ten problems, B665–B674, at 1200–1500: strings, maths and
 * geometry. Part of the fifty added on 2026-10-22 for the 1000–1599 band.
 * Every task is a well-known contest problem restated for AlgoYo'l in our own
 * words, with our own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B665", judge: "math-divisible-by-a-or-b", topic: "math", rating: 1200,
  tag: "Inclusion-exclusion", timeLimitMs: 1000,
  uz: "a ga yoki b ga bo‘linadiganlar",
  en: "Divisible by a or by b",
  statementUz: "Har bir so‘rovda n, a va b sonlari beriladi. 1 dan n gacha bo‘lgan butun sonlardan nechtasi a ga yoki b ga (yoki ikkalasiga ham) qoldiqsiz bo‘linishini toping. Ikkalasiga bo‘linadigan son bir marta hisoblanadi. Sonlar juda katta bo‘lishi mumkin, shuning uchun ularni birma-bir tekshirib chiqish iloji yo‘q.",
  statementEn: "Each query gives the numbers n, a and b. Find how many integers from 1 to n are divisible by a or by b (or by both), that is, leave no remainder when divided by at least one of them. A number divisible by both is counted once. The numbers can be huge, so checking them one by one is not an option.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida n, a va b keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains n, a and b.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n, a, b ≤ 10^18", "a and b may be equal"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n, a, b ≤ 10^18", "a va b teng bo‘lishi mumkin"],
  sampleInputs: ["3\n10 2 3\n12 4 6\n1000000000000000000 1000000000000000000 999999999999999999\n"],
  expect: ["7\n4\n2\n"],
  sampleNotesUz: ["1 dan 10 gacha 2 ga yoki 3 ga bo‘linadiganlar: 2, 3, 4, 6, 8, 9, 10 — yettita. 12 gacha 4 yoki 6 ga: 4, 6, 8, 12 — 12 ikkalasiga bo‘linsa ham bir marta sanaladi."],
  sampleNotesEn: ["From 1 to 10 the numbers divisible by 2 or 3 are 2, 3, 4, 6, 8, 9, 10 — seven of them. Up to 12, by 4 or 6: 4, 6, 8, 12 — 12 divides by both but counts once."],
  testInputs: ["3\n10 2 3\n12 4 6\n1000000000000000000 1000000000000000000 999999999999999999\n", "2\n1 1 1\n100 7 7\n", "3\n100 6 4\n1000000000000000000 2 3\n999999999999999999 1000000000 1000000000\n", "2\n30 15 10\n5 6 7\n"],
  sol: `int t;cin>>t;while(t--){long long n,a,b;cin>>n>>a>>b;long long g=__gcd(a,b);__int128 l=(__int128)(a/g)*b;long long both=l>n?0:(long long)(n/(long long)l);cout<<n/a+n/b-both<<"\\n";}`,
  wrongNote: "Subtracting n / (a·b) counts the overlap only for coprime a and b; the numbers divisible by both are the multiples of their least common multiple. Multiplying a·b in 64 bits also overflows for large inputs.",
  wrong: [
    `int t;cin>>t;while(t--){long long n,a,b;cin>>n>>a>>b;__int128 p=(__int128)a*b;long long both=p>n?0:(long long)(n/(long long)p);cout<<n/a+n/b-both<<"\\n";}`,
    `int t;cin>>t;while(t--){long long n,a,b;cin>>n>>a>>b;cout<<n/a+n/b<<"\\n";}`,
  ],
  gen: (r) => tests(r, 5, (r) => r.int(1, 60) + " " + r.int(1, 12) + " " + r.int(1, 12) + "\n"),
  brute: `int t;cin>>t;while(t--){long long n,a,b;cin>>n>>a>>b;long long c=0;for(long long i=1;i<=n;++i)if(i%a==0||i%b==0)c++;cout<<c<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 queries with huge values", code: `q = ["%d %d %d" % (r.int(1, 10**18), r.int(1, 10**12), r.int(1, 10**12)) for _ in range(10000)]\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

P.push({
  id: "B666", judge: "math-perfect-squares-in-range", topic: "math", rating: 1200,
  tag: "Roots", timeLimitMs: 1000,
  uz: "Oraliqdagi to‘liq kvadratlar",
  en: "Perfect squares in a range",
  statementUz: "Butun sonning kvadrati bo‘lgan son to‘liq kvadrat deyiladi: 1, 4, 9, 16, … Har bir so‘rovda l va r beriladi. [l, r] oraliqdagi (ikkala chegara ham kiradi) to‘liq kvadratlar sonini toping. Sonlar 10^18 gacha bo‘lgani uchun ildizni haqiqiy sonlarda hisoblash xato berishi mumkin — butun sonlarda aniq hisoblash kerak.",
  statementEn: "A number that is the square of an integer is called a perfect square: 1, 4, 9, 16, … Each query gives l and r. Find how many perfect squares lie in the range [l, r] (both ends included). Since the numbers reach 10^18, computing a root in floating point can be off — the count has to be exact in integers.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida l va r keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains l and r.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ l ≤ r ≤ 10^18", "both ends are included"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ l ≤ r ≤ 10^18", "ikkala chegara ham kiradi"],
  sampleInputs: ["4\n1 10\n4 9\n10 15\n1 1000000000000000000\n"],
  expect: ["3\n2\n0\n1000000000\n"],
  sampleNotesUz: ["[1, 10] da 1, 4, 9; [4, 9] da 4 va 9 — chegaralar ham kiradi. [10, 15] da kvadrat yo‘q."],
  sampleNotesEn: ["[1, 10] holds 1, 4, 9; [4, 9] holds 4 and 9 — the ends count. [10, 15] holds none."],
  testInputs: ["4\n1 10\n4 9\n10 15\n1 1000000000000000000\n", "2\n16 16\n17 24\n", "3\n999999999999999999 1000000000000000000\n999999998000000001 999999998000000001\n999999998000000000 999999998000000000\n", "2\n2 3\n25 100\n"],
  sol: `auto isq=[](long long x)->long long{long long s=sqrtl((long double)x);while(s*s>x)s--;while((s+1)*(s+1)<=x)s++;return s;};int t;cin>>t;while(t--){long long l,r;cin>>l>>r;cout<<isq(r)-isq(l-1)<<"\\n";}`,
  wrongNote: "Subtracting the root of l instead of l − 1 drops l itself when l is a square; an uncorrected floating-point root can land one off near 10^18.",
  wrong: [
    `auto isq=[](long long x)->long long{long long s=sqrtl((long double)x);while(s*s>x)s--;while((s+1)*(s+1)<=x)s++;return s;};int t;cin>>t;while(t--){long long l,r;cin>>l>>r;cout<<isq(r)-isq(l)<<"\\n";}`,
    `int t;cin>>t;while(t--){long long l,r;cin>>l>>r;long long a=(long long)sqrt((double)r),b=(long long)sqrt((double)(l-1));cout<<a-b<<"\\n";}`,
  ],
  gen: (r) => tests(r, 5, (r) => { const l = r.int(1, 120); return l + " " + r.int(l, 150) + "\n"; }),
  brute: `int t;cin>>t;while(t--){long long l,r;cin>>l>>r;long long c=0;for(long long k=1;k*k<=r;++k)if(k*k>=l)c++;cout<<c<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 ranges near 10^18, many ends exactly on squares", code: `q = []\nfor _ in range(10000):\n    k = r.int(1, 10**9)\n    l = k * k if r.int(0, 1) else r.int(1, 10**18)\n    q.append("%d %d" % (l, r.int(l, 10**18)))\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

P.push({
  id: "B667", judge: "geo-smallest-covering-square", topic: "geometry", rating: 1200,
  tag: "Geometry", timeLimitMs: 1000,
  uz: "Hammasini qoplaydigan kvadrat",
  en: "A square that covers everything",
  statementUz: "Tekislikda n ta nuqta berilgan. Tomonlari koordinata o‘qlariga parallel bo‘lgan shunday kvadrat chizish kerakki, barcha nuqtalar uning ichida yoki chegarasida yotsin. Bunday kvadratning eng kichik yuzasini toping. Barcha nuqtalar ustma-ust tushsa, nol yuzali kvadrat ham mumkin.",
  statementEn: "n points lie in the plane. You have to draw a square with sides parallel to the coordinate axes so that every point lies inside it or on its border. Find the smallest possible area of such a square. If all the points coincide, a square of zero area is allowed.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida x_i va y_i keladi.",
  inputEn: "The first line contains n. Each of the next n lines contains x_i and y_i.",
  outputUz: "Yagona sonni chiqaring — kvadratning eng kichik yuzasi.",
  outputEn: "Print a single number — the smallest area of the square.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ x_i, y_i ≤ 10^9", "the answer can reach 4·10^18"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ x_i, y_i ≤ 10^9", "javob 4·10^18 gacha yetishi mumkin"],
  sampleInputs: ["3\n0 0\n2 1\n1 4\n", "2\n5 5\n5 5\n"],
  expect: ["16\n", "0\n"],
  sampleNotesUz: ["x bo‘yicha nuqtalar 2 birlik, y bo‘yicha 4 birlik oraliqni egallaydi. Kvadrat tomoni kattarog‘iga — 4 ga teng bo‘lishi kerak, yuzasi 16."],
  sampleNotesEn: ["The points span 2 units along x and 4 along y. The square's side has to match the larger one, 4, so its area is 16."],
  testInputs: ["3\n0 0\n2 1\n1 4\n", "2\n5 5\n5 5\n", "2\n-1000000000 -1000000000\n1000000000 1000000000\n", "3\n0 0\n10 0\n5 1\n", "4\n1 1\n1 2\n2 1\n2 2\n", "2\n0 0\n46341 0\n"],
  sol: `int n;cin>>n;long long x0=LLONG_MAX,x1=LLONG_MIN,y0=LLONG_MAX,y1=LLONG_MIN;for(int i=0;i<n;++i){long long x,y;cin>>x>>y;x0=min(x0,x);x1=max(x1,x);y0=min(y0,y);y1=max(y1,y);}long long s=max(x1-x0,y1-y0);cout<<s*s<<"\\n";`,
  wrongNote: "Multiplying the two spans gives the smallest rectangle, not a square; computing the side in 32-bit integers overflows once it passes about 46 340.",
  wrong: [
    `int n;cin>>n;long long x0=LLONG_MAX,x1=LLONG_MIN,y0=LLONG_MAX,y1=LLONG_MIN;for(int i=0;i<n;++i){long long x,y;cin>>x>>y;x0=min(x0,x);x1=max(x1,x);y0=min(y0,y);y1=max(y1,y);}cout<<(x1-x0)*(y1-y0)<<"\\n";`,
    `int n;cin>>n;int x0=INT_MAX,x1=INT_MIN,y0=INT_MAX,y1=INT_MIN;for(int i=0;i<n;++i){int x,y;cin>>x>>y;x0=min(x0,x);x1=max(x1,x);y0=min(y0,y);y1=max(y1,y);}int s=max(x1-x0,y1-y0);cout<<(long long)(s*s)<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6); let s = n + "\n"; for (let i = 0; i < n; i++) s += r.int(-6, 6) + " " + r.int(-6, 6) + "\n"; return s; },
  brute: `int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];for(long long s=0;;++s){bool found=false;for(long long ox=-20;ox<=20&&!found;++ox)for(long long oy=-20;oy<=20&&!found;++oy){bool ok=true;for(int i=0;i<n;++i)if(x[i]<ox||x[i]>ox+s||y[i]<oy||y[i]>oy+s)ok=false;if(ok)found=true;}if(found){cout<<s*s<<"\\n";break;}}`,
  big: [
    { seed: 1, note: "1.5·10^5 points across the full range", code: `n = 150000\nreturn str(n) + "\\n" + "\\n".join("%d %d" % (r.int(-10**9, 10**9), r.int(-10**9, 10**9)) for _ in range(n))` },
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B668", judge: "geo-point-and-triangle", topic: "geometry", rating: 1300,
  tag: "Geometry", timeLimitMs: 1000,
  uz: "Nuqta va uchburchak",
  en: "A point and a triangle",
  statementUz: "Har bir so‘rovda uchlari A, B, C bo‘lgan uchburchak (bir to‘g‘ri chiziqda yotmaydi) va P nuqtasi beriladi. P uchburchakning ichida, chegarasida (tomonida yoki uchida) yoki tashqarisida yotishini aniqlang. Barcha koordinatalar butun son, shuning uchun javobni haqiqiy sonlarsiz, aniq hisoblash mumkin.",
  statementEn: "Each query gives a triangle with vertices A, B, C (not on one line) and a point P. Decide whether P lies inside the triangle, on its border (on a side or at a vertex) or outside it. All coordinates are integers, so the answer can be computed exactly, without floating point.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida sakkizta son keladi: A, B, C va P ning koordinatalari.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains eight numbers: the coordinates of A, B, C and P.",
  outputUz: "Har bir so‘rov uchun alohida qatorda INSIDE, BORDER yoki OUTSIDE chiqaring.",
  outputEn: "For each query print INSIDE, BORDER or OUTSIDE on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "|coordinates| ≤ 10^8", "the triangle is non-degenerate", "the vertices come in any order"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "|koordinatalar| ≤ 10^8", "uchburchak aynimagan", "uchlar ixtiyoriy tartibda keladi"],
  sampleInputs: ["4\n0 0 4 0 0 4 1 1\n0 0 4 0 0 4 2 2\n0 0 4 0 0 4 3 3\n0 0 4 0 0 4 0 0\n"],
  expect: ["INSIDE\nBORDER\nOUTSIDE\nBORDER\n"],
  sampleNotesUz: ["(2, 2) gipotenuza ustida yotadi, (3, 3) undan tashqarida. Uchburchak uchi ham chegara hisoblanadi."],
  sampleNotesEn: ["(2, 2) lies on the hypotenuse and (3, 3) beyond it. A vertex of the triangle counts as border too."],
  testInputs: ["4\n0 0 4 0 0 4 1 1\n0 0 4 0 0 4 2 2\n0 0 4 0 0 4 3 3\n0 0 4 0 0 4 0 0\n", "2\n0 4 4 0 0 0 1 1\n0 0 0 4 4 0 -1 1\n", "3\n-100000000 -100000000 100000000 -100000000 0 100000000 0 0\n-100000000 -100000000 100000000 -100000000 0 100000000 100000000 100000000\n-100000000 -100000000 100000000 -100000000 0 100000000 0 -100000000\n", "2\n0 0 6 0 3 6 6 1\n0 0 6 0 3 6 8 0\n"],
  sol: `int t;cin>>t;while(t--){long long ax,ay,bx,by,cx,cy,px,py;cin>>ax>>ay>>bx>>by>>cx>>cy>>px>>py;auto cr=[](long long x1,long long y1,long long x2,long long y2,long long x3,long long y3){long long v=(x2-x1)*(y3-y1)-(y2-y1)*(x3-x1);return (v>0)-(v<0);};
int d1=cr(ax,ay,bx,by,px,py),d2=cr(bx,by,cx,cy,px,py),d3=cr(cx,cy,ax,ay,px,py);bool neg=d1<0||d2<0||d3<0,pos=d1>0||d2>0||d3>0;if(neg&&pos)cout<<"OUTSIDE\\n";else if(d1==0||d2==0||d3==0)cout<<"BORDER\\n";else cout<<"INSIDE\\n";}`,
  wrongNote: "A zero cross product means \"on the line through the side\", which is the border only if the other two signs agree; treating any zero as the border calls points beyond a vertex on the extended side border too.",
  wrong: [
    `int t;cin>>t;while(t--){long long ax,ay,bx,by,cx,cy,px,py;cin>>ax>>ay>>bx>>by>>cx>>cy>>px>>py;auto cr=[](long long x1,long long y1,long long x2,long long y2,long long x3,long long y3){long long v=(x2-x1)*(y3-y1)-(y2-y1)*(x3-x1);return (v>0)-(v<0);};
int d1=cr(ax,ay,bx,by,px,py),d2=cr(bx,by,cx,cy,px,py),d3=cr(cx,cy,ax,ay,px,py);if(d1==0||d2==0||d3==0)cout<<"BORDER\\n";else if((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0))cout<<"OUTSIDE\\n";else cout<<"INSIDE\\n";}`,
    `int t;cin>>t;while(t--){long long ax,ay,bx,by,cx,cy,px,py;cin>>ax>>ay>>bx>>by>>cx>>cy>>px>>py;auto cr=[](long long x1,long long y1,long long x2,long long y2,long long x3,long long y3){long long v=(x2-x1)*(y3-y1)-(y2-y1)*(x3-x1);return (v>0)-(v<0);};
int d1=cr(ax,ay,bx,by,px,py),d2=cr(bx,by,cx,cy,px,py),d3=cr(cx,cy,ax,ay,px,py);bool in=(d1>=0&&d2>=0&&d3>=0);if(!in)cout<<"OUTSIDE\\n";else if(d1==0||d2==0||d3==0)cout<<"BORDER\\n";else cout<<"INSIDE\\n";}`,
  ],
  gen: (r) => tests(r, 4, (r) => {
    let a, b, c;
    do { a = [r.int(-4, 4), r.int(-4, 4)]; b = [r.int(-4, 4), r.int(-4, 4)]; c = [r.int(-4, 4), r.int(-4, 4)]; }
    while ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) === 0);
    return [...a, ...b, ...c, r.int(-5, 5), r.int(-5, 5)].join(" ") + "\n";
  }),
  brute: `int t;cin>>t;while(t--){long long ax,ay,bx,by,cx,cy,px,py;cin>>ax>>ay>>bx>>by>>cx>>cy>>px>>py;auto area2=[](long long x1,long long y1,long long x2,long long y2,long long x3,long long y3){return llabs((x2-x1)*(y3-y1)-(y2-y1)*(x3-x1));};
auto onSeg=[](long long x1,long long y1,long long x2,long long y2,long long x,long long y){return (x2-x1)*(y-y1)==(y2-y1)*(x-x1)&&min(x1,x2)<=x&&x<=max(x1,x2)&&min(y1,y2)<=y&&y<=max(y1,y2);};
if(onSeg(ax,ay,bx,by,px,py)||onSeg(bx,by,cx,cy,px,py)||onSeg(cx,cy,ax,ay,px,py))cout<<"BORDER\\n";else if(area2(ax,ay,bx,by,px,py)+area2(bx,by,cx,cy,px,py)+area2(cx,cy,ax,ay,px,py)==area2(ax,ay,bx,by,cx,cy))cout<<"INSIDE\\n";else cout<<"OUTSIDE\\n";}`,
  big: [
    { seed: 1, note: "10^4 large random triangles and points", code: `q = []\nwhile len(q) < 10000:\n    p = [r.int(-10**8, 10**8) for _ in range(8)]\n    if (p[2]-p[0])*(p[5]-p[1]) - (p[3]-p[1])*(p[4]-p[0]) != 0:\n        q.append(line(p))\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B669", judge: "str-count-ip-addresses", topic: "strings", rating: 1400,
  tag: "Parsing", timeLimitMs: 1000,
  uz: "IP manzillarni tiklash",
  en: "Restoring IP addresses",
  statementUz: "Raqamlardan iborat s satri berilgan. Unga uchta nuqta qo‘yib, to‘g‘ri IPv4 manzil hosil qilish kerak: to‘rtta bo‘lak, har biri 0 dan 255 gacha bo‘lgan son. Bo‘lak bosh noldan boshlanmasligi kerak («0» ning o‘zi mumkin, lekin «01» yoki «00» mumkin emas), va raqamlar tartibi o‘zgarmaydi. Har bir satr uchun nechta turli to‘g‘ri manzil hosil qilish mumkinligini toping.",
  statementEn: "You are given a string s of digits. Three dots must be inserted into it to form a valid IPv4 address: four parts, each a number from 0 to 255. A part must not start with a leading zero (\"0\" itself is fine, but \"01\" or \"00\" is not), and the digits keep their order. For every string find how many different valid addresses can be formed.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Keyingi t ta qatorning har birida bitta raqamli satr keladi.",
  inputEn: "The first line contains the number of test cases t. Each of the next t lines contains one string of digits.",
  outputUz: "Har bir test uchun alohida qatorda manzillar sonini chiqaring.",
  outputEn: "For each test case print the number of addresses on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "every string has 1 to 20 digits", "all three dots are used"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "har bir satr 1 dan 20 gacha raqamdan iborat", "uchala nuqta ham qo‘yiladi"],
  sampleInputs: ["4\n25525511135\n0000\n101023\n1234567890123\n"],
  expect: ["2\n1\n5\n0\n"],
  sampleNotesUz: ["«25525511135» dan 255.255.11.135 va 255.255.111.35 hosil bo‘ladi. «0000» dan faqat 0.0.0.0. «101023» dan beshta: 1.0.10.23, 1.0.102.3, 10.1.0.23, 10.10.2.3, 101.0.2.3. 13 raqam to‘rt bo‘lakka sig‘maydi."],
  sampleNotesEn: ["\"25525511135\" gives 255.255.11.135 and 255.255.111.35. \"0000\" gives only 0.0.0.0. \"101023\" gives five: 1.0.10.23, 1.0.102.3, 10.1.0.23, 10.10.2.3, 101.0.2.3. Thirteen digits cannot fit into four parts."],
  testInputs: ["4\n25525511135\n0000\n101023\n1234567890123\n", "3\n1\n1111\n111111111111\n", "3\n256256256256\n010010\n255255255255\n", "2\n19216811\n100100\n"],
  sol: `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size();auto ok=[&](int i,int len){if(len<1||len>3||i+len>n)return false;if(len>1&&s[i]=='0')return false;return stoi(s.substr(i,len))<=255;};int c=0;for(int a=1;a<=3;++a)for(int b=1;b<=3;++b)for(int d=1;d<=3;++d){int e=n-a-b-d;if(ok(0,a)&&ok(a,b)&&ok(a+b,d)&&ok(a+b+d,e))c++;}cout<<c<<"\\n";}`,
  wrongNote: "Allowing a part to start with zero admits \"01\" and \"00\"; forgetting the 255 ceiling admits \"256\".",
  wrong: [
    `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size();auto ok=[&](int i,int len){if(len<1||len>3||i+len>n)return false;return stoi(s.substr(i,len))<=255;};int c=0;for(int a=1;a<=3;++a)for(int b=1;b<=3;++b)for(int d=1;d<=3;++d){int e=n-a-b-d;if(ok(0,a)&&ok(a,b)&&ok(a+b,d)&&ok(a+b+d,e))c++;}cout<<c<<"\\n";}`,
    `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size();auto ok=[&](int i,int len){if(len<1||len>3||i+len>n)return false;if(len>1&&s[i]=='0')return false;return true;};int c=0;for(int a=1;a<=3;++a)for(int b=1;b<=3;++b)for(int d=1;d<=3;++d){int e=n-a-b-d;if(ok(0,a)&&ok(a,b)&&ok(a+b,d)&&ok(a+b+d,e))c++;}cout<<c<<"\\n";}`,
  ],
  gen: (r) => tests(r, 4, (r) => r.str(r.int(1, 13), "01259") + "\n"),
  brute: `int t;cin>>t;while(t--){string s;cin>>s;int n=s.size();int c=0;for(int i=1;i<n;++i)for(int j=i+1;j<n;++j)for(int k=j+1;k<n;++k){string p[4]={s.substr(0,i),s.substr(i,j-i),s.substr(j,k-j),s.substr(k)};bool good=true;for(auto&x:p){if(x.size()>3||(x.size()>1&&x[0]=='0')){good=false;break;}if(stoi(x)>255)good=false;}if(good)c++;}cout<<c<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 strings of every length", code: `q = [text(r, r.int(1, 20), "0123456789") for _ in range(10000)]\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B670", judge: "str-decode-nested-repeats", topic: "strings", rating: 1500,
  tag: "Stack", timeLimitMs: 1000,
  uz: "Ichma-ich takrorlarni ochish",
  en: "Expanding nested repeats",
  statementUz: "Satr qisqartirilgan ko‘rinishda yozilgan: k[...] yozuvi qavs ichidagi qismni k marta takrorlashni bildiradi, bu yerda k — musbat butun son (bir necha xonali bo‘lishi mumkin). Qavslar ichma-ich joylashishi mumkin, masalan «3[a2[c]]» — bu «accaccacc». Qavsdan tashqaridagi harflar o‘zgarmaydi. Berilgan yozuvni to‘liq ochib, natijaviy satrni chiqaring.",
  statementEn: "A string is written in a compressed form: k[...] means the part inside the brackets repeated k times, where k is a positive integer (it may have several digits). Brackets may be nested, for example \"3[a2[c]]\" means \"accaccacc\". Letters outside brackets stay as they are. Expand the given notation fully and print the resulting string.",
  inputUz: "Yagona qatorda qisqartirilgan yozuv beriladi.",
  inputEn: "The only line contains the compressed notation.",
  outputUz: "Ochilgan satrni chiqaring.",
  outputEn: "Print the expanded string.",
  constraintList: ["the notation has 1 to 10^4 characters: lowercase letters, digits and brackets", "every k is between 1 and 300 and is always followed by \"[\"", "the expanded string has at most 2·10^5 characters"],
  constraintListUz: ["yozuv 1 dan 10^4 gacha belgidan iborat: kichik harflar, raqamlar va qavslar", "har bir k 1 dan 300 gacha va doim undan keyin «[» keladi", "ochilgan satr ko‘pi bilan 2·10^5 belgidan iborat"],
  sampleInputs: ["3[a2[c]]\n", "ab2[cd]e\n", "12[x]\n"],
  expect: ["accaccacc\n", "abcdcde\n", "xxxxxxxxxxxx\n"],
  sampleNotesUz: ["Ichki «2[c]» — «cc», demak «a2[c]» — «acc», va u uch marta takrorlanadi. Uchinchi namunada son ikki xonali."],
  sampleNotesEn: ["The inner \"2[c]\" is \"cc\", so \"a2[c]\" is \"acc\", repeated three times. In the third sample the count has two digits."],
  testInputs: ["3[a2[c]]\n", "ab2[cd]e\n", "12[x]\n", "abc\n", "2[a]2[b]\n", "2[2[2[z]]]y\n", "10[ab]1[c]\n"],
  sol: `string s;cin>>s;vector<string>st(1);vector<int>cnt;int k=0;for(char c:s){if(isdigit(c))k=k*10+(c-'0');else if(c=='['){cnt.push_back(k);k=0;st.push_back("");}else if(c==']'){string top=st.back();st.pop_back();int m=cnt.back();cnt.pop_back();string rep;rep.reserve(top.size()*m);for(int i=0;i<m;++i)rep+=top;st.back()+=rep;}else st.back()+=c;}cout<<st.back()<<"\\n";`,
  wrongNote: "Reading only the last digit of a count turns 12[x] into two copies; a count has as many digits as it has.",
  wrong: [
    `string s;cin>>s;vector<string>st(1);vector<int>cnt;int k=0;for(char c:s){if(isdigit(c))k=c-'0';else if(c=='['){cnt.push_back(k);k=0;st.push_back("");}else if(c==']'){string top=st.back();st.pop_back();int m=cnt.back();cnt.pop_back();string rep;for(int i=0;i<m;++i)rep+=top;st.back()+=rep;}else st.back()+=c;}cout<<st.back()<<"\\n";`,
  ],
  gen: (r) => {
    const g = (depth) => { let out = ""; const parts = r.int(1, 3); for (let i = 0; i < parts; i++) { if (depth < 2 && r.int(0, 1)) out += r.int(1, 3) + "[" + g(depth + 1) + "]"; else out += r.str(r.int(1, 2), "ab"); } return out; };
    return g(0) + "\n";
  },
  brute: `string s;cin>>s;size_t p=0;function<string()>parse=[&]()->string{string out;while(p<s.size()&&s[p]!=']'){if(isdigit(s[p])){int k=0;while(isdigit(s[p]))k=k*10+(s[p++]-'0');p++;string in=parse();p++;for(int i=0;i<k;++i)out+=in;}else out+=s[p++];}return out;};cout<<parse()<<"\\n";`,
  big: [
    { seed: 1, note: "a deep nest expanding to 2·10^5 letters", code: `return "2[" * 10 + "ab" * 97 + "]" * 10 + "3[" + text(r, 50, "xyz") + "]"` },
    { seed: 2, note: "a long flat notation", code: `parts = []\nlength = 0\nwhile length < 9000:\n    w = text(r, r.int(1, 4), "abcdefghij")\n    k = r.int(1, 20)\n    parts.append(str(k) + "[" + w + "]")\n    length += len(parts[-1])\nreturn "".join(parts)` },
  ],
});

P.push({
  id: "B671", judge: "math-sum-of-floor-quotients", topic: "math", rating: 1500,
  tag: "Harmonic loops", timeLimitMs: 1000,
  uz: "Butun bo‘linmalar yig‘indisi",
  en: "The sum of floor quotients",
  statementUz: "n soni berilgan. S = ⌊n/1⌋ + ⌊n/2⌋ + ⌊n/3⌋ + … + ⌊n/n⌋ yig‘indisini hisoblang, bu yerda ⌊x⌋ — x dan oshmaydigan eng katta butun son. Boshqacha aytganda, S — 1 dan n gacha bo‘lgan barcha sonlarning bo‘luvchilari soni yig‘indisi. n juda katta bo‘lgani uchun barcha qo‘shiluvchilarni birma-bir qo‘shib chiqish juda sekin.",
  statementEn: "You are given n. Compute S = ⌊n/1⌋ + ⌊n/2⌋ + ⌊n/3⌋ + … + ⌊n/n⌋, where ⌊x⌋ is the largest integer not exceeding x. In other words, S is the total number of divisors of all numbers from 1 to n. Because n is huge, adding the terms one by one is far too slow.",
  inputUz: "Birinchi qatorda testlar soni t, keyingi t ta qatorda bittadan n beriladi.",
  inputEn: "The first line contains the number of test cases t, and each of the next t lines contains one n.",
  outputUz: "Har bir test uchun alohida qatorda S ni chiqaring.",
  outputEn: "For each test case print S on its own line.",
  constraintList: ["1 ≤ t ≤ 5", "1 ≤ n ≤ 10^12", "S fits in a 64-bit integer"],
  constraintListUz: ["1 ≤ t ≤ 5", "1 ≤ n ≤ 10^12", "S 64-bitli butun songa sig‘adi"],
  sampleInputs: ["3\n1\n5\n10\n"],
  expect: ["1\n10\n27\n"],
  sampleNotesUz: ["n = 5: 5 + 2 + 1 + 1 + 1 = 10. n = 10: 10 + 5 + 3 + 2 + 2 + 1 + 1 + 1 + 1 + 1 = 27."],
  sampleNotesEn: ["n = 5: 5 + 2 + 1 + 1 + 1 = 10. n = 10: 10 + 5 + 3 + 2 + 2 + 1 + 1 + 1 + 1 + 1 = 27."],
  testInputs: ["3\n1\n5\n10\n", "2\n2\n3\n", "2\n100\n1000000\n", "2\n999999999999\n1000000000000\n", "1\n16\n"],
  sol: `int t;cin>>t;while(t--){long long n;cin>>n;long long k=sqrtl((long double)n);while(k*k>n)k--;while((k+1)*(k+1)<=n)k++;long long s=0;for(long long i=1;i<=k;++i)s+=n/i;cout<<2*s-k*k<<"\\n";}`,
  wrongNote: "Doubling the sum over i ≤ √n counts the k × k corner twice; it has to be subtracted once.",
  wrong: [
    `int t;cin>>t;while(t--){long long n;cin>>n;long long k=sqrtl((long double)n);while(k*k>n)k--;while((k+1)*(k+1)<=n)k++;long long s=0;for(long long i=1;i<=k;++i)s+=n/i;cout<<2*s<<"\\n";}`,
    `int t;cin>>t;while(t--){long long n;cin>>n;long long k=sqrtl((long double)n);long long s=0;for(long long i=1;i<=k;++i)s+=n/i;cout<<2*s-(k+1)*(k+1)<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => r.int(1, 500) + "\n"),
  brute: `int t;cin>>t;while(t--){long long n;cin>>n;long long s=0;for(long long i=1;i<=n;++i)s+=n/i;cout<<s<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){long long n;cin>>n;long long s=0;for(long long i=1;i<=n;++i)s+=n/i;cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "five values near 10^12: the term-by-term sum is far too slow", code: `return "5\\n" + "\\n".join(str(r.int(9 * 10**11, 10**12)) for _ in range(5))` },
  ],
});

P.push({
  id: "B672", judge: "math-divisors-of-a-factorial", topic: "math", rating: 1500,
  tag: "Sieve", timeLimitMs: 1000,
  uz: "Faktorialning bo‘luvchilari",
  en: "The divisors of a factorial",
  statementUz: "n soni berilgan. n! = 1 · 2 · … · n sonining nechta natural bo‘luvchisi borligini toping. Javob juda katta bo‘lishi mumkin, shuning uchun uni 10^9 + 7 ga bo‘lgandagi qoldiqni chiqaring. Eslatma: agar son tub ko‘paytuvchilarga p_1^e_1 · p_2^e_2 · … ko‘rinishida yoyilsa, uning bo‘luvchilari soni (e_1 + 1) · (e_2 + 1) · … ga teng.",
  statementEn: "You are given n. Find how many positive divisors the number n! = 1 · 2 · … · n has. The answer can be huge, so print it modulo 10^9 + 7. Recall: if a number factors into primes as p_1^e_1 · p_2^e_2 · …, its number of divisors is (e_1 + 1) · (e_2 + 1) · ….",
  inputUz: "Yagona qatorda n beriladi.",
  inputEn: "The only line contains n.",
  outputUz: "Yagona sonni chiqaring — bo‘luvchilar soni 10^9 + 7 modul bo‘yicha.",
  outputEn: "Print a single number — the number of divisors modulo 10^9 + 7.",
  constraintList: ["1 ≤ n ≤ 10^6", "the answer is taken modulo 10^9 + 7", "1! = 0! = 1 has one divisor"],
  constraintListUz: ["1 ≤ n ≤ 10^6", "javob 10^9 + 7 modul bo‘yicha olinadi", "1! = 1 ning bitta bo‘luvchisi bor"],
  sampleInputs: ["4\n", "10\n"],
  expect: ["8\n", "270\n"],
  sampleNotesUz: ["4! = 24 = 2^3 · 3, bo‘luvchilari soni (3 + 1)(1 + 1) = 8. 10! = 2^8 · 3^4 · 5^2 · 7, ya'ni 9 · 5 · 3 · 2 = 270."],
  sampleNotesEn: ["4! = 24 = 2^3 · 3, so it has (3 + 1)(1 + 1) = 8 divisors. 10! = 2^8 · 3^4 · 5^2 · 7, which gives 9 · 5 · 3 · 2 = 270."],
  testInputs: ["4\n", "10\n", "1\n", "2\n", "100\n", "1000000\n", "25\n"],
  sol: `int n;cin>>n;const long long MOD=1000000007;vector<bool>comp(n+1,false);long long ans=1;for(long long p=2;p<=n;++p){if(comp[p])continue;for(long long q=p*p;q<=n;q+=p)comp[q]=true;long long e=0;for(long long q=p;q<=n;q*=p)e+=n/q;ans=ans*((e+1)%MOD)%MOD;}cout<<ans<<"\\n";`,
  wrongNote: "Counting only n / p for each prime forgets the extra factors of p in multiples of p², p³, …; skipping the modulo lets the product overflow.",
  wrong: [
    `int n;cin>>n;const long long MOD=1000000007;vector<bool>comp(n+1,false);long long ans=1;for(long long p=2;p<=n;++p){if(comp[p])continue;for(long long q=p*p;q<=n;q+=p)comp[q]=true;long long e=n/p;ans=ans*((e+1)%MOD)%MOD;}cout<<ans<<"\\n";`,
    `int n;cin>>n;vector<bool>comp(n+1,false);unsigned long long ans=1;for(long long p=2;p<=n;++p){if(comp[p])continue;for(long long q=p*p;q<=n;q+=p)comp[q]=true;long long e=0;for(long long q=p;q<=n;q*=p)e+=n/q;ans*=(e+1);}cout<<ans%1000000007ULL<<"\\n";`,
  ],
  gen: (r) => r.int(1, 18) + "\n",
  brute: `int n;cin>>n;unsigned long long f=1;for(int i=2;i<=n;++i)f*=i;long long c=0;for(unsigned long long d=1;d*d<=f;++d)if(f%d==0)c+=(d*d==f)?1:2;cout<<c%1000000007<<"\\n";`,
  big: [
    { seed: 1, note: "the largest n", code: `return "1000000"` },
  ],
});

P.push({
  id: "B673", judge: "geo-most-points-on-a-line", topic: "geometry", rating: 1500,
  tag: "Hashing", timeLimitMs: 2000,
  uz: "Bitta to‘g‘ri chiziqdagi eng ko‘p nuqta",
  en: "The most points on one line",
  statementUz: "Tekislikda n ta turli nuqta berilgan. Bitta to‘g‘ri chiziq ustida yotgan nuqtalarning eng ko‘p sonini toping. Har qanday ikki nuqta orqali to‘g‘ri chiziq o‘tadi, shuning uchun n ≥ 2 bo‘lsa javob kamida 2. Koordinatalar butun son; qiyaliklarni haqiqiy sonlar bilan solishtirish aniqlikni yo‘qotishi mumkin.",
  statementEn: "n distinct points lie in the plane. Find the largest number of them that lie on one straight line. A line passes through any two points, so for n ≥ 2 the answer is at least 2. The coordinates are integers; comparing slopes as floating-point numbers can lose precision.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida x_i va y_i keladi.",
  inputEn: "The first line contains n. Each of the next n lines contains x_i and y_i.",
  outputUz: "Yagona sonni chiqaring — bitta chiziqdagi nuqtalarning eng ko‘p soni.",
  outputEn: "Print a single number — the largest number of points on one line.",
  constraintList: ["1 ≤ n ≤ 1000", "|x_i|, |y_i| ≤ 10^9", "all points are distinct"],
  constraintListUz: ["1 ≤ n ≤ 1000", "|x_i|, |y_i| ≤ 10^9", "barcha nuqtalar turlicha"],
  sampleInputs: ["6\n1 1\n3 2\n5 3\n4 1\n2 3\n1 4\n", "1\n0 0\n"],
  expect: ["4\n", "1\n"],
  sampleNotesUz: ["(3, 2), (4, 1), (2, 3), (1, 4) bitta chiziqda yotadi: x + y = 5. Bitta nuqtali holatda javob 1."],
  sampleNotesEn: ["(3, 2), (4, 1), (2, 3) and (1, 4) lie on one line: x + y = 5. With a single point the answer is 1."],
  testInputs: ["6\n1 1\n3 2\n5 3\n4 1\n2 3\n1 4\n", "1\n0 0\n", "2\n0 0\n5 7\n", "4\n0 0\n0 1\n0 2\n1 0\n", "5\n0 0\n1 1\n-1 -1\n2 2\n1 -1\n", "4\n0 0\n1000000000 999999999\n999999999 999999998\n1 1\n"],
  sol: `int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];if(n<=2){cout<<n<<"\\n";return 0;}int best=2;for(int i=0;i<n;++i){vector<pair<long long,long long>>d;d.reserve(n);for(int j=0;j<n;++j){if(j==i)continue;long long dx=x[j]-x[i],dy=y[j]-y[i],g=__gcd(llabs(dx),llabs(dy));dx/=g;dy/=g;if(dx<0||(dx==0&&dy<0)){dx=-dx;dy=-dy;}d.push_back(make_pair(dx,dy));}sort(d.begin(),d.end());int run=1;for(size_t k=1;k<=d.size();++k){if(k<d.size()&&d[k]==d[k-1])run++;else{best=max(best,run+1);run=1;}}}cout<<best<<"\\n";`,
  wrongNote: "Not reducing a direction by the gcd makes (1, 1) and (2, 2) count as different lines; comparing slopes as doubles merges directions that differ only past the 16th digit.",
  wrong: [
    `int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];if(n<=2){cout<<n<<"\\n";return 0;}int best=2;for(int i=0;i<n;++i){vector<pair<long long,long long>>d;for(int j=0;j<n;++j){if(j==i)continue;long long dx=x[j]-x[i],dy=y[j]-y[i];if(dx<0||(dx==0&&dy<0)){dx=-dx;dy=-dy;}d.push_back(make_pair(dx,dy));}sort(d.begin(),d.end());int run=1;for(size_t k=1;k<=d.size();++k){if(k<d.size()&&d[k]==d[k-1])run++;else{best=max(best,run+1);run=1;}}}cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];if(n<=2){cout<<n<<"\\n";return 0;}int best=2;for(int i=0;i<n;++i){vector<double>d;for(int j=0;j<n;++j){if(j==i)continue;double dx=x[j]-x[i],dy=y[j]-y[i];d.push_back(dx==0?1e300:dy/dx);}sort(d.begin(),d.end());int run=1;for(size_t k=1;k<=d.size();++k){if(k<d.size()&&d[k]==d[k-1])run++;else{best=max(best,run+1);run=1;}}}cout<<best<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7); const seen = new Set(); let s = ""; let c = 0; while (c < n) { const x = r.int(-3, 3), y = r.int(-3, 3); const k = x + "," + y; if (seen.has(k)) continue; seen.add(k); s += x + " " + y + "\n"; c++; } return n + "\n" + s; },
  brute: `int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];if(n<=2){cout<<n<<"\\n";return 0;}int best=2;for(int i=0;i<n;++i)for(int j=i+1;j<n;++j){int c=0;for(int k=0;k<n;++k)if((x[j]-x[i])*(y[k]-y[i])==(y[j]-y[i])*(x[k]-x[i]))c++;best=max(best,c);}cout<<best<<"\\n";`,
  slow: [`int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];if(n<=2){cout<<n<<"\\n";return 0;}int best=2;for(int i=0;i<n;++i)for(int j=i+1;j<n;++j){int c=0;for(int k=0;k<n;++k)if((__int128)(x[j]-x[i])*(y[k]-y[i])==(__int128)(y[j]-y[i])*(x[k]-x[i]))c++;best=max(best,c);}cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "1000 random points with a hidden line of 200: checking every pair against every point is cubic", code: `pts = set()\nwhile len(pts) < 200:\n    t = r.int(-10**6, 10**6)\n    pts.add((3 * t + 7, -2 * t + 11))\nwhile len(pts) < 1000:\n    pts.add((r.int(-10**9, 10**9), r.int(-10**9, 10**9)))\npts = r.shuffle(sorted(pts))\nreturn "1000\\n" + "\\n".join("%d %d" % p for p in pts)` },
  ],
});

P.push({
  id: "B674", judge: "sort-smallest-maximum-lateness", topic: "sorting", rating: 1500,
  tag: "Exchange argument", timeLimitMs: 1000,
  uz: "Kechikishni kamaytirish",
  en: "Keeping the lateness down",
  statementUz: "Bitta ustada n ta buyurtma bor. i-buyurtmani bajarish d_i soat davom etadi va uning muddati e_i soat. Usta 0-soatdan boshlab buyurtmalarni ketma-ket, tanaffussiz va bittadan bajaradi; tartibni o‘zi tanlaydi. Buyurtma muddatidan keyin tugasa, kechikish — tugash vaqti va muddat ayirmasi, aks holda kechikish 0. Eng katta kechikishning eng kichik qiymatini toping.",
  statementEn: "A craftsman has n orders. Order i takes d_i hours and is due at hour e_i. Starting at hour 0, the craftsman works through the orders one after another, without breaks and one at a time, in an order of their choosing. If an order finishes after its due time, its lateness is the finishing time minus the due time; otherwise it is 0. Find the smallest possible value of the largest lateness.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida d_i va e_i keladi.",
  inputEn: "The first line contains n. Each of the next n lines contains d_i and e_i.",
  outputUz: "Yagona sonni chiqaring — eng katta kechikishning eng kichik qiymati.",
  outputEn: "Print a single number — the smallest possible largest lateness.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ d_i ≤ 10^9", "1 ≤ e_i ≤ 10^18", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ d_i ≤ 10^9", "1 ≤ e_i ≤ 10^18", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n3 4\n2 2\n4 9\n", "2\n5 1\n5 1\n"],
  expect: ["1\n", "9\n"],
  sampleNotesUz: ["Muddati bo‘yicha tartib: (2, 2), (3, 4), (4, 9). Ular 2, 5 va 9-soatda tugaydi; kechikishlar 0, 1, 0 — eng kattasi 1. Ikkinchi namunada ikkinchi buyurtma 10-soatda tugaydi, 9 soat kechikadi."],
  sampleNotesEn: ["By due time the order is (2, 2), (3, 4), (4, 9). They finish at hours 2, 5 and 9; the latenesses are 0, 1, 0 — the largest is 1. In the second sample the second order finishes at hour 10, nine hours late."],
  testInputs: ["3\n3 4\n2 2\n4 9\n", "2\n5 1\n5 1\n", "1\n10 100\n", "3\n1 10\n10 11\n1 2\n", "4\n1000000000 1\n1000000000 2\n1000000000 3\n1000000000 4\n", "3\n5 5\n1 100\n1 6\n"],
  sol: `int n;cin>>n;vector<pair<long long,long long>>v(n);for(auto&x:v)cin>>x.second>>x.first;sort(v.begin(),v.end());long long t=0,best=0;for(auto&x:v){t+=x.second;best=max(best,t-x.first);}cout<<best<<"\\n";`,
  wrongNote: "Doing the shortest orders first minimises the average finishing time, not the worst lateness; an urgent long order then waits behind easy ones.",
  wrong: [
    `int n;cin>>n;vector<pair<long long,long long>>v(n);for(auto&x:v)cin>>x.first>>x.second;sort(v.begin(),v.end());long long t=0,best=0;for(auto&x:v){t+=x.first;best=max(best,t-x.second);}cout<<best<<"\\n";`,
    `int n;cin>>n;vector<pair<long long,long long>>v(n);for(auto&x:v)cin>>x.first>>x.second;long long t=0,best=0;for(auto&x:v){t+=x.first;best=max(best,t-x.second);}cout<<best<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6); let s = n + "\n"; for (let i = 0; i < n; i++) s += r.int(1, 5) + " " + r.int(1, 12) + "\n"; return s; },
  brute: `int n;cin>>n;vector<pair<long long,long long>>v(n);for(auto&x:v)cin>>x.first>>x.second;vector<int>p(n);iota(p.begin(),p.end(),0);long long best=LLONG_MAX;do{long long t=0,w=0;for(int i:p){t+=v[i].first;w=max(w,t-v[i].second);}best=min(best,w);}while(next_permutation(p.begin(),p.end()));cout<<best<<"\\n";`,
  big: [
    { seed: 1, note: "1.2·10^5 orders", code: `n = 120000\nreturn str(n) + "\\n" + "\\n".join("%d %d" % (r.int(1, 10**9), r.int(1, 10**12)) for _ in range(n))` },
  ],
});

export default P;
