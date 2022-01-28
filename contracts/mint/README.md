### Mint contract


```sh
npm intall -g truffle

truffle compile
truffle migrate --network ID (inside truffle-config.js)
```

Solidity tools:
```sh
pip3 install slither-analyzer
pip3 install solc-select
solc-select use 0.8.1
```

### Local blockchain

https://blockheroes.dev/test-smart-contracts-on-mainnet/

- Ganache (https://trufflesuite.com/ganache/)

- Metamask setup (https://dapp-world.com/blogs/01/how-to-connect-ganache-with-metamask-and-deploy-smart-contracts-on-remix-without-1619847868947)


```sh

# Truffle debugging
truffle develop --log

migrate --reset

truffle console
let cinstance;
NoMaClub.deployed().then((instance) => { cinstance = instance; });

let proof = ['0x47ced7e2503ebf284d4ac57cad2afbd44e07138655ca00b8460c4bc487a1cc71']
let address = '0xb99d1e85a8a220dbbde535f17aea3a89909cfd4e'
let root = '0x52bb5b1e07663deb785d8ef245bbdc9cfb84774d19071b6d4c1586a39a76581d'
cinstance.setPause(false)
cinstance.mint(proof, { from: address})
web3.eth.getAccounts();
```

### Deploy the contract to Mumbai - Polygon 2 testnet
```sh
truffle migrate --network mumbai
```

### Get whitelist
aws cognito-idp list-users --user-pool-id eu-central-1_Jrcnu0Nyl --limit 5 | grep -o '"Username": "[^"]*' | grep -o '[^"]*$'