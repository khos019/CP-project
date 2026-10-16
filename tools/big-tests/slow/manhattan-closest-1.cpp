#include <bits/stdc++.h>
using namespace std;
#define int long long
int dist(pair<int, int> x,pair<int, int>y){ return abs(x.first-y.first)+abs(x.second-y.second); };
int32_t main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n; cin >> n;
    vector <pair<int, int>> a(n);
    for (auto &[x, y] : a) cin >> x >> y;
    sort(begin(a), end(a), [&] (auto r, auto l) { return r.first + r.second < l.first + l.second; });
    int ans = 4e9;
    for (int i = 1; i < n; ++i) ans = min(ans, dist(a[i], a[i-1]));
    sort(begin(a), end(a), [&] (auto r, auto l) { return r.first - r.second < l.first - l.second; });
    for (int i = 1; i < n; ++i) ans = min(ans, dist(a[i], a[i-1]));
    cout << ans;
    return 0;
}
