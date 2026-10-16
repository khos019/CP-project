int n,q;cin>>n>>q;vector<long long>f(n+1,0);
auto add=[&](int i,long long v){for(;i<=n;i+=i&-i)f[i]+=v;};
auto sum=[&](int i){long long s=0;for(;i>0;i-=i&-i)s+=f[i];return s;};
for(int i=1;i<=n;++i){long long x;cin>>x;add(i,x);}
while(q--){int t;cin>>t;if(t==1){int i;long long x;cin>>i>>x;add(i,x);}else{int l,r;cin>>l>>r;cout<<sum(r)-sum(l-1)<<'\n';}}
