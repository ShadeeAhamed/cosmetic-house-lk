# Cosmetic House Shopify Connection

This site is ready to send customers into Shopify checkout, but it must stay off until the real Shopify store is created and the products are imported.

## What Shopify Will Handle

- Real order dashboard
- Card payments and payment status
- Product stock
- Refunds and cancellations
- Customer records
- Full order processing

The local `admin.html` dashboard stays simple for quick business signals: order counts, signup counts, page visits, Shopify checkout leads, and status snapshots.

## What You Need From Shopify

1. Create or open the Shopify store.
2. Import the Cosmetic House products into Shopify with the same prices and product images.
3. In Shopify, enable the Storefront API/headless access.
4. Copy the Storefront access token.
5. Copy your Shopify domain, for example:

```text
cosmetic-house-lk.myshopify.com
```

6. For each product, copy the Shopify product variant ID and add it to `shopify-config.js`.

## Where To Paste The Details

Open:

```text
C:\Users\U S E R\Documents\New project 6\shopify-config.js
```

Fill it like this:

```js
window.COSMETIC_HOUSE_SHOPIFY = {
  enabled: true,
  shopDomain: "cosmetic-house-lk.myshopify.com",
  storefrontAccessToken: "paste_storefront_token_here",
  apiVersion: "2026-04",
  fallbackShopUrl: "https://cosmetic-house-lk.myshopify.com",
  variantMap: {
    "the-ordinary-niacinamide-10-zinc-1": "gid://shopify/ProductVariant/1234567890",
  },
};
```

## Important Security Rule

Only paste the Shopify Storefront access token in this public website file. Do not paste Shopify Admin API tokens, private app secrets, PayHere merchant secrets, or bank credentials into the website files.

## How Checkout Works

When Shopify is enabled:

1. Customer adds products to cart on `cosmetichouse.com.lk`.
2. Customer fills delivery/contact details.
3. A local checkout lead is saved for the admin summary.
4. Shopify checkout opens securely.
5. Shopify handles payment and the final order.

If a product is missing a Shopify variant ID, checkout will stop and show a clear message so the product can be linked first.
