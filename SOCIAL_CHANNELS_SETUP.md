# Cosmetic House Facebook and Instagram connection

Sophia can also reply to Facebook Messenger and Instagram DMs, but Meta requires a Page access token and webhook setup.

## Files added

- `social-bot-server.mjs` - Facebook/Instagram webhook and reply bot
- `check-social-status.mjs` - checks which Pages and Instagram accounts the token can see

## Required values

Add these to `.env.whatsapp` after you get them from Meta:

```env
SOCIAL_BOT_PORT=8788
META_VERIFY_TOKEN=cosmetic-house-sophia-2026
FACEBOOK_PAGE_ID=your_facebook_page_id
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
META_PAGE_ACCESS_TOKEN=your_page_access_token
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_login_access_token
```

## New Instagram API with Instagram Login

If your Meta dashboard shows `API setup with Instagram login`, use that flow for Instagram:

1. In `Instagram API > API setup with Instagram login`, click `Add account`.
2. Log in as `@cosmetic_house.lk` and approve access.
3. Click `Generate token` for the added Instagram account.
4. Copy the token into `.env.whatsapp`:

```env
INSTAGRAM_ACCESS_TOKEN=the_generated_instagram_token
```

5. Test it:

```bash
node check-instagram-login-status.mjs
```

For this newer flow, Meta lists permissions as:

- `instagram_business_basic`
- `instagram_business_manage_messages`
- `instagram_business_manage_comments`
- `instagram_business_content_publish` if publishing is needed

## How to get them

1. In Meta Business Settings, make sure the Facebook Page is added to the Cosmetic House business portfolio.
2. Connect the Instagram account to that Facebook Page.
3. Go to the Meta app dashboard for `Cosmetic House`.
4. Add or configure these products/use cases:
   - Messenger API
   - Instagram messaging
   - Webhooks
5. Generate a Page access token with permissions such as:
   - `pages_messaging`
   - `pages_manage_metadata`
   - `pages_show_list`
   - `pages_read_engagement`
   - `instagram_basic` or the newer `instagram_business_basic`
   - `instagram_manage_messages` or the newer `instagram_business_manage_messages`
   - `instagram_business_manage_comments` if you want comment automation
6. Run:

```bash
node check-social-status.mjs
```

The token should show your Facebook Page and linked Instagram account.

## Webhook

When hosted on HTTPS, add this callback URL in Meta:

```text
https://your-bot-domain.com/meta-webhook
```

Verify token:

```text
cosmetic-house-sophia-2026
```

Subscribe to Page/Messenger and Instagram messaging events.

## Local testing

```bash
node social-bot-server.mjs
curl http://localhost:8788/health
curl -X POST http://localhost:8788/preview -H "Content-Type: application/json" -d "{\"message\":\"hi suggest routine for oily skin\"}"
```
