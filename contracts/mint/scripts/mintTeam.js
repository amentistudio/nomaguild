require('dotenv').config();
const { ethers } = require("hardhat");

const { CONTRACT_ADDRESS } = process.env;
const TEAM_PUBLIC_KEYS = [
  "0x05c00ceF0F843000A6F8506a19fa4BEb591C519C", // Ladi
  "0xE74dEfAABCE98DA3F4c2CE60262aFd9C07b732Ee", // Jan
  "0x147b30371dD852C0AB0ca22593B5c61051400E44", // Simon
  "0x746DEdaf8902F28f4eAaB1c87466d8b989af9e20", // Marek
  "0x32dEDf3534E3a6e390Da23B54Be36218EB5575C2", // Jan (discofield)
  "0x73D6b2843228E334BcecaCc5081A3C40F5B5A81f", // David T.
  "0x436027d9D549d284d60c6edED61487317a69AEbF", // Tomas Q.
  "0x44A226e346BA1cb1662aDb8354C274B7426Ec145", // Kristyna
  "0xB218cF71b57c025e2709c3E660Ca08Fe53620e8A", // Lukas
];
const contractAbi = require("../artifacts/contracts/NoMaGuild.sol/NoMaGuild.json");

async function mintTeam() {
  const contract = await ethers.getContractAt(contractAbi.abi, CONTRACT_ADDRESS);
  for (const tkey of TEAM_PUBLIC_KEYS) {
    console.log("Address: ", tkey);
    const tx = await contract.giveawayMint(ethers.utils.getAddress(tkey), 1);
    console.log(`Minting for ${tkey} and waiting for receipt...`);
    const receipt = await tx.wait();
    console.log(`The hash of the transaction for ${tkey} is ${receipt.transactionHash}`);
  };
}

mintTeam()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });