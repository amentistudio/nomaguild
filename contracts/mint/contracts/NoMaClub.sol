// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";

// TODO: Make Burnable + use Counter
contract NoMaClub is ERC721, IERC2981, ReentrancyGuard, Ownable  {
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

    // Maps
    mapping(address => uint256) public saleClaimed;

    // Switches
    bool internal IS_WHITELIST_SALE_OPEN = false;
    bool internal IS_PUBLIC_SALE_OPEN = false;

    Counters.Counter private mummyCounter;
    Counters.Counter private whitelistedMummyCounter;


    event WhitelistSaleEvent(bool pause);
    event PublicSaleEvent(bool pause);
    event MummyMinted(uint256 indexed id, address _to);

    constructor(
        string memory _symbol,
        string memory _name,
        string memory baseURI,
        bytes32 _merkleRoot
    ) ERC721(_symbol, _name) {
        merkleRoot = _merkleRoot;
        setBaseURI(baseURI);
    }

    modifier notSoldOut() {
        require(mummiesMinted() <= MAX_MUMMIES, "Soldout!");
        _;
    }

    modifier whitelistSaleIsOpen() {
        require(IS_WHITELIST_SALE_OPEN, "Whitelist sales not open");
        require(whitelistedMummiesMinted() <= MAX_WHITELISTED_MINTS, "Whitelist soldout!");
        require(mummiesMinted() <= MAX_MUMMIES, "Soldout!");
        _;
    }

    modifier publicSaleIsOpen() {
        require(IS_PUBLIC_SALE_OPEN, "Public sales not open");
        require(mummiesMinted() <= MAX_MUMMIES, "Soldout!");
        _;
    }

    function whitelistedMummiesMinted() public view returns (uint256) {
        return whitelistedMummyCounter.current();
    }

    function mummiesMinted() public view returns (uint256) {
        return mummyCounter.current();
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function allowedMintCount(address _to) public view returns (uint256) {
        return MINT_LIMIT_PER_WALLET - saleClaimed[_to];
    }

    function updateAllowedMintCount(address _to, uint256 count) private {
        saleClaimed[_to] += count;
    }

    function whitelistMint(bytes32[] calldata _merkleProof, uint256 count)
        public
        payable
        nonReentrant
        whitelistSaleIsOpen
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

        // Check allowance
        if (allowedMintCount(_to) >= count) {
            updateAllowedMintCount(_to, count);
        } else {
            revert("Minting limit exceeded");
        }

        // Mint
        for (uint256 i = 0; i < count; i++) {
            whitelistedMummyCounter.increment();
            mummyCounter.increment();
            _mintMummy(_to, mummiesMinted());
        }
    }

    function publicMint(uint256 count) public payable publicSaleIsOpen {
        address _to = msg.sender;

        // Verify there's enough money sent
        require(msg.value >= PUBLIC_PRICE * count, "Insufficient payment per item");

        // Check allowance
        if (allowedMintCount(_to) >= count) {
            updateAllowedMintCount(_to, count);
        } else {
            revert("Minting limit exceeded");
        }

        // Mint
        for (uint256 i = 0; i < count; i++) {
            mummyCounter.increment();
            _mintMummy(_to, mummiesMinted());
        }
    }

    // Only OWNER

    function giveawayMint(address _to) public onlyOwner notSoldOut {
        updateAllowedMintCount(_to, 1);
        mummyCounter.increment();
        _mintMummy(_to, mummiesMinted());
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
        override(ERC721, IERC165)
        returns (bool)
    {
        return (
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId)
        );
    }

    // PRIVATE

    function _mintMummy(address _to, uint256 _mummyId) private {
        _safeMint(_to, _mummyId);

        emit MummyMinted(_mummyId, _to);
    }
}
