require('dotenv').config();
const { ethers } = require("hardhat");

const { HIDDEN_URI } = process.env;

async function deploy() {
  const NoMaGuild = await ethers.getContractFactory("NoMaGuild");
  console.log("Deploying...");
  const contract = await NoMaGuild.deploy(
    "NoMAGuild", "No Mummy Allowed Guild", // Namimng
    8192, 3, // Limits (supply, perwallet)
    "", // URL for Metadata starts empty
    HIDDEN_URI // URL for hidden metadata
  );
  console.log("Waiting for 2 confirmations...");
  const receipt = await contract.deployTransaction.wait(1);
  console.log(`The hash of the transaction is ${receipt.transactionHash}`);
  console.log("contract address: ", contract.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error)
      process.exit(1)
  });