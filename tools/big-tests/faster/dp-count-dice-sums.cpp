long long n,f,s;cin>>n>>f>>s;const unsigned M=1000000007u;
// The same prefix-sum DP, with both buffers allocated once, 32-bit cells, a
// conditional subtraction in place of each modulo, and each round limited to
// the sums it can reach: the judge compiles without -O2, and at n = f = 500,
// s = 10^5 the plain version needed most of the time limit.
if(s<n||s>n*f){cout<<0<<'\n';return 0;}
vector<unsigned>dp(s+1,0),pre(s+2,0);dp[0]=1;
for(long long i=0;i<n;++i){long long top=min(s,i*f);
 pre[0]=0;for(long long v=0;v<=top;++v){unsigned x=pre[v]+dp[v];pre[v+1]=x>=M?x-M:x;}
 long long ntop=min(s,(i+1)*f);
 for(long long v=ntop;v>=0;--v){long long lo=max(0LL,v-f),hi=min(v-1,top);
  if(hi<lo){dp[v]=0;continue;}unsigned a=pre[hi+1],b=pre[lo];dp[v]=a>=b?a-b:a+M-b;}}
cout<<dp[s]<<'\n';
