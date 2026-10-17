/* Batch 549 — sixteen problems at 1200, B549–B564.
 *
 * 1200 is where most duels aim their middle round (1278 rounds by
 * 2026-10-17). Every task is a well-known contest problem restated for
 * AlgoYo'l in our own words, with our own samples; ratings follow the
 * Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];
const tests = (r, k, one) => { const t = r.int(1, k); let s = t + "\n"; for (let i = 0; i < t; i++) s += one(r); return s; };

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B549", judge: "math-kth-not-divisible", topic: "math", rating: 1200,
  tag: "Arithmetic", timeLimitMs: 1000,
  uz: "Bo‘linmaydigan k-son",
  en: "The k-th number not divisible by n",
  statementUz: "Sizga n va k sonlari berilgan. Musbat butun sonlarni o‘sish tartibida yozib chiqamiz va ulardan n ga bo‘linadiganlarini o‘chirib tashlaymiz. Qolgan ketma-ketlikning k-hadini toping. Masalan, n = 3 bo‘lsa, qolgan sonlar 1, 2, 4, 5, 7, 8, 10, … va ularning 7-hadi 10. Har bir so‘rov alohida yechiladi.",
  statementEn: "You are given n and k. Write out the positive integers in increasing order and cross out those divisible by n. Find the k-th term of what remains. For instance, for n = 3 the remaining numbers are 1, 2, 4, 5, 7, 8, 10, … and the 7th of them is 10. Each query is answered on its own.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida n va k sonlari keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains n and k.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 1000", "2 ≤ n ≤ 10^9", "1 ≤ k ≤ 10^9", "the answer can exceed 10^9"],
  constraintListUz: ["1 ≤ t ≤ 1000", "2 ≤ n ≤ 10^9", "1 ≤ k ≤ 10^9", "javob 10^9 dan oshishi mumkin"],
  sampleInputs: ["3\n3 7\n4 12\n2 1\n"],
  expect: ["10\n15\n1\n"],
  sampleNotesUz: [
    "n = 3 da 7-had 10. n = 4 da 4 ga bo‘linmaydigan sonlar 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15 — 12-had 15. n = 2 da birinchi toq son 1.",
  ],
  sampleNotesEn: [
    "For n = 3 the 7th term is 10. For n = 4 the numbers not divisible by 4 are 1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15 — the 12th is 15. For n = 2 the first odd number is 1.",
  ],
  testInputs: ["3\n3 7\n4 12\n2 1\n", "1\n2 1000000000\n", "1\n1000000000 1000000000\n", "4\n5 4\n5 5\n5 8\n5 9\n", "2\n999999999 999999998\n999999999 999999999\n"],
  sol: `int t;cin>>t;while(t--){long long n,k;cin>>n>>k;cout<<k+(k-1)/(n-1)<<"\\n";}`,
  wrongNote: "Adding k/(n − 1) skips one number too many whenever k is a multiple of n − 1; a search capped at 10^9 cannot return the larger answers.",
  wrong: [
    `int t;cin>>t;while(t--){long long n,k;cin>>n>>k;cout<<k+k/(n-1)<<"\\n";}`,
    `int t;cin>>t;while(t--){long long n,k;cin>>n>>k;long long lo=0,hi=1000000000;while(hi-lo>1){long long m=(lo+hi)/2;if(m-m/n>=k)hi=m;else lo=m;}cout<<hi<<"\\n";}`,
  ],
  gen: (r) => tests(r, 6, (r) => line([r.int(2, 7), r.int(1, 30)]) + "\n"),
  slow: [`int t;cin>>t;while(t--){long long n,k;cin>>n>>k;long long x=0,c=0;while(c<k){++x;if(x%n)++c;}cout<<x<<"\\n";}`],
  big: [
    { seed: 1, note: "large k: counting one by one is too slow", code: `return "1000\\n" + "\\n".join(line([r.int(2, 10**9), r.int(9 * 10**8, 10**9)]) for _ in range(1000))` },
  ],
});

P.push({
  id: "B550", judge: "greedy-alternating-signs-max-sum", topic: "greedy", rating: 1200,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Ishoralari almashinadigan qism ketma-ketlik",
  en: "A subsequence of alternating signs",
  statementUz: "Nolga teng bo‘lmagan n ta butun sondan iborat ketma-ketlik berilgan. Qism ketma-ketlik — ba'zi elementlarni o‘chirib, qolganlarini tartibini o‘zgartirmay olganda hosil bo‘ladigan ketma-ketlik. Qism ketma-ketlik ishorasi almashinadigan deyiladi, agar unda har ikki qo‘shni element turli ishorali bo‘lsa. Ishorasi almashinadigan qism ketma-ketliklar ichida eng uzunlarini olamiz; ular orasida elementlar yig‘indisi eng katta bo‘lganining yig‘indisini toping.",
  statementEn: "You are given a sequence of n non-zero integers. A subsequence is what remains after deleting some elements without changing the order of the rest. A subsequence has alternating signs if every two neighbouring elements in it have different signs. Among all subsequences with alternating signs, take those of the greatest possible length, and among them find the largest sum of elements.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda eng katta yig‘indini chiqaring.",
  outputEn: "For each test case print the largest sum on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9, a_i ≠ 0", "only the longest alternating subsequences compete"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "−10^9 ≤ a_i ≤ 10^9, a_i ≠ 0", "faqat eng uzun almashinadigan qism ketma-ketliklar solishtiriladi"],
  sampleInputs: ["3\n5\n1 2 -1 -2 3\n4\n-1 -2 -3 -4\n6\n3 -5 2 -1 -4 7\n"],
  expect: ["4\n-1\n6\n"],
  sampleNotesUz: [
    "Birinchi testda eng uzun almashinadigan qism ketma-ketlik uzunligi 3, eng yaxshisi 2, −1, 3. Ikkinchi testda hamma sonlar manfiy, uzunlik 1, eng kattasi −1. Uchinchi testda 3, −5, 2, −1, 7: yig‘indi 6.",
  ],
  sampleNotesEn: [
    "In the first test the longest alternating subsequences have length 3, and the best is 2, −1, 3. In the second all numbers are negative, the length is 1, and the largest is −1. In the third, 3, −5, 2, −1, 7 sums to 6.",
  ],
  testInputs: ["3\n5\n1 2 -1 -2 3\n4\n-1 -2 -3 -4\n6\n3 -5 2 -1 -4 7\n", "1\n1\n-1000000000\n", "1\n6\n1 -1 1 -1 1 -1\n", "1\n5\n-5 -1 4 9 -2\n", "1\n4\n1000000000 1000000000 -1 1000000000\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0;
for(int i=0;i<n;){int j=i;long long m=a[i];while(j<n&&(a[j]>0)==(a[i]>0)){m=max(m,a[j]);++j;}s+=m;i=j;}
cout<<s<<"\\n";}`,
  wrongNote: "Taking the first element of every block of equal signs keeps the length but not the best values; adding all the positive numbers drops the length requirement.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0;
for(int i=0;i<n;){int j=i;while(j<n&&(a[j]>0)==(a[i]>0))++j;s+=a[i];i=j;}
cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0,mx=LLONG_MIN;bool pos=false;
for(auto x:a){if(x>0){s+=x;pos=true;}mx=max(mx,x);}cout<<(pos?s:mx)<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 10); return n + "\n" + line(Array.from({ length: n }, () => r.int(1, 9) * (r.int(0, 1) ? 1 : -1))) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int bl=0;long long bs=LLONG_MIN;
for(int m=1;m<(1<<n);++m){vector<long long>v;for(int i=0;i<n;++i)if(m>>i&1)v.push_back(a[i]);bool ok=true;for(size_t i=1;i<v.size();++i)if((v[i]>0)==(v[i-1]>0))ok=false;if(!ok)continue;
 long long s=accumulate(v.begin(),v.end(),0LL);int l=v.size();if(l>bl||(l==bl&&s>bs)){bl=l;bs=s;}}
cout<<bs<<"\\n";}`,
  big: [
    { seed: 1, note: "one long random sequence", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.int(1, 10**9) * (1 if r.int(0, 1) else -1) for _ in range(n))` },
  ],
});

P.push({
  id: "B551", judge: "two-pointers-erase-prefix-good", topic: "two-pointers", rating: 1200,
  tag: "Greedy", timeLimitMs: 1000,
  uz: "Massivni yaxshi qilish",
  en: "Making the array good",
  statementUz: "Massiv yaxshi deyiladi, agar undan har safar birinchi yoki oxirgi elementni olib tashlab, olingan elementlarni olingan tartibda yozganda kamaymaydigan ketma-ketlik hosil qilib, massivni to‘liq bo‘shatish mumkin bo‘lsa. Bo‘sh massiv ham yaxshi. Sizga n ta sondan iborat a massivi berilgan. Undan qanday eng qisqa boshlang‘ich qismni (prefiksni) o‘chirsak, qolgani yaxshi massiv bo‘ladi? Prefiks uzunligini chiqaring; hech narsa o‘chirmaslik ham mumkin.",
  statementEn: "An array is called good if you can empty it by repeatedly removing its first or its last element so that the removed elements, written in the order they were removed, form a non-decreasing sequence. An empty array is good. You are given an array a of n numbers. What is the length of the shortest beginning (prefix) that has to be deleted so that the rest of the array is good? Deleting nothing is allowed.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda o‘chiriladigan prefiksning eng kichik uzunligini chiqaring.",
  outputEn: "For each test case print the smallest length of the prefix to delete, on its own line.",
  constraintList: ["1 ≤ t ≤ 2·10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 2·10^5", "equal values are allowed next to each other in the removed sequence"],
  constraintListUz: ["1 ≤ t ≤ 2·10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 2·10^5", "olingan ketma-ketlikda teng qiymatlar yonma-yon kelishi mumkin"],
  sampleInputs: ["3\n4\n1 2 3 4\n7\n4 3 3 8 4 5 2\n3\n5 1 5\n"],
  expect: ["0\n4\n1\n"],
  sampleNotesUz: [
    "1 2 3 4 allaqachon yaxshi. Ikkinchi testda 4, 3, 3, 8 o‘chirilsa, 4 5 2 qoladi: 2, 4, 5 tartibida olinadi; 8 qolsa, uni ham, 2 dan keyingi kichik sonlarni ham to‘g‘ri tartibda olib bo‘lmaydi. Uchinchi testda birinchi 5 ni o‘chirish yetarli.",
  ],
  sampleNotesEn: [
    "1 2 3 4 is good already. In the second test deleting 4, 3, 3, 8 leaves 4 5 2, removed as 2, 4, 5; with the 8 kept there is no order that works. In the third, deleting the first 5 is enough.",
  ],
  testInputs: ["3\n4\n1 2 3 4\n7\n4 3 3 8 4 5 2\n3\n5 1 5\n", "1\n5\n2 2 3 3 1\n", "1\n1\n7\n", "1\n6\n6 5 4 3 2 1\n", "1\n8\n1 3 1 3 1 3 2 1\n", "2\n5\n3 1 2 1 3\n4\n2 1 1 2\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int i=n-1;
while(i>0&&a[i-1]>=a[i])--i;while(i>0&&a[i-1]<=a[i])--i;
cout<<i<<"\\n";}`,
  wrongNote: "Walking back only over the falling end stops before the rising part that can stay; strict comparisons stop at the first pair of equal values.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int i=n-1;
while(i>0&&a[i-1]>=a[i])--i;
cout<<i<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int i=n-1;
while(i>0&&a[i-1]>a[i])--i;while(i>0&&a[i-1]<a[i])--i;
cout<<i<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, 5)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
auto good=[&](int p){int l=p,r=n-1,last=0;while(l<=r){int c;if(a[l]<=a[r]){if(a[l]>=last){c=a[l++];}else if(a[r]>=last){c=a[r--];}else return false;}else{if(a[r]>=last){c=a[r--];}else if(a[l]>=last){c=a[l++];}else return false;}last=c;}return true;};
int p=0;while(!good(p))++p;cout<<p<<"\\n";}`],
  big: [
    { seed: 1, note: "a zigzag: the good part is short, testing each prefix is quadratic", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line([1 + (i % 2) for i in range(n)])` },
    { seed: 2, note: "a long mountain after a rough start", code: `n = 200000\nh = n // 2\na = r.ints(1000, 1, 200000) + list(range(1, h)) + list(range(n - h - 1000 + 1, 0, -1))\nreturn "1\\n" + str(len(a)) + "\\n" + line(a)` },
  ],
});

P.push({
  id: "B552", judge: "math-and-not-less-than-xor", topic: "math", rating: 1200,
  tag: "Bitwise", timeLimitMs: 1000,
  uz: "VA va XOR",
  en: "AND against XOR",
  statementUz: "n ta musbat butun sondan iborat massiv berilgan. i < j bo‘lgan va a_i AND a_j ≥ a_i XOR a_j shartini qanoatlantiradigan (i, j) juftliklar sonini toping. Bu yerda AND — bitlar bo‘yicha VA amali, XOR — bitlar bo‘yicha istisno qiluvchi YOKI amali. Juftlikdagi o‘rinlar turlicha bo‘lishi kerak, qiymatlar esa teng bo‘lishi mumkin; masalan, 4 va 7 shunday juftlik, chunki 4 AND 7 = 4, 4 XOR 7 = 3.",
  statementEn: "You are given an array of n positive integers. Count the pairs (i, j) with i < j such that a_i AND a_j ≥ a_i XOR a_j, where AND is bitwise and and XOR is bitwise exclusive or. The two positions of a pair must differ, but their values may be equal; for instance 4 and 7 form such a pair, since 4 AND 7 = 4 and 4 XOR 7 = 3.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda juftliklar sonini chiqaring.",
  outputEn: "For each test case print the number of pairs on its own line.",
  constraintList: ["1 ≤ t ≤ 10", "1 ≤ n ≤ 10^5, the sum of n over all tests ≤ 10^5", "1 ≤ a_i ≤ 10^9", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10", "1 ≤ n ≤ 10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 10^5", "1 ≤ a_i ≤ 10^9", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n5\n1 4 3 7 10\n3\n1 1 1\n4\n6 2 5 3\n"],
  expect: ["1\n3\n2\n"],
  sampleNotesUz: [
    "Birinchi testda faqat 4 va 7: 4 AND 7 = 4, 4 XOR 7 = 3. Ikkinchi testda har bir juftlikda 1 AND 1 = 1 > 0. Uchinchi testda (6, 5) va (2, 3) juftliklari mos keladi.",
  ],
  sampleNotesEn: [
    "In the first test only 4 and 7 qualify: 4 AND 7 = 4 while 4 XOR 7 = 3. In the second every pair has 1 AND 1 = 1 > 0. In the third the pairs (6, 5) and (2, 3) qualify.",
  ],
  testInputs: ["3\n5\n1 4 3 7 10\n3\n1 1 1\n4\n6 2 5 3\n", "1\n1\n5\n", "1\n2\n1 2\n", "1\n6\n8 9 10 11 12 15\n", "1\n5\n1000000000 536870912 600000000 1 2\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;long long c[32]={0};for(int i=0;i<n;++i){long long a;cin>>a;c[63-__builtin_clzll(a)]++;}
long long s=0;for(int b=0;b<32;++b)s+=c[b]*(c[b]-1)/2;cout<<s<<"\\n";}`,
  wrongNote: "Counting only pairs of equal values misses 4 and 7; counting ordered pairs counts each pair twice.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;map<long long,long long>c;for(int i=0;i<n;++i){long long a;cin>>a;c[a]++;}
long long s=0;for(auto&p:c)s+=p.second*(p.second-1)/2;cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;long long c[32]={0};for(int i=0;i<n;++i){long long a;cin>>a;c[63-__builtin_clzll(a)]++;}
long long s=0;for(int b=0;b<32;++b)s+=c[b]*(c[b]-1);cout<<s<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, 40)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long s=0;
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)if((a[i]&a[j])>=(a[i]^a[j]))++s;cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "10^5 values with the same top bit: about 5·10^9 pairs", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 2**29, 2**30 - 1))` },
    { seed: 2, note: "random", code: `n = 100000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "B553", judge: "greedy-even-odd-game", topic: "greedy", rating: 1200,
  tag: "Games", timeLimitMs: 1000,
  uz: "Juft va toq o‘yini",
  en: "The even and odd game",
  statementUz: "Alisa va Bobur n ta musbat butun sondan iborat massiv bilan o‘ynaydi. Ular navbat bilan yurishadi, birinchi bo‘lib Alisa. Yurishda o‘yinchi massivdan istalgan bitta elementni olib tashlaydi. Agar Alisa juft sonni olsa, shu son uning ochkosiga qo‘shiladi, toq sonni olsa — hech narsa. Bobur esa toq sonni olsa, ochkosiga qo‘shiladi, juft sonni olsa — hech narsa. Massiv bo‘shaganda ochkosi ko‘p o‘yinchi g‘olib, teng bo‘lsa — durang. Ikkalasi ham eng yaxshi o‘ynasa, natija qanday bo‘ladi?",
  statementEn: "Alice and Bob play with an array of n positive integers. They move in turns, Alice first. On a move a player removes any one element of the array. If Alice removes an even number, it is added to her score; an odd one gives her nothing. If Bob removes an odd number, it is added to his score; an even one gives him nothing. When the array is empty, the player with the higher score wins, and equal scores are a tie. Who wins if both play as well as possible?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda Alice, Bob yoki Tie so‘zini chiqaring.",
  outputEn: "For each test case print Alice, Bob or Tie on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "a player may take a number that scores nothing for them"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "o‘yinchi o‘ziga ochko bermaydigan sonni ham olishi mumkin"],
  sampleInputs: ["3\n4\n5 2 7 3\n3\n3 2 1\n4\n2 2 2 2\n"],
  expect: ["Bob\nTie\nAlice\n"],
  sampleNotesUz: [
    "Birinchi testda Alisa 7 ni olib, uni Boburga qoldirmaydi; Bobur 5 ni oladi; keyin 3 va 2 hech kimga ochko bermaydi: Bobur 5 : 0 bilan yutadi. Ikkinchi testda hech kim ochko ololmaydi. Uchinchi testda Alisa ikki marta 2 oladi.",
  ],
  sampleNotesEn: [
    "In the first test Alice takes 7 so Bob cannot have it, Bob takes 5, and then 3 and 2 score nothing for whoever takes them: Bob wins 5 to 0. In the second nobody manages to score. In the third Alice takes a 2 twice.",
  ],
  testInputs: ["3\n4\n5 2 7 3\n3\n3 2 1\n4\n2 2 2 2\n", "1\n2\n1 2\n", "1\n1\n7\n", "1\n1\n8\n", "1\n6\n10 9 8 7 6 5\n", "2\n5\n1 1 1 1 1\n4\n1000000000 999999999 2 3\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());long long d=0;
for(int i=0;i<n;++i){if(i%2==0&&a[i]%2==0)d+=a[i];if(i%2==1&&a[i]%2==1)d-=a[i];}
cout<<(d>0?"Alice":d<0?"Bob":"Tie")<<"\\n";}`,
  wrongNote: "Each player chasing only their own parity lets the other keep a large number; taking the elements in the order given forgets that a move may pick any element.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;multiset<long long>ev,od;for(int i=0;i<n;++i){long long x;cin>>x;(x%2?od:ev).insert(x);}long long A=0,B=0;
for(int i=0;i<n;++i){if(i%2==0){if(!ev.empty()){A+=*ev.rbegin();ev.erase(prev(ev.end()));}else od.erase(prev(od.end()));}
 else{if(!od.empty()){B+=*od.rbegin();od.erase(prev(od.end()));}else ev.erase(prev(ev.end()));}}
cout<<(A>B?"Alice":A<B?"Bob":"Tie")<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long d=0;
for(int i=0;i<n;++i){if(i%2==0&&a[i]%2==0)d+=a[i];if(i%2==1&&a[i]%2==1)d-=a[i];}
cout<<(d>0?"Alice":d<0?"Bob":"Tie")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 8); return n + "\n" + line(r.ints(n, 1, 12)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>memo(1<<n,LLONG_MIN);
function<long long(int)>go=[&](int used)->long long{if(used==(1<<n)-1)return 0;long long&m=memo[used];if(m!=LLONG_MIN)return m;int turn=__builtin_popcount(used)%2;long long best=turn==0?LLONG_MIN:LLONG_MAX;
 for(int i=0;i<n;++i)if(!(used>>i&1)){long long g=0;if(turn==0&&a[i]%2==0)g=a[i];if(turn==1&&a[i]%2==1)g=-a[i];long long v=g+go(used|1<<i);best=turn==0?max(best,v):min(best,v);}
 return m=best;};
long long d=go(0);cout<<(d>0?"Alice":d<0?"Bob":"Tie")<<"\\n";}`,
  big: [
    { seed: 1, note: "one long random array", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 10**9))` },
  ],
});

P.push({
  id: "B554", judge: "hash-same-differences", topic: "data-structures", rating: 1200,
  tag: "Hashing", timeLimitMs: 1000,
  uz: "Bir xil ayirmalar",
  en: "Equal differences",
  statementUz: "n ta butun sondan iborat massiv berilgan, o‘rinlar 1 dan n gacha. i < j bo‘lgan va a_j − a_i = j − i shartini qanoatlantiradigan (i, j) juftliklar sonini toping — ya'ni qiymatlar orasidagi ayirma o‘rinlar orasidagi ayirmaga teng bo‘lgan juftliklar sonini. Masalan, 1 3 3 4 massivida (1, 4) juftligi mos keladi, chunki 4 − 1 = 3 = 4 − 1. Har bir juftlik bir marta sanaladi.",
  statementEn: "You are given an array of n integers at positions 1 to n. Count the pairs (i, j) with i < j and a_j − a_i = j − i — the pairs whose values differ by exactly as much as their positions do. For example, in the array 1 3 3 4 the pair (1, 4) qualifies, since 4 − 1 = 3 = 4 − 1. Each pair is counted once.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda juftliklar sonini chiqaring.",
  outputEn: "For each test case print the number of pairs on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ n", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ n", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n6\n3 5 1 4 6 6\n3\n1 2 3\n4\n1 3 3 4\n"],
  expect: ["1\n3\n3\n"],
  sampleNotesUz: [
    "Birinchi testda faqat (4, 6): 6 − 4 = 2 = 6 − 4. Ikkinchi testda har bir juftlik mos keladi. Uchinchi testda (1, 3), (1, 4) va (3, 4).",
  ],
  sampleNotesEn: [
    "In the first test only (4, 6) works: 6 − 4 = 2 = 6 − 4. In the second every pair works. In the third, (1, 3), (1, 4) and (3, 4).",
  ],
  testInputs: ["3\n6\n3 5 1 4 6 6\n3\n1 2 3\n4\n1 3 3 4\n", "1\n1\n1\n", "1\n5\n5 4 3 2 1\n", "1\n6\n1 1 3 3 5 5\n", "1\n7\n1 2 3 1 2 3 7\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>v(n);for(int i=0;i<n;++i){long long a;cin>>a;v[i]=a-i;}sort(v.begin(),v.end());long long s=0;
for(int i=0,j;i<n;i=j){j=i;while(j<n&&v[j]==v[i])++j;long long c=j-i;s+=c*(c-1)/2;}cout<<s<<"\\n";}`,
  wrongNote: "Grouping by a_i + i finds pairs whose values fall as the positions rise; counting each pair in both orders doubles the answer.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;map<long long,long long>c;long long s=0;for(int i=1;i<=n;++i){long long a;cin>>a;s+=c[a+i]++;}cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;map<long long,long long>c;long long s=0;for(int i=1;i<=n;++i){long long a;cin>>a;s+=2*c[a-i]++;}cout<<s<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, n)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];long long s=0;
for(int i=1;i<=n;++i)for(int j=i+1;j<=n;++j)if(a[j]-a[i]==j-i)++s;cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "1, 2, …, n: every pair counts, about 2·10^10", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(range(1, n + 1))` },
    { seed: 2, note: "random", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, n))` },
  ],
});

P.push({
  id: "B555", judge: "math-product-equals-index-sum", topic: "math", rating: 1200,
  tag: "Harmonic loops", timeLimitMs: 2000,
  uz: "Ko‘paytma o‘rinlar yig‘indisiga teng",
  en: "A product equal to the positions' sum",
  statementUz: "n ta turli musbat butun sondan iborat massiv berilgan, o‘rinlar 1 dan n gacha va har bir a_i 2n dan oshmaydi. i < j bo‘lgan va a_i · a_j = i + j shartini qanoatlantiradigan (i, j) juftliklar sonini toping — ya'ni ikki elementning ko‘paytmasi ularning o‘rinlari yig‘indisiga teng bo‘lgan juftliklar sonini. Masalan, a_1 = 3 va a_2 = 1 shunday juftlik, chunki 3 · 1 = 3 = 1 + 2.",
  statementEn: "You are given an array of n distinct positive integers at positions 1 to n, and every a_i is at most 2n. Count the pairs (i, j) with i < j and a_i · a_j = i + j — the pairs whose product of values equals the sum of their positions. For example, a_1 = 3 and a_2 = 1 form such a pair, because 3 · 1 = 3 = 1 + 2.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda juftliklar sonini chiqaring.",
  outputEn: "For each test case print the number of pairs on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 2n", "all a_i are distinct"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 2n", "barcha a_i lar turli"],
  sampleInputs: ["3\n2\n3 1\n3\n6 1 5\n5\n3 1 5 9 2\n"],
  expect: ["1\n1\n3\n"],
  sampleNotesUz: [
    "Birinchi testda 3 · 1 = 3 = 1 + 2. Ikkinchi testda faqat (2, 3): 1 · 5 = 5. Uchinchi testda (1, 2): 3 = 3, (1, 5): 6 = 6 va (2, 3): 5 = 5.",
  ],
  sampleNotesEn: [
    "In the first test 3 · 1 = 3 = 1 + 2. In the second only (2, 3) works: 1 · 5 = 5. In the third, (1, 2): 3 = 3, (1, 5): 6 = 6 and (2, 3): 5 = 5.",
  ],
  testInputs: ["3\n2\n3 1\n3\n6 1 5\n5\n3 1 5 9 2\n", "1\n2\n1 2\n", "1\n2\n4 3\n", "1\n6\n1 2 3 4 5 6\n", "1\n8\n16 1 15 2 14 3 13 4\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];long long s=0;
for(long long i=1;i<=n;++i)for(long long j=a[i]-i;j<=n;j+=a[i])if(j>i&&a[i]*a[j]==i+j)++s;
cout<<s<<"\\n";}`,
  wrongNote: "Letting i equal j counts a single element whose square is twice its position; trying only j = a_i − i misses the partners further along by multiples of a_i.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];long long s=0;
for(long long i=1;i<=n;++i)for(long long j=a[i]-i;j<=n;j+=a[i])if(j>=i&&a[i]*a[j]==i+j)++s;
cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];long long s=0;
for(long long i=1;i<=n;++i){long long j=a[i]-i;if(j>i&&j<=n&&a[i]*a[j]==i+j)++s;}
cout<<s<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(2, 8); return n + "\n" + line(r.shuffle(Array.from({ length: 2 * n }, (_, i) => i + 1)).slice(0, n)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n+1);for(int i=1;i<=n;++i)cin>>a[i];long long s=0;
for(long long i=1;i<=n;++i)for(long long j=i+1;j<=n;++j)if(a[i]*a[j]==i+j)++s;cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "small values up front: the most partners per element", code: `out = []\nfor _ in range(2):\n    n = 100000\n    a = list(range(1, n + 1))\n    out.append(str(n) + "\\n" + line(a))\nreturn "2\\n" + "\\n".join(out)` },
    { seed: 2, note: "a random choice of values", code: `n = 100000\na = r.shuffle(list(range(1, 2 * n + 1)))[:n]\nreturn "1\\n" + str(n) + "\\n" + line(a)` },
  ],
});

P.push({
  id: "B556", judge: "bs-stairs-leg-length", topic: "binary-search", rating: 1200,
  tag: "Prefix maxima", timeLimitMs: 1000,
  uz: "Zinapoyaga chiqish",
  en: "Climbing the stairs",
  statementUz: "Zinapoyada n ta pog‘ona bor: i-pog‘ona oldingisidan a_i birlik balandroq, birinchi pog‘ona yerdan a_1 balandlikda. Oyog‘ining uzunligi k bo‘lgan odam pog‘onaga faqat uning balandligi oldingisidan ko‘pi bilan k ga ortiq bo‘lsa chiqa oladi, va pog‘onalarni ketma-ket, birontasini tashlab ketmasdan bosib chiqadi. q ta so‘rovda oyoq uzunligi k_j beriladi: shunday odam yerdan qancha balandlikka ko‘tarila oladi?",
  statementEn: "A staircase has n steps: step i is a_i units higher than the step before it, and the first step is a_1 above the ground. A person with legs of length k can climb onto a step only if it is at most k higher than the previous one, and they climb the steps in order without skipping any. Each of q queries gives a leg length k_j: how high above the ground can such a person get?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test uch qatordan iborat: n va q; n ta son a_i; q ta son k_j.",
  inputEn: "The first line contains the number of test cases t. Each test case takes three lines: n and q; the n numbers a_i; the q numbers k_j.",
  outputUz: "Har bir so‘rov uchun alohida qatorda erishiladigan balandlikni chiqaring.",
  outputEn: "For each query print the height reached on its own line.",
  constraintList: ["1 ≤ t ≤ 100", "1 ≤ n, q ≤ 2·10^5; the sums of n and of q over all tests are each ≤ 2·10^5", "1 ≤ a_i, k_j ≤ 10^9", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 100", "1 ≤ n, q ≤ 2·10^5; barcha testlar bo‘yicha n lar va q lar yig‘indisi har biri ≤ 2·10^5", "1 ≤ a_i, k_j ≤ 10^9", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["2\n5 4\n1 2 1 5 2\n1 2 4 5\n2 2\n3 4\n2 5\n"],
  expect: ["1\n4\n4\n11\n0\n7\n"],
  sampleNotesUz: [
    "Birinchi testda k = 1 bilan faqat birinchi pog‘onaga (balandlik 1), k = 2 va k = 4 bilan uchinchisigacha (1 + 2 + 1 = 4) chiqiladi, 5 ga baland pog‘ona to‘sib turadi; k = 5 bilan hammasi: 11. Ikkinchi testda k = 2 bilan birinchi pog‘onaga ham chiqib bo‘lmaydi.",
  ],
  sampleNotesEn: [
    "In the first test k = 1 reaches only the first step (height 1), k = 2 and k = 4 reach the third (1 + 2 + 1 = 4) and are stopped by the step 5 high, and k = 5 climbs them all: 11. In the second test k = 2 cannot even get onto the first step.",
  ],
  testInputs: ["2\n5 4\n1 2 1 5 2\n1 2 4 5\n2 2\n3 4\n2 5\n", "1\n1 2\n1000000000\n999999999 1000000000\n", "1\n4 4\n4 3 2 1\n1 2 3 4\n", "1\n6 3\n1 1 9 1 1 1\n1 8 9\n"],
  sol: `int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>mx(n),ps(n);for(int i=0;i<n;++i){long long a;cin>>a;mx[i]=max(i?mx[i-1]:0,a);ps[i]=(i?ps[i-1]:0)+a;}
while(q--){long long k;cin>>k;int p=upper_bound(mx.begin(),mx.end(),k)-mx.begin();cout<<(p?ps[p-1]:0)<<"\\n";}}`,
  wrongNote: "Adding every step that is low enough, wherever it stands, climbs past a step the person could not get over; comparing the steps with k strictly refuses a step exactly k high.",
  wrong: [
    `int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
while(q--){long long k;cin>>k;long long s=0;for(auto x:a)if(x<=k)s+=x;cout<<s<<"\\n";}}`,
    `int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>mx(n),ps(n);for(int i=0;i<n;++i){long long a;cin>>a;mx[i]=max(i?mx[i-1]:0,a);ps[i]=(i?ps[i-1]:0)+a;}
while(q--){long long k;cin>>k;int p=lower_bound(mx.begin(),mx.end(),k)-mx.begin();cout<<(p?ps[p-1]:0)<<"\\n";}}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 7), q = r.int(1, 5); return line([n, q]) + "\n" + line(r.ints(n, 1, 6)) + "\n" + line(r.ints(q, 1, 7)) + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
while(q--){long long k;cin>>k;long long s=0;for(auto x:a){if(x>k)break;s+=x;}cout<<s<<"\\n";}}`],
  big: [
    { seed: 1, note: "tall legs: every query climbs nearly all the steps", code: `n, q = 200000, 50000\nreturn "1\\n" + line([n, q]) + "\\n" + line(r.ints(n, 1, 1000)) + "\\n" + line(r.ints(q, 1000, 10**9))` },
    { seed: 2, note: "random", code: `n, q = 200000, 50000\nreturn "1\\n" + line([n, q]) + "\\n" + line(r.ints(n, 1, 10**9)) + "\\n" + line(r.ints(q, 1, 10**9))` },
  ],
});

P.push({
  id: "B557", judge: "tree-apples-leaf-pairs", topic: "trees", rating: 1200,
  tag: "Subtree counts", timeLimitMs: 2000,
  uz: "Olma daraxti",
  en: "The apple tree",
  statementUz: "n ta uchdan iborat daraxt berilgan, uning ildizi 1-uch. Barg — farzandi yo‘q uch (ildiz barg hisoblanmaydi, chunki n ≥ 2). Daraxtning x va y uchlarida ikkita olma o‘sgan. Olma uzilganda u o‘zi turgan uchning farzandlaridan biriga tushadi, so‘ng yana farzandga, va bargga yetguncha shunday davom etadi; x va y bir xil uch bo‘lishi ham mumkin. Olmalar tushadigan barglar juftligi (a, b) nechta bo‘lishi mumkin — a birinchi olma tushadigan barg, b ikkinchisiniki? q ta so‘rovga javob bering.",
  statementEn: "You are given a tree of n vertices rooted at vertex 1. A leaf is a vertex with no children (the root is not a leaf, since n ≥ 2). Two apples grow at vertices x and y. When an apple falls, it drops to one of the children of its vertex, then to a child of that one, and so on until it reaches a leaf; x and y may be the same vertex. How many pairs of leaves (a, b) are possible, where a is where the first apple ends and b where the second one does? Answer q queries.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir testda: n; n − 1 ta qatorda qirralar; q; q ta qatorda x va y.",
  inputEn: "The first line contains the number of test cases t. Each test case has: n; n − 1 lines with the edges; q; q lines with x and y.",
  outputUz: "Har bir so‘rov uchun alohida qatorda juftliklar sonini chiqaring.",
  outputEn: "For each query print the number of pairs on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ q ≤ 2·10^5, the sum of q over all tests ≤ 2·10^5", "the edges form a tree; the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "2 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ q ≤ 2·10^5, barcha testlar bo‘yicha q lar yig‘indisi ≤ 2·10^5", "qirralar daraxt hosil qiladi; javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["1\n5\n1 2\n1 3\n3 4\n3 5\n3\n2 3\n1 1\n4 5\n"],
  expect: ["2\n9\n1\n"],
  sampleNotesUz: [
    "Barglar 2, 4 va 5. 2-uchdagi olma faqat 2 da qoladi, 3-uchdagisi 4 yoki 5 ga tushadi: 1 · 2 = 2. Ildizdagi ikkala olma uchtadan bargga tushishi mumkin: 3 · 3 = 9. 4 va 5 o‘zi barg: 1.",
  ],
  sampleNotesEn: [
    "The leaves are 2, 4 and 5. An apple at 2 stays there and one at 3 ends at 4 or 5: 1 · 2 = 2. Both apples at the root can end at any of three leaves: 3 · 3 = 9. 4 and 5 are leaves already: 1.",
  ],
  testInputs: ["1\n5\n1 2\n1 3\n3 4\n3 5\n3\n2 3\n1 1\n4 5\n", "1\n3\n1 2\n2 3\n1\n1 1\n", "1\n2\n2 1\n2\n1 2\n2 2\n", "1\n7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n3\n1 2\n2 3\n4 7\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order,par(n+1,0);order.reserve(n);order.push_back(1);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>lv(n+1,0);for(int k=n-1;k>=0;--k){int u=order[k];if(lv[u]==0)lv[u]=1;if(par[u]>0)lv[par[u]]+=lv[u];}
int q;cin>>q;while(q--){int x,y;cin>>x>>y;cout<<lv[x]*lv[y]<<"\\n";}}`,
  wrongNote: "Counting every vertex of the subtree instead of its leaves counts places where an apple cannot stop; calling a vertex of degree one a leaf makes a root with one child a leaf too.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order,par(n+1,0);order.push_back(1);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>sz(n+1,1);for(int k=n-1;k>0;--k){int u=order[k];sz[par[u]]+=sz[u];}
int q;cin>>q;while(q--){int x,y;cin>>x>>y;cout<<sz[x]*sz[y]<<"\\n";}}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>order,par(n+1,0);order.push_back(1);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
vector<long long>lv(n+1,0);for(int k=n-1;k>=0;--k){int u=order[k];if(g[u].size()==1)lv[u]+=1;if(par[u]>0)lv[par[u]]+=lv[u];}
int q;cin>>q;while(q--){int x,y;cin>>x>>y;cout<<lv[x]*lv[y]<<"\\n";}}`,
  ],
  gen: (r) => tests(r, 2, (r) => { const n = r.int(2, 8); let s = n + "\n" + r.tree(n).map((e) => line(e)).join("\n") + "\n"; const q = r.int(1, 4); s += q + "\n"; for (let i = 0; i < q; i++) s += line([r.int(1, n), r.int(1, n)]) + "\n"; return s; }),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>par(n+1,0),order;order.push_back(1);par[1]=-1;for(size_t k=0;k<order.size();++k){int u=order[k];for(int v:g[u])if(v!=par[u]){par[v]=u;order.push_back(v);}}
auto leaves=[&](int x){long long c=0;vector<int>st={x};while(!st.empty()){int u=st.back();st.pop_back();bool kid=false;for(int v:g[u])if(v!=par[u]){kid=true;st.push_back(v);}if(!kid)++c;}return c;};
int q;cin>>q;while(q--){int x,y;cin>>x>>y;cout<<leaves(x)*leaves(y)<<"\\n";}}`],
  big: [
    { seed: 1, note: "a random tree, queries at the root", code: `n, q = 200000, 60000\ne = tree_edges(r, n, "random", True)\nreturn "1\\n" + str(n) + "\\n" + "\\n".join(line(x) for x in e) + "\\n" + str(q) + "\\n" + "\\n".join(line([1, r.int(1, 3)]) for _ in range(q))` },
    { seed: 2, note: "a path: deep, so a recursive walk must not overflow", code: `n, q = 200000, 60000\ne = tree_edges(r, n, "path", True)\nreturn "1\\n" + str(n) + "\\n" + "\\n".join(line(x) for x in e) + "\\n" + str(q) + "\\n" + "\\n".join(line([r.int(1, n), r.int(1, n)]) for _ in range(q))` },
  ],
});

P.push({
  id: "B558", judge: "bs-which-pile-label", topic: "binary-search", rating: 1200,
  tag: "Prefix sums and binary search", timeLimitMs: 1000,
  uz: "Qaysi uyumda",
  en: "Which pile",
  statementUz: "n ta uyum bor, i-uyumda a_i ta chuvalchang. Chuvalchanglarga ketma-ket raqamlar berilgan: birinchi uyumdagilar 1 dan a_1 gacha, ikkinchisidagilar a_1 + 1 dan a_1 + a_2 gacha va hokazo. m ta so‘rovda chuvalchang raqami q_j beriladi; u nechanchi uyumda ekanini toping. Uyumlar 1 dan n gacha raqamlangan.",
  statementEn: "There are n piles, and pile i holds a_i worms. The worms are numbered consecutively: those in the first pile get 1 to a_1, those in the second get a_1 + 1 to a_1 + a_2, and so on. Each of m queries gives a worm's number q_j; find which pile that worm is in. Piles are numbered 1 to n.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi. Uchinchi qatorda m, to‘rtinchi qatorda m ta son q_1, …, q_m.",
  inputEn: "The first line contains n. The second line contains the n numbers a_1, …, a_n. The third line contains m and the fourth the m numbers q_1, …, q_m.",
  outputUz: "Har bir so‘rov uchun alohida qatorda uyum raqamini chiqaring.",
  outputEn: "For each query print the pile's number on its own line.",
  constraintList: ["1 ≤ n, m ≤ 10^5", "1 ≤ a_i ≤ 10^3", "a_1 + … + a_n ≤ 10^6", "1 ≤ q_j ≤ a_1 + … + a_n"],
  constraintListUz: ["1 ≤ n, m ≤ 10^5", "1 ≤ a_i ≤ 10^3", "a_1 + … + a_n ≤ 10^6", "1 ≤ q_j ≤ a_1 + … + a_n"],
  sampleInputs: ["4\n3 1 4 2\n4\n1 4 5 10\n"],
  expect: ["1\n2\n3\n4\n"],
  sampleNotesUz: [
    "Uyumlar 1–3, 4, 5–8 va 9–10 raqamlarini oladi. 4-chuvalchang yolg‘iz o‘zi ikkinchi uyumda, 10-chuvalchang oxirgi uyumda.",
  ],
  sampleNotesEn: [
    "The piles take the numbers 1–3, 4, 5–8 and 9–10. Worm 4 is alone in the second pile and worm 10 is in the last.",
  ],
  testInputs: ["4\n3 1 4 2\n4\n1 4 5 10\n", "1\n1000\n3\n1 500 1000\n", "5\n1 1 1 1 1\n5\n5 4 3 2 1\n", "3\n2 2 2\n6\n1 2 3 4 5 6\n"],
  sol: `int n;cin>>n;vector<long long>p(n);for(int i=0;i<n;++i){cin>>p[i];if(i)p[i]+=p[i-1];}
int m;cin>>m;while(m--){long long q;cin>>q;cout<<(lower_bound(p.begin(),p.end(),q)-p.begin())+1<<"\\n";}`,
  wrongNote: "Searching for the first total strictly greater than the number sends the last worm of a pile to the next pile; searching the totals before each pile shifts every answer by one.",
  wrong: [
    `int n;cin>>n;vector<long long>p(n);for(int i=0;i<n;++i){cin>>p[i];if(i)p[i]+=p[i-1];}
int m;cin>>m;while(m--){long long q;cin>>q;cout<<(upper_bound(p.begin(),p.end(),q)-p.begin())+1<<"\\n";}`,
    `int n;cin>>n;vector<long long>p(n+1,0);for(int i=0;i<n;++i){long long a;cin>>a;p[i+1]=p[i]+a;}
int m;cin>>m;while(m--){long long q;cin>>q;cout<<(lower_bound(p.begin(),p.end(),q)-p.begin())+1<<"\\n";}`,
  ],
  gen: (r) => { const n = r.int(1, 7); const a = r.ints(n, 1, 4); const s = a.reduce((x, y) => x + y, 0); const m = r.int(1, 6); return n + "\n" + line(a) + "\n" + m + "\n" + line(r.ints(m, 1, s)) + "\n"; },
  slow: [`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int m;cin>>m;while(m--){long long q;cin>>q;long long s=0;int i=0;while(s+a[i]<q){s+=a[i];++i;}cout<<i+1<<"\\n";}`],
  big: [
    { seed: 1, note: "worms near the end: a walk over the piles per query is quadratic", code: `n = m = 100000\na = r.ints(n, 1, 10)\ns = sum(a)\nreturn str(n) + "\\n" + line(a) + "\\n" + str(m) + "\\n" + line(r.ints(m, s - 1000, s))` },
    { seed: 2, note: "random", code: `n = m = 100000\na = r.ints(n, 1, 10)\nreturn str(n) + "\\n" + line(a) + "\\n" + str(m) + "\\n" + line(r.ints(m, 1, sum(a)))` },
  ],
});

P.push({
  id: "B559", judge: "sort-lanterns-min-radius", topic: "sorting", rating: 1200,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Ko‘chadagi chiroqlar",
  en: "Lanterns along the street",
  statementUz: "Ko‘cha 0 dan l gacha bo‘lgan kesma. Ko‘chada n ta chiroq bor, i-chiroq a_i nuqtada turibdi; bir nechta chiroq bir nuqtada yoki ko‘cha uchlarida bo‘lishi mumkin. Har bir chiroq o‘zidan d masofagacha bo‘lgan barcha nuqtalarni yoritadi. Butun ko‘cha — 0 dan l gacha har bir nuqta — yoritilishi uchun d ning eng kichik qiymatini toping. 2d har doim butun son bo‘lishini ko‘rsatish mumkin.",
  statementEn: "A street is the segment from 0 to l. There are n lanterns on it, lantern i at point a_i; several lanterns may share a point or stand at the ends of the street. Every lantern lights all points within distance d of itself. Find the smallest d for which the whole street — every point from 0 to l — is lit. It can be shown that 2d is always an integer.",
  inputUz: "Birinchi qatorda n va l beriladi. Ikkinchi qatorda n ta son a_1, …, a_n keladi.",
  inputEn: "The first line contains n and l. The second line contains the n numbers a_1, …, a_n.",
  outputUz: "d ni verguldan keyin aynan bitta raqam bilan, nuqta orqali chiqaring (masalan 2.5 yoki 3.0).",
  outputEn: "Print d with exactly one digit after the decimal point, using a dot (for example 2.5 or 3.0).",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ l ≤ 10^9", "0 ≤ a_i ≤ l", "the lanterns are given in no particular order"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ l ≤ 10^9", "0 ≤ a_i ≤ l", "chiroqlar ixtiyoriy tartibda beriladi"],
  sampleInputs: ["3 10\n2 9 5\n", "2 5\n0 5\n"],
  expect: ["2.0\n", "2.5\n"],
  sampleNotesUz: [
    "Chiroqlar orasidagi eng katta oraliq 5 dan 9 gacha (4), uning o‘rtasi 2 masofada. 0 dan birinchi chiroqqacha ham 2, oxirgi chiroqdan 10 gacha 1. Demak d = 2.",
    "Ikki chiroq ko‘cha uchlarida, ular orasidagi 5 birlikni teng bo‘lib yoritadi: d = 2.5.",
  ],
  sampleNotesEn: [
    "The widest gap between lanterns runs from 5 to 9 (length 4), and its middle is 2 away from both. From 0 to the first lantern is also 2, and from the last lantern to 10 is 1. So d = 2.",
    "The two lanterns stand at the ends and share the 5 units between them: d = 2.5.",
  ],
  testInputs: ["3 10\n2 9 5\n", "2 5\n0 5\n", "1 10\n3\n", "1 1\n0\n", "4 1000000000\n0 0 1000000000 1000000000\n", "5 20\n7 1 15 7 19\n", "3 7\n7 7 7\n"],
  sol: `int n;long long l;cin>>n>>l;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long X=max(2*a[0],2*(l-a[n-1]));for(int i=1;i<n;++i)X=max(X,a[i]-a[i-1]);
cout<<X/2<<"."<<(X%2?5:0)<<"\\n";`,
  wrongNote: "Looking only at the gaps between lanterns leaves the ends of the street dark; halving the distance to an end treats the street as if it went on past it.",
  wrong: [
    `int n;long long l;cin>>n>>l;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long X=0;for(int i=1;i<n;++i)X=max(X,a[i]-a[i-1]);
cout<<X/2<<"."<<(X%2?5:0)<<"\\n";`,
    `int n;long long l;cin>>n>>l;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long X=max(a[0],l-a[n-1]);for(int i=1;i<n;++i)X=max(X,a[i]-a[i-1]);
cout<<X/2<<"."<<(X%2?5:0)<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6), l = r.int(1, 20); return line([n, l]) + "\n" + line(r.ints(n, 0, l)) + "\n"; },
  brute: `int n;long long l;cin>>n>>l;vector<long long>a(n);for(auto&x:a)cin>>x;
for(long long D=0;;++D){bool ok=true;for(long long p=0;p<=2*l&&ok;++p){bool lit=false;for(auto x:a)if(llabs(2*x-p)<=D)lit=true;if(!lit)ok=false;}
 if(ok){cout<<D/2<<"."<<(D%2?5:0)<<"\\n";break;}}`,
  slow: [`int n;long long l;cin>>n>>l;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=0;i<n;++i)for(int j=0;j+1<n-i;++j)if(a[j]>a[j+1])swap(a[j],a[j+1]);
long long X=max(2*a[0],2*(l-a[n-1]));for(int i=1;i<n;++i)X=max(X,a[i]-a[i-1]);
cout<<X/2<<"."<<(X%2?5:0)<<"\\n";`],
  big: [
    { seed: 1, note: "10^5 lanterns in decreasing order", code: `n = 100000\nreturn line([n, 10**9]) + "\\n" + line(sorted(r.ints(n, 0, 10**9), reverse=True))` },
    { seed: 2, note: "random", code: `n = 100000\nreturn line([n, 10**9]) + "\\n" + line(r.ints(n, 0, 10**9))` },
  ],
});

P.push({
  id: "B560", judge: "str-remove-two-adjacent-distinct", topic: "strings", rating: 1200,
  tag: "Strings", timeLimitMs: 1000,
  uz: "Ikki harfni o‘chirish",
  en: "Removing two letters",
  statementUz: "n uzunlikdagi, kichik lotin harflaridan iborat s qatori berilgan. Undan yonma-yon turgan aynan ikkita harfni o‘chirib, n − 2 uzunlikdagi qator hosil qilamiz. O‘chirish uchun n − 1 xil joy bor, lekin ba'zilari bir xil qator berishi mumkin. Shu usulda nechta turli qator hosil qilish mumkin?",
  statementEn: "You are given a string s of n lowercase Latin letters. Deleting exactly two neighbouring letters from it gives a string of length n − 2. There are n − 1 places to make the deletion, but some of them may give the same string. How many different strings can be obtained this way?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida s qatori.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the string s.",
  outputUz: "Har bir test uchun alohida qatorda turli qatorlar sonini chiqaring.",
  outputEn: "For each test case print the number of different strings on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "3 ≤ n ≤ 2·10^5", "the sum of n over all tests ≤ 2·10^5", "s consists of lowercase Latin letters"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "3 ≤ n ≤ 2·10^5", "barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "s kichik lotin harflaridan iborat"],
  sampleInputs: ["3\n6\naaabcc\n3\nabc\n5\nababa\n"],
  expect: ["4\n2\n1\n"],
  sampleNotesUz: [
    "aaabcc dan abcc (ikki xil joydan), aacc, aaac va aaab hosil bo‘ladi — 4 ta. abc dan c va a. ababa dan har qanday o‘chirish aba beradi.",
  ],
  sampleNotesEn: [
    "From aaabcc we get abcc (from two places), aacc, aaac and aaab — 4 strings. From abc we get c and a. From ababa every deletion gives aba.",
  ],
  testInputs: ["3\n6\naaabcc\n3\nabc\n5\nababa\n", "1\n3\naaa\n", "1\n4\nabab\n", "1\n7\nabcdefg\n", "1\n8\naabbaabb\n"],
  sol: `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int c=n-1;for(int i=0;i+2<n;++i)if(s[i]==s[i+2])--c;cout<<c<<"\\n";}`,
  wrongNote: "Comparing each letter with its neighbour instead of the letter two places on misses why two deletions give the same string; assuming every deletion gives a new string counts the same string several times.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;int c=n-1;for(int i=0;i+1<n;++i)if(s[i]==s[i+1])--c;cout<<c<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string s;cin>>n>>s;cout<<n-1<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(3, 9); return n + "\n" + r.str(n, "abc") + "\n"; }),
  slow: [`int t;cin>>t;while(t--){int n;string s;cin>>n>>s;set<string>all;for(int i=0;i+1<n;++i)all.insert(s.substr(0,i)+s.substr(i+2));cout<<all.size()<<"\\n";}`],
  big: [
    { seed: 1, note: "one long string over two letters", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "ab")` },
    { seed: 2, note: "random letters", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + text(r, n, "abcdefghijklmnopqrstuvwxyz")` },
  ],
});

P.push({
  id: "B561", judge: "str-flip-balanced-prefix", topic: "strings", rating: 1200,
  tag: "Prefix logic", timeLimitMs: 1000,
  uz: "Muvozanatli prefiksni teskari qilish",
  en: "Inverting a balanced prefix",
  statementUz: "n uzunlikdagi, 0 va 1 lardan iborat a va b qatorlari berilgan. Bitta amalda a ning shunday prefiksini — boshlang‘ich bo‘lagini — tanlaysizki, unda 0 lar va 1 lar soni teng bo‘lsin, va shu prefiksdagi har bir belgini teskarisiga almashtirasiz: 0 ni 1 ga, 1 ni 0 ga. Amallarni istalgancha bajarish mumkin. a ni b ga aylantirish mumkinmi?",
  statementEn: "You are given two strings a and b of length n made of 0s and 1s. In one operation you choose a prefix of a — a beginning of it — that contains as many 0s as 1s, and invert every character in that prefix: each 0 becomes 1 and each 1 becomes 0. You may make any number of operations. Can a be turned into b?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test uch qatordan iborat: n, a qatori va b qatori.",
  inputEn: "The first line contains the number of test cases t. Each test case takes three lines: n, the string a and the string b.",
  outputUz: "Har bir test uchun alohida qatorda YES yoki NO chiqaring.",
  outputEn: "For each test case print YES or NO on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 3·10^5", "the sum of n over all tests ≤ 3·10^5", "a and b consist of 0 and 1"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 3·10^5", "barcha testlar bo‘yicha n lar yig‘indisi ≤ 3·10^5", "a va b faqat 0 va 1 dan iborat"],
  sampleInputs: ["3\n4\n0110\n1001\n3\n000\n000\n3\n001\n000\n"],
  expect: ["YES\nYES\nNO\n"],
  sampleNotesUz: [
    "Birinchi testda butun qator ikkita 0 va ikkita 1 dan iborat, uni teskari qilsak 1001. Ikkinchi testda qatorlar allaqachon teng. Uchinchi testda oxirgi belgini o‘zgartirish uchun butun qatorni teskari qilish kerak, lekin unda 0 lar 1 lardan ko‘p.",
  ],
  sampleNotesEn: [
    "In the first test the whole string has two 0s and two 1s, and inverting it gives 1001. In the second the strings are equal already. In the third the last character can only change if the whole string is inverted, but it has more 0s than 1s.",
  ],
  testInputs: ["3\n4\n0110\n1001\n3\n000\n000\n3\n001\n000\n", "1\n1\n0\n1\n", "1\n2\n01\n10\n", "1\n6\n010101\n101010\n", "1\n6\n010101\n100101\n", "2\n8\n00110101\n11001010\n8\n01011100\n10101100\n"],
  sol: `int t;cin>>t;while(t--){int n;string a,b;cin>>n>>a>>b;vector<int>bal(n,0);int z=0,o=0;for(int i=0;i<n;++i){(a[i]=='0'?z:o)++;bal[i]=(z==o);}
bool ok=true;int f=0;for(int i=n-1;i>=0;--i){char c=a[i];if(f)c=c=='0'?'1':'0';if(c!=b[i]){if(!bal[i]){ok=false;break;}f^=1;}}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  wrongNote: "Ignoring the balance rule lets any prefix be inverted; comparing a with b without remembering the inversions already made treats each position as untouched.",
  wrong: [
    `int t;cin>>t;while(t--){int n;string a,b;cin>>n>>a>>b;cout<<"YES"<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;string a,b;cin>>n>>a>>b;vector<int>bal(n,0);int z=0,o=0;for(int i=0;i<n;++i){(a[i]=='0'?z:o)++;bal[i]=(z==o);}
bool ok=true;for(int i=n-1;i>=0;--i){if(a[i]!=b[i]&&!bal[i]){ok=false;break;}}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 8); const a = r.str(n, "01"); let b = a.split(""); const k = r.int(0, 2); for (let i = 0; i < k; i++) { const j = r.int(0, n - 1); b[j] = b[j] === "0" ? "1" : "0"; } return n + "\n" + a + "\n" + (r.int(0, 1) ? b.join("") : r.str(n, "01")) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;string a,b;cin>>n>>a>>b;set<string>seen={a};vector<string>q={a};bool ok=false;
for(size_t k=0;k<q.size();++k){string s=q[k];if(s==b){ok=true;break;}int z=0,o=0;for(int i=0;i<n;++i){(s[i]=='0'?z:o)++;if(z==o){string u=s;for(int j=0;j<=i;++j)u[j]=u[j]=='0'?'1':'0';if(seen.insert(u).second)q.push_back(u);}}}
cout<<(ok?"YES":"NO")<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){int n;string a,b;cin>>n>>a>>b;bool ok=true;
for(int i=n-1;i>=0&&ok;--i){if(a[i]==b[i])continue;int z=0,o=0;for(int j=0;j<=i;++j)(a[j]=='0'?z:o)++;if(z!=o){ok=false;break;}for(int j=0;j<=i;++j)a[j]=a[j]=='0'?'1':'0';}
cout<<(ok?"YES":"NO")<<"\\n";}`],
  big: [
    { seed: 1, note: "01 repeated, every other position needs an inversion", code: `n = 300000\na = "01" * (n // 2)\nb = "".join("1" if (i // 2) % 2 == 0 else "0" for i in range(n))\nb = "".join(b[i] if i % 2 == 0 else ("1" if b[i - 1] == "0" else "0") for i in range(n))\nreturn "1\\n" + str(n) + "\\n" + a + "\\n" + b` },
    { seed: 2, note: "the string inverted wholesale, balanced", code: `n = 300000\na = list("01" * (n // 2))\nr.shuffle(a)\na = "".join(a)\nb = "".join("1" if c == "0" else "0" for c in a)\nreturn "1\\n" + str(n) + "\\n" + a + "\\n" + b` },
  ],
});

P.push({
  id: "B562", judge: "greedy-consecutive-doll-sets", topic: "greedy", rating: 1200,
  tag: "Counting", timeLimitMs: 1000,
  uz: "Matryoshka to‘plamlari",
  en: "Sets of nesting dolls",
  statementUz: "Bir nechta matryoshka to‘plamlari aralashib ketdi, va endi n ta qo‘g‘irchoqning faqat o‘lchamlari ma'lum: a_1, …, a_n. Har bir to‘plam ketma-ket butun o‘lchamli qo‘g‘irchoqlardan iborat edi: biror s dan boshlab s, s + 1, …, s + k − 1 o‘lchamlarning har biridan bittadan (k ≥ 1). Qo‘g‘irchoqlarni shunday to‘plamlarga taqsimlash kerak, har bir qo‘g‘irchoq aynan bitta to‘plamga tushsin. To‘plamlar soni eng kami bilan nechta bo‘lishi mumkin?",
  statementEn: "Several sets of nesting dolls got mixed up, and now only the sizes of the n dolls are known: a_1, …, a_n. Every set consisted of dolls of consecutive integer sizes: for some s, one doll of each size s, s + 1, …, s + k − 1 (k ≥ 1). The dolls have to be split into such sets, with every doll in exactly one set. What is the smallest possible number of sets?",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida n ta son a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the n numbers a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda to‘plamlarning eng kam sonini chiqaring.",
  outputEn: "For each test case print the smallest number of sets on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, the sum of n over all tests ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "a set holds one doll of each of its sizes"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5, barcha testlar bo‘yicha n lar yig‘indisi ≤ 2·10^5", "1 ≤ a_i ≤ 10^9", "to‘plamda har bir o‘lchamdan bittadan qo‘g‘irchoq bo‘ladi"],
  sampleInputs: ["3\n6\n2 2 3 4 3 1\n5\n11 8 7 10 9\n6\n1000000000 1000000000 1000000000 1 1 1\n"],
  expect: ["2\n1\n6\n"],
  sampleNotesUz: [
    "Birinchi testda {1, 2, 3, 4} va {2, 3}. Ikkinchi testda bitta to‘plam: 7 dan 11 gacha. Uchinchi testda bir xil o‘lchamli qo‘g‘irchoqlar bir to‘plamga tusha olmaydi: 6 ta.",
  ],
  sampleNotesEn: [
    "In the first test {1, 2, 3, 4} and {2, 3}. In the second one set runs from 7 to 11. In the third dolls of equal size cannot share a set: 6 sets.",
  ],
  testInputs: ["3\n6\n2 2 3 4 3 1\n5\n11 8 7 10 9\n6\n1000000000 1000000000 1000000000 1 1 1\n", "1\n1\n5\n", "1\n7\n1 2 2 3 3 3 4\n", "1\n6\n5 3 1 6 4 2\n", "1\n8\n1 3 5 7 2 4 6 8\n", "1\n5\n4 4 5 5 3\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;map<long long,long long>c;for(int i=0;i<n;++i){long long a;cin>>a;c[a]++;}
long long s=0;for(auto&[v,k]:c){auto it=c.find(v-1);long long prev=it==c.end()?0:it->second;s+=max(0LL,k-prev);}
cout<<s<<"\\n";}`,
  wrongNote: "Counting runs of consecutive sizes ignores that equal dolls need different sets; taking the largest multiplicity forgets that a gap in the sizes starts new sets.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;set<long long>c;for(int i=0;i<n;++i){long long a;cin>>a;c.insert(a);}
long long s=0;for(auto v:c)if(!c.count(v-1))++s;cout<<s<<"\\n";}`,
    `int t;cin>>t;while(t--){int n;cin>>n;map<long long,long long>c;long long m=0;for(int i=0;i<n;++i){long long a;cin>>a;m=max(m,++c[a]);}cout<<m<<"\\n";}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.ints(n, 1, 6)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;multiset<long long>m;for(int i=0;i<n;++i){long long a;cin>>a;m.insert(a);}int s=0;
while(!m.empty()){long long v=*m.begin();while(m.count(v)){m.erase(m.find(v));++v;}++s;}cout<<s<<"\\n";}`,
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());vector<char>used(n,0);int s=0,left=n;
while(left){int i=0;while(used[i])++i;long long v=a[i];for(int j=i;j<n;++j)if(!used[j]&&a[j]==v){used[j]=1;--left;++v;}++s;}
cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "every doll the same size: one set per doll", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line([7] * n)` },
    { seed: 2, note: "random sizes in a narrow range", code: `n = 200000\nreturn "1\\n" + str(n) + "\\n" + line(r.ints(n, 1, 1000))` },
  ],
});

P.push({
  id: "B563", judge: "tree-max-root-depths", topic: "trees", rating: 1200,
  tag: "Recursion", timeLimitMs: 1000,
  uz: "Eng kattasi ildizda",
  en: "The largest at the root",
  statementUz: "1 dan n gacha sonlarning almashtirishi a berilgan. Undan daraxt quriladi: massivning eng katta elementi ildiz bo‘ladi; undan chapdagi elementlar xuddi shu qoida bilan chap qism daraxtni, o‘ngdagilari esa o‘ng qism daraxtni hosil qiladi; bo‘sh qism massivdan hech narsa qurilmaydi. Uchning chuqurligi — ildizdan unga boradigan yo‘ldagi qirralar soni. Har bir a_i uchun uning chuqurligini massivdagi tartibda chiqaring.",
  statementEn: "You are given a permutation a of the numbers 1 to n. A tree is built from it: the largest element of the array becomes the root; the elements to its left form the left subtree by the same rule, and the elements to its right form the right subtree; an empty part builds nothing. The depth of a vertex is the number of edges on the path from the root to it. For every a_i print its depth, in the order of the array.",
  inputUz: "Birinchi qatorda testlar soni t beriladi. Har bir test ikki qatordan iborat: birinchisida n, ikkinchisida almashtirish a_1, …, a_n.",
  inputEn: "The first line contains the number of test cases t. Each test case takes two lines: the first holds n, the second the permutation a_1, …, a_n.",
  outputUz: "Har bir test uchun alohida qatorda probel bilan ajratilgan n ta chuqurlikni chiqaring.",
  outputEn: "For each test case print the n depths separated by spaces, on one line.",
  constraintList: ["1 ≤ t ≤ 100", "1 ≤ n ≤ 100", "a is a permutation of 1 to n", "the root has depth 0"],
  constraintListUz: ["1 ≤ t ≤ 100", "1 ≤ n ≤ 100", "a — 1 dan n gacha sonlarning almashtirishi", "ildizning chuqurligi 0"],
  sampleInputs: ["3\n5\n3 5 2 1 4\n1\n1\n4\n4 3 1 2\n"],
  expect: ["1 0 2 3 1\n0\n0 1 3 2\n"],
  sampleNotesUz: [
    "Birinchi testda 5 ildiz; chapda faqat 3 (chuqurlik 1); o‘ngda 2 1 4 dan 4 ildiz (chuqurlik 1), uning chapida 2 1 dan 2 (chuqurlik 2), so‘ng 1 (chuqurlik 3). Uchinchi testda 4 → 3 → 2 → 1 zanjir, lekin 1 massivda 2 dan oldin turadi.",
  ],
  sampleNotesEn: [
    "In the first test 5 is the root; to its left only 3 (depth 1); to its right 2 1 4 has root 4 (depth 1), whose left part 2 1 has root 2 (depth 2) and then 1 (depth 3). In the third test the chain is 4 → 3 → 2 → 1, though 1 stands before 2 in the array.",
  ],
  testInputs: ["3\n5\n3 5 2 1 4\n1\n1\n4\n4 3 1 2\n", "1\n6\n1 2 3 4 5 6\n", "1\n6\n6 5 4 3 2 1\n", "1\n7\n2 6 1 7 3 5 4\n"],
  sol: `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n),d(n);for(auto&x:a)cin>>x;
function<void(int,int,int)>go=[&](int l,int r,int dep){if(l>r)return;int m=l;for(int i=l;i<=r;++i)if(a[i]>a[m])m=i;d[m]=dep;go(l,m-1,dep+1);go(m+1,r,dep+1);};
go(0,n-1,0);for(int i=0;i<n;++i)cout<<d[i]<<(i+1<n?' ':'\\n');}`,
  wrongNote: "Building the tree around the smallest element instead of the largest gives a different tree; numbering depths from 1 puts every vertex one level too deep.",
  wrong: [
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n),d(n);for(auto&x:a)cin>>x;
function<void(int,int,int)>go=[&](int l,int r,int dep){if(l>r)return;int m=l;for(int i=l;i<=r;++i)if(a[i]<a[m])m=i;d[m]=dep;go(l,m-1,dep+1);go(m+1,r,dep+1);};
go(0,n-1,0);for(int i=0;i<n;++i)cout<<d[i]<<(i+1<n?' ':'\\n');}`,
    `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n),d(n);for(auto&x:a)cin>>x;
function<void(int,int,int)>go=[&](int l,int r,int dep){if(l>r)return;int m=l;for(int i=l;i<=r;++i)if(a[i]>a[m])m=i;d[m]=dep;go(l,m-1,dep+1);go(m+1,r,dep+1);};
go(0,n-1,1);for(int i=0;i<n;++i)cout<<d[i]<<(i+1<n?' ':'\\n');}`,
  ],
  gen: (r) => tests(r, 3, (r) => { const n = r.int(1, 9); return n + "\n" + line(r.perm(n)) + "\n"; }),
  brute: `int t;cin>>t;while(t--){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
for(int i=0;i<n;++i){int d=0;for(int j=0;j<n;++j){if(j==i)continue;int l=min(i,j),r=max(i,j),m=0;for(int k=l;k<=r;++k)m=max(m,a[k]);if(m==a[j])++d;}cout<<d<<(i+1<n?' ':'\\n');}}`,
});

P.push({
  id: "B564", judge: "math-sum-of-digit-sums", topic: "math", rating: 1200,
  tag: "Precomputation", timeLimitMs: 1000,
  uz: "Raqamlar yig‘indilari yig‘indisi",
  en: "The sum of the digit sums",
  statementUz: "Doskaga 1 dan n gacha bo‘lgan barcha butun sonlar yozilgan. Keyin har bir son uning raqamlari yig‘indisi bilan almashtirildi: masalan, 12 o‘rniga 1 + 2 = 3 yozildi. Doskadagi sonlar yig‘indisi qancha bo‘ladi? So‘rovlar soni ko‘p, va har bir so‘rov uchun javob alohida beriladi.",
  statementEn: "All the integers from 1 to n are written on a board. Then each of them is replaced by the sum of its digits: for example, 12 is replaced by 1 + 2 = 3. What is the sum of the numbers on the board now? There are many queries, and each one is answered separately.",
  inputUz: "Birinchi qatorda so‘rovlar soni t beriladi. Keyingi t ta qatorning har birida bitta n soni keladi.",
  inputEn: "The first line contains the number of queries t. Each of the next t lines contains one number n.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print the answer on its own line.",
  constraintList: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5", "every query starts again from the full range 1 to n", "the answer fits in a 64-bit integer"],
  constraintListUz: ["1 ≤ t ≤ 10^4", "1 ≤ n ≤ 2·10^5", "har bir so‘rov 1 dan n gacha butun oraliq uchun", "javob 64 bitli butun songa sig‘adi"],
  sampleInputs: ["3\n12\n1\n100\n"],
  expect: ["51\n1\n901\n"],
  sampleNotesUz: [
    "1 dan 9 gacha yig‘indi 45, keyin 10, 11, 12 dan 1, 2 va 3: jami 51. 1 dan 99 gacha har bir raqam o‘nliklarda ham, birliklarda ham 10 martadan uchraydi — 900, va 100 yana 1 qo‘shadi.",
  ],
  sampleNotesEn: [
    "1 to 9 sum to 45, and 10, 11, 12 add 1, 2 and 3: 51 in all. From 1 to 99 every digit appears 10 times among the tens and 10 times among the units — 900 — and 100 adds 1 more.",
  ],
  testInputs: ["3\n12\n1\n100\n", "1\n200000\n", "5\n9\n10\n19\n99999\n199999\n", "3\n1000\n54321\n123456\n"],
  sol: `static long long p[200001];for(int x=1;x<=200000;++x){int s=0,y=x;while(y){s+=y%10;y/=10;}p[x]=p[x-1]+s;}
int t;cin>>t;while(t--){int n;cin>>n;cout<<p[n]<<"\\n";}`,
  wrongNote: "Stopping the prefix one short leaves n itself out; replacing each number by its digital root shrinks the sums of numbers like 99.",
  wrong: [
    `static long long p[200001];for(int x=1;x<=200000;++x){int s=0,y=x;while(y){s+=y%10;y/=10;}p[x]=p[x-1]+s;}
int t;cin>>t;while(t--){int n;cin>>n;cout<<p[n-1]<<"\\n";}`,
    `static long long p[200001];for(int x=1;x<=200000;++x){p[x]=p[x-1]+1+(x-1)%9;}
int t;cin>>t;while(t--){int n;cin>>n;cout<<p[n]<<"\\n";}`,
  ],
  gen: (r) => tests(r, 6, (r) => r.int(1, 2000) + "\n"),
  slow: [`int t;cin>>t;while(t--){int n;cin>>n;long long s=0;for(int x=1;x<=n;++x){int y=x;while(y){s+=y%10;y/=10;}}cout<<s<<"\\n";}`],
  big: [
    { seed: 1, note: "10^4 queries near the top: summing each from scratch is too slow", code: `return "10000\\n" + "\\n".join(str(r.int(190000, 200000)) for _ in range(10000))` },
  ],
});

export default P;
