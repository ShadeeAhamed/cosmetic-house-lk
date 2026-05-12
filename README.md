# Cosmetic House LK premium storefront

This is a publish-ready frontend draft for Cosmetic House LK.

## Included

- Premium responsive landing page
- Logo-matched black, white, and magenta premium theme
- Light and dark theme switcher
- Logo-matched black, white, and magenta visual system
- Product-specific image slots in `assets/products/`
- Product catalog with search and category filters
- Product pages opened by clicking the product image or product name
- Product pages with real-photo slots, description, benefits, best use, pairings, routine guidance, and a creative routine wheel
- Customer-facing product gallery with aligned product photos
- Full product catalog available through `catalog-data.js`, so products load even when the page is opened directly.
- Login screen preview for customer accounts
- Face image support beside the Beauty AI ask box.
- Separate Camera and Gallery/File controls for the Beauty AI uploader. Camera uses the browser camera with front-camera preference; Gallery/File opens phone gallery or computer file upload.
- Cart review with the delivery line shown only at checkout
- Cart recommendations so customers can add more routine-matching items after adding a product.
- Payment method choices: online card payment, cash on delivery, and bank transfer
- Frontend card fields for Visa, Mastercard, and Amex
- WhatsApp order handoff to +94 76 224 5570
- WhatsApp quick-chat buttons, floating chat button, product WhatsApp help, and checkout order handoff
- WhatsApp bot starter server in `whatsapp-bot-server.mjs` for Meta WhatsApp Cloud API webhooks
- Facebook Messenger and Instagram DM bot starter server in `social-bot-server.mjs`
- Full social automation layer in `social-automation-runner.mjs` for reminders, peak times, and daily content kits
- Cosmetic House Beauty AI section with catalog-trained local replies for product names, routines, brands, budget options, delivery, and payments.
- Contact details from the uploaded Facebook information

## Important before going live

0. Register the domain `cosmetichouse.lk` through an LK Domain Registry approved registrar, then point it to the hosting provider.
1. Connect a real payment gateway such as PayHere, WebXPay, Genie, Stripe, or another PCI-compliant merchant provider before accepting card payments. Do not process or store card details yourself.
2. Connect the Beauty AI and face upload to OpenAI through a private backend. Do not place an OpenAI API key inside browser JavaScript. Camera access requires HTTPS on the live domain or `localhost` during testing.
3. Connect login to secure authentication before saving customer data.
4. Replace demo products and prices with your confirmed supplier product list.
5. Use your own product photos or approved supplier images for exact branded items. Official product images should not be copied into a publishable website unless the brand, distributor, or supplier allows it.
6. Add final policies: delivery time, returns, exchanges, payment confirmation, image privacy, and customer data privacy.

## WhatsApp bot setup

The website now links customers directly to WhatsApp with pre-filled messages. The automatic reply bot needs WhatsApp Business API access before it can reply inside WhatsApp.

Files:

- `whatsapp-bot-server.mjs` - webhook server and catalog-based reply logic
- `check-whatsapp-status.mjs` - checks the connected Meta WhatsApp number status
- `request-whatsapp-code.mjs` - requests the phone verification code from Meta
- `verify-whatsapp-code.mjs` - verifies the code received on the WhatsApp number
- `register-whatsapp-number.mjs` - registers the real number if Meta shows it as disconnected/offline
- `.env.whatsapp.example` - required environment variables
- `whatsapp-automation-rules.json` - owner handoff and customer reply rules
- `WHATSAPP_BUSINESS_SETUP.md` - simple connection checklist
- `SOCIAL_CHANNELS_SETUP.md` - Facebook Messenger and Instagram DM connection checklist
- `FULL_SOCIAL_AUTOMATION.md` - full automation workflow, limits, and commands
- `check-instagram-login-status.mjs` - checks the newer Instagram API with Instagram Login token
- `META_BUSINESS_SUITE_WORKFLOW.md` - owner-approved workflow for posting to Facebook and Instagram together through Meta Business Suite
- `CANVA_POST_EDITING_GUIDE.md` - Canva template links and watermark rules for Cosmetic House post/story edits

Local preview:

```bash
node whatsapp-bot-server.mjs
```

Preview a reply:

```bash
curl -X POST http://localhost:8787/preview -H "Content-Type: application/json" -d "{\"message\":\"suggest cheap products for oily skin\"}"
```

Live connection steps:

1. Create or use a Meta Business account.
2. Enable WhatsApp Cloud API for the Cosmetic House.lk number.
3. Add `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and `WHATSAPP_VERIFY_TOKEN`.
4. Host the bot server on an HTTPS domain.
5. Set the webhook URL in Meta to `https://your-bot-domain.com/webhook`.
6. Keep owner confirmation in the workflow: supplier price and availability must be confirmed before payment.

