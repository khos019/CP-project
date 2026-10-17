/* Batch 571 — sixteen problems at 1400, B571–B586.
 *
 * 1400 is the duel's third round for most players (1273 rounds by
 * 2026-10-17, from 41 problems). Every task is a well-known contest problem
 * restated for AlgoYo'l in our own words, with our own samples; ratings follow
 * the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1400 */
P.push({
  id: "B571", judge: "greedy-remove-unequal-pairs", topic: "greedy", rating: 1400,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Turli juftliklarni olib tashlash",
  en: "Removing unequal pairs",
  statementUz: "n ta butun sondan iborat massiv berilgan. Bitta amalda massivdan qiymatlari turlicha bo‘lgan ikkita elementni tanlab, ikkalasini ham olib tashlaysiz. Amallarni istalgancha (nol marta ham) bajarish mumkin. Massivda qolishi mumkin bo‘lgan elementlarning eng kam sonini toping. Teng qiymatli ikki elementni bitta amalda olib tashlab bo‘lmaydi.",
  statementEn: "You are given an array of n integers. In one operation you choose two elements with different values and remove both of them from the array. You may perform any number of operations, including none. Find the smallest number of elements that can remain in the array. Two elements with equal values can never be removed by the same operation.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda qoladigan elementlarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of remaining elements on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "the two removed elements must differ in value"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "olib tashlanadigan ikki element qiymati turlicha bo‘lishi kerak"],
  sampleInputs: ["4\n6\n1 6 1 1 4 4\n2\n1 2\n2\n1 1\n5\n4 5 4 5 4\n"],
  expect: ["0\n0\n2\n1\n"],
  sampleNotesUz: [
    "Birinchi testda (1, 6), (1, 4), (1, 4) juftliklarini olib, hammasini o‘chiramiz. Ikkinchi testda bitta amal yetarli. Uchinchi testda ikkala element teng, ularni olib bo‘lmaydi. To‘rtinchi testda ikki marta (4, 5) ni olsak, bitta 4 qoladi; elementlar soni toq bo‘lgani uchun hech bo‘lmaganda bittasi qoladi.",
  ],
  sampleNotesEn: [
    "In the first test the pairs (1, 6), (1, 4), (1, 4) remove everything. In the second one operation is enough. In the third both elements are equal and cannot be removed. In the fourth removing (4, 5) twice leaves one 4; with an odd number of elements at least one always remains.",
  ],
  testInputs: ["4\n6\n1 6 1 1 4 4\n2\n1 2\n2\n1 1\n5\n4 5 4 5 4\n", "1\n3\n1 2 3\n", "1\n1\n9\n", "1\n7\n2 2 2 2 2 1 3\n", "1\n8\n5 5 5 5 1 2 3 4\n", "1\n6\n7 7 7 7 7 7\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;map<long long,int>c;int mx=0;for(int i=0;i<n;++i){long long a;cin>>a;mx=max(mx,++c[a]);}
cout<<max(n%2,2*mx-n)<<"\\n";}`,
  wrongNote: "Looking only at how far the commonest value outnumbers the rest forgets that an odd count always leaves one; looking only at the parity forgets that equal values cannot cancel each other.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;map<long long,int>c;int mx=0;for(int i=0;i<n;++i){long long a;cin>>a;mx=max(mx,++c[a]);}
cout<<max(0,2*mx-n)<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;for(int i=0;i<n;++i){long long a;cin>>a;}cout<<n%2<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 8); return n + "\n" + line(r.ints(n, 1, 3)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;map<long long,int>c;for(int i=0;i<n;++i){long long a;cin>>a;c[a]++;}vector<int>v;for(auto&p:c)v.push_back(p.second);
map<vector<int>,int>memo;function<int(vector<int>)>go=[&](vector<int>s)->int{sort(s.begin(),s.end());auto it=memo.find(s);if(it!=memo.end())return it->second;int best=accumulate(s.begin(),s.end(),0);
 for(size_t i=0;i<s.size();++i)for(size_t j=i+1;j<s.size();++j)if(s[i]>0&&s[j]>0){auto u=s;u[i]--;u[j]--;best=min(best,go(u));}
 return memo[s]=best;};
cout<<go(v)<<"\\n";}`,
  big: [
    { seed: 1, note: "one long array, a dominant value", code: `n = 200000\na = [7] * 120000 + r.ints(n - 120000, 1, 10**9)\nreturn "1\\n" + str(n) + "\\n" + line(r.shuffle(a))` },
  ],
});

P.push({
  id: "B572", judge: "math-sum-of-repunits", topic: "math", rating: 1400,
  tag: "Number theory", timeLimitMs: 1000,
  uz: "Faqat birlardan iborat sonlar",
  en: "Numbers made of ones",
  statementUz: "Sizga butun x soni berilgan. Uni 11, 111, 1111, 11111, … sonlarining — ya'ni faqat 1 raqamidan iborat, kamida ikki xonali sonlarning — yig‘indisi ko‘rinishida yozish mumkinmi? Har bir son istalgancha marta (nol marta ham) ishlatilishi mumkin. Masalan, 144 = 111 + 11 + 11 + 11.",
  statementEn: "You are given an integer x. Can it be written as a sum of the numbers 11, 111, 1111, 11111, … — the numbers of at least two digits made only of the digit 1? Each of them may be used any number of times, including zero. For example, 144 = 111 + 11 + 11 + 11.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Keyingi t ta qatorning har birida bitta x soni keladi.",
  inputEn: "The first line contains the number of test cases t. Each of the next t lines contains one number x.",
  outputUz: "Har bir test uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each test case print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ x ≤ 10^9", "1 itself is not one of the allowed numbers", "each allowed number may repeat"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ x ≤ 10^9", "1 ning o‘zi ruxsat etilgan sonlarga kirmaydi", "har bir ruxsat etilgan son takrorlanishi mumkin"],
  sampleInputs: ["4\n33\n144\n69\n1000000000\n"],
  expect: ["YES\nYES\nNO\nYES\n"],
  sampleNotesUz: [
    "33 = 11 + 11 + 11, 144 = 111 + 3 · 11. 69 ni yozib bo‘lmaydi. 10^9 = 10 · 111 + (10^9 − 1110), va oxirgi qism 11 ga bo‘linadi.",
  ],
  sampleNotesEn: [
    "33 = 11 + 11 + 11 and 144 = 111 + 3 · 11. 69 cannot be written this way. 10^9 = 10 · 111 + (10^9 − 1110), and the rest is divisible by 11.",
  ],
  testInputs: ["4\n33\n144\n69\n1000000000\n", "1\n1\n", "1\n11\n", "1\n1109\n", "1\n1110\n", "4\n1099\n1210\n111111111\n999999999\n"],
  sol: `int t;cin>>t;while(t--){long long x;cin>>x;bool ok=false;for(int b=0;b<=10&&111LL*b<=x;++b)if((x-111LL*b)%11==0)ok=true;cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Checking only multiples of 11 or of 111 alone misses mixtures like 144; trying fewer than eleven copies of 111 misses the numbers that need ten of them.",
  wrong: [
    `int t;cin>>t;while(t--){long long x;cin>>x;cout<<((x%11==0||x%111==0)?"YES":"NO")<<"\\n";}`,
    `int t;cin>>t;while(t--){long long x;cin>>x;bool ok=false;for(int b=0;b<=9&&111LL*b<=x;++b)if((x-111LL*b)%11==0)ok=true;cout<<(ok?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 6, (r) => r.int(1, 3000) + "\n"),
  brute: `vector<char>ok(3001,0);ok[0]=1;for(int v:{11,111,1111})for(int i=v;i<=3000;++i)if(ok[i-v])ok[i]=1;
int t;cin>>t;while(t--){int x;cin>>x;cout<<(ok[x]?"YES":"NO")<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){long long x;cin>>x;bool ok=false;for(long long b=0;111*b<=x;++b)if((x-111*b)%11==0){ok=true;}cout<<(ok?"YES":"NO")<<"\\n";}`],
  big: [
    { seed: 1, note: "10^4 numbers near 10^9: trying every count of 111 is slow", code: `return "10000\\n" + "\\n".join(str(r.int(9 * 10**8, 10**9)) for _ in range(10000))` },
  ],
});

P.push({
  id: "B573", judge: "ds-lr-product-remainders", topic: "data-structures", rating: 1400,
  tag: "Offline reversal", timeLimitMs: 1000,
  uz: "Chapdan yoki o‘ngdan",
  en: "From the left or from the right",
  statementUz: "n ta musbat butun sondan iborat massiv, m soni va n uzunlikdagi, L va R harflaridan iborat buyruqlar qatori berilgan. Buyruqlar ketma-ket bajariladi. Har bir buyruqdan oldin massivdagi barcha elementlar ko‘paytmasining m ga bo‘lgandagi qoldig‘i chiqariladi. So‘ng buyruq L bo‘lsa, massivning eng chap elementi, R bo‘lsa — eng o‘ng elementi olib tashlanadi. Chiqariladigan n ta qoldiqni toping.",
  statementEn: "You are given an array of n positive integers, a number m and a string of n commands, each L or R. The commands are executed one after another. Before each command, the remainder of the product of all elements currently in the array divided by m is printed. Then an L command removes the leftmost element of the array and an R command removes the rightmost one. Find the n printed remainders.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test uch qatordan iborat: n va m; n ta son a_i; buyruqlar qatori.",
  inputEn: "The first line contains the number of test cases t. Each test case takes three lines: n and m; the n numbers a_i; the string of commands.",
  outputUz: "Har bir test uchun alohida qatorda probel bilan ajratilgan n ta qoldiqni chiqaring.",
  outputEn: "For each test case print the n remainders separated by spaces, on one line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ m ≤ 10^4; 1 ≤ a_i ≤ 10^4", "m need not be prime"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ m ≤ 10^4; 1 ≤ a_i ≤ 10^4", "m tub son bo‘lishi shart emas"],
  sampleInputs: ["2\n4 6\n3 1 4 2\nLRRL\n1 10000\n10000\nR\n"],
  expect: ["0 2 4 1\n0\n"],
  sampleNotesUz: [
    "Birinchi testda 3 · 1 · 4 · 2 = 24, qoldiq 0; L 3 ni olib tashlaydi, 1 · 4 · 2 = 8 → 2; R 2 ni olib tashlaydi, 4 → 4; R 4 ni olib tashlaydi, 1 → 1. Ikkinchi testda 10000 ning 10000 ga qoldig‘i 0.",
  ],
  sampleNotesEn: [
    "In the first test 3 · 1 · 4 · 2 = 24 leaves 0; L removes 3, and 1 · 4 · 2 = 8 leaves 2; R removes 2, and 4 leaves 4; R removes 4, and 1 leaves 1. In the second, 10000 leaves 0 when divided by 10000.",
  ],
  testInputs: ["2\n4 6\n3 1 4 2\nLRRL\n1 10000\n10000\nR\n", "1\n3 1\n5 6 7\nLLR\n", "1\n5 7\n7 1 2 3 4\nRRRRL\n", "1\n6 10\n2 5 3 4 5 2\nLRLRLR\n"],
  sol: `int t;cin>>t;while(t--){int n;long long m;cin>>n>>m;vector<long long>a(n);for(auto&x:a)cin>>x;string s;cin>>s;
vector<int>ord;int l=0,r=n-1;for(char c:s){if(c=='L')ord.push_back(l++);else ord.push_back(r--);}
vector<long long>ans(n);long long p=1%m;for(int i=n-1;i>=0;--i){p=p*(a[ord[i]]%m)%m;ans[i]=p;}
for(int i=0;i<n;++i)cout<<ans[i]<<(i+1<n?' ':'\\n');}`,
  wrongNote: "Dividing the running product by the removed element is not allowed modulo m — the remainder has already lost what it would need; printing after each removal instead of before shifts every answer by one command.",
  wrong: [
    `int t;cin>>t;while(t--){int n;long long m;cin>>n>>m;vector<long long>a(n);for(auto&x:a)cin>>x;string s;cin>>s;
long long p=1%m;for(auto x:a)p=p*(x%m)%m;int l=0,r=n-1;
for(int i=0;i<n;++i){cout<<p<<(i+1<n?' ':'\\n');long long x=(s[i]=='L')?a[l++]:a[r--];p=(p/x)%m;}}`,
    `int t;cin>>t;while(t--){int n;long long m;cin>>n>>m;vector<long long>a(n);for(auto&x:a)cin>>x;string s;cin>>s;
vector<int>ord;int l=0,r=n-1;for(char c:s){if(c=='L')ord.push_back(l++);else ord.push_back(r--);}
vector<long long>ans(n);long long p=1%m;for(int i=n-1;i>=0;--i){ans[i]=p;p=p*(a[ord[i]]%m)%m;}
for(int i=0;i<n;++i)cout<<ans[i]<<(i+1<n?' ':'\\n');}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 8); return line([n, r.int(1, 30)]) + "\n" + line(r.ints(n, 1, 20)) + "\n" + r.str(n, "LR") + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;long long m;cin>>n>>m;vector<long long>a(n);for(auto&x:a)cin>>x;string s;cin>>s;int l=0,r=n-1;
for(int i=0;i<n;++i){long long p=1%m;for(int j=l;j<=r;++j)p=p*(a[j]%m)%m;cout<<p<<(i+1<n?' ':'\\n');if(s[i]=='L')++l;else --r;}}`],
  big: [
    { seed: 1, note: "a prime modulus, random commands", code: `n = 200000\nreturn "1\\n" + line([n, 9973]) + "\\n" + line(r.ints(n, 1, 10**4)) + "\\n" + text(r, n, "LR")` },
    { seed: 2, note: "a composite modulus, removing from the right first", code: `n = 200000\nreturn "1\\n" + line([n, 10**4]) + "\\n" + line(r.ints(n, 1, 9)) + "\\n" + "R" * (n // 2) + "L" * (n - n // 2)` },
  ],
});

