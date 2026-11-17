# Cosmetic House Shopify Connection

## Current live setup

The storefront's current configuration points to:

- Shopify store: `cosmetic-house-5.myshopify.com`
- Shopify checkout: enabled in `shopify-config.js`
- Product variant mapping: 338 Shopify variant entries are configured.

Do not replace these values with the older example store name in previous setup notes.

## How checkout works

1. A customer adds products on `https://cosmetichouse.com.lk`.
2. The customer enters contact and delivery details in the Cosmetic House cart.
3. The website records a **checkout-start lead** in its own dashboard.
4. The customer is redirected to secure Shopify checkout.
5. Shopify creates the actual order only after the customer completes checkout.

A checkout-start lead is not a completed order. If a customer abandons Shopify checkout, it should not be treated as a confirmed sale.

## Where to see completed orders

Open [Shopify Orders](https://admin.shopify.com/store/cosmetic-house-5/orders) or sign in to the Shopify app on your phone.

Shopify is the source of truth for completed orders, payment status, refunds, fulfilment, and customer order details. The Cosmetic House `admin.html` dashboard shows checkout starts, custom/manual orders, customer signups, and website visits; it does not currently import completed Shopify orders.

## Turn on new-order phone alerts (Android)

1. Install the official Shopify app and sign in to the account for `cosmetic-house-5.myshopify.com`.
2. In the app, open **Menu → Settings → Store notifications**.
3. Open **Push notifications**.
4. Turn on **New orders**.
5. Allow notifications for Shopify in Android Settings → Apps → Shopify → Notifications.

Shopify's app can send push notifications for new orders. Device-level notifications must also be enabled.

## WhatsApp alerts

The custom backend can send WhatsApp alerts for orders submitted directly to its `/api/orders` route. This requires valid Meta WhatsApp Cloud API credentials in the private backend environment:

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `OWNER_WHATSAPP_NUMBER`

Shopify checkout-start leads are deliberately excluded from that alert so an abandoned checkout is not reported as a new sale. For completed Shopify orders, use Shopify's own new-order push notifications.

## Security

- The Storefront API token in `shopify-config.js` is a public storefront token and must only have Storefront API access.
- Never place Shopify Admin API tokens, app client secrets, PayHere secrets, Supabase service-role keys, or the admin PIN in frontend files or public GitHub.
