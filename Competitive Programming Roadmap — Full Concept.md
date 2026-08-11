# Competitive Programming Roadmap — Full Concept

## 1. Asosiy maqsad

Roadmap oddiy mavzular ro‘yxati bo‘lmasligi kerak.

Masalan, faqat:

- Binary Search
- Graph
- DP
- Segment Tree
- Number Theory

deb mavzularni ketma-ket chiqarish yetarli emas.

Roadmap foydalanuvchiga quyidagi savollarga javob berishi kerak:

- Men qayerdan boshlashim kerak?
- Hozir qaysi mavzuni o‘rganishim kerak?
- Bu mavzuni o‘rganishdan oldin nimalarni bilishim kerak?
- Qaysi mavzularni tugatdim?
- Qaysi mavzular hali locked?
- Qanday masalalar yechishim kerak?
- Mening hozirgi darajam qanday?
- Keyingi bosqichga o‘tish uchun nima qilishim kerak?

Shuning uchun roadmapni **learning system** sifatida qurish kerak.

---

# 2. Roadmap umumiy strukturasi

Asosiy yo‘l quyidagicha bo‘lishi mumkin:

```text
START
  │
  ▼
Programming Fundamentals
  │
  ▼
Competitive Programming Fundamentals
  │
  ├───────────────┬────────────────┐
  ▼               ▼                ▼
Math          Algorithms      Data Structures
  │               │                │
  └───────────────┴──────────┬─────┘
                             ▼
                           Greedy
                             │
                      ┌──────┴──────┐
                      ▼             ▼
                   Graphs           DP
                      │             │
                      └──────┬──────┘
                             ▼
                           Strings
                             │
                             ▼
                         Geometry
                             │
                             ▼
                     Advanced Topics
                             │
                             ▼
                      ICPC / Expert
```

Bu structure beginnerdan expertgacha olib boradigan asosiy yo‘l bo‘ladi.

---

# 3. 0-bosqich — Getting Started

Bu competitive programming haqida umuman bilimga ega bo‘lmagan odamlar uchun.

## Competitive Programming Introduction

- What is Competitive Programming?
- Competitive Programming qanday ishlaydi?
- Online Judge nima?
- Codeforces nima?
- AtCoder nima?
- LeetCode va Competitive Programming farqi
- Contest qanday ishlaydi?
- Time Limit nima?
- Memory Limit nima?
- Accepted nima?
- Wrong Answer nima?
- Time Limit Exceeded nima?
- Runtime Error nima?

---

# 4. Programming Fundamentals

Competitive Programming uchun asosiy til sifatida C++ ishlatilishi mumkin.

## C++ Basics

- C++ setup
- Compiler
- IDE
- Input / Output
- Variables
- Data Types
- Operators
- Conditions
- If / Else
- Switch
- Loops
- For loop
- While loop
- Functions
- Arrays
- Strings
- References
- Basic pointers
- Struct
- Pair

## Basic STL

- vector
- pair
- stack
- queue
- deque
- set
- multiset
- map
- unordered_map
- priority_queue

## Useful STL Functions

- sort()
- reverse()
- min()
- max()
- lower_bound()
- upper_bound()
- binary_search()

## Competitive Programming C++ Concepts

- Fast I/O
- ios::sync_with_stdio(false)
- cin.tie(nullptr)
- Integer overflow
- long long
- Debugging
- Macros
- typedef
- using
- lambda functions
- custom comparators

### Target

Codeforces:

```text
800 rating
```

darajasidagi oddiy masalalarni mustaqil yecha olish.

---

# 5. Competitive Programming Fundamentals

Bu roadmapning eng muhim foundation qismlaridan biri.

Tavsiya etilgan progression:

```text
Complexity
   ↓
Brute Force
   ↓
Sorting
   ↓
Prefix Sum
   ↓
Binary Search
   ↓
Two Pointers
   ↓
Sliding Window
   ↓
Recursion
   ↓
Backtracking
```

## Topics

### Complexity

- Time Complexity
- Space Complexity
- Big O notation
- O(1)
- O(log n)
- O(n)
- O(n log n)
- O(n²)
- O(2^n)
- Complexity estimation
- Time limit bo‘yicha complexity tanlash

### Brute Force

- Complete Search
- Enumeration
- Simulation
- Checking all possibilities

### Sorting

- Basic sorting
- Sorting arrays
- Sorting pairs
- Custom comparator
- Stable sort

### Prefix Sum

- 1D Prefix Sum
- Range Sum
- 2D Prefix Sum
- Difference Array

### Binary Search

- Binary Search Basics
- Searching sorted arrays
- lower_bound
- upper_bound
- Binary Search on Answer
- Monotonic functions

### Two Pointers

- Opposite pointers
- Same direction pointers
- Sorted array problems

### Sliding Window

- Fixed-size window
- Variable-size window
- Frequency window

### Recursion

- Recursive functions
- Base case
- Recursive state

### Backtracking

- Permutations
- Subsets
- Combinations
- Search trees

### Additional topics

- Coordinate Compression
- Meet in the Middle
- Bit Manipulation
- Bitmask Enumeration

### Target

```text
800 → 1200
```

---

# 6. Mathematics for Competitive Programming

Math alohida katta roadmap bo‘lishi kerak.

Progression:

```text
Basic Math
   │
   ├── GCD / LCM
   ├── Prime Numbers
   ├── Modular Arithmetic
   ├── Combinatorics
   └── Number Theory
```

## Basic Mathematics

- Arithmetic
- Fractions
- Powers
- Exponents
- Logarithms
- Algebra
- Sequences
- Number bases

## GCD / LCM

- Greatest Common Divisor
- Least Common Multiple
- Euclidean Algorithm

## Prime Numbers

- Prime checking
- Prime factorization
- Sieve of Eratosthenes
- SPF — Smallest Prime Factor
- Divisors

## Modular Arithmetic

- Modulo basics
- Addition modulo
- Multiplication modulo
- Modular exponentiation
- Binary exponentiation
- Modular inverse

## Number Theory

- Fermat's Little Theorem
- Extended Euclidean Algorithm
- Euler Phi
- Chinese Remainder Theorem
- Diophantine Equations

## Combinatorics

- Factorials
- Permutations
- Combinations
- Pascal Triangle
- nCr
- Counting
- Inclusion-Exclusion Principle
- Pigeonhole Principle

### Target

```text
900 → 1800
```

---

# 7. Data Structures

Data Structures ham alohida katta roadmap bo‘lishi kerak.

Progression:

```text
Arrays
  │
  ├── Stack
  ├── Queue
  ├── Set / Map
  ├── Heap
  ├── DSU
  ├── Fenwick Tree
  └── Segment Tree
```

## Basic Structures

- Arrays
- Vectors
- Strings
- Pair

## Stack

- Stack
- Monotonic Stack
- Next Greater Element
- Previous Greater Element

## Queue

- Queue
- Deque
- Monotonic Queue

## Set / Map

- Set
- Multiset
- Map
- Unordered Map
- Frequency Map

## Heap

- Priority Queue
- Min Heap
- Max Heap

## DSU

- Disjoint Set Union
- Union Find
- Path Compression
- Union by Rank
- Union by Size

## Fenwick Tree

- Binary Indexed Tree
- Prefix Sum Queries
- Update Queries

## Segment Tree

- Segment Tree Basics
- Range Query
- Point Update
- Range Update
- Lazy Propagation

## Sparse Table

- Static Range Queries
- RMQ

## Advanced Structures

- Sqrt Decomposition
- Ordered Set
- Trie
- Persistent Segment Tree
- Treap
- Implicit Treap

### Target

```text
1000 → 2200+
```

---

# 8. Greedy Algorithms

Greedy'ni faqat bitta mavzu sifatida emas, alohida progression sifatida ko‘rsatish kerak.

```text
Greedy Basics
   ↓
Sorting + Greedy
   ↓
Intervals
   ↓
Scheduling
   ↓
Constructive Greedy
   ↓
Advanced Greedy
```

## Topics

- Greedy intuition
- How to identify greedy problems
- Greedy correctness
- Exchange argument
- Sorting + Greedy
- Interval problems
- Activity Selection
- Scheduling
- Minimum / Maximum optimization
- Constructive Greedy
- Greedy + Priority Queue
- Greedy + Data Structures

### Target

