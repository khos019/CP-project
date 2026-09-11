/* Reference solutions for the duel bot. SERVER ONLY.
 *
 * This file must never be imported from anywhere under app/ui. The same rule
 * app/api/judge/tests.ts already follows for hidden test data, and for the same
 * reason: anything the browser bundle can reach, a learner can read. There is a
 * test (tests/solutions-are-server-only.test.mjs) that fails the build if the
 * marker below ever appears in dist/client.
 *
 * MARKER: ALGOYOL_SERVER_ONLY_SOLUTIONS
 *
 * Two kinds of source per problem:
 *
 *   solution — a correct reference implementation.
 *   wrong    — a *realistic* near miss. Not gibberish and not an empty main:
 *              a 32-bit overflow, a truncating division, a greedy that ignores
 *              a case, a sqrt() that loses precision at 1e18. These are the
 *              mistakes people actually make, which is what makes a bot's
 *              WRONG_ANSWER look like a player having a bad round rather than
 *              a machine pretending.
 *
 * Nothing here is ever returned to a client. The bot submits it to the same
 * judge a human uses and the duel only ever learns the verdict.
 */

export type ProblemSolutions = { solution: string; wrong: string[] };

const cpp = (body: string) => `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\n${body}\nreturn 0;}\n`;

export const solutions: Record<string, ProblemSolutions> = {
  // ---------------------------------------------------------------- 800
  "sum-two": {
    solution: cpp(`long long a,b;cin>>a>>b;cout<<a+b<<"\\n";`),
    // A typo that compiles: the operator nobody proof-reads.
    wrong: [cpp(`long long a,b;cin>>a>>b;cout<<a-b<<"\\n";`)],
  },
  "array-reverse": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=n-1;i>=0;--i)cout<<a[i]<<(i?" ":"\\n");`),
    // Read it, print it, forget to turn it around.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`)],
  },
  "count-parity": {
    solution: cpp(`int n;cin>>n;long long e=0,o=0,x;while(n--){cin>>x;if(x%2==0)e++;else o++;}
cout<<e<<" "<<o<<"\\n";`),
    // x % 2 == 1 is false for negative odd numbers in C++.
    wrong: [cpp(`int n;cin>>n;long long e=0,o=0,x;while(n--){cin>>x;if(x%2==1)o++;else e++;}
cout<<e<<" "<<o<<"\\n";`)],
  },
  "digit-sum": {
    solution: cpp(`string s;cin>>s;long long t=0;for(char c:s)t+=c-'0';cout<<t<<"\\n";`),
    // Reading an 18-digit number into an int.
    wrong: [cpp(`int n;cin>>n;long long t=0;while(n>0){t+=n%10;n/=10;}cout<<t<<"\\n";`)],
  },
  "vowel-count": {
    solution: cpp(`string s;cin>>s;long long c=0;for(char ch:s)if(strchr("aeiou",ch))c++;cout<<c<<"\\n";`),
    // y is not a vowel here.
    wrong: [cpp(`string s;cin>>s;long long c=0;for(char ch:s)if(strchr("aeiouy",ch))c++;cout<<c<<"\\n";`)],
  },
  "range-spread": {
    solution: cpp(`int n;cin>>n;long long x,mn=LLONG_MAX,mx=LLONG_MIN;while(n--){cin>>x;mn=min(mn,x);mx=max(mx,x);}
cout<<mx-mn<<"\\n";`),
    // Answered a different question.
    wrong: [cpp(`int n;cin>>n;long long x,mx=LLONG_MIN;while(n--){cin>>x;mx=max(mx,x);}cout<<mx<<"\\n";`)],
  },
  "temperature-average": {
    solution: cpp(`int n;cin>>n;long long s=0,x;for(int i=0;i<n;++i){cin>>x;s+=x;}
long long q=s/n;if(s%n!=0&&((s<0)!=(n<0)))--q;cout<<q<<"\\n";`),
    // Integer division truncates toward zero; the statement wants a floor.
    wrong: [cpp(`int n;cin>>n;long long s=0,x;for(int i=0;i<n;++i){cin>>x;s+=x;}cout<<s/n<<"\\n";`)],
  },
  "multiples-sum": {
    solution: cpp(`long long n;cin>>n;long long t=0;for(long long i=1;i<n;++i)if(i%3==0||i%5==0)t+=i;cout<<t<<"\\n";`),
    // Off by one at the boundary: "below n" is not "up to n".
    wrong: [cpp(`long long n;cin>>n;long long t=0;for(long long i=1;i<=n;++i)if(i%3==0||i%5==0)t+=i;cout<<t<<"\\n";`)],
  },

  // ---------------------------------------------------------------- 900
  "gcd-lcm": {
    solution: cpp(`long long a,b;cin>>a>>b;long long g=gcd(a,b);cout<<g<<" "<<a/g*b<<"\\n";`),
    // Both numbers are right, in the wrong order.
    wrong: [cpp(`long long a,b;cin>>a>>b;long long g=gcd(a,b);cout<<a/g*b<<" "<<g<<"\\n";`)],
  },
  "palindrome-word": {
    solution: cpp(`string s;cin>>s;string r=s;reverse(r.begin(),r.end());cout<<(s==r?"YES":"NO")<<"\\n";`),
    // Compares only the first half against itself.
    wrong: [cpp(`string s;cin>>s;bool ok=true;for(size_t i=0;i<s.size()/2;++i)if(s[i]!=s[i+1])ok=false;
cout<<(ok?"YES":"NO")<<"\\n";`)],
  },
  "power-of-two": {
    solution: cpp(`unsigned long long n;cin>>n;cout<<((n&&(n&(n-1))==0)?"YES":"NO")<<"\\n";`),
    // Even is not the same as a power of two.
    wrong: [cpp(`unsigned long long n;cin>>n;cout<<((n%2==0)?"YES":"NO")<<"\\n";`)],
  },
  "running-max": {
    solution: cpp(`int n;cin>>n;long long x,mx=LLONG_MIN;for(int i=0;i<n;++i){cin>>x;mx=max(mx,x);cout<<mx<<(i+1<n?" ":"\\n");}`),
    // Starts the running maximum at zero, so negatives never win.
    wrong: [cpp(`int n;cin>>n;long long x,mx=0;for(int i=0;i<n;++i){cin>>x;mx=max(mx,x);cout<<mx<<(i+1<n?" ":"\\n");}`)],
  },
  "second-largest": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());
if(a.size()<2)cout<<-1<<"\\n";else cout<<a[a.size()-2]<<"\\n";`),
    // "Second largest" is not "the second element from the end".
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
if(n<2)cout<<-1<<"\\n";else cout<<a[n-2]<<"\\n";`)],
  },
  "factorial-mod": {
    solution: cpp(`long long n;cin>>n;const long long M=1000000007;long long r=1;
for(long long i=2;i<=n;++i)r=r*i%M;cout<<r<<"\\n";`),
    // Forgets the modulus entirely.
    wrong: [cpp(`long long n;cin>>n;long long r=1;for(long long i=2;i<=n;++i)r=r*i;cout<<r<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1000
  "anagram-check": {
    solution: cpp(`string a,b;cin>>a>>b;sort(a.begin(),a.end());sort(b.begin(),b.end());
cout<<(a==b?"YES":"NO")<<"\\n";`),
    // Same length is not the same multiset.
    wrong: [cpp(`string a,b;cin>>a>>b;cout<<(a.size()==b.size()?"YES":"NO")<<"\\n";`)],
  },
  "bit-count": {
    solution: cpp(`unsigned long long n;cin>>n;cout<<__builtin_popcountll(n)<<"\\n";`),
    // popcount on 32 bits loses the top half.
    wrong: [cpp(`unsigned long long n;cin>>n;cout<<__builtin_popcount((unsigned)n)<<"\\n";`)],
  },
  "count-distinct": {
    solution: cpp(`int n;cin>>n;set<long long>s;long long x;while(n--){cin>>x;s.insert(x);}cout<<s.size()<<"\\n";`),
    // Only removes neighbouring duplicates, without sorting first.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
cout<<(int)(unique(a.begin(),a.end())-a.begin())<<"\\n";`)],
  },
  "word-count": {
    solution: cpp(`string w;long long c=0;while(cin>>w)c++;cout<<c<<"\\n";`),
    // Counts separators, so runs of spaces inflate the answer.
    wrong: [cpp(`string line;getline(cin,line);long long c=line.empty()?0:1;
for(char ch:line)if(ch==' ')c++;cout<<c<<"\\n";`)],
  },
  "char-frequency": {
    solution: cpp(`string s;cin>>s;int f[256]={0};for(unsigned char c:s)f[c]++;
int best=-1;char ch='a';for(int c=0;c<256;++c)if(f[c]>best){best=f[c];ch=(char)c;}
cout<<ch<<"\\n";`),
    // Ties go to the largest character instead of the smallest.
    wrong: [cpp(`string s;cin>>s;int f[256]={0};for(unsigned char c:s)f[c]++;
int best=-1;char ch='a';for(int c=0;c<256;++c)if(f[c]>=best){best=f[c];ch=(char)c;}
cout<<ch<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1100+
  "balanced-brackets": {
    solution: cpp(`string s;cin>>s;vector<char>st;bool ok=true;
for(char c:s){if(c=='('||c=='['||c=='{')st.push_back(c);
else{if(st.empty()){ok=false;break;}char t=st.back();st.pop_back();
if((c==')'&&t!='(')||(c==']'&&t!='[')||(c=='}'&&t!='{')){ok=false;break;}}}
cout<<((ok&&st.empty())?"YES":"NO")<<"\\n";`),
    // Counting depth without matching types accepts "([)]".
    wrong: [cpp(`string s;cin>>s;int d=0;bool ok=true;
for(char c:s){if(c=='('||c=='['||c=='{')d++;else{d--;if(d<0){ok=false;break;}}}
cout<<((ok&&d==0)?"YES":"NO")<<"\\n";`)],
  },
  "max-subarray": {
    solution: cpp(`int n;cin>>n;long long best=LLONG_MIN,cur=0,x;
for(int i=0;i<n;++i){cin>>x;cur=max(x,cur+x);best=max(best,cur);}cout<<best<<"\\n";`),
    // Starting the best at zero silently assumes an empty subarray is allowed.
    wrong: [cpp(`int n;cin>>n;long long best=0,cur=0,x;
for(int i=0;i<n;++i){cin>>x;cur=max(0LL,cur+x);best=max(best,cur);}cout<<best<<"\\n";`)],
  },
  "window-sum": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long cur=0;for(long long i=0;i<k;++i)cur+=a[i];long long best=cur;
for(long long i=k;i<n;++i){cur+=a[i]-a[i-k];best=max(best,cur);}cout<<best<<"\\n";`),
    // Same zero-initialised maximum, same failure on all-negative input.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long cur=0,best=0;for(long long i=0;i<k;++i)cur+=a[i];best=max(best,cur);
for(long long i=k;i<n;++i){cur+=a[i]-a[i-k];best=max(best,cur);}cout<<best<<"\\n";`)],
  },
  "first-not-less": {
    solution: cpp(`long long n,x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;
auto it=lower_bound(a.begin(),a.end(),x);
cout<<(it==a.end()?-1:(int)(it-a.begin())+1)<<"\\n";`),
    // Zero-indexed answer where the statement asks for a position.
    wrong: [cpp(`long long n,x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;
auto it=lower_bound(a.begin(),a.end(),x);
cout<<(it==a.end()?-1:(int)(it-a.begin()))<<"\\n";`)],
  },
  "kth-largest": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.rbegin(),a.rend());cout<<a[k-1]<<"\\n";`),
    // Off by one: k-th largest read as an index rather than a rank.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.rbegin(),a.rend());cout<<a[min(k,n-1)]<<"\\n";`)],
  },
  "binary-search-sqrt": {
    solution: cpp(`unsigned long long n;cin>>n;unsigned long long lo=0,hi=2000000000ULL;
while(lo<hi){unsigned long long m=lo+(hi-lo+1)/2;if(m<=n/max(m,1ULL))lo=m;else hi=m-1;}
cout<<lo<<"\\n";`),
    // sqrt() on a double runs out of mantissa around 1e18.
    wrong: [cpp(`unsigned long long n;cin>>n;cout<<(unsigned long long)sqrt((double)n)<<"\\n";`)],
  },
  "rotate-array": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
k%=n;rotate(a.begin(),a.begin()+(n-k)%n,a.end());
for(long long i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`),
    // Rotates the wrong way.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
k%=n;rotate(a.begin(),a.begin()+k,a.end());
for(long long i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`)],
  },
  "prime-count": {
    solution: cpp(`long long n;cin>>n;if(n<2){cout<<0<<"\\n";return 0;}
vector<char>c(n+1,0);long long cnt=0;
for(long long i=2;i<=n;++i){if(!c[i]){cnt++;for(long long j=i*i;j<=n;j+=i)c[j]=1;}}
cout<<cnt<<"\\n";`),
    // Counts 1 as a prime — the oldest mistake in the subject.
    wrong: [cpp(`long long n;cin>>n;long long cnt=0;
for(long long i=1;i<=n;++i){bool p=true;for(long long d=2;d*d<=i;++d)if(i%d==0){p=false;break;}
if(p)cnt++;}cout<<cnt<<"\\n";`)],
  },
  "fast-power": {
    solution: cpp(`long long a,b,m;cin>>a>>b>>m;long long r=1%m;a%=m;
while(b){if(b&1)r=(__int128)r*a%m;a=(__int128)a*a%m;b>>=1;}cout<<r<<"\\n";`),
    // Multiplies b times instead of squaring — the right answer, far too late.
    wrong: [cpp(`long long a,b,m;cin>>a>>b>>m;long long r=1%m;a%=m;
for(long long i=0;i<b;++i)r=r*a%m;cout<<r<<"\\n";`)],
  },
  "stairs-ways": {
    solution: cpp(`long long n;cin>>n;const long long M=1000000007;long long a=1,b=1;
for(long long i=2;i<=n;++i){long long c=(a+b)%M;a=b;b=c;}cout<<b<<"\\n";`),
    // Fibonacci without the modulus overflows long before 1e6.
    wrong: [cpp(`long long n;cin>>n;long long a=1,b=1;
for(long long i=2;i<=n;++i){long long c=a+b;a=b;b=c;}cout<<b<<"\\n";`)],
  },
  "collatz-steps": {
    solution: cpp(`long long n;cin>>n;long long s=0;while(n!=1){n=(n%2==0)?n/2:3*n+1;s++;}cout<<s<<"\\n";`),
    // Counts the starting value as a step.
    wrong: [cpp(`long long n;cin>>n;long long s=1;while(n!=1){n=(n%2==0)?n/2:3*n+1;s++;}cout<<s<<"\\n";`)],
  },
  // --------------------------------------------------------------- 1100
  "caesar-shift": {
    solution: cpp(`string s;long long k;cin>>s>>k;k%=26;
for(char&c:s)c='a'+(char)((c-'a'+k)%26);cout<<s<<"\\n";`),
    // Shifts the wrong way down the alphabet.
    wrong: [cpp(`string s;long long k;cin>>s>>k;k%=26;
for(char&c:s)c='a'+(char)((c-'a'-k+26)%26);cout<<s<<"\\n";`)],
  },
  "diagonal-sum": {
    solution: cpp(`int n;cin>>n;vector<vector<long long>>a(n,vector<long long>(n));
for(auto&r:a)for(auto&x:r)cin>>x;long long d1=0,d2=0;
for(int i=0;i<n;++i){d1+=a[i][i];d2+=a[i][n-1-i];}cout<<d1<<" "<<d2<<"\\n";`),
    // Off by one on the anti-diagonal.
    wrong: [cpp(`int n;cin>>n;vector<vector<long long>>a(n,vector<long long>(n));
for(auto&r:a)for(auto&x:r)cin>>x;long long d1=0,d2=0;
for(int i=0;i<n;++i){d1+=a[i][i];d2+=a[i][max(0,n-i-2)];}cout<<d1<<" "<<d2<<"\\n";`)],
  },
  "frequency-mode": {
    solution: cpp(`int n;cin>>n;map<long long,long long>f;long long x;
while(n--){cin>>x;f[x]++;}long long best=-1,val=0;
for(auto&p:f)if(p.second>best){best=p.second;val=p.first;}cout<<val<<"\\n";`),
    // Ties go to whichever value was met first rather than the smallest.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
map<long long,long long>f;for(auto x:a)f[x]++;long long best=-1,val=0;
for(auto x:a)if(f[x]>best){best=f[x];val=x;}cout<<val<<"\\n";`)],
  },
  "sum-of-squares": {
    solution: cpp(`long long n;cin>>n;const long long M=1000000007;
auto pw=[&](long long b,long long e){long long r=1;b%=M;while(e){if(e&1)r=r*b%M;b=b*b%M;e>>=1;}return r;};
long long a=n%M,b=(n+1)%M,c=(2*(n%M)+1)%M;
cout<<a*b%M*c%M*pw(6,M-2)%M<<"\\n";`),
    // Loops to n, which is fine at 100 and hopeless at 1e18.
    wrong: [cpp(`long long n;cin>>n;const long long M=1000000007;long long s=0;
for(long long i=1;i<=n;++i)s=(s+i%M*(i%M))%M;cout<<s<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1200
  "count-divisors": {
    solution: cpp(`long long n;cin>>n;long long c=0;
for(long long d=1;d*d<=n;++d)if(n%d==0){c+=2;if(d*d==n)c--;}cout<<c<<"\\n";`),
    // Walks every candidate up to n instead of stopping at the square root.
    wrong: [cpp(`long long n;cin>>n;long long c=0;
for(long long d=1;d<=n;++d)if(n%d==0)c++;cout<<c<<"\\n";`)],
  },
  "longest-equal-run": {
    solution: cpp(`int n;cin>>n;long long x,prev=0;int best=0,cur=0;
for(int i=0;i<n;++i){cin>>x;if(i&&x==prev)cur++;else cur=1;prev=x;best=max(best,cur);}
cout<<best<<"\\n";`),
    // Counts the breaks between runs rather than the runs.
    wrong: [cpp(`int n;cin>>n;long long x,prev=0;int best=0,cur=0;
for(int i=0;i<n;++i){cin>>x;if(i&&x==prev)cur++;else cur=0;prev=x;best=max(best,cur);}
cout<<best<<"\\n";`)],
  },
  "matrix-transpose": {
    solution: cpp(`int r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));
for(auto&row:a)for(auto&x:row)cin>>x;
for(int j=0;j<c;++j){for(int i=0;i<r;++i)cout<<a[i][j]<<(i+1<r?" ":"\\n");}`),
    // Assumes the matrix is square.
    wrong: [cpp(`int r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));
for(auto&row:a)for(auto&x:row)cin>>x;
for(int j=0;j<min(r,c);++j){for(int i=0;i<min(r,c);++i)cout<<a[i][j]<<(i+1<min(r,c)?" ":"\\n");}`)],
  },
  "perfect-number": {
    solution: cpp(`long long n;cin>>n;if(n<2){cout<<"NO\\n";return 0;}long long s=1;
for(long long d=2;d*d<=n;++d)if(n%d==0){s+=d;if(d!=n/d)s+=n/d;}
cout<<(s==n?"YES":"NO")<<"\\n";`),
    // Counts n among its own proper divisors.
    wrong: [cpp(`long long n;cin>>n;long long s=0;
for(long long d=1;d*d<=n;++d)if(n%d==0){s+=d;if(d!=n/d)s+=n/d;}
cout<<(s==n?"YES":"NO")<<"\\n";`)],
  },
  "prefix-queries": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>p(n+1,0);
for(int i=1;i<=n;++i){long long x;cin>>x;p[i]=p[i-1]+x;}
while(q--){int l,r;cin>>l>>r;cout<<p[r]-p[l-1]<<"\\n";}`),
    // Off by one: drops the first element of every range.
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>p(n+1,0);
for(int i=1;i<=n;++i){long long x;cin>>x;p[i]=p[i-1]+x;}
while(q--){int l,r;cin>>l>>r;cout<<p[r]-p[l]<<"\\n";}`)],
  },
  "remove-duplicates-sorted": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
a.erase(unique(a.begin(),a.end()),a.end());
for(size_t i=0;i<a.size();++i)cout<<a[i]<<(i+1<a.size()?" ":"\\n");`),
    // Compares against the first element instead of the previous one.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>o;
for(int i=0;i<n;++i)if(i==0||a[i]!=a[0])o.push_back(a[i]);
for(size_t i=0;i<o.size();++i)cout<<o[i]<<(i+1<o.size()?" ":"\\n");`)],
  },
  "run-length": {
    solution: cpp(`string s;cin>>s;for(size_t i=0;i<s.size();){size_t j=i;
while(j<s.size()&&s[j]==s[i])j++;cout<<s[i]<<(j-i);i=j;}cout<<"\\n";`),
    // Count first, character second.
    wrong: [cpp(`string s;cin>>s;for(size_t i=0;i<s.size();){size_t j=i;
while(j<s.size()&&s[j]==s[i])j++;cout<<(j-i)<<s[i];i=j;}cout<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1300
  "bracket-depth": {
    solution: cpp(`string s;cin>>s;int d=0,best=0;
for(char c:s){if(c=='(')d++;else d--;best=max(best,d);}cout<<best<<"\\n";`),
    // Reports where the depth ended, not how deep it went.
    wrong: [cpp(`string s;cin>>s;int d=0;for(char c:s){if(c=='(')d++;else d--;}cout<<d<<"\\n";`)],
  },
  "count-sort-range": {
    solution: cpp(`int n;cin>>n;vector<int>f(101,0);int x;
while(n--){cin>>x;f[x]++;}bool first=true;
for(int v=0;v<=100;++v)for(int i=0;i<f[v];++i){if(!first)cout<<" ";cout<<v;first=false;}
cout<<"\\n";`),
    // Stops at 99, so the largest value disappears.
    wrong: [cpp(`int n;cin>>n;vector<int>f(101,0);int x;
while(n--){cin>>x;f[x]++;}bool first=true;
for(int v=0;v<100;++v)for(int i=0;i<f[v];++i){if(!first)cout<<" ";cout<<v;first=false;}
cout<<"\\n";`)],
  },
  "fibonacci-mod": {
    solution: cpp(`long long n;cin>>n;const long long M=1000000007;long long a=1,b=1;
if(n<=2){cout<<1<<"\\n";return 0;}
for(long long i=3;i<=n;++i){long long c=(a+b)%M;a=b;b=c;}cout<<b<<"\\n";`),
    // No modulus, so it overflows long before 1e6.
    wrong: [cpp(`long long n;cin>>n;long long a=1,b=1;
if(n<=2){cout<<1<<"\\n";return 0;}
for(long long i=3;i<=n;++i){long long c=a+b;a=b;b=c;}cout<<b<<"\\n";`)],
  },
  "matrix-spiral": {
    solution: cpp(`int r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));
for(auto&row:a)for(auto&x:row)cin>>x;
int top=0,bot=r-1,left=0,right=c-1;vector<long long>out;
while(top<=bot&&left<=right){
 for(int j=left;j<=right;++j)out.push_back(a[top][j]);top++;
 for(int i=top;i<=bot;++i)out.push_back(a[i][right]);right--;
 if(top<=bot){for(int j=right;j>=left;--j)out.push_back(a[bot][j]);bot--;}
 if(left<=right){for(int i=bot;i>=top;--i)out.push_back(a[i][left]);left++;}}
for(size_t i=0;i<out.size();++i)cout<<out[i]<<(i+1<out.size()?" ":"\\n");`),
    // Drops the guards, so a single remaining row is walked twice.
    wrong: [cpp(`int r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));
for(auto&row:a)for(auto&x:row)cin>>x;
int top=0,bot=r-1,left=0,right=c-1;vector<long long>out;
while(top<=bot&&left<=right){
 for(int j=left;j<=right;++j)out.push_back(a[top][j]);top++;
 for(int i=top;i<=bot;++i)out.push_back(a[i][right]);right--;
 for(int j=right;j>=left;--j)out.push_back(a[bot][j]);bot--;
 for(int i=bot;i>=top;--i)out.push_back(a[i][left]);left++;}
for(size_t i=0;i<out.size();++i)cout<<out[i]<<(i+1<out.size()?" ":"\\n");`)],
  },
  "pair-sum-count": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;for(long long i=0;i<n;++i)for(long long j=i+1;j<n;++j)if(a[i]+a[j]==k)c++;
cout<<c<<"\\n";`),
    // Counts each pair in both directions.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long c=0;for(long long i=0;i<n;++i)for(long long j=0;j<n;++j)if(i!=j&&a[i]+a[j]==k)c++;
cout<<c<<"\\n";`)],
  },
  "queue-simulation": {
    solution: cpp(`int q;cin>>q;queue<long long>Q;
while(q--){int t;cin>>t;if(t==1){long long x;cin>>x;Q.push(x);}
else{if(Q.empty())cout<<-1<<"\\n";else{cout<<Q.front()<<"\\n";Q.pop();}}}`),
    // A stack is not a queue.
    wrong: [cpp(`int q;cin>>q;vector<long long>S;
while(q--){int t;cin>>t;if(t==1){long long x;cin>>x;S.push_back(x);}
else{if(S.empty())cout<<-1<<"\\n";else{cout<<S.back()<<"\\n";S.pop_back();}}}`)],
  },
  "triangle-area": {
    solution: cpp(`long long x1,y1,x2,y2,x3,y3;cin>>x1>>y1>>x2>>y2>>x3>>y3;
long long cr=(x2-x1)*(y3-y1)-(y2-y1)*(x3-x1);cout<<llabs(cr)<<"\\n";`),
    // Signed area: negative whenever the points wind the other way.
    wrong: [cpp(`long long x1,y1,x2,y2,x3,y3;cin>>x1>>y1>>x2>>y2>>x3>>y3;
cout<<((x2-x1)*(y3-y1)-(y2-y1)*(x3-x1))<<"\\n";`)],
  },
  "xor-range": {
    solution: cpp(`unsigned long long n;cin>>n;unsigned long long r;
switch(n%4){case 0:r=n;break;case 1:r=1;break;case 2:r=n+1;break;default:r=0;}
cout<<r<<"\\n";`),
    // Loops the whole range, which is fine at 7 and impossible at 1e18.
    wrong: [cpp(`unsigned long long n;cin>>n;unsigned long long r=0;
for(unsigned long long i=1;i<=n;++i)r^=i;cout<<r<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1400
  "components-count": {
    solution: cpp(`int n,m;cin>>n>>m;vector<int>p(n+1);iota(p.begin(),p.end(),0);
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
int c=n;while(m--){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);if(ra!=rb){p[ra]=rb;c--;}}
cout<<c<<"\\n";`),
    // Classic 1-indexing slip: the unused slot 0 is counted as a component.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<int>p(n+1);iota(p.begin(),p.end(),0);
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
while(m--){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);if(ra!=rb)p[ra]=rb;}
int c=0;for(int v=0;v<=n;++v)if(f(v)==v)c++;cout<<c<<"\\n";`)],
  },
  "flood-fill-area": {
    solution: cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<char>>vis(r,vector<char>(c,0));int best=0;
int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
for(int i=0;i<r;++i)for(int j=0;j<c;++j)if(g[i][j]=='#'&&!vis[i][j]){
 int cnt=0;vector<pair<int,int>>st{{i,j}};vis[i][j]=1;
 while(!st.empty()){auto[x,y]=st.back();st.pop_back();cnt++;
  for(int d=0;d<4;++d){int nx=x+dx[d],ny=y+dy[d];
   if(nx>=0&&ny>=0&&nx<r&&ny<c&&g[nx][ny]=='#'&&!vis[nx][ny]){vis[nx][ny]=1;st.push_back({nx,ny});}}}
 best=max(best,cnt);}
cout<<best<<"\\n";`),
    // Diagonals count too, so separate regions merge.
    wrong: [cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<char>>vis(r,vector<char>(c,0));int best=0;
for(int i=0;i<r;++i)for(int j=0;j<c;++j)if(g[i][j]=='#'&&!vis[i][j]){
 int cnt=0;vector<pair<int,int>>st{{i,j}};vis[i][j]=1;
 while(!st.empty()){auto[x,y]=st.back();st.pop_back();cnt++;
  for(int dx=-1;dx<=1;++dx)for(int dy=-1;dy<=1;++dy){int nx=x+dx,ny=y+dy;
   if((dx||dy)&&nx>=0&&ny>=0&&nx<r&&ny<c&&g[nx][ny]=='#'&&!vis[nx][ny]){vis[nx][ny]=1;st.push_back({nx,ny});}}}
 best=max(best,cnt);}
cout<<best<<"\\n";`)],
  },
  "manhattan-closest": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&q:p)cin>>q.first>>q.second;long long best=LLONG_MAX;
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)
 best=min(best,llabs(p[i].first-p[j].first)+llabs(p[i].second-p[j].second));
cout<<best<<"\\n";`),
    // Euclidean where the statement says Manhattan.
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&q:p)cin>>q.first>>q.second;long long best=LLONG_MAX;
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j){long long dx=p[i].first-p[j].first,dy=p[i].second-p[j].second;
 best=min(best,dx*dx+dy*dy);}
cout<<best<<"\\n";`)],
  },
  "merge-intervals": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.first>>p.second;sort(v.begin(),v.end());
int c=0;long long end=LLONG_MIN;
for(auto&p:v){if(p.first>end){c++;end=p.second;}else end=max(end,p.second);}
cout<<c<<"\\n";`),
    // Touching endpoints are treated as separate intervals.
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.first>>p.second;sort(v.begin(),v.end());
int c=0;long long end=LLONG_MIN;
for(auto&p:v){if(p.first>=end){c++;end=p.second;}else end=max(end,p.second);}
cout<<c<<"\\n";`)],
  },
  "peak-element": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=0;i<n;++i){bool l=(i==0)||a[i]>a[i-1],r=(i==n-1)||a[i]>a[i+1];
 if(l&&r){cout<<i+1<<"\\n";return 0;}}
cout<<1<<"\\n";`),
    // Scans from the right, so it finds the rightmost peak.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=n-1;i>=0;--i){bool l=(i==0)||a[i]>a[i-1],r=(i==n-1)||a[i]>a[i+1];
 if(l&&r){cout<<i+1<<"\\n";return 0;}}
cout<<1<<"\\n";`)],
  },
  "string-rotation": {
    solution: cpp(`string s,t;cin>>s>>t;
if(s.size()!=t.size()){cout<<"NO\\n";return 0;}
cout<<(((s+s).find(t)!=string::npos)?"YES":"NO")<<"\\n";`),
    // Same letters is not the same rotation.
    wrong: [cpp(`string s,t;cin>>s>>t;string a=s,b=t;
sort(a.begin(),a.end());sort(b.begin(),b.end());
cout<<(a==b?"YES":"NO")<<"\\n";`)],
  },
  "tree-leaf-count": {
    solution: cpp(`int n;cin>>n;vector<int>d(n+1,0);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;d[a]++;d[b]++;}
int c=0;for(int v=2;v<=n;++v)if(d[v]==1)c++;cout<<c<<"\\n";`),
    // Counts the root as a leaf when it has a single child.
    wrong: [cpp(`int n;cin>>n;vector<int>d(n+1,0);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;d[a]++;d[b]++;}
int c=0;for(int v=1;v<=n;++v)if(d[v]==1)c++;cout<<c<<"\\n";`)],
  },
  "two-pointer-closest": {
    solution: cpp(`long long n,t;cin>>n>>t;vector<long long>a(n);for(auto&x:a)cin>>x;
long long i=0,j=n-1,best=a[0]+a[1];
while(i<j){long long s=a[i]+a[j];
 if(llabs(s-t)<llabs(best-t)||(llabs(s-t)==llabs(best-t)&&s<best))best=s;
 if(s<t)i++;else j--;}
cout<<best<<"\\n";`),
    // Only ever adds neighbouring elements, so most pairs are never tried.
    wrong: [cpp(`long long n,t;cin>>n>>t;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=a[0]+a[1];
for(long long i=0;i+1<n;++i){long long s=a[i]+a[i+1];if(llabs(s-t)<llabs(best-t))best=s;}
cout<<best<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1500
  "activity-select": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.second>>p.first;sort(v.begin(),v.end());
long long last=LLONG_MIN;int c=0;
for(auto&p:v)if(p.second>=last||last==LLONG_MIN){c++;last=p.first;}
cout<<c<<"\\n";`),
    // Sorted by start time, which is the greedy that does not work.
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.first>>p.second;sort(v.begin(),v.end());
long long last=LLONG_MIN;int c=0;
for(auto&p:v)if(p.first>=last||last==LLONG_MIN){c++;last=p.second;}
cout<<c<<"\\n";`)],
  },
  "bfs-levels": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<long long>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);
