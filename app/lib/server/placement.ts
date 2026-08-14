export type PlacementQuestion = { id: string; topic: string; uz: string; en: string; choicesUz: string[]; choicesEn: string[] };

export const placementQuestions: PlacementQuestion[] = [
  { id: "basics-modulo", topic: "programming-basics", uz: "C++ da `int x = 5; cout << x % 2;` nima chiqaradi?", en: "In C++, what does `int x = 5; cout << x % 2;` print?", choicesUz: ["0", "1", "2", "5"], choicesEn: ["0", "1", "2", "5"] },
  { id: "complexity-pass", topic: "foundations", uz: "n elementli massivni bir marta kezishning vaqt murakkabligi?", en: "What is the time complexity of one pass over n elements?", choicesUz: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], choicesEn: ["O(1)", "O(log n)", "O(n)", "O(n log n)"] },
  { id: "sorting-merge", topic: "sorting", uz: "Qaysi saralash algoritmi eng yomon holatda O(n log n) ishlaydi?", en: "Which sorting algorithm is O(n log n) in the worst case?", choicesUz: ["Bubble sort", "Merge sort", "Selection sort", "Insertion sort"], choicesEn: ["Bubble sort", "Merge sort", "Selection sort", "Insertion sort"] },
  { id: "binary-precondition", topic: "binary-search", uz: "Oddiy binary search uchun asosiy shart qaysi?", en: "What is the main precondition for ordinary binary search?", choicesUz: ["Ma’lumot tartiblangan", "Elementlar musbat", "n juft", "Elementlar unikal"], choicesEn: ["The data is ordered", "Values are positive", "n is even", "Values are unique"] },
  { id: "window-complexity", topic: "two-pointers", uz: "Har bir ko‘rsatkich faqat oldinga yursa, sliding window odatda qanday ishlaydi?", en: "If each pointer only moves forward, what is the usual sliding-window complexity?", choicesUz: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], choicesEn: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"] },
  { id: "math-gcd", topic: "math", uz: "gcd(12, 18) nechaga teng?", en: "What is gcd(12, 18)?", choicesUz: ["2", "3", "6", "9"], choicesEn: ["2", "3", "6", "9"] },
  { id: "ds-lifo", topic: "data-structures", uz: "LIFO tamoyilida qaysi tuzilma ishlaydi?", en: "Which data structure follows LIFO?", choicesUz: ["Queue", "Stack", "Heap", "Set"], choicesEn: ["Queue", "Stack", "Heap", "Set"] },
  { id: "graphs-bfs", topic: "graphs", uz: "Oddiy BFS qaysi ma’lumot tuzilmasidan foydalanadi?", en: "Which data structure does ordinary BFS use?", choicesUz: ["Stack", "Priority queue", "Queue", "Trie"], choicesEn: ["Stack", "Priority queue", "Queue", "Trie"] },
  { id: "dp-memo", topic: "dynamic-programming", uz: "Memoizationning asosiy vazifasi nima?", en: "What is the main purpose of memoization?", choicesUz: ["Xotirani nolga tushirish", "Takroriy hisoblashni saqlab qolish", "Kodni kompilyatsiya qilish", "Rekursiyani sekinlashtirish"], choicesEn: ["Use no memory", "Cache repeated computations", "Compile code", "Slow recursion"] },
  { id: "greedy-choice", topic: "greedy", uz: "Greedy yondashuv har qadamda nima qiladi?", en: "What does a greedy approach do at each step?", choicesUz: ["Barcha variantni tekshiradi", "Mahalliy eng yaxshi tanlovni qiladi", "Tasodifiy tanlaydi", "Faqat rekursiya ishlatadi"], choicesEn: ["Checks every option", "Makes the locally best choice", "Chooses randomly", "Only uses recursion"] },
];

export const placementAnswerKey: Record<string, number> = {
  "basics-modulo": 1,
  "complexity-pass": 2,
  "sorting-merge": 1,
  "binary-precondition": 0,
  "window-complexity": 2,
  "math-gcd": 2,
  "ds-lifo": 1,
  "graphs-bfs": 2,
  "dp-memo": 1,
  "greedy-choice": 1,
};
