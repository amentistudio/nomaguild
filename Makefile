SHELL = /bin/sh
ENV_FILE = .env

ifneq (,$(wildcard ./.env))
	include .env
	export
endif

cmd-exists-%:
	@hash $(*) > /dev/null 2>&1 || \
		(echo "ERROR: '$(*)' must be installed and available on your PATH."; exit 1)

.PHONY: deploy-whitelist-signup
deploy-whitelist-signup: cmd-exists-serverless cmd-exists-yarn
	cd backend/whitelist-signup && . deploy.sh && cd ../..
	scripts/dotenv -f ${ENV_FILE} set USER_POOL_ID="$(shell cat ./backend/whitelist-signup/.userpoolid)"
	scripts/dotenv -f ${ENV_FILE} set USER_POOL_WEB_CLIENT="$(shell cat ./backend/whitelist-signup/.userpoolwebclient)"

.PHONY: deploy-whitelist-verification
deploy-whitelist-verification: cmd-exists-serverless cmd-exists-yarn cmd-exists-aws
	cd backend/whitelist-verification && . deploy.sh && cd ../..
	scripts/dotenv -f ${ENV_FILE} set VERIFICATION_HTTP_API_URL="$(shell cat ./backend/whitelist-verification/.httpapiurl)"
	scripts/dotenv -f ${ENV_FILE} set MERKLE_TREE_ROOT="$(shell node ./scripts/merkletree.js ./backend/whitelist-verification/data/list.txt)"

.PHONY: deploy-mint-contract
deploy-mint-contract: cmd-exists-yarn
	cd contracts/mint && . deploy.sh && cd ../..
	cp contracts/mint/artifacts/contracts/NoMaGuild.sol/NoMaGuild.json web/src/contracts/NoMaGuild.json
	scripts/dotenv -f ${ENV_FILE} set CONTRACT_ADDRESS="$(shell cat ./contracts/mint/.address)"

.PHONY: open-public-mint-contract
open-public-mint-contract: cmd-exists-yarn
	cd contracts/mint && yarn hardhat run scripts/openPublicMint.js --network "${NETWORK}" && cd ../..

.PHONY: refund-until
refund-until: cmd-exists-yarn
	cd contracts/mint && yarn hardhat run scripts/refundUntil.js --network "${NETWORK}" && cd ../..

.PHONY: verify-mint-contract-rinkeby
verify-mint-contract-rinkeby: cmd-exists-yarn
	cd contracts/mint && yarn hardhat verify --constructor-args arguments.js ${CONTRACT_ADDRESS} --network rinkeby && cd ../..

.PHONY: test-contracts
test-contracts: cmd-exists-yarn
	cd contracts/mint && yarn hardhat test && cd ../..

.PHONY: test-contracts-ganache
test-contracts-ganache: cmd-exists-yarn
	cd contracts/mint && yarn hardhat --network ganache test && cd ../..

.PHONY: test-contracts-coverage
test-contracts-coverage: cmd-exists-yarn
	cd contracts/mint && yarn hardhat coverage && open coverage/index.html && cd ../..

.PHONY: test-contracts-slither
test-contracts-slither: cmd-exists-slither
	cd contracts/mint && slither . --solc-remaps "@openzeppelin/=node_modules/@openzeppelin/ erc721a/=node_modules/erc721a/" --exclude-dependencies --exclude-informational --compile-force-framework hardhat && cd ../..

.PHONY: test-contracts-vertigo
test-contracts-vertigo: cmd-exists-vertigo
	cd contracts/mint && vertigo run --hardhat-parallel 8 && cd ../..

.PHONY: console-dev
console-dev: cmd-exists-yarn
	cd contracts/mint && yarn hardhat console && cd ../..

.PHONY: console-rinkeby
console-rinkeby: cmd-exists-yarn
	cd contracts/mint && yarn hardhat console --network rinkeby && cd ../..

.PHONY: console-mainnet
console-mainnet: cmd-exists-yarn
	cd contracts/mint && yarn hardhat console --network mainnet && cd ../..

.PHONY: web-start
 web-start: cmd-exists-yarn
	cd web && yarn start && cd ../..

.PHONY: web-deploy
 web-deploy: cmd-exists-yarn
	cd web && ./deploy.sh && cd ../..