while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
for(int v=1;v<=n;++v)cout<<d[v]<<(v<n?" ":"\\n");`),
    // Counts the start as step one, so every distance is off by one.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<long long>d(n+1,-1);queue<int>q;d[1]=1;q.push(1);
while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
for(int v=1;v<=n;++v)cout<<d[v]<<(v<n?" ":"\\n");`)],
  },
  "fractional-tasks": {
    solution: cpp(`long long n,T;cin>>n>>T;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());long long s=0;int c=0;
for(auto x:a){if(s+x>T)break;s+=x;c++;}cout<<c<<"\\n";`),
    // Takes the longest tasks first.
    wrong: [cpp(`long long n,T;cin>>n>>T;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.rbegin(),a.rend());long long s=0;int c=0;
for(auto x:a){if(s+x>T)break;s+=x;c++;}cout<<c<<"\\n";`)],
  },
  "grid-paths": {
    solution: cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
const long long M=1000000007;vector<vector<long long>>dp(r,vector<long long>(c,0));
for(int i=0;i<r;++i)for(int j=0;j<c;++j){if(g[i][j]=='#'){dp[i][j]=0;continue;}
 if(i==0&&j==0){dp[i][j]=1;continue;}
 long long v=0;if(i)v+=dp[i-1][j];if(j)v+=dp[i][j-1];dp[i][j]=v%M;}
cout<<dp[r-1][c-1]<<"\\n";`),
    // Walls are counted as walkable.
    wrong: [cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
const long long M=1000000007;vector<vector<long long>>dp(r,vector<long long>(c,0));
for(int i=0;i<r;++i)for(int j=0;j<c;++j){
 if(i==0&&j==0){dp[i][j]=1;continue;}
 long long v=0;if(i)v+=dp[i-1][j];if(j)v+=dp[i][j-1];dp[i][j]=v%M;}
cout<<dp[r-1][c-1]<<"\\n";`)],
  },
  "grid-shortest": {
    solution: cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
vector<vector<int>>d(r,vector<int>(c,-1));queue<pair<int,int>>q;
if(g[0][0]=='#'){cout<<-1<<"\\n";return 0;}
d[0][0]=0;q.push({0,0});int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
while(!q.empty()){auto[x,y]=q.front();q.pop();
 for(int k=0;k<4;++k){int nx=x+dx[k],ny=y+dy[k];
  if(nx>=0&&ny>=0&&nx<r&&ny<c&&g[nx][ny]!='#'&&d[nx][ny]<0){d[nx][ny]=d[x][y]+1;q.push({nx,ny});}}}
cout<<d[r-1][c-1]<<"\\n";`),
    // Straight-line distance, as if the walls were not there.
    wrong: [cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;
cout<<(r-1)+(c-1)<<"\\n";`)],
  },
  "house-robber": {
    solution: cpp(`int n;cin>>n;long long take=0,skip=0,x;
for(int i=0;i<n;++i){cin>>x;long long nt=skip+x,ns=max(skip,take);take=max(nt,0LL);skip=ns;}
cout<<max(take,skip)<<"\\n";`),
    // Adjacent elements can both be taken.
    wrong: [cpp(`int n;cin>>n;long long s=0,x;
for(int i=0;i<n;++i){cin>>x;if(x>0)s+=x;}cout<<s<<"\\n";`)],
  },
  "longest-distinct": {
    solution: cpp(`string s;cin>>s;vector<int>last(256,-1);int best=0,start=0;
for(int i=0;i<(int)s.size();++i){unsigned char c=s[i];
 if(last[c]>=start)start=last[c]+1;last[c]=i;best=max(best,i-start+1);}
cout<<best<<"\\n";`),
    // Measures the longest stretch with no *adjacent* repeat, which is a
    // different and much easier question.
    wrong: [cpp(`string s;cin>>s;int best=1,cur=1;
for(size_t i=1;i<s.size();++i){if(s[i]!=s[i-1])cur++;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`)],
  },
  "max-heap-k": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
nth_element(a.begin(),a.begin()+k-1,a.end(),greater<long long>());
cout<<accumulate(a.begin(),a.begin()+k,0LL)<<"\\n";`),
    // Sums the k smallest.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());cout<<accumulate(a.begin(),a.begin()+k,0LL)<<"\\n";`)],
  },
  "permutations-count": {
    solution: cpp(`int n;cin>>n;vector<long long>d(max(2,n+1),0);d[0]=1;if(n>=1)d[1]=0;
for(int i=2;i<=n;++i)d[i]=(long long)(i-1)*(d[i-1]+d[i-2]);
cout<<d[n]<<"\\n";`),
    // Counts every permutation, not the ones with no fixed point.
    wrong: [cpp(`int n;cin>>n;long long f=1;for(int i=2;i<=n;++i)f*=i;cout<<f<<"\\n";`)],
  },
  "sort-by-frequency": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
map<long long,int>f;for(auto x:a)f[x]++;
vector<pair<long long,int>>v(f.begin(),f.end());
sort(v.begin(),v.end(),[](auto&p,auto&q){return p.second!=q.second?p.second>q.second:p.first<q.first;});
bool first=true;for(auto&p:v)for(int i=0;i<p.second;++i){if(!first)cout<<" ";cout<<p.first;first=false;}
cout<<"\\n";`),
    // Ties break toward the larger value.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
map<long long,int>f;for(auto x:a)f[x]++;
vector<pair<long long,int>>v(f.begin(),f.end());
sort(v.begin(),v.end(),[](auto&p,auto&q){return p.second!=q.second?p.second>q.second:p.first>q.first;});
bool first=true;for(auto&p:v)for(int i=0;i<p.second;++i){if(!first)cout<<" ";cout<<p.first;first=false;}
cout<<"\\n";`)],
  },
  "stack-next-greater": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n),r(n,-1);for(auto&x:a)cin>>x;
vector<int>st;
for(int i=0;i<n;++i){while(!st.empty()&&a[st.back()]<a[i]){r[st.back()]=a[i];st.pop_back();}st.push_back(i);}
for(int i=0;i<n;++i)cout<<r[i]<<(i+1<n?" ":"\\n");`),
    // Accepts an equal element as "greater".
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n),r(n,-1);for(auto&x:a)cin>>x;
vector<int>st;
for(int i=0;i<n;++i){while(!st.empty()&&a[st.back()]<=a[i]){r[st.back()]=a[i];st.pop_back();}st.push_back(i);}
for(int i=0;i<n;++i)cout<<r[i]<<(i+1<n?" ":"\\n");`)],
  },
  "substring-occurrences": {
    solution: cpp(`string s,p;cin>>s>>p;long long c=0;
for(size_t i=0;i+p.size()<=s.size();++i)if(s.compare(i,p.size(),p)==0)c++;
cout<<c<<"\\n";`),
    // Skips past each match, so overlaps are lost.
    wrong: [cpp(`string s,p;cin>>s>>p;long long c=0;size_t i=0;
while(i+p.size()<=s.size()){if(s.compare(i,p.size(),p)==0){c++;i+=p.size();}else i++;}
cout<<c<<"\\n";`)],
  },
  // --------------------------------------------------------------- 1600
  "coin-change": {
    solution: cpp(`int n;long long t;cin>>n>>t;vector<long long>c(n);for(auto&x:c)cin>>x;
vector<long long>dp(t+1,LLONG_MAX/2);dp[0]=0;
for(long long v=1;v<=t;++v)for(auto x:c)if(x<=v)dp[v]=min(dp[v],dp[v-x]+1);
cout<<(dp[t]>=LLONG_MAX/2?-1:dp[t])<<"\\n";`),
    // Greedy on the largest coin, which is only right for some coin systems.
    wrong: [cpp(`int n;long long t;cin>>n>>t;vector<long long>c(n);for(auto&x:c)cin>>x;
sort(c.rbegin(),c.rend());long long k=0;
for(auto x:c){k+=t/x;t%=x;}cout<<(t==0?k:-1)<<"\\n";`)],
  },
  "cycle-detect-undirected": {
    solution: cpp(`int n,m;cin>>n>>m;vector<int>p(n+1);iota(p.begin(),p.end(),0);
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
bool cyc=false;
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);if(ra==rb)cyc=true;else p[ra]=rb;}
cout<<(cyc?"YES":"NO")<<"\\n";`),
    // Looks for a branching vertex, which is neither necessary nor sufficient.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<int>d(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;d[a]++;d[b]++;}
bool cyc=false;for(int v=1;v<=n;++v)if(d[v]>=3)cyc=true;
cout<<(cyc?"YES":"NO")<<"\\n";`)],
  },
  "inversion-count": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long c=0;
for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)if(a[i]>a[j])c++;cout<<c<<"\\n";`),
    // Only neighbouring pairs.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long c=0;
for(int i=0;i+1<n;++i)if(a[i]>a[i+1])c++;cout<<c<<"\\n";`)],
  },
  "min-path-sum": {
    solution: cpp(`int r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));
for(auto&row:a)for(auto&x:row)cin>>x;
for(int i=0;i<r;++i)for(int j=0;j<c;++j){if(!i&&!j)continue;
 long long best=LLONG_MAX;if(i)best=min(best,a[i-1][j]);if(j)best=min(best,a[i][j-1]);
 a[i][j]+=best;}
cout<<a[r-1][c-1]<<"\\n";`),
    // Greedy step by step, which can walk into a wall of large numbers.
    wrong: [cpp(`int r,c;cin>>r>>c;vector<vector<long long>>a(r,vector<long long>(c));
for(auto&row:a)for(auto&x:row)cin>>x;long long s=a[0][0];int i=0,j=0;
while(i+1<r||j+1<c){
 if(i+1<r&&(j+1>=c||a[i+1][j]<=a[i][j+1]))i++;else j++;s+=a[i][j];}
cout<<s<<"\\n";`)],
  },
  "min-platforms": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n),d(n);
for(int i=0;i<n;++i)cin>>a[i]>>d[i];
sort(a.begin(),a.end());sort(d.begin(),d.end());
int i=0,j=0,cur=0,best=0;
while(i<n){if(a[i]<=d[j]){cur++;i++;best=max(best,cur);}else{cur--;j++;}}
cout<<best<<"\\n";`),
    // Compares every train with the first one only.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n),d(n);
for(int i=0;i<n;++i)cin>>a[i]>>d[i];int best=1;
for(int i=1;i<n;++i)if(a[i]<=d[0])best++;cout<<best<<"\\n";`)],
  },
  "subarray-sum-k": {
    solution: cpp(`long long n,k;cin>>n>>k;unordered_map<long long,long long>seen;
seen[0]=1;long long s=0,c=0,x;
for(long long i=0;i<n;++i){cin>>x;s+=x;auto it=seen.find(s-k);if(it!=seen.end())c+=it->second;seen[s]++;}
cout<<c<<"\\n";`),
    // A sliding window assumes every element is positive.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long s=0,c=0,l=0;
for(long long r=0;r<n;++r){s+=a[r];while(s>k&&l<=r){s-=a[l++];}if(s==k)c++;}
cout<<c<<"\\n";`)],
  },
  "topological-possible": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);vector<int>indeg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);indeg[b]++;}
queue<int>q;for(int v=1;v<=n;++v)if(!indeg[v])q.push(v);int seen=0;
while(!q.empty()){int v=q.front();q.pop();seen++;for(int u:g[v])if(--indeg[u]==0)q.push(u);}
cout<<(seen==n?"YES":"NO")<<"\\n";`),
    // Only self-loops count as a cycle, so a -> b -> a slips through.
    wrong: [cpp(`int n,m;cin>>n>>m;bool bad=false;
for(int i=0;i<m;++i){int a,b;cin>>a>>b;if(a==b)bad=true;}
cout<<(bad?"NO":"YES")<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1700
  "bipartite-check": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>col(n+1,-1);bool ok=true;
for(int s=1;s<=n&&ok;++s)if(col[s]<0){col[s]=0;queue<int>q;q.push(s);
 while(!q.empty()&&ok){int v=q.front();q.pop();
  for(int u:g[v]){if(col[u]<0){col[u]=col[v]^1;q.push(u);}else if(col[u]==col[v]){ok=false;break;}}}}
cout<<(ok?"YES":"NO")<<"\\n";`),
    // Counting edges says nothing about colourability.
    wrong: [cpp(`int n,m;cin>>n>>m;for(int i=0;i<m;++i){int a,b;cin>>a>>b;}
cout<<(m%2==0?"YES":"NO")<<"\\n";`)],
  },
  "candy-distribution": {
    solution: cpp(`int n;cin>>n;vector<long long>r(n),c(n,1);for(auto&x:r)cin>>x;
for(int i=1;i<n;++i)if(r[i]>r[i-1])c[i]=c[i-1]+1;
for(int i=n-2;i>=0;--i)if(r[i]>r[i+1])c[i]=max(c[i],c[i+1]+1);
cout<<accumulate(c.begin(),c.end(),0LL)<<"\\n";`),
    // One pass left to right ignores the neighbour on the other side.
    wrong: [cpp(`int n;cin>>n;vector<long long>r(n),c(n,1);for(auto&x:r)cin>>x;
for(int i=1;i<n;++i)if(r[i]>r[i-1])c[i]=c[i-1]+1;
cout<<accumulate(c.begin(),c.end(),0LL)<<"\\n";`)],
  },
  "coin-ways": {
    solution: cpp(`int n;long long t;cin>>n>>t;vector<long long>c(n);for(auto&x:c)cin>>x;
const long long M=1000000007;vector<long long>dp(t+1,0);dp[0]=1;
for(auto x:c)for(long long v=x;v<=t;++v)dp[v]=(dp[v]+dp[v-x])%M;
cout<<dp[t]<<"\\n";`),
    // Loops swapped, which counts orderings instead of combinations.
    wrong: [cpp(`int n;long long t;cin>>n>>t;vector<long long>c(n);for(auto&x:c)cin>>x;
const long long M=1000000007;vector<long long>dp(t+1,0);dp[0]=1;
for(long long v=1;v<=t;++v)for(auto x:c)if(x<=v)dp[v]=(dp[v]+dp[v-x])%M;
cout<<dp[t]<<"\\n";`)],
  },
  "dsu-queries": {
    solution: cpp(`int n,q;cin>>n>>q;vector<int>p(n+1);iota(p.begin(),p.end(),0);
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
while(q--){int t,a,b;cin>>t>>a>>b;
 if(t==1){int ra=f(a),rb=f(b);if(ra!=rb)p[ra]=rb;}
 else cout<<(f(a)==f(b)?"YES":"NO")<<"\\n";}`),
    // Compares parents rather than roots, so deeper links go unseen.
    wrong: [cpp(`int n,q;cin>>n>>q;vector<int>p(n+1);iota(p.begin(),p.end(),0);
while(q--){int t,a,b;cin>>t>>a>>b;
 if(t==1)p[a]=b;
 else cout<<(p[a]==p[b]||p[a]==b||p[b]==a?"YES":"NO")<<"\\n";}`)],
  },
  "knapsack-01": {
    solution: cpp(`int n;long long W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v;cin>>w>>v;
 for(long long c=W;c>=w;--c)dp[c]=max(dp[c],dp[c-w]+v);}
cout<<dp[W]<<"\\n";`),
    // Ascending capacity turns it into the unbounded knapsack.
    wrong: [cpp(`int n;long long W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v;cin>>w>>v;
 for(long long c=w;c<=W;++c)dp[c]=max(dp[c],dp[c-w]+v);}
cout<<dp[W]<<"\\n";`)],
  },
  "lis-length": {
    solution: cpp(`int n;cin>>n;vector<long long>t;long long x;
for(int i=0;i<n;++i){cin>>x;auto it=lower_bound(t.begin(),t.end(),x);
 if(it==t.end())t.push_back(x);else *it=x;}
cout<<t.size()<<"\\n";`),
    // The longest increasing *contiguous* run — subsequences need not be adjacent.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=1,cur=1;
for(int i=1;i<n;++i){if(a[i]>a[i-1])cur++;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`)],
  },
  "median-stream": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());cout<<a[(n-1)/2]<<"\\n";`),
    // Takes the upper middle on an even count.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());cout<<a[n/2]<<"\\n";`)],
  },
  "min-jumps": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
if(n==1){cout<<0<<"\\n";return 0;}
long long jumps=0,cur=0,far=0;
for(int i=0;i<n-1;++i){far=max(far,(long long)i+a[i]);
 if(i==cur){if(far<=i){cout<<-1<<"\\n";return 0;}jumps++;cur=far;}}
cout<<(cur>=n-1?jumps:-1)<<"\\n";`),
    // Always steps the full distance, which is not always the fewest jumps.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long i=0,j=0;while(i<n-1){if(a[i]==0){cout<<-1<<"\\n";return 0;}i+=a[i];j++;}
cout<<j<<"\\n";`)],
  },
  "modular-inverse": {
    solution: cpp(`long long a,m;cin>>a>>m;long long r=1,b=a%m,e=m-2;
while(e){if(e&1)r=(__int128)r*b%m;b=(__int128)b*b%m;e>>=1;}cout<<r<<"\\n";`),
    // Searches for the inverse one value at a time.
    wrong: [cpp(`long long a,m;cin>>a>>m;
for(long long x=1;x<m;++x)if((__int128)a*x%m==1){cout<<x<<"\\n";return 0;}
cout<<0<<"\\n";`)],
  },
  "tree-subtree-sizes": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);vector<char>vis(n+1,0);
vector<int>st{1};vis[1]=1;
while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);
 for(int u:g[v])if(!vis[u]){vis[u]=1;par[u]=v;st.push_back(u);}}
vector<int>sz(n+1,1);
for(int i=(int)order.size()-1;i>0;--i){int v=order[i];sz[par[v]]+=sz[v];}
int best=0;for(int v=2;v<=n;++v)best=max(best,sz[v]);cout<<best<<"\\n";`),
    // Includes the root, whose subtree is always the whole tree.
    wrong: [cpp(`int n;cin>>n;for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;}cout<<n<<"\\n";`)],
  },
  "water-container": {
    solution: cpp(`int n;cin>>n;vector<long long>h(n);for(auto&x:h)cin>>x;
long long i=0,j=n-1,best=0;
while(i<j){best=max(best,min(h[i],h[j])*(j-i));if(h[i]<h[j])i++;else j--;}
cout<<best<<"\\n";`),
    // Only ever considers the two outermost walls.
    wrong: [cpp(`int n;cin>>n;vector<long long>h(n);for(auto&x:h)cin>>x;
cout<<min(h[0],h[n-1])*(n-1)<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1800
  "binary-answer-split": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long lo=*max_element(a.begin(),a.end()),hi=accumulate(a.begin(),a.end(),0LL);
auto fits=[&](long long cap){long long parts=1,cur=0;
 for(auto x:a){if(cur+x>cap){parts++;cur=x;}else cur+=x;}return parts<=k;};
while(lo<hi){long long mid=lo+(hi-lo)/2;if(fits(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`),
    // The average is a lower bound, not an achievable maximum.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
long long s=accumulate(a.begin(),a.end(),0LL);cout<<(s+k-1)/k<<"\\n";`)],
  },
  "binomial-mod": {
    solution: cpp(`long long n,k;cin>>n>>k;const long long M=1000000007;
if(k<0||k>n){cout<<0<<"\\n";return 0;}
vector<long long>f(n+1,1);for(long long i=1;i<=n;++i)f[i]=f[i-1]*i%M;
auto pw=[&](long long b,long long e){long long r=1;while(e){if(e&1)r=r*b%M;b=b*b%M;e>>=1;}return r;};
cout<<f[n]*pw(f[k]*f[n-k]%M,M-2)%M<<"\\n";`),
    // Pascal's triangle: correct, and quadratic where n reaches 1e5.
    wrong: [cpp(`long long n,k;cin>>n>>k;const long long M=1000000007;
vector<vector<long long>>c(n+1,vector<long long>(n+1,0));
for(long long i=0;i<=n;++i){c[i][0]=1;for(long long j=1;j<=i;++j)c[i][j]=(c[i-1][j-1]+c[i-1][j])%M;}
cout<<c[n][k]<<"\\n";`)],
  },
  "distinct-substrings-small": {
    solution: cpp(`string s;cin>>s;set<string>seen;
for(size_t i=0;i<s.size();++i)for(size_t l=1;i+l<=s.size();++l)seen.insert(s.substr(i,l));
cout<<seen.size()<<"\\n";`),
    // Counts every substring position, duplicates included.
    wrong: [cpp(`string s;cin>>s;long long n=s.size();cout<<n*(n+1)/2<<"\\n";`)],
  },
  "interval-cover": {
    solution: cpp(`long long n,T;cin>>n>>T;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.first>>p.second;sort(v.begin(),v.end());
long long at=0,i=0,used=0;
while(at<T){long long best=at;
 while(i<n&&v[i].first<=at){best=max(best,v[i].second);i++;}
 if(best==at){cout<<-1<<"\\n";return 0;}
 at=best;used++;}
cout<<used<<"\\n";`),
    // Uses everything it was given rather than the fewest that suffice.
    wrong: [cpp(`long long n,T;cin>>n>>T;
for(long long i=0;i<n;++i){long long l,r;cin>>l>>r;}
cout<<n<<"\\n";`)],
  },
  "lcs-length": {
    solution: cpp(`string a,b;cin>>a>>b;int n=a.size(),m=b.size();
vector<int>prev(m+1,0),cur(m+1,0);
for(int i=1;i<=n;++i){for(int j=1;j<=m;++j)
 cur[j]=(a[i-1]==b[j-1])?prev[j-1]+1:max(prev[j],cur[j-1]);
 swap(prev,cur);}
cout<<prev[m]<<"\\n";`),
    // Longest common *substring*, which requires the characters to be adjacent.
    wrong: [cpp(`string a,b;cin>>a>>b;int n=a.size(),m=b.size(),best=0;
vector<int>prev(m+1,0),cur(m+1,0);
for(int i=1;i<=n;++i){for(int j=1;j<=m;++j){
 cur[j]=(a[i-1]==b[j-1])?prev[j-1]+1:0;best=max(best,cur[j]);}
 swap(prev,cur);}
cout<<best<<"\\n";`)],
  },
  "partition-equal": {
    solution: cpp(`int n;cin>>n;vector<int>a(n);int s=0;
for(auto&x:a){cin>>x;s+=x;}
if(s%2){cout<<"NO\\n";return 0;}
vector<char>dp(s/2+1,0);dp[0]=1;
for(int x:a)for(int v=s/2;v>=x;--v)if(dp[v-x])dp[v]=1;
cout<<(dp[s/2]?"YES":"NO")<<"\\n";`),
    // An even total does not mean the halves can be built.
    wrong: [cpp(`int n;cin>>n;int s=0,x;for(int i=0;i<n;++i){cin>>x;s+=x;}
cout<<(s%2==0?"YES":"NO")<<"\\n";`)],
  },
  "subset-sum-exists": {
    solution: cpp(`int n;long long t;cin>>n>>t;vector<long long>a(n);for(auto&x:a)cin>>x;
int h=n/2;vector<long long>L,R;
for(int m=0;m<(1<<h);++m){long long s=0;for(int i=0;i<h;++i)if(m>>i&1)s+=a[i];L.push_back(s);}
for(int m=0;m<(1<<(n-h));++m){long long s=0;for(int i=0;i<n-h;++i)if(m>>i&1)s+=a[h+i];R.push_back(s);}
sort(R.begin(),R.end());
for(long long s:L)if(binary_search(R.begin(),R.end(),t-s)){cout<<"YES\\n";return 0;}
cout<<"NO\\n";`),
    // Confuses "the total is big enough" with "some subset hits it exactly".
    wrong: [cpp(`int n;long long t;cin>>n>>t;long long s=0,x;
for(int i=0;i<n;++i){cin>>x;s+=x;}
cout<<(s>=t?"YES":"NO")<<"\\n";`)],
  },
  "tree-diameter": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
auto bfs=[&](int s){vector<int>d(n+1,-1);queue<int>q;d[s]=0;q.push(s);int far=s;
 while(!q.empty()){int v=q.front();q.pop();if(d[v]>d[far])far=v;
  for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
 return make_pair(far,d[far]);};
auto a=bfs(1);auto b=bfs(a.first);cout<<b.second<<"\\n";`),
    // The depth from node 1, which is only the diameter by luck.
    wrong: [cpp(`int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);int best=0;
while(!q.empty()){int v=q.front();q.pop();best=max(best,d[v]);
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<best<<"\\n";`)],
  },

  // --------------------------------------------------------------- 1900
  "dijkstra-shortest": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n+1);
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;
 g[a].push_back({b,w});g[b].push_back({a,w});}
vector<long long>d(n+1,LLONG_MAX);d[1]=0;
priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>>pq;pq.push({0,1});
while(!pq.empty()){auto[dv,v]=pq.top();pq.pop();if(dv>d[v])continue;
 for(auto&[u,w]:g[v])if(dv+w<d[u]){d[u]=dv+w;pq.push({d[u],u});}}
cout<<(d[n]==LLONG_MAX?-1:d[n])<<"\\n";`),
    // Breadth-first counts edges, not weight.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n+1);
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;
 g[a].push_back({b,w});g[b].push_back({a,w});}
vector<long long>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);
while(!q.empty()){int v=q.front();q.pop();
 for(auto&[u,w]:g[v])if(d[u]<0){d[u]=d[v]+w;q.push(u);}}
cout<<d[n]<<"\\n";`)],
  },
  "edit-distance": {
    solution: cpp(`string a,b;getline(cin,a);getline(cin,b);int n=a.size(),m=b.size();
vector<int>prev(m+1),cur(m+1);
for(int j=0;j<=m;++j)prev[j]=j;
for(int i=1;i<=n;++i){cur[0]=i;
 for(int j=1;j<=m;++j)cur[j]=(a[i-1]==b[j-1])?prev[j-1]:1+min({prev[j-1],prev[j],cur[j-1]});
 swap(prev,cur);}
cout<<prev[m]<<"\\n";`),
    // Counts differing positions, which cannot see an insertion.
    wrong: [cpp(`string a,b;getline(cin,a);getline(cin,b);
int d=llabs((long long)a.size()-(long long)b.size());
for(size_t i=0;i<min(a.size(),b.size());++i)if(a[i]!=b[i])d++;
cout<<d<<"\\n";`)],
  },
  "longest-palindrome-sub": {
    solution: cpp(`string s;cin>>s;int n=s.size();
vector<vector<int>>dp(n,vector<int>(n,0));
for(int i=n-1;i>=0;--i){dp[i][i]=1;
 for(int j=i+1;j<n;++j)dp[i][j]=(s[i]==s[j])?dp[i+1][j-1]+2:max(dp[i+1][j],dp[i][j-1]);}
cout<<dp[0][n-1]<<"\\n";`),
    // The longest palindromic *substring*, which must be contiguous.
    wrong: [cpp(`string s;cin>>s;int n=s.size(),best=1;
for(int c=0;c<n;++c){int i=c,j=c;while(i>=0&&j<n&&s[i]==s[j]){best=max(best,j-i+1);i--;j++;}
 i=c;j=c+1;while(i>=0&&j<n&&s[i]==s[j]){best=max(best,j-i+1);i--;j++;}}
cout<<best<<"\\n";`)],
  },
  "mst-weight": {
    solution: cpp(`int n,m;cin>>n>>m;vector<array<long long,3>>e(m);
for(auto&x:e){cin>>x[1]>>x[2]>>x[0];}
sort(e.begin(),e.end());
vector<int>p(n+1);iota(p.begin(),p.end(),0);
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
long long total=0;int used=0;
for(auto&x:e){int ra=f((int)x[1]),rb=f((int)x[2]);if(ra!=rb){p[ra]=rb;total+=x[0];used++;}}
cout<<(used==n-1?total:-1)<<"\\n";`),
    // Every edge, not a spanning tree's worth of them.
    wrong: [cpp(`int n,m;cin>>n>>m;long long t=0;
for(int i=0;i<m;++i){long long a,b,w;cin>>a>>b>>w;t+=w;}cout<<t<<"\\n";`)],
  },
  "nqueens-count": {
    solution: cpp(`int n;cin>>n;vector<int>col(n,0);long long cnt=0;
function<void(int,int,int,int)>go=[&](int row,int cols,int d1,int d2){
 if(row==n){cnt++;return;}
 for(int c=0;c<n;++c){int b=1<<c,x=1<<(row+c),y=1<<(row-c+n);
  if((cols&b)||(d1&x)||(d2&y))continue;
  go(row+1,cols|b,d1|x,d2|y);}};
go(0,0,0,0);cout<<cnt<<"\\n";`),
    // Every arrangement of columns, ignoring the diagonals.
    wrong: [cpp(`int n;cin>>n;long long f=1;for(int i=2;i<=n;++i)f*=i;cout<<f<<"\\n";`)],
  },
  "trapping-rain": {
    solution: cpp(`int n;cin>>n;vector<long long>h(n);for(auto&x:h)cin>>x;
long long i=0,j=n-1,lm=0,rm=0,total=0;
while(i<j){if(h[i]<h[j]){lm=max(lm,h[i]);total+=lm-h[i];i++;}
 else{rm=max(rm,h[j]);total+=rm-h[j];j--;}}
cout<<total<<"\\n";`),
    // Fills the whole box up to the tallest wall.
    wrong: [cpp(`int n;cin>>n;vector<long long>h(n);for(auto&x:h)cin>>x;
