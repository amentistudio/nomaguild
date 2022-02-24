require('dotenv').config();
const { ethers } = require("hardhat");

const { CONTRACT_ADDRESS } = process.env;
const TEAM_PUBLIC_KEYS = [
  "0x05c00ceF0F843000A6F8506a19fa4BEb591C519C", // Ladi
  "0xA0e3c9200Ef38911C7395FB3ca600acbBF68827c"  // Jan
];
const contractAbi = require("../artifacts/contracts/NoMaGuild.sol/NoMaGuild.json");

async function mint() {
    const contract = await ethers.getContractAt(contractAbi.abi, CONTRACT_ADDRESS);
    TEAM_PUBLIC_KEYS.foreach(async (tkey) => {
      const tx = await contract.giveaway(tkey);
      console.log(`Minting for ${tkey} and waiting for receipt...`);
      const receipt = await tx.wait();
      console.log(`The hash of the transaction for ${tkey} is ${receipt.transactionHash}`);
    });
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });