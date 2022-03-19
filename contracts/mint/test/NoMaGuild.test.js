const { waffle } = require("hardhat");
const { solidity } = require ("ethereum-waffle");
const { expect, use } = require('chai');
const { utils } = require('ethers');

use(solidity);

describe("NoMaGuild", () => {
  const contractFactory = async (supply = 8192, perwallet = 3) => {
    const NoMaGuildFactory = await ethers.getContractFactory('NoMaGuildTest');
    const contract = await NoMaGuildFactory.deploy(
      "NOMA", "NoMa", // Namimng
      supply, perwallet, // Limits (supply, perwallet)
      "baseURL", // URL for Metadata
      "hiddenURI"
    );
    await contract.deployed();

    return contract;
  }

  describe("setters", async () => {
    context("tokenURI", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory();
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
        instance = await contractFactory();
      })

      it("should allow set base uri to owner", async () => {
        expect(await instance.getBaseURI()).to.equal("baseURL")
        await instance.setBaseURI("new URI")
        expect(await instance.getBaseURI()).to.equal("new URI")
      });
    });

    context("pausing", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory();
      })

      it("should allow pause contract", async () => {
        await instance.pause()
        expect(await instance.paused()).to.equal(true)
      });

      it("should allow unpause contract", async () => {
        await instance.pause()
        await instance.unpause()
        expect(await instance.paused()).to.equal(false)
      });

      it("should revert if not pause", async () => {
        expect(instance.unpause()).to.be.revertedWith("Pausable: not paused")
      });
    });

    context("public sale", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory();
      })

      it("should allow turning on and off", async () => {
        await instance.setPublicSale(true)
        expect(await instance.isPublicSaleOpen()).to.equal(true)
        await instance.setPublicSale(false)
        expect(await instance.isPublicSaleOpen()).to.equal(false)
      });

      it("should start with public sale off", async () => {
        expect(await instance.isPublicSaleOpen()).to.equal(false)
      });
    });

    context("refund start time", async () => {
      let instance;
      beforeEach(async () => {
        instance = await contractFactory();
      })

      it("should set correctly the refund start time", async () => {
        const timestamp = Math.floor(Number(new Date().getTime()) / 1000);

        await instance.setRefundStartTime(timestamp);
        expect(await instance.getRefundStartTime()).to.equal(timestamp);
      });
    });
  });

  describe("transfers", async () => {
    context("refund()", async () => {
      let instance;
      let owner;
      let addr1;
      let addr2;

      beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory();
      })


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
        const deadline = Math.floor(days61Ago.valueOf() / 1000);

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
        instance = await contractFactory();
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
        const deadline = Math.floor(days61Ago.valueOf() / 1000);

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
        const deadline = Math.floor(Number(days59Ago.getTime()) / 1000);

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
    context("giveawayMint()", async () => {
      let instance;
      let addr1;
      let addr2;

      beforeEach(async () => {
        [, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory(1);
      })

      it("should not allow giveaway if soldout", async () => {
        instance.giveawayMint(addr1.address, 1)

        await expect(
          instance.giveawayMint(addr2.address, 1)
        ).to.be.revertedWith('Soldout');

        expect(await instance.totalSupply()).to.equal(1)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should allow calling giveaway to owner", async () => {
        await instance.giveawayMint(addr2.address, 1);

        expect(Number(await instance.totalSupply())).to.equal(1)
        let balance_wei = await waffle.provider.getBalance(instance.address);
        expect(balance_wei).to.equal(0);
      });

      it("should not allow calling giveaway to not owners", async () => {
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

  describe("publicMint()", async () => {
    context("wallet limit", async () => {
      let instance;
      let addr1;

      beforeEach(async () => {
        [, addr1] = await ethers.getSigners();
        instance = await contractFactory(3, 3);
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
        instance = await contractFactory(2, 3);
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
        instance = await contractFactory(2, 3);
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
        instance = await contractFactory(2, 3);
      })

      it("should not mint an mummy", async () => {
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
    context("burn()", async () => {
      let addr1;
      let addr2;
      let instance;

      beforeEach(async () => {
        [, addr1, addr2] = await ethers.getSigners();
        instance = await contractFactory();
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
