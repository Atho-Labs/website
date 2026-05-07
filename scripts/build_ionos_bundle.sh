#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
OUT_DIR="${1:-${SITE_ROOT}/ionos-upload}"
ZIP_PATH="${SITE_ROOT}/ionos-upload.zip"

if [[ "${OUT_DIR}" == "${SITE_ROOT}" ]]; then
  echo "[ionos] Refusing to write bundle into the site root." >&2
  exit 1
fi

rm -rf "${OUT_DIR}"
rm -f "${ZIP_PATH}"
mkdir -p "${OUT_DIR}"

rsync -a \
  --exclude=".git/" \
  --exclude=".github/" \
  --exclude="ionos-upload.zip" \
  --exclude=".DS_Store" \
  --exclude="__pycache__/" \
  --exclude="*.pyc" \
  --exclude=".gitignore" \
  --exclude="README.md" \
  --exclude="TODO.md" \
  --exclude="runweb.py" \
  --exclude="scripts/" \
  --exclude="ionos-upload/" \
  --exclude="assets/docs/" \
  "${SITE_ROOT}/" "${OUT_DIR}/"

(cd "${OUT_DIR}" && zip -qr "${ZIP_PATH}" .)

echo "[ionos] Bundle ready at: ${OUT_DIR}"
echo "[ionos] Zip ready at: ${ZIP_PATH}"
echo "[ionos] Upload the contents of this folder to your IONOS web root."
