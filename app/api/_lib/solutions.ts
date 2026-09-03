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
    solution: cpp(`long long a,b;cin>>a>>b;long long g=__gcd(a,b);cout<<g<<" "<<a/g*b<<"\\n";`),
    // Both numbers are right, in the wrong order.
    wrong: [cpp(`long long a,b;cin>>a>>b;long long g=__gcd(a,b);cout<<a/g*b<<" "<<g<<"\\n";`)],
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
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;long long s=0,x;while(n--){cin>>x;s+=x;}cout<<s<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;int s=0,x;while(n--){cin>>x;s+=x;}cout<<s<<\"\\n\";\nreturn 0;}\n"],
  },
  "var-swap": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<b<<\" \"<<a<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b;cin>>a>>b;cout<<a<<\" \"<<b<<\"\\n\";\nreturn 0;}\n"],
  },
  "cond-grade": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;cout<<(n>=90?\"A\":n>=80?\"B\":n>=70?\"C\":\"D\")<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;cout<<(n>90?\"A\":n>80?\"B\":n>70?\"C\":\"D\")<<\"\\n\";\nreturn 0;}\n"],
  },
  "loop-multiples": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n,k;cin>>n>>k;cout<<n/k<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n,k;cin>>n>>k;cout<<n/k+1<<\"\\n\";\nreturn 0;}\n"],
  },
  "loop-power-table": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;for(int i=0;i<=n;++i)cout<<(1LL<<i)<<(i<n?\" \":\"\\n\");\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;for(int i=0;i<=n;++i)cout<<(1<<i)<<(i<n?\" \":\"\\n\");\nreturn 0;}\n"],
  },
  "array-index-query": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int i;cin>>i;cout<<a[i-1]<<\"\\n\";}\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int i;cin>>i;cout<<a[i%n]<<\"\\n\";}\nreturn 0;}\n"],
  },
  "array-count-greater": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;long long x;cin>>n>>x;int c=0;long long v;while(n--){cin>>v;if(v>x)++c;}cout<<c<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;long long x;cin>>n>>x;int c=0;long long v;while(n--){cin>>v;if(v>=x)++c;}cout<<c<<\"\\n\";\nreturn 0;}\n"],
  },
  "string-upper": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;cin>>s;for(auto&c:s)c=toupper(c);cout<<s<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s;cin>>s;for(auto&c:s)c=tolower(c);cout<<s<<\"\\n\";\nreturn 0;}\n"],
  },
  "string-count-char": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s,t;cin>>s>>t;char c=t[0];int n=0;for(char x:s)if(x==c)++n;cout<<n<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring s,t;cin>>s>>t;cout<<(int)s.size()<<\"\\n\";\nreturn 0;}\n"],
  },
  "func-min-of-three": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b,c;cin>>a>>b>>c;cout<<min(a,min(b,c))<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long a,b,c;cin>>a>>b>>c;cout<<min(a,b)<<\"\\n\";\nreturn 0;}\n"],
  },
  "matrix-row-sums": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;for(int i=0;i<r;++i){long long s=0,x;for(int j=0;j<c;++j){cin>>x;s+=x;}cout<<s<<(i+1<r?\" \":\"\\n\");}\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;long long s=0,x;for(int i=0;i<r*c;++i){cin>>x;s+=x;}cout<<s<<\"\\n\";\nreturn 0;}\n"],
  },
  "stl-sort-unique": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());for(size_t i=0;i<a.size();++i)cout<<a[i]<<(i+1<a.size()?\" \":\"\\n\");\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());unique(a.begin(),a.end());for(size_t i=0;i<a.size();++i)cout<<a[i]<<(i+1<a.size()?\" \":\"\\n\");\nreturn 0;}\n"],
  },
  "complexity-ops": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<n*n<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;cout<<n*n<<\"\\n\";\nreturn 0;}\n"],
  },
  "worst-case-scan": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<n<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<n/2<<\"\\n\";\nreturn 0;}\n"],
  },
  "memory-estimate": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<n*4/1024<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<n*4/1000<<\"\\n\";\nreturn 0;}\n"],
  },
  "amortized-doubling": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;long long cap=1;int c=0;while(cap<n){cap*=2;++c;}cout<<c<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;long long cap=1;int c=1;while(cap<n){cap*=2;++c;}cout<<c<<\"\\n\";\nreturn 0;}\n"],
  },
  "constraint-pick": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<((n*n<=100000000LL)?1:0)<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<((n*n<100000000LL)?1:0)<<\"\\n\";\nreturn 0;}\n"],
  },
  "log-steps": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;int c=0;while(n>1){n/=2;++c;}cout<<c<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n;cin>>n;cout<<(long long)log2((double)n)+1<<\"\\n\";\nreturn 0;}\n"],
  },
  "stack-postfix": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring t;vector<long long>st;while(cin>>t){if(t==\"+\"||t==\"-\"||t==\"*\"){long long b=st.back();st.pop_back();long long a=st.back();st.pop_back();st.push_back(t==\"+\"?a+b:t==\"-\"?a-b:a*b);}else st.push_back(stoll(t));}cout<<st.back()<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nstring t;vector<long long>st;while(cin>>t){if(t==\"+\"||t==\"-\"||t==\"*\"){long long a=st.back();st.pop_back();long long b=st.back();st.pop_back();st.push_back(t==\"+\"?a+b:t==\"-\"?a-b:a*b);}else st.push_back(stoll(t));}cout<<st.back()<<\"\\n\";\nreturn 0;}\n"],
  },
  "queue-rotate": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;k%=n;for(long long i=0;i<n;++i)cout<<a[(i+k)%n]<<(i+1<n?\" \":\"\\n\");\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nlong long n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;for(long long i=0;i<n;++i)cout<<a[(i+1)%n]<<(i+1<n?\" \":\"\\n\");\nreturn 0;}\n"],
  },
  "deque-window-min": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;deque<int>d;string out;for(int i=0;i<n;++i){while(!d.empty()&&a[d.back()]>=a[i])d.pop_back();d.push_back(i);if(d.front()<=i-k)d.pop_front();if(i>=k-1)out+=to_string(a[d.front()])+\" \";}out.pop_back();cout<<out<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,k;cin>>n>>k;vector<long long>a(n);for(auto&x:a)cin>>x;deque<int>d;string out;for(int i=0;i<n;++i){while(!d.empty()&&a[d.back()]>=a[i])d.pop_back();d.push_back(i);if(i>=k-1)out+=to_string(a[d.front()])+\" \";}out.pop_back();cout<<out<<\"\\n\";\nreturn 0;}\n"],
  },
  "heap-merge-cost": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;priority_queue<long long,vector<long long>,greater<long long>>q;for(int i=0;i<n;++i){long long x;cin>>x;q.push(x);}long long t=0;while(q.size()>1){long long a=q.top();q.pop();long long b=q.top();q.pop();t+=a+b;q.push(a+b);}cout<<t<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;priority_queue<long long>q;for(int i=0;i<n;++i){long long x;cin>>x;q.push(x);}long long t=0;while(q.size()>1){long long a=q.top();q.pop();long long b=q.top();q.pop();t+=a+b;q.push(a+b);}cout<<t<<\"\\n\";\nreturn 0;}\n"],
  },
  "set-missing-smallest": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;set<long long>s;for(int i=0;i<n;++i){long long x;cin>>x;s.insert(x);}long long k=1;while(s.count(k))++k;cout<<k<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n;cin>>n;for(int i=0;i<n;++i){long long x;cin>>x;}cout<<n+1<<\"\\n\";\nreturn 0;}\n"],
  },
  "map-word-freq": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nmap<string,int>c;string w;while(cin>>w)++c[w];int best=0;string ans;for(auto&p:c)if(p.second>best){best=p.second;ans=p.first;}cout<<ans<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nmap<string,int>c;string w;while(cin>>w)++c[w];int best=0;string ans;for(auto&p:c)if(p.second>=best){best=p.second;ans=p.first;}cout<<ans<<\"\\n\";\nreturn 0;}\n"],
  },
  "prefix-2d-sum": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<vector<long long>>g(r,vector<long long>(c));for(auto&row:g)for(auto&x:row)cin>>x;int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;long long s=0;for(int i=r1-1;i<r2;++i)for(int j=c1-1;j<c2;++j)s+=g[i][j];cout<<s<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<vector<long long>>g(r,vector<long long>(c));for(auto&row:g)for(auto&x:row)cin>>x;int r1,c1,r2,c2;cin>>r1>>c1>>r2>>c2;long long s=0;for(int i=r1-1;i<r2-1;++i)for(int j=c1-1;j<c2-1;++j)s+=g[i][j];cout<<s<<\"\\n\";\nreturn 0;}\n"],
  },
  "dsu-largest-set": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<int>p(n+1),sz(n+1,1);for(int i=0;i<=n;++i)p[i]=i;function<int(int)>f=[&](int x){while(p[x]!=x)x=p[x]=p[p[x]];return x;};for(int i=0;i<m;++i){int a,b;cin>>a>>b;int ra=f(a),rb=f(b);if(ra!=rb){p[ra]=rb;sz[rb]+=sz[ra];}}int best=0;for(int v=1;v<=n;++v)best=max(best,sz[f(v)]);cout<<best<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<int>p(n+1);for(int i=0;i<=n;++i)p[i]=i;function<int(int)>f=[&](int x){while(p[x]!=x)x=p[x]=p[p[x]];return x;};int c=0;for(int i=0;i<m;++i){int a,b;cin>>a>>b;if(f(a)!=f(b)){p[f(a)]=f(b);++c;}}cout<<c+1<<\"\\n\";\nreturn 0;}\n"],
  },
  "bit-fenwick-sum": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int t;cin>>t;if(t==1){int i;long long x;cin>>i>>x;a[i-1]+=x;}else{int l,r;cin>>l>>r;long long s=0;for(int i=l-1;i<r;++i)s+=a[i];cout<<s<<\"\\n\";}}\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;while(q--){int t;cin>>t;if(t==1){int i;long long x;cin>>i>>x;a[i-1]=x;}else{int l,r;cin>>l>>r;long long s=0;for(int i=l-1;i<r;++i)s+=a[i];cout<<s<<\"\\n\";}}\nreturn 0;}\n"],
  },
  "graph-degree-max": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[a];++d[b];}int best=1;for(int v=2;v<=n;++v)if(d[v]>d[best])best=v;cout<<best<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[a];++d[b];}int best=1;for(int v=2;v<=n;++v)if(d[v]>=d[best])best=v;cout<<best<<\"\\n\";\nreturn 0;}\n"],
  },
  "graph-path-exists": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}int u,v;cin>>u>>v;vector<char>s(n+1,0);vector<int>st{u};s[u]=1;while(!st.empty()){int x=st.back();st.pop_back();for(int y:g[x])if(!s[y]){s[y]=1;st.push_back(y);}}cout<<(s[v]?\"YES\":\"NO\")<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);}int u,v;cin>>u>>v;vector<char>s(n+1,0);vector<int>st{u};s[u]=1;while(!st.empty()){int x=st.back();st.pop_back();for(int y:g[x])if(!s[y]){s[y]=1;st.push_back(y);}}cout<<(s[v]?\"YES\":\"NO\")<<\"\\n\";\nreturn 0;}\n"],
  },
  "graph-count-edges-tree": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}if(m!=n-1){cout<<\"NO\\n\";return 0;}vector<char>s(n+1,0);vector<int>st{1};s[1]=1;int c=1;while(!st.empty()){int x=st.back();st.pop_back();for(int y:g[x])if(!s[y]){s[y]=1;++c;st.push_back(y);}}cout<<(c==n?\"YES\":\"NO\")<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;for(int i=0;i<m;++i){int a,b;cin>>a>>b;}cout<<(m==n-1?\"YES\":\"NO\")<<\"\\n\";\nreturn 0;}\n"],
  },
  "grid-count-islands": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;int n=0;for(int y=0;y<r;++y)for(int x=0;x<c;++x){if(g[y][x]!=35)continue;++n;vector<pair<int,int>>st{{y,x}};g[y][x]=46;while(!st.empty()){auto[cy,cx]=st.back();st.pop_back();int dy[]={1,-1,0,0},dx[]={0,0,1,-1};for(int k=0;k<4;++k){int ny=cy+dy[k],nx=cx+dx[k];if(ny>=0&&ny<r&&nx>=0&&nx<c&&g[ny][nx]==35){g[ny][nx]=46;st.push_back({ny,nx});}}}}cout<<n<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint r,c;cin>>r>>c;vector<string>g(r);for(auto&s:g)cin>>s;int n=0;for(int y=0;y<r;++y)for(int x=0;x<c;++x)if(g[y][x]==35)++n;cout<<n<<\"\\n\";\nreturn 0;}\n"],
  },
  "graph-farthest": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}int best=0;for(int v=1;v<=n;++v)best=max(best,d[v]);cout<<best<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>d(n+1,0);queue<int>q;vector<char>s(n+1,0);s[1]=1;q.push(1);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(!s[u]){s[u]=1;d[u]=d[v]+1;q.push(u);}}cout<<d[n]<<\"\\n\";\nreturn 0;}\n"],
  },
  "graph-indegree-zero": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[b];}string out;for(int v=1;v<=n;++v)if(d[v]==0)out+=to_string(v)+\" \";if(out.empty())cout<<\"-1\\n\";else{out.pop_back();cout<<out<<\"\\n\";}\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<int>d(n+1,0);for(int i=0;i<m;++i){int a,b;cin>>a>>b;++d[a];}string out;for(int v=1;v<=n;++v)if(d[v]==0)out+=to_string(v)+\" \";if(out.empty())cout<<\"-1\\n\";else{out.pop_back();cout<<out<<\"\\n\";}\nreturn 0;}\n"],
  },
  "graph-bfs-bipartite-sides": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>col(n+1,0);long long c0=0,c1=0;for(int s=1;s<=n;++s){if(col[s])continue;col[s]=1;++c0;queue<int>q;q.push(s);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v]){if(col[u]==col[v]){cout<<\"-1\\n\";return 0;}if(!col[u]){col[u]=-col[v];if(col[u]==1)++c0;else ++c1;q.push(u);}}}}cout<<max(c0,c1)<<\" \"<<min(c0,c1)<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}vector<int>col(n+1,0);long long c0=0,c1=0;for(int s=1;s<=n;++s){if(col[s])continue;col[s]=1;++c0;queue<int>q;q.push(s);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v]){if(col[u]==col[v]){cout<<\"-1\\n\";return 0;}if(!col[u]){col[u]=-col[v];if(col[u]==1)++c0;else ++c1;q.push(u);}}}}cout<<c1<<\" \"<<c0<<\"\\n\";\nreturn 0;}\n"],
  },
  "graph-weight-total": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;long long s=0;for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;s+=w;}cout<<s<<\"\\n\";\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;int s=0;for(int i=0;i<m;++i){int a,b,w;cin>>a>>b>>w;s+=w;}cout<<s<<\"\\n\";\nreturn 0;}\n"],
  },
  "dijkstra-all-dist": {
    solution: "#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n+1);for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back({b,w});g[b].push_back({a,w});}const long long INF=(long long)4e18;vector<long long>d(n+1,INF);d[1]=0;priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>>q;q.push({0,1});while(!q.empty()){auto[cur,v]=q.top();q.pop();if(cur>d[v])continue;for(auto[u,w]:g[v])if(cur+w<d[u]){d[u]=cur+w;q.push({d[u],u});}}for(int v=1;v<=n;++v)cout<<(d[v]<INF?d[v]:-1)<<(v<n?\" \":\"\\n\");\nreturn 0;}\n",
    wrong: ["#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr);\nint n,m;cin>>n>>m;vector<vector<int>>g(n+1);for(int i=0;i<m;++i){int a,b;long long w;cin>>a>>b>>w;g[a].push_back(b);g[b].push_back(a);}vector<long long>d(n+1,-1);queue<int>q;d[1]=0;q.push(1);while(!q.empty()){int v=q.front();q.pop();for(int u:g[v])if(d[u]<0){d[u]=d[v]+1;q.push(u);}}for(int v=1;v<=n;++v)cout<<d[v]<<(v<n?\" \":\"\\n\");\nreturn 0;}\n"],
  },
};

/** The problems the bot can actually play. Everything else falls back to
 *  behaving as if it never solved the round, which is a legitimate outcome
 *  rather than a broken duel. */
export const botReadyProblems = Object.keys(solutions);

export const hasSolution = (key: string) => key in solutions;
