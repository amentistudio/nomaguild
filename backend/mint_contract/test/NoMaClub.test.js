const truffleAssert = require("truffle-assertions");
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

// Runs before all tests in this block.
// Read about .new() VS .deployed() here:
// https://twitter.com/zulhhandyplast/status/1026181801239171072
const NoMaClub = artifacts.require("NoMaClubTest");

// Scenarios:
// Sold out, burnable

contract("NoMaClub", async accounts => {
  describe("setters", async () => {
    let proof;
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
          root,
          "0x1f794DFb9Bf6a540dEf3f2540c76a08d46D1abE5"
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
          root,
          "0x1f794DFb9Bf6a540dEf3f2540c76a08d46D1abE5"
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

    context("withdrawAll", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root,
          accounts[2]
        );
      })

      it("should allow withdraw all to owner", async () => {
        await instance.setPublicSale(true)
        await instance.publicMint({
          from: accounts[1], value: web3.utils.toWei(".2", "ether")
        })
        let developer_balance_bm_wei = await web3.eth.getBalance(accounts[2]);
        await instance.withdrawAll();

        expect(Number(await instance.totalSupply())).to.equal(1)
        // Owner
        let owner_balance_wei = await web3.eth.getBalance(instance.address);
        expect(owner_balance_wei).to.equal(web3.utils.toWei("0", "ether"));
        // Developer
        let developer_balance_wei = await web3.eth.getBalance(accounts[2]);
        expect(Number(developer_balance_wei)).to.be.above(Number(developer_balance_bm_wei));
      });

      it("should not allow calling withdraw all to not owners", async () => {
        await instance.setPublicSale(true)
        await instance.publicMint({
          from: accounts[1], value: web3.utils.toWei(".2", "ether")
        })
        let developer_balance_bm_wei = await web3.eth.getBalance(accounts[2]);
        truffleAssert.reverts(
          instance.withdrawAll({ from: accounts[2] }),
          null,
          "only owner able to withdraw all"
        );

        expect(Number(await instance.totalSupply())).to.equal(1)
        // Owner
        let owner_balance_wei = await web3.eth.getBalance(instance.address);
        expect(owner_balance_wei).to.equal(web3.utils.toWei("0.2", "ether"));
        // Developer
        let developer_balance_wei = await web3.eth.getBalance(accounts[2]);
        expect(developer_balance_wei).to.equal(developer_balance_bm_wei);
      });
    });

    context("giveaway mint", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root,
          "0x1f794DFb9Bf6a540dEf3f2540c76a08d46D1abE5"
        );
      })

      it("should allow calling giveaway to owner", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        await instance.giveawayMint(accounts[2], { from: accounts[0] });

        expect(Number(await instance.totalSupply())).to.equal(1)
        let balance_wei = await web3.eth.getBalance(instance.address);
        expect(balance_wei).to.equal(web3.utils.toWei("0", "ether"));
      });

      it("should not allow calling giveaway to not owners", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        truffleAssert.reverts(
          instance.giveawayMint(accounts[2], { from: accounts[1] }),
          null,
          "only owner able to giveaway mint"
        );

        expect(Number(await instance.totalSupply())).to.equal(0)
        let balance_wei = await web3.eth.getBalance(instance.address);
        expect(balance_wei).to.equal(web3.utils.toWei("0", "ether"));
      });
    });


    context("public sale", async () => {
      let instance;
      beforeEach(async () => {
        instance = await NoMaClub.new(
          "NOMA", "NoMa", "baseURL",
          root,
          "0x1f794DFb9Bf6a540dEf3f2540c76a08d46D1abE5"
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

    describe("whitelistMint()", async () => {
      context("whitelist sale open", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaClub.new(
            "NOMA", "NoMa", "baseURL",
            root,
            "0x1f794DFb9Bf6a540dEf3f2540c76a08d46D1abE5"
          );
        })

        it("should mint an mummy with correct price", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          await instance.whitelistMint(proof, {
            from: accounts[0], value: web3.utils.toWei(".2", "ether")
          })

          expect(Number(await instance.totalSupply())).to.equal(1)
          let balance_wei = await web3.eth.getBalance(instance.address);
          expect(balance_wei).to.equal(web3.utils.toWei(".2", "ether"));
        });

        it("should not mint an mummy with incorrect price", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          truffleAssert.reverts(
            instance.whitelistMint(proof, {
              from: accounts[0], value: web3.utils.toWei(".1", "ether")
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
            instance.whitelistMint(proof, {
              // hint: account[2] isn't part of whitelist
              from: accounts[2], value: web3.utils.toWei(".2", "ether")
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
            root,
            "0x1f794DFb9Bf6a540dEf3f2540c76a08d46D1abE5"
          );
        })

        it("should mint an mummy with correct price", async () => {
          await instance.setPublicSale(true)
          await instance.publicMint({
            from: accounts[0], value: web3.utils.toWei(".2", "ether")
          })

          expect(Number(await instance.totalSupply())).to.equal(1)
          let balance_wei = await web3.eth.getBalance(instance.address);
          expect(balance_wei).to.equal(web3.utils.toWei(".2", "ether"));
        });

        it("should mint an mummy with bellow price", async () => {
          await instance.setPublicSale(true)
          truffleAssert.reverts(
            instance.publicMint({
              from: accounts[1], value: web3.utils.toWei(".1", "ether"),
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
            root,
            "0x1f794DFb9Bf6a540dEf3f2540c76a08d46D1abE5"
          );
        })

        it("should not mint an mummy", async () => {
          await instance.setPublicSale(false)
          truffleAssert.reverts(
            instance.publicMint({
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
