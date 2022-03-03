const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { waffle } = require("hardhat");
const { solidity } = require ("ethereum-waffle");
const { expect, use } = require('chai');
const { utils } = require('ethers');

use(solidity);

describe("NoMaGuild", () => {
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

    // Update block.timestamp to now()
    await ethers.provider.send('evm_setNextBlockTimestamp', [Number(new Date())]); 
    await ethers.provider.send('evm_mine');

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

  describe("setters", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    context("tokenURI", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory(root);
      });
      
      it("should return baseURI if not baseURI empty", async () => {
        await instance.setBaseURI("nonempty/");
        await instance.setHiddenURI("");
        expect(await instance.tokenURI(1)).to.equal("nonempty/1.json");
      });

      it("should return baseURI if not baseURI empty", async () => {
        await instance.setBaseURI("nonempty/");
        expect(await instance.tokenURI(1)).to.equal("hiddenURI");
      });

      it("should return hiddenURI if baseURI is empty", async () => {
        await instance.setBaseURI("");
        expect(await instance.tokenURI(1)).to.equal("hiddenURI");
      });
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

    context("refund start time", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory(root);
      })

      it("should set correctly the refund start time", async () => {
        const timestamp = Number(new Date().getTime());

        await instance.setRefundStartTime(timestamp);
        expect(await instance.getRefundStartTime()).to.equal(timestamp);
      });
    });
  });

  describe("transfers", async () => {
    let root;

    before(async () => {
      [root, merkleTree, leafs] = await merkleRootFactory();
    });

    context("refund()", async () => {
      let instance;
      let owner;
      let addr1;
      let addr2;

      beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(root);
      })

      it("should allow refund for whitelisted mint and return whitelisted price", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

        await instance.setWhitelistSale(true)
        const price = await instance.WHITELIST_PRICE();
        const quantity = 1;
        const addr1_balance_bm_wei = await waffle.provider.getBalance(addr1.address);

        // Public Mint
        await instance.connect(addr1).whitelistMint(proof, quantity, {
          value: price.mul(quantity)
        });

        // Refund
        await instance.connect(addr1).refund(1);

        // Contract
        let contract_balance_wei = await instance.balanceOf(instance.address);
        expect(contract_balance_wei).to.equal(0);

        // Addr1 should have money back - some fees
        let addr1_balance_wei = await waffle.provider.getBalance(addr1.address);
        expect(addr1_balance_wei).to.be.above(addr1_balance_bm_wei.sub(utils.parseEther('0.001')));
      });

      it("should allow refund for public mint and return public price", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;
        const addr1_balance_bm_wei = await waffle.provider.getBalance(addr1.address);

        // Public Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        });

        // Refund
        await instance.connect(addr1).refund(1);

        // Contract
        let contract_balance_wei = await instance.balanceOf(instance.address);
        expect(contract_balance_wei).to.equal(0);

        // Addr1 should have money back - some fees
        let addr1_balance_wei = await waffle.provider.getBalance(addr1.address);
        expect(addr1_balance_wei).to.be.above(addr1_balance_bm_wei.sub(utils.parseEther('0.001')));
      });

      it("should not allow refund for non-owner", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;

        // Public Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        });

        // Refund
        await expect(instance.connect(addr2).refund(1)).to.be.revertedWith("MustOwnToken");
      });

      it("should not allow refund if refund period expired", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;

        // Public Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        });

        // Date 61 days back
        const days61Ago = new Date();
        days61Ago.setDate(days61Ago.getDate() - 61);
        const deadline = Math.floor(days61Ago.valueOf());

        // Set refund start date 61 days ago so we can collect the funds
        await instance.setRefundStartTime(deadline);

        // Refund
        await expect(instance.connect(addr1).refund(1)).to.be.revertedWith("RefundGuaranteeExpired");
      });
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

        // Date 61 days back
        const days61Ago = new Date();
        days61Ago.setDate(days61Ago.getDate() - 61);
        const deadline = Math.floor(days61Ago.valueOf());

        // Set refund start date 61 days ago so we can collect the funds
        await instance.setRefundStartTime(deadline);

        // Withdraw
        await instance.widthdraw();

        expect(Number(await instance.totalSupply())).to.equal(1);

        // Contract
        let contract_balance_wei = await instance.balanceOf(instance.address);
        expect(contract_balance_wei).to.equal(0);

        // // Owner
         let owner_balance_wei = await waffle.provider.getBalance(owner.address);
         expect(owner_balance_wei).to.be.above(owner_balance_bm_wei.add(price.sub(utils.parseEther('0.01'))));
      });

      it("should not allow widthdraw to owner if refund guarantee is still active", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;

        // Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        });

        // Date 59 days back
        const days59Ago = new Date();
        days59Ago.setDate(days59Ago.getDate() - 59);
        const deadline = Math.floor(days59Ago.valueOf());

        // Set refund start date 99 days ago yet we still cannot collect the funds
        await instance.setRefundStartTime(deadline);

        // Revert withdraw
        await expect(instance.widthdraw()).to.be.revertedWith("RefundGuaranteeStillActive");
      });

      it("should not allow calling widthdraw to not owners", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;

        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        })

        let owner_balance_bm_wei = await waffle.provider.getBalance(owner.address);
        await expect(instance.connect(addr2).widthdraw()).to.be.revertedWith("Ownable: caller is not the owner")

        expect(await instance.totalSupply()).to.equal(1)
        // Contract
        let contract_balance_wei = await waffle.provider.getBalance(instance.address);
        expect(contract_balance_wei).to.equal(price.mul(quantity));

        // Owner
        let owner_balance_wei = await waffle.provider.getBalance(owner.address);
        expect(owner_balance_wei).to.equal(owner_balance_bm_wei);
      });

      it("should revert if balance is 0", async () => {
        await expect(
          instance.widthdraw()
        ).to.be.revertedWith('NonZeroWitdraw')
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
      let addr1;
      let addr2;

      beforeEach(async () => {
        [, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(root, 1);
      })

      it("should not allow giveaway if soldout", async () => {
        await instance.setWhitelistSale(false)
        await instance.setPublicSale(false)

        instance.giveawayMint(addr1.address, 1)

        await expect(
          instance.giveawayMint(addr2.address, 1)
        ).to.be.revertedWith('Soldout');

        expect(await instance.totalSupply()).to.equal(1)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

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
        await expect(
          instance.connect(addr1).giveawayMint(addr2.address, 1)
        ).to.be.revertedWith(
          "Ownable: caller is not the owner",
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
        [, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 3, 2, 3);
      })

      it("should not mint an mummy if whitelist max reached", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

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
        await expect(
          instance.connect(addr1).whitelistMint(proof, 1, {
            value: price
          })
        ).to.be.revertedWith(
          'WhitelistSoldout'
        );
      });
    });

    context("overlimit on total supply", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 2, 3, 3);
      })

      it("should not mint an mummy if total supply overlimit", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

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

        await expect(
          instance.connect(addr1).whitelistMint(proof, 1, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          'Soldout'
        );
      });
    });

    context("whitelist sale not open", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 3, 3, 2);
      })

      it("should not mint an mummy", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 1;

        // Open whitelist
        await instance.setWhitelistSale(false)
        // Mint
        
        await expect(
          instance.connect(addr1).whitelistMint(proof, quantity, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith('WhitelistSaleNotOpen');

        expect(await instance.totalSupply()).to.equal(0)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });
    });

    context("whitelist sale open", async () => {
      let instance;
      let addr1;
      let addr2;

      beforeEach(async () => {
        [, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(root, 3, 3, 2);
      })

      it("should mint an mummy with correct price", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

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

      it("should not mint an mummy with per wallet limit exceeded", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 3;

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Mint
        await expect(
          instance.connect(addr1).whitelistMint(proof, quantity, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "ExceededLimitPerWallet"
        );

        // Verify nothing was minted
        expect(await instance.totalSupply()).to.equal(0)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should not mint an mummy if quantity and totalSupply for whitelist exceeded", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 2;

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Mint bellow whitelist supply
        instance.connect(addr1).whitelistMint(proof, quantity, {
          value: price.mul(quantity)
        })

        // Mint
        await expect(
          instance.connect(addr2).whitelistMint(proof, quantity, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "ExceededWhitelistSupply"
        );

        // Verify nothing was minted
        expect(await instance.totalSupply()).to.equal(2)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(price.mul(quantity));
      });

      it("should not mint an mummy with incorrect price", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Try to whitelist with unsufficient money
        await expect(
          instance.connect(addr1).whitelistMint(proof, 1, {
            value: price.div(2)
          })
        ).to.be.revertedWith(
          "InsufficientPaymentPerItem"
        );

        expect(await instance.totalSupply()).to.equal(0);
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should not mint an mummy with incorrect proof", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 1;

        // Open whitelist
        await instance.setWhitelistSale(true)

        // Try to mint without being on the whitelist
        await expect(
          instance.connect(addr2).whitelistMint(proof, quantity, {
            // hint: account[2] isn't part of whitelist
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "NotWhitelisted"
        );

        expect(await instance.totalSupply()).to.equal(0);
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should not mint an mummy when paused", async () => {
        const proof = merkleTree.getHexProof(leafs[0]);

        const price = await instance.WHITELIST_PRICE();
        const quantity = 1;

        // Open whitelist yet pause the contract
        await instance.setWhitelistSale(true)
        await instance.pause();

        // Mint should not work when paused
        await expect(
          instance.connect(addr1).whitelistMint(proof, quantity, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "Pausable: paused"
        );

        expect(await instance.totalSupply()).to.equal(0)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
        await instance.unpause();
      });
    });
  });

  describe("publicMint()", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    context("wallet limit", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [, addr1] = await ethers.getSigners();
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

        await expect(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "ExceededLimitPerWallet"
        );
      });

      it("should not mint an mummy if per wallet exceeded", async () => {
        // Open public sale
        await instance.setPublicSale(true)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 4; 

        // Try to mint over limit per wallet
        await expect(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "ExceededLimitPerWallet",
        );
      });
    });

    context("soldout", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [, addr1] = await ethers.getSigners();
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
        await expect(
          instance.connect(addr1).publicMint(1, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "Soldout"
        );
      });
    });

    context("public sale open", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [, addr1] = await ethers.getSigners();
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

        await expect(
          instance.connect(addr1).publicMint(quantity, {
            value: price
          })
        ).to.be.revertedWith(
          "InsufficientPaymentPerItem"
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
        await expect(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity),
          })
        ).to.be.revertedWith(
          "Pausable: paused"
        );
      });
    });

    context("public sale closed", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [, addr1] = await ethers.getSigners();
        instance = await contractFactory(root, 2, 1, 3);
      })

      it("should not mint an mummy", async () => {
        // Close public sale
        await instance.setPublicSale(false)

        const price = await instance.PUBLIC_PRICE();
        const quantity = 1; 

        // Try to mint when sales are closed
        await expect(
          instance.connect(addr1).publicMint(quantity, {
            value: price.mul(quantity)
          })
        ).to.be.revertedWith(
          "PublicSaleClosed"
        );
      });
    });
  });

  describe("burnable", async () => {
    let root;

    before(async () => {
      [root] = await merkleRootFactory();
    });

    context("burn()", async () => {
      let addr1;
      let addr2;
      let instance;

      beforeEach(async () => {
        [, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(root);
      })

      it("should not allow burn without approval", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;

        // Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity),
        })

        // Try to burn from other account
        await expect(
          instance.connect(addr2).burn(1)
        ).to.be.reverted;
      });

      it("should allow burn with approval", async () => {
        await instance.setPublicSale(true)
        const price = await instance.PUBLIC_PRICE();
        const quantity = 1;

        // Mint
        await instance.connect(addr1).publicMint(quantity, {
          value: price.mul(quantity)
        })

        // Check ownership of token 1
        expect(await instance.ownerOf(1)).to.be.equal(addr1.address);
        // Burn token 1
        await instance.connect(addr1).burn(1);

        // Check if balance changed
        expect(await instance.balanceOf(addr1.address)).to.be.equal(0);
        // There's no owner of token 0
        await expect(
          instance.ownerOf(1)
        ).to.be.reverted;

        // Supply should not go down (to prevent mint again)
        expect(await instance.totalSupply()).to.equal(0);
      });
    });
  });

});
