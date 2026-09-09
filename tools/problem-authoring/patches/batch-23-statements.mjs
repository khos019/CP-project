/* Statement rewrite, batch 23 — C276, the one entry batch 22 skipped over.
 *
 * With this the pass covers all 302 problems in the bank.
 *
 * Rules in batch 15's header.
 *
 * Applied with: node restate.mjs patches/batch-23-statements.mjs
 */
export default [
  {
    id: "C276",
    statementUz: "Sizga 1-tugundan ildiz oladigan n ta tugunli daraxt berilgan va har bir tugunda butun qiymat bor; qiymatlar manfiy bo'lishi mumkin. Barg deb ildizdan boshqa, ostida birorta tuguni bo'lmagan tugunga aytiladi; n = 1 bo'lganda ildizning o'zi barg hisoblanadi. Ildizdan biror bargcha tushadigan yo'llarni qaraymiz — yo'l albatta bargda tugashi kerak, o'rtada to'xtab bo'lmaydi — va shu yo'ldagi tugunlar qiymatlarining yig'indisini olamiz, ildiz bilan bargning qiymatlari ham kiradi. Yig'indisi aynan S ga teng bo'lgan shunday yo'l bor-yo'qligini aniqlang va YES yoki NO chiqaring.",
    statementEn: "You are given a tree with n vertices rooted at vertex 1, each carrying an integer value; the values may be negative. A leaf is a vertex other than the root with no vertex below it; when n = 1 the root itself counts as a leaf. We consider the paths running from the root down to some leaf — a path must end at a leaf and may not stop part way — and take the sum of the values of the vertices on it, the root's and the leaf's included. Determine whether such a path of sum exactly S exists, and print YES or NO.",
  },
];
