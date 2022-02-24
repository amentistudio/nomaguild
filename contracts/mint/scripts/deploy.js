require('dotenv').config();
const { ethers } = require("hardhat");

const { BASE_URI, MERKLE_TREE_ROOT } = process.env;

async function deploy() {
  const NoMaGuild = await ethers.getContractFactory("NoMaGuild");
  console.log("Deploying...");
  const contract = await NoMaGuild.deploy(
    "NoMAGuild", "No Mummy Allowed Guild", // Namimng
    8192, 1024, 3, // Limits (supply, whitelist, perwallet)
    BASE_URI, // URL for Metadata
    HIDDEN_URI, // URL for hidden metadata
    ethers.utils.arrayify("0x" + MERKLE_TREE_ROOT)
  );
  console.log("Waiting for 2 confirmations...");
  const receipt = await contract.deployTransaction.wait(6);
  console.log(`The hash of the transaction is ${receipt.transactionHash}`);
  console.log("contract address: ", contract.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error)
      process.exit(1)
  });