P.push({
  id: "B574", judge: "sort-allowed-adjacent-swaps", topic: "sorting", rating: 1400,
  tag: "Prefix maxima", timeLimitMs: 1000,
  uz: "Ruxsat etilgan almashtirishlar",
  en: "Allowed neighbour swaps",
  statementUz: "1 dan n gacha sonlarning almashtirishi a va n − 1 uzunlikdagi, 0 va 1 lardan iborat s qatori berilgan. Agar s_i = 1 bo‘lsa, a_i va a_{i+1} elementlarning o‘rnini istalgancha marta almashtirish mumkin; s_i = 0 bo‘lsa, bu ikki o‘rinni almashtirib bo‘lmaydi. Boshqa almashtirishlar yo‘q. Massivni o‘sish tartibiga keltirish mumkinmi?",
  statementEn: "You are given a permutation a of the numbers 1 to n and a string s of length n − 1 made of 0s and 1s. If s_i = 1, the elements at positions i and i + 1 may be swapped any number of times; if s_i = 0, those two positions can never be swapped. No other swaps exist. Can the array be brought into increasing order?",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda almashtirish a_1, …, a_n, uchinchi qatorda s qatori keladi.",
  inputEn: "The first line contains n. The second line contains the permutation a_1, …, a_n and the third the string s.",
  outputUz: "YES yoki NO chiqaring.",
  outputEn: "Print YES or NO.",
  constraintList: ["2 ≤ n ≤ 2·10^5", "a is a permutation of 1 to n", "s has length n − 1", "a swap that is allowed may be repeated"],
  constraintListUz: ["2 ≤ n ≤ 2·10^5", "a — 1 dan n gacha sonlarning almashtirishi", "s ning uzunligi n − 1", "ruxsat etilgan almashtirishni takrorlash mumkin"],
  sampleInputs: ["6\n1 2 5 3 4 6\n01110\n", "6\n1 2 5 3 4 6\n01010\n"],
  expect: ["YES\n", "NO\n"],
  sampleNotesUz: [
    "2-dan 5-o‘ringacha istalgancha almashtirish mumkin, 5, 3, 4 ni tartiblaymiz.",
    "3- va 4-o‘rinlar orasida almashtirish yo‘q, 5 esa 3-o‘rinda qolib ketadi.",
  ],
  sampleNotesEn: [
    "Positions 2 to 5 can be shuffled freely, which sorts 5, 3, 4.",
    "Positions 3 and 4 cannot be swapped, so 5 is stuck at position 3.",
  ],
  testInputs: ["6\n1 2 5 3 4 6\n01110\n", "6\n1 2 5 3 4 6\n01010\n", "3\n3 1 2\n10\n", "4\n4 3 2 1\n111\n", "2\n1 2\n0\n", "2\n2 1\n0\n", "5\n2 1 3 5 4\n1001\n"],
  sol: `int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;string s;cin>>s;int mx=0;bool ok=true;
for(int i=0;i<n-1;++i){mx=max(mx,a[i]);if(s[i]=='0'&&mx!=i+1)ok=false;}
cout<<(ok?"YES":"NO")<<"\\n";`,
  wrongNote: "Comparing only the two elements on either side of a forbidden swap misses a large value stranded further left; a single bubbling pass is one swap per pair, not as many as wanted.",
  wrong: [
    `int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;string s;cin>>s;bool ok=true;
for(int i=0;i<n-1;++i)if(s[i]=='0'&&a[i]>a[i+1])ok=false;
cout<<(ok?"YES":"NO")<<"\\n";`,
    `int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;string s;cin>>s;
for(int i=0;i<n-1;++i)if(s[i]=='1'&&a[i]>a[i+1])swap(a[i],a[i+1]);
cout<<(is_sorted(a.begin(),a.end())?"YES":"NO")<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(2, 8); return n + "\n" + line(r.perm(n)) + "\n" + r.str(n - 1, "0111") + "\n"; },
  slow: [`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;string s;cin>>s;bool ch=true;
while(ch){ch=false;for(int i=0;i<n-1;++i)if(s[i]=='1'&&a[i]>a[i+1]){swap(a[i],a[i+1]);ch=true;}}
cout<<(is_sorted(a.begin(),a.end())?"YES":"NO")<<"\\n";`],
  big: [
    { seed: 1, note: "reversed, every swap allowed: bubbling needs n passes", code: `n = 200000\nreturn str(n) + "\\n" + line(range(n, 0, -1)) + "\\n" + "1" * (n - 1)` },
    { seed: 2, note: "blocks that are sortable", code: `n = 200000\na = []\ns = []\nb = 0\nwhile b < n:\n    k = min(n - b, r.int(1, 2000))\n    a += r.shuffle(list(range(b + 1, b + k + 1)))\n    s += ["1"] * (k - 1) + ["0"]\n    b += k\nreturn str(n) + "\\n" + line(a) + "\\n" + "".join(s[:n - 1])` },
  ],
});

P.push({
  id: "B575", judge: "ds-operations-applied-by-queries", topic: "data-structures", rating: 1400,
  tag: "Difference arrays", timeLimitMs: 1000,
  uz: "Amallar va so‘rovlar",
  en: "Operations and queries",
  statementUz: "n ta sondan iborat a massivi va m ta amal berilgan; i-amal (l_i, r_i, d_i) — a_{l_i}, …, a_{r_i} elementlarning har biriga d_i qo‘shadi. So‘ng k ta so‘rov keladi, har biri (x, y) juftligi: x-amaldan y-amalgacha bo‘lgan barcha amallarni (ikkalasi ham kiradi) bajaring. Bitta amal bir nechta so‘rovga tushsa, har safar qayta bajariladi. Barcha so‘rovlardan keyingi massivni chiqaring.",
  statementEn: "You are given an array a of n numbers and m operations; operation i is (l_i, r_i, d_i) and adds d_i to each of a_{l_i}, …, a_{r_i}. Then k queries follow, each a pair (x, y): perform all the operations from x to y, both included. An operation covered by several queries is performed again each time. Print the array after all the queries.",
  inputUz: "Birinchi qatorda n, m va k beriladi. Ikkinchi qatorda n ta son a_i. Keyingi m ta qatorda amallar (l, r, d), undan keyingi k ta qatorda so‘rovlar (x, y).",
  inputEn: "The first line contains n, m and k. The second line contains the n numbers a_i. The next m lines contain the operations (l, r, d), and the k lines after them the queries (x, y).",
  outputUz: "Probel bilan ajratilgan n ta sonni — oxirgi massivni chiqaring.",
  outputEn: "Print the n numbers of the final array separated by spaces.",
  constraintList: ["1 ≤ n, m, k ≤ 10^5", "0 ≤ a_i, d_i ≤ 10^5", "1 ≤ l_i ≤ r_i ≤ n, 1 ≤ x ≤ y ≤ m", "the values can exceed 2^31"],
  constraintListUz: ["1 ≤ n, m, k ≤ 10^5", "0 ≤ a_i, d_i ≤ 10^5", "1 ≤ l_i ≤ r_i ≤ n, 1 ≤ x ≤ y ≤ m", "qiymatlar 2^31 dan oshishi mumkin"],
  sampleInputs: ["3 3 3\n1 2 3\n1 2 1\n1 3 2\n2 3 4\n1 2\n1 3\n2 3\n"],
  expect: ["9 18 17\n"],
  sampleNotesUz: [
    "1-amal ikki so‘rovga, 2-amal uchta so‘rovga, 3-amal ikkitasiga tushadi. Demak 1–2 o‘rinlarga 2 · 1, hammasiga 3 · 2 va 2–3 o‘rinlarga 2 · 4 qo‘shiladi: 1 + 2 + 6 = 9, 2 + 2 + 6 + 8 = 18, 3 + 6 + 8 = 17.",
  ],
  sampleNotesEn: [
    "Operation 1 falls in two queries, operation 2 in three, operation 3 in two. So positions 1–2 gain 2 · 1, every position gains 3 · 2 and positions 2–3 gain 2 · 4: 1 + 2 + 6 = 9, 2 + 2 + 6 + 8 = 18, 3 + 6 + 8 = 17.",
  ],
  testInputs: ["3 3 3\n1 2 3\n1 2 1\n1 3 2\n2 3 4\n1 2\n1 3\n2 3\n", "1 1 1\n0\n1 1 5\n1 1\n", "4 2 3\n0 0 0 0\n1 4 100000\n2 3 7\n1 2\n1 2\n2 2\n", "5 3 1\n1 1 1 1 1\n1 1 1\n5 5 1\n2 4 1\n1 3\n"],
  sol: `int n,m,k;cin>>n>>m>>k;vector<long long>a(n);for(auto&x:a)cin>>x;vector<int>l(m),r(m);vector<long long>d(m);for(int i=0;i<m;++i)cin>>l[i]>>r[i]>>d[i];
vector<long long>cnt(m+1,0);for(int i=0;i<k;++i){int x,y;cin>>x>>y;cnt[x-1]++;cnt[y]--;}
vector<long long>add(n+1,0);long long c=0;for(int i=0;i<m;++i){c+=cnt[i];add[l[i]-1]+=c*d[i];add[r[i]]-=c*d[i];}
long long s=0;for(int i=0;i<n;++i){s+=add[i];cout<<a[i]+s<<(i+1<n?' ':'\\n');}`,
  wrongNote: "Performing an operation once however many queries cover it loses the repeats; closing each range at r instead of r + 1 leaves out its last element.",
  wrong: [
    `int n,m,k;cin>>n>>m>>k;vector<long long>a(n);for(auto&x:a)cin>>x;vector<int>l(m),r(m);vector<long long>d(m);for(int i=0;i<m;++i)cin>>l[i]>>r[i]>>d[i];
vector<long long>cnt(m+1,0);for(int i=0;i<k;++i){int x,y;cin>>x>>y;cnt[x-1]++;cnt[y]--;}
vector<long long>add(n+1,0);long long c=0;for(int i=0;i<m;++i){c+=cnt[i];if(c>0){add[l[i]-1]+=d[i];add[r[i]]-=d[i];}}
long long s=0;for(int i=0;i<n;++i){s+=add[i];cout<<a[i]+s<<(i+1<n?' ':'\\n');}`,
    `int n,m,k;cin>>n>>m>>k;vector<long long>a(n);for(auto&x:a)cin>>x;vector<int>l(m),r(m);vector<long long>d(m);for(int i=0;i<m;++i)cin>>l[i]>>r[i]>>d[i];
vector<long long>cnt(m+1,0);for(int i=0;i<k;++i){int x,y;cin>>x>>y;cnt[x-1]++;cnt[y]--;}
vector<long long>add(n+1,0);long long c=0;for(int i=0;i<m;++i){c+=cnt[i];add[l[i]-1]+=c*d[i];add[r[i]-1]-=c*d[i];}
long long s=0;for(int i=0;i<n;++i){s+=add[i];cout<<a[i]+s<<(i+1<n?' ':'\\n');}`,
  ],
  gen: (r) => { const n = r.int(1, 6), m = r.int(1, 5), k = r.int(1, 5); let s = line([n, m, k]) + "\n" + line(r.ints(n, 0, 9)) + "\n"; for (let i = 0; i < m; i++) { const l = r.int(1, n); s += line([l, r.int(l, n), r.int(0, 9)]) + "\n"; } for (let i = 0; i < k; i++) { const x = r.int(1, m); s += line([x, r.int(x, m)]) + "\n"; } return s; },
  slow: [`int n,m,k;cin>>n>>m>>k;vector<long long>a(n);for(auto&x:a)cin>>x;vector<int>l(m),r(m);vector<long long>d(m);for(int i=0;i<m;++i)cin>>l[i]>>r[i]>>d[i];
for(int q=0;q<k;++q){int x,y;cin>>x>>y;for(int i=x-1;i<y;++i)for(int j=l[i]-1;j<r[i];++j)a[j]+=d[i];}
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?' ':'\\n');`],
  big: [
    { seed: 1, note: "wide operations and wide queries", code: `n, m, k = 50000, 100000, 100000\nops = []\nfor _ in range(m):\n    l = r.int(1, 100)\n    ops.append(line([l, r.int(n - 100, n), r.int(0, 10)]))\nqs = []\nfor _ in range(k):\n    x = r.int(1, 100)\n    qs.append(line([x, r.int(m - 100, m)]))\nreturn line([n, m, k]) + "\\n" + line(r.ints(n, 0, 10**5)) + "\\n" + "\\n".join(ops) + "\\n" + "\\n".join(qs)` },
  ],
});

P.push({
  id: "B576", judge: "dp-flip-one-segment-max-ones", topic: "dynamic-programming", rating: 1400,
  tag: "Kadane", timeLimitMs: 1000,
  uz: "Bitta bo‘lakni teskari qilish",
  en: "Flipping one segment",
  statementUz: "0 va 1 lardan iborat n uzunlikdagi massiv berilgan. Siz aynan bitta amal bajarishingiz kerak: bo‘sh bo‘lmagan [i, j] bo‘lakni tanlab, undagi har bir elementni teskarisiga almashtirasiz — 0 ni 1 ga, 1 ni 0 ga. Amaldan keyin massivdagi birlar sonining eng katta qiymatini toping. Amalni bajarmaslik mumkin emas, hatto massiv to‘liq birlardan iborat bo‘lsa ham.",
  statementEn: "You are given an array of length n made of 0s and 1s. You must make exactly one operation: choose a non-empty segment [i, j] and invert every element in it — each 0 becomes 1 and each 1 becomes 0. Find the largest possible number of ones in the array after the operation. Skipping the operation is not allowed, even if the array consists only of ones.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "Yagona butun sonni chiqaring — birlarning eng ko‘p soni.",
  outputEn: "Print a single integer — the largest number of ones.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "every a_i is 0 or 1", "the segment must be non-empty", "the operation must be made exactly once"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "har bir a_i 0 yoki 1", "bo‘lak bo‘sh bo‘lmasligi kerak", "amal aynan bir marta bajarilishi kerak"],
  sampleInputs: ["5\n1 0 0 1 0\n", "4\n1 1 1 1\n"],
  expect: ["4\n", "3\n"],
  sampleNotesUz: [
    "2- va 3-o‘rinlarni teskari qilsak, 1 1 1 1 0 — to‘rtta bir.",
    "Biror elementni teskari qilish shart, shuning uchun bitta bir yo‘qoladi.",
  ],
  sampleNotesEn: [
    "Inverting positions 2 and 3 gives 1 1 1 1 0, with four ones.",
    "Some element has to be inverted, so one 1 is lost.",
  ],
  testInputs: ["5\n1 0 0 1 0\n", "4\n1 1 1 1\n", "1\n0\n", "1\n1\n", "8\n0 0 1 0 0 1 1 0\n", "6\n1 0 1 0 1 0\n", "7\n0 1 1 1 1 1 0\n"],
  sol: `int n;cin>>n;int ones=0;long long best=LLONG_MIN,cur=0;for(int i=0;i<n;++i){int a;cin>>a;ones+=a;int v=a?-1:1;cur=max((long long)v,cur+v);best=max(best,cur);}
cout<<ones+best<<"\\n";`,
  wrongNote: "Allowing an empty segment keeps every 1 in an array of ones; inverting a single element never gains more than one.",
  wrong: [
    `int n;cin>>n;int ones=0;long long best=0,cur=0;for(int i=0;i<n;++i){int a;cin>>a;ones+=a;int v=a?-1:1;cur=max(0LL,cur+v);best=max(best,cur);}
cout<<ones+best<<"\\n";`,
    `int n;cin>>n;int ones=0;bool zero=false;for(int i=0;i<n;++i){int a;cin>>a;ones+=a;if(!a)zero=true;}
cout<<(zero?ones+1:ones-1)<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + line(r.ints(n, 0, 1)) + "\n"; },
  slow: [`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;vector<int>p(n+1,0);for(int i=0;i<n;++i)p[i+1]=p[i]+a[i];int best=INT_MIN;
for(int i=0;i<n;++i)for(int j=i;j<n;++j){int on=p[j+1]-p[i],len=j-i+1;best=max(best,p[n]-on+(len-on));}
cout<<best<<"\\n";`],
  big: [
    { seed: 1, note: "random bits", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 0, 1))` },
    { seed: 2, note: "all ones", code: `n = 200000\nreturn str(n) + "\\n" + line([1] * n)` },
  ],
});

P.push({
  id: "B577", judge: "ds-concert-tickets-multiset", topic: "data-structures", rating: 1400,
  tag: "Ordered multiset", timeLimitMs: 2000,
  uz: "Konsert chiptalari",
  en: "Concert tickets",
  statementUz: "Konsertga n ta chipta bor, i-chiptaning narxi h_i. m ta xaridor birin-ketin keladi; j-xaridor ko‘pi bilan t_j so‘m to‘lashga tayyor. Har bir xaridor narxi t_j dan oshmaydigan qolgan chiptalar ichidan eng qimmatini sotib oladi, va bu chipta boshqa sotilmaydi. Bunday chipta qolmagan bo‘lsa, xaridor hech narsa olmaydi. Har bir xaridor to‘lagan narxni toping.",
  statementEn: "There are n tickets for a concert, and ticket i costs h_i. m customers arrive one after another; customer j is willing to pay at most t_j. Each customer buys the most expensive remaining ticket whose price does not exceed t_j, and that ticket cannot be sold again. If no such ticket is left, the customer gets nothing. Find the price each customer pays.",
  inputUz: "Birinchi qatorda n va m beriladi. Ikkinchi qatorda n ta narx h_i, uchinchi qatorda m ta son t_j keladi.",
  inputEn: "The first line contains n and m. The second line contains the n prices h_i and the third the m numbers t_j.",
  outputUz: "Har bir xaridor uchun alohida qatorda to‘langan narxni yoki -1 ni chiqaring.",
  outputEn: "For each customer print the price paid, or -1, on its own line.",
  constraintList: ["1 ≤ n, m ≤ 2·10^5", "1 ≤ h_i, t_j ≤ 10^9", "customers are served in the given order", "several tickets may have the same price"],
  constraintListUz: ["1 ≤ n, m ≤ 2·10^5", "1 ≤ h_i, t_j ≤ 10^9", "xaridorlarga berilgan tartibda xizmat qilinadi", "bir nechta chipta bir xil narxda bo‘lishi mumkin"],
  sampleInputs: ["5 3\n5 3 7 8 5\n4 8 3\n"],
  expect: ["3\n8\n-1\n"],
  sampleNotesUz: [
    "Birinchi xaridorga 4 dan oshmaydigan eng qimmat chipta — 3. Ikkinchisiga 8. Uchinchisi 3 gacha to‘lay oladi, lekin 3 so‘mlik chipta sotilib bo‘lgan.",
  ],
  sampleNotesEn: [
    "The first customer's best ticket at most 4 is the 3. The second gets the 8. The third could pay up to 3, but the 3 has been sold.",
  ],
  testInputs: ["5 3\n5 3 7 8 5\n4 8 3\n", "1 1\n10\n9\n", "1 2\n10\n10 10\n", "4 4\n2 2 2 2\n1 2 3 2\n", "5 5\n1 2 3 4 5\n5 5 5 5 5\n"],
  sol: `int n,m;cin>>n>>m;multiset<long long>s;for(int i=0;i<n;++i){long long h;cin>>h;s.insert(h);}
while(m--){long long t;cin>>t;auto it=s.upper_bound(t);if(it==s.begin())cout<<-1<<"\\n";else{--it;cout<<*it<<"\\n";s.erase(it);}}`,
  wrongNote: "Never removing a sold ticket sells it again to later customers; handing out the cheapest affordable ticket is not what customers do here.",
  wrong: [
    `int n,m;cin>>n>>m;multiset<long long>s;for(int i=0;i<n;++i){long long h;cin>>h;s.insert(h);}
while(m--){long long t;cin>>t;auto it=s.upper_bound(t);if(it==s.begin())cout<<-1<<"\\n";else{--it;cout<<*it<<"\\n";}}`,
    `int n,m;cin>>n>>m;multiset<long long>s;for(int i=0;i<n;++i){long long h;cin>>h;s.insert(h);}
while(m--){long long t;cin>>t;if(s.empty()||*s.begin()>t)cout<<-1<<"\\n";else{cout<<*s.begin()<<"\\n";s.erase(s.begin());}}`,
  ],
  gen: (r) => { const n = r.int(1, 7), m = r.int(1, 7); return line([n, m]) + "\n" + line(r.ints(n, 1, 9)) + "\n" + line(r.ints(m, 1, 9)) + "\n"; },
  slow: [`int n,m;cin>>n>>m;vector<long long>h(n);for(auto&x:h)cin>>x;vector<char>sold(n,0);
while(m--){long long t;cin>>t;int b=-1;for(int i=0;i<n;++i)if(!sold[i]&&h[i]<=t&&(b<0||h[i]>h[b]))b=i;if(b<0)cout<<-1<<"\\n";else{sold[b]=1;cout<<h[b]<<"\\n";}}`],
  big: [
    { seed: 1, note: "random prices and budgets", code: `n, m = 200000, 70000\nreturn line([n, m]) + "\\n" + line(r.ints(n, 1, 10**9)) + "\\n" + line(r.ints(m, 1, 10**9))` },
    { seed: 2, note: "cheap tickets, rich customers", code: `n, m = 200000, 70000\nreturn line([n, m]) + "\\n" + line(r.ints(n, 1, 1000)) + "\\n" + line(r.ints(m, 10**8, 10**9))` },
  ],
});

P.push({
  id: "B578", judge: "greedy-cube-towers", topic: "greedy", rating: 1400,
  tag: "Greedy with a multiset", timeLimitMs: 2000,
  uz: "Kub minoralar",
  en: "Towers of cubes",
  statementUz: "n ta kub berilgan tartibda keladi, i-kubning o‘lchami k_i. Har bir kelgan kubni yo mavjud minoralardan birining ustiga qo‘yasiz, yo u bilan yangi minora boshlaysiz. Kubni minoraga faqat uning eng ustki kubi undan qat'iy katta bo‘lsa qo‘yish mumkin; teng o‘lchamli kub ustiga qo‘yib bo‘lmaydi. Kublar kelish tartibida joylashtiriladi va keyin ko‘chirilmaydi. Eng kami bilan nechta minora hosil bo‘ladi?",
  statementEn: "n cubes arrive in the given order, and cube i has size k_i. Each arriving cube is either put on top of one of the existing towers or starts a new tower. A cube can be put on a tower only if the tower's top cube is strictly larger than it; it cannot go on a cube of equal size. Cubes are placed in the order they arrive and never moved afterwards. What is the smallest possible number of towers?",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son k_1, …, k_n keladi.",
  inputEn: "The first line contains n. The second line contains the n numbers k_1, …, k_n.",
  outputUz: "Yagona butun sonni chiqaring — minoralarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of towers.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "1 ≤ k_i ≤ 10^9", "a cube goes only on a strictly larger one", "cubes are placed in the order given"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "1 ≤ k_i ≤ 10^9", "kub faqat undan qat'iy katta kub ustiga qo‘yiladi", "kublar berilgan tartibda joylashtiriladi"],
  sampleInputs: ["5\n3 8 2 1 5\n", "4\n2 2 2 2\n"],
  expect: ["2\n", "4\n"],
  sampleNotesUz: [
    "3 → yangi minora; 8 → yangi minora; 2 va 1 → 3 ustiga; 5 → 8 ustiga. Ikkita minora.",
    "Teng kublarni bir-birining ustiga qo‘yib bo‘lmaydi.",
  ],
  sampleNotesEn: [
    "3 starts a tower; 8 starts another; 2 and 1 go on the 3; 5 goes on the 8. Two towers.",
    "Equal cubes cannot be stacked.",
  ],
  testInputs: ["5\n3 8 2 1 5\n", "4\n2 2 2 2\n", "4\n4 6 3 5\n", "1\n7\n", "6\n1 2 3 4 5 6\n", "6\n6 5 4 3 2 1\n", "7\n5 1 5 1 5 1 5\n"],
  sol: `int n;cin>>n;multiset<long long>tops;for(int i=0;i<n;++i){long long k;cin>>k;auto it=tops.upper_bound(k);if(it!=tops.end())tops.erase(it);tops.insert(k);}
cout<<tops.size()<<"\\n";`,
  wrongNote: "Letting a cube go on an equal one stacks what the rules keep apart; putting a cube on the largest top instead of the smallest that fits wastes a tall tower on a small cube.",
  wrong: [
    `int n;cin>>n;multiset<long long>tops;for(int i=0;i<n;++i){long long k;cin>>k;auto it=tops.lower_bound(k);if(it!=tops.end())tops.erase(it);tops.insert(k);}
cout<<tops.size()<<"\\n";`,
    `int n;cin>>n;multiset<long long>tops;for(int i=0;i<n;++i){long long k;cin>>k;if(!tops.empty()&&*tops.rbegin()>k)tops.erase(prev(tops.end()));tops.insert(k);}
cout<<tops.size()<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 10); return n + "\n" + line(r.ints(n, 1, 6)) + "\n"; },
  brute: `int n;cin>>n;vector<long long>k(n);for(auto&x:k)cin>>x;vector<int>d(n,1);int best=0;
for(int i=0;i<n;++i){for(int j=0;j<i;++j)if(k[j]<=k[i])d[i]=max(d[i],d[j]+1);best=max(best,d[i]);}
cout<<best<<"\\n";`,
  slow: [`int n;cin>>n;vector<long long>tops;for(int i=0;i<n;++i){long long k;cin>>k;int b=-1;for(size_t j=0;j<tops.size();++j)if(tops[j]>k&&(b<0||tops[j]<tops[b]))b=j;if(b<0)tops.push_back(k);else tops[b]=k;}
cout<<tops.size()<<"\\n";`],
  big: [
    { seed: 1, note: "increasing: every cube is a new tower", code: `n = 200000\nreturn str(n) + "\\n" + line(range(1, n + 1))` },
    { seed: 2, note: "random", code: `n = 200000\nreturn str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "B579", judge: "math-two-knights-boards", topic: "math", rating: 1400,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Ikki ot",
  en: "Two knights",
  statementUz: "k × k o‘lchamli shaxmat taxtasiga ikkita bir xil ot qo‘yiladi, har biri alohida katakka. Otlar bir-birini urmasligi kerak: ot o‘zidan bir yo‘nalishda ikki, ikkinchisida bir katak narida joylashgan kataklarni uradi (\"G\" harfi shaklida). Ikki ot bir xil bo‘lgani uchun ularning o‘rnini almashtirish yangi usul hisoblanmaydi. k = 1, 2, …, n uchun otlarni joylashtirish usullari sonini toping.",
  statementEn: "Two identical knights are placed on a k × k chessboard, each on its own cell. They must not attack each other: a knight attacks the cells two steps away in one direction and one step away in the other (an L shape). Since the knights are identical, swapping them does not give a new placement. For every k = 1, 2, …, n find the number of ways to place the knights.",
  inputUz: "Yagona qatorda n beriladi.",
  inputEn: "A single line contains n.",
  outputUz: "n ta qator chiqaring: k-qatorda k × k taxta uchun javob.",
  outputEn: "Print n lines: the k-th line holds the answer for the k × k board.",
  constraintList: ["1 ≤ n ≤ 10^4", "the two knights are identical", "both knights must be on the board", "answers can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 10^4", "ikki ot bir xil", "ikkala ot ham taxtada bo‘lishi kerak", "javoblar 2^31 dan oshishi mumkin"],
  sampleInputs: ["4\n"],
  expect: ["0\n6\n28\n96\n"],
  sampleNotesUz: [
    "1 × 1 taxtaga ikki ot sig‘maydi. 2 × 2 taxtada otlar bir-birini hech qachon urmaydi: 4 katakdan 2 tasini tanlash 6 usul. 3 × 3 da 36 juftlikdan 8 tasi urishadi: 28.",
  ],
  sampleNotesEn: [
    "Two knights do not fit on a 1 × 1 board. On 2 × 2 knights never attack each other, so it is the 6 ways to choose 2 cells of 4. On 3 × 3, 8 of the 36 pairs attack: 28.",
  ],
  testInputs: ["4\n", "1\n", "2\n", "10\n", "30\n"],
  sol: `long long n;cin>>n;for(long long k=1;k<=n;++k){long long s=k*k;cout<<s*(s-1)/2-4*(k-1)*(k-2)<<"\\n";}`,
  wrongNote: "Counting each attacking pair once per two-by-three rectangle but forgetting the rectangle lies both ways halves the pairs to subtract; counting ordered placements doubles everything.",
  wrong: [
    `long long n;cin>>n;for(long long k=1;k<=n;++k){long long s=k*k;cout<<s*(s-1)/2-2*(k-1)*(k-2)<<"\\n";}`,
    `long long n;cin>>n;for(long long k=1;k<=n;++k){long long s=k*k;cout<<s*(s-1)-8*(k-1)*(k-2)<<"\\n";}`,
  ],
  gen: (r) => r.int(1, 12) + "\n",
  brute: `int n;cin>>n;for(int k=1;k<=n;++k){long long c=0;for(int a=0;a<k*k;++a)for(int b=a+1;b<k*k;++b){int dx=abs(a/k-b/k),dy=abs(a%k-b%k);if(!((dx==1&&dy==2)||(dx==2&&dy==1)))++c;}cout<<c<<"\\n";}`,
  slow: [`int n;cin>>n;int dx[8]={1,2,2,1,-1,-2,-2,-1},dy[8]={2,1,-1,-2,-2,-1,1,2};
for(long long k=1;k<=n;++k){long long att=0;for(long long x=0;x<k;++x)for(long long y=0;y<k;++y)for(int d=0;d<8;++d){long long a=x+dx[d],b=y+dy[d];if(a>=0&&a<k&&b>=0&&b<k)++att;}
 long long s=k*k;cout<<s*(s-1)/2-att/2<<"\\n";}`],
  big: [
    { seed: 1, note: "n = 10^4: counting the attacks cell by cell is far too slow", code: `return "10000"` },
  ],
});

P.push({
  id: "B580", judge: "greedy-merge-into-equal-parts", topic: "greedy", rating: 1400,
  tag: "Prefix sums", timeLimitMs: 1000,
  uz: "Qo‘shniga qo‘shib, olib tashlash",
  en: "Add to a neighbour and remove",
  statementUz: "n ta musbat butun sondan iborat massiv berilgan. Bitta amalda biror a_i ni tanlab, uni qo‘shnilaridan biriga (a_{i−1} yoki a_{i+1} ga, agar ular bor bo‘lsa) qo‘shasiz va a_i ni massivdan olib tashlaysiz; massiv bir elementga qisqaradi. Massivdagi barcha elementlarni bir-biriga teng qilish uchun eng kami bilan nechta amal kerak? Bitta element qolgan massivda hamma elementlar teng hisoblanadi.",
  statementEn: "You are given an array of n positive integers. In one operation you choose some a_i, add it to one of its neighbours (a_{i−1} or a_{i+1}, if that neighbour exists) and remove a_i from the array, which becomes one element shorter. What is the smallest number of operations after which all elements of the array are equal? An array with a single element counts as having all elements equal.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda amallarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of operations on its own line.",
  constraintList: ["1 ≤ t ≤ 3000", "1 ≤ n ≤ 3000, the sum of n over all tests ≤ 3000", "1 ≤ a_i ≤ 10^5", "an element can only be added to a direct neighbour"],
  constraintListUz: ["1 ≤ t ≤ 3000", "1 ≤ n ≤ 3000, barcha testlar bo‘yicha n lar yig‘indisi ≤ 3000", "1 ≤ a_i ≤ 10^5", "element faqat bevosita qo‘shnisiga qo‘shiladi"],
  sampleInputs: ["3\n5\n3 1 6 6 2\n4\n1 2 2 1\n3\n2 2 2\n"],
  expect: ["4\n2\n0\n"],
  sampleNotesUz: [
    "Birinchi testda massivni teng yig‘indili bir nechta bo‘lakka bo‘lib bo‘lmaydi, shuning uchun hammasini bitta songa yig‘ish kerak: 4 amal. Ikkinchi testda 1 + 2 va 2 + 1: ikki amal bilan 3 3. Uchinchi testda hamma elementlar allaqachon teng.",
  ],
  sampleNotesEn: [
    "In the first test the array cannot be split into several parts with equal sums, so everything has to be merged into one number: 4 operations. In the second, 1 + 2 and 2 + 1 give 3 3 in two operations. In the third all elements are equal already.",
  ],
  testInputs: ["3\n5\n3 1 6 6 2\n4\n1 2 2 1\n3\n2 2 2\n", "1\n1\n100000\n", "1\n6\n1 1 1 1 1 1\n", "1\n6\n1 2 3 3 2 1\n", "1\n7\n4 2 2 4 1 3 4\n", "1\n3\n2 2 1\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long total=accumulate(a.begin(),a.end(),0LL);int best=n-1;long long pre=0;
for(int i=0;i<n;++i){pre+=a[i];if(total%pre)continue;long long cur=0;int parts=0;bool ok=true;for(int j=0;j<n;++j){cur+=a[j];if(cur==pre){++parts;cur=0;}else if(cur>pre){ok=false;break;}}
 if(ok&&cur==0)best=min(best,n-parts);}
cout<<best<<"\\n";}`,
  wrongNote: "Hoping the elements are equal already, and otherwise merging everything, misses the splits into several equal parts; accepting a split whose last part comes up short merges too little.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;bool same=true;for(auto x:a)if(x!=a[0])same=false;cout<<(same?0:n-1)<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=n-1;long long pre=0;
for(int i=0;i<n;++i){pre+=a[i];long long cur=0;int parts=0;bool ok=true;for(int j=0;j<n;++j){cur+=a[j];if(cur==pre){++parts;cur=0;}else if(cur>pre){ok=false;break;}}
 if(ok)best=min(best,n-parts);}
cout<<best<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, 4)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int best=n-1;
for(int m=0;m<(1<<(n-1));++m){vector<long long>parts;long long c=0;for(int i=0;i<n;++i){c+=a[i];if(i==n-1||(m>>i&1)){parts.push_back(c);c=0;}}bool eq=true;for(auto x:parts)if(x!=parts[0])eq=false;if(eq)best=min(best,n-(int)parts.size());}
cout<<best<<"\\n";}`,
  big: [
    { seed: 1, note: "n = 3000 with many divisor candidates", code: `n = 3000\nreturn "1\\n" + str(n) + "\\n" + line([1] * n)` },
    { seed: 2, note: "n = 3000 random", code: `n = 3000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 3))` },
  ],
});

P.push({
  id: "B581", judge: "math-two-disjoint-couples", topic: "math", rating: 1400,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Ikki raqs juftligi",
  en: "Two dancing couples",
  statementUz: "Bitiruv kechasida a ta yigit va b ta qiz bor. k ta juftlik raqsga tushishga rozi: i-juftlik yigit x_i va qiz y_i dan iborat, bir xil juftlik ikki marta berilmaydi. Raqsga ikkita juftlikni tanlash kerak, lekin bitta odam ikki juftlikda bo‘la olmaydi — ya'ni ikki juftlikning yigitlari ham, qizlari ham turli bo‘lishi kerak. Ikki juftlikni tanlashning nechta usuli bor? Juftliklar tartibi muhim emas.",
  statementEn: "At a ball there are a boys and b girls. k couples are willing to dance: couple i is boy x_i with girl y_i, and no couple is listed twice. Two couples have to be chosen to dance, but nobody can be in both — the two couples must have different boys and different girls. In how many ways can the two couples be chosen? The order of the two couples does not matter.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test uch qatordan iborat: a, b va k; k ta son x_i; k ta son y_i.",
  inputEn: "The first line contains the number of test cases t. Each test case takes three lines: a, b and k; the k numbers x_i; the k numbers y_i.",
  outputUz: "Har bir test uchun alohida qatorda usullar sonini chiqaring.",
  outputEn: "For each test case print the number of ways on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ a, b, k ≤ 2·10^5; the sums of a, b and k over all tests are each ≤ 2·10^5", "1 ≤ x_i ≤ a, 1 ≤ y_i ≤ b", "every couple appears once; the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ a, b, k ≤ 2·10^5; barcha testlar bo‘yicha a, b va k lar yig‘indisi har biri ≤ 2·10^5", "1 ≤ x_i ≤ a, 1 ≤ y_i ≤ b", "har bir juftlik bir marta uchraydi; javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["2\n3 4 4\n1 1 2 3\n2 3 2 4\n1 1 1\n1\n1\n"],
  expect: ["4\n0\n"],
  sampleNotesUz: [
    "Juftliklar: (1, 2), (1, 3), (2, 2), (3, 4). Mos keladiganlari: (1, 2) va (3, 4); (1, 3) va (2, 2); (1, 3) va (3, 4); (2, 2) va (3, 4). Ikkinchi testda bitta juftlik bor.",
  ],
  sampleNotesEn: [
    "The couples are (1, 2), (1, 3), (2, 2), (3, 4). The valid choices are (1, 2) with (3, 4); (1, 3) with (2, 2); (1, 3) with (3, 4); and (2, 2) with (3, 4). In the second test there is only one couple.",
  ],
  testInputs: ["2\n3 4 4\n1 1 2 3\n2 3 2 4\n1 1 1\n1\n1\n", "1\n2 2 4\n1 1 2 2\n1 2 1 2\n", "1\n1 5 5\n1 1 1 1 1\n1 2 3 4 5\n", "1\n4 4 4\n1 2 3 4\n1 2 3 4\n"],
  sol: `int t;cin>>t;while(t--){int a,b,k;cin>>a>>b>>k;vector<int>x(k),y(k);vector<long long>dx(a+1,0),dy(b+1,0);for(auto&v:x){cin>>v;dx[v]++;}for(auto&v:y){cin>>v;dy[v]++;}
long long s=0;for(int i=0;i<k;++i)s+=k-dx[x[i]]-dy[y[i]]+1;cout<<s/2<<"\\n";}`,
  wrongNote: "Subtracting only the couples that share the boy still counts the ones that share the girl; forgetting to halve counts every choice in both orders.",
  wrong: [
    `int t;cin>>t;while(t--){int a,b,k;cin>>a>>b>>k;vector<int>x(k),y(k);vector<long long>dx(a+1,0);for(auto&v:x){cin>>v;dx[v]++;}for(auto&v:y)cin>>v;
long long s=0;for(int i=0;i<k;++i)s+=k-dx[x[i]];cout<<s/2<<"\\n";}`,
    `int t;cin>>t;while(t--){int a,b,k;cin>>a>>b>>k;vector<int>x(k),y(k);vector<long long>dx(a+1,0),dy(b+1,0);for(auto&v:x){cin>>v;dx[v]++;}for(auto&v:y){cin>>v;dy[v]++;}
long long s=0;for(int i=0;i<k;++i)s+=k-dx[x[i]]-dy[y[i]]+1;cout<<s<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const a = r.int(1, 4), b = r.int(1, 4); const all = []; for (let i = 1; i <= a; i++) for (let j = 1; j <= b; j++) all.push([i, j]); r.shuffle(all); const k = r.int(1, all.length); const c = all.slice(0, k); return line([a, b, k]) + "\n" + line(c.map((p) => p[0])) + "\n" + line(c.map((p) => p[1])) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int a,b,k;cin>>a>>b>>k;vector<int>x(k),y(k);for(auto&v:x)cin>>v;for(auto&v:y)cin>>v;long long s=0;
for(int i=0;i<k;++i)for(int j=i+1;j<k;++j)if(x[i]!=x[j]&&y[i]!=y[j])++s;cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "2·10^5 distinct couples", code: `k = 200000\nseen = set()\nxs, ys = [], []\nwhile len(xs) < k:\n    p = (r.int(1, 1000), r.int(1, 1000))\n    if p not in seen:\n        seen.add(p)\n        xs.append(p[0])\n        ys.append(p[1])\nreturn "1\\n" + line([1000, 1000, k]) + "\\n" + line(xs) + "\\n" + line(ys)` },
  ],
});

