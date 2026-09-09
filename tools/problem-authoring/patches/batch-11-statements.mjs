/* Statement rewrite, batch 11 — fifteen more. Rules in batch 01's header.
 *
 * A23 also loses a sentence telling the reader to use the closed form, and B47
 * one telling them not to iterate. Both were method, not task — the same thing
 * the legend used to do, one paragraph lower down.
 *
 * Applied with: node restate.mjs patches/batch-11-statements.mjs
 */
export default [
  {
    id: "B142",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan; har bir qirra musbat w vaznini tashiydi. Barcha m ta qirra vaznlarining yig‘indisini hisoblang va uni chiqaring. Har bir qirra aynan bir marta sanaladi, hatto ikkita qirra bir xil uchlar juftligini bog‘lasa ham: takroriy qirralar alohida-alohida hisobga olinadi. Graf bog‘lamli bo‘lishi shart emas. Yig‘indi 2·10^14 ga yetadi va 32-bitli turga sig‘maydi.",
    statementEn: "You are given a graph with n vertices and m undirected edges, each carrying a positive weight w. Compute the sum of the weights of all m edges and print it. Each edge is counted exactly once, even when two edges join the same pair of vertices: repeated edges are counted separately. The graph need not be connected. The total reaches 2·10^14 and does not fit in a 32-bit type.",
  },
  {
    id: "B158",
    statementUz: "Sizga n summasi berilgan. Qiymatlari 1, 2, 5, 10, 20, 50 va 100 bo‘lgan tangalar bor; har bir qiymatdan cheklovsiz, ya'ni istalgancha ko‘p foydalanish mumkin. Shu tangalar bilan aynan n summasini yig‘ish kerak — ortiq ham, kam ham emas. Buning uchun kerak bo‘ladigan tangalarning eng kam sonini toping va uni chiqaring. Har qanday summani yig‘ish mumkin, chunki qiymati 1 bo‘lgan tanga mavjud; n = 0 bo‘lganda esa birorta tanga kerak emas va javob 0.",
    statementEn: "You are given an amount n. There are coins of value 1, 2, 5, 10, 20, 50 and 100, and each value is available without limit, that is any number of times. The amount n must be made exactly with those coins — no more and no less. Find the fewest coins that takes and print the number. Every amount can be made, since a coin of value 1 exists; and for n = 0 no coin is needed at all, so the answer is 0.",
  },
  {
    id: "C247",
    statementUz: "Satrning i-o'rindan boshlangan suffiksi deb shu o'rindan satr oxirigacha bo'lgan qismiga aytiladi. Sizga kichik lotin harflaridan iborat s satri berilgan. Har bir i uchun (1 dan |s| gacha) z_i qiymatini s ning o'zi bilan uning i-o'rindan boshlangan suffiksining eng uzun umumiy prefiksi uzunligi deb aniqlaymiz; xususan z_1 = |s|, chunki suffiks bu holda butun satrning o'zi. Barcha z_1, z_2, …, z_{|s|} qiymatlarning yig'indisini hisoblang va uni chiqaring. Yig'indi 5·10^11 ga yetadi.",
    statementEn: "The suffix of a string starting at position i is the piece running from that position to the end. You are given a string s of lowercase Latin letters. For each i from 1 to |s|, let z_i be the length of the longest common prefix of s itself and the suffix of s starting at position i; in particular z_1 = |s|, since that suffix is the whole string. Compute the sum of all the values z_1, z_2, …, z_{|s|} and print it. The sum reaches 5·10^11.",
  },
  {
    id: "B29",
    statementUz: "Sizga r ta satr va c ta ustundan iborat a matritsasi berilgan. Uning transponirlangani deb c ta satr va r ta ustunli shunday matritsaga aytiladi-ki, uning i-satri va j-ustunidagi element a ning j-satri va i-ustunidagi elementga teng bo‘lsin — ya'ni satrlar bilan ustunlar o‘rin almashadi. Shu matritsani chiqaring: har birida r ta son bo‘lgan c ta qator. Matritsa kvadrat bo‘lishi shart emas, shuning uchun natijaning o‘lchamlari kirishnikidan farq qilishi mumkin.",
    statementEn: "You are given a matrix a with r rows and c columns. Its transpose is the matrix with c rows and r columns whose element at row i and column j equals the element of a at row j and column i — that is, rows and columns swap places. Print that matrix: c lines of r numbers each. The matrix need not be square, so the dimensions of the result may differ from those of the input.",
  },
  {
    id: "A131",
    statementUz: "Ikkita ichma-ich tsikl qaraladi: tashqi tsikl 1 dan n gacha bo‘lgan qiymatlar bo‘ylab yuradi va uning har bir iteratsiyasida ichki tsikl ham 1 dan n gacha to‘liq aylanib chiqadi, ichki tsiklning har bir iteratsiyasida esa tana bir marta bajariladi. n berilganda, tana jami necha marta bajarilishini hisoblang va shu sonni chiqaring. n 10^9 gacha bo‘lgani uchun javob 10^18 ga yetadi va u 32-bitli turga sig‘maydi.",
    statementEn: "Two nested loops are considered: the outer loop runs over the values from 1 to n, and on each of its iterations the inner loop runs the full range from 1 to n as well, with the body executing once per inner iteration. Given n, compute how many times the body executes in total and print that number. Since n goes up to 10^9, the answer reaches 10^18 and does not fit in a 32-bit type.",
  },
  {
    id: "C218",
    statementUz: "n ta ishchi va n ta vazifa bor, va i-ishchining j-vazifani bajarish narxi c[i][j] matritsasi bilan berilgan. Taqsimot deb har bir ishchiga aynan bitta vazifa, har bir vazifaga esa aynan bitta ishchi to'g'ri keladigan moslikka aytiladi; taqsimotning umumiy narxi — tanlangan n ta narxning yig'indisi. Barcha mumkin bo'lgan taqsimotlar orasidan umumiy narxi eng kichigini toping va shu eng kichik narxni chiqaring. n = 1 bo'lganda yagona taqsimot bor va javob c[1][1] ga teng.",
    statementEn: "There are n workers and n jobs, and the cost of worker i doing job j is given by the matrix c[i][j]. An assignment is a matching in which every worker gets exactly one job and every job exactly one worker; its total cost is the sum of the n chosen costs. Among all possible assignments find the one of smallest total cost and print that smallest cost. When n = 1 there is only one assignment and the answer is c[1][1].",
  },
  {
    id: "B34",
    statementUz: "Zinapoyada n ta pog‘ona bor va siz yerdan, ya'ni 0-pog‘onadan boshlaysiz. Har bir harakatda bir yoki ikki pog‘ona yuqoriga ko‘tarilish mumkin. Aynan n-pog‘onaga yetib borishning har xil usullari sonini toping va uni 10^9 + 7 modul bo‘yicha chiqaring. Ikki usul harakatlar ketma-ketligi bilan farqlanadi: masalan, 1+1 va 2 har xil usullar hisoblanadi. Yig‘indi tez o‘sgani uchun javob qoldiq shaklida so‘raladi.",
    statementEn: "A staircase has n steps and you start on the ground, that is at step 0. Each move goes up either one step or two. Count the distinct ways to reach step n exactly and print the count modulo 10^9 + 7. Two ways differ by their sequence of moves: 1+1 and 2, for instance, are different ways. The count grows quickly, which is why the answer is asked for as a remainder.",
  },
  {
    id: "B47",
    statementUz: "Ikki sonning bitli istisno yig‘indisi (XOR) shunday hisoblanadi: sonlar ikkilik yozuvda yoziladi va har bir bit o‘rnida natija biti faqat bittasida 1 turgan bo‘lsa 1 ga teng bo‘ladi. Sizga n butun soni berilgan; 1 dan n gacha bo‘lgan barcha butun sonlarning shu amal bo‘yicha yig‘indisini — 1 XOR 2 XOR … XOR n qiymatini — hisoblang va uni chiqaring; n ning o‘zi ham oraliqqa kiradi. n 10^18 gacha bo‘lgani uchun qiymatlar 64-bitli turda saqlanadi.",
    statementEn: "The bitwise exclusive-or (XOR) of two numbers is computed like this: both are written in binary, and at each bit position the result has a 1 exactly when just one of them has a 1 there. You are given an integer n; compute the value of that operation applied across all the integers from 1 to n — the value 1 XOR 2 XOR … XOR n — and print it, with n itself included in the range. Since n goes up to 10^18, the values are held in a 64-bit type.",
  },
  {
    id: "B59",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilmagan qirradan iborat graf berilgan. Ikki uch orasidagi masofa deb ularni tutashtiruvchi yo‘llardagi qirralarning eng kichik soniga aytiladi; bu yerda qirralarning vazni yo‘q, ya'ni har bir qirra bitta qadam hisoblanadi. Har bir uch uchun 1-uchdan unga bo‘lgan masofani hisoblang va bu n ta qiymatni 1, 2, …, n tartibida bitta qatorda chiqaring. 1-uchning o‘ziga masofa 0. Graf bog‘lamli bo‘lishi shart emas: yetib bo‘lmaydigan uch uchun −1 chiqariladi.",
    statementEn: "You are given a graph with n vertices and m undirected edges. The distance between two vertices is the smallest number of edges on a path joining them; the edges carry no weight here, so each one counts as a single step. For every vertex compute the distance from vertex 1 to it, and print those n values on one line in the order 1, 2, …, n. The distance from vertex 1 to itself is 0. The graph need not be connected: for a vertex that cannot be reached, −1 is printed.",
  },
  {
    id: "B83",
    statementUz: "Sizga n ta butun sondan iborat a massivi berilgan; u ixtiyoriy tartibda keladi. Massivning medianasi deb uni o‘sish tartibida saralaganda o‘rtada turadigan qiymatga aytiladi. n toq bo‘lganda bunday element aynan bitta bo‘ladi. n juft bo‘lganda esa o‘rtada ikkita element turadi va bu masalada ulardan kichigi — ya'ni saralangan massivning n/2-o‘rnidagi qiymat — javob hisoblanadi. Shu qiymatni toping va uni chiqaring.",
    statementEn: "You are given an array a of n integers, arriving in arbitrary order. The median of the array is the value standing in the middle once it is sorted in increasing order. When n is odd there is exactly one such element. When n is even there are two middle elements, and in this problem the smaller of them — the value at position n/2 of the sorted array — is the answer. Find that value and print it.",
  },
  {
    id: "C91",
    statementUz: "Sizga n ta oraliq va qoplanishi kerak bo‘lgan [0, T] kesmasi berilgan. Oraliqlar to‘plami [0, T] ni qoplaydi deyiladi, agar kesmaning har bir nuqtasi tanlangan oraliqlardan kamida bittasiga tegishli bo‘lsa. Shunday to‘plamlar orasidan eng kichigini qarab, undagi oraliqlar sonini chiqaring. Oraliqlar ixtiyoriy tartibda beriladi, bir-birining ustiga tushishi mumkin, va tanlanganlari kirishda yonma-yon turishi shart emas. Hech qanday tanlov kesmani to‘liq qoplamasa, −1 chiqaring.",
    statementEn: "You are given n intervals and the segment [0, T] that must be covered. A set of intervals covers [0, T] when every point of the segment belongs to at least one of the chosen intervals. Among such sets consider the smallest and print how many intervals it holds. The intervals are given in arbitrary order, may overlap, and the chosen ones need not be adjacent in the input. If no choice of intervals covers the segment completely, print −1.",
  },
  {
    id: "B170",
    statementUz: "Sizga raqamlar satri shaklida yozilgan son va k soni berilgan. Shu satrdan aynan k ta raqamni o‘chiring; qolgan raqamlar o‘z nisbiy tartibini saqlaydi — ular qayta joylashtirilmaydi — va shu tariqa yangi son hosil bo‘ladi. Shunday o‘chirishni tanlangki, hosil bo‘lgan son eng kichik bo‘lsin, va uni boshidagi nollarsiz chiqaring. Barcha raqamlar o‘chirilsa yoki natija bo‘sh qolsa, 0 chiqariladi.",
    statementEn: "You are given a number written as a string of digits and a count k. Remove exactly k digits from that string; the remaining digits keep their relative order — they are not rearranged — and so form a new number. Choose the removal that makes the resulting number as small as possible, and print it without leading zeros. If every digit is removed, or the result would be empty, 0 is printed.",
  },
  {
    id: "C280",
    statementUz: "Satrning qism ketma-ketligi deb undan ba'zi harflarni (balki birortasini ham emas) o'chirib, qolganlarining tartibini o'zgartirmasdan hosil qilinadigan satrga aytiladi; harflar yonma-yon turishi shart emas. Sizga kichik lotin harflaridan iborat s va t satrlari berilgan. s satri t ning qism ketma-ketligi ekanini aniqlang va agar shunday bo'lsa YES, aks holda NO chiqaring. |s| > |t| bo'lgan holda javob har doim NO bo'ladi, chunki o'chirish satrni faqat qisqartiradi.",
    statementEn: "A subsequence of a string is what remains after deleting some of its letters (possibly none) while keeping the rest in order; the letters need not be adjacent. You are given strings s and t of lowercase Latin letters. Determine whether s is a subsequence of t, and print YES if it is and NO if it is not. When |s| > |t| the answer is always NO, since deleting only makes a string shorter.",
  },
  {
    id: "C92",
    statementUz: "Satrning qism ketma-ketligi deb undan ba'zi belgilarni o‘chirib, qolganlarining tartibini saqlagan holda hosil qilinadigan satrga aytiladi; belgilar yonma-yon turishi shart emas. Sizga kichik lotin harflaridan iborat ikkita a va b satri berilgan. Ikkalasining ham qism ketma-ketligi bo‘lgan satrlar orasidan eng uzunini qarab, uning uzunligini chiqaring — kerak bo‘lgan javob satrning o‘zi emas, uzunligi. Satrlarda umumiy belgi bo‘lmasa, javob 0 bo‘ladi.",
    statementEn: "A subsequence of a string is what remains after deleting some of its characters while keeping the rest in order; the characters need not be adjacent. You are given two strings a and b of lowercase Latin letters. Among the strings that are a subsequence of both, consider the longest and print its length — the answer required is the length, not the string itself. If the two share no character, the answer is 0.",
  },
  {
    id: "A23",
    statementUz: "Sizga n butun soni berilgan. Birinchi n ta natural sonning kvadratlari yig‘indisini, ya'ni 1² + 2² + … + n² qiymatini 10^9 + 7 modul bo‘yicha hisoblang va uni chiqaring. n = 1 bo‘lganda yig‘indi bitta haddan iborat va javob 1 ga teng. n 10^18 gacha bo‘lgani uchun yig‘indining o‘zi juda katta bo‘ladi va javob aynan shu modul bo‘yicha so‘raladi; modul tub son.",
    statementEn: "You are given an integer n. Compute the sum of the squares of the first n positive integers, that is the value 1² + 2² + … + n², modulo 10^9 + 7, and print it. For n = 1 the sum has a single term and the answer is 1. Since n goes up to 10^18 the sum itself is enormous, which is why the answer is asked for modulo that number; the modulus is prime.",
  },
];
