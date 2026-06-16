# Coolify Health Check — Ruang Tato

Aplikasi sudah memiliki endpoint health check di `GET /api/health` yang mengembalikan:

```json
{ "status": "ok", "timestamp": "...", "database": "connected" }
```

atau jika database tidak bisa dijangkau:

```json
{ "status": "degraded", "database": "unreachable", "databaseError": "..." }
```

---

## Cara Konfigurasi di Coolify

### 1. Buka Service Settings

Di Coolify dashboard → pilih service **ruangtato** → tab **Health Check**.

### 2. Isi Konfigurasi

| Field | Nilai |
|---|---|
| **Path** | `/api/health` |
| **Port** | `3000` |
| **Interval** | `30` detik |
| **Timeout** | `10` detik |
| **Retries** | `3` |
| **Start Period** | `60` detik (beri waktu Next.js cold start) |

### 3. Apa yang Terjadi

- Coolify akan ping `/api/health` setiap 30 detik
- Jika 3x berturut-turut gagal → container di-restart otomatis
- Log health check tersedia di Coolify → Logs → Events

---

## Cara Konfigurasi via `docker-compose.yml` (alternatif)

Jika deploy via Compose file di Coolify, tambahkan ke service `app`:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

---

## Verifikasi Manual

Dari server Coolify/Hostinger, jalankan:

```bash
curl -s http://localhost:3000/api/health | jq .
# Harus mengembalikan: { "status": "ok", "database": "connected" }
```
