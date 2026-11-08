# Admin Authentication

Bu sənəd admin panelinin təhlükəsiz autentifikasiya sistemini izah edir.

## 1. Əvvəlki vəziyyət (təhlükəli idi)

Köhnə sistemdə:

- email/şifrə düz mətnlə `process.env` ilə müqayisə olunurdu;
- default `admin@admin.com` / `admin123` fallback var idi;
- cavabda statik `ADMIN_TOKEN` qaytarılırdı;
- token `localStorage`-də saxlanırdı (XSS ilə oğurlana bilər);
- admin layout yalnız client-side token yoxlayırdı;
- API route-ları real auth ilə qorunmurdu.

## 2. Yeni model

```
Brauzer  --POST /api/auth/login-->  Server
         <-- Set-Cookie: admin_session (httpOnly JWT)

Brauzer  --/admin/* + cookie-->  Middleware (JWT verify)
Brauzer  --/api/*  + cookie-->  Middleware (public allowlist və ya JWT)
```

### Əsas qərarlar

| Mövzu | Qərar |
|--------|--------|
| Session | JWT (`jose`, HS256) |
| Saxlama | `httpOnly` + `Secure`(prod) + `SameSite=Lax` cookie |
| Şifrə | `bcryptjs` hash (`ADMIN_PASSWORD_HASH`) |
| Email müqayisə | `timingSafeEqual` |
| Brute-force | IP üzrə rate limit (15 dəq / 8 cəhd) |
| Səhifə qorunması | Next.js `proxy` (`src/proxy.ts`) |
| API qorunması | Middleware + public allowlist |
| Client token | `localStorage` **yoxdur** |

Cookie adı: `admin_session`  
Ömür: **8 saat**

## 3. Environment dəyişənləri

`.env` / Vercel:

```env
AUTH_SECRET=                                 # min 32 simvol
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2a$12$...               # bcrypt hash
```

### Secret yaratmaq

```bash
openssl rand -base64 48
```

### Şifrə hash yaratmaq

```bash
pnpm auth:hash -- "YourStrongPassword"
```

Çıxan hash-i `ADMIN_PASSWORD_HASH` kimi yazın. Düz mətni heç vaxt env-ə qoymayın.

Hash `$` ilə başlayır. Next.js `.env` içində `$` işarəsini dəyişən kimi oxuyur və hash-i korlayır, tək dırnaq da bunu dayandırmır. `$` simvollarını `\$` kimi yazın:

```env
ADMIN_PASSWORD_HASH=\$2b\$12\$...
```

## 4. Yazılan / dəyişən fayllar

### Yeni

| Fayl | Məqsəd |
|------|--------|
| `src/@lib/auth/constants.ts` | Cookie adı, maxAge, cookie options |
| `src/@lib/auth/password.ts` | bcrypt hash/verify + timing-safe string |
| `src/@lib/auth/session.ts` | JWT yaratmaq / yoxlamaq (`jose`) |
| `src/@lib/auth/rate-limit.ts` | Login rate limit |
| `src/@lib/auth/require-admin.ts` | Route handler-lərdə əlavə server yoxlama |
| `src/@lib/auth/is-public-api.ts` | Public API allowlist |
| `src/app/api/auth/logout/route.ts` | Cookie silmək |
| `src/app/api/auth/me/route.ts` | Session status |
| `scripts/hash-admin-password.mjs` | Hash generator CLI |
| `AUTH.md` | Bu sənəd |

### Yenilənən

| Fayl | Dəyişiklik |
|------|------------|
| `src/app/api/auth/login/route.ts` | bcrypt + JWT cookie + rate limit |
| `src/proxy.ts` | `/admin/*` və `/api/*` qorunması (`src/` App Router) |
| `src/app/admin/login/page.tsx` | Cookie login, localStorage yox |
| `src/app/admin/layout.tsx` | Client token check silindi |
| `src/app/admin/components/header/AppHeaderDropdown.tsx` | `/api/auth/logout` |
| `src/@lib/api/interceptor.js` | `withCredentials`, 401 → login |
| `.env.example` | `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` |
| `package.json` | `auth:hash` script; `jose`, `bcryptjs` |

## 5. API allowlist (public)

Auth **tələb olunmur**:

- `POST /api/auth/login|logout`
- `GET /api/auth/me`
- `POST /api/subscription`, `verify`, `unsubscribe`
- `POST /api/contacts` (public form)
- `POST /api/articles/view/*`
- `GET` content API-ləri: articles, videos, books, gallery, categories, sliders, mini-sliders, settings, search
- `/api/cron/*` (öz daxilində `CRON_SECRET`)

Auth **tələb olunur** (nümunə):

- admin CRUD (POST/PUT/DELETE)
- `GET /api/contacts`, reply, unread, bulk-delete (+ route-da `requireAdmin`)
- `GET /api/subscription` (abunəçi siyahısı)
- `POST /api/upload-media`

Allowlist: `src/proxy.ts` (əsas) + `src/@lib/auth/is-public-api.ts`.

## 6. Axın

### Login

1. User email/şifrə göndərir.
2. Rate limit yoxlanır.
3. Email `timingSafeEqual`, şifrə `bcrypt.compare`.
4. Uğurlu olarsa JWT cookie set olunur.
5. Token brauzer JS-ə verilmir.

### Admin səhifə

1. Middleware cookie oxuyur, JWT verify edir.
2. Yoxdursa → `/admin/login?next=...`
3. Login səhifəsində aktiv session varsa → `/admin`

### Logout

1. `POST /api/auth/logout` cookie-ni `maxAge=0` edir.
2. Redirect `/admin/login`.

## 7. Təhlükəsizlik checklist

- [ ] `AUTH_SECRET` prod-da unikal və ≥32 simvol
- [ ] `ADMIN_PASSWORD_HASH` bcrypt (plain password env-də yoxdur)
- [ ] Köhnə `ADMIN_PASSWORD` / `ADMIN_TOKEN` silinib
- [ ] HTTPS production-da (Secure cookie)
- [ ] Default admin credentials yoxdur
- [ ] Login rate limit aktivdir

## 8. Lokal quraşdırma

```bash
# 1) secret
openssl rand -base64 48

# 2) password hash
pnpm auth:hash -- "MyStrongPass123!"

# 3) .env
AUTH_SECRET=...
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=...

# 4) dev
pnpm run dev
# → http://localhost:3000/admin/login
```

## 9. Defense in depth (opsional)

Middleware əsas qorunmadır. Kritik route-larda əlavə olaraq:

```ts
import { requireAdmin } from "@/@lib/auth/require-admin";

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  // ...
}
```

## 10. Bilinən məhdudiyyətlər

- Rate limit proses yaddaşıındadır (serverless-də instance-lar arası paylaşılmır). Prod-da Redis tövsiyə olunur.
- Tək admin hesabı env-dədir (DB user table yoxdur). Multi-admin lazımdırsa ayrıca user modeli əlavə edilməlidir.
- CSRF: `SameSite=Lax` + same-origin cookie; state-changing cross-site form riski azalır. Extra CSRF token hələ yoxdur.
