#!/bin/bash

echo "🚀 Starting SQL Server..."
/opt/mssql/bin/sqlservr &

echo "⏳ Waiting for SQL Server to be ready..."
sleep 30

echo "📥 Running initialization script..."
if [ -f /opt/mssql-tools18/bin/sqlcmd ]; then
    /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P "YourStrong!Passw0rd" \
    -d master\
    -C \
    -i /usr/local/bin/init.sql
else
    echo "⚠️ sqlcmd not found — skipping DB init"
fi

wait
