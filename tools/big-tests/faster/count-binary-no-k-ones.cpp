long long n,k;cin>>n>>k;const long long M=1000000007;
// E[t+1] = strings of length t with no run of k ones; E[0] = 1 stands for the
// start of the string. A string of length i ends in a run of j < k ones after
// a zero (or the start), so E[i+1] is the sum of E[i-m .. i], m = min(i, k-1):
// a sliding window over prefix sums instead of the O(n*k) inner loop.
vector<long long>E(n+2,0),P(n+3,0);E[0]=1;E[1]=1;P[1]=1;P[2]=2;
for(long long i=1;i<=n;++i){long long m=min(i,k-1);E[i+1]=((P[i+1]-P[i-m])%M+M)%M;P[i+2]=(P[i+1]+E[i+1])%M;}
cout<<E[n+1]%M<<'\n';