long long mx=*max_element(h.begin(),h.end()),s=0;
for(auto x:h)s+=mx-x;cout<<s<<"\\n";`)],
  },
  "io-echo-sum": {
    solution: cpp(`int n;cin>>n;long long s=0,x;while(n--){cin>>x;s+=x;}cout<<s<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;int s=0,x;while(n--){cin>>x;s+=x;}cout<<s<<"\\n";`)],
  },
  "var-swap": {
    solution: cpp(`long long a,b;cin>>a>>b;cout<<b<<" "<<a<<"\\n";`),
    wrong: [cpp(`long long a,b;cin>>a>>b;cout<<a<<" "<<b<<"\\n";`)],
  },
  "cond-grade": {
    solution: cpp(`int n;cin>>n;cout<<(n>=90?"A":n>=80?"B":n>=70?"C":"D")<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;cout<<(n>90?"A":n>80?"B":n>70?"C":"D")<<"\\n";`)],
  },
  "loop-multiples": {
    solution: cpp(`long long n,k;cin>>n>>k;cout<<n/k<<"\\n";`),
    wrong: [cpp(`long long n,k;cin>>n>>k;cout<<n/k+1<<"\\n";`)],
  },
  "loop-power-table": {
    solution: cpp(`int n;cin>>n;for(int i=0;i<=n;++i)cout<<(1LL<<i)<<(i<n?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;for(int i=0;i<=n;++i)cout<<(1<<i)<<(i<n?" ":"\\n");`)],
  },
  "array-index-query": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int i;cin>>i;cout<<a[i-1]<<"\\n";}`),
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int i;cin>>i;cout<<a[i%n]<<"\\n";}`)],
  },
  "array-count-greater": {
    solution: cpp(`int n;long long x;cin>>n>>x;int c=0;long long v;while(n--){cin>>v;if(v>x)++c;}cout<<c<<"\\n";`),
    wrong: [cpp(`int n;long long x;cin>>n>>x;int c=0;long long v;while(n--){cin>>v;if(v>=x)++c;}cout<<c<<"\\n";`)],
  },
  "string-upper": {
    solution: cpp(`string s;cin>>s;for(auto&c:s)c=toupper(c);cout<<s<<"\\n";`),
    wrong: [cpp(`string s;cin>>s;for(auto&c:s)c=tolower(c);cout<<s<<"\\n";`)],
  },
  "string-count-char": {
    solution: cpp(`string s,t;cin>>s>>t;char c=t[0];int n=0;for(char x:s)if(x==c)++n;cout<<n<<"\\n";`),
    wrong: [cpp(`string s,t;cin>>s>>t;cout<<(int)s.size()<<"\\n";`)],
  },
  "func-min-of-three": {
    solution: cpp(`long long a,b,c;cin>>a>>b>>c;cout<<min(a,min(b,c))<<"\\n";`),
    wrong: [cpp(`long long a,b,c;cin>>a>>b>>c;cout<<min(a,b)<<"\\n";`)],
  },
  "matrix-row-sums": {
    solution: cpp(`int r,c;cin>>r>>c;for(int i=0;i<r;++i){long long s=0,x;for(int j=0;j<c;++j){cin>>x;s+=x;}cout<<s<<(i+1<r?" ":"\\n");}`),
    wrong: [cpp(`int r,c;cin>>r>>c;long long s=0,x;for(int i=0;i<r*c;++i){cin>>x;s+=x;}cout<<s<<"\\n";`)],
  },
  "stl-sort-unique": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());for(size_t i=0;i<a.size();++i)cout<<a[i]<<(i+1<a.size()?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());unique(a.begin(),a.end());for(size_t i=0;i<a.size();++i)cout<<a[i]<<(i+1<a.size()?" ":"\\n");`)],
  },
  "complexity-ops": {
    solution: cpp(`long long n;cin>>n;cout<<n*n<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;cout<<n*n<<"\\n";`)],
  },
  "worst-case-scan": {
    solution: cpp(`long long n;cin>>n;cout<<n<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;cout<<n/2<<"\\n";`)],
  },
  "memory-estimate": {
    solution: cpp(`long long n;cin>>n;cout<<n*4/1024<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;cout<<n*4/1000<<"\\n";`)],
  },
  "amortized-doubling": {
    solution: cpp(`long long n;cin>>n;long long cap=1;int c=0;while(cap<n){cap*=2;++c;}cout<<c<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;long long cap=1;int c=1;while(cap<n){cap*=2;++c;}cout<<c<<"\\n";`)],
  },
  "constraint-pick": {
    solution: cpp(`long long n;cin>>n;cout<<((n*n<=100000000LL)?1:0)<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;cout<<((n*n<100000000LL)?1:0)<<"\\n";`)],
  },
  "log-steps": {
    solution: cpp(`long long n;cin>>n;int c=0;while(n>1){n/=2;++c;}cout<<c<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;cout<<(long long)log2((double)n)+1<<"\\n";`)],
  },
  "stack-postfix": {
    solution: cpp(`string t;vector<long long>st;while(cin>>t){if(t=="+"||t=="-"||t=="*"){long long b=st.back();st.pop_back();long long a=st.back();st.pop_back();st.push_back(t=="+"?a+b:t=="-"?a-b:a*b);}else st.push_back(stoll(t));}cout<<st.back()<<"\\n";`),
    wrong: [cpp(`string t;vector<long long>st;while(cin>>t){if(t=="+"||t=="-"||t=="*"){long long a=st.back();st.pop_back();long long b=st.back();st.pop_back();st.push_back(t=="+"?a+b:t=="-"?a-b:a*b);}else st.push_back(stoll(t));}cout<<st.back()<<"\\n";`)],
  },
  "queue-rotate": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;k%=n;for(long long i=0;i<n;++i)cout<<a[(i+k)%n]<<(i+1<n?" ":"\\n");`),
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;for(long long i=0;i<n;++i)cout<<a[(i+1)%n]<<(i+1<n?" ":"\\n");`)],
  },
  "deque-window-min": {
    solution: cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;deque<int>d;string out;for(int i=0;i<n;++i){while(!d.empty()&&a[d.back()]>=a[i])d.pop_back();d.push_back(i);if(d.front()<=i-k)d.pop_front();if(i>=k-1)out+=to_string(a[d.front()])+" ";}out.pop_back();cout<<out<<"\\n";`),
    wrong: [cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;deque<int>d;string out;for(int i=0;i<n;++i){while(!d.empty()&&a[d.back()]>=a[i])d.pop_back();d.push_back(i);if(i>=k-1)out+=to_string(a[d.front()])+" ";}out.pop_back();cout<<out<<"\\n";`)],
  },
  "heap-merge-cost": {
    solution: cpp(`int n;cin>>n;priority_queue<long long,vector<long long>,greater<long long>>q;for(int i=0;i<n;++i){long long x;cin>>x;q.push(x);}long long t=0;while(q.size()>1){long long a=q.top();q.pop();long long b=q.top();q.pop();t+=a+b;q.push(a+b);}cout<<t<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;priority_queue<long long>q;for(int i=0;i<n;++i){long long x;cin>>x;q.push(x);}long long t=0;while(q.size()>1){long long a=q.top();q.pop();long long b=q.top();q.pop();t+=a+b;q.push(a+b);}cout<<t<<"\\n";`)],
  },
  "set-missing-smallest": {
    solution: cpp(`int n;cin>>n;set<long long>s;for(int i=0;i<n;++i){long long x;cin>>x;s.insert(x);}long long k=1;while(s.count(k))++k;cout<<k<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;for(int i=0;i<n;++i){long long x;cin>>x;}cout<<n+1<<"\\n";`)],
  },
  "map-word-freq": {
    solution: cpp(`map<string,int>c;string w;while(cin>>w)++c[w];int best=0;string ans;for(auto&p:c)if(p.second>best){best=p.second;ans=p.first;}cout<<ans<<"\\n";`),
    wrong: [cpp(`map<string,int>c;string w;while(cin>>w)++c[w];int best=0;string ans;for(auto&p:c)if(p.second>=best){best=p.second;ans=p.first;}cout<<ans<<"\\n";`)],
  },
  "prefix-2d-sum": {
    solution: cpp(`int r,c;cin>>r>>c;vector<vector<long long>>g(r,vector<long long>(c));for(auto&row:g)for(auto&x:row)cin>>x;int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;long long s=0;for(int i=r1-1;i<r2;++i)for(int j=c1-1;j<c2;++j)s+=g[i][j];cout<<s<<"\\n";`),
    wrong: [cpp(`int r,c;cin>>r>>c;vector<vector<long long>>g(r,vector<long long>(c));for(auto&row:g)for(auto&x:row)cin>>x;int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;long long s=0;for(int i=r1-1;i<r2-1;++i)for(int j=c1-1;j<c2-1;++j)s+=g[i][j];cout<<s<<"\\n";`)],
  },
  "dsu-largest-set": {
    solution: cpp(`int n,m;cin>>n>>m;vector<int>p(n+1),sz(n+1,1);for(int i=0;i<=n;++i)p[i]=i;function<int(int)>f=[&](int x){while(p[x]!=x)x=p[x]=p[p[x]];return x;};for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}int best=0;for(int v=1;v<=n;++v)best=max(best,sz[f(v)]);cout<<best<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<int>p(n+1);for(int i=0;i<=n;++i)p[i]=i;function<int(int)>f=[&](int x){while(p[x]!=x)x=p[x]=p[p[x]];return x;};int c=0;for(int i=0;i<m;++i){int a,b;cin>>a>>b;if(f(a)!=f(b)){p[f(a)]=f(b);++c;}}cout<<c+1<<"\\n";`)],
  },
  "bit-fenwick-sum": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int t;cin>>t;if(t==1){int i;long long x;cin>>i>>x;a[i-1]+=x;}else{int l,r;cin>>l>>r;long long s=0;for(int i=l-1;i<r;++i)s+=a[i];cout<<s<<"\\n";}}`),
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int t;cin>>t;if(t==1){int i;long long x;cin>>i>>x;a[i-1]=x;}else{int l,r;cin>>l>>r;long long s=0;for(int i=l-1;i<r;++i)s+=a[i];cout<<s<<"\\n";}}`)],
  },
  "graph-degree-max": {
    solution: cpp(`int n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[a];++d[b];}int best=1;for(int v=2;v<=n;++v)if(d[v]>d[best])best=v;cout<<best<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[a];++d[b];}int best=1;for(int v=2;v<=n;++v)if(d[v]>=d[best])best=v;cout<<best<<"\\n";`)],
  },
  "graph-path-exists": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}int u,v;cin>>u>>v;vector<char>s(n+1,0);vector<int>st{u};s[u]=1;while(!st.empty()){int x=st.back();st.pop_back();for(int y:g[x])if(!s[y]){s[y]=1;st.push_back(y);}}cout<<(s[v]?"YES":"NO")<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);}int u,v;cin>>u>>v;vector<char>s(n+1,0);vector<int>st{u};s[u]=1;while(!st.empty()){int x=st.back();st.pop_back();for(int y:g[x])if(!s[y]){s[y]=1;st.push_back(y);}}cout<<(s[v]?"YES":"NO")<<"\\n";`)],
  },
  "graph-count-edges-tree": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}if(m!=n-1){cout<<"NO\\n";return 0;}vector<char>s(n+1,0);vector<int>st{1};s[1]=1;int c=1;while(!st.empty()){int x=st.back();st.pop_back();for(int y:g[x])if(!s[y]){s[y]=1;++c;st.push_back(y);}}cout<<(c==n?"YES":"NO")<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;for(int i=0;i<m;++i){int a,b;cin>>a>>b;}cout<<(m==n-1?"YES":"NO")<<"\\n";`)],
  },
  "grid-count-islands": {
    solution: cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;int n=0;for(int y=0;y<r;++y)for(int x=0;x<c;++x){if(g[y][x]!=35)continue;++n;vector<pair<int,int>>st{{y,x}};g[y][x]=46;while(!st.empty()){auto[cy,cx]=st.back();st.pop_back();int dy[]={1,-1,0,0},dx[]={0,0,1,-1};for(int k=0;k<4;++k){int ny=cy+dy[k],nx=cx+dx[k];if(ny>=0&&ny<r&&nx>=0&&nx<c&&g[ny][nx]==35){g[ny][nx]=46;st.push_back({ny,nx});}}}}cout<<n<<"\\n";`),
    wrong: [cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;int n=0;for(int y=0;y<r;++y)for(int x=0;x<c;++x)if(g[y][x]==35)++n;cout<<n<<"\\n";`)],
  },
  "graph-farthest": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}int best=0;for(int v=1;v<=n;++v)best=max(best,d[v]);cout<<best<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,0);queue<int>q;vector<char>s(n+1,0);s[1]=1;q.push(1);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(!s[u]){s[u]=1;d[u]=d[v]+1;q.push(u);}}cout<<d[n]<<"\\n";`)],
  },
  "graph-indegree-zero": {
    solution: cpp(`int n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[b];}string out;for(int v=1;v<=n;++v)if(d[v]==0)out+=to_string(v)+" ";if(out.empty())cout<<"-1\\n";else{out.pop_back();cout<<out<<"\\n";}`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[a];}string out;for(int v=1;v<=n;++v)if(d[v]==0)out+=to_string(v)+" ";if(out.empty())cout<<"-1\\n";else{out.pop_back();cout<<out<<"\\n";}`)],
  },
  "graph-bfs-bipartite-sides": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>col(n+1,0);long long c0=0,c1=0;for(int s=1;s<=n;++s){if(col[s])continue;col[s]=1;++c0;queue<int>q;q.push(s);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v]){if(col[u]==col[v]){cout<<"-1\\n";return 0;}if(!col[u]){col[u]=-col[v];if(col[u]==1)++c0;else ++c1;q.push(u);}}}}cout<<max(c0,c1)<<" "<<min(c0,c1)<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>col(n+1,0);long long c0=0,c1=0;for(int s=1;s<=n;++s){if(col[s])continue;col[s]=1;++c0;queue<int>q;q.push(s);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v]){if(col[u]==col[v]){cout<<"-1\\n";return 0;}if(!col[u]){col[u]=-col[v];if(col[u]==1)++c0;else ++c1;q.push(u);}}}}cout<<c1<<" "<<c0<<"\\n";`)],
  },
  "graph-weight-total": {
    solution: cpp(`int n,m;cin>>n>>m;long long s=0;for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;s+=w;}cout<<s<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;int s=0;for(int i=0;i<m;++i){int a,b,w;cin>>a>>b>>w;s+=w;}cout<<s<<"\\n";`)],
  },
  "dijkstra-all-dist": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n+1);for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back({b,w});g[b].push_back({a,w});}const long long INF=(long long)4e18;vector<long long>d(n+1,INF);d[1]=0;priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>>q;q.push({0,1});while(!q.empty()){auto[cur,v]=q.top();q.pop();if(cur>d[v])continue;for(auto[u,w]:g[v])if(cur+w<d[u]){d[u]=cur+w;q.push({d[u],u});}}for(int v=1;v<=n;++v)cout<<(d[v]<INF?d[v]:-1)<<(v<n?" ":"\\n");`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back(b);g[b].push_back(a);}vector<long long>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}for(int v=1;v<=n;++v)cout<<d[v]<<(v<n?" ":"\\n");`)],
  },
  "sort-descending": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`)],
  },
  "sort-abs": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end(),[](long long x,long long y){return llabs(x)!=llabs(y)?llabs(x)<llabs(y):x<y;});for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end(),[](long long x,long long y){return llabs(x)>llabs(y);});for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`)],
  },
  "sort-anagram-group": {
    solution: cpp(`int n;cin>>n;set<string>s;while(n--){string w;cin>>w;sort(w.begin(),w.end());s.insert(w);}cout<<s.size()<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;set<string>s;while(n--){string w;cin>>w;s.insert(w);}cout<<s.size()<<"\\n";`)],
  },
  "sort-median-pairs": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long best=LLONG_MAX;for(int i=0;i+1<n;++i)best=min(best,a[i+1]-a[i]);cout<<best<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long best=LLONG_MAX;for(int i=0;i+1<n;++i)best=min(best,llabs(a[i+1]-a[i]));cout<<best<<"\\n";`)],
  },
  "sort-count-pairs-less": {
    solution: cpp(`int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long c=0;int i=0,j=n-1;while(i<j){if(a[i]+a[j]<k){c+=j-i;++i;}else --j;}cout<<c<<"\\n";`),
    wrong: [cpp(`int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());long long c=0;int i=0,j=n-1;while(i<j){if(a[i]+a[j]<=k){c+=j-i;++i;}else --j;}cout<<c<<"\\n";`)],
  },
  "sort-relative-order": {
    solution: cpp(`int n,m;cin>>n>>m;vector<long long>a(n),o(m);for(auto&x:a)cin>>x;for(auto&x:o)cin>>x;map<long long,int>rk;for(int i=0;i<m;++i)rk[o[i]]=i;stable_sort(a.begin(),a.end(),[&](long long x,long long y){int rx=rk.count(x)?rk[x]:m,ry=rk.count(y)?rk[y]:m;if(rx!=ry)return rx<ry;if(rx==m)return x<y;return false;});for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<long long>a(n),o(m);for(auto&x:a)cin>>x;for(auto&x:o)cin>>x;map<long long,int>rk;for(int i=0;i<m;++i)rk[o[i]]=i;stable_sort(a.begin(),a.end(),[&](long long x,long long y){int rx=rk.count(x)?rk[x]:m,ry=rk.count(y)?rk[y]:m;return rx<ry;});for(int i=0;i<n;++i)cout<<a[i]<<(i+1<n?" ":"\\n");`)],
  },
  "sort-kth-smallest": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());while(q--){int k;cin>>k;cout<<a[k-1]<<"\\n";}`),
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.rbegin(),a.rend());while(q--){int k;cin>>k;cout<<a[k-1]<<"\\n";}`)],
  },
  "sort-by-length": {
    solution: cpp(`int n;cin>>n;vector<string>w(n);for(auto&s:w)cin>>s;sort(w.begin(),w.end(),[](const string&a,const string&b){return a.size()!=b.size()?a.size()<b.size():a<b;});for(int i=0;i<n;++i)cout<<w[i]<<(i+1<n?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;vector<string>w(n);for(auto&s:w)cin>>s;sort(w.begin(),w.end());for(int i=0;i<n;++i)cout<<w[i]<<(i+1<n?" ":"\\n");`)],
  },
  "greedy-coin-canonical": {
    solution: cpp(`long long n;cin>>n;int v[]={100,50,20,10,5,2,1};long long c=0;for(int x:v){c+=n/x;n%=x;}cout<<c<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;int v[]={100,50,10,5,2,1};long long c=0;for(int x:v){c+=n/x;n%=x;}cout<<c<<"\\n";`)],
  },
  "greedy-min-jumps-fuel": {
    solution: cpp(`int n;long long c;cin>>n>>c;vector<long long>g(n);for(auto&x:g)cin>>x;long long fuel=c;int stops=0;for(long long x:g){if(x>c){cout<<"-1\\n";return 0;}if(fuel<x){++stops;fuel=c;}fuel-=x;}cout<<stops<<"\\n";`),
    wrong: [cpp(`int n;long long c;cin>>n>>c;vector<long long>g(n);for(auto&x:g)cin>>x;long long fuel=c;int stops=0;for(long long x:g){if(x>c){cout<<"-1\\n";return 0;}if(fuel<c){++stops;fuel=c;}fuel-=x;}cout<<stops<<"\\n";`)],
  },
  "greedy-max-pairs": {
    solution: cpp(`int n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;sort(a.begin(),a.end());sort(b.begin(),b.end());int i=0,c=0;for(long long v:b)if(i<n&&a[i]<v){++c;++i;}cout<<c<<"\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;sort(a.begin(),a.end());sort(b.begin(),b.end());int i=0,c=0;for(long long v:b)if(i<n&&a[i]<=v){++c;++i;}cout<<c<<"\\n";`)],
  },
  "greedy-remove-digits": {
    solution: cpp(`string s;int k;cin>>s>>k;string st;for(char ch:s){while(k&&!st.empty()&&st.back()>ch){st.pop_back();--k;}st.push_back(ch);}while(k--)st.pop_back();int i=0;while(i+1<(int)st.size()&&st[i]==48)++i;string r=st.substr(i);if(r.empty()||r=="0")cout<<"0\\n";else cout<<r<<"\\n";`),
    wrong: [cpp(`string s;int k;cin>>s>>k;string r=s.substr(k);if(r.empty())cout<<"0\\n";else cout<<r<<"\\n";`)],
  },
  "greedy-station-cover": {
    solution: cpp(`int n;long long r;cin>>n>>r;vector<long long>h(n);for(auto&x:h)cin>>x;sort(h.begin(),h.end());int c=0,k=0;while(k<n){++c;long long reach=h[k]+2*r;while(k<n&&h[k]<=reach)++k;}cout<<c<<"\\n";`),
    wrong: [cpp(`int n;long long r;cin>>n>>r;vector<long long>h(n);for(auto&x:h)cin>>x;sort(h.begin(),h.end());int c=0,k=0;while(k<n){++c;long long reach=h[k]+r;while(k<n&&h[k]<=reach)++k;}cout<<c<<"\\n";`)],
  },
  "greedy-max-events": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);for(auto&p:v){cin>>p.second>>p.first;}sort(v.begin(),v.end());long long end=LLONG_MIN;int c=0;for(auto&p:v)if(p.second>end){++c;end=p.first;}cout<<c<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);for(auto&p:v){cin>>p.first>>p.second;}sort(v.begin(),v.end());long long end=LLONG_MIN;int c=0;for(auto&p:v)if(p.first>end){++c;end=p.second;}cout<<c<<"\\n";`)],
  },
  "bs-count-occurrences": {
    solution: cpp(`int n;long long x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;cout<<(upper_bound(a.begin(),a.end(),x)-lower_bound(a.begin(),a.end(),x))<<"\\n";`),
    wrong: [cpp(`int n;long long x;cin>>n>>x;vector<long long>a(n);for(auto&v:a)cin>>v;cout<<(lower_bound(a.begin(),a.end(),x)-lower_bound(a.begin(),a.end(),x))<<"\\n";`)],
  },
  "bs-rotated-min": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int lo=0,hi=n-1;while(lo<hi){int mid=(lo+hi)/2;if(a[mid]>a[hi])lo=mid+1;else hi=mid;}cout<<a[lo]<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int lo=0,hi=n-1;while(lo<hi){int mid=(lo+hi)/2;if(a[mid]>a[lo])lo=mid+1;else hi=mid;}cout<<a[lo]<<"\\n";`)],
  },
  "bs-max-min-distance": {
    solution: cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());auto ok=[&](long long d){int c=1;long long last=a[0];for(int i=1;i<n;++i)if(a[i]-last>=d){++c;last=a[i];}return c>=k;};long long lo=0,hi=a[n-1]-a[0];while(lo<hi){long long mid=(lo+hi+1)/2;if(ok(mid))lo=mid;else hi=mid-1;}cout<<lo<<"\\n";`),
    wrong: [cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;auto ok=[&](long long d){int c=1;long long last=a[0];for(int i=1;i<n;++i)if(a[i]-last>=d){++c;last=a[i];}return c>=k;};long long lo=0,hi=4000000000LL;while(lo<hi){long long mid=(lo+hi+1)/2;if(ok(mid))lo=mid;else hi=mid-1;}cout<<lo<<"\\n";`)],
  },
  "bs-first-bad": {
    solution: cpp(`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;for(int i=0;i<n;++i)if(a[i]==1){cout<<i+1<<"\\n";return 0;}cout<<"-1\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;int ans=-1;for(int i=0;i<n;++i)if(a[i]==1)ans=i+1;cout<<ans<<"\\n";`)],
  },
  "bs-sqrt-real": {
    solution: cpp(`double x;cin>>x;double lo=-100000,hi=100000;for(int i=0;i<300;++i){double mid=(lo+hi)/2;if(mid*mid*mid<x)lo=mid;else hi=mid;}double r=(lo+hi)/2;if(fabs(r)<5e-7)r=0.0;cout<<fixed<<setprecision(6)<<r<<"\\n";`),
    wrong: [cpp(`double x;cin>>x;cout<<fixed<<setprecision(6)<<pow(x,1.0/3)<<"\\n";`)],
  },
  "bs-min-capacity": {
    solution: cpp(`int n,d;cin>>n>>d;vector<long long>w(n);for(auto&x:w)cin>>x;auto days=[&](long long cap){int c=1;long long cur=0;for(long long x:w){if(cur+x>cap){++c;cur=x;}else cur+=x;}return c;};long long lo=*max_element(w.begin(),w.end()),hi=0;for(long long x:w)hi+=x;while(lo<hi){long long mid=(lo+hi)/2;if(days(mid)<=d)hi=mid;else lo=mid+1;}cout<<lo<<"\\n";`),
    wrong: [cpp(`int n,d;cin>>n>>d;vector<long long>w(n);for(auto&x:w)cin>>x;long long s=0;for(long long x:w)s+=x;cout<<(s+d-1)/d<<"\\n";`)],
  },
  "bs-peak-ternary": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;int lo=0,hi=n-1;while(lo<hi){int mid=(lo+hi)/2;if(a[mid]<a[mid+1])lo=mid+1;else hi=mid;}cout<<a[lo]<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;cout<<a[n/2]<<"\\n";`)],
  },
  "point-in-rect": {
    solution: cpp(`long long x1,y1,x2,y2,px,py;cin>>x1>>y1>>x2>>y2>>px>>py;bool in=px>=min(x1,x2)&&px<=max(x1,x2)&&py>=min(y1,y2)&&py<=max(y1,y2);cout<<(in?"YES":"NO")<<"\\n";`),
    wrong: [cpp(`long long x1,y1,x2,y2,px,py;cin>>x1>>y1>>x2>>y2>>px>>py;bool in=px>min(x1,x2)&&px<max(x1,x2)&&py>min(y1,y2)&&py<max(y1,y2);cout<<(in?"YES":"NO")<<"\\n";`)],
  },
  "geo-distance-int": {
    solution: cpp(`long long x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;long long dx=x1-x2,dy=y1-y2;cout<<dx*dx+dy*dy<<"\\n";`),
    wrong: [cpp(`int x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;int dx=x1-x2,dy=y1-y2;cout<<(long long)(dx*dx+dy*dy)<<"\\n";`)],
  },
  "geo-collinear": {
    solution: cpp(`long long x1,y1,x2,y2,x3,y3;cin>>x1>>y1>>x2>>y2>>x3>>y3;cout<<(((x2-x1)*(y3-y1)-(x3-x1)*(y2-y1))==0?"YES":"NO")<<"\\n";`),
    wrong: [cpp(`double x1,y1,x2,y2,x3,y3;cin>>x1>>y1>>x2>>y2>>x3>>y3;cout<<(fabs((y2-y1)/(x2-x1)-(y3-y1)/(x3-x1))<1e-9?"YES":"NO")<<"\\n";`)],
  },
  "geo-rect-overlap": {
    solution: cpp(`long long a[4],b[4];for(int i=0;i<4;++i)cin>>a[i];for(int i=0;i<4;++i)cin>>b[i];long long ax1=min(a[0],a[2]),ay1=min(a[1],a[3]),ax2=max(a[0],a[2]),ay2=max(a[1],a[3]);long long bx1=min(b[0],b[2]),by1=min(b[1],b[3]),bx2=max(b[0],b[2]),by2=max(b[1],b[3]);cout<<((ax1<bx2&&bx1<ax2&&ay1<by2&&by1<ay2)?"YES":"NO")<<"\\n";`),
    wrong: [cpp(`long long a[4],b[4];for(int i=0;i<4;++i)cin>>a[i];for(int i=0;i<4;++i)cin>>b[i];long long ax1=min(a[0],a[2]),ay1=min(a[1],a[3]),ax2=max(a[0],a[2]),ay2=max(a[1],a[3]);long long bx1=min(b[0],b[2]),by1=min(b[1],b[3]),bx2=max(b[0],b[2]),by2=max(b[1],b[3]);cout<<((ax1<=bx2&&bx1<=ax2&&ay1<=by2&&by1<=ay2)?"YES":"NO")<<"\\n";`)],
  },
  "geo-manhattan-circle": {
    solution: cpp(`int n;long long r;cin>>n>>r;int c=0;for(int i=0;i<n;++i){long long x,y;cin>>x>>y;if(x*x+y*y<=r*r)++c;}cout<<c<<"\\n";`),
    wrong: [cpp(`int n;long long r;cin>>n>>r;int c=0;for(int i=0;i<n;++i){long long x,y;cin>>x>>y;if(llabs(x)+llabs(y)<=r)++c;}cout<<c<<"\\n";`)],
  },
  "polygon-area2": {
    solution: cpp(`int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];long long s=0;for(int i=0;i<n;++i){int j=(i+1)%n;s+=x[i]*y[j]-x[j]*y[i];}cout<<llabs(s)<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];long long s=0;for(int i=0;i+1<n;++i)s+=x[i]*y[i+1]-x[i+1]*y[i];cout<<llabs(s)<<"\\n";`)],
  },
  "geo-perimeter": {
    solution: cpp(`int n;cin>>n;vector<double>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];double t=0;for(int i=0;i<n;++i){int j=(i+1)%n;t+=hypot(x[j]-x[i],y[j]-y[i]);}cout<<fixed<<setprecision(6)<<t<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<double>x(n),y(n);for(int i=0;i<n;++i)cin>>x[i]>>y[i];double t=0;for(int i=0;i+1<n;++i)t+=hypot(x[i+1]-x[i],y[i+1]-y[i]);cout<<fixed<<setprecision(6)<<t<<"\\n";`)],
  },
  "geo-grid-lattice": {
    solution: cpp(`long long x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;if(x1==x2&&y1==y2){cout<<"0\\n";return 0;}cout<<gcd(llabs(x2-x1),llabs(y2-y1))-1<<"\\n";`),
    wrong: [cpp(`long long x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;if(x1==x2&&y1==y2){cout<<"0\\n";return 0;}cout<<gcd(llabs(x2-x1),llabs(y2-y1))<<"\\n";`)],
  },
  "convex-hull-size": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);for(auto&q:p)cin>>q.first>>q.second;sort(p.begin(),p.end());auto cr=[](auto&O,auto&A,auto&B){return (A.first-O.first)*(B.second-O.second)-(A.second-O.second)*(B.first-O.first);};auto half=[&](vector<pair<long long,long long>>v){vector<pair<long long,long long>>h;for(auto&q:v){while(h.size()>=2&&cr(h[h.size()-2],h[h.size()-1],q)<=0)h.pop_back();h.push_back(q);}return h;};auto lo=half(p);vector<pair<long long,long long>>rp(p.rbegin(),p.rend());auto hi=half(rp);int sz=(int)lo.size()-1+(int)hi.size()-1;cout<<(sz>=3?sz:2)<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);for(auto&q:p)cin>>q.first>>q.second;sort(p.begin(),p.end());auto cr=[](auto&O,auto&A,auto&B){return (A.first-O.first)*(B.second-O.second)-(A.second-O.second)*(B.first-O.first);};auto half=[&](vector<pair<long long,long long>>v){vector<pair<long long,long long>>h;for(auto&q:v){while(h.size()>=2&&cr(h[h.size()-2],h[h.size()-1],q)<0)h.pop_back();h.push_back(q);}return h;};auto lo=half(p);vector<pair<long long,long long>>rp(p.rbegin(),p.rend());auto hi=half(rp);int sz=(int)lo.size()-1+(int)hi.size()-1;cout<<(sz>=3?sz:2)<<"\\n";`)],
  },
  "tree-height": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);int best=0;while(!q.empty()){int v=q.front();q.pop();best=max(best,d[v]);for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}cout<<best<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);int best=0;while(!q.empty()){int v=q.front();q.pop();best=max(best,d[v]);for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}cout<<best+1<<"\\n";`)],
  },
  "tree-parent-depth": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}for(int v=1;v<=n;++v)cout<<d[v]<<(v<n?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,-1);queue<int>q;d[n]=0;q.push(n);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}for(int v=1;v<=n;++v)cout<<d[v]<<(v<n?" ":"\\n");`)],
  },
  "tree-count-paths-len2": {
    solution: cpp(`int n;cin>>n;vector<long long>d(n+1,0);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;++d[a];++d[b];}long long s=0;for(int v=1;v<=n;++v)s+=d[v]*(d[v]-1)/2;cout<<s<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>d(n+1,0);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;++d[a];++d[b];}long long s=0;for(int v=1;v<=n;++v)s+=d[v];cout<<s<<"\\n";`)],
  },
  "tree-sum-subtree": {
    solution: cpp(`int n;cin>>n;vector<long long>val(n+1);for(int i=1;i<=n;++i)cin>>val[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>par(n+1,0),order;vector<char>seen(n+1,0);vector<int>st{1};seen[1]=1;while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}vector<long long>s(n+1);for(int v=1;v<=n;++v)s[v]=val[v];for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];if(par[v])s[par[v]]+=s[v];}for(int v=1;v<=n;++v)cout<<s[v]<<(v<n?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;vector<long long>val(n+1);for(int i=1;i<=n;++i)cin>>val[i];for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;}for(int v=1;v<=n;++v)cout<<val[v]<<(v<n?" ":"\\n");`)],
  },
  "tree-centroid": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>par(n+1,0),order,sz(n+1,1);vector<char>seen(n+1,0);vector<int>st{1};seen[1]=1;while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];if(par[v])sz[par[v]]+=sz[v];}int best=n+1,bv=1;for(int v=1;v<=n;++v){int worst=n-sz[v];for(int u:g[v])if(u!=par[v])worst=max(worst,sz[u]);if(worst<best||(worst==best&&v<bv)){best=worst;bv=v;}}cout<<bv<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<int>d(n+1,0);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;++d[a];++d[b];}int bv=1;for(int v=2;v<=n;++v)if(d[v]>d[bv])bv=v;cout<<bv<<"\\n";`)],
  },
  "tree-is-balanced": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>par(n+1,0),order,h(n+1,0);vector<char>seen(n+1,0);vector<int>st{1};seen[1]=1;while(!st.empty()){int v=st.back();st.pop_back();order.push_back(v);for(int u:g[v])if(!seen[u]){seen[u]=1;par[u]=v;st.push_back(u);}}bool ok=true;for(int i=(int)order.size()-1;i>=0;--i){int v=order[i];vector<int>ch;for(int u:g[v])if(u!=par[v])ch.push_back(h[u]);if(ch.size()>1){int mx=*max_element(ch.begin(),ch.end()),mn=*min_element(ch.begin(),ch.end());if(mx-mn>1)ok=false;}h[v]=1+(ch.empty()?0:*max_element(ch.begin(),ch.end()));}if(ok)for(int v:order){vector<int>ch;for(int u:g[v])if(u!=par[v])ch.push_back(h[u]);if(ch.size()==1&&ch[0]>1)ok=false;}cout<<(ok?"YES":"NO")<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<int>d(n+1,0);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;++d[a];++d[b];}cout<<(d[1]>1?"YES":"NO")<<"\\n";`)],
  },
  "str-longest-common-prefix": {
    solution: cpp(`int n;cin>>n;vector<string>w(n);for(auto&s:w)cin>>s;string p=w[0];for(int i=1;i<n;++i){while(w[i].compare(0,p.size(),p)!=0)p.pop_back();}cout<<(p.empty()?"-":p)<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<string>w(n);for(auto&s:w)cin>>s;size_t m=w[0].size();for(auto&s:w)m=min(m,s.size());string p=w[0].substr(0,m);cout<<(p.empty()?"-":p)<<"\\n";`)],
  },
  "str-reverse-words": {
    solution: cpp(`vector<string>w;string t;while(cin>>t)w.push_back(t);for(int i=(int)w.size()-1;i>=0;--i)cout<<w[i]<<(i?" ":"\\n");`),
    wrong: [cpp(`vector<string>w;string t;while(cin>>t)w.push_back(t);string s;for(size_t i=0;i<w.size();++i)s+=w[i]+(i+1<w.size()?" ":"");reverse(s.begin(),s.end());cout<<s<<"\\n";`)],
  },
  "merge-sort-manual": {
    solution: cpp(`int n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;vector<long long>c;c.reserve(n+m);merge(a.begin(),a.end(),b.begin(),b.end(),back_inserter(c));for(size_t i=0;i<c.size();++i)cout<<c[i]<<(i+1<c.size()?" ":"\\n");`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;for(long long x:b)a.push_back(x);for(size_t i=0;i<a.size();++i)cout<<a[i]<<(i+1<a.size()?" ":"\\n");`)],
  },
  "bucket-by-key": {
    solution: cpp(`int n;cin>>n;vector<pair<int,int>>v(n);for(auto&p:v)cin>>p.first>>p.second;sort(v.begin(),v.end(),[](auto&a,auto&b){return a.second!=b.second?a.second>b.second:a.first<b.first;});for(int i=0;i<n;++i)cout<<v[i].first<<(i+1<n?" ":"\\n");`),
    wrong: [cpp(`int n;cin>>n;vector<pair<int,int>>v(n);for(auto&p:v)cin>>p.first>>p.second;stable_sort(v.begin(),v.end(),[](auto&a,auto&b){return a.second>b.second;});for(int i=0;i<n;++i)cout<<v[i].first<<(i+1<n?" ":"\\n");`)],
  },
  "bt-generate-binary": {
    solution: cpp(`int n;cin>>n;cout<<(1LL<<n)<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;cout<<(1LL<<(n-1))<<"\\n";`)],
  },
  "bt-no-adjacent-ones": {
    solution: cpp(`int n;cin>>n;long long a=1,b=2;for(int i=1;i<n;++i){long long c=a+b;a=b;b=c;}cout<<b<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;cout<<(1LL<<n)<<"\\n";`)],
  },
  "bt-sudoku-row": {
    solution: cpp(`int z=0;for(int i=0;i<9;++i){int x;cin>>x;if(x==0)++z;}long long f=1;for(int i=2;i<=z;++i)f*=i;cout<<f<<"\\n";`),
    wrong: [cpp(`int z=0;for(int i=0;i<9;++i){int x;cin>>x;if(x==0)++z;}cout<<z<<"\\n";`)],
  },
  "bt-string-permutations": {
    solution: cpp(`string s;cin>>s;int c[26]={0};for(char ch:s)++c[ch-97];long long f=1;for(int i=2;i<=(int)s.size();++i)f*=i;for(int i=0;i<26;++i){long long g=1;for(int j=2;j<=c[i];++j)g*=j;f/=g;}cout<<f<<"\\n";`),
    wrong: [cpp(`string s;cin>>s;long long f=1;for(int i=2;i<=(int)s.size();++i)f*=i;cout<<f<<"\\n";`)],
  },
  "bt-count-paths-grid": {
    solution: cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;vector<vector<long long>>dp(r,vector<long long>(c,0));for(int y=0;y<r;++y)for(int x=0;x<c;++x){if(g[y][x]==35)continue;if(!y&&!x)dp[y][x]=1;else dp[y][x]=(y?dp[y-1][x]:0)+(x?dp[y][x-1]:0);}cout<<dp[r-1][c-1]<<"\\n";`),
    wrong: [cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;vector<vector<long long>>dp(r,vector<long long>(c,0));for(int y=0;y<r;++y)for(int x=0;x<c;++x){if(!y&&!x)dp[y][x]=1;else dp[y][x]=(y?dp[y-1][x]:0)+(x?dp[y][x-1]:0);}cout<<dp[r-1][c-1]<<"\\n";`)],
  },
  "bt-sum-combinations": {
    solution: cpp(`int n,k;cin>>n>>k;vector<long long>dp(n+1,0);dp[0]=1;for(int v=1;v<=k;++v)for(int s=v;s<=n;++s)dp[s]+=dp[s-v];cout<<dp[n]<<"\\n";`),
    wrong: [cpp(`int n,k;cin>>n>>k;vector<long long>dp(n+1,0);dp[0]=1;for(int s=1;s<=n;++s)for(int v=1;v<=k;++v)if(s>=v)dp[s]+=dp[s-v];cout<<dp[n]<<"\\n";`)],
  },
  "bt-place-rooks": {
    solution: cpp(`long long n,k;cin>>n>>k;auto C=[](long long a,long long b){long long r=1;for(long long i=0;i<b;++i){r=r*(a-i)/(i+1);}return r;};long long f=1;for(long long i=2;i<=k;++i)f*=i;cout<<C(n,k)*C(n,k)*f<<"\\n";`),
    wrong: [cpp(`long long n,k;cin>>n>>k;auto C=[](long long a,long long b){long long r=1;for(long long i=0;i<b;++i){r=r*(a-i)/(i+1);}return r;};cout<<C(n,k)*C(n,k)<<"\\n";`)],
  },
  "subset-generate-count": {
    solution: cpp(`int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;long long c=0;for(int m=0;m<(1<<n);++m){long long s=0;for(int b=0;b<n;++b)if(m>>b&1)s+=a[b];if(s<=k)++c;}cout<<c<<"\\n";`),
    wrong: [cpp(`int n;long long k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;long long c=0;for(int m=1;m<(1<<n);++m){long long s=0;for(int b=0;b<n;++b)if(m>>b&1)s+=a[b];if(s<=k)++c;}cout<<c<<"\\n";`)],
  },
  "permutation-rank": {
    solution: cpp(`int n;cin>>n;vector<int>p(n);for(auto&x:p)cin>>x;vector<int>rest=p;sort(rest.begin(),rest.end());long long rank=1;for(int k=0;k<n;++k){int idx=find(rest.begin(),rest.end(),p[k])-rest.begin();long long f=1;for(int i=2;i<=n-k-1;++i)f*=i;rank+=idx*f;rest.erase(rest.begin()+idx);}cout<<rank<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<int>p(n);for(auto&x:p)cin>>x;vector<int>rest=p;sort(rest.begin(),rest.end());long long rank=0;for(int k=0;k<n;++k){int idx=find(rest.begin(),rest.end(),p[k])-rest.begin();long long f=1;for(int i=2;i<=n-k-1;++i)f*=i;rank+=idx*f;rest.erase(rest.begin()+idx);}cout<<rank<<"\\n";`)],
  },
  "bt-partition-into-k": {
    solution: cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;long long tot=0;for(long long x:a)tot+=x;if(tot%k){cout<<"NO\\n";return 0;}long long target=tot/k;sort(a.rbegin(),a.rend());if(a[0]>target){cout<<"NO\\n";return 0;}vector<long long>b(k,0);function<bool(int)>rec=[&](int i){if(i==n)return true;set<long long>seen;for(int j=0;j<k;++j){if(b[j]+a[i]>target||seen.count(b[j]))continue;seen.insert(b[j]);b[j]+=a[i];if(rec(i+1))return true;b[j]-=a[i];}return false;};cout<<(rec(0)?"YES":"NO")<<"\\n";`),
    wrong: [cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;long long tot=0;for(long long x:a)tot+=x;cout<<(tot%k==0?"YES":"NO")<<"\\n";`)],
  },
  "bt-word-paths": {
    solution: cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;string w;cin>>w;vector<vector<char>>used(r,vector<char>(c,0));function<bool(int,int,int)>rec=[&](int y,int x,int k)->bool{if(k==(int)w.size())return true;if(y<0||y>=r||x<0||x>=c||used[y][x]||g[y][x]!=w[k])return false;used[y][x]=1;int dy[]={1,-1,0,0},dx[]={0,0,1,-1};for(int t=0;t<4;++t)if(rec(y+dy[t],x+dx[t],k+1)){used[y][x]=0;return true;}used[y][x]=0;return false;};for(int y=0;y<r;++y)for(int x=0;x<c;++x)if(rec(y,x,0)){cout<<"YES\\n";return 0;}cout<<"NO\\n";`),
    wrong: [cpp(`int r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;string w;cin>>w;function<bool(int,int,int)>rec=[&](int y,int x,int k)->bool{if(k==(int)w.size())return true;if(y<0||y>=r||x<0||x>=c||g[y][x]!=w[k])return false;int dy[]={1,-1,0,0},dx[]={0,0,1,-1};for(int t=0;t<4;++t)if(rec(y+dy[t],x+dx[t],k+1))return true;return false;};for(int y=0;y<r;++y)for(int x=0;x<c;++x)if(rec(y,x,0)){cout<<"YES\\n";return 0;}cout<<"NO\\n";`)],
  },
  "bt-knight-moves": {
    solution: cpp(`int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;if(r1==r2&&c1==c2){cout<<"0\\n";return 0;}vector<vector<int>>d(9,vector<int>(9,-1));queue<pair<int,int>>q;d[r1][c1]=0;q.push({r1,c1});int dr[]={1,2,-1,-2,1,2,-1,-2},dc[]={2,1,2,1,-2,-1,-2,-1};while(!q.empty()){auto[r,c]=q.front();q.pop();for(int k=0;k<8;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=1&&nr<=8&&nc>=1&&nc<=8&&d[nr][nc]<0){d[nr][nc]=d[r][c]+1;if(nr==r2&&nc==c2){cout<<d[nr][nc]<<"\\n";return 0;}q.push({nr,nc});}}}cout<<"-1\\n";`),
    wrong: [cpp(`int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;cout<<max(abs(r1-r2),abs(c1-c2))<<"\\n";`)],
  },
  "dp-max-product-subarray": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long best=a[0],hi=a[0],lo=a[0];for(int i=1;i<n;++i){long long c1=a[i],c2=hi*a[i],c3=lo*a[i];hi=max(c1,max(c2,c3));lo=min(c1,min(c2,c3));best=max(best,hi);}cout<<best<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long best=a[0],cur=a[0];for(int i=1;i<n;++i){cur=max(a[i],cur*a[i]);best=max(best,cur);}cout<<best<<"\\n";`)],
  },
  "adv-inversions-fast": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>tmp(n);long long c=0;function<void(int,int)>ms=[&](int l,int r){if(r-l<2)return;int m=(l+r)/2;ms(l,m);ms(m,r);int i=l,j=m,k=l;while(i<m&&j<r){if(a[i]<=a[j])tmp[k++]=a[i++];else{tmp[k++]=a[j++];c+=m-i;}}while(i<m)tmp[k++]=a[i++];while(j<r)tmp[k++]=a[j++];for(int t=l;t<r;++t)a[t]=tmp[t];};ms(0,n);cout<<c<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;long long c=0;for(int i=0;i+1<n;++i)if(a[i]>a[i+1])++c;cout<<c<<"\\n";`)],
  },
  "adv-lis-nlogn": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>t;for(long long x:a){auto it=lower_bound(t.begin(),t.end(),x);if(it==t.end())t.push_back(x);else *it=x;}cout<<t.size()<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<long long>t;for(long long x:a){auto it=upper_bound(t.begin(),t.end(),x);if(it==t.end())t.push_back(x);else *it=x;}cout<<t.size()<<"\\n";`)],
  },
  "adv-expected-rolls": {
    solution: cpp(`long long n;cin>>n;cout<<fixed<<setprecision(6)<<(double)n<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;cout<<fixed<<setprecision(6)<<(double)n/2<<"\\n";`)],
  },
  "adv-digit-dp-count": {
    solution: cpp(`long long n;int k;cin>>n>>k;long long c=0;for(long long v=1;v<=n;++v){long long s=0,t=v;while(t){s+=t%10;t/=10;}if(s==k)++c;}cout<<c<<"\\n";`),
    wrong: [cpp(`long long n;int k;cin>>n>>k;long long c=0;for(long long v=1;v<=n;++v){long long s=0,t=v;while(t){s+=t%10;t/=10;}if(s<=k)++c;}cout<<c<<"\\n";`)],
  },
  "sparse-min": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int l,r;cin>>l>>r;long long m=LLONG_MAX;for(int i=l-1;i<r;++i)m=min(m,a[i]);cout<<m<<"\\n";}`),
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int l,r;cin>>l>>r;long long m=LLONG_MAX;for(int i=l;i<r&&i<n;++i)m=min(m,a[i]);cout<<(m==LLONG_MAX?a[n-1]:m)<<"\\n";}`)],
  },
  "game-nim": {
    solution: cpp(`int n;cin>>n;long long x=0,v;while(n--){cin>>v;x^=v;}cout<<(x?"WIN":"LOSE")<<"\\n";`),
    wrong: [cpp(`int n;cin>>n;long long s=0,v;while(n--){cin>>v;s+=v;}cout<<(s%2?"WIN":"LOSE")<<"\\n";`)],
  },
  "mo-offline-distinct": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int l,r;cin>>l>>r;set<long long>s;for(int i=l-1;i<r;++i)s.insert(a[i]);cout<<s.size()<<"\\n";}`),
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int l,r;cin>>l>>r;cout<<r-l+1<<"\\n";}`)],
  },
  "matrix-power-fib": {
    solution: cpp(`long long n;cin>>n;const long long M=1000000007;auto mul=[&](array<long long,4>A,array<long long,4>B){return array<long long,4>{(A[0]*B[0]+A[1]*B[2])%M,(A[0]*B[1]+A[1]*B[3])%M,(A[2]*B[0]+A[3]*B[2])%M,(A[2]*B[1]+A[3]*B[3])%M};};array<long long,4>r{1,0,0,1},b{1,1,1,0};long long e=n-1;while(e>0){if(e&1)r=mul(r,b);b=mul(b,b);e>>=1;}cout<<r[0]%M<<"\\n";`),
    wrong: [cpp(`long long n;cin>>n;const long long M=1000000007;auto mul=[&](array<long long,4>A,array<long long,4>B){return array<long long,4>{(A[0]*B[0]+A[1]*B[2])%M,(A[0]*B[1]+A[1]*B[3])%M,(A[2]*B[0]+A[3]*B[2])%M,(A[2]*B[1]+A[3]*B[3])%M};};array<long long,4>r{1,0,0,1},b{1,1,1,0};long long e=n;while(e>0){if(e&1)r=mul(r,b);b=mul(b,b);e>>=1;}cout<<r[0]%M<<"\\n";`)],
  },
  "two-sat-simple": {
    solution: cpp(`int n,m;cin>>n>>m;vector<pair<int,int>>cl(m);for(auto&p:cl)cin>>p.first>>p.second;for(int mask=0;mask<(1<<n);++mask){bool ok=true;for(auto&[x,y]:cl){bool vx=((mask>>(abs(x)-1))&1)==(x>0);bool vy=((mask>>(abs(y)-1))&1)==(y>0);if(!vx&&!vy){ok=false;break;}}if(ok){cout<<"YES\\n";return 0;}}cout<<"NO\\n";`),
    wrong: [cpp(`int n,m;cin>>n>>m;vector<pair<int,int>>cl(m);for(auto&p:cl)cin>>p.first>>p.second;for(int mask=0;mask<(1<<n);++mask){bool ok=true;for(auto&[x,y]:cl){bool vx=(mask>>(abs(x)-1))&1;bool vy=(mask>>(abs(y)-1))&1;if(!vx&&!vy){ok=false;break;}}if(ok){cout<<"YES\\n";return 0;}}cout<<"NO\\n";`)],
  },
  "hld-path-sum": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>val(n+1);for(int i=1;i<=n;++i)cin>>val[i];vector<vector<int>>g(n+1);for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}while(q--){int u,v;cin>>u>>v;vector<int>par(n+1,0);vector<char>seen(n+1,0);queue<int>bq;seen[u]=1;bq.push(u);while(!bq.empty()){int x=bq.front();bq.pop();for(int y:g[x])if(!seen[y]){seen[y]=1;par[y]=x;bq.push(y);}}long long s=0;int cur=v;while(true){s+=val[cur];if(cur==u)break;cur=par[cur];}cout<<s<<"\\n";}`),
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>val(n+1);for(int i=1;i<=n;++i)cin>>val[i];for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;}while(q--){int u,v;cin>>u>>v;cout<<(u==v?val[u]:val[u]+val[v])<<"\\n";}`)],
  },
  "string-min-period": {
    solution: cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
cout<<n-pi[n-1]<<"\\n";`),
    // Two ways to lose the period: insisting it divide n, and a prefix function that gives up on the first mismatch instead of falling back through the border chain.
    wrong: [cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
int p=n-pi[n-1];if(n%p!=0)p=n;cout<<p<<"\\n";`), cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];if(s[i]==s[k])pi[i]=k+1;else pi[i]=0;}
cout<<n-pi[n-1]<<"\\n";`)],
  },
  "string-all-borders": {
    solution: cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
vector<int>b;for(int k=pi[n-1];k>0;k=pi[k-1])b.push_back(k);
if(b.empty()){cout<<-1<<"\\n";return 0;}
reverse(b.begin(),b.end());
for(size_t i=0;i<b.size();++i)cout<<b[i]<<(i+1<b.size()?" ":"\\n");`),
    // The chain comes out longest-first; forgetting to turn it around prints a correct set in the wrong order. The second miss reports only the longest border.
    wrong: [cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
vector<int>b;for(int k=pi[n-1];k>0;k=pi[k-1])b.push_back(k);
if(b.empty()){cout<<-1<<"\\n";return 0;}
for(size_t i=0;i<b.size();++i)cout<<b[i]<<(i+1<b.size()?" ":"\\n");`), cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
if(pi[n-1]==0){cout<<-1<<"\\n";return 0;}
cout<<pi[n-1]<<"\\n";`)],
  },
  "manacher-longest-pal": {
    solution: cpp(`string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1,best=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
