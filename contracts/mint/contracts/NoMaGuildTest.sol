// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './NoMaGuild.sol';

// NOTE:
// This allows us to test internal visibility stuff, by exposing public getter functions.
// Only for testing purposes and running inside tests.
// This should never be used in production!!!
contract NoMaGuildTest is NoMaGuild {
    constructor(
        string memory ___symbol,
        string memory ___name,
        uint256 _maxMummies,
        uint256 _maxWhitelist,
        uint256 _mintLimitPerWallet,
        string memory baseURI,
        string memory hiddenURI,
        bytes32 _merkleRoot
    ) NoMaGuild(___symbol, ___name, _maxMummies, _maxWhitelist, _mintLimitPerWallet, baseURI, hiddenURI, _merkleRoot) {}

    function getBaseURI() external view returns (string memory) {
        return baseTokenURI;
    }

    function setRefundStartTime(uint256 timestamp) external {
        refundStartTime = timestamp;
    }

    function getRefundStartTime() external view returns (uint256) {
        return refundStartTime;
    }
}
