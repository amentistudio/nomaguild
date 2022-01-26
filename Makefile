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
deploy-whitelist-signup: cmd-exists-serverless
	cd backend/whitelist-signup && . deploy.sh && cd ../..
	scripts/dotenv -f ${ENV_FILE} set USER_POOL_ID=$(shell cat ./backend/whitelist-signup/.userpoolid)
	scripts/dotenv -f ${ENV_FILE} set USER_POOL_WEB_CLIENT=$(shell cat ./backend/whitelist-signup/.userpoolwebclient)

.PHONY: deploy-whitelist-verification
deploy-whitelist-verification: cmd-exists-serverless
	cd backend/whitelist-verification && . deploy.sh && cd ../..
	scripts/dotenv -f ${ENV_FILE} set VERIFICATION_HTTP_API_URL=$(shell cat ./backend/whitelist-verification/.httpapiurl)