best=max(best,k-1);}
cout<<best<<"\\n";`),
    // The radius in the padded string is one more than the length in the original; and a version that skips the padding sees only odd-length palindromes.
    wrong: [cpp(`string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1,best=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
best=max(best,k);}
cout<<best<<"\\n";`), cpp(`string s;cin>>s;int n=s.size();int best=1;
for(int c=0;c<n;++c){int k=0;while(c-k>=0&&c+k<n&&s[c-k]==s[c+k])++k;best=max(best,2*k-1);}
cout<<best<<"\\n";`)],
  },
  "count-palindromic-substrings": {
    solution: cpp(`string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1;long long total=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
total+=k/2;}
cout<<total<<"\\n";`),
    // Off by one in how many real palindromes a padded radius stands for, and a 32-bit accumulator that overflows on a long run of equal letters.
    wrong: [cpp(`string s;cin>>s;int n=s.size();string t="#";for(char c:s){t+=c;t+='#';}
int m=t.size();vector<int>p(m,0);int l=0,r=-1;long long total=0;
for(int i=0;i<m;++i){int k=(i>r)?1:min(p[l+r-i],r-i+1);
while(i-k>=0&&i+k<m&&t[i-k]==t[i+k])++k;
p[i]=k;if(i+k-1>r){l=i-k+1;r=i+k-1;}
total+=(k+1)/2;}
cout<<total<<"\\n";`)],
  },
  "segtree-point-max": {
    solution: cpp(`int n,q;cin>>n>>q;int sz=1;while(sz<n)sz<<=1;
vector<long long>tr(2*sz,LLONG_MIN);
for(int i=0;i<n;++i)cin>>tr[sz+i];
for(int i=sz-1;i>=1;--i)tr[i]=max(tr[2*i],tr[2*i+1]);
while(q--){int type;cin>>type;
if(type==1){int i;long long v;cin>>i>>v;int p=sz+i-1;tr[p]=v;for(p>>=1;p>=1;p>>=1)tr[p]=max(tr[2*p],tr[2*p+1]);}
else{int l,r;cin>>l>>r;long long best=LLONG_MIN;
for(int a=sz+l-1,b=sz+r;a<b;a>>=1,b>>=1){if(a&1)best=max(best,tr[a++]);if(b&1)best=max(best,tr[--b]);}
cout<<best<<"\\n";}}`),
    // Zero is the neutral element for a sum, not for a maximum; on an all-negative array the tree answers 0.
    wrong: [cpp(`int n,q;cin>>n>>q;int sz=1;while(sz<n)sz<<=1;
vector<long long>tr(2*sz,0);
for(int i=0;i<n;++i)cin>>tr[sz+i];
for(int i=sz-1;i>=1;--i)tr[i]=max(tr[2*i],tr[2*i+1]);
while(q--){int type;cin>>type;
if(type==1){int i;long long v;cin>>i>>v;int p=sz+i-1;tr[p]=v;for(p>>=1;p>=1;p>>=1)tr[p]=max(tr[2*p],tr[2*p+1]);}
else{int l,r;cin>>l>>r;long long best=0;
for(int a=sz+l-1,b=sz+r;a<b;a>>=1,b>>=1){if(a&1)best=max(best,tr[a++]);if(b&1)best=max(best,tr[--b]);}
cout<<best<<"\\n";}}`)],
  },
  "segtree-lazy-range-add": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>a(n+1,0);
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
else{int l,r;cin>>l>>r;cout<<qry(1,1,n,l,r)<<"\\n";}}`),
    // The classic lazy slip: adding v to a node's sum instead of v times the length of the node's range.
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>a(n+1,0);
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
else{int l,r;cin>>l>>r;cout<<qry(1,1,n,l,r)<<"\\n";}}`)],
  },
  "sparse-table-rmq": {
    solution: cpp(`int n,q;cin>>n>>q;vector<int>a(n);for(auto&x:a)cin>>x;
int LOG=1;while((1<<LOG)<=n)++LOG;
vector<vector<int>>sp(LOG,vector<int>(n));
sp[0]=a;
for(int k=1;k<LOG;++k)for(int i=0;i+(1<<k)<=n;++i)sp[k][i]=min(sp[k-1][i],sp[k-1][i+(1<<(k-1))]);
vector<int>lg(n+1,0);for(int i=2;i<=n;++i)lg[i]=lg[i/2]+1;
while(q--){int l,r;cin>>l>>r;--l;--r;int k=lg[r-l+1];
cout<<min(sp[k][l],sp[k][r-(1<<k)+1])<<"\\n";}`),
    // A log table built with lg[i] = lg[i/2] + 1 starting from i = 1 rounds the wrong way, and the two blocks then run off the end of the range.
    wrong: [cpp(`int n,q;cin>>n>>q;vector<int>a(n);for(auto&x:a)cin>>x;
int LOG=2;while((1<<LOG)<=n+1)++LOG;
vector<vector<int>>sp(LOG,vector<int>(n));
sp[0]=a;
for(int k=1;k<LOG;++k)for(int i=0;i+(1<<k)<=n;++i)sp[k][i]=min(sp[k-1][i],sp[k-1][i+(1<<(k-1))]);
vector<int>lg(n+2,0);for(int i=1;i<=n;++i)lg[i]=lg[i/2]+1;
while(q--){int l,r;cin>>l>>r;--l;--r;int k=lg[r-l+1];
cout<<min(sp[k][l],sp[k][r-(1<<k)+1])<<"\\n";}`)],
  },
  "trie-max-xor": {
    solution: cpp(`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
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
cout<<best<<"\\n";`),
    // Pairing the maximum with the minimum is the guess everyone makes first; it is right often enough to survive small tests and wrong as soon as the top bits agree.
    wrong: [cpp(`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
cout<<(a.front()^a.back())<<"\\n";`)],
  },
  "scc-count": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1),rg(n+1);
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
cout<<comps<<"\\n";`),
    // Ignoring direction turns the question into plain connectivity, which merges components that only reach each other one way.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);g[v].push_back(u);}
vector<char>seen(n+1,0);int comps=0;
for(int s=1;s<=n;++s){if(seen[s])continue;++comps;
vector<int>st{s};seen[s]=1;
while(!st.empty()){int u=st.back();st.pop_back();
for(int v:g[u])if(!seen[v]){seen[v]=1;st.push_back(v);}}}
cout<<comps<<"\\n";`)],
  },
  "bridges-count": {
    solution: cpp(`int n,m;cin>>n>>m;
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
cout<<bridges<<"\\n";`),
    // Refusing to revisit the parent VERTEX rather than the parent EDGE makes a doubled edge invisible, so every doubled edge is reported as a bridge.
    wrong: [cpp(`int n,m;cin>>n>>m;
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
cout<<bridges<<"\\n";`)],
  },
  "articulation-count": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
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
cout<<total<<"\\n";`),
    // Applying the child rule to the root as well: the endpoint of a path has one child whose low value equals the root's discovery time, so it gets flagged.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
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
cout<<total<<"\\n";`)],
  },
  "zero-one-bfs": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,int>>>g(n+1);
for(int i=0;i<m;++i){int u,v,w;cin>>u>>v>>w;g[u].push_back({v,w});g[v].push_back({u,w});}
const int INF=INT_MAX/2;vector<int>d(n+1,INF);d[1]=0;
deque<int>dq;dq.push_back(1);
while(!dq.empty()){int u=dq.front();dq.pop_front();
for(auto[v,w]:g[u])if(d[u]+w<d[v]){d[v]=d[u]+w;if(w)dq.push_back(v);else dq.push_front(v);}}
cout<<(d[n]>=INF?-1:d[n])<<"\\n";`),
    // A plain BFS finds the path with the fewest edges, which is not the cheapest one once edges are free.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,int>>>g(n+1);
for(int i=0;i<m;++i){int u,v,w;cin>>u>>v>>w;g[u].push_back({v,w});g[v].push_back({u,w});}
const int INF=INT_MAX/2;vector<int>d(n+1,INF);d[1]=0;
queue<int>q;q.push(1);
while(!q.empty()){int u=q.front();q.pop();
for(auto[v,w]:g[u])if(d[v]>=INF){d[v]=d[u]+w;q.push(v);}}
cout<<(d[n]>=INF?-1:d[n])<<"\\n";`)],
  },
  "lca-binary-lifting": {
    solution: cpp(`int n,q;cin>>n>>q;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
int LOG=1;while((1<<LOG)<n)++LOG;++LOG;
vector<vector<int>>up(LOG,vector<int>(n+1,0));vector<int>dep(n+1,0);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;up[0][1]=1;
while(!st.empty()){int u=st.back();st.pop_back();
for(int v:g[u])if(!seen[v]){seen[v]=1;dep[v]=dep[u]+1;up[0][v]=u;st.push_back(v);}}}
for(int k=1;k<LOG;++k)for(int v=1;v<=n;++v)up[k][v]=up[k-1][up[k-1][v]];
while(q--){int u,v;cin>>u>>v;int a=u,b=v;
if(dep[a]<dep[b])swap(a,b);
int diff=dep[a]-dep[b];
for(int k=0;k<LOG;++k)if(diff>>k&1)a=up[k][a];
if(a!=b){for(int k=LOG-1;k>=0;--k)if(up[k][a]!=up[k][b]){a=up[k][a];b=up[k][b];}
a=up[0][a];}
cout<<dep[u]+dep[v]-2*dep[a]<<"\\n";}`),
    // Lifting the deeper vertex but then forgetting that it may already BE the ancestor: the loop climbs one step too far and returns the parent of the true LCA.
    wrong: [cpp(`int n,q;cin>>n>>q;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
int LOG=1;while((1<<LOG)<n)++LOG;++LOG;
vector<vector<int>>up(LOG,vector<int>(n+1,0));vector<int>dep(n+1,0);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;up[0][1]=1;
while(!st.empty()){int u=st.back();st.pop_back();
for(int v:g[u])if(!seen[v]){seen[v]=1;dep[v]=dep[u]+1;up[0][v]=u;st.push_back(v);}}}
for(int k=1;k<LOG;++k)for(int v=1;v<=n;++v)up[k][v]=up[k-1][up[k-1][v]];
while(q--){int u,v;cin>>u>>v;int a=u,b=v;
if(dep[a]<dep[b])swap(a,b);
int diff=dep[a]-dep[b];
for(int k=0;k<LOG;++k)if(diff>>k&1)a=up[k][a];
for(int k=LOG-1;k>=0;--k)if(up[k][a]!=up[k][b]){a=up[k][a];b=up[k][b];}
a=up[0][a];
cout<<dep[u]+dep[v]-2*dep[a]<<"\\n";}`)],
  },
  "euler-tour-subtree-sum": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>val(n+1);
for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>tin(n+1,0),tout(n+1,0);int timer=0;
{vector<pair<int,int>>st;st.push_back({1,0});vector<char>seen(n+1,0);seen[1]=1;tin[1]=++timer;
while(!st.empty()){auto&[u,i]=st.back();
if(i<(int)g[u].size()){int v=g[u][i++];if(!seen[v]){seen[v]=1;tin[v]=++timer;st.push_back({v,0});}}
else{tout[u]=timer;st.pop_back();}}}
vector<long long>bit(n+2,0);
auto add=[&](int p,long long d){for(;p<=n;p+=p&-p)bit[p]+=d;};
auto pre=[&](int p){long long s=0;for(;p>0;p-=p&-p)s+=bit[p];return s;};
for(int v=1;v<=n;++v)add(tin[v],val[v]);
while(q--){int type;cin>>type;
if(type==1){int v;long long x;cin>>v>>x;add(tin[v],x-val[v]);val[v]=x;}
else{int v;cin>>v;cout<<pre(tout[v])-pre(tin[v]-1)<<"\\n";}}`),
    // Treating an update as an add rather than a replace: the tree accumulates the new value on top of the old one instead of the difference.
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>val(n+1);
for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>tin(n+1,0),tout(n+1,0);int timer=0;
{vector<pair<int,int>>st;st.push_back({1,0});vector<char>seen(n+1,0);seen[1]=1;tin[1]=++timer;
while(!st.empty()){auto&[u,i]=st.back();
if(i<(int)g[u].size()){int v=g[u][i++];if(!seen[v]){seen[v]=1;tin[v]=++timer;st.push_back({v,0});}}
else{tout[u]=timer;st.pop_back();}}}
vector<long long>bit(n+2,0);
auto add=[&](int p,long long d){for(;p<=n;p+=p&-p)bit[p]+=d;};
auto pre=[&](int p){long long s=0;for(;p>0;p-=p&-p)s+=bit[p];return s;};
for(int v=1;v<=n;++v)add(tin[v],val[v]);
while(q--){int type;cin>>type;
if(type==1){int v;long long x;cin>>v>>x;add(tin[v],x);val[v]=x;}
else{int v;cin>>v;cout<<pre(tout[v])-pre(tin[v]-1)<<"\\n";}}`)],
  },
  "tree-dp-independent-set": {
    solution: cpp(`int n;cin>>n;vector<long long>w(n+1);
for(int i=1;i<=n;++i)cin>>w[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;
while(!st.empty()){int u=st.back();st.pop_back();order.push_back(u);
for(int v:g[u])if(!seen[v]){seen[v]=1;par[v]=u;st.push_back(v);}}}
vector<long long>take(n+1,0),skip(n+1,0);
for(int i=n-1;i>=0;--i){int u=order[i];
take[u]+=w[u];
int p=par[u];if(p){take[p]+=skip[u];skip[p]+=max(take[u],skip[u]);}}
cout<<max(take[1],skip[1])<<"\\n";`),
    // Adding max(take, skip) of a child into the parent's TAKE state as well: the parent then keeps a child it is not allowed to keep.
    wrong: [cpp(`int n;cin>>n;vector<long long>w(n+1);
