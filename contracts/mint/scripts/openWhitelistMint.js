require('dotenv').config();
const { ethers } = require("hardhat");

const { CONTRACT_ADDRESS } = process.env;
const contractAbi = require("../artifacts/contracts/NoMaGuild.sol/NoMaGuild.json");

async function openPublicMint() {
  const contract = await ethers.getContractAt(contractAbi.abi, CONTRACT_ADDRESS);
  const tx = await contract.setWhitelistSale(true);
  const receipt = await tx.wait();
  console.log(`The hash of the transaction is ${receipt.transactionHash}`);
}

openPublicMint()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error)
      process.exit(1)
  });