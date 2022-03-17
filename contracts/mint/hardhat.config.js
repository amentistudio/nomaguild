require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");

const {
  INFURA_PROJECT_ID,
  COINMARKETCAP_API_KEY,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  REPORT_GAS,
  NETWORK
} = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
let config = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    gasPrice: 100,
    showTimeSpent: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    // outputFile: "./gasReportTable.txt"
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      // see defaults
      // Defult addresses: https://hardhat.org/hardhat-network/reference/#initial-state
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};

if (NETWORK === "rinkeby" || NETWORK === "mainnet") {
  config["networks"][NETWORK] = {
    url: `https://${NETWORK}.infura.io/v3/${INFURA_PROJECT_ID}`,
    accounts: [`0x${PRIVATE_KEY}`]
  }
}

module.exports = config;