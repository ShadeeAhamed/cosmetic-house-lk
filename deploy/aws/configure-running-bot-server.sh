#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-ap-southeast-1}"
INSTANCE_ID="${1:-i-01271d15294806bb7}"
PUBLIC_IP="${2:-52.74.89.82}"
SSH_USER="${SSH_USER:-ubuntu}"
KEY_PATH="${HOME}/.ssh/cosmetic-house-aws"

echo "Preparing temporary SSH access for ${INSTANCE_ID}..."

mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"

if [[ ! -f "${KEY_PATH}" ]]; then
  ssh-keygen -t ed25519 -N "" -f "${KEY_PATH}" -C "cosmetic-house-cloudshell" >/dev/null
fi

AZ="$(aws ec2 describe-instances \
  --region "$REGION" \
  --instance-ids "$INSTANCE_ID" \
  --query 'Reservations[0].Instances[0].Placement.AvailabilityZone' \
  --output text)"

aws ec2-instance-connect send-ssh-public-key \
  --region "$REGION" \
  --instance-id "$INSTANCE_ID" \
  --availability-zone "$AZ" \
  --instance-os-user "$SSH_USER" \
  --ssh-public-key "file://${KEY_PATH}.pub" >/dev/null

echo "Installing publisher timer and refreshing bot code..."

ssh -o StrictHostKeyChecking=no -i "$KEY_PATH" "${SSH_USER}@${PUBLIC_IP}" 'bash -s' <<'REMOTE'
set -euo pipefail

cd /opt/cosmetic-house-lk
git pull

sudo cp deploy/aws/cosmetic-house-whatsapp.service /etc/systemd/system/
sudo cp deploy/aws/cosmetic-house-social.service /etc/systemd/system/
sudo cp deploy/aws/cosmetic-house-social-publisher.service /etc/systemd/system/
sudo cp deploy/aws/cosmetic-house-social-publisher.timer /etc/systemd/system/
sudo cp deploy/aws/cosmetic-house-bot-nginx.conf /etc/nginx/sites-available/cosmetic-house-bot
sudo ln -sf /etc/nginx/sites-available/cosmetic-house-bot /etc/nginx/sites-enabled/cosmetic-house-bot

sudo systemctl daemon-reload
sudo systemctl enable cosmetic-house-whatsapp cosmetic-house-social cosmetic-house-social-publisher.timer nginx
sudo systemctl restart nginx
sudo systemctl restart cosmetic-house-whatsapp cosmetic-house-social
sudo systemctl restart cosmetic-house-social-publisher.timer

sudo systemctl --no-pager --full status cosmetic-house-whatsapp | sed -n '1,12p'
sudo systemctl --no-pager --full status cosmetic-house-social | sed -n '1,12p'
sudo systemctl --no-pager --full status cosmetic-house-social-publisher.timer | sed -n '1,16p'
REMOTE

cat <<SUMMARY

AWS server refreshed.

Server IP: ${PUBLIC_IP}
WhatsApp health: http://${PUBLIC_IP}/health
Social health: http://${PUBLIC_IP}/social-health

Add DNS now:
Type: A
Name/Host: bot
Value: ${PUBLIC_IP}

After DNS points correctly, run HTTPS:
ssh -i ${KEY_PATH} ${SSH_USER}@${PUBLIC_IP}
sudo certbot --nginx -d bot.cosmetichouse.com.lk

SUMMARY
