require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("hardhat-gas-reporter");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 100,
    showTimeSpent: true,
    coinmarketcap: "32e83307-40bb-4451-83de-cf3e661ee25c"
  },
};