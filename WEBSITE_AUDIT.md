# Cosmetic House LK Website Audit

Date: 2026-05-20

## High Priority

- Custom-domain HTTPS is still dependent on GitHub Pages certificate provisioning. Keep the site live and enable Enforce HTTPS in GitHub Pages when available.
- Real card payments are structurally prepared, but PayHere/WebxPay cannot go live until merchant verification, merchant ID, and merchant secret are available.
- Admin dashboard should use a strong `ADMIN_PIN` on AWS before public use.
- Product images should stay optimized and local. Avoid linking product images from external sites at runtime.

## Medium Priority

- Keep homepage conversion messaging focused on authenticity, islandwide delivery, COD/bank/card options, and WhatsApp help.
- Continue improving content quality for social proof with real customer reviews after orders increase.
- Add Koko/Mintpay only after official provider approval.
- Use consistent product photography style across new uploads.

## Low Priority

- Add Sinhala/Tamil helper microcopy for checkout and WhatsApp prompts.
- Add richer loyalty rewards once order volume is stable.
- Add blog/SEO content for Sri Lankan skincare keywords after the store is fully indexed.

## Changes Implemented

- Added premium trust and social-style homepage sections.
- Improved product cards with conversion labels such as Hot Selling, Trending, Daily Essential, and Customer Favorite.
- Improved product detail pages with gallery thumbnails, zoom behavior, trust badges, FAQ, delivery estimate, recently viewed products, sticky add-to-cart, and WhatsApp quick order.
- Added bank transfer proof upload field in checkout.
- Added order API support on the AWS bot server for website and manual orders.
- Added a private admin dashboard foundation at `admin.html` for order tracking, status updates, manual orders, invoices, WhatsApp updates, and sales stats.
- Added CORS support for admin/order API calls.

## Remaining Activation Steps

- Complete PayHere/WebxPay merchant approval.
- Add live gateway credentials to AWS environment.
- Set a strong `ADMIN_PIN` on AWS.
- Enable GitHub Pages Enforce HTTPS when the certificate is ready.
- Test a full live order after payment gateway approval.
