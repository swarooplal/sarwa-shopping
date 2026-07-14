#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# FORCE HARDCODED PATHS FOR SYSTEM, NVM NODE, AND PNM GLOBAL BINARIES
# This ensures "node", "git", "pnpm", and "pm2" are universally accessible
export PATH="/home/ubuntu/.nvm/versions/node/v24.14.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

echo "Navigate to the project directory..."
cd "/home/ubuntu/sarwa-shopping"

echo "Fetching latest changes from main..."
/usr/bin/git checkout main
/usr/bin/git fetch --all
/usr/bin/git reset --hard origin/main

echo "Installing dependencies..."
/home/ubuntu/.nvm/versions/node/v24.14.0/bin/pnpm install

echo "Restarting API/Main process..."
pm2 restart 0

echo "Stopping Storefront for build..."
pm2 stop 2

echo "Building Storefront..."
cd apps/storefront
/home/ubuntu/.nvm/versions/node/v24.14.0/bin/pnpm run build

echo "Restarting Storefront..."
pm2 restart 2

echo "Deployment completed successfully!"