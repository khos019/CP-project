int n;long long k;cin>>n>>k;
vector<vector<int>>g(n+1);
for(int i=0;i<n-1;++i){int a,b;cin>>a>>b;g[a].push_back(b);g[b].push_back(a);}
// Centroid decomposition with every buffer allocated once: counting pairs at
// distance <= k through each centroid, minus those inside one child subtree.
vector<char>dead(n+1,0);vector<int>sz(n+1,0),par(n+1,0),ord,stk,all,part,roots{1};
vector<pair<int,int>>st2;long long answer=0;
auto countPairs=[&](vector<int>&d)->long long{sort(d.begin(),d.end());long long total=0;int i=0,j=(int)d.size()-1;
while(i<j){if(d[i]+d[j]<=k){total+=j-i;++i;}else --j;}return total;};
while(!roots.empty()){int root=roots.back();roots.pop_back();
ord.clear();par[root]=0;stk.assign(1,root);
while(!stk.empty()){int u=stk.back();stk.pop_back();ord.push_back(u);for(int v:g[u])if(!dead[v]&&v!=par[u]){par[v]=u;stk.push_back(v);}}
for(int i=(int)ord.size()-1;i>=0;--i){int u=ord[i];sz[u]=1;for(int v:g[u])if(!dead[v]&&v!=par[u])sz[u]+=sz[v];}
int total=(int)ord.size(),c=root;
for(int u:ord){int worst=total-sz[u];for(int v:g[u])if(!dead[v]&&v!=par[u])worst=max(worst,sz[v]);if(2*worst<=total){c=u;break;}}
all.assign(1,0);
for(int v:g[c])if(!dead[v]){part.clear();par[v]=c;st2.assign(1,{v,1});
while(!st2.empty()){auto[u,d]=st2.back();st2.pop_back();part.push_back(d);for(int w:g[u])if(!dead[w]&&w!=par[u]){par[w]=u;st2.push_back({w,d+1});}}
answer-=countPairs(part);all.insert(all.end(),part.begin(),part.end());}
answer+=countPairs(all);dead[c]=1;
for(int v:g[c])if(!dead[v])roots.push_back(v);}
cout<<answer<<'\n';
