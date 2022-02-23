const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const { waffle } = require("hardhat");

const { BN, expectRevert } = require('@openzeppelin/test-helpers');

const chai = require('chai');
const { expect } = require('chai');
require('chai').should();
chai.use(require('chai-bn')(BN));

describe("NoMaGuild", () => {
  const contractFactory = async (root, supply = 8192, whitelist = 3000, perwallet = 3) => {
    const NoMaGuildFactory = await ethers.getContractFactory('NoMaGuildTest');
    const contract = await NoMaGuildFactory.deploy(
      "NOMA", "NoMa", // Namimng
      supply, whitelist, perwallet, // Limits (supply, whitelist, perwallet)
      "baseURL", // URL for Metadata
      root
    );
    await contract.deployed();
    return contract;
  }

  const merkleRootFactory = async () => {
      const [_, addr1, addr2] = await ethers.getSigners();
      const whitelist = [addr1.address, addr2.address];
      const leafs = whitelist.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
      const root = merkleTree.getRoot();
      return [root, merkleTree, leafs, whitelist]
  }

  describe("setters", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    context("baseURI", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory(root);
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
        instance = await contractFactory(root);
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
        instance = await contractFactory(root);
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

  describe("transfers", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    context("withdraw()", async () => {
      let instance;
      let owner;
      let addr1;
      let addr2;

      beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(root);
      })

      it("should allow widthdraw to owner", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;
        const owner_balance_bm_wei = await waffle.provider.getBalance(owner.address);

        // Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        });

        // Withdraw
        await instance.widthdraw();

        expect(Number(await instance.totalSupply())).to.equal(1);

        // Contract
        let contract_balance_wei = await instance.balanceOf(instance.address);
        expect(contract_balance_wei).to.equal(0);

        // // Owner
         let owner_balance_wei = await waffle.provider.getBalance(owner.address);
         expect(Number(owner_balance_wei)).to.be.above(Number(owner_balance_bm_wei));
      });

      it("should not allow calling widthdraw to not owners", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;

        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        })

        let owner_balance_bm_wei = await waffle.provider.getBalance(owner.address);;
        await expectRevert(
          instance.connect(addr2).widthdraw(),
          "Ownable: caller is not the owner",
          "only owner able to withdraw all"
        );

        expect(Number(await instance.totalSupply())).to.equal(1)
        // Contract
        let contract_balance_wei = await waffle.provider.getBalance(instance.address);
        expect(contract_balance_wei).to.equal(price.mul(quantity));

        // Owner
        let owner_balance_wei = await waffle.provider.getBalance(owner.address);
        expect(owner_balance_wei).to.equal(owner_balance_bm_wei);
      });
    });
  });

  describe("minting", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    context("giveawayMint()", async () => {
      let instance;
      let owner;
      let addr1;
      let addr2;

      beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(root);
      })

      it("should allow calling giveaway to owner", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        await instance.giveawayMint(addr2.address, 1);

        expect(Number(await instance.totalSupply())).to.equal(1)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should not allow calling giveaway to not owners", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)
        await expectRevert(
          instance.connect(addr1).giveawayMint(addr2.address, 1),
          "Ownable: caller is not the owner",
          "only owner able to giveaway mint"
        );

        expect(Number(await instance.totalSupply())).to.equal(0)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });
    });
  });

  describe("whitelistMint()", async () => {
    let root;
    let merkleTree;
    let leafs;

    before(async () => {
      [root, merkleTree, leafs] = await merkleRootFactory();
    });

    context("overlimit on whitelist max", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [_, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 3, 2, 3);
      })

      it("should not mint an mummy if whitelist max reached", async () => {
        proof = merkleTree.getHexProof(leafs[0]);

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Mint 2 (= max per whitelist)
        const price = await instance.WHITELIST_PRICE();
        const quantity = 2;
        await instance.connect(addr1).whitelistMint(proof, quantity, {
          value: price.mul(quantity),
        })

        expect(await instance.maxMummies()).to.equal(3)
        expect(await instance.maxWhitelist()).to.equal(2)
        expect(await instance.totalSupply()).to.equal(2)

        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(price.mul(quantity));

        // Whitelist max. # exceeded
        await expectRevert(
          instance.connect(addr1).whitelistMint(proof, 1, {
            value: price
          }),
          "Exceeded whitelist supply!",
          "cannot mint if total supply overlimit"
        );
      });
    });

    context("overlimit on total supply", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [_, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 2, 3, 3);
      })

      it("should not mint an mummy if total supply overlimit", async () => {
        proof = merkleTree.getHexProof(leafs[0]);

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Whitelist
        const price = await instance.WHITELIST_PRICE();
        const quantity = 2;

        await instance.connect(addr1).whitelistMint(proof, quantity, {
          value: price.mul(quantity)
        })

        expect(await instance.maxMummies()).to.equal(2);
        expect(await instance.totalSupply()).to.equal(2);

        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(price.mul(quantity));

        await expectRevert(
          instance.connect(addr1).whitelistMint(proof, 1, {
            value: price.mul(quantity)
          }),
          "Soldout!",
          "cannot mint if whitelist supply overlimit"
        );
      });
    });

    context("whitelist sale open", async () => {
      let instance;
      let addr1;
      let addr2;

      beforeEach(async () => {
        [_, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(root, 2, 3, 3);
      })

      it("should mint an mummy with correct price", async () => {
        proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 1;

        // Open whitelist
        await instance.setWhitelistSale(true)
        // Mint
        await instance.connect(addr1).whitelistMint(proof, quantity, {
          value: price.mul(quantity)
        })

        expect(await instance.totalSupply()).to.equal(1)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(price.mul(quantity));
      });

      it("should not mint an mummy with incorrect price", async () => {
        proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Try to whitelist with unsufficient money
        await expectRevert(
          instance.connect(addr1).whitelistMint(proof, 1, {
            value: price.div(2)
          }),
          "Insufficient payment per item",
          "not enough money for mint"
        );

        expect(await instance.totalSupply()).to.equal(0);
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should not mint an mummy with incorrect proof", async () => {
        proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 1;

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Try to mint without being on the whitelist
        await expectRevert(
          instance.connect(addr2).whitelistMint(proof, quantity, {
            // hint: account[2] isn't part of whitelist
            value: price.mul(quantity)
          }),
          "Not whitelisted",
          "incorrect proof"
        );

        expect(await instance.totalSupply()).to.equal(0);
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should not mint an mummy when paused", async () => {
        proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 1;

        // Open whitelist yet pause the contract
        await instance.setWhitelistSale(true)
        await instance.pause();

        // Mint should not work when paused
        await expectRevert(
          instance.connect(addr1).whitelistMint(proof, quantity, {
            value: price.mul(quantity)
          }),
          "Pausable: paused",
          "contract paused so no whitelist mint allowed"
        );

        expect(await instance.totalSupply()).to.equal(0)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });
    });
  });

  describe("publicMint()", async () => {
    let root;
    let merkleTree;
    let leafs;

    before(async () => {
      [root, merkleTree, leafs] = await merkleRootFactory();
    });

    context("wallet limit", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [_, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 3, 2, 3);
      })

      it("should not mint an mummy if wallet limit reached", async () => {
        // Open public mint
        await instance.setPublicSale(true)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 2;

        // Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        })

        expect(await instance.maxMummies()).to.equal(3)
        expect(await instance.totalSupply()).to.equal(2)

        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(price.mul(quantity));

        await expectRevert(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity)
          }),
          "Exceeded limit per wallet!",
          "cannot mint if already limit per wallet reached"
        );
      });

      it("should not mint an mummy if per wallet exceeded", async () => {
        // Open public sale
        await instance.setPublicSale(true)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 4; 

        // Try to mint over limit per wallet
        await expectRevert(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity)
          }),
          "Exceeded limit per wallet!",
          "cannot mint if quantity is too high"
        );
      });
    });

    context("soldout", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [_, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 2, 1, 3);
      })

      it("should not mint an mummy if soldout", async () => {
        // Open public sale
        await instance.setPublicSale(true)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 2; 

        // Mint
        await instance.connect(addr1).publicMint(2, {
          value: price.mul(quantity)
        })

        expect(await instance.maxMummies()).to.equal(2)
        expect(await instance.totalSupply()).to.equal(2)

        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(price.mul(quantity));

        // Soldout
        await expectRevert(
          instance.connect(addr1).publicMint(1, {
            value: price.mul(quantity)
          }),
          "Soldout!",
          "cannot mint if soldout"
        );
      });
    });

    context("public sale open", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [_, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 2, 1, 3);
      })

      it("should mint an mummy with correct price", async () => {
        // Open public sale
        await instance.setPublicSale(true)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 1; 

        // Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        })

        expect(await instance.totalSupply()).to.equal(1)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(price.mul(quantity));
      });

      it("should not mint an mummy with bellow price", async () => {
        // Open public sale
        await instance.setPublicSale(true)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 2; 

        await expectRevert(
          instance.connect(addr1).publicMint(quantity, {
            value: price
          }),
          "Insufficient payment per item",
          "price must adequate for the quantity"
        );
      });

      it("should not mint an mummy with paused contract", async () => {
        // Open public sale
        await instance.setPublicSale(true)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 1; 

        // Pause contract
        await instance.pause()

        // Try mint with paused contract
        await expectRevert(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity),
          }),
          "Pausable: paused",
          "cannot mint whilte paused"
        );
      });
    });

    context("public sale closed", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [_, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 2, 1, 3);
      })

      it("should not mint an mummy", async () => {
        // Close public sale
        await instance.setPublicSale(false)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 1; 

        // Try to mint when sales are closed
        await expectRevert(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity)
          }),
          "Public sales not open",
          "public sale closed"
        );
      });
    });
  });

});
