/* Statement rewrite, batch 17 — fourteen more. Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-17-statements.mjs
 */
export default [
  {
    id: "B72",
    statementUz: "Massivdagi inversiya deb i < j va a_i > a_j shartlarini bir vaqtda qanoatlantiruvchi (i, j) pozitsiyalar juftligiga aytiladi — ya'ni oldinroq turgan element keyingisidan katta bo‘lgan holat. Sizga n ta butun sondan iborat a massivi berilgan; undagi inversiyalar sonini sanang va uni chiqaring. Solishtirish qat'iy: teng qiymatlar inversiya hosil qilmaydi. Massiv allaqachon kamaymaydigan tartibda bo‘lsa, javob 0 bo‘ladi.",
    statementEn: "An inversion in an array is a pair of positions (i, j) satisfying i < j and a_i > a_j at once — a case where an earlier element is larger than a later one. You are given an array a of n integers; count the inversions in it and print the number. The comparison is strict: equal values do not form an inversion. If the array is already in non-decreasing order, the answer is 0.",
  },
  {
    id: "B73",
    statementUz: "Sizga r ta satr va c ta ustundan iborat, manfiy bo‘lmagan sonlar jadvali berilgan. Chap yuqori katakdan o‘ng pastki katakka boradigan yo‘llarni qaraymiz: har qadamda faqat bir katak pastga yoki bir katak o‘ngga siljish mumkin. Yo‘lning narxi deb u o‘tgan barcha kataklardagi qiymatlar yig‘indisiga aytiladi; boshlanish va tugash katagi ham yig‘indiga kiradi. Eng arzon yo‘lning narxini toping va uni chiqaring. Bir katakdan iborat jadvalda javob shu katakning o‘z qiymati.",
    statementEn: "You are given a grid of r rows and c columns of non-negative numbers. We consider the paths from the top-left cell to the bottom-right cell: each step moves one cell down or one cell right. The cost of a path is the sum of the values on every cell it visits, the start and the end cell included. Find the cost of the cheapest path and print it. In a grid of a single cell the answer is that cell's own value.",
  },
  {
    id: "B75",
    statementUz: "Sizga n ta butun sondan iborat a massivi va k qiymati berilgan. Uzluksiz qism massiv deb ketma-ket turgan elementlar bo‘lagiga aytiladi. Elementlari yig‘indisi aynan k ga teng bo‘lgan shunday qism massivlarni sanang va ularning sonini chiqaring. Qism massivlar chetlari bilan aniqlanadi: bir xil qiymatlarni saqlaydigan ikki har xil oraliq alohida sanaladi. Elementlar manfiy bo‘lishi mumkin, ya'ni yig‘indi massiv bo‘ylab o‘smasligi ham mumkin. Mos qism massiv bo‘lmasa javob 0.",
    statementEn: "You are given an array a of n integers and a value k. A contiguous subarray is a stretch of consecutive elements. Count the subarrays whose elements sum to exactly k and print how many there are. Subarrays are identified by their endpoints: two different ranges holding the same values count separately. The elements may be negative, so the running sum need not grow along the array. If no subarray matches, the answer is 0.",
  },
  {
    id: "B76",
    statementUz: "Sizga n ta uch va m ta yo‘naltirilgan qirradan iborat graf berilgan; a → b qirrasi \"a b dan oldin kelishi kerak\" degan shartni bildiradi. Uchlarni bir qatorga shunday tizish mumkinmi-ki, har bir qirra oldinga qaragan bo‘lsin, ya'ni har bir qirraning boshi oxiridan chapda turmasin — shuni aniqlang va YES yoki NO deb bosh harflarda chiqaring. Bunday tartib aynan grafda yo‘naltirilgan sikl bo‘lmagandagina mavjud: sikl har bir uchdan o‘zidan oldin kelishni talab qiladi.",
    statementEn: "You are given a graph with n vertices and m directed edges, where an edge a → b means \"a must come before b\". Determine whether the vertices can be arranged in a line so that every edge points forwards — that is, so that the tail of every edge does not stand to the right of its head — and print YES or NO in capital letters. Such an ordering exists exactly when the graph has no directed cycle: a cycle would require every vertex on it to come before itself.",
  },
  {
    id: "B78",
    statementUz: "Sizga bir qatorda turgan n ta bolaning reytinglari berilgan. Har bir bolaga butun sonda shirinlik berilishi kerak, va taqsimot ikki qoidaga bo‘ysunadi: har bir bola kamida bitta shirinlik oladi, hamda reytingi bevosita qo‘shnisining reytingidan qat'iy yuqori bo‘lgan bola o‘sha qo‘shnisidan qat'iy ko‘proq shirinlik oladi. Faqat bevosita qo‘shnilar solishtiriladi. Ikkala qoidani ham qanoatlantiradigan eng kichik umumiy shirinliklar sonini toping va uni chiqaring; javob kamida n ga teng.",
    statementEn: "You are given the ratings of n children standing in a row. Every child must be given a whole number of sweets, and the distribution obeys two rules: each child gets at least one sweet, and a child whose rating is strictly higher than an immediate neighbour's gets strictly more sweets than that neighbour. Only immediate neighbours are compared. Find the smallest total number of sweets satisfying both rules and print it; the answer is at least n.",
  },
  {
    id: "B79",
    statementUz: "Sizga n xil tanga qiymati va maqsad summa t berilgan. Har bir tanga turidan istalgancha ko‘p, jumladan umuman ishlatmasdan foydalanish mumkin. Aynan t summasini yig‘ish usullarini sanang va ularning sonini 10^9 + 7 modul bo‘yicha chiqaring. Usul har bir tanga turi necha marta ishlatilgani bilan aniqlanadi, tangalarning tartibi ahamiyatsiz: 1+2 va 2+1 bitta usul hisoblanadi. t = 0 bo‘lganda bo‘sh usul bor va javob 1; summani yig‘ish imkonsiz bo‘lsa javob 0.",
    statementEn: "You are given n coin denominations and a target amount t. Each denomination may be used any number of times, including not at all. Count the ways to make exactly t and print the count modulo 10^9 + 7. A way is determined by how many times each denomination is used, and the order of the coins does not matter: 1+2 and 2+1 are one way. For t = 0 the empty way exists and the answer is 1; if the amount cannot be made the answer is 0.",
  },
  {
    id: "B81",
    statementUz: "Sizga n ta buyum berilgan; i-buyumning og‘irligi w_i va qiymati v_i. Sumkaning sig‘imi W, ya'ni tanlangan buyumlarning umumiy og‘irligi W dan oshmasligi kerak. Har bir buyumni ko‘pi bilan bir marta olish mumkin — bo‘lib olish yoki ikkinchi nusxasini olish mumkin emas. Shu shart bilan umumiy qiymati eng katta bo‘lgan to‘plamni qarab, o‘sha umumiy qiymatni chiqaring. Birorta buyum sig‘maganda hech narsa olinmaydi va javob 0 bo‘ladi.",
    statementEn: "You are given n items, the i-th having weight w_i and value v_i. The knapsack has capacity W, so the total weight of the chosen items must not exceed W. Each item may be taken at most once — it cannot be split, and there is no second copy of it. Under that condition consider the subset of largest total value and print that total. When not even one item fits, nothing is taken and the answer is 0.",
  },
  {
    id: "B82",
    statementUz: "Massivning qism ketma-ketligi deb undan ba'zi elementlarni tanlab, ularning nisbiy tartibini saqlash yo‘li bilan hosil qilinadigan ketma-ketlikka aytiladi; tanlangan elementlar yonma-yon bo‘lishi shart emas. Sizga n ta butun sondan iborat a massivi berilgan; eng uzun qat'iy o‘suvchi qism ketma-ketlikning uzunligini toping va uni chiqaring, ya'ni a_{i_1} < a_{i_2} < … < a_{i_L} shartli i_1 < i_2 < … < i_L pozitsiyalar orasidan eng katta L ni. O‘sish qat'iy bo‘lgani uchun teng qiymatlarning ikkalasini birga olib bo‘lmaydi; javob kamida 1 ga teng.",
    statementEn: "A subsequence of an array is what you get by choosing some of its elements and keeping their relative order; the chosen elements need not be adjacent. You are given an array a of n integers; find the length of the longest strictly increasing subsequence and print it — that is, the largest L over the position sets i_1 < i_2 < … < i_L with a_{i_1} < a_{i_2} < … < a_{i_L}. Because the increase is strict, two equal values cannot both be taken; the answer is at least 1.",
  },
  {
    id: "B84",
    statementUz: "Sizga n ta manfiy bo‘lmagan butun sondan iborat a massivi berilgan; a_i — i-pozitsiyadan oldinga sakrash mumkin bo‘lgan eng uzoq masofa, ya'ni shu pozitsiyadan i+1 dan i+a_i gacha bo‘lgan istalgan pozitsiyaga sakrash mumkin. 1-pozitsiyadan boshlab n-pozitsiyaga yetib borish uchun kerak bo‘ladigan eng kam sakrashlar sonini toping va uni chiqaring. 0 saqlaydigan katak umuman sakrashga imkon bermaydi, shuning uchun manzilga yetib bo‘lmasligi mumkin — bunday holda −1 chiqariladi. n = 1 bo‘lganda javob 0.",
    statementEn: "You are given an array a of n non-negative integers, where a_i is the furthest distance you may jump forward from position i — that is, from that position you may jump to any position from i+1 to i+a_i. Find the fewest jumps needed to get from position 1 to position n and print it. A cell holding 0 allows no jump at all, so the destination may be unreachable — in that case −1 is printed. When n = 1 the answer is 0.",
  },
  {
    id: "B87",
    statementUz: "Sizga 1 dan n gacha bo‘lgan pozitsiyalarda turgan n ta vertikal devor berilgan; i-chisining balandligi h_i. Ikki devor tanlanganda, ular orasida tutib qolinadigan suv miqdori min(h_i, h_j) · (j − i) ga teng bo‘ladi: balandlik pastroq devor bilan cheklanadi, kenglik esa pozitsiyalar farqi. Shunday juftliklar orasidan eng katta miqdorni beradiganini qarab, o‘sha miqdorni chiqaring. Balandlik 0 bo‘lishi mumkin, va javob 10^14 ga yetadi.",
    statementEn: "You are given n vertical walls standing at positions 1 through n, the i-th of height h_i. When two walls are chosen, the water held between them is min(h_i, h_j) · (j − i): the height is limited by the shorter wall, and the width is the difference of the positions. Among such pairs consider the one giving the largest amount and print that amount. A height may be 0, and the answer reaches 10^14.",
  },
  {
    id: "C88",
    statementUz: "Sizga n ta musbat butun sondan iborat a massivi va k soni berilgan. Massivni aynan k ta bo‘sh bo‘lmagan ketma-ket bo‘lakka bo‘lish kerak: elementlarning tartibi o‘zgarmaydi va har bir element aynan bitta bo‘lakka tushadi. Har bir bo‘linish uchun bo‘laklar yig‘indilarining eng kattasini qaraymiz; shu eng katta yig‘indi imkon qadar kichik bo‘ladigan bo‘linishni tanlang va o‘sha qiymatni chiqaring. k = n bo‘lganda har bir bo‘lak bitta elementdan iborat, k = 1 bo‘lganda esa javob butun massivning yig‘indisi.",
    statementEn: "You are given an array a of n positive integers and a number k. The array must be split into exactly k non-empty consecutive parts: the order of the elements does not change and every element falls into exactly one part. For a given split, look at the largest of the part sums; choose the split that makes that largest sum as small as possible and print that value. When k = n every part is one element, and when k = 1 the answer is the sum of the whole array.",
  },
  {
    id: "C90",
    statementUz: "Satrning qism satri deb undagi belgilarning uzluksiz blokiga aytiladi, ya'ni biror i dan j gacha bo‘lgan bo‘lakka. Sizga kichik lotin harflaridan iborat s satri berilgan; uning bo‘sh bo‘lmagan har xil qism satrlarini sanang va ularning sonini chiqaring. Sanoq satr sifatida yuritiladi, pozitsiya sifatida emas: bir xil o‘qiladigan qism satr necha joyda uchrashidan qat'i nazar bir marta sanaladi — masalan, \"aba\" da beshta har xil qism satr bor: \"a\", \"b\", \"ab\", \"ba\", \"aba\".",
    statementEn: "A substring of a string is a contiguous block of its characters, that is a stretch from some i to some j. You are given a string s of lowercase Latin letters; count its distinct non-empty substrings and print how many there are. The counting is by string rather than by position: a substring that reads the same is counted once however many places it occurs in — \"aba\", for instance, has five distinct substrings: \"a\", \"b\", \"ab\", \"ba\", \"aba\".",
  },
  {
    id: "C93",
    statementUz: "Sizga n ta musbat butun sondan iborat a massivi berilgan. Uning elementlarini ikki guruhga bo‘lish kerak: har bir element aynan bitta guruhga tushadi, va ikki guruhdagi qiymatlar yig‘indisi teng bo‘lishi shart. Shunday bo‘linish mavjudligini aniqlang va YES yoki NO deb bosh harflarda chiqaring. Elementlarning umumiy yig‘indisi toq bo‘lsa, uni teng ikkiga bo‘lish mumkin emas. Barcha elementlar musbat bo‘lgani uchun ikki guruhning ikkalasi ham bo‘sh bo‘lmasligi kelib chiqadi.",
    statementEn: "You are given an array a of n positive integers. Its elements must be split into two groups: every element falls into exactly one group, and the sums of the values in the two groups must be equal. Determine whether such a split exists and print YES or NO in capital letters. If the total of the elements is odd it cannot be halved. Since every element is positive, it follows that neither of the two groups can be empty.",
  },
  {
    id: "C94",
    statementUz: "Massivning qism to‘plami deb uning elementlaridan ba'zilarini (balki birortasini ham emas, balki hammasini) tanlash yo‘li bilan hosil qilinadigan to‘plamga aytiladi; har bir element ko‘pi bilan bir marta ishlatiladi. Sizga n ta musbat butun sondan iborat a massivi va maqsad qiymat t berilgan; elementlarning qandaydir qism to‘plami yig‘indisi aynan t ga tengmi degan savolga javob bering va YES yoki NO deb bosh harflarda chiqaring. Bo‘sh qism to‘plamning yig‘indisi 0 ga teng, ya'ni t = 0 bo‘lganda javob har doim YES.",
    statementEn: "A subset of an array is what you get by choosing some of its elements (possibly none, possibly all); each element is used at most once. You are given an array a of n positive integers and a target t; answer whether some subset of the elements sums to exactly t, and print YES or NO in capital letters. The empty subset sums to 0, so for t = 0 the answer is always YES.",
  },
];
