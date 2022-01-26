#!/bin/bash

echo "Downloading whitelist and updating data/list.txt..."
aws cognito-idp list-users --user-pool-id ${USER_POOL_ID} | grep -o '"Username": "[^"]*' | grep -o '[^"]*$' > data/list.txt

yarn --silent
echo "Stage: ${STAGE}"
# serverless deploy -s "${STAGE}"

config=$(serverless info --verbose)
echo $config | grep -o 'HttpApiUrl: [^\ ]*' | grep -o '[^\ ]*$' > .httpapiurl

echo "HttpApiUrl:" $(cat .httpapiurl)