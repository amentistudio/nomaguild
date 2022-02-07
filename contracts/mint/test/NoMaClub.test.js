const chai = require('chai');
const truffleAssert = require("truffle-assertions");
const { BN } = require('@openzeppelin/test-helpers');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const expect = require('chai').expect;
chai.use(require('chai-bn')(BN));

// Runs before all tests in this block.
// Read about .new() VS .deployed() here:
// https://twitter.com/zulhhandyplast/status/1026181801239171072
const NoMaClub = artifacts.require("NoMaClubTest");
const { shouldSupportInterfaces } = require('./utils/SupportsInterface.behavior');

// Scenarios:
// Sold out, burnable, multiple mints

contract("NoMaClub", async accounts => {

  describe("supports interfaces", async () => {
    let root;
    let merkleTree;

    before(async () => {
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
    });

    ['ERC2981', 'ERC165', 'ERC721', 'ERC721Enumerable', 'ERC721Metadata'].map(interface => {
      it(interface, async () => {
        shouldSupportInterfaces(
          await NoMaClub.new(
            "NOMA", "NoMa", "baseURL",
            root
          ),
          [interface]
        );
      });
    })
  });

  describe("royalties support (aka ERC2981)", async () => {
    let root;
    let merkleTree;

    before(async () => {
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
    });

    context("royaltyInfo()", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root
        );
      })

      it("should return 10% royalty rate", async () => {
        const price = await instance.WHITELIST_PRICE();
        const royalty = new BN(price * .1);
        const royaltyInfo = await instance.royaltyInfo(1, price);
        expect(royaltyInfo[1]).to.be.bignumber.equal(royalty);
      });
    });
  });

  describe("transfers", async () => {
    let root;
    let merkleTree;

    before(async () => {
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
    });

    context("withdraw()", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root
        );
      })

      it("should allow widthdraw to owner", async () => {
        await instance.setPublicSale(true)
        await instance.publicMint(1, {
          from: accounts[1], value: web3.utils.toWei(".2", "ether")
        })
        let owner = await instance.owner();
        let owner_balance_bm_wei = await web3.eth.getBalance(owner);
        await instance.widthdraw();

        expect(Number(await instance.totalSupply())).to.equal(1)
        // Contract
        let contract_balance_wei = await web3.eth.getBalance(instance.address);
        expect(contract_balance_wei).to.equal(web3.utils.toWei("0", "ether"));
        // Owner
        let owner_balance_wei = await web3.eth.getBalance(owner);
        expect(Number(owner_balance_wei)).to.be.above(Number(owner_balance_bm_wei));
      });

      it("should not allow calling widthdraw to not owners", async () => {
        await instance.setPublicSale(true)
        await instance.publicMint(1, {
          from: accounts[1], value: web3.utils.toWei(".2", "ether")
        })
        let owner = await instance.owner();
        let owner_balance_bm_wei = await web3.eth.getBalance(owner);
        truffleAssert.reverts(
          instance.widthdraw({ from: accounts[2] }),
          null,
          "only owner able to withdraw all"
        );

        expect(Number(await instance.totalSupply())).to.equal(1)
        // Contract
        let contract_balance_wei = await web3.eth.getBalance(instance.address);
        expect(contract_balance_wei).to.equal(web3.utils.toWei("0.2", "ether"));
        // Owner
        let owner_balance_wei = await web3.eth.getBalance(owner);
        expect(owner_balance_wei).to.equal(owner_balance_bm_wei);
      });
    });
  });

  describe("setters", async () => {
    let root;
    let merkleTree;

    before(async () => {
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
    });

    context("baseURI", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root
        );
      })

      it("should allow set base uri to owner", async () => {
        expect(await instance.getBaseURI()).to.equal("baseURL")
        await instance.setBaseURI("new URI")
        expect(await instance.getBaseURI()).to.equal("new URI")
      });
    });

    context("whitelist sale", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root
        );
      })

      it("should allow turning on and off", async () => {
        await instance.setWhitelistSale(true)
        expect(await instance.openWhitelistSale()).to.equal(true)
        await instance.setWhitelistSale(false)
        expect(await instance.openWhitelistSale()).to.equal(false)
      });

      it("should start with white sale off", async () => {
        expect(await instance.openWhitelistSale()).to.equal(false)
      });
    });


    context("public sale", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root
        );
      })

      it("should allow turning on and off", async () => {
        await instance.setPublicSale(true)
        expect(await instance.openPublicSale()).to.equal(true)
        await instance.setPublicSale(false)
        expect(await instance.openPublicSale()).to.equal(false)
      });

      it("should start with white sale off", async () => {
        expect(await instance.openPublicSale()).to.equal(false)
      });
    });
  });

  describe("minting", async () => {
    let proof;
    let root;
    let merkleTree;

    before(async () => {
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
      merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      root = merkleTree.getRoot();
    });

    context("giveawayMint()", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root
        );
      })

      it("should allow calling giveaway to owner", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        await instance.giveawayMint(accounts[2], 1, { from: accounts[0] });

        expect(Number(await instance.totalSupply())).to.equal(1)
        let balance_wei = await web3.eth.getBalance(instance.address);
        expect(balance_wei).to.equal(web3.utils.toWei("0", "ether"));
      });

      it("should not allow calling giveaway to not owners", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        truffleAssert.reverts(
          instance.giveawayMint(accounts[2], 1, { from: accounts[1] }),
          null,
          "only owner able to giveaway mint"
        );

        expect(Number(await instance.totalSupply())).to.equal(0)
        let balance_wei = await web3.eth.getBalance(instance.address);
        expect(balance_wei).to.equal(web3.utils.toWei("0", "ether"));
      });
    });

    describe("whitelistMint()", async () => {
      context("whitelist sale open", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaClub.new(
            "NOMA", "NoMa", "baseURL",
            root
          );
        })

        it("should mint an mummy with correct price", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          await instance.whitelistMint(proof, 1, {
            from: accounts[0], value: web3.utils.toWei(".05", "ether")
          })

          expect(Number(await instance.totalSupply())).to.equal(1)
          let balance_wei = await web3.eth.getBalance(instance.address);
          expect(balance_wei).to.equal(web3.utils.toWei(".05", "ether"));
        });

        it("should not mint an mummy with incorrect price", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          truffleAssert.reverts(
            instance.whitelistMint(proof, 1, {
              from: accounts[0], value: web3.utils.toWei(".01", "ether")
            }),
            null,
            "not enough money for mint"
          )

          expect(Number(await instance.totalSupply())).to.equal(0)
          let balance_wei = await web3.eth.getBalance(instance.address);
          expect(balance_wei).to.equal(web3.utils.toWei("0", "ether"));
        });

        it("should not mint an mummy with incorrect proof", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          truffleAssert.reverts(
            instance.whitelistMint(proof, 1, {
              // hint: account[2] isn't part of whitelist
              from: accounts[2], value: web3.utils.toWei(".05", "ether")
            }),
            null,
            "incorrect proof"
          )

          expect(Number(await instance.totalSupply())).to.equal(0)
          let balance_wei = await web3.eth.getBalance(instance.address);
          expect(balance_wei).to.equal(web3.utils.toWei("0", "ether"));
        });
      });

    });

    describe("publicMint()", async () => {
      context("public sale open", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaClub.new(
            "NOMA", "NoMa", "baseURL",
            root
          );
        })

        it("should mint an mummy with correct price", async () => {
          await instance.setPublicSale(true)
          await instance.publicMint(1, {
            from: accounts[0], value: web3.utils.toWei(".2", "ether")
          })

          expect(Number(await instance.totalSupply())).to.equal(1)
          let balance_wei = await web3.eth.getBalance(instance.address);
          expect(balance_wei).to.equal(web3.utils.toWei(".2", "ether"));
        });

        it("should mint an mummy with bellow price", async () => {
          await instance.setPublicSale(true)
          truffleAssert.reverts(
            instance.publicMint(1, {
              from: accounts[1], value: web3.utils.toWei(".01", "ether"),
            }),
            null,
            "price must be at least 0.2 ether"
          )
        });
      });

      context("public sale closed", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaClub.new(
            "NOMA", "NoMa", "baseURL",
            root
          );
        })

        it("should not mint an mummy", async () => {
          await instance.setPublicSale(false)
          truffleAssert.reverts(
            instance.publicMint(1, {
              from: accounts[2], value: web3.utils.toWei(".2", "ether")
            }),
            null,
            "public sale closed"
          )
        });
      });
    });

  });
});
