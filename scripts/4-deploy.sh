#!/usr/bin/env bash
# =============================================================================
# 4-deploy.sh  —  Run every time you push new code
#
# What it does:
#   1. git pull (latest from main branch)
#   2. Rebuild the server (tsc + copy migrations)
#   3. Run any new migrations
#   4. Rebuild the client (Vite)
#   5. Reload PM2 (zero-downtime restart)
#
# Usage (from any machine with SSH access, or directly on the server):
#   bash /var/www/portfolio/scripts/4-deploy.sh
#
# Or from your local machine:
#   ssh ubuntu@<EC2_IP> 'bash /var/www/portfolio/scripts/4-deploy.sh'
# =============================================================================
set -euo pipefail

APP_DIR="/var/www/portfolio"

echo "──────────────────────────────────────────"
echo "  Portfolio Deploy  —  $(date '+%Y-%m-%d %H:%M:%S')"
echo "──────────────────────────────────────────"

cd "$APP_DIR"

# ── Pull latest code ───────────────────────────────────────────────────────────
echo "[1/5] Pulling latest code..."
git pull origin main

# ── Rebuild server ─────────────────────────────────────────────────────────────
echo "[2/5] Building server..."
cd "$APP_DIR/server"
npm ci --omit=dev
npm run build          # tsc + copies SQL migrations to dist/db/

# ── Migrate database ───────────────────────────────────────────────────────────
echo "[3/5] Running migrations..."
npm run migrate:prod   # skips already-applied files automatically

# ── Rebuild client ─────────────────────────────────────────────────────────────
echo "[4/5] Building client..."
cd "$APP_DIR/client"
npm ci
npm run build          # outputs to client/dist/  (Nginx serves this)

# ── Reload server (zero-downtime) ─────────────────────────────────────────────
echo "[5/5] Reloading PM2..."
cd "$APP_DIR"
pm2 reload ecosystem.config.cjs --env production --update-env

echo ""
echo "✓ Deploy complete — $(date '+%H:%M:%S')"
pm2 list
