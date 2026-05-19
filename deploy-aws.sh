#!/bin/bash
set -e

echo "========================================="
echo "  SARWA Shopping - AWS Deployment Script"
echo "========================================="
echo ""

# ---- USER INPUT ----
read -p "Enter your RDS PostgreSQL endpoint: " RDS_ENDPOINT
read -p "Enter your RDS database username: " RDS_USER
read -sp "Enter your RDS database password: " RDS_PASS
echo ""
read -p "Enter your domain name (or leave blank for IP): " DOMAIN_NAME
read -p "Enter your EC2 public IP: " EC2_IP

# Defaults
DOMAIN_NAME=${DOMAIN_NAME:-$EC2_IP}
STORE_CORS="https://$DOMAIN_NAME,http://$EC2_IP:8000"
ADMIN_CORS="http://$EC2_IP:9000,https://$DOMAIN_NAME"
AUTH_CORS="http://$EC2_IP:9000,https://$DOMAIN_NAME"
JWT_SECRET=$(openssl rand -hex 32)
COOKIE_SECRET=$(openssl rand -hex 32)
DATABASE_URL="postgresql://${RDS_USER}:${RDS_PASS}@${RDS_ENDPOINT}:5432/postgres?sslmode=require"

echo ""
echo "Installing system dependencies..."

# ---- SYSTEM SETUP ----
sudo apt update
sudo apt install -y nodejs npm postgresql-client nginx git certbot python3-certbot-nginx curl

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
sudo npm install -g pm2

echo ""
echo "Cloning repository..."

# ---- APP SETUP ----
cd /home/ubuntu
git clone https://github.com/swarooplal/sarwa-shopping.git 2>/dev/null || echo "Repo already exists, skipping clone"
cd sarwa-shopping

# ---- BACKEND ----
echo ""
echo "Setting up backend..."
cd apps/backend

cat > .env << EOF
DATABASE_URL=${DATABASE_URL}
STORE_CORS=${STORE_CORS}
ADMIN_CORS=${ADMIN_CORS}
AUTH_CORS=${AUTH_CORS}
JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}
NODE_ENV=production
EOF

npm install --legacy-peer-deps
npm run build

# ---- FRONTEND ----
echo ""
echo "Setting up storefront..."
cd ../storefront

cat > .env.local << EOF
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c059e90e55f21ffe15fccff07c844db16eee8e8a833a2b307aefc681bb5726ab
EOF

npm install --legacy-peer-deps
npm run build

# ---- PM2 ----
echo ""
echo "Starting services with PM2..."
cd /home/ubuntu/sarwa-shopping/apps/backend
pm2 start npm --name "sarwa-backend" -- start

cd /home/ubuntu/sarwa-shopping/apps/storefront
pm2 start npm --name "sarwa-storefront" -- start

pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# ---- NGINX ----
echo ""
echo "Configuring Nginx..."

sudo tee /etc/nginx/sites-available/sarwa > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /store/ {
        proxy_pass http://localhost:9000/store/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /admin/ {
        proxy_pass http://localhost:9000/admin/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /auth/ {
        proxy_pass http://localhost:9000/auth/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/sarwa /etc/nginx/sites-enabled/sarwa
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
echo ""
echo "Storefront: http://$DOMAIN_NAME"
echo "Admin Panel: http://$DOMAIN_NAME/admin/"
echo "API: http://$DOMAIN_NAME/store/"
echo ""
echo "PM2 Status:"
pm2 status
echo ""
echo "To enable HTTPS (after DNS points to this server):"
echo "  sudo certbot --nginx -d $DOMAIN_NAME"
echo ""
echo "Save these secrets for your records:"
echo "  JWT_SECRET: $JWT_SECRET"
echo "  COOKIE_SECRET: $COOKIE_SECRET"
echo ""
