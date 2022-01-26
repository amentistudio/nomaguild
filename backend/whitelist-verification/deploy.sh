#!/bin/bash

yarn --silent
echo "Stage: ${STAGE}"
# serverless deploy -s "${STAGE}"

config=$(serverless info --verbose)
echo $config | grep -o 'HttpApiUrl: [^\ ]*' | grep -o '[^\ ]*$' > .httpapiurl

echo "HttpApiUrl:" $(cat .httpapiurl)