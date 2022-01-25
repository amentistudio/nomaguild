// contracts/MerkleProofVerify.sol
// SPDX-License-Identifier: MIT
// based upon https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.1/contracts/mocks/MerkleProofWrapper.sol

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleProofVerify {
    function verify(bytes32[] memory proof, bytes32 root)
        public
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        return MerkleProof.verify(proof, root, leaf);
    }
}
