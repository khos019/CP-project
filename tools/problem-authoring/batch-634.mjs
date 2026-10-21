/* Batch 634 — one problem, C634, for the roadmap unit geometry-12 (sweep line
 * in geometry), whose main problem had been a 1500 two-rectangle overlap while
 * the unit's band is 2000–2200. The union area of many rectangles is the
 * textbook use of a sweep line with a segment tree; the bank reaches 634.
 *
 * A well-known contest problem restated for AlgoYo'l in our own words, with
 * our own samples; the rating follows the Codeforces scale.
 */
import { line } from "./gen-lib.mjs";

const P = [];

/* ------------------------------------------------------------------ 2100 */
P.push({
  id: "C634", judge: "geo-union-of-rectangles-area", topic: "geometry", rating: 2100,
  tag: "Sweep line", timeLimitMs: 2000,
  uz: "To‘rtburchaklar birlashmasi",
  en: "The union of rectangles",
  statementUz: "Tekislikda n ta to‘g‘ri to‘rtburchak berilgan, ularning tomonlari koordinata o‘qlariga parallel. i-to‘rtburchakning chap pastki burchagi (x1, y1), o‘ng yuqori burchagi (x2, y2). To‘rtburchaklar bir-birini qoplashi, biri ikkinchisining ichida yotishi yoki umuman kesishmasligi mumkin. Kamida bitta to‘rtburchak bilan qoplangan sohaning umumiy yuzasini toping: bir nechta to‘rtburchak qoplagan joy bir marta hisoblanadi.",
  statementEn: "n rectangles lie in the plane with their sides parallel to the axes. Rectangle i has its lower-left corner at (x1, y1) and its upper-right corner at (x2, y2). Rectangles may overlap, one may lie inside another, or they may not meet at all. Find the total area of the region covered by at least one rectangle: a place covered by several rectangles is counted once.",
  inputUz: "Birinchi qatorda n beriladi. Keyingi n ta qatorning har birida x1, y1, x2, y2 keladi.",
  inputEn: "The first line contains n. Each of the next n lines contains x1, y1, x2 and y2.",
  outputUz: "Yagona butun sonni chiqaring — qoplangan sohaning yuzasi.",
  outputEn: "Print a single integer — the area of the covered region.",
  constraintList: ["1 ≤ n ≤ 10^5", "−10^6 ≤ x1 < x2 ≤ 10^6", "−10^6 ≤ y1 < y2 ≤ 10^6", "the answer can exceed 2^31"],
  constraintListUz: ["1 ≤ n ≤ 10^5", "−10^6 ≤ x1 < x2 ≤ 10^6", "−10^6 ≤ y1 < y2 ≤ 10^6", "javob 2^31 dan oshishi mumkin"],
  sampleInputs: ["3\n0 0 2 2\n1 1 3 3\n5 5 6 7\n", "2\n0 0 10 10\n2 2 3 3\n"],
  expect: ["9\n", "100\n"],
  sampleNotesUz: [
    "Birinchi ikkitasining yuzasi 4 va 4, ular 1×1 kvadratda ustma-ust tushadi: 4 + 4 − 1 = 7. Uchinchisi alohida turadi va 2 qo‘shadi.",
    "Kichik to‘rtburchak kattasining ichida yotadi, shuning uchun yuzaga hech narsa qo‘shmaydi.",
  ],
  sampleNotesEn: [
    "The first two have area 4 each and overlap in a 1×1 square: 4 + 4 − 1 = 7. The third stands apart and adds 2.",
    "The small rectangle lies inside the large one, so it adds nothing.",
  ],
  testInputs: ["3\n0 0 2 2\n1 1 3 3\n5 5 6 7\n", "2\n0 0 10 10\n2 2 3 3\n", "1\n-1000000 -1000000 1000000 1000000\n", "2\n0 0 1 1\n1 0 2 1\n", "3\n0 0 4 1\n0 0 1 4\n0 0 4 4\n", "4\n0 0 2 4\n1 1 3 3\n-1 2 5 3\n2 -5 3 0\n"],
  sol: `int n;cin>>n;vector<array<long long,4>>r(n);vector<long long>ys;ys.reserve(2*n);
for(auto&a:r){cin>>a[0]>>a[1]>>a[2]>>a[3];ys.push_back(a[1]);ys.push_back(a[3]);}
sort(ys.begin(),ys.end());ys.erase(unique(ys.begin(),ys.end()),ys.end());int m=ys.size()-1;
vector<array<long long,4>>ev;ev.reserve(2*n);
for(auto&a:r){long long lo=lower_bound(ys.begin(),ys.end(),a[1])-ys.begin(),hi=lower_bound(ys.begin(),ys.end(),a[3])-ys.begin();ev.push_back({a[0],1,lo,hi});ev.push_back({a[2],-1,lo,hi});}
sort(ev.begin(),ev.end());
static int cnt[800005];static long long len[800005];
auto upd=[&](auto&&self,int v,int l,int rr,int ql,int qr,int d)->void{if(qr<=l||rr<=ql)return;
 if(ql<=l&&rr<=qr)cnt[v]+=d;else{int mid=(l+rr)/2;self(self,2*v,l,mid,ql,qr,d);self(self,2*v+1,mid,rr,ql,qr,d);}
 if(cnt[v]>0)len[v]=ys[rr]-ys[l];else if(rr-l==1)len[v]=0;else len[v]=len[2*v]+len[2*v+1];};
long long ans=0,px=ev[0][0];
for(auto&e:ev){ans+=len[1]*(e[0]-px);px=e[0];upd(upd,1,0,m,(int)e[2],(int)e[3],(int)e[1]);}
cout<<ans<<"\\n";`,
  wrongNote: "Adding up the rectangles' areas counts every overlap more than once; keeping the area in an int overflows once the plane is mostly covered.",
  wrong: [
    `int n;cin>>n;long long s=0;for(int i=0;i<n;++i){long long a,b,c,d;cin>>a>>b>>c>>d;s+=(c-a)*(d-b);}cout<<s<<"\\n";`,
    `int n;cin>>n;vector<array<long long,4>>r(n);vector<long long>ys;
for(auto&a:r){cin>>a[0]>>a[1]>>a[2]>>a[3];ys.push_back(a[1]);ys.push_back(a[3]);}
sort(ys.begin(),ys.end());ys.erase(unique(ys.begin(),ys.end()),ys.end());int m=ys.size()-1;
vector<array<long long,4>>ev;
for(auto&a:r){long long lo=lower_bound(ys.begin(),ys.end(),a[1])-ys.begin(),hi=lower_bound(ys.begin(),ys.end(),a[3])-ys.begin();ev.push_back({a[0],1,lo,hi});ev.push_back({a[2],-1,lo,hi});}
sort(ev.begin(),ev.end());
static int cnt[800005];static long long len[800005];
auto upd=[&](auto&&self,int v,int l,int rr,int ql,int qr,int d)->void{if(qr<=l||rr<=ql)return;
 if(ql<=l&&rr<=qr)cnt[v]+=d;else{int mid=(l+rr)/2;self(self,2*v,l,mid,ql,qr,d);self(self,2*v+1,mid,rr,ql,qr,d);}
 if(cnt[v]>0)len[v]=ys[rr]-ys[l];else if(rr-l==1)len[v]=0;else len[v]=len[2*v]+len[2*v+1];};
int ans=0;long long px=ev[0][0];
for(auto&e:ev){ans+=len[1]*(e[0]-px);px=e[0];upd(upd,1,0,m,(int)e[2],(int)e[3],(int)e[1]);}
cout<<ans<<"\\n";`,
  ],
  gen: (r) => { const n = r.int(1, 6); let s = n + "\n"; for (let i = 0; i < n; i++) { const x1 = r.int(-5, 4), y1 = r.int(-5, 4); s += line([x1, y1, r.int(x1 + 1, 5), r.int(y1 + 1, 5)]) + "\n"; } return s; },
  brute: `int n;cin>>n;vector<array<int,4>>r(n);for(auto&a:r)cin>>a[0]>>a[1]>>a[2]>>a[3];long long c=0;
for(int x=-5;x<5;++x)for(int y=-5;y<5;++y){bool in=false;for(auto&a:r)if(a[0]<=x&&x<a[2]&&a[1]<=y&&y<a[3])in=true;if(in)++c;}cout<<c<<"\\n";`,
  slow: [`int n;cin>>n;vector<array<long long,4>>r(n);vector<long long>xs;for(auto&a:r){cin>>a[0]>>a[1]>>a[2]>>a[3];xs.push_back(a[0]);xs.push_back(a[2]);}
sort(xs.begin(),xs.end());xs.erase(unique(xs.begin(),xs.end()),xs.end());long long ans=0;
for(size_t i=0;i+1<xs.size();++i){vector<pair<long long,long long>>iv;for(auto&a:r)if(a[0]<=xs[i]&&xs[i+1]<=a[2])iv.push_back(make_pair(a[1],a[3]));
 sort(iv.begin(),iv.end());long long cov=0,cl=LLONG_MIN,cr=LLONG_MIN;for(auto&p:iv){if(p.first>cr){cov+=cr-cl;cl=p.first;cr=p.second;}else cr=max(cr,p.second);}cov+=cr-cl;ans+=cov*(xs[i+1]-xs[i]);}
cout<<ans<<"\\n";`],
  big: [
    { seed: 1, note: "10^5 random rectangles over the whole range: rescanning every x-slab is quadratic", code: `n = 100000
rs = []
for _ in range(n):
    x1 = r.int(-10**6, 10**6 - 1)
    y1 = r.int(-10**6, 10**6 - 1)
    rs.append(line([x1, y1, r.int(x1 + 1, min(10**6, x1 + 300000)), r.int(y1 + 1, min(10**6, y1 + 300000))]))
return str(n) + "\\n" + "\\n".join(rs)` },
    { seed: 2, note: "10^5 rectangles all around the origin: deep overlap, answer near 4·10^12", code: `n = 100000
rs = []
for _ in range(n):
    rs.append(line([-r.int(1, 10**6), -r.int(1, 10**6), r.int(1, 10**6), r.int(1, 10**6)]))
return str(n) + "\\n" + "\\n".join(rs)` },
    { seed: 3, note: "thin horizontal and vertical strips crossing each other", code: `n = 100000
rs = []
for i in range(n):
    c = r.int(-10**6, 10**6 - 3)
    if i % 2:
        rs.append(line([-10**6, c, 10**6, c + r.int(1, 3)]))
    else:
        rs.append(line([c, -10**6, c + r.int(1, 3), 10**6]))
return str(n) + "\\n" + "\\n".join(rs)` },
  ],
});

export default P;
