var NoMaGuild = artifacts.require("NoMaGuild");

module.exports = function(deployer) {
  deployer.deploy(NoMaGuild, 
    "NoMA", // _symbol
    "No Mummy Allowed Guild", // _name
    process.env.BASE_URI, //  _baseURI
    Buffer.from([process.env.MERKLE_TREE_ROOT]) // Merkle Root hash with - Metamask Account 1
  );
};
