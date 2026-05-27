# Cosmetic House LK Production Backend Setup

This project is now prepared for a real cloud backend. The public storefront can
stay on GitHub Pages, while the private API runs on AWS/Render/Railway and stores
customers, orders, carts, wishlist items, product catalog, visits, and payment
status in Supabase.

## 1. Create Supabase Database

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase-schema.sql`.
4. Copy:
   - Project URL
   - Service role key

Keep the service role key private. Never paste it into frontend files.

## 2. Backend Environment

Add these to the private backend host environment:

```env
SITE_ORIGIN=https://cosmetichouse.com.lk
ADMIN_ORIGIN=https://cosmetichouse.com.lk
GITHUB_PAGES_ORIGIN=https://shadeeahamed.github.io
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-private-service-role-key
ADMIN_PIN=choose-a-private-admin-pin
RESEND_API_KEY=your-resend-api-key
OTP_FROM_EMAIL=Cosmetic House <verify@cosmetichouse.com.lk>
PAYHERE_MODE=sandbox
PAYHERE_MERCHANT_ID=your-payhere-id
PAYHERE_MERCHANT_SECRET=your-payhere-secret
PAYMENT_PUBLIC_URL=https://your-backend-domain.com
```

WhatsApp and Meta variables stay in `.env.whatsapp` or the host environment.

## 3. Connect Frontend to Backend

After the backend has a stable HTTPS URL, set this in `index.html` and
`admin.html`:

```html
window.COSMETIC_HOUSE_PAYMENT_API = "https://your-backend-domain.com";
```

Then customer signup/login, order submission, admin dashboard, visits, PayHere,
and OTP routes use the live cloud backend.

## 4. Required API Routes Already Included

The Node backend includes:

- `GET /health`
- `GET /api/products`
- `GET /api/cart`
- `PUT /api/cart`
- `GET /api/wishlist`
- `PUT /api/wishlist`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `GET /api/users`
- `PUT /api/users/profile`
- `POST /api/orders`
- `GET /api/orders`
- `PUT /api/orders/:id`
- `GET /api/customer/orders`
- `POST /api/payhere/checkout`
- `POST /payhere/notify`
- `GET/POST /webhook`

On startup, the backend also syncs the local product catalog into the Supabase
`products` table so KOKO/product-feed work can use the same source of truth.

## 5. Payment Readiness

PayHere can be switched from sandbox to live after merchant approval:

```env
PAYHERE_MODE=live
```

KOKO messaging is visible in product cards, product pages, cart, and checkout.
Final KOKO checkout activation depends on the merchant API/checkout credentials
provided by KOKO.

## 6. Security Notes

- Frontend must never contain service role keys.
- All admin APIs require `ADMIN_PIN` when it is configured.
- CORS is restricted to configured origins.
- Passwords are salted and hashed on the backend.
- OTP delivery uses Resend email or WhatsApp Cloud API if configured.
