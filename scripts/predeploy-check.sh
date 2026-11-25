#!/usr/bin/env sh
set -eu

echo "=== Pre-deploy Check ==="
ERRORS=0

# 1. Determine active config file from src/config/active.config.ts
ACTIVE_TARGET=$(grep -E "from '\./" src/config/active.config.ts | head -n 1 | sed -E "s/.*'\.\/([^']+)'.*/\1/")
CONFIG_FILE="src/config/${ACTIVE_TARGET}.ts"
echo "Active config: ${CONFIG_FILE}"

if [ -f "$CONFIG_FILE" ]; then
  if grep -q "TODO" "$CONFIG_FILE"; then
    echo "[FAIL] Masih ada penanda TODO di ${CONFIG_FILE}"
    ERRORS=$((ERRORS + 1))
  else
    echo "[OK] Tidak ada TODO di ${CONFIG_FILE}"
  fi
else
  echo "[FAIL] File konfigurasi aktif tidak ditemukan: ${CONFIG_FILE}"
  ERRORS=$((ERRORS + 1))
fi

# 2. Check dist/ for leaked server secret names
if [ -d "dist" ]; then
  if grep -rnE "TIKTOK_ACCESS_TOKEN|MIDTRANS_SERVER_KEY|XENDIT_SECRET_KEY|XENDIT_CALLBACK_TOKEN|LEAD_WEBHOOK_URL" dist >/dev/null 2>&1; then
    echo "[FAIL] Terdeteksi potensi kebocoran nama kunci rahasia di dist/"
    ERRORS=$((ERRORS + 1))
  else
    echo "[OK] Tidak ada kunci rahasia di dist/"
  fi
else
  echo "[WARN] Folder dist/ belum ada. Jalankan npm run build terlebih dahulu."
fi

# 3. Check images in public/images/ (>200 KB or non-WebP/AVIF)
if [ -d "public/images" ]; then
  for img in public/images/*; do
    [ -e "$img" ] || continue
    size=$(wc -c < "$img")
    if [ "$size" -gt 204800 ]; then
      echo "[FAIL] Ukuran gambar > 200 KB (${size} bytes): $img"
      ERRORS=$((ERRORS + 1))
    fi
    case "$img" in
      *.webp|*.avif) ;;
      */demo-*.svg)
        echo "[INFO] Placeholder demo SVG diizinkan: $img"
        ;;
      *)
        echo "[FAIL] Format gambar bukan WebP/AVIF: $img"
        ERRORS=$((ERRORS + 1))
        ;;
    esac
  done
  echo "[OK] Pemeriksaan gambar public/images/ selesai"
fi

if [ "$ERRORS" -gt 0 ]; then
  echo "=== Pre-deploy Check GAGAL (${ERRORS} masalah) ==="
  exit 1
fi

echo "=== Pre-deploy Check LULUS ==="
