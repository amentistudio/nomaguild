// test/MerkleProofVerify.test.js
// SPDX-License-Identifier: MIT

const { expect } = require('chai');
require('chai').should();

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

describe('MerkleProofVerify', () => {
    let merkleTree;
    let root;
    let proof;
    let addr1;
    let addr2;

    beforeEach(async function () {
      const MerkleProofVerifyFactory = await ethers.getContractFactory('MerkleProofVerify');
      this.merkleProofVerify = await MerkleProofVerifyFactory.deploy();

      [, addr1, addr2] = await ethers.getSigners();
      const addresses = [addr1.address, addr2.address];
      const leafs = addresses.map(addr => keccak256(addr));

      merkleTree = new MerkleTree(leafs, keccak256, {sortPairs: true});
      root = "0x" + merkleTree.getRoot().toString('hex');
      proof = merkleTree.getHexProof(leafs[0]);
    });

    it('should return true for a valid leaf', async function () {
      expect(await this.merkleProofVerify.connect(addr1).verify(proof, root)).to.equal(true);
    });

    it('should return false for an invalid leaf', async function () {
      expect(await this.merkleProofVerify.connect(addr2).verify(proof, root)).to.equal(false);
    });
});
