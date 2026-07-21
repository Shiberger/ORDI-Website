# Supabase Setup — ORDI

คู่มือทีละขั้นสำหรับ project `vbinuvnkhvedwsyvkwdz`
ทำตามลำดับ แต่ละขั้นเป็น prerequisite ของขั้นถัดไป

> **หมายเหตุ:** Supabase ปรับ UI บ่อย ชื่อเมนู/ปุ่มอาจเพี้ยนไปเล็กน้อย
> แต่ตำแหน่ง (sidebar ซ้าย → หน้า → tab) จะยังใกล้เคียงเดิม

---

## ขั้นที่ 0 — ตรวจว่า .env.local ถูกสร้างไว้แล้ว

Claude สร้างให้แล้วทั้งสองไฟล์ (gitignored ทั้งคู่):

| ไฟล์ | มีอะไรแล้ว | ยังขาด |
|---|---|---|
| `front-end/.env.local` | URL, publishable key, `REVALIDATE_SECRET` | `SUPABASE_SECRET_KEY`, Stripe |
| `admin/.env.local` | URL, publishable key, `REVALIDATE_SECRET` | — ครบแล้ว |

`REVALIDATE_SECRET` ถูก generate ให้แล้วและตรงกันทั้งสองไฟล์ **อย่าแก้ค่านี้แยกกัน**

---

## ขั้นที่ 1 — เอา Secret Key มาใส่

Storefront ต้องใช้ secret key ในการ **เขียน order** (checkout API + Stripe webhook)
เพราะตาราง `orders` ไม่มี INSERT policy โดยตั้งใจ — ไม่มี browser client ไหนปลอม order ได้

1. เปิด https://supabase.com/dashboard/project/vbinuvnkhvedwsyvkwdz
2. Sidebar ซ้ายล่างสุด → **Project Settings** (ไอคอนเฟือง)
3. เมนูย่อย → **API Keys**
4. ดูหัวข้อ **Secret keys** (คนละอันกับ Publishable key ที่อยู่ด้านบน)
5. กด **Reveal** / ไอคอนรูปตา แล้ว **Copy** ค่าที่ขึ้นต้นด้วย `sb_secret_`
6. เปิด `front-end/.env.local` วางต่อท้ายบรรทัด:

```bash
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxx
```

> ⚠️ Key นี้ **bypass RLS ทั้งหมด** ห้ามใส่ใน `admin/.env.local`, ห้าม commit,
> ห้ามขึ้นต้นด้วย `NEXT_PUBLIC_` เด็ดขาด (จะหลุดเข้า browser bundle)

---

## ขั้นที่ 2 — รัน Migration

### วิธี A — SQL Editor (แนะนำ, ไม่ต้องลงอะไรเพิ่ม)

1. Sidebar ซ้าย → **SQL Editor** (ไอคอน `>_`)
2. กด **+ New query** (มุมซ้ายบนของ panel)
3. เปิดไฟล์ `back-end/supabase/migrations/0001_core_schema.sql` ใน VS Code
   → เลือกทั้งหมด (`Cmd+A`) → copy (`Cmd+C`)
4. วางลงช่อง SQL Editor → กด **Run** (มุมขวาล่าง) หรือ `Cmd+Enter`
5. ต้องขึ้น **Success. No rows returned**
6. กด **+ New query** อีกครั้ง → ทำซ้ำข้อ 3–5 กับ
   `back-end/supabase/migrations/0002_content_schema.sql`

**ต้องรัน 0001 ก่อน 0002 เสมอ** เพราะ 0002 เรียกใช้ฟังก์ชัน
`touch_updated_at()` และ `is_admin()` ที่สร้างใน 0001

ทั้งสองไฟล์ idempotent — รันซ้ำได้ไม่พัง ถ้าพลาดกลางทางแค่รันใหม่ทั้งไฟล์

### วิธี B — Supabase CLI (ถ้าอยากได้ migration history)

```bash
brew install supabase/tap/supabase
cd back-end          # สำคัญ: ต้องอยู่ใน back-end/ เพราะ supabase/ อยู่ที่นี่แล้ว
supabase login
supabase link --project-ref vbinuvnkhvedwsyvkwdz   # จะถาม DB password
supabase db push
```

DB password คือรหัสที่ตั้งตอนสร้าง project (ตัวที่ต้องแทนใน `[YOUR-PASSWORD]`
ของ connection string) ถ้าจำไม่ได้ → Project Settings → **Database** →
**Reset database password**

---

## ขั้นที่ 3 — ตรวจว่า schema ลงครบ

SQL Editor → New query → วางแล้ว Run:

```sql
select table_name,
       (select count(*) from information_schema.columns c
        where c.table_name = t.table_name and c.table_schema = 'public') as columns
from information_schema.tables t
where table_schema = 'public' and table_type = 'BASE TABLE'
order by table_name;
```

