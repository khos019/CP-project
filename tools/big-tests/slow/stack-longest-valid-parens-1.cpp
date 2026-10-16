#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s; cin >> s;
    int n = s.size();
    int p[n];
    
    // for(int i = 0; i < n; i ++) p[i] = p[i - 1] + (s[i] == '(' ? 1 : -1);
    
    int mx = 0;
    
    for(int i = 0; i < n; i ++) {
        int cnt = 0;
        for(int j = i; j < n; j ++) {
            cnt += (s[j] == '(' ? 1 : -1);
            if(cnt < 0) break;
            if(cnt == 0) mx = max(mx,j - i + 1);
        }
    }
    cout << mx;
    return 0;
}
