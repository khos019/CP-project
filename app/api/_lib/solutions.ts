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
};

/** The problems the bot can actually play. Everything else falls back to
 *  behaving as if it never solved the round, which is a legitimate outcome
 *  rather than a broken duel. */
export const botReadyProblems = Object.keys(solutions);

export const hasSolution = (key: string) => key in solutions;
