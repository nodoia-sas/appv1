#!/bin/bash
# ================================================================
# deploy-s3.sh — Build estático + deploy a S3 + invalidar CloudFront
#
# Uso:
#   ./deploy-s3.sh
#
# Variables requeridas (exportar antes o definir aquí):
#   S3_BUCKET              Nombre del bucket  (ej: transitia-prod)
#   CF_DISTRIBUTION_ID     ID de distribución CloudFront (ej: EXXXXXXXXXX)
#   AWS_REGION             Región AWS         (default: us-east-1)
# ================================================================
set -euo pipefail

S3_BUCKET="${S3_BUCKET:?Falta S3_BUCKET}"
CF_DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:?Falta CF_DISTRIBUTION_ID}"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo "▶  Bucket S3:   s3://${S3_BUCKET}"
echo "▶  CloudFront:  ${CF_DISTRIBUTION_ID}"
echo "▶  Región:      ${AWS_REGION}"
echo ""

# ── 1. Build estático ─────────────────────────────────────────
echo "→ Generando build estático (npm run build)..."
npm run build
echo "✓ Build completado — carpeta: out/"
echo ""

# ── 2. Sync a S3 ─────────────────────────────────────────────
echo "→ Subiendo archivos a S3..."

# Archivos HTML: sin extensión en caché (CloudFront los sirve con Content-Type correcto)
aws s3 sync out/ "s3://${S3_BUCKET}" \
  --region "${AWS_REGION}" \
  --delete \
  --cache-control "no-cache" \
  --exclude "*" \
  --include "*.html"

# Assets estáticos: caché larga (JS/CSS tienen hash en nombre)
aws s3 sync out/ "s3://${S3_BUCKET}" \
  --region "${AWS_REGION}" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html"

echo "✓ Archivos sincronizados"
echo ""

# ── 3. Invalidar CloudFront ───────────────────────────────────
echo "→ Invalidando caché de CloudFront..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "${CF_DISTRIBUTION_ID}" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text \
  --region "${AWS_REGION}")

echo "✓ Invalidación creada: ${INVALIDATION_ID}"
echo ""
echo "Deploy completado. La distribución puede tardar ~5 min en propagarse."
