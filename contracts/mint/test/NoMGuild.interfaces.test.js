const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const { expect } = require('chai');
const { shouldSupportInterfaces } = require('./utils/SupportsInterface.behavior');

describe("NoMaGuildInterfaces", () => {
  const contractFactory = async (supply = 8192, perwallet = 3) => {
    const NoMaGuildFactory = await ethers.getContractFactory('NoMaGuildTest');
    const contract = await NoMaGuildFactory.deploy(
      "NOMA", "NoMa", // Namimng
      supply, perwallet, // Limits (supply, perwallet)
      "baseURL", // URL for Metadata
      "hiddenURI",
    );
    await contract.deployed();
    return contract;
  }

  describe("supports interfaces", async () => {
    [ 
      'ERC2981',
      'ERC165',
      'ERC721',
      'ERC721Metadata'
    ].map(interface => {
      it(interface, async () => {
        shouldSupportInterfaces(
          await contractFactory(),
          [interface]
        );
      });
    })
  });


  describe("royalties support (aka ERC2981)", async () => {
    context("royaltyInfo()", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory();
      })

      it("should return 10% royalty rate", async () => {
        const price = await instance.PUBLIC_PRICE();
        const royalty_rate = await instance.ROYALTY_RATE();
        const royalty = price.mul(royalty_rate).div(100);
        const royaltyInfo = await instance.royaltyInfo(1, price);
        expect(royaltyInfo[1]).to.be.equal(royalty);
      });
    });
  });
});