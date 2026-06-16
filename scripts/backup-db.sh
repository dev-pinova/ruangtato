#!/usr/bin/env bash
# =============================================================================
# backup-db.sh — Backup PostgreSQL (Docker) untuk Ruang Tato
#
# Penggunaan:
#   ./scripts/backup-db.sh
#
# Environment variables (bisa diset di shell atau .env):
#   POSTGRES_CONTAINER  — nama container Docker PostgreSQL (default: ruangtato-db)
#   POSTGRES_DB         — nama database (default: ruangtato)
#   POSTGRES_USER       — username (default: ruangtato)
#   BACKUP_DIR          — direktori output backup (default: ./backups)
#   BACKUP_RETAIN_DAYS  — berapa hari backup disimpan (default: 7)
#
# Setup cron (jalankan tiap malam pukul 02:00):
#   0 2 * * * /bin/bash /path/to/ruangtato/scripts/backup-db.sh >> /var/log/ruangtato-backup.log 2>&1
# =============================================================================

set -euo pipefail

POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-ruangtato-db}"
POSTGRES_DB="${POSTGRES_DB:-ruangtato}"
POSTGRES_USER="${POSTGRES_USER:-ruangtato}"
BACKUP_DIR="${BACKUP_DIR:-$(dirname "$0")/../backups}"
BACKUP_RETAIN_DAYS="${BACKUP_RETAIN_DAYS:-7}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ruangtato_${TIMESTAMP}.sql.gz"

# ---------------------------------------------------------------------------
# Pastikan direktori backup ada
# ---------------------------------------------------------------------------
mkdir -p "$BACKUP_DIR"

echo "[backup] $(date '+%Y-%m-%d %H:%M:%S') — Memulai backup database '${POSTGRES_DB}'..."

# ---------------------------------------------------------------------------
# Dump via pg_dump di dalam container, pipe langsung ke gzip
# ---------------------------------------------------------------------------
if ! docker exec "$POSTGRES_CONTAINER" \
    pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
    | gzip > "$BACKUP_FILE"; then
  echo "[backup] ERROR: Backup gagal. Periksa nama container dan kredensial." >&2
  exit 1
fi

BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "[backup] Sukses: ${BACKUP_FILE} (${BACKUP_SIZE})"

# ---------------------------------------------------------------------------
# Hapus backup lebih lama dari BACKUP_RETAIN_DAYS
# ---------------------------------------------------------------------------
DELETED=$(find "$BACKUP_DIR" -name "ruangtato_*.sql.gz" \
    -mtime +"$BACKUP_RETAIN_DAYS" -print -delete | wc -l)

if [ "$DELETED" -gt 0 ]; then
  echo "[backup] Dihapus ${DELETED} backup lama (>${BACKUP_RETAIN_DAYS} hari)"
fi

echo "[backup] Selesai."
