# AlgoYo'l redesign — ishchi reja (v2)

Bu hujjat `algoyol-redesign-plan.md` ning tekshirilgan va tuzatilgan varianti.
Farqlar auditdan keyin kiritildi — asl rejadagi bir necha taxmin kod bilan mos kelmadi.

## Asl rejaga kiritilgan tuzatishlar

| Asl rejada | Haqiqatda | Qaror |
|---|---|---|
| Dark ko'k+binafsha+amber palitra (§3.1) | Sayt allaqachon dark: yashil-qora `#070a09` + lime `#9aef4f` | **Mavjud palitra saqlanadi**, §3.1 tokenlari bekor |
| Fayl-routing'li ko'p sahifa | Bitta SPA: `AlgoYolApp.tsx` + `pushState` | Sahifa = `view` shoxi; har bosqichda modulga ajratiladi |
| Do'kon backend'i noma'lum | Ishlaydi (013-migratsiya, Telegram Stars) | To'liq qilinadi |
| Monaco lazy-load kerak | Monaco yo'q, o'z editori | Bekor |
| 20 ta ekran hisobga olinmagan | messages, friends, submissions, placement, stats, users, admin | Ularga ham joy beriladi |

## Palitra (o'zgarmaydi, faqat tokenlashtiriladi)

`--bg:#070a09` · `--surface:#0e1411` · `--surface-2:#121b17` · `--ink:#f2f7f3`
`--muted:#8c9c93` · `--line:#223029` · `--green:#9aef4f` · `--lime:#c8ff76`
`--orange:#ff875c` · `--blue:#7296ff`

Rol taqsimoti: **yashil/lime** = birlamchi amal va muvaffaqiyat · **orange** = "siz shu
yerdasiz", mukofot, duel · **blue** = havola va ma'lumot · qolgani neytral.

## Misol saytlardan olingan darslar

- **cp.uz** — hero chapga tekislangan, o'ngda bitta grafik; bitta solid tugma +
  bitta oddiy matn link. Statistika hero ostida kichik qator. Buni olamiz.
- **kep.uz** — bosh sahifa mehmon uchun ham dashboard: chapda ko'rsatkichlar
  rail'i, o'ngda kontent oqimi. "Kirgan foydalanuvchi dashboard ko'radi" g'oyasini
  tasdiqlaydi.
- **robocontest.uz** — doimiy chap sidebar app-shell; ko'p bo'limni bir joyda
  ushlaydi. AlgoYo'lda 20 ta ekran bor — bu model kerak.
- **repovive.com** — dark yashil palitrani premium ko'rsatish usuli: chuqur fon,
  yuqori kontrastli mahsulot vizuali, tinch navigatsiya.

## Bosqichlar

1. **Poydevor** — ikkiga bo'lingan stylesheet'ni bitta tokenlangan qatlamga yig'ish,
   o'lik light blok'ni olib tashlash, space/radius/type/motion shkalalari,
   dekorativ gradient wash'larni o'chirish.
2. **Navigatsiya** — header nav 7 ta tugmadan 4 ta matn link'ga; Do'kon avatar
   dropdown'iga, Kompilyator footer'ga; mobil pastki tab bar; 3 ustunli footer.
3. **Bosh sahifa** — 6 ta lp-block → 4 ta sektsiya; hero + interaktiv yo'l grafigi;
   kirgan foydalanuvchi uchun dashboard.
4. **O'quv oqimi** — yo'l xaritalari ro'yxati, vizual yo'l, dars, test.
5. **Masalalar oqimi** — jadval + filtrlar, masala sahifasi, judge natijalari.
6. **Duel, Reyting, Profil, Do'kon, Kompilyator, Auth**
7. **Ikkilamchi ekranlar** — messages, friends, submissions, placement, admin.
8. **Sayqal** — bo'sh holatlar, skeletonlar, a11y, i18n, Lighthouse.
