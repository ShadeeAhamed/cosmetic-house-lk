#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-ap-southeast-1}"
INSTANCE_ID="${1:-i-01271d15294806bb7}"
PUBLIC_IP="${2:-52.74.89.82}"
SSH_USER="${SSH_USER:-ubuntu}"
KEY_PATH="${HOME}/.ssh/cosmetic-house-aws"

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

ssh -o StrictHostKeyChecking=no -i "$KEY_PATH" "${SSH_USER}@${PUBLIC_IP}" 'bash -s' <<'REMOTE'
set -euo pipefail

cd /opt/cosmetic-house-lk

echo "=== SERVER TIME ==="
date

echo
echo "=== GIT VERSION ==="
git --no-pager log -1 --oneline

echo
echo "=== TOKEN PLACEHOLDER CHECK ==="
if grep -Eq 'PASTE_VALID|put_|your_' .env.whatsapp; then
  echo "PLACEHOLDER_TOKENS_FOUND=true"
else
  echo "PLACEHOLDER_TOKENS_FOUND=false"
fi
grep -E '^(FACEBOOK_PAGE_ID|INSTAGRAM_BUSINESS_ACCOUNT_ID|FACEBOOK_DIRECT_API_ENABLED|BOT_NAME|BUSINESS_NAME)=' .env.whatsapp || true

echo
echo "=== TIMER STATUS ==="
systemctl --no-pager --full status cosmetic-house-social-publisher.timer | sed -n '1,18p' || true

echo
echo "=== PUBLISHER SERVICE STATUS ==="
systemctl --no-pager --full status cosmetic-house-social-publisher.service | sed -n '1,24p' || true

echo
echo "=== RECENT PUBLISHER LOGS ==="
journalctl -u cosmetic-house-social-publisher.service --since '48 hours ago' --no-pager -n 120 || true

echo
echo "=== PUBLISH HISTORY ==="
cat social-automation-data/publish-history.json 2>/dev/null || echo "No publish-history.json found"

echo
echo "=== DUE RUN DRY EXECUTION ==="
npm run publish:due-social || true

echo
echo "=== PUBLISH HISTORY AFTER RUN ==="
cat social-automation-data/publish-history.json 2>/dev/null || echo "No publish-history.json found"
REMOTE
