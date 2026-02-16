#!/bin/sh
set -e

ENV_JS="/usr/share/nginx/html/env.js"

# Verify env.js exists (generated during build from env-prod)
if [ ! -f "$ENV_JS" ]; then
  echo "[ERROR] env.js not found in /usr/share/nginx/html/"
  exit 1
fi

echo "[startup] Using production env.js"
cat "$ENV_JS"

envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
