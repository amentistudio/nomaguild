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
        '0x446275f01b7ae96ddf3548893790761edbcf18cc7f68bd03d7784be6f5eee126',
        '0x6266636a568b63486dc82203aeee30081e665e48c1cd54ca03331556b6a95c15',
        '0xf7fa1980e3f8a2e4a1dcc10fb33191b4c2ba790ea9ae230104ba60b146708cb0'
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