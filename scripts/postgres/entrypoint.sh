#!/bin/bash

# Start the default postgres entrypoint in background
/usr/local/bin/docker-entrypoint.sh postgres &

PID=$!

# On container shutdown, run backup
trap "echo '🛑 PostgreSQL shutting down, backing up...'; /usr/local/bin/backup.sh; kill $PID; wait $PID" SIGTERM

# Wait for postgres process to exit
wait $PID