P.push({
  id: "B582", judge: "greedy-gather-sheep", topic: "greedy", rating: 1400,
  tag: "Median", timeLimitMs: 1000,
  uz: "Qo‘ylarni yig‘ish",
  en: "Gathering the sheep",
  statementUz: "n uzunlikdagi qator berilgan: '*' — qo‘y turgan katak, '.' — bo‘sh katak. Bitta amalda biror qo‘yni bir katak chapga yoki o‘ngga, agar u katak mavjud va bo‘sh bo‘lsa, siljitasiz. Barcha qo‘ylar oralarida bo‘sh katak qolmaydigan qilib yonma-yon turishi uchun eng kami bilan nechta amal kerak? Qo‘y bo‘lmasa yoki ular allaqachon yonma-yon tursa, javob 0.",
  statementEn: "You are given a row of n cells: '*' is a cell with a sheep and '.' an empty one. In one move you shift some sheep one cell to the left or to the right, provided that cell exists and is empty. What is the smallest number of moves after which all the sheep stand next to each other with no empty cell between them? If there are no sheep, or they already stand together, the answer is 0.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida qator.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the row.",
  outputUz: "Har bir test uchun alohida qatorda amallarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of moves on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^6, the sum of n over all tests ≤ 10^6", "the row consists of '*' and '.'", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 10^6, barcha testlar bo‘yicha n lar yig‘indisi ≤ 10^6", "qator '*' va '.' belgilaridan iborat", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n6\n**.*..\n5\n*****\n7\n.*.*.*.\n"],
  expect: ["1\n0\n2\n"],
  sampleNotesUz: [
    "Birinchi testda uchinchi qo‘yni bir katak chapga siljitamiz. Ikkinchi testda qo‘ylar allaqachon yonma-yon. Uchinchi testda chetki ikki qo‘yni o‘rtadagisiga bittadan yaqinlashtiramiz.",
  ],
  sampleNotesEn: [
    "In the first test the third sheep moves one cell left. In the second the sheep stand together already. In the third the two outer sheep each move one cell towards the middle one.",
  ],
  testInputs: ["3\n6\n**.*..\n5\n*****\n7\n.*.*.*.\n", "1\n3\n...\n", "1\n1\n*\n", "1\n10\n*........*\n", "1\n12\n*.*..*...*.*\n"],
  sol: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;vector<long long>q;for(int i=0;i<n;++i)if(s[i]=='*')q.push_back(i-(long long)q.size());
long long ans=0;if(!q.empty()){long long med=q[q.size()/2];for(auto v:q)ans+=llabs(v-med);}cout<<ans<<"\\n";}`,
  wrongNote: "Pulling every sheep towards the leftmost one ignores that the middle sheep should stay put; measuring distances to the middle sheep's position forgets the others need room beside it.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;vector<long long>q;for(int i=0;i<n;++i)if(s[i]=='*')q.push_back(i-(long long)q.size());
long long ans=0;for(auto v:q)ans+=v-q[0];cout<<ans<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;vector<long long>p;for(int i=0;i<n;++i)if(s[i]=='*')p.push_back(i);
long long ans=0;if(!p.empty()){long long med=p[p.size()/2];for(auto v:p)ans+=llabs(v-med);}cout<<ans<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 10); return n + "\n" + r.str(n, "*..") + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;string s;cin>>n>>s;vector<long long>p;for(int i=0;i<n;++i)if(s[i]=='*')p.push_back(i);long long m=p.size(),best=m?LLONG_MAX:0;
for(long long st=0;st+m<=n;++st){long long c=0;for(long long j=0;j<m;++j)c+=llabs(p[j]-(st+j));best=min(best,c);}cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "half the cells are sheep: trying every place for the flock is quadratic", code: `n = 1000000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "*.")` },
    { seed: 2, note: "sheep at both ends", code: `n = 1000000\nreturn "1\\n" + str(n) + "\\n" + "*" * 1000 + "." * (n - 2000) + "*" * 1000` },
  ],
});

P.push({
  id: "B583", judge: "hash-triples-differ-in-one", topic: "data-structures", rating: 1400,
  tag: "Hashing", timeLimitMs: 2000,
  uz: "Bitta o‘rinda farq qiladigan uchliklar",
  en: "Triples that differ in one place",
  statementUz: "n ta butun sondan iborat massiv berilgan. Har bir j = 1, …, n − 2 uchun (a_j, a_{j+1}, a_{j+2}) uchligini yozamiz. Ikki uchlik chiroyli juftlik deyiladi, agar ular aynan bitta o‘rinda farq qilsa: birinchi, ikkinchi yoki uchinchi elementi turlicha, qolgan ikkitasi esa teng. Uchliklarning nechta chiroyli juftligi bor? Juftlikdagi uchliklar massivdagi turli j lardan olinadi.",
  statementEn: "You are given an array of n integers. For every j = 1, …, n − 2 write down the triple (a_j, a_{j+1}, a_{j+2}). Two triples form a beautiful pair if they differ in exactly one place: their first, second or third elements differ while the other two are equal. How many beautiful pairs of triples are there? The two triples of a pair are taken at different j.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda chiroyli juftliklar sonini chiqaring.",
  outputEn: "For each test case print the number of beautiful pairs on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "3 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^6", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "3 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^6", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["2\n5\n3 2 2 2 3\n5\n1 2 1 2 1\n"],
  expect: ["2\n0\n"],
  sampleNotesUz: [
    "Birinchi testda uchliklar [3, 2, 2], [2, 2, 2], [2, 2, 3]: birinchisi va ikkinchisi faqat birinchi o‘rinda, ikkinchisi va uchinchisi faqat uchinchi o‘rinda farq qiladi. Ikkinchi testda [1, 2, 1], [2, 1, 2], [1, 2, 1] — birinchi va uchinchi uchlik teng, qolganlari hamma o‘rinda farq qiladi.",
  ],
  sampleNotesEn: [
    "In the first test the triples are [3, 2, 2], [2, 2, 2], [2, 2, 3]: the first two differ only in the first place, the last two only in the third. In the second the triples [1, 2, 1], [2, 1, 2], [1, 2, 1] are either equal or differ everywhere.",
  ],
  testInputs: ["2\n5\n3 2 2 2 3\n5\n1 2 1 2 1\n", "1\n3\n1 1 1\n", "1\n6\n1 1 1 1 1 1\n", "1\n6\n1 1 2 1 1 3\n", "1\n8\n2 1 1 2 1 1 3 1\n"],
  sol: `const long long B=1000001;