for(int i=1;i<=n;++i)cin>>w[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;
while(!st.empty()){int u=st.back();st.pop_back();order.push_back(u);
for(int v:g[u])if(!seen[v]){seen[v]=1;par[v]=u;st.push_back(v);}}}
vector<long long>take(n+1,0),skip(n+1,0);
for(int i=n-1;i>=0;--i){int u=order[i];
take[u]+=w[u];
int p=par[u];if(p){take[p]+=max(take[u],skip[u]);skip[p]+=max(take[u],skip[u]);}}
cout<<max(take[1],skip[1])<<"\\n";`)],
  },
  "tree-rerooting-distances": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;
while(!st.empty()){int u=st.back();st.pop_back();order.push_back(u);
for(int v:g[u])if(!seen[v]){seen[v]=1;par[v]=u;st.push_back(v);}}}
vector<long long>sz(n+1,1),down(n+1,0),ans(n+1,0);
for(int i=n-1;i>=1;--i){int u=order[i],p=par[u];sz[p]+=sz[u];down[p]+=down[u]+sz[u];}
ans[1]=down[1];
for(int i=1;i<n;++i){int u=order[i],p=par[u];ans[u]=ans[p]+n-2*sz[u];}
for(int v=1;v<=n;++v)cout<<ans[v]<<(v<n?" ":"\\n");`),
    // Reporting the rooted answer for every vertex -- correct at the root, wrong everywhere else.
    wrong: [cpp(`int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;
while(!st.empty()){int u=st.back();st.pop_back();order.push_back(u);
for(int v:g[u])if(!seen[v]){seen[v]=1;par[v]=u;st.push_back(v);}}}
vector<long long>sz(n+1,1),down(n+1,0);
for(int i=n-1;i>=1;--i){int u=order[i],p=par[u];sz[p]+=sz[u];down[p]+=down[u]+sz[u];}
for(int v=1;v<=n;++v)cout<<down[v]<<(v<n?" ":"\\n");`)],
  },
  "tsp-bitmask": {
    solution: cpp(`int n;cin>>n;vector<vector<long long>>c(n,vector<long long>(n));
for(auto&row:c)for(auto&x:row)cin>>x;
if(n==1){cout<<0<<"\\n";return 0;}
const long long INF=(long long)4e18;
vector<vector<long long>>dp(1<<n,vector<long long>(n,INF));
dp[1][0]=0;
for(int mask=1;mask<(1<<n);++mask){if(!(mask&1))continue;
for(int u=0;u<n;++u){if(dp[mask][u]==INF)continue;
for(int v=0;v<n;++v){if(mask>>v&1)continue;
long long nd=dp[mask][u]+c[u][v];int nm=mask|(1<<v);
if(nd<dp[nm][v])dp[nm][v]=nd;}}}
long long best=INF;int full=(1<<n)-1;
for(int u=1;u<n;++u)if(dp[full][u]<INF)best=min(best,dp[full][u]+c[u][0]);
cout<<best<<"\\n";`),
    // The nearest-unvisited-city greedy: plausible, fast, and blind to what the trip home will cost.
    wrong: [cpp(`int n;cin>>n;vector<vector<long long>>c(n,vector<long long>(n));
for(auto&row:c)for(auto&x:row)cin>>x;
if(n==1){cout<<0<<"\\n";return 0;}
vector<char>used(n,0);used[0]=1;int cur=0;long long total=0;
for(int step=1;step<n;++step){int best=-1;
for(int v=0;v<n;++v)if(!used[v]&&(best<0||c[cur][v]<c[cur][best]))best=v;
total+=c[cur][best];used[best]=1;cur=best;}
total+=c[cur][0];
cout<<total<<"\\n";`)],
  },
  "bitmask-assignment": {
    solution: cpp(`int n;cin>>n;vector<vector<long long>>c(n,vector<long long>(n));
for(auto&row:c)for(auto&x:row)cin>>x;
const long long INF=(long long)4e18;
vector<long long>dp(1<<n,INF);dp[0]=0;
for(int mask=0;mask<(1<<n);++mask){if(dp[mask]==INF)continue;
int i=__builtin_popcount(mask);if(i==n)continue;
for(int jj=0;jj<n;++jj){if(mask>>jj&1)continue;
int nm=mask|(1<<jj);long long nd=dp[mask]+c[i][jj];
if(nd<dp[nm])dp[nm]=nd;}}
cout<<dp[(1<<n)-1]<<"\\n";`),
    // Taking the cheapest job in each row independently ignores that a job can only be used once.
    wrong: [cpp(`int n;cin>>n;vector<vector<long long>>c(n,vector<long long>(n));
for(auto&row:c)for(auto&x:row)cin>>x;
long long total=0;
for(int i=0;i<n;++i)total+=*min_element(c[i].begin(),c[i].end());
cout<<total<<"\\n";`)],
  },
  "floyd-all-pairs": {
    solution: cpp(`int n,m,q;cin>>n>>m>>q;
const long long INF=(long long)1e18;
vector<vector<long long>>d(n+1,vector<long long>(n+1,INF));
for(int v=1;v<=n;++v)d[v][v]=0;
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;d[a][b]=min(d[a][b],w);}
for(int k=1;k<=n;++k)for(int i=1;i<=n;++i){if(d[i][k]==INF)continue;
for(int jj=1;jj<=n;++jj)if(d[k][jj]<INF&&d[i][k]+d[k][jj]<d[i][jj])d[i][jj]=d[i][k]+d[k][jj];}
while(q--){int u,v;cin>>u>>v;cout<<(d[u][v]==INF?-1:d[u][v])<<"\\n";}`),
    // The intermediate vertex k belongs in the outermost loop; with k innermost the relaxations happen in an order that misses longer chains.
    wrong: [cpp(`int n,m,q;cin>>n>>m>>q;
const long long INF=(long long)1e18;
vector<vector<long long>>d(n+1,vector<long long>(n+1,INF));
for(int v=1;v<=n;++v)d[v][v]=0;
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;d[a][b]=min(d[a][b],w);}
for(int i=1;i<=n;++i)for(int jj=1;jj<=n;++jj)for(int k=1;k<=n;++k)
if(d[i][k]<INF&&d[k][jj]<INF&&d[i][k]+d[k][jj]<d[i][jj])d[i][jj]=d[i][k]+d[k][jj];
while(q--){int u,v;cin>>u>>v;cout<<(d[u][v]==INF?-1:d[u][v])<<"\\n";}`)],
  },
  "bellman-negative-cycle": {
    solution: cpp(`int n,m;cin>>n>>m;
vector<array<long long,3>>e(m);
for(int i=0;i<m;++i){long long a,b,w;cin>>a>>b>>w;e[i]={a,b,w};}
const long long INF=(long long)1e18;
vector<long long>d(n+1,INF);d[1]=0;
for(int it=0;it<n;++it){bool moved=false;
for(auto&[a,b,w]:e){if(d[a]==INF)continue;
if(d[a]+w<d[b]){d[b]=d[a]+w;moved=true;}}
if(!moved){cout<<"NO"<<"\\n";return 0;}
if(it==n-1){cout<<"YES"<<"\\n";return 0;}}
cout<<"NO"<<"\\n";`),
    // Starting every vertex at distance zero finds negative cycles anywhere in the graph, including the ones vertex 1 can never reach.
    wrong: [cpp(`int n,m;cin>>n>>m;
vector<array<long long,3>>e(m);
for(int i=0;i<m;++i){long long a,b,w;cin>>a>>b>>w;e[i]={a,b,w};}
vector<long long>d(n+1,0);
for(int it=0;it<n;++it){bool moved=false;
for(auto&[a,b,w]:e)if(d[a]+w<d[b]){d[b]=d[a]+w;moved=true;}
if(!moved){cout<<"NO"<<"\\n";return 0;}
if(it==n-1){cout<<"YES"<<"\\n";return 0;}}
cout<<"NO"<<"\\n";`)],
  },
  "bipartite-matching-kuhn": {
    solution: cpp(`int n,m,k;cin>>n>>m>>k;vector<vector<int>>g(n+1);
for(int i=0;i<k;++i){int a,b;cin>>a>>b;g[a].push_back(b);}
vector<int>owner(m+1,0);vector<int>stamp(m+1,0);int cur=0;
function<bool(int)>tryKuhn=[&](int u)->bool{
for(int v:g[u]){if(stamp[v]==cur)continue;stamp[v]=cur;
if(owner[v]==0||tryKuhn(owner[v])){owner[v]=u;return true;}}
return false;};
int total=0;
for(int u=1;u<=n;++u){++cur;if(tryKuhn(u))++total;}
cout<<total<<"\\n";`),
    // Plain greedy: take the first free partner and never reconsider. It matches two of the three in the first sample.
    wrong: [cpp(`int n,m,k;cin>>n>>m>>k;vector<vector<int>>g(n+1);
for(int i=0;i<k;++i){int a,b;cin>>a>>b;g[a].push_back(b);}
vector<char>busy(m+1,0);int total=0;
for(int u=1;u<=n;++u)for(int v:g[u])if(!busy[v]){busy[v]=1;++total;break;}
cout<<total<<"\\n";`)],
  },
  "topo-lexicographic": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);++deg[v];}
priority_queue<int,vector<int>,greater<int>>pq;
for(int v=1;v<=n;++v)if(deg[v]==0)pq.push(v);
vector<int>out;out.reserve(n);
while(!pq.empty()){int u=pq.top();pq.pop();out.push_back(u);
for(int v:g[u])if(--deg[v]==0)pq.push(v);}
if((int)out.size()<n){cout<<-1<<"\\n";return 0;}
for(int i=0;i<n;++i)cout<<out[i]<<(i+1<n?" ":"\\n");`),
    // A plain FIFO queue gives a valid topological order but not the smallest one.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[u].push_back(v);++deg[v];}
queue<int>pq;
for(int v=1;v<=n;++v)if(deg[v]==0)pq.push(v);
vector<int>out;out.reserve(n);
while(!pq.empty()){int u=pq.front();pq.pop();out.push_back(u);
for(int v:g[u])if(--deg[v]==0)pq.push(v);}
if((int)out.size()<n){cout<<-1<<"\\n";return 0;}
for(int i=0;i<n;++i)cout<<out[i]<<(i+1<n?" ":"\\n");`)],
  },
  "minimax-path": {
    solution: cpp(`int n,m;cin>>n>>m;
vector<array<long long,3>>e(m);
for(int i=0;i<m;++i){long long a,b,w;cin>>a>>b>>w;e[i]={w,a,b};}
sort(e.begin(),e.end());
vector<int>p(n+1);for(int v=1;v<=n;++v)p[v]=v;
function<int(int)>find=[&](int v){while(p[v]!=v){p[v]=p[p[v]];v=p[v];}return v;};
if(n==1){cout<<0<<"\\n";return 0;}
for(auto&[w,a,b]:e){int ra=find(a),rb=find(b);if(ra!=rb)p[ra]=rb;
if(find(1)==find(n)){cout<<w<<"\\n";return 0;}}
cout<<-1<<"\\n";`),
    // Answering with the ordinary shortest path: it minimises the total, which is a different question and picks the other route here.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n+1);
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back({b,w});g[b].push_back({a,w});}
const long long INF=(long long)1e18;vector<long long>d(n+1,INF);d[1]=0;
priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>>pq;pq.push({0,1});
while(!pq.empty()){auto[du,u]=pq.top();pq.pop();if(du>d[u])continue;
for(auto[v,w]:g[u])if(du+w<d[v]){d[v]=du+w;pq.push({d[v],v});}}
cout<<(d[n]==INF?-1:d[n])<<"\\n";`)],
  },
  "dijkstra-count-paths": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n+1);
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back({b,w});g[b].push_back({a,w});}
const long long INF=(long long)4e18,MOD=1000000007;
vector<long long>d(n+1,INF),cnt(n+1,0);d[1]=0;cnt[1]=1;
priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>>pq;pq.push({0,1});
while(!pq.empty()){auto[du,u]=pq.top();pq.pop();if(du>d[u])continue;
for(auto[v,w]:g[u]){long long nd=du+w;
if(nd<d[v]){d[v]=nd;cnt[v]=cnt[u];pq.push({nd,v});}
else if(nd==d[v])cnt[v]=(cnt[v]+cnt[u])%MOD;}}
cout<<(d[n]==INF?0:cnt[n])<<"\\n";`),
    // Adding the count in both branches instead of replacing it on the strictly-shorter one: a path that is later beaten still leaves its count behind.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n+1);
for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back({b,w});g[b].push_back({a,w});}
const long long INF=(long long)4e18,MOD=1000000007;
vector<long long>d(n+1,INF),cnt(n+1,0);d[1]=0;cnt[1]=1;
priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>>pq;pq.push({0,1});
while(!pq.empty()){auto[du,u]=pq.top();pq.pop();if(du>d[u])continue;
for(auto[v,w]:g[u]){long long nd=du+w;
if(nd<d[v]){d[v]=nd;pq.push({nd,v});}
if(nd<=d[v])cnt[v]=(cnt[v]+cnt[u])%MOD;}}
cout<<(d[n]==INF?0:cnt[n])<<"\\n";`)],
  },
  "ext-gcd-diophantine": {
    solution: cpp(`long long a,b,c;cin>>a>>b>>c;
function<long long(long long,long long,long long&,long long&)>eg=[&](long long p,long long q,long long&x,long long&y)->long long{
if(q==0){x=1;y=0;return p;}
long long x1,y1;long long g=eg(q,p%q,x1,y1);x=y1;y=x1-(p/q)*y1;return g;};
long long x0,y0;long long g=eg(a,b,x0,y0);
if(c%g!=0){cout<<-1<<"\\n";return 0;}
long long step=b/g;
__int128 xx=(__int128)x0*(c/g);
long long r=(long long)(xx%step);
if(r<0)r+=step;
cout<<r<<"\\n";`),
    // Taking the remainder of a negative product without correcting the sign: C++ gives a negative remainder, and "smallest non-negative" quietly becomes "most negative".
    wrong: [cpp(`long long a,b,c;cin>>a>>b>>c;
function<long long(long long,long long,long long&,long long&)>eg=[&](long long p,long long q,long long&x,long long&y)->long long{
if(q==0){x=1;y=0;return p;}
long long x1,y1;long long g=eg(q,p%q,x1,y1);x=y1;y=x1-(p/q)*y1;return g;};
long long x0,y0;long long g=eg(a,b,x0,y0);
if(c%g!=0){cout<<-1<<"\\n";return 0;}
long long step=b/g;
__int128 xx=(__int128)x0*(c/g);
cout<<(long long)(xx%step)<<"\\n";`)],
  },
  "crt-two-congruences": {
    solution: cpp(`long long r1,m1,r2,m2;cin>>r1>>m1>>r2>>m2;
function<long long(long long,long long,long long&,long long&)>eg=[&](long long p,long long q,long long&x,long long&y)->long long{
if(q==0){x=1;y=0;return p;}
long long x1,y1;long long g=eg(q,p%q,x1,y1);x=y1;y=x1-(p/q)*y1;return g;};
long long p,q;long long g=eg(m1,m2,p,q);
long long diff=r2-r1;
if(diff%g!=0){cout<<-1<<"\\n";return 0;}
long long lcm=m1/g*m2;
__int128 k=(__int128)p*(diff/g)%(m2/g);
__int128 x=(__int128)r1+(__int128)m1*k;
x%=lcm;if(x<0)x+=lcm;
cout<<(long long)x<<"\\n";`),
    // Assuming the moduli are coprime: the divisibility check disappears and an impossible pair gets an answer anyway.
    wrong: [cpp(`long long r1,m1,r2,m2;cin>>r1>>m1>>r2>>m2;
function<long long(long long,long long,long long&,long long&)>eg=[&](long long p,long long q,long long&x,long long&y)->long long{
if(q==0){x=1;y=0;return p;}
long long x1,y1;long long g=eg(q,p%q,x1,y1);x=y1;y=x1-(p/q)*y1;return g;};
long long p,q;eg(m1,m2,p,q);
long long lcm=m1*m2;
__int128 k=(__int128)p*(r2-r1)%m2;
__int128 x=(__int128)r1+(__int128)m1*k;
x%=lcm;if(x<0)x+=lcm;
cout<<(long long)x<<"\\n";`)],
  },
  "euler-phi-sum": {
    solution: cpp(`int n;cin>>n;vector<int>phi(n+1);
for(int i=0;i<=n;++i)phi[i]=i;
for(int p=2;p<=n;++p)if(phi[p]==p)for(int m=p;m<=n;m+=p)phi[m]-=phi[m]/p;
long long total=0;for(int i=1;i<=n;++i)total+=phi[i];
cout<<total<<"\\n";`),
    // A 32-bit accumulator: the sum passes 2^31 well before n reaches 10^6.
    wrong: [cpp(`int n;cin>>n;vector<int>phi(n+1);
for(int i=0;i<=n;++i)phi[i]=i;
for(int p=2;p<=n;++p)if(phi[p]==p)for(int m=p;m<=n;m+=p)phi[m]-=phi[m]/p;
int total=0;for(int i=1;i<=n;++i)total+=phi[i];
cout<<total<<"\\n";`)],
  },
  "miller-rabin-prime": {
    solution: cpp(`int q;cin>>q;
auto mulmod=[](unsigned long long a,unsigned long long b,unsigned long long m){return (unsigned long long)((__uint128_t)a*b%m);};
auto powmod=[&](unsigned long long a,unsigned long long e,unsigned long long m){unsigned long long r=1;a%=m;
while(e){if(e&1)r=mulmod(r,a,m);a=mulmod(a,a,m);e>>=1;}return r;};
auto isPrime=[&](unsigned long long n){
if(n<2)return false;
for(unsigned long long p:{2ULL,3ULL,5ULL,7ULL,11ULL,13ULL,17ULL,19ULL,23ULL,29ULL,31ULL,37ULL}){if(n%p==0)return n==p;}
unsigned long long d=n-1;int s=0;while((d&1)==0){d>>=1;++s;}
for(unsigned long long a:{2ULL,3ULL,5ULL,7ULL,11ULL,13ULL,17ULL,19ULL,23ULL,29ULL,31ULL,37ULL}){
unsigned long long x=powmod(a,d,n);
if(x==1||x==n-1)continue;
bool composite=true;
for(int i=1;i<s;++i){x=mulmod(x,x,n);if(x==n-1){composite=false;break;}}
if(composite)return false;}
return true;};
while(q--){unsigned long long n;cin>>n;cout<<(isPrime(n)?"YES":"NO")<<"\\n";}`),
    // The Fermat test without the square-root step: it declares the Carmichael numbers 561, 1105, 1729 and 2465 prime.
    wrong: [cpp(`int q;cin>>q;
auto mulmod=[](unsigned long long a,unsigned long long b,unsigned long long m){return (unsigned long long)((__uint128_t)a*b%m);};
auto powmod=[&](unsigned long long a,unsigned long long e,unsigned long long m){unsigned long long r=1;a%=m;
while(e){if(e&1)r=mulmod(r,a,m);a=mulmod(a,a,m);e>>=1;}return r;};
auto isPrime=[&](unsigned long long n){
if(n<2)return false;
if(n==2||n==3)return true;
if(n%2==0)return false;
for(unsigned long long a:{2ULL,3ULL})if(powmod(a%n,n-1,n)!=1)return false;
return true;};
while(q--){unsigned long long n;cin>>n;cout<<(isPrime(n)?"YES":"NO")<<"\\n";}`)],
  },
  "count-coprime-pairs": {
    solution: cpp(`int n;cin>>n;const int M=1000001;
vector<int>cnt(M,0);
for(int i=0;i<n;++i){int x;cin>>x;++cnt[x];}
vector<int>mu(M,1);vector<char>composite(M,0);vector<int>primes;
for(int i=2;i<M;++i){if(!composite[i]){primes.push_back(i);mu[i]=-1;}
for(int p:primes){long long v=(long long)p*i;if(v>=M)break;composite[v]=1;
if(i%p==0){mu[v]=0;break;}mu[v]=-mu[i];}}
long long total=0;
for(int d=1;d<M;++d){if(mu[d]==0)continue;
long long c=0;for(int m=d;m<M;m+=d)c+=cnt[m];
total+=(long long)mu[d]*c*(c-1)/2;}
cout<<total<<"\\n";`),
    // Counting pairs whose gcd is not divisible by any single prime -- inclusion without the exclusion, so pairs sharing two primes get subtracted twice.
    wrong: [cpp(`int n;cin>>n;const int M=1000001;
vector<int>cnt(M,0);
for(int i=0;i<n;++i){int x;cin>>x;++cnt[x];}
vector<char>composite(M,0);vector<int>primes;
for(int i=2;i<M;++i){if(!composite[i])primes.push_back(i);
for(int p:primes){long long v=(long long)p*i;if(v>=M)break;composite[v]=1;if(i%p==0)break;}}
long long total=(long long)n*(n-1)/2;
for(int p:primes){long long c=0;for(int m=p;m<M;m+=p)c+=cnt[m];
total-=c*(c-1)/2;}
cout<<total<<"\\n";`)],
  },
  "matrix-power-linear-rec": {
    solution: cpp(`long long k,n;cin>>k>>n;const long long MOD=1000000007;
vector<long long>c(k),f(k);
for(auto&x:c)cin>>x;
for(auto&x:f)cin>>x;
if(n<=k){cout<<f[n-1]<<"\\n";return 0;}
int K=(int)k;
auto mul=[&](const vector<vector<long long>>&A,const vector<vector<long long>>&B){
vector<vector<long long>>C(K,vector<long long>(K,0));
for(int i=0;i<K;++i)for(int t=0;t<K;++t){if(!A[i][t])continue;
for(int jj=0;jj<K;++jj)C[i][jj]=(C[i][jj]+A[i][t]*B[t][jj])%MOD;}
return C;};
vector<vector<long long>>M(K,vector<long long>(K,0)),R(K,vector<long long>(K,0));
for(int jj=0;jj<K;++jj)M[0][jj]=c[jj]%MOD;
for(int i=1;i<K;++i)M[i][i-1]=1;
for(int i=0;i<K;++i)R[i][i]=1;
long long e=n-k;
while(e){if(e&1)R=mul(R,M);M=mul(M,M);e>>=1;}
long long ans=0;
for(int jj=0;jj<K;++jj)ans=(ans+R[0][jj]*f[K-1-jj])%MOD;
cout<<ans<<"\\n";`),
    // Skipping the n <= k shortcut: the exponent n - k goes negative and, being unsigned in the shift loop, runs essentially forever or returns nonsense.
    wrong: [cpp(`long long k,n;cin>>k>>n;const long long MOD=1000000007;
vector<long long>c(k),f(k);
for(auto&x:c)cin>>x;
for(auto&x:f)cin>>x;
int K=(int)k;
auto mul=[&](const vector<vector<long long>>&A,const vector<vector<long long>>&B){
vector<vector<long long>>C(K,vector<long long>(K,0));
for(int i=0;i<K;++i)for(int t=0;t<K;++t){if(!A[i][t])continue;
for(int jj=0;jj<K;++jj)C[i][jj]=(C[i][jj]+A[i][t]*B[t][jj])%MOD;}
return C;};
vector<vector<long long>>M(K,vector<long long>(K,0)),R(K,vector<long long>(K,0));
for(int jj=0;jj<K;++jj)M[0][jj]=c[jj]%MOD;
for(int i=1;i<K;++i)M[i][i-1]=1;
for(int i=0;i<K;++i)R[i][i]=1;
long long e=n-k;
while(e>0){if(e&1)R=mul(R,M);M=mul(M,M);e>>=1;}
long long ans=0;
for(int jj=0;jj<K;++jj)ans=(ans+R[0][jj]*f[K-1-jj])%MOD;
cout<<ans<<"\\n";`)],
  },
  "closest-pair-points": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&[x,y]:p)cin>>x>>y;
sort(p.begin(),p.end());
auto sq=[](long long v){return v*v;};
long long best=(long long)9e18;
set<pair<long long,long long>>strip;
int left=0;
for(int i=0;i<n;++i){
long long d=(long long)ceil(sqrt((long double)best));
while(left<i&&p[i].first-p[left].first>d){strip.erase({p[left].second,p[left].first});++left;}
auto lo=strip.lower_bound({p[i].second-d,LLONG_MIN});
auto hi=strip.upper_bound({p[i].second+d,LLONG_MAX});
for(auto it=lo;it!=hi;++it){
long long cur=sq(p[i].first-it->second)+sq(p[i].second-it->first);
if(cur<best)best=cur;}
strip.insert({p[i].second,p[i].first});}
cout<<best<<"\\n";`),
    // Comparing only neighbours in the x-sorted order: the closest pair is often far apart in that order, as it is on a square's diagonal-free layout.
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&[x,y]:p)cin>>x>>y;
sort(p.begin(),p.end());
auto sq=[](long long v){return v*v;};
long long best=(long long)9e18;
for(int i=0;i+1<n;++i){long long cur=sq(p[i].first-p[i+1].first)+sq(p[i].second-p[i+1].second);
if(cur<best)best=cur;}
cout<<best<<"\\n";`)],
  },
  "point-in-convex-polygon": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&[x,y]:p)cin>>x>>y;
auto cross=[](pair<long long,long long>o,pair<long long,long long>a,pair<long long,long long>b){
return (a.first-o.first)*(b.second-o.second)-(a.second-o.second)*(b.first-o.first);};
int q;cin>>q;
while(q--){long long x,y;cin>>x>>y;pair<long long,long long>t{x,y};
if(cross(p[0],p[1],t)<0||cross(p[0],p[n-1],t)>0){cout<<"NO"<<"\\n";continue;}
int lo=1,hi=n-1;
while(hi-lo>1){int mid=(lo+hi)/2;
if(cross(p[0],p[mid],t)>=0)lo=mid;else hi=mid;}
cout<<(cross(p[lo],p[lo+1],t)>=0?"YES":"NO")<<"\\n";}`),
    // Requiring a strictly positive cross product treats every boundary point as outside, so a query landing on a vertex or an edge is rejected.
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&[x,y]:p)cin>>x>>y;
auto cross=[](pair<long long,long long>o,pair<long long,long long>a,pair<long long,long long>b){
return (a.first-o.first)*(b.second-o.second)-(a.second-o.second)*(b.first-o.first);};
int q;cin>>q;
while(q--){long long x,y;cin>>x>>y;pair<long long,long long>t{x,y};
bool ok=true;
for(int i=0;i<n;++i)if(cross(p[i],p[(i+1)%n],t)<=0)ok=false;
cout<<(ok?"YES":"NO")<<"\\n";}`)],
  },
  "segment-intersection": {
    solution: cpp(`long long x1,y1,x2,y2,x3,y3,x4,y4;
cin>>x1>>y1>>x2>>y2>>x3>>y3>>x4>>y4;
auto cross=[](long long ax,long long ay,long long bx,long long by,long long cx,long long cy){
long long v=(bx-ax)*(cy-ay)-(by-ay)*(cx-ax);return v>0?1:(v<0?-1:0);};
auto onSeg=[](long long ax,long long ay,long long bx,long long by,long long px,long long py){
return min(ax,bx)<=px&&px<=max(ax,bx)&&min(ay,by)<=py&&py<=max(ay,by);};
int d1=cross(x1,y1,x2,y2,x3,y3),d2=cross(x1,y1,x2,y2,x4,y4);
int d3=cross(x3,y3,x4,y4,x1,y1),d4=cross(x3,y3,x4,y4,x2,y2);
bool hit=false;
if(d1*d2<0&&d3*d4<0)hit=true;
if(d1==0&&onSeg(x1,y1,x2,y2,x3,y3))hit=true;
if(d2==0&&onSeg(x1,y1,x2,y2,x4,y4))hit=true;
if(d3==0&&onSeg(x3,y3,x4,y4,x1,y1))hit=true;
if(d4==0&&onSeg(x3,y3,x4,y4,x2,y2))hit=true;
cout<<(hit?"YES":"NO")<<"\\n";`),
    // Only the general straddle test: two collinear segments give all-zero cross products, and the product of zeros is not negative, so a genuine overlap is missed and a disjoint collinear pair is guessed at.
    wrong: [cpp(`long long x1,y1,x2,y2,x3,y3,x4,y4;
cin>>x1>>y1>>x2>>y2>>x3>>y3>>x4>>y4;
auto cross=[](long long ax,long long ay,long long bx,long long by,long long cx,long long cy){
long long v=(bx-ax)*(cy-ay)-(by-ay)*(cx-ax);return v>0?1:(v<0?-1:0);};
int d1=cross(x1,y1,x2,y2,x3,y3),d2=cross(x1,y1,x2,y2,x4,y4);
int d3=cross(x3,y3,x4,y4,x1,y1),d4=cross(x3,y3,x4,y4,x2,y2);
cout<<((d1*d2<=0&&d3*d4<=0)?"YES":"NO")<<"\\n";`)],
  },
  "picks-theorem-interior": {
    solution: cpp(`int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
long long twiceArea=0,boundary=0;
for(int i=0;i<n;++i){int jj=(i+1)%n;
twiceArea+=x[i]*y[jj]-x[jj]*y[i];
boundary+=__gcd(llabs(x[jj]-x[i]),llabs(y[jj]-y[i]));}
if(twiceArea<0)twiceArea=-twiceArea;
cout<<(twiceArea-boundary+2)/2<<"\\n";`),
    // Counting each edge's boundary points as the number of steps rather than gcd(|dx|,|dy|) -- correct for axis-parallel edges, wrong for any slanted one.
    wrong: [cpp(`int n;cin>>n;vector<long long>x(n),y(n);
for(int i=0;i<n;++i)cin>>x[i]>>y[i];
long long twiceArea=0,boundary=0;
for(int i=0;i<n;++i){int jj=(i+1)%n;
twiceArea+=x[i]*y[jj]-x[jj]*y[i];
boundary+=max(llabs(x[jj]-x[i]),llabs(y[jj]-y[i]));}
if(twiceArea<0)twiceArea=-twiceArea;
cout<<(twiceArea-boundary+2)/2<<"\\n";`)],
  },
  "grundy-subtraction-game": {
    solution: cpp(`int n,k;cin>>n>>k;vector<int>s(k);
for(auto&x:s)cin>>x;
vector<int>a(n);int mx=0;
for(auto&x:a){cin>>x;mx=max(mx,x);}
vector<int>g(mx+1,0);
for(int v=1;v<=mx;++v){vector<char>seen(k+2,0);
for(int t:s)if(t<=v){int gg=g[v-t];if(gg<=k+1)seen[gg]=1;}
int mex=0;while(mex<=k+1&&seen[mex])++mex;
g[v]=mex;}
int x=0;for(int v:a)x^=g[v];
cout<<(x?"First":"Second")<<"\\n";`),
    // Adding the pile Grundy numbers instead of XOR-ing them: a sum of 2 and 2 is non-zero while their XOR is zero, so a lost position is called a win.
    wrong: [cpp(`int n,k;cin>>n>>k;vector<int>s(k);
