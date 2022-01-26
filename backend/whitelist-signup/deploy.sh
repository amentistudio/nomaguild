#!/bin/bash

yarn --silent
echo "Stage: ${STAGE}"
# serverless deploy --config resources.yml -s "${STAGE}"
# serverless deploy --config triggers.yml -s "${STAGE}"

config=$(serverless info --config resources.yml --verbose)
echo $config | grep -o 'UserPoolId: [^\ ]*' | grep -o '[^\ ]*$' > .userpoolid
echo $config | grep -o 'UserPoolWebClient: [^\ ]*' | grep -o '[^\ ]*$' > .userpoolwebclient

echo "UserPoolId:" $(cat .userpoolid)
echo "UserPoolWebClient:" $(cat .userpoolwebclient)