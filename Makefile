## CONFIG

SHELL = /bin/sh
ENV_FILE = .env.development

## UTILS

ifneq (,$(wildcard ./${ENV_FILE}))
	include ${ENV_FILE}
	export
endif

cmd-exists-%:
	@hash $(*) > /dev/null 2>&1 || \
		(echo "ERROR: '$(*)' must be installed and available on your PATH."; exit 1)

## DEV

.PHONY: hardhat-node
hardhat-node: cmd-exists-yarn
	cd contracts/mint && yarn hardhat node && cd ../..

# Tests
.PHONY: test-contracts
test-contracts: cmd-exists-yarn
	cd contracts/mint && yarn hardhat test && cd ../..

# Test coverage
.PHONY: test-contracts-coverage
test-contracts-coverage: cmd-exists-yarn
	cd contracts/mint && yarn hardhat coverage && open coverage/index.html && cd ../..

# Slither
.PHONY: test-contracts-slither
test-contracts-slither: cmd-exists-slither
	cd contracts/mint && slither . --solc-remaps "@openzeppelin/=node_modules/@openzeppelin/ erc721a/=node_modules/erc721a/" --exclude-dependencies --exclude-informational --compile-force-framework hardhat && cd ../..

# Vertigo
.PHONY: test-contracts-vertigo
test-contracts-vertigo: cmd-exists-vertigo
	cd contracts/mint && vertigo run --hardhat-parallel 8 && cd ../..

# Consoles
.PHONY: console-dev
console-dev: cmd-exists-yarn
	cd contracts/mint && yarn hardhat console --network ${NETWORK} && cd ../..

# Web local dev env.
.PHONY: web-start
 web-start: cmd-exists-yarn
	cd web && yarn start && cd ../..

# Web deploy
.PHONY: web-deploy
 web-deploy: cmd-exists-yarn
	cd web && ./deploy.sh && cd ../..

## PRODUCTION 

# Deploy mint contract
.PHONY: deploy-mint-contract
deploy-mint-contract: cmd-exists-yarn
	cd contracts/mint && . deploy.sh && cd ../..
	cp contracts/mint/artifacts/contracts/NoMaGuild.sol/NoMaGuild.json web/src/contracts/NoMaGuild.json
	scripts/dotenv -f ${ENV_FILE} set CONTRACT_ADDRESS="$(shell cat ./contracts/mint/.address)"

# Verify contract on Etherscan
.PHONY: verify-mint-contract
verify-mint-contract: cmd-exists-yarn
	cd contracts/mint && yarn hardhat compile && yarn hardhat verify --constructor-args arguments.js ${CONTRACT_ADDRESS} --network ${NETWORK} && cd ../..

# Open public sale
.PHONY: open-public-mint-contract
open-public-mint-contract: cmd-exists-yarn
	cd contracts/mint && yarn hardhat run scripts/openPublicMint.js --network "${NETWORK}" && cd ../..

# Mint as giveaway team mummies to their wallets (inside the script)
.PHONY: mint-team
mint-team: cmd-exists-yarn
	cd contracts/mint && yarn hardhat run scripts/mintTeam.js --network "${NETWORK}" && cd ../..

# Unset hidden URI
.PHONY: reveal
reveal: cmd-exists-yarn
	cd contracts/mint && yarn hardhat run scripts/reveal.js --network "${NETWORK}" && cd ../..