for(auto&x:s)cin>>x;
vector<int>a(n);int mx=0;
for(auto&x:a){cin>>x;mx=max(mx,x);}
vector<int>g(mx+1,0);
for(int v=1;v<=mx;++v){vector<char>seen(k+2,0);
for(int t:s)if(t<=v){int gg=g[v-t];if(gg<=k+1)seen[gg]=1;}
int mex=0;while(mex<=k+1&&seen[mex])++mex;
g[v]=mex;}
long long x=0;for(int v:a)x+=g[v];
cout<<(x?"First":"Second")<<"\\n";`)],
  },
  "polygon-diameter": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&[x,y]:p)cin>>x>>y;
sort(p.begin(),p.end());
p.erase(unique(p.begin(),p.end()),p.end());
int u=p.size();
auto cross=[](const pair<long long,long long>&o,const pair<long long,long long>&a,const pair<long long,long long>&b){
return (a.first-o.first)*(b.second-o.second)-(a.second-o.second)*(b.first-o.first);};
auto d2=[](const pair<long long,long long>&a,const pair<long long,long long>&b){
long long dx=a.first-b.first,dy=a.second-b.second;return dx*dx+dy*dy;};
if(u==1){cout<<0<<"\\n";return 0;}
vector<pair<long long,long long>>h(2*u);int k=0;
for(int i=0;i<u;++i){while(k>=2&&cross(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
int lower=k+1;
for(int i=u-2;i>=0;--i){while(k>=lower&&cross(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
h.resize(k-1);int m=h.size();
long long best=0;
if(m<=2){for(int i=0;i<m;++i)for(int jj=i+1;jj<m;++jj)best=max(best,d2(h[i],h[jj]));
cout<<best<<"\\n";return 0;}
int jj=1;
for(int i=0;i<m;++i){int ni=(i+1)%m;
while(llabs(cross(h[i],h[ni],h[(jj+1)%m]))>llabs(cross(h[i],h[ni],h[jj])))jj=(jj+1)%m;
best=max(best,max(d2(h[i],h[jj]),d2(h[ni],h[jj])));}
cout<<best<<"\\n";`),
    // Comparing only neighbouring hull vertices: that measures the longest EDGE, not the diameter.
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>p(n);
for(auto&[x,y]:p)cin>>x>>y;
sort(p.begin(),p.end());
p.erase(unique(p.begin(),p.end()),p.end());
int u=p.size();
auto cross=[](const pair<long long,long long>&o,const pair<long long,long long>&a,const pair<long long,long long>&b){
return (a.first-o.first)*(b.second-o.second)-(a.second-o.second)*(b.first-o.first);};
auto d2=[](const pair<long long,long long>&a,const pair<long long,long long>&b){
long long dx=a.first-b.first,dy=a.second-b.second;return dx*dx+dy*dy;};
if(u==1){cout<<0<<"\\n";return 0;}
vector<pair<long long,long long>>h(2*u);int k=0;
for(int i=0;i<u;++i){while(k>=2&&cross(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
int lower=k+1;
for(int i=u-2;i>=0;--i){while(k>=lower&&cross(h[k-2],h[k-1],p[i])<=0)--k;h[k++]=p[i];}
h.resize(k-1);int m=h.size();
long long best=0;
for(int i=0;i<m;++i)best=max(best,d2(h[i],h[(i+1)%m]));
cout<<best<<"\\n";`)],
  },
  "suffix-array-lrs": {
    solution: cpp(`string s;cin>>s;int n=s.size();
vector<int>sa(n),rk(n),tmp(n);
for(int i=0;i<n;++i){sa[i]=i;rk[i]=s[i];}
for(int len=1;;len<<=1){
auto cmp=[&](int a,int b){if(rk[a]!=rk[b])return rk[a]<rk[b];
int ra=a+len<n?rk[a+len]:-1,rb=b+len<n?rk[b+len]:-1;return ra<rb;};
sort(sa.begin(),sa.end(),cmp);
tmp[sa[0]]=0;
for(int i=1;i<n;++i)tmp[sa[i]]=tmp[sa[i-1]]+(cmp(sa[i-1],sa[i])?1:0);
rk=tmp;
if(rk[sa[n-1]]==n-1)break;
if(len>n)break;}
vector<int>pos(n);for(int i=0;i<n;++i)pos[sa[i]]=i;
int h=0,best=0;
for(int i=0;i<n;++i){if(pos[i]==0){h=0;continue;}
int j=sa[pos[i]-1];
while(i+h<n&&j+h<n&&s[i+h]==s[j+h])++h;
best=max(best,h);
if(h)--h;}
cout<<best<<"\\n";`),
    // Comparing each suffix with the one starting at the next INDEX rather than the next one in sorted order: the neighbours in sorted order are the only pair that can share a long prefix.
    wrong: [cpp(`string s;cin>>s;int n=s.size();int best=0;
for(int i=0;i+1<n;++i){int h=0;
while(i+1+h<n&&s[i+h]==s[i+1+h])++h;
best=max(best,h);}
cout<<best<<"\\n";`)],
  },
  "aho-corasick-count": {
    solution: cpp(`string s;cin>>s;int k;cin>>k;
vector<array<int,26>>nxt(1);nxt[0].fill(-1);
vector<long long>cnt(1,0);
for(int i=0;i<k;++i){string t;cin>>t;int cur=0;
for(char c:t){int d=c-'a';
if(nxt[cur][d]<0){array<int,26>fresh;fresh.fill(-1);nxt.push_back(fresh);cnt.push_back(0);nxt[cur][d]=(int)nxt.size()-1;}
cur=nxt[cur][d];}
++cnt[cur];}
int m=nxt.size();vector<int>fail(m,0);
queue<int>q;
for(int d=0;d<26;++d){if(nxt[0][d]<0)nxt[0][d]=0;else{fail[nxt[0][d]]=0;q.push(nxt[0][d]);}}
while(!q.empty()){int u=q.front();q.pop();
cnt[u]+=cnt[fail[u]];
for(int d=0;d<26;++d){int v=nxt[u][d];
if(v<0)nxt[u][d]=nxt[fail[u]][d];
else{fail[v]=nxt[fail[u]][d];q.push(v);}}}
long long total=0;int cur=0;
for(char c:s){cur=nxt[cur][c-'a'];total+=cnt[cur];}
cout<<total<<"\\n";`),
    // Counting only the pattern ending exactly at the current state, without adding what the failure chain already accumulated: a pattern that is a suffix of another is never seen.
    wrong: [cpp(`string s;cin>>s;int k;cin>>k;
vector<array<int,26>>nxt(1);nxt[0].fill(-1);
vector<long long>cnt(1,0);
for(int i=0;i<k;++i){string t;cin>>t;int cur=0;
for(char c:t){int d=c-'a';
if(nxt[cur][d]<0){array<int,26>fresh;fresh.fill(-1);nxt.push_back(fresh);cnt.push_back(0);nxt[cur][d]=(int)nxt.size()-1;}
cur=nxt[cur][d];}
++cnt[cur];}
int m=nxt.size();vector<int>fail(m,0);
queue<int>q;
for(int d=0;d<26;++d){if(nxt[0][d]<0)nxt[0][d]=0;else{fail[nxt[0][d]]=0;q.push(nxt[0][d]);}}
while(!q.empty()){int u=q.front();q.pop();
for(int d=0;d<26;++d){int v=nxt[u][d];
if(v<0)nxt[u][d]=nxt[fail[u]][d];
else{fail[v]=nxt[fail[u]][d];q.push(v);}}}
long long total=0;int cur=0;
for(char c:s){cur=nxt[cur][c-'a'];total+=cnt[cur];}
cout<<total<<"\\n";`)],
  },
  "subtree-distinct-colors": {
    solution: cpp(`int n;cin>>n;vector<int>col(n+1);
for(int i=1;i<=n;++i)cin>>col[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;
while(!st.empty()){int u=st.back();st.pop_back();order.push_back(u);
for(int v:g[u])if(!seen[v]){seen[v]=1;par[v]=u;st.push_back(v);}}}
vector<set<int>*>bag(n+1,nullptr);
vector<int>ans(n+1,0);
for(int i=n-1;i>=0;--i){int u=order[i];
if(!bag[u])bag[u]=new set<int>();
bag[u]->insert(col[u]);
ans[u]=(int)bag[u]->size();
int p=par[u];
if(p){if(!bag[p])bag[p]=new set<int>();
if(bag[p]->size()<bag[u]->size())swap(bag[p],bag[u]);
for(int c:*bag[u])bag[p]->insert(c);
bag[u]->clear();}}
for(int v=1;v<=n;++v)cout<<ans[v]<<(v<n?" ":"\\n");`),
    // Adding up the children's counts and one for the vertex itself: a colour shared by two children gets counted twice.
    wrong: [cpp(`int n;cin>>n;vector<int>col(n+1);
for(int i=1;i<=n;++i)cin>>col[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>par(n+1,0),order;order.reserve(n);
{vector<int>st{1};vector<char>seen(n+1,0);seen[1]=1;
while(!st.empty()){int u=st.back();st.pop_back();order.push_back(u);
for(int v:g[u])if(!seen[v]){seen[v]=1;par[v]=u;st.push_back(v);}}}
vector<long long>ans(n+1,0);
for(int i=n-1;i>=0;--i){int u=order[i];++ans[u];
int p=par[u];if(p)ans[p]+=ans[u];}
for(int v=1;v<=n;++v)cout<<ans[v]<<(v<n?" ":"\\n");`)],
  },
  "centroid-paths-within-k": {
    solution: cpp(`int n;long long k;cin>>n>>k;
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<char>dead(n+1,0);vector<int>sz(n+1,0);
long long answer=0;
vector<int>stack1,depths;
auto calcSizes=[&](int root){
stack1.clear();vector<pair<int,int>>st;st.push_back({root,0});
vector<int>ord;
{vector<int>s2{root};vector<int>par(1,0);
vector<pair<int,int>>work;work.push_back({root,0});
ord.clear();vector<int>pr(n+1,0);pr[root]=0;
vector<int>simple{root};vector<char>vis(n+1,0);vis[root]=1;
while(!simple.empty()){int u=simple.back();simple.pop_back();ord.push_back(u);
for(int v:g[u])if(!dead[v]&&!vis[v]){vis[v]=1;pr[v]=u;simple.push_back(v);}}
for(int i=(int)ord.size()-1;i>=0;--i){int u=ord[i];sz[u]=1;
for(int v:g[u])if(!dead[v]&&v!=pr[u])sz[u]+=sz[v];}}
return ord;};
auto findCentroid=[&](int root,const vector<int>&ord){
int total=sz[root];int best=root;long long bestVal=LLONG_MAX;
vector<int>pr(n+1,0);vector<char>vis(n+1,0);
vector<int>simple{root};vis[root]=1;
while(!simple.empty()){int u=simple.back();simple.pop_back();
for(int v:g[u])if(!dead[v]&&!vis[v]){vis[v]=1;pr[v]=u;simple.push_back(v);}}
for(int u:ord){long long worst=total-sz[u];
for(int v:g[u])if(!dead[v]&&v!=pr[u])worst=max(worst,(long long)sz[v]);
if(worst<bestVal){bestVal=worst;best=u;}}
return best;};
auto gather=[&](int start,int banned){
depths.clear();
vector<pair<int,int>>st;st.push_back({start,1});
vector<char>vis(0);
vector<int>pr(n+1,-1);pr[start]=banned;
vector<pair<int,int>>simple;simple.push_back({start,1});
while(!simple.empty()){auto[u,d]=simple.back();simple.pop_back();
depths.push_back(d);
for(int v:g[u])if(!dead[v]&&v!=pr[u]){pr[v]=u;simple.push_back({v,d+1});}}};
auto countPairs=[&](vector<int>&d)->long long{
sort(d.begin(),d.end());
long long total=0;int j=(int)d.size()-1;
for(int i=0;i<(int)d.size();++i){if(j>i&&d[i]+d[j]>k){}
while(j>i&&d[i]+d[j]>k)--j;
if(j>i)total+=j-i;else break;}
return total;};
vector<int>queueC{1};
while(!queueC.empty()){int root=queueC.back();queueC.pop_back();
vector<int>ord=calcSizes(root);
int c=findCentroid(root,ord);
vector<int>all;all.push_back(0);
for(int v:g[c])if(!dead[v]){gather(v,c);
vector<int>part=depths;
answer-=countPairs(part);
for(int d:part)all.push_back(d);}
answer+=countPairs(all);
dead[c]=1;
for(int v:g[c])if(!dead[v])queueC.push_back(v);}
cout<<answer<<"\\n";`),
    // Counting the pairs inside one branch twice instead of subtracting them: without the correction, two vertices in the same subtree of the centroid are measured as if the path went through it.
    wrong: [cpp(`int n;long long k;cin>>n>>k;
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
long long answer=0;
for(int s=1;s<=n;++s){vector<int>d(n+1,-1);d[s]=0;
queue<int>q;q.push(s);
while(!q.empty()){int u=q.front();q.pop();
for(int v:g[u])if(d[v]<0){d[v]=d[u]+1;q.push(v);}}
for(int v=1;v<=n;++v)if(v!=s&&d[v]<=k)++answer;}
cout<<answer<<"\\n";`)],
  },
  "convex-hull-trick-dp": {
    solution: cpp(`long long n,c;cin>>n>>c;vector<long long>h(n);
for(auto&x:h)cin>>x;
if(n==1){cout<<0<<"\\n";return 0;}
vector<long long>dp(n,0);
vector<long long>ms,bs;int head=0;
auto bad=[&](int a,int b,int d){
return (__int128)(bs[d]-bs[a])*(ms[a]-ms[b])<=(__int128)(bs[b]-bs[a])*(ms[a]-ms[d]);};
auto add=[&](long long m,long long b){
ms.push_back(m);bs.push_back(b);
while((int)ms.size()-head>=3&&bad((int)ms.size()-3,(int)ms.size()-2,(int)ms.size()-1)){
ms.erase(ms.end()-2);bs.erase(bs.end()-2);}};
auto query=[&](long long x){
while((int)ms.size()-head>=2&&ms[head]*x+bs[head]>=ms[head+1]*x+bs[head+1])++head;
return ms[head]*x+bs[head];};
add(-2*h[0],dp[0]+h[0]*h[0]);
for(int i=1;i<n;++i){
dp[i]=query(h[i])+h[i]*h[i]+c;
add(-2*h[i],dp[i]+h[i]*h[i]);}
cout<<dp[n-1]<<"\\n";`),
    // Only ever stepping to the next pillar: correct when c is zero and hopeless once a jump has a fixed price.
    wrong: [cpp(`long long n,c;cin>>n>>c;vector<long long>h(n);
for(auto&x:h)cin>>x;
long long total=0;
for(int i=1;i<n;++i)total+=(h[i]-h[i-1])*(h[i]-h[i-1])+c;
cout<<total<<"\\n";`)],
  },
  "divide-conquer-dp-split": {
    solution: cpp(`int n,k;cin>>n>>k;vector<long long>pre(n+1,0);
for(int i=1;i<=n;++i){long long x;cin>>x;pre[i]=pre[i-1]+x;}
const long long INF=(long long)4e18;
auto cost=[&](int l,int r){long long s=pre[r]-pre[l-1];return s*s;};
vector<long long>prev(n+1,INF),cur(n+1,INF);
prev[0]=0;
for(int t=1;t<=k;++t){
fill(cur.begin(),cur.end(),INF);
function<void(int,int,int,int)>solve=[&](int lo,int hi,int optLo,int optHi){
if(lo>hi)return;int mid=(lo+hi)/2;
long long best=INF;int bestJ=optLo;
for(int jj=optLo;jj<=min(mid-1,optHi);++jj){
if(prev[jj]==INF)continue;
long long v=prev[jj]+cost(jj+1,mid);
if(v<best){best=v;bestJ=jj;}}
cur[mid]=best;
solve(lo,mid-1,optLo,bestJ);solve(mid+1,hi,bestJ,optHi);};
solve(t,n,t-1,n-1);
prev=cur;}
cout<<prev[n]<<"\\n";`),
    // Cutting the array into parts of equal length: it looks balanced and ignores that the cost depends on the totals, not the counts.
    wrong: [cpp(`int n,k;cin>>n>>k;vector<long long>a(n);
for(auto&x:a)cin>>x;
long long total=0;
for(int t=0;t<k;++t){int l=(long long)n*t/k,r=(long long)n*(t+1)/k;
long long s=0;for(int i=l;i<r;++i)s+=a[i];
total+=s*s;}
cout<<total<<"\\n";`)],
  },
  "slope-trick-nondecreasing": {
    solution: cpp(`int n;cin>>n;priority_queue<long long>pq;long long total=0;
for(int i=0;i<n;++i){long long a;cin>>a;
pq.push(a);
if(pq.top()>a){total+=pq.top()-a;pq.pop();pq.push(a);}}
cout<<total<<"\\n";`),
    // Only ever raising values to the running maximum: never lowering an outlier costs more whenever one tall element sits early in the array.
    wrong: [cpp(`int n;cin>>n;long long total=0,run=LLONG_MIN;
for(int i=0;i<n;++i){long long a;cin>>a;
if(a<run)total+=run-a;else run=a;}
cout<<total<<"\\n";`)],
  },
  "dinic-max-flow": {
    solution: cpp(`int n,m;cin>>n>>m;
struct E{int to;long long cap;};
vector<E>edges;vector<vector<int>>g(n+1);
auto addEdge=[&](int a,int b,long long c){
g[a].push_back(edges.size());edges.push_back({b,c});
g[b].push_back(edges.size());edges.push_back({a,0});};
for(int i=0;i<m;++i){int a,b;long long c;cin>>a>>b>>c;addEdge(a,b,c);}
if(n==1){cout<<0<<"\\n";return 0;}
vector<int>level(n+1),iter(n+1);
auto bfs=[&](){fill(level.begin(),level.end(),-1);level[1]=0;
queue<int>q;q.push(1);
while(!q.empty()){int u=q.front();q.pop();
for(int id:g[u]){if(edges[id].cap>0&&level[edges[id].to]<0){level[edges[id].to]=level[u]+1;q.push(edges[id].to);}}}
return level[n]>=0;};
function<long long(int,long long)>dfs=[&](int u,long long f)->long long{
if(u==n)return f;
for(int&i=iter[u];i<(int)g[u].size();++i){int id=g[u][i];int v=edges[id].to;
if(edges[id].cap>0&&level[v]==level[u]+1){
long long d=dfs(v,min(f,edges[id].cap));
if(d>0){edges[id].cap-=d;edges[id^1].cap+=d;return d;}}}
return 0;};
long long total=0;
while(bfs()){fill(iter.begin(),iter.end(),0);
long long f;while((f=dfs(1,(long long)4e18))>0)total+=f;}
cout<<total<<"\\n";`),
    // Augmenting without residual reverse edges: the algorithm cannot undo an early path and stops one unit short on the second sample.
    wrong: [cpp(`int n,m;cin>>n>>m;
struct E{int to;long long cap;};
vector<E>edges;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int a,b;long long c;cin>>a>>b>>c;
g[a].push_back(edges.size());edges.push_back({b,c});}
if(n==1){cout<<0<<"\\n";return 0;}
long long total=0;
while(true){vector<int>from(n+1,-1);vector<char>vis(n+1,0);vis[1]=1;
queue<int>q;q.push(1);
while(!q.empty()){int u=q.front();q.pop();
for(int id:g[u])if(edges[id].cap>0&&!vis[edges[id].to]){vis[edges[id].to]=1;from[edges[id].to]=id;q.push(edges[id].to);}}
if(!vis[n])break;
long long f=(long long)4e18;
for(int v=n;v!=1;){int id=from[v];f=min(f,edges[id].cap);
int u=1;for(int w=1;w<=n;++w)for(int e2:g[w])if(e2==id)u=w;
v=u;}
for(int v=n;v!=1;){int id=from[v];edges[id].cap-=f;
int u=1;for(int w=1;w<=n;++w)for(int e2:g[w])if(e2==id)u=w;
v=u;}
total+=f;}
cout<<total<<"\\n";`)],
  },
  "fenwick-kth-element": {
    solution: cpp(`int q;cin>>q;const int M=1<<20;
vector<int>bit(M+1,0);long long size=0;
auto add=[&](int p,int d){for(;p<=M;p+=p&-p)bit[p]+=d;};
while(q--){int type,x;cin>>type>>x;
if(type==1){add(x,1);++size;}
else if(type==2){add(x,-1);--size;}
else{if(x>size){cout<<-1<<"\\n";continue;}
int pos=0,rem=x;
for(int step=M;step>0;step>>=1){
if(pos+step<=M&&bit[pos+step]<rem){pos+=step;rem-=bit[pos];}}
cout<<pos+1<<"\\n";}}`),
    // Descending on "<= rem" instead of "< rem" lands one position past the answer whenever the running count hits k exactly.
    wrong: [cpp(`int q;cin>>q;const int M=1<<20;
vector<int>bit(M+1,0);long long size=0;
auto add=[&](int p,int d){for(;p<=M;p+=p&-p)bit[p]+=d;};
while(q--){int type,x;cin>>type>>x;
if(type==1){add(x,1);++size;}
else if(type==2){add(x,-1);--size;}
else{if(x>size){cout<<-1<<"\\n";continue;}
int pos=0,rem=x;
for(int step=M;step>0;step>>=1){
if(pos+step<=M&&bit[pos+step]<=rem){pos+=step;rem-=bit[pos];}}
cout<<pos+1<<"\\n";}}`)],
  },
  "ntt-polynomial-multiply": {
    solution: cpp(`const long long MOD=998244353,G=3;
auto pw=[&](long long b,long long e){long long r=1;b%=MOD;
while(e){if(e&1)r=r*b%MOD;b=b*b%MOD;e>>=1;}return r;};
function<void(vector<long long>&,bool)>ntt=[&](vector<long long>&a,bool inv){
int n=a.size();
for(int i=1,jj=0;i<n;++i){int bit=n>>1;
for(;jj&bit;bit>>=1)jj^=bit;
jj^=bit;if(i<jj)swap(a[i],a[jj]);}
for(int len=2;len<=n;len<<=1){
long long w=pw(G,(MOD-1)/len);
if(inv)w=pw(w,MOD-2);
for(int i=0;i<n;i+=len){long long cur=1;
for(int jj=0;jj<len/2;++jj){
long long u=a[i+jj],v=a[i+jj+len/2]*cur%MOD;
a[i+jj]=(u+v)%MOD;a[i+jj+len/2]=(u-v%MOD+MOD)%MOD;
cur=cur*w%MOD;}}}
if(inv){long long ninv=pw(n,MOD-2);
for(auto&x:a)x=x*ninv%MOD;}};
int n,m;cin>>n>>m;
vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;
for(auto&x:b)cin>>x;
int need=n+m-1,sz=1;while(sz<need)sz<<=1;
a.resize(sz,0);b.resize(sz,0);
ntt(a,false);ntt(b,false);
for(int i=0;i<sz;++i)a[i]=a[i]*b[i]%MOD;
ntt(a,true);
for(int i=0;i<need;++i)cout<<a[i]<<(i+1<need?" ":"\\n");`),
    // Multiplying the coefficient arrays entry by entry: that is what a transform makes legal in value space, and it is nonsense in coefficient space.
    wrong: [cpp(`const long long MOD=998244353;
int n,m;cin>>n>>m;
vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;
for(auto&x:b)cin>>x;
int need=n+m-1;
vector<long long>c(need,0);
for(int i=0;i<need;++i){long long u=i<n?a[i]:0,v=i<m?b[i]:0;c[i]=u*v%MOD;}
for(int i=0;i<need;++i)cout<<c[i]<<(i+1<need?" ":"\\n");`)],
  },
  "z-function-sum": {
    solution: cpp(`string s;cin>>s;int n=s.size();
vector<int>z(n,0);z[0]=n;
int l=0,r=0;
for(int i=1;i<n;++i){int k=0;
if(i<r)k=min(r-i,z[i-l]);
while(i+k<n&&s[k]==s[i+k])++k;
z[i]=k;
if(i+k>r){l=i;r=i+k;}}
long long total=0;for(int i=0;i<n;++i)total+=z[i];
cout<<total<<"\\n";`),
    // Setting z_1 to 0 instead of |s|: the statement fixes that convention and the sum comes out short by the length of the string.
    wrong: [cpp(`string s;cin>>s;int n=s.size();
vector<int>z(n,0);
int l=0,r=0;
for(int i=1;i<n;++i){int k=0;
if(i<r)k=min(r-i,z[i-l]);
while(i+k<n&&s[k]==s[i+k])++k;
z[i]=k;
if(i+k>r){l=i;r=i+k;}}
long long total=0;for(int i=0;i<n;++i)total+=z[i];
cout<<total<<"\\n";`)],
  },
  "diff-array-range-add": {
    solution: cpp(`int n,q;cin>>n>>q;vector<long long>d(n+2,0);
while(q--){int l,r;long long v;cin>>l>>r>>v;d[l]+=v;d[r+1]-=v;}
long long run=0;
for(int i=1;i<=n;++i){run+=d[i];cout<<run<<(i<n?" ":"\\n");}`),
    // Recording the addition but never cancelling it: every update runs to the end of the array.
    wrong: [cpp(`int n,q;cin>>n>>q;vector<long long>d(n+2,0);
while(q--){int l,r;long long v;cin>>l>>r>>v;d[l]+=v;}
long long run=0;
for(int i=1;i<=n;++i){run+=d[i];cout<<run<<(i<n?" ":"\\n");}`)],
  },
  "prefix-sum-2d": {
    solution: cpp(`int n,m,q;cin>>n>>m>>q;
vector<vector<long long>>p(n+1,vector<long long>(m+1,0));
for(int i=1;i<=n;++i)for(int jj=1;jj<=m;++jj){long long x;cin>>x;
p[i][jj]=x+p[i-1][jj]+p[i][jj-1]-p[i-1][jj-1];}
while(q--){int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;
cout<<p[r2][c2]-p[r1-1][c2]-p[r2][c1-1]+p[r1-1][c1-1]<<"\\n";}`),
    // Subtracting the overlapping corner instead of adding it back: the intersection of the two strips is removed twice.
    wrong: [cpp(`int n,m,q;cin>>n>>m>>q;
vector<vector<long long>>p(n+1,vector<long long>(m+1,0));
for(int i=1;i<=n;++i)for(int jj=1;jj<=m;++jj){long long x;cin>>x;
p[i][jj]=x+p[i-1][jj]+p[i][jj-1]-p[i-1][jj-1];}
while(q--){int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;
cout<<p[r2][c2]-p[r1-1][c2]-p[r2][c1-1]-p[r1-1][c1-1]<<"\\n";}`)],
  },
  "sliding-window-min": {
    solution: cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
deque<int>dq;vector<long long>out;
for(int i=0;i<n;++i){
while(!dq.empty()&&a[dq.back()]>=a[i])dq.pop_back();
dq.push_back(i);
if(dq.front()<=i-k)dq.pop_front();
if(i>=k-1)out.push_back(a[dq.front()]);}
for(size_t i=0;i<out.size();++i)cout<<out[i]<<(i+1<out.size()?" ":"\\n");`),
    // Never dropping the element that has slid out of the window: an old minimum keeps being reported long after it left.
    wrong: [cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
deque<int>dq;vector<long long>out;
for(int i=0;i<n;++i){
while(!dq.empty()&&a[dq.back()]>=a[i])dq.pop_back();
dq.push_back(i);
if(i>=k-1)out.push_back(a[dq.front()]);}
for(size_t i=0;i<out.size();++i)cout<<out[i]<<(i+1<out.size()?" ":"\\n");`)],
  },
  "longest-k-distinct": {
    solution: cpp(`int n,k;cin>>n>>k;vector<int>a(n);for(auto&x:a)cin>>x;
unordered_map<int,int>cnt;int left=0,best=0;
for(int r=0;r<n;++r){++cnt[a[r]];
while((int)cnt.size()>k){if(--cnt[a[left]]==0)cnt.erase(a[left]);++left;}
best=max(best,r-left+1);}
cout<<best<<"\\n";`),
    // "At most k" written as a shrink-while-at-least-k loop: the window is squeezed down to k-1 distinct values and every answer comes out one value's worth too short.
    wrong: [cpp(`int n,k;cin>>n>>k;vector<int>a(n);for(auto&x:a)cin>>x;
unordered_map<int,int>cnt;int left=0,best=0;
for(int r=0;r<n;++r){++cnt[a[r]];
while((int)cnt.size()>=k&&left<=r){if(--cnt[a[left]]==0)cnt.erase(a[left]);++left;}
best=max(best,r-left+1);}
cout<<best<<"\\n";`)],
  },
  "max-submatrix-sum": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(auto&row:a)for(auto&x:row)cin>>x;
long long best=LLONG_MIN;
for(int top=0;top<n;++top){vector<long long>col(m,0);
for(int bot=top;bot<n;++bot){
for(int c=0;c<m;++c)col[c]+=a[bot][c];
long long run=LLONG_MIN;
for(int c=0;c<m;++c){run=(run<0?col[c]:run+col[c]);best=max(best,run);}}}
cout<<best<<"\\n";`),
    // Starting the running sum at zero makes the empty rectangle a legal answer, so an all-negative matrix reports 0.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<long long>>a(n,vector<long long>(m));
for(auto&row:a)for(auto&x:row)cin>>x;
long long best=0;
for(int top=0;top<n;++top){vector<long long>col(m,0);
for(int bot=top;bot<n;++bot){
for(int c=0;c<m;++c)col[c]+=a[bot][c];
long long run=0;
for(int c=0;c<m;++c){run=max(0LL,run+col[c]);best=max(best,run);}}}
cout<<best<<"\\n";`)],
  },
  "multi-source-bfs": {
    solution: cpp(`int n,m;cin>>n>>m;vector<string>g(n);
for(auto&r:g)cin>>r;
vector<vector<int>>d(n,vector<int>(m,-1));
queue<pair<int,int>>q;
for(int i=0;i<n;++i)for(int jj=0;jj<m;++jj)if(g[i][jj]=='1'){d[i][jj]=0;q.push({i,jj});}
int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
while(!q.empty()){auto[x,y]=q.front();q.pop();
for(int t=0;t<4;++t){int nx=x+dx[t],ny=y+dy[t];
if(nx<0||ny<0||nx>=n||ny>=m||d[nx][ny]>=0)continue;
d[nx][ny]=d[x][y]+1;q.push({nx,ny});}}
for(int i=0;i<n;++i)for(int jj=0;jj<m;++jj)cout<<d[i][jj]<<(jj+1<m?" ":"\\n");`),
    // Seeding the queue with only the first source found: every other source is treated as an ordinary cell.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<string>g(n);
for(auto&r:g)cin>>r;
vector<vector<int>>d(n,vector<int>(m,-1));
queue<pair<int,int>>q;
bool placed=false;
for(int i=0;i<n&&!placed;++i)for(int jj=0;jj<m&&!placed;++jj)if(g[i][jj]=='1'){d[i][jj]=0;q.push({i,jj});placed=true;}
int dx[4]={1,-1,0,0},dy[4]={0,0,1,-1};
while(!q.empty()){auto[x,y]=q.front();q.pop();
for(int t=0;t<4;++t){int nx=x+dx[t],ny=y+dy[t];
if(nx<0||ny<0||nx>=n||ny>=m||d[nx][ny]>=0)continue;
d[nx][ny]=d[x][y]+1;q.push({nx,ny});}}
for(int i=0;i<n;++i)for(int jj=0;jj<m;++jj)cout<<d[i][jj]<<(jj+1<m?" ":"\\n");`)],
  },
  "graph-girth": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
const int INF=1e9;int best=INF;
for(int s=1;s<=n;++s){vector<int>d(n+1,-1),par(n+1,-1);
d[s]=0;queue<int>q;q.push(s);
while(!q.empty()){int u=q.front();q.pop();
for(int v:g[u]){
if(d[v]<0){d[v]=d[u]+1;par[v]=u;q.push(v);}
else if(v!=par[u])best=min(best,d[u]+d[v]+1);}}}
cout<<(best==INF?-1:best)<<"\\n";`),
    // Reporting the length of whatever cycle a depth-first walk stumbles on: it is a cycle, just not the shortest one.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>depth(n+1,-1),par(n+1,-1);int best=1e9;
for(int s=1;s<=n;++s){if(depth[s]>=0)continue;
depth[s]=0;vector<int>st{s};
while(!st.empty()){int u=st.back();st.pop_back();
for(int v:g[u]){
if(depth[v]<0){depth[v]=depth[u]+1;par[v]=u;st.push_back(v);}
else if(v!=par[u])best=min(best,abs(depth[u]-depth[v])+1);}}}
cout<<(best==1000000000?-1:best)<<"\\n";`)],
  },
  "tree-kth-ancestor": {
    solution: cpp(`int n,q;cin>>n>>q;
int LOG=1;while((1<<LOG)<=n)++LOG;
vector<vector<int>>up(LOG,vector<int>(n+1,0));
vector<int>dep(n+1,0);
for(int v=2;v<=n;++v){int p;cin>>p;up[0][v]=p;dep[v]=0;}
up[0][1]=0;
for(int v=2;v<=n;++v)dep[v]=dep[up[0][v]]+1;
for(int k=1;k<LOG;++k)for(int v=1;v<=n;++v)up[k][v]=up[k-1][up[k-1][v]];
while(q--){long long v,k;cin>>v>>k;
if(k>dep[v]){cout<<-1<<"\\n";continue;}
int cur=(int)v;
for(int b=0;b<LOG&&cur;++b)if(k>>b&1)cur=up[b][cur];
cout<<cur<<"\\n";}`),
    // Storing the root as its own parent removes the only signal that the walk ran off the top, so an impossible query silently returns the root.
    wrong: [cpp(`int n,q;cin>>n>>q;
int LOG=1;while((1<<LOG)<=n)++LOG;
vector<vector<int>>up(LOG,vector<int>(n+1,1));
vector<int>dep(n+1,0);
for(int v=2;v<=n;++v){int p;cin>>p;up[0][v]=p;}
up[0][1]=1;
for(int v=2;v<=n;++v)dep[v]=dep[up[0][v]]+1;
for(int k=1;k<LOG;++k)for(int v=1;v<=n;++v)up[k][v]=up[k-1][up[k-1][v]];
while(q--){long long v,k;cin>>v>>k;
int cur=(int)v;
for(int b=0;b<LOG;++b)if(k>>b&1)cur=up[b][cur];
cout<<cur<<"\\n";}`)],
  },
  "interval-stabbing": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&[l,r]:v)cin>>l>>r;
sort(v.begin(),v.end(),[](const auto&a,const auto&b){return a.second<b.second;});
long long last=LLONG_MIN;int total=0;
for(auto&[l,r]:v)if(l>last){++total;last=r;}
cout<<total<<"\\n";`),
    // Sorting by left end and stabbing there: the point lands as far left as it can, which covers the fewest later intervals rather than the most.
    wrong: [cpp(`int n;cin>>n;vector<pair<long long,long long>>v(n);
for(auto&[l,r]:v)cin>>l>>r;
sort(v.begin(),v.end());
long long last=LLONG_MIN;int total=0;
for(auto&[l,r]:v)if(l>last||last>r){++total;last=l;}
cout<<total<<"\\n";`)],
  },
  "job-deadline-profit": {
    solution: cpp(`int n;cin>>n;vector<pair<int,long long>>job(n);
for(auto&[d,p]:job)cin>>d>>p;
sort(job.begin(),job.end(),[](const auto&a,const auto&b){return a.second>b.second;});
vector<int>par(n+2);for(int i=0;i<=n+1;++i)par[i]=i;
function<int(int)>find=[&](int v){while(par[v]!=v){par[v]=par[par[v]];v=par[v];}return v;};
long long total=0;
for(auto&[d,p]:job){int slot=find(d);
if(slot>0){total+=p;par[slot]=find(slot-1);}}
cout<<total<<"\\n";`),
    // Sorting by deadline instead of by profit: the earliest slots go to whichever job is due soonest, not to whichever pays most.
    wrong: [cpp(`int n;cin>>n;vector<pair<int,long long>>job(n);
