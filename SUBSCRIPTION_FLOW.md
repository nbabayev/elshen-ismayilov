# Abunəlik axını və təhlükəsizlik qərarları

Bu sənəd abunəlik sistemində edilən dəyişikliklərin səbəbini və statusların
mənasını izah edir.

## 1. Base64 ID niyə təhlükəli idi?

Əvvəlki token yalnız subscriber ID-sinin Base64 formasına çevrilməsi idi:

```ts
Buffer.from(id.toString()).toString("base64");
```

Base64 şifrələmə və imza deyil. İstənilən şəxs tokeni decode edə, ID-ni dəyişib
yenidən encode edə və başqa abunəçinin əməliyyat linkini yarada bilərdi.

Yeni token aşağıdakı məlumatları saxlayır:

- subscriber ID;
- məqsəd (`verify` və ya `unsubscribe`);
- son istifadə vaxtı.

Payload `SUBSCRIPTION_TOKEN_SECRET` ilə HMAC-SHA256 imzalanır. Server imzanı
`timingSafeEqual` ilə yoxlayır. Payload dəyişdirilərsə imza uyğun gəlmir və
əməliyyat rədd edilir. Məqsəd sahəsi verify tokeninin unsubscribe üçün və ya
əksinə işlədilməsinin qarşısını alır.

## 2. Secret necə təyin edilir?

`.env` və Vercel Environment Variables daxilində minimum 32 simvolluq ayrıca
secret olmalıdır:

```env
SUBSCRIPTION_TOKEN_SECRET=uzun-ve-tesadufi-secret
SITE_URL=https://example.com
```

Secret yaratmaq üçün:

```bash
openssl rand -base64 48
```

Secret repoya commit edilməməlidir. Secret dəyişdirilsə əvvəl göndərilmiş
verify və unsubscribe linkləri etibarsız olacaq.

## 3. Token müddətləri

- Verify tokeni: 24 saat.
- Unsubscribe tokeni: 365 gün.

Verify linki qısaömürlüdür, çünki abunəliyi aktivləşdirir. Unsubscribe linki
uzunömürlüdür, çünki istifadəçinin email almağı dayandırmaq hüququ rahat
qalmalıdır.

## 4. Statusların mənası

### `isVerified`

Email sahibinin ünvanı təsdiqlədiyini göstərir. Unsubscribe zamanı dəyişmir.

### `isActive`

Hazırda email göndərilməsinə razılıq verilib-verilmədiyini göstərir.
Unsubscribe yalnız bunu `false` edir.

### `isDeleted`

Yalnız adminin soft-delete əməliyyatı üçündür. İstifadəçinin unsubscribe
əməliyyatı artıq bu sahəni dəyişmir.

Bu ayrım sayəsində unsubscribe edən istifadəçi admin cədvəlində deaktiv kimi
görünür və sonradan yenidən təsdiq linki ilə abunəliyini aktivləşdirə bilir.

`UnsubscribedDate` DB sütunu hazırda olmadığı üçün deaktivləşmə vaxtı
`LastUpdate` sahəsində saxlanılır. Ayrı tarix tələb olunarsa DB migration ilə
əlavə edilməlidir.

## 5. İstifadəçi axını

1. İstifadəçi email daxil edir.
2. Sistem 24 saatlıq imzalı verify linki göndərir.
3. `/verify-email` səhifəsində istifadəçi əməliyyatı təsdiqləyir.
4. `isVerified=true` və `isActive=true` edilir.
5. Məqalə emaillərinin sonunda `/unsubscribe?token=...` linki göstərilir.
6. İstifadəçi unsubscribe səhifəsində təsdiqlədikdə yalnız `isActive=false`
   edilir.
7. Yenidən abunə olmaq istədikdə yeni verify linki göndərilir.

Email-lərə standart `List-Unsubscribe` və `List-Unsubscribe-Post` header-ləri
də əlavə edilir. Dəstəkləyən email servisləri öz interfeysində bir kliklə
unsubscribe düyməsi göstərə bilər.

## 6. Endpoint-lər

- `POST /api/subscription` — abunə ol və verify emaili göndər.
- `POST /api/subscription/verify` — imzalı tokenlə təsdiqlə.
- `POST /api/subscription/unsubscribe` — imzalı tokenlə deaktiv et.
- `GET /api/subscription` — admin siyahısı.
- `DELETE /api/subscription/:id` — admin soft-delete.

## 7. Public formdan bazaya qədər texniki axın

### Addım 1 — form

`src/app/components/molecules/Subscription/Subscription.tsx` istifadəçinin
emailini qəbul edir. Düyməyə kliklənəndə React Query mutation işə düşür.
Düymə sorğu müddətində deaktiv olur və nəticə istifadəçiyə mətnlə göstərilir.

