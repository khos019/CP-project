/* Batch 655 — ten problems, B655–B664, at 1200–1500.
 * Part of the fifty added on 2026-10-22 for the 1000–1599 band. Every task is
 * a well-known contest problem restated for AlgoYo'l in our own words, with our
 * own samples; ratings follow the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B655", judge: "sort-smallest-sum-of-products", topic: "sorting", rating: 1200,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Ko‘paytmalar yig‘indisini kamaytirish",
  en: "The smallest sum of products",
  statementUz: "Uzunligi n ga teng bo‘lgan a va b massivlari berilgan. a massivi o‘zgarmaydi, b massivining elementlarini esa istalgan tartibda qayta joylashtirish mumkin. Shundan keyin S = a_1 · b_1 + a_2 · b_2 + … + a_n · b_n yig‘indisi hisoblanadi. b ni qayta joylashtirib, S ning eng kichik qiymatini toping.",
  statementEn: "You are given two arrays a and b of length n. The array a stays as it is, while the elements of b may be rearranged in any order. Then the sum S = a_1 · b_1 + a_2 · b_2 + … + a_n · b_n is computed. Find the smallest value of S over all rearrangements of b.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda a_1, …, a_n, uchinchi qatorda b_1, …, b_n beriladi.",
  inputEn: "The first line contains n, the second a_1, …, a_n, the third b_1, …, b_n.",
  outputUz: "Yagona sonni chiqaring — S ning eng kichik qiymati.",
  outputEn: "Print a single number — the smallest value of S.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i, b_i ≤ 10^6", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i, b_i ≤ 10^6", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n1 2 3\n4 5 6\n", "2\n5 1\n1 5\n"],
  expect: ["28\n", "10\n"],
  sampleNotesUz: ["b ni 6, 5, 4 tartibida qo‘yamiz: 1 · 6 + 2 · 5 + 3 · 4 = 28. Eng katta a eng kichik b bilan juftlashadi."],
  sampleNotesEn: ["Placing b as 6, 5, 4 gives 1 · 6 + 2 · 5 + 3 · 4 = 28: the largest a meets the smallest b."],
  testInputs: ["3\n1 2 3\n4 5 6\n", "2\n5 1\n1 5\n", "1\n1000000\n1000000\n", "4\n3 1 4 1\n5 9 2 6\n", "5\n1 1 1 1 1\n9 8 7 6 5\n", "3\n1000000 1000000 1000000\n1000000 1000000 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n),b(n);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;sort(a.begin(),a.end());sort(b.rbegin(),b.rend());long long s=0;for(int i=0;i<n;++i)s+=a[i]*b[i];cout<<s<<"\\n";`,
  wrongNote: "Sorting both arrays the same way pairs large with large and gives the largest sum, not the smallest.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n),b(n);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;sort(a.begin(),a.end());sort(b.begin(),b.end());long long s=0;for(int i=0;i<n;++i)s+=a[i]*b[i];cout<<s<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n),b(n);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;long long s=0;for(int i=0;i<n;++i)s+=a[i]*b[i];cout<<s<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7); return n + "\n" + line(r.ints(n, 1, 9)) + "\n" + line(r.ints(n, 1, 9)) + "\n"; },
  brute: `int n;cin>>n;vector<long long>a(n),b(n);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;sort(b.begin(),b.end());long long best=LLONG_MAX;do{long long s=0;for(int i=0;i<n;++i)s+=a[i]*b[i];best=min(best,s);}while(next_permutation(b.begin(),b.end()));cout<<best<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 pairs of large values", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 10**6)) + "\\n" + line(r.ints(n, 1, 10**6))` },
  ],
});

P.push({
  id: "B656", judge: "sort-dance-partners", topic: "sorting", rating: 1200,
  tag: "Sorting and greedy", timeLimitMs: 1000,
  uz: "Raqs juftliklari",
  en: "Dance partners",
  statementUz: "Raqs kechasiga n ta yigit va m ta qiz keldi. Har birining raqs mahorati butun son bilan ifodalanadi. Yigit va qiz faqat mahoratlari ko‘pi bilan 1 ga farq qilsa juftlik bo‘la oladi, va har kim ko‘pi bilan bitta juftlikda qatnashadi. Bir vaqtda tuzish mumkin bo‘lgan juftliklarning eng ko‘p sonini toping.",
  statementEn: "n boys and m girls came to a dance evening. Everyone's dancing skill is an integer. A boy and a girl may form a pair only if their skills differ by at most 1, and everyone takes part in at most one pair. Find the largest number of pairs that can be formed at the same time.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda yigitlarning mahoratlari, uchinchi qatorda m, to‘rtinchi qatorda qizlarning mahoratlari beriladi.",
  inputEn: "The first line contains n, the second the boys' skills, the third m, the fourth the girls' skills.",
  outputUz: "Yagona sonni chiqaring — juftliklarning eng ko‘p soni.",
  outputEn: "Print a single number — the largest number of pairs.",
  constraintList: ["1 ≤ n, m ≤ 2·10^5", "1 ≤ skills ≤ 10^9", "a pair's skills differ by at most 1"],
  constraintListUz: ["1 ≤ n, m ≤ 2·10^5", "1 ≤ mahoratlar ≤ 10^9", "juftlikdagi mahoratlar ko‘pi bilan 1 ga farq qiladi"],
  sampleInputs: ["4\n1 4 6 2\n5\n5 1 5 7 9\n", "3\n1 2 3\n3\n10 11 12\n"],
  expect: ["3\n", "0\n"],
  sampleNotesUz: ["Masalan (1, 1), (4, 5), (6, 5) yoki (6, 7) juftliklari. To‘rtinchi juftlikni tuzib bo‘lmaydi: 2 mahoratli yigitga mos qiz qolmaydi."],
  sampleNotesEn: ["For example the pairs (1, 1), (4, 5) and (6, 5) or (6, 7). A fourth pair is impossible: no girl suits the boy of skill 2."],
  testInputs: ["4\n1 4 6 2\n5\n5 1 5 7 9\n", "3\n1 2 3\n3\n10 11 12\n", "1\n5\n1\n6\n", "3\n2 2 3\n3\n1 3 3\n", "4\n1 2 3 4\n4\n2 3 4 5\n", "3\n10 1 5\n4\n4 6 2 11\n", "2\n2 3\n2\n3 4\n", "2\n2 1\n2\n1 3\n"],
  sol: `int n,m;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;cin>>m;vector<long long>b(m);for(auto&x:b)cin>>x;sort(a.begin(),a.end());sort(b.begin(),b.end());int i=0,j=0,c=0;while(i<n&&j<m){if(llabs(a[i]-b[j])<=1){c++;i++;j++;}else if(a[i]<b[j])i++;else j++;}cout<<c<<"\\n";`,
  wrongNote: "Only equal skills form a pair in the first near miss; the second matches each boy to any suitable girl in input order, letting an early boy take the girl a later one needed.",
  wrong: [
    `int n,m;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;cin>>m;vector<long long>b(m);for(auto&x:b)cin>>x;sort(a.begin(),a.end());sort(b.begin(),b.end());int i=0,j=0,c=0;while(i<n&&j<m){if(a[i]==b[j]){c++;i++;j++;}else if(a[i]<b[j])i++;else j++;}cout<<c<<"\\n";`,
    `int n,m;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;cin>>m;vector<long long>b(m);for(auto&x:b)cin>>x;vector<bool>used(m,false);int c=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j)if(!used[j]&&llabs(a[i]-b[j])<=1){used[j]=true;c++;break;}cout<<c<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6), m = r.int(1, 6); return n + "\n" + line(r.ints(n, 1, 6)) + "\n" + m + "\n" + line(r.ints(m, 1, 6)) + "\n"; },
  brute: `int n,m;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;cin>>m;vector<long long>b(m);for(auto&x:b)cin>>x;vector<int>mt(m,-1);
function<bool(int,vector<bool>&)>go=[&](int u,vector<bool>&vis)->bool{for(int v=0;v<m;++v)if(!vis[v]&&llabs(a[u]-b[v])<=1){vis[v]=true;if(mt[v]<0||go(mt[v],vis)){mt[v]=u;return true;}}return false;};
int c=0;for(int u=0;u<n;++u){vector<bool>vis(m,false);if(go(u,vis))c++;}cout<<c<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 on each side, dense skills", code: `n = m = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 300000)) + "\\n" + str(m) + "\\n" + line(r.ints(m, 1, 300000))` },
  ],
});

P.push({
  id: "B657", judge: "str-isomorphic-strings", topic: "strings", rating: 1200,
  tag: "Hash map", timeLimitMs: 1000,
  uz: "Izomorf satrlar",
  en: "Isomorphic strings",
  statementUz: "Bir xil uzunlikdagi s va t satrlari berilgan. Agar s dagi har bir harfni boshqa (yoki o‘sha) harf bilan shunday almashtirish mumkin bo‘lsaki, natijada t hosil bo‘lsa, satrlar izomorf deyiladi. Bunda bir xil harflar doim bir xil harfga almashadi, turli harflar esa turli harflarga almashadi. Masalan, «egg» va «add» izomorf, «foo» va «bar» esa yo‘q. Har bir juftlik uchun javob bering.",
  statementEn: "Two strings s and t of the same length are given. They are isomorphic if each letter of s can be replaced by some letter (possibly itself) so that the result is t, where equal letters always become the same letter and different letters become different letters. For example, \"egg\" and \"add\" are isomorphic, while \"foo\" and \"bar\" are not. Answer for every pair.",
  inputUz: "Birinchi qatorda juftliklar soni t beriladi. Har bir juftlik bitta qatorda probel bilan ajratilgan ikkita satrdan iborat.",
  inputEn: "The first line contains the number of pairs t. Each pair is one line with two strings separated by a space.",
  outputUz: "Har bir juftlik uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each pair print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "the two strings of a pair have equal length; the total length of all strings ≤ 4·10^5", "the strings consist of lowercase Latin letters"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "juftlikdagi satrlar teng uzunlikda; barcha satrlarning umumiy uzunligi ≤ 4·10^5", "satrlar kichik lotin harflaridan iborat"],
  sampleInputs: ["4\negg add\nfoo bar\npaper title\nab aa\n"],
  expect: ["YES\nNO\nYES\nNO\n"],
  sampleNotesUz: ["«foo» da ikkita «o» bor, «bar» da esa ularga mos ikki harf turlicha. «ab» va «aa» da turli «a» va «b» bitta «a» ga almashishi kerak edi — bu taqiqlangan."],
  sampleNotesEn: ["\"foo\" has two \"o\"s, but the matching letters of \"bar\" differ. In \"ab\" and \"aa\" the different letters \"a\" and \"b\" would both have to become \"a\", which is not allowed."],
  testInputs: ["4\negg add\nfoo bar\npaper title\nab aa\n", "1\na b\n", "2\naa ab\nabc cba\n", "3\nbadc baba\nabab cdcd\nabcabc xyzxyz\n", "1\nabcdefghijklmnopqrstuvwxyz bcdefghijklmnopqrstuvwxyza\n"],
  sol: `int t;cin>>t;while(t--){string s,u;cin>>s>>u;int f[26],g[26];fill(f,f+26,-1);fill(g,g+26,-1);bool ok=true;for(size_t i=0;i<s.size()&&ok;++i){int a=s[i]-'a',b=u[i]-'a';if(f[a]<0&&g[b]<0){f[a]=b;g[b]=a;}else if(f[a]!=b||g[b]!=a)ok=false;}cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Checking only that each letter of s always maps to the same letter misses two different letters landing on one; the map has to work in both directions.",
  wrong: [
    `int t;cin>>t;while(t--){string s,u;cin>>s>>u;int f[26];fill(f,f+26,-1);bool ok=true;for(size_t i=0;i<s.size()&&ok;++i){int a=s[i]-'a',b=u[i]-'a';if(f[a]<0)f[a]=b;else if(f[a]!=b)ok=false;}cout<<(ok?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 4, (r) => { const n = r.int(1, 6); return r.str(n, "abc") + " " + r.str(n, "abc") + "\n"; }),
  brute: `int t;cin>>t;while(t--){string s,u;cin>>s>>u;auto pat=[](const string&x){vector<int>p;for(size_t i=0;i<x.size();++i)p.push_back((int)x.find(x[i]));return p;};cout<<(pat(s)==pat(u)?"YES":"NO")<<"\\n";}`,
  big: [
    { seed: 1, note: "one long pair built by a random letter permutation", code: `n = 200000\nabc = "abcdefghijklmnopqrstuvwxyz"\nperm = r.shuffle(list(abc))\ns = text(r, n, abc)\nt = "".join(perm[ord(c) - 97] for c in s)\nreturn "1\\n" + s + " " + t` },
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B658", judge: "tp-chocolate-from-both-ends", topic: "two-pointers", rating: 1300,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Shokoladni ikki tomondan yeyish",
  en: "Eating chocolate from both ends",
  statementUz: "Qatorda n ta shokolad turibdi, i-shokoladni yeyishga t_i soniya ketadi. Ali chap chetidan, Vali o‘ng chetidan bir vaqtda yeyishni boshlaydi; har biri shokoladni to‘liq yeb bo‘lgach, darhol o‘z tomonidagi keyingisiga o‘tadi. Shokoladni bo‘lishib yeyish mumkin emas. Agar ikkalasi bitta shokoladni ayni bir vaqtda boshlamoqchi bo‘lsa, Vali uni Aliga qoldiradi. Har biri nechta shokolad yeyishini toping.",
  statementEn: "n chocolate bars stand in a row, and bar i takes t_i seconds to eat. Ali starts from the left end and Vali from the right end at the same moment; each of them, after finishing a bar, immediately moves to the next bar on their side. A bar cannot be shared. If both want to start the same bar at exactly the same moment, Vali leaves it to Ali. Find how many bars each of them eats.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda n ta son t_1, …, t_n beriladi.",
  inputEn: "The first line contains n, the second the n numbers t_1, …, t_n.",
  outputUz: "Ikkita sonni chiqaring: Ali va Vali yegan shokoladlar soni.",
  outputEn: "Print two numbers: how many bars Ali and Vali eat.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ t_i ≤ 10^4", "both start at time 0"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ t_i ≤ 10^4", "ikkalasi 0-soniyada boshlaydi"],
  sampleInputs: ["5\n2 9 8 2 7\n", "3\n1 1 1\n"],
  expect: ["2 3\n", "2 1\n"],
  sampleNotesUz: ["Ali 2 va 9 ni 11-soniyada tugatadi. Vali 7 ni, 2 ni, so‘ng 8 ni boshlab 17-soniyada tugatadi. Ikkinchi namunada 1-soniyada ikkalasi o‘rtadagi shokoladni boshlamoqchi, u Aliga qoladi."],
  sampleNotesEn: ["Ali finishes 2 and 9 at second 11. Vali eats 7, then 2, then starts 8 and finishes at second 17. In the second sample both want the middle bar at second 1, and it goes to Ali."],
  testInputs: ["5\n2 9 8 2 7\n", "3\n1 1 1\n", "1\n5\n", "2\n1 1\n", "4\n1 2 3 4\n", "6\n5 1 1 1 1 5\n", "5\n10000 1 1 1 1\n"],
  sol: `int n;cin>>n;vector<long long>t(n);for(auto&x:t)cin>>x;long long a=0,b=0;int i=0,j=n-1;while(i<=j){if(a<=b)a+=t[i++];else b+=t[j--];}cout<<i<<" "<<n-i<<"\\n";`,
  wrongNote: "Comparing with a strict \"less than\" hands every tie to Vali, against the rule that a bar both reach at once goes to Ali.",
  wrong: [
    `int n;cin>>n;vector<long long>t(n);for(auto&x:t)cin>>x;long long a=0,b=0;int i=0,j=n-1;while(i<=j){if(a<b)a+=t[i++];else b+=t[j--];}cout<<i<<" "<<n-i<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 7); return n + "\n" + line(r.ints(n, 1, 4)) + "\n"; },
  brute: `int n;cin>>n;vector<int>t(n);for(auto&x:t)cin>>x;int i=0,j=n-1,ca=0,cb=0;long long fa=0,fb=0;
while(i<=j){long long T=min(fa,fb);bool fa_free=fa==T,fb_free=fb==T;if(fa_free&&fb_free){if(i==j){fa+=t[i++];ca++;}else{fa+=t[i++];ca++;fb+=t[j--];cb++;}}else if(fa_free){fa+=t[i++];ca++;}else{fb+=t[j--];cb++;}}cout<<ca<<" "<<cb<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 bars", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 10**4))` },
  ],
});

P.push({
  id: "B659", judge: "tp-candy-eating-rounds", topic: "two-pointers", rating: 1300,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Konfet yeyish o‘yini",
  en: "The candy eating game",
  statementUz: "Qatorda n ta konfet bor, i-konfetning og‘irligi a_i. Ali chap chetidan, Vali o‘ng chetidan navbatma-navbat yeydi, birinchi bo‘lib Ali. Har bir yurishda o‘yinchi o‘z tomonidan konfetlarni birma-bir yeydi va shu yurishda yegan og‘irligi raqibning oldingi yurishdagi og‘irligidan qat'iy katta bo‘lishi bilan to‘xtaydi (Alining birinchi yurishida raqibniki 0 deb hisoblanadi). Konfetlar yetmasa, qolganini yeydi va o‘yin tugaydi. Yurishlar soni hamda har birining jami yegan og‘irligini toping.",
  statementEn: "n candies lie in a row, and candy i weighs a_i. Ali eats from the left end and Vali from the right end, taking turns, with Ali first. On each move the player eats candies from their side one at a time and stops as soon as the weight eaten during this move is strictly greater than what the opponent ate on their previous move (on Ali's first move the opponent's is taken as 0). If the candies run out, the player eats what is left and the game ends. Find the number of moves and the total weight each player eats.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda uchta son chiqaring: yurishlar soni, Alining va Valining jami og‘irligi.",
  outputEn: "For each test case print three numbers on one line: the number of moves, Ali's total and Vali's total.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 1000"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 1000"],
  sampleInputs: ["3\n11\n3 1 4 1 5 9 2 6 5 3 5\n1\n1000\n3\n1 1 1\n"],
  expect: ["6 23 21\n1 1000 0\n2 1 2\n"],
  sampleNotesUz: ["Ali 3 ni yeydi (3 > 0). Vali 5 yeydi (5 > 3). Ali 1 + 4 + 1 = 6 yeydi. Vali 3 + 5 = 8. Ali 5 + 9 = 14. Vali 6 + 2 = 8 da 14 dan oshmaydi, lekin konfetlar tugaydi. Jami: Ali 3 + 6 + 14 = 23, Vali 5 + 8 + 8 = 21."],
  sampleNotesEn: ["Ali eats 3 (3 > 0). Vali eats 5 (5 > 3). Ali eats 1 + 4 + 1 = 6. Vali eats 3 + 5 = 8. Ali eats 5 + 9 = 14. Vali reaches 6 + 2 = 8, not above 14, but the candies run out. Totals: Ali 3 + 6 + 14 = 23, Vali 5 + 8 + 8 = 21."],
  testInputs: ["3\n11\n3 1 4 1 5 9 2 6 5 3 5\n1\n1000\n3\n1 1 1\n", "1\n13\n1 1 1 1 1 1 1 1 1 1 1 1 1\n", "2\n2\n2 1\n6\n1 1 1 1 1 1\n", "1\n7\n2 2 2 2 2 2 2\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int i=0,j=n-1,moves=0;long long A=0,B=0,prev=0;bool ali=true;while(i<=j){long long cur=0;if(ali){while(i<=j&&cur<=prev)cur+=a[i++];A+=cur;}else{while(i<=j&&cur<=prev)cur+=a[j--];B+=cur;}prev=cur;moves++;ali=!ali;}cout<<moves<<" "<<A<<" "<<B<<"\\n";}`,
  wrongNote: "Stopping once the move's weight merely equals the opponent's breaks the \"strictly greater\" rule and shortens every move that ties.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int i=0,j=n-1,moves=0;long long A=0,B=0,prev=0;bool ali=true;while(i<=j){long long cur=0;if(ali){while(i<=j&&cur<prev)cur+=a[i++];if(cur==0&&i<=j)cur+=a[i++];A+=cur;}else{while(i<=j&&cur<prev)cur+=a[j--];if(cur==0&&i<=j)cur+=a[j--];B+=cur;}prev=cur;moves++;ali=!ali;}cout<<moves<<" "<<A<<" "<<B<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, 4)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;deque<long long>d;for(int i=0;i<n;++i){long long x;cin>>x;d.push_back(x);}int moves=0;long long tot[2]={0,0},prev=0;int who=0;while(!d.empty()){long long cur=0;while(!d.empty()&&cur<=prev){if(who==0){cur+=d.front();d.pop_front();}else{cur+=d.back();d.pop_back();}}tot[who]+=cur;prev=cur;moves++;who^=1;}cout<<moves<<" "<<tot[0]<<" "<<tot[1]<<"\\n";}`,
  big: [
    { seed: 1, note: "one long row", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 1000))` },
  ],
});

P.push({
  id: "B660", judge: "sort-increments-to-make-unique", topic: "sorting", rating: 1300,
  tag: "Sorting and greedy", timeLimitMs: 1000,
  uz: "Hammasini turlicha qilish",
  en: "Making every value different",
  statementUz: "n ta butun sondan iborat massiv berilgan. Bitta amalda istalgan elementni 1 ga oshirish mumkin; kamaytirish taqiqlangan. Massivdagi barcha qiymatlar juft-juft turlicha bo‘lishi uchun eng kamida nechta amal kerak? Bitta elementni bir necha marta oshirish mumkin.",
  statementEn: "You are given an array of n integers. In one operation you may increase any element by 1; decreasing is not allowed. What is the smallest number of operations needed so that all values in the array become pairwise different? The same element may be increased several times.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda n ta son a_1, …, a_n beriladi.",
  inputEn: "The first line contains n, the second the n numbers a_1, …, a_n.",
  outputUz: "Yagona sonni chiqaring — amallarning eng kam soni.",
  outputEn: "Print a single number — the smallest number of operations.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["4\n3 2 1 2\n", "6\n3 2 1 2 1 7\n"],
  expect: ["2\n", "6\n"],
  sampleNotesUz: ["Tartiblanganda massiv 1, 2, 2, 3 bo‘ladi va 1, 2, 3, 4 ga aylanadi: ikkinchi 2 soni 3 ga, 3 esa 4 ga ko‘tariladi — har biri bitta amal, jami ikkita."],
  sampleNotesEn: ["Sorted, the array is 1, 2, 2, 3 and becomes 1, 2, 3, 4: the second 2 rises to 3 and the 3 rises to 4 — one operation each, two in all."],
  testInputs: ["4\n3 2 1 2\n", "6\n3 2 1 2 1 7\n", "1\n5\n", "5\n1 1 1 1 1\n", "4\n1000000000 1000000000 1000000000 1000000000\n", "5\n5 4 3 2 1\n", "6\n2 2 2 10 10 10\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long need=0,cur=LLONG_MIN;for(long long x:a){long long v=max(x,cur+1);need+=v-x;cur=v;}cout<<need<<"\\n";`,
  wrongNote: "Counting only how many values repeat ignores that a raised value can collide again with the next ones; raising a duplicate by exactly one is not always enough.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long c=0;for(int i=1;i<n;++i)c+=a[i]==a[i-1];cout<<c<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long need=0;for(int i=1;i<n;++i)if(a[i]<=a[i-1]){need+=1;a[i]=a[i-1]+1;}cout<<need<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6); return n + "\n" + line(r.ints(n, 1, 5)) + "\n"; },
  brute: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<int>idx(n);iota(idx.begin(),idx.end(),0);long long best=LLONG_MAX;do{set<long long>used;long long cost=0;for(int i:idx){long long v=a[i];while(used.count(v))v++;used.insert(v);cost+=v-a[i];}best=min(best,cost);}while(next_permutation(idx.begin(),idx.end()));cout<<best<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 copies of one large value: the answer needs 64 bits", code: `n = 200000\nreturn str(n) + "\\n" + line([10**9] * n)` },
    { seed: 2, note: "2·10^5 random small values", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 1000))` },
  ],
});

P.push({
  id: "B661", judge: "str-zigzag-rows", topic: "strings", rating: 1300,
  tag: "Simulation", timeLimitMs: 1000,
  uz: "Zigzag bo‘yicha yozish",
  en: "Writing in a zigzag",
  statementUz: "s satri r ta qatorga zigzag shaklida yoziladi: birinchi harf 1-qatorga, keyingisi 2-qatorga va hokazo r-qatorgacha, so‘ng yo‘nalish o‘zgarib harflar r − 1, r − 2, … qatorlarga 1-qatorgacha yoziladi va yana pastga tushiladi. Keyin qatorlar yuqoridan pastga, har bir qator chapdan o‘ngga o‘qilib, bitta satrga qo‘shiladi. Hosil bo‘lgan satrni chiqaring. r = 1 bo‘lsa, satr o‘zgarmaydi.",
  statementEn: "The string s is written over r rows in a zigzag: the first letter goes into row 1, the next into row 2, and so on down to row r, then the direction turns and letters go into rows r − 1, r − 2, … up to row 1, and down again. Then the rows are read from top to bottom, each from left to right, and joined into one string. Print that string. When r = 1 the string does not change.",
  inputUz: "Birinchi qatorda n va r, ikkinchi qatorda n uzunlikdagi s satri beriladi.",
  inputEn: "The first line contains n and r, the second the string s of length n.",
  outputUz: "Hosil bo‘lgan satrni chiqaring.",
  outputEn: "Print the resulting string.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ r ≤ n", "s consists of lowercase Latin letters"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ r ≤ n", "s kichik lotin harflaridan iborat"],
  sampleInputs: ["14 3\npaypalishiring\n", "14 4\npaypalishiring\n"],
  expect: ["pahnaplsiigyir\n", "pinalsigyahrpi\n"],
  sampleNotesUz: ["Uch qatorga yozilganda qatorlar «pahn», «aplsiig», «yir» bo‘ladi va ular ketma-ket qo‘shiladi."],
  sampleNotesEn: ["Over three rows the rows read \"pahn\", \"aplsiig\" and \"yir\", joined in that order."],
  testInputs: ["14 3\npaypalishiring\n", "14 4\npaypalishiring\n", "1 1\na\n", "5 1\nabcde\n", "5 5\nabcde\n", "6 2\nabcdef\n", "10 3\nabcdefghij\n"],
  sol: `int n,r;string s;cin>>n>>r>>s;if(r==1){cout<<s<<"\\n";return 0;}int cyc=2*r-2;string out;for(int row=0;row<r;++row)for(int i=row;i<n;i+=cyc){out+=s[i];int j=i+cyc-2*row;if(row>0&&row<r-1&&j<n)out+=s[j];}cout<<out<<"\\n";`,
  wrongNote: "A zigzag over r rows repeats every 2r − 2 letters; using 2r − 1 counts the turning letter twice and drifts the whole pattern.",
  wrong: [
    `int n,r;string s;cin>>n>>r>>s;if(r==1){cout<<s<<"\\n";return 0;}int cyc=2*r-1;string out;for(int row=0;row<r;++row)for(int i=row;i<n;i+=cyc){out+=s[i];int j=i+cyc-2*row;if(row>0&&row<r-1&&j<n)out+=s[j];}cout<<out<<"\\n";`,
    `int n,r;string s;cin>>n>>r>>s;string out;for(int row=0;row<r;++row)for(int i=row;i<n;i+=r)out+=s[i];cout<<out<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 12); return n + " " + r.int(1, n) + "\n" + r.str(n, "abcdefghij") + "\n"; },
  brute: `int n,r;string s;cin>>n>>r>>s;vector<string>rows(r);int row=0,d=1;for(char c:s){rows[row]+=c;if(r==1)continue;if(row==0)d=1;else if(row==r-1)d=-1;row+=d;}string out;for(auto&x:rows)out+=x;cout<<out<<"\\n";`,
  big: [
    { seed: 1, note: "a long string over many rows", code: `n = 200000\nreturn str(n) + " 777\\n" + text(r, n, "abcdefghijklmnopqrstuvwxyz")` },
  ],
});

P.push({
  id: "B662", judge: "str-fewest-deletions-a-before-b", topic: "strings", rating: 1300,
  tag: "Prefix logic", timeLimitMs: 1000,
  uz: "Avval a, keyin b",
  en: "All a before all b",
  statementUz: "Faqat «a» va «b» harflaridan iborat s satri berilgan. Undan ba'zi harflarni o‘chirib (qolganlarning tartibi o‘zgarmaydi), hech bir «b» harfidan keyin «a» harfi kelmaydigan satr hosil qilish kerak, ya'ni natija avval faqat «a», so‘ng faqat «b» lardan iborat bo‘lsin (ulardan biri bo‘sh bo‘lishi mumkin). O‘chiriladigan harflarning eng kam sonini toping.",
  statementEn: "You are given a string s consisting only of the letters \"a\" and \"b\". Delete some letters (the rest keep their order) so that no \"a\" comes after a \"b\", that is, the result is some \"a\"s followed by some \"b\"s (either part may be empty). Find the smallest number of letters to delete.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda n uzunlikdagi s satri beriladi.",
  inputEn: "The first line contains n, the second the string s of length n.",
  outputUz: "Yagona sonni chiqaring — o‘chiriladigan harflarning eng kam soni.",
  outputEn: "Print a single number — the smallest number of deletions.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "s consists of the letters a and b", "the empty string is allowed as a result"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "s faqat a va b harflaridan iborat", "natija bo‘sh satr bo‘lishi ham mumkin"],
  sampleInputs: ["8\naababbab\n", "4\nbbaa\n"],
  expect: ["2\n", "2\n"],
  sampleNotesUz: ["«aababbab» dan ikkita harfni — masalan 4- va 7-o‘rindagi «a» larni — o‘chirsak, «aabbbb» qoladi; bitta o‘chirish yetmaydi. «bbaa» da yo ikkala «b», yo ikkala «a» o‘chiriladi."],
  sampleNotesEn: ["Deleting two letters of \"aababbab\" — for example the \"a\"s in positions 4 and 7 — leaves \"aabbbb\"; one deletion is not enough. In \"bbaa\" either both \"b\"s or both \"a\"s go."],
  testInputs: ["8\naababbab\n", "4\nbbaa\n", "1\nb\n", "5\naaaaa\n", "6\nbababa\n", "7\nabababa\n", "8\nbbbbaaab\n"],
  sol: `int n;string s;cin>>n>>s;long long del=0,b=0;for(char c:s){if(c=='b')b++;else del=min(del+1,b);}cout<<del<<"\\n";`,
  wrongNote: "Deleting all of the rarer letter is one valid result but rarely the best; the cut between the \"a\" part and the \"b\" part can sit anywhere.",
  wrong: [
    `int n;string s;cin>>n>>s;long long a=count(s.begin(),s.end(),'a');cout<<min(a,(long long)n-a)<<"\\n";`,
    `int n;string s;cin>>n>>s;long long c=0;for(int i=0;i+1<n;++i)c+=s[i]=='b'&&s[i+1]=='a';cout<<c<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + r.str(n, "ab") + "\n"; },
  brute: `int n;string s;cin>>n>>s;long long best=LLONG_MAX;for(int cut=0;cut<=n;++cut){long long d=0;for(int i=0;i<cut;++i)d+=s[i]=='b';for(int i=cut;i<n;++i)d+=s[i]=='a';best=min(best,d);}cout<<best<<"\\n";`,
  slow: [`int n;string s;cin>>n>>s;long long best=LLONG_MAX;for(int cut=0;cut<=n;++cut){long long d=0;for(int i=0;i<cut;++i)d+=s[i]=='b';for(int i=cut;i<n;++i)d+=s[i]=='a';best=min(best,d);}cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "a long random string: trying every cut is quadratic", code: `n = 200000\nreturn str(n) + "\\n" + text(r, n, "ab")` },
  ],
});

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B663", judge: "tp-longest-mountain", topic: "two-pointers", rating: 1400,
  tag: "Two pointers", timeLimitMs: 1000,
  uz: "Eng uzun tog‘",
  en: "The longest mountain",
  statementUz: "n ta butun sondan iborat massiv berilgan. Ketma-ket elementlardan iborat qism-massiv tog‘ deyiladi, agar uning uzunligi kamida 3 bo‘lsa va unda shunday cho‘qqi bo‘lsaki, cho‘qqigacha qiymatlar qat'iy o‘sib, cho‘qqidan keyin qat'iy kamaysa (ikkala qism ham bo‘sh emas). Teng qo‘shni qiymatlar tog‘ni buzadi. Eng uzun tog‘ning uzunligini toping; tog‘ bo‘lmasa, 0 chiqaring.",
  statementEn: "You are given an array of n integers. A subarray of consecutive elements is a mountain if its length is at least 3 and it has a peak such that the values strictly increase up to the peak and strictly decrease after it (both parts non-empty). Equal neighbouring values break a mountain. Find the length of the longest mountain, or print 0 if there is none.",
  inputUz: "Birinchi qatorda n, ikkinchi qatorda n ta son a_1, …, a_n beriladi.",
  inputEn: "The first line contains n, the second the n numbers a_1, …, a_n.",
  outputUz: "Yagona sonni chiqaring — eng uzun tog‘ uzunligi yoki 0.",
  outputEn: "Print a single number — the length of the longest mountain, or 0.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ a_i ≤ 10^9", "a mountain needs at least one step up and one step down"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "0 ≤ a_i ≤ 10^9", "tog‘da kamida bitta ko‘tarilish va bitta tushish bo‘lishi kerak"],
  sampleInputs: ["7\n2 1 4 7 3 2 5\n", "3\n2 2 2\n"],
  expect: ["5\n", "0\n"],
  sampleNotesUz: ["1 4 7 3 2 — tog‘: 7 gacha o‘sadi, keyin kamayadi, uzunligi 5. Ikkinchi namunada hamma qiymat teng, tog‘ yo‘q."],
  sampleNotesEn: ["1 4 7 3 2 is a mountain: it rises to 7 and then falls, length 5. In the second sample every value is equal, so there is no mountain."],
  testInputs: ["7\n2 1 4 7 3 2 5\n", "3\n2 2 2\n", "1\n5\n", "4\n1 2 3 4\n", "5\n1 2 2 1 0\n", "9\n0 1 0 1 2 3 2 1 0\n", "6\n1 3 3 2 1 0\n", "5\n5 4 3 2 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=0,i=1;while(i<n){while(i<n&&a[i]<=a[i-1])i++;int up=0;while(i<n&&a[i]>a[i-1]){up++;i++;}int down=0;while(i<n&&a[i]<a[i-1]){down++;i++;}if(up>0&&down>0)best=max(best,up+down+1);}cout<<best<<"\\n";`,
  wrongNote: "Allowing equal neighbours on either slope treats a plateau as part of a mountain, which the statement forbids.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=0,i=1;while(i<n){while(i<n&&a[i]<a[i-1])i++;int up=0;while(i<n&&a[i]>=a[i-1]){up++;i++;}int down=0;while(i<n&&a[i]<=a[i-1]){down++;i++;}if(up>0&&down>0)best=max(best,up+down+1);}cout<<best<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=0,i=1;while(i<n){while(i<n&&a[i]<=a[i-1])i++;int up=0;while(i<n&&a[i]>a[i-1]){up++;i++;}int down=0;while(i<n&&a[i]<a[i-1]){down++;i++;}if(up>0)best=max(best,up+down+1);}cout<<best<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 0, 3)) + "\n"; },
  brute: `int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=0;for(int l=0;l<n;++l)for(int r=l+2;r<n;++r){bool ok=false;for(int p=l+1;p<r&&!ok;++p){bool good=true;for(int k=l;k<p;++k)if(a[k]>=a[k+1])good=false;for(int k=p;k<r;++k)if(a[k]<=a[k+1])good=false;if(good)ok=true;}if(ok)best=max(best,r-l+1);}cout<<best<<"\\n";`,
  big: [
    { seed: 1, note: "one huge mountain", code: `n = 200000\nh = n // 2\na = list(range(h)) + list(range(h, -1, -1))[:n - h]\nreturn str(n) + "\\n" + line(a)` },
    { seed: 2, note: "many small hills", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 0, 5))` },
  ],
});

P.push({
  id: "B664", judge: "sort-car-fleets", topic: "sorting", rating: 1400,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Mashinalar karvonlari",
  en: "Car fleets",
  statementUz: "To‘g‘ri yo‘lda n ta mashina bitta manzil — T nuqtasi tomon harakatlanmoqda. i-mashina p_i nuqtasidan v_i tezlik bilan yuradi, barcha p_i turli va T dan kichik. Mashinalar bir-birini quvib o‘ta olmaydi: orqadagi mashina oldingisiga yetib olsa, ular birga, oldingisining tezligida harakatlanadi va bitta karvon hisoblanadi. Manzilga aynan T nuqtasida yetib olgan mashinalar ham bitta karvon. Manzilga nechta karvon yetib kelishini toping.",
  statementEn: "n cars drive along a straight road towards one destination, the point T. Car i starts at point p_i with speed v_i; all p_i are different and less than T. Cars cannot overtake: when a car catches up with the one ahead, they continue together at the speed of the one ahead and count as one fleet. Cars that catch up exactly at the point T also form one fleet. Find how many fleets arrive at the destination.",
  inputUz: "Birinchi qatorda n va T beriladi. Keyingi n ta qatorning har birida p_i va v_i keladi.",
  inputEn: "The first line contains n and T. Each of the next n lines contains p_i and v_i.",
  outputUz: "Yagona sonni chiqaring — karvonlar soni.",
  outputEn: "Print a single number — the number of fleets.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ T ≤ 10^9", "0 ≤ p_i < T, all different", "1 ≤ v_i ≤ 10^9"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ T ≤ 10^9", "0 ≤ p_i < T, barchasi turlicha", "1 ≤ v_i ≤ 10^9"],
  sampleInputs: ["5 12\n10 2\n8 4\n0 1\n5 1\n3 3\n", "3 10\n0 1\n5 1\n9 1\n"],
  expect: ["3\n", "3\n"],
  sampleNotesUz: ["10 va 8 dagi mashinalar manzilga 1-soatda birga yetadi. 0 dagisi yolg‘iz. 5 va 3 dagilar 7-soatda birga yetadi. Ikkinchi namunada tezliklar teng, hech kim hech kimga yetmaydi."],
  sampleNotesEn: ["The cars at 10 and 8 reach the destination together at hour 1. The one at 0 travels alone. The cars at 5 and 3 arrive together at hour 7. In the second sample all speeds are equal, so nobody catches anybody."],
  testInputs: ["5 12\n10 2\n8 4\n0 1\n5 1\n3 3\n", "3 10\n0 1\n5 1\n9 1\n", "1 10\n3 3\n", "2 10\n0 2\n5 1\n", "2 10\n0 1\n5 2\n", "4 100\n0 4\n10 3\n20 2\n30 1\n", "3 1000000000\n0 1000000000\n1 999999999\n2 1\n", "2 1000000000\n0 999999999\n1 999999999\n"],
  sol: `int n;long long T;cin>>n>>T;vector<pair<long long,long long>>c(n);for(auto&x:c)cin>>x.first>>x.second;sort(c.rbegin(),c.rend());int fleets=0;long long tn=-1,td=1;for(auto&x:c){long long num=T-x.first,den=x.second;if(tn<0||(__int128)num*td>(__int128)tn*den){fleets++;tn=num;td=den;}}cout<<fleets<<"\\n";`,
  wrongNote: "Sorting from the back of the road compares each car with one it can never be blocked by; comparing arrival times in floating point also merges cars whose times differ only in the last digits.",
  wrong: [
    `int n;long long T;cin>>n>>T;vector<pair<long long,long long>>c(n);for(auto&x:c)cin>>x.first>>x.second;sort(c.begin(),c.end());int fleets=0;long long tn=-1,td=1;for(auto&x:c){long long num=T-x.first,den=x.second;if(tn<0||(__int128)num*td>(__int128)tn*den){fleets++;tn=num;td=den;}}cout<<fleets<<"\\n";`,
    `int n;long long T;cin>>n>>T;vector<pair<long long,long long>>c(n);for(auto&x:c)cin>>x.first>>x.second;sort(c.rbegin(),c.rend());int fleets=0;float best=-1;for(auto&x:c){float t=(float)(T-x.first)/(float)x.second;if(t>best){fleets++;best=t;}}cout<<fleets<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6), T = r.int(n + 1, 20); const ps = r.shuffle(Array.from({ length: T }, (_, i) => i)).slice(0, n); return n + " " + T + "\n" + ps.map((p) => p + " " + r.int(1, 4)).join("\n") + "\n"; },
  brute: `int n;long long T;cin>>n>>T;vector<pair<long long,long long>>c(n);for(auto&x:c)cin>>x.first>>x.second;int fleets=0;for(int i=0;i<n;++i){bool leader=true;for(int j=0;j<n;++j)if(c[j].first>c[i].first){long long ni=T-c[i].first,di=c[i].second,nj=T-c[j].first,dj=c[j].second;if((__int128)ni*dj<=(__int128)nj*di)leader=false;}if(leader)fleets++;}cout<<fleets<<"\\n";`,
  big: [
    { seed: 1, note: "2·10^5 cars", code: `n = 200000\nT = 10**9\nps = r.shuffle(list(range(0, T, T // n)))[:n]\nreturn str(n) + " " + str(T) + "\\n" + "\\n".join("%d %d" % (p, r.int(1, 10**9)) for p in ps)` },
  ],
});

export default P;
