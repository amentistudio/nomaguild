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
deploy-mint-contract: cmd-exists-yarn cmd-exists-truffle
	cd contracts/mint && . deploy.sh && cd ../..
	cp contracts/mint/build/contracts/NoMaClub.json web/src/contracts/NoMaClub.json
	scripts/dotenv -f ${ENV_FILE} set CONTRACT_ADDRESS="$(shell cat ./contracts/mint/.address)"

.PHONY: truffle-console-dev
 truffle-console-dev: cmd-exists-truffle
	cd contracts/mint && truffle console && cd ../..

.PHONY: truffle-console-ropsten
 truffle-console-ropsten: cmd-exists-truffle
	cd contracts/mint && truffle console --network ropsten && cd ../..

.PHONY: truffle-console-mainnet
 truffle-console-mainnet: cmd-exists-truffle
	cd contracts/mint && truffle console --network mainnet && cd ../..

.PHONY: web-start
 web-start: cmd-exists-yarn
	cd web && yarn start && cd ../..