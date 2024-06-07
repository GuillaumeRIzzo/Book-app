#!/bin/bash
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to start
sleep 30s

# Run the initialization script
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -d master -i /init.sql

# Wait to keep the container running
wait
