# Cosmetic House AWS 24/7 Bot Hosting

Use this setup when you want the WhatsApp, Facebook, Instagram, and payment webhook bots to run all day without keeping the laptop on.

## What AWS Needs

Create one small EC2 server:

- Ubuntu 22.04 LTS
- Instance size: `t3.micro` or `t2.micro`
- Storage: 20 GB
- Security group inbound rules:
  - SSH `22` from your IP only
  - HTTP `80` from anywhere
  - HTTPS `443` from anywhere

Create an Elastic IP and attach it to the EC2 server.

## Domain DNS

Add a new DNS record in LK Domain Registry:

```text
Type: A
Name/Host: bot
Value: YOUR_AWS_ELASTIC_IP
```

The webhook domain will be:

```text
https://bot.cosmetichouse.com.lk
```

Keep the main website DNS as GitHub Pages. The bot subdomain can point to AWS separately.

## Upload Project

On the EC2 server:

```bash
sudo apt update
sudo apt install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo mkdir -p /opt/cosmetic-house-lk
sudo chown -R ubuntu:ubuntu /opt/cosmetic-house-lk
git clone https://github.com/ShadeeAhamed/cosmetic-house-lk.git /opt/cosmetic-house-lk
```

Create the private environment file:

```bash
nano /opt/cosmetic-house-lk/.env.whatsapp
```

Add your real private values:

```text
BUSINESS_NAME=Cosmetic House
BOT_NAME=Sophia
SITE_ORIGIN=https://cosmetichouse.com.lk

WHATSAPP_VERIFY_TOKEN=cosmetic-house-verify-token
WHATSAPP_ACCESS_TOKEN=PASTE_LONG_LIVED_OR_SYSTEM_USER_TOKEN
WHATSAPP_PHONE_NUMBER_ID=PASTE_PHONE_NUMBER_ID
WHATSAPP_BUSINESS_ACCOUNT_ID=PASTE_WABA_ID
OWNER_WHATSAPP_NUMBER=94762245570

META_VERIFY_TOKEN=cosmetic-house-sophia-2026
META_PAGE_ACCESS_TOKEN=PASTE_LONG_LIVED_OR_SYSTEM_USER_PAGE_TOKEN
FACEBOOK_PAGE_ID=100479986307153
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841457707598807
FACEBOOK_DIRECT_API_ENABLED=false

PAYHERE_MODE=sandbox
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
PAYMENT_PUBLIC_URL=https://bot.cosmetichouse.com.lk
```

Do not commit this file to GitHub.

## Install Services

From the project folder on EC2:

```bash
cd /opt/cosmetic-house-lk
sudo cp deploy/aws/cosmetic-house-whatsapp.service /etc/systemd/system/
sudo cp deploy/aws/cosmetic-house-social.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cosmetic-house-whatsapp cosmetic-house-social
sudo systemctl start cosmetic-house-whatsapp cosmetic-house-social
```

Check status:

```bash
sudo systemctl status cosmetic-house-whatsapp
sudo systemctl status cosmetic-house-social
```

## Configure HTTPS

Copy the nginx config:

```bash
sudo cp deploy/aws/cosmetic-house-bot-nginx.conf /etc/nginx/sites-available/cosmetic-house-bot
sudo ln -s /etc/nginx/sites-available/cosmetic-house-bot /etc/nginx/sites-enabled/cosmetic-house-bot
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d bot.cosmetichouse.com.lk
```

## Meta Webhook URLs

Use these in Meta:

WhatsApp:

```text
Callback URL: https://bot.cosmetichouse.com.lk/webhook
Verify token: cosmetic-house-verify-token
```

Facebook/Instagram:

```text
Callback URL: https://bot.cosmetichouse.com.lk/meta-webhook
Verify token: cosmetic-house-sophia-2026
```

PayHere notify URL:

```text
https://bot.cosmetichouse.com.lk/payhere/notify
```

## Update Bot Code Later

When we push new code to GitHub:

```bash
cd /opt/cosmetic-house-lk
git pull
sudo systemctl restart cosmetic-house-whatsapp cosmetic-house-social
```

## Important

The server keeps the bots online 24/7, but Meta tokens must still be valid. For real long-term automation, use Meta Business system-user or long-lived tokens instead of short Graph API Explorer tokens.
