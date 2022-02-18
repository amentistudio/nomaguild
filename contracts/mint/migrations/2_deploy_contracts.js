var NoMaGuild = artifacts.require("NoMaGuild");

module.exports = function(deployer) {
  console.log("Base URI: ", process.env.BASE_URI);
  console.log("Merkel Root Hash: ", process.env.MERKLE_TREE_ROOT);

  deployer.deploy(NoMaGuild, 
    "NoMAGuild", // _symbol
    "No Mummy Allowed Guild", // _name
    8192, // Max Total
    1000, // Max WL
    3, // Max per wallet
    process.env.BASE_URI, //  _baseURI
    Buffer.from([process.env.MERKLE_TREE_ROOT]) // Merkle Root hash with - Metamask Account 1
  );
};
