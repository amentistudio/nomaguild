// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NoMaClub.sol";

// NOTE:
// This allows us to test internal visibility stuff, by exposing public getter functions.
// Only for testing purposes and running inside tests.
// This should never be used in production!!!
contract NoMaClubTest is NoMaClub {
    constructor(
        string memory _symbol,
        string memory _name,
        uint256 _maxMummies,
        uint256 _maxWhitelist,
        uint256 _mintLimitPerWallet,
        string memory baseURI,
        bytes32 _merkleRoot
    ) NoMaClub(_symbol, _name, _maxMummies, _maxWhitelist, _mintLimitPerWallet, baseURI, _merkleRoot) {}

    function openPublicSale() public view returns (bool) {
        return IS_PUBLIC_SALE_OPEN;
    }

    function openWhitelistSale() public view returns (bool) {
        return IS_WHITELIST_SALE_OPEN;
    }

    function getBaseURI() public view returns (string memory) {
        return baseTokenURI;
    }
}
