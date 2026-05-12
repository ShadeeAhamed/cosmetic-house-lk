# Cosmetic House WhatsApp Business connection

This project is ready for WhatsApp Business automation, but Meta must approve and provide the live credentials before automatic replies can be sent inside WhatsApp.

## What is already connected

- Website buttons open WhatsApp directly to `+94 76 224 5570`.
- Product pages can send product-specific WhatsApp messages.
- Cart checkout can send an order summary to WhatsApp.
- `whatsapp-bot-server.mjs` can receive Meta WhatsApp Cloud API webhooks.
- The bot can reply with catalog-aware product suggestions, routine help, budget options, order prompts, and owner handoff messages.

## What you still need from Meta

1. Meta Business account.
2. WhatsApp Business Platform / Cloud API enabled.
3. A phone number connected to the WhatsApp Business API.
4. `WHATSAPP_PHONE_NUMBER_ID`.
5. A permanent `WHATSAPP_ACCESS_TOKEN`.
6. A public HTTPS webhook URL for this bot server.

## Local preview

Start the bot:

```bash
node whatsapp-bot-server.mjs
```

Check health:

```bash
curl http://localhost:8787/health
```

Preview a customer message:

```bash
curl -X POST http://localhost:8787/preview -H "Content-Type: application/json" -d "{\"message\":\"suggest cheap products for oily acne skin under 5000\"}"
```

## Live environment file

Create `.env.whatsapp` from `.env.whatsapp.example` and fill these:

```bash
PORT=8787
BUSINESS_NAME=Cosmetic House
BOT_NAME=Sophia
WHATSAPP_VERIFY_TOKEN=choose_a_private_verify_token
WHATSAPP_ACCESS_TOKEN=your_meta_permanent_access_token
WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_meta_whatsapp_business_account_id
OWNER_WHATSAPP_NUMBER=94762245570
GRAPH_API_VERSION=v20.0
```

For the current Cosmetic House setup:

```text
WHATSAPP_PHONE_NUMBER_ID=564398963429727
WHATSAPP_BUSINESS_ACCOUNT_ID=583792244811477
```

Check the live Meta status:

```bash
node check-whatsapp-status.mjs
```

If Meta shows `code_verification_status` as `NOT_VERIFIED`, request and verify the phone code first:

```bash
node request-whatsapp-code.mjs
```

Then add the received code to `.env.whatsapp`:

```env
WHATSAPP_VERIFICATION_CODE=123456
```

Run:

```bash
node verify-whatsapp-code.mjs
```

If Meta shows the phone number as `DISCONNECTED` or `Offline` after verification, set the six-digit registration PIN in `.env.whatsapp`:

```env
WHATSAPP_REGISTRATION_PIN=123456
```

Then run:

```bash
node register-whatsapp-number.mjs
node check-whatsapp-status.mjs
```

The number should change to `CONNECTED` before automatic replies can work.

## Meta webhook settings

Use this webhook URL after the bot is hosted on HTTPS:

```text
https://your-bot-domain.com/webhook
```

Use the same verify token as `WHATSAPP_VERIFY_TOKEN`.

Subscribe to the WhatsApp `messages` webhook event.

## Automation rules

The bot will automatically:

- introduce itself as Sophia from Cosmetic House,
- greet new customers warmly,
- suggest catalog products by product name, brand, concern, or budget,
- build simple morning/night skincare routines,
- ask for product name, quantity, city, and payment method for orders,
- remind that supplier price and availability must be confirmed before payment,
- hand off sensitive issues to the owner.

The bot will hand off to the owner when a customer mentions irritation, allergy, swelling, infection, pregnancy, refunds, complaints, damaged items, payment proof, order status, or asks for the owner.

## Important

Do not put the WhatsApp access token in `index.html` or `script.js`. Keep it only on the private server.