ต้องได้ **9 ตาราง**:

| ตาราง | คอลัมน์ |
|---|---|
| `journal_entries` | 16 |
| `newsletter_subscribers` | 4 |
| `order_items` | 8 |
| `orders` | 18 |
| `product_sizes` | 5 |
| `products` | 19 |
| `profiles` | 9 |
| `shipping_addresses` | 10 |
| `wishlists` | 3 |

เช็ค RLS เปิดครบด้วย:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

`rowsecurity` ต้องเป็น `true` ทุกแถว

---

## ขั้นที่ 4 — Seed ข้อมูลน้ำหอม + journal

จาก **repo root**:

```bash
npm run seed
```

ควรได้:

```
env loaded from front-end/.env.local

Seeding 5 products…
  ✓ N°01  GOOD BOY
  ✓ N°02  HOT DILF
  ✓ N°03  SEA BREEZE
  ✓ N°04  DROWNING LOVE
  ✓ N°05  CLOUD FON

Seeding 4 journal entries…
  ✓ JRN.003  CLOUD FON — the scent of air that hasn't dried…
  ...

Done.
```

ถ้าขึ้น `Missing SUPABASE_SECRET_KEY` → กลับไปทำขั้นที่ 1 ให้เสร็จก่อน

ตรวจใน Dashboard: Sidebar → **Table Editor** → เลือกตาราง `products`
ต้องเห็น 5 แถว และตาราง `product_sizes` ต้องมี 10 แถว (5 น้ำหอม × 2 ขนาด)

---

## ขั้นที่ 5 — สร้าง account admin

### วิธีที่แนะนำ — คำสั่งเดียวจบ

```bash
npm run create-admin -- your@email.com
```

script จะสร้าง auth user (confirm ให้เลย ไม่ต้องกดลิงก์ในเมล), รอ trigger
`handle_new_user` สร้างแถวใน `profiles`, แล้วตั้ง `role = 'owner'` ให้
พร้อม generate password แข็ง ๆ พิมพ์ออกมาครั้งเดียว — **เซฟไว้แล้วเปลี่ยนทีหลัง**

รันซ้ำได้: ถ้ามี account อยู่แล้วจะเลื่อนขั้นให้เฉย ๆ ไม่รีเซ็ตรหัส

เพิ่มคนอื่นเข้าทีม:
```bash
npm run create-admin -- teammate@email.com admin
```
(ตอนนี้ `admin` กับ `owner` สิทธิ์เท่ากัน — แยกไว้เผื่ออนาคต)

### วิธีสำรอง — ผ่าน Dashboard UI

ถ้าอยากสร้าง user เองพร้อมตั้งรหัสผ่านเอง:

1. Sidebar ซ้าย → **Authentication** → **Users**
2. มุมขวาบน → **Add user** → **Create new user**
3. กรอก email + password, เปิด **Auto Confirm User** ✅
4. กด **Create user**
5. เลื่อนขั้น: `npm run make-admin -- your@email.com`

(`make-admin` เลื่อนขั้น user ที่มีอยู่แล้วอย่างเดียว ไม่สร้างใหม่)

---

## ขั้นที่ 6 — ทดสอบ

เปิด 2 terminal:

```bash
npm run dev          # terminal 1 → http://localhost:3000
npm run dev:admin    # terminal 2 → http://localhost:3001
```

### Storefront

- เปิด http://localhost:3000/shop → ต้องเห็นน้ำหอม 5 ตัว
- **ตอนนี้ข้อมูลมาจาก Supabase แล้ว ไม่ใช่ seed fallback**
  วิธีพิสูจน์: Table Editor → `products` → แก้ `name` ของ GOOD BOY เป็นอย่างอื่น
  → refresh หน้า shop → ต้องเปลี่ยนตาม (แล้วแก้กลับ)

### Dashboard

- เปิด http://localhost:3001 → ต้องเด้งไป `/login`
- login ด้วย email/password ที่ได้จากขั้นที่ 5
- ต้องเข้า Dashboard ได้ เห็น sidebar: Dashboard / Orders / Products / Journal
- **Products** → ต้องเห็น 5 แถว
- **Journal** → ต้องเห็น 4 แถว
- ตัวเลขยอดขายจะเป็น 0 ทั้งหมด (ยังไม่มี order — ปกติ)

### ทดสอบวงจร content

1. Dashboard → **Products** → คลิก **GOOD BOY**
2. แก้ **Tagline (English)** เป็นอะไรก็ได้
3. กด **Save changes** → ต้องขึ้นแถบเขียว "Saved. The storefront is refreshing."
4. เปิด http://localhost:3000/shop/good-boy → tagline ต้องเปลี่ยนแล้ว **ทันที**

ถ้า step 4 ไม่เปลี่ยน แปลว่า `REVALIDATE_SECRET` ในสองไฟล์ไม่ตรงกัน
→ ดู log ใน terminal ของ `npm run dev:admin` จะเห็น `[revalidate] storefront responded 401`

