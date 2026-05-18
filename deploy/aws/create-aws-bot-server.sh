#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-ap-southeast-1}"
SERVER_NAME="cosmetic-house-bot-server"
SG_NAME="cosmetic-house-bot-sg"
AMI_ID="ami-0a56f8447277affd8"
INSTANCE_TYPE="t3.micro"

echo "Creating Cosmetic House bot server in ${REGION}..."

VPC_ID="$(aws ec2 describe-vpcs \
  --region "$REGION" \
  --filters Name=isDefault,Values=true \
  --query 'Vpcs[0].VpcId' \
  --output text)"

SUBNET_ID="$(aws ec2 describe-subnets \
  --region "$REGION" \
  --filters Name=vpc-id,Values="$VPC_ID" Name=default-for-az,Values=true \
  --query 'Subnets[0].SubnetId' \
  --output text)"

if [[ "$VPC_ID" == "None" || -z "$VPC_ID" || "$SUBNET_ID" == "None" || -z "$SUBNET_ID" ]]; then
  echo "Could not find a default VPC/subnet in ${REGION}."
  exit 1
fi

SG_ID="$(aws ec2 describe-security-groups \
  --region "$REGION" \
  --filters Name=group-name,Values="$SG_NAME" Name=vpc-id,Values="$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' \
  --output text 2>/dev/null || true)"

if [[ "$SG_ID" == "None" || -z "$SG_ID" ]]; then
  SG_ID="$(aws ec2 create-security-group \
    --region "$REGION" \
    --group-name "$SG_NAME" \
    --description "Cosmetic House bot webhooks" \
    --vpc-id "$VPC_ID" \
    --query 'GroupId' \
    --output text)"
fi

for PORT in 22 80 443; do
  aws ec2 authorize-security-group-ingress \
    --region "$REGION" \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port "$PORT" \
    --cidr 0.0.0.0/0 >/dev/null 2>&1 || true
done

USER_DATA_FILE="$(mktemp)"
cat > "$USER_DATA_FILE" <<'USERDATA'
#!/usr/bin/env bash
set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y git nginx curl certbot python3-certbot-nginx ca-certificates

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

mkdir -p /opt
rm -rf /opt/cosmetic-house-lk
git clone https://github.com/ShadeeAhamed/cosmetic-house-lk.git /opt/cosmetic-house-lk

cat > /opt/cosmetic-house-lk/.env.whatsapp <<'ENVFILE'
BUSINESS_NAME=Cosmetic House
BOT_NAME=Sophia
SITE_ORIGIN=https://cosmetichouse.com.lk
PAYMENT_PUBLIC_URL=https://bot.cosmetichouse.com.lk

WHATSAPP_VERIFY_TOKEN=cosmetic-house-verify-token
WHATSAPP_ACCESS_TOKEN=PASTE_VALID_META_TOKEN
WHATSAPP_PHONE_NUMBER_ID=PASTE_PHONE_NUMBER_ID
WHATSAPP_BUSINESS_ACCOUNT_ID=PASTE_WABA_ID
OWNER_WHATSAPP_NUMBER=94762245570

META_VERIFY_TOKEN=cosmetic-house-sophia-2026
META_PAGE_ACCESS_TOKEN=PASTE_VALID_PAGE_TOKEN
FACEBOOK_PAGE_ID=100479986307153
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841457707598807
FACEBOOK_DIRECT_API_ENABLED=false

PAYHERE_MODE=sandbox
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
ENVFILE

chown -R ubuntu:ubuntu /opt/cosmetic-house-lk

cp /opt/cosmetic-house-lk/deploy/aws/cosmetic-house-whatsapp.service /etc/systemd/system/
cp /opt/cosmetic-house-lk/deploy/aws/cosmetic-house-social.service /etc/systemd/system/
cp /opt/cosmetic-house-lk/deploy/aws/cosmetic-house-bot-nginx.conf /etc/nginx/sites-available/cosmetic-house-bot
ln -sf /etc/nginx/sites-available/cosmetic-house-bot /etc/nginx/sites-enabled/cosmetic-house-bot
rm -f /etc/nginx/sites-enabled/default

systemctl daemon-reload
systemctl enable cosmetic-house-whatsapp cosmetic-house-social nginx
systemctl restart nginx
systemctl restart cosmetic-house-whatsapp cosmetic-house-social
USERDATA

INSTANCE_ID="$(aws ec2 run-instances \
  --region "$REGION" \
  --image-id "$AMI_ID" \
  --instance-type "$INSTANCE_TYPE" \
  --network-interfaces "DeviceIndex=0,SubnetId=${SUBNET_ID},Groups=${SG_ID},AssociatePublicIpAddress=true" \
  --user-data "file://${USER_DATA_FILE}" \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${SERVER_NAME}}]" \
  --query 'Instances[0].InstanceId' \
  --output text)"

echo "Instance created: ${INSTANCE_ID}"
echo "Waiting until the instance is running..."
aws ec2 wait instance-running --region "$REGION" --instance-ids "$INSTANCE_ID"

ALLOC_ID="$(aws ec2 allocate-address \
  --region "$REGION" \
  --domain vpc \
  --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=${SERVER_NAME}-ip}]" \
  --query 'AllocationId' \
  --output text)"

aws ec2 associate-address \
  --region "$REGION" \
  --instance-id "$INSTANCE_ID" \
  --allocation-id "$ALLOC_ID" >/dev/null

PUBLIC_IP="$(aws ec2 describe-addresses \
  --region "$REGION" \
  --allocation-ids "$ALLOC_ID" \
  --query 'Addresses[0].PublicIp' \
  --output text)"

cat <<SUMMARY

Cosmetic House AWS bot server created.

Instance ID: ${INSTANCE_ID}
Elastic IP: ${PUBLIC_IP}
Security group: ${SG_ID}

Next DNS record in LK Domain Registry:
Type: A
Name/Host: bot
Value: ${PUBLIC_IP}

After DNS works, connect to the instance and run:
sudo certbot --nginx -d bot.cosmetichouse.com.lk

Then update /opt/cosmetic-house-lk/.env.whatsapp with valid long-lived Meta tokens:
sudo nano /opt/cosmetic-house-lk/.env.whatsapp
sudo systemctl restart cosmetic-house-whatsapp cosmetic-house-social

Permanent URLs:
WhatsApp webhook: https://bot.cosmetichouse.com.lk/webhook
Facebook/Instagram webhook: https://bot.cosmetichouse.com.lk/meta-webhook
PayHere notify URL: https://bot.cosmetichouse.com.lk/payhere/notify

SUMMARY
