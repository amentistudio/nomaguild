// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


// TODO: Make Burnable + use Counter
contract NoMaClub is ERC721Enumerable, Ownable {
    using SafeMath for uint256;

    uint256 public constant MAX_MUMMIES = 8192;
    uint256 public constant PRICE = 0.05 ether;
    address public creatorAddress;
    bytes32 public merkleRoot;

    mapping(address => bool) public saleClaimed;

    bool internal WHITELIST_SALE = false;
    bool internal PUBLIC_SALE = false;

    string internal baseTokenURI;

    event WhitelistSaleEvent(bool pause);
    event PublicSaleEvent(bool pause);
    event MummyMinted(uint256 indexed id, address _to);

    constructor(
        string memory _symbol,
        string memory _name,
        string memory baseURI,
        bytes32 _merkleRoot,
        address _creatorsAdreess
    ) ERC721(_symbol, _name) {
        creatorAddress = _creatorsAdreess;
        merkleRoot = _merkleRoot;
        setBaseURI(baseURI);
    }

    modifier notSoldOut {
        require(mummiesMinted() <= MAX_MUMMIES, "Soldout!");
        _;
    }

    modifier whitelistSaleIsOpen {
        require(mummiesMinted() <= MAX_MUMMIES, "Soldout!");
        require(WHITELIST_SALE, "Whitelist sales not open");
        _;
    }

    modifier publicSaleIsOpen {
        require(mummiesMinted() <= MAX_MUMMIES, "Soldout!");
        require(PUBLIC_SALE, "Public sales not open");
        _;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function mummiesMinted() public view returns (uint256) {
        return totalSupply();
    }

    function whitelistMint(bytes32[] calldata _merkleProof) public payable whitelistSaleIsOpen {
        address _to = msg.sender;

        // Verify not minted yet
        require(!saleClaimed[_to], "Already minted");
        // Verify there's enough money sent
        require(msg.value >= PRICE, "Value below price");

        // Verify whitelisted address with MerkleProof
        bytes32 leaf = keccak256(abi.encodePacked(_to));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Not whitelisted");

        // Mint
        saleClaimed[_to] = true;
        _mintAnMummy(_to, mummiesMinted());
    }

    function publicMint() public payable publicSaleIsOpen {
        address _to = msg.sender;

        // Verify not minted yet
        require(!saleClaimed[_to], "Already minted");
        // Verify there's enough money sent
        require(msg.value >= PRICE, "Value below price");

        // Mint
        saleClaimed[_to] = true;
        _mintAnMummy(_to, mummiesMinted());
    }

    // Only OWNER

    function giveawayMint(address _to) public onlyOwner notSoldOut {
        saleClaimed[_to] = true; 
        _mintAnMummy(_to, mummiesMinted());
    }

    function setWhitelistSale(bool _b) public onlyOwner {
        WHITELIST_SALE = _b;
        emit WhitelistSaleEvent(_b);
    }

    function setPublicSale(bool _b) public onlyOwner {
        PUBLIC_SALE = _b;
        emit PublicSaleEvent(_b);
    }

    function withdrawAll() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        _widthdraw(creatorAddress, address(this).balance);
    }

    // PRIVATE

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function _mintAnMummy(address _to, uint256 _mummyId) private {
        _safeMint(_to, _mummyId);

        emit MummyMinted(_mummyId, _to);
    }


}
