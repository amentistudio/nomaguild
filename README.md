
## Release plan

------------- PHASE 1 (whitelist capture) 5 days (15.1.)
0) Set region (eu-central-1) and env (dev || prod) + clear all the important .env variables
1) Deploy backend/whitelist-signup
  - Input: environment to which to deploy (dev is default)
      - region: eu-central-1
      - yarn install
      - serverless deploy --config resources.yml -s ENV['STAGE']
      - serverless deploy --config triggers.yml -s ENV['STAGE']
  - Output: UserPoolId + UserPoolWebClient => save as .env variables for later use
2) Deploy website with working whitelist flow
  - Input: UserPoolId, UserPoolWebClient as .env variables

------------- PHASE 2 (whitelist mint) 5 days (22.2. - 27.2.)
3) After the whitelist is done we should set date after which the whitelisted address will not matter UserCreateDate <= fixed date time
  - Export list of addresses to data/list.txt
  - Deploy backend/whitelist-verification code
      - Input: data/list.txt
          - yarn install
          - serverless deploy
      - Output: Deployed code and also calculated merkletree root for contract and saved to .env
          - Allow to set new merkletree with ownerOnly public method so in case we make mistake
4) Deploy mint contract (backend/contracts/mint) with whitelist mint allowed (setWhitelistSale(true)) soldout or 1 week
  - Input: network id (eth main net)
      - truffle deploy --network (name from truffle.config.js)
  - Output:
      - Contract address => .env variable

------------- PHASE 3 (public mint) 5 days (27.2. - 3.3.)
5) Set public sale (setPublicSale(true) keep whitelist sale open) until it's sold out

------------- PHASE 4 (sold out or not => reveal) 2 days (5.3.)
6) Switch the contract to reveal the mummies with setBaseURI() to correct Pinanata URL where the collection is
  - Write code to ping all the mummies on OpenSea to refresh or ask the members to click refresh