```text
900 → 1800
```

---

# 9. Graph Theory

Graph Theory roadmapning eng katta bo‘limlaridan biri bo‘lishi kerak.

Structure:

```text
Graph Basics
   │
   ├── DFS
   ├── BFS
   │
   ├── Shortest Paths
   │     ├── Dijkstra
   │     ├── Bellman Ford
   │     └── Floyd Warshall
   │
   ├── Trees
   │     ├── Diameter
   │     ├── LCA
   │     └── Binary Lifting
   │
   └── Advanced Graphs
```

## Graph Basics

- Graph definition
- Nodes
- Edges
- Directed Graph
- Undirected Graph
- Weighted Graph
- Graph Representation
- Adjacency Matrix
- Adjacency List

## DFS

- Depth First Search
- Connected Components
- Cycle Detection
- Flood Fill
- Grid DFS

## BFS

- Breadth First Search
- Shortest path in unweighted graph
- Grid BFS
- Multi-source BFS

## Bipartite Graph

- Bipartite checking
- Graph coloring

## Topological Sort

- DAG
- Kahn's Algorithm
- DFS Topological Sort

## Shortest Paths

- BFS shortest path
- 0-1 BFS
- Dijkstra
- Bellman-Ford
- Floyd-Warshall

## Minimum Spanning Tree

- MST
- Kruskal
- Prim
- DSU + Kruskal

## Trees

- Tree basics
- DFS on Tree
- Tree depth
- Tree height
- Subtree size
- Tree Diameter
- Euler Tour
- Binary Lifting
- Lowest Common Ancestor

## Advanced Graph Theory

- Strongly Connected Components
- Kosaraju
- Tarjan
- Bridges
- Articulation Points
- Functional Graphs
- Heavy Light Decomposition
- Centroid Decomposition
- Bipartite Matching
- Maximum Flow
- Minimum Cut
- Min Cost Max Flow
- 2-SAT

### Target

```text
1000 → 2500+
```

---

# 10. Dynamic Programming

Dynamic Programming ham katta va alohida learning path bo‘lishi kerak.

Progression:

```text
DP Basics
   ↓
1D DP
   ↓
2D DP
   ↓
Knapsack
   ↓
LIS
   ↓
Grid DP
   ↓
String DP
   ↓
Interval DP
   ↓
Tree DP
   ↓
Bitmask DP
   ↓
Digit DP
```

## DP Fundamentals

- What is Dynamic Programming?
- Memoization
- Tabulation
- State
- Transition
- Base Case
- DP reconstruction

## Basic DP

- 1D DP
- 2D DP
- Grid DP

## Classical Problems

- Fibonacci
- Coin Change
- 0/1 Knapsack
- Unbounded Knapsack
- Longest Increasing Subsequence
- Longest Common Subsequence

## String DP

- Edit Distance
- LCS
- Palindromic DP

## Advanced DP

- Interval DP
- DAG DP
- Tree DP
- Rerooting DP
- Bitmask DP
- Digit DP
- Probability DP
- Game DP

## DP Optimization

- Divide and Conquer Optimization
- Knuth Optimization
- Convex Hull Trick

### Target

```text
1100 → 2500+
```

---

# 11. Strings

Strings alohida roadmap bo‘lishi kerak.

## Topics

- String Basics
- Character Frequency
- Palindrome
- Prefix / Suffix
- String Matching
- String Hashing
- Rolling Hash
- Polynomial Hash
- Prefix Function
- KMP Algorithm
- Z Algorithm
- Trie
- Manacher Algorithm
- Aho-Corasick
- Suffix Array
- LCP Array
- Suffix Automaton

### Target

```text
1000 → 2400+
```

---

# 12. Computational Geometry

Geometry advanced users uchun alohida roadmap bo‘lishi mumkin.

## Topics

- Points
- Vectors
- Distance
- Dot Product
- Cross Product
- Orientation
- Lines
- Line Intersection
- Segments
- Segment Intersection
- Polygon
- Polygon Area
- Point in Polygon
- Convex Hull
- Rotating Calipers
- Sweep Line
- Closest Pair of Points

### Target

```text
1400 → 2400+
```

---

# 13. Advanced Competitive Programming

