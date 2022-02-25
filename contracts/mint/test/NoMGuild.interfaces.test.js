const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const { expect } = require('chai');
const { shouldSupportInterfaces } = require('./utils/SupportsInterface.behavior');

describe("NoMaGuildInterfaces", () => {
  const contractFactory = async (root, supply = 8192, whitelist = 3000, perwallet = 3) => {
    const NoMaGuildFactory = await ethers.getContractFactory('NoMaGuildTest');
    const contract = await NoMaGuildFactory.deploy(
      "NOMA", "NoMa", // Namimng
      supply, whitelist, perwallet, // Limits (supply, whitelist, perwallet)
      "baseURL", // URL for Metadata
      "hiddenURI",
      root
    );
    await contract.deployed();
    return contract;
  }

  const merkleRootFactory = async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    const whitelist = [addr1.address, addr2.address];
    const leafs = whitelist.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
    const root = merkleTree.getRoot();
    return [root, merkleTree, leafs, whitelist]
  }

  describe("supports interfaces", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    [ 
      'ERC2981',
      'ERC165',
      'ERC721',
      'ERC721Enumerable',
      'ERC721Metadata'
    ].map(interface => {
      it(interface, async () => {
        shouldSupportInterfaces(
          await contractFactory(root),
          [interface]
        );
      });
    })
  });


  describe("royalties support (aka ERC2981)", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    context("royaltyInfo()", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory(root);
      })

      it("should return 10% royalty rate", async () => {
        const price = await instance.WHITELIST_PRICE();
        const royalty_rate = await instance.ROYALTY_RATE();
        const royalty = price.mul(royalty_rate).div(100);
        const royaltyInfo = await instance.royaltyInfo(1, price);
        expect(royaltyInfo[1]).to.be.equal(royalty);
      });
    });
  });
});