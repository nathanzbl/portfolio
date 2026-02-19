#!/usr/bin/env bash
# =============================================================================
# 2-app-setup.sh  —  Run ONCE after 1-server-setup.sh
#
# What it does:
#   • Clones the repo into /var/www/portfolio
#   • Creates the production .env from your answers (prompts for secrets)
#   • Installs all dependencies + builds server & client
#   • Runs database migrations
#   • Installs the Nginx config and does a soft reload
#   • Starts the server under PM2 and saves the process list
#
# Usage (run as ubuntu user, not root):
#   bash scripts/2-app-setup.sh
# =============================================================================
set -euo pipefail

APP_DIR="/var/www/portfolio"
REPO_URL="git@github.com:YOUR_GITHUB_USERNAME/Portfolio.git"  # ← update this

# ── Clone repo ─────────────────────────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  echo "Repo already cloned — skipping clone."
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

# ── Production .env ────────────────────────────────────────────────────────────
if [ -f ".env" ]; then
  echo ".env already exists — skipping creation."
else
  echo ""
  echo "── Creating production .env ──"

  read -rp "RDS host (e.g. mydb.xxxx.us-east-1.rds.amazonaws.com): " RDS_HOST
  read -rp "RDS port [5432]: "                                          RDS_PORT
  RDS_PORT="${RDS_PORT:-5432}"
  read -rp "RDS database name [portfolio_db]: "                         RDS_DB
  RDS_DB="${RDS_DB:-portfolio_db}"
  read -rp "RDS username: "                                             RDS_USER
  read -rsp "RDS password: "                                            RDS_PASS
  echo ""
  read -rsp "JWT secret (long random string): "                         JWT_SECRET
  echo ""
  read -rp "JWT expiry [7d]: "                                          JWT_EXP
  JWT_EXP="${JWT_EXP:-7d}"

  cat > .env <<EOF
PORT=3001
DATABASE_URL=postgresql://${RDS_USER}:${RDS_PASS}@${RDS_HOST}:${RDS_PORT}/${RDS_DB}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXP}
CLIENT_URL=https://www.nathanblatter.com
EOF
  chmod 600 .env
  echo ".env written."
fi

# ── Install + build server ─────────────────────────────────────────────────────
echo ""
echo "── Building server ──"
cd "$APP_DIR/server"
npm ci --omit=dev
npm run build          # tsc + cp migrations to dist/

# ── Run migrations ─────────────────────────────────────────────────────────────
echo "── Running migrations ──"
npm run migrate:prod

# ── Install + build client ─────────────────────────────────────────────────────
echo ""
echo "── Building client ──"
cd "$APP_DIR/client"
npm ci
npm run build          # Vite reads .env.production automatically

# ── Nginx config ───────────────────────────────────────────────────────────────
echo ""
echo "── Installing Nginx config ──"
sudo cp "$APP_DIR/nginx/nathanblatter.com.conf" \
        /etc/nginx/sites-available/nathanblatter.com
sudo ln -sf /etc/nginx/sites-available/nathanblatter.com \
            /etc/nginx/sites-enabled/nathanblatter.com
sudo rm -f /etc/nginx/sites-enabled/default   # remove placeholder

sudo nginx -t
sudo systemctl reload nginx
echo "Nginx reloaded."

# ── Start server with PM2 ──────────────────────────────────────────────────────
echo ""
echo "── Starting server with PM2 ──"
cd "$APP_DIR"
pm2 start ecosystem.config.cjs --env production
pm2 save
echo "PM2 process list:"
pm2 list

echo ""
echo "✓ App setup complete."
echo "  Make sure your DNS A records point to this server's IP, then run:"
echo "  bash scripts/3-ssl-setup.sh"
