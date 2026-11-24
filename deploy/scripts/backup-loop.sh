#!/bin/sh
# ─── Bexaltec · agenda das cópias ───────────────────────────────────────────
# Fica a correr no contentor "backup" e faz uma cópia por dia à hora
# BACKUP_TIME_UTC (HH:MM, UTC — Luanda é UTC+1). Uma falha não pára o ciclo.
set -u
TARGET="${BACKUP_TIME_UTC:-02:00}"
echo "Cópias diárias às $TARGET UTC."
last=""
while true; do
  now=$(date -u +%H:%M)
  today=$(date -u +%F)
  if [ "$now" = "$TARGET" ] && [ "$last" != "$today" ]; then
    sh /scripts/backup.sh || echo "$(date -u +%FT%TZ) ERRO: a cópia falhou" >&2
    last="$today"
  fi
  sleep 30
done