auto pairsOf=[](vector<long long>&v){sort(v.begin(),v.end());long long s=0;for(size_t i=0,j;i<v.size();i=j){j=i;while(j<v.size()&&v[j]==v[i])++j;long long c=j-i;s+=c*(c-1)/2;}return s;};
int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int m=n-2;
vector<long long>p(m),q(m),r(m);vector<pair<long long,long long>>f(m);
for(int j=0;j<m;++j){long long x=a[j],y=a[j+1],z=a[j+2];p[j]=y*B+z;q[j]=x*B+z;r[j]=x*B+y;f[j]=make_pair(x*B+y,z);}
sort(f.begin(),f.end());long long full=0;for(int i=0,j;i<m;i=j){j=i;while(j<m&&f[j]==f[i])++j;long long c=j-i;full+=c*(c-1)/2;}
cout<<pairsOf(p)+pairsOf(q)+pairsOf(r)-3*full<<"\\n";}`,
  wrongNote: "Counting triples that agree in two places without removing the ones that agree in all three counts equal triples as beautiful; comparing only neighbouring triples misses the pairs that are far apart.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
map<pair<long long,long long>,long long>A,B,C;long long s=0;
for(int j=0;j+2<n;++j){long long x=a[j],y=a[j+1],z=a[j+2];auto k1=make_pair(y,z),k2=make_pair(x,z),k3=make_pair(x,y);
 s+=A[k1]+B[k2]+C[k3];A[k1]++;B[k2]++;C[k3]++;}
cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0;
for(int j=0;j+3<n;++j){int d=(a[j]!=a[j+1])+(a[j+1]!=a[j+2])+(a[j+2]!=a[j+3]);if(d==1)++s;}
cout<<s<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(3, 10); return n + "\n" + line(r.ints(n, 1, 3)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0;
for(int i=0;i+2<n;++i)for(int j=i+1;j+2<n;++j){int d=(a[i]!=a[j])+(a[i+1]!=a[j+1])+(a[i+2]!=a[j+2]);if(d==1)++s;}
cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "values 1 and 2: many beautiful pairs", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 2))` },
    { seed: 2, note: "wider values", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 50))` },
  ],
});

P.push({
  id: "B584", judge: "math-zero-remainder-moves", topic: "math", rating: 1400,
  tag: "Remainders", timeLimitMs: 2000,
  uz: "Hammasi k ga bo‘linsin",
  en: "Everything divisible by k",
  statementUz: "n ta musbat butun sondan iborat massiv va k soni berilgan. Boshida x = 0. Har bir harakatda ikkisidan birini qilasiz: yo biror a_i ga x ni qo‘shib, so‘ng x ni 1 ga oshirasiz (har bir i uchun bu ko‘pi bilan bir marta qilinadi), yo shunchaki x ni 1 ga oshirasiz. Massivdagi barcha elementlar k ga bo‘linishi uchun eng kami bilan nechta harakat kerak?",
  statementEn: "You are given an array of n positive integers and a number k. Initially x = 0. In each move you do one of two things: add x to some a_i and then increase x by 1 (this can be done at most once for each i), or just increase x by 1. What is the smallest number of moves after which every element of the array is divisible by k?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n va k, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n and k, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda harakatlarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of moves on its own line.",
  constraintList: ["1 ≤ t ≤ 2·10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ k, a_i ≤ 10^9", "each element can receive x at most once; the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 2·10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ k, a_i ≤ 10^9", "har bir elementga x ko‘pi bilan bir marta qo‘shiladi; javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n4 3\n1 2 1 3\n3 5\n5 10 15\n4 6\n8 7 1 8\n"],
  expect: ["6\n0\n12\n"],
  sampleNotesUz: [
    "Birinchi testda 2 ga x = 1 kerak, ikkala 1 ga x ≡ 2 (mod 3) kerak: x = 2 va x = 5. Oxirgi qo‘shishdan keyin x yana oshadi, shuning uchun 6 harakat. Ikkinchi testda hamma son allaqachon 5 ga bo‘linadi. Uchinchi testda 7 va 1 ga x ≡ 5 (mod 6) kerak: x = 5 va x = 11, jami 12 harakat.",
  ],
  sampleNotesEn: [
    "In the first test the 2 needs x = 1 and both 1s need x ≡ 2 (mod 3): x = 2 and x = 5. After the last addition x is still increased, so 6 moves. In the second every number is already divisible by 5. In the third the 7 and the 1 need x ≡ 5 (mod 6): x = 5 and x = 11, 12 moves in all.",
  ],
  testInputs: ["3\n4 3\n1 2 1 3\n3 5\n5 10 15\n4 6\n8 7 1 8\n", "1\n1 1\n7\n", "1\n1 1000000000\n1\n", "1\n5 2\n1 1 1 1 1\n", "1\n3 1000000000\n999999999 999999999 999999999\n"],
  sol: `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;map<long long,long long>c;for(int i=0;i<n;++i){long long a;cin>>a;long long r=a%k;if(r)c[k-r]++;}
