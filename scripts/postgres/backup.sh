#!/bin/bash

set -e

echo "🔄 Running PostgreSQL backup..."

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="/var/backups/strapi_backup_$TIMESTAMP.sql"

pg_dump -U strapi -d strapi -F c -f "$BACKUP_FILE"

echo "✅ Backup saved: $BACKUP_FILE"