for(auto&[d,p]:job)cin>>d>>p;
sort(job.begin(),job.end());
vector<char>used(n+2,0);long long total=0;
for(auto&[d,p]:job){for(int s=d;s>=1;--s)if(!used[s]){used[s]=1;total+=p;break;}}
cout<<total<<"\\n";`)],
  },
  "largest-concatenation": {
    solution: cpp(`int n;cin>>n;vector<string>v(n);for(auto&s:v)cin>>s;
sort(v.begin(),v.end(),[](const string&a,const string&b){return a+b>b+a;});
if(v[0]=="0"){cout<<0<<"\\n";return 0;}
string out;for(auto&s:v)out+=s;
cout<<out<<"\\n";`),
    // Sorting by numeric value: 30 outranks 3 as a number and yet must follow it in the concatenation.
    wrong: [cpp(`int n;cin>>n;vector<long long>v(n);for(auto&x:v)cin>>x;
sort(v.begin(),v.end(),greater<long long>());
string out;for(auto x:v)out+=to_string(x);
if(out[0]=='0'){cout<<0<<"\\n";return 0;}
cout<<out<<"\\n";`)],
  },
  "ternary-search-lines": {
    solution: cpp(`long long n,L,R;cin>>n>>L>>R;
vector<long long>a(n),b(n);
for(int i=0;i<n;++i)cin>>a[i]>>b[i];
auto F=[&](long long x){long long best=LLONG_MIN;
for(int i=0;i<n;++i)best=max(best,a[i]*x+b[i]);return best;};
long long lo=L,hi=R;
while(hi-lo>2){long long m1=lo+(hi-lo)/3,m2=hi-(hi-lo)/3;
if(F(m1)<=F(m2))hi=m2-1;else lo=m1+1;}
long long best=LLONG_MAX;
for(long long x=lo;x<=hi;++x)best=min(best,F(x));
cout<<best<<"\\n";`),
    // Checking only the two endpoints: for a convex function those are the two WORST places to look.
    wrong: [cpp(`long long n,L,R;cin>>n>>L>>R;
vector<long long>a(n),b(n);
for(int i=0;i<n;++i)cin>>a[i]>>b[i];
auto F=[&](long long x){long long best=LLONG_MIN;
for(int i=0;i<n;++i)best=max(best,a[i]*x+b[i]);return best;};
cout<<min(F(L),F(R))<<"\\n";`)],
  },
  "max-min-spacing": {
    solution: cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
auto fits=[&](long long d){int taken=1;long long last=a[0];
for(int i=1;i<n;++i)if(a[i]-last>=d){++taken;last=a[i];}
return taken>=k;};
long long lo=0,hi=a[n-1]-a[0],best=0;
while(lo<=hi){long long mid=lo+(hi-lo)/2;
if(fits(mid)){best=mid;lo=mid+1;}else hi=mid-1;}
cout<<best<<"\\n";`),
    // Spreading the choices evenly by index: the places are not evenly spaced, so equal index steps do not give equal distances.
    wrong: [cpp(`int n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long best=LLONG_MAX;long long prev=a[0];
for(int t=1;t<k;++t){long long idx=(long long)t*(n-1)/(k-1);
best=min(best,a[idx]-prev);prev=a[idx];}
cout<<best<<"\\n";`)],
  },
  "meet-in-middle-subset": {
    solution: cpp(`int n;long long S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;
int h=n/2;
vector<long long>A,B;
for(int mask=0;mask<(1<<h);++mask){long long s=0;
for(int i=0;i<h;++i)if(mask>>i&1)s+=a[i];
if(s<=S)A.push_back(s);}
int rest=n-h;
for(int mask=0;mask<(1<<rest);++mask){long long s=0;
for(int i=0;i<rest;++i)if(mask>>i&1)s+=a[h+i];
if(s<=S)B.push_back(s);}
sort(B.begin(),B.end());
long long best=0;
for(long long x:A){long long room=S-x;
auto it=upper_bound(B.begin(),B.end(),room);
if(it!=B.begin())best=max(best,x+*prev(it));}
cout<<best<<"\\n";`),
    // Filling greedily from the largest item down: it is the obvious approach and it stops one combination short whenever several small items beat one big one.
    wrong: [cpp(`int n;long long S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.rbegin(),a.rend());
long long best=0;
for(long long x:a)if(best+x<=S)best+=x;
cout<<best<<"\\n";`)],
  },
  "longest-common-substring": {
    solution: cpp(`string s,t;cin>>s>>t;int n=s.size(),m=t.size();
vector<vector<int>>dp(n+1,vector<int>(m+1,0));
int best=0;
for(int i=1;i<=n;++i)for(int jj=1;jj<=m;++jj){
if(s[i-1]==t[jj-1]){dp[i][jj]=dp[i-1][jj-1]+1;best=max(best,dp[i][jj]);}}
cout<<best<<"\\n";`),
    // Computing the longest common SUBSEQUENCE: it carries the match across a mismatch, which a substring is not allowed to do.
    wrong: [cpp(`string s,t;cin>>s>>t;int n=s.size(),m=t.size();
vector<vector<int>>dp(n+1,vector<int>(m+1,0));
for(int i=1;i<=n;++i)for(int jj=1;jj<=m;++jj){
if(s[i-1]==t[jj-1])dp[i][jj]=dp[i-1][jj-1]+1;
else dp[i][jj]=max(dp[i-1][jj],dp[i][jj-1]);}
cout<<dp[n][m]<<"\\n";`)],
  },
  "sorted-squares": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>out(n);int l=0,r=n-1;
for(int i=n-1;i>=0;--i){
long long lv=a[l]*a[l],rv=a[r]*a[r];
if(lv>=rv){out[i]=lv;++l;}else{out[i]=rv;--r;}}
for(int i=0;i<n;++i)cout<<out[i]<<(i+1<n?" ":"\\n");`),
    // Squaring in place and trusting the input order: it was sorted before the squaring, not after.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=0;i<n;++i)cout<<a[i]*a[i]<<(i+1<n?" ":"\\n");`)],
  },
  "min-swaps-group-ones": {
    solution: cpp(`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
int k=0;for(int x:a)k+=x;
if(k==0){cout<<0<<"\\n";return 0;}
int ones=0,best=0;
for(int i=0;i<k;++i)ones+=a[i];
best=ones;
for(int i=k;i<n;++i){ones+=a[i]-a[i-k];best=max(best,ones);}
cout<<k-best<<"\\n";`),
    // Counting the zeros lying between the first and last one: that assumes the block must stay where the ones already are, which is not required.
    wrong: [cpp(`int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;
int first=-1,last=-1,zeros=0;
for(int i=0;i<n;++i)if(a[i]==1){if(first<0)first=i;last=i;}
if(first<0){cout<<0<<"\\n";return 0;}
for(int i=first;i<=last;++i)if(a[i]==0)++zeros;
cout<<zeros<<"\\n";`)],
  },
  "longest-ones-k-flips": {
    solution: cpp(`int n,k;cin>>n>>k;vector<int>a(n);for(auto&x:a)cin>>x;
int left=0,zeros=0,best=0;
for(int r=0;r<n;++r){if(a[r]==0)++zeros;
while(zeros>k){if(a[left]==0)--zeros;++left;}
best=max(best,r-left+1);}
cout<<best<<"\\n";`),
    // "At most k" shrunk with a >= test instead of >: the window is squeezed to k-1 zeros and every answer comes up short.
    wrong: [cpp(`int n,k;cin>>n>>k;vector<int>a(n);for(auto&x:a)cin>>x;
int left=0,zeros=0,best=0;
for(int r=0;r<n;++r){if(a[r]==0)++zeros;
while(zeros>=k&&left<=r){if(a[left]==0)--zeros;++left;}
best=max(best,r-left+1);}
cout<<best<<"\\n";`)],
  },
  "min-window-substring": {
    solution: cpp(`string s,t;cin>>s>>t;
vector<int>need(26,0);for(char c:t)++need[c-'a'];
int missing=t.size();
vector<int>have(26,0);
int left=0,best=INT_MAX;
for(int r=0;r<(int)s.size();++r){int d=s[r]-'a';
if(have[d]<need[d])--missing;
++have[d];
while(missing==0){best=min(best,r-left+1);
int e=s[left]-'a';--have[e];
if(have[e]<need[e])++missing;
++left;}}
cout<<(best==INT_MAX?0:best)<<"\\n";`),
    // Treating t as a set of letters: one 'a' then satisfies a requirement for two.
    wrong: [cpp(`string s,t;cin>>s>>t;
vector<char>need(26,0);int distinct=0;
for(char c:t)if(!need[c-'a']){need[c-'a']=1;++distinct;}
vector<int>have(26,0);int got=0,left=0,best=INT_MAX;
for(int r=0;r<(int)s.size();++r){int d=s[r]-'a';
if(need[d]&&have[d]==0)++got;
++have[d];
while(got==distinct){best=min(best,r-left+1);
int e=s[left]-'a';--have[e];
if(need[e]&&have[e]==0)--got;
++left;}}
cout<<(best==INT_MAX?0:best)<<"\\n";`)],
  },
  "bs-ship-capacity": {
    solution: cpp(`int n,d;cin>>n>>d;vector<long long>w(n);for(auto&x:w)cin>>x;
long long lo=0,hi=0;
for(long long x:w){lo=max(lo,x);hi+=x;}
auto fits=[&](long long cap){int days=1;long long cur=0;
for(long long x:w){if(cur+x>cap){++days;cur=x;}else cur+=x;}
return days<=d;};
while(lo<hi){long long mid=lo+(hi-lo)/2;
if(fits(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`),
    // Dividing the total weight by the number of days: that would be right if packages could be split, and they cannot.
    wrong: [cpp(`int n,d;cin>>n>>d;vector<long long>w(n);for(auto&x:w)cin>>x;
long long total=0,mx=0;
for(long long x:w){total+=x;mx=max(mx,x);}
cout<<max(mx,(total+d-1)/d)<<"\\n";`)],
  },
  "bs-kth-multiplication-table": {
    solution: cpp(`long long n,m,k;cin>>n>>m>>k;
auto atMost=[&](long long x){long long c=0;
for(long long i=1;i<=n;++i)c+=min(m,x/i);
return c;};
long long lo=1,hi=n*m;
while(lo<hi){long long mid=lo+(hi-lo)/2;
if(atMost(mid)>=k)hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`),
    // Reading the table in row-major order: the rows are each sorted, but the table as a whole is not.
    wrong: [cpp(`long long n,m,k;cin>>n>>m>>k;
long long row=(k-1)/m+1,col=(k-1)%m+1;
cout<<row*col<<"\\n";`)],
  },
  "bs-matrix-search": {
    solution: cpp(`int n,m,q;cin>>n>>m>>q;
vector<vector<int>>a(n,vector<int>(m));
for(auto&row:a)for(auto&x:row)cin>>x;
while(q--){int x;cin>>x;int r=0,c=m-1;bool found=false;
while(r<n&&c>=0){if(a[r][c]==x){found=true;break;}
if(a[r][c]>x)--c;else ++r;}
cout<<(found?"YES":"NO")<<"\\n";}`),
    // Binary searching the matrix as if reading it row by row produced a sorted list: it does not, once the columns are sorted too.
    wrong: [cpp(`int n,m,q;cin>>n>>m>>q;
vector<int>flat;flat.reserve(n*m);
for(int i=0;i<n;++i)for(int jj=0;jj<m;++jj){int x;cin>>x;flat.push_back(x);}
while(q--){int x;cin>>x;
int lo=0,hi=(int)flat.size()-1;bool found=false;
while(lo<=hi){int mid=(lo+hi)/2;
if(flat[mid]==x){found=true;break;}
if(flat[mid]<x)lo=mid+1;else hi=mid-1;}
cout<<(found?"YES":"NO")<<"\\n";}`)],
  },
  "greedy-min-refuel": {
    solution: cpp(`long long d,f;int n;cin>>d>>f>>n;
vector<pair<long long,long long>>st(n);
for(auto&[p,a]:st)cin>>p>>a;
priority_queue<long long>pq;
long long reach=f;int stops=0,i=0;
while(reach<d){
while(i<n&&st[i].first<=reach){pq.push(st[i].second);++i;}
if(pq.empty()){cout<<-1<<"\\n";return 0;}
reach+=pq.top();pq.pop();++stops;}
cout<<stops<<"\\n";`),
    // Stopping at the nearest station within reach: it refuels sooner than necessary and pays for stops the reserve would have made unnecessary.
    wrong: [cpp(`long long d,f;int n;cin>>d>>f>>n;
vector<pair<long long,long long>>st(n);
for(auto&[p,a]:st)cin>>p>>a;
long long reach=f;int stops=0,i=0;
while(reach<d){
if(i<n&&st[i].first<=reach){reach+=st[i].second;++i;++stops;}
else{cout<<-1<<"\\n";return 0;}}
cout<<stops<<"\\n";`)],
  },
  "greedy-task-cooldown": {
    solution: cpp(`int k,n;cin>>k>>n;vector<long long>c(k);
long long total=0,mx=0;
for(auto&x:c){cin>>x;total+=x;mx=max(mx,x);}
long long ties=0;for(long long x:c)if(x==mx)++ties;
long long skeleton=(mx-1)*(n+1)+ties;
cout<<max(total,skeleton)<<"\\n";`),
    // Counting only one task in the final block: several kinds can tie for the maximum and all of them go there.
    wrong: [cpp(`int k,n;cin>>k>>n;vector<long long>c(k);
long long total=0,mx=0;
for(auto&x:c){cin>>x;total+=x;mx=max(mx,x);}
long long skeleton=(mx-1)*(n+1)+1;
cout<<max(total,skeleton)<<"\\n";`)],
  },
  "greedy-boat-pairs": {
    solution: cpp(`int n;long long limit;cin>>n>>limit;
vector<long long>w(n);for(auto&x:w)cin>>x;
sort(w.begin(),w.end());
int l=0,r=n-1,boats=0;
while(l<=r){if(w[l]+w[r]<=limit)++l;
--r;++boats;}
cout<<boats<<"\\n";`),
    // Pairing neighbours in sorted order: two middling weights can exceed the limit while a light-with-heavy pairing would not.
    wrong: [cpp(`int n;long long limit;cin>>n>>limit;
vector<long long>w(n);for(auto&x:w)cin>>x;
sort(w.begin(),w.end());
int boats=0,i=0;
while(i<n){if(i+1<n&&w[i]+w[i+1]<=limit)i+=2;else ++i;
++boats;}
cout<<boats<<"\\n";`)],
  },
  "greedy-lemonade-change": {
    solution: cpp(`int n;cin>>n;long long five=0,ten=0;
for(int i=0;i<n;++i){int b;cin>>b;
if(b==5)++five;
else if(b==10){if(five==0){cout<<"NO"<<"\\n";return 0;}--five;++ten;}
else{if(ten>0&&five>0){--ten;--five;}
else if(five>=3)five-=3;
else{cout<<"NO"<<"\\n";return 0;}}}
cout<<"YES"<<"\\n";`),
    // Paying out three 5s for a 20 whenever possible: it spends the note that a later 10 will need.
    wrong: [cpp(`int n;cin>>n;long long five=0,ten=0;
for(int i=0;i<n;++i){int b;cin>>b;
if(b==5)++five;
else if(b==10){if(five==0){cout<<"NO"<<"\\n";return 0;}--five;++ten;}
else{if(five>=3)five-=3;
else if(ten>0&&five>0){--ten;--five;}
else{cout<<"NO"<<"\\n";return 0;}}}
cout<<"YES"<<"\\n";`)],
  },
  "tree-level-order": {
    solution: cpp(`int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
for(int v=1;v<=n;++v)sort(g[v].begin(),g[v].end());
vector<char>seen(n+1,0);seen[1]=1;
queue<int>q;q.push(1);vector<int>out;out.reserve(n);
while(!q.empty()){int u=q.front();q.pop();out.push_back(u);
for(int v:g[u])if(!seen[v]){seen[v]=1;q.push(v);}}
for(int i=0;i<n;++i)cout<<out[i]<<(i+1<n?" ":"\\n");`),
    // A depth-first walk visits a whole branch before returning, which is exactly the order the statement does not ask for.
    wrong: [cpp(`int n;cin>>n;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
for(int v=1;v<=n;++v)sort(g[v].begin(),g[v].end());
vector<char>seen(n+1,0);seen[1]=1;
vector<int>st{1},out;out.reserve(n);
while(!st.empty()){int u=st.back();st.pop_back();out.push_back(u);
for(int i=(int)g[u].size()-1;i>=0;--i){int v=g[u][i];if(!seen[v]){seen[v]=1;st.push_back(v);}}}
for(int i=0;i<n;++i)cout<<out[i]<<(i+1<n?" ":"\\n");`)],
  },
  "tree-diameter-weighted": {
    solution: cpp(`int n;cin>>n;vector<vector<pair<int,long long>>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back({b,w});g[b].push_back({a,w});}
auto walk=[&](int src){vector<long long>d(n+1,-1);d[src]=0;
vector<int>st{src};
while(!st.empty()){int u=st.back();st.pop_back();
for(auto[v,w]:g[u])if(d[v]<0){d[v]=d[u]+w;st.push_back(v);}}
int best=src;
for(int v=1;v<=n;++v)if(d[v]>d[best])best=v;
return make_pair(best,d[best]);};
auto first=walk(1);
auto second=walk(first.first);
cout<<second.second<<"\\n";`),
    // Measuring by number of edges rather than by total weight: the longest chain and the heaviest one need not be the same.
    wrong: [cpp(`int n;cin>>n;vector<vector<pair<int,long long>>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back({b,w});g[b].push_back({a,w});}
auto walk=[&](int src){vector<long long>d(n+1,-1);d[src]=0;
vector<int>st{src};
while(!st.empty()){int u=st.back();st.pop_back();
for(auto[v,w]:g[u])if(d[v]<0){d[v]=d[u]+1;st.push_back(v);}}
int best=src;
for(int v=1;v<=n;++v)if(d[v]>d[best])best=v;
return make_pair(best,d[best]);};
auto first=walk(1);
auto second=walk(first.first);
cout<<second.second<<"\\n";`)],
  },
  "sort-h-index": {
    solution: cpp(`int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
sort(c.rbegin(),c.rend());
int h=0;
for(int i=0;i<n;++i)if(c[i]>=i+1)h=i+1;
cout<<h<<"\\n";`),
    // Reporting how many papers beat the average number of citations: a different statistic that happens to agree on small examples.
    wrong: [cpp(`int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
long long total=0;for(long long x:c)total+=x;
long long avg=total/n;int h=0;
for(long long x:c)if(x>=avg)++h;
cout<<h<<"\\n";`)],
  },
  "sort-relative-ranks": {
    solution: cpp(`int n;cin>>n;vector<pair<long long,int>>v(n);
for(int i=0;i<n;++i){cin>>v[i].first;v[i].second=i;}
sort(v.begin(),v.end(),[](const auto&a,const auto&b){return a.first>b.first;});
vector<int>place(n);
for(int i=0;i<n;++i)place[v[i].second]=i+1;
for(int i=0;i<n;++i)cout<<place[i]<<(i+1<n?" ":"\\n");`),
    // Printing the places in sorted order rather than mapping them back through the stored indices: the answer is right and in the wrong order.
    wrong: [cpp(`int n;cin>>n;vector<long long>v(n);
for(auto&x:v)cin>>x;
sort(v.begin(),v.end(),greater<long long>());
for(int i=0;i<n;++i)cout<<i+1<<(i+1<n?" ":"\\n");`)],
  },
  "str-is-subsequence": {
    solution: cpp(`string s,t;cin>>s>>t;
size_t i=0;
for(size_t jj=0;jj<t.size()&&i<s.size();++jj)if(t[jj]==s[i])++i;
cout<<(i==s.size()?"YES":"NO")<<"\\n";`),
    // Looking for s as a contiguous block: a subsequence is allowed to have gaps.
    wrong: [cpp(`string s,t;cin>>s>>t;
cout<<(t.find(s)!=string::npos?"YES":"NO")<<"\\n";`)],
  },
  "str-roman-to-int": {
    solution: cpp(`string s;cin>>s;
auto val=[](char c){switch(c){case 'I':return 1;case 'V':return 5;case 'X':return 10;
case 'L':return 50;case 'C':return 100;case 'D':return 500;default:return 1000;}};
long long total=0;
for(size_t i=0;i<s.size();++i){
if(i+1<s.size()&&val(s[i])<val(s[i+1]))total-=val(s[i]);
else total+=val(s[i]);}
cout<<total<<"\\n";`),
    // Adding every symbol's value: correct for III and LVIII, and wrong for every numeral that uses the subtractive rule.
    wrong: [cpp(`string s;cin>>s;
auto val=[](char c){switch(c){case 'I':return 1;case 'V':return 5;case 'X':return 10;
case 'L':return 50;case 'C':return 100;case 'D':return 500;default:return 1000;}};
long long total=0;
for(char c:s)total+=val(c);
cout<<total<<"\\n";`)],
  },
  "bs-monotone-cube-root": {
    solution: cpp(`long double a,b,c;cin>>a>>b>>c;
long double lo=-1000,hi=1000;
for(int it=0;it<200;++it){long double mid=(lo+hi)/2;
long double f=mid*mid*mid+a*mid+b;
if(f<c)lo=mid;else hi=mid;}
long double ans=(lo+hi)/2;
if(ans>-5e-7L&&ans<0)ans=0;
cout<<fixed<<setprecision(6)<<(double)ans<<"\\n";`),
    // Stopping after twenty iterations: the interval is still about 0.002 wide, which shows in the sixth decimal and often in the third.
    wrong: [cpp(`long double a,b,c;cin>>a>>b>>c;
long double lo=-1000,hi=1000;
for(int it=0;it<20;++it){long double mid=(lo+hi)/2;
long double f=mid*mid*mid+a*mid+b;
if(f<c)lo=mid;else hi=mid;}
cout<<fixed<<setprecision(6)<<(double)((lo+hi)/2)<<"\\n";`)],
  },
  "three-sum-zero-count": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long total=0;
for(int i=0;i<n;++i){int l=i+1,r=n-1;
while(l<r){long long s=a[i]+a[l]+a[r];
if(s<0)++l;else if(s>0)--r;
else{
if(a[l]==a[r]){long long c=r-l+1;total+=c*(c-1)/2;break;}
int cl=1,cr=1;
while(l+cl<r&&a[l+cl]==a[l])++cl;
while(r-cr>l&&a[r-cr]==a[r])++cr;
total+=(long long)cl*cr;l+=cl;r-=cr;}}}
cout<<total<<"\\n";`),
    // Collecting distinct value-triples in a set: four zeros then report one triple instead of four.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
set<array<long long,3>>seen;
for(int i=0;i<n;++i){int l=i+1,r=n-1;
while(l<r){long long s=a[i]+a[l]+a[r];
if(s<0)++l;else if(s>0)--r;
else{array<long long,3>tri;tri[0]=a[i];tri[1]=a[l];tri[2]=a[r];seen.insert(tri);++l;--r;}}}
cout<<seen.size()<<"\\n";`)],
  },
  "tree-path-sum-exists": {
    solution: cpp(`int n;long long S;cin>>n>>S;
vector<long long>val(n+1);
for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<pair<int,long long>>st;st.push_back({1,val[1]});
vector<int>par(n+1,0);par[1]=-1;
bool found=false;
while(!st.empty()&&!found){auto[u,acc]=st.back();st.pop_back();
bool leaf=true;
for(int v:g[u])if(v!=par[u]){leaf=false;par[v]=u;st.push_back({v,acc+val[v]});}
if(leaf&&acc==S)found=true;}
cout<<(found?"YES":"NO")<<"\\n";`),
    // Accepting a matching prefix sum anywhere on the way down: the statement asks for a path that ends at a leaf.
    wrong: [cpp(`int n;long long S;cin>>n>>S;
vector<long long>val(n+1);
for(int i=1;i<=n;++i)cin>>val[i];
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<pair<int,long long>>st;st.push_back(make_pair(1,val[1]));
vector<int>par(n+1,0);par[1]=-1;
bool found=false;
while(!st.empty()&&!found){auto[u,acc]=st.back();st.pop_back();
if(acc==S){found=true;break;}
for(int v:g[u])if(v!=par[u]){par[v]=u;st.push_back(make_pair(v,acc+val[v]));}}
cout<<(found?"YES":"NO")<<"\\n";`)],
  },
  "array-alternating-sum": {
    solution: cpp(`int n;cin>>n;long long total=0,sign=1;
for(int i=0;i<n;++i){long long x;cin>>x;total+=sign*x;sign=-sign;}
cout<<total<<"\\n";`),
    // Starting the sign at minus: every term comes out with the wrong sign.
    wrong: [cpp(`int n;cin>>n;long long total=0,sign=-1;
for(int i=0;i<n;++i){long long x;cin>>x;total+=sign*x;sign=-sign;}
cout<<total<<"\\n";`)],
  },
  "string-swap-case": {
    solution: cpp(`string s;cin>>s;
for(char&c:s){if(c>='a'&&c<='z')c=c-'a'+'A';else if(c>='A'&&c<='Z')c=c-'A'+'a';}
cout<<s<<"\\n";`),
    // Flipping bit 5 on every character, digits included: '2' turns into an unrelated symbol.
    wrong: [cpp(`string s;cin>>s;
for(char&c:s)c=c^32;
cout<<s<<"\\n";`)],
  },
  "leap-year-check": {
    solution: cpp(`long long y;cin>>y;
bool leap=(y%400==0)||(y%4==0&&y%100!=0);
cout<<(leap?"YES":"NO")<<"\\n";`),
    // Testing only divisibility by 4: right for three years in four and wrong on every century that is not a multiple of 400.
    wrong: [cpp(`long long y;cin>>y;
cout<<(y%4==0?"YES":"NO")<<"\\n";`)],
  },
  "max-adjacent-difference": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=0;
for(int i=0;i+1<n;++i)best=max(best,llabs(a[i]-a[i+1]));
cout<<best<<"\\n";`),
    // Comparing the signed difference: a large drop reads as a very negative number and never wins the maximum.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=0;
for(int i=0;i+1<n;++i)best=max(best,a[i]-a[i+1]);
cout<<best<<"\\n";`)],
  },
  "reverse-number-digits": {
    solution: cpp(`long long n;cin>>n;long long r=0;
while(n>0){r=r*10+n%10;n/=10;}
cout<<r<<"\\n";`),
    // Reversing the decimal text and printing it back: the leading zeros of the reversed string survive.
    wrong: [cpp(`string s;cin>>s;
reverse(s.begin(),s.end());
cout<<s<<"\\n";`)],
  },
  "armstrong-number": {
    solution: cpp(`string s;cin>>s;long long n=stoll(s);int k=s.size();
long long total=0;
for(char c:s){long long d=c-'0',p=1;
for(int i=0;i<k;++i){p*=d;if(p>1000000000LL)break;}
total+=p;if(total>1000000000LL)break;}
cout<<(total==n?"YES":"NO")<<"\\n";`),
    // Fixing the exponent at 3: right for the famous three-digit examples and wrong for every other length.
    wrong: [cpp(`string s;cin>>s;long long n=stoll(s);
long long total=0;
for(char c:s){long long d=c-'0';total+=d*d*d;}
cout<<(total==n?"YES":"NO")<<"\\n";`)],
  },
  "sum-multiples-two": {
    solution: cpp(`long long n,a,b;cin>>n>>a>>b;
auto seriesSum=[&](long long d){long long k=n/d;
return (__int128)d*k%((__int128)1<<100)*(k+1)/2;};
auto sumOf=[&](long long d)->__int128{__int128 k=n/d;return (__int128)d*k*(k+1)/2;};
long long g=__gcd(a,b);
__int128 l=(__int128)a/g*b;
__int128 total=sumOf(a)+sumOf(b);
if(l<=(__int128)n)total-=sumOf((long long)l);
string out;__int128 t=total;
if(t==0)out="0";
while(t>0){out+=(char)('0'+(int)(t%10));t/=10;}
reverse(out.begin(),out.end());
cout<<out<<"\\n";`),
    // Adding both series without removing the numbers divisible by both: they are counted twice.
    wrong: [cpp(`long long n,a,b;cin>>n>>a>>b;
auto sumOf=[&](long long d)->__int128{__int128 k=n/d;return (__int128)d*k*(k+1)/2;};
__int128 total=sumOf(a)+sumOf(b);
string out;__int128 t=total;
if(t==0)out="0";
while(t>0){out+=(char)('0'+(int)(t%10));t/=10;}
reverse(out.begin(),out.end());
cout<<out<<"\\n";`)],
  },
  "matrix-identity-check": {
    solution: cpp(`int n;cin>>n;bool ok=true;
for(int i=0;i<n;++i)for(int jj=0;jj<n;++jj){long long x;cin>>x;
long long want=(i==jj)?1:0;
if(x!=want)ok=false;}
cout<<(ok?"YES":"NO")<<"\\n";`),
    // Checking only the diagonal: any junk sitting off it goes unnoticed.
    wrong: [cpp(`int n;cin>>n;bool ok=true;
for(int i=0;i<n;++i)for(int jj=0;jj<n;++jj){long long x;cin>>x;
if(i==jj&&x!=1)ok=false;}
cout<<(ok?"YES":"NO")<<"\\n";`)],
  },
  "gcd-of-array": {
    solution: cpp(`int n;cin>>n;long long g=0;
for(int i=0;i<n;++i){long long x;cin>>x;g=__gcd(g,x);}
cout<<g<<"\\n";`),
    // Reporting the smallest element: it divides itself but not necessarily the others.
    wrong: [cpp(`int n;cin>>n;long long best=-1;
for(int i=0;i<n;++i){long long x;cin>>x;if(best<0||x<best)best=x;}
cout<<best<<"\\n";`)],
  },
  "base-convert-any": {
    solution: cpp(`long long p,q;cin>>p>>q;string s;cin>>s;
long long v=0;
for(char c:s){int d=(c>='0'&&c<='9')?(c-'0'):(c-'A'+10);v=v*p+d;}
if(v==0){cout<<0<<"\\n";return 0;}
string out;
while(v>0){int d=(int)(v%q);out+=(char)(d<10?('0'+d):('A'+d-10));v/=q;}
reverse(out.begin(),out.end());
cout<<out<<"\\n";`),
    // Reading every character as a decimal digit: 'F' becomes a nonsense value instead of 15.
    wrong: [cpp(`long long p,q;cin>>p>>q;string s;cin>>s;
long long v=0;
for(char c:s){int d=c-'0';v=v*p+d;}
if(v==0){cout<<0<<"\\n";return 0;}
string out;
while(v>0){int d=(int)(v%q);out+=(char)(d<10?('0'+d):('A'+d-10));v/=q;}
reverse(out.begin(),out.end());
cout<<out<<"\\n";`)],
  },
  "stack-min-tracking": {
    solution: cpp(`int q;cin>>q;vector<long long>st,mn;
while(q--){int type;cin>>type;
if(type==1){long long x;cin>>x;st.push_back(x);
mn.push_back(mn.empty()?x:min(mn.back(),x));}
else if(type==2){st.pop_back();mn.pop_back();}
else cout<<mn.back()<<"\\n";}`),
    // Keeping the minimum in one variable: a pop can remove it, and there is nothing left to fall back to.
    wrong: [cpp(`int q;cin>>q;vector<long long>st;long long mn=LLONG_MAX;
while(q--){int type;cin>>type;
if(type==1){long long x;cin>>x;st.push_back(x);mn=min(mn,x);}
else if(type==2)st.pop_back();
else cout<<mn<<"\\n";}`)],
  },
  "hash-two-sum-indices": {
    solution: cpp(`int n;long long S;cin>>n>>S;
unordered_map<long long,int>seen;
for(int j=1;j<=n;++j){long long x;cin>>x;
auto it=seen.find(S-x);
if(it!=seen.end()){cout<<it->second<<" "<<j<<"\\n";return 0;}
if(!seen.count(x))seen[x]=j;}
cout<<-1<<"\\n";`),
    // Inserting the element before looking up its partner: when S is twice that element, it matches itself and reports i = j.
    wrong: [cpp(`int n;long long S;cin>>n>>S;
unordered_map<long long,int>seen;
for(int j=1;j<=n;++j){long long x;cin>>x;
if(!seen.count(x))seen[x]=j;
auto it=seen.find(S-x);
if(it!=seen.end()){cout<<it->second<<" "<<j<<"\\n";return 0;}}
cout<<-1<<"\\n";`)],
  },
  "set-union-intersection": {
    solution: cpp(`int n,m;cin>>n>>m;
set<long long>a,b;
for(int i=0;i<n;++i){long long x;cin>>x;a.insert(x);}
for(int i=0;i<m;++i){long long x;cin>>x;b.insert(x);}
long long inter=0;
for(long long x:a)if(b.count(x))++inter;
cout<<(long long)a.size()+(long long)b.size()-inter<<" "<<inter<<"\\n";`),
    // Counting the lists as given: a value repeated inside one list inflates the union.
    wrong: [cpp(`int n,m;cin>>n>>m;
vector<long long>a(n),b(m);
for(auto&x:a)cin>>x;
for(auto&x:b)cin>>x;
set<long long>bs(b.begin(),b.end());
long long inter=0;
for(long long x:a)if(bs.count(x))++inter;
cout<<(long long)n+(long long)m-inter<<" "<<inter<<"\\n";`)],
  },
  "sort-min-abs-difference": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