Bu Expert / ICPC section bo‘ladi.

## Advanced Data Structures

- Persistent Segment Tree
- Treap
- Implicit Treap
- Li Chao Tree
- Wavelet Tree
- Ordered Set

## Advanced Queries

- Mo's Algorithm
- Mo's Algorithm with Updates
- Offline Queries
- Parallel Binary Search

## Advanced Tree Algorithms

- Small-to-Large
- DSU on Tree
- Heavy-Light Decomposition
- Centroid Decomposition

## Optimization Algorithms

- Convex Hull Trick
- Divide & Conquer Optimization
- Knuth Optimization

## Advanced Graphs

- Network Flow
- Dinic
- Min Cost Max Flow
- Bipartite Matching

## Advanced Math

- Matrix Exponentiation
- FFT
- NTT
- Advanced Number Theory

## Game Theory

- Nim
- Sprague-Grundy
- Grundy Numbers

### Target

```text
1900 → 3000+
```

---

# 14. Roadmap Unlock System

Roadmap oddiy ro‘yxat emas, unlock system bilan ishlashi mumkin.

Masalan:

```text
Sorting
   ✅
   │
   ▼
Binary Search
   🔓
   │
   ▼
Binary Search on Answer
   🔒
```

Masalan Binary Search unlock condition:

```text
✓ Sorting lesson completed
✓ Sorting quiz >= 70%
✓ 5 / 8 practice problems solved
```

Shundan keyin:

```text
Binary Search unlocked
```

bo‘ladi.

Bu userga game progression hissini beradi.

---

# 15. Topic Statuslari

Har bir topic uchta yoki to‘rtta statusga ega bo‘lishi mumkin.

## Completed

```text
✅ Completed
```

User topicni muvaffaqiyatli tugatgan.

## Available

```text
🟢 Available
```

Topicni boshlash mumkin.

## In Progress

```text
🔵 In Progress
```

User topicni o‘rganishni boshlagan.

## Locked

```text
🔒 Locked
```

Prerequisite hali tugatilmagan.

---

# 16. Har bir Topic Page qanday bo‘lishi kerak

Misol:

# Binary Search

```text
Difficulty: Beginner
Rating: 900–1200
Estimated Time: 2 hours

Progress:
████████░░ 80%
```

## Lessons

```text
01. Introduction                ✅
02. How Binary Search Works     ✅
03. Basic Implementation        ✅
04. lower_bound                 ✅
05. upper_bound                 ✅
06. Binary Search on Answer     🔵
07. Practice Problems           🔒
08. Final Challenge             🔒
```

---

# 17. Topic ichidagi lesson structure

Har bir topic bir necha sectiondan iborat bo‘lishi mumkin.

Masalan:

```text
Learn
  ↓
Examples
  ↓
Quiz
  ↓
Practice
  ↓
Challenge
```

## Learn

Nazariy qism.

## Examples

Vizual yoki kod misollar.

## Quiz

5–10 ta savol.

## Practice

Competitive programming masalalari.

## Challenge

Bir yoki bir necha qiyinroq masala.

---

# 18. Practice Problems System

Har bir topic ichida masalalar difficulty bo‘yicha ajratilishi mumkin.

```text
Practice Problems

🟢 Easy
✓ Problem 1
✓ Problem 2
○ Problem 3

🟡 Medium
○ Problem 4
○ Problem 5

🔴 Challenge
○ Problem 6
```

Masalalar manbasi:

- Codeforces
- AtCoder
- CSES
- CodeChef
- LeetCode
- Timus
- E-olymp

bo‘lishi mumkin.

---

# 19. Problem uchun ma'lumotlar

Har bir problem quyidagicha ko‘rsatilishi mumkin:

```text
Problem Name

Platform: Codeforces
Rating: 1200
Topic: Binary Search
Difficulty: Easy
Status: Solved
```

Qo‘shimcha:

```text
Attempts: 3
Best Time: 18 min
Solved At: 10 Aug 2026
```

---

# 20. Rating System

Roadmap Codeforces-style rating bilan bog‘lanishi mumkin.

Masalan:

```text
🟢 Beginner
800–1000

🔵 Easy
1000–1200

🟣 Intermediate
1200–1500

🟠 Advanced
1500–1900

🔴 Expert
1900–2400

⚫ Master
2400+
```

