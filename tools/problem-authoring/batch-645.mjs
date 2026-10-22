/* Batch 645 — ten problems, A645–B654: eight at 1000–1100 and two at 1200.
 * Part of the fifty added on 2026-10-22 for the 1000–1599 band, where duels
 * draw ~17–21 rounds per problem against ~4 above it. Every task is a
 * well-known exercise restated for AlgoYo'l in our own words, with our own
 * samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A645", judge: "str-reverse-only-vowels", topic: "strings", rating: 1000,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Faqat unlilarni teskari qilish",
  en: "Reversing only the vowels",
  statementUz: "Lotin harflaridan iborat s satri berilgan. Undagi unli harflar — a, e, i, o, u va ularning katta ko‘rinishlari A, E, I, O, U — tartibini teskari qiling, qolgan barcha harflar o‘z joyida qolsin. Ya'ni birinchi unli o‘rniga oxirgi unli, ikkinchisi o‘rniga oxiridan ikkinchisi yoziladi va hokazo; harfning katta-kichikligi u bilan birga ko‘chadi. Hosil bo‘lgan satrni chiqaring.",
  statementEn: "You are given a string s of Latin letters. Reverse the order of its vowels — a, e, i, o, u and their capitals A, E, I, O, U — while every other letter stays where it is. That is, the last vowel takes the place of the first, the second-to-last takes the place of the second, and so on; a letter keeps its case as it moves. Print the resulting string.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda n uzunlikdagi s satri beriladi.",
  inputEn: "The first line contains n, the second the string s of length n.",
  outputUz: "O‘zgartirilgan satrni chiqaring.",
  outputEn: "Print the transformed string.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "s consists of uppercase and lowercase Latin letters", "y is not a vowel here"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "s katta va kichik lotin harflaridan iborat", "bu masalada y unli hisoblanmaydi"],
  sampleInputs: ["8\nalgoritm\n", "6\nAbcdEf\n"],
  expect: ["ilgoratm\n", "EbcdAf\n"],
  sampleNotesUz: ["«algoritm» da unlilar a, o, i; teskari tartibda i, o, a bo‘ladi va o‘sha joylarga yoziladi. Ikkinchi namunada A va E o‘rin almashadi, katta harf bo‘lib qoladi."],
  sampleNotesEn: ["The vowels of \"algoritm\" are a, o, i; reversed they read i, o, a and go back into the same places. In the second sample A and E swap places and stay capitals."],
  testInputs: ["8\nalgoritm\n", "6\nAbcdEf\n", "5\nbcdfg\n", "1\na\n", "10\naAeEiIoOuU\n", "7\nyummyyo\n"],
  sol: `int n;string s;cin>>n>>s;auto v=[](char c){c=tolower(c);return c=='a'||c=='e'||c=='i'||c=='o'||c=='u';};int i=0,j=n-1;while(i<j){while(i<j&&!v(s[i]))i++;while(i<j&&!v(s[j]))j--;if(i<j){swap(s[i],s[j]);i++;j--;}}cout<<s<<"\\n";`,
  wrongNote: "Recognising only the lowercase vowels leaves the capital ones in place; reversing the whole string moves the consonants too.",
  wrong: [
    `int n;string s;cin>>n>>s;auto v=[](char c){return c=='a'||c=='e'||c=='i'||c=='o'||c=='u';};int i=0,j=n-1;while(i<j){while(i<j&&!v(s[i]))i++;while(i<j&&!v(s[j]))j--;if(i<j){swap(s[i],s[j]);i++;j--;}}cout<<s<<"\\n";`,
    `int n;string s;cin>>n>>s;reverse(s.begin(),s.end());cout<<s<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + r.str(n, "abeiouAEyz") + "\n"; },
  brute: `int n;string s;cin>>n>>s;string vs="aeiouAEIOU";vector<int>pos;for(int i=0;i<n;++i)if(vs.find(s[i])!=string::npos)pos.push_back(i);string t=s;for(size_t k=0;k<pos.size();++k)t[pos[k]]=s[pos[pos.size()-1-k]];cout<<t<<"\\n";`,
  big: [
    { seed: 1, note: "a long string, half vowels", code: `n = 200000\nreturn str(n) + "\\n" + text(r, n, "aeiouAEIOUbcdfgBCDFG")` },
  ],
});

P.push({
  id: "A646", judge: "tp-taking-cards-from-the-ends", topic: "two-pointers", rating: 1000,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Chetlardan karta olish",
  en: "Taking cards from the ends",
  statementUz: "Stolda bir qatorda n ta karta yotibdi, har birida turli son yozilgan. Ikki o‘yinchi navbatma-navbat yurishadi, birinchi bo‘lib Ali yuradi. Har bir yurishda o‘yinchi qatorning chap yoki o‘ng chetidagi kartani oladi va har doim shu ikkalasidan kattasini tanlaydi (bitta karta qolsa, uni oladi). Kartalar tugaganda har bir o‘yinchining kartalaridagi sonlar yig‘indisini toping.",
  statementEn: "n cards lie in a row on a table, each with a different number written on it. Two players move in turns, and Ali moves first. On each move the player takes the card at the left or the right end of the row, and always takes the larger of the two (when one card is left, they take it). When the cards run out, find the sum of the numbers on each player's cards.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda n ta turli son a_1, …, a_n beriladi.",
  inputEn: "The first line contains n, the second the n distinct numbers a_1, …, a_n.",
  outputUz: "Ikkita sonni chiqaring: Ali va ikkinchi o‘yinchining yig‘indilari.",
  outputEn: "Print two numbers: Ali's sum and the second player's sum.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "all numbers are different", "the sums can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "barcha sonlar turlicha", "yig‘indilar 2^31 dan oshishi mumkin"],
  sampleInputs: ["4\n4 1 2 10\n", "7\n1 2 3 4 5 6 7\n"],
  expect: ["12 5\n", "16 12\n"],
  sampleNotesUz: ["Ali 10 ni oladi, ikkinchi o‘yinchi 4 ni, Ali 2 ni, ikkinchisi 1 ni: 12 va 5."],
  sampleNotesEn: ["Ali takes 10, the second player 4, Ali 2, the second player 1: 12 and 5."],
  testInputs: ["4\n4 1 2 10\n", "7\n1 2 3 4 5 6 7\n", "1\n5\n", "2\n3 9\n", "5\n10 1 20 2 30\n", "4\n1000000000 999999999 999999998 999999997\n", "6\n1000000000 999999999 999999998 999999997 999999996 999999995\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s[2]={0,0};int i=0,j=n-1,p=0;while(i<=j){if(a[i]>a[j])s[p]+=a[i++];else s[p]+=a[j--];p^=1;}cout<<s[0]<<" "<<s[1]<<"\\n";`,
  wrongNote: "Always taking the left card ignores the rule; summing into 32-bit integers overflows once a few cards near 10^9 are added.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s[2]={0,0};for(int i=0;i<n;++i)s[i%2]+=a[i];cout<<s[0]<<" "<<s[1]<<"\\n";`,
    `int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int s[2]={0,0};int i=0,j=n-1,p=0;while(i<=j){if(a[i]>a[j])s[p]+=a[i++];else s[p]+=a[j--];p^=1;}cout<<s[0]<<" "<<s[1]<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 8); return n + "\n" + line(r.perm(20).slice(0, n)) + "\n"; },
  brute: `int n;cin>>n;deque<long long>d;for(int i=0;i<n;++i){long long x;cin>>x;d.push_back(x);}long long s[2]={0,0};int p=0;while(!d.empty()){long long x;if(d.front()>d.back()){x=d.front();d.pop_front();}else{x=d.back();d.pop_back();}s[p]+=x;p=1-p;}cout<<s[0]<<" "<<s[1]<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 distinct large numbers", code: `n = 200000\na = r.shuffle(list(range(10**9 - n + 1, 10**9 + 1)))\nreturn str(n) + "\\n" + line(a)` },
  ],
});

P.push({
  id: "A647", judge: "math-lucky-tickets-count", topic: "math", rating: 1000,
  tag: "Digits", timeLimitMs: 1000,
  uz: "Omadli chiptalar",
  en: "Lucky tickets",
  statementUz: "Avtobus chiptasining raqami oltita raqamdan iborat (bosh nollar ham yoziladi, masalan 001200). Agar dastlabki uchta raqam yig‘indisi oxirgi uchta raqam yig‘indisiga teng bo‘lsa, chipta omadli hisoblanadi: 123006 omadli, chunki 1 + 2 + 3 = 0 + 0 + 6. Sizga n ta chipta raqami berilgan. Ulardan nechtasi omadli ekanini toping.",
  statementEn: "A bus ticket number consists of six digits (leading zeros are written too, for example 001200). A ticket is lucky if the sum of its first three digits equals the sum of its last three: 123006 is lucky because 1 + 2 + 3 = 0 + 0 + 6. You are given n ticket numbers. Find how many of them are lucky.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida oltita raqamdan iborat chipta raqami keladi.",
  inputEn: "The first line contains n. Each of the next n lines contains a six-digit ticket number.",
  outputUz: "Yagona sonni chiqaring — omadli chiptalar soni.",
  outputEn: "Print a single number — the number of lucky tickets.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "every ticket has exactly six digits, leading zeros included", "the same number may appear more than once"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "har bir chipta aynan olti raqamdan iborat, bosh nollar bilan", "bir xil raqam bir necha marta uchrashi mumkin"],
  sampleInputs: ["4\n123006\n000000\n123456\n990981\n"],
  expect: ["3\n"],
  sampleNotesUz: ["123006, 000000 va 990981 omadli (9 + 9 + 0 = 9 + 8 + 1). 123456 da 6 ≠ 15."],
  sampleNotesEn: ["123006, 000000 and 990981 are lucky (9 + 9 + 0 = 9 + 8 + 1). For 123456, 6 ≠ 15."],
  testInputs: ["4\n123006\n000000\n123456\n990981\n", "1\n999999\n", "3\n100001\n010010\n001100\n", "4\n102030\n120300\n111003\n909009\n", "2\n500005\n050500\n"],
  sol: `int n;cin>>n;int c=0;while(n--){string s;cin>>s;c+=(s[0]+s[1]+s[2])==(s[3]+s[4]+s[5]);}cout<<c<<"\\n";`,
  wrongNote: "Comparing the digits in odd and even positions is a different rule; so is comparing the first and last digits alone.",
  wrong: [
    `int n;cin>>n;int c=0;while(n--){string s;cin>>s;c+=(s[0]+s[2]+s[4])==(s[1]+s[3]+s[5]);}cout<<c<<"\\n";`,
    `int n;cin>>n;int c=0;while(n--){string s;cin>>s;c+=(s[0]+s[1])==(s[4]+s[5]);}cout<<c<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6); let s = n + "\n"; for (let i = 0; i < n; i++) s += r.str(6, "0123") + "\n"; return s; },
  brute: `int n;cin>>n;int c=0;while(n--){string s;cin>>s;int a=0,b=0;for(int i=0;i<6;++i){if(i<3)a+=s[i]-'0';else b+=s[i]-'0';}if(a==b)c++;}cout<<c<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 tickets", code: `n = 200000\nreturn str(n) + "\\n" + "\\n".join("%06d" % r.int(0, 999999) for _ in range(n))` },
  ],
});

P.push({
  id: "A648", judge: "math-odds-then-evens", topic: "math", rating: 1000,
  tag: "Formulas", timeLimitMs: 1000,
  uz: "Avval toqlar, keyin juftlar",
  en: "Odds first, then evens",
  statementUz: "1 dan n gacha bo‘lgan sonlar yangi tartibda yozildi: avval barcha toq sonlar o‘sish tartibida, so‘ng barcha juft sonlar o‘sish tartibida. Masalan, n = 7 bo‘lsa, ketma-ketlik 1, 3, 5, 7, 2, 4, 6 bo‘ladi. Har bir so‘rovda n va k beriladi: shu ketma-ketlikning k-o‘rnida qaysi son turadi? Sonlar juda katta bo‘lishi mumkin, shuning uchun ro‘yxatni yozib chiqish iloji yo‘q.",
  statementEn: "The numbers from 1 to n were written in a new order: first all the odd numbers in increasing order, then all the even numbers in increasing order. For example, for n = 7 the sequence is 1, 3, 5, 7, 2, 4, 6. Each query gives n and k: which number stands in position k of that sequence? The numbers can be huge, so writing the list out is not an option.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida n va k keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains n and k.",
  outputUz: "Har bir so‘rov uchun alohida qatorda k-o‘rindagi sonni chiqaring.",
  outputEn: "For each query print the number in position k on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ k ≤ n ≤ 10^18", "positions are counted from 1"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ k ≤ n ≤ 10^18", "o‘rinlar 1 dan sanaladi"],
  sampleInputs: ["4\n7 5\n7 4\n10 3\n1 1\n"],
  expect: ["2\n7\n5\n1\n"],
  sampleNotesUz: ["n = 7 da toq sonlar to‘rtta: 1, 3, 5, 7. Beshinchi o‘rinda birinchi juft son 2 turadi, to‘rtinchida esa 7."],
  sampleNotesEn: ["For n = 7 there are four odd numbers: 1, 3, 5, 7. Position five holds the first even number, 2, and position four holds 7."],
  testInputs: ["4\n7 5\n7 4\n10 3\n1 1\n", "2\n10 5\n10 6\n", "3\n1000000000000000000 1000000000000000000\n1000000000000000000 500000000000000000\n999999999999999999 500000000000000000\n", "2\n2 2\n3 3\n"],
  sol: `int t;cin>>t;while(t--){long long n,k;cin>>n>>k;long long odd=(n+1)/2;if(k<=odd)cout<<2*k-1<<"\\n";else cout<<2*(k-odd)<<"\\n";}`,
  wrongNote: "Counting the odd numbers as n / 2 misses the last one whenever n is odd.",
  wrong: [
    `int t;cin>>t;while(t--){long long n,k;cin>>n>>k;long long odd=n/2;if(k<=odd)cout<<2*k-1<<"\\n";else cout<<2*(k-odd)<<"\\n";}`,
    `int t;cin>>t;while(t--){long long n,k;cin>>n>>k;long long odd=(n+1)/2;if(k<odd)cout<<2*k-1<<"\\n";else cout<<2*(k-odd)<<"\\n";}`,
  ],
  gen: (r) => tests(r, 5, (r) => { const n = r.int(1, 20); return n + " " + r.int(1, n) + "\n"; }),
  brute: `int t;cin>>t;while(t--){long long n,k;cin>>n>>k;vector<long long>v;for(long long i=1;i<=n;i+=2)v.push_back(i);for(long long i=2;i<=n;i+=2)v.push_back(i);cout<<v[k-1]<<"\\n";}`,
  big: [
    { seed: 1, note: "10^4 queries with n up to 10^18", code: `q = []\nfor _ in range(10000):\n    n = r.int(1, 10**18)\n    q.append(str(n) + " " + str(r.int(1, n)))\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

P.push({
  id: "A649", judge: "geo-rectangle-fourth-corner", topic: "geometry", rating: 1000,
  tag: "Geometry", timeLimitMs: 1000,
  uz: "To‘rtburchakning to‘rtinchi uchi",
  en: "The fourth corner",
  statementUz: "Tomonlari koordinata o‘qlariga parallel bo‘lgan, yuzi noldan katta to‘g‘ri to‘rtburchakning uchta uchi ixtiyoriy tartibda berilgan. Uning to‘rtinchi uchini toping. Har bir so‘rovda uchta nuqta turli, va ular haqiqatan ham shunday to‘rtburchakning uchlari ekani kafolatlanadi.",
  statementEn: "Three corners of a rectangle with sides parallel to the coordinate axes and a positive area are given in an arbitrary order. Find its fourth corner. In every query the three points are distinct, and they are guaranteed to be corners of such a rectangle.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida oltita son keladi: x1 y1 x2 y2 x3 y3.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains six numbers: x1 y1 x2 y2 x3 y3.",
  outputUz: "Har bir so‘rov uchun alohida qatorda to‘rtinchi uchning koordinatalarini chiqaring.",
  outputEn: "For each query print the coordinates of the fourth corner on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "−10^9 ≤ coordinates ≤ 10^9", "the corners come in any order"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "−10^9 ≤ koordinatalar ≤ 10^9", "uchlar ixtiyoriy tartibda keladi"],
  sampleInputs: ["3\n0 0 0 2 3 0\n5 5 1 1 1 5\n-1 4 2 4 -1 -3\n"],
  expect: ["3 2\n5 1\n2 -3\n"],
  sampleNotesUz: ["Birinchi so‘rovda x = 3 bir marta, y = 2 ham bir marta uchraydi — to‘rtinchi uch (3, 2). Ikkinchisida (5, 1)."],
  sampleNotesEn: ["In the first query x = 3 appears once and so does y = 2 — the fourth corner is (3, 2). In the second it is (5, 1)."],
  testInputs: ["3\n0 0 0 2 3 0\n5 5 1 1 1 5\n-1 4 2 4 -1 -3\n", "1\n1000000000 -1000000000 -1000000000 -1000000000 -1000000000 1000000000\n", "2\n7 3 2 3 7 9\n2 9 7 9 2 3\n", "2\n4 4 4 8 1 8\n1 4 4 8 4 4\n"],
  sol: `int t;cin>>t;while(t--){long long x1,y1,x2,y2,x3,y3;cin>>x1>>y1>>x2>>y2>>x3>>y3;long long x=x1==x2?x3:(x1==x3?x2:x1),y=y1==y2?y3:(y1==y3?y2:y1);cout<<x<<" "<<y<<"\\n";}`,
  wrongNote: "Taking x1 + x2 − x3 only works when the third point is the corner opposite the missing one; the points come in any order.",
  wrong: [
    `int t;cin>>t;while(t--){long long x1,y1,x2,y2,x3,y3;cin>>x1>>y1>>x2>>y2>>x3>>y3;cout<<x1+x2-x3<<" "<<y1+y2-y3<<"\\n";}`,
  ],
  gen: (r) => tests(r, 4, (r) => {
    const xa = r.int(-5, 5); let xb = r.int(-5, 5); if (xb === xa) xb = xa + 1;
    const ya = r.int(-5, 5); let yb = r.int(-5, 5); if (yb === ya) yb = ya + 1;
    const pts = r.shuffle([[xa, ya], [xa, yb], [xb, ya], [xb, yb]]).slice(0, 3);
    return pts.map((p) => p.join(" ")).join(" ") + "\n";
  }),
  brute: `int t;cin>>t;while(t--){long long x[3],y[3];for(int i=0;i<3;++i)cin>>x[i]>>y[i];bool done=false;for(int i=0;i<3&&!done;++i)for(int j=0;j<3&&!done;++j){long long cx=x[i],cy=y[j];bool given=false;for(int k=0;k<3;++k)if(x[k]==cx&&y[k]==cy)given=true;if(given)continue;set<long long>X={x[0],x[1],x[2],cx},Y={y[0],y[1],y[2],cy};if(X.size()==2&&Y.size()==2){cout<<cx<<" "<<cy<<"\\n";done=true;}}}`,
  big: [
    { seed: 1, note: "10^4 rectangles with large coordinates", code: `q = []\nfor _ in range(10000):\n    xa = r.int(-10**9, 10**9 - 1); xb = r.int(xa + 1, 10**9)\n    ya = r.int(-10**9, 10**9 - 1); yb = r.int(ya + 1, 10**9)\n    pts = r.shuffle([(xa, ya), (xa, yb), (xb, ya), (xb, yb)])[:3]\n    q.append(" ".join("%d %d" % p for p in pts))\nreturn "10000\\n" + "\\n".join(q)` },
  ],
});

/* ------------------------------------------------------------------ 1100 */
P.push({
  id: "A650", judge: "greedy-every-kth-item-free", topic: "greedy", rating: 1100,
  tag: "Sorting and greedy", timeLimitMs: 1000,
  uz: "Har k-chi buyum bepul",
  en: "Every k-th item free",
  statementUz: "Do‘konda aksiya: xaridor buyumlarini k tadan iborat guruhlarga ajratib to‘lashi mumkin, va har bir to‘liq guruhdagi eng arzon buyum bepul beriladi. Guruhga kirmagan (k tadan kam qolgan) buyumlar to‘liq narxda to‘lanadi. Xaridor n ta buyumning hammasini sotib olmoqchi va ularni guruhlarga o‘zi xohlagancha ajratadi. U to‘laydigan eng kam summani toping.",
  statementEn: "A shop runs a promotion: a customer may split their items into groups of k, and in every full group the cheapest item is free. Items left outside the groups (fewer than k remaining) are paid in full. The customer wants to buy all n items and splits them into groups however they like. Find the smallest amount they have to pay.",
  inputUz: "Birinchi qatorda n va k, ikkinchi qatorda n ta narx p_1, …, p_n beriladi.",
  inputEn: "The first line contains n and k, the second the n prices p_1, …, p_n.",
  outputUz: "Yagona sonni chiqaring — eng kam summa.",
  outputEn: "Print a single number — the smallest amount.",
  constraintList: ["2 ≤ n ≤ 2·10^5", "2 ≤ k ≤ n", "1 ≤ p_i ≤ 10^9", "the answer can exceed 2^31"],
  constraintListUz: ["2 ≤ n ≤ 2·10^5", "2 ≤ k ≤ n", "1 ≤ p_i ≤ 10^9", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["7 3\n5 1 8 3 10 2 7\n", "3 2\n4 4 4\n"],
  expect: ["27\n", "8\n"],
  sampleNotesUz: ["Narxlarni kamayish tartibida (10, 8, 7) va (5, 3, 2) guruhlarga ajratamiz, 1 esa guruhsiz qoladi. Bepul buyumlar 7 va 2, shuning uchun 36 − 7 − 2 = 27 to‘lanadi. Ikkinchi namunada bitta to‘liq guruh bor, bitta 4 bepul."],
  sampleNotesEn: ["Sorted from the most expensive, the groups are (10, 8, 7) and (5, 3, 2), and the 1 stays outside. The free items are 7 and 2, so the customer pays 36 − 7 − 2 = 27. In the second sample there is one full group, so one 4 is free."],
  testInputs: ["7 3\n5 1 8 3 10 2 7\n", "3 2\n4 4 4\n", "2 2\n1 100\n", "5 5\n9 8 7 6 5\n", "6 2\n1 2 3 4 5 6\n", "4 3\n1000000000 1000000000 1000000000 1\n"],
  sol: `int n,k;cin>>n>>k;vector<long long>p(n);long long s=0;for(auto&x:p){cin>>x;s+=x;}sort(p.rbegin(),p.rend());for(int i=k-1;i<n;i+=k)s-=p[i];cout<<s<<"\\n";`,
  wrongNote: "Grouping the items from the cheapest end puts the three cheapest together, so only a tiny price is waived; the free items should be as expensive as possible.",
  wrong: [
    `int n,k;cin>>n>>k;vector<long long>p(n);long long s=0;for(auto&x:p){cin>>x;s+=x;}sort(p.begin(),p.end());for(int i=0;i+k<=n;i+=k)s-=p[i];cout<<s<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(2, 7), k = r.int(2, n); return n + " " + k + "\n" + line(r.ints(n, 1, 9)) + "\n"; },
  brute: `int n,k;cin>>n>>k;vector<long long>p(n);for(auto&x:p)cin>>x;if(k>n){cout<<accumulate(p.begin(),p.end(),0LL)<<"\\n";return 0;}sort(p.begin(),p.end());long long best=LLONG_MAX;do{long long s=0;for(int i=0;i<n;i+=k){if(i+k<=n){long long mn=LLONG_MAX,sum=0;for(int j=i;j<i+k;++j){sum+=p[j];mn=min(mn,p[j]);}s+=sum-mn;}else for(int j=i;j<n;++j)s+=p[j];}best=min(best,s);}while(next_permutation(p.begin(),p.end()));cout<<best<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 prices, k = 3", code: `n = 200000\nreturn str(n) + " 3\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "A651", judge: "ds-first-unique-in-a-stream", topic: "data-structures", rating: 1100,
  tag: "Queue", timeLimitMs: 1000,
  uz: "Oqimdagi birinchi takrorlanmagan harf",
  en: "The first unrepeated letter in a stream",
  statementUz: "Harflar birma-bir kelib turadi va s satrini hosil qiladi. Har bir harf kelgandan keyin shu paytgacha kelgan harflar orasida faqat bir marta uchragan harflardan eng birinchi kelganini aytish kerak. Agar bunday harf bo‘lmasa, «#» belgisini yozing. Barcha javoblarni ketma-ket bitta satr qilib chiqaring.",
  statementEn: "Letters arrive one by one and form the string s. After each letter arrives you must name, among the letters received so far, the earliest-arriving one that has appeared exactly once. If there is no such letter, write the character \"#\". Print all the answers one after another as a single string.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda kichik lotin harflaridan iborat n uzunlikdagi s satri beriladi.",
  inputEn: "The first line contains n, the second the string s of n lowercase Latin letters.",
  outputUz: "n uzunlikdagi satrni chiqaring: i-belgisi — dastlabki i ta harfdan keyingi javob.",
  outputEn: "Print a string of length n: its i-th character is the answer after the first i letters.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "s consists of lowercase Latin letters", "\"#\" means no letter has appeared exactly once"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "s kichik lotin harflaridan iborat", "«#» — hech bir harf aynan bir marta uchramagan"],
  sampleInputs: ["6\naabcbc\n", "4\nabcd\n"],
  expect: ["a#bbc#\n", "aaaa\n"],
  sampleNotesUz: ["Birinchi «a» dan keyin javob «a». Ikkinchi «a» dan keyin takrorlanmagan harf yo‘q — «#». Keyin «b» keladi, so‘ng «c»; «b» ikkinchi marta kelganda birinchilik «c» ga o‘tadi, oxirida «c» ham takrorlanadi."],
  sampleNotesEn: ["After the first \"a\" the answer is \"a\". After the second \"a\" no letter is unrepeated — \"#\". Then \"b\" arrives, then \"c\"; when \"b\" comes again the lead passes to \"c\", and in the end \"c\" repeats too."],
  testInputs: ["6\naabcbc\n", "4\nabcd\n", "1\nz\n", "8\nabacabad\n", "5\nzzzzz\n", "7\nabcabcd\n"],
  sol: `int n;string s;cin>>n>>s;int c[26]={};queue<char>q;string out;for(char ch:s){c[ch-'a']++;q.push(ch);while(!q.empty()&&c[q.front()-'a']>1)q.pop();out+=q.empty()?'#':q.front();}cout<<out<<"\\n";`,
  wrongNote: "Keeping only the newest letter that is still unrepeated answers the wrong end of the queue; never dropping letters that have repeated keeps naming a letter that is no longer unique.",
  wrong: [
    `int n;string s;cin>>n>>s;int c[26]={};string out;char last='#';for(char ch:s){c[ch-'a']++;if(c[ch-'a']==1)last=ch;else if(last==ch)last='#';out+=last;}cout<<out<<"\\n";`,
    `int n;string s;cin>>n>>s;int c[26]={};char first='#';string out;for(char ch:s){c[ch-'a']++;if(first=='#'&&c[ch-'a']==1)first=ch;out+=first;}cout<<out<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + r.str(n, "abc") + "\n"; },
  brute: `int n;string s;cin>>n>>s;string out;for(int i=0;i<n;++i){char ans='#';for(int j=0;j<=i&&ans=='#';++j){int cnt=0;for(int k=0;k<=i;++k)cnt+=s[k]==s[j];if(cnt==1)ans=s[j];}out+=ans;}cout<<out<<"\\n";`,
  big: [
    { seed: 1, note: "a long stream over the whole alphabet", code: `n = 200000\nreturn str(n) + "\\n" + text(r, n, "abcdefghijklmnopqrstuvwxyz")` },
  ],
});

P.push({
  id: "A652", judge: "fnd-matrix-multiplication", topic: "foundations", rating: 1100,
  tag: "Matrices", timeLimitMs: 1000,
  uz: "Matritsalarni ko‘paytirish",
  en: "Multiplying matrices",
  statementUz: "n × m o‘lchamli A matritsasi va m × p o‘lchamli B matritsasi berilgan. Ularning C = A · B ko‘paytmasini hisoblang: C — n × p o‘lchamli matritsa, uning i-qator va j-ustundagi elementi A ning i-qatori va B ning j-ustuni elementlari juft-juft ko‘paytmalarining yig‘indisiga teng: C[i][j] = A[i][1] · B[1][j] + A[i][2] · B[2][j] + … + A[i][m] · B[m][j].",
  statementEn: "You are given an n × m matrix A and an m × p matrix B. Compute their product C = A · B: C is an n × p matrix whose element in row i and column j is the sum of the pairwise products of row i of A and column j of B: C[i][j] = A[i][1] · B[1][j] + A[i][2] · B[2][j] + … + A[i][m] · B[m][j].",
  inputUz: "Birinchi qatorda n, m va p beriladi. Keyingi n ta qatorda A ning qatorlari (har birida m ta son), so‘ng m ta qatorda B ning qatorlari (har birida p ta son) keladi.",
  inputEn: "The first line contains n, m and p. The next n lines hold the rows of A (m numbers each), then m lines hold the rows of B (p numbers each).",
  outputUz: "n ta qatorda C matritsasini chiqaring, har bir qatorda p ta son.",
  outputEn: "Print the matrix C in n lines of p numbers each.",
  constraintList: ["1 ≤ n, m, p ≤ 150", "|elements| ≤ 10^5", "the entries of C can exceed 2^31"],
  constraintListUz: ["1 ≤ n, m, p ≤ 150", "|elementlar| ≤ 10^5", "C ning elementlari 2^31 dan oshishi mumkin"],
  sampleInputs: ["2 3 2\n1 2 3\n4 5 6\n7 8\n9 10\n11 12\n", "1 1 1\n-3\n4\n"],
  expect: ["58 64\n139 154\n", "-12\n"],
  sampleNotesUz: ["C[1][1] = 1 · 7 + 2 · 9 + 3 · 11 = 58, C[2][2] = 4 · 8 + 5 · 10 + 6 · 12 = 154."],
  sampleNotesEn: ["C[1][1] = 1 · 7 + 2 · 9 + 3 · 11 = 58, and C[2][2] = 4 · 8 + 5 · 10 + 6 · 12 = 154."],
  testInputs: ["2 3 2\n1 2 3\n4 5 6\n7 8\n9 10\n11 12\n", "1 1 1\n-3\n4\n", "2 2 2\n100000 100000\n100000 -100000\n100000 100000\n100000 100000\n", "3 1 3\n1\n2\n3\n4 5 6\n", "1 3 1\n1 1 1\n1\n2\n3\n"],
  sol: `int n,m,p;cin>>n>>m>>p;vector<vector<long long>>A(n,vector<long long>(m)),B(m,vector<long long>(p));for(auto&r:A)for(auto&x:r)cin>>x;for(auto&r:B)for(auto&x:r)cin>>x;
for(int i=0;i<n;++i){for(int j=0;j<p;++j){long long s=0;for(int k=0;k<m;++k)s+=A[i][k]*B[k][j];cout<<s<<(j+1<p?' ':'\\n');}}`,
  wrongNote: "Multiplying in 32-bit integers overflows as soon as two entries near 10^5 meet; reading B by row instead of by column computes A · Bᵀ, which only happens to match for symmetric matrices.",
  wrong: [
    `int n,m,p;cin>>n>>m>>p;vector<vector<int>>A(n,vector<int>(m)),B(m,vector<int>(p));for(auto&r:A)for(auto&x:r)cin>>x;for(auto&r:B)for(auto&x:r)cin>>x;
for(int i=0;i<n;++i){for(int j=0;j<p;++j){int s=0;for(int k=0;k<m;++k)s+=A[i][k]*B[k][j];cout<<s<<(j+1<p?' ':'\\n');}}`,
  ],
  gen: (r) => {
    const n = r.int(1, 3), m = r.int(1, 3), p = r.int(1, 3);
    let s = n + " " + m + " " + p + "\n";
    for (let i = 0; i < n; i++) s += line(r.ints(m, -5, 5)) + "\n";
    for (let i = 0; i < m; i++) s += line(r.ints(p, -5, 5)) + "\n";
    return s;
  },
  brute: `int n,m,p;cin>>n>>m>>p;vector<vector<long long>>A(n,vector<long long>(m)),B(m,vector<long long>(p)),C(n,vector<long long>(p,0));for(auto&r:A)for(auto&x:r)cin>>x;for(auto&r:B)for(auto&x:r)cin>>x;
for(int k=0;k<m;++k)for(int i=0;i<n;++i)for(int j=0;j<p;++j)C[i][j]+=A[i][k]*B[k][j];for(int i=0;i<n;++i){for(int j=0;j<p;++j)cout<<C[i][j]<<(j+1<p?' ':'\\n');}`,
  big: [
    { seed: 1, note: "the largest matrices", code: `n = m = p = 150\nrows = [line(r.ints(m, -10**5, 10**5)) for _ in range(n)] + [line(r.ints(p, -10**5, 10**5)) for _ in range(m)]\nreturn "150 150 150\\n" + "\\n".join(rows)` },
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B653", judge: "tp-palindrome-after-one-deletion", topic: "two-pointers", rating: 1200,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Bitta harfni o‘chirib palindrom",
  en: "A palindrome after one deletion",
  statementUz: "Kichik lotin harflaridan iborat s satri berilgan. Undan ko‘pi bilan bitta harfni o‘chirib (yoki hech narsa o‘chirmasdan), palindrom hosil qilish mumkinmi? Palindrom — chapdan o‘ngga va o‘ngdan chapga bir xil o‘qiladigan satr, masalan «abba» yoki «racecar». O‘chirilgan harfdan keyin qolgan harflar tartibi o‘zgarmaydi. Har bir test uchun javob bering.",
  statementEn: "You are given a string s of lowercase Latin letters. Can it become a palindrome after deleting at most one letter (or deleting nothing)? A palindrome reads the same from left to right and from right to left, like \"abba\" or \"racecar\". The remaining letters keep their order after the deletion. Answer for every test case.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n uzunlikdagi satr.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the string of length n.",
  outputUz: "Har bir test uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each test case print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "s consists of lowercase Latin letters"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "s kichik lotin harflaridan iborat"],
  sampleInputs: ["4\n4\nabca\n3\naba\n4\nabcd\n5\ncabac\n"],
  expect: ["YES\nYES\nNO\nYES\n"],
  sampleNotesUz: ["«abca» dan «b» yoki «c» ni o‘chirsak, «aca» yoki «aba» qoladi. «aba» allaqachon palindrom. «abcd» dan bitta harf o‘chirish yetmaydi."],
  sampleNotesEn: ["Deleting \"b\" or \"c\" from \"abca\" leaves \"aca\" or \"aba\". \"aba\" is already a palindrome. One deletion is not enough for \"abcd\"."],
  testInputs: ["4\n4\nabca\n3\naba\n4\nabcd\n5\ncabac\n", "1\n1\nz\n", "2\n7\nabccbxa\n7\naxbccba\n", "2\n5\nebcbe\n6\nebcbeb\n", "1\n8\naabbccdd\n", "2\n6\ncbbcac\n6\ncacbbc\n"],
  sol: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;auto pal=[&](int i,int j){while(i<j){if(s[i]!=s[j])return false;i++;j--;}return true;};int i=0,j=n-1;while(i<j&&s[i]==s[j]){i++;j--;}bool ok=i>=j||pal(i+1,j)||pal(i,j-1);cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "At the first mismatch both deletions must be tried; trying only the left one misses strings like \"axbccba\" where the stray letter is on the right.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;auto pal=[&](int i,int j){while(i<j){if(s[i]!=s[j])return false;i++;j--;}return true;};int i=0,j=n-1;while(i<j&&s[i]==s[j]){i++;j--;}bool ok=i>=j||pal(i+1,j);cout<<(ok?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int bad=0;for(int i=0,j=n-1;i<j;++i,--j)bad+=s[i]!=s[j];cout<<(bad<=1?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 8); return n + "\n" + r.str(n, "abc") + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;auto isp=[](const string&x){string y=x;reverse(y.begin(),y.end());return x==y;};bool ok=isp(s);for(int i=0;i<n&&!ok;++i)if(isp(s.substr(0,i)+s.substr(i+1)))ok=true;cout<<(ok?"YES":"NO")<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){int n;string s;cin>>n>>s;auto isp=[](const string&x){string y=x;reverse(y.begin(),y.end());return x==y;};bool ok=isp(s);for(int i=0;i<n&&!ok;++i)if(isp(s.substr(0,i)+s.substr(i+1)))ok=true;cout<<(ok?"YES":"NO")<<"\\n";}`],
  big: [
    { seed: 1, note: "a long palindrome with one stray letter near the middle, and no early exit", code: `h = 99999\nleft = text(r, h, "ab")\ns = left + "c" + left[::-1]\ns = s[:h + 5] + "z" + s[h + 5:]\nreturn "1\\n" + str(len(s)) + "\\n" + s` },
    { seed: 2, note: "a long non-palindrome", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "ab")` },
  ],
});

P.push({
  id: "B654", judge: "tp-most-even-team", topic: "two-pointers", rating: 1200,
  tag: "Sorting and two pointers", timeLimitMs: 1000,
  uz: "Teng kuchli jamoa",
  en: "A balanced team",
  statementUz: "n ta o‘quvchi bor, i-o‘quvchining mahorati a_i ga teng. Jamoaga o‘quvchilarni shunday tanlash kerakki, istalgan ikki jamoa a'zosining mahorati ko‘pi bilan d ga farq qilsin. Shunday jamoa iloji boricha ko‘p o‘quvchidan iborat bo‘lsin. Jamoaga kira oladigan o‘quvchilarning eng ko‘p sonini toping (bitta o‘quvchidan iborat jamoa doim mumkin).",
  statementEn: "There are n students, and student i has skill a_i. A team must be chosen so that the skills of any two of its members differ by at most d, and the team should be as large as possible. Find the largest number of students such a team can have (a team of one student is always possible).",
  inputUz: "Birinchi qatorda n va d, ikkinchi qatorda n ta son a_1, …, a_n beriladi.",
  inputEn: "The first line contains n and d, the second the n numbers a_1, …, a_n.",
  outputUz: "Yagona sonni chiqaring — jamoaning eng katta hajmi.",
  outputEn: "Print a single number — the largest team size.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ d ≤ 10^9", "1 ≤ a_i ≤ 10^9", "the condition is on every pair, not just neighbours"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "0 ≤ d ≤ 10^9", "1 ≤ a_i ≤ 10^9", "shart har bir juftlik uchun, faqat qo‘shnilar uchun emas"],
  sampleInputs: ["6 5\n1 10 17 12 15 2\n", "4 0\n7 7 3 7\n"],
  expect: ["3\n", "3\n"],
  sampleNotesUz: ["Mahorati 10, 12 va 15 bo‘lgan o‘quvchilar: eng katta farq 15 − 10 = 5. To‘rtta o‘quvchini tanlab bo‘lmaydi. Ikkinchi namunada d = 0, demak faqat teng mahoratlilar: uchta 7."],
  sampleNotesEn: ["The students with skills 10, 12 and 15: the largest difference is 15 − 10 = 5, and no four students work. In the second sample d = 0, so only equal skills fit: the three 7s."],
  testInputs: ["6 5\n1 10 17 12 15 2\n", "4 0\n7 7 3 7\n", "1 100\n5\n", "5 2\n1 2 3 4 5\n", "6 10\n1 2 3 1000 1001 1002\n", "4 1000000000\n1 1000000000 500 7\n"],
  sol: `int n;long long d;cin>>n>>d;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());int best=0;for(int l=0,r=0;r<n;++r){while(a[r]-a[l]>d)l++;best=max(best,r-l+1);}cout<<best<<"\\n";`,
  wrongNote: "Chaining students whose neighbouring skills differ by at most d lets the spread grow beyond d along the chain: 1, 2, 3, 4, 5 with d = 2 is not one team.",
  wrong: [
    `int n;long long d;cin>>n>>d;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());int best=1,cur=1;for(int i=1;i<n;++i){if(a[i]-a[i-1]<=d)cur++;else cur=1;best=max(best,cur);}cout<<best<<"\\n";`,
    `int n;long long d;cin>>n>>d;vector<long long>a(n);for(auto&x:a)cin>>x;int best=0;for(int l=0,r=0;r<n;++r){while(l<r&&a[r]-a[l]>d)l++;best=max(best,r-l+1);}cout<<best<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 8); return n + " " + r.int(0, 5) + "\n" + line(r.ints(n, 1, 15)) + "\n"; },
  brute: `int n;long long d;cin>>n>>d;vector<long long>a(n);for(auto&x:a)cin>>x;int best=0;for(int s=1;s<(1<<n);++s){long long lo=LLONG_MAX,hi=LLONG_MIN;for(int i=0;i<n;++i)if(s>>i&1){lo=min(lo,a[i]);hi=max(hi,a[i]);}if(hi-lo<=d)best=max(best,__builtin_popcount(s));}cout<<best<<"\\n";`,
  slow: [`int n;long long d;cin>>n>>d;vector<long long>a(n);for(auto&x:a)cin>>x;int best=0;for(int i=0;i<n;++i){int c=0;for(int j=0;j<n;++j)if(a[j]>=a[i]&&a[j]-a[i]<=d)c++;best=max(best,c);}cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "2·10^5 skills, a wide window: comparing every pair is quadratic", code: `n = 200000\nreturn str(n) + " 100000000\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

export default P;
