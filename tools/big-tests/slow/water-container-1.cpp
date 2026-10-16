#pragma GCC optimize("Ofast", "unroll-loops")

#include <bits/stdc++.h>
using namespace std;

int32_t main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n; cin >> n;
    vector <int> a(n);
    for (int &i : a) cin >> i;
    long long ans = 0;
    for (int i = 1; i < n; ++i)
        for (int j = 0; j < i; ++j)
            ans = max(ans, 1ll * min(a[i], a[j]) * (i - j));
    cout << ans;
    return 0;
}