---

## ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| `/shop` ยังเห็นข้อมูลเดิมแม้แก้ใน DB | ยังใช้ seed fallback | เช็คว่า `.env.local` มี URL + publishable key แล้ว **restart dev server** (env อ่านตอน boot) |
| login แล้วเด้งกลับ `/login?error=not_admin` | `role` ยังเป็น `customer` | รัน `npm run make-admin -- your@email.com` |
| login แล้วขึ้น "Invalid login credentials" | user ยังไม่ confirm | Authentication → Users → คลิก user → เช็คว่ามี `email_confirmed_at` |
| Dashboard โหลดได้แต่ Products ว่าง | ยังไม่ได้ seed | `npm run seed` |
| Dashboard ขึ้นการ์ด "Not configured yet" | `admin/.env.local` ไม่มีค่า | เช็คไฟล์ + restart |
| `npm run seed` ขึ้น `relation "products" does not exist` | ยังไม่ได้รัน 0002 | กลับไปขั้นที่ 2 |
| `npm run seed` ขึ้น `function touch_updated_at() does not exist` | รัน 0002 ก่อน 0001 | รัน 0001 แล้วรัน 0002 ใหม่ |
| Table Editor เห็นข้อมูล แต่ storefront ว่าง | `published = false` | เปิดใน dashboard → ติ๊ก Published |

---

## แยก dev / production

`vbinuvnkhvedwsyvkwdz` ที่ตั้งไว้แล้วจะกลายเป็น **production** (Vercel ใช้)
แล้วสร้าง project ที่สองไว้ให้ local ใช้ทดสอบ

**ทำไมต้องแยก:** local `npm run dev:admin` เขียน DB จริง ถ้าใช้ project เดียว
กดลบน้ำหอมผิดตัวตอนลองเล่น = หายจากเว็บที่ลูกค้าเห็นทันที และ test order จาก
บัตร Stripe test จะปนกับยอดขายจริงใน dashboard

Supabase free tier ให้ 2 projects ต่อ organization — ไม่มีค่าใช้จ่ายเพิ่ม

### 1. สร้าง project ที่สอง

1. https://supabase.com/dashboard → **New project**
2. **Name:** `ordi-dev`
3. **Database Password:** ตั้งใหม่ (คนละตัวกับ production ก็ได้)
4. **Region:** Southeast Asia (Singapore) — เหมือน production
5. รอ provision ~2 นาที

### 2. รัน migration บน project ใหม่

SQL Editor ของ **ordi-dev** → รัน `0001_core_schema.sql` แล้ว `0002_content_schema.sql`
(ขั้นตอนเดียวกับขั้นที่ 2 ด้านบน)

### 3. สลับ env

**ย้าย credential ของ production ออกไปก่อน** สร้าง `back-end/.env.production.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vbinuvnkhvedwsyvkwdz.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...        # ตัวเดิมของ production
```

แล้วเปลี่ยน `front-end/.env.local` + `admin/.env.local` ให้ชี้ **ordi-dev** แทน
(URL, publishable key, secret key ของ project ใหม่)

### 4. Seed + สร้าง admin บน dev

```bash
npm run seed
npm run create-admin -- your@email.com
```

สังเกต output จะบอก `Project: ordi-dev` — ถ้าไม่ใช่แปลว่า env ยังชี้ผิด

### สั่งงาน production เมื่อจำเป็น

script จะชี้ **dev เสมอ** โดย default ต้องพิมพ์ `ORDI_TARGET=prod` เพื่อ opt in:

```bash
ORDI_TARGET=prod npm run seed
ORDI_TARGET=prod npm run create-admin -- your@email.com
```

จะขึ้นแถบแดง `TARGET: PRODUCTION` เตือนก่อนทำงานทุกครั้ง

| ตัว | ชี้ที่ไหน |
|---|---|
| `npm run dev` / `dev:admin` (local) | ordi-dev |
| script ทั่วไป | ordi-dev |
| script ที่มี `ORDI_TARGET=prod` | production |
| Vercel (ทั้ง 2 projects) | production |

---

## ต่อไป — Stripe

Supabase เสร็จแล้วแต่ยังจ่ายเงินไม่ได้ ขั้นถัดไปคือ Stripe:
ดู `Project-dev.md` → **Setup Runbook → 3. Stripe**

สรุปสั้น ๆ:

```bash
# 1. สมัคร stripe.com → อยู่ใน Test mode
# 2. Developers → API keys → copy ใส่ front-end/.env.local
# 3. terminal แยกอีกอัน:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# 4. copy whsec_... ที่มันพิมพ์ออกมา ใส่ STRIPE_WEBHOOK_SECRET
# 5. ทดสอบด้วยบัตร 4242 4242 4242 4242
```
