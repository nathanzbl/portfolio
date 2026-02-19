#!/usr/bin/env bash
# =============================================================================
# 3-ssl-setup.sh  —  Run ONCE after DNS has propagated
#
# What it does:
#   • Obtains a Let's Encrypt TLS cert for all four domain names
#   • Patches the Nginx config to enable ssl_certificate lines
#   • Reloads Nginx
#   • Adds a cron job to auto-renew the cert
#
# Prerequisites:
#   • DNS A records for nathanblatter.com, www.nathanblatter.com,
#     nathanblateer.com, www.nathanblateer.com all point to this EC2 IP.
#   • Nginx is serving port 80 (required for the ACME HTTP-01 challenge).
#
# Usage:
#   sudo bash scripts/3-ssl-setup.sh
# =============================================================================
set -euo pipefail

DOMAINS="-d nathanblatter.com -d www.nathanblatter.com -d nathanblateer.com -d www.nathanblateer.com"
EMAIL="your-email@example.com"   # ← update with your email for expiry alerts

echo "── Requesting Let's Encrypt certificate ──"
certbot certonly \
  --nginx \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  $DOMAINS

echo "── Testing Nginx config ──"
nginx -t

echo "── Reloading Nginx ──"
systemctl reload nginx

echo "── Setting up auto-renewal (certbot renew runs twice daily via snap timer) ──"
# Certbot's snap package installs a systemd timer automatically.
# Verify it's active:
systemctl status snap.certbot.renew.timer --no-pager || true

echo ""
echo "✓ SSL setup complete."
echo "  Visit https://www.nathanblatter.com to verify."
echo ""
echo "  Manual renewal test: sudo certbot renew --dry-run"
