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
import "hardhat/console.sol";

contract NoMaGuild is ERC721A, ERC721ABurnable, IERC2981, ReentrancyGuard, Ownable, Pausable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    // Contract immutables
    uint256 public immutable maxMummies;
    uint256 public immutable maxWhitelist;
    uint256 public immutable mintLimitPerWallet;

    // Constants
    uint256 public constant ROYALTY_RATE = 2; // 2%
    uint256 public constant WHITELIST_PRICE = 0.04096 ether;
    uint256 public constant PUBLIC_PRICE = 0.08192 ether;

    // Constructur set constants
    bytes32 internal merkleRoot;
    string public baseTokenURI;
    string public hiddenTokenURI;

    // Switches
    bool public isWhitelistSaleOpen = false;
    bool public isPublicSaleOpen = false;

    // Set refunding start datetime to creation time
    uint256 public refundStartTime = block.timestamp;

    // Whitelist claims
    mapping(uint256 => bool) internal _whitelistClaims;
    Counters.Counter private whitelistedMummyCounter;

    // Loans
    mapping (address => uint256) public totalLoanedPerAddress;
    mapping (uint256 => address) public tokenOwnersOnLoan;
    uint256 private currentLoanIndex = 0;
    bool public areLoansPaused = true;

    // Events
    event WhitelistSaleEvent(bool pause);
    event PublicSaleEvent(bool pause);
    event LoansOpenEvent(bool pause);
    event Loan(address indexed from, address indexed to, uint value);
    event LoanRetrieved(address indexed from, address indexed to, uint value);

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
    error RefundGuaranteeExpired();
    error RefundGuaranteeStillActive();
    error MustOwnToken();
    error IdenticalState();
    error LoansPaused();
    error CantTransferTokenOnLoan();
    error AlreadyLoaned();
    error NoLoansToZeroAddress();
    error CantRetriveLoanToYourself();
    error CantRetriveLoanOfOtherOwner();

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
        if (!isWhitelistSaleOpen) revert WhitelistSaleNotOpen();
        if (whitelistedMummiesMinted() >= maxWhitelist) revert WhitelistSoldout();
        _;
    }

    modifier publicSaleIsOpen() {
        if (!isPublicSaleOpen) revert PublicSaleClosed();
        if (totalSupply() >= maxMummies) revert Soldout();
        _;
    }

    function whitelistedMummiesMinted() public view returns (uint256) {
        return whitelistedMummyCounter.current();
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

    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) internal whenNotPaused override(ERC721A) {
        super._beforeTokenTransfers(from, to, tokenId, quantity);

        // Note: Non-existent key will have default value of address(0)
        if (tokenOwnersOnLoan[tokenId] != address(0)) revert CantTransferTokenOnLoan();
    }

    function loan(uint256 tokenId, address receiver) external nonReentrant {
        if (areLoansPaused) revert LoansPaused();
        if (ownerOf(tokenId) != msg.sender) revert MustOwnToken();
        if (receiver == address(0)) revert NoLoansToZeroAddress();
        if (tokenOwnersOnLoan[tokenId] != address(0)) revert AlreadyLoaned();

        // Transfer the token
        safeTransferFrom(msg.sender, receiver, tokenId);

        // Add it to the mapping of originally loaned tokens
        tokenOwnersOnLoan[tokenId] = msg.sender;

        // Add to the owner's loan balance
        uint256 loansByAddress = totalLoanedPerAddress[msg.sender];
        totalLoanedPerAddress[msg.sender] = loansByAddress + 1;
        currentLoanIndex = currentLoanIndex + 1;

        emit Loan(msg.sender, receiver, tokenId);
    }

    function retrieveLoan(uint256 tokenId) external nonReentrant {
        address borrowerAddress = ownerOf(tokenId);

        if (borrowerAddress == msg.sender) revert CantRetriveLoanToYourself();
        if (tokenOwnersOnLoan[tokenId] != msg.sender) revert CantRetriveLoanOfOtherOwner();

        // Remove it from the array of loaned out tokens
        delete tokenOwnersOnLoan[tokenId];

        // Subtract from the owner's loan balance
        uint256 loansByAddress = totalLoanedPerAddress[msg.sender];
        totalLoanedPerAddress[msg.sender] = loansByAddress - 1;
        currentLoanIndex = currentLoanIndex - 1;
        
        // Transfer the token back
        safeTransferFrom(borrowerAddress, msg.sender, tokenId);

        emit LoanRetrieved(borrowerAddress, msg.sender, tokenId);
    }

    function totalLoaned() external view returns (uint256) {
        return currentLoanIndex;
    }

    function loanedBalanceOf(address owner) public view returns (uint256) {
        if (owner == address(0)) revert BalanceQueryForZeroAddress();
        return totalLoanedPerAddress[owner];
    }

    function loanedTokensByAddress(address owner) external view returns (uint256[] memory) {
        if (owner == address(0)) revert BalanceQueryForZeroAddress();

        uint256 totalTokensLoaned = loanedBalanceOf(owner);
        uint256 mintedSoFar = totalSupply();
        uint256 tokenIdsIdx = 0;

        uint256[] memory allTokenIds = new uint256[](totalTokensLoaned);
        for (uint256 i = 0; i < mintedSoFar && tokenIdsIdx != totalTokensLoaned; i++) {
            if (tokenOwnersOnLoan[i] == owner) {
                allTokenIds[tokenIdsIdx] = i;
                tokenIdsIdx++;
            }
        }

        return allTokenIds;
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1; // Start the collection at 1 not 0
    }

    function refundGuaranteeActive() public view returns (bool) {
        // + 60 days in milliseconds
        return (block.timestamp < (refundStartTime + 60 * 24 * 60 * 60 * 1000));
    }

    function refund(uint256 _tokenId) external nonReentrant {
        if (!refundGuaranteeActive()) revert RefundGuaranteeExpired();
        if (ownerOf(_tokenId) != msg.sender) revert MustOwnToken();

        // Transfer token to owner
        safeTransferFrom(msg.sender, owner(), _tokenId);

        // Determine whitelist or public price
        uint256 price = WHITELIST_PRICE;
        if (!_whitelistClaims[_tokenId]) {
            price = PUBLIC_PRICE;
        }

        // Refund the token owner 100% of the mint price.
        payable(msg.sender).transfer(price);
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
        if (whitelistedMummiesMinted() + _quantity > maxWhitelist) revert ExceededWhitelistSupply();
        if (msg.value < WHITELIST_PRICE * _quantity) revert InsufficientPaymentPerItem();

        // Verify whitelisted address with MerkleProof
        bytes32 leaf = keccak256(abi.encodePacked(_to));
        if (!MerkleProof.verify(_merkleProof, merkleRoot, leaf)) revert NotWhitelisted();

        // Whitelist mint should note the whitelisted token and increment whitelisted counter
        for (uint256 i = _currentIndex; i < _currentIndex + _quantity; i++) {
            _whitelistClaims[i] = true;
            whitelistedMummyCounter.increment();
        }

        // Mint
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

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function setHiddenURI(string memory hiddenURI) public onlyOwner {
        hiddenTokenURI = hiddenURI;
    }

    function setLoansPaused(bool _b) public onlyOwner {
        if (areLoansPaused == _b) revert IdenticalState();
        areLoansPaused = _b;
        emit LoansOpenEvent(_b);
    }

    function setWhitelistSale(bool _b) external onlyOwner {
        if (isWhitelistSaleOpen == _b) revert IdenticalState();
        isWhitelistSaleOpen = _b;
        emit WhitelistSaleEvent(_b);
    }

    function setPublicSale(bool _b) external onlyOwner {
        if (isPublicSaleOpen == _b) revert IdenticalState();
        isPublicSaleOpen = _b;
        emit PublicSaleEvent(_b);
    }

    function widthdraw() external onlyOwner {
        uint256 balance = address(this).balance;

        if (balance <= 0) revert NonZeroWitdraw();
        if (refundGuaranteeActive()) revert RefundGuaranteeStillActive();

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
