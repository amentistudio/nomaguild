var NoMaClub = artifacts.require("NoMaClub");

module.exports = function(deployer) {
  deployer.deploy(NoMaClub, 
    "NoMa", // _symbol
    "No Mummy Allowed Club", // _name
    "http://localhost:3000/", //  _baseURI
    Buffer.from(["4aca71b5c2ace38cb93e148cd3e30a1e85453f451395d13e8d1f2cd253df26b9"]), // Merkle Root hash with - Metamask Account 1
    "0x05c00ceF0F843000A6F8506a19fa4BEb591C519C" // Creator's wallet address - Metamask Account 2
  );
};
