"use strict";

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const fs = require('fs')
const jwt_decode = require("jwt-decode")

const whitelistAddresses = fs.readFileSync('data/list.txt', 'utf8').split("\n").filter(n => n)

const leafNodes = whitelistAddresses.map(addr => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const rootHash = merkleTree.getRoot().toString('hex')

module.exports.verify = async (event) => {
  const jwtToken = event.headers.Authorization || event.headers.authorization

  if (!jwtToken) {
    return {
      statusCode: 401,
      body: JSON.stringify(
        {
          jwtToken: "JWT token is missing",
          event: event
        },
      ),
    };
  }

  const parsedToken = jwt_decode(jwtToken)
  const address = parsedToken.username || parsedToken['cognito:username']
  const leaf = keccak256(address).toString('hex')
  const proof =  merkleTree.getHexProof(leaf)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS      
      "Access-Control-Allow-Headers" : "Content-Type,Authorization",
      // "Access-Control-Allow-Origin": "https://www.example.com",
      "Access-Control-Allow-Methods": "OPTIONS,GET"
    },
    body: JSON.stringify(
      {
        proof: proof,
        root: rootHash,
        leaf: leaf,
        address: address,
        verify: merkleTree.verify(proof, leaf, rootHash)
      },
    ),
  };
};
