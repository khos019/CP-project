// A stand-in for libstdc++'s <bits/stdc++.h>, for running the generator on a
// machine whose "g++" is Apple clang -- which ships libc++, where that header
// does not exist. Without it `node run.mjs` fails to compile every reference
// solution on macOS before it can check anything.
//
// This is only for the local verification pass. The judge compiles the same
// sources against real GCC on Linux, where the genuine header is used, so this
// file must never gain anything that header does not already provide.
#pragma once
#include <algorithm>
#include <array>
#include <bitset>
#include <cassert>
#include <cctype>
#include <climits>
#include <cmath>
#include <complex>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <deque>
#include <functional>
#include <iomanip>
#include <iostream>
#include <iterator>
#include <limits>
#include <list>
#include <map>
#include <numeric>
#include <queue>
#include <random>
#include <set>
#include <sstream>
#include <stack>
#include <string>
#include <tuple>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