long long ans=0;for(auto&p:c)ans=max(ans,p.first+(p.second-1)*k+1);cout<<ans<<"\\n";}`,
  wrongNote: "Ignoring elements that need the same remainder lets them share one value of x; stopping at the last addition forgets that the move itself increases x once more.",
  wrong: [
    `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;long long ans=0;for(int i=0;i<n;++i){long long a;cin>>a;long long r=a%k;if(r)ans=max(ans,k-r+1);}cout<<ans<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;map<long long,long long>c;for(int i=0;i<n;++i){long long a;cin>>a;long long r=a%k;if(r)c[k-r]++;}
long long ans=0;for(auto&p:c)ans=max(ans,p.first+(p.second-1)*k);cout<<ans<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 6), k = r.int(1, 6); return line([n, k]) + "\n" + line(r.ints(n, 1, 20)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;long long k;cin>>n>>k;map<long long,long long>need;long long left=0;for(int i=0;i<n;++i){long long a;cin>>a;if(a%k){need[(k-a%k)%k]++;++left;}}
long long x=0;while(left){auto it=need.find(x%k);if(it!=need.end()&&it->second>0){it->second--;--left;}++x;}cout<<x<<"\\n";}`],
  big: [
    { seed: 1, note: "the same remainder everywhere with a huge k: about 2·10^14 moves", code: `n = 200000\nreturn "1\\n" + line([n, 10**9]) + "\\n" + line([1] * n)` },
    { seed: 2, note: "random", code: `n = 200000\nreturn "1\\n" + line([n, r.int(1, 10**9)]) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "B585", judge: "sort-possible-champions", topic: "sorting", rating: 1400,
  tag: "Sorting and prefix sums", timeLimitMs: 1000,
  uz: "Kim chempion bo‘lishi mumkin",
  en: "Who could become champion",
  statementUz: "Turnirda n ta o‘yinchi qatnashadi, i-o‘yinchida a_i ta jeton bor. n − 1 ta o‘yin o‘tkaziladi: har safar hali jetoni bor ikki o‘yinchi tasodifiy tanlanadi, jetoni ko‘p bo‘lgani yutadi (teng bo‘lsa, g‘olib tasodifiy) va yutqazganning barcha jetonlarini oladi. Oxirida jetoni qolgan yagona o‘yinchi chempion bo‘ladi. Qaysi o‘yinchilarning chempion bo‘lish ehtimoli noldan katta?",
  statementEn: "n players take part in a tournament, and player i has a_i tokens. n − 1 games are played: each time two players who still have tokens are chosen at random, the one with more tokens wins (with equal tokens the winner is random) and takes all the loser's tokens. In the end the only player with tokens left is the champion. Which players have a non-zero chance of becoming champion?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun ikki qator chiqaring: shunday o‘yinchilar soni va ularning raqamlari o‘sish tartibida.",
  outputEn: "For each test case print two lines: the number of such players and their numbers in increasing order.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "players are numbered from 1 in input order"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "o‘yinchilar kiritish tartibida 1 dan raqamlanadi"],
  sampleInputs: ["2\n4\n1 2 4 3\n5\n1 1 1 1 1\n"],
  expect: ["3\n2 3 4\n5\n1 2 3 4 5\n"],
  sampleNotesUz: [
    "Birinchi testda 1 jetonli o‘yinchi hech kimni yuta olmaydi. 2 jetonli o‘yinchi avval uni yutib 3 ga, so‘ng 3 jetonlini yutib (teng holda omad bilan) 6 ga, keyin 4 jetonlini yutishi mumkin. Ikkinchi testda hamma teng, har kim chempion bo‘lishi mumkin.",
  ],
  sampleNotesEn: [
    "In the first test the player with 1 token can never win a game. The player with 2 can beat them to reach 3, beat the player with 3 (by luck on a tie) to reach 6, and then beat the player with 4. In the second test everyone is equal, so anyone can win.",
  ],
  testInputs: ["2\n4\n1 2 4 3\n5\n1 1 1 1 1\n", "1\n1\n5\n", "1\n3\n1 1 3\n", "1\n4\n1 2 4 8\n", "1\n5\n10 1 1 1 1\n", "1\n6\n3 3 7 1 13 2\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<pair<long long,int>>a(n);for(int i=0;i<n;++i){cin>>a[i].first;a[i].second=i+1;}sort(a.begin(),a.end());
long long pre=0;int cut=0;for(int i=0;i<n;++i){if(i>0&&pre<a[i].first)cut=i;pre+=a[i].first;}
vector<int>w;for(int i=cut;i<n;++i)w.push_back(a[i].second);sort(w.begin(),w.end());
cout<<w.size()<<"\\n";for(size_t i=0;i<w.size();++i)cout<<w[i]<<(i+1<w.size()?' ':'\\n');}`,
  wrongNote: "Naming only the richest players forgets that a smaller player can grow by beating others first; treating a tie as a loss rules out players who can win a tie by luck.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long mx=*max_element(a.begin(),a.end());vector<int>w;for(int i=0;i<n;++i)if(a[i]==mx)w.push_back(i+1);
cout<<w.size()<<"\\n";for(size_t i=0;i<w.size();++i)cout<<w[i]<<(i+1<w.size()?' ':'\\n');}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<pair<long long,int>>a(n);for(int i=0;i<n;++i){cin>>a[i].first;a[i].second=i+1;}sort(a.begin(),a.end());
long long pre=0;int cut=0;for(int i=0;i<n;++i){if(i>0&&pre<=a[i].first)cut=i;pre+=a[i].first;}
vector<int>w;for(int i=cut;i<n;++i)w.push_back(a[i].second);sort(w.begin(),w.end());
cout<<w.size()<<"\\n";for(size_t i=0;i<w.size();++i)cout<<w[i]<<(i+1<w.size()?' ':'\\n');}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 7); return n + "\n" + line(r.ints(n, 1, 9)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>b=a;sort(b.begin(),b.end());vector<int>w;
for(int i=0;i<n;++i){long long cur=a[i];bool skip=false;bool ok=true;for(int j=0;j<n;++j){if(b[j]==a[i]&&!skip){skip=true;continue;}if(b[j]>cur){ok=false;break;}cur+=b[j];}if(ok)w.push_back(i+1);}
cout<<w.size()<<"\\n";for(size_t i=0;i<w.size();++i)cout<<w[i]<<(i+1<w.size()?' ':'\\n');}`],
  big: [
    { seed: 1, note: "doubling values: only the last few can win", code: `n = 100000\na = [min(10**9, 1 << (i % 30)) for i in range(n)]\nreturn "1\\n" + str(n) + "\\n" + line(r.shuffle(a))` },
    { seed: 2, note: "random small values: almost everyone can win (output fits)", code: `n = 120000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "B586", judge: "bs-three-carvers-min-wait", topic: "binary-search", rating: 1400,
  tag: "Binary search on the answer", timeLimitMs: 1000,
  uz: "Uchta usta",
  en: "Three carvers",
  statementUz: "Ustaxonada uchta o‘ymakor usta ishlaydi, har biri ishdan oldin bitta butun x_j naqshni tanlaydi. n ta mijoz keladi, i-mijoz a_i naqshli o‘yinchoq istaydi. Mijozni x_j naqshli usta tayyorlasa, uning kutish vaqti |a_i − x_j|; har bir mijoz kutishi eng kam bo‘ladigan ustaga boradi. x_1, x_2, x_3 ni shunday tanlangki, mijozlar kutish vaqtlarining eng kattasi iloji boricha kichik bo‘lsin. Shu eng kichik qiymatni chiqaring.",
  statementEn: "Three carvers work in a workshop, and before the day starts each of them picks one integer pattern x_j. n customers come, and customer i wants a toy with pattern a_i. If a carver with pattern x_j makes it, the customer waits |a_i − x_j|; every customer goes to the carver that makes them wait least. Choose x_1, x_2, x_3 so that the largest waiting time over all customers is as small as possible, and print that value.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda eng kattaning eng kichik qiymatini chiqaring.",
  outputEn: "For each test case print the smallest possible largest wait on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "the patterns x_j must be integers"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "x_j naqshlar butun son bo‘lishi kerak"],
  sampleInputs: ["3\n6\n1 7 7 9 9 9\n5\n1 2 3 4 5\n4\n1 100 200 1000000000\n"],
  expect: ["0\n1\n50\n"],
  sampleNotesUz: [
    "Birinchi testda ustalar 1, 7 va 9 ni tanlaydi — hech kim kutmaydi. Ikkinchi testda, masalan, 2, 4 va 5: eng uzun kutish 1. Uchinchi testda 1 va 100 bitta ustaga tushadi; 50 yoki 51 naqsh bilan eng uzun kutish 50.",
  ],
  sampleNotesEn: [
    "In the first test the carvers pick 1, 7 and 9 and nobody waits. In the second, for example 2, 4 and 5 make the longest wait 1. In the third 1 and 100 share a carver; with pattern 50 or 51 the longest wait is 50.",
  ],
  testInputs: ["3\n6\n1 7 7 9 9 9\n5\n1 2 3 4 5\n4\n1 100 200 1000000000\n", "1\n1\n5\n", "1\n3\n1 1000000000 500000000\n", "1\n4\n1 2 1000000000 999999999\n", "1\n7\n10 20 30 40 50 60 70\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
auto fits=[&](long long d){int used=0;int i=0;while(i<n){++used;long long lim=a[i]+2*d;while(i<n&&a[i]<=lim)++i;}return used<=3;};
long long lo=-1,hi=1000000000;while(hi-lo>1){long long m=(lo+hi)/2;if(fits(m))hi=m;else lo=m;}
cout<<hi<<"\\n";}`,
  wrongNote: "Letting a carver serve a stretch of length 2d + 1 rounds the wait down where it must round up; planning for two carvers instead of three wastes one of them.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
auto fits=[&](long long d){int used=0;int i=0;while(i<n){++used;long long lim=a[i]+2*d+1;while(i<n&&a[i]<=lim)++i;}return used<=3;};
long long lo=-1,hi=1000000000;while(hi-lo>1){long long m=(lo+hi)/2;if(fits(m))hi=m;else lo=m;}
cout<<hi<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
auto fits=[&](long long d){int used=0;int i=0;while(i<n){++used;long long lim=a[i]+2*d;while(i<n&&a[i]<=lim)++i;}return used<=2;};
long long lo=-1,hi=1000000000;while(hi-lo>1){long long m=(lo+hi)/2;if(fits(m))hi=m;else lo=m;}
cout<<hi<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 8); return n + "\n" + line(r.ints(n, 1, 30)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long best=LLONG_MAX;
auto cost=[&](int l,int r){if(l>r)return 0LL;return (a[r]-a[l]+1)/2;};
for(int i=0;i<=n;++i)for(int j=i;j<=n;++j)best=min(best,max({cost(0,i-1),cost(i,j-1),cost(j,n-1)}));
cout<<best<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long best=LLONG_MAX;
auto cost=[&](int l,int r){if(l>r)return 0LL;return (a[r]-a[l]+1)/2;};
for(int i=0;i<=n;++i)for(int j=i;j<=n;++j)best=min(best,max({cost(0,i-1),cost(i,j-1),cost(j,n-1)}));
cout<<best<<"\\n";}`],
  big: [
    { seed: 1, note: "one long random test: trying every split is quadratic", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

export default P;
