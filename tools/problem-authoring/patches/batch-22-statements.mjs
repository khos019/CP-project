/* Statement rewrite, batch 22 — the last sixteen.
 *
 * With this batch every one of the 302 problems in the bank has been through
 * the pass: the legend is gone from all of them, and each statement names what
 * the input describes, what is being asked, the definitions the question uses
 * and the edges that decide a submission — with no word about method.
 *
 * Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-22-statements.mjs
 */
export default [
  {
    id: "C244",
    statementUz: "Sizga n ta tugun va m ta yo'naltirilgan qirradan iborat tarmoq berilgan; har bir qirraning sig'imi bor. Oqim deb har bir qirraga uning sig'imidan oshmaydigan manfiy bo'lmagan miqdor tayinlashga aytiladi, shu shart bilan-ki, manba (1-tugun) va oqim (n-tugun) dan boshqa har bir tugunga kirgan miqdor undan chiqqaniga teng bo'lsin. Oqimning qiymati — manbadan chiqqan umumiy miqdor. 1-tugundan n-tugungacha yuborish mumkin bo'lgan eng katta oqim qiymatini toping va uni chiqaring. n = 1 bo'lganda javob 0; bir juft tugun orasida bir nechta va qarama-qarshi yo'nalishdagi qirralar bo'lishi mumkin.",
    statementEn: "You are given a network with n vertices and m directed edges, each with a capacity. A flow assigns to every edge a non-negative amount not exceeding its capacity, subject to this: at every vertex other than the source (vertex 1) and the sink (vertex n) the amount coming in equals the amount going out. The value of a flow is the total leaving the source. Find the largest flow value that can be sent from vertex 1 to vertex n and print it. When n = 1 the answer is 0; there may be several edges between the same pair, and edges in both directions.",
  },
  {
    id: "C253",
    statementUz: "Sizga n ta satr va m ta ustundan iborat jadval berilgan; unda '1' belgisi manbani, '0' esa oddiy katakni bildiradi. Bir qadamda faqat yon tomondagi — yuqori, quyi, chap yoki o'ng — katakka o'tish mumkin; diagonal yurish mumkin emas. Har bir katak uchun undan eng yaqin manbagacha bo'lgan qadamlar sonini toping va bu qiymatlarni jadval shaklida, har bir satr uchun bittadan qatorda chiqaring. Manbaning o'zidan manbagacha masofa 0. Jadvalda kamida bitta manba bor, ya'ni har bir masofa chekli.",
    statementEn: "You are given a grid of n rows and m columns in which '1' marks a source and '0' an ordinary cell. One step moves to a side-adjacent cell — up, down, left or right; diagonal moves are not allowed. For every cell find the number of steps to the nearest source, and print those values in the shape of the grid, one line per row. The distance from a source to itself is 0. The grid holds at least one source, so every distance is finite.",
  },
  {
    id: "C257",
    statementUz: "Sizga n ta ish berilgan; har biri aynan bitta vaqt birligini oladi va bir vaqtda faqat bitta ish bajariladi. Vaqt birliklari 1, 2, 3, … deb raqamlanadi. i-ish o'zining d_i muddatidan kechikmay, ya'ni d_i dan katta bo'lmagan biror vaqt birligida bajarilsa, p_i foyda keltiradi; kechiksa yoki umuman bajarilmasa, hech narsa keltirmaydi. Qaysi ishlarni qaysi vaqt birliklarida bajarishni tanlab, umumiy foydani eng katta qilishga harakat qilamiz. Shu eng katta umumiy foydani chiqaring; u 32-bitli turga sig'maydi.",
    statementEn: "You are given n jobs, each taking exactly one unit of time, and only one job runs at a time. The time units are numbered 1, 2, 3, …. Job i yields profit p_i if it is done no later than its deadline d_i, that is in some time unit not greater than d_i; if it is late, or not done at all, it yields nothing. Choosing which jobs to run in which time units, we try to make the total profit as large as possible. Print that largest total profit; it does not fit in a 32-bit type.",
  },
  {
    id: "C261",
    statementUz: "Sizga n ta manfiy bo'lmagan butun son va S chegarasi berilgan. Qism to'plam deb sonlarning bir qismini (balki birortasini ham emas, balki hammasini) tanlashga aytiladi; har bir son ko'pi bilan bir marta ishlatiladi. Yig'indisi S dan oshmaydigan qism to'plamlar orasidan yig'indisi eng katta bo'lganini qarab, o'sha yig'indini chiqaring. Bo'sh qism to'plam ham ruxsat etilgan va uning yig'indisi 0, shuning uchun javob hech qachon manfiy bo'lmaydi — masalan, barcha sonlar S dan katta bo'lsa javob 0 bo'ladi.",
    statementEn: "You are given n non-negative integers and a limit S. A subset means choosing some of the numbers (possibly none, possibly all); each number is used at most once. Among the subsets whose total does not exceed S consider the one with the largest total, and print that total. The empty subset is allowed and sums to 0, so the answer is never negative — if every number is larger than S, for instance, the answer is 0.",
  },
  {
    id: "C268",
    statementUz: "Sizga n ta yukning og'irliklari berilgan; ular aynan berilgan tartibda ortilishi kerak va bo'linmaydi. Kemaning kunlik sig'imi har kuni bir xil. Har kuni kema qolgan yuklarning boshidan boshlab ketma-ket turgan bir nechta yukni oladi, lekin ularning umumiy og'irligi sig'imdan oshmasligi kerak. Barcha yuklarni ko'pi bilan d kunda tashishga yetadigan eng kichik sig'imni toping va uni chiqaring. Sig'im eng og'ir yakka yukdan kichik bo'la olmaydi, aks holda o'sha yuk hech qachon ortilmaydi.",
    statementEn: "You are given the weights of n packages; they must be shipped in exactly the order given and are never split. The ship's daily capacity is the same every day. Each day the ship takes several consecutive packages from the front of what remains, their total weight not exceeding the capacity. Find the smallest capacity that ships every package within d days and print it. The capacity cannot be below the heaviest single package, or that package would never be loaded.",
  },
  {
    id: "C269",
    statementUz: "n × m o'lchamli ko'paytirish jadvali qaraladi: i-qator va j-ustundagi katakda i·j soni turadi, ya'ni jadvalda jami n·m ta son bor. Shu sonlarning barchasini o'sish tartibida bitta ro'yxatga tizsak, k-o'rinda qaysi son turishini aniqlang va uni chiqaring. Bir xil qiymatlar necha marta uchrasa, ro'yxatda shuncha marta qatnashadi: masalan, 6 soni 2·3 va 3·2 sifatida ikki marta paydo bo'lishi mumkin. n·m 2.5·10^9 ga yetadi.",
    statementEn: "Consider the n × m multiplication table: the cell in row i and column j holds i·j, so the table holds n·m numbers in all. Laying all of them out in one list in non-decreasing order, determine which number stands at position k and print it. Equal values take part as many times as they occur: the number 6, for instance, may appear twice, as 2·3 and as 3·2. Note that n·m reaches 2.5·10^9.",
  },
  {
    id: "C271",
    statementUz: "Mashina 0 nuqtadan boshlaydi va d masofadagi manzilga yetishi kerak; boshida bakda f litr yoqilg'i bor va bir litr aynan bir birlik masofaga yetadi. Yo'lda n ta yoqilg'i bekati bor: i-chisi p_i masofada joylashgan va u yerda a_i litr yoqilg'i olish mumkin (bekatdan bir marta, hammasini yoki hech narsani). Bakning sig'imi cheklanmagan, bekatlar esa masofa bo'yicha o'sish tartibida berilgan. Manzilga yetish uchun kerak bo'ladigan eng kam to'xtashlar sonini toping va uni chiqaring; manzilga umuman yetib bo'lmasa -1 chiqariladi.",
    statementEn: "A car starts at position 0 and must reach a destination at distance d; it begins with f litres in the tank and one litre covers exactly one unit of distance. There are n stations on the way: the i-th sits at distance p_i and offers a_i litres (taken once, all of it or none). The tank has no capacity limit, and the stations are given in increasing order of distance. Find the fewest stops needed to reach the destination and print it; if the destination cannot be reached at all, -1 is printed.",
  },
  {
    id: "C272",
    statementUz: "Sizga k xil vazifa berilgan; i-turdagi vazifa aynan c_i marta bajarilishi kerak. Har bir vazifa bir birlik vaqt oladi va vaqt birliklari ketma-ket boradi. Bir xil turdagi ikki vazifa orasida kamida n birlik vaqt o'tishi shart, ya'ni ular orasida boshqa turdagi vazifalar yoki bo'sh kutish birliklari turishi kerak. Barcha vazifalarni bajarish uchun kerak bo'ladigan eng kam umumiy vaqtni — bo'sh kutish birliklari ham hisobga olingan holda — toping va uni chiqaring. n = 0 bo'lganda hech qanday kutish talab qilinmaydi.",
    statementEn: "You are given k kinds of task; the task of kind i must be performed exactly c_i times. Each task takes one unit of time, and the time units run consecutively. Between two tasks of the same kind at least n units must pass, so tasks of other kinds or idle units must stand between them. Find the smallest total time needed to perform them all — idle units included — and print it. When n = 0 no waiting is ever required.",
  },
  {
    id: "C273",
    statementUz: "Sizga n ta odamning og'irliklari va qayiqning ko'tarish chegarasi berilgan; birorta odamning og'irligi chegaradan oshmaydi, ya'ni har kim yolg'iz o'tishi mumkin. Har bir qayiqqa ko'pi bilan ikki kishi o'tiradi va o'tirganlarning umumiy og'irligi chegaradan oshmasligi kerak. Hammani suzib o'tkazish uchun kerak bo'ladigan eng kam qayiqlar sonini toping va uni chiqaring; javob n/2 dan kam bo'la olmaydi, chunki har bir qayiq ko'pi bilan ikki kishini oladi.",
    statementEn: "You are given the weights of n people and a boat's weight limit; no single person weighs more than the limit, so everyone can cross alone. Each boat carries at most two people, and the total weight of those aboard must not exceed the limit. Find the fewest boats needed to carry everyone across and print it; the answer cannot be below n/2, since a boat takes at most two people.",
  },
  {
    id: "C274",
    statementUz: "Limonad stakani 5 pul turadi. Navbatda n ta xaridor turibdi va ular navbat bo'yicha keladi; har biri aynan bitta stakan sotib oladi va 5, 10 yoki 20 lik banknot beradi. Qaytimni faqat oldin olgan banknotlaringiz bilan berasiz — boshida sizda pul yo'q va hech qanday zaxira yo'q. Har bir xaridorga to'g'ri qaytim bera olasizmi degan savolga javob bering va YES yoki NO chiqaring. 5 lik bergan xaridorga qaytim kerak emas, 10 lik berganga 5, 20 lik berganga esa 15 qaytim kerak bo'ladi.",
    statementEn: "A cup of lemonade costs 5. There are n customers in a queue and they come in that order; each buys exactly one cup and hands over a 5, a 10 or a 20 note. Change may only be given from the notes you have already taken — you start with no money and no reserve at all. Answer whether every customer can be given correct change, printing YES or NO. A customer paying with a 5 needs no change, one paying with a 10 needs 5 back, and one paying with a 20 needs 15.",
  },
  {
    id: "C275",
    statementUz: "Sizga 1-tugundan ildiz oladigan n ta tugunli daraxt berilgan. Tugunning qatlami deb ildizdan unga tushadigan yo'ldagi qirralar soniga aytiladi: ildizning o'zi 0-qatlamda, uning bevosita qo'shnilari 1-qatlamda va shu tartibda davom etadi. Barcha tugunlarni qatlam bo'yicha o'sish tartibida bitta qatorda chiqaring; bir xil qatlamdagi tugunlar o'zaro nomeri bo'yicha o'sish tartibida yozilsin. Bu ikki qoida tartibni to'liq aniqlaydi, va chiqishda aynan n ta son bo'ladi.",
    statementEn: "You are given a tree with n vertices rooted at vertex 1. The level of a vertex is the number of edges on the path from the root down to it: the root itself is on level 0, its immediate neighbours on level 1, and so on. Print all the vertices on one line in increasing order of level; vertices on the same level are listed among themselves in increasing order of number. Those two rules determine the order completely, and the output holds exactly n numbers.",
  },
  {
    id: "C279",
    statementUz: "Musobaqada n ta ishtirokchi qatnashdi va har birining bali berilgan; barcha ballar o'zaro har xil. O'rinlar ballar bo'yicha taqsimlanadi: eng ko'p ball to'plagan ishtirokchi 1-o'rinni, undan keyingisi 2-o'rinni oladi va shu tartibda n-o'ringacha davom etadi. Har bir ishtirokchining o'rnini toping va bu n ta sonni ishtirokchilar kirishda berilgan tartibda — saralangan tartibda emas — bitta qatorda chiqaring.",
    statementEn: "There are n contestants and each one's score is given; all the scores are distinct from one another. Places are handed out by score: the contestant with the highest score takes place 1, the next takes place 2, and so on down to place n. Find each contestant's place and print those n numbers on one line in the order the contestants were given in the input — not in sorted order.",
  },
  {
    id: "C293",
    statementUz: "Stek — elementlar yuqorisiga qo'shiladigan va yuqorisidan olinadigan tuzilma: oxirgi kelgan birinchi ketadi. Boshida stek bo'sh. So'ngra q ta amal ketma-ket beriladi:\n\n• \"1 x\" — stekning yuqorisiga x sonini qo'yadi;\n• \"2\" — stekning yuqorisidagi elementni olib tashlaydi;\n• \"3\" — stekda yotgan barcha elementlarning eng kichigini chiqaradi.\n\nO'chirish va minimum so'rovlari faqat stek bo'sh bo'lmaganda keladi. Bir xil qiymat bir necha marta qo'shilishi mumkin, va minimum stekning shu paytdagi to'liq tarkibiga tegishli.",
    statementEn: "A stack is a structure where elements are added on top and taken from the top: last in, first out. The stack starts empty. Then q operations are given one after another:\n\n• \"1 x\" — puts the number x on top of the stack;\n• \"2\" — removes the element on top;\n• \"3\" — prints the smallest of all the elements in the stack.\n\nA pop or a minimum query only ever arrives when the stack is not empty. The same value may be pushed several times, and the minimum refers to the whole of the stack's current contents.",
  },
  {
    id: "C294",
    statementUz: "Sizga n ta butun sondan iborat massiv va S soni berilgan; pozitsiyalar 1 dan raqamlanadi. Shunday (i, j) pozitsiyalar juftligini toping-ki, i < j va a_i + a_j = S bo'lsin, va uning ikki indeksini chiqaring. Bunday juftliklar bir nechta bo'lsa, j eng kichik bo'lganini tanlang; shu j bilan bir nechta juftlik bo'lsa, ular orasidan i eng kichigini tanlang. Element o'zi bilan juftlashmaydi, lekin har xil pozitsiyalardagi teng qiymatlar juftlashishi mumkin. Mos juftlik bo'lmasa -1 chiqariladi.",
    statementEn: "You are given an array of n integers and a number S; positions are numbered from 1. Find a pair of positions (i, j) with i < j and a_i + a_j = S, and print its two indices. If several such pairs exist, choose the one with the smallest j; if several pairs share that j, choose the one with the smallest i among them. An element is not paired with itself, but equal values at different positions may be paired. If no pair matches, -1 is printed.",
  },
  {
    id: "C297",
    statementUz: "Sizga n ta butun sondan iborat massiv berilgan; pozitsiyalar 1 dan raqamlanadi. Muvozanat nuqtasi deb shunday i pozitsiyaga aytiladi-ki, undan chapda turgan barcha elementlar yig'indisi undan o'ngda turgan barcha elementlar yig'indisiga teng bo'lsin; i-elementning o'zi ikkala yig'indiga ham kirmaydi. Chegaraviy pozitsiyalar ham qaraladi: birinchi yoki oxirgi pozitsiyada bir tomon bo'sh bo'ladi va bo'sh tomonning yig'indisi 0 deb olinadi. Eng kichik shunday i ni chiqaring; bunday pozitsiya bo'lmasa -1 chiqaring.",
    statementEn: "You are given an array of n integers; positions are numbered from 1. An equilibrium point is a position i at which the sum of all the elements to its left equals the sum of all the elements to its right; the element at i itself belongs to neither sum. The end positions are included: at the first or the last position one side is empty, and an empty side is taken to sum to 0. Print the smallest such i; if there is no such position, print -1.",
  },
];
