export type ProblemDifficulty = "easy" | "medium" | "hard";
export type JudgeProblemKey = "sum-two" | "max-subarray" | "coin-change";

export type BankProblem = {
  id: string;
  uz: string;
  en: string;
  difficulty: ProblemDifficulty;
  tag: string;
  points: 100 | 200 | 300;
  topic: string;
  judge?: JudgeProblemKey;
};

export type JudgeProblem = {
  key: JudgeProblemKey;
  code: string;
  difficulty: ProblemDifficulty;
  points: 100 | 200 | 300;
  uz: string;
  en: string;
  statementUz: string;
  statementEn: string;
  inputUz: string;
  inputEn: string;
  outputUz: string;
  outputEn: string;
  sample: string;
  cpp: string;
  python: string;
};

export const problems: BankProblem[] = [
  { id: "A01", uz: "Ikki son yig‘indisi", en: "Sum of two numbers", difficulty: "easy", tag: "Boshlang‘ich", points: 100, topic: "programming-basics", judge: "sum-two" },
  { id: "A02", uz: "Eng katta element", en: "Maximum element", difficulty: "easy", tag: "Massiv", points: 100, topic: "foundations" },
  { id: "A03", uz: "Juftlar soni", en: "Count the evens", difficulty: "easy", tag: "Massiv", points: 100, topic: "foundations" },
  { id: "B04", uz: "Eng katta qism-yig‘indi", en: "Maximum subarray sum", difficulty: "medium", tag: "Massiv", points: 200, topic: "foundations", judge: "max-subarray" },
  { id: "B01", uz: "Yashirin son", en: "Hidden number", difficulty: "medium", tag: "Binary Search", points: 200, topic: "binary-search" },
  { id: "B02", uz: "Bekatlar", en: "Bus stops", difficulty: "medium", tag: "Greedy", points: 200, topic: "greedy" },
  { id: "B03", uz: "Labirint yo‘li", en: "Maze path", difficulty: "medium", tag: "BFS", points: 200, topic: "graphs" },
  { id: "C04", uz: "Minimal tangalar", en: "Minimum coins", difficulty: "hard", tag: "DP", points: 300, topic: "dynamic-programming", judge: "coin-change" },
  { id: "C01", uz: "Qadimiy daraxt", en: "Ancient tree", difficulty: "hard", tag: "Graph", points: 300, topic: "graphs" },
  { id: "C02", uz: "Tanga strategiyasi", en: "Coin strategy", difficulty: "hard", tag: "DP", points: 300, topic: "dynamic-programming" },
  { id: "C03", uz: "Eng uzun yo‘l", en: "Longest route", difficulty: "hard", tag: "DAG", points: 300, topic: "graphs" },
];

export const judgeProblems: Record<JudgeProblemKey, JudgeProblem> = {
  "sum-two": {
    key: "sum-two",
    code: "A01",
    difficulty: "easy",
    points: 100,
    uz: "Ikki son yig‘indisi",
    en: "Sum of two numbers",
    statementUz: "Sizga ikkita butun a va b sonlari beriladi. Ularning yig‘indisini toping.",
    statementEn: "You are given two integers a and b. Print their sum.",
    inputUz: "Bitta qatorda ikkita butun son: a va b (−10⁹ ≤ a, b ≤ 10⁹).",
    inputEn: "One line contains two integers a and b (−10⁹ ≤ a, b ≤ 10⁹).",
    outputUz: "Yagona son — a + b ni chiqaring.",
    outputEn: "Print a single integer — a + b.",
    sample: "Input\n12 30\n\nOutput\n42",
    cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << \"\\n\";\n    return 0;\n}",
    python: "a, b = map(int, input().split())\nprint(a + b)",
  },
  "max-subarray": {
    key: "max-subarray",
    code: "B04",
    difficulty: "medium",
    points: 200,
    uz: "Eng katta qism-yig‘indi",
    en: "Maximum subarray sum",
    statementUz: "n ta butun sondan iborat massiv berilgan. Bo‘sh bo‘lmagan ketma-ket qism-massivning eng katta yig‘indisini toping.",
    statementEn: "Given an array of n integers, find the largest sum of a non-empty contiguous subarray.",
    inputUz: "Birinchi qatorda n (1 ≤ n ≤ 2·10⁵). Ikkinchi qatorda n ta butun son (−10⁹ ≤ aᵢ ≤ 10⁹).",
    inputEn: "The first line contains n (1 ≤ n ≤ 2·10⁵). The second line contains n integers (−10⁹ ≤ aᵢ ≤ 10⁹).",
    outputUz: "Yagona son — eng katta qism-yig‘indi.",
    outputEn: "Print a single integer — the maximum subarray sum.",
    sample: "Input\n9\n-2 1 -3 4 -1 2 1 -5 4\n\nOutput\n6",
    cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // TODO: eng katta qism-yig'indini toping\n    return 0;\n}",
    python: "n = int(input())\na = list(map(int, input().split()))\n# TODO: maximum subarray sum",
  },
  "coin-change": {
    key: "coin-change",
    code: "C04",
    difficulty: "hard",
    points: 300,
    uz: "Minimal tangalar",
    en: "Minimum coins",
    statementUz: "n xil nominaldagi tangalar va s summa berilgan. Har bir nominaldan cheksiz olish mumkin. s ni to‘plash uchun eng kam tangalar sonini toping, aks holda −1 chiqaring.",
    statementEn: "You are given n coin values and a target sum s. Each value may be used any number of times. Print the minimum number of coins that add up to s, or −1.",
    inputUz: "Birinchi qatorda n va s (1 ≤ n ≤ 100, 0 ≤ s ≤ 10⁴). Ikkinchi qatorda n ta nominal (1 ≤ cᵢ ≤ 10⁴).",
    inputEn: "The first line contains n and s (1 ≤ n ≤ 100, 0 ≤ s ≤ 10⁴). The second line contains n coin values (1 ≤ cᵢ ≤ 10⁴).",
    outputUz: "Eng kam tangalar soni yoki −1.",
    outputEn: "The minimum number of coins, or −1.",
    sample: "Input\n3 11\n1 2 5\n\nOutput\n3",
    cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n, s;\n    cin >> n >> s;\n    // TODO: dinamik dasturlash bilan yeching\n    return 0;\n}",
    python: "n, s = map(int, input().split())\ncoins = list(map(int, input().split()))\n# TODO: dynamic programming",
  },
};

export function starterFor(problem: BankProblem, language: "cpp20" | "python3") {
  if (!problem.judge) return language === "cpp20" ? "// Judge hali ulanmagan" : "# Judge is not available yet";
  const source = judgeProblems[problem.judge];
  return language === "cpp20" ? source.cpp : source.python;
}
