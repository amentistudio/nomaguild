// test/MerkleProofVerify.test.js
// SPDX-License-Identifier: MIT
// based upon https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.1/test/cryptography/MerkleProof.test.js

require('@openzeppelin/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');

const { expect } = require('chai');
require('chai').should();

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

const MerkleProofVerify = contract.fromArtifact('MerkleProofVerify');

describe('MerkleProofVerify', () => {
    let elements;
    let merkleTree;
    let root;
    let proof;

    beforeEach(async function () {
      this.merkleProofVerify = await MerkleProofVerify.new();

      elements = [accounts[0], accounts[1]].map(addr => keccak256(addr));
      merkleTree = new MerkleTree(elements, keccak256, {sortPairs: true});
      root = "0x" + merkleTree.getRoot().toString('hex');
      proof = merkleTree.getHexProof(elements[0]);
    });

    it('should return true for a valid leaf', async function () {
      expect(await this.merkleProofVerify.verify(proof, root, {from: accounts[0]})).to.equal(true);
    });

    it('should return false for an invalid leaf', async function () {
      expect(await this.merkleProofVerify.verify(proof, root, {from: accounts[2]})).to.equal(false);
    });
});
