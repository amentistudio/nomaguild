require('dotenv').config();
const { ethers } = require("hardhat");

const { CONTRACT_ADDRESS, BASE_URI } = process.env;
const contractAbi = require("../artifacts/contracts/NoMaGuild.sol/NoMaGuild.json");

async function reveal() {
  const contract = await ethers.getContractAt(contractAbi.abi, CONTRACT_ADDRESS);
  const txh = await contract.setHiddenURI("");
  const receipth = await txh.wait();
  console.log(`The hash of the transaction is ${receipth.transactionHash}`);
  const txb = await contract.setBaseURI(BASE_URI);
  const receiptb = await txb.wait();
  console.log(`The hash of the transaction is ${receiptb.transactionHash}`);
}

reveal()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error)
      process.exit(1)
  });