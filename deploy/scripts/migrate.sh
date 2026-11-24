#!/bin/sh
# ─── Bexaltec · migrações SQL ───────────────────────────────────────────────
# Aplica por ordem os ficheiros de /migrations (src/db/migrations) que ainda não
# constem da tabela schema_migrations. Cada ficheiro corre numa transacção:
# ou entra todo, ou não entra nada.
#
#   docker compose run --rm migrate              # aplicar as pendentes
#   docker compose run --rm migrate --status     # só listar
#   docker compose run --rm migrate --baseline   # marcar todas como aplicadas
#                                                # SEM as correr (base vinda do Neon)
set -eu

MODE="${1:-apply}"
export PGHOST="${PGHOST:-db}" PGUSER="$POSTGRES_USER" PGDATABASE="$POSTGRES_DB" PGPASSWORD="$POSTGRES_PASSWORD"
PSQL="psql -X -q -v ON_ERROR_STOP=1"

$PSQL -c "CREATE TABLE IF NOT EXISTS schema_migrations (
  filename   VARCHAR(200) PRIMARY KEY,
  applied_at TIMESTAMP    NOT NULL DEFAULT NOW()
)"

pending=0
for f in $(ls /migrations/*.sql | sort); do
  name=$(basename "$f")
  done_already=$($PSQL -tA -c "SELECT 1 FROM schema_migrations WHERE filename = '$name'")
  if [ "$done_already" = "1" ]; then
    [ "$MODE" = "--status" ] && echo "  aplicada  $name"
    continue
  fi
  pending=$((pending + 1))
  case "$MODE" in
    --status)
      echo "  PENDENTE  $name" ;;
    --baseline)
      $PSQL -c "INSERT INTO schema_migrations (filename) VALUES ('$name')"
      echo "  marcada   $name" ;;
    apply)
      echo "→ a aplicar $name"
      $PSQL -1 -f "$f" -c "INSERT INTO schema_migrations (filename) VALUES ('$name')"
      echo "  ok        $name" ;;
    *)
      echo "Opção desconhecida: $MODE" >&2; exit 2 ;;
  esac
done

[ "$pending" -eq 0 ] && echo "Sem migrações pendentes."
exit 0
