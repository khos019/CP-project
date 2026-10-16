int n,q;cin>>n>>q;int L=1;while((1<<L)<=n)++L;
vector<vector<long long>>t(L,vector<long long>(n));
for(auto&x:t[0])cin>>x;
for(int j=1;j<L;++j)for(int i=0;i+(1<<j)<=n;++i)t[j][i]=min(t[j-1][i],t[j-1][i+(1<<(j-1))]);
while(q--){int l,r;cin>>l>>r;--l;int j=31-__builtin_clz(r-l);cout<<min(t[j][l],t[j][r-(1<<j)])<<'\n';}
