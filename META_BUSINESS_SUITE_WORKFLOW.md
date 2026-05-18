# Cosmetic House Meta Business Suite workflow

Use Meta Business Suite as the publishing control room while API permissions are still being completed.

Do not use Instagram's phone setting called "Sharing across profiles" while it points to a personal Facebook profile. That setting can publish to the owner's personal profile. Use Meta Business Suite instead, because it lets you explicitly select the Cosmetic House Facebook Page and the Cosmetic House Instagram account together.

## Why this is the best current path

- Your Facebook Page is connected.
- Your Instagram account is linked in the business tools UI.
- Meta Business Suite can publish/schedule to Facebook and Instagram together.
- Sophia can prepare captions, story ideas, reel ideas, DM replies, and reminder ideas for owner review.

## Daily publishing flow

1. Open Meta Business Suite:

```text
https://business.facebook.com/latest/home
```

2. Select the Cosmetic House business portfolio.

3. Go to:

```text
Planner
```

or:

```text
Content -> Create post
```

4. Select both channels:

```text
Facebook Page: Cosmetic House.lk
Instagram: @cosmetic_house.lk
```

5. Make sure the selected accounts show only:

```text
Cosmetic House.lk
cosmetic_house.lk
```

If you see a personal profile name, remove it before publishing.

6. Paste Sophia's daily caption.

7. Upload the approved product image/video.

8. Schedule at Sophia's suggested posting time.

9. Owner confirms product price and availability before accepting payments from responses.

## Recommended posting rhythm

- 1 feed post daily
- 1 story sequence daily
- 3-4 reels weekly
- Product spotlight every other day
- Routine education twice weekly
- Offer/price-check post only after supplier price and availability are confirmed

## Best early posting windows

Use these until Sophia has enough real chat data:

- 8:00 PM to 10:00 PM
- 12:00 PM to 2:00 PM
- Sunday evening

Sophia's peak-time tracker will improve this after real customer messages are captured through webhooks.

## What Sophia prepares

The daily automation creates:

- Facebook/Instagram caption
- story sequence
- reel idea
- comment replies
- DM reply prompts
- reminder message idea for warm leads
- suggested posting time

## Important limits

Meta Business Suite scheduling is still owner-approved. Fully automatic posting through code needs:

- approved publishing permissions
- long-lived tokens
- public HTTPS media URLs
- Instagram API access
- webhook hosting

Until those are complete, Business Suite is the safest publishing method.

## Current automation safety rule

The local scheduler will not directly post to Facebook unless this private environment value is deliberately enabled:

```text
FACEBOOK_DIRECT_API_ENABLED=true
```

Keep it disabled while Meta blocks the Facebook publishing permission. This prevents repeated Facebook API failures and keeps publishing away from any personal-profile cross-posting path.
