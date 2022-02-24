#!/bin/bash

yarn --silent
echo "Compiling contracts..."
yarn hardhat compile
echo "Deploying to network: ${NETWORK}"
yarn hardhat run scripts/deploy.js --network "${NETWORK}" > .deploy.${NETWORK}
rm .address
cat .deploy.${NETWORK} | grep 'contract address: *' | tail -n 1 | grep -o '0x[^\ ]*' > .address

echo "Contract address:" $(cat .address)