Har bir roadmap topicga rating range beriladi.

Masalan:

```text
Prefix Sum
800–1100

Binary Search
900–1300

Greedy
1000–1600

Segment Tree
1500–2100

Digit DP
1800–2400
```

---

# 21. Personalized Recommendation

Userning current ratingi yoki progressiga qarab sayt keyingi topicni tavsiya qilishi mumkin.

Masalan:

```text
Current Rating: 1134
```

Recommended:

```text
→ Binary Search
→ Prefix Sum
→ Two Pointers
→ Basic Greedy
```

Not recommended yet:

```text
🔒 Segment Tree
🔒 Digit DP
🔒 Heavy-Light Decomposition
```

Bu juda muhim feature.

Chunki beginner foydalanuvchilar ko‘pincha:

```text
Keyin nimani o‘rganaman?
```

degan savolga javob topolmaydi.

Sayt aynan shu muammoni hal qilishi kerak.

---

# 22. Roadmapning ikkita ko‘rinishi

Saytda ikki xil roadmap view bo‘lishi mumkin.

---

## View 1 — Learning Path

Beginner uchun.

```text
Start
 ↓
C++
 ↓
Complexity
 ↓
Arrays
 ↓
Sorting
 ↓
Prefix Sum
 ↓
Binary Search
 ↓
Two Pointers
 ↓
Math
 ↓
Greedy
 ↓
Graphs
 ↓
Dynamic Programming
 ↓
Advanced
```

Bu userga aniq:

```text
1 → 2 → 3 → 4
```

yo‘lini ko‘rsatadi.

---

## View 2 — Skill Map

Tajribali user uchun.

```text
Algorithms
├── Binary Search
├── Two Pointers
├── Sliding Window
├── Greedy
└── Divide & Conquer

Data Structures
├── DSU
├── Fenwick Tree
├── Segment Tree
├── Sparse Table
└── Trie

Graphs
├── BFS
├── DFS
├── Shortest Path
├── MST
├── SCC
├── LCA
└── Flow

Dynamic Programming
├── Knapsack
├── LIS
├── Tree DP
├── Bitmask DP
└── Digit DP
```

Experienced user kerakli topicni to‘g‘ridan-to‘g‘ri topa oladi.

---

# 23. User Dashboard

Dashboardda quyidagilar ko‘rsatilishi mumkin.

```text
Welcome back, Firuz

Current Level:
Intermediate

Current Rating:
1284

Roadmap Progress:
42%

Topics Completed:
34 / 82

Problems Solved:
286

Current Streak:
12 days
```

---

# 24. Continue Learning

Dashboardning asosiy qismida:

```text
Continue Learning

Binary Search
Progress: 70%

[Continue]
```

bo‘lishi kerak.

---

# 25. Recommended Next

```text
Recommended for you

1. Binary Search on Answer
2. Two Pointers
3. Prefix Sum 2D
4. Basic Greedy
```

---

# 26. Daily Practice

Saytda:

```text
Today's Practice
```

sectioni bo‘lishi mumkin.

Masalan:

```text
1 Easy
2 Medium
1 Challenge
```

yoki:

```text
Today's Goal

Solve 3 problems
Complete Binary Search lesson
Take 1 quiz
```

---

# 27. Progress System

Userning umumiy roadmap progressi ko‘rsatiladi.

Masalan:

```text
Overall Progress

Programming Basics       100%
CP Fundamentals           85%
Mathematics               62%
Data Structures           41%
Greedy                    35%
Graphs                    20%
Dynamic Programming       14%
Strings                    8%
Advanced                   0%
```

---

# 28. Gamification

Roadmapni qiziqarli qilish uchun XP system qo‘shish mumkin.

Masalan:

```text
Complete lesson
+10 XP

Pass quiz
+20 XP

Solve Easy problem
+10 XP

Solve Medium problem
+20 XP

Solve Hard problem
+40 XP

Complete topic
+100 XP
```

---

# 29. User Level System

```text
Level 1 — Beginner
Level 2 — Learner
Level 3 — Solver
Level 4 — Challenger
Level 5 — Specialist
Level 6 — Expert
Level 7 — Master
```

Yoki Codeforces style:

```text
Newbie
Pupil
Specialist
Expert
Candidate Master
Master
International Master
Grandmaster
```

---

# 30. Achievement System

Misollar:

```text
First Blood
Solve your first problem

Ten Problems
Solve 10 problems

Hundred Club
Solve 100 problems

Binary Search Master
Complete Binary Search roadmap

Graph Explorer
Complete Graph Fundamentals

DP Survivor
Solve 25 DP problems

7 Day Streak
Study 7 days in a row
```

---

# 31. Streak System

Masalan:

```text
🔥 12 Day Streak
```

User har kuni:

- lesson o‘qisa
- quiz ishlasa
- masala yechsa

streak davom etadi.

---

# 32. Roadmap Completion Condition

Topic tugashi uchun faqat lesson o‘qish yetarli bo‘lmasligi mumkin.

Masalan:

```text
Binary Search Completion

✓ Lessons completed
✓ Quiz score >= 70%
✓ Solve 5 Easy problems
✓ Solve 3 Medium problems
✓ Solve Final Challenge
```

Shunda topic:

```text
✅ Completed
```

bo‘ladi.

---

# 33. Prerequisite Graph

Har bir topicning prerequisite'lari bo‘ladi.

Masalan:

```text
Segment Tree
```

uchun:

```text
Prerequisites:

✓ Arrays
✓ Recursion
✓ Prefix Sum
```

yoki:

```text
Dijkstra

Prerequisites:
✓ Graph Basics
✓ BFS
✓ Priority Queue
```

---

# 34. Topic Dependency Example

```text
Arrays
  ↓
Prefix Sum
  ↓
Fenwick Tree
  ↓
Segment Tree
  ↓
Lazy Propagation
  ↓
Persistent Segment Tree
```

Yoki:

```text
Graph Basics
  ↓
DFS
  ↓
Trees
  ↓
Binary Lifting
  ↓
LCA
  ↓
Heavy-Light Decomposition
```

Bu roadmapni haqiqiy skill treega aylantiradi.

---

# 35. Search System

User topic qidirishi mumkin.

Masalan:

```text
Search topics...
```

User:

```text
segment tree
```

deb qidirsa:

```text
Segment Tree

Difficulty:
Advanced

Rating:
1500–2100

Prerequisites:
Arrays
Prefix Sum
Recursion

Status:
Locked
```

ko‘rsatiladi.

---

# 36. Filter System

Roadmapni filter qilish mumkin.

Filterlar:

```text
Difficulty

Beginner
Intermediate
Advanced
Expert
```

```text
Rating

800–1000
1000–1200
1200–1500
1500–1900
1900+
```

```text
Status

Completed
In Progress
Available
Locked
```

```text
Category

Algorithms
Math
Data Structures
Graphs
DP
Strings
Geometry
```

---

# 37. Roadmap Card Design

Har bir roadmap card:

```text
Graph Theory

Progress:
██████░░░░ 60%

Rating:
1000–2500+

Topics:
24

Completed:
14 / 24

[Continue]
```

---

# 38. Roadmap Home Page

Asosiy roadmap page:

```text
Roadmaps
```

ostida kartalar:

```text
Programming Fundamentals

CP Fundamentals

Mathematics

Data Structures

Greedy Algorithms

Graph Theory

Dynamic Programming

Strings

Geometry

Advanced Competitive Programming
```

---

# 39. MVP uchun roadmaplar

Birinchi versiyada hammasini qilish shart emas.

MVP uchun men quyidagi roadmaplardan boshlardim:

```text
1. Programming Basics
2. Competitive Programming Fundamentals
3. Mathematics
4. Data Structures
5. Greedy Algorithms
6. Graph Theory
7. Dynamic Programming
8. Strings
```

Keyinchalik:

```text
9. Geometry
10. Advanced CP
11. ICPC Topics
```

qo‘shilishi mumkin.

---

# 40. Eng muhim product idea

Saytning asosiy qiymati:

```text
Content
+
Roadmap
+
Practice
+
Progress
+
Recommendation
```

kombinatsiyasida bo‘lishi kerak.

Ya'ni sayt shunchaki:

```text
Competitive Programming course
```

emas.

Balki:

```text
Competitive Programming Learning Platform
```

bo‘lishi kerak.

---

# 41. Sayt nimasi bilan boshqalardan farq qilishi mumkin?

Asosiy unique features:

## 1. Dependency-based roadmap

User tayyor bo‘lmagan mavzuni o‘rganmaydi.

## 2. Codeforces Rating integration

Topiclar real CP difficulty bilan bog‘lanadi.

## 3. Curated Problems

Har bir mavzu uchun maxsus problem list.

## 4. Progress Tracking

User qayergacha kelganini ko‘radi.

## 5. Personalized Recommendations

Sayt keyingi mavzuni tavsiya qiladi.

## 6. Unlock System

Roadmap game progression kabi ishlaydi.

## 7. Skill Map

User o‘zining qaysi skilllari kuchli yoki kuchsizligini ko‘radi.

---

# 42. Skill Strength System

Masalan:

```text
Math              ████████░░ 80%
Greedy            ██████░░░░ 60%
Graphs            █████░░░░░ 50%
DP                ███░░░░░░░ 30%
Data Structures   ███████░░░ 70%
Strings           ██░░░░░░░░ 20%
```

Shunda user:

```text
DP juda kuchsiz ekan
```

deb ko‘radi.

---

# 43. Weak Topic Detection

Agar user bir mavzudagi masalalarda ko‘p xato qilsa:

```text
Weak Topic Detected

Binary Search on Answer
Success Rate: 32%
```

Sayt:

```text
Recommended:
Review Binary Search
Solve 5 easier problems
```

deb tavsiya qiladi.

---

# 44. Problem Recommendation Engine

Userning ratingiga qarab:

```text
Your current level:
1250
```

Masalalar:

```text
1100
1200
1200
1300
1300
1400
```

range ichidan tavsiya qilinadi.

Masalan:

```text
Recommended Difficulty:
Current Rating - 100
to
Current Rating + 200
```

---

# 45. Learning Loop

Saytning asosiy learning loopi:

```text
Learn
 ↓
Understand
 ↓
Quiz
 ↓
Practice
 ↓
Fail
 ↓
Review
 ↓
Practice Again
 ↓
Master
 ↓
Unlock Next Topic
```

Bu productning markaziy concepti bo‘lishi mumkin.

---

# 46. Topic Mastery

Har bir topic uchun mastery score bo‘lishi mumkin.

Masalan:

```text
Binary Search

Knowledge: 90%
Quiz: 80%
Practice: 65%
Challenge: 100%

Mastery:
82%
```

---

# 47. Topic Levels

Bir mavzu ham darajalarga bo‘linishi mumkin.

Misol:

```text
Binary Search

Level 1
Basic Binary Search

Level 2
lower_bound / upper_bound

Level 3
Binary Search on Answer

Level 4
Advanced Binary Search Problems
```

---

# 48. Roadmap visual design

Roadmap node'lari rang orqali status ko‘rsatishi mumkin.

```text
Green
Completed

Blue
Current

Gray
Locked

Purple
Advanced

Gold
Mastered
```

Node ichida:

```text
Binary Search
900–1200
6 / 8
```

ko‘rsatilishi mumkin.

---

# 49. Roadmap Node Example

```text
┌───────────────────────┐
│ 🔍 Binary Search      │
│                       │
│ Rating: 900–1200      │
│ Progress: 75%         │
│                       │
│ ███████░░░            │
│                       │
│ Status: In Progress   │
└───────────────────────┘
```

---

# 50. Roadmap Section Example

```text
Algorithms
```

ichida:

```text
Sorting
   ↓
Binary Search
   ↓
Two Pointers
   ↓
Sliding Window
   ↓
Divide & Conquer
```

---

# 51. User Profile

Profileda:

```text
Username
Country
University
Codeforces Handle
AtCoder Handle
Current Rating
Highest Rating
Problems Solved
Roadmap Progress
Achievements
Streak
```

ko‘rsatilishi mumkin.

---

# 52. Codeforces Integration

Agar user Codeforces accountini ulasa:

```text
Codeforces Handle:
tourist123
```

sayt:

- Rating
- Max Rating
- Solved problems
- Problem tags
- Contest history

