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
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
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
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
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
      whitelist = [accounts[0], accounts[1]];
      leafs = whitelist.map(addr => keccak256(addr));
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
        instance = await instanceFactory(root);
      })

      it("should allow widthdraw to owner", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;
        await instance.publicMint(quantity, {
          from: accounts[1], value: price * quantity
        })
        let owner = await instance.owner();
        let owner_balance_bm_wei = await web3.eth.getBalance(owner);
        await instance.widthdraw();

        expect(Number(await instance.totalSupply())).to.equal(1)
        // Contract
        let contract_balance_wei = Number(await web3.eth.getBalance(instance.address));
        expect(contract_balance_wei).to.equal(0);
        // Owner
        let owner_balance_wei = await web3.eth.getBalance(owner);
        expect(Number(owner_balance_wei)).to.be.above(Number(owner_balance_bm_wei));
      });

      it("should not allow calling widthdraw to not owners", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;
        await instance.publicMint(quantity, {
          from: accounts[1], value: price * quantity
        })
        let owner = await instance.owner();
        let owner_balance_bm_wei = await web3.eth.getBalance(owner);
        await expectRevert(
          instance.widthdraw({ from: accounts[2] }),
          "Ownable: caller is not the owner.",
          "only owner able to withdraw all"
        );

        expect(Number(await instance.totalSupply())).to.equal(1)
        // Contract
        let contract_balance_wei = Number(await web3.eth.getBalance(instance.address));
        expect(contract_balance_wei).to.equal(price * quantity);
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
        instance = await instanceFactory(root);
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
        instance = await instanceFactory(root);
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
        instance = await instanceFactory(root);
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
        instance = await instanceFactory(root);
      })

      it("should allow calling giveaway to owner", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        await instance.giveawayMint(accounts[2], 1);

        expect(Number(await instance.totalSupply())).to.equal(1)
        let balance_wei = Number(await web3.eth.getBalance(instance.address));
        expect(balance_wei).to.equal(0);
      });

      it("should not allow calling giveaway to not owners", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        await expectRevert(
          instance.giveawayMint(accounts[2], 1, { from: accounts[1] }),
          "Ownable: caller is not the owner.",
          "only owner able to giveaway mint"
        );

        expect(Number(await instance.totalSupply())).to.equal(0)
        let balance_wei = Number(await web3.eth.getBalance(instance.address));
        expect(balance_wei).to.equal(0);
      });
    });

    describe("whitelistMint()", async () => {

      context("overlimit on whitelist max", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaGuild.new(
            "NOMA", "NoMa", // Namimng
            3, 2, 3, // Limits (supply, whitelist limit, perwallet)
            "baseURL", // URL for Metadata
            root
          )
        })

        it("should not mint an mummy if whitelist max reached", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          const price = Number(await instance.WHITELIST_PRICE());
          const quantity = 2;
          await instance.whitelistMint(proof, quantity, {
            from: accounts[0], value: price * quantity,
          })

          expect(Number(await instance.maxMummies())).to.equal(3)
          expect(Number(await instance.maxWhitelist())).to.equal(2)
          expect(Number(await instance.totalSupply())).to.equal(2)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(price * quantity);

          await expectRevert(
            instance.whitelistMint(proof, 1, {
              from: accounts[1], value: web3.utils.toWei(".2", "ether")
            }),
            "Exceeded whitelist supply!",
            "cannot mint if total supply overlimit"
          );
        });
      });

      context("overlimit on total supply", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaGuild.new(
            "NOMA", "NoMa", // Namimng
            2, 3, 3, // Limits (supply, whitelist limit, perwallet)
            "baseURL", // URL for Metadata
            root
          )
        })

        it("should not mint an mummy if total supply overlimit", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          const price = Number(await instance.WHITELIST_PRICE());
          const quantity = 2;
          await instance.whitelistMint(proof, quantity, {
            from: accounts[0], value: price * quantity
          })

          expect(Number(await instance.maxMummies())).to.equal(2)
          expect(Number(await instance.totalSupply())).to.equal(2)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(Number(price * quantity));

          await expectRevert(
            instance.whitelistMint(proof, 1, {
              from: accounts[0], value: web3.utils.toWei(".2", "ether")
            }),
            "Soldout!",
            "cannot mint if whitelist supply overlimit"
          );
        });
      });

      context("whitelist sale open", async () => {
        let instance;
        beforeEach(async () => {
          instance = await instanceFactory(root);
        })

        it("should mint an mummy with correct price", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          const price = await instance.WHITELIST_PRICE();
          const quantity = 1;
          await instance.setWhitelistSale(true)
          await instance.whitelistMint(proof, quantity, {
            from: accounts[0], value: price * quantity
          })

          expect(Number(await instance.totalSupply())).to.equal(1)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(price * quantity);
        });

        it("should not mint an mummy with incorrect price", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          await instance.setWhitelistSale(true)
          await expectRevert(
            instance.whitelistMint(proof, 1, {
              from: accounts[0], value: web3.utils.toWei(".01", "ether")
            }),
            "Insufficient payment per item.",
            "not enough money for mint"
          );

          expect(Number(await instance.totalSupply())).to.equal(0)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(0);
        });

        it("should not mint an mummy with incorrect proof", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          const price = await instance.WHITELIST_PRICE();
          const quantity = 1;
          await instance.setWhitelistSale(true)
          await expectRevert(
            instance.whitelistMint(proof, quantity, {
              // hint: account[2] isn't part of whitelist
              from: accounts[2], value: price * quantity
            }),
            "Not whitelisted.",
            "incorrect proof"
          );

          expect(Number(await instance.totalSupply())).to.equal(0)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(0);
        });

        it("should not mint an mummy when paused", async () => {
          proof = merkleTree.getHexProof(leafs[0]);
          const price = await instance.WHITELIST_PRICE();
          const quantity = 1;
          await instance.setWhitelistSale(true)
          await instance.pause();
          await expectRevert(
            instance.whitelistMint(proof, quantity, {
              from: accounts[0], value: price * quantity
            }),
            "Pausable: paused.",
            "not enough money for mint"
          );

          expect(Number(await instance.totalSupply())).to.equal(0)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(0);
        });
      });
    });

    describe("publicMint()", async () => {
      context("wallet limit", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaGuild.new(
            "NOMA", "NoMa", // Namimng
            3, 1, 2, // Limits (supply, whitelist limit, perwallet)
            "baseURL", // URL for Metadata
            root
          )
        })

        it("should not mint an mummy if wallet limit reached", async () => {
          await instance.setPublicSale(true)
          const price = await instance.PUBLIC_PRICE();
          const quantity = 2;
          await instance.publicMint(quantity, {
            from: accounts[0], value: price * quantity
          })

          expect(Number(await instance.maxMummies())).to.equal(3)
          expect(Number(await instance.totalSupply())).to.equal(2)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(price * quantity);

          await expectRevert(
            instance.publicMint(quantity, {
              from: accounts[0], value: price * quantity
            }),
            "Exceeded limit per wallet!",
            "cannot mint if already limit per wallet reached"
          );
        });

        it("should not mint an mummy if per wallet hight", async () => {
          await instance.setPublicSale(true)
          const price = await instance.PUBLIC_PRICE();
          const quantity = 3; 
          await expectRevert(
            instance.publicMint(quantity, {
              from: accounts[0], value: price * quantity
            }),
            "Exceeded limit per wallet!",
            "cannot mint if quantity is too high"
          );
        });
      });

      context("soldout", async () => {
        let instance;
        beforeEach(async () => {
          instance = await NoMaGuild.new(
            "NOMA", "NoMa", // Namimng
            2, 1, 3, // Limits (supply, whitelist limit, perwallet)
            "baseURL", // URL for Metadata
            root
          )
        })

        it("should not mint an mummy if soldout", async () => {
          await instance.setPublicSale(true)
          const price = await instance.PUBLIC_PRICE();
          const quantity = 2; 
          await instance.publicMint(2, {
            from: accounts[0], value: price * quantity
          })

          expect(Number(await instance.maxMummies())).to.equal(2)
          expect(Number(await instance.totalSupply())).to.equal(2)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(price * quantity);

          await expectRevert(
            instance.publicMint(1, {
              from: accounts[1], value: price * quantity
            }),
            "Soldout!",
            "cannot mint if soldout"
          );
        });
      });

      context("public sale open", async () => {
        let instance;
        beforeEach(async () => {
          instance = await instanceFactory(root);
        })

        it("should mint an mummy with correct price", async () => {
          await instance.setPublicSale(true)
          const price = await instance.PUBLIC_PRICE();
          const quantity = 1; 
          await instance.publicMint(quantity, {
            from: accounts[0], value: price * quantity
          })

          expect(Number(await instance.totalSupply())).to.equal(1)
          let balance_wei = Number(await web3.eth.getBalance(instance.address));
          expect(balance_wei).to.equal(price * quantity);
        });

        it("should not mint an mummy with bellow price", async () => {
          await instance.setPublicSale(true)
          const price = await instance.PUBLIC_PRICE();
          const quantity = 2; 
          await expectRevert(
            instance.publicMint(quantity, {
              from: accounts[1], value: price
            }),
            "Insufficient payment per item.",
            "price must adequate for the quantity"
          );
        });

        it("should not mint an mummy with paused contract", async () => {
          await instance.setPublicSale(true)
          const price = await instance.PUBLIC_PRICE();
          const quantity = 1; 
          await instance.pause()
          await expectRevert(
            instance.publicMint(quantity, {
              from: accounts[1], value: price * quantity,
            }),
            "Pausable: paused.",
            "cannot mint whilte paused"
          );
        });
      });

      context("public sale closed", async () => {
        let instance;
        beforeEach(async () => {
          instance = await instanceFactory(root);
        })

        it("should not mint an mummy", async () => {
          await instance.setPublicSale(false)
          const price = await instance.PUBLIC_PRICE();
          const quantity = 1; 
          await expectRevert(
            instance.publicMint(quantity, {
              from: accounts[2], value: price * quantity
            }),
            "Public sales not open.",
            "public sale closed"
          );
        });
      });
    });

  });
});
