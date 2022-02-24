require("dotenv").config();
const { ethers } = require("hardhat");

const { BASE_URI, MERKLE_TREE_ROOT } = process.env;

module.exports = [
  "NoMAGuild", "No Mummy Allowed Guild", // Namimng
  8192, 1024, 3, // Limits (supply, whitelist, perwallet)
  BASE_URI, // URL for Metadata
  ethers.utils.arrayify("0x" + MERKLE_TREE_ROOT)
];