kabi ma'lumotlarni olib ishlatishi mumkin.

Keyin:

```text
You solved many:
implementation
math

You struggle with:
dp
graphs
```

kabi analytics chiqarilishi mumkin.

---

# 53. Analytics Dashboard

Misol:

```text
Problems Solved
286

This Week
21

Average Rating
1240

Success Rate
68%

Strongest Topic
Math

Weakest Topic
DP
```

---

# 54. Weekly Report

Sayt userga haftalik summary ko‘rsatishi mumkin.

```text
This Week

Problems solved: 24
Lessons completed: 7
Topics completed: 2
XP earned: 850
Rating improvement: +74
```

---

# 55. Roadmapning asosiy filozofiyasi

Roadmap:

```text
What should I learn?
```

savoliga javob beradi.

Practice system:

```text
How do I master it?
```

savoliga javob beradi.

Progress system:

```text
How far have I come?
```

savoliga javob beradi.

Recommendation engine:

```text
What should I do next?
```

savoliga javob beradi.

---

# 56. Yakuniy asosiy structure

Saytning umumiy tuzilishi:

```text
Home

Roadmaps
├── Programming Basics
├── CP Fundamentals
├── Mathematics
├── Data Structures
├── Greedy
├── Graph Theory
├── Dynamic Programming
├── Strings
├── Geometry
└── Advanced CP

Problems

Practice

Contests

Progress

Achievements

Profile
```

---

# 57. Roadmap ichidagi structure

```text
Roadmap

Overview
│
├── Topics
│
├── Progress
│
├── Skill Tree
│
├── Problems
│
└── Recommendations
```

Topic:

```text
Topic

Overview
│
├── Learn
├── Examples
├── Quiz
├── Practice
├── Challenge
└── Completion
```

---

# 58. Eng yaxshi user journey

Yangi user kiradi.

```text
Sign Up
 ↓
Choose Experience
 ↓
Connect Codeforces
 ↓
Take Placement Test
 ↓
Receive Starting Level
 ↓
Start Recommended Roadmap
 ↓
Learn Topic
 ↓
Take Quiz
 ↓
Solve Problems
 ↓
Complete Topic
 ↓
Unlock Next Topic
 ↓
Increase Skill Rating
```

---

# 59. Placement Test

Yangi userga:

```text
15–30 problems
```

beriladi.

Natijaga qarab:

```text
Beginner
Intermediate
Advanced
```

darajasi aniqlanadi.

Masalan:

```text
Your estimated level:
1100

Start from:
Binary Search
```

---

# 60. Eng asosiy product vision

Ideal holatda user saytga kirib:

```text
Men nima o‘rganishim kerak?
```

deb o‘ylamasligi kerak.

Sayt unga:

```text
Today:

1. Finish Binary Search lesson
2. Solve these 3 problems
3. Take Binary Search quiz
4. Unlock Two Pointers
```

deb tayyor yo‘l ko‘rsatishi kerak.

Shunda saytning vazifasi:

```text
Learn Competitive Programming step by step
```

emas.

Balki:

```text
Guide every user from beginner to competitive programmer.
```

bo‘ladi.

---

# 61. Eng muhim MVP featurelar

Agar birinchi versiyani qilayotgan bo‘lsak, quyidagilar yetadi:

1. Roadmaps
2. Topics
3. Prerequisites
4. Locked / Unlocked system
5. Lessons
6. Practice Problems
7. Topic Progress
8. Overall Progress
9. Codeforces-style rating ranges
10. Recommended Next Topic

Keyingi versiyada:

- XP
- Achievements
- Streak
- Placement Test
- Codeforces integration
- Personalized recommendation
- Skill analytics

qo‘shiladi.

---

# Final Concept

Eng yaxshi variantda sayt:

```text
Roadmap
+
Course
+
Problem Set
+
Progress Tracker
+
Skill Tree
+
Recommendation Engine
```

kombinatsiyasi bo‘ladi.

Competitive Programming o‘rganayotgan odam uchun sayt doim uchta narsani aniq aytib turishi kerak:

```text
Where am I?
What should I learn?
What should I do next?
```

Agar product shu uchta savolga yaxshi javob bersa, roadmap juda kuchli chiqadi.