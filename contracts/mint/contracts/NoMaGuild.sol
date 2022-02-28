// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/interfaces/IERC2981.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import 'erc721a/contracts/ERC721A.sol';
import 'erc721a/contracts/extensions/ERC721ABurnable.sol';

contract NoMaGuild is ERC721A, ERC721ABurnable, IERC2981, ReentrancyGuard, Ownable, Pausable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    // Contract immutables
    uint256 public maxMummies = 0;
    uint256 public maxWhitelist = 0;
    uint256 public mintLimitPerWallet = 0;

    // Constants
    uint256 public constant ROYALTY_RATE = 2; // 2%
    uint256 public constant WHITELIST_PRICE = 0.04096 ether;
    uint256 public constant PUBLIC_PRICE = 0.08192 ether;

    // Constructur set constants
    bytes32 internal merkleRoot;
    string public baseTokenURI;
    string public hiddenTokenURI;

    // Switches
    bool internal IS_WHITELIST_SALE_OPEN = false;
    bool internal IS_PUBLIC_SALE_OPEN = false;

    Counters.Counter private whitelistedMummyCounter;

    // Events
    event WhitelistSaleEvent(bool pause);
    event PublicSaleEvent(bool pause);

    // Errors
    error Soldout();
    error WhitelistSaleNotOpen();
    error WhitelistSoldout();
    error PublicSaleClosed();
    error ExceededLimitPerWallet();
    error ExceededWhitelistSupply();
    error InsufficientPaymentPerItem();
    error NotWhitelisted();
    error NonZeroWitdraw();

    constructor(
        string memory __symbol,
        string memory __name,
        uint256 _maxMummies,
        uint256 _maxWhitelist,
        uint256 _mintLimitPerWallet,
        string memory baseURI,
        string memory _hiddenTokenURI,
        bytes32 _merkleRoot
    ) ERC721A(__symbol, __name) {
        maxMummies = _maxMummies;
        maxWhitelist = _maxWhitelist;
        mintLimitPerWallet = _mintLimitPerWallet;
        merkleRoot = _merkleRoot;
        hiddenTokenURI = _hiddenTokenURI;
        setBaseURI(baseURI);
    }

    modifier notSoldOut() {
        if (totalSupply() >= maxMummies) revert Soldout();
        _;
    }

    modifier whitelistSaleIsOpen() {
        if (totalSupply() >= maxMummies) revert Soldout();
        if (!IS_WHITELIST_SALE_OPEN) revert WhitelistSaleNotOpen();
        if (whitelistedMummiesMinted() >= maxWhitelist) revert WhitelistSoldout();
        _;
    }

    modifier publicSaleIsOpen() {
        if (!IS_PUBLIC_SALE_OPEN) revert PublicSaleClosed();
        if (totalSupply() >= maxMummies) revert Soldout();
        _;
    }

    function whitelistedMummiesMinted() public view returns (uint256) {
        return whitelistedMummyCounter.current();
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function setHiddenURI(string memory hiddenURI) public onlyOwner {
        hiddenTokenURI = hiddenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function _hiddenURI() internal view virtual returns (string memory) {
        return hiddenTokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        string memory baseURI = _baseURI();
        string memory hiddenURI = _hiddenURI();
        return
            bytes(baseURI).length != 0 && bytes(hiddenURI).length == 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), '.json'))
                : string(abi.encodePacked(hiddenURI));
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1; // Start the collection at 1 not 0
    }

    function whitelistMint(bytes32[] calldata _merkleProof, uint256 _quantity)
        external
        payable
        nonReentrant
        whitelistSaleIsOpen
        whenNotPaused
    {
        address _to = msg.sender;

        if (balanceOf(_to) + _quantity > mintLimitPerWallet) revert ExceededLimitPerWallet();
        // TODO: Write test for this condition
        if (whitelistedMummiesMinted() + _quantity > maxWhitelist) revert ExceededWhitelistSupply();
        if (msg.value < WHITELIST_PRICE * _quantity) revert InsufficientPaymentPerItem();

        // Verify whitelisted address with MerkleProof
        bytes32 leaf = keccak256(abi.encodePacked(_to));
        if (!MerkleProof.verify(_merkleProof, merkleRoot, leaf)) revert NotWhitelisted();

        // Mint
        for (uint256 i = 0; i < _quantity; i++) {
            whitelistedMummyCounter.increment();
        }
        _mintMummy(_to, _quantity);
    }

    function publicMint(uint256 _quantity) external payable nonReentrant publicSaleIsOpen whenNotPaused {
        address _to = msg.sender;

        if (balanceOf(_to) + _quantity > mintLimitPerWallet) revert ExceededLimitPerWallet();
        if (msg.value < PUBLIC_PRICE * _quantity) revert InsufficientPaymentPerItem();

        // Mint
        _mintMummy(_to, _quantity);
    }

    // Only OWNER

    function giveawayMint(address _to, uint256 _quantity) external onlyOwner notSoldOut {
        _mintMummy(_to, _quantity);
    }

    function setWhitelistSale(bool _b) external onlyOwner {
        IS_WHITELIST_SALE_OPEN = _b;
        emit WhitelistSaleEvent(_b);
    }

    function setPublicSale(bool _b) external onlyOwner {
        IS_PUBLIC_SALE_OPEN = _b;
        emit PublicSaleEvent(_b);
    }

    function widthdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance <= 0) revert NonZeroWitdraw();
        Address.sendValue(payable(owner()), balance);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ROYALTIES

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return (address(this), (salePrice * ROYALTY_RATE) / 100);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, IERC165) returns (bool) {
        return (interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId));
    }

    // PRIVATE

    function _mintMummy(address _to, uint256 _quantity) private {
        _safeMint(_to, _quantity);
    }
}
