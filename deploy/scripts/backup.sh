#!/bin/sh
# ─── Bexaltec · cópia de segurança da base ──────────────────────────────────
# pg_dump em formato custom (comprimido, repõe-se com pg_restore) para /backups.
# Ao domingo guarda também uma cópia semanal. Apaga as que passam da retenção.
#
# Correr à mão:  docker compose exec backup sh /scripts/backup.sh
# Repor:         ver DEPLOY.md, secção "Repor uma cópia".
#
# Esta cópia fica no próprio servidor. A cópia para fora do servidor
# (Storage Box) é a Fase 3 da migração.
set -eu

export PGHOST="${PGHOST:-db}" PGUSER="$POSTGRES_USER" PGDATABASE="$POSTGRES_DB" PGPASSWORD="$POSTGRES_PASSWORD"
DIR=/backups
mkdir -p "$DIR/daily" "$DIR/weekly"

stamp=$(date -u +%Y%m%d-%H%M)
out="$DIR/daily/bexaltec_${stamp}.dump"

pg_dump -Fc --no-owner --no-acl -f "$out.tmp"
mv "$out.tmp" "$out"
# Confirma que o ficheiro se lê (um dump truncado falha aqui, não no dia do desastre).
pg_restore --list "$out" > /dev/null
echo "$(date -u +%FT%TZ) cópia feita: $out ($(du -h "$out" | cut -f1))"

if [ "$(date -u +%u)" = "7" ]; then
  cp "$out" "$DIR/weekly/"
fi

find "$DIR/daily"  -name 'bexaltec_*.dump' -mtime +"${BACKUP_KEEP_DAYS:-14}" -delete
find "$DIR/weekly" -name 'bexaltec_*.dump' -mtime +"$(( ${BACKUP_KEEP_WEEKS:-8} * 7 ))" -delete
