#!/usr/bin/env bash
# =============================================================================
# 1-server-setup.sh  —  Run ONCE on a fresh Ubuntu 22.04 / 24.04 EC2 instance
#
# What it does:
#   • Updates apt packages
#   • Installs Node.js 20, npm, git, nginx
#   • Installs PM2 globally
#   • Installs Certbot (Let's Encrypt)
#   • Creates the /var/www/portfolio app directory
#   • Configures the firewall (ufw)
#
# Usage:
#   chmod +x scripts/1-server-setup.sh
#   sudo bash scripts/1-server-setup.sh
# =============================================================================
set -euo pipefail

echo "──────────────────────────────────────────"
echo "  Portfolio — Server Bootstrap"
echo "──────────────────────────────────────────"

# ── System packages ────────────────────────────────────────────────────────────
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git nginx ufw

# ── Node.js 20 (via NodeSource) ───────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "Node $(node -v)  |  npm $(npm -v)"

# ── PM2 (process manager) ─────────────────────────────────────────────────────
npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu   # auto-start on reboot
echo "PM2 $(pm2 -v)"

# ── Certbot (Let's Encrypt) ───────────────────────────────────────────────────
apt-get install -y snapd
snap install core
snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# ── App directory ─────────────────────────────────────────────────────────────
APP_DIR="/var/www/portfolio"
mkdir -p "$APP_DIR"
chown ubuntu:ubuntu "$APP_DIR"
echo "App directory: $APP_DIR"

# ── Certbot webroot challenge dir ─────────────────────────────────────────────
mkdir -p /var/www/certbot
chown ubuntu:ubuntu /var/www/certbot

# ── Firewall ──────────────────────────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 'Nginx Full'   # ports 80 + 443
ufw --force enable
echo "Firewall status:"
ufw status

echo ""
echo "✓ Server setup complete."
echo "  Next: run scripts/2-app-setup.sh"
