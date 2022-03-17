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
  REPORT_GAS
} = process.env;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "hardhat",
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    gasPrice: 100,
    showTimeSpent: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    // outputFile: "./gasReportTable.txt"
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        '0x2821f32dc2dd3f5d49a5bddf82dfc996f311ed87d2c547e25943a16a17a05b59',
        '0x849e23ad0245797e44726d7ef0b50ab9c073f2512ba061ef3d09f4877c4e43ff',
        '0xf629a675480b3c639a93dead3fb1ab43c7f62cff76b2da2e6990b3a5ff65fd35'
      ]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};