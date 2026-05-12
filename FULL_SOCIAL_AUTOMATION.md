# Cosmetic House full social automation

This project now has three automation layers:

1. `whatsapp-bot-server.mjs` - WhatsApp auto-replies through WhatsApp Cloud API.
2. `social-bot-server.mjs` - Facebook Messenger and Instagram DM auto-replies through Meta webhooks.
3. `social-automation-runner.mjs` - customer memory, reminder suggestions, peak-time tracking, and daily content kits.

## What Sophia can automate

- Reply to customer messages like a beauty assistant.
- Remember customer intent locally for follow-up suggestions.
- Suggest reminder messages based on past chat.
- Track inbound message times and estimate best posting windows.
- Prepare daily story, post, and reel ideas.
- Queue content drafts for owner review.

## What still needs Meta approval/live setup

Automatic public posting, reels, stories, Instagram DMs, and WhatsApp replies need live Meta permissions, valid tokens, and hosted HTTPS webhooks.

Do not send promotional reminders to customers unless they have messaged you recently or consented to follow-up. Keep order/payment reminders helpful and relevant.

## Local commands

Start Facebook/Instagram reply bot:

```bash
node social-bot-server.mjs
```

Start automation dashboard API:

```bash
node social-automation-runner.mjs
```

Preview daily content kit:

```bash
curl http://localhost:8789/automation/daily-kit
```

View peak times:

```bash
curl http://localhost:8789/automation/peak-times
```

View due reminders:

```bash
curl http://localhost:8789/automation/reminders/due
```

## Hosted webhook paths

Use these after the project is hosted on HTTPS:

```text
WhatsApp: https://your-bot-domain.com/webhook
Facebook/Instagram: https://your-bot-domain.com/meta-webhook
```

Verify token:

```text
cosmetic-house-sophia-2026
```

## Posting workflow

Recommended safe workflow:

1. Sophia generates the daily kit.
2. Owner approves product availability, price, and images.
3. Post/story/reel is published at the best time.
4. Comments and DMs are replied to automatically where Meta permits.
5. Sensitive issues are handed to owner.

Fully automatic posting can be added after:

- Facebook Page token is long-lived.
- Instagram account is linked to the Page.
- `pages_manage_posts` / publishing permissions are approved.
- Instagram content publishing and messaging permissions are approved, usually including `instagram_business_basic`, `instagram_business_manage_messages`, and `instagram_business_manage_comments`.
- For Meta's newer `Instagram API with Instagram Login`, generate the Instagram account token through `Instagram API > API setup with Instagram login > Add account`.
- Media assets are stored on a public HTTPS URL for Instagram publishing.
