#!/bin/bash

yarn --silent
echo "Compiling contracts..."
truffle compile
echo "Deploying to network: ${NETWORK}"
truffle migrate --network "${NETWORK}" --reset > .deploy
cat .deploy | grep '> contract address: *' | tail -n 1 | grep -o '0x[^\ ]*' > .address

echo "Address:" $(cat .address)