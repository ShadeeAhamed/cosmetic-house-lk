# Cosmetic House LK Production Audit

Date: 2026-06-01

## Executive Summary

Cosmetic House LK is now visually closer to a premium Korean skincare storefront. The latest pass focused on the issues visible to customers: navigation wrapping, product-card clipping, KOKO installment alignment, and homepage scanability. The frontend can be used publicly, while the remaining production work is mainly payment activation, Shopify/Supabase backend decisions, and official KOKO API/feed onboarding.

## High Priority Fixes Implemented

- Kept the desktop navigation label `Beauty AI` on one line and tightened header spacing for medium desktop widths.
- Reworked product-card price and stock alignment so `Available` no longer clips beside the price.
- Reworked KOKO installment rows so the logo and `3 x LKR ... with KOKO` text remain readable on desktop and Android.
- Replaced generic product-card copy with smarter routine-based descriptions when a product has placeholder-style notes.
- Added premium routine-builder and ingredient-shopping sections for a stronger Korean skincare homepage flow.
- Kept the public payment language focused on KOKO installments.
- Confirmed `Show More Products` is clean and does not expose the remaining product count.

## UI/UX Audit Findings

### High Impact

- Product cards needed tighter card-body spacing and better text overflow handling. This was addressed with cleaner description logic and responsive card CSS.
- Header navigation was crowded at desktop widths around 1180-1340px. This was addressed with no-wrap links and compact header spacing.
- KOKO messaging was visually useful but too cramped on smaller cards. This was addressed with a full-width pill layout and responsive wrapping.

### Medium Impact

- Homepage was strong but needed clearer Korean skincare shopping logic. Added routine and ingredient sections to guide shoppers by goal.
- Reviews and loyalty/rewards sections should continue moving lower on the page so the shop remains the first conversion path.
- Category links should continue moving toward dedicated collection pages as the Shopify migration progresses.

### Low Impact

- Add Sinhala/Tamil helper microcopy after the main checkout and payment flows are stable.
- Add more real customer review images after order volume increases.

## SEO Status

- `robots.txt` points to `https://cosmetichouse.com.lk/sitemap.xml`.
- `sitemap.xml` uses final HTTPS URLs and should avoid redirected HTTP URLs.
- The site should use one canonical domain: `https://cosmetichouse.com.lk`.
- Google/Bing result snippets and logo images can take days or weeks to refresh after recrawling.

### SEO Fix Plan

1. Keep sitemap URLs as HTTPS final URLs only.
2. Keep canonical tags pointing to the final domain.
3. Submit the homepage, sitemap, category pages, and high-priority product pages in Google Search Console.
4. Add blog pages for high-intent Sri Lankan searches such as `The Ordinary Sri Lanka`, `Korean sunscreen Sri Lanka`, `niacinamide serum Sri Lanka`, and `CeraVe moisturizer Sri Lanka`.
5. Avoid visible keyword stuffing on the storefront. Keywords should stay in metadata, product copy, blog content, and structured data.

## KOKO Integration Plan

### Implemented Frontend

- KOKO logo displays near prices.
- Product cards and product detail pages show dynamic installment values.
- Cart summary can show installment messaging for the basket total.
- `koko-product-feed.json` is available as a future merchant feed foundation.

### Still Needed From KOKO

- Official merchant API documentation or feed upload requirements.
- Merchant ID/API key/webhook secret if KOKO supports direct API checkout.
- Final approved checkout flow or redirect flow.

### Recommended Flow

1. Keep the current installment display as product education.
2. Add official KOKO checkout once credentials and documentation are available.
3. Use webhook verification before marking any order as paid.
4. Sync product feed fields: SKU, title, price, category, image URL, product URL, stock status, and installment amount.

## Admin Dashboard And Backend Roadmap

### Current State

- Frontend order and account UI exists.
- Admin dashboard foundation exists.
- Some areas still depend on local/static behavior and should move to a live backend.

### Recommended Production Stack

- Storefront: Shopify or current static frontend with a backend API.
- Backend database: Shopify native backend if migrating, or Supabase/PostgreSQL if staying custom.
- Email: Resend or AWS SES after DNS verification.
- Payments: KOKO plus PayHere/WebxPay after merchant approvals.

### Admin Features To Finalize

- Live orders by status: Pending, Processing, Shipped, Delivered, Cancelled.
- Customer profiles, order history, and spending.
- Inventory, low-stock alerts, and out-of-stock alerts.
- Sales reports and best-seller analytics.
- New order, payment, and inventory notifications.

## Shopify Migration Plan

1. Export products, images, prices, SKUs, categories, stock, and product descriptions.
2. Import products into Shopify with clean collections.
3. Use Shopify customer and order exports for customer/account migration when ready.
4. Connect KOKO/PayHere through Shopify-compatible apps or custom payment instructions where supported.
5. Keep the current GitHub Pages site live until Shopify domain and payment flows are tested.

## Dropshipping Architecture

- Use Shopify as the main order source if dropshipping becomes the long-term workflow.
- Recommended apps: CJ Dropshipping, Zendrop, DSers/AliExpress, plus local supplier CSV imports.
- Keep SKU naming consistent by brand, category, and product size.
- Confirm supplier price and availability before accepting payment for products not held in stock.
- Use WhatsApp/order notes for manual confirmation until inventory syncing is reliable.

## Conversion Optimization

- Keep trust badges near checkout: authentic sourcing, islandwide delivery, COD, bank transfer, KOKO installments, secure checkout.
- Use quick add, wishlist, related products, and WhatsApp order support to reduce purchase friction.
- Keep delivery charge visible in cart summary rather than repeating it on every product card.
- Use TikTok/Instagram sections to bridge social visitors into product pages.

## Performance Recommendations

- Keep product images local and compressed.
- Continue lazy loading below-the-fold images.
- Avoid heavy animation libraries unless there is a clear need.
- Keep CSS animation lightweight and prefer transform/opacity.
- Run mobile PageSpeed after the next live deployment and optimize the largest images first.

## Priority Roadmap

### High

- Finalize KOKO credentials and official checkout method.
- Choose Shopify backend or Supabase custom backend as the single source of truth.
- Move orders/customers/cart from local behavior into the chosen live backend.
- Finish admin order status updates and notification flow.

### Medium

- Add dedicated collection pages for best sellers, Korean skincare, SPF, serums, cleansers, moisturizers, hair care, and makeup.
- Add blog content for high-intent Sri Lankan beauty searches.
- Add real customer review media and before/after content where compliant.

### Low

- Add Sinhala/Tamil helper text.
- Add loyalty/rewards only after order tracking and customer accounts are stable.