### Addım 2 — client API və hook

- `src/app/hooks/useSubs.ts` içindəki `useCreateSub`;
- `src/app/services/subs.api.ts` içindəki `createSub`;
- `POST /api/subscription`.

Email JSON body ilə serverə göndərilir:

```json
{ "email": "user@example.com" }
```

### Addım 3 — server validasiyası

API boş və string olmayan emaili `400` ilə rədd edir. Service emaili
`trim()` edir, kiçik hərfə çevirir və sadə email format yoxlaması aparır.
Beləliklə `User@Example.com` və ` user@example.com ` eyni ünvan kimi işlənir.

### Addım 4 — DB yazılışı

`src/services/subscription.service.ts` Sequelize `Subscription` modelindən
istifadə edir. Yeni email üçün `subscribes` cədvəlində bu vəziyyətdə sətir
yaranır:

- `isVerified=false`;
- `isActive=false`;
- `isDeleted=false`;
- `CreatedDate` və `LastUpdate` cari tarix.

Bu mərhələdə istifadəçi bazadadır, amma verify etmədiyi üçün notification
siyahısına daxil edilmir.

### Addım 5 — verify emaili

Yeni DB sətirinin ID-si ilə 24 saatlıq, HMAC imzalı verify tokeni yaradılır.
Emaildəki link `/verify-email?token=...` səhifəsinə aparır. İstifadəçi
təsdiq düyməsinə kliklədikdə `POST /api/subscription/verify` işləyir.

Token düzgün və vaxtı bitməmişdirsə:

- `isVerified=true`;
- `isActive=true`;
- `LastUpdate` yenilənir.

Yalnız bundan sonra istifadəçi
`getVerifiedSubscribers()` nəticəsinə daxil olur və məqalə emailləri alır.

### Addım 6 — unsubscribe

Məqalə emailində görünən unsubscribe linki
`/unsubscribe?token=...` səhifəsinə aparır. İstifadəçi təsdiqlədikdə
`POST /api/subscription/unsubscribe` çağırılır və:

- `isActive=false` edilir;
- `isVerified` dəyişmir;
- `isDeleted` dəyişmir;
- `LastUpdate` yenilənir.

Email provider dəstəkləyirsə `List-Unsubscribe` header-i vasitəsilə öz
interfeysində ayrıca unsubscribe düyməsi göstərə bilər.

### Addım 7 — yenidən abunəlik

Verified, amma inactive istifadəçi public formda emailini yenidən daxil
etdikdə reaktivasiya üçün yeni verify linki alır. Link təsdiqləndikdən sonra
`isActive=true` olur.

Admin tərəfindən soft-delete edilmiş email yenidən public formdan müraciət
etdikdə əvvəlki qeyd bərpa edilir, verify statusu sıfırlanır və email sahibi
yenidən təsdiq etməlidir.

## 8. Mövcud email müxtəlif hallarda necə davranır?

- Email bazada yoxdur: yeni pending qeyd yaradılır və verify emaili gedir.
- Email verified və active-dir: yeni qeyd yaranmır, “Artıq abunəsiniz”
  cavabı qaytarılır.
- Email verified, amma inactive-dir: reaktivasiya linki göndərilir.
- Email unverified-dir: yeni verify linki göndərilir.
- Email admin tərəfindən soft-delete edilib: qeyd pending vəziyyətində bərpa
  edilir və yeni verify linki göndərilir.

DB yazıldıqdan sonra mail serverində xəta olarsa qeyd bazada pending qalır,
API xəta qaytarır. İstifadəçi eyni emaili yenidən daxil etdikdə sistem həmin
qeydi tapıb verify emailini yenidən göndərməyə çalışır; dublikat yaratmır.

## 9. İşləməsi üçün tələb olunan konfiqurasiya

Local `.env` və Vercel Production Environment Variables daxilində bunlar
təyin edilməlidir:

```env
SITE_URL=https://example.com
SUBSCRIPTION_TOKEN_SECRET=minimum-32-simvolluq-tesadufi-secret
MAIL_HOST=smtp-provider-host
MAIL_PORT=465
MAIL_USER=sender@example.com
MAIL_PASS=mail-password
CRON_SECRET=minimum-32-simvolluq-tesadufi-secret
```

`SITE_URL` emaildə yaranan linklərin domenidir. Local testdə
`http://localhost:3000`, production-da real HTTPS domeni olmalıdır.

`SUBSCRIPTION_TOKEN_SECRET` local və production üçün ayrıca yaradıla bilər,
amma bir mühitdə secret dəyişdirilərsə həmin mühitdən əvvəl göndərilmiş bütün
subscription tokenləri etibarsız olur.

`CRON_SECRET` yalnız Vercel və ya icazəli scheduler-in recovery endpoint-i
çağıra bilməsi üçündür. Subscription token secret-dən ayrı saxlanılmalıdır.

## 10. Yeni məqalə notification axını

Admin `Yeni Məqalə` formunda “İstifadəçilərə bildiriş göndərilsin?” checkbox-u
seçir. Checkbox seçilməyibsə məqalə normal yaradılır və notification yaranmır.

Checkbox seçilibsə:

1. Məqalə və kateqoriya əlaqələri DB-də yaradılır.
2. `article_notifications` cədvəlinə `pending` statuslu qeyd əlavə edilir.
3. API məqalə cavabını gözlətmədən Next.js `after()` daxilində həmin
   notification-u emal etməyə başlayır.
4. Yalnız `isVerified=true`, `isActive=true`, `isDeleted=false` subscriber-lər
   seçilir.
5. Hər subscriber üçün görünən unsubscribe linki və email provider üçün
   `List-Unsubscribe` header-i yaradılır.
6. Email göndərişi uğurludursa notification `sent`, hamısı uğursuzdursa
   `failed` olur. Xəta mətni `error_message` sahəsində saxlanılır.

Əsas göndəriş `after()` ilə dərhal başladığı üçün normal halda cron intervalını
gözləmir. Çatdırılma SMTP providerindən asılı olaraq adətən bir neçə saniyə
çəkir.

`vercel.json` daxilində hər gün UTC 04:00-da recovery cron işləyir. Məqsədi
server prosesi yarımçıq qaldıqda DB-də `pending` qalmış notification-ları
yenidən emal etməkdir. Vercel Hobby planında dəqiqəlik cron icazəli olmadığı
üçün gündəlik fallback seçilib; Pro planında istənilərsə schedule dəqiqəlik
edilə bilər.

Cron endpoint:

```text
GET /api/cron/article-notifications
Authorization: Bearer <CRON_SECRET>
```

Secret uyğun deyilsə endpoint `401` qaytarır.

## 11. Manual test checklist

1. Public Footer-də yeni email daxil et.
2. UI-də “Email ünvanınıza təsdiq linki göndərildi” mesajını yoxla.
3. Admin `/admin/subscriptions` cədvəlində emailin
   “Təsdiqlənməyib / Deaktiv” olduğunu yoxla.
4. Email inbox-dakı verify linkini aç və təsdiq düyməsinə kliklə.
5. Admin cədvəlində statusların “Təsdiqlənib / Aktiv” olduğunu yoxla.
6. Notification emailindəki unsubscribe linkini aç və əməliyyatı təsdiqlə.
7. Admin cədvəlində `isVerified` statusunun qaldığını, aktivliyin isə
   “Deaktiv” olduğunu yoxla.
8. Eyni emaili public formda yenidən daxil et və reaktivasiya emailini yoxla.
9. Vaxtı bitmiş, dəyişdirilmiş və başqa məqsəd üçün yaradılmış tokenlərin
   `400` ilə rədd edildiyini yoxla.

10. Admin paneldə yeni məqalə yaradarkən notification checkbox-unu seç.
11. API nəticəsində `notificationQueued=true` olduğunu yoxla.
12. Emailin aktiv və təsdiqlənmiş subscriber-lərə gəldiyini yoxla.
13. `article_notifications` qeydinin `pending` statusundan `sent` statusuna
    keçdiyini yoxla.

## 12. Əsas fayllar

- `src/@lib/subscription-token.ts` — token yaratma və yoxlama.
- `src/services/subscription.service.ts` — biznes qaydaları və DB əməliyyatları.
- `src/services/email.service.ts` — email göndərişi və HTML template-lər.
- `src/services/articleNotification.service.ts` — notification və
  unsubscribe link/header yaradılması.
- `src/app/api/subscription/route.ts` — subscribe və admin list endpoint-i.
- `src/app/api/subscription/verify/route.ts` — verify endpoint-i.
- `src/app/api/subscription/unsubscribe/route.ts` — unsubscribe endpoint-i.
- `src/app/(public)/verify-email/page.tsx` — public verify səhifəsi.
- `src/app/(public)/unsubscribe/page.tsx` — public unsubscribe səhifəsi.
- `src/app/admin/subscriptions/page.tsx` — admin siyahısı və search.
- `src/app/api/cron/article-notifications/route.ts` — recovery cron endpoint-i.
- `vercel.json` — gündəlik recovery schedule.

## 13. Qalan təhlükəsizlik işi

Admin panel hazırda tokenin yalnız browser `localStorage`-də olub-olmadığını
yoxlayır. Bu real server-side authorization deyil. Admin siyahısı və delete
endpoint-ləri ayrıca server-side auth/role middleware ilə qorunmalıdır.
