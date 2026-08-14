# Supabase — ULANDI ✅

Hammasi sozlangan. Pastda nima qilinganini va sizga qolgan yagona qadamni ko'rasiz.

## Sizga qolgan yagona qadam

1. VS Code terminalida ishlab turgan serverni to'xtating: **Ctrl + C**
2. Qayta ishga tushiring:
   ```bash
   npm run dev
   ```
3. Saytda **Kirish → Yangi hisob yaratish**:
   - Username: `algoyolchi` (yoki xohlagan nom, 3-24 belgi, faqat harf/raqam/`_`)
   - Email: **m.u.ubaydullayev@gmail.com**
   - Parol: kamida 6 belgi
4. Emailingizga kelgan tasdiqlash havolasini bosing.
5. Sayt Profil sahifasiga qaytadi — u yerda yashil **EGA (OWNER)** nishoni
   va **Boshqaruv (Admin studio)** tugmasi turadi.

> ⚠️ Supabase'ning bepul emaili soatiga 2-3 ta xat yuboradi. Xat kelmasa
> spam papkasini tekshiring, 1 daqiqa kutib "Xabarni qayta yuborish" bosing.

---

## Nima qilindi

**Project:** `nxbxxzswijceqiumuypf` · Northeast Asia (Tokyo) · Free

| Qadam | Holat |
|---|---|
| Project yaratildi | ✅ |
| `.env.local` ga URL va publishable key yozildi | ✅ |
| `001_algoyol.sql` (jadvallar, rollar, RLS) | ✅ 21 ta jadval |
| `003_mastery_roadmaps.sql` (roadmap, quiz) | ✅ 12 ta roadmap |
| `004_owner_and_roles.sql` (owner + rol funksiyasi) | ✅ |
| `on_auth_user_created` trigger (profil avtoyaratish) | ✅ |
| Site URL: `http://localhost:3001` | ✅ |
| Redirect URLs: `localhost:3001/**`, `localhost:3000/**` | ✅ |
| Confirm email: yoqilgan | ✅ |
| REST va Auth API tekshirildi | ✅ 200 OK |

`002_assign_owner.sql` **ataylab o'tkazib yuborildi** — u eski owner emailini
yozardi, `004` uni to'liq almashtiradi.

Owner ro'yxati hozir: `m.u.ubaydullayev@gmail.com`

---

## Ozodbekni ham owner qilish

`supabase/migrations/004_owner_and_roles.sql` faylida `--` ni oching:

```sql
select array[
  'm.u.ubaydullayev@gmail.com',
  'ozodbekhaydaraliyev2000@gmail.com'
]::text[]
```

Keyin Supabase → **SQL Editor** → shu faylning to'liq matnini tashlab **Run**.

## Boshqa odamga admin berish

Supabase → **SQL Editor**:

```sql
-- 1) id sini toping
select id, email from auth.users where email = 'dostim@example.com';

-- 2) admin qiling
update public.profiles set role = 'admin' where id = '<yuqoridagi-id>';
```

Owner sifatida saytdan turib ham beriladi: `select public.set_user_role('<id>', 'admin');`

| Rol | Huquqi |
|---|---|
| **owner** | Hamma narsa: barcha masala, roadmap, rol berish |
| **admin** | Faqat o'zi yaratgan masalalarni tahrirlaydi |
| **user** | Dars o'qiydi, masala yechadi, duelda qatnashadi |

---

## Xato chiqsa

| Belgi | Yechimi |
|---|---|
| "Email tasdiqlash xizmati hali ulanmagan" | Serverni Ctrl+C bilan to'xtatib qayta ishga tushiring — `.env` faqat start paytida o'qiladi |
| Tasdiqlash xati kelmadi | Spam papkasi; soatiga 2-3 ta limit; "Qayta yuborish" |
| Profilda `FOYDALANUVCHI` chiqdi | Boshqa email bilan ro'yxatdan o'tgansiz. `select u.email, p.role from profiles p join auth.users u on u.id=p.id;` bilan tekshiring |
| "Profil topilmadi" | Chiqib, qaytadan kiring |

---

## Xavfsizlik eslatmasi

- `.env.local` `.gitignore` da — GitHub'ga ketmaydi. ✅
- Ichidagi `sb_publishable_...` kaliti **ochiq kalit** — brauzerda ko'rinishi normal,
  RLS himoya qiladi.
- **Secret key** (`sb_secret_...`) `.env.local` ga yozilmagan. Kerak bo'lsa
  Supabase → Settings → API Keys → Secret keys → Reveal orqali o'zingiz olasiz.
  Uni hech qachon `NEXT_PUBLIC_` bilan boshlamang.
- Database parolini saqlab qo'ying — Supabase uni qayta ko'rsatmaydi.
