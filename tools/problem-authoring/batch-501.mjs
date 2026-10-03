/* Batch 501 — ten problems, A501–C510, the first past 500.
 *
 * Weighted toward the topics the bank was thinnest in: geometry, sorting,
 * binary search, backtracking, two pointers and trees, with a condensation
 * problem on top.
 *
 * Every statement is written for AlgoYo'l.
 */

const P = [];

/* ------------------------------------------------------------------- 800 */
P.push({
  id: "A501", judge: "array-count-above-average", topic: "programming-basics", rating: 800,
  tag: "Arrays", timeLimitMs: 1000,
  uz: "O‘rtachadan yuqori",
  en: "Above the average",
  statementUz: "Sizga n ta butun sondan iborat massiv berilgan. Massivning o‘rta arifmetigi — barcha elementlar yig‘indisini n ga bo‘lgandagi qiymat. Bu qiymat butun bo‘lishi shart emas, masalan 1 va 2 ning o‘rtachasi 1.5 ga teng. Massivda o‘rta arifmetikdan qat'iy katta bo‘lgan elementlar nechta ekanini toping. O‘rtachaga teng element hisobga olinmaydi.",
  statementEn: "You are given an array of n integers. The arithmetic mean of the array is the sum of all its elements divided by n. It need not be a whole number: the mean of 1 and 2 is 1.5, for example. Find how many elements of the array are strictly greater than this mean. An element equal to the mean is not counted.",
  inputUz: "Birinchi qatorda bitta n butun soni beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains one integer n. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — o‘rta arifmetikdan qat'iy katta elementlar soni.",
  outputEn: "Print a single integer — the number of elements strictly greater than the arithmetic mean.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "the mean is compared exactly, not rounded", "an element equal to the mean is not counted"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "o‘rtacha aniq solishtiriladi, yaxlitlanmaydi", "o‘rtachaga teng element sanalmaydi"],
  sampleInputs: ["5\n1 2 3 4 10\n", "4\n3 1 4 2\n"],
  expect: ["1\n", "2\n"],
  sampleNotesUz: [
    "Yig‘indi 20, o‘rtacha 20 / 5 = 4. Undan faqat 10 katta. 4 ning o‘zi o‘rtachaga teng, shuning uchun sanalmaydi.",
    "Yig‘indi 10, o‘rtacha 2.5. Undan 3 va 4 katta, javob 2.",
  ],
  sampleNotesEn: [
    "The sum is 20, so the mean is 20 / 5 = 4. Only 10 is above it; the 4 itself equals the mean and is not counted.",
    "The sum is 10 and the mean is 2.5. Both 3 and 4 are above it, so the answer is 2.",
  ],
  testInputs: ["5\n1 2 3 4 10\n", "4\n3 1 4 2\n", "1\n7\n", "3\n5 5 5\n", "2\n-1 -2\n", "3\n-5 -4 -6\n", "4\n1000000000 -1000000000 1000000000 -1000000000\n", "5\n0 0 0 0 1\n"],
  sol: `int n;cin>>n;vector<long long>a(n);long long s=0;for(auto&x:a){cin>>x;s+=x;}
long long c=0;for(auto x:a)if(x*n>s)++c;
cout<<c<<"\\n";`,
  wrongNote: "Dividing the sum by n in integers truncates toward zero, which moves the mean of a negative array upward; counting elements equal to the mean breaks the strict comparison.",
  wrong: [
    `int n;cin>>n;vector<long long>a(n);long long s=0;for(auto&x:a){cin>>x;s+=x;}
long long m=s/n,c=0;for(auto x:a)if(x>m)++c;
cout<<c<<"\\n";`,
    `int n;cin>>n;vector<long long>a(n);long long s=0;for(auto&x:a){cin>>x;s+=x;}
long long c=0;for(auto x:a)if(x*n>=s)++c;
cout<<c<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A502", judge: "matrix-max-line-sum", topic: "foundations", rating: 1000,
  tag: "Matrices", timeLimitMs: 1000,
  uz: "Eng og‘ir qator yoki ustun",
  en: "The heaviest row or column",
  statementUz: "Sizga n ta qator va m ta ustundan iborat butun sonli jadval berilgan. Har bir qatordagi sonlar yig‘indisini va har bir ustundagi sonlar yig‘indisini hisoblang — jami n + m ta yig‘indi hosil bo‘ladi. Shu yig‘indilarning eng kattasini chiqaring. Jadvalda manfiy sonlar ham bo‘lishi mumkin, shuning uchun eng katta yig‘indi ham manfiy bo‘lishi mumkin.",
  statementEn: "You are given a table of integers with n rows and m columns. Compute the sum of every row and the sum of every column — n + m sums in all — and print the largest of them. The table may hold negative numbers, so the largest of these sums may itself be negative.",
  inputUz: "Birinchi qatorda n va m beriladi. Keyingi n ta qatorning har birida probel bilan ajratilgan m ta butun son keladi.",
  inputEn: "The first line contains n and m. Each of the next n lines contains m integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — qator va ustun yig‘indilarining eng kattasi.",
  outputEn: "Print a single integer — the largest of all row sums and column sums.",
  constraintList: ["1 ≤ n, m ≤ 500", "−10^6 ≤ a_ij ≤ 10^6", "rows and columns are both considered", "the answer may be negative"],
  constraintListUz: ["1 ≤ n, m ≤ 500", "−10^6 ≤ a_ij ≤ 10^6", "qatorlar ham, ustunlar ham hisobga olinadi", "javob manfiy bo‘lishi mumkin"],
  sampleInputs: ["2 3\n1 2 3\n4 5 6\n", "3 2\n1 9\n1 9\n1 9\n"],
  expect: ["15\n", "27\n"],
  sampleNotesUz: [
    "Qator yig‘indilari 6 va 15, ustunlarniki 5, 7 va 9. Eng kattasi 15.",
    "Qatorlar 10 dan, ustunlar esa 3 va 27. Eng kattasi ikkinchi ustun — 27.",
  ],
  sampleNotesEn: [
    "The row sums are 6 and 15, the column sums 5, 7 and 9. The largest is 15.",
    "Each row sums to 10, while the columns sum to 3 and 27. The second column wins with 27.",
  ],
  testInputs: ["2 3\n1 2 3\n4 5 6\n", "3 2\n1 9\n1 9\n1 9\n", "1 1\n-5\n", "2 2\n-1 -2\n-3 -4\n", "1 4\n1 1 1 1\n", "4 1\n2\n2\n2\n2\n", "3 3\n0 0 0\n0 0 0\n0 0 7\n"],
  sol: `int n,m;cin>>n>>m;vector<long long>r(n,0),c(m,0);
for(int i=0;i<n;++i)for(int j=0;j<m;++j){long long x;cin>>x;r[i]+=x;c[j]+=x;}
long long best=r[0];for(auto x:r)best=max(best,x);for(auto x:c)best=max(best,x);
cout<<best<<"\\n";`,
  wrongNote: "Looking only at the rows misses a heavier column; starting the running maximum at zero answers 0 for a table whose every sum is negative.",
  wrong: [
    `int n,m;cin>>n>>m;vector<long long>r(n,0);
for(int i=0;i<n;++i)for(int j=0;j<m;++j){long long x;cin>>x;r[i]+=x;}
long long best=r[0];for(auto x:r)best=max(best,x);
cout<<best<<"\\n";`,
    `int n,m;cin>>n>>m;vector<long long>r(n,0),c(m,0);
for(int i=0;i<n;++i)for(int j=0;j<m;++j){long long x;cin>>x;r[i]+=x;c[j]+=x;}
long long best=0;for(auto x:r)best=max(best,x);for(auto x:c)best=max(best,x);
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1000 */
P.push({
  id: "A503", judge: "geo-quadrant-counts", topic: "geometry", rating: 1000,
  tag: "Coordinates", timeLimitMs: 1000,
  uz: "To‘rt chorak",
  en: "The four quadrants",
  statementUz: "Tekislikda n ta nuqta berilgan. Koordinata o‘qlari tekislikni to‘rt chorakka bo‘ladi: I chorakda x > 0 va y > 0, II chorakda x < 0 va y > 0, III chorakda x < 0 va y < 0, IV chorakda x > 0 va y < 0. Har bir chorakka nechta nuqta tushishini sanang. O‘qlardan birida yotgan nuqta (x = 0 yoki y = 0) hech qaysi chorakka tegishli emas.",
  statementEn: "There are n points on the plane. The coordinate axes split the plane into four quadrants: quadrant I has x > 0 and y > 0, quadrant II has x < 0 and y > 0, quadrant III has x < 0 and y < 0, and quadrant IV has x > 0 and y < 0. Count how many points fall into each quadrant. A point lying on either axis (x = 0 or y = 0) belongs to no quadrant.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida bitta nuqtaning x va y koordinatalari keladi.",
  inputEn: "The first line contains n. Each of the next n lines contains the coordinates x and y of one point.",
  outputUz: "Bitta qatorda probel bilan ajratilgan to‘rtta sonni chiqaring — I, II, III va IV choraklardagi nuqtalar soni, shu tartibda.",
  outputEn: "Print four integers on one line separated by spaces — the number of points in quadrants I, II, III and IV, in that order.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ x, y ≤ 10^9", "points may repeat", "a point on an axis is counted nowhere"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ x, y ≤ 10^9", "nuqtalar takrorlanishi mumkin", "o‘qda yotgan nuqta hech qayerda sanalmaydi"],
  sampleInputs: ["5\n1 2\n-3 4\n-1 -1\n2 -5\n0 3\n", "3\n1 1\n2 2\n0 0\n"],
  expect: ["1 1 1 1\n", "2 0 0 0\n"],
  sampleNotesUz: [
    "Birinchi to‘rt nuqta mos ravishda I, II, III va IV choraklarda. (0, 3) esa y o‘qida yotadi va sanalmaydi.",
    "Ikki nuqta I chorakda, koordinata boshi esa ikkala o‘qda ham yotadi.",
  ],
  sampleNotesEn: [
    "The first four points sit in quadrants I, II, III and IV in turn. The point (0, 3) lies on the y-axis and is not counted.",
    "Two points are in quadrant I, and the origin lies on both axes.",
  ],
  testInputs: ["5\n1 2\n-3 4\n-1 -1\n2 -5\n0 3\n", "3\n1 1\n2 2\n0 0\n", "1\n0 0\n", "4\n5 0\n0 -5\n-5 0\n0 5\n", "4\n-1 2\n-2 1\n3 -3\n4 -1\n", "3\n1000000000 -1000000000\n-1000000000 -1000000000\n-7 -7\n"],
  sol: `int n;cin>>n;long long q[4]={0,0,0,0};
for(int i=0;i<n;++i){long long x,y;cin>>x>>y;
 if(x>0&&y>0)++q[0];else if(x<0&&y>0)++q[1];else if(x<0&&y<0)++q[2];else if(x>0&&y<0)++q[3];}
cout<<q[0]<<" "<<q[1]<<" "<<q[2]<<" "<<q[3]<<"\\n";`,
  wrongNote: "Treating zero as positive drops the points on the axes into quadrants they do not belong to; numbering the quadrants clockwise swaps II and IV.",
  wrong: [
    `int n;cin>>n;long long q[4]={0,0,0,0};
for(int i=0;i<n;++i){long long x,y;cin>>x>>y;
 if(x>=0&&y>=0)++q[0];else if(x<0&&y>=0)++q[1];else if(x<0&&y<0)++q[2];else ++q[3];}
cout<<q[0]<<" "<<q[1]<<" "<<q[2]<<" "<<q[3]<<"\\n";`,
    `int n;cin>>n;long long q[4]={0,0,0,0};
for(int i=0;i<n;++i){long long x,y;cin>>x>>y;
 if(x>0&&y>0)++q[0];else if(x>0&&y<0)++q[1];else if(x<0&&y<0)++q[2];else if(x<0&&y>0)++q[3];}
cout<<q[0]<<" "<<q[1]<<" "<<q[2]<<" "<<q[3]<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1200 */
P.push({
  id: "B504", judge: "sort-min-total-waiting", topic: "sorting", rating: 1200,
  tag: "Sorting", timeLimitMs: 1000,
  uz: "Navbatda kutish",
  en: "Waiting in line",
  statementUz: "Bitta kassaga n ta mijoz keldi, i-mijozga xizmat ko‘rsatish t_i daqiqa davom etadi. Kassir mijozlarga birin-ketin, istalgan tartibda xizmat qiladi va bir mijozni tugatgach darhol keyingisiga o‘tadi. Mijozning kutish vaqti — undan oldin xizmat qilingan barcha mijozlarning xizmat vaqtlari yig‘indisi; birinchi mijoz umuman kutmaydi. Barcha mijozlar kutish vaqtlarining yig‘indisi eng kami bilan qancha bo‘lishi mumkin?",
  statementEn: "n customers arrive at a single till, and serving customer i takes t_i minutes. The cashier serves them one after another in any order, moving to the next the moment one is finished. A customer's waiting time is the total service time of everybody served before them; the first customer does not wait at all. What is the smallest possible sum of all customers' waiting times?",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta t_i soni keladi.",
  inputEn: "The first line contains n. The second line contains the n values t_i separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — kutish vaqtlari yig‘indisining eng kichik qiymati.",
  outputEn: "Print a single integer — the smallest possible total waiting time.",
  constraintList: ["1 ≤ n ≤ 10^5", "1 ≤ t_i ≤ 10^6", "a customer's own service time is not part of their wait", "the answer fits in a 64-bit integer"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "1 ≤ t_i ≤ 10^6", "mijozning o‘z xizmat vaqti kutishga kirmaydi", "javob 64 bitli butun songa sig‘adi"],
  sampleInputs: ["3\n3 1 2\n", "1\n5\n"],
  expect: ["4\n", "0\n"],
  sampleNotesUz: [
    "Tartib 1, 2, 3 bo‘lsa, kutishlar 0, 1 va 1 + 2 = 3 bo‘ladi, jami 4. Boshqa hech qaysi tartib bundan kam bermaydi.",
    "Yolg‘iz mijoz kutmaydi.",
  ],
  sampleNotesEn: [
    "In the order 1, 2, 3 the waits are 0, 1 and 1 + 2 = 3, a total of 4. No other order does better.",
    "A lone customer never waits.",
  ],
  testInputs: ["3\n3 1 2\n", "1\n5\n", "2\n10 1\n", "4\n4 4 4 4\n", "5\n5 4 3 2 1\n", "6\n1000000 1 1000000 1 1000000 1\n"],
  sol: `int n;cin>>n;vector<long long>t(n);for(auto&x:t)cin>>x;
sort(t.begin(),t.end());
long long before=0,total=0;for(auto x:t){total+=before;before+=x;}
cout<<total<<"\\n";`,
  wrongNote: "Serving in the given order ignores that the order is ours to choose; adding each customer's own service time sums completion times rather than waits.",
  wrong: [
    `int n;cin>>n;vector<long long>t(n);for(auto&x:t)cin>>x;
long long before=0,total=0;for(auto x:t){total+=before;before+=x;}
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<long long>t(n);for(auto&x:t)cin>>x;
sort(t.begin(),t.end());
long long before=0,total=0;for(auto x:t){before+=x;total+=before;}
cout<<total<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1300 */
P.push({
  id: "B505", judge: "bs-count-in-range-queries", topic: "binary-search", rating: 1300,
  tag: "Binary search", timeLimitMs: 1000,
  uz: "Oraliqqa tushadiganlar",
  en: "How many fall in the range",
  statementUz: "Sizga n ta butun sondan iborat massiv va q ta so‘rov berilgan. Har bir so‘rov ikki son l va r dan iborat (l ≤ r). So‘rovga javob — massivda l ≤ a_i ≤ r shartini qanoatlantiradigan elementlar soni, ya'ni qiymati shu oraliqqa chegaralari bilan birga tushadigan elementlar. Massiv tartiblanmagan holda beriladi va so‘rovlar orasida o‘zgarmaydi.",
  statementEn: "You are given an array of n integers and q queries. Each query consists of two numbers l and r with l ≤ r, and its answer is the number of array elements satisfying l ≤ a_i ≤ r — the elements whose value lies in that range, both ends included. The array is given unsorted and does not change between queries.",
  inputUz: "Birinchi qatorda n va q beriladi. Ikkinchi qatorda n ta butun son keladi. Keyingi q ta qatorning har birida bitta so‘rovning l va r sonlari beriladi.",
  inputEn: "The first line contains n and q. The second line contains the n integers. Each of the next q lines contains the numbers l and r of one query.",
  outputUz: "Har bir so‘rov uchun alohida qatorda javobni chiqaring.",
  outputEn: "For each query print its answer on its own line.",
  constraintList: ["1 ≤ n, q ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "−10^9 ≤ l ≤ r ≤ 10^9", "both ends of the range are included"],
  constraintListUz: ["1 ≤ n, q ≤ 10^5", "−10^9 ≤ a_i ≤ 10^9", "−10^9 ≤ l ≤ r ≤ 10^9", "oraliqning ikkala chegarasi ham kiradi"],
  sampleInputs: ["5 3\n5 1 3 3 9\n1 3\n4 8\n3 3\n"],
  expect: ["3\n1\n2\n"],
  sampleNotesUz: [
    "[1, 3] oraliqqa 1, 3 va 3 tushadi. [4, 8] ga faqat 5 tushadi. [3, 3] ga ikkala 3 tushadi — chegaralar ham hisobga olinadi.",
  ],
  sampleNotesEn: [
    "The range [1, 3] holds 1, 3 and 3. The range [4, 8] holds only 5. The range [3, 3] holds both 3s, because the ends are included.",
  ],
  testInputs: ["5 3\n5 1 3 3 9\n1 3\n4 8\n3 3\n", "1 2\n7\n7 7\n8 9\n", "6 3\n9 8 7 6 5 4\n4 9\n5 5\n10 20\n", "4 2\n-5 -5 0 5\n-5 -5\n-10 10\n", "3 1\n2 2 2\n1 1\n"],
  sol: `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
while(q--){long long l,r;cin>>l>>r;
 cout<<(upper_bound(a.begin(),a.end(),r)-lower_bound(a.begin(),a.end(),l))<<"\\n";}`,
  wrongNote: "Ending the count at lower_bound of r leaves out the elements equal to r; searching an array that was never sorted gives positions that mean nothing.",
  wrong: [
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
while(q--){long long l,r;cin>>l>>r;
 cout<<(lower_bound(a.begin(),a.end(),r)-lower_bound(a.begin(),a.end(),l))<<"\\n";}`,
    `int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;
while(q--){long long l,r;cin>>l>>r;
 cout<<(upper_bound(a.begin(),a.end(),r)-lower_bound(a.begin(),a.end(),l))<<"\\n";}`,
  ],
});

/* ------------------------------------------------------------------ 1500 */
P.push({
  id: "B506", judge: "tree-deepest-level-sum", topic: "trees", rating: 1500,
  tag: "Tree traversal", timeLimitMs: 1000,
  uz: "Eng chuqur qavat yig‘indisi",
  en: "The sum of the deepest level",
  statementUz: "n ta uchdan iborat daraxt berilgan, uchlar 1 dan n gacha raqamlangan va daraxtning ildizi 1-uch. Har bir uchda butun son yozilgan. Uchning chuqurligi — ildizdan unga boradigan yo‘ldagi qirralar soni, ildizning chuqurligi 0. Daraxtdagi eng katta chuqurlikka ega bo‘lgan barcha uchlardagi sonlar yig‘indisini toping. Qirralar yo‘nalishsiz va istalgan tartibda beriladi.",
  statementEn: "You are given a tree with n vertices numbered 1 to n, rooted at vertex 1, with an integer written on every vertex. The depth of a vertex is the number of edges on the path from the root to it, so the root has depth 0. Find the sum of the numbers on all vertices whose depth is the greatest in the tree. Edges are undirected and listed in any order.",
  inputUz: "Birinchi qatorda n beriladi. Ikkinchi qatorda n ta son — 1-uchdan n-uchgacha yozilgan qiymatlar keladi. Keyingi n − 1 ta qatorning har birida bitta qirraning uchlari u va v beriladi.",
  inputEn: "The first line contains n. The second line contains n numbers — the values on vertices 1 to n. Each of the next n − 1 lines contains the endpoints u and v of one edge.",
  outputUz: "Yagona butun sonni chiqaring — eng chuqur qavatdagi uchlar qiymatlarining yig‘indisi.",
  outputEn: "Print a single integer — the sum of the values on the deepest level.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ value ≤ 10^9", "the edges form a tree", "an edge may be given as u v or as v u"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "−10^9 ≤ qiymat ≤ 10^9", "qirralar daraxt hosil qiladi", "qirra u v yoki v u ko‘rinishida berilishi mumkin"],
  sampleInputs: ["5\n1 2 3 4 5\n1 2\n1 3\n2 4\n2 5\n", "1\n-7\n"],
  expect: ["9\n", "-7\n"],
  sampleNotesUz: [
    "4 va 5 uchlari 2 chuqurlikda turibdi, bundan chuqur uch yo‘q. Javob 4 + 5 = 9. 3-uch ham barg, lekin u faqat 1 chuqurlikda.",
    "Daraxtda faqat ildiz bor, u eng chuqur qavat ham.",
  ],
  sampleNotesEn: [
    "Vertices 4 and 5 sit at depth 2 and nothing is deeper, so the answer is 4 + 5 = 9. Vertex 3 is a leaf too, but only at depth 1.",
    "The tree is just the root, which is also its deepest level.",
  ],
  testInputs: ["5\n1 2 3 4 5\n1 2\n1 3\n2 4\n2 5\n", "1\n-7\n", "4\n1 1 1 10\n1 2\n2 3\n1 4\n", "4\n5 6 7 8\n2 1\n3 2\n4 3\n", "3\n0 -1000000000 -1000000000\n1 2\n3 1\n", "6\n1 1 1 1 1 1\n1 2\n1 3\n1 4\n1 5\n1 6\n"],
  sol: `int n;cin>>n;vector<long long>val(n+1);for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<int>d(n+1,-1);d[1]=0;queue<int>bfs;bfs.push(1);int deep=0;
while(!bfs.empty()){int u=bfs.front();bfs.pop();deep=max(deep,d[u]);for(int v:g[u])if(d[v]<0){d[v]=d[u]+1;bfs.push(v);}}
long long s=0;for(int i=1;i<=n;++i)if(d[i]==deep)s+=val[i];
cout<<s<<"\\n";`,
  wrongNote: "Summing every leaf counts shallow leaves too; reading each edge as parent then child loses the vertices whose edge was written the other way round.",
  wrong: [
    `int n;cin>>n;vector<long long>val(n+1);for(int i=1;i<=n;++i)cin>>val[i];
vector<int>deg(n+1,0);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;++deg[u];++deg[v];}
long long s=0;if(n==1)s=val[1];else for(int i=2;i<=n;++i)if(deg[i]==1)s+=val[i];
cout<<s<<"\\n";`,
    `int n;cin>>n;vector<long long>val(n+1);for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int u,v;cin>>u>>v;g[u].push_back(v);}
vector<int>d(n+1,-1);d[1]=0;queue<int>bfs;bfs.push(1);int deep=0;
while(!bfs.empty()){int u=bfs.front();bfs.pop();deep=max(deep,d[u]);for(int v:g[u])if(d[v]<0){d[v]=d[u]+1;bfs.push(v);}}
long long s=0;for(int i=1;i<=n;++i)if(d[i]==deep)s+=val[i];
cout<<s<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1600 */
P.push({
  id: "B507", judge: "bt-split-digits-bounded", topic: "backtracking", rating: 1600,
  tag: "Backtracking", timeLimitMs: 1000,
  uz: "Raqamlarni bo‘laklash",
  en: "Cutting a string of digits",
  statementUz: "Sizga raqamlardan iborat s satri va K soni berilgan. s ni bir yoki bir nechta ketma-ket bo‘laklarga ajratish kerak, bunda har bir bo‘lak son sifatida K dan oshmasligi va boshida ortiqcha nol bo‘lmasligi shart. Faqat bitta 0 raqamidan iborat bo‘lak ruxsat etiladi, lekin \"05\" yoki \"00\" kabi bo‘laklar ruxsat etilmaydi. Bunday ajratishlar sonini toping; hech bir bo‘lakni kesmaslik — s ni bir butun bo‘lak qilib olish ham bitta usul hisoblanadi.",
  statementEn: "You are given a string s of digits and a number K. Split s into one or more consecutive pieces so that every piece, read as a number, is at most K and has no leading zero. A piece consisting of the single digit 0 is allowed, but pieces such as \"05\" or \"00\" are not. Count the ways to split s; keeping s whole as one piece counts as a way too.",
  inputUz: "Yagona qatorda s satri va K soni probel bilan ajratilgan holda beriladi.",
  inputEn: "A single line contains the string s and the number K, separated by a space.",
  outputUz: "Yagona butun sonni chiqaring — to‘g‘ri ajratishlar soni.",
  outputEn: "Print a single integer — the number of valid splits.",
  constraintList: ["1 ≤ |s| ≤ 15", "s consists of the digits 0–9", "0 ≤ K ≤ 10^15", "a piece of more than one digit may not start with 0"],
  constraintListUz: ["1 ≤ |s| ≤ 15", "s 0–9 raqamlaridan iborat", "0 ≤ K ≤ 10^15", "bir nechta raqamli bo‘lak 0 bilan boshlana olmaydi"],
  sampleInputs: ["123 23\n", "105 10\n"],
  expect: ["3\n", "2\n"],
  sampleNotesUz: [
    "1|2|3, 12|3 va 1|23 to‘g‘ri. 123 esa 23 dan katta, shuning uchun butun satr bitta bo‘lak bo‘la olmaydi.",
    "1|0|5 va 10|5 to‘g‘ri. 1|05 da 05 nol bilan boshlanadi, 105 esa 10 dan katta.",
  ],
  sampleNotesEn: [
    "1|2|3, 12|3 and 1|23 work. 123 is larger than 23, so the whole string cannot be one piece.",
    "1|0|5 and 10|5 work. In 1|05 the piece 05 starts with a zero, and 105 is larger than 10.",
  ],
  testInputs: ["123 23\n", "105 10\n", "100 100\n", "0 0\n", "000 5\n", "111111111111111 1000000000000000\n", "9 8\n", "1203 1000\n"],
  sol: `string s;long long K;cin>>s>>K;int n=s.size();
function<long long(int)>go=[&](int i)->long long{
 if(i==n)return 1;
 long long ways=0,v=0;
 for(int j=i;j<n;++j){
  if(j>i&&s[i]=='0')break;
  v=v*10+(s[j]-'0');
  if(v>K)break;
  ways+=go(j+1);}
 return ways;};
cout<<go(0)<<"\\n";`,
  wrongNote: "Letting a piece start with zero accepts 05 and 00; forbidding every piece that starts with zero also throws away the single 0 the statement allows.",
  wrong: [
    `string s;long long K;cin>>s>>K;int n=s.size();
function<long long(int)>go=[&](int i)->long long{
 if(i==n)return 1;
 long long ways=0,v=0;
 for(int j=i;j<n;++j){
  v=v*10+(s[j]-'0');
  if(v>K)break;
  ways+=go(j+1);}
 return ways;};
cout<<go(0)<<"\\n";`,
    `string s;long long K;cin>>s>>K;int n=s.size();
function<long long(int)>go=[&](int i)->long long{
 if(i==n)return 1;
 if(s[i]=='0')return 0;
 long long ways=0,v=0;
 for(int j=i;j<n;++j){
  v=v*10+(s[j]-'0');
  if(v>K)break;
  ways+=go(j+1);}
 return ways;};
cout<<go(0)<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1700 */
P.push({
  id: "B508", judge: "geo-count-axis-right-triangles", topic: "geometry", rating: 1700,
  tag: "Counting", timeLimitMs: 1000,
  uz: "O‘qlarga parallel to‘g‘ri burchaklar",
  en: "Right angles along the axes",
  statementUz: "Tekislikda n ta har xil nuqta berilgan. Shu nuqtalardan uchtasini tanlab, to‘g‘ri burchakli uchburchak hosil qilish kerak, bunda uning ikkala kateti koordinata o‘qlariga parallel bo‘lsin. Boshqacha aytganda, burchak uchi P nuqta, katetlardan biri P bilan bir xil x ga ega Q nuqtaga, ikkinchisi P bilan bir xil y ga ega R nuqtaga boradi. Uchta nuqtadan iborat nechta shunday to‘plam borligini toping.",
  statementEn: "There are n distinct points on the plane. Choose three of them that form a right triangle whose two legs are both parallel to the coordinate axes. In other words, the right-angle corner is a point P, one leg runs to a point Q with the same x as P, and the other to a point R with the same y as P. Count how many sets of three points form such a triangle.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida bitta nuqtaning x va y koordinatalari keladi.",
  inputEn: "The first line contains n. Each of the next n lines contains the coordinates x and y of one point.",
  outputUz: "Yagona butun sonni chiqaring — shunday uchburchaklar soni.",
  outputEn: "Print a single integer — the number of such triangles.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^9 ≤ x, y ≤ 10^9", "all points are distinct", "both legs must be parallel to an axis"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^9 ≤ x, y ≤ 10^9", "barcha nuqtalar har xil", "ikkala katet ham o‘qqa parallel bo‘lishi shart"],
  sampleInputs: ["4\n0 0\n0 1\n1 0\n1 1\n", "3\n0 0\n0 5\n7 0\n"],
  expect: ["4\n", "1\n"],
  sampleNotesUz: [
    "Kvadratning to‘rtta uchidan istalgan uchtasi to‘g‘ri burchakni qolgan uchda hosil qiladi — 4 ta uchburchak.",
    "Burchak (0, 0) da: (0, 5) yuqorida, (7, 0) o‘ngda. Boshqa uchburchak yo‘q.",
  ],
  sampleNotesEn: [
    "Any three corners of the square make a right angle at the corner between them — 4 triangles.",
    "The corner is (0, 0), with (0, 5) above it and (7, 0) to its right. There is no other triangle.",
  ],
  testInputs: ["4\n0 0\n0 1\n1 0\n1 1\n", "3\n0 0\n0 5\n7 0\n", "1\n5 5\n", "3\n0 0\n1 1\n2 2\n", "5\n0 0\n0 1\n0 2\n1 0\n2 0\n", "6\n0 0\n0 3\n3 0\n3 3\n0 -3\n-3 0\n"],
  sol: `int n;cin>>n;vector<pair<long long,long long>>p(n);map<long long,long long>cx,cy;
for(auto&q:p){cin>>q.first>>q.second;++cx[q.first];++cy[q.second];}
long long total=0;for(auto&q:p)total+=(cx[q.first]-1)*(cy[q.second]-1);
cout<<total<<"\\n";`,
  wrongNote: "Multiplying the full column and row counts lets the corner pair with itself; halving the total treats each triangle as found twice when every one is found exactly once, at its right angle.",
  wrong: [
    `int n;cin>>n;vector<pair<long long,long long>>p(n);map<long long,long long>cx,cy;
for(auto&q:p){cin>>q.first>>q.second;++cx[q.first];++cy[q.second];}
long long total=0;for(auto&q:p)total+=cx[q.first]*cy[q.second];
cout<<total<<"\\n";`,
    `int n;cin>>n;vector<pair<long long,long long>>p(n);map<long long,long long>cx,cy;
for(auto&q:p){cin>>q.first>>q.second;++cx[q.first];++cy[q.second];}
long long total=0;for(auto&q:p)total+=(cx[q.first]-1)*(cy[q.second]-1);
cout<<total/2<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 1800 */
P.push({
  id: "B509", judge: "two-pointers-longest-spread-at-most-k", topic: "two-pointers", rating: 1800,
  tag: "Sliding window", timeLimitMs: 1000,
  uz: "Tor oraliqdagi eng uzun bo‘lak",
  en: "The longest stretch within a band",
  statementUz: "Sizga n ta butun sondan iborat massiv va k soni berilgan. Massivning uzluksiz qismini (bir yoki bir nechta qo‘shni elementlarni) tanlash kerak, bunda shu qismdagi eng katta va eng kichik element ayirmasi k dan oshmasin. Shartni qanoatlantiradigan eng uzun qismning uzunligini toping. Bitta elementdan iborat qism har doim shartni qanoatlantiradi, chunki undagi ayirma 0.",
  statementEn: "You are given an array of n integers and a number k. Choose a contiguous part of the array — one or more neighbouring elements — in which the largest element minus the smallest is at most k. Find the length of the longest such part. A part of a single element always qualifies, since its difference is 0.",
  inputUz: "Birinchi qatorda n va k beriladi. Ikkinchi qatorda probel bilan ajratilgan n ta butun son keladi.",
  inputEn: "The first line contains n and k. The second line contains n integers separated by single spaces.",
  outputUz: "Yagona butun sonni chiqaring — eng uzun mos qismning uzunligi.",
  outputEn: "Print a single integer — the length of the longest qualifying part.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ k ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "the whole part counts, not only neighbouring pairs"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "0 ≤ k ≤ 10^9", "−10^9 ≤ a_i ≤ 10^9", "faqat qo‘shni juftlar emas, butun qism hisobga olinadi"],
  sampleInputs: ["6 2\n1 3 2 5 4 4\n", "4 0\n7 7 7 7\n"],
  expect: ["3\n", "4\n"],
  sampleNotesUz: [
    "[1, 3, 2] da ayirma 3 − 1 = 2, [5, 4, 4] da 1. To‘rt elementli hech bir qism mos kelmaydi: masalan [3, 2, 5, 4] da ayirma 3.",
    "Barcha elementlar teng, butun massiv mos keladi.",
  ],
  sampleNotesEn: [
    "In [1, 3, 2] the difference is 3 − 1 = 2, and in [5, 4, 4] it is 1. No part of four elements qualifies: [3, 2, 5, 4], for instance, spans 3.",
    "All elements are equal, so the whole array qualifies.",
  ],
  testInputs: ["6 2\n1 3 2 5 4 4\n", "4 0\n7 7 7 7\n", "4 2\n1 2 3 4\n", "1 0\n5\n", "5 0\n1 2 1 2 1\n", "8 3\n10 1 2 3 4 10 11 12\n", "5 1000000000\n-1000000000 0 1000000000 0 -1000000000\n"],
  sol: `int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
deque<int>mx,mn;int l=0,best=0;
for(int r=0;r<n;++r){
 while(!mx.empty()&&a[mx.back()]<=a[r])mx.pop_back();mx.push_back(r);
 while(!mn.empty()&&a[mn.back()]>=a[r])mn.pop_back();mn.push_back(r);
 while(a[mx.front()]-a[mn.front()]>k){++l;if(mx.front()<l)mx.pop_front();if(mn.front()<l)mn.pop_front();}
 best=max(best,r-l+1);}
cout<<best<<"\\n";`,
  wrongNote: "Checking only neighbouring pairs lets small steps add up to a spread far wider than k; a strict comparison rejects parts whose spread is exactly k.",
  wrong: [
    `int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=1,cur=1;
for(int i=1;i<n;++i){if(llabs(a[i]-a[i-1])<=k)++cur;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`,
    `int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
deque<int>mx,mn;int l=0,best=0;
for(int r=0;r<n;++r){
 while(!mx.empty()&&a[mx.back()]<=a[r])mx.pop_back();mx.push_back(r);
 while(!mn.empty()&&a[mn.back()]>=a[r])mn.pop_back();mn.push_back(r);
 while(a[mx.front()]-a[mn.front()]>=k&&l<r){++l;if(mx.front()<l)mx.pop_front();if(mn.front()<l)mn.pop_front();}
 best=max(best,r-l+1);}
cout<<best<<"\\n";`,
  ],
});

/* ------------------------------------------------------------------ 2300 */
P.push({
  id: "C510", judge: "graph-min-edges-strongly-connected", topic: "graphs", rating: 2300,
  tag: "Strongly connected components", timeLimitMs: 2000,
  uz: "Hamma joyga yo‘l ochish",
  en: "Making every city reachable",
  statementUz: "n ta shahar va m ta bir tomonlama yo‘l berilgan: har bir yo‘l u shahridan v shahriga olib boradi, lekin teskari yo‘nalishda yurib bo‘lmaydi. Agar istalgan shahardan istalgan boshqa shaharga yo‘llar bo‘ylab yetib borish mumkin bo‘lsa, tarmoq kuchli bog‘langan deyiladi. Tarmoqni kuchli bog‘langan qilish uchun eng kamida nechta yangi bir tomonlama yo‘l qurish kerakligini toping. Agar tarmoq allaqachon kuchli bog‘langan bo‘lsa, javob 0.",
  statementEn: "There are n cities and m one-way roads: each road leads from city u to city v and cannot be travelled the other way. The network is called strongly connected if every city can reach every other city along the roads. Find the smallest number of new one-way roads that must be built to make the network strongly connected. If it already is, the answer is 0.",
  inputUz: "Birinchi qatorda n va m beriladi. Keyingi m ta qatorning har birida bitta yo‘lning boshi u va oxiri v keladi.",
  inputEn: "The first line contains n and m. Each of the next m lines contains the start u and the end v of one road.",
  outputUz: "Yagona butun sonni chiqaring — qurilishi kerak bo‘lgan yo‘llarning eng kam soni.",
  outputEn: "Print a single integer — the smallest number of roads to build.",
  constraintList: ["1 ≤ n ≤ 2·10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ u, v ≤ n", "roads may repeat and a road may lead from a city to itself"],
  constraintListUz: ["1 ≤ n ≤ 2·10^5", "0 ≤ m ≤ 2·10^5", "1 ≤ u, v ≤ n", "yo‘llar takrorlanishi va shahardan o‘ziga olib borishi mumkin"],
  sampleInputs: ["3 2\n1 2\n2 3\n", "4 0\n"],
  expect: ["1\n", "4\n"],
  sampleNotesUz: [
    "3 dan 1 ga bitta yo‘l qurilsa, 1 → 2 → 3 → 1 aylanasi hosil bo‘ladi va hamma shahar bir-biriga yetadi.",
    "Yo‘l yo‘q, har bir shahar alohida. To‘rtta yo‘l bilan 1 → 2 → 3 → 4 → 1 aylanasini qurish mumkin, kamroq yo‘l bilan esa bo‘lmaydi: har bir shahardan kamida bitta yo‘l chiqishi kerak.",
  ],
  sampleNotesEn: [
    "One road from 3 to 1 closes the cycle 1 → 2 → 3 → 1, and every city reaches every other.",
    "There are no roads, so every city stands alone. Four roads build the cycle 1 → 2 → 3 → 4 → 1, and fewer cannot work: every city needs at least one road leaving it.",
  ],
  testInputs: ["3 2\n1 2\n2 3\n", "4 0\n", "3 3\n1 2\n2 3\n3 1\n", "1 0\n", "4 2\n1 2\n1 3\n", "5 4\n1 2\n2 1\n3 4\n4 3\n", "6 6\n1 2\n2 3\n3 1\n4 5\n5 6\n6 4\n", "2 2\n1 1\n1 2\n"],
  sol: `int n,m;cin>>n>>m;vector<vector<int>>g(n+1),rg(n+1);vector<pair<int,int>>e(m);
for(auto&[u,v]:e){cin>>u>>v;g[u].push_back(v);rg[v].push_back(u);}
vector<int>order;vector<char>seen(n+1,0);
for(int s=1;s<=n;++s){if(seen[s])continue;
 vector<pair<int,int>>st;st.push_back(make_pair(s,0));seen[s]=1;
 while(!st.empty()){auto&[u,i]=st.back();
  if(i<(int)g[u].size()){int v=g[u][i++];if(!seen[v]){seen[v]=1;st.push_back(make_pair(v,0));}}
  else{order.push_back(u);st.pop_back();}}}
vector<int>comp(n+1,-1);int c=0;
for(int k=n-1;k>=0;--k){int s=order[k];if(comp[s]>=0)continue;
 vector<int>st;st.push_back(s);comp[s]=c;
 while(!st.empty()){int u=st.back();st.pop_back();for(int v:rg[u])if(comp[v]<0){comp[v]=c;st.push_back(v);}}
 ++c;}
if(c==1){cout<<0<<"\\n";return 0;}
vector<char>in(c,0),out(c,0);
for(auto&[u,v]:e)if(comp[u]!=comp[v]){out[comp[u]]=1;in[comp[v]]=1;}
int src=0,snk=0;for(int i=0;i<c;++i){if(!in[i])++src;if(!out[i])++snk;}
cout<<max(src,snk)<<"\\n";`,
  wrongNote: "Without the special case a network that is already one component reports one road instead of none; taking the smaller of the source and sink counts leaves some component with no way in or no way out.",
  wrong: [
    `int n,m;cin>>n>>m;vector<vector<int>>g(n+1),rg(n+1);vector<pair<int,int>>e(m);
for(auto&[u,v]:e){cin>>u>>v;g[u].push_back(v);rg[v].push_back(u);}
vector<int>order;vector<char>seen(n+1,0);
for(int s=1;s<=n;++s){if(seen[s])continue;
 vector<pair<int,int>>st;st.push_back(make_pair(s,0));seen[s]=1;
 while(!st.empty()){auto&[u,i]=st.back();
  if(i<(int)g[u].size()){int v=g[u][i++];if(!seen[v]){seen[v]=1;st.push_back(make_pair(v,0));}}
  else{order.push_back(u);st.pop_back();}}}
vector<int>comp(n+1,-1);int c=0;
for(int k=n-1;k>=0;--k){int s=order[k];if(comp[s]>=0)continue;
 vector<int>st;st.push_back(s);comp[s]=c;
 while(!st.empty()){int u=st.back();st.pop_back();for(int v:rg[u])if(comp[v]<0){comp[v]=c;st.push_back(v);}}
 ++c;}
vector<char>in(c,0),out(c,0);
for(auto&[u,v]:e)if(comp[u]!=comp[v]){out[comp[u]]=1;in[comp[v]]=1;}
int src=0,snk=0;for(int i=0;i<c;++i){if(!in[i])++src;if(!out[i])++snk;}
cout<<max(src,snk)<<"\\n";`,
    `int n,m;cin>>n>>m;vector<vector<int>>g(n+1),rg(n+1);vector<pair<int,int>>e(m);
for(auto&[u,v]:e){cin>>u>>v;g[u].push_back(v);rg[v].push_back(u);}
vector<int>order;vector<char>seen(n+1,0);
for(int s=1;s<=n;++s){if(seen[s])continue;
 vector<pair<int,int>>st;st.push_back(make_pair(s,0));seen[s]=1;
 while(!st.empty()){auto&[u,i]=st.back();
  if(i<(int)g[u].size()){int v=g[u][i++];if(!seen[v]){seen[v]=1;st.push_back(make_pair(v,0));}}
  else{order.push_back(u);st.pop_back();}}}
vector<int>comp(n+1,-1);int c=0;
for(int k=n-1;k>=0;--k){int s=order[k];if(comp[s]>=0)continue;
 vector<int>st;st.push_back(s);comp[s]=c;
 while(!st.empty()){int u=st.back();st.pop_back();for(int v:rg[u])if(comp[v]<0){comp[v]=c;st.push_back(v);}}
 ++c;}
if(c==1){cout<<0<<"\\n";return 0;}
vector<char>in(c,0),out(c,0);
for(auto&[u,v]:e)if(comp[u]!=comp[v]){out[comp[u]]=1;in[comp[v]]=1;}
int src=0,snk=0;for(int i=0;i<c;++i){if(!in[i])++src;if(!out[i])++snk;}
cout<<min(src,snk)<<"\\n";`,
  ],
});

export default P;
