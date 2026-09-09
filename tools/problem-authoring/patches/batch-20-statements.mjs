/* Statement rewrite, batch 20 — fifteen more. Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-20-statements.mjs
 */
export default [
  {
    id: "B168",
    statementUz: "Bakingiz c birlik yoqilg‘i sig‘diradi va safar boshida to‘la bo‘ladi. Safar n ta ketma-ket qismdan iborat; i-qism o‘tish uchun berilgan miqdorda yoqilg‘i sarflaydi. Har qanday qismdan oldin bakni to‘liq to‘ldirish mumkin va bu bitta to‘xtash hisoblanadi; qism o‘rtasida to‘ldirib bo‘lmaydi. Safarni oxirigacha yetkazish uchun kerak bo‘ladigan eng kam to‘xtashlar sonini toping va uni chiqaring. Biror qism to‘la bakdan ham ko‘p yoqilg‘i talab qilsa, safar imkonsiz va −1 chiqariladi.",
    statementEn: "Your tank holds c units of fuel and is full at the start of the journey. The journey consists of n consecutive legs, the i-th consuming the given amount of fuel. Before any leg the tank may be refilled completely, which counts as one stop; it cannot be refilled in the middle of a leg. Find the fewest stops needed to finish the journey and print it. If some leg needs more fuel than a full tank, the journey is impossible and −1 is printed.",
  },
  {
    id: "B171",
    statementUz: "Massiv aylantirilgan deyiladi, agar u avval o‘sish tartibida saralangan, so‘ng qandaydir k pozitsiyaga siljitilgan bo‘lsa: oxiridagi k ta element boshiga o‘tadi. Sizga shunday hosil qilingan, barcha qiymatlari har xil bo‘lgan massiv berilgan. Uning eng kichik elementini toping va uni chiqaring. Nol pozitsiyaga aylantirish ham mumkin — bunday holda massiv shunchaki saralangan bo‘ladi va minimum boshida turadi.",
    statementEn: "An array is rotated when it was first sorted in increasing order and then shifted by some k positions: the last k elements move to the front. You are given such an array, all of whose values are distinct. Find its smallest element and print it. A rotation by zero positions is possible, in which case the array is simply sorted and the minimum stands at the front.",
  },
  {
    id: "C172",
    statementUz: "Sizga to‘g‘ri chiziqdagi n ta joylashuv koordinatalari va k soni berilgan; joylashuvlar ixtiyoriy tartibda keladi. Ulardan aynan k tasiga bittadan buyum qo‘yish kerak — bitta joylashuv ko‘pi bilan bitta buyum saqlaydi. Har bir tanlov uchun tanlangan joylashuvlar orasidagi barcha juftlik masofalarining eng kichigini qaraymiz; shu eng kichik masofa imkon qadar katta bo‘ladigan tanlovni tanlang va o‘sha qiymatni chiqaring. k = 2 bo‘lganda ikki chekka joylashuvni olish kifoya.",
    statementEn: "You are given the coordinates of n positions on a line and a number k; the positions arrive in arbitrary order. Exactly k of them must each hold one item — a position holds at most one item. For a given choice we look at the smallest of all the pairwise distances between the chosen positions; choose so that this smallest distance is as large as possible, and print that value. For k = 2 taking the two extreme positions is enough.",
  },
  {
    id: "B181",
    statementUz: "Sizga to‘qqizta katakdan iborat bitta sudoku satri berilgan. 0 saqlaydigan katak bo‘sh, nolga teng bo‘lmagan kataklar esa 1 dan 9 gacha bo‘lgan, o‘zaro har xil raqamlar. Bo‘sh kataklarni raqamlar bilan to‘ldirish kerak, shunda tugagan satrda 1 dan 9 gacha bo‘lgan har bir raqam aynan bir marta uchrasin. Shunday to‘ldirish usullarining sonini toping va uni chiqaring: agar b ta katak bo‘sh bo‘lsa, javob b! ga teng bo‘ladi, chunki qolgan raqamlarni bo‘sh kataklarga istalgan tartibda joylashtirish mumkin.",
    statementEn: "You are given one sudoku row of nine cells. A cell holding 0 is empty, and the non-zero cells are digits between 1 and 9, distinct from one another. The empty cells must be filled with digits so that the finished row holds every digit from 1 to 9 exactly once. Find the number of such fillings and print it: if b cells are empty the answer is b!, since the remaining digits may go into the empty cells in any order.",
  },
  {
    id: "B182",
    statementUz: "Sizga r ta satr va c ta ustundan iborat jadval berilgan; unda '.' bo‘sh katakni, '#' esa devorni bildiradi. Chap yuqori katakdan o‘ng pastki katakka boradigan yo‘llarni sanaymiz: har qadamda faqat bir katak pastga yoki bir katak o‘ngga siljish mumkin, devorga esa kirib bo‘lmaydi. Shunday yo‘llarning sonini chiqaring — bu masalada jadval kichik, shuning uchun javob to‘liq son sifatida, hech qanday modul olinmasdan chiqariladi. Boshlanish yoki manzil katagi devor bo‘lsa, javob 0.",
    statementEn: "You are given a grid of r rows and c columns in which '.' is a free cell and '#' is a wall. We count the paths from the top-left cell to the bottom-right cell: each step moves one cell down or one cell right, and a wall may not be entered. Print the number of such paths — the grid is small in this problem, so the answer is printed in full, with no modulus taken. If the starting or the destination cell is a wall, the answer is 0.",
  },
  {
    id: "B184",
    statementUz: "Sizga tomonlari koordinata o‘qlariga parallel ikkita to‘rtburchak berilgan; har biri ikkita qarama-qarshi burchagi bilan, burchaklar esa istalgan tartibda beriladi (ya'ni x1 > x2 bo‘lishi mumkin). Ular musbat yuzali umumiy sohaga ega ekanini aniqlang va YES yoki NO deb bosh harflarda chiqaring. Faqat qirrasi bo‘ylab yoki bitta burchagi bilan tegib turgan to‘rtburchaklar kesishgan hisoblanmaydi, chunki umumiy sohaning yuzasi nolga teng bo‘ladi.",
    statementEn: "You are given two axis-aligned rectangles, each by two opposite corners, with the corners given in either order (so x1 > x2 is possible). Determine whether they share a region of positive area, and print YES or NO in capital letters. Rectangles touching only along an edge or at a single corner do not count as overlapping, since the area they share is then zero.",
  },
  {
    id: "B186",
    statementUz: "Sizga ikkita n va k butun soni berilgan. 1 dan k gacha bo‘lgan qiymatlardan tuzilgan, yig‘indisi aynan n ga teng bo‘lgan ketma-ketliklarni qaraymiz; har bir qiymatdan istalgancha ko‘p foydalanish mumkin. Faqat tartibi bilan farq qiladigan ikki ketma-ketlik bitta hisoblanadi — shuning uchun har bir ketma-ketlik kamaymaydigan tartibda yozilgan deb qaraladi va 1+2 bilan 2+1 bir xil. Shunday ketma-ketliklar sonini chiqaring; birortasi bo‘lmasa javob 0.",
    statementEn: "You are given two integers n and k. We consider the sequences of values from 1 to k that add up to exactly n; each value may be used any number of times. Two sequences differing only in order count as one — so every sequence is taken to be written in non-decreasing order, and 1+2 is the same as 2+1. Print the number of such sequences; if there is none, the answer is 0.",
  },
  {
    id: "B193",
    statementUz: "Sizga n ta uchdan iborat, 1-uchida ildizlangan daraxt berilgan. Uchning balandligi uchlar bilan o‘lchanadi: bargning balandligi 1, boshqa uchning balandligi esa farzandlarining eng katta balandligidan bittaga ko‘p. Daraxt muvozanatli deyiladi, agar har bir uchda ikkala shart bajarilsa: uchning ikkita yoki undan ko‘p farzandi bo‘lsa, ularning qism daraxtlari balandliklarining eng kattasi bilan eng kichigi ko‘pi bilan birga farq qilsin; uchning aynan bitta farzandi bo‘lsa, o‘sha farzand barg bo‘lsin. Daraxt muvozanatli ekanini aniqlang va YES yoki NO chiqaring.",
    statementEn: "You are given a tree with n nodes, rooted at node 1. The height of a node is counted in nodes: a leaf has height 1, and any other node has height one more than the largest height among its children. The tree is balanced when both conditions hold at every node: if the node has two or more children, the largest and the smallest of their subtree heights differ by at most one; and if the node has exactly one child, that child is a leaf. Determine whether the tree is balanced and print YES or NO.",
  },
  {
    id: "C195",
    statementUz: "Massiv bir cho‘qqili deyiladi, agar u qandaydir pozitsiyagacha o‘sib borsa va shu pozitsiyadan keyin kamayib borsa. Sizga shunday massiv berilgan; uning eng katta elementini — cho‘qqidagi qiymatni — toping va uni chiqaring. Massiv butunlay o‘suvchi yoki butunlay kamayuvchi bo‘lishi ham mumkin, ya'ni cho‘qqi chetlarning birida turishi mumkin. n = 1 bo‘lganda yagona element ham cho‘qqi bo‘ladi.",
    statementEn: "An array is unimodal when it increases up to some position and decreases after that position. You are given such an array; find its largest element — the value at the peak — and print it. The array may also be increasing throughout or decreasing throughout, so the peak may sit at one of the ends. When n = 1 the single element is the peak.",
  },
  {
    id: "C196",
    statementUz: "Massivning qism massivi deb ketma-ket turgan elementlar bo‘lagiga aytiladi; o‘rtadagi elementlarni tashlab ketib bo‘lmaydi. Sizga n ta butun sondan iborat a massivi berilgan; bo‘sh bo‘lmagan barcha qism massivlar orasidan elementlari ko‘paytmasi eng katta bo‘lganini qarab, o‘sha ko‘paytmani chiqaring. Qism massiv bo‘sh bo‘la olmaydi, ya'ni kamida bitta element tanlanadi va javob manfiy bo‘lib chiqishi mumkin. Nol saqlaydigan element ko‘paytmani nolga aylantiradi.",
    statementEn: "A subarray is a stretch of consecutive elements; elements in the middle may not be skipped. You are given an array a of n integers; among all non-empty subarrays consider the one whose elements multiply to the most, and print that product. A subarray may not be empty, so at least one element is chosen and the answer may come out negative. An element equal to zero turns the product into zero.",
  },
  {
    id: "C198",
    statementUz: "Massivning qism ketma-ketligi deb undan ba'zi elementlarni tanlab, ularning nisbiy tartibini saqlash yo‘li bilan hosil qilinadigan ketma-ketlikka aytiladi; tanlangan elementlar yonma-yon bo‘lishi shart emas. Sizga n ta butun sondan iborat a massivi berilgan; eng uzun qat'iy o‘suvchi qism ketma-ketlikning uzunligini toping va uni chiqaring — ya'ni a_{i₁} < a_{i₂} < … < a_{i_L} shartli i₁ < i₂ < … < i_L pozitsiyalar orasidan eng katta L ni. O‘sish qat'iy: teng qiymatlarning ikkalasini birga olib bo‘lmaydi, va javob kamida 1 ga teng.",
    statementEn: "A subsequence of an array is what you get by choosing some of its elements and keeping their relative order; the chosen elements need not be adjacent. You are given an array a of n integers; find the length of the longest strictly increasing subsequence and print it — that is, the largest L over the position sets i₁ < i₂ < … < i_L with a_{i₁} < a_{i₂} < … < a_{i_L}. The increase is strict: two equal values cannot both be taken, and the answer is at least 1.",
  },
  {
    id: "C201",
    statementUz: "Sizga kichik lotin harflaridan iborat s satri berilgan. Sonni p (1 ≤ p ≤ |s|) satrning davri deb ataymiz, agar har bir i > p indeksi uchun s_i = s_{i−p} tengligi bajarilsa. Boshqacha aytganda, s ning birinchi p ta harfini cheksiz takrorlab, natijani |s| uzunlikda kessak, aynan s hosil bo‘ladi. Eng kichik shunday p ni toping va uni chiqaring. Blok butun marta sig‘ishi shart emas — oxirgi nusxa yarim yo‘lda kesilishi mumkin — va p = |s| har doim yaraydi, shuning uchun javob mavjud.",
    statementEn: "You are given a string s of lowercase Latin letters. Call a number p with 1 ≤ p ≤ |s| a period of the string when s_i = s_{i−p} holds for every index i > p. Equivalently: repeating the first p letters of s indefinitely and cutting the result at length |s| reproduces s exactly. Find the smallest such p and print it. The block need not fit a whole number of times — the last copy may be cut off half way — and p = |s| always works, so an answer always exists.",
  },
  {
    id: "C202",
    statementUz: "Satrning xos chegarasi deb 1 ≤ k < |s| shartini qanoatlantiruvchi shunday k soniga aytiladi-ki, s ning birinchi k ta harfi oxirgi k ta harfi bilan aynan mos kelsa: masalan, \"aabaabaa\" uchun k = 1, 2 va 5 chegaralar. Butun satrning o‘zi chegara hisoblanmaydi, chunki shart k < |s| ni talab qiladi. Sizga kichik lotin harflaridan iborat s satri berilgan; uning barcha xos chegaralari uzunliklarini o‘sish tartibida bitta qatorda chiqaring. Birorta xos chegara bo‘lmasa — masalan, uzunligi 1 bo‘lgan satrda — buning o‘rniga -1 chiqaring.",
    statementEn: "A proper border of a string is a number k with 1 ≤ k < |s| for which the first k letters of s match the last k letters exactly: for \"aabaabaa\", for instance, the borders are k = 1, 2 and 5. The whole string is not a border of itself, since the condition demands k < |s|. You are given a string s of lowercase Latin letters; print the lengths of all its proper borders in increasing order on one line. If there is no proper border at all — as in a string of length 1 — print -1 instead.",
  },
  {
    id: "C203",
    statementUz: "Satrning bo‘lagi deb undagi ketma-ket turgan harflar ketma-ketligiga aytiladi, palindrom esa chapdan o‘ngga va o‘ngdan chapga bir xil o‘qiladigan satr. Sizga kichik lotin harflaridan iborat s satri berilgan; uning palindrom bo‘lgan bo‘laklari orasidan eng uzunini qarab, uning uzunligini chiqaring. Bo‘lakning harflari uzluksiz turishi shart — tashlab ketish mumkin emas. Har qanday bitta harfning o‘zi palindrom bo‘lgani uchun javob kamida 1 ga teng.",
    statementEn: "A substring of a string is a run of consecutive letters in it, and a palindrome is a string reading the same from left to right as from right to left. You are given a string s of lowercase Latin letters; among its substrings that are palindromes consider the longest, and print its length. The letters of a substring must be consecutive — skipping is not allowed. Since any single letter is a palindrome on its own, the answer is at least 1.",
  },
];
