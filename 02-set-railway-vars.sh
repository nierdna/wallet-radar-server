#!/bin/bash

# Declare array of environment variables
declare -A env_vars=(
    ["APP_ENV"]="develop"
    ["PORT"]="3000"
    ["CORS_ORIGIN"]=""
    ["JWT_SECRET_KEY"]="secret123"
    ["IS_ENABLE_DOCS"]="1"

    ["DB_DATABASE"]='${{Postgres.PGDATABASE}}'
    ["DB_USERNAME"]='${{Postgres.PGUSER}}'
    ["DB_PASSWORD"]='${{Postgres.PGPASSWORD}}'
    ["DB_HOST"]='${{Postgres.PGHOST}}'
    ["DB_PORT"]='${{Postgres.PGPORT}}'
    ["DB_SYNC"]="1"

    ["REDIS_HOST"]='${{Redis.REDISHOST}}'
    ["REDIS_PORT"]='${{Redis.REDISPORT}}'
    ["REDIS_DATABASE"]='1'
    ["REDIS_PASSWORD"]='${{Redis.REDISPASSWORD}}'
    ["REDIS_USERNAME"]='${{Redis.REDISUSER}}'
    ["REDIS_URL"]='${{Redis.REDIS_URL}}'
    ["REDIS_FAMILY"]='0'

    ['IS_WORKER']="1"
    ['IS_API']="1"
    ['IS_WEBSOCKET']="1"

    ["JWT_SECRET_KEY"]='63535f47553c4e419438b9ada648abe9'
    ["JWT_REFRESH_TOKEN_SECRET"]='123123123'
    ["JWT_ACCESS_TOKEN_LIFETIME"]='604800'
    ["JWT_REFRESH_TOKEN_LIFETIME"]='2592000'

    ["RPC_URL"]='https://sepolia.base.org'
    ["PRIVATE_KEY"]=''
    ["CONTRACT_ADDRESS"]=''
)

# Initialize empty command
command=""

# Build command from array
for key in "${!env_vars[@]}"; do
    value="${env_vars[$key]}"
    
    # Skip if value is empty
    if [[ -z "$value" ]]; then
        continue
    fi
    
    # Append to command
    if [[ -z "$command" ]]; then
        command="railway variables --set '$key=$value'"
    else
        command="$command --set '$key=$value'"
    fi
done

# Print and execute command
echo "Executing: $command"
echo "Press Enter to continue or Ctrl+C to cancel"
read

eval $command 

# Show all variables after setting them
echo -e "\nDisplaying all railway variables:"
railway variables