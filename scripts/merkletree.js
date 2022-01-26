"use strict";

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs')

const whitelistAddresses = fs.readFileSync(process.argv[2], 'utf8').split("\n").filter(n => n)

const leafNodes = whitelistAddresses.map(addr => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const rootHash = merkleTree.getRoot().toString('hex')

console.log(rootHash)