long long best=LLONG_MAX;
for(int i=0;i+1<n;++i)best=min(best,a[i+1]-a[i]);
cout<<best<<"\\n";`),
    // Taking the smallest and largest values: that is the widest gap, not the narrowest.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
sort(a.begin(),a.end());
cout<<a[n-1]-a[0]<<"\\n";`)],
  },
  "prefix-equilibrium-index": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long total=0;for(long long x:a)total+=x;
long long left=0;
for(int i=0;i<n;++i){long long right=total-left-a[i];
if(left==right){cout<<i+1<<"\\n";return 0;}
left+=a[i];}
cout<<-1<<"\\n";`),
    // Counting the element itself in one of the sides: the ends then stop working and the balance point shifts.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long total=0;for(long long x:a)total+=x;
long long left=0;
for(int i=0;i<n;++i){left+=a[i];
long long right=total-left;
if(left==right){cout<<i+1<<"\\n";return 0;}}
cout<<-1<<"\\n";`)],
  },
  "str-capitalize-words": {
    solution: cpp(`string s;getline(cin,s);
while(!s.empty()&&(s.back()=='\\r'))s.pop_back();
bool start=true;
for(size_t i=0;i<s.size();++i){char c=s[i];
if(c==' '){start=true;continue;}
if(c>='A'&&c<='Z')c=c-'A'+'a';
if(start&&c>='a'&&c<='z')c=c-'a'+'A';
s[i]=c;start=false;}
cout<<s<<"\\n";`),
    // Capitalising the first letter without lowering the rest: a word already shouted in capitals stays shouted.
    wrong: [cpp(`string s;getline(cin,s);
while(!s.empty()&&(s.back()=='\\r'))s.pop_back();
bool start=true;
for(size_t i=0;i<s.size();++i){char c=s[i];
if(c==' '){start=true;continue;}
if(start&&c>='a'&&c<='z')c=c-'a'+'A';
s[i]=c;start=false;}
cout<<s<<"\\n";`)],
  },
  "nested-loop-iterations": {
    solution: cpp(`long long n;cin>>n;cout<<n*(n+1)/2<<"\\n";`),
    // Answering n squared: that would be right if the inner loop always started at 1.
    wrong: [cpp(`long long n;cin>>n;cout<<n*n<<"\\n";`)],
  },
  "count-words-with-prefix": {
    solution: cpp(`int n;char c;cin>>n>>c;
auto low=[](char ch){return (ch>='A'&&ch<='Z')?(char)(ch-'A'+'a'):ch;};
char target=low(c);int total=0;
for(int i=0;i<n;++i){string w;cin>>w;
if(!w.empty()&&low(w[0])==target)++total;}
cout<<total<<"\\n";`),
    // Comparing the letters as they are: the statement says case is ignored, and half the matches then disappear.
    wrong: [cpp(`int n;char c;cin>>n>>c;int total=0;
for(int i=0;i<n;++i){string w;cin>>w;
if(!w.empty()&&w[0]==c)++total;}
cout<<total<<"\\n";`)],
  },
  "queue-from-two-stacks": {
    solution: cpp(`int q;cin>>q;vector<long long>in,out;
while(q--){int type;cin>>type;
if(type==1){long long x;cin>>x;in.push_back(x);}
else{if(out.empty()){while(!in.empty()){out.push_back(in.back());in.pop_back();}}
cout<<out.back()<<"\\n";out.pop_back();}}`),
    // Using one stack and returning its top: that is last in, first out, which is the opposite of a queue.
    wrong: [cpp(`int q;cin>>q;vector<long long>st;
while(q--){int type;cin>>type;
if(type==1){long long x;cin>>x;st.push_back(x);}
else{cout<<st.back()<<"\\n";st.pop_back();}}`)],
  },
  "array-shift-left-one": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=1;i<n;++i)cout<<a[i]<<" ";
cout<<a[0]<<"\\n";`),
    // Shifting in place without keeping a copy of the first element: it is overwritten on the very first step and the second value gets printed twice.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
for(int i=0;i+1<n;++i)a[i]=a[i+1];
for(int i=0;i+1<n;++i)cout<<a[i]<<" ";
cout<<a[0]<<"\\n";`)],
  },
  "digit-product": {
    solution: cpp(`string s;cin>>s;long long p=1;for(char c:s)p*=(c-'0');cout<<p<<"\\n";`),
    // Starting the product at zero, and skipping zero digits instead of letting them win.
    wrong: [cpp(`string s;cin>>s;long long p=0;for(char c:s)p*=(c-'0');cout<<p<<"\\n";`), cpp(`string s;cin>>s;long long p=1;for(char c:s)if(c!='0')p*=(c-'0');cout<<p<<"\\n";`)],
  },
  "count-digits": {
    solution: cpp(`string s;cin>>s;cout<<(long long)s.size()<<"\\n";`),
    // The classic division loop that never runs for zero, and one that stops a digit early.
    wrong: [cpp(`long long n;cin>>n;int c=0;while(n>0){n/=10;++c;}cout<<c<<"\\n";`), cpp(`long long n;cin>>n;int c=0;while(n>9){n/=10;++c;}cout<<c<<"\\n";`)],
  },
  "sum-even-positions": {
    solution: cpp(`int n;cin>>n;long long s=0,x;for(int i=1;i<=n;++i){cin>>x;if(i%2==0)s+=x;}cout<<s<<"\\n";`),
    // Reading the index as 0-based sums the other half; testing the value instead of the position answers a different question.
    wrong: [cpp(`int n;cin>>n;long long s=0,x;for(int i=0;i<n;++i){cin>>x;if(i%2==0)s+=x;}cout<<s<<"\\n";`), cpp(`int n;cin>>n;long long s=0,x;for(int i=1;i<=n;++i){cin>>x;if(x%2==0)s+=x;}cout<<s<<"\\n";`)],
  },
  "nth-triangular": {
    solution: cpp(`long long n;cin>>n;cout<<n*(n+1)/2<<"\\n";`),
    // Computing the product in 32 bits overflows; dividing before multiplying loses the odd half.
    wrong: [cpp(`long long n;cin>>n;int m=(int)n;cout<<(long long)(m*(m+1)/2)<<"\\n";`), cpp(`long long n;cin>>n;cout<<(n/2)*(n+1)<<"\\n";`)],
  },
  "hamming-distance": {
    solution: cpp(`string s,t;cin>>s>>t;long long c=0;for(size_t i=0;i<s.size();++i)if(s[i]!=t[i])++c;cout<<c<<"\\n";`),
    // Counting the matches instead of the mismatches, and stopping one character early.
    wrong: [cpp(`string s,t;cin>>s>>t;long long c=0;for(size_t i=0;i<s.size();++i)if(s[i]==t[i])++c;cout<<c<<"\\n";`), cpp(`string s,t;cin>>s>>t;long long c=0;for(size_t i=0;i+1<s.size();++i)if(s[i]!=t[i])++c;cout<<c<<"\\n";`)],
  },
  "count-multiples-range": {
    solution: cpp(`long long l,r,k;cin>>l>>r>>k;cout<<r/k-(l-1)/k<<"\\n";`),
    // Subtracting l/k instead of (l-1)/k drops a multiple sitting exactly on the left end.
    wrong: [cpp(`long long l,r,k;cin>>l>>r>>k;cout<<r/k-l/k<<"\\n";`), cpp(`long long l,r,k;cin>>l>>r>>k;cout<<(r-l)/k<<"\\n";`)],
  },
  "count-letter-case": {
    solution: cpp(`string s;cin>>s;long long u=0,l=0;for(char c:s){if(c>='A'&&c<='Z')++u;else ++l;}cout<<u<<" "<<l<<"\\n";`),
    // Printing the pair the other way round, and counting only the uppercase half.
    wrong: [cpp(`string s;cin>>s;long long u=0,l=0;for(char c:s){if(c>='A'&&c<='Z')++u;else ++l;}cout<<l<<" "<<u<<"\\n";`), cpp(`string s;cin>>s;long long u=0;for(char c:s)if(c>='A'&&c<='Z')++u;cout<<u<<" "<<(long long)s.size()<<"\\n";`)],
  },
  "is-prime-single": {
    solution: cpp(`long long n;cin>>n;if(n<2){cout<<"NO\\n";return 0;}
for(long long d=2;d*d<=n;++d)if(n%d==0){cout<<"NO\\n";return 0;}
cout<<"YES\\n";`),
    // Forgetting that 1 is not prime, and looping to n/2 in a way that misreports 2 and 3.
    wrong: [cpp(`long long n;cin>>n;for(long long d=2;d*d<=n;++d)if(n%d==0){cout<<"NO\\n";return 0;}
cout<<"YES\\n";`), cpp(`long long n;cin>>n;if(n<2){cout<<"NO\\n";return 0;}
for(long long d=2;d<n;++d)if(n%d==0){cout<<"NO\\n";return 0;}
cout<<"YES\\n";`)],
  },
  "string-first-unique": {
    solution: cpp(`string s;cin>>s;int f[26]={0};for(char c:s)++f[c-'a'];
for(size_t i=0;i<s.size();++i)if(f[s[i]-'a']==1){cout<<i+1<<"\\n";return 0;}
cout<<-1<<"\\n";`),
    // Reporting a 0-based index, and reporting the letter instead of where it stands.
    wrong: [cpp(`string s;cin>>s;int f[26]={0};for(char c:s)++f[c-'a'];
for(size_t i=0;i<s.size();++i)if(f[s[i]-'a']==1){cout<<i<<"\\n";return 0;}
cout<<-1<<"\\n";`), cpp(`string s;cin>>s;int f[26]={0};for(char c:s)++f[c-'a'];
for(size_t i=0;i<s.size();++i)if(f[s[i]-'a']==1){cout<<s[i]<<"\\n";return 0;}
cout<<-1<<"\\n";`)],
  },
  "average-drop-extremes": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long s=0,mn=a[0],mx=a[0];for(long long x:a){s+=x;mn=min(mn,x);mx=max(mx,x);}
cout<<(s-mn-mx)/(n-2)<<"\\n";`),
    // Dividing by n rather than by what is left, and dropping every copy of each extreme.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long s=0,mn=a[0],mx=a[0];for(long long x:a){s+=x;mn=min(mn,x);mx=max(mx,x);}
cout<<(s-mn-mx)/n<<"\\n";`), cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long mn=a[0],mx=a[0];for(long long x:a){mn=min(mn,x);mx=max(mx,x);}
long long s=0,c=0;for(long long x:a)if(x!=mn&&x!=mx){s+=x;++c;}
cout<<(c?s/c:0)<<"\\n";`)],
  },
  "sort-largest-gap": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long best=0;for(int i=0;i+1<n;++i)best=max(best,a[i+1]-a[i]);cout<<best<<"\\n";`),
    // Skipping the sort measures neighbours that were never neighbours; taking max minus min measures the whole span instead of a gap.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=0;for(int i=0;i+1<n;++i)best=max(best,a[i+1]-a[i]);cout<<best<<"\\n";`), cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
cout<<a[n-1]-a[0]<<"\\n";`)],
  },
  "count-pairs-divisible-k": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<long long>cnt(k,0);
for(long long i=0;i<n;++i){long long x;cin>>x;++cnt[x%k];}
long long ans=cnt[0]*(cnt[0]-1)/2;
for(long long r=1;r*2<k;++r)ans+=cnt[r]*cnt[k-r];
if(k%2==0)ans+=cnt[k/2]*(cnt[k/2]-1)/2;
cout<<ans<<"\\n";`),
    // Letting the loop run past the midpoint counts every mixed pair twice; forgetting the self-paired buckets loses the rest.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<long long>cnt(k,0);
for(long long i=0;i<n;++i){long long x;cin>>x;++cnt[x%k];}
long long ans=cnt[0]*(cnt[0]-1)/2;
for(long long r=1;r<k;++r)ans+=cnt[r]*cnt[k-r];
cout<<ans<<"\\n";`), cpp(`long long n,k;cin>>n>>k;vector<long long>cnt(k,0);
for(long long i=0;i<n;++i){long long x;cin>>x;++cnt[x%k];}
long long ans=0;
for(long long r=1;r*2<k;++r)ans+=cnt[r]*cnt[k-r];
cout<<ans<<"\\n";`)],
  },
  "dp-min-cost-stairs": {
    solution: cpp(`int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
vector<long long>d(n+1,0);
for(int i=2;i<=n;++i)d[i]=min(d[i-1]+c[i-1],d[i-2]+c[i-2]);
cout<<d[n]<<"\\n";`),
    // Charging for the step you leave from at the very end, and a table that starts one index late.
    wrong: [cpp(`int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
vector<long long>d(n+1,0);
for(int i=2;i<=n;++i)d[i]=min(d[i-1]+c[i-1],d[i-2]+c[i-2]);
cout<<d[n]+c[n-1]<<"\\n";`), cpp(`int n;cin>>n;vector<long long>c(n);for(auto&x:c)cin>>x;
vector<long long>d(n+1,0);
for(int i=1;i<=n;++i)d[i]=d[i-1]+c[i-1];
cout<<d[n]<<"\\n";`)],
  },
  "longest-alternating-parity": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=1,cur=1;
for(int i=1;i<n;++i){if(((a[i]%2)!=0)!=((a[i-1]%2)!=0))++cur;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`),
    // Counting the breaks rather than the run, and a parity test that misreads negative numbers.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=0,cur=0;
for(int i=1;i<n;++i){if(((a[i]%2)!=0)!=((a[i-1]%2)!=0))++cur;else cur=0;best=max(best,cur);}
cout<<best<<"\\n";`), cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
int best=1,cur=1;
for(int i=1;i<n;++i){if(a[i]%2!=a[i-1]%2)++cur;else cur=1;best=max(best,cur);}
cout<<best<<"\\n";`)],
  },
  "min-ops-equalise": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long m=a[n/2],s=0;for(long long x:a)s+=llabs(x-m);cout<<s<<"\\n";`),
    // Aiming at the mean rather than the median, and aiming at the midpoint of the range.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long t=0;for(long long x:a)t+=x;long long m=t/n,s=0;
for(long long x:a)s+=llabs(x-m);cout<<s<<"\\n";`), cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
long long m=(a[0]+a[n-1])/2,s=0;for(long long x:a)s+=llabs(x-m);cout<<s<<"\\n";`)],
  },
  "count-subarrays-odd-sum": {
    solution: cpp(`int n;cin>>n;long long even=1,odd=0,p=0,ans=0,x;
for(int i=0;i<n;++i){cin>>x;p+=x;if(((p%2)+2)%2==1){ans+=even;++odd;}else{ans+=odd;++even;}}
cout<<ans<<"\\n";`),
    // A parity test that misreads a negative prefix, and starting the even bucket empty so every prefix loses its partner.
    wrong: [cpp(`int n;cin>>n;long long even=1,odd=0,p=0,ans=0,x;
for(int i=0;i<n;++i){cin>>x;p+=x;if(p%2==1){ans+=even;++odd;}else{ans+=odd;++even;}}
cout<<ans<<"\\n";`), cpp(`int n;cin>>n;long long even=0,odd=0,p=0,ans=0,x;
for(int i=0;i<n;++i){cin>>x;p+=x;if(((p%2)+2)%2==1){ans+=even;++odd;}else{ans+=odd;++even;}}
cout<<ans<<"\\n";`)],
  },
  "greedy-max-units-boxes": {
    solution: cpp(`long long n,k;cin>>n>>k;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.second>>p.first;
sort(v.rbegin(),v.rend());
long long ans=0;
for(auto&p:v){long long take=min(k,p.second);ans+=take*p.first;k-=take;if(k==0)break;}
cout<<ans<<"\\n";`),
    // Sorting by how many boxes there are rather than by what they hold, and taking a whole kind even when it overflows the truck.
    wrong: [cpp(`long long n,k;cin>>n>>k;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.first>>p.second;
sort(v.rbegin(),v.rend());
long long ans=0;
for(auto&p:v){long long take=min(k,p.first);ans+=take*p.second;k-=take;if(k==0)break;}
cout<<ans<<"\\n";`), cpp(`long long n,k;cin>>n>>k;vector<pair<long long,long long>>v(n);
for(auto&p:v)cin>>p.second>>p.first;
sort(v.rbegin(),v.rend());
long long ans=0;
for(auto&p:v){if(k<=0)break;ans+=p.second*p.first;k-=p.second;}
cout<<ans<<"\\n";`)],
  },
  "bs-min-days-bouquets": {
    solution: cpp(`long long n,m,k;cin>>n>>m>>k;vector<long long>b(n);for(auto&x:b)cin>>x;
if(m*k>n){cout<<-1<<"\\n";return 0;}
auto ok=[&](long long day){long long made=0,run=0;
 for(long long i=0;i<n;++i){if(b[i]<=day){++run;if(run==k){++made;run=0;}}else run=0;}
 return made>=m;};
long long lo=*min_element(b.begin(),b.end()),hi=*max_element(b.begin(),b.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`),
    // A run that is not reset after a bouquet is cut reuses flowers; testing m*k >= n gets the impossible case backwards.
    wrong: [cpp(`long long n,m,k;cin>>n>>m>>k;vector<long long>b(n);for(auto&x:b)cin>>x;
if(m*k>n){cout<<-1<<"\\n";return 0;}
auto ok=[&](long long day){long long made=0,run=0;
 for(long long i=0;i<n;++i){if(b[i]<=day){++run;if(run>=k)++made;}else run=0;}
 return made>=m;};
long long lo=*min_element(b.begin(),b.end()),hi=*max_element(b.begin(),b.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`), cpp(`long long n,m,k;cin>>n>>m>>k;vector<long long>b(n);for(auto&x:b)cin>>x;
if(m*k>=n){cout<<-1<<"\\n";return 0;}
auto ok=[&](long long day){long long made=0,run=0;
 for(long long i=0;i<n;++i){if(b[i]<=day){++run;if(run==k){++made;run=0;}}else run=0;}
 return made>=m;};
long long lo=*min_element(b.begin(),b.end()),hi=*max_element(b.begin(),b.end());
while(lo<hi){long long mid=lo+(hi-lo)/2;if(ok(mid))hi=mid;else lo=mid+1;}
cout<<lo<<"\\n";`)],
  },
  "stack-remove-adjacent-equal": {
    solution: cpp(`string s;cin>>s;string st;
for(char c:s){if(!st.empty()&&st.back()==c)st.pop_back();else st.push_back(c);}
cout<<(long long)st.size()<<"\\n";`),
    // One pass over the original string never sees the neighbours a removal creates; counting removals instead of survivors answers a different question.
    wrong: [cpp(`string s;cin>>s;string t;
for(size_t i=0;i<s.size();){if(i+1<s.size()&&s[i]==s[i+1])i+=2;else{t.push_back(s[i]);++i;}}
cout<<(long long)t.size()<<"\\n";`), cpp(`string s;cin>>s;string st;long long gone=0;
for(char c:s){if(!st.empty()&&st.back()==c){st.pop_back();gone+=2;}else st.push_back(c);}
cout<<gone<<"\\n";`)],
  },
  "tree-count-depth-k": {
    solution: cpp(`int n,k;cin>>n>>k;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);long long c=0;
while(!q.empty()){int v=q.front();q.pop();if(d[v]==k)++c;
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<c<<"\\n";`),
    // Counting depth in nodes rather than edges shifts the whole answer by one; counting everything down to k counts the levels above it too.
    wrong: [cpp(`int n,k;cin>>n>>k;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>d(n+1,-1);queue<int>q;d[1]=1;q.push(1);long long c=0;
while(!q.empty()){int v=q.front();q.pop();if(d[v]==k)++c;
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<c<<"\\n";`), cpp(`int n,k;cin>>n>>k;vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);long long c=0;
while(!q.empty()){int v=q.front();q.pop();if(d[v]<=k)++c;
 for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}
cout<<c<<"\\n";`)],
  },
  "dp-count-lis": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long M=1000000007;
vector<int>len(n,1);vector<long long>cnt(n,1);int best=1;
for(int i=0;i<n;++i){
 for(int j=0;j<i;++j)if(a[j]<a[i]){
  if(len[j]+1>len[i]){len[i]=len[j]+1;cnt[i]=cnt[j];}
  else if(len[j]+1==len[i])cnt[i]=(cnt[i]+cnt[j])%M;}
 best=max(best,len[i]);}
long long ans=0;for(int i=0;i<n;++i)if(len[i]==best)ans=(ans+cnt[i])%M;
cout<<ans<<"\\n";`),
    // Counting every position that reaches the best length instead of summing their counts, and a non-strict comparison that lets equal values extend a run.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long M=1000000007;
vector<int>len(n,1);vector<long long>cnt(n,1);int best=1;
for(int i=0;i<n;++i){
 for(int j=0;j<i;++j)if(a[j]<a[i]){
  if(len[j]+1>len[i]){len[i]=len[j]+1;cnt[i]=cnt[j];}
  else if(len[j]+1==len[i])cnt[i]=(cnt[i]+cnt[j])%M;}
 best=max(best,len[i]);}
long long ans=0;for(int i=0;i<n;++i)if(len[i]==best)ans=(ans+1)%M;
cout<<ans<<"\\n";`), cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
const long long M=1000000007;
vector<int>len(n,1);vector<long long>cnt(n,1);int best=1;
for(int i=0;i<n;++i){
 for(int j=0;j<i;++j)if(a[j]<=a[i]){
  if(len[j]+1>len[i]){len[i]=len[j]+1;cnt[i]=cnt[j];}
  else if(len[j]+1==len[i])cnt[i]=(cnt[i]+cnt[j])%M;}
 best=max(best,len[i]);}
long long ans=0;for(int i=0;i<n;++i)if(len[i]==best)ans=(ans+cnt[i])%M;
cout<<ans<<"\\n";`)],
  },
  "graph-eulerian-path": {
    solution: cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);++deg[a];++deg[b];}
int odd=0;for(int v=1;v<=n;++v)if(deg[v]%2)++odd;
if(odd!=0&&odd!=2){cout<<"NO\\n";return 0;}
int start=-1;for(int v=1;v<=n;++v)if(deg[v]>0){start=v;break;}
if(start<0){cout<<"YES\\n";return 0;}
vector<char>seen(n+1,0);vector<int>st{start};seen[start]=1;int reached=0;
while(!st.empty()){int v=st.back();st.pop_back();++reached;
 for(int u:g[v])if(!seen[u]){seen[u]=1;st.push_back(u);}}
int withEdges=0;for(int v=1;v<=n;++v)if(deg[v]>0)++withEdges;
cout<<(reached==withEdges?"YES":"NO")<<"\\n";`),
    // Checking the degrees and forgetting connectivity, and demanding that every vertex be reached rather than every vertex that has an edge.
    wrong: [cpp(`int n,m;cin>>n>>m;vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;++deg[a];++deg[b];}
int odd=0;for(int v=1;v<=n;++v)if(deg[v]%2)++odd;
cout<<((odd==0||odd==2)?"YES":"NO")<<"\\n";`), cpp(`int n,m;cin>>n>>m;vector<vector<int>>g(n+1);vector<int>deg(n+1,0);
for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);++deg[a];++deg[b];}
int odd=0;for(int v=1;v<=n;++v)if(deg[v]%2)++odd;
if(odd!=0&&odd!=2){cout<<"NO\\n";return 0;}
vector<char>seen(n+1,0);vector<int>st{1};seen[1]=1;int reached=0;
while(!st.empty()){int v=st.back();st.pop_back();++reached;
 for(int u:g[v])if(!seen[u]){seen[u]=1;st.push_back(u);}}
cout<<(reached==n?"YES":"NO")<<"\\n";`)],
  },
  "count-trailing-zeros-factorial": {
    solution: cpp(`unsigned long long n;cin>>n;unsigned long long z=0;
for(unsigned long long p=5;p<=n;p*=5){z+=n/p;if(p>n/5)break;}
cout<<z<<"\\n";`),
    // Dividing once counts a 25 as a single five; counting factors of 2 instead answers a different question.
    wrong: [cpp(`unsigned long long n;cin>>n;cout<<n/5<<"\\n";`), cpp(`unsigned long long n;cin>>n;unsigned long long z=0;
for(unsigned long long p=2;p<=n;p*=2){z+=n/p;if(p>n/2)break;}
cout<<z<<"\\n";`)],
  },
  "dp-partition-min-diff": {
    solution: cpp(`int n;cin>>n;vector<int>a(n);int total=0;for(auto&x:a){cin>>x;total+=x;}
vector<char>can(total+1,0);can[0]=1;
for(int x:a)for(int s=total;s>=x;--s)if(can[s-x])can[s]=1;
int best=total;
for(int s=0;s<=total;++s)if(can[s])best=min(best,abs(total-2*s));
cout<<best<<"\\n";`),
    // Walking the subset-sum table forwards reuses an element many times; reading the answer off the parity of the total assumes a perfect split is always reachable.
    wrong: [cpp(`int n;cin>>n;vector<int>a(n);int total=0;for(auto&x:a){cin>>x;total+=x;}
vector<char>can(total+1,0);can[0]=1;
for(int x:a)for(int s=x;s<=total;++s)if(can[s-x])can[s]=1;
int best=total;
for(int s=0;s<=total;++s)if(can[s])best=min(best,abs(total-2*s));
cout<<best<<"\\n";`), cpp(`int n;cin>>n;vector<int>a(n);int total=0;for(auto&x:a){cin>>x;total+=x;}
cout<<(total%2)<<"\\n";`)],
  },
  "knapsack-bounded": {
    solution: cpp(`int n,W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v,c;cin>>w>>v>>c;
 for(long long k=1;c>0;k*=2){long long take=min(k,c);c-=take;
  long long ww=w*take,vv=v*take;
  for(int cap=W;cap>=ww;--cap)dp[cap]=max(dp[cap],dp[cap-ww]+vv);}}
cout<<dp[W]<<"\\n";`),
    // Treating every kind as unlimited ignores the copy count; treating it as a single item throws the rest away.
    wrong: [cpp(`int n,W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v,c;cin>>w>>v>>c;
 for(int cap=w;cap<=W;++cap)dp[cap]=max(dp[cap],dp[cap-w]+v);}
cout<<dp[W]<<"\\n";`), cpp(`int n,W;cin>>n>>W;vector<long long>dp(W+1,0);
for(int i=0;i<n;++i){long long w,v,c;cin>>w>>v>>c;
 for(int cap=W;cap>=w;--cap)dp[cap]=max(dp[cap],dp[cap-w]+v);}
cout<<dp[W]<<"\\n";`)],
  },
  "graph-count-components-size-k": {
    solution: cpp(`int n,m,k;cin>>n>>m>>k;vector<int>p(n+1),sz(n+1,1);
for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}
long long c=0;for(int v=1;v<=n;++v)if(f(v)==v&&sz[v]==k)++c;
cout<<c<<"\\n";`),
    // Counting every vertex whose component has size k multiplies each component by its own size; merging without carrying the sizes leaves them all at one.
    wrong: [cpp(`int n,m,k;cin>>n>>m>>k;vector<int>p(n+1),sz(n+1,1);
for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}
long long c=0;for(int v=1;v<=n;++v)if(sz[f(v)]==k)++c;
cout<<c<<"\\n";`), cpp(`int n,m,k;cin>>n>>m>>k;vector<int>p(n+1),sz(n+1,1);
for(int i=0;i<=n;++i)p[i]=i;
function<int(int)>f=[&](int x){while(p[x]!=x){p[x]=p[p[x]];x=p[x];}return x;};
for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);
 if(ra!=rb)p[ra]=rb;}
long long c=0;for(int v=1;v<=n;++v)if(f(v)==v&&sz[v]==k)++c;
cout<<c<<"\\n";`)],
  },
  "dp-longest-zigzag": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long up=1,down=1;
for(int i=1;i<n;++i){if(a[i]>a[i-1])up=down+1;else if(a[i]<a[i-1])down=up+1;}
cout<<max(up,down)<<"\\n";`),
    // Letting an equal pair extend the chain breaks the no-zero rule; carrying only one direction forgets that the chain can turn either way.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long up=1,down=1;
for(int i=1;i<n;++i){if(a[i]>=a[i-1])up=down+1;else down=up+1;}
cout<<max(up,down)<<"\\n";`), cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long best=1;
for(int i=1;i<n;++i)if(a[i]!=a[i-1])++best;
cout<<best<<"\\n";`)],
  },
  "count-inversions-pairs-far": {
    solution: cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());s.erase(unique(s.begin(),s.end()),s.end());
int m=s.size();vector<long long>bit(m+1,0);
auto add=[&](int i){for(++i;i<=m;i+=i&-i)++bit[i];};
auto qry=[&](int i){long long r=0;for(++i;i>0;i-=i&-i)r+=bit[i];return r;};
long long ans=0;
for(int i=0;i<n;++i){int r=lower_bound(s.begin(),s.end(),a[i])-s.begin();
 ans+=i-qry(r);add(r);}
cout<<ans<<"\\n";`),
    // Counting the values less than or equal instead of strictly greater folds the equal ones in; subtracting one rank too few counts each equal pair as an inversion.
    wrong: [cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
vector<long long>s=a;sort(s.begin(),s.end());s.erase(unique(s.begin(),s.end()),s.end());
int m=s.size();vector<long long>bit(m+1,0);
auto add=[&](int i){for(++i;i<=m;i+=i&-i)++bit[i];};
auto qry=[&](int i){long long r=0;for(++i;i>0;i-=i&-i)r+=bit[i];return r;};
long long ans=0;
for(int i=0;i<n;++i){int r=lower_bound(s.begin(),s.end(),a[i])-s.begin();
 ans+=i-qry(r-1);add(r);}
cout<<ans<<"\\n";`), cpp(`int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
long long ans=0;
for(int i=0;i<n;++i)for(int j=0;j<i;++j)if(a[j]>=a[i])++ans;
cout<<ans<<"\\n";`)],
  },
  "greedy-min-rooms-lectures": {
    solution: cpp(`int n;cin>>n;vector<long long>s(n),e(n);
for(int i=0;i<n;++i)cin>>s[i]>>e[i];
sort(s.begin(),s.end());sort(e.begin(),e.end());
int i=0,j=0,cur=0,best=0;
while(i<n){if(s[i]<e[j]){++cur;++i;best=max(best,cur);}else{--cur;++j;}}
cout<<best<<"\\n";`),
    // Treating a touching endpoint as an overlap books a room that is already free; counting the lectures that start before the first ending ignores the ones that finish in between.
    wrong: [cpp(`int n;cin>>n;vector<long long>s(n),e(n);
for(int i=0;i<n;++i)cin>>s[i]>>e[i];
sort(s.begin(),s.end());sort(e.begin(),e.end());
int i=0,j=0,cur=0,best=0;
while(i<n){if(s[i]<=e[j]){++cur;++i;best=max(best,cur);}else{--cur;++j;}}
cout<<best<<"\\n";`), cpp(`int n;cin>>n;vector<long long>s(n),e(n);
for(int i=0;i<n;++i)cin>>s[i]>>e[i];
sort(s.begin(),s.end());sort(e.begin(),e.end());
int cnt=0;for(int i=0;i<n;++i)if(s[i]<e[0])++cnt;
cout<<max(cnt,1)<<"\\n";`)],
  },
  "string-count-distinct-rotations": {
    solution: cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
int p=n-pi[n-1];
cout<<((n%p==0)?p:n)<<"\\n";`),
    // Reporting the period without checking that it divides the length, and reporting the length of the whole string every time.
    wrong: [cpp(`string s;cin>>s;int n=s.size();vector<int>pi(n,0);
for(int i=1;i<n;++i){int k=pi[i-1];while(k>0&&s[i]!=s[k])k=pi[k-1];if(s[i]==s[k])++k;pi[i]=k;}
cout<<n-pi[n-1]<<"\\n";`), cpp(`string s;cin>>s;cout<<(long long)s.size()<<"\\n";`)],
  },
};

/** The problems the bot can actually play. Everything else falls back to
 *  behaving as if it never solved the round, which is a legitimate outcome
 *  rather than a broken duel. */
export const botReadyProblems = Object.keys(solutions);

export const hasSolution = (key: string) => key in solutions;
