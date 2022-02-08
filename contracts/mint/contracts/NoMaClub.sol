// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import '@openzeppelin/contracts/security/Pausable.sol';
import "./ERC721A.sol";

// TODO: Make Burnable + use Counter
contract NoMaClub is ERC721A, IERC2981, ReentrancyGuard, Ownable, Pausable  {
    using Counters for Counters.Counter;

    // Constants
    uint256 public constant MAX_MUMMIES = 8192;
    uint256 public constant MAX_WHITELISTED_MINTS = 3000;
    uint256 public constant MINT_LIMIT_PER_WALLET = 3;
    uint256 public constant ROYALTY_RATE = 1000; // 10%

    uint256 public constant WHITELIST_PRICE = 0.04096 ether;
    uint256 public constant PUBLIC_PRICE = 0.08192 ether;

    // Constructur set constants
    bytes32 internal merkleRoot;
    string public baseTokenURI;

    // Switches
    bool internal IS_WHITELIST_SALE_OPEN = false;
    bool internal IS_PUBLIC_SALE_OPEN = false;

    Counters.Counter private whitelistedMummyCounter;

    event WhitelistSaleEvent(bool pause);
    event PublicSaleEvent(bool pause);

    constructor(
        string memory _symbol,
        string memory _name,
        string memory baseURI,
        bytes32 _merkleRoot
    ) ERC721A(_symbol, _name, MINT_LIMIT_PER_WALLET, MAX_MUMMIES) {
        merkleRoot = _merkleRoot;
        setBaseURI(baseURI);
    }

    modifier notSoldOut() {
        require(totalSupply() <= MAX_MUMMIES, "Soldout!");
        _;
    }

    modifier whitelistSaleIsOpen() {
        require(IS_WHITELIST_SALE_OPEN, "Whitelist sales not open");
        require(whitelistedMummiesMinted() <= MAX_WHITELISTED_MINTS, "Whitelist soldout!");
        require(totalSupply() <= MAX_MUMMIES, "Soldout!");
        _;
    }

    modifier publicSaleIsOpen() {
        require(IS_PUBLIC_SALE_OPEN, "Public sales not open");
        require(totalSupply() <= MAX_MUMMIES, "Soldout!");
        _;
    }

   modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
   }

    function whitelistedMummiesMinted() public view returns (uint256) {
        return whitelistedMummyCounter.current();
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function whitelistMint(bytes32[] calldata _merkleProof, uint256 count)
        public
        payable
        nonReentrant
        callerIsUser
        whitelistSaleIsOpen
        whenNotPaused
    {
        address _to = msg.sender;

        // Verify there's enough money sent
        require(msg.value >= WHITELIST_PRICE * count, "Insufficient payment per item");

        // Verify whitelisted address with MerkleProof
        bytes32 leaf = keccak256(abi.encodePacked(_to));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Not whitelisted"
        );

        require(whitelistedMummiesMinted() + count <= MAX_WHITELISTED_MINTS, "Too many");

        // Mint
        for (uint256 i = 0; i < count; i++) {
            whitelistedMummyCounter.increment();
        }
        _mintMummy(_to, count);
    }

    function publicMint(uint256 count) public payable callerIsUser publicSaleIsOpen whenNotPaused {
        address _to = msg.sender;

        // Verify there's enough money sent
        require(msg.value >= PUBLIC_PRICE * count, "Insufficient payment per item");

        // Mint
        _mintMummy(_to, count);
    }

    // Only OWNER

    function giveawayMint(address _to, uint256 _quantity) public onlyOwner notSoldOut {
        _mintMummy(_to, _quantity);
    }

    function setWhitelistSale(bool _b) public onlyOwner {
        IS_WHITELIST_SALE_OPEN = _b;
        emit WhitelistSaleEvent(_b);
    }

    function setPublicSale(bool _b) public onlyOwner {
        IS_PUBLIC_SALE_OPEN = _b;
        emit PublicSaleEvent(_b);
    }

    function widthdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        Address.sendValue(payable(owner()), balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function burn(uint256 tokenId) whenNotPaused public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
    }

    // ROYALTIES

    function royaltyInfo(uint256, uint256 salePrice) external view override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (address(this), (salePrice * ROYALTY_RATE) / 10000);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A, IERC165)
        returns (bool)
    {
        return (
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId)
        );
    }

    // PRIVATE

    function _mintMummy(address _to, uint256 _quantity) private {
        _safeMint(_to, _quantity);
    }
}
