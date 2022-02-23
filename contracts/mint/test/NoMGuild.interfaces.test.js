const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');

const chai = require('chai');
const { expect } = require('chai');
require('chai').should();
chai.use(require('chai-bn')(BN));

// Runs before all tests in this block.
// Read about .new() VS .deployed() here:
// https://twitter.com/zulhhandyplast/status/1026181801239171072
const NoMaGuild = contract.fromArtifact("NoMaGuildTest");
const { shouldSupportInterfaces } = require('./utils/SupportsInterface.behavior');

describe("NoMaGuild", () => {
  const instanceFactory = (root) =>
    NoMaGuild.new(
      "NOMA", "NoMa", // Namimng
      8192, 3000, 3, // Limits
      "baseURL", // URL for Metadata
      root
    )

  describe("supports interfaces", async () => {
    let root;
    let merkleTree;

    before(async () => {
      const whitelist = [accounts[0], accounts[1]];
      const leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
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
          await instanceFactory(root),
          [interface]
        );
      });
    })
  });

  describe("burnable", async () => {
    let root;
    let merkleTree;

    before(async () => {
      const whitelist = [accounts[0], accounts[1]];
      const leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
    });

    context("burn()", async () => {
      let instance;
      beforeEach(async () => {
        instance = await instanceFactory(root);
      })

      it("should not allow burn without approval", async () => {
        await instance.setPublicSale(true)
        const price = Number(await instance.PUBLIC_PRICE());
        const quantity = 1;
        await instance.publicMint(quantity, {
          from: accounts[1], value: price * quantity,
        })
        await expectRevert.unspecified(
          instance.burn(1, { from: accounts[2] }),
          "without approval we cannot burn tokens"
        );
      });

      it("should allow burn with approval", async () => {
        await instance.setPublicSale(true)
        const price = Number(await instance.PUBLIC_PRICE());
        const quantity = 1;
        await instance.publicMint(quantity, {
          from: accounts[1], value: price * quantity
        })
        expect(await instance.ownerOf(0)).to.be.equal(accounts[1]);
        await instance.burn(0, { from: accounts[1] });

        expect(await instance.balanceOf(accounts[1])).to.be.bignumber.equal(new BN(0));
        await expectRevert.unspecified(
          instance.ownerOf(0),
          "no more owner of the token"
        );
        // Supply should not go down (to prevent mint again)
        expect(Number(await instance.totalSupply())).to.equal(0);
      });
    });
  });

  describe("royalties support (aka ERC2981)", async () => {
    let root;
    let merkleTree;

    before(async () => {
      const whitelist = [accounts[0], accounts[1]];
      const leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
    });

    context("royaltyInfo()", async () => {
      let instance;
      beforeEach(async () => {
        instance = await instanceFactory(root);
      })

      it("should return 10% royalty rate", async () => {
        const price = await instance.WHITELIST_PRICE();
        const royalty_rate = await instance.ROYALTY_RATE();
        const royalty = new BN(price * royalty_rate / 100);
        const royaltyInfo = await instance.royaltyInfo(1, price);
        expect(royaltyInfo[1]).to.be.bignumber.equal(royalty);
      });
    });
  });
});