The bot now introduces itself as Sophia from Cosmetic House and supports greeting, budget product suggestions, routine guidance, brand/product matching, order prompts, delivery/payment replies, image guidance, and owner handoff for sensitive cases such as irritation, complaints, refunds, damaged items, payment proof, or order-status requests.

## OpenAI assistant production idea

The current website includes the customer-facing assistant design and safe demo replies. A live version should send customer questions to your server, then your server calls OpenAI with rules such as:

- Answer only cosmetics, skincare, haircare, makeup, delivery, and payment questions.
- Never diagnose medical skin conditions.
- Recommend seeing a dermatologist for serious irritation, allergy, infection, or pregnancy-related concerns.
- Ask for skin type, concern, budget, and current routine before recommending products.
- If an image is uploaded, describe visible cosmetic concerns only, avoid identity recognition, and never make medical claims.

## Product photos

Product cards now look for approved real images inside `assets/products/`. If the image is not there, the site shows a clean real-photo slot instead of a broken image.

The larger catalog is stored in `catalog-data.json` and exported to `catalog-data.js`. Each product points to `assets/products/<product-handle>.jpg`, so approved supplier or official-brand photos can be added one by one without changing code.

Hero fast-moving image slots:

- `assets/products/hero-the-ordinary.jpg`
- `assets/products/hero-cerave.jpg`
- `assets/products/hero-rhode.jpg`
- `assets/products/hero-anua.jpg`

The internal image helper dialog remains in the code for owner use, but it is not shown in the public header.

## SEO terms added

The homepage now includes extra search coverage for:

- `cosmetichouse`
- `cosmetic house`
- `cosmetic house lk`
- `skincare Sri Lanka`
- `skin care Sri Lanka`
- `The Ordinary Sri Lanka`
- `ordinary niacinamide Sri Lanka`
- `The Ordinary Niacinamide 10% + Zinc 1%`
- common misspelling `niacidamide`

Use these filenames:

- `the-ordinary-niacinamide-10-zinc-1.jpg`
- `the-ordinary-hyaluronic-acid-2-b5.jpg`
- `cerave-moisturising-cream.jpg`
- `beauty-of-joseon-relief-sun-spf50.jpg`
- `maybelline-superstay-matte-ink.jpg`
- `maybelline-fit-me-foundation.jpg`
- `k18-leave-in-molecular-repair-mask.jpg`
- `cosrx-low-ph-good-morning-gel-cleanser.jpg`
- `luxury-body-wash-glow-gel.jpg`
- `daily-smooth-shampoo.jpg`
- `celimax-vita-a-retinol-shot-tightening-serum-15ml.jpg`
- `torriden-dive-in-hyaluronic-acid-soothing-cream-100ml.jpg`
- `medicube-pdrn-pink-peptide-serum.jpg`
- `laneige-water-sleeping-mask-70ml.jpg`
- `beauty-of-joseon-glow-serum-propolis-niacinamide.jpg`
- `skin1004-madagascar-centella-tone-brightening-capsule-ampoule.jpg`
- `la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50.jpg`
- `st-ives-hydrating-vitamin-e-avocado-body-lotion.jpg`
- `sol-de-janeiro-brazilian-bum-bum-cream-240ml.jpg`
- `cerave-sa-lotion-for-rough-bumpy-skin.jpg`

The website adds a small Cosmetic House seller badge in the product frame. It does not stamp the logo over the official product image, which is safer and more professional.

For Canva editing:

1. Edit approved product photos in Canva using the same black, white, and magenta Cosmetic House theme.
2. Export each approved image as JPG.
3. Save the exported file into `assets/products/` using the matching filename above.
4. The website will pick it up automatically.

## Research notes

Design ideas were informed by current patterns seen on Sri Lankan and global beauty stores:

- Sri Lankan stores: authenticity, islandwide delivery, secure payments, brand browsing, and help-first shopping.
- Global stores: strong search, sign-in, loyalty/account prompts, guided quizzes, AI help, category rails, and detailed product education.

The final design is custom to Cosmetic House LK and does not copy another store layout.

## Search setup for cosmetichouse.lk

The site now includes:

- Homepage title for `Cosmetic House LK`, `cosmetichouse.lk`, and cosmetics Sri Lanka.
- Meta description and keywords for common searches such as `cos`, `cosmeticc`, `cosmetichouse`, `cosmetic house lk`, and `online cosmetics Sri Lanka`.
- Canonical URL set to `https://cosmetichouse.lk/`.
- Open Graph and Twitter sharing tags.
- Local business structured data with phone, email, address, Instagram, and Sri Lanka service area.
- `robots.txt`.
- `sitemap.xml`.
- `site.webmanifest`.

After publishing:

1. Add the domain to Google Search Console.
2. Submit `https://cosmetichouse.lk/sitemap.xml`.
3. Connect Instagram and Facebook profiles to the same domain.
4. Keep the business name written consistently as `Cosmetic House LK` and `cosmetichouse.lk`.
5. Post useful product and routine pages regularly so Google has more